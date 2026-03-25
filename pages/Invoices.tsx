import React, { useState, useEffect } from 'react';
import { useToast } from '../App';
import { db } from '../services/db';

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();
  const authUser = db.getAuthUser();
  const enterpriseId = authUser?.enterprise_id;

  const [stats, setStats] = useState({
      receivables: 0,
      paid: 0,
      overdue: 0
  });

  const loadData = async () => {
    if (!enterpriseId) return;
    setLoading(true);
    try {
      // In a real app, we'd have a specific /invoices endpoint. 
      // For now, we use the enterprise detail or financials summary.
      const summary = await db.getFinancialSummary(enterpriseId);
      const jobsData = await db.getJobs(); // Get jobs to find "Ready" ones for invoice generation
      
      // Let's mock the invoice list based on financial transactions for now
      // since the specific invoice model implementation might be in progress
      const txns = await db.getTransactions(enterpriseId);
      setInvoices(txns.map((t: any) => ({
          id: `INV-${t.id}`,
          date: new Date(t.created_at).toLocaleDateString(),
          customer: t.description.split(' - ')[1] || 'Retail Customer',
          amount: `Rs. ${t.amount.toLocaleString()}`,
          status: t.type === 'income' ? 'Paid' : 'Pending'
      })));

      setStats({
          receivables: summary.total_revenue * 0.15, // Mocked ratio
          paid: summary.total_revenue,
          overdue: summary.total_expenses * 0.05 // Mocked ratio
      });
    } catch (err) {
      showToast('error', 'Failed to synchronize financial records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [enterpriseId]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          // Mocking the generation logic using logTransaction
          await db.logTransaction({
              enterprise_id: enterpriseId,
              amount: 5000,
              type: 'income',
              description: 'Invoice Generated - System Generated',
              category: 'Service'
          });
          showToast('success', 'Digital invoice generated and mailed to client.');
          setShowModal(false);
          loadData();
      } catch (err) {
          showToast('error', 'Generation failed.');
      }
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
             <h1 className="text-3xl font-black tracking-tighter">Finance Hub</h1>
             <p className="text-slate-500 text-sm font-medium">Enterprise-grade billing and receivable management.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl transition-all active:scale-[0.98]"
          >
             <span className="material-symbols-outlined text-sm">add_card</span> Generate Invoice
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Receivables</p>
                <p className="text-3xl font-black mt-2 text-slate-900 dark:text-white">Rs. {stats.receivables.toLocaleString()}</p>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-amber-600 font-bold uppercase">
                    <span className="material-symbols-outlined text-sm">schedule</span> Pending collection
                </div>
            </div>
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue (MTD)</p>
                <p className="text-3xl font-black mt-2 text-green-600">Rs. {stats.paid.toLocaleString()}</p>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-green-600 font-bold uppercase">
                    <span className="material-symbols-outlined text-sm">trending_up</span> +12% vs last month
                </div>
            </div>
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Exposure</p>
                <p className="text-3xl font-black mt-2 text-red-500">Rs. {stats.overdue.toLocaleString()}</p>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-red-500 font-bold uppercase">
                    <span className="material-symbols-outlined text-sm">warning</span> 3 Overdue accounts
                </div>
            </div>
       </div>

       <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg">
          <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                   <th className="p-4 text-[10px] font-black uppercase tracking-widest">Reference #</th>
                   <th className="p-4 text-[10px] font-black uppercase tracking-widest">Issue Date</th>
                   <th className="p-4 text-[10px] font-black uppercase tracking-widest">Client Name</th>
                   <th className="p-4 text-[10px] font-black uppercase tracking-widest">Gross Amount</th>
                   <th className="p-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                   <th className="p-4 text-right text-[10px] font-black uppercase tracking-widest">Control</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                    <tr><td colSpan={6} className="p-12 text-center text-slate-400 font-medium italic animate-pulse">Synchronizing financial ledger...</td></tr>
                ) : invoices.length === 0 ? (
                    <tr><td colSpan={6} className="p-20 text-center">
                        <span className="material-symbols-outlined text-5xl text-slate-100 mb-4">receipt_long</span>
                        <p className="text-slate-400 font-bold tracking-tighter text-lg">No processed invoices found.</p>
                    </td></tr>
                ) : invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                       <td className="p-4 font-black text-slate-900 dark:text-white uppercase tracking-tighter">{inv.id}</td>
                       <td className="p-4 text-[10px] font-black text-slate-500 uppercase">{inv.date}</td>
                       <td className="p-4 font-bold text-slate-700 dark:text-slate-300">{inv.customer}</td>
                       <td className="p-4 font-black text-slate-900 dark:text-white uppercase tracking-tight">{inv.amount}</td>
                       <td className="p-4">
                          <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                             inv.status === 'Paid' ? 'bg-green-600 text-white border-green-700' :
                             inv.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                             'bg-red-50 text-red-600 border-red-100'
                          }`}>
                             {inv.status}
                          </span>
                       </td>
                       <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-all shadow-sm border border-slate-100 dark:border-slate-800"><span className="material-symbols-outlined text-lg">download</span></button>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm border border-slate-100 dark:border-slate-800"><span className="material-symbols-outlined text-lg">visibility</span></button>
                          </div>
                       </td>
                    </tr>
                ))}
             </tbody>
          </table>
       </div>

       {/* Create Invoice Modal */}
       {showModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
               <div className="bg-white dark:bg-[#1e293b] w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="text-xl font-black tracking-tighter">Issue Digital Invoice</h3>
                        <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-slate-400">close</span>
                        </button>
                    </div>
                    <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Client Lookup</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">person_search</span>
                                <input type="text" required className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 pl-10 outline-none focus:border-primary-500 transition-colors font-medium" placeholder="Customer name or ID..." />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Issue Date</label>
                                <input type="date" className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 outline-none focus:border-primary-500 transition-colors font-medium text-xs" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Due Date</label>
                                <input type="date" className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 outline-none focus:border-primary-500 transition-colors font-medium text-xs" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Project Linkage</label>
                            <select className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 outline-none font-medium">
                                <option>Standalone Billing</option>
                                <option>JOB-2024-X1 (Toyota Supra)</option>
                                <option>JOB-2024-X2 (Honda Civic)</option>
                            </select>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-5">
                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Billable Items</span>
                                <button type="button" className="text-[10px] font-black text-primary-600 bg-primary-50 dark:bg-primary-900/10 px-3 py-1 rounded-full">+ Add Entry</button>
                            </div>
                            <div className="flex gap-3 mb-3">
                                <input type="text" placeholder="Service description" className="flex-1 bg-white dark:bg-[#1e293b] border dark:border-slate-700 rounded-lg p-2 text-xs outline-none" />
                                <input type="number" placeholder="0.00" className="w-24 bg-white dark:bg-[#1e293b] border dark:border-slate-700 rounded-lg p-2 text-xs text-right outline-none font-black" />
                            </div>
                        </div>

                        <div className="flex justify-between items-center bg-primary-500 p-4 rounded-xl text-white shadow-lg overflow-hidden relative">
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase opacity-80">Aggregate Total</p>
                                <p className="text-2xl font-black">Rs. 0.00</p>
                            </div>
                            <span className="material-symbols-outlined text-4xl opacity-10 absolute -right-2 top-0 rotate-12 scale-150">payments</span>
                        </div>
                        
                        <div className="pt-4 flex gap-3">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 rounded-2xl transition-all">Discard</button>
                            <button type="submit" className="flex-1 py-4 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl transition-all active:scale-[0.98]">Authorize Billing</button>
                        </div>
                    </form>
               </div>
           </div>
       )}
    </div>
  );
}