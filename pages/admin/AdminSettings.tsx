
import React from 'react';

export default function AdminSettings() {
  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      <div className="border-b dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-red-600 uppercase tracking-tighter">System Administration Settings</h1>
        <p className="text-slate-500 text-sm">Configure global platform parameters and infrastructure.</p>
      </div>

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
                <span className="text-sm">Default Trial Period</span>
                <input type="number" defaultValue="14" className="w-16 bg-slate-50 dark:bg-slate-900 border rounded text-center p-1 text-sm" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Max Users (Basic)</span>
                <input type="number" defaultValue="3" className="w-16 bg-slate-50 dark:bg-slate-900 border rounded text-center p-1 text-sm" />
              </div>
           </div>
        </section>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl">
        <h3 className="font-bold text-red-600 mb-2">Emergency Override</h3>
        <p className="text-sm text-slate-500 mb-4">Temporarily disable new registrations or place platform in maintenance mode.</p>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-red-600 text-white text-xs font-bold rounded-lg uppercase tracking-widest">Toggle Maintenance</button>
          <button className="px-6 py-2 border border-red-500/50 text-red-600 text-xs font-bold rounded-lg uppercase tracking-widest">Clear Global Cache</button>
        </div>
      </div>
    </div>
  );
}
