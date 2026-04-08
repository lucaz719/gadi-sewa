import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';

export const CustomerSelectionModal = ({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (c: any) => void }) => {
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
        if (isOpen) {
            setView('list');
            loadCustomers();
        }
    }, [isOpen]);

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

    if (!isOpen) return null;

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
            } catch (err) {
                console.error("Failed to save customer", err);
            } finally {
                setSaving(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0 bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-lg">{view === 'create' ? 'New Customer' : 'Select Customer'}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined">close</span></button>
                </div>

                {view === 'list' ? (
                    <>
                        <div className="p-2 overflow-y-auto flex-1 bg-white dark:bg-[#1e293b]">
                            {loading ? (
                                <div className="p-8 text-center text-slate-500">Loading customers...</div>
                            ) : customers.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">No customers found.</div>
                            ) : (
                                customers.map(c => (
                                    <button key={c.id} onClick={() => onSelect({...c, tier: 'Bronze'})} className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex justify-between items-center group transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white leading-tight mb-1">{c.name}</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs text-slate-500">{c.phone}</p>
                                                {c.email && <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{c.email}</span>}
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-orange-100 text-orange-700`}>Bronze</span>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">add_circle</span>
                                    </button>
                                ))
                            )}
                        </div>
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 shrink-0">
                            <button
                                onClick={() => setView('create')}
                                className="w-full py-2.5 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-bold hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <span className="material-symbols-outlined text-lg">person_add</span> Create New Customer
                            </button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleCreate} className="p-4 overflow-y-auto bg-white dark:bg-[#1e293b]">
                        <div className="space-y-4">
                            <div className="border-b pb-4 border-slate-100 dark:border-slate-800">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Contact Details</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Customer Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            autoFocus
                                            required
                                            value={newCustomer.name}
                                            onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                            placeholder="e.g. John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Phone Number <span className="text-red-500">*</span></label>
                                        <input
                                            type="tel"
                                            required
                                            value={newCustomer.phone}
                                            onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                            placeholder="e.g. +91 9876543210"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Email Address</label>
                                        <input
                                            type="email"
                                            value={newCustomer.email}
                                            onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Vehicle Information</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Registration Plate</label>
                                        <input
                                            type="text"
                                            value={newCustomer.vehiclePlate}
                                            onChange={e => setNewCustomer({ ...newCustomer, vehiclePlate: e.target.value.toUpperCase() })}
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all uppercase placeholder:normal-case font-mono"
                                            placeholder="e.g. BA 1 Pa 1234"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Brand / Make</label>
                                        <input
                                            type="text"
                                            value={newCustomer.vehicleMake}
                                            onChange={e => setNewCustomer({ ...newCustomer, vehicleMake: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                            placeholder="e.g. Maruti Suzuki"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Model</label>
                                        <input
                                            type="text"
                                            value={newCustomer.vehicleModel}
                                            onChange={e => setNewCustomer({ ...newCustomer, vehicleModel: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                            placeholder="e.g. Swift"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setView('list')}
                                    className="flex-1 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving || !newCustomer.name || !newCustomer.phone}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white hover:bg-primary-700 rounded-lg font-bold transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {saving ? (
                                        <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Saving...</>
                                    ) : (
                                        <><span className="material-symbols-outlined text-sm">save</span> Save & Select</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
