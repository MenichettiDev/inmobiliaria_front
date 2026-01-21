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
  // KPIs data
  kpis = {
    leadsNuevos: 15,
    leadsActivos: 42,
    propiedadesPublicadas: 128,
    visitasHoy: 8,
    visitasSemana: 35,
    operacionesCerradas: 12
  };

  kpisList = [
    { icon: '👥', value: this.kpis.leadsNuevos, label: 'Leads Nuevos' },
    { icon: '🔥', value: this.kpis.leadsActivos, label: 'Leads Activos' },
    { icon: '🏠', value: this.kpis.propiedadesPublicadas, label: 'Propiedades' },
    { icon: '📅', value: this.kpis.visitasHoy, label: 'Visitas Hoy' },
    { icon: '📆', value: this.kpis.visitasSemana, label: 'Esta Semana' },
    { icon: '💰', value: this.kpis.operacionesCerradas, label: 'Cerradas' }
  ];

  // Alertas importantes
  alertas = [
    { tipo: 'warning', mensaje: 'Suscripción vence en 5 días' },
    { tipo: 'info', mensaje: '3 tareas vencidas pendientes' },
    { tipo: 'success', mensaje: 'Meta mensual alcanzada' }
  ];

  // Actividad reciente
  actividadReciente = [
    { fecha: '2024-01-15 10:30', descripcion: 'Nuevo lead registrado - Juan Pérez', tipo: 'lead' },
    { fecha: '2024-01-15 09:15', descripcion: 'Propiedad publicada - Casa en Palermo', tipo: 'propiedad' },
    { fecha: '2024-01-15 08:45', descripcion: 'Visita confirmada para hoy 15:00', tipo: 'visita' }
  ];

  filtroFecha: string = 'hoy';

  constructor() { }

  ngOnInit(): void {
  }

  aplicarFiltro(): void {
    console.log('Aplicando filtro:', this.filtroFecha);
    // Aquí iría la lógica para filtrar datos según el período
  }
}
