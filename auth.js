/**
 * AUTENTICACIÓN - Pasos de Danza
 * Gestiona login de admin y permisos de usuario
 */

// Credenciales de admin (para MVP)
const ADMIN_CREDENTIALS = {
  usuario: 'admin',
  contrasena: 'pasos2026'
};

/**
 * Verifica si el usuario actual es admin
 * Retorna: true/false
 */
function esAdmin() {
  try {
    const auth = JSON.parse(sessionStorage.getItem('auth') || '{}');
    return auth.isAdmin === true;
  } catch (e) {
    return false;
  }
}

/**
 * Obtiene info del usuario actual
 * Retorna: { isAdmin, usuario } o null
 */
function obtenerUsuarioActual() {
  try {
    const auth = JSON.parse(sessionStorage.getItem('auth') || 'null');
    return auth;
  } catch (e) {
    return null;
  }
}

/**
 * Login de admin
 * @param {string} usuario - Nombre de usuario
 * @param {string} contrasena - Contraseña
 * @returns {boolean} - true si login exitoso
 */
function login(usuario, contrasena) {
  // Validar credenciales
  if (usuario === ADMIN_CREDENTIALS.usuario && 
      contrasena === ADMIN_CREDENTIALS.contrasena) {
    
    // Guardar en sessionStorage
    const auth = {
      isAdmin: true,
      usuario: usuario
    };
    sessionStorage.setItem('auth', JSON.stringify(auth));
    
    return true;
  }
  
  return false;
}

/**
 * Cerrar sesión de admin
 */
function logout() {
  sessionStorage.removeItem('auth');
}

/**
 * Mostrar/ocultar elementos según permisos
 * Busca elementos con data-admin-only
 */
function actualizarVisibilidadBotones() {
  const esAdminUser = esAdmin();
  
  // Mostrar/ocultar botones edit y delete
  document.querySelectorAll('.paso-actions').forEach(actions => {
    actions.style.display = esAdminUser ? 'flex' : 'none';
  });
  
  // Mostrar/ocultar botón "Agregar paso"
  const btnAgregar = document.getElementById('btn-agregar-paso');
  if (btnAgregar) {
    btnAgregar.style.display = esAdminUser ? 'inline-block' : 'none';
  }
  
  // Mostrar/ocultar logout button
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.style.display = esAdminUser ? 'inline-block' : 'none';
  }
}

/**
 * Proteger rutas admin
 * Llamar al inicio de app.js si necesitas protección
 */
function protegerRutaAdmin() {
  const rutaActual = window.location.pathname;
  
  // Si estás en /admin y no eres admin, redirige a login
  if (rutaActual.includes('/admin') && !esAdmin()) {
    window.location.href = '/admin/login.html';
  }
}
