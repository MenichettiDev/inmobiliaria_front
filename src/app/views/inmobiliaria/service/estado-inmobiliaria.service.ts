import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface EstadoInmobiliaria {
    id: number;
    codigo: string;
    descripcion: string;
    activo: boolean;
    fechaCreacion?: string;
    fechaModificacion?: string;
}

export interface CreateEstadoInmobiliariaDto {
    codigo: string;
    descripcion: string;
    activo?: boolean;
}

export interface UpdateEstadoInmobiliariaDto {
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
export class EstadoInmobiliariaService {
    private apiUrl = environment.apiUrl + '/estadoinmobiliaria';

    constructor(private http: HttpClient) { }

    obtenerEstados(): Observable<ApiResponse<EstadoInmobiliaria[]>> {
        return this.http.get<ApiResponse<EstadoInmobiliaria[]>>(`${this.apiUrl}`);
    }

    obtenerEstadosActivos(): Observable<ApiResponse<EstadoInmobiliaria[]>> {
        return this.http.get<ApiResponse<EstadoInmobiliaria[]>>(`${this.apiUrl}/activos`);
    }

    obtenerEstadoPorId(id: number): Observable<ApiResponse<EstadoInmobiliaria>> {
        return this.http.get<ApiResponse<EstadoInmobiliaria>>(`${this.apiUrl}/${id}`);
    }

    crearEstado(dto: CreateEstadoInmobiliariaDto): Observable<ApiResponse<EstadoInmobiliaria>> {
        return this.http.post<ApiResponse<EstadoInmobiliaria>>(`${this.apiUrl}`, dto);
    }

    actualizarEstado(id: number, dto: UpdateEstadoInmobiliariaDto): Observable<ApiResponse<EstadoInmobiliaria>> {
        return this.http.put<ApiResponse<EstadoInmobiliaria>>(`${this.apiUrl}/${id}`, dto);
    }

    eliminarEstado(id: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
    }

    toggleEstado(id: number): Observable<ApiResponse<any>> {
        return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}/toggle`, {});
    }
}
