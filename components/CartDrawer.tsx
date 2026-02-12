
import React, { useState } from 'react';
import { CartItem, AdminSettings, WhatsAppContact } from '../types';
import { formatCurrency } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  settings: AdminSettings;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, settings }) => {
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

  return (
    <>
      <div className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-pink-50 flex justify-between items-center">
          <h2 className="text-2xl font-serif text-pink-900">Tu Carrito</h2>
          <button onClick={onClose} className="p-2 text-pink-400">✕</button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6 relative">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p>Tu bolsa está vacía.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4">
                <img src={item.product.images[0]} className="w-16 h-20 object-cover rounded bg-pink-50" />
                <div className="flex-grow">
                  <div className="flex justify-between font-bold text-pink-900">
                    <h3 className="text-sm line-clamp-1">{item.product.name}</h3>
                    <span className="text-sm">{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button onClick={() => onUpdateQuantity(item.product.id, -1)} className="px-2 border border-pink-100 rounded">-</button>
                    <span className="text-xs font-bold">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.product.id, 1)} className="px-2 border border-pink-100 rounded">+</button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Contact Selection Popover Overlay */}
          {showContactSelection && (
            <div className="absolute inset-0 z-10 bg-white/95 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm animate-in fade-in zoom-in">
              <h3 className="text-xl font-serif text-pink-900 mb-2">¿Con quién quieres hablar?</h3>
              <p className="text-xs text-pink-400 mb-6 font-medium">Contamos con varios asesores listos para ayudarte</p>
              
              <div className="w-full space-y-3 max-h-[60%] overflow-y-auto pr-2">
                {settings.whatsappContacts.map((contact, i) => (
                  <button
                    key={i}
                    onClick={() => handleCheckout(contact)}
                    className="w-full bg-white border-2 border-pink-100 p-4 rounded-2xl flex items-center justify-between hover:bg-pink-50 transition-all group"
                  >
                    <div className="text-left">
                      <p className="text-sm font-bold text-pink-900 group-hover:text-pink-600">{contact.name}</p>
                      <p className="text-[10px] text-pink-300 font-bold uppercase tracking-wider">WhatsApp Asesor</p>
                    </div>
                    <div className="bg-[#25D366] p-2 rounded-full shadow-sm">
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12.031 6.172c-2.32 0-4.518.892-6.193 2.512-3.418 3.3-3.418 8.651 0 11.951 1.1.1.6 3.1 3.5 2.1l2.693 2.541c.203.191.536.191.739 0l2.693-2.541c2.9 1 2.4-2 3.5-2.1 3.418-3.3 3.418-8.651 0-11.951-1.675-1.62-3.873-2.512-6.193-2.512z" /></svg>
                    </div>
                  </button>
                ))}
                
                {/* Fallback to default if needed */}
                {settings.whatsappNumber && (
                  <button
                    onClick={() => handleCheckout()}
                    className="w-full bg-pink-50 p-4 rounded-2xl flex items-center justify-between hover:bg-pink-100 transition-all group border-2 border-transparent"
                  >
                    <div className="text-left">
                      <p className="text-sm font-bold text-pink-900">Linea General</p>
                      <p className="text-[10px] text-pink-300 font-bold uppercase tracking-wider">Atención al cliente</p>
                    </div>
                    <div className="bg-pink-600 p-2 rounded-full shadow-sm">
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12.031 6.172c-2.32 0-4.518.892-6.193 2.512-3.418 3.3-3.418 8.651 0 11.951 1.1.1.6 3.1 3.5 2.1l2.693 2.541c.203.191.536.191.739 0l2.693-2.541c2.9 1 2.4-2 3.5-2.1 3.418-3.3 3.418-8.651 0-11.951-1.675-1.62-3.873-2.512-6.193-2.512z" /></svg>
                    </div>
                  </button>
                )}
              </div>
              
              <button 
                onClick={() => setShowContactSelection(false)} 
                className="mt-8 text-xs font-bold text-gray-400 hover:text-pink-600 uppercase tracking-widest"
              >
                Volver al Carrito
              </button>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-pink-50 border-t border-pink-100 space-y-4">
            <div className="flex justify-between items-center text-pink-900 font-bold">
              <span className="uppercase text-xs opacity-60">Subtotal</span>
              <span className="text-2xl font-serif">{formatCurrency(total)}</span>
            </div>
            <button 
              onClick={onComprarClick}
              className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95 transform"
            >
              <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24"><path d="M12.031 6.172c-2.32 0-4.518.892-6.193 2.512-3.418 3.3-3.418 8.651 0 11.951 1.1.1.6 3.1 3.5 2.1l2.693 2.541c.203.191.536.191.739 0l2.693-2.541c2.9 1 2.4-2 3.5-2.1 3.418-3.3 3.418-8.651 0-11.951-1.675-1.62-3.873-2.512-6.193-2.512z" /></svg>
              Comprar vía WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
