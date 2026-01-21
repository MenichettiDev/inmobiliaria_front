import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-saas-planes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: '',
  // styleUrls: ['./gestion-saas-planes.component.css']
})
export class GestionSaasPlanesComponent implements OnInit {
  // Planes del sistema
  planes = [
    {
      id: 1,
      nombre: 'Básico',
      precio: 8000,
      moneda: 'ARS',
      descripcion: 'Ideal para inmobiliarias pequeñas',
      activo: true,
      limites: {
        usuarios: 3,
        propiedades: 100,
        leads: 200,
        almacenamiento: '1GB',
        integraciones: 2
      },
      caracteristicas: [
        'Gestión básica de propiedades',
        'CRM de leads',
        'Agenda básica',
        'Soporte por email'
      ],
      suscripciones: 45,
      ingresosMensuales: 360000
    },
    {
      id: 2,
      nombre: 'Profesional',
      precio: 15000,
      moneda: 'ARS',
      descripcion: 'Para inmobiliarias en crecimiento',
      activo: true,
      limites: {
        usuarios: 10,
        propiedades: 500,
        leads: 1000,
        almacenamiento: '5GB',
        integraciones: 5
      },
      caracteristicas: [
        'Gestión completa de propiedades',
        'CRM avanzado',
        'Reportes detallados',
        'Integraciones con portales',
        'Automatizaciones',
        'Soporte prioritario'
      ],
      suscripciones: 28,
      ingresosMensuales: 420000
    },
    {
      id: 3,
      nombre: 'Enterprise',
      precio: 25000,
      moneda: 'ARS',
      descripcion: 'Para grandes inmobiliarias',
      activo: true,
      limites: {
        usuarios: 25,
        propiedades: 'Ilimitadas',
        leads: 'Ilimitados',
        almacenamiento: '20GB',
        integraciones: 'Ilimitadas'
      },
      caracteristicas: [
        'Todas las funciones de Profesional',
        'Usuario y propiedades ilimitados',
        'API completa',
        'Integraciones personalizadas',
        'Soporte dedicado',
        'Configuración personalizada'
      ],
      suscripciones: 12,
      ingresosMensuales: 300000
    }
  ];

  // Nuevo plan (formulario)
  nuevoPlan = {
    nombre: '',
    precio: 0,
    descripcion: '',
    usuarios: 0,
    propiedades: 0,
    leads: 0,
    almacenamiento: '',
    integraciones: 0,
    caracteristicas: ['']
  };

  // Estadísticas globales
  estadisticas = {
    totalPlanes: 0,
    totalSuscripciones: 0,
    ingresosTotales: 0,
    planMasPopular: '',
    crecimientoMensual: 12.5
  };

  constructor() { }

  ngOnInit(): void {
    this.calcularEstadisticas();
  }

  calcularEstadisticas(): void {
    this.estadisticas = {
      totalPlanes: this.planes.filter(p => p.activo).length,
      totalSuscripciones: this.planes.reduce((sum, p) => sum + p.suscripciones, 0),
      ingresosTotales: this.planes.reduce((sum, p) => sum + p.ingresosMensuales, 0),
      planMasPopular: this.obtenerPlanMasPopular(),
      crecimientoMensual: 12.5
    };
  }

  obtenerPlanMasPopular(): string {
    const planPopular = this.planes.reduce((max, plan) =>
      plan.suscripciones > max.suscripciones ? plan : max
    );
    return planPopular.nombre;
  }

  crearPlan(): void {
    if (this.nuevoPlan.nombre && this.nuevoPlan.precio > 0) {
      const plan = {
        id: this.planes.length + 1,
        nombre: this.nuevoPlan.nombre,
        precio: this.nuevoPlan.precio,
        moneda: 'ARS',
        descripcion: this.nuevoPlan.descripcion,
        activo: true,
        limites: {
          usuarios: this.nuevoPlan.usuarios,
          propiedades: this.nuevoPlan.propiedades,
          leads: this.nuevoPlan.leads,
          almacenamiento: this.nuevoPlan.almacenamiento,
          integraciones: this.nuevoPlan.integraciones
        },
        caracteristicas: this.nuevoPlan.caracteristicas.filter(c => c.trim()),
        suscripciones: 0,
        ingresosMensuales: 0
      };

      this.planes.push(plan);
      this.limpiarFormulario();
      this.calcularEstadisticas();
      console.log('Plan creado:', plan);
    }
  }

  editarPlan(id: number): void {
    console.log('Editar plan:', id);
    // Cargar datos en el formulario para edición
  }

  toggleActivo(id: number): void {
    const plan = this.planes.find(p => p.id === id);
    if (plan) {
      plan.activo = !plan.activo;
      this.calcularEstadisticas();
    }
  }

  eliminarPlan(id: number): void {
    if (confirm('¿Estás seguro de eliminar este plan?')) {
      this.planes = this.planes.filter(p => p.id !== id);
      this.calcularEstadisticas();
    }
  }

  duplicarPlan(id: number): void {
    const planOriginal = this.planes.find(p => p.id === id);
    if (planOriginal) {
      const planDuplicado = {
        ...planOriginal,
        id: this.planes.length + 1,
        nombre: `${planOriginal.nombre} (Copia)`,
        suscripciones: 0,
        ingresosMensuales: 0
      };
      this.planes.push(planDuplicado);
      this.calcularEstadisticas();
    }
  }

  verSuscripciones(id: number): void {
    console.log('Ver suscripciones del plan:', id);
    // Navegar a vista de suscripciones filtrada por plan
  }

  agregarCaracteristica(): void {
    this.nuevoPlan.caracteristicas.push('');
  }

  eliminarCaracteristica(index: number): void {
    this.nuevoPlan.caracteristicas.splice(index, 1);
  }

  limpiarFormulario(): void {
    this.nuevoPlan = {
      nombre: '',
      precio: 0,
      descripcion: '',
      usuarios: 0,
      propiedades: 0,
      leads: 0,
      almacenamiento: '',
      integraciones: 0,
      caracteristicas: ['']
    };
  }

  obtenerPorcentajeParticipacion(suscripciones: number): number {
    const total = this.estadisticas.totalSuscripciones;
    return total > 0 ? Math.round((suscripciones / total) * 100) : 0;
  }

  exportarDatos(): void {
    console.log('Exportar datos de planes');
  }
}
