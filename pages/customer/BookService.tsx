import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookService() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<string[]>([]);
  const [selectedGarage, setSelectedGarage] = useState<number | null>(null);

  const toggleService = (service: string) => {
      if (selectedService.includes(service)) {
          setSelectedService(selectedService.filter(s => s !== service));
      } else {
          setSelectedService([...selectedService, service]);
      }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
       <div className="flex items-center gap-4 mb-4">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/portal')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
             <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
             <h1 className="text-2xl font-bold">Book a Service</h1>
             <p className="text-slate-500 text-sm">Step {step} of 4</p>
          </div>
       </div>

       {/* Progress Bar */}
       <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
           <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${step * 25}%` }}></div>
       </div>

       <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm min-h-[400px]">
           
           {/* Step 1: Vehicle Selection */}
           {step === 1 && (
               <div className="space-y-6 animate-fade-in">
                   <h2 className="text-lg font-bold">Select Vehicle</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {[
                           { id: 1, name: 'Toyota Camry', reg: 'BA 1 Pa 1234', img: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&q=80&w=200' },
                           { id: 2, name: 'Honda Activa 6G', reg: 'BA 2 Cha 5678', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=200' }
                       ].map(v => (
                           <div 
                                key={v.id} 
                                onClick={() => setSelectedVehicle(v.id)}
                                className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedVehicle === v.id ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-orange-300'}`}
                           >
                               <img src={v.img} className="w-16 h-16 rounded-lg object-cover bg-slate-200" alt="" />
                               <div>
                                   <h3 className="font-bold text-slate-900 dark:text-white">{v.name}</h3>
                                   <p className="text-sm text-slate-500">{v.reg}</p>
                               </div>
                               <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedVehicle === v.id ? 'border-orange-500' : 'border-slate-300'}`}>
                                   {selectedVehicle === v.id && <div className="w-3 h-3 bg-orange-500 rounded-full"></div>}
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           )}

           {/* Step 2: Service Selection */}
           {step === 2 && (
               <div className="space-y-6 animate-fade-in">
                   <h2 className="text-lg font-bold">What do you need?</h2>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {[
                           { name: 'General Service', icon: 'car_repair' },
                           { name: 'Oil Change', icon: 'oil_barrel' },
                           { name: 'Car Wash', icon: 'local_car_wash' },
                           { name: 'Denting/Painting', icon: 'format_paint' },
                           { name: 'AC Service', icon: 'ac_unit' },
                           { name: 'Tyre Change', icon: 'tire_repair' },
                           { name: 'Battery', icon: 'battery_charging_full' },
                           { name: 'Inspection', icon: 'fact_check' }
                       ].map(s => (
                           <div 
                                key={s.name}
                                onClick={() => toggleService(s.name)}
                                className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all text-center h-32 ${selectedService.includes(s.name) ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-400' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                           >
                               <span className="material-symbols-outlined text-3xl mb-2">{s.icon}</span>
                               <span className="font-bold text-sm">{s.name}</span>
                           </div>
                       ))}
                   </div>
                   <div className="pt-2">
                       <label className="block text-sm font-medium mb-2">Describe Issue (Optional)</label>
                       <textarea className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-orange-500" rows={3} placeholder="e.g. Strange noise from engine..."></textarea>
                   </div>
               </div>
           )}

           {/* Step 3: Garage Selection */}
           {step === 3 && (
               <div className="space-y-6 animate-fade-in">
                   <h2 className="text-lg font-bold">Select Garage</h2>
                   
                   <div className="relative mb-4">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input type="text" placeholder="Search nearby garages..." className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                   </div>

                   <div className="space-y-4">
                       {[
                           { id: 101, name: 'City Auto Works', rating: 4.8, dist: '1.2 km', price: 'Budget', reviews: 120 },
                           { id: 102, name: 'Quick Fix Mechanics', rating: 4.5, dist: '2.5 km', price: 'Standard', reviews: 85 },
                           { id: 103, name: 'Star Service Center', rating: 4.2, dist: '3.0 km', price: 'Premium', reviews: 45 }
                       ].map(g => (
                           <div 
                                key={g.id}
                                onClick={() => setSelectedGarage(g.id)}
                                className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedGarage === g.id ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                           >
                               <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-500 text-xl">
                                   {g.name[0]}
                               </div>
                               <div className="flex-1">
                                   <div className="flex justify-between">
                                       <h3 className="font-bold text-slate-900 dark:text-white">{g.name}</h3>
                                       <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{g.dist}</span>
                                   </div>
                                   <div className="flex items-center gap-1 text-yellow-500 text-sm my-1">
                                       <span className="material-symbols-outlined filled text-sm">star</span> 
                                       <span className="font-bold">{g.rating}</span>
                                       <span className="text-slate-400 font-normal">({g.reviews})</span>
                                       <span className="text-slate-400 mx-1">•</span>
                                       <span className="text-slate-500 font-medium">{g.price}</span>
                                   </div>
                                   <div className="flex gap-2 mt-2">
                                       <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded">Pick & Drop</span>
                                       <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Genuine Parts</span>
                                   </div>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           )}

           {/* Step 4: Schedule */}
           {step === 4 && (
               <div className="space-y-6 animate-fade-in">
                   <h2 className="text-lg font-bold">Select Date & Time</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                           <label className="block text-sm font-medium mb-2">Date</label>
                           <input type="date" className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent" />
                       </div>
                       <div>
                           <label className="block text-sm font-medium mb-2">Time Slot</label>
                           <div className="grid grid-cols-2 gap-2">
                               {['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'].map(t => (
                                   <button key={t} className="py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-orange-50 hover:border-orange-500 hover:text-orange-600 focus:bg-orange-500 focus:text-white focus:border-orange-500 transition-colors">
                                       {t}
                                   </button>
                               ))}
                           </div>
                       </div>
                   </div>
                   
                   <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mt-4">
                       <label className="flex items-center gap-3 cursor-pointer">
                           <input type="checkbox" className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500" defaultChecked />
                           <div>
                               <p className="font-bold text-sm">Request Pick up & Drop</p>
                               <p className="text-xs text-slate-500">Garage will collect your vehicle (Charges may apply)</p>
                           </div>
                       </label>
                   </div>
               </div>
           )}

           {/* Navigation Buttons */}
           <div className="flex justify-between pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
               <button 
                    disabled={step === 1}
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-2.5 rounded-lg font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
               >
                   Back
               </button>
               <button 
                    onClick={() => {
                        if (step < 4) setStep(step + 1);
                        else {
                            alert("Booking Confirmed!");
                            navigate('/portal');
                        }
                    }}
                    disabled={
                        (step === 1 && !selectedVehicle) ||
                        (step === 2 && selectedService.length === 0) ||
                        (step === 3 && !selectedGarage)
                    }
                    className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
               >
                   {step === 4 ? 'Confirm Booking' : 'Next'}
               </button>
           </div>
       </div>
    </div>
  );
}