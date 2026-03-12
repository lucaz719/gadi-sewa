import React, { useState, useEffect } from 'react';
import { useToast } from '../App';
import { db } from '../services/db';

export default function Financials() {
   const [transactions, setTransactions] = useState<any[]>([]);
   const [summary, setSummary] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [showModal, setShowModal] = useState(false);
   const { showToast } = useToast();

   const [formData, setFormData] = useState({
      amount: '',
      category: 'Service',
      customer: '',
      description: '',
      method: 'Cash'
   });

   const authUser = db.getAuthUser();

   const fetchData = async () => {
      setLoading(true);
      try {
         const entId = authUser?.enterprise_id;
         const [txns, summ] = await Promise.all([
            db.getTransactions(entId),
            db.getFinancialSummary(entId)
         ]);
         setTransactions(txns);
         setSummary(summ);
      } catch (err) {
         showToast('error', 'Failed to fetch financial data');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   const handleAddIncome = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         await db.logTransaction({
            type: 'Income',
            amount: parseFloat(formData.amount),
            category: formData.category,
            description: `${formData.customer} - ${formData.description}`,
            enterprise_id: authUser?.enterprise_id
         });
         showToast('success', 'Income record added');
         setShowModal(false);
         fetchData();
         setFormData({ amount: '', category: 'Service', customer: '', description: '', method: 'Cash' });
      } catch (err) {
         showToast('error', 'Failed to save income');
      }
   };

   return (
      <div className="space-y-6">
         <div className="flex flex-wrap justify-between items-center gap-4">
            <h1 className="text-3xl font-bold">Income & Profit</h1>
            <button
               onClick={() => setShowModal(true)}
               className="bg-primary-500 text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-primary-600 flex items-center gap-2"
            >
               <span className="material-symbols-outlined">add</span> Add Income
            </button>
         </div>

         {/* Stats */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
               <p className="text-slate-500 text-sm font-medium">Total Revenue</p>
               <p className="text-2xl font-bold mt-1">NPR {summary?.total_income?.toLocaleString() || '0'}</p>
            </div>
            <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
               <p className="text-slate-500 text-sm font-medium">Fixed Expenses</p>
               <p className="text-2xl font-bold mt-1 text-red-500">NPR {summary?.total_fixed_expenses?.toLocaleString() || '0'}</p>
            </div>
            <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
               <p className="text-slate-500 text-sm font-medium">Variable Expenses</p>
               <p className="text-2xl font-bold mt-1 text-orange-500">NPR {summary?.total_variable_expenses?.toLocaleString() || '0'}</p>
            </div>
            <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-[0_0_20px_rgba(34,197,94,0.15)] border-green-500/30">
               <p className="text-slate-500 text-sm font-medium font-bold text-green-600">Net Profit</p>
               <p className="text-2xl font-black mt-1 text-green-600">NPR {summary?.net_profit?.toLocaleString() || '0'}</p>
               <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Total Fixed + Var Deducted</p>
            </div>
         </div>

         {/* Transaction Table */}
         <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 font-bold text-sm uppercase tracking-widest text-slate-500">
               Recent Income Stream
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 border-b border-slate-200 dark:border-slate-700">
                     <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Description</th>
                        <th className="p-4">Amount</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                     {transactions.filter(t => t.type === 'Income').map(trn => (
                        <tr key={trn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                           <td className="p-4 text-slate-500">{new Date(trn.timestamp).toLocaleDateString()}</td>
                           <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`}>
                                 {trn.category}
                              </span>
                           </td>
                           <td className="p-4 text-slate-500">{trn.description}</td>
                           <td className="p-4 font-semibold text-green-600">NPR {trn.amount.toLocaleString()}</td>
                        </tr>
                     ))}
                     {transactions.filter(t => t.type === 'Income').length === 0 && (
                        <tr>
                           <td colSpan={4} className="p-8 text-center text-slate-400">No income records found.</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Add Income Modal */}
         {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
               <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                     <h3 className="text-lg font-bold">Record Income</h3>
                     <button onClick={() => setShowModal(false)}><span className="material-symbols-outlined text-slate-400">close</span></button>
                  </div>
                  <form onSubmit={handleAddIncome} className="p-6 space-y-4">
                     <div>
                        <label className="block text-sm font-medium mb-1">Amount (NPR)</label>
                        <input
                           type="number"
                           required
                           value={formData.amount}
                           onChange={e => setFormData({ ...formData, amount: e.target.value })}
                           className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                           placeholder="0.00"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                           value={formData.category}
                           onChange={e => setFormData({ ...formData, category: e.target.value })}
                           className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                        >
                           <option>Service</option>
                           <option>Parts Sale</option>
                           <option>Consultation</option>
                           <option>Other</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Customer Name</label>
                        <input
                           type="text"
                           value={formData.customer}
                           onChange={e => setFormData({ ...formData, customer: e.target.value })}
                           className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                           placeholder="Search or enter name"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <input
                           type="text"
                           value={formData.description}
                           onChange={e => setFormData({ ...formData, description: e.target.value })}
                           className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                           placeholder="Optional details"
                        />
                     </div>

                     <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-sm font-medium">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700">Save Income</button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
}