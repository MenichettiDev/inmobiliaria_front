import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PropiedadesService } from '../propiedades.service';
import { CboUsuarioComponent } from '../../usuario/components/cbo-usuario/cbo-usuario.component';
import { CboProvinciaComponent } from '../../../shared/cbo/cbo-provincia/cbo-provincia.component';
import { CboLocalidadComponent } from '../../../shared/cbo/cbo-localidad/cbo-localidad.component';
import { MapPickerComponent, LatLng } from '../../../shared/components/map-picker/map-picker.component';
import { ProvinciaDto } from '../../../shared/services/geografia.service';


@Component({
  selector: 'app-form-create-propiedad',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CboUsuarioComponent, CboProvinciaComponent, CboLocalidadComponent, MapPickerComponent],
  templateUrl: './form-create-propiedad.component.html',
  styleUrl: './form-create-propiedad.component.css'
})
export class FormCreatePropiedadComponent implements OnInit {
  propiedadForm: FormGroup;
  loading = false;
  error = '';

  // ubicación
  selectedLat: number | null = null;
  selectedLng: number | null = null;
  selectedProvinciaId: number | null = null;
  selectedProvinciaNombre: string | null = null;

  // imágenes
  maxImages = 20;
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  maxSizeBytes = 5 * 1024 * 1024;
  images: { file: File; preview: string; name: string; size: number }[] = [];
  imageErrors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private propiedadesService: PropiedadesService,
    private router: Router
  ) {
    this.propiedadForm = this.createForm();
  }

  ngOnInit(): void {}

  createForm(): FormGroup {
    return this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(150)]],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
      precio: [null, [Validators.min(0.01)]],
      direccion: ['', [Validators.required, Validators.maxLength(200)]],
      idAgenteResponsable: [null],
      idProvincia: [null],
      idLocalidad: [null]
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

  async onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input?.files) return;
    const files = Array.from(input.files);
    await this.handleFiles(files);
    if (input) input.value = '';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget as HTMLElement;
    element.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget as HTMLElement;
    element.classList.remove('drag-over');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget as HTMLElement;
    element.classList.remove('drag-over');
    
    if (event.dataTransfer?.files) {
      const files = Array.from(event.dataTransfer.files);
      this.handleFiles(files);
    }
  }

  async handleFiles(files: File[]) {
    this.imageErrors = [];
    
    if (this.images.length + files.length > this.maxImages) {
      this.imageErrors.push(`Solo podés agregar hasta ${this.maxImages} imágenes en total.`);
    }

    for (const f of files) {
      if (this.images.length >= this.maxImages) break;
      if (!this.allowedTypes.includes(f.type)) {
        this.imageErrors.push(`${f.name}: formato no permitido (usar jpg o png).`);
        continue;
      }
      if (f.size > this.maxSizeBytes) {
        this.imageErrors.push(`${f.name}: el archivo supera los 5MB.`);
        continue;
      }
      try {
        const preview = await this.readFileAsDataURL(f);
        this.images.push({ file: f, preview, name: f.name, size: f.size });
      } catch {
        this.imageErrors.push(`${f.name}: error al leer el archivo.`);
      }
    }
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
    this.images.splice(index, 1);
  }

  onSubmit(): void {
    if (!this.propiedadForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const formValues = this.propiedadForm.value;
    const propiedadJson = JSON.stringify({
      titulo: formValues.titulo,
      descripcion: formValues.descripcion,
      precio: formValues.precio || null,
      direccion: formValues.direccion,
      latitud: this.selectedLat || null,
      longitud: this.selectedLng || null,
      idAgenteResponsable: formValues.idAgenteResponsable || null,
      idLocalidad: formValues.idLocalidad || null,
      idInmobiliaria: 0
    });

    const multipart = new FormData();
    multipart.append('propiedadJson', propiedadJson);
    this.images.forEach((img, i) => multipart.append(`imagen_${i}`, img.file, img.file.name));

    this.propiedadesService.crearPropiedadConImagenes(multipart).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.property?.success || response.success) {
          this.router.navigate(['/propiedades']);
        } else {
          this.error = response.property?.message || response.message || 'No se pudo crear la propiedad';
        }
      },
      error: (error: any) => {
        this.loading = false;
        this.error = error.error?.message || 'Error al crear la propiedad';
      }
    });
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
