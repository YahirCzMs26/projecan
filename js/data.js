/**
 * LA GACETA NOCTURNA - DATA LAYER & PERSISTENCIA LOCAL
 * Contiene datos iniciales de demostración redactados con estilo periodístico y utilidades de almacenamiento.
 */

const STORAGE_KEY_ARTICLES = 'gaceta_nocturna_articles_v1';
const STORAGE_KEY_CUSTOM_SECTIONS = 'gaceta_nocturna_custom_sections_v1';

// Definición de secciones predeterminadas con sus metadatos
const DEFAULT_SECTIONS = [
  {
    id: 'daily-tasks',
    name: 'Tareas Diarias',
    icon: '⚡',
    kicker: 'CRÓNICA COTIDIANA',
    description: 'Prioridades inmediatas, ejecuciones críticas del día y bitácora de cumplimiento.'
  },
  {
    id: 'weekly-tasks',
    name: 'Tareas de la Semana',
    icon: '🗓️',
    kicker: 'COMPROMISOS SEMANALES',
    description: 'Hitos clave y planeación operativa a mediano plazo.'
  },
  {
    id: 'future-projects',
    name: 'Proyectos a Futuro',
    icon: '🔭',
    kicker: 'PROSPECTIVA & PLANES',
    description: 'Iniciativas de largo aliento, visiones estratégicas e hipótesis de desarrollo.'
  },
  {
    id: 'political-opinions',
    name: 'Opiniones Políticas',
    icon: '⚖️',
    kicker: 'TRIBUNA DE OPINIÓN',
    description: 'Crítica de coyuntura, análisis de poder, civismo y dialéctica institucional.'
  },
  {
    id: 'life-reflections',
    name: 'Opiniones de Vida',
    icon: '🌿',
    kicker: 'FILOSOFÍA & EXISTENCIA',
    description: 'Principios éticos, reflexiones íntimas, gratitud y aprendizaje existencial.'
  },
  {
    id: 'career-advice',
    name: 'Consejos Laborales',
    icon: '💼',
    kicker: 'CRITERIO PROFESIONAL',
    description: 'Tácticas de negociación, maestría técnica, relaciones laborales y liderazgo.'
  }
];

