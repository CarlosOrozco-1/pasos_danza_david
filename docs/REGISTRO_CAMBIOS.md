# Registro de Cambios e Implementaciones

Este archivo mantiene un registro de todas las modificaciones funcionales y de diseño implementadas en el proyecto.

## 24 de Mayo, 2026

### Mejoras de Diseño (UI/UX)
- **Glassmorphism:** Se aplicó un rediseño general a los módulos de "Enseñanza Bíblica" y "Pasos de Danza". Las tarjetas (`.paso-card`, `.accordion-card`), botones y contenedores ahora utilizan un fondo translúcido con desenfoque (`backdrop-filter: blur`) que se integra con el fondo pastel de la aplicación.
- **Paleta de Colores:** Se cambió la mezcla antigua de colores por una paleta "Púrpura Oscuro Elegante" (`#5b3e90` y `#2d1b54`) para mejorar la legibilidad y contraste de los textos.
- **Iconos y Detalles:** Se modificó el icono de confirmación de expansión (check) a un color verde esmeralda (`#10b981`).

### Nuevas Funcionalidades
- **Tooltips para Versículos Bíblicos:** Se reemplazó el texto bíblico estático en las tarjetas de enseñanza por un sistema de *Tooltips*. Ahora solo se muestra la cita bíblica en forma de etiqueta, y al posicionar el cursor sobre ella, aparece una ventana flotante con el texto completo del versículo.
  - *Fix:* Se removió la propiedad `overflow: hidden` de `.accordion-card` para permitir que el tooltip se despliegue y se vea completamente sin recortarse.

### Correcciones de Errores
- **Error de Conexión a Firebase:** Se detectó y documentó el problema de permisos insuficientes (`Missing or insufficient permissions`). Se resolvieron aplicando reglas de seguridad de lectura/escritura pública en Firestore Console (ver detalle en `docs/errores_y_soluciones/01-firebase-missing-permissions.md`).
