import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PropiedadFavorita {
  id: number;
  idPropiedad: number;
  creadoEn: string;
  propiedadTitulo: string;
  propiedadDireccion: string;
  propiedadPrecio?: number;
  propiedadImageUrl?: string;
}

export interface Consulta {
  id: number;
  nombreCompleto: string;
  email?: string;
  telefono?: string;
  mensaje?: string;
  estadoNombre: string;
  propiedadTitulo: string;
  creadoEn: string;
  actualizadoEn: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortalService {
  private apiUrl = `${environment.apiUrl}/portal/usuario`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene los favoritos del usuario web autenticado
   */
  getFavoritos(): Observable<{ status: number; message: string; data: PropiedadFavorita[] }> {
    return this.http.get<{ status: number; message: string; data: PropiedadFavorita[] }>(
      `${this.apiUrl}/favoritos`
    );
  }

  /**
   * Agrega o remueve un favorito (toggle)
   */
  toggleFavorito(propiedadId: number): Observable<{ status: number; message: string; isFavorito: boolean }> {
    return this.http.post<{ status: number; message: string; isFavorito: boolean }>(
      `${this.apiUrl}/favoritos/${propiedadId}`,
      {}
    );
  }

  /**
   * Remueve un favorito específico
   */
  removeFavorito(propiedadId: number): Observable<{ status: number; message: string }> {
    return this.http.delete<{ status: number; message: string }>(
      `${this.apiUrl}/favoritos/${propiedadId}`
    );
  }

  /**
   * Obtiene las consultas (leads) enviadas por el usuario web
   */
  getConsultas(): Observable<{ status: number; message: string; data: Consulta[] }> {
    return this.http.get<{ status: number; message: string; data: Consulta[] }>(
      `${this.apiUrl}/consultas`
    );
  }
}
