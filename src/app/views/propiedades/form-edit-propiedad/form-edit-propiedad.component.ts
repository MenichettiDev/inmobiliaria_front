import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PropiedadesService } from '../propiedades.service';
import { CboUsuarioComponent } from '../../usuario/components/cbo-usuario/cbo-usuario.component';
import { CboProvinciaComponent } from '../../../shared/cbo/cbo-provincia/cbo-provincia.component';
import { CboLocalidadComponent } from '../../../shared/cbo/cbo-localidad/cbo-localidad.component';
import { MapPickerComponent, LatLng } from '../../../shared/components/map-picker/map-picker.component';
import { ProvinciaDto } from '../../../shared/services/geografia.service';

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
  idLocalidad?: number;
  idInmobiliaria?: number;
}

@Component({
  selector: 'app-form-edit-propiedad',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CboUsuarioComponent, CboProvinciaComponent, CboLocalidadComponent, MapPickerComponent],
  templateUrl: './form-edit-propiedad.component.html',
  styleUrl: './form-edit-propiedad.component.css'
})
export class FormEditPropiedadComponent implements OnInit {
  propiedadForm: FormGroup;
  loading = false;
  error = '';
  propiedadId = 0;
  isLoadingPropiedad = true;

  selectedLat: number | null = null;
  selectedLng: number | null = null;
  selectedProvinciaId: number | null = null;
  selectedProvinciaNombre: string | null = null;

  estadosAdministrativos = [
    { id: 1, nombre: 'Propiedad visible y operativa' },
    { id: 2, nombre: 'Propiedad eliminada lógicamente' }
  ];

  estadosOperativos = [
    { id: 1, nombre: 'Disponible' },
    { id: 2, nombre: 'Alquilada' },
    { id: 3, nombre: 'Vendida' },
    { id: 4, nombre: 'Reservada' }
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
      idAgenteResponsable: [null],
      idEstadoAdmin: [null],
      idEstadoOperativo: [null],
      idProvincia: [null],
      idLocalidad: [null]
    });
  }

  cargarPropiedad(): void {
    this.isLoadingPropiedad = true;
    this.error = '';

    this.propiedadesService.obtenerPropiedad(this.propiedadId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const p = response.data;
          this.selectedLat = p.latitud || null;
          this.selectedLng = p.longitud || null;
          this.propiedadForm.patchValue({
            titulo: p.titulo,
            descripcion: p.descripcion,
            precio: p.precio,
            direccion: p.direccion,
            idAgenteResponsable: p.idAgenteResponsable,
            idEstadoAdmin: p.idEstadoAdmin,
            idEstadoOperativo: p.idEstadoOperativo,
            idLocalidad: (p as any).idLocalidad || null
          });
          // Si viene idProvincia de la propiedad (via localidad)
          this.selectedProvinciaId = (p as any).idProvincia || null;
          if (this.selectedProvinciaId) {
            this.propiedadForm.patchValue({ idProvincia: this.selectedProvinciaId });
          }
        } else {
          this.error = response.message || 'Error al cargar la propiedad';
        }
        this.isLoadingPropiedad = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Error al cargar la propiedad';
        this.isLoadingPropiedad = false;
      }
    });
  }

  onProvinciaSelected(prov: ProvinciaDto | null): void {
    this.selectedProvinciaId = prov?.id ?? null;
    this.selectedProvinciaNombre = prov?.nombre ?? null;
    this.propiedadForm.patchValue({ idProvincia: prov?.id ?? null, idLocalidad: null });
  }

  onLocalidadChange(id: number | null): void {
    this.propiedadForm.patchValue({ idLocalidad: id });
  }

  onLocationChange(coords: LatLng): void {
    this.selectedLat = coords.lat;
    this.selectedLng = coords.lng;
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
        latitud: this.selectedLat || undefined,
        longitud: this.selectedLng || undefined,
        idAgenteResponsable: formData.idAgenteResponsable || undefined,
        idEstadoAdmin: formData.idEstadoAdmin || undefined,
        idEstadoOperativo: formData.idEstadoOperativo || undefined,
        idLocalidad: formData.idLocalidad || undefined
      };

      this.propiedadesService.actualizarPropiedad(this.propiedadId, updateDto).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/propiedades']);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Error al actualizar la propiedad';
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.propiedadForm.controls).forEach(key => {
      this.propiedadForm.get(key)?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/propiedades']);
  }

  getFieldError(fieldName: string): string {
    const field = this.propiedadForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) return 'Este campo es obligatorio';
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `El valor debe ser mayor a ${field.errors['min'].min}`;
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.propiedadForm.get(fieldName);
    return !!(field?.touched && field?.errors);
  }

  onUsuarioAsignadoChange(userId: number | null): void {
    this.propiedadForm.patchValue({ idAgenteResponsable: userId });
  }
}
