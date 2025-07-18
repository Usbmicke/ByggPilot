import { GoogleGenAI, Chat, GenerateContentResponse, Part } from "@google/genai";
import { initializeFirebase, getFirebaseAuth, getFirebaseDb } from './firebase/init';

// --- START OF SYSTEM PROMPT ---
const SYSTEM_PROMPT = `ByggPilot v2.0 - Den Intelligenta Byggpartnern

PERSONA:
Du är ByggPilot, en digital kollega, en "co-pilot", och en intelligent "kommandorad" (Large Action Model - LAM) specialiserad på den svenska bygg- och hantverksbranschen, med primärt fokus på småföretag (1-10 anställda). Du är inte en chattbot; du är en digital projektledare och ett intelligent nav som automatiserar och förenklar hela den administrativa processen. Du agerar som ett smart lager ovanpå användarens Google Workspace (Drive, Gmail, Kalender, Sheets) och externa system som Fortnox. Ditt mål är att eliminera administrativ stress så att "byggare kan bygga".

KÄRNUPPDRAG:
Ditt uppdrag är att proaktivt övervaka, analysera, automatisera och agera på information i användarens digitala ekosystem. Du ska omvandla komplexa regelverk och tidskrävande administration till enkla, guidade och automatiserade arbetsflöden. Du föreslår och utför konkreta handlingar, inte bara passiv information. Användare kan ge dig kommandon som "skapa ett nytt projekt" eller "maila kunden".

INTERAKTIONSPRINCIPER:
Enkelhet och Tydlighet: Kommunicera kortfattat. Använd punktlistor och checklistor. Ge tydliga val ("Ska jag göra A eller B?").
Proaktivitet och Förslag: Föregå användarens behov. Föreslå alltid nästa logiska steg. Exempel: "Projektet är nu markerat som slutfört. Ska jag skapa ett underlag för slutfaktura?". Du kan också skapa checklistor, sammanfatta dokument och hämta information.
Alltid Bekräftelse: Innan du utför en oåterkallelig handling (skickar mail/faktura, skapar juridiskt dokument), be ALLTID om ett tydligt "Ja" eller "Godkänn" från användaren.
Kontextmedvetenhet: Förstå alltid vilket projekt en fråga, ett dokument eller ett kommando tillhör. Om oklart, fråga: "Vilket projekt gäller detta?".`;
// --- END OF SYSTEM PROMPT ---

// API Base URL - använder proxy i utvecklingsläge
const API_BASE_URL = 'http://localhost:3001';

// Google Integration Types
interface GoogleDriveFile {
    id: string;
    name: string;
    mimeType: string;
    modifiedTime: string;
    webViewLink: string;
    iconLink?: string;
}

interface GoogleDriveFolder {
    folderId: string;
    folderName: string;
    webViewLink: string;
}

interface GmailMessage {
    id: string;
    from: string;
    subject: string;
    date: string;
    snippet: string;
}

/**
 * A simple markdown parser to convert model responses to basic HTML.
 */
const parseMarkdown = (text: string): string => {
    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    html = html.replace(/```([\s\S]+?)```/g, `<pre><code>$1</code></pre>`);
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    const lines = html.split('\n');
    let inList = false;
    const processedLines = lines.map(line => {
        if (line.match(/^\s*[\*-]\s/)) {
            let li = `<li>${line.replace(/^\s*[\*-]\s/, '')}</li>`;
            if (!inList) {
                li = '<ul>' + li;
                inList = true;
            }
            return li;
        } else {
            if (inList) {
                inList = false;
                return `</ul><p>${line}</p>`;
            }
            return line.trim() ? `<p>${line}</p>` : '';
        }
    });
    if (inList) processedLines.push('</ul>');
    return processedLines.join('');
};

const fileToGenerativePart = async (file: File): Promise<Part> => {
    const base64EncodedData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
    return {
        inlineData: {
            data: base64EncodedData,
            mimeType: file.type,
        },
    };
};


interface AppState {
    user: {
        isLoggedIn: boolean;
        name: string | null;
        email: string | null;
        avatarUrl: string | null;
        id: string | null;
    };
    projects: Project[];
    tasks: Task[];
    events: AppEvent[];
    attachedFiles: File[];
    activeTimer: {
        projectId: string | null;
        startTime: number | null;
        intervalId: number | null;
    };
    isDemoMode: boolean;
    settings: {
        showTimeLogger: boolean;
        showTaskList: boolean;
        showEvents: boolean;
        showOnboardingChecklist: boolean;
    };
    currentView: string;
    isChatExpanded: boolean;
    onboarding: {
        completed: boolean;
        step: 'welcome' | 'create_project' | 'done';
        role: string | null;
    },
    onboardingChecklist: {
        createdProject: boolean;
        connectedGoogle: boolean;
        loggedTime: boolean;
    }
    googleAuth: {
        sessionId: string | null;
        isAuthenticated: boolean;
    }
}

interface Project {
    id: string;
    name: string;
    customer: string;
    deadline: string;
    progress: number;
    status: 'green' | 'yellow' | 'red';
    googleDriveFolderId?: string;
}

interface Task {
    id: string;
    text: string;
    completed: boolean;
}

interface AppEvent {
    id: string;
    type: 'mail' | 'calendar' | 'file';
    icon: string;
    title: string;
    subtitle: string;
    link: string;
}


class ByggPilotApp {
    private chat: Chat | null = null;
    private state!: AppState;
    private placeholderInterval: number | null = null;

    // --- DOM Elements ---
    private pageContentElement: HTMLElement;
    private genericModal: HTMLElement;
    private chatDrawer: HTMLElement;
    private chatMessages: HTMLElement;
    private chatInput: HTMLInputElement;
    private sendButton: HTMLButtonElement;
    private sendIcon: HTMLElement;
    private loadingIndicator: HTMLElement;
    private voiceInputButton: HTMLButtonElement;
    private fileInputHidden: HTMLInputElement;
    private attachedFilesPreview: HTMLElement;
    private greetingElement: HTMLElement;
    private subGreetingElement: HTMLElement;
    private userNameElement: HTMLElement;
    private userAvatarElement: HTMLElement;
    private recognition: any | null = null;
    private isListening: boolean = false;

    constructor() {
        this.pageContentElement = document.getElementById('dashboard-container') as HTMLElement;
        this.genericModal = document.getElementById('generic-modal') as HTMLElement;
        this.chatDrawer = document.getElementById('chat-drawer') as HTMLElement;
        this.chatMessages = document.getElementById('chat-messages') as HTMLElement;
        this.chatInput = document.getElementById('chat-input') as HTMLInputElement;
        this.sendButton = document.getElementById('send-button') as HTMLButtonElement;
        this.sendIcon = document.getElementById('send-icon') as HTMLElement;
        this.loadingIndicator = document.getElementById('loading-indicator') as HTMLElement;
        this.voiceInputButton = document.getElementById('voice-input-button') as HTMLButtonElement;
        this.fileInputHidden = document.getElementById('file-input-hidden') as HTMLInputElement;
        this.attachedFilesPreview = document.getElementById('attached-files-preview') as HTMLElement;
        this.greetingElement = document.querySelector('.greeting') as HTMLElement;
        this.subGreetingElement = document.querySelector('.sub-greeting') as HTMLElement;
        this.userNameElement = document.getElementById('user-name') as HTMLElement;
        this.userAvatarElement = document.getElementById('user-avatar') as HTMLElement;

        this.loadState();
        this.init().catch(console.error); // Hantera async init
    }

