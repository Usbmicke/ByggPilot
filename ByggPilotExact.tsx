import { useState, useEffect, useRef } from 'react'
import { signInWithRedirect, signInWithPopup, getRedirectResult, signOut } from 'firebase/auth'
import { auth, setupGoogleProvider } from './firebase-config'
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
  
  // Login success notification
  const [showLoginSuccess, setShowLoginSuccess] = useState(false)
  const [hasWelcomedUser, setHasWelcomedUser] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Cookies/GDPR notification
  const [showCookiesNotification, setShowCookiesNotification] = useState(false)

  const chatInputRef = useRef<HTMLInputElement>(null)
  const placeholderInterval = useRef<number | null>(null)

  // Nya förbättrade placeholder-texter för chatten
  const placeholderTexts = [
    "Hur gör jag en KMA-plan för badrumsrenovering?",
    "Vilka bygglov behöver jag för altanbygge?", 
    "Beräkna material för 25 kvm flisläggning...",
    "Vad säger ABT 06 om försenade leveranser?",
    "Skapa checklista för tätskikt i våtrum...",
    "Hur fakturerar jag RUT-avdrag korrekt?",
    "Vilka AFS-regler gäller för byggställning?",
    "Sammanställ alla kostnader för Villa Andersson..."
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
      // Auto-focus med smooth delay och scroll
      setTimeout(() => {
        chatInputRef.current?.focus()
        scrollToBottom()
      }, 150)
    } else {
      startPlaceholderAnimation()
    }
  }

  const handleChatInputFocus = () => {
    if (!isChatExpanded) {
      toggleChat()
    }
  }
  
  // Navigation handler with chat auto-minimize
  const handleNavigation = (view: string) => {
    setCurrentView(view)
    // Fäll ner chatten automatiskt vid byte av vy
    if (isChatExpanded) {
      setIsChatExpanded(false)
      startPlaceholderAnimation()
    }
  }
  
  // Cookies notification handlers
  const handleAcceptCookies = () => {
    localStorage.setItem('cookies-accepted', 'true')
    setShowCookiesNotification(false)
  }
  
  const handleCustomizeCookies = () => {
    // TODO: Implement cookie customization modal
    alert('Funktionen för att anpassa cookies kommer snart!')
    setShowCookiesNotification(false)
  }

  // Kopieringsfunktion för meddelanden
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Visa bekräftelse
      const notification = document.createElement('div');
      notification.textContent = 'Kopierat!';
      notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: #00BFFF;
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 191, 255, 0.3);
        animation: fadeInOut 2s ease-in-out;
      `;
      
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 2000);
    } catch (err) {
      console.error('Kunde inte kopiera:', err);
    }
  };

  // Auto-scroll till botten av chatten
  const scrollToBottom = () => {
    setTimeout(() => {
      const messagesContainer = document.querySelector('.chat-messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  };

  const sendMessage = async () => {
    const userInput = chatInput.trim()
    if (!userInput && attachedFiles.length === 0) return

    // Spara aktuell historik
    const currentHistory = [...chatMessages]

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: userInput,
      type: 'user',
      timestamp: new Date()
    }

    // Lägg till användarens meddelande till historiken
    const updatedHistory = [...currentHistory, newMessage]
    setChatMessages(updatedHistory)
    setChatInput('')
    setIsLoading(true)

    // Auto-scroll efter användarens meddelande
    scrollToBottom()

    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '')
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      // Bygg konversationskontext från tidigare meddelanden
      const conversationContext = updatedHistory
        .filter(msg => msg.type === 'user' || msg.type === 'ai')
        .slice(-6) // Ta senaste 6 meddelanden för kontext
        .map(msg => `${msg.type === 'user' ? 'Användare' : 'ByggPilot'}: ${msg.message}`)
        .join('\n')
      
      // ByggPilot Master-Prompt v7.0 - Large Action Model
      const systemPrompt = `Du är ByggPilot, din digitala kollega i byggbranschen. Du är en erfaren, lugn och extremt kompetent expert som agerar proaktivt för att lösa administrativa uppgifter.

