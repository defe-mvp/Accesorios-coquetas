
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
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-pink-50 group">
      <div className="relative aspect-[4/5] overflow-hidden bg-pink-50">
        <img src={product.images[activeImageIndex]} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {product.images.map((_, i) => (
              <button key={i} onClick={() => setActiveImageIndex(i)} className={`h-1.5 rounded-full transition-all ${i === activeImageIndex ? 'w-4 bg-pink-600' : 'w-1.5 bg-pink-200'}`} />
            ))}
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-gray-900 text-white px-4 py-1.5 text-xs font-bold uppercase rounded-full">Agotado</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] font-bold text-pink-500 uppercase">{product.category}</span>
          {mode === UserMode.ADMIN && (
            <div className="flex gap-2">
              <button onClick={() => onEdit(product)} className="text-blue-500 hover:text-blue-700">✏️</button>
              <button onClick={() => onDelete(product.id)} className="text-red-500 hover:text-red-700">🗑️</button>
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-serif text-pink-900 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-gray-500 text-xs italic mb-4 flex-grow line-clamp-2">{product.description}</p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-pink-50">
          <span className="text-lg font-bold text-pink-900">{formatCurrency(product.price)}</span>
          {mode === UserMode.CLIENT && (
            <button 
              disabled={product.stock === 0}
              onClick={() => onAddToCart(product)}
              className="bg-pink-600 text-white p-2.5 rounded-full hover:bg-pink-700 disabled:bg-gray-200 transition-all"
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
