import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import { aiBackend } from '../../services/ai';
import { useToast } from '../../App';

export default function GlobalCatalog() {
  const { showToast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await db.getGlobalCatalog();
      setItems(data);
    } catch (err) {
      showToast('error', 'Failed to load catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSyncWithAI = async () => {
    setIsSyncing(true);
    showToast('info', 'Connecting to global automotive data servers...');
    try {
      const newList = await aiBackend.fetchGlobalPartsList();
      await db.saveGlobalCatalog(newList);
      setItems(newList);
      showToast('success', 'Master Catalog synchronized with Nepal Market standards!');
    } catch (err) {
      showToast('error', 'Failed to synchronize catalog.');
    } finally {
      setIsSyncing(false);
    }
  };

  const categories = ['All Categories', ...new Set(items.map(i => i.category))];
  const vehicleTypes = ['All Types', 'Car', 'Motorbike', 'Truck'];

  const filtered = items.filter(i => {
    const nameStr = i.name || '';
    const modelStr = i.vehicle_model || '';
    const matchesSearch = nameStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modelStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All Types' || i.vehicle_type === typeFilter;
    const matchesCategory = categoryFilter === 'All Categories' || i.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-red-600">Global Item Catalog</h1>
          <p className="text-slate-500 text-sm">Centralized parts database for Vendors and Garages in Nepal.</p>
        </div>
        <button
          onClick={handleSyncWithAI}
          disabled={isSyncing}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95"
        >
          <span className={`material-symbols-outlined ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
          {isSyncing ? 'Syncing...' : 'Sync Market Data (AI)'}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            placeholder="Search parts or specific models..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none">
          {vehicleTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4 font-black text-slate-400 uppercase text-[10px]">Item Details</th>
                <th className="p-4 font-black text-slate-400 uppercase text-[10px]">Category</th>
                <th className="p-4 font-black text-slate-400 uppercase text-[10px]">Vehicle Type</th>
                <th className="p-4 font-black text-slate-400 uppercase text-[10px]">Common Model</th>
                <th className="p-4 font-black text-slate-400 uppercase text-[10px]">UOM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                <tr><td colSpan={5} className="p-12 text-center text-slate-400">Loading master catalog...</td></tr>
              ) : filtered.map((item, idx) => (
                <tr key={idx} className="hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white uppercase leading-tight">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">CODE: {item.id}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">{item.category}</span>
                  </td>
                  <td className="p-4 font-medium">{item.vehicle_type}</td>
                  <td className="p-4 font-bold text-slate-600 dark:text-slate-400">{item.vehicle_model || '-'}</td>
                  <td className="p-4 text-slate-500 font-medium">{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
