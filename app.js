// Variable global para almacenar pasos desde Firestore
let pasosGlobales = [];

// ==================== FUNCIONES DE FIRESTORE ====================

function initRenderPasos() {
  db.collection('pasos-danza').onSnapshot(snapshot => {
    pasosGlobales = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    renderPasos();
  }, error => {
    document.getElementById('lista-pasos').innerHTML = `
      <div class="empty-state">
        <p>Error al conectar con Firebase</p>
      </div>
    `;
  });
}

// ==================== FUNCIONES DE RENDERIZADO ====================

function renderPasos() {
  const container = document.getElementById('lista-pasos');

  if (pasosGlobales.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No hay pasos de danza registrados</p>
        <p>¡Agrega el primero!</p>
      </div>
    `;
    actualizarVisibilidadBotones();
    return;
  }

  container.innerHTML = pasosGlobales.map((paso) => `
    <div class="paso-card">
      <h3><a href="javascript:void(0)" onclick="openLightbox('${paso.id}'); return false;">${escapeHtml(paso.nombre)}</a></h3>
      <div class="paso-actions">
        <button class="btn-edit" onclick="openEditModal('${paso.id}'); return false;" title="Editar">✏️</button>
        <button class="btn-delete" onclick="deletePaso('${paso.id}'); return false;" title="Eliminar">🗑️</button>
      </div>
    </div>
  `).join('');
  
  // Actualizar visibilidad de botones según permisos
  actualizarVisibilidadBotones();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==================== FUNCIONES DE LIGHTBOX ====================

function openLightbox(pasoId) {
  const paso = pasosGlobales.find(p => p.id === pasoId);
  
  if (!paso) {
    return;
  }
  
  const videoContainer = document.getElementById('lightbox-video');
  
  // Limpiar atributos width y height del iframe para que sea responsive
  let cleanEmbedCode = paso.embedCode
    .replace(/width="[^"]*"/g, '')
    .replace(/height="[^"]*"/g, '');
  
  // Agregar autoplay y loop si no están presentes
  cleanEmbedCode = cleanEmbedCode.replace(/src="([^"]*)"/g, (match, url) => {
    // Si ya tiene autoplay y loop, dejar como está
    if (url.includes('autoplay=1') && url.includes('loop=1')) {
      return match;
    }
    // Si no tiene, agregar parámetros
    const separator = url.includes('?') ? '&' : '?';
    const videoId = url.match(/embed\/([^\/?]+)/)?.[1];
    let newUrl = url;
    if (!url.includes('autoplay=1')) {
      newUrl += separator + 'autoplay=1';
    }
    if (!url.includes('loop=1') && videoId) {
      newUrl += '&loop=1&playlist=' + videoId;
    }
    return `src="${newUrl}"`;
  });
  
  videoContainer.innerHTML = cleanEmbedCode;
  document.getElementById('video-lightbox').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('video-lightbox').classList.add('hidden');
  document.getElementById('lightbox-video').innerHTML = '';
  document.body.style.overflow = 'auto';
}

function deletePaso(pasoId) {
  // Proteger: Solo admin puede eliminar
  if (!esAdmin()) {
    alert('Solo administradores pueden eliminar pasos');
    return;
  }
  
  if (!confirm('¿Estás seguro de que deseas eliminar este paso?')) {
    return;
  }

  db.collection('pasos-danza').doc(pasoId).delete()
    .then(() => {
      // renderPasos() se ejecutará automáticamente
    })
    .catch(error => {
      alert('Error al eliminar el paso. Intenta de nuevo.');
    });
}

// ==================== FUNCIONES DE MODAL ====================

let pasoEnEdicion = null; // Variable para guardar el paso que se está editando

function openModal() {
  // Proteger: Solo admin puede agregar pasos
  if (!esAdmin()) {
    alert('Solo administradores pueden agregar pasos');
    return;
  }
  
  pasoEnEdicion = null; // Limpiar
  document.getElementById('modal-title').textContent = 'Nuevo Paso de Danza';
  document.getElementById('nombre').value = '';
  document.getElementById('embed-code').value = '';
  document.getElementById('modal').classList.remove('hidden');
}

function openEditModal(pasoId) {
  // Proteger: Solo admin puede editar
  if (!esAdmin()) {
    alert('Solo administradores pueden editar pasos');
    return;
  }
  
  const paso = pasosGlobales.find(p => p.id === pasoId);
  if (!paso) {
    return;
  }

  pasoEnEdicion = paso;
  document.getElementById('modal-title').textContent = 'Editar Paso de Danza';
  document.getElementById('nombre').value = paso.nombre || '';
  document.getElementById('embed-code').value = paso.embedCode || '';
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  document.getElementById('form-paso').reset();
  pasoEnEdicion = null;
}

// ==================== EVENT LISTENERS ====================

// Botón para agregar paso
const btnAgregar = document.getElementById('btn-agregar-paso');
if (btnAgregar) {
  btnAgregar.addEventListener('click', openModal);
}

// Botón para logout
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
  btnLogout.addEventListener('click', function() {
    logout();
    document.getElementById('form-login').reset();
    document.getElementById('login-error').style.display = 'none';
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('btn-admin').style.display = 'inline-block';
    document.getElementById('btn-agregar-paso').style.display = 'none';
    document.getElementById('btn-logout').style.display = 'none';
    // Re-renderizar para ocultar botones de editar/eliminar
    renderPasos();
  });
}

// Botón para cancelar
document.getElementById('btn-cancelar').addEventListener('click', closeModal);

// Formulario para guardar paso (agregar o editar)
document.getElementById('form-paso').addEventListener('submit', async function(e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const embedCode = document.getElementById('embed-code').value.trim();

  if (!nombre || !embedCode) {
    alert('Por favor completa todos los campos');
    return;
  }

  try {
    if (pasoEnEdicion) {
      // Editar paso existente
      await db.collection('pasos-danza').doc(pasoEnEdicion.id).update({
        nombre,
        embedCode,
        fechaActualizacion: new Date()
      });
    } else {
      // Crear nuevo paso
      await db.collection('pasos-danza').add({
        nombre,
        embedCode,
        fecha: new Date()
      });
    }

    closeModal();
  } catch (error) {
    alert('Error al guardar el paso. Intenta de nuevo.');
  }
});

// Lightbox event listeners
const lightbox = document.getElementById('video-lightbox');
const lightboxOverlay = document.querySelector('.lightbox-overlay');
const lightboxClose = document.querySelector('.lightbox-close');

lightboxOverlay.addEventListener('click', closeLightbox);
lightboxClose.addEventListener('click', closeLightbox);

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
    closeLightbox();
  }
});

// Botón Admin para abrir modal de login
const btnAdmin = document.getElementById('btn-admin');
if (btnAdmin) {
  btnAdmin.addEventListener('click', mostrarModalLogin);
}

// Botón cancelar en modal de login
const btnLoginCancelar = document.getElementById('btn-login-cancelar');
if (btnLoginCancelar) {
  btnLoginCancelar.addEventListener('click', cerrarModalLogin);
}

// Event listener para formulario de login
const formLogin = document.getElementById('form-login');
if (formLogin) {
  formLogin.addEventListener('submit', function(e) {
    e.preventDefault();
    const usuario = document.getElementById('login-usuario').value.trim();
    const contrasena = document.getElementById('login-contrasena').value;
    procesarLogin(usuario, contrasena);
  });
}

// ==================== INICIALIZACIÓN ====================

function waitForFirebase(callback, maxAttempts = 30) {
  let attempts = 0;
  
  function check() {
    attempts++;
    if (typeof db !== 'undefined' && db !== null) {
      callback();
    } else if (attempts < maxAttempts) {
      setTimeout(check, 100);
    }
  }
  
  check();
}

function mostrarModalLogin() {
  document.getElementById('modal-login').classList.remove('hidden');
}

function cerrarModalLogin() {
  document.getElementById('modal-login').classList.add('hidden');
  document.getElementById('form-login').reset();
  document.getElementById('login-error').style.display = 'none';
}

function ocultarModalLogin() {
  document.getElementById('modal-login').classList.add('hidden');
}

function procesarLogin(usuario, contrasena) {
  if (login(usuario, contrasena)) {
    document.getElementById('login-error').style.display = 'none';
    document.getElementById('form-login').reset();
    actualizarUILogin();
    ocultarModalLogin();
    // Re-renderizar la lista para mostrar botones de editar/eliminar
    renderPasos();
  } else {
    const errorMsg = document.getElementById('login-error');
    errorMsg.textContent = '✗ Usuario o contraseña incorrectos';
    errorMsg.style.display = 'block';
    document.getElementById('login-contrasena').value = '';
  }
}

function actualizarUILogin() {
  const user = obtenerUsuarioActual();
  if (user && user.isAdmin) {
    document.getElementById('user-info').style.display = 'inline-block';
    document.getElementById('user-name').textContent = user.usuario;
    document.getElementById('btn-admin').style.display = 'none';
    document.getElementById('btn-agregar-paso').style.display = 'inline-block';
    document.getElementById('btn-logout').style.display = 'inline-block';
  }
}

// Inicializar la aplicación cuando carga la página
window.addEventListener('load', function() {
  // SIEMPRE cargar la lista de pasos (pública)
  waitForFirebase(function() {
    initRenderPasos();
  });
  
  // Si hay sesión activa: mostrar botones de CRUD
  const user = obtenerUsuarioActual();
  if (user && user.isAdmin) {
    actualizarUILogin();
  }
});