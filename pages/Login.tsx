
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../services/db';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'garage' | 'vendor' | 'customer'>('garage');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await db.login({ email, password });

      if (response.user.role === 'garage') navigate('/');
      else if (response.user.role === 'vendor') navigate('/vendor');
      else if (response.user.role === 'customer') navigate('/portal');
      else if (response.user.role === 'admin') navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50 dark:bg-[#101a22]">
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div className={`absolute inset-0 bg-cover bg-center opacity-40 transition-all duration-700 ${role === 'garage' ? "bg-[url('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1974')]" :
            role === 'vendor' ? "bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2070')]" :
              "bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000')]"
          }`}></div>
        <div className="relative z-10 p-12 text-white text-center">
          <div className={`w-20 h-20 rounded-xl mx-auto mb-6 flex items-center justify-center text-4xl font-bold shadow-lg transition-colors duration-300 ${role === 'garage' ? 'bg-primary-600' : role === 'vendor' ? 'bg-purple-600' : 'bg-orange-500'
            }`}>G</div>
          <h1 className="text-5xl font-bold mb-4">GadiSewa</h1>
          <p className="text-xl text-slate-300 max-w-md mx-auto">
            {role === 'garage' ? 'Complete Garage Management System.' :
              role === 'vendor' ? 'Vendor Portal for Automotive Parts.' :
                'Manage your vehicles, bookings, and records.'}
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Please select your role and enter your details.</p>
          </div>

          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto scrollbar-hide">
            <button onClick={() => setRole('garage')} className={`flex-1 py-2 px-3 text-xs font-bold rounded-md transition-all whitespace-nowrap ${role === 'garage' ? 'bg-white dark:bg-slate-700 shadow text-primary-600' : 'text-slate-500'}`}>Garage</button>
            <button onClick={() => setRole('vendor')} className={`flex-1 py-2 px-3 text-xs font-bold rounded-md transition-all whitespace-nowrap ${role === 'vendor' ? 'bg-white dark:bg-slate-700 shadow text-purple-600' : 'text-slate-500'}`}>Vendor</button>
            <button onClick={() => setRole('customer')} className={`flex-1 py-2 px-3 text-xs font-bold rounded-md transition-all whitespace-nowrap ${role === 'customer' ? 'bg-white dark:bg-slate-700 shadow text-orange-600' : 'text-slate-500'}`}>Car Owner</button>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium animate-shake">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email or Phone</label>
              <input
                type="text"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' :
                  role === 'garage' ? 'bg-primary-600 hover:bg-primary-700' :
                    role === 'vendor' ? 'bg-purple-600 hover:bg-purple-700' :
                      'bg-orange-500 hover:bg-orange-600'
                }`}>
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Authenticating...
                </>
              ) : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </button>
          </form>

          <div className="space-y-4">
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Don't have an account? <Link to="/register" className="font-bold text-primary-600 hover:underline">Sign Up</Link>
            </p>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
              <Link to="/admin-portal" className="text-xs text-slate-400 hover:text-red-500 font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-sm">security</span>
                Internal Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
