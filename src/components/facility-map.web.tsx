import { View } from 'react-native';

/* Peta Leaflet + OpenStreetMap asli (pannable/zoomable) di dalam iframe — tanpa dependensi npm. */

const FACILITIES = [
  { name: 'Toilet Accessible Plaza Indonesia', lat: -6.193, lng: 106.8217, color: '#615fff' },
  { name: 'RS Cipto Mangunkusumo - Klinik Stoma', lat: -6.1957, lng: 106.8497, color: '#00b8db' },
  { name: 'Apotek Kimia Farma - Supplies Ostomy', lat: -6.1952, lng: 106.8206, color: '#2b7fff' },
  { name: 'RS Medika Permata Hijau', lat: -6.2249, lng: 106.7803, color: '#00b8db' },
  { name: 'Toilet Umum Senayan City', lat: -6.2273, lng: 106.7975, color: '#615fff' },
  { name: 'Apotek Guardian - Medical Supplies', lat: -6.2241, lng: 106.81, color: '#2b7fff' },
  { name: 'RS Siloam - Wound Care Center', lat: -6.2199, lng: 106.8177, color: '#00b8db' },
  { name: 'Toilet Accessible FX Sudirman', lat: -6.2258, lng: 106.8027, color: '#615fff' },
];

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
function pin(color) {
  return L.divIcon({
    className: '',
    html: '<div style="width:26px;height:26px;border-radius:9px;background:' + color +
      ';border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',
    iconSize: [26, 26], iconAnchor: [13, 13]
  });
}
${FACILITIES.map(
  (f) =>
    `L.marker([${f.lat}, ${f.lng}], { icon: pin('${f.color}') }).addTo(map).bindPopup(${JSON.stringify(f.name)});`,
).join('\n')}
L.marker([${USER.lat}, ${USER.lng}], { icon: pin('#1d2f4a') }).addTo(map)
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
