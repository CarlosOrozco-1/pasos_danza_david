import { state, setModoAdmin } from './state.js';
import { db } from './config/firebase.js';
import { esAdmin, obtenerUsuarioActual, login, logout, actualizarVisibilidadBotones } from './services/auth.js';
import { initBiblia } from './modules/biblia.js';
import { renderEnsenanzas, toggleAccordionGlobal, toggleEnsenanza } from './modules/ensenanza.js';
import { initRenderPasos, renderPasos, openLightbox, closeLightbox, deletePaso, openModal, openEditModal, closeModal, pasoEnEdicion } from './modules/pasos.js';

function mostrarModulo(modulo) {
  const listaPasos = document.getElementById('lista-pasos');
  if (listaPasos) listaPasos.style.display = modulo === 'pasos' ? '' : 'none';
  
  const containerEnsenanza = document.getElementById('container-ensenanza');
  if (containerEnsenanza) containerEnsenanza.style.display = modulo === 'ensenanza' ? '' : 'none';
  
  const containerBiblia = document.getElementById('container-biblia');
  if (containerBiblia) containerBiblia.style.display = modulo === 'biblia' ? '' : 'none';
}

function actualizarUILogin() {
  const user = obtenerUsuarioActual();
  if (user && user.isAdmin) {
    document.getElementById('user-info').style.display = 'inline-block';
    document.getElementById('user-name').textContent = user.usuario;
    const btnAdmin = document.getElementById('btn-admin');
    if (btnAdmin) btnAdmin.style.display = 'none';
    
    const btnAgregar = document.getElementById('btn-agregar-paso');
    if (btnAgregar) btnAgregar.style.display = 'inline-block';
    
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) btnLogout.style.display = 'inline-block';
  }
}

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
  const modal = document.getElementById('modal-login');
  if (modal) modal.classList.remove('hidden');
}

function cerrarModalLogin() {
  const modal = document.getElementById('modal-login');
  if (modal) modal.classList.add('hidden');
  const form = document.getElementById('form-login');
  if (form) form.reset();
  const error = document.getElementById('login-error');
  if (error) error.style.display = 'none';
}

