/**
 * Main JavaScript File for Portfolio Website
 * Handles Theme Toggling, Sticky Navigation, Mobile Menu, Active Scroll Highlighting
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initMobileMenu();
  initScrollObserver();
  initTypingEffect();
  initSkillsFilter();
  initContactForm();
  init3DTiltEffect();
});

/* ==========================================================================
   Theme Handler (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('portfolio-theme', currentTheme);
    });
  }
}

/* ==========================================================================
   Navbar & Sticky Header Scroll Behavior
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   Mobile Navigation Menu Drawer
   ========================================================================== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   Intersection Observer for Section Active Highlighting & Animations
   ========================================================================== */
function initScrollObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const reveals = document.querySelectorAll('.section, .reveal');

  if (sections.length === 0 || navLinks.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));

  /* Reveal animation observer */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   Hero Section Animated Typing Effect
   ========================================================================== */
function initTypingEffect() {
  const typingText = document.getElementById('typing-text');
  if (!typingText) return;

  const roles = [
    "BCA Student @ Malda College",
    "Full-Stack Web Developer",
    "Bot & Automation Engineer",
    "Open Source Enthusiast"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const delayNext = 2200;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(type, delayNext);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, 500);
    } else {
      setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
    }
  }

  type();
}

/* ==========================================================================
   Categorized Skills Filter Tabs
   ========================================================================== */
function initSkillsFilter() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  if (filterTabs.length === 0 || skillCards.length === 0) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   Contact Form Validation & EmailJS Client-Side Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-contact-btn');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateInput = (input, errorEl, condition) => {
    if (!condition) {
      input.classList.add('invalid');
      if (errorEl) errorEl.classList.add('visible');
      return false;
    } else {
      input.classList.remove('invalid');
      if (errorEl) errorEl.classList.remove('visible');
      return true;
    }
  };

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      validateInput(nameInput, nameError, nameInput.value.trim().length >= 2);
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      validateInput(emailInput, emailError, emailRegex.test(emailInput.value.trim()));
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', () => {
      validateInput(messageInput, messageError, messageInput.value.trim().length >= 10);
    });
  }

  // Auto-initialize EmailJS if public key is configured
  if (typeof emailjs !== 'undefined' && typeof EMAILJS_CONFIG !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
    try {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    } catch (e) {
      console.warn('EmailJS init warning:', e);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isNameValid = validateInput(nameInput, nameError, nameInput.value.trim().length >= 2);
    const isEmailValid = validateInput(emailInput, emailError, emailRegex.test(emailInput.value.trim()));
    const isMessageValid = validateInput(messageInput, messageError, messageInput.value.trim().length >= 10);

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      formStatus.className = 'form-status error';
      formStatus.textContent = '⚠️ Please fix the highlighted errors above before submitting.';
      return;
    }

    // Button Loading State
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
    }

    formStatus.className = 'form-status';
    formStatus.textContent = '';

    // If EmailJS config credentials are not set yet, fallback gracefully
    const hasCredentials = typeof emailjs !== 'undefined' &&
                           typeof EMAILJS_CONFIG !== 'undefined' &&
                           EMAILJS_CONFIG.SERVICE_ID &&
                           EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_EMAILJS_SERVICE_ID' &&
                           EMAILJS_CONFIG.TEMPLATE_ID &&
                           EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_EMAILJS_TEMPLATE_ID';

    if (!hasCredentials) {
      // Demo fallback while awaiting actual keys from user
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
        formStatus.className = 'form-status success';
        formStatus.textContent = '🎉 Thank you! Your message has been sent. (Awaiting EmailJS Keys to deliver directly to faijaleaqbal@gmail.com)';
        form.reset();
      }, 1000);
      return;
    }

    try {
      // Send Email via EmailJS
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          from_name: nameInput.value.trim(),
          from_email: emailInput.value.trim(),
          reply_to: emailInput.value.trim(),
          subject: subjectInput ? subjectInput.value.trim() || 'Portfolio Inquiry' : 'Portfolio Inquiry',
          message: messageInput.value.trim(),
          to_email: 'faijaleaqbal@gmail.com'
        }
      );

      // Success feedback & clear form fields
      formStatus.className = 'form-status success';
      formStatus.textContent = '🎉 Thank you! Your message has been sent successfully to Md Faijal Eaqbal.';
      form.reset();

    } catch (err) {
      console.error('EmailJS Error:', err);
      formStatus.className = 'form-status error';
      formStatus.textContent = '❌ Failed to send email. Please try again or email directly at faijaleaqbal@gmail.com.';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    }
  });
}

/* ==========================================================================
   3D Tilt & Spatial Holographic Card Micro-Interactions
   ========================================================================== */
function init3DTiltEffect() {
  // Only activate 3D tilt tracking on pointer/mouse devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const tiltCards = document.querySelectorAll('.project-card, .skill-card, .hero-card-glass, .contact-card, .stat-card, .cert-card, .testimonial-card');

  tiltCards.forEach(card => {
    card.classList.add('tilt-card');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max 10deg tilt for smooth subtle depth
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
      card.style.setProperty('--glare-x', `${((x / rect.width) * 100).toFixed(1)}%`);
      card.style.setProperty('--glare-y', `${((y / rect.height) * 100).toFixed(1)}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
}
