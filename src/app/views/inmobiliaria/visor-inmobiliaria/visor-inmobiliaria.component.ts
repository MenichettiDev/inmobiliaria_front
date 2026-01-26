import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InmobiliariaService, Inmobiliaria, InmobiliariaFilters, PaginatedResponse, ApiResponse, CreateInmobiliariaDto, UpdateInmobiliariaDto } from '../service/inmobiliaria.service';
import { AuthService } from '../../auth/auth.service';
import { ModalDetailsEditComponent } from '../components/modal-details-edit/modal-details-edit.component';
import { ModalCreateComponent } from '../components/modal-create/modal-create.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { CboPlanesInmobiliariaComponent } from '../components/cbo-planes-inmobiliaria/cbo-planes-inmobiliaria.component';
import { CboEstadoInmobiliariaComponent } from '../components/cbo-estado-inmobiliaria/cbo-estado-inmobiliaria.component';

@Component({
  selector: 'app-visor-inmobiliaria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalDetailsEditComponent, ModalCreateComponent, ConfirmModalComponent, CboPlanesInmobiliariaComponent, CboEstadoInmobiliariaComponent],
  templateUrl: './visor-inmobiliaria.component.html',
  styleUrls: ['./visor-inmobiliaria.component.css']
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

  // Modal management
  showDetailsEditModal = false;
  showCreateModal = false;
  showConfirmModal = false;
  confirmModalTitle = '';
  confirmModalMessage = '';
  confirmModalAction: (() => void) | null = null;

  // Current item being edited/viewed
  selectedInmobiliaria: Inmobiliaria | null = null;
  isEditMode = false;
  isCreateMode = false;

  // CRUD operation states
  isCreating = false;
  isUpdating = false;
  isDeleting = false;

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
    console.log('Loaded user data from AuthService:', user); // Log user data for debugging
    if (user) {
      this.userRole = user.id_acceso || 0;
      this.isProgrammer = this.userRole === 1;
      this.isAdmin = this.userRole === 2;
      console.log(`User role loaded: ${this.userRole} (Programmer: ${this.isProgrammer}, Admin: ${this.isAdmin})`);
      // If the user is an admin, load their inmobiliaria
      if (this.isAdmin) {
        const inmobiliariaId = user.idInmobiliaria || user.id_inmobiliaria; // Ensure compatibility with different property names
        if (inmobiliariaId) {
          console.log('Admin user has inmobiliaria ID:', inmobiliariaId); // Log inmobiliaria ID
          this.loadMyInmobiliaria(inmobiliariaId);
        } else {
          console.error('Admin user does not have an assigned inmobiliaria. User data:', user);
          this.handleError(new Error('No tienes una inmobiliaria asignada.'));
        }
      }
    } else {
      console.error('No user data found in AuthService.');
      this.handleError(new Error('No se pudo cargar la información del usuario.'));
    }
  }

  private loadMyInmobiliaria(id: number): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    console.log('Calling getMyInmobiliaria with ID:', id); // Log the ID being used
    this.inmobiliariaService.getMyInmobiliaria(id).subscribe({
      next: (response) => {
        console.log('Response from getMyInmobiliaria:', response); // Log the response
        this.handleSingleResponse(response);
      },
      error: (error) => {
        console.error('Error fetching inmobiliaria:', error); // Log the error
        this.handleError(error);
      }
    });
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
      // Programmer sees all inmobiliarias
      console.log('User is a programmer. Fetching all inmobiliarias with filters:', filters);
      this.inmobiliariaService.getInmobiliarias(filters).subscribe({
        next: (response) => this.handlePaginatedResponse(response),
        error: (error) => this.handleError(error)
      });
    } else if (this.isAdmin) {
      // Admin sees only their inmobiliaria
      const user = this.authService.getUser();
      console.log('User is an admin. User data:', user);
      if (user?.id_inmobiliaria) {
        console.log('Fetching inmobiliaria for admin with ID:', user.id_inmobiliaria);
        this.loadMyInmobiliaria(user.id_inmobiliaria); // Correctly call loadMyInmobiliaria with the ID
      } else {
        console.error('Admin user does not have an assigned inmobiliaria. User data:', user);
        this.handleError(new Error('No tienes una inmobiliaria asignada.'));
      }
    } else {
      console.error('User does not have permissions to view this information. User role:', this.userRole);
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

      this.hasError = false; // Reset the error flag
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

      this.hasError = false; // Reset the error flag
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

  // CRUD Operations

  createInmobiliaria(): void {
    this.showCreateModal = true;
  }

  viewDetails(inmobiliaria: Inmobiliaria): void {
    this.selectedInmobiliaria = inmobiliaria;
    this.isEditMode = false;
    this.isCreateMode = false;
    this.showDetailsEditModal = true;
  }

  // Modal management
  onCreateModalClose(): void {
    this.showCreateModal = false;
  }

  onCreateModalSave(data: CreateInmobiliariaDto): void {
    this.handleCreate(data);
  }

  onDetailsEditModalClose(): void {
    this.showDetailsEditModal = false;
    this.selectedInmobiliaria = null;
    this.isEditMode = false;
    this.isCreateMode = false;
  }

  onDetailsEditModalSave(data: CreateInmobiliariaDto | UpdateInmobiliariaDto): void {
    this.handleUpdate(data as UpdateInmobiliariaDto);
  }

  onConfirmModalConfirm(): void {
    if (this.confirmModalAction) {
      this.confirmModalAction();
    }
    this.showConfirmModal = false;
    this.confirmModalAction = null;
  }

  onConfirmModalCancel(): void {
    this.showConfirmModal = false;
    this.confirmModalAction = null;
  }

  private handleCreate(data: CreateInmobiliariaDto): void {
    this.isCreating = true;

    this.inmobiliariaService.createInmobiliaria(data).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadInmobiliarias();
          this.showCreateModal = false;
          console.log('Inmobiliaria creada correctamente');
        } else {
          this.handleError(new Error(response.message || 'Error al crear la inmobiliaria'));
        }
        this.isCreating = false;
      },
      error: (error) => {
        this.handleError(error);
        this.isCreating = false;
      }
    });
  }

  private handleUpdate(data: UpdateInmobiliariaDto): void {
    if (!this.selectedInmobiliaria) return;

    this.isUpdating = true;

    this.inmobiliariaService.updateInmobiliaria(this.selectedInmobiliaria.id, data).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadInmobiliarias();
          this.showDetailsEditModal = false;
          console.log('Inmobiliaria actualizada correctamente');
        } else {
          this.handleError(new Error(response.message || 'Error al actualizar la inmobiliaria'));
        }
        this.isUpdating = false;
      },
      error: (error) => {
        this.handleError(error);
        this.isUpdating = false;
      }
    });
  }

  // State management methods
  activateInmobiliaria(inmobiliaria: Inmobiliaria): void {
    this.confirmModalTitle = 'Activar Inmobiliaria';
    this.confirmModalMessage = `¿Confirma que desea activar la inmobiliaria "${inmobiliaria.nombre}"?`;
    this.confirmModalAction = () => this.executeStateChange(inmobiliaria.id, 1, 'activar');
    this.showConfirmModal = true;
  }

  suspendInmobiliaria(inmobiliaria: Inmobiliaria): void {
    this.confirmModalTitle = 'Suspender Inmobiliaria';
    this.confirmModalMessage = `¿Confirma que desea suspender la inmobiliaria "${inmobiliaria.nombre}"? Los usuarios no podrán acceder temporalmente.`;
    this.confirmModalAction = () => this.executeStateChange(inmobiliaria.id, 2, 'suspender');
    this.showConfirmModal = true;
  }

  cancelInmobiliaria(inmobiliaria: Inmobiliaria): void {
    this.confirmModalTitle = 'Dar de baja Inmobiliaria';
    this.confirmModalMessage = `¿Confirma que desea dar de baja la inmobiliaria "${inmobiliaria.nombre}"? Esta acción deshabilitará permanentemente la cuenta.`;
    this.confirmModalAction = () => this.executeStateChange(inmobiliaria.id, 3, 'dar de baja');
    this.showConfirmModal = true;
  }

  private executeStateChange(id: number, newState: number, action: string): void {
    this.inmobiliariaService.changeInmobiliariaState(id, newState).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadInmobiliarias();
          console.log(`Inmobiliaria ${action}da correctamente`);
        } else {
          this.handleError(new Error(response.message || `Error al ${action} la inmobiliaria`));
        }
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  // Helper methods for template
  canCreateInmobiliaria(): boolean {
    return this.isProgrammer;
  }

  canChangeState(inmobiliaria: Inmobiliaria): boolean {
    return this.isProgrammer;
  }

  getStateActions(inmobiliaria: Inmobiliaria): string[] {
    const actions: string[] = [];

    if (inmobiliaria.idEstado !== 1) actions.push('activate');
    if (inmobiliaria.idEstado !== 2) actions.push('suspend');
    if (inmobiliaria.idEstado !== 3) actions.push('cancel');

    return actions;
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
