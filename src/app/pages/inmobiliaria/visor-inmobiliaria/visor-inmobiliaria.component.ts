import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InmobiliariaService, Inmobiliaria, InmobiliariaFilters, PaginatedResponse, ApiResponse } from '../inmobiliaria.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-visor-inmobiliaria',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './visor-inmobiliaria.component.html',
  styleUrl: './visor-inmobiliaria.component.css'
})
export class VisorInmobiliariaComponent implements OnInit {
  inmobiliarias: Inmobiliaria[] = [];
  isLoading = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalRecords = 0;
  hasNextPage = false;
  hasPreviousPage = false;

  // Summary statistics
  totalInmobiliarias = 0;
  totalUsuariosGlobal = 0;
  totalPropiedadesGlobal = 0;
  totalLeadsGlobal = 0;

  // User role info
  userRole = 0;
  isProgrammer = false;
  isAdmin = false;

  // Filters
  searchForm: FormGroup;

  // Error handling
  errorMessage = '';
  hasError = false;

  constructor(
    private fb: FormBuilder,
    private inmobiliariaService: InmobiliariaService,
    private authService: AuthService
  ) {
    this.searchForm = this.fb.group({
      nombre: [''],
      planId: [''],
      estadoId: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserRole();
    this.loadInmobiliarias();
  }

  private loadUserRole(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userRole = user.id_acceso || 0;
      this.isProgrammer = this.userRole === 1;
      this.isAdmin = this.userRole === 2;
    }
  }

  loadInmobiliarias(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    const filters: InmobiliariaFilters = {
      page: this.currentPage,
      pageSize: this.pageSize,
      ...this.searchForm.value
    };

    // Remove empty values from filters
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof InmobiliariaFilters] === '' || filters[key as keyof InmobiliariaFilters] === null) {
        delete filters[key as keyof InmobiliariaFilters];
      }
    });

    if (this.isProgrammer) {
      // Programador ve todas las inmobiliarias
      this.inmobiliariaService.getInmobiliarias(filters).subscribe({
        next: (response) => this.handlePaginatedResponse(response),
        error: (error) => this.handleError(error)
      });
    } else if (this.isAdmin) {
      // Administrador ve solo su inmobiliaria
      this.inmobiliariaService.getMyInmobiliaria().subscribe({
        next: (response) => this.handleSingleResponse(response),
        error: (error) => this.handleError(error)
      });
    } else {
      this.handleError(new Error('No tienes permisos para ver esta información'));
    }
  }

  private handlePaginatedResponse(response: PaginatedResponse<Inmobiliaria>): void {
    if (response.success) {
      this.inmobiliarias = response.data.data;
      this.currentPage = response.data.page;
      this.totalPages = response.data.totalPages;
      this.totalRecords = response.data.totalRecords;
      this.hasNextPage = response.data.hasNextPage;
      this.hasPreviousPage = response.data.hasPreviousPage;

      this.calculateSummaryStats();
    } else {
      this.handleError(new Error(response.message || 'Error al cargar las inmobiliarias'));
    }
    this.isLoading = false;
  }

  private handleSingleResponse(response: ApiResponse<Inmobiliaria>): void {
    if (response.success && response.data) {
      this.inmobiliarias = [response.data];
      this.currentPage = 1;
      this.totalPages = 1;
      this.totalRecords = 1;
      this.hasNextPage = false;
      this.hasPreviousPage = false;

      this.calculateSummaryStats();
    } else {
      this.handleError(new Error(response.message || 'Error al cargar la inmobiliaria'));
    }
    this.isLoading = false;
  }

  private handleError(error: any): void {
    this.isLoading = false;
    this.hasError = true;

    console.error('Error loading inmobiliarias:', error);

    if (error?.error?.message) {
      this.errorMessage = error.error.message;
    } else if (error?.message) {
      this.errorMessage = error.message;
    } else if (typeof error === 'string') {
      this.errorMessage = error;
    } else {
      this.errorMessage = 'Error al cargar las inmobiliarias. Por favor, intente nuevamente.';
    }
  }

  private calculateSummaryStats(): void {
    this.totalInmobiliarias = this.inmobiliarias.length;
    this.totalUsuariosGlobal = this.inmobiliarias.reduce((sum, inmob) => sum + inmob.totalUsuarios, 0);
    this.totalPropiedadesGlobal = this.inmobiliarias.reduce((sum, inmob) => sum + inmob.totalPropiedades, 0);
    this.totalLeadsGlobal = this.inmobiliarias.reduce((sum, inmob) => sum + inmob.totalLeads, 0);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadInmobiliarias();
  }

  onClearSearch(): void {
    this.searchForm.reset();
    this.currentPage = 1;
    this.loadInmobiliarias();
  }

  getStatusClass(estadoDescripcion: string): string {
    const description = estadoDescripcion.toLowerCase();
    if (description.includes('operativa')) return 'status-operativa';
    if (description.includes('pendiente')) return 'status-pendiente';
    return 'status-inactiva';
  }

  getPlanClass(planNombre: string): string {
    const plan = planNombre.toLowerCase();
    if (plan === 'basic') return 'basic';
    if (plan === 'pro') return 'pro';
    if (plan === 'premium') return 'premium';
    return 'basic';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getDomainUrl(inmobiliaria: Inmobiliaria): string {
    return inmobiliaria.dominioPersonalizado || `${inmobiliaria.subdominio}.inmobiliaria.com`;
  }

  viewDetails(inmobiliaria: Inmobiliaria): void {
    console.log('Ver detalles de:', inmobiliaria.nombre);
    // TODO: Implement navigation to detail view
  }

  editInmobiliaria(inmobiliaria: Inmobiliaria): void {
    console.log('Editar inmobiliaria:', inmobiliaria.nombre);
    // TODO: Implement navigation to edit view
  }

  previousPage(): void {
    if (this.hasPreviousPage && this.currentPage > 1) {
      this.currentPage--;
      this.loadInmobiliarias();
    }
  }

  nextPage(): void {
    if (this.hasNextPage && this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadInmobiliarias();
    }
  }

  // Helper methods for template
  canEditInmobiliaria(inmobiliaria: Inmobiliaria): boolean {
    if (this.isProgrammer) return true;
    if (this.isAdmin) return true; // Admin can edit their own inmobiliaria
    return false;
  }

  canViewAllInmobiliarias(): boolean {
    return this.isProgrammer;
  }

  getDisplayTitle(): string {
    if (this.isProgrammer) {
      return 'Gestión de Inmobiliarias';
    } else if (this.isAdmin) {
      return 'Mi Inmobiliaria';
    }
    return 'Inmobiliarias';
  }

  getDisplaySubtitle(): string {
    if (this.isProgrammer) {
      return 'Administra y supervisa todas las inmobiliarias registradas en la plataforma';
    } else if (this.isAdmin) {
      return 'Información y configuración de tu inmobiliaria';
    }
    return '';
  }
}
