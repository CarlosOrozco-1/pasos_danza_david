# 🛠️ AGENTS.md - Guía de Desarrollo

Instrucciones para trabajar con los archivos del proyecto Pasos de Danza.

---

## 📄 HTML (index.html)

### Responsabilidades
- Estructura semántica del documento
- Contenedores principales
- Elementos de formulario
- Enlaces a CSS y JS

### Guía para Modificaciones

#### ✅ DO - Lo que deberías hacer

1. **Agregar nuevos elementos HTML**
   ```html
   <!-- Bien: estructura clara y semántica -->
   <section id="filtros" class="filtros">
     <input type="search" placeholder="Buscar paso...">
   </section>
   ```

2. **Mantener estructura organizada**
   - Usar `id` para elementos únicos que JS va a manipular
   - Usar `class` para estilos repetibles
   - Agrupar elementos relacionados en `div` o `section`

3. **Comentarios en HTML**
   ```html
   <!-- Modal para agregar nuevo paso -->
   <div id="modal" class="modal hidden">
     ...
   </div>
   ```

4. **Atributos importante**
   - `required` en inputs del formulario
   - `placeholder` para darle contexto al usuario
   - `aria-label` o `alt` para accesibilidad

#### ❌ DON'T - Evita hacer esto

1. **No añadas estilos inline**
   ```html
   <!-- ❌ Mal -->
   <div style="color: red; font-size: 20px;">Mal</div>
   
   <!-- ✅ Bien -->
   <div class="error-message">Bien</div>
   ```

2. **No hagas lógica en atributos**
   ```html
   <!-- ❌ Mal -->
   <button onclick="if(x>5) doSomething();">Click</button>
   
   <!-- ✅ Bien -->
   <button id="btn-action" class="btn-primary">Click</button>
   ```

3. **No hagas cambios al script o links sin actualizar app.js**

### Checklist para Cambios en HTML
- [ ] IDs únicos y descriptivos
- [ ] Classes de estilos consistentes
- [ ] Elementos agrupados lógicamente
- [ ] Imports de CSS/JS al final de `</head>` o antes de `</body>`
- [ ] Textos con `placeholder` y `aria-label` donde sea necesario

---

## 🎨 CSS (styles.css)

### Responsabilidades
- Estilos visuales y tema
- Diseño responsive
- Animaciones y transiciones
- Paleta de colores

### Guía para Modificaciones

#### ✅ DO - Lo que deberías hacer

1. **Usar CSS Variables para colores**
   ```css
   :root {
     --color-primary: #e94560;
     --color-primary-light: #ff6b6b;
     --color-bg-dark: #1a1a2e;
     --color-border: rgba(255,255,255,0.1);
   }
   
   .btn-primary {
     background: var(--color-primary);
   }
   ```

2. **Crear clases reutilizables**
   ```css
   /* Bien: utility class */
   .card {
     background: rgba(255,255,255,0.05);
     border-radius: 16px;
     padding: 20px;
     border: 1px solid var(--color-border);
   }
   
   /* Variante específica */
   .paso-card {
     @extend .card; /* o repetir propiedades */
   }
   ```

3. **Responsive design con mobile-first**
   ```css
   /* Mobile por defecto */
   .lista-pasos {
     grid-template-columns: 1fr;
   }
   
   /* Tablet y desktop */
   @media (min-width: 768px) {
     .lista-pasos {
       grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
     }
   }
   ```

4. **Animaciones suaves**
   ```css
   .paso-card {
     transition: transform 0.3s ease, box-shadow 0.3s ease;
   }
   
   .paso-card:hover {
     transform: translateY(-5px);
   }
   ```

#### ❌ DON'T - Evita hacer esto

1. **No uses !important**
   ```css
   /* ❌ Mal */
   .btn { color: blue !important; }
   
   /* ✅ Bien */
   .btn { color: blue; }
   ```

2. **No hardcodees colores**
   ```css
   /* ❌ Mal */
   .btn { background: #e94560; }
   
   /* ✅ Bien */
   .btn { background: var(--color-primary); }
   ```

3. **No confíes solo en hover (móviles)**
   ```css
   /* ❌ Incompleto */
   .video-container:hover { display: block; }
   
   /* ✅ Mejor */
   .video-container.active { display: block; }
   ```

