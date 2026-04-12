import React, { useState } from 'react';

const initialVehicles = [
    { id: 1, make: 'Toyota', model: 'Camry', year: '2021', reg: 'MH-01-AB-1234', type: 'Car', fuel: 'Petrol', insurance: 'Valid till Dec 2024', puc: 'Valid till Nov 2024', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&q=80&w=400' },
    { id: 2, make: 'Honda', model: 'Activa 6G', year: '2022', reg: 'MH-02-XY-9988', type: 'Bike', fuel: 'Petrol', insurance: 'Expired', puc: 'Valid till Jan 2025', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400' },
];

export default function MyVehicles() {
    const [vehicles, setVehicles] = useState(initialVehicles);
    const [showForm, setShowForm] = useState(false);
    
    const [newVehicle, setNewVehicle] = useState({
        reg: '',
        type: 'Car',
        make: '',
        model: '',
        year: '',
        fuel: 'Petrol'
    });

    const handleSave = () => {
        if (!newVehicle.reg || !newVehicle.make) return;
        
        const vehicle = {
            id: Date.now(),
            ...newVehicle,
            insurance: 'Valid till Dec 2025',
            puc: 'Valid till June 2025',
            image: newVehicle.type === 'Bike' 
                ? 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400'
                : 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=400'
        };
        
        setVehicles([vehicle, ...vehicles]);
        setShowForm(false);
        setNewVehicle({ reg: '', type: 'Car', make: '', model: '', year: '', fuel: 'Petrol' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">My Vehicles</h1>
                    <p className="text-slate-500 text-sm">Manage your cars and bikes details.</p>
                </div>
                <button
                    data-testid="add-vehicle-btn"
                    onClick={() => setShowForm(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span> Add Vehicle
                </button>
            </div>

            {showForm && (
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm animate-slide-up">
                    <h3 className="font-bold text-lg mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Add New Vehicle</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Registration Number</label>
                            <input 
                                type="text" 
                                value={newVehicle.reg}
                                onChange={(e) => setNewVehicle({...newVehicle, reg: e.target.value})}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent uppercase font-mono" 
                                placeholder="MH-01-AB-1234" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                            <select 
                                value={newVehicle.type}
                                onChange={(e) => setNewVehicle({...newVehicle, type: e.target.value})}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent"
                            >
                                <option value="Car">Car</option>
                                <option value="Bike">Bike/Scooter</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Make</label>
                            <input 
                                type="text" 
                                value={newVehicle.make}
                                onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent" 
                                placeholder="e.g. Maruti Suzuki" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Model</label>
                            <input 
                                type="text" 
                                value={newVehicle.model}
                                onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent" 
                                placeholder="e.g. Swift" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Year</label>
                            <input 
                                type="text" 
                                value={newVehicle.year}
                                onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent" 
                                placeholder="e.g. 2021" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Fuel Type</label>
                            <select 
                                value={newVehicle.fuel}
                                onChange={(e) => setNewVehicle({...newVehicle, fuel: e.target.value})}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent"
                            >
                                <option>Petrol</option>
                                <option>Diesel</option>
                                <option>EV</option>
                                <option>CNG</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button>
                        <button onClick={handleSave} className="px-6 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600">Save Vehicle</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicles.map(vehicle => (
                    <div key={vehicle.id} className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col md:flex-row">
                        <div className="w-full md:w-48 h-48 relative flex-shrink-0">
                            <img src={vehicle.image} className="w-full h-full object-cover" alt="" />
                            <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">
                                {vehicle.type}
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{vehicle.make} {vehicle.model}</h3>
                                    <p className="text-sm font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded inline-block mt-1">{vehicle.reg}</p>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">more_vert</span></button>
                            </div>

                            <div className="space-y-2 text-sm mt-2 flex-1">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Year / Fuel</span>
                                    <span className="font-medium">{vehicle.year} • {vehicle.fuel}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Insurance</span>
                                    <span className={`font-medium ${vehicle.insurance === 'Expired' ? 'text-red-500' : 'text-green-600'}`}>{vehicle.insurance}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">PUC</span>
                                    <span className="font-medium text-slate-900 dark:text-slate-200">{vehicle.puc}</span>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <button className="flex-1 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">Docs</button>
                                <button className="flex-1 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:opacity-90">Service History</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}