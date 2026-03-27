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
import { UsuarioWebAuthService } from '../services/usuario-web-auth.service';
import { ContextService } from '../services/context.service';

// URLs que nunca llevan Authorization ni pasan por el flujo de refresh
const AUTH_URLS = ['/auth/login', '/auth/refresh', '/auth-web/login', '/auth-web/register', '/auth-web/google', '/auth-web/refresh'];
// URLs públicas que no requieren token
const PUBLIC_URLS = ['/api/public/'];
// URLs que requieren token de usuario web
const WEB_USER_URLS = ['/api/portal/usuario/', '/api/auth-web/me'];

function isAuthUrl(url: string): boolean {
  return AUTH_URLS.some((path) => url.includes(path));
}

function isPublicUrl(url: string): boolean {
  return PUBLIC_URLS.some((path) => url.includes(path));
}

function addAuthHeader(req: HttpRequest<unknown>, token: string, contextService: ContextService): HttpRequest<unknown> {
  const isFormData = req.body instanceof FormData;
  const subdomain = contextService.getSubdomain();

  const headers: { [key: string]: string } = {
    Authorization: `Bearer ${token}`,
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
  };

  // Agregar X-Subdomain si existe en desarrollo local
  if (subdomain && subdomain !== 'www') {
    headers['X-Subdomain'] = subdomain;
  }

  return req.clone({
    setHeaders: headers,
  });
}

function handleRefreshFailure(authService: AuthService, router: Router): void {
  authService.isRefreshing = false;
  authService.logout();
  router.navigate(['/login']);
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const webAuthService = inject(UsuarioWebAuthService);
  const router = inject(Router);
  const contextService = inject(ContextService);

  // Rutas de auth y públicas: agregar subdominio pero sin token
  if (isAuthUrl(req.url) || isPublicUrl(req.url)) {
    const subdomain = contextService.getSubdomain();
    if (subdomain && subdomain !== 'www') {
      req = req.clone({
        setHeaders: { 'X-Subdomain': subdomain }
      });
    }
    return next(req);
  }

  // No es API: pasar sin modificar
  if (!req.url.includes('/api/')) {
    return next(req);
  }

  // Rutas de usuario web: usar token web
  if (WEB_USER_URLS.some(url => req.url.includes(url))) {
    const webToken = webAuthService.getToken();
    if (!webToken) {
      router.navigate(['/portal/login']);
      return EMPTY;
    }

    // Refresh proactivo para usuario web
    if (webAuthService.isTokenExpiringSoon(60)) {
      return webAuthService.refreshAccessToken().pipe(
        switchMap(response => {
          const newWebToken = webAuthService.getToken();
          return next(addAuthHeader(req, newWebToken || '', contextService));
        }),
        catchError(() => {
          webAuthService.logout();
          router.navigate(['/portal/login']);
          return EMPTY;
        })
      );
    }

    return next(addAuthHeader(req, webToken, contextService)).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          webAuthService.logout();
          router.navigate(['/portal/login']);
          return EMPTY;
        }
        return throwError(() => error);
      })
    );
  }

  // Rutas de usuario interno: usar token interno
  const token = authService.getToken();

  // Sin token en rutas privadas: redirigir a login
  if (!token) {
    authService.logout();
    router.navigate(['/login']);
    return EMPTY;
  }

  // Refresh proactivo: token vence en < 60s → renovar antes de enviar
  if (authService.isTokenExpiringSoon(60) && !authService.isRefreshing) {
    return refreshAndRetry(req, next, authService, router, contextService);
  }

  // Token válido: adjuntar y enviar
  return next(addAuthHeader(req, token, contextService)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return handleUnauthorized(req, next, authService, router, contextService);
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
  router: Router,
  contextService: ContextService
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
      switchMap((token) => next(addAuthHeader(req, token!, contextService)))
    );
  }

  return refreshAndRetry(req, next, authService, router, contextService);
}

function refreshAndRetry(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router,
  contextService: ContextService
) {
  authService.isRefreshing = true;
  authService.refreshTokenSubject.next(null);

  return authService.refreshAccessToken().pipe(
    switchMap((response) => {
      authService.isRefreshing = false;
      authService.refreshTokenSubject.next(response.token);
      return next(addAuthHeader(req, response.token, contextService));
    }),
    catchError((err) => {
      handleRefreshFailure(authService, router);
      return throwError(() => err);
    })
  );
}
