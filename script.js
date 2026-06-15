// NAV SCROLL
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

// PARALLAX HERO
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = y < window.innerHeight
      ? `scale(1.08) translateY(${y * 0.15}px)`
      : `scale(1.08) translateY(${window.innerHeight * 0.15}px)`;
  }, { passive: true });
}

// REVEAL ON SCROLL
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.delay) || 0;
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// MOBILE MENU
const toggle = document.getElementById('menuToggle');
const overlay = document.getElementById('menuOverlay');

toggle.addEventListener('click', () => {
  const isActive = toggle.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.style.overflow = isActive ? 'hidden' : '';
});

document.querySelectorAll('.menu-overlay a').forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// LIGHTBOX
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const lbCounter = document.getElementById('lbCounter');
const gmItems = Array.from(document.querySelectorAll('.gm-item'));
let currentIdx = 0;

function openLb(idx) {
  currentIdx = idx;
  lbImg.src = gmItems[idx].dataset.src;
  if (lbCounter) lbCounter.textContent = `${idx + 1} / ${gmItems.length}`;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => lbClose.focus());
}

function closeLb() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  if (gmItems[currentIdx]) gmItems[currentIdx].focus();
}

function showNext() { openLb((currentIdx + 1) % gmItems.length); }
function showPrev() { openLb((currentIdx - 1 + gmItems.length) % gmItems.length); }

gmItems.forEach((item, i) => {
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
  item.addEventListener('click', () => openLb(i));
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); }
  });
});

lbClose.addEventListener('click', closeLb);
lbNext.addEventListener('click', showNext);
lbPrev.addEventListener('click', showPrev);

lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
});

// Touch swipe for lightbox
let touchStartX = 0;
let touchStartY = 0;
lightbox.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    if (dx < 0) showNext(); else showPrev();
  }
  if (dy > 80 && Math.abs(dy) > Math.abs(dx)) closeLb();
}, { passive: true });

// COUNTER ANIMATION (fixed: matches HTML class)
// FORM VALIDATION
document.querySelectorAll('#f-nome, #f-email, #f-tel, #f-data, #f-ospiti, #f-privacy').forEach(inp => {
  const ev = inp.type === 'checkbox' ? 'change' : 'input';
  inp.addEventListener(ev, () => inp.closest('.form-group').classList.remove('has-error'));
});

function handleFormSubmit(form) {
  const card = form.closest('.contact-form-card');
  let valid = true;

  function setError(id, msg) {
    const inp = card.querySelector(id);
    if (!inp) return;
    inp.closest('.form-group').classList.add('has-error');
    const err = inp.closest('.form-group').querySelector('.form-error');
    if (err) err.textContent = msg;
    valid = false;
  }

  function clearError(id) {
    const inp = card.querySelector(id);
    if (!inp) return;
    inp.closest('.form-group').classList.remove('has-error');
  }

  const nome = card.querySelector('#f-nome').value.trim();
  if (!nome) setError('#f-nome', 'Campo obbligatorio');
  else clearError('#f-nome');

  const email = card.querySelector('#f-email').value.trim();
  if (!email) setError('#f-email', 'Campo obbligatorio');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setError('#f-email', 'Formato email non valido');
  else clearError('#f-email');

  const tel = card.querySelector('#f-tel').value.trim();
  if (!tel) setError('#f-tel', 'Campo obbligatorio');
  else if (!/^[+\d\s()-]{6,20}$/.test(tel)) setError('#f-tel', 'Numero non valido');
  else clearError('#f-tel');

  const dataInp = card.querySelector('#f-data');
  const dataVal = dataInp.value;
  if (!dataVal) setError('#f-data', 'Campo obbligatorio');
  else {
    const selected = new Date(dataVal + 'T12:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) setError('#f-data', 'La data non può essere nel passato');
    else clearError('#f-data');
  }

  const ospiti = card.querySelector('#f-ospiti').value.trim();
  if (!ospiti) setError('#f-ospiti', 'Campo obbligatorio');
  else if (parseInt(ospiti) < 1 || parseInt(ospiti) > 150) setError('#f-ospiti', 'Inserisci tra 1 e 150');
  else clearError('#f-ospiti');

  const privacy = card.querySelector('#f-privacy');
  if (!privacy.checked) setError('#f-privacy', 'Necessario per proseguire');
  else clearError('#f-privacy');

  if (!valid) return;

  sessionStorage.setItem('sasida_form', JSON.stringify({
    nome, email, tel, data: dataVal, ospiti
  }));
  window.location.href = 'grazie.html';
}

// BACK TO TOP
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// COOKIE CONSENT
const cookieBar = document.getElementById('cookieBar');
const cookieAccept = document.getElementById('cookieAccept');

if (cookieBar && cookieAccept) {
  if (!localStorage.getItem('sasida_cookies')) {
    requestAnimationFrame(() => {
      setTimeout(() => cookieBar.classList.add('visible'), 600);
    });
  }

  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('sasida_cookies', 'accepted');
    cookieBar.classList.remove('visible');
    setTimeout(() => cookieBar.remove(), 500);
  });
}

// PAGE TRANSITIONS
const pt = document.getElementById('pageTransition');

// On load: fade out
if (pt) {
  pt.classList.remove('active');
  sessionStorage.removeItem('sasida_transition');
}

document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (
    !href ||
    href.startsWith('http') ||
    href.startsWith('#') ||
    href.startsWith('tel:') ||
    href.startsWith('mailto:') ||
    href.startsWith('javascript:') ||
    link.hasAttribute('download') ||
    link.target === '_blank'
  ) return;

  link.addEventListener('click', e => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    if (!pt) { window.location.href = href; return; }
    pt.classList.add('active');
    setTimeout(() => { window.location.href = href; }, 500);
  });
});
