import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UsuarioWebAuthService, UsuarioWeb } from '../../../services/usuario-web-auth.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  template: `
    <div class="public-layout">
      <!-- Header simplificado -->
      <header class="public-header">
        <div class="container">
          <h1>Centro Inmo</h1>
          <nav class="nav-menu">
            <a routerLink="/portal" routerLinkActive="active">Inicio</a>
            <a routerLink="/portal/propiedades" routerLinkActive="active">Propiedades</a>

            <!-- Si está logueado: mostrar perfil + dropdown -->
            <div *ngIf="usuarioWeb$ | async as usuario" class="user-menu">
              <span class="usuario-nombre">{{ usuario?.nombre }}</span>
              <div class="dropdown">
                <a routerLink="/portal/favoritos">Mis Favoritos</a>
                <a routerLink="/portal/consultas">Mis Consultas</a>
                <button (click)="onLogout()" class="btn-logout">Cerrar Sesión</button>
              </div>
            </div>

            <!-- Si no está logueado: botones Ingresar -->
            <div *ngIf="!(usuarioWeb$ | async)" class="auth-buttons">
              <a routerLink="/login" class="btn-login">Ingresar</a>
            </div>
          </nav>
        </div>
      </header>

      <!-- Contenido -->
      <main class="public-main">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="public-footer">
        <div class="container">
          <p>&copy; 2026 ProPiedadesAr. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .public-layout {
      display: flex;
      flex-direction: column;
      min-height: 100%;
      background-color: #f5f5f5;
    }

    .public-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .public-header .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .public-header h1 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: bold;
    }

    .public-header nav {
      display: flex;
      gap: 2rem;
    }

    .public-header nav a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background 0.3s;
    }

    .public-header nav a:hover,
    .public-header nav a.active {
      background: rgba(255,255,255,0.2);
    }

    .public-main {
      flex: 1;
      padding: 2rem 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .public-footer {
      background: #333;
      color: white;
      padding: 2rem 0;
      text-align: center;
      margin-top: auto;
    }

    .public-footer p {
      margin: 0;
    }

    .nav-menu {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .user-menu {
      position: relative;
    }

    .usuario-nombre {
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background 0.3s;
    }

    .usuario-nombre:hover {
      background: rgba(255,255,255,0.1);
    }

    .dropdown {
      display: none;
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      color: #333;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      min-width: 200px;
      z-index: 1000;
    }

    .user-menu:hover .dropdown {
      display: block;
    }

    .dropdown a,
    .dropdown button {
      display: block;
      width: 100%;
      padding: 0.75rem 1rem;
      text-align: left;
      color: #333;
      text-decoration: none;
      border: none;
      background: none;
      cursor: pointer;
      transition: background 0.2s;
    }

    .dropdown a:hover,
    .dropdown button:hover {
      background: #f5f5f5;
    }

    .btn-logout {
      color: #dc3545;
      font-weight: 500;
    }

    .auth-buttons {
      display: flex;
      gap: 1rem;
    }

    .btn-login,
    .btn-register {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      text-decoration: none;
      transition: all 0.3s;
      font-weight: 500;
    }

    .btn-login {
      color: white;
      border: 1px solid white;
    }

    .btn-login:hover {
      background: white;
      color: #667eea;
    }

    .btn-register {
      background: white;
      color: #667eea;
    }

    .btn-register:hover {
      transform: scale(1.05);
    }
  `]
})
export class PublicLayoutComponent implements OnInit {
  usuarioWeb$: Observable<UsuarioWeb | null>;

  constructor(
    private authService: UsuarioWebAuthService,
    private router: Router
  ) {
    this.usuarioWeb$ = this.authService.getLoggedInUser();
  }

  ngOnInit(): void { }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/portal']);
  }
}
