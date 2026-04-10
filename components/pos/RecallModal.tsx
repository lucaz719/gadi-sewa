import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';

export const RecallModal = ({ isOpen, onClose, onRecall }: { isOpen: boolean, onClose: () => void, onRecall: (heldData: any) => void }) => {
    const [heldCarts, setHeldCarts] = useState<any[]>([]);

    useEffect(() => {
        const loadHeld = async () => {
            setHeldCarts(await db.getHeldCarts());
        };
        if (isOpen) loadHeld();
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-lg">Held Carts</h3>
                    <button onClick={onClose}><span className="material-symbols-outlined text-slate-400">close</span></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {heldCarts.length === 0 ? (
                        <p className="text-center text-slate-500 py-8 italic">No held carts found.</p>
                    ) : (
                        heldCarts.map((h) => (
                            <div key={h.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center hover:border-primary-500 transition-all group">
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">NPR {h.total.toFixed(2)}</p>
                                    <p className="text-xs text-slate-500">{h.customer?.name || 'Walk-in'} • {h.cart.length} items</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{new Date(h.heldAt).toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={() => onRecall(h)}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 shadow-sm"
                                >
                                    Recall
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
