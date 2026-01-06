import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Operacion {
  id: number;
  tipo: string;
  propiedad: string;
  cliente: string;
  agente: string;
  monto: number;
  comision: number;
  estado: number;
  fechaInicio: string;
  fechaEstimada: string;
}

@Injectable({
  providedIn: 'root'
})
export class OperacionesService {
  private apiUrl = environment.apiUrl + '/operaciones';

  constructor(private http: HttpClient) { }

  obtenerOperaciones(): Observable<Operacion[]> {
    return this.http.get<Operacion[]>(`${this.apiUrl}`);
  }

  obtenerOperacion(id: number): Observable<Operacion> {
    return this.http.get<Operacion>(`${this.apiUrl}/${id}`);
  }

  crearOperacion(operacion: any): Observable<Operacion> {
    return this.http.post<Operacion>(`${this.apiUrl}`, operacion);
  }

  actualizarOperacion(id: number, operacion: any): Observable<Operacion> {
    return this.http.put<Operacion>(`${this.apiUrl}/${id}`, operacion);
  }

  cambiarEstado(id: number, estado: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/estado`, { estado });
  }

  marcarFinalizada(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/finalizar`, {});
  }

  obtenerComisiones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/comisiones`);
  }
}