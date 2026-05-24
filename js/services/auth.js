// Credenciales de admin (para MVP)
const ADMIN_CREDENTIALS = {
  usuario: 'admin',
  contrasena: 'pasos2026'
};

export function esAdmin() {
  try {
    const auth = JSON.parse(sessionStorage.getItem('auth') || '{}');
    return auth.isAdmin === true;
  } catch (e) {
    return false;
  }
}

export function obtenerUsuarioActual() {
  try {
    const auth = JSON.parse(sessionStorage.getItem('auth') || 'null');
    return auth;
  } catch (e) {
    return null;
  }
}

export function login(usuario, contrasena) {
  if (usuario === ADMIN_CREDENTIALS.usuario && 
      contrasena === ADMIN_CREDENTIALS.contrasena) {
    
    const auth = {
      isAdmin: true,
      usuario: usuario
    };
    sessionStorage.setItem('auth', JSON.stringify(auth));
    
    return true;
  }
  
  return false;
}

export function logout() {
  sessionStorage.removeItem('auth');
}

export function actualizarVisibilidadBotones() {
  const esAdminUser = esAdmin();
  
  document.querySelectorAll('.paso-actions').forEach(actions => {
    actions.style.display = esAdminUser ? 'flex' : 'none';
  });
  
  const btnAgregar = document.getElementById('btn-agregar-paso');
  if (btnAgregar) {
    btnAgregar.style.display = esAdminUser ? 'inline-block' : 'none';
  }
  
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.style.display = esAdminUser ? 'inline-block' : 'none';
  }
}

export function protegerRutaAdmin() {
  const rutaActual = window.location.pathname;
  
  if (rutaActual.includes('/admin') && !esAdmin()) {
    window.location.href = '/admin/login.html';
  }
}
