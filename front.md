# GUÍA DE DISEÑO FRONTEND - inmobiliaria
## Documentación completa de estructura visual, componentes y patrones de interfaz

---

## 1. ARQUITECTURA VISUAL GENERAL

### 1.1 Stack Tecnológico Base
- **Framework**: Angular 19+ con standalone components
- **Librería UI Principal**: PrimeNG (componentes enterprise)
- **Sistema de Grid**: Bootstrap 5+ 
- **Iconografía**: Primeicons + Bootstrap Icons
- **Animaciones**: CSS transitions + Angular Animations API
- **Formularios**: Reactive Forms con validación integrada

### 1.2 Sistema de Layout Principal
```
Estructura de Grid CSS:
┌─────────────────────────────────────────┐ ← Topbar (altura fija: 70px)
├─────────────┬───────────────────────────┤
│   Sidebar   │     Área de Contenido     │ ← Grid dinámico
│   260px     │     (router-outlet)       │
│             │                           │
│   [Menú]    │    [Componentes/Páginas]  │
│   [Usuario] │                           │
└─────────────┴───────────────────────────┘

Estados Responsivos:
- Desktop (>992px): Sidebar visible, contenido con margen izquierdo
- Mobile (<992px): Sidebar oculto, botón hamburguesa en topbar
- XSmall (<576px): Padding reducido en contenido
```

### 1.3 Sistema de Navegación
- **Topbar**: Fija, contiene breadcrumbs, usuario, notificaciones
- **Sidebar**: Menú jerárquico expandible con control de acceso por roles
- **Router Outlet**: Área principal donde se renderizan las páginas
- **Transiciones**: Cambios suaves entre estados (0.3s ease)

---

## 2. SISTEMA DE COMPONENTES COMPARTIDOS

### 2.1 Arquitectura de Componentes Reutilizables
```
shared/components/
├── topbar/              → Barra superior con navegación 
├── sidebar/             → Menú lateral con control de roles
├── table-shared/        → Tabla genérica con filtrado/paginación
├── toast-modal/         → Notificaciones temporales
├── confirm-modal/       → Diálogos de confirmación
├── spinner/             → Indicador de carga
├── paginator/           → Paginación personalizada
├── form-global-selected/→ Selector global de formularios
├── access-denied/       → Página de acceso denegado
└── Cbo/                 → Componentes selectores especializados
    ├── cbo-usuario/
    ├── cbo-herramienta/
    ├── cbo-cliente/
    └── [13 componentes Cbo diferentes...]
```

### 2.2 Topbar Component
**Funcionalidad Visual:**
- Barra horizontal fija en la parte superior
- Responsiva: Breadcrumbs en desktop, botón hamburguesa en móvil
- Tres secciones principales:
  - Navegación (izquierda): Logo/hamburguesa + breadcrumbs
  - Título (centro): Título principal + subtítulo dinámico
  - Usuario (derecha): Alertas + info usuario + logout

**Elementos Interactivos:**
- Botón hamburguesa con transición SVG suave
- Breadcrumbs dinámicos basados en ruta actual
- Badge de notificaciones con contador numérico
- Información de usuario expandible
- Animaciones de cambio de título (fade-in 300ms)

### 2.3 Sidebar Component
**Estructura Visual:**
```
┌─────────────────────┐ 
│    [Logo/Marca]     │ ← Clickeable, navega a home
├─────────────────────┤
│  📁 Menú Principal  │ ← Expandible
│    └ 📄 Submenú    │
│  📁 Otro Módulo    │
│    └ 📄 Crear      │
│    └ 📄 Listar     │
│    └ 📄 Reportes   │
├─────────────────────┤
│    👤 Mi Perfil    │ ← Solo para no-SuperAdmin
├─────────────────────┤
│   [Badge Usuario]   │ ← Legajo + rol
│   [Rol coloreado]   │
└─────────────────────┘
```

