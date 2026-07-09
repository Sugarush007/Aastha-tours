document.addEventListener('DOMContentLoaded', () => {
  // --- MOBILE NAVIGATION BAR TOGGLE ---
  const menuBtn = document.getElementById('menu-toggle');
  const nav = document.querySelector('.nav');
  menuBtn?.addEventListener('click', () => {
    const isOpen = nav?.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(!!isOpen));
  });

  // --- HERO SECTION VIDEO CONTROLLER ---
  const vidBtns = document.querySelectorAll('.vid-btn');
  const heroVideo = document.getElementById('hero-video');
  vidBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.querySelector('.vid-btn.active');
      current?.classList.remove('active');
      current?.setAttribute('aria-pressed', 'false');
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      const src = btn.dataset.src;
      if (src && heroVideo) heroVideo.src = src;
    });
  });

  // --- SWIPER SLIDERS INITIALIZATION ---
  if (typeof Swiper !== 'undefined') {
    // Client Testimonials Slider
    new Swiper('.review-slider', {
      loop: true,
      spaceBetween: 20,
      pagination: { el: '.review-slider .swiper-pagination', clickable: true },
      autoplay: { delay: 3500, disableOnInteraction: false },
      slidesPerView: 1,
      breakpoints: { 700: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });

    // Dynamic Multi-Category Gallery Sliders
    document.querySelectorAll('.gallery-slider').forEach(sliderContainer => {
      new Swiper(sliderContainer, {
        loop: true,
        spaceBetween: 16,
        pagination: { el: sliderContainer.querySelector('.swiper-pagination'), clickable: true },
        autoplay: { delay: 4000, disableOnInteraction: false },
        slidesPerView: 1,
        breakpoints: {
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 }
        }
      });
    });
  } else {
    console.warn('Swiper failed to load — fallback structural layouts applied.');
  }

  // --- INTERNAL SMOOTH SCROLL ROUTER (accounts for fixed header height) ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      const target = href && href.length > 1 ? document.querySelector(href) : null;
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        nav?.classList.remove('open');
        menuBtn?.setAttribute('aria-expanded', 'false');
        history.pushState(null, '', href);
      }
    });
  });

  // --- ACTIVE NAV LINK HIGHLIGHT ON SCROLL ---
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav a');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.toggle('active-link', link.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }

  // --- BOOKING MODAL ---
  const modal = document.getElementById('booking-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const subjectInput = document.getElementById('modal-subject');
  const openButtons = document.querySelectorAll('.open-booking-btn');
  let lastFocusedEl = null;

  const openModal = (packageName, triggerEl) => {
    lastFocusedEl = triggerEl || document.activeElement;
    if (subjectInput && packageName) {
      subjectInput.value = `Booking Inquiry: ${packageName}`;
    }
    modal?.classList.add('active');
    modal?.setAttribute('aria-hidden', 'false');
    modal?.querySelector('input, textarea, button')?.focus();
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal?.classList.remove('active');
    modal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    const modalStatusEl = document.getElementById('modal-contact-status');
    if (modalStatusEl) modalStatusEl.textContent = '';
    lastFocusedEl?.focus();
  };

  openButtons.forEach(button => {
    button.addEventListener('click', () => {
      openModal(button.getAttribute('data-package'), button);
    });
  });

  closeModalBtn?.addEventListener('click', closeModal);

  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal?.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = modal.querySelectorAll('input, textarea, button');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // --- FORMSPREE ASYNCHRONOUS FORM SUBMISSION ---
  async function submitForm(form, statusEl) {
    const data = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    statusEl.textContent = 'Sending…';
    statusEl.style.color = '';
    if (submitBtn) submitBtn.disabled = true;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });
      if (res.ok) {
        statusEl.textContent = 'Message sent successfully! We\u2019ll be in touch shortly.';
        statusEl.style.color = '#16a34a';
        form.reset();
        if (form.id === 'modal-contact-form') setTimeout(closeModal, 2000);
      } else {
        statusEl.textContent = 'Something went wrong. Please try again or call us directly.';
        statusEl.style.color = '#dc2626';
      }
    } catch {
      statusEl.textContent = 'Network error. Please check your connection and try again.';
      statusEl.style.color = '#dc2626';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  const pageContactForm = document.getElementById('contact-form');
  const pageStatusEl = document.getElementById('contact-status');
  if (pageContactForm && pageStatusEl) {
    pageContactForm.addEventListener('submit', e => {
      e.preventDefault();
      submitForm(pageContactForm, pageStatusEl);
    });
  }

  const modalContactForm = document.getElementById('modal-contact-form');
  const modalStatusEl = document.getElementById('modal-contact-status');
  if (modalContactForm && modalStatusEl) {
    modalContactForm.addEventListener('submit', e => {
      e.preventDefault();
      submitForm(modalContactForm, modalStatusEl);
    });
  }

  // --- BACK TO TOP BUTTON ---
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      backToTopBtn.hidden = window.scrollY < 500;
    }, { passive: true });
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- SCROLL-REVEAL FOR .reveal ELEMENTS ---
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // --- HEADER CONDENSES ON SCROLL ---
  const header = document.querySelector('.site-header');
  if (header) {
    const toggleHeader = () => header.classList.toggle('scrolled', window.scrollY > 40);
    toggleHeader();
    window.addEventListener('scroll', toggleHeader, { passive: true });
  }

  // --- ANIMATED COUNT-UP FOR TRUST STRIP NUMBERS ---
  const countEls = document.querySelectorAll('.num[data-target]');
  if (countEls.length && 'IntersectionObserver' in window) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimal || '0', 10);
        const suffix = el.dataset.suffix || '';
        if (prefersReducedMotion) {
          el.textContent = target.toFixed(decimals) + suffix;
        } else {
          const duration = 1200;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = (target * eased).toFixed(decimals) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
        obs.unobserve(el);
      });
    }, { threshold: 0.6 });
    countEls.forEach(el => countObserver.observe(el));
  }

  // --- GALLERY LIGHTBOX OVERLAY ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let galleryItems = [];
  let currentPhotoIndex = -1;
  let lastGalleryFocusEl = null;

  // Re-index current active slider track elements on open context requests
  const updateGalleryItemsList = () => {
    galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  };

  const showPhoto = (index) => {
    if (!galleryItems.length) return;
    currentPhotoIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentPhotoIndex];
    const img = item.querySelector('img');
    lightboxImg.src = item.dataset.src || img.src;
    lightboxImg.alt = img.alt || '';
    lightboxCaption.textContent = img.alt || '';
  };

  const openLightbox = (index, triggerEl) => {
    updateGalleryItemsList();
    lastGalleryFocusEl = triggerEl || document.activeElement;
    showPhoto(index);
    lightbox?.classList.add('active');
    lightbox?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose?.focus();
  };

  const closeLightbox = () => {
    lightbox?.classList.remove('active');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastGalleryFocusEl?.focus();
  };

  // Event Delegation fallback route handling for dynamic swiper instances
  document.getElementById('gallery')?.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    updateGalleryItemsList();
    const targetIdx = galleryItems.indexOf(item);
    if (targetIdx !== -1) openLightbox(targetIdx, item);
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => showPhoto(currentPhotoIndex - 1));
  lightboxNext?.addEventListener('click', () => showPhoto(currentPhotoIndex + 1));

  window.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showPhoto(currentPhotoIndex + 1);
    if (e.key === 'ArrowLeft') showPhoto(currentPhotoIndex - 1);
    if (e.key === 'Tab') {
      const focusable = [lightboxClose, lightboxPrev, lightboxNext].filter(Boolean);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // --- DYNAMIC COPYRIGHT YEAR ---
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});