KÄRNPERSONLIGHET:
- Självsäker, rakt på sak och förtroendeingivande
- Djupt empatisk inför hantverkarens stressiga vardag  
- Fokus på att minska stress, skapa ordning och frigöra tid
- Två kärnprinciper: "Planeringen är A och O!" och "Tydlig kommunikation är A och O!"

KONVERSATIONSREGLER (ICKE-FÖRHANDLINGSBARA):
🚫 ALDRIG komplett, uttömmande svar direkt
🚫 ALDRIG långa textväggar eller listor
🚫 Max 2-3 korta meningar per svar
✅ Progressiv information i små, hanterbara delar
✅ ALLTID avsluta med EN tydlig motfråga
✅ Ta emot och agera på direkta kommandon

TEXTFORMATERING:
- Använd **fet text** för viktiga punkter
- Separera listor med tomrader för luftighet
- Aldrig ****text****text**** - använd radbrytningar istället
- Strukturera med punkter och kortare stycken

EXPERTKUNSKAP:
Plan- och bygglagen (PBL), BBR, AML, AFS:er, AB 04, ABT 06, AMA
Kalkylering, riskanalys (SWOT/Minirisk), KMA-planer (K-M-A struktur)
Svenska leverantörer: Beijer, Byggmax, etc.

ANVÄNDARKONTEXT: ${user.isLoggedIn ? `Inloggad som ${user.email}` : 'Inte inloggad'}

${conversationContext ? `Tidigare konversation:\n${conversationContext}\n` : ''}

