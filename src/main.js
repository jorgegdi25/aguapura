import './style.css'
import './pages.css'

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.desktop-nav a');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.querySelector('.mobile-close');
  const contactModal = document.getElementById('contact-modal');
  const modalClose = document.querySelector('#contact-modal .modal-close');
  const contactForm = document.querySelector('.contact-form');

  const normalizeHash = (href) => {
    if (!href) return '';
    if (href === '/' || href === './' || href === 'index.html' || href === '') return '#inicio';
    const hashIndex = href.indexOf('#');
    if (hashIndex !== -1) {
      return href.substring(hashIndex);
    }
    return '';
  };

  const openMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.add('active');
    mobileMenu.removeAttribute('inert');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    mobileClose?.focus();
  };

  const closeMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('inert', '');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openContactModal = () => {
    if (!contactModal) return;
    closeMobileMenu();
    contactModal.classList.add('active');
    contactModal.removeAttribute('inert');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    contactModal.querySelector('.form-control, button')?.focus();
  };

  const closeContactModal = () => {
    if (!contactModal) return;
    contactModal.classList.remove('active');
    contactModal.setAttribute('inert', '');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Scroll: header style + active nav
  window.addEventListener('scroll', () => {
    // Header background
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active section tracking
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 200;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (normalizeHash(link.getAttribute('href')) === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // Scroll animations with IntersectionObserver
  const animatedElements = document.querySelectorAll('.glass-card, .stat-item, .hero-content, .section-overline');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      const targetHash = normalizeHash(href);
      
      // If link is for contact, open modal
      if (targetHash === '#contacto') {
        e.preventDefault();
        openContactModal();
        return;
      }

      if (targetHash) {
        try {
          const target = document.querySelector(targetHash);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Close mobile menu if open
            if (mobileMenu && mobileMenu.classList.contains('active')) {
              closeMobileMenu();
            }
          }
        } catch (err) {
          // If querySelector fails, let browser handle
        }
      }
    });
  });

  // Mobile Menu Logic
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', openMobileMenu);
  }

  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }

  // Contact Modal Logic
  if (modalClose && contactModal) {
    modalClose.addEventListener('click', closeContactModal);
    
    // Close on backdrop click
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        closeContactModal();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (contactModal?.classList.contains('active')) closeContactModal();
    if (mobileMenu?.classList.contains('active')) closeMobileMenu();
  });

  // Contact Form Handling
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const feedback = contactForm.querySelector('.form-feedback');
      const originalBtnText = submitBtn.innerText;
      
      // Loading state
      submitBtn.innerText = 'Enviando...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      if (feedback) {
        feedback.textContent = '';
        feedback.className = 'form-feedback';
      }

      // Simulate API call or actual fetch
      try {
        const formData = new FormData(contactForm);
        const response = await fetch('/contact.php', {
          method: 'POST',
          body: formData
        });
        
        // Wait a bit for UX
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (response.ok) {
          // Success feedback
          contactForm.innerHTML = `
            <div style="text-align: center; padding: 20px;">
              <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
              <h3 style="color: var(--on-surface); font-family: var(--font-display);">¡Mensaje Enviado!</h3>
              <p style="color: var(--on-surface-variant); margin-top: 8px;">Gracias por contactarnos. Nos comunicaremos contigo pronto.</p>
              <button onclick="window.location.reload()" class="btn btn-primary" style="margin-top: 24px;">Enviar otro mensaje</button>
            </div>
          `;
        } else {
          throw new Error('Server error');
        }
      } catch (error) {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        if (feedback) {
          feedback.textContent = 'Hubo un error al enviar el mensaje. Por favor intenta de nuevo.';
          feedback.className = 'form-feedback form-feedback-error';
        }
      }
    });
  }

  // Hero Slider Logic
  const slides = document.querySelectorAll('.hero-slider .slide');
  if (slides.length > 0) {
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5000);
  }
});
