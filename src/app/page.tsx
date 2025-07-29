// src/app/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

// --- Ikoner (Inline SVG för den nya designen) ---

const GoogleIcon = () => (
  <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,34.556,44,29.865,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const FolderChaosIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 12h.01M16 15h.01M10 15h.01" /></svg>;
const ChartDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
const WalletMinusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;

// --- Sidkomponenter ---

const AnimatedBackground = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, duration: number, delay: number}>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 10 + 10, // 10s to 20s
      delay: Math.random() * -20, // Start at different times
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2322d3ee\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation-name: float;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            bottom: `-${p.y}%`, // Start from below the screen
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const Header = () => {
  const { login } = useAuth();
  return (
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-500/20">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src="/byggpilot-logga-vit.png" alt="ByggPilot Logotyp" className="h-8 w-auto" />
          <span className="font-bold text-xl text-white">ByggPilot</span>
        </div>
        <nav className="flex items-center gap-4">
          <button onClick={login} className="text-gray-300 hover:text-white transition-colors duration-300">
            Logga in
          </button>
          <button 
            onClick={login} 
            className="bg-cyan-400 text-gray-900 font-semibold px-5 py-2 rounded-lg shadow-lg shadow-cyan-400/10 hover:bg-cyan-300 hover:shadow-cyan-300/20 transition-all duration-300 animate-pulse-slow"
          >
            Testa ByggPilot Gratis
          </button>
        </nav>
      </div>
    </header>
  );
};

const Hero = () => {
  const { login } = useAuth();
  return (
    <section className="relative text-center py-24 md:py-40 container mx-auto px-6">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 pb-4">
        Mindre papperskaos. Mer tid att bygga.
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mt-6">
        ByggPilot är den digitala kollegan som automatiserar din administration direkt i ditt Google-konto. Från förfrågan i Gmail till färdigt fakturaunderlag – utan att du behöver lära dig ett nytt system.
      </p>
      <div className="mt-10 flex flex-col items-center">
        <button 
          onClick={login} 
          className="bg-white text-gray-800 font-semibold py-3 px-8 rounded-lg flex items-center justify-center shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
        >
          <GoogleIcon /> Logga in med Google
        </button>
        <p className="text-sm text-gray-500 mt-4">
          ByggPilot är byggt för Googles kraftfulla och kostnadsfria verktyg. 
          <a href="https://accounts.google.com/signup" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-400 transition-colors">
            Skaffa ett konto här.
          </a>
        </p>
      </div>
    </section>
  );
};

const InfoCard = ({ icon, title, problem, solution }: { icon: React.ReactNode, title: string, problem: string, solution: string }) => (
  <div className="bg-gray-800/50 border border-gray-500/20 rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-400/10 hover:border-cyan-400/30">
    {icon}
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 mb-3">{problem}</p>
    <p className="text-cyan-400 font-medium">{solution}</p>
  </div>
);

const ProblemSection = () => (
  <section className="py-20 md:py-28 container mx-auto px-6">
    <h2 className="text-4xl font-bold text-center text-white mb-4">Det administrativa kaoset som dödar lönsamheten</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
      <InfoCard 
        icon={<ClockIcon />}
        title="Tidspressen dödar planeringen"
        problem="Kvällar och helger går åt till pappersarbete istället för att planera och riskbedöma nästa projekt – de aktiviteter som faktiskt driver lönsamhet."
        solution="ByggPilot automatiserar administrationen så du kan fokusera på att planera lönsamma jobb."
      />
      <InfoCard 
        icon={<FolderChaosIcon />}
        title="Spridd information, noll struktur"
        problem="Underlag, foton och tidlappar hamnar utspridda i olika mejl, telefoner och mappar. Detta informationskaos gör ordentlig planering och uppföljning omöjlig."
        solution="ByggPilot skapar automatiskt en projektmapp i din Google Drive där allt samlas på rätt plats, från start."
      />
      <InfoCard 
        icon={<ChartDownIcon />}
        title="Beslut baserade på magkänsla"
        problem="Efterkalkyler görs sällan eftersom underlaget är ofullständigt. Det leder till att man upprepar dyra misstag och prissätter nästa jobb på gissningar istället för data."
        solution="ByggPilot gör efterkalkylen åt dig, så att du kan prissätta nästa projekt baserat på verklig data."
      />
      <InfoCard 
        icon={<WalletMinusIcon />}
        title="Förlorade intäkter"
        problem="Missade ÄTA-arbeten, felregistrerade timmar och bortglömda materialkostnader är direkta pengar som försvinner på grund av bristande struktur."
        solution="ByggPilot hjälper dig fånga alla timmar och kostnader, så att du får betalt för allt du faktiskt gör."
      />
    </div>
  </section>
);

