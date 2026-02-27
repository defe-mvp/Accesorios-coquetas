
import React, { useState, useEffect } from 'react';
import { AdminSettings, Category, WhatsAppContact, CarouselImage } from '../types';
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
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchCarouselImages();
    }
  }, [isOpen]);

  const fetchCarouselImages = async () => {
    const { data } = await supabase.from('carrusel').select('*').order('orden', { ascending: true });
    if (data) setCarouselImages(data);
  };

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

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.number) return;
    
    setIsProcessing(true);
    const { error } = await supabase.from('vendedores').insert([{ nombre: newContact.name, numero: newContact.number }]);
    
    if (error) {
      alert("Error al agregar vendedor: " + error.message);
    } else {
      setNewContact({ name: '', number: '' });
      // Refresh contacts list - we need to fetch from DB or update local state
      // For simplicity, we can just update local state assuming success, but better to refetch.
      // Since we don't have a refetchContacts prop, we'll rely on parent refresh or just update local state optimistically
      // However, to get the ID we should probably just re-fetch in parent.
      // Let's update local state with a temp ID or just wait for parent refresh?
      // The best way is to update the local state to show it immediately.
      // But we need the ID for deletion.
      // Let's just trigger a save/refresh cycle or add a specific refresh prop for contacts.
      // Actually, let's just update the local state and let the parent handle the full refresh on save/close or add a refreshContacts callback.
      // Given the current structure, we'll modify onSave to also refresh settings.
      
      // Better approach: Fetch the new list here
      const { data } = await supabase.from('vendedores').select('*').order('nombre', { ascending: true });
      if (data) {
        setData({
          ...data,
          whatsappContacts: data.map(c => ({ id: c.id, name: c.nombre, number: c.numero }))
        });
      }
    }
    setIsProcessing(false);
  };

  const handleRemoveContact = async (id?: number) => {
    if (!id) return;
    if (confirm('¿Eliminar este vendedor?')) {
      setIsProcessing(true);
      await supabase.from('vendedores').delete().eq('id', id);
      
      // Refresh local list
      const { data: contacts } = await supabase.from('vendedores').select('*').order('nombre', { ascending: true });
      if (contacts) {
        setData({
          ...data,
          whatsappContacts: contacts.map(c => ({ id: c.id, name: c.nombre, number: c.numero }))
        });
      }
      setIsProcessing(false);
    }
  };

  const handleCarouselUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (carouselImages.length >= 10) {
      alert("Máximo 10 imágenes permitidas en el carrusel.");
      return;
    }

    setIsProcessing(true);
    const fileName = `carousel_${Date.now()}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from('catalogo').upload(fileName, file);

    if (uploadData) {
      const { data: { publicUrl } } = supabase.storage.from('catalogo').getPublicUrl(uploadData.path);
      await supabase.from('carrusel').insert([{ imagen_url: publicUrl, orden: carouselImages.length }]);
      fetchCarouselImages();
    }
    setIsProcessing(false);
  };

  const handleDeleteCarouselImage = async (id: number) => {
    if (confirm('¿Eliminar esta imagen del carrusel?')) {
      await supabase.from('carrusel').delete().eq('id', id);
      fetchCarouselImages();
    }
  };

  const inputClass = "w-full glass-input p-3 rounded-xl text-pink-900 placeholder:text-pink-300 outline-none focus:bg-white/60 transition-all text-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-pink-900/10 backdrop-blur-md p-4 overflow-y-auto">
      <div className="glass-panel rounded-[2.5rem] w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] my-auto overflow-hidden">
        {/* Header Fijo */}
        <div className="p-8 border-b border-white/40 flex justify-between items-center shrink-0">
          <h2 className="text-3xl font-serif text-pink-900">Configuración</h2>
          <button onClick={onClose} className="text-pink-300 hover:text-pink-600 transition-colors glass-button rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* CATEGORIAS */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-pink-400 tracking-widest border-b border-white/30 pb-3">Gestión de Categorías</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Nombre de nueva categoría..."
                className="flex-grow glass-input p-3 rounded-xl border-none outline-none text-pink-900 placeholder:text-pink-300 text-sm"
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
              />
              <button 
                onClick={handleAddCategory}
                disabled={isProcessing}
                className="bg-pink-500 text-white px-5 rounded-xl font-bold hover:bg-pink-600 disabled:opacity-50 shadow-md"
              >
                +
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between glass-card p-2 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <label className="relative w-12 h-10 bg-pink-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-pink-200">
                      {cat.imagen_url ? (
                        <img src={cat.imagen_url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[9px] text-pink-300 font-bold uppercase">Img</div>
                      )}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleCategoryImageUpload(cat.id, e)}
                        disabled={isProcessing}
                      />
                    </label>
                    <span className="text-sm font-bold text-pink-900">{cat.nombre}</span>
                  </div>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-400 hover:text-red-600 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-pink-400 tracking-widest border-b border-white/30 pb-3">Contactos de WhatsApp</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="Nombre Vendedor"
                  value={newContact.name}
                  onChange={e => setNewContact({...newContact, name: e.target.value})}
                  className={inputClass}
                />
                <input 
                  type="text" 
                  placeholder="Número (595...)"
                  value={newContact.number}
                  onChange={e => setNewContact({...newContact, number: e.target.value})}
                  className={inputClass}
                />
              </div>
              <button 
                onClick={handleAddContact}
                className="w-full py-3 bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 rounded-xl font-bold text-xs uppercase transition-colors border border-pink-200"
              >
                + Añadir Contacto
              </button>
              
              <div className="space-y-2">
                {data.whatsappContacts.map((contact, idx) => (
                  <div key={contact.id || idx} className="flex items-center justify-between glass-card p-3 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-pink-900">{contact.name}</p>
                      <p className="text-[10px] text-pink-400">{contact.number}</p>
                    </div>
                    <button onClick={() => handleRemoveContact(contact.id)} className="text-red-300 hover:text-red-500 p-1">
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
            <h3 className="text-xs font-black uppercase text-pink-400 tracking-widest border-b border-white/30 pb-3">Carrusel Principal</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-pink-300 block mb-2 ml-1">Intervalo (segundos)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="3"
                    placeholder="0 para desactivar auto-play"
                    value={data.carouselInterval || 0}
                    onChange={e => setData({...data, carouselInterval: parseInt(e.target.value) || 0})}
                    className={inputClass}
                  />
                  <span className="text-xs text-pink-400 italic whitespace-nowrap">Min: 3s (0 = estático)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {carouselImages.map((img, idx) => (
                  <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden group shadow-md border border-pink-100">
                    <img src={img.imagen_url} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => handleDeleteCarouselImage(img.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                      #{idx + 1}
                    </div>
                  </div>
                ))}
                
                {carouselImages.length < 10 && (
                  <label className="aspect-video rounded-xl border-2 border-dashed border-pink-200 flex flex-col items-center justify-center cursor-pointer hover:bg-pink-50/50 transition-colors group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-300 group-hover:text-pink-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-[10px] font-bold text-pink-300 mt-1 uppercase tracking-wider group-hover:text-pink-500">Subir 16:9</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleCarouselUpload}
                      disabled={isProcessing}
                    />
                  </label>
                )}
              </div>
              <p className="text-[10px] text-pink-400 italic text-center">
                * Las imágenes deben tener relación de aspecto 16:9 para mejor visualización.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-pink-400 tracking-widest border-b border-white/30 pb-3">Información de Negocio</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-pink-300 block mb-2 ml-1">WhatsApp Principal (Legacy)</label>
                <input 
                  type="text" 
                  value={data.whatsappNumber}
                  onChange={e => setData({...data, whatsappNumber: e.target.value})}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-pink-300 block mb-2 ml-1">Nombre de la Empresa</label>
                <input 
                  type="text" 
                  value={data.companyName}
                  onChange={e => setData({...data, companyName: e.target.value})}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-pink-400 tracking-widest border-b border-white/30 pb-3">Redes Sociales</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                value={data.instagramUrl || ''}
                onChange={e => setData({...data, instagramUrl: e.target.value})}
                className={inputClass}
                placeholder="Instagram URL"
              />
              <input 
                type="text" 
                value={data.facebookUrl || ''}
                onChange={e => setData({...data, facebookUrl: e.target.value})}
                className={inputClass}
                placeholder="Facebook URL"
              />
              <input 
                type="text" 
                value={data.tiktokUrl || ''}
                onChange={e => setData({...data, tiktokUrl: e.target.value})}
                className={inputClass}
                placeholder="TikTok URL"
              />
            </div>
          </div>
        </div>
        
        {/* Footer Fijo */}
        <div className="p-8 border-t border-white/40 flex gap-4 shrink-0 bg-white/20 backdrop-blur-sm">
          <button onClick={onClose} className="flex-1 py-4 text-pink-400 font-bold hover:text-pink-600 transition-colors text-xs uppercase tracking-widest">Cancelar</button>
          <button onClick={() => onSave(data)} className="flex-[2] py-4 bg-pink-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-pink-200 text-xs uppercase tracking-widest">Guardar Todo</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsModal;
