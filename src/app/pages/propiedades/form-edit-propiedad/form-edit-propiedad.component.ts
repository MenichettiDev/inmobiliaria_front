import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PropiedadesService } from '../propiedades.service';
import { CboUsuriosInmobiliariaComponent } from '../../usuario/components/cbo-usurios-inmobiliaria/cbo-usurios-inmobiliaria.component';

interface UpdatePropiedadDto {
  id: number;
  titulo?: string;
  descripcion?: string;
  precio?: number;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  idAgenteResponsable?: number;
  idEstadoAdmin?: number;
  idEstadoOperativo?: number;
  idInmobiliaria?: number;
}

@Component({
  selector: 'app-form-edit-propiedad',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CboUsuriosInmobiliariaComponent],
  templateUrl: './form-edit-propiedad.component.html',
  styleUrl: './form-edit-propiedad.component.css'
})
export class FormEditPropiedadComponent implements OnInit {
  propiedadForm: FormGroup;
  loading: boolean = false;
  error: string = '';
  propiedadId: number = 0;
  isLoadingPropiedad: boolean = true;

  estadosAdministrativos = [
    { id: 1, nombre: 'Propiedad visible y operativa' },
    { id: 2, nombre: 'Propiedad eliminada lógicamente' }
  ];

  estadosOperativos = [
    { id: 1, nombre: 'Propiedad disponible para alquiler o venta' },
    { id: 2, nombre: 'Propiedad actualmente alquilada' },
    { id: 3, nombre: 'Propiedad vendida' },
    { id: 4, nombre: 'Propiedad reservada' }
  ];

  constructor(
    private fb: FormBuilder,
    private propiedadesService: PropiedadesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.propiedadForm = this.createForm();
  }

  ngOnInit(): void {
    this.propiedadId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.propiedadId) {
      this.cargarPropiedad();
    } else {
      this.router.navigate(['/propiedades']);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      titulo: ['', [Validators.maxLength(150)]],
      descripcion: ['', [Validators.maxLength(1000)]],
      precio: [null, [Validators.min(0.01)]],
      direccion: ['', [Validators.maxLength(200)]],
      latitud: [null],
      longitud: [null],
      idAgenteResponsable: [null],
      idEstadoAdmin: [null],
      idEstadoOperativo: [null]
    });
  }

  cargarPropiedad(): void {
    this.isLoadingPropiedad = true;
    this.error = '';

    this.propiedadesService.obtenerPropiedad(this.propiedadId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const propiedad = response.data;
          this.propiedadForm.patchValue({
            titulo: propiedad.titulo,
            descripcion: propiedad.descripcion,
            precio: propiedad.precio,
            direccion: propiedad.direccion,
            latitud: propiedad.latitud,
            longitud: propiedad.longitud,
            idAgenteResponsable: propiedad.idAgenteResponsable,
            idEstadoAdmin: propiedad.idEstadoAdmin,
            idEstadoOperativo: propiedad.idEstadoOperativo
          });
        } else {
          this.error = response.message || 'Error al cargar la propiedad';
        }
        this.isLoadingPropiedad = false;
      },
      error: (error) => {
        console.error('Error loading property:', error);
        this.error = error.error?.message || 'Error al cargar la propiedad';
        this.isLoadingPropiedad = false;
      }
    });
  }

  onSubmit(): void {
    if (this.propiedadForm.valid) {
      this.loading = true;
      this.error = '';

      const formData = this.propiedadForm.value;
      const updateDto: UpdatePropiedadDto = {
        id: this.propiedadId,
        titulo: formData.titulo || undefined,
        descripcion: formData.descripcion || undefined,
        precio: formData.precio || undefined,
        direccion: formData.direccion || undefined,
        latitud: formData.latitud || undefined,
        longitud: formData.longitud || undefined,
        idAgenteResponsable: formData.idAgenteResponsable || undefined,
        idEstadoAdmin: formData.idEstadoAdmin || undefined,
        idEstadoOperativo: formData.idEstadoOperativo || undefined
      };

      this.propiedadesService.actualizarPropiedad(this.propiedadId, updateDto).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/propiedades']);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Error al actualizar la propiedad';
          console.error('Error updating property:', error);
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
