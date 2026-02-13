
import React, { useState } from 'react';
import { Product } from '../types';
import { formatCurrency } from '../constants';

interface Props {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

const ProductDetailView: React.FC<Props> = ({ product, onClose, onAddToCart }) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-pink-900/10 backdrop-blur-xl p-4 overflow-y-auto animate-in fade-in duration-300">
      <div className="glass-panel rounded-[3rem] w-full max-w-5xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
        
        {/* Galería Izquierda */}
        <div className="w-full md:w-1/2 relative bg-white/20 p-4 flex flex-col items-center justify-center">
          <button 
            onClick={onClose} 
            className="absolute top-6 left-6 z-10 p-3 glass-panel rounded-full text-pink-900 hover:text-pink-600 transition-transform active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="w-full aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 border border-white/50 shadow-sm">
            <img 
              src={product.images[activeImage]} 
              className="w-full h-full object-cover transition-transform duration-700" 
              alt={product.name}
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 w-full justify-center custom-scrollbar">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-pink-500 scale-105' : 'border-white/50 opacity-60'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Derecha */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col bg-white/40">
          <div className="mb-8">
            <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.3em] mb-4 block">{product.category}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-pink-900 leading-tight mb-4">{product.name}</h2>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-pink-900">{formatCurrency(product.price)}</span>
              {product.stock > 0 ? (
                <span className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-50 px-3 py-1 rounded-full border border-green-100">En Stock</span>
              ) : (
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">Agotado</span>
              )}
            </div>
          </div>

          <div className="flex-grow space-y-6">
            <div>
              <h4 className="text-[10px] font-black text-pink-300 uppercase tracking-widest mb-3">Descripción</h4>
              <p className="text-pink-900/70 leading-relaxed text-sm whitespace-pre-wrap">{product.description}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/30 mt-8">
            <button 
              disabled={product.stock === 0}
              onClick={() => { onAddToCart(product); onClose(); }}
              className="w-full bg-pink-600/90 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-pink-200 hover:bg-pink-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Agregar a la Bolsa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