**Características:**
- Menú jerárquico con iconos de Bootstrap Icons
- Control de acceso por roles (items se ocultan según permisos)
- Animaciones de expansión/contracción en submenús
- Link activo resaltado (routerLinkActive)
- Información de usuario persistente al final

### 2.4 Table-Shared Component
**Características del Componente:**
- Tabla genérica reutilizable para listados tipo CRUD
- Filtrado dinámico en header (legajo, nombre, apellido, rol, estado)
- Paginación integrada (6, 12, 24, 48 registros por página)
- Acciones por fila: Ver/Editar, Ver Detalles, Eliminar
- Estados toggle visuales (activo/inactivo)
- Responsive: Stack layout en móvil

**Estructura Visual:**
```
┌─────────────────────────────────────────────┐ ← Barra de filtros (fondo gris suave)
│ [Legajo] [Nombre] [Apellido] [Rol▼] [Buscar]│
├─────────────────────────────────────────────┤ ← Tabla PrimeNG customizada
│ ID │ Legajo │ Nombre    │ Rol    │ Estado   │ Acciones │
├────┼────────┼───────────┼────────┼──────────┼──────────┤
│ 1  │ L001   │ Juan Péez │ Admin  │ ●Activo  │ [👁][📝][🗑] │
│ 2  │ L002   │ Ana López │ Super  │ ○Inact.  │ [👁][📝][🗑] │
├─────────────────────────────────────────────┤ ← Paginador
│          [◀] Página 1 de 5      [6▼] [▶]   │
└─────────────────────────────────────────────┘
```

**Customizaciones:**
- Sin efectos hover automáticos de PrimeNG
- Sin filas alternadas (striping desactivado)
- Bordes sutiles entre filas
- Tooltips en botones de acción
- Columna "estado" con toggle visual especial

### 2.5 Sistema de Cbos (Componentes Selectores)
**Patrón Universal para Dropdowns:**
- 13 componentes Cbo especializados (usuario, herramienta, cliente, etc.)
- Implementan ControlValueAccessor para integración con FormControl
- Búsqueda en tiempo real con debounce (300ms)
- Limpieza automática de selección al cambiar búsqueda
- Indicadores de error integrados con formularios reactivos

**Comportamiento Visual:**
```
[Cbo Dropdown ▼] ← Estado inicial
     ↓ usuario tipea
[Buscando...   ] ← Estado de carga
     ↓ resultados
[Resultado 1   ] ← Lista de opciones
[Resultado 2   ]
[Resultado 3   ]
     ↓ selección
[Juan Pérez    ] ← Valor seleccionado
```

**Características:**
- Placeholder dinámico
- Texto de búsqueda diferenciado del valor seleccionado
- Estados: normal, disabled, error, loading
- Interfaz Option estándar: `{ id, nombre, displayText }`

---

## 3. SISTEMA DE MODALES

### 3.1 Arquitectura de Modales 
**Tipos Identificados:**
- Modal de Usuario (crear/editar)
- Modal de Perfil (edición de perfil personal)
- Modal de Herramienta (gestión de herramientas)
- Modal de Alerta (dashboard)
- Modal de Proveedor, Cliente, Obras (recursos)
- Modal de Movimiento/Historial (transacciones)

### 3.2 Estructura Estándar de Modal
**HTML Pattern:**
```html
<div class="modal-overlay" *ngIf="visible" role="dialog" aria-modal="true">
  <div class="modal-wrapper" [class.readonly]="isReadonly">
    <div class="modal-content" [class.open]="visible">
      
      <!-- Header con título y botón cerrar -->
      <div class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
        <button (click)="closeModal()" aria-label="Cerrar">✕</button>
      </div>
      
      <!-- Contenido dinámico (formulario/información) -->
      <div class="modal-form">
        <!-- Campos del formulario según propósito -->
      </div>
      
      <!-- Footer con acciones -->
      <div class="modal-footer">
        <button (click)="closeModal()">Cancelar</button>
        <button (click)="save()" [disabled]="!formGroup.valid">Guardar</button>
      </div>
    </div>
  </div>
</div>
```

