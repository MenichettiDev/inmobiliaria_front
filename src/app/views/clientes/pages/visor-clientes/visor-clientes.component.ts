import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientesService, Cliente } from '../../service/clientes.service';
import { Router } from '@angular/router';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { AlertaService } from '../../../../services/alerta.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalViewEditComponent } from '../../components/modal-view-edit/modal-view-edit.component';

interface ClienteRaw {
  [key: string]: any;
}

interface DisplayCliente {
  id: number | null;
  nombreCompleto: string;
  email?: string;
  telefono?: string;
  dni?: string;
  activo?: boolean;
  _pending?: boolean;
}

interface PaginationData {
  totalRecords?: number;
  totalPages?: number;
  currentPage?: number;
  page?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

interface ApiResponse {
  data:
  | any[]
  | {
    data: any[];
    pagination?: PaginationData;
    page?: number;
    pageSize?: number;
    totalRecords?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
  total?: number;
  pagination?: PaginationData;
}

@Component({
  selector: 'app-visor-clientes',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PaginatorComponent,
    NgbTooltipModule,
    SpinnerComponent
  ],
  templateUrl: './visor-clientes.component.html',
  styleUrl: './visor-clientes.component.css'
})
export class VisorClientesComponent implements OnInit {
  clientes: DisplayCliente[] = [];
  filteredClientes: DisplayCliente[] = [];
  currentPage = 1;
  pageSize = 6;
  isLoading = false;
  totalItems = 0;
  totalPages = 0;

  // Expose Math to template
  Math = Math;

  // Filtros
  filtroNombre: string = '';
  filtroEmail: string = '';
  filtroTelefono: string = '';
  filtroEstado: string = '';

  constructor(
    private clientesService: ClientesService,
    private router: Router,
    private alertService: AlertaService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fetchClientes();
  }

  fetchClientes(): void {
    this.isLoading = true;
    console.log(
      `[ClientesList] fetchClientes page=${this.currentPage} size=${this.pageSize}`
    );

    const filters: any = {};
    if (this.filtroNombre?.trim()) filters.nombre = this.filtroNombre.trim();

    if (this.filtroEstado) {
      filters.activo = this.filtroEstado === 'activo';
    }

    this.clientesService
      .getClientes(this.currentPage, this.pageSize, filters)
      .subscribe({
        next: (resp: ApiResponse) => {
          console.debug('[ClientesList] fetchClientes - filtros enviados:', filters);
          console.debug(
            '[ClientesList] fetchClientes - resp crudo del servicio:',
            resp
          );

          let rawList: ClienteRaw[] = [];
          if (Array.isArray(resp.data)) {
            rawList = resp.data;
            this.clientes = resp.data.map((c) => this.mapClienteToDisplayFormat(c));
          } else if (resp.data && typeof resp.data === 'object') {
            if (Array.isArray(resp.data.data)) {
              rawList = resp.data.data;
              this.clientes = resp.data.data.map((c) =>
                this.mapClienteToDisplayFormat(c)
              );
            }
          }

          let paginationInfo: PaginationData | null = null;

          if (resp.pagination) {
            paginationInfo = resp.pagination;
          }
          else if (
            resp.data &&
            typeof resp.data === 'object' &&
            !Array.isArray(resp.data)
          ) {
            const dataObj = resp.data as {
              pagination?: PaginationData;
              page?: number;
              pageSize?: number;
              totalRecords?: number;
              totalPages?: number;
              hasNextPage?: boolean;
              hasPreviousPage?: boolean;
            };

            if (dataObj.pagination) {
              paginationInfo = dataObj.pagination;
            } else if (dataObj.page !== undefined) {
              paginationInfo = {
                page: dataObj.page,
                pageSize: dataObj.pageSize,
                totalRecords: dataObj.totalRecords,
                totalPages: dataObj.totalPages,
                hasNextPage: dataObj.hasNextPage,
                hasPreviousPage: dataObj.hasPreviousPage,
              };
            }
          }

          if (paginationInfo) {
            this.totalItems =
              paginationInfo.totalRecords || resp.total || this.clientes.length;
            this.totalPages =
              paginationInfo.totalPages ||
              Math.ceil(this.totalItems / this.pageSize);

            if (paginationInfo.page) {
              this.currentPage = paginationInfo.page;
            }

            console.log('[ClientesList] Paginación actualizada:', {
              currentPage: this.currentPage,
              totalPages: this.totalPages,
              totalItems: this.totalItems,
              pageSize: this.pageSize,
            });
          } else {
            this.totalItems = resp.total || this.clientes.length;
            this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          }

          this.filteredClientes = this.clientes;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error fetching clientes:', error);
          this.alertService.error(
            'Error al cargar los clientes. Por favor, inténtelo de nuevo.'
          );
          this.isLoading = false;
        },
      });
  }

  private mapClienteToDisplayFormat(c: ClienteRaw): DisplayCliente {
    const activo = c['activo'] ?? true;

    return {
      id: c['id'] ?? null,
      nombreCompleto: c['nombreCompleto'] ?? '',
      email: c['email'] ?? '',
      telefono: c['telefono'] ?? '',
      dni: c['dni'] ?? '',
      activo: activo,
      _pending: false,
    } as DisplayCliente;
  }

  onSearch(): void {
    this.currentPage = 1;
    this.fetchClientes();
  }

  onResetFilters(): void {
    this.filtroNombre = '';
    this.filtroEmail = '';
    this.filtroTelefono = '';
    this.filtroEstado = '';
    this.currentPage = 1;
    this.fetchClientes();
  }

  getPaginatedClientes(): DisplayCliente[] {
    return this.filteredClientes;
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filtroNombre?.trim() ||
      this.filtroEmail?.trim() ||
      this.filtroTelefono?.trim() ||
      this.filtroEstado
    );
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.calculatePagination();
  }

  createNewCliente(): void {
    this.openModal();
  }

  editCliente(cliente: any): void {
    this.openModal(cliente);
  }

  private openModal(cliente?: any): void {
    const modalRef = this.modalService.open(ModalViewEditComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.cliente = cliente ?? null;

    modalRef.result.then(
      (result) => {
        // result contiene el cliente creado/actualizado: refrescar la lista
        if (typeof this.onSearch === 'function') {
          this.onSearch();
        }
      },
      (reason) => {
        // dismissed - no action required
      }
    );
  }

  deleteCliente(item: DisplayCliente): void {
    const id = item?.id ?? null;
    if (id == null) return;

    this.alertService
      .confirm(
        '¿Estás seguro de que deseas eliminar este cliente?',
        'Eliminar Cliente'
      )
      .then((result: any) => {
        if (result && result.isConfirmed) {
          this.clientesService.deleteCliente(Number(id)).subscribe({
            next: () => {
              this.alertService.success(
                'El cliente ha sido eliminado correctamente.',
                '¡Eliminado!'
              );
              this.fetchClientes();
            },
            error: (err) => {
              console.error('[ClientesList] deleteCliente error', err);
              this.alertService.error(
                'No se pudo eliminar el cliente. Intente nuevamente.'
              );
            },
          });
        }
      });
  }

  onPageEvent(event: { pageIndex: number; pageSize: number }): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    console.log(
      `[ClientesList] Cambio de página: pageIndex=${event.pageIndex}, pageSize=${event.pageSize}`
    );

    this.fetchClientes();
  }
}