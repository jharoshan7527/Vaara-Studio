
// Front-end JS for interacting with API
const API = window.location.origin + '/api';
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

document.addEventListener('DOMContentLoaded', () => {
  updateAuthLinks();
  if (document.getElementById('servicesGrid')) loadServices();
  if (document.getElementById('inquiryForm')) attachInquiryForm();
  if (document.getElementById('loginForm')) attachAuthForms();
  if (document.getElementById('adminInquiries')) loadAdmin();
  if (document.getElementById('createServiceForm')) attachCreateService();
  if (document.getElementById('categoryFilter')) {
    document.getElementById('categoryFilter').addEventListener('change', loadServices);
  }
});

function updateAuthLinks() {
  const loginLink = document.getElementById('loginLink');
  const adminLink = document.getElementById('adminLink');
  if (!loginLink || !adminLink) return;
  if (token) {
    loginLink.textContent = 'Logout';
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    });
    if (user && (user.role === 'admin' || user.role === 'provider')) {
      adminLink.classList.remove('hidden');
    }
  }
}

async function loadServices() {
  const grid = document.getElementById('servicesGrid');
  const cat = document.getElementById('categoryFilter')?.value || '';
  const url = `${API}/services${cat ? ('?category=' + encodeURIComponent(cat)) : ''}`;
  const res = await fetch(url);
  const items = await res.json();
  grid.innerHTML = items.map(s => `
    <div class="card">
      ${s.images?.length ? `<img src="${s.images[0]}" alt="${s.title}">` : ''}
      <h3>${s.title}</h3>
      <p class="muted">${s.category}</p>
      <p>${s.description}</p>
      <p><strong>Starts at:</strong> ₹${s.priceFrom || 0}</p>
      <button class="btn" onclick="prefillInquiry('${s._id}')">Inquire</button>
    </div>
  `).join('');
}

function prefillInquiry(serviceId) {
  window.location.href = '/contact.html#' + serviceId;
}

function attachInquiryForm() {
  const form = document.getElementById('inquiryForm');
  const status = document.getElementById('inquiryStatus');
  // prefill service id from hash
  if (location.hash.slice(1)) form.service.value = location.hash.slice(1);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch(API + '/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const out = await res.json();
    if (res.ok) {
      status.textContent = 'Thanks! We received your inquiry.';
      form.reset();
    } else {
      status.textContent = out.error || 'Something went wrong.';
    }
  });
}

function attachAuthForms() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(loginForm).entries());
    const res = await fetch(API + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const out = await res.json();
    if (res.ok) {
      localStorage.setItem('token', out.token);
      localStorage.setItem('user', JSON.stringify(out.user));
      window.location.href = '/admin.html';
    } else {
      alert(out.error || 'Login failed');
    }
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(registerForm).entries());
    const res = await fetch(API + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const out = await res.json();
    if (res.ok) {
      alert('Account created. You can login now.');
      registerForm.reset();
    } else {
      alert(out.error || 'Registration failed');
    }
  });
}

async function loadAdmin() {
  if (!token) {
    document.querySelector('main').innerHTML = '<div class="container"><p>Please <a href="/login.html">login</a> as admin or provider.</p></div>';
    return;
  }
  const headers = { Authorization: 'Bearer ' + token };

  const [inqRes, svcRes] = await Promise.all([
    fetch(API + '/admin/inquiries', { headers }),
    fetch(API + '/admin/services', { headers }),
  ]);

  const inqTarget = document.getElementById('adminInquiries');
  if (inqRes.ok) {
    const items = await inqRes.json();
    inqTarget.innerHTML = items.map(i => `
      <div class="row card" style="margin-bottom:8px;">
        <div><strong>${i.name}</strong> <span class="muted">&lt;${i.email}&gt;</span></div>
        <div>${i.message}</div>
        <div class="muted">Status: ${i.status}</div>
      </div>
    `).join('');
  } else {
    inqTarget.innerHTML = '<p class="muted">No permission or no data.</p>';
  }

  const svcTarget = document.getElementById('adminServices');
  if (svcRes.ok) {
    const items = await svcRes.json();
    svcTarget.innerHTML = items.map(s => `
      <div class="card" style="margin:8px 0;">
        <h4>${s.title} <span class="muted">(${s.category})</span></h4>
        <p>${s.description}</p>
        <p>₹${s.priceFrom || 0}</p>
        <button class="btn" onclick="deleteService('${s._id}')">Delete</button>
      </div>
    `).join('');
  } else {
    svcTarget.innerHTML = '<p class="muted">No permission or no data.</p>';
  }
}

async function deleteService(id) {
  if (!confirm('Delete this service?')) return;
  const res = await fetch(API + '/services/' + id, {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token }
  });
  if (res.ok) {
    location.reload();
  } else {
    alert('Delete failed');
  }
}

function attachCreateService() {
  const form = document.getElementById('createServiceForm');
  const status = document.getElementById('createServiceStatus');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    // convert price
    data.priceFrom = Number(data.priceFrom || 0);
    const res = await fetch(API + '/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify(data)
    });
    const out = await res.json();
    if (res.ok) {
      status.textContent = 'Created!';
      form.reset();
      setTimeout(() => location.reload(), 500);
    } else {
      status.textContent = out.error || 'Failed.';
    }
  });
}

// ===== Lightbox Feature =====
function initLightbox() {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `<span class="close">&times;</span><img src="" alt="Preview">`;
  document.body.appendChild(lightbox);

  const imgTag = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.close');

  // Click any card image → open lightbox
  document.body.addEventListener('click', e => {
    if (e.target.tagName === 'IMG' && e.target.closest('.card')) {
      imgTag.src = e.target.src;
      lightbox.classList.add('active');
    }
  });

  // Close on X or background click
  closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });

  // Close on ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') lightbox.classList.remove('active');
  });
}

// Initialize after DOM ready
document.addEventListener('DOMContentLoaded', initLightbox);