function procesarLogin(usuario, contrasena) {
  if (login(usuario, contrasena)) {
    const errorMsg = document.getElementById('login-error');
    if (errorMsg) errorMsg.style.display = 'none';
    const form = document.getElementById('form-login');
    if (form) form.reset();
    setModoAdmin(true);
    actualizarUILogin();
    cerrarModalLogin();
    renderPasos();
    
    const adminBar = document.getElementById('ensenanza-admin-bar');
    const containerEnsenanza = document.getElementById('container-ensenanza');
    if (adminBar && containerEnsenanza && containerEnsenanza.style.display !== 'none') {
      adminBar.style.display = '';
    }
    renderEnsenanzas();
  } else {
    const errorMsg = document.getElementById('login-error');
    if (errorMsg) {
      errorMsg.textContent = '✗ Usuario o contraseña incorrectos';
      errorMsg.style.display = 'block';
    }
    const pwdInput = document.getElementById('login-contrasena');
    if (pwdInput) pwdInput.value = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Configurar menú de navegación
  if (!document.getElementById('btn-lista-pasos')) {
    const btnLista = document.createElement('button');
    btnLista.id = 'btn-lista-pasos';
    btnLista.className = 'btn-secondary';
    btnLista.textContent = 'Pasos de Danza';
    btnLista.style.marginLeft = '10px';
    btnLista.onclick = () => {
      mostrarModulo('pasos');
      const adminBar = document.getElementById('ensenanza-admin-bar');
      if (adminBar) adminBar.style.display = 'none';
    };
    const headerRight = document.querySelector('.header-right');
    if (headerRight) headerRight.appendChild(btnLista);
  }

  if (!document.getElementById('btn-ensenanza')) {
    const btnEnsenanza = document.createElement('button');
    btnEnsenanza.id = 'btn-ensenanza';
    btnEnsenanza.className = 'btn-secondary';
    btnEnsenanza.textContent = '📖 Enseñanza Bíblica';
    btnEnsenanza.style.marginLeft = '10px';
    btnEnsenanza.onclick = () => {
      mostrarModulo('ensenanza');
      renderEnsenanzas();
      const adminBar = document.getElementById('ensenanza-admin-bar');
      if (adminBar) adminBar.style.display = state.modoAdmin ? '' : 'none';
    };
    const headerRight = document.querySelector('.header-right');
    if (headerRight) headerRight.appendChild(btnEnsenanza);
  }

  if (!document.getElementById('btn-biblia')) {
    const btnBiblia = document.createElement('button');
    btnBiblia.id = 'btn-biblia';
    btnBiblia.className = 'btn-secondary';
    btnBiblia.textContent = '✝️ Biblia';
    btnBiblia.style.marginLeft = '10px';
    btnBiblia.onclick = () => {
      mostrarModulo('biblia');
      const adminBar = document.getElementById('ensenanza-admin-bar');
      if (adminBar) adminBar.style.display = 'none';
      initBiblia();
    };
    const headerRight = document.querySelector('.header-right');
    if (headerRight) headerRight.appendChild(btnBiblia);
  }

  mostrarModulo('pasos');

  // Delegación de eventos para la enseñanza
  document.addEventListener('click', (e) => {
    // Para renderPasos (lightbox, edit, delete)
    if (e.target.closest('.btn-lightbox')) {
      e.preventDefault();
      const id = e.target.closest('.btn-lightbox').dataset.id;
      if (id) openLightbox(id);
    }
    if (e.target.closest('.btn-edit-paso')) {
      e.preventDefault();
      const id = e.target.closest('.btn-edit-paso').dataset.id;
      if (id) openEditModal(id);
    }
    if (e.target.closest('.btn-delete-paso')) {
      e.preventDefault();
      const id = e.target.closest('.btn-delete-paso').dataset.id;
      if (id) deletePaso(id);
    }

    // Para renderEnsenanzas (accordion y edit)
    if (e.target.closest('.btn-expand-all')) {
      e.preventDefault();
      toggleAccordionGlobal();
    }
    if (e.target.closest('.accordion-header')) {
      e.preventDefault();
      const id = e.target.closest('.accordion-header').dataset.id;
      if (id) toggleEnsenanza(id);
    }
    if (e.target.closest('.btn-edit')) {
      e.preventDefault();
      e.stopPropagation();
      const id = e.target.closest('.btn-edit').dataset.editId;
      if (id) alert('Función de edición solo para admin (próximamente)');
    }
  });

  const btnAgregar = document.getElementById('btn-agregar-paso');
  if (btnAgregar) btnAgregar.addEventListener('click', openModal);

  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      logout();
      const formLogin = document.getElementById('form-login');
      if (formLogin) formLogin.reset();
      const errorMsg = document.getElementById('login-error');
      if (errorMsg) errorMsg.style.display = 'none';
      const userInfo = document.getElementById('user-info');
      if (userInfo) userInfo.style.display = 'none';
      const btnAdmin = document.getElementById('btn-admin');
      if (btnAdmin) btnAdmin.style.display = 'inline-block';
      if (btnAgregar) btnAgregar.style.display = 'none';
      btnLogout.style.display = 'none';
      
      setModoAdmin(false);
      renderPasos();
      
      const adminBar = document.getElementById('ensenanza-admin-bar');
      if (adminBar) adminBar.style.display = 'none';
      renderEnsenanzas();
    });
  }

  const btnCancelar = document.getElementById('btn-cancelar');
  if (btnCancelar) btnCancelar.addEventListener('click', closeModal);

  const formPaso = document.getElementById('form-paso');
  if (formPaso) {
    formPaso.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = document.getElementById('nombre').value.trim();
      const embedCode = document.getElementById('embed-code').value.trim();

      if (!nombre || !embedCode) {
        alert('Por favor completa todos los campos');
        return;
      }

      try {
        if (pasoEnEdicion) {
          await db.collection('pasos-danza').doc(pasoEnEdicion.id).update({
            nombre,
            embedCode,
            fechaActualizacion: new Date()
          });
        } else {
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
  }

  const lightbox = document.getElementById('video-lightbox');
  const lightboxOverlay = document.querySelector('.lightbox-overlay');
  const lightboxClose = document.querySelector('.lightbox-close');
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && !lightbox.classList.contains('hidden')) {
      closeLightbox();
    }
  });

  const btnAdmin = document.getElementById('btn-admin');
  if (btnAdmin) btnAdmin.addEventListener('click', mostrarModalLogin);

  const btnLoginCancelar = document.getElementById('btn-login-cancelar');
  if (btnLoginCancelar) btnLoginCancelar.addEventListener('click', cerrarModalLogin);

  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const usuario = document.getElementById('login-usuario').value.trim();
      const contrasena = document.getElementById('login-contrasena').value;
      procesarLogin(usuario, contrasena);
    });
  }
});

window.addEventListener('load', () => {
  waitForFirebase(() => {
    initRenderPasos();
  });
  
  const user = obtenerUsuarioActual();
  if (user && user.isAdmin) {
    setModoAdmin(true);
    actualizarUILogin();
  }
  
  mostrarModulo('pasos');
});
