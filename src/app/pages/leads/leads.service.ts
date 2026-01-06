import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Lead {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  estado: number;
  propiedadInteres: string;
  agente: string;
  fechaCreacion: string;
  ultimaActividad: string;
  notas: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeadsService {
  private apiUrl = environment.apiUrl + '/leads';

  constructor(private http: HttpClient) { }

  obtenerLeads(): Observable<Lead[]> {
    return this.http.get<Lead[]>(`${this.apiUrl}`);
  }

  obtenerLead(id: number): Observable<Lead> {
    return this.http.get<Lead>(`${this.apiUrl}/${id}`);
  }

  crearLead(lead: any): Observable<Lead> {
    return this.http.post<Lead>(`${this.apiUrl}`, lead);
  }

  actualizarLead(id: number, lead: any): Observable<Lead> {
    return this.http.put<Lead>(`${this.apiUrl}/${id}`, lead);
  }

  cambiarEstado(id: number, estado: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/estado`, { estado });
  }

  asignarAgente(id: number, agenteId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/agente`, { agenteId });
  }

  registrarActividad(id: number, actividad: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/actividades`, actividad);
  }
}