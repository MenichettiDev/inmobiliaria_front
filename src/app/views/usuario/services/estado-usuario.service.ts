import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface EstadoUsuario {
  id: number;
  codigo: string;
  descripcion?: string;
  activo: boolean;
}

export interface CreateEstadoUsuarioDto {
  codigo: string;
  descripcion: string;
  activo?: boolean;
}

export interface UpdateEstadoUsuarioDto {
  id: number;
  codigo: string;
  descripcion: string;
  activo: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class EstadoUsuarioService {
  private apiUrl = environment.apiUrl + '/estadousuario';

  constructor(private http: HttpClient) {}

  // GET: api/estadousuario
  obtenerEstados(): Observable<ApiResponse<EstadoUsuario[]>> {
    return this.http.get<ApiResponse<EstadoUsuario[]>>(`${this.apiUrl}`);
  }

  // GET: api/estadousuario/activos
  obtenerEstadosActivos(): Observable<ApiResponse<EstadoUsuario[]>> {
    return this.http.get<ApiResponse<EstadoUsuario[]>>(`${this.apiUrl}/activos`);
  }

  // GET: api/estadousuario/{id}
  obtenerEstadoPorId(id: number): Observable<ApiResponse<EstadoUsuario>> {
    return this.http.get<ApiResponse<EstadoUsuario>>(`${this.apiUrl}/${id}`);
  }

  // POST: api/estadousuario
  crearEstado(dto: CreateEstadoUsuarioDto): Observable<ApiResponse<EstadoUsuario>> {
    return this.http.post<ApiResponse<EstadoUsuario>>(`${this.apiUrl}`, dto);
  }

  // PUT: api/estadousuario/{id}
  actualizarEstado(id: number, dto: UpdateEstadoUsuarioDto): Observable<ApiResponse<EstadoUsuario>> {
    return this.http.put<ApiResponse<EstadoUsuario>>(`${this.apiUrl}/${id}`, dto);
  }

  // DELETE: api/estadousuario/{id}
  eliminarEstado(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  // PATCH: api/estadousuario/{id}/toggle
  toggleEstado(id: number): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}/toggle`, null);
  }
}