4. **No uses width/height fijos en texto**
   ```css
   /* ❌ Mal (video se corta) */
   .video-container iframe {
     width: 560px;
     height: 315px;
   }
   
   /* ✅ Bien (responsive) */
   .video-container {
     position: relative;
     width: 100%;
     padding-bottom: 56.25%; /* 16:9 */
   }
   .video-container iframe {
     position: absolute;
     width: 100%;
     height: 100%;
   }
   ```

### Checklist para Cambios en CSS
- [ ] Colores en variables CSS
- [ ] Nombres de clases descriptivos
- [ ] Responsive con `@media` queries
- [ ] Hover/focus states apropiados
- [ ] Transiciones fluidas
- [ ] Sin !important
- [ ] Consistencia con paleta existente

---

## 💻 JavaScript (app.js)

### Responsabilidades
- Manipulación del DOM
- Gestión de estado con localStorage
- Manejo de eventos
- Lógica de la aplicación

### Guía para Modificaciones

#### ✅ DO - Lo que deberías hacer

1. **Funciones con responsabilidad única**
   ```javascript
   // ✅ Bien: cada función hace una cosa
   function getPasos() { /* obtiene datos */ }
   function savePasos(pasos) { /* guarda datos */ }
   function renderPasos() { /* actualiza DOM */ }
   
   // ❌ Mal: función hace muchas cosas
   function doEverything() { 
     // obtiene datos
     // valida
     // guarda
     // renderiza
   }
   ```

2. **Validación de datos antes de guardar**
   ```javascript
   function agregarPaso(nombre, embedCode) {
     // Validar
     if (!nombre || !embedCode) {
       alert('Completa todos los campos');
       return false;
     }
     
     if (!embedCode.includes('<iframe')) {
       alert('Código embed no válido');
       return false;
     }
     
     // Guardar
     const pasos = getPasos();
     pasos.push({ nombre, embedCode });
     savePasos(pasos);
     return true;
   }
   ```

3. **Escaping de HTML para evitar XSS**
   ```javascript
   // ✅ Bien: escapa el texto
   function escapeHtml(text) {
     const div = document.createElement('div');
     div.textContent = text;
     return div.innerHTML;
   }
   
   // Uso:
   `<h3>${escapeHtml(paso.nombre)}</h3>`
   ```

4. **Usar event delegation para listas dinámicas**
   ```javascript
   // Para múltiples elementos creados dinámicamente
   document.addEventListener('click', function(e) {
     if (e.target.classList.contains('btn-eliminar')) {
       const index = e.target.dataset.index;
       eliminarPaso(index);
     }
   });
   ```

5. **Separar datos de UI**
   ```javascript
   // ✅ Bien: estado separado
   const pasos = getPasos(); // Estado
   renderPasos(pasos); // UI basada en estado
   
   // ❌ Mal: lógica mezclada
   const html = `...`;
   document.innerHTML = html;
   ```

#### ❌ DON'T - Evita hacer esto

1. **No hagas consultas al DOM repetidas**
   ```javascript
   // ❌ Mal: busca el elemento 3 veces
   document.getElementById('lista').innerHTML = '';
   document.getElementById('lista').innerHTML += html1;
   document.getElementById('lista').innerHTML += html2;
   
   // ✅ Bien: una sola vez
   const container = document.getElementById('lista');
   container.innerHTML = html1 + html2;
   ```

2. **No uses global scope innecesariamente**
   ```javascript
   // ❌ Mal
   window.miUsuario = { nombre: 'Juan' };
   
   // ✅ Bien
   const usuarios = { miUsuario: { nombre: 'Juan' } };
   ```

3. **No debuguees con console.log en producción**
   ```javascript
   // ❌ Mal
   console.log('Paso agregado:', paso);
   console.log('Storage:', localStorage);
   
   // ✅ Mejor: solo durante desarrollo
   if (DEBUG) console.log('Paso:', paso);
   ```

4. **No manipules HTML como string**
   ```javascript
   // ❌ Mal: vulnerable a XSS
   container.innerHTML = '<p>' + userInput + '</p>';
   
   // ✅ Bien: usa textContent o métodos seguros
   const p = document.createElement('p');
   p.textContent = userInput;
   container.appendChild(p);
   ```

5. **No uses localStorage sin try/catch**
   ```javascript
   // ❌ Mal: puede fallar
   const data = JSON.parse(localStorage.getItem('key'));
   
   // ✅ Bien: maneja errores
   try {
     const data = JSON.parse(localStorage.getItem('key')) || [];
   } catch (e) {
     console.error('Error al leer localStorage');
     const data = [];
   }
   ```

### Funciones Importantes del Proyecto

