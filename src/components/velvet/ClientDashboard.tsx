'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient, getCurrentUser, getUserProfile } from '../../lib/velvet/supabase';
import { default as VelvetCalculator } from './Calculator';

export default function ClientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);
  const supabase = getSupabaseClient();

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        const userProfile = await getUserProfile(currentUser.id);
        setProfile(userProfile);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/velvet/login';
  };

  if (loading) {
    return (
      <div className="bg-white rounded shadow-lg p-10 text-center border-2 border-dag-burgundy">
        <p className="text-gray-600 animate-pulse">Cargando tu espacio...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-lg p-8 border-2 border-dag-burgundy">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-dag-burgundy">
            Bienvenido, {profile?.full_name || 'Coleccionista'}
          </h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-gray95 border border-gray-300 rounded-full text-xs font-bold uppercase tracking-wide text-gray-700">
            Rol: {profile?.role === 'artist' ? 'Artista' : 'Cliente'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-gray-100 hover:bg-red-50 hover:text-dag-burgundy border border-gray-300 rounded text-sm font-bold uppercase transition-all"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Placeholder: Colección */}
      <div className="space-y-6 mb-8">
        <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Tu Colección</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray95 border border-platinum rounded-lg p-4 flex flex-col items-center justify-center text-center h-48 transition-all hover:shadow-md hover:border-dag-burgundy/50">
            <span className="text-3xl mb-2">💿</span>
            <span className="text-sm font-bold text-gray-700">Music Card</span>
            <span className="text-xs text-gray-500">Edición #01</span>
          </div>
          <div className="bg-gray95 border border-platinum rounded-lg p-4 flex flex-col items-center justify-center text-center h-48 transition-all hover:shadow-md hover:border-dag-burgundy/50">
            <span className="text-3xl mb-2">🎼</span>
            <span className="text-sm font-bold text-gray-700">Music Card</span>
            <span className="text-xs text-gray-500">Edición #02</span>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center h-48">
            <span className="text-gray-400 text-sm">Espacio disponible</span>
          </div>
        </div>
      </div>

      {/* Calculadora Privada */}
      <div className="border-t border-gray-200 pt-6">
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="w-full bg-dag-burgundy text-white py-3 rounded font-bold uppercase hover:bg-red-800 transition-colors"
        >
          {showCalculator ? ' Ocultar Calculadora' : ' Calcular Valor de Compra'}
        </button>

        {showCalculator && (
          <div className="mt-6 p-4 bg-gray95 rounded border border-platinum">
            <VelvetCalculator />
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>DAG KLASSICAL © 2026. Integridad verificada via IPFS.</p>
      </div>
    </div>
  );
}