import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const initialOrders = [
  { id: 'ORD-8921', date: '25 Oct, 2024', customer: 'City Auto Works', items: 12, total: '₹34,200', status: 'New', payment: 'Pending' },
  { id: 'ORD-8920', date: '25 Oct, 2024', customer: 'Quick Fix Mechanics', items: 5, total: '₹12,500', status: 'Processing', payment: 'Paid' },
  { id: 'ORD-8919', date: '24 Oct, 2024', customer: 'Star Service Center', items: 3, total: '₹8,900', status: 'Shipped', payment: 'Paid' },
  { id: 'ORD-8918', date: '24 Oct, 2024', customer: 'Luxury Cars Hub', items: 8, total: '₹56,000', status: 'Delivered', payment: 'Paid' },
  { id: 'ORD-8915', date: '23 Oct, 2024', customer: 'Mumbai Motors', items: 20, total: '₹1,05,000', status: 'New', payment: 'Pending' },
];

export default function VendorOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState('All Orders');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle Order Processing (Mock Logic)
  const handleProcessOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        if (order.status === 'New') return { ...order, status: 'Processing', payment: 'Paid' };
        if (order.status === 'Processing') return { ...order, status: 'Shipped' };
        if (order.status === 'Shipped') return { ...order, status: 'Delivered' };
      }
      return order;
    }));
  };

  const handlePrint = (orderId: string) => {
      alert(`Printing Order Invoice for ${orderId}...`);
  };

  const filteredOrders = orders.filter(order => {
     const matchesStatus = statusFilter === 'All Orders' || order.status === statusFilter;
     const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           order.customer.toLowerCase().includes(searchTerm.toLowerCase());
     return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
       <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold">Order Management</h1>
             <p className="text-slate-500 text-sm">Track and fulfill garage orders.</p>
          </div>
          <div className="flex gap-2">
             <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input 
                    type="text" 
                    placeholder="Search Order ID or Customer" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-[#1e293b] focus:ring-2 focus:ring-purple-500 outline-none" 
                />
             </div>
             <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-[#1e293b]">Export CSV</button>
          </div>
       </div>

       {/* Status Tabs */}
       <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {['All Orders', 'New', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
             <button 
                key={status} 
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    statusFilter === status 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 hover:border-purple-500 text-slate-600 dark:text-slate-300'
                }`}
             >
                {status}
             </button>
          ))}
       </div>

       {/* Orders Table */}
       <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          {filteredOrders.length > 0 ? (
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4 text-center">Items</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                            <Link to={`/vendor/orders/${order.id}`} className="font-bold text-purple-600 cursor-pointer hover:underline">
                                {order.id}
                            </Link>
                        </td>
                        <td className="p-4 text-slate-500">{order.date}</td>
                        <td className="p-4 font-medium text-slate-900 dark:text-white">{order.customer}</td>
                        <td className="p-4 text-center">{order.items}</td>
                        <td className="p-4 font-bold">{order.total}</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${order.payment === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {order.payment}
                            </span>
                        </td>
                        <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                order.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                order.status === 'Processing' ? 'bg-orange-100 text-orange-700' :
                                order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                                'bg-green-100 text-green-700'
                            }`}>
                                {order.status}
                            </span>
                        </td>
                        <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                    <button 
                                        onClick={() => handleProcessOrder(order.id)}
                                        className="text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded transition-colors"
                                    >
                                        {order.status === 'New' ? 'Accept' : order.status === 'Processing' ? 'Ship' : 'Deliver'}
                                    </button>
                                )}
                                <Link to={`/vendor/orders/${order.id}`} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                                    <span className="material-symbols-outlined align-middle text-lg">visibility</span>
                                </Link>
                            </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-500">
                <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">search_off</span>
                <p>No orders found matching your filters.</p>
            </div>
          )}
       </div>
    </div>
  );
}