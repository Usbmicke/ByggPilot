// src/app/page.tsx
'use client';
import React from 'react';
import { useAuth } from './AuthContext';

// --- Ikoner (Inline SVG) ---
const GoogleIcon = () => ( <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,34.556,44,29.865,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg> );
const InboxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0l-8 5-8-5" /></svg>;
const ClipboardListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m-6 4h6m-6 4h6m2 4h.01M4 7h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z" /></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-4.016z" /></svg>;


// --- Komponenter för Landningssidan ---

const Header = () => {
    const { login } = useAuth();
    return (
        <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <img src="/byggpilot-logga-vit.png" alt="ByggPilot Logotyp" className="h-8 w-auto" />
                    <span className="font-bold text-xl text-white">ByggPilot</span>
                </div>
                <nav className="flex items-center gap-4">
                    <button onClick={() => login()} className="text-gray-300 hover:text-white transition-colors">Logga in</button>
                    <button onClick={() => login()} className="bg-cyan-400 text-black font-semibold px-4 py-2 rounded-md hover:bg-cyan-300 transition-colors">Testa ByggPilot Gratis</button>
                </nav>
            </div>
        </header>
    );
};

const Hero = () => {
    const { login } = useAuth();
    return (
        <section className="text-center py-20 md:py-32">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white">Mindre papperskaos. Mer tid att bygga.</h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-4">
                ByggPilot är den digitala kollegan som automatiserar din administration direkt i ditt Google-konto. Från förfrågan i Gmail till färdigt fakturaunderlag – utan att du behöver lära dig ett nytt system.
            </p>
            <div className="mt-8">
                <button onClick={() => login()} className="bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg flex items-center justify-center shadow-lg hover:bg-gray-200 transition-all mx-auto">
                    <GoogleIcon /> Logga in med Google
                </button>
            </div>
        </section>
    );
};

const ProblemSection = () => (
    <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">Lägger du också kvällarna på pappersarbete?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg text-center transition-transform hover:scale-105 cursor-pointer"><InboxIcon /><h3 className="text-xl font-semibold text-white">Leta i inkorgen</h3></div>
                <div className="bg-gray-800 p-6 rounded-lg text-center transition-transform hover:scale-105 cursor-pointer"><ClipboardListIcon /><h3 className="text-xl font-semibold text-white">Sammanställa underlag</h3></div>
                <div className="bg-gray-800 p-6 rounded-lg text-center transition-transform hover:scale-105 cursor-pointer"><CalculatorIcon /><h3 className="text-xl font-semibold text-white">Glömda ÄTA-arbeten</h3></div>
                <div className="bg-gray-800 p-6 rounded-lg text-center transition-transform hover:scale-105 cursor-pointer"><ShieldCheckIcon /><h3 className="text-xl font-semibold text-white">KMA & Regelverk</h3></div>
            </div>
            <div className="text-center mt-16 max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-white">ByggPilot är din digitala kollega som löser detta.</h3>
                <p className="text-lg text-gray-400 mt-4">
                    Genom att koppla ihop din Gmail, Drive och Kalender agerar ByggPilot som ett intelligent lager ovanpå dina befintliga verktyg. Den hittar förfrågningar, skapar projektmappar, påminner om ÄTA-arbeten och ser till att din KMA-pärm alltid är uppdaterad – helt automatiskt.
                </p>
            </div>
        </div>
    </section>
);

const SolutionSection = () => (
    <section className="py-16 md:py-24 bg-gray-800/50">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Din digitala kollega tar hand om administrationen.</h2>
            <div className="max-w-3xl mx-auto border-2 border-dashed border-gray-600 rounded-lg p-12">
                <p className="text-gray-400">Här kommer en animerad video som visar arbetsflödet</p>
            </div>
        </div>
    </section>
);

const TrustSection = () => (
    <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
                <img src="/michael-fogelstrom-ekengren.jpg" alt="Michael Fogelström Ekengren, grundare av ByggPilot" className="rounded-lg w-full max-w-sm mx-auto aspect-square object-cover" />
            </div>
            <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Byggd av hantverkare, för hantverkare.</h2>
                <p className="text-gray-400 mt-4">
                    Jag har spenderat över 15 år i branschen – från snickare och arbetsledare till egenföretagare. Jag skapade ByggPilot för att lösa den frustration jag delar med så många andra: pappersarbetet som stjäl vår tid och energi...
                </p>
                <p className="text-white font-semibold mt-4">- Michael Fogelström Ekengren, Grundare av ByggPilot</p>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="mt-24 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
            <p className="text-center text-gray-500">© 2025 ByggPilot AB | Integritetspolicy | Användarvillkor</p>
        </div>
    </footer>
);


const LandingPageContent = () => (
    <div className="bg-gray-900 text-gray-100">
        <Header />
        <main>
            <Hero />
            <ProblemSection />
            <SolutionSection />
            <TrustSection />
        </main>
        <Footer />
    </div>
);

const Page = () => {
    return (
        <LandingPageContent />
    );
};

export default Page;
