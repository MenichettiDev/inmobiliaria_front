import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Evento {
    id: number;
    titulo: string;
    fecha: string;
    hora: string;
    duracion: number;
    tipo: string;
    cliente: string;
    propiedad?: string;
    agente: string;
    estado: string;
}

@Injectable({
    providedIn: 'root'
})
export class AgendaService {
    private apiUrl = environment.apiUrl + '/agenda';

    constructor(private http: HttpClient) { }

    obtenerEventos(fechaDesde?: string, fechaHasta?: string): Observable<Evento[]> {
        let url = `${this.apiUrl}/eventos`;
        if (fechaDesde && fechaHasta) {
            url += `?desde=${fechaDesde}&hasta=${fechaHasta}`;
        }
        return this.http.get<Evento[]>(url);
    }

    obtenerEvento(id: number): Observable<Evento> {
        return this.http.get<Evento>(`${this.apiUrl}/eventos/${id}`);
    }

    crearEvento(evento: any): Observable<Evento> {
        return this.http.post<Evento>(`${this.apiUrl}/eventos`, evento);
    }

    actualizarEvento(id: number, evento: any): Observable<Evento> {
        return this.http.put<Evento>(`${this.apiUrl}/eventos/${id}`, evento);
    }

    eliminarEvento(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/eventos/${id}`);
    }

    marcarAsistencia(id: number, asistio: boolean): Observable<any> {
        return this.http.patch(`${this.apiUrl}/eventos/${id}/asistencia`, { asistio });
    }
}