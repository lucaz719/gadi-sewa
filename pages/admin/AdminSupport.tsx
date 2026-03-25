import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import { useToast } from '../../App';

export default function AdminSupport() {
    const { showToast } = useToast();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Open');

    const loadTickets = async () => {
        setLoading(true);
        try {
            const data = await db.getSupportTickets();
            setTickets(data);
        } catch (err) {
            showToast('error', 'Failed to load support tickets.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTickets();
    }, []);

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            await db.updateTicketStatus(id, status);
            showToast('success', `Ticket marked as ${status}.`);
            loadTickets();
        } catch (err) {
            showToast('error', 'Status update failed.');
        }
    };

    const filteredTickets = filter === 'All' ? tickets : tickets.filter(t => t.status === filter);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-red-600">Enterprise Support Hub</h1>
                    <p className="text-slate-500 text-sm">Manage and resolve inquiries from garage and vendor partners.</p>
                </div>
                <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border dark:border-slate-700">
                    {['Open', 'Resolved', 'All'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-white dark:bg-slate-700 shadow-sm text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center text-slate-400">Loading tickets...</div>
                ) : filteredTickets.length === 0 ? (
                    <div className="p-20 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">support_agent</span>
                        <p className="text-slate-400 font-medium">No tickets found for this filter.</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-700 text-[10px] uppercase font-black tracking-widest text-slate-400">
                            <tr>
                                <th className="p-4">Enterprise</th>
                                <th className="p-4">Issue</th>
                                <th className="p-4">Priority</th>
                                <th className="p-4">Created</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-700">
                            {filteredTickets.map(ticket => (
                                <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold">ENT-ID: {ticket.enterprise_id}</p>
                                        <p className="text-[10px] text-slate-400">Enterprise Detail Available</p>
                                    </td>
                                    <td className="p-4 max-w-md">
                                        <p className="font-bold text-slate-800 dark:text-slate-200">{ticket.subject}</p>
                                        <p className="text-xs text-slate-500 line-clamp-1">{ticket.message}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                            ticket.priority === 'High' ? 'bg-red-100 text-red-600' : 
                                            ticket.priority === 'Critical' ? 'bg-red-600 text-white' : 
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 text-xs">
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        {ticket.status === 'Open' ? (
                                            <button 
                                                onClick={() => handleStatusUpdate(ticket.id, 'Resolved')}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm transition-all"
                                            >
                                                Mark Resolved
                                            </button>
                                        ) : (
                                            <span className="text-green-500 font-bold text-[10px] uppercase flex items-center justify-end gap-1">
                                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                                Resolved
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
