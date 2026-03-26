import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
          <nav>
            <a routerLink="/portal" routerLinkActive="active">Inicio</a>
            <a routerLink="/portal/propiedades" routerLinkActive="active">Propiedades</a>
            <a routerLink="/login">Ingresar</a>
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
  `]
})
export class PublicLayoutComponent { }
