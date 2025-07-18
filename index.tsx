import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import './index.css';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log('Firebase config:', {
  apiKey: firebaseConfig.apiKey ? '***configured***' : 'missing',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId ? '***configured***' : 'missing'
});

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Konfigurera Google Provider för optimal popup-funktionalitet
provider.setCustomParameters({
  prompt: 'select_account',
  hd: '', // Tillåt alla domäner
});

// Lägg till extra debugging för OAuth
console.log('Current window.location.origin:', window.location.origin);
console.log('Auth domain from config:', firebaseConfig.authDomain);

// Add Google scopes for ByggPilot integration
provider.addScope('https://www.googleapis.com/auth/calendar');
provider.addScope('https://www.googleapis.com/auth/gmail.modify');
provider.addScope('https://www.googleapis.com/auth/documents');
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
provider.addScope('https://www.googleapis.com/auth/userinfo.email');

console.log('Firebase auth och provider konfigurerade för popup-inloggning');

// ByggPilot AI Master Prompt - Version 6.0
const BYGGPILOT_PROMPT = `Du är ByggPilot - en kort, tydlig och hjälpsam digital kollega för svenska byggföretag.

KOMMUNIKATIONSREGLER:
- Svara ALLTID kort och koncist (max 2-3 meningar)
- Använd enkelt språk utan jargong
- Avsluta alltid med en hjälpsam följdfråga
- Fokusera på en sak i taget

EXPERTOMRÅDEN:
- Projektledning och planering
- Materialberäkningar och kostnader
- Svensk bygglagstiftning (PBL, BBR, AML)
- Arbetsmiljö och säkerhet
- Kalkyler och offerter
- Kundkommunikation

EXEMPEL PÅ BRA SVAR:
Användare: "Beräkna material för 20 kvm kakel"
ByggPilot: "För 20 kvm behöver du ca 21 kvm kakel (5% spill), lim och fog. Vilket sorts kakel tänker du på så kan jag ge en kostnadskalkyl?"

Användare: "Skapa en dagsrapport"
ByggPilot: "Jag skapar en strukturerad dagsrapport. Vilket projekt gäller det och vad har ni gjort idag?"

Var alltid hjälpsam, professionell och målinriktad.`;

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
  const [isDemoMode, setIsDemoMode] = useState(true);
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

  // Initialize with ByggPilot's proactive welcome messages
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: 'Hej! Jag är ByggPilot, din digitala kollega. Vad kan jag hjälpa dig med idag?',
          isUser: false,
          timestamp: new Date()
        },
        {
          id: '2',
          text: 'För att ge dig de bästa råden, kan du berätta lite kort om din roll och vad ert företag heter?',
          isUser: false,
          timestamp: new Date()
        }
      ]);
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
        setIsDemoMode(false); // Turn off demo mode when user is logged in
        setOnboardingChecklist(prev => ({ ...prev, connectedGoogle: true }));
      } else {
        setUser(null);
        setIsGoogleConnected(false);
        setIsDemoMode(true); // Enable demo mode when user is logged out
      }
    });
    return () => unsubscribe();
  }, []);

  // Check for redirect result on app load
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('Google redirect sign-in successful:', result.user);
          
          // Stäng av demo-läget när inloggning lyckas
          setIsDemoMode(false);
          
          // Lägg till meddelande om lyckad inloggning
          const welcomeMessage = {
            id: Date.now().toString(),
            text: `Välkommen ${result.user.displayName?.split(' ')[0] || 'tillbaka'}! Nu är du inloggad och kan synkronisera dina projekt och uppgifter med ditt Google Workspace.`,
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, welcomeMessage]);
        }
      } catch (error) {
        console.error('Redirect result error:', error);
      }
    };
    
    checkRedirectResult();
  }, []);

  // Load user projects from Firestore
  useEffect(() => {
    if (!user) {
      // Behåll demo-data om användaren inte är inloggad
      if (!isDemoMode) {
        setProjects([]);
      }
      return;
    }

    const projectsCollectionRef = collection(db, 'users', user.uid, 'projects');
    const q = query(projectsCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsFromDb = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsFromDb);
    });

    return () => unsubscribe();
  }, [user, isDemoMode]);

  // Load user tasks from Firestore
  useEffect(() => {
    if (!user) {
      // Behåll demo-data om användaren inte är inloggad
      if (!isDemoMode) {
        setTasks([]);
      }
      return;
    }

    const tasksCollectionRef = collection(db, 'users', user.uid, 'tasks');
    const q = query(tasksCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksFromDb = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(tasksFromDb);
    });

    return () => unsubscribe();
  }, [user, isDemoMode]);

  // Load user messages from Firestore
  useEffect(() => {
    if (!user) {
      setMessages([
        {
          id: '1',
          text: 'Hej! Jag är ByggPilot, din digitala kollega. Vad kan jag hjälpa dig med idag?',
          isUser: false,
          timestamp: new Date()
        },
        {
          id: '2',
          text: 'För att ge dig de bästa råden, kan du berätta lite kort om din roll och vad ert företag heter?',
          isUser: false,
          timestamp: new Date()
        }
      ]);
      return;
    }

    const messagesCollectionRef = collection(db, 'users', user.uid, 'messages');
    const q = query(messagesCollectionRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesFromDb = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as Message[];
      
      if (messagesFromDb.length === 0) {
        setMessages([{
          id: '1',
          text: 'Hej! ByggPilot här, din digitala kollega. Vad kan jag hjälpa dig med idag?',
          isUser: false,
          timestamp: new Date()
        }]);
      } else {
        setMessages(messagesFromDb);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    // Save user message to Firestore if logged in
    if (user) {
      await saveChatMessage(userMessage);
    } else {
      setMessages((prev: Message[]) => [...prev, userMessage]);
    }
    
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
      
      // Save AI message to Firestore if logged in
      if (user) {
        await saveChatMessage(aiMessage);
      } else {
        setMessages((prev: Message[]) => [...prev, aiMessage]);
      }
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Kunde inte få svar från ByggPilot. Försök igen.',
        isUser: false,
        timestamp: new Date()
      };
      
      if (user) {
        await saveChatMessage(errorMessage);
      } else {
        setMessages((prev: Message[]) => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsConnecting(true);
    console.log('=== Google Sign-In Debug Info ===');
    console.log('Current window.location:', window.location.href);
    console.log('Current domain:', window.location.hostname);
    console.log('=== OAuth Client Check ===');
    
    // Temporary fallback för ny klient-ID
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '975739376169-vk63mf3f54dnjitqjk1beigijg9gitkc.apps.googleusercontent.com';
    console.log('Using Client ID:', clientId);
    
    try {
      console.log('Försöker logga in med Google...');
      console.log('Firebase Auth:', auth);
      console.log('Google Provider:', provider);
      
      // Konfigurera provider för popup
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Try popup first, fallback to redirect
      try {
        console.log('Försöker popup-inloggning först...');
        const result = await signInWithPopup(auth, provider);
        console.log('Popup sign-in successful:', result.user);
        
        // Stäng av demo-läget när inloggning lyckas
        setIsDemoMode(false);
        
        // Lägg till meddelande om lyckad inloggning
        const welcomeMessage = {
          id: Date.now().toString(),
          text: `Välkommen ${result.user.displayName?.split(' ')[0] || 'tillbaka'}! Nu är du inloggad och kan synkronisera dina projekt och uppgifter med ditt Google Workspace.`,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, welcomeMessage]);
        
      } catch (popupError: any) {
        console.log('Popup failed, trying redirect...', popupError);
        
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/cancelled-popup-request') {
          console.log('Försöker redirect-inloggning...');
          await signInWithRedirect(auth, provider);
          return; // Funktionen avslutas här, redirect sker
        } else {
          throw popupError; // Re-throw other errors
        }
      }
      
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Visa specifikt felmeddelande till användaren
      let errorMessage = 'Kunde inte logga in med Google. ';
      if (error.code === 'auth/popup-blocked') {
        errorMessage += 'Popup-fönstret blockerades av webbläsaren. Kontrollera att popup-blockerare är avstängd för denna sida.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage += 'Inloggningsfönstret stängdes innan inloggningen var klar. Försök igen.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage += 'En annan inloggning pågår redan. Vänta ett ögonblick och försök igen.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage += 'Denna domän är inte auktoriserad för Google-inloggning. Kontakta administratören.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage += 'Google-inloggning är inte aktiverat för detta projekt. Kontakta administratören.';
      } else if (error.message.toLowerCase().includes('utvecklare') || error.message.toLowerCase().includes('developer')) {
        errorMessage += 'Firebase accepterar inte localhost-domäner. Använd Demo-läget för utveckling.';
      } else if (error.code === 'auth/invalid-api-key' || error.message.includes('deleted_client') || error.message.includes('OAuth client')) {
        errorMessage += 'Google OAuth-klienten behöver konfigureras om. Kontakta administratören.';
      } else {
        errorMessage += `Tekniskt fel: ${error.message}. Försök igen senare.`;
      }
      
      const errorMessageObj = {
        id: Date.now().toString(),
        text: errorMessage,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessageObj]);
      
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsGoogleConnected(false);
      setIsDemoMode(true); // Aktivera demo-läget igen när man loggar ut
      setMessages([
        {
          id: '1',
          text: 'Hej! Jag är ByggPilot, din digitala kollega. Vad kan jag hjälpa dig med idag?',
          isUser: false,
          timestamp: new Date()
        },
        {
          id: '2',
          text: 'För att ge dig de bästa råden, kan du berätta lite kort om din roll och vad ert företag heter?',
          isUser: false,
          timestamp: new Date()
        }
      ]);
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

  const handleTaskToggle = async (taskId: string) => {
    if (!user) return;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    await handleUpdateTask(taskId, { completed: !task.completed });
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

  // Funktion för tidsanpassade hälsningar
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 10) {
      return "God morgon!";
    } else if (hour >= 10 && hour < 12) {
      return "God förmiddag!";
    } else if (hour >= 12 && hour < 17) {
      return "God eftermiddag!";
    } else if (hour >= 17 && hour < 22) {
      return "God kväll!";
    } else {
      return "God natt!";
    }
  };

  // Funktion för välkomstmeddelande baserat på tid
  const getWelcomeSubtitle = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 10) {
      return "Här är en översikt över dina projekt och dagens aktiviteter. Dags att sätta igång!";
    } else if (hour >= 10 && hour < 12) {
      return "Här är en översikt över dina projekt och aktiviteter. Hur går morgonens arbete?";
    } else if (hour >= 12 && hour < 17) {
      return "Här är en översikt över dina projekt och aktiviteter. Hur går dagen?";
    } else if (hour >= 17 && hour < 22) {
      return "Här är en översikt över dina projekt och aktiviteter. Dags att summera dagen!";
    } else {
      return "Här är en översikt över dina projekt och aktiviteter. Vila gott!";
    }
  };

  // Function to create a new project
  const handleCreateProject = async (projectName: string, customerName: string, deadline?: string) => {
    if (!user) {
      console.error("Du måste vara inloggad för att skapa projekt.");
      return;
    }

    const projectsCollectionRef = collection(db, 'users', user.uid, 'projects');

    try {
      await addDoc(projectsCollectionRef, {
        name: projectName,
        customer: customerName,
        deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        progress: 0,
        status: 'green',
        createdAt: serverTimestamp()
      });
      console.log("Projekt skapat!");
      setOnboardingChecklist(prev => ({ ...prev, createdProject: true }));
    } catch (error) {
      console.error("Fel vid skapande av projekt: ", error);
    }
  };

  // Function to update project
  const handleUpdateProject = async (projectId: string, updates: Partial<Project>) => {
    if (!user) return;

    const projectRef = doc(db, 'users', user.uid, 'projects', projectId);

    try {
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log("Projekt uppdaterat!");
    } catch (error) {
      console.error("Fel vid uppdatering av projekt: ", error);
    }
  };

  // Function to create a new task
  const handleCreateTask = async (taskText: string, projectId?: string) => {
    if (!user) {
      console.error("Du måste vara inloggad för att skapa uppgifter.");
      return;
    }

    const tasksCollectionRef = collection(db, 'users', user.uid, 'tasks');

    try {
      await addDoc(tasksCollectionRef, {
        text: taskText,
        completed: false,
        projectId: projectId || null,
        createdAt: serverTimestamp()
      });
      console.log("Uppgift skapad!");
    } catch (error) {
      console.error("Fel vid skapande av uppgift: ", error);
    }
  };

  // Function to update task
  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!user) return;

    const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);

    try {
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log("Uppgift uppdaterad!");
    } catch (error) {
      console.error("Fel vid uppdatering av uppgift: ", error);
    }
  };

  // Function to save chat message to Firestore
  const saveChatMessage = async (message: Message) => {
    if (!user) return;

    const messagesCollectionRef = collection(db, 'users', user.uid, 'messages');

    try {
      await addDoc(messagesCollectionRef, {
        text: message.text,
        isUser: message.isUser,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Fel vid sparande av meddelande: ", error);
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Onboarding modal component
  const renderOnboardingModal = () => {
    if (onboarding.completed || !user) return null;

    if (onboarding.step === 'welcome') {
      return (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Välkommen till ByggPilot!</h2>
            <p>Låt oss komma igång med ditt första projekt så att du kan se hur ByggPilot kan hjälpa dig.</p>
            <div className="modal-actions">
              <button 
                className="btn btn-primary" 
                onClick={() => setOnboarding(prev => ({ ...prev, step: 'create_project' }))}
              >
                Skapa mitt första projekt
              </button>
              <button 
                className="btn" 
                onClick={() => setOnboarding(prev => ({ ...prev, completed: true }))}
              >
                Hoppa över
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (onboarding.step === 'create_project') {
      return (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Skapa ditt första projekt</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const projectName = formData.get('projectName') as string;
              const customerName = formData.get('customerName') as string;
              const deadline = formData.get('deadline') as string;
              
              handleCreateProject(projectName, customerName, deadline);
              setOnboarding({ completed: true, step: 'done', role: null });
            }}>
              <div className="form-group">
                <label htmlFor="projectName">Projektnamn</label>
                <input 
                  type="text" 
                  id="projectName" 
                  name="projectName" 
                  className="form-input" 
                  placeholder="t.ex. Villa Andersson" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="customerName">Kundnamn</label>
                <input 
                  type="text" 
                  id="customerName" 
                  name="customerName" 
                  className="form-input" 
                  placeholder="t.ex. Familjen Andersson" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="deadline">Deadline (valfritt)</label>
                <input 
                  type="date" 
                  id="deadline" 
                  name="deadline" 
                  className="form-input" 
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Skapa projekt
                </button>
                <button 
                  type="button" 
                  className="btn" 
                  onClick={() => setOnboarding(prev => ({ ...prev, step: 'welcome' }))}
                >
                  Tillbaka
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderMainContent = () => {
    if (!user && !isDemoMode) {
      return renderLoggedOutView();
    }

    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'projects':
        return renderProjectsView();
      case 'tasks':
        return renderTasksView();
      case 'calendar':
        return renderCalendarView();
      case 'files':
        return renderFilesView();
      case 'how-it-works':
        return renderHowItWorksView();
      case 'settings':
        return renderSettingsView();
      default:
        return renderDashboard();
    }
  };

  const renderHowItWorksView = () => (
    <div className="how-it-works-view">
      <div className="page-header">
        <h1>Så funkar ByggPilot</h1>
        <p className="page-subtitle">
          ByggPilot är din digitala kollega som hjälper dig att organisera och optimera ditt byggföretag. 
          Genom att integrera med ditt Google Workspace får du en samlad plattform för projektledning, 
          tidsrapportering och kommunikation.
        </p>
      </div>
      
      <div className="example-cards-grid">
        <div className="example-card">
          <div className="example-icon">
            <span className="material-symbols-outlined">schedule</span>
          </div>
          <h3>Tidsrapportering</h3>
          <p>
            "Jag behöver logga tid för Villa Andersson idag"
          </p>
          <div className="example-response">
            <strong>ByggPilot svarar:</strong> Jag startar tidloggningen för Villa Andersson. 
            Vill du att jag också förbereder dagens dagsrapport?
          </div>
        </div>

        <div className="example-card">
          <div className="example-icon">
            <span className="material-symbols-outlined">engineering</span>
          </div>
          <h3>Projektfrågor</h3>
          <p>
            "Vilka material behöver vi för badrumsprojektet?"
          </p>
          <div className="example-response">
            <strong>ByggPilot svarar:</strong> Baserat på dina tidigare projekt behöver ni troligen 
            kakel, tätning, rör och armaturer. Ska jag skapa en detaljerad materialista?
          </div>
        </div>

        <div className="example-card">
          <div className="example-icon">
            <span className="material-symbols-outlined">description</span>
          </div>
          <h3>Dokumenthantering</h3>
          <p>
            "Skapa en dagsrapport för Villa Nygren"
          </p>
          <div className="example-response">
            <strong>ByggPilot svarar:</strong> Jag skapar en dagsrapport med dagens utförda arbeten, 
            väderlek och nästa steg. Ska jag skicka den till kunden också?
          </div>
        </div>

        <div className="example-card">
          <div className="example-icon">
            <span className="material-symbols-outlined">calculate</span>
          </div>
          <h3>Ekonomi & Kalkyl</h3>
          <p>
            "Beräkna materialkostnad för 50 kvm kakel"
          </p>
          <div className="example-response">
            <strong>ByggPilot svarar:</strong> För 50 kvm kakel behöver ni ca 52-55 kvm (5% spill). 
            Med genomsnittspris 400 kr/kvm blir det ca 21 000 kr + lim och fog.
          </div>
        </div>

        <div className="example-card">
          <div className="example-icon">
            <span className="material-symbols-outlined">groups</span>
          </div>
          <h3>Kundkommunikation</h3>
          <p>
            "Förklara för kunden varför vi blir försenade"
          </p>
          <div className="example-response">
            <strong>ByggPilot svarar:</strong> Jag formulerar ett professionellt meddelande som 
            förklarar situationen och ger ny tidsplan. Ska jag skicka det via e-post?
          </div>
        </div>

        <div className="example-card">
          <div className="example-icon">
            <span className="material-symbols-outlined">search</span>
          </div>
          <h3>Leverantörssökning</h3>
          <p>
            "Hitta leverantör av specialkakel i Stockholmsområdet"
          </p>
          <div className="example-response">
            <strong>ByggPilot svarar:</strong> Här är tre pålitliga leverantörer: Bygg-Ole, 
            Kakelcentralen och Stonefactory. Vill du att jag jämför priser åt dig?
          </div>
        </div>
      </div>

      <div className="how-it-works-section">
        <h2>Kom igång på 3 enkla steg</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Anslut Google Workspace</h3>
            <p>Logga in med ditt Google-konto för att synkronisera kalendrar, e-post och filer.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Skapa ditt första projekt</h3>
            <p>Lägg till projektinformation så ByggPilot kan ge personliga råd och hjälpa med planering.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Börja chatta</h3>
            <p>Ställ frågor, begär hjälp med kalkyler eller låt ByggPilot skapa rapporter åt dig.</p>
          </div>
        </div>
      </div>
    </div>
  );

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

  const renderProjectsView = () => (
    <div className="projects-view">
      <h1>Projekt</h1>
      <p>Projektvy kommer snart...</p>
    </div>
  );

  const renderTasksView = () => (
    <div className="tasks-view">
      <h1>Uppgifter</h1>
      <p>Uppgiftsvy kommer snart...</p>
    </div>
  );

  const renderCalendarView = () => (
    <div className="calendar-view">
      <h1>Kalender</h1>
      <p>Kalendervy kommer snart...</p>
    </div>
  );

  const renderFilesView = () => (
    <div className="files-view">
      <h1>Filer</h1>
      <p>Filvy kommer snart...</p>
    </div>
  );

  const renderSettingsView = () => (
    <div className="settings-view">
      <h1>Inställningar</h1>
      <div className="settings-grid">
        <div className="settings-section">
          <h2>Visningsinställningar</h2>
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                checked={settings.showTimeLogger} 
                onChange={(e) => setSettings(prev => ({ ...prev, showTimeLogger: e.target.checked }))}
              />
              Visa tidloggning
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                checked={settings.showTaskList} 
                onChange={(e) => setSettings(prev => ({ ...prev, showTaskList: e.target.checked }))}
              />
              Visa uppgiftslista
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                checked={settings.showEvents} 
                onChange={(e) => setSettings(prev => ({ ...prev, showEvents: e.target.checked }))}
              />
              Visa aktiviteter
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                checked={settings.showOnboardingChecklist} 
                onChange={(e) => setSettings(prev => ({ ...prev, showOnboardingChecklist: e.target.checked }))}
              />
              Visa kom igång-checklista
            </label>
          </div>
        </div>
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
      <h1 className="dashboard-header">{getTimeBasedGreeting()}</h1>
      <p className="dashboard-subtitle">{getWelcomeSubtitle()}</p>
      <div className="logged-out-actions">
        <button className="google-signin-btn" onClick={handleGoogleSignIn} disabled={isConnecting}>
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>{isConnecting ? 'Omdirigerar till Google...' : 'Logga in med Google'}</span>
        </button>
        {!isConnecting && (
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px', textAlign: 'center' }}>
            Du kommer att omdirigeras till Google för säker inloggning
          </p>
        )}
        <button className="google-signin-btn" onClick={() => setIsDemoMode(true)}>
          Fortsätt i Demo-läge
        </button>
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{__html: `
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
          width: 18px;
          height: 18px;
          margin-right: 0.5rem;
        }

        .google-signin-btn svg {
          width: 20px;
          height: 20px;
          margin-right: 0.5rem;
        }

        .google-signin-btn:last-child {
          background-color: var(--card-bg);
          color: var(--text-color);
          border-color: var(--border-color);
        }

        .google-signin-btn:last-child:hover {
          background-color: #383838;
        }

        .logged-out-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          padding: 2rem;
          color: var(--text-color);
        }

        .logo-icon-large {
          width: 80px;
          height: 80px;
          color: var(--primary-accent);
          margin-bottom: 2rem;
        }

        .logged-out-view h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--text-color);
        }

        .logged-out-view p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          color: var(--text-muted);
          max-width: 500px;
        }

        .logged-out-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
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
        }

        .chat-input {
          flex-grow: 1;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 0.8rem 1rem;
          color: var(--text-color);
          font-size: 1rem;
          transition: all 0.3s ease;
          width: 100%;
        }

        .chat-input:focus {
          outline: none;
          border-color: var(--primary-accent);
          box-shadow: var(--input-glow);
        }

        .send-message-btn {
          background-color: var(--primary-accent);
          color: #000;
          border: none;
          border-radius: 6px;
          padding: 0.8rem 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .send-message-btn:hover {
          background-color: var(--primary-accent-hover);
        }

        .chat-drawer-header {
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-drawer-title {
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--text-color);
        }

        .close-chat-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 1.2rem;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
          min-height: 40px;
          margin-right: 8px; /* Avoid scrollbar overlap */
        }

        .close-chat-btn:hover {
          color: var(--text-color);
          background: rgba(0,0,0,0.05);
        }

        .demo-mode-banner {
          background-color: var(--status-yellow);
          color: #000;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .demo-mode-banner .material-symbols-outlined {
          font-size: 1.2rem;
          color: inherit;
        }

        .onboarding-widget {
          background-color: var(--secondary-bg);
          padding: 1rem;
          border-radius: 6px;
          border: 1px solid var(--border-color);
        }

        .onboarding-widget h2 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: var(--text-color);
        }

        .onboarding-widget .task-list {
          padding-left: 1.2rem;
        }

        .onboarding-widget .task-item {
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .onboarding-widget .task-item input {
          cursor: pointer;
        }

        .onboarding-widget .task-item label {
          margin: 0;
          color: var(--text-muted);
          font-weight: 500;
        }

        .welcome-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          padding: 2rem;
          color: var(--text-color);
        }

        .welcome-screen h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .welcome-screen p {
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .project-card {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 1rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .project-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .project-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .project-name {
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--text-color);
          margin: 0;
        }

        .status-tag {
          padding: 0.3rem 0.6rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          color: #fff;
          display: inline-block;
        }

        .status-green { background-color: var(--status-green); }
        .status-yellow { background-color: var(--status-yellow); }
        .status-red { background-color: var(--status-red); }

        .project-card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .progress-display {
          flex-grow: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .progress-percentage {
          font-weight: 500;
          color: var(--text-color);
        }

        .progress-bar {
          flex-grow: 1;
          height: 8px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar-inner {
          height: 100%;
          background-color: var(--primary-accent);
          border-radius: 4px;
        }

        .project-deadline {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .deadline-date {
          font-weight: 500;
          color: var(--text-color);
        }

        .task-list {
          padding-left: 1.2rem;
        }

        .task-item {
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .task-item input {
          cursor: pointer;
        }

        .task-item label {
          margin: 0;
          color: var(--text-muted);
          font-weight: 500;
        }

        .timer-display {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 1rem;
        }

        .event-list {
          padding-left: 1.2rem;
        }

        .event-item {
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .event-icon-container {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
        }

        .event-title {
          font-weight: 500;
          color: var(--text-color);
          margin: 0;
        }

        .event-subtitle {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .welcome-message {
          text-align: center;
          padding: 2rem;
          color: var(--text-muted);
        }

        .error-message {
          color: var(--status-red);
          font-weight: 500;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
          background-color: var(--secondary-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease-out;
        }

        .modal-content h2 {
          margin-bottom: 1rem;
          color: var(--text-color);
          font-size: 1.5rem;
        }

        .modal-content p {
          margin-bottom: 1.5rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* How It Works Page Styles */
        .how-it-works-view {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
        }

        .example-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .example-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .example-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .example-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.15);
        }

        .example-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }

        .example-icon .material-symbols-outlined {
          color: white;
          font-size: 28px;
        }

        .example-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .example-card > p {
          font-style: italic;
          color: #4a5568;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .example-response {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          padding: 1.25rem;
          border-radius: 12px;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .example-response strong {
          color: #667eea;
          display: block;
          margin-bottom: 0.5rem;
        }

        .how-it-works-section {
          text-align: center;
          margin-top: 4rem;
        }

        .how-it-works-section h2 {
          font-size: 2rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 3rem;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
          margin-top: 2rem;
        }

        .step-card {
          background: white;
          border-radius: 16px;
          padding: 2.5rem 2rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s ease;
          position: relative;
        }

        .step-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }

        .step-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .step-card h3 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .step-card p {
          color: #666;
          line-height: 1.6;
        }

        /* Settings Page Styles */
        .settings-view {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .settings-view h1 {
          font-size: 2rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 2rem;
        }

        .settings-grid {
          display: grid;
          gap: 2rem;
        }

        .settings-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }

        .settings-section h2 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
        }

        .setting-item {
          margin-bottom: 1rem;
        }

        .setting-item label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          font-size: 1rem;
          color: #4a5568;
        }

        .setting-item input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #667eea;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .how-it-works-view {
            padding: 1rem;
          }

          .page-header h1 {
            font-size: 2rem;
          }

          .example-cards-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .steps-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .example-card, .step-card {
            padding: 1.5rem;
          }
        }

        /* Additional mobile optimizations for chat and general layout */
        @media (max-width: 768px) {
          .app-layout {
            grid-template-columns: 1fr;
          }

          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 1000;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .page-content {
            margin-left: 0;
            padding: 1rem;
          }

          #chat-drawer {
            height: auto;
            min-height: 300px;
            max-height: 70vh;
          }

          #chat-drawer.expanded {
            height: 70vh;
          }

          .chat-drawer-header {
            padding: 1rem;
          }

          .chat-drawer-title {
            font-size: 1rem;
          }

          .close-chat-btn {
            margin-right: 4px;
            min-width: 36px;
            min-height: 36px;
          }

          .chat-message {
            padding: 0.6rem 1rem;
            max-width: 90%;
          }

          .chat-input-container {
            padding: 1rem;
          }

          .widget {
            margin-bottom: 1.5rem;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .project-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Dashboard Grid */
      `}} />

      <div className="app-layout">
        <div className="sidebar" style={{ transform: isChatExpanded ? 'translateX(-100%)' : 'none' }}>
          <div className="sidebar-header">
            <div className="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 10.5V12h-2v-1.5c0-2.06-1.35-3.83-3.27-4.58l-1.32-.51-.49-1.4A5.002 5.002 0 0 0 10.23 2H10c-2.76 0-5 2.24-5 5v1.5c0 .83.67 1.5 1.5 1.5S8 9.33 8 8.5V7c0-1.1.9-2 2-2h.23c1.12 0 2.1.75 2.47 1.81l.49 1.4 1.32.51C16.65 9.17 18 10.94 18 13v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V13h2v-1.5c0-1.74-1.43-3.15-3.17-3.15A3.18 3.18 0 0 0 18 10.5zM12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zM6.5 16h11c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5h-11C5.67 10 5 10.67 5 11.5v3c0 .83.67 1.5 1.5 1.5z"/>
              </svg>
            </div>
            <div className="user-profile-menu-container">
              <div className="user-profile-summary" onClick={() => {}}>
                {user ? (
                  <>
                    <div className="user-avatar">
                      {user?.photoURL ? <img src={user.photoURL} alt={user.displayName} /> : user?.displayName?.charAt(0) || 'U'}
                    </div>
                    <span>{user?.displayName || 'Användare'}</span>
                    <span className="material-symbols-outlined">arrow_drop_down</span>
                  </>
                ) : (
                  <span>ByggPilot</span>
                )}
              </div>
              <div className="dropdown-menu">
                <div className="dropdown-header">Användaralternativ</div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item" onClick={handleSignOut}>
                  <span className="material-symbols-outlined">logout</span>
                  Logga ut
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-nav">
            <ul>
              <li>
                <a href="#" className={currentView === 'dashboard' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentView('dashboard'); }}>
                  <span className="material-symbols-outlined">dashboard</span>
                  Instrumentpanel
                </a>
              </li>
              <li>
                <a href="#" className={currentView === 'projects' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentView('projects'); }}>
                  <span className="material-symbols-outlined">folder</span>
                  Projekt
                </a>
              </li>
              <li>
                <a href="#" className={currentView === 'tasks' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentView('tasks'); }}>
                  <span className="material-symbols-outlined">check_circle</span>
                  Uppgifter
                </a>
              </li>
              <li>
                <a href="#" className={currentView === 'calendar' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentView('calendar'); }}>
                  <span className="material-symbols-outlined">event</span>
                  Kalender
                </a>
              </li>
              <li>
                <a href="#" className={currentView === 'files' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentView('files'); }}>
                  <span className="material-symbols-outlined">description</span>
                  Filer
                </a>
              </li>
              <li>
                <a href="#" className={currentView === 'how-it-works' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentView('how-it-works'); }}>
                  <span className="material-symbols-outlined">help</span>
                  Så funkar ByggPilot
                </a>
              </li>
            </ul>
          </div>

          <div className="sidebar-footer">
            <ul>
              <li>
                <a href="#" className={currentView === 'settings' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentView('settings'); }}>
                  <span className="material-symbols-outlined">settings</span>
                  Inställningar
                </a>
              </li>
              <li>
                <a href="#">
                  <span className="material-symbols-outlined">help</span>
                  Hjälp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="main-content">
          <div className="main-header">
            <div className="header-title">
              <div className="greeting">
                {user ? `${getTimeBasedGreeting()} ${user.displayName?.split(' ')[0] || 'där'}!` : getTimeBasedGreeting()}
              </div>
              <div className="sub-greeting">
                {user ? getWelcomeSubtitle() : 'Din digitala kollega i byggbranschen'}
              </div>
            </div>
            <div className="header-actions">
              {isDemoMode && !user && (
                <button className="google-signin-btn" onClick={handleGoogleSignIn} disabled={isConnecting}>
                  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>{isConnecting ? 'Öppnar inloggning...' : 'Logga in med Google'}</span>
                </button>
              )}
              {isDemoMode && !user && !isConnecting && (
                <p style={{ fontSize: '11px', color: '#666', marginTop: '3px', textAlign: 'center' }}>
                  Om popup-fönster inte öppnas, kontrollera popup-blockerare
                </p>
              )}
              {isDemoMode && (
                <div className="demo-mode-banner">
                  <span className="material-symbols-outlined">info</span>
                  <span>Demo-läge aktivt</span>
                </div>
              )}
              {user && (
                <button className="btn" onClick={handleSignOut}>
                  Logga ut
                </button>
              )}
              <button className="btn" onClick={toggleChat}>
                <span className="material-symbols-outlined">chat</span>
                Chatta med ByggPilot
              </button>
            </div>
          </div>

          <div className="page-content">
            {renderMainContent()}
          </div>

          {renderOnboardingModal()}

          <div id="chat-drawer" className={isChatExpanded ? 'expanded' : ''}>
            <div className="chat-drawer-content">
              <div className="chat-drawer-header">
                <div className="chat-drawer-title">ByggPilot - Din digitala kollega</div>
                <button className="close-chat-btn" onClick={toggleChat}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div id="chat-messages">
                {messages.map(message => (
                  <div key={message.id} className={`chat-message ${message.isUser ? 'user' : 'ai'}`}>
                    <p>{message.text}</p>
                  </div>
                ))}
              </div>
              <div className="chat-input-wrapper">
                <form onSubmit={handleSendMessage} className="chat-input-container">
                  <input
                    type="text"
                    className="chat-input"
                    placeholder="Skriv ett meddelande..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isLoading}
                  />
                  <button type="submit" className="send-message-btn" disabled={isLoading}>
                    {isLoading ? 'Skickar...' : 'Skicka'}
                  </button>
                </form>
              </div>
              <div id="attached-files-preview">
                {attachedFiles.map(file => (
                  <div key={file.name} className="file-preview-item">
                    {file.type.startsWith('image/') ? (
                      <img src={URL.createObjectURL(file)} alt={file.name} />
                    ) : (
                      <div className="file-icon-placeholder">
                        <span className="material-symbols-outlined">attach_file</span>
                      </div>
                    )}
                    <button className="remove-file-btn" onClick={() => removeAttachedFile(file.name)}>
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}