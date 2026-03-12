import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, ReferenceLine } from 'recharts';

interface Transaction {
  id: number;
  date: string;
  type: 'inflow' | 'outflow';
  category: string;
  amount: number;
  description: string;
}

interface Budget {
  id: number;
  category: string;
  limit: number;
  spent: number;
}

const initialTransactions: Transaction[] = [
  { id: 1, date: '2024-10-25', type: 'inflow', category: 'Sales', amount: 4500, description: 'Service Job #12345' },
  { id: 2, date: '2024-10-24', type: 'outflow', category: 'Inventory', amount: 12000, description: 'Purchase of Engine Oil' },
  { id: 3, date: '2024-10-23', type: 'outflow', category: 'Rent', amount: 25000, description: 'Monthly Shop Rent' },
  { id: 4, date: '2024-10-22', type: 'inflow', category: 'Sales', amount: 8000, description: 'Spare Parts Sale' },
  { id: 5, date: '2024-10-21', type: 'outflow', category: 'Marketing', amount: 2000, description: 'Facebook Ads' },
];

const initialBudgets: Budget[] = [
  { id: 1, category: 'Inventory', limit: 50000, spent: 32000 },
  { id: 2, category: 'Rent', limit: 25000, spent: 25000 },
  { id: 3, category: 'Marketing', limit: 10000, spent: 4500 },
  { id: 4, category: 'Utilities', limit: 5000, spent: 1200 },
  { id: 5, category: 'Salaries', limit: 100000, spent: 0 },
];

const categories = ['Sales', 'Service', 'Inventory', 'Rent', 'Marketing', 'Utilities', 'Salaries', 'Equipment', 'Other'];

