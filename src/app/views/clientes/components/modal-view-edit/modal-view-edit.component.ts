import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ClientesService } from '../../service/clientes.service';
import { AlertaService } from '../../../../services/alerta.service';
import { take } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, NgbTooltipModule],
  selector: 'app-modal-view-edit',
  templateUrl: './modal-view-edit.component.html',
  styleUrls: ['../../../../../styles/modal-style.css']
})
export class ModalViewEditComponent implements OnInit {
  @Input() cliente: any | null = null;

  editedCliente: any = {
    id: null,
    idInmobiliaria: null,
    nombreCompleto: '',
    dni: '',
    email: '',
    telefono: '',
    activo: true
  };

  isSaving = false;

  // nuevo: propiedades para imitar clases/estado del modal de usuario
  mode: 'edit' | 'create' = 'create';
  editingEnabled = true;
  initialData: any = null;

  constructor(
    public activeModal: NgbActiveModal,
    private clientesService: ClientesService,
    private alertaService: AlertaService
  ) { }

  ngOnInit(): void {
    if (this.cliente) {
      // prefer nombreCompleto if provided, otherwise build from nombre + apellido
      const nombreCompleto = this.cliente.nombreCompleto
        || [this.cliente.nombre, this.cliente.apellido].filter(Boolean).join(' ').trim();
      this.editedCliente = { ...this.cliente, nombreCompleto };
      this.mode = 'edit';
      this.initialData = this.cliente;
      // por defecto no forzamos modo lectura; conservar editingEnabled = true
    } else {
      this.mode = 'create';
    }
  }

  save() {
    if (this.isSaving) return;
    this.isSaving = true;

    const payloadCreate = {
      nombreCompleto: this.editedCliente.nombreCompleto,
      email: this.editedCliente.email,
      telefono: this.editedCliente.telefono,
      dni: this.editedCliente.dni,
      idInmobiliaria: this.editedCliente.idInmobiliaria
    };

    if (this.editedCliente && this.editedCliente.id) {
      const updatePayload: any = {
        id: this.editedCliente.id,
        nombreCompleto: payloadCreate.nombreCompleto,
        email: payloadCreate.email,
        telefono: payloadCreate.telefono,
        dni: payloadCreate.dni,
        activo: this.editedCliente.activo,
        idInmobiliaria: payloadCreate.idInmobiliaria
      };

      this.clientesService.updateCliente(this.editedCliente.id, updatePayload)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.isSaving = false;
            if (res && res.success) {
              this.alertaService.success(res.message || 'Cliente actualizado');
              this.activeModal.close(res.data ?? this.editedCliente);
            } else {
              this.alertaService.error(res.message || 'Error al actualizar cliente');
            }
          },
          error: () => {
            this.isSaving = false;
            this.alertaService.error('Error de red al actualizar cliente');
          }
        });
    } else {
      this.clientesService.createCliente(payloadCreate)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.isSaving = false;
            if (res && res.success) {
              this.alertaService.success(res.message || 'Cliente creado');
              this.activeModal.close(res.data ?? this.editedCliente);
            } else {
              this.alertaService.error(res.message || 'Error al crear cliente');
            }
          },
          error: () => {
            this.isSaving = false;
            this.alertaService.error('Error de red al crear cliente');
          }
        });
    }
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