// Artículos y columnas iniciales con redacción elocuente
const INITIAL_ARTICLES = [
  {
    id: 'art-001',
    sectionId: 'daily-tasks',
    headline: 'Manifiesto de Ejecución: Prioridades Implacables de Hoy',
    epigraph: 'La disciplina es el puente infranqueable entre el propósito y la realidad material.',
    motive: 'Urgente',
    date: '2026-10-13',
    pinned: true,
    contentType: 'tasks',
    bodyText: '',
    tasks: [
      { id: 't1', text: 'Revisión exhaustiva de contratos y acuerdos pendientes de la semana', done: true },
      { id: 't2', text: 'Consolidar reporte de métricas financieras y proyecciones de flujo', done: false },
      { id: 't3', text: 'Sesión de trabajo concentrado (90 minutos) sin distracciones digitales', done: true },
      { id: 't4', text: 'Lectura crítica de 20 páginas de filosofía política o estrategia', done: false },
      { id: 't5', text: 'Cierre de bitácora y recapitulación nocturna de aprendizajes', done: false }
    ],
    createdAt: 1791900000000
  },
  {
    id: 'art-002',
    sectionId: 'political-opinions',
    headline: 'El Declive de la Moderación y el Deber de la Lucidez Crítica',
    epigraph: 'Cuando el discurso público se polariza en extremos huecos, el pensamiento riguroso se convierte en un acto de resistencia.',
    motive: 'Crítico',
    date: '2026-10-12',
    pinned: true,
    contentType: 'editorial',
    bodyText: `Vivimos en una época donde la estridencia ha suplantado al argumento. Quienes participan en la arena pública suelen exigir lealtades ciegas a dogmas que caducan al compás del algoritmo semanal. 

Frente a este panorama, la postura cívica más digna es la del escepticismo constructivo: cuestionar a quienes prometen soluciones inmediatas a problemas estructurales complejos y vigilar con celo la preservación de las instituciones republicanas.

> "El verdadero contrapeso de la demagogia no es el fanatismo opuesto, sino la calma serena del ciudadano informado y libre de tutelas."

No debemos confundir el disenso con la enemistad, pero tampoco permitir que la condescendencia normalice el deterioro del bien común. Pensar con criterio propio es el primer deber político.`,
    tasks: [],
    createdAt: 1791813600000
  },
  {
    id: 'art-003',
    sectionId: 'life-reflections',
    headline: 'De la Quietud Interior Frente a la Furia del Entorno',
    epigraph: 'Dominar las propias reacciones es el único señorío auténtico que el ser humano puede reclamar.',
    motive: 'Filosófico',
    date: '2026-10-11',
    pinned: false,
    contentType: 'editorial',
    bodyText: `No son los sucesos externos los que perturban el ánimo del individuo, sino el juicio precipitado que sobre ellos se emite. Durante mucho tiempo he observado cómo el desgaste emocional proviene casi invariablemente de pretender doblegar variables ajenas a nuestro control directo.

Cultivar un santuario interior no es resignación ni aislamiento; es economía energética elemental. Al guardar silencio ante provocaciones banales y canalizar el vigor hacia lo que sí depende de nuestra voluntad, el caos exterior pierde su capacidad de dictar nuestro destino.

> "Aprende a navegar las aguas turbias con el ancla de tus convicciones firmemente afianzada en el fondo."

La paz mental no se encuentra en la ausencia de tormenta, sino en la solidez del timón.`,
    tasks: [],
    createdAt: 1791727200000
  },
  {
    id: 'art-004',
    sectionId: 'future-projects',
    headline: 'Plataforma de Conocimiento Autónomo & Sistema de Redes 2027',
    epigraph: 'La visión a largo plazo exige construir hoy los cimientos que nadie ve pero que todo sostendrán.',
    motive: 'Estratégico',
    date: '2026-10-10',
    pinned: false,
    contentType: 'editorial',
    bodyText: `La arquitectura conceptual para el nuevo ecosistema digital debe basarse en principios de soberanía de datos, bajo acoplamiento y resiliencia ante caídas de proveedores comerciales centralizados.

Fase I: Diseño de base de datos distribuida y contratos de interfaz.
Fase II: Motor de procesamiento semántico local sin fuga de telemetría.
Fase III: Despliegue en servidores autónomos con auditoría de código abierto.

El objetivo no es la prisa comercial, sino la longevidad y excelencia artesanal del sistema. Todo proyecto que aspira a perdurar debe resistir la tentación de atajos mediocres.`,
    tasks: [],
    createdAt: 1791640800000
  },
  {
    id: 'art-005',
    sectionId: 'career-advice',
    headline: 'Diez Reglas de Oro para la Negociación de Alto Nivel y Carrera',
    epigraph: 'En el ámbito profesional, no recibes lo que mereces, sino lo que sabes sustentar con métricas y aplomo.',
    motive: 'Estratégico',
    date: '2026-10-09',
    pinned: false,
    contentType: 'editorial',
    bodyText: `A lo largo de los años en posiciones de responsabilidad, estas lecciones han probado ser invaluables para quien busca consolidar autoridad técnica y estratégica:

1. **Nunca negocies desde la necesidad evidente**: La postura de poder reside en la disposición genuina a levantarse de la mesa si las condiciones vulneran tu valor.
2. **Documenta el impacto silencioso**: Quien no visibiliza sus victorias permite que otros se apropien del mérito.
3. **Escucha el 70% del tiempo**: Las mayores concesiones del interlocutor se revelan cuando le permites llenar los silencios.
4. **La reputación de confiabilidad es tu activo más rentable**: Cumple lo prometido, entrega antes de tiempo y mantén reserva absoluta sobre asuntos sensibles.`,
    tasks: [],
    createdAt: 1791554400000
  },
  {
    id: 'art-006',
    sectionId: 'weekly-tasks',
    headline: 'Bloque de Metas Operativas: Semana 42',
    epigraph: 'La semana no se improvisa; se conquista día a día con orden militar.',
    motive: 'Prioritario',
    date: '2026-10-13',
    pinned: false,
    contentType: 'tasks',
    bodyText: '',
    tasks: [
      { id: 'w1', text: 'Auditoría integral de seguridad y copias de seguridad locales', done: true },
      { id: 'w2', text: 'Cierre del borrador del ensayo sobre teoría de sistemas complejos', done: false },
      { id: 'w3', text: 'Entrevista de alineación estratégica con socios comerciales', done: false },
      { id: 'w4', text: 'Planificación presupuestaria del cuarto trimestre', done: false },
      { id: 'w5', text: 'Mantenimiento y depuración de activos físicos y digitales', done: true }
    ],
    createdAt: 1791890000000
  }
];

