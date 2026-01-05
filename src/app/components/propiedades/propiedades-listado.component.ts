import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-propiedades-listado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './propiedades-listado.component.html',
  styleUrls: ['./propiedades-listado.component.css']
})
export class PropiedadesListadoComponent implements OnInit {
  // Filtros
  filtros = {
    estadoAdministrativo: '',
    estadoComercial: '',
    tipo: '',
    agente: '',
    busqueda: ''
  };

  // Estados disponibles
  estadosAdministrativos = [
    { id: 1, nombre: 'Activa' },
    { id: 2, nombre: 'En revisión' },
    { id: 3, nombre: 'Pausada' }
  ];

  estadosComerciales = [
    { id: 1, nombre: 'Disponible' },
    { id: 2, nombre: 'Reservada' },
    { id: 3, nombre: 'Vendida' }
  ];

  tipos = [
    { id: 1, nombre: 'Casa' },
    { id: 2, nombre: 'Departamento' },
    { id: 3, nombre: 'Local' },
    { id: 4, nombre: 'Oficina' }
  ];

  agentes = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'María González' },
    { id: 3, nombre: 'Carlos López' }
  ];

  // Propiedades de ejemplo
  propiedades = [
    {
      id: 1,
      titulo: 'Casa en Palermo',
      tipo: 'Casa',
      precio: 350000,
      estadoAdministrativo: 'Activa',
      estadoComercial: 'Disponible',
      agente: 'Juan Pérez',
      fechaCreacion: '2024-01-10',
      imagen: 'assets/images/propiedades/casa1.jpg'
    },
    {
      id: 2,
      titulo: 'Departamento en Recoleta',
      tipo: 'Departamento',
      precio: 280000,
      estadoAdministrativo: 'Activa',
      estadoComercial: 'Reservada',
      agente: 'María González',
      fechaCreacion: '2024-01-08',
      imagen: 'assets/images/propiedades/depto1.jpg'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  aplicarFiltros(): void {
    // Lógica para filtrar propiedades
    console.log('Aplicando filtros:', this.filtros);
  }

  limpiarFiltros(): void {
    this.filtros = {
      estadoAdministrativo: '',
      estadoComercial: '',
      tipo: '',
      agente: '',
      busqueda: ''
    };
  }

  editarPropiedad(id: number): void {
    console.log('Editar propiedad:', id);
  }

  cambiarEstado(id: number): void {
    console.log('Cambiar estado propiedad:', id);
  }

  publicarPropiedad(id: number): void {
    console.log('Publicar propiedad:', id);
  }
}
