import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Lead, UpdateLeadDto } from '../../service/leads.service';
import { AuthService } from '../../../auth/auth.service';
import { CboUsuarioComponent } from '../../../usuario/components/cbo-usuario/cbo-usuario.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { ToastModalComponent } from '../../../../shared/components/toast-modal/toast-modal.component';

@Component({
  selector: 'app-modal-edit-lead',
  imports: [
    CommonModule,
    FormsModule,
    CboUsuarioComponent,
    SpinnerComponent,
    ToastModalComponent // Ensure ToastModalComponent is included here
  ],
  templateUrl: './modal-edit-lead.component.html',
  styleUrl: './modal-edit-lead.component.css'
})
export class ModalEditLeadComponent implements OnInit, OnChanges {
  @Input() lead: Lead | null = null;
  @Input() mostrar: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<UpdateLeadDto>();

  leadOriginal: Lead | null = null;
  leadEdicion: UpdateLeadDto = this.getEmptyLead();
  loading = false;
  mostrarToastGuardar = false; // Control for success toast

  // Permisos
  puedeAsignar = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.verificarPermisos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lead'] && this.lead) {
      this.leadOriginal = this.lead;
      this.resetearFormulario();
    }
    if (changes['mostrar'] && this.mostrar && this.lead) {
      this.resetearFormulario();
    }
  }

  private verificarPermisos(): void {
    const rol = this.authService.getUserRole();
    this.puedeAsignar = rol === 'Administrador' || rol === 'Supervisor';
  }

  private resetearFormulario(): void {
    if (this.lead) {
      this.leadEdicion = {
        id: this.lead.id,
        nombreCompleto: this.lead.nombreCompleto || '',
        email: this.lead.email || '',
        telefono: this.lead.telefono || '',
        idFuente: this.lead.idFuente || 1,
        idUsuarioAsignado: this.lead.idUsuarioAsignado,
        idPropiedad: this.lead.idPropiedad,
        idEstado: this.lead.idEstado,
        observaciones: this.lead.observaciones || '',
        activo: this.lead.activo !== false
      };
    } else {
      this.leadEdicion = this.getEmptyLead();
    }
  }

  private getEmptyLead(): UpdateLeadDto {
    return {
      id: 0,
      nombreCompleto: '',
      email: '',
      telefono: '',
      idFuente: 1,
      idUsuarioAsignado: undefined,
      idPropiedad: undefined,
      idEstado: 1,
      observaciones: '',
      activo: true
    };
  }

  cerrarModal(): void {
    this.resetearFormulario();
    this.cerrar.emit();
  }

  guardarCambios(): void {
    if (!this.leadEdicion.nombreCompleto.trim()) {
      return;
    }

    this.loading = true;

    // Emit the updated lead data
    this.guardar.emit(this.leadEdicion);

    // Simulate a delay for the spinner
    setTimeout(() => {
      this.onGuardadoCompleto();
    }, 1000); // Example delay
  }

  onGuardadoCompleto(): void {
    this.loading = false;
    this.mostrarToastGuardar = true; // Show success toast
    setTimeout(() => {
      this.mostrarToastGuardar = false; // Hide toast after a delay
      this.cerrarModal();
    }, 3000); // Example duration for toast visibility
  }

  onErrorGuardado(): void {
    this.loading = false;
  }

  onUsuarioAsignadoChange(userId: number | null): void {
    this.leadEdicion.idUsuarioAsignado = userId || undefined;
  }
}
