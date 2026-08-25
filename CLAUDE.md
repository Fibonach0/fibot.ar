# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es

La **home comercial de FiBOT** — una página estática servida por GitHub Pages en
**https://www.fibot.ar**. Vende automatización por WhatsApp a PyMEs argentinas,
con cinco verticales concretas hoy (flotas, farmacia, encomiendas, negocios/
kiosco, vencimientos) listadas en `#frentes`. Reemplaza además a los PDF de
venta: `#costo` porta la fórmula de costo-de-no-actuar y `#tecnico` el bloque
de "así está armado" que antes sólo vivían en los mazos de PDF — la idea es
poder pasar el link del sitio en vez de un adjunto.

**Tema oscuro** ("Sitio v2", ago 2026) — reemplazó por completo al tema claro
anterior. Vino de un handoff de Claude Design (`FiBOT Sitio v2.dc.html`,
recreado a mano en HTML/CSS/JS plano, no copiado literal: el bundle es un
prototipo con su propio runtime de React, no algo para shippear).

**No hay build, ni bundler, casi ninguna dependencia.** Se edita `index.html`
y se pushea. La única externa es Google Fonts (Space Grotesk, sólo para la
marca — ver abajo); si no carga, cae a Helvetica/Arial sin romper nada.

## La marca

El símbolo es la sucesión de Fibonacci (1, 1, 2, 3, 5, 8) como cuadrados
anidados, con el "1" más chico en verde — la única pieza con color. Manual
completo y los seis SVG fuente en `assets/logo/` (el repo de origen de estos
assets es un export del skill `design`; ese `.dc.html` no se versiona acá).

- **`simbolo-claro` / `logo-horizontal-claro`**: trazo y texto claros
  (`#F2EEE6`/`#ece6db`), para fondo oscuro — es lo que usan el header y el
  footer de esta página, porque **todo el sitio es oscuro desde el tema v2**.
- **`simbolo-oscuro` / `logo-horizontal-oscuro`**: trazo y texto oscuros
  (`#100F0D`), para fondo claro. Ya no se usa en esta página (no queda ningún
  bloque claro), pero sigue siendo un asset de marca válido para otros
  contextos (papelería, presentaciones con fondo claro). No lo borres.
  `logo-horizontal-oscuro.svg` no vino en el export original del kit (sólo el
  claro); se derivó a mano con los mismos colores de `simbolo-oscuro.svg` —
  si en algún momento llega un nuevo export, chequear que siga alineado.
- **`simbolo-monocromo`**: usa `currentColor`, para bordado/vinilo/sello — un
  solo color, hereda del contenedor.
- **`favicon.svg`** (en la raíz, no en `assets/logo/`) y
  **`avatar-whatsapp.svg`**: variantes recortadas para tamaño chico. El
  avatar hay que exportarlo a PNG antes de subirlo — WhatsApp no toma SVG.

**Las cuatro reglas del símbolo** (no negociables si se vuelve a tocar):
el verde es siempre el cuadrado de 1, nunca otra parte del dibujo; nada de
sombra, degradado ni relieve; no se rota ni se estira (proporción 13:8); si
no entra completo, se usa sólo el cuadrado de 8 (el que tiene el "Fi") —
nunca media secuencia.

El header/footer inlinean el SVG directo en el HTML (no `<img src>`), porque
un SVG referenciado por `<img>` no puede heredar `Space Grotesk` del
`<link>` de la página — queda en un contexto aparte y usaría el fallback
igual. Inline sí lo hereda.

### El criterio que ordena el copy: generalizar el relato, no la prueba

La página vende **un patrón** ("cruzar varias fuentes y contestar por
WhatsApp"), no un rubro. Por eso el hero, `#idea` y `#motor` —lo primero que
ve cualquiera— están escritos en genérico (sistema/planillas/papeles/gente,
"Pedido 4471", "Caso 412"): si lideran con flota, encasillan el resto de la
página antes de que el visitante llegue a `#frentes`, que es donde SÍ
corresponde nombrar cada rubro con sus números reales (267 unidades,
+10.000 productos, etc.). Al sumar un rubro nuevo a `#frentes`, no lo
repliques en el hero/`#idea`/`#motor` — esa genericidad es la que hace que
sumar un rubro nuevo mañana no requiera reescribir la mitad de la página.

## Verificar antes de entregar

No hay tests, pero la página tiene JavaScript y **se rompe en silencio**: si el
script falla, no salta ningún error visible — simplemente los números quedan en
cero, el chat del hero no corre, o la espiral de `#motor` no revela. Abrila en
un navegador de verdad antes de decir que está lista:

```bash
python3 -m http.server 8000
```

Y chequear: que las cuatro cifras de `.franja` terminen en 250+ / 390.000+ /
10.000+ / 90+, que el chat del hero corra su secuencia completa sin quedarse a
mitad de un mensaje, que no haya scroll horizontal (los `.fondo-luz` decorativos
sangran fuera del viewport a propósito — si reaparece scroll horizontal,
sospechá primero de ahí), y que la consola no tire errores de JS (aparte del
fetch de Google Fonts, que en un sandbox sin salida a internet es esperable y
no rompe nada — cae al fallback de fuente).

## Reglas del JavaScript de esta página

Deliberadas, hay que sostenerlas:

1. **Las cifras finales están escritas en el HTML** (`data-hasta` en cada
   `.cif .v`). El contador las pisa, nunca las genera; si `toLocaleString`
   no está disponible cae al número crudo, nunca a un `0`.
2. **El reveal por scroll es CSS puro** (`animation-timeline:view()` +
   `animation-range` en `.rev`/`.rev-c`/`.regla`), no IntersectionObserver.
   Sin soporte del navegador, el contenido simplemente no se anima — nunca
   queda invisible, porque no depende de que ninguna clase `js` se agregue.
3. **Todo respeta `prefers-reduced-motion`**: los contadores muestran directo
   el valor final y las animaciones con `animation-timeline` no dependen de
   scroll para mostrar contenido.

## El motor (`#motor`) y el chat del hero

`#motor` reemplazó al viejo diagrama de canvas: ahora es una espiral (los
cuadrados de Fibonacci, otra vez) que se revela por tramos a medida que se
hace scroll (`actualizar()`/`tramo()` en el script), sin `<canvas>` — es SVG +
CSS. El hero tiene su propia secuencia de chat de WhatsApp escrita a mano
(`correr()`, `tipearEn()`, `burbuja()`, `escribiendoEl()`): tipea, muestra
"escribiendo…", widget de fecha, típico de un chat real. Si se agrega un
mensaje nuevo a la secuencia, usar el span `inputTexto` ya expuesto para
tipear en el campo de texto — no reinventar la manipulación del DOM del
input.

## Convenciones

- **Nunca commitear directo a `main`**: rama + PR. Pages publica desde `main`,
  así que un push directo es un deploy a producción sin revisión.
- `CNAME` va en la raíz y **en mayúsculas**, o Pages lo ignora.
- En Cloudflare el registro va **sin proxy** hasta que GitHub emita el
  certificado.
- El teléfono (`+54 9 11 2852-4957`) aparece en el JSON-LD, en la nav, en el
  cierre y en el footer: si cambia, hay que buscarlo en todos lados.
- Piezas tomadas de [HyperUI](https://github.com/markmead/hyperui) y
  [AstroWind](https://github.com/onwidget/astrowind), ambas **MIT** — no exigen
  atribución visible, pero conviene no perder de vista de dónde salieron.
