import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalService, Consulta } from '../../../services/portal.service';

@Component({
  selector: 'app-public-mis-consultas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="consultas-container">
      <div class="container">
        <h1>Mis Consultas</h1>
        <p class="subtitle">Historial de contactos que has enviado a inmobiliarias</p>

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
        <div *ngIf="!loading && consultas.length === 0 && !error" class="empty-state">
          <i class="fas fa-envelope"></i>
          <h2>Sin consultas aún</h2>
          <p>No has enviado consultas a inmobiliarias. Explora propiedades y contáctanos.</p>
        </div>

        <!-- Table de Consultas -->
        <div *ngIf="!loading && consultas.length > 0" class="consultas-table">
          <table>
            <thead>
              <tr>
                <th>Propiedad</th>
                <th>Mensaje</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let consulta of consultas">
                <td class="propiedad">
                  <strong>{{ consulta.propiedadTitulo }}</strong>
                </td>
                <td class="mensaje">
                  {{ consulta.mensaje || '(Sin mensaje)' }}
                </td>
                <td class="estado">
                  <span class="badge" [ngClass]="'badge-' + getEstadoClass(consulta.estadoNombre)">
                    {{ consulta.estadoNombre }}
                  </span>
                </td>
                <td class="fecha">
                  {{ consulta.creadoEn | date:'short' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .consultas-container {
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

    .consultas-table {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow-x: auto;
      margin-top: 2rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background: #f8f9fa;
      border-bottom: 2px solid #dee2e6;
    }

    th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #333;
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid #dee2e6;
      color: #666;
    }

    tbody tr:hover {
      background: #f9f9f9;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    .propiedad {
      font-weight: 500;
      color: #333;
    }

    .mensaje {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.9rem;
    }

    .estado {
      text-align: center;
    }

    .badge {
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 500;
      display: inline-block;
    }

    .badge-nuevo {
      background: #cfe2ff;
      color: #084298;
    }

    .badge-contactado {
      background: #fff3cd;
      color: #664d03;
    }

    .badge-calificado {
      background: #cff4fc;
      color: #055160;
    }

    .badge-visita {
      background: #e2e3e5;
      color: #383d41;
    }

    .badge-negociacion {
      background: #f8d7da;
      color: #842029;
    }

    .badge-cerrado {
      background: #d1e7dd;
      color: #0f5132;
    }

    .fecha {
      font-size: 0.9rem;
      color: #999;
      white-space: nowrap;
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
      .consultas-table {
        font-size: 0.9rem;
      }

      th, td {
        padding: 0.75rem 0.5rem;
      }

      .mensaje {
        max-width: 150px;
      }
    }
  `]
})
export class PublicMisConsultasComponent implements OnInit {
  consultas: Consulta[] = [];
  loading = true;
  error = '';

  constructor(private portalService: PortalService) { }

  ngOnInit(): void {
    this.cargarConsultas();
  }

  /**
   * Carga las consultas del usuario
   */
  private cargarConsultas(): void {
    this.loading = true;
    this.error = '';

    this.portalService.getConsultas().subscribe({
      next: (response) => {
        this.consultas = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Error al cargar consultas';
      }
    });
  }

  /**
   * Obtiene la clase CSS según el estado
   */
  getEstadoClass(estado: string): string {
    const estado_lower = estado.toLowerCase();
    if (estado_lower.includes('nuevo')) return 'nuevo';
    if (estado_lower.includes('contactado')) return 'contactado';
    if (estado_lower.includes('calificado')) return 'calificado';
    if (estado_lower.includes('visita')) return 'visita';
    if (estado_lower.includes('negociación')) return 'negociacion';
    if (estado_lower.includes('cerrado')) return 'cerrado';
    return 'nuevo';
  }
}
