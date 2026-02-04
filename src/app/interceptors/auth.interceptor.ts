import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../app/views/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (req.url.includes('/api/') && !req.url.includes('/auth/login')) {
        const token = authService.getToken();

        if (token && !authService.isTokenExpired()) {

            const isFormData = req.body instanceof FormData;

            const authReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' })
                }
            });

            return next(authReq).pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        authService.logout();
                        router.navigate(['/login']);
                    }
                    return throwError(() => error);
                })
            );
        }

        authService.logout();
        router.navigate(['/login']);
        return throwError(() => new Error('No hay token válido'));
    }

    return next(req);
};
