import React, { useState } from 'react';
import { useToast } from '../App';
import { db } from '../services/db';

export default function Appointments() {
  const { showToast } = useToast();
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const authUser = db.getAuthUser();
  const enterpriseId = authUser?.enterprise_id;

  const [newApp, setNewApp] = useState({
    customer_id: 1, // Mocking customer ID for now
    vehicle_info: '',
    date: '',
    time: '',
    service_type: 'General Service',
    mechanic_name: ''
  });

  const loadAppointments = async () => {
    if (!enterpriseId) return;
    setLoading(true);
    try {
      const data = await db.getAppointments(enterpriseId);
      setAppointments(data);
    } catch (err) {
      showToast('error', 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { loadAppointments(); }, [enterpriseId]);

  const handleBooking = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await db.saveAppointment(newApp, enterpriseId);
        showToast('success', 'Appointment booked successfully');
        setShowModal(false);
        setNewApp({ customer_id: 1, vehicle_info: '', date: '', time: '', service_type: 'General Service', mechanic_name: '' });
        loadAppointments();
      } catch (err) {
        showToast('error', 'Booking failed.');
      }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await db.updateAppointmentStatus(id, status);
      showToast('success', `Appointment marked as ${status}`);
      loadAppointments();
    } catch (err) {
      showToast('error', 'Status update failed.');
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
             <h1 className="text-3xl font-black tracking-tighter">Scheduling Hub</h1>
             <p className="text-slate-500 text-sm font-medium">Manage enterprise-wide bookings and resource allocation.</p>
          </div>
          <div className="flex gap-3">
             <div className="bg-white dark:bg-[#1e293b] p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex shadow-sm">
                <button onClick={() => setView('calendar')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${view === 'calendar' ? 'bg-primary-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>Calendar</button>
                <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${view === 'list' ? 'bg-primary-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>List View</button>
             </div>
             <button 
                onClick={() => setShowModal(true)}
                className="bg-slate-900 dark:bg-primary-600 hover:bg-black dark:hover:bg-primary-700 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl transition-all active:scale-[0.98]"
             >
                <span className="material-symbols-outlined text-sm">event_available</span> New Reservation
             </button>
          </div>
       </div>

       {/* Filters */}
       <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
           {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map(status => (
               <button key={status} className="px-6 py-2 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary-500 hover:text-primary-600 transition-all shadow-sm whitespace-nowrap active:scale-95">
                  {status}
               </button>
           ))}
       </div>

       {view === 'list' ? (
           <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex-1 shadow-lg">
               <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-b border-slate-200 dark:border-slate-700">
                       <tr>
                           <th className="p-4 text-[10px] font-black uppercase tracking-widest">Schedule</th>
                           <th className="p-4 text-[10px] font-black uppercase tracking-widest">Client Profile</th>
                           <th className="p-4 text-[10px] font-black uppercase tracking-widest">Vehicle Specs</th>
                           <th className="p-4 text-[10px] font-black uppercase tracking-widest">Service Item</th>
                           <th className="p-4 text-[10px] font-black uppercase tracking-widest">Technician</th>
                           <th className="p-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                           <th className="p-4 text-right text-[10px] font-black uppercase tracking-widest">Control</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            <tr><td colSpan={7} className="p-12 text-center text-slate-400 font-medium italic animate-pulse">Syncing real-time schedule...</td></tr>
                        ) : appointments.length === 0 ? (
                            <tr><td colSpan={7} className="p-20 text-center">
                                <span className="material-symbols-outlined text-5xl text-slate-100 mb-4">event_busy</span>
                                <p className="text-slate-400 font-bold tracking-tighter text-lg">No active reservations found.</p>
                            </td></tr>
                        ) : appointments.map(apt => (
                            <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-4">
                                    <p className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">{apt.time}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(apt.date).toLocaleDateString()}</p>
                                </td>
                                <td className="p-4">
                                    <p className="font-bold text-slate-900 dark:text-white">Customer #{apt.customer_id}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Linked Profile</p>
                                </td>
                                <td className="p-4 text-slate-600 dark:text-slate-300 font-medium text-xs font-mono">{apt.vehicle_info}</td>
                                <td className="p-4"><span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-200 dark:border-blue-800">{apt.service_type}</span></td>
                                <td className="p-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">{apt.mechanic_name || 'Unassigned'}</td>
                                <td className="p-4">
                                    <select 
                                        value={apt.status}
                                        onChange={(e) => updateStatus(apt.id, e.target.value)}
                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-none outline-none shadow-sm transition-all focus:ring-2 focus:ring-primary-500 cursor-pointer ${
                                            apt.status === 'Confirmed' ? 'bg-green-600 text-white' :
                                            apt.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                            apt.status === 'Completed' ? 'bg-slate-800 text-white' :
                                            'bg-red-50 text-red-600'
                                        }`}
                                    >
                                        <option>Pending</option>
                                        <option>Confirmed</option>
                                        <option>Completed</option>
                                        <option>Cancelled</option>
                                    </select>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => db.deleteAppointment(apt.id).then(loadAppointments)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all ml-auto">
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                   </tbody>
               </table>
           </div>
       ) : (
           <div className="flex-1 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 p-6 overflow-auto shadow-lg">
               <div className="grid grid-cols-8 gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-inner">
                   {/* Header Row */}
                   <div className="bg-slate-50 dark:bg-slate-800 p-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</div>
                   {['Mon 21', 'Tue 22', 'Wed 23', 'Thu 24', 'Fri 25', 'Sat 26', 'Sun 27'].map(day => (
                       <div key={day} className={`bg-slate-50 dark:bg-slate-800 p-3 text-center text-xs font-black uppercase tracking-tighter ${day.includes('24') ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/10' : 'text-slate-600 dark:text-slate-300'}`}>
                           {day}
                       </div>
                   ))}

                   {/* Time Slots */}
                   {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                       <React.Fragment key={time}>
                           <div className="bg-white dark:bg-[#1e293b] p-3 text-[10px] font-black text-slate-400 text-center border-t border-slate-100 dark:border-slate-800 h-28 flex items-center justify-center">{time}</div>
                           {[0,1,2,3,4,5,6].map(d => (
                               <div key={d} className="bg-white dark:bg-[#1e293b] border-t border-l border-slate-100 dark:border-slate-800 h-28 relative p-2 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                                   <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center transition-opacity">
                                       <span className="material-symbols-outlined text-primary-300 text-lg">add_circle</span>
                                   </div>
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
               <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="text-xl font-black tracking-tighter">Fast Booking</h3>
                        <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-slate-400">close</span>
                        </button>
                    </div>
                    <form onSubmit={handleBooking} className="p-6 space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Customer Identifier</label>
                            <input type="number" required value={newApp.customer_id} onChange={e => setNewApp({...newApp, customer_id: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 outline-none focus:border-primary-500 transition-colors font-medium" placeholder="Ex: 1042" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Vehicle Details</label>
                            <input type="text" required value={newApp.vehicle_info} onChange={e => setNewApp({...newApp, vehicle_info: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 outline-none focus:border-primary-500 transition-colors font-medium" placeholder="Ex: Honda CBR (BAP-2022)" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Preferred Date</label>
                                <input type="date" required value={newApp.date} onChange={e => setNewApp({...newApp, date: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 outline-none focus:border-primary-500 transition-colors font-medium text-xs" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Preferred Time</label>
                                <input type="time" required value={newApp.time} onChange={e => setNewApp({...newApp, time: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 outline-none focus:border-primary-500 transition-colors font-medium text-xs" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Service category</label>
                            <select value={newApp.service_type} onChange={e => setNewApp({...newApp, service_type: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 outline-none font-medium">
                                <option>General Service</option>
                                <option>Urgent Repair</option>
                                <option>Routine Inspection</option>
                                <option>Oil & Filter Change</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Designated Technician (Optional)</label>
                            <input type="text" value={newApp.mechanic_name} onChange={e => setNewApp({...newApp, mechanic_name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 outline-none focus:border-primary-500 transition-colors font-medium" placeholder="Technician Name" />
                        </div>
                        
                        <div className="pt-6 flex gap-3">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 rounded-2xl transition-all">Cancel</button>
                            <button type="submit" className="flex-1 py-4 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-[0_4px_15px_rgba(var(--primary-rgb),0.3)] transition-all active:scale-[0.98]">Confirm Booking</button>
                        </div>
                    </form>
               </div>
           </div>
       )}
    </div>
  );
}