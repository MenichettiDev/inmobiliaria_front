import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface HistorialLead {
    id: number;
    idLead: number;
    idUsuario: number;
    usuarioNombre: string;
    idEstadoAnterior: number;
    estadoAnteriorNombre: string;
    idEstadoNuevo: number;
    estadoNuevoNombre: string;
    fechaCambio: string;
    comentario?: string;
}

export interface CreateHistorialLeadDto {
    idLead: number;
    idUsuario?: number;
    idEstadoAnterior: number;
    idEstadoNuevo: number;
    comentario?: string;
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
export class HistorialLeadsService {
    private apiUrl = environment.apiUrl + '/leadestadohistorial';

    constructor(private http: HttpClient) { }

    // Get paginated historial
    obtenerHistorial(
        page: number = 1,
        pageSize: number = 10,
        leadId?: number,
        usuarioId?: number,
        estadoId?: number
    ): Observable<PaginatedResponse<HistorialLead>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        if (leadId) params = params.set('leadId', leadId.toString());
        if (usuarioId) params = params.set('usuarioId', usuarioId.toString());
        if (estadoId) params = params.set('estadoId', estadoId.toString());

        return this.http.get<PaginatedResponse<HistorialLead>>(`${this.apiUrl}`, { params });
    }

    // Get specific historial record by ID
    obtenerHistorialPorId(id: number): Observable<ApiResponse<HistorialLead>> {
        return this.http.get<ApiResponse<HistorialLead>>(`${this.apiUrl}/${id}`);
    }

    // Get historial for a specific lead
    obtenerHistorialPorLead(leadId: number): Observable<ApiResponse<HistorialLead[]>> {
        return this.http.get<ApiResponse<HistorialLead[]>>(`${this.apiUrl}/lead/${leadId}`);
    }

    // Create a new historial record
    crearHistorial(historial: CreateHistorialLeadDto): Observable<ApiResponse<HistorialLead>> {
        return this.http.post<ApiResponse<HistorialLead>>(`${this.apiUrl}`, historial);
    }
}
