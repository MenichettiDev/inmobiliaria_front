import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visor-equipo',
  imports: [CommonModule, FormsModule],
  templateUrl: './visor-equipo.component.html',
  styleUrl: './visor-equipo.component.css'
})
export class VisorEquipoComponent implements OnInit {
  // Roles disponibles
  rolesDisponibles = [
    { id: 2, nombre: 'Administrador', descripcion: 'Acceso completo a la inmobiliaria' },
    { id: 3, nombre: 'Supervisor', descripcion: 'Supervisión comercial sin administración' },
    { id: 4, nombre: 'Agente', descripcion: 'Gestión de leads y propiedades propias' },
    { id: 6, nombre: 'Asistente', descripcion: 'Apoyo operativo limitado' }
  ];

  // Estados de usuario
  estadosUsuario = [
    { id: 1, nombre: 'Activo', color: '#28a745' },
    { id: 2, nombre: 'Inactivo', color: '#6c757d' },
    { id: 3, nombre: 'Bloqueado', color: '#dc3545' },
    { id: 4, nombre: 'Pendiente', color: '#ffc107' }
  ];

  // Usuarios del equipo
  usuarios = [
    {
      id: 1,
      nombre: 'María González',
      email: 'maria.gonzalez@inmobiliaria.com',
      rol: 3,
      estado: 1,
      fechaIngreso: '2024-01-01',
      ultimaActividad: '2024-01-15 14:30',
      leadsAsignados: 25,
      propiedadesAsignadas: 12
    },
    {
      id: 2,
      nombre: 'Carlos López',
      email: 'carlos.lopez@inmobiliaria.com',
      rol: 4,
      estado: 1,
      fechaIngreso: '2024-01-10',
      ultimaActividad: '2024-01-15 16:45',
      leadsAsignados: 18,
      propiedadesAsignadas: 8
    },
    {
      id: 3,
      nombre: 'Ana Rodríguez',
      email: 'ana.rodriguez@inmobiliaria.com',
      rol: 6,
      estado: 4,
      fechaIngreso: '2024-01-14',
      ultimaActividad: null,
      leadsAsignados: 0,
      propiedadesAsignadas: 0
    }
  ];

  // Invitaciones pendientes
  invitacionesPendientes = [
    {
      id: 1,
      email: 'nuevo.agente@email.com',
      rol: 4,
      fechaInvitacion: '2024-01-12',
      estado: 'pendiente'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  invitarUsuario(): void {
    console.log('Mostrar modal para invitar usuario');
  }

  editarUsuario(id: number): void {
    console.log('Editar usuario:', id);
  }

  cambiarRol(userId: number, nuevoRol: number): void {
    const usuario = this.usuarios.find(u => u.id === userId);
    if (usuario) {
      usuario.rol = nuevoRol;
      console.log('Rol cambiado para usuario:', userId, 'Nuevo rol:', nuevoRol);
    }
  }

  cambiarEstado(userId: number, nuevoEstado: number): void {
    const usuario = this.usuarios.find(u => u.id === userId);
    if (usuario) {
      usuario.estado = nuevoEstado;
      console.log('Estado cambiado para usuario:', userId, 'Nuevo estado:', nuevoEstado);
    }
  }

  reasignarLeads(id: number): void {
    console.log('Reasignar leads del usuario:', id);
  }

  reenviarInvitacion(invitacionId: number): void {
    console.log('Reenviar invitación:', invitacionId);
  }

  cancelarInvitacion(invitacionId: number): void {
    console.log('Cancelar invitación:', invitacionId);
  }

  obtenerRolNombre(rolId: number): string {
    const rol = this.rolesDisponibles.find(r => r.id === rolId);
    return rol ? rol.nombre : 'Sin rol';
  }

  obtenerEstadoNombre(estadoId: number): string {
    const estado = this.estadosUsuario.find(e => e.id === estadoId);
    return estado ? estado.nombre : 'Sin estado';
  }

  obtenerEstadoColor(estadoId: number): string {
    const estado = this.estadosUsuario.find(e => e.id === estadoId);
    return estado ? estado.color : '#6c757d';
  }
}
