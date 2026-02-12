
import React, { useState } from 'react';
import { AdminSettings, Category, WhatsAppContact } from '../types';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [newContact, setNewContact] = useState<WhatsAppContact>({ name: '', number: '' });

  if (!isOpen) return null;

  const handleAddCategory = async () => {
    if (!newCat.trim()) return;
    setIsProcessing(true);
    const { error } = await supabase.from('categorias').insert([{ nombre: newCat.trim() }]);
    if (error) {
      alert("Error: Ya existe esta categoría o hubo un fallo.");
    } else {
      setNewCat('');
      onRefreshCategories();
    }
    setIsProcessing(false);
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm('¿Eliminar esta categoría? Esto no borrará los productos, pero quedarán sin categoría asignada.')) {
      await supabase.from('categorias').delete().eq('id', id);
      onRefreshCategories();
    }
  };

  const handleCategoryImageUpload = async (catId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const fileName = `cat_${catId}_${Date.now()}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from('catalogo').upload(fileName, file);

    if (uploadData) {
      const { data: { publicUrl } } = supabase.storage.from('catalogo').getPublicUrl(uploadData.path);
      await supabase.from('categorias').update({ imagen_url: publicUrl }).eq('id', catId);
      onRefreshCategories();
    }
    setIsProcessing(false);
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.number) return;
    setData({
      ...data,
      whatsappContacts: [...data.whatsappContacts, newContact]
    });
    setNewContact({ name: '', number: '' });
  };

  const handleRemoveContact = (index: number) => {
    setData({
      ...data,
      whatsappContacts: data.whatsappContacts.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] my-auto overflow-hidden">
        {/* Header Fijo */}
        <div className="p-6 md:p-10 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h2 className="text-2xl md:text-3xl font-serif text-pink-900">Configuración</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-pink-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-grow overflow-y-auto p-6 md:p-10 space-y-10">
          {/* CATEGORIAS */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-pink-400 tracking-widest border-b border-pink-50 pb-3">Gestión de Categorías</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Nombre de nueva categoría..."
                className="flex-grow p-3 bg-pink-50 rounded-xl border-none outline-none text-pink-900 placeholder:text-pink-200"
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
              />
              <button 
                onClick={handleAddCategory}
                disabled={isProcessing}
                className="bg-pink-600 text-white px-5 rounded-xl font-bold hover:bg-pink-700 disabled:opacity-50"
              >
                +
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <label className="relative w-12 h-8 bg-pink-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-pink-200">
                      {cat.imagen_url ? (
                        <img src={cat.imagen_url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[10px] text-pink-300">Img</div>
                      )}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleCategoryImageUpload(cat.id, e)}
                        disabled={isProcessing}
                      />
                    </label>
                    <span className="text-sm font-bold text-gray-700">{cat.nombre}</span>
                  </div>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-300 hover:text-red-600 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-pink-400 tracking-widest border-b border-pink-50 pb-3">Contactos de WhatsApp</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Nombre Vendedor"
                  value={newContact.name}
                  onChange={e => setNewContact({...newContact, name: e.target.value})}
                  className="p-3 bg-pink-50 rounded-xl outline-none text-sm text-pink-900"
                />
                <input 
                  type="text" 
                  placeholder="Número (595...)"
                  value={newContact.number}
                  onChange={e => setNewContact({...newContact, number: e.target.value})}
                  className="p-3 bg-pink-50 rounded-xl outline-none text-sm text-pink-900"
                />
              </div>
              <button 
                onClick={handleAddContact}
                className="w-full py-2 bg-pink-100 text-pink-600 rounded-xl font-bold text-xs uppercase hover:bg-pink-200 transition-colors"
              >
                + Añadir Contacto
              </button>
              
              <div className="space-y-2">
                {data.whatsappContacts.map((contact, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{contact.name}</p>
                      <p className="text-[10px] text-gray-400">{contact.number}</p>
                    </div>
                    <button onClick={() => handleRemoveContact(idx)} className="text-red-300 hover:text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-pink-400 tracking-widest border-b border-pink-50 pb-3">Información de Negocio</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 ml-1">WhatsApp Principal (Legacy)</label>
                <input 
                  type="text" 
                  value={data.whatsappNumber}
                  onChange={e => setData({...data, whatsappNumber: e.target.value})}
                  className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-pink-100 transition-all text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 ml-1">Nombre de la Empresa</label>
                <input 
                  type="text" 
                  value={data.companyName}
                  onChange={e => setData({...data, companyName: e.target.value})}
                  className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-pink-100 transition-all text-sm"
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
        
        {/* Footer Fijo */}
        <div className="p-6 md:p-10 border-t border-pink-50 flex gap-4 shrink-0 bg-white">
          <button onClick={onClose} className="flex-1 py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors">Cancelar</button>
          <button onClick={() => onSave(data)} className="flex-[2] py-4 bg-pink-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-pink-100">Guardar Todo</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsModal;