const SolutionSection = () => (
    <section className="py-20 md:py-28 container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-8">Din digitala kollega tar hand om administrationen.</h2>
        <div className="max-w-4xl mx-auto border-2 border-dashed border-gray-600 rounded-lg p-16 bg-gray-800/20">
            <p className="text-gray-400 text-lg">Här kommer en animerad video som visar arbetsflödet</p>
        </div>
    </section>
);

const FeatureCard = ({ title, description }: { title: string, description: string }) => (
    <div className="bg-gray-800/50 border border-gray-500/20 rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-400/10 hover:border-cyan-400/30">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);

const FeatureSection = () => (
    <section className="py-20 md:py-28 container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">Planeringen är A och O – men vem har tid?</h2>
            <p className="text-lg text-gray-300">
                Byggbranschens låga marginaler beror ofta på en kultur där man slarvar med planeringsskedet. ByggPilot bryter den onda cirkeln genom att göra administrationen så tidseffektiv att du äntligen får tid att planera rätt – och därmed öka lönsamheten.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <FeatureCard title="Offerthantering på Fältet" description="Skapa och skicka professionella offerter direkt från kundmötet." />
            <FeatureCard title="KMA & Regelverk i Fickan" description="Få tillgång till färdiga, branschanpassade checklistor och riskanalyser för KMA och AFS. Gör rätt från början." />
            <FeatureCard title="Sömlös Ekonomi (Revisorns Dröm)" description="Koppla ihop ByggPilot med Fortnox eller Visma. Allt du gör – från tidrapport till materialinköp – kan automatiskt bli ett färdigt bokföringsunderlag." />
            <FeatureCard title="AI-drivna Insikter" description="Låt ByggPilot analysera dina avslutade projekt. Få datadrivna insikter som hjälper dig att effektivisera och prissätta framtida jobb mer lönsamt." />
        </div>
    </section>
);

const TrustSection = () => (
    <section className="py-20 md:py-28 container mx-auto px-6">
        <div className="bg-gray-800/50 border border-gray-500/20 rounded-xl grid grid-cols-1 md:grid-cols-5 gap-8 items-center p-8 md:p-12">
            <div className="md:col-span-2 flex justify-center">
                <img src="/michael-fogelstrom-ekengren.jpg" alt="Michael Fogelström Ekengren, grundare av ByggPilot" className="rounded-full w-48 h-48 md:w-64 md:h-64 object-cover border-4 border-gray-700" />
            </div>
            <div className="md:col-span-3 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Byggd av en byggledare, för hantverkare.</h2>
                <p className="text-gray-300 mt-4 text-lg">
                    "Jag har spenderat över 15 år i branschen – från snickare och arbetsledare till egenföretagare. Jag skapade ByggPilot för att lösa den frustration jag delar med så många andra: pappersarbetet som stjäl vår tid, energi och lönsamhet. Det här är verktyget jag själv alltid önskat att jag hade."
                </p>
                <p className="text-white font-semibold mt-6">- Michael Fogelström Ekengren, Grundare av ByggPilot</p>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="mt-20 py-8 border-t border-gray-800/50">
        <div className="container mx-auto px-6 text-center text-gray-500">
            <p>© 2025 ByggPilot AB | Integritetspolicy | Användarvillkor</p>
        </div>
    </footer>
);

// --- Huvudkomponent för sidan ---

export default function Page() {
    return (
        <div className="bg-gray-900 text-gray-100 font-sans antialiased">
            <AnimatedBackground />
            <Header />
            <main>
                <Hero />
                <ProblemSection />
                <SolutionSection />
                <FeatureSection />
                <TrustSection />
            </main>
            <Footer />
        </div>
    );
}
