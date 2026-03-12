import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { useToast } from '../App';

export default function Expenses() {
    const [expensesList, setExpensesList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        amount: '',
        category: 'Rent',
        vendor: '',
        type: 'Fixed', // Fixed or Variable
        description: ''
    });

    const authUser = db.getAuthUser();

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const txns = await db.getTransactions(authUser?.enterprise_id);
            setExpensesList(txns.filter((t: any) => t.type === 'Expense'));
        } catch (err) {
            showToast('error', 'Failed to fetch expenses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await db.logTransaction({
                type: 'Expense',
                expense_type: formData.type,
                amount: parseFloat(formData.amount),
                category: formData.category,
                description: `${formData.vendor} - ${formData.description}`,
                enterprise_id: authUser?.enterprise_id
            });
            showToast('success', 'Expense recorded');
            setShowModal(false);
            fetchExpenses();
            setFormData({ amount: '', category: 'Rent', vendor: '', type: 'Fixed', description: '' });
        } catch (err) {
            showToast('error', 'Failed to save expense');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Operational Expenses</h1>
                    <p className="text-slate-500 text-sm">Track Fixed & Variable costs for profit analysis.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined">remove</span> Record Expense
                </button>
            </div>

            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Description</th>
                            <th className="p-4 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {expensesList.map(exp => (
                            <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-4 text-slate-500">{new Date(exp.timestamp).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${exp.expense_type === 'Fixed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                            'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                                        }`}>
                                        {exp.expense_type}
                                    </span>
                                </td>
                                <td className="p-4 font-medium">{exp.category}</td>
                                <td className="p-4 text-slate-500">{exp.description}</td>
                                <td className="p-4 text-right font-bold text-red-500">NPR {exp.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                        {expensesList.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">No expenses recorded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Record Business Expense</h3>
                            <button onClick={() => setShowModal(false)}><span className="material-symbols-outlined text-slate-400">close</span></button>
                        </div>
                        <form onSubmit={handleAddExpense} className="p-6 space-y-4">
                            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'Fixed' })}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded ${formData.type === 'Fixed' ? 'bg-white dark:bg-slate-700 shadow text-blue-600' : 'text-slate-500'}`}
                                >Fixed Cost</button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'Variable' })}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded ${formData.type === 'Variable' ? 'bg-white dark:bg-slate-700 shadow text-orange-600' : 'text-slate-500'}`}
                                >Variable Cost</button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Amount (NPR)</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent"
                                >
                                    <option>Rent & Lease</option>
                                    <option>Utilities</option>
                                    <option>Inventory Purchase</option>
                                    <option>Salaries</option>
                                    <option>Marketing</option>
                                    <option>Maintenance</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Vendor / Payee</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.vendor}
                                    onChange={e => setFormData({ ...formData, vendor: e.target.value })}
                                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent"
                                    placeholder="Who was paid?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Notes</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent"
                                    placeholder="Optional details"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-medium">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 shadow-md">Record Expense</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}