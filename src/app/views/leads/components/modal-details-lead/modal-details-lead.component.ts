import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Lead, LeadsService } from '../../service/leads.service';
import { AuthService } from '../../../auth/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HistorialLeadsService, HistorialLead } from '../../service/historial-leads.service';


@Component({
  selector: 'app-modal-details-lead',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './modal-details-lead.component.html',
  styleUrl: './modal-details-lead.component.css'
})
export class ModalDetailsLeadComponent implements OnInit {
  @Input() lead: Lead | null = null;
  @Input() mostrar: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<Lead>();
  @Output() cambiarEstado = new EventEmitter<Lead>();
  @Output() reasignar = new EventEmitter<Lead>();
  @Output() marcarPerdido = new EventEmitter<Lead>();
  @Output() agregarNota = new EventEmitter<Lead>();

  historialLeads: HistorialLead[] = []; // Store the lead's history

  // Estados del pipeline
  estadosLead = [
    { id: 1, nombre: 'Nuevo', color: '#17a2b8' },
    { id: 2, nombre: 'Contactado', color: '#ffc107' },
    { id: 3, nombre: 'Visita', color: '#fd7e14' },
    { id: 4, nombre: 'Cerrado', color: '#6f42c1' },
    { id: 5, nombre: 'Negociacion', color: '#28a745' },
    { id: 6, nombre: 'Perdido', color: '#e83e8c' }
  ];

  // Permisos
  puedeAsignar = false;

  constructor(
    private authService: AuthService,
    private historialLeadsService: HistorialLeadsService, // Inject HistorialLeadsService
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.verificarPermisos();
    this.cargarHistorial(); // Fetch lead history when modal is initialized
  }

  verificarPermisos(): void {
    const rol = this.authService.getUserRole();
    this.puedeAsignar = rol === 'Administrador' || rol === 'Supervisor';
  }

  cargarHistorial(): void {
    if (this.lead?.id) {
      this.historialLeadsService.obtenerHistorialPorLead(this.lead.id).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.historialLeads = response.data;
          }
        },
        error: (error) => {
          console.error('Error fetching lead history:', error);
        }
      });
    }
  }

  obtenerEstadoNombre(estadoId: number): string {
    const estado = this.estadosLead.find(e => e.id === estadoId);
    return estado ? estado.nombre : 'Sin estado';
  }

  obtenerEstadoColor(estadoId: number): string {
    const estado = this.estadosLead.find(e => e.id === estadoId);
    return estado ? estado.color : '#6c757d';
  }

  cerrarModal(): void {
    this.activeModal.dismiss();
  }

  editarLead(): void {
    if (this.lead) {
      this.editar.emit(this.lead);
    }
  }

  onCambiarEstado(): void {
    if (this.lead) {
      this.cambiarEstado.emit(this.lead);
    }
  }

  onReasignar(): void {
    if (this.lead) {
      this.reasignar.emit(this.lead);
    }
  }

  onMarcarPerdido(): void {
    if (this.lead) {
      this.marcarPerdido.emit(this.lead);
    }
  }

  onAgregarNota(): void {
    if (this.lead) {
      this.agregarNota.emit(this.lead);
    }
  }

  registrarContacto(): void {
    if (this.lead) {
      // Emit note event with a pre-filled contact template
      const contactNote = `Contacto realizado con el cliente: ${this.lead.nombreCompleto}`;
      this.agregarNota.emit({
        ...this.lead,
        observaciones: `${this.lead.observaciones || ''}\n\n${contactNote}`
      });
    }
  }

  // Parse observaciones to show as timeline items
  getTimelineItems(): any[] {
    const items: any[] = [];

    // Add the lead creation as the first timeline item
    if (this.lead) {
      items.push({
        type: 'created',
        icon: 'plus-circle',
        color: 'success',
        title: 'Lead creado',
        content: `Lead creado desde ${this.lead.fuenteNombre || 'fuente desconocida'}`,
        date: this.lead.fechaCreacion
      });
    }

    // Add history items from the backend
    this.historialLeads.forEach(historial => {
      items.push({
        type: 'history',
        icon: 'exchange-alt',
        color: 'primary',
        title: `${historial.estadoAnteriorNombre} → ${historial.estadoNuevoNombre}`,
        content: historial.comentario
          ? `${historial.comentario} (por ${historial.usuarioNombre})`
          : `Cambio realizado por ${historial.usuarioNombre}`,
        date: historial.fechaCambio || this.lead?.fechaCreacion // Use lead's creation date as fallback
      });
    });

    return items.reverse(); // Show most recent first
  }

  private extractDateFromLine(line: string): string | null {
    // Extract date from format: "DD/MM/YYYY HH:mm"
    const dateMatch = line.match(/(\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2})/);
    return dateMatch ? dateMatch[1] : null;
  }
}

