import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CboUsuarioComponent } from "../../../usuario/components/cbo-usuario/cbo-usuario.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrl: './modal-edit.component.css',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CboUsuarioComponent]
})
export class ModalEditComponent implements OnInit, OnChanges {
  @Input() propiedad: any = null;
  @Input() estadosAdministrativos: any[] = [];
  @Input() estadosOperativos: any[] = [];

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  propiedadForm!: FormGroup;
  visible = false;
  loading = false;
  propiedadId: any = null;
  error: string = '';

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
    this.propiedadForm.patchValue({
      titulo: this.propiedad.titulo || '',
      descripcion: this.propiedad.descripcion || '',
      precio: this.propiedad.precio || 0,
      idAgenteResponsable: this.propiedad.idAgenteResponsable || null,
      direccion: this.propiedad.direccion || '',
      idEstadoAdmin: this.propiedad.idEstadoAdmin || (this.estadosAdministrativos[0]?.id || null),
      idEstadoOperativo: this.propiedad.idEstadoOperativo || (this.estadosOperativos[0]?.id || null),
      latitud: this.propiedad.latitud || null,
      longitud: this.propiedad.longitud || null
    });
  }

  open(propiedad?: any) {
    if (propiedad) {
      this.propiedad = propiedad;
      this.loadPropiedadData();
    }
    this.visible = true;
    this.error = '';
  }

  close() {
    this.visible = false;
    this.error = '';
  }

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

  onUsuarioAsignadoChange(usuarioId: any) {
    this.propiedadForm.patchValue({ idAgenteResponsable: usuarioId });
  }

  onSubmit() {
    if (this.propiedadForm.invalid) {
      this.propiedadForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = { ...this.propiedad, ...this.propiedadForm.value };
    this.save.emit(formData);
  }

  onCancel() {
    this.cancel.emit();
    this.close();
  }

  // Método público para ser llamado desde el componente padre
  setLoading(loading: boolean) {
    this.loading = loading;
    if (!loading) {
      this.close();
    }
  }

  setError(error: string) {
    this.error = error;
    this.loading = false;
  }
}
