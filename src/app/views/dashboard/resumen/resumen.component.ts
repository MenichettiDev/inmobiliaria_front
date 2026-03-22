import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-resumen',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.css'
})
export class ResumenComponent implements OnInit {
  kpis = {
    leadsNuevos: 15,
    leadsActivos: 42,
    propiedadesPublicadas: 128,
    visitasHoy: 8,
    visitasSemana: 35,
    operacionesCerradas: 12
  };

  kpisList: Array<{ icon: string; value: number; label: string; displayValue: number }> = [
    { icon: '👥', value: this.kpis.leadsNuevos, label: 'Leads Nuevos', displayValue: 0 },
    { icon: '🔥', value: this.kpis.leadsActivos, label: 'Leads Activos', displayValue: 0 },
    { icon: '🏠', value: this.kpis.propiedadesPublicadas, label: 'Propiedades', displayValue: 0 },
    { icon: '📅', value: this.kpis.visitasHoy, label: 'Visitas Hoy', displayValue: 0 },
    { icon: '📆', value: this.kpis.visitasSemana, label: 'Esta Semana', displayValue: 0 },
    { icon: '💰', value: this.kpis.operacionesCerradas, label: 'Cerradas', displayValue: 0 }
  ];

  alertas = [
    { tipo: 'warning', mensaje: 'Suscripción vence en 5 días' },
    { tipo: 'info', mensaje: '3 tareas vencidas pendientes' },
    { tipo: 'success', mensaje: 'Meta mensual alcanzada' }
  ];

  actividadReciente = [
    { fecha: '2024-01-15 10:30', descripcion: 'Nuevo lead registrado - Juan Pérez', tipo: 'lead' },
    { fecha: '2024-01-15 09:15', descripcion: 'Propiedad publicada - Casa en Palermo', tipo: 'propiedad' },
    { fecha: '2024-01-15 08:45', descripcion: 'Visita confirmada para hoy 15:00', tipo: 'visita' }
  ];

  filtroFecha = 'hoy';

  constructor() {}

  ngOnInit(): void {
    this.animateCounters();
  }

  /** Animated number ticker — ease-out cubic, staggered by index */
  private animateCounters(): void {
    const duration = 1100;
    this.kpisList.forEach((kpi, idx) => {
      const delay = idx * 90;
      const target = kpi.value;
      kpi.displayValue = 0;
      setTimeout(() => {
        const startTime = Date.now();
        const tick = () => {
          const elapsed = Math.min(Date.now() - startTime, duration);
          const progress = 1 - Math.pow(1 - elapsed / duration, 3); // ease-out cubic
          kpi.displayValue = Math.round(progress * target);
          if (elapsed < duration) setTimeout(tick, 16);
        };
        tick();
      }, delay);
    });
  }

  aplicarFiltro(): void {
    console.log('Aplicando filtro:', this.filtroFecha);
  }
}
