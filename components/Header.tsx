
import React from 'react';
import { UserMode } from '../types';

interface HeaderProps {
  mode: UserMode;
  cartCount: number;
  onOpenCart: () => void;
  isAdmin: boolean;
  onOpenSettings: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ mode, cartCount, onOpenCart, isAdmin, onOpenSettings, onLogout }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-serif font-bold tracking-tight text-pink-900">Accesorios Coquetas</span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-pink-400 font-semibold">Brilla con estilo</span>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && mode === UserMode.ADMIN && (
            <div className="flex items-center gap-2 mr-4 border-r pr-4 border-pink-100">
              <button 
                onClick={onOpenSettings}
                className="text-xs font-bold text-gray-500 hover:text-pink-600"
              >
                Configuración
              </button>
              <button 
                onClick={onLogout}
                className="text-xs font-bold text-red-400 hover:text-red-600 ml-2"
              >
                Salir
              </button>
            </div>
          )}

          <button 
            onClick={onOpenCart}
            className="relative p-2 text-pink-900 hover:text-pink-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-pink-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
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
