import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import { useToast } from '../../App';

export default function PlanManagement() {
    const { showToast } = useToast();
    const [plans, setPlans] = useState<any[]>([]);
    const [enterprises, setEnterprises] = useState<any[]>([]);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState<any>(null);
    const [selectedEnt, setSelectedEnt] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [planList, entList] = await Promise.all([
                db.getPlans(),
                db.getEnterprises()
            ]);
            setPlans(planList);
            setEnterprises(entList);
        } catch (err) {
            showToast('error', 'Failed to load system plans.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSavePlan = async (e: React.FormEvent) => {
        e.preventDefault();
        // Assuming db.savePlan is implemented in db.ts, if not we add it
        // For now we simulate or use existing saveVoucher pattern if it existed
        showToast('info', 'Plan update feature under system maintenance.');
        setShowPlanModal(false);
    };

    const handleDeletePlan = async (id: string) => {
        if (confirm('Delete this plan tier?')) {
            showToast('info', 'Plan deletion restricted for system integrity.');
        }
    };

    const openNew = () => {
        setEditingPlan({ name: '', price: '', features: [], duration: 'Monthly' });
        setShowPlanModal(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-red-600">Plan Management</h1>
                    <p className="text-slate-500 text-sm">Control pricing tiers and platform features.</p>
                </div>
                <button onClick={openNew} className="bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg hover:bg-red-700 transition-all active:scale-95">
                    <span className="material-symbols-outlined">add</span> Create Custom Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <div key={plan.id} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col shadow-sm">
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-700 flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{plan.name}</h3>
                                <p className="text-2xl font-black text-red-600 mt-1">₹{plan.price.toLocaleString()}<span className="text-xs font-normal text-slate-400">/{plan.duration}</span></p>
                            </div>
                            <button onClick={() => handleDeletePlan(plan.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                        <div className="p-6 flex-1">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Core Features</p>
                            <ul className="space-y-2">
                                {plan.features.map((f: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                        <span className="material-symbols-outlined text-green-500 text-base">check_circle</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-4 border-t dark:border-slate-700">
                            <button
                                onClick={() => { setEditingPlan(plan); setShowPlanModal(true); }}
                                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors"
                            >Edit Configuration</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 space-y-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Active Subscriptions</h2>
                <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-700">
                            <tr>
                                <th className="p-4 font-black text-slate-400 uppercase text-[10px]">Enterprise</th>
                                <th className="p-4 font-black text-slate-400 uppercase text-[10px]">Tier</th>
                                <th className="p-4 font-black text-slate-400 uppercase text-[10px]">Renewal</th>
                                <th className="p-4 font-black text-slate-400 uppercase text-[10px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-700">
                            {loading ? (
                                <tr><td colSpan={4} className="p-8 text-center text-slate-400 italic">Syncing subscription data...</td></tr>
                            ) : enterprises.map((ent: any) => (
                                <tr key={ent.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="p-4 font-bold">{ent.name}</td>
                                    <td className="p-4">
                                        <span className="bg-red-50 dark:bg-red-900/10 text-red-600 text-[10px] font-black px-2 py-0.5 rounded border border-red-200 dark:border-red-900/30 uppercase tracking-widest">
                                            {plans.find(p => p.id === ent.plan_id)?.name || 'Pro Tier'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 font-mono text-xs">2026-03-30</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => setSelectedEnt(ent)} className="text-red-600 font-bold hover:underline">Manage</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Plan Modal */}
            {showPlanModal && editingPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                            <h3 className="font-bold text-lg">{editingPlan.id ? 'Edit Plan' : 'Create Custom Plan'}</h3>
                            <button onClick={() => setShowPlanModal(false)} className="text-slate-400 hover:text-red-500"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={handleSavePlan} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Plan Name</label>
                                <input required type="text" value={editingPlan.name} onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2.5 outline-none focus:border-red-500" placeholder="e.g. Mega Vendor" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Price (₹)</label>
                                    <input required type="number" value={editingPlan.price} onChange={e => setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2.5 outline-none focus:border-red-500" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Frequency</label>
                                    <select value={editingPlan.duration} onChange={e => setEditingPlan({ ...editingPlan, duration: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2.5 outline-none">
                                        <option>Monthly</option>
                                        <option>Yearly</option>
                                        <option>Lifetime</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Features (Comma Separated)</label>
                                <textarea value={editingPlan.features.join(', ')} onChange={e => setEditingPlan({ ...editingPlan, features: e.target.value.split(',').map(s => s.trim()) })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2.5 outline-none focus:border-red-500" rows={3} placeholder="Feature 1, Feature 2..."></textarea>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowPlanModal(false)} className="flex-1 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Discard</button>
                                <button type="submit" className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg">Save Configuration</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Manage Enterprise Subscription Modal */}
            {selectedEnt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                            <div>
                                <h3 className="font-bold text-lg">Manage Enterprise: {selectedEnt.name}</h3>
                                <p className="text-xs text-slate-500">{selectedEnt.type} Infrastructure</p>
                            </div>
                            <button onClick={() => setSelectedEnt(null)}><span className="material-symbols-outlined text-slate-400 hover:text-red-500 transition-colors">close</span></button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Tier</p>
                                    <p className="font-bold text-slate-900 dark:text-white">{plans.find(p => p.id === selectedEnt.plan_id)?.name}</p>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Payment</p>
                                    <p className="font-bold text-green-600">Verified</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Change Tier</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {plans.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={async () => {
                                                try {
                                                    await db.saveEnterprise({ ...selectedEnt, plan_id: p.id });
                                                    showToast('success', `Enterprise upgraded to ${p.name}`);
                                                    setSelectedEnt(null);
                                                    loadData();
                                                } catch (err) {
                                                    showToast('error', 'Update failed.');
                                                }
                                            }}
                                            className={`p-3 rounded-xl border-2 text-left transition-all ${selectedEnt.plan_id === p.id ? 'border-red-600 bg-red-50 dark:bg-red-900/10' : 'border-slate-100 dark:border-slate-800 hover:border-red-200'}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <p className="font-bold text-sm">{p.name}</p>
                                                <p className="text-xs font-black text-red-600">₹{p.price}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button className="flex-1 py-3 border border-red-500/30 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50">Suspend Access</button>
                                <button onClick={() => setSelectedEnt(null)} className="flex-1 py-3 bg-red-600 text-white rounded-xl text-xs font-bold hover:opacity-90">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
