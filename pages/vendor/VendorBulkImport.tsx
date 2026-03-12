import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../App';

export default function VendorBulkImport() {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(1); // 1: Upload, 2: Map, 3: Review, 4: Done
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleFileDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && droppedFile.type === "text/csv") {
          setFile(droppedFile);
      } else {
          showToast('error', 'Please upload a valid CSV file.');
      }
  };

  const handleUpload = () => {
      if (file) setStep(2);
  };

  const handleImport = () => {
      setStep(3); // Simulate processing
      setTimeout(() => setStep(4), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex items-center gap-4 mb-4">
          <Link to="/vendor/products" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
             <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
             <h1 className="text-2xl font-bold">Bulk Import Products</h1>
             <p className="text-slate-500 text-sm">Import your inventory via CSV/Excel.</p>
          </div>
       </div>

       {/* Progress Stepper */}
       <div className="flex items-center justify-between px-10 py-6 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
           {['Upload File', 'Map Columns', 'Processing', 'Complete'].map((label, idx) => (
               <div key={idx} className="flex flex-col items-center gap-2 relative z-10">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step > idx + 1 ? 'bg-green-500 text-white' : step === idx + 1 ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                       {step > idx + 1 ? <span className="material-symbols-outlined text-sm">check</span> : idx + 1}
                   </div>
                   <span className={`text-xs font-medium ${step === idx + 1 ? 'text-purple-600' : 'text-slate-500'}`}>{label}</span>
               </div>
           ))}
           {/* Line */}
           <div className="absolute left-0 right-0 top-[45px] h-0.5 bg-slate-200 dark:bg-slate-700 -z-0 mx-16"></div>
       </div>

       <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm min-h-[400px]">
           {step === 1 && (
               <div className="flex flex-col items-center justify-center h-full space-y-6">
                   <div 
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleFileDrop}
                      className="w-full max-w-lg h-64 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors"
                   >
                       {file ? (
                           <div className="text-center">
                               <span className="material-symbols-outlined text-5xl text-green-500 mb-2">description</span>
                               <p className="font-bold text-lg">{file.name}</p>
                               <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                               <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-red-500 text-sm hover:underline mt-2">Remove</button>
                           </div>
                       ) : (
                           <div className="text-center p-6">
                               <span className="material-symbols-outlined text-5xl text-slate-400 mb-4">cloud_upload</span>
                               <p className="font-bold text-lg mb-1">Drag & Drop your CSV file here</p>
                               <p className="text-slate-500 text-sm mb-4">or click to browse</p>
                               <input type="file" accept=".csv" className="hidden" id="fileUpload" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                               <label htmlFor="fileUpload" className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium text-sm cursor-pointer hover:bg-purple-700">Browse Files</label>
                           </div>
                       )}
                   </div>
                   
                   <div className="flex gap-4">
                       <button className="flex items-center gap-2 text-sm text-purple-600 font-medium hover:underline">
                           <span className="material-symbols-outlined text-lg">download</span> Download Sample Template
                       </button>
                   </div>

                   <div className="w-full max-w-lg flex justify-end pt-4">
                       <button 
                          onClick={handleUpload}
                          disabled={!file}
                          className="px-6 py-2.5 bg-purple-600 disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-purple-700 text-white rounded-lg font-bold shadow-md transition-all"
                       >
                           Next: Map Columns
                       </button>
                   </div>
               </div>
           )}

           {step === 2 && (
               <div className="space-y-6">
                   <h3 className="font-bold text-lg border-b border-slate-200 dark:border-slate-700 pb-2">Map CSV Columns to Product Fields</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                       {['Product Name', 'SKU', 'Category', 'Brand', 'Wholesale Price', 'Retail Price', 'Stock Quantity'].map((field) => (
                           <div key={field} className="flex flex-col">
                               <label className="text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{field} <span className="text-red-500">*</span></label>
                               <select className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-purple-500">
                                   <option>Select Column from CSV</option>
                                   <option>{field}</option>
                                   <option>col_{field.toLowerCase().replace(' ', '_')}</option>
                               </select>
                           </div>
                       ))}
                   </div>
                   <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-700 mt-4">
                       <button onClick={() => setStep(1)} className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Back</button>
                       <button onClick={handleImport} className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-md">Start Import</button>
                   </div>
               </div>
           )}

           {step === 3 && (
               <div className="flex flex-col items-center justify-center h-64 text-center">
                   <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                   <h3 className="text-xl font-bold mb-2">Importing Products...</h3>
                   <p className="text-slate-500">Please wait while we process your file.</p>
               </div>
           )}

           {step === 4 && (
               <div className="flex flex-col items-center justify-center h-64 text-center">
                   <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                       <span className="material-symbols-outlined text-4xl">check</span>
                   </div>
                   <h3 className="text-xl font-bold mb-2 text-green-600">Import Successful!</h3>
                   <p className="text-slate-500 mb-6">Successfully imported 142 products. 3 skipped due to duplicate SKU.</p>
                   <div className="flex gap-4">
                       <button onClick={() => setStep(1)} className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800">Import Another</button>
                       <button onClick={() => navigate('/vendor/products')} className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-md">View Products</button>
                   </div>
               </div>
           )}
       </div>
    </div>
  );
}