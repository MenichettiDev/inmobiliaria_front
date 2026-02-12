import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

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
}