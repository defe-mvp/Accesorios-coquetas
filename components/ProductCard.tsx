
import React, { useState } from 'react';
import { Product, UserMode } from '../types';
import { formatCurrency } from '../constants';

interface ProductCardProps {
  product: Product;
  mode: UserMode;
  onAddToCart: (p: Product) => void;
  onEdit: (p: Product) => void;
  onView: (p: Product) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, mode, onAddToCart, onEdit, onView, onDelete, compact = false }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  };

  return (
    <div 
      onClick={() => onView(product)}
      className={`glass-card rounded-[2rem] ${compact ? 'p-2' : 'p-3'} transition-all duration-500 hover:-translate-y-2 group flex flex-col h-full cursor-pointer relative overflow-hidden ${
        product.isOffer 
          ? 'border-yellow-300 shadow-[0_0_20px_rgba(253,224,71,0.3)] hover:shadow-[0_0_30px_rgba(253,224,71,0.5)]' 
          : 'hover:shadow-[0_20px_40px_-15px_rgba(255,192,203,0.3)]'
      }`}
    >
      {product.isOffer && (
        <div className={`absolute top-0 right-0 bg-yellow-400 text-yellow-900 ${compact ? 'text-[8px] px-2 py-0.5' : 'text-[10px] px-3 py-1'} font-black rounded-bl-2xl z-30 uppercase tracking-widest shadow-sm`}>
          Oferta
        </div>
      )}

      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-white/40">
        <img 
          src={product.images[activeImageIndex]} 
          alt={product.name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {product.images.length > 1 && (
          <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 z-10 ${compact ? 'scale-75' : ''}`}>
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
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className={`glass-panel ${compact ? 'px-2 py-1 text-[8px]' : 'px-4 py-2 text-[10px]'} font-black uppercase text-pink-900 tracking-widest rounded-full`}>Agotado</span>
          </div>
        )}

        {/* FIX: Botón de favoritos eliminado */}
      </div>

      <div className={`${compact ? 'px-2 pt-3 pb-2' : 'px-3 pt-5 pb-3'} flex flex-col flex-grow`}>
        <div className="flex justify-between items-center mb-1">
          <span className={`${compact ? 'text-[8px]' : 'text-[10px]'} font-black text-pink-400 uppercase tracking-widest opacity-80`}>{product.category}</span>
          {mode === UserMode.ADMIN && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button onClick={(e) => { e.stopPropagation(); onEdit(product); }} className="text-blue-400 hover:scale-110 transition-transform">✏️</button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(product.id); }} className="text-red-400 hover:scale-110 transition-transform">🗑️</button>
            </div>
          )}
        </div>
        
        <h3 className={`${compact ? 'text-base' : 'text-xl'} font-serif text-pink-900 mb-1 leading-tight line-clamp-1`}>{product.name}</h3>
        {!compact && <p className="text-pink-900/50 text-[11px] font-medium leading-relaxed line-clamp-2 mb-4 h-8">{product.description}</p>}
        
        <div className={`mt-auto flex items-center justify-between ${compact ? 'pt-2' : ''}`}>
          <div className="flex flex-col">
            {product.isOffer && product.originalPrice && (
              <span className={`${compact ? 'text-[10px]' : 'text-xs'} text-pink-400/70 line-through font-medium`}>
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            <span className={`${compact ? 'text-sm' : 'text-lg'} font-bold tracking-tight ${product.isOffer ? 'text-yellow-600' : 'text-pink-900'}`}>
              {formatCurrency(product.price)}
            </span>
          </div>
          {mode === UserMode.CLIENT && (
            <button 
              disabled={product.stock === 0}
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className={`bg-white/50 hover:bg-pink-500 hover:text-white text-pink-700 ${compact ? 'p-2' : 'p-3'} rounded-full transition-all duration-300 shadow-sm border border-white/60 active:scale-90 disabled:opacity-50 disabled:pointer-events-none z-10`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`${compact ? 'h-4 w-4' : 'h-5 w-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
