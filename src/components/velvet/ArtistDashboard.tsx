'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient, getCurrentUser, getUserProfile } from '../../lib/velvet/supabase';
import { default as VelvetCalculator } from './Calculator';

export default function ArtistDashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);
  const supabase = getSupabaseClient();

  // 📊 Mock data (listo para conectar a tabla `music_cards` + `purchases`)
  const [publishedCards] = useState([
    { title: 'SCHUBERT', type: 'album', sold: 3, total: 25, price: 15 },
    { title: 'TONAL EPISODES', type: 'ep', sold: 7, total: 25, price: 12 },
  ]);

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
    return <div className="p-10 text-center text-white animate-pulse">Cargando panel de artista...</div>;
  }

  const totalSold = publishedCards.reduce((sum, c) => sum + c.sold, 0);
  const totalRevenue = publishedCards.reduce((sum, c) => sum + (c.sold * c.price), 0);

  return (
    <div className="bg-white rounded shadow-lg p-8 border-2 border-dag-burgundy text-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-dag-burgundy">
            Panel de Artista: {profile?.full_name || 'Artista'}
          </h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-gray-100 hover:bg-red-50 hover:text-dag-burgundy border border-gray-300 rounded text-sm font-bold uppercase transition-all"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray95 p-4 rounded border border-platinum">
          <p className="text-xs uppercase text-gray-500">Obras Publicadas</p>
          <p className="text-2xl font-bold text-dag-burgundy">{publishedCards.length}</p>
        </div>
        <div className="bg-gray95 p-4 rounded border border-platinum">
          <p className="text-xs uppercase text-gray-500">Ediciones Vendidas</p>
          <p className="text-2xl font-bold text-dag-burgundy">{totalSold}</p>
        </div>
        <div className="bg-gray95 p-4 rounded border border-platinum">
          <p className="text-xs uppercase text-gray-500">Ingresos Estimados</p>
          <p className="text-2xl font-bold text-dag-burgundy">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Listado de Music Cards */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4 uppercase tracking-wide">Mis Music Cards</h3>
        <div className="space-y-3">
          {publishedCards.map((card, i) => (
            <div key={i} className="flex justify-between items-center bg-gray95 p-4 rounded border border-platinum">
              <div>
                <p className="font-bold">{card.title}</p>
                <p className="text-xs text-gray-500 uppercase">{card.type} · ${card.price} base</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{card.sold}/{card.total} vendidas</p>
                <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className="h-2 bg-dag-burgundy rounded-full"
                    style={{ width: `${(card.sold / card.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calculadora Privada (Toggle) */}
      <div className="border-t border-gray-200 pt-6">
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="w-full bg-dag-burgundy text-white py-3 rounded font-bold uppercase hover:bg-red-800 transition-colors"
        >
          {showCalculator ? ' Ocultar Calculadora' : '🧮 Calcular Valor de Nueva Obra'}
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