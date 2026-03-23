import { Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GeografiaService, LocalidadDto } from '../../services/geografia.service';

@Component({
  selector: 'app-cbo-localidad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cbo-localidad.component.html',
  styleUrl: './cbo-localidad.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CboLocalidadComponent),
      multi: true
    }
  ]
})
export class CboLocalidadComponent implements OnChanges, ControlValueAccessor {
  @Input() idProvincia: number | null = null;

  localidades: LocalidadDto[] = [];
  loading = false;
  error = '';
  selectedId: number | null = null;
  disabled = false;

  private onChange: (v: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private geografiaService: GeografiaService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idProvincia']) {
      this.localidades = [];
      this.selectedId = null;
      this.onChange(null);
      if (this.idProvincia) {
        this.cargar(this.idProvincia);
      }
    }
  }

  cargar(idProvincia: number): void {
    this.loading = true;
    this.error = '';
    this.geografiaService.getLocalidadesPorProvincia(idProvincia).subscribe({
      next: (res) => {
        this.localidades = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar localidades';
        this.loading = false;
      }
    });
  }

  onSelect(value: string): void {
    this.selectedId = value ? Number(value) : null;
    this.onChange(this.selectedId);
    this.onTouched();
  }

  writeValue(v: number | null): void { this.selectedId = v ?? null; }
  registerOnChange(fn: (v: number | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled = d; }
}
