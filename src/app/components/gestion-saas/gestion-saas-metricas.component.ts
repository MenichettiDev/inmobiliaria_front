import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-saas-metricas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-saas-metricas.component.html',
  styleUrls: ['./gestion-saas-metricas.component.css']
})
export class GestionSaasMetricasComponent implements OnInit {
  // Período seleccionado
  periodoSeleccionado = 'mes'; // dia, semana, mes, trimestre, año

  // Métricas principales (KPIs)
  kpis = {
    mrr: 1080000, // Monthly Recurring Revenue
    arr: 12960000, // Annual Recurring Revenue
    churnRate: 5.2, // Tasa de cancelación mensual
    ltv: 185000, // Lifetime Value promedio
    cac: 25000, // Customer Acquisition Cost
    inmobiliariasActivas: 85,
    usuariosTotal: 450,
    propiedadesTotal: 15800,
    leadsTotal: 28900
  };

  // Crecimiento mensual
  crecimiento = {
    mrr: 12.5,
    inmobiliarias: 8.3,
    usuarios: 15.2,
    propiedades: 18.7,
    leads: 22.1
  };

  // Datos para gráficos (últimos 12 meses)
  datosGraficos = {
    meses: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    mrr: [850000, 875000, 920000, 950000, 975000, 1000000, 1025000, 1040000, 1055000, 1065000, 1075000, 1080000],
    inmobiliarias: [65, 67, 70, 72, 74, 76, 78, 80, 82, 83, 84, 85],
    churn: [6.8, 6.2, 5.9, 5.7, 5.5, 5.3, 5.1, 4.9, 5.2, 5.0, 5.1, 5.2]
  };

  // Distribución por planes
  distribucionPlanes = [
    { plan: 'Básico', cantidad: 45, porcentaje: 52.9, ingresos: 360000 },
    { plan: 'Profesional', cantidad: 28, porcentaje: 32.9, ingresos: 420000 },
    { plan: 'Enterprise', cantidad: 12, porcentaje: 14.1, ingresos: 300000 }
  ];

  // Top inmobiliarias por actividad
  topInmobiliarias = [
    { nombre: 'Elite Propiedades', usuarios: 15, propiedades: 450, leads: 890, plan: 'Enterprise' },
    { nombre: 'Inmobiliaria Premium', usuarios: 12, propiedades: 380, leads: 720, plan: 'Profesional' },
    { nombre: 'PropiedadesTotales', usuarios: 10, propiedades: 320, leads: 650, plan: 'Profesional' },
    { nombre: 'Casa & Hogar', usuarios: 8, propiedades: 280, leads: 540, plan: 'Básico' },
    { nombre: 'Inmobiliaria Central', usuarios: 6, propiedades: 220, leads: 420, plan: 'Básico' }
  ];

  // Métricas de soporte
  metricasSoporte = {
    ticketsAbiertos: 23,
    ticketsResueltos: 156,
    tiempoRespuestaPromedio: '2.4 horas',
    satisfaccionCliente: 4.7
  };

  // Filtros para personalizar vista
  filtros = {
    fechaDesde: '2024-01-01',
    fechaHasta: '2024-01-31',
    plan: '',
    region: ''
  };

  constructor() { }

  ngOnInit(): void {
  }

  cambiarPeriodo(periodo: string): void {
    this.periodoSeleccionado = periodo;
    this.actualizarDatos();
  }

  actualizarDatos(): void {
    console.log('Actualizando datos para período:', this.periodoSeleccionado);
    // Aquí se implementaría la lógica para cargar datos según el período
  }

  exportarReporte(): void {
    console.log('Exportando reporte de métricas');
    // Implementar exportación a Excel/PDF
  }

  calcularTendencia(valorActual: number, valorAnterior: number): string {
    const cambio = ((valorActual - valorAnterior) / valorAnterior) * 100;
    return cambio >= 0 ? 'up' : 'down';
  }

  obtenerColorTendencia(crecimiento: number): string {
    return crecimiento >= 0 ? '#28a745' : '#dc3545';
  }

  calcularHealthScore(): number {
    // Algoritmo simple para calcular "salud" del SaaS
    const factores = {
      mrr: this.crecimiento.mrr > 10 ? 25 : (this.crecimiento.mrr > 5 ? 15 : 5),
      churn: this.kpis.churnRate < 5 ? 25 : (this.kpis.churnRate < 10 ? 15 : 5),
      usuarios: this.crecimiento.usuarios > 10 ? 25 : (this.crecimiento.usuarios > 5 ? 15 : 5),
      soporte: this.metricasSoporte.satisfaccionCliente > 4.5 ? 25 : (this.metricasSoporte.satisfaccionCliente > 4 ? 15 : 5)
    };
    
    return factores.mrr + factores.churn + factores.usuarios + factores.soporte;
  }

  obtenerColorHealthScore(score: number): string {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  }

  verDetallesInmobiliaria(nombre: string): void {
    console.log('Ver detalles de:', nombre);
  }

  actualizarFiltros(): void {
    console.log('Aplicando filtros:', this.filtros);
    // Implementar filtrado de datos
  }

  limpiarFiltros(): void {
    this.filtros = {
      fechaDesde: '2024-01-01',
      fechaHasta: '2024-01-31',
      plan: '',
      region: ''
    };
    this.actualizarFiltros();
  }
}
