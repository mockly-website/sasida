// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

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

// Smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

const toggle = document.getElementById('menuToggle');
const overlay = document.getElementById('menuOverlay');

toggle.addEventListener('click', () => {
  toggle.classList.toggle('active');
  overlay.classList.toggle('active');
});

/* chiudi menu quando clicchi link */
document.querySelectorAll('.menu-overlay a').forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('active');
    overlay.classList.remove('active');
  });
});