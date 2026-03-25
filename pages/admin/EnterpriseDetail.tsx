import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../services/db';
import { useToast } from '../../App';

export default function EnterpriseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await db.getEnterpriseDetail(id!);
      setData(result);
    } catch (err) {
      showToast('error', 'Failed to load enterprise detail.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  const handleStatusChange = async (status: string) => {
    try {
      await db.approveRegistration(id!);
      showToast('success', `Enterprise status updated to ${status}`);
      loadData();
    } catch (err) {
      showToast('error', 'Failed to update status.');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96 text-slate-400">Loading enterprise details...</div>;
  if (!data) return <div className="text-center py-20 text-slate-400">Enterprise not found</div>;

  const { enterprise: ent, plan, stats, recent_activity } = data;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/users')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{ent.name}</h1>
            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${ent.type === 'Garage' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>{ent.type}</span>
            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${ent.status === 'Active' ? 'bg-green-100 text-green-600' : ent.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>{ent.status}</span>
          </div>
          <p className="text-slate-500 text-sm">Owner: {ent.owner} · {ent.email}</p>
        </div>
        <div className="flex gap-2">
          {ent.status !== 'Active' && (
            <button onClick={() => handleStatusChange('Active')} className="px-4 py-2 bg-green-600 text-white font-bold text-sm rounded-lg hover:bg-green-700 transition-all">Activate</button>
          )}
          {ent.status === 'Active' && (
            <button onClick={() => handleStatusChange('Suspended')} className="px-4 py-2 border border-red-500/30 text-red-600 font-bold text-sm rounded-lg hover:bg-red-50 transition-all">Suspend</button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Jobs', val: stats.total_jobs, icon: 'work', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Revenue', val: `NPR ${stats.revenue.toLocaleString()}`, icon: 'payments', color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Staff Members', val: stats.staff_count, icon: 'badge', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Inventory Value', val: `NPR ${stats.inventory_value.toLocaleString()}`, icon: 'inventory_2', color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`${s.bg} dark:bg-slate-800 p-2.5 rounded-lg`}>
                <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-lg font-black">{s.val}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enterprise Info */}
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Enterprise Info</h3>
          {[
            { label: 'Business Name', val: ent.name },
            { label: 'Owner', val: ent.owner },
            { label: 'Email', val: ent.email },
            { label: 'Type', val: ent.type },
            { label: 'Status', val: ent.status },
            { label: 'Registered', val: new Date(ent.created_at).toLocaleDateString() },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b dark:border-slate-700 last:border-0">
              <span className="text-xs font-medium text-slate-500">{item.label}</span>
              <span className="text-sm font-bold">{item.val}</span>
            </div>
          ))}
          {plan && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/30">
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Current Plan</p>
              <p className="font-bold text-red-600">{plan.name} — NPR {plan.price}/{plan.duration}</p>
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Activity Timeline</h3>
          {recent_activity.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <span className="material-symbols-outlined text-4xl opacity-20 mb-2">history</span>
              <p className="text-sm">No activity recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recent_activity.map((log: any, i: number) => (
                <div key={log.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-red-600 flex-shrink-0 mt-1"></div>
                    {i < recent_activity.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 mt-1"></div>}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-bold">{log.action} — <span className="text-slate-500">{log.entity}</span></p>
                    <p className="text-xs text-slate-400">{log.details}</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
