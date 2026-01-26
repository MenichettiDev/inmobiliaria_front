import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  forwardRef,
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
  map,
} from 'rxjs';
import {
  EstadoInmobiliariaService,
  EstadoInmobiliaria,
} from '../../service/estado-inmobiliaria.service';

@Component({
  selector: 'app-cbo-estado-inmobiliaria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cbo-estado-inmobiliaria.component.html',
  styleUrls: ['./cbo-estado-inmobiliaria.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CboEstadoInmobiliariaComponent),
      multi: true,
    },
  ],
})
export class CboEstadoInmobiliariaComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  searchControl = new FormControl('');
  selectedControl = new FormControl<EstadoInmobiliaria | null>(null);
  private subs: Subscription[] = [];

  private onChange = (v: any) => { };
  private onTouched = () => { };

  @Input() isLabel = '';
  @Input() isId = '';
  @Input() isDisabled = false;
  @Input() placeholder = 'Seleccionar estado...';
  @Input() showOnlyActive = true;
  @Input() objectErrors: any = null;
  @Input() isTouched = false;

  @Output() estadoSelected = new EventEmitter<EstadoInmobiliaria | null>();
  @Output() isEmiterTouched = new EventEmitter<boolean>();

  estados: EstadoInmobiliaria[] = [];
  isLoading = false;
  isOpen = false;
  selectedEstado: EstadoInmobiliaria | null = null;

  constructor(private estadoService: EstadoInmobiliariaService) { }

  ngOnInit(): void {
    this.setupSearch();
    this.loadInitial();
    this.updateDisabled();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private setupSearch(): void {
    const s = this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          const q = (term || '').toString().trim();
          if (!this.isOpen) return of([]);
          if (q.length === 0) return this.loadData();
          return this.searchLocal(q);
        })
      )
      .subscribe((list) => (this.estados = list));
    this.subs.push(s);
  }

  private loadInitial(): void {
    this.loadData().subscribe((list) => (this.estados = list));
  }

  private loadData() {
    this.isLoading = true;
    const obs = this.showOnlyActive
      ? this.estadoService.obtenerEstadosActivos()
      : this.estadoService.obtenerEstados();
    return obs.pipe(
      map((r) => (r.data || []) as EstadoInmobiliaria[]),
      map((list) => {
        this.isLoading = false;
        return list;
      }),
      catchError(() => {
        this.isLoading = false;
        return of([]);
      })
    );
  }

  private searchLocal(q: string) {
    this.isLoading = true;
    const obs = this.showOnlyActive
      ? this.estadoService.obtenerEstadosActivos()
      : this.estadoService.obtenerEstados();
    return obs.pipe(
      map((r) => (r.data || []) as EstadoInmobiliaria[]),
      map((list) =>
        list.filter(
          (e) =>
            (e.codigo || '').toLowerCase().includes(q.toLowerCase()) ||
            (e.descripcion || '').toLowerCase().includes(q.toLowerCase())
        )
      ),
      map((filtered) => {
        this.isLoading = false;
        return filtered;
      }),
      catchError(() => {
        this.isLoading = false;
        return of([]);
      })
    );
  }

  toggleDropdown(evt?: Event): void {
    if (evt) evt.stopPropagation();
    if (this.isDisabled) return;
    this.isOpen ? this.close() : this.open();
  }

  private open(): void {
    this.isOpen = true;
    this.loadInitial();
    if (!this.selectedEstado) this.searchControl.setValue('', { emitEvent: false });
  }

  private close(): void {
    this.isOpen = false;
    this.updatePlaceholder();
  }

  onMainInputClick(): void {
    if (this.isDisabled) return;
    if (!this.isOpen) this.open();
  }

  onMainInputFocus(): void {
    if (this.isDisabled) return;
    if (!this.isOpen) this.open();
  }

  onMainInputBlur(): void {
    setTimeout(() => {
      if (this.isOpen) this.close();
      this.onTouched();
      this.isEmiterTouched.emit(true);
    }, 150);
  }

  onMainInputChange(e: Event): void {
    if (!this.isOpen) return;
    const t = e.target as HTMLInputElement;
    this.searchControl.setValue(t.value, { emitEvent: true });
  }

  onOptionClick(est: EstadoInmobiliaria): void {
    this.select(est);
    this.close();
  }

  private select(est: EstadoInmobiliaria | null): void {
    this.selectedEstado = est;
    this.selectedControl.setValue(est);
    this.onChange(est ? est.id : null);
    this.estadoSelected.emit(est);
    this.updatePlaceholder();
  }

  clearSelection(): void {
    this.select(null);
    this.searchControl.setValue('', { emitEvent: false });
    this.loadInitial();
  }

  private updateDisabled(): void {
    if (this.isDisabled) {
      this.searchControl.disable({ emitEvent: false });
      this.selectedControl.disable({ emitEvent: false });
    } else {
      this.searchControl.enable({ emitEvent: false });
      this.selectedControl.enable({ emitEvent: false });
    }
  }

  private updatePlaceholder(): void {
    if (this.selectedEstado) {
      this.placeholder = `${this.selectedEstado.codigo} - ${this.selectedEstado.descripcion}`;
    } else {
      this.placeholder = 'Seleccionar estado...';
    }
  }

  writeValue(value: any): void {
    if (value && typeof value === 'number') {
      this.findById(value);
    } else if (value && typeof value === 'object') {
      this.select(value);
    } else {
      this.select(null);
    }
  }

  private findById(id: number): void {
    const found = this.estados.find((e) => e.id === id);
    if (found) {
      this.select(found);
      return;
    }
    this.estadoService.obtenerEstadoPorId(id).subscribe({
      next: (res) => {
        const data = res.data || (res as any);
        if (data) this.select(data as EstadoInmobiliaria);
      },
      error: () => this.onChange(id),
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
    this.updateDisabled();
  }

  hasErrors(): boolean {
    return !!(this.objectErrors && (this.isTouched || this.selectedControl.touched));
  }

  getErrorMessage(): string {
    if (!this.hasErrors()) return '';
    if (this.objectErrors?.required) return `${this.isLabel} es requerido`;
    if (typeof this.objectErrors === 'string') return this.objectErrors;
    return 'Campo inválido';
  }

  trackByEstado(index: number, e: EstadoInmobiliaria): number {
    return e.id;
  }
}
