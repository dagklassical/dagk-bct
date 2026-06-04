'use client';

import { useState } from 'react';
import { getSupabaseClient, createProfileOnSignup } from '../../lib/velvet/supabase';

export default function VelvetLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      window.location.href = '/velvet/dashboard';
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow-[0_20px_60px_rgba(128,0,32,0.3)] p-10 w-full max-w-md border-2 border-dag-burgundy mx-auto">
      <h1 className="text-dag-burgundy text-3xl font-extrabold uppercase text-center mb-2">
        DAG KLASSICAL
      </h1>
      <p className="text-center text-gray-600 mb-8">Iniciar Sesión</p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
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
            autoComplete="current-password"
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-dag-burgundy text-white py-3 font-bold uppercase rounded hover:bg-red-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <a href="/velvet/register" className="text-dag-burgundy hover:underline text-sm">
          ¿No tienes cuenta? Regístrate
        </a>
      </div>

      <div className="mt-4 text-center">
        <a href="/" className="text-gray-600 hover:underline text-sm">
          ← Volver al inicio
        </a>
      </div>
    </div>
  );
}