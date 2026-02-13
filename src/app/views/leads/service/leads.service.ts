import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

export interface Lead {
    id: number;
    nombreCompleto: string;
    email?: string;
    telefono?: string;
    idEstado: number;
    estadoNombre?: string;
    idFuente: number;
    fuenteNombre?: string;
    idUsuarioAsignado?: number;
    usuarioAsignadoNombre?: string;
    idPropiedad?: number;
    propiedadDireccion?: string;
    idCliente?: number;
    clienteNombre?: string;
    mensaje?: string;
    fechaCreacion: string;
    fechaUltimaActividad?: string;
    activo: boolean;
}

export interface CreateLeadDto {
    nombreCompleto: string;
    email?: string;
    telefono?: string;
    idFuente: number;
    idUsuarioAsignado?: number;
    idPropiedad?: number;
    idCliente?: number;
    observaciones?: string;
}

export interface UpdateLeadDto {
    id: number;
    idEstado?: number;
    nombreCompleto: string;
    email?: string;
    telefono?: string;
    idFuente: number;
    idUsuarioAsignado?: number;
    idPropiedad?: number;
    idCliente?: number;
    mensaje?: string;
    activo: boolean;
}

export interface CambiarEstadoLeadDto {
    idLead: number;
    idEstadoNuevo: number;
    comentario?: string;
}

export interface AsignarLeadDto {
    idLead: number;
    idUsuarioAsignado: number;
    observaciones?: string;
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
export class LeadsService {
    private apiUrl = environment.apiUrl + '/Lead';

    constructor(private http: HttpClient) { }

    obtenerLeads(
        page: number = 1,
        pageSize: number = 10,
        nombre?: string,
        estadoId?: number,
        fuenteId?: number,
        usuarioAsignadoId?: number,
        propiedadId?: number,
        clienteId?: number,
        activo?: boolean
    ): Observable<PaginatedResponse<Lead>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        if (nombre) params = params.set('nombre', nombre);
        if (estadoId) params = params.set('estadoId', estadoId.toString());
        if (fuenteId) params = params.set('fuenteId', fuenteId.toString());
        if (usuarioAsignadoId) params = params.set('usuarioAsignadoId', usuarioAsignadoId.toString());
        if (propiedadId) params = params.set('propiedadId', propiedadId.toString());
        if (clienteId) params = params.set('clienteId', clienteId.toString());
        if (activo !== undefined) params = params.set('activo', activo.toString());

        return this.http.get<PaginatedResponse<Lead>>(`${this.apiUrl}`, { params }).pipe(
            // Map the response to extract the nested data
            map((response: any) => {
                return {
                    success: response.success,
                    message: response.message,
                    data: {
                        items: response.data.data, // Extract the nested data array
                        totalItems: response.data.totalRecords,
                        totalPages: response.data.totalPages,
                        currentPage: response.data.page,
                        pageSize: response.data.pageSize
                    },
                    errors: response.errors
                };
            })
        );
    }

    obtenerLead(id: number): Observable<ApiResponse<Lead>> {
        return this.http.get<ApiResponse<Lead>>(`${this.apiUrl}/${id}`);
    }

    crearLead(lead: CreateLeadDto): Observable<ApiResponse<Lead>> {
        return this.http.post<ApiResponse<Lead>>(`${this.apiUrl}`, lead);
    }

    actualizarLead(id: number, lead: UpdateLeadDto): Observable<ApiResponse<Lead>> {
        return this.http.put<ApiResponse<Lead>>(`${this.apiUrl}/${id}`, lead);
    }

    eliminarLead(id: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
    }

    cambiarEstado(cambioDto: CambiarEstadoLeadDto): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${cambioDto.idLead}/cambiar-estado`, cambioDto);
    }

    asignarUsuario(asignacionDto: AsignarLeadDto): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${asignacionDto.idLead}/asignar`, asignacionDto);
    }
}