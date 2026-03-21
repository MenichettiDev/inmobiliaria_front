Actúa como un experto en UI/UX, Design Systems y SaaS enterprise.

Contexto:
Tengo una aplicación SaaS ya desarrollada (frontend en Angular 19) con funcionalidades completas, pero con una interfaz inconsistente y poco profesional. NO quiero modificar la lógica ni reescribir componentes, solo mejorar la capa visual y de experiencia.

Objetivo:
Definir un estándar visual global (tipo design system liviano) que pueda aplicarse progresivamente sobre la aplicación existente.

Instrucciones:

1. Analiza el problema como si estuvieras auditando un SaaS real ya en producción.
2. NO generes código de negocio ni lógica. Solo enfócate en UI/UX, estilos, consistencia y experiencia. Imita a los bechmarks.
3. Propón un sistema claro, reutilizable y escalable.

Entregables:

A. Sistema de diseño base:
- Paleta de colores (primarios, secundarios, estados: éxito, error, warning, info)
- Escala tipográfica (jerarquías claras: títulos, subtítulos, cuerpo, labels)
- Espaciado (sistema de spacing consistente tipo 4px/8px)
- Bordes, sombras y elevaciones
- Radios y densidad visual

B. Estándares de componentes:
- Botones (variantes: primary, secondary, ghost, danger)
- Inputs y formularios (focus, error, disabled)
- Tablas (densidad, hover, jerarquía)
- Modales y drawers
- Cards y contenedores

C. Reglas de consistencia:
- Uso correcto de colores (no mezclar semánticas)
- Alineaciones y grillas
- Jerarquía visual
- Estados interactivos (hover, active, disabled)

D. Mejora de UX sin tocar lógica:
- Simplificación visual
- Reducción de ruido
- Mejora de legibilidad
- Feedback visual al usuario

E. Sistema de tokens (IMPORTANTE) y agregar posibilidad de cambiar a modo oscuro:
Define variables tipo:
- color-primary
- color-background
- spacing-md
- border-radius-sm
- font-size-lg

Pensado para poder implementarlo luego en CSS variables o Tailwind.

F. Benchmark:
Toma como referencia SaaS modernos (ej: Stripe, Linear, Notion, Vercel) y explica qué patrones estás aplicando. Que sea moderno y elegante. Intuitivo y fácil de usar.

G. Plan de implementación progresiva:
- Cómo aplicar esto sin romper lo existente
- Prioridades (qué cambiar primero)
- Quick wins vs cambios estructurales

Restricciones:
- No modificar lógica
- No reestructurar Angular
- No proponer refactors grandes
- Todo debe poder aplicarse como capa de estilos encima

Formato:
Respuesta clara, estructurada y profesional, como documento técnico breve pero accionable.
