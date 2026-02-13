import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeadsService } from '../../../leads/service/leads.service';
import { CboUsuarioComponent } from '../../../usuario/components/cbo-usuario/cbo-usuario.component';
import { CboPropiedadesComponent } from '../../../propiedades/components/cbo-propiedades/cbo-propiedades.component';
import { CboClientesComponent } from '../../../clientes/components/cbo-clientes/cbo-clientes.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface CreateLeadDto {
  nombreCompleto: string;
  email?: string;
  telefono?: string;
  idFuente: number;
  idUsuarioAsignado?: number;
  idPropiedad?: number;
  idCliente?: number;
  observaciones?: string;
}

@Component({
  selector: 'app-modal-create-lead',
  standalone: true,
  imports: [CommonModule, FormsModule, CboUsuarioComponent, CboPropiedadesComponent, CboClientesComponent],
  templateUrl: './modal-create-lead.component.html',
  styleUrl: './modal-create-lead.component.css'
})
export class ModalCreateLeadComponent {
  @Input() mostrar: boolean = false;
  @Output() cerrado = new EventEmitter<void>();
  @Output() leadCreado = new EventEmitter<any>();

  loading: boolean = false;
  error: string = '';
  clienteRegistrado: boolean = false;

  nuevoLead: CreateLeadDto = {
    nombreCompleto: '',
    email: '',
    telefono: '',
    idFuente: 1,
    observaciones: ''
  };

  fuentes = [
    { id: 1, nombre: 'Página Web' },
    { id: 2, nombre: 'Redes Sociales' },
    { id: 3, nombre: 'Referido' },
    { id: 4, nombre: 'Llamada Directa' },
    { id: 5, nombre: 'WhatsApp' },
    { id: 6, nombre: 'Email Marketing' }
  ];

  constructor(private leadsService: LeadsService, public activeModal: NgbActiveModal) { }

  cerrarModal(): void {
    this.activeModal.dismiss();
  }

  crearLead(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.leadsService.crearLead(this.nuevoLead).subscribe({
      next: (response) => {
        this.loading = false;
        this.leadCreado.emit(response.data || response);
        this.resetForm();
        this.activeModal.close({ success: true });
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Error al crear el lead';
        console.error('Error creating lead:', error);
      }
    });
  }

  onUsuarioAsignadoChange(userId: number | null): void {
    this.nuevoLead.idUsuarioAsignado = userId || undefined;
  }

  onPropiedadChange(propiedadId: number | null): void {
    this.nuevoLead.idPropiedad = propiedadId || undefined;
  }

  onClienteChange(clienteId: number | null): void {
    this.nuevoLead.idCliente = clienteId || undefined;
  }

  onClienteRegistradoChange(): void {
    if (!this.clienteRegistrado) {
      // Si cambia a "No registrado", limpiar la selección del cliente
      this.nuevoLead.idCliente = undefined;
    }
  }

  private isFormValid(): boolean {
    return !!(this.nuevoLead.nombreCompleto?.trim());
  }

  private resetForm(): void {
    this.nuevoLead = {
      nombreCompleto: '',
      email: '',
      telefono: '',
      idFuente: 1,
      observaciones: ''
    };
    this.error = '';
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.cerrarModal();
    }
  }
}
