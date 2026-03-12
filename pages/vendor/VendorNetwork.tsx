import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const garages = [
  { id: 1, name: 'City Auto Works', location: 'Mumbai, MH', joined: '12 Jan 2023', volume: '₹1.2L', orders: 45, status: 'Active', creditLimit: 50000, creditUsed: 12500, overdue: 0, avatar: 'https://i.pravatar.cc/150?u=20' },
  { id: 2, name: 'Quick Fix Mechanics', location: 'Pune, MH', joined: '05 Mar 2023', volume: '₹85k', orders: 22, status: 'Active', creditLimit: 30000, creditUsed: 28000, overdue: 5000, avatar: 'https://i.pravatar.cc/150?u=21' },
  { id: 3, name: 'Star Service Center', location: 'Delhi, DL', joined: '20 Sep 2023', volume: '₹42k', orders: 15, status: 'Inactive', creditLimit: 25000, creditUsed: 0, overdue: 0, avatar: 'https://i.pravatar.cc/150?u=22' },
  { id: 4, name: 'Luxury Cars Hub', location: 'Bangalore, KA', joined: '01 Oct 2024', volume: '₹0', orders: 0, status: 'Pending', creditLimit: 0, creditUsed: 0, overdue: 0, avatar: 'https://i.pravatar.cc/150?u=23' },
];

const requests = [
  { id: 101, name: 'Wheels & Axles Garage', location: 'Chennai, TN', type: 'Multi-brand', requested: '2 hours ago', avatar: 'https://i.pravatar.cc/150?u=30' },
  { id: 102, name: 'Speedy Repairs', location: 'Hyderabad, TS', type: 'Two-Wheeler Specialist', requested: '1 day ago', avatar: 'https://i.pravatar.cc/150?u=31' },
];

