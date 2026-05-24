export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

let bibliaInicializada = false;
let bibleBooks = [];

export async function initBiblia() {
  if (bibliaInicializada) return;
  bibliaInicializada = true;
  
  const contenido = document.getElementById('biblia-contenido');
  const selectLibro = document.getElementById('select-libro');
  const selectCapitulo = document.getElementById('select-capitulo');
  const btnLeer = document.getElementById('btn-leer-biblia');
  
  if (!contenido || !selectLibro || !selectCapitulo || !btnLeer) return;

  contenido.innerHTML = '<div class="biblia-loading"><div class="spinner"></div>Cargando libros...</div>';
  
  try {
    const response = await fetch('https://bible-api.deno.dev/api/books');
    if (!response.ok) throw new Error('Error de red');
    bibleBooks = await response.json();
    
    // Poblar select de libros
    selectLibro.innerHTML = '<option value="">Selecciona un libro...</option>';
    bibleBooks.forEach(libro => {
      const option = document.createElement('option');
      option.value = libro.abrev;
      option.textContent = libro.names[0];
      selectLibro.appendChild(option);
    });
    
    contenido.innerHTML = '<div class="biblia-placeholder">Selecciona un libro y capítulo para comenzar a leer.</div>';
    
  } catch (error) {
    console.error('Error cargando libros:', error);
    contenido.innerHTML = '<div class="login-error">Hubo un error al cargar los libros de la Biblia. Por favor, intenta de nuevo más tarde.</div>';
  }
  
  // Event listener para cuando cambie el libro
  selectLibro.addEventListener('change', (e) => {
    const abrev = e.target.value;
    selectCapitulo.innerHTML = '<option value="">Capítulo...</option>';
    selectCapitulo.disabled = true;
    btnLeer.disabled = true;
    
    if (abrev) {
      const libro = bibleBooks.find(b => b.abrev === abrev);
      if (libro) {
        for (let i = 1; i <= libro.chapters; i++) {
          const option = document.createElement('option');
          option.value = i;
          option.textContent = i;
          selectCapitulo.appendChild(option);
        }
        selectCapitulo.disabled = false;
      }
    }
  });
  
  // Event listener para cuando cambie el capítulo
  selectCapitulo.addEventListener('change', (e) => {
    btnLeer.disabled = !e.target.value;
  });
  
  // Event listener para botón Leer
  btnLeer.addEventListener('click', () => {
    const libroAbrev = selectLibro.value;
    const capitulo = selectCapitulo.value;
    if (libroAbrev && capitulo) {
      cargarCapitulo(libroAbrev, capitulo);
    }
  });
}

async function cargarCapitulo(abrev, capitulo) {
  const contenido = document.getElementById('biblia-contenido');
  contenido.innerHTML = '<div class="biblia-loading"><div class="spinner"></div>Cargando capítulo...</div>';
  
  try {
    const url = `https://bible-api.deno.dev/api/read/rv1960/${abrev.toLowerCase()}/${capitulo}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al cargar capítulo');
    
    const data = await response.json();
    
    let html = `<h3 class="capitulo-titulo">${data.name} ${data.chapter}</h3>`;
    
    data.vers.forEach(v => {
      html += `<div class="versiculo-lectura">`;
      if (v.study) {
        html += `<span class="versiculo-study">${escapeHtml(v.study)}</span>`;
      }
      html += `<span class="versiculo-num">${v.number}</span>${escapeHtml(v.verse)}</div>`;
    });
    
    contenido.innerHTML = html;
    
  } catch (error) {
    console.error('Error cargando versículos:', error);
    contenido.innerHTML = '<div class="login-error">Error al cargar el capítulo. Por favor, intenta de nuevo.</div>';
  }
}
