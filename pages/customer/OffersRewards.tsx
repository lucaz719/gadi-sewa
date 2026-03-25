import React from 'react';

const coupons = [
  { id: 1, title: '20% Off Service', desc: 'Get 20% off on your next General Service.', code: 'SERV20', valid: '30 Nov 2024', bg: 'from-orange-500 to-red-500' },
  { id: 2, title: 'Free Car Wash', desc: 'Complimentary wash with any repair > Rs. 2000.', code: 'WASHFREE', valid: '15 Dec 2024', bg: 'from-blue-500 to-indigo-500' },
  { id: 3, title: 'Rs. 500 Off', desc: 'Flat discount on invoice above Rs. 5000.', code: 'FLAT500', valid: '31 Dec 2024', bg: 'from-purple-500 to-pink-500' },
];

export default function OffersRewards() {
  return (
    <div className="space-y-8">
       {/* Rewards Card */}
       <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm text-center relative overflow-hidden">
           <div className="relative z-10">
               <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">My Loyalty Points</p>
               <h2 className="text-5xl font-bold text-orange-600 mb-4">450 <span className="text-lg text-slate-400 font-normal">pts</span></h2>
               <p className="text-slate-500 max-w-md mx-auto mb-6">Earn 1 point for every Rs. 100 spent. Redeem points for exclusive discounts on services and parts.</p>
               <div className="flex justify-center gap-4">
                   <button className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold shadow-md hover:scale-105 transition-transform">Redeem Points</button>
                   <button className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-full font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">History</button>
               </div>
           </div>
           {/* Background Decoration */}
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl"></div>
           <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
       </div>

       <div>
           <h2 className="text-xl font-bold mb-4">Available Coupons</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {coupons.map(coupon => (
                   <div key={coupon.id} className={`rounded-xl p-6 text-white bg-gradient-to-br ${coupon.bg} shadow-lg relative overflow-hidden group`}>
                       <div className="relative z-10">
                           <h3 className="text-2xl font-bold mb-2">{coupon.title}</h3>
                           <p className="text-white/90 text-sm mb-6 h-10">{coupon.desc}</p>
                           <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-3 flex justify-between items-center">
                               <span className="font-mono font-bold tracking-widest">{coupon.code}</span>
                               <button className="text-xs bg-white text-slate-900 px-3 py-1.5 rounded font-bold hover:bg-slate-100" onClick={() => navigator.clipboard.writeText(coupon.code)}>COPY</button>
                           </div>
                           <p className="text-xs text-white/70 mt-3 text-right">Valid till {coupon.valid}</p>
                       </div>
                       <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                   </div>
               ))}
           </div>
       </div>

       <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
           <h3 className="font-bold mb-4">Refer & Earn</h3>
           <div className="flex flex-col md:flex-row items-center gap-6">
               <div className="flex-1">
                   <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Invite your friends to GadiSewa. They get <span className="font-bold text-slate-900 dark:text-white">Rs. 200 off</span> their first service, and you get <span className="font-bold text-slate-900 dark:text-white">100 points</span>!</p>
                   <div className="flex gap-2">
                       <input type="text" readOnly value="JOHN450" className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-center font-bold tracking-widest outline-none" />
                       <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-bold">Share</button>
                   </div>
               </div>
               <div className="w-full md:w-48 flex justify-center">
                   <span className="material-symbols-outlined text-8xl text-orange-200 dark:text-orange-900/30">handshake</span>
               </div>
           </div>
       </div>
    </div>
  );
}