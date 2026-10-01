import { View } from 'react-native';

/* Peta Leaflet + OpenStreetMap asli (pannable/zoomable) di dalam iframe — tanpa dependensi npm. */

const FACILITIES = [
  { name: 'Toilet Accessible Plaza Indonesia', lat: -6.193, lng: 106.8217, kind: 'toilet' },
  { name: 'RS Cipto Mangunkusumo - Klinik Stoma', lat: -6.1957, lng: 106.8497, kind: 'rs' },
  { name: 'Apotek Kimia Farma - Supplies Ostomy', lat: -6.1952, lng: 106.8206, kind: 'apotek' },
  { name: 'RS Medika Permata Hijau', lat: -6.2249, lng: 106.7803, kind: 'rs' },
  { name: 'Toilet Umum Senayan City', lat: -6.2273, lng: 106.7975, kind: 'toilet' },
  { name: 'Apotek Guardian - Medical Supplies', lat: -6.2241, lng: 106.81, kind: 'apotek' },
  { name: 'RS Siloam - Wound Care Center', lat: -6.2199, lng: 106.8177, kind: 'rs' },
  { name: 'Toilet Accessible FX Sudirman', lat: -6.2258, lng: 106.8027, kind: 'toilet' },
];

// Path ikon lucide (toilet, cross, pill), warna sama dengan kartu di lokasi.tsx.
const KIND = {
  toilet: {
    color: '#615fff',
    paths: [
      'M7 12h13a1 1 0 0 1 1 1 5 5 0 0 1-5 5h-.598a.5.5 0 0 0-.424.765l1.544 2.47a.5.5 0 0 1-.424.765H5.402a.5.5 0 0 1-.424-.765L7 18',
      'M8 18a5 5 0 0 1-5-5V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8',
    ],
  },
  rs: {
    color: '#00b8db',
    paths: [
      'M4 9a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a1 1 0 0 1 1 1v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4a1 1 0 0 1 1-1h4a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-4a1 1 0 0 1-1-1V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4a1 1 0 0 1-1 1z',
    ],
  },
  apotek: {
    color: '#2b7fff',
    paths: ['m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z', 'm8.5 8.5 7 7'],
  },
};

const USER = { lat: -6.2088, lng: 106.813 };

const html = `<!doctype html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<style>html,body,#map{margin:0;height:100%;font-family:Inter,sans-serif}</style>
</head><body><div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
var map = L.map('map', { zoomControl: false }).setView([${USER.lat}, ${USER.lng}], 13);
L.control.zoom({ position: 'bottomright' }).addTo(map);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);
var KIND = ${JSON.stringify(KIND)};
function pin(kind) {
  var k = KIND[kind];
  var svg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
    k.paths.map(function (d) { return '<path d="' + d + '"/>'; }).join('') + '</svg>';
  return L.divIcon({
    className: '',
    html: '<div style="width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:' + k.color +
      ';border:2.5px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center">' +
      '<div style="transform:rotate(45deg);display:flex">' + svg + '</div></div>',
    iconSize: [34, 34], iconAnchor: [17, 40], popupAnchor: [0, -38]
  });
}
var me = L.divIcon({
  className: '',
  html: '<div style="width:18px;height:18px;border-radius:50%;background:#1d2f4a;border:3px solid #fff;box-shadow:0 0 0 6px rgba(29,47,74,.2),0 2px 6px rgba(0,0,0,.35)"></div>',
  iconSize: [18, 18], iconAnchor: [9, 9]
});
${FACILITIES.map(
  (f) =>
    `L.marker([${f.lat}, ${f.lng}], { icon: pin('${f.kind}') }).addTo(map).bindPopup(${JSON.stringify(f.name)});`,
).join('\n')}
L.marker([${USER.lat}, ${USER.lng}], { icon: me }).addTo(map)
  .bindPopup('📍 Anda di sini').openPopup();
</script></body></html>`;

export function FacilityMap() {
  return (
    <View style={{ flex: 1 }}>
      <iframe
        srcDoc={html}
        style={{ border: 0, width: '100%', height: '100%' }}
        title="Peta fasilitas terdekat"
      />
    </View>
  );
}
