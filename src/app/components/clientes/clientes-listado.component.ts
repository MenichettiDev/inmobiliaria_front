import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes-listado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes-listado.component.html',
  styleUrls: ['./clientes-listado.component.css']
})
export class ClientesListadoComponent implements OnInit {
  // Tipos de cliente
  tiposCliente = [
    { id: 'comprador', nombre: 'Comprador' },
    { id: 'vendedor', nombre: 'Vendedor' },
    { id: 'propietario', nombre: 'Propietario' },
    { id: 'inquilino', nombre: 'Inquilino' }
  ];

  // Filtros
  filtroTipo = '';
  filtroBusqueda = '';

  // Clientes de ejemplo
  clientes = [
    {
      id: 1,
      nombre: 'Roberto Martínez',
      email: 'roberto.martinez@email.com',
      telefono: '+54 11 2345-6789',
      tipo: 'comprador',
      fechaRegistro: '2024-01-10',
      propiedadesAsociadas: ['Casa en Belgrano'],
      operacionesRealizadas: 1,
      ultimaInteraccion: '2024-01-14'
    },
    {
      id: 2,
      nombre: 'Laura Fernández',
      email: 'laura.fernandez@email.com',
      telefono: '+54 11 3456-7890',
      tipo: 'vendedor',
      fechaRegistro: '2024-01-05',
      propiedadesAsociadas: ['Departamento en Recoleta', 'Local en Microcentro'],
      operacionesRealizadas: 2,
      ultimaInteraccion: '2024-01-13'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  aplicarFiltros(): void {
    console.log('Aplicando filtros - Tipo:', this.filtroTipo, 'Búsqueda:', this.filtroBusqueda);
  }

  limpiarFiltros(): void {
    this.filtroTipo = '';
    this.filtroBusqueda = '';
  }

  crearCliente(): void {
    console.log('Crear nuevo cliente');
  }

  editarCliente(id: number): void {
    console.log('Editar cliente:', id);
  }

  verHistorial(id: number): void {
    console.log('Ver historial cliente:', id);
  }

  asociarPropiedad(id: number): void {
    console.log('Asociar propiedad al cliente:', id);
  }

  obtenerTipoNombre(tipo: string): string {
    const tipoObj = this.tiposCliente.find(t => t.id === tipo);
    return tipoObj ? tipoObj.nombre : tipo;
  }
}
