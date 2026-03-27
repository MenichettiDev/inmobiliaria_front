import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UsuarioWebAuthService } from '../services/usuario-web-auth.service';

/**
 * Guard para proteger rutas que requieren autenticación de usuario web
 */
export const webAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(UsuarioWebAuthService);
  const router = inject(Router);

  if (authService.isLoggedInSync() && !authService.isTokenExpired()) {
    return true;
  }

  // Redirigir a login
  router.navigate(['/portal/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
