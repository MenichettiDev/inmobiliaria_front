import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AgendaService } from './agenda.service';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './agenda.component.html',
  // styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  // Vista actual del calendario
  vistaCalendario = 'semana'; // dia, semana, mes

  // Eventos de ejemplo
  eventos = [
    {
      id: 1,
      titulo: 'Visita - Casa Palermo',
      fecha: '2024-01-15',
      hora: '15:00',
      duracion: 60,
      tipo: 'visita',
      cliente: 'Juan Pérez',
      propiedad: 'Casa en Palermo',
      agente: 'María González',
      estado: 'confirmada'
    },
    {
      id: 2,
      titulo: 'Reunión con cliente',
      fecha: '2024-01-15',
      hora: '10:30',
      duracion: 30,
      tipo: 'reunion',
      cliente: 'Ana Rodríguez',
      agente: 'Carlos López',
      estado: 'pendiente'
    }
  ];

  // Recordatorios
  recordatorios = [
    {
      id: 1,
      mensaje: 'Visita en 1 hora - Juan Pérez',
      tiempo: '1 hora',
      tipo: 'visita'
    },
    {
      id: 2,
      mensaje: 'Llamar a cliente mañana',
      tiempo: '1 día',
      tipo: 'tarea'
    }
  ];

  horariosDisponibles = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

  fechaActual = new Date();

  constructor(private agendaService: AgendaService) { }

  ngOnInit(): void {
  }

  cambiarVista(vista: string): void {
    this.vistaCalendario = vista;
  }

  crearEvento(): void {
    console.log('Crear nuevo evento');
  }

  editarEvento(id: number): void {
    console.log('Editar evento:', id);
  }

  marcarAsistencia(id: number): void {
    console.log('Marcar asistencia evento:', id);
  }

  reprogramarEvento(id: number): void {
    console.log('Reprogramar evento:', id);
  }

  fechaAnterior(): void {
    if (this.vistaCalendario === 'dia') {
      this.fechaActual.setDate(this.fechaActual.getDate() - 1);
    } else if (this.vistaCalendario === 'semana') {
      this.fechaActual.setDate(this.fechaActual.getDate() - 7);
    } else if (this.vistaCalendario === 'mes') {
      this.fechaActual.setMonth(this.fechaActual.getMonth() - 1);
    }
  }

  fechaSiguiente(): void {
    if (this.vistaCalendario === 'dia') {
      this.fechaActual.setDate(this.fechaActual.getDate() + 1);
    } else if (this.vistaCalendario === 'semana') {
      this.fechaActual.setDate(this.fechaActual.getDate() + 7);
    } else if (this.vistaCalendario === 'mes') {
      this.fechaActual.setMonth(this.fechaActual.getMonth() + 1);
    }
  }

  irHoy(): void {
    this.fechaActual = new Date();
  }

  obtenerTituloFecha(): string {
    const opciones: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: this.vistaCalendario === 'mes' ? undefined : 'numeric'
    };
    return this.fechaActual.toLocaleDateString('es-ES', opciones);
  }

  obtenerColorTipoEvento(tipo: string): string {
    const colores = {
      'visita': 'primary',
      'reunion': 'success',
      'llamada': 'info',
      'tarea': 'warning'
    };
    return colores[tipo as keyof typeof colores] || 'secondary';
  }

  crearEventoEnCelda(dia: string, hora: string): void {
    console.log('Crear evento en', dia, 'a las', hora);
  }

  obtenerEventosPorDiaHora(dia: string, hora: string) {
    return []; // Implementar lógica
  }

  obtenerSemanasDelMes(): Date[][] {
    // Implementar lógica para generar semanas del mes
    return [];
  }

  esDiaDelMes(fecha: Date): boolean {
    return fecha.getMonth() === this.fechaActual.getMonth();
  }

  esHoy(fecha: Date): boolean {
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
  }

  seleccionarDia(dia: Date): void {
    this.fechaActual = dia;
    this.vistaCalendario = 'dia';
  }
}
