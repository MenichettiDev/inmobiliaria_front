import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LeadsService, Lead, CreateLeadDto, UpdateLeadDto, PaginatedResponse } from '../../service/leads.service';
import { AuthService } from '../../../auth/auth.service';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalCreateLeadComponent } from '../../components/modal-create-lead/modal-create-lead.component';
import { ModalEditLeadComponent } from '../../components/modal-edit-lead/modal-edit-lead.component';
import { ModalDetailsLeadComponent } from '../../components/modal-details-lead/modal-details-lead.component';
import { ModalCambioEstadoComponent } from '../../components/modal-cambio-estado/modal-cambio-estado.component';

@Component({
  selector: 'app-visor-leads',
  imports: [CommonModule, FormsModule, RouterModule, NgbModalModule],
  templateUrl: './visor-leads.component.html',
  styleUrl: './visor-leads.component.css'
})
export class VisorLeadsComponent implements OnInit {
  // Estados del pipeline
  estadosLead = [
    { id: 1, nombre: 'Nuevo', color: '#17a2b8' },
    { id: 2, nombre: 'Contactado', color: '#ffc107' },
    { id: 3, nombre: 'Calificado', color: '#fd7e14' },
    { id: 4, nombre: 'Visita', color: '#6f42c1' },
    { id: 5, nombre: 'Negociación', color: '#e83e8c' },
    { id: 6, nombre: 'Cerrado', color: '#28a745' }
  ];

  // Datos
  leads: Lead[] = [];
  loading = false;
  error = '';

  // Paginación
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  // Filtros
  filtros = {
    nombre: '',
    estadoId: null as number | null,
    fuenteId: null as number | null,
    usuarioAsignadoId: null as number | null,
    propiedadId: null as number | null,
    clienteId: null as number | null,
    activo: null as boolean | null
  };

  // Vista actual
  vistaActual = 'lista';

  // Modales
  mostrarModalCreacion = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;
  mostrarModalDetalle = false;
  leadSeleccionado: Lead | null = null;

  // Formularios
  nuevoLead: CreateLeadDto = {
    nombreCompleto: '',
    email: '',
    telefono: '',
    idFuente: 1,
    observaciones: ''
  };

  // Usuario actual
  usuarioActual: any = null;
  puedeEliminar = false;
  puedeAsignar = false;

  constructor(
    private leadsService: LeadsService,
    private authService: AuthService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.usuarioActual = this.authService.getUser();
    this.verificarPermisos();
    this.cargarLeads();
  }

  verificarPermisos(): void {
    const rol = this.authService.getUserRole();
    this.puedeEliminar = rol === 'Administrador' || rol === 'Supervisor';
    this.puedeAsignar = rol === 'Administrador' || rol === 'Supervisor';
  }