export default function VendorNetwork() {
  const [activeTab, setActiveTab] = useState<'partners' | 'requests' | 'credit'>('partners');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const filteredGarages = garages.filter(garage => {
      const matchesSearch = garage.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            garage.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All Status' || garage.status === statusFilter;
      return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
       <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold">Garage Network</h1>
             <p className="text-slate-500 text-sm">Manage relationships, requests, and credit limits.</p>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
             <span className="material-symbols-outlined">person_add</span>
             Invite Garage
          </button>
       </div>

       {/* Stats Overview */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
             <p className="text-slate-500 text-sm font-medium">Total Garages</p>
             <p className="text-2xl font-bold mt-1">24</p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
             <p className="text-slate-500 text-sm font-medium">Active Partners</p>
             <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-bold">21</p>
                <span className="text-green-500 text-xs font-medium">87% Active</span>
             </div>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-purple-500 transition-colors" onClick={() => setActiveTab('requests')}>
             <div className="flex justify-between items-start">
                <p className="text-slate-500 text-sm font-medium">Pending Requests</p>
                {requests.length > 0 && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
             </div>
             <p className="text-2xl font-bold mt-1 text-orange-500">{requests.length}</p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
             <p className="text-slate-500 text-sm font-medium">Credit Extended</p>
             <p className="text-2xl font-bold mt-1">₹4.5L</p>
          </div>
       </div>

       {/* Tabs */}
       <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button 
             onClick={() => setActiveTab('partners')}
             className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'partners' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
             My Partners
          </button>
          <button 
             onClick={() => setActiveTab('requests')}
             className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'requests' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
             Requests <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-xs">{requests.length}</span>
          </button>
          <button 
             onClick={() => setActiveTab('credit')}
             className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'credit' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
             Credit Management
          </button>
       </div>

       {/* Content based on Active Tab */}
       <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          
          {/* PARTNERS TAB */}
          {activeTab === 'partners' && (
             <>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex gap-4 flex-wrap">
                   <div className="relative flex-1 min-w-[200px] max-w-md">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                      <input 
                          type="text" 
                          placeholder="Search garages by Name or Location..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" 
                      />
                   </div>
                   <div className="flex gap-2 ml-auto">
                       <select 
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
                       >
                           <option>All Status</option>
                           <option>Active</option>
                           <option>Pending</option>
                           <option>Inactive</option>
                       </select>
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                         <tr>
                            <th className="p-4">Garage Name</th>
                            <th className="p-4">Location</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4">Monthly Vol</th>
                            <th className="p-4">Total Orders</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                         {filteredGarages.map(garage => (
                            <tr key={garage.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                               <td className="p-4">
                                  <Link to={`/vendor/network/${garage.id}`} className="flex items-center gap-3 group">
                                     <img src={garage.avatar} alt="" className="w-10 h-10 rounded-full bg-slate-200" />
                                     <div>
                                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">{garage.name}</p>
                                        <p className="text-xs text-slate-500">ID: GAR-{garage.id + 100}</p>
                                     </div>
                                  </Link>
                               </td>
                               <td className="p-4 text-slate-600 dark:text-slate-300">{garage.location}</td>
                               <td className="p-4 text-slate-500">{garage.joined}</td>
                               <td className="p-4 font-bold">{garage.volume}</td>
                               <td className="p-4 text-center">{garage.orders}</td>
                               <td className="p-4">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                      garage.status === 'Active' ? 'bg-green-100 text-green-700' :
                                      garage.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                      'bg-slate-100 text-slate-600'
                                  }`}>
                                     {garage.status}
                                  </span>
                               </td>
                               <td className="p-4 text-right">
                                  <Link to={`/vendor/network/${garage.id}`} className="text-slate-400 hover:text-purple-600 p-1 inline-block"><span className="material-symbols-outlined">visibility</span></Link>
                                  <button className="text-slate-400 hover:text-slate-600 p-1"><span className="material-symbols-outlined">more_vert</span></button>
                               </td>
                            </tr>
                         ))}
                         {filteredGarages.length === 0 && (
                             <tr>
                                 <td colSpan={7} className="p-8 text-center text-slate-500">
                                     No garages found.
                                 </td>
                             </tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </>
          )}

          {/* REQUESTS TAB */}
          {activeTab === 'requests' && (
             <div className="p-6">
                <h3 className="font-bold text-lg mb-4">Pending Connection Requests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {requests.map(req => (
                      <div key={req.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition-all bg-slate-50 dark:bg-slate-800/50">
                         <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                               <img src={req.avatar} className="w-12 h-12 rounded-full" alt="" />
                               <div>
                                  <h4 className="font-bold text-slate-900 dark:text-white">{req.name}</h4>
                                  <p className="text-xs text-slate-500">{req.location}</p>
                               </div>
                            </div>
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded">New</span>
                         </div>
                         <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
                            <div className="flex justify-between">
                               <span>Type</span>
                               <span className="font-medium text-slate-900 dark:text-white">{req.type}</span>
                            </div>
                            <div className="flex justify-between">
                               <span>Requested</span>
                               <span>{req.requested}</span>
                            </div>
                         </div>
                         <div className="flex gap-3">
                            <button className="flex-1 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700">Reject</button>
                            <button className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium">Accept</button>
                         </div>
                      </div>
                   ))}
                   {requests.length === 0 && (
                      <div className="col-span-full text-center py-10 text-slate-500">
                         <p>No pending connection requests.</p>
                      </div>
                   )}
                </div>
             </div>
          )}

          {/* CREDIT TAB */}
          {activeTab === 'credit' && (
             <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                   <div>
                      <h3 className="font-bold text-lg">Credit Overview</h3>
                      <p className="text-sm text-slate-500">Monitor credit usage and overdue payments.</p>
                   </div>
                   <button className="text-sm text-purple-600 font-medium hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">settings</span> Configure Default Terms
                   </button>
                </div>

                <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                         <tr>
                            <th className="p-4">Garage</th>
                            <th className="p-4">Credit Limit</th>
                            <th className="p-4 w-1/3">Utilization</th>
                            <th className="p-4 text-right">Available</th>
                            <th className="p-4 text-right">Overdue</th>
                            <th className="p-4 text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                         {garages.filter(g => g.status === 'Active').map(g => {
                            const usagePercent = Math.min(100, Math.round((g.creditUsed / g.creditLimit) * 100));
                            let barColor = 'bg-green-500';
                            if (usagePercent > 70) barColor = 'bg-yellow-500';
                            if (usagePercent > 90) barColor = 'bg-red-500';

                            return (
                               <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                  <td className="p-4 font-medium">
                                     <Link to={`/vendor/network/${g.id}`} className="hover:text-purple-600">{g.name}</Link>
                                  </td>
                                  <td className="p-4 text-slate-500">₹{g.creditLimit.toLocaleString()}</td>
                                  <td className="p-4">
                                     <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                           <div className={`h-full ${barColor}`} style={{ width: `${usagePercent}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold w-10 text-right">{usagePercent}%</span>
                                     </div>
                                     <p className="text-xs text-slate-400 mt-1">Used: ₹{g.creditUsed.toLocaleString()}</p>
                                  </td>
                                  <td className="p-4 text-right font-medium">₹{(g.creditLimit - g.creditUsed).toLocaleString()}</td>
                                  <td className={`p-4 text-right font-bold ${g.overdue > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                                     {g.overdue > 0 ? `₹${g.overdue.toLocaleString()}` : '-'}
                                  </td>
                                  <td className="p-4 text-right">
                                     <button className="text-slate-400 hover:text-purple-600 font-medium text-xs border border-slate-200 dark:border-slate-600 rounded px-2 py-1">Manage</button>
                                  </td>
                               </tr>
                            );
                         })}
                      </tbody>
                   </table>
                </div>
             </div>
          )}
       </div>
    </div>
  );
}