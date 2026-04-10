import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { db } from '../../services/db';
import { useToast } from '../../App';

const COLORS = ['#3b82f6', '#9333ea', '#22c55e', '#f59e0b'];

export default function AdminRevenue() {
  const { showToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await db.getRevenueAnalytics();
        setData(result);
      } catch (err) {
        showToast('error', 'Failed to load revenue analytics.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96 text-slate-400">Loading revenue analytics...</div>;
  if (!data) return <div className="text-center py-20 text-slate-400">No data available</div>;

  const pieData = [
    { name: 'Garages', value: data.garage_revenue },
    { name: 'Vendors', value: data.vendor_revenue },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-red-600">Revenue & Analytics</h1>
        <p className="text-slate-500 text-sm">Platform-wide financial overview and insights.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', val: `NPR ${data.total_revenue.toLocaleString()}`, icon: 'payments', color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Monthly Recurring', val: `NPR ${data.mrr.toLocaleString()}`, icon: 'trending_up', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Subscriptions', val: data.active_subscriptions, icon: 'verified', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Garage : Vendor', val: `${Math.round(data.garage_revenue)}:${Math.round(data.vendor_revenue)}`, icon: 'pie_chart', color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`${s.bg} dark:bg-slate-800 p-2.5 rounded-lg`}>
                <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-xl font-black">{s.val}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-slate-400">Monthly Revenue Trend</h3>
          <div className="min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthly_trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="revenue" name="Revenue (NPR)" stroke="#dc2626" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Split */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-slate-400 self-start">Revenue Split</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Enterprises */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Top Revenue-Generating Enterprises</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/30 border-b dark:border-slate-700">
            <tr>
              <th className="p-4 font-black text-slate-400 uppercase text-[10px]">Rank</th>
              <th className="p-4 font-black text-slate-400 uppercase text-[10px]">Enterprise</th>
              <th className="p-4 font-black text-slate-400 uppercase text-[10px]">Type</th>
              <th className="p-4 font-black text-slate-400 uppercase text-[10px] text-right">Revenue (NPR)</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-700">
            {data.top_enterprises.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-400">No revenue data yet.</td></tr>
            ) : data.top_enterprises.map((ent: any, i: number) => (
              <tr key={ent.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4"><span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span></td>
                <td className="p-4 font-bold">{ent.name}</td>
                <td className="p-4"><span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${ent.type === 'Garage' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>{ent.type}</span></td>
                <td className="p-4 text-right font-mono font-bold text-green-600">{ent.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
