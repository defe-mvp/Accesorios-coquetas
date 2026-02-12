
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
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full glass-input p-4 rounded-xl text-pink-900 placeholder:text-pink-300 outline-none focus:bg-white/60 transition-all text-sm"
            value={pass}
            onChange={e => setPass(e.target.value)}
            required
          />
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
