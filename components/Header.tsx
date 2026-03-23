
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
  onLoginClick: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onShowAllResults: (query: string) => void;
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ mode, cartCount, onOpenCart, onOpenMenu, isAdmin, onOpenSettings, onLogout, onLoginClick, products, onSelectProduct, onShowAllResults, onGoHome }) => {
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

  const allMatches = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredProducts = allMatches.slice(0, 4);

  const handleSelectProduct = (product: Product) => {
    onSelectProduct(product);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleShowAll = () => {
    onShowAllResults(searchQuery);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <header className="relative z-40 w-full bg-white border-b border-gray-200">
      <div className="w-full h-20 px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* Left: Logo & Mobile Menu */}
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={onOpenMenu}
            className="md:hidden p-2 -ml-2 text-gray-600 hover:text-pink-600 transition-colors"
            aria-label="Menú de categorías"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h10" />
            </svg>
          </button>
          
          <div className="flex flex-col cursor-pointer" onClick={onGoHome}>
            <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-pink-600 leading-none">Coquet@s</span>
          </div>
        </div>

        {/* Middle: Search Bar */}
        <div className="flex-1 max-w-2xl relative hidden sm:block mx-4 lg:mx-8" ref={searchRef}>
          <div className="relative flex items-center w-full">
            <input 
              type="text"
              placeholder="Estoy buscando..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery) {
                  handleShowAll();
                }
              }}
              className="w-full bg-gray-50 border border-gray-300 rounded-none py-2.5 pl-4 pr-24 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition-all"
            />
            <button 
              onClick={() => searchQuery ? handleShowAll() : null}
              className="absolute right-0 top-0 bottom-0 bg-pink-500 hover:bg-pink-600 text-white px-6 font-medium text-sm transition-colors flex items-center justify-center"
            >
              Buscar
            </button>
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="absolute right-24 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {showSuggestions && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-xl overflow-hidden z-50">
              {filteredProducts.length > 0 ? (
                <>
                  <ul className="max-h-60 overflow-y-auto py-2">
                    {filteredProducts.map(product => (
                      <li key={product.id}>
                        <button
                          onClick={() => handleSelectProduct(product)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover border border-gray-100" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 flex items-center justify-center border border-gray-200">
                              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-xs text-pink-600 font-bold">Gs. {product.price.toLocaleString('es-PY')}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                  {allMatches.length > 4 && (
                    <div className="border-t border-gray-100 p-2 bg-gray-50">
                      <button 
                        onClick={handleShowAll}
                        className="w-full text-center text-xs font-bold text-gray-600 hover:text-gray-900 py-2 uppercase tracking-wide"
                      >
                        Ver todos los resultados ({allMatches.length})
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No se encontraron productos.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Cart & Login */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <button 
            onClick={onOpenCart}
            className="relative p-2 hover:bg-gray-100 transition-colors group flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-pink-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>

          {isAdmin && mode === UserMode.ADMIN ? (
            <div className="flex items-center gap-3">
              <button onClick={onOpenSettings} className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Configuración</button>
              <button onClick={onLogout} className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">Salir</button>
            </div>
          ) : (
            <button onClick={onLoginClick} className="flex items-center gap-2 text-left group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div className="hidden sm:block">
                <p className="text-xs text-gray-500 leading-tight">Para funcionarios</p>
                <p className="text-sm font-medium text-gray-900 leading-tight group-hover:text-pink-600 transition-colors">Iniciar sesión</p>
              </div>
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile Search Bar (visible only on small screens) */}
      <div className="sm:hidden px-4 pb-4 w-full">
        <div className="relative flex items-center w-full">
          <input 
            type="text"
            placeholder="Estoy buscando..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery) {
                handleShowAll();
              }
            }}
            className="w-full bg-gray-50 border border-gray-300 rounded-none py-2 pl-4 pr-20 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
          />
          <button 
            onClick={() => searchQuery ? handleShowAll() : null}
            className="absolute right-0 top-0 bottom-0 bg-pink-500 hover:bg-pink-600 text-white px-4 font-medium text-sm transition-colors flex items-center justify-center"
          >
            Buscar
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
