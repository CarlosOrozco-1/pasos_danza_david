const firebaseConfig = {
  apiKey: "AIzaSyByRoG4psaUVevkvVl_CjdXuMW_-7QqI44",
  authDomain: "pasos-de-danza.firebaseapp.com",
  projectId: "pasos-de-danza",
  databaseURL: "https://pasos-de-danza.firebaseio.com",
  storageBucket: "pasos-de-danza.firebasestorage.app",
  messagingSenderId: "170542507869",
  appId: "1:170542507869:web:aff3c90981b3660b212ab4"
};

let db = null;

try {
  // Inicializar Firebase si no ha sido inicializado
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  db = firebase.firestore();
} catch (error) {
  console.error('Error al inicializar Firebase', error);
  alert('Error al inicializar Firebase');
}

export { db };