**TypeScript Pattern:**
```typescript
@Component({
  selector: 'app-modal-xxx',
  templateUrl: './modal-xxx.component.html',
  styleUrls: ['./modal-xxx.component.css']
})
export class ModalXxxComponent {
  @Input() visible: boolean = false;
  @Input() data?: any;
  @Input() editMode: boolean = false;
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  
  formGroup: FormGroup;
  
  onSave() {
    if (this.formGroup.valid) {
      this.save.emit(this.formGroup.value);
      this.closeModal();
    }
  }
}
```

### 3.3 Comportamiento Visual de Modales
**Estados:**
- **Normal**: Edición completa habilitada
- **Readonly** (`.readonly`): Solo lectura, inputs deshabilitados
- **Loading**: Spinner durante operaciones async

**Animaciones:**
- Entrada: `opacity 0→1` + `translateY(12px)→0` + `scale(0.99→1)` en 250ms
- Overlay: Backdrop con blur(6px) y opacidad semi-transparente
- Z-index usando tokens: `var(--z-overlay)` para el backdrop, `var(--z-modal)` para el contenedor

**Responsive:**
- Ancho máximo: 760px
- Altura máxima: 85vh con scroll interno
- Centrado con flexbox
- Padding reducido en móviles

---

## 4. SISTEMA DE ESTILOS Y TEMAS

### 4.1 Sistema de Design Tokens (CSS Variables)
**Archivo principal:** `src/styles/design-tokens.css`

```css
:root {
  /* 🎨 Paleta Brand (Indigo) */
  --primary-50:  #eef2ff;
  --primary-100: #e0e7ff;
  --primary-200: #c7d2fe;
  --primary-300: #a5b4fc;
  --primary-400: #818cf8;
  --primary-500: #6366f1;  /* Accent */
  --primary-600: #4f46e5;  /* Brand Primary */
  --primary-700: #4338ca;  /* Dark */
  --primary-800: #3730a3;
  --primary-900: #312e81;

  /* 🌚 Neutros (Slate) */
  --neutral-50:  #f8fafc;
  --neutral-100: #f1f5f9;
  --neutral-200: #e2e8f0;
  --neutral-300: #cbd5e1;
  --neutral-400: #94a3b8;
  --neutral-500: #64748b;
  --neutral-600: #475569;
  --neutral-700: #334155;
  --neutral-800: #1e293b;
  --neutral-900: #0f172a;

  /* 🌈 Semánticos — NO mezclar con brand primary */
  --color-success: #10b981;  /* Emerald 500 */
  --color-warning: #f59e0b;  /* Amber 500 */
  --color-error:   #f43f5e;  /* Rose 500 */
  --color-info:    #0ea5e9;  /* Sky 500 */

  /* 💎 Glassmorphism */
  --glass-bg:     rgba(255, 255, 255, 0.88);
  --glass-border: rgba(255, 255, 255, 0.5);
  --glass-blur:   8px;
  --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);

  /* 📐 Espaciado (base 4px) */
  --space-1:  0.25rem;  /*  4px */
  --space-2:  0.5rem;   /*  8px */
  --space-3:  0.75rem;  /* 12px */
  --space-4:  1rem;     /* 16px */
  --space-6:  1.5rem;   /* 24px */
  --space-8:  2rem;     /* 32px */
  --space-12: 3rem;     /* 48px */

  /* 🖋️ Tipografía */
  --font-main:    'Inter', system-ui, -apple-system, sans-serif;
  --font-display: 'Outfit', sans-serif;

  --text-xs:   0.75rem;   /* 12px — labels, micro */
  --text-sm:   0.875rem;  /* 14px — body, celdas */
  --text-base: 1rem;      /* 16px — body default */
  --text-lg:   1.125rem;  /* 18px — subtítulos */
  --text-xl:   1.25rem;   /* 20px — page titles */
  --text-2xl:  1.5rem;    /* 24px — section titles */

  /* 🔳 Bordes */
  --radius-xs:   4px;
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-full: 9999px;

  /* 🌊 Sombras (dispersión suave) */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  /* ⚡ Transiciones */
  --ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: 150ms var(--ease-in-out);
  --transition-normal: 250ms var(--ease-in-out);

  /* 🪜 Z-Index Scale */
  --z-base:         1;
  --z-dropdown:     100;
  --z-sticky:       200;
  --z-overlay:      1000;
  --z-modal:        1100;
  --z-modal-header: 1110;
  --z-toast:        1200;
  --z-tooltip:      1300;

  /* 🏗️ Layout */
  --sidebar-width:        260px;
  --topbar-height:        70px;
  --content-left-offset:  130px;

  /* Aliases Brand */
  --color-primary:      var(--primary-600);
  --color-primary-dark: var(--primary-700);
  --color-primary-light: var(--primary-400);
  --color-border:       var(--neutral-200);
  --color-bg-base:      var(--neutral-50);
  --color-bg-surface:   #ffffff;
  --color-text:         var(--neutral-900);
  --color-text-secondary: var(--neutral-600);
  --color-text-muted:   var(--neutral-400);
}
```

