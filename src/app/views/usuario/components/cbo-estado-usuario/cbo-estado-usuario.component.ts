import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { EstadoUsuario, EstadoUsuarioService } from '../../services/estado-usuario.service';

@Component({
  selector: 'app-cbo-estado-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cbo-estado-usuario.component.html',
  styleUrls: ['./cbo-estado-usuario.component.css']
})
export class CboEstadoUsuarioComponent implements OnInit {
  estados: EstadoUsuario[] = [];
  loading = false;
  error?: string;

  @Input() selectedId?: number | null = null;
  @Output() selectedIdChange = new EventEmitter<number | null>();

  constructor(private srv: EstadoUsuarioService) { }

  ngOnInit(): void {
    this.cargarEstados();
  }

  cargarEstados(): void {
    this.loading = true;
    this.error = undefined;
    this.srv.obtenerEstadosActivos().pipe(finalize(() => (this.loading = false))).subscribe({
      next: resp => {
        const raw = (resp as any)?.data;
        if (!raw) {
          this.estados = [];
          return;
        }
        if (Array.isArray(raw)) {
          this.estados = raw;
        } else if (Array.isArray(raw.items)) {
          this.estados = raw.items;
        } else if (Array.isArray(raw.data)) {
          this.estados = raw.data;
        } else {
          this.estados = [];
        }
      },
      error: err => {
        console.error(err);
        this.error = 'No se pudieron cargar los estados.';
      }
    });
  }

  trackById(index: number, item: EstadoUsuario) {
    return item.id;
  }
}
