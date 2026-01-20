import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Lead, LeadsService } from '../../leads.service';
import { AuthService } from '../../../auth/auth.service';


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

  // Estados del pipeline
  estadosLead = [
    { id: 1, nombre: 'Nuevo', color: '#17a2b8' },
    { id: 2, nombre: 'Contactado', color: '#ffc107' },
    { id: 3, nombre: 'Calificado', color: '#fd7e14' },
    { id: 4, nombre: 'Visita', color: '#6f42c1' },
    { id: 5, nombre: 'Negociación', color: '#e83e8c' },
    { id: 6, nombre: 'Cerrado', color: '#28a745' }
  ];

  // Permisos
  puedeAsignar = false;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.verificarPermisos();
  }

  verificarPermisos(): void {
    const rol = this.authService.getUserRole();
    this.puedeAsignar = rol === 'Administrador' || rol === 'Supervisor';
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
    this.cerrar.emit();
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
    if (!this.lead?.observaciones) return [];

    const items: any[] = [];
    const lines = this.lead.observaciones.split('\n\n');

    lines.forEach((line, index) => {
      if (line.trim()) {
        if (line.includes('[IMPORTANTE]')) {
          items.push({
            type: 'important',
            icon: 'exclamation-triangle',
            color: 'warning',
            title: 'Nota Importante',
            content: line.replace('[IMPORTANTE]', '').trim(),
            date: this.extractDateFromLine(line) || this.lead?.fechaCreacion
          });
        } else if (line.includes('Reasignado:')) {
          items.push({
            type: 'reassign',
            icon: 'user-cog',
            color: 'info',
            title: 'Reasignación',
            content: line,
            date: this.extractDateFromLine(line) || this.lead?.fechaCreacion
          });
        } else if (line.includes('Marcado como PERDIDO:')) {
          items.push({
            type: 'lost',
            icon: 'times-circle',
            color: 'danger',
            title: 'Marcado como Perdido',
            content: line,
            date: this.extractDateFromLine(line) || this.lead?.fechaCreacion
          });
        } else if (line.includes(':')) {
          items.push({
            type: 'note',
            icon: 'sticky-note',
            color: 'info',
            title: 'Nota',
            content: line,
            date: this.extractDateFromLine(line) || this.lead?.fechaCreacion
          });
        }
      }
    });

    return items.reverse(); // Show most recent first
  }

  private extractDateFromLine(line: string): string | null {
    // Extract date from format: "DD/MM/YYYY HH:mm"
    const dateMatch = line.match(/(\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2})/);
    return dateMatch ? dateMatch[1] : null;
  }
}

