import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visor-plan-facturacion',
  imports: [CommonModule],
  templateUrl: './visor-plan-facturacion.component.html',
  styleUrl: './visor-plan-facturacion.component.css'
})
export class VisorPlanFacturacionComponent implements OnInit {
  // Plan actual
  planActual = {
    id: 2,
    nombre: 'Profesional',
    precio: 15000,
    moneda: 'ARS',
    periodo: 'mensual',
    fechaVencimiento: '2024-02-15',
    estado: 'activo',
    limites: {
      usuarios: 10,
      propiedades: 500,
      leads: 1000,
      almacenamiento: '5GB'
    },
    uso: {
      usuarios: 6,
      propiedades: 128,
      leads: 342,
      almacenamiento: '2.1GB'
    }
  };

  // Planes disponibles
  planesDisponibles = [
    {
      id: 1,
      nombre: 'Básico',
      precio: 8000,
      usuarios: 3,
      propiedades: 100,
      leads: 200,
      almacenamiento: '1GB'
    },
    {
      id: 2,
      nombre: 'Profesional',
      precio: 15000,
      usuarios: 10,
      propiedades: 500,
      leads: 1000,
      almacenamiento: '5GB'
    },
    {
      id: 3,
      nombre: 'Enterprise',
      precio: 25000,
      usuarios: 25,
      propiedades: 'Ilimitadas',
      leads: 'Ilimitados',
      almacenamiento: '20GB'
    }
  ];

  // Facturas
  facturas = [
    {
      id: 1,
      numero: 'FAC-2024-001',
      fecha: '2024-01-15',
      monto: 15000,
      estado: 'pagada',
      concepto: 'Plan Profesional - Enero 2024'
    },
    {
      id: 2,
      numero: 'FAC-2023-012',
      fecha: '2023-12-15',
      monto: 15000,
      estado: 'pagada',
      concepto: 'Plan Profesional - Diciembre 2023'
    }
  ];

  // Métodos de pago
  metodosPago = [
    {
      id: 1,
      tipo: 'tarjeta',
      numero: '**** **** **** 1234',
      vencimiento: '12/25',
      predeterminado: true
    },
    {
      id: 2,
      tipo: 'cuenta',
      numero: 'Cuenta corriente - Banco Nación',
      predeterminado: false
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  cambiarPlan(planId: number): void {
    console.log('Cambiar a plan:', planId);
    // Lógica para cambio de plan
  }

  descargarFactura(facturaId: number): void {
    console.log('Descargar factura:', facturaId);
    // Lógica para descarga
  }

  agregarMetodoPago(): void {
    console.log('Agregar nuevo método de pago');
    // Mostrar modal de nuevo método de pago
  }

  eliminarMetodoPago(metodoId: number): void {
    console.log('Eliminar método de pago:', metodoId);
    // Lógica para eliminar método de pago
  }

  establecerPredeterminado(metodoId: number): void {
    this.metodosPago.forEach(metodo => {
      metodo.predeterminado = metodo.id === metodoId;
    });
  }

  calcularPorcentajeUso(usado: number, limite: number | string): number {
    if (typeof limite === 'string') return 0;
    return Math.round((usado / limite) * 100);
  }

  obtenerColorBarra(porcentaje: number): string {
    if (porcentaje < 60) return '#28a745';
    if (porcentaje < 80) return '#ffc107';
    return '#dc3545';
  }

  diasRestantes(): number {
    const fechaVenc = new Date(this.planActual.fechaVencimiento);
    const hoy = new Date();
    const diff = fechaVenc.getTime() - hoy.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }
}
