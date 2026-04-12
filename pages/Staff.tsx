import React, { useState } from 'react';
import { useToast } from '../App';
import { db } from '../services/db';

export default function Staff() {
  const { showToast } = useToast();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const authUser = db.getAuthUser();
  const enterpriseId = authUser?.enterprise_id;

  const [newStaff, setNewStaff] = useState({
    name: '',
    role: 'Mechanic',
    phone: '',
    salary: 0
  });

  const loadStaff = async () => {
    if (!enterpriseId) return;
    setLoading(true);
    try {
      const data = await db.getStaff(enterpriseId);
      setStaff(data);
    } catch (err) {
      showToast('error', 'Failed to load staff data.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { loadStaff(); }, [enterpriseId]);

  const handleAddStaff = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await db.saveStaff(newStaff, enterpriseId);
        showToast('success', 'Staff member added');
        setShowModal(false);
        setNewStaff({ name: '', role: 'Mechanic', phone: '', salary: 0 });
        loadStaff();
      } catch (err) {
        showToast('error', 'Failed to add staff.');
      }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await db.updateStaff(id, { status });
      showToast('success', 'Status updated');
      loadStaff();
    } catch (err) {
      showToast('error', 'Update failed.');
    }
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
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:scale-[1.02]">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Active Staff</p>
             <p className="text-3xl font-black mt-1">{staff.length}</p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:scale-[1.02]">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Salary Liability</p>
             <p className="text-3xl font-black mt-1 text-red-600">NPR {staff.reduce((acc, s) => acc + (s.salary || 0), 0).toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:scale-[1.02]">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Composition</p>
             <p className="text-sm font-bold mt-1 text-slate-500">
                {Array.from(new Set(staff.map(s => s.role))).slice(0, 3).join(', ')} {staff.length > 3 ? '...' : ''}
              </p>
          </div>
       </div>

       {/* Attendance Section */}
       <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
             <div>
                <h2 className="text-xl font-bold">Staff Directory & Attendance</h2>
                <p className="text-slate-500 text-sm font-medium">{new Date().toLocaleDateString('en-NE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
             </div>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                   <tr>
                      <th className="p-4 w-10"><input type="checkbox" className="rounded"/></th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Staff Name</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Salary</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Joined On</th>
                      <th className="p-4 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
                   </tr>
                </thead>
                 <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {loading ? (
                       <tr><td colSpan={7} className="p-8 text-center text-slate-400 font-medium italic animate-pulse">Synchronizing staff records...</td></tr>
                    ) : staff.length === 0 ? (
                       <tr><td colSpan={7} className="p-12 text-center">
                          <span className="material-symbols-outlined text-4xl text-slate-100 mb-2">group_off</span>
                          <p className="text-slate-400 font-medium">No active employees found.</p>
                       </td></tr>
                    ) : staff.map(person => (
                       <tr key={person.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-4"><input type="checkbox" className="rounded"/></td>
                          <td className="p-4">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-black text-lg">
                                    {person.name?.[0] || 'S'}
                                </div>
                                <div>
                                   <p className="font-bold text-slate-900 dark:text-white">{person.name}</p>
                                   <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{person.role}</p>
                                </div>
                             </div>
                          </td>
                          <td className="p-4">
                             <select 
                                value={person.status}
                                onChange={(e) => handleUpdateStatus(person.id, e.target.value)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border-none pointer-events-auto outline-none shadow-sm ${
                                    person.status === 'Present' ? 'bg-green-600 text-white' :
                                    person.status === 'Absent' ? 'bg-red-100 text-red-700' :
                                    'bg-amber-100 text-amber-700'
                                }`}
                             >
                                <option>Present</option>
                                <option>Absent</option>
                                <option>Half Day</option>
                                <option>On Leave</option>
                             </select>
                          </td>
                          <td className="p-4 text-slate-600 dark:text-slate-400 font-mono text-xs">{person.phone}</td>
                          <td className="p-4 text-slate-900 dark:text-slate-200 font-black text-xs">NPR {(person.salary || 0).toLocaleString()}</td>
                          <td className="p-4 text-slate-500 text-[10px] font-bold uppercase">{new Date(person.created_at).toLocaleDateString()}</td>
                          <td className="p-4 text-right">
                             <button onClick={() => db.deleteStaff(person.id).then(loadStaff)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-300 hover:bg-red-50 hover:text-red-500 transition-all ml-auto">
                                <span className="material-symbols-outlined text-lg">delete</span>
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
             </table>
          </div>
          
          <div className="mt-6 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
             <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="material-symbols-outlined text-sm">shield</span>
                Enterprise-grade encryption enabled.
             </div>
             <button onClick={loadStaff} className="bg-primary-500 text-white px-5 py-2 rounded-lg font-bold text-xs hover:bg-primary-600 flex items-center gap-2 shadow-lg transition-all active:scale-95">
                <span className="material-symbols-outlined text-sm">sync</span> Sync Now
             </button>
          </div>
       </div>

       {/* Add Staff Modal */}
       {showModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
               <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="text-xl font-black tracking-tighter">Onboard New Talent</h3>
                        <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-slate-400">close</span>
                        </button>
                    </div>
                    <form onSubmit={handleAddStaff} className="p-6 space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Legal Full Name</label>
                            <input type="text" required value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 outline-none focus:border-primary-500 transition-colors font-medium" placeholder="Ex: Liam Johnson" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Designated Role</label>
                                <select value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 outline-none font-medium">
                                    <option>Mechanic</option>
                                    <option>Lead Mechanic</option>
                                    <option>Service Advisor</option>
                                    <option>Helper</option>
                                    <option>Accountant</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Contact Phone</label>
                                <input type="tel" required value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 outline-none focus:border-primary-500 transition-colors font-medium" placeholder="98XXXXXXXX" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Monthly Package (NPR)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">NPR</span>
                                <input type="number" required value={newStaff.salary} onChange={e => setNewStaff({...newStaff, salary: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-3 pl-10 outline-none focus:border-primary-500 transition-colors font-black" placeholder="0.00" />
                            </div>
                        </div>
                        
                        <div className="pt-6 flex gap-3">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 rounded-2xl transition-all">Discard</button>
                            <button type="submit" className="flex-1 py-4 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-[0_4px_15px_rgba(var(--primary-rgb),0.3)] transition-all active:scale-[0.98]">Confirm Hire</button>
                        </div>
                    </form>
               </div>
           </div>
       )}
    </div>
  );
}