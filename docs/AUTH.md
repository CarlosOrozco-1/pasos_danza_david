# 🔐 Autenticación y Control de Acceso - Pasos de Danza

## Sistema de Autenticación

El sistema divide los usuarios en dos roles:
- **👨‍💼 Admin**: Puede crear, editar y eliminar pasos
- **👥 Público**: Solo puede visualizar los pasos y reproducir videos

---

## 🔑 Credenciales Admin

Para acceder como **administrador**, usa:

```
Usuario: admin
Contraseña: pasos2026
```

### Cómo Iniciar Sesión

#### Opción 1: Modal de Login (Recomendado)
```javascript
// Abre un modal para ingresar credenciales
abrirLoginModal();
```

#### Opción 2: Manualmente (Consola)
```javascript
// En la consola del navegador (F12)
login('admin', 'pasos2026');
location.reload();
```

---

## 📋 Archivos de Autenticación

### 1. **auth.js**
Contiene toda la lógica de autenticación:

```javascript
// Verificar si usuario es admin
esAdmin() // Returns: true/false

// Obtener info del usuario actual
obtenerUsuarioActual() // Returns: { isAdmin: true, usuario: 'admin' }

// Login
login(usuario, contrasena) // Returns: true/false

// Logout
logout()

// Actualizar visibilidad de botones
actualizarVisibilidadBotones()
```

### 2. **Integración en index.html**

```html
<!-- Botón de Logout (solo visible si es admin) -->
<button id="btn-logout">Cerrar Sesión</button>

<!-- Info del usuario actual -->
<span id="user-info" class="user-info">
  Modo: <strong id="user-name">Admin</strong>
</span>
```

### 3. **Integración en app.js**

```javascript
// Proteger función: Solo admin puede agregar
function openModal() {
  if (!esAdmin()) {
    alert('Solo administradores pueden agregar pasos');
    return;
  }
  // ... resto del código
}

// Proteger función: Solo admin puede editar
function openEditModal(pasoId) {
  if (!esAdmin()) {
    alert('Solo administradores pueden editar pasos');
    return;
  }
  // ... resto del código
}

// Proteger función: Solo admin puede eliminar
function deletePaso(pasoId) {
  if (!esAdmin()) {
    alert('Solo administradores pueden eliminar pasos');
    return;
  }
  // ... resto del código
}
```

---

## 👨‍💼 Funcionalidades de Admin

Cuando estés logueado como admin, verás:

✅ Botón **+ Agregar Paso** (visible)
✅ Botones **✏️ Editar** en cada paso
✅ Botones **🗑️ Eliminar** en cada paso
✅ Indicador **"Modo: Admin"** en el header
✅ Botón **"Cerrar Sesión"** en el header

## 👥 Funcionalidades de Público

Si no estás logueado, verás:

✅ Lista de pasos
✅ Click en pasos para ver videos (lightbox)
❌ Botón "Agregar Paso" (oculto)
❌ Botones "Editar" (ocultos)
❌ Botones "Eliminar" (ocultos)

---

## ⚙️ Configuración

### Cambiar Credenciales

Edit `auth.js`:

```javascript
const ADMIN_CREDENTIALS = {
  usuario: 'tu-usuario',
  contrasena: 'tu-contrasena'
};
```

### Usar Firebase Authentication (Futuro)

Para usar Firebase Auth en lugar de credenciales quemadas:

```javascript
// En index.html, agregar:
<script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js"></script>

// En auth.js, reemplazar login() con Firebase Auth
firebase.auth().signInWithEmailAndPassword(email, password)
  .then(result => {
    sessionStorage.setItem('auth', JSON.stringify({
      isAdmin: true,
      usuario: email
    }));
  })
```

---

## 🔒 Almacenamiento de Sesión

La autenticación usa `sessionStorage`:

```javascript
// Estructura guardada
{
  "isAdmin": true,
  "usuario": "admin"
}
```

**Nota**: La sesión se pierde al cerrar el navegador (más seguro para MVP)

Para persistencia entre recargas, cambiar a `localStorage`:

```javascript
// En auth.js
sessionStorage.setItem('auth', JSON.stringify(auth));
// → localStorage.setItem('auth', JSON.stringify(auth));
```

---

## 🎯 Flujo de Usuario

### Usuario Público
```
1. Abre index.html
2. Ve lista de pasos
3. Click en paso → abre video en lightbox
4. No puede editar ni eliminar ❌
```

### Usuario Admin
```
1. Abre index.html
2. Hace login (admin/pasos2026)
3. Ve lista de pasos + botones de admin ✏️ 🗑️
4. Puede:
   - Agregar nuevo paso
   - Editar paso existente
   - Eliminar paso
5. Cierra sesión
```

---

## 🐛 Testing

### Test: Login Correcto
```javascript
login('admin', 'pasos2026') // true
esAdmin() // true
```

### Test: Login Incorrecto
```javascript
login('admin', 'contraseña-mal') // false
esAdmin() // false
```

### Test: Ver Info del Usuario
```javascript
obtenerUsuarioActual()
// { isAdmin: true, usuario: 'admin' }
```

### Test: Logout
```javascript
logout()
obtenerUsuarioActual() // null
esAdmin() // false
```

---

## 📝 Próximos Pasos

- [ ] Crear página de login dedicada (`login.html`)
- [ ] Integrar Firebase Authentication
- [ ] Agregar recuperación de contraseña
- [ ] Agregar creación de usuarios
- [ ] Guardar logs de cambios (quién editó, cuándo)

---

## 🔗 Enlaces Relacionados

- [GIT_BRANCHES.md](docs/GIT_BRANCHES.md) - Estrategia de ramas
- [FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md) - Configuración Firebase
- [AGENTS.md](AGENTS.md) - Guía de desarrollo

---

**Última actualización**: Abril 2026
