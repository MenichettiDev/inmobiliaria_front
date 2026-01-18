import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LeadsService, Lead, CreateLeadDto, UpdateLeadDto, CambiarEstadoLeadDto, AsignarLeadDto, PaginatedResponse } from '../leads.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-visor-leads',
  imports: [CommonModule, FormsModule, RouterModule],
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
  mostrarModalCrear = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;
  leadSeleccionado: Lead | null = null;

  // Formularios
  nuevoLead: CreateLeadDto = {
    nombreCompleto: '',
    email: '',
    telefono: '',
    idFuente: 1,
    observaciones: ''
  };

  leadEdicion: UpdateLeadDto = {
    id: 0,
    nombreCompleto: '',
    email: '',
    telefono: '',
    idFuente: 1,
    observaciones: '',
    activo: true
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
  abrirModalCrear(): void {
    this.nuevoLead = {
      nombreCompleto: '',
      email: '',
      telefono: '',
      idFuente: 1,
      observaciones: ''
    };
    this.mostrarModalCrear = true;
  }

  crearLead(): void {
    this.loading = true;
    this.leadsService.crearLead(this.nuevoLead).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarModalCrear = false;
          this.cargarLeads();
        } else {
          this.error = response.message || 'Error al crear lead';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al crear lead';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  abrirModalEditar(lead: Lead): void {
    this.leadEdicion = {
      id: lead.id,
      nombreCompleto: lead.nombreCompleto,
      email: lead.email || '',
      telefono: lead.telefono || '',
      idFuente: lead.idFuente,
      idUsuarioAsignado: lead.idUsuarioAsignado,
      idPropiedad: lead.idPropiedad,
      observaciones: lead.observaciones || '',
      activo: lead.activo
    };
    this.mostrarModalEditar = true;
  }

  actualizarLead(): void {
    this.loading = true;
    this.leadsService.actualizarLead(this.leadEdicion.id, this.leadEdicion).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarModalEditar = false;
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

  cambiarEstadoLead(lead: Lead, nuevoEstadoId: number): void {
    const cambioDto: CambiarEstadoLeadDto = {
      idLead: lead.id,
      idEstadoNuevo: nuevoEstadoId
    };

    this.leadsService.cambiarEstado(cambioDto).subscribe({
      next: (response) => {
        if (response.success) {
          this.cargarLeads();
        } else {
          this.error = response.message || 'Error al cambiar estado';
        }
      },
      error: (err) => {
        this.error = 'Error al cambiar estado';
        console.error('Error:', err);
      }
    });
  }

  // Utility methods
  obtenerEstadoNombre(estadoId: number): string {
    const estado = this.estadosLead.find(e => e.id === estadoId);
    return estado ? estado.nombre : 'Sin estado';
  }

  obtenerEstadoColor(estadoId: number): string {
    const estado = this.estadosLead.find(e => e.id === estadoId);
    return estado ? estado.color : '#6c757d';
  }

  obtenerLeadsPorEstado(estadoId: number): Lead[] {
    return this.leads.filter(lead => lead.idEstado === estadoId) || []; // Ensure it always returns an array
  }

  cerrarModal(): void {
    this.mostrarModalCrear = false;
    this.mostrarModalEditar = false;
    this.mostrarModalEliminar = false;
    this.error = '';
  }

  get paginasArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
