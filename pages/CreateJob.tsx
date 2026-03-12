
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiBackend } from '../services/ai';
import { db } from '../services/db';
import { useToast } from '../App';

const MOCK_CUSTOMERS = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        phone: '9876543210',
        email: 'john.doe@example.com',
        address: '123 Maple Street, Springfield',
        vehicles: [
            { id: 101, make: 'Toyota', model: 'Camry', year: '2021', reg: 'MH-01-AB-1234', fuel: 'Petrol', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&q=80&w=200' }
        ]
    }
];

export default function CreateJob() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [mode, setMode] = useState<'quick' | 'detailed'>('detailed');
    const [activeStep, setActiveStep] = useState(1);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiInsights, setAiInsights] = useState<any>(null);

    const [complaint, setComplaint] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [searchResults, setSearchResults] = useState<typeof MOCK_CUSTOMERS>([]);
    const [customerForm, setCustomerForm] = useState({ firstName: '', lastName: '', phone: '', email: '', address: '' });
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

    const handleAiAnalysis = async () => {
        if (!complaint) return showToast('info', 'Please enter a complaint first');

        setIsAiLoading(true);
        try {
            const vInfo = selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : "Unknown Vehicle";
            const insights = await aiBackend.analyzeJobComplaint(complaint, vInfo);
            setAiInsights(insights);
            showToast('success', 'GadiAI has analyzed the issue!');
        } catch (err) {
            showToast('error', 'AI Analysis failed');
        } finally {
            setIsAiLoading(false);
        }
    };

    const selectCustomer = (customer: any) => {
        setSelectedCustomer(customer);
        setCustomerForm({ firstName: customer.firstName, lastName: customer.lastName, phone: customer.phone, email: customer.email, address: customer.address });
        setSearchResults([]);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Create New Job</h1>
                    <p className="text-slate-500 text-sm">Open a job card with optional AI diagnostics.</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button onClick={() => setMode('quick')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'quick' ? 'bg-white dark:bg-slate-700 shadow text-primary-600' : 'text-slate-500'}`}>Quick</button>
                    <button onClick={() => setMode('detailed')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'detailed' ? 'bg-white dark:bg-slate-700 shadow text-primary-600' : 'text-slate-500'}`}>Detailed</button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        {['Customer Info', 'Vehicle Details', 'Service & Issues'].map((step, idx) => (
                            <div key={step} onClick={() => setActiveStep(idx + 1)} className={`p-4 border-l-4 cursor-pointer transition-colors ${activeStep === idx + 1 ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                <span className="text-sm font-medium">{step}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    {activeStep === 1 && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="font-bold border-b pb-2">Customer Info</h3>
                            <input type="text" placeholder="Search customer..." className="w-full p-2.5 rounded-lg border dark:border-slate-600 dark:bg-slate-800" onChange={(e) => {
                                const results = MOCK_CUSTOMERS.filter(c => c.phone.includes(e.target.value));
                                setSearchResults(e.target.value ? results : []);
                            }} />
                            {searchResults.map(c => <div key={c.id} onClick={() => selectCustomer(c)} className="p-2 hover:bg-slate-100 cursor-pointer rounded border dark:border-slate-700">{c.firstName} - {c.phone}</div>)}
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="First Name" value={customerForm.firstName} className="p-2.5 border rounded-lg dark:bg-slate-800 dark:border-slate-600" readOnly />
                                <input type="text" placeholder="Phone" value={customerForm.phone} className="p-2.5 border rounded-lg dark:bg-slate-800 dark:border-slate-600" readOnly />
                            </div>
                        </div>
                    )}

                    {activeStep === 2 && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="font-bold border-b pb-2">Vehicle Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Registration No" className="p-2.5 border rounded-lg dark:bg-slate-800 dark:border-slate-600 uppercase font-mono" />
                                <select className="p-2.5 border rounded-lg dark:bg-slate-800 dark:border-slate-600">
                                    <option>Sedan</option>
                                    <option>SUV</option>
                                    <option>Hatchback</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {activeStep === 3 && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="font-bold">Service & Issues</h3>
                                <button
                                    onClick={handleAiAnalysis}
                                    disabled={isAiLoading}
                                    className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-3 py-1.5 rounded-full font-bold flex items-center gap-1 hover:bg-indigo-200 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">{isAiLoading ? 'sync' : 'auto_awesome'}</span>
                                    {isAiLoading ? 'Analyzing...' : 'GadiAI Analysis'}
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Customer Complaints</label>
                                <textarea
                                    value={complaint}
                                    onChange={(e) => setComplaint(e.target.value)}
                                    placeholder="e.g. Squeaking noise when braking, vibrating steering..."
                                    className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                                    rows={4}
                                ></textarea>
                            </div>

                            {aiInsights && (
                                <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 rounded-xl p-4 animate-slide-up">
                                    <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-sm flex items-center gap-2 mb-3">
                                        <span className="material-symbols-outlined text-sm">lightbulb</span>
                                        AI Suggested Diagnostics
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <p className="font-bold text-indigo-700 mb-1">Possible Causes:</p>
                                            <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                                                {aiInsights.possibleCauses.map((c: string, i: number) => <li key={i}>{c}</li>)}
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="font-bold text-indigo-700 mb-1">Recommended Steps:</p>
                                            <ul className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                                                {aiInsights.suggestedSteps.map((s: string, i: number) => <li key={i}>{s}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-indigo-900/30 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                                        <span>Estimated Labor: {aiInsights.estimatedLaborHours} Hours</span>
                                        <button className="hover:underline">Apply to Job Card</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-8 flex justify-between">
                        <button onClick={() => setActiveStep(s => Math.max(1, s - 1))} className="px-6 py-2 rounded-lg text-slate-500 font-medium">Back</button>
                        <button data-testid="next-step" onClick={async () => {
                            if (activeStep < 3) setActiveStep(s => s + 1);
                            else {
                                await db.saveJob({
                                    customerId: selectedCustomer?.id || 1,
                                    vehicleInfo: selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.reg})` : "General Service",
                                    complaint: complaint,
                                    status: 'Pending',
                                    laborCost: aiInsights?.estimatedLaborHours ? aiInsights.estimatedLaborHours * 500 : 0 // Mock labor cost calculation
                                });
                                showToast('success', 'Job Card Created!');
                                navigate('/jobs');
                            }
                        }} className="px-6 py-2 bg-primary-600 text-white rounded-lg font-bold shadow-md">
                            {activeStep === 3 ? 'Create Job Card' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
