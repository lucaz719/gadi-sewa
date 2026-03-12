import React, { useState } from 'react';
import { useToast } from '../App';

// Mock Marketplace Data (Simulating Global Vendor Database)
const MARKETPLACE_PRODUCTS = [
  { id: 101, name: 'Synthetic Engine Oil 5W-30', sku: 'OIL-SYN-530', category: 'Lubricants', vendor: 'AutoParts Distributor Ltd.', price: 2200, retailPrice: 3200, stock: 450, rating: 4.8, img: 'https://images.unsplash.com/photo-1635784183209-e8c690e250f2?w=300&h=300&fit=crop' },
  { id: 102, name: 'Brake Pad Set (Front)', sku: 'BP-FR-001', category: 'Brakes', vendor: 'AutoParts Distributor Ltd.', price: 1500, retailPrice: 2200, stock: 120, rating: 4.5, img: 'https://images.unsplash.com/photo-1600161599939-23d16036198c?w=300&h=300&fit=crop' },
  { id: 103, name: 'Car Battery 12V 45Ah', sku: 'BAT-12V-45', category: 'Batteries', vendor: 'PowerMax Batteries', price: 3800, retailPrice: 5500, stock: 25, rating: 4.2, img: 'https://images.unsplash.com/photo-1625710772821-48932720118a?w=300&h=300&fit=crop' },
  { id: 104, name: 'Air Filter (Universal)', sku: 'AF-UNI-99', category: 'Filters', vendor: 'Filtration Pros', price: 350, retailPrice: 600, stock: 8, rating: 3.9, img: 'https://images.unsplash.com/photo-1517059478735-9b73637b6c5e?w=300&h=300&fit=crop' },
  { id: 105, name: 'Spark Plug (Iridium)', sku: 'SP-IRI-04', category: 'Ignition', vendor: 'Sparky Co.', price: 280, retailPrice: 450, stock: 200, rating: 4.7, img: 'https://images.unsplash.com/photo-1615900119312-2acd3a71f3aa?w=300&h=300&fit=crop' },
  { id: 106, name: 'LED Headlight Bulb H4', sku: 'LED-H4-6000K', category: 'Lighting', vendor: 'AutoParts Distributor Ltd.', price: 1200, retailPrice: 1800, stock: 60, rating: 4.6, img: 'https://images.unsplash.com/photo-1487754180477-1c43cd8a77e2?w=300&h=300&fit=crop' },
];

