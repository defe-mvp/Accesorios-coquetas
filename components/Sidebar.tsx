
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
      
      <div className={`fixed left-0 top-0 bottom-0 w-80 bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider">Catálogo</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-2 custom-scrollbar">
          <button
            onClick={() => { onSelectCategory('Todos'); onClose(); }}
            className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors border-l-4 ${selectedCategory === 'Todos' ? 'border-pink-600 text-pink-600 bg-pink-50' : 'border-transparent text-gray-600 hover:text-pink-600 hover:bg-gray-50'}`}
          >
            VER TODO
          </button>

          {hasOffers && (
            <button
              onClick={() => { onSelectCategory('Ofertas'); onClose(); }}
              className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors border-l-4 flex items-center gap-2 ${selectedCategory === 'Ofertas' ? 'border-yellow-500 text-yellow-600 bg-yellow-50' : 'border-transparent text-gray-600 hover:text-yellow-600 hover:bg-gray-50'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 5a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0v-1H3a1 1 0 010-2h1V8a1 1 0 011-1zm5-5a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0v-1h-1a1 1 0 010-2h1V3a1 1 0 011-1zm0 5a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0v-1h-1a1 1 0 010-2h1V8a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              OFERTAS
            </button>
          )}

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { onSelectCategory(cat.nombre); onClose(); }}
              className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors border-l-4 ${selectedCategory === cat.nombre ? 'border-pink-600 text-pink-600 bg-pink-50' : 'border-transparent text-gray-600 hover:text-pink-600 hover:bg-gray-50'}`}
            >
              {cat.nombre.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
