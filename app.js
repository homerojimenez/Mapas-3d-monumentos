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

const STORAGE_KEY = 'monumento-hotspots-v1';
const ADMIN_SLUG = 'admin-hotspots-2026';
const MODEL_OBJ_PATH = 'assets/models/monumento.obj';

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

let zoneData = loadZones();
let selectedZoneId = zoneData[0]?.id || null;

function loadZones() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return structuredClone(defaultZones);
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || !parsed.length) {
      return structuredClone(defaultZones);
    }

    return parsed.map((zone, index) => ({
      id: zone.id || `hotspot-${index + 1}`,
      label: zone.label || `Hotspot ${index + 1}`,
      title: zone.title || zone.label || `Hotspot ${index + 1}`,
      description: zone.description || 'Sin descripción todavía.',
      photos: Array.isArray(zone.photos) && zone.photos.length ? zone.photos : defaultZones[0].photos,
      point: Array.isArray(zone.point) && zone.point.length === 3 ? zone.point.map(Number) : [0, 0, 0]
    }));
  } catch {
    return structuredClone(defaultZones);
  }
}

function saveZones() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(zoneData));
  setStatus('Hotspots guardados en este navegador.');
  setTimeout(hideStatus, 1000);
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
  panelGallery.innerHTML = zone.photos
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
  const baseSegments = basePath.split('/');
  baseSegments.pop();

  relativePath.split('/').forEach((segment) => {
    if (!segment || segment === '.') {
      return;
    }

    if (segment === '..') {
      baseSegments.pop();
      return;
    }

    baseSegments.push(segment);
  });

  return baseSegments.join('/');
}

function extractObjMaterialReference(objText) {
  const lines = objText.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith('mtllib ')) {
      return line.slice(7).trim();
    }
  }
  return null;
}

function extractTextureFromMTL(mtlText) {
  const lines = mtlText.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith('map_Kd ')) {
      return line.slice(7).trim();
    }
  }
  return null;
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('No se pudo cargar textura.'));
    image.src = source;
  });
}

async function loadTextureImageFromOBJ(objText, objPath) {
  const materialReference = extractObjMaterialReference(objText);
  if (!materialReference) {
    return null;
  }

  const mtlPath = resolveRelativePath(objPath, materialReference);
  const mtlResponse = await fetch(mtlPath);
  if (!mtlResponse.ok) {
    return null;
  }

  const textureReference = extractTextureFromMTL(await mtlResponse.text());
  if (!textureReference) {
    return null;
  }

  const texturePath = resolveRelativePath(mtlPath, textureReference);
  return loadImage(texturePath);
}

function parseOBJ(text) {
  const vertices = [];
  const faces = [];
  const lines = text.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    if (line.startsWith('v ')) {
      const [, x, y, z] = line.split(/\s+/);
      vertices.push([Number(x), Number(y), Number(z)]);
    }

    if (line.startsWith('f ')) {
      const indices = line
        .slice(2)
        .trim()
        .split(/\s+/)
        .map((part) => Number(part.split('/')[0]) - 1)
        .filter((index) => Number.isInteger(index) && index >= 0);

      for (let i = 1; i < indices.length - 1; i += 1) {
        faces.push([indices[0], indices[i], indices[i + 1]]);
      }
    }
  }

  return { vertices, faces };
}

