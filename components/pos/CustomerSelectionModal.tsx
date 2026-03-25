import React, { useState, useEffect } from 'react';

export const CustomerSelectionModal = ({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (c: any) => void }) => {
    const [view, setView] = useState<'list' | 'create'>('list');
    const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', tier: 'Bronze' });

    useEffect(() => {
        if (isOpen) setView('list');
    }, [isOpen]);

    if (!isOpen) return null;

    const customers = [
        { id: 1, name: 'John Doe', phone: '+1 555-0123', tier: 'Gold' },
        { id: 2, name: 'Sarah Connor', phone: '+1 555-0987', tier: 'Silver' },
        { id: 3, name: 'Mike Ross', phone: '+1 555-4567', tier: 'Bronze' },
    ];

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCustomer.name && newCustomer.phone) {
            onSelect(newCustomer);
            setNewCustomer({ name: '', phone: '', tier: 'Bronze' });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold">{view === 'create' ? 'New Customer' : 'Select Customer'}</h3>
                    <button onClick={onClose}><span className="material-symbols-outlined text-slate-400">close</span></button>
                </div>

                {view === 'list' ? (
                    <>
                        <div className="p-2 max-h-64 overflow-y-auto">
                            {customers.map(c => (
                                <button key={c.id} onClick={() => onSelect(c)} className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex justify-between items-center group">
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{c.name}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-slate-500">{c.phone}</p>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${c.tier === 'Gold' ? 'bg-yellow-100 text-yellow-700' : c.tier === 'Silver' ? 'bg-slate-100 text-slate-600' : 'bg-orange-100 text-orange-700'}`}>{c.tier}</span>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-primary-500 opacity-0 group-hover:opacity-100">add_circle</span>
                                </button>
                            ))}
                        </div>
                        <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setView('create')}
                                className="w-full py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-bold hover:bg-primary-200 dark:hover:bg-primary-900/30 transition-colors"
                            >
                                + Create New Customer
                            </button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleCreate} className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Customer Name</label>
                            <input
                                type="text"
                                autoFocus
                                required
                                value={newCustomer.name}
                                onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Enter Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number</label>
                            <input
                                type="tel"
                                required
                                value={newCustomer.phone}
                                onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Enter Phone"
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setView('list')}
                                className="flex-1 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg font-medium"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg font-bold"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
