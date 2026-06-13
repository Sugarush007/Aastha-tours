document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-toggle');
  const nav = document.querySelector('.nav');
  menuBtn?.addEventListener('click', () => nav?.classList.toggle('open'));

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

  new Swiper('.review-slider', {
    loop: true,
    spaceBetween: 20,
    pagination: { el: '.swiper-pagination', clickable: true },
    autoplay: { delay: 3500, disableOnInteraction: false },
    slidesPerView: 1,
    breakpoints: { 700: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
  });

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

  const contactForm = document.getElementById('contact-form');
  const statusEl = document.getElementById('contact-status');
  async function submitForm(form, statusEl) {
    const data = new FormData(form);
    statusEl.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: data });
      if (res.ok) {
        statusEl.textContent = 'Message sent successfully!';
        statusEl.style.color = 'lightgreen';
        form.reset();
      } else {
        statusEl.textContent = 'Something went wrong. Please try again.';
        statusEl.style.color = 'crimson';
      }
    } catch {
      statusEl.textContent = 'Network error.';
      statusEl.style.color = 'crimson';
    }
  }
  if (contactForm && statusEl) contactForm.addEventListener('submit', e => {
    e.preventDefault();
    submitForm(contactForm, statusEl);
  });
});
