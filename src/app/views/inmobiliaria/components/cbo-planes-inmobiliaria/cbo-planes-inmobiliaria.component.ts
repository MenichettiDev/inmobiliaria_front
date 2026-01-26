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
  PlanesInmobiliariaService,
  PlanDto,
} from '../../service/planes-inmobiliaria.service';

@Component({
  selector: 'app-cbo-planes-inmobiliaria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cbo-planes-inmobiliaria.component.html',
  styleUrls: ['./cbo-planes-inmobiliaria.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CboPlanesInmobiliariaComponent),
      multi: true,
    },
  ],
})
export class CboPlanesInmobiliariaComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  searchControl = new FormControl('');
  selectedControl = new FormControl<PlanDto | null>(null);
  private subscriptions: Subscription[] = [];

  private onChange = (value: any) => { };
  private onTouched = () => { };

  @Input() isLabel = '';
  @Input() isId = '';
  @Input() isDisabled = false;
  @Input() placeholder = 'Seleccionar plan...';
  @Input() showOnlyActive = true;
  @Input() objectErrors: any = null;
  @Input() isTouched = false;

  @Output() planSelected = new EventEmitter<PlanDto | null>();
  @Output() isEmiterTouched = new EventEmitter<boolean>();

  planes: PlanDto[] = [];
  isLoading = false;
  isOpen = false;
  selectedPlan: PlanDto | null = null;

  constructor(private planesService: PlanesInmobiliariaService) { }

  ngOnInit(): void {
    this.setupSearchSubscription();
    this.loadInitialPlanes();
    this.updateDisabledState();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private setupSearchSubscription(): void {
    const sub = this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          const q = (term || '').toString().trim();
          if (!this.isOpen) return of([]);
          if (q.length === 0) return this.loadInitialData();
          return this.searchPlanes(q);
        })
      )
      .subscribe((planes) => {
        this.planes = planes;
      });
    this.subscriptions.push(sub);
  }

  private loadInitialPlanes(): void {
    this.loadInitialData().subscribe((planes) => (this.planes = planes));
  }

  private loadInitialData() {
    this.isLoading = true;
    const obs = this.showOnlyActive
      ? this.planesService.obtenerPlanesActivos()
      : this.planesService.obtenerPlanes();
    return obs.pipe(
      map((res) => res.data || []),
      map((list) => list as PlanDto[]),
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

  private searchPlanes(q: string) {
    this.isLoading = true;
    // servicio no tiene endpoint de search, traer lista y filtrar client-side
    const obs = this.showOnlyActive
      ? this.planesService.obtenerPlanesActivos()
      : this.planesService.obtenerPlanes();
    return obs.pipe(
      map((res) => (res.data || []) as PlanDto[]),
      map((list) =>
        list.filter((p) =>
          (p.nombre || '').toLowerCase().includes(q.toLowerCase())
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

  toggleDropdown(event?: Event): void {
    if (event) event.stopPropagation();
    if (this.isDisabled) return;
    this.isOpen ? this.closeDropdown() : this.openDropdown();
  }

  private openDropdown(): void {
    this.isOpen = true;
    this.loadInitialPlanes();
    if (!this.selectedPlan) this.searchControl.setValue('', { emitEvent: false });
  }

  private closeDropdown(): void {
    this.isOpen = false;
    this.updatePlaceholderText();
  }

  onMainInputClick(): void {
    if (this.isDisabled) return;
    if (!this.isOpen) this.openDropdown();
  }

  onMainInputFocus(): void {
    if (this.isDisabled) return;
    if (!this.isOpen) this.openDropdown();
  }

  onMainInputBlur(): void {
    setTimeout(() => {
      if (this.isOpen) this.closeDropdown();
      this.onTouched();
      this.isEmiterTouched.emit(true);
    }, 150);
  }

  onMainInputChange(event: Event): void {
    if (!this.isOpen) return;
    const target = event.target as HTMLInputElement;
    this.searchControl.setValue(target.value, { emitEvent: true });
  }

  onOptionClick(plan: PlanDto): void {
    this.selectPlan(plan);
    this.closeDropdown();
  }

  private selectPlan(plan: PlanDto | null): void {
    this.selectedPlan = plan;
    this.selectedControl.setValue(plan);
    if (plan) this.onChange(plan.id);
    else this.onChange(null);
    this.planSelected.emit(plan);
    this.updatePlaceholderText();
  }

  clearSelection(): void {
    this.selectPlan(null);
    this.searchControl.setValue('', { emitEvent: false });
    this.loadInitialPlanes();
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
    if (this.selectedPlan) {
      this.placeholder = `${this.selectedPlan.nombre} ${this.selectedPlan.precioUsd ? '- $' + this.selectedPlan.precioUsd : ''}`;
    } else {
      this.placeholder = 'Seleccionar plan...';
    }
  }

  writeValue(value: any): void {
    if (value && typeof value === 'number') {
      this.findPlanById(value);
    } else if (value && typeof value === 'object') {
      this.selectPlan(value);
    } else {
      this.selectPlan(null);
    }
  }

  private findPlanById(id: number): void {
    const found = this.planes.find((p) => p.id === id);
    if (found) {
      this.selectPlan(found);
      return;
    }
    this.planesService.obtenerPlanPorId(id).subscribe({
      next: (res) => {
        const planData = res.data || (res as any);
        if (planData) {
          this.selectPlan(planData as PlanDto);
        }
      },
      error: () => {
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

  // template helpers
  hasErrors(): boolean {
    return !!(this.objectErrors && (this.isTouched || this.selectedControl.touched));
  }

  getErrorMessage(): string {
    if (!this.hasErrors()) return '';
    if (this.objectErrors?.required) return `${this.isLabel} es requerido`;
    if (typeof this.objectErrors === 'string') return this.objectErrors;
    return 'Campo inválido';
  }

  trackByPlan(index: number, plan: PlanDto): number {
    return plan.id;
  }
}
