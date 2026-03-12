import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const steps = ['Basic Info', 'Location', 'Operating Details', 'Services', 'Banking'];

export default function Registration() {
   const [step, setStep] = useState(1);
   const [selectedVehicles, setSelectedVehicles] = useState<string[]>(['Car']);
   const navigate = useNavigate();
   const totalSteps = 5;

   const handleNext = () => {
      if (step < totalSteps) setStep(step + 1);
      else navigate('/');
   };

   const handleBack = () => {
      if (step > 1) setStep(step - 1);
   };

   return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#101a22] p-4">
         <div className="w-full max-w-3xl bg-white dark:bg-[#16222d] rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">

            {/* Progress Bar */}
            <div className="bg-slate-100 dark:bg-slate-800 px-8 py-4 border-b border-slate-200 dark:border-slate-700">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-500">Step {step} of {totalSteps}</span>
                  <span className="text-sm font-bold text-primary-600">{Math.round((step / totalSteps) * 100)}% Completed</span>
               </div>
               <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
               </div>
            </div>

            <div className="p-8">
               {/* Step 1: Basic Info */}
               {step === 1 && (
                  <div className="space-y-6">
                     <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Garage Registration</h2>
                     <p className="text-slate-500">Let's start with the basics.</p>

                     <div className="space-y-4">
                        <div>
                           <label className="block text-sm font-medium mb-1">Garage Name</label>
                           <input type="text" className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Enter garage name" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                              <label className="block text-sm font-medium mb-1">Business Registration Number</label>
                              <input type="text" className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g., 1234567-A" />
                           </div>
                           <div>
                              <label className="block text-sm font-medium mb-1">Tax/PAN Number</label>
                              <input type="text" className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Tax ID" />
                           </div>
                        </div>
                        <div>
                           <label className="block text-sm font-medium mb-1">Garage Type</label>
                           <select className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none">
                              <option>Auto Repair</option>
                              <option>Body Shop</option>
                              <option>Multi-Service</option>
                           </select>
                        </div>
                     </div>
                  </div>
               )}

               {/* Step 2: Location */}
               {step === 2 && (
                  <div className="space-y-6">
                     <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Location & Contact</h2>
                     <p className="text-slate-500">Where are you located?</p>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <div>
                              <label className="block text-sm font-medium mb-1">Street Address</label>
                              <input type="text" className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none" />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-sm font-medium mb-1">City</label>
                                 <input type="text" className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none" />
                              </div>
                              <div>
                                 <label className="block text-sm font-medium mb-1">Postal Code</label>
                                 <input type="text" className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none" />
                              </div>
                           </div>
                           <div>
                              <label className="block text-sm font-medium mb-1">Phone Number</label>
                              <input type="tel" className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none" />
                           </div>
                           <div>
                              <label className="block text-sm font-medium mb-1">Email Address</label>
                              <input type="email" className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none" />
                           </div>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center h-64 lg:h-auto border border-slate-200 dark:border-slate-700">
                           <span className="text-slate-400 flex flex-col items-center gap-2">
                              <span className="material-symbols-outlined text-4xl">map</span>
                              Map Preview Placeholder
                           </span>
                        </div>
                     </div>
                  </div>
               )}

               {/* Step 3: Operating Details */}
               {step === 3 && (
                  <div className="space-y-6">
                     <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Operating Details</h2>

                     <div className="space-y-4">
                        <h3 className="font-semibold">Working Hours</h3>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                           <div key={day} className="flex items-center gap-4">
                              <input type="checkbox" checked className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500" />
                              <span className="w-24 text-sm font-medium">{day}</span>
                              <input type="time" className="p-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent" defaultValue="09:00" />
                              <span>-</span>
                              <input type="time" className="p-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent" defaultValue="18:00" />
                           </div>
                        ))}

                        <hr className="border-slate-200 dark:border-slate-700 my-4" />

                        <div>
                           <h3 className="font-semibold mb-2">Service Area Radius</h3>
                           <div className="flex items-center gap-4">
                              <input type="range" min="0" max="50" defaultValue="15" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500" />
                              <span className="font-bold text-primary-600 whitespace-nowrap">15 km</span>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* Step 4: Services (Simplified) */}
               {step === 4 && (
                  <div className="space-y-6">
                     <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Services & Specializations</h2>
                     <p className="text-slate-500">What services do you offer?</p>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['Mechanical', 'Electrical', 'Body Work', 'Detailing', 'Tires & Wheels', 'Customization'].map(service => (
                           <label key={service} className="flex items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <input type="checkbox" className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500" checked />
                              <span className="ml-3 font-medium">{service}</span>
                           </label>
                        ))}
                     </div>

                     <div className="mt-6">
                        <h3 className="font-semibold mb-3">Vehicle Types Serviced</h3>
                        <div className="flex gap-4">
                           <div
                              onClick={() => setSelectedVehicles(prev => prev.includes('Car') ? prev.filter(v => v !== 'Car') : [...prev, 'Car'])}
                              className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl w-32 h-32 cursor-pointer transition-all ${selectedVehicles.includes('Car') ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-700 text-slate-400'}`}
                           >
                              <span className="material-symbols-outlined text-4xl mb-2">directions_car</span>
                              <span className="font-bold">Car</span>
                           </div>
                           <div
                              onClick={() => setSelectedVehicles(prev => prev.includes('Bike') ? prev.filter(v => v !== 'Bike') : [...prev, 'Bike'])}
                              className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl w-32 h-32 cursor-pointer transition-all ${selectedVehicles.includes('Bike') ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-700 text-slate-400'}`}
                           >
                              <span className="material-symbols-outlined text-4xl mb-2">two_wheeler</span>
                              <span className="font-medium">Bike</span>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* Step 5: Banking */}
               {step === 5 && (
                  <div className="space-y-6">
                     <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Banking & Payments</h2>

                     <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold mb-4">Bank Account Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                              <label className="block text-sm font-medium mb-1">Account Holder Name</label>
                              <input type="text" className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none" placeholder="Name" />
                           </div>
                           <div>
                              <label className="block text-sm font-medium mb-1">Bank Name</label>
                              <input type="text" className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none" placeholder="Bank" />
                           </div>
                           <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-1">Account Number</label>
                              <input type="text" className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none" placeholder="Account Number" />
                           </div>
                           <div>
                              <label className="block text-sm font-medium mb-1">IFSC Code</label>
                              <input type="text" className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none" placeholder="IFSC" />
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                           <input type="checkbox" className="w-5 h-5 rounded text-primary-600" checked />
                           <span>Accept Cash</span>
                        </label>
                        <label className="flex items-center gap-2">
                           <input type="checkbox" className="w-5 h-5 rounded text-primary-600" checked />
                           <span>Accept UPI</span>
                        </label>
                     </div>
                  </div>
               )}
            </div>

            {/* Footer Buttons */}
            <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
               <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${step === 1 ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
               >
                  Back
               </button>

               <button
                  onClick={handleNext}
                  className="px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
               >
                  {step === totalSteps ? 'Complete Registration' : 'Next'}
                  {step < totalSteps && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
               </button>
            </div>

         </div>
      </div>
   );
}