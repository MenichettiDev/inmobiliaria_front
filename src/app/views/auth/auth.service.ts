import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RefreshResponse {
  status: number;
  message: string;
  token: string;
  refresh_token: string;
  expires_in: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'loggedInUser';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  loggedIn$ = this.loggedIn.asObservable();

  // Estado compartido para el interceptor (evitar múltiples refresh simultáneos)
  isRefreshing = false;
  refreshTokenSubject = new BehaviorSubject<string | null>(null);

  private apiBase = environment.apiUrl || 'http://localhost:1000/api';

  constructor(private http?: HttpClient) {}

  // Guardar token y datos del usuario
  saveAuthData(token: string, user: any, refreshToken?: string): void {
    const normalized = {
      id: user.id || null,
      idInmobiliaria: user.idInmobiliaria || user.id_inmobiliaria || null,
      nombre: user.nombre || '',
      apellido: '',
      email: user.email || '',
      dni: '',
      id_acceso: user.idRol || null,
      rolNombre: user.rolNombre || null,
      idEstado: user.idEstado || null,
      avatar: null,
      raw: user,
    };

    sessionStorage.setItem(this.TOKEN_KEY, token);
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(normalized));

    if (refreshToken) {
      sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }

    this.loggedIn.next(true);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getUser(): any | null {
    const userData = sessionStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  // Verificar si el token ha expirado
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }

  // Retorna true si el token expira en menos de X segundos (para refresh proactivo)
  isTokenExpiringSoon(thresholdSeconds = 60): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() >= exp - thresholdSeconds * 1000;
    } catch {
      return true;
    }
  }

  // Llama al backend para obtener nuevos tokens usando el refresh_token
  refreshAccessToken(): Observable<RefreshResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http!.post<RefreshResponse>(`${this.apiBase}/auth/refresh`, {
      refreshToken,
    }).pipe(
      tap((response) => {
        sessionStorage.setItem(this.TOKEN_KEY, response.token);
        sessionStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh_token);
      })
    );
  }

  logout(callBackend = false): void {
    const refreshToken = this.getRefreshToken();

    if (callBackend && refreshToken && this.http) {
      // Fire-and-forget: revocar en backend sin bloquear el logout local
      this.http
        .post(`${this.apiBase}/auth/logout`, { refreshToken })
        .subscribe({ error: () => {} });
    }

    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.loggedIn.next(false);
  }

  // Intenta recargar el perfil del backend si hay token pero falta user
  async ensureProfileLoaded(): Promise<boolean> {
    const token = this.getToken();
    if (!token || this.isTokenExpired()) return false;
    if (this.getUser()) return true;

    try {
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      if (this.http) {
        const profile = await firstValueFrom(
          this.http.get<any>(`${this.apiBase}/auth/me`, { headers })
        );
        this.saveAuthData(token, profile.usuario ?? profile);
        return true;
      } else {
        const res = await fetch(`${this.apiBase}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('no profile');
        const profile = await res.json();
        this.saveAuthData(token, profile.usuario ?? profile);
        return true;
      }
    } catch {
      this.logout();
      return false;
    }
  }

  getUserId(): number | null {
    const user = this.getUser();
    return user?.id ?? null;
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user?.rolNombre ?? null;
  }
}
