import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalService, Consulta } from '../../../services/portal.service';

@Component({
  selector: 'app-public-mis-consultas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-mis-consultas.component.html',
  styleUrls: ['./public-mis-consultas.component.css']
})
export class PublicMisConsultasComponent implements OnInit {
  consultas: Consulta[] = [];
  loading = true;
  error = '';

  constructor(private portalService: PortalService) { }

  ngOnInit(): void {
    this.cargarConsultas();
  }

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

  getEstadoClass(estado: string): string {
    const e = estado.toLowerCase();
    if (e.includes('nuevo'))       return 'info';
    if (e.includes('contactado'))  return 'warning';
    if (e.includes('calificado'))  return 'primary';
    if (e.includes('visita'))      return 'muted';
    if (e.includes('negociaci'))   return 'danger';
    if (e.includes('cerrado'))     return 'success';
    return 'info';
  }
}
