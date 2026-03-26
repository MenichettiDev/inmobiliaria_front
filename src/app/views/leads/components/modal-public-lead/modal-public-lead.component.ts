import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeadsService } from '../../service/leads.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface CreatePublicLeadDto {
  nombreCompleto: string;
  email?: string;
  telefono?: string;
  idPropiedad: number;
  observaciones?: string;
}

@Component({
  selector: 'app-modal-public-lead',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-public-lead.component.html',
  styleUrl: './modal-public-lead.component.css'
})
export class ModalPublicLeadComponent implements OnInit {
  @Input() propiedadId: number = 0;
  @Input() propiedadTitulo: string = '';

  loading = false;
  error = '';

  nuevoLead: CreatePublicLeadDto = {
    nombreCompleto: '',
    email: '',
    telefono: '',
    idPropiedad: 0,
    observaciones: ''
  };

  constructor(
    private leadsService: LeadsService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.nuevoLead.idPropiedad = this.propiedadId;
  }

  cerrarModal(): void {
    this.activeModal.dismiss();
  }

  crearLead(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.loading = true;
    this.error = '';

    // Usar idFuente: 1 para "Página Web"
    const leadData = {
      ...this.nuevoLead,
      idFuente: 1
    };

    this.leadsService.crearLead(leadData).subscribe({
      next: (response) => {
        this.loading = false;
        this.resetForm();
        this.activeModal.close({ success: true, data: response.data || response });
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Error al contactar con la inmobiliaria';
        console.error('Error creating lead:', error);
      }
    });
  }

  private isFormValid(): boolean {
    return !!(
      this.nuevoLead.nombreCompleto?.trim() &&
      this.nuevoLead.idPropiedad
    );
  }

  private resetForm(): void {
    this.nuevoLead = {
      nombreCompleto: '',
      email: '',
      telefono: '',
      idPropiedad: this.propiedadId,
      observaciones: ''
    };
    this.error = '';
  }
}
