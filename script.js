/* ═══════════════════════════════════════════════════════════
   MOHD WALID ANSARI — Portfolio JavaScript
   Handles: Scroll animations, navigation, skill bars,
   stat counters, lightbox, contact form, parallax effects
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ── 1. NAVBAR — Scroll & Active State ───────────────── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.section');
  const navHamburger = document.getElementById('navHamburger');
  const navLinksContainer = document.getElementById('navLinks');

  // Scroll → sticky navbar
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Active section detection
  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // Hamburger menu toggle
  if (navHamburger) {
    navHamburger.addEventListener('click', () => {
      navHamburger.classList.toggle('open');
      navLinksContainer.classList.toggle('open');
    });
  }

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navHamburger.classList.remove('open');
      navLinksContainer.classList.remove('open');
    });
  });

  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    updateActiveNav();
  }, { passive: true });

  handleNavbarScroll();
  updateActiveNav();

  /* ── 2. INTERSECTION OBSERVER — Reveal Animations ──── */
  const revealSelectors = [
    '.reveal',
    '.reveal-left',
    '.reveal-right',
    '.reveal-scale',
    '.reveal-zoom',
    '.reveal-flip',
    '.reveal-drop',
    '.reveal-rise'
  ];

  const revealElements = document.querySelectorAll(revealSelectors.join(','));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Don't unobserve so re-entry works, but we can unobserve for performance
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ── 3. SKILL BARS — Animate on Scroll ─────────────── */
  const skillItems = document.querySelectorAll('.skill-item');
  let skillsAnimated = false;

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        animateSkillBars();
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  function animateSkillBars() {
    skillItems.forEach((item, index) => {
      const percent = parseInt(item.getAttribute('data-percent'), 10);
      const fill = item.querySelector('.skill-bar-fill');
      const percentText = item.querySelector('.skill-percent');

      setTimeout(() => {
        // Animate bar
        fill.style.width = percent + '%';

        // Animate counter
        animateCounter(percentText, 0, percent, 1200);
      }, index * 100);
    });
  }

  function animateCounter(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + range * eased);

      element.textContent = current + '%';

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /* ── 4. STAT COUNTERS — Achievements Section ───────── */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach((num, index) => {
          const target = parseInt(num.getAttribute('data-target'), 10);
          setTimeout(() => {
            animateStatCounter(num, 0, target, 1500);
          }, index * 200);
        });
      }
    });
  }, { threshold: 0.3 });

  const achievementsSection = document.getElementById('achievements');
  if (achievementsSection) {
    statsObserver.observe(achievementsSection);
  }

  function animateStatCounter(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(start + range * eased);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /* ── 5. LIGHTBOX — Image Zoom ──────────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const lightboxTriggers = document.querySelectorAll('[data-lightbox]');

  lightboxTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-lightbox');
      if (lightboxImg && lightbox) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // ESC key closes lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ── 6. CONTACT FORM — EmailJS handler ─────────────── */
  /*
    HOW TO ACTIVATE THE CONTACT FORM:
    1. Sign up free at https://www.emailjs.com
    2. Create an Email Service (Gmail recommended) → copy "Service ID"
    3. Create an Email Template with variables:
         {{from_name}}, {{from_email}}, {{subject}}, {{message}}
       → copy "Template ID"
    4. Go to Account → copy your "Public Key"
    5. Replace the three placeholder strings below with your real IDs.
    Until you do, the form falls back to opening your mail client (mailto).
  */
  const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_abc123'
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xyz789'
  const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'abcDEFghiJKL'

  // Init EmailJS only when real keys are provided
  const emailjsReady = (
    EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
    typeof emailjs !== 'undefined'
  );

  if (emailjsReady) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const contactForm = document.getElementById('contactForm');
  const btnSendEl   = document.getElementById('btnSend');

  function setFormStatus(msg, type) {
    let statusEl = document.getElementById('formStatus');
    if (!statusEl) {
      statusEl = document.createElement('p');
      statusEl.id = 'formStatus';
      statusEl.style.cssText = 'margin-top:12px;font-size:0.9rem;font-weight:600;';
      contactForm.appendChild(statusEl);
    }
    statusEl.textContent = msg;
    statusEl.style.color = type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#D97706';
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name    = document.getElementById('formName').value.trim();
      const email   = document.getElementById('formEmail').value.trim();
      const subject = document.getElementById('formSubject').value.trim();
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !email || !subject || !message) {
        setFormStatus('Please fill in all fields.', 'error');
        return;
      }

      // EmailJS path
      if (emailjsReady) {
        if (btnSendEl) { btnSendEl.disabled = true; btnSendEl.textContent = 'Sending…'; }
        setFormStatus('Sending your message…', 'info');

        try {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            from_name:  name,
            from_email: email,
            subject:    subject,
            message:    message,
          });
          setFormStatus('Message sent! I will get back to you soon.', 'success');
          contactForm.reset();
        } catch (err) {
          console.error('EmailJS error:', err);
          setFormStatus('Something went wrong. Please try again or email directly.', 'error');
        } finally {
          if (btnSendEl) { btnSendEl.disabled = false; btnSendEl.textContent = 'Send Message'; }
        }
        return;
      }

      // Fallback: mailto (works without EmailJS setup)
      const mailtoLink = `mailto:mohdwalid.data.analyst@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      )}`;
      window.location.href = mailtoLink;
    });
  }

  /* ── 7. SEND BUTTON — Pulse Animation on Load ─────── */
  const sendBtnObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const btnSend = document.getElementById('btnSend');
        if (btnSend) {
          setTimeout(() => {
            btnSend.classList.add('pulse');
            setTimeout(() => btnSend.classList.remove('pulse'), 1200);
          }, 800);
        }
        sendBtnObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const contactSection = document.getElementById('contact');
  if (contactSection) {
    sendBtnObserver.observe(contactSection);
  }

  /* ── 8. SCROLL TO TOP ──────────────────────────────── */
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 9. CERTIFICATION CARDS — Mouse-follow Tilt ────── */
  const certCards = document.querySelectorAll('.cert-card');

  certCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── 10. EXPERIENCE — Stagger bullet points ────────── */
  const expListItems = document.querySelectorAll('.exp-list li');
  const expObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.exp-list li');
        items.forEach((item, i) => {
          item.style.opacity = '0';
          item.style.transform = 'translateX(-20px)';
          item.style.transition = `opacity 0.4s ease ${i * 0.15}s, transform 0.4s ease ${i * 0.15}s`;
          
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          });
        });
        expObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.exp-right').forEach(el => expObserver.observe(el));

  /* ── 11. PROJECT TECH PILLS — Bounce-in Stagger ────── */
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pills = entry.target.querySelectorAll('.tech-pill');
        pills.forEach((pill, i) => {
          pill.style.opacity = '0';
          pill.style.transform = 'scale(0.5) translateY(10px)';
          pill.style.transition = `opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s`;

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              pill.style.opacity = '1';
              pill.style.transform = 'scale(1) translateY(0)';
            });
          });
        });

        // Outcomes pop in like cards being dealt
        const outcomes = entry.target.querySelectorAll('.project-outcomes li');
        outcomes.forEach((item, i) => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(15px)';
          item.style.transition = `opacity 0.35s ease ${0.2 + i * 0.1}s, transform 0.35s ease ${0.2 + i * 0.1}s`;
          
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          });
        });

        projectObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.project-info').forEach(el => projectObserver.observe(el));

  /* ── 12. SMOOTH ANCHOR SCROLLING (fallback) ────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 13. EDUCATION — Highlight bullets draw effect ─── */
  const eduObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const highlights = entry.target.querySelectorAll('.edu-highlights li');
        highlights.forEach((item, i) => {
          item.style.opacity = '0';
          item.style.transform = 'translateX(-15px)';
          item.style.transition = `opacity 0.4s ease ${i * 0.2}s, transform 0.4s ease ${i * 0.2}s`;
          
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          });
        });
        eduObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.edu-card').forEach(el => eduObserver.observe(el));

  /* ── 14. CONTACT — Sequential underline draw ───────── */
  const formGroups = document.querySelectorAll('.form-group');
  const contactFormObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        formGroups.forEach((group, i) => {
          const line = group.querySelector('.form-line');
          if (line) {
            setTimeout(() => {
              line.style.width = '100%';
              setTimeout(() => { line.style.width = '0'; }, 600);
            }, i * 200);
          }
        });
        contactFormObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const formPanel = document.querySelector('.contact-form-panel');
  if (formPanel) contactFormObserver.observe(formPanel);

  /* ── 15. PARTICLE-LIKE AMBIENT DOTS (Landing) ──────── */
  function createAmbientDots() {
    const landing = document.getElementById('landing');
    if (!landing) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    landing.insertBefore(canvas, landing.firstChild);

    const ctx = canvas.getContext('2d');
    let dots = [];
    const DOT_COUNT = 40;

    function resize() {
      canvas.width = landing.offsetWidth;
      canvas.height = landing.offsetHeight;
    }

    function init() {
      resize();
      dots = [];
      for (let i = 0; i < DOT_COUNT; i++) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 2 + 1,
          alpha: Math.random() * 0.15 + 0.05,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(dot => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${dot.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener('resize', resize);
  }

  createAmbientDots();
});
