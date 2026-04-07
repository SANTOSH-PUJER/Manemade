import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Edit2, ListTree } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../services/userService';
import AdminLayout from '../components/layout/AdminLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { useToast } from '../context/ToastContext';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '', imageUrl: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/category/all');
      setCategories(resp.data);
    } catch (err) {
      showToast({ title: 'Error', description: 'Failed to load categories.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setNewCategory({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      imageUrl: cat.image || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/category/${editingCategory.id}`, newCategory);
        showToast({ title: 'Updated', description: 'Category modified.', tone: 'success' });
      } else {
        await api.post('/category/create', newCategory);
        showToast({ title: 'Success', description: 'Category created.', tone: 'success' });
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      setNewCategory({ name: '', slug: '', description: '', imageUrl: '' });
      loadCategories();
    } catch (err) {
      showToast({ title: 'Error', description: `Failed to ${editingCategory ? 'update' : 'create'} category.` });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/category/${id}`);
      showToast({ title: 'Deleted', description: 'Category removed.', tone: 'success' });
      loadCategories();
    } catch (err) {
      showToast({ title: 'Error', description: 'Failed to delete category.' });
    }
  };

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-12">
        <div className="space-y-1">
          <Badge variant="primary">Menu Engine</Badge>
          <h1 className="font-display text-4xl font-black tracking-tight">Category Manager</h1>
        </div>
        <Button icon={Plus} onClick={() => { setEditingCategory(null); setNewCategory({ name: '', slug: '', description: '', imageUrl: '' }); setIsModalOpen(true); }}>New Category</Button>
      </div>

      <Card className="overflow-hidden border-black/5 dark:border-white/5">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search categories..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 dark:bg-gray-900"
                />
            </div>
            <div className="text-xs font-black text-gray-500 uppercase tracking-widest px-4">
                Total: {filtered.length}
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Category Name</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Slug</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filtered.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-800/50">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                          <ListTree size={18} />
                       </div>
                       <span className="font-black text-gray-900 dark:text-white">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-gray-500 dark:text-gray-400 font-mono text-xs">/{cat.slug}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <button onClick={() => handleEdit(cat)} className="p-2 text-gray-400 hover:text-orange-500 transition-colors"><Edit2 size={18} /></button>
                       <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-24 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl dark:bg-gray-800"
            >
              <div className="mb-8 space-y-1">
                <h3 className="text-2xl font-black tracking-tight">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                <p className="text-gray-500 text-sm font-bold">{editingCategory ? `Modifying ${editingCategory.name}` : 'Define a new menu group.'}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                 <Input 
                   label="Category Name" 
                   value={newCategory.name}
                   onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                   required 
                 />
                 <Input 
                   label="Slug" 
                   placeholder="e.g. breakfast-specials"
                   value={newCategory.slug}
                   onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                   required 
                 />
                 <Input 
                   label="Description" 
                   placeholder="Brief description of this category..."
                   value={newCategory.description}
                   onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                 />
                 <div className="space-y-4">
                    <Input 
                        label="Image URL" 
                        placeholder="https://images.unsplash.com/..."
                        value={newCategory.imageUrl}
                        onChange={(e) => setNewCategory({ ...newCategory, imageUrl: e.target.value })}
                    />
                    {newCategory.imageUrl && (
                        <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-black/5 dark:border-white/5">
                            <img src={newCategory.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <span className="text-[10px] font-black uppercase text-white tracking-widest px-2 py-1 bg-black/40 rounded-full">Live Preview</span>
                            </div>
                        </div>
                    )}
                 </div>
                 <div className="flex gap-4 pt-4">
                    <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="flex-[2]">{editingCategory ? 'Update Category' : 'Create Category'}</Button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
