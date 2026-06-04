import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  
  // Protección de rutas: Solo /velvet/dashboard requiere auth
  if (url.pathname.startsWith('/velvet/dashboard')) {
    
    // Supabase guarda la sesión en una cookie llamada sb-{REF}-auth-token
    // Tu ref es: iosaztavizodvrzcaysl
    const sessionCookie = context.cookies.get('sb-iosaztavizodvrzcaysl-auth-token');
    
    if (!sessionCookie) {
      // Usuario no autenticado -> Redirigir a login
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/velvet/login?redirect=' + encodeURIComponent(url.pathname)
        }
      });
    }
  }
  
  return next();
});