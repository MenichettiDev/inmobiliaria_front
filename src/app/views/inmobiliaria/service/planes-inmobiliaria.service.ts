import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PlanDto {
    id: number;
    nombre: string;
    descripcion?: string;
    precioUsd: number;
    maxPropiedades?: number;
    maxUsuarios?: number;
    maxLeadsMes?: number;
    whiteLabel?: boolean;
    dominioPersonalizado?: boolean;
    automatizaciones?: boolean;
    apiAcceso?: boolean;
    soporte?: boolean;
    activo: boolean;
    creadoEn?: string;
    actualizadoEn?: string;
    historialEstados?: any;
    actividadesLead?: any;
    tiposActividad?: string;
    automatizacionLeads?: boolean;
    leadScoring?: boolean;
}

export interface CreatePlanDto {
    nombre: string;
    descripcion?: string;
    precioUsd: number;
    maxPropiedades?: number;
    maxUsuarios?: number;
    maxLeadsMes?: number;
    whiteLabel?: boolean;
    dominioPersonalizado?: boolean;
    automatizaciones?: boolean;
    apiAcceso?: boolean;
    soporte?: boolean;
    activo?: boolean;
    historialEstados?: any;
    actividadesLead?: any;
    tiposActividad?: string;
    automatizacionLeads?: boolean;
    leadScoring?: boolean;
}

export interface UpdatePlanDto extends CreatePlanDto {
    id: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: string[];
}

@Injectable({
    providedIn: 'root'
})
export class PlanesInmobiliariaService {
    private apiUrl = environment.apiUrl + '/plan';

    constructor(private http: HttpClient) { }

    obtenerPlanes(): Observable<ApiResponse<PlanDto[]>> {
        return this.http.get<ApiResponse<PlanDto[]>>(`${this.apiUrl}`);
    }

    obtenerPlanesActivos(): Observable<ApiResponse<PlanDto[]>> {
        return this.http.get<ApiResponse<PlanDto[]>>(`${this.apiUrl}/activos`);
    }

    obtenerPlanPorId(id: number): Observable<ApiResponse<PlanDto>> {
        return this.http.get<ApiResponse<PlanDto>>(`${this.apiUrl}/${id}`);
    }

    crearPlan(dto: CreatePlanDto): Observable<ApiResponse<PlanDto>> {
        return this.http.post<ApiResponse<PlanDto>>(`${this.apiUrl}`, dto);
    }

    actualizarPlan(id: number, dto: UpdatePlanDto): Observable<ApiResponse<PlanDto>> {
        return this.http.put<ApiResponse<PlanDto>>(`${this.apiUrl}/${id}`, dto);
    }

    eliminarPlan(id: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
    }

    togglePlan(id: number): Observable<ApiResponse<any>> {
        return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}/toggle`, {});
    }
}
