import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const initialProducts = [
  { id: 1, name: 'Synthetic Engine Oil 5W-30', sku: 'OIL-SYN-530', category: 'Lubricants', price: 2500, stock: 450, status: 'Published', img: 'https://images.unsplash.com/photo-1635784183209-e8c690e250f2?w=100&h=100&fit=crop' },
  { id: 2, name: 'Brake Pad Set (Front)', sku: 'BP-FR-001', category: 'Brakes', price: 1800, stock: 120, status: 'Published', img: 'https://images.unsplash.com/photo-1600161599939-23d16036198c?w=100&h=100&fit=crop' },
  { id: 3, name: 'Air Filter (Universal)', sku: 'AF-UNI-99', category: 'Filters', price: 450, stock: 25, status: 'Low Stock', img: 'https://images.unsplash.com/photo-1517059478735-9b73637b6c5e?w=100&h=100&fit=crop' },
  { id: 4, name: 'Car Battery 12V 45Ah', sku: 'BAT-12V-45', category: 'Batteries', price: 4200, stock: 0, status: 'Out of Stock', img: 'https://images.unsplash.com/photo-1625710772821-48932720118a?w=100&h=100&fit=crop' },
  { id: 5, name: 'Spark Plug (Iridium)', sku: 'SP-IRI-04', category: 'Ignition', price: 350, stock: 200, status: 'Published', img: 'https://images.unsplash.com/photo-1615900119312-2acd3a71f3aa?w=100&h=100&fit=crop' },
];

export default function VendorProducts() {
  const [products] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const filteredProducts = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All Categories' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'All Status' || product.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['All Categories', ...new Set(products.map(p => p.category))];

  return (
    <div className="space-y-6">
       <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold">Product Catalog</h1>
             <p className="text-slate-500 text-sm">Manage your listings and inventory.</p>
          </div>
          <div className="flex gap-2">
             <Link to="/vendor/products/bulk-import" className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined">upload_file</span>
                Bulk Import
             </Link>
             <Link to="/vendor/products/new" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-md">
                <span className="material-symbols-outlined">add</span>
                Add New Product
             </Link>
          </div>
       </div>

       {/* Filters */}
       <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center shadow-sm">
          <div className="relative flex-1 min-w-[250px]">
             <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
             <input 
                type="text" 
                placeholder="Search products by Name or SKU..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" 
             />
          </div>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
          >
             {categories.map(cat => <option key={cat}>{cat}</option>)}
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
          >
             <option>All Status</option>
             <option>Published</option>
             <option>Draft</option>
             <option>Low Stock</option>
             <option>Out of Stock</option>
          </select>
       </div>

       {/* Product List */}
       <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                   <th className="p-4"><input type="checkbox" className="rounded"/></th>
                   <th className="p-4">Product Name</th>
                   <th className="p-4">SKU</th>
                   <th className="p-4">Category</th>
                   <th className="p-4">Price</th>
                   <th className="p-4">Stock</th>
                   <th className="p-4">Status</th>
                   <th className="p-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredProducts.map(product => (
                   <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4"><input type="checkbox" className="rounded"/></td>
                      <td className="p-4">
                         <div className="flex items-center gap-3">
                            <img src={product.img} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                            <p className="font-bold text-slate-900 dark:text-white">{product.name}</p>
                         </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-500">{product.sku}</td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4 font-bold">₹{product.price}</td>
                      <td className="p-4">{product.stock} units</td>
                      <td className="p-4">
                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.status === 'Published' ? 'bg-green-100 text-green-700' :
                            product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                         }`}>
                            {product.status}
                         </span>
                      </td>
                      <td className="p-4 text-right">
                         <Link to={`/vendor/products/edit/${product.id}`} className="text-slate-400 hover:text-purple-600 p-1 inline-block"><span className="material-symbols-outlined">edit</span></Link>
                         <button className="text-slate-400 hover:text-red-600 p-1"><span className="material-symbols-outlined">delete</span></button>
                      </td>
                   </tr>
                ))}
                {filteredProducts.length === 0 && (
                    <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500">
                            No products found matching your search.
                        </td>
                    </tr>
                )}
             </tbody>
          </table>
       </div>
    </div>
  );
}