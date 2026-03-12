import React from 'react';

const campaigns = [
  { id: 1, name: 'Diwali Mega Sale', type: 'Discount', status: 'Active', reach: '24 Garages', conversion: '12%', ends: '31 Oct 2024', img: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Free Shipping on Bulk Oil', type: 'Promotion', status: 'Scheduled', reach: 'All', conversion: '-', ends: '15 Nov 2024', img: 'https://images.unsplash.com/photo-1635784183209-e8c690e250f2?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Monsoon Tyre Exchange', type: 'Exchange Offer', status: 'Ended', reach: '18 Garages', conversion: '8.5%', ends: '30 Sep 2024', img: 'https://images.unsplash.com/photo-1578844251758-2f71da645217?auto=format&fit=crop&q=80&w=400' },
];

export default function VendorMarketing() {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
             <h1 className="text-2xl font-bold">Marketing & Promotions</h1>
             <p className="text-slate-500 text-sm">Create offers to boost sales across your garage network.</p>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all">
             <span className="material-symbols-outlined">add_circle</span> Create Campaign
          </button>
       </div>

       {/* Active Campaign Banner Mock */}
       <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
             <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block backdrop-blur-sm">Active Now</span>
             <h2 className="text-3xl font-bold mb-2">Diwali Mega Sale is Live!</h2>
             <p className="text-purple-100 mb-6">Offering flat 20% off on all Brake Pads and Filters to registered garages.</p>
             <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                   <p className="text-xs text-purple-200">Views</p>
                   <p className="font-bold text-xl">1.2k</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                   <p className="text-xs text-purple-200">Orders</p>
                   <p className="font-bold text-xl">45</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                   <p className="text-xs text-purple-200">Revenue</p>
                   <p className="font-bold text-xl">₹1.5L</p>
                </div>
             </div>
          </div>
          <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1000" className="absolute top-0 right-0 h-full w-1/2 object-cover opacity-20" alt="background" />
       </div>

       {/* Campaign List */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(camp => (
             <div key={camp.id} className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all group">
                <div className="h-40 relative">
                   <img src={camp.img} className="w-full h-full object-cover" alt="" />
                   <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                         camp.status === 'Active' ? 'bg-green-500 text-white' : 
                         camp.status === 'Scheduled' ? 'bg-blue-500 text-white' : 
                         'bg-slate-500 text-white'
                      }`}>
                         {camp.status}
                      </span>
                   </div>
                </div>
                <div className="p-5">
                   <h3 className="font-bold text-lg mb-1 group-hover:text-purple-600 transition-colors">{camp.name}</h3>
                   <p className="text-xs text-slate-500 mb-4">{camp.type}</p>
                   
                   <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                         <p className="text-slate-500 text-xs">Target Reach</p>
                         <p className="font-medium">{camp.reach}</p>
                      </div>
                      <div>
                         <p className="text-slate-500 text-xs">Conversion</p>
                         <p className="font-medium">{camp.conversion}</p>
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-xs text-slate-500">Ends {camp.ends}</span>
                      <button className="text-purple-600 text-sm font-medium hover:underline">Manage</button>
                   </div>
                </div>
             </div>
          ))}
          
          {/* Add New Placeholder */}
          <button className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center h-full min-h-[300px] text-slate-400 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all gap-3">
             <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">add</span>
             </div>
             <span className="font-medium">Create New Campaign</span>
          </button>
       </div>
    </div>
  );
}