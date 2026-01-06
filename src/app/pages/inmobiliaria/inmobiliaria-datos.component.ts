import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-inmobiliaria-datos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inmobiliaria-datos.component.html',
  // styleUrls: ['./inmobiliaria-datos.component.css']
})
export class InmobiliariaDatosComponent implements OnInit {
  datosForm: FormGroup;
  logoFile: File | null = null;
  logoPreview: string | null = null;

  // Datos actuales de la inmobiliaria
  datosInmobiliaria = {
    nombre: 'Elite Propiedades',
    cuit: '20-12345678-9',
    direccion: 'Av. Corrientes 1234',
    ciudad: 'Buenos Aires',
    provincia: 'CABA',
    codigoPostal: '1043',
    telefono: '+54 11 4567-8900',
    email: 'info@elitepropiedades.com',
    sitioWeb: 'www.elitepropiedades.com',
    subdominio: 'elite',
    descripcion: 'Inmobiliaria con más de 20 años de experiencia en el mercado.',
    logo: 'assets/images/inmobiliaria/logo-elite.png',
    coloresMarca: {
      primario: '#007bff',
      secundario: '#6c757d'
    }
  };

  constructor(private fb: FormBuilder) {
    this.datosForm = this.fb.group({
      nombre: [this.datosInmobiliaria.nombre, [Validators.required]],
      cuit: [this.datosInmobiliaria.cuit, [Validators.required]],
      direccion: [this.datosInmobiliaria.direccion, [Validators.required]],
      ciudad: [this.datosInmobiliaria.ciudad, [Validators.required]],
      provincia: [this.datosInmobiliaria.provincia, [Validators.required]],
      codigoPostal: [this.datosInmobiliaria.codigoPostal, [Validators.required]],
      telefono: [this.datosInmobiliaria.telefono, [Validators.required]],
      email: [this.datosInmobiliaria.email, [Validators.required, Validators.email]],
      sitioWeb: [this.datosInmobiliaria.sitioWeb],
      subdominio: [this.datosInmobiliaria.subdominio, [Validators.required]],
      descripcion: [this.datosInmobiliaria.descripcion],
      colorPrimario: [this.datosInmobiliaria.coloresMarca.primario],
      colorSecundario: [this.datosInmobiliaria.coloresMarca.secundario]
    });
  }

  ngOnInit(): void {
    this.logoPreview = this.datosInmobiliaria.logo;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.logoFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarDatos(): void {
    if (this.datosForm.valid) {
      const formData = this.datosForm.value;
      console.log('Guardando datos de la inmobiliaria:', formData);

      if (this.logoFile) {
        console.log('Subiendo nuevo logo:', this.logoFile);
      }

      // Aquí iría la lógica para enviar al backend
      alert('Datos guardados correctamente');
    } else {
      console.log('Formulario inválido');
    }
  }

  resetearLogo(): void {
    this.logoFile = null;
    this.logoPreview = this.datosInmobiliaria.logo;
  }

  verificarSubdominio(): void {
    const subdominio = this.datosForm.get('subdominio')?.value;
    console.log('Verificando disponibilidad del subdominio:', subdominio);
    // Lógica para verificar disponibilidad
  }

  previsualizarPortal(): void {
    console.log('Abriendo vista previa del portal');
    // Abrir en nueva ventana la vista previa
  }
}
