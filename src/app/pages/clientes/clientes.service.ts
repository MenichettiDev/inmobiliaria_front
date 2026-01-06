import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  tipo: string;
  fechaRegistro: string;
  propiedadesAsociadas: string[];
  operacionesRealizadas: number;
  ultimaInteraccion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = environment.apiUrl + '/clientes';

  constructor(private http: HttpClient) { }

  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}`);
  }

  obtenerCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  crearCliente(cliente: any): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}`, cliente);
  }

  actualizarCliente(id: number, cliente: any): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  obtenerHistorial(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/historial`);
  }

  asociarPropiedad(clienteId: number, propiedadId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${clienteId}/propiedades`, { propiedadId });
  }
}