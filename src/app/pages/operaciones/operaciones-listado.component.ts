import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-operaciones-listado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './operaciones-listado.component.html',
  // styleUrls: ['./operaciones-listado.component.css']
})
export class OperacionesListadoComponent implements OnInit {
  // Tipos de operación
  tiposOperacion = [
    { id: 'venta', nombre: 'Venta' },
    { id: 'alquiler', nombre: 'Alquiler' },
    { id: 'reserva', nombre: 'Reserva' }
  ];

  // Estados de operación
  estadosOperacion = [
    { id: 1, nombre: 'En progreso', color: '#ffc107' },
    { id: 2, nombre: 'Documentación', color: '#17a2b8' },
    { id: 3, nombre: 'Finalizada', color: '#28a745' },
    { id: 4, nombre: 'Cancelada', color: '#dc3545' }
  ];

  // Operaciones de ejemplo
  operaciones = [
    {
      id: 1,
      tipo: 'venta',
      propiedad: 'Casa en Palermo',
      cliente: 'Roberto Martínez',
      agente: 'María González',
      monto: 350000,
      comision: 17500,
      estado: 2,
      fechaInicio: '2024-01-10',
      fechaEstimada: '2024-02-15'
    },
    {
      id: 2,
      tipo: 'alquiler',
      propiedad: 'Departamento en Recoleta',
      cliente: 'Laura Fernández',
      agente: 'Carlos López',
      monto: 85000,
      comision: 8500,
      estado: 3,
      fechaInicio: '2024-01-05',
      fechaEstimada: '2024-01-30'
    }
  ];

  // Filtros
  filtros = {
    tipo: '',
    estado: '',
    agente: '',
    fechaDesde: '',
    fechaHasta: ''
  };

  constructor() { }

  ngOnInit(): void {
  }

  crearOperacion(): void {
    console.log('Crear nueva operación');
  }

  editarOperacion(id: number): void {
    console.log('Editar operación:', id);
  }

  cambiarEstado(id: number): void {
    console.log('Cambiar estado operación:', id);
  }

  marcarFinalizada(id: number): void {
    console.log('Marcar como finalizada:', id);
  }

  verDocumentacion(id: number): void {
    console.log('Ver documentación operación:', id);
  }

  get operacionesFiltradas() {
    let filtradas = [...this.operaciones];

    if (this.filtros.tipo) {
      filtradas = filtradas.filter(op => op.tipo === this.filtros.tipo);
    }

    if (this.filtros.estado) {
      filtradas = filtradas.filter(op => op.estado === Number(this.filtros.estado));
    }

    if (this.filtros.agente) {
      filtradas = filtradas.filter(op => op.agente === this.filtros.agente);
    }

    return filtradas;
  }

  obtenerOperacionesPorEstado(estado: number) {
    return this.operaciones.filter(op => op.estado === estado);
  }

  aplicarFiltros(): void {
    console.log('Aplicando filtros operaciones');
  }

  limpiarFiltros(): void {
    this.filtros = {
      tipo: '',
      estado: '',
      agente: '',
      fechaDesde: '',
      fechaHasta: ''
    };
  }

  calcularComisionTotal(): number {
    return this.operaciones
      .filter(op => op.estado === 3)
      .reduce((total, op) => total + op.comision, 0);
  }

  obtenerColorEstado(estadoId: number): string {
    const estado = this.estadosOperacion.find(e => e.id === estadoId);
    return estado ? estado.color : '#6c757d';
  }

  obtenerEstadoNombre(estadoId: number): string {
    const estado = this.estadosOperacion.find(e => e.id === estadoId);
    return estado ? estado.nombre : 'Sin estado';
  }

  obtenerTipoNombre(tipo: string): string {
    const tipoObj = this.tiposOperacion.find(t => t.id === tipo);
    return tipoObj ? tipoObj.nombre : tipo;
  }
}
