// ── Location data ──────────────────────────────────────────────────────────
const LOCATIONS = [
  {
    id: 'battersea',
    name: 'Battersea Power Station',
    city: 'London',
    lat: 51.4820,
    lng: -0.1445,
    tag: 'Premium Destination',
    desc: 'Iconic riverside landmark. Premium brand event space with Thames backdrop — ideal for product launches and creator content.',
    color: '#DD592B',
  },
  {
    id: 'spinningfields',
    name: 'Spinningfields',
    city: 'Manchester',
    lat: 53.4795,
    lng: -2.2507,
    tag: 'Premium District',
    desc: "Manchester's financial and lifestyle hub. Aspirational crowd, outdoor public squares perfect for premium brand activations.",
    color: '#4A9B8E',
  },
  {
    id: 'piccadilly',
    name: 'Piccadilly Gardens',
    city: 'Manchester',
    lat: 53.4809,
    lng: -2.2371,
    tag: 'High Footfall',
    desc: 'Convergence of tram, bus and train. Enormous daily footfall — open public space, no venue hire needed.',
    color: '#1D9E75',
  },
  {
    id: 'waverley',
    name: 'Edinburgh Waverley',
    city: 'Edinburgh',
    lat: 55.9520,
    lng: -3.1899,
    tag: 'Transport Hub',
    desc: 'Central Edinburgh train hub. Massive commuter and tourist footfall. Concourse spaces available for brand sampling.',
    color: '#D8B38F',
  },
  {
    id: 'castle',
    name: 'Edinburgh Castle',
    city: 'Edinburgh',
    lat: 55.9486,
    lng: -3.1999,
    tag: 'Iconic Landmark',
    desc: "Scotland's most visited attraction. 1.3M+ visitors per year. Unbeatable backdrop for brand photography.",
    color: '#A5353A',
  },
];

// ── State ──────────────────────────────────────────────────────────────────
let selectedId   = null;
let currentFilter = 'all';
const markers = {};

// ── Map init ───────────────────────────────────────────────────────────────
const map = L.map('map').setView([54.5, -3.0], 6);

L.maplibreGL({
  style: 'https://tiles.openfreemap.org/styles/liberty',
  attribution: '© <a href="https://openfreemap.org">OpenFreeMap</a> © <a href="https://www.openmaptiles.org/">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// ── Helpers ────────────────────────────────────────────────────────────────
function createIcon(color, selected = false) {
  return L.divIcon({
    className: '',
    html: `<div class="marker-pin${selected ? ' selected' : ''}" style="background:${color}"></div>`,
    iconSize:   [28, 28],
    iconAnchor: [14, 28],
    popupAnchor:[0, -30],
  });
}

function popupHTML(loc) {
  return `
    <div class="popup-inner">
      <div class="popup-tag" style="color:${loc.color}">${loc.tag}</div>
      <div class="popup-name">${loc.name}</div>
      <div class="popup-city">📍 ${loc.city}</div>
      <div class="popup-desc">${loc.desc}</div>
    </div>`;
}

// ── Select a location ──────────────────────────────────────────────────────
function selectLoc(id) {
  selectedId = id;

  // Update card styles
  document.querySelectorAll('.card').forEach(c => c.classList.remove('sel'));
  const card = document.getElementById('card-' + id);
  if (card) {
    card.classList.add('sel');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Update marker styles
  LOCATIONS.forEach(l => {
    if (markers[l.id]) {
      markers[l.id].setIcon(createIcon(l.color, l.id === id));
    }
  });

  // Fly to location and open popup
  const loc = LOCATIONS.find(l => l.id === id);
  if (loc && markers[id]) {
    map.flyTo([loc.lat, loc.lng], 14, { duration: 1.2 });
    setTimeout(() => markers[id].openPopup(), 950);
  }
}

// ── Filter by city ─────────────────────────────────────────────────────────
function filterCity(city) {
  currentFilter = city;

  // Update pills
  document.querySelectorAll('.pill').forEach(p => {
    p.classList.toggle('active', p.dataset.city === city);
  });

  // Show/hide cards
  document.querySelectorAll('.card').forEach(c => {
    const loc = LOCATIONS.find(l => l.id === c.id.replace('card-', ''));
    c.style.display = (city === 'all' || loc.city === city) ? '' : 'none';
  });

  // Show/hide markers
  LOCATIONS.forEach(loc => {
    if (!markers[loc.id]) return;
    const visible = city === 'all' || loc.city === city;
    if (visible) { map.addLayer(markers[loc.id]); }
    else         { map.removeLayer(markers[loc.id]); }
  });

  // Clear selection
  selectedId = null;
  document.querySelectorAll('.card').forEach(c => c.classList.remove('sel'));
  LOCATIONS.forEach(l => {
    if (markers[l.id]) markers[l.id].setIcon(createIcon(l.color, false));
  });

  // Fly to bounds
  const vis = city === 'all' ? LOCATIONS : LOCATIONS.filter(l => l.city === city);
  if (vis.length === 1) {
    map.flyTo([vis[0].lat, vis[0].lng], 13, { duration: 1 });
  } else {
    const bounds = L.latLngBounds(vis.map(l => [l.lat, l.lng]));
    map.flyToBounds(bounds.pad(0.4), { duration: 1 });
  }
}

// ── Build markers + sidebar cards ──────────────────────────────────────────
const cardList = document.getElementById('cards');

LOCATIONS.forEach(loc => {
  // Marker
  const marker = L.marker([loc.lat, loc.lng], { icon: createIcon(loc.color, false) })
    .bindPopup(popupHTML(loc), { className: 'custom-popup', maxWidth: 250 })
    .addTo(map);

  marker.on('click', () => selectLoc(loc.id));
  markers[loc.id] = marker;

  // Sidebar card
  const card = document.createElement('div');
  card.className = 'card';
  card.id = 'card-' + loc.id;
  card.innerHTML = `
    <div class="card-tag" style="color:${loc.color}">${loc.tag}</div>
    <div class="card-name">${loc.name}</div>
    <div class="card-city">📍 ${loc.city}</div>
    <div class="card-desc">${loc.desc}</div>
  `;
  card.addEventListener('click', () => selectLoc(loc.id));
  cardList.appendChild(card);
});

// ── Wire up filter buttons ─────────────────────────────────────────────────
document.getElementById('filters').addEventListener('click', e => {
  if (e.target.classList.contains('pill')) {
    filterCity(e.target.dataset.city);
  }
});
