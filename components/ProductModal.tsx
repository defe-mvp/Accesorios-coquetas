
import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { supabase } from '../supabaseClient';

interface ProductModalProps {
  product?: Product;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (p: any) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, categories, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    images: [],
    category: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        price: 0,
        stock: 0,
        description: '',
        images: [],
        category: categories.length > 0 ? categories[0].nombre : ''
      });
    }
  }, [product, categories]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage.from('catalogo').upload(fileName, file);

    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage.from('catalogo').getPublicUrl(data.path);
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), publicUrl]
      }));
    }
    setIsUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const inputClass = "w-full bg-white border border-gray-200 p-4 rounded-xl text-black placeholder:text-gray-400 focus:ring-2 focus:ring-pink-100 focus:border-pink-300 outline-none transition-all";
  const labelClass = "block text-xs font-black uppercase text-pink-900/40 mb-2 ml-1 tracking-widest";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in duration-300">
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-serif text-pink-900">{product ? 'Editar' : 'Nuevo'} Accesorio</h2>
            <button type="button" onClick={onClose} className="text-gray-300 hover:text-pink-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelClass}>Nombre del Producto</label>
              <input 
                type="text" 
                placeholder="Ej: Aros de Cristal" 
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className={inputClass} 
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Categoría</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
                className={inputClass}
                required
              >
                <option value="" disabled>Seleccionar categoría</option>
                {categories.map(c => (
                  <option key={c.id} value={c.nombre}>{c.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelClass}>Precio (Gs.)</label>
              <input 
                type="number" 
                placeholder="0" 
                required 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})} 
                className={inputClass} 
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Stock (Cantidad)</label>
              <input 
                type="number" 
                placeholder="0" 
                required 
                value={formData.stock} 
                onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})} 
                className={inputClass} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Descripción Detallada</label>
            <textarea 
              placeholder="Describe el material, tamaño y detalles..." 
              rows={3} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className={`${inputClass} resize-none`} 
            />
          </div>

          <div>
            <label className={labelClass}>Galería de Imágenes</label>
            <div className="flex flex-wrap gap-4 mb-4">
              {formData.images?.map((url, i) => (
                <div key={i} className="relative w-24 h-24 group shadow-sm">
                  <img src={url} className="w-full h-full object-cover rounded-2xl border border-gray-100" />
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, images: formData.images?.filter((_, idx) => idx !== i)})} 
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                  >
                    ×
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 border-2 border-dashed border-pink-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-pink-50 hover:border-pink-400 transition-all text-pink-300">
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                <span className="text-3xl leading-none">{isUploading ? '...' : '+'}</span>
                <span className="text-[9px] font-black uppercase tracking-tighter mt-1">Subir</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-gray-50 text-gray-400 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
            >
              Descartar
            </button>
            <button 
              type="submit" 
              disabled={isUploading} 
              className="flex-[2] bg-pink-600 text-white py-4 px-8 rounded-2xl font-bold shadow-xl shadow-pink-100 hover:bg-pink-700 active:scale-95 transition-all"
            >
              {product ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
