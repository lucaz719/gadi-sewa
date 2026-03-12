
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/db';
import { useToast } from '../App';

// Products are now fetched from the database in the POS component

const KeypadModal = ({ isOpen, onClose, onEnter, title = "Enter Quantity", initialValue = "" }: { isOpen: boolean, onClose: () => void, onEnter: (val: string) => void, title?: string, initialValue?: string }) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (isOpen) setValue(initialValue);
    }, [isOpen, initialValue]);

    const handlePress = (key: string | number) => {
        if (key === 'clear') setValue("");
        else if (key === 'backspace') setValue(prev => prev.slice(0, -1));
        else if (key === '.') {
            if (!value.includes('.')) setValue(prev => prev + key);
        }
        else setValue(prev => prev + key.toString());
    };

    const handleSubmit = () => {
        onEnter(value);
        setValue("");
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-xs rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500"><span className="material-symbols-outlined">close</span></button>
                </div>
                <div className="p-4 bg-slate-100 dark:bg-slate-900 text-right text-3xl font-mono font-bold tracking-widest h-20 flex items-center justify-end border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    {value || <span className="text-slate-400">0</span>}
                </div>
                <div className="grid grid-cols-3 gap-1 p-2 bg-slate-50 dark:bg-slate-800">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'backspace'].map((key) => (
                        <button
                            key={key}
                            onClick={() => handlePress(key)}
                            className={`h-16 text-2xl font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center ${key === 'backspace' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-white dark:bg-[#16222d] text-slate-900 dark:text-white shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            {key === 'backspace' ? <span className="material-symbols-outlined">backspace</span> : key}
                        </button>
                    ))}
                </div>
                <div className="p-2 grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={() => handlePress('clear')} className="py-3 font-bold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Clear</button>
                    <button onClick={handleSubmit} className="py-3 font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-md transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">check</span> Enter
                    </button>
                </div>
            </div>
        </div>
    );
};

const RecallModal = ({ isOpen, onClose, onRecall }: { isOpen: boolean, onClose: () => void, onRecall: (heldData: any) => void }) => {
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
                                    <p className="font-bold text-slate-900 dark:text-white">₹{h.total.toFixed(2)}</p>
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

const CheckoutModal = ({ isOpen, onClose, total, onComplete, customer }: { isOpen: boolean, onClose: () => void, total: number, onComplete: (txn: any) => void, customer: any }) => {
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
                        <p className="text-4xl font-black text-slate-900 dark:text-white">₹{total.toFixed(2)}</p>
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
                                    <span>₹{remainingDue.toFixed(2)}</span>
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
                        <span className="text-2xl font-black text-green-600">₹{change.toFixed(2)}</span>
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

const CustomerSelectionModal = ({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (c: any) => void }) => {
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

export default function POS() {
    const { showToast } = useToast();
    const [products, setProducts] = useState<any[]>([]);
    const [cart, setCart] = useState<{ id: number, name: string, price: number, stock: number | null, img: string, qty: number }[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const inv = await db.getInventory();
                setProducts(inv);
            } catch (err) {
                console.error("Failed to load products", err);
            }
        };
        loadProducts();
    }, []);

    // Modals state
    const [keypadOpen, setKeypadOpen] = useState(false);
    const [activeCartIndex, setActiveCartIndex] = useState<number | null>(null);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showRecallModal, setShowRecallModal] = useState(false);
    const [discountKeypadOpen, setDiscountKeypadOpen] = useState(false);

    // Sale/Customer state
    const [customer, setCustomer] = useState<any | null>(null);
    const [discountType, setDiscountType] = useState<'amt' | 'pct'>('pct');
    const [manualDiscount, setManualDiscount] = useState(0);

    // Auto Discount Logic
    useEffect(() => {
        if (customer) {
            let pct = 0;
            if (customer.tier === 'Gold') pct = 10;
            else if (customer.tier === 'Silver') pct = 5;
            else if (customer.tier === 'Bronze') pct = 2;
            setManualDiscount(pct);
            setDiscountType('pct');
            showToast('info', `Auto-applied ${pct}% ${customer.tier} discount`);
        }
    }, [customer]);

    // Calculations
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const discountAmount = discountType === 'pct' ? (subtotal * manualDiscount / 100) : manualDiscount;
    const taxable = Math.max(0, subtotal - discountAmount);
    const tax = taxable * 0.18;
    const total = taxable + tax;

    const updateQty = (index: number, change: number) => {
        const newCart = [...cart];
        newCart[index].qty = Math.max(1, newCart[index].qty + change);
        setCart(newCart);
    };

    const removeItem = (index: number) => {
        const newCart = cart.filter((_, i) => i !== index);
        setCart(newCart);
    };

    const openKeypad = (index: number) => {
        setActiveCartIndex(index);
        setKeypadOpen(true);
    };

    const handleKeypadEnter = (val: string) => {
        const num = parseFloat(val);
        if (!isNaN(num) && activeCartIndex !== null) {
            const newCart = [...cart];
            if (num <= 0) {
                const filteredCart = newCart.filter((_, i) => i !== activeCartIndex);
                setCart(filteredCart);
            } else {
                newCart[activeCartIndex].qty = num;
                setCart(newCart);
            }
        }
        setKeypadOpen(false);
        setActiveCartIndex(null);
    };

    const handleDiscountEnter = (val: string) => {
        const num = parseFloat(val) || 0;
        setManualDiscount(num);
        setDiscountKeypadOpen(false);
    };

    const addToCart = (product: any) => {
        const existingIdx = cart.findIndex(item => item.id === product.id);
        if (existingIdx >= 0) {
            const newCart = [...cart];
            newCart[existingIdx].qty += 1;
            setCart(newCart);
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const handleHold = async () => {
        if (cart.length === 0) return;
        await db.holdCart({ cart, customer, total });
        setCart([]);
        setCustomer(null);
        setManualDiscount(0);
        showToast('success', 'Sale placed on hold');
    };

    const handleRecall = async (heldData: any) => {
        setCart(heldData.cart);
        setCustomer(heldData.customer);
        await db.removeHeldCart(heldData.id);
        setShowRecallModal(false);
        showToast('success', 'Cart recalled');
    };

    const handleCompleteSale = async (txnData: any) => {
        const txn = {
            customer: customer?.name || 'Walk-in',
            items: cart.length,
            subtotal,
            discount: discountAmount,
            tax,
            total,
            ...txnData
        };
        await db.logTransaction(txn);

        // Update inventory
        for (const item of cart) {
            if (item.stock !== null) await db.updateStock(item.name, -item.qty);
        }

        setCart([]);
        setCustomer(null);
        setManualDiscount(0);
        setShowCheckoutModal(false);
        showToast('success', 'Sale completed successfully!');
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#101a22]">
            <header className="h-16 bg-white dark:bg-[#16222d] border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link to="/" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="font-bold text-lg text-slate-900 dark:text-white">Point of Sale</h1>
                        <p className="text-xs text-slate-500">Main Garage Terminal</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowRecallModal(true)}
                        className="flex items-center gap-1 text-sm font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">history</span> Recall
                    </button>
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold border border-indigo-200">JD</div>
                </div>
            </header>

            <div className="flex-1 p-4 overflow-hidden">
                <div className="h-full grid grid-cols-12 gap-4">
                    {/* Left: Products */}
                    <div className="col-span-8 bg-white dark:bg-[#1e293b] rounded-xl shadow-sm flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 space-y-4">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input type="text" placeholder="Search by name, SKU, or scan barcode..." className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-900 border-none rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {['All', 'Oils', 'Tires', 'Batteries', 'Filters', 'Services'].map(cat => (
                                    <button key={cat} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${cat === 'All' ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>{cat}</button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map(prod => (
                                    <div key={prod.id} onClick={() => addToCart(prod)} className="p-3 rounded-lg border border-transparent hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer transition-all group">
                                        <div className="aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 mb-2 overflow-hidden relative">
                                            <img src={prod.img} alt={prod.name} className="w-full h-full object-cover" />
                                        </div>
                                        <h4 className="font-medium text-sm text-slate-900 dark:text-white leading-tight mb-1">{prod.name}</h4>
                                        <p className="text-xs text-slate-500">{prod.stock ? `Stock: ${prod.stock}` : 'Service'} | ₹{prod.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Cart */}
                    <div className="col-span-4 bg-white dark:bg-[#1e293b] rounded-xl shadow-sm flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                            <h2 className="text-lg font-bold">Current Sale</h2>
                            {customer ? (
                                <div className="flex items-center gap-2">
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-primary-600 leading-none">{customer.name}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">{customer.tier} TIER • {customer.phone}</p>
                                    </div>
                                    <button onClick={() => setCustomer(null)} className="text-slate-400 hover:text-red-500"><span className="material-symbols-outlined text-lg">close</span></button>
                                </div>
                            ) : (
                                <button onClick={() => setShowCustomerModal(true)} className="flex items-center gap-1 text-primary-600 text-sm font-medium hover:underline">
                                    <span className="material-symbols-outlined text-lg">person_add</span> Add Customer
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <span className="material-symbols-outlined text-4xl mb-2">shopping_cart_off</span>
                                    <p className="text-sm">Cart is empty</p>
                                </div>
                            ) : (
                                cart.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
                                        <div className="w-12 h-12 rounded bg-slate-200 shrink-0 overflow-hidden">
                                            <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate text-slate-900 dark:text-white">{item.name}</p>
                                            <p className="text-xs text-slate-500">₹{item.price}</p>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 px-1 py-0.5">
                                            <button className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300" onClick={() => updateQty(idx, -1)}>-</button>
                                            <button className="text-sm font-bold w-8 text-center text-slate-900 dark:text-white hover:text-primary-500 underline decoration-dashed underline-offset-4" onClick={() => openKeypad(idx)}>{item.qty}</button>
                                            <button className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300" onClick={() => updateQty(idx, 1)}>+</button>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm text-slate-900 dark:text-white">₹{item.price * item.qty}</p>
                                            <button className="text-slate-400 hover:text-red-500 p-1" onClick={() => removeItem(idx)}><span className="material-symbols-outlined text-lg">delete</span></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 space-y-2">
                            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                <span>Subtotal</span>
                                <span className="font-medium text-slate-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 group">
                                <div className="flex items-center gap-1">
                                    <span>Discount ({discountType === 'pct' ? `${manualDiscount}%` : `₹${manualDiscount}`})</span>
                                </div>
                                <span className="font-bold text-green-600">- ₹{discountAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                <span>Tax (18%)</span>
                                <span className="font-medium text-slate-900 dark:text-white">₹{tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-3 mt-2">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 pt-4">
                                <button
                                    onClick={handleHold}
                                    disabled={cart.length === 0}
                                    className="py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 disabled:opacity-50"
                                >Hold</button>
                                <button
                                    onClick={() => setDiscountKeypadOpen(true)}
                                    className="py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300"
                                >Discount</button>
                                <button
                                    className="py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300"
                                    onClick={() => { setCart([]); setCustomer(null); setManualDiscount(0); }}
                                >Clear</button>
                            </div>
                            <button
                                onClick={() => setShowCheckoutModal(true)}
                                disabled={cart.length === 0}
                                className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold text-lg shadow-lg flex items-center justify-center gap-2 mt-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined">payment</span> Complete Sale
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <KeypadModal
                isOpen={keypadOpen}
                onClose={() => setKeypadOpen(false)}
                onEnter={handleKeypadEnter}
                title={activeCartIndex !== null ? `Set Qty for ${cart[activeCartIndex]?.name}` : "Enter Quantity"}
            />

            {/* Discount Modal with Type Switch */}
            {discountKeypadOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-xs rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold">Set Discount</h3>
                            <div className="flex bg-slate-200 dark:bg-slate-900 rounded p-1">
                                <button onClick={() => setDiscountType('pct')} className={`px-3 py-1 text-xs font-bold rounded ${discountType === 'pct' ? 'bg-white dark:bg-slate-700 shadow text-primary-600' : 'text-slate-500'}`}>%</button>
                                <button onClick={() => setDiscountType('amt')} className={`px-3 py-1 text-xs font-bold rounded ${discountType === 'amt' ? 'bg-white dark:bg-slate-700 shadow text-primary-600' : 'text-slate-500'}`}>Cash (₹)</button>
                            </div>
                        </div>
                        <KeypadModal
                            isOpen={true}
                            onClose={() => setDiscountKeypadOpen(false)}
                            onEnter={handleDiscountEnter}
                            title={`Enter ${discountType === 'pct' ? 'Percentage' : 'Fixed Cash'}`}
                            initialValue={manualDiscount.toString()}
                        />
                    </div>
                </div>
            )}

            <CustomerSelectionModal
                isOpen={showCustomerModal}
                onClose={() => setShowCustomerModal(false)}
                onSelect={(c) => { setCustomer(c); setShowCustomerModal(false); }}
            />

            <RecallModal
                isOpen={showRecallModal}
                onClose={() => setShowRecallModal(false)}
                onRecall={handleRecall}
            />

            <CheckoutModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                total={total}
                customer={customer}
                onComplete={handleCompleteSale}
            />
        </div>
    );
}
