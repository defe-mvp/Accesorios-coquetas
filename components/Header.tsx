
import React, { useState, useRef, useEffect } from 'react';
import { UserMode, Product } from '../types';

interface HeaderProps {
  mode: UserMode;
  cartCount: number;
  onOpenCart: () => void;
  onOpenMenu: () => void;
  isAdmin: boolean;
  onOpenSettings: () => void;
  onLogout: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const Header: React.FC<HeaderProps> = ({ mode, cartCount, onOpenCart, onOpenMenu, isAdmin, onOpenSettings, onLogout, products, onSelectProduct }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const handleSelectProduct = (product: Product) => {
    onSelectProduct(product);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <header className="sticky top-4 z-40 mx-auto max-w-6xl px-4 transition-all duration-300">
      <div className="glass-panel rounded-full h-20 px-4 sm:px-10 flex items-center justify-between shadow-lg shadow-pink-500/5 gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button 
            onClick={onOpenMenu}
            className="p-2 -ml-2 text-pink-900 hover:text-pink-600 transition-transform hover:scale-110 active:scale-95"
            aria-label="Menú de categorías"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h10" />
            </svg>
          </button>
          
          <div className="flex flex-col hidden md:flex">
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-pink-900 leading-none">Coquet@s</span>
          </div>
        </div>

        <div className="flex-1 max-w-md relative" ref={searchRef}>
          <div className="relative flex items-center w-full">
            <input 
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-white/50 border border-pink-200 rounded-full py-2 pl-4 pr-10 text-sm text-pink-900 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
            />
            {searchQuery ? (
              <button 
                onClick={clearSearch}
                className="absolute right-3 text-pink-400 hover:text-pink-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute right-3 text-pink-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>

          {showSuggestions && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-md border border-pink-100 rounded-2xl shadow-xl overflow-hidden z-50">
              {filteredProducts.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto py-2">
                  {filteredProducts.map(product => (
                    <li key={product.id}>
                      <button
                        onClick={() => handleSelectProduct(product)}
                        className="w-full text-left px-4 py-2 hover:bg-pink-50 flex items-center gap-3 transition-colors"
                      >
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-8 h-8 rounded-md object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-md bg-pink-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-pink-900 truncate">{product.name}</p>
                          <p className="text-xs text-pink-500 font-bold">Gs. {product.price.toLocaleString('es-PY')}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-sm text-pink-500">
                  No se encontraron productos.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-4 shrink-0">
          {isAdmin && mode === UserMode.ADMIN && (
            <div className="flex items-center gap-1 sm:gap-2 mr-1 sm:mr-2 border-r pr-2 sm:pr-3 border-pink-200/50">
              <button onClick={onOpenSettings} className="sm:hidden p-2 text-pink-500 hover:text-pink-700 transition-colors" title="Configuración">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button onClick={onLogout} className="sm:hidden p-2 text-red-400 hover:text-red-600 transition-colors" title="Salir">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
              <button onClick={onOpenSettings} className="hidden sm:block text-[10px] font-black tracking-wider text-pink-400 hover:text-pink-700 mr-3">CONFIG</button>
              <button onClick={onLogout} className="hidden sm:block text-[10px] font-black tracking-wider text-red-400 hover:text-red-600">SALIR</button>
            </div>
          )}

          <button 
            onClick={onOpenCart}
            className="relative p-2 sm:p-3 rounded-full hover:bg-white/40 transition-all hover:scale-105 active:scale-95 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-pink-900 group-hover:text-pink-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 sm:top-1.5 sm:right-1.5 bg-pink-500 text-white text-[9px] font-bold h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
