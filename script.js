// ── Driver tabs ───────────────────────────────────
document.querySelectorAll('.driver-tab').forEach(tab => {
  tab.addEventListener('click', function () {
    // Car tabs
    if (this.dataset.car !== undefined) {
      const idx = this.dataset.car;
      this.closest('.info-card').querySelectorAll('.driver-tab').forEach(t => t.classList.remove('active'));
      this.closest('.info-card').querySelectorAll('.car-panel').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      this.closest('.info-card').querySelector(`.car-panel[data-carpanel="${idx}"]`).classList.add('active');
      return;
    }
    // Driver tabs
    const idx = this.dataset.driver;
    this.closest('.info-card').querySelectorAll('.driver-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.driver-panel').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    document.querySelector(`.driver-panel[data-panel="${idx}"]`).classList.add('active');
  });
});

// ── Hamburger menu ───────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  // Close menu when a mobile link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// ── Auto Date & Time display ─────────────────────
function updateDateTime() {
  const now = new Date();
  const dateEl = document.getElementById('auto-date');
  const timeEl = document.getElementById('auto-time');
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString('en-PH', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
  if (timeEl) {
    timeEl.textContent = now.toLocaleTimeString('en-PH', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
  }
}
updateDateTime();
setInterval(updateDateTime, 1000);

// ── Passenger selector ───────────────────────────
document.querySelectorAll('.pax-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.pax-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── Pet toggle ───────────────────────────────────
const noPet   = document.getElementById('no-pet');
const withPet = document.getElementById('with-pet');
if (noPet && withPet) {
  noPet.addEventListener('click', () => { noPet.classList.add('active'); withPet.classList.remove('active'); });
  withPet.addEventListener('click', () => { withPet.classList.add('active'); noPet.classList.remove('active'); });
}

// ── Fare Calculator ──────────────────────────────
const BASE_FARE   = 40;
const RATE_PER_KM = 13;
const kmInput   = document.getElementById('km-input');
const totalFare = document.getElementById('total-fare');
function calcFare() {
  const km = parseFloat(kmInput.value) || 0;
  totalFare.textContent = '₱ ' + (BASE_FARE + km * RATE_PER_KM).toFixed(2);
}
if (kmInput) kmInput.addEventListener('input', calcFare);

// ── Advance Booking Modal ─────────────────────────
const advModal      = document.getElementById('advance-modal');
const advCloseBtn   = document.getElementById('advance-modal-close');
const advCancelBtn  = document.getElementById('advance-modal-cancel');
const advConfirmBtn = document.getElementById('advance-modal-confirm');

function openAdvModal() {
  // Pre-fill with tomorrow's date and current time as defaults
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm   = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd   = String(tomorrow.getDate()).padStart(2, '0');
  document.getElementById('adv-date').value = `${yyyy}-${mm}-${dd}`;
  document.getElementById('adv-date').min   = new Date().toISOString().split('T')[0];

  const now = new Date();
  const hh  = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('adv-time').value = `${hh}:${min}`;

  advModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAdvModal() {
  advModal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelector('.advance-btn')?.addEventListener('click', openAdvModal);
advCloseBtn?.addEventListener('click', closeAdvModal);
advCancelBtn?.addEventListener('click', closeAdvModal);
advModal?.addEventListener('click', (e) => { if (e.target === advModal) closeAdvModal(); });

advConfirmBtn?.addEventListener('click', () => {
  const dateVal = document.getElementById('adv-date').value;
  const timeVal = document.getElementById('adv-time').value;

  if (!dateVal || !timeVal) {
    alert('Please select both a date and time.');
    return;
  }

  const pickup  = document.getElementById('pickup-input')?.value.trim();
  const dropoff = document.getElementById('dropoff-input')?.value.trim();
  if (!pickup || !dropoff) {
    closeAdvModal();
    alert('Please fill in your pick-up and drop-off locations first.');
    return;
  }

  // Format nicely
  const dateObj = new Date(`${dateVal}T${timeVal}`);
  const formatted = dateObj.toLocaleString('en-PH', {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
  });

  closeAdvModal();

  // Reuse the booking confirmation modal with the chosen date/time
  const kmVal      = parseFloat(document.getElementById('km-input')?.value) || 0;
  const fare       = BASE_FARE + kmVal * RATE_PER_KM;
  const distCharge = kmVal * RATE_PER_KM;
  const durationMin = kmVal > 0 ? Math.round((kmVal / 30) * 60) : null;
  let durationStr  = 'N/A';
  if (durationMin !== null) {
    durationStr = durationMin < 60 ? `~${durationMin} min` : `~${Math.floor(durationMin/60)}h ${durationMin%60}min`;
  }

  document.getElementById('modal-pickup').textContent   = pickup;
  document.getElementById('modal-dropoff').textContent  = dropoff;
  document.getElementById('modal-datetime').textContent = formatted;
  document.getElementById('modal-distance').textContent = kmVal > 0 ? `${kmVal.toFixed(1)} km` : 'N/A';
  document.getElementById('modal-duration').textContent = durationStr;
  document.getElementById('modal-dist-charge').textContent = `₱ ${distCharge.toFixed(2)}`;
  document.getElementById('modal-total').textContent    = `₱ ${fare.toFixed(2)}`;

  // Update modal title to reflect it's an advance booking
  document.getElementById('modal-title').textContent   = 'Advance Booking Confirmed! 📅';
  openModal();
});

// ── Modal helpers ─────────────────────────────────
function openModal() {
  const modal = document.getElementById('booking-modal');
  if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  // Reset payment to cash each time modal opens
  resetPayment();
}
function closeModal() {
  const modal = document.getElementById('booking-modal');
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
}
document.getElementById('modal-close')?.addEventListener('click', closeModal);
document.getElementById('modal-ok')?.addEventListener('click', closeModal);
document.getElementById('booking-modal')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// ── Payment toggle ────────────────────────────────
function resetPayment() {
  document.getElementById('pay-cash')?.classList.add('active');
  document.getElementById('pay-gcash')?.classList.remove('active');
  document.getElementById('cash-info').style.display = 'flex';
  document.getElementById('gcash-info').style.display = 'none';
}

document.getElementById('pay-cash')?.addEventListener('click', () => {
  document.getElementById('pay-cash').classList.add('active');
  document.getElementById('pay-gcash').classList.remove('active');
  document.getElementById('cash-info').style.display = 'flex';
  document.getElementById('gcash-info').style.display = 'none';
});

document.getElementById('pay-gcash')?.addEventListener('click', () => {
  document.getElementById('pay-gcash').classList.add('active');
  document.getElementById('pay-cash').classList.remove('active');
  document.getElementById('cash-info').style.display = 'none';
  document.getElementById('gcash-info').style.display = 'block';
  // Sync QR amount with total fare
  const total = document.getElementById('modal-total')?.textContent || '₱ 40.00';
  document.getElementById('qr-amount').textContent = total;
});

// ── Book Now ──────────────────────────────────────
document.querySelector('.cta-wide')?.addEventListener('click', () => {
  const pickup  = document.getElementById('pickup-input')?.value.trim();
  const dropoff = document.getElementById('dropoff-input')?.value.trim();
  if (!pickup || !dropoff) {
    alert('Please fill in both pick-up and drop-off locations.');
    return;
  }

  const kmVal   = parseFloat(document.getElementById('km-input')?.value) || 0;
  const fare    = BASE_FARE + kmVal * RATE_PER_KM;
  const distCharge = kmVal * RATE_PER_KM;

  // Estimate duration: assume avg 30 km/h in city traffic
  const avgSpeedKmH = 30;
  const durationMin = kmVal > 0 ? Math.round((kmVal / avgSpeedKmH) * 60) : null;
  let durationStr = 'N/A';
  if (durationMin !== null) {
    if (durationMin < 60) durationStr = `~${durationMin} min`;
    else durationStr = `~${Math.floor(durationMin/60)}h ${durationMin%60}min`;
  }

  const now = new Date();
  const dateTimeStr = now.toLocaleString('en-PH', {
    weekday: 'short', month: 'short', day: 'numeric',
    year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
  });

  // Populate modal
  document.getElementById('modal-pickup').textContent   = pickup;
  document.getElementById('modal-dropoff').textContent  = dropoff;
  document.getElementById('modal-datetime').textContent = dateTimeStr;
  document.getElementById('modal-distance').textContent = kmVal > 0 ? `${kmVal.toFixed(1)} km` : 'N/A';
  document.getElementById('modal-duration').textContent = durationStr;
  document.getElementById('modal-dist-charge').textContent = `₱ ${distCharge.toFixed(2)}`;
  document.getElementById('modal-total').textContent    = `₱ ${fare.toFixed(2)}`;

  openModal();
});

// ════════════════════════════════════════════════════
//  MAP SECTION
// ════════════════════════════════════════════════════
(function initMap() {
  // Default center — Metro Manila
  const DEFAULT_LAT = 14.5995;
  const DEFAULT_LNG = 120.9842;
  const DEFAULT_ZOOM = 13;

  // ── Init map ──────────────────────────────────────
  const map = L.map('booking-map', {
    center: [DEFAULT_LAT, DEFAULT_LNG],
    zoom: DEFAULT_ZOOM,
    zoomControl: true,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  // ── Custom icons ──────────────────────────────────
  function makeIcon(color, label) {
    return L.divIcon({
      className: '',
      html: `
        <div style="
          width:36px; height:36px;
          background:${color};
          border:3px solid #fff;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 3px 12px rgba(0,0,0,0.25);
          display:flex; align-items:center; justify-content:center;
        ">
          <span style="
            transform:rotate(45deg);
            font-size:13px;
            font-weight:700;
            color:#fff;
            font-family:DM Sans,sans-serif;
          ">${label}</span>
        </div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -38],
    });
  }

  const pickupIcon  = makeIcon('#16a34a', 'A');
  const dropoffIcon = makeIcon('#0a0a0a', 'B');

  // ── State ─────────────────────────────────────────
  let pickupMarker  = null;
  let dropoffMarker = null;
  let routeLine     = null;
  let activeMode    = 'pickup'; // 'pickup' | 'dropoff'

  const pickupInput   = document.getElementById('pickup-input');
  const dropoffInput  = document.getElementById('dropoff-input');
  const pickupSug     = document.getElementById('pickup-suggestions');
  const dropoffSug    = document.getElementById('dropoff-suggestions');
  const modePUBtn     = document.getElementById('mode-pickup');
  const modeDOBtn     = document.getElementById('mode-dropoff');

  // ── Mode toggle ───────────────────────────────────
  function setMode(mode) {
    activeMode = mode;
    modePUBtn.classList.toggle('active', mode === 'pickup');
    modeDOBtn.classList.toggle('active', mode === 'dropoff');
  }
  modePUBtn.addEventListener('click', () => setMode('pickup'));
  modeDOBtn.addEventListener('click', () => setMode('dropoff'));

  // Switch mode automatically when an input gets focus
  pickupInput.addEventListener('focus', () => setMode('pickup'));
  dropoffInput.addEventListener('focus', () => setMode('dropoff'));

  // ── Reverse geocode (coords → address) ───────────
  async function reverseGeocode(lat, lng) {
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=17&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const d = await r.json();
      return d.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  }

  // ── Forward geocode (text → suggestions) ─────────
  let searchTimer = null;
  async function geocodeSearch(query) {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    return r.json();
  }

  function buildSuggestions(container, results, onSelect) {
    container.innerHTML = '';
    results.forEach(item => {
      const div = document.createElement('div');
      div.className = 'suggestion';
      div.innerHTML = `<i class="fas fa-map-marker-alt"></i>${item.display_name}`;
      div.addEventListener('mousedown', (e) => {
        e.preventDefault();
        onSelect(item);
        container.innerHTML = '';
      });
      container.appendChild(div);
    });
  }

  function setupSearch(input, sugContainer, onPick) {
    input.addEventListener('input', () => {
      clearTimeout(searchTimer);
      const q = input.value.trim();
      if (q.length < 3) { sugContainer.innerHTML = ''; return; }
      searchTimer = setTimeout(async () => {
        const results = await geocodeSearch(q);
        buildSuggestions(sugContainer, results, (item) => {
          input.value = item.display_name;
          onPick(parseFloat(item.lat), parseFloat(item.lon), item.display_name);
        });
      }, 400);
    });
    input.addEventListener('blur', () => {
      setTimeout(() => { sugContainer.innerHTML = ''; }, 150);
    });
  }

  // ── Place / update marker ─────────────────────────
  function placePickup(lat, lng, label) {
    if (pickupMarker) map.removeLayer(pickupMarker);
    pickupMarker = L.marker([lat, lng], { icon: pickupIcon, draggable: true })
      .addTo(map)
      .bindPopup(`<b>Pick-up</b><br>${label}`);
    pickupInput.value = label;
    pickupMarker.on('dragend', async (e) => {
      const { lat, lng } = e.target.getLatLng();
      const addr = await reverseGeocode(lat, lng);
      pickupInput.value = addr;
      pickupMarker.setPopupContent(`<b>Pick-up</b><br>${addr}`);
      drawRoute();
    });
    drawRoute();
  }

  function placeDropoff(lat, lng, label) {
    if (dropoffMarker) map.removeLayer(dropoffMarker);
    dropoffMarker = L.marker([lat, lng], { icon: dropoffIcon, draggable: true })
      .addTo(map)
      .bindPopup(`<b>Drop-off</b><br>${label}`);
    dropoffInput.value = label;
    dropoffMarker.on('dragend', async (e) => {
      const { lat, lng } = e.target.getLatLng();
      const addr = await reverseGeocode(lat, lng);
      dropoffInput.value = addr;
      dropoffMarker.setPopupContent(`<b>Drop-off</b><br>${addr}`);
      drawRoute();
    });
    drawRoute();
  }

  // ── Draw straight line between markers ───────────
  function drawRoute() {
    if (routeLine) map.removeLayer(routeLine);
    if (!pickupMarker || !dropoffMarker) return;
    const a = pickupMarker.getLatLng();
    const b = dropoffMarker.getLatLng();
    routeLine = L.polyline([a, b], {
      color: '#f5c200',
      weight: 4,
      opacity: 0.85,
      dashArray: '10, 8',
    }).addTo(map);
    // Fit map to show both markers
    map.fitBounds(L.latLngBounds([a, b]), { padding: [50, 50] });

    // Auto-update fare km field based on straight-line distance
    const distKm = a.distanceTo(b) / 1000;
    if (kmInput) {
      kmInput.value = distKm.toFixed(1);
      calcFare();
    }
  }

  // ── Click map to place active marker ─────────────
  map.on('click', async (e) => {
    const { lat, lng } = e.latlng;
    const addr = await reverseGeocode(lat, lng);
    if (activeMode === 'pickup') {
      placePickup(lat, lng, addr);
      setMode('dropoff'); // auto-advance to dropoff after setting pickup
    } else {
      placeDropoff(lat, lng, addr);
    }
  });

  // ── Search inputs ─────────────────────────────────
  setupSearch(pickupInput, pickupSug, (lat, lng, label) => {
    placePickup(lat, lng, label);
    map.setView([lat, lng], 15);
    setMode('dropoff');
  });

  setupSearch(dropoffInput, dropoffSug, (lat, lng, label) => {
    placeDropoff(lat, lng, label);
    if (pickupMarker) drawRoute();
    else map.setView([lat, lng], 15);
  });

  // ── "Use my location" button ──────────────────────
  document.getElementById('locate-me')?.addEventListener('click', () => {
    if (!navigator.geolocation) { alert('Geolocation not supported by your browser.'); return; }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      const addr = await reverseGeocode(lat, lng);
      placePickup(lat, lng, addr);
      map.setView([lat, lng], 16);
      setMode('dropoff');
    }, () => {
      alert('Could not get your location. Please allow location access.');
    });
  });

})();