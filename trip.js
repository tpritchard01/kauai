// Trip: Hawaii 2026 (Kauai + Oahu)
// Travelers: Timothy Pritchard, Kimberly Meekins

// Encrypted confirmation numbers (unlock with password)
const encryptedSecrets = {
  airline: "NbPv0H5fvBefYLVBMj9MOlheufWKxq9N7xpTuQno9aFdwuQNQUUJhLxamxt/3FTcuXQ=",
  kauaiCar: "XDkQ2+b8tmQI/oy2Ky8IPzsLXUOjdWQ55DESqA+hd8VCavOAB1E7UI68MOPAAiyCTecbmTlo",
  expedia: "P2objuRuEyiscaygWlLPf/OXO0Qtc7itASk6ixX87UFBmafuCN7WZwI3f3N/LNMv3E4VNtf3CItJqQ==",
  hertz: "Tz0DWVUERxWKHlAJ3ISpXv+oiQvLXF/pZoKFKQiwg8HBlFThFWbiLwwiI82r3YM650j1VVSX+Q=="
};

async function decrypt(encoded, password) {
  const raw = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
  const salt = raw.slice(0, 16);
  const nonce = raw.slice(16, 28);
  const ct = raw.slice(28);
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce }, key, ct);
  return new TextDecoder().decode(decrypted);
}

let secretsUnlocked = false;
const decryptedSecrets = {};

async function unlockSecrets() {
  const pwd = prompt('Enter trip password:');
  if (!pwd) return;
  try {
    decryptedSecrets.airline = await decrypt(encryptedSecrets.airline, pwd);
    decryptedSecrets.kauaiCar = await decrypt(encryptedSecrets.kauaiCar, pwd);
    decryptedSecrets.expedia = await decrypt(encryptedSecrets.expedia, pwd);
    decryptedSecrets.hertz = await decrypt(encryptedSecrets.hertz, pwd);
    secretsUnlocked = true;
    document.getElementById('lock-btn').textContent = '🔓';
    goTo(current); // refresh current view
  } catch (e) {
    alert('Wrong password');
  }
}

