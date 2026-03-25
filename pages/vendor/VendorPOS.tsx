
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/db';
import { useToast } from '../../App';

const vendorProducts = [
  { id: 1, name: 'Brake Pads (Bulk Pack)', price: 15000, stock: 50, img: 'https://images.unsplash.com/photo-1600161599939-23d16036198c?w=150&h=150&fit=crop' },
  { id: 2, name: 'Engine Oil Drum (200L)', price: 45000, stock: 12, img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=150&h=150&fit=crop' },
  { id: 3, name: 'Oil Filters (Box of 50)', price: 8500, stock: 100, img: 'https://images.unsplash.com/photo-1517059478735-9b73637b6c5e?w=150&h=150&fit=crop' },
  { id: 4, name: 'Spark Plugs (Set of 100)', price: 12000, stock: 80, img: 'https://images.unsplash.com/photo-1615900119312-2acd3a71f3aa?w=150&h=150&fit=crop' },
  { id: 5, name: 'Clutch Plates (Universal)', price: 3500, stock: 40, img: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=150&h=150&fit=crop' },
  { id: 6, name: 'Headlight Assembly', price: 2200, stock: 60, img: 'https://images.unsplash.com/photo-1487754180477-1c43cd8a77e2?w=150&h=150&fit=crop' },
];

const MOCK_GARAGES = [
    { id: 1, name: 'City Auto Works', tier: 'Platinum', discount: 15 },
    { id: 2, name: 'Quick Fix Mechanics', tier: 'Gold', discount: 10 },
    { id: 3, name: 'Star Service Center', tier: 'Silver', discount: 5 },
    { id: 4, name: 'New Garage Pro', tier: 'Standard', discount: 0 },
];

const KeypadModal = ({ isOpen, onClose, onEnter, title = "Enter Value", initialValue = "" }: { isOpen: boolean, onClose: () => void, onEnter: (val: string) => void, title?: string, initialValue?: string }) => {
  const [value, setValue] = useState(initialValue);
  useEffect(() => { if (isOpen) setValue(initialValue); }, [isOpen, initialValue]);

  const handlePress = (key: string | number) => {
    if (key === 'clear') setValue("");
    else if (key === 'backspace') setValue(prev => prev.slice(0, -1));
    else if (key === '.') { if (!value.includes('.')) setValue(prev => prev + key); }
    else setValue(prev => prev + key.toString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-white dark:bg-[#1e293b] w-full max-w-xs rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-lg">{title}</h3>
                <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-slate-900 text-right text-3xl font-mono font-bold tracking-widest h-20 flex items-center justify-end border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                {value || <span className="text-slate-400">0</span>}
            </div>
            <div className="grid grid-cols-3 gap-1 p-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'backspace'].map((key) => (
                    <button key={key} onClick={() => handlePress(key)} className={`h-16 text-2xl font-bold rounded-lg active:scale-95 flex items-center justify-center ${key === 'backspace' ? 'bg-red-50 text-red-600' : 'bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-sm'}`}>
                        {key === 'backspace' ? <span className="material-symbols-outlined">backspace</span> : key}
                    </button>
                ))}
            </div>
            <div className="p-2 grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800 border-t dark:border-slate-700">
                 <button onClick={() => handlePress('clear')} className="py-3 font-bold text-slate-600 bg-slate-200 rounded-lg">Clear</button>
                 <button onClick={() => onEnter(value)} className="py-3 font-bold text-white bg-purple-600 rounded-lg shadow-md">Enter</button>
            </div>
        </div>
    </div>
  );
};

const RecallModal = ({ isOpen, onClose, onRecall }: { isOpen: boolean, onClose: () => void, onRecall: (held: any) => void }) => {
    const [heldCarts, setHeldCarts] = useState<any[]>([]);
    useEffect(() => { if (isOpen) setHeldCarts(db.getHeldCarts()); }, [isOpen]);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl border dark:border-slate-700 overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-lg">Recall Held Orders</h3>
                    <button onClick={onClose}><span className="material-symbols-outlined text-slate-400">close</span></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {heldCarts.length === 0 ? <p className="text-center text-slate-500 py-8 italic">No orders on hold.</p> : 
                        heldCarts.map((h) => (
                            <div key={h.id} className="p-4 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center hover:border-purple-500 group transition-all">
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">Rs. {h.total.toLocaleString()}</p>
                                    <p className="text-xs text-slate-500">{h.customer?.name || 'Quick Sale'} • {h.cart.length} items</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{new Date(h.heldAt).toLocaleString()}</p>
                                </div>
                                <button onClick={() => onRecall(h)} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold">Recall</button>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

const GarageSelectModal = ({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (g: any) => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-xl shadow-2xl overflow-hidden">
                <div className="p-4 border-b dark:border-slate-700 font-bold">Select Partner Garage</div>
                <div className="p-2 max-h-80 overflow-y-auto">
                    {MOCK_GARAGES.map(g => (
                        <button key={g.id} onClick={() => onSelect(g)} className="w-full text-left p-3 hover:bg-purple-50 dark:hover:bg-purple-900/10 rounded-lg flex justify-between items-center group">
                            <div>
                                <p className="font-bold">{g.name}</p>
                                <p className="text-[10px] uppercase font-bold text-purple-600">{g.tier} Tier • {g.discount}% Base Discount</p>
                            </div>
                            <span className="material-symbols-outlined text-purple-500 opacity-0 group-hover:opacity-100">chevron_right</span>
                        </button>
                    ))}
                </div>
                <div className="p-4 border-t dark:border-slate-700 text-center">
                    <button onClick={onClose} className="text-sm text-slate-500 font-medium">Close</button>
                </div>
            </div>
        </div>
    );
};

const CheckoutModal = ({ isOpen, onClose, total, onComplete, customer }: { isOpen: boolean, onClose: () => void, total: number, onComplete: (txn: any) => void, customer: any }) => {
    const [isSplit, setIsSplit] = useState(false);
    const [method, setMethod] = useState('Cash');
    const [splitMethod, setSplitMethod] = useState('Card');
    const [received, setReceived] = useState('');
    const [splitAmt, setSplitAmt] = useState('');
    
    if (!isOpen) return null;

    const rcv = parseFloat(received) || 0;
    const splitV = parseFloat(splitAmt) || 0;
    const changeDue = !isSplit ? (method === 'Cash' ? Math.max(0, rcv - total) : 0) : Math.max(0, (rcv + splitV) - total);
    const isDigital = method === 'eSewa' || method === 'Khalti' || (isSplit && (splitMethod === 'eSewa' || splitMethod === 'Khalti'));

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-purple-50 dark:bg-purple-900/10">
                    <h3 className="font-bold text-purple-900 dark:text-purple-100">Finalize Wholesale Order</h3>
                    <div className="flex gap-2">
                        <button onClick={() => setIsSplit(!isSplit)} className={`px-2 py-1 rounded text-[10px] font-bold ${isSplit ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'}`}>SPLIT</button>
                        <button onClick={onClose}><span className="material-symbols-outlined text-slate-400">close</span></button>
                    </div>
                </div>
                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                    <div className="text-center">
                        <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Grand Total</p>
                        <p className="text-4xl font-black text-slate-900 dark:text-white">Rs. {total.toLocaleString()}</p>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase">{isSplit ? 'Part 1: Payment' : 'Payment Method'}</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['Cash', 'Card', 'eSewa', 'Khalti'].map(m => (
                                <button key={m} onClick={() => setMethod(m)} className={`py-3 rounded-xl border-2 font-bold flex flex-col items-center gap-1 ${method === m ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}>
                                    <span className="material-symbols-outlined text-xl">{m === 'Cash' ? 'payments' : m === 'Card' ? 'credit_card' : 'qr_code_2'}</span>
                                    <span className="text-[10px]">{m}</span>
                                </button>
                            ))}
                        </div>
                        {(method === 'Cash' || isSplit) && (
                            <input type="number" autoFocus value={received} onChange={e => setReceived(e.target.value)} className="w-full text-2xl font-mono p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-right outline-none focus:border-purple-500" placeholder="0.00" />
                        )}
                    </div>

                    {isSplit && (
                        <div className="space-y-4 pt-4 border-t dark:border-slate-700">
                            <div className="flex justify-between items-center text-xs font-bold text-orange-600 uppercase">
                                <span>Remaining Balance</span>
                                <span>Rs. {(total - rcv).toLocaleString()}</span>
                            </div>
                            <label className="block text-xs font-bold text-slate-500 uppercase">Part 2: Balance via</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Card', 'eSewa', 'Khalti'].map(m => (
                                    <button key={m} onClick={() => setSplitMethod(m)} className={`py-2 rounded-lg border-2 font-bold ${splitMethod === m ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}>
                                        <span className="text-[10px]">{m}</span>
                                    </button>
                                ))}
                            </div>
                            <input type="number" value={splitAmt} onChange={e => setSplitAmt(e.target.value)} className="w-full text-xl font-mono p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-right outline-none" placeholder="Enter split amount" />
                        </div>
                    )}

                    {isDigital && (
                        <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 animate-fade-in">
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Scan to Pay Vendor ({isSplit ? splitMethod : method})</p>
                            <div className="w-32 h-32 bg-white p-2 rounded-lg shadow-sm border">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GadiSewa_Vendor_Payment_${total}`} className="w-full h-full" alt="Merchant QR" />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 italic font-medium">Merchant ID: GSV-WH-001</p>
                        </div>
                    )}

                    <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30">
                        <span className="font-bold text-green-700 dark:text-green-300 uppercase text-xs">Change to Return</span>
                        <span className="text-2xl font-black text-green-600">Rs. {changeDue.toLocaleString()}</span>
                    </div>
                </div>
                <div className="p-4 border-t dark:border-slate-700">
                    <button 
                        onClick={() => onComplete({ method: isSplit ? `Split (${method}+${splitMethod})` : method, tendered: rcv + splitV, change: changeDue, isSplit })}
                        disabled={(rcv + splitV) < total && (method === 'Cash' || isSplit)}
                        className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined">print</span> Complete & Print Invoice
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function VendorPOS() {
  const { showToast } = useToast();
  const [cart, setCart] = useState<{ id: number, name: string, price: number, stock: number, img: string, qty: number }[]>([]);
  
  // Modals state
  const [qtyKeypad, setQtyKeypad] = useState({ open: false, index: -1 });
  const [discKeypad, setDiscKeypad] = useState(false);
  const [recallOpen, setRecallOpen] = useState(false);
  const [garageOpen, setGarageOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Cart attributes
  const [customer, setCustomer] = useState<any>(null);
  const [discountType, setDiscountType] = useState<'amt' | 'pct'>('pct');
  const [manualDiscount, setManualDiscount] = useState(0);

  // Auto-apply tier discount
  useEffect(() => {
    if (customer) {
        setManualDiscount(customer.discount);
        setDiscountType('pct');
        showToast('info', `Auto-applied ${customer.discount}% ${customer.tier} tier discount`);
    }
  }, [customer]);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discountVal = discountType === 'pct' ? (subtotal * manualDiscount / 100) : manualDiscount;
  const taxable = Math.max(0, subtotal - discountVal);
  const tax = taxable * 0.18;
  const total = taxable + tax;

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

  const handleHold = () => {
    if (cart.length === 0) return;
    db.holdCart({ cart, customer, total, subtotal, discountVal, tax, manualDiscount, discountType });
    setCart([]); setCustomer(null); setManualDiscount(0);
    showToast('success', 'Wholesale order put on hold');
  };

  const handleRecall = (held: any) => {
      setCart(held.cart);
      setCustomer(held.customer);
      setManualDiscount(held.manualDiscount || 0);
      setDiscountType(held.discountType || 'pct');
      db.removeHeldCart(held.id);
      setRecallOpen(false);
      showToast('success', 'Order recalled');
  };

  const finalizeSale = (txnData: any) => {
      const txn = {
          customer: customer?.name || 'Quick Sale',
          items: cart.length,
          subtotal,
          discount: discountVal,
          tax,
          total,
          isVendorSale: true,
          ...txnData
      };
      db.logTransaction(txn);
      // Mock inventory sync
      cart.forEach(item => db.updateStock(item.name, -item.qty));
      
      setCart([]); setCustomer(null); setManualDiscount(0); setCheckoutOpen(false);
      showToast('success', 'Sale recorded in Vendor Ledger');
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#101a22]">
       <header className="h-16 bg-white dark:bg-[#16222d] border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <Link to="/vendor" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
             </Link>
             <div>
               <h1 className="font-bold text-lg text-slate-900 dark:text-white uppercase tracking-tight">Vendor Ledger POS</h1>
               <p className="text-[10px] text-slate-500 font-bold uppercase">Authorized Warehouse Distribution</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => setRecallOpen(true)} className="flex items-center gap-1 text-sm font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors">
                <span className="material-symbols-outlined text-lg">history</span> Recall
             </button>
             <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold border border-purple-200">AP</div>
          </div>
       </header>

       <div className="flex-1 p-4 overflow-hidden">
          <div className="h-full grid grid-cols-12 gap-4">
             {/* Product Browser */}
             <div className="col-span-8 bg-white dark:bg-[#1e293b] rounded-xl shadow-sm flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 space-y-4 bg-slate-50 dark:bg-slate-800/20">
                   <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                      <input type="text" placeholder="Search bulk items by SKU or Name..." className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border-none rounded-lg focus:ring-2 focus:ring-purple-500 outline-none shadow-sm" />
                   </div>
                   <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {['All Bulk', 'Engine Parts', 'Transmission', 'Brakes', 'Lubricants'].map(cat => (
                          <button key={cat} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${cat === 'All Bulk' ? 'bg-purple-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>{cat}</button>
                      ))}
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {vendorProducts.map(prod => (
                         <div key={prod.id} onClick={() => addToCart(prod)} className="p-3 rounded-xl border border-transparent hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-pointer transition-all group bg-slate-50 dark:bg-slate-800/30">
                            <div className="aspect-square rounded-lg bg-white dark:bg-slate-800 mb-2 overflow-hidden border border-slate-100 dark:border-slate-700">
                               <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 h-8">{prod.name}</h4>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">Stock: {prod.stock} Units</p>
                            <p className="text-sm font-black text-purple-600">Rs. {prod.price.toLocaleString()}</p>
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Sidebar: Cart & Totals */}
             <div className="col-span-4 bg-white dark:bg-[#1e293b] rounded-xl shadow-lg flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-purple-50 dark:bg-purple-900/10">
                   <h2 className="text-lg font-black text-purple-800 dark:text-purple-200">Wholesale Cart</h2>
                   {customer ? (
                       <div className="flex items-center gap-2">
                           <div className="text-right">
                               <p className="text-sm font-bold text-purple-600 leading-none">{customer.name}</p>
                               <p className="text-[10px] text-slate-500 font-bold uppercase">{customer.tier} TIER • {customer.discount}% OFF</p>
                           </div>
                           <button onClick={() => setCustomer(null)} className="text-slate-400 hover:text-red-500"><span className="material-symbols-outlined text-lg">close</span></button>
                       </div>
                   ) : (
                       <button onClick={() => setGarageOpen(true)} className="flex items-center gap-1 text-purple-600 text-xs font-bold hover:underline bg-white px-2 py-1 rounded shadow-sm">
                          <span className="material-symbols-outlined text-lg">storefront</span> Select Garage
                       </button>
                   )}
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900/50">
                   {cart.length === 0 ? (
                       <div className="h-full flex flex-col items-center justify-center text-slate-400">
                           <span className="material-symbols-outlined text-5xl mb-2 opacity-20">shopping_cart_checkout</span>
                           <p className="text-xs font-medium uppercase tracking-widest">ledger empty</p>
                       </div>
                   ) : cart.map((item, idx) => (
                         <div key={idx} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0 overflow-hidden">
                               <img src={item.img} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="font-bold text-xs truncate text-slate-900 dark:text-white uppercase">{item.name}</p>
                               <p className="text-[10px] text-slate-400">Unit: Rs. {item.price.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg px-1 py-0.5">
                               <button onClick={() => { const n = [...cart]; n[idx].qty = Math.max(1, n[idx].qty-1); setCart(n); }} className="w-6 h-6 hover:bg-white rounded font-black">-</button>
                               <button onClick={() => setQtyKeypad({ open: true, index: idx })} className="text-xs font-black w-6 text-center underline decoration-dotted">{item.qty}</button>
                               <button onClick={() => { const n = [...cart]; n[idx].qty += 1; setCart(n); }} className="w-6 h-6 hover:bg-white rounded font-black">+</button>
                            </div>
                            <div className="text-right">
                               <p className="font-black text-xs text-slate-900 dark:text-white">Rs. {(item.price * item.qty).toLocaleString()}</p>
                               <button onClick={() => setCart(cart.filter((_, i) => i !== idx))} className="text-slate-300 hover:text-red-500"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                            </div>
                         </div>
                    ))
                   }
                </div>

                <div className="p-4 border-t dark:border-slate-700 space-y-2">
                   <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <span>Subtotal</span>
                      <span className="text-slate-900 dark:text-white">Rs. {subtotal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-xs font-bold group">
                      <span className="text-slate-500 uppercase">Discounts ({discountType === 'pct' ? `${manualDiscount}%` : `Rs. ${manualDiscount}`})</span>
                      <span className="text-green-600 font-black">- Rs. {discountVal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                      <span>GST (18%)</span>
                      <span className="text-slate-900 dark:text-white">Rs. {tax.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-xl font-black text-slate-900 dark:text-white border-t-2 border-dashed border-slate-200 dark:border-slate-700 pt-3 mt-2">
                      <span>NET TOTAL</span>
                      <span className="text-purple-600">Rs. {total.toLocaleString()}</span>
                   </div>
                   
                   <div className="grid grid-cols-3 gap-2 pt-4">
                       <button onClick={handleHold} disabled={cart.length === 0} className="py-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-50">Hold</button>
                       <button onClick={() => setDiscKeypad(true)} className="py-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Discount</button>
                       <button onClick={() => {setCart([]); setCustomer(null); setManualDiscount(0);}} className="py-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Clear</button>
                   </div>
                   <button onClick={() => setCheckoutOpen(true)} disabled={cart.length === 0} className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-lg shadow-xl shadow-purple-500/20 mt-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale">
                      COMPLETE SALE
                   </button>
                </div>
             </div>
          </div>
       </div>

       {/* Modals Implementation */}
       <KeypadModal isOpen={qtyKeypad.open} onClose={() => setQtyKeypad({open: false, index: -1})} onEnter={(v) => { if(qtyKeypad.index > -1){ const n = [...cart]; n[qtyKeypad.index].qty = parseFloat(v) || 1; setCart(n); } setQtyKeypad({open: false, index: -1}); }} title="Order Quantity" />
       
       {discKeypad && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-[#1e293b] w-full max-w-xs rounded-2xl shadow-2xl border dark:border-slate-700 overflow-hidden">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-700 flex justify-between items-center">
                        <h3 className="font-bold text-xs uppercase tracking-widest">Manual Discount</h3>
                        <div className="flex bg-slate-200 dark:bg-slate-900 rounded-lg p-1">
                            <button onClick={() => setDiscountType('pct')} className={`px-3 py-1 text-[10px] font-black rounded-md ${discountType === 'pct' ? 'bg-white shadow text-purple-600' : 'text-slate-500'}`}>%</button>
                            <button onClick={() => setDiscountType('amt')} className={`px-3 py-1 text-[10px] font-black rounded-md ${discountType === 'amt' ? 'bg-white shadow text-purple-600' : 'text-slate-500'}`}>CASH</button>
                        </div>
                    </div>
                    <KeypadModal isOpen={true} onClose={() => setDiscKeypad(false)} onEnter={(v) => { setManualDiscount(parseFloat(v) || 0); setDiscKeypad(false); }} title={`Enter ${discountType === 'pct' ? 'Percent' : 'Amount'}`} initialValue={manualDiscount.toString()} />
                </div>
           </div>
       )}

       <RecallModal isOpen={recallOpen} onClose={() => setRecallOpen(false)} onRecall={handleRecall} />
       <GarageSelectModal isOpen={garageOpen} onClose={() => setGarageOpen(false)} onSelect={(g) => { setCustomer(g); setGarageOpen(false); }} />
       <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} total={total} customer={customer} onComplete={finalizeSale} />
    </div>
  );
}
