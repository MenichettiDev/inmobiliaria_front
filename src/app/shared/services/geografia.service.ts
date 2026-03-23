import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProvinciaDto {
  id: number;
  nombre: string;
  codigoIndec?: string;
  activo: boolean;
}

export interface LocalidadDto {
  id: number;
  idProvincia: number;
  provinciaNombre: string;
  nombre: string;
  codigoPostal?: string;
  municipio?: string;
}

@Injectable({ providedIn: 'root' })
export class GeografiaService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProvincias(): Observable<{ success: boolean; data: ProvinciaDto[] }> {
    return this.http.get<any>(`${this.base}/Provincia?soloActivas=true`);
  }

  getLocalidadesPorProvincia(idProvincia: number): Observable<{ success: boolean; data: LocalidadDto[] }> {
    return this.http.get<any>(`${this.base}/Localidad/por-provincia/${idProvincia}`);
  }
}
