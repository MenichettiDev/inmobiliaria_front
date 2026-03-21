import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OperacionesService, TransaccionHistorial, PaginatedData, ApiResponse } from '../../service/operaciones.service';

@Component({
  selector: 'app-visor-operaciones',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './visor-operaciones.component.html',
  styleUrl: './visor-operaciones.component.css'
})
export class VisorOperacionesComponent implements OnInit {

  Math = Math;


  tiposOperacion = [
    { id: 'venta', nombre: 'Venta' },
    { id: 'alquiler', nombre: 'Alquiler' },
    { id: 'reserva', nombre: 'Reserva' }
  ];

  estadosOperacion = [
    { id: 1, nombre: 'En progreso', color: '#ffc107' },
    { id: 2, nombre: 'Documentación', color: '#17a2b8' },
    { id: 3, nombre: 'Finalizada', color: '#28a745' },
    { id: 4, nombre: 'Cancelada', color: '#dc3545' }
  ];

  operaciones: TransaccionHistorial[] = [];
  page = 1;
  pageSize = 10;
  total = 0;
  loading = false;

  filtros = {
    tipo: '',
    estado: '',
    agente: '',
    fechaDesde: '',
    fechaHasta: ''
  };

  constructor(private operacionesService: OperacionesService) { }

  ngOnInit(): void {
    this.loadTransacciones();
  }

  loadTransacciones(page: number = this.page) {
    this.loading = true;
    this.page = page;

    const clienteId = null;
    const agenteId = this.filtros.agente ? undefined : undefined;
    const tipoTransaccion = this.filtros.tipo ? undefined : undefined;

    this.operacionesService.obtenerTransacciones(
      this.page,
      this.pageSize,
      clienteId,
      agenteId as any,
      tipoTransaccion as any,
      this.filtros.fechaDesde || null,
      this.filtros.fechaHasta || null
    ).subscribe({
      next: (resp: ApiResponse<PaginatedData<TransaccionHistorial>>) => {
        const pageData = resp?.data ?? { data: [], page: this.page, pageSize: this.pageSize, totalRecords: 0 };
        this.operaciones = pageData.data ?? [];
        this.total = pageData.totalRecords ?? (pageData.data ? pageData.data.length : 0);
        this.page = pageData.page ?? this.page;
        this.pageSize = pageData.pageSize ?? this.pageSize;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  crearOperacion(): void {
    const dto = {
      clienteId: null,
      agenteId: null,
      tipoTransaccion: undefined,
      monto: 0,
      descripcion: 'Creada desde visor'
    };
    this.operacionesService.crearTransaccion(dto as any).subscribe({
      next: (res: any) => { this.loadTransacciones(1); },
      error: () => { }
    });
  }

  editarOperacion(id: number): void {
    this.operacionesService.obtenerTransaccion(id).subscribe({
      next: (res: any) => { console.log('Operacion obtenida para editar', res); },
      error: () => { }
    });
  }

  cambiarEstado(id: number): void {
    this.operacionesService.obtenerTransaccion(id).subscribe({
      next: (resp: any) => {
        const dto = { ...(resp.data || resp), id, estado: 2 } as any;
        this.operacionesService.actualizarTransaccion(id, dto).subscribe(() => this.loadTransacciones(this.page));
      },
      error: () => { }
    });
  }

  marcarFinalizada(id: number): void {
    this.operacionesService.obtenerTransaccion(id).subscribe({
      next: (resp: any) => {
        const origen = (resp.data || resp) as any;
        const dto = { ...origen, id, estado: 3 } as any;
        this.operacionesService.actualizarTransaccion(id, dto).subscribe({
          next: () => this.loadTransacciones(this.page),
          error: () => { }
        });
      },
      error: () => { }
    });
  }

  verDocumentacion(id: number): void {
    this.operacionesService.obtenerTransaccion(id).subscribe({
      next: (res: any) => { console.log('Documentación / datos operación:', res); },
      error: () => { }
    });
  }

  get operacionesFiltradas() {
    let filtradas = [...this.operaciones];

    if (this.filtros.tipo) {
      filtradas = filtradas.filter(op => (op as any).tipo === this.filtros.tipo);
    }

    if (this.filtros.estado) {
      filtradas = filtradas.filter(op => (op as any).estado === Number(this.filtros.estado));
    }

    if (this.filtros.agente) {
      filtradas = filtradas.filter(op => (op as any).agente === this.filtros.agente);
    }

    return filtradas;
  }

  obtenerOperacionesPorEstado(estado: number) {
    return this.operaciones.filter(op => (op as any).estado === estado);
  }

  aplicarFiltros(): void {
    this.loadTransacciones(1);
  }

  limpiarFiltros(): void {
    this.filtros = {
      tipo: '',
      estado: '',
      agente: '',
      fechaDesde: '',
      fechaHasta: ''
    };
    this.loadTransacciones(1);
  }

  calcularComisionTotal(): number {
    return this.operaciones
      .filter(op => (op as any).estado === 3)
      .reduce((total, op) => total + ((op as any).comision || 0), 0);
  }

  obtenerColorEstado(estadoId?: number): string {
    if (estadoId == null) return '#6c757d';
    const estado = this.estadosOperacion.find(e => e.id === estadoId);
    return estado ? estado.color : '#6c757d';
  }

  obtenerEstadoNombre(estadoId?: number): string {
    if (estadoId == null) return 'Sin estado';
    const estado = this.estadosOperacion.find(e => e.id === estadoId);
    return estado ? estado.nombre : 'Sin estado';
  }

  obtenerTipoNombre(tipo?: string): string {
    const tipoObj = this.tiposOperacion.find(t => t.id === tipo);
    return tipoObj ? tipoObj.nombre : (tipo ?? '');
  }
}
