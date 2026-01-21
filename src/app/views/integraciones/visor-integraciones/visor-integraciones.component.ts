import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-visor-integraciones',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './visor-integraciones.component.html',
  styleUrl: './visor-integraciones.component.css'
})
export class VisorIntegracionesComponent implements OnInit {
  // Integraciones disponibles
  integraciones = [
    {
      id: 1,
      nombre: 'Zonaprop',
      categoria: 'portal',
      descripcion: 'Portal líder en propiedades de Argentina',
      conectado: true,
      ultimaSinc: '2024-01-15 12:30',
      propiedadesPublicadas: 45,
      logo: 'assets/images/integraciones/zonaprop.png',
      configuracion: {
        usuario: 'inmobiliaria@email.com',
        autoSync: true,
        sincronizarPrecios: true,
        sincronizarImagenes: true
      }
    },
    {
      id: 2,
      nombre: 'Argenprop',
      categoria: 'portal',
      descripcion: 'Portal inmobiliario de Argentina',
      conectado: false,
      ultimaSinc: null,
      propiedadesPublicadas: 0,
      logo: 'assets/images/integraciones/argenprop.png',
      configuracion: {
        usuario: '',
        autoSync: false,
        sincronizarPrecios: false,
        sincronizarImagenes: false
      }
    },
    {
      id: 3,
      nombre: 'WhatsApp Business',
      categoria: 'comunicacion',
      descripcion: 'Integración con WhatsApp Business API',
      conectado: true,
      ultimaSinc: '2024-01-15 14:15',
      mensajesEnviados: 128,
      logo: 'assets/images/integraciones/whatsapp.png',
      configuracion: {
        numero: '+54 11 4567-8900',
        plantillasActivas: true,
        notificacionesAutomaticas: true
      }
    },
    {
      id: 4,
      nombre: 'Mailchimp',
      categoria: 'marketing',
      descripcion: 'Plataforma de email marketing',
      conectado: false,
      ultimaSinc: null,
      contactosSincronizados: 0,
      logo: 'assets/images/integraciones/mailchimp.png',
      configuracion: {
        apiKey: '',
        listaContactos: '',
        sincronizarLeads: false
      }
    },
    {
      id: 5,
      nombre: 'Firmo',
      categoria: 'documentos',
      descripcion: 'Firma digital de documentos',
      conectado: true,
      ultimaSinc: '2024-01-14 16:00',
      documentosFirmados: 12,
      logo: 'assets/images/integraciones/firmo.png',
      configuracion: {
        certificado: 'certificado.p12',
        autoEnvio: false,
        recordatorios: true
      }
    }
  ];

  // Webhooks
  webhooks = [
    {
      id: 1,
      nombre: 'Lead desde formulario web',
      url: 'https://webhook.site/123456',
      eventos: ['lead.created'],
      activo: true,
      ultimaEjecucion: '2024-01-15 11:20',
      estado: 'success'
    },
    {
      id: 2,
      nombre: 'CRM externo',
      url: 'https://api.crm-externo.com/webhook',
      eventos: ['lead.created', 'lead.updated'],
      activo: false,
      ultimaEjecucion: '2024-01-10 09:15',
      estado: 'error'
    }
  ];

  // Configuración API
  configuracionAPI = {
    apiKey: 'immo_sk_1234567890abcdef',
    rateLimiting: 100,
    ipsPermitidas: ['192.168.1.100', '203.0.113.45'],
    documentacionUrl: 'https://api.inmobiliaria.com/docs'
  };

  constructor() { }

  ngOnInit(): void {
  }

  // Integraciones
  conectarIntegracion(id: number): void {
    const integracion = this.integraciones.find(i => i.id === id);
    if (integracion) {
      console.log('Conectar integración:', integracion.nombre);
      // Mostrar modal de configuración
    }
  }

  desconectarIntegracion(id: number): void {
    const integracion = this.integraciones.find(i => i.id === id);
    if (integracion) {
      integracion.conectado = false;
      integracion.ultimaSinc = null;
      console.log('Desconectada:', integracion.nombre);
    }
  }

  sincronizarIntegracion(id: number): void {
    const integracion = this.integraciones.find(i => i.id === id);
    if (integracion && integracion.conectado) {
      integracion.ultimaSinc = new Date().toISOString().slice(0, 16);
      console.log('Sincronizando:', integracion.nombre);
    }
  }

  configurarIntegracion(id: number): void {
    console.log('Configurar integración:', id);
    // Mostrar modal de configuración
  }

  verEstadisticasIntegracion(id: number): void {
    console.log('Ver estadísticas integración:', id);
  }

  // Webhooks
  agregarWebhook(): void {
    console.log('Agregar nuevo webhook');
  }

  editarWebhook(id: number): void {
    console.log('Editar webhook:', id);
  }

  eliminarWebhook(id: number): void {
    this.webhooks = this.webhooks.filter(w => w.id !== id);
  }

  toggleWebhook(id: number): void {
    const webhook = this.webhooks.find(w => w.id === id);
    if (webhook) {
      webhook.activo = !webhook.activo;
    }
  }

  probarWebhook(id: number): void {
    console.log('Probar webhook:', id);
    // Enviar webhook de prueba
  }

  // API
  regenerarAPIKey(): void {
    if (confirm('¿Estás seguro de regenerar la API Key? Esto invalidará la clave actual.')) {
      this.configuracionAPI.apiKey = 'immo_sk_' + Math.random().toString(36).substring(2, 18);
      console.log('Nueva API Key generada');
    }
  }

  agregarIPPermitida(): void {
    const ip = prompt('Ingresa la IP a permitir:');
    if (ip && ip.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      this.configuracionAPI.ipsPermitidas.push(ip);
    } else {
      alert('IP inválida');
    }
  }

  eliminarIPPermitida(ip: string): void {
    this.configuracionAPI.ipsPermitidas = this.configuracionAPI.ipsPermitidas.filter(i => i !== ip);
  }

  abrirDocumentacion(): void {
    window.open(this.configuracionAPI.documentacionUrl, '_blank');
  }

  get integracionesConectadas(): number {
    return this.integraciones.filter(i => i.conectado).length;
  }

  get webhooksActivos(): number {
    return this.webhooks.filter(w => w.activo).length;
  }

  obtenerIconoCategoria(categoria: string): string {
    const iconos = {
      portal: 'bi bi-globe',
      comunicacion: 'bi bi-chat',
      marketing: 'bi bi-megaphone',
      documentos: 'bi bi-file-earmark-text',
      crm: 'bi bi-person-lines-fill'
    };
    return iconos[categoria as keyof typeof iconos] || 'bi bi-puzzle';
  }

  obtenerColorCategoria(categoria: string): string {
    const colores = {
      portal: '#17a2b8',
      comunicacion: '#28a745',
      marketing: '#ffc107',
      documentos: '#6f42c1',
      crm: '#fd7e14'
    };
    return colores[categoria as keyof typeof colores] || '#6c757d';
  }
}
