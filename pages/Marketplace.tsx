import React, { useState, useEffect } from 'react';
import { useToast } from '../App';
import { db } from '../services/db';

export default function Marketplace() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState('All Vendors');
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [availableCredit, setAvailableCredit] = useState(50000);

  const authUser = db.getAuthUser();
  const garageId = authUser?.enterprise_id;

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await db.getMarketplaceProducts();
      setProducts(data);
    } catch (err) {
      showToast('error', 'Failed to load marketplace products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const filteredProducts = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVendor = vendorFilter === 'All Vendors' || product.vendor_id.toString() === vendorFilter;
      return matchesSearch && matchesVendor;
  });

  const addToCart = (product: any) => {
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
          setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      } else {
          setCart([...cart, { ...product, qty: 1 }]);
      }
      showToast('success', 'Added to cart');
  };

  const removeFromCart = (id: number) => {
      setCart(cart.filter(item => item.id !== id));
  };

  const updateQty = (id: number, delta: number) => {
      setCart(cart.map(item => {
          if (item.id === id) {
              const newQty = Math.max(1, item.qty + delta);
              return { ...item, qty: newQty };
          }
          return item;
      }));
  };

  const handleCheckout = async () => {
      if (!garageId) {
          showToast('error', 'User not associated with a garage.');
          return;
      }

      // Group cart by vendor if multiple vendors, for simplicity we assume one or handle as one order
      // In real scenario, we'd split the cart into multiple orders per vendor.
      const vendorId = cart[0]?.vendor_id;
      if (!vendorId) return;

      try {
          await db.placeMarketplaceOrder({
              vendor_id: vendorId,
              items: cart.map(item => ({
                  product_id: item.id,
                  name: item.name,
                  qty: item.qty,
                  price: item.price
              })),
              total_amount: cartTotal * 1.18 // Including tax
          }, garageId);

          setAvailableCredit(prev => prev - (cartTotal * 1.18));
          setShowCart(false);
          setShowCheckoutSuccess(true);
          setCart([]);
          showToast('success', 'Enterprise order confirmed');
      } catch (err) {
          showToast('error', 'Checkout failed. Please check your credit limit.');
      }
  };

  return (
    <div className="relative h-full flex flex-col space-y-6">
       {/* Top Bar: Credit & Search */}
       <div className="space-y-4">
           <div className="flex flex-wrap justify-between items-center gap-4">
               <div>
                   <h1 className="text-3xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">Procurement Hub</h1>
                   <p className="text-slate-500 text-sm font-medium">B2B Supply Chain Network — Direct Enterprise Sourcing.</p>
               </div>
               
               <div className="flex gap-4">
                   <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3 flex items-center gap-4 shadow-sm border-b-4 border-b-green-500">
                       <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl flex items-center justify-center">
                           <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                       </div>
                       <div>
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Available Credit</p>
                           <p className="font-black text-xl text-slate-900 dark:text-white tracking-tighter">NPR {availableCredit.toLocaleString()}</p>
                       </div>
                   </div>
                   
                   <button 
                        onClick={() => setShowCart(true)}
                        className="relative bg-slate-900 dark:bg-primary-600 hover:bg-black dark:hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-black shadow-xl flex items-center gap-3 transition-all active:scale-95 text-xs uppercase tracking-widest"
                   >
                       <span className="material-symbols-outlined text-xl">shopping_cart</span>
                       Cart
                       {cart.length > 0 && (
                           <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full border-2 border-white dark:border-[#101a22] font-black shadow-lg">
                               {cart.reduce((acc, item) => acc + item.qty, 0)}
                           </span>
                       )}
                   </button>
               </div>
           </div>

           <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 shadow-sm">
               <div className="relative flex-1 min-w-[250px]">
                   <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                   <input 
                        type="text" 
                        placeholder="Search parts, global SKUs, or manufacturer references..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary-500 rounded-xl text-sm font-medium outline-none transition-all" 
                   />
               </div>
               <select 
                    value={vendorFilter}
                    onChange={(e) => setVendorFilter(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
               >
                   <option>All Vendors</option>
                   {/* In a real app we'd map vendor names here */}
               </select>
           </div>
       </div>

       {/* Product Grid */}
       <div className="flex-1 overflow-y-auto pb-20 scrollbar-none">
            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-4">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black text-[10px] uppercase tracking-widest">Querying Global Supply Chain...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-6xl mb-4 opacity-20">inventory_2</span>
                    <p className="font-bold tracking-tight text-lg">No matching components found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all group flex flex-col h-full relative">
                            <div className="aspect-[4/3] relative overflow-hidden bg-slate-50 dark:bg-slate-800/50">
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 bg-white dark:bg-slate-900 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 shadow-sm">
                                    Vendor #{product.vendor_id}
                                </div>
                                {product.stock < 10 && (
                                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                                        Low Stock: {product.stock}
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[10px] text-primary-500 font-black uppercase tracking-widest">{product.category}</p>
                                        <p className="text-[10px] text-slate-400 font-mono font-bold tracking-tighter">{product.sku}</p>
                                    </div>
                                    <h3 className="font-black text-slate-900 dark:text-white leading-tight mb-3 text-sm uppercase tracking-tight">{product.name}</h3>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <p className="text-[10px] text-slate-400 line-through font-bold">MRP NPR {product.retail_price.toLocaleString()}</p>
                                            <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">NPR {product.price.toLocaleString()}</p>
                                        </div>
                                        <span className="text-[10px] font-black text-green-600 bg-green-50 dark:bg-green-900/30 px-3 py-1 border border-green-100 dark:border-green-900/50 rounded-full uppercase tracking-widest">
                                            -{Math.round(((product.retail_price - product.price) / product.retail_price) * 100)}%
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => addToCart(product)}
                                        className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                                        Add to Sourcing
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
       </div>

       {/* Cart Slide-over */}
       {showCart && (
           <div className="fixed inset-0 z-50 overflow-hidden">
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowCart(false)}></div>
               <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
                   <div className="h-full w-full bg-white dark:bg-[#1e293b] shadow-2xl flex flex-col animate-slide-in-right border-l border-slate-200 dark:border-slate-700">
                       <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                           <h2 className="text-xl font-black tracking-tighter uppercase flex items-center gap-3">
                               <span className="material-symbols-outlined text-primary-500">shopping_bag</span>
                               Sourcing Cart ({cart.length})
                           </h2>
                           <button onClick={() => setShowCart(false)} className="w-10 h-10 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 flex items-center justify-center transition-all">
                               <span className="material-symbols-outlined">close</span>
                           </button>
                       </div>

                       <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-none">
                           {cart.length === 0 ? (
                               <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                   <span className="material-symbols-outlined text-8xl mb-6 opacity-10">production_quantity_limits</span>
                                   <p className="font-black uppercase tracking-widest text-xs">No active sourcing items</p>
                                   <button onClick={() => setShowCart(false)} className="mt-8 text-primary-500 font-black uppercase text-[10px] tracking-widest hover:underline">Return to Hub</button>
                               </div>
                           ) : (
                               cart.map((item) => (
                                   <div key={item.id} className="flex gap-6 group">
                                       <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-3 shrink-0 shadow-inner overflow-hidden">
                                           <img src={item.image_url} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" alt="" />
                                       </div>
                                       <div className="flex-1 flex flex-col py-1">
                                           <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight mb-1">{item.name}</h4>
                                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Vendor #{item.vendor_id}</p>
                                           <div className="flex justify-between items-center mt-auto">
                                               <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-inner">
                                                   <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400 transition-colors">-</button>
                                                   <span className="px-4 text-xs font-black min-w-[2rem] text-center">{item.qty}</span>
                                                   <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400 transition-colors">+</button>
                                               </div>
                                               <div className="text-right">
                                                   <p className="font-black text-slate-900 dark:text-white tracking-tighter">NPR {(item.price * item.qty).toLocaleString()}</p>
                                                   <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors">Discard</button>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               ))
                           )}
                       </div>

                       {cart.length > 0 && (
                           <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1e293b] shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
                               <div className="space-y-4 mb-8">
                                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                       <span>Base Procurement</span>
                                       <span className="text-slate-900 dark:text-white">NPR {cartTotal.toLocaleString()}</span>
                                   </div>
                                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                       <span>VAT (13%)</span>
                                       <span className="text-slate-900 dark:text-white">NPR {(cartTotal * 0.13).toLocaleString()}</span>
                                   </div>
                                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                       <span>Logistics</span>
                                       <span className="text-green-600 font-black">COMPLIMENTARY</span>
                                   </div>
                                   <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                                       <span className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Total Payables</span>
                                       <span className="text-2xl font-black text-primary-500 tracking-tighter">NPR {(cartTotal * 1.13).toLocaleString()}</span>
                                   </div>
                               </div>
                               
                               <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 p-4 rounded-2xl mb-8 flex gap-4 items-start shadow-sm">
                                   <span className="material-symbols-outlined text-primary-500 mt-0.5">verified_user</span>
                                   <p className="text-[10px] text-primary-900 dark:text-primary-300 font-bold uppercase tracking-tight leading-relaxed">
                                       This transaction is protected by GadiSewa <strong>Enterprise Escrow</strong>. 
                                       Funds will remain held until delivery confirmation.
                                   </p>
                               </div>

                               <button 
                                    onClick={handleCheckout}
                                    className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-3xl font-black text-[12px] uppercase tracking-widest shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] transition-all flex items-center justify-center gap-3 active:scale-95 border-b-4 border-b-primary-800"
                               >
                                   <span className="material-symbols-outlined">bolt</span>
                                   Confirm Order
                               </button>
                           </div>
                       )}
                   </div>
               </div>
           </div>
       )}

       {/* Order Success Modal */}
       {showCheckoutSuccess && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-fade-in">
               <div className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-[40px] shadow-2xl p-10 text-center border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
                    <div className="w-24 h-24 bg-green-500 text-white rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-[0_10px_30px_rgba(34,197,94,0.4)] rotate-3">
                        <span className="material-symbols-outlined text-5xl">inventory</span>
                    </div>
                    <h2 className="text-3xl font-black mb-3 tracking-tighter uppercase italic">Dispatch Initiated!</h2>
                    <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed px-4">Your procurement request has been broadcast to the vendor network. Monitor fulfillment in <strong>Orders</strong>.</p>
                    <button 
                         onClick={() => setShowCheckoutSuccess(false)}
                         className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:shadow-xl transition-all"
                    >
                        Return to Hub
                    </button>
               </div>
           </div>
       )}
    </div>
  );
}