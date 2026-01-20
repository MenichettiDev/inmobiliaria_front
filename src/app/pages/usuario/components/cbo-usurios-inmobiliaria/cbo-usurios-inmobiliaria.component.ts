import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  idInmobiliaria: number;
  idRol: number;
  idEstado: number;
  creadoEn: string;
  actualizadoEn: string;
  rolNombre: string;
}

@Component({
  selector: 'app-cbo-usuarios-inmobiliaria',
  imports: [CommonModule, FormsModule],
  templateUrl: './cbo-usurios-inmobiliaria.component.html',
  styleUrls: ['./cbo-usurios-inmobiliaria.component.css', '../../../../shared/cbo.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CboUsuriosInmobiliariaComponent),
      multi: true
    }
  ]
})
export class CboUsuriosInmobiliariaComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder: string = 'Seleccionar usuario';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() showEmail: boolean = false;
  @Input() rolId?: number;
  @Input() estadoId?: number = 1; // Por defecto solo usuarios activos

  @Output() selectionChange = new EventEmitter<Usuario | null>();

  usuarios: Usuario[] = [];
  loading: boolean = false;
  error: string = '';
  searchTerm: string = '';
  selectedValue: number | null = null;
  isOpen: boolean = false;

  // ControlValueAccessor
  private onChange = (value: any) => { };
  private onTouched = () => { };

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.error = '';

    this.usuarioService.obtenerUsuarios(
      1,
      100, // Cargar más usuarios para el combobox
      this.searchTerm || undefined,
      this.rolId,
      this.estadoId
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.usuarios = response.data.data;
        } else {
          this.error = response.message || 'Error al cargar usuarios';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading usuarios:', error);
        this.error = 'Error al cargar usuarios';
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    // Debounce la búsqueda
    setTimeout(() => {
      this.cargarUsuarios();
    }, 300);
  }

  selectUsuario(usuario: Usuario | null): void {
    this.selectedValue = usuario?.id || null;
    this.isOpen = false;
    this.onChange(this.selectedValue);
    this.onTouched();
    this.selectionChange.emit(usuario);
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      if (this.isOpen && this.usuarios.length === 0) {
        this.cargarUsuarios();
      }
    }
  }

  closeDropdown(): void {
    setTimeout(() => {
      this.isOpen = false;
    }, 150);
  }

  get selectedUsuario(): Usuario | null {
    return this.usuarios.find(u => u.id === this.selectedValue) || null;
  }

  get filteredUsuarios(): Usuario[] {
    if (!this.searchTerm) {
      return this.usuarios;
    }
    return this.usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.selectedValue = value;
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
