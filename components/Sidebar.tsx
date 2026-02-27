
import React from 'react';
import { Category } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
  hasOffers: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, categories, selectedCategory, onSelectCategory, hasOffers }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 z-[60] bg-pink-900/10 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      
      <div className={`fixed left-4 top-4 bottom-4 w-80 glass-panel rounded-[2.5rem] z-[70] shadow-2xl transform transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-[120%]'}`}>
        <div className="p-8 flex justify-between items-center border-b border-white/30">
          <div>
            <h2 className="text-3xl font-serif text-pink-900">Catálogo</h2>
            <p className="text-[10px] uppercase tracking-widest text-pink-400 font-bold mt-1">Explora por colección</p>
          </div>
          <button onClick={onClose} className="p-2 glass-button rounded-full text-pink-400 hover:text-pink-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <button
            onClick={() => { onSelectCategory('Todos'); onClose(); }}
            className={`w-full group relative h-24 rounded-[2rem] overflow-hidden transition-all duration-500 ${selectedCategory === 'Todos' ? 'ring-2 ring-pink-300 shadow-lg scale-[1.02]' : 'hover:scale-[1.02]'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-white opacity-60" />
            <div className="relative z-20 h-full flex flex-col items-center justify-center">
              <span className="text-pink-900 font-black uppercase tracking-[0.3em] text-xs">Ver Todo</span>
              <div className="h-0.5 w-8 bg-pink-300 mt-2 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          </button>

          {hasOffers && (
            <button
              onClick={() => { onSelectCategory('Ofertas'); onClose(); }}
              className={`w-full group relative h-24 rounded-[2rem] overflow-hidden transition-all duration-500 ${selectedCategory === 'Ofertas' ? 'ring-2 ring-yellow-400 shadow-lg scale-[1.02]' : 'hover:scale-[1.02]'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-white opacity-80" />
              <div className="relative z-20 h-full flex flex-col items-center justify-center">
                <span className="text-yellow-800 font-black uppercase tracking-[0.3em] text-xs flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 5a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0v-1H3a1 1 0 010-2h1V8a1 1 0 011-1zm5-5a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0v-1h-1a1 1 0 010-2h1V3a1 1 0 011-1zm0 5a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0v-1h-1a1 1 0 010-2h1V8a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Ofertas
                </span>
                <div className="h-0.5 w-8 bg-yellow-400 mt-2 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            </button>
          )}

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { onSelectCategory(cat.nombre); onClose(); }}
              className={`w-full group relative h-28 rounded-[2rem] overflow-hidden transition-all duration-500 ${selectedCategory === cat.nombre ? 'ring-2 ring-pink-300 shadow-lg scale-[1.02]' : 'hover:scale-[1.02]'}`}
            >
              {cat.imagen_url ? (
                <img src={cat.imagen_url} className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110" alt={cat.nombre} />
              ) : (
                <div className="absolute inset-0 bg-pink-50" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
              <div className="relative z-20 h-full flex flex-col items-center justify-end pb-4">
                <span className="text-pink-900 font-bold uppercase tracking-[0.2em] text-[10px] drop-shadow-sm">{cat.nombre}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="p-8 border-t border-white/30 text-center">
          <p className="text-[9px] text-pink-300 uppercase tracking-widest font-black">Coquetas Est. 2024</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
