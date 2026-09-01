/* Selector de idioma + banner de sugerencia por navigator.language.
   Compartido entre / , /en/ , /pt/ , /fr/ (y los que se sumen después).
   No hace redirect automático: sólo sugiere, una vez, y respeta la elección. */
(function () {
  var LANGS = {
    es: { label: 'Español', path: '/', flag: '🇦🇷' },
    en: { label: 'English', path: '/en/', flag: '🇺🇸' },
    pt: { label: 'Português', path: '/pt/', flag: '🇧🇷' },
    fr: { label: 'Français', path: '/fr/', flag: '🇫🇷' },
    de: { label: 'Deutsch', path: '/de/', flag: '🇩🇪' },
    sv: { label: 'Svenska', path: '/sv/', flag: '🇸🇪' },
    zh: { label: '中文', path: '/zh/', flag: '🇨🇳' },
    ja: { label: '日本語', path: '/ja/', flag: '🇯🇵' },
    ko: { label: '한국어', path: '/ko/', flag: '🇰🇷' },
    ar: { label: 'العربية', path: '/ar/', flag: '🇸🇦' }
  };

  var UI = {
    es: { q: '¿Preferís verlo en {L}?', view: 'Ver en {L}', stay: 'Seguir en español' },
    en: { q: 'Prefer to read this in {L}?', view: 'View in {L}', stay: 'Continue in English' },
    pt: { q: 'Prefere ver isto em {L}?', view: 'Ver em {L}', stay: 'Continuar em português' },
    fr: { q: 'Préférez-vous lire ceci en {L} ?', view: 'Voir en {L}', stay: 'Continuer en français' },
    de: { q: 'Lieber auf {L} lesen?', view: 'Auf {L} ansehen', stay: 'Auf Deutsch bleiben' },
    sv: { q: 'Vill du hellre läsa detta på {L}?', view: 'Visa på {L}', stay: 'Fortsätt på svenska' },
    zh: { q: '更希望阅读{L}版本吗？', view: '查看{L}版本', stay: '继续阅读中文' },
    ja: { q: '{L}で読みますか？', view: '{L}で見る', stay: '日本語のまま続ける' },
    ko: { q: '{L}로 보시겠어요?', view: '{L}로 보기', stay: '한국어로 계속 보기' },
    ar: { q: 'هل تفضل قراءة هذا بـ{L}؟', view: 'عرض بـ{L}', stay: 'المتابعة بالعربية' }
  };

  var KEY = 'fibot_lang_pref';
  var current = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
  if (!LANGS[current]) current = 'es';

  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function mejorIdioma() {
    var candidatos = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'es'];
    for (var i = 0; i < candidatos.length; i++) {
      var code = String(candidatos[i]).slice(0, 2).toLowerCase();
      if (LANGS[code]) return code;
    }
    return 'es';
  }

  /* selector persistente (footer, y donde se agregue [data-lang-switcher]) */
  document.querySelectorAll('[data-lang-switcher]').forEach(function (host) {
    Object.keys(LANGS).forEach(function (code) {
      var a = document.createElement('a');
      a.href = LANGS[code].path;
      a.textContent = code.toUpperCase();
      a.setAttribute('lang', code);
      if (code === current) a.setAttribute('aria-current', 'page');
      a.addEventListener('click', function () { save(code); });
      host.appendChild(a);
    });
  });

  /* selector con banderas, en el nav (botón + desplegable) */
  document.querySelectorAll('[data-lang-nav]').forEach(function (host) {
    var actual = LANGS[current];

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-lang-btn';
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', actual.label);
    btn.innerHTML =
      '<span class="bandera" aria-hidden="true">' + actual.flag + '</span>' +
      '<span class="cod">' + current.toUpperCase() + '</span>' +
      '<span class="car" aria-hidden="true">▾</span>';

    var menu = document.createElement('div');
    menu.className = 'nav-lang-menu';
    menu.setAttribute('role', 'menu');

    Object.keys(LANGS).forEach(function (code) {
      var a = document.createElement('a');
      a.href = LANGS[code].path;
      a.setAttribute('role', 'menuitem');
      a.setAttribute('lang', code);
      a.innerHTML =
        '<span class="bandera" aria-hidden="true">' + LANGS[code].flag + '</span>' +
        '<span>' + LANGS[code].label + '</span>';
      if (code === current) a.setAttribute('aria-current', 'page');
      a.addEventListener('click', function () { save(code); });
      menu.appendChild(a);
    });

    function cerrar() {
      menu.classList.remove('abierto');
      btn.setAttribute('aria-expanded', 'false');
    }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var abrir = !menu.classList.contains('abierto');
      menu.classList.toggle('abierto', abrir);
      btn.setAttribute('aria-expanded', abrir ? 'true' : 'false');
    });
    document.addEventListener('click', cerrar);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrar();
    });

    host.appendChild(btn);
    host.appendChild(menu);
  });

  /* banner de sugerencia — una sola vez, sólo si no matchea el idioma actual */
  if (saved()) return;
  var sugerido = mejorIdioma();
  if (sugerido === current) return;

  var t = UI[current] || UI.es;
  var nombreSugerido = LANGS[sugerido].label;

  var banner = document.createElement('div');
  banner.className = 'lang-banner';
  banner.innerHTML =
    '<span>' + t.q.replace('{L}', nombreSugerido) + '</span>' +
    '<a href="' + LANGS[sugerido].path + '">' + t.view.replace('{L}', nombreSugerido) + '</a>' +
    '<button type="button">' + t.stay + '</button>';
  banner.querySelector('a').addEventListener('click', function () { save(sugerido); });
  banner.querySelector('button').addEventListener('click', function () {
    save(current);
    banner.remove();
  });
  document.body.prepend(banner);
})();
