import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PublicPropiedadesService, PropiedadPublicaDto } from '../../../services/public-propiedades.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalPublicLeadComponent } from '../../leads/components/modal-public-lead/modal-public-lead.component';
import { UsuarioWebAuthService } from '../../../services/usuario-web-auth.service';
import { PortalService } from '../../../services/portal.service';

@Component({
  selector: 'app-public-propiedad-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './public-propiedad-detalle.component.html',
  styleUrls: ['./public-propiedad-detalle.component.css']
})
export class PublicPropiedadDetalleComponent implements OnInit {
  propiedad: PropiedadPublicaDto | null = null;
  imagenActual = '';
  cargando = true;
  error: string | null = null;
  propiedadId: number | null = null;
  esFavorito = false;
  cargandoFavorito = false;

  constructor(
    private route: ActivatedRoute,
    private propiedadesService: PublicPropiedadesService,
    private modalService: NgbModal,
    private authService: UsuarioWebAuthService,
    private portalService: PortalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.propiedadId = parseInt(params['id'], 10);
      if (this.propiedadId) {
        this.cargarPropiedad();
        this.cargarEstadoFavorito();
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
          alert('¡Gracias! Tu contacto ha sido enviado a la inmobiliaria.');
        }
      },
      () => { }
    );
  }

  private cargarEstadoFavorito(): void {
    if (!this.authService.isLoggedInSync() || !this.propiedadId) {
      this.esFavorito = false;
      return;
    }

    this.portalService.getFavoritos().subscribe({
      next: (response) => {
        const favoritos = response.data || [];
        this.esFavorito = favoritos.some(f => f.idPropiedad === this.propiedadId);
      },
      error: () => {
        this.esFavorito = false;
      }
    });
  }

  toggleFavorito(): void {
    if (!this.authService.isLoggedInSync()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.propiedadId || this.cargandoFavorito) return;

    this.cargandoFavorito = true;
    this.portalService.toggleFavorito(this.propiedadId).subscribe({
      next: () => {
        this.esFavorito = !this.esFavorito;
        this.cargandoFavorito = false;
      },
      error: () => {
        this.cargandoFavorito = false;
      }
    });
  }
}
