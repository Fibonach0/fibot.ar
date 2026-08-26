# fibot.ar

Sitio comercial de **FiBOT**, servido por GitHub Pages en **https://fibot.ar**.

Una sola página estática. **No hay build, ni bundler, ni dependencias**: se edita
el HTML y se pushea.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | la home entera — estilos y script incluidos, sin recursos externos |
| `404.html` | página de error |
| `CNAME` | `fibot.ar` (apex, sin `www`) — lo lee GitHub Pages, va en mayúsculas o lo ignora |
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

En Cloudflare, zona `fibot.ar`: el apex necesita **registros A** a las cuatro
IP de GitHub Pages (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`) —
un CNAME no es válido en la raíz de una zona. `www` puede seguir como
`CNAME www → fibonach0.github.io`, o borrarse (GitHub redirige al dominio del
archivo `CNAME`, hoy el apex). Todo **sin proxy** (nube gris): con el proxy
naranja GitHub no puede emitir el certificado.
