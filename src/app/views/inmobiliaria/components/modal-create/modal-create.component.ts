import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
    const createDto: CreateInmobiliariaDto = {
      nombre: formData.nombre.trim(),
      subdominio: formData.subdominio.trim().toLowerCase(),
      dominioPersonalizado: formData.dominioPersonalizado?.trim() || undefined,
      idPlan: Number(formData.idPlan)
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
