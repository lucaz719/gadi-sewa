import React, { useState } from 'react';

const faqs = [
  { q: "How do I create a new job card?", a: "Go to the Job Board or click 'Create Job' in the sidebar. You can choose between Quick Entry for fast inputs or Detailed for comprehensive job cards." },
  { q: "How can I add staff members?", a: "Navigate to Staff & HR page, then click on 'Add New Employee'. You can set their roles and permissions during creation." },
  { q: "Can I customize the invoice template?", a: "Yes, go to Settings > Tax & Billing to customize your invoice header, logo, and terms." },
  { q: "How does the inventory tracking work?", a: "Inventory is automatically deducted when you add parts to a Job Card. You can also manually adjust stock in the Inventory page." },
];

const tickets = [
  { id: 'TKT-1023', subject: 'Printer configuration issue', status: 'Open', date: '25 Oct, 2024' },
  { id: 'TKT-0998', subject: 'Billing discrepancy', status: 'Resolved', date: '20 Oct, 2024' },
  { id: 'TKT-0854', subject: 'Feature request: Dark mode', status: 'Resolved', date: '15 Sep, 2024' },
];

export default function HelpSupport() {
  const [activeTab, setActiveTab] = useState('help'); // 'help' or 'tickets'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="mb-2">
          <h1 className="text-2xl font-bold">Help & Support</h1>
          <p className="text-slate-500 text-sm">Find answers or contact our support team.</p>
       </div>

       <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button 
             onClick={() => setActiveTab('help')}
             className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'help' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
             Help Center
          </button>
          <button 
             onClick={() => setActiveTab('tickets')}
             className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'tickets' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
             My Tickets
          </button>
       </div>

       {activeTab === 'help' && (
          <div className="space-y-8 animate-fade-in">
             <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input type="text" placeholder="Search for articles, guides, or troubleshooting..." className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-primary-500" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <h3 className="font-bold text-lg mb-4">Frequently Asked Questions</h3>
                   <div className="space-y-4">
                      {faqs.map((faq, i) => (
                         <div key={i} className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h4 className="font-bold text-sm mb-2 text-primary-700 dark:text-primary-400">{faq.q}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{faq.a}</p>
                         </div>
                      ))}
                   </div>
                </div>
                
                <div className="space-y-6">
                   <div className="bg-primary-600 rounded-xl p-6 text-white shadow-lg">
                      <h3 className="font-bold text-lg mb-2">Need more help?</h3>
                      <p className="text-primary-100 text-sm mb-6">Our support team is available 24/7 to assist you with any issues.</p>
                      <button 
                        onClick={() => setActiveTab('tickets')}
                        className="w-full py-2 bg-white text-primary-600 rounded-lg font-bold text-sm hover:bg-primary-50"
                      >
                        Contact Support
                      </button>
                   </div>

                   <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <h3 className="font-bold text-lg mb-4">Send Feedback</h3>
                      <textarea className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm mb-3" rows={3} placeholder="Tell us how we can improve..."></textarea>
                      <button className="w-full py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg font-medium text-sm hover:bg-slate-900">Submit Feedback</button>
                   </div>
                </div>
             </div>
          </div>
       )}

       {activeTab === 'tickets' && (
          <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Support Tickets</h3>
                <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                   <span className="material-symbols-outlined">add</span> Create New Ticket
                </button>
             </div>

             <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500">
                      <tr>
                         <th className="p-4">Ticket ID</th>
                         <th className="p-4">Subject</th>
                         <th className="p-4">Date Created</th>
                         <th className="p-4">Status</th>
                         <th className="p-4 text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {tickets.map(tkt => (
                         <tr key={tkt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="p-4 font-mono text-xs font-bold">{tkt.id}</td>
                            <td className="p-4 font-medium">{tkt.subject}</td>
                            <td className="p-4 text-slate-500">{tkt.date}</td>
                            <td className="p-4">
                               <span className={`px-2 py-1 rounded text-xs font-bold ${tkt.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                  {tkt.status}
                               </span>
                            </td>
                            <td className="p-4 text-right">
                               <button className="text-primary-600 hover:underline">View</button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
       )}
    </div>
  );
}