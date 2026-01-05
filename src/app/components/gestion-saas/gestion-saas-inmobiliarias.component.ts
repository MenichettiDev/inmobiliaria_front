import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-saas-inmobiliarias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-saas-inmobiliarias.component.html',
  styleUrls: ['./gestion-saas-inmobiliarias.component.css']
})
export class GestionSaasInmobiliariasComponent implements OnInit {
  // Filtros
  filtros = {
    busqueda: '',
    plan: '',
    estado: '',
    fechaDesde: '',
    fechaHasta: ''
  };

  // Estados de inmobiliaria
  estadosInmobiliaria = [
    { id: 1, nombre: 'Activa', color: '#28a745' },
    { id: 2, nombre: 'Suspendida', color: '#ffc107' },
    { id: 3, nombre: 'Cancelada', color: '#dc3545' },
    { id: 4, nombre: 'En prueba', color: '#17a2b8' }
  ];

  // Inmobiliarias registradas
  inmobiliarias = [
    {
      id: 1,
      nombre: 'Elite Propiedades',
      email: 'admin@elitepropiedades.com',
      cuit: '20-12345678-9',
      plan: 'Profesional',
      estado: 1,
      fechaRegistro: '2023-06-15',
      ultimoAcceso: '2024-01-15 14:30',
      usuarios: 6,
      propiedades: 128,
      leads: 342,
      subdominio: 'elite',
      facturacionMensual: 15000,
      comisionSaaS: 1500
    },
    {
      id: 2,
      nombre: 'Inmobiliaria Premium',
      email: 'contacto@premium.com.ar',
      cuit: '20-87654321-0',
      plan: 'Enterprise',
      estado: 1,
      fechaRegistro: '2023-03-20',
      ultimoAcceso: '2024-01-15 09:45',
      usuarios: 15,
      propiedades: 450,
      leads: 890,
      subdominio: 'premium',
      facturacionMensual: 25000,
      comisionSaaS: 2500
    },
    {
      id: 3,
      nombre: 'Casa & Hogar',
      email: 'info@casayhogar.com',
      cuit: '20-11223344-5',
      plan: 'Básico',
      estado: 2,
      fechaRegistro: '2023-11-10',
      ultimoAcceso: '2024-01-10 16:20',
      usuarios: 2,
      propiedades: 45,
      leads: 67,
      subdominio: 'casayhogar',
      facturacionMensual: 8000,
      comisionSaaS: 800
    }
  ];

  // Planes disponibles
  planes = [
    { id: 1, nombre: 'Básico' },
    { id: 2, nombre: 'Profesional' },
    { id: 3, nombre: 'Enterprise' }
  ];

  // Métricas globales
  metricas = {
    totalInmobiliarias: 0,
    totalUsuarios: 0,
    totalPropiedades: 0,
    facturacionMensual: 0,
    comisionesSaaS: 0
  };

  constructor() { }

  ngOnInit(): void {
    this.calcularMetricas();
  }

  calcularMetricas(): void {
    this.metricas = {
      totalInmobiliarias: this.inmobiliarias.length,
      totalUsuarios: this.inmobiliarias.reduce((sum, i) => sum + i.usuarios, 0),
      totalPropiedades: this.inmobiliarias.reduce((sum, i) => sum + i.propiedades, 0),
      facturacionMensual: this.inmobiliarias.reduce((sum, i) => sum + i.facturacionMensual, 0),
      comisionesSaaS: this.inmobiliarias.reduce((sum, i) => sum + i.comisionSaaS, 0)
    };
  }

  get inmobiliariasFiltradas() {
    let filtradas = [...this.inmobiliarias];

    if (this.filtros.busqueda) {
      const termino = this.filtros.busqueda.toLowerCase();
      filtradas = filtradas.filter(i => 
        i.nombre.toLowerCase().includes(termino) ||
        i.email.toLowerCase().includes(termino) ||
        i.subdominio.toLowerCase().includes(termino)
      );
    }

    if (this.filtros.plan) {
      filtradas = filtradas.filter(i => i.plan === this.filtros.plan);
    }

    if (this.filtros.estado) {
      filtradas = filtradas.filter(i => i.estado === Number(this.filtros.estado));
    }

    return filtradas;
  }

  crearInmobiliaria(): void {
    console.log('Crear nueva inmobiliaria');
    // Mostrar modal de creación
  }

  editarInmobiliaria(id: number): void {
    console.log('Editar inmobiliaria:', id);
    // Mostrar modal de edición
  }

  cambiarEstado(id: number, nuevoEstado: number): void {
    const inmobiliaria = this.inmobiliarias.find(i => i.id === id);
    if (inmobiliaria) {
      inmobiliaria.estado = nuevoEstado;
      console.log('Estado cambiado para inmobiliaria:', id);
    }
  }

  suspenderInmobiliaria(id: number): void {
    this.cambiarEstado(id, 2);
  }

  activarInmobiliaria(id: number): void {
    this.cambiarEstado(id, 1);
  }

  accederComoAdmin(id: number): void {
    console.log('Acceder como admin a inmobiliaria:', id);
    // Implementar login como admin de la inmobiliaria
  }

  verDetalles(id: number): void {
    console.log('Ver detalles de inmobiliaria:', id);
  }

  cambiarPlan(id: number): void {
    console.log('Cambiar plan de inmobiliaria:', id);
    // Mostrar modal de cambio de plan
  }

  verFacturacion(id: number): void {
    console.log('Ver facturación de inmobiliaria:', id);
  }

  obtenerEstadoNombre(estadoId: number): string {
    const estado = this.estadosInmobiliaria.find(e => e.id === estadoId);
    return estado ? estado.nombre : 'Sin estado';
  }

  obtenerEstadoColor(estadoId: number): string {
    const estado = this.estadosInmobiliaria.find(e => e.id === estadoId);
    return estado ? estado.color : '#6c757d';
  }

  exportarDatos(): void {
    console.log('Exportar datos de inmobiliarias');
  }

  limpiarFiltros(): void {
    this.filtros = {
      busqueda: '',
      plan: '',
      estado: '',
      fechaDesde: '',
      fechaHasta: ''
    };
  }
}
