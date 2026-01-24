import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface EstadoLead {
    id: number;
    nombre: string;
    descripcion?: string;
    color?: string;
    activo: boolean;
    fechaCreacion?: string;
    fechaModificacion?: string;
}

export interface CreateEstadoLeadDto {
    nombre: string;
    descripcion?: string;
    color?: string;
    activo?: boolean;
}

export interface UpdateEstadoLeadDto {
    id: number;
    nombre: string;
    descripcion?: string;
    color?: string;
    activo: boolean;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message?: string;
    data: {
        items: T[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    };
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
export class EstadoLeadService {
    private apiUrl = environment.apiUrl + '/estadolead';

    constructor(private http: HttpClient) { }

    obtenerEstados(
        page: number = 1,
        pageSize: number = 10,
        nombre?: string,
        activo?: boolean
    ): Observable<PaginatedResponse<EstadoLead>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        if (nombre) params = params.set('nombre', nombre);
        if (activo !== undefined) params = params.set('activo', activo.toString());

        return this.http.get<PaginatedResponse<EstadoLead>>(`${this.apiUrl}`, { params });
    }

    obtenerEstadoPorId(id: number): Observable<ApiResponse<EstadoLead>> {
        return this.http.get<ApiResponse<EstadoLead>>(`${this.apiUrl}/${id}`);
    }

    crearEstado(dto: CreateEstadoLeadDto): Observable<ApiResponse<EstadoLead>> {
        return this.http.post<ApiResponse<EstadoLead>>(`${this.apiUrl}`, dto);
    }

    actualizarEstado(id: number, dto: UpdateEstadoLeadDto): Observable<ApiResponse<EstadoLead>> {
        return this.http.put<ApiResponse<EstadoLead>>(`${this.apiUrl}/${id}`, dto);
    }

    eliminarEstado(id: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
    }
    getEstados(): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/combo`);
    }
}
