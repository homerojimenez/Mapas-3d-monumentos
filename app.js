const viewer = document.getElementById('viewer3d');
const viewerStatus = document.getElementById('viewerStatus');
const hotspotLayer = document.getElementById('hotspotLayer');
const panel = document.getElementById('zonePanel');
const closePanelButton = document.getElementById('closePanel');

const panelGallery = document.getElementById('panelGallery');
const panelTitle = document.getElementById('panelTitle');
const panelDescription = document.getElementById('panelDescription');

const openConfigButton = document.getElementById('openConfig');
const closeConfigButton = document.getElementById('closeConfig');
const configPanel = document.getElementById('configPanel');
const hotspotSelect = document.getElementById('hotspotSelect');
const addHotspotButton = document.getElementById('addHotspot');
const deleteHotspotButton = document.getElementById('deleteHotspot');
const saveHotspotsButton = document.getElementById('saveHotspots');
const resetHotspotsButton = document.getElementById('resetHotspots');

const inputLabel = document.getElementById('inputLabel');
const inputTitle = document.getElementById('inputTitle');
const inputDescription = document.getElementById('inputDescription');
const inputX = document.getElementById('inputX');
const inputY = document.getElementById('inputY');
const inputZ = document.getElementById('inputZ');
const inputPhotos = document.getElementById('inputPhotos');
const inputPhotoFiles = document.getElementById('inputPhotoFiles');
const photoPreview = document.getElementById('photoPreview');

const ADMIN_SLUG = 'admin-hotspots-2026';
const MODEL_OBJ_PATH = 'assets/models/monumento.obj';
const HOTSPOTS_JSON_URL = 'assets/hotspots.json';
const SAVE_ENDPOINT_URL = 'save-hotspots.php';
const MAX_HOTSPOT_IMAGES = 2;

function isAdminMode() {
  const params = new URLSearchParams(window.location.search);
  const querySlug = params.get('admin');
  const hashSlug = window.location.hash.replace('#', '');
  const pathSlug = window.location.pathname.split('/').filter(Boolean).at(-1);
  return querySlug === ADMIN_SLUG || hashSlug === ADMIN_SLUG || pathSlug === ADMIN_SLUG;
}

const adminMode = isAdminMode();

function buildOfflinePhoto(title, subtitle, colorA, colorB) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" role="img" aria-label="${title}"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="${colorA}"/><stop offset="100%" stop-color="${colorB}"/></linearGradient></defs><rect width="1200" height="720" fill="url(#g)"/><circle cx="180" cy="120" r="140" fill="rgba(255,255,255,0.16)"/><circle cx="980" cy="560" r="220" fill="rgba(255,255,255,0.12)"/><text x="70" y="560" fill="#fff" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="64" font-weight="700">${title}</text><text x="72" y="620" fill="rgba(255,255,255,0.92)" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="34">${subtitle}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const defaultZones = [
  {
    id: 'entrada',
    label: 'Entrada principal',
    point: [-0.62, 0.23, 0.98],
    title: 'Entrada principal',
    description:
      'Vestíbulo monumental con acceso al circuito principal. Aquí se centraliza la recepción de visitantes y el punto de información histórica.',
    photos: [
      buildOfflinePhoto('Entrada principal', 'Recepción y punto de información', '#3b82f6', '#0f172a'),
      buildOfflinePhoto('Patio de acceso', 'Vista panorámica exterior', '#0ea5e9', '#1e293b')
    ]
  },
  {
    id: 'sala-cupula',
    label: 'Sala de la cúpula',
    point: [0.88, 0.64, 0.14],
    title: 'Sala de la Cúpula',
    description:
      'Espacio central donde se concentra la mayor carga artística del monumento, con frescos originales y restauraciones documentadas.',
    photos: [
      buildOfflinePhoto('Sala de la Cúpula', 'Zona central de interpretación', '#7c3aed', '#1e1b4b'),
      buildOfflinePhoto('Detalle interior', 'Elementos decorativos destacados', '#8b5cf6', '#312e81')
    ]
  },
  {
    id: 'galeria-norte',
    label: 'Galería norte',
    point: [0.09, 0.43, -0.98],
    title: 'Galería norte',
    description:
      'Recorrido longitudinal con exposición de piezas y una lectura cronológica de las distintas fases de ampliación del monumento.',
    photos: [
      buildOfflinePhoto('Galería norte', 'Recorrido de piezas históricas', '#f59e0b', '#78350f'),
      buildOfflinePhoto('Cronología', 'Fases de ampliación del monumento', '#f97316', '#7c2d12')
    ]
  }
];

