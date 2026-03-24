import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../views/auth/auth.service';

interface MenuItem {
  id: number;
  descripcion: string;
  icono: string;
  link: string;
  roles: number[];
  submenus?: MenuItem[];
  soloLectura?: boolean;
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule, RouterModule, NgbTooltipModule],
})
export class SidebarComponent implements OnInit {
  // Propiedades requeridas por el template
  isLoggedIn = false;
  isSidebarVisible = true;
  isSmallScreen = window.innerWidth < 992;
  userRole: number = 0;

  // Propiedades de usuario requeridas por topbar
  userEmail: string = '';
  displayEmail: string = '';
  userLegajo: string = '';
  displayLegajo: string = '';
  displayRole: string = '';
  displayUserLabel: string = '';
  pageTitle: string = 'Dashboard';

  menuItems: MenuItem[] = [
    // 🏠 Dashboard - Acceso diferenciado por rol
    {
      id: 1,
      descripcion: 'Dashboard',
      icono: 'bi bi-speedometer2',
      link: '/dashboard/',
      roles: [1, 2, 3, 4, 6], // Todos los roles
      submenus: [
        {
          id: 11,
          descripcion: 'KPIs Generales',
          icono: 'bi bi-graph-up',
          link: '/dashboard/resumen',
          roles: [1, 2, 3], // Solo Admin, Programador y Supervisor
        },
      ],
    },

    // 🏘 Propiedades - Permisos según rol
    {
      id: 2,
      descripcion: 'Propiedades',
      icono: 'bi bi-house-door',
      link: '/propiedades',
      roles: [1, 2, 3, 4, 6], // Todos pueden ver (con restricciones)
      submenus: [
        {
          id: 21,
          descripcion: 'Ver Listado',
          icono: 'bi bi-list-ul',
          link: '/propiedades/visor',
          roles: [1, 2, 3, 4, 6], // Todos pueden ver
        },
        {
          id: 22,
          descripcion: 'Crear',
          icono: 'bi bi-plus-circle',
          link: '/propiedades/create',
          roles: [2, 3, 4], // Solo Admin, Supervisor y Agente
        },
      ],
    },

    // 👥 Leads / CRM - Restricciones por rol
    {
      id: 3,
      descripcion: 'Leads / CRM',
      icono: 'bi bi-people',
      link: '/leads',
      roles: [2, 3, 4, 6], // Admin, Supervisor, Agente y Asistente
      submenus: [
        {
          id: 31,
          descripcion: 'Visor Leads',
          icono: 'bi bi-person-plus',
          link: '/leads/visor',
          roles: [2, 3, 4], // Solo Admin, Supervisor y Agente
        },
        {
          id: 36,
          descripcion: 'Mis Leads',
          icono: 'bi bi-person',
          link: '/leads/mis-leads',
          roles: [4], // Solo Agente - ve solo sus leads
        },
        {
          id: 37,
          descripcion: 'Leads Asignados',
          icono: 'bi bi-person-check',
          link: '/leads/asignados',
          roles: [6], // Solo Asistente - ve leads asignados
        },
      ],
    },

    // 📅 Agenda
    {
      id: 4,
      descripcion: 'Agenda',
      icono: 'bi bi-calendar',
      link: '/agenda',
      roles: [2, 3, 4, 6], // Admin, Supervisor, Agente y Asistente
      submenus: [
        {
          id: 41,
          descripcion: 'Ver Agenda',
          icono: 'bi bi-calendar-event',
          link: '/agenda/visor',
          roles: [2, 3, 4, 6], // Todos excepto Programador
        },
        {
          id: 42,
          descripcion: 'Crear Visitas',
          icono: 'bi bi-calendar-plus',
          link: '/agenda/crear-visita',
          roles: [2, 3, 4, 6], // Todos excepto Programador
        },
        {
          id: 43,
          descripcion: 'Recordatorios',
          icono: 'bi bi-bell',
          link: '/agenda/recordatorios',
          roles: [2, 3, 4, 6], // Todos excepto Programador
        },
      ],
    },

    // 👤 Clientes
    {
      id: 5,
      descripcion: 'Clientes',
      icono: 'bi bi-person-badge',
      link: '/clientes',
      roles: [2, 3, 4], // Admin, Supervisor y Agente
      submenus: [
        {
          id: 51,
          descripcion: 'Ver / Crear Clientes',
          icono: 'bi bi-person-plus',
          link: '/clientes/visor',
          roles: [2, 3, 4], // Admin, Supervisor y Agente
        },
        {
          id: 52,
          descripcion: 'Historial',
          icono: 'bi bi-clock-history',
          link: '/clientes/historial',
          roles: [2, 3, 4], // Admin, Supervisor y Agente
        },
      ],
    },

    // 🧾 Operaciones
    {
      id: 6,
      descripcion: 'Operaciones',
      icono: 'bi bi-briefcase',
      link: '/operaciones',
      roles: [2, 3], // Solo Admin y Supervisor
      submenus: [
        {
          id: 61,
          descripcion: 'Crear Operaciones',
          icono: 'bi bi-plus-circle',
          link: '/operaciones/visor',
          roles: [2, 3], // Solo Admin y Supervisor
        },
        {
          id: 62,
          descripcion: 'Cerrar Ventas / Alquileres',
          icono: 'bi bi-check-circle',
          link: '/operaciones/crear',
          roles: [2, 3], // Solo Admin y Supervisor
        },
        {
          id: 63,
          descripcion: 'Ver Comisiones',
          icono: 'bi bi-cash-coin',
          link: '/operaciones/comisiones',
          roles: [2, 3], // Solo Admin y Supervisor
        },
      ],
    },

    // 👥 Equipo - Solo Admin
    {
      id: 7,
      descripcion: 'Usuarios',
      icono: 'bi bi-people-fill',
      link: '/usuarios',
      roles: [2], // Solo Administrador
      submenus: [
        {
          id: 71,
          descripcion: 'Administracion de Usuarios',
          icono: 'bi bi-person-plus',
          link: '/usuarios/visor',
          roles: [2], // Solo Administrador
        },
      ],
    },

    // 🏢 Inmobiliaria - Solo Admin
    {
      id: 8,
      descripcion: 'Inmobiliaria',
      icono: 'bi bi-building',
      link: '/inmobiliaria',
      roles: [1, 2], // Solo Administrador
      submenus: [
        {
          id: 81,
          descripcion: 'Datos Inmobiliarias',
          icono: 'bi bi-info-circle',
          link: '/inmobiliaria/visor',
          roles: [1, 2], // Solo Administrador
        },
      ],
    },

    // 💳 Plan & Facturación - Solo Admin
    {
      id: 9,
      descripcion: 'Plan & Facturación',
      icono: 'bi bi-credit-card',
      link: '/plan-facturacion',
      roles: [2], // Solo Administrador
      submenus: [
        {
          id: 91,
          descripcion: 'Plan Actual',
          icono: 'bi bi-star',
          link: '/plan-facturacion/visor',
          roles: [2], // Solo Administrador
        },
      ],
    },

    // 📊 Reportes - Admin y Supervisor
    {
      id: 10,
      descripcion: 'Reportes',
      icono: 'bi bi-bar-chart',
      link: '/reportes',
      roles: [2, 3], // Admin y Supervisor
      submenus: [
        {
          id: 101,
          descripcion: 'Reportes Generales',
          icono: 'bi bi-graph-up',
          link: '/reportes/visor',
          roles: [2, 3], // Admin y Supervisor
        },
      ],
    },

    // ⚙️ Configuración - Solo Admin
    {
      id: 11,
      descripcion: 'Configuración',
      icono: 'bi bi-gear',
      link: '/configuracion',
      roles: [2], // Solo Administrador
      submenus: [
        {
          id: 111,
          descripcion: 'Estados',
          icono: 'bi bi-tags',
          link: '/configuracion/visor',
          roles: [2], // Solo Administrador
        },
      ],
    },

    // 🔔 Notificaciones - Todos los roles
    {
      id: 12,
      descripcion: 'Notificaciones',
      icono: 'bi bi-bell',
      link: '/notificaciones',
      roles: [1, 2, 3, 4, 6], // Todos los roles
    },

    // 🧩 Integraciones - Solo Admin
    {
      id: 13,
      descripcion: 'Integraciones',
      icono: 'bi bi-plug',
      link: '/integraciones',
      roles: [2], // Solo Administrador
    },

    // 🆘 Ayuda & Soporte - Todos los roles
    {
      id: 14,
      descripcion: 'Ayuda & Soporte',
      icono: 'bi bi-question-circle',
      link: '/ayuda',
      roles: [1, 2, 3, 4, 6], // Todos los roles
    },

    // 🔐 Gestión SaaS - Solo Programador (Super Admin)
    {
      id: 15,
      descripcion: 'Gestión SaaS',
      icono: 'bi bi-cloud',
      link: '/gestion-saas',
      roles: [1], // Solo Programador
      submenus: [
        {
          id: 151,
          descripcion: 'Inmobiliarias',
          icono: 'bi bi-building',
          link: '/gestion-saas/inmobiliarias',
          roles: [1], // Solo Programador
        },
        {
          id: 152,
          descripcion: 'Planes',
          icono: 'bi bi-star',
          link: '/gestion-saas/planes',
          roles: [1], // Solo Programador
        },
        {
          id: 153,
          descripcion: 'Suscripciones',
          icono: 'bi bi-calendar-check',
          link: '/gestion-saas/suscripciones',
          roles: [1], // Solo Programador
        },
        {
          id: 154,
          descripcion: 'Métricas Globales',
          icono: 'bi bi-graph-up-arrow',
          link: '/gestion-saas/metricas',
          roles: [1], // Solo Programador
        },
        {
          id: 155,
          descripcion: 'Feature Flags',
          icono: 'bi bi-flag',
          link: '/gestion-saas/features',
          roles: [1], // Solo Programador
        },
        {
          id: 156,
          descripcion: 'Estados Maestros',
          icono: 'bi bi-gear-wide-connected',
          link: '/gestion-saas/estados-maestros',
          roles: [1], // Solo Programador
        },
        {
          id: 157,
          descripcion: 'Logs',
          icono: 'bi bi-journal-code',
          link: '/gestion-saas/logs',
          roles: [1], // Solo Programador
        },
      ],
    },
  ];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadUserData();
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.loggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.loadUserData();
      }
    });
  }

  private loadUserData(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userRole = user.id_acceso || 0;
      this.userEmail = user.email || '';
      this.displayEmail = this.userEmail.length > 22 ? this.userEmail.slice(0, 19) + '...' : this.userEmail;
      this.userLegajo = ''; // No hay legajo en la nueva estructura
      this.displayLegajo = '';
      this.displayRole = user.rolNombre || '';
      this.displayUserLabel = user.nombre || 'Usuario';
    }
  }

  get visibleMenuItems(): MenuItem[] {
    return this.menuItems.filter((item) => item.roles.includes(this.userRole));
  }

  getSubMenus(menu: MenuItem): MenuItem[] {
    return menu.submenus?.filter((submenu) =>
      submenu.roles.includes(this.userRole)
    ) || [];
  }

  isMenuExpanded(menu: MenuItem): boolean {
    return !!menu.expanded;
  }

  toggleSubMenu(menu: MenuItem): void {
    if (!menu.submenus || menu.submenus.length === 0) {
      this.navigateTo(menu.link);
    } else {
      // Cerrar otros menús
      this.menuItems.forEach(item => {
        if (item !== menu) item.expanded = false;
      });
      menu.expanded = !menu.expanded;
    }
  }

  navigateToSubMenu(subMenu: MenuItem): void {
    this.navigateTo(subMenu.link);
  }

  navigateTo(link: string): void {
    this.router.navigate([link]);
  }

  navigateToHome(): void {
    this.router.navigate(['/dashboard/resumen']);
  }

  // Métodos requeridos por topbar
  onPerfilModalToggled(isVisible: boolean): void {
    // Implementar según necesidad
  }

  confirmLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  isRole(roleName: string): boolean {
    return this.displayRole?.toLowerCase() === roleName.toLowerCase();
  }
}