| Función | Propósito | Entrada | Salida |
|---------|-----------|---------|--------|
| `getPasos()` | Obtiene lista de pasos | - | `Array[]` |
| `savePasos(pasos)` | Guarda en localStorage | `Array` | - |
| `renderPasos()` | Actualiza DOM | - | - |
| `toggleVideo(index)` | Muestra/oculta video | `Number` | `Boolean` |
| `escapeHtml(text)` | Sanitiza HTML | `String` | `String` |
| `openModal()` | Abre formulario | - | - |
| `closeModal()` | Cierra formulario | - | - |

### Checklist para Cambios en JS
- [ ] El código hace una cosa bien
- [ ] Nombre de función describe qué hace
- [ ] Validación de datos de entrada
- [ ] Manejo de errores con try/catch
- [ ] Sin lógica en HTML (onclick, etc)
- [ ] localStorage protegido con try/catch
- [ ] HTML escapado para seguridad
- [ ] Sin variables globales innecesarias

---

## 🔄 Flujo de Trabajo Recomendado

### Agregar una Nueva Característica

1. **Empieza por HTML** (`index.html`)
   - Define nuevos elementos

2. **Luego CSS** (`styles.css`)
   - Estiliza los elementos

3. **Finalmente JavaScript** (`app.js`)
   - Añade funcionalidad
   - Interactúa con los nuevos elementos

### Ejemplo: Agregar Eliminar Pasos

**1️⃣ HTML**: Agregar botón
```html
<button class="btn-eliminar" data-index="${index}">🗑️</button>
```

**2️⃣ CSS**: Estilizar botón
```css
.btn-eliminar {
  background: #ff6b6b;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
```

**3️⃣ JavaScript**: Agregar función
```javascript
function eliminarPaso(index) {
  const pasos = getPasos();
  pasos.splice(index, 1);
  savePasos(pasos);
  renderPasos();
}

// Event listener
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('btn-eliminar')) {
    eliminarPaso(parseInt(e.target.dataset.index));
  }
});
```

---

## 📋 Configuraciones Útiles

### Estructura de un Nuevo Modal
```javascript
function abrirModal(tipo) {
  const modal = document.getElementById('modal-' + tipo);
  modal.classList.remove('hidden');
}

function cerrarModal(tipo) {
  const modal = document.getElementById('modal-' + tipo);
  modal.classList.add('hidden');
}
```

### Patrón para Renderizar Listas
```javascript
function render(items) {
  const html = items.map((item, i) => `
    <div class="item" data-id="${i}">
      <h3>${escapeHtml(item.nombre)}</h3>
    </div>
  `).join('');
  
  document.getElementById('container').innerHTML = html;
}
```

### Patrón para Validación
```javascript
const validators = {
  isNombreValido: (nombre) => nombre.trim().length > 0,
  isCodeValido: (code) => code.includes('<iframe'),
  isURL: (url) => /^https?:\/\//.test(url)
};

function validar(datos) {
  if (!validators.isNombreValido(datos.nombre)) {
    throw new Error('Nombre inválido');
  }
  // más validaciones...
}
```

---

## 🐛 Debug y Testing

### Console Statements Útiles
```javascript
// Ver qué hay en localStorage
console.table(getPasos());

// Limpiar localStorage
localStorage.clear();

// Ver un elemento específico
console.log(document.getElementById('modal'));
```

### Testing Manual
- [ ] Agregar paso con nombre vacío → debe fallar
- [ ] Agregar paso sin código embed → debe fallar
- [ ] Agregar paso válido → debe guardarse
- [ ] Cerrar/abrir navegador → datos persisten
- [ ] Click en paso → video se abre/cierra
- [ ] Responsive en móvil/tablet/desktop

---

## 📚 Recursos Útiles

- **MDN Web Docs**: https://developer.mozilla.org
- **localStorage API**: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- **DOM Manipulation**: https://developer.mozilla.org/en-US/docs/Web/API/Document
- **CSS Grid**: https://css-tricks.com/snippets/css/complete-guide-grid/
- **Responsive Design**: https://web.dev/responsive-web-design-basics/

---

## ✅ Antes de Hacer Commit

1. **HTML**: Estructura clara, sin estilos inline
2. **CSS**: Variables de colores, responsive, sin !important
3. **JS**: Funciones puras, sin globals, datos validados
4. **Testing**: Prueba en movil/tablet/desktop
5. **Performance**: localStorage funciona rápido
6. **Seguridad**: HTML escapado, sin eval()

---

**Última actualización**: Abril 2026
