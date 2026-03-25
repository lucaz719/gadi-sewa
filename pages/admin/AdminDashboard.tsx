
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from '../../services/db';
import { useToast } from '../../App';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [pending, setPending] = useState<any[]>([]);
  const [stats, setStats] = useState({ 
    garages: 0, vendors: 0, pending: 0, users: 0, 
    revenue: 0, jobs: 0, activeSubs: 0, mrr: 0, churnRate: 0 
  });
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pendingRegs, adminStats, growth, logs] = await Promise.all([
        db.getPendingRegistrations(),
        db.getAdminStats().catch(() => null),
        db.getGrowthData().catch(() => []),
        db.getActivityLogs().catch(() => [])
      ]);

      if (adminStats) {
        setStats({
          garages: adminStats.total_garages,
          vendors: adminStats.total_vendors,
          pending: adminStats.pending_registrations,
          users: adminStats.total_users,
          revenue: adminStats.estimated_revenue,
          jobs: adminStats.total_jobs,
          activeSubs: adminStats.active_subscriptions,
          mrr: adminStats.mrr || 0,
          churnRate: adminStats.churn_rate || 0
        });
      }

      setPending(pendingRegs);
      setGrowthData(growth.length > 0 ? growth : [
        { month: 'Jan', garages: 0, vendors: 0 }, { month: 'Feb', garages: 0, vendors: 0 },
        { month: 'Mar', garages: 0, vendors: 0 }, { month: 'Apr', garages: 0, vendors: 0 },
      ]);
      setRecentLogs(logs.slice(0, 5));
    } catch (err) {
      showToast('error', 'Failed to synchronize system data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await db.approveRegistration(id);
      showToast('success', 'Enterprise approved and activated.');
      loadData();
    } catch (err) {
      showToast('error', 'Approval failed.');
    }
  };

  const handleReject = async (id: string) => {
    if (confirm('Permanently reject this sign-up?')) {
      try {
        await db.rejectRegistration(id);
        showToast('info', 'Registration application rejected.');
        loadData();
      } catch (err) {
        showToast('error', 'Rejection failed.');
      }
    }
  };

  const formatRevenue = (val: number) => {
    if (val >= 100000) return `NPR ${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `NPR ${(val / 1000).toFixed(1)}K`;
    return `NPR ${val}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-red-600">Admin Central</h1>
          <p className="text-slate-500 text-sm">System-wide monitoring and verification.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/users" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg hover:bg-red-700 transition-all active:scale-95">
            <span className="material-symbols-outlined">person_add</span>
            Onboard Enterprise
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[
          { label: 'Garages', val: stats.garages, icon: 'store', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Vendors', val: stats.vendors, icon: 'factory', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Total Users', val: stats.users, icon: 'group', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Total Jobs', val: stats.jobs, icon: 'work', color: 'text-cyan-600', bg: 'bg-cyan-50' },
          { label: 'Active Subs', val: stats.activeSubs, icon: 'verified', color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Monthly Rev (MRR)', val: formatRevenue(stats.mrr), icon: 'subscription', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Churn Rate', val: `${stats.churnRate}%`, icon: 'person_remove', color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Pending Apps', val: stats.pending, icon: 'pending_actions', color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Total Rev', val: formatRevenue(stats.revenue), icon: 'payments', color: 'text-green-600', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className={`${stat.bg} dark:bg-slate-800 p-2.5 rounded-xl`}>
                <span className={`material-symbols-outlined ${stat.color} text-xl`}>{stat.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{stat.label}</p>
                <p className="text-xl font-black truncate">{stat.val}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: 'Onboard Enterprise', icon: 'add_business', path: '/admin/users', color: 'bg-red-600' },
            { label: 'Manage Vouchers', icon: 'confirmation_number', path: '/admin/vouchers', color: 'bg-purple-600' },
            { label: 'Global Catalog', icon: 'inventory', path: '/admin/global-catalog', color: 'bg-blue-600' },
            { label: 'Revenue Analytics', icon: 'bar_chart', path: '/admin/revenue', color: 'bg-green-600' },
            { label: 'Notifications', icon: 'campaign', path: '/admin/notifications', color: 'bg-orange-500' },
            { label: 'Support Hub', icon: 'support_agent', path: '/admin/support', color: 'bg-emerald-600' },
            { label: 'System Logs', icon: 'history', path: '/admin/logs', color: 'bg-slate-600' },
          ].map((action, i) => (
            <Link key={i} to={action.path} className={`${action.color} text-white p-4 rounded-xl flex flex-col items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg`}>
              <span className="material-symbols-outlined text-2xl">{action.icon}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Verifications */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col min-h-[400px]">
          <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-bold flex items-center gap-2"><span className="material-symbols-outlined text-orange-500">lock_open</span> Pending Verifications</h3>
            <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{pending.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading registrations...</div>
            ) : pending.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-20">verified</span>
                <p className="text-sm font-medium">All applications are processed.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="text-[10px] font-black uppercase text-slate-400 border-b dark:border-slate-700">
                  <tr>
                    <th className="p-4">Business</th>
                    <th className="p-4">Applicant</th>
                    <th className="p-4 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-700">
                  {pending.map(reg => (
                    <tr key={reg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold">{reg.businessName || reg.name}</p>
                        <p className="text-xs text-slate-500">{reg.email}</p>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        <p className="font-medium text-xs text-slate-900 dark:text-white uppercase tracking-tighter">{reg.ownerName || reg.owner}</p>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${reg.type === 'Garage' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                          {reg.type}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleReject(reg.id)} className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-all" title="Reject">
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                          <button onClick={() => handleApprove(reg.id)} className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center hover:bg-green-700 shadow-sm transition-all" title="Verify & Activate">
                            <span className="material-symbols-outlined text-sm">check</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Growth Stats */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-400">Platform Growth</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="garages" name="Garages" fill="#1392ec" radius={[2, 2, 0, 0]} />
                <Bar dataKey="vendors" name="Vendors" fill="#9333ea" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><span className="material-symbols-outlined text-slate-500">history</span> Recent Activity</h3>
          <Link to="/admin/logs" className="text-xs font-bold text-red-600 hover:underline">View All</Link>
        </div>
        <div className="divide-y dark:divide-slate-700">
          {recentLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No recent activity.</div>
          ) : recentLogs.map(log => (
            <div key={log.id} className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-red-500 text-sm">
                  {log.action?.includes('Create') ? 'add_circle' : log.action?.includes('Delete') ? 'remove_circle' : 'edit'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate"><span className="font-bold">{log.user_name}</span> · {log.action}</p>
                <p className="text-xs text-slate-400 truncate">{log.details}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

