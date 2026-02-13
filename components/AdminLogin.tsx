
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: pass,
    });

    if (error) {
      setError('Credenciales incorrectas: ' + error.message);
    } else {
      onLoginSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-pink-900/10 backdrop-blur-md p-6">
      <div className="w-full max-w-sm glass-panel rounded-[2.5rem] p-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-200">
            <span className="text-2xl">🔐</span>
          </div>
          <h2 className="text-2xl font-serif text-pink-900">Acceso Admin</h2>
          <p className="text-pink-400 text-xs font-bold mt-2 tracking-wide uppercase">Solo personal autorizado</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            className="w-full glass-input p-4 rounded-xl text-pink-900 placeholder:text-pink-300 outline-none focus:bg-white/60 transition-all text-sm"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="Contraseña" 
              className="w-full glass-input p-4 pr-12 rounded-xl text-pink-900 placeholder:text-pink-300 outline-none focus:bg-white/60 transition-all text-sm"
              value={pass}
              onChange={e => setPass(e.target.value)}
              required
            />
            <button 
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-300 hover:text-pink-500 transition-colors"
            >
              {showPass ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              )}
            </button>
          </div>
          {error && (
            <div className="p-3 bg-red-100/50 backdrop-blur-sm text-red-500 text-xs rounded-xl text-center border border-red-200 font-medium">
              {error}
            </div>
          )}
          <button className="w-full bg-pink-600/90 text-white p-4 rounded-xl font-bold hover:bg-pink-700 shadow-lg shadow-pink-200 transition-all transform active:scale-95 uppercase tracking-widest text-xs mt-4">
            Entrar
          </button>
          <button type="button" onClick={onClose} className="w-full text-pink-400 text-xs hover:text-pink-600 transition-colors mt-4 font-bold uppercase tracking-wider">
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
