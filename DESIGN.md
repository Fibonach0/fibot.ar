# DESIGN.md — el sistema visual de FiBOT

> **Para qué existe.** Los tokens de marca ya están decididos y shippeados, pero
> viven **adentro de un `<style>` en `index.html`** de este repo. Una sesión de
> Claude Code trabajando en otro repo del ecosistema (la oficina, FiBOT Casa, la
> Wallet, un PDF) no tiene forma de verlos, así que los inventa — y cada
> superficie termina con su propio verde y su propia tipografía. Este archivo es
> la copia legible de eso, para poder pegarla en cualquier repo.
>
> **La fuente de verdad sigue siendo el código**, no este archivo: los colores y
> las familias salen del bloque `:root` de `index.html`; el manual del símbolo
> (las cuatro reglas no negociables) está en `CLAUDE.md`, no acá. Si algo no
> coincide, manda el código y este archivo está desactualizado.

## Colores

Los nombres son los que ya usa el CSS — **usar estos nombres**, no inventar
sinónimos, así un token se puede buscar con `grep` entre repos.

| Token | Valor | Qué es |
|---|---|---|
| `--tinta` | `#0c0b0a` | fondo. Casi negro, cálido — no `#000` |
| `--tinta-alt` | `#0f0e0c` | fondo de bloque alterno, apenas más claro |
| `--hueso` | `#ece6db` | texto principal. Crema, no blanco puro |
| `--tenue` | `#9a9082` | texto secundario |
| `--tenue-2` | `#57514a` | texto terciario, notas al pie |
| `--linea` | `#221f1b` | bordes |
| `--linea-2` | `#2a2622` | bordes de énfasis |
| `--bronce` | `#E0A44C` | acento cálido: links, destacados |
| `--bronce-h` | `#eebe7f` | el bronce en hover |
| `--verde` | `#6FDCAE` | **el color de la marca**. Ver la regla de abajo |

**El verde tiene una sola regla y es dura:** en el símbolo es *siempre* el
cuadrado de 1 de la sucesión, nunca otra parte del dibujo. Fuera del símbolo se
usa con cuentagotas — es lo que hace que se reconozca. Un tablero pintado todo
de `--verde` no es más FiBOT, es menos.

El tema es **oscuro y sólo oscuro** desde el sitio v2 (ago 2026). No hay
variante clara del sitio; sí hay assets de logo para fondo claro (papelería,
presentaciones) — están en `assets/logo/` y no se borran.

## Tipografía

```css
--sans:'Space Grotesk',system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
--mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
--serif:Georgia,"Iowan Old Style","Palatino Linotype",serif;
```

Se cargan de Google Fonts (`Space Grotesk` 400/500/700 + `JetBrains Mono`
400/500). **Si no cargan, el sitio no se rompe**: el fallback está en el propio
stack. Ésa es la razón de que los stacks sean largos, no un descuido.

Los tres roles, que es lo que de verdad da el aire:

- **`--sans` con tracking negativo** (`letter-spacing:-.05em`) para títulos.
  Es lo que hace que un título se lea compacto y no genérico.
- **`--mono` en mayúsculas con tracking MUY abierto** (`.16em`–`.18em`) y
  tamaño chico (`.6rem`–`.66rem`) para etiquetas, kickers y numeritos. Es la
  firma visual del sistema; si algo "no parece de FiBOT", casi siempre es que
  le falta esto.
- **`--serif`** para citas y bajadas largas, con moderación.

Medida de lectura: **`max-width:44ch`** en los párrafos. Más ancho que eso y
deja de leerse.

## Espacio y forma

| | |
|---|---|
| Radio de tarjeta | `12px` |
| Radio de chip / botón / detalle | `2px` (casi recto — es deliberado) |
| Radio de avatar | `50%` |
| Gaps habituales | `9px` · `10px` · `12px` · `14px` · `18px` |
| Padding de bloque | `16px 20px` |
| Transiciones | `.18s` para color/fondo, `.3s` para opacidad |

**"Sin sombra, sin degradado, sin relieve" es una regla del SÍMBOLO, no del
sitio** — es fácil leerla de más. El sitio sí usa las dos cosas, con criterio:

- **Anillos, no sombras**: `box-shadow:0 0 0 1px rgba(255,255,255,.14)` para
  un borde de un pixel que no ocupa lugar en el layout.
- **Elevación sólo donde algo flota** de verdad (overlay, tarjeta destacada):
  `0 20px 44px rgba(0,0,0,.5)`, negro puro y muy difuso.
- **Glow de bronce en la llamada a la acción**: `0 8px 22px rgba(224,164,76,.28)`
  — el único lugar donde la sombra tiene color.
- **Degradados de 1px** (`linear-gradient(#ffffff08 1px,transparent 1px)`) para
  la grilla de fondo, y un `linear-gradient` a negro como máscara de desvanecido.
  Ninguno es un degradado decorativo de relleno.

La jerarquía la hacen el contraste y el espacio; la profundidad es la excepción
y se nota cuando aparece.

## Cómo se lleva esto a otro repo

- **Copiar el bloque `:root` tal cual.** No hay build ni paquete de tokens que
  importar, y armar uno para tres sitios estáticos sería peor el remedio.
- **El logo se inlinea, no se referencia con `<img src>`.** Un SVG traído por
  `<img>` vive en un contexto aparte y **no hereda `Space Grotesk`** de la
  página: el wordmark sale con el fallback. Inline sí lo hereda. Esta es la
  clase de cosa que se descubre tarde y molesta.
- **En un PDF no hay CSS.** El PDF de factura de FiBOT dibuja el logo como
  vectores a mano (`arcaLogo()` en `Personal-FiBOT/index.ts`), con el crema
  recoloreado a negro porque va sobre blanco. Si aparece otra superficie sin
  CSS, ése es el precedente a mirar.

## Lo que este archivo NO resuelve

**El rediseño de FiBOT Casa** (la web de domótica del repo `jarvis`, que va a
`casa.fibot.ar`) tiene una dirección elegida — "cerebro cósmico" reactivo a la
voz, escenas de un toque, iconos tipo app — pero **esa dirección vive en
mockups que no están en ningún repo**. Los tokens de acá son el piso de marca
sobre el que apoyarla; no son la dirección. Mientras los mockups no viajen a
`jarvis`, cualquier sesión que arranque ese trabajo va a estar adivinando la
mitad interesante, y adivinar un diseño aprobado es peor que no empezarlo.
