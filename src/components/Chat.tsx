// src/components/Chat.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// --- Ikoner ---
const ChevronUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>;
const AttachmentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>;
const MicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m7 8v3m0 0H9m3 0h3m-3-3a3 3 0 01-3-3V6a3 3 0 016 0v5a3 3 0 01-3 3z" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const NewChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;

// --- Meddelandekomponenter ---
const UserMessage = ({ text }: { text: string }) => (
    <div className="chat-message user ml-auto bg-primary-accent text-text-dark rounded-xl p-3 max-w-[85%]">
        <p>{text}</p>
    </div>
);

const AiMessage = ({ children }: { children: React.ReactNode }) => (
    <div className="chat-message ai mr-auto bg-card-background-color text-text-color rounded-xl p-3 max-w-[85%]">
        {children}
    </div>
);

const Checklist = ({ content }: { content: string }) => (
    <div className="checklist-container bg-white/5 border-l-4 border-primary-accent p-4 my-2 rounded-lg whitespace-pre-wrap relative group">
        <button 
            onClick={() => navigator.clipboard.writeText(content)}
            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <CopyIcon />
        </button>
        <code>{content}</code>
    </div>
);

const ThinkingIndicator = () => (
    <div className="chat-message ai mr-auto bg-card-background-color text-text-color rounded-xl p-3 max-w-[85%] flex items-center gap-2">
        <div className="w-2 h-2 bg-primary-accent rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-primary-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-primary-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
);

export const Chat = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<React.ReactNode[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const pathname = usePathname();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    // 1. Skapa en ref för inmatningsfältet.
    const inputRef = useRef<HTMLInputElement>(null);

    // Fäll ner chatten vid byte av sida
    useEffect(() => { setIsExpanded(false); }, [pathname]);

    // Scrolla till senaste meddelandet
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    // 2. Återfokusera på inmatningsfältet när chatten expanderas.
    useEffect(() => {
        if (isExpanded) {
            inputRef.current?.focus();
        }
    }, [isExpanded]);

    const handleNewChat = () => {
        setMessages([]);
        setIsExpanded(true); // Håll chatten öppen
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const newUserMessage = <UserMessage key={messages.length} text={inputValue} />;
        setMessages(prev => [...prev, newUserMessage]);
        const userQuery = inputValue;
        setInputValue("");
        setIsThinking(true);

        try {
            // Anropar den publika API-vägen, som Netlify kommer att omdirigera.
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userQuery }),
            });

            if (!response.ok) {
                throw new Error(`Nätverksfel: ${response.status}`);
            }

            const data = await response.json();
            
            // Antag att svaret har en 'text' och en valfri 'checklist'
            const newAiMessage = (
                <AiMessage key={messages.length + 1}>
                    <p>{data.text}</p>
                    {data.checklist && <Checklist content={data.checklist} />}
                </AiMessage>
            );
            setMessages(prev => [...prev, newAiMessage]);

        } catch (error) {
            console.error("Fel vid anrop till chatt-API:", error);
            const errorMessage = <AiMessage key={messages.length + 1}><p>Ursäkta, något gick fel. Försök igen.</p></AiMessage>;
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div id="chat-drawer" className={`sticky bottom-0 bg-secondary-bg border-t border-border-color z-10 flex flex-col transition-height duration-300 ease-in-out ${isExpanded ? 'h-full' : 'h-[95px]'}`}>
            <div className="flex-grow overflow-hidden flex flex-col">
                
                {/* Header för chattfönstret, synlig när expanderad */}
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
                    {messages.length === 0 ? (
                        <div className="welcome-message text-center p-8 text-text-muted">
                            <h3 className="font-semibold text-lg">Välkommen till ByggPilot</h3>
                            <p>Din digitala kollega i byggbranschen. Ställ en fråga för att börja.</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => <div key={index}>{msg}</div>)
                    )}
                    {isThinking && <ThinkingIndicator />}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-wrapper p-4 border-t border-white/10 mt-auto">
                    {/* 1. Tar bort glow-effekten: 'focus-within:shadow-input-glow' är borttagen. */}
                    <div className="chat-input-container bg-card-background-color border border-border-color rounded-full p-1 flex items-center gap-2 focus-within:border-primary-accent">
                        {/* 2. Lägger till puls-animation: 'animate-pulse' läggs till när chatten är hopfälld. */}
                        <button onClick={() => setIsExpanded(!isExpanded)} className={`icon-btn p-2 transition-transform duration-300 ${!isExpanded ? 'animate-pulse' : ''}`} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                            <ChevronUpIcon />
                        </button>
                        
                        {/* 3. Återställer ikon-layouten för att fixa inmatningsbuggen. */}
                        <button className="icon-btn p-2"><AttachmentIcon /></button>
                        <button className="icon-btn p-2"><MicIcon /></button>

                        <input 
                            // 3. Koppla ref:en till inmatningsfältet.
                            ref={inputRef}
                            type="text" 
                            id="chat-input" 
                            placeholder="Fråga ByggPilot..." 
                            className="flex-grow bg-transparent border-none outline-none text-text-color text-base p-2"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onFocus={() => setIsExpanded(true)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button onClick={handleSendMessage} className="btn-send bg-primary-accent text-text-dark rounded-full w-10 h-10 grid place-items-center disabled:bg-border-color disabled:cursor-not-allowed" disabled={!inputValue.trim()}>
                            <SendIcon />
                        </button>
                    </div>
                    <div className={`chat-disclaimer text-xs text-text-muted text-center pt-3 ${isExpanded ? 'block' : 'hidden'}`}>
                        ByggPilot är en AI-kollega som kan ge felaktiga förslag. Granska alltid viktig information självständigt.
                    </div>
                </div>
            </div>
        </div>
    );
};
