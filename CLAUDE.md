# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es

La **home comercial de FiBOT** — una página estática servida por GitHub Pages en
**https://www.fibot.ar**. Vende tres verticales de automatización por WhatsApp
(flotas, farmacia, vencimientos) a PyMEs argentinas.

**No hay build, ni bundler, ni dependencias.** Se edita `index.html` y se pushea.

## Verificar antes de entregar

No hay tests, pero la página tiene JavaScript y **se rompe en silencio**: si el
script falla, no salta ningún error visible — simplemente los números quedan en
cero o las secciones no aparecen. Abrila en un navegador de verdad antes de decir
que está lista:

```bash
python3 -m http.server 8000
```

Y chequear las cuatro cosas que ya se rompieron una vez: que las cifras terminen
en 267 / 11 / 4, que ninguna sección quede sin su clase `.visible`, que el canvas
del diagrama pinte algo, y que no haya scroll horizontal.

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
