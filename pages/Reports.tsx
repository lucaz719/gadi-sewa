import React, { useState, useEffect } from 'react';
import {
   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
   LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { db } from '../services/db';
import { useToast } from '../App';

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

export default function Reports() {
   const [financialTrends, setFinancialTrends] = useState([]);
   const [jobAnalytics, setJobAnalytics] = useState<any>(null);
   const [inventoryVal, setInventoryVal] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const { showToast } = useToast();

   const user = db.getAuthUser();

   const loadData = async () => {
      setLoading(true);
      try {
         const [trends, jobs, inv] = await Promise.all([
            db.getFinancialTrends(user?.enterprise_id),
            db.getJobAnalytics(user?.enterprise_id),
            db.getInventoryValuation()
         ]);
         setFinancialTrends(trends);
         setJobAnalytics(jobs);
         setInventoryVal(inv);
      } catch (err) {
         showToast('error', 'Failed to load reporting data.');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => { loadData(); }, []);

   if (loading) return <div className="p-10 text-center animate-pulse text-slate-400 italic">Assembling Business Intelligence...</div>;

   return (
      <div className="space-y-10 animate-fade-in pb-20">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">Reports & Analytics</h1>
               <p className="text-slate-500 font-medium">Real-time insights into your garage ecosystem.</p>
            </div>
            <button
               onClick={loadData}
               className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-all shadow-lg hover:shadow-red-500/20"
            >
               <span className="material-symbols-outlined text-sm">refresh</span>
               Refresh Data
            </button>
         </div>

         {/* Top Metrics Row */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white dark:bg-[#1e293b] rounded-3xl border dark:border-slate-800 shadow-sm">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Labor Revenue</p>
               <p className="text-2xl font-black text-red-600">Rs. {jobAnalytics?.labor_revenue?.toLocaleString()}</p>
               <p className="text-[10px] text-green-500 font-bold mt-2">↑ 8.4% vs last month</p>
            </div>
            <div className="p-6 bg-white dark:bg-[#1e293b] rounded-3xl border dark:border-slate-800 shadow-sm">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Stock Valuation</p>
               <p className="text-2xl font-black text-blue-600">Rs. {inventoryVal?.total_valuation?.toLocaleString()}</p>
               <p className="text-[10px] text-slate-400 font-bold mt-2">{inventoryVal?.total_units} units on hand</p>
            </div>
            <div className="p-6 bg-white dark:bg-[#1e293b] rounded-3xl border dark:border-slate-800 shadow-sm">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Job Load</p>
               <p className="text-2xl font-black text-emerald-600">{jobAnalytics?.total_jobs} Active</p>
               <p className="text-[10px] text-slate-400 font-bold mt-2">{jobAnalytics?.completed_jobs} finished today</p>
            </div>
            <div className="p-6 bg-red-600 text-white rounded-3xl shadow-xl shadow-red-500/20">
               <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Net Profit</p>
               <p className="text-2xl font-black">Rs. {financialTrends[financialTrends.length - 1]?.profit?.toLocaleString()}</p>
               <button className="mt-4 w-full py-2 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/30 transition-all">Download P&L</button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Trends */}
            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm flex flex-col h-[450px]">
               <div className="mb-8">
                  <h2 className="text-lg font-black italic uppercase tracking-tight">Financial Growth</h2>
                  <p className="text-xs text-slate-400">Monthly income vs expense analysis.</p>
               </div>
               <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={financialTrends}>
                        <defs>
                           <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415520" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="income" stroke="#ef4444" fillOpacity={1} fill="url(#colorIncome)" />
                        <Area type="monotone" dataKey="expense" stroke="#3b82f6" fill="#3b82f620" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Job Status Distribution */}
            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm flex flex-col h-[450px]">
               <div className="mb-8">
                  <h2 className="text-lg font-black italic uppercase tracking-tight">Job Load Balance</h2>
                  <p className="text-xs text-slate-400">Current active job card status distribution.</p>
               </div>
               <div className="flex-1 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/2 aspect-square">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={jobAnalytics?.status_breakdown}
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                           >
                              {jobAnalytics?.status_breakdown.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                           </Pie>
                           <Tooltip />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
                  <div className="w-full md:w-1/2 space-y-3">
                     {jobAnalytics?.status_breakdown.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                           <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase">{item.name}</span>
                           </div>
                           <span className="text-sm font-black">{item.value} Jobs</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Inventory Valuation by Category */}
            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm lg:col-span-2 h-[450px] flex flex-col">
               <div className="mb-8">
                  <h2 className="text-lg font-black italic uppercase tracking-tight">Inventory Capital</h2>
                  <p className="text-xs text-slate-400">Valuation breakdown by product category.</p>
               </div>
               <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={inventoryVal?.category_valuation}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415520" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#ef4444" radius={[10, 10, 0, 0]} barSize={40} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>
      </div>
   );
}