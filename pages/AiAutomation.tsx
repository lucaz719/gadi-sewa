import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../services/db';
import { useToast } from '../App';

interface AutomationRule {
    id: string;
    name: string;
    description: string;
    icon: string;
    action: string;
    enabled: boolean;
    lastRun?: string;
}

interface DigestData {
    insights: string[];
    snapshot: Record<string, any>;
    generated_at: string;
}

interface ReorderSuggestion {
    id: number;
    name: string;
    current_stock: number;
    suggested_order_qty: number;
    estimated_cost: number;
    category: string;
}

export default function AiAutomation() {
    const { showToast } = useToast();
    const [digest, setDigest] = useState<DigestData | null>(null);
    const [reorderData, setReorderData] = useState<{ suggestions: ReorderSuggestion[]; total: number } | null>(null);
    const [reminderData, setReminderData] = useState<{ overdue: any[]; upcoming: any[] } | null>(null);
    const [loading, setLoading] = useState<string | null>(null);
    const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
        { id: 'auto-followup', name: 'Auto Service Follow-ups', description: 'Automatically flag customers overdue for service', icon: 'notifications_active', action: 'service_reminder', enabled: true },
        { id: 'smart-reorder', name: 'Smart Inventory Reorder', description: 'AI-suggested reorder when stock drops below threshold', icon: 'inventory_2', action: 'smart_reorder', enabled: true },
        { id: 'daily-digest', name: 'Daily Business Digest', description: 'AI-generated daily summary of business health', icon: 'summarize', action: 'daily_digest', enabled: true },
        { id: 'auto-diagnose', name: 'Auto Issue Diagnosis', description: 'AI-powered vehicle issue analysis on job creation', icon: 'psychology', action: 'diagnose', enabled: true },
        { id: 'financial-alerts', name: 'Financial Health Alerts', description: 'Get alerts when expenses exceed income threshold', icon: 'account_balance', action: 'financial_summary', enabled: false },
        { id: 'appointment-opt', name: 'Appointment Optimization', description: 'AI-optimized scheduling to maximize throughput', icon: 'event', action: 'book_appointment', enabled: false },
    ]);

    const user = db.getAuthUser();

    const runAction = useCallback(async (action: string) => {
        setLoading(action);
        try {
            const result = await db.executeAiAction(action, {}, user?.role || 'garage');
            if (action === 'daily_digest') {
                setDigest(result.data);
            } else if (action === 'smart_reorder') {
                setReorderData({
                    suggestions: result.data?.reorder_suggestions || [],
                    total: result.data?.total_estimated_cost || 0
                });
            } else if (action === 'service_reminder') {
                setReminderData({
                    overdue: result.data?.overdue || [],
                    upcoming: result.data?.upcoming || []
                });
            }
            showToast('success', result.message);
        } catch {
            showToast('error', 'Failed to run automation');
        } finally {
            setLoading(null);
        }
    }, [user?.role, showToast]);

    useEffect(() => {
        runAction('daily_digest');
    }, [runAction]);

    const toggleRule = (id: string) => {
        setAutomationRules(prev => prev.map(r =>
            r.id === id ? { ...r, enabled: !r.enabled } : r
        ));
    };

    return (
        <div className="space-y-8 pb-20 animate-fade-in">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-4xl text-indigo-500">auto_awesome</span>
                        AI & Automation
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        AI-powered insights, automation rules, and smart operations for your garage.
                    </p>
                </div>
                <button
                    onClick={() => runAction('daily_digest')}
                    disabled={loading === 'daily_digest'}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">{loading === 'daily_digest' ? 'sync' : 'refresh'}</span>
                    Refresh Digest
                </button>
            </div>

            {/* Daily Digest Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10">
                    <span className="material-symbols-outlined text-[200px] -mr-10 -mt-10">analytics</span>
                </div>
                <div className="relative z-10">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">auto_awesome</span>
                        Daily Business Digest
                    </h2>
                    {digest ? (
                        <div className="space-y-3">
                            {digest.insights.map((insight, i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-sm border border-white/10">
                                    {insight}
                                </div>
                            ))}
                            <p className="text-xs opacity-60 mt-2">
                                Generated: {new Date(digest.generated_at).toLocaleString()}
                            </p>
                        </div>
                    ) : (
                        <div className="animate-pulse text-white/60 italic">Generating AI digest...</div>
                    )}
                </div>
            </div>

            {/* Quick Stats from Digest */}
            {digest?.snapshot && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-[#1e293b] rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-600">work</span>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">{digest.snapshot.jobs?.pending || 0}</p>
                                <p className="text-xs text-slate-500">Pending Jobs</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1e293b] rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-orange-600">inventory_2</span>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">{digest.snapshot.inventory?.low_stock_count || 0}</p>
                                <p className="text-xs text-slate-500">Low Stock Items</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1e293b] rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-600">person_alert</span>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">{digest.snapshot.customers?.overdue_followups || 0}</p>
                                <p className="text-xs text-slate-500">Overdue Follow-ups</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1e293b] rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-600">payments</span>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">NPR {(digest.snapshot.financials?.net_profit || 0).toLocaleString()}</p>
                                <p className="text-xs text-slate-500">Net Profit</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Two Column Layout: Automation Rules + Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Automation Rules Panel */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-indigo-500">settings_suggest</span>
                        Automation Rules
                    </h2>
                    <div className="space-y-3">
                        {automationRules.map(rule => (
                            <div
                                key={rule.id}
                                className={`bg-white dark:bg-[#1e293b] rounded-xl p-4 border shadow-sm flex items-center gap-4 transition-all ${rule.enabled ? 'border-indigo-200 dark:border-indigo-900/50' : 'border-slate-200 dark:border-slate-700 opacity-60'}`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${rule.enabled ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                    <span className="material-symbols-outlined text-2xl">{rule.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{rule.name}</h3>
                                    <p className="text-xs text-slate-500">{rule.description}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => runAction(rule.action)}
                                        disabled={loading === rule.action || !rule.enabled}
                                        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 disabled:opacity-50 transition-colors"
                                    >
                                        {loading === rule.action ? 'Running...' : 'Run Now'}
                                    </button>
                                    <button
                                        onClick={() => toggleRule(rule.id)}
                                        className={`relative w-11 h-6 rounded-full transition-colors ${rule.enabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${rule.enabled ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick AI Actions Panel */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-purple-500">bolt</span>
                        Quick AI Actions
                    </h2>
                    <div className="space-y-3">
                        {[
                            { label: 'Service Reminders', icon: 'notifications', action: 'service_reminder', color: 'orange' },
                            { label: 'Smart Reorder', icon: 'shopping_cart', action: 'smart_reorder', color: 'blue' },
                            { label: 'Financial Insights', icon: 'trending_up', action: 'financial_summary', color: 'green' },
                            { label: 'AI Diagnosis', icon: 'biotech', action: 'diagnose', color: 'purple' },
                        ].map(action => (
                            <button
                                key={action.action}
                                onClick={() => runAction(action.action)}
                                disabled={loading === action.action}
                                className={`w-full flex items-center gap-3 p-4 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all text-left disabled:opacity-50`}
                            >
                                <div className={`w-10 h-10 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30 flex items-center justify-center`}>
                                    <span className={`material-symbols-outlined text-${action.color}-600`}>{action.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm text-slate-900 dark:text-white">{action.label}</p>
                                    <p className="text-[10px] text-slate-500">
                                        {loading === action.action ? 'Running...' : 'Click to run'}
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Service Reminders Results */}
                {reminderData && (
                    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-orange-500">notifications_active</span>
                            Service Reminders
                        </h3>
                        {reminderData.overdue.length > 0 && (
                            <div className="mb-4">
                                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Overdue ({reminderData.overdue.length})</p>
                                <div className="space-y-2">
                                    {reminderData.overdue.map((c, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border-l-4 border-red-500 text-sm">
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{c.name}</p>
                                                <p className="text-xs text-slate-500">{c.phone}</p>
                                            </div>
                                            <p className="text-xs text-red-600 font-mono">{c.due_date?.split('T')[0]}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {reminderData.upcoming.length > 0 && (
                            <div>
                                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">Due This Week ({reminderData.upcoming.length})</p>
                                <div className="space-y-2">
                                    {reminderData.upcoming.map((c, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg border-l-4 border-orange-500 text-sm">
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{c.name}</p>
                                                <p className="text-xs text-slate-500">{c.phone}</p>
                                            </div>
                                            <p className="text-xs text-orange-600 font-mono">{c.due_date?.split('T')[0]}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {reminderData.overdue.length === 0 && reminderData.upcoming.length === 0 && (
                            <p className="text-sm text-slate-500 text-center py-6">All customers are up to date!</p>
                        )}
                    </div>
                )}

                {/* Smart Reorder Results */}
                {reorderData && (
                    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-500">shopping_cart</span>
                            Smart Reorder Suggestions
                        </h3>
                        {reorderData.suggestions.length > 0 ? (
                            <>
                                <div className="space-y-2 mb-4">
                                    {reorderData.suggestions.map((s, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{s.name}</p>
                                                <p className="text-xs text-slate-500">Current: {s.current_stock} pcs • {s.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-blue-600">Order {s.suggested_order_qty}</p>
                                                <p className="text-xs text-slate-500">NPR {s.estimated_cost.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex justify-between items-center">
                                    <span className="text-sm font-bold text-blue-800 dark:text-blue-300">Total Estimated Cost</span>
                                    <span className="text-lg font-black text-blue-600">NPR {reorderData.total.toLocaleString()}</span>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-6">All inventory levels are healthy!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
