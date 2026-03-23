
import React, { useState, useEffect, useCallback } from 'react';
import { Product, Category } from '../types';
import { supabase } from '../supabaseClient';
import Cropper from 'react-easy-crop';

interface ProductModalProps {
  product?: Product;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (p: any) => void;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: any,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = {
    width:
      Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height),
    height:
      Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height),
  };

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');

  if (!croppedCtx) {
    return null;
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // As a blob
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((file) => {
      resolve(file);
    }, 'image/webp', 0.9);
  });
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
  
  // Cropper state
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);

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

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setCroppingImage(reader.result as string);
      setEditingImageIndex(null);
    };
    
    // Reset input so the same file can be selected again if needed
    e.target.value = '';
  };

  const handleEditImage = (url: string, index: number) => {
    setCroppingImage(url);
    setEditingImageIndex(index);
  };

  const handleSaveCrop = async () => {
    if (!croppingImage || !croppedAreaPixels) return;

    setIsUploading(true);
    try {
      const croppedBlob = await getCroppedImg(croppingImage, croppedAreaPixels);
      if (!croppedBlob) throw new Error('Failed to crop image');

      const fileName = `${Date.now()}_cropped.webp`;
      
      const { data, error } = await supabase.storage.from('catalogo').upload(fileName, croppedBlob, {
        contentType: 'image/webp'
      });

      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage.from('catalogo').getPublicUrl(data.path);
        
        if (editingImageIndex !== null) {
          setFormData(prev => {
            const newImages = [...(prev.images || [])];
            newImages[editingImageIndex] = publicUrl;
            return { ...prev, images: newImages };
          });
        } else {
          setFormData(prev => ({
            ...prev,
            images: [...(prev.images || []), publicUrl]
          }));
        }
      }
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setIsUploading(false);
      setCroppingImage(null);
      setEditingImageIndex(null);
    }
  };

  const handleCancelCrop = () => {
    setCroppingImage(null);
    setEditingImageIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const inputClass = "w-full glass-input p-4 rounded-xl text-pink-900 placeholder:text-pink-300 outline-none focus:bg-white/60 transition-all text-sm font-medium";
  const labelClass = "block text-[10px] font-black uppercase text-pink-400 mb-2 ml-1 tracking-widest";

  if (croppingImage) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl flex flex-col h-[80vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-gray-900">Recortar Imagen (1:1)</h2>
            <button type="button" onClick={handleCancelCrop} className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-grow relative bg-gray-900">
            <Cropper
              image={croppingImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="p-6 border-t border-gray-200 flex gap-4 shrink-0 bg-gray-50">
            <button 
              type="button" 
              onClick={handleCancelCrop} 
              className="flex-1 py-3 text-gray-600 font-bold hover:text-gray-900 transition-colors text-sm uppercase tracking-widest"
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={handleSaveCrop}
              disabled={isUploading} 
              className="flex-[2] bg-pink-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-pink-700 active:scale-[0.98] transition-all disabled:opacity-50 text-sm uppercase tracking-widest"
            >
              {isUploading ? 'Guardando...' : 'Recortar y Guardar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => handleEditImage(url, i)} 
                      className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors"
                      title="Recortar imagen"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, images: formData.images?.filter((_, idx) => idx !== i)})} 
                      className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                      title="Eliminar imagen"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
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
