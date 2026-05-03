// SCRIPT X SA SIDA BY MOCKLY

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// Smooth scroll per anchor — gestito via JS (evita bug iOS con scroll-behavior CSS)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      const offset = nav.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Menu mobile
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

// Lightbox
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const pgItems = Array.from(document.querySelectorAll('.pg-item'));
let currentIdx = 0;

function openLb(idx) {
  currentIdx = idx;
  lbImg.src = pgItems[idx].dataset.src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  // Sposta il focus sul pulsante di chiusura per accessibilità
  requestAnimationFrame(() => lbClose.focus());
}
function closeLb() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  // Riporta il focus sull'item che ha aperto il lightbox
  pgItems[currentIdx].focus();
}
function showNext() { openLb((currentIdx + 1) % pgItems.length); }
function showPrev() { openLb((currentIdx - 1 + pgItems.length) % pgItems.length); }

pgItems.forEach((item, i) => {
  item.setAttribute('tabindex', '0');
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

// Swipe touch sul lightbox (mobile)
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
    if (dx < 0) showNext();
    else showPrev();
  }
  if (dy > 80 && Math.abs(dy) > Math.abs(dx)) {
    closeLb();
  }
}, { passive: true });

// Form — listener per rimozione errori all'input (inizializzato una volta sola)
document.querySelectorAll('#f-nome, #f-tel, #f-data, #f-ospiti').forEach(inp => {
  inp.addEventListener('input', () => inp.closest('.form-group').classList.remove('has-error'));
});

// Form submit
function handleFormSubmit(btn) {
  const card = btn.closest('.contact-form-card');
  const requiredInputs = [
    card.querySelector('#f-nome'),
    card.querySelector('#f-tel'),
    card.querySelector('#f-data'),
    card.querySelector('#f-ospiti')
  ];

  let valid = true;

  requiredInputs.forEach(inp => {
    const group = inp.closest('.form-group');
    if (!inp.value.trim()) {
      group.classList.add('has-error');
      const err = group.querySelector('.form-error');
      if (err) err.textContent = 'Campo obbligatorio';
      valid = false;
    } else {
      group.classList.remove('has-error');
    }
  });

  // Validazione data: non può essere nel passato
  const dataInp = card.querySelector('#f-data');
  if (dataInp && dataInp.value) {
    const selected = new Date(dataInp.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      const group = dataInp.closest('.form-group');
      group.classList.add('has-error');
      const err = group.querySelector('.form-error');
      if (err) err.textContent = 'La data non può essere nel passato';
      valid = false;
    }
  }

  if (!valid) return;

  // Salva i dati per la pagina di conferma
  sessionStorage.setItem('sasida_form', JSON.stringify({
    nome:   card.querySelector('#f-nome').value.trim(),
    tel:    card.querySelector('#f-tel').value.trim(),
    data:   card.querySelector('#f-data').value,
    ospiti: card.querySelector('#f-ospiti').value.trim()
  }));

  // Reindirizza alla pagina di conferma
  window.location.href = 'grazie.html';
}

// ── STAGGER sui service card ──
document.querySelectorAll('.service-item[data-delay]').forEach(card => {
  const delay = parseInt(card.dataset.delay) || 0;
  card.style.transitionDelay = delay + 'ms';
});

// ── BACK TO TOP ──
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 600);
}, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── NAV ACTIVE SECTION ──
const navSections = ['storia', 'servizi', 'galleria', 'contatti'];
const navLinks = document.querySelectorAll('.nav-links a[data-section]');

function updateActiveNav() {
  const scrollMid = window.scrollY + window.innerHeight * 0.4;
  let current = '';
  navSections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollMid) current = id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.dataset.section === current);
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// ── SECTION ARRIVAL FLASH ──
document.querySelectorAll('.nav-links a[data-section], .menu-overlay a').forEach(a => {
  a.addEventListener('click', () => {
    const targetId = a.getAttribute('href').replace('#', '');
    const target = document.getElementById(targetId);
    if (!target) return;
    // aspetta la fine dello scroll prima di applicare il flash
    let scrollTimer;
    const onScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        window.removeEventListener('scroll', onScroll);
        target.classList.remove('section-flash');
        void target.offsetWidth; // reflow
        target.classList.add('section-flash');
        target.addEventListener('animationend', () => {
          target.classList.remove('section-flash');
        }, { once: true });
      }, 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  });
});