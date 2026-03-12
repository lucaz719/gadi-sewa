import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import { useToast } from '../../App';

export default function VoucherManagement() {
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        code: '',
        discount_type: 'Percentage',
        value: '',
        min_spend: '0',
        expires_at: ''
    });

    const loadVouchers = async () => {
        setLoading(true);
        try {
            const data = await db.getVouchers();
            setVouchers(data);
        } catch (err) {
            showToast('error', 'Failed to load vouchers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVouchers();
    }, []);

    const handleCreateVoucher = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await db.saveVoucher({
                ...formData,
                value: parseFloat(formData.value),
                min_spend: parseFloat(formData.min_spend),
                expires_at: new Date(formData.expires_at).toISOString()
            });
            showToast('success', 'Voucher created and active');
            setShowModal(false);
            loadVouchers();
            setFormData({ code: '', discount_type: 'Percentage', value: '', min_spend: '0', expires_at: '' });
        } catch (err) {
            showToast('error', 'Failed to create voucher');
        }
    };

    const toggleVoucher = async (id: number) => {
        try {
            await db.toggleVoucher(id);
            loadVouchers();
            showToast('success', 'Status updated');
        } catch (err) {
            showToast('error', 'Update failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Voucher Center</h1>
                    <p className="text-slate-500 text-sm">Create and manage promotional discounts for the ecosystem.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">confirmation_number</span>
                    Create New Voucher
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="col-span-full text-center py-12 text-slate-400">Synchronizing with system engine...</p>
                ) : vouchers.map(v => (
                    <div key={v.id} className={`p-6 rounded-2xl border bg-white dark:bg-[#1e293b] shadow-sm relative overflow-hidden group ${!v.is_active ? 'opacity-60 grayscale' : 'border-red-500/20'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-2xl font-black text-red-600 font-mono tracking-tighter">{v.code}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{v.discount_type} Discount</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${v.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {v.is_active ? 'Active' : 'Expired'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between items-center border-b dark:border-slate-800 pb-2">
                                <span className="text-xs text-slate-400 font-medium">Value</span>
                                <span className="font-bold">{v.discount_type === 'Percentage' ? `${v.value}%` : `NPR ${v.value}`}</span>
                            </div>
                            <div className="flex justify-between items-center border-b dark:border-slate-800 pb-2">
                                <span className="text-xs text-slate-400 font-medium">Min Spend</span>
                                <span className="font-medium text-xs">NPR {v.min_spend}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400 font-medium">Expires</span>
                                <span className="text-[10px] font-mono">{new Date(v.expires_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleVoucher(v.id)}
                            className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 transition-all"
                        >
                            {v.is_active ? 'Deactivate Now' : 'Reactivate Voucher'}
                        </button>
                    </div>
                ))}
                {!loading && vouchers.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4">
                        <span className="material-symbols-outlined text-5xl text-slate-300">confirmation_number</span>
                        <p className="text-slate-400 italic">No vouchers active. Start by creating your first promotional code.</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in border dark:border-slate-700">
                        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg">New Promo Voucher</h3>
                            <button onClick={() => setShowModal(false)}><span className="material-symbols-outlined text-slate-400">close</span></button>
                        </div>
                        <form onSubmit={handleCreateVoucher} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-1.5">Voucher Code</label>
                                    <input required type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2.5 uppercase font-mono tracking-widest outline-none focus:border-red-500" placeholder="E.G. DASHDAI20" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-1.5">Type</label>
                                    <select value={formData.discount_type} onChange={e => setFormData({ ...formData, discount_type: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2.5 text-sm outline-none">
                                        <option>Percentage</option>
                                        <option>Fixed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-1.5">Value {formData.discount_type === 'Percentage' ? '(%)' : '(NPR)'}</label>
                                    <input required type="number" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-red-500" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-1.5">Expiry Date</label>
                                    <input required type="date" value={formData.expires_at} onChange={e => setFormData({ ...formData, expires_at: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-red-500" />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all">Discard</button>
                                <button type="submit" className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition-all active:scale-95">Generate Voucher</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
