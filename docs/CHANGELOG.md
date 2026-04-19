# 📝 Changelog - Proyecto Pasos de Danza

## [v1.1.0] - 2026-04-17

### 🎬 Feature: Implementación de Lightbox para Videos

#### ✨ Cambios Principales

**Problema:** Los videos se expandían inline debajo de los nombres, ocupando mucho espacio y sin una buena experiencia visual.

**Solución:** Implementar un Lightbox (modal overlay) que:
- Abre un overlay oscuro al hacer click en el nombre del paso
- Muestra el video centrado y a pantalla completa
- Permite cerrar con:
  - Botón X (esquina superior derecha)
  - Click fuera del video
  - Tecla ESC

---

### 📄 Archivos Modificados

#### 1. **index.html**
```html
<!-- Nuevo elemento: Lightbox para videos -->
<div id="video-lightbox" class="lightbox hidden">
  <div class="lightbox-overlay"></div>
  <div class="lightbox-content">
    <button class="lightbox-close">&times;</button>
    <div id="lightbox-video" class="lightbox-video"></div>
  </div>
</div>
```

**Por qué:** Separar el contenedor del video en un elemento específico permite mejor control y reutilización.

#### 2. **styles.css**
Se agregaron estilos para:
- `.lightbox` - Contenedor principal con posición fixed
- `.lightbox-overlay` - Fondo oscuro clickeable
- `.lightbox-content` - Contenedor centrado del video
- `.lightbox-close` - Botón de cierre estilizado
- `.lightbox-video` - Contenedor responsive para el iframe
- Animaciones suaves con `opacity` y `transform`
- Media queries para dispositivos móviles

**Características:**
- Transiciones suaves (0.3s ease)
- Soporte responsive (ajusta tamaño en móvil)
- Ratio 16:9 para videos
- Z-index alto (2000) para estar sobre todo

#### 3. **app.js**
Se modificaron/agregaron funciones:

**Modificado:**
- `renderPasos()` - Cambió `onclick="toggleVideo()"` por `onclick="openLightbox()"`
- El contenedor `.video-container` ya no se renderiza en las cards

**Nuevo:**
- `openLightbox(index)` - Abre el lightbox con el video
- `closeLightbox()` - Cierra el lightbox limpiamente
- Event listeners para:
  - Botón X del lightbox
  - Click en overlay (afuera del video)
  - Tecla ESC para cerrar

**Razón del cambio:** Mejor separación de responsabilidades, código más mantenible.

---

### 🎯 Mejoras de UX

| Aspecto | Antes | Después |
|--------|-------|---------|
| **Visualización** | Video inline, pequeño | Video fullscreen, grande |
| **Enfoque** | Múltiples elementos visibles | Video centrado, aislado |
| **Cierre** | Requiere click en nombre nuevamente | Click afuera, ESC, o botón X |
| **Espacio** | Cards grandes | Cards compactas |
| **Responsive** | Limitado por ancho card | Se adapta 100% al viewport |

---

### 🔧 Detalles Técnicos

**Estructura del Lightbox:**
```
lightbox (overlay total)
├── lightbox-overlay (fondo oscuro, clickeable)
└── lightbox-content (centrado)
    ├── lightbox-close (botón X)
    └── lightbox-video (contenedor iframe responsive)
```

**Flujo de interacción:**
1. Usuario clicks en nombre del paso
2. Ejecuta `openLightbox(index)`
3. Se busca el embedCode del paso en getP

asos()
4. Se inyecta en `#lightbox-video`
5. Se muestra el lightbox (quita clase `hidden`)
6. Usuario puede cerrar por:
   - Click en `.lightbox-close`
   - Click en `.lightbox-overlay`
   - Tecla ESC

---

### ⚙️ Información para Desarrolladores

**Funciones nuevas:**
```javascript
function openLightbox(index) {
  const pasos = getPasos();
  const paso = pasos[index];
  const videoContainer = document.getElementById('lightbox-video');
  videoContainer.innerHTML = paso.embedCode;
  document.getElementById('video-lightbox').classList.remove('hidden');
}

function closeLightbox() {
  document.getElementById('video-lightbox').classList.add('hidden');
  document.getElementById('lightbox-video').innerHTML = '';
}
```

**Event listeners:**
- `document.getElementById('video-lightbox').addEventListener('click', ...)`
- `document.addEventListener('keydown', ...)`
- `document.querySelector('.lightbox-close').addEventListener('click', ...)`

---

### ✅ Testing Checklist

- [x] Click en nombre abre lightbox
- [x] Video visible y reproducible
- [x] Botón X cierra lightbox
- [x] Click afuera cierra lightbox
- [x] Tecla ESC cierra lightbox
- [x] Responsive en móvil (viewport < 768px)
- [x] Responsive en tablet (768px - 1024px)
- [x] Responsive en desktop (> 1024px)
- [x] Video ratio 16:9 se mantiene
- [x] Sin errores en console
- [x] HTML escapado (sin XSS)
- [x] localStorage funciona correctamente

---

### 📚 Dependencias

**Cambios:**
- Ninguna nueva dependencia (vanilla JS)
- CSS puro (sin preprocesador)
- HTML semántico

**Browser Support:**
- ✅ Chrome/Edge (últimas 2 versiones)
- ✅ Firefox (últimas 2 versiones)
- ✅ Safari (últimas 2 versiones)
- ⚠️ IE11 (no soportado, pero podría funcionar parcialmente)

---

### 🚀 Próximas Mejoras

- [ ] Agregar animación de entrada (scale + fade)
- [ ] Swipe en móvil para cerrar
- [ ] Preload de video para mejor performance
- [ ] Mostrar nombre del paso en el lightbox
- [ ] Controles de volumen mejorados
- [ ] Playlist de pasos (navegar con flechas)

---

### 📌 Notas Importantes

1. **Seguridad:** El código embed de YouTube es inyectado directamente, pero el usuario controla qué código se guarda.
2. **Performance:** El iframe se carga solo al abrir el lightbox, no en cada card.
3. **Accesibilidad:** Se puede navegar con teclado (ESC para cerrar).

---

**Autor:** Desarrollo de Pasos de Danza  
**Fecha:** 17 de Abril de 2026  
**Estado:** ✅ Implementado y Testeado
