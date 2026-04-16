/* ============================================================
   MANIKANDAN M — PORTFOLIO JAVASCRIPT
   Typing animation · Scroll reveal · Smooth nav · Form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── PROGRESS BAR ───────────────────────────────────── */
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${(window.scrollY / max) * 100}%`;
  }, { passive: true });

  /* ─── NAVBAR SCROLL EFFECT ───────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  /* ─── HAMBURGER MENU ─────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ─── ACTIVE NAV LINK ────────────────────────────────── */
  const sections     = document.querySelectorAll('section[id]');
  const navAnchors   = document.querySelectorAll('.nav-links a[href^="#"]');
  const observerNav  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observerNav.observe(s));

  /* ─── TYPING ANIMATION ───────────────────────────────── */
  const roles = [
    'Java Full-Stack Dev',
    'Spring Boot Engineer',
    'React Developer',
    'Web App Builder',
    'Problem Solver'
  ];
  const typingEl = document.getElementById('typing-text');
  let roleIdx = 0, charIdx = 0, isDeleting = false;

  function typeLoop() {
    const current = roles[roleIdx];
    if (!isDeleting) {
      typingEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
    } else {
      typingEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, isDeleting ? 55 : 90);
  }
  typeLoop();

  /* ─── COUNTER ANIMATION ──────────────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start    = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

  /* ─── SCROLL REVEAL ──────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ─── PROJECT FILTERING ──────────────────────────────── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.opacity = match ? '1' : '0.25';
        card.style.transform = match ? '' : 'scale(0.96)';
        card.style.pointerEvents = match ? '' : 'none';
      });
    });
  });

  /* ─── CONTACT FORM ───────────────────────────────────── */
  const form = document.getElementById('contact-form');
  const msg  = document.getElementById('form-message');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name    = data.get('name').trim();
    const email   = data.get('email').trim();
    const subject = data.get('subject').trim();
    const message = data.get('message').trim();

    if (!name || !email || !message) {
      msg.textContent = '⚠ Please fill in all required fields.';
      msg.className = 'form-message error';
      return;
    }
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(email)) {
      msg.textContent = '⚠ Please enter a valid email address.';
      msg.className = 'form-message error';
      return;
    }

    const mailtoLink = `mailto:maniff322@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Contact: ' + name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailtoLink;

    msg.textContent = '✓ Email client opened! Message ready to send.';
    msg.className = 'form-message success';
    form.reset();
    setTimeout(() => { msg.textContent = ''; msg.className = 'form-message'; }, 5000);
  });

  /* ─── SMOOTH SCROLL for buttons ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 72;
        const pos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });

});
