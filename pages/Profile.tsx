import React, { useState } from 'react';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="mb-2">
          <h1 className="text-2xl font-bold">My Profile & Account</h1>
          <p className="text-slate-500 text-sm">Manage your personal information and security settings.</p>
       </div>

       <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
             <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {['My Profile', 'Account Settings', 'Security'].map(tab => {
                   const key = tab.toLowerCase().replace(' ', '');
                   const displayKey = key === 'myprofile' ? 'profile' : key === 'accountsettings' ? 'account' : 'security';
                   return (
                      <button 
                        key={displayKey} 
                        onClick={() => setActiveTab(displayKey)}
                        className={`w-full text-left px-4 py-3 text-sm font-medium border-l-4 transition-colors ${activeTab === displayKey ? 'border-primary-500 bg-slate-50 dark:bg-slate-800 text-primary-700 dark:text-primary-400' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                      >
                        {tab}
                      </button>
                   );
                })}
             </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
             {activeTab === 'profile' && (
                <div className="space-y-6 animate-fade-in">
                   <h2 className="text-xl font-bold border-b border-slate-200 dark:border-slate-700 pb-4">Personal Information</h2>
                   
                   <div className="flex items-center gap-6">
                      <img src="https://i.pravatar.cc/150?u=1" className="w-20 h-20 rounded-full border-4 border-slate-100 dark:border-slate-700" alt="Profile" />
                      <div>
                         <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Change Photo</button>
                         <p className="text-xs text-slate-500 mt-2">JPG, GIF or PNG. Max size 800K</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-medium mb-1.5">First Name</label>
                         <input type="text" defaultValue="John" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium mb-1.5">Last Name</label>
                         <input type="text" defaultValue="Doe" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium mb-1.5">Email Address</label>
                         <input type="email" defaultValue="admin@garage.com" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                         <input type="tel" defaultValue="+91 98765 43210" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500" />
                      </div>
                   </div>

                   <div className="pt-4">
                      <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md">Save Changes</button>
                   </div>
                </div>
             )}

             {activeTab === 'account' && (
                <div className="space-y-6 animate-fade-in">
                   <h2 className="text-xl font-bold border-b border-slate-200 dark:border-slate-700 pb-4">Account Settings</h2>
                   
                   <div className="space-y-4">
                      <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                         <h3 className="font-bold text-sm mb-2">Connected Devices</h3>
                         <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                               <div className="flex items-center gap-3">
                                  <span className="material-symbols-outlined text-slate-400">desktop_windows</span>
                                  <div>
                                     <p className="font-medium">Windows PC - Chrome</p>
                                     <p className="text-xs text-slate-500">Mumbai, India • Active now</p>
                                  </div>
                               </div>
                               <span className="text-green-500 text-xs font-bold">Current</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                               <div className="flex items-center gap-3">
                                  <span className="material-symbols-outlined text-slate-400">smartphone</span>
                                  <div>
                                     <p className="font-medium">iPhone 13 - Safari</p>
                                     <p className="text-xs text-slate-500">Mumbai, India • 2 hours ago</p>
                                  </div>
                               </div>
                               <button className="text-red-500 hover:underline text-xs">Log out</button>
                            </div>
                         </div>
                      </div>

                      <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                         <h3 className="font-bold text-sm mb-2">Danger Zone</h3>
                         <p className="text-sm text-slate-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                         <button className="px-4 py-2 border border-red-200 text-red-600 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-sm font-bold">Delete Account</button>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'security' && (
                <div className="space-y-6 animate-fade-in">
                   <h2 className="text-xl font-bold border-b border-slate-200 dark:border-slate-700 pb-4">Security</h2>
                   
                   <div className="space-y-4">
                      <div>
                         <label className="block text-sm font-medium mb-1.5">Current Password</label>
                         <input type="password" placeholder="••••••••" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium mb-1.5">New Password</label>
                            <input type="password" placeholder="New password" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500" />
                         </div>
                         <div>
                            <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
                            <input type="password" placeholder="Confirm new password" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500" />
                         </div>
                      </div>
                      <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md mt-2">Update Password</button>
                   </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}