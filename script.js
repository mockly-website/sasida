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
}
function closeLb() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}
function showNext() { openLb((currentIdx + 1) % pgItems.length); }
function showPrev() { openLb((currentIdx - 1 + pgItems.length) % pgItems.length); }

pgItems.forEach((item, i) => item.addEventListener('click', () => openLb(i)));
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

// Form submit
function handleFormSubmit(btn) {
  const card = btn.closest('.contact-form-card');
  const inputs = card.querySelectorAll('.form-input');
  let valid = true;
  inputs.forEach(inp => {
    if (inp.hasAttribute('placeholder') && inp.value.trim() === '' && inp !== card.querySelector('.form-textarea')) {
      inp.style.borderColor = 'rgba(196,100,100,0.5)';
      valid = false;
    } else {
      inp.style.borderColor = '';
    }
  });
  if (!valid) return;
  btn.textContent = '✓ Richiesta inviata!';
  btn.style.background = 'var(--olive-dark)';
  btn.disabled = true;
}

// Protezione contenuti
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (
    (e.ctrlKey || e.metaKey) && ['s', 'u', 'p', 'c', 'a'].includes(e.key.toLowerCase())
  ) e.preventDefault();
});