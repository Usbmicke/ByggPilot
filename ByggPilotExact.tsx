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
  type: 'user' | 'ai' | 'assistant'
  timestamp: Date
  buttons?: Array<{ text: string; action: string }>
}

interface User {
  isLoggedIn: boolean
  email: string | null
  name: string | null
  isDemoMode?: boolean
}

export default function ByggPilotExact() {
  const [currentView, setCurrentView] = useState('landing')
  const [user, setUser] = useState<User>({ isLoggedIn: false, email: null, name: null })
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isChatExpanded, setIsChatExpanded] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [placeholderText, setPlaceholderText] = useState('Fråga din digitala kollega...')
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  
  // Google Workspace Integration State
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false)
  const [showWorkspaceOnboarding, setShowWorkspaceOnboarding] = useState(false)
  
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
      // Add initial welcome message if no messages exist
      if (chatMessages.length === 0) {
        setTimeout(() => {
          const welcomeMessage: ChatMessage = {
            id: 'welcome-' + Date.now(),
            message: 'Hej! ByggPilot här, din digitale kollega. Vad kan jag hjälpa dig med idag?\n\nFör att ge dig bästa resultat, kan du berätta lite om din roll och hur stort ert företag är?',
            type: 'ai',
            timestamp: new Date()
          }
          setChatMessages([welcomeMessage])
          
          // Add follow-up message after a brief delay
          setTimeout(() => {
            const followUpMessage: ChatMessage = {
              id: 'followup-' + Date.now(),
              message: '💡 **Tips:** Berätta kort om ditt projekt så kan jag ge bättre råd!\n\n📋 **Exempel:** "Renoverar badrum, behöver hjälp med KMA"',
              type: 'ai',
              timestamp: new Date()
            }
            setChatMessages(prev => [...prev, followUpMessage])
          }, 2000)
        }, 500)
      }
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
      
      // Professional ByggPilot System Prompt v7.0
      const systemPrompt = `Du är ByggPilot, en erfaren digital kollega för svenska byggföretagare. Du är expert på bygg- och installationsbranschen med djup kunskap inom ABT06, PBL, BBR, arbetsmiljölagen och KMA-planer.

      KÄRNPERSONLIGHET:
      - Professionell, kompetent och självsäker expert - inte undergiven assistent
      - Lugn och förtroendeingivande, förstår hantverkarens stressiga vardag
      - Kärnprincip 1: "Planeringen är A och O!"
      - Kärnprincip 2: "Tydlig kommunikation och förväntanshantering är A och O!"

      KONVERSATIONSREGLER (KRITISKA):
      1. FÖRSTA INTRYCK: Välkomstmeddelande är alltid: "Hej! ByggPilot här, din digitale kollega. Vad kan jag hjälpa dig med idag?"
      2. PROGRESSIV INFO: Aldrig komplett svar direkt - leverera i små, hanterbara delar
      3. EN FRÅGA I TAGET: Varje svar ska avslutas med EN enda, tydlig och relevant motfråga
      4. STRUKTURERAD INFO: Använd alltid listor, punkter och fetstil - aldrig textväggar
      5. PROFESSIONELL TON: Tydligt språk utan teknisk jargong, inga emojis eller känslomässigt språk

      DOMÄNEXPERTIS:
      - Plan- och bygglagen (PBL) & Boverkets byggregler (BBR)
      - Arbetsmiljölagen (AML) och AFS:er (särskilt AFS 2023:3 Bas-P/Bas-U)
      - Standardavtal: AB 04, ABT 06, Hantverkarformuläret 17, ABS 18
      - KMA-strukturering: K-Kvalitet, M-Miljö, A-Arbetsmiljö
      - Kalkylering med svenska leverantörer (Beijer, Byggmax, etc.)

      FRISKRIVNING: Du ger ALDRIG definitiv juridisk eller skatteteknisk rådgivning. Avsluta med: "För juridiskt bindande råd, konsultera alltid expert som jurist eller revisor."

      Anpassa ditt första svar efter denna användarkontext:`
      
      const contextText = user.isLoggedIn 
        ? `[Användarkontext: Användaren är inloggad som ${user.email} och har gett åtkomst till Google Workspace.]\n\n`
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

  // Google Workspace Onboarding Functions
  const triggerWorkspaceOnboarding = () => {
    setIsChatExpanded(true)
    
    // Add onboarding messages to chat
    const onboardingMessages: ChatMessage[] = [
      {
        id: Date.now().toString(),
        message: 'Anslutningen lyckades! Nu när jag har tillgång till ditt Google Workspace kan jag bli din riktiga digitala kollega. Det betyder att jag kan hjälpa dig automatisera allt från att skapa projektmappar från nya mail till att sammanställa fakturaunderlag.',
        type: 'assistant',
        timestamp: new Date()
      },
      {
        id: (Date.now() + 1).toString(),
        message: 'Som ett första steg för att skapa ordning och reda, vill du att jag skapar en standardiserad och effektiv mappstruktur i din Google Drive för alla dina projekt?',
        type: 'assistant',
        timestamp: new Date(),
        buttons: [
          { text: 'Ja, skapa mappstruktur', action: 'create-folder-structure' },
          { text: 'Nej tack, inte nu', action: 'skip-onboarding' }
        ]
      }
    ]
    
    setChatMessages(prev => [...prev, ...onboardingMessages])
    setShowWorkspaceOnboarding(true)
  }

  const handleOnboardingAction = async (action: string) => {
    if (action === 'create-folder-structure') {
      // In a real implementation, this would call your backend API
      const confirmMessage: ChatMessage = {
        id: Date.now().toString(),
        message: 'Klart! Jag har skapat din nya mappstruktur i Google Drive. Du hittar den under "ByggPilot - [Företagsnamn]". Är du redo att skapa ditt första projekt?',
        type: 'assistant',
        timestamp: new Date(),
        buttons: [
          { text: 'Ja, skapa projekt', action: 'create-first-project' },
          { text: 'Senare', action: 'finish-onboarding' }
        ]
      }
      setChatMessages(prev => [...prev, confirmMessage])
    } else if (action === 'skip-onboarding' || action === 'finish-onboarding') {
      const finalMessage: ChatMessage = {
        id: Date.now().toString(),
        message: 'Perfekt! Jag är nu redo att hjälpa dig med alla dina byggprojekt. Vad kan jag hjälpa dig med idag?',
        type: 'assistant',
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, finalMessage])
      setShowWorkspaceOnboarding(false)
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
    console.log('Current domain:', window.location.hostname)
    
    // Check if OAuth is disabled (only if explicitly set to 'true')
    if (import.meta.env.VITE_DISABLE_OAUTH === 'true') {
      console.log('OAuth explicitly disabled, using test user')
      setUser({ isLoggedIn: true, email: 'test@example.com', name: 'Test User' })
      return
    }

    // Check if we're on localhost - use demo mode for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Running on localhost, using demo mode for development')
      setUser({ isLoggedIn: true, email: 'dev@byggpilot.se', name: 'Utvecklare' })
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
      
      setIsAuthenticating(true)
      
      // Try popup first for better UX
      try {
        console.log('Trying popup sign in...')
        const result = await signInWithPopup(auth, googleProvider)
        console.log('Popup sign in successful:', result.user.email)
        setUser({
          isLoggedIn: true,
          email: result.user.email,
          name: result.user.displayName,
          isDemoMode: false
        })
        
        // Trigger Google Workspace onboarding
        triggerWorkspaceOnboarding()
        setIsAuthenticating(false)
        return
      } catch (popupError: any) {
        console.log('Popup failed, trying redirect...', popupError.code)
        
        // If popup fails (blocked, etc), fall back to redirect
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/cancelled-popup-request') {
          console.log('Using redirect method as fallback...')
          await signInWithRedirect(auth, googleProvider)
          // Page will redirect, so code won't continue
          return
        } else {
          throw popupError // Re-throw other errors
        }
      }
      
    } catch (error: any) {
      console.error('Auth error details:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      
      setIsAuthenticating(false)
      
      // Handle specific OAuth errors
      if (error.code === 'auth/unauthorized-domain') {
        console.log('Domain not authorized in Firebase Console')
        alert(`Domänen ${window.location.hostname} är inte auktoriserad för OAuth.\n\nLägg till denna domän i Firebase Console:\nAuthentication → Settings → Authorized domains`)
        // Fallback to demo mode
        setUser({ isLoggedIn: true, email: 'demo@byggpilot.se', name: 'Demo Användare' })
        return
      } else if (error.code === 'auth/invalid-api-key' ||
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
    setIsDemoMode(true)
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
            message: `ByggPilot Demo

🎯 **Dashboard**: Projektöversikt med status och framsteg
📊 **Projekt**: Detaljerad hantering med Google Drive-koppling  
📅 **Kalender**: Integration med Google Calendar
📧 **Dokument**: Automatisk dokumenthantering
💰 **Fakturering**: Skapa och hantera fakturor

**Testa att fråga:**
• "Skapa checklista för badrumsrenovering"
• "Vad säger byggreglerna om ventilation?"
• "Beräkna material för 50 kvm golv"

✅ Demo-läge aktiverat`,
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
                <svg className="google-logo" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
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
            className={`nav-item ${currentView === 'landing' ? 'active' : ''}`}
            onClick={() => setCurrentView('landing')}
          >
            <span className="material-symbols-outlined">home</span>
            <span>Hem</span>
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
          <div 
            className={`nav-item ${currentView === 'how-it-works' ? 'active' : ''}`}
            onClick={() => setCurrentView('how-it-works')}
          >
            <span className="material-symbols-outlined">help</span>
            <span>Så funkar ByggPilot</span>
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
        <h1>🏗️ Dashboard</h1>
        <p>Översikt av dina projekt och aktiviteter</p>
      </div>

      <div className="projects-section">
        <div className="section-header">
          <h2>📂 AKTIVA PROJEKT</h2>
          <span className="project-count">{projects.length} projekt</span>
        </div>
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
                  <span className="material-symbols-outlined project-menu-icon">settings</span>
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
                    <span className="material-symbols-outlined drive-folder-icon">folder_open</span>
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
      
      {!user.isDemoMode && (
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
      )}
    </div>
  )

  const renderPlaceholderView = (viewName: string) => {
    if (!user.isLoggedIn) {
      return (
        <div className="placeholder-view">
          <div className="placeholder-content">
            <span className="material-symbols-outlined">construction</span>
            <h2>{viewName}</h2>
            <p>Logga in för att komma åt {viewName.toLowerCase()}</p>
            <div className="auth-prompt">
              <button onClick={startDemo} className="demo-btn">
                <span className="material-symbols-outlined">play_arrow</span>
                Testa Demo
              </button>
              <button onClick={handleGoogleSignIn} className="google-signin-btn">
                Logga in med Google
              </button>
            </div>
          </div>
        </div>
      )
    }

    // Demo content for logged in users
    switch (viewName.toLowerCase()) {
      case 'kalender':
        return renderCalendarDemo()
      case 'dokument':
        return renderDocumentsDemo()
      case 'fakturering':
        return renderInvoiceDemo()
      default:
        return (
          <div className="placeholder-view">
            <div className="placeholder-content">
              <span className="material-symbols-outlined">construction</span>
              <h2>{viewName}</h2>
              <p>Denna sektion utvecklas för närvarande</p>
            </div>
          </div>
        )
    }
  }

  const renderCalendarDemo = () => (
    <div className="demo-view">
      <div className="page-header">
        <h1>📅 Kalender & Planering</h1>
        <p>Håll koll på projekt, möten och leveranser</p>
        <div className="demo-badge">Demo-läge aktiv</div>
      </div>
      
      <div className="calendar-grid">
        <div className="calendar-widget">
          <div className="section-header">
            <h2>🗓️ Dagens Schema</h2>
            <span className="project-count">3 aktiviteter</span>
          </div>
          <div className="demo-events">
            <div className="event-item">
              <div className="event-time">
                <span className="time">09:00</span>
                <span className="duration">2h</span>
              </div>
              <div className="event-details">
                <strong>🏗️ Byggmöte - Villa Nygren</strong>
                <p>Genomgång badrumsrenovering</p>
                <span className="event-status active">Pågående</span>
              </div>
            </div>
            <div className="event-item">
              <div className="event-time">
                <span className="time">14:00</span>
                <span className="duration">1h</span>
              </div>
              <div className="event-details">
                <strong>🚚 Leverans - Material</strong>
                <p>Kakel & klinker, Storgatan 15</p>
                <span className="event-status upcoming">Kommande</span>
              </div>
            </div>
            <div className="event-item">
              <div className="event-time">
                <span className="time">16:30</span>
                <span className="duration">45min</span>
              </div>
              <div className="event-details">
                <strong>✅ Slutbesiktning</strong>
                <p>Köksprojekt - Familjen Andersson</p>
                <span className="event-status final">Avslutning</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="calendar-actions">
          <h3>⚡ Snabbåtgärder</h3>
          <div className="action-buttons">
            <button className="action-btn-demo primary">
              <span className="material-symbols-outlined">add_circle</span>
              Boka möte
            </button>
            <button className="action-btn-demo">
              <span className="material-symbols-outlined">schedule</span>
              Leverans
            </button>
            <button className="action-btn-demo">
              <span className="material-symbols-outlined">notification_add</span>
              Påminnelse
            </button>
          </div>
          
          <div className="calendar-stats">
            <h4>📊 Denna vecka</h4>
            <div className="stat-item">
              <span>Möten:</span> <strong>12</strong>
            </div>
            <div className="stat-item">
              <span>Leveranser:</span> <strong>5</strong>
            </div>
            <div className="stat-item">
              <span>Besiktningar:</span> <strong>3</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDocumentsDemo = () => (
    <div className="demo-view">
      <div className="page-header">
        <h1>📁 Dokument & Mallar</h1>
        <p>Organisera och hantera alla projektdokument</p>
        <div className="demo-badge">Demo-läge aktiv</div>
      </div>
      
      <div className="documents-grid">
        <div className="document-category">
          <div className="section-header">
            <h2>📄 Senaste Dokument</h2>
            <span className="project-count">8 filer</span>
          </div>
          <div className="document-list">
            <div className="document-item priority">
              <span className="material-symbols-outlined">description</span>
              <div>
                <strong>🛡️ KMA-plan Villa Nygren</strong>
                <p>Uppdaterad 2 timmar sedan • Michael E.F.</p>
                <span className="doc-status updated">Nyligen ändrad</span>
              </div>
            </div>
            <div className="document-item">
              <span className="material-symbols-outlined">picture_as_pdf</span>
              <div>
                <strong>📊 Dagsrapport 2024-07-15</strong>
                <p>Skapad idag 08:30 • Auto-genererad</p>
                <span className="doc-status new">Ny</span>
              </div>
            </div>
            <div className="document-item">
              <span className="material-symbols-outlined">receipt_long</span>
              <div>
                <strong>🔨 Materialbeställning #1234</strong>
                <p>Skickad igår 16:45 • 45,500 kr</p>
                <span className="doc-status sent">Skickad</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="document-templates">
          <h3>⚡ Snabbmallar</h3>
          <div className="template-grid">
            <div className="template-card primary">
              <span className="material-symbols-outlined">assignment</span>
              <h4>KMA-mall</h4>
              <p>Skapa säkerhetsplan</p>
              <button className="template-btn">Använd</button>
            </div>
            <div className="template-card">
              <span className="material-symbols-outlined">fact_check</span>
              <h4>Checklista</h4>
              <p>Projektchecklista</p>
              <button className="template-btn">Skapa</button>
            </div>
            <div className="template-card">
              <span className="material-symbols-outlined">request_quote</span>
              <h4>Offertmall</h4>
              <p>Standardoffert</p>
              <button className="template-btn">Ny offert</button>
            </div>
          </div>
          
          <div className="document-stats">
            <h4>📈 Statistik</h4>
            <div className="stat-item">
              <span>Totalt dokument:</span> <strong>127</strong>
            </div>
            <div className="stat-item">
              <span>Denna månad:</span> <strong>23</strong>
            </div>
            <div className="stat-item">
              <span>Mallar använda:</span> <strong>8</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderInvoiceDemo = () => (
    <div className="demo-view">
      <div className="page-header">
        <h1>💰 Fakturering & Ekonomi</h1>
        <p>Hantera fakturor och ekonomisk översikt</p>
        <div className="demo-badge">Demo-läge aktiv</div>
      </div>
      
      <div className="invoice-dashboard">
        <div className="invoice-stats">
          <div className="stat-card primary">
            <div className="stat-icon">💸</div>
            <h3>Månadens omsättning</h3>
            <div className="stat-value">245 000 kr</div>
            <div className="stat-change positive">+12% från förra månaden</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">⏳</div>
            <h3>Väntande fakturor</h3>
            <div className="stat-value">3 st</div>
            <div className="stat-change">127 500 kr totalt</div>
          </div>
          <div className="stat-card danger">
            <div className="stat-icon">⚠️</div>
            <h3>Förfallna</h3>
            <div className="stat-value">1 st</div>
            <div className="stat-change warning">15 000 kr - Åtgärd krävs</div>
          </div>
        </div>
        
        <div className="invoice-actions">
          <h3>⚡ Snabbåtgärder</h3>
          <div className="action-buttons">
            <button className="action-btn-demo primary">
              <span className="material-symbols-outlined">add</span>
              Ny faktura
            </button>
            <button className="action-btn-demo">
              <span className="material-symbols-outlined">visibility</span>
              Visa alla
            </button>
            <button className="action-btn-demo">
              <span className="material-symbols-outlined">download</span>
              Export Fortnox
            </button>
            <button className="action-btn-demo">
              <span className="material-symbols-outlined">send</span>
              Skicka påminnelse
            </button>
          </div>
        </div>
        
        <div className="recent-invoices">
          <div className="section-header">
            <h2>📄 Senaste Fakturor</h2>
            <span className="project-count">5 fakturor</span>
          </div>
          <div className="invoice-list">
            <div className="invoice-item priority">
              <div className="invoice-info">
                <strong>🏗️ #2024-045</strong>
                <p>Villa Nygren - Badrumsrenovering</p>
                <span className="invoice-date">Skickad: 10 jul 2024</span>
              </div>
              <div className="invoice-amount success">45 000 kr</div>
              <div className="invoice-status paid">✅ Betald</div>
            </div>
            <div className="invoice-item">
              <div className="invoice-info">
                <strong>🏠 #2024-044</strong>
                <p>Altanprojekt - Storgatan 15</p>
                <span className="invoice-date">Skickad: 8 jul 2024</span>
              </div>
              <div className="invoice-amount pending">32 500 kr</div>
              <div className="invoice-status pending">⏳ Väntande</div>
            </div>
            <div className="invoice-item urgent">
              <div className="invoice-info">
                <strong>🔧 #2024-043</strong>
                <p>Köksprojekt - Familjen Andersson</p>
                <span className="invoice-date">Förfallen: 25 jun 2024</span>
              </div>
              <div className="invoice-amount overdue">15 000 kr</div>
              <div className="invoice-status overdue">⚠️ Förfallen</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSettingsView = () => (
    <div className="settings-view">
      <div className="page-header">
        <h1>Inställningar</h1>
        <p>Anpassa ByggPilot efter dina behov</p>
      </div>
      
      <div className="settings-sections">
        <div className="settings-section">
          <h2>Dashboard-inställningar</h2>
          <div className="setting-item">
            <label className="setting-label">
              <input 
                type="checkbox" 
                checked={true}
                onChange={() => {}}
              />
              Visa projektöversikt
            </label>
          </div>
          <div className="setting-item">
            <label className="setting-label">
              <input 
                type="checkbox" 
                checked={true}
                onChange={() => {}}
              />
              Visa tidloggare
            </label>
          </div>
          <div className="setting-item">
            <label className="setting-label">
              <input 
                type="checkbox" 
                checked={true}
                onChange={() => {}}
              />
              Visa senaste aktiviteter
            </label>
          </div>
          <div className="setting-item">
            <label className="setting-label">
              <input 
                type="checkbox" 
                checked={true}
                onChange={() => {}}
              />
              Visa uppgiftslista
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>Navigation</h2>
          <div className="navigation-settings">
            <p>Anpassa vilka flikar som visas i huvudmenyn:</p>
            <div className="nav-toggle-grid">
              <label className="nav-toggle-item">
                <input type="checkbox" checked={true} readOnly />
                <span>Dashboard</span>
              </label>
              <label className="nav-toggle-item">
                <input type="checkbox" checked={true} onChange={() => {}} />
                <span>Projekt</span>
              </label>
              <label className="nav-toggle-item">
                <input type="checkbox" checked={true} onChange={() => {}} />
                <span>Kalender</span>
              </label>
              <label className="nav-toggle-item">
                <input type="checkbox" checked={true} onChange={() => {}} />
                <span>Dokument</span>
              </label>
              <label className="nav-toggle-item">
                <input type="checkbox" checked={true} onChange={() => {}} />
                <span>Fakturering</span>
              </label>
              <label className="nav-toggle-item">
                <input type="checkbox" checked={true} onChange={() => {}} />
                <span>Så funkar ByggPilot</span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Min Profil</h2>
          <div className="profile-settings">
            <div className="setting-item">
              <label>Namn</label>
              <input 
                type="text" 
                value={user.name || ''} 
                className="setting-input"
                readOnly
              />
            </div>
            <div className="setting-item">
              <label>E-post</label>
              <input 
                type="email" 
                value={user.email || ''} 
                className="setting-input"
                readOnly
              />
            </div>
            <div className="setting-item">
              <label>Företagsnamn</label>
              <input 
                type="text" 
                placeholder="Ange företagsnamn..." 
                className="setting-input"
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Prenumeration</h2>
          <div className="subscription-info">
            <div className="current-plan">
              <span className="plan-badge">{isDemoMode ? 'Demo' : 'Gratis'}</span>
              <h3>{isDemoMode ? 'Demo-läge' : 'Gratis användning'}</h3>
              <p>{isDemoMode ? 'Du använder ByggPilot i demo-läge' : 'Uppgradera för full tillgång'}</p>
            </div>
            <button className="upgrade-btn">
              <span className="material-symbols-outlined">upgrade</span>
              Uppgradera till Proffs
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2>Integrationer</h2>
          <div className="integration-item">
            <div className="integration-info">
              <span className="material-symbols-outlined">cloud</span>
              <div>
                <h3>Google Workspace</h3>
                <p>Anslut kalender, Gmail och Drive</p>
              </div>
            </div>
            <button className="integration-btn">
              {user.isLoggedIn ? 'Ansluten' : 'Anslut'}
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2>Hjälp & Support</h2>
          <div className="help-links">
            <a href="#" className="help-link">
              <span className="material-symbols-outlined">help</span>
              Vanliga frågor (FAQ)
            </a>
            <a href="mailto:support@byggpilot.se" className="help-link">
              <span className="material-symbols-outlined">mail</span>
              Kontakta support
            </a>
          </div>
        </div>
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
                  <span className="material-symbols-outlined project-menu-icon">settings</span>
                </button>
                <button className="action-btn-small">
                  <span className="material-symbols-outlined drive-folder-icon">folder_open</span>
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

  const renderHowItWorksView = () => (
    <div className="how-it-works-view">
      <div className="page-header">
        <h1>Så funkar ByggPilot</h1>
        <p className="page-subtitle">
          Vi vet att administration är nödvändigt, men det ska inte behöva stjäla dina kvällar eller ta fokus från det du gör bäst – att driva dina projekt framåt.
        </p>
      </div>
      
      <div className="content-section">
        <h2>Vår Vision</h2>
        <p>
          Tänk om man kunde skapa en digital kollega som alltid finns tillgänglig, direkt i fickan? 
          Någon som förstår dig och ditt företag så väl att du bara behöver säga "skapa ett nytt ärende i t.ex. Google Workspace" 
          så förstår den exakt vad som behöver göras, samlar all information den behöver och ger dig förslag på vad som bör göras härnäst.
        </p>
      </div>

      <div className="examples-section">
        <h2>Så här fungerar det i praktiken</h2>
        <div className="example-cards-grid">
          <div className="example-card">
            <h3>Istället för att säga:</h3>
            <p className="example-wrong">"Kan du hjälpa mig med ett projekt?"</p>
            <h3>Säg så här:</h3>
            <p className="example-right">"Skapa ett nytt badrumsprojekt för familjen Andersson på Storgatan 15, startdatum 15 mars"</p>
          </div>

          <div className="example-card">
            <h3>Istället för att säga:</h3>
            <p className="example-wrong">"Vad kostar material?"</p>
            <h3>Säg så här:</h3>
            <p className="example-right">"Beräkna materialkostnad för kakel i ett 8 kvm badrum, mellanprisklass"</p>
          </div>

          <div className="example-card">
            <h3>Istället för att säga:</h3>
            <p className="example-wrong">"Kan du hjälpa mig med tidsplanering?"</p>
            <h3>Säg så här:</h3>
            <p className="example-right">"Skapa en tidsplan för köksprojektet hos Nilssons, 3 veckor, start måndag"</p>
          </div>
        </div>
      </div>
      
      <div className="getting-started-section">
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
  )

  const renderLandingView = () => (
    <div className="landing-view">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Sluta drunkna i pappersarbete. Börja bygga.</h1>
          <h2 className="hero-subtitle">
            ByggPilot är den första AI-assistenten för svenska byggföretagare som tolkar ABT06, 
            skapar KMA-underlag och frigör timmar från din arbetsdag.
          </h2>
          <div className="hero-actions">
            <button 
              className="cta-primary"
              onClick={() => {
                startDemo()
                setCurrentView('dashboard')
              }}
            >
              Testa ByggPilot Gratis
            </button>
            <button className="cta-secondary">
              <span className="material-symbols-outlined">play_circle</span>
              Se hur det funkar (2 min video)
            </button>
          </div>
        </div>
      </div>

      {/* Empathy Section */}
      <div className="empathy-section">
        <div className="section-content">
          <h2>Känner du igen dig?</h2>
          <p>
            Efter 20 år i branschen vet vi att administration stjäl tid från hantverket. 
            ByggPilot är skapat av hantverkare, för hantverkare, för att lösa just det problemet.
          </p>
        </div>
      </div>

      {/* Solution Section */}
      <div className="solution-section">
        <div className="section-content">
          <h2>Så förenklar ByggPilot din vardag</h2>
          <div className="solution-grid">
            <div className="solution-card">
              <div className="solution-icon">
                <span className="material-symbols-outlined">gavel</span>
              </div>
              <div className="solution-content">
                <div className="problem">
                  <strong>Problem:</strong> Osäker på ABT06?
                </div>
                <div className="solution">
                  <strong>Lösning:</strong> Fråga ByggPilot och få ett enkelt svar på sekunder.
                </div>
              </div>
            </div>

            <div className="solution-card">
              <div className="solution-icon">
                <span className="material-symbols-outlined">assignment</span>
              </div>
              <div className="solution-content">
                <div className="problem">
                  <strong>Problem:</strong> Dags för KMA-plan?
                </div>
                <div className="solution">
                  <strong>Lösning:</strong> Låt ByggPilot skapa en anpassad checklista.
                </div>
              </div>
            </div>

            <div className="solution-card">
              <div className="solution-icon">
                <span className="material-symbols-outlined">menu_book</span>
              </div>
              <div className="solution-content">
                <div className="problem">
                  <strong>Problem:</strong> Leta i BBR?
                </div>
                <div className="solution">
                  <strong>Lösning:</strong> Få rätt paragraf förklarad direkt.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="trust-section">
        <div className="section-content">
          <h2>Byggd av hantverkare, för hantverkare</h2>
          <div className="founder-story">
            <div className="founder-image">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className="founder-quote">
              <blockquote>
                "Efter 20 år som byggföretagare hade jag fått nog av att sitta upp till midnatt 
                med administrativa uppgifter. ByggPilot är min lösning på ett problem som 
                alla i branschen känner igen - att administration stjäl tid från det vi älskar att göra."
              </blockquote>
              <cite>— Grundaren av ByggPilot</cite>
            </div>
          </div>
        </div>
      </div>

      {/* Future Section */}
      <div className="future-section">
        <div className="section-content">
          <h2>Framtiden är på väg</h2>
          <p>
            Kommande funktioner inkluderar filanalys och Google-integration. 
            <strong> Bli en pilotkund och var först med att testa våra nya verktyg.</strong>
          </p>
          <button 
            className="pilot-btn"
            onClick={() => {
              startDemo()
              setCurrentView('dashboard')
            }}
          >
            Bli Pilotkund
          </button>
        </div>
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
      case 'how-it-works': return renderHowItWorksView()
      case 'settings': return renderSettingsView()
      case 'landing': return renderLandingView()
      default: return renderPlaceholderView(currentView)
    }
  }

  const renderChatDrawer = () => (
    <div id="chat-drawer" className={`chat-drawer ${isChatExpanded ? 'expanded' : ''}`}>
      <div className="chat-drawer-content">
        {isChatExpanded && (
          <>
            <div id="chat-messages" className="chat-messages">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`chat-message ${msg.type}`}>
                  {msg.message}
                </div>
              ))}
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