// Módulo de Datos
const DataStore = {
  // Obtener artículos guardados o sembrar iniciales
  getArticles() {
    const raw = localStorage.getItem(STORAGE_KEY_ARTICLES);
    if (!raw) {
      this.saveArticles(INITIAL_ARTICLES);
      return [...INITIAL_ARTICLES];
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error al parsear artículos de localStorage', e);
      return [...INITIAL_ARTICLES];
    }
  },

  saveArticles(articles) {
    localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articles));
  },

  // Obtener secciones (predeterminadas + creadas por el usuario)
  getSections() {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_SECTIONS);
    const custom = raw ? JSON.parse(raw) : [];
    return [...DEFAULT_SECTIONS, ...custom];
  },

  addCustomSection(section) {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_SECTIONS);
    const custom = raw ? JSON.parse(raw) : [];
    custom.push(section);
    localStorage.setItem(STORAGE_KEY_CUSTOM_SECTIONS, JSON.stringify(custom));
  },

  // Guardar o actualizar artículo
  saveArticle(articleData) {
    const articles = this.getArticles();
    const existingIndex = articles.findIndex(a => a.id === articleData.id);

    if (existingIndex >= 0) {
      articles[existingIndex] = {
        ...articles[existingIndex],
        ...articleData,
        updatedAt: Date.now()
      };
    } else {
      articles.unshift({
        ...articleData,
        id: 'art-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        createdAt: Date.now()
      });
    }

    this.saveArticles(articles);
    return articles;
  },

  // Eliminar artículo
  deleteArticle(id) {
    let articles = this.getArticles();
    articles = articles.filter(a => a.id !== id);
    this.saveArticles(articles);
    return articles;
  },

  // Alternar checkbox de una tarea específica dentro de un artículo
  toggleTaskStatus(articleId, taskId) {
    const articles = this.getArticles();
    const article = articles.find(a => a.id === articleId);
    if (article && Array.isArray(article.tasks)) {
      const task = article.tasks.find(t => t.id === taskId);
      if (task) {
        task.done = !task.done;
        this.saveArticles(articles);
        return { success: true, isDone: task.done };
      }
    }
    return { success: false };
  },

  // Alternar pin/fijado en primera plana
  togglePin(articleId) {
    const articles = this.getArticles();
    const article = articles.find(a => a.id === articleId);
    if (article) {
      article.pinned = !article.pinned;
      this.saveArticles(articles);
      return article.pinned;
    }
    return false;
  },

  // Limpiar todas las tareas completadas
  clearCompletedTasks() {
    const articles = this.getArticles();
    articles.forEach(article => {
      if (Array.isArray(article.tasks)) {
        article.tasks = article.tasks.filter(t => !t.done);
      }
    });
    this.saveArticles(articles);
    return articles;
  },

  // Restaurar valores iniciales
  resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY_ARTICLES);
    localStorage.removeItem(STORAGE_KEY_CUSTOM_SECTIONS);
    return this.getArticles();
  },

  // Exportar a JSON
  exportDataJSON() {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      articles: this.getArticles(),
      customSections: (() => {
        const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_SECTIONS);
        return raw ? JSON.parse(raw) : [];
      })()
    };
    return JSON.stringify(data, null, 2);
  },

  // Importar desde JSON
  importDataJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.articles)) {
        this.saveArticles(data.articles);
        if (Array.isArray(data.customSections)) {
          localStorage.setItem(STORAGE_KEY_CUSTOM_SECTIONS, JSON.stringify(data.customSections));
        }
        return { success: true, count: data.articles.length };
      }
      return { success: false, error: 'Formato incompatible: no contiene artículos válidos.' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};
