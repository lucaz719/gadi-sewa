import React, { useState } from 'react';
import { useToast } from '../App';

const invoicesData = [
  { id: 'INV-1001', date: '24 Oct, 2024', customer: 'John Doe', amount: '₹4,500', status: 'Paid' },
  { id: 'INV-1002', date: '23 Oct, 2024', customer: 'Jane Smith', amount: '₹12,000', status: 'Pending' },
  { id: 'INV-1003', date: '22 Oct, 2024', customer: 'Mike Ross', amount: '₹8,500', status: 'Overdue' },
];

export default function Invoices() {
  const [invoices, setInvoices] = useState(invoicesData);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  const handleCreateInvoice = (e: React.FormEvent) => {
      e.preventDefault();
      showToast('success', 'Invoice generated and sent');
      setShowModal(false);
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold">Invoices</h1>
             <p className="text-slate-500 text-sm">Manage billing and payments.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2"
          >
             <span className="material-symbols-outlined">add</span> Create Invoice
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
               <p className="text-xs font-bold text-slate-500 uppercase">Total Receivables</p>
               <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">₹24,500</p>
           </div>
           <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
               <p className="text-xs font-bold text-slate-500 uppercase">Paid This Month</p>
               <p className="text-2xl font-bold mt-1 text-green-600">₹1,45,000</p>
           </div>
           <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
               <p className="text-xs font-bold text-slate-500 uppercase">Overdue</p>
               <p className="text-2xl font-bold mt-1 text-red-500">₹8,500</p>
           </div>
       </div>

       <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                   <th className="p-4">Invoice #</th>
                   <th className="p-4">Date</th>
                   <th className="p-4">Customer</th>
                   <th className="p-4">Amount</th>
                   <th className="p-4">Status</th>
                   <th className="p-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {invoices.map(inv => (
                   <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-mono text-xs">{inv.id}</td>
                      <td className="p-4 text-slate-500">{inv.date}</td>
                      <td className="p-4 font-medium">{inv.customer}</td>
                      <td className="p-4 font-bold">{inv.amount}</td>
                      <td className="p-4">
                         <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            inv.status === 'Paid' ? 'bg-green-100 text-green-700' :
                            inv.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                         }`}>
                            {inv.status}
                         </span>
                      </td>
                      <td className="p-4 text-right">
                         <button className="text-slate-400 hover:text-primary-600 p-1"><span className="material-symbols-outlined">download</span></button>
                         <button className="text-slate-400 hover:text-slate-600 p-1"><span className="material-symbols-outlined">visibility</span></button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>

       {/* Create Invoice Modal */}
       {showModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
               <div className="bg-white dark:bg-[#1e293b] w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700">
                   <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                       <h3 className="text-lg font-bold">New Invoice</h3>
                       <button onClick={() => setShowModal(false)}><span className="material-symbols-outlined text-slate-400">close</span></button>
                   </div>
                   <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
                       <div>
                           <label className="block text-sm font-medium mb-1">Customer</label>
                           <input type="text" required className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" placeholder="Search customer..." />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-sm font-medium mb-1">Invoice Date</label>
                               <input type="date" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" />
                           </div>
                           <div>
                               <label className="block text-sm font-medium mb-1">Due Date</label>
                               <input type="date" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" />
                           </div>
                       </div>
                       
                       <div>
                           <label className="block text-sm font-medium mb-1">Job Reference (Optional)</label>
                           <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500">
                               <option>None (Manual Invoice)</option>
                               <option>JOB-12345 (John Doe)</option>
                           </select>
                       </div>

                       <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-slate-800">
                           <div className="flex justify-between items-center mb-2">
                               <span className="font-bold text-sm">Line Items</span>
                               <button type="button" className="text-xs text-primary-600 hover:underline">+ Add Item</button>
                           </div>
                           <div className="flex gap-2 text-sm mb-2">
                               <input type="text" placeholder="Item" className="flex-1 p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900" />
                               <input type="number" placeholder="Cost" className="w-20 p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-right" />
                           </div>
                       </div>

                       <div className="text-right">
                           <p className="text-sm">Total Amount: <span className="font-bold text-lg ml-2">₹0.00</span></p>
                       </div>
                       
                       <div className="pt-4 flex justify-end gap-3">
                           <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-sm font-medium">Cancel</button>
                           <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700">Generate Invoice</button>
                       </div>
                   </form>
               </div>
           </div>
       )}
    </div>
  );
}