
import React, { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [qrPreviews, setQrPreviews] = useState<{ esewa: string | null, khalti: string | null }>({
      esewa: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=eSewa_GS_99',
      khalti: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Khalti_GS_99'
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
       <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-slate-500 text-sm">Manage preferences, security, and digital payment integrations.</p>
       </div>

       <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
             <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-6">
                {[
                  { id: 'general', label: 'General', icon: 'settings' },
                  { id: 'business', label: 'Profile', icon: 'business' },
                  { id: 'tax', label: 'Tax & Billing', icon: 'receipt_long' },
                  { id: 'notifications', label: 'Notifications', icon: 'notifications' },
                  { id: 'security', label: 'Security', icon: 'security' },
                  { id: 'integrations', label: 'Integrations', icon: 'hub' },
                ].map(tab => (
                   <button 
                     key={tab.id} 
                     onClick={() => setActiveTab(tab.id)}
                     className={`w-full text-left px-4 py-3 text-sm font-medium border-l-4 transition-colors flex items-center gap-3 ${activeTab === tab.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400 font-bold' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                   >
                     <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                     {tab.label}
                   </button>
                ))}
             </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm transition-all">
             
             {/* GENERAL SETTINGS */}
             {activeTab === 'general' && (
                <div className="space-y-6 animate-fade-in">
                   <h2 className="text-xl font-bold border-b border-slate-200 dark:border-slate-700 pb-2">General Configuration</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-bold text-slate-500 uppercase mb-1.5">Default Currency</label>
                         <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="NPR">Nepali Rupee (रु / NPR)</option>
                            <option value="INR">Indian Rupee (₹ / INR)</option>
                            <option value="USD">US Dollar ($ / USD)</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-500 uppercase mb-1.5">Time Zone</label>
                         <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="KTM">(GMT+05:45) Kathmandu, Nepal</option>
                            <option value="IST">(GMT+05:30) Mumbai, New Delhi, India</option>
                            <option value="UTC">(GMT+00:00) UTC / Greenwich</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-500 uppercase mb-1.5">System Language</label>
                         <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500">
                            <option>English</option>
                            <option>Nepali (Coming Soon)</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-500 uppercase mb-1.5">Date Format</label>
                         <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none">
                            <option>DD/MM/YYYY</option>
                            <option>MM/DD/YYYY</option>
                            <option>YYYY-MM-DD</option>
                         </select>
                      </div>
                   </div>
                </div>
             )}

             {/* NOTIFICATIONS */}
             {activeTab === 'notifications' && (
                 <div className="space-y-6 animate-fade-in">
                    <h2 className="text-xl font-bold border-b border-slate-200 dark:border-slate-700 pb-2">Communication & Alerts</h2>
                    <div className="space-y-4">
                       {[
                         { id: 'sms', label: 'SMS Notifications', desc: 'Send status updates to customers via SMS.' },
                         { id: 'whatsapp', label: 'WhatsApp Alerts', desc: 'Automated job card and invoice sharing on WhatsApp.' },
                         { id: 'email', label: 'Email Reports', desc: 'Receive daily financial and operational summaries.' },
                         { id: 'push', label: 'App Push Notifications', desc: 'Alerts for new appointments and low stock.' },
                       ].map(notif => (
                        <div key={notif.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                           <div className="flex-1">
                              <p className="font-bold text-slate-900 dark:text-white">{notif.label}</p>
                              <p className="text-xs text-slate-500">{notif.desc}</p>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                           </label>
                        </div>
                       ))}
                    </div>
                 </div>
             )}

             {/* SECURITY */}
             {activeTab === 'security' && (
                <div className="space-y-6 animate-fade-in">
                   <h2 className="text-xl font-bold border-b border-slate-200 dark:border-slate-700 pb-2">Account Security</h2>
                   <div className="space-y-6">
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 rounded-xl flex items-center gap-4">
                         <span className="material-symbols-outlined text-orange-500 text-3xl">verified_user</span>
                         <div>
                            <p className="font-bold text-orange-800 dark:text-orange-300 text-sm">Two-Factor Authentication (2FA)</p>
                            <p className="text-xs text-orange-700 dark:text-orange-400">Add an extra layer of security to your account.</p>
                         </div>
                         <button className="ml-auto px-4 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg">Enable</button>
                      </div>

                      <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium mb-1.5">Change Password</label>
                            <input type="password" placeholder="Current Password" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent mb-3" />
                            <div className="grid grid-cols-2 gap-3">
                               <input type="password" placeholder="New Password" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent" />
                               <input type="password" placeholder="Confirm Password" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent" />
                            </div>
                            <button className="mt-3 text-sm text-primary-600 font-bold hover:underline">Update Password</button>
                         </div>
                      </div>

                      <div className="border-t dark:border-slate-700 pt-4">
                         <h3 className="font-bold text-sm mb-3">Login Sessions</h3>
                         <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                               <div className="flex gap-3">
                                  <span className="material-symbols-outlined text-slate-400">smartphone</span>
                                  <div>
                                     <p className="font-bold">iPhone 15 • Kathmandu, NP</p>
                                     <p className="text-slate-400">Active Now</p>
                                  </div>
                               </div>
                               <button className="text-red-500 font-bold">Logout</button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {/* INTEGRATIONS */}
             {activeTab === 'integrations' && (
                <div className="space-y-6 animate-fade-in">
                   <h2 className="text-xl font-bold border-b border-slate-200 dark:border-slate-700 pb-2">Digital Payment Integrations</h2>
                   <p className="text-sm text-slate-500">Configure your eSewa and Khalti details to show QR codes in POS.</p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* eSewa Setup */}
                      <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center">
                         <img src="https://blog.esewa.com.np/wp-content/uploads/2021/04/esewa-logo.png" className="h-10 object-contain mb-6 grayscale hover:grayscale-0 transition-all" alt="eSewa" />
                         <div className="w-full space-y-4">
                            <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">eSewa Merchant ID</label>
                               <input type="text" placeholder="e.g. GS-ESEWA-001" className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none text-sm font-mono" />
                            </div>
                            <div className="flex flex-col items-center gap-3">
                               <p className="text-[10px] font-bold text-slate-400 uppercase">Payment QR Preview</p>
                               <div className="w-32 h-32 bg-white p-2 rounded border border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                                  {qrPreviews.esewa ? <img src={qrPreviews.esewa} alt="QR" className="w-full h-full" /> : <span className="material-symbols-outlined text-slate-300">add_photo_alternate</span>}
                               </div>
                               <button className="text-xs font-bold text-primary-600 border border-primary-600 px-3 py-1 rounded-full hover:bg-primary-50 transition-colors">Upload Custom QR</button>
                            </div>
                         </div>
                      </div>

                      {/* Khalti Setup */}
                      <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center">
                         <img src="https://khalti.com/static/khalti-logo.png" className="h-8 object-contain mb-8 grayscale hover:grayscale-0 transition-all" alt="Khalti" />
                         <div className="w-full space-y-4">
                            <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Khalti Merchant ID</label>
                               <input type="text" placeholder="e.g. GS-KHALTI-001" className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none text-sm font-mono" />
                            </div>
                            <div className="flex flex-col items-center gap-3">
                               <p className="text-[10px] font-bold text-slate-400 uppercase">Payment QR Preview</p>
                               <div className="w-32 h-32 bg-white p-2 rounded border border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                                  {qrPreviews.khalti ? <img src={qrPreviews.khalti} alt="QR" className="w-full h-full" /> : <span className="material-symbols-outlined text-slate-300">add_photo_alternate</span>}
                               </div>
                               <button className="text-xs font-bold text-primary-600 border border-primary-600 px-3 py-1 rounded-full hover:bg-primary-50 transition-colors">Upload Custom QR</button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {/* Fallback tabs (matching existing logic) */}
             {activeTab === 'business' && (
                <div className="space-y-6">
                   <h2 className="text-xl font-bold border-b border-slate-200 dark:border-slate-700 pb-2">Business Profile</h2>
                   <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">Logo</div>
                      <button className="text-sm text-primary-600 font-medium hover:underline">Change Logo</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                         <label className="block text-sm font-medium mb-1">Garage Name</label>
                         <input type="text" defaultValue="GadiSewa Main Garage" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium mb-1">Contact Phone</label>
                         <input type="text" defaultValue="+977 9800000000" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium mb-1">Email</label>
                         <input type="email" defaultValue="admin@gadisewa.com.np" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none" />
                      </div>
                      <div className="md:col-span-2">
                         <label className="block text-sm font-medium mb-1">Address</label>
                         <textarea rows={3} defaultValue="Main Road, New Baneshwor, Kathmandu, Nepal" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none"></textarea>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'tax' && (
                 <div className="space-y-6">
                    <h2 className="text-xl font-bold border-b border-slate-200 dark:border-slate-700 pb-2">Tax & Billing</h2>
                    <div className="space-y-4">
                       <div>
                          <label className="block text-sm font-medium mb-1">VAT/PAN Number</label>
                          <input type="text" defaultValue="601234567" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none" />
                       </div>
                       <div className="flex items-center justify-between py-2">
                          <span className="font-medium text-sm">Default Tax Rate (VAT)</span>
                          <input type="text" defaultValue="13%" className="w-20 p-1.5 text-right rounded border border-slate-300 dark:border-slate-600 bg-transparent" />
                       </div>
                       <div className="flex items-center gap-2">
                          <input type="checkbox" className="w-4 h-4 rounded text-primary-600" defaultChecked />
                          <span className="text-sm">Prices are tax inclusive by default</span>
                       </div>
                    </div>
                 </div>
             )}

             <div className="mt-12 flex justify-end gap-3 pt-6 border-t dark:border-slate-700">
                <button className="px-6 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Discard</button>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-2 rounded-xl font-bold text-sm shadow-xl shadow-primary-500/20 transition-all active:scale-95">Save Changes</button>
             </div>
          </div>
       </div>
    </div>
  );
}
