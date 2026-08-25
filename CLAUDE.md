# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es

La **home comercial de FiBOT** — una página estática servida por GitHub Pages en
**https://www.fibot.ar**. Vende automatización por WhatsApp a PyMEs argentinas,
con cuatro verticales concretas hoy (flotas, farmacia, encomiendas,
vencimientos) listadas en `#frentes`.

**No hay build, ni bundler, casi ninguna dependencia.** Se edita `index.html`
y se pushea. La única externa es Google Fonts (Space Grotesk, sólo para la
marca — ver abajo); si no carga, cae a Helvetica/Arial sin romper nada.

## La marca

El símbolo es la sucesión de Fibonacci (1, 1, 2, 3, 5, 8) como cuadrados
anidados, con el "1" más chico en verde — la única pieza con color. Manual
completo y los seis SVG fuente en `assets/logo/` (el repo de origen de estos
assets es un export del skill `design`; ese `.dc.html` no se versiona acá).

- **`simbolo-oscuro` / `logo-horizontal-oscuro`**: trazo y texto oscuros
  (`#100F0D`), para fondo claro — es lo que usan el header y el footer de
  esta página, ambos sobre `--hueso`. `logo-horizontal-oscuro.svg` no vino en
  el export original (sólo el claro); se derivó a mano con los mismos colores
  de `simbolo-oscuro.svg` — si en algún momento llega un nuevo export del
  kit, chequear que siga alineado.
- **`simbolo-claro` / `logo-horizontal-claro`**: trazo y texto claros
  (`#F2EEE6`), para fondo oscuro (`--tinta`).
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
WhatsApp"), no un rubro. Por eso el hero, "El enganche" y la nebulosa —lo
primero que ve cualquiera— están escritos en genérico (sistema/planillas/
papeles/gente, "Pedido 4471", "Caso 412"): si lideran con flota, encasillan
el resto de la página antes de que el visitante llegue a `#frentes`, que es
donde SÍ corresponde nombrar cada rubro con sus números reales (267 unidades,
+10.000 productos). Ídem los ejemplos de código (`FUENTES`, `CHEQUEOS`,
`MSG` en el canvas del enganche, `MSG`/`CHEQUEOS` en la nebulosa): son
genéricos a propósito, no flota disfrazada. Al sumar un rubro nuevo a
`#frentes`, no lo repliques en el hero/enganche/nebulosa — esa genericidad es
la que hace que sumar un quinto rubro mañana no requiera reescribir la mitad
de la página.

## Verificar antes de entregar

No hay tests, pero la página tiene JavaScript y **se rompe en silencio**: si el
script falla, no salta ningún error visible — simplemente los números quedan en
cero o las secciones no aparecen. Abrila en un navegador de verdad antes de decir
que está lista:

```bash
python3 -m http.server 8000
```

Y chequear las cuatro cosas que ya se rompieron una vez: que las cifras terminen
en 90 / 10.000 / 4, que ninguna sección quede sin su clase `.visible`, que el
canvas del diagrama pinte algo, y que no haya scroll horizontal.

## Reglas del JavaScript de esta página

Las tres son deliberadas y hay que sostenerlas:

1. **Nada aparece por JS.** El contenido está en el HTML; el script sólo lo
   anima. Los `.rev` se esconden únicamente si el script arrancó (clase `js` en
   el `<html>`). Si el JS falla, la página se ve completa, no en blanco.
2. **Las cifras finales están escritas en el HTML.** El contador las pisa, nunca
   las genera. Un contador que no arranca y deja un cero es peor que no animar.
3. **Todo respeta `prefers-reduced-motion`.** Con movimiento reducido el
   diagrama queda en un cuadro fijo y los contadores muestran el valor final.

## El diagrama del "enganche"

Un `<canvas>` que dibuja las cuatro fuentes de datos confluyendo en FiBOT y
saliendo por WhatsApp. **La nube de puntos es el cerebro, no el fondo**: un campo
de partículas decorativo detrás del texto no dice nada — acá cada punto está
adentro del nodo que procesa, y es el gráfico de la cifra "4 fuentes cruzadas".

Lee `--tinta`, `--hueso` y `--bronce-vivo` en vivo, así que **se da vuelta solo
con el tema**. Si agregás colores, leelos igual en vez de escribirlos fijos.

Las etiquetas se dibujan al final, con el fondo recortado atrás: los cables
convergen y por fuerza pasan por donde va el texto.

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
