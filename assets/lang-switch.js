/* Selector de idioma: el desplegable con banderas del nav y el listado del footer.
   Compartido entre las 10 páginas. El redirect automático por navigator.language
   vive aparte, inline en el <head> de index.html (así corre antes de pintar la
   página en español — este archivo se carga al final del body). */
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

  var KEY = 'fibot_lang_pref';
  var current = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
  if (!LANGS[current]) current = 'es';

  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

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
})();
