import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@app/providers';

/**
 * Protege todas las rutas de la app autenticada.
 *
 * Mientras Firebase resuelve la sesión (cargando), devuelve null.
 * #keeptrip-splash (z-index:9999) cubre el viewport durante ese tiempo,
 * así que el usuario no ve nada en blanco.
 *
 * CRÍTICO para CLS = 0:
 *   AppScaffold debe montar UNA SOLA VEZ (desde AppShell).
 *   Si devolvemos DashboardSkeleton aquí, tendríamos AppScaffold#1
 *   (del skeleton) que se desmonta y AppScaffold#2 (de AppShell) que
 *   monta — dos nodos DOM distintos = shift de viewport completo = CLS 0.918.
 */
function AuthGuard() {
  const { usuario, cargando } = useAuth();

  if (cargando) return null;
  if (!usuario) return <Navigate to="/" replace />;

  return <Outlet />;
}

export default AuthGuard;
