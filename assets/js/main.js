document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header state on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Hero: scroll parallax + subtle mouse-move shift ---------- */
  const heroSection = document.getElementById('top');
  const heroImg = document.getElementById('heroImg');
  if (heroSection && heroImg) {
    let scrollOffset = 0;
    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;
    const maxMouseShift = 18; // px

    const updateScrollOffset = () => {
      const rect = heroSection.getBoundingClientRect();
      scrollOffset = Math.max(0, -rect.top) * 0.18;
    };
    window.addEventListener('scroll', updateScrollOffset, { passive: true });
    updateScrollOffset();

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = relX * maxMouseShift * 2;
      mouseY = relY * maxMouseShift;
    });
    heroSection.addEventListener('mouseleave', () => {
      mouseX = 0; mouseY = 0;
    });

    const animateHero = () => {
      curX += (mouseX - curX) * 0.06;
      curY += (mouseY - curY) * 0.06;
      const translateY = scrollOffset + curY;
      heroImg.style.transform = `translate3d(${curX}px, ${translateY}px, 0) scale(1.15)`;
      requestAnimationFrame(animateHero);
    };
    requestAnimationFrame(animateHero);
  }

  /* ---------- Shared cursor-following preview (Projects + Services) ---------- */
  const previewEl = document.getElementById('cursorPreview');
  const previewImg = document.getElementById('cursorPreviewImg');
  const rows = document.querySelectorAll('.preview-row');
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  let rafId = null;

  const animatePreview = () => {
    currentX += (targetX - currentX) * 0.15;
    currentY += (targetY - currentY) * 0.15;
    previewEl.style.left = currentX + 'px';
    previewEl.style.top = currentY + 'px';
    rafId = requestAnimationFrame(animatePreview);
  };

  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const img = row.getAttribute('data-img');
      if (img) previewImg.src = img;
      previewEl.classList.add('active');
      if (!rafId) rafId = requestAnimationFrame(animatePreview);
    });
    row.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });
    row.addEventListener('mouseleave', () => {
      previewEl.classList.remove('active');
    });
  });

  /* ---------- Stat count-up ---------- */
  const statEls = document.querySelectorAll('.stat-num[data-count]');
  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const pad = el.getAttribute('data-format') === 'pad';
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = pad ? String(value).padStart(2, '0') : String(value);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const statIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        statIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  statEls.forEach(el => statIo.observe(el));

  /* ---------- Contact form (front-end only) ---------- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      note.textContent = 'Thank you — we will be in touch shortly.';
      form.reset();
    });
  }

});