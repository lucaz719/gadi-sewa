import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { useToast } from '../App';

export default function RewardsHub() {
    const [data, setData] = useState<any>(null);
    const [referralCode, setReferralCode] = useState('');
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const user = db.getAuthUser();

    const loadData = async () => {
        setLoading(true);
        try {
            const summary = await db.getRewardsSummary(user.id);
            setData(summary);
        } catch (err) {
            showToast('error', 'Failed to synchronize rewards engine.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleGenerateReferral = async () => {
        try {
            const res = await db.generateReferral(user.id);
            setReferralCode(res.referral_code);
            showToast('success', 'Your unique referral code is ready!');
        } catch (err) {
            showToast('error', 'Generation failed.');
        }
    };

    if (!data && loading) return <p className="text-center py-20 text-slate-400 italic">Calculating your GadiPoints...</p>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Hero Section */}
            <div className="relative h-64 rounded-[2rem] overflow-hidden bg-slate-900 flex items-center px-12 text-white">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/20 translate-x-1/4 skew-x-[-20deg]"></div>
                <div className="relative z-10 flex-1">
                    <h1 className="text-4xl font-black mb-2 italic tracking-tighter uppercase">Rewards Hub</h1>
                    <p className="text-lg opacity-80 font-medium">Earn points, unlock badges, and rule the road.</p>
                    <div className="mt-8 flex gap-6">
                        <div>
                            <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-1">Current Balance</p>
                            <p className="text-3xl font-black">{data?.total_points} Pts</p>
                        </div>
                        <div className="w-px h-12 bg-white/20"></div>
                        <div>
                            <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-1">Tier Status</p>
                            <p className="text-3xl font-black italic">{data?.level}</p>
                        </div>
                    </div>
                </div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full border-4 border-red-600 flex items-center justify-center bg-white/5 backdrop-blur-md shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                        <span className="material-symbols-outlined text-6xl text-red-500">military_tech</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Achievements */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-600">stars</span>
                        Unlocked Achievements
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data?.achievements.map((a: any) => (
                            <div key={a.id} className="p-4 bg-white dark:bg-[#1e293b] rounded-2xl border dark:border-slate-800 flex gap-4 transition-all hover:border-red-500/30 group">
                                <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">{a.icon}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{a.name}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{a.description}</p>
                                </div>
                            </div>
                        ))}
                        {data?.achievements.length === 0 && (
                            <div className="col-span-full py-8 text-center text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed dark:border-slate-800">
                                Earn your first point to unlock starting badges!
                            </div>
                        )}
                    </div>
                </div>

                {/* Referral Card */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-600">group_add</span>
                        Power Up: Referral
                    </h2>
                    <div className="p-6 bg-red-600 text-white rounded-3xl shadow-xl space-y-4">
                        <p className="text-sm font-medium leading-relaxed italic">Invite your fellow riders and garage owners. Get <span className="font-black underline">500 Points</span> for every referral!</p>
                        {referralCode ? (
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/20 flex items-center justify-between">
                                <span className="text-2xl font-black font-mono tracking-widest">{referralCode}</span>
                                <button onClick={() => { navigator.clipboard.writeText(referralCode); showToast('info', 'Code copied!'); }} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined">content_copy</span>
                                </button>
                            </div>
                        ) : (
                            <button onClick={handleGenerateReferral} className="w-full py-3 bg-white text-red-600 font-bold rounded-2xl shadow-lg hover:bg-slate-50 transition-all active:scale-95">
                                Generate My Code
                            </button>
                        )}
                        <p className="text-[10px] text-center opacity-70">Referred users also get 100 GadiPoints on signup.</p>
                    </div>

                    <div className="p-6 bg-white dark:bg-[#1e293b] rounded-3xl border dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold text-sm mb-4">How to earn points?</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                                <span className="w-6 h-6 rounded bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center text-[10px] font-black italic">100</span>
                                Per service completed
                            </li>
                            <li className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                                <span className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-[10px] font-black italic">50</span>
                                Per marketplace order
                            </li>
                            <li className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                                <span className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center text-[10px] font-black italic">20</span>
                                Daily login streak (Coming Soon)
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
