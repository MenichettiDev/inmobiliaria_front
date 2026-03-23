import { Component, forwardRef, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GeografiaService, ProvinciaDto } from '../../services/geografia.service';

@Component({
  selector: 'app-cbo-provincia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cbo-provincia.component.html',
  styleUrl: './cbo-provincia.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CboProvinciaComponent),
      multi: true
    }
  ]
})
export class CboProvinciaComponent implements OnInit, ControlValueAccessor {
  @Output() provinciaSelected = new EventEmitter<ProvinciaDto | null>();

  provincias: ProvinciaDto[] = [];
  loading = false;
  error = '';
  selectedId: number | null = null;
  disabled = false;

  private onChange: (v: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private geografiaService: GeografiaService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.geografiaService.getProvincias().subscribe({
      next: (res) => {
        this.provincias = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar provincias';
        this.loading = false;
      }
    });
  }

  onSelect(value: string): void {
    this.selectedId = value ? Number(value) : null;
    this.onChange(this.selectedId);
    this.onTouched();
    const prov = this.provincias.find(p => p.id === this.selectedId) ?? null;
    this.provinciaSelected.emit(prov);
  }

  writeValue(v: number | null): void {
    this.selectedId = v ?? null;
  }
  registerOnChange(fn: (v: number | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled = d; }
}
