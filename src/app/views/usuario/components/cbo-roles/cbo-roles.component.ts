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
import {
  RolUsuarioService,
  RolDto,
} from '../../services/rol-usuario.service';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  of,
  Subject,
  map,
} from 'rxjs';

@Component({
  selector: 'app-cbo-roles',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cbo-roles.component.html',
  styleUrl: './cbo-roles.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CboRolesComponent),
      multi: true,
    },
  ],
})
export class CboRolesComponent implements OnInit, OnDestroy, ControlValueAccessor {
  // Inputs / outputs
  @Input() placeholder: string = 'Seleccionar rol';
  @Input() showOnlyActive: boolean = true;
  @Input() disabled: boolean = false;

  @Output() rolSelected = new EventEmitter<RolDto | null>();

  // State
  roles: RolDto[] = [];
  selectedRolId: number | null = null;
  isOpen = false;
  isLoading = false;
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  // ControlValueAccessor callbacks
  private onChange = (value: any) => { };
  private onTouched = () => { };

  constructor(private rolService: RolUsuarioService) { }

  ngOnInit(): void {
    this.setupSearch();
    this.loadRoles();
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
            return of(this.roles);
          }
          this.isLoading = true;
          const filtered = this.roles.filter((r) =>
            (r.nombreRol || '').toLowerCase().includes(term.toLowerCase())
          );
          return of(filtered);
        }),
        catchError((err) => {
          console.error('Error searching roles', err);
          return of([]);
        })
      )
      .subscribe((list: RolDto[]) => {
        this.roles = list || [];
        this.isLoading = false;
      });
  }

  private loadRoles(): void {
    this.isLoading = true;
    this.rolService.getRoles().subscribe({
      next: (resp: any) => {
        const data = resp?.data ?? [];
        this.roles = Array.isArray(data) ? data : [];
        if (this.showOnlyActive) {
          this.roles = this.roles.filter((r) => r.activo !== false);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading roles', err);
        this.roles = [];
        this.isLoading = false;
      },
    });
  }

  selectedRolName(): string {
    const r = this.roles.find((x) => x.idRol === this.selectedRolId);
    return r ? r.nombreRol : '';
  }

  trackByRol(index: number, rol: RolDto): any {
    return rol.idRol ?? index;
  }

  onMainInputClick(): void {
    if (!this.disabled) this.toggleDropdown();
  }

  onMainInputFocus(): void {
    if (!this.disabled && !this.isOpen) {
      this.isOpen = true;
      this.loadRoles();
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
    if (this.isOpen) this.loadRoles();
  }

  onOptionClick(rol: RolDto): void {
    this.selectedRolId = rol.idRol ?? null;
    this.isOpen = false;
    this.onChange(this.selectedRolId);
    this.onTouched();
    this.rolSelected.emit(rol);
  }

  clearSelection(): void {
    this.selectedRolId = null;
    this.searchControl.setValue('');
    this.onChange(null);
    this.onTouched();
    this.rolSelected.emit(null);
  }

  // ControlValueAccessor
  writeValue(value: any): void {
    this.selectedRolId = value !== undefined && value !== null ? Number(value) : null;
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
