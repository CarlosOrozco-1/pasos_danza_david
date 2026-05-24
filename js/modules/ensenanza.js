import { state } from '../state.js';
import { escapeHtml } from './biblia.js';

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

export function toggleAccordionGlobal() {
  const totalEnsenanzas = ensenanzasBiblicas.length + danzasCaidas.length;
  if (state.ensenanzasExpandidas.size === totalEnsenanzas) {
    // Si todas están expandidas, contraer todas
    state.ensenanzasExpandidas.clear();
  } else {
    // Expandir todas
    ensenanzasBiblicas.forEach(d => state.ensenanzasExpandidas.add(d.id));
    danzasCaidas.forEach(d => state.ensenanzasExpandidas.add(d.id));
  }
  renderEnsenanzas();
}

export function toggleEnsenanza(id) {
  if (state.ensenanzasExpandidas.has(id)) {
    state.ensenanzasExpandidas.delete(id);
  } else {
    state.ensenanzasExpandidas.add(id);
  }
  renderEnsenanzas();
}

export function renderEnsenanzas() {
  const container = document.getElementById('ensenanza-lista');
  if (!container) return;

  const totalEnsenanzas = ensenanzasBiblicas.length + danzasCaidas.length;
  const todasExpandidas = state.ensenanzasExpandidas.size === totalEnsenanzas && totalEnsenanzas > 0;
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
    const isExpanded = state.ensenanzasExpandidas.has(danza.id);
    
    let cardHtml = `
      <div class="accordion-card ${isCaida ? 'card-caida' : ''}">
        <div class="accordion-header" data-id="${danza.id}">
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
                <div class="versiculo-tooltip-container">
                  <span class="versiculo-cita">📖 ${escapeHtml(v.cita)}</span>
                  ${v.texto ? `<div class="versiculo-tooltip-text">"${escapeHtml(v.texto)}"</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      if (state.modoAdmin) {
        cardHtml += `
          <div class="ensenanza-actions">
            <button class="btn-edit" data-edit-id="${danza.id}">✏️ Editar</button>
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
