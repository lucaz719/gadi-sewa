import React, { useState } from 'react';
import { useToast } from '../App';

export default function Marketing() {
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  const handleCreateCampaign = (e: React.FormEvent) => {
      e.preventDefault();
      showToast('success', 'Campaign created successfully');
      setShowModal(false);
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold">Marketing</h1>
             <p className="text-slate-500 text-sm">Engage with your customers and boost retention.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2"
          >
             <span className="material-symbols-outlined">campaign</span> New Campaign
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
               <div className="flex justify-between items-start mb-2">
                   <p className="text-sm text-slate-500 font-medium">Active Campaigns</p>
                   <span className="material-symbols-outlined text-green-500">check_circle</span>
               </div>
               <p className="text-2xl font-bold">2</p>
           </div>
           <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
               <div className="flex justify-between items-start mb-2">
                   <p className="text-sm text-slate-500 font-medium">SMS Sent</p>
                   <span className="material-symbols-outlined text-blue-500">sms</span>
               </div>
               <p className="text-2xl font-bold">1,240</p>
           </div>
           <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
               <div className="flex justify-between items-start mb-2">
                   <p className="text-sm text-slate-500 font-medium">Avg. Rating</p>
                   <span className="material-symbols-outlined text-yellow-500">star</span>
               </div>
               <p className="text-2xl font-bold">4.8</p>
           </div>
           <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
               <div className="flex justify-between items-start mb-2">
                   <p className="text-sm text-slate-500 font-medium">Points Redeemed</p>
                   <span className="material-symbols-outlined text-purple-500">loyalty</span>
               </div>
               <p className="text-2xl font-bold">850</p>
           </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
               <h3 className="font-bold mb-4">Quick Broadcast</h3>
               <div className="space-y-4">
                   <textarea className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 outline-none text-sm" rows={3} placeholder="Type your message here..."></textarea>
                   <div className="flex gap-4">
                       <label className="flex items-center gap-2 text-sm">
                           <input type="radio" name="channel" className="text-primary-600" defaultChecked /> SMS
                       </label>
                       <label className="flex items-center gap-2 text-sm">
                           <input type="radio" name="channel" className="text-green-600" /> WhatsApp
                       </label>
                   </div>
                   <div className="pt-2">
                       <p className="text-xs text-slate-500 mb-2">Target Audience: All Active Customers (120)</p>
                       <button className="w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-900">Send Broadcast</button>
                   </div>
               </div>
           </div>

           <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
               <h3 className="font-bold mb-4">Recent Reviews</h3>
               <div className="space-y-4">
                   {[1, 2].map(i => (
                       <div key={i} className="flex gap-3 items-start p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                           <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">JD</div>
                           <div>
                               <div className="flex items-center gap-2">
                                   <p className="font-bold text-sm">John Doe</p>
                                   <div className="flex text-yellow-500 text-[10px] gap-0.5">
                                       <span className="material-symbols-outlined filled text-xs">star</span>
                                       <span className="material-symbols-outlined filled text-xs">star</span>
                                       <span className="material-symbols-outlined filled text-xs">star</span>
                                       <span className="material-symbols-outlined filled text-xs">star</span>
                                       <span className="material-symbols-outlined filled text-xs">star</span>
                                   </div>
                               </div>
                               <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">"Great service! Quick turnaround."</p>
                           </div>
                       </div>
                   ))}
                   <button className="text-sm text-primary-600 font-medium hover:underline w-full text-center">View All Reviews</button>
               </div>
           </div>
       </div>

       {/* Create Campaign Modal */}
       {showModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
               <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700">
                   <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                       <h3 className="text-lg font-bold">Create New Campaign</h3>
                       <button onClick={() => setShowModal(false)}><span className="material-symbols-outlined text-slate-400">close</span></button>
                   </div>
                   <form onSubmit={handleCreateCampaign} className="p-6 space-y-4">
                       <div>
                           <label className="block text-sm font-medium mb-1">Campaign Name</label>
                           <input type="text" required className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. Diwali Offer" />
                       </div>
                       <div>
                           <label className="block text-sm font-medium mb-1">Channel</label>
                           <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500">
                               <option>SMS</option>
                               <option>WhatsApp</option>
                               <option>Email</option>
                           </select>
                       </div>
                       <div>
                           <label className="block text-sm font-medium mb-1">Target Audience</label>
                           <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500">
                               <option>All Customers</option>
                               <option>Active Customers (Last 30 days)</option>
                               <option>Inactive Customers (> 90 days)</option>
                               <option>Gold Tier Only</option>
                           </select>
                       </div>
                       <div>
                           <label className="block text-sm font-medium mb-1">Message Content</label>
                           <textarea required className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" rows={4} placeholder="Enter your promotional message..."></textarea>
                           <p className="text-xs text-slate-500 mt-1 text-right">0 / 160 characters</p>
                       </div>
                       
                       <div className="pt-4 flex justify-end gap-3">
                           <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-sm font-medium">Cancel</button>
                           <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700">Launch Campaign</button>
                       </div>
                   </form>
               </div>
           </div>
       )}
    </div>
  );
}