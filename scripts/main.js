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
   Contact Form Validation & Client-Side Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const formStatus = document.getElementById('form-status');

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateInput(nameInput, nameError, nameInput.value.trim().length >= 2);
    const isEmailValid = validateInput(emailInput, emailError, emailRegex.test(emailInput.value.trim()));
    const isMessageValid = validateInput(messageInput, messageError, messageInput.value.trim().length >= 10);

    if (isNameValid && isEmailValid && isMessageValid) {
      formStatus.className = 'form-status success';
      formStatus.textContent = '🎉 Thank you! Your message has been sent successfully. Md Faijal will get back to you soon.';
      form.reset();

      setTimeout(() => {
        formStatus.className = 'form-status';
        formStatus.textContent = '';
      }, 6000);
    } else {
      formStatus.className = 'form-status error';
      formStatus.textContent = '⚠️ Please fix the highlighted errors above before submitting.';
    }
  });
}
