import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-visor-configuracion',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './visor-configuracion.component.html',
  styleUrl: './visor-configuracion.component.css'
})
export class VisorConfiguracionComponent implements OnInit {
  // Estados del sistema
  estadosPropiedad = [
    { id: 1, nombre: 'Disponible', activo: true, color: '#28a745' },
    { id: 2, nombre: 'Reservada', activo: true, color: '#ffc107' },
    { id: 3, nombre: 'Vendida', activo: true, color: '#dc3545' },
    { id: 4, nombre: 'En mantenimiento', activo: false, color: '#6c757d' }
  ];

  estadosLead = [
    { id: 1, nombre: 'Nuevo', activo: true, color: '#17a2b8' },
    { id: 2, nombre: 'Contactado', activo: true, color: '#ffc107' },
    { id: 3, nombre: 'Calificado', activo: true, color: '#fd7e14' },
    { id: 4, nombre: 'Cerrado', activo: true, color: '#28a745' }
  ];

  // Fuentes de leads
  fuentesLead = [
    { id: 1, nombre: 'Web', activo: true },
    { id: 2, nombre: 'Facebook', activo: true },
    { id: 3, nombre: 'Instagram', activo: true },
    { id: 4, nombre: 'Referidos', activo: true },
    { id: 5, nombre: 'Llamada directa', activo: false }
  ];

  // Etiquetas
  etiquetas = [
    { id: 1, nombre: 'Urgente', color: '#dc3545' },
    { id: 2, nombre: 'VIP', color: '#6f42c1' },
    { id: 3, nombre: 'Primera compra', color: '#17a2b8' },
    { id: 4, nombre: 'Inversor', color: '#28a745' }
  ];

  // Automatizaciones
  automatizaciones = [
    {
      id: 1,
      nombre: 'Asignar agente automáticamente',
      descripcion: 'Asigna leads nuevos al agente con menos carga',
      activa: true,
      tipo: 'lead'
    },
    {
      id: 2,
      nombre: 'Recordatorio de seguimiento',
      descripcion: 'Envía recordatorio después de 3 días sin contacto',
      activa: true,
      tipo: 'tarea'
    },
    {
      id: 3,
      nombre: 'Notificar leads inactivos',
      descripcion: 'Alerta cuando un lead lleva más de 7 días sin actividad',
      activa: false,
      tipo: 'alerta'
    }
  ];

  // Plantillas
  plantillas = [
    {
      id: 1,
      nombre: 'Bienvenida Lead',
      tipo: 'email',
      asunto: 'Gracias por tu consulta',
      contenido: 'Hola {nombre}, gracias por contactarnos...',
      activa: true
    },
    {
      id: 2,
      nombre: 'Confirmación Visita',
      tipo: 'whatsapp',
      contenido: 'Hola {nombre}, confirmamos tu visita para {fecha} a las {hora}.',
      activa: true
    },
    {
      id: 3,
      nombre: 'Seguimiento Post Visita',
      tipo: 'email',
      asunto: '¿Qué te pareció la propiedad?',
      contenido: 'Hola {nombre}, esperamos que hayas disfrutado la visita...',
      activa: false
    }
  ];

  // Nuevos elementos en formularios
  nuevoEstado = { nombre: '', color: '#000000' };
  nuevaFuente = { nombre: '' };
  nuevaEtiqueta = { nombre: '', color: '#000000' };
  nuevaPlantilla = { nombre: '', tipo: 'email', asunto: '', contenido: '' };

  // Sección activa
  seccionActiva = 'estados';

  constructor() { }

  ngOnInit(): void {
  }

  cambiarSeccion(seccion: string): void {
    this.seccionActiva = seccion;
  }

  // Estados
  agregarEstadoPropiedad(): void {
    if (this.nuevoEstado.nombre.trim()) {
      const id = Math.max(...this.estadosPropiedad.map(e => e.id)) + 1;
      this.estadosPropiedad.push({
        id,
        nombre: this.nuevoEstado.nombre,
        activo: true,
        color: this.nuevoEstado.color
      });
      this.nuevoEstado = { nombre: '', color: '#000000' };
    }
  }

  toggleEstadoPropiedad(id: number): void {
    const estado = this.estadosPropiedad.find(e => e.id === id);
    if (estado) {
      estado.activo = !estado.activo;
    }
  }

  eliminarEstadoPropiedad(id: number): void {
    this.estadosPropiedad = this.estadosPropiedad.filter(e => e.id !== id);
  }

  // Fuentes
  agregarFuente(): void {
    if (this.nuevaFuente.nombre.trim()) {
      const id = Math.max(...this.fuentesLead.map(f => f.id)) + 1;
      this.fuentesLead.push({
        id,
        nombre: this.nuevaFuente.nombre,
        activo: true
      });
      this.nuevaFuente = { nombre: '' };
    }
  }

  toggleFuente(id: number): void {
    const fuente = this.fuentesLead.find(f => f.id === id);
    if (fuente) {
      fuente.activo = !fuente.activo;
    }
  }

  eliminarFuente(id: number): void {
    this.fuentesLead = this.fuentesLead.filter(f => f.id !== id);
  }

  // Etiquetas
  agregarEtiqueta(): void {
    if (this.nuevaEtiqueta.nombre.trim()) {
      const id = Math.max(...this.etiquetas.map(e => e.id)) + 1;
      this.etiquetas.push({
        id,
        nombre: this.nuevaEtiqueta.nombre,
        color: this.nuevaEtiqueta.color
      });
      this.nuevaEtiqueta = { nombre: '', color: '#000000' };
    }
  }

  eliminarEtiqueta(id: number): void {
    this.etiquetas = this.etiquetas.filter(e => e.id !== id);
  }

  // Automatizaciones
  toggleAutomatizacion(id: number): void {
    const auto = this.automatizaciones.find(a => a.id === id);
    if (auto) {
      auto.activa = !auto.activa;
    }
  }

  editarAutomatizacion(id: number): void {
    console.log('Editar automatización:', id);
  }

  // Plantillas
  agregarPlantilla(): void {
    if (this.nuevaPlantilla.nombre.trim() && this.nuevaPlantilla.contenido.trim()) {
      const id = Math.max(...this.plantillas.map(p => p.id)) + 1;
      this.plantillas.push({
        id,
        nombre: this.nuevaPlantilla.nombre,
        tipo: this.nuevaPlantilla.tipo,
        asunto: this.nuevaPlantilla.asunto,
        contenido: this.nuevaPlantilla.contenido,
        activa: true
      });
      this.nuevaPlantilla = { nombre: '', tipo: 'email', asunto: '', contenido: '' };
    }
  }

  editarPlantilla(id: number): void {
    console.log('Editar plantilla:', id);
  }

  togglePlantilla(id: number): void {
    const plantilla = this.plantillas.find(p => p.id === id);
    if (plantilla) {
      plantilla.activa = !plantilla.activa;
    }
  }

  previsualizarPlantilla(id: number): void {
    console.log('Previsualizar plantilla:', id);
  }
}
