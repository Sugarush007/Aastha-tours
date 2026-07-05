document.addEventListener('DOMContentLoaded', () => {
  // --- MOBILE NAVIGATION BAR TOGGLE ---
  const menuBtn = document.getElementById('menu-toggle');
  const nav = document.querySelector('.nav');
  menuBtn?.addEventListener('click', () => nav?.classList.toggle('open'));

  // --- HERO SECTION VIDEO CONTROLLER ---
  const vidBtns = document.querySelectorAll('.vid-btn');
  const heroVideo = document.getElementById('hero-video');
  vidBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.vid-btn.active')?.classList.remove('active');
      btn.classList.add('active');
      const src = btn.dataset.src;
      if (src && heroVideo) heroVideo.src = src;
    });
  });

  // --- CLIENT TESTIMONIALS SLIDER (SWIPER) ---
  new Swiper('.review-slider', {
    loop: true,
    spaceBetween: 20,
    pagination: { el: '.swiper-pagination', clickable: true },
    autoplay: { delay: 3500, disableOnInteraction: false },
    slidesPerView: 1,
    breakpoints: { 700: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
  });

  // --- INTERNAL SMOOTH SCROLL ROUTER ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        nav?.classList.remove('open');
      }
    });
  });

  // --- POP-UP MODAL EVENT HANDLERS ---
  const modal = document.getElementById('booking-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const subjectInput = document.getElementById('modal-subject');
  const openButtons = document.querySelectorAll('.open-booking-btn');

  // Open modal and auto-set subject line based on chosen package card
  openButtons.forEach(button => {
    button.addEventListener('click', () => {
      const packageName = button.getAttribute('data-package');
      if (subjectInput && packageName) {
        subjectInput.value = `Booking Inquiry: ${packageName}`;
      }
      modal?.classList.add('active');
      modal?.setAttribute('aria-hidden', 'false');
    });
  });

  // Close modal function
  const closeModal = () => {
    modal?.classList.remove('active');
    modal?.setAttribute('aria-hidden', 'true');
    const statusEl = document.getElementById('contact-status');
    if (statusEl) statusEl.textContent = ''; // Reset form message status text
  };

  closeModalBtn?.addEventListener('click', closeModal);

  // Close modal if user clicks outside of the white pop-up content box
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // --- FORMSPREE ASYNCHRONOUS FORM SUBMISSION ---
  const contactForm = document.getElementById('contact-form');
  const statusEl = document.getElementById('contact-status');
  
  async function submitForm(form, statusEl) {
    const data = new FormData(form);
    statusEl.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, { 
        method: 'POST', 
        headers: { 'Accept': 'application/json' }, 
        body: data 
      });
      if (res.ok) {
        statusEl.textContent = 'Message sent successfully!';
        statusEl.style.color = 'lightgreen';
        form.reset();
        // Optional: Closes the modal shortly after a successful submission
        setTimeout(closeModal, 2000);
      } else {
        statusEl.textContent = 'Something went wrong. Please try again.';
        statusEl.style.color = 'crimson';
      }
    } catch {
      statusEl.textContent = 'Network error.';
      statusEl.style.color = 'crimson';
    }
  }

  if (contactForm && statusEl) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      submitForm(contactForm, statusEl);
    });
  }
});
