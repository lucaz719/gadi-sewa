import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../services/db';

const COLORS = ['#1392ec', '#00C49F', '#FFBB28', '#FF8042'];

const StatCard = ({ title, value, change, icon, color, link }: any) => (
  <Link to={link || '#'} className="block bg-white dark:bg-[#16222d] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
        <span className={`material-symbols-outlined ${color.replace('bg-', 'text-')}`}>{icon}</span>
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className={change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
        {change}
      </span>
      <span className="text-slate-400 ml-2">vs last month</span>
    </div>
  </Link>
);

const FollowupItem = ({ name, phone, date, status }: any) => {
  const isOverdue = new Date(date) < new Date();
  const isSoon = !isOverdue && (new Date(date).getTime() - new Date().getTime()) < (7 * 24 * 60 * 60 * 1000);

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border-l-4 transition-all ${isOverdue ? 'bg-red-50 dark:bg-red-900/10 border-red-500' : isSoon ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isOverdue ? 'bg-red-100 text-red-600' : isSoon ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
        <span className="material-symbols-outlined">{isOverdue ? 'priority_high' : 'notifications'}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{name}</h4>
        <p className="text-xs text-slate-500 flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px]">phone</span> {phone}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-[10px] font-black uppercase tracking-widest ${isOverdue ? 'text-red-600' : isSoon ? 'text-orange-600' : 'text-slate-400'}`}>
          {isOverdue ? 'OVERDUE' : isSoon ? 'DUE SOON' : 'SCHEDULED'}
        </p>
        <p className="text-xs font-mono font-bold mt-0.5">{new Date(date).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [followups, setFollowups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = db.getAuthUser();
        const entId = user?.enterprise_id;

        const [crmSum, trendData, jobAn, followupData] = await Promise.all([
          db.getCRMSummary(entId),
          db.getFinancialTrends(entId),
          db.getJobAnalytics(entId),
          db.getFollowUps(entId) // Ensure this is updated in db.ts to accept arg if not already
        ]);
        setSummary(crmSum);
        setTrends(trendData);
        setAnalytics(jobAn);
        setFollowups(followupData);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Syncing GadiSewa CRM Engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Customers" value={summary?.total_customers || 0} change="+12%" icon="group" color="bg-blue-500" link="/customers" />
        <StatCard title="Due for Service" value={summary?.due_for_service || 0} change="-5%" icon="engineering" color="bg-red-500" link="/jobs" />
        <StatCard title="Upcoming Followups" value={summary?.upcoming_followups || 0} change="+8%" icon="schedule" color="bg-orange-500" link="/appointments" />
        <StatCard title="Monthly Growth" value={`${summary?.followup_rate || 0}%`} change="+2%" icon="trending_up" color="bg-green-500" link="/reports" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CRM Highlights Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Overview */}
          <div className="bg-white dark:bg-[#16222d] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold">Revenue Performance</h3>
                <p className="text-xs text-slate-500 italic">Financial trends aggregated from the last 6 months.</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.05} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="profit" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#16222d] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold mb-4">Job Distribution</h3>
              <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics?.status_breakdown || []}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {(analytics?.status_breakdown || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{analytics?.total_jobs || 0}</p>
                    <p className="text-[10px] font-bold text-slate-400 tracking-widest">TOTAL</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-600 p-6 rounded-2xl shadow-xl shadow-red-500/20 text-white relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-6 -bottom-6 opacity-20 transform -rotate-12">
                <span className="material-symbols-outlined text-[120px]">verified_user</span>
              </div>
              <div>
                <h3 className="font-black text-xl mb-1 uppercase tracking-tighter italic">CRM Automated Follow-up</h3>
                <p className="text-xs text-red-100 opacity-80 leading-relaxed font-medium">System is automatically notifying customers via WhatsApp for upcoming service schedules based on local garage settings.</p>
              </div>
              <div className="pt-4 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-white animate-pulse"></span>
                <span className="text-[10px] font-bold tracking-widest opacity-90 uppercase">Engine Status: ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* CRM Follow-up List */}
        <div className="bg-white dark:bg-[#16222d] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600">notification_important</span>
              Service CRM
            </h3>
          </div>

          <div className="flex-1 space-y-4">
            {followups.length > 0 ? (
              followups.map(f => (
                <FollowupItem key={f.id} name={f.name} phone={f.phone} date={f.next_service_date} status="Pending" />
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <span className="material-symbols-outlined text-4xl text-slate-200 mb-2">check_circle</span>
                <p className="text-slate-400 text-sm italic">All follow-ups complete.</p>
              </div>
            )}
          </div>

          <button className="w-full mt-6 py-3 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase tracking-widest">
            Manage CRM Settings
          </button>
        </div>
      </div>
    </div>
  );
}