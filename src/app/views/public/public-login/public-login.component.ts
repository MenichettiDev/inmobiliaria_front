import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioWebAuthService } from '../../../services/usuario-web-auth.service';
import { environment } from '../../../environments/environment';

declare var google: any;

@Component({
  selector: 'app-public-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h1>Ingresar</h1>
        <p class="subtitle">Accede a tu cuenta para ver tus favoritos y consultas</p>

        <!-- Error Alert -->
        <div *ngIf="error" class="alert alert-danger">
          <i class="fas fa-exclamation-circle me-2"></i>
          {{ error }}
        </div>

        <!-- Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              class="form-control"
              formControlName="email"
              placeholder="tu@email.com"
              [disabled]="loading"
            />
            <div class="invalid-feedback" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              Email inválido
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              type="password"
              id="password"
              class="form-control"
              formControlName="password"
              placeholder="Tu contraseña"
              [disabled]="loading"
            />
            <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              La contraseña es requerida
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100" [disabled]="loading || !loginForm.valid">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="divider">o</div>

        <!-- Google Button -->
        <div id="google-login-button" class="w-100"></div>

        <!-- Register Link -->
        <p class="register-link">
          ¿No tenés cuenta? <a routerLink="/portal/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .login-box {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      padding: 2rem;
      width: 100%;
      max-width: 400px;
    }

    h1 {
      margin: 0 0 0.5rem;
      color: #333;
      font-size: 1.8rem;
    }

    .subtitle {
      color: #666;
      margin: 0 0 1.5rem;
      font-size: 0.9rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-control:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }

    .btn {
      padding: 0.75rem 1rem;
      font-weight: 500;
      border-radius: 6px;
      transition: all 0.3s;
      border: none;
      cursor: pointer;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .divider {
      text-align: center;
      margin: 1.5rem 0;
      position: relative;
      color: #999;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: calc(50% - 1rem);
      height: 1px;
      background: #ddd;
    }

    .divider::after {
      content: '';
      position: absolute;
      top: 50%;
      right: 0;
      width: calc(50% - 1rem);
      height: 1px;
      background: #ddd;
    }

    #google-login-button {
      display: flex;
      justify-content: center;
    }

    .register-link {
      text-align: center;
      margin: 1.5rem 0 0;
      color: #666;
    }

    .register-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .register-link a:hover {
      text-decoration: underline;
    }

    .alert {
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 1rem;
    }

    .alert-danger {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .spinner-border {
      width: 1em;
      height: 1em;
    }

    @media (max-width: 480px) {
      .login-box {
        padding: 1.5rem;
      }

      h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class PublicLoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: UsuarioWebAuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Inicializar Google Sign-In
    this.initializeGoogleSignIn();
  }

  /**
   * Inicializa el botón de Google Sign-In
   */
  private initializeGoogleSignIn(): void {
    setTimeout(() => {
      if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: (response: any) => this.handleGoogleLogin(response)
        });

        google.accounts.id.renderButton(
          document.getElementById('google-login-button'),
          {
            type: 'standard',
            size: 'large',
            text: 'signin_with'
          }
        );
      }
    }, 500);
  }

  /**
   * Maneja el login con email/contraseña
   */
  onLogin(): void {
    if (!this.loginForm.valid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/portal/propiedades']);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Error al ingresar. Verifica tus credenciales.';
      }
    });
  }

  /**
   * Maneja el login con Google
   */
  private handleGoogleLogin(response: any): void {
    if (response.credential) {
      this.loading = true;
      this.error = '';

      this.authService.googleAuth(response.credential).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/portal/propiedades']);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Error al autenticarse con Google.';
        }
      });
    }
  }
}
