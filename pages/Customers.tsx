import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../App';

const customersData = [
  { id: 1, name: 'Jane Doe', contact: '+1 (555) 123-4567', email: 'jane.doe@example.com', vehicles: 2, jobs: 8, lastVisit: '2023-10-15', tier: 'Gold', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'John Smith', contact: '+1 (555) 987-6543', email: 'john.smith@example.com', vehicles: 1, jobs: 12, lastVisit: '2023-11-01', tier: 'Silver', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Alice Johnson', contact: '+1 (555) 234-5678', email: 'alice.j@example.com', vehicles: 1, jobs: 5, lastVisit: '2023-09-22', tier: 'Bronze', avatar: 'https://i.pravatar.cc/150?u=3' },
];

export default function Customers() {
  const [customers, setCustomers] = useState(customersData);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Logic to add customer would be here
      showToast('success', 'Customer added successfully');
      setShowModal(false);
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl font-bold">Customers</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2"
          >
             <span className="material-symbols-outlined text-lg">add</span>
             Add New Customer
          </button>
       </div>

       {/* Search & Filters */}
       <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex gap-4">
          <div className="flex-1 relative">
             <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
             <input type="text" placeholder="Search by name, phone, vehicle..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div className="flex gap-2">
             <button className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"><span className="material-symbols-outlined text-slate-600 dark:text-slate-300">filter_list</span></button>
             <button className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"><span className="material-symbols-outlined text-slate-600 dark:text-slate-300">download</span></button>
          </div>
       </div>

       {/* Customer List */}
       <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <tr>
                   <th className="p-4">Customer Name</th>
                   <th className="p-4">Contact</th>
                   <th className="p-4 text-center">Vehicles</th>
                   <th className="p-4 text-center">Total Jobs</th>
                   <th className="p-4">Last Visit</th>
                   <th className="p-4">Loyalty Tier</th>
                   <th className="p-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {customers.map(cust => (
                   <tr key={cust.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                         <Link to={`/customers/${cust.id}`} className="flex items-center gap-3 group">
                            <img src={cust.avatar} alt="" className="w-10 h-10 rounded-full" />
                            <div>
                               <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{cust.name}</p>
                               <p className="text-xs text-slate-500">{cust.email}</p>
                            </div>
                         </Link>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{cust.contact}</td>
                      <td className="p-4 text-center"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">{cust.vehicles}</span></td>
                      <td className="p-4 text-center font-bold">{cust.jobs}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{cust.lastVisit}</td>
                      <td className="p-4">
                         <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            cust.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                            cust.tier === 'Silver' ? 'bg-slate-200 text-slate-800' :
                            'bg-orange-100 text-orange-800'
                         }`}>
                            <span className="material-symbols-outlined text-[14px]">star</span>
                            {cust.tier}
                         </span>
                      </td>
                      <td className="p-4 text-right">
                         <Link to={`/customers/${cust.id}`} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 inline-block"><span className="material-symbols-outlined">visibility</span></Link>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>

       {/* Add Customer Modal */}
       {showModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
               <div className="bg-white dark:bg-[#1e293b] w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700">
                   <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                       <h3 className="text-lg font-bold">Add New Customer</h3>
                       <button onClick={() => setShowModal(false)}><span className="material-symbols-outlined text-slate-400">close</span></button>
                   </div>
                   <form onSubmit={handleSubmit} className="p-6 space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-sm font-medium mb-1">First Name</label>
                               <input type="text" required className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" />
                           </div>
                           <div>
                               <label className="block text-sm font-medium mb-1">Last Name</label>
                               <input type="text" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" />
                           </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-sm font-medium mb-1">Phone</label>
                               <input type="tel" required className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" />
                           </div>
                           <div>
                               <label className="block text-sm font-medium mb-1">Email</label>
                               <input type="email" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" />
                           </div>
                       </div>
                       <div>
                           <label className="block text-sm font-medium mb-1">Address</label>
                           <textarea className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" rows={2}></textarea>
                       </div>
                       
                       <div className="pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                           <p className="text-sm font-bold mb-2">Vehicle (Optional)</p>
                           <div className="grid grid-cols-2 gap-4">
                               <input type="text" placeholder="Reg Number" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" />
                               <input type="text" placeholder="Make & Model" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" />
                           </div>
                       </div>

                       <div className="pt-4 flex justify-end gap-3">
                           <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-sm font-medium">Cancel</button>
                           <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700">Save Customer</button>
                       </div>
                   </form>
               </div>
           </div>
       )}
    </div>
  );
}