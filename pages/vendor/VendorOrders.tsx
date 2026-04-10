import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/db';
import { useToast } from '../../App';

export default function VendorOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All Orders');
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const authUser = db.getAuthUser();
  const vendorId = authUser?.enterprise_id;

  const loadOrders = async () => {
    if (!vendorId) return;
    setLoading(true);
    try {
      const data = await db.getVendorOrders(vendorId);
      setOrders(data);
    } catch (err) {
      showToast('error', 'Failed to synchronize fulfillment queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, [vendorId]);

  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
        await db.updateVendorOrderStatus(orderId, status);
        showToast('success', `Order marked as ${status}`);
        loadOrders();
    } catch (err) {
        showToast('error', 'Status update failed.');
    }
  };

  const filteredOrders = orders.filter(order => {
     const matchesStatus = statusFilter === 'All Orders' || order.status === statusFilter;
     const matchesSearch = order.id.toString().includes(searchTerm) || 
                           order.garage_id.toString().includes(searchTerm);
     return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
             <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">Fulfillment Center</h1>
             <p className="text-slate-500 text-sm font-medium">Manage cross-enterprise B2B supply requests.</p>
          </div>
          <div className="flex gap-3">
             <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                <input 
                    type="text" 
                    placeholder="Search Order ID or Garage..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-6 py-3 border-none bg-white dark:bg-[#1e293b] rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-purple-500 outline-none shadow-sm w-64" 
                />
             </div>
             <button className="px-6 py-3 bg-white dark:bg-[#1e293b] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm border border-slate-100 dark:border-slate-800">Export Ledger</button>
          </div>
       </div>

       {/* Status Tabs */}
       <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
          {['All Orders', 'New', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
             <button 
                key={status} 
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                    statusFilter === status 
                    ? 'bg-purple-600 text-white shadow-[0_10px_20px_rgba(147,51,234,0.3)]' 
                    : 'bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-slate-700 hover:border-purple-500 text-slate-500 dark:text-slate-400'
                }`}
             >
                {status}
             </button>
          ))}
       </div>

       {/* Orders Table */}
       <div className="flex-1 bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xl flex flex-col">
          <div className="overflow-x-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
             <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 border-b border-slate-100 dark:border-slate-800">
                     <tr>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest">Tracking ID</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest">Dispatch Date</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest">Garage Source</th>
                        <th className="p-6 text-center text-[10px] font-black uppercase tracking-widest">SKU Count</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest">Total Valuation</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest">Fulfillment</th>
                        <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest">Authority</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                     {loading ? (
                         <tr><td colSpan={7} className="p-12 text-center text-slate-400 font-medium italic animate-pulse text-[10px] uppercase tracking-widest">Syncing Fulfillment Ledger...</td></tr>
                     ) : filteredOrders.length === 0 ? (
                         <tr><td colSpan={7} className="p-24 text-center">
                             <span className="material-symbols-outlined text-6xl mb-4 opacity-10">local_shipping</span>
                             <p className="font-black text-[10px] uppercase tracking-widest opacity-40">Queue cleared. No pending shipments.</p>
                         </td></tr>
                     ) : filteredOrders.map(order => (
                     <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                         <td className="p-6">
                             <Link to={`/vendor/orders/${order.id}`} className="font-black text-purple-600 dark:text-purple-400 cursor-pointer hover:underline tracking-tighter uppercase">
                                 #ORD-{order.id}
                             </Link>
                         </td>
                         <td className="p-6 text-[10px] font-black text-slate-500 uppercase">{new Date(order.created_at).toLocaleDateString()}</td>
                         <td className="p-6 font-black text-slate-900 dark:text-white uppercase tracking-tighter">Enterprise #{order.garage_id}</td>
                         <td className="p-6 text-center font-bold text-slate-500">{order.items.length}</td>
                         <td className="p-6 font-black text-slate-900 dark:text-white tracking-tighter">NPR {order.total_amount.toLocaleString()}</td>
                         <td className="p-6">
                             <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm ${
                                 order.status === 'New' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                 order.status === 'Processing' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                 order.status === 'Shipped' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                 'bg-green-100 text-green-700 border-green-200'
                             }`}>
                                 {order.status}
                             </span>
                         </td>
                         <td className="p-6 text-right">
                             <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                 {['New', 'Processing', 'Shipped'].includes(order.status) && (
                                     <button 
                                         onClick={() => {
                                             const nextStatus = order.status === 'New' ? 'Processing' : 
                                                               order.status === 'Processing' ? 'Shipped' : 'Delivered';
                                             handleUpdateStatus(order.id, nextStatus);
                                         }}
                                         className="text-[9px] font-black text-white bg-slate-900 dark:bg-purple-600 hover:scale-105 px-4 py-2 rounded-xl transition-all shadow-lg uppercase tracking-widest"
                                     >
                                         {order.status === 'New' ? 'Authorize' : order.status === 'Processing' ? 'Dispatch' : 'Complete'}
                                     </button>
                                 )}
                                 <Link to={`/vendor/orders/${order.id}`} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-100 hover:text-slate-900 transition-all">
                                     <span className="material-symbols-outlined text-xl">visibility</span>
                                 </Link>
                             </div>
                         </td>
                     </tr>
                     ))}
                 </tbody>
             </table>
          </div>
          
          <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center mt-auto">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm text-green-500">lock</span>
                  End-to-end encrypted procurement protocol.
              </div>
              <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">
                  Queue Load: <span className="text-purple-600 ml-1">{filteredOrders.length} active shipments</span>
              </p>
          </div>
       </div>
    </div>
  );
}