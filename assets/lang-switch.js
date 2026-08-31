/* Selector de idioma + banner de sugerencia por navigator.language.
   Compartido entre / , /en/ , /pt/ , /fr/ (y los que se sumen después).
   No hace redirect automático: sólo sugiere, una vez, y respeta la elección. */
(function () {
  var LANGS = {
    es: { label: 'Español', path: '/' },
    en: { label: 'English', path: '/en/' },
    pt: { label: 'Português', path: '/pt/' },
    fr: { label: 'Français', path: '/fr/' },
    de: { label: 'Deutsch', path: '/de/' },
    sv: { label: 'Svenska', path: '/sv/' }
  };

  var UI = {
    es: { q: '¿Preferís verlo en {L}?', view: 'Ver en {L}', stay: 'Seguir en español' },
    en: { q: 'Prefer to read this in {L}?', view: 'View in {L}', stay: 'Continue in English' },
    pt: { q: 'Prefere ver isto em {L}?', view: 'Ver em {L}', stay: 'Continuar em português' },
    fr: { q: 'Préférez-vous lire ceci en {L} ?', view: 'Voir en {L}', stay: 'Continuer en français' },
    de: { q: 'Lieber auf {L} lesen?', view: 'Auf {L} ansehen', stay: 'Auf Deutsch bleiben' },
    sv: { q: 'Vill du hellre läsa detta på {L}?', view: 'Visa på {L}', stay: 'Fortsätt på svenska' }
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
