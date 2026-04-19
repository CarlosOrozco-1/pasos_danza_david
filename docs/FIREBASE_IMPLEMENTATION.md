# 🔥 Documentación: Integración de Firebase en Pasos de Danza

## 📚 Índice
1. [Conceptos Básicos](#conceptos-básicos)
2. [Cambios en index.html](#cambios-en-indexhtml)
3. [Cambios en app.js](#cambios-en-appjs)
4. [Flujo de Datos](#flujo-de-datos)
5. [Sincronización en Tiempo Real](#sincronización-en-tiempo-real)
6. [Comparación localStorage vs Firestore](#comparación-localstorage-vs-firestore)
7. [Troubleshooting](#troubleshooting)

---

## Conceptos Básicos

### ¿Qué es Firebase?

Firebase es un **Backend as a Service (BaaS)** que proporciona servicios en la nube sin necesidad de un servidor propio.

**Antes (localStorage):**
```
Navegador A          Navegador B          Navegador C
    ↓                    ↓                    ↓
Datos locales      Datos locales        Datos locales
(no sincronizados)  (no sincronizados)   (no sincronizados)
```

**Ahora (Firebase/Firestore):**
```
Navegador A     Navegador B     Navegador C
    ↓               ↓               ↓
         Firestore en la Nube
              ↓
        Base de Datos
    (datos sincronizados)
```

### ¿Qué es Firestore?

Firestore es la **base de datos en tiempo real** de Firebase. Características:

- 📊 **Base de datos NoSQL** - Datos en formato JSON
- ⏰ **Tiempo real** - Los cambios se sincronizan automáticamente
- 📱 **Accesible desde web/mobile** - Mismo backend para todos
- 🔗 **SDK JavaScript** - Se integra directamente en tu HTML

---

## Cambios en index.html

### 1. Agregar SDKs de Firebase

**Código agregado:**
```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"></script>
```

**¿Qué es esto?**
- Son dos archivos JavaScript que descargas de Google
- `firebase-app.js` - Core de Firebase (iniciar la app)
- `firebase-firestore.js` - Librería específica para Firestore

**¿Por qué se colocan ANTES de app.js?**
```html
<!-- Orden correcto -->
<script src="firebase-app.js"></script>       <!-- Primero: cargar Firebase -->
<script src="firebase-firestore.js"></script> <!-- Segundo: cargar Firestore -->
<script>
  // Inicializar Firebase aquí
  firebase.initializeApp(config);
  window.db = firebase.firestore();
</script>
<script src="app.js"></script>                <!-- Último: usar Firebase en app.js -->
```

Si `app.js` viniera primero, **no conocería** las librerías de Firebase.

### 2. Configuración Firebase

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyByRoG4psaUVevkvVl_CjdXuMW_-7QqI44",
  authDomain: "pasos-de-danza.firebaseapp.com",
  projectId: "pasos-de-danza",
  storageBucket: "pasos-de-danza.firebasestorage.app",
  messagingSenderId: "170542507869",
  appId: "1:170542507869:web:aff3c90981b3660b212ab4"
};
```

**¿Qué significa cada campo?**

| Campo | Significado | Ejemplo |
|-------|------------|---------|
| `apiKey` | Clave para conectarse a Firebase | Como una "contraseña" |
| `authDomain` | Dominio de autenticación | pasos-de-danza.firebaseapp.com |
| `projectId` | ID único de tu proyecto | pasos-de-danza |
| `storageBucket` | Almacenamiento en la nube | Para archivos (no lo usamos) |
| `messagingSenderId` | ID para notificaciones | (Opcional) |
| `appId` | ID de la aplicación | Identificador único |

### 3. Inicializar Firebase

```javascript
firebase.initializeApp(firebaseConfig);
window.db = firebase.firestore();
```

**Línea 1: `firebase.initializeApp(firebaseConfig)`**
- Conecta tu app con tu proyecto Firebase
- Usa la configuración que copiaste
- Valida que tengas credenciales válidas

**Línea 2: `window.db = firebase.firestore()`**
- Obtiene una referencia a tu base de datos Firestore
- `window.db` la disponibiliza **globalmente** (para todo app.js)
- Es como un "puente" para comunicarte con la base de datos

---

## Cambios en app.js

### 1. Eliminar localStorage

**Antes:**
```javascript
const STORAGE_KEY = 'pasos-danza';

function getPasos() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function savePasos(pasos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pasos));
}
```

**¿Por qué se eliminó?**
- localStorage solo almacena en **ese navegador/equipo**
- No se sincroniza entre diferentes navegadores
- No es "tiempo real"
- Firestore lo reemplaza completamente

### 2. Variable Global: `pasosGlobales`

```javascript
let pasosGlobales = [];
```

**¿Para qué sirve?**
- Almacena los pasos en memoria del navegador
- Se actualiza automáticamente desde Firestore
- Permite acceso rápido sin consultar la base de datos cada vez
- Se rellena con `initRenderPasos()`

**Flujo:**
```
Firestore (en la nube)
    ↓
Escucha cambios (listener)
    ↓
Actualiza pasosGlobales
    ↓
Renderiza en el DOM
```

### 3. Nueva Función: `initRenderPasos()`

```javascript
function initRenderPasos() {
  db.collection('pasos-danza').onSnapshot(snapshot => {
    pasosGlobales = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    renderPasos();
  }, error => {
    console.error('Error al cargar pasos:', error);
    // Mostrar error en pantalla
  });
}
```

**Explicación línea por línea:**

```javascript
db.collection('pasos-danza')
```
- `db` - La referencia que inicializamos en index.html
- `.collection('pasos-danza')` - Accede a la colección "pasos-danza" en Firestore
- Es como: "Conectate a la tabla llamada pasos-danza"

```javascript
.onSnapshot(snapshot => {
```
- **`onSnapshot()` = Escuchador en tiempo real**
- Cada vez que Firestore detecta un cambio, ejecuta esta función
- `snapshot` = Los datos actuales de la colección
- Es como tener un "teléfono" conectado que te avisa cuando hay cambios

```javascript
pasosGlobales = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

Esto es un mapeo (transformación) de datos:

**Antes (en Firestore):**
```
Documento 1:
  - nombre: "Regocíjate Sion"
  - embedCode: "<iframe...>"

Documento 2:
  - nombre: "Básico"
  - embedCode: "<iframe...>"
```

**Después (en pasosGlobales):**
```javascript
[
  {
    id: "abc123",           // ID del documento
    nombre: "Regocíjate Sion",
    embedCode: "<iframe...>"
  },
  {
    id: "def456",
    nombre: "Básico",
    embedCode: "<iframe...>"
  }
]
```

**¿Por qué incluir `id`?**
- El ID identifica cada documento de forma única
- Lo necesitamos para actualizar/eliminar pasos después
- Sin ID, no sabríamos qué documento modificar

```javascript
renderPasos();
```
- Después de actualizar `pasosGlobales`
- Renderiza inmediatamente en el HTML

---

## Flujo de Datos

### 🔄 Secuencia Completa

```
1. Usuario abre index.html
   ↓
2. Se cargan los SDKs de Firebase
   ├─ firebase-app.js
   └─ firebase-firestore.js
   ↓
3. Se ejecuta el bloque <script> de configuración
   ├─ firebase.initializeApp(config)
   └─ window.db = firebase.firestore()
   ↓
4. Se carga app.js
   ↓
5. Cuando termina de cargar la página: window.addEventListener('load')
   ↓
6. Se ejecuta initRenderPasos()
   ├─ Se conecta a Firestore
   ├─ Pone un "escucha" (listener)
   └─ Si hay datos, ejecuta el callback
   ↓
7. snapshot.docs.map() transforma los datos
   ├─ Obtiene cada documento
   └─ Crea un array con id + datos
   ↓
8. pasosGlobales se actualiza
   ↓
9. renderPasos() renderiza en el HTML
```

### 📝 Agregar un Nuevo Paso

```javascript
document.getElementById('form-paso').addEventListener('submit', async function(e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const embedCode = document.getElementById('embed-code').value.trim();

  if (!nombre || !embedCode) {
    alert('Por favor completa todos los campos');
    return;
  }

  try {
    await db.collection('pasos-danza').add({
      nombre,
      embedCode,
      fecha: new Date()
    });

    closeModal();
    // renderPasos() se ejecuta automáticamente
  } catch (error) {
    console.error('Error al guardar paso:', error);
    alert('Error al guardar el paso. Intenta de nuevo.');
  }
});
```

**Explicación:**

```javascript
await db.collection('pasos-danza').add({
  nombre,
  embedCode,
  fecha: new Date()
});
```

- `await` - Espera a que Firebase responda
- `.add()` - Crea un nuevo documento
- Firestore automáticamente asigna un ID único
- El documento se guarda en la colección "pasos-danza"

**¿Qué pasa después?**

```
1. Documento se guarda en Firestore
   ↓
2. Firestore detecta el cambio
   ↓
3. Dispara el listener onSnapshot()
   ↓
4. pasosGlobales se actualiza
   ↓
5. renderPasos() renderiza automáticamente
   ↓
6. El nuevo paso aparece en la lista
```

**Sin necesidad de:**
- `savePasos()` (que ya no existe)
- `renderPasos()` manual
- localStorage

---

## Sincronización en Tiempo Real

### 🌐 ¿Por qué "tiempo real"?

**Escenario:**

```
Navegador A (tu computadora)
  - Agregas un paso
  - Firestore se actualiza
  ↓
Firestore (la nube)
  ↓
Navegador B (otra persona, otro computador)
  - Recibe la notificación automáticamente
  - Se actualiza sin recargar
```

### 📡 El Listener (Escuchador)

```javascript
db.collection('pasos-danza').onSnapshot(snapshot => {
  // Este código se ejecuta cuando hay cambios
})
```

**¿Cómo funciona?**

1. **Primera ejecución:** Cuando cargas la página, ejecuta una vez
2. **Cambios posteriores:** Cada vez que se agrega/modifica un documento

**Comparación:**

```javascript
// ❌ Sin listener (forma antigua con localStorage)
function guardarPaso() {
  savePasos(pasos);  // Guardar
  renderPasos();     // Actualizar manualmente
}

// ✅ Con listener (Firebase)
function guardarPaso() {
  db.collection('pasos-danza').add(paso);
  // renderPasos() se ejecuta AUTOMÁTICAMENTE
}
```

---

## Comparación localStorage vs Firestore

| Aspecto | localStorage | Firestore |
|--------|------------|-----------|
| **Almacenamiento** | Solo en el navegador | En la nube |
| **Acceso** | Local | Global (cualquier navegador) |
| **Sincronización** | ❌ Manual | ✅ Automática en tiempo real |
| **Capacidad** | ~5-10MB | Ilimitado |
| **Persistencia** | Si borras el navegador, se pierden | Permanente en la nube |
| **Costo** | Gratis | Gratis (plan Spark) |
| **Complejidad** | Fácil | Media-Alta |
| **Uso ideal** | Demostración/Prototype | Producción |

---

## Flujo Visual

### localStorage (Antes)

```
┌─────────────────┐
│  Navegador A    │
├─────────────────┤
│ localStorage    │
│ [Paso 1]        │
│ [Paso 2]        │ Solo aquí
│ [Paso 3]        │
└─────────────────┘

┌─────────────────┐
│  Navegador B    │
├─────────────────┤
│ localStorage    │
│ (vacío)         │ Datos perdidos
└─────────────────┘
```

### Firestore (Ahora)

```
┌─────────────────┐         ┌─────────────────┐
│  Navegador A    │         │  Navegador B    │
├─────────────────┤         ├─────────────────┤
│ pasosGlobales   │         │ pasosGlobales   │
│ [Paso 1]        │         │ [Paso 1]        │
│ [Paso 2]        │◄───────►│ [Paso 2]        │
│ [Paso 3]        │ Sincro.  │ [Paso 3]        │
└─────────────────┘         └─────────────────┘
         ▲                          ▲
         └──────────────┬───────────┘
                        │
                   ┌────▼──────┐
                   │ Firestore │
                   │  (Nube)   │
                   │ pasos-db  │
                   └───────────┘
```

---

## Troubleshooting

### "Firebase no está definido"

**Problema:**
```
Uncaught ReferenceError: firebase is not defined
```

**Causa:** Los SDKs no cargaron correctamente

**Solución:**
1. Verifica que incluiste ambos scripts en index.html
2. Verifica el orden:
   ```html
   <script src="firebase-app.js"></script>        ✅ PRIMERO
   <script src="firebase-firestore.js"></script>  ✅ SEGUNDO
   <script src="app.js"></script>                  ✅ TERCERO
   ```

### "Permission denied"

**Problema:**
```
Uncaught permission denied to access
```

**Causa:** Las reglas de seguridad de Firestore bloquean el acceso

**Solución:**
En Firebase Console → Firestore Database → Rules

Cambia a:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pasos-danza/{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Los pasos no se muestran

**Cheklist:**
- [ ] ¿Incluiste los SDKs de Firebase?
- [ ] ¿Copabla y pegaste la configuración correcta?
- [ ] ¿Creaste la colección "pasos-danza" en Firestore?
- [ ] ¿Agregaste al menos un documento de prueba?
- [ ] ¿Esperas a que cargue la página (window.addEventListener('load'))?

---

## Resumen de Cambios

### Antes (localStorage)
```javascript
function getPasos() {
  return JSON.parse(localStorage.getItem('pasos-danza')) || [];
}

function savePasos(pasos) {
  localStorage.setItem('pasos-danza', JSON.stringify(pasos));
}

// Guardar
savePasos(pasos);

// Cargar
const data = getPasos();
```

### Ahora (Firestore)
```javascript
// Escuchador en tiempo real
function initRenderPasos() {
  db.collection('pasos-danza').onSnapshot(snapshot => {
    pasosGlobales = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    renderPasos();
  });
}

// Guardar
await db.collection('pasos-danza').add({
  nombre,
  embedCode,
  fecha: new Date()
});

// Cargar - ¡AUTOMÁTICO CON onSnapshot()!
```

---

## ¿Por Qué Esta Arquitectura?

### 🎯 Decisiones de Diseño

1. **`pasosGlobales`** - Array en memoria
   - Acceso rápido sin consultas a la BD
   - Se sincroniza automáticamente
   - Disponible para todas las funciones

2. **`initRenderPasos()`** - Listener central
   - Un único punto de sincronización
   - Reacciona a cambios automáticamente
   - Evita duplicar código

3. **Función `openLightbox()` modificada**
   ```javascript
   // Antes
   function openLightbox(index) {
     const paso = pasos[index];
   }
   
   // Ahora
   function openLightbox(pasoId) {
     const paso = pasosGlobales.find(p => p.id === pasoId);
   }
   ```
   - Usa ID en lugar de índice (índice cambia con actualiz.)
   - Es más robusto y escalable

---

## Próximos Pasos (Opcionales)

### 🔐 Autenticación
```javascript
firebase.auth().signInAnonymously();
```
Para usuarios sin login.

### 🗑️ Eliminar Pasos
```javascript
db.collection('pasos-danza').doc(pasoId).delete();
```

### ✏️ Editar Pasos
```javascript
db.collection('pasos-danza').doc(pasoId).update({
  nombre: "Nuevo nombre",
  embedCode: "Nuevo código"
});
```

---

**Última actualización:** 17 de Abril de 2026  
**Autor:** Documentación del Proyecto Pasos de Danza  
**Estado:** ✅ Completo y Funcional
