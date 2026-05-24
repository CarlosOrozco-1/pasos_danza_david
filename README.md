# 🎭 Proyecto: Pasos de Danza

## Descripción

Aplicación web interactiva para gestionar un listado de pasos de danza. **v2.0.0** incluye:

- 🔐 **Sistema de autenticación** para administradores
- 👨‍💼 **Módulo admin** para crear, editar y eliminar pasos
- 👥 **Módulo público** para visualizar pasos y videos
- 🎥 **Lightbox responsive** para visualizar videos
- ☁️ **Firebase Firestore** para sincronización en tiempo real
- 💾 **Almacenamiento en la nube** (datos persisten en Firebase)

## Características

✨ **Funcionalidades principales:**

### Para Todos (Público)

- 📋 Listado de pasos de danza en cards responsivos
- 🎬 Visualización de videos embebidos de YouTube en lightbox
- 🎨 Diseño moderno con gradientes y animaciones suaves
- 📱 Interfaz responsive para dispositivos móviles

### Para Administradores

- ➕ **Agregar** nuevos pasos mediante modal
- ✏️ **Editar** pasos existentes
- 🗑️ **Eliminar** pasos con confirmación
- 🔐 **Autenticación segura** con inicio/cierre de sesión
- ☁️ **Sincronización en tiempo real** con Firebase

## Acceso

### 👥 Usuario Público (Sin Login)

- Solo ver pasos y videos
- No puede agregar/editar/eliminar

### 👨‍💼 Usuario Admin

**Credenciales:**

- Usuario: `*****`
- Contraseña: `*****`

**Acceso a:**

- Crear, editar y eliminar pasos
- Panel de administración
- Indicador de sesión activa

## Cómo Usar

### 1. **Acceder como Público**

- Abre `index.html` en tu navegador
- Verás la lista de pasos disponibles
- Click en cualquier paso para ver el video

### 2. **Acceder como Admin**

- Abre `login.html`
- Ingresa credenciales: `admin` / `pasos2026`
- Serás redirigido a `index.html` en modo admin
- Ahora verás botones de ➕ **Agregar**, ✏️ **Editar**, 🗑️ **Eliminar**

### 3. **Agregar un Paso (Admin)**

- Haz clic en "+ Agregar Paso"
- Completa el formulario con:
  - **Nombre del paso**: Ej: "Basic Step", "Talón-Punta"
  - **Código embed**: Obtén de YouTube:
    1.  Abre un video de YouTube
    2.  Click en "Compartir" → "Insertar"
    3.  Copia el código `<iframe>...</iframe>`
- Click en "Guardar"

### 4. **Editar un Paso (Admin)**

- Haz click en ✏️ al lado del paso
- Modifica los datos
- Click en "Guardar"

### 5. **Eliminar un Paso (Admin)**

- Haz click en 🗑️ al lado del paso
- Confirma la eliminación

### 6. **Cerrar Sesión (Admin)**

- Haz click en "Cerrar Sesión" en el header
- Serás desloqueado y volverá a vista pública

## Justificación de Arquitectura

### Stack Tecnológico

```
Frontend:     HTML5 + CSS3 + JavaScript Vanilla
Backend:      Firebase Firestore
Database:     Firestore (NoSQL)
Auth:         Sistema propio (MVP) / Firebase Auth (futuro)
```

**¿Por qué esta estructura?**

- **Escalable**: Firebase maneja crecimiento automático
- **Tiempo real**: Firestore sync sin consultas manuales
- **Gratuito**: Firebase tiene plan free generoso
- **Seguro**: Datos en la nube con backup automático
- **Portable**: Funciona en cualquier navegador

## Estructura del Código

### Archivos Principales

#### `index.html`

- Página principal con lista de pasos
- Modal para crear/editar
- Lightbox para videos
- Botones dinámicos (solo admin)

#### `auth.js`

- Sistema de autenticación
- Gestión de sesión
- Control de permisos
- Mostrar/ocultar botones

#### `login.html`

- Página de login para admin
- Formulario con validación
- Redirección automática

#### `app.js`

**Funciones principales:**

- `initRenderPasos()` - Sincroniza con Firestore
- `renderPasos()` - Renderiza cards de pasos
- `openLightbox(pasoId)` - Abre video en overlay
- `openModal()` / `openEditModal()` - Control de formulario
- `deletePaso(pasoId)` - Elimina paso con confirmación
- Validación de permisos en cada función CRUD

#### `styles.css`

- Gradientes modernos (rojo-rosa)
- Grid responsive
- Lightbox con animaciones
- Modal styling
- Header flexible

## Estructura de Datos (Firestore)

```json
// Collection: pasos-danza
{
  "id": "doc-id-12345",
  "nombre": "Basic Step",
  "embedCode": "<iframe ...></iframe>",
  "fecha": "2026-04-17T10:30:00Z",
  "fechaActualizacion": "2026-04-17T12:00:00Z"
}
```

## Documentación Completa

📖 **Consulta estos archivos para más información:**

- **[CHANGELOG.md](CHANGELOG.md)** - Historial de versiones
- **[docs/AUTH.md](docs/AUTH.md)** - Sistema de autenticación
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Arquitectura de módulos
- **[docs/GIT_BRANCHES.md](docs/GIT_BRANCHES.md)** - Estrategia Git
- **[docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md)** - Firebase config
- **[AGENTS.md](AGENTS.md)** - Guía de desarrollo

## Mejoras Futuras

### Phase 1: Seguridad

- [ ] Migrar a localStorage (persistencia)
- [ ] Validación más fuerte de contraseñas
- [ ] Recuperación de contraseña

### Phase 2: Backend

- [ ] Servidor Node.js + Express
- [ ] Validación de permisos en servidor
- [ ] Hashing de contraseñas (bcrypt)

### Phase 3: Firebase Auth

- [ ] Firebase Authentication
- [ ] Creación de cuentas admin
- [ ] MFA (dos factores)

### Phase 4: Auditoría

- [ ] Logs de cambios
- [ ] Historial de ediciones
- [ ] Notificaciones de cambios

## Contribuciones

Para modificar o ampliar el proyecto:

1. Consulta **[AGENTS.md](AGENTS.md)** para instrucciones
2. Crea rama en `desa` (ver [docs/GIT_BRANCHES.md](docs/GIT_BRANCHES.md))
3. Realiza cambios
4. Merge a `pro` para producción

## Licencia

Libre para uso y modificación

---

**Versión Actual:** v2.0.0 (2026-04-17)
**Última Actualización:** Admin & Authentication System
