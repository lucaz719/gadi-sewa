
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/db';
import { useToast } from '../App';
import { KeypadModal } from '../components/pos/KeypadModal';
import { RecallModal } from '../components/pos/RecallModal';
import { CheckoutModal } from '../components/pos/CheckoutModal';
import { CustomerSelectionModal } from '../components/pos/CustomerSelectionModal';

// Products are now fetched from the database in the POS component

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
                                        <p className="text-xs text-slate-500">{prod.stock ? `Stock: ${prod.stock}` : 'Service'} | Rp. {prod.price}</p>
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
                                            <p className="text-xs text-slate-500">Rs. {item.price}</p>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 px-1 py-0.5">
                                            <button className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300" onClick={() => updateQty(idx, -1)}>-</button>
                                            <button className="text-sm font-bold w-8 text-center text-slate-900 dark:text-white hover:text-primary-500 underline decoration-dashed underline-offset-4" onClick={() => openKeypad(idx)}>{item.qty}</button>
                                            <button className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300" onClick={() => updateQty(idx, 1)}>+</button>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm text-slate-900 dark:text-white">Rs. {item.price * item.qty}</p>
                                            <button className="text-slate-400 hover:text-red-500 p-1" onClick={() => removeItem(idx)}><span className="material-symbols-outlined text-lg">delete</span></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 space-y-2">
                            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                <span>Subtotal</span>
                                <span className="font-medium text-slate-900 dark:text-white">Rs. {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 group">
                                <div className="flex items-center gap-1">
                                    <span>Discount ({discountType === 'pct' ? `${manualDiscount}%` : `Rs. {manualDiscount}`})</span>
                                </div>
                                <span className="font-bold text-green-600">- Rs. {discountAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                <span>Tax (18%)</span>
                                <span className="font-medium text-slate-900 dark:text-white">Rs. {tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-3 mt-2">
                                <span>Total</span>
                                <span>Rs. {total.toFixed(2)}</span>
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
                                <button onClick={() => setDiscountType('amt')} className={`px-3 py-1 text-xs font-bold rounded ${discountType === 'amt' ? 'bg-white dark:bg-slate-700 shadow text-primary-600' : 'text-slate-500'}`}>Cash (Rs. )</button>
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
