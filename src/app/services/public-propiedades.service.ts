import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const getServerBaseUrl = (): string => environment.apiUrl.replace('/api', '');

export interface PropiedadPublicaDto {
  id: number;
  titulo: string;
  descripcion: string;
  precio?: number;
  direccion: string;
  latitud?: number;
  longitud?: number;
  localidadNombre?: string;
  provinciaNombre?: string;
  publicadaEn?: Date;
  idInmobiliaria: number;
  inmobiliariaNombre: string;
  inmobiliariaSubdominio: string;
  urlImagenes: string[];
}

export interface FiltroOpcionDto {
  id: number;
  nombre: string;
  cantidad: number;
}

export interface PublicFiltrosDto {
  inmobiliarias: FiltroOpcionDto[];
  provincias: FiltroOpcionDto[];
}

export interface PaginatedResponseDto<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BaseResponseDto<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: string[];
}

@Injectable({ providedIn: 'root' })
export class PublicPropiedadesService {
  private apiUrl = `${environment.apiUrl}/public`;
  private serverBaseUrl = getServerBaseUrl();

  constructor(private http: HttpClient) { }

  getFiltrosOpciones(): Observable<BaseResponseDto<PublicFiltrosDto>> {
    return this.http.get<BaseResponseDto<PublicFiltrosDto>>(`${this.apiUrl}/filtros`);
  }

  getPropiedadesPublicas(
    page = 1, pageSize = 12,
    titulo?: string, precioMin?: number, precioMax?: number,
    idInmobiliaria?: number, idProvincia?: number
  ): Observable<BaseResponseDto<PaginatedResponseDto<PropiedadPublicaDto>>> {
    const params = this.buildParams({ page, pageSize, titulo, precioMin, precioMax, idInmobiliaria, idProvincia });
    return this.http.get<BaseResponseDto<PaginatedResponseDto<PropiedadPublicaDto>>>(
      `${this.apiUrl}/propiedades?${params}`
    );
  }

  getPropiedadPublica(id: number): Observable<BaseResponseDto<PropiedadPublicaDto>> {
    return this.http.get<BaseResponseDto<PropiedadPublicaDto>>(`${this.apiUrl}/propiedades/${id}`);
  }

  getPropiedadesByTenant(
    subdominio: string,
    page = 1, pageSize = 12,
    titulo?: string, precioMin?: number, precioMax?: number,
    idInmobiliaria?: number, idProvincia?: number
  ): Observable<BaseResponseDto<PaginatedResponseDto<PropiedadPublicaDto>>> {
    const params = this.buildParams({ page, pageSize, titulo, precioMin, precioMax, idInmobiliaria, idProvincia });
    return this.http.get<BaseResponseDto<PaginatedResponseDto<PropiedadPublicaDto>>>(
      `${this.apiUrl}/tenant/${subdominio}?${params}`
    );
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '/assets/images/backgrounds/no-image.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${this.serverBaseUrl}${imagePath}`;
  }

  private buildParams(opts: Record<string, string | number | undefined>): string {
    const p = new URLSearchParams();
    for (const [key, val] of Object.entries(opts)) {
      if (val !== undefined && val !== null && val !== '') {
        p.set(key, String(val));
      }
    }
    return p.toString();
  }
}
