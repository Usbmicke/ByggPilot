'use client';

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { PaperAirplaneIcon, ArrowPathIcon, ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/solid';

export const Chat = () => {
    const { user } = useAuth();
    const pathname = usePathname();
    const chatDrawerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (chatDrawerRef.current && !chatDrawerRef.current.contains(event.target as Node)) {
                // Optional: Stäng chatten vid klick utanför
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            if (!response.ok) {
                throw new Error('Något gick fel med API-anropet.');
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant' as const, content: data.content }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant' as const, content: 'Ursäkta, jag kan inte svara just nu.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    const positionClass = pathname === '/' ? 'fixed' : 'sticky';

    return (
        <>
            {!isExpanded && (
                <button
                    onClick={() => setIsExpanded(true)}
                    className={`${positionClass} bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform duration-200 hover:scale-110 z-40`}
                    aria-label="Öppna chatt"
                >
                    <ChatBubbleLeftRightIcon className="h-8 w-8" />
                </button>
            )}

            <div
                ref={chatDrawerRef}
                className={`${positionClass} bottom-0 right-0 h-full md:h-auto md:max-h-[70vh] w-full md:w-96 bg-gray-800 border-l border-gray-700 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out z-50 ${isExpanded ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">ByggPilot AI</h3>
                    <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-white">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-grow p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                    <p className="text-sm">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-700 text-gray-200">
                                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="p-4 border-t border-gray-700">
                    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Fråga mig något..."
                            className="flex-grow bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                            disabled={isLoading || !input.trim()}
                        >
                            <PaperAirplaneIcon className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};