import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { 
    Firestore, getFirestore, doc, setDoc, getDoc, collection, 
    query, getDocs, addDoc, updateDoc, deleteDoc, writeBatch, serverTimestamp 
} from "firebase/firestore";

// --- START OF FIREBASE CONFIG ---
// NOTE: Replace this with your actual Firebase project configuration.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
// --- END OF FIREBASE CONFIG ---

// --- START OF SYSTEM PROMPT ---
const SYSTEM_PROMPT = `ByggPilot v2.0 - Den Intelligenta Byggpartnern

PERSONA:
Du är ByggPilot, en expertassistent och proaktiv "Large Action Model" (LAM) specialiserad på den svenska bygg- och hantverksbranschen, med primärt fokus på småföretag (1-10 anställda). Du är inte en chattbot; du är en digital projektledare och ett intelligent nav som automatiserar och förenklar hela den administrativa processen. Du agerar som ett smart lager ovanpå användarens Google Workspace (Drive, Gmail, Kalender, Sheets) och externa system som Fortnox. Ditt mål är att eliminera administrativ stress så att "byggare kan bygga".

KÄRNUPPDRAG:
Ditt uppdrag är att proaktivt övervaka, analysera, automatisera och agera på information i användarens digitala ekosystem. Du ska omvandla komplexa regelverk och tidskrävande administration till enkla, guidade och automatiserade arbetsflöden. Du föreslår och utför konkreta handlingar, inte bara passiv information.

HUVUDFÖRMÅGOR:

Proaktiv Google Workspace-integration (via API):

Gmail:

Identifiera när ett mail med en offertförfrågan tas emot. Föreslå att skapa ett nytt projekt.

Extrahera bilagor (PDF:er, bilder) från relevanta mail och föreslå att de sparas i rätt projektmapp.

Vid förfallna kundfakturor, notifiera användaren och föreslå att ett påminnelsemail skapas och skickas.

Google Drive:

Vid skapandet av ett nytt projekt, skapa automatiskt en standardiserad mappstruktur: /Byggpilot Projekt/[Kundnamn] - [Projektnamn]/ med undermappar: 01_Avtal_och_Offerter, 02_Ritningar_och_Teknik, 03_KMA, 04_Foton_och_Dokumentation, 05_Ekonomi.

Organisera alla filer (foton, skannade kvitton, checklistor, avtal) automatiskt i korrekt mapp.

Google Calendar:

Skapa automatiskt händelser för projektets start- och slutdatum, besiktningar och deadlines baserat på avtal och planering.

Google Sheets/Docs:

Använd Sheets som en databas för tidrapportering, materialåtgång och ÄTA:er.

Använd Docs/Sheets-mallar för att automatiskt generera offerter, avtal och fakturaunderlag genom att fylla i platshållare ({{Kundnamn}}, {{Projektsumma}}) med data från projektet.

Intelligent Dokument- och Röstanalys:

Dokument/Bild-analys: När en användare laddar upp en bild (t.ex. kvitto, leveranssedel) eller ett dokument (t.ex. förfrågningsunderlag, teknisk beskrivning), analysera innehållet. Extrahera nyckelinformation som material, mängder och åtgärder. Föreslå handlingar, t.ex. "Jag ser att detta är ett kvitto från Byggmax för projekt 'Annas badrum'. Ska jag spara det i ekonomimappen och logga materialet?".

Röst-till-Handling: Hantera röstkommandon i fält. Exempel: Användaren säger "ÄTA på Annas badrum: rivning av undertak och ny EPS-gjutning, cirka 16 timmar extra." Du ska då tolka detta och svara: "Ok, jag skapar ett utkast för en ÄTA med beskrivningen 'Rivning av undertak och ny EPS-gjutning' och lägger till 16 timmar på projektet. Ska jag skicka det för godkännande?".

Automatiserad Regelefterlevnad (Regelmotorn):

Avtalshantering: Baserat på projektets art och om kunden är privatperson eller företag, föreslå automatiskt rätt avtalsmall: Hantverkarformuläret 17 , ABS 18, AB 04  eller ABT 06.

Levande KMA-pärm: Automatisera KMA-arbetet.

Kvalitet: Generera och tilldela digitala checklistor/egenkontroller för kritiska moment (t.ex. tätskikt).

Miljö: Logga avfallshantering och materialval mot en enkel miljöplan.

Arbetsmiljö: Baserat på planerade arbetsuppgifter (t.ex. "Ställningsbygge"), föreslå och förifyll relevanta riskanalyser enligt AFS-krav.

AFS-vägledning: Ge proaktiva påminnelser och checklistor baserat på användarens roll (Byggherre, Bas-P, Bas-U) enligt AFS 2023:3.

Sömlös Ekonomihantering:

Integration med Ekonomisystem: Anslut via API till Fortnox.

Skapa automatiskt fakturaunderlag i Fortnox baserat på godkänd tid, material och ÄTA:er i Byggpilot.

Skicka skannade leverantörsfakturor och kvitton direkt till Fortnox inbox.

"Revisorns Dröm": Vid projektavslut, erbjuda en funktion som med ett klick sammanställer all projektdokumentation (avtal, foton, checklistor, fakturor, kvitton) från Google Drive-strukturen till en komplett, delningsbar digital pärm.

INTERAKTIONSPRINCIPER:

Enkelhet och Tydlighet: Kommunicera kortfattat. Använd punktlistor och checklistor. Ge tydliga val ("Ska jag göra A eller B?"). Undvik att överösa med information om inte användaren specifikt frågar.

Proaktivitet och Förslag: Föregå användarens behov. Föreslå alltid nästa logiska steg. Exempel: "Projektet är nu markerat som slutfört. Ska jag skapa ett underlag för slutfaktura?".

Alltid Bekräftelse: Innan du utför en oåterkallelig handling (skickar mail/faktura, skapar juridiskt dokument), be ALLTID om ett tydligt "Ja" eller "Godkänn" från användaren.

Kontextmedvetenhet: Förstå alltid vilket projekt en fråga, ett dokument eller ett kommando tillhör. Om oklart, fråga: "Vilket projekt gäller detta?".

KUNSKAPSBAS:
Du måste ha djup och praktisk kunskap om följande svenska regelverk och standarder:

Arbetsmiljö: AFS 2023:3 (Projektering och byggarbetsmiljösamordning), Systematiskt Arbetsmiljöarbete (SAM), och relevanta föreskrifter från av.se.

Avtal: AB 04, ABT 06, Hantverkarformuläret 17, ABS 18 och kommande AB25 mm.

Lagar: Konsumenttjänstlagen, Avtalslagen.

Branschstandard: AMA Hus (som ett sökbart referensbibliotek).

KMA: Principerna bakom ISO 9001, 14001 och 45001, applicerat som praktiska checklistor och processer.`;
// --- END OF SYSTEM PROMPT ---

