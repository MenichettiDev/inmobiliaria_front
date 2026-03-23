import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CboUsuarioComponent } from "../../../usuario/components/cbo-usuario/cbo-usuario.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { MapPickerComponent, LatLng } from '../../../../shared/components/map-picker/map-picker.component';

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrl: './modal-edit.component.css',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CboUsuarioComponent, MapPickerComponent]
})
export class ModalEditComponent implements OnInit, OnChanges {
  @Input() propiedad: any = null;
  @Input() estadosAdministrativos: any[] = [];
  @Input() estadosOperativos: any[] = [];

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  propiedadForm!: FormGroup;
  loading = false;
  propiedadId: any = null;
  error: string = '';

  // Imágenes: existentes (desde propiedad), ids a borrar y nuevos archivos a subir
  existingImages: any[] = [];
  imagesToRemove: number[] = [];
  newFiles: File[] = [];
  newFilePreviews: string[] = [];

  // Ubicación para el mapa
  selectedLat: number | null = null;
  selectedLng: number | null = null;
  selectedProvinciaNombre: string | null = null;

  constructor(private fb: FormBuilder) {
    this.propiedadForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      idAgenteResponsable: [null],
      direccion: [''],
      idEstadoAdmin: [null],
      idEstadoOperativo: [null],
      latitud: [null],
      longitud: [null]
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['propiedad'] && this.propiedadForm) {
      this.loadPropiedadData();
    }
  }

  private initForm() {
    // Ya no necesitamos recrear el form aquí, solo cargar datos si existe propiedad
    if (this.propiedad) {
      this.loadPropiedadData();
    }
  }

  private loadPropiedadData() {
    if (!this.propiedad) return;

    this.propiedadId = this.propiedad.id;
    // mapear y normalizar urls de imagen (usar buildUrl)
    this.existingImages = Array.isArray(this.propiedad.imagenes)
      ? this.propiedad.imagenes.map((im: any) => ({
        ...im,
        url: this.buildUrl(im?.url)
      }))
      : [];

    this.imagesToRemove = [];
    this.newFiles = [];
    this.newFilePreviews = [];

    this.propiedadForm.patchValue({
      titulo: this.propiedad.titulo || '',
      descripcion: this.propiedad.descripcion || '',
      precio: this.propiedad.precio || 0,
      idAgenteResponsable: this.propiedad.idAgenteResponsable || null,
      direccion: this.propiedad.direccion || '',
      idEstadoAdmin: this.propiedad.idEstadoAdmin || (this.estadosAdministrativos[0]?.id || null),
      idEstadoOperativo: this.propiedad.idEstadoOperativo || (this.estadosOperativos[0]?.id || null)
    });

    this.selectedLat = this.propiedad.latitud || null;
    this.selectedLng = this.propiedad.longitud || null;
    this.selectedProvinciaNombre = this.propiedad.provinciaNombre || null;
  }

  private buildUrl(url?: string): string {
    if (!url) return 'assets/images/backgrounds/vacia.jpg';
    const raw = url.toString().replace(/\r?\n|\r/g, '').trim();
    if (/^https?:\/\//i.test(raw)) return raw;
    const apiRoot = environment.apiUrl.replace(/\/api(\/)?$/i, '').replace(/\/$/, '');
    const cleanUrl = raw.replace(/^\/?api\/?/, '/').replace(/\/+/, '/');
    return encodeURI(apiRoot + (cleanUrl.startsWith('/') ? '' : '/') + cleanUrl);
  }

  // open(propiedad?: any) {
  //   if (propiedad) {
  //     this.propiedad = propiedad;
  //     this.loadPropiedadData();
  //   }
  //   this.visible = true;
  //   this.error = '';
  // }

  // close() {
  //   this.visible = false;
  //   this.error = '';
  // }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.propiedadForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.propiedadForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['min']) return 'El valor debe ser mayor a 0';
    }
    return '';
  }

  // Eliminar imagen existente (marcar para borrado y quitar de la lista mostrada)
  removeExistingImage(imageId: number) {
    if (!imageId) return;
    this.imagesToRemove.push(imageId);
    this.existingImages = this.existingImages.filter(img => img.id !== imageId);
  }

  // Seleccionar nuevos archivos (multiple)
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    Array.from(input.files).forEach(file => {
      this.newFiles.push(file);
      const url = URL.createObjectURL(file);
      this.newFilePreviews.push(url);
    });
    // reset input value to allow selecting same file again if needed
    input.value = '';
  }

  removeNewFile(index: number) {
    if (index < 0 || index >= this.newFiles.length) return;
    // revoke preview URL
    const url = this.newFilePreviews[index];
    if (url) URL.revokeObjectURL(url);
    this.newFiles.splice(index, 1);
    this.newFilePreviews.splice(index, 1);
  }

  onUsuarioAsignadoChange(usuarioId: any) {
    this.propiedadForm.patchValue({ idAgenteResponsable: usuarioId });
  }

  onLocationChange(coords: LatLng) {
    this.selectedLat = coords.lat;
    this.selectedLng = coords.lng;
  }

  onSubmit() {
    if (this.propiedadForm.invalid) {
      this.propiedadForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload: any = {
      ...this.propiedad,
      ...this.propiedadForm.value,
      latitud: this.selectedLat,
      longitud: this.selectedLng
    };
    if (this.imagesToRemove && this.imagesToRemove.length) payload.imagesToRemove = [...this.imagesToRemove];
    if (this.newFiles && this.newFiles.length) payload.newFiles = [...this.newFiles];
    this.save.emit(payload);
  }

  onCancel() {
    this.cancel.emit();
  }

  // Método público para ser llamado desde el componente padre
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string) {
    this.error = error;
    this.loading = false;
  }
}
