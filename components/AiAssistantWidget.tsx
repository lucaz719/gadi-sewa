import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../services/db';

export default function AiAssistantWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string, suggestions?: string[] }[]>([
        { role: 'ai', text: 'Namaste! I am your GadiSewa Assistant. How can I help you navigate the platform today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const chatEndRef = useRef<HTMLDivElement>(null);

    const user = db.getAuthUser();

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text }]);
        setInput('');
        setLoading(true);

        try {
            const response = await db.chatWithAi(text, user?.role || 'customer', location.pathname);
            setMessages(prev => [...prev, {
                role: 'ai',
                text: response.reply,
                suggestions: response.suggestions
            }]);

            if (response.action && response.action.startsWith('navigate:')) {
                const target = response.action.split(':')[1];
                setTimeout(() => navigate(target), 1500);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', text: 'Sanchai? I am having some trouble connecting to my brain. Please try again later.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-red-600 rotate-90' : 'bg-slate-900 dark:bg-red-600 hover:scale-110'}`}
            >
                <span className="material-symbols-outlined text-white text-3xl">
                    {isOpen ? 'close' : 'psychology'}
                </span>
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 md:w-96 h-[500px] bg-white dark:bg-[#16222d] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-slide-up">
                    <div className="p-4 bg-slate-900 dark:bg-red-700 text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl">smart_toy</span>
                        </div>
                        <div>
                            <p className="font-bold text-sm">GadiSewa AI Assistant</p>
                            <p className="text-[10px] opacity-80">Always active for your support</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${m.role === 'user' ? 'bg-red-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none'}`}>
                                    {m.text}
                                    {m.suggestions && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {m.suggestions.map((s, si) => (
                                                <button
                                                    key={si}
                                                    onClick={() => handleSendMessage(s)}
                                                    className="bg-white dark:bg-slate-700 px-2 py-1 rounded-md border dark:border-slate-600 text-[10px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start animate-pulse">
                                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none text-[10px] italic">Assistant is thinking...</div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
                        className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your question..."
                            className="flex-1 bg-slate-50 dark:bg-slate-900 border-none rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-red-500 outline-none"
                        />
                        <button type="submit" disabled={!input.trim() || loading} className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center disabled:opacity-50">
                            <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
