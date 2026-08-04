# fibot.ar

Sitio comercial de **FiBOT**, servido por GitHub Pages en **https://www.fibot.ar**.

Una sola página estática. **No hay build, ni bundler, ni dependencias**: se edita
el HTML y se pushea.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | la home entera — estilos y script incluidos, sin recursos externos |
| `404.html` | página de error |
| `CNAME` | `www.fibot.ar` — lo lee GitHub Pages, va en mayúsculas o lo ignora |
| `favicon.svg` | ícono |
| `assets/og-fibot.png` | preview para WhatsApp, Twitter y LinkedIn (1200×630) |
| `robots.txt` · `sitemap.xml` | indexación |

## Ver la página local

```bash
python3 -m http.server 8000    # y abrir http://localhost:8000
```

Alcanza con abrir `index.html` en el navegador, pero con el server las rutas
absolutas (`/favicon.svg`) resuelven igual que en producción.

## Ojo con el dominio

`fibot.ar` (con **t**) es el que se usa. El repo `fibo.ar` (sin t) es otra cosa:
sólo reclama ese dominio y no sirve contenido. Los demás subdominios viven en
otro lado:

- `hub.fibot.ar` → repo `cantapp`
- `flotacantarini.fibot.ar` → `fleet-bot-pastor`, en Railway
- `flotas.antuña.com.ar` → `Fleet-API-Docs`

## DNS

En Cloudflare, zona `fibot.ar`: `CNAME www → fibonach0.github.io`, **sin proxy**
(nube gris). Con el proxy naranja GitHub no puede emitir el certificado.