export default function CashFlow() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [activeTab, setActiveTab] = useState<'transactions' | 'budgets'>('transactions');
  const [showModal, setShowModal] = useState(false);
  const [newTrans, setNewTrans] = useState({ type: 'inflow', amount: '', category: 'Sales', description: '', date: new Date().toISOString().split('T')[0] });

  // Calculate Totals
  const totalInflow = transactions.filter(t => t.type === 'inflow').reduce((acc, curr) => acc + curr.amount, 0);
  const totalOutflow = transactions.filter(t => t.type === 'outflow').reduce((acc, curr) => acc + curr.amount, 0);
  const netCashFlow = totalInflow - totalOutflow;

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newTrans.amount);
    if (!amount) return;

    const transaction: Transaction = {
      id: Date.now(),
      date: newTrans.date,
      type: newTrans.type as 'inflow' | 'outflow',
      category: newTrans.category,
      amount: amount,
      description: newTrans.description
    };

    setTransactions([transaction, ...transactions]);

    // Update budget if outflow
    if (newTrans.type === 'outflow') {
      setBudgets(prev => prev.map(b => 
        b.category === newTrans.category ? { ...b, spent: b.spent + amount } : b
      ));
    }

    setShowModal(false);
    setNewTrans({ type: 'inflow', amount: '', category: 'Sales', description: '', date: new Date().toISOString().split('T')[0] });
  };

  // Mock Data for Chart
  const chartData = [
    { name: 'Mon', inflow: 4000, outflow: 2400 },
    { name: 'Tue', inflow: 3000, outflow: 1398 },
    { name: 'Wed', inflow: 2000, outflow: 9800 },
    { name: 'Thu', inflow: 2780, outflow: 3908 },
    { name: 'Fri', inflow: 1890, outflow: 4800 },
    { name: 'Sat', inflow: 2390, outflow: 3800 },
    { name: 'Sun', inflow: 3490, outflow: 4300 },
  ];

  return (
    <div className="space-y-6">
       <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold">Cash Flow & Budget</h1>
             <p className="text-slate-500 text-sm">Track income, expenses, and manage budgets.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
             <span className="material-symbols-outlined">add_circle</span> Add Entry
          </button>
       </div>

       {/* Top Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700">
             <p className="text-sm font-medium text-slate-500">Total Inflow</p>
             <p className="text-3xl font-bold mt-2 text-green-600">₹{totalInflow.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700">
             <p className="text-sm font-medium text-slate-500">Total Outflow</p>
             <p className="text-3xl font-bold mt-2 text-red-600">₹{totalOutflow.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700">
             <p className="text-sm font-medium text-slate-500">Net Cash Flow</p>
             <p className={`text-3xl font-bold mt-2 ${netCashFlow >= 0 ? 'text-primary-600' : 'text-orange-600'}`}>
                {netCashFlow >= 0 ? '+' : '-'} ₹{Math.abs(netCashFlow).toLocaleString()}
             </p>
          </div>
       </div>

       {/* Main Content */}
       <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
             <button 
                onClick={() => setActiveTab('transactions')}
                className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'transactions' ? 'border-primary-500 text-primary-600 bg-slate-50 dark:bg-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
             >
                Transactions
             </button>
             <button 
                onClick={() => setActiveTab('budgets')}
                className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'budgets' ? 'border-primary-500 text-primary-600 bg-slate-50 dark:bg-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
             >
                Budget Plans
             </button>
          </div>

          <div className="p-6">
             {activeTab === 'transactions' && (
                <div className="space-y-6">
                   {/* Chart */}
                   <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            <Legend />
                            <Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
                         </BarChart>
                      </ResponsiveContainer>
                   </div>

                   {/* Table */}
                   <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                         <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                               <th className="p-4">Date</th>
                               <th className="p-4">Description</th>
                               <th className="p-4">Category</th>
                               <th className="p-4 text-right">Amount</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {transactions.map(t => (
                               <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                  <td className="p-4 text-slate-500">{t.date}</td>
                                  <td className="p-4 font-medium">{t.description}</td>
                                  <td className="p-4"><span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">{t.category}</span></td>
                                  <td className={`p-4 text-right font-bold ${t.type === 'inflow' ? 'text-green-600' : 'text-red-600'}`}>
                                     {t.type === 'inflow' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             )}

             {activeTab === 'budgets' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {budgets.map(budget => {
                         const percent = Math.min(100, Math.round((budget.spent / budget.limit) * 100));
                         let color = 'bg-green-500';
                         if (percent > 80) color = 'bg-yellow-500';
                         if (percent >= 100) color = 'bg-red-500';

                         return (
                            <div key={budget.id} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                               <div className="flex justify-between items-center mb-2">
                                  <h3 className="font-bold text-lg">{budget.category}</h3>
                                  <span className="text-xs font-medium bg-white dark:bg-slate-700 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">
                                     {percent}% Used
                                  </span>
                               </div>
                               <div className="flex justify-between text-sm text-slate-500 mb-2">
                                  <span>Spent: ₹{budget.spent.toLocaleString()}</span>
                                  <span>Limit: ₹{budget.limit.toLocaleString()}</span>
                                </div>
                                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                   <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percent}%` }}></div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                   <button className="text-xs text-primary-600 font-medium hover:underline">Edit Limit</button>
                                </div>
                            </div>
                         );
                      })}
                      
                      {/* Add New Budget Placeholder */}
                      <button className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-5 flex flex-col items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all">
                         <span className="material-symbols-outlined text-3xl mb-2">add</span>
                         <span className="font-medium">Create New Plan</span>
                      </button>
                   </div>
                </div>
             )}
          </div>
       </div>

       {/* Add Entry Modal */}
       {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
             <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                   <h3 className="text-lg font-bold">Add Manual Entry</h3>
                   <button onClick={() => setShowModal(false)}><span className="material-symbols-outlined text-slate-400">close</span></button>
                </div>
                <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
                   <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                      <button 
                        type="button" 
                        onClick={() => setNewTrans({...newTrans, type: 'inflow'})}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${newTrans.type === 'inflow' ? 'bg-white dark:bg-slate-700 shadow text-green-600' : 'text-slate-500'}`}
                      >
                         Inflow (Income)
                      </button>
                      <button 
                        type="button"
                        onClick={() => setNewTrans({...newTrans, type: 'outflow'})}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${newTrans.type === 'outflow' ? 'bg-white dark:bg-slate-700 shadow text-red-600' : 'text-slate-500'}`}
                      >
                         Outflow (Expense)
                      </button>
                   </div>

                   <div>
                      <label className="block text-sm font-medium mb-1">Amount</label>
                      <input 
                        type="number" 
                        required
                        value={newTrans.amount}
                        onChange={e => setNewTrans({...newTrans, amount: e.target.value})}
                        className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" 
                        placeholder="0.00" 
                      />
                   </div>

                   <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input 
                        type="date" 
                        required
                        value={newTrans.date}
                        onChange={e => setNewTrans({...newTrans, date: e.target.value})}
                        className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" 
                      />
                   </div>

                   <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select 
                        value={newTrans.category}
                        onChange={e => setNewTrans({...newTrans, category: e.target.value})}
                        className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                      >
                         {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                   </div>

                   <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <input 
                        type="text" 
                        required
                        value={newTrans.description}
                        onChange={e => setNewTrans({...newTrans, description: e.target.value})}
                        className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" 
                        placeholder="e.g. Sales from Order #101" 
                      />
                   </div>

                   <div className="pt-4 flex justify-end gap-3">
                      <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-sm font-medium">Cancel</button>
                      <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 shadow-md">Save Entry</button>
                   </div>
                </form>
             </div>
          </div>
       )}
    </div>
  );
}