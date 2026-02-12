import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    dni: string;
    activo: boolean;
    creadoEn: string;
    actualizadoEn: string;
    idInmobiliaria: number;
}

export interface CreateClienteDto {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    dni: string;
    idInmobiliaria?: number;
}

export interface UpdateClienteDto {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    dni: string;
    activo: boolean;
    idInmobiliaria?: number;
}

interface ClientesResponse {
    data: {
        data: Cliente[];
        page: number;
        pageSize: number;
        totalRecords: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
    success: boolean;
    message: string;
    errors: any[];
}

interface CreateClienteResponse {
    data: Cliente | null;
    success: boolean;
    message: string;
    errors: string[];
}

interface UpdateClienteResponse {
    data: Cliente | null;
    success: boolean;
    message: string;
    errors: string[];
}

interface ClienteResponse {
    data: Cliente;
    success: boolean;
    message: string;
    errors: any[];
}

interface DeleteClienteResponse {
    success: boolean;
    message: string;
    errors: any[];
}

@Injectable({
    providedIn: 'root'
})
export class ClientesService {
    private apiUrl = environment.apiUrl + '/cliente';

    constructor(private http: HttpClient) { }

    obtenerClientes(page: number = 1, pageSize: number = 20, nombre?: string, activo?: boolean): Observable<ClientesResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        if (nombre) {
            params = params.set('nombre', nombre);
        }

        if (activo !== undefined && activo !== null) {
            params = params.set('activo', activo.toString());
        }

        return this.http.get<ClientesResponse>(`${this.apiUrl}`, { params });
    }

    obtenerCliente(id: number): Observable<ClienteResponse> {
        return this.http.get<ClienteResponse>(`${this.apiUrl}/${id}`);
    }

    crearCliente(cliente: CreateClienteDto): Observable<CreateClienteResponse> {
        return this.http.post<CreateClienteResponse>(`${this.apiUrl}`, cliente);
    }

    actualizarCliente(id: number, cliente: UpdateClienteDto): Observable<UpdateClienteResponse> {
        return this.http.put<UpdateClienteResponse>(`${this.apiUrl}/${id}`, cliente);
    }

    eliminarCliente(id: number): Observable<DeleteClienteResponse> {
        return this.http.delete<DeleteClienteResponse>(`${this.apiUrl}/${id}`);
    }
}
