export interface Imagen {
  id: number;
  idPropiedad: number;
  url: string;
  r2Key?: string;
  orden: number;
  esPrincipal: boolean;
  creadoEn: string;
  propiedadTitulo?: string;
}

export interface CreateImagenDto {
  idPropiedad: number;
  url: string;
  orden?: number;
}

export interface UpdateImagenDto {
  id: number;
  url?: string;
  orden: number;
}

export interface ImagenesResponse {
  data: Imagen[];
  success: boolean;
  message: string;
  errors: string[];
}

export interface ImagenResponse {
  data: Imagen;
  success: boolean;
  message: string;
  errors: string[];
}