VIKTIGT: Svara kort, tydligt och avsluta alltid med en relevant motfråga för att driva konversationen framåt.`
      
      const fullPrompt = systemPrompt + '\n\nAnvändarfråga: ' + userInput
      
      const result = await model.generateContent(fullPrompt)
      const response = await result.response
      const text = response.text()

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: text,
        type: 'ai',
        timestamp: new Date()
      }
      
      // Lägg bara till AI:ns svar när det är klart
      setChatMessages(prev => [...prev, aiMessage])
      
      // Auto-scroll till botten efter AI-svar
      scrollToBottom()
      
    } catch (error) {
      console.error('Gemini API error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: 'Det blev ett tekniskt fel. Försök igen eller kontrollera internetanslutningen.',
        type: 'ai',
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, errorMessage])
      
      // Auto-scroll även vid fel
      scrollToBottom()
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
    
    // Korta, tydliga onboarding-meddelanden
    const onboardingMessages: ChatMessage[] = [
      {
        id: Date.now().toString(),
        message: 'Perfekt! Google Workspace är nu anslutet. Jag kan nu hjälpa dig med dina projekt på riktigt.',
        type: 'assistant',
        timestamp: new Date()
      },
      {
        id: (Date.now() + 1).toString(),
        message: 'Vill du att jag skapar en projektmappstruktur i din Google Drive?',
        type: 'assistant',
        timestamp: new Date(),
        buttons: [
          { text: 'Ja, skapa mappstruktur', action: 'create-folder-structure' },
          { text: 'Nej tack', action: 'skip-onboarding' }
        ]
      }
    ]
    
    setChatMessages(prev => [...prev, ...onboardingMessages])
    setShowWorkspaceOnboarding(true)
  }

  const handleOnboardingAction = async (action: string) => {
    if (action === 'create-folder-structure') {
      // Visa loading-meddelande
      const loadingMessage: ChatMessage = {
        id: Date.now().toString(),
        message: 'Skapar projektmappstruktur i Google Drive...',
        type: 'assistant',
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, loadingMessage])

      // Anropa backend för att skapa mappstruktur
      const result = await googleWorkspaceAPI.setupProjectStructure()
      
      const confirmMessage: ChatMessage = {
        id: Date.now().toString(),
        message: result?.success ? 
          'Klart! Projektmappstruktur skapad i Google Drive. Redo för första projektet?' :
          'Kunde inte skapa mappstruktur just nu. Fortsätter utan.',
        type: 'assistant',
        timestamp: new Date(),
        buttons: result?.success ? [
          { text: 'Ja, skapa projekt', action: 'create-first-project' },
          { text: 'Senare', action: 'finish-onboarding' }
        ] : undefined
      }
      setChatMessages(prev => [...prev, confirmMessage])
      
    } else if (action === 'skip-onboarding' || action === 'finish-onboarding') {
      const finalMessage: ChatMessage = {
        id: Date.now().toString(),
        message: 'Perfekt! Vad kan jag hjälpa dig med idag?',
        type: 'assistant',
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, finalMessage])
      setShowWorkspaceOnboarding(false)
      
    } else if (action === 'create-first-project') {
      const projectMessage: ChatMessage = {
        id: Date.now().toString(),
        message: 'Vad heter projektet och vem är kunden? Jag skapar en projektmapp med mallar.',
        type: 'assistant',
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, projectMessage])
    }
  }

  // Time-based greeting function
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 10) return 'God morgon'
    if (hour < 17) return 'God eftermiddag' 
    return 'God kväll'
  }

  // Show success notification after login
  const showSuccessNotification = () => {
    setShowLoginSuccess(true)
    setTimeout(() => setShowLoginSuccess(false), 3000)
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

  // Auth functions med popup-först strategi
  const handleGoogleSignIn = async () => {
    console.log('=== GOOGLE SIGN IN CLICKED ===')
    console.log('Current domain:', window.location.hostname)
    
    // Check if OAuth is disabled (endast för development)
    if (import.meta.env.VITE_DISABLE_OAUTH === 'true') {
      console.log('OAuth explicitly disabled, using test user')
      setUser({ isLoggedIn: true, email: 'test@example.com', name: 'Test User' })
      return
    }

    // Demo mode för localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Running on localhost, using demo mode')
      setUser({ isLoggedIn: true, email: 'dev@byggpilot.se', name: 'Utvecklare' })
      return
    }

    // Check Firebase configuration
    if (!import.meta.env.VITE_FIREBASE_API_KEY || 
        !import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 
        !import.meta.env.VITE_FIREBASE_PROJECT_ID) {
      console.error('Firebase not properly configured')
      alert('Firebase-konfiguration saknas. Kontrollera .env-filen.')
      return
    }

    try {
      console.log('Attempting Google sign in with Firebase...')
      setIsAuthenticating(true)
      
      // Skapa Google provider med alla nödvändiga scopes
      const googleProvider = setupGoogleProvider()
      
      // Försök popup först
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
        showSuccessNotification()
        return
        
      } catch (popupError: any) {
        console.log('Popup failed, trying redirect...', popupError.code)
        
        // Om popup blockeras, använd redirect som fallback
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/cancelled-popup-request') {
          
          console.log('Using redirect method as fallback...')
          await signInWithRedirect(auth, googleProvider)
          return // Sidan kommer att redirecta
        } else {
          throw popupError // Re-throw andra fel
        }
      }
      
    } catch (error: any) {
      console.error('Auth error details:', error)
      setIsAuthenticating(false)
      
      // Hantera specifika OAuth-fel
      if (error.code === 'auth/unauthorized-domain') {
        console.log('Domain not authorized in Firebase Console')
        alert(`Domänen ${window.location.hostname} är inte auktoriserad för OAuth.\n\nLägg till denna domän i Firebase Console:\nAuthentication → Settings → Authorized domains`)
        // Fallback till demo mode
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
    } finally {
      setIsAuthenticating(false)
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
            message: `Perfekt! Här är **ByggPilot** i aktion.

**Huvudfunktioner:**
• Dashboard med projektöversikt
• Google Drive-integration för filer
• Automatisk dokumenthantering

