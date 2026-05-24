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
    console.error("Firebase connection error:", error);
    document.getElementById('lista-pasos').innerHTML = `
      <div class="empty-state">
        <p>Error al conectar con Firebase: ${error.message || error}</p>
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

// ==================== ENSEÑANZA BÍBLICA ====================


// ==================== DATOS REALES DE ENSEÑANZA BÍBLICA ====================
const ensenanzasBiblicas = [
  {
    id: 'racad',
    nombre: 'RACÁD',
    codigo: 'H7540',
    titulo: 'Danza Bíblica H7540',
    significado: 'Saltar como un resorte',
    raiz: 'Estampar, saltar, brincar frenéticamente. Danza espontánea, sin métodos ni movimientos preparados. Brincos motivados por el gozo, sin pena ni vergüenza.',
    explicacion: 'Danza espontánea, sin métodos ni movimientos preparados. Brincos motivados por el gozo, sin pena ni vergüenza.',
    versiculos: [
      { cita: 'Eclesiastés 3:4', texto: 'Un tiempo para llorar y un tiempo para reír, un tiempo para lamentarse y un tiempo para DANZAR.' },
      { cita: '1 Crónicas 15:29', texto: 'El rey David saltando y bailando delante del arca, con gozo desbordante.' },
      { cita: 'Salmos 87:7', texto: 'Y cantarán saltando de júbilo: En ti están mis fuentes todas.' }
    ]
  },
  {
    id: 'mekjola',
    nombre: 'MEKJOLÁ',
    codigo: 'H4246',
    titulo: 'Danza Bíblica H4246',
    significado: 'Como una máquina organizada',
    raiz: 'Danza, corro, como trabaja una máquina. Raíz hebrea (H2803 kjasháb): fabricar, idear, inventar, trazar.',
    explicacion: 'Danza acompasada y sincronizada con un pensamiento e intención específica contra el adversario.',
    versiculos: [
      { cita: '1 Samuel 18:6-7', texto: 'Las mujeres salieron cantando y danzando al encuentro de Saúl y David, ocasionando que el corazón de Saúl fuera destruido.' },
      { cita: 'Éxodo 15:20', texto: 'Miriam la profetisa tomó el pandero y todas las mujeres salieron tras ella con panderos y DANZAS, celebrando la derrota del faraón.' }
    ]
  },
  {
    id: 'karar',
    nombre: 'KARAR',
    codigo: 'H3769',
    titulo: 'Danza Bíblica H3769',
    significado: 'Girar como un remolino',
    raiz: 'Dar vueltas rápidas, girar como un remolino.',
    explicacion: 'Con la danza KARAR nos despojamos del polvo — comida de la serpiente (Génesis 3:14). Debe evolucionar de remolino a torbellino.',
    versiculos: [
      { cita: '1 Crónicas 15:29', texto: 'David saltaba y danzaba ante el Arca del Pacto.' },
      { cita: 'Salmos 83:13', texto: 'ponlos como polvo en REMOLINO.' },
      { cita: 'Salmos 83:15', texto: 'persíguelos con tu tempestad y aterrorízalos con tu TORBELLINO.' }
    ]
  },
  {
    id: 'kjagag',
    nombre: 'KJAGÁG',
    codigo: 'H2287',
    titulo: 'Danza Bíblica H2287',
    significado: 'Procesión sagrada circular',
    raiz: 'Moverse en círculo o marcha en procesión sagrada. Raíz kjagá (H2283): revólver, vértigo, espanto, terror.',
    explicacion: 'Danza para cercar en forma circular, rodear, ocasionando que los enemigos sean confundidos y se espanten.',
    versiculos: [
      { cita: 'Éxodo 5:1', texto: 'Moisés y Aarón piden al faraón: «Deja ir a mi pueblo para que me celebre FIESTA en el desierto.»' },
      { cita: 'Isaías 19:14', texto: 'Yahvé ha derramado en su interior un espíritu de vértigo, y descarrían a Egipto.' }
    ]
  },
  {
    id: 'makjol',
    nombre: 'MAKJÓL',
    codigo: 'H4234',
    titulo: 'MAKJÓL',
    significado: 'Danza, ronda circular',
    raiz: 'Danza circular acompañada de panderos, surge por una experiencia agradable de parte de Dios.',
    explicacion: 'Danza circular acompañada de panderos, surge por una experiencia agradable de parte de Dios.',
    versiculos: [
      { cita: 'Salmos 149:3', texto: 'Alaben Su Nombre con DANZAS, que hagan melodía con pandero y lira.' }
    ]
  },
  {
    id: 'joros',
    nombre: 'JORÓS',
    codigo: 'G5525',
    titulo: 'JORÓS',
    significado: 'Anillo, danza, corro, ronda',
    raiz: 'Danza ruidosa acompañada de instrumentos. Como un anillo de boda: la iglesia se alegra porque estará en boda con su Amado.',
    explicacion: 'Danza ruidosa acompañada de instrumentos. Como un anillo de boda: la iglesia se alegra porque estará en boda con su Amado.',
    versiculos: [
      { cita: 'Apocalipsis 19:7', texto: 'las bodas del Cordero han llegado.' }
    ]
  },
  {
    id: 'sakjc',
    nombre: 'SAKJC',
    codigo: 'H7832',
    titulo: 'SAKJC',
    significado: 'Reír, jugar, saltar, divertirse y danzar',
    raiz: 'También: burlarse del adversario. Danza espontánea con risa, alegría y gritos de júbilo. Demuestra que el adversario ha sido vencido.',
    explicacion: 'Danza espontánea con risa, alegría y gritos de júbilo. Demuestra que el adversario ha sido vencido.',
    versiculos: [
      { cita: '1 Crónicas 13:8', texto: 'David se regocijó «con todas sus fuerzas.»' }
    ]
  },
  {
    id: 'agaliao',
    nombre: 'AGALIAO',
    codigo: 'G21',
    titulo: 'AGALIAO',
    significado: 'Saltar de gozo, gozarse grandemente',
    raiz: 'Danza espontánea, no sincronizada, glorificando al Altísimo.',
    explicacion: 'Danza espontánea, no sincronizada, glorificando al Altísimo.',
    versiculos: [
      { cita: 'Lucas 10:21 (CDG)', texto: 'el Rabí se llenó de un gozo sobrenatural... DANZANDO EN CÍRCULOS levantó sus manos.' },
      { cita: 'Hechos 3:8', texto: 'el sanado entró al templo «caminando, saltando y alabando a Dios.»' },
      { cita: 'Juan 4:14', texto: 'el agua que yo le daré brota para vida eterna.' }
    ]
  },
  {
    id: 'makjanayim',
    nombre: 'MAKJANAYIM',
    codigo: 'H4266',
    titulo: 'MAKJANAYIM',
    significado: 'Campamento doble — dos ejércitos',
    raiz: 'Raíz H2583 kjaná: asediar, atrincherar, sitiar.',
    explicacion: 'Con la ayuda del cielo, asediar y sitiar al adversario para cortar todo suministro y hacer morir todo lo que estuviera dentro de ese territorio.',
    versiculos: [
      { cita: 'Cantares 6:13', texto: '¿Por qué habéis de contemplar a la Sulamita, como en la DANZA de los dos coros?' }
    ]
  }
];

const danzasCaidas = [
  {
    id: 'kjul',
    nombre: 'KJUL',
    codigo: 'H2342',
    significado: 'Retorcer de dolor, bailar, herir, pervertir.',
    explicacion: 'Danza que no glorifica a Dios, motivada por sentimientos melancólicos o ángeles caídos.',
    versiculos: [
      { cita: 'Jueces 21:21', texto: '' } ]
  },
  {
    id: 'tafaf',
    nombre: 'TAFÁF',
    codigo: 'H2952',
    significado: 'Trastabillar con pasos cortos, danzar con coquetería.',
    explicacion: 'Danza sensual, no para glorificar a Dios.',
    versiculos: [
      { cita: 'Isaías 3:16', texto: '' } ]
  }
];

let modoAdmin = false;
let ensenanzasExpandidas = new Set();

function toggleAccordionGlobal() {
  const totalEnsenanzas = ensenanzasBiblicas.length + danzasCaidas.length;
  if (ensenanzasExpandidas.size === totalEnsenanzas) {
    // Si todas están expandidas, contraer todas
    ensenanzasExpandidas.clear();
  } else {
    // Expandir todas
    ensenanzasBiblicas.forEach(d => ensenanzasExpandidas.add(d.id));
    danzasCaidas.forEach(d => ensenanzasExpandidas.add(d.id));
  }
  renderEnsenanzas();
}

function toggleEnsenanza(id) {
  if (ensenanzasExpandidas.has(id)) {
    ensenanzasExpandidas.delete(id);
  } else {
    ensenanzasExpandidas.add(id);
  }
  renderEnsenanzas();
}

function renderEnsenanzas() {
  const container = document.getElementById('ensenanza-lista');
  if (!container) return;

  const totalEnsenanzas = ensenanzasBiblicas.length + danzasCaidas.length;
  const todasExpandidas = ensenanzasExpandidas.size === totalEnsenanzas && totalEnsenanzas > 0;
  const textoExpandir = todasExpandidas ? 'Contraer Todos' : 'Expandir Todos';

  let html = `
    <div class="intro-danza-container">
      <center>
      <h1 class="intro-title">Danza</h1>
      </center>
      <center>
      <h2 class="intro-title">Expresión del Ser Integral</h2>
      </center>
      <p class="intro-text">La danza es una <strong>expresión corpórea rítmica</strong> que expresa lo que sentimos por dentro: agradecimiento, gozo, libertad, admiración y exaltación a Dios. <em>Salmos 103:1</em>: «Bendiga todo <strong>mi ser</strong> su santo nombre.» — <strong>Espíritu, Alma y Cuerpo.</strong></p>
      
      <div class="intro-grid-3">
        <div class="intro-box">
          <div class="intro-box-title">Armonía → Espíritu</div>
          <p>Notas simultáneas que hacen que el espíritu adore y reaccione.</p>
        </div>
        <div class="intro-box">
          <div class="intro-box-title">Melodía → Alma</div>
          <p>Voz cantante que hace que el alma alabe y reaccione.</p>
        </div>
        <div class="intro-box">
          <div class="intro-box-title">Ritmo → Cuerpo</div>
          <p>Marca un tiempo, haciendo que el cuerpo dance y reaccione.</p>
        </div>
      </div>

      <div class="intro-blockquote">
        <div class="vertical-line"></div>
        <p>Salmos 22:3 (KADOSH): «Tú eres Kadosh, habitas en las <strong>ALABANZAS</strong> de Yisra'el.»</p>
      </div>

      <h2 class="intro-subtitle">Tipos de Danzas en la Biblia</h2>
      <p class="intro-text">La danza es para <strong>agradar al Señor y darle gloria a su nombre</strong>. No puede ser utilizada para algo sensual ni para provocar en el hombre ni en la mujer. Existen diferentes tipos:</p>

      <div class="intro-grid-3 intro-grid-numbers">
        <div class="intro-box-number">
          <div class="number-header">1</div>
          <div class="number-body">
            <div class="intro-box-title">Danza Coros</div>
            <p>Danza corpórea sin instrumentos. Expresiva, con fuerza y potencia.</p>
          </div>
        </div>
        <div class="intro-box-number">
          <div class="number-header">2</div>
          <div class="number-body">
            <div class="intro-box-title">Danza Panderos</div>
            <p>Danza corpórea acompañada de panderos.</p>
          </div>
        </div>
        <div class="intro-box-number">
          <div class="number-header">3</div>
          <div class="number-body">
            <div class="intro-box-title">Danza Banderas</div>
            <p>Danza corpórea con banderas como instrumento de expresión.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  html += '<div class="accordion-container">';

  // Header Global
  html += `
    <div class="accordion-header-global">
      <h2>Tipos de danzas bíblicas</h2>
      <button class="btn-expand-all" onclick="toggleAccordionGlobal(); return false;">
        <span>${todasExpandidas ? '▲' : '▼'}</span> ${textoExpandir}
      </button>
    </div>
  `;

  // Helper function to render a card
  const renderCard = (danza, isCaida = false) => {
    const isExpanded = ensenanzasExpandidas.has(danza.id);
    
    let cardHtml = `
      <div class="accordion-card ${isCaida ? 'card-caida' : ''}">
        <div class="accordion-header" onclick="toggleEnsenanza('${danza.id}'); return false;">
          <div class="accordion-title-area">
            <div class="circle-icon"></div>
            <div class="title-text">
              <h3>${escapeHtml(danza.nombre)}</h3>
            </div>
          </div>
          <div class="accordion-toggle-area">
            <button class="accordion-toggle-btn">
              <span class="toggle-icon">✔️</span> <span class="toggle-text">${isExpanded ? 'Contraer' : 'Expandir'}</span>
            </button>
          </div>
        </div>
    `;

    if (isExpanded) {
      cardHtml += `<div class="accordion-body">`;
      // Contenido interno (detalle)
      cardHtml += `<div class="ensenanza-titulo-codigo"><span class="ensenanza-codigo">${escapeHtml(danza.codigo)}</span> - ${escapeHtml(danza.significado || '')}</div>`;
      
      if (danza.raiz) {
        cardHtml += `
          <div class="ensenanza-info-block">
            <h4>Raíz / Origen</h4>
            <p>${escapeHtml(danza.raiz)}</p>
          </div>
        `;
      }

      if (danza.explicacion) {
        cardHtml += `
          <div class="ensenanza-info-block">
            <h4>Explicación</h4>
            <p>${escapeHtml(danza.explicacion)}</p>
          </div>
        `;
      }

      if (danza.versiculos && danza.versiculos.length > 0) {
        cardHtml += `
          <div class="ensenanza-info-block">
            <h4>Base Bíblica</h4>
            <div class="versiculos-lista">
              ${danza.versiculos.map(v => `
                <div class="versiculo-item">
                  <strong>${escapeHtml(v.cita)}</strong>
                  ${v.texto ? `<p>"${escapeHtml(v.texto)}"</p>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      if (modoAdmin) {
        cardHtml += `
          <div class="ensenanza-actions">
            <button class="btn-edit" onclick="editarEnsenanza('${danza.id}'); return false;">✏️ Editar</button>
          </div>
        `;
      }

      cardHtml += `</div>`; // Cierre accordion-body
    }

    cardHtml += `</div>`; // Cierre accordion-card
    return cardHtml;
  };

  // Renderizar Danzas Bíblicas
  ensenanzasBiblicas.forEach(danza => {
    html += renderCard(danza, false);
  });

  // Renderizar Danzas Caídas
  if (danzasCaidas.length > 0) {
    html += `<h3 class="caidas-separator-title" style="margin-top: 30px; margin-bottom: 15px; color: #a13a3a;">Danzas Caídas</h3>`;
    danzasCaidas.forEach(danza => {
      html += renderCard(danza, true);
    });
  }

  html += '</div>'; // Cierre accordion-container

  container.innerHTML = html;
}

// Navegación entre módulos
function mostrarModulo(modulo) {
  document.getElementById('lista-pasos').style.display = modulo === 'pasos' ? '' : 'none';
  document.getElementById('container-ensenanza').style.display = modulo === 'ensenanza' ? '' : 'none';
}

// Agregar botón al menú principal
window.addEventListener('DOMContentLoaded', () => {
  // Crear botón Listado
  if (!document.getElementById('btn-lista-pasos')) {
    const btnLista = document.createElement('button');
    btnLista.id = 'btn-lista-pasos';
    btnLista.className = 'btn-secondary';
    btnLista.textContent = 'Pasos de Danza';
    btnLista.style.marginLeft = '10px';
    btnLista.onclick = () => {
      mostrarModulo('pasos');
      document.getElementById('ensenanza-admin-bar').style.display = 'none';
    };
    document.querySelector('.header-right').appendChild(btnLista);
  }

  // Crear botón Enseñanza
  if (!document.getElementById('btn-ensenanza')) {
    const btnEnsenanza = document.createElement('button');
    btnEnsenanza.id = 'btn-ensenanza';
    btnEnsenanza.className = 'btn-secondary';
    btnEnsenanza.textContent = '📖 Enseñanza Bíblica';
    btnEnsenanza.style.marginLeft = '10px';
    btnEnsenanza.onclick = () => {
      mostrarModulo('ensenanza');
      renderEnsenanzas();
      document.getElementById('ensenanza-admin-bar').style.display = modoAdmin ? '' : 'none';
    };
    document.querySelector('.header-right').appendChild(btnEnsenanza);
  }
  // Mostrar pasos por defecto
  mostrarModulo('pasos');
});

// Simulación de login admin para demo
function setModoAdmin(isAdmin) {
  modoAdmin = isAdmin;
  document.getElementById('user-info').style.display = isAdmin ? '' : 'none';
  document.getElementById('user-name').textContent = isAdmin ? 'Admin' : 'Invitado';
  document.getElementById('ensenanza-admin-bar').style.display = isAdmin && document.getElementById('container-ensenanza').style.display !== 'none' ? '' : 'none';
  renderEnsenanzas();
}

// Lógica de edición (placeholder)
function editarEnsenanza(id) {
  alert('Función de edición solo para admin (próximamente)');
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
    return `src="${newUrl}";`;
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
    modoAdmin = true;
    actualizarUILogin();
  }
  
  // Mostrar pasos por defecto
  mostrarModulo('pasos');
});