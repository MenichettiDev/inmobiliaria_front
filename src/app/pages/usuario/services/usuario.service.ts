import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface Usuario {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    idInmobiliaria: number;
    idRol: number;
    idEstado: number;
    creadoEn: string;
    actualizadoEn: string;
    rolNombre: string;
}

interface UsuariosResponse {
    data: {
        data: Usuario[];
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

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private apiUrl = environment.apiUrl + '/usuario';

    constructor(private http: HttpClient) { }

    obtenerUsuarios(
        page: number = 1,
        pageSize: number = 10,
        nombre?: string,
        rolId?: number,
        estadoId?: number
    ): Observable<UsuariosResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        if (nombre) {
            params = params.set('nombre', nombre);
        }
        if (rolId) {
            params = params.set('rolId', rolId.toString());
        }
        if (estadoId) {
            params = params.set('estadoId', estadoId.toString());
        }

        return this.http.get<UsuariosResponse>(`${this.apiUrl}`, { params });
    }
}