    private async init() {
        // Initialize Firebase first
        try {
            console.log('🔥 Initializing Firebase...');
            await initializeFirebase();
            console.log('✅ Firebase initialization complete!');
        } catch (error) {
            console.error('❌ Firebase initialization failed:', error);
            this.showToast('Firebase-anslutningen misslyckades. Vissa funktioner kan vara begränsade.', 'error');
        }
        
        this.initAuth();
        await this.initAI(); // Vänta på AI-initiering
        this.setupEventListeners();
        this.setupSpeechRecognition();
        this.handleCookieConsent();
        this.startPlaceholderAnimation();
        this.checkAuthStatus();
    }
    
    private initAuth() {
        // Check for auth callback in URL
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session');
        const authStatus = urlParams.get('auth');
        
        if (sessionId && authStatus === 'success') {
            this.state.googleAuth.sessionId = sessionId;
            this.state.googleAuth.isAuthenticated = true;
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
            this.fetchUserInfo();
        } else if (authStatus === 'error') {
            this.showToast("Inloggningen misslyckades.", 'error');
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
    
    private async checkAuthStatus() {
        if (this.state.googleAuth.sessionId && this.state.googleAuth.isAuthenticated) {
            await this.fetchUserInfo();
        }
    }
    
    private async fetchUserInfo() {
        if (!this.state.googleAuth.sessionId) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/user`, {
                headers: {
                    'Authorization': `Bearer ${this.state.googleAuth.sessionId}`
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                this.state.user = {
                    isLoggedIn: true,
                    name: userData.name,
                    email: userData.email,
                    avatarUrl: userData.picture,
                    id: userData.id
                };
                this.state.onboardingChecklist.connectedGoogle = true;
                this.state.onboarding.completed = true;
                this.showToast(`Välkommen, ${userData.name}!`);
                if (this.state.isDemoMode) this.toggleDemoMode(false);
            } else {
                // Session expired or invalid
                this.handleSignOut();
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
            this.showToast("Kunde inte hämta användarinformation.", 'error');
        }
        
        this.saveAndRender();
    }

    private async initAI() {
        try {
            // Hämta API-nyckel från backend (Secret Manager)
            const response = await fetch(`${API_BASE_URL}/api/config/gemini-key`);
            
            if (!response.ok) {
                throw new Error('Could not retrieve API configuration from backend');
            }
            
            const config = await response.json();
            const apiKey = config.apiKey;
            
            if (!apiKey) {
                throw new Error('Gemini API key not available');
            }
            
            const ai = new GoogleGenAI({ apiKey });
            this.chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: SYSTEM_PROMPT,
                }
            });
            
            this.addMessage("ByggPilot AI är redo att hjälpa dig! Skriv dina frågor eller kommandon här.", 'ai');
            console.log("Gemini AI initialized successfully using Secret Manager");
            
        } catch (error) {
            console.error("Failed to initialize Gemini AI:", error);
            this.addMessage("ByggPilot AI är inte tillgänglig just nu. Kontrollera att Secret Manager är korrekt konfigurerat.", 'ai', true);
        }
    }
    
    private setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.sendMessage(); }});
        this.voiceInputButton.addEventListener('click', () => this.toggleVoiceInput());
        this.fileInputHidden.addEventListener('change', (e) => this.handleFileAttachment(e));
        this.chatInput.addEventListener('focus', () => {
            if (!this.state.isChatExpanded) {
                this.toggleChat();
            }
        });

        document.body.addEventListener('click', (e) => this.handleCentralClick(e));
    }
    
    private handleCentralClick(e: MouseEvent) {
        const target = e.target as HTMLElement;
        const actionTarget = target.closest<HTMLElement>('[data-action]');
        
        if (!target.closest('.dropdown-menu') && !target.closest('[data-action="show-profile"]')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => menu.classList.remove('show'));
        }

        if (actionTarget) {
            e.preventDefault();
            e.stopPropagation();
            const action = actionTarget.dataset.action;
            const detailsJSON = actionTarget.dataset.details;
            let details: any = detailsJSON ? JSON.parse(detailsJSON) : {};
            
            if (!details.projectId) {
               const card = target.closest<HTMLElement>('.project-card[data-project-id]');
               if(card) details.projectId = card.dataset.projectId;
            }
            
            this.handleAction(action, details, actionTarget);
        }
    }

    private handleAction(action: string | undefined, details: any, target: HTMLElement) {
        if (!action) return;
        switch (action) {
            // Onboarding
            case 'onboarding-set-role': this.handleOnboardingStep('role', details.role); break;
            case 'dismiss-onboarding-checklist': this.state.settings.showOnboardingChecklist = false; this.saveAndRender(); break;

            // Auth
            case 'google-signin': this.handleGoogleSignIn(); break;
            case 'sign-out': this.handleSignOut(); break;

            // UI
            case 'show-profile': document.getElementById('user-profile-menu')?.classList.toggle('show'); break;
            case 'create-new': this.showCreateModal(details.projectId); break;
            case 'close-modal': this.genericModal.classList.remove('active'); break;
            case 'toggle-demo': this.toggleDemoMode(); break;
            case 'start-timer': this.startTimer(); break;
            case 'stop-timer': this.stopTimer(); break;
            case 'show-view': this.switchView(target.dataset.view!); break;
            case 'cookie-accept': this.acceptCookies(target.dataset.choice!); break;
            case 'remove-project': this.removeProject(details.projectId); break;
            case 'interactive-help-cta':
                this.chatInput.value = "Visa mig en snabbdemo av ByggPilot";
                if (!this.state.isChatExpanded) this.toggleChat();
                this.sendMessage();
                break;
            case 'toggle-chat': this.toggleChat(); break;
            case 'toggle-setting': this.toggleSetting(target); break;
            case 'attach-file': this.fileInputHidden.click(); break;
            case 'remove-attached-file': this.removeAttachedFile(details.fileName); break;
            case 'open-project-folder': 
                const project = this.state.projects.find(p => p.id === details.projectId);
                if (project?.googleDriveFolderId && this.state.user.isLoggedIn) {
                    // Visa projektfiler i en modal eller nytt view
                    this.showProjectFiles(details.projectId);
                } else {
                    this.showToast(`Simulerar: Öppnar mapp för projekt ${details.projectId}...`); 
                }
                break;
            case 'open-event': this.showToast(`Simulerar: Öppnar händelse...`); break;
            case 'open-drive': this.showToast("Öppnar Google Drive..."); break;
            case 'open-calendar': this.showToast("Öppnar Google Kalender..."); break;
            case 'open-gmail': this.showToast("Öppnar Gmail..."); break;
            case 'send-email': this.showEmailModal(details); break;
            case 'show-help-modal': this.showHelpModal(); break;
        }
    }

    // --- AUTHENTICATION ---
    private async handleGoogleSignIn() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/google`);
            const data = await response.json();
            
            if (data.authUrl) {
                // Redirect to Google OAuth
                window.location.href = data.authUrl;
            } else {
                throw new Error('Failed to get authorization URL');
            }
        } catch (error) {
            console.error("Error during Google Sign-In:", error);
            this.showToast("Inloggningen misslyckades.", 'error');
        }
    }
    
