import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  Subscription,
  switchMap,
  of,
  catchError,
} from 'rxjs';
import { ClientesService } from '../../service/clientes.service';

export interface ClienteOption {
  id: number;
  nombreCompleto: string;
  email: string;
  telefono?: string;
  dni?: string;
  activo: boolean;
  idInmobiliaria: number;
  displayText: string;
}

@Component({
  selector: 'app-cbo-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cbo-clientes.component.html',
  styleUrls: ['./cbo-clientes.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CboClientesComponent),
      multi: true,
    },
  ],
})
export class CboClientesComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  // Internal FormControl for search
  searchControl = new FormControl('');
  selectedControl = new FormControl<ClienteOption | null>(null);

  // Subscriptions for cleanup
  private subscriptions: Subscription[] = [];

  // ControlValueAccessor callbacks
  private onChange = (value: any) => { };
  private onTouched = () => { };

  // Component inputs
  @Input() isLabel: string = '';
  @Input() isId: string = '';
  @Input() isDisabled: boolean = false;
  @Input() placeholder: string = 'Seleccionar cliente...';
  @Input() showOnlyActive: boolean = true;
  @Input() objectErrors: any = null;
  @Input() isTouched: boolean = false;

  // Output events
  @Output() isEmiterTouched = new EventEmitter<boolean>();
  @Output() clienteSelected = new EventEmitter<ClienteOption | null>();

  // Component state
  clientes: ClienteOption[] = [];
  isLoading = false;
  isOpen = false;
  selectedCliente: ClienteOption | null = null;

  constructor(private clientesService: ClientesService) { }

  ngOnInit(): void {
    this.setupSearchSubscription();
    this.loadInitialClientes();
    this.updateDisabledState();
    this.updatePlaceholderText();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private setupSearchSubscription(): void {
    const searchSub = this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          if (!this.isOpen) {
            return of([]);
          }

          const searchTerm = (term || '').toString().trim();

          if (searchTerm.length >= 3) {
            return this.searchClientes(searchTerm);
          } else if (searchTerm.length === 0) {
            return this.loadInitialData();
          } else {
            return of([]);
          }
        })
      )
      .subscribe((clientes) => {
        this.clientes = clientes;
      });

    this.subscriptions.push(searchSub);
  }

  private loadInitialClientes(): void {
    this.loadInitialData().subscribe((clientes) => {
      this.clientes = clientes;
    });
  }

  private loadInitialData() {
    this.isLoading = true;
    const filters = this.showOnlyActive ? { activo: true } : {};

    return this.clientesService.getClientes(1, 10, filters).pipe(
      switchMap((response) => {
        // Fix: Extract the correct array from the nested response structure
        const rawList = response.data.data || [];
        const clientes = this.mapClientesToOptions(rawList);
        this.isLoading = false;
        return of(clientes);
      }),
      catchError((error) => {
        console.error('Error loading clientes:', error);
        this.isLoading = false;
        return of([]);
      })
    );
  }

  private searchClientes(searchTerm: string) {
    this.isLoading = true;
    const filters: any = {};

    if (this.showOnlyActive) {
      filters.activo = true;
    }

    // Search by nombreCompleto which is the main search field
    filters.nombreCompleto = searchTerm;

    return this.clientesService.getClientes(1, 20, filters).pipe(
      switchMap((response) => {
        // Fix: Extract the correct array from the nested response structure
        const rawList = response.data.data || [];
        const clientes = this.mapClientesToOptions(rawList);
        this.isLoading = false;
        return of(clientes);
      }),
      catchError((error) => {
        console.error('Error searching clientes:', error);
        this.isLoading = false;
        return of([]);
      })
    );
  }

  private mapClientesToOptions(clientes: any[]): ClienteOption[] {
    return clientes.map((c: any) => ({
      id: c.id,
      nombreCompleto: c.nombreCompleto,
      email: c.email || '',
      telefono: c.telefono,
      dni: c.dni,
      activo: c.activo,
      idInmobiliaria: c.idInmobiliaria,
      displayText: this.buildDisplayText(c),
    }));
  }

  private buildDisplayText(cliente: any): string {
    const nombreCompleto = cliente.nombreCompleto;
    const email = cliente.email;

    let text = nombreCompleto || '';
    if (email) {
      text += ` (${email})`;
    }
    return text;
  }

  // Input interaction methods
  onMainInputClick(): void {
    if (this.isDisabled) return;

    if (!this.isOpen) {
      this.openDropdown();
    }
  }

  onMainInputFocus(): void {
    if (this.isDisabled) return;

    if (!this.isOpen) {
      this.openDropdown();
    }
  }

  onMainInputBlur(): void {
    // Delay to allow option clicks
    setTimeout(() => {
      if (this.isOpen) {
        this.closeDropdown();
      }
      this.onTouched();
      this.isEmiterTouched.emit(true);
    }, 150);
  }

  onMainInputChange(event: Event): void {
    if (!this.isOpen) return;

    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.searchControl.setValue(value, { emitEvent: true });
  }

  toggleDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (this.isDisabled) return;

    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  private openDropdown(): void {
    this.isOpen = true;

    // Load initial data when opening
    this.loadInitialData().subscribe((clientes) => {
      this.clientes = clientes;
    });

    // Clear search when opening if no selection
    if (!this.selectedCliente) {
      this.searchControl.setValue('', { emitEvent: false });
    }
  }

  private closeDropdown(): void {
    this.isOpen = false;
    this.updatePlaceholderText();
  }

  onOptionClick(cliente: ClienteOption): void {
    this.selectCliente(cliente);
    this.closeDropdown();
  }

  private selectCliente(cliente: ClienteOption | null): void {
    this.selectedCliente = cliente;
    this.selectedControl.setValue(cliente);

    if (cliente) {
      this.onChange(cliente.id);
    } else {
      this.onChange(null);
    }

    this.clienteSelected.emit(cliente);
    this.updatePlaceholderText();
  }

  clearSelection(): void {
    this.selectCliente(null);
    this.searchControl.setValue('', { emitEvent: false });
    this.loadInitialClientes();
  }

  private updateDisabledState(): void {
    if (this.isDisabled) {
      this.searchControl.disable({ emitEvent: false });
      this.selectedControl.disable({ emitEvent: false });
    } else {
      this.searchControl.enable({ emitEvent: false });
      this.selectedControl.enable({ emitEvent: false });
    }
  }

  private updatePlaceholderText(): void {
    if (this.selectedCliente) {
      this.placeholder = this.selectedCliente.displayText;
    } else {
      this.placeholder = 'Seleccionar cliente...';
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    if (value && typeof value === 'number') {
      this.findClienteById(value);
    } else if (value && typeof value === 'object') {
      this.selectCliente(value);
    } else {
      this.selectCliente(null);
    }
  }

  private findClienteById(id: number): void {
    // First check if it's in current list
    const found = this.clientes.find((c) => c.id === id);
    if (found) {
      this.selectCliente(found);
      return;
    }

    // If not found, make a specific request
    this.clientesService.getClienteById(id).subscribe({
      next: (response) => {
        const clienteData = response.data;
        if (clienteData) {
          const cliente = this.mapClientesToOptions([clienteData])[0];
          this.selectCliente(cliente);
        }
      },
      error: () => {
        // If request fails, just set the ID
        this.onChange(id);
      },
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.updateDisabledState();
  }

  // Helper methods for template
  hasErrors(): boolean {
    return !!(
      this.objectErrors &&
      (this.isTouched || this.selectedControl.touched)
    );
  }

  getErrorMessage(): string {
    if (!this.hasErrors()) return '';

    if (this.objectErrors?.required) {
      return `${this.isLabel} es requerido`;
    }

    if (typeof this.objectErrors === 'string') {
      return this.objectErrors;
    }

    return 'Campo inválido';
  }

  trackByCliente(index: number, cliente: ClienteOption): number {
    return cliente.id;
  }
}