**Reglas de uso de color:**
- `--color-primary` → CTAs, links, estados activos
- `--color-success` → Solo confirmaciones/éxito real (no como accent alternativo)
- `--color-error` → Errores, acciones destructivas
- `--color-warning` → Advertencias, pendientes
- No mezclar semánticas: un color de éxito no se usa como brand highlight

**Modo oscuro** — activar con `document.documentElement.setAttribute('data-theme', 'dark')`:
```css
[data-theme="dark"] {
  --color-bg-base:        #0f172a;
  --color-bg-surface:     #1e293b;
  --color-text:           #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-border:         #334155;
  --glass-bg:             rgba(30, 41, 59, 0.85);
  --glass-border:         rgba(255, 255, 255, 0.08);
  /* shadows más pronunciadas en dark */
}
```

**Asignación de tokens por componente:**

| Componente | Radio | Sombra |
|---|---|---|
| Inputs, badges | `--radius-xs` | ninguna |
| Botones | `--radius-sm` | `--shadow-sm` |
| Cards, panels | `--radius-md` | `--shadow-md` |
| Modales, drawers | `--radius-lg` | `--shadow-xl` |
| Avatares, pills | `--radius-full` | ninguna |

---

### 4.2 Estructura de Archivos CSS
**Archivos Globales:**
```
src/styles.css                 → Aliases de tokens + layout base + utilidades globales
src/styles/
├── design-tokens.css          → Fuente de verdad: todos los tokens CSS variables
├── prime-overrides.css        → Overrides básicos de PrimeNG (v1)
├── prime-overrides-v2.css     → Overrides modernos de PrimeNG (activo, usar este)
├── cbo-styles.css             → Estilos para componentes selectores (Cbos)
├── modal-style.css            → Estilos base para todos los modales custom
├── visor-style.css            → Estilos para vistas de solo lectura
├── movimientos-style.css      → Estilos específicos para módulo movimientos
└── reportes-style.css         → Estilos específicos para reportes
```

**Carga en angular.json:**
```json
"styles": [
  "node_modules/primeicons/primeicons.css",
  "node_modules/primeflex/primeflex.css",
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.css",
  "src/styles/visor-style.css"
]
```

**Orden de cascada (importado en styles.css):**
1. `design-tokens.css` — variables base
2. `prime-overrides.css` — overrides base PrimeNG
3. `prime-overrides-v2.css` — overrides modernos (botones, inputs, cards, datatable, dialog)

---

### 4.3 Customizaciones de PrimeNG
**Archivo activo:** `src/styles/prime-overrides-v2.css`

**Componentes customizados:**

