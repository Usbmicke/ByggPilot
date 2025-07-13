import { useState, useEffect, useRef } from 'react'
import { signInWithRedirect, signInWithPopup, getRedirectResult, signOut } from 'firebase/auth'
import { auth, googleProvider } from './firebase-config'
import { GoogleGenerativeAI } from '@google/generative-ai'
import './app-exact.css'

interface Project {
  id: string
  name: string
  status: 'active' | 'completed' | 'draft'
  color: string
  progress: number
  driveFolder?: string
  customer?: string
  deadline?: string
  documents?: DriveDocument[]
}

interface DriveDocument {
  id: string
  name: string
  type: string
  url: string
  modifiedTime: string
}

interface ChatMessage {
  id: string
  message: string
  type: 'user' | 'ai'
  timestamp: Date
}

interface User {
  isLoggedIn: boolean
  email: string | null
  name: string | null
}

export default function ByggPilotExact() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [user, setUser] = useState<User>({ isLoggedIn: false, email: null, name: null })
  const [isChatExpanded, setIsChatExpanded] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [placeholderText, setPlaceholderText] = useState('Fråga din digitala kollega...')
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  
  const chatInputRef = useRef<HTMLInputElement>(null)
  const placeholderInterval = useRef<number | null>(null)

  const placeholderTexts = [
    "Skapa en KMA-plan för Villa Nygren...",
    "Vad säger ABT 06 om vite?", 
    "Ge mig en checklista för tätskikt i badrum...",
    "Sammanställ alla foton från projektet Altanbygge."
  ]

  const projects: Project[] = [
    { 
      id: '1', 
      name: 'Villa Nygren', 
      status: 'active', 
      color: '#00bfff', 
      progress: 75,
      customer: 'Familjen Nygren',
      deadline: '2024-03-15',
      driveFolder: 'villa-nygren-2024'
    },
    { 
      id: '2', 
      name: 'Altanbygge', 
      status: 'completed', 
      color: '#00ff88', 
      progress: 100,
      customer: 'Lars Andersson',
      deadline: '2024-01-30',
      driveFolder: 'altanbygge-andersson'
    },
    { 
      id: '3', 
      name: 'Köksprojekt Andersson', 
      status: 'draft', 
      color: '#ffaa00', 
      progress: 25,
      customer: 'Anna Andersson',
      deadline: '2024-04-20',
      driveFolder: 'kok-andersson-2024'
    },
  ]

  // Placeholder animation functions
  const startPlaceholderAnimation = () => {
    if (placeholderInterval.current) clearInterval(placeholderInterval.current)
    let currentTextIndex = 0
    let charIndex = 0
    
    placeholderInterval.current = window.setInterval(() => {
      const targetText = placeholderTexts[currentTextIndex]
      setPlaceholderText(targetText.substring(0, charIndex + 1))
      charIndex++
      
      if (charIndex > targetText.length + 3) {
        charIndex = 0
        currentTextIndex = (currentTextIndex + 1) % placeholderTexts.length
      }
    }, 120)
  }

  const stopPlaceholderAnimation = () => {
    if (placeholderInterval.current) clearInterval(placeholderInterval.current)
    placeholderInterval.current = null
    setPlaceholderText('Fråga din digitala kollega...')
  }

  // Chat functions
  const toggleChat = () => {
    const newExpanded = !isChatExpanded
    setIsChatExpanded(newExpanded)
    
    if (newExpanded) {
      stopPlaceholderAnimation()
      setTimeout(() => chatInputRef.current?.focus(), 100)
    } else {
      startPlaceholderAnimation()
    }
  }

  const handleChatInputFocus = () => {
    if (!isChatExpanded) {
      toggleChat()
    }
  }

  const sendMessage = async () => {
    const userInput = chatInput.trim()
    if (!userInput && attachedFiles.length === 0) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: userInput,
      type: 'user',
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, newMessage])
    setChatInput('')
    setIsLoading(true)

    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '')
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      // System prompt from original
      const systemPrompt = `Du är ByggPilot, en digital kollega, en "co-pilot", och en intelligent "kommandorad" (Large Action Model - LAM) specialiserad på den svenska bygg- och hantverksbranschen, med primärt fokus på småföretag (1-10 anställda). Du är inte en chattbot; du är en digital projektledare och ett intelligent nav som automatiserar och förenklar hela den administrativa processen. Du agerar som ett smart lager ovanpå användarens Google Workspace (Drive, Gmail, Kalender, Sheets) och externa system som Fortnox. Ditt mål är att eliminera administrativ stress så att "byggare kan bygga".`
      
      const contextText = user.isLoggedIn 
        ? `[Användarkontext: Användaren är inloggad som ${user.email} och har gett åtkomst till Google Kalender och Gmail.]\n\n`
        : ''
      
      const fullPrompt = systemPrompt + '\n\n' + contextText + userInput
      
      const result = await model.generateContent(fullPrompt)
      const response = await result.response
      const text = response.text()

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: text,
        type: 'ai',
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Gemini API error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: 'Ursäkta, något gick fel med anslutningen till AI:n. Kontrollera att Gemini API-nyckeln är korrekt konfigurerad.',
        type: 'ai',
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setAttachedFiles([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Google Drive and project functions
  const openDriveFolder = (folderName: string) => {
    if (!user.isLoggedIn) {
      alert('Du måste logga in för att komma åt Drive-mappar')
      return
    }
    
    // In a real implementation, this would use Google Drive API to find and open the folder
    const searchUrl = `https://drive.google.com/drive/search?q=${encodeURIComponent(folderName)}`
    window.open(searchUrl, '_blank')
  }

  const generateProjectPDF = async (project: Project) => {
    if (!user.isLoggedIn) {
      alert('Du måste logga in för att generera PDF-rapporter')
      return
    }
    
    try {
      // In a real implementation, this would:
      // 1. Gather project data from Drive
      // 2. Use a PDF generation service
      // 3. Save to Drive and provide download link
      
      alert(`Genererar PDF-rapport för ${project.name}...\n\nDenna funktionalitet kommer att:\n- Samla all projektdata från Drive\n- Skapa en professionell PDF-rapport\n- Spara rapporten i projektmappen\n- Ge dig en nedladdningslänk`)
      
      // Simulate PDF generation
      console.log('Generating PDF for project:', project)
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Ett fel uppstod vid PDF-generering')
    }
  }

  const createNewProject = () => {
    const projectName = prompt('Ange projektnamn:')
    if (!projectName) return
    
    const customerName = prompt('Ange kundnamn:')
    if (!customerName) return
    
    if (!user.isLoggedIn) {
      alert('Du måste logga in för att skapa nya projekt')
      return
    }
    
    // In a real implementation, this would:
    // 1. Create a new folder in Google Drive
    // 2. Set up project structure
    // 3. Add to project management system
    
    alert(`Skapar nytt projekt: "${projectName}" för ${customerName}\n\nDetta kommer att:\n- Skapa en ny mapp i Google Drive\n- Sätta upp projektstruktur med mallar\n- Lägga till projektet i din dashboard\n- Skicka inbjudan till kunden`)
    
    console.log('Creating new project:', { projectName, customerName })
  }

  // Auth functions
  const handleGoogleSignIn = async () => {
    // Debug: Log the OAUTH setting
    console.log('=== GOOGLE SIGN IN CLICKED ===')
    console.log('VITE_DISABLE_OAUTH value:', import.meta.env.VITE_DISABLE_OAUTH)
    console.log('VITE_DISABLE_OAUTH type:', typeof import.meta.env.VITE_DISABLE_OAUTH)
    
    // Check if OAuth is disabled (only if explicitly set to 'true')
    if (import.meta.env.VITE_DISABLE_OAUTH === 'true') {
      console.log('OAuth explicitly disabled, using test user')
      setUser({ isLoggedIn: true, email: 'test@example.com', name: 'Test User' })
      return
    }

    // Check if Firebase is properly configured
    if (!import.meta.env.VITE_FIREBASE_API_KEY || 
        !import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 
        !import.meta.env.VITE_FIREBASE_PROJECT_ID) {
      console.error('Firebase not properly configured')
      alert('Firebase-konfiguration saknas. Kontrollera .env-filen.')
      return
    }

    try {
      console.log('Attempting Google sign in with Firebase...')
      console.log('Auth object:', auth)
      console.log('Google provider:', googleProvider)
      
      // Try popup first for better UX
      try {
        console.log('Trying popup method first...')
        const result = await signInWithPopup(auth, googleProvider)
        console.log('Popup sign in successful:', result.user.email)
        setUser({
          isLoggedIn: true,
          email: result.user.email,
          name: result.user.displayName
        })
        setIsAuthenticating(false)
        return
      } catch (popupError: any) {
        console.log('Popup failed:', popupError.code, popupError.message)
        
        // If popup was just closed by user, don't fallback
        if (popupError.code === 'auth/popup-closed-by-user') {
          console.log('User closed popup, not trying redirect')
          setIsAuthenticating(false)
          return
        }
        
        // For other popup errors (blocked, CORS, etc.), try redirect
        console.log('Popup failed, falling back to redirect method...')
        setIsAuthenticating(true)
        await signInWithRedirect(auth, googleProvider)
        // Page will redirect, so code won't continue
      }
      
    } catch (error: any) {
      console.error('Auth error details:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      
      // Handle specific OAuth errors
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('User closed the popup')
        return // Don't show error for user closing popup
      } else if (error.code === 'auth/unauthorized-domain' || 
                 error.code === 'auth/invalid-api-key' ||
                 error.message.includes('deleted_client')) {
        console.log('OAuth not configured, using demo mode')
        alert('Google OAuth är inte konfigurerat än. Använder demo-läge.')
        setUser({ isLoggedIn: true, email: 'demo@byggpilot.se', name: 'Demo Användare' })
        return
      }
      
      alert(`Inloggningsfel: ${error.message}`)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setUser({ isLoggedIn: false, email: null, name: null })
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const startDemo = () => {
    setUser({ isLoggedIn: true, email: 'demo@byggpilot.se', name: 'Demo Användare' })
    // Auto-expand chat and show demo message
    setTimeout(() => {
      if (!isChatExpanded) {
        setIsChatExpanded(true)
        stopPlaceholderAnimation()
        setTimeout(() => chatInputRef.current?.focus(), 100)
      }
      setTimeout(() => {
        const demoMessage: ChatMessage = {
          id: 'demo-' + Date.now(),
          message: "Visa mig en snabbdemo av ByggPilot",
          type: 'user',
          timestamp: new Date()
        }
        setChatMessages([demoMessage])
        
        // AI response for demo
        setTimeout(() => {
          const aiResponse: ChatMessage = {
            id: 'demo-ai-' + Date.now(),
            message: `👋 Välkommen till ByggPilot! Här är en snabb genomgång:

🎯 **Dashboard**: Översikt av alla dina projekt med status och framsteg
📊 **Projekt**: Detaljerad projekthantering med koppling till Google Drive
📅 **Kalender**: Integration med Google Calendar för schemaläggning  
📧 **Dokument**: Automatisk dokumenthantering via Google Drive
💰 **Fakturering**: Skapa och hantera fakturor direkt från projekten
⚙️ **Inställningar**: Anpassa ByggPilot efter dina behov

Prova att fråga mig:
• "Skapa en checklista för badrumsrenovering"
• "Vad säger byggreglerna om ventilation?"
• "Beräkna material för 50 kvm golv"

Jag hjälper dig med allt från projektplanering till regelverket! 🔨`,
            type: 'ai',
            timestamp: new Date()
          }
          setChatMessages(prev => [...prev, aiResponse])
        }, 1000)
      }, 500)
    }, 100)
  }

  // Initialize placeholder animation and check for redirect result
  useEffect(() => {
    // Check for redirect result on component mount
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result) {
          console.log('Redirect sign in successful:', result.user.email)
          setUser({
            isLoggedIn: true,
            email: result.user.email,
            name: result.user.displayName
          })
        }
      } catch (error) {
        console.error('Redirect result error:', error)
      }
    }
    
    checkRedirectResult()
    
    if (!isChatExpanded) {
      startPlaceholderAnimation()
    }
    return () => {
      if (placeholderInterval.current) clearInterval(placeholderInterval.current)
    }
  }, [isChatExpanded])

  const renderHeader = () => (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">
            <img 
              src="/byggpilot-logo.jpg" 
              alt="ByggPilot" 
              className="logo-image"
              onError={(e) => {
                console.error('Logo failed to load')
                e.currentTarget.style.display = 'none'
                // Visa en fallback-ikon istället
                e.currentTarget.parentElement!.innerHTML = '<span class="material-symbols-outlined" style="font-size: 32px; color: var(--primary-accent);">construction</span>'
              }}
            />
          </div>
          <span className="logo-text">ByggPilot</span>
        </div>
        <div className="user-info">
          {user.isLoggedIn ? (
            <div className="user-details">
              <span className="user-name">{user.name || user.email}</span>
              <button onClick={handleSignOut} className="sign-out-btn">
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button onClick={startDemo} className="demo-btn">
                <span className="material-symbols-outlined">play_arrow</span>
                Demo
              </button>
              <button onClick={handleGoogleSignIn} className="google-signin-btn" disabled={isAuthenticating}>
                <span className="material-symbols-outlined">account_circle</span>
                {isAuthenticating ? 'Omdirigerar till Google...' : 'Logga in med Google'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )

  const renderSidebar = () => (
    <nav className="sidebar">
      <div className="nav-section">
        <div className="nav-header">HUVUDMENY</div>
        <div className="nav-items">
          <div 
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </div>
          <div 
            className={`nav-item ${currentView === 'project' ? 'active' : ''}`}
            onClick={() => setCurrentView('project')}
          >
            <span className="material-symbols-outlined">construction</span>
            <span>Projekt</span>
          </div>
          <div 
            className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`}
            onClick={() => setCurrentView('calendar')}
          >
            <span className="material-symbols-outlined">calendar_today</span>
            <span>Kalender</span>
          </div>
          <div 
            className={`nav-item ${currentView === 'documents' ? 'active' : ''}`}
            onClick={() => setCurrentView('documents')}
          >
            <span className="material-symbols-outlined">description</span>
            <span>Dokument</span>
          </div>
          <div 
            className={`nav-item ${currentView === 'invoice' ? 'active' : ''}`}
            onClick={() => setCurrentView('invoice')}
          >
            <span className="material-symbols-outlined">receipt_long</span>
            <span>Fakturering</span>
          </div>
        </div>
      </div>
      
      <div className="nav-section">
        <div className="nav-header">VERKTYG</div>
        <div className="nav-items">
          <div 
            className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentView('settings')}
          >
            <span className="material-symbols-outlined">settings</span>
            <span>Inställningar</span>
          </div>
        </div>
      </div>
    </nav>
  )

  const renderDashboardView = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Översikt av dina projekt och aktiviteter</p>
      </div>

      <div className="projects-section">
        <h2>Aktiva projekt</h2>
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <div 
                  className="project-status-indicator"
                  style={{ backgroundColor: project.color }}
                ></div>
                <h3>{project.name}</h3>
                <div className="project-menu">
                  <span className="material-symbols-outlined">more_vert</span>
                </div>
              </div>
              
              {project.customer && (
                <div className="project-customer">
                  <strong>Kund:</strong> {project.customer}
                </div>
              )}
              
              {project.deadline && (
                <div className="project-deadline">
                  <strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString('sv-SE')}
                </div>
              )}
              
              <div className="project-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${project.progress}%`,
                      backgroundColor: project.color 
                    }}
                  ></div>
                </div>
                <span className="progress-text">{project.progress}%</span>
              </div>
              
              <div className="project-status">
                Status: {project.status === 'active' ? 'Aktiv' : 
                         project.status === 'completed' ? 'Klar' : 'Utkast'}
              </div>
              
              {project.driveFolder && (
                <div className="project-actions">
                  <button 
                    className="action-btn"
                    onClick={() => openDriveFolder(project.driveFolder!)}
                  >
                    <span className="material-symbols-outlined">folder</span>
                    Drive-mapp
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => generateProjectPDF(project)}
                  >
                    <span className="material-symbols-outlined">picture_as_pdf</span>
                    PDF-rapport
                  </button>
                </div>
              )}
            </div>
          ))}
          
          <div className="project-card new-project">
            <div className="new-project-content">
              <span className="material-symbols-outlined">add</span>
              <h3>Nytt projekt</h3>
              <p>Skapa ett nytt byggprojekt</p>
              <button 
                className="create-project-btn"
                onClick={createNewProject}
              >
                Skapa projekt
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="widgets-grid">
        <div className="widget">
          <div className="widget-header">
            <span className="material-symbols-outlined">calendar_today</span>
            <h3>Kommande händelser</h3>
          </div>
          <div className="widget-content">
            {user.isLoggedIn ? (
              <p>Hämtar kalenderdata...</p>
            ) : (
              <p>Logga in för att se kommande händelser</p>
            )}
          </div>
        </div>

        <div className="widget">
          <div className="widget-header">
            <span className="material-symbols-outlined">mail</span>
            <h3>Senaste meddelanden</h3>
          </div>
          <div className="widget-content">
            {user.isLoggedIn ? (
              <p>Hämtar e-postdata...</p>
            ) : (
              <p>Logga in för att se senaste meddelanden</p>
            )}
          </div>
        </div>

        <div className="widget">
          <div className="widget-header">
            <span className="material-symbols-outlined">description</span>
            <h3>Senaste dokument</h3>
          </div>
          <div className="widget-content">
            {user.isLoggedIn ? (
              <p>Hämtar dokumentdata...</p>
            ) : (
              <p>Logga in för att se senaste dokument</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderPlaceholderView = (viewName: string) => (
    <div className="placeholder-view">
      <div className="placeholder-content">
        <span className="material-symbols-outlined">construction</span>
        <h2>{viewName}</h2>
        <p>Denna sektion är under utveckling</p>
        {!user.isLoggedIn && (
          <div className="auth-prompt">
            <p>Logga in för att se innehållet</p>
            <button onClick={handleGoogleSignIn} className="google-signin-btn">
              Logga in med Google
            </button>
          </div>
        )}
      </div>
    </div>
  )

  const renderProjectView = () => (
    <div className="project-view">
      <div className="page-header">
        <h1>Projekt</h1>
        <p>Hantera dina byggprojekt</p>
      </div>

      <div className="project-filters">
        <button className="filter-btn active">Alla</button>
        <button className="filter-btn">Aktiva</button>
        <button className="filter-btn">Avslutade</button>
        <button className="filter-btn">Utkast</button>
      </div>

      <div className="projects-list">
        {projects.map(project => (
          <div key={project.id} className="project-list-item">
            <div className="project-list-header">
              <div className="project-info">
                <div 
                  className="project-status-indicator"
                  style={{ backgroundColor: project.color }}
                ></div>
                <div>
                  <h3>{project.name}</h3>
                  {project.customer && <p>Kund: {project.customer}</p>}
                </div>
              </div>
              <div className="project-list-actions">
                <span className="progress-text">{project.progress}%</span>
                <button className="action-btn-small">
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button className="action-btn-small">
                  <span className="material-symbols-outlined">folder</span>
                </button>
              </div>
            </div>
            <div className="project-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${project.progress}%`,
                    backgroundColor: project.color 
                  }}
                ></div>
              </div>
            </div>
            {project.deadline && (
              <div className="project-deadline">
                Deadline: {new Date(project.deadline).toLocaleDateString('sv-SE')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard': return renderDashboardView()
      case 'project': return renderProjectView()
      case 'calendar': return renderPlaceholderView('Kalender')
      case 'documents': return renderPlaceholderView('Dokument')
      case 'invoice': return renderPlaceholderView('Fakturering')
      case 'settings': return renderPlaceholderView('Inställningar')
      default: return renderPlaceholderView(currentView)
    }
  }

  const renderChatDrawer = () => (
    <div id="chat-drawer" className={`chat-drawer ${isChatExpanded ? 'expanded' : ''}`}>
      <div className="chat-drawer-content">
        {isChatExpanded && (
          <>
            <div id="chat-messages" className="chat-messages">
              {chatMessages.length === 0 ? (
                <div className="welcome-message">
                  <h3>👋 Hej! Jag är din digitala kollega</h3>
                  <p>Fråga mig om allt inom bygg och hantverk. Jag kan hjälpa dig med:</p>
                  <ul>
                    <li>Projektplanering och checklister</li>
                    <li>Byggregler och standarder</li>
                    <li>Materialberäkningar</li>
                    <li>Dokumenthantering</li>
                  </ul>
                </div>
              ) : (
                chatMessages.map(msg => (
                  <div key={msg.id} className={`chat-message ${msg.type}`}>
                    {msg.message}
                  </div>
                ))
              )}
              {isLoading && (
                <div className="chat-message ai">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>
            
            {attachedFiles.length > 0 && (
              <div id="attached-files-preview" className="attached-files-preview">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="file-preview-item">
                    <img src={URL.createObjectURL(file)} alt={file.name} />
                    <button 
                      className="remove-file-btn"
                      onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="chat-input-wrapper">
          <div className="chat-input-container">
            <div className="chat-input-area">
              <button 
                id="chat-toggle-button"
                className={`chat-toggle-button ${!isChatExpanded ? 'pulse' : ''}`}
                onClick={toggleChat}
              >
                <span className="material-symbols-outlined">
                  {isChatExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
                </span>
              </button>

              <input
                ref={chatInputRef}
                id="chat-input"
                type="text"
                placeholder={placeholderText}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onFocus={handleChatInputFocus}
                onKeyDown={handleKeyDown}
                className="chat-input"
              />

              <button 
                className="attachment-button"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <span className="material-symbols-outlined">attach_file</span>
              </button>

              <button 
                className="send-button"
                onClick={sendMessage}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-indicator">
                    <span className="material-symbols-outlined">hourglass_empty</span>
                  </div>
                ) : (
                  <span className="material-symbols-outlined">send</span>
                )}
              </button>

              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files) {
                    setAttachedFiles(prev => [...prev, ...Array.from(e.target.files!)])
                  }
                }}
              />
            </div>
          </div>
          
          {isChatExpanded && (
            <div className="chat-disclaimer">
              <p>ByggPilot kan göra misstag. Kontrollera viktig information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="app">
      {renderHeader()}
      <div className="main-layout">
        {renderSidebar()}
        <main className={`page-content ${isChatExpanded ? 'hidden-by-chat' : ''}`}>
          {renderCurrentView()}
        </main>
      </div>
      {renderChatDrawer()}
    </div>
  )
}
