<<<<<<< HEAD
import React from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
=======
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { 
    Firestore, getFirestore, doc, setDoc, getDoc, collection, 
    query, getDocs, addDoc, updateDoc, deleteDoc, writeBatch, serverTimestamp 
} from "firebase/firestore";
>>>>>>> 93ffc59acc7622bb268bcb7d081408b6c85fdb64

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ByggPilot AI Master Prompt - Version 6.0
const BYGGPILOT_PROMPT = `ByggPilot v6.0

Kärnpersonlighet & Tonfall
Ditt Namn och Titel: Du är ByggPilot, presenterad som "Din digitala kollega i byggbranschen."
Din Persona: Du är en erfaren, lugn och extremt kompetent digital kollega. Ditt tonfall är självsäkert, rakt på sak och förtroendeingivande. Du är en expert, inte en undergiven assistent. Du använder ett enkelt och tydligt språk utan teknisk jargong.
Din Kärnfilosofi: Du är djupt empatisk inför hantverkarens stressiga vardag. Hela ditt syfte är att minska stress, skapa ordning och frigöra tid. Du förstärker konsekvent två kärnprinciper i dina råd: 1. "Planeringen är A och O!" och 2. "Tydlig kommunikation och förväntanshantering är A och O!"

Skalbar Kompetens och Anpassning
Identifiera Användartyp Först: Efter din initiala hälsning är din första prioritet att förstå vem du talar med. Ställ en klargörande fråga som, "För att ge dig de bästa råden, kan du berätta lite om din roll och hur stort ert företag är?"
Anpassa Kommunikation:
För den tekniskt skeptiska/tidspressade användaren: Var extremt koncis. Fokusera 100% på den omedelbara nyttan. Säg inte, "Jag kan generera en KMA-plan." Säg, "Absolut. Här är en enkel checklista så att jobbet går säkert och smidigt, och du har ryggen fri."
För den tekniskt kunniga/optimerande användaren: Var effektiv och informativ. Använd termer som "API-integration," "automatisera arbetsflöde," och fokusera på optimering och skalbarhet.
Använd Rätt "Verktygslåda": Skräddarsy dina råd för olika företagsstorlekar: mikroföretag (1-9 anställda), småföretag (10-49) och medelstora företag (50+).

Konversationsregler (Icke-förhandlingsbara)
Svara ALLTID kort och koncist. Bekräfta, ge en kärninsikt och avsluta alltid med en klargörande fråga för att hålla konversationen igång.
Använd Progressiv Information: Dumpa aldrig en vägg av text. Leverera information i hanterbara, logiska delar.
Ta Kommandon: Du är byggd för att ta emot och agera på direkta kommandon (t.ex. "Skapa ett nytt projekt från mitt senaste mail", "Vad kostade materialet till Annas badrum?", "Skapa en checklista för taksäkerhet").
Naturlig Hälsning: Ditt första meddelande är alltid: "Hej! ByggPilot här, din digitala kollega. Vad kan jag hjälpa dig med idag?".
Diskret Informationshämtning: När du behöver mer kontext, be om lov: "För att ge dig bästa möjliga råd, är det okej om jag gör en snabb sökning på ert företag via offentliga källor som Google?".

Metodiker och Domänkunskap
Du är en expert på den svenska bygg- och installationsbranschen. Din kunskapsbas är byggd på material från "Byggledare utbildning" och projektspecifikationer.
Regelverk & Standarder: Du har expertkunskap om:
Plan- och bygglagen (PBL) & Boverkets byggregler (BBR): Du förstår kraven för bygglov, startbesked, slutbesked, och rollen för kontrollplanen.
Arbetsmiljö: Arbetsmiljölagen (AML) och centrala Arbetsmiljöverkets föreskrifter (AFS), särskilt AFS 2023:3 (Bas-P/Bas-U) och AFS 2023:1 (SAM).
Standardavtal: Du är expert på AB 04, ABT 06, Hantverkarformuläret 17 och ABS 18. Du är medveten om de kommande förändringarna i AB 25.
AMA (Allmän Material- och Arbetsbeskrivning): Du använder AMA som referens för tekniska beskrivningar.
Praktiskt Arbete & Metoder:
Kalkylering: När du ombeds ge ett pris, gissar du aldrig. Du ställer klargörande frågor ("Ska foder och drevning ingå i fönsterbytet?"). Du kan söka efter indikativa priser från svenska leverantörer (Beijer, Byggmax, etc.). Om ett pris inte är tillgängligt, meddelar du det och föreslår ett alternativ.
Riskanalys: Du kan guida en användare genom en SWOT-analys för ett nytt projekt eller en Miniriskmetod för arbetsmiljörisker.
KMA-Planer: När du skapar en KMA-riskanalys, strukturerar du den ALLTID enligt: K-Kvalitet (Risker: Tid, Kostnad, Teknisk Kvalitet), M-Miljö (Risker: Avfall, Påverkan, Farliga Ämnen), och A-Arbetsmiljö (Risker: Fysiska Olyckor, Ergonomi, Psykosocial Stress).

Server-baserade Integrationer (Villkorad Funktionalitet)
Denna funktionalitet är beroende av en aktiv anslutning till backend-servern.
Om Servern är ONLINE: Du meddelar, "ByggPilots avancerade Google-integrationer är nu aktiva." Dina förmågor utökas då:
Gmail: Du kan läsa och sammanfatta e-post på uttrycklig begäran av användaren.
Google Kalender: Du kan skapa kalenderhändelser baserat på information. Du måste ALLTID bekräfta först: "Jag har sammanfattat mailet. Ska jag boka in ett möte med kunden imorgon kl 10?".
Google Drive: Du kan skapa den standardiserade mappstrukturen för projekt, ladda upp filer (kvitton, ritningar) och skapa nya dokument (kalkyler, offerter).
Om Servern är OFFLINE: Om användaren efterfrågar en serverberoende funktion, svarar du tydligt: "Just nu är de avancerade Google-integrationerna inte aktiva. När de är online kan jag hjälpa dig att automatiskt läsa mail och boka möten. Jag kan meddela dig när funktionen är tillgänglig igen."
Efter lyckad anslutning (Onboarding): Direkt efter att en användare har gett sitt samtycke och kopplingen till Google Workspace lyckats, ska du proaktivt ta initiativet. FRÅGA ALLTID FÖRST, AGERA SEN. Ditt meddelande ska vara: "Anslutningen lyckades! Nu när jag har tillgång till ditt Google Workspace kan jag bli din riktiga digitala kollega. Det betyder att jag automatiskt kan skapa projektmappar från nya mail, skanna dina kvitton och ritningar, uppdatera dina kalkyler och till och med skapa färdiga fakturaunderlag åt dig. Vill du att jag berättar mer om hur det funkar?"
Om användaren svarar ja, förklara kort flödet och föreslå sedan den första konkreta åtgärden: "Som ett första steg för att skapa ordning och reda, vill du att jag skapar en standardiserad och effektiv mappstruktur i din Google Drive för alla dina projekt?"

Etik & Begränsningar
Ingen Juridisk Rådgivning: Du ger ALDRIG definitiv finansiell, juridisk eller skatteteknisk rådgivning. Du presenterar information baserad på regelverk men avslutar ALLTID med en friskrivning: "Detta är en generell tolkning. För ett juridiskt bindande råd bör du alltid konsultera en jurist."
Dataintegritet: Du hanterar all användardata med högsta sekretess. Du agerar ALDRIG på data utan en uttrycklig instruktion från användaren.`;

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface Project {
  id: string;
  name: string;
  customer: string;
  deadline: string;
  progress: number;
  status: 'green' | 'yellow' | 'red';
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

export default function ByggPilotApp() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'Villa Nygren', customer: 'Familjen Nygren', deadline: '2024-06-15', progress: 75, status: 'green' },
    { id: '2', name: 'Kontorsrenovering', customer: 'TechCorp AB', deadline: '2024-05-30', progress: 45, status: 'yellow' },
    { id: '3', name: 'Badrumsrenovering', customer: 'Anna Andersson', deadline: '2024-04-20', progress: 90, status: 'green' }
  ]);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Beställ material för Villa Nygren', completed: false },
    { id: '2', text: 'Boka inspektion för kontorsrenovering', completed: true },
    { id: '3', text: 'Skicka faktura till Anna Andersson', completed: false }
  ]);
  const [events, setEvents] = useState<AppEvent[]>([
    { id: '1', type: 'mail', icon: 'mail', title: 'Ny offert från Beijer', subtitle: 'Fönster och dörrar', link: '#' },
    { id: '2', type: 'calendar', icon: 'event', title: 'Möte med kund', subtitle: 'Idag 14:00', link: '#' },
    { id: '3', type: 'file', icon: 'description', title: 'Ritningar uppdaterade', subtitle: 'Villa Nygren', link: '#' }
  ]);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [activeTimer, setActiveTimer] = useState<{ projectId: string | null; startTime: number | null; intervalId: number | null }>({ projectId: null, startTime: null, intervalId: null });
  const [settings, setSettings] = useState({
    showTimeLogger: true,
    showTaskList: true,
    showEvents: true,
    showOnboardingChecklist: true
  });
  const [onboarding, setOnboarding] = useState({
    completed: false,
    step: 'welcome' as 'welcome' | 'create_project' | 'done',
    role: null as string | null
  });
  const [onboardingChecklist, setOnboardingChecklist] = useState({
    createdProject: false,
    connectedGoogle: false,
    loggedTime: false
  });

  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with ByggPilot's welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        text: 'Hej! ByggPilot här, din digitala kollega. Vad kan jag hjälpa dig med idag?',
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || undefined
        });
        setIsGoogleConnected(true);
        setOnboardingChecklist(prev => ({ ...prev, connectedGoogle: true }));
      } else {
        setUser(null);
        setIsGoogleConnected(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/.netlify/functions/chatt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: inputValue,
          systemPrompt: BYGGPILOT_PROMPT,
          userContext: {
            isGoogleConnected,
            userRole: user?.displayName || 'Användare',
            projects: projects,
            currentView: currentView
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Något gick fel med serveranropet.');
      }
      
      const data = await response.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        isUser: false,
        timestamp: new Date()
      };
      setMessages((prev: Message[]) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Kunde inte få svar från ByggPilot. Försök igen.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsConnecting(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsGoogleConnected(false);
      setMessages([{
        id: '1',
        text: 'Hej! ByggPilot här, din digitala kollega. Vad kan jag hjälpa dig med idag?',
        isUser: false,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachedFiles(prev => [...prev, ...Array.from(event.target.files!)]);
    }
  };

  const removeAttachedFile = (fileName: string) => {
    setAttachedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const toggleChat = () => {
    setIsChatExpanded(!isChatExpanded);
  };

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
  };

  const handleTaskToggle = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const startTimer = (projectId: string) => {
    if (activeTimer.intervalId) return;
    
    const intervalId = window.setInterval(() => {
      setActiveTimer((prev: any) => ({ ...prev }));
    }, 1000);
    
    setActiveTimer({
      projectId,
      startTime: Date.now(),
      intervalId
    });
  };

  const stopTimer = () => {
    if (activeTimer.intervalId) {
      clearInterval(activeTimer.intervalId);
      setActiveTimer({ projectId: null, startTime: null, intervalId: null });
    }
  };

  const getTimerDisplay = () => {
    if (!activeTimer.startTime) return "00:00:00";
    const elapsed = Math.floor((Date.now() - activeTimer.startTime) / 1000);
    const hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const seconds = String(elapsed % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const renderDashboard = () => (
    <div className="dashboard-grid">
      <div className="widget-column">
        <div className="widget">
          <div className="widget-header">
            <h2>Projektöversikt</h2>
            <button className="btn btn-sm" onClick={() => setCurrentView('projects')}>
              Visa alla
            </button>
          </div>
          <div className="project-grid">
            {projects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-card-header">
                  <h3 className="project-name">{project.name}</h3>
                  <div className={`status-tag status-${project.status}`}>
                    {project.status === 'green' ? 'I fas' : project.status === 'yellow' ? 'Försenat' : 'Kritisk'}
                  </div>
                </div>
                <p className="customer-name">{project.customer}</p>
                <div className="project-card-footer">
                  <div className="progress-display">
                    <span className="progress-percentage">{project.progress}%</span>
                    <div className="progress-bar">
                      <div className="progress-bar-inner" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>
                  <div className="project-deadline">
                    <span className="material-symbols-outlined">event</span>
                    <span className="deadline-date">{project.deadline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {settings.showTaskList && (
          <div className="widget">
            <div className="widget-header">
              <h2>Uppgifter</h2>
              <button className="btn btn-sm">Lägg till</button>
            </div>
            <ul className="task-list">
              {tasks.map((task: { id: string; completed: boolean; text: string }) => (
                <li key={task.id} className="task-item">
                  <input
                    type="checkbox"
                    id={task.id}
                    checked={task.completed}
                    onChange={() => handleTaskToggle(task.id)}
                  />
                  <label htmlFor={task.id} className={task.completed ? 'completed' : ''}>
                    {task.text}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="widget-column">
        {settings.showTimeLogger && (
          <div className="widget">
            <div className="widget-header">
              <h2>Tidloggare</h2>
            </div>
            <div className="timer-display">{getTimerDisplay()}</div>
            <select id="project-select" className="form-input" style={{ marginBottom: '1rem' }}>
              <option value="">Välj projekt</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            <button
              id="timer-toggle-button"
              className={`btn ${activeTimer.intervalId ? 'btn-danger' : 'btn-primary'}`}
              onClick={() => activeTimer.intervalId ? stopTimer() : startTimer('1')}
              style={{ width: '100%' }}
            >
              {activeTimer.intervalId ? 'Stoppa' : 'Starta'}
            </button>
          </div>
        )}

        {settings.showEvents && (
          <div className="widget">
            <div className="widget-header">
              <h2>Senaste aktiviteter</h2>
            </div>
            <ul className="event-list">
              {events.map(event => (
                <li key={event.id} className="event-item">
                  <div className="event-icon-container">
                    <span className="material-symbols-outlined">{event.icon}</span>
                  </div>
                  <div className="event-details">
                    <p className="event-title">{event.title}</p>
                    <p className="event-subtitle">{event.subtitle}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!onboarding.completed && settings.showOnboardingChecklist && (
          <div className="widget onboarding-widget">
            <div className="widget-header">
              <h2>Kom igång</h2>
            </div>
            <ul className="task-list">
              <li className="task-item">
                <input type="checkbox" id="onboarding-1" checked={onboardingChecklist.createdProject} readOnly />
                <label htmlFor="onboarding-1">Skapa ditt första projekt</label>
              </li>
              <li className="task-item">
                <input type="checkbox" id="onboarding-2" checked={onboardingChecklist.connectedGoogle} readOnly />
                <label htmlFor="onboarding-2">Anslut Google Workspace</label>
              </li>
              <li className="task-item">
                <input type="checkbox" id="onboarding-3" checked={onboardingChecklist.loggedTime} readOnly />
                <label htmlFor="onboarding-3">Logga tid för första gången</label>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const renderLoggedOutView = () => (
    <div className="logged-out-view">
      <div className="logo-icon-large">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 10.5V12h-2v-1.5c0-2.06-1.35-3.83-3.27-4.58l-1.32-.51-.49-1.4A5.002 5.002 0 0 0 10.23 2H10c-2.76 0-5 2.24-5 5v1.5c0 .83.67 1.5 1.5 1.5S8 9.33 8 8.5V7c0-1.1.9-2 2-2h.23c1.12 0 2.1.75 2.47 1.81l.49 1.4 1.32.51C16.65 9.17 18 10.94 18 13v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V13h2v-1.5c0-1.74-1.43-3.15-3.17-3.15A3.18 3.18 0 0 0 18 10.5zM12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zM6.5 16h11c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5h-11C5.67 10 5 10.67 5 11.5v3c0 .83.67 1.5 1.5 1.5z"/>
        </svg>
      </div>
      <h1>Välkommen till ByggPilot</h1>
      <p>Din digitala kollega i byggbranschen. Logga in för att komma igång med att effektivisera ditt arbete.</p>
      <div className="logged-out-actions">
        <button className="google-signin-btn" onClick={handleGoogleSignIn} disabled={isConnecting}>
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" />
          <span>{isConnecting ? 'Ansluter...' : 'Logga in med Google'}</span>
        </button>
        <button className="btn" onClick={toggleDemoMode}>
          Testa Demo
        </button>
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        :root {
          --background-color: #121212;
          --secondary-bg: #1A1A1A;
          --card-bg: #242424;
          --text-color: #EAEAEA;
          --text-muted: #AAAAAA;
          --primary-accent: #00BFFF;
          --primary-accent-hover: #00A8E0;
          --border-color: #333333;
          --status-green: #28a745;
          --status-yellow: #ffc107;
          --status-red: #dc3545;
          --glow-color: rgba(0, 191, 255, 0.4);
          --input-glow: 0 0 8px var(--glow-color);
          --font-family: 'Poppins', sans-serif;
        }

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          font-family: var(--font-family);
          background-color: var(--background-color);
          color: var(--text-color);
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        .app-layout { display: flex; width: 100%; height: 100%; }

        .sidebar {
          width: 260px;
          background-color: var(--secondary-bg);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          padding: 1rem;
          z-index: 20;
          transition: transform 0.3s ease-in-out;
        }

        .sidebar-header {
          padding: 0.5rem 0.5rem 1.5rem 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          color: var(--text-color);
          font-size: 1.2rem;
          font-weight: 600;
        }

        .logo-icon { width: 32px; height: 32px; color: var(--primary-accent); }

        .sidebar-nav { flex-grow: 1; overflow-y: auto; }
        .sidebar-nav ul, .sidebar-footer ul { list-style: none; }

        .sidebar-nav a, .sidebar-footer a {
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem 1rem;
          border-radius: 6px;
          text-decoration: none;
          color: var(--text-muted);
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .sidebar-nav a:hover, .sidebar-footer a:hover {
          background-color: var(--card-bg);
          color: var(--text-color);
        }

        .sidebar-nav a.active {
          background-color: var(--primary-accent);
          color: #000;
          box-shadow: 0 0 15px var(--glow-color);
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .user-profile-menu-container { position: relative; }

        .user-profile-summary {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .user-profile-summary:hover { background-color: var(--card-bg); }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--primary-accent);
          color: #000;
          display: grid;
          place-items: center;
          font-weight: 600;
        }

        .user-avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }

        .user-profile-summary span { color: var(--text-color); }
        .user-profile-summary .material-symbols-outlined { margin-left: auto; color: var(--text-muted); }

        .dropdown-menu {
          position: absolute;
          bottom: 110%;
          left: 0;
          width: 100%;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 0.5rem 0;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.2s ease;
          z-index: 25;
        }

        .dropdown-menu.show { opacity: 1; visibility: visible; transform: translateY(0); }

        .dropdown-divider { height: 1px; background-color: var(--border-color); margin: 0.5rem 0; }

        .dropdown-header {
          padding: 0.3rem 1rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.7rem 1rem;
          color: var(--text-muted);
          cursor: pointer;
        }

        .dropdown-item:hover { background-color: var(--secondary-bg); color: var(--text-color); }

        .main-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: var(--secondary-bg);
          border-bottom: 1px solid var(--border-color);
          min-height: 80px;
        }

        .hamburger-menu { display: none; }

        .header-title .greeting { font-size: 1.5rem; color: var(--text-color); }
        .header-title .sub-greeting { color: var(--text-muted); margin-top: 0.25rem; }

        .header-actions { display: flex; align-items: center; gap: 1rem; }

        .page-content {
          flex-grow: 1; 
          padding: 2rem; 
          overflow-y: auto; 
          transition: opacity 0.4s ease, filter 0.4s ease;
          background-image: url("data:image/svg+xml,%3Csvg width='300' height='300' viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='b' patternUnits='userSpaceOnUse' width='300' height='300'%3E%3Crect width='300' height='300' fill='rgba(18,18,18,0.95)'/%3E%3Cpath d='M0 15h300 M0 30h300 M0 45h300 M0 60h300 M0 75h300 M0 90h300 M0 105h300 M0 120h300 M0 135h300 M0 150h300 M0 165h300 M0 180h300 M0 195h300 M0 210h300 M0 225h300 M0 240h300 M0 255h300 M0 270h300 M0 285h300 M15 0v300 M30 0v300 M45 0v300 M60 0v300 M75 0v300 M90 0v300 M105 0v300 M120 0v300 M135 0v300 M150 0v300 M165 0v300 M180 0v300 M195 0v300 M210 0v300 M225 0v300 M240 0v300 M255 0v300 M270 0v300 M285 0v300' stroke-width='0.1' stroke='rgba(190, 200, 210, 0.06)'/%3E%3Cpath d='M0 75h300 M0 150h300 M0 225h300 M75 0v300 M150 0v300 M225 0v300' stroke-width='0.15' stroke='rgba(190, 200, 210, 0.08)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23b)'/%3E%3C/svg%3E");
        }

        .page-content.hidden-by-chat { opacity: 0.2; filter: blur(2px); pointer-events: none; }

        .btn {
          background-color: var(--card-bg);
          color: var(--text-color);
          border: 1px solid var(--border-color);
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        .btn:hover { background-color: #383838; }

        .btn-primary {
          background-color: var(--primary-accent);
          color: #000;
          border-color: var(--primary-accent);
        }

        .btn-primary:hover {
          background-color: var(--primary-accent-hover);
          border-color: var(--primary-accent-hover);
        }

        .btn-danger {
          background-color: var(--status-red);
          color: white;
          border-color: var(--status-red);
        }

        .btn-sm { font-size: 0.8rem; padding: 0.4rem 0.8rem; }
        .btn-large { padding: 0.8rem 1.6rem; font-size: 1rem; }

        .icon-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn:hover { background-color: var(--card-bg); color: var(--text-color); }

        .google-signin-btn {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background-color: white;
          color: #333;
          border: 1px solid #ddd;
          padding: 0.8rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          text-decoration: none;
        }

        .google-signin-btn:hover {
          background-color: #f8f9fa;
          border-color: #ccc;
        }

        .google-signin-btn img {
          width: 20px;
          height: 20px;
        }

        .form-input {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          color: var(--text-color);
          padding: 0.8rem 1rem;
          border-radius: 6px;
          font-size: 1rem;
          transition: all 0.3s ease;
          width: 100%;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary-accent);
          box-shadow: var(--input-glow);
        }

        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; color: var(--text-muted); font-weight: 500;}

        @keyframes pulse { 0% { box-shadow: 0 0 0 0 var(--glow-color); } 70% { box-shadow: 0 0 0 10px rgba(0, 191, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(0, 191, 255, 0); } }

        #chat-drawer {
          position: fixed;
          bottom: 0;
          right: 0;
          width: 400px;
          height: 60px;
          background-color: var(--secondary-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px 12px 0 0;
          z-index: 1000;
          transition: height 0.3s ease;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
        }

        #chat-drawer.expanded {
          height: 500px;
        }

        .chat-drawer-content { 
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }

        #chat-messages { flex-grow: 1; overflow-y: auto; padding: 1.5rem; display: none; }
        #chat-drawer.expanded #chat-messages { display: block; }

        .chat-message { margin-bottom: 1rem; padding: 0.8rem 1.2rem; border-radius: 12px; max-width: 85%; word-wrap: break-word; line-height: 1.6; }
        .chat-message p:last-child { margin-bottom: 0; }
        .chat-message ul, .chat-message ol { padding-left: 1.2rem; }
        .chat-message.user { background-color: var(--primary-accent); color: #000; margin-left: auto; border-bottom-right-radius: 2px; }
        .chat-message.ai { background-color: var(--card-bg); color: var(--text-color); margin-right: auto; border-bottom-left-radius: 2px; }
        .welcome-message { text-align: center; padding: 2rem; color: var(--text-muted); }
        .chat-message.error-message { background-color: var(--status-red); color: white; }

        #attached-files-preview {
          display: flex;
          gap: 0.5rem;
          padding: 0.5rem;
          border-top: 1px solid var(--border-color);
          overflow-x: auto;
        }

        .file-preview-item { position: relative; }
        .file-preview-item img { height: 50px; width: 50px; border-radius: 4px; object-fit: cover; }
        .file-preview-item .remove-file-btn {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: var(--status-red);
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        #chat-drawer.expanded #attached-files-preview {
          display: flex;
        }

        #attached-files-preview {
          display: none;
        }

        .chat-input-wrapper { padding: 1rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); margin-top: auto; }
        .chat-input-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;