Vad vill du testa först?`,
            type: 'ai',
            timestamp: new Date()
          }
          setChatMessages(prev => [...prev, aiResponse])
        }, 1000)
      }, 500)
    }, 100)
  }

  // Initialize chat messages once on mount
  useEffect(() => {
    if (!isInitialized && chatMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome-' + Date.now(),
        message: 'Hej! Jag är **ByggPilot** - din digitala kollega i byggbranschen.',
        type: 'ai',
        timestamp: new Date()
      };
      
      const followupMessage: ChatMessage = {
        id: 'followup-' + Date.now(),
        message: 'Vilken typ av projekt jobbar du med just nu?',
        type: 'ai',
        timestamp: new Date(Date.now() + 1000)
      };

      setChatMessages([welcomeMessage, followupMessage]);
      setIsInitialized(true)
      
      // Show cookies notification after a delay if not already accepted
      setTimeout(() => {
        const cookiesAccepted = localStorage.getItem('cookies-accepted')
        if (!cookiesAccepted) {
          setShowCookiesNotification(true)
        }
      }, 3000)
    }
  }, [isInitialized, chatMessages.length])

  // Initialize placeholder animation and auth state
  useEffect(() => {
    // Starta placeholder-animation direkt
    startPlaceholderAnimation()

    // Auth persistence and login state management
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          isLoggedIn: true,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Användare'
        })
        setIsAuthenticating(false)
        setCurrentView('dashboard')
        
        // Show success notification for new logins
        if (!showLoginSuccess && !hasWelcomedUser) {
          setShowLoginSuccess(true)
          setHasWelcomedUser(true)
          setTimeout(() => setShowLoginSuccess(false), 4000)
        }
      } else {
        setUser({ isLoggedIn: false, email: null, name: null })
        setIsAuthenticating(false)
        if (currentView === 'dashboard') {
          setCurrentView('landing')
        }
      }
    })

    return () => {
      unsubscribe()
      // Rensa placeholder-animation när komponenten unmountar
      if (placeholderInterval.current) {
        clearInterval(placeholderInterval.current)
      }
    }
  }, []) // Tom dependency array - körs bara en gång

  // Check for redirect result on mount
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result?.user) {
          setShowLoginSuccess(true)
          setTimeout(() => setShowLoginSuccess(false), 4000)
        }
      } catch (error) {
        console.error('Redirect result error:', error)
      }
    }
    
    checkRedirectResult()
  }, [])

  const renderHeader = () => (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 75 L80 75 L85 85 L15 85 Z" fill="white"/>
              <path d="M25 75 L75 75 L70 25 L30 25 Z" fill="white"/>
              <path d="M30 25 L70 25 L65 15 L35 15 Z" fill="white"/>
              <circle cx="50" cy="45" r="8" fill="#333"/>
              <path d="M45 40 L55 40 L53 50 L47 50 Z" fill="#333"/>
            </svg>
          </div>
          <span className="logo-text">BYGGPILOT</span>
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
                {isAuthenticating ? 'Omdirigerar...' : 'Logga in med Google'}
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
            onClick={() => handleNavigation('dashboard')}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Översikt</span>
          </div>
          <div 
            className={`nav-item ${currentView === 'landing' ? 'active' : ''}`}
            onClick={() => handleNavigation('landing')}
          >
            <span className="material-symbols-outlined">home</span>
            <span>Hem</span>
          </div>
          <div 
            className={`nav-item ${currentView === 'project' ? 'active' : ''}`}
            onClick={() => handleNavigation('project')}
          >
            <span className="material-symbols-outlined">construction</span>
            <span>Projekt</span>
          </div>
          <div 
            className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`}
            onClick={() => handleNavigation('calendar')}
          >
            <span className="material-symbols-outlined">calendar_today</span>
            <span>Kalender</span>
          </div>
          <div 
            className={`nav-item ${currentView === 'documents' ? 'active' : ''}`}
            onClick={() => handleNavigation('documents')}
          >
            <span className="material-symbols-outlined">description</span>
            <span>Dokument</span>
          </div>
          <div 
            className={`nav-item ${currentView === 'invoice' ? 'active' : ''}`}
            onClick={() => handleNavigation('invoice')}
          >
            <span className="material-symbols-outlined">receipt_long</span>
            <span>Fakturering</span>
          </div>
          <div 
            className={`nav-item ${currentView === 'how-it-works' ? 'active' : ''}`}
            onClick={() => handleNavigation('how-it-works')}
          >
            <span className="material-symbols-outlined">help</span>
            <span>Så funkar det</span>
          </div>
        </div>
      </div>
      
      <div className="nav-section">
        <div className="nav-header">VERKTYG</div>
        <div className="nav-items">
          <div 
            className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavigation('settings')}
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
        <h1>🏗️ Projektöversikt</h1>
        <p>Översikt av dina projekt och aktiviteter</p>
        <div className="status-indicator online">
          <span className="status-dot"></span>
          System online
        </div>
      </div>

      {/* Login Success Notification */}
      {showLoginSuccess && (
        <div className="success-notification">
          <span className="material-symbols-outlined">check_circle</span>
          <span>Inloggning lyckades! Google Workspace ansluten.</span>
        </div>
      )}

      {/* Senaste Nytt - prioriterat */}
      <div className="latest-news-section">
        <div className="section-header">
          <h2>📢 SENASTE NYTT</h2>
          <span className="project-count">3 viktiga</span>
        </div>
        <div className="news-grid">
          <div className="news-item urgent">
            <span className="news-icon">⚠️</span>
            <div className="news-content">
              <strong>Leverans försenad - Villa Nygren</strong>
              <p>Kakel från Beijer försenat 2 dagar. Kontakta kund.</p>
              <span className="news-time">2 tim sedan</span>
            </div>
          </div>
          <div className="news-item info">
            <span className="news-icon">📧</span>
            <div className="news-content">
              <strong>Nytt mail från Anna Andersson</strong>
              <p>Frågor om köksprojekt. Svar inom 4h.</p>
              <span className="news-time">5 tim sedan</span>
            </div>
          </div>
          <div className="news-item success">
            <span className="news-icon">✅</span>
            <div className="news-content">
              <strong>Faktura #2024-045 betald</strong>
              <p>45,000 kr från Villa Nygren mottaget.</p>
              <span className="news-time">Idag 09:15</span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome feature cards */}
      <div className="welcome-feature-card">
        <h2>{getTimeBasedGreeting()}, Michael!</h2>
        <p>Din digitala kollega är redo att hjälpa dig hantera alla byggprojekt effektivt. Börja med att utforska dina aktiva projekt nedan.</p>
      </div>

      {/* Quick metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-icon">🏗️</span>
          <div className="metric-value">{projects.length}</div>
          <div className="metric-label">Aktiva projekt</div>
          <div className="metric-change positive">+2 denna månad</div>
        </div>
        <div className="metric-card">
          <span className="metric-icon">⏰</span>
          <div className="metric-value">87%</div>
          <div className="metric-label">Genomsnittlig progress</div>
          <div className="metric-change positive">+5% från förra månaden</div>
        </div>
        <div className="metric-card">
          <span className="metric-icon">💰</span>
          <div className="metric-value">245k</div>
          <div className="metric-label">kr omsättning</div>
          <div className="metric-change positive">+12% ökning</div>
        </div>
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
                <div className="project-info-left">
                  <div 
                    className="project-status-indicator"
                    style={{ backgroundColor: project.color }}
                  ></div>
                  <h3>{project.name}</h3>
                </div>
                <div className="project-actions-right">
                  <button 
                    className="action-btn-small"
                    onClick={() => openDriveFolder(project.driveFolder || project.name)}
                    title="Öppna projektmapp"
                  >
                    <span className="material-symbols-outlined drive-folder-icon">folder_open</span>
                  </button>
                  <button 
                    className="action-btn-small"
                    onClick={() => alert('Projektinställningar kommer snart!')}
                    title="Projektinställningar"
                  >
                    <span className="material-symbols-outlined project-menu-icon">settings</span>
                  </button>
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
      
      {!isDemoMode && (
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
              <p>Logga in för att se senaste dokument</p>
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
      
      {/* Interactive metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-icon">📊</span>
          <div className="metric-value">8</div>
          <div className="metric-label">Aktiva projekt</div>
          <div className="metric-change positive">+2 denna vecka</div>
        </div>
        <div className="metric-card">
          <span className="metric-icon">⏰</span>
          <div className="metric-value">24</div>
          <div className="metric-label">Möten denna månad</div>
          <div className="metric-change neutral">Samma som förra</div>
        </div>
        <div className="metric-card">
          <span className="metric-icon">🚚</span>
          <div className="metric-value">12</div>
          <div className="metric-label">Leveranser planerade</div>
          <div className="metric-change positive">+4 från förra veckan</div>
        </div>
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
          
          <div className="progress-visualization">
            <h4>� Kapacitetsöversikt</h4>
            <div className="progress-item">
              <span>Michael E.F.</span>
              <div className="progress-bar-demo">
                <div className="progress-fill-demo" style={{ width: '85%' }}></div>
              </div>
              <span>85%</span>
            </div>
            <div className="progress-item">
              <span>Team Alpha</span>
              <div className="progress-bar-demo">
                <div className="progress-fill-demo" style={{ width: '65%' }}></div>
              </div>
              <span>65%</span>
            </div>
            <div className="progress-item">
              <span>Team Beta</span>
              <div className="progress-bar-demo">
                <div className="progress-fill-demo" style={{ width: '45%' }}></div>
              </div>
              <span>45%</span>
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
      
      {/* Quick Stats */}
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-icon">📄</span>
          <div className="metric-value">127</div>
          <div className="metric-label">Totalt dokument</div>
          <div className="metric-change positive">+15 denna månad</div>
        </div>
        <div className="metric-card">
          <span className="metric-icon">📋</span>
          <div className="metric-value">8</div>
          <div className="metric-label">Mallar använda</div>
          <div className="metric-change neutral">Samma som förra</div>
        </div>
        <div className="metric-card">
          <span className="metric-icon">💾</span>
          <div className="metric-value">2.4 GB</div>
          <div className="metric-label">Lagringsutrymme</div>
          <div className="metric-change positive">Optimerat</div>
        </div>
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
          
          {/* Feature showcase för mallar */}
          <div className="feature-showcase">
            <div className="feature-item">
              <span className="feature-icon">🛡️</span>
              <div className="feature-title">KMA-mall</div>
              <div className="feature-description">Skapa professionella säkerhetsplaner snabbt</div>
              <button className="feature-action">Använd mall</button>
            </div>
            
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <div className="feature-title">Checklista</div>
              <div className="feature-description">Strukturerad projektchecklista för alla faser</div>
              <button className="feature-action">Skapa checklista</button>
            </div>
            
            <div className="feature-item">
              <span className="feature-icon">💰</span>
              <div className="feature-title">Offertmall</div>
              <div className="feature-description">Professionella offerter med automatisk kalkyl</div>
              <button className="feature-action">Ny offert</button>
            </div>
          </div>
          
          {/* Progress visualization för dokumenthantering */}
          <div className="progress-visualization">
            <h4>📈 Dokumentflöde denna månad</h4>
            <div className="progress-item">
              <span>KMA-planer</span>
              <div className="progress-bar-demo">
                <div className="progress-fill-demo" style={{ width: '90%' }}></div>
              </div>
              <span>18/20</span>
            </div>
            <div className="progress-item">
              <span>Offerter</span>
              <div className="progress-bar-demo">
                <div className="progress-fill-demo" style={{ width: '70%' }}></div>
              </div>
              <span>14/20</span>
            </div>
            <div className="progress-item">
              <span>Fakturaunderlag</span>
              <div className="progress-bar-demo">
                <div className="progress-fill-demo" style={{ width: '95%' }}></div>
              </div>
              <span>19/20</span>
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
                <span>Hjälp</span>
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
              <label>Email</label>
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
              <p><strong>Nuvarande plan:</strong> Pilot (Gratis)</p>
              <p>Inkluderar full tillgång till alla funktioner under testperioden.</p>
              <div className="progress-bar-demo">
                <div className="progress-fill-demo" style={{ width: '30%' }}></div>
              </div>
              <p>30 av 90 dagar kvar av testperioden.</p>
            </div>
            <button className="upgrade-btn">
              <span className="material-symbols-outlined">workspace_premium</span>
              Uppgradera till Proffs
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2>Integrationer</h2>
          <div className="integration-item">
            <div className="integration-info">
              <img src="/google-logo.svg" alt="Google" className="integration-logo" />
              <div>
                <strong>Google Workspace</strong>
                <p>Ansluten som {user.email}</p>
              </div>
            </div>
            <button className="integration-btn disconnect">
              Koppla från
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2>Hjälp & Support</h2>
          <div className="help-links">
            <a href="#" className="help-link">
              <span className="material-symbols-outlined">help_outline</span>
              Vanliga frågor (FAQ)
            </a>
            <a href="#" className="help-link">
              <span className="material-symbols-outlined">school</span>
              Videoguider
            </a>
            <a href="mailto:support@byggpilot.se" className="help-link">
              <span className="material-symbols-outlined">email</span>
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
            <div className="project-list-info">
              <div className="project-list-name">{project.name}</div>
              <div className="project-list-customer">{project.customer}</div>
            </div>
            <div className="project-list-status">
              <span className={`status-badge ${project.status}`}>{project.status}</span>
            </div>
            {project.deadline && (
              <div className="project-list-deadline">
                Deadline: {new Date(project.deadline).toLocaleDateString('sv-SE')}
              </div>
            )}
            <div className="project-list-actions">
              <button className="action-btn-small">Öppna</button>
            </div>
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
            <span className="material-symbols-outlined">email</span>
            <h3>1. Fånga uppdraget</h3>
            <p>Videresänd ett mail från en kund eller ladda upp en bild på en ritning.</p>
          </div>

          <div className="example-card">
            <span className="material-symbols-outlined">auto_awesome</span>
            <h3>2. Låt ByggPilot analysera</h3>
            <p>Vår AI tolkar underlaget, ställer kontrollfrågor och skapar ett komplett ärende.</p>
          </div>

          <div className="example-card">
            <span className="material-symbols-outlined">checklist</span>
            <h3>3. Agera på insikterna</h3>
            <p>Få förslag på KMA-planer, checklistor och tidsplaner direkt i din dashboard.</p>
          </div>
        </div>
      </div>
      
      <div className="getting-started-section">
        <h2>Kom igång på 3 enkla steg</h2>
        <div className="steps-grid">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Logga in med Google</h3>
            <p>Anslut ditt konto för att integrera med Google Drive, Kalender och Gmail.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Beskriv ditt företag</h3>
            <p>Ge ByggPilot kontext om din verksamhet för skräddarsydda råd.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Börja automatisera</h3>
            <p>Skicka in ditt första ärende och se magin hända.</p>
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
            Sena kvällar med pappersarbete. Svårt att hålla koll på alla regler och lagar. 
            Oändliga timmar med att skapa offerter och KMA-planer. 
            Vi har varit där. Byggbranschen är komplex, men din administration behöver inte vara det.
          </p>
        </div>
      </div>

      {/* Solution Section */}
      <div className="solution-section">
        <div className="section-content">
          <h2>Din digitala kollega som aldrig tar ledigt</h2>
          <div className="solution-cards-grid">
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

  // Ny persistent chat-komponent
  const renderPersistentChat = () => (
    <div className={`persistent-chat ${isChatExpanded ? 'expanded' : ''}`}>
      <div className="chat-container">
        {/* Chat Header with Toggle Arrow */}
        <div className="chat-header" onClick={toggleChat}>
          <span>
            <span className="material-symbols-outlined chat-icon">smart_toy</span>
            ByggPilot Assistent
          </span>
          <button className="chat-toggle-btn-header">
            <span className="material-symbols-outlined">
              {isChatExpanded ? 'expand_more' : 'expand_less'}
            </span>
          </button>
        </div>
        <div className="chat-messages-container">
          {chatMessages.map((msg, index) => (
            <div key={msg.id || index} className={`chat-message ${msg.type}`}>
              <div className="message-content">
                <p dangerouslySetInnerHTML={{ __html: msg.message.replace(/\n/g, '<br />') }}></p>
                <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}</span>
                {msg.type === 'ai' && (
                  <button className="copy-btn" onClick={() => copyToClipboard(msg.message)}>
                    <span className="material-symbols-outlined">content_copy</span>
                  </button>
                )}
              </div>
              {msg.buttons && (
                <div className="message-buttons">
                  {msg.buttons.map(btn => (
                    <button key={btn.action} onClick={() => handleOnboardingAction(btn.action)}>
                      {btn.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="chat-message assistant">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="chat-input-area">
          <button className="chat-toggle-btn-input" onClick={toggleChat}>
            <span className="material-symbols-outlined">
              {isChatExpanded ? 'expand_more' : 'expand_less'}
            </span>
          </button>
          <input
            ref={chatInputRef}
            type="text"
            className="chat-input"
            placeholder={isChatExpanded ? "Skriv ditt meddelande här..." : placeholderText}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleChatInputFocus}
            disabled={isLoading}
          />
          <button className="send-btn" onClick={sendMessage} disabled={isLoading || (!chatInput && attachedFiles.length === 0)}>
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Cookies/GDPR notification component
  const renderCookiesNotification = () => {
    if (!showCookiesNotification) return null
    
    return (
      <div className="cookies-notification">
        <div className="cookies-content">
          <div className="cookies-text">
            <h4>🍪 Cookies & Integritet</h4>
            <p>Vi använder cookies för att förbättra din upplevelse och ansluta till Google Workspace. Du kan anpassa vilka cookies du vill acceptera.</p>
          </div>
          <div className="cookies-actions">
            <button className="cookies-btn secondary" onClick={handleCustomizeCookies}>
              Anpassa
            </button>
            <button className="cookies-btn primary" onClick={handleAcceptCookies}>
              Acceptera alla
            </button>
          </div>
        </div>
      </div>
    )
  }
  const googleWorkspaceAPI = {
    async listFiles() {
      try {
        const response = await fetch('/api/drive/list-files', {
          method: 'POST',
          headers: {

            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.email}` // I en riktig app skulle detta vara access token
          }
        })
        return response.ok ? await response.json() : null
      } catch (error) {
        console.error('Error listing files:', error)
        return null
      }
    },

    async createFolder(folderName: string) {
      try {
        const response = await fetch('/api/drive/create-folder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.email}`
          },
          body: JSON.stringify({ folderName })
        })
        return response.ok ? await response.json() : null
      } catch (error) {
        console.error('Error creating folder:', error)
        return null
      }
    },

    async setupProjectStructure() {
      try {
        const response = await fetch('/api/drive/setup-project-structure', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.email}`
          }
        })
        return response.ok ? await response.json() : { success: false }
      } catch (error) {
        console.error('Error setting up project structure:', error)
        return { success: false }
      }
    }
  }

  return (
    <div className="app">
      {renderHeader()}
      <div className="main-layout">
        {renderSidebar()}
        <main className={`page-content ${isChatExpanded ? 'chat-expanded' : ''}`}>
          {renderCurrentView()}
        </main>
      </div>
      {renderCookiesNotification()}
      {renderPersistentChat()}
    </div>
  )
}
