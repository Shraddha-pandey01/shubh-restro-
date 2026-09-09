import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import api from '../../services/api.js';

export const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Starters',
    imageUrl: '',
    isAvailable: true,
    isVeg: false,
    tastingNotes: '',
    winePairing: '',
  });
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/menu');
      if (res.success) {
        setItems(res.data);
      }
    } catch (err) {
      console.error('Failed to load menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Starters',
      imageUrl: '',
      isAvailable: true,
      isVeg: true,
      tastingNotes: '',
      winePairing: '',
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable,
      isVeg: item.isVeg,
      tastingNotes: item.tastingNotes || '',
      winePairing: item.winePairing || '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleToggleAvailability = async (item) => {
    try {
      const res = await api.patch(`/menu/${item._id}/availability`);
      if (res.success && res.data) {
        setItems((prev) =>
          prev.map((i) => (i._id === item._id ? res.data : i))
        );
      }
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to permanently remove this dish from the menu?')) {
      return;
    }
    try {
      const res = await api.delete(`/menu/${itemId}`);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i._id !== itemId));
      }
    } catch (err) {
      console.error('Failed to delete dish:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editingItem) {
        const res = await api.put(`/menu/${editingItem._id}`, payload);
        if (res.success && res.data) {
          setItems((prev) =>
            prev.map((i) => (i._id === editingItem._id ? res.data : i))
          );
          setModalOpen(false);
        }
      } else {
        const res = await api.post('/menu', payload);
        if (res.success && res.data) {
          setItems((prev) => [res.data, ...prev]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      setError(err.message || 'Error occurred while saving menu item.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout title="Menu Management">
      <div className="space-y-6">
        {/* Header action */}
        <div className="glass-panel p-4 flex justify-between items-center">
          <div className="font-label-caps text-xs text-primary font-semibold">
            {items.length} {items.length === 1 ? 'Dish' : 'Dishes'} in Degustation
          </div>
          <button
            onClick={openAddModal}
            className="font-label-caps text-xs bg-primary text-on-primary px-5 py-2.5 uppercase tracking-wider font-semibold hover:bg-primary-fixed flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Add New Dish
          </button>
        </div>

        {/* Menu Items Table */}
        {loading ? (
          <div className="py-24 text-center text-primary font-headline text-lg animate-pulse">
            RETRIEVING DISH INVENTORY...
          </div>
        ) : (
          <div className="glass-panel overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-high text-primary font-label-caps uppercase border-b border-primary/20">
                <tr>
                  <th className="py-4 px-6">Dish Preview</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Dietary</th>
                  <th className="py-4 px-6">Availability</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((it) => (
                  <tr key={it._id} className="hover:bg-surface-container transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={it.imageUrl}
                        alt={it.name}
                        className="w-12 h-12 object-cover border border-primary/20 flex-shrink-0"
                      />
                      <div>
                        <div className="font-headline text-sm text-on-surface font-semibold">
                          {it.name}
                        </div>
                        <div className="text-[11px] text-on-surface-variant/70 max-w-xs truncate">
                          {it.description}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-label-caps text-[11px] text-primary uppercase">
                      {it.category}
                    </td>
                    <td className="py-4 px-6 font-headline text-sm font-bold text-on-surface">
                      ₹{it.price}
                    </td>
                    <td className="py-4 px-6">
                      {it.isVeg ? (
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-800 uppercase font-label-caps flex items-center gap-1 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Veg
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-950 text-red-300 text-[10px] border border-red-800 uppercase font-label-caps flex items-center gap-1 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                          Non-Veg
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleAvailability(it)}
                        className={`font-label-caps text-[10px] px-3 py-1 uppercase tracking-wider transition-colors ${
                          it.isAvailable
                            ? 'bg-primary/20 text-primary border border-primary/40'
                            : 'bg-surface-container text-on-surface-variant/40 border border-white/10'
                        }`}
                      >
                        {it.isAvailable ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <button
                        onClick={() => openEditModal(it)}
                        className="font-label-caps text-[11px] text-primary hover:underline uppercase"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(it._id)}
                        className="font-label-caps text-[11px] text-error hover:underline uppercase"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Dish Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="max-w-2xl w-full glass-panel p-8 relative border-primary animate-fadeIn max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <span className="font-label-caps text-xs text-primary tracking-widest uppercase block mb-1">
              Culinary Composition
            </span>
            <h2 className="font-headline text-2xl text-on-surface mb-6">
              {editingItem ? 'Edit Degustation Dish' : 'Add New Gastronomic Item'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-error/10 border border-error text-error text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Paneer Tikka"
                    className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="280"
                    className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  >
                    {['Starters', 'Main Course', 'Rice & Biryani', 'Breads', 'South Indian', 'Snacks', 'Desserts', 'Beverages'].map((c) => (
                      <option key={c} value={c} className="bg-surface text-on-surface">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed culinary ingredients and preparation notes..."
                  className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                    Tasting Profile Notes
                  </label>
                  <input
                    type="text"
                    value={formData.tastingNotes}
                    onChange={(e) => setFormData({ ...formData, tastingNotes: e.target.value })}
                    placeholder="Smoky, mildly spicy and creamy with a delicious charred flavor..."
                    className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                    Pairing Suggestion (Beverage)
                  </label>
                  <input
                    type="text"
                    value={formData.winePairing}
                    onChange={(e) => setFormData({ ...formData, winePairing: e.target.value })}
                    placeholder="Masala Chai or Mango Lassi"
                    className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-label-caps text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isVeg}
                    onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  Vegetarian Preparation
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-label-caps text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  Available for Ordering
                </label>
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="font-label-caps text-xs border border-white/20 text-on-surface px-6 py-2.5 uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="font-label-caps text-xs bg-primary text-on-primary px-8 py-2.5 uppercase font-semibold hover:bg-primary-fixed disabled:opacity-50"
                >
                  {isSaving ? 'SAVING...' : editingItem ? 'UPDATE DISH' : 'SAVE TO MENU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default MenuManagement;
