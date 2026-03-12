import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockLogs = [
  { id: 1, date: '25 Oct 2024', vehicle: 'Toyota Camry', odometer: 15400, volume: 40, price: 105, total: 4200, fullTank: true },
  { id: 2, date: '15 Oct 2024', vehicle: 'Toyota Camry', odometer: 14950, volume: 38, price: 104, total: 3952, fullTank: true },
  { id: 3, date: '01 Oct 2024', vehicle: 'Honda Activa 6G', odometer: 5200, volume: 4.5, price: 104, total: 468, fullTank: true },
];

const efficiencyData = [
  { date: 'Sep 1', mpg: 12.5 },
  { date: 'Sep 15', mpg: 13.2 },
  { date: 'Oct 1', mpg: 12.8 },
  { date: 'Oct 15', mpg: 13.5 },
  { date: 'Oct 25', mpg: 13.8 },
];

export default function FuelLog() {
  const [logs, setLogs] = useState(mockLogs);
  const [showModal, setShowModal] = useState(false);

  const handleAddLog = (e: React.FormEvent) => {
      e.preventDefault();
      setShowModal(false);
      // Logic to add log would go here
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold">Fuel Log</h1>
             <p className="text-slate-500 text-sm">Track expenses and fuel efficiency.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2">
             <span className="material-symbols-outlined">local_gas_station</span> Add Log
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Chart */}
           <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
               <h3 className="font-bold mb-4">Efficiency Trend (km/L)</h3>
               <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={efficiencyData}>
                           <defs>
                               <linearGradient id="colorMpg" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                               </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                           <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                           <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                           <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                           <Area type="monotone" dataKey="mpg" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorMpg)" />
                       </AreaChart>
                   </ResponsiveContainer>
               </div>
           </div>

           {/* Stats */}
           <div className="space-y-4">
               <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                   <p className="text-slate-500 text-sm">Total Spent (Oct)</p>
                   <p className="text-2xl font-bold mt-1">₹8,620</p>
               </div>
               <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                   <p className="text-slate-500 text-sm">Avg. Efficiency</p>
                   <p className="text-2xl font-bold mt-1 text-green-600">13.5 km/L</p>
               </div>
               <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                   <p className="text-slate-500 text-sm">Total Distance</p>
                   <p className="text-2xl font-bold mt-1">1,250 km</p>
               </div>
           </div>
       </div>

       {/* Logs List */}
       <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
           <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                   <tr>
                       <th className="p-4">Date</th>
                       <th className="p-4">Vehicle</th>
                       <th className="p-4 text-center">Odometer</th>
                       <th className="p-4 text-center">Volume</th>
                       <th className="p-4 text-right">Price/L</th>
                       <th className="p-4 text-right">Total</th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                   {logs.map(log => (
                       <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                           <td className="p-4 text-slate-500">{log.date}</td>
                           <td className="p-4 font-bold">{log.vehicle}</td>
                           <td className="p-4 text-center font-mono text-slate-600 dark:text-slate-300">{log.odometer.toLocaleString()} km</td>
                           <td className="p-4 text-center">{log.volume} L</td>
                           <td className="p-4 text-right">₹{log.price}</td>
                           <td className="p-4 text-right font-bold">₹{log.total.toLocaleString()}</td>
                       </tr>
                   ))}
               </tbody>
           </table>
       </div>

       {/* Add Log Modal */}
       {showModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
               <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700">
                   <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                       <h3 className="font-bold text-lg">Add Fuel Log</h3>
                       <button onClick={() => setShowModal(false)}><span className="material-symbols-outlined text-slate-400">close</span></button>
                   </div>
                   <form onSubmit={handleAddLog} className="p-6 space-y-4">
                       <div>
                           <label className="block text-sm font-medium mb-1">Vehicle</label>
                           <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent">
                               <option>Toyota Camry</option>
                               <option>Honda Activa</option>
                           </select>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-sm font-medium mb-1">Date</label>
                               <input type="date" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent" />
                           </div>
                           <div>
                               <label className="block text-sm font-medium mb-1">Odometer</label>
                               <input type="number" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent" placeholder="km" />
                           </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-sm font-medium mb-1">Volume (L)</label>
                               <input type="number" step="0.1" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent" placeholder="0.0" />
                           </div>
                           <div>
                               <label className="block text-sm font-medium mb-1">Total Cost (₹)</label>
                               <input type="number" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent" placeholder="0.00" />
                           </div>
                       </div>
                       <label className="flex items-center gap-2">
                           <input type="checkbox" className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500" defaultChecked />
                           <span className="text-sm">Full Tank</span>
                       </label>
                       
                       <div className="pt-4 flex justify-end gap-3">
                           <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-sm font-medium">Cancel</button>
                           <button type="submit" className="px-6 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600">Save</button>
                       </div>
                   </form>
               </div>
           </div>
       )}
    </div>
  );
}