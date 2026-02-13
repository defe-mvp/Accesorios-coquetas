
import React from 'react';
import { Product, UserMode } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  mode: UserMode;
  onAddToCart: (p: Product) => void;
  onEdit: (p: Product) => void;
  onView: (p: Product) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
  isSortingByDefault: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  mode, 
  onAddToCart, 
  onEdit, 
  onView,
  onDelete, 
  onReorder,
  isSortingByDefault
}) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-pink-50/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-pink-200">
        <p className="text-pink-400 font-medium">No hay productos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
      {products.map((product) => (
        <div key={product.id} className="group relative">
          <ProductCard 
            product={product} 
            mode={mode} 
            onAddToCart={onAddToCart}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
          />
          
          {mode === UserMode.ADMIN && isSortingByDefault && (
            <div className="absolute top-4 left-4 flex flex-col gap-1 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => { e.stopPropagation(); onReorder(product.id, 'up'); }}
                className="bg-white/80 p-1.5 rounded-lg hover:bg-white text-pink-900 shadow-sm border border-pink-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onReorder(product.id, 'down'); }}
                className="bg-white/80 p-1.5 rounded-lg hover:bg-white text-pink-900 shadow-sm border border-pink-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
