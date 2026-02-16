import * as THREE from 'https://unpkg.com/three@0.160.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.1/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://unpkg.com/three@0.160.1/examples/jsm/loaders/OBJLoader.js';

const viewer = document.getElementById('viewer3d');
const hotspotLayer = document.getElementById('hotspotLayer');
const panel = document.getElementById('zonePanel');
const backdrop = document.getElementById('backdrop');
const closePanelButton = document.getElementById('closePanel');

const panelGallery = document.getElementById('panelGallery');
const panelTitle = document.getElementById('panelTitle');
const panelDescription = document.getElementById('panelDescription');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#020617');

const camera = new THREE.PerspectiveCamera(55, viewer.clientWidth / viewer.clientHeight, 0.1, 120);
camera.position.set(5.4, 4.1, 5.8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
viewer.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0.8, 0);
controls.minDistance = 2.5;
controls.maxDistance = 16;

scene.add(new THREE.AmbientLight(0xffffff, 1.25));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.3);
keyLight.position.set(2, 4, 3);
scene.add(keyLight);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(14, 14),
  new THREE.MeshStandardMaterial({ color: '#0b1222', roughness: 0.8, metalness: 0.1 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.02;
scene.add(floor);

const zoneData = [
  {
    id: 'entrada',
    label: 'Entrada principal',
    point: new THREE.Vector3(-0.62, 0.23, 0.98),
    title: 'Entrada principal',
    description:
      'Vestíbulo monumental con acceso al circuito principal. Aquí se centraliza la recepción de visitantes y el punto de información histórica.',
    photos: [
      'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=70',
      'https://images.unsplash.com/photo-1534407119910-316180c7f12b?auto=format&fit=crop&w=1200&q=70'
    ]
  },
  {
    id: 'sala-cupula',
    label: 'Sala de la cúpula',
    point: new THREE.Vector3(0.88, 0.64, 0.14),
    title: 'Sala de la Cúpula',
    description:
      'Espacio central donde se concentra la mayor carga artística del monumento, con frescos originales y restauraciones documentadas.',
    photos: [
      'https://images.unsplash.com/photo-1504268497592-3a5fbf7f8f2b?auto=format&fit=crop&w=1200&q=70',
      'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=1200&q=70'
    ]
  },
  {
    id: 'galeria-norte',
    label: 'Galería norte',
    point: new THREE.Vector3(0.09, 0.43, -0.98),
    title: 'Galería norte',
    description:
      'Recorrido longitudinal con exposición de piezas y una lectura cronológica de las distintas fases de ampliación del monumento.',
    photos: [
      'https://images.unsplash.com/photo-1489516408517-0c0a15662682?auto=format&fit=crop&w=1200&q=70',
      'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?auto=format&fit=crop&w=1200&q=70'
    ]
  }
];

const hotspots = zoneData.map((zone) => {
  const button = document.createElement('button');
  button.className = 'hotspot';
  button.type = 'button';
  button.dataset.label = zone.label;
  button.ariaLabel = zone.label;
  button.addEventListener('click', () => openPanel(zone));
  hotspotLayer.appendChild(button);
  return { zone, button };
});

function openPanel(zone) {
  panelTitle.textContent = zone.title;
  panelDescription.textContent = zone.description;
  panelGallery.innerHTML = zone.photos
    .map((src, index) => `<img src="${src}" alt="${zone.title} imagen ${index + 1}" loading="lazy" />`)
    .join('');

  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
  backdrop.hidden = false;
}

function closePanel() {
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
  backdrop.hidden = true;
}

closePanelButton.addEventListener('click', closePanel);
backdrop.addEventListener('click', closePanel);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closePanel();
  }
});

const loader = new OBJLoader();
loader.load(
  'assets/models/monumento.obj',
  (obj) => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: '#94a3b8',
          roughness: 0.58,
          metalness: 0.12
        });
      }
    });

    const bounds = new THREE.Box3().setFromObject(obj);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3()).length();
    const scaleFactor = 3.2 / size;

    obj.position.sub(center);
    obj.scale.setScalar(scaleFactor);
    obj.position.y = 0;

    scene.add(obj);
  },
  undefined,
  () => {
    // fallback if OBJ is missing
    const fallback = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 1.5, 2.2),
      new THREE.MeshStandardMaterial({ color: '#64748b' })
    );
    fallback.position.y = 0.75;
    scene.add(fallback);
  }
);

const projected = new THREE.Vector3();
function updateHotspots() {
  const width = viewer.clientWidth;
  const height = viewer.clientHeight;

  hotspots.forEach(({ zone, button }) => {
    projected.copy(zone.point).project(camera);
    const x = (projected.x * 0.5 + 0.5) * width;
    const y = (-projected.y * 0.5 + 0.5) * height;
    const hidden = projected.z > 1 || projected.z < -1;

    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
    button.style.display = hidden ? 'none' : 'block';
  });
}

function render() {
  controls.update();
  updateHotspots();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function resize() {
  camera.aspect = viewer.clientWidth / viewer.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(viewer.clientWidth, viewer.clientHeight);
}

window.addEventListener('resize', resize);
render();
