'use client';

import { useState } from 'react';
import { getSupabaseClient } from '../../lib/velvet/supabase';

export default function VelvetRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'artist' | 'client'>('client');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // El trigger de Supabase creará el perfil automáticamente
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { 
            full_name: fullName, 
            role: role 
          } 
        },
      });

      if (error) throw error;

      alert('Registro exitoso. El perfil se ha creado automáticamente.');
      window.location.href = '/velvet/login';
    } catch (err: any) {
      setError(err.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow-[0_20px_60px_rgba(128,0,32,0.3)] p-10 w-full max-w-md border-2 border-dag-burgundy mx-auto">
      <h1 className="text-dag-burgundy text-3xl font-extrabold uppercase text-center mb-2">
        DAG KLASSICAL
      </h1>
      <p className="text-center text-gray-600 mb-8">Crear Cuenta</p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block mb-2 text-gray-800 font-bold text-sm uppercase">Nombre Completo</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded text-base text-gray-800 bg-white focus:border-dag-burgundy focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-800 font-bold text-sm uppercase">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded text-base text-gray-800 bg-white focus:border-dag-burgundy focus:outline-none"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-800 font-bold text-sm uppercase">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded text-base text-gray-800 bg-white focus:border-dag-burgundy focus:outline-none"
            required
            autoComplete="new-password"
            minLength={6}
          />
          <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
        </div>

        <div>
          <label className="block mb-2 text-gray-800 font-bold text-sm uppercase">Soy</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'artist' | 'client')}
            className="w-full p-3 border-2 border-gray-200 rounded text-base text-gray-800 bg-white focus:border-dag-burgundy focus:outline-none"
          >
            <option value="client">Cliente / Coleccionista</option>
            <option value="artist">Artista</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-dag-burgundy text-white py-3 font-bold uppercase rounded hover:bg-red-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <a href="/velvet/login" className="text-dag-burgundy hover:underline text-sm">
          ¿Ya tienes cuenta? Inicia sesión
        </a>
      </div>
    </div>
  );
}