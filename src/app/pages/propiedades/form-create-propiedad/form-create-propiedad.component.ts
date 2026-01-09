import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PropiedadesService } from '../propiedades.service';
import { CboUsuriosInmobiliariaComponent } from "../../usuario/components/cbo-usurios-inmobiliaria/cbo-usurios-inmobiliaria.component";

interface CreatePropiedadDto {
  titulo: string;
  descripcion: string;
  precio?: number;
  direccion: string;
  latitud?: number;
  longitud?: number;
  idAgenteResponsable?: number;
  idInmobiliaria: number;
}

@Component({
  selector: 'app-form-create-propiedad',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CboUsuriosInmobiliariaComponent],
  templateUrl: './form-create-propiedad.component.html',
  styleUrl: './form-create-propiedad.component.css'
})
export class FormCreatePropiedadComponent implements OnInit {
  propiedadForm: FormGroup;
  loading: boolean = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private propiedadesService: PropiedadesService,
    private router: Router
  ) {
    this.propiedadForm = this.createForm();
  }

  ngOnInit(): void {
    // this.cargarAgentes(); // No longer needed
  }

  createForm(): FormGroup {
    return this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(150)]],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
      precio: [null, [Validators.min(0.01)]],
      direccion: ['', [Validators.required, Validators.maxLength(200)]],
      latitud: [null],
      longitud: [null],
      idAgenteResponsable: [null]
    });
  }

  onSubmit(): void {
    if (this.propiedadForm.valid) {
      this.loading = true;
      this.error = '';

      const formData = this.propiedadForm.value;
      const createDto: CreatePropiedadDto = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        precio: formData.precio || undefined,
        direccion: formData.direccion,
        latitud: formData.latitud || undefined,
        longitud: formData.longitud || undefined,
        idAgenteResponsable: formData.idAgenteResponsable || undefined,
        idInmobiliaria: 0 // This will be set automatically by the backend from token
      };

      this.propiedadesService.crearPropiedad(createDto).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/propiedades']);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Error al crear la propiedad';
          console.error('Error creating property:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.propiedadForm.controls).forEach(key => {
      const control = this.propiedadForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/propiedades']);
  }

  getFieldError(fieldName: string): string {
    const field = this.propiedadForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) {
        return `Este campo es obligatorio`;
      }
      if (field.errors['maxlength']) {
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return `El valor debe ser mayor a ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.propiedadForm.get(fieldName);
    return !!(field?.touched && field?.errors);
  }
}
