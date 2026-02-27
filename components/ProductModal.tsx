
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
    category: '',
    isOffer: false,
    originalPrice: 0
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
        category: categories.length > 0 ? categories[0].nombre : '',
        isOffer: false,
        originalPrice: 0
      });
    }
  }, [product, categories]);

  // FIX: Función para convertir imagen a WebP
  const convertToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Conversion error'));
          }, 'image/webp', 0.8);
        };
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const webpBlob = await convertToWebP(file);
      const fileName = `${Date.now()}_${file.name.split('.')[0]}.webp`;
      
      const { data, error } = await supabase.storage.from('catalogo').upload(fileName, webpBlob, {
        contentType: 'image/webp'
      });

      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage.from('catalogo').getPublicUrl(data.path);
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), publicUrl]
        }));
      }
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const inputClass = "w-full glass-input p-4 rounded-xl text-pink-900 placeholder:text-pink-300 outline-none focus:bg-white/60 transition-all text-sm font-medium";
  const labelClass = "block text-[10px] font-black uppercase text-pink-400 mb-2 ml-1 tracking-widest";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-pink-900/10 backdrop-blur-md p-4 overflow-y-auto">
      <div className="glass-panel rounded-[2.5rem] w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] my-auto overflow-hidden">
        <div className="p-8 border-b border-white/40 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-3xl font-serif text-pink-900">{product ? 'Editar' : 'Nuevo'} Accesorio</h2>
            <p className="text-pink-400 text-xs mt-1 font-bold tracking-wide">Gestión de catálogo</p>
          </div>
          <button type="button" onClick={onClose} className="text-pink-300 hover:text-pink-600 transition-colors p-2 glass-button rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className={labelClass}>Nombre</label>
              <input 
                type="text" 
                placeholder="Ej: Aros de Gala" 
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className={inputClass} 
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Categoría</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
                className={inputClass}
                required
              >
                <option value="" disabled>Seleccionar...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.nombre}>{c.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className={labelClass}>Precio (Gs)</label>
              <input 
                type="number" 
                placeholder="0" 
                required 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})} 
                className={inputClass} 
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Stock</label>
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

          <div className="glass-panel p-4 rounded-xl border border-pink-200/50 bg-pink-50/30">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-bold text-pink-900 flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.isOffer || false} 
                  onChange={e => setFormData({...formData, isOffer: e.target.checked})} 
                  className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500 border-gray-300"
                />
                Producto en Oferta
              </label>
              {formData.isOffer && <span className="text-[10px] font-black uppercase text-pink-500 tracking-widest bg-pink-100 px-2 py-1 rounded-full">Activo</span>}
            </div>
            
            {formData.isOffer && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <div className="space-y-1">
                  <label className={labelClass}>Precio Original (Antes)</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={formData.originalPrice || 0} 
                    onChange={e => setFormData({...formData, originalPrice: parseInt(e.target.value) || 0})} 
                    className={inputClass} 
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Precio Oferta (Actual)</label>
                  <div className="text-xs text-pink-400 italic mt-2">
                    El precio principal del producto será el precio de oferta.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Descripción</label>
            <textarea 
              placeholder="Detalles del producto..." 
              rows={3} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className={`${inputClass} resize-none`} 
            />
          </div>

          <div className="space-y-3">
            <label className={labelClass}>Galería (Auto WebP)</label>
            <div className="flex flex-wrap gap-4">
              {formData.images?.map((url, i) => (
                <div key={i} className="relative w-24 h-24 group">
                  <img src={url} className="w-full h-full object-cover rounded-2xl border border-white/50 shadow-sm" />
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, images: formData.images?.filter((_, idx) => idx !== i)})} 
                    className="absolute -top-2 -right-2 bg-red-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md hover:bg-red-500 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 border-2 border-dashed border-pink-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-pink-50 transition-all text-pink-300 hover:text-pink-500">
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                <span className="text-2xl font-light">{isUploading ? '...' : '+'}</span>
              </label>
            </div>
          </div>
        </form>

        <div className="p-8 border-t border-white/40 flex gap-4 shrink-0 bg-white/10 backdrop-blur-sm">
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 py-4 text-pink-400 font-bold hover:text-pink-600 transition-colors text-xs uppercase tracking-widest"
          >
            Cancelar
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={isUploading} 
            className="flex-[2] bg-pink-500/90 text-white py-4 rounded-2xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 active:scale-[0.98] transition-all disabled:opacity-50 text-xs uppercase tracking-widest backdrop-blur-sm"
          >
            {product ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
