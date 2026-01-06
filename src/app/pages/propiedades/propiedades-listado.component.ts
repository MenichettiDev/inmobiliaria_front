import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PropiedadesService } from './propiedades.service';

@Component({
  selector: 'app-propiedades-listado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './propiedades-listado.component.html',
  // styleUrls: ['./propiedades-listado.component.css']
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

  constructor(private propiedadesService: PropiedadesService) { }

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

  get propiedadesFiltradas() {
    let filtradas = [...this.propiedades];

    if (this.filtros.estadoAdministrativo) {
      filtradas = filtradas.filter(p => p.estadoAdministrativo === this.filtros.estadoAdministrativo);
    }

    if (this.filtros.estadoComercial) {
      filtradas = filtradas.filter(p => p.estadoComercial === this.filtros.estadoComercial);
    }

    if (this.filtros.tipo) {
      filtradas = filtradas.filter(p => p.tipo === this.filtros.tipo);
    }

    if (this.filtros.agente) {
      filtradas = filtradas.filter(p => p.agente === this.filtros.agente);
    }

    if (this.filtros.busqueda) {
      const termino = this.filtros.busqueda.toLowerCase();
      filtradas = filtradas.filter(p =>
        p.titulo.toLowerCase().includes(termino) ||
        p.tipo.toLowerCase().includes(termino)
      );
    }

    return filtradas;
  }

  crearPropiedad(): void {
    console.log('Crear nueva propiedad');
    // Implementar navegación o modal
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

  obtenerColorEstado(estado: string): string {
    const colores = {
      'Disponible': 'success',
      'Reservada': 'warning',
      'Vendida': 'danger',
      'En mantenimiento': 'secondary'
    };
    return colores[estado as keyof typeof colores] || 'secondary';
  }
}
