import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Inmobiliaria {
    id: number;
    nombre: string;
    subdominio: string;
    dominioPersonalizado: string | null;
    idPlan: number;
    idEstado: number;
    creadoEn: string;
    actualizadoEn: string;
    planNombre: string;
    estadoDescripcion: string;
    totalUsuarios: number;
    totalPropiedades: number;
    totalLeads: number;
}

export interface CreateInmobiliariaDto {
    nombre: string;
    subdominio: string;
    dominioPersonalizado?: string;
    idPlan: number;
}

export interface UpdateInmobiliariaDto {
    id: number;
    nombre: string;
    subdominio: string;
    dominioPersonalizado?: string;
    idPlan: number;
}

export interface InmobiliariaFilters {
    page?: number;
    pageSize?: number;
    nombre?: string;
    planId?: number;
    estadoId?: number;
}

export interface PaginatedResponse<T> {
    data: {
        data: T[];
        page: number;
        pageSize: number;
        totalRecords: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
    success: boolean;
    message: string;
    errors: any[];
}

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message: string;
    errors: any[];
}

@Injectable({
    providedIn: 'root'
})
export class InmobiliariaService {
    private readonly apiUrl = `${environment.apiUrl}/inmobiliaria`;

    constructor(private http: HttpClient) { }

    /**
     * Obtiene todas las inmobiliarias con filtros opcionales
     * Requiere rol de Programador
     */
    getInmobiliarias(filters: InmobiliariaFilters = {}): Observable<PaginatedResponse<Inmobiliaria>> {
        let params = new HttpParams();

        if (filters.page) {
            params = params.set('page', filters.page.toString());
        }

        if (filters.pageSize) {
            params = params.set('pageSize', filters.pageSize.toString());
        }

        if (filters.nombre) {
            params = params.set('nombre', filters.nombre);
        }

        if (filters.planId) {
            params = params.set('planId', filters.planId.toString());
        }

        if (filters.estadoId) {
            params = params.set('estadoId', filters.estadoId.toString());
        }

        return this.http.get<PaginatedResponse<Inmobiliaria>>(this.apiUrl, { params });
    }

    /**
     * Obtiene una inmobiliaria por ID
     * Requiere rol de Programador
     */
    getInmobiliariaById(id: number): Observable<ApiResponse<Inmobiliaria>> {
        if (id <= 0) {
            throw new Error('El ID debe ser mayor a 0');
        }

        return this.http.get<ApiResponse<Inmobiliaria>>(`${this.apiUrl}/${id}`);
    }

    /**
     * Obtiene la inmobiliaria actual del usuario autenticado
     * Requiere rol de Programador
     */
    getMyInmobiliaria(id: number): Observable<ApiResponse<Inmobiliaria>> {
        if (id <= 0) {
            throw new Error('El ID debe ser mayor a 0');
        }

        return this.http.get<ApiResponse<Inmobiliaria>>(`${this.apiUrl}/${id}`);
    }

    /**
     * Crea una nueva inmobiliaria
     * Requiere rol de Programador
     */
    createInmobiliaria(createDto: CreateInmobiliariaDto): Observable<ApiResponse<Inmobiliaria>> {
        // Validaciones del lado cliente
        if (!createDto.nombre?.trim()) {
            throw new Error('El nombre es obligatorio');
        }

        if (!createDto.subdominio?.trim()) {
            throw new Error('El subdominio es obligatorio');
        }

        if (!createDto.idPlan || createDto.idPlan <= 0) {
            throw new Error('Debe seleccionar un plan válido');
        }

        return this.http.post<ApiResponse<Inmobiliaria>>(this.apiUrl, createDto);
    }

    /**
     * Actualiza una inmobiliaria existente
     * Requiere rol de Programador
     */
    updateInmobiliaria(id: number, updateDto: UpdateInmobiliariaDto): Observable<ApiResponse<Inmobiliaria>> {
        if (id <= 0) {
            throw new Error('ID no válido');
        }

        if (id !== updateDto.id) {
            throw new Error('El ID no coincide');
        }

        return this.http.put<ApiResponse<Inmobiliaria>>(`${this.apiUrl}/${id}`, updateDto);
    }

    /**
     * Cambia el estado de una inmobiliaria
     * Requiere rol de Programador
     * Estados: 1 (activa), 2 (suspendida), 3 (cancelada)
     */
    changeInmobiliariaState(id: number, newState: number): Observable<ApiResponse<any>> {
        if (id <= 0) {
            throw new Error('ID no válido');
        }

        if (newState < 1 || newState > 3) {
            throw new Error('Estado no válido. Use 1 (activa), 2 (suspendida) o 3 (cancelada)');
        }

        return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}/estado`, newState);
    }

    /**
     * Elimina una inmobiliaria
     * Requiere rol de Programador
     */
    deleteInmobiliaria(id: number): Observable<ApiResponse<any>> {
        if (id <= 0) {
            throw new Error('ID no válido');
        }

        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
    }

    /**
     * Método de conveniencia para obtener inmobiliarias con paginación
     */
    getInmobiliariasPaginated(page: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Inmobiliaria>> {
        return this.getInmobiliarias({ page, pageSize });
    }

    /**
     * Método de conveniencia para buscar inmobiliarias por nombre
     */
    searchInmobiliariasByName(nombre: string, page: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Inmobiliaria>> {
        return this.getInmobiliarias({ nombre, page, pageSize });
    }

    /**
     * Método de conveniencia para filtrar por plan
     */
    getInmobiliariasByPlan(planId: number, page: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Inmobiliaria>> {
        return this.getInmobiliarias({ planId, page, pageSize });
    }

    /**
     * Método de conveniencia para filtrar por estado
     */
    getInmobiliariasByEstado(estadoId: number, page: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Inmobiliaria>> {
        return this.getInmobiliarias({ estadoId, page, pageSize });
    }

    /**
     * Método de conveniencia para obtener inmobiliarias basado en el rol del usuario
     * - Programador (rol 1): obtiene todas las inmobiliarias
     * - Administrador (rol 2): obtiene solo su inmobiliaria
     */
    getInmobiliariasForCurrentUser(filters: InmobiliariaFilters = {}): Observable<PaginatedResponse<Inmobiliaria> | ApiResponse<Inmobiliaria>> {
        // Esta lógica podría moverse al componente, pero la incluyo aquí para simplicidad
        // En una implementación real, el backend debería manejar esto automáticamente
        return this.getInmobiliarias(filters);
    }

    /**
     * Activa una inmobiliaria (estado 1)
     */
    activateInmobiliaria(id: number): Observable<ApiResponse<any>> {
        return this.changeInmobiliariaState(id, 1);
    }

    /**
     * Suspende una inmobiliaria (estado 2)
     */
    suspendInmobiliaria(id: number): Observable<ApiResponse<any>> {
        return this.changeInmobiliariaState(id, 2);
    }

    /**
     * Cancela una inmobiliaria (estado 3)
     */
    cancelInmobiliaria(id: number): Observable<ApiResponse<any>> {
        return this.changeInmobiliariaState(id, 3);
    }
}