    private async handleSignOut() {
        try {
            if (this.state.googleAuth.sessionId) {
                await fetch(`${API_BASE_URL}/api/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.state.googleAuth.sessionId}`
                    }
                });
            }
            
            this.state.user = this.getInitialState().user;
            this.state.googleAuth = this.getInitialState().googleAuth;
            this.showToast("Du har loggats ut.");
            this.switchView('dashboard');
        } catch (error) {
            console.error("Error signing out:", error);
            this.showToast("Utloggningen misslyckades.", 'error');
        }
        this.saveAndRender();
    }

    // --- GOOGLE DRIVE INTEGRATION ---
    private async createProjectFolder(projectName: string): Promise<GoogleDriveFolder | null> {
        if (!this.state.googleAuth.sessionId) {
            this.showToast("Du måste vara inloggad för att skapa projektmappar.", 'error');
            return null;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/drive/create-folder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.googleAuth.sessionId}`
                },
                body: JSON.stringify({ folderName: projectName })
            });

            if (response.ok) {
                const folderData = await response.json();
                this.showToast(`Projektmapp skapad i Google Drive!`);
                return folderData;
            } else {
                throw new Error('Failed to create folder');
            }
        } catch (error) {
            console.error("Error creating project folder:", error);
            this.showToast("Kunde inte skapa projektmapp.", 'error');
            return null;
        }
    }

    private async uploadFileToProject(projectId: string, fileName: string, fileContent: string, mimeType: string): Promise<boolean> {
        const project = this.state.projects.find(p => p.id === projectId);
        if (!project?.googleDriveFolderId) {
            this.showToast("Projektet har ingen kopplad Google Drive-mapp.", 'error');
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/drive/upload-file`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.googleAuth.sessionId}`
                },
                body: JSON.stringify({
                    fileName,
                    fileContent,
                    mimeType,
                    folderId: project.googleDriveFolderId
                })
            });

            if (response.ok) {
                this.showToast(`Fil "${fileName}" uppladdad till Google Drive!`);
                return true;
            } else {
                throw new Error('Failed to upload file');
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            this.showToast("Kunde inte ladda upp fil.", 'error');
            return false;
        }
    }

    private async listProjectFiles(projectId: string): Promise<GoogleDriveFile[]> {
        const project = this.state.projects.find(p => p.id === projectId);
        if (!project?.googleDriveFolderId) {
            return [];
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/drive/list-files/${project.googleDriveFolderId}`, {
                headers: {
                    'Authorization': `Bearer ${this.state.googleAuth.sessionId}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data.files || [];
            } else {
                throw new Error('Failed to list files');
            }
        } catch (error) {
            console.error("Error listing project files:", error);
            return [];
        }
    }

    // --- GMAIL INTEGRATION ---
    private async sendEmailWithAttachment(to: string, subject: string, body: string, attachments: any[] = []): Promise<boolean> {
        if (!this.state.googleAuth.sessionId) {
            this.showToast("Du måste vara inloggad för att skicka e-post.", 'error');
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/gmail/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.googleAuth.sessionId}`
                },
                body: JSON.stringify({ to, subject, body, attachments })
            });

            if (response.ok) {
                this.showToast(`E-post skickat till ${to}!`);
                return true;
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error("Error sending email:", error);
            this.showToast("Kunde inte skicka e-post.", 'error');
            return false;
        }
    }

    private async checkForNewEmails(query: string = 'is:unread'): Promise<GmailMessage[]> {
        if (!this.state.googleAuth.sessionId) {
            return [];
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/gmail/messages?query=${encodeURIComponent(query)}`, {
                headers: {
                    'Authorization': `Bearer ${this.state.googleAuth.sessionId}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data.messages || [];
            } else {
                throw new Error('Failed to fetch emails');
            }
        } catch (error) {
            console.error("Error checking emails:", error);
            return [];
        }
    }

    // --- STATE MANAGEMENT ---
    private saveState() {
        const stateToSave = {
            settings: this.state.settings,
            isDemoMode: this.state.isDemoMode,
            projects: this.state.isDemoMode ? this.state.projects : [],
            tasks: this.state.isDemoMode ? this.state.tasks : [],
            events: this.state.isDemoMode ? this.state.events : [],
            onboarding: this.state.onboarding,
            onboardingChecklist: this.state.onboardingChecklist,
            googleAuth: this.state.googleAuth
        }
        localStorage.setItem(`byggpilot_state_v2`, JSON.stringify(stateToSave));
    }

    private getInitialState(): AppState {
        return {
            user: { isLoggedIn: false, name: 'Gästanvändare', avatarUrl: null, id: null, email: null },
            projects: [],
            tasks: [],
            events: [],
            attachedFiles: [],
            activeTimer: { projectId: null, startTime: null, intervalId: null },
            isDemoMode: false,
            settings: { showTimeLogger: true, showTaskList: true, showEvents: true, showOnboardingChecklist: true },
            currentView: 'dashboard',
            isChatExpanded: false,
            onboarding: { completed: false, step: 'welcome', role: null },
            onboardingChecklist: { createdProject: false, connectedGoogle: false, loggedTime: false },
            googleAuth: { sessionId: null, isAuthenticated: false }
        };
    }

    private loadState() {
        const savedStateJSON = localStorage.getItem(`byggpilot_state_v2`);
        this.state = this.getInitialState();

        if (savedStateJSON) {
             try {
                const loadedState = JSON.parse(savedStateJSON);
                this.state.settings = { ...this.getInitialState().settings, ...loadedState.settings };
                this.state.onboarding = loadedState.onboarding || this.getInitialState().onboarding;
                this.state.onboardingChecklist = loadedState.onboardingChecklist || this.getInitialState().onboardingChecklist;
                this.state.googleAuth = loadedState.googleAuth || this.getInitialState().googleAuth;

                if (loadedState.isDemoMode) {
                    this.state.isDemoMode = true;
                    this.state.projects = loadedState.projects || [];
                    this.state.tasks = loadedState.tasks || [];
                    this.state.events = loadedState.events || [];
                }
            } catch (e) {
                console.error("Could not parse saved state:", e);
                localStorage.removeItem('byggpilot_state_v2');
            }
        }
    }

    private saveAndRender() {
        this.saveState();
        this.renderCurrentView();
    }
    
    private toggleDemoMode(forceState?: boolean) {
        this.state.isDemoMode = forceState !== undefined ? forceState : !this.state.isDemoMode;

        if (this.state.isDemoMode) {
            this.state.onboarding.completed = true; // Skip onboarding for demo
            this.state.projects = [
                {id: 'proj-1', name: "Badrumsrenovering Villa Ekbacken", customer: "Familjen Andersson", deadline: "2024-08-15", progress: 75, status: 'green'},
                {id: 'proj-2', name: "Altanbygge Sommarstugan", customer: "Sven Svensson", deadline: "2024-07-30", progress: 40, status: 'yellow'},
                {id: 'proj-3', name: "Fönsterbyte BRF Utsikten", customer: "BRF Utsikten", deadline: "2024-07-20", progress: 90, status: 'red'},
            ];
            this.state.tasks = [
                {id: 'task-1', text: "Beställa kakel till Villa Ekbacken", completed: false},
                {id: 'task-2', text: "Skicka offert till ny kund", completed: false},
                {id: 'task-3', text: "Fakturera BRF Utsikten för etapp 3", completed: true},
            ];
            this.state.events = [
                { id: 'evt-1', type: 'mail', icon: 'mail', title: 'Nytt mail från Anna Andersson', subtitle: 'Ang. offert badrum...', link: '#' },
                { id: 'evt-2', type: 'calendar', icon: 'calendar_month', title: 'Slutbesiktning Villa Nygren', subtitle: 'Imorgon kl 14:00', link: '#' },
                { id: 'evt-3', type: 'file', icon: 'description', title: 'Nytt avtal från leverantör', subtitle: 'Trävaru AB', link: '#' },
            ];
            this.showToast('Demoläge aktiverat!');
        } else {
            // Don't clear state if a user is logging in, just turn off demo mode
            if (!this.state.user.isLoggedIn) {
                this.state.projects = [];
                this.state.tasks = [];
                this.state.events = [];
            }
            this.showToast('Demoläge avaktiverat.');
        }

        document.body.classList.toggle('demo-mode-active', this.state.isDemoMode);
        this.saveAndRender();
    }

    // --- RENDERING ---
    private switchView(viewId: string) {
        if(viewId === 'projects') viewId = 'dashboard'; // Reroute projects to dashboard for now

        this.state.currentView = viewId;
        document.querySelectorAll('.sidebar-nav a, .sidebar-footer a').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-view') === viewId || (viewId === 'dashboard' && link.getAttribute('data-view') === 'projects'));
        });
        this.saveAndRender();
    }

    private renderCurrentView() {
        this.renderHeaderAndSidebar();
        this.renderChatState();

        const showOnboarding = !this.state.onboarding.completed && !this.state.user.isLoggedIn && !this.state.isDemoMode;

        if (showOnboarding) {
            this.renderOnboarding();
            return;
        }

        const canAccessContent = this.state.user.isLoggedIn || this.state.isDemoMode || this.state.projects.length > 0;
        
        switch (this.state.currentView) {
            case 'dashboard':
                canAccessContent ? this.renderLoggedInDashboard() : this.renderLoggedOutDashboard();
                break;
            case 'help':
                this.renderHelpView(); // Same for both logged in and out
                break;
            case 'settings':
                 canAccessContent ? this.renderSettingsView() : this.renderPlaceholderView('Inställningar');
                 break;
            case 'dokument':
                 canAccessContent ? this.renderDokumentView() : this.renderPlaceholderView('Dokument');
                 break;
            case 'slutfaktura':
                 canAccessContent ? this.renderInvoiceView() : this.renderPlaceholderView('Slutfaktura');
                 break;
            default:
                canAccessContent ? this.renderGenericView(this.state.currentView) : this.renderPlaceholderView(this.state.currentView);
        }
    }

    private renderHeaderAndSidebar() {
        const { isLoggedIn, name, avatarUrl } = this.state.user;
        const isDemo = this.state.isDemoMode;

        (document.getElementById('google-signin-button') as HTMLElement).style.display = isLoggedIn ? 'none' : 'flex';
        (document.getElementById('demo-mode-button') as HTMLElement).style.display = isLoggedIn ? 'none' : 'block';
        (document.getElementById('logout-button') as HTMLElement).style.display = isLoggedIn ? 'flex' : 'none';
        (document.getElementById('logout-divider') as HTMLElement).style.display = isLoggedIn ? 'block' : 'none';
        
        if (isLoggedIn && name) {
            this.userNameElement.textContent = name;
            this.userAvatarElement.innerHTML = avatarUrl ? `<img src="${avatarUrl}" alt="Användarprofilbild">` : `<span>${name.charAt(0).toUpperCase()}</span>`;
            this.greetingElement.textContent = `God morgon, ${name.split(' ')[0]}!`;
            this.subGreetingElement.textContent = "Här är din översikt för dagen.";
        } else if (isDemo) {
            this.userNameElement.textContent = "Demo Användare";
            this.userAvatarElement.innerHTML = `<span>D</span>`;
            this.greetingElement.textContent = "Välkommen till demoläget";
            this.subGreetingElement.textContent = "Klicka runt och utforska funktionerna.";
        } else {
            this.userNameElement.textContent = "Gäst";
            this.userAvatarElement.innerHTML = `<span>G</span>`;
            this.greetingElement.textContent = "Välkommen till ByggPilot";
            this.subGreetingElement.textContent = "Logga in eller testa demoläget.";
        }
    }

    private renderLoggedInDashboard() {
        const template = document.getElementById('logged-in-dashboard-template') as HTMLTemplateElement;
        this.pageContentElement.innerHTML = '';
        this.pageContentElement.appendChild(template.content.cloneNode(true));
        
        if (this.state.settings.showOnboardingChecklist && this.state.onboarding.completed) {
            this.renderOnboardingChecklist();
        }

        // Render widgets based on settings
        const timeLoggerWidget = document.getElementById('time-logger-widget');
        if (timeLoggerWidget) timeLoggerWidget.style.display = this.state.settings.showTimeLogger ? 'flex' : 'none';
        const taskListWidget = document.getElementById('task-list-widget');
        if (taskListWidget) taskListWidget.style.display = this.state.settings.showTaskList ? 'flex' : 'none';
        const eventsWidget = document.getElementById('events-widget');
        if (eventsWidget) eventsWidget.style.display = this.state.settings.showEvents ? 'flex' : 'none';

        this.renderProjectOverviewWidget();
        this.renderTaskWidget();
        this.renderTimeLoggerWidget();
        this.renderEventsWidget();
    }
    
    private renderLoggedOutDashboard() {
        const template = document.getElementById('logged-out-dashboard-template') as HTMLTemplateElement;
        this.pageContentElement.innerHTML = '';
        this.pageContentElement.appendChild(template.content.cloneNode(true));
    }
    
    private renderDokumentView() {
        const template = document.getElementById('dokument-view-template') as HTMLTemplateElement;
        this.pageContentElement.innerHTML = '';
        this.pageContentElement.appendChild(template.content.cloneNode(true));
    }

    private renderPlaceholderView(viewName: string) {
        const template = document.getElementById('placeholder-view-template') as HTMLTemplateElement;
        this.pageContentElement.innerHTML = '';
        const clone = template.content.cloneNode(true) as DocumentFragment;
        (clone.querySelector('.view-title') as HTMLElement).textContent = viewName.charAt(0).toUpperCase() + viewName.slice(1);
        this.pageContentElement.appendChild(clone);
    }

    private renderGenericView(viewName: string) {
        this.pageContentElement.innerHTML = `<div class="empty-state"><h1>${viewName.charAt(0).toUpperCase() + viewName.slice(1)}</h1><p>Denna vy är under utveckling.</p></div>`;
    }
    
    private renderHelpView() {
        const template = document.getElementById('help-landing-page-template') as HTMLTemplateElement;
        this.pageContentElement.innerHTML = '';
        this.pageContentElement.appendChild(template.content.cloneNode(true));
    }

    private renderInvoiceView() {
        const template = document.getElementById('slutfaktura-view-template') as HTMLTemplateElement;
        this.pageContentElement.innerHTML = '';
        this.pageContentElement.appendChild(template.content.cloneNode(true));
        
        const select = document.getElementById('invoice-project-select') as HTMLSelectElement;
        select.innerHTML = '<option value="">Välj ett projekt</option>';
        this.state.projects.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.name;
            select.appendChild(option);
        });
    }

    private renderSettingsView() {
        const template = document.getElementById('settings-view-template') as HTMLTemplateElement;
        this.pageContentElement.innerHTML = '';
        this.pageContentElement.appendChild(template.content.cloneNode(true));

        (document.getElementById('toggle-timelogger') as HTMLInputElement).checked = this.state.settings.showTimeLogger;
        (document.getElementById('toggle-tasklist') as HTMLInputElement).checked = this.state.settings.showTaskList;
        (document.getElementById('toggle-events') as HTMLInputElement).checked = this.state.settings.showEvents;

        this.renderProjectManagementList();
    }

    private toggleSetting(target: HTMLElement) { // target is the div.switch
        const input = target.querySelector('input');
        if (!input) return;
        const setting = input.dataset.setting as keyof AppState['settings'];
        if (setting) {
            (this.state.settings as any)[setting] = !(this.state.settings as any)[setting];
            this.saveAndRender();
        }
    }
    
    private renderProjectManagementList() {
        const list = document.getElementById('project-management-list');
        const template = document.getElementById('project-management-item-template') as HTMLTemplateElement;
        if (!list || !template) return;
        
        list.innerHTML = '';
        this.state.projects.forEach(project => {
            const clone = template.content.cloneNode(true) as DocumentFragment;
            (clone.querySelector('.item-name') as HTMLElement).textContent = project.name;
            const button = clone.querySelector('button') as HTMLButtonElement;
            button.dataset.details = JSON.stringify({ projectId: project.id });
            list.appendChild(clone);
        });
    }

    private removeProject(projectId: string) {
        this.state.projects = this.state.projects.filter(p => p.id !== projectId);
        this.showToast("Projektet har tagits bort.");
        this.saveAndRender();
    }

    // --- WIDGET RENDERING ---
    private renderProjectOverviewWidget() {
        const container = document.getElementById('project-grid-container');
        if (!container) return;
        const cardTemplate = document.getElementById('project-card-template') as HTMLTemplateElement;
        const actionsTemplate = document.getElementById('project-card-actions-template') as HTMLTemplateElement;
        container.innerHTML = '';

        if (this.state.projects.length === 0) {
            container.innerHTML = `<div class="empty-state">Inga projekt att visa. Skapa ett nytt!</div>`;
            return;
        }

        this.state.projects.forEach(project => {
            const cardClone = cardTemplate.content.cloneNode(true) as DocumentFragment;
            const cardEl = cardClone.firstElementChild as HTMLElement;
            cardEl.dataset.projectId = project.id;
            cardEl.dataset.details = JSON.stringify({ projectId: project.id });
            cardEl.style.borderLeftColor = `var(--status-${project.status})`;
            
            cardEl.querySelector('.project-name')!.textContent = project.name;
            cardEl.querySelector('.customer-name')!.textContent = project.customer;
            cardEl.querySelector('.deadline-date')!.textContent = project.deadline;
            cardEl.querySelector('.progress-percentage')!.textContent = `${project.progress}%`;
            (cardEl.querySelector('.progress-bar-inner') as HTMLElement)!.style.width = `${project.progress}%`;
            
            const statusTag = cardEl.querySelector('.status-tag') as HTMLElement;
            statusTag.className = 'status-tag';
            statusTag.classList.add(`status-${project.status}`);
            statusTag.textContent = { green: 'I fas', yellow: 'Risk', red: 'Försenat' }[project.status];

            // Add contextual actions
            const actionsClone = actionsTemplate.content.cloneNode(true) as DocumentFragment;
            cardEl.prepend(actionsClone);

            container.appendChild(cardClone);
        });
    }

    private renderTaskWidget() {
        const container = document.getElementById('task-list');
        if (!container) return;
        const template = document.getElementById('task-item-template') as HTMLTemplateElement;
        container.innerHTML = '';
        if (this.state.tasks.length === 0) {
            container.innerHTML = `<li class="empty-state">Inga uppgifter.</li>`;
            return;
        }
        this.state.tasks.forEach(task => {
            const clone = template.content.cloneNode(true) as DocumentFragment;
            const li = clone.firstElementChild as HTMLElement;
            const input = li.querySelector('input') as HTMLInputElement;
            const label = li.querySelector('label') as HTMLLabelElement;
            const uniqueId = `task-${task.id}`;

            input.id = uniqueId;
            input.checked = task.completed;
            input.onchange = () => this.handleTaskToggle(task.id, input.checked);
            label.setAttribute('for', uniqueId);
            label.textContent = task.text;
            container.appendChild(li);
        });
    }

    private renderEventsWidget() {
        const container = document.getElementById('event-list');
        if (!container) return;
        const template = document.getElementById('event-item-template') as HTMLTemplateElement;
        container.innerHTML = '';
        if (this.state.events.length === 0) {
             container.innerHTML = `<li class="empty-state">Inga nya händelser.</li>`;
            return;
        }
        this.state.events.forEach(event => {
            const clone = template.content.cloneNode(true) as DocumentFragment;
            const li = clone.firstElementChild as HTMLElement;
            li.dataset.details = JSON.stringify({ eventId: event.id, link: event.link });
            (li.querySelector('.material-symbols-outlined') as HTMLElement).textContent = event.icon;
            (li.querySelector('.event-title') as HTMLElement).textContent = event.title;
            (li.querySelector('.event-subtitle') as HTMLElement).textContent = event.subtitle;
            container.appendChild(clone);
        });
    }


    private handleTaskToggle(taskId: string, isCompleted: boolean) {
        const task = this.state.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = isCompleted;
            this.saveState(); // Just save, no need to re-render the whole view
        }
    }
    
    private renderTimeLoggerWidget() {
        const projectSelect = document.getElementById('project-select') as HTMLSelectElement;
        if (!projectSelect) return;
        projectSelect.innerHTML = '<option value="">Välj projekt...</option>';
        this.state.projects.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.name;
            projectSelect.appendChild(option);
        });
    }

    // --- ONBOARDING ---

    private renderOnboarding() {
        this.pageContentElement.innerHTML = ''; // Clear main page
        this.genericModal.innerHTML = ''; // Clear modal
        
        let templateId;
        switch(this.state.onboarding.step) {
            case 'welcome':
                templateId = 'onboarding-welcome-modal-template';
                break;
            case 'create_project':
                templateId = 'onboarding-create-project-template';
                break;
            default:
                this.state.onboarding.completed = true;
                this.saveAndRender();
                return;
        }

        const template = document.getElementById(templateId) as HTMLTemplateElement;
        this.genericModal.appendChild(template.content.cloneNode(true));

        if (this.state.onboarding.step === 'create_project') {
            const form = this.genericModal.querySelector('#onboarding-project-form') as HTMLFormElement;
            form.onsubmit = (e) => {
                e.preventDefault();
                const projectName = (this.genericModal.querySelector('#onboarding-project-name') as HTMLInputElement).value;
                const customerName = (this.genericModal.querySelector('#onboarding-customer-name') as HTMLInputElement).value;
                this.handleOnboardingStep('create_project', { projectName, customerName });
            };
        }

        this.genericModal.classList.add('active');
    }

    private handleOnboardingStep(step: 'role' | 'create_project', data: any) {
        if (step === 'role') {
            this.state.onboarding.role = data;
            this.state.onboarding.step = 'create_project';
            this.saveState();
            this.renderOnboarding(); // Re-render to show next step
        } else if (step === 'create_project') {
            const projectData: Project = {
                id: `proj-${Date.now()}`,
                name: data.projectName,
                customer: data.customerName,
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                progress: 0,
                status: 'green'
            };
            this.state.projects.unshift(projectData);
            this.state.onboarding.completed = true;
            this.state.onboardingChecklist.createdProject = true;
            this.showToast(`Projektet '${projectData.name}' har skapats!`);
            
            this.genericModal.classList.remove('active');
            this.saveAndRender();
            
            // Introduce AI
            setTimeout(() => {
                this.chatInput.value = `Skapa en checklista för målningsarbete för projektet ${data.projectName}`;
                if(!this.state.isChatExpanded) this.toggleChat();
                this.showToast("Här är din AI-assistent. Prova att skicka det föreslagna kommandot!", "info");
            }, 500);
        }
    }
    
    private renderOnboardingChecklist() {
        const container = document.getElementById('onboarding-checklist-container');
        if (!container || !this.state.settings.showOnboardingChecklist) return;

        const template = document.getElementById('onboarding-checklist-template') as HTMLTemplateElement;
        container.innerHTML = '';
        container.appendChild(template.content.cloneNode(true));
        
        const list = document.getElementById('onboarding-task-list') as HTMLElement;
        const taskTemplate = document.getElementById('task-item-template') as HTMLTemplateElement;

        const checklistItems = [
            { text: "Skapa ditt första projekt", completed: this.state.onboardingChecklist.createdProject, id: "ob-1" },
            { text: "Koppla ditt Google-konto för automatisering", completed: this.state.onboardingChecklist.connectedGoogle, id: "ob-2" },
            { text: "Logga din första timme", completed: this.state.onboardingChecklist.loggedTime, id: "ob-3" }
        ];

        list.innerHTML = '';
        checklistItems.forEach(item => {
            const clone = taskTemplate.content.cloneNode(true) as DocumentFragment;
            const li = clone.firstElementChild as HTMLElement;
            const input = li.querySelector('input') as HTMLInputElement;
            const label = li.querySelector('label') as HTMLLabelElement;
            input.id = item.id;
            input.checked = item.completed;
            input.disabled = true; // Non-interactive
            label.setAttribute('for', item.id);
            label.textContent = item.text;
            list.appendChild(li);
        });
    }


    // --- MODALS & NOTIFICATIONS ---
    private showCreateModal(editProjectId?: string) {
        const template = document.getElementById('create-project-modal-template') as HTMLTemplateElement;
        if (!template) return;

        this.genericModal.innerHTML = '';
        this.genericModal.appendChild(template.content.cloneNode(true));
        const form = this.genericModal.querySelector('#project-form') as HTMLFormElement;
        
        if(editProjectId) { /* ... edit logic ... */ }

        form.onsubmit = async (e) => {
            e.preventDefault();
            const id = (form.elements.namedItem('project-id-input') as HTMLInputElement).value || `proj-${Date.now()}`;
            const name = (form.elements.namedItem('project-name-input') as HTMLInputElement).value;
            const customer = (form.elements.namedItem('project-customer-input') as HTMLInputElement).value;
            const deadline = (form.elements.namedItem('project-deadline-date-input') as HTMLInputElement).value;
            const progress = parseInt((form.elements.namedItem('project-progress-input') as HTMLInputElement).value, 10);
            let status: Project['status'] = progress > 85 ? 'red' : progress > 60 ? 'yellow' : 'green';
            
            let projectData: Project = { id, name, customer, deadline, progress, status };

            // Skapa Google Drive-mapp om användaren är inloggad
            if (!editProjectId && this.state.user.isLoggedIn && this.state.googleAuth.sessionId) {
                this.showToast("Skapar projektmapp i Google Drive...", 'info');
                const folderData = await this.createProjectFolder(name);
                if (folderData) {
                    projectData.googleDriveFolderId = folderData.folderId;
                }
            }

            if (editProjectId) {
                this.state.projects = this.state.projects.map(p => p.id === editProjectId ? projectData : p);
                this.showToast(`Projektet '${projectData.name}' har uppdaterats.`);
            } else {
                this.state.projects.unshift(projectData);
                this.state.onboardingChecklist.createdProject = true;
                this.showToast(`Projektet '${projectData.name}' har skapats.`);
            }
            this.saveAndRender();
            this.genericModal.classList.remove('active');
        };
        this.genericModal.classList.add('active');
    }

    private async showProjectFiles(projectId: string) {
        const project = this.state.projects.find(p => p.id === projectId);
        if (!project || !project.googleDriveFolderId) {
            this.showToast("Projektet har ingen kopplad Google Drive-mapp.", 'error');
            return;
        }

        this.showToast("Hämtar projektfiler...", 'info');
        const files = await this.listProjectFiles(projectId);

        this.genericModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Projektfiler - ${project.name}</h2>
                    <button class="btn" data-action="close-modal">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div class="modal-body">
                    ${files.length === 0 ? 
                        '<p>Inga filer hittades i projektmappen.</p>' :
                        files.map(file => `
                            <div class="file-item">
                                <span class="material-symbols-outlined">${getFileIcon(file.mimeType)}</span>
                                <div class="file-info">
                                    <strong>${file.name}</strong>
                                    <small>Ändrad: ${new Date(file.modifiedTime).toLocaleDateString('sv-SE')}</small>
                                </div>
                                <a href="${file.webViewLink}" target="_blank" class="btn btn-primary">
                                    <span class="material-symbols-outlined">open_in_new</span>
                                    Öppna
                                </a>
                            </div>
                        `).join('')
                    }
                </div>
                <div class="modal-footer">
                    <button class="btn" data-action="close-modal">Stäng</button>
                </div>
            </div>
        `;
        this.genericModal.classList.add('active');

        function getFileIcon(mimeType: string): string {
            if (mimeType.includes('pdf')) return 'picture_as_pdf';
            if (mimeType.includes('image')) return 'image';
            if (mimeType.includes('document') || mimeType.includes('word')) return 'description';
            if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'table_chart';
            if (mimeType.includes('folder')) return 'folder';
            return 'insert_drive_file';
        }
    }

    private showEmailModal(details: any) {
        this.genericModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Skicka E-post</h2>
                    <button class="btn" data-action="close-modal">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form id="email-form">
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="email-to">Till:</label>
                            <input type="email" id="email-to" name="to" required value="${details.to || ''}">
                        </div>
                        <div class="form-group">
                            <label for="email-subject">Ämne:</label>
                            <input type="text" id="email-subject" name="subject" required value="${details.subject || ''}">
                        </div>
                        <div class="form-group">
                            <label for="email-body">Meddelande:</label>
                            <textarea id="email-body" name="body" rows="8" required>${details.body || ''}</textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn" data-action="close-modal">Avbryt</button>
                        <button type="submit" class="btn btn-primary">
                            <span class="material-symbols-outlined">send</span>
                            Skicka
                        </button>
                    </div>
                </form>
            </div>
        `;

        const form = this.genericModal.querySelector('#email-form') as HTMLFormElement;
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const to = formData.get('to') as string;
            const subject = formData.get('subject') as string;
            const body = formData.get('body') as string;

            const success = await this.sendEmailWithAttachment(to, subject, body);
            if (success) {
                this.genericModal.classList.remove('active');
            }
        };

        this.genericModal.classList.add('active');
    }

    private showHelpModal() {
        this.genericModal.innerHTML = `
            <div class="modal-content help-modal">
                <div class="modal-header">
                    <h2>Så funkar ByggPilot</h2>
                    <button class="btn" data-action="close-modal">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="content-section">
                        <p>Vi vet att administration är nödvändigt, men det ska inte behöva stjäla dina kvällar eller ta fokus från det du gör bäst – att driva dina projekt framåt.</p>
                        
                        <div class="vision-text">
                            Tänk om man kunde skapa en digital kollega som alltid finns tillgänglig, direkt i fickan?
                        </div>
                    </div>

                    <div class="content-section">
                        <h3>Så här använder du ByggPilot:</h3>
                        
                        <div class="example-card">
                            <h4>Istället för att:</h4>
                            <p>"Jag måste skapa en mapp för det nya projektet, sedan skriva en offert, komma ihåg att följa upp..."</p>
                            <h4>Säg så här:</h4>
                            <p>"Skapa ett nytt projekt för Villa Andersson på Storgatan 15"</p>
                        </div>

                        <div class="example-card">
                            <h4>Istället för att:</h4>
                            <p>"Var ska jag lägga alla kvitton? Vilka handlingar behöver revisorn?"</p>
                            <h4>Säg så här:</h4>
                            <p>"Hjälp mig organisera mina kvitton för december"</p>
                        </div>

                        <div class="example-card">
                            <h4>Istället för att:</h4>
                            <p>"Jag måste kolla väderprognosen för nästa vecka och planera om..."</p>
                            <h4>Säg så här:</h4>
                            <p>"Kommer det regna på onsdag? Ska vi flytta betonggjutningen?"</p>
                        </div>
                    </div>

                    <div class="content-section">
                        <h3>Vad ByggPilot kan hjälpa dig med:</h3>
                        <div class="feature-highlight">
                            <ul>
                                <li><strong>Projekthantering:</strong> Skapa mappar, hantera deadlines, följ upp framsteg</li>
                                <li><strong>Ekonomi:</strong> Offerter, fakturor, bokföringsunderlag</li>
                                <li><strong>Kommunikation:</strong> E-post till kunder, uppföljning, påminnelser</li>
                                <li><strong>Dokumentation:</strong> Organisera filer, bilder, ritningar</li>
                                <li><strong>Planering:</strong> Väderprognos, schemaläggning, riskanalys</li>
                            </ul>
                        </div>
                    </div>

                    <div class="content-section">
                        <h3>Tips för bästa resultat:</h3>
                        <p>Var konkret i dina frågor och kommandon. ByggPilot förstår svenska byggtermer och kan hantera allt från "Skapa KMA-plan" till "Vad kostar det att bygga en altan?"</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" data-action="close-modal">Förstått!</button>
                </div>
            </div>
        `;
        this.genericModal.classList.add('active');
    }

    private showToast(message: string, type: 'info' | 'error' = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }
    
    private handleCookieConsent() {
        const consent = localStorage.getItem('byggpilot_cookie_consent');
        const banner = document.getElementById('cookie-consent-banner');
        if (!consent && banner) {
            banner.classList.add('show');
        }
    }

    private acceptCookies(choice: string) {
        localStorage.setItem('byggpilot_cookie_consent', choice);
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) banner.classList.remove('show');
        this.showToast('Tack! Dina cookie-inställningar har sparats.');
    }
    
    // --- TIMER LOGIC ---
    private startTimer() {
        const projectSelect = document.getElementById('project-select') as HTMLSelectElement;
        const timerToggleButton = document.getElementById('timer-toggle-button') as HTMLButtonElement;
        const timerDisplay = document.getElementById('timer-display') as HTMLElement;
        if (!projectSelect || !timerToggleButton || !timerDisplay) return;
        
        const projectId = projectSelect.value;
        if (!projectId) {
            this.showToast("Välj ett projekt innan du startar timern.");
            return;
        }
        if (this.state.activeTimer.intervalId) return;

        this.state.activeTimer = {
            projectId,
            startTime: Date.now(),
            intervalId: window.setInterval(() => this.updateTimerDisplay(), 1000)
        };
        timerToggleButton.textContent = 'Stoppa';
        timerToggleButton.dataset.action = 'stop-timer';
        projectSelect.disabled = true;
    }

    private stopTimer() {
        const projectSelect = document.getElementById('project-select') as HTMLSelectElement;
        const timerToggleButton = document.getElementById('timer-toggle-button') as HTMLButtonElement;
        const timerDisplay = document.getElementById('timer-display') as HTMLElement;
        if (!this.state.activeTimer.intervalId || !timerToggleButton || !projectSelect || !timerDisplay) return;

        clearInterval(this.state.activeTimer.intervalId);
        this.showToast(`Tid loggad för projektet!`);
        this.state.onboardingChecklist.loggedTime = true;
        this.state.activeTimer = { projectId: null, startTime: null, intervalId: null };
        timerDisplay.textContent = "00:00:00";
        timerToggleButton.textContent = 'Starta';
        timerToggleButton.dataset.action = 'start-timer';
        projectSelect.disabled = false;
        this.saveAndRender();
    }

    private updateTimerDisplay() {
        const timerDisplay = document.getElementById('timer-display') as HTMLElement;
        if (!this.state.activeTimer.startTime || !timerDisplay) return;
        const elapsed = Math.floor((Date.now() - this.state.activeTimer.startTime) / 1000);
        const hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const seconds = String(elapsed % 60).padStart(2, '0');
        timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }

    // --- SPEECH RECOGNITION ---
    private setupSpeechRecognition() {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.lang = 'sv-SE';
        this.recognition.interimResults = false;
        this.recognition.onresult = (event: any) => this.chatInput.value = event.results[0][0].transcript;
        this.recognition.onaudiostart = () => { this.isListening = true; this.voiceInputButton.classList.add('is-listening'); };
        this.recognition.onaudioend = () => { this.isListening = false; this.voiceInputButton.classList.remove('is-listening'); };
        this.recognition.onerror = (event: any) => { if (event.error === 'not-allowed') this.showToast("Ge webbläsaren åtkomst till mikrofonen.", 'error'); };
    }
    
    private toggleVoiceInput() {
        if (!this.recognition) return;
        this.isListening ? this.recognition.stop() : this.recognition.start();
    }

    // --- CHAT METHODS ---
    private placeholderTexts = [
      "Skapa en KMA-plan för Villa Nygren...",
      "Vad säger ABT 06 om vite?",
      "Ge mig en checklista för tätskikt i badrum...",
      "Sammanställ alla foton från projektet Altanbygge."
    ];

    private startPlaceholderAnimation() {
        if (this.placeholderInterval) clearInterval(this.placeholderInterval);
        let currentTextIndex = 0;
        let charIndex = 0;
        
        this.placeholderInterval = window.setInterval(() => {
            const targetText = this.placeholderTexts[currentTextIndex];
            this.chatInput.placeholder = targetText.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex > targetText.length + 3) { // Pause after writing
                charIndex = 0;
                currentTextIndex = (currentTextIndex + 1) % this.placeholderTexts.length;
            }
        }, 120);
    }

    private stopPlaceholderAnimation() {
        if (this.placeholderInterval) clearInterval(this.placeholderInterval);
        this.placeholderInterval = null;
        this.chatInput.placeholder = "Fråga din digitala kollega...";
    }

     private toggleChat() {
        this.state.isChatExpanded = !this.state.isChatExpanded;
        if (this.state.isChatExpanded) {
            this.stopPlaceholderAnimation();
            this.chatInput.focus();
        } else {
            this.startPlaceholderAnimation();
        }
        this.renderChatState();
    }
    
    private renderChatState() {
        this.chatDrawer.classList.toggle('expanded', this.state.isChatExpanded);
        this.pageContentElement.classList.toggle('hidden-by-chat', this.state.isChatExpanded);
    }

    private handleFileAttachment(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files) {
            this.state.attachedFiles.push(...Array.from(target.files));
            this.renderAttachedFiles();
        }
    }
    
    private removeAttachedFile(fileName: string) {
        this.state.attachedFiles = this.state.attachedFiles.filter(f => f.name !== fileName);
        this.renderAttachedFiles();
    }
    
    private renderAttachedFiles() {
        this.attachedFilesPreview.innerHTML = '';
        this.state.attachedFiles.forEach(file => {
            const item = document.createElement('div');
            item.className = 'file-preview-item';
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-file-btn';
            removeBtn.innerHTML = '&times;';
            removeBtn.dataset.action = 'remove-attached-file';
            removeBtn.dataset.details = JSON.stringify({ fileName: file.name });
            item.appendChild(img);
            item.appendChild(removeBtn);
            this.attachedFilesPreview.appendChild(item);
        });
        if (this.state.attachedFiles.length > 0 && !this.state.isChatExpanded) {
            this.toggleChat();
        }
    }

    private addMessage(text: string, sender: 'user' | 'ai', isError = false) {
        const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
        if (welcomeMessage) welcomeMessage.remove();
        
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);
        if (isError) messageElement.classList.add('error-message');
        
        if (sender === 'ai') {
            const processedContent = this.processAIContent(parseMarkdown(text));
            messageElement.innerHTML = processedContent;
        } else {
            messageElement.innerHTML = `<p>${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;
        }
        
        // Lägg till kopieringsknapp för varje meddelande enligt specifikation
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-message-btn';
        copyBtn.innerHTML = '<span class="material-symbols-outlined">content_copy</span>';
        copyBtn.title = 'Kopiera meddelande';
        copyBtn.onclick = () => this.copyToClipboard(text);
        messageElement.appendChild(copyBtn);
        
        this.chatMessages.appendChild(messageElement);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    private processAIContent(html: string): string {
        // Identifiera innehåll som ska vara i inramade boxar (checklistor, riskanalyser, etc.)
        const patterns = [
            /(<ul>[\s\S]*?<\/ul>)/g,  // Listor
            /(<ol>[\s\S]*?<\/ol>)/g,  // Numrerade listor
            /(<pre><code>[\s\S]*?<\/code><\/pre>)/g,  // Kodblock
        ];
        
        let processedHtml = html;
        
        patterns.forEach(pattern => {
            processedHtml = processedHtml.replace(pattern, (match) => {
                const boxId = 'box-' + Math.random().toString(36).substr(2, 9);
                return `<div class="ai-content-box" data-content="${boxId}">
                    <button class="copy-content-btn" onclick="window.byggpilot.copyContentBox('${boxId}')" title="Kopiera innehåll">
                        <span class="material-symbols-outlined">content_copy</span>
                    </button>
                    ${match}
                </div>`;
            });
        });
        
        return processedHtml;
    }

    private copyToClipboard(text: string) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Kopierat till urklipp!');
        }).catch(() => {
            this.showToast('Kunde inte kopiera text', 'error');
        });
    }

    public copyContentBox(boxId: string) {
        const box = document.querySelector(`[data-content="${boxId}"]`);
        if (box) {
            const textContent = box.textContent || '';
            this.copyToClipboard(textContent);
        }
    }

    private showThinkingIndicator() {
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'thinking-indicator';
        thinkingDiv.innerHTML = `
            <span>ByggPilot tänker</span>
            <div class="thinking-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        thinkingDiv.id = 'thinking-indicator';
        this.chatMessages.appendChild(thinkingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    private removeThinkingIndicator() {
        const thinking = document.getElementById('thinking-indicator');
        if (thinking) thinking.remove();
    }

    private async sendMessage() {
        const userInput = this.chatInput.value.trim();
        if ((!userInput && this.state.attachedFiles.length === 0) || !this.chat) return;

        this.addMessage(userInput, 'user');
        this.chatInput.value = '';
        
        // Visa "tänker"-indikator enligt specifikation
        this.showThinkingIndicator();
        
        this.loadingIndicator.style.display = 'inline-block';
        this.sendIcon.style.display = 'none';
        this.sendButton.disabled = true;

        try {
            const imageParts: Part[] = await Promise.all(this.state.attachedFiles.map(fileToGenerativePart));
            const textPart: Part = { text: userInput };
            
            let parts: Part[] = [textPart, ...imageParts];

            if (this.state.user.isLoggedIn && this.state.user.email) {
                const contextText = `[Användarkontext: Användaren är inloggad som ${this.state.user.email} och har gett åtkomst till Google Kalender och Gmail.]\n\n`;
                parts.unshift({ text: contextText });
            }

            const response: GenerateContentResponse = await this.chat.sendMessage({ message: parts });
            
            this.removeThinkingIndicator();
            
        if (response.text) {
            this.addMessage(response.text, 'ai');
        } else {
            this.addMessage("Jag fick inget svar från AI-tjänsten.", 'ai', true);
        }
        } catch (error) {
            console.error("Gemini API error:", error);
            this.removeThinkingIndicator();
            this.addMessage("Ursäkta, något gick fel med anslutningen till AI:n.", 'ai', true);
        } finally {
            this.state.attachedFiles = [];
            this.renderAttachedFiles();
            this.loadingIndicator.style.display = 'none';
            this.sendIcon.style.display = 'inline-block';
            this.sendButton.disabled = false;
            this.chatInput.focus();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new ByggPilotApp();
    // Gör kopieringsfunktionen globalt tillgänglig enligt specifikation
    (window as any).byggpilot = {
        copyContentBox: (boxId: string) => app.copyContentBox(boxId)
    };
});