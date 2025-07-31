// src/components/Chat.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation'; // Korrekt import för Next.js
import { useAuth } from '../app/AuthContext';
import { useChat as useVercelChat, Message } from 'ai/react';
import { nanoid } from 'nanoid';

// --- Ikoner ---
const ChevronUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>;
const AttachmentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>;
const MicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m7 8v3m0 0H9m3 0h3m-3-3a3 3 0 01-3-3V6a3 3 0 016 0v5a3 3 0 01-3 3z" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const NewChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;


// --- Meddelandekomponenter ---
const UserMessage = ({ text }: { text: string }) => (
    <div className="chat-message user ml-auto bg-primary-accent text-text-dark rounded-xl p-3 max-w-[85%]">
        <p>{text}</p>
    </div>
);

const AiMessage = ({ children, append, user }: { children: React.ReactNode, append: (message: Message) => Promise<any>, user: any }) => {
    
    const handleButtonClick = async (buttonText: string) => {
        // Lägg till användarens "klick" som ett meddelande i chatten
        append({ id: nanoid(), role: 'user', content: buttonText });

        // NYTT: Hantera omdirigering för Google-autentisering
        if (buttonText === 'Ja, ge behörighet') {
            append({ id: nanoid(), role: 'assistant', content: "Ok, jag skickar dig till Google för att godkänna anslutningen. Vi ses snart igen!" });
            // Omdirigera till vår API-route som startar OAuth-flödet
            window.location.href = '/api/auth/google';
            return; 
        }

        if (buttonText === 'Ja, skapa mappstruktur') {
            try {
                if (!user) throw new Error("Användare inte inloggad.");
                const token = await user.getIdToken();
                
                append({ id: nanoid(), role: 'assistant', content: "Ok, jag påbörjar skapandet av mappstrukturen. Detta kan ta en liten stund..." });

                const response = await fetch('/api/create-drive-structure', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.details || 'Något gick fel på servern.');
                }

                append({
                    id: nanoid(),
                    role: 'assistant',
                    content: "Klart! Jag har skapat din nya mappstruktur i Google Drive. Du hittar den under 'ByggPilot - " + (user.displayName || 'Ditt Företag') + "'. Är du redo att skapa ditt första projekt?\n[Ja, skapa ett nytt projekt]\n[Nej, jag är klar för nu]"
                });

            } catch (error) {
                console.error("Fel vid skapande av mappstruktur:", error);
                const errorMessage = error instanceof Error ? error.message : 'Okänt fel';
                append({
                    id: nanoid(),
                    role: 'assistant',
                    content: `Ursäkta, jag kunde inte skapa mappstrukturen. Fel: ${errorMessage}`
                });
            }
        }
    };

    const renderMessageContent = (content: string) => {
        const buttonRegex = /\[([^\]]+)\]/g;
        const parts = content.split(buttonRegex);

        return parts.map((part, index) => {
            if (index % 2 === 1) {
                return (
                    <button
                        key={index}
                        onClick={() => handleButtonClick(part)}
                        className="block w-full text-left bg-white/10 hover:bg-white/20 p-3 my-2 rounded-lg transition-colors"
                    >
                        {part}
                    </button>
                );
            }
            return <p key={index} className="inline">{part}</p>;
        });
    };

    return (
        <div className="chat-message ai mr-auto bg-card-background-color text-text-color rounded-xl p-3 max-w-[85%] whitespace-pre-wrap">
            {typeof children === 'string' ? renderMessageContent(children) : children}
        </div>
    );
};


const ThinkingIndicator = () => (
    <div className="chat-message ai mr-auto bg-card-background-color text-text-color rounded-xl p-3 max-w-[85%] flex items-center gap-2">
        <div className="w-2 h-2 bg-primary-accent rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-primary-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-primary-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
);

