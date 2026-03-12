import React, { useState } from 'react';
import { useToast } from '../App';

const appointmentsData = [
  { id: 1, customer: 'Alice Johnson', vehicle: 'Hyundai Creta', time: '09:00 AM', type: 'Service', status: 'Confirmed', mechanic: 'Mike Ross' },
  { id: 2, customer: 'Bob Smith', vehicle: 'Honda City', time: '10:30 AM', type: 'Repair', status: 'Pending', mechanic: 'Unassigned' },
  { id: 3, customer: 'Charlie Brown', vehicle: 'Maruti Swift', time: '01:00 PM', type: 'Inspection', status: 'Completed', mechanic: 'Sarah Lane' },
];

export default function Appointments() {
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [appointments, setAppointments] = useState(appointmentsData);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  const handleBooking = (e: React.FormEvent) => {
      e.preventDefault();
      showToast('success', 'Appointment booked successfully');
      setShowModal(false);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold">Appointments</h1>
             <p className="text-slate-500 text-sm">Manage bookings and schedule.</p>
          </div>
          <div className="flex gap-2">
             <div className="bg-white dark:bg-[#1e293b] p-1 rounded-lg border border-slate-200 dark:border-slate-700 flex">
                <button onClick={() => setView('calendar')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'calendar' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-slate-600 dark:text-slate-400'}`}>Calendar</button>
                <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'list' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-slate-600 dark:text-slate-400'}`}>List</button>
             </div>
             <button 
                onClick={() => setShowModal(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
             >
                <span className="material-symbols-outlined">add</span> New Booking
             </button>
          </div>
       </div>

       {/* Filters */}
       <div className="flex gap-4 overflow-x-auto pb-2">
           {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map(status => (
               <button key={status} className="px-4 py-1.5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-full text-sm hover:border-primary-500 transition-colors whitespace-nowrap">
                  {status}
               </button>
           ))}
       </div>

       {view === 'list' ? (
           <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex-1">
               <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                       <tr>
                           <th className="p-4">Time</th>
                           <th className="p-4">Customer</th>
                           <th className="p-4">Vehicle</th>
                           <th className="p-4">Service Type</th>
                           <th className="p-4">Mechanic</th>
                           <th className="p-4">Status</th>
                           <th className="p-4 text-right">Actions</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                       {appointments.map(apt => (
                           <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                               <td className="p-4 font-medium">{apt.time}</td>
                               <td className="p-4 font-bold text-slate-900 dark:text-white">{apt.customer}</td>
                               <td className="p-4 text-slate-500">{apt.vehicle}</td>
                               <td className="p-4"><span className="px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 rounded text-xs font-semibold">{apt.type}</span></td>
                               <td className="p-4 text-slate-500">{apt.mechanic}</td>
                               <td className="p-4">
                                   <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                       apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                       apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                       'bg-slate-100 text-slate-600'
                                   }`}>{apt.status}</span>
                               </td>
                               <td className="p-4 text-right">
                                   <button className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">more_vert</span></button>
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           </div>
       ) : (
           <div className="flex-1 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-4 overflow-auto">
               <div className="grid grid-cols-8 gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                   {/* Header Row */}
                   <div className="bg-slate-50 dark:bg-slate-800 p-2 text-center text-xs font-bold text-slate-500">Time</div>
                   {['Mon 21', 'Tue 22', 'Wed 23', 'Thu 24', 'Fri 25', 'Sat 26', 'Sun 27'].map(day => (
                       <div key={day} className={`bg-slate-50 dark:bg-slate-800 p-2 text-center text-sm font-bold ${day.includes('24') ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                           {day}
                       </div>
                   ))}

                   {/* Time Slots */}
                   {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                       <React.Fragment key={time}>
                           <div className="bg-white dark:bg-[#1e293b] p-2 text-xs text-slate-400 text-center border-t border-slate-100 dark:border-slate-800 h-24">{time}</div>
                           {[0,1,2,3,4,5,6].map(d => (
                               <div key={d} className="bg-white dark:bg-[#1e293b] border-t border-l border-slate-100 dark:border-slate-800 h-24 relative p-1">
                                   {/* Mock Events */}
                                   {time === '09:00' && d === 1 && (
                                       <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 p-1.5 rounded text-xs font-medium h-full border-l-2 border-blue-500 cursor-pointer hover:opacity-80">
                                           Full Service - Toyota
                                       </div>
                                   )}
                                    {time === '11:00' && d === 3 && (
                                       <div className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 p-1.5 rounded text-xs font-medium h-full border-l-2 border-green-500 cursor-pointer hover:opacity-80">
                                           Oil Change - Honda
                                       </div>
                                   )}
                               </div>
                           ))}
                       </React.Fragment>
                   ))}
               </div>
           </div>
       )}

       {/* Booking Modal */}
       {showModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
               <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700">
                   <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                       <h3 className="text-lg font-bold">New Booking</h3>
                       <button onClick={() => setShowModal(false)}><span className="material-symbols-outlined text-slate-400">close</span></button>
                   </div>
                   <form onSubmit={handleBooking} className="p-6 space-y-4">
                       <div>
                           <label className="block text-sm font-medium mb-1">Customer</label>
                           <input type="text" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" placeholder="Search customer..." required />
                       </div>
                       <div>
                           <label className="block text-sm font-medium mb-1">Vehicle</label>
                           <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500">
                               <option>Select Vehicle</option>
                               <option>Toyota Camry (MH-01...)</option>
                           </select>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-sm font-medium mb-1">Date</label>
                               <input type="date" required className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" />
                           </div>
                           <div>
                               <label className="block text-sm font-medium mb-1">Time</label>
                               <input type="time" required className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" />
                           </div>
                       </div>
                       <div>
                           <label className="block text-sm font-medium mb-1">Service Type</label>
                           <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500">
                               <option>General Service</option>
                               <option>Repair</option>
                               <option>Inspection</option>
                               <option>Oil Change</option>
                           </select>
                       </div>
                       <div>
                           <label className="block text-sm font-medium mb-1">Assign Mechanic (Optional)</label>
                           <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500">
                               <option>Any Available</option>
                               <option>Mike Ross</option>
                               <option>Sarah Lane</option>
                           </select>
                       </div>
                       
                       <div className="pt-4 flex justify-end gap-3">
                           <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-sm font-medium">Cancel</button>
                           <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700">Book Appointment</button>
                       </div>
                   </form>
               </div>
           </div>
       )}
    </div>
  );
}