import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
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

  fechaActual = new Date();

  constructor() { }

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

  obtenerEventosDelDia(fecha: string) {
    return this.eventos.filter(evento => evento.fecha === fecha);
  }
}
