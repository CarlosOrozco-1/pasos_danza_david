# 🔥 Firebase Setup - Guía Completa

## ¿Qué es Firebase?

Firebase es un **backend as a service (BaaS)** de Google que proporciona:
- 🗄️ **Firestore**: Base de datos en la nube (NoSQL)
- 🔐 **Authentication**: Autenticación de usuarios
- 🌐 **Hosting**: Alojamiento gratuito
- ⏱️ **Real-time sync**: Sincronización en tiempo real

## Estado Actual (2026)
✅ **Funcional** - Mantenido activamente por Google  
✅ **Gratis** - Plan Spark sin costo (suficiente para este proyecto)  
✅ **Seguro** - Empleado por miles de aplicaciones

---

## Paso 1: Crear Proyecto Firebase

### 1.1 Ir a Firebase Console
```
https://console.firebase.google.com/
```
- Inicia sesión con tu Google Account
- Haz click en "Crear un proyecto"

### 1.2 Configurar Proyecto
```
Nombre: Pasos de Danza
País: [Tu país]
Analytics: Desactivado (opcional)
```
- Haz click en "Crear proyecto"
- Espera 1-2 minutos a que se cree

### 1.3 Configurar Firestore
En el panel izquierdo:
- Ve a **Firestore Database**
- Haz click en **Crear base de datos**
- Ubicación: `madrid` (or tu región más cercana)
- Modo: **Iniciar en modo prueba** (seguro para desarrollo)
- Haz click en **Crear**

Ahora tienes tu base de datos lista.

---

## Paso 2: Obtener Credenciales

### 2.1 Registrar Aplicación Web
En el panel izquierdo:
- Ve a **Project Settings** (⚙️ arriba a la izquierda)
- Selecciona la pestaña **Apps**
- Haz click en **Agregar app** → **Web**

### 2.2 Copiar Configuración
Nombre: `Pasos de Danza Web`

Se generara un código como este:
```javascript
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxx",
  authDomain: "pasos-danza-xxxxx.firebaseapp.com",
  projectId: "pasos-danza-xxxxx",
  storageBucket: "pasos-danza-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxxxx"
};
```

**Guarda esto en un lugar seguro.**

---

## Paso 3: Integrar Firebase en tu Proyecto

### 3.1 Actualizar index.html
Agrega este código **después** de `Pasos de Danza` y **antes** de `</body>`:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"></script>

<!-- Tu configuración -->
<script>
  const firebaseConfig = {
    apiKey: "TU_apiKey_AQUI",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-projectId",
    storageBucket: "tu-projectId.appspot.com",
    messagingSenderId: "TU_messagingSenderId",
    appId: "TU_appId"
  };

  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);

  // Obtener referencia a Firestore
  window.db = firebase.firestore();
</script>

<script src="app.js"></script>
```

### 3.2 Estructura en Firestore
Tu base de datos tendrá esta estructura:

```
pasos-danza (colección)
├── documento 1
│   ├── nombre: "Regocíjate Sion"
│   ├── embedCode: "<iframe...>"
│   └── fecha: 2026-04-17
├── documento 2
│   ├── nombre: "Básico"
│   └── embedCode: "<iframe...>"
```

---

## Paso 4: Actualizar app.js

El código será reemplazado para usar Firestore en lugar de localStorage.

**Funciones que cambiarán:**

### 4.1 `getPasos()` → Cargar de Firestore
```javascript
async function getPasos() {
  const snapshot = await db.collection('pasos-danza').get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
```

### 4.2 `savePasos()` → Guardar en Firestore
```javascript
async function agregarPaso(nombre, embedCode) {
  await db.collection('pasos-danza').add({
    nombre,
    embedCode,
    fecha: new Date()
  });
}
```

### 4.3 `renderPasos()` → Recargar automáticamente
```javascript
// Listener en tiempo real
db.collection('pasos-danza').onSnapshot(snapshot => {
  // Re-renderizar cuando hay cambios
});
```

---

## Ventajas con Firebase

✅ **Persistencia**: Datos guardados en la nube  
✅ **Sincronización**: Cambios en tiempo real  
✅ **Multiplataforma**: Accesible desde cualquier navegador  
✅ **Gratis**: Plan Spark suficiente  
✅ **Seguro**: Google lo mantiene  

---

## Reglas de Seguridad

En Firestore, por ahora usaremos modo **Prueba** (sin autenticación).

Para producción, cambiar a:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pasos-danza/{document=**} {
      allow read, write: if request.auth == null;
    }
  }
}
```

---

## Troubleshooting

### "Permission denied" al escribir
→ Cambia reglas de seguridad a modo lectura/escritura

### No se actualiza en tiempo real
→ Verifica que el listener esté activo

### Firestore no carga
→ Comprueba las credenciales en Firebase Console

---

## Próximos Pasos

1. Crear proyecto en Firebase Console
2. Obtener credenciales
3. Actualizar `index.html` con config
4. Avísame cuando esté listo, integraré app.js

¿Necesitas ayuda en alguno de estos pasos?

---

**Documentación oficial:** https://firebase.google.com/docs
