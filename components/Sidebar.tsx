
import React from 'react';
import { Category } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, categories, selectedCategory, onSelectCategory }) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      
      {/* Drawer */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex justify-between items-center border-b border-pink-50">
          <div>
            <h2 className="text-2xl font-serif text-pink-900">Catálogo</h2>
            <p className="text-[10px] uppercase tracking-widest text-pink-300 font-bold">Explora por colección</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-300 hover:text-pink-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {/* Opción Todos */}
          <button
            onClick={() => { onSelectCategory('Todos'); onClose(); }}
            className={`w-full relative h-20 rounded-2xl overflow-hidden group transition-all ${selectedCategory === 'Todos' ? 'ring-2 ring-pink-600' : 'hover:scale-[1.02]'}`}
          >
            <div className="absolute inset-0 bg-pink-900/40 group-hover:bg-pink-900/20 transition-colors z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-pink-900 opacity-60" />
            <div className="relative z-20 h-full flex items-center justify-center">
              <span className="text-white font-black uppercase tracking-[0.3em] text-sm">Ver Todo</span>
            </div>
          </button>

          {/* Categorías Dinámicas */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { onSelectCategory(cat.nombre); onClose(); }}
              className={`w-full relative h-20 rounded-2xl overflow-hidden group transition-all ${selectedCategory === cat.nombre ? 'ring-2 ring-pink-600 shadow-xl' : 'hover:scale-[1.02]'}`}
            >
              {cat.imagen_url ? (
                <img src={cat.imagen_url} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" alt={cat.nombre} />
              ) : (
                <div className="absolute inset-0 bg-pink-100" />
              )}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
              <div className="relative z-20 h-full flex items-center justify-center p-4">
                <span className="text-white font-bold uppercase tracking-widest text-xs text-center drop-shadow-md">{cat.nombre}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="p-8 border-t border-pink-50 text-center">
          <p className="text-[10px] text-pink-200 uppercase tracking-tighter font-medium">© 2025 Accesorios Coquetas</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
