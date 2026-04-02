import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { PropiedadesService } from '../../propiedades.service';
import { Imagen } from '../../models/imagen.model';

@Component({
  selector: 'app-imagen-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './imagen-upload.component.html',
  styleUrl: './imagen-upload.component.css'
})
export class ImagenUploadComponent {
  @Input() propiedadId!: number;
  @Input() totalSubidas: number = 0;
  @Input() maxImagenes: number | null = null;

  @Output() imagenSubida = new EventEmitter<Imagen>();

  previewUrl: string | null = null;
  archivoSeleccionado: File | null = null;
  subiendo: boolean = false;
  progreso: number = 0;
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | '' = '';
  dragover: boolean = false;

  constructor(private propiedadesService: PropiedadesService) {}

  // Calcular si se puede subir más
  puedoSubir(): boolean {
    return this.maxImagenes === null || this.totalSubidas < this.maxImagenes;
  }

  // Validar archivo
  validarArchivo(file: File): { valido: boolean; error?: string } {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

    if (!tiposPermitidos.includes(file.type)) {
      return { valido: false, error: 'Solo JPG, PNG o WEBP' };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { valido: false, error: 'Máximo 5MB' };
    }

    return { valido: true };
  }

  // Manejar selección de archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      this.procesarArchivo(files[0]);
    }
  }

  // Manejar drag over
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragover = true;
  }

  // Manejar drag leave
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragover = false;
  }

  // Manejar drop
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragover = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.procesarArchivo(files[0]);
    }
  }

  // Procesar archivo (validar y mostrar preview)
  private procesarArchivo(file: File): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    const validacion = this.validarArchivo(file);
    if (!validacion.valido) {
      this.mensaje = validacion.error || 'Archivo inválido';
      this.tipoMensaje = 'error';
      this.previewUrl = null;
      this.archivoSeleccionado = null;
      return;
    }

    // Mostrar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    this.archivoSeleccionado = file;
    this.mensaje = `${file.name} (${(file.size / 1024).toFixed(2)} KB) listo para subir`;
    this.tipoMensaje = '';
  }

  // Subir imagen
  subirImagen(): void {
    if (!this.archivoSeleccionado || !this.puedoSubir()) {
      return;
    }

    this.subiendo = true;
    this.progreso = 0;
    this.mensaje = '';

    const formData = new FormData();
    formData.append('idPropiedad', this.propiedadId.toString());
    formData.append('archivo', this.archivoSeleccionado);

    this.propiedadesService.subirImagen(formData).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progreso = event.total ? Math.round((event.loaded / event.total) * 100) : 0;
        } else if (event.type === HttpEventType.Response) {
          if (event.body?.success && event.body?.data) {
            this.mensaje = 'Imagen subida correctamente';
            this.tipoMensaje = 'success';
            this.imagenSubida.emit(event.body.data);
            this.limpiar();
            setTimeout(() => {
              this.mensaje = '';
              this.tipoMensaje = '';
            }, 3000);
          }
        }
      },
      error: (err) => {
        this.subiendo = false;
        const errorMsg = err.error?.message || err.error?.errors?.[0] || 'Error al subir imagen';
        this.mensaje = errorMsg;
        this.tipoMensaje = 'error';
      },
      complete: () => {
        this.subiendo = false;
      }
    });
  }

  // Limpiar
  limpiar(): void {
    this.previewUrl = null;
    this.archivoSeleccionado = null;
    this.progreso = 0;
  }
}
