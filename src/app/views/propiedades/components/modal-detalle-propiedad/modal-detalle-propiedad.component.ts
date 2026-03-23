import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapPickerComponent, LatLng } from '../../../../shared/components/map-picker/map-picker.component';

interface Imagen {
  id: number;
  idPropiedad: number;
  url: string;
  orden: number;
  creadoEn: string;
  propiedadTitulo?: string;
}

interface Propiedad {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  direccion: string;
  latitud: number;
  longitud: number;
  publicadaEn: string | null;
  creadoEn: string;
  actualizadoEn: string;
  idInmobiliaria: number;
  idAgenteResponsable: number | null;
  agenteResponsableNombre: string | null;
  idEstadoAdmin: number;
  idEstadoOperativo: number;
  estadoAdminNombre: string;
  estadoOperativoNombre: string;
  imagenes?: Imagen[];
}

@Component({
  selector: 'app-modal-detalle-propiedad',
  standalone: true,
  imports: [CommonModule, MapPickerComponent],
  templateUrl: './modal-detalle-propiedad.component.html',
  styleUrls: ['./modal-detalle-propiedad.component.css']
})
export class ModalDetallePropiedadComponent implements OnChanges {
  @Input() propiedad: Propiedad | null = null;

  mainIndex: number = 0;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['propiedad'] && this.propiedad) {
      this.mainIndex = 0;
    }
  }

  getMainImage(): string {
    if (!this.propiedad?.imagenes?.length) return 'assets/images/backgrounds/vacia.jpg';
    const img = this.propiedad.imagenes[this.mainIndex] || this.propiedad.imagenes[0];
    return this.buildUrl(img?.url);
  }

  buildUrl(url?: string): string {
    if (!url) return 'assets/images/backgrounds/vacia.jpg';
    const raw = url.toString().replace(/\r?\n|\r/g, '').trim();
    if (/^https?:\/\//i.test(raw)) return raw;
    const apiRoot = environment.apiUrl.replace(/\/api(\/)?$/i, '').replace(/\/$/, '');
    const cleanUrl = raw.replace(/^\/?api\/?/, '/').replace(/\/+/, '/');
    return encodeURI(apiRoot + (cleanUrl.startsWith('/') ? '' : '/') + cleanUrl);
  }

  setMain(i: number) {
    if (!this.propiedad) return;
    if (i < 0 || i >= (this.propiedad.imagenes || []).length) return;
    this.mainIndex = i;
  }

  onClose() {
    this.activeModal.close();
  }

  formatDate(s?: string) {
    if (!s) return '';
    const d = new Date(s);
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
