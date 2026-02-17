# Integración en Elementor (WordPress)

Este proyecto ya está preparado para incrustarlo en Elementor mediante una URL embebible dedicada:

- **Vista pública (sin editor admin):** `.../embed.html`
- **Vista admin (editor hotspots):** `.../embed.html?admin=admin-hotspots-2026`

> El editor de hotspots solo aparece con el slug admin en la URL.

---

## Opción recomendada: widget HTML + iframe

1. En Elementor, añade un widget **HTML** en la sección donde quieras el visor.
2. Pega este código (ajusta tu dominio/ruta):

```html
<div style="width:100%; height:80vh; min-height:560px; border-radius:16px; overflow:hidden;">
  <iframe
    src="https://TU-DOMINIO/ruta-del-proyecto/embed.html"
    title="Visor 3D del monumento"
    style="width:100%; height:100%; border:0;"
    loading="lazy"
    allowfullscreen
  ></iframe>
</div>
```

3. Guarda y publica.

### Para editar hotspots (solo admin)
Usa temporalmente esta URL en el `src` del iframe:

```text
https://TU-DOMINIO/ruta-del-proyecto/embed.html?admin=admin-hotspots-2026
```

Cuando termines la configuración, vuelve a la URL pública sin `?admin=...`.

---

## Requisitos importantes

- Sirve los archivos por **HTTP/HTTPS** (no `file://`).
- Deben existir estas rutas en producción:
  - `embed.html`
  - `app.js`
  - `styles.css`
  - `assets/models/monumento.obj`
- Si tu WordPress y el visor están en dominios distintos, asegúrate de que el servidor permite embebido (`X-Frame-Options` / CSP `frame-ancestors`).

---

## Ajustes rápidos de tamaño

- Cambia `height:80vh` por valores como `650px` si quieres altura fija.
- Mantén `min-height:560px` para mejor experiencia en desktop.
