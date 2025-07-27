// src/app/page.tsx
'use client';
import React from 'react';
import { useAuth } from './AuthContext';

// --- SVG Ikoner och Komponenter för Landningssidan ---
const GoogleIcon = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,34.556,44,29.865,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);
const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-400 mb-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);
const UserIconPlaceholder = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ChaosFolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
);
const BarChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);
const TrendingDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
);

const Header = ({ onLoginClick }: { onLoginClick: () => void }) => (
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-border-color">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <a href="#" className="flex items-center gap-3 text-text-color">
                        <img src="/byggpilot-logga-vit.png" alt="ByggPilot Logotyp" className="h-8 w-auto" />
                        <span className="font-bold text-xl">ByggPilot</span>
                    </a>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={onLoginClick} className="text-text-muted hover:text-text-color transition-colors">Logga in</button>
                    <button onClick={onLoginClick} className="bg-primary-accent-color text-text-dark font-semibold px-4 py-2 rounded-md hover:bg-primary-accent-hover transition-colors">Testa ByggPilot Gratis</button>
                </div>
            </div>
        </div>
    </header>
);
const HeroSection = ({ onLoginClick }: { onLoginClick: () => void }) => (
    <section className="text-center py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-text-color tracking-tight">Mindre papperskaos. <br /> Mer tid att bygga.</h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto mt-6">ByggPilot är den digitala kollegan som automatiserar din administration direkt i ditt Google-konto.</p>
            <div className="mt-10 flex justify-center">
                <button onClick={onLoginClick} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-200 transition-all">
                    <GoogleIcon />
                    Logga in med Google
                </button>
            </div>
        </div>
    </section>
);
const ProblemSection = () => (
    <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Det administrativa kaoset som dödar lönsamheten</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-card-background-color p-6 rounded-lg text-center">
                    <ClockIcon />
                    <h3 className="font-semibold text-lg mb-2">Tidspressen dödar planeringen</h3>
                    <p className="text-text-muted">Kvällar och helger går åt till pappersarbete istället för att planera.</p>
                </div>
                <div className="bg-card-background-color p-6 rounded-lg text-center">
                    <ChaosFolderIcon />
                    <h3 className="font-semibold text-lg mb-2">Spridd information, noll struktur</h3>
                    <p className="text-text-muted">Underlag, foton och tidlappar hamnar utspridda överallt.</p>
                </div>
                <div className="bg-card-background-color p-6 rounded-lg text-center">
                    <BarChartIcon />
                    <h3 className="font-semibold text-lg mb-2">Beslut på magkänsla</h3>
                    <p className="text-text-muted">Efterkalkyler görs sällan, vilket leder till dyra misstag.</p>
                </div>
                <div className="bg-card-background-color p-6 rounded-lg text-center">
                    <TrendingDownIcon />
                    <h3 className="font-semibold text-lg mb-2">Förlorade intäkter</h3>
                    <p className="text-text-muted">Missade ÄTA-arbeten och felregistrerade timmar kostar.</p>
                </div>
            </div>
        </div>
    </section>
);
const FeaturesInFocusSection = () => (
    <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Planeringen är A och O – men vem har tid?</h2>
                <p className="mt-4 text-lg text-text-muted max-w-3xl mx-auto">ByggPilot gör administrationen så effektiv att du äntligen får tid att planera rätt.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-card-background-color p-6 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2 text-primary-accent-color">Offerthantering på Fältet</h3>
                    <p className="text-text-muted">Skapa och skicka offerter direkt från kundmötet.</p>
                </div>
                <div className="bg-card-background-color p-6 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2 text-primary-accent-color">KMA & Regelverk i Fickan</h3>
                    <p className="text-text-muted">Tillgång till branschanpassade checklistor och riskanalyser.</p>
                </div>
                <div className="bg-card-background-color p-6 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2 text-primary-accent-color">Sömlös Ekonomi</h3>
                    <p className="text-text-muted">Koppla till Fortnox eller Visma för automatisk bokföring.</p>
                </div>
                <div className="bg-card-background-color p-6 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2 text-primary-accent-color">AI-drivna Insikter</h3>
                    <p className="text-text-muted">Få datadrivna insikter för att effektivisera och prissätta lönsamt.</p>
                </div>
            </div>
        </div>
    </section>
);
const SolutionSection = () => (
    <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Din digitala kollega tar hand om administrationen.</h2>
            <div className="max-w-4xl mx-auto">
                <div className="border-2 border-dashed border-border-color rounded-lg h-80 flex items-center justify-center flex-col">
                    <PlayIcon />
                    <p className="text-text-muted">Här kommer en animerad video som visar arbetsflödet</p>
                </div>
            </div>
        </div>
    </section>
);
const TrustSection = () => {
    const [imageError, setImageError] = React.useState(false);
    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="flex justify-center">
                        <div className="w-full max-w-sm">
                            {imageError ? (
                                <div className="bg-card-background-color rounded-lg aspect-square w-full flex items-center justify-center">
                                    <UserIconPlaceholder />
                                </div>
                            ) : (
                                <img
                                    src="/michael-fogelstrom-ekengren.jpg"
                                    alt="Grundare"
                                    className="rounded-lg object-cover w-full h-full aspect-square"
                                    onError={() => setImageError(true)}
                                />
                            )}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold">Byggd av en byggledare, för hantverkare.</h2>
                        <p className="text-text-muted mt-4 text-lg">Jag skapade ByggPilot för att lösa den frustration jag delar med så många andra: pappersarbetet som stjäl vår tid och energi.</p>
                        <p className="mt-6 font-semibold">- Michael Fogelström Ekengren, Grundare</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
const Footer = () => (
    <footer className="mt-24 py-8 border-t border-border-color">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-text-muted">© 2025 ByggPilot AB | Integritetspolicy | Användarvillkor</p>
        </div>
    </footer>
);

const LandingPage = () => {
    const { login } = useAuth();
    return (
        <div className="bg-background-color text-text-color min-h-screen font-poppins">
            <style>{`.particle{position:absolute;width:2px;height:2px;background:rgba(0,191,255,0.4);border-radius:50%;animation:particle-flow linear infinite;will-change:transform;z-index:2}@keyframes particle-flow{from{transform:translateY(0);opacity:0}50%{opacity:.4}to{transform:translateY(-100vh);opacity:0}}`}</style>
            {Array.from({ length: 30 }).map((_, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: `${Math.random() * 100}vw`,
                        top: `${Math.random() * 100}vh`,
                        animationDuration: `${15 + Math.random() * 20}s`,
                        animationDelay: `${Math.random() * -35}s`,
                    }}
                />
            ))}
            <Header onLoginClick={login} />
            <main>
                <HeroSection onLoginClick={login} />
                <ProblemSection />
                <FeaturesInFocusSection />
                <SolutionSection />
                <TrustSection />
            </main>
            <Footer />
        </div>
    );
};

export default function App() {
    return <LandingPage />;
}
