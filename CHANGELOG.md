# 📋 CHANGELOG - Pasos de Danza

## [v2.0.0] - 2026-04-17 - ADMIN & AUTHENTICATION

### ✨ Nuevas Características

#### 🔐 Sistema de Autenticación
- Implementado sistema de login/logout con credenciales (admin / pasos2026)
- Almacenamiento de sesión en `sessionStorage`
- Funciones de autenticación en `auth.js`:
  - `esAdmin()` - Verificar si usuario es admin
  - `obtenerUsuarioActual()` - Obtener info del usuario
  - `login(usuario, contrasena)` - Iniciar sesión
  - `logout()` - Cerrar sesión
  - `actualizarVisibilidadBotones()` - Mostrar/ocultar botones según permisos

#### 👨‍💼 Módulo de Administrador
- Nueva página `login.html` con formulario de autenticación
- Protección de funciones: solo admin puede:
  - ✏️ Crear nuevos pasos
  - ✏️ Editar pasos existentes
  - 🗑️ Eliminar pasos
- Indicador visual "Modo: Admin" en el header
- Botón "Cerrar Sesión" en el header (solo visible si es admin)

#### 👥 Módulo Público (Lectura)
- Vista pública permite:
  - ✅ Ver lista de pasos
  - ✅ Reproducir videos en lightbox
  - ❌ Ver botones ocultos de edición/eliminación
  - ❌ No puede acceder a funciones de administración

#### 🎨 Mejoras de UI/UX
- Actualización del header con estructura flexible:
  - Sección izquierda: Logo + indicador de usuario
  - Sección derecha: Botones de acción
- Nuevo indicador `.user-info` con estilos visuales
- Responsive design mejorado en header para móviles

### 🛠️ Cambios en Archivos Existentes

#### **index.html**
```diff
- <button id="btn-agregar" class="btn-primary">+ Agregar Paso</button>
+ <button id="btn-agregar-paso" class="btn-primary">+ Agregar Paso</button>
+ <button id="btn-logout" class="btn-secondary">Cerrar Sesión</button>
+ <span id="user-info" class="user-info">Modo: <strong id="user-name">Admin</strong></span>
```

- Actualización de estructura del header
- ID renombrado: `btn-agregar` → `btn-agregar-paso`
- Agregado script `auth.js`
- Agregados botones de logout e indicador de usuario

#### **app.js**
```javascript
// Nuevas protecciones
function openModal() {
  if (!esAdmin()) { alert('Solo administradores...'); return; }
  // ... código
}

function openEditModal(pasoId) {
  if (!esAdmin()) { alert('Solo administradores...'); return; }
  // ... código
}

function deletePaso(pasoId) {
  if (!esAdmin()) { alert('Solo administradores...'); return; }
  // ... código
}
```

- Protección de funciones CRUD para admin-only
- Event listener actualizado: `btn-agregar-paso` en lugar de `btn-agregar`
- Nuevo event listener para logout
- Actualización de `renderPasos()` para llamar a `actualizarVisibilidadBotones()`
- Inicialización mejorada en `window.addEventListener('load')`

#### **styles.css**
```css
/* Nuevos estilos */
.header-left { display: flex; gap: 20px; }
.header-right { display: flex; gap: 10px; }
.user-info {
  font-size: 0.95rem;
  color: #ffaa00;
  padding: 8px 12px;
  background: rgba(255, 170, 0, 0.1);
  border-left: 3px solid #ffaa00;
}
```

- Estructura del header mejorada con flexbox
- Nuevas clases `.header-left` y `.header-right`
- Nuevo estilo `.user-info` con indicador visual

### 📁 Nuevos Archivos

```
/
├── auth.js                           ← Nuevo: Lógica de autenticación
├── login.html                        ← Nuevo: Página de login
│
└── docs/
    ├── AUTH.md                       ← Nuevo: Guía de autenticación
    ├── ARCHITECTURE.md               ← Nuevo: Arquitectura módulos
    └── GIT_BRANCHES.md               ← Nuevo: Estrategia Git
```

### 📚 Documentación Nueva

#### **auth.js** (112 líneas)
Sistema completo de autenticación:
- Gestión de credenciales
- Control de sesión
- Verificación de permisos
- Actualización dinámica de UI

#### **login.html** (234 líneas)
Página de login con:
- Formulario responsive
- Validación de credenciales
- Mensajes de error/éxito
- Redirección automática
- Información de demo

#### **docs/AUTH.md**
Guía completa de autenticación:
- Cómo usar el sistema
- Credenciales de demo
- Configuración
- Testing
- Próximas mejoras

#### **docs/ARCHITECTURE.md**
Documentación de arquitectura:
- Diagrama de módulos
- Flujos de acceso
- Archivos clave
- Limitaciones actuales
- Roadmap de mejoras

#### **docs/GIT_BRANCHES.md**
Guía de Git workflow:
- Estructura de ramas (desa, pro)
- Comandos útiles
- Convenciones de commits

### 🔧 Cambios Técnicos

#### Protección de Funciones
Cada función CRUD ahora valida:
```javascript
if (!esAdmin()) {
  alert('Solo administradores pueden [ACCIÓN]');
  return;
}
```

