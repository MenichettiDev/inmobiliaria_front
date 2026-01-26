import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CreateInmobiliariaDto } from '../../service/inmobiliaria.service';
import { CboPlanesInmobiliariaComponent } from '../cbo-planes-inmobiliaria/cbo-planes-inmobiliaria.component';
import { PlanesInmobiliariaService, PlanDto } from '../cbo-planes-inmobiliaria/../../service/planes-inmobiliaria.service';

@Component({
  selector: 'app-modal-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CboPlanesInmobiliariaComponent],
  templateUrl: './modal-create.component.html',
  styleUrls: ['./modal-create.component.css']
})
export class ModalCreateComponent implements OnInit {
  @Input() isLoading = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateInmobiliariaDto>();

  form: FormGroup;
  private planMap: Record<number, PlanDto> = {};

  constructor(private fb: FormBuilder, private planesService: PlanesInmobiliariaService) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      subdominio: ['', [
        Validators.required,
        Validators.pattern(/^[a-z0-9-]+$/),
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      dominioPersonalizado: [''],
      // coordenadas opcionales con validación de rango
      latitud: ['', [this.latitudeValidator]],
      longitud: ['', [this.longitudeValidator]],
      idPlan: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // cargar planes activos para mostrar descripción en el modal
    this.planesService.obtenerPlanesActivos().subscribe({
      next: (res) => {
        const list = (res.data || []) as PlanDto[];
        list.forEach(p => { this.planMap[p.id] = p; });
      },
      error: () => { /* no crítico */ }
    });
    // Focus en el primer campo
    setTimeout(() => {
      const nombreField = document.getElementById('nombre');
      if (nombreField) {
        nombreField.focus();
      }
    }, 100);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData = this.form.value;
    const createDto: CreateInmobiliariaDto & { latitud?: number; longitud?: number } = {
      nombre: formData.nombre.trim(),
      subdominio: formData.subdominio.trim().toLowerCase(),
      dominioPersonalizado: formData.dominioPersonalizado?.trim() || undefined,
      idPlan: Number(formData.idPlan)
    };

    // mapear lat/long si existen y son válidas
    if (formData.latitud !== '' && formData.latitud !== null && formData.latitud !== undefined) {
      const lat = Number(formData.latitud);
      if (!isNaN(lat)) createDto.latitud = lat;
    }
    if (formData.longitud !== '' && formData.longitud !== null && formData.longitud !== undefined) {
      const lon = Number(formData.longitud);
      if (!isNaN(lon)) createDto.longitud = lon;
    };

    this.save.emit(createDto);
  }

  onClose(): void {
    this.close.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      }
      if (field.errors['pattern'] && fieldName === 'subdominio') {
        return 'Solo letras minúsculas, números y guiones';
      }
      if (field.errors['invalidLatitude']) return 'Latitud inválida. Debe ser número entre -90 y 90';
      if (field.errors['invalidLongitude']) return 'Longitud inválida. Debe ser número entre -180 y 180';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nombre: 'Nombre',
      subdominio: 'Subdominio',
      dominioPersonalizado: 'Dominio personalizado',
      idPlan: 'Plan'
    };
    return labels[fieldName] || fieldName;
  }

  onSubdominioChange(): void {
    const subdominioValue = this.form.get('subdominio')?.value;
    if (subdominioValue) {
      // Convertir a minúsculas automáticamente
      this.form.patchValue({
        subdominio: subdominioValue.toLowerCase()
      });
    }
  }

  // validadores simples para lat/lon (permiten vacío)
  private latitudeValidator(control: AbstractControl | null) {
    const v = control?.value;
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    if (isNaN(n) || n < -90 || n > 90) return { invalidLatitude: true };
    return null;
  }

  private longitudeValidator(control: AbstractControl | null) {
    const v = control?.value;
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    if (isNaN(n) || n < -180 || n > 180) return { invalidLongitude: true };
    return null;
  }

  getPlanDescription(planId: any): string {
    const id = Number(planId);
    if (!id) return '';
    const plan = this.planMap[id];
    if (plan) return plan.descripcion || plan.nombre || '';
    // si no está en caché, solicitar al servicio (async) y dejar cadena vacía por ahora
    this.planesService.obtenerPlanPorId(id).subscribe({
      next: (res) => {
        const p = (res.data || (res as any)) as PlanDto;
        if (p) this.planMap[p.id] = p;
      },
      error: () => { /* silent */ }
    });
    return '';
  }
}
