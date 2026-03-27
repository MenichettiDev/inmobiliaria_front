import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortalService, PropiedadFavorita } from '../../../services/portal.service';

@Component({
  selector: 'app-public-favoritos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="favoritos-container">
      <div class="container">
        <h1>Mis Favoritos</h1>
        <p class="subtitle">Propiedades que has guardado</p>

        <!-- Loading -->
        <div *ngIf="loading" class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <!-- Error -->
        <div *ngIf="error && !loading" class="alert alert-danger">
          <i class="fas fa-exclamation-circle me-2"></i>
          {{ error }}
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && favoritos.length === 0 && !error" class="empty-state">
          <i class="fas fa-heart"></i>
          <h2>Sin favoritos aún</h2>
          <p>No has guardado ninguna propiedad. Explora nuestro catálogo y agrega tus favoritas.</p>
          <a routerLink="/portal/propiedades" class="btn btn-primary">Ver Propiedades</a>
        </div>

        <!-- Grid de Favoritos -->
        <div *ngIf="!loading && favoritos.length > 0" class="favoritos-grid">
          <div *ngFor="let favorito of favoritos" class="favorito-card">
            <div class="imagen-container">
              <img [src]="favorito.propiedadImageUrl || '/assets/images/backgrounds/no-image.jpg'"
                   [alt]="favorito.propiedadTitulo"
                   class="imagen">
              <button class="btn-remove" (click)="removeFavorito(favorito.idPropiedad)" title="Remover de favoritos">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="contenido">
              <h3>{{ favorito.propiedadTitulo }}</h3>
              <p class="direccion">
                <i class="fas fa-map-marker-alt me-1"></i>
                {{ favorito.propiedadDireccion }}
              </p>
              <p class="precio" *ngIf="favorito.propiedadPrecio">
                $ {{ favorito.propiedadPrecio | number:'1.0-0' }}
              </p>
              <a [routerLink]="['/portal/propiedades', favorito.idPropiedad]" class="btn btn-sm btn-outline-primary">
                Ver detalle
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .favoritos-container {
      padding: 2rem 0;
      min-height: 100vh;
      background: #f5f5f5;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    h1 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #666;
      margin-bottom: 2rem;
      font-size: 1rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      background: white;
      border-radius: 8px;
      margin: 2rem 0;
    }

    .empty-state i {
      font-size: 3rem;
      color: #ddd;
      margin-bottom: 1rem;
      display: block;
    }

    .empty-state h2 {
      color: #666;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: #999;
      margin-bottom: 1.5rem;
    }

    .favoritos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .favorito-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
    }

    .favorito-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .imagen-container {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: #f0f0f0;
    }

    .imagen {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .btn-remove {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: rgba(255, 0, 0, 0.8);
      color: white;
      border: none;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      z-index: 10;
    }

    .btn-remove:hover {
      background: rgba(255, 0, 0, 1);
      transform: scale(1.1);
    }

    .contenido {
      padding: 1rem;
    }

    .contenido h3 {
      margin: 0 0 0.5rem;
      font-size: 1.1rem;
      color: #333;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .direccion {
      color: #666;
      font-size: 0.9rem;
      margin: 0.5rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .precio {
      color: #667eea;
      font-weight: 600;
      margin: 0.75rem 0;
      font-size: 1.1rem;
    }

    .btn {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      text-decoration: none;
      transition: all 0.3s;
      font-size: 0.9rem;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
    }

    .btn-outline-primary {
      border: 1px solid #667eea;
      color: #667eea;
    }

    .btn-outline-primary:hover {
      background: #667eea;
      color: white;
    }

    .spinner-border {
      color: #667eea;
    }

    .alert {
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .alert-danger {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    @media (max-width: 768px) {
      .favoritos-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }

      .contenido {
        padding: 0.75rem;
      }

      .contenido h3 {
        font-size: 0.95rem;
      }
    }
  `]
})
export class PublicFavoritosComponent implements OnInit {
  favoritos: PropiedadFavorita[] = [];
  loading = true;
  error = '';

  constructor(private portalService: PortalService) { }

  ngOnInit(): void {
    this.cargarFavoritos();
  }

  /**
   * Carga los favoritos del usuario
   */
  private cargarFavoritos(): void {
    this.loading = true;
    this.error = '';

    this.portalService.getFavoritos().subscribe({
      next: (response) => {
        this.favoritos = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Error al cargar favoritos';
      }
    });
  }

  /**
   * Remueve un favorito
   */
  removeFavorito(propiedadId: number): void {
    if (confirm('¿Estás seguro de que quieres remover este favorito?')) {
      this.portalService.removeFavorito(propiedadId).subscribe({
        next: () => {
          this.favoritos = this.favoritos.filter(f => f.idPropiedad !== propiedadId);
        },
        error: (error) => {
          this.error = error.error?.message || 'Error al remover favorito';
        }
      });
    }
  }
}
