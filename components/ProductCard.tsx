
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
      className={`bg-white border border-gray-200 ${compact ? 'p-2' : 'p-4'} transition-all duration-300 hover:shadow-md group flex flex-row sm:flex-col h-full cursor-pointer relative overflow-hidden ${
        product.isOffer 
          ? 'border-yellow-300' 
          : ''
      }`}
    >
      {product.isOffer && (
        <div className={`absolute top-0 right-0 bg-yellow-400 text-yellow-900 ${compact ? 'text-[9px] px-2 py-0.5' : 'text-xs px-3 py-1'} font-bold z-30 uppercase tracking-wider`}>
          Oferta
        </div>
      )}

      <div className="relative w-1/3 sm:w-full shrink-0 aspect-square overflow-hidden bg-gray-50 sm:mb-4 mr-4 sm:mr-0">
        <img 
          src={product.images[activeImageIndex]} 
          alt={product.name} 
          loading="lazy"
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" 
        />
        
        {product.images.length > 1 && (
          <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 p-1 bg-white/80 backdrop-blur-sm z-10 ${compact ? 'scale-75' : ''}`}>
            {product.images.map((_, i) => (
              <button 
                key={i} 
                onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i); }} 
                className={`h-1.5 transition-all duration-300 ${i === activeImageIndex ? 'w-4 bg-gray-800' : 'w-1.5 bg-gray-400 hover:bg-gray-600'}`} 
              />
            ))}
          </div>
        )}
        
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-20">
            <span className={`bg-gray-900 text-white ${compact ? 'px-2 py-1 text-[9px]' : 'px-3 py-1.5 text-xs'} font-bold uppercase tracking-wider`}>Agotado</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow justify-center sm:justify-start min-w-0">
        <div className="flex justify-between items-start mb-1 sm:mb-2">
          <span className={`${compact ? 'text-[9px]' : 'text-xs'} font-semibold text-gray-500 uppercase tracking-wider truncate`}>{product.category}</span>
          {mode === UserMode.ADMIN && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 shrink-0 ml-2">
              <button onClick={(e) => { e.stopPropagation(); onEdit(product); }} className="text-blue-600 hover:text-blue-800 transition-colors">✏️</button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(product.id); }} className="text-red-600 hover:text-red-800 transition-colors">🗑️</button>
            </div>
          )}
        </div>
        
        <h3 className={`${compact ? 'text-sm' : 'text-base'} font-medium text-gray-900 mb-1 leading-snug line-clamp-2 hover:text-pink-600 transition-colors`}>{product.name}</h3>
        
        <div className={`mt-auto flex items-end justify-between pt-2 sm:pt-3`}>
          <div className="flex flex-col">
            {product.isOffer && product.originalPrice && (
              <span className={`${compact ? 'text-[10px]' : 'text-xs'} text-gray-400 line-through mb-0.5`}>
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            <span className={`${compact ? 'text-base' : 'text-lg'} font-bold ${product.isOffer ? 'text-red-600' : 'text-gray-900'}`}>
              {formatCurrency(product.price)}
            </span>
          </div>
          {mode === UserMode.CLIENT && (
            <button 
              disabled={product.stock === 0}
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className={`bg-gray-900 hover:bg-pink-600 text-white ${compact ? 'p-1.5' : 'p-2'} transition-colors disabled:opacity-50 disabled:pointer-events-none z-10 shrink-0 ml-2`}
              title="Agregar al carrito"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`${compact ? 'h-4 w-4' : 'h-5 w-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
