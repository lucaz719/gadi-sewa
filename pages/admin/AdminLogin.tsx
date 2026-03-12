
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/db';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '', accessCode: '' });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await db.login({
        email: credentials.username,
        password: credentials.password,
        access_token: credentials.accessCode
      });
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Access Denied. Check credentials and token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-mono">
      <div className="w-full max-w-md bg-slate-900 border border-red-500/20 rounded-2xl p-8 shadow-[0_0_50px_-12px_rgba(239,68,68,0.3)]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            <span className="material-symbols-outlined text-3xl">security</span>
          </div>
          <h1 className="text-white text-2xl font-black uppercase tracking-tighter">Admin Portal</h1>
          <p className="text-red-500 text-xs font-bold mt-1 uppercase tracking-widest opacity-70">GadiSewa Internal Systems</p>

          {error && (
            <div className="mt-4 p-3 rounded bg-red-950/30 border border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
              ⚠️ ERROR: {error}
            </div>
          )}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Admin ID</label>
            <input
              type="text"
              required
              value={credentials.username}
              onChange={e => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-all placeholder:text-slate-700"
              placeholder="ADM-000-X"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Secure Key</label>
            <input
              type="password"
              required
              value={credentials.password}
              onChange={e => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-all placeholder:text-slate-700"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Access Token</label>
            <input
              type="text"
              required
              value={credentials.accessCode}
              onChange={e => setCredentials({ ...credentials, accessCode: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-all placeholder:text-slate-700"
              placeholder="OTP / HW Token"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] mt-4 uppercase text-sm tracking-widest flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Verifying...
              </>
            ) : 'Authorize Entry'}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600 text-[10px] uppercase font-bold tracking-widest leading-relaxed">
          Authorized personnel only.<br />all access is logged and monitored.
        </p>
      </div>
      <button onClick={() => navigate('/login')} className="mt-8 text-slate-500 text-xs font-bold hover:text-white transition-colors">Return to Public Login</button>
    </div>
  );
}
