
import React, { useState } from 'react';
import { CartItem, AdminSettings, WhatsAppContact } from '../types';
import { formatCurrency } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
  settings: AdminSettings;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onClearCart, settings }) => {
  const [showContactSelection, setShowContactSelection] = useState(false);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = (contact?: WhatsAppContact) => {
    const detail = items.map(item => `- ${item.product.name} x${item.quantity} (${formatCurrency(item.product.price * item.quantity)})`).join('%0A');
    const message = `¡Hola! Me gustaría realizar un pedido de *${settings.companyName}*:%0A%0A${detail}%0A%0A*Total:* ${formatCurrency(total)}`;
    
    const number = contact ? contact.number : settings.whatsappNumber;
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
    setShowContactSelection(false);
  };

  const onComprarClick = () => {
    if (settings.whatsappContacts && settings.whatsappContacts.length > 0) {
      setShowContactSelection(true);
    } else {
      handleCheckout();
    }
  };

  const handleClearClick = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar toda tu bolsa de compras?')) {
      onClearCart();
    }
  };

  return (
    <>
      <div className={`fixed inset-0 z-50 bg-pink-900/10 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      
      <div className={`fixed right-4 top-4 bottom-4 w-full max-w-md glass-panel rounded-[2.5rem] z-50 shadow-2xl transform transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-[120%]'}`}>
        
        {/* Header */}
        <div className="p-8 border-b border-white/30 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-3xl font-serif text-pink-900">Tu Bolsa</h2>
            <p className="text-[10px] text-pink-400 uppercase tracking-widest font-bold mt-1">Joyas Seleccionadas</p>
          </div>
          <button onClick={onClose} className="p-2 glass-button rounded-full text-pink-400 hover:text-pink-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lista de Productos */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 relative custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-pink-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-pink-900 font-serif italic text-lg">Tu bolsa está vacía...</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="glass-card p-3 rounded-3xl flex gap-4 group hover:bg-white/40 transition-colors">
                <div className="w-20 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/50">
                  <img src={item.product.images[0]} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-sm font-bold text-pink-900 line-clamp-1">{item.product.name}</h3>
                    <p className="text-pink-500 text-xs font-black mt-1 tracking-tight">{formatCurrency(item.product.price)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center glass-panel rounded-full px-1 py-1">
                      <button onClick={() => onUpdateQuantity(item.product.id, -1)} className="w-6 h-6 flex items-center justify-center text-pink-900 font-bold hover:bg-white/50 rounded-full transition-colors">-</button>
                      <span className="text-[10px] font-black w-6 text-center text-pink-900">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.product.id, 1)} className="w-6 h-6 flex items-center justify-center text-pink-900 font-bold hover:bg-white/50 rounded-full transition-colors">+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer (Total y Botón) */}
        {items.length > 0 && (
          <div className="p-8 border-t border-white/30 space-y-4 shrink-0 bg-white/20">
            <div className="flex justify-between items-center">
              <div>
                <span className="uppercase text-[9px] font-black text-pink-400 tracking-widest">Total Estimado</span>
                <p className="text-3xl font-serif text-pink-900 leading-none mt-1">{formatCurrency(total)}</p>
              </div>
              
              <button 
                onClick={handleClearClick}
                className="px-4 py-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-all border border-red-100 shadow-sm active:scale-95"
              >
                Limpiar Bolsa
              </button>
            </div>
            
            <button 
              onClick={onComprarClick}
              className="w-full bg-pink-600/90 hover:bg-pink-700 text-white py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-pink-300/40 active:scale-95 backdrop-blur-sm"
            >
              Confirmar Pedido
            </button>
          </div>
        )}

        {/* Panel Checkout (Overlay) */}
        {showContactSelection && (
          <div className="absolute top-28 bottom-4 inset-x-4 z-50 glass-panel rounded-[2rem] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300 shadow-2xl backdrop-blur-xl border border-white/60">
            <h3 className="text-2xl font-serif text-pink-900 mb-2">Checkout</h3>
            <p className="text-[10px] text-pink-400 mb-6 font-black uppercase tracking-widest">Elige tu asesor personal</p>
            
            <div className="w-full space-y-3 max-h-[75%] overflow-y-auto pr-2 custom-scrollbar">
              {settings.whatsappContacts.map((contact, i) => (
                <button
                  key={i}
                  onClick={() => handleCheckout(contact)}
                  className="w-full glass-card p-4 rounded-2xl flex items-center justify-between hover:bg-white/80 transition-all active:scale-95 group"
                >
                  <div className="text-left">
                    <p className="text-xs font-black text-pink-900 uppercase tracking-widest">{contact.name}</p>
                    <p className="text-[9px] text-pink-400 font-bold mt-0.5">Asesor Verificado</p>
                  </div>
                  <div className="bg-[#25D366] p-2 rounded-full shadow-lg shadow-green-200">
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12.031 6.172c-2.32 0-4.518.892-6.193 2.512-3.418 3.3-3.418 8.651 0 11.951 1.1.1.6 3.1 3.5 2.1l2.693 2.541c.203.191.536.191.739 0l2.693-2.541c2.9 1 2.4-2 3.5-2.1 3.418-3.3 3.418-8.651 0-11.951-1.675-1.62-3.873-2.512-6.193-2.512z" /></svg>
                  </div>
                </button>
              ))}
              
              <button
                onClick={() => handleCheckout()}
                className="w-full glass-card p-4 rounded-2xl flex items-center justify-between hover:bg-white/80 transition-all active:scale-95"
              >
                <div className="text-left">
                  <p className="text-xs font-black text-pink-900 uppercase tracking-widest">Línea General</p>
                  <p className="text-[9px] text-pink-400 font-bold mt-0.5">Atención Rápida</p>
                </div>
                <div className="bg-pink-500 p-2 rounded-full shadow-lg shadow-pink-200">
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12.031 6.172c-2.32 0-4.518.892-6.193 2.512-3.418 3.3-3.418 8.651 0 11.951 1.1.1.6 3.1 3.5 2.1l2.693 2.541c.203.191.536.191.739 0l2.693-2.541c2.9 1 2.4-2 3.5-2.1 3.418-3.3 3.418-8.651 0-11.951-1.675-1.62-3.873-2.512-6.193-2.512z" /></svg>
                </div>
              </button>
            </div>
            
            <button 
              onClick={() => setShowContactSelection(false)} 
              className="mt-6 text-[9px] font-black text-pink-400 hover:text-pink-600 uppercase tracking-[0.2em] transition-colors"
            >
              Volver
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default CartDrawer;
