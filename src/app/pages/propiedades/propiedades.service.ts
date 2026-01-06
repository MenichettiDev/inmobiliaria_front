import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Propiedad {
    id: number;
    titulo: string;
    tipo: string;
    precio: number;
    estadoAdministrativo: string;
    estadoComercial: string;
    agente: string;
    fechaCreacion: string;
    imagen: string;
}

@Injectable({
    providedIn: 'root'
})
export class PropiedadesService {
    private apiUrl = environment.apiUrl + '/propiedades';

    constructor(private http: HttpClient) { }

    obtenerPropiedades(): Observable<Propiedad[]> {
        return this.http.get<Propiedad[]>(`${this.apiUrl}`);
    }

    obtenerPropiedad(id: number): Observable<Propiedad> {
        return this.http.get<Propiedad>(`${this.apiUrl}/${id}`);
    }

    crearPropiedad(propiedad: any): Observable<Propiedad> {
        return this.http.post<Propiedad>(`${this.apiUrl}`, propiedad);
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