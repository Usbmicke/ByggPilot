// src/components/Chat.tsx
'use client';
import React, { useState } from 'react';

// Ikoner
const ChevronUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>;
const AttachmentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>;
const MicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m7 8v3m0 0H9m3 0h3m-3-3a3 3 0 01-3-3V6a3 3 0 016 0v5a3 3 0 01-3 3z" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;

export const Chat = () => {
    const [isChatExpanded, setIsChatExpanded] = useState(false);

    return (
        <div id="chat-drawer" className={`absolute bottom-0 left-0 right-0 bg-secondary-bg border-t border-border-color transition-all duration-300 ease-in-out ${isChatExpanded ? 'h-[85%]' : 'h-[95px]'}`}>
            <div className="chat-drawer-content max-w-4xl mx-auto p-4 h-full flex flex-col">
                <div id="chat-messages" className={`chat-messages flex-grow overflow-y-auto mb-4 ${isChatExpanded ? 'block' : 'hidden'}`}>
                    <div className="welcome-message">
                        <h3>Välkommen till ByggPilot</h3>
                        <p>Din digitala kollega i byggbranschen. Ställ en fråga för att börja.</p>
                    </div>
                </div>
                <div className="chat-input-wrapper mt-auto">
                    <div className="chat-input-container">
                        <div className="chat-input-area">
                            <button id="chat-toggle-button" onClick={() => setIsChatExpanded(!isChatExpanded)} className="icon-btn transition-transform duration-300" style={{ transform: isChatExpanded ? 'rotate(180deg)' : 'none' }}>
                                <ChevronUpIcon />
                            </button>
                            <button id="file-input-button" className="icon-btn">
                                <AttachmentIcon />
                            </button>
                            <button id="voice-input-button" className="icon-btn">
                                <MicIcon />
                            </button>
                            <input type="text" id="chat-input" placeholder="Fråga ByggPilot..." className="flex-grow bg-transparent border-none outline-none text-text-color" />
                            <button id="send-button" className="btn-send">
                                <SendIcon />
                            </button>
                        </div>
                    </div>
                    <div className={`chat-disclaimer ${isChatExpanded ? 'block' : 'hidden'}`}>
                        ByggPilot är en AI-kollega som kan ge felaktiga förslag. Granska alltid viktig information självständigt.
                    </div>
                </div>
            </div>
        </div>
    );
};