```css
/* Botones — flat, sin gradientes */
.p-button {
  border-radius: var(--radius-sm);
  font-family: var(--font-main);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-fast);
}
.p-button:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); }
.p-button.p-button-primary { background: var(--primary-600); }
.p-button.p-button-primary:hover { background: var(--primary-700) !important; }

/* Inputs — con estados ng-invalid y disabled */
.p-inputtext { border: 1px solid var(--neutral-200); border-radius: var(--radius-xs); }
.p-inputtext:focus { border-color: var(--primary-500) !important; box-shadow: 0 0 0 2px var(--primary-100) !important; }
.p-inputtext.ng-invalid.ng-touched { border-color: var(--color-error) !important; box-shadow: 0 0 0 2px rgba(244, 63, 94, 0.12) !important; }
.p-inputtext:disabled { background: var(--neutral-50) !important; color: var(--color-text-muted) !important; cursor: not-allowed; }

/* Cards — glassmorphism moderado */
.p-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
}

/* DataTable */
.p-datatable { border-radius: var(--radius-md); border: 1px solid var(--neutral-100); }
.p-datatable .p-datatable-thead > tr > th { background: var(--neutral-50) !important; font-size: var(--text-xs) !important; text-transform: uppercase; letter-spacing: 0.05em; }
.p-datatable .p-datatable-tbody > tr:hover { background: var(--neutral-50) !important; }

/* Dialogs */
.p-dialog { border-radius: var(--radius-xl); box-shadow: var(--shadow-xl); }
```

**Reglas importantes:**
- Sin gradientes en botones (antipatrón en SaaS moderno)
- Sin `striping` en tablas — solo hover sutil
- Usar `var(--z-modal)` para z-index, nunca hardcoded

---

## 5. SISTEMA DE NOTIFICACIONES Y FEEDBACK

### 5.1 Toast-Modal Component
**Características:**
- Notificaciones temporales no intrusivas
- Tipos: success, error, warning, info
- Posicionamiento automático (esquina superior derecha típicamente)
- Auto-dismiss configurable
- Animaciones de entrada y salida fluidas

**Estados de Animación:**
```
isVisible = true  → animState = 'enter' → CSS animation 'entrada'
    ↓ animationend
animState = 'idle' → [Permanece visible con efectos sutiles]
    ↓ timeout/programado  
isVisible = false → animState = 'exit'  → CSS animation 'salida'
    ↓ animationend
internalVisible = false → [Removido del DOM]
```

**Estructura Visual:**
```html
<div class="toast toast-{{ type }}" role="status" aria-live="polite">
  <div class="toast-icon">[Icono: ✓, ✖, ⚠, ℹ]</div>
  <div class="toast-content">
    <div class="toast-message">{{ mensaje }}</div>
  </div>
</div>
```

### 5.2 Confirm-Modal Component
**Propósito:**
- Diálogos de confirmación para acciones destructivas
- Modal simple con título, mensaje y dos botones
- Animaciones de escala para entrada/salida

**Estructura:**
```
┌─────────────────────────┐ ← Modal overlay
│  ┌─────────────────┐    │
│  │   Confirmación  │ ✕  │ ← Header con botón cerrar
│  ├─────────────────┤    │
│  │ ¿Estás seguro   │    │ ← Mensaje
│  │ de realizar     │    │
│  │ esta acción?    │    │
│  ├─────────────────┤    │
│  │ [Cancelar] [SI] │    │ ← Botones de acción
│  └─────────────────┘    │
└─────────────────────────┘
```

**Patrón de Uso:**
```typescript
// En componente padre:
showConfirm = false;
confirmMessage = '';

onDelete(item: any) {
  this.confirmMessage = `¿Eliminar ${item.nombre}?`;
  this.showConfirm = true;
}

onConfirmDelete() {
  // Ejecutar eliminación
  this.showConfirm = false;
}
```

### 5.3 Spinner Component
- Indicador de carga global o por componente
- Usado en table-shared durante carga de datos
- Posible integración con interceptor HTTP global
- Diseño minimalista y discreto

---

## 6. FORMULARIOS Y VALIDACIÓN

