import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LeadsService, Lead, CreateLeadDto, UpdateLeadDto, CambiarEstadoLeadDto, AsignarLeadDto, PaginatedResponse } from '../service/leads.service';
import { AuthService } from '../../auth/auth.service';
import { ModalDetailsLeadComponent } from '../components/modal-details-lead/modal-details-lead.component';
import { ModalEditLeadComponent } from '../components/modal-edit-lead/modal-edit-lead.component';
import { ModalCreateLeadComponent } from '../components/modal-create-lead/modal-create-lead.component';

@Component({
  selector: 'app-visor-leads',
  imports: [CommonModule, FormsModule, RouterModule, ModalDetailsLeadComponent, ModalEditLeadComponent, ModalCreateLeadComponent],
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
    activo: null as boolean | null
  };

  // Vista actual
  vistaActual = 'lista';

  // Modales
  mostrarModalCreacion = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;
  mostrarModalCambiarEstado = false;
  mostrarModalReasignar = false;
  mostrarModalPerdido = false;
  mostrarModalNota = false;
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

  // Formularios para nuevas acciones
  cambioEstado = {
    nuevoEstadoId: 0,
    motivo: ''
  };

  reasignacion = {
    nuevoUsuarioId: 0,
    motivo: ''
  };

  perdidoData = {
    motivo: '',
    observaciones: ''
  };

  notaRapida = {
    contenido: '',
    importante: false
  };

  // Usuario actual
  usuarioActual: any = null;
  puedeEliminar = false;
  puedeAsignar = false;

  constructor(
    private leadsService: LeadsService,
    private authService: AuthService
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
    this.mostrarModalCreacion = true;
  }

  cerrarModalCreacion(): void {
    this.mostrarModalCreacion = false;
  }

  onLeadCreado(lead: any): void {
    this.cargarLeads();
  }

  abrirModalEditar(lead: Lead): void {
    this.leadSeleccionado = lead;
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.leadSeleccionado = null;
  }

  onGuardarEdicionLead(leadActualizado: UpdateLeadDto): void {
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

  // Nuevos métodos para dropdown actions
  abrirModalCambiarEstado(lead: Lead): void {
    this.leadSeleccionado = lead;
    this.cambioEstado = {
      nuevoEstadoId: 0,
      motivo: ''
    };
    this.mostrarModalCambiarEstado = true;
  }

  abrirModalReasignar(lead: Lead): void {
    this.leadSeleccionado = lead;
    this.reasignacion = {
      nuevoUsuarioId: 0,
      motivo: ''
    };
    this.mostrarModalReasignar = true;
  }

  abrirModalPerdido(lead: Lead): void {
    this.leadSeleccionado = lead;
    this.perdidoData = {
      motivo: '',
      observaciones: ''
    };
    this.mostrarModalPerdido = true;
  }

  abrirModalNota(lead: Lead): void {
    this.leadSeleccionado = lead;
    this.notaRapida = {
      contenido: '',
      importante: false
    };
    this.mostrarModalNota = true;
  }

  procesarCambioEstado(): void {
    if (!this.leadSeleccionado || !this.cambioEstado.nuevoEstadoId) return;

    this.loading = true;
    const cambioDto: CambiarEstadoLeadDto = {
      idLead: this.leadSeleccionado.id,
      idEstadoNuevo: this.cambioEstado.nuevoEstadoId
    };

    this.leadsService.cambiarEstado(cambioDto).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarModalCambiarEstado = false;
          this.cargarLeads();
        } else {
          this.error = response.message || 'Error al cambiar estado';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cambiar estado';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  procesarReasignacion(): void {
    if (!this.leadSeleccionado || !this.reasignacion.nuevoUsuarioId) return;

    this.loading = true;
    // Update lead with new assigned user
    const updateDto: UpdateLeadDto = {
      id: this.leadSeleccionado.id,
      nombreCompleto: this.leadSeleccionado.nombreCompleto,
      email: this.leadSeleccionado.email || '',
      telefono: this.leadSeleccionado.telefono || '',
      idFuente: this.leadSeleccionado.idFuente,
      idUsuarioAsignado: this.reasignacion.nuevoUsuarioId,
      idPropiedad: this.leadSeleccionado.idPropiedad,
      observaciones: `${this.leadSeleccionado.observaciones || ''}\n\nReasignado: ${this.reasignacion.motivo}`,
      activo: this.leadSeleccionado.activo
    };

    this.leadsService.actualizarLead(this.leadSeleccionado.id, updateDto).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.mostrarModalReasignar = false;
          this.cargarLeads();
        } else {
          this.error = response.message || 'Error al reasignar lead';
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al reasignar lead';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  marcarComoPerdido(): void {
    if (!this.leadSeleccionado) return;

    this.loading = true;
    // Assuming we mark as lost by setting active to false and updating with observations
    const updateDto: UpdateLeadDto = {
      id: this.leadSeleccionado.id,
      nombreCompleto: this.leadSeleccionado.nombreCompleto,
      email: this.leadSeleccionado.email || '',
      telefono: this.leadSeleccionado.telefono || '',
      idFuente: this.leadSeleccionado.idFuente,
      observaciones: `${this.leadSeleccionado.observaciones || ''}\n\nMarcado como PERDIDO: ${this.perdidoData.motivo}\n${this.perdidoData.observaciones}`,
      activo: false
    };

    this.leadsService.actualizarLead(this.leadSeleccionado.id, updateDto).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarModalPerdido = false;
          this.cargarLeads();
        } else {
          this.error = response.message || 'Error al marcar como perdido';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al marcar como perdido';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  agregarNotaRapida(): void {
    if (!this.leadSeleccionado || !this.notaRapida.contenido.trim()) return;

    this.loading = true;
    const marcaImportante = this.notaRapida.importante ? '[IMPORTANTE] ' : '';
    const fechaActual = new Date().toLocaleString();
    const nuevaNota = `${marcaImportante}${fechaActual}: ${this.notaRapida.contenido}`;

    const updateDto: UpdateLeadDto = {
      id: this.leadSeleccionado.id,
      nombreCompleto: this.leadSeleccionado.nombreCompleto,
      email: this.leadSeleccionado.email || '',
      telefono: this.leadSeleccionado.telefono || '',
      idFuente: this.leadSeleccionado.idFuente,
      observaciones: `${this.leadSeleccionado.observaciones || ''}\n\n${nuevaNota}`,
      activo: this.leadSeleccionado.activo
    };

    this.leadsService.actualizarLead(this.leadSeleccionado.id, updateDto).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarModalNota = false;
          this.cargarLeads();
        } else {
          this.error = response.message || 'Error al agregar nota';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al agregar nota';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  // Modal Details Handlers
  abrirModalDetalle(lead: Lead): void {
    this.leadSeleccionado = lead;
    this.mostrarModalDetalle = true;
  }

  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.leadSeleccionado = null;
  }

  onModalDetalleEditar(lead: Lead): void {
    this.mostrarModalDetalle = false;
    this.abrirModalEditar(lead);
  }

  onModalDetalleCambiarEstado(lead: Lead): void {
    this.mostrarModalDetalle = false;
    this.abrirModalCambiarEstado(lead);
  }

  onModalDetalleReasignar(lead: Lead): void {
    this.mostrarModalDetalle = false;
    this.abrirModalReasignar(lead);
  }

  onModalDetalleMarcarPerdido(lead: Lead): void {
    this.mostrarModalDetalle = false;
    this.abrirModalPerdido(lead);
  }

  onModalDetalleAgregarNota(lead: Lead): void {
    this.mostrarModalDetalle = false;
    this.abrirModalNota(lead);
  }

  cerrarModal(): void {
    this.mostrarModalEliminar = false;
    this.mostrarModalCambiarEstado = false;
    this.mostrarModalReasignar = false;
    this.mostrarModalPerdido = false;
    this.mostrarModalNota = false;
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
