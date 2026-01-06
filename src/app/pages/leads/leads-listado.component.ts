import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LeadsService } from './leads.service';

@Component({
  selector: 'app-leads-listado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './leads-listado.component.html',
  // styleUrls: ['./leads-listado.component.css']
})
export class LeadsListadoComponent implements OnInit {
  // Estados del pipeline
  estadosLead = [
    { id: 1, nombre: 'Nuevo', color: '#17a2b8' },
    { id: 2, nombre: 'Contactado', color: '#ffc107' },
    { id: 3, nombre: 'Calificado', color: '#fd7e14' },
    { id: 4, nombre: 'Visita', color: '#6f42c1' },
    { id: 5, nombre: 'Negociación', color: '#e83e8c' },
    { id: 6, nombre: 'Cerrado', color: '#28a745' }
  ];

  // Leads de ejemplo
  leads = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      telefono: '+54 11 1234-5678',
      email: 'juan.perez@email.com',
      estado: 1,
      propiedadInteres: 'Casa en Palermo',
      agente: 'María González',
      fechaCreacion: '2024-01-15',
      ultimaActividad: '2024-01-15 10:30',
      notas: 'Interesado en mudarse pronto'
    },
    {
      id: 2,
      nombre: 'Ana Rodríguez',
      telefono: '+54 11 8765-4321',
      email: 'ana.rodriguez@email.com',
      estado: 3,
      propiedadInteres: 'Departamento en Recoleta',
      agente: 'Carlos López',
      fechaCreacion: '2024-01-12',
      ultimaActividad: '2024-01-14 16:45',
      notas: 'Solicita visita para el fin de semana'
    }
  ];

  // Vista actual (lista o kanban)
  vistaActual = 'lista';

  constructor(private leadsService: LeadsService) { }

  ngOnInit(): void {
  }

  get leadsFiltrados() {
    return this.leads; // Por ahora sin filtros, se puede expandir
  }

  crearLead(): void {
    console.log('Crear nuevo lead');
    // Implementar navegación o modal
  }

  cambiarVista(vista: string): void {
    this.vistaActual = vista;
  }

  obtenerEstadoNombre(estadoId: number): string {
    const estado = this.estadosLead.find(e => e.id === estadoId);
    return estado ? estado.nombre : 'Sin estado';
  }

  obtenerEstadoColor(estadoId: number): string {
    const estado = this.estadosLead.find(e => e.id === estadoId);
    return estado ? estado.color : '#6c757d';
  }

  obtenerLeadsPorEstado(estadoId: number) {
    return this.leads.filter(lead => lead.estado === estadoId);
  }

  editarLead(id: number): void {
    console.log('Editar lead:', id);
  }

  cambiarEstadoLead(leadId: number, nuevoEstado: number): void {
    const lead = this.leads.find(l => l.id === leadId);
    if (lead) {
      lead.estado = nuevoEstado;
    }
  }

  registrarActividad(id: number): void {
    console.log('Registrar actividad para lead:', id);
  }
}
