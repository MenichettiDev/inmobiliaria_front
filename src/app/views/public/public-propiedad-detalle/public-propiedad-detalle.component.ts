import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PublicPropiedadesService, PropiedadPublicaDto } from '../../../services/public-propiedades.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalPublicLeadComponent } from '../../leads/components/modal-public-lead/modal-public-lead.component';

@Component({
  selector: 'app-public-propiedad-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <!-- Navegación -->
      <div class="breadcrumb">
        <a routerLink="/portal/propiedades">← Volver al catálogo</a>
      </div>

      <!-- Cargando -->
      <div *ngIf="cargando" class="loading">
        <p>Cargando propiedad...</p>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="error">
        <p>{{ error }}</p>
      </div>

      <!-- Propiedad -->
      <div *ngIf="!cargando && !error && propiedad" class="detalle-propiedad">
        <!-- Galería de imágenes -->
        <div class="galeria">
          <div class="imagen-principal">
            <img [src]="imagenActual"
                 [alt]="propiedad.titulo"
                 (error)="onImageError($event)">
          </div>
          <div class="thumbnails" *ngIf="propiedad.urlImagenes && propiedad.urlImagenes.length > 1">
            <img *ngFor="let img of propiedad.urlImagenes"
                 [src]="getImageUrlForTemplate(img)"
                 (click)="onThumbnailClick(img)"
                 [class.activa]="imagenActual === getImageUrlForTemplate(img)"
                 [alt]="propiedad.titulo"
                 class="thumbnail"
                 (error)="onThumbnailError($event)">
          </div>
        </div>

        <!-- Información -->
        <div class="info">
          <div class="header-info">
            <h1>{{ propiedad.titulo }}</h1>
            <span class="inmobiliaria-badge">{{ propiedad.inmobiliariaNombre }}</span>
          </div>

          <div class="precio-principal">
            <h2 *ngIf="propiedad.precio">$ {{ propiedad.precio | number:'1.0-0' }}</h2>
          </div>

          <div class="detalles-basicos">
            <div class="detalle-item">
              <span class="label">Dirección:</span>
              <span class="valor">{{ propiedad.direccion }}</span>
            </div>
            <div class="detalle-item" *ngIf="propiedad.publicadaEn">
              <span class="label">Publicada:</span>
              <span class="valor">{{ propiedad.publicadaEn | date:'short' }}</span>
            </div>
          </div>

          <div class="descripcion">
            <h3>Descripción</h3>
            <p>{{ propiedad.descripcion }}</p>
          </div>

          <!-- Botón Contactar -->
          <div class="contacto-button">
            <button class="btn btn-primary btn-lg w-100" (click)="abrirModalContacto()">
              <i class="fas fa-envelope me-2"></i>
              Contactar a {{ propiedad.inmobiliariaNombre }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .breadcrumb {
      margin-bottom: 2rem;
    }

    .breadcrumb a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .loading, .error {
      text-align: center;
      padding: 3rem;
      font-size: 1.1rem;
      color: #666;
    }

    .error {
      background: #fee;
      border: 1px solid #fcc;
      border-radius: 4px;
      color: #c33;
    }

    .detalle-propiedad {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }

    @media (max-width: 768px) {
      .detalle-propiedad {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }

    /* Galería */
    .galeria {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .imagen-principal {
      width: 100%;
      height: 400px;
      background: #f0f0f0;
      border-radius: 8px;
      overflow: hidden;
    }

    .imagen-principal img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumbnails {
      display: flex;
      gap: 0.75rem;
      overflow-x: auto;
    }

    .thumbnail {
      width: 80px;
      height: 80px;
      border-radius: 4px;
      cursor: pointer;
      border: 2px solid transparent;
      object-fit: cover;
      transition: border 0.3s;
    }

    .thumbnail.activa {
      border-color: #667eea;
    }

    /* Información */
    .info {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .header-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .header-info h1 {
      margin: 0;
      font-size: 1.8rem;
      color: #333;
      flex: 1;
    }

    .inmobiliaria-badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
      white-space: nowrap;
    }

    .precio-principal h2 {
      margin: 0;
      font-size: 2rem;
      color: #667eea;
    }

    .detalles-basicos {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .detalle-item {
      display: flex;
      justify-content: space-between;
    }

    .detalle-item .label {
      font-weight: 600;
      color: #333;
    }

    .detalle-item .valor {
      color: #666;
      text-align: right;
    }

    .descripcion,
    .mapa,
    .contacto {
      border-top: 1px solid #eee;
      padding-top: 1.5rem;
    }

    .descripcion h3,
    .mapa h3,
    .contacto h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.2rem;
    }

    .descripcion p {
      margin: 0;
      color: #666;
      line-height: 1.6;
    }

    .mapa-info {
      color: #666;
      font-size: 0.9rem;
      margin: 0 0 0.5rem 0;
    }

    .contacto strong {
      display: block;
      font-size: 1.1rem;
      color: #333;
      margin-top: 1rem;
    }

    .contacto p {
      margin: 0.5rem 0;
      color: #666;
    }

    .contacto-button {
      border-top: 1px solid #eee;
      padding-top: 1.5rem;
      margin-top: 1.5rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      font-weight: 500;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #5568d3 0%, #6a3d99 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-lg {
      padding: 0.75rem 1.5rem;
      font-size: 1.05rem;
    }
  `]
})
export class PublicPropiedadDetalleComponent implements OnInit {
  propiedad: PropiedadPublicaDto | null = null;
  imagenActual = '';
  cargando = true;
  error: string | null = null;
  propiedadId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private propiedadesService: PublicPropiedadesService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.propiedadId = parseInt(params['id'], 10);
      if (this.propiedadId) {
        this.cargarPropiedad();
      }
    });
  }

  cargarPropiedad(): void {
    if (!this.propiedadId) return;

    this.cargando = true;
    this.error = null;

    this.propiedadesService.getPropiedadPublica(this.propiedadId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.propiedad = response.data;
          this.imagenActual =
            this.propiedad.urlImagenes && this.propiedad.urlImagenes.length > 0
              ? this.propiedadesService.getImageUrl(this.propiedad.urlImagenes[0])
              : '/assets/images/backgrounds/no-image.jpg';
        } else {
          this.error = response.message || 'Propiedad no encontrada';
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = 'Error al cargar la propiedad';
        this.cargando = false;
      }
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.includes('no-image.jpg')) {
      img.src = '/assets/images/backgrounds/no-image.jpg';
    }
  }

  onThumbnailError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.includes('no-image.jpg')) {
      img.src = '/assets/images/backgrounds/no-image.jpg';
    }
  }

  getImageUrlForTemplate(imagePath: string): string {
    return this.propiedadesService.getImageUrl(imagePath);
  }

  onThumbnailClick(imagePath: string): void {
    this.imagenActual = this.propiedadesService.getImageUrl(imagePath);
  }

  abrirModalContacto(): void {
    const modalRef = this.modalService.open(ModalPublicLeadComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.propiedadId = this.propiedadId || 0;
    modalRef.componentInstance.propiedadTitulo = this.propiedad?.titulo || '';

    modalRef.result.then(
      (result) => {
        if (result?.success) {
          // Lead creado exitosamente
          alert('¡Gracias! Tu contacto ha sido enviado a la inmobiliaria.');
        }
      },
      (reason) => {
        // Modal cerrado sin acción
      }
    );
  }
}
