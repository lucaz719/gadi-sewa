import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/db';
import { useToast } from '../../App';

export default function UserManagement() {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [enterprises, setEnterprises] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createdCredentials, setCreatedCredentials] = useState<any>(null);
    const [resetModal, setResetModal] = useState<any>(null);
    const [resetPassword, setResetPassword] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    const [newEnt, setNewEnt] = useState({
        name: '',
        type: 'Garage',
        owner: '',
        email: '',
        password: '',
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const [ents, userList] = await Promise.all([
                db.getEnterprises(),
                db.getUsers()
            ]);
            setEnterprises(ents);
            setUsers(userList);
        } catch (err) {
            showToast('error', 'Failed to synchronize with server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleCreateEnterprise = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await db.saveEnterprise({
                ...newEnt,
                plan_id: 'PLAN-FREE',
                password: newEnt.password || undefined
            });
            setCreatedCredentials({
                businessName: newEnt.name,
                type: newEnt.type,
                email: result.user?.email || newEnt.email,
                password: result.user?.password || `${newEnt.email.split('@')[0]}@123`,
                role: result.user?.role || (newEnt.type === 'Garage' ? 'garage' : 'vendor'),
            });
            setShowCreateModal(false);
            loadData();
            setNewEnt({ name: '', type: 'Garage', owner: '', email: '', password: '' });
            showToast('success', 'Enterprise onboarded with login credentials!');
        } catch (err: any) {
            showToast('error', err.message || 'Onboarding failed.');
        }
    };

    const toggleUser = async (id: number) => {
        try {
            await db.toggleUserActive(id);
            loadData();
            showToast('success', 'User status toggled.');
        } catch (err) {
            showToast('error', 'Action failed.');
        }
    };

    const handleResetPassword = async () => {
        if (!resetModal) return;
        try {
            const result = await db.resetUserPassword(resetModal.id, resetPassword || undefined);
            setCreatedCredentials({
                businessName: resetModal.full_name,
                type: 'Password Reset',
                email: resetModal.email,
                password: result.new_password,
                role: resetModal.role,
            });
            setResetModal(null);
            setResetPassword('');
            showToast('success', 'Password reset successfully!');
        } catch (err: any) {
            showToast('error', err.message || 'Password reset failed.');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast('info', 'Copied to clipboard!');
    };

    const filteredUsers = filterRole === 'all' ? users : users.filter((u: any) => u.role === filterRole);
    const roleCounts = {
        all: users.length,
        admin: users.filter((u: any) => u.role === 'admin').length,
        garage: users.filter((u: any) => u.role === 'garage').length,
        vendor: users.filter((u: any) => u.role === 'vendor').length,
        customer: users.filter((u: any) => u.role === 'customer').length,
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-red-600">Administrative Access Control</h1>
                    <p className="text-slate-500 text-sm">Strict RBAC: Oversee enterprises and individual user accounts.</p>
                </div>
                <button onClick={() => setShowCreateModal(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95">
                    <span className="material-symbols-outlined">add_business</span>
                    Register New Enterprise
                </button>
            </div>

            {/* Role Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {[
                    { key: 'all', label: 'All Users', color: 'bg-slate-600' },
                    { key: 'admin', label: 'Admins', color: 'bg-red-600' },
                    { key: 'garage', label: 'Garages', color: 'bg-blue-600' },
                    { key: 'vendor', label: 'Vendors', color: 'bg-purple-600' },
                    { key: 'customer', label: 'Customers', color: 'bg-orange-500' },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilterRole(tab.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filterRole === tab.key ? `${tab.color} text-white shadow-lg` : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
                    >
                        {tab.label} ({(roleCounts as any)[tab.key]})
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Enterprises Section */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest px-1">Registered Organizations</h2>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                        {enterprises.map((ent: any) => (
                            <div key={ent.id} onClick={() => navigate(`/admin/enterprises/${ent.id}`)} className="p-4 bg-white dark:bg-[#1e293b] rounded-xl border dark:border-slate-800 shadow-sm cursor-pointer hover:border-red-300 dark:hover:border-red-800 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-sm">{ent.name}</h3>
                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${ent.type === 'Garage' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                        {ent.type}
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-400 mb-2">Owner: {ent.owner}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-slate-500">{ent.email}</span>
                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${ent.status === 'Active' ? 'bg-green-100 text-green-600' : ent.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                                        {ent.status || 'Active'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {!loading && enterprises.length === 0 && <p className="text-center py-8 text-slate-400 text-xs italic">No organizations found.</p>}
                    </div>
                </div>

                {/* Users Section */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest px-1">
                        {filterRole === 'all' ? 'All System Users' : `${filterRole.charAt(0).toUpperCase() + filterRole.slice(1)} Users`} ({filteredUsers.length})
                    </h2>
                    <div className="bg-white dark:bg-[#1e293b] rounded-xl border dark:border-slate-800 overflow-hidden shadow-sm">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800">
                                <tr>
                                    <th className="p-4 uppercase tracking-widest font-black text-slate-400">Identity</th>
                                    <th className="p-4 uppercase tracking-widest font-black text-slate-400">Role</th>
                                    <th className="p-4 uppercase tracking-widest font-black text-slate-400">Enterprise</th>
                                    <th className="p-4 uppercase tracking-widest font-black text-slate-400">Status</th>
                                    <th className="p-4 text-right uppercase tracking-widest font-black text-slate-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-slate-800">
                                {filteredUsers.map((u: any) => (
                                    <tr key={u.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/20 ${!u.is_active ? 'opacity-50' : ''}`}>
                                        <td className="p-4">
                                            <p className="font-bold text-slate-900 dark:text-white">{u.full_name}</p>
                                            <p className="text-[10px] text-slate-400 font-mono tracking-tighter">{u.email}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] tracking-wide ${u.role === 'admin' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : u.role === 'garage' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : u.role === 'vendor' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[10px] text-slate-500">
                                                {u.enterprise_id ? enterprises.find((e: any) => e.id === u.enterprise_id)?.name || `ENT-${u.enterprise_id}` : '—'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`flex items-center gap-1 font-bold uppercase text-[9px] ${u.is_active ? 'text-green-500' : 'text-red-500'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                {u.is_active ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <button
                                                    onClick={() => { setResetModal(u); setResetPassword(''); }}
                                                    className="px-2.5 py-1.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-all"
                                                    title="Reset Password"
                                                >
                                                    <span className="material-symbols-outlined text-sm">key</span>
                                                </button>
                                                <button
                                                    onClick={() => toggleUser(u.id)}
                                                    className={`px-2.5 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition-all ${u.is_active ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'}`}
                                                >
                                                    {u.is_active ? 'Suspend' : 'Activate'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-400 text-xs">No users found for this filter.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Enterprise Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Onboard Enterprise</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={handleCreateEnterprise} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-1.5 ml-1">Business Name</label>
                                    <input required type="text" value={newEnt.name} onChange={e => setNewEnt({ ...newEnt, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2.5 outline-none focus:border-red-500" placeholder="e.g. Kathmandu Spares" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-1.5 ml-1">Business Type</label>
                                    <select value={newEnt.type} onChange={e => setNewEnt({ ...newEnt, type: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2.5 outline-none">
                                        <option>Garage</option>
                                        <option>Vendor</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-1.5 ml-1">Primary Owner</label>
                                    <input required type="text" value={newEnt.owner} onChange={e => setNewEnt({ ...newEnt, owner: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2.5 outline-none focus:border-red-500" placeholder="Full Name" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-1.5 ml-1">Login Email</label>
                                    <input required type="email" value={newEnt.email} onChange={e => setNewEnt({ ...newEnt, email: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2.5 outline-none focus:border-red-500" placeholder="owner@business.com" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-1.5 ml-1">
                                        Login Password
                                        <span className="text-slate-400 font-normal normal-case ml-1">(leave blank to auto-generate)</span>
                                    </label>
                                    <input type="text" value={newEnt.password} onChange={e => setNewEnt({ ...newEnt, password: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2.5 outline-none focus:border-red-500 font-mono" placeholder={newEnt.email ? `${newEnt.email.split('@')[0]}@123` : 'Auto-generated'} />
                                </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex items-start gap-2">
                                <span className="material-symbols-outlined text-blue-500 text-sm mt-0.5">info</span>
                                <p className="text-xs text-blue-600 dark:text-blue-400">A user account will be automatically created with these credentials. The owner can sign in immediately.</p>
                            </div>
                            <div className="pt-2 flex gap-3">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]">Confirm Onboarding</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Password Reset Modal */}
            {resetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-5 border-b dark:border-slate-700 bg-amber-50 dark:bg-amber-900/20 flex items-center gap-3">
                            <span className="material-symbols-outlined text-amber-600">key</span>
                            <div>
                                <h3 className="font-bold">Reset Password</h3>
                                <p className="text-xs text-amber-600/80">{resetModal.full_name} ({resetModal.email})</p>
                            </div>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-1.5">New Password</label>
                                <input
                                    type="text"
                                    value={resetPassword}
                                    onChange={e => setResetPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg p-2.5 outline-none focus:border-amber-500 font-mono"
                                    placeholder={`${resetModal.email.split('@')[0]}@123`}
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Leave blank to auto-generate from email</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setResetModal(null)} className="flex-1 py-2.5 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
                                <button onClick={handleResetPassword} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]">Reset Password</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Credentials Display Modal */}
            {createdCredentials && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b dark:border-slate-700 bg-green-50 dark:bg-green-900/20 flex items-center gap-3">
                            <span className="material-symbols-outlined text-green-600 text-2xl">check_circle</span>
                            <div>
                                <h3 className="font-bold text-lg text-green-700 dark:text-green-400">
                                    {createdCredentials.type === 'Password Reset' ? 'Password Reset!' : 'Enterprise Onboarded!'}
                                </h3>
                                <p className="text-xs text-green-600/80">Login credentials ready</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 space-y-2 border border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        {createdCredentials.type === 'Password Reset' ? 'User' : 'Business'}
                                    </span>
                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${createdCredentials.role === 'garage' ? 'bg-blue-100 text-blue-600' :
                                            createdCredentials.role === 'vendor' ? 'bg-purple-100 text-purple-600' :
                                                createdCredentials.role === 'admin' ? 'bg-red-100 text-red-600' :
                                                    'bg-orange-100 text-orange-600'
                                        }`}>{createdCredentials.role}</span>
                                </div>
                                <p className="font-bold text-lg">{createdCredentials.businessName}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Login Email</label>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg text-sm font-mono">{createdCredentials.email}</code>
                                    <button onClick={() => copyToClipboard(createdCredentials.email)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Copy">
                                        <span className="material-symbols-outlined text-sm">content_copy</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Login Password</label>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg text-sm font-mono text-red-600">{createdCredentials.password}</code>
                                    <button onClick={() => copyToClipboard(createdCredentials.password)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Copy">
                                        <span className="material-symbols-outlined text-sm">content_copy</span>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 flex items-start gap-2">
                                <span className="material-symbols-outlined text-amber-500 text-sm mt-0.5">warning</span>
                                <p className="text-xs text-amber-700 dark:text-amber-400">Please save these credentials. The password will not be shown again.</p>
                            </div>
                        </div>
                        <div className="p-6 pt-0">
                            <button onClick={() => setCreatedCredentials(null)} className="w-full py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] hover:opacity-90">
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
