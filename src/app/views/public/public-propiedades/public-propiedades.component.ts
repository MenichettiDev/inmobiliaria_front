import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PublicPropiedadesService, PropiedadPublicaDto } from '../../../services/public-propiedades.service';
import { ContextService } from '../../../services/context.service';

@Component({
  selector: 'app-public-propiedades',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './public-propiedades.component.html',
  styleUrls: ['./public-propiedades.component.css']
})
export class PublicPropiedadesComponent implements OnInit {
  propiedades: PropiedadPublicaDto[] = [];
  cargando = true;
  error: string | null = null;

  page = 1;
  pageSize = 12;
  totalPages = 0;

  filtroTitulo = '';
  filtroPrecioMin: number | null = null;
  filtroPrecioMax: number | null = null;

  contextoEs: 'PUBLIC' | 'TENANT' = 'PUBLIC';
  subdominioActual: string | null = null;
  imageErrorsHandled = new Set<number>();

  constructor(
    private propiedadesService: PublicPropiedadesService,
    private contextService: ContextService
  ) { }

  ngOnInit(): void {
    this.contextoEs = this.contextService.getContextType();
    this.subdominioActual = this.contextService.getSubdomain();
    this.cargarPropiedades();
  }

  cargarPropiedades(): void {
    this.cargando = true;
    this.error = null;

    const request$ = this.contextoEs === 'TENANT' && this.subdominioActual
      ? this.propiedadesService.getPropiedadesByTenant(
        this.subdominioActual,
        this.page,
        this.pageSize,
        this.filtroTitulo || undefined,
        this.filtroPrecioMin || undefined,
        this.filtroPrecioMax || undefined
      )
      : this.propiedadesService.getPropiedadesPublicas(
        this.page,
        this.pageSize,
        this.filtroTitulo || undefined,
        this.filtroPrecioMin || undefined,
        this.filtroPrecioMax || undefined
      );

    request$.subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.propiedades = response.data.data;
          this.totalPages = response.data.totalPages;
          this.page = response.data.page;
        } else {
          this.error = response.message || 'Error al cargar propiedades';
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = 'Error al cargar las propiedades';
        this.cargando = false;
      }
    });
  }

  onFiltrosChange(): void {
    this.page = 1;
    this.cargarPropiedades();
  }

  paginaAnterior(): void {
    if (this.page > 1) {
      this.page--;
      this.cargarPropiedades();
    }
  }

  paginaSiguiente(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.cargarPropiedades();
    }
  }

  getImageUrl(urlImagenes: string[] | undefined): string {
    if (urlImagenes && urlImagenes.length > 0) {
      return this.propiedadesService.getImageUrl(urlImagenes[0]);
    }
    return '/assets/images/backgrounds/no-image.jpg';
  }

  onImageError(event: Event, propId: number): void {
    if (this.imageErrorsHandled.has(propId)) {
      return;
    }
    this.imageErrorsHandled.add(propId);
    const img = event.target as HTMLImageElement;
    if (!img.src.includes('no-image.jpg')) {
      img.src = '/assets/images/backgrounds/no-image.jpg';
    }
  }
}
