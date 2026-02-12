
import React, { useState } from 'react';
import { Product, UserMode } from '../types';
import { formatCurrency } from '../constants';

interface ProductCardProps {
  product: Product;
  mode: UserMode;
  onAddToCart: (p: Product) => void;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, mode, onAddToCart, onEdit, onDelete }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="glass-card rounded-[2rem] p-3 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,192,203,0.3)] group flex flex-col h-full">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-white/40">
        <img 
          src={product.images[activeImageIndex]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
            {product.images.map((_, i) => (
              <button 
                key={i} 
                onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i); }} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === activeImageIndex ? 'w-5 bg-white shadow-sm' : 'w-1.5 bg-white/60 hover:bg-white'}`} 
              />
            ))}
          </div>
        )}
        
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="glass-panel px-4 py-2 text-[10px] font-black uppercase text-pink-900 tracking-widest rounded-full">Agotado</span>
          </div>
        )}

        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 text-white hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="px-3 pt-5 pb-3 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest opacity-80">{product.category}</span>
          {mode === UserMode.ADMIN && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(product)} className="text-blue-400 hover:scale-110 transition-transform">✏️</button>
              <button onClick={() => onDelete(product.id)} className="text-red-400 hover:scale-110 transition-transform">🗑️</button>
            </div>
          )}
        </div>
        
        <h3 className="text-xl font-serif text-pink-900 mb-1 leading-tight">{product.name}</h3>
        <p className="text-pink-900/50 text-[11px] font-medium leading-relaxed line-clamp-2 mb-4 h-8">{product.description}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-pink-900 tracking-tight">{formatCurrency(product.price)}</span>
          {mode === UserMode.CLIENT && (
            <button 
              disabled={product.stock === 0}
              onClick={() => onAddToCart(product)}
              className="bg-white/50 hover:bg-pink-500 hover:text-white text-pink-700 p-3 rounded-full transition-all duration-300 shadow-sm border border-white/60 active:scale-90 disabled:opacity-50 disabled:pointer-events-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
