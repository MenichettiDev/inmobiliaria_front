import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { PropiedadesService } from '../../propiedades.service';
import { Imagen } from '../../models/imagen.model';

@Component({
  selector: 'app-imagenes-galeria',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './imagenes-galeria.component.html',
  styleUrl: './imagenes-galeria.component.css'
})
export class ImagenesGaleriaComponent implements OnChanges {
  @Input() propiedadId!: number;
  @Input() imagenes: Imagen[] = [];

  @Output() imagenesChanged = new EventEmitter<Imagen[]>();

  imagenesLocal: Imagen[] = [];
  cargando: boolean = false;
  eliminando: Set<number> = new Set();
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | '' = '';

  constructor(private propiedadesService: PropiedadesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imagenes']) {
      this.imagenesLocal = [...this.imagenes];
    }
  }

  // Manejar drop (reordenar)
  drop(event: CdkDragDrop<Imagen[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    const items = [...this.imagenesLocal];
    const [draggedItem] = items.splice(event.previousIndex, 1);
    items.splice(event.currentIndex, 0, draggedItem);

    // Actualizar orden
    this.imagenesLocal = items.map((img, index) => ({
      ...img,
      orden: index + 1
    }));

    // Enviar al backend
    const ordenes = this.imagenesLocal.map((_, i) => i + 1);
    this.cargando = true;

    this.propiedadesService.reordenarImagenes(this.propiedadId, ordenes).subscribe({
      next: () => {
        this.cargando = false;
        this.mensaje = 'Orden actualizado';
        this.tipoMensaje = 'success';
        this.imagenesChanged.emit(this.imagenesLocal);
        setTimeout(() => {
          this.mensaje = '';
        }, 2000);
      },
      error: (err) => {
        this.cargando = false;
        this.imagenesLocal = [...this.imagenes]; // Revertir
        this.mensaje = 'Error al reordenar';
        this.tipoMensaje = 'error';
      }
    });
  }

  // Hacer imagen principal
  hacerPrincipal(imagen: Imagen): void {
    if (imagen.esPrincipal) return;

    this.cargando = true;
    this.propiedadesService.hacerImagenPrincipal(imagen.id).subscribe({
      next: (res) => {
        this.cargando = false;
        if (res.data) {
          // Actualizar localmente
          this.imagenesLocal = this.imagenesLocal.map(img => ({
            ...img,
            esPrincipal: img.id === imagen.id
          }));
          this.mensaje = 'Imagen principal actualizada';
          this.tipoMensaje = 'success';
          this.imagenesChanged.emit(this.imagenesLocal);
          setTimeout(() => {
            this.mensaje = '';
          }, 2000);
        }
      },
      error: (err) => {
        this.cargando = false;
        this.mensaje = 'Error al actualizar';
        this.tipoMensaje = 'error';
      }
    });
  }

  // Eliminar imagen
  eliminarImagen(imagen: Imagen): void {
    if (!confirm(`¿Eliminar imagen: ${imagen.propiedadTitulo}?`)) {
      return;
    }

    this.eliminando.add(imagen.id);

    this.propiedadesService.eliminarImagen(imagen.id).subscribe({
      next: () => {
        this.imagenesLocal = this.imagenesLocal.filter(img => img.id !== imagen.id);
        this.eliminando.delete(imagen.id);
        this.mensaje = 'Imagen eliminada';
        this.tipoMensaje = 'success';
        this.imagenesChanged.emit(this.imagenesLocal);
        setTimeout(() => {
          this.mensaje = '';
        }, 2000);
      },
      error: (err) => {
        this.eliminando.delete(imagen.id);
        this.mensaje = 'Error al eliminar';
        this.tipoMensaje = 'error';
      }
    });
  }
}
