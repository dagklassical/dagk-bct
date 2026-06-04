import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import ws from 'ws';

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  // Usar PUBLIC_ prefix para variables expuestas al cliente
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase env vars missing. Check .env.local has PUBLIC_ prefix');
    // Fallback para desarrollo: no lanzar error que rompa el render
    return null as unknown as SupabaseClient;
  }

  client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      transport: ws as any,
    },
  });

  return client;
}

export async function getCurrentUser() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) { console.error('Error getting user:', error.message); return null; }
  return user;
}

export async function getUserProfile(userId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) { console.error('Error fetching profile:', error.message); return null; }
  return data;
}

export async function createProfileOnSignup(user: { 
  id: string; 
  email: string; 
  user_metadata?: { full_name?: string };
  role?: 'artist' | 'client';
}) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || null,
    role: user.role || 'client',
  }, { onConflict: 'id' });
  if (error) { console.error('Error creating profile:', error.message); throw error; }
}

export async function hasRole(userId: string, role: 'artist' | 'client' | 'admin'): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile?.role === role;
}