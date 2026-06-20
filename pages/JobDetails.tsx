
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FALLBACK_AVATAR_IMAGE, FALLBACK_VEHICLE_IMAGE } from '../utils/imageFallbacks';

export default function JobDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('service');

  const jobData = {
    id: id,
    status: 'In Progress',
    complaint: 'Vibration in steering wheel at speeds above 80km/h and faint clicking sound during hard turns.',
    customer: {
        name: 'John Doe',
        phone: '+1 (555) 123-4567',
        avatar: 'https://i.pravatar.cc/150?u=1'
    },
    vehicle: {
        model: 'Toyota Camry 2021',
        plate: 'ABC-123',
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&q=80&w=300'
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
       <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex items-center gap-4">
             <Link to="/jobs" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
             </Link>
             <div>
                <h1 className="text-2xl font-bold">{jobData.id}</h1>
                <p className="text-slate-500 text-sm">Status: <span className="text-orange-600 font-bold uppercase">{jobData.status}</span></p>
             </div>
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
                <span className="material-symbols-outlined">print</span> Print
             </button>
             <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm">Mark Complete</button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full min-h-0">
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-slate-400">person</span> Customer</h3>
                <div className="flex items-center gap-3">
                    <img src={jobData.customer.avatar || FALLBACK_AVATAR_IMAGE} className="w-10 h-10 rounded-full" alt="" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_AVATAR_IMAGE; }} />
                    <div>
                        <p className="font-bold text-sm">{jobData.customer.name}</p>
                        <p className="text-xs text-slate-500">{jobData.customer.phone}</p>
                    </div>
                </div>
             </div>

             <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-slate-400">directions_car</span> Vehicle</h3>
                <img src={jobData.vehicle.image || FALLBACK_VEHICLE_IMAGE} className="w-full h-32 object-cover rounded-lg mb-2" alt="" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_VEHICLE_IMAGE; }} />
                <p className="font-bold text-sm">{jobData.vehicle.model}</p>
                <p className="text-xs font-mono bg-slate-100 dark:bg-slate-800 p-1 inline-block rounded">{jobData.vehicle.plate}</p>
             </div>

             {/* GadiAI Widget */}
             <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-5 text-white shadow-lg shadow-indigo-500/20">
                 <h3 className="font-bold mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">auto_awesome</span>
                    GadiAI Insights
                 </h3>
                 <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-xs leading-relaxed border border-white/10">
                    <p className="font-bold mb-2">Technician Guide:</p>
                    <ul className="space-y-2 opacity-90">
                        <li className="flex gap-2"><span className="text-indigo-200">1.</span> Check CV axle boots for tears or leaks.</li>
                        <li className="flex gap-2"><span className="text-indigo-200">2.</span> Inspect wheel balancing weights.</li>
                        <li className="flex gap-2"><span className="text-indigo-200">3.</span> Check for inner/outer tie rod end play.</li>
                    </ul>
                 </div>
                 <button className="w-full mt-4 py-2 bg-white text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors">Generate Full Guide</button>
             </div>
          </div>

          <div className="lg:col-span-3 flex flex-col bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
             <div className="flex border-b border-slate-200 dark:border-slate-700">
                {['service', 'parts', 'billing'].map(tab => (
                   <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500'}`}>
                     {tab}
                   </button>
                ))}
             </div>
             
             <div className="p-6 overflow-y-auto">
                {activeTab === 'service' && (
                    <div className="space-y-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-l-4 border-primary-500">
                            <h4 className="font-bold text-sm mb-1 uppercase tracking-wider text-slate-500">Original Complaint</h4>
                            <p className="text-slate-900 dark:text-white font-medium">{jobData.complaint}</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bold">Labor Activities</h3>
                            <div className="border rounded-lg divide-y dark:border-slate-700">
                                <div className="p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" className="w-4 h-4 text-primary-600" defaultChecked />
                                        <span className="text-sm font-medium">Visual Inspection & Road Test</span>
                                    </div>
                                    <span className="text-xs text-slate-400">Done by Sarah L.</span>
                                </div>
                                <div className="p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" className="w-4 h-4 text-primary-600" />
                                        <span className="text-sm font-medium">Front Wheel Alignment</span>
                                    </div>
                                    <span className="text-xs text-slate-400">In Progress</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
}
