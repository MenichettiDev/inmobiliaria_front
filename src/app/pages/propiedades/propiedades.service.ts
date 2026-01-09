import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Propiedad {
    id: number;
    titulo: string;
    descripcion: string;
    precio: number;
    direccion: string;
    latitud: number;
    longitud: number;
    publicadaEn: string | null;
    creadoEn: string;
    actualizadoEn: string;
    idInmobiliaria: number;
    idAgenteResponsable: number | null;
    agenteResponsableNombre: string | null;
    idEstadoAdmin: number;
    idEstadoOperativo: number;
    estadoAdminNombre: string;
    estadoOperativoNombre: string;
}

interface PropiedadesResponse {
    data: {
        data: Propiedad[];
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

interface CreatePropiedadResponse {
    data: Propiedad | null;
    success: boolean;
    message: string;
    errors: string[];
}

@Injectable({
    providedIn: 'root'
})
export class PropiedadesService {
    private apiUrl = environment.apiUrl + '/propiedad';

    constructor(private http: HttpClient) { }

    obtenerPropiedades(): Observable<PropiedadesResponse> {
        return this.http.get<PropiedadesResponse>(`${this.apiUrl}`);
    }

    obtenerPropiedad(id: number): Observable<Propiedad> {
        return this.http.get<Propiedad>(`${this.apiUrl}/${id}`);
    }

    crearPropiedad(propiedad: any): Observable<CreatePropiedadResponse> {
        return this.http.post<CreatePropiedadResponse>(`${this.apiUrl}`, propiedad);
    }

    actualizarPropiedad(id: number, propiedad: any): Observable<Propiedad> {
        return this.http.put<Propiedad>(`${this.apiUrl}/${id}`, propiedad);
    }

    eliminarPropiedad(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    cambiarEstado(id: number, estado: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/estado`, { estado });
    }

    publicarPropiedad(id: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/publicar`, {});
    }
}