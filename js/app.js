/**
 * LA GACETA NOCTURNA - APLICACIÓN PRINCIPAL (UI & CONTROLADOR)
 * Manejo de eventos, renderizado periodístico, filtros en tiempo real y edición.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Estado de la aplicación
  const state = {
    currentSection: 'all',      // 'all' o ID de sección
    currentDateFilter: 'all',    // 'all', 'today', 'this-week', 'this-month'
    currentMotiveFilter: 'all',  // 'all' o nombre de motivo
    searchQuery: '',
    viewMode: 'columns',        // 'columns' o 'list'
    activeTag: null             // tag seleccionado en la nube lateral
  };

  // Referencias del DOM
  const elements = {
    // Menú Lateral y Navegación
    sidebar: document.getElementById('sidebar'),
    sidebarBackdrop: document.getElementById('sidebarBackdrop'),
    toggleSidebarBtn: document.getElementById('toggleSidebarBtn'),
    closeSidebarBtn: document.getElementById('closeSidebarBtn'),
    sectionNavList: document.getElementById('sectionNavList'),
    tagsCloudNav: document.getElementById('tagsCloudNav'),
    currentDateDisplay: document.getElementById('currentDateDisplay'),
    newCategoryBtn: document.getElementById('newCategoryBtn'),
    exportDataBtn: document.getElementById('exportDataBtn'),
    importDataBtn: document.getElementById('importDataBtn'),
    importFileInput: document.getElementById('importFileInput'),

    // Cabecera y Ribbon
    liveClock: document.getElementById('liveClock'),
    ribbonDayOfWeek: document.getElementById('ribbonDayOfWeek'),
    ribbonFullDate: document.getElementById('ribbonFullDate'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    dateFilterSelect: document.getElementById('dateFilterSelect'),
    motiveFilterSelect: document.getElementById('motiveFilterSelect'),
    viewModeColumns: document.getElementById('viewModeColumns'),
    viewModeList: document.getElementById('viewModeList'),
    openNewArticleModalBtn: document.getElementById('openNewArticleModalBtn'),
    fabRedactBtn: document.getElementById('fabRedactBtn'),

    // Banner de Sección
    sectionBanner: document.getElementById('sectionBanner'),
    bannerBadge: document.getElementById('bannerBadge'),
    bannerTitle: document.getElementById('bannerTitle'),
    bannerDesc: document.getElementById('bannerDesc'),
    bannerStatColumns: document.getElementById('bannerStatColumns'),
    bannerStatTasks: document.getElementById('bannerStatTasks'),

    // Contenedor Principal de Columnas
    columnsGrid: document.getElementById('columnsGrid'),
    emptyState: document.getElementById('emptyState'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),

    // Acciones de Pie
    printBroadsheetBtn: document.getElementById('printBroadsheetBtn'),
    clearAllCompletedTasksBtn: document.getElementById('clearAllCompletedTasksBtn'),
    resetToDefaultBtn: document.getElementById('resetToDefaultBtn'),

    // Modal de Edición
    articleModalOverlay: document.getElementById('articleModalOverlay'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    cancelModalBtn: document.getElementById('cancelModalBtn'),
    articleForm: document.getElementById('articleForm'),
    modalTitle: document.getElementById('modalTitle'),
    articleIdInput: document.getElementById('articleIdInput'),
    sectionSelect: document.getElementById('sectionSelect'),
    motiveInput: document.getElementById('motiveInput'),
    headlineInput: document.getElementById('headlineInput'),
    dateInput: document.getElementById('dateInput'),
    epigraphInput: document.getElementById('epigraphInput'),
    typeEditorial: document.getElementById('typeEditorial'),
    typeTasks: document.getElementById('typeTasks'),
    editorialContentGroup: document.getElementById('editorialContentGroup'),
    tasksContentGroup: document.getElementById('tasksContentGroup'),
    bodyTextInput: document.getElementById('bodyTextInput'),
    tasksBuilder: document.getElementById('tasksBuilder'),
    addTaskRowBtn: document.getElementById('addTaskRowBtn'),
    pinArticleCheckbox: document.getElementById('pinArticleCheckbox'),

    // Toast
    toast: document.getElementById('toastNotification')
  };

  /* ==========================================================================
     INICIALIZACIÓN DEL SISTEMA
     ========================================================================== */
  function initApp() {
    setupDateTime();
    populateSectionSelectOptions();
    renderSidebarNav();
    bindEvents();
    renderColumns();
    updateCounts();
    renderTagsCloud();
  }

  /* ==========================================================================
     RELOJ Y FECHAS
     ========================================================================== */
  function setupDateTime() {
    const now = new Date();
    
    // Reloj digital en vivo
    const updateClock = () => {
      const d = new Date();
      elements.liveClock.textContent = d.toLocaleTimeString('es-ES', { hour12: false });
    };
    updateClock();
    setInterval(updateClock, 1000);

    // Días de la semana en español
    const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    elements.ribbonDayOfWeek.textContent = days[now.getDay()];

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateFormatted = now.toLocaleDateString('es-ES', options).toUpperCase();
    elements.ribbonFullDate.textContent = dateFormatted;
    elements.currentDateDisplay.textContent = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

    // Fecha por defecto para el input del modal (YYYY-MM-DD)
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    elements.dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  /* ==========================================================================
     NAVEGACIÓN Y SECCIONES
     ========================================================================== */
  function populateSectionSelectOptions() {
    const sections = DataStore.getSections();
    elements.sectionSelect.innerHTML = sections.map(s => 
      `<option value="${s.id}">${s.icon} ${s.name}</option>`
    ).join('');
  }

  function renderSidebarNav() {
    const sections = DataStore.getSections();
    const articles = DataStore.getArticles();

    // Mantener "Edición Completa" al inicio
    let html = `
      <li>
        <button class="nav-link ${state.currentSection === 'all' ? 'active' : ''}" data-section="all" id="nav-all">
          <span class="nav-icon">📰</span>
          <span class="nav-text">Edición Completa</span>
          <span class="nav-count" id="count-all">${articles.length}</span>
        </button>
      </li>
    `;

    sections.forEach(s => {
      const count = articles.filter(a => a.sectionId === s.id).length;
      const isActive = state.currentSection === s.id ? 'active' : '';
      html += `
        <li>
          <button class="nav-link ${isActive}" data-section="${s.id}" id="nav-${s.id}">
            <span class="nav-icon">${s.icon || '📄'}</span>
            <span class="nav-text">${s.name}</span>
            <span class="nav-count" id="count-${s.id}">${count}</span>
          </button>
        </li>
      `;
    });

    elements.sectionNavList.innerHTML = html;

    // Vincular clics en botones de navegación
    elements.sectionNavList.querySelectorAll('.nav-link').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const secId = btn.getAttribute('data-section');
        switchSection(secId);
        closeMobileSidebar();
      });
    });
  }

  function switchSection(sectionId) {
    state.currentSection = sectionId;
    
    // Actualizar clase activa en la lista
    elements.sectionNavList.querySelectorAll('.nav-link').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-section') === sectionId);
    });

    updateBannerInfo();
    renderColumns();
  }

  function updateBannerInfo() {
    const sections = DataStore.getSections();
    const articles = DataStore.getArticles();

    if (state.currentSection === 'all') {
      elements.bannerBadge.textContent = 'PORTADA GENERAL';
      elements.bannerTitle.textContent = 'Edición Completa';
      elements.bannerDesc.textContent = 'Panorama exhaustivo de columnas, tareas y reflexiones según tus diversos estados de mentalidad.';
      
      const totalTasks = articles.reduce((acc, a) => acc + (a.tasks ? a.tasks.length : 0), 0);
      elements.bannerStatColumns.textContent = `${articles.length} Columnas`;
      elements.bannerStatTasks.textContent = `${totalTasks} Tareas`;
    } else {
      const sec = sections.find(s => s.id === state.currentSection);
      if (sec) {
        elements.bannerBadge.textContent = sec.kicker || 'SECCIÓN EDITORIAL';
        elements.bannerTitle.textContent = `${sec.icon} ${sec.name}`;
        elements.bannerDesc.textContent = sec.description || 'Artículos y notas correspondientes a esta columna temática.';
        
        const secArticles = articles.filter(a => a.sectionId === sec.id);
        const secTasks = secArticles.reduce((acc, a) => acc + (a.tasks ? a.tasks.length : 0), 0);
        elements.bannerStatColumns.textContent = `${secArticles.length} Columnas`;
        elements.bannerStatTasks.textContent = `${secTasks} Tareas`;
      }
    }
  }

  function updateCounts() {
    const articles = DataStore.getArticles();
    const allCount = document.getElementById('count-all');
    if (allCount) allCount.textContent = articles.length;

    const sections = DataStore.getSections();
    sections.forEach(s => {
      const countEl = document.getElementById(`count-${s.id}`);
      if (countEl) {
        countEl.textContent = articles.filter(a => a.sectionId === s.id).length;
      }
    });

    updateBannerInfo();
  }

  function renderTagsCloud() {
    const articles = DataStore.getArticles();
    const motivesMap = {};

    articles.forEach(a => {
      if (a.motive) {
        motivesMap[a.motive] = (motivesMap[a.motive] || 0) + 1;
      }
    });

    const motives = Object.keys(motivesMap);
    if (motives.length === 0) {
      elements.tagsCloudNav.innerHTML = '<span style="font-size:0.7rem; color:var(--text-muted);">Sin motivos registrados</span>';
      return;
    }

    elements.tagsCloudNav.innerHTML = motives.map(m => `
      <button class="tag-filter-chip ${state.activeTag === m ? 'active' : ''}" data-tag="${m}">
        ${m} (${motivesMap[m]})
      </button>
    `).join('');

    elements.tagsCloudNav.querySelectorAll('.tag-filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.getAttribute('data-tag');
        if (state.activeTag === tag) {
          state.activeTag = null;
          state.currentMotiveFilter = 'all';
          elements.motiveFilterSelect.value = 'all';
        } else {
          state.activeTag = tag;
          state.currentMotiveFilter = tag;
          elements.motiveFilterSelect.value = tag;
        }
        renderTagsCloud();
        renderColumns();
      });
    });
  }

  /* ==========================================================================
     FILTRADO Y RENDERIZADO DE COLUMNAS PERIODÍSTICAS
     ========================================================================== */
  function getFilteredArticles() {
    let articles = DataStore.getArticles();
    const now = new Date();

    // 1. Filtro por sección
    if (state.currentSection !== 'all') {
      articles = articles.filter(a => a.sectionId === state.currentSection);
    }

    // 2. Filtro por motivo
    if (state.currentMotiveFilter !== 'all') {
      articles = articles.filter(a => a.motive && a.motive.toLowerCase() === state.currentMotiveFilter.toLowerCase());
    }

    // 3. Filtro por fecha
    if (state.currentDateFilter !== 'all') {
      const todayStr = now.toISOString().slice(0, 10);
      
      if (state.currentDateFilter === 'today') {
        articles = articles.filter(a => a.date === todayStr);
      } else if (state.currentDateFilter === 'this-week') {
        // En los últimos 7 días
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        articles = articles.filter(a => {
          if (!a.date) return false;
          const artDate = new Date(a.date);
          return artDate >= oneWeekAgo && artDate <= now;
        });
      } else if (state.currentDateFilter === 'this-month') {
        const currentYearMonth = now.toISOString().slice(0, 7);
        articles = articles.filter(a => a.date && a.date.startsWith(currentYearMonth));
      }
    }

    // 4. Búsqueda por texto libre
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase();
      articles = articles.filter(a => {
        const headlineMatch = a.headline && a.headline.toLowerCase().includes(q);
        const epigraphMatch = a.epigraph && a.epigraph.toLowerCase().includes(q);
        const motiveMatch = a.motive && a.motive.toLowerCase().includes(q);
        const bodyMatch = a.bodyText && a.bodyText.toLowerCase().includes(q);
        const tasksMatch = Array.isArray(a.tasks) && a.tasks.some(t => t.text.toLowerCase().includes(q));
        return headlineMatch || epigraphMatch || motiveMatch || bodyMatch || tasksMatch;
      });
    }

    // 5. Ordenamiento: Primero los fijados (pinned), luego los más recientes por fecha o creación
    articles.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

    return articles;
  }

  function renderColumns() {
    const articles = getFilteredArticles();
    const sections = DataStore.getSections();
    const sectionsMap = Object.fromEntries(sections.map(s => [s.id, s]));

    if (articles.length === 0) {
      elements.columnsGrid.innerHTML = '';
      elements.emptyState.style.display = 'block';
      return;
    }

    elements.emptyState.style.display = 'none';

    // Generar HTML de cada columna periodística
    elements.columnsGrid.innerHTML = articles.map(art => {
      const sec = sectionsMap[art.sectionId] || { name: 'Opinión', icon: '📄' };
      const isTasks = art.contentType === 'tasks';
      const isPinned = !!art.pinned;

      // Formato de fecha
      let formattedDate = art.date || 'Sin fecha';
      try {
        if (art.date) {
          const parts = art.date.split('-');
          if (parts.length === 3) {
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            formattedDate = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
          }
        }
      } catch (e) {
        formattedDate = art.date;
      }

      // Render del cuerpo editorial o tareas
      let contentHtml = '';
      if (isTasks) {
        const tasksList = Array.isArray(art.tasks) ? art.tasks : [];
        const completedCount = tasksList.filter(t => t.done).length;
        contentHtml = `
          <div class="tasks-progress-indicator" style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--swamp-light); margin-bottom: 0.4rem;">
            Avance: ${completedCount}/${tasksList.length} tareas completadas
          </div>
          <ul class="article-tasks-list">
            ${tasksList.map(task => `
              <li class="task-item ${task.done ? 'is-done' : ''}" data-article-id="${art.id}" data-task-id="${task.id}">
                <input type="checkbox" class="task-checkbox-custom" ${task.done ? 'checked' : ''} aria-label="${escapeHtml(task.text)}">
                <span class="task-label">${escapeHtml(task.text)}</span>
              </li>
            `).join('')}
          </ul>
        `;
      } else {
        // Formatear texto con saltos de párrafo, citas y negritas
        const formattedBody = formatEditorialText(art.bodyText || '');
        contentHtml = `
          <div class="article-body-text">
            ${formattedBody}
          </div>
        `;
      }

      return `
        <article class="editorial-article-card ${isTasks ? 'type-tasks' : 'type-editorial'} ${isPinned ? 'is-pinned' : ''}" data-id="${art.id}">
          ${isPinned ? `<span class="pinned-badge">📌 PORTADA</span>` : ''}

          <!-- Metadatos de Cabecera -->
          <div class="article-header-meta">
            <span class="article-section-tag">
              <span>${sec.icon}</span> ${sec.name}
            </span>
            <div style="display:flex; align-items:center; gap:0.4rem;">
              ${art.motive ? `<span class="article-motive-pill">${escapeHtml(art.motive)}</span>` : ''}
              <span class="article-date">📅 ${formattedDate}</span>
            </div>
          </div>

          <!-- Titular y Subtítulo -->
          <h3 class="article-headline" style="cursor: pointer;" title="Clic para editar">${escapeHtml(art.headline)}</h3>
          ${art.epigraph ? `<div class="article-epigraph">${escapeHtml(art.epigraph)}</div>` : ''}

          <!-- Contenido de la Columna -->
          ${contentHtml}

          <!-- Pie y Acciones -->
          <div class="article-footer">
            <span class="article-byline">Por el Redactor • Edición de Guardia</span>
            <div class="article-actions">
              <button class="btn-card-action pin-btn" title="${isPinned ? 'Desfijar de Portada' : 'Fijar en Portada'}" data-action="pin">
                ${isPinned ? '★ Fijado' : '☆ Portada'}
              </button>
              <button class="btn-card-action edit-btn" title="Editar columna" data-action="edit">
                ✏️ Editar
              </button>
              <button class="btn-card-action delete delete-btn" title="Eliminar columna" data-action="delete">
                🗑️
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Conectar eventos a los elementos recién creados
    bindArticleEvents();
  }

  function bindArticleEvents() {
    // 1. Tareas Interactivas (Checkboxes)
    elements.columnsGrid.querySelectorAll('.task-item').forEach(item => {
      const checkbox = item.querySelector('.task-checkbox-custom');
      const label = item.querySelector('.task-label');
      const articleId = item.getAttribute('data-article-id');
      const taskId = item.getAttribute('data-task-id');

      const toggleAction = () => {
        const res = DataStore.toggleTaskStatus(articleId, taskId);
        if (res.success) {
          checkbox.checked = res.isDone;
          item.classList.toggle('is-done', res.isDone);
          updateCounts();
          showToast(res.isDone ? 'Tarea completada ✔' : 'Tarea pendiente');
        }
      };

      checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        toggleAction();
      });

      label.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAction();
      });
    });

    // 2. Acciones de Tarjeta: Pin, Edit, Delete, Clic en titular
    elements.columnsGrid.querySelectorAll('.editorial-article-card').forEach(card => {
      const id = card.getAttribute('data-id');

      // Clic en titular para editar
      const headline = card.querySelector('.article-headline');
      if (headline) {
        headline.addEventListener('click', () => openEditModal(id));
      }

      // Botón Pin
      const pinBtn = card.querySelector('[data-action="pin"]');
      if (pinBtn) {
        pinBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isNowPinned = DataStore.togglePin(id);
          renderColumns();
          showToast(isNowPinned ? 'Fijado en portada 📌' : 'Desfijado de portada');
        });
      }

      // Botón Edit
      const editBtn = card.querySelector('[data-action="edit"]');
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openEditModal(id);
        });
      }

      // Botón Delete
      const deleteBtn = card.querySelector('[data-action="delete"]');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('¿Deseas archivar y eliminar permanentemente esta columna periodística?')) {
            DataStore.deleteArticle(id);
            renderColumns();
            updateCounts();
            renderTagsCloud();
            showToast('Columna eliminada del registro 🗑️');
          }
        });
      }
    });
  }

  /* ==========================================================================
     FORMATEADOR DE TEXTO PERIODÍSTICO (DROP CAPS, CITAS Y PÁRRAFOS)
     ========================================================================== */
  function formatEditorialText(text) {
    if (!text || text.trim() === '') {
      return '<p><em>Sin contenido redactado en esta columna.</em></p>';
    }

    const paragraphs = text.split(/\n\s*\n/);
    return paragraphs.map(p => {
      const cleanP = p.trim();
      if (!cleanP) return '';

      // Si empieza con '>' es una cita editorial (Pull Quote)
      if (cleanP.startsWith('>')) {
        const quoteText = cleanP.replace(/^>\s*/, '');
        return `<blockquote>${escapeHtml(quoteText)}</blockquote>`;
      }

      // Negritas y Cursivas básicas
      let formatted = escapeHtml(cleanP);
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
      formatted = formatted.replace(/•\s*(.*?)(?=(\n|$))/g, '<li>$1</li>');

      if (formatted.includes('<li>')) {
        return `<ul style="margin: 0.5rem 0 0.8rem 1.2rem; line-height: 1.6;">${formatted}</ul>`;
      }

      return `<p>${formatted}</p>`;
    }).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ==========================================================================
     MODAL DE REDACCIÓN & EDICIÓN
     ========================================================================== */
  function openNewArticleModal() {
    elements.modalTitle.textContent = 'Nueva Columna Periodística';
    elements.articleIdInput.value = '';
    elements.headlineInput.value = '';
    elements.epigraphInput.value = '';
    elements.motiveInput.value = '';
    elements.bodyTextInput.value = '';
    elements.pinArticleCheckbox.checked = false;

    // Configurar sección activa si no es 'all'
    if (state.currentSection !== 'all') {
      elements.sectionSelect.value = state.currentSection;
    } else {
      elements.sectionSelect.value = 'daily-tasks';
    }

    // Configurar tipo según sección
    if (elements.sectionSelect.value.includes('tasks')) {
      elements.typeTasks.checked = true;
      showTasksBuilderUI();
      resetTasksBuilder([
        'Revisión matutina de prioridades',
        'Avance de proyecto principal',
        'Reflexión y balance de jornada'
      ]);
    } else {
      elements.typeEditorial.checked = true;
      showEditorialUI();
    }

    // Fecha actual
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    elements.dateInput.value = `${yyyy}-${mm}-${dd}`;

    elements.articleModalOverlay.classList.add('is-open');
    elements.headlineInput.focus();
  }

  function openEditModal(articleId) {
    const articles = DataStore.getArticles();
    const article = articles.find(a => a.id === articleId);
    if (!article) return;

    elements.modalTitle.textContent = 'Editar Columna Periodística';
    elements.articleIdInput.value = article.id;
    elements.sectionSelect.value = article.sectionId;
    elements.motiveInput.value = article.motive || '';
    elements.headlineInput.value = article.headline || '';
    elements.epigraphInput.value = article.epigraph || '';
    elements.dateInput.value = article.date || '';
    elements.pinArticleCheckbox.checked = !!article.pinned;

    if (article.contentType === 'tasks') {
      elements.typeTasks.checked = true;
      showTasksBuilderUI();
      const taskTexts = (article.tasks || []).map(t => t.text);
      resetTasksBuilder(taskTexts.length > 0 ? taskTexts : ['']);
    } else {
      elements.typeEditorial.checked = true;
      showEditorialUI();
      elements.bodyTextInput.value = article.bodyText || '';
    }

    elements.articleModalOverlay.classList.add('is-open');
  }

  function closeModal() {
    elements.articleModalOverlay.classList.remove('is-open');
  }

  function showEditorialUI() {
    elements.editorialContentGroup.style.display = 'block';
    elements.tasksContentGroup.style.display = 'none';
  }

  function showTasksBuilderUI() {
    elements.editorialContentGroup.style.display = 'none';
    elements.tasksContentGroup.style.display = 'block';
  }

  function resetTasksBuilder(items = ['']) {
    elements.tasksBuilder.innerHTML = '';
    items.forEach(text => addTaskBuilderRow(text));
  }

  function addTaskBuilderRow(initialText = '') {
    const row = document.createElement('div');
    row.className = 'task-builder-row';
    row.innerHTML = `
      <span style="color:var(--swamp-light); font-size: 0.9rem;">▫</span>
      <input type="text" class="task-builder-input" placeholder="Descripción de la tarea u objetivo..." value="${escapeHtml(initialText)}">
      <button type="button" class="btn-remove-task-row" title="Quitar tarea">✕</button>
    `;

    row.querySelector('.btn-remove-task-row').addEventListener('click', () => {
      if (elements.tasksBuilder.children.length > 1) {
        row.remove();
      } else {
        row.querySelector('.task-builder-input').value = '';
      }
    });

    elements.tasksBuilder.appendChild(row);
  }

  /* ==========================================================================
     GUARDAR FORMULARIO
     ========================================================================== */
  elements.articleForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = elements.articleIdInput.value;
    const sectionId = elements.sectionSelect.value;
    const headline = elements.headlineInput.value.trim();
    const epigraph = elements.epigraphInput.value.trim();
    const motive = elements.motiveInput.value.trim();
    const date = elements.dateInput.value;
    const pinned = elements.pinArticleCheckbox.checked;
    const isTasks = elements.typeTasks.checked;

    if (!headline) {
      alert('Por favor introduce un titular para la columna periodística.');
      return;
    }

    let tasks = [];
    let bodyText = '';

    if (isTasks) {
      const inputs = elements.tasksBuilder.querySelectorAll('.task-builder-input');
      inputs.forEach((inp, idx) => {
        const val = inp.value.trim();
        if (val) {
          tasks.push({
            id: 't-' + Date.now().toString(36) + '-' + idx,
            text: val,
            done: false
          });
        }
      });

      // Si estábamos editando y ya habían tareas completadas, preservar su estado
      if (id) {
        const existing = DataStore.getArticles().find(a => a.id === id);
        if (existing && Array.isArray(existing.tasks)) {
          tasks = tasks.map(newTask => {
            const old = existing.tasks.find(ot => ot.text === newTask.text);
            return old ? { ...newTask, done: old.done } : newTask;
          });
        }
      }
    } else {
      bodyText = elements.bodyTextInput.value.trim();
    }

    const articleData = {
      id: id || undefined,
      sectionId,
      headline,
      epigraph,
      motive,
      date,
      pinned,
      contentType: isTasks ? 'tasks' : 'editorial',
      bodyText,
      tasks
    };

    DataStore.saveArticle(articleData);
    closeModal();
    renderColumns();
    updateCounts();
    renderTagsCloud();
    showToast(id ? 'Columna actualizada con éxito 🖋️' : 'Publicado en La Gaceta 📰');
  });

  /* ==========================================================================
     EVENT LISTENERS & BINDINGS
     ========================================================================== */
  function bindEvents() {
    // 1. Alternancia de menú lateral móvil
    elements.toggleSidebarBtn.addEventListener('click', () => {
      elements.sidebar.classList.add('is-open');
      elements.sidebarBackdrop.classList.add('is-open');
    });

    elements.closeSidebarBtn.addEventListener('click', closeMobileSidebar);
    elements.sidebarBackdrop.addEventListener('click', closeMobileSidebar);

    // 2. Modal Open / Close
    elements.openNewArticleModalBtn.addEventListener('click', openNewArticleModal);
    elements.fabRedactBtn.addEventListener('click', openNewArticleModal);
    elements.closeModalBtn.addEventListener('click', closeModal);
    elements.cancelModalBtn.addEventListener('click', closeModal);
    elements.articleModalOverlay.addEventListener('click', (e) => {
      if (e.target === elements.articleModalOverlay) closeModal();
    });

    // 3. Conmutador de Tipo en Modal
    elements.typeEditorial.addEventListener('change', showEditorialUI);
    elements.typeTasks.addEventListener('change', showTasksBuilderUI);

    // 4. Agregar fila de tareas en builder
    elements.addTaskRowBtn.addEventListener('click', () => {
      addTaskBuilderRow();
      const rows = elements.tasksBuilder.querySelectorAll('.task-builder-input');
      if (rows.length) rows[rows.length - 1].focus();
    });

    // 5. Botones de Formato Rápido en Modal
    document.querySelectorAll('.btn-format').forEach(btn => {
      btn.addEventListener('click', () => {
        const wrap = btn.getAttribute('data-wrap');
        const textarea = elements.bodyTextInput;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selText = textarea.value.substring(start, end);

        if (wrap === '> ' || wrap === '• ') {
          textarea.setRangeText(`\n${wrap}${selText || 'Cita de texto'}\n`, start, end, 'end');
        } else {
          textarea.setRangeText(`${wrap}${selText || 'texto'}${wrap}`, start, end, 'end');
        }
        textarea.focus();
      });
    });

    // 6. Buscador Universal en tiempo real
    elements.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      elements.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
      renderColumns();
    });

    elements.clearSearchBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      state.searchQuery = '';
      elements.clearSearchBtn.style.display = 'none';
      renderColumns();
    });

    // 7. Filtro por Fecha
    elements.dateFilterSelect.addEventListener('change', (e) => {
      state.currentDateFilter = e.target.value;
      renderColumns();
    });

    // 8. Filtro por Motivo
    elements.motiveFilterSelect.addEventListener('change', (e) => {
      state.currentMotiveFilter = e.target.value;
      state.activeTag = e.target.value === 'all' ? null : e.target.value;
      renderTagsCloud();
      renderColumns();
    });

    // 9. Conmutador de Vistas (Grid de Columnas vs. Lista Compacta)
    elements.viewModeColumns.addEventListener('click', () => {
      elements.viewModeColumns.classList.add('active');
      elements.viewModeList.classList.remove('active');
      elements.columnsGrid.classList.remove('list-view');
      state.viewMode = 'columns';
    });

    elements.viewModeList.addEventListener('click', () => {
      elements.viewModeList.classList.add('active');
      elements.viewModeColumns.classList.remove('active');
      elements.columnsGrid.classList.add('list-view');
      state.viewMode = 'list';
    });

    // 10. Botón Restablecer Filtros
    elements.resetFiltersBtn.addEventListener('click', () => {
      state.currentSection = 'all';
      state.currentDateFilter = 'all';
      state.currentMotiveFilter = 'all';
      state.searchQuery = '';
      state.activeTag = null;
      elements.searchInput.value = '';
      elements.clearSearchBtn.style.display = 'none';
      elements.dateFilterSelect.value = 'all';
      elements.motiveFilterSelect.value = 'all';
      switchSection('all');
      renderTagsCloud();
    });

    // 11. Crear Nueva Sección Personalizada
    elements.newCategoryBtn.addEventListener('click', () => {
      const name = prompt('Nombre de la nueva sección editorial (ej. Lecturas Críticas, Finanzas & Patrimonio):');
      if (!name || !name.trim()) return;

      const icon = prompt('Ícono o emoji para la sección (ej. 📚, 🪙, 🏛️):', '📌') || '📌';
      const id = 'custom-' + Date.now().toString(36);

      DataStore.addCustomSection({
        id,
        name: name.trim(),
        icon,
        kicker: 'SECCIÓN ESPECIAL',
        description: `Columna personalizada dedicada a ${name.trim()}.`
      });

      populateSectionSelectOptions();
      renderSidebarNav();
      switchSection(id);
      showToast(`Nueva sección "${name}" creada exitosamente 📜`);
    });

    // 12. Respaldar (Exportar a JSON)
    elements.exportDataBtn.addEventListener('click', () => {
      const json = DataStore.exportDataJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `la-gaceta-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Copia de seguridad descargada exitosamente 💾');
    });

    // 13. Cargar (Importar desde JSON)
    elements.importDataBtn.addEventListener('click', () => {
      elements.importFileInput.click();
    });

    elements.importFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = DataStore.importDataJSON(event.target.result);
        if (result.success) {
          populateSectionSelectOptions();
          renderSidebarNav();
          renderColumns();
          updateCounts();
          renderTagsCloud();
          showToast(`Se importaron ${result.count} columnas satisfactoriamente 📂`);
        } else {
          alert('Error al importar archivo: ' + result.error);
        }
        elements.importFileInput.value = '';
      };
      reader.readAsText(file);
    });

    // 14. Acciones de Pie: Imprimir, Limpiar Tareas Hechas, Restaurar
    elements.printBroadsheetBtn.addEventListener('click', () => {
      window.print();
    });

    elements.clearAllCompletedTasksBtn.addEventListener('click', () => {
      if (confirm('¿Deseas purgar todas las tareas que ya han sido completadas?')) {
        DataStore.clearCompletedTasks();
        renderColumns();
        updateCounts();
        showToast('Tareas completadas purgadas 🧹');
      }
    });

    elements.resetToDefaultBtn.addEventListener('click', () => {
      if (confirm('¿Restaurar las columnas y notas originales de demostración? Los datos actuales se reiniciarán.')) {
        DataStore.resetToDefaults();
        populateSectionSelectOptions();
        renderSidebarNav();
        switchSection('all');
        renderTagsCloud();
        showToast('La Gaceta ha sido restaurada a su edición original 🔄');
      }
    });

    // Tecla Escape para cerrar modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.articleModalOverlay.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  function closeMobileSidebar() {
    elements.sidebar.classList.remove('is-open');
    elements.sidebarBackdrop.classList.remove('is-open');
  }

  function showToast(msg) {
    elements.toast.textContent = msg;
    elements.toast.classList.add('show');
    clearTimeout(elements.toast._timer);
    elements.toast._timer = setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 2800);
  }

  // Arrancar aplicación
  initApp();
});
