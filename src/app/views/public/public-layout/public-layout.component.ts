import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UsuarioWebAuthService, UsuarioWeb } from '../../../services/usuario-web-auth.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.css']
})
export class PublicLayoutComponent implements OnInit {
  usuarioWeb$: Observable<UsuarioWeb | null>;
  currentYear = new Date().getFullYear();

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