  cargarLeads(): void {
    this.loading = true;
    this.error = '';

    this.leadsService.obtenerLeads(
      this.currentPage,
      this.pageSize,
      this.filtros.nombre || undefined,
      this.filtros.estadoId || undefined,
      this.filtros.fuenteId || undefined,
      this.filtros.usuarioAsignadoId || undefined,
      this.filtros.propiedadId || undefined,
      this.filtros.clienteId || undefined,
      this.filtros.activo === null ? undefined : this.filtros.activo // Convert null to undefined
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.leads = response.data.items;
          this.totalItems = response.data.totalItems;
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.currentPage;
        } else {
          this.error = response.message || 'Error al cargar leads';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error de conexión';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  aplicarFiltros(): void {
    this.currentPage = 1;
    this.cargarLeads();
  }

  limpiarFiltros(): void {
    this.filtros = {
      nombre: '',
      estadoId: null,
      fuenteId: null,
      usuarioAsignadoId: null,
      propiedadId: null,
      clienteId: null,
      activo: null
    };
    this.aplicarFiltros();
  }

  cambiarPagina(pagina: number): void {
    this.currentPage = pagina;
    this.cargarLeads();
  }

  cambiarVista(vista: string): void {
    this.vistaActual = vista;
  }

  // CRUD Operations
  abrirModalCreacion(): void {
    // Abrir modal de creación usando NgbModal
    const modalRef = this.modalService.open(ModalCreateLeadComponent, { centered: true, size: 'lg', backdrop: 'static' });
    modalRef.result.then((result) => {
      if (result && result.success) {
        this.cargarLeads();
      }
    }).catch(() => {
      // dismiss -> no hacer nada
    });
  }

  cerrarModalCreacion(): void {
    // Para compatibilidad, dismiss cualquier modal abierto
    this.modalService.dismissAll();
    this.mostrarModalCreacion = false;
  }

  onLeadCreado(lead: any): void {
    // Si algún flujo emite hacia aquí, recargar
    this.cargarLeads();
  }

  abrirModalEditar(lead: Lead): void {
    // Abrir modal de edición pasando el lead seleccionado
    const modalRef = this.modalService.open(ModalEditLeadComponent, { centered: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.lead = lead;
    modalRef.result.then((result) => {
      if (result && result.success) {
        this.cargarLeads();
      }
    }).catch(() => {
      // dismiss -> no hacer nada
    });
  }

  cerrarModalEditar(): void {
    this.modalService.dismissAll();
    this.mostrarModalEditar = false;
    this.leadSeleccionado = null;
  }

  onGuardarEdicionLead(leadActualizado: UpdateLeadDto): void {
    // Mantener por compatibilidad si algún modal sigue usando output
    this.loading = true;
    this.leadsService.actualizarLead(leadActualizado.id, leadActualizado).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarModalEditar = false;
          this.leadSeleccionado = null;
          this.cargarLeads();
        } else {
          this.error = response.message || 'Error al actualizar lead';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al actualizar lead';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  abrirModalEliminar(lead: Lead): void {
    this.leadSeleccionado = lead;
    this.mostrarModalEliminar = true;
  }

  eliminarLead(): void {
    if (!this.leadSeleccionado) return;

    this.loading = true;
    this.leadsService.eliminarLead(this.leadSeleccionado.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarModalEliminar = false;
          this.cargarLeads();
        } else {
          this.error = response.message || 'Error al eliminar lead';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al eliminar lead';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  // Modal Details Handlers
  abrirModalDetalle(lead: Lead): void {
    // Abrir modal de detalles pasando el lead; permitir que el modal devuelva acciones (p.e. edit)
    const modalRef = this.modalService.open(ModalDetailsLeadComponent, { centered: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.lead = lead;

    modalRef.result.then((result) => {
      if (result) {
        // Si el modal solicita editar, abrir el editor
        if (result.action === 'edit' && result.lead) {
          this.abrirModalEditar(result.lead);
        }
        // Si el modal realizó cambios exitosos
        if (result.success) {
          this.cargarLeads();
        }
      }
    }).catch(() => {
      // dismiss -> no hacer nada
    });
  }

  cerrarModalDetalle(): void {
    this.modalService.dismissAll();
    this.mostrarModalDetalle = false;
    this.leadSeleccionado = null;
  }

  abrirModalCambioEstado(lead: Lead): void {
    const modalRef = this.modalService.open(ModalCambioEstadoComponent, { centered: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.leadId = lead.id;
    modalRef.componentInstance.leadNombre = lead.nombreCompleto ?? '';
    modalRef.componentInstance.leadEmail = lead.email ?? '';
    modalRef.componentInstance.leadTelefono = lead.telefono ?? '';

    modalRef.result.then((result) => {
      // si modal hizo el cambio correctamente -> recargar lista
      if (result && result.success) {
        this.cargarLeads();
      }
    }).catch(() => {
      // dismiss -> no hacer nada
    });
  }

  onEstadoCambiado(data: { id_lead: number; id_estado: number; comentario: string; id_usuario: number }): void {
    this.loading = true;

    // Map the object to match the CambiarEstadoLeadDto type
    const cambiarEstadoDto = {
      idLead: data.id_lead,
      idEstadoNuevo: data.id_estado,
      comentario: data.comentario,
      idUsuario: data.id_usuario
    };

    this.leadsService.cambiarEstado(cambiarEstadoDto).subscribe({
      next: (response) => {
        if (response.success) {
          this.cargarLeads();
        } else {
          this.error = response.message || 'Error al cambiar estado del lead';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cambiar estado del lead';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  cerrarModal(): void {
    this.mostrarModalEliminar = false;
    this.mostrarModalDetalle = false;
    this.error = '';
  }

  get paginasArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  obtenerEstadoNombre(estadoId: number | undefined | null): string {
    if (!estadoId) return 'Sin estado';
    const estado = this.estadosLead.find(e => e.id === estadoId);
    return estado ? estado.nombre : 'Sin estado';
  }

  obtenerEstadoColor(estadoId: number | undefined | null): string {
    if (!estadoId) return '#6c757d';
    const estado = this.estadosLead.find(e => e.id === estadoId);
    return estado ? estado.color : '#6c757d';
  }

  obtenerLeadsPorEstado(estadoId: number | undefined | null): Lead[] {
    if (!estadoId) return [];
    return this.leads.filter(lead => lead.idEstado === estadoId);
  }
}
