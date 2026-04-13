import React, { useState, useEffect } from 'react';

export default function EmergencySOS() {
  const [finding, setFinding] = useState(false);
  const [mechanicFound, setMechanicFound] = useState(false);

  const handleSOS = () => {
      setFinding(true);
      setTimeout(() => {
          setFinding(false);
          setMechanicFound(true);
      }, 3000);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
        {/* Map Background Simulation */}
        <div className="absolute inset-0 z-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
            {/* Radar Animation */}
            {finding && (
                <div className="absolute w-96 h-96 bg-red-500/20 rounded-full animate-ping"></div>
            )}
            <div className="relative z-10 w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
        </div>

        {/* Floating Panel */}
        <div className="relative z-10 m-auto w-full max-w-sm">
            {!mechanicFound ? (
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl p-8 text-center border border-slate-200 dark:border-slate-700">
                    <div className="mb-6">
                        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <span className="material-symbols-outlined text-5xl">sos</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Emergency Assistance</h2>
                        <p className="text-slate-500 text-sm mt-2">{finding ? "Locating nearest mechanic..." : "Tap below to request immediate help."}</p>
                    </div>

                    {!finding && (
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {['Breakdown', 'Flat Tyre', 'Battery Dead', 'Accident', 'Locked Out', 'Fuel Empty'].map(type => (
                                <button key={type} className="p-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    {type}
                                </button>
                            ))}
                        </div>
                    )}

                    <button 
                        onClick={handleSOS}
                        disabled={finding}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-red-500/30 transition-all active:scale-95 disabled:opacity-70"
                    >
                        {finding ? 'Searching...' : 'REQUEST HELP'}
                    </button>
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700 animate-slide-up">
                    <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
                        <img src="https://i.pravatar.cc/150?u=5" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/e2e8f0/94a3b8?text=User'; }} className="w-16 h-16 rounded-full border-2 border-green-500 p-0.5" alt="Mechanic" />
                        <div>
                            <h3 className="font-bold text-lg">Mike Ross</h3>
                            <div className="flex items-center gap-1 text-sm text-slate-500">
                                <span className="material-symbols-outlined text-base filled text-yellow-500">star</span> 4.9 • 1.2 km away
                            </div>
                        </div>
                        <div className="ml-auto flex gap-2">
                            <button className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200">
                                <span className="material-symbols-outlined">call</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Estimated Arrival</span>
                            <span className="font-bold">12 Mins</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Vehicle</span>
                            <span className="font-bold">Recovery Van (BA 4 Ka 1122)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Est. Cost</span>
                            <span className="font-bold">NPR 500 - NPR 800</span>
                        </div>
                        
                        <div className="pt-4 flex gap-3">
                            <button onClick={() => setMechanicFound(false)} className="flex-1 py-3 border border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50">Cancel</button>
                            <button className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700">Track Live</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}