import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Chat = ({ isExpanded }) => {
    const { pathname } = useLocation();
    const chatDrawerRef = useRef(null);

    useEffect(() => {
        const chatDrawer = chatDrawerRef.current;

        if (!chatDrawer) return;

        // Justera höjden på chattfönstret baserat på dess innehåll
        const adjustHeight = () => {
            if (isExpanded) {
                chatDrawer.style.height = `${chatDrawer.scrollHeight}px`;
            } else {
                chatDrawer.style.height = '95px';
            }
        };

        adjustHeight();

        // Lägg till en resize-lyssnare för att justera höjden vid fönsterändringar
        window.addEventListener('resize', adjustHeight);

        // Rensa upp lyssnaren vid avmontering
        return () => {
            window.removeEventListener('resize', adjustHeight);
        };
    }, [isExpanded, pathname]);

    // Välj positioneringsklass baserat på sida
    const positionClass = pathname === '/' ? 'fixed' : 'sticky';

    // Justera klasser för dashboarden för att respektera sidomenyn
    const dashboardClasses = pathname === '/dashboard' ? 'inset-x-auto w-full' : 'left-0 right-0';

    return (
        <div id="chat-drawer" ref={chatDrawerRef} className={`${positionClass} bottom-0 ${dashboardClasses} bg-secondary-bg border-t border-border-color z-10 flex flex-col transition-height duration-300 ease-in-out ${isExpanded ? 'h-full' : 'h-[95px]'}`}>
            <div className="flex-grow overflow-hidden flex flex-col">
                
                {/* Header för chattfönstret, synlig när expanderad */}
                {isExpanded && (
                    <div className="p-4 border-b border-border-color">
                        <h2 className="text-lg font-semibold">Chatta med oss</h2>
                    </div>
                )}

                {/* Innehåll för chattfönstret */}
                <div className="flex-grow p-4 overflow-auto">
                    {/* Här går chattmeddelandena */}
                </div>

                {/* Skicka meddelande-ruta */}
                <div className="p-4 border-t border-border-color">
                    <input
                        type="text"
                        placeholder="Skriv ett meddelande..."
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>
        </div>
    );
};

export default Chat;