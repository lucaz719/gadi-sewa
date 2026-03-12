import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function VendorOrderDetail() {
  const { id } = useParams();
  const [status, setStatus] = useState('Processing');

  // Mock Data
  const order = {
      id: id || 'ORD-8921',
      date: '25 Oct, 2024 - 10:30 AM',
      status: status,
      customer: {
          name: 'City Auto Works',
          contact: 'Rajesh Kumar',
          phone: '+91 98765 43210',
          email: 'cityauto@gmail.com',
          address: 'Shop No. 4, Main Road, Andheri East, Mumbai - 400069',
          type: 'Garage'
      },
      items: [
          { id: 1, name: 'Bosch Brake Pads (Front)', sku: 'BP-FR-001', price: 1800, qty: 2, total: 3600, img: 'https://images.unsplash.com/photo-1600161599939-23d16036198c?w=100&h=100&fit=crop' },
          { id: 2, name: 'Shell Helix Ultra 5W-40 (4L)', sku: 'OIL-HEL-4L', price: 3200, qty: 1, total: 3200, img: 'https://images.unsplash.com/photo-1635784183209-e8c690e250f2?w=100&h=100&fit=crop' },
          { id: 3, name: 'Oil Filter (Honda City)', sku: 'OF-HC-01', price: 350, qty: 4, total: 1400, img: 'https://images.unsplash.com/photo-1517059478735-9b73637b6c5e?w=100&h=100&fit=crop' }
      ],
      pricing: {
          subtotal: 8200,
          shipping: 150,
          tax: 1476,
          total: 9826
      },
      payment: {
          method: 'UPI',
          status: 'Paid',
          transactionId: 'UPI-1234567890'
      },
      timeline: [
          { status: 'Order Placed', time: '25 Oct, 10:30 AM', done: true },
          { status: 'Confirmed', time: '25 Oct, 10:35 AM', done: true },
          { status: 'Processing', time: '25 Oct, 11:00 AM', done: true },
          { status: 'Shipped', time: 'Pending', done: false },
          { status: 'Delivered', time: 'Pending', done: false },
      ]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
       {/* Header */}
       <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex items-center gap-4">
             <Link to="/vendor/orders" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
             </Link>
             <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">{order.id}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        status === 'New' ? 'bg-blue-100 text-blue-700' :
                        status === 'Processing' ? 'bg-orange-100 text-orange-700' :
                        status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                        {status}
                    </span>
                </div>
                <p className="text-slate-500 text-sm mt-1">{order.date}</p>
             </div>
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined">print</span> Invoice
             </button>
             <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined">local_shipping</span> Label
             </button>
             {status !== 'Delivered' && (
                 <button 
                    onClick={() => setStatus(status === 'New' ? 'Processing' : status === 'Processing' ? 'Shipped' : 'Delivered')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 shadow-sm flex items-center gap-2"
                 >
                    <span className="material-symbols-outlined">fast_forward</span> 
                    {status === 'New' ? 'Process Order' : status === 'Processing' ? 'Mark Shipped' : 'Mark Delivered'}
                 </button>
             )}
          </div>
       </div>

       {/* Timeline */}
       <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
           <div className="flex items-center justify-between relative">
               <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-200 dark:bg-slate-700 -z-0"></div>
               {order.timeline.map((step, idx) => (
                   <div key={idx} className="relative z-10 flex flex-col items-center bg-white dark:bg-[#1e293b] px-2">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 border-2 ${step.done ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'}`}>
                           {step.done ? <span className="material-symbols-outlined text-sm">check</span> : <span className="text-xs font-bold">{idx + 1}</span>}
                       </div>
                       <p className={`text-xs font-bold ${step.done ? 'text-purple-600' : 'text-slate-500'}`}>{step.status}</p>
                       <p className="text-[10px] text-slate-400">{step.time}</p>
                   </div>
               ))}
           </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Left: Items */}
           <div className="lg:col-span-2 space-y-6">
               <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                   <div className="p-4 border-b border-slate-200 dark:border-slate-700 font-bold">Order Items</div>
                   <table className="w-full text-left text-sm">
                       <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                           <tr>
                               <th className="p-4">Product</th>
                               <th className="p-4 text-center">Qty</th>
                               <th className="p-4 text-right">Price</th>
                               <th className="p-4 text-right">Total</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                           {order.items.map(item => (
                               <tr key={item.id}>
                                   <td className="p-4">
                                       <div className="flex items-center gap-3">
                                           <img src={item.img} className="w-12 h-12 rounded-lg object-cover bg-slate-100" alt="" />
                                           <div>
                                               <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                                               <p className="text-xs text-slate-500 font-mono">{item.sku}</p>
                                           </div>
                                       </div>
                                   </td>
                                   <td className="p-4 text-center">{item.qty}</td>
                                   <td className="p-4 text-right">₹{item.price}</td>
                                   <td className="p-4 text-right font-bold">₹{item.total}</td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
                   <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                       <div className="flex justify-end gap-12 text-sm">
                           <div className="text-right space-y-2">
                               <p className="text-slate-500">Subtotal</p>
                               <p className="text-slate-500">Shipping</p>
                               <p className="text-slate-500">Tax (18%)</p>
                               <p className="font-bold text-lg text-slate-900 dark:text-white pt-2">Total</p>
                           </div>
                           <div className="text-right space-y-2 font-medium">
                               <p>₹{order.pricing.subtotal}</p>
                               <p>₹{order.pricing.shipping}</p>
                               <p>₹{order.pricing.tax}</p>
                               <p className="font-bold text-lg text-purple-600 pt-2">₹{order.pricing.total}</p>
                           </div>
                       </div>
                   </div>
               </div>
           </div>

           {/* Right: Customer & Info */}
           <div className="space-y-6">
               <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                   <h3 className="font-bold text-lg mb-4">Customer Details</h3>
                   <div className="flex items-start gap-3 mb-4">
                       <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">CA</div>
                       <div>
                           <p className="font-bold text-slate-900 dark:text-white">{order.customer.name}</p>
                           <p className="text-xs text-slate-500">{order.customer.type}</p>
                       </div>
                   </div>
                   <div className="space-y-3 text-sm">
                       <div>
                           <p className="text-xs text-slate-500">Contact Person</p>
                           <p className="font-medium">{order.customer.contact}</p>
                       </div>
                       <div>
                           <p className="text-xs text-slate-500">Phone</p>
                           <p className="font-medium">{order.customer.phone}</p>
                       </div>
                       <div>
                           <p className="text-xs text-slate-500">Email</p>
                           <p className="font-medium">{order.customer.email}</p>
                       </div>
                       <div>
                           <p className="text-xs text-slate-500">Shipping Address</p>
                           <p className="font-medium">{order.customer.address}</p>
                       </div>
                   </div>
               </div>

               <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                   <h3 className="font-bold text-lg mb-4">Payment Info</h3>
                   <div className="flex justify-between items-center mb-2">
                       <span className="text-sm text-slate-500">Status</span>
                       <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">{order.payment.status}</span>
                   </div>
                   <div className="flex justify-between items-center mb-2">
                       <span className="text-sm text-slate-500">Method</span>
                       <span className="text-sm font-medium">{order.payment.method}</span>
                   </div>
                   <div className="flex justify-between items-center">
                       <span className="text-sm text-slate-500">Transaction ID</span>
                       <span className="text-sm font-mono text-slate-600 dark:text-slate-400">{order.payment.transactionId}</span>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
}