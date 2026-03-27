import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';

export const InlineCustomerSection = ({ onSelect, selectedCustomer, onClear }: { onSelect: (c: any) => void, selectedCustomer: any | null, onClear: () => void }) => {
    const [view, setView] = useState<'list' | 'create'>('list');
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    
    const [newCustomer, setNewCustomer] = useState({ 
        name: '', 
        phone: '', 
        email: '',
        vehicleMake: '',
        vehicleModel: '',
        vehiclePlate: ''
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const authUser = db.getAuthUser();
            const enterpriseId = authUser?.enterprise_id || 1;
            const data = await db.getCustomers(enterpriseId);
            setCustomers(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newCustomer.name && newCustomer.phone) {
            setSaving(true);
            try {
                const payload = {
                    name: newCustomer.name,
                    phone: newCustomer.phone,
                    email: newCustomer.email || null,
                    vehicle_history: {
                        make: newCustomer.vehicleMake,
                        model: newCustomer.vehicleModel,
                        plate: newCustomer.vehiclePlate
                    }
                };
                
                const saved = await db.saveCustomer(payload);
                onSelect({...saved, tier: 'Bronze'}); 
                setNewCustomer({ name: '', phone: '', email: '', vehicleMake: '', vehicleModel: '', vehiclePlate: '' });
                setView('list');
                // Reload list to include new one if they clear selection
                loadCustomers();
            } catch (err) {
                console.error("Failed to save customer", err);
            } finally {
                setSaving(false);
            }
        }
    };

    if (selectedCustomer) {
        return (
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl border border-primary-100 dark:border-primary-800 flex justify-between items-center transition-all animate-fade-in shrink-0">
                <div>
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-bold mb-1 uppercase tracking-wider">Active Customer</p>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{selectedCustomer.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {selectedCustomer.phone} • <span className="uppercase text-primary-600 dark:text-primary-400 text-xs font-bold">{selectedCustomer.tier || 'Bronze'} TIER</span>
                    </p>
                </div>
                <button onClick={onClear} className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-72 shrink-0">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 shrink-0">
                <h3 className="font-bold text-slate-900 dark:text-white">Customer Details</h3>
                {view === 'create' ? (
                    <button onClick={() => setView('list')} className="text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">Cancel</button>
                ) : (
                    <button onClick={() => setView('create')} className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">add</span> New
                    </button>
                )}
            </div>

            {view === 'list' ? (
                <div className="p-2 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500 text-sm">Loading customers...</div>
                    ) : customers.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">No customers found.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                        {customers.map(c => (
                            <button key={c.id} onClick={() => onSelect({...c, tier: 'Bronze'})} className="text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/50 hover:border-primary-200 dark:hover:border-primary-800 transition-all group">
                                <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{c.name}</p>
                                <p className="text-xs text-slate-500 truncate">{c.phone}</p>
                            </button>
                        ))}
                        </div>
                    )}
                </div>
            ) : (
                <form onSubmit={handleCreate} className="p-3 overflow-y-auto flex-1 flex flex-col">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <input
                                type="text"
                                autoFocus
                                required
                                value={newCustomer.name}
                                onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none"
                                placeholder="Name *"
                            />
                        </div>
                        <div>
                            <input
                                type="tel"
                                required
                                value={newCustomer.phone}
                                onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none"
                                placeholder="Phone *"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                value={newCustomer.email}
                                onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none"
                                placeholder="Email (Opt)"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                value={newCustomer.vehiclePlate}
                                onChange={e => setNewCustomer({ ...newCustomer, vehiclePlate: e.target.value.toUpperCase() })}
                                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none uppercase placeholder:normal-case font-mono"
                                placeholder="Reg. Plate (Opt)"
                            />
                        </div>
                    </div>
                    
                    <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-800 shrink-0">
                        <button
                            type="submit"
                            disabled={saving || !newCustomer.name || !newCustomer.phone}
                            className="w-full py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {saving ? 'Saving...' : 'Save & Select'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
