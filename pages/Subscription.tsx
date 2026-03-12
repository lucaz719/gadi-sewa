import React from 'react';

export default function Subscription() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
       <div className="mb-2">
          <h1 className="text-2xl font-bold">Subscription & Billing</h1>
          <p className="text-slate-500 text-sm">Manage your plan, billing history, and payment methods.</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Plan Card */}
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <p className="text-primary-100 text-sm font-medium mb-1">Current Plan</p>
                         <h2 className="text-3xl font-bold">Pro Garage</h2>
                      </div>
                      <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Active</span>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                         <p className="text-primary-200 text-xs uppercase tracking-wider mb-1">Price</p>
                         <p className="font-bold text-lg">₹2,999<span className="text-sm font-normal text-primary-200">/mo</span></p>
                      </div>
                      <div>
                         <p className="text-primary-200 text-xs uppercase tracking-wider mb-1">Renewal Date</p>
                         <p className="font-bold text-lg">24 Nov, 2024</p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-primary-50">
                         <span className="material-symbols-outlined text-base">check_circle</span> Unlimited Jobs & Invoices
                      </div>
                      <div className="flex items-center gap-2 text-sm text-primary-50">
                         <span className="material-symbols-outlined text-base">check_circle</span> 5 Staff Accounts
                      </div>
                      <div className="flex items-center gap-2 text-sm text-primary-50">
                         <span className="material-symbols-outlined text-base">check_circle</span> Advanced Inventory
                      </div>
                   </div>
                </div>
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
             </div>

             {/* Usage Statistics */}
             <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Plan Usage</h3>
                <div className="space-y-4">
                   <div>
                      <div className="flex justify-between text-sm mb-1">
                         <span className="text-slate-600 dark:text-slate-400">Users</span>
                         <span className="font-medium">3 / 5</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 w-[60%]"></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between text-sm mb-1">
                         <span className="text-slate-600 dark:text-slate-400">SMS Credits</span>
                         <span className="font-medium">850 / 1000</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                         <div className="h-full bg-green-500 w-[85%]"></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between text-sm mb-1">
                         <span className="text-slate-600 dark:text-slate-400">Cloud Storage</span>
                         <span className="font-medium">1.2 GB / 5 GB</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                         <div className="h-full bg-purple-500 w-[24%]"></div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Billing History */}
             <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                   <h3 className="font-bold">Billing History</h3>
                   <button className="text-sm text-primary-600 font-medium hover:underline">View All</button>
                </div>
                <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500">
                      <tr>
                         <th className="p-4">Date</th>
                         <th className="p-4">Description</th>
                         <th className="p-4">Amount</th>
                         <th className="p-4 text-right">Invoice</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      <tr>
                         <td className="p-4">24 Oct, 2024</td>
                         <td className="p-4">Pro Plan - Monthly</td>
                         <td className="p-4 font-medium">₹2,999</td>
                         <td className="p-4 text-right"><button className="text-primary-600 hover:underline">Download</button></td>
                      </tr>
                      <tr>
                         <td className="p-4">24 Sep, 2024</td>
                         <td className="p-4">Pro Plan - Monthly</td>
                         <td className="p-4 font-medium">₹2,999</td>
                         <td className="p-4 text-right"><button className="text-primary-600 hover:underline">Download</button></td>
                      </tr>
                      <tr>
                         <td className="p-4">24 Aug, 2024</td>
                         <td className="p-4">Pro Plan - Monthly</td>
                         <td className="p-4 font-medium">₹2,999</td>
                         <td className="p-4 text-right"><button className="text-primary-600 hover:underline">Download</button></td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </div>

          {/* Right Sidebar: Upgrade & Payment */}
          <div className="space-y-6">
             <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Upgrade Plan</h3>
                <div className="p-4 border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/10 rounded-xl mb-4">
                   <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-purple-700 dark:text-purple-400">Business</h4>
                      <span className="text-xs font-bold bg-purple-200 text-purple-800 px-2 py-1 rounded">BEST VALUE</span>
                   </div>
                   <p className="text-2xl font-bold mb-1">₹4,999<span className="text-sm font-normal text-slate-500">/mo</span></p>
                   <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 mb-4">
                      <li>• Unlimited Users</li>
                      <li>• Multi-Branch Support</li>
                      <li>• Priority Support</li>
                   </ul>
                   <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-sm">Upgrade Now</button>
                </div>
                <button className="w-full py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">Compare Plans</button>
             </div>

             <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Payment Method</h3>
                <div className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg mb-4">
                   <div className="w-10 h-6 bg-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-500">VISA</div>
                   <div className="flex-1">
                      <p className="text-sm font-medium">•••• 4242</p>
                      <p className="text-xs text-slate-500">Expires 12/25</p>
                   </div>
                </div>
                <button className="w-full py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">Update Payment Method</button>
             </div>
          </div>
       </div>
    </div>
  );
}