### 6.1 Patrón de Formularios Reactivos
**Estructura Base:**
```typescript
// Component
formGroup = this.formBuilder.group({
  legajo: ['', [Validators.required, Validators.minLength(3)]],
  nombre: ['', Validators.required],
  apellido: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  rol: [null, Validators.required],
  activo: [true]
});

// Template
<form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
  <input formControlName="legajo" [class.error]="hasError('legajo')">
  <div *ngIf="hasError('legajo')" class="error-message">
    {{ getErrorMessage('legajo') }}
  </div>
</form>
```

### 6.2 Integración con Componentes Cbo
```html
<app-cbo-usuario 
  [formControl]="formGroup.get('usuario')"
  [objectErrors]="getErrors('usuario')"
  [isTouched]="isTouched"
  placeholder="Seleccionar usuario">
</app-cbo-usuario>
```

### 6.3 Estados Visuales de Validación
- **Campo válido**: Borde normal, sin indicadores
- **Campo inválido no tocado**: Apariencia normal
- **Campo inválido tocado**: Borde rojizo + mensaje de error
- **Campo requerido vacío**: Mensaje "Campo obligatorio"
- **Formato incorrecto**: Mensaje específico según validador

### 6.4 Mensajes de Error Estándar
```typescript
getErrorMessage(field: string): string {
  const control = this.formGroup.get(field);
  if (control?.hasError('required')) return 'Campo obligatorio';
  if (control?.hasError('minlength')) return 'Muy corto';
  if (control?.hasError('email')) return 'Email inválido';
  return '';
}
```

---

## 7. PATRONES DE NAVEGACIÓN Y ROUTING

### 7.1 Estructura de Rutas
- **Lazy Loading**: Módulos cargados bajo demanda
- **Guardias**: auth.guard.ts protege rutas autenticadas
- **Rutas anidadas**: Cada módulo con su propio .routes.ts
- **Breadcrumbs**: Generados automáticamente basado en ruta

### 7.2 Control de Acceso Visual
**Sidebar dinámico:**
```typescript
// Menú items con control de roles
menuItems = [
  {
    id: 1,
    descripcion: 'Usuarios',
    icono: 'bi bi-people',
    link: '/usuario',
    requiredAccess: [1, 2] // Solo SuperAdmin y Admin
  }
];

// En template
<li *ngFor="let item of menuItems">
  <a *ngIf="hasAccess(item.requiredAccess)" [routerLink]="item.link">
    <i [class]="item.icono"></i> {{ item.descripcion }}
  </a>
</li>
```

### 7.3 Page Title Service
- Actualización automática de títulos de página
- Integración con topbar para mostrar ubicación actual
- Breadcrumbs dinámicos basados en estructura de rutas

---

## 8. ESTRUCTURA MODULAR DE PÁGINAS

### 8.1 Patrón Visor + Modal
**Estructura estándar por módulo:**
```
modulo/
├── modulo.routes.ts              ← Definición de rutas lazy
├── visor-modulo/                 ← Componente listado principal
│   ├── visor-modulo.component.ts ← Lógica de listado y modal control
│   ├── visor-modulo.component.html
│   └── visor-modulo.component.css
└── modal-modulo/                 ← Modal crear/editar/ver
    ├── modal-modulo.component.ts ← Formulario reactivo
    ├── modal-modulo.component.html
    └── modal-modulo.component.css
```

### 8.2 Visor Component Pattern
```typescript
export class VisorModuloComponent {
  // Estado de datos
  items: any[] = [];
  loading = false;
  totalRecords = 0;
  
  // Estado de modal
  modalVisible = false;
  modalData?: any;
  editMode = false;
  
  // Configuración de tabla
  columns = ['legajo', 'nombre', 'apellido', 'rol', 'estado'];
  
  // Acciones
  onCreateNew() {
    this.modalData = null;
    this.editMode = false;
    this.modalVisible = true;
  }
  
  onEdit(item: any) {
    this.modalData = { ...item };
    this.editMode = true;
    this.modalVisible = true;
  }
  
  onModalSave(data: any) {
    this.editMode ? this.updateItem(data) : this.createItem(data);
    this.modalVisible = false;
    this.loadData();
  }
}
```

