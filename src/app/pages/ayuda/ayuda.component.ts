import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ayuda.component.html',
  // styleUrls: ['./ayuda.component.css']
})
export class AyudaComponent implements OnInit {
  // Sección activa
  seccionActiva = 'faq';

  // Búsqueda
  terminoBusqueda = '';

  // FAQs organizadas por categoría
  faqs = [
    {
      categoria: 'Propiedades',
      preguntas: [
        {
          id: 1,
          pregunta: '¿Cómo publico una propiedad?',
          respuesta: 'Ve a la sección Propiedades > Crear/Editar, completa los datos requeridos y haz clic en "Publicar".',
          popular: true
        },
        {
          id: 2,
          pregunta: '¿Puedo editar una propiedad ya publicada?',
          respuesta: 'Sí, ve a Propiedades > Ver Listado, busca la propiedad y haz clic en el ícono de editar.',
          popular: false
        }
      ]
    },
    {
      categoria: 'Leads',
      preguntas: [
        {
          id: 3,
          pregunta: '¿Cómo asigno un lead a un agente?',
          respuesta: 'Desde el listado de leads, selecciona el lead y usa la opción "Asignar agente" en el menú de acciones.',
          popular: true
        },
        {
          id: 4,
          pregunta: '¿Qué significa cada estado del lead?',
          respuesta: 'Nuevo: recién registrado, Contactado: ya se estableció comunicación, Calificado: interés confirmado, etc.',
          popular: false
        }
      ]
    },
    {
      categoria: 'Facturación',
      preguntas: [
        {
          id: 5,
          pregunta: '¿Cómo cambio mi plan?',
          respuesta: 'Ve a Plan & Facturación > Plan Actual y selecciona "Cambiar plan" para ver las opciones disponibles.',
          popular: true
        }
      ]
    }
  ];

  // Artículos del centro de ayuda
  articulos = [
    {
      id: 1,
      titulo: 'Primeros pasos en el sistema',
      descripcion: 'Guía completa para comenzar a usar la plataforma',
      categoria: 'Introducción',
      tiempoLectura: '5 min',
      fechaActualizacion: '2024-01-10'
    },
    {
      id: 2,
      titulo: 'Gestión avanzada de leads',
      descripcion: 'Aprende a maximizar la conversión de tus leads',
      categoria: 'Leads',
      tiempoLectura: '8 min',
      fechaActualizacion: '2024-01-08'
    },
    {
      id: 3,
      titulo: 'Configuración de integraciones',
      descripcion: 'Conecta tu inmobiliaria con portales y herramientas externas',
      categoria: 'Configuración',
      tiempoLectura: '12 min',
      fechaActualizacion: '2024-01-05'
    }
  ];

  // Tickets de soporte
  tickets = [
    {
      id: 1,
      asunto: 'Error al subir imágenes de propiedades',
      estado: 'abierto',
      prioridad: 'media',
      fechaCreacion: '2024-01-15',
      ultimaRespuesta: '2024-01-15 14:30',
      agente: 'Soporte Técnico'
    },
    {
      id: 2,
      asunto: 'Consulta sobre integración con Zonaprop',
      estado: 'resuelto',
      prioridad: 'baja',
      fechaCreacion: '2024-01-12',
      ultimaRespuesta: '2024-01-13 10:15',
      agente: 'María Soporte'
    }
  ];

  // Formulario de nuevo ticket
  nuevoTicket = {
    asunto: '',
    categoria: '',
    prioridad: 'media',
    descripcion: ''
  };

  categoriasTicket = [
    'Problema técnico',
    'Consulta de uso',
    'Integración',
    'Facturación',
    'Solicitud de función',
    'Otro'
  ];

  constructor() { }

  ngOnInit(): void {
  }

  cambiarSeccion(seccion: string): void {
    this.seccionActiva = seccion;
  }

  // FAQs
  get faqsFiltradas() {
    if (!this.terminoBusqueda) return this.faqs;

    return this.faqs.map(categoria => ({
      ...categoria,
      preguntas: categoria.preguntas.filter(p =>
        p.pregunta.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        p.respuesta.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      )
    })).filter(categoria => categoria.preguntas.length > 0);
  }

  get preguntasPopulares() {
    return this.faqs
      .flatMap(categoria => categoria.preguntas)
      .filter(p => p.popular);
  }

  // Artículos
  get articulosFiltrados() {
    if (!this.terminoBusqueda) return this.articulos;

    return this.articulos.filter(a =>
      a.titulo.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
      a.descripcion.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  leerArticulo(id: number): void {
    console.log('Abrir artículo:', id);
    // Navegar al artículo completo
  }

  // Tickets
  crearTicket(): void {
    if (this.nuevoTicket.asunto && this.nuevoTicket.descripcion) {
      const ticket = {
        id: this.tickets.length + 1,
        asunto: this.nuevoTicket.asunto,
        estado: 'abierto',
        prioridad: this.nuevoTicket.prioridad,
        fechaCreacion: new Date().toISOString().split('T')[0],
        ultimaRespuesta: new Date().toISOString(),
        agente: 'En asignación'
      };

      this.tickets.unshift(ticket);

      // Limpiar formulario
      this.nuevoTicket = {
        asunto: '',
        categoria: '',
        prioridad: 'media',
        descripcion: ''
      };

      alert('Ticket creado correctamente. Te contactaremos pronto.');
    }
  }

  verTicket(id: number): void {
    console.log('Ver ticket:', id);
    // Mostrar detalles del ticket
  }

  obtenerColorEstado(estado: string): string {
    const colores = {
      'abierto': '#dc3545',
      'en_proceso': '#ffc107',
      'resuelto': '#28a745',
      'cerrado': '#6c757d'
    };
    return colores[estado as keyof typeof colores] || '#6c757d';
  }

  obtenerColorPrioridad(prioridad: string): string {
    const colores = {
      'alta': '#dc3545',
      'media': '#ffc107',
      'baja': '#28a745'
    };
    return colores[prioridad as keyof typeof colores] || '#6c757d';
  }

  // Contacto directo
  contactarSoporte(): void {
    console.log('Contactar soporte directo');
    // Implementar chat en vivo o formulario de contacto
  }

  programarLlamada(): void {
    console.log('Programar llamada con soporte');
    // Implementar agenda de llamadas
  }
}