let zoneData = structuredClone(defaultZones);
let selectedZoneId = zoneData[0]?.id || null;

function normalizePhotos(rawPhotos) {
  if (!Array.isArray(rawPhotos)) {
    return [];
  }
  return rawPhotos.map((item) => String(item || '').trim()).filter(Boolean).slice(0, MAX_HOTSPOT_IMAGES);
}

function sanitizeZoneList(rawZones) {
  if (!Array.isArray(rawZones) || !rawZones.length) {
    return structuredClone(defaultZones);
  }

  return rawZones.map((zone, index) => ({
    id: zone.id || `hotspot-${index + 1}`,
    label: zone.label || `Hotspot ${index + 1}`,
    title: zone.title || zone.label || `Hotspot ${index + 1}`,
    description: zone.description || 'Sin descripción todavía.',
    photos: normalizePhotos(zone.photos).length ? normalizePhotos(zone.photos) : [...defaultZones[0].photos],
    point: Array.isArray(zone.point) && zone.point.length === 3 ? zone.point.map(Number) : [0, 0, 0]
  }));
}

async function loadZonesFromServer() {
  try {
    const response = await fetch(`${HOTSPOTS_JSON_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('No se pudo cargar hotspots.json');
    }

    zoneData = sanitizeZoneList(await response.json());
    selectedZoneId = zoneData[0]?.id || null;
  } catch {
    zoneData = structuredClone(defaultZones);
    selectedZoneId = zoneData[0]?.id || null;
    setStatus('No se encontró hotspots.json. Usando configuración por defecto.', true);
    setTimeout(hideStatus, 1600);
  }
}

async function saveZonesToServer() {
  const payload = {
    adminSlug: ADMIN_SLUG,
    zones: sanitizeZoneList(zoneData)
  };

  const response = await fetch(SAVE_ENDPOINT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('No se pudo guardar en servidor');
  }

  const result = await response.json().catch(() => ({}));
  if (result?.ok !== true) {
    throw new Error('Respuesta inválida del guardado');
  }
}

function photosToMultiline(photos) {
  return normalizePhotos(photos).join('\n');
}

function parsePhotosFromMultiline(value) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function renderPhotoPreview(zone) {
  if (!zone) {
    photoPreview.innerHTML = '';
    return;
  }

  const photos = normalizePhotos(zone.photos);
  photoPreview.innerHTML = photos
    .map(
      (src, index) => `
        <div class="photo-item">
          <img src="${src}" alt="Imagen ${index + 1}" loading="lazy" />
          <button class="photo-remove" type="button" data-photo-index="${index}" aria-label="Quitar imagen">×</button>
        </div>
      `
    )
    .join('');
}

function setStatus(message, isError = false) {
  viewerStatus.classList.remove('is-hidden');
  viewerStatus.textContent = message;
  viewerStatus.style.borderColor = isError ? 'rgba(248, 113, 113, 0.65)' : 'rgba(148, 163, 184, 0.4)';
}

function hideStatus() {
  viewerStatus.classList.add('is-hidden');
}

function supportsCanvas() {
  const canvas = document.createElement('canvas');
  return !!canvas.getContext('2d');
}

function openPanel(zone) {
  panelTitle.textContent = zone.title;
  panelDescription.textContent = zone.description;
  const panelPhotos = normalizePhotos(zone.photos).length ? normalizePhotos(zone.photos) : defaultZones[0].photos;
  panelGallery.innerHTML = panelPhotos
    .map((src, index) => `<img src="${src}" alt="${zone.title} imagen ${index + 1}" loading="lazy" />`)
    .join('');

  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
}

function closePanel() {
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
}

function toggleConfig(show) {
  if (!adminMode) {
    return;
  }
  configPanel.classList.toggle('is-open', show);
  configPanel.setAttribute('aria-hidden', String(!show));
  openConfigButton.setAttribute('aria-expanded', String(show));
}

closePanelButton.addEventListener('click', closePanel);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closePanel();
    toggleConfig(false);
  }
});
openConfigButton.addEventListener('click', () => {
  toggleConfig(!configPanel.classList.contains('is-open'));
});
closeConfigButton.addEventListener('click', () => toggleConfig(false));

if (!adminMode) {
  openConfigButton.hidden = true;
  configPanel.hidden = true;
}

function resolveRelativePath(basePath, relativePath) {
  if (!relativePath) {
    return '';
  }

  if (/^(https?:)?\/\//i.test(relativePath) || relativePath.startsWith('/')) {
    return relativePath;
  }

  const baseDir = basePath.includes('/') ? basePath.slice(0, basePath.lastIndexOf('/') + 1) : '';
  const baseParts = baseDir.split('/').filter(Boolean);
  const relParts = relativePath.split('/').filter(Boolean);

  relParts.forEach((part) => {
    if (part === '.') {
      return;
    }
    if (part === '..') {
      baseParts.pop();
    } else {
      baseParts.push(part);
    }
  });

  return `${baseDir.startsWith('/') ? '/' : ''}${baseParts.join('/')}`;
}

function parseMTL(text) {
  const materials = {};
  let current = null;

  text.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      return;
    }

    const parts = line.split(/\s+/);
    const keyword = parts[0]?.toLowerCase();

    if (keyword === 'newmtl') {
      current = parts.slice(1).join(' ');
      materials[current] = materials[current] || { kd: [0.68, 0.72, 0.78], mapKd: '' };
      return;
    }

    if (!current || !materials[current]) {
      return;
    }

    if (keyword === 'kd' && parts.length >= 4) {
      materials[current].kd = [Number(parts[1]) || 0.68, Number(parts[2]) || 0.72, Number(parts[3]) || 0.78].map((v) =>
        Math.max(0, Math.min(1, v))
      );
    }

    if (keyword === 'map_kd' && parts.length >= 2) {
      materials[current].mapKd = parts.slice(1).join(' ').trim();
    }
  });

  return materials;
}

async function getAverageColorFromImage(imagePath) {
  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imagePath;
    });

    const sampleCanvas = document.createElement('canvas');
    const sampleSize = 32;
    sampleCanvas.width = sampleSize;
    sampleCanvas.height = sampleSize;
    const sampleContext = sampleCanvas.getContext('2d');
    sampleContext.drawImage(image, 0, 0, sampleSize, sampleSize);
    const { data } = sampleContext.getImageData(0, 0, sampleSize, sampleSize);

    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3] / 255;
      if (alpha <= 0.02) {
        continue;
      }
      r += (data[i] / 255) * alpha;
      g += (data[i + 1] / 255) * alpha;
      b += (data[i + 2] / 255) * alpha;
      count += alpha;
    }

    if (!count) {
      return null;
    }

    return [r / count, g / count, b / count];
  } catch {
    return null;
  }
}

function extractMapKdPath(rawValue) {
  if (!rawValue) {
    return '';
  }

  const tokens = rawValue.split(/\s+/).filter(Boolean);
  const fileTokens = [];

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.startsWith('-')) {
      const option = token.toLowerCase();
      const optionValueCounts = {
        '-blendu': 1,
        '-blendv': 1,
        '-boost': 1,
        '-mm': 2,
        '-o': 3,
        '-s': 3,
        '-t': 3,
        '-texres': 1,
        '-clamp': 1,
        '-bm': 1,
        '-imfchan': 1,
        '-type': 1
      };
      index += optionValueCounts[option] || 0;
      continue;
    }

    fileTokens.push(token);
  }

  return fileTokens.join(' ').trim();
}

async function enrichMaterials(materials, mtlPath) {
  const entries = Object.entries(materials || {});
  if (!entries.length) {
    return materials;
  }

  await Promise.all(
    entries.map(async ([, material]) => {
      const mapPath = extractMapKdPath(material.mapKd);
      if (!mapPath) {
        return;
      }

      const resolvedPath = resolveRelativePath(mtlPath, mapPath);
      const averageColor = await getAverageColorFromImage(resolvedPath);
      if (averageColor) {
        material.kd = averageColor;
      }
    })
  );

  return materials;
}
function parseOBJ(text) {
  const vertices = [];
  const vertexColors = [];
  const faces = [];
  let mtllib = '';
  let currentMaterial = '';

  text.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      return;
    }

    if (line.startsWith('mtllib ')) {
      mtllib = line.slice(7).trim();
      return;
    }

    if (line.startsWith('usemtl ')) {
      currentMaterial = line.slice(7).trim();
      return;
    }

    if (line.startsWith('v ')) {
      const [, x, y, z, r, g, b] = line.split(/\s+/);
      vertices.push([Number(x), Number(y), Number(z)]);

      if ([r, g, b].every((value) => value !== undefined)) {
        const normalizeColor = (value) => {
          const num = Number(value);
          if (Number.isNaN(num)) {
            return 0.65;
          }
          return num > 1 ? Math.max(0, Math.min(1, num / 255)) : Math.max(0, Math.min(1, num));
        };

        vertexColors.push([normalizeColor(r), normalizeColor(g), normalizeColor(b)]);
      } else {
        vertexColors.push([0.63, 0.68, 0.74]);
      }
      return;
    }

    if (line.startsWith('f ')) {
      const indices = line
        .slice(2)
        .trim()
        .split(/\s+/)
        .map((part) => Number(part.split('/')[0]) - 1)
        .filter((index) => Number.isInteger(index) && index >= 0);

      for (let i = 1; i < indices.length - 1; i += 1) {
        faces.push({ indices: [indices[0], indices[i], indices[i + 1]], material: currentMaterial });
      }
    }
  });

  return { vertices, vertexColors, faces, mtllib };
}

function buildFallbackMesh() {
  const vertices = [
    [-1, -0.8, -1],
    [1, -0.8, -1],
    [1, -0.8, 1],
    [-1, -0.8, 1],
    [-0.8, 0.8, -0.8],
    [0.8, 0.8, -0.8],
    [0.8, 0.8, 0.8],
    [-0.8, 0.8, 0.8]
  ];
  const vertexColors = [
    [0.56, 0.61, 0.68],
    [0.64, 0.69, 0.76],
    [0.6, 0.66, 0.74],
    [0.54, 0.6, 0.67],
    [0.75, 0.78, 0.82],
    [0.7, 0.74, 0.79],
    [0.73, 0.77, 0.81],
    [0.67, 0.72, 0.78]
  ];
  const faces = [
    { indices: [0, 1, 2], material: '' },
    { indices: [0, 2, 3], material: '' },
    { indices: [4, 5, 6], material: '' },
    { indices: [4, 6, 7], material: '' },
    { indices: [0, 1, 5], material: '' },
    { indices: [0, 5, 4], material: '' },
    { indices: [1, 2, 6], material: '' },
    { indices: [1, 6, 5], material: '' },
    { indices: [2, 3, 7], material: '' },
    { indices: [2, 7, 6], material: '' },
    { indices: [3, 0, 4], material: '' },
    { indices: [3, 4, 7], material: '' }
  ];

  return { vertices, vertexColors, faces, materials: {} };
}

function normalizeVertices(vertices) {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];

  vertices.forEach(([x, y, z]) => {
    min[0] = Math.min(min[0], x);
    min[1] = Math.min(min[1], y);
    min[2] = Math.min(min[2], z);
    max[0] = Math.max(max[0], x);
    max[1] = Math.max(max[1], y);
    max[2] = Math.max(max[2], z);
  });

  const center = [(min[0] + max[0]) * 0.5, (min[1] + max[1]) * 0.5, (min[2] + max[2]) * 0.5];
  const size = Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2], 1e-6);
  const scale = 2.2 / size;

  return vertices.map(([x, y, z]) => [(x - center[0]) * scale, (y - center[1]) * scale, (z - center[2]) * scale]);
}

function rotatePoint(point, yaw, pitch) {
  const [x, y, z] = point;
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);

  const x1 = x * cy - z * sy;
  const z1 = x * sy + z * cy;
  const y2 = y * cp - z1 * sp;
  const z2 = y * sp + z1 * cp;

  return [x1, y2, z2];
}

function projectPoint(point, width, height, distance) {
  const focal = Math.min(width, height) * 0.9;
  const depth = point[2] + distance;
  const safeDepth = Math.max(depth, 0.2);

  return {
    x: width * 0.5 + (point[0] * focal) / safeDepth,
    y: height * 0.5 - (point[1] * focal) / safeDepth,
    depth: safeDepth
  };
}

async function initViewer() {
  if (!supportsCanvas()) {
    setStatus('Tu navegador no soporta canvas 2D.', true);
    return;
  }

  await loadZonesFromServer();

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { alpha: false, desynchronized: true });
  viewer.appendChild(canvas);

  let model = buildFallbackMesh();

  try {
    const response = await fetch(MODEL_OBJ_PATH);
    if (!response.ok) {
      throw new Error('OBJ no disponible');
    }

    const objText = await response.text();
    const parsed = parseOBJ(objText);
    if (!parsed.vertices.length || !parsed.faces.length) {
      throw new Error('OBJ inválido');
    }

    const materials = {};
    const guessedMtlPath = MODEL_OBJ_PATH.replace(/\.obj$/i, '.mtl');
    const mtlCandidates = [parsed.mtllib ? resolveRelativePath(MODEL_OBJ_PATH, parsed.mtllib) : '', guessedMtlPath].filter(Boolean);
    let loadedMtlPath = '';

    for (const mtlPath of [...new Set(mtlCandidates)]) {
      try {
        const mtlResponse = await fetch(mtlPath);
        if (!mtlResponse.ok) {
          continue;
        }

        const mtlText = await mtlResponse.text();
        Object.assign(materials, parseMTL(mtlText));
        loadedMtlPath = mtlPath;
        break;
      } catch {
        // prueba siguiente candidato
      }
    }

    if (loadedMtlPath) {
      await enrichMaterials(materials, loadedMtlPath);
    }

    model = { ...parsed, materials };

    if (Object.keys(materials).length) {
      setStatus('Modelo OBJ cargado con materiales y texturas.');
    } else {
      setStatus('Modelo OBJ cargado. MTL no encontrado: usando color del OBJ.');
    }
    setTimeout(hideStatus, 1400);
  } catch {
    setStatus('No se pudo cargar el modelo OBJ. Mostrando modelo de prueba.', true);
  }

  model.vertices = normalizeVertices(model.vertices);

  let yaw = -0.6;
  let pitch = 0.35;
  let distance = 4.2;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let needsRender = true;

  let hotspotButtons = [];

  function requestRender() {
    needsRender = true;
  }

  function syncHotspotButtons() {
    hotspotLayer.innerHTML = '';
    hotspotButtons = zoneData.map((zone) => {
      const button = document.createElement('button');
      button.className = 'hotspot';
      button.type = 'button';
      button.dataset.label = zone.label;
      button.ariaLabel = zone.label;
      button.addEventListener('click', () => openPanel(zone));
      hotspotLayer.appendChild(button);
      return { zone, button };
    });
    requestRender();
  }

  function fillFormFromSelection() {
    const zone = zoneData.find((item) => item.id === selectedZoneId);
    if (!zone) {
      return;
    }

    inputLabel.value = zone.label;
    inputTitle.value = zone.title;
    inputDescription.value = zone.description;
    inputX.value = zone.point[0];
    inputY.value = zone.point[1];
    inputZ.value = zone.point[2];
    inputPhotos.value = photosToMultiline(zone.photos);
    renderPhotoPreview(zone);
  }

  function refreshSelect() {
    hotspotSelect.innerHTML = '';
    zoneData.forEach((zone) => {
      const option = document.createElement('option');
      option.value = zone.id;
      option.textContent = zone.label;
      hotspotSelect.appendChild(option);
    });

    if (!selectedZoneId || !zoneData.some((zone) => zone.id === selectedZoneId)) {
      selectedZoneId = zoneData[0]?.id || null;
    }

    if (selectedZoneId) {
      hotspotSelect.value = selectedZoneId;
    }

    fillFormFromSelection();
    syncHotspotButtons();
  }

  function applyFieldChanges() {
    const zone = zoneData.find((item) => item.id === selectedZoneId);
    if (!zone) {
      return;
    }

    zone.label = inputLabel.value.trim() || 'Hotspot';
    zone.title = inputTitle.value.trim() || zone.label;
    zone.description = inputDescription.value.trim() || 'Sin descripción todavía.';
    zone.point = [Number(inputX.value) || 0, Number(inputY.value) || 0, Number(inputZ.value) || 0];
    const parsedPhotos = parsePhotosFromMultiline(inputPhotos.value);
    zone.photos = parsedPhotos.slice(0, MAX_HOTSPOT_IMAGES);
    if (parsedPhotos.length > MAX_HOTSPOT_IMAGES) {
      setStatus(`Máximo ${MAX_HOTSPOT_IMAGES} imágenes por hotspot.`, true);
    }

    refreshSelect();
    hotspotSelect.value = zone.id;
    requestRender();
  }

  if (adminMode) {
    hotspotSelect.addEventListener('change', () => {
      selectedZoneId = hotspotSelect.value;
      fillFormFromSelection();
      requestRender();
    });

    [inputLabel, inputTitle, inputDescription, inputX, inputY, inputZ, inputPhotos].forEach((field) => {
      field.addEventListener('input', applyFieldChanges);
    });

    photoPreview.addEventListener('click', (event) => {
      const target = event.target.closest('[data-photo-index]');
      if (!target) {
        return;
      }

      const zone = zoneData.find((item) => item.id === selectedZoneId);
      if (!zone) {
        return;
      }

      const index = Number(target.dataset.photoIndex);
      zone.photos = normalizePhotos(zone.photos).filter((_, idx) => idx !== index);
      inputPhotos.value = photosToMultiline(zone.photos);
      renderPhotoPreview(zone);
      refreshSelect();
      hotspotSelect.value = zone.id;
      requestRender();
    });

    inputPhotoFiles.addEventListener('change', async () => {
      const zone = zoneData.find((item) => item.id === selectedZoneId);
      if (!zone || !inputPhotoFiles.files?.length) {
        return;
      }

      const files = Array.from(inputPhotoFiles.files);
      const encodedImages = await Promise.all(
        files.map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result || ''));
              reader.onerror = () => resolve('');
              reader.readAsDataURL(file);
            })
        )
      );

      const currentPhotos = normalizePhotos(zone.photos);
      const slotsLeft = Math.max(0, MAX_HOTSPOT_IMAGES - currentPhotos.length);
      const incoming = encodedImages.filter(Boolean).slice(0, slotsLeft);
      zone.photos = [...currentPhotos, ...incoming].slice(0, MAX_HOTSPOT_IMAGES);
      if (incoming.length < encodedImages.filter(Boolean).length) {
        setStatus(`Solo se permiten ${MAX_HOTSPOT_IMAGES} imágenes por hotspot.`, true);
      }
      inputPhotos.value = photosToMultiline(zone.photos);
      renderPhotoPreview(zone);
      inputPhotoFiles.value = '';
      refreshSelect();
      hotspotSelect.value = zone.id;
      setStatus('Imágenes actualizadas en el hotspot.');
      setTimeout(hideStatus, 900);
      requestRender();
    });

    addHotspotButton.addEventListener('click', () => {
      const id = `hotspot-${Date.now()}`;
      zoneData.push({
        id,
        label: 'Nuevo hotspot',
        title: 'Nueva zona',
        description: 'Describe aquí esta zona.',
        point: [0, 0, 0],
        photos: []
      });
      selectedZoneId = id;
      refreshSelect();
      requestRender();
    });

    deleteHotspotButton.addEventListener('click', () => {
      if (zoneData.length <= 1) {
        setStatus('Debe quedar al menos un hotspot.', true);
        return;
      }

      zoneData = zoneData.filter((zone) => zone.id !== selectedZoneId);
      selectedZoneId = zoneData[0].id;
      refreshSelect();
      requestRender();
    });

    saveHotspotsButton.addEventListener('click', async () => {
      try {
        await saveZonesToServer();
        setStatus('Hotspots guardados para todos los visitantes.');
        setTimeout(hideStatus, 1200);
      } catch {
        setStatus('Error al guardar en servidor. Revisa save-hotspots.php y permisos.', true);
      }
    });

    resetHotspotsButton.addEventListener('click', () => {
      zoneData = structuredClone(defaultZones);
      selectedZoneId = zoneData[0].id;
      refreshSelect();
      setStatus('Hotspots restablecidos.');
      setTimeout(hideStatus, 900);
      requestRender();
    });

    refreshSelect();
  } else {
    syncHotspotButtons();
  }

  function resize() {
    canvas.width = viewer.clientWidth;
    canvas.height = viewer.clientHeight;
    requestRender();
  }

  resize();
  window.addEventListener('resize', resize);

  canvas.addEventListener('mousedown', (event) => {
    isDragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (event) => {
    if (!isDragging) {
      return;
    }

    yaw += (event.clientX - lastX) * 0.006;
    pitch += (event.clientY - lastY) * 0.006;
    pitch = Math.max(-1.45, Math.min(1.45, pitch));
    lastX = event.clientX;
    lastY = event.clientY;
    requestRender();
  });

  canvas.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      distance = Math.max(2.4, Math.min(10, distance + event.deltaY * 0.01));
      requestRender();
    },
    { passive: false }
  );

  function renderFrame() {
    const width = canvas.width;
    const height = canvas.height;

    context.clearRect(0, 0, width, height);
    context.fillStyle = '#f8f5ef';
    context.fillRect(0, 0, width, height);

    const transformed = model.vertices.map((vertex) => rotatePoint(vertex, yaw, pitch));
    const facesToDraw = [];

    for (const face of model.faces) {
      const [a, b, c] = face.indices;
      const p1 = transformed[a];
      const p2 = transformed[b];
      const p3 = transformed[c];

      const u = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
      const v = [p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]];
      const normal = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];


      const projected = [
        projectPoint(p1, width, height, distance),
        projectPoint(p2, width, height, distance),
        projectPoint(p3, width, height, distance)
      ];

      const depth = (projected[0].depth + projected[1].depth + projected[2].depth) / 3;
      const materialColor = model.materials?.[face.material]?.kd;
      const c1 = model.vertexColors[a] || [0.62, 0.67, 0.74];
      const c2 = model.vertexColors[b] || [0.62, 0.67, 0.74];
      const c3 = model.vertexColors[c] || [0.62, 0.67, 0.74];
      const baseColor = materialColor || [(c1[0] + c2[0] + c3[0]) / 3, (c1[1] + c2[1] + c3[1]) / 3, (c1[2] + c2[2] + c3[2]) / 3];

      facesToDraw.push({ projected, depth, baseColor });
    }

    facesToDraw.sort((a, b) => b.depth - a.depth);

    for (let index = 0; index < facesToDraw.length; index += 1) {
      const face = facesToDraw[index];
      context.beginPath();
      context.moveTo(face.projected[0].x, face.projected[0].y);
      context.lineTo(face.projected[1].x, face.projected[1].y);
      context.lineTo(face.projected[2].x, face.projected[2].y);
      context.closePath();

      const p1 = face.projected[0];
      const p2 = face.projected[1];
      const p3 = face.projected[2];
      const area = Math.abs((p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x));
      const light = Math.max(0.45, Math.min(1.05, 1 - area / (canvas.width * canvas.height * 0.15)));
      const red = Math.min(255, Math.floor(face.baseColor[0] * 255 * light));
      const green = Math.min(255, Math.floor(face.baseColor[1] * 255 * light));
      const blue = Math.min(255, Math.floor(face.baseColor[2] * 255 * light));
      context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      context.fill();
    }

    hotspotButtons.forEach(({ zone, button }) => {
      const screen = projectPoint(rotatePoint(zone.point, yaw, pitch), width, height, distance);
      button.dataset.label = zone.label;
      button.ariaLabel = zone.label;
      button.style.left = `${screen.x}px`;
      button.style.top = `${screen.y}px`;
      button.style.display = screen.depth <= 0.2 ? 'none' : 'block';
    });
  }

  function animationLoop() {
    if (needsRender) {
      renderFrame();
      needsRender = false;
    }
    requestAnimationFrame(animationLoop);
  }

  requestRender();
  animationLoop();
}

if (!adminMode) {
  setStatus('Modo visita. Editor desactivado para usuarios finales.');
  setTimeout(hideStatus, 1400);
}

initViewer();