function buildFallbackMesh() {
  return {
    vertices: [
      [-1, -0.8, -1],
      [1, -0.8, -1],
      [1, -0.8, 1],
      [-1, -0.8, 1],
      [-0.8, 0.8, -0.8],
      [0.8, 0.8, -0.8],
      [0.8, 0.8, 0.8],
      [-0.8, 0.8, 0.8]
    ],
    faces: [
      [0, 1, 2],
      [0, 2, 3],
      [4, 5, 6],
      [4, 6, 7],
      [0, 1, 5],
      [0, 5, 4],
      [1, 2, 6],
      [1, 6, 5],
      [2, 3, 7],
      [2, 7, 6],
      [3, 0, 4],
      [3, 4, 7]
    ]
  };
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

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  viewer.appendChild(canvas);

  let texturePattern = null;

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

    model = parsed;

    const textureImage = await loadTextureImageFromOBJ(objText, MODEL_OBJ_PATH);
    if (textureImage) {
      texturePattern = context.createPattern(textureImage, 'repeat');
      setStatus('Modelo cargado con textura desde OBJ/MTL.');
    } else {
      setStatus('Modelo cargado sin textura (OBJ sin mapa).');
    }
    setTimeout(hideStatus, 900);
  } catch {
    setStatus('OBJ no encontrado. Mostrando modelo de prueba sin textura de archivo.', true);
  }

  model.vertices = normalizeVertices(model.vertices);

  let yaw = -0.6;
  let pitch = 0.35;
  let distance = 4.2;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;

  let hotspotButtons = [];

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

    refreshSelect();
    hotspotSelect.value = zone.id;
  }

  if (adminMode) {
    hotspotSelect.addEventListener('change', () => {
      selectedZoneId = hotspotSelect.value;
      fillFormFromSelection();
    });

    [inputLabel, inputTitle, inputDescription, inputX, inputY, inputZ].forEach((field) => {
      field.addEventListener('input', applyFieldChanges);
    });

    addHotspotButton.addEventListener('click', () => {
      const id = `hotspot-${Date.now()}`;
      zoneData.push({
        id,
        label: 'Nuevo hotspot',
        title: 'Nueva zona',
        description: 'Describe aquí esta zona.',
        point: [0, 0, 0],
        photos: defaultZones[0].photos
      });
      selectedZoneId = id;
      refreshSelect();
    });

    deleteHotspotButton.addEventListener('click', () => {
      if (zoneData.length <= 1) {
        setStatus('Debe quedar al menos un hotspot.', true);
        return;
      }

      zoneData = zoneData.filter((zone) => zone.id !== selectedZoneId);
      selectedZoneId = zoneData[0].id;
      refreshSelect();
    });

    saveHotspotsButton.addEventListener('click', saveZones);

    resetHotspotsButton.addEventListener('click', () => {
      zoneData = structuredClone(defaultZones);
      selectedZoneId = zoneData[0].id;
      localStorage.removeItem(STORAGE_KEY);
      refreshSelect();
      setStatus('Hotspots restablecidos.');
      setTimeout(hideStatus, 900);
    });

    refreshSelect();
  } else {
    syncHotspotButtons();
  }

  function resize() {
    canvas.width = viewer.clientWidth;
    canvas.height = viewer.clientHeight;
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
  });

  canvas.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      distance = Math.max(2.4, Math.min(10, distance + event.deltaY * 0.01));
    },
    { passive: false }
  );

  function draw() {
    const width = canvas.width;
    const height = canvas.height;
    context.clearRect(0, 0, width, height);

    const transformed = model.vertices.map((vertex) => rotatePoint(vertex, yaw, pitch));

    const faces = model.faces
      .map(([a, b, c]) => {
        const p1 = transformed[a];
        const p2 = transformed[b];
        const p3 = transformed[c];
        const u = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
        const v = [p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]];
        const normal = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
        const n = Math.hypot(normal[0], normal[1], normal[2]) || 1;
        const dot = (normal[0] * 0.25 + normal[1] * 0.7 + normal[2] * 0.66) / n;
        const intensity = Math.max(0.2, dot);
        const projected = [projectPoint(p1, width, height, distance), projectPoint(p2, width, height, distance), projectPoint(p3, width, height, distance)];
        const depth = (projected[0].depth + projected[1].depth + projected[2].depth) / 3;
        return { projected, depth, intensity };
      })
      .sort((a, b) => b.depth - a.depth);

    faces.forEach((face) => {
      context.beginPath();
      context.moveTo(face.projected[0].x, face.projected[0].y);
      context.lineTo(face.projected[1].x, face.projected[1].y);
      context.lineTo(face.projected[2].x, face.projected[2].y);
      context.closePath();

      if (texturePattern) {
        context.save();
        context.clip();
        context.fillStyle = texturePattern;
        context.fillRect(0, 0, width, height);
        context.globalAlpha = 1 - face.intensity * 0.55;
        context.fillStyle = 'rgba(15, 23, 42, 0.65)';
        context.fillRect(0, 0, width, height);
        context.restore();
      } else {
        const shade = Math.floor(80 + face.intensity * 125);
        context.fillStyle = `rgb(${shade - 10}, ${shade}, ${Math.min(255, shade + 20)})`;
        context.fill();
      }

      context.strokeStyle = 'rgba(15, 23, 42, 0.34)';
      context.stroke();
    });

    hotspotButtons.forEach(({ zone, button }) => {
      const screen = projectPoint(rotatePoint(zone.point, yaw, pitch), width, height, distance);
      button.dataset.label = zone.label;
      button.ariaLabel = zone.label;
      button.style.left = `${screen.x}px`;
      button.style.top = `${screen.y}px`;
      button.style.display = screen.depth <= 0.2 ? 'none' : 'block';
    });

    requestAnimationFrame(draw);
  }

  draw();
}

if (!adminMode) {
  setStatus('Modo visita. Editor desactivado para usuarios finales.');
  setTimeout(hideStatus, 1400);
}

initViewer();
