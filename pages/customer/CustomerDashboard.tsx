import React from 'react';
import { Link } from 'react-router-dom';
import { FALLBACK_VEHICLE_IMAGE } from '../../utils/imageFallbacks';

const myVehicles = [
  { id: 1, make: 'Toyota', model: 'Camry', year: '2021', reg: 'BA 1 Pa 1234', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&q=80&w=400', nextService: '15 Nov 2024', status: 'Good' },
  { id: 2, make: 'Honda', model: 'Activa 6G', year: '2022', reg: 'BA 2 Cha 5678', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400', nextService: 'Overdue', status: 'Needs Attention' },
];

export default function CustomerDashboard() {
  return (
    <div className="space-y-6">
       {/* Welcome Banner */}
       <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
           <div className="relative z-10">
               <h1 className="text-2xl font-bold mb-1">Welcome back, John!</h1>
               <p className="text-orange-100 mb-6 max-w-lg">Your vehicle health is our priority. You have 1 upcoming service and 1 exclusive offer waiting.</p>
               <div className="flex gap-3">
                   <Link to="/portal/book" className="bg-white text-orange-600 px-5 py-2.5 rounded-lg font-bold text-sm shadow-md hover:bg-orange-50 transition-colors flex items-center gap-2">
                       <span className="material-symbols-outlined">calendar_add_on</span> Book Service
                   </Link>
                   <button className="bg-orange-700/50 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-orange-700/70 transition-colors backdrop-blur-sm border border-white/20">
                       View Offers
                   </button>
               </div>
           </div>
           <div className="absolute right-0 bottom-0 opacity-20">
               <span className="material-symbols-outlined text-[180px] -mr-8 -mb-8">directions_car</span>
           </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* My Garage */}
           <div className="lg:col-span-2 space-y-6">
               <div className="flex justify-between items-center">
                   <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Garage</h2>
                   <Link to="/portal/vehicles" className="text-orange-500 text-sm font-bold hover:underline">View All</Link>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {myVehicles.map(vehicle => (
                       <div key={vehicle.id} className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                           <div className="h-40 relative overflow-hidden">
                               <img src={vehicle.image || FALLBACK_VEHICLE_IMAGE} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={vehicle.model} onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_VEHICLE_IMAGE; }} />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                               <div className="absolute bottom-3 left-3 text-white">
                                   <h3 className="font-bold text-lg">{vehicle.make} {vehicle.model}</h3>
                                   <p className="text-xs opacity-90">{vehicle.reg}</p>
                               </div>
                               <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold ${vehicle.status === 'Good' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                   {vehicle.status}
                               </div>
                           </div>
                           <div className="p-4">
                               <div className="flex justify-between items-center mb-4">
                                   <div className="text-xs text-slate-500">
                                       <p>Next Service</p>
                                       <p className={`font-bold text-sm ${vehicle.nextService === 'Overdue' ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{vehicle.nextService}</p>
                                   </div>
                                   <div className="text-xs text-slate-500 text-right">
                                       <p>Last Service</p>
                                       <p className="font-bold text-sm text-slate-900 dark:text-white">20 Aug 2024</p>
                                   </div>
                               </div>
                               <div className="grid grid-cols-2 gap-2">
                                   <button className="py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">History</button>
                                   <Link to="/portal/book" className="py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:opacity-90 flex items-center justify-center">Book Now</Link>
                               </div>
                           </div>
                       </div>
                   ))}
                   
                   {/* Add Vehicle Card */}
                   <Link to="/portal/vehicles" className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center h-full min-h-[200px] bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-400 hover:text-orange-500 hover:border-orange-300">
                       <span className="material-symbols-outlined text-4xl mb-2">add_circle</span>
                       <span className="font-bold">Add Vehicle</span>
                   </Link>
               </div>
           </div>

           {/* Quick Actions & Status */}
           <div className="space-y-6">
               <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                   <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                   <div className="grid grid-cols-2 gap-3">
                       <button className="flex flex-col items-center justify-center p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-100 dark:border-red-900/30">
                           <span className="material-symbols-outlined text-3xl mb-1">sos</span>
                           <span className="text-xs font-bold">Emergency</span>
                       </button>
                       <Link to="/portal/book" className="flex flex-col items-center justify-center p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors border border-orange-100 dark:border-orange-900/30">
                           <span className="material-symbols-outlined text-3xl mb-1">car_repair</span>
                           <span className="text-xs font-bold">Service</span>
                       </Link>
                       <button className="flex flex-col items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-100 dark:border-blue-900/30">
                           <span className="material-symbols-outlined text-3xl mb-1">local_gas_station</span>
                           <span className="text-xs font-bold">Fuel Log</span>
                       </button>
                       <button className="flex flex-col items-center justify-center p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border border-purple-100 dark:border-purple-900/30">
                           <span className="material-symbols-outlined text-3xl mb-1">description</span>
                           <span className="text-xs font-bold">Docs</span>
                       </button>
                   </div>
               </div>

               <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                   <h3 className="font-bold text-lg mb-4">Upcoming Appointments</h3>
                   <div className="space-y-4">
                       <div className="flex gap-3 items-start p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border-l-4 border-orange-500">
                           <div className="flex-1">
                               <p className="font-bold text-sm text-slate-900 dark:text-white">General Service</p>
                               <p className="text-xs text-slate-500">Toyota Camry • City Auto Works</p>
                           </div>
                           <div className="text-right">
                               <p className="font-bold text-sm text-orange-600">15 Nov</p>
                               <p className="text-xs text-slate-400">10:00 AM</p>
                           </div>
                       </div>
                       {/* Empty State if needed */}
                       {/* <p className="text-sm text-slate-500 text-center py-4">No upcoming appointments.</p> */}
                   </div>
                   <Link to="/portal/book" className="block w-full text-center text-sm font-bold text-orange-600 mt-4 hover:underline">View Calendar</Link>
               </div>
           </div>
       </div>
    </div>
  );
}