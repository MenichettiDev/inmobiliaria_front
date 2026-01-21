import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Inmobiliaria, CreateInmobiliariaDto, UpdateInmobiliariaDto } from '../../inmobiliaria.service';

@Component({
  selector: 'app-modal-details-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-details-edit.component.html',
  styleUrls: ['./modal-details-edit.component.css']
})
export class ModalDetailsEditComponent implements OnInit, OnChanges {
  @Input() show = false; // Ensure this is used to control modal visibility
  @Input() inmobiliaria: Inmobiliaria | null = null;
  @Input() isEditMode = false;
  @Input() isCreateMode = false;
  @Input() isLoading = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateInmobiliariaDto | UpdateInmobiliariaDto>();

  form: FormGroup;
  isViewMode = false;

  // Plan options
  planOptions = [
    { id: 1, nombre: 'FREE' },
    { id: 2, nombre: 'BASIC' },
    { id: 3, nombre: 'PRO' },
    { id: 4, nombre: 'PREMIUM' }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      subdominio: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/), Validators.minLength(3), Validators.maxLength(50)]],
      dominioPersonalizado: [''],
      idPlan: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.updateFormState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inmobiliaria'] || changes['isEditMode'] || changes['isCreateMode']) {
      this.updateFormState();
    }
  }

  private updateFormState(): void {
    this.isViewMode = !this.isEditMode && !this.isCreateMode;

    if (this.isCreateMode) {
      // Clear form for new inmobiliaria
      this.form.reset();
      this.form.enable();
    } else if (this.inmobiliaria) {
      // Populate form with existing data
      this.form.patchValue({
        nombre: this.inmobiliaria.nombre,
        subdominio: this.inmobiliaria.subdominio,
        dominioPersonalizado: this.inmobiliaria.dominioPersonalizado || '',
        idPlan: this.inmobiliaria.idPlan
      });

      if (this.isViewMode) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }
  }

  get modalTitle(): string {
    if (this.isCreateMode) return 'Crear Nueva Inmobiliaria';
    if (this.isEditMode) return 'Editar Inmobiliaria';
    return 'Detalles de Inmobiliaria';
  }

  get saveButtonText(): string {
    if (this.isCreateMode) return 'Crear';
    return 'Actualizar';
  }

  onSubmit(): void {
    if (this.form.invalid || this.isViewMode) return;

    const formData = this.form.value;

    if (this.isCreateMode) {
      const createDto: CreateInmobiliariaDto = {
        nombre: formData.nombre,
        subdominio: formData.subdominio,
        dominioPersonalizado: formData.dominioPersonalizado || undefined,
        idPlan: parseInt(formData.idPlan)
      };
      this.save.emit(createDto);
    } else if (this.inmobiliaria) {
      const updateDto: UpdateInmobiliariaDto = {
        id: this.inmobiliaria.id,
        nombre: formData.nombre,
        subdominio: formData.subdominio,
        dominioPersonalizado: formData.dominioPersonalizado || undefined,
        idPlan: parseInt(formData.idPlan)
      };
      this.save.emit(updateDto);
    }
  }

  onClose(): void {
    this.close.emit();
  }

  toggleEditMode(): void {
    if (this.isViewMode) {
      this.isEditMode = true;
      this.isViewMode = false;
      this.form.enable();
    } else {
      this.isEditMode = false;
      this.isViewMode = true;
      this.form.disable();
      // Restore original values
      this.updateFormState();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return 'Solo letras minúsculas, números y guiones';
    }
    return '';
  }

  getPlanName(planId: number): string {
    const plan = this.planOptions.find(p => p.id === planId);
    return plan?.nombre || 'Sin plan';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
