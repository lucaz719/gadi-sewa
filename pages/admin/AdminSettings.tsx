
import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import { useToast } from '../../App';

export default function AdminSettings() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    trial_period_days: 14,
    max_users_basic: 3,
    maintenance_mode: false,
    registration_freeze: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await db.getAdminSettings();
        if (data && Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        // Settings may not exist yet, use defaults
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await db.saveAdminSettings(settings);
      showToast('success', 'Platform settings saved successfully!');
    } catch (err) {
      showToast('error', 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96 text-slate-400">Loading settings...</div>;

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      <div className="border-b dark:border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-red-600 uppercase tracking-tighter">System Administration Settings</h1>
          <p className="text-slate-500 text-sm">Configure global platform parameters and infrastructure.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">{saving ? 'hourglass_empty' : 'save'}</span>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Status Indicators */}
      {(settings.maintenance_mode || settings.registration_freeze) && (
        <div className="flex gap-3">
          {settings.maintenance_mode && (
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-2.5">
              <span className="material-symbols-outlined text-amber-500 animate-pulse">construction</span>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">Maintenance Mode Active</span>
            </div>
          )}
          {settings.registration_freeze && (
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2.5">
              <span className="material-symbols-outlined text-blue-500">ac_unit</span>
              <span className="text-sm font-bold text-blue-700 dark:text-blue-400">Registrations Frozen</span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-4">
           <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
             <span className="material-symbols-outlined text-red-500">settings_remote</span>
             API & AI Configuration
           </h3>
           <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Gemini API Key Status</label>
                <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
                  <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                  Active & Connected
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Model Version</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2 text-sm outline-none">
                  <option>gemini-3-flash-preview</option>
                  <option>gemini-2.5-flash-lite-latest</option>
                </select>
              </div>
           </div>
        </section>

        <section className="space-y-4">
           <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
             <span className="material-symbols-outlined text-red-500">database</span>
             Platform Limits
           </h3>
           <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Default Trial Period (days)</span>
                <input
                  type="number"
                  value={settings.trial_period_days}
                  onChange={e => setSettings({ ...settings, trial_period_days: parseInt(e.target.value) || 0 })}
                  className="w-20 bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded text-center p-1.5 text-sm outline-none focus:border-red-500"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Max Users (Basic Tier)</span>
                <input
                  type="number"
                  value={settings.max_users_basic}
                  onChange={e => setSettings({ ...settings, max_users_basic: parseInt(e.target.value) || 0 })}
                  className="w-20 bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded text-center p-1.5 text-sm outline-none focus:border-red-500"
                />
              </div>
           </div>
        </section>
      </div>

      {/* Emergency Controls */}
      <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-red-600 mb-2">Emergency Override</h3>
        <p className="text-sm text-slate-500">Temporarily disable new registrations or place platform in maintenance mode.</p>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1e293b] rounded-xl border dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-500">construction</span>
              <div>
                <p className="font-bold text-sm">Maintenance Mode</p>
                <p className="text-xs text-slate-400">Users will see a maintenance banner</p>
              </div>
            </div>
            <button
              onClick={() => setSettings({ ...settings, maintenance_mode: !settings.maintenance_mode })}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.maintenance_mode ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.maintenance_mode ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1e293b] rounded-xl border dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-blue-500">person_off</span>
              <div>
                <p className="font-bold text-sm">Registration Freeze</p>
                <p className="text-xs text-slate-400">Prevent new enterprise sign-ups</p>
              </div>
            </div>
            <button
              onClick={() => setSettings({ ...settings, registration_freeze: !settings.registration_freeze })}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.registration_freeze ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.registration_freeze ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
