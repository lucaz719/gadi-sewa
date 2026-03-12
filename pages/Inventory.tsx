
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { useToast } from '../App';

const CATEGORIES = ['Engine Parts', 'Brakes', 'Lubricants', 'Electrical', 'Suspension', 'Tires', 'Body Parts', 'Other'];

const InventoryModal = ({ isOpen, onClose, onSave, item }: { isOpen: boolean, onClose: () => void, onSave: () => void, item?: any }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Engine Parts',
    desc: '',
    stock: 0,
    buyPrice: 0,
    sellPrice: 0,
    supplier: '',
    img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=150&h=150&fit=crop'
  });

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({
        name: '',
        sku: '',
        category: 'Engine Parts',
        desc: '',
        stock: 0,
        buyPrice: 0,
        sellPrice: 0,
        supplier: '',
        img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=150&h=150&fit=crop'
      });
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.saveInventoryItem({ ...formData, id: item?.id });
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#1e293b] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-lg">{item ? 'Edit Inventory Item' : 'Add New Item'}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-500 uppercase mb-1">Item Name</label>
              <input
                type="text" required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Bosch Fuel Pump"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase mb-1">SKU / Barcode</label>
              <input
                type="text" required
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500 font-mono uppercase"
                placeholder="SKU-12345"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase mb-1">Initial Stock</label>
              <input
                type="number" required
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase mb-1">Supplier</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Vendor Name"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase mb-1">Buy Price (₹)</label>
              <input
                type="number" required
                value={formData.buyPrice}
                onChange={e => setFormData({ ...formData, buyPrice: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase mb-1">Sell Price (₹)</label>
              <input
                type="number" required
                value={formData.sellPrice}
                onChange={e => setFormData({ ...formData, sellPrice: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-500 uppercase mb-1">Description</label>
              <textarea
                value={formData.desc}
                onChange={e => setFormData({ ...formData, desc: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-primary-500"
                rows={2}
                placeholder="Product details..."
              ></textarea>
            </div>
          </div>
          <div className="pt-4 border-t dark:border-slate-700 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
            <button type="submit" className="px-8 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95">
              {item ? 'Update Item' : 'Add to Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Inventory() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const loadItems = async () => {
    setItems(await db.getInventory());
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (id: number | string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await db.deleteInventoryItem(id);
      loadItems();
      showToast('success', 'Item removed from inventory');
    }
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalValue = items.reduce((acc, curr) => acc + (curr.buyPrice * curr.stock), 0);
  const lowStockCount = items.filter(i => i.stock > 0 && i.stock < 10).length;
  const outOfStockCount = items.filter(i => i.stock === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Inventory Dashboard</h1>
          <p className="text-slate-500 text-sm">Overview of your garage's inventory.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openAdd}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <span className="material-symbols-outlined">add</span>
            Add Item
          </button>
          <Link to="/marketplace" className="bg-slate-800 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all hover:opacity-90">
            <span className="material-symbols-outlined text-lg">shopping_cart</span>
            Marketplace
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Inventory Value</p>
          <p className="text-2xl font-black mt-1">₹{totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Low Stock</p>
              <p className="text-2xl font-black mt-1 text-yellow-600">{lowStockCount}</p>
            </div>
            <span className="material-symbols-outlined text-yellow-500">warning</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Out of Stock</p>
              <p className="text-2xl font-black mt-1 text-red-500">{outOfStockCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unique SKUs</p>
              <p className="text-2xl font-black mt-1">{items.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              placeholder="Search part name, SKU, brand..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
            />
          </div>
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
        >
          <option>All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4 font-bold text-slate-500 uppercase text-[10px]">Part Details</th>
                <th className="p-4 font-bold text-slate-500 uppercase text-[10px]">SKU</th>
                <th className="p-4 font-bold text-slate-500 uppercase text-[10px]">Category</th>
                <th className="p-4 font-bold text-slate-500 uppercase text-[10px] text-center">Stock Status</th>
                <th className="p-4 font-bold text-slate-500 uppercase text-[10px]">Buy / Sell Price</th>
                <th className="p-4 font-bold text-slate-500 uppercase text-[10px]">Supplier</th>
                <th className="p-4 font-bold text-slate-500 uppercase text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        <img src={item.img} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{item.desc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-[10px] font-bold text-slate-400 group-hover:text-primary-500 transition-colors uppercase">{item.sku}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">{item.category}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${item.stock >= 10 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        item.stock > 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                      {item.stock === 0 ? 'OUT OF STOCK' : item.stock < 10 ? 'LOW STOCK' : 'IN STOCK'} ({item.stock})
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-xs">
                      <p className="text-slate-400 line-through">₹{item.buyPrice}</p>
                      <p className="font-bold text-slate-900 dark:text-white">₹{item.sellPrice}</p>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{item.supplier || '-'}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-slate-400 hover:text-primary-600 rounded-lg transition-colors" title="Edit">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 rounded-lg transition-colors" title="Delete">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredItems.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <span className="material-symbols-outlined text-5xl text-slate-200 dark:text-slate-700 mb-2">inventory_2</span>
            <p className="font-medium">No inventory items found.</p>
            <button onClick={openAdd} className="mt-4 text-primary-600 font-bold hover:underline">Add your first item</button>
          </div>
        )}
      </div>

      <InventoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={loadItems}
        item={editingItem}
      />
    </div>
  );
}
