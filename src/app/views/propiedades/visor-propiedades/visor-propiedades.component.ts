import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PropiedadesService } from './../propiedades.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { ToastModalComponent } from '../../../shared/components/toast-modal/toast-modal.component';
import { take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

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
  imagenes?: { id: number; idPropiedad: number; url: string; orden: number; creadoEn: string; propiedadTitulo?: string }[];
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
  imports: [CommonModule, FormsModule, RouterModule, ConfirmModalComponent, ToastModalComponent],
  templateUrl: './visor-propiedades.component.html',
  styleUrl: './visor-propiedades.component.css'
})
export class VisorPropiedadesComponent implements OnInit {
  propiedades: Propiedad[] = [];
  propiedadesFiltradas: Propiedad[] = [];
  // índice de imagen seleccionada por propiedad id
  selectedImageIndex: Record<number, number> = {};
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

  // NUEVO: confirmación y toast
  confirmVisible: boolean = false;
  confirmTargetId: number | null = null;

  toastMessage: string = '';
  toastVisible: boolean = false;
  toastType: 'success' | 'error' | 'warning' = 'success';

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
    console.log('[VisorPropiedades] solicitando propiedades al backend...');

    this.propiedadesService.obtenerPropiedades().subscribe({
      next: (response) => {
        console.log('[VisorPropiedades] respuesta raw obtenerPropiedades:', response);
        if (response.success) {
          this.propiedades = response.data.data || [];
          // inicializar índice de imagen por propiedad solo si tiene imágenes
          this.propiedades.forEach(p => {
            if (p.imagenes && p.imagenes.length > 0) {
              this.selectedImageIndex[p.id] = 0;
            } else {
              this.selectedImageIndex[p.id] = -1;
            }
            console.log(`[VisorPropiedades] propiedad ${p.id} imagenes (raw):`, p.imagenes);
            if (p.imagenes && p.imagenes.length > 0) {
              p.imagenes.forEach((im, idx) => {
                console.log(`[VisorPropiedades] propiedad=${p.id} imagen[${idx}] object:`, im);
                const rawUrl = (im?.url ?? '').toString();
                console.log(`[VisorPropiedades] propiedad=${p.id} imagen[${idx}] url raw length=${rawUrl.length} chars=`, rawUrl.split('').slice(0, 50));
              });
            }
          });
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

  getImageUrl(propiedad: Propiedad, index: number = 0): string {
    const imgs = propiedad.imagenes || [];
    const defaultImg = 'assets/images/backgrounds/vacia.jpg';
    if (!imgs.length) return defaultImg;
    const img = imgs[index] || imgs[0];
    if (!img) return defaultImg;
    let url = (img.url ?? '').toString();
    if (!url || !url.trim()) {
      console.warn(`[VisorPropiedades] propiedad=${propiedad.id} imagen[${index}] url vacía o nula`, img);
      return defaultImg;
    }
    // limpiar y normalizar
    url = url.replace(/\r?\n|\r/g, '').trim();
    // Si ya es URL absoluta, devolverla
    if (/^https?:\/\//i.test(url)) {
      console.log(`[VisorPropiedades] getImageUrl propiedad=${propiedad.id} usando URL absoluta:`, url);
      return url;
    }
    // Determinar raíz del servidor sin el segmento /api
    const apiRoot = environment.apiUrl.replace(/\/api(\/)?$/i, '').replace(/\/$/, '');
    // Si la ruta ya incluye /uploads (ruta relativa típica), unir con apiRoot
    let finalUrl = url;
    if (url.startsWith('/uploads') || url.startsWith('uploads') || url.startsWith('/api/uploads')) {
      // si viene con /api/uploads, eliminar /api al concatenar con apiRoot
      const cleanUrl = url.replace(/^\/?api\/?/, '/').replace(/\/+/, '/');
      finalUrl = apiRoot + (cleanUrl.startsWith('/') ? '' : '/') + cleanUrl;
    } else {
      // ruta relativa genérica: concatenar a apiRoot (fallback)
      finalUrl = apiRoot + (url.startsWith('/') ? '' : '/') + url;
    }
    finalUrl = encodeURI(finalUrl);
    console.log(`[VisorPropiedades] getImageUrl propiedad=${propiedad.id} construida:`, finalUrl);
    return finalUrl || defaultImg;
  }

  setMainImage(propiedad: Propiedad, index: number) {
    if (!propiedad || !propiedad.id) return;
    const imgs = propiedad.imagenes || [];
    if (index < 0 || index >= imgs.length) return;
    this.selectedImageIndex[propiedad.id] = index;
  }

  onImageError(event: Event, propertyId?: number) {
    const imgEl = event.target as HTMLImageElement;
    const failingSrc = imgEl?.src || '(no-src)';
    console.error('[VisorPropiedades] error cargando imagen para propiedad=', propertyId, ' src=', failingSrc);
    if (imgEl) imgEl.src = 'assets/images/backgrounds/vacia.jpg';
    // marcar índice como inválido para evitar reintentos continuos
    if (propertyId && this.selectedImageIndex[propertyId] !== undefined) {
      this.selectedImageIndex[propertyId] = -1;
    }
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
    this.router.navigate(['/propiedades/edit', id]);
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

  solicitarEliminar(id: number): void {
    this.confirmTargetId = id;
    this.confirmVisible = true;
  }

  // NUEVO: reactivar propiedad
  reactivarPropiedad(id: number): void {
    this.loading = true;
    this.propiedadesService.reactivarPropiedad(id).pipe(take(1)).subscribe({
      next: (res: any) => {
        const msg = res?.message || 'Respuesta desconocida del servidor';
        if (res && res.success === true) {
          this.showToast(msg, 'success');
          this.cargarPropiedades();
        } else {
          this.showToast(msg, 'error');
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error al reactivar propiedad:', err);
        const msg = err?.error?.message || err?.message || 'Error al reactivar la propiedad';
        this.showToast(msg, 'error');
        this.loading = false;
      }
    });
  }

  onConfirmDelete(): void {
    if (!this.confirmTargetId) {
      this.confirmVisible = false;
      return;
    }

    const id = this.confirmTargetId;
    this.confirmVisible = false;
    this.confirmTargetId = null;
    this.loading = true;

    this.propiedadesService.eliminarPropiedad(id).pipe(take(1)).subscribe({
      next: (res: any) => {
        // Verificar el flag `success` de la respuesta del servidor
        const msg = res?.message || 'Respuesta desconocida del servidor';
        if (res && res.success === true) {
          this.showToast(msg, 'success');
          // recargar visor solo si fue exitoso
          this.cargarPropiedades();
        } else {
          // Si success es false (aunque HTTP 200), mostrar error y no recargar
          this.showToast(msg, 'error');
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error al eliminar propiedad:', err);
        const msg = err?.error?.message || err?.message || 'Error al eliminar la propiedad';
        this.showToast(msg, 'error');
        this.loading = false;
      }
    });
  }

  onCancelDelete(): void {
    this.confirmTargetId = null;
    this.confirmVisible = false;
  }

  private showToast(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    // ocultar automáticamente tras 2s
    setTimeout(() => (this.toastVisible = false), 2000);
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
