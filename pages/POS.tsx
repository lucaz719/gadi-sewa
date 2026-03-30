import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/db';
import { useToast } from '../App';
import { KeypadModal } from '../components/pos/KeypadModal';
import { RecallModal } from '../components/pos/RecallModal';
import { CheckoutModal } from '../components/pos/CheckoutModal';
import { InlineCustomerSection } from '../components/pos/InlineCustomerSection';

export default function POS() {
    const { showToast } = useToast();
    const [products, setProducts] = useState<any[]>([]);
    const [cart, setCart] = useState<{ id: string | number, name: string, price: number, stock: number | null, img: string, qty: number, isManual?: boolean, category?: string }[]>([]);
    const [customer, setCustomer] = useState<any | null>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    // Excel-like Draft Row
    const [draftRow, setDraftRow] = useState({ name: '', price: '', qty: '1' });

    // Modals
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showRecallModal, setShowRecallModal] = useState(false);
    const [discountKeypadOpen, setDiscountKeypadOpen] = useState(false);

    // Discount
    const [discountType, setDiscountType] = useState<'amt' | 'pct'>('pct');
    const [manualDiscount, setManualDiscount] = useState(0);

    // Initial load
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

    useEffect(() => {
        if (customer) {
            let pct = 0;
            if (customer.tier === 'Gold') pct = 10;
            else if (customer.tier === 'Silver') pct = 5;
            else if (customer.tier === 'Bronze') pct = 2;
            setManualDiscount(pct);
            setDiscountType('pct');
            showToast('info', `Auto-applied ${pct}% ${customer.tier} discount`);
        } else {
            setManualDiscount(0);
        }
    }, [customer]);

    // Derived states
    const filteredProducts = products.filter(p => {
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const discountAmount = discountType === 'pct' ? (subtotal * manualDiscount / 100) : manualDiscount;
    const taxable = Math.max(0, subtotal - discountAmount);
    const tax = taxable * 0.18;
    const total = taxable + tax;

    // Excel Editing Logic
    const updateCartItem = (index: number, field: string, value: any) => {
        const newCart = [...cart];
        if (field === 'qty') {
            newCart[index].qty = Math.max(1, parseFloat(value) || 1);
        } else if (field === 'price') {
            newCart[index].price = Math.max(0, parseFloat(value) || 0);
        } else if (field === 'name') {
            newCart[index].name = value;
        }
        setCart(newCart);
    };

    const removeItem = (index: number) => {
        const newCart = cart.filter((_, i) => i !== index);
        setCart(newCart);
    };

    const handleAddFromDraft = () => {
        if (!draftRow.name) return;
        
        const priceNum = parseFloat(draftRow.price) || 0;
        const qtyNum = parseFloat(draftRow.qty) || 1;
        
        const newItem = {
            id: `MANUAL-${Date.now()}`,
            name: draftRow.name,
            price: priceNum,
            stock: null,
            img: 'https://placehold.co/200x200/slate/white?text=Custom',
            qty: qtyNum,
            isManual: true,
            category: 'Services'
        };
        
        setCart([...cart, newItem]);
        setDraftRow({ name: '', price: '', qty: '1' });
        showToast('success', 'Item added to bill');
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
        const user = db.getAuthUser();
        const txn = {
            type: "Income",
            amount: total,
            category: "POS Sale",
            description: `Sale to ${customer?.name || 'Walk-in'} - ${cart.length} items (${txnData.method})`,
            enterprise_id: user?.enterprise_id
        };
        
        try {
            await db.logTransaction(txn);
        } catch (e) {
            console.error("Failed to log financial transaction:", e);
            // We continue with inventory sync even if transaction logging fails for now
        }

        // Auto-save manual items to inventory
        for (const item of cart) {
            if (item.id.toString().startsWith('MANUAL-') || item.isManual) {
                try {
                    await db.saveInventoryItem({
                        name: item.name,
                        sku: `POS-AUTO-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                        category: item.category || 'Services',
                        vehicle_type: 'All',
                        stock: 0,
                        price: item.price,
                        unit: 'Pcs'
                    });
                } catch (e) {
                    console.error("Failed to sync item to inventory:", e);
                }
            } else if (item.stock !== null) {
                try {
                    await db.updateStock(item.id.toString(), -item.qty);
                } catch (e) {
                    console.error("Failed to update stock:", e);
                }
            }
        }

        setCart([]);
        setCustomer(null);
        setManualDiscount(0);
        setShowCheckoutModal(false);
        showToast('success', 'Sale completed! New items synced to inventory.');
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
                        <p className="text-xs text-slate-500">Express Billing Terminal</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowRecallModal(true)}
                        className="flex items-center gap-1 text-sm font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">history</span> Recall
                    </button>
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold border border-indigo-200 uppercase">GS</div>
                </div>
            </header>

            <div className="flex-1 p-4 overflow-hidden">
                <div className="h-full grid grid-cols-12 gap-4">
                    {/* LEFT COLUMN: CUSTOMER & EXCEL-LIKE BILLING */}
                    <div className="col-span-7 flex flex-col gap-4 overflow-hidden">
                        <InlineCustomerSection 
                            selectedCustomer={customer} 
                            onSelect={setCustomer} 
                            onClear={() => setCustomer(null)} 
                        />

                        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
                            <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Billing Section (Excel Mode)</h2>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">EDITABLE GRID</span>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto w-full">
                                <table className="w-full text-left border-collapse table-fixed">
                                    <thead className="sticky top-0 bg-white dark:bg-[#1e293b] shadow-sm z-10">
                                        <tr className="border-b border-slate-200 dark:border-slate-700 font-mono">
                                            <th className="py-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-1/2">Item Description</th>
                                            <th className="py-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24">Rate (Rs.)</th>
                                            <th className="py-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-20 text-center">Qty</th>
                                            <th className="py-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-32 text-right">Total</th>
                                            <th className="py-2 px-4 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.length === 0 && !draftRow.name && (
                                            <tr>
                                                <td colSpan={5} className="py-20 text-center text-slate-400">
                                                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-20">edit_note</span>
                                                    <p className="text-sm">Start typing below to add items...</p>
                                                </td>
                                            </tr>
                                        )}
                                        {cart.map((item, idx) => (
                                            <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="py-1 px-2">
                                                    <input 
                                                        type="text" 
                                                        value={item.name} 
                                                        onChange={(e) => updateCartItem(idx, 'name', e.target.value)}
                                                        className="w-full bg-transparent px-2 py-1.5 focus:bg-white dark:focus:bg-slate-900 rounded outline-none border border-transparent focus:border-primary-300 dark:focus:border-primary-700 text-sm font-medium text-slate-900 dark:text-white"
                                                    />
                                                </td>
                                                <td className="py-1 px-2">
                                                    <input 
                                                        type="number" 
                                                        value={item.price} 
                                                        onChange={(e) => updateCartItem(idx, 'price', e.target.value)}
                                                        className="w-full bg-transparent px-2 py-1.5 focus:bg-white dark:focus:bg-slate-900 rounded outline-none border border-transparent focus:border-primary-300 dark:focus:border-primary-700 text-sm font-medium text-slate-600 dark:text-slate-300"
                                                    />
                                                </td>
                                                <td className="py-1 px-2">
                                                    <input 
                                                        type="number" 
                                                        value={item.qty} 
                                                        onChange={(e) => updateCartItem(idx, 'qty', e.target.value)}
                                                        className="w-full bg-transparent px-2 py-1.5 focus:bg-white dark:focus:bg-slate-900 rounded outline-none border border-transparent focus:border-primary-300 dark:focus:border-primary-700 text-sm font-bold text-center text-slate-900 dark:text-white"
                                                    />
                                                </td>
                                                <td className="py-1 px-4 text-sm font-bold text-slate-900 dark:text-white text-right font-mono">
                                                   Rs.{(item.price * item.qty).toFixed(2)}
                                                </td>
                                                <td className="py-1 px-2 text-right">
                                                    <button className="text-slate-300 hover:text-red-500 transition-colors" onClick={() => removeItem(idx)}>
                                                        <span className="material-symbols-outlined text-lg">close</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        
                                        {/* EXCEL DRAFT ROW - AUTO ADD */}
                                        <tr className="bg-primary-50/30 dark:bg-primary-900/10 border-b border-primary-100 dark:border-primary-900/50">
                                            <td className="py-1 px-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="+ New Item / Service..."
                                                    value={draftRow.name}
                                                    onChange={(e) => setDraftRow({ ...draftRow, name: e.target.value })}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddFromDraft()}
                                                    className="w-full bg-transparent px-2 py-1.5 rounded outline-none text-sm font-bold text-primary-700 dark:text-primary-400 placeholder:text-primary-300 dark:placeholder:text-primary-900/50"
                                                />
                                            </td>
                                            <td className="py-1 px-2">
                                                <input 
                                                    type="number" 
                                                    placeholder="0"
                                                    value={draftRow.price}
                                                    onChange={(e) => setDraftRow({ ...draftRow, price: e.target.value })}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddFromDraft()}
                                                    className="w-full bg-transparent px-2 py-1.5 rounded outline-none text-sm font-medium text-primary-600"
                                                />
                                            </td>
                                            <td className="py-1 px-2">
                                                <input 
                                                    type="number" 
                                                    value={draftRow.qty}
                                                    onChange={(e) => setDraftRow({ ...draftRow, qty: e.target.value })}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddFromDraft()}
                                                    className="w-full bg-transparent px-2 py-1.5 rounded outline-none text-sm font-bold text-center text-primary-600"
                                                />
                                            </td>
                                            <td className="py-1 px-4 text-sm font-bold text-primary-700 dark:text-primary-400 text-right font-mono">
                                               Rs.{(parseFloat(draftRow.price) * parseFloat(draftRow.qty) || 0).toFixed(2)}
                                            </td>
                                            <td className="py-1 px-2 text-right">
                                                <button 
                                                    onClick={handleAddFromDraft}
                                                    className="text-primary-500 hover:text-primary-700 transition-colors"
                                                    disabled={!draftRow.name}
                                                >
                                                    <span className="material-symbols-outlined text-lg">add_box</span>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: INVENTORY & POS SUMMARY */}
                    <div className="col-span-5 flex flex-col gap-4 overflow-hidden">
                        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
                            <div className="p-3 border-b border-slate-200 dark:border-slate-700 space-y-3 shrink-0">
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                    <input 
                                        type="text" 
                                        placeholder="Quick Select from Inventory..." 
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 dark:bg-slate-900 border-none rounded-lg focus:ring-1 focus:ring-primary-500 outline-none transition-shadow" 
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                    {['All', 'Oils', 'Tires', 'Batteries', 'Filters', 'Services'].map(cat => (
                                        <button 
                                            key={cat} 
                                            onClick={() => setActiveCategory(cat)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-primary-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-3 text-center">
                                {filteredProducts.length === 0 ? (
                                    <p className="text-slate-400 text-xs mt-10 italic">No inventory matches.</p>
                                ) : (
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                        {filteredProducts.map(prod => (
                                            <div key={prod.id} onClick={() => addToCart(prod)} className="p-2 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer transition-all group flex flex-col">
                                                <div className="aspect-square rounded shadow-sm bg-slate-100 dark:bg-slate-800 mb-2 overflow-hidden relative">
                                                    <img src={prod.img} alt={prod.name} className="w-full h-full object-cover" />
                                                </div>
                                                <h4 className="font-bold text-[11px] text-slate-900 dark:text-white leading-tight mb-1 line-clamp-1">{prod.name}</h4>
                                                <div className="flex justify-between items-center mt-auto">
                                                    <span className="text-primary-600 dark:text-primary-400 font-bold text-xs">Rs.{prod.price}</span>
                                                    <span className="text-[9px] uppercase font-bold text-slate-400">{prod.stock ? `${prod.stock} in` : 'Service'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 shrink-0 flex flex-col gap-3">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                                    <span>Subtotal</span>
                                    <span className="text-slate-900 dark:text-white">Rs. {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                                    <div className="flex items-center gap-1">
                                        <span>Discount</span>
                                        <button onClick={() => setDiscountKeypadOpen(true)} className="text-[10px] bg-primary-100 dark:bg-primary-900/30 text-primary-600 px-1.5 py-0.5 rounded hover:bg-primary-200 transition-colors">
                                            {discountType === 'pct' ? `${manualDiscount}%` : `Rs. ${manualDiscount}`}
                                        </button>
                                    </div>
                                    <span className="text-green-600 dark:text-green-400">- Rs. {discountAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                                    <span>Gst Tax (18%)</span>
                                    <span className="text-slate-900 dark:text-white">Rs. {tax.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-end border-t border-slate-200 dark:border-slate-700 pt-3">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
                                <span className="text-4xl font-black text-slate-900 dark:text-white leading-none font-mono">Rs.{total.toFixed(0)}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2">
                                <button
                                    onClick={handleHold}
                                    disabled={cart.length === 0}
                                    className="py-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors disabled:opacity-50"
                                >Put On Hold</button>
                                <button
                                    className="py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 rounded-lg text-xs font-black uppercase tracking-widest text-red-500 transition-colors"
                                    onClick={() => { setCart([]); setCustomer(null); setManualDiscount(0); }}
                                >Empty Bill</button>
                            </div>
                            
                            <button
                                onClick={() => setShowCheckoutModal(true)}
                                disabled={cart.length === 0}
                                className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-black text-xl shadow-xl shadow-primary-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 mt-1"
                            >
                                <span className="material-symbols-outlined text-2xl">receipt_long</span> 
                                Complete Sale
                            </button>
                        </div>
                    </div>
                </div>
            </div>

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

            {discountKeypadOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-xs rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold">Set Discount</h3>
                            <div className="flex bg-slate-200 dark:bg-slate-900 rounded p-1">
                                <button onClick={() => setDiscountType('pct')} className={`px-3 py-1 text-xs font-bold rounded ${discountType === 'pct' ? 'bg-white dark:bg-slate-700 shadow text-primary-600' : 'text-slate-500'}`}>%</button>
                                <button onClick={() => setDiscountType('amt')} className={`px-3 py-1 text-xs font-bold rounded ${discountType === 'amt' ? 'bg-white dark:bg-slate-700 shadow text-primary-600' : 'text-slate-500'}`}>Rs.</button>
                            </div>
                        </div>
                        <KeypadModal
                            isOpen={true}
                            onClose={() => setDiscountKeypadOpen(false)}
                            onEnter={(val) => {
                                setManualDiscount(parseFloat(val) || 0);
                                setDiscountKeypadOpen(false);
                            }}
                            title={`Enter ${discountType === 'pct' ? 'Percentage' : 'Fixed Cash'}`}
                            initialValue={manualDiscount.toString()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
