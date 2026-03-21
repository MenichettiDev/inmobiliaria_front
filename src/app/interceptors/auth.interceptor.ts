import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import {
  catchError,
  throwError,
  switchMap,
  filter,
  take,
  EMPTY,
} from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../app/views/auth/auth.service';

// URLs que nunca llevan Authorization ni pasan por el flujo de refresh
const AUTH_URLS = ['/auth/login', '/auth/refresh'];

function isAuthUrl(url: string): boolean {
  return AUTH_URLS.some((path) => url.includes(path));
}

function addAuthHeader(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  const isFormData = req.body instanceof FormData;
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    },
  });
}

function handleRefreshFailure(authService: AuthService, router: Router): void {
  authService.isRefreshing = false;
  authService.logout();
  router.navigate(['/login']);
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Pasar sin modificar las rutas de auth
  if (!req.url.includes('/api/') || isAuthUrl(req.url)) {
    return next(req);
  }

  const token = authService.getToken();

  // Sin token: redirigir a login
  if (!token) {
    authService.logout();
    router.navigate(['/login']);
    return EMPTY;
  }

  // Refresh proactivo: token vence en < 60s → renovar antes de enviar
  if (authService.isTokenExpiringSoon(60) && !authService.isRefreshing) {
    return refreshAndRetry(req, next, authService, router);
  }

  // Token válido: adjuntar y enviar
  return next(addAuthHeader(req, token)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return handleUnauthorized(req, next, authService, router);
      }
      return throwError(() => error);
    })
  );
};

/**
 * Llama al endpoint /auth/refresh y reintenta la request original.
 * Maneja múltiples requests concurrentes: solo hace UN refresh y las demás esperan.
 */
function handleUnauthorized(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
) {
  if (!authService.getRefreshToken()) {
    handleRefreshFailure(authService, router);
    return EMPTY;
  }

  if (authService.isRefreshing) {
    // Ya hay un refresh en curso → esperar el nuevo token y reintentar
    return authService.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next(addAuthHeader(req, token!)))
    );
  }

  return refreshAndRetry(req, next, authService, router);
}

function refreshAndRetry(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
) {
  authService.isRefreshing = true;
  authService.refreshTokenSubject.next(null);

  return authService.refreshAccessToken().pipe(
    switchMap((response) => {
      authService.isRefreshing = false;
      authService.refreshTokenSubject.next(response.token);
      return next(addAuthHeader(req, response.token));
    }),
    catchError((err) => {
      handleRefreshFailure(authService, router);
      return throwError(() => err);
    })
  );
}
