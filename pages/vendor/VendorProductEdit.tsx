import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../App';

export default function VendorProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isNew = !id;
  
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);

  // Mock initial data
  const [formData, setFormData] = useState({
      name: isNew ? '' : 'Synthetic Engine Oil 5W-30',
      sku: isNew ? '' : 'OIL-SYN-530',
      category: isNew ? 'Engine Parts' : 'Lubricants',
      brand: isNew ? '' : 'Castrol',
      description: isNew ? '' : 'High performance synthetic engine oil for modern engines.',
      price_wholesale: isNew ? '' : '2200',
      price_retail: isNew ? '' : '2500',
      stock: isNew ? '' : '450',
      min_order: isNew ? '1' : '5',
      tax_rate: '18',
      status: 'Published'
  });

  const handleSave = () => {
      setLoading(true);
      setTimeout(() => {
          setLoading(false);
          showToast('success', isNew ? 'Product created successfully' : 'Product updated successfully');
          navigate('/vendor/products');
      }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
       <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
             <Link to="/vendor/products" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
             </Link>
             <div>
                <h1 className="text-2xl font-bold">{isNew ? 'Add New Product' : 'Edit Product'}</h1>
                <p className="text-slate-500 text-sm">{isNew ? 'Create a new listing for your catalog' : `Updating SKU: ${formData.sku}`}</p>
             </div>
          </div>
          <div className="flex gap-3">
             <Link to="/vendor/products" className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                Cancel
             </Link>
             <button 
                onClick={handleSave}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md flex items-center gap-2 disabled:opacity-70"
             >
                {loading ? <span className="material-symbols-outlined animate-spin text-sm">refresh</span> : <span className="material-symbols-outlined text-sm">save</span>}
                {loading ? 'Saving...' : 'Save Product'}
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
             <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-6">
                {['Basic Info', 'Pricing & Tax', 'Inventory', 'Images & Media', 'Vehicle Fitment'].map(tab => {
                   const key = tab.split(' ')[0].toLowerCase();
                   return (
                      <button 
                        key={key} 
                        onClick={() => setActiveTab(key)}
                        className={`w-full text-left px-4 py-3 text-sm font-medium border-l-4 transition-colors flex items-center gap-2 ${activeTab === key ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                      >
                        <span className="material-symbols-outlined text-lg">
                            {key === 'basic' ? 'info' : key === 'pricing' ? 'payments' : key === 'inventory' ? 'inventory_2' : key === 'images' ? 'image' : 'directions_car'}
                        </span>
                        {tab}
                      </button>
                   );
                })}
             </div>
             
             {!isNew && (
                 <div className="mt-6 bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                     <h3 className="font-bold text-sm mb-2 text-slate-500 uppercase tracking-wider">Audit Log</h3>
                     <div className="space-y-3 text-xs">
                         <div>
                             <p className="text-slate-900 dark:text-white font-medium">Price updated</p>
                             <p className="text-slate-500">Today, 10:30 AM by John Doe</p>
                         </div>
                         <div>
                             <p className="text-slate-900 dark:text-white font-medium">Stock adjusted (+50)</p>
                             <p className="text-slate-500">Yesterday, 4:15 PM by System</p>
                         </div>
                         <Link to="#" className="block text-purple-600 hover:underline mt-2">View full history</Link>
                     </div>
                 </div>
             )}
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
             {activeTab === 'basic' && (
                <div className="space-y-6 animate-fade-in">
                   <h2 className="text-lg font-bold border-b border-slate-200 dark:border-slate-700 pb-2">Basic Information</h2>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                         <label className="block text-sm font-medium mb-1">Product Name <span className="text-red-500">*</span></label>
                         <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-purple-500" 
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium mb-1">SKU (Stock Keeping Unit) <span className="text-red-500">*</span></label>
                         <input 
                            type="text" 
                            value={formData.sku}
                            onChange={(e) => setFormData({...formData, sku: e.target.value})}
                            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-purple-500 uppercase" 
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium mb-1">Brand</label>
                         <input 
                            type="text" 
                            value={formData.brand}
                            onChange={(e) => setFormData({...formData, brand: e.target.value})}
                            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-purple-500" 
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium mb-1">Category</label>
                         <select 
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-purple-500"
                         >
                             <option>Engine Parts</option>
                             <option>Brakes</option>
                             <option>Lubricants</option>
                             <option>Filters</option>
                             <option>Suspension</option>
                             <option>Electrical</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-sm font-medium mb-1">Status</label>
                         <select 
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-purple-500"
                         >
                             <option>Published</option>
                             <option>Draft</option>
                             <option>Inactive</option>
                         </select>
                      </div>
                      <div className="md:col-span-2">
                         <label className="block text-sm font-medium mb-1">Description</label>
                         <textarea 
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-purple-500"
                         ></textarea>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'pricing' && (
                <div className="space-y-6 animate-fade-in">
                   <h2 className="text-lg font-bold border-b border-slate-200 dark:border-slate-700 pb-2">Pricing & Tax</h2>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                          <h3 className="font-bold mb-3 text-sm">Wholesale (B2B)</h3>
                          <div className="space-y-3">
                              <div>
                                 <label className="block text-xs font-medium mb-1 text-slate-500">Unit Price (₹)</label>
                                 <input 
                                    type="number" 
                                    value={formData.price_wholesale}
                                    onChange={(e) => setFormData({...formData, price_wholesale: e.target.value})}
                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none" 
                                 />
                              </div>
                              <div>
                                 <label className="block text-xs font-medium mb-1 text-slate-500">Minimum Order Qty</label>
                                 <input 
                                    type="number" 
                                    value={formData.min_order}
                                    onChange={(e) => setFormData({...formData, min_order: e.target.value})}
                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none" 
                                 />
                              </div>
                          </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                          <h3 className="font-bold mb-3 text-sm">Retail (MRP)</h3>
                          <div className="space-y-3">
                              <div>
                                 <label className="block text-xs font-medium mb-1 text-slate-500">MRP (₹)</label>
                                 <input 
                                    type="number" 
                                    value={formData.price_retail}
                                    onChange={(e) => setFormData({...formData, price_retail: e.target.value})}
                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none" 
                                 />
                              </div>
                          </div>
                      </div>

                      <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1">Tax Rate (GST %)</label>
                          <select 
                             value={formData.tax_rate}
                             onChange={(e) => setFormData({...formData, tax_rate: e.target.value})}
                             className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none"
                          >
                              <option value="0">0% (Exempt)</option>
                              <option value="5">5%</option>
                              <option value="12">12%</option>
                              <option value="18">18%</option>
                              <option value="28">28%</option>
                          </select>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'inventory' && (
                <div className="space-y-6 animate-fade-in">
                   <h2 className="text-lg font-bold border-b border-slate-200 dark:border-slate-700 pb-2">Inventory Management</h2>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-medium mb-1">Current Stock</label>
                         <input 
                            type="number" 
                            value={formData.stock}
                            onChange={(e) => setFormData({...formData, stock: e.target.value})}
                            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-purple-500" 
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium mb-1">Low Stock Alert Level</label>
                         <input 
                            type="number" 
                            defaultValue="10"
                            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-purple-500" 
                         />
                      </div>
                      
                      <div className="md:col-span-2 pt-4">
                          <h3 className="font-bold text-sm mb-2">Warehouse Locations</h3>
                          <table className="w-full text-sm text-left border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                              <thead className="bg-slate-50 dark:bg-slate-800">
                                  <tr>
                                      <th className="p-3">Warehouse Name</th>
                                      <th className="p-3">Location</th>
                                      <th className="p-3 text-right">Qty</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr className="border-b border-slate-200 dark:border-slate-700">
                                      <td className="p-3">Main Hub (Mumbai)</td>
                                      <td className="p-3 font-mono text-xs">Rack A-12</td>
                                      <td className="p-3 text-right font-bold">{formData.stock || 0}</td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'images' && (
                <div className="space-y-6 animate-fade-in">
                   <h2 className="text-lg font-bold border-b border-slate-200 dark:border-slate-700 pb-2">Product Images</h2>
                   
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="aspect-square bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                           <span className="material-symbols-outlined text-3xl text-slate-400">cloud_upload</span>
                           <span className="text-xs text-slate-500 mt-2">Upload Image</span>
                       </div>
                       
                       {!isNew && (
                           <div className="aspect-square relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group">
                               <img src="https://images.unsplash.com/photo-1635784183209-e8c690e250f2?w=300&h=300&fit=crop" className="w-full h-full object-cover" alt="Product" />
                               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                   <button className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"><span className="material-symbols-outlined text-lg">delete</span></button>
                                   <button className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50"><span className="material-symbols-outlined text-lg">star</span></button>
                               </div>
                               <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">Main</div>
                           </div>
                       )}
                   </div>
                   <p className="text-xs text-slate-500">Recommended size: 800x800px. Max file size: 2MB.</p>
                </div>
             )}

             {activeTab === 'vehicle' && (
                 <div className="space-y-6 animate-fade-in">
                     <h2 className="text-lg font-bold border-b border-slate-200 dark:border-slate-700 pb-2">Vehicle Fitment (Compatibility)</h2>
                     <p className="text-sm text-slate-500">Specify which vehicles this part is compatible with.</p>

                     <div className="flex gap-2">
                         <div className="flex-1">
                             <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent text-sm">
                                 <option>Select Make</option>
                                 <option>Maruti Suzuki</option>
                                 <option>Hyundai</option>
                                 <option>Toyota</option>
                             </select>
                         </div>
                         <div className="flex-1">
                             <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent text-sm">
                                 <option>Select Model</option>
                                 <option>Swift</option>
                                 <option>Baleno</option>
                             </select>
                         </div>
                         <div className="flex-1">
                             <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent text-sm">
                                 <option>Select Year</option>
                                 <option>2020-2024</option>
                                 <option>2015-2019</option>
                             </select>
                         </div>
                         <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold">Add</button>
                     </div>

                     <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                         <table className="w-full text-sm text-left">
                             <thead className="bg-slate-50 dark:bg-slate-800">
                                 <tr>
                                     <th className="p-3">Make</th>
                                     <th className="p-3">Model</th>
                                     <th className="p-3">Year</th>
                                     <th className="p-3 text-right">Action</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                 <tr>
                                     <td className="p-3">Maruti Suzuki</td>
                                     <td className="p-3">Swift</td>
                                     <td className="p-3">2018 - 2023</td>
                                     <td className="p-3 text-right">
                                         <button className="text-red-500 hover:text-red-700"><span className="material-symbols-outlined text-lg">delete</span></button>
                                     </td>
                                 </tr>
                             </tbody>
                         </table>
                     </div>
                 </div>
             )}
          </div>
       </div>
    </div>
  );
}