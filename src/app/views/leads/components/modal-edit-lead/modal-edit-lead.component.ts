import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Lead, UpdateLeadDto, LeadsService } from '../../service/leads.service';
import { AuthService } from '../../../auth/auth.service';
import { CboUsuarioComponent } from '../../../usuario/components/cbo-usuario/cbo-usuario.component';
import { CboEstadoLeadComponent } from '../cbo-estado-lead/cbo-estado-lead.component';
import { CboFuentesComponent } from '../cbo-fuentes/cbo-fuentes.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { ToastModalComponent } from '../../../../shared/components/toast-modal/toast-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CboClientesComponent } from '../../../clientes/components/cbo-clientes/cbo-clientes.component';

@Component({
  selector: 'app-modal-edit-lead',
  imports: [
    CommonModule,
    FormsModule,
    CboUsuarioComponent,
    CboEstadoLeadComponent,
    CboFuentesComponent,
    CboClientesComponent,
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
  // Cliente registrado toggle
  clienteRegistrado: boolean = false;

  constructor(
    private authService: AuthService,
    private leadsService: LeadsService, // Inject LeadsService
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.verificarPermisos();
    this.fetchLeadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lead'] && this.lead) {
      this.fetchLeadData(); // Fetch lead data when the modal is opened
    }
    if (changes['mostrar'] && this.mostrar && this.lead) {
      this.fetchLeadData(); // Fetch lead data when modal visibility changes
    }
  }

  private fetchLeadData(): void {
    if (this.lead?.id) {
      this.loading = true;
      this.leadsService.obtenerLead(this.lead.id).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.leadOriginal = response.data;
            this.resetearFormulario(); // Populate the form with the fetched data
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching lead data:', error);
          this.loading = false;
        }
      });
    }
  }

  private verificarPermisos(): void {
    const rol = this.authService.getUserRole();
    this.puedeAsignar = rol === 'Administrador' || rol === 'Supervisor';
  }

  private resetearFormulario(): void {
    if (this.leadOriginal) {
      this.leadEdicion = {
        id: this.leadOriginal.id,
        nombreCompleto: this.leadOriginal.nombreCompleto || '',
        email: this.leadOriginal.email || '',
        telefono: this.leadOriginal.telefono || '',
        idFuente: this.leadOriginal.idFuente || 1,
        idUsuarioAsignado: this.leadOriginal.idUsuarioAsignado,
        idPropiedad: this.leadOriginal.idPropiedad,
        idEstado: this.leadOriginal.idEstado,
        mensaje: this.leadOriginal.mensaje || '',
        activo: this.leadOriginal.activo !== false
      };
      // Pre-cargar cliente si existe y activar el toggle correspondiente
      if (this.leadOriginal.idCliente !== undefined && this.leadOriginal.idCliente !== null) {
        (this.leadEdicion as any).idCliente = this.leadOriginal.idCliente;
        this.clienteRegistrado = true;
      } else {
        (this.leadEdicion as any).idCliente = undefined;
        this.clienteRegistrado = false;
      }
    } else {
      this.leadEdicion = this.getEmptyLead();
      this.clienteRegistrado = false;
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
      mensaje: '',
      activo: true
    };
  }

  cerrarModal(): void {
    this.activeModal.dismiss();
  }

  guardarCambios(): void {
    if (!this.leadEdicion.nombreCompleto.trim()) {
      return;
    }

    this.loading = true;
    this.leadsService.actualizarLead(this.leadEdicion.id, this.leadEdicion).subscribe({
      next: (response) => {
        // Emitir para el padre por compatibilidad
        this.guardar.emit(this.leadEdicion);
        this.loading = false;
        this.mostrarToastGuardar = true;
        // Cerrar modal después de mostrar toast breve 
        setTimeout(() => {
          this.mostrarToastGuardar = false;
          this.activeModal.close({ success: true, data: response?.data ?? response });
        }, 1500);
      },
      error: (err) => {
        console.error('Error updating lead:', err);
        this.loading = false;
        this.onErrorGuardado();
      }
    });
  }

  onGuardadoCompleto(): void {
    this.loading = false;
    this.mostrarToastGuardar = true; // Show success toast
    setTimeout(() => {
      this.mostrarToastGuardar = false; // Hide toast after a delay
      this.activeModal.close({ success: true });
    }, 3000); // Example duration for toast visibility
  }

  onErrorGuardado(): void {
    this.loading = false;
  }

  onUsuarioAsignadoChange(userId: number | null): void {
    this.leadEdicion.idUsuarioAsignado = userId || undefined;
  }

  onClienteChange(clienteId: number | null): void {
    // Mantener undefined si null
    (this.leadEdicion as any).idCliente = clienteId || undefined;
  }

  onClienteRegistradoChange(): void {
    if (!this.clienteRegistrado) {
      // Si se cambia a "No registrado", limpiar la selección del cliente
      (this.leadEdicion as any).idCliente = undefined;
    }
  }
}
