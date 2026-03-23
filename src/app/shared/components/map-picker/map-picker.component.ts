import {
  Component, AfterViewInit, OnDestroy, Input, Output, EventEmitter,
  OnChanges, SimpleChanges, PLATFORM_ID, Inject, ViewChild, ElementRef
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export interface LatLng { lat: number; lng: number; }

const PROVINCIA_COORDS: Record<string, LatLng> = {
  'buenos aires':      { lat: -36.6748, lng: -60.5585 },
  'ciudad autónoma de buenos aires': { lat: -34.6118, lng: -58.3960 },
  'caba':              { lat: -34.6118, lng: -58.3960 },
  'catamarca':         { lat: -28.4716, lng: -65.7895 },
  'chaco':             { lat: -27.4298, lng: -59.0133 },
  'chubut':            { lat: -43.2933, lng: -65.1105 },
  'córdoba':           { lat: -31.4135, lng: -64.1806 },
  'cordoba':           { lat: -31.4135, lng: -64.1806 },
  'corrientes':        { lat: -27.4806, lng: -58.8341 },
  'entre ríos':        { lat: -31.7748, lng: -60.4967 },
  'entre rios':        { lat: -31.7748, lng: -60.4967 },
  'formosa':           { lat: -26.1775, lng: -58.1781 },
  'jujuy':             { lat: -24.1858, lng: -65.2995 },
  'la pampa':          { lat: -36.6167, lng: -64.2833 },
  'la rioja':          { lat: -29.4131, lng: -66.8558 },
  'mendoza':           { lat: -32.8908, lng: -68.8272 },
  'misiones':          { lat: -27.4269, lng: -55.9458 },
  'neuquén':           { lat: -38.9516, lng: -68.0591 },
  'neuquen':           { lat: -38.9516, lng: -68.0591 },
  'río negro':         { lat: -40.8135, lng: -63.0000 },
  'rio negro':         { lat: -40.8135, lng: -63.0000 },
  'salta':             { lat: -24.7821, lng: -65.4232 },
  'san juan':          { lat: -31.5375, lng: -68.5364 },
  'san luis':          { lat: -33.3000, lng: -66.3500 },
  'santa cruz':        { lat: -51.6230, lng: -68.9788 },
  'santa fe':          { lat: -31.6107, lng: -60.6973 },
  'santiago del estero': { lat: -27.7951, lng: -64.2615 },
  'tierra del fuego':  { lat: -54.8019, lng: -68.3030 },
  'tucumán':           { lat: -26.8241, lng: -65.2226 },
  'tucuman':           { lat: -26.8241, lng: -65.2226 },
};

@Component({
  selector: 'app-map-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-picker.component.html',
  styleUrl: './map-picker.component.css'
})
export class MapPickerComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('mapContainer', { static: false }) mapContainerRef!: ElementRef;

  @Input() lat: number | null = null;
  @Input() lng: number | null = null;
  @Input() provinciaNombre: string | null = null;
  @Input() readonly = false;
  @Output() locationChange = new EventEmitter<LatLng>();

  private map: any;
  private marker: any;
  private L: any;
  private initialized = false;
  private resizeObserver: ResizeObserver | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    const mod = await import('leaflet');
    this.L = (mod as any).default ?? mod;

    // esperar a que el contenedor tenga dimensiones reales usando ResizeObserver
    const el = this.mapContainerRef?.nativeElement;
    if (el && el.offsetWidth > 0) {
      this.initMap();
    } else {
      this.resizeObserver = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          this.resizeObserver?.disconnect();
          this.resizeObserver = null;
          this.initMap();
        }
      });
      this.resizeObserver.observe(el);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map || !this.L) return;

    if (changes['provinciaNombre'] && this.provinciaNombre && !this.lat) {
      const coords = this.getCoordsForProvincia(this.provinciaNombre);
      if (coords) {
        this.map.setView([coords.lat, coords.lng], 10);
      }
    }

    if ((changes['lat'] || changes['lng']) && this.lat != null && this.lng != null) {
      this.setMarker(this.lat, this.lng);
      this.map.setView([this.lat, this.lng], 14);
      this.invalidateSize();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }

  private initMap(): void {
    if (this.initialized || !this.mapContainerRef) return;
    this.initialized = true;

    const L = this.L;
    const defaultCoords = this.getDefaultCoords();

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const zoom = this.lat ? 14 : (this.provinciaNombre ? 10 : 6);
    this.map = L.map(this.mapContainerRef.nativeElement, { zoomControl: true })
      .setView([defaultCoords.lat, defaultCoords.lng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(this.map);

    if (this.lat != null && this.lng != null) {
      this.setMarker(this.lat, this.lng);
    }

    this.invalidateSize();

    if (!this.readonly) {
      this.map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        this.setMarker(lat, lng);
        this.locationChange.emit({ lat: +lat.toFixed(7), lng: +lng.toFixed(7) });
      });
    }
  }

  private invalidateSize(): void {
    if (!this.map) return;
    // Forzar recálculo de dimensiones — doble frame garantiza que el layout se estabilizó
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.map?.invalidateSize({ animate: false });
      });
    });
    // Fallback adicional por si el layout tarda más (ej. animaciones de card/modal)
    setTimeout(() => {
      this.map?.invalidateSize({ animate: false });
    }, 200);
  }

  private getDefaultCoords(): LatLng {
    if (this.lat != null && this.lng != null) return { lat: this.lat, lng: this.lng };
    if (this.provinciaNombre) {
      const c = this.getCoordsForProvincia(this.provinciaNombre);
      if (c) return c;
    }
    return { lat: -34.6118, lng: -58.3960 }; // Buenos Aires por defecto
  }

  private getCoordsForProvincia(nombre: string): LatLng | null {
    return PROVINCIA_COORDS[nombre.toLowerCase().trim()] ?? null;
  }

  private setMarker(lat: number, lng: number): void {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = this.L.marker([lat, lng]).addTo(this.map);
    }
  }
}
