import React, { useState } from 'react';
import { useToast } from '../App';

const staffData = [
  { id: 1, name: 'Liam Johnson', role: 'Lead Mechanic', status: 'Present', checkIn: '09:02 AM', checkOut: '06:05 PM', hours: '8h 3m', avatar: 'https://i.pravatar.cc/150?u=8' },
  { id: 2, name: 'Olivia Chen', role: 'Service Advisor', status: 'Absent', checkIn: '--:--', checkOut: '--:--', hours: '0h 0m', avatar: 'https://i.pravatar.cc/150?u=9' },
  { id: 3, name: 'Benjamin Carter', role: 'Mechanic', status: 'Half Day', checkIn: '09:15 AM', checkOut: '01:00 PM', hours: '3h 45m', note: 'Approved leave', avatar: 'https://i.pravatar.cc/150?u=10' },
  { id: 4, name: 'Sophia Rodriguez', role: 'Apprentice', status: 'On Leave', checkIn: '--:--', checkOut: '--:--', hours: '0h 0m', avatar: 'https://i.pravatar.cc/150?u=11' },
];

export default function Staff() {
  const [staff, setStaff] = useState(staffData);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  const handleAddStaff = (e: React.FormEvent) => {
      e.preventDefault();
      showToast('success', 'Staff member added');
      setShowModal(false);
  };

  const handleSaveAttendance = () => {
      showToast('success', 'Attendance records updated');
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Staff Dashboard</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2"
          >
             <span className="material-symbols-outlined">add</span>
             Add New Employee
          </button>
       </div>

       {/* Overview Stats */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
             <p className="text-sm text-slate-500 font-medium">Total Staff</p>
             <p className="text-3xl font-bold mt-1">52</p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
             <p className="text-sm text-slate-500 font-medium">Present Today</p>
             <div className="flex items-baseline gap-2 mt-1">
                <p className="text-3xl font-bold">48</p>
                <span className="text-green-500 font-medium text-sm">92%</span>
             </div>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
             <p className="text-sm text-slate-500 font-medium">On Leave</p>
             <p className="text-3xl font-bold mt-1">4</p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
             <p className="text-sm text-slate-500 font-medium">New Hires</p>
             <p className="text-3xl font-bold mt-1">2</p>
          </div>
       </div>

       {/* Attendance Section */}
       <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
             <div>
                <h2 className="text-xl font-bold">Mark Staff Attendance</h2>
                <p className="text-slate-500 text-sm">Tuesday, 20 August 2024</p>
             </div>
             <div className="flex gap-2">
                <button className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                   <span className="material-symbols-outlined text-base">done_all</span> Mark Selected Present
                </button>
                <button className="bg-white border border-slate-200 dark:border-slate-700 dark:bg-slate-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                   <span className="material-symbols-outlined text-base">calendar_today</span> Change Date
                </button>
             </div>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                   <tr>
                      <th className="p-4 w-10"><input type="checkbox" className="rounded"/></th>
                      <th className="p-4">Staff Name</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Check-in</th>
                      <th className="p-4">Check-out</th>
                      <th className="p-4">Working Hours</th>
                      <th className="p-4">Notes</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                   {staff.map(person => (
                      <tr key={person.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                         <td className="p-4"><input type="checkbox" className="rounded"/></td>
                         <td className="p-4">
                            <div className="flex items-center gap-3">
                               <img src={person.avatar} alt="" className="w-10 h-10 rounded-full" />
                               <div>
                                  <p className="font-medium">{person.name}</p>
                                  <p className="text-xs text-slate-500">{person.role}</p>
                               </div>
                            </div>
                         </td>
                         <td className="p-4">
                            <select className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary-500" defaultValue={person.status}>
                               <option>Present</option>
                               <option>Absent</option>
                               <option>Half Day</option>
                               <option>On Leave</option>
                            </select>
                         </td>
                         <td className="p-4 text-slate-600 dark:text-slate-400">{person.checkIn}</td>
                         <td className="p-4 text-slate-600 dark:text-slate-400">{person.checkOut}</td>
                         <td className="p-4 text-slate-600 dark:text-slate-400">{person.hours}</td>
                         <td className="p-4 text-slate-500 text-xs italic">{person.note}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
          
          <div className="mt-6 flex justify-end">
             <button onClick={handleSaveAttendance} className="bg-primary-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-primary-600 flex items-center gap-2">
                <span className="material-symbols-outlined">save</span> Save All Changes
             </button>
          </div>
       </div>

       {/* Add Staff Modal */}
       {showModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
               <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700">
                   <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                       <h3 className="text-lg font-bold">Add New Staff</h3>
                       <button onClick={() => setShowModal(false)}><span className="material-symbols-outlined text-slate-400">close</span></button>
                   </div>
                   <form onSubmit={handleAddStaff} className="p-6 space-y-4">
                       <div>
                           <label className="block text-sm font-medium mb-1">Full Name</label>
                           <input type="text" required className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-sm font-medium mb-1">Role</label>
                               <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500">
                                   <option>Mechanic</option>
                                   <option>Service Advisor</option>
                                   <option>Helper</option>
                                   <option>Accountant</option>
                               </select>
                           </div>
                           <div>
                               <label className="block text-sm font-medium mb-1">Phone</label>
                               <input type="tel" required className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" />
                           </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-sm font-medium mb-1">Salary (Monthly)</label>
                               <input type="number" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" />
                           </div>
                           <div>
                               <label className="block text-sm font-medium mb-1">Join Date</label>
                               <input type="date" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" />
                           </div>
                       </div>
                       
                       <div className="pt-4 flex justify-end gap-3">
                           <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-sm font-medium">Cancel</button>
                           <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700">Add Staff</button>
                       </div>
                   </form>
               </div>
           </div>
       )}
    </div>
  );
}