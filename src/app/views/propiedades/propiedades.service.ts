import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Propiedad {
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
    imagenes?: { id: number; idPropiedad: number; url: string; orden: number; creadoEn: string; propiedadTitulo?: string }[];
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

interface UpdatePropiedadResponse {
    data: Propiedad | null;
    success: boolean;
    message: string;
    errors: string[];
}

interface PropiedadResponse {
    data: Propiedad;
    success: boolean;
    message: string;
    errors: any[];
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

    obtenerPropiedad(id: number): Observable<PropiedadResponse> {
        return this.http.get<PropiedadResponse>(`${this.apiUrl}/${id}`);
    }

    crearPropiedad(propiedad: any): Observable<CreatePropiedadResponse> {
        return this.http.post<CreatePropiedadResponse>(`${this.apiUrl}`, propiedad);
    }


    actualizarPropiedad(id: number, propiedad: any): Observable<UpdatePropiedadResponse> {
        return this.http.put<UpdatePropiedadResponse>(`${this.apiUrl}/${id}`, propiedad);
    }

    eliminarPropiedad(id: number): Observable<any> {
        // Endpoint DELETE {id} que elimina (desactiva) la propiedad
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    reactivarPropiedad(id: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${id}/reactivar`, {});
    }

    cambiarEstado(id: number, estado: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/estado`, { estado });
    }

    publicarPropiedad(id: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/publicar`, {});
    }

    getPropiedadesCombo(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/combo`);
    }
}