function getNote(wp) {
  if (!secretsUnlocked) return wp.note;
  let note = wp.note;
  if (wp.secretKey) note += ' · ' + wp.secretLabel + decryptedSecrets[wp.secretKey];
  return note;
}
const trip = {
  name: "Hawaii 2026",
  waypoints: [
    {
      title: "Depart Seattle (SEA)",
      time: "Fri May 22, 6:06 PM",
      icon: "✈️",
      lat: 47.4502,
      lng: -122.3088,
      note: "AS 237 · Boeing 737-800 · Main (N) · 6h 20m"
    },
    {
      title: "Arrive Lihue, Kauai (LIH)",
      time: "Fri May 22, 9:26 PM",
      icon: "✈️",
      lat: 21.9770,
      lng: -159.3390,
      note: "AS 237",
      secretKey: "airline", secretLabel: "Conf: "
    },
    {
      title: "Check-in: Kaua'i Palms Hotel",
      time: "Fri May 22, ~9:30 PM",
      icon: "🏠",
      lat: 21.9750,
      lng: -159.3560,
      note: "2931 Kalena St, Lihue · Check-out Sat 11 AM",
      secretKey: "expedia", secretLabel: "Expedia #"
    },
    {
      title: "Car Rental Pickup (LIH Airport)",
      time: "Sat May 23, 12:00 PM",
      icon: "🚗",
      lat: 21.9770,
      lng: -159.3390,
      note: "Chevy Tahoe · Automatic",
      secretKey: "kauaiCar", secretLabel: "Booking #"
    },
    {
      title: "Check-in: Hale Koa",
      time: "Sat May 23, 3:00 PM",
      icon: "🏠",
      lat: 21.8800,
      lng: -159.4530,
      note: "2598 Hoonani Rd, Koloa · Check-out Thu May 28, 11 AM"
    },
    {
      title: "Car Rental Return (LIH Airport)",
      time: "Thu May 28, 12:00 PM",
      icon: "🚗",
      lat: 21.9770,
      lng: -159.3390,
      note: "Chevy Tahoe",
      secretKey: "kauaiCar", secretLabel: "Booking #"
    },
    {
      title: "Depart Lihue (LIH)",
      time: "Thu May 28, 12:55 PM",
      icon: "✈️",
      lat: 21.9770,
      lng: -159.3390,
      note: "AS 1074 · Boeing 717-200 · Hawaiian Main (O) · 0h 40m"
    },
    {
      title: "Arrive Honolulu (HNL)",
      time: "Thu May 28, 1:35 PM",
      icon: "✈️",
      lat: 21.3245,
      lng: -157.9251,
      note: "AS 1074 · Operated as Hawaiian Airlines"
    },
    {
      title: "Rental Car Pickup (HNL Airport)",
      time: "Thu May 28, 2:00 PM",
      icon: "🚗",
      lat: 21.3245,
      lng: -157.9251,
      note: "300 Rodgers Blvd · One-way rental",
      secretKey: "hertz", secretLabel: "Hertz #"
    },
    {
      title: "Check-in: The Twin Fin Hotel",
      time: "Thu May 28, 3:00 PM",
      icon: "🏠",
      lat: 21.2755,
      lng: -157.8235,
      note: "2570 Kalākaua Ave, Waikiki · Check-out Sat May 30, 11 AM"
    },
    {
      title: "Rental Car Drop-off (Hyatt Waikiki)",
      time: "Fri May 29, 2:00 PM",
      icon: "🚗",
      lat: 21.2769,
      lng: -157.8234,
      note: "2424 Kalākaua Ave · Hyatt Regency Waikiki Beach",
      secretKey: "hertz", secretLabel: "Hertz #"
    },
    {
      title: "Depart Honolulu (HNL)",
      time: "Sat May 30, 3:02 PM",
      icon: "✈️",
      lat: 21.3245,
      lng: -157.9251,
      note: "AS 267 · Boeing 737 MAX 9 · Main (L) · 5h 57m"
    },
    {
      title: "Arrive Seattle (SEA)",
      time: "Sat May 30, 11:59 PM",
      icon: "✈️",
      lat: 47.4502,
      lng: -122.3088,
      note: "AS 267 · Welcome home!"
    }
  ]
};

// Init map
const map = L.map('map', { zoomControl: false }).setView([trip.waypoints[0].lat, trip.waypoints[0].lng], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);
L.control.zoom({ position: 'topright' }).addTo(map);

// Add markers
const markers = trip.waypoints.map((wp, i) => {
  const marker = L.marker([wp.lat, wp.lng], {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="font-size:20px;text-align:center;width:30px;height:30px;line-height:30px;background:#fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${wp.icon}</div>`,
      iconSize: [30, 30], iconAnchor: [15, 15]
    })
  }).addTo(map);
  marker.on('click', () => goTo(i));
  return marker;
});

// Draw route line
const routeLine = L.polyline(trip.waypoints.map(wp => [wp.lat, wp.lng]), {
  color: '#2196F3', weight: 3, opacity: 0.6, dashArray: '8,8'
}).addTo(map);

// Slider setup
const slider = document.getElementById('slider');
const waypointsEl = document.getElementById('waypoints');
slider.max = trip.waypoints.length - 1;

// Render dots
trip.waypoints.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'dot';
  dot.onclick = () => goTo(i);
  waypointsEl.appendChild(dot);
});

// Navigation
let current = 0;
function goTo(idx) {
  current = idx;
  slider.value = idx;
  const wp = trip.waypoints[idx];

  document.querySelector('#event-info .icon').textContent = wp.icon;
  document.querySelector('#event-info .title').textContent = wp.title;
  document.querySelector('#event-info .time').textContent = `${wp.time} — ${getNote(wp)}`;

  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));

  map.flyTo([wp.lat, wp.lng], 14, { duration: 0.8 });
  markers[idx].bindPopup(`<b>${wp.title}</b><br>${wp.time}<br><em>${getNote(wp)}</em>`).openPopup();
}

slider.addEventListener('input', e => goTo(parseInt(e.target.value)));
document.getElementById('prev').onclick = () => goTo(Math.max(0, current - 1));
document.getElementById('next').onclick = () => goTo(Math.min(trip.waypoints.length - 1, current + 1));

goTo(0);
