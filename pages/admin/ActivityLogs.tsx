import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';

export default function ActivityLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await db.getActivityLogs();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}, ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  };

  const filteredLogs = logs.filter(log => {
      if (filter === 'All') return true;
      if (filter === 'Jobs' && log.entity.toLowerCase().includes('job')) return true;
      if (filter === 'Inventory' && log.entity.toLowerCase().includes('inventory')) return true;
      if (filter === 'Users' && log.entity.toLowerCase().includes('user')) return true;
      if (filter === 'System' && log.entity.toLowerCase().includes('system')) return true;
      return false;
  });

  return (
    <div className="space-y-6">
       <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold">Activity Logs</h1>
             <p className="text-slate-500 text-sm">Audit trail of all system actions.</p>
          </div>
          <div className="flex gap-2">
             <button className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined">download</span> Export CSV
             </button>
          </div>
       </div>

       {/* Filters */}
       <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
          {['All', 'Jobs', 'Inventory', 'Users', 'System'].map(f => (
             <button 
               key={f}
               onClick={() => setFilter(f)}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
             >
                {f}
             </button>
          ))}
       </div>

       {/* Logs Table */}
       <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                   <th className="p-4">Timestamp</th>
                   <th className="p-4">User</th>
                   <th className="p-4">Action</th>
                   <th className="p-4">Entity</th>
                   <th className="p-4">Details</th>
                   <th className="p-4 text-right"></th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">Loading activity logs...</td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">No activity logs found for this filter.</td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                   <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-mono text-xs text-slate-500">{formatDate(log.timestamp)}</td>
                      <td className="p-4 font-medium text-slate-900 dark:text-white">{log.user_name || log.user}</td>
                      <td className="p-4">
                         <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            log.action.includes('Delete') ? 'bg-red-100 text-red-700' :
                            log.action.includes('Create') ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                         }`}>
                            {log.action}
                         </span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{log.entity}</td>
                      <td className="p-4 text-slate-500 truncate max-w-xs">{log.details}</td>
                      <td className="p-4 text-right">
                         <button className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">info</span></button>
                      </td>
                   </tr>
                  ))
                )}
             </tbody>
          </table>
       </div>
    </div>
  );
}