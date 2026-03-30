import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../services/db';

export const InlineCustomerSection = ({ onSelect, selectedCustomer, onClear }: { onSelect: (c: any) => void, selectedCustomer: any | null, onClear: () => void }) => {
    const [customers, setCustomers] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const resultsRef = useRef<HTMLDivElement>(null);
    
    const [formData, setFormData] = useState({ 
        name: '', 
        phone: '', 
        email: '',
        vehiclePlate: ''
    });

    useEffect(() => {
        loadCustomers();
        const handleClickOutside = (event: MouseEvent) => {
            if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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

    const handleNameChange = (val: string) => {
        setFormData({ ...formData, name: val });
        if (val.trim().length > 0) {
            const filtered = customers.filter(c => 
                c.name.toLowerCase().includes(val.toLowerCase()) || 
                c.phone.includes(val)
            );
            setSearchResults(filtered);
            setShowResults(true);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    };

    const handleSelectExisting = (c: any) => {
        onSelect({ ...c, tier: c.tier || 'Bronze' });
        setFormData({ name: c.name, phone: c.phone, email: c.email || '', vehiclePlate: c.vehicle_history?.plate || '' });
        setShowResults(false);
    };

    const handleCreate = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (formData.name && formData.phone) {
            setSaving(true);
            try {
                const payload = {
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email || null,
                    vehicle_history: {
                        plate: formData.vehiclePlate
                    }
                };
                
                const saved = await db.saveCustomer(payload);
                onSelect({ ...saved, tier: 'Bronze' }); 
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
                <button onClick={() => { onClear(); setFormData({ name: '', phone: '', email: '', vehiclePlate: '' }); }} className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-visible flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 shrink-0 rounded-t-xl">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Customer Details</h3>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Type to Search or Add New</span>
            </div>

            <div className="p-3 relative">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="relative">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Full Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => handleNameChange(e.target.value)}
                            onFocus={() => formData.name && setShowResults(true)}
                            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none font-medium"
                            placeholder="Search or Enter Name"
                        />
                        {showResults && searchResults.length > 0 && (
                            <div ref={resultsRef} className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-1">
                                {searchResults.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => handleSelectExisting(c)}
                                        className="w-full text-left p-3 hover:bg-primary-50 dark:hover:bg-primary-900/20 border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors"
                                    >
                                        <p className="font-bold text-sm text-slate-900 dark:text-white">{c.name}</p>
                                        <p className="text-xs text-slate-500">{c.phone}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Phone *</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none font-medium"
                            placeholder="Mobile Number"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Email (Opt)</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none font-medium"
                            placeholder="email@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Reg. Plate (Opt)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.vehiclePlate}
                                onChange={e => setFormData({ ...formData, vehiclePlate: e.target.value.toUpperCase() })}
                                className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none uppercase font-mono font-medium"
                                placeholder="AA-1234"
                            />
                            <button
                                onClick={() => handleCreate()}
                                disabled={saving || !formData.name || !formData.phone}
                                className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center min-w-[40px]"
                                title="Set Active"
                            >
                                <span className="material-symbols-outlined text-lg">{saving ? 'hourglass_top' : 'done_all'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
