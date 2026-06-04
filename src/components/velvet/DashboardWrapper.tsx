'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser, getUserProfile } from '../../lib/velvet/supabase';
import { default as VelvetClientDashboard } from './ClientDashboard';
import { default as VelvetArtistDashboard } from './ArtistDashboard';

export default function DashboardWrapper() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const user = await getCurrentUser();
      if (user) {
        const profile = await getUserProfile(user.id);
        setRole(profile?.role || 'client');
      }
      setLoading(false);
    };
    checkRole();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded shadow-lg p-10 text-center border-2 border-dag-burgundy">
        <p className="text-gray-600 animate-pulse">Verificando permisos...</p>
      </div>
    );
  }

  // Renderiza el dashboard según el rol
  if (role === 'artist') {
    return <VelvetArtistDashboard />;
  }

  return <VelvetClientDashboard />;
}