#### Actualización de Visibilidad
```javascript
actualizarVisibilidadBotones() {
  document.querySelectorAll('.paso-actions').forEach(actions => {
    actions.style.display = esAdmin() ? 'flex' : 'none';
  });
  // ... más botones
}
```

#### Almacenamiento de Sesión
```javascript
// Login exitoso
sessionStorage.setItem('auth', JSON.stringify({
  isAdmin: true,
  usuario: 'admin'
}));
```

### 🎯 Funcionalidades Bloqueadas para No-Admin

```javascript
// Protegidas por esAdmin()
- openModal()        // Agregar paso
- openEditModal()    // Editar paso
- deletePaso()       // Eliminar paso
```

### 🔒 Almacenamiento

**sessionStorage**:
```json
{
  "auth": "{\"isAdmin\":true,\"usuario\":\"admin\"}"
}
```

Ventajas:
- ✅ Se limpia al cerrar navegador
- ✅ No persiste entre sesiones
- ❌ Hay que reloguear después de recargar

### 📊 Estadísticas

| Item | Antes | Después | Cambio |
|------|-------|---------|--------|
| Archivos HTML | 1 | 2 | +1 |
| Archivos JS | 1 | 2 | +1 |
| Líneas app.js | ~160 | ~200 | +40 |
| Líneas index.html | ~80 | ~90 | +10 |
| Docs | 4 | 7 | +3 |

### 🐛 Bugs Corregidos

- ✅ Botones edit/delete visibles para usuarios públicos (ahora oculto)
- ✅ Sin protección en operaciones CRUD (ahora verifican esAdmin)
- ✅ Usuario no sabía si era admin (ahora hay indicador visual)

### ⚠️ Limitaciones Conocidas (MVP)

1. **Credenciales quemadas**: Usuario/contraseña en código
2. **No hay persistencia de sesión**: Se pierde al cerrar navegador
3. **Sin validación servidor**: No hay backend verificando permisos
4. **Sin logs**: No hay registro de quién hizo cambios

### 🚀 Próximos Pasos

- [ ] Migrar a localStorage (persistencia de sesión)
- [ ] Implementar Firebase Authentication
- [ ] Backend con Node.js + Express
- [ ] Reglas de seguridad en Firestore
- [ ] Sistema de auditoría (logs de cambios)
- [ ] Recuperación de contraseña

### 🔗 Enlaces Relacionados

- [AUTH.md](docs/AUTH.md) - Detalles de autenticación
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Arquitectura de módulos
- [GIT_BRANCHES.md](docs/GIT_BRANCHES.md) - Estrategia Git
- [FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md) - Firebase (versión anterior)

### 👤 Usuario & Credenciales

```
👨‍💼 Admin
Usuario: admin
Contraseña: pasos2026

👥 Público
(Sin login necesario)
```

---

## [v1.2.0] - 2026-04-17 - TEXTAREA SIZE FIX

### 🎨 UI Improvements
- Reducido min-height de textarea de 80px → 60px
- Reducido max-height de textarea de 120px → 80px
- Motivo: Prevenir que la vista previa del código de YouTube hace muy grande el modal

---

## [v1.1.0] - 2026-04-15 - CRUD OPERATIONS

### ✨ Nuevas Características
- Implementado CRUD completo:
  - **C**reate: Agregar nuevos pasos
  - **R**ead: Listar pasos en tiempo real
  - **U**pdate: Editar pasos existentes
  - **D**elete: Eliminar pasos con confirmación

- Modal reutilizable para create/edit
- Event listeners para form submission
- Validación de datos antes de guardar

### 🛠️ Cambios
- Agregados botones ✏️ (edit) y 🗑️ (delete) en cada paso-card
- Variable `pasoEnEdicion` para tracking
- Funciones `openEditModal()` y `deletePaso()`

---

## [v1.0.0] - 2026-04-10 - FIREBASE INTEGRATION

### ✨ Principales Características
- **Lightbox**: Visualización de videos en overlay responsive
- **Firebase Firestore**: Sincronización en tiempo real
- **Real-time Updates**: OnSnapshot listener para cambios automáticos
- **YouTube Embed Cleaning**: Regex para remover width/height
- **Responsive Design**: Mobile-first con CSS Grid
- **Modal Form**: Crear y editar pasos

### 📁 Estructura
```
pasos-de-danza/
├── index.html
├── app.js
├── styles.css
├── docs/
│   ├── README.md
│   ├── AGENTS.md
│   ├── CHANGELOG.md
│   ├── FIREBASE_SETUP.md
│   └── FIREBASE_IMPLEMENTATION.md
```

### 🔧 Configuración Firebase
- Project ID: pasos-de-danza
- Database: Firestore
- Collection: pasos-danza
- SDK v8.10.0

---

## Version History Summary

| Version | Fecha | Enfoque |
|---------|-------|---------|
| v2.0.0 | 2026-04-17 | Autenticación y Control de Acceso |
| v1.2.0 | 2026-04-17 | UI Refinement (Textarea size) |
| v1.1.0 | 2026-04-15 | Full CRUD Operations |
| v1.0.0 | 2026-04-10 | Firebase + Lightbox |

---

**Última actualización**: 2026-04-17 (v2.0.0)
