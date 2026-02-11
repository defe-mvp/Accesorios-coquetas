
import React, { useState } from 'react';
import { AdminSettings, Category } from '../types';
import { supabase } from '../supabaseClient';

interface Props {
  isOpen: boolean;
  settings: AdminSettings;
  categories: Category[];
  onClose: () => void;
  onRefreshCategories: () => void;
  onSave: (s: AdminSettings) => void;
}

const AdminSettingsModal: React.FC<Props> = ({ isOpen, settings, categories, onClose, onRefreshCategories, onSave }) => {
  const [data, setData] = useState(settings);
  const [newCat, setNewCat] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);

  if (!isOpen) return null;

  const handleAddCategory = async () => {
    if (!newCat.trim()) return;
    setIsAddingCat(true);
    const { error } = await supabase.from('categorias').insert([{ nombre: newCat.trim() }]);
    if (error) {
      alert("Error: Ya existe esta categoría o hubo un fallo.");
    } else {
      setNewCat('');
      onRefreshCategories();
    }
    setIsAddingCat(false);
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm('¿Eliminar esta categoría? Esto no borrará los productos, pero quedarán sin categoría asignada.')) {
      await supabase.from('categorias').delete().eq('id', id);
      onRefreshCategories();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 my-8 shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-serif text-pink-900">Configuración</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-pink-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-10">
          {/* CATEGORIAS */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-pink-400 tracking-widest border-b border-pink-50 pb-3">Gestión de Categorías</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Nueva categoría..."
                className="flex-grow p-3 bg-pink-50 rounded-xl border-none outline-none text-pink-900 placeholder:text-pink-200"
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
              />
              <button 
                onClick={handleAddCategory}
                disabled={isAddingCat}
                className="bg-pink-600 text-white px-5 rounded-xl font-bold hover:bg-pink-700 disabled:opacity-50"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 group">
                  <span className="text-sm font-bold text-gray-600">{cat.nombre}</span>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-300 hover:text-red-600 text-xs">×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-pink-400 tracking-widest border-b border-pink-50 pb-3">Información de Negocio</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 ml-1">WhatsApp de Pedidos</label>
                <input 
                  type="text" 
                  value={data.whatsappNumber}
                  onChange={e => setData({...data, whatsappNumber: e.target.value})}
                  className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-pink-100 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 ml-1">Nombre de la Empresa</label>
                <input 
                  type="text" 
                  value={data.companyName}
                  onChange={e => setData({...data, companyName: e.target.value})}
                  className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-pink-100 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-pink-400 tracking-widest border-b border-pink-50 pb-3">Redes Sociales</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                value={data.instagramUrl || ''}
                onChange={e => setData({...data, instagramUrl: e.target.value})}
                className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none text-sm"
                placeholder="Instagram URL"
              />
              <input 
                type="text" 
                value={data.facebookUrl || ''}
                onChange={e => setData({...data, facebookUrl: e.target.value})}
                className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none text-sm"
                placeholder="Facebook URL"
              />
              <input 
                type="text" 
                value={data.tiktokUrl || ''}
                onChange={e => setData({...data, tiktokUrl: e.target.value})}
                className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none text-sm"
                placeholder="TikTok URL"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-12">
          <button onClick={onClose} className="flex-1 py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors">Cancelar</button>
          <button onClick={() => onSave(data)} className="flex-[2] py-4 bg-pink-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-pink-100">Guardar Todo</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsModal;
