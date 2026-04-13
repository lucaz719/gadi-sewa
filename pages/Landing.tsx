
import React from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/db';

export default function Landing() {
  const user = db.getAuthUser();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#101a22] text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* Navigation */}
      <nav className="h-20 flex items-center justify-between px-6 lg:px-12 bg-white/80 dark:bg-[#16222d]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-500/20">G</div>
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">GadiSewa</span>
        </div>
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600 dark:text-slate-400">
             <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
             <a href="#solutions" className="hover:text-primary-600 transition-colors">Solutions</a>
             <a href="#pricing" className="hover:text-primary-600 transition-colors">Pricing</a>
          </div>
          {user ? (
            <Link to={user.role === 'vendor' ? '/vendor' : user.role === 'customer' ? '/portal' : user.role === 'admin' ? '/admin' : '/'} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold text-sm shadow-xl shadow-primary-500/20 transition-all active:scale-95">
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary-600 transition-colors">Login</Link>
              <Link to="/register" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold text-sm shadow-xl shadow-primary-500/20 transition-all active:scale-95">Get Started</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100/50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-black uppercase tracking-widest mb-8 animate-fade-in">
             <span className="material-symbols-outlined text-sm">rocket_launch</span>
             Next-Gen Automotive Ecosystem
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight animate-slide-up">
            Power Your Garage with <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">Smart Technology.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium animate-slide-up animation-delay-200">
            From digital job cards and POS to AI diagnostics and a parts marketplace. GadiSewa is the unified platform for garages, vendors, and vehicle owners.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-400">
            <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary-500/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
              Start Free Trial <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3">
              View Demo
            </Link>
          </div>
          
          {/* Dashboard Preview */}
          <div className="mt-20 relative animate-in zoom-in duration-700">
             <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#101a22] to-transparent z-10 h-1/4 bottom-0 top-auto"></div>
             <div className="max-w-5xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-400/20 dark:shadow-black/40 overflow-hidden bg-white dark:bg-[#16222d]">
                <img 
                  src="https://images.unsplash.com/photo-1530046339160-ce3e5b0c7a2f?auto=format&fit=crop&q=80&w=2070" 
                  alt="Dashboard Preview" 
                  className="w-full h-auto opacity-90"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
             </div>
          </div>
        </div>
      </header>

      {/* Solutions Section */}
      <section id="solutions" className="py-24 bg-white dark:bg-[#16222d] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-[0.3em] mb-4">Unified Solutions</h2>
            <p className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">One platform, three specialized portals.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Garage Portal */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#1e293b] border border-slate-100 dark:border-slate-800 transition-all hover:border-primary-500/30 group">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-500/10">
                <span className="material-symbols-outlined text-3xl">home_repair_service</span>
              </div>
              <h3 className="text-xl font-black mb-3">Garage Management</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                Streamline operations with digital job cards, inventory tracking, POS billing, and AI-powered diagnostics.
              </p>
              <ul className="space-y-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                 <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500 text-sm">check_circle</span> Automated Job Cards</li>
                 <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500 text-sm">check_circle</span> Intelligent POS System</li>
                 <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500 text-sm">check_circle</span> GadiAI Diagnostics</li>
              </ul>
            </div>

            {/* Vendor Portal */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#1e293b] border border-slate-100 dark:border-slate-800 transition-all hover:border-purple-500/30 group">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/10">
                <span className="material-symbols-outlined text-3xl">local_shipping</span>
              </div>
              <h3 className="text-xl font-black mb-3">Vendor Marketplace</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                Reach thousands of garages, manage bulk orders, and streamline parts distribution with real-time analytics.
              </p>
              <ul className="space-y-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                 <li className="flex items-center gap-2"><span className="material-symbols-outlined text-purple-500 text-sm">check_circle</span> Reach Local Garages</li>
                 <li className="flex items-center gap-2"><span className="material-symbols-outlined text-purple-500 text-sm">check_circle</span> Bulk Order Processing</li>
                 <li className="flex items-center gap-2"><span className="material-symbols-outlined text-purple-500 text-sm">check_circle</span> Sales Insights</li>
              </ul>
            </div>

            {/* Customer Portal */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#1e293b] border border-slate-100 dark:border-slate-800 transition-all hover:border-orange-500/30 group">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/10">
                <span className="material-symbols-outlined text-3xl">person</span>
              </div>
              <h3 className="text-xl font-black mb-3">Vehicle Owner Portal</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                Book services, track vehicle health, manage records, and access 24/7 emergency SOS assistance.
              </p>
              <ul className="space-y-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                 <li className="flex items-center gap-2"><span className="material-symbols-outlined text-orange-500 text-sm">check_circle</span> Online Appointments</li>
                 <li className="flex items-center gap-2"><span className="material-symbols-outlined text-orange-500 text-sm">check_circle</span> Service History</li>
                 <li className="flex items-center gap-2"><span className="material-symbols-outlined text-orange-500 text-sm">check_circle</span> Emergency SOS</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="py-24 px-6">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
               <h2 className="text-4xl lg:text-5xl font-black mb-8 leading-tight">Advanced tools for the modern auto business.</h2>
               <div className="space-y-6">
                  <div className="flex gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-[#16222d] transition-all cursor-default">
                     <span className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">auto_awesome</span>
                     </span>
                     <div>
                        <h4 className="font-bold text-lg">AI Diagnostics</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Instantly analyze engine issues and suggest repairs with GadiAI integration.</p>
                     </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-[#16222d] transition-all cursor-default">
                     <span className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">account_balance_wallet</span>
                     </span>
                     <div>
                        <h4 className="font-bold text-lg">Financial Hub</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Track MRR, expenses, and invoices. Integrated with your physical garage counter.</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="w-full lg:w-1/2 relative">
               <div className="aspect-[4/3] rounded-3xl bg-slate-200 dark:bg-slate-800 overflow-hidden shadow-2xl relative">
                  <img src="https://images.unsplash.com/photo-1486006396193-47103bad89a7?auto=format&fit=crop&q=80&w=2000" alt="Features" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white">
                     <p className="text-lg font-bold mb-1 italic">"GadiSewa transformed our workflow. We reduced paper usage by 90% and increased efficiency by 40%."</p>
                     <p className="text-xs font-black uppercase tracking-widest opacity-80">- AutoMatrix Solutions</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-primary-600">
         <div className="max-w-5xl mx-auto text-center text-white">
            <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight animate-fade-in">Ready to modernize <br/> your garage?</h2>
            <p className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto font-medium">Join over 1,500+ professionals already scaling their businesses with GadiSewa. No hidden fees, instant setup.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link to="/register" className="px-12 py-5 bg-white text-primary-600 hover:bg-slate-50 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-black/20 hover:-translate-y-2 active:scale-95">Get Started Free</Link>
               <Link to="/help" className="px-12 py-5 bg-primary-700 text-white hover:bg-primary-800 rounded-2xl font-black text-xl transition-all border border-primary-500">Contact Sales</Link>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white dark:bg-[#0a0f14] border-t border-slate-100 dark:border-slate-800 px-6">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-black text-lg">G</div>
                  <span className="text-xl font-black tracking-tight dark:text-white">GadiSewa</span>
               </div>
               <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Empowering the automotive industry with data-driven management tools and connected ecosystems.</p>
            </div>
            <div>
               <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-400">Product</h5>
               <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                  <li><Link to="/register" className="hover:text-primary-600">Features</Link></li>
                  <li><Link to="/marketplace" className="hover:text-primary-600">Marketplace</Link></li>
                  <li><Link to="/reports" className="hover:text-primary-600">Analytics</Link></li>
               </ul>
            </div>
            <div>
               <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-400">Support</h5>
               <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                  <li><Link to="/help" className="hover:text-primary-600">Help Center</Link></li>
                  <li><Link to="/help" className="hover:text-primary-600">Contact Us</Link></li>
                  <li><Link to="/help" className="hover:text-primary-600">API Docs</Link></li>
               </ul>
            </div>
            <div>
               <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-400">Legal</h5>
               <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                  <li><Link to="#" className="hover:text-primary-600">Privacy Policy</Link></li>
                  <li><Link to="#" className="hover:text-primary-600">Terms of Service</Link></li>
               </ul>
            </div>
         </div>
      </footer>
    </div>
  );
}
