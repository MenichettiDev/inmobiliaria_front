import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortalService, PropiedadFavorita } from '../../../services/portal.service';

@Component({
  selector: 'app-public-favoritos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './public-favoritos.component.html',
  styleUrls: ['./public-favoritos.component.css']
})
export class PublicFavoritosComponent implements OnInit {
  favoritos: PropiedadFavorita[] = [];
  loading = true;
  error = '';

  constructor(private portalService: PortalService) { }

  ngOnInit(): void {
    this.cargarFavoritos();
  }

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

  removeFavorito(propiedadId: number): void {
    if (confirm('¿Estás seguro de que querés remover este favorito?')) {
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
