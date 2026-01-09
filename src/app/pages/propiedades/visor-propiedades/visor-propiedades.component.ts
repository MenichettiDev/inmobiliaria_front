import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PropiedadesService } from './../propiedades.service';

interface Propiedad {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  direccion: string;
  latitud: number;
  longitud: number;
  publicadaEn: string | null;
  creadoEn: string;
  actualizadoEn: string;
  idInmobiliaria: number;
  idAgenteResponsable: number | null;
  agenteResponsableNombre: string | null;
  idEstadoAdmin: number;
  idEstadoOperativo: number;
  estadoAdminNombre: string;
  estadoOperativoNombre: string;
}

interface Filtros {
  estadoAdministrativo: string;
  estadoOperativo: string;
  agente: string;
  busqueda: string;
}

interface Paginacion {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

@Component({
  selector: 'app-visor-propiedades',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './visor-propiedades.component.html',
  styleUrl: './visor-propiedades.component.css'
})
export class VisorPropiedadesComponent implements OnInit {
  propiedades: Propiedad[] = [];
  propiedadesFiltradas: Propiedad[] = [];
  loading: boolean = false;
  error: string = '';

  filtros: Filtros = {
    estadoAdministrativo: '',
    estadoOperativo: '',
    agente: '',
    busqueda: ''
  };

  paginacion: Paginacion = {
    page: 1,
    pageSize: 9,
    totalRecords: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false
  };

  estadosAdministrativos = [
    { id: 1, nombre: 'Activo' },
    { id: 2, nombre: 'Inactivo' },
    { id: 3, nombre: 'Pendiente' }
  ];

  estadosOperativos = [
    { id: 1, nombre: 'Disponible' },
    { id: 2, nombre: 'Vendido' },
    { id: 3, nombre: 'Reservado' },
    { id: 4, nombre: 'En Proceso' }
  ];

  constructor(
    private propiedadesService: PropiedadesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarPropiedades();
  }

  cargarPropiedades(): void {
    this.loading = true;
    this.error = '';

    this.propiedadesService.obtenerPropiedades().subscribe({
      next: (response) => {
        if (response.success) {
          // Adjust to handle nested data structure
          this.propiedades = response.data.data || [];
          this.paginacion = {
            page: response.data.page,
            pageSize: response.data.pageSize,
            totalRecords: response.data.totalRecords,
            totalPages: response.data.totalPages,
            hasPreviousPage: response.data.hasPreviousPage,
            hasNextPage: response.data.hasNextPage
          };
          this.aplicarFiltros();
        } else {
          this.error = response.message || 'Error desconocido al cargar las propiedades';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar propiedades:', error);
        this.error = 'Error al cargar las propiedades';
        this.loading = false;
        this.propiedades = [];
        this.propiedadesFiltradas = [];
      }
    });
  }

  aplicarFiltros(): void {
    let propiedadesFiltradas = [...this.propiedades];

    // Filtrar por estado administrativo
    if (this.filtros.estadoAdministrativo) {
      propiedadesFiltradas = propiedadesFiltradas.filter(
        p => p.idEstadoAdmin.toString() === this.filtros.estadoAdministrativo
      );
    }

    // Filtrar por estado operativo
    if (this.filtros.estadoOperativo) {
      propiedadesFiltradas = propiedadesFiltradas.filter(
        p => p.idEstadoOperativo.toString() === this.filtros.estadoOperativo
      );
    }

    // Filtrar por agente
    if (this.filtros.agente) {
      const agenteFilter = this.filtros.agente.toLowerCase();
      propiedadesFiltradas = propiedadesFiltradas.filter(
        p => p.agenteResponsableNombre?.toLowerCase().includes(agenteFilter)
      );
    }

    // Filtrar por búsqueda general
    if (this.filtros.busqueda) {
      const busquedaFilter = this.filtros.busqueda.toLowerCase();
      propiedadesFiltradas = propiedadesFiltradas.filter(p =>
        p.titulo.toLowerCase().includes(busquedaFilter) ||
        p.descripcion.toLowerCase().includes(busquedaFilter) ||
        p.direccion.toLowerCase().includes(busquedaFilter)
      );
    }

    this.actualizarPaginacion(propiedadesFiltradas);
  }

  actualizarPaginacion(propiedadesFiltradas: Propiedad[]): void {
    this.paginacion.totalRecords = propiedadesFiltradas.length;
    this.paginacion.totalPages = Math.ceil(this.paginacion.totalRecords / this.paginacion.pageSize);

    // Ajustar página actual si es necesario
    if (this.paginacion.page > this.paginacion.totalPages && this.paginacion.totalPages > 0) {
      this.paginacion.page = this.paginacion.totalPages;
    }

    this.paginacion.hasPreviousPage = this.paginacion.page > 1;
    this.paginacion.hasNextPage = this.paginacion.page < this.paginacion.totalPages;

    // Aplicar paginación
    const startIndex = (this.paginacion.page - 1) * this.paginacion.pageSize;
    const endIndex = startIndex + this.paginacion.pageSize;
    this.propiedadesFiltradas = propiedadesFiltradas.slice(startIndex, endIndex);
  }

  limpiarFiltros(): void {
    this.filtros = {
      estadoAdministrativo: '',
      estadoOperativo: '',
      agente: '',
      busqueda: ''
    };
    this.paginacion.page = 1;
    this.aplicarFiltros();
  }

  paginaAnterior(): void {
    if (this.paginacion.hasPreviousPage) {
      this.paginacion.page--;
      this.aplicarFiltros();
    }
  }

  paginaSiguiente(): void {
    if (this.paginacion.hasNextPage) {
      this.paginacion.page++;
      this.aplicarFiltros();
    }
  }

  crearPropiedad(): void {
    this.router.navigate(['/propiedades/create']);
  }

  editarPropiedad(id: number): void {
    this.router.navigate(['/propiedades/editar', id]);
  }

  cambiarEstado(id: number): void {
    const propiedad = this.propiedades.find(p => p.id === id);
    if (propiedad) {
      const nuevoEstado = propiedad.idEstadoOperativo === 1 ? 'vendido' : 'disponible';

      this.propiedadesService.cambiarEstado(id, nuevoEstado).subscribe({
        next: () => {
          this.cargarPropiedades();
        },
        error: (error) => {
          console.error('Error al cambiar estado:', error);
        }
      });
    }
  }

  publicarPropiedad(id: number): void {
    this.propiedadesService.publicarPropiedad(id).subscribe({
      next: () => {
        this.cargarPropiedades();
      },
      error: (error) => {
        console.error('Error al publicar propiedad:', error);
      }
    });
  }

  obtenerColorEstado(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'disponible':
        return 'success';
      case 'vendido':
        return 'danger';
      case 'reservado':
        return 'warning';
      case 'en proceso':
        return 'info';
      default:
        return 'secondary';
    }
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