### 8.3 Layout de Visor
```html
<div class="page-container">
  <!-- Header de página -->
  <div class="page-header">
    <h2 class="page-title">Gestión de [Módulo]</h2>
    <button (click)="onCreateNew()" class="btn-primary">
      <i class="bi bi-plus"></i> Nuevo
    </button>
  </div>
  
  <!-- Tabla de datos -->
  <app-table-shared
    [value]="items"
    [columns]="columns"
    [totalRecords]="totalRecords"
    [loading]="loading"
    [enabledFilters]="['legajo', 'nombre', 'estado']"
    (pageChange)="onPageChange($event)"
    (edit)="onEdit($event)"
    (remove)="onDelete($event)">
  </app-table-shared>
  
  <!-- Modal -->
  <app-modal-modulo
    [visible]="modalVisible"
    [data]="modalData"
    [editMode]="editMode"
    (close)="modalVisible = false"
    (save)="onModalSave($event)">
  </app-modal-modulo>
</div>
```

---

## 9. CONVENCIONES Y ESTÁNDARES

### 9.1 Nomenclatura
**Componentes:**
- PascalCase para clases: `SidebarComponent`, `ModalUsuarioComponent`
- kebab-case para selectores: `app-sidebar`, `app-modal-usuario`

**CSS:**
- kebab-case para clases: `.modal-overlay`, `.btn-primary`
- BEM methodology donde aplique: `.card__header--active`

**Servicios:**
- PascalCase + Service: `UsuarioService`, `AuthService`

**Interfaces y Tipos:**
- PascalCase: `MenuItem`, `UsuarioOption`, `TableColumn`

### 9.2 Estructura de Archivos
```
component/
├── component.component.ts    ← Lógica del componente
├── component.component.html  ← Template
├── component.component.css   ← Estilos específicos
└── component.component.spec.ts ← Tests (opcional)
```

### 9.3 Gestión de Suscripciones RxJS
```typescript
export class ExampleComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  
  ngOnInit() {
    this.subscription.add(
      this.service.getData().subscribe(data => {
        // Handle data
      })
    );
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
```

### 9.4 Inputs/Outputs Pattern
```typescript
// Input properties
@Input() visible: boolean = false;
@Input() data?: any;
@Input() readonly: boolean = false;

// Output events
@Output() close = new EventEmitter<void>();
@Output() save = new EventEmitter<any>();
@Output() delete = new EventEmitter<number>();
```

---

## 10. RESPONSIVE DESIGN Y ACCESIBILIDAD

### 10.1 Breakpoints
```css
/* Bootstrap based breakpoints */
/* XSmall devices (portrait phones, less than 576px) */
@media (max-width: 575.98px) { 
  .content { padding: var(--spacing-sm); }
}

/* Small devices (landscape phones, less than 768px) */
@media (max-width: 767.98px) { 
  .modal-wrapper { margin: var(--spacing-md); }
}

/* Medium devices (tablets, less than 992px) */
@media (max-width: 991.98px) {
  .sidebar { display: none; }
  .main-content { margin-left: 0; }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .breadcrumbs { display: flex; }
  .mobile-toggle { display: none; }
}
```

### 10.2 Adaptaciones Móviles
- **Sidebar**: Oculto por defecto, aparece con botón hamburguesa
- **Topbar**: Breadcrumbs ocultos, solo título y controles esenciales
- **Modales**: Margen reducido, ancho completo menos padding
- **Tablas**: Stack layout para mejor legibilidad
- **Botones**: Tamaño mínimo 44px para touch targets

### 10.3 Características de Accesibilidad
```html
<!-- ARIA labels en elementos interactivos -->
<button aria-label="Cerrar modal">✕</button>

<!-- Roles semánticos -->
<div class="modal-overlay" role="dialog" aria-modal="true">

<!-- Estados para screen readers -->
<div class="toast" role="status" aria-live="polite">

<!-- Focus management -->
<input [attr.aria-describedby]="hasError ? 'error-' + fieldId : null">
<div [id]="'error-' + fieldId" class="error-message">
```

