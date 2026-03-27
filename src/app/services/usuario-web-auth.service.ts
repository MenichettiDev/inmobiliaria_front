import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UsuarioWeb {
  id: number;
  nombre: string;
  email: string;
  proveedorAuth: string;
  emailVerificado: boolean;
  creadoEn: string;
}

export interface AuthWebResponse {
  status: number;
  message: string;
  token: string;
  refresh_token: string;
  expires_in: number;
  usuario: UsuarioWeb;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioWebAuthService {
  private apiUrl = `${environment.apiUrl}/auth-web`;
  private webLoggedIn$ = new BehaviorSubject<boolean>(false);
  private loggedInUser$ = new BehaviorSubject<UsuarioWeb | null>(null);

  constructor(private http: HttpClient) {
    this.checkExistingSession();
  }

  /**
   * Verifica si hay una sesión existente en sessionStorage
   */
  private checkExistingSession(): void {
    const token = this.getToken();
    const user = this.getUser();

    if (token && user && !this.isTokenExpired()) {
      this.webLoggedIn$.next(true);
      this.loggedInUser$.next(user);
    }
  }

  /**
   * Registra un nuevo usuario web
   */
  register(nombre: string, email: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      nombre,
      email,
      password,
      confirmPassword
    });
  }

  /**
   * Login con email y contraseña
   */
  login(email: string, password: string): Observable<AuthWebResponse> {
    return this.http.post<AuthWebResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.token && response.usuario) {
            this.saveAuthData(response.token, response.refresh_token, response.usuario);
          }
        })
      );
  }

  /**
   * Login con Google OAuth
   */
  googleAuth(credential: string): Observable<AuthWebResponse> {
    return this.http.post<AuthWebResponse>(`${this.apiUrl}/google`, { credential })
      .pipe(
        tap(response => {
          if (response.token && response.usuario) {
            this.saveAuthData(response.token, response.refresh_token, response.usuario);
          }
        })
      );
  }

  /**
   * Guarda los datos de autenticación en sessionStorage
   */
  saveAuthData(token: string, refreshToken: string, usuario: UsuarioWeb): void {
    sessionStorage.setItem('web_token', token);
    sessionStorage.setItem('web_refresh_token', refreshToken);
    sessionStorage.setItem('web_user', JSON.stringify(usuario));
    this.webLoggedIn$.next(true);
    this.loggedInUser$.next(usuario);
  }

  /**
   * Obtiene el token JWT del sessionStorage
   */
  getToken(): string | null {
    return sessionStorage.getItem('web_token');
  }

  /**
   * Obtiene el refresh token del sessionStorage
   */
  getRefreshToken(): string | null {
    return sessionStorage.getItem('web_refresh_token');
  }

  /**
   * Obtiene el usuario logueado
   */
  getUser(): UsuarioWeb | null {
    const userStr = sessionStorage.getItem('web_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Observable de estado de login
   */
  isLoggedIn(): Observable<boolean> {
    return this.webLoggedIn$.asObservable();
  }

  /**
   * Verifica si el usuario está logueado (síncrono)
   */
  isLoggedInSync(): boolean {
    return this.webLoggedIn$.value;
  }

  /**
   * Observable del usuario logueado
   */
  getLoggedInUser(): Observable<UsuarioWeb | null> {
    return this.loggedInUser$.asObservable();
  }

  /**
   * Verifica si el token JWT ha expirado
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // convertir a milisegundos
      return Date.now() >= expirationTime;
    } catch (e) {
      return true;
    }
  }

  /**
   * Verifica si el token está por expirar (en menos de X segundos)
   */
  isTokenExpiringSoon(seconds: number = 60): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const now = Date.now();
      const timeLeft = expirationTime - now;
      return timeLeft < (seconds * 1000);
    } catch (e) {
      return true;
    }
  }

  /**
   * Refresca el token de acceso
   */
  refreshAccessToken(): Observable<AuthWebResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.http.post<AuthWebResponse>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          if (response.token) {
            sessionStorage.setItem('web_token', response.token);
            sessionStorage.setItem('web_refresh_token', response.refresh_token);
          }
        })
      );
  }

  /**
   * Obtiene el perfil del usuario autenticado
   */
  getProfile(): Observable<{ status: number; message: string; usuario: UsuarioWeb }> {
    return this.http.get<{ status: number; message: string; usuario: UsuarioWeb }>(
      `${this.apiUrl}/me`
    );
  }

  /**
   * Logout
   */
  logout(): void {
    sessionStorage.removeItem('web_token');
    sessionStorage.removeItem('web_refresh_token');
    sessionStorage.removeItem('web_user');
    this.webLoggedIn$.next(false);
    this.loggedInUser$.next(null);
  }
}
