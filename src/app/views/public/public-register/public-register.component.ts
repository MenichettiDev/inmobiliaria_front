import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioWebAuthService } from '../../../services/usuario-web-auth.service';
import { environment } from '../../../environments/environment';

declare var google: any;

@Component({
  selector: 'app-public-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="register-container">
      <div class="register-box">
        <h1>Crear Cuenta</h1>
        <p class="subtitle">Regístrate para guardar tus favoritos y hacer consultas</p>

        <!-- Error Alert -->
        <div *ngIf="error" class="alert alert-danger">
          <i class="fas fa-exclamation-circle me-2"></i>
          {{ error }}
        </div>

        <!-- Success Alert -->
        <div *ngIf="success" class="alert alert-success">
          <i class="fas fa-check-circle me-2"></i>
          Cuenta creada exitosamente. Redirigiendo...
        </div>

        <!-- Form -->
        <form [formGroup]="registerForm" (ngSubmit)="onRegister()" *ngIf="!success">
          <div class="form-group">
            <label for="nombre">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              class="form-control"
              formControlName="nombre"
              placeholder="Tu nombre y apellido"
              [disabled]="loading"
            />
            <div class="invalid-feedback" *ngIf="registerForm.get('nombre')?.invalid && registerForm.get('nombre')?.touched">
              El nombre es requerido
            </div>
          </div>

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
            <div class="invalid-feedback" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
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
              placeholder="Al menos 6 caracteres"
              [disabled]="loading"
            />
            <div class="invalid-feedback" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
              La contraseña debe tener al menos 6 caracteres
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              class="form-control"
              formControlName="confirmPassword"
              placeholder="Repite tu contraseña"
              [disabled]="loading"
            />
            <div class="invalid-feedback" *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
              <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">
                La confirmación es requerida
              </span>
              <span *ngIf="registerForm.errors?.['passwordMismatch']">
                Las contraseñas no coinciden
              </span>
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100" [disabled]="loading || !registerForm.valid">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Registrando...' : 'Crear Cuenta' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="divider" *ngIf="!success">o</div>

        <!-- Google Button -->
        <div id="google-register-button" class="w-100" *ngIf="!success"></div>

        <!-- Login Link -->
        <p class="login-link" *ngIf="!success">
          ¿Ya tenés cuenta? <a routerLink="/portal/login">Ingresa aquí</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .register-box {
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
      box-sizing: border-box;
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
      width: 100%;
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

    #google-register-button {
      display: flex;
      justify-content: center;
    }

    .login-link {
      text-align: center;
      margin: 1.5rem 0 0;
      color: #666;
    }

    .login-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .login-link a:hover {
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

    .alert-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .spinner-border {
      width: 1em;
      height: 1em;
    }

    @media (max-width: 480px) {
      .register-box {
        padding: 1.5rem;
      }

      h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class PublicRegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  error = '';
  success = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: UsuarioWebAuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.initializeGoogleSignIn();
  }

  /**
   * Validador personalizado para confirmar contraseña
   */
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  /**
   * Inicializa el botón de Google Sign-In
   */
  private initializeGoogleSignIn(): void {
    setTimeout(() => {
      if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: (response: any) => this.handleGoogleRegister(response)
        });

        google.accounts.id.renderButton(
          document.getElementById('google-register-button'),
          {
            type: 'standard',
            size: 'large',
            text: 'signup_with'
          }
        );
      }
    }, 500);
  }

  /**
   * Maneja el registro con email/contraseña
   */
  onRegister(): void {
    if (!this.registerForm.valid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const { nombre, email, password, confirmPassword } = this.registerForm.value;

    this.authService.register(nombre, email, password, confirmPassword).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/portal/propiedades']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Error al crear la cuenta. Intenta nuevamente.';
      }
    });
  }

  /**
   * Maneja el registro con Google
   */
  private handleGoogleRegister(response: any): void {
    if (response.credential) {
      this.loading = true;
      this.error = '';

      this.authService.googleAuth(response.credential).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/portal/propiedades']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Error al crear cuenta con Google.';
        }
      });
    }
  }
}