---

## 11. PATRONES DE ANIMACIÓN

### 11.1 Transiciones CSS
```css
/* Elementos interactivos */
.btn, .form-control, .nav-link {
  transition: var(--transition-fast);
}

/* Layout changes */
.sidebar, .main-content {
  transition: var(--transition-normal);
}

/* Modal animations */
@keyframes modalShow {
  from { 
    opacity: 0; 
    transform: translateY(12px) scale(0.99); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}
```

### 11.2 Angular Animations
```typescript
// En component
@Component({
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
```

### 11.3 Estados de Loading
- **Spinner**: Para operaciones asíncronas
- **Skeleton**: Para carga de listas/tablas (opcional)
- **Disabled state**: Botones durante envío de formularios
- **Progress indicators**: Para operaciones largas

---

## 12. TESTING Y CALIDAD

### 12.1 Testing de Componentes
```typescript
describe('ModalUsuarioComponent', () => {
  it('should emit save event when form is valid', () => {
    // Test logic
  });
  
  it('should display validation errors when form is invalid', () => {
    // Test validation display
  });
  
  it('should close modal when cancel is clicked', () => {
    // Test close behavior
  });
});
```

### 12.2 Criterios de Calidad Visual
- **Consistencia**: Uso coherente de spacing, colores, tipografía
- **Legibilidad**: Contraste adecuado, tamaños de fuente apropiados
- **Usabilidad**: Elementos interactivos claramente identificables
- **Performance**: Animaciones fluidas, sin janks
- **Responsive**: Funcional en todos los tamaños de pantalla

---

## 13. HERRAMIENTAS Y WORKFLOW

### 13.1 Desarrollo
```json
// package.json scripts recomendados
{
  "scripts": {
    "dev": "ng serve",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "lint": "ng lint",
    "test": "ng test",
    "e2e": "ng e2e"
  }
}
```

### 13.2 Configuración de IDE (VSCode)
**Extensiones recomendadas:**
- Angular Language Service
- Angular Snippets
- Prettier
- Auto Rename Tag
- Bracket Pair Colorizer
- ES7+ React/Redux/React-Native snippets

### 13.3 Linting y Formatting
```json
// .eslintrc.json
{
  "extends": ["@angular-eslint/recommended"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@angular-eslint/component-selector": [
      "error", 
      { "prefix": "app", "style": "kebab-case", "type": "element" }
    ]
  }
}
```

---

## RESUMEN DE IMPLEMENTACIÓN

Esta guía documenta un sistema de diseño frontend modular y escalable basado en Angular 19+ que puede ser replicado en otros proyectos. Los puntos clave para la implementación son:

### ✅ Elementos Fundamentales
1. **Layout Grid responsivo** con sidebar/topbar fijos
2. **Sistema de componentes compartidos** altamente reutilizables
3. **Modales genéricos** con patrón estándar
4. **Design tokens CSS** para consistencia visual
5. **Tabla de datos configurable** con filtrado y paginación
6. **Selectores especializados (Cbos)** conectados a servicios
7. **Sistema de notificaciones** no intrusivo

### 🎯 Patrones Clave
- **ControlValueAccessor** para componentes de formulario
- **EventEmitter** para comunicación padre-hijo
- **RxJS operators** para búsquedas y datos asíncronos
- **CSS Custom Properties** para temas dinámicos
- **Standalone Components** para modularidad
- **Reactive Forms** con validación integrada

### 🚀 Ventajas del Sistema
- **Reutilizable**: Componentes que funcionan en múltiples contextos
- **Escalable**: Arquitectura modular fácil de extender
- **Mantenible**: Design tokens centralizados y patrones consistentes
- **Accesible**: ARIA labels y navegación por teclado
- **Responsive**: Adaptable a todos los dispositivos

---

*Esta documentación serve como guía completa para replicar la estructura visual, patrones de diseño y arquitectura de componentes en nuevos proyectos frontend.*