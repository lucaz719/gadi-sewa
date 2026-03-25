import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import { useToast } from '../../App';

export default function AdminNotifications() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', target_role: 'all', priority: 'info' });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await db.getNotifications();
      setNotifications(data);
    } catch (err) {
      showToast('error', 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.createNotification(form);
      showToast('success', 'Notification broadcast sent!');
      setShowModal(false);
      setForm({ title: '', message: '', target_role: 'all', priority: 'info' });
      loadData();
    } catch (err) {
      showToast('error', 'Failed to send notification.');
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await db.markNotificationRead(id);
      loadData();
    } catch (err) {
      showToast('error', 'Failed to mark as read.');
    }
  };

  const priorityStyles: any = {
    info: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600', icon: 'info' },
    warning: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600', icon: 'warning' },
    critical: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600', icon: 'error' },
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-red-600">Notifications & Announcements</h1>
          <p className="text-slate-500 text-sm">Broadcast messages and manage system alerts. <span className="font-bold text-orange-500">{unreadCount} unread</span></p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95">
          <span className="material-symbols-outlined">campaign</span>
          New Broadcast
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Sent', val: notifications.length, icon: 'send', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Unread', val: unreadCount, icon: 'mark_email_unread', color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Critical', val: notifications.filter(n => n.priority === 'critical').length, icon: 'priority_high', color: 'text-red-600', bg: 'bg-red-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
            <div className={`${s.bg} dark:bg-slate-800 p-2.5 rounded-lg`}>
              <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{s.label}</p>
              <p className="text-xl font-black">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-5xl text-slate-300">notifications_off</span>
            <p className="text-slate-400 italic">No notifications yet. Send your first broadcast!</p>
          </div>
        ) : notifications.map(n => {
          const ps = priorityStyles[n.priority] || priorityStyles.info;
          return (
            <div key={n.id} className={`bg-white dark:bg-[#1e293b] rounded-xl border dark:border-slate-700 shadow-sm p-5 flex items-start gap-4 transition-all ${!n.is_read ? 'border-l-4 border-l-red-500' : 'opacity-70'}`}>
              <div className={`${ps.bg} p-2.5 rounded-lg flex-shrink-0`}>
                <span className={`material-symbols-outlined ${ps.text}`}>{ps.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-bold text-sm">{n.title}</h4>
                    <p className="text-slate-500 text-xs mt-1">{n.message}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[9px] font-mono text-slate-400">{new Date(n.created_at).toLocaleDateString()}</span>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${n.target_role === 'all' ? 'bg-slate-100 text-slate-500' : n.target_role === 'garage' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                      {n.target_role}
                    </span>
                  </div>
                </div>
                {!n.is_read && (
                  <button onClick={() => handleMarkRead(n.id)} className="mt-2 text-[10px] text-red-600 font-bold hover:underline">Mark as Read</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
              <h3 className="font-bold text-lg">New Broadcast</h3>
              <button onClick={() => setShowModal(false)}><span className="material-symbols-outlined text-slate-400 hover:text-red-500 transition-colors">close</span></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-1.5 ml-1">Title</label>
                <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2.5 outline-none focus:border-red-500" placeholder="e.g. System Maintenance Notice" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-1.5 ml-1">Message</label>
                <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2.5 outline-none focus:border-red-500" rows={3} placeholder="Detailed message content..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-1.5 ml-1">Target</label>
                  <select value={form.target_role} onChange={e => setForm({...form, target_role: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2.5 outline-none">
                    <option value="all">All Users</option>
                    <option value="garage">Garages Only</option>
                    <option value="vendor">Vendors Only</option>
                    <option value="admin">Admins Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-1.5 ml-1">Priority</label>
                  <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2.5 outline-none">
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]">Send Broadcast</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
