
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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="w-full bg-white rounded-sm border border-gray-200 p-6 md:p-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Thumbnails (Desktop) */}
        {product.images.length > 1 && (
          <div className="hidden md:flex flex-col gap-4 w-24 shrink-0">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-full aspect-square border-2 transition-all ${activeImage === idx ? 'border-pink-500' : 'border-gray-200 hover:border-pink-300'}`}
              >
                <img src={img} className="w-full h-full object-contain" alt={`${product.name} thumbnail ${idx + 1}`} />
              </button>
            ))}
          </div>
        )}

        {/* Center Column: Main Image */}
        <div className="flex-1 relative bg-white flex flex-col items-center justify-start">
          <div className="w-full aspect-square border border-gray-200 flex items-center justify-center p-4">
            <img 
              src={product.images[activeImage]} 
              className="w-full h-full object-contain" 
              alt={product.name}
            />
          </div>

          {/* Mobile Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex md:hidden gap-3 overflow-x-auto mt-4 w-full custom-scrollbar pb-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 aspect-square shrink-0 border-2 transition-all ${activeImage === idx ? 'border-pink-500' : 'border-gray-200'}`}
                >
                  <img src={img} className="w-full h-full object-contain" alt={`${product.name} thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="w-full md:w-1/3 flex flex-col">
          <button 
            onClick={onClose} 
            className="self-start mb-6 text-sm text-gray-500 hover:text-pink-600 flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </button>

          <div className="mb-6">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">{product.category}</span>
            <h1 className="text-2xl md:text-3xl font-serif text-gray-900 leading-tight mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <span className="text-3xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
              {product.stock > 0 ? (
                <span className="text-xs font-bold uppercase tracking-wider text-white bg-green-600 px-3 py-1 rounded-sm">En Stock</span>
              ) : (
                <span className="text-xs font-bold uppercase tracking-wider text-white bg-red-600 px-3 py-1 rounded-sm">Agotado</span>
              )}
            </div>
          </div>

          <div className="mb-8 prose prose-sm text-gray-600">
            <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">Descripción</h3>
            <p className="whitespace-pre-line">{product.description}</p>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-200">
            <button 
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              disabled={product.stock === 0}
              className={`w-full py-4 rounded-sm font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 ${
                product.stock > 0 
                  ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-sm hover:shadow-md' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
