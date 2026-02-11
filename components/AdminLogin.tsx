
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-serif text-pink-900 text-center mb-2">🔐 Acceso Administrativo</h2>
        <p className="text-gray-400 text-xs text-center mb-8">Ingresa con tu cuenta de administrador de Supabase</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            className="w-full p-4 bg-pink-50 rounded-xl outline-none focus:ring-2 focus:ring-pink-200 transition-all"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full p-4 bg-pink-50 rounded-xl outline-none focus:ring-2 focus:ring-pink-200 transition-all"
            value={pass}
            onChange={e => setPass(e.target.value)}
            required
          />
          {error && (
            <div className="p-3 bg-red-50 text-red-500 text-xs rounded-lg text-center border border-red-100">
              {error}
            </div>
          )}
          <button className="w-full bg-pink-600 text-white p-4 rounded-xl font-bold hover:bg-pink-700 shadow-lg shadow-pink-100 transition-all transform active:scale-95">
            Entrar al Panel
          </button>
          <button type="button" onClick={onClose} className="w-full text-gray-400 text-sm hover:text-gray-600 transition-colors">
            Volver al catálogo
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
