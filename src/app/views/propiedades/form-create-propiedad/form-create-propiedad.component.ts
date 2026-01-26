import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PropiedadesService } from '../propiedades.service';
import { CboUsuarioComponent } from '../../usuario/components/cbo-usuario/cbo-usuario.component';

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
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CboUsuarioComponent],
  templateUrl: './form-create-propiedad.component.html',
  styleUrl: './form-create-propiedad.component.css'
})
export class FormCreatePropiedadComponent implements OnInit {
  propiedadForm: FormGroup;
  loading: boolean = false;
  error: string = '';

  // imágenes
  maxImages = 4;
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  maxSizeBytes = 5 * 1024 * 1024; // 5 MB
  images: { file: File; preview: string; name: string; size: number }[] = [];
  imageErrors: string[] = [];

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

  // manejar selección de archivos
  async onFilesSelected(event: Event) {
    this.imageErrors = [];
    const input = event.target as HTMLInputElement;
    if (!input?.files) return;
    const files = Array.from(input.files);

    if (this.images.length + files.length > this.maxImages) {
      this.imageErrors.push(`Solo puedes agregar hasta ${this.maxImages} imágenes.`);
    }

    for (const f of files) {
      if (this.images.length >= this.maxImages) break;
      if (!this.allowedTypes.includes(f.type)) {
        this.imageErrors.push(`${f.name}: formato no permitido.`);
        continue;
      }
      if (f.size > this.maxSizeBytes) {
        this.imageErrors.push(`${f.name}: supera ${this.maxSizeBytes / (1024 * 1024)} MB.`);
        continue;
      }
      try {
        const preview = await this.readFileAsDataURL(f);
        this.images.push({ file: f, preview, name: f.name, size: f.size });
      } catch {
        this.imageErrors.push(`${f.name}: no se pudo leer la imagen.`);
      }
    }
    // limpiar input para permitir re-subir mismo archivo luego
    if (input) input.value = '';
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || '');
      reader.onerror = () => reject();
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number) {
    if (index >= 0 && index < this.images.length) {
      this.images.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.propiedadForm.valid) {
      this.loading = true;
      this.error = '';

      const formData = this.propiedadForm.value;
      const createDto: CreatePropiedadDto & { Imagenes?: string[] } = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        precio: formData.precio || undefined,
        direccion: formData.direccion,
        latitud: formData.latitud || undefined,
        longitud: formData.longitud || undefined,
        idAgenteResponsable: formData.idAgenteResponsable || undefined,
        idInmobiliaria: 0 // This will be set automatically by the backend from token
      };

      // incluir imágenes (array de dataURLs) si existen
      if (this.images.length > 0) {
        createDto.Imagenes = this.images.map(i => i.preview);
      }

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

  onUsuarioAsignadoChange(userId: number | null): void {
    this.propiedadForm.patchValue({
      idAgenteResponsable: userId
    });
  }
}
