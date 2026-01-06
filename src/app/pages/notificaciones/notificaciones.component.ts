import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './notificaciones.component.html',
  // styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {
  // Filtros
  filtros = {
    estado: 'todas', // todas, leidas, no_leidas
    tipo: 'todos', // todos, lead, propiedad, visita, operacion
    fechaDesde: '',
    fechaHasta: ''
  };

  // Notificaciones
  notificaciones = [
    {
      id: 1,
      tipo: 'lead',
      titulo: 'Nuevo lead registrado',
      mensaje: 'Juan Pérez se ha registrado como lead interesado en Casa Palermo',
      fecha: '2024-01-15 14:30',
      leida: false,
      icono: 'bi bi-person-plus',
      color: '#17a2b8',
      enlace: '/leads/1'
    },
    {
      id: 2,
      tipo: 'visita',
      titulo: 'Visita confirmada',
      mensaje: 'Ana Rodríguez confirmó la visita para mañana a las 15:00',
      fecha: '2024-01-15 13:15',
      leida: false,
      icono: 'bi bi-calendar-check',
      color: '#28a745',
      enlace: '/agenda/visita/2'
    },
    {
      id: 3,
      tipo: 'operacion',
      titulo: 'Operación cerrada',
      mensaje: 'Se cerró la venta de Departamento en Recoleta por $280.000',
      fecha: '2024-01-15 11:45',
      leida: true,
      icono: 'bi bi-check-circle',
      color: '#28a745',
      enlace: '/operaciones/3'
    },
    {
      id: 4,
      tipo: 'propiedad',
      titulo: 'Propiedad publicada',
      mensaje: 'Local en Microcentro fue publicado exitosamente',
      fecha: '2024-01-15 09:20',
      leida: true,
      icono: 'bi bi-house-add',
      color: '#6f42c1',
      enlace: '/propiedades/4'
    },
    {
      id: 5,
      tipo: 'sistema',
      titulo: 'Plan actualizado',
      mensaje: 'Tu plan Professional ha sido renovado exitosamente',
      fecha: '2024-01-14 16:00',
      leida: true,
      icono: 'bi bi-star',
      color: '#ffc107',
      enlace: '/plan-facturacion'
    }
  ];

  // Preferencias de notificaciones
  preferencias = {
    email: {
      nuevosLeads: true,
      visitasConfirmadas: true,
      operacionesCerradas: true,
      recordatorios: false
    },
    push: {
      nuevosLeads: true,
      visitasConfirmadas: true,
      operacionesCerradas: false,
      recordatorios: true
    },
    whatsapp: {
      nuevosLeads: false,
      visitasConfirmadas: true,
      operacionesCerradas: false,
      recordatorios: false
    }
  };

  constructor() { }

  ngOnInit(): void {
  }

  get notificacionesFiltradas() {
    let filtradas = [...this.notificaciones];

    // Filtro por estado
    if (this.filtros.estado === 'leidas') {
      filtradas = filtradas.filter(n => n.leida);
    } else if (this.filtros.estado === 'no_leidas') {
      filtradas = filtradas.filter(n => !n.leida);
    }

    // Filtro por tipo
    if (this.filtros.tipo !== 'todos') {
      filtradas = filtradas.filter(n => n.tipo === this.filtros.tipo);
    }

    // Filtros de fecha
    if (this.filtros.fechaDesde) {
      filtradas = filtradas.filter(n => n.fecha >= this.filtros.fechaDesde);
    }
    if (this.filtros.fechaHasta) {
      filtradas = filtradas.filter(n => n.fecha <= this.filtros.fechaHasta);
    }

    return filtradas;
  }

  get cantidadNoLeidas(): number {
    return this.notificaciones.filter(n => !n.leida).length;
  }

  marcarComoLeida(id: number): void {
    const notificacion = this.notificaciones.find(n => n.id === id);
    if (notificacion) {
      notificacion.leida = true;
    }
  }

  marcarTodasLeidas(): void {
    this.notificaciones.forEach(n => n.leida = true);
  }

  eliminarNotificacion(id: number): void {
    this.notificaciones = this.notificaciones.filter(n => n.id !== id);
  }

  limpiarLeidas(): void {
    this.notificaciones = this.notificaciones.filter(n => !n.leida);
  }

  navegarA(enlace: string, id: number): void {
    this.marcarComoLeida(id);
    console.log('Navegar a:', enlace);
    // Aquí implementar navegación
  }

  aplicarFiltros(): void {
    // Los filtros se aplican automáticamente con el getter
    console.log('Filtros aplicados:', this.filtros);
  }

  limpiarFiltros(): void {
    this.filtros = {
      estado: 'todas',
      tipo: 'todos',
      fechaDesde: '',
      fechaHasta: ''
    };
  }

  guardarPreferencias(): void {
    console.log('Guardando preferencias:', this.preferencias);
    // Aquí implementar guardado de preferencias
    alert('Preferencias guardadas correctamente');
  }

  obtenerTiempoRelativo(fecha: string): string {
    const ahora = new Date();
    const fechaNotif = new Date(fecha);
    const diffMs = ahora.getTime() - fechaNotif.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMins / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffMins < 60) {
      return `${diffMins} min`;
    } else if (diffHoras < 24) {
      return `${diffHoras}h`;
    } else {
      return `${diffDias}d`;
    }
  }
}