export const Chat = () => {
    const { user } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);

    const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, append } = useVercelChat({
        api: '/api/chat',
        body: {
            demo: !user,
        },
        onError: (err) => {
            console.error("Fel från useChat-hook:", err);
        }
    });

    const pathname = usePathname();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { if (isExpanded) { inputRef.current?.focus(); } }, [isExpanded]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    useEffect(() => {
        const hasSeenOnboarding = sessionStorage.getItem('hasSeenOnboarding');
        if (user && !hasSeenOnboarding && messages.length === 0) {
            sessionStorage.setItem('hasSeenOnboarding', 'true');
            setTimeout(() => {
                append({
                    id: nanoid(),
                    role: 'assistant',
                    content: "Välkommen! För att jag ska kunna agera som din digitala kollega och automatisera uppgifter i ditt Google Workspace behöver jag din tillåtelse att komma åt Google Drive, Gmail och Kalender."
                });
            }, 500);
            setTimeout(() => {
                append({
                    id: nanoid(),
                    role: 'assistant',
                    content: "Är du redo att ge mig den behörigheten?\n[Ja, ge behörighet]\n[Nej tack, inte nu]"
                });
                setIsExpanded(true);
            }, 1500);
        }
    }, [user, messages.length, append]);
    
    const handleNewChat = () => {
        setMessages([]);
        setIsExpanded(true);
    };
    
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;
        handleSubmit(e);
    };

    return (
        <div id="chat-drawer" className={`${pathname === '/' ? 'fixed' : 'sticky'} bottom-0 left-0 right-0 bg-secondary-bg border-t border-border-color z-10 flex flex-col transition-height duration-300 ease-in-out ${isExpanded ? 'h-full' : 'h-[95px]'}`}>
            <div className="flex-grow overflow-hidden flex flex-col">
                
                {isExpanded && (
                    <div className="flex justify-between items-center p-2 border-b border-border-color">
                        <h3 className="text-lg font-semibold pl-4">Chatt</h3>
                        <button onClick={handleNewChat} className="icon-btn p-2 flex items-center gap-2 text-sm">
                            <NewChatIcon />
                            Ny chatt
                        </button>
                    </div>
                )}

                <div id="chat-messages" className={`flex-grow overflow-y-auto p-4 space-y-4 ${isExpanded ? 'block' : 'hidden'}`}>
                    {messages.length === 0 && !isLoading ? (
                        <div className="welcome-message text-center p-8 text-text-muted">
                            <h3 className="font-semibold text-lg">Välkommen till ByggPilot</h3>
                            <p>Din digitala kollega i byggbranschen. Ställ en fråga för att börja.</p>
                        </div>
                    ) : (
                        messages.map((m: Message) => (
                            <div key={m.id}>
                                {m.role === 'user' 
                                    ? <UserMessage text={m.content} /> 
                                    : <AiMessage append={append} user={user}>{m.content}</AiMessage>
                                }
                            </div>
                        ))
                    )}
                    {isLoading && <ThinkingIndicator />}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleFormSubmit} className="chat-input-wrapper p-4 border-t border-white/10 mt-auto">
                    <div className="chat-input-container bg-card-background-color border border-border-color rounded-full p-1 flex items-center gap-2 focus-within:border-primary-accent">
                        <button type="button" onClick={() => setIsExpanded(!isExpanded)} className={`icon-btn p-2 transition-transform duration-300 ${!isExpanded ? 'animate-pulse' : ''}`} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                            <ChevronUpIcon />
                        </button>
                        
                        {user && (
                            <>
                                <button type="button" className="icon-btn p-2"><AttachmentIcon /></button>
                                <button type="button" className="icon-btn p-2"><MicIcon /></button>
                            </>
                        )}

                        <input 
                            ref={inputRef}
                            type="text" 
                            id="chat-input" 
                            placeholder="Fråga ByggPilot..." 
                            className="flex-grow bg-transparent border-none outline-none text-text-color text-base p-2"
                            value={input}
                            onChange={handleInputChange}
                            onFocus={() => setIsExpanded(true)}
                        />
                        <button type="submit" className="btn-send bg-primary-accent text-text-dark rounded-full w-10 h-10 grid place-items-center disabled:bg-border-color disabled:cursor-not-allowed" disabled={!input.trim() || isLoading}>
                            <SendIcon />
                        </button>
                    </div>
                    <div className={`chat-disclaimer text-xs text-text-muted text-center pt-3 ${isExpanded ? 'block' : 'hidden'}`}>
                        {user ? "ByggPilot kan ge felaktiga förslag. Granska alltid viktig information." : "Detta är en demo. Logga in för att låsa upp alla funktioner och ansluta till ditt Google-konto."}
                    </div>
                </form>
            </div>
        </div>
    );
};
