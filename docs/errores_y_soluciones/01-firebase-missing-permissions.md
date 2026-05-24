# Error: FirebaseError: Missing or insufficient permissions

## Problema
Al intentar obtener datos de la colección de Firestore (`pasos-danza`) sin usar la autenticación de Firebase (Firebase Authentication), el servidor rechaza la petición mostrando el siguiente error en la aplicación y consola:
`Firebase connection error: FirebaseError: Missing or insufficient permissions.`

Esto sucede porque la aplicación usa una autenticación local simulada mediante `sessionStorage` (en `auth.js`), por lo cual todas las peticiones hacia Firestore se consideran anónimas o "sin autenticar" desde la perspectiva de Firebase. Al no cumplir las reglas de seguridad predeterminadas, la solicitud es rechazada.

## Solución
Para resolver este problema (al no usar Firebase Auth), es necesario actualizar las Reglas de Seguridad en la consola de Firebase para permitir el acceso de lectura y escritura.

Pasos a seguir:
1. Ir a la [consola de Firebase](https://console.firebase.google.com/) y seleccionar el proyecto (`pasos-de-danza`).
2. En el menú lateral, buscar **Bases de datos y almacenamiento** (o similar) y seleccionar **Firestore Database** o **Cloud Firestore**.
3. Ir a la pestaña **Reglas** (Rules).
4. Reemplazar el código existente por el siguiente:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pasos-danza/{document} {
      allow read, write: if true;
    }
  }
}
```

5. Clic en **Publicar**.

> **Nota**: Esta configuración es útil para la versión actual del proyecto (MVP) y entornos de prueba. Para una aplicación en producción, la mejor práctica es integrar *Firebase Authentication* y limitar el permiso de escritura (`allow write`) solo a usuarios administradores autenticados.
