
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

  // Clases mejoradas según petición
  const inputClass = "w-full bg-white border border-gray-300 p-4 rounded-xl text-black placeholder:text-gray-200 focus:ring-2 focus:ring-pink-200 focus:border-pink-400 outline-none transition-all shadow-sm";
  const labelClass = "block text-xs font-bold uppercase text-gray-700 mb-2 ml-1 tracking-wider";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-6">
            <div>
              <h2 className="text-3xl font-serif text-pink-900">{product ? 'Editar' : 'Nuevo'} Producto</h2>
              <p className="text-gray-400 text-xs mt-1">Completa los detalles del accesorio</p>
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-pink-600 transition-colors p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className={labelClass}>Nombre del Accesorio</label>
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
              <label className={labelClass}>Precio (Guaraníes)</label>
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
              <label className={labelClass}>Cantidad en Stock</label>
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

          <div className="space-y-1">
            <label className={labelClass}>Descripción del Producto</label>
            <textarea 
              placeholder="Ej: Material acero quirúrgico, tamaño 2cm..." 
              rows={3} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className={`${inputClass} resize-none`} 
            />
          </div>

          <div className="space-y-3">
            <label className={labelClass}>Fotos del Producto</label>
            <div className="flex flex-wrap gap-4">
              {formData.images?.map((url, i) => (
                <div key={i} className="relative w-20 h-20 group">
                  <img src={url} className="w-full h-full object-cover rounded-xl border border-gray-200" />
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, images: formData.images?.filter((_, idx) => idx !== i)})} 
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-lg"
                  >
                    ×
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-pink-300 transition-all text-gray-400">
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                <span className="text-xl font-bold">{isUploading ? '...' : '+'}</span>
                <span className="text-[8px] font-bold uppercase mt-1">Subir</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isUploading} 
              className="flex-[2] bg-pink-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-pink-100 hover:bg-pink-700 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {product ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
