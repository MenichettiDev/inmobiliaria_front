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
  template: `
    <div class="container">
      <div class="propiedades-header">
        <h2>{{ contextoEs === 'TENANT' ? 'Propiedades Disponibles' : 'Catálogo de Propiedades' }}</h2>
        <p class="subtitle">Explora nuestras propiedades publicadas</p>
      </div>

      <!-- Filtros -->
      <div class="filtros">
        <input
          type="text"
          placeholder="Buscar por título..."
          [(ngModel)]="filtroTitulo"
          (keyup)="onFiltrosChange()"
          class="input-filtro"
        >
        <input
          type="number"
          placeholder="Precio mín"
          [(ngModel)]="filtroPrecioMin"
          (change)="onFiltrosChange()"
          class="input-filtro"
        >
        <input
          type="number"
          placeholder="Precio máx"
          [(ngModel)]="filtroPrecioMax"
          (change)="onFiltrosChange()"
          class="input-filtro"
        >
      </div>

      <!-- Cargando -->
      <div *ngIf="cargando" class="loading">
        <p>Cargando propiedades...</p>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="error">
        <p>{{ error }}</p>
      </div>

      <!-- Grid de propiedades -->
      <div class="propiedades-grid" *ngIf="!cargando && !error && propiedades.length > 0">
        <div *ngFor="let prop of propiedades" class="propiedad-card">
          <div class="card-imagen">
            <img [src]="prop.urlImagenes && prop.urlImagenes.length > 0 ? prop.urlImagenes[0] : '/assets/no-image.png'"
                 [alt]="prop.titulo">
            <span class="badge-tenant">{{ prop.inmobiliariaNombre }}</span>
          </div>

          <div class="card-contenido">
            <h3>{{ prop.titulo }}</h3>
            <p class="direccion">📍 {{ prop.direccion }}</p>
            <p class="precio" *ngIf="prop.precio">
              <strong>${{ prop.precio | number:'1.0-0' }}</strong>
            </p>
            <p class="descripcion">{{ prop.descripcion | slice:0:100 }}...</p>
          </div>

          <div class="card-acciones">
            <a [routerLink]="['/portal/propiedades', prop.id]" class="btn-ver">Ver Detalle</a>
          </div>
        </div>
      </div>

      <!-- Sin resultados -->
      <div *ngIf="!cargando && !error && propiedades.length === 0" class="sin-resultados">
        <p>No se encontraron propiedades</p>
      </div>

      <!-- Paginación -->
      <div class="paginacion" *ngIf="totalPages > 1">
        <button (click)="paginaAnterior()" [disabled]="page === 1" class="btn-pag">← Anterior</button>
        <span>Página {{ page }} de {{ totalPages }}</span>
        <button (click)="paginaSiguiente()" [disabled]="page === totalPages" class="btn-pag">Siguiente →</button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .propiedades-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .propiedades-header h2 {
      font-size: 2rem;
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      color: #666;
      margin: 0;
    }

    .filtros {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .input-filtro {
      flex: 1;
      min-width: 150px;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .input-filtro:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .loading, .error, .sin-resultados {
      text-align: center;
      padding: 2rem;
      color: #666;
      font-size: 1.1rem;
    }

    .error {
      background: #fee;
      border: 1px solid #fcc;
      border-radius: 4px;
      color: #c33;
    }

    .propiedades-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .propiedad-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
      display: flex;
      flex-direction: column;
    }

    .propiedad-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .card-imagen {
      position: relative;
      height: 200px;
      overflow: hidden;
      background: #f0f0f0;
    }

    .card-imagen img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .badge-tenant {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(102, 126, 234, 0.9);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: bold;
    }

    .card-contenido {
      flex: 1;
      padding: 1.5rem;
    }

    .card-contenido h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.1rem;
    }

    .direccion {
      color: #666;
      font-size: 0.9rem;
      margin: 0.5rem 0;
    }

    .precio {
      color: #667eea;
      font-size: 1.3rem;
      margin: 0.75rem 0;
    }

    .descripcion {
      color: #888;
      font-size: 0.85rem;
      margin: 0.5rem 0 0 0;
      line-height: 1.4;
    }

    .card-acciones {
      padding: 1rem 1.5rem;
      border-top: 1px solid #eee;
    }

    .btn-ver {
      display: block;
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      text-decoration: none;
      border-radius: 4px;
      transition: opacity 0.3s;
      font-weight: 500;
    }

    .btn-ver:hover {
      opacity: 0.9;
    }

    .paginacion {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      padding: 2rem 0;
    }

    .btn-pag {
      padding: 0.75rem 1.5rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: opacity 0.3s;
    }

    .btn-pag:hover:not(:disabled) {
      opacity: 0.9;
    }

    .btn-pag:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
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

  constructor(
    private propiedadesService: PublicPropiedadesService,
    private contextService: ContextService
  ) {}

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
}
