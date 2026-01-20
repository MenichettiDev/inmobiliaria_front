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
  FormsModule,
  ReactiveFormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
} from '@angular/forms';
import { PropiedadesService } from '../../propiedades.service';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  of,
  Subject,
  map,
} from 'rxjs';

export interface PropiedadOption {
  id: number;
  titulo: string;
  direccion: string;
  precio?: number;
  displayText: string;
}

@Component({
  selector: 'app-cbo-propiedades',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cbo-propiedades.component.html',
  styleUrl: './cbo-propiedades.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CboPropiedadesComponent),
      multi: true,
    },
  ],
})
export class CboPropiedadesComponent implements OnInit, OnDestroy, ControlValueAccessor {
  // Inputs / outputs
  @Input() placeholder: string = 'Seleccionar propiedad';
  @Input() showOnlyActive: boolean = true;
  @Input() disabled: boolean = false;

  @Output() propiedadSelected = new EventEmitter<PropiedadOption | null>();

  // State
  propiedades: PropiedadOption[] = [];
  selectedPropiedadId: number | null = null;
  isOpen = false;
  isLoading = false;
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  // ControlValueAccessor callbacks
  private onChange = (value: any) => { };
  private onTouched = () => { };

  constructor(private propiedadesService: PropiedadesService) { }

  ngOnInit(): void {
    this.setupSearch();
    this.loadPropiedades();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        map((v: string | null) => (v ?? '') as string),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => {
          if (!term || term.length < 2) {
            return of(this.propiedades);
          }
          this.isLoading = true;
          const filtered = this.propiedades.filter((p) =>
            (p.titulo || '').toLowerCase().includes(term.toLowerCase()) ||
            (p.direccion || '').toLowerCase().includes(term.toLowerCase())
          );
          return of(filtered);
        }),
        catchError((err) => {
          console.error('Error searching propiedades', err);
          return of([]);
        })
      )
      .subscribe((list: PropiedadOption[]) => {
        this.propiedades = list || [];
        this.isLoading = false;
      });
  }

  private loadPropiedades(): void {
    this.isLoading = true;
    this.propiedadesService.getPropiedadesCombo().subscribe({
      next: (resp: any) => {
        const data = resp?.data ?? [];
        this.propiedades = this.mapPropiedadesToOptions(Array.isArray(data) ? data : []);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading propiedades', err);
        this.propiedades = [];
        this.isLoading = false;
      },
    });
  }

  private mapPropiedadesToOptions(propiedades: any[]): PropiedadOption[] {
    return propiedades.map((p: any) => ({
      id: p.id,
      titulo: p.titulo || '',
      direccion: p.direccion || '',
      precio: p.precio,
      displayText: this.buildDisplayText(p),
    }));
  }

  private buildDisplayText(propiedad: any): string {
    const titulo = propiedad.titulo;
    const direccion = propiedad.direccion;
    const precio = propiedad.precio ? ` - $${propiedad.precio.toLocaleString()}` : '';

    return `${titulo} - ${direccion}${precio}`;
  }

  selectedPropiedadName(): string {
    const p = this.propiedades.find((x) => x.id === this.selectedPropiedadId);
    return p ? p.displayText : '';
  }

  trackByPropiedad(index: number, propiedad: PropiedadOption): any {
    return propiedad.id ?? index;
  }

  onMainInputClick(): void {
    if (!this.disabled) this.toggleDropdown();
  }

  onMainInputFocus(): void {
    if (!this.disabled && !this.isOpen) {
      this.isOpen = true;
      this.loadPropiedades();
    }
  }

  onMainInputBlur(): void {
    setTimeout(() => {
      if (this.isOpen) {
        this.isOpen = false;
        this.onTouched();
      }
    }, 150);
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) this.loadPropiedades();
  }

  onOptionClick(propiedad: PropiedadOption): void {
    this.selectedPropiedadId = propiedad.id ?? null;
    this.isOpen = false;
    this.onChange(this.selectedPropiedadId);
    this.onTouched();
    this.propiedadSelected.emit(propiedad);
  }

  clearSelection(): void {
    this.selectedPropiedadId = null;
    this.searchControl.setValue('');
    this.onChange(null);
    this.onTouched();
    this.propiedadSelected.emit(null);
  }

  // ControlValueAccessor
  writeValue(value: any): void {
    this.selectedPropiedadId = value !== undefined && value !== null ? Number(value) : null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
