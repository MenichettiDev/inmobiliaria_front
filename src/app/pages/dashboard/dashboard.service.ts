import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardKPIs {
  leadsNuevos: number;
  leadsActivos: number;
  propiedadesPublicadas: number;
  visitasHoy: number;
  visitasSemana: number;
  operacionesCerradas: number;
}

export interface ActividadReciente {
  fecha: string;
  descripcion: string;
  tipo: string;
}

export interface Alerta {
  tipo: string;
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl + '/dashboard';

  constructor(private http: HttpClient) { }

  obtenerKPIs(): Observable<DashboardKPIs> {
    return this.http.get<DashboardKPIs>(`${this.apiUrl}/kpis`);
  }

  obtenerActividadReciente(): Observable<ActividadReciente[]> {
    return this.http.get<ActividadReciente[]>(`${this.apiUrl}/actividad`);
  }

  obtenerAlertas(): Observable<Alerta[]> {
    return this.http.get<Alerta[]>(`${this.apiUrl}/alertas`);
  }
}