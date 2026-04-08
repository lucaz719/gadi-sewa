
import React, { useState } from 'react';

export default function VendorSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [qrPreviews, setQrPreviews] = useState<{ esewa: string | null, khalti: string | null }>({
      esewa: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=eSewa_GS_Vendor_01',
      khalti: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Khalti_GS_Vendor_01'
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
       <div className="mb-6">
          <h1 className="text-2xl font-bold">Vendor Settings</h1>
          <p className="text-slate-500 text-sm">Configure your wholesale business profile, shipping, and digital integrations.</p>
       </div>

       <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
             <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-6">
                {[
                   { id: 'profile', label: 'Business Profile', icon: 'business' },
                   { id: 'general', label: 'Regional Config', icon: 'language' },
                   { id: 'shipping', label: 'Shipping Config', icon: 'local_shipping' },
                   { id: 'tax', label: 'Tax & Compliance', icon: 'balance' },
                   { id: 'notifications', label: 'Notifications', icon: 'notifications' },
                   { id: 'integrations', label: 'Integrations', icon: 'hub' },
                   { id: 'security', label: 'Security', icon: 'security' },
                ].map(tab => (
                      <button 
                        key={tab.id} 
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-4 py-3 text-sm font-medium border-l-4 transition-colors flex items-center gap-3 ${activeTab === tab.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300 font-bold' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                      >
                        <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                        {tab.label}
                      </button>
                ))}
             </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
             
             {/* PROFILE TAB */}
             {activeTab === 'profile' && (
                <div className="space-y-6 animate-fade-in">
                   <h2 className="text-xl font-bold border-b border-slate-200 dark:border-slate-700 pb-4">Business Identity</h2>
                   
                   <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400">
                         <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                      </div>
                      <div>
                         <h3 className="font-bold">Company Logo</h3>
                         <p className="text-sm text-slate-500 mb-3">Logo used for wholesale invoices and platform listing.</p>
                         <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-200">Upload New</button>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                         <label className="block text-sm font-bold text-slate-500 uppercase mb-1.5">Company Name</label>
                         <input type="text" defaultValue="AutoParts Distributor Ltd. Nepal" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-purple-500" />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-500 uppercase mb-1.5">Support Email</label>
                         <input type="email" defaultValue="wholesale@autoparts.com.np" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none" />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-500 uppercase mb-1.5">Support Phone</label>
                         <input type="text" defaultValue="+977 9812345678" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none" />
                      </div>
                      <div className="md:col-span-2">
                         <label className="block text-sm font-bold text-slate-500 uppercase mb-1.5">Main Warehouse Address</label>
                         <textarea rows={3} defaultValue="Teku Industrial Area, Kathmandu, Nepal" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none"></textarea>
                      </div>
                   </div>
                </div>
             )}

             {/* REGIONAL CONFIG TAB */}
             {activeTab === 'general' && (
                <div className="space-y-6 animate-fade-in">
                   <h2 className="text-xl font-bold border-b border-slate-200 dark:border-slate-700 pb-2">Regional Configuration</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-bold text-slate-500 uppercase mb-1.5">Currency</label>
                         <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none">
                            <option value="NPR">Nepali Rupee (रु / NPR)</option>
                            <option value="NPR">Nepalese Rupee (NPR / रु)</option>
                            <option value="USD">US Dollar ($ / USD)</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-500 uppercase mb-1.5">Time Zone</label>
                         <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none">
                            <option value="KTM">(GMT+05:45) Kathmandu, Nepal</option>
                         </select>
                      </div>
                   </div>
                </div>
             )}

             {/* SHIPPING TAB */}
             {activeTab === 'shipping' && (
                <div className="space-y-6 animate-fade-in">
                   <h2 className="text-xl font-bold border-b border-slate-200 dark:border-slate-700 pb-4">Shipping & Logistics</h2>
                   
                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                         <div>
                            <h4 className="font-bold">Surface Transport</h4>
                            <p className="text-xs text-slate-500">2-4 Days across major cities</p>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className="font-bold">रु 500</span>
                            <input type="checkbox" className="w-5 h-5 rounded text-purple-600" defaultChecked />
                         </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                         <div>
                            <h4 className="font-bold">Same Day Warehouse Pickup</h4>
                            <p className="text-xs text-slate-500">Self-pickup from Teku warehouse</p>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className="font-bold">Free</span>
                            <input type="checkbox" className="w-5 h-5 rounded text-purple-600" defaultChecked />
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {/* NOTIFICATIONS TAB */}
             {activeTab === 'notifications' && (
                 <div className="space-y-6 animate-fade-in">
                    <h2 className="text-xl font-bold border-b border-slate-200 dark:border-slate-700 pb-2">Wholesale Alerts</h2>
                    <div className="space-y-4">
                       {[
                         { id: 'v_order', label: 'New Order Alerts', desc: 'Notify via email and app when a garage places a new order.' },
                         { id: 'v_payout', label: 'Payout Confirmations', desc: 'Alert when a settlement is processed to your bank.' },
                         { id: 'v_lowstock', label: 'Bulk Low Stock Alerts', desc: 'Get alerts when bulk SKU counts fall below threshold.' },
                       ].map(notif => (
                        <div key={notif.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                           <div className="flex-1">
                              <p className="font-bold text-slate-900 dark:text-white text-sm">{notif.label}</p>
                              <p className="text-[11px] text-slate-500">{notif.desc}</p>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 transition-colors"></div>
                           </label>
                        </div>
                       ))}
                    </div>
                 </div>
             )}

             {/* INTEGRATIONS TAB */}
             {activeTab === 'integrations' && (
                <div className="space-y-6 animate-fade-in">
                   <h2 className="text-xl font-bold border-b border-slate-200 dark:border-slate-700 pb-2">Digital Payment Setup</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                         <p className="font-bold text-sm mb-4">eSewa Wallet (Merchant)</p>
                         <input type="text" placeholder="eSewa ID" className="w-full p-2 mb-4 rounded border dark:border-slate-600 bg-white dark:bg-slate-900 text-sm" />
                         <div className="flex flex-col items-center gap-2">
                             <div className="w-24 h-24 bg-white p-1 rounded border"><img src={qrPreviews.esewa || ''} className="w-full h-full" alt="eSewa QR" /></div>
                             <button className="text-[10px] font-bold text-purple-600">Change QR</button>
                         </div>
                      </div>
                      <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                         <p className="font-bold text-sm mb-4">Khalti Wallet (Merchant)</p>
                         <input type="text" placeholder="Khalti ID" className="w-full p-2 mb-4 rounded border dark:border-slate-600 bg-white dark:bg-slate-900 text-sm" />
                         <div className="flex flex-col items-center gap-2">
                             <div className="w-24 h-24 bg-white p-1 rounded border"><img src={qrPreviews.khalti || ''} className="w-full h-full" alt="Khalti QR" /></div>
                             <button className="text-[10px] font-bold text-purple-600">Change QR</button>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {/* SECURITY TAB */}
             {activeTab === 'security' && (
                <div className="space-y-6 animate-fade-in">
                   <h2 className="text-xl font-bold border-b border-slate-200 dark:border-slate-700 pb-2">Vendor Security</h2>
                   <div className="space-y-4">
                      <div>
                         <label className="block text-sm font-bold text-slate-500 uppercase mb-1.5">Admin Password</label>
                         <input type="password" placeholder="••••••••" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent" />
                      </div>
                      <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm">Update Password</button>
                   </div>
                </div>
             )}

             <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95">Save Changes</button>
             </div>
          </div>
       </div>
    </div>
  );
}
