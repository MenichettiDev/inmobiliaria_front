import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reportes.component.html',
  // styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  // Filtros de fecha
  filtros = {
    fechaDesde: '2024-01-01',
    fechaHasta: '2024-01-31',
    agente: '',
    tipoReporte: 'general'
  };

  // Tipos de reporte
  tiposReporte = [
    { id: 'general', nombre: 'Reporte General' },
    { id: 'leads', nombre: 'Leads por Agente' },
    { id: 'conversion', nombre: 'Conversión' },
    { id: 'propiedades', nombre: 'Propiedades por Estado' },
    { id: 'comisiones', nombre: 'Comisiones' }
  ];

  // Agentes para filtro
  agentes = [
    { id: 1, nombre: 'Todos los agentes' },
    { id: 2, nombre: 'María González' },
    { id: 3, nombre: 'Carlos López' },
    { id: 4, nombre: 'Ana Rodríguez' }
  ];

  // Datos del reporte general
  reporteGeneral = {
    leadsTotal: 156,
    leadsNuevos: 23,
    conversionPromedio: 12.5,
    propiedadesActivas: 89,
    operacionesCerradas: 8,
    comisionesTotal: 340000
  };

  // Leads por agente
  leadsPorAgente = [
    { agente: 'María González', nuevos: 12, contactados: 8, cerrados: 3, conversion: 25 },
    { agente: 'Carlos López', nuevos: 8, contactados: 6, cerrados: 2, conversion: 25 },
    { agente: 'Ana Rodríguez', nuevos: 3, contactados: 2, cerrados: 1, conversion: 33.3 }
  ];

  // Propiedades por estado
  propiedadesPorEstado = [
    { estado: 'Disponible', cantidad: 67, porcentaje: 75.3 },
    { estado: 'Reservada', cantidad: 15, porcentaje: 16.9 },
    { estado: 'Vendida', cantidad: 7, porcentaje: 7.8 }
  ];

  constructor() { }

  ngOnInit(): void {
    this.generarReporte();
  }

  generarReporte(): void {
    console.log('Generando reporte con filtros:', this.filtros);
    // Lógica para generar reporte según filtros
  }

  exportarExcel(): void {
    console.log('Exportando a Excel');
    // Lógica para exportar a Excel
  }

  exportarCSV(): void {
    console.log('Exportando a CSV');
    // Lógica para exportar a CSV
  }

  exportarPDF(): void {
    console.log('Exportando a PDF');
    // Lógica para exportar a PDF
  }

  limpiarFiltros(): void {
    this.filtros = {
      fechaDesde: '2024-01-01',
      fechaHasta: '2024-01-31',
      agente: '',
      tipoReporte: 'general'
    };
    this.generarReporte();
  }

  obtenerColorConversion(porcentaje: number): string {
    if (porcentaje >= 30) return '#28a745';
    if (porcentaje >= 20) return '#ffc107';
    return '#dc3545';
  }
}
