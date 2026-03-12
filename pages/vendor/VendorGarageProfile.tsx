import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function VendorGarageProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock Garage Data
  const garage = {
      id: id,
      name: 'City Auto Works',
      owner: 'Rajesh Kumar',
      joined: '12 Jan 2023',
      location: 'Mumbai, MH',
      phone: '+91 98765 43210',
      email: 'cityauto@gmail.com',
      rating: 4.8,
      status: 'Active',
      stats: {
          totalOrders: 45,
          totalSpent: '₹4,52,000',
          avgOrderValue: '₹10,044',
          outstanding: '₹12,500'
      },
      credit: {
          limit: 50000,
          used: 12500,
          terms: 'Net 30 Days'
      }
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
            <Link to="/vendor/network" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-2xl font-bold">Garage Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar Profile Card */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm text-center">
                    <div className="w-24 h-24 rounded-full bg-slate-200 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-slate-500">
                        {garage.name.substring(0, 2).toUpperCase()}
                    </div>
                    <h2 className="text-xl font-bold">{garage.name}</h2>
                    <p className="text-sm text-slate-500">{garage.location} • Since {garage.joined}</p>
                    <div className="flex items-center justify-center gap-1 text-yellow-500 font-bold mt-2">
                        <span className="material-symbols-outlined filled text-lg">star</span> {garage.rating}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
                        <div className="text-center">
                            <p className="text-xs text-slate-500">Orders</p>
                            <p className="font-bold text-lg">{garage.stats.totalOrders}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500">Total Volume</p>
                            <p className="font-bold text-lg text-green-600">{garage.stats.totalSpent}</p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-2">
                        <button className="w-full py-2 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700">Create New Order</button>
                        <button className="w-full py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800">Send Message</button>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h3 className="font-bold border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Contact Details</h3>
                    <div className="space-y-3 text-sm">
                        <div>
                            <p className="text-xs text-slate-500">Owner Name</p>
                            <p className="font-medium">{garage.owner}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Phone</p>
                            <p className="font-medium">{garage.phone}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Email</p>
                            <p className="font-medium">{garage.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Details */}
            <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                   {['Overview', 'Orders', 'Credit & Payments', 'Notes'].map(tab => (
                       <button 
                           key={tab}
                           onClick={() => setActiveTab(tab.toLowerCase())}
                           className={`px-6 py-4 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.toLowerCase() ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                       >
                           {tab}
                       </button>
                   ))}
               </div>

               <div className="p-6 flex-1">
                   {activeTab === 'overview' && (
                       <div className="space-y-6 animate-fade-in">
                           <div className="grid grid-cols-2 gap-4">
                               <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-900/20">
                                   <p className="text-sm text-slate-500">Avg. Order Value</p>
                                   <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{garage.stats.avgOrderValue}</p>
                               </div>
                               <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/20">
                                   <p className="text-sm text-slate-500">Outstanding Balance</p>
                                   <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{garage.stats.outstanding}</p>
                               </div>
                           </div>
                           
                           <div>
                               <h3 className="font-bold text-lg mb-3">Top Purchased Categories</h3>
                               <div className="space-y-3">
                                   <div>
                                       <div className="flex justify-between text-sm mb-1">
                                           <span>Engine Parts</span>
                                           <span className="font-medium">45%</span>
                                       </div>
                                       <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[45%]"></div></div>
                                   </div>
                                   <div>
                                       <div className="flex justify-between text-sm mb-1">
                                           <span>Lubricants</span>
                                           <span className="font-medium">30%</span>
                                       </div>
                                       <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-purple-500 w-[30%]"></div></div>
                                   </div>
                                   <div>
                                       <div className="flex justify-between text-sm mb-1">
                                           <span>Brake Systems</span>
                                           <span className="font-medium">15%</span>
                                       </div>
                                       <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[15%]"></div></div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   )}

                   {activeTab === 'credit & payments' && (
                       <div className="space-y-6 animate-fade-in">
                           <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                               <div className="flex justify-between items-start mb-4">
                                   <h3 className="font-bold text-lg">Credit Limit</h3>
                                   <button className="text-sm text-purple-600 font-medium hover:underline">Edit Limit</button>
                               </div>
                               
                               <div className="relative pt-2 pb-6">
                                   <div className="flex justify-between text-sm font-medium mb-2">
                                       <span>Used: ₹{garage.credit.used.toLocaleString()}</span>
                                       <span>Limit: ₹{garage.credit.limit.toLocaleString()}</span>
                                   </div>
                                   <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                       <div className="h-full bg-purple-600" style={{ width: `${(garage.credit.used / garage.credit.limit) * 100}%` }}></div>
                                   </div>
                                   <p className="text-xs text-slate-500 mt-2">Available Credit: ₹{(garage.credit.limit - garage.credit.used).toLocaleString()}</p>
                               </div>

                               <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                                   <div>
                                       <p className="text-sm text-slate-500">Payment Terms</p>
                                       <p className="font-bold">{garage.credit.terms}</p>
                                   </div>
                                   <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-white dark:hover:bg-slate-800">Change Terms</button>
                               </div>
                           </div>

                           <div>
                               <h3 className="font-bold text-lg mb-3">Recent Transactions</h3>
                               <table className="w-full text-left text-sm">
                                   <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                                       <tr>
                                           <th className="p-3 rounded-l-lg">Date</th>
                                           <th className="p-3">Description</th>
                                           <th className="p-3">Amount</th>
                                           <th className="p-3 rounded-r-lg">Status</th>
                                       </tr>
                                   </thead>
                                   <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                       <tr>
                                           <td className="p-3">25 Oct 2024</td>
                                           <td className="p-3">Order #ORD-8921</td>
                                           <td className="p-3 font-bold text-slate-900 dark:text-white">₹12,500</td>
                                           <td className="p-3"><span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Unpaid</span></td>
                                       </tr>
                                       <tr>
                                           <td className="p-3">20 Oct 2024</td>
                                           <td className="p-3">Payment Received</td>
                                           <td className="p-3 font-bold text-green-600">-₹8,000</td>
                                           <td className="p-3"><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Completed</span></td>
                                       </tr>
                                   </tbody>
                               </table>
                           </div>
                       </div>
                   )}
               </div>
            </div>
        </div>
    </div>
  );
}