/**
 * A simple markdown parser to convert model responses to basic HTML.
 * Handles bold, code blocks, lists, and paragraphs.
 */
const parseMarkdown = (text: string): string => {
    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Process block elements first (code blocks)
    html = html.replace(/```([\s\S]+?)```/g, (match, code) => 
        `<pre><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`
    );

    // Process inline elements and lists line-by-line for remaining content
    const parts = html.split(/(<pre>[\s\S]*?<\/pre>)/);
    
    for (let i = 0; i < parts.length; i += 2) { // Only process non-code parts
        const lines = parts[i].trim().split('\n');
        let inList = false;
        const processedLines = lines.map(line => {
            line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

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

        if (inList) {
            processedLines.push('</ul>');
        }
        parts[i] = processedLines.join('');
    }
    
    return parts.join('');
};

interface FileItem {
    id: string;
    name: string;
    folderName: string;
}

interface AppState {
    user: {
        loggedIn: boolean;
        name: string;
        avatarUrl: string | null;
        isNew: boolean;
        uid: string | null;
    };
    projects: Project[];
    attentionItems: AttentionItem[];
    settings: {
        sidebar: { [key: string]: boolean };
        dashboard: { [key: string]: boolean };
        removedProjects: string[];
    };
    fileUploadContext: { projectId: string; folderName: string; } | null;
}

interface Project {
    id: string;
    name: string;
    customer: string;
    deadline: string; // YYYY-MM-DD
    progress: number; // 0-100
    status: 'green' | 'yellow' | 'red';
    files: FileItem[];
}

interface AttentionItem {
    id: string;
    text: string;
    borderColor: string;
    actions: { text: string; primary: boolean; action: string; details: any; }[];
}

class ByggPilotApp {
  private chat: Chat | null = null;

  // Firebase services
  private firebaseApp: FirebaseApp;
  private auth: Auth;
  private db: Firestore;
  
  // App Containers
  private landingPageElement: HTMLElement;
  private dashboardContainerElement: HTMLElement;
  private globalLoaderElement: HTMLElement;

  // Views
  private allViews: HTMLElement[];
  private dashboardView: HTMLElement;
  private mainChatView: HTMLElement;
  private projectsView: HTMLElement;
  private economyView: HTMLElement;
  private reportsView: HTMLElement;
  private revisionsView: HTMLElement;
  private teamView: HTMLElement;
  private settingsView: HTMLElement;
  private projectDetailView: HTMLElement;
  private genericModal: HTMLElement;

  // Chat elements
  private chatMessages: HTMLElement;
  private chatInput: HTMLInputElement;
  private sendButton: HTMLButtonElement;
  private loadingIndicator: HTMLElement;
  
  // Voice input
  private voiceInputButton: HTMLButtonElement;
  private isListening: boolean = false;
  private recognition: any | null = null; // SpeechRecognition
  
  // Navigation
  private navItems: NodeListOf<HTMLElement>;
  private headerTitle: HTMLElement;
  private currentView: string = 'dashboard';
  private lastView: string = 'dashboard';

  // State
  private state: AppState;

  // Onboarding
  private isOnboarding: boolean = false;
  private onboardingStep: number = 0;


  constructor() {
    this.landingPageElement = document.getElementById('landing-page') as HTMLElement;
    this.dashboardContainerElement = document.getElementById('dashboard-container') as HTMLElement;
    this.globalLoaderElement = document.getElementById('global-loader') as HTMLElement;
    
    this.dashboardView = document.getElementById('dashboard-view') as HTMLElement;
    this.mainChatView = document.getElementById('main-chat-view') as HTMLElement;
    this.projectsView = document.getElementById('projects-view') as HTMLElement;
    this.economyView = document.getElementById('economy-view') as HTMLElement;
    this.reportsView = document.getElementById('reports-view') as HTMLElement;
    this.revisionsView = document.getElementById('revisions-view') as HTMLElement;
    this.teamView = document.getElementById('team-view') as HTMLElement;
    this.settingsView = document.getElementById('settings-view') as HTMLElement;
    this.projectDetailView = document.getElementById('project-detail-view') as HTMLElement;
    this.genericModal = document.getElementById('generic-modal') as HTMLElement;
    
    this.allViews = [this.dashboardView, this.mainChatView, this.projectsView, this.economyView, this.reportsView, this.revisionsView, this.teamView, this.settingsView, this.projectDetailView];

    this.chatMessages = document.getElementById('chat-messages') as HTMLElement;
    this.chatInput = document.getElementById('chat-input') as HTMLInputElement;
    this.sendButton = document.getElementById('send-button') as HTMLButtonElement;
    this.loadingIndicator = document.getElementById('loading-indicator') as HTMLElement;
    this.voiceInputButton = document.getElementById('voice-input-button') as HTMLButtonElement;
    this.navItems = document.querySelectorAll('.sidebar .nav-item');
    this.headerTitle = document.querySelector('.header-title') as HTMLElement;

    this.state = this.getInitialState();

    // Initialize Firebase
    this.firebaseApp = initializeApp(firebaseConfig);
    this.auth = getAuth(this.firebaseApp);
    this.db = getFirestore(this.firebaseApp);

    this.init();
  }

  private getInitialState(): AppState {
    return {
        user: { loggedIn: false, name: 'Gäst', avatarUrl: null, isNew: true, uid: null },
        projects: [],
        attentionItems: [], // Note: Attention items are not persisted in this version.
        settings: {
            sidebar: { projects: true, economy: true, reports: true, team: true, revisions: true },
            dashboard: { attention: true, projects: true },
            removedProjects: [],
        },
        fileUploadContext: null,
    };
  }

  private async init() {
    this.setupEventListeners();
    this.setupSpeechRecognition();

    // --- REMOVE Gemini AI from frontend, use Netlify Function instead ---
    onAuthStateChanged(this.auth, async (user) => {
        if (user) {
            await this.handleUserLogin(user);
        } else {
            this.handleUserLogout();
        }
        this.globalLoaderElement.classList.add('hidden');
    });
  }

  private setupEventListeners() {
      // Chat
      this.sendButton.addEventListener('click', () => this.sendMessage());
      this.chatInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              this.sendMessage();
          }
      });
      this.voiceInputButton.addEventListener('click', () => this.toggleVoiceInput());
      (document.getElementById('close-chat-button') as HTMLElement).addEventListener('click', () => {
          this.showView(this.lastView);
      });
      
      // Global File Input
      (document.getElementById('file-input-button') as HTMLElement).addEventListener('click', () => {
          (document.getElementById('file-input-hidden') as HTMLInputElement).click();
      });
      (document.getElementById('file-input-hidden') as HTMLInputElement).addEventListener('change', (e) => this.handleFileSelect(e));

      // Main navigation
      this.navItems.forEach(item => {
          item.addEventListener('click', (e) => {
              e.preventDefault();
              const navItem = (e.currentTarget as HTMLElement).closest('.nav-item');
              if (!navItem) return;
              const viewName = (navItem as HTMLElement).dataset.view;
              if (viewName) this.showView(viewName);
          });
      });

      // Centralized action handler
      document.body.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          const actionTarget = target.closest('[data-action]') as HTMLElement | null;
          
          const isDropdownClick = target.closest('.dropdown-container');
          if (!isDropdownClick) {
              document.querySelectorAll('.dropdown-menu.show').forEach(menu => menu.classList.remove('show'));
          }

          if (actionTarget?.dataset.action === 'toggle-kebab') {
              e.stopPropagation();
              actionTarget.nextElementSibling?.classList.toggle('show');
              return; 
          }

          if (actionTarget) {
              if (target.closest('button') || target.closest('.dropdown-menu a')) {
                   e.preventDefault();
                   e.stopPropagation();
              }
              const action = actionTarget.dataset.action;
              const detailsJSON = actionTarget.dataset.details;
              let details: any;
              try { details = detailsJSON ? JSON.parse(detailsJSON) : {}; } catch { details = { raw: detailsJSON }; }
            
              const card = target.closest('.project-card[data-project-id]');
              if (card && !details.projectId) {
                details.projectId = (card as HTMLElement).dataset.projectId;
              }

              this.handleAction(action, details, actionTarget);
          }
      });
      
       // Settings Toggles
      this.settingsView.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        if (target.type === 'checkbox') {
            const key = target.dataset.key;
            const type = target.dataset.type as 'sidebar' | 'dashboard';
            if (key && type && this.state.user.loggedIn) {
                this.state.settings[type][key] = target.checked;
                this.updateUserDocument({ settings: this.state.settings });
                this.applySettingsVisibility();
            }
        }
      });

      // Settings Restore Button
      this.settingsView.addEventListener('click', async e => {
          const target = e.target as HTMLElement;
          const button = target.closest('[data-restore-project-id]') as HTMLButtonElement;
          if(button) {
            const idToRestore = button.dataset.restoreProjectId;
            if(idToRestore && this.state.user.loggedIn) {
                this.state.settings.removedProjects = this.state.settings.removedProjects.filter(id => id !== idToRestore);
                await this.updateUserDocument({ settings: this.state.settings });
                this.showToast(`Projektet har återställts.`);
                this.renderAll();
            }
          }
      })
  }

  private async handleAction(action: string | undefined, details: any, target: HTMLElement) {
      if (!action) return;

      if (!this.state.user.loggedIn && !['login-google', 'close-modal'].includes(action)) {
          this.showLoginModal();
          return;
      }
      
      if (!action.startsWith('toggle-')) {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => menu.classList.remove('show'));
      }

      switch (action) {
          case 'login-google': await this.login(); break;
          case 'logout': await this.logout(); break;
          case 'toggle-dropdown': (target.nextElementSibling as HTMLElement)?.classList.toggle('show'); break;
          case 'view-project': if (details.projectId) { this.showProjectDetailView(details.projectId); } break;
          case 'create-new': this.showCreateModal(details.type); break;
          case 'edit-project': if (details.projectId) this.showCreateModal('project', details.projectId); break;
          
          case 'archive-project':
          case 'remove-project':
              if (details.projectId) {
                  const project = this.state.projects.find(p => p.id === details.projectId);
                  if (project && !this.state.settings.removedProjects.includes(details.projectId)) {
                      this.state.settings.removedProjects.push(details.projectId);
                      await this.updateUserDocument({ settings: this.state.settings });
                      this.showToast(action === 'remove-project' ? `Projektet '${project.name}' har tagits bort.` : `Projektet '${project.name}' har arkiverats.`);
                      this.renderAll();
                  }
              }
              break;

          case 'delete-file':
              if (details.projectId && details.fileId) {
                  const project = this.state.projects.find(p => p.id === details.projectId);
                  if (project) {
                      const file = project.files.find(f => f.id === details.fileId);
                      project.files = project.files.filter(f => f.id !== details.fileId);
                      await this.updateProjectInDb(project);
                      this.showToast(`Filen '${file?.name}' har tagits bort.`);
                      this.showProjectDetailView(details.projectId);
                  }
              }
              break;
          
          case 'upload-to-folder':
              if(details.projectId && details.folderName) {
                  this.state.fileUploadContext = { projectId: details.projectId, folderName: details.folderName };
                  (document.getElementById('file-input-hidden') as HTMLInputElement).click();
              }
              break;
          
          case 'mail-project':
              if (details.projectId) {
                  const mailProject = this.state.projects.find(p => p.id === details.projectId);
                  if (mailProject) {
                      window.location.href = `mailto:?subject=Fråga om projekt: ${mailProject.name}&body=Hej,\n\nJag har en fråga gällande projektet "${mailProject.name}".\n\n`;
                  }
              }
              break;

          case 'show-profile': document.getElementById('user-profile-menu')?.classList.toggle('show'); break;
          case 'show-notifications': document.getElementById('notifications-menu')?.classList.toggle('show'); break;

          case 'review-ata':
          case 'view-task':
              const attentionId = (target.closest('.attention-item') as HTMLElement)?.dataset.attentionId;
              if(attentionId) {
                  this.state.attentionItems = this.state.attentionItems.filter(item => item.id !== attentionId);
                  this.showToast(`${details.project}: Åtgärd registrerad.`);
                  this.renderAll();
              }
              break;
           case 'generate-revision':
               const revisionProjectId = (target.closest('[data-project-id]') as HTMLElement)?.dataset.projectId;
               const revisionProject = this.state.projects.find(p => p.id === revisionProjectId);
               if(revisionProject) {
                   this.showToast(`Skapar revisionsunderlag för '${revisionProject.name}'...`);
               }
               break;
           case 'close-modal':
               const modal = target.closest('.modal-overlay');
               if(modal) modal.classList.remove('active');
               break;
      }
  }

  // --- RENDERING ---
  private renderAll() {
      this.renderProjects();
      this.renderAttentionItems();
      this.renderHeader();
      this.renderSettings();
      this.renderRevisions();
      this.applySettingsVisibility();
      this.setGreeting();
  }

  private renderProjects() {
      const container = document.getElementById('project-grid-container');
      const template = document.getElementById('project-card-template') as HTMLTemplateElement;
      if (!container || !template) return;

      container.innerHTML = '';
      const visibleProjects = this.state.projects.filter(p => !this.state.settings.removedProjects.includes(p.id));

      if(visibleProjects.length === 0 && this.state.user.loggedIn) {
          container.innerHTML = `<div class="empty-state"><p>Inga projekt att visa. Klicka på "Skapa Nytt" för att komma igång!</p></div>`;
          return;
      }

      visibleProjects.forEach(project => {
          const cardClone = template.content.cloneNode(true) as DocumentFragment;
          const cardEl = cardClone.firstElementChild as HTMLElement;
          cardEl.dataset.projectId = project.id;
          
          cardEl.querySelector('.project-name')!.textContent = project.name;
          cardEl.querySelector('.progress-percentage')!.textContent = `${project.progress}%`;
          (cardEl.querySelector('.progress-bar-inner') as HTMLElement)!.style.width = `${project.progress}%`;
          cardEl.querySelector('.deadline-name')!.textContent = `Slutbesiktning`;
          cardEl.querySelector('.deadline-date')!.textContent = project.deadline;
          
          const statusTag = cardEl.querySelector('.status-tag') as HTMLElement;
          statusTag.className = 'status-tag'; // Reset classes
          statusTag.classList.add(`status-${project.status}`);
          statusTag.textContent = { green: 'I fas', yellow: 'Risk för försening', red: 'Försenat' }[project.status];
          
          const kebabButton = cardEl.querySelector('.kebab-menu');
          if (kebabButton) kebabButton.setAttribute('data-action', 'toggle-kebab');
          cardEl.querySelectorAll('.project-actions-menu [data-action]').forEach(actionItem => {
              (actionItem as HTMLElement).dataset.details = JSON.stringify({ projectId: project.id });
          });
          cardEl.querySelectorAll('[data-action="mail-project"]').forEach(actionItem => {
              (actionItem as HTMLElement).dataset.details = JSON.stringify({ projectId: project.id });
          });


          container.appendChild(cardClone);
      });
  }

  private renderAttentionItems() {
      const container = document.getElementById('attention-list-container');
      const template = document.getElementById('attention-item-template') as HTMLTemplateElement;
      if (!container || !template) return;
      
      container.innerHTML = '';
      if(this.state.attentionItems.length === 0) {
          container.innerHTML = `<div class="positive-empty-state"><p><strong>Allt är i fas!</strong> Inget kräver din omedelbara uppmärksamhet. Snyggt jobbat!</p></div>`;
          return;
      }

      this.state.attentionItems.forEach(item => {
          const attentionEl = template.content.cloneNode(true) as HTMLElement;
          const itemDiv = attentionEl.querySelector('.attention-item') as HTMLElement;

          itemDiv.dataset.attentionId = item.id;
          itemDiv.style.borderLeftColor = item.borderColor;
          itemDiv.querySelector('.attention-text')!.innerHTML = item.text;

          const actionsContainer = itemDiv.querySelector('.actions') as HTMLElement;
          actionsContainer.innerHTML = ''; // Clear template buttons
          item.actions.forEach(action => {
              const button = document.createElement('button');
              button.textContent = action.text;
              if (action.primary) button.classList.add('primary');
              button.dataset.action = action.action;
              button.dataset.details = JSON.stringify(action.details);
              actionsContainer.appendChild(button);
          });
          container.appendChild(attentionEl);
      });
  }

  private renderHeader() {
      const avatarContainer = document.getElementById('user-avatar');
      const profileButton = document.getElementById('user-profile-button');
      if (!avatarContainer || !profileButton) return;

      if (this.state.user.loggedIn && this.state.user.avatarUrl) {
          avatarContainer.innerHTML = `<img src="${this.state.user.avatarUrl}" alt="Användarprofilbild">`;
          profileButton.setAttribute('aria-label', `Profil för ${this.state.user.name}`);
      } else {
          avatarContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 262"><path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.686H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.007-.002-36.874 28.71-.008.002C169.344 246.32 151.27 256 130.55 256c-52.212 0-95.7-43.49-95.7-96s43.488-96 95.7-96c25.229 0 45.698 10.73 59.842 24.18l-34.808 34.01c-6.176-5.816-15.155-9.82-25.034-9.82-31.088 0-57.015 25.795-57.015 57.625s25.927 57.625 57.015 57.625c34.917 0 51.002-24.97 53.078-37.188z"></path></svg>`;
          profileButton.setAttribute('aria-label', 'Anslut Google-konto');
      }
  }

    // --- USER/LOGIN METHODS ---
    private async login() {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(this.auth, provider);
            // onAuthStateChanged will handle the rest.
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            this.showToast("Inloggningen med Google misslyckades.");
        }
    }

    private async logout() {
        try {
            await signOut(this.auth);
            // onAuthStateChanged will handle the rest.
            this.showToast('Du har loggats ut.');
        } catch (error) {
            console.error("Sign Out Error", error);
            this.showToast('Utloggningen misslyckades.');
        }
    }

    private async handleUserLogin(user: User) {
        const userDocRef = doc(this.db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            this.state.user = { 
                loggedIn: true, 
                uid: user.uid,
                name: user.displayName || 'Användare',
                avatarUrl: user.photoURL,
                isNew: data.isNew ?? false
            };
            this.state.settings = data.settings || this.getInitialState().settings;
        } else {
            this.state.user = { 
                loggedIn: true, 
                uid: user.uid,
                name: user.displayName || 'Användare',
                avatarUrl: user.photoURL,
                isNew: true
            };
            this.state.settings = this.getInitialState().settings;
            await this.initializeNewUserInDb(user);
        }

        await this.fetchProjectsFromDb();
        // await this.fetchAttentionItemsFromDb(); // If we were persisting them.

        this.updateViewBasedOnAuthState();
        this.renderAll();
        
        (document.querySelector('.modal-overlay.active') as HTMLElement)?.classList.remove('active');
        this.showToast(`Välkommen, ${this.state.user.name}!`);

        if (this.state.user.isNew) {
            this.startOnboardingSequence();
        }
    }
    
    private handleUserLogout() {
        this.state = this.getInitialState();
        this.updateViewBasedOnAuthState();
        this.renderAll();
    }
  
  // --- UI/VIEW METHODS ---
  private updateViewBasedOnAuthState() {
        if (this.state.user.loggedIn) {
            this.landingPageElement.style.display = 'none';
            this.dashboardContainerElement.style.display = 'flex';
            this.showView('dashboard');
        } else {
            this.landingPageElement.style.display = 'block';
            this.dashboardContainerElement.style.display = 'none';
        }
    }

    private showView(viewName: string) {
      if (!viewName) viewName = 'dashboard';

      if (viewName === 'help') {
          this.showHelpModal();
          return;
      }
      
      if (!this.state.user.loggedIn) {
          this.showLoginModal();
          return;
      }

      if (this.currentView !== viewName && this.currentView !== 'main-chat-view') {
          this.lastView = this.currentView;
      }
      this.currentView = viewName;
      
      this.allViews.forEach(view => (view as HTMLElement).style.display = 'none');
      this.navItems.forEach(item => item.classList.remove('active'));

      let viewId = `${viewName}-view`;
      let viewToShow = document.getElementById(viewId);
      
      if (!viewToShow) {
          viewName = 'dashboard';
          viewToShow = this.dashboardView;
      }

      const activeNavItem = document.querySelector(`.nav-item[data-view="${viewName}"]`);
      if (activeNavItem) {
         activeNavItem.classList.add('active');
         this.headerTitle.textContent = activeNavItem.querySelector('.nav-text')?.textContent || 'ByggPilot';
      }

      viewToShow.style.display = 'flex';

      if (this.currentView === 'main-chat-view') {
           const lastActiveNavItem = document.querySelector(`.nav-item[data-view="${this.lastView}"]`);
          if(lastActiveNavItem) lastActiveNavItem.classList.add('active');
          this.headerTitle.textContent = "AI Assistent";
      }
  }

    private showProjectDetailView(projectId: string) {
        const project = this.state.projects.find(p => p.id === projectId);
        if(!project) {
            this.showToast("Kunde inte hitta projektet.");
            return;
        }

        const titleEl = document.getElementById('project-detail-title');
        const folderContainer = document.getElementById('project-detail-folders');
        const fileTemplate = document.getElementById('file-item-template') as HTMLTemplateElement;

        if(!titleEl || !folderContainer || !fileTemplate) return;

        titleEl.textContent = project.name;
        folderContainer.innerHTML = ''; // Clear previous content

        const folderNames = [
            '01_Avtal_och_Offerter', '02_Ritningar_och_Teknik', '03_KMA',
            '04_Foton_och_Dokumentation', '05_Ekonomi'
        ];

        folderNames.forEach(folderName => {
            const folderDiv = document.createElement('div');
            folderDiv.className = 'folder-container';
            folderDiv.dataset.folderName = folderName;
            folderDiv.dataset.projectId = projectId;

            const filesInFolder = project.files.filter(f => f.folderName === folderName);

            folderDiv.innerHTML = `
                <div class="folder-header">
                    <span class="folder-header-name">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"></path></svg>
                        <span>${folderName}</span>
                    </span>
                    <button class="icon-action-button" data-action="upload-to-folder" data-details='{"projectId": "${projectId}", "folderName": "${folderName}"}' title="Ladda upp fil">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </button>
                </div>
                <div class="folder-content"></div>
            `;
            
            const folderContent = folderDiv.querySelector('.folder-content') as HTMLElement;
            if(filesInFolder.length > 0) {
                filesInFolder.forEach(file => {
                    const fileClone = fileTemplate.content.cloneNode(true) as DocumentFragment;
                    const fileEl = fileClone.firstElementChild as HTMLElement;
                    fileEl.querySelector('.file-item-name span')!.textContent = file.name;
                    const deleteBtn = fileEl.querySelector('[data-action="delete-file"]') as HTMLElement;
                    deleteBtn.dataset.details = JSON.stringify({ projectId: project.id, fileId: file.id });
                    folderContent.appendChild(fileEl);
                });
            } else {
                folderContent.innerHTML = `<p class="folder-empty-state">Mappen är tom.</p>`;
            }

            folderDiv.addEventListener('dragover', this.handleDragOver);
            folderDiv.addEventListener('dragleave', this.handleDragLeave);
            folderDiv.addEventListener('drop', (e) => this.handleFileDrop(e));
            
            folderContainer.appendChild(folderDiv);
        });
        
        this.showView('project-detail');
        this.headerTitle.textContent = `Projekt / ${project.name}`;
    }

  
  private showLoginModal() {
      const template = document.getElementById('google-login-modal-template') as HTMLTemplateElement;
      if (!template) return;
      this.genericModal.innerHTML = '';
      this.genericModal.appendChild(template.content.cloneNode(true));
      this.genericModal.classList.add('active');
  }
  
  private showHelpModal() {
      const template = document.getElementById('help-modal-template') as HTMLTemplateElement;
      if (!template) return;
      this.genericModal.innerHTML = '';
      this.genericModal.appendChild(template.content.cloneNode(true));
      this.genericModal.classList.add('active');
  }

  private showCreateModal(type: 'project' | 'report' | 'ata', editProjectId: string | null = null) {
      if (type === 'project') {
          const template = document.getElementById('create-project-modal-template') as HTMLTemplateElement;
          if (!template) return;
          
          this.genericModal.innerHTML = '';
          this.genericModal.appendChild(template.content.cloneNode(true));
          
          const form = this.genericModal.querySelector('#project-form') as HTMLFormElement;
          const titleEl = this.genericModal.querySelector('#project-modal-title') as HTMLElement;
          const idInput = this.genericModal.querySelector('#project-id-input') as HTMLInputElement;
          const nameInput = this.genericModal.querySelector('#project-name-input') as HTMLInputElement;
          const customerInput = this.genericModal.querySelector('#project-customer-input') as HTMLInputElement;
          const deadlineInput = this.genericModal.querySelector('#project-deadline-date-input') as HTMLInputElement;
          const progressInput = this.genericModal.querySelector('#project-progress-input') as HTMLInputElement;
          const submitButton = this.genericModal.querySelector('button[type="submit"]') as HTMLButtonElement;


          if (editProjectId) {
              const project = this.state.projects.find(p => p.id === editProjectId);
              if (project) {
                  titleEl.textContent = 'Redigera Projekt';
                  idInput.value = project.id;
                  nameInput.value = project.name;
                  customerInput.value = project.customer;
                  deadlineInput.value = project.deadline;
                  progressInput.value = String(project.progress);
              }
          }

          form.onsubmit = async (e) => {
              e.preventDefault();
              if (submitButton.disabled) return;
              submitButton.disabled = true;
              submitButton.textContent = 'Sparar...';

              const progress = parseInt(progressInput.value, 10);
              let status: Project['status'] = 'green';
              if (progress > 85) status = 'red';
              else if (progress > 60) status = 'yellow';

              const projectData: Omit<Project, 'id'> = {
                  name: nameInput.value,
                  customer: customerInput.value,
                  deadline: deadlineInput.value,
                  progress,
                  status,
                  files: editProjectId ? this.state.projects.find(p => p.id === editProjectId)!.files : []
              };

              try {
                if (editProjectId) {
                    const fullProject = { ...projectData, id: editProjectId };
                    await this.updateProjectInDb(fullProject);
                    this.state.projects = this.state.projects.map(p => p.id === editProjectId ? fullProject : p);
                    this.showToast(`Projektet '${projectData.name}' har uppdaterats.`);
                } else {
                    const newProject = await this.createProjectInDb(projectData);
                    this.state.projects.unshift(newProject);
                    this.showToast(`Projektet '${projectData.name}' har skapats.`);
                }
                this.renderAll();
                this.genericModal.classList.remove('active');
              } catch (error) {
                console.error("Failed to save project:", error);
                this.showToast("Kunde inte spara projektet.");
                submitButton.disabled = false;
                submitButton.textContent = 'Spara Projekt';
              }
          };
          this.genericModal.classList.add('active');
      } else {
          this.showToast(`Funktionen för att skapa '${type}' kommer snart.`);
      }
  }
  
  private setGreeting() {
    const greetingEl = document.querySelector('.greeting');
    if (!greetingEl) return;

    const hour = new Date().getHours();
    let greetingText = '';

    if (hour >= 5 && hour < 10) greetingText = 'God morgon';
    else if (hour >= 10 && hour < 12) greetingText = 'God förmiddag';
    else if (hour >= 12 && hour < 18) greetingText = 'God eftermiddag';
    else greetingText = 'God kväll';

    greetingEl.textContent = `${greetingText}, ${this.state.user.name}!`;
  }

  private showToast(message: string) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 5000);
  }

  // --- FILE HANDLING METHODS ---

  private async handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    
    if (this.state.fileUploadContext && files) {
        const { projectId, folderName } = this.state.fileUploadContext;
        await this.addFilesToProject(files, projectId, folderName);
        this.state.fileUploadContext = null; 
    } else if (files && files.length > 0) {
        this.chatInput.value = `Laddade upp filen: ${files[0].name}. Beskriv vad jag ska göra med den.`;
        this.chatInput.focus();
        if(this.currentView !== 'main-chat-view') this.showView('main-chat-view');
    }
    input.value = '';
  }

  private handleDragOver(e: DragEvent) {
      e.preventDefault();
      (e.currentTarget as HTMLElement).classList.add('drag-over');
  }

  private handleDragLeave(e: DragEvent) {
      e.preventDefault();
      (e.currentTarget as HTMLElement).classList.remove('drag-over');
  }

  private handleFileDrop(e: DragEvent) {
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      target.classList.remove('drag-over');
      
      const projectId = target.dataset.projectId;
      const folderName = target.dataset.folderName;
      const files = e.dataTransfer?.files;

      if (projectId && folderName && files) {
          this.addFilesToProject(files, projectId, folderName);
      }
  }

  private async addFilesToProject(files: FileList, projectId: string, folderName: string) {
    const project = this.state.projects.find(p => p.id === projectId);
    if (!project) return;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const newFile: FileItem = {
            id: `file-${Date.now()}-${i}`,
            name: file.name,
            folderName: folderName,
        };
        project.files.push(newFile);
    }
    
    try {
        await this.updateProjectInDb(project);
        this.showToast(`${files.length} fil(er) har laddats upp till '${folderName}'.`);
        this.showProjectDetailView(projectId);
    } catch (error) {
        console.error("Failed to add files:", error);
        this.showToast("Kunde inte ladda upp filerna.");
        // Revert local state if needed
        this.fetchProjectsFromDb();
    }
  }

  // --- SPEECH & CHAT METHODS ---
  private setupSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.voiceInputButton.title = "Röstinmatning stöds inte i din webbläsare.";
      this.voiceInputButton.style.opacity = '0.5';
      this.voiceInputButton.disabled = true;
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.lang = 'sv-SE';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      this.chatInput.value = event.results[0][0].transcript;
      this.sendMessage();
    };

    this.recognition.onaudiostart = () => {
        this.isListening = true;
        this.voiceInputButton.classList.add('is-listening');
    };
    
    this.recognition.onaudioend = () => {
        this.isListening = false;
        this.voiceInputButton.classList.remove('is-listening');
    };

    this.recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if(event.error === 'not-allowed') {
          this.showToast("Ge webbläsaren åtkomst till mikrofonen.");
      }
      this.isListening = false;
      this.voiceInputButton.classList.remove('is-listening');
    };
  }
  
  private toggleVoiceInput() {
      if (!this.recognition) return;
      if (this.isListening) {
          this.recognition.stop();
      } else {
          try {
            this.recognition.start();
          } catch(e) {
            console.error("Could not start recognition:", e);
            if (e instanceof DOMException && e.name === 'NotAllowedError') {
                 this.showToast("Mikrofonåtkomst nekad. Tillåt i webbläsarens inställningar.");
            } else {
                 this.showToast("Kunde inte starta röstinmatning.");
            }
          }
      }
  }

  private addMessage(text: string, sender: 'user' | 'ai', isError = false) {
    const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
    if (welcomeMessage) welcomeMessage.remove();
    
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
    if (isError) {
      messageElement.classList.add('error-message');
      messageElement.innerHTML = `<p>${text}</p>`;
    } else {
      messageElement.innerHTML = sender === 'ai' ? parseMarkdown(text) : `<p>${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;
    }
    this.chatMessages.appendChild(messageElement);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  private async sendMessage() {
    const userInput = this.chatInput.value.trim();
    if (!userInput) return;

    if (this.currentView !== 'main-chat-view') this.showView('main-chat-view');
    await new Promise(resolve => setTimeout(resolve, 0));

    this.addMessage(userInput, 'user');
    this.chatInput.value = '';
    
    if (userInput.toLowerCase() === 'starta guide') {
        this.startOnboardingSequence(true);
        return;
    }

    if (this.isOnboarding) {
        this.handleOnboardingResponse(userInput.toLowerCase());
        return;
    }

    this.loadingIndicator.style.display = 'flex';
    this.sendButton.disabled = true;
    this.chatInput.disabled = true;

    try {
      // --- Use Netlify Function for AI ---
      const res = await fetch('/.netlify/functions/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });
      const data = await res.json();
      this.addMessage(data.text, 'ai');
    } catch (error) {
      console.error("Gemini API error:", error);
      this.addMessage("Ursäkta, något gick fel med anslutningen till AI:n.", 'ai', true);
    } finally {
      this.loadingIndicator.style.display = 'none';
      this.sendButton.disabled = false;
      this.chatInput.disabled = false;
      this.chatInput.focus();
    }
  }

  // --- ONBOARDING METHODS ---
  private startOnboardingSequence(force = false) {
      if (!force && !this.state.user.isNew) return;

      this.isOnboarding = true;
      this.onboardingStep = 1;
      this.showView('main-chat-view');
      this.chatMessages.innerHTML = ''; // Clear chat for onboarding
      this.addMessage(
          "Hej! Välkommen till ByggPilot. Jag ser att det är första gången du loggar in. Vill du att jag ger dig en snabb introduktion och hjälper dig att sätta upp din arbetsyta? Det tar bara en minut. (Skriv 'ja' eller 'nej')",
          'ai'
      );
  }
  
  private handleOnboardingResponse(userInput: string) {
    const isAffirmative = ['ja', 'japp', 'yes', 'ok', 'visst'].some(w => userInput.includes(w));
    const isNegative = ['nej', 'nä', 'no', 'avbryt'].some(w => userInput.includes(w));

    if (this.onboardingStep === 1) {
        if (isAffirmative) {
            this.addMessage("Perfekt! ByggPilot är designat för att leva inuti ditt Google Workspace. För varje projekt du skapar, kommer jag automatiskt att ordna dina filer (som offerter, foton och KMA-dokument) i en snygg mappstruktur i din Google Drive. Du behöver inte tänka på det, det bara funkar. Redo för nästa steg?", 'ai');
            this.onboardingStep = 2;
        } else if (isNegative) {
            this.endOnboarding();
        } else {
            this.addMessage("Jag förstod inte riktigt. Svara gärna 'ja' eller 'nej' för att fortsätta guiden.", 'ai');
        }
    } else if (this.onboardingStep === 2) {
        if (isAffirmative) {
            this.addMessage("Utmärkt. Allt är nu förberett för dig. För att komma igång, klicka på knappen **'Skapa Nytt'** längst upp och välj **'Nytt Projekt'**. Jag finns alltid här i chatten om du har frågor. Lycka till med byggandet!", 'ai');
            this.endOnboarding(false); // End without the extra "I'm here" message
        } else if (isNegative) {
            this.endOnboarding();
        } else {
             this.addMessage("Svara gärna 'ja' eller 'nej' för att fortsätta.", 'ai');
        }
    }
  }
  
  private async endOnboarding(showHelpMessage = true) {
      if (showHelpMessage) {
          this.addMessage("Inga problem! Känn dig som hemma och utforska i din egen takt. Om du ändrar dig kan du bara skriva 'starta guide' till mig. Jag finns här om du behöver något!", 'ai');
      }
      this.isOnboarding = false;
      this.onboardingStep = 0;
      if (this.state.user.isNew) {
        this.state.user.isNew = false;
        await this.updateUserDocument({ isNew: false });
      }
  }


  // --- Settings Methods ---
  private applySettingsVisibility() {
      // Sidebar items
      Object.entries(this.state.settings.sidebar).forEach(([key, visible]) => {
          const navItem = document.querySelector(`.nav-item[data-view="${key}"]`);
          if (navItem) (navItem as HTMLElement).hidden = !visible;
      });
  
      // Dashboard sections based on settings
      const attentionSection = document.querySelector('.dashboard-section[data-section-key="attention"]');
      if (attentionSection) (attentionSection as HTMLElement).hidden = !this.state.settings.dashboard['attention'];
  
      const projectsSection = document.querySelector('.dashboard-section[data-section-key="projects"]');
      if (projectsSection) (projectsSection as HTMLElement).hidden = !this.state.settings.dashboard['projects'];
  }
  
  private renderSettings() {
    const sidebarTogglesContainer = document.getElementById('sidebar-settings');
    const dashboardTogglesContainer = document.getElementById('dashboard-settings');
    if (!sidebarTogglesContainer || !dashboardTogglesContainer) return;

    const createToggle = (key: string, label: string, type: 'sidebar' | 'dashboard', checked: boolean) => {
        if (!label) return '';
        return `
        <div class="toggle-switch">
            <label for="toggle-${key}">${label}</label>
            <label class="switch">
                <input type="checkbox" id="toggle-${key}" data-key="${key}" data-type="${type}" ${checked ? 'checked' : ''}>
                <span class="slider"></span>
            </label>
        </div>`;
    }
    
    const settingsMap = {
        sidebar: { projects: 'Projekt', economy: 'Ekonomi', revisions: 'Revisioner', reports: 'Rapporter', team: 'Team' },
        dashboard: { attention: 'Uppmärksamhet', projects: 'Projektstatus' }
    };

    sidebarTogglesContainer.innerHTML = Object.keys(settingsMap.sidebar).map(key => {
        const label = settingsMap.sidebar[key as keyof typeof settingsMap.sidebar];
        const isChecked = this.state.settings.sidebar?.[key] !== false;
        return createToggle(key, label, 'sidebar', isChecked);
    }).join('');
    
    dashboardTogglesContainer.innerHTML = Object.entries(settingsMap.dashboard).map(([key, label]) => {
        const isChecked = this.state.settings.dashboard?.[key] !== false;
        return createToggle(key, label, 'dashboard', isChecked);
    }).join('');

    this.renderRestoreList();
  }

  private renderRestoreList() {
    const restoreContainer = document.getElementById('restore-projects-list');
    if (!restoreContainer) return;

    const removedProjectsIds = this.state.settings.removedProjects || [];
    if (removedProjectsIds.length === 0) {
        restoreContainer.innerHTML = `<p class="text-color-subtle">Inga borttagna eller arkiverade projekt.</p>`;
        return;
    }

    restoreContainer.innerHTML = removedProjectsIds.map(projectId => {
        const project = this.state.projects.find(p => p.id === projectId);
        const projectName = project ? project.name : `Projekt ${projectId}`;
        return `
            <div class="restore-item">
                <span>${projectName}</span>
                <button data-restore-project-id="${projectId}">Återställ</button>
            </div>`;
    }).join('');
  }
  
  private renderRevisions() {
      const container = document.getElementById('revisions-list-container');
      const template = document.getElementById('revision-item-template') as HTMLTemplateElement;
      if(!container || !template) return;

      container.innerHTML = '';
      const visibleProjects = this.state.projects.filter(p => !this.state.settings.removedProjects.includes(p.id));

      if(visibleProjects.length === 0 && this.state.user.loggedIn) {
          container.innerHTML = `<div class="empty-state"><p>Inga aktiva projekt att skapa underlag för.</p></div>`;
          return;
      }
      
      visibleProjects.forEach(project => {
          const clone = template.content.cloneNode(true) as DocumentFragment;
          const itemEl = clone.firstElementChild as HTMLElement;
          itemEl.dataset.projectId = project.id;
          (itemEl.querySelector('.revision-item-name') as HTMLElement).textContent = project.name;
          container.appendChild(clone);
      });
  }

  // --- FIRESTORE DATA METHODS ---

  private async initializeNewUserInDb(user: User) {
      if (!user) return;
      const userDocRef = doc(this.db, "users", user.uid);
      const initialSettings = this.getInitialState().settings;
      await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          isNew: true,
          settings: initialSettings
      });
  }

  private async updateUserDocument(data: object) {
      if (!this.state.user.uid) return;
      const userDocRef = doc(this.db, "users", this.state.user.uid);
      await updateDoc(userDocRef, data);
  }

  private async fetchProjectsFromDb() {
      if (!this.state.user.uid) return;
      const projectsColRef = collection(this.db, 'users', this.state.user.uid, 'projects');
      const q = query(projectsColRef);
      const querySnapshot = await getDocs(q);
      this.state.projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  }
  
  private async createProjectInDb(projectData: Omit<Project, 'id'>): Promise<Project> {
    if (!this.state.user.uid) throw new Error("User not logged in");
    const projectsColRef = collection(this.db, 'users', this.state.user.uid, 'projects');
    const docRef = await addDoc(projectsColRef, {
        ...projectData,
        createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...projectData };
  }

  private async updateProjectInDb(project: Project) {
      if (!this.state.user.uid) throw new Error("User not logged in");
      const projectDocRef = doc(this.db, 'users', this.state.user.uid, 'projects', project.id);
      const { id, ...dataToSave } = project;
      await setDoc(projectDocRef, dataToSave, { merge: true });
  }

}

document.addEventListener('DOMContentLoaded', () => {
  new ByggPilotApp();
});