export default function Marketplace() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState('All Vendors');
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  const availableCredit = 50000;
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const filteredProducts = MARKETPLACE_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVendor = vendorFilter === 'All Vendors' || product.vendor === vendorFilter;
      return matchesSearch && matchesVendor;
  });

  const vendors = ['All Vendors', ...new Set(MARKETPLACE_PRODUCTS.map(p => p.vendor))];

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

  const handleCheckout = () => {
      setShowCart(false);
      setShowCheckoutSuccess(true);
      setCart([]);
      // In a real app, this would create Orders in the Vendor system
  };

  return (
    <div className="relative h-full flex flex-col">
       {/* Top Bar: Credit & Search */}
       <div className="space-y-4 mb-6">
           <div className="flex flex-wrap justify-between items-center gap-4">
               <div>
                   <h1 className="text-2xl font-bold">Parts Marketplace</h1>
                   <p className="text-slate-500 text-sm">Source genuine parts directly from authorized vendors.</p>
               </div>
               
               <div className="flex gap-4">
                   <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
                       <div className="bg-green-100 text-green-700 p-1.5 rounded-lg">
                           <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                       </div>
                       <div>
                           <p className="text-xs text-slate-500 font-bold uppercase">Available Credit</p>
                           <p className="font-bold text-slate-900 dark:text-white">₹{availableCredit.toLocaleString()}</p>
                       </div>
                   </div>
                   
                   <button 
                        onClick={() => setShowCart(true)}
                        className="relative bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-bold shadow-md flex items-center gap-2 transition-transform active:scale-95"
                   >
                       <span className="material-symbols-outlined">shopping_cart</span>
                       Cart
                       {cart.length > 0 && (
                           <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-50 dark:border-[#101a22]">
                               {cart.reduce((acc, item) => acc + item.qty, 0)}
                           </span>
                       )}
                   </button>
               </div>
           </div>

           <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 shadow-sm">
               <div className="relative flex-1 min-w-[250px]">
                   <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                   <input 
                        type="text" 
                        placeholder="Search for parts, brands, or SKUs..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-colors" 
                   />
               </div>
               <select 
                    value={vendorFilter}
                    onChange={(e) => setVendorFilter(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
               >
                   {vendors.map(v => <option key={v}>{v}</option>)}
               </select>
           </div>
       </div>

       {/* Product Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
           {filteredProducts.map(product => (
               <div key={product.id} className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full">
                   <div className="aspect-square relative overflow-hidden bg-white">
                       <img src={product.img} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                       <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 shadow-sm">
                           {product.vendor}
                       </div>
                       {product.stock < 10 && (
                           <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-[10px] font-bold shadow-sm">
                               Only {product.stock} left
                           </div>
                       )}
                   </div>
                   
                   <div className="p-4 flex-1 flex flex-col">
                       <div className="flex-1">
                           <p className="text-xs text-slate-500 mb-1 font-mono">{product.sku}</p>
                           <h3 className="font-bold text-slate-900 dark:text-white leading-tight mb-2 min-h-[2.5rem]">{product.name}</h3>
                           <div className="flex items-center gap-1 text-yellow-500 text-xs mb-3">
                               {[1,2,3,4,5].map(star => (
                                   <span key={star} className="material-symbols-outlined text-[14px]">{star <= Math.round(product.rating) ? 'star' : 'star_border'}</span>
                               ))}
                               <span className="text-slate-400 ml-1">({product.rating})</span>
                           </div>
                       </div>
                       
                       <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                           <div className="flex justify-between items-end mb-3">
                               <div>
                                   <p className="text-xs text-slate-500 line-through">MRP: ₹{product.retailPrice}</p>
                                   <p className="text-lg font-bold text-primary-600">₹{product.price}<span className="text-xs font-normal text-slate-500">/unit</span></p>
                               </div>
                               <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                   Save {Math.round(((product.retailPrice - product.price) / product.retailPrice) * 100)}%
                               </span>
                           </div>
                           <button 
                                onClick={() => addToCart(product)}
                                className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                           >
                               <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                               Add to Cart
                           </button>
                       </div>
                   </div>
               </div>
           ))}
       </div>

       {/* Cart Slide-over */}
       {showCart && (
           <div className="fixed inset-0 z-50 overflow-hidden">
               <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setShowCart(false)}></div>
               <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
                   <div className="h-full w-full bg-white dark:bg-[#1e293b] shadow-2xl flex flex-col animate-slide-in-right">
                       <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
                           <h2 className="text-lg font-bold flex items-center gap-2">
                               <span className="material-symbols-outlined">shopping_cart</span>
                               Your Cart ({cart.length})
                           </h2>
                           <button onClick={() => setShowCart(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500">
                               <span className="material-symbols-outlined">close</span>
                           </button>
                       </div>

                       <div className="flex-1 overflow-y-auto p-6 space-y-6">
                           {cart.length === 0 ? (
                               <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                   <span className="material-symbols-outlined text-6xl mb-4 text-slate-200 dark:text-slate-700">production_quantity_limits</span>
                                   <p>Your cart is empty.</p>
                                   <button onClick={() => setShowCart(false)} className="mt-4 text-primary-600 font-bold hover:underline">Start Browsing</button>
                               </div>
                           ) : (
                               <>
                                   {/* Group items by vendor logic could go here, treating as list for now */}
                                   {cart.map((item) => (
                                       <div key={item.id} className="flex gap-4">
                                           <div className="w-20 h-20 bg-white border border-slate-200 dark:border-slate-700 rounded-lg p-2 shrink-0">
                                               <img src={item.img} className="w-full h-full object-contain" alt="" />
                                           </div>
                                           <div className="flex-1">
                                               <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</h4>
                                               <p className="text-xs text-slate-500 mb-2">{item.vendor}</p>
                                               <div className="flex justify-between items-center">
                                                   <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                                                       <button onClick={() => updateQty(item.id, -1)} className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">-</button>
                                                       <span className="px-2 py-1 text-sm font-bold min-w-[1.5rem] text-center">{item.qty}</span>
                                                       <button onClick={() => updateQty(item.id, 1)} className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">+</button>
                                                   </div>
                                                   <div className="text-right">
                                                       <p className="font-bold">₹{item.price * item.qty}</p>
                                                       <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline">Remove</button>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                   ))}
                               </>
                           )}
                       </div>

                       {cart.length > 0 && (
                           <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                               <div className="space-y-2 text-sm mb-4">
                                   <div className="flex justify-between text-slate-500">
                                       <span>Subtotal</span>
                                       <span>₹{cartTotal.toLocaleString()}</span>
                                   </div>
                                   <div className="flex justify-between text-slate-500">
                                       <span>Tax (18%)</span>
                                       <span>₹{(cartTotal * 0.18).toLocaleString()}</span>
                                   </div>
                                   <div className="flex justify-between text-slate-500">
                                       <span>Shipping</span>
                                       <span className="text-green-600">Free</span>
                                   </div>
                                   <div className="flex justify-between font-bold text-lg text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                                       <span>Total Payables</span>
                                       <span>₹{(cartTotal * 1.18).toLocaleString()}</span>
                                   </div>
                               </div>
                               
                               <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 p-3 rounded-lg text-xs text-yellow-800 dark:text-yellow-200 mb-4 flex gap-2">
                                   <span className="material-symbols-outlined text-sm">info</span>
                                   <span>
                                       Payment will be processed via <strong>Credit Limit</strong> (Net 30 Days).
                                       Remaining Credit: <span className="font-bold">₹{(availableCredit - (cartTotal * 1.18)).toLocaleString()}</span>
                                   </span>
                               </div>

                               <button 
                                    onClick={handleCheckout}
                                    className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                               >
                                   <span className="material-symbols-outlined">lock</span>
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
           <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
               <div className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-2xl shadow-2xl p-8 text-center">
                   <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                       <span className="material-symbols-outlined text-5xl">check_circle</span>
                   </div>
                   <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
                   <p className="text-slate-500 mb-6">Your order has been sent to the vendors. You can track it in the <strong>Procurement</strong> section.</p>
                   <button 
                        onClick={() => setShowCheckoutSuccess(false)}
                        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold"
                   >
                       Continue Shopping
                   </button>
               </div>
           </div>
       )}
    </div>
  );
}