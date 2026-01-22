import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ToastModalComponent } from '../../../../shared/components/toast-modal/toast-modal.component';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LeadsService, CambiarEstadoLeadDto } from '../../service/leads.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-modal-cambio-estado',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent, ToastModalComponent, ConfirmModalComponent],
  templateUrl: './modal-cambio-estado.component.html',
  styleUrls: ['./modal-cambio-estado.component.css']
})
export class ModalCambioEstadoComponent {
  @Input() leadId: number | null = null; // ID of the lead
  @Input() leadNombre: string = ''; // Name of the lead
  @Input() leadEmail: string = ''; // Email of the lead
  @Input() leadTelefono: string = ''; // Phone of the lead

  nuevoEstadoId: number = 0; // Selected new state ID
  comentario: string = ''; // Comment for the state change
  loading = false; // Spinner control
  toastVisible = false; // Toast visibility control
  toastMessage = ''; // Toast message
  toastType = 'success'; // Toast type

  mostrarConfirm = false;

  constructor(
    public activeModal: NgbActiveModal,
    private leadsService: LeadsService,
    private authService: AuthService
  ) { }

  cerrarModal(): void {
    this.activeModal.dismiss();
  }

  confirmarCambioEstado(): void {
    this.mostrarConfirm = true;
  }

  // Ejecuta el cambio tras confirmación
  ejecutarCambioEstado(): void {
    if (!this.leadId || this.nuevoEstadoId === 0 || !this.comentario.trim()) {
      this.toastMessage = 'Complete todos los campos.';
      this.toastType = 'warning';
      this.toastVisible = true;
      setTimeout(() => (this.toastVisible = false), 3000);
      this.mostrarConfirm = false;
      return;
    }

    this.mostrarConfirm = false;
    this.loading = true;

    const cambioDto: CambiarEstadoLeadDto = {
      idLead: this.leadId,
      idEstadoNuevo: Number(this.nuevoEstadoId), 
      comentario: this.comentario
    };

    this.leadsService.cambiarEstado(cambioDto).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.toastMessage = 'Estado cambiado correctamente.';
          this.toastType = 'success';
          this.toastVisible = true;
          // cerrar modal indicando éxito para que el caller recargue
          setTimeout(() => {
            this.toastVisible = false;
            this.activeModal.close({ success: true });
          }, 1200);
        } else {
          this.toastMessage = response.message || 'Error al cambiar estado.';
          this.toastType = 'danger';
          this.toastVisible = true;
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastMessage = 'Error de conexión al cambiar estado.';
        this.toastType = 'danger';
        this.toastVisible = true;
        console.error(err);
      }
    });
  }
}
