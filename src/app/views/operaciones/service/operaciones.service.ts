import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface TransaccionHistorial {
    // ...campos relevantes...
    id: number;
    idInmobiliaria?: number;
    clienteId?: number;
    agenteId?: number;
    // agregado: propiedad/cliente/agente/tipo/comision/estado/fechas que usa la UI
    tipo?: string; // p.e. 'venta' | 'alquiler' | 'reserva'
    propiedad?: string;
    cliente?: string;
    agente?: string;
    monto?: number;
    comision?: number;
    estado?: number;
    fechaInicio?: string;
    fechaEstimada?: string;
    tipoTransaccion?: number;
    descripcion?: string;
    fecha?: string;
    // ...otros campos...
}

export interface CreateTransaccionHistorialDto {
    // ...campos para creación (sin id)...
    clienteId?: number;
    agenteId?: number;
    tipoTransaccion?: number;
    monto?: number;
    descripcion?: string;
    fecha?: string;
    idInmobiliaria?: number; // será puesto por el backend desde el claim
}

export interface UpdateTransaccionHistorialDto {
    id: number;
    // ...campos editables...
    clienteId?: number;
    agenteId?: number;
    tipoTransaccion?: number;
    monto?: number;
    descripcion?: string;
    fecha?: string;
    idInmobiliaria?: number;
}

// Nuevo: estructura paginada interna que devuelve la API
export interface PaginatedData<T> {
    data: T[];
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
}

// Wrapper general de la API
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    errors?: any[];
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    pageSize: number;
    total: number;
    success?: boolean;
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class OperacionesService {
    private apiUrl = environment.apiUrl + '/transaccionhistorial';

    constructor(private http: HttpClient) { }

    // Obtener list paginada con filtros opcionales
    obtenerTransacciones(
        page: number = 1,
        pageSize: number = 10,
        clienteId?: number | null,
        agenteId?: number | null,
        tipoTransaccion?: number | null,
        fechaDesde?: Date | string | null,
        fechaHasta?: Date | string | null
    ): Observable<ApiResponse<PaginatedData<TransaccionHistorial>>> {
        let params = new HttpParams()
            .set('page', String(page))
            .set('pageSize', String(pageSize));

        if (clienteId != null) params = params.set('clienteId', String(clienteId));
        if (agenteId != null) params = params.set('agenteId', String(agenteId));
        if (tipoTransaccion != null) params = params.set('tipoTransaccion', String(tipoTransaccion));
        if (fechaDesde) params = params.set('fechaDesde', new Date(fechaDesde).toISOString());
        if (fechaHasta) params = params.set('fechaHasta', new Date(fechaHasta).toISOString());

        return this.http.get<ApiResponse<PaginatedData<TransaccionHistorial>>>(`${this.apiUrl}`, { params });
    }

    // Obtener por id
    obtenerTransaccion(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    // Crear
    crearTransaccion(dto: CreateTransaccionHistorialDto): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, dto);
    }

    // Actualizar
    actualizarTransaccion(id: number, dto: UpdateTransaccionHistorialDto): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, dto);
    }

    // Eliminar
    eliminarTransaccion(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    // Combo
    obtenerCombo(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/combo`);
    }
}