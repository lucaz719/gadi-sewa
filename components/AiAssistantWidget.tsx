import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../services/db';

interface AiAction {
    type: string;
    data?: Record<string, any>;
    label?: string;
}

interface ChatMessage {
    role: 'ai' | 'user';
    text: string;
    suggestions?: string[];
    actions?: AiAction[];
    contextData?: Record<string, any>;
    actionResult?: { success: boolean; message: string; data?: any; followUp?: string[] };
}

export default function AiAssistantWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'ai',
            text: 'Namaste! I am your GadiSewa AI Assistant. I can help you manage jobs, check inventory, track finances, book services, and perform operations — all through conversation. What would you like to do?',
            suggestions: ['Business summary', 'Create a job', 'Check inventory', 'Financial report']
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [executingAction, setExecutingAction] = useState<string | null>(null);
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
                suggestions: response.suggestions,
                actions: response.actions || undefined,
                contextData: response.context_data || undefined
            }]);

            if (response.action && response.action.startsWith('navigate:')) {
                const target = response.action.split(':')[1];
                setTimeout(() => navigate(target), 1500);
            }
        } catch {
            setMessages(prev => [...prev, { role: 'ai', text: 'I am having some trouble connecting. Please try again shortly.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleExecuteAction = async (action: AiAction) => {
        setExecutingAction(action.type);
        try {
            const result = await db.executeAiAction(action.type, action.data || {}, user?.role || 'garage');
            setMessages(prev => [...prev, {
                role: 'ai',
                text: result.message,
                suggestions: result.follow_up || [],
                actionResult: {
                    success: result.success,
                    message: result.message,
                    data: result.data,
                    followUp: result.follow_up
                }
            }]);
        } catch {
            setMessages(prev => [...prev, { role: 'ai', text: 'Failed to execute action. Please try again.' }]);
        } finally {
            setExecutingAction(null);
        }
    };

    const renderActionResult = (result: ChatMessage['actionResult']) => {
        if (!result?.data) return null;
        const data = result.data;

        // Financial summary card
        if (data.total_income !== undefined) {
            return (
                <div className="mt-2 bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700 text-[11px]">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <p className="text-green-600 font-black text-sm">NPR {Number(data.total_income).toLocaleString()}</p>
                            <p className="text-slate-500">Income</p>
                        </div>
                        <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                            <p className="text-red-600 font-black text-sm">NPR {Number(data.total_expense).toLocaleString()}</p>
                            <p className="text-slate-500">Expense</p>
                        </div>
                    </div>
                    <div className="mt-2 text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <p className="text-blue-600 font-black text-sm">NPR {Number(data.net_profit).toLocaleString()}</p>
                        <p className="text-slate-500">Net Profit</p>
                    </div>
                </div>
            );
        }

        // Inventory items
        if (data.items) {
            return (
                <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    {data.items.slice(0, 5).map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center text-[10px] bg-white dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-700">
                            <span className="font-bold truncate flex-1">{item.name}</span>
                            <span className={`ml-2 px-1.5 py-0.5 rounded font-black ${item.stock <= 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                {item.stock} pcs
                            </span>
                        </div>
                    ))}
                </div>
            );
        }

        // Diagnosis result
        if (data.possible_causes) {
            return (
                <div className="mt-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 text-[11px] border border-indigo-200 dark:border-indigo-800">
                    <p className="font-bold text-indigo-700 dark:text-indigo-300 mb-1">Possible Causes:</p>
                    <ul className="list-disc pl-3 space-y-0.5 text-slate-600 dark:text-slate-400">
                        {data.possible_causes.map((c: string, i: number) => <li key={i}>{c}</li>)}
                    </ul>
                    {data.urgency && (
                        <div className={`mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${data.urgency === 'high' ? 'bg-red-100 text-red-600' : data.urgency === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                            {data.urgency} urgency
                        </div>
                    )}
                </div>
            );
        }

        // Service reminders
        if (data.overdue || data.upcoming) {
            const items = [...(data.overdue || []), ...(data.upcoming || [])];
            if (items.length === 0) return null;
            return (
                <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    {items.slice(0, 4).map((c: any, i: number) => (
                        <div key={i} className="flex justify-between items-center text-[10px] bg-white dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-700">
                            <span className="font-bold">{c.name}</span>
                            <span className="text-slate-500">{c.phone}</span>
                        </div>
                    ))}
                </div>
            );
        }

        // Daily digest insights
        if (data.insights) {
            return (
                <div className="mt-2 space-y-1">
                    {data.insights.map((insight: string, i: number) => (
                        <p key={i} className="text-[10px] bg-white dark:bg-slate-900 p-2 rounded border-l-2 border-blue-500 text-slate-600 dark:text-slate-300">
                            {insight}
                        </p>
                    ))}
                </div>
            );
        }

        // Reorder suggestions
        if (data.reorder_suggestions) {
            return (
                <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    {data.reorder_suggestions.slice(0, 4).map((s: any, i: number) => (
                        <div key={i} className="flex justify-between items-center text-[10px] bg-white dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-700">
                            <span className="font-bold truncate flex-1">{s.name}</span>
                            <span className="text-orange-600 font-bold ml-2">Order {s.suggested_order_qty}</span>
                        </div>
                    ))}
                </div>
            );
        }

        // Job creation confirmation
        if (data.job_id) {
            return (
                <div className="mt-2 bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-[11px] border border-green-200 dark:border-green-800 text-center">
                    <span className="material-symbols-outlined text-green-600 text-2xl">check_circle</span>
                    <p className="font-bold text-green-700 dark:text-green-300 mt-1">Job #{data.job_id} Created</p>
                    <p className="text-slate-500">Status: {data.status}</p>
                </div>
            );
        }

        // Appointment confirmation
        if (data.appointment_id) {
            return (
                <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-[11px] border border-blue-200 dark:border-blue-800 text-center">
                    <span className="material-symbols-outlined text-blue-600 text-2xl">event_available</span>
                    <p className="font-bold text-blue-700 dark:text-blue-300 mt-1">Appointment Booked</p>
                    <p className="text-slate-500">{data.date} at {data.time}</p>
                </div>
            );
        }

        return null;
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
                <div className="absolute bottom-16 right-0 w-80 md:w-96 h-[520px] bg-white dark:bg-[#16222d] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-slide-up">
                    <div className="p-4 bg-slate-900 dark:bg-red-700 text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl">smart_toy</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm">GadiSewa AI Assistant</p>
                            <p className="text-[10px] opacity-80">AI-powered • Can perform app actions</p>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => {
                                    handleSendMessage('Business summary');
                                }}
                                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                title="Quick Digest"
                            >
                                <span className="material-symbols-outlined text-sm">dashboard</span>
                            </button>
                            <button
                                onClick={async () => {
                                    setExecutingAction('daily_digest');
                                    try {
                                        const result = await db.executeAiAction('daily_digest', {}, user?.role || 'garage');
                                        setMessages(prev => [...prev, {
                                            role: 'ai',
                                            text: result.message,
                                            suggestions: result.follow_up || [],
                                            actionResult: { success: result.success, message: result.message, data: result.data, followUp: result.follow_up }
                                        }]);
                                    } catch { /* ignore */ }
                                    setExecutingAction(null);
                                }}
                                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                title="Daily Digest"
                            >
                                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${m.role === 'user' ? 'bg-red-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none'}`}>
                                    <div className="whitespace-pre-line">{m.text}</div>

                                    {/* Action Result Cards */}
                                    {m.actionResult && renderActionResult(m.actionResult)}

                                    {/* Action Buttons */}
                                    {m.actions && m.actions.length > 0 && (
                                        <div className="mt-3 space-y-1.5">
                                            {m.actions.map((action, ai) => (
                                                <button
                                                    key={ai}
                                                    onClick={() => handleExecuteAction(action)}
                                                    disabled={executingAction !== null}
                                                    className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-[11px] font-bold transition-colors disabled:opacity-50"
                                                >
                                                    <span className="material-symbols-outlined text-sm">
                                                        {executingAction === action.type ? 'sync' : 'play_arrow'}
                                                    </span>
                                                    {executingAction === action.type ? 'Executing...' : (action.label || action.type)}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Suggestion Chips */}
                                    {m.suggestions && m.suggestions.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                            {m.suggestions.map((s, si) => (
                                                <button
                                                    key={si}
                                                    onClick={() => handleSendMessage(s)}
                                                    className="bg-white dark:bg-slate-700 px-2 py-1 rounded-md border dark:border-slate-600 text-[10px] font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
                                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none text-[10px] italic flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                    AI is thinking...
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Quick Actions Bar */}
                    <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto">
                        {[
                            { label: '📋 Jobs', msg: 'Show job status' },
                            { label: '📦 Stock', msg: 'Check inventory' },
                            { label: '💰 Finance', msg: 'Financial summary' },
                            { label: '🔧 Diagnose', msg: 'Diagnose vehicle issue' }
                        ].map((qa, i) => (
                            <button
                                key={i}
                                onClick={() => handleSendMessage(qa.msg)}
                                className="flex-shrink-0 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                            >
                                {qa.label}
                            </button>
                        ))}
                    </div>

                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
                        className="p-3 border-t border-slate-100 dark:border-slate-800 flex gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything or give a command..."
                            className="flex-1 bg-slate-50 dark:bg-slate-900 border-none rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-red-500 outline-none"
                        />
                        <button type="submit" disabled={!input.trim() || loading} className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center disabled:opacity-50 hover:bg-red-700 transition-colors">
                            <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
