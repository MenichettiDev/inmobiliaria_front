import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface FuenteContacto {
    id: number;
    nombre: string;
    totalLeads?: number;
}

export interface CreateFuenteContactoDto {
    nombre: string;
}

export interface UpdateFuenteContactoDto {
    id: number;
    nombre: string;
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
export class FuentesService {
    private apiUrl = environment.apiUrl + '/fuentecontacto';

    constructor(private http: HttpClient) { }

    // GET: api/fuentecontacto
    obtenerFuentes(): Observable<ApiResponse<FuenteContacto[]>> {
        return this.http.get<ApiResponse<FuenteContacto[]>>(`${this.apiUrl}`);
    }

    // GET: api/fuentecontacto/{id}
    obtenerFuentePorId(id: number): Observable<ApiResponse<FuenteContacto>> {
        return this.http.get<ApiResponse<FuenteContacto>>(`${this.apiUrl}/${id}`);
    }

    // POST: api/fuentecontacto
    crearFuente(dto: CreateFuenteContactoDto): Observable<ApiResponse<FuenteContacto>> {
        return this.http.post<ApiResponse<FuenteContacto>>(`${this.apiUrl}`, dto);
    }

    // PUT: api/fuentecontacto/{id}
    actualizarFuente(id: number, dto: UpdateFuenteContactoDto): Observable<ApiResponse<FuenteContacto>> {
        return this.http.put<ApiResponse<FuenteContacto>>(`${this.apiUrl}/${id}`, dto);
    }

    // DELETE: api/fuentecontacto/{id}
    eliminarFuente(id: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
    }

    // GET: api/fuentecontacto/populares
    obtenerFuentesPopulares(): Observable<ApiResponse<FuenteContacto[]>> {
        return this.http.get<ApiResponse<FuenteContacto[]>>(`${this.apiUrl}/populares`);
    }
}
