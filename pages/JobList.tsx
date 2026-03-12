import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const jobs = [
  { id: 'JOB-12345', customer: 'John Doe', vehicle: 'Toyota Camry', reg: 'MH-01-AB-1234', status: 'New', date: '24 Oct, 2024', amount: '₹4,500' },
  { id: 'JOB-12346', customer: 'Jane Smith', vehicle: 'Honda Civic', reg: 'MH-02-XY-9876', status: 'In Progress', date: '24 Oct, 2024', amount: '₹12,000' },
  { id: 'JOB-12347', customer: 'Mike Ross', vehicle: 'Ford Endeavour', reg: 'MH-04-QQ-1111', status: 'Waiting Parts', date: '23 Oct, 2024', amount: '₹25,000' },
  { id: 'JOB-12348', customer: 'Rachel Zane', vehicle: 'Hyundai Creta', reg: 'MH-03-ZZ-2222', status: 'Ready', date: '22 Oct, 2024', amount: '₹8,500' },
];

export default function JobList() {
  const [filter, setFilter] = useState('All');

  return (
    <div className="space-y-6">
       <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold">Job Management</h1>
             <p className="text-slate-500 text-sm">List view of all active and past jobs.</p>
          </div>
          <div className="flex gap-2">
             <Link to="/jobs" className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                Board View
             </Link>
             <Link to="/jobs/new" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined">add</span> New Job
             </Link>
          </div>
       </div>

       <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          {/* Filters */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                  <input type="text" placeholder="Search jobs..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div className="flex gap-2">
                 {['All', 'New', 'In Progress', 'Ready', 'Completed'].map(f => (
                     <button 
                        key={f} 
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filter === f ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                     >
                         {f}
                     </button>
                 ))}
              </div>
          </div>

          <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                   <th className="p-4">Job ID</th>
                   <th className="p-4">Date</th>
                   <th className="p-4">Customer</th>
                   <th className="p-4">Vehicle</th>
                   <th className="p-4">Status</th>
                   <th className="p-4">Est. Amount</th>
                   <th className="p-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {jobs.map(job => (
                   <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                         <Link to={`/jobs/${job.id}`} className="font-bold text-primary-600 hover:underline">{job.id}</Link>
                      </td>
                      <td className="p-4 text-slate-500">{job.date}</td>
                      <td className="p-4 font-medium">{job.customer}</td>
                      <td className="p-4">
                         <p className="text-slate-900 dark:text-white">{job.vehicle}</p>
                         <p className="text-xs text-slate-500">{job.reg}</p>
                      </td>
                      <td className="p-4">
                         <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            job.status === 'New' ? 'bg-blue-100 text-blue-700' :
                            job.status === 'In Progress' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                         }`}>
                            {job.status}
                         </span>
                      </td>
                      <td className="p-4 font-bold">{job.amount}</td>
                      <td className="p-4 text-right">
                         <Link to={`/jobs/${job.id}`} className="text-slate-400 hover:text-slate-600 p-1"><span className="material-symbols-outlined">visibility</span></Link>
                         <button className="text-slate-400 hover:text-slate-600 p-1"><span className="material-symbols-outlined">more_vert</span></button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}