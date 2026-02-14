
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { formatCurrency } from '../constants';

interface Props {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

const ProductDetailView: React.FC<Props> = ({ product, onClose, onAddToCart }) => {
  const [activeImage, setActiveImage] = useState(0);

  // Bloquear el scroll del body al montar el componente
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-pink-900/30 backdrop-blur-xl md:p-4 animate-in fade-in duration-300">
      <div className="glass-panel w-full h-[95vh] md:h-auto md:max-h-[90vh] md:w-full md:max-w-5xl rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl flex flex-col md:flex-row relative overflow-hidden bg-white/60">
        
        {/* Botón Cerrar - Flotante para asegurar visibilidad */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 p-2 glass-button rounded-full text-pink-900 hover:text-pink-600 transition-transform active:scale-90 bg-white/50 backdrop-blur-md shadow-sm border border-white/40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Contenedor principal con scroll: 
            En móvil: overflow-y-auto permite scrollear toda la ficha (imagen + texto).
            En desktop: overflow-hidden oculta el scroll global del modal, y usamos scroll interno en la columna derecha.
        */}
        <div className="flex flex-col md:flex-row w-full h-full overflow-y-auto md:overflow-hidden custom-scrollbar">
          
          {/* Columna Izquierda (Imágenes) */}
          <div className="w-full md:w-1/2 relative bg-white/30 p-4 pt-16 md:pt-4 flex flex-col items-center justify-center shrink-0">
            <div className="w-full max-w-sm aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 border border-white/50 shadow-sm mx-auto">
              <img 
                src={product.images[activeImage]} 
                className="w-full h-full object-cover transition-transform duration-700" 
                alt={product.name}
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 w-full justify-center custom-scrollbar px-4">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? 'border-pink-500 scale-105' : 'border-white/50 opacity-60'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columna Derecha (Info) */}
          <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col bg-white/40 md:overflow-y-auto custom-scrollbar">
            <div className="mb-6 md:mb-8">
              <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.3em] mb-4 block">{product.category}</span>
              <h2 className="text-3xl md:text-5xl font-serif text-pink-900 leading-tight mb-4">{product.name}</h2>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl md:text-3xl font-bold text-pink-900">{formatCurrency(product.price)}</span>
                {product.stock > 0 ? (
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-50 px-3 py-1 rounded-full border border-green-100">En Stock</span>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">Agotado</span>
                )}
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <h4 className="text-[10px] font-black text-pink-300 uppercase tracking-widest mb-3">Descripción</h4>
                <p className="text-pink-900/70 leading-relaxed text-sm whitespace-pre-wrap">{product.description}</p>
              </div>
            </div>

            {/* Espaciador y Botón sticky en desktop o normal en móvil */}
            <div className="mt-auto pt-4 md:pt-8 border-t border-white/30 pb-safe md:pb-0">
              <button 
                disabled={product.stock === 0}
                onClick={() => { onAddToCart(product); onClose(); }}
                className="w-full bg-pink-600/90 text-white py-4 md:py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-pink-200 hover:bg-pink-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Agregar a la Bolsa
              </button>
            </div>
            
            {/* Espacio extra al final para asegurar que el contenido no quede pegado al borde en móviles */}
            <div className="h-8 md:hidden"></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
