import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithRedirect, getRedirectResult, signOut, GoogleAuthProvider, User, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import './app.css';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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
  projectId?: string;
}

interface AppEvent {
  id: string;
  type: 'mail' | 'calendar' | 'file';
  icon: string;
  title: string;
  subtitle: string;
  time: string;
}

export default function ByggPilotMain() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, isUser: boolean, timestamp: Date}>>(() => {
    // Load chat messages from sessionStorage
    const saved = sessionStorage.getItem('byggpilot-chat-messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [chatInput, setChatInput] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Sample data
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'Villa Andersson',
      customer: 'Familjen Andersson',
      deadline: '2025-08-15',
      progress: 75,
      status: 'green'
    },
    {
      id: '2', 
      name: 'Kontorsrenovering',
      customer: 'TechCorp AB',
      deadline: '2025-07-30',
      progress: 45,
      status: 'yellow'
    },
    {
      id: '3',
      name: 'Badrumsrenovering', 
      customer: 'Anna Svensson',
      deadline: '2025-08-01',
      progress: 90,
      status: 'green'
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Beställ material för Villa Andersson', completed: false, projectId: '1' },
    { id: '2', text: 'Boka inspektion för kontorsrenovering', completed: true, projectId: '2' },
    { id: '3', text: 'Skicka faktura till Anna Svensson', completed: false, projectId: '3' },
    { id: '4', text: 'Uppdatera projektstatus', completed: false }
  ]);

  const [events] = useState<AppEvent[]>([
    {
      id: '1',
      type: 'mail',
      icon: '📧',
      title: 'Ny e-post från Familjen Andersson',
      subtitle: 'Frågor om materialval',
      time: '10:30'
    },
    {
      id: '2', 
      type: 'calendar',
      icon: '📅',
      title: 'Möte med TechCorp imorgon',
      subtitle: 'Projektgenomgång kl. 14:00',
      time: '09:15'
    },
    {
      id: '3',
      type: 'file',
      icon: '📁',
      title: 'Nya ritningar uppladdade',
      subtitle: 'Villa Andersson - kök.pdf',
      time: '08:45'
    }
  ]);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Save chat messages to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('byggpilot-chat-messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setIsConnecting(false);
      } else {
        // Check for redirect result
        try {
          const result = await getRedirectResult(auth);
          if (result) {
            setUser(result.user);
          }
        } catch (error) {
          console.error('Error getting redirect result:', error);
        }
        setIsConnecting(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'God morgon!';
    if (hour < 17) return 'God eftermiddag!';
    return 'God kväll!';
  };

  const handleGoogleSignIn = async () => {
    // Temporarily disable OAuth due to configuration issues
    if (import.meta.env.VITE_DISABLE_OAUTH) {
      alert('Google OAuth är tillfälligt inaktiverat under utveckling. Använd demo-läge istället.');
      return;
    }
    
    setIsConnecting(true);
    try {
      const provider = new GoogleAuthProvider();
      
      // Add OAuth scopes for Google Workspace integration
      provider.addScope('https://www.googleapis.com/auth/drive.readonly');
      provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
      provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      console.error('Error signing in:', error);
      
      // Show user-friendly error message
      if (error.code === 'auth/popup-blocked') {
        alert('Popup blockerades. Tillåt popups för denna sida och försök igen.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // User cancelled, do nothing
      } else {
        alert('Inloggning misslyckades. Försök igen senare.');
      }
      
      setIsConnecting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsDemoMode(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleStartDemo = () => {
    setIsDemoMode(true);
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    const currentInput = chatInput;
    setChatInput('');
    
    // Show loading message
    const loadingMessage = {
      id: (Date.now() + 1).toString(),
      text: 'Tänker...',
      isUser: false,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, loadingMessage]);
    
    try {
      // Call our Netlify function
      const response = await fetch('/.netlify/functions/chatt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          context: 'ByggPilot Dashboard - Användarens första kontakt med AI-assistenten'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Replace loading message with actual response
        setChatMessages(prev => prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { ...msg, text: data.response || 'Ursäkta, jag kunde inte generera ett svar just nu.' }
            : msg
        ));
      } else {
        throw new Error('API-anrop misslyckades');
      }
    } catch (error) {
      console.error('Chat API error:', error);
      
      // Replace loading message with fallback response
      const fallbackResponse = getFallbackResponse(currentInput);
      setChatMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id 
          ? { ...msg, text: fallbackResponse }
          : msg
      ));
    }
  };
  
  const getFallbackResponse = (input: string): string => {
    const lower = input.toLowerCase();
    
    if (lower.includes('projekt') || lower.includes('nytt')) {
      return 'För att skapa ett nytt projekt kan du klicka på "Skapa Nytt" knappen i headern. Jag hjälper dig sedan att fylla i alla detaljer!';
    }
    if (lower.includes('tid') || lower.includes('logg')) {
      return 'Tidloggning hittar du i sidomenyn till vänster. Där kan du logga tid på dina olika projekt och få en överblick över dina arbetade timmar.';
    }
    if (lower.includes('uppgift') || lower.includes('task')) {
      return 'I uppgiftssektionen kan du hålla koll på alla dina todos. Du kan även se relaterade uppgifter för varje projekt i projektöversikten.';
    }
    if (lower.includes('faktura') || lower.includes('slutfaktura')) {
      return 'Slutfaktura-funktionen hjälper dig att skapa professionella fakturor baserat på dina projekt och tidsloggning. Klicka på "Slutfaktura" i menyn för att komma igång.';
    }
    if (lower.includes('hjälp') || lower.includes('help')) {
      return 'Jag är din digitala projektledare och kan hjälpa dig med:\n• Projekthantering\n• Tidloggning\n• Dokumentation\n• Fakturahantering\n• Google Workspace integration\n\nVad behöver du hjälp med idag?';
    }
    
    return 'Jag är ByggPilot, din digitala kollega i byggbranschen! Jag hjälper dig med projekthantering, tidloggning, dokumentation och mycket mer. Vad kan jag assistera dig med idag?';
  };

  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  const toggleChat = () => {
    setIsChatExpanded(!isChatExpanded);
    
    // Add welcome message if chat is empty and expanding
    if (!isChatExpanded && chatMessages.length === 0) {
      const welcomeMessage = {
        id: 'welcome-' + Date.now(),
        text: 'Hej! Jag är ByggPilot, din digitala projektledare. Jag kan hjälpa dig med allt från projekthantering till dokumentation. Vad kan jag hjälpa dig med idag?',
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages([welcomeMessage]);
    }
    
    setTimeout(() => {
      if (!isChatExpanded) {
        chatInputRef.current?.focus();
      }
    }, 100);
  };

  const renderSidebar = () => (
    <aside className="sidebar">
      <header className="sidebar-header">
        <div className="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            {/* Pilot wings */}
            <path d="M2 12L4 10L8 12L4 14L2 12Z" opacity="0.7"/>
            <path d="M22 12L20 10L16 12L20 14L22 12Z" opacity="0.7"/>
            {/* Construction helmet */}
            <path d="M12 3C8.5 3 5.5 5.5 5 9H4C3.5 9 3 9.5 3 10V11C3 11.5 3.5 12 4 12H5C5.5 15.5 8.5 18 12 18C15.5 18 18.5 15.5 19 12H20C20.5 12 21 11.5 21 11V10C21 9.5 20.5 9 20 9H19C18.5 5.5 15.5 3 12 3ZM12 16C9.8 16 8 14.2 8 12C8 9.8 9.8 8 12 8C14.2 8 16 9.8 16 12C16 14.2 14.2 16 12 16Z"/>
            {/* Helmet visor/front */}
            <path d="M12 6C10.3 6 9 7.3 9 9V15C9 16.7 10.3 18 12 18C13.7 18 15 16.7 15 15V9C15 7.3 13.7 6 12 6Z" opacity="0.3"/>
            {/* Safety light on helmet */}
            <circle cx="12" cy="5" r="1" fill="currentColor"/>
          </svg>
        </div>
        <span>ByggPilot</span>
      </header>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <a 
              className={currentView === 'dashboard' ? 'active' : ''} 
              onClick={() => setCurrentView('dashboard')}
            >
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </a>
          </li>
          <li>
            <a 
              className={currentView === 'projects' ? 'active' : ''} 
              onClick={() => setCurrentView('projects')}
            >
              <span className="material-symbols-outlined">assignment</span>
              Projekt
            </a>
          </li>
          <li>
            <a 
              className={currentView === 'dokument' ? 'active' : ''} 
              onClick={() => setCurrentView('dokument')}
            >
              <span className="material-symbols-outlined">folder_managed</span>
              Dokument
            </a>
          </li>
          <li>
            <a 
              className={currentView === 'slutfaktura' ? 'active' : ''} 
              onClick={() => setCurrentView('slutfaktura')}
            >
              <span className="material-symbols-outlined">request_quote</span>
              Slutfaktura
            </a>
          </li>
          <li>
            <a 
              className={currentView === 'revisor' ? 'active' : ''} 
              onClick={() => setCurrentView('revisor')}
            >
              <span className="material-symbols-outlined">receipt_long</span>
              Revisor Samlingar
            </a>
          </li>
          <li>
            <a 
              className={currentView === 'team' ? 'active' : ''} 
              onClick={() => setCurrentView('team')}
            >
              <span className="material-symbols-outlined">groups</span>
              Team
            </a>
          </li>
        </ul>
      </nav>
      
      <footer className="sidebar-footer">
        <ul>
          <li>
            <a onClick={() => setCurrentView('help')}>
              <span className="material-symbols-outlined">help</span>
              Hjälp & Guider
            </a>
          </li>
          <li>
            <a onClick={() => setCurrentView('settings')}>
              <span className="material-symbols-outlined">settings</span>
              Inställningar
            </a>
          </li>
        </ul>
        
        {(user || isDemoMode) && (
          <div className="user-profile-menu-container">
            <a className="user-profile-summary">
              <div className="user-avatar">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User avatar" style={{width: '100%', height: '100%', borderRadius: '50%'}} />
                ) : (
                  <span>{user?.displayName?.charAt(0) || (isDemoMode ? 'D' : 'G')}</span>
                )}
              </div>
              <span>{user?.displayName || (isDemoMode ? 'Demo Användare' : 'Gäst')}</span>
              <span className="material-symbols-outlined">more_vert</span>
            </a>
          </div>
        )}
      </footer>
    </aside>
  );

  const renderHeader = () => (
    <header className="main-header">
      <div className="header-title">
        <h1 className="greeting">
          {getGreeting()}
        </h1>
        <p className="sub-greeting">
          Senaste händelser
        </p>
      </div>
      
      <div className="header-actions">
        {!user && !isDemoMode && (
          <>
            <button className="btn" onClick={handleStartDemo}>
              Testa Demo
            </button>
            <button className="google-signin-btn" onClick={handleGoogleSignIn} disabled={isConnecting}>
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" />
              <span>{isConnecting ? 'Ansluter...' : 'Logga in med Google'}</span>
            </button>
          </>
        )}
        
        {(user || isDemoMode) && (
          <button 
            className="btn btn-primary"
            onClick={() => alert('Skapa nytt projekt - kommer snart!')}
          >
            <span className="material-symbols-outlined">add</span>
            Skapa Nytt
          </button>
        )}
      </div>
    </header>
  );

  const renderDashboard = () => (
    <div className="dashboard-grid">
      <div className="widget-column">
        <div className="widget">
          <div className="widget-header">
            <h2>Pågående Projekt</h2>
          </div>
          <div className="project-grid">
            {projects.map(project => (
              <div key={project.id} className={`project-card status-${project.status}`}>
                <div className="project-header">
                  <div className="project-name">{project.name}</div>
                  <div className={`project-status ${project.status}`}></div>
                </div>
                <div className="project-details">
                  <div>Kund: {project.customer}</div>
                  <div>Deadline: {new Date(project.deadline).toLocaleDateString('sv-SE')}</div>
                </div>
                <div className="project-progress">
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                    <span>Framsteg</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${project.progress}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="widget-column">
        <div className="widget">
          <div className="widget-header">
            <h2>Senaste Händelser</h2>
          </div>
          <div className="events-list">
            {events.map(event => (
              <div key={event.id} className="event-item">
                <div className="event-icon">{event.icon}</div>
                <div className="event-content">
                  <div className="event-title">{event.title}</div>
                  <div className="event-subtitle">{event.subtitle}</div>
                </div>
                <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{event.time}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="widget">
          <div className="widget-header">
            <h2>Uppgifter</h2>
          </div>
          <div className="task-list">
            {tasks.slice(0, 4).map(task => (
              <div key={task.id} className="task-item">
                <div 
                  className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                  onClick={() => toggleTask(task.id)}
                ></div>
                <div className={`task-text ${task.completed ? 'completed' : ''}`}>
                  {task.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'projects':
        return <div className="widget"><h2>Projekt</h2><p>Projekthantering kommer snart...</p></div>;
      case 'dokument':
        return <div className="widget"><h2>Dokument</h2><p>Dokumenthantering kommer snart...</p></div>;
      case 'slutfaktura':
        return <div className="widget"><h2>Slutfaktura</h2><p>Fakturahantering kommer snart...</p></div>;
      case 'revisor':
        return <div className="widget"><h2>Revisor Samlingar</h2><p>Revisor integration kommer snart...</p></div>;
      case 'team':
        return <div className="widget"><h2>Team</h2><p>Teamhantering kommer snart...</p></div>;
      case 'help':
        return <div className="widget"><h2>Hjälp & Guider</h2><p>Hjälpresurser kommer snart...</p></div>;
      case 'settings':
        return <div className="widget"><h2>Inställningar</h2><p>Inställningar kommer snart...</p></div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="app-layout">
      {renderSidebar()}
      
      <main className="main-content">
        {renderHeader()}
        
        <main className="page-content">
          {renderCurrentView()}
        </main>
        
        {/* Chat Drawer - Fixed to bottom spanning right side */}
        <div id="chat-drawer" className={isChatExpanded ? 'expanded' : ''}>
          <div className="chat-drawer-content">
            <div id="chat-messages" ref={chatMessagesRef}>
              {chatMessages.length === 0 ? (
                <div className="welcome-message">
                  <h3>Välkommen till ByggPilot</h3>
                  <p>Din digitala kollega i byggbranschen. Ställ en fråga för att börja.</p>
                </div>
              ) : (
                chatMessages.map(message => (
                  <div 
                    key={message.id} 
                    className={`chat-message ${message.isUser ? 'user' : 'ai'}`}
                  >
                    {message.text}
                  </div>
                ))
              )}
            </div>
            
            <div className="chat-input-wrapper">
              <div className="chat-input-container">
                <div className="chat-input-area">
                  <button 
                    id="chat-toggle-button"
                    className="icon-btn" 
                    onClick={toggleChat}
                    aria-label="Fäll ut/ihop chatten"
                  >
                    <span className="material-symbols-outlined">
                      {isChatExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                  
                  {isChatExpanded && (
                    <>
                      <button className="icon-btn" aria-label="Bifoga fil">
                        <span className="material-symbols-outlined">attach_file</span>
                      </button>
                      <button className="icon-btn" aria-label="Starta röstinmatning">
                        <span className="material-symbols-outlined">mic</span>
                      </button>
                      <input 
                        type="text" 
                        id="chat-input"
                        ref={chatInputRef}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={handleChatKeyPress}
                        placeholder="Skriv ditt meddelande..."
                      />
                      <button 
                        className="btn-send" 
                        onClick={sendChatMessage}
                        disabled={!chatInput.trim()}
                        aria-label="Skicka meddelande"
                      >
                        <span className="material-symbols-outlined">send</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {isChatExpanded && (
                <div className="chat-disclaimer">
                  ByggPilot är en AI-kollega som kan ge felaktiga förslag. Granska alltid viktig information självständigt.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
