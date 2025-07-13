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
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
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
    setIsConnecting(true);
    try {
      const provider = new GoogleAuthProvider();
      
      // Add OAuth scopes for Google Workspace integration
      provider.addScope('https://www.googleapis.com/auth/drive.readonly');
      provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
      provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      
      // Use popup instead of redirect for better UX
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
      return 'För att skapa ett nytt projekt kan du klicka på "Nytt Projekt" knappen i headern. Jag hjälper dig sedan att fylla i alla detaljer!';
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

  const expandChat = () => {
    setIsChatExpanded(true);
    
    // Add welcome message if chat is empty
    if (chatMessages.length === 0) {
      const welcomeMessage = {
        id: 'welcome-' + Date.now(),
        text: 'Hej! Jag är ByggPilot, din digitala projektledare. Jag kan hjälpa dig med allt från projekthantering till dokumentation. Vad kan jag hjälpa dig med idag?',
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages([welcomeMessage]);
    }
    
    setTimeout(() => {
      chatInputRef.current?.focus();
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
              className={currentView === 'tidloggning' ? 'active' : ''} 
              onClick={() => setCurrentView('tidloggning')}
            >
              <span className="material-symbols-outlined">schedule</span>
              Tidloggning
            </a>
          </li>
          <li>
            <a 
              className={currentView === 'uppgifter' ? 'active' : ''} 
              onClick={() => setCurrentView('uppgifter')}
            >
              <span className="material-symbols-outlined">task_alt</span>
              Uppgifter
            </a>
          </li>
          <li>
            <a 
              className={currentView === 'kalender' ? 'active' : ''} 
              onClick={() => setCurrentView('kalender')}
            >
              <span className="material-symbols-outlined">calendar_month</span>
              Kalender
            </a>
          </li>
          <li>
            <a 
              className={currentView === 'fortnox' ? 'active' : ''} 
              onClick={() => setCurrentView('fortnox')}
            >
              <span className="material-symbols-outlined">account_balance</span>
              Fortnox
            </a>
          </li>
        </ul>
      </nav>
      
      <footer className="sidebar-footer">
        <ul>
          <li>
            <a onClick={() => setCurrentView('settings')}>
              <span className="material-symbols-outlined">settings</span>
              Inställningar
            </a>
          </li>
        </ul>
        
        {(user || isDemoMode) && (
          <div className="user-profile-menu-container">
            <div className="user-profile-summary">
              <div className="user-avatar">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User avatar" style={{width: '100%', height: '100%', borderRadius: '50%'}} />
                ) : (
                  user?.displayName?.charAt(0) || isDemoMode ? 'D' : 'U'
                )}
              </div>
              <div className="user-info">
                <div className="user-name">
                  {user?.displayName || (isDemoMode ? 'Demo Användare' : 'Användare')}
                </div>
                <div className="user-email">
                  {user?.email || (isDemoMode ? 'demo@byggpilot.se' : '')}
                </div>
              </div>
            </div>
          </div>
        )}
      </footer>
    </aside>
  );

  const renderHeader = () => (
    <div className="main-header">
      <div className="header-title">
        <div className="greeting">
          {getGreeting()}
        </div>
        <div className="sub-greeting">
          Senaste händelser
        </div>
      </div>
      
      <div className="header-actions">
        {!user && !isDemoMode && (
          <>
            <button className="google-signin-btn" onClick={handleGoogleSignIn} disabled={isConnecting}>
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" />
              <span>{isConnecting ? 'Ansluter...' : 'Logga in med Google'}</span>
            </button>
            <button className="btn btn-primary" onClick={handleStartDemo}>
              Demo-läge
            </button>
          </>
        )}
        
        {(user || isDemoMode) && (
          <>
            <button 
              className="btn btn-primary"
              onClick={() => alert('Nytt projekt - kommer snart!')}
            >
              <span className="material-symbols-outlined">add</span>
              Nytt Projekt
            </button>
            
            <div className="user-menu">
              <button className="user-menu-button" onClick={handleSignOut}>
                <div className="user-avatar">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="User avatar" style={{width: '100%', height: '100%', borderRadius: '50%'}} />
                  ) : (
                    user?.displayName?.charAt(0) || 'D'
                  )}
                </div>
                <span>{user?.displayName?.split(' ')[0] || 'Demo'}</span>
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="dashboard-grid">
      <div className="dashboard-main">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Pågående Projekt</h2>
          </div>
          <div className="card-content">
            <div className="project-cards">
              {projects.map(project => (
                <div key={project.id} className="project-card">
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
      </div>
      
      <div className="dashboard-sidebar">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Senaste Händelser</h3>
          </div>
          <div className="card-content">
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
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Uppgifter</h3>
          </div>
          <div className="card-content">
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
    </div>
  );

  const renderChat = () => (
    <div className={`chat-drawer ${!isChatExpanded ? 'collapsed' : ''}`}>
      {!isChatExpanded ? (
        <div 
          style={{
            width: '64px', 
            height: '64px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: '50%',
            background: 'var(--primary-accent)'
          }}
          onClick={expandChat}
        >
          <span className="material-symbols-outlined" style={{color: '#000', fontSize: '24px'}}>
            chat
          </span>
        </div>
      ) : (
        <>
          <div className="chat-header">
            <div className="chat-title">ByggPilot AI</div>
            <button className="chat-toggle" onClick={() => setIsChatExpanded(false)}>
              <span className="material-symbols-outlined">minimize</span>
            </button>
          </div>
          
          <div className="chat-messages" ref={chatMessagesRef}>
            {chatMessages.length === 0 && (
              <div style={{color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center'}}>
                Ställ en fråga eller be om hjälp...
              </div>
            )}
            {chatMessages.map(message => (
              <div 
                key={message.id} 
                style={{
                  alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  backgroundColor: message.isUser ? 'var(--primary-accent)' : 'var(--secondary-bg)',
                  color: message.isUser ? '#000' : 'var(--text-color)'
                }}
              >
                {message.text}
              </div>
            ))}
          </div>
          
          <div className="chat-input-area">
            <div className="chat-input-container">
              <textarea
                ref={chatInputRef}
                className="chat-input"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleChatKeyPress}
                placeholder="Skriv ditt meddelande..."
                rows={1}
              />
              <button 
                className="chat-send-btn"
                onClick={sendChatMessage}
                disabled={!chatInput.trim()}
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'projects':
        return <div className="card"><h2>Projekt</h2><p>Projekthantering kommer snart...</p></div>;
      case 'dokument':
        return <div className="card"><h2>Dokument</h2><p>Dokumenthantering kommer snart...</p></div>;
      case 'slutfaktura':
        return <div className="card"><h2>Slutfaktura</h2><p>Fakturahantering kommer snart...</p></div>;
      case 'revisor':
        return <div className="card"><h2>Revisor Samlingar</h2><p>Revisor integration kommer snart...</p></div>;
      case 'tidloggning':
        return <div className="card"><h2>Tidloggning</h2><p>Tidloggning kommer snart...</p></div>;
      case 'uppgifter':
        return <div className="card"><h2>Uppgifter</h2><p>Uppgiftshantering kommer snart...</p></div>;
      case 'kalender':
        return <div className="card"><h2>Kalender</h2><p>Kalenderintegration kommer snart...</p></div>;
      case 'fortnox':
        return <div className="card"><h2>Fortnox</h2><p>Fortnox integration kommer snart...</p></div>;
      case 'settings':
        return <div className="card"><h2>Inställningar</h2><p>Inställningar kommer snart...</p></div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="app-layout">
      {renderSidebar()}
      
      <main className="main-content">
        {renderHeader()}
        
        <div className="page-content">
          {renderCurrentView()}
        </div>
      </main>
      
      {renderChat()}
    </div>
  );
}
