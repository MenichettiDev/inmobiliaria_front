import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-saas-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: '',
  // styleUrls: ['./gestion-saas-logs.component.css']
})
export class GestionSaasLogsComponent implements OnInit {
  // Filtros de logs
  filtros = {
    nivel: '', // debug, info, warning, error, critical
    modulo: '', // auth, api, payment, integration, system
    usuario: '',
    inmobiliaria: '',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: ''
  };

  // Niveles de log
  nivelesLog = [
    { id: 'debug', nombre: 'Debug', color: '#6c757d', icon: 'bi bi-bug' },
    { id: 'info', nombre: 'Info', color: '#17a2b8', icon: 'bi bi-info-circle' },
    { id: 'warning', nombre: 'Warning', color: '#ffc107', icon: 'bi bi-exclamation-triangle' },
    { id: 'error', nombre: 'Error', color: '#dc3545', icon: 'bi bi-x-circle' },
    { id: 'critical', nombre: 'Critical', color: '#721c24', icon: 'bi bi-exclamation-octagon' }
  ];

  // Módulos del sistema
  modulos = [
    'auth', 'api', 'payment', 'integration', 'system', 'database', 'email', 'backup'
  ];

  // Logs del sistema
  logs = [
    {
      id: 1,
      timestamp: '2024-01-15 14:32:15',
      nivel: 'error',
      modulo: 'payment',
      inmobiliaria: 'Elite Propiedades',
      usuario: 'admin@elitepropiedades.com',
      mensaje: 'Error al procesar pago de suscripción - Tarjeta rechazada',
      detalles: {
        error_code: 'CARD_DECLINED',
        amount: 15000,
        payment_method: '**** 1234',
        request_id: 'req_abc123'
      },
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 Chrome/120.0'
    },
    {
      id: 2,
      timestamp: '2024-01-15 14:25:43',
      nivel: 'info',
      modulo: 'auth',
      inmobiliaria: 'Inmobiliaria Premium',
      usuario: 'maria@premium.com.ar',
      mensaje: 'Inicio de sesión exitoso',
      detalles: {
        session_id: 'sess_xyz789',
        login_method: 'email'
      },
      ip: '203.0.113.45',
      userAgent: 'Mozilla/5.0 Safari/605.1'
    },
    {
      id: 3,
      timestamp: '2024-01-15 14:20:12',
      nivel: 'warning',
      modulo: 'api',
      inmobiliaria: 'Casa & Hogar',
      usuario: 'system',
      mensaje: 'Límite de API requests alcanzado',
      detalles: {
        limit: 1000,
        current: 1000,
        endpoint: '/api/properties',
        reset_time: '2024-01-15 15:00:00'
      },
      ip: '198.51.100.25',
      userAgent: 'API Client v1.2'
    },
    {
      id: 4,
      timestamp: '2024-01-15 14:15:08',
      nivel: 'critical',
      modulo: 'system',
      inmobiliaria: null,
      usuario: 'system',
      mensaje: 'Falla en servicio de base de datos',
      detalles: {
        service: 'postgresql',
        error: 'Connection timeout',
        affected_tenants: ['elite', 'premium', 'casayhogar'],
        duration: '2.5 minutes'
      },
      ip: '10.0.0.1',
      userAgent: 'System Monitor'
    },
    {
      id: 5,
      timestamp: '2024-01-15 14:10:33',
      nivel: 'info',
      modulo: 'integration',
      inmobiliaria: 'Elite Propiedades',
      usuario: 'carlos@elitepropiedades.com',
      mensaje: 'Sincronización exitosa con Zonaprop',
      detalles: {
        properties_synced: 45,
        duration: '12 seconds',
        status: 'success'
      },
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 Chrome/120.0'
    }
  ];

  // Paginación
  paginaActual = 1;
  elementosPorPagina = 25;

  // Estadísticas de logs
  estadisticas = {
    total: 0,
    errores: 0,
    warnings: 0,
    ultimaHora: 0
  };

  constructor() { }

  ngOnInit(): void {
    this.calcularEstadisticas();
  }

  get logsFiltrados() {
    let filtrados = [...this.logs];

    if (this.filtros.nivel) {
      filtrados = filtrados.filter(log => log.nivel === this.filtros.nivel);
    }

    if (this.filtros.modulo) {
      filtrados = filtrados.filter(log => log.modulo === this.filtros.modulo);
    }

    if (this.filtros.inmobiliaria) {
      filtrados = filtrados.filter(log =>
        log.inmobiliaria && log.inmobiliaria.toLowerCase().includes(this.filtros.inmobiliaria.toLowerCase())
      );
    }

    if (this.filtros.usuario) {
      filtrados = filtrados.filter(log =>
        log.usuario && log.usuario.toLowerCase().includes(this.filtros.usuario.toLowerCase())
      );
    }

    if (this.filtros.busqueda) {
      const termino = this.filtros.busqueda.toLowerCase();
      filtrados = filtrados.filter(log =>
        log.mensaje.toLowerCase().includes(termino) ||
        JSON.stringify(log.detalles).toLowerCase().includes(termino)
      );
    }

    return filtrados;
  }

  calcularEstadisticas(): void {
    const ahora = new Date();
    const unaHoraAtras = new Date(ahora.getTime() - (60 * 60 * 1000));

    this.estadisticas = {
      total: this.logs.length,
      errores: this.logs.filter(log => log.nivel === 'error' || log.nivel === 'critical').length,
      warnings: this.logs.filter(log => log.nivel === 'warning').length,
      ultimaHora: this.logs.filter(log => new Date(log.timestamp) > unaHoraAtras).length
    };
  }

  obtenerConfiguracionNivel(nivel: string) {
    return this.nivelesLog.find(n => n.id === nivel) || this.nivelesLog[0];
  }

  verDetalles(id: number): void {
    const log = this.logs.find(l => l.id === id);
    if (log) {
      console.log('Detalles del log:', log);
      // Mostrar modal con detalles completos
    }
  }

  exportarLogs(): void {
    console.log('Exportando logs filtrados');
    // Implementar exportación
  }

  limpiarFiltros(): void {
    this.filtros = {
      nivel: '',
      modulo: '',
      usuario: '',
      inmobiliaria: '',
      fechaDesde: '',
      fechaHasta: '',
      busqueda: ''
    };
  }

  refrescarLogs(): void {
    console.log('Refrescando logs...');
    // Implementar recarga automática
  }

  configurarAlertas(): void {
    console.log('Configurar alertas de logs');
    // Mostrar modal de configuración de alertas
  }

  formatearFecha(timestamp: string): string {
    const fecha = new Date(timestamp);
    return fecha.toLocaleString('es-AR');
  }

  obtenerTiempoRelativo(timestamp: string): string {
    const ahora = new Date();
    const fecha = new Date(timestamp);
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins} min`;
    } else if (diffMins < 1440) {
      const diffHoras = Math.floor(diffMins / 60);
      return `${diffHoras}h`;
    } else {
      const diffDias = Math.floor(diffMins / 1440);
      return `${diffDias}d`;
    }
  }

  // Paginación
  get logsPaginados() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    return this.logsFiltrados.slice(inicio, inicio + this.elementosPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.logsFiltrados.length / this.elementosPorPagina);
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }
}
