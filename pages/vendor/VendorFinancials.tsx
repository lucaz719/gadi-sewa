import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const revenueData = [
  { name: 'Jan', value: 45000 },
  { name: 'Feb', value: 52000 },
  { name: 'Mar', value: 48000 },
  { name: 'Apr', value: 61000 },
  { name: 'May', value: 55000 },
  { name: 'Jun', value: 75000 },
  { name: 'Jul', value: 82000 },
  { name: 'Aug', value: 78000 },
  { name: 'Sep', value: 95000 },
  { name: 'Oct', value: 110000 },
];

const invoices = [
  { id: 'INV-2024-001', date: '25 Oct 2024', garage: 'City Auto Works', amount: '₹12,500', due: '01 Nov 2024', status: 'Unpaid' },
  { id: 'INV-2024-002', date: '24 Oct 2024', garage: 'Quick Fix Mechanics', amount: '₹8,200', due: '31 Oct 2024', status: 'Paid' },
  { id: 'INV-2024-003', date: '22 Oct 2024', garage: 'Star Service Center', amount: '₹4,500', due: '29 Oct 2024', status: 'Overdue' },
  { id: 'INV-2024-004', date: '20 Oct 2024', garage: 'Luxury Cars Hub', amount: '₹22,000', due: '27 Oct 2024', status: 'Paid' },
  { id: 'INV-2024-005', date: '18 Oct 2024', garage: 'Mumbai Motors', amount: '₹15,750', due: '25 Oct 2024', status: 'Paid' },
];

const payouts = [
  { id: 'TXN-8821', date: '24 Oct 2024', period: '16 Oct - 22 Oct', amount: '₹42,500', status: 'Processed', method: 'Bank Transfer' },
  { id: 'TXN-8820', date: '17 Oct 2024', period: '09 Oct - 15 Oct', amount: '₹38,200', status: 'Processed', method: 'Bank Transfer' },
  { id: 'TXN-8819', date: '10 Oct 2024', period: '02 Oct - 08 Oct', amount: '₹45,000', status: 'Processed', method: 'Bank Transfer' },
  { id: 'TXN-8818', date: 'Pending', period: '23 Oct - 29 Oct', amount: '₹18,500', status: 'Pending', method: 'Bank Transfer' },
];

export default function VendorFinancials() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payouts'>('invoices');

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
             <h1 className="text-2xl font-bold">Financial Performance</h1>
             <p className="text-slate-500 text-sm">Track revenue, invoices, and platform settlements.</p>
          </div>
          <div className="flex gap-2">
             <button className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined">date_range</span> 
                This Year
             </button>
             <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md">
                <span className="material-symbols-outlined">download</span> Download Report
             </button>
          </div>
       </div>

       {/* Revenue Stats */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Revenue (YTD)</p>
                   <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">₹7,01,700</p>
                </div>
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                   <span className="material-symbols-outlined">trending_up</span>
                </div>
             </div>
             <p className="text-green-500 text-xs font-bold mt-2">+15% <span className="text-slate-400 font-normal">vs last year</span></p>
          </div>

          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Outstanding Invoices</p>
                   <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">₹17,000</p>
                </div>
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                   <span className="material-symbols-outlined">pending_actions</span>
                </div>
             </div>
             <p className="text-orange-500 text-xs font-bold mt-2">3 Invoices <span className="text-slate-400 font-normal">pending payment</span></p>
          </div>

          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Avg. Order Value</p>
                   <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">₹8,500</p>
                </div>
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                   <span className="material-symbols-outlined">shopping_cart</span>
                </div>
             </div>
             <p className="text-slate-400 text-xs mt-2">Based on last 30 days</p>
          </div>

          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Next Payout</p>
                   <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">₹18,500</p>
                </div>
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                   <span className="material-symbols-outlined">account_balance_wallet</span>
                </div>
             </div>
             <p className="text-slate-400 text-xs mt-2">Scheduled for <span className="font-bold text-slate-600 dark:text-slate-300">Oct 31</span></p>
          </div>
       </div>

       {/* Chart */}
       <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold">Revenue Growth</h3>
             <div className="flex gap-2">
                 <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-3 h-3 bg-purple-500 rounded-full"></div> Gross Sales</span>
             </div>
          </div>
          <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                   <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                   <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                   />
                   <Area type="monotone" dataKey="value" stroke="#9333ea" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
       </div>

       {/* Transactions Section */}
       <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col">
          <div className="flex border-b border-slate-200 dark:border-slate-700">
             <button 
                onClick={() => setActiveTab('invoices')}
                className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'invoices' ? 'border-purple-600 text-purple-600 bg-slate-50 dark:bg-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
             >
                Invoices & Receivables
             </button>
             <button 
                onClick={() => setActiveTab('payouts')}
                className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'payouts' ? 'border-purple-600 text-purple-600 bg-slate-50 dark:bg-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
             >
                Platform Settlements (Payouts)
             </button>
          </div>

          <div className="overflow-x-auto">
             {activeTab === 'invoices' && (
                 <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                       <tr>
                          <th className="p-4">Invoice ID</th>
                          <th className="p-4">Date Issued</th>
                          <th className="p-4">Garage</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Due Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                       {invoices.map(inv => (
                          <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                             <td className="p-4 font-mono text-xs font-bold text-slate-600 dark:text-slate-400">{inv.id}</td>
                             <td className="p-4 text-slate-500">{inv.date}</td>
                             <td className="p-4 font-medium text-slate-900 dark:text-white">{inv.garage}</td>
                             <td className="p-4 font-bold">{inv.amount}</td>
                             <td className="p-4 text-slate-500">{inv.due}</td>
                             <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                   inv.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                   inv.status === 'Unpaid' ? 'bg-yellow-100 text-yellow-700' :
                                   'bg-red-100 text-red-700'
                                }`}>
                                   {inv.status}
                                </span>
                             </td>
                             <td className="p-4 text-right">
                                <button className="text-slate-400 hover:text-purple-600 p-1"><span className="material-symbols-outlined">download</span></button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
             )}

             {activeTab === 'payouts' && (
                 <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                       <tr>
                          <th className="p-4">Transaction ID</th>
                          <th className="p-4">Settlement Date</th>
                          <th className="p-4">Period</th>
                          <th className="p-4">Method</th>
                          <th className="p-4">Net Amount</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Statement</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                       {payouts.map(pay => (
                          <tr key={pay.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                             <td className="p-4 font-mono text-xs font-bold text-slate-600 dark:text-slate-400">{pay.id}</td>
                             <td className="p-4 text-slate-500">{pay.date}</td>
                             <td className="p-4 text-slate-500">{pay.period}</td>
                             <td className="p-4 text-slate-900 dark:text-white">{pay.method}</td>
                             <td className="p-4 font-bold text-green-600">{pay.amount}</td>
                             <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                   pay.status === 'Processed' ? 'bg-green-100 text-green-700' :
                                   'bg-slate-100 text-slate-600'
                                }`}>
                                   {pay.status}
                                </span>
                             </td>
                             <td className="p-4 text-right">
                                <button className="text-purple-600 font-medium text-xs hover:underline">View</button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
             )}
          </div>
       </div>
    </div>
  );
}