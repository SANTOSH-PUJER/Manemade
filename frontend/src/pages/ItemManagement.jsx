import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Edit2, Package, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { itemService, categoryService } from '../services/dataService';
import AdminLayout from '../components/layout/AdminLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { useToast } from '../context/ToastContext';

export default function ItemManagement() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  const normalizeItem = (item) => ({
    ...item,
    name: item.itemName,
    slug: item.itemSlug,
    description: item.shortDescription,
    image: item.itemImage,
    categoryName: item.categoryName,
    isAvailable: item.isAvailable,
  });

  const [newItem, setNewItem] = useState({
    name: '',
    slug: '',
    categoryName: '',
    description: '',
    imageUrl: '',
    price: 0,
    isVeg: true,
    isAvailable: true,
    spiceLevel: 1,
    deliveryTimeMinutes: 25,
    ingredients: '',
    tags: '',
    highlight: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [itemResp, catResp] = await Promise.all([
        itemService.getAll(),
        categoryService.getAll()
      ]);
      setItems((itemResp.data || []).map(normalizeItem));
      setCategories(catResp.data || []);
    } catch (err) {
      showToast({ title: 'Error', description: 'Failed to load data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItem({
        name: item.name,
        slug: item.slug,
        categoryName: item.categoryName,
        description: item.description || '',
        imageUrl: item.image || '',
        price: item.price,
        isVeg: item.isVeg,
        isAvailable: item.isAvailable,
        spiceLevel: item.spiceLevel || 1,
        deliveryTimeMinutes: item.deliveryTimeMinutes || 25,
        ingredients: item.ingredients?.join(', ') || '',
        tags: item.tags?.join(', ') || '',
        highlight: item.highlight || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.categoryName) return showToast({ title: 'Error', description: 'Please select a category.' });
    
    const finalItem = {
        itemName: newItem.name,
        itemSlug: newItem.slug || newItem.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        shortDescription: newItem.description,
        itemImage: newItem.imageUrl,
        price: newItem.price,
        isAvailable: newItem.isAvailable,
        category: { name: newItem.categoryName } 
    };

    try {
      if (editingItem) {
        await itemService.update(editingItem.id, finalItem);
        showToast({ title: 'Updated', description: 'Item modified successfully.', tone: 'success' });
      } else {
        await itemService.create(finalItem);
        showToast({ title: 'Success', description: 'Item added to inventory.', tone: 'success' });
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setNewItem({
        name: '',
        slug: '',
        categoryName: '',
        description: '',
        imageUrl: '',
        price: 0,
        isVeg: true,
        isAvailable: true,
        spiceLevel: 1,
        deliveryTimeMinutes: 25,
        ingredients: '',
        tags: '',
        highlight: ''
      });
      loadData();
    } catch (err) {
      showToast({ title: 'Error', description: `Failed to ${editingItem ? 'update' : 'create'} item.` });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await itemService.delete(id);
      showToast({ title: 'Deleted', description: 'Item removed.', tone: 'success' });
      loadData();
    } catch (err) {
      showToast({ title: 'Error', description: 'Failed to delete item.' });
    }
  };

  const filtered = items.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.categoryName && i.categoryName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12">
        <div className="space-y-1">
          <Badge variant="primary">Inventory Control</Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight leading-tight">Item Manager</h1>
        </div>
        <Button 
          icon={Plus} 
          className="w-full sm:w-auto"
          onClick={() => { setEditingItem(null); setNewItem({ name: '', slug: '', categoryName: '', description: '', imageUrl: '', price: 0, isVeg: true, isAvailable: true, spiceLevel: 1, deliveryTimeMinutes: 25, ingredients: '', tags: '', highlight: '' }); setIsModalOpen(true); }}
        >
          Add New Item
        </Button>
      </div>

      <Card className="overflow-hidden border-black/5 dark:border-white/5">
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search menu items..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 sm:h-auto bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 dark:bg-gray-900"
                />
            </div>
            <div className="text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-widest sm:px-4">
                Total: {filtered.length} Items
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Dish Detail</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Availability</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-800/50">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <img src={item.image} alt="" className="h-12 w-12 rounded-xl object-cover shadow-lg border-2 border-white dark:border-gray-700" />
                       <div>
                         <p className="font-black text-gray-900 dark:text-white">{item.name}</p>
                         <p className="text-[10px] font-bold text-gray-400 font-mono">ID: {item.id} • ₹{item.price}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <Badge variant="secondary" className="font-black px-3 py-1 rounded-lg bg-orange-500/5 text-orange-600">
                        {item.categoryName}
                     </Badge>
                  </td>
                  <td className="px-8 py-6">
                     {item.isAvailable ? (
                       <Badge variant="success" className="flex w-fit items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full font-black">
                          <CheckCircle size={12} /> Live
                       </Badge>
                     ) : (
                       <Badge variant="warning" className="flex w-fit items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-600 rounded-full font-black">
                          <XCircle size={12} /> Hidden
                       </Badge>
                     )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-orange-500 transition-colors"><Edit2 size={18} /></button>
                       <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl dark:bg-gray-800 my-auto max-h-[90vh] overflow-y-auto"
            >
              <div className="mb-6 sm:mb-8 flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">{editingItem ? 'Edit Menu Item' : 'New Menu Item'}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm font-bold">{editingItem ? `Modifying ${editingItem.name}` : 'Add a fresh dish to the platform.'}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-gray-100 flex items-center justify-center dark:hover:bg-gray-700">
                    <XCircle size={20} className="sm:size-[24px]" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid gap-6 sm:grid-cols-2">
                    <Input 
                        label="Item Name" 
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        required 
                    />
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-900 dark:text-white">Category</label>
                        <select 
                            value={newItem.categoryName}
                            onChange={(e) => setNewItem({ ...newItem, categoryName: e.target.value })}
                            className="w-full bg-white border border-black/10 rounded-2xl py-3 px-4 text-sm font-bold dark:bg-gray-800 dark:border-white/10"
                        >
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                 </div>

                 <div className="grid gap-6 sm:grid-cols-3">
                    <Input 
                        label="Slug (Auto-generated if empty)" 
                        placeholder="eg. classic-meals"
                        value={newItem.slug}
                        onChange={(e) => setNewItem({ ...newItem, slug: e.target.value })}
                    />
                    <Input 
                        label="Selling Price (₹)" 
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                        required 
                    />
                    <Input 
                        label="Delivery Time (Mins)" 
                        type="number"
                        value={newItem.deliveryTimeMinutes}
                        onChange={(e) => setNewItem({ ...newItem, deliveryTimeMinutes: Number(e.target.value) })}
                        required 
                    />
                 </div>

                 <Input 
                   label="Description" 
                   value={newItem.description}
                   onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                   required 
                 />

                 <div className="space-y-4">
                    <Input 
                      label="Main Image URL" 
                      placeholder="https://..."
                      icon={ImageIcon}
                      value={newItem.imageUrl}
                      onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                      required 
                    />
                    {newItem.imageUrl && (
                        <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-black/5 dark:border-white/5 shadow-inner">
                            <img src={newItem.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                             <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                                Live Preview
                             </div>
                        </div>
                    )}
                 </div>

                 <div className="grid gap-6 sm:grid-cols-2">
                    <Input 
                        label="Ingredients (comma separated)" 
                        placeholder="Ragi, Jaggery, Coconut..."
                        value={newItem.ingredients}
                        onChange={(e) => setNewItem({ ...newItem, ingredients: e.target.value })}
                    />
                    <Input 
                        label="Tags (comma separated)" 
                        placeholder="Healthy, Sweet, Lunch..."
                        value={newItem.tags}
                        onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                    />
                 </div>

                 <div className="flex items-center gap-8 pt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={newItem.isVeg} 
                            onChange={(e) => setNewItem({ ...newItem, isVeg: e.target.checked })}
                            className="h-5 w-5 rounded-lg border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm font-black group-hover:text-orange-500 transition-colors">Vegetarian</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={newItem.isAvailable} 
                            onChange={(e) => setNewItem({ ...newItem, isAvailable: e.target.checked })}
                            className="h-5 w-5 rounded-lg border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm font-black group-hover:text-orange-500 transition-colors">Instant Available</span>
                    </label>
                    <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-1">
                        <span className="text-sm font-black">Spice Level</span>
                        <div className="flex gap-1">
                            {[1, 2, 3].map(lvl => (
                                <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => setNewItem({ ...newItem, spiceLevel: lvl })}
                                    className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black transition-all ${newItem.spiceLevel === lvl ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-400 dark:bg-gray-900'}`}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>
                 </div>

                 <div className="flex gap-4 pt-6">
                    <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Discard</Button>
                    <Button type="submit" className="flex-[2]">{editingItem ? 'Update Dish' : 'Publish Item'}</Button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
