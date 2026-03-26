import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Obtener la URL base del servidor (sin /api)
const getServerBaseUrl = (): string => {
  const apiUrl = environment.apiUrl;
  return apiUrl.replace('/api', '');
};

export interface PropiedadPublicaDto {
  id: number;
  titulo: string;
  descripcion: string;
  precio?: number;
  direccion: string;
  latitud?: number;
  longitud?: number;
  publicadaEn?: Date;
  idInmobiliaria: number;
  inmobiliariaNombre: string;
  inmobiliariaSubdominio: string;
  urlImagenes: string[];
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

@Injectable({
  providedIn: 'root'
})
export class PublicPropiedadesService {
  private apiUrl = `${environment.apiUrl}/public`;
  private serverBaseUrl = getServerBaseUrl();

  constructor(private http: HttpClient) { }

  /**
   * Obtiene propiedades publicadas cross-tenant
   */
  getPropiedadesPublicas(
    page: number = 1,
    pageSize: number = 10,
    titulo?: string,
    precioMin?: number,
    precioMax?: number
  ): Observable<BaseResponseDto<PaginatedResponseDto<PropiedadPublicaDto>>> {
    let url = `${this.apiUrl}/propiedades?page=${page}&pageSize=${pageSize}`;

    if (titulo) {
      url += `&titulo=${encodeURIComponent(titulo)}`;
    }
    if (precioMin !== undefined) {
      url += `&precioMin=${precioMin}`;
    }
    if (precioMax !== undefined) {
      url += `&precioMax=${precioMax}`;
    }

    return this.http.get<BaseResponseDto<PaginatedResponseDto<PropiedadPublicaDto>>>(url);
  }

  /**
   * Obtiene una propiedad publicada por ID
   */
  getPropiedadPublica(id: number): Observable<BaseResponseDto<PropiedadPublicaDto>> {
    return this.http.get<BaseResponseDto<PropiedadPublicaDto>>(`${this.apiUrl}/propiedades/${id}`);
  }

  /**
   * Obtiene propiedades publicadas de un tenant específico por subdominio
   */
  getPropiedadesByTenant(
    subdominio: string,
    page: number = 1,
    pageSize: number = 10,
    titulo?: string,
    precioMin?: number,
    precioMax?: number
  ): Observable<BaseResponseDto<PaginatedResponseDto<PropiedadPublicaDto>>> {
    let url = `${this.apiUrl}/tenant/${subdominio}?page=${page}&pageSize=${pageSize}`;

    if (titulo) {
      url += `&titulo=${encodeURIComponent(titulo)}`;
    }
    if (precioMin !== undefined) {
      url += `&precioMin=${precioMin}`;
    }
    if (precioMax !== undefined) {
      url += `&precioMax=${precioMax}`;
    }

    return this.http.get<BaseResponseDto<PaginatedResponseDto<PropiedadPublicaDto>>>(url);
  }

  /**
   * Construye la URL completa de una imagen
   */
  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return '/assets/images/backgrounds/no-image.jpg';
    }
    // Si es una URL absoluta ya, devolverla tal cual
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Si es una ruta relativa del servidor, agregar la URL base
    return `${this.serverBaseUrl}${imagePath}`;
  }
}
