import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "./shared/components/sidebar/sidebar.component";
import { Subscription } from 'rxjs';
import { AuthService } from './../app/views/auth/auth.service';
import { SidebarService } from './services/sidebar.service';
import { ContextService } from './services/context.service';

import { TopbarComponent } from './shared/components/topbar/topbar.component';
import { PageTitleService } from './services/page-title.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'pyre';

  selectedObjetivo: string = '';
  currentRoute: string = '';
  selectedFecha: string = '';
  selectedEstado: string = '';

  isLoggedIn: boolean = false; // Variable que guardará el estado de login
  isSidebarVisible: boolean = true; // Controla si el sidebar está visible (desde SidebarService)
  private loggedInSubscription!: Subscription;
  private sidebarSubscription!: Subscription;

  // Propiedades para el Topbar
  userEmail: string = '';
  displayEmail: string = '';
  userLegajo: string = '';
  displayLegajo: string = '';
  displayRole: string = '';
  displayUserLabel: string = '';
  pageTitle: string = 'Inmobiliaria SaaS';

  // Getter dinámico para isPublicMode (se recalcula cada vez que se accede)
  get isPublicMode(): boolean {
    return this.contextService.isPublic();
  }

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private sidebarService: SidebarService,
    private pageTitleService: PageTitleService,
    private contextService: ContextService
  ) {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.loadUserData();
    }
  }

  ngOnInit(): void {
    // Nos suscribimos al observable del servicio de autenticación para obtener el estado de login
    this.loggedInSubscription = this.authService.loggedIn$.subscribe(
      (loggedInStatus) => {
        this.isLoggedIn = loggedInStatus;
        if (loggedInStatus) {
          document.body.classList.add('bg-blanch');
          this.loadUserData();
        } else {
          document.body.classList.remove('bg-blanch');
        }
      }
    );

    // Suscribirse al estado del sidebar
    this.sidebarSubscription = this.sidebarService.visible$.subscribe(v => {
      this.isSidebarVisible = v;
    });

    // Suscribirse al título de la página
    this.pageTitleService.metadata$.subscribe(m => {
      this.pageTitle = m.title;
    });
  }

  ngOnDestroy(): void {
    if (this.loggedInSubscription) {
      this.loggedInSubscription.unsubscribe();
    }
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }

  private loadUserData(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userEmail = user.email || '';
      this.displayEmail = this.userEmail.length > 22 ? this.userEmail.slice(0, 19) + '...' : this.userEmail;
      this.userLegajo = ''; // No hay legajo en la nueva estructura
      this.displayLegajo = '';
      this.displayRole = user.rolNombre || '';
      this.displayUserLabel = user.nombre || 'Usuario';
    }
  }

  // Métodos para el Topbar
  onPerfilModalToggled(isVisible: boolean): void {
    // Implementar si es necesario
  }

  navigateToHome(): void {
    this.router.navigate(['/dashboard/resumen']);
  }

  confirmLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }
}
