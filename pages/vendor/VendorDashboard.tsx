import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';

const salesData = [
  { name: '1 Oct', value: 1200 },
  { name: '5 Oct', value: 3500 },
  { name: '10 Oct', value: 2800 },
  { name: '15 Oct', value: 4500 },
  { name: '20 Oct', value: 3200 },
  { name: '25 Oct', value: 5800 },
];

const categoryData = [
  { name: 'Engine Parts', value: 45 },
  { name: 'Tires', value: 25 },
  { name: 'Lubricants', value: 20 },
  { name: 'Accessories', value: 10 },
];

const COLORS = ['#9333ea', '#ec4899', '#3b82f6', '#10b981'];

const StatCard = ({ title, value, subtext, icon, color }: any) => (
  <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
        <span className={`material-symbols-outlined ${color.replace('bg-', 'text-')}`}>{icon}</span>
      </div>
    </div>
    <div className="mt-3 text-sm">
      {subtext}
    </div>
  </div>
);

export default function VendorDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back, AutoParts Distributor Ltd.</p>
        </div>
        <div className="flex gap-2">
           <Link to="/vendor/products" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined">add</span> Add Product
           </Link>
           <button className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined">campaign</span> Broadcast Offer
           </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Today's Orders" 
          value="12" 
          subtext={<span className="text-purple-600 font-medium">₹45,200 Revenue</span>}
          icon="shopping_bag" 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Pending Orders" 
          value="5" 
          subtext={<span className="text-orange-500 font-medium">Needs Attention</span>}
          icon="pending" 
          color="bg-orange-500" 
        />
        <StatCard 
          title="Revenue (Month)" 
          value="₹4.2L" 
          subtext={<span className="text-green-500 font-medium">+12.5% vs last month</span>}
          icon="payments" 
          color="bg-green-500" 
        />
        <StatCard 
          title="Active Garages" 
          value="24" 
          subtext={<span className="text-blue-500 font-medium">2 New this week</span>}
          icon="store" 
          color="bg-blue-500" 
        />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold">Order Volume Trend</h3>
             <select className="bg-slate-100 dark:bg-slate-800 border-none text-xs rounded-lg px-3 py-1.5 outline-none">
               <option>Last 30 Days</option>
               <option>Last Quarter</option>
             </select>
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#9333ea" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
           <h3 className="text-lg font-bold mb-4">Revenue by Category</h3>
           <div className="h-[220px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                    <p className="text-2xl font-bold">1.5k</p>
                    <p className="text-xs text-slate-500">Items Sold</p>
                 </div>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-4 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">{item.name}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Recent Orders List */}
         <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Recent Orders</h3>
                <Link to="/vendor/orders" className="text-sm text-purple-600 font-medium hover:underline">View All</Link>
             </div>
             <div className="space-y-4">
                {[
                  { id: 'ORD-8921', garage: 'City Auto Works', items: 'Brake Pads, Oil Filter', amount: '₹3,200', status: 'New', time: '10 mins ago' },
                  { id: 'ORD-8920', garage: 'Quick Fix Mechanics', items: '5W-30 Oil (20L)', amount: '₹12,500', status: 'Processing', time: '1 hour ago' },
                  { id: 'ORD-8919', garage: 'Star Service Center', items: 'Clutch Plate Kit', amount: '₹8,900', status: 'Shipped', time: '3 hours ago' },
                ].map(order => (
                   <div key={order.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                            <span className="material-symbols-outlined">inventory_2</span>
                         </div>
                         <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white">{order.garage}</p>
                            <p className="text-xs text-slate-500">{order.items}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="font-bold text-sm">{order.amount}</p>
                         <p className="text-xs text-slate-400">{order.time}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                         order.status === 'New' ? 'bg-blue-100 text-blue-700' : 
                         order.status === 'Processing' ? 'bg-orange-100 text-orange-700' : 
                         'bg-green-100 text-green-700'
                      }`}>
                         {order.status}
                      </span>
                   </div>
                ))}
             </div>
         </div>

         {/* Low Stock Alerts */}
         <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <h3 className="text-lg font-bold mb-4">Low Stock Alerts</h3>
             <div className="space-y-3">
                {[
                   { name: 'Bosch Spark Plugs', stock: 5, alert: 'Critical' },
                   { name: 'Shell Helix Ultra', stock: 12, alert: 'Low' },
                   { name: 'Air Filter (Honda)', stock: 8, alert: 'Low' }
                ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-700 rounded-lg">
                      <div>
                         <p className="font-medium text-sm text-slate-900 dark:text-white">{item.name}</p>
                         <p className="text-xs text-slate-500">{item.stock} units left</p>
                      </div>
                      <button className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded transition-colors">
                         Restock
                      </button>
                   </div>
                ))}
             </div>
             <Link to="/vendor/products" className="block text-center mt-4 text-sm text-purple-600 font-medium hover:underline">Go to Inventory</Link>
         </div>
      </div>
    </div>
  );
}