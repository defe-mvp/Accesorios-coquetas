
import React from 'react';
import { UserMode } from '../types';

interface HeaderProps {
  mode: UserMode;
  cartCount: number;
  onOpenCart: () => void;
  onOpenMenu: () => void;
  isAdmin: boolean;
  onOpenSettings: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ mode, cartCount, onOpenCart, onOpenMenu, isAdmin, onOpenSettings, onLogout }) => {
  return (
    <header className="sticky top-4 z-40 mx-auto max-w-6xl px-4 transition-all duration-300">
      <div className="glass-panel rounded-full h-20 px-6 sm:px-10 flex items-center justify-between shadow-lg shadow-pink-500/5">
        <div className="flex items-center gap-4 sm:gap-8">
          <button 
            onClick={onOpenMenu}
            className="p-2 -ml-2 text-pink-900 hover:text-pink-600 transition-transform hover:scale-110 active:scale-95"
            aria-label="Menú de categorías"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h10" />
            </svg>
          </button>
          
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-bold tracking-tight text-pink-900 leading-none">Coquetas</span>
            <span className="hidden sm:block text-[9px] tracking-[0.3em] uppercase text-pink-400 font-bold mt-1">Fine Jewelry</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center glass-input rounded-full px-4 py-2 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="bg-transparent border-none outline-none text-xs ml-2 text-pink-900 placeholder:text-pink-300 w-24 lg:w-40" 
            />
          </div>

          {isAdmin && mode === UserMode.ADMIN && (
            <div className="flex items-center gap-3 mr-2 border-r pr-5 border-pink-200/50 hidden sm:flex">
              <button onClick={onOpenSettings} className="text-[10px] font-black tracking-wider text-pink-400 hover:text-pink-700">CONFIG</button>
              <button onClick={onLogout} className="text-[10px] font-black tracking-wider text-red-400 hover:text-red-600">SALIR</button>
            </div>
          )}

          <button 
            onClick={onOpenCart}
            className="relative p-3 rounded-full hover:bg-white/40 transition-all hover:scale-105 active:scale-95 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-900 group-hover:text-pink-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-pink-500 text-white text-[9px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
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
