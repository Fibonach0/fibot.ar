/* Selector de idioma: el desplegable con banderas del nav y el listado del footer.
   Compartido entre las 10 páginas. El redirect automático por navigator.language
   vive aparte, inline en el <head> de index.html (así corre antes de pintar la
   página en español — este archivo se carga al final del body). */
(function () {
  var LANGS = {
    es: { label: 'Español', path: '/', flag: '/assets/flags/es.svg' },
    en: { label: 'English', path: '/en/', flag: '/assets/flags/en.svg' },
    pt: { label: 'Português', path: '/pt/', flag: '/assets/flags/pt.svg' },
    fr: { label: 'Français', path: '/fr/', flag: '/assets/flags/fr.svg' },
    de: { label: 'Deutsch', path: '/de/', flag: '/assets/flags/de.svg' },
    sv: { label: 'Svenska', path: '/sv/', flag: '/assets/flags/sv.svg' },
    zh: { label: '中文', path: '/zh/', flag: '/assets/flags/zh.svg' },
    ja: { label: '日本語', path: '/ja/', flag: '/assets/flags/ja.svg' },
    ko: { label: '한국어', path: '/ko/', flag: '/assets/flags/ko.svg' },
    ar: { label: 'العربية', path: '/ar/', flag: '/assets/flags/ar.svg' }
  };

  var KEY = 'fibot_lang_pref';
  var current = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
  if (!LANGS[current]) current = 'es';

  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  /* bandera como <img> propia, no emoji: en Windows los emoji de banderas
     regionales no siempre renderizan como bandera (aparece el código de
     país en un recuadro gris), así que dependemos de un SVG nuestro para
     que se vea igual en cualquier sistema operativo. */
  function bandera(code) {
    var img = document.createElement('img');
    img.className = 'bandera';
    img.src = LANGS[code].flag;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.width = 20;
    img.height = 15;
    return img;
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
    btn.appendChild(bandera(current));
    btn.insertAdjacentHTML('beforeend',
      '<span class="cod">' + current.toUpperCase() + '</span>' +
      '<span class="car" aria-hidden="true">▾</span>');

    var menu = document.createElement('div');
    menu.className = 'nav-lang-menu';
    menu.setAttribute('role', 'menu');

    Object.keys(LANGS).forEach(function (code) {
      var a = document.createElement('a');
      a.href = LANGS[code].path;
      a.setAttribute('role', 'menuitem');
      a.setAttribute('lang', code);
      a.appendChild(bandera(code));
      a.insertAdjacentHTML('beforeend', '<span>' + LANGS[code].label + '</span>');
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
