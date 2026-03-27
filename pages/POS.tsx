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

    // Modals
    const [keypadOpen, setKeypadOpen] = useState(false);
    const [activeCartIndex, setActiveCartIndex] = useState<number | null>(null);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showRecallModal, setShowRecallModal] = useState(false);
    const [discountKeypadOpen, setDiscountKeypadOpen] = useState(false);
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [customItem, setCustomItem] = useState({ name: '', price: '', category: 'Services' });

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

    const handleAddCustomItem = () => {
        if (!customItem.name || !customItem.price) {
            showToast('error', 'Please fill name and price');
            return;
        }
        const priceNum = parseFloat(customItem.price);
        if (isNaN(priceNum) || priceNum < 0) {
            showToast('error', 'Invalid price');
            return;
        }
        const newItem = {
            id: `MANUAL-${Date.now()}`,
            name: customItem.name,
            price: priceNum,
            stock: null,
            img: 'https://placehold.co/200x200/slate/white?text=Custom',
            qty: 1,
            isManual: true,
            category: customItem.category
        };
        setCart([...cart, newItem]);
        setShowCustomModal(false);
        setCustomItem({ name: '', price: '', category: 'Services' });
        showToast('success', 'Custom item added');
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

        for (const item of cart) {
            if (item.isManual) {
                try {
                    await db.saveInventoryItem({
                        name: item.name,
                        sku: `MAN-POS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                        category: item.category || 'Services',
                        vehicle_type: 'All',
                        stock: 0,
                        price: item.price,
                        unit: 'Pcs'
                    });
                } catch (e) {
                    console.error("Failed to save manual item to inventory:", e);
                }
            } else if (item.stock !== null) {
                await db.updateStock(item.name, -item.qty);
            }
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
                    {/* LEFT COLUMN: CUSTOMER & CART */}
                    <div className="col-span-7 flex flex-col gap-4 overflow-hidden">
                        <InlineCustomerSection 
                            selectedCustomer={customer} 
                            onSelect={setCustomer} 
                            onClear={() => setCustomer(null)} 
                        />

                        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
                            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Billing Items</h2>
                                <span className="text-sm font-medium text-slate-500">{cart.length} items</span>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto w-full">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-4xl mb-2">shopping_bag</span>
                                        <p className="text-sm">No items in cart</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left border-collapse">
                                        <thead className="sticky top-0 bg-white dark:bg-[#1e293b] shadow-sm z-10">
                                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Item</th>
                                                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-24">Rate</th>
                                                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-32 text-center">Quantity</th>
                                                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-24 text-right">Total</th>
                                                <th className="py-3 px-4 w-12"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cart.map((item, idx) => (
                                                <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded bg-slate-200 shrink-0 overflow-hidden">
                                                                <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                                                            </div>
                                                            <span className="font-medium text-sm text-slate-900 dark:text-white line-clamp-1">{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">Rs. {item.price}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center justify-center gap-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 w-max mx-auto">
                                                            <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400" onClick={() => updateQty(idx, -1)}>-</button>
                                                            <button className="text-sm font-bold w-6 text-center text-slate-900 dark:text-white hover:text-primary-500 hover:underline" onClick={() => openKeypad(idx)}>{item.qty}</button>
                                                            <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400" onClick={() => updateQty(idx, 1)}>+</button>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-white text-right">Rs. {item.price * item.qty}</td>
                                                    <td className="py-3 px-4 text-right">
                                                        <button className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeItem(idx)}>
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: INVENTORY & POS SUMMARY */}
                    <div className="col-span-5 flex flex-col gap-4 overflow-hidden">
                        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
                            <div className="p-3 border-b border-slate-200 dark:border-slate-700 space-y-3 shrink-0">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                        <input 
                                            type="text" 
                                            placeholder="Search items..." 
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 dark:bg-slate-900 border-none rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow" 
                                        />
                                    </div>
                                    <button onClick={() => setShowCustomModal(true)} className="px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors whitespace-nowrap" title="Add Custom Item">
                                        <span className="material-symbols-outlined text-lg">add_circle</span>
                                    </button>
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
                            
                            <div className="flex-1 overflow-y-auto p-3">
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    {filteredProducts.map(prod => (
                                        <div key={prod.id} onClick={() => addToCart(prod)} className="p-2 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer transition-all group flex flex-col">
                                            <div className="aspect-square rounded shadow-sm bg-slate-100 dark:bg-slate-800 mb-2 overflow-hidden relative">
                                                <img src={prod.img} alt={prod.name} className="w-full h-full object-cover" />
                                                {prod.stock !== null && prod.stock <= 5 && (
                                                    <span className="absolute top-1 right-1 bg-red-400 text-white text-[10px] font-bold px-1 py-0.5 rounded shadow-sm">Low</span>
                                                )}
                                            </div>
                                            <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight mb-1 line-clamp-2 flex-1">{prod.name}</h4>
                                            <div className="flex justify-between items-end mt-auto pt-1 border-t border-transparent group-hover:border-primary-100 dark:group-hover:border-primary-800">
                                                <span className="text-primary-600 dark:text-primary-400 font-black text-sm">Rs.{prod.price}</span>
                                                <span className="text-[10px] uppercase font-bold text-slate-400">{prod.stock ? `${prod.stock} instock` : 'Service'}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <div className="col-span-full py-8 text-center text-slate-400 text-sm font-medium">No items found.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 shrink-0 flex flex-col gap-3">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-slate-900 dark:text-white">Rs. {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 font-medium">
                                    <div className="flex items-center gap-1">
                                        <span>Discount</span>
                                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                                            {discountType === 'pct' ? `${manualDiscount}%` : `Rs. ${manualDiscount}`}
                                        </span>
                                    </div>
                                    <span className="text-green-600 dark:text-green-400">- Rs. {discountAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 font-medium">
                                    <span>Tax (18%)</span>
                                    <span className="text-slate-900 dark:text-white">Rs. {tax.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-end border-t border-slate-200 dark:border-slate-700 pt-3">
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Due</span>
                                <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">Rs. {total.toFixed(2)}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 pt-2">
                                <button
                                    onClick={handleHold}
                                    disabled={cart.length === 0}
                                    className="py-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50 transition-colors"
                                >Hold</button>
                                <button
                                    onClick={() => setDiscountKeypadOpen(true)}
                                    className="py-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                                >Discount</button>
                                <button
                                    className="py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg text-sm font-bold text-red-600 dark:text-red-400 transition-colors"
                                    onClick={() => { setCart([]); setCustomer(null); setManualDiscount(0); }}
                                >Clear</button>
                            </div>
                            
                            <button
                                onClick={() => setShowCheckoutModal(true)}
                                disabled={cart.length === 0}
                                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none mt-1"
                            >
                                <span className="material-symbols-outlined">payments</span> 
                                Complete Sale
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <KeypadModal
                isOpen={keypadOpen}
                onClose={() => setKeypadOpen(false)}
                onEnter={handleKeypadEnter}
                title={activeCartIndex !== null ? `Qty for ${cart[activeCartIndex]?.name}` : "Quantity"}
            />

            {discountKeypadOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
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
                            onEnter={handleDiscountEnter}
                            title={`Enter ${discountType === 'pct' ? 'Percentage' : 'Fixed Cash'}`}
                            initialValue={manualDiscount.toString()}
                        />
                    </div>
                </div>
            )}

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

            {showCustomModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Custom Item</h3>
                            <button onClick={() => setShowCustomModal(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Item Name</label>
                                <input
                                    type="text"
                                    value={customItem.name}
                                    onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="e.g. Emergency Towing"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Price (Rs.)</label>
                                <input
                                    type="number"
                                    value={customItem.price}
                                    onChange={(e) => setCustomItem({ ...customItem, price: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="0.00"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                <select
                                    value={customItem.category}
                                    onChange={(e) => setCustomItem({ ...customItem, category: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    <option value="Services">Services</option>
                                    <option value="Misc">Misc</option>
                                    <option value="Oils">Oils</option>
                                    <option value="Filters">Filters</option>
                                    <option value="Tires">Tires</option>
                                    <option value="Batteries">Batteries</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
                            <button onClick={() => setShowCustomModal(false)} className="px-5 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-bold transition-colors">Cancel</button>
                            <button onClick={handleAddCustomItem} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold transition-colors shadow-sm">Add Item</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
