import React, { useState, useEffect } from 'react';
import { db } from '../services/db';

export default function Subscription() {
  const [enterprise, setEnterprise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const authUser = db.getAuthUser();
  const enterpriseId = authUser?.enterprise_id;

  const loadSubscription = async () => {
    if (!enterpriseId) return;
    setLoading(true);
    try {
      // Use the existing enterprise detail endpoint
      const data = await db.getEnterpriseDetail(enterpriseId);
      setEnterprise(data);
    } catch (err) {
      console.error("Failed to load subscription plan", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSubscription(); }, [enterpriseId]);

  if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse font-bold uppercase tracking-widest text-[10px]">Synchronizing Plan Intelligence...</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
       <div className="mb-4">
          <h1 className="text-4xl font-black tracking-tighter">Billing & Governance</h1>
          <p className="text-slate-500 text-sm font-medium">Configure enterprise subscription, usage quotas, and fiscal history.</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Plan Card */}
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-primary-600 dark:to-primary-800 rounded-3xl p-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden group">
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-6">
                      <div>
                         <p className="text-primary-100/60 text-[10px] font-black uppercase tracking-widest mb-2">Current Active Tier</p>
                         <h2 className="text-4xl font-black tracking-tighter">{enterprise?.plan_id?.toUpperCase() || 'STARTER'}</h2>
                      </div>
                      <div className="flex flex-col items-end">
                          <span className="bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 shadow-xl mb-2">Active Status</span>
                          <p className="text-[10px] font-bold text-primary-200">UID: #{enterprise?.id}</p>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-8 mb-8">
                      <div>
                         <p className="text-primary-200/50 text-[10px] font-black uppercase tracking-widest mb-2">Commitment</p>
                         <p className="font-black text-2xl tracking-tight">Rs. {enterprise?.plan_id === 'enterprise' ? 'Custom' : '4,999'}<span className="text-sm font-bold text-primary-200/40">/MO</span></p>
                      </div>
                      <div>
                         <p className="text-primary-200/50 text-[10px] font-black uppercase tracking-widest mb-2">Next Billing Date</p>
                         <p className="font-black text-2xl tracking-tight">Nov 24, 2024</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                         <span className="material-symbols-outlined text-primary-300">verified</span>
                         <span className="text-[10px] font-black uppercase tracking-widest">Unlimited Jobs</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                         <span className="material-symbols-outlined text-primary-300">hub</span>
                         <span className="text-[10px] font-black uppercase tracking-widest">Multi-Branch</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                         <span className="material-symbols-outlined text-primary-300">support_agent</span>
                         <span className="text-[10px] font-black uppercase tracking-widest">24/7 Priority</span>
                      </div>
                   </div>
                </div>
                <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                    <span className="material-symbols-outlined text-[150px]">auto_awesome</span>
                </div>
             </div>

             {/* Usage Statistics */}
             <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-black text-xl tracking-tighter">Quota Utilization</h3>
                    <button className="text-[10px] font-black text-primary-600 bg-primary-50 dark:bg-primary-900/10 px-4 py-2 rounded-full uppercase tracking-widest">Refresh Usage</button>
                </div>
                <div className="space-y-6">
                   <div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-slate-500">
                         <span>Active Seat Licenses</span>
                         <span className="text-slate-900 dark:text-white">3 / 10</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                         <div className="h-full bg-primary-500 w-[30%] shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all duration-1000"></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-slate-500">
                         <span>Messaging Throughput (Monthly)</span>
                         <span className="text-slate-900 dark:text-white">850 / 5,000</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                         <div className="h-full bg-green-500 w-[17%] shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all duration-1000"></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-slate-500">
                         <span>Encrypted Cloud Storage</span>
                         <span className="text-slate-900 dark:text-white">1.2 GB / 50 GB</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                         <div className="h-full bg-purple-500 w-[3%] shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-1000"></div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Billing History */}
             <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/30">
                   <h3 className="font-black text-lg tracking-tighter">Fiscal History</h3>
                   <button className="text-[10px] font-black text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest">Audit Logs</button>
                </div>
                <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                         <th className="p-6 text-[10px] font-black uppercase tracking-widest">Cycle Date</th>
                         <th className="p-6 text-[10px] font-black uppercase tracking-widest">Description</th>
                         <th className="p-6 text-[10px] font-black uppercase tracking-widest">Aggregate</th>
                         <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest">Record</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                         <td className="p-6 text-[10px] font-black text-slate-500 uppercase">Oct 24, 2024</td>
                         <td className="p-6 font-bold text-slate-900 dark:text-white">{enterprise?.plan_id?.toUpperCase() || 'STARTER'} - Monthly Cycle</td>
                         <td className="p-6 font-black text-slate-900 dark:text-white">Rs. 4,999</td>
                         <td className="p-6 text-right"><button className="text-primary-600 font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-1 justify-end ml-auto"><span className="material-symbols-outlined text-sm">download</span> PDF</button></td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                         <td className="p-6 text-[10px] font-black text-slate-500 uppercase">Sep 24, 2024</td>
                         <td className="p-6 font-bold text-slate-900 dark:text-white">{enterprise?.plan_id?.toUpperCase() || 'STARTER'} - Monthly Cycle</td>
                         <td className="p-6 font-black text-slate-900 dark:text-white">Rs. 4,999</td>
                         <td className="p-6 text-right"><button className="text-primary-600 font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-1 justify-end ml-auto"><span className="material-symbols-outlined text-sm">download</span> PDF</button></td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </div>

          {/* Right Sidebar: Upgrade & Payment */}
          <div className="space-y-8">
             <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                <h3 className="font-black text-xl tracking-tighter mb-6">Elevate Scale</h3>
                <div className="p-6 border-2 border-primary-500/20 bg-primary-50/30 dark:bg-primary-500/5 rounded-3xl mb-6 relative overflow-hidden">
                   <div className="flex justify-between items-center mb-4">
                      <h4 className="font-black text-primary-600 dark:text-primary-400 text-sm uppercase tracking-widest">Professional</h4>
                      <span className="text-[10px] font-black bg-primary-600 text-white px-3 py-1 rounded-full shadow-lg pulse">RECO</span>
                   </div>
                   <p className="text-3xl font-black mb-1 tracking-tighter">Rs. 9,999<span className="text-sm font-bold text-slate-400">/MO</span></p>
                   <p className="text-[10px] text-slate-500 font-medium mb-6 uppercase tracking-widest">+ Analytics & Multi-Store</p>
                   <button className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-[0.98]">Switch Instance</button>
                </div>
                <button className="w-full py-4 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Dimension Comparison</button>
             </div>

             <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                <h3 className="font-black text-xl tracking-tighter mb-6">Fiscal Authority</h3>
                <div className="flex items-center gap-4 p-5 border border-slate-200 dark:border-slate-700 rounded-2xl mb-6 bg-slate-50/50 dark:bg-slate-800/50">
                   <div className="w-12 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-[10px] font-black text-white">VISA</div>
                   <div className="flex-1">
                      <p className="text-sm font-black tracking-widest text-slate-900 dark:text-white">•••• 4242</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Exp 12/26</p>
                   </div>
                   <span className="material-symbols-outlined text-green-500">verified</span>
                </div>
                <button className="w-full py-4 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Update Method</button>
             </div>
          </div>
       </div>
    </div>
  );
}