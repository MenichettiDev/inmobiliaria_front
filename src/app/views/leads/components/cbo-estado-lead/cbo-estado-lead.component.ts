import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EstadoLead, EstadoLeadService } from '../../service/estado-lead.service';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cbo-estado-lead',
  imports: [CommonModule, FormsModule],
  templateUrl: './cbo-estado-lead.component.html',
  styleUrls: ['./cbo-estado-lead.component.css']
})
export class CboEstadoLeadComponent implements OnInit {
  estados: EstadoLead[] = [];
  loading = false;
  error?: string;

  @Input() selectedId?: number | null = null;
  @Output() selectedIdChange = new EventEmitter<number | null>();

  constructor(private srvEstadoLead: EstadoLeadService) { }

  ngOnInit(): void {
    this.cargarEstados();
  }

  cargarEstados(): void {
    this.loading = true;
    this.error = undefined;
    this.srvEstadoLead.getEstados().pipe(
      finalize(() => (this.loading = false))
    ).subscribe({
      next: resp => {
        // Manejar distintos formatos de respuesta:
        // 1) ApiResponse donde data es array (como la que enviaste)
        // 2) PaginatedResponse donde data.items contiene el array
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
        this.error = 'No se pudieron cargar los estados.';
        console.error(err);
      }
    });
  }

  onChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const id = value ? Number(value) : null;
    this.selectedId = id;
    this.selectedIdChange.emit(id);
  }

  trackById(index: number, item: EstadoLead) {
    return item.id;
  }

  getSelectedColor(): string | null {
    const s = this.estados.find(e => e.id === this.selectedId);
    return s?.color || null;
  }
}
