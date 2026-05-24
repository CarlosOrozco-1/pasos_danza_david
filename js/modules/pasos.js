import { db } from '../config/firebase.js';
import { state, setPasosGlobal } from '../state.js';
import { actualizarVisibilidadBotones, esAdmin } from '../services/auth.js';
import { escapeHtml } from './biblia.js';

export function initRenderPasos() {
  db.collection('pasos-danza').onSnapshot(snapshot => {
    const pasosGlobales = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setPasosGlobal(pasosGlobales);
    renderPasos();
  }, error => {
    console.error("Firebase connection error:", error);
    document.getElementById('lista-pasos').innerHTML = `
      <div class="empty-state">
        <p>Error al conectar con Firebase: ${error.message || error}</p>
      </div>
    `;
  });
}

export function renderPasos() {
  const container = document.getElementById('lista-pasos');

  if (state.pasosGlobal.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No hay pasos de danza registrados</p>
        <p>¡Agrega el primero!</p>
      </div>
    `;
    actualizarVisibilidadBotones();
    return;
  }

  container.innerHTML = state.pasosGlobal.map((paso) => `
    <div class="paso-card">
      <h3><a href="#" class="btn-lightbox" data-id="${paso.id}">${escapeHtml(paso.nombre)}</a></h3>
      <div class="paso-actions">
        <button class="btn-edit-paso" data-id="${paso.id}" title="Editar">✏️</button>
        <button class="btn-delete-paso" data-id="${paso.id}" title="Eliminar">🗑️</button>
      </div>
    </div>
  `).join('');
  
  actualizarVisibilidadBotones();
}

export function openLightbox(pasoId) {
  const paso = state.pasosGlobal.find(p => p.id === pasoId);
  
  if (!paso) {
    return;
  }
  
  const videoContainer = document.getElementById('lightbox-video');
  
  let cleanEmbedCode = paso.embedCode
    .replace(/width="[^"]*"/g, '')
    .replace(/height="[^"]*"/g, '');
  
  cleanEmbedCode = cleanEmbedCode.replace(/src="([^"]*)"/g, (match, url) => {
    if (url.includes('autoplay=1') && url.includes('loop=1')) {
      return match;
    }
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

export function closeLightbox() {
  document.getElementById('video-lightbox').classList.add('hidden');
  document.getElementById('lightbox-video').innerHTML = '';
  document.body.style.overflow = 'auto';
}

export function deletePaso(pasoId) {
  if (!esAdmin()) {
    alert('Solo administradores pueden eliminar pasos');
    return;
  }
  
  if (!confirm('¿Estás seguro de que deseas eliminar este paso?')) {
    return;
  }

  db.collection('pasos-danza').doc(pasoId).delete()
    .then(() => {
    })
    .catch(error => {
      alert('Error al eliminar el paso. Intenta de nuevo.');
    });
}

export let pasoEnEdicion = null;

export function openModal() {
  if (!esAdmin()) {
    alert('Solo administradores pueden agregar pasos');
    return;
  }
  
  pasoEnEdicion = null;
  document.getElementById('modal-title').textContent = 'Nuevo Paso de Danza';
  document.getElementById('nombre').value = '';
  document.getElementById('embed-code').value = '';
  document.getElementById('modal').classList.remove('hidden');
}

export function openEditModal(pasoId) {
  if (!esAdmin()) {
    alert('Solo administradores pueden editar pasos');
    return;
  }
  
  const paso = state.pasosGlobal.find(p => p.id === pasoId);
  if (!paso) {
    return;
  }

  pasoEnEdicion = paso;
  document.getElementById('modal-title').textContent = 'Editar Paso de Danza';
  document.getElementById('nombre').value = paso.nombre || '';
  document.getElementById('embed-code').value = paso.embedCode || '';
  document.getElementById('modal').classList.remove('hidden');
}

export function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  document.getElementById('form-paso').reset();
  pasoEnEdicion = null;
}
