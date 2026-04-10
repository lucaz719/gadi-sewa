import React, { useState } from 'react';

export const CheckoutModal = ({ isOpen, onClose, total, onComplete, customer }: { isOpen: boolean, onClose: () => void, total: number, onComplete: (txn: any) => void, customer: any }) => {
    const [isSplit, setIsSplit] = useState(false);
    const [method, setMethod] = useState('Cash');
    const [splitMethod, setSplitMethod] = useState('Card');
    const [cashReceived, setCashReceived] = useState('');
    const [secondReceived, setSecondReceived] = useState('');

    if (!isOpen) return null;

    const cashVal = parseFloat(cashReceived) || 0;
    const secondVal = parseFloat(secondReceived) || 0;

    // Auto-calculate remaining for split
    const remainingDue = Math.max(0, total - cashVal);
    const change = !isSplit && method === 'Cash' ? Math.max(0, cashVal - total) : (isSplit ? Math.max(0, (cashVal + secondVal) - total) : 0);

    const isDigital = method === 'eSewa' || method === 'Khalti' || (isSplit && (splitMethod === 'eSewa' || splitMethod === 'Khalti'));

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-lg">Complete Checkout</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsSplit(!isSplit)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${isSplit ? 'bg-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'}`}
                        >
                            {isSplit ? 'Split Enabled' : 'Enable Split'}
                        </button>
                        <button onClick={onClose}><span className="material-symbols-outlined text-slate-400">close</span></button>
                    </div>
                </div>
                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                    <div className="text-center">
                        <p className="text-slate-500 text-sm uppercase font-bold tracking-wider">Amount Due</p>
                        <p className="text-4xl font-black text-slate-900 dark:text-white">NPR {total.toFixed(2)}</p>
                    </div>

                    {!isSplit ? (
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-slate-500 uppercase">Payment Method</label>
                            <div className="grid grid-cols-4 gap-2">
                                {['Cash', 'Card', 'eSewa', 'Khalti'].map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setMethod(m)}
                                        className={`py-3 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-1 ${method === m ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                    >
                                        <span className="material-symbols-outlined text-xl">{m === 'Cash' ? 'payments' : m === 'Card' ? 'credit_card' : 'qr_code_2'}</span>
                                        <span className="text-[10px]">{m}</span>
                                    </button>
                                ))}
                            </div>
                            {method === 'Cash' && (
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Cash Received</label>
                                    <input
                                        type="number"
                                        autoFocus
                                        value={cashReceived}
                                        onChange={e => setCashReceived(e.target.value)}
                                        className="w-full text-2xl font-mono p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-primary-500 text-right"
                                        placeholder="0.00"
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/20">
                                <label className="block text-xs font-bold text-orange-600 dark:text-orange-400 mb-2 uppercase">Part 1: Cash Received</label>
                                <input
                                    type="number"
                                    value={cashReceived}
                                    onChange={e => setCashReceived(e.target.value)}
                                    className="w-full text-xl font-mono p-2 rounded-lg border border-orange-200 dark:border-orange-800 bg-white dark:bg-slate-950 outline-none text-right"
                                    placeholder="Enter Cash Amount"
                                />
                                <div className="mt-2 flex justify-between text-xs font-bold text-orange-700 dark:text-orange-300 uppercase">
                                    <span>Remaining Due</span>
                                    <span>NPR {remainingDue.toFixed(2)}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Part 2: Balance via</label>
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {['Card', 'eSewa', 'Khalti'].map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setSplitMethod(m)}
                                            className={`py-2 rounded-lg border-2 font-bold transition-all flex flex-col items-center gap-1 ${splitMethod === m ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
                                        >
                                            <span className="text-[10px]">{m}</span>
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="number"
                                    value={secondReceived || remainingDue.toFixed(2)}
                                    onChange={e => setSecondReceived(e.target.value)}
                                    className="w-full text-xl font-mono p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none text-right"
                                    placeholder="Enter Amount"
                                />
                            </div>
                        </div>
                    )}

                    {isDigital && (
                        <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 animate-fade-in">
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Scan to Pay ({isSplit ? splitMethod : method})</p>
                            <div className="w-32 h-32 bg-white p-2 rounded-lg shadow-sm">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GadiSewa_Payment_${total}`} className="w-full h-full" alt="QR" />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2">Garage Merchant ID: GS-99210</p>
                        </div>
                    )}

                    <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30">
                        <span className="font-bold text-green-700 dark:text-green-300">Change Due</span>
                        <span className="text-2xl font-black text-green-600">NPR {change.toFixed(2)}</span>
                    </div>
                </div>
                <div className="p-4 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <button
                        onClick={() => onComplete({
                            method: isSplit ? `Split (Cash + ${splitMethod})` : method,
                            tendered: isSplit ? (cashVal + secondVal) : cashVal,
                            isSplit
                        })}
                        disabled={(!isSplit && method === 'Cash' && cashVal < total) || (isSplit && (cashVal + secondVal) < total)}
                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined">verified_user</span> Finalize & Print
                    </button>
                </div>
            </div>
        </div>
    );
};
