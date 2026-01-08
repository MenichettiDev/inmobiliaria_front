import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
import { Subscription } from 'rxjs';
import {
  PageTitleService,
  PageMetadata,
} from '../../../services/page-title.service';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
  standalone: true,
  imports: [CommonModule, NgIf, NgbTooltipModule, RouterModule],
  animations: [
    trigger('titleChange', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('breadcrumbSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate(
          '200ms 100ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
  ],
})
export class TopbarComponent implements OnInit, OnDestroy {
  @Input() isLoggedIn: boolean = false;
  @Input() isSmallScreen: boolean = false;
  @Input() userEmail: string | null = null;
  @Input() displayEmail: string | null = null;
  @Input() userLegajo: string | null = null;
  @Input() displayLegajo: string | null = null;
  @Input() userRole: string | null = null;
  @Input() displayRole: string | null = null;
  @Input() userLabel: string | null = null;
  @Input() pageTitle: string = 'Sistema de Gestión'; // Asegurarse de que este Input exista

  @Output() perfilModalToggled = new EventEmitter<boolean>();
  @Output() homeNavigation = new EventEmitter<void>();
  @Output() logoutRequested = new EventEmitter<void>();
  @Output() sidebarToggled = new EventEmitter<void>();

  isPerfilModalVisible: boolean = false;
  // Estado del sidebar (visible = desplegado)
  isSidebarVisible: boolean = true;

  // Metadata de la página actual
  pageMetadata: PageMetadata = {
    title: 'Sistema de Gestión',
    icon: 'bi-house-door',
    color: 'primary',
  };

  private sidebarSubscription?: Subscription;

  private el = inject(ElementRef);

  constructor(
    private pageTitleService: PageTitleService,
    private router: Router,
    private sidebarService: SidebarService
  ) { }

  ngOnInit() {
    // Suscribirse a cambios en la metadata
    this.pageTitleService.metadata$.subscribe((metadata) => {
      this.pageMetadata = metadata;
    });

    // Leer el estado actual de forma síncrona para evitar races donde el sidebar
    // ya fue colapsado antes de que este componente se haya inicializado.
    try {
      this.isSidebarVisible = this.sidebarService.isVisible;
    } catch (e) {
      // si por alguna razón no está disponible, dejamos el valor por defecto
    }

    this.sidebarSubscription = this.sidebarService.visible$.subscribe(
      (visible) => {
        this.isSidebarVisible = visible;
      }
    );
  }

  ngOnDestroy() {
    this.sidebarSubscription?.unsubscribe();
  }

  // Getters para acceso fácil en la plantilla
  get pageIcon(): string | undefined {
    return this.pageMetadata.icon;
  }

  get pageSubtitle(): string | undefined {
    return this.pageMetadata.subtitle;
  }

  get breadcrumbs() {
    return this.pageMetadata.breadcrumbs || [];
  }

  get hasBreadcrumbs(): boolean {
    return this.breadcrumbs.length > 0;
  }

  get pageBadge() {
    return this.pageMetadata.badge;
  }

  get pageColor(): string {
    return this.pageMetadata.color || 'primary';
  }

  // Tooltip dinámico para el pill (legajo + rol)
  get pillTooltip(): string {
    const leg = this.userLegajo || this.displayLegajo || '';
    const role = this.displayRole || this.userRole || '';
    return role ? `${leg} — ${role}` : leg;
  }

  togglePerfilModal(): void {
    this.isPerfilModalVisible = !this.isPerfilModalVisible;
    this.perfilModalToggled.emit(this.isPerfilModalVisible);
  }

  navigateToHome(): void {
    this.isPerfilModalVisible = false;
    this.homeNavigation.emit();
  }

  confirmLogout(): void {
    this.isPerfilModalVisible = false;
    this.logoutRequested.emit();
  }

  toggleSidebar(): void {
    this.sidebarToggled.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.isPerfilModalVisible) return;

    this.isPerfilModalVisible = false;
    this.perfilModalToggled.emit(false);
  }

  // Nombre interno por defecto para mostrar si no se pasa pageTitle desde Sidebar
  defaultPageTitle = 'Sistema de Gestión';

  // Getter simplificado que solo devuelve el título dinámico
  get displayTitle(): string {
    return this.pageTitle && this.pageTitle.trim().length > 0
      ? this.pageTitle
      : 'Inicio';
  }
}
