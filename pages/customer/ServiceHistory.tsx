import React, { useState } from 'react';

const history = [
  { id: 'JOB-12345', date: '20 Aug 2024', vehicle: 'Toyota Camry', garage: 'City Auto Works', service: 'General Service, Oil Change', cost: '₹4,500', status: 'Completed', invoice: 'INV-1001' },
  { id: 'JOB-11200', date: '15 May 2024', vehicle: 'Toyota Camry', garage: 'Quick Fix Mechanics', service: 'Brake Pad Replacement', cost: '₹2,800', status: 'Completed', invoice: 'INV-0854' },
  { id: 'JOB-09800', date: '10 Jan 2024', vehicle: 'Honda Activa 6G', garage: 'City Auto Works', service: 'Full Service', cost: '₹1,200', status: 'Completed', invoice: 'INV-0620' },
];

export default function ServiceHistory() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(item => 
      item.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.garage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
       <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold">Service History</h1>
             <p className="text-slate-500 text-sm">View past services and download invoices.</p>
          </div>
          <div className="relative">
             <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
             <input 
                type="text" 
                placeholder="Search history..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none w-64" 
             />
          </div>
       </div>

       <div className="space-y-4">
           {filteredHistory.map(job => (
               <div key={job.id} className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all">
                   <div className="flex items-start gap-4">
                       <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                           <span className="material-symbols-outlined">build</span>
                       </div>
                       <div>
                           <div className="flex flex-wrap gap-2 items-center mb-1">
                               <h3 className="font-bold text-lg text-slate-900 dark:text-white">{job.garage}</h3>
                               <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">{job.date}</span>
                           </div>
                           <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{job.vehicle}</p>
                           <p className="text-xs text-slate-500">{job.service}</p>
                       </div>
                   </div>
                   
                   <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-100 dark:border-slate-700 pt-4 md:pt-0">
                       <div className="text-right">
                           <p className="text-xs text-slate-500">Total Cost</p>
                           <p className="font-bold text-lg">{job.cost}</p>
                       </div>
                       <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors">
                           <span className="material-symbols-outlined text-lg">download</span> Invoice
                       </button>
                   </div>
               </div>
           ))}
           {filteredHistory.length === 0 && (
               <div className="text-center py-12 text-slate-500">
                   <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">history</span>
                   <p>No service history found.</p>
               </div>
           )}
       </div>
    </div>
  );
}