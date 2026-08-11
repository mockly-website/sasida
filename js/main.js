/* ============================================================
   Sa Sida Country — main.js
   Navigazione, reveal on scroll, lightbox, form, mappa lazy
   ============================================================ */

/* ------------------------------------------------------------
   DATI DA CONFERMARE COL CLIENTE
   - WA_NUMBER: numero WhatsApp reale, formato internazionale senza "+"
     (es. "393331112222"). Sostituire anche nei link wa.me in index.html
     e nel numero tel:+39 in tutte le occorrenze.
   - EVENTUALMENTE: endpoint Formspree/EmailJS per l'invio diretto
     (vedi funzione inviaForm) in alternativa al metodo WhatsApp/mailto.
   ------------------------------------------------------------ */
var WA_NUMBER = '390000000000';
var EMAIL = 'info@sasidacountry.it';

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Header: stato scrolled ---------------- */
  var header = document.getElementById('site-header');
  var hero = document.querySelector('.hero');

  function onScrollHeader() {
    var scrolled = window.scrollY > 40;
    header.classList.toggle('is-scrolled', scrolled);
    if (hero) hero.classList.toggle('is-scrolled', window.scrollY > 90);
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------- Scrollspy: voce di menu attiva ---------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-list .nav-link'));
  if (navLinks.length && 'IntersectionObserver' in window) {
    var spyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    navLinks.forEach(function (link) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target && target.id) spyIO.observe(target);
    });
  }

  /* ---------------- Hero: slideshow Ken Burns + parallax (desktop) ---------------- */
  var heroSlides = Array.prototype.slice.call(document.querySelectorAll('.hero__slide'));
  var slidesNav = document.getElementById('hero-slides-nav');
  var heroSlidesWrap = document.querySelector('.hero__slides');
  var isTouch = window.matchMedia('(hover: none)').matches;
  var ticking = false;
  var currentSlide = 0;
  var SLIDE_MS = 6000;

  function buildSlidesNav() {
    if (!slidesNav || !heroSlides.length) return;
    heroSlides.forEach(function (_, i) {
      var dot = document.createElement('span');
      if (i === 0) dot.classList.add('is-active');
      slidesNav.appendChild(dot);
    });
  }
  buildSlidesNav();

  function goToSlide(i) {
    if (!heroSlides.length) return;
    heroSlides[currentSlide].classList.remove('is-active');
    currentSlide = (i + heroSlides.length) % heroSlides.length;
    heroSlides[currentSlide].classList.add('is-active');
    if (slidesNav) {
      Array.prototype.forEach.call(slidesNav.children, function (dot, j) {
        dot.classList.toggle('is-active', j === currentSlide);
      });
    }
  }

  function startSlideshow() {
    if (reduceMotion || !heroSlides.length) return;
    setInterval(function () { goToSlide(currentSlide + 1); }, SLIDE_MS);
  }
  startSlideshow();

  /* ---------------- Parola rotante nel titolo hero ---------------- */
  var rotatorWords = Array.prototype.slice.call(document.querySelectorAll('#hero-rotator .rotator__word'));
  var rotIndex = 0;
  function rotateWord() {
    if (reduceMotion || rotatorWords.length < 2) return;
    rotatorWords[rotIndex].classList.remove('is-on');
    rotIndex = (rotIndex + 1) % rotatorWords.length;
    rotatorWords[rotIndex].classList.add('is-on');
  }
  setInterval(rotateWord, 3200);

  /* ---------------- Marquee: contenuto duplicato per loop seamless ---------------- */
  var marqueeTrack = document.getElementById('marquee-track');
  if (marqueeTrack && !reduceMotion) {
    marqueeTrack.innerHTML += marqueeTrack.innerHTML;
  }

  function onParallax() {
    if (reduceMotion || isTouch || !heroSlidesWrap || window.innerWidth < 900) return;
    if (!ticking) {
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.4) {
          heroSlidesWrap.style.transform = 'translateY(' + y * 0.3 + 'px)';
        }
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onParallax, { passive: true });

  /* ---------------- Menu mobile ---------------- */
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');

  function closeNav() {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  navToggle.addEventListener('click', function () {
    var open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);
  });

  mainNav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* Chiudi il menu toccando l'overlay scuro sotto di esso */
  document.body.addEventListener('click', function (e) {
    if (e.target === document.body && mainNav.classList.contains('open')) closeNav();
  });

  /* ---------------- Testimonianze: frecce (solo mobile) ---------------- */
  var tGrid = document.getElementById('testimonials-grid');
  var tPrev = document.getElementById('testimonials-prev');
  var tNext = document.getElementById('testimonials-next');

  function tStep() {
    var card = tGrid.querySelector('.testimonial');
    var gap = parseFloat(getComputedStyle(tGrid).columnGap || '0') || 16;
    return (card ? card.offsetWidth : 300) + gap;
  }

  if (tGrid && tPrev && tNext) {
    tPrev.addEventListener('click', function () {
      tGrid.scrollBy({ left: -tStep(), behavior: 'smooth' });
    });
    tNext.addEventListener('click', function () {
      tGrid.scrollBy({ left: tStep(), behavior: 'smooth' });
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  var revealEls = document.querySelectorAll('.reveal');

  /* Stagger: nelle griglie le card entrano in sequenza */
  document.querySelectorAll('.spazi__grid, .territorio__grid, .numeri__grid, .steps, .gallery-grid')
    .forEach(function (grid) {
      Array.prototype.forEach.call(grid.querySelectorAll('.reveal'), function (el, i) {
        el.style.transitionDelay = Math.min(i, 7) * 80 + 'ms';
      });
    });

  /* ---------------- Galleria: 6 scatti + "Altri scatti" ---------------- */
  var galleryGrid = document.getElementById('gallery-grid');
  var galleryMore = document.getElementById('gallery-more');
  if (galleryGrid && galleryMore) {
    var totalShots = galleryGrid.querySelectorAll('.gallery-item').length;
    if (totalShots > 6) {
      galleryGrid.classList.add('is-collapsed');
      galleryMore.addEventListener('click', function () {
        var collapsed = galleryGrid.classList.toggle('is-collapsed');
        galleryMore.textContent = collapsed ? 'Altri scatti' : 'Mostra meno';
        galleryMore.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14m-6-6 6 6 6-6"/></svg>');
      });
    }
  }

  /* Linea dei passi: si disegna quando la sezione entra in vista */
  var stepsSection = document.querySelector('.steps');
  if (stepsSection && 'IntersectionObserver' in window) {
    var stepsIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          stepsSection.classList.add('is-in');
          stepsIO.disconnect();
        }
      });
    }, { threshold: 0.3 });
    stepsIO.observe(stepsSection);
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Lightbox ---------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var lightboxCounter = document.getElementById('lightbox-counter');
  var items = Array.prototype.slice.call(
    document.querySelectorAll('.gallery-item[data-gallery-full]')
  );
  var current = 0;
  var closeTimer = null;

  function render(src, alt, caption, counterText) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightboxCaption.textContent = caption || '';
    if (lightboxCounter) lightboxCounter.textContent = counterText || '';
  }

  function showAt(index) {
    if (!items.length) return;
    current = (index + items.length) % items.length;
    var item = items[current];
    render(
      item.getAttribute('data-gallery-full'),
      item.querySelector('img').alt,
      item.getAttribute('data-gallery-caption'),
      (current + 1) + ' / ' + items.length
    );
  }

  function openStandalone(card) {
    clearTimeout(closeTimer);
    render(
      card.getAttribute('data-gallery-full'),
      card.querySelector('img').alt,
      card.querySelector('.space-card__caption h3').textContent,
      ''
    );
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    requestAnimationFrame(function () { lightbox.classList.add('lightbox--open'); });
  }

  function openLightbox(index) {
    clearTimeout(closeTimer);
    showAt(index);
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    requestAnimationFrame(function () { lightbox.classList.add('lightbox--open'); });
  }

  function closeLightbox() {
    clearTimeout(closeTimer);
    lightbox.classList.remove('lightbox--open');
    document.body.classList.remove('lightbox-open');
    closeTimer = setTimeout(function () {
      lightbox.hidden = true;
      lightboxImg.src = '';
    }, reduceMotion ? 0 : 350);
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function () { openLightbox(i); });
  });

  /* Le card "Gli Spazi" aprono la lightbox: sulle foto proprie
     (data-gallery-full) o sulla foto corrispondente della galleria (data-gallery) */
  document.querySelectorAll('.space-card').forEach(function (card) {
    card.addEventListener('click', function () {
      if (card.hasAttribute('data-gallery-full')) {
        openStandalone(card);
        return;
      }
      var id = card.getAttribute('data-gallery');
      var target = document.getElementById(id);
      if (target) openLightbox(items.indexOf(target));
    });
  });

  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', function () { showAt(current - 1); });
  document.getElementById('lightbox-next').addEventListener('click', function () { showAt(current + 1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showAt(current - 1);
    if (e.key === 'ArrowRight') showAt(current + 1);
  });

  /* Swipe su touch */
  var touchX = null;
  lightbox.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 48) showAt(current + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });

  /* ---------------- Back to top ---------------- */
  var backTop = document.getElementById('back-top');

  function onBackTop() {
    backTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.9);
  }
  window.addEventListener('scroll', onBackTop, { passive: true });
  onBackTop();

  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------------- Count-up dei numeri ---------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion || isNaN(target)) {
      el.textContent = (isNaN(target) ? '' : target) + suffix;
      return;
    }
    var start = null;
    var duration = 1900;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        el.classList.add('is-done');
      }
    }
    requestAnimationFrame(step);
  }

  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  if (counters.length && 'IntersectionObserver' in window) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { countIO.observe(el); });
  }

  /* ---------------- Mappa lazy ---------------- */
  var mapFrame = document.querySelector('.map-wrap iframe');
  if (mapFrame && 'IntersectionObserver' in window) {
    var mapIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !mapFrame.src) {
          mapFrame.src = mapFrame.getAttribute('data-src');
          mapIO.disconnect();
        }
      });
    }, { rootMargin: '400px' });
    mapIO.observe(mapFrame);
  }

  /* ---------------- Form contatti ---------------- */
  /* Invio: compone un messaggio WhatsApp + link mailto come alternativa.
     Per l'invio diretto senza backend, collegare qui un endpoint
     Formspree (https://formspree.io/f/...) o EmailJS. */
  var form = document.getElementById('contact-form');

  function composeMessage(data) {
    var lines = [
      'Richiesta informazioni — Sa Sida Country',
      '',
      'Nome: ' + data.nome,
      'Telefono: ' + data.telefono,
      'Email: ' + data.email
    ];
    if (data.data) lines.push('Data evento: ' + data.data);
    if (data.invitati) lines.push('Invitati: ' + data.invitati);
    if (data.tipo) lines.push('Tipo di evento: ' + data.tipo);
    if (data.messaggio) lines.push('Messaggio: ' + data.messaggio);
    return lines.join('\n');
  }

  function submitToWhatsApp(message) {
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(message), '_blank', 'noopener');
  }

  function submitToEmail(message) {
    var subject = 'Richiesta informazioni — Sa Sida Country';
    window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(message);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    /* Anti-spam: campo nascosto compilato solo dai bot */
    if (form.website && form.website.value) {
      form.reset();
      return;
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var data = {
      nome: form.nome.value.trim(),
      telefono: form.telefono.value.trim(),
      email: form.email.value.trim(),
      data: form.data.value,
      invitati: form.invitati.value,
      tipo: form.tipo.value,
      messaggio: form.messaggio.value.trim()
    };
    var message = composeMessage(data);
    if (WA_NUMBER.replace(/\D/g, '').length !== 12) {
      /* Numero WhatsApp non ancora configurato: ripiega sulla mail */
      submitToEmail(message);
      return;
    }
    submitToWhatsApp(message);
    form.reset();
  });

  /* ---------------- Anno nel footer ---------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
