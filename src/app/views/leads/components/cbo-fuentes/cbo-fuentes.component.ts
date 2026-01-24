import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { FuentesService, FuenteContacto } from '../../service/fuentes.service';

@Component({
  selector: 'app-cbo-fuentes',
  imports: [CommonModule, FormsModule],
  templateUrl: './cbo-fuentes.component.html',
  styleUrls: ['./cbo-fuentes.component.css']
})
export class CboFuentesComponent implements OnInit {
  fuentes: FuenteContacto[] = [];
  loading = false;
  error?: string;

  @Input() selectedId?: number | null = null;
  @Output() selectedIdChange = new EventEmitter<number | null>();

  constructor(private fuentesSrv: FuentesService) { }

  ngOnInit(): void {
    this.cargarFuentes();
  }

  cargarFuentes(): void {
    this.loading = true;
    this.error = undefined;
    this.fuentesSrv.obtenerFuentes().pipe(finalize(() => (this.loading = false))).subscribe({
      next: resp => {
        const raw = (resp as any)?.data;
        if (!raw) {
          this.fuentes = [];
          return;
        }
        if (Array.isArray(raw)) {
          this.fuentes = raw;
        } else if (Array.isArray(raw.items)) {
          this.fuentes = raw.items;
        } else if (Array.isArray(raw.data)) {
          this.fuentes = raw.data;
        } else {
          this.fuentes = [];
        }
      },
      error: err => {
        console.error(err);
        this.error = 'No se pudieron cargar las fuentes.';
      }
    });
  }

  onChange(event: Event): void {
    // kept for compatibility but not used by template anymore
    const value = (event.target as HTMLSelectElement).value;
    const id = value ? Number(value) : null;
    this.selectedId = id;
    this.selectedIdChange.emit(id);
  }

  trackById(index: number, item: FuenteContacto) {
    return item.id;
  }
}
