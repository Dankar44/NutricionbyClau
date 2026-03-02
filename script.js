/* ========================================
   NUTRICIÓN BY CLAUDIA — Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  const handleScroll = () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- Mobile navigation ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  const toggleNav = () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  };

  navToggle.addEventListener('click', toggleNav);
  navOverlay.addEventListener('click', toggleNav);

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleNav();
      }
    });
  });

  // ---- Smooth scrolling ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- Scroll reveal animations ----
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Counter animation ----
  const counters = document.querySelectorAll('.hero-stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();

        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);

          if (target >= 100) {
            el.textContent = current + '+';
          } else {
            el.textContent = current + (target === 98 ? '%' : '+');
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ---- Contact form ----
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();

      if (!name || !email) {
        showFormMessage('Por favor, rellena los campos obligatorios.', 'error');
        return;
      }

      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormMessage('Por favor, introduce un email válido.', 'error');
        return;
      }

      // Real submission via FormSubmit AJAX
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;

      const phone = document.getElementById('phone').value.trim();
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value.trim();

      fetch("https://formsubmit.co/ajax/claudiafores.nutricion@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          service: service,
          message: message,
          _subject: "Nueva solicitud de consulta desde la web"
        })
      })
        .then(response => response.json())
        .then(data => {
          showFormMessage('¡Gracias! Te contactaré en menos de 24 horas. 🍒', 'success');
          form.reset();
          submitBtn.innerHTML = `
          Enviar solicitud
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        `;
          submitBtn.disabled = false;
        })
        .catch(error => {
          showFormMessage('Hubo un error de conexión al enviar. Por favor, intenta de nuevo.', 'error');
          submitBtn.innerHTML = `
          Reintentar
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        `;
          submitBtn.disabled = false;
        });
    });
  }

  function showFormMessage(text, type) {
    // Remove any existing message
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.className = `form-message form-message-${type}`;
    msg.textContent = text;
    msg.style.cssText = `
      padding: 14px 20px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 0.9rem;
      font-weight: 500;
      animation: fadeIn 0.3s ease;
      ${type === 'success'
        ? 'background: #E8F5E9; color: #2E7D32; border: 1px solid #C8E6C9;'
        : 'background: #FFEBEE; color: #C62828; border: 1px solid #FFCDD2;'
      }
    `;

    form.insertBefore(msg, form.firstChild);

    setTimeout(() => {
      msg.style.opacity = '0';
      msg.style.transition = 'opacity 0.3s ease';
      setTimeout(() => msg.remove(), 300);
    }, 5000);
  }

  // ---- Parallax-lite on hero ----
  const heroVisual = document.querySelector('.hero-visual');

  if (heroVisual && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      if (scroll < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scroll * 0.08}px)`;
      }
    }, { passive: true });
  }

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');

  const navHighlightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.querySelectorAll('a').forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === `#${id}`) {
            a.style.color = '#C81D4E';
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px 0px 0px'
  });

  sections.forEach(section => navHighlightObserver.observe(section));

  // ---- Exclusive video playback ----
  const videos = document.querySelectorAll('.ig-video-player');
  videos.forEach(video => {
    video.addEventListener('play', () => {
      videos.forEach(v => {
        if (v !== video) {
          v.pause();
        }
      });
    });
  });

  // ---- Seamless Infinite Reel Carousel Logic ----
  const track = document.querySelector('.reel-carousel-track');
  const slides = Array.from(document.querySelectorAll('.reel-slide'));
  const nextButton = document.querySelector('.carousel-btn.next');
  const prevButton = document.querySelector('.carousel-btn.prev');
  const dotsNav = document.querySelector('.carousel-indicators');

  if (track && slides.length > 0) {
    // We won't use traditional dots for an infinite appendChild slider
    // as the original index is lost visually, unless we track ids. 
    // We will keep dots to show amount of videos, but they will update based on the center item.
    slides.forEach((slide, index) => {
      slide.dataset.index = index; // Keep track of original index
      const dot = document.createElement('button');
      dot.className = index === 0 ? 'carousel-dot active' : 'carousel-dot';
      dot.setAttribute('aria-label', `Slide ${index + 1}`);
      dotsNav.appendChild(dot);
    });

    const dots = Array.from(dotsNav.children);

    const getItemsPerView = () => {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    };

    let autoSlideInterval;
    let isVideoPlaying = false;
    let isAnimating = false;

    const updateCenterAndDots = () => {
      const currentSlides = Array.from(track.children);
      const itemsPerView = getItemsPerView();

      let centerIndex = 0;
      if (itemsPerView === 3) centerIndex = 1;
      if (itemsPerView === 2) centerIndex = 1;

      currentSlides.forEach(slide => slide.classList.remove('center-slide'));
      if (currentSlides[centerIndex]) {
        currentSlides[centerIndex].classList.add('center-slide');

        // Update dots based on the active center slide
        const originalIndex = currentSlides[centerIndex].dataset.index;
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[originalIndex]) dots[originalIndex].classList.add('active');
      }
    };

    const slideNext = () => {
      if (isAnimating) return;
      isAnimating = true;
      const itemsPerView = getItemsPerView();
      const translation = 100 / itemsPerView;

      track.style.transition = 'transform 0.4s ease-in-out';
      track.style.transform = `translateX(-${translation}%)`;

      // Wait for transition to finish
      setTimeout(() => {
        track.style.transition = 'none';
        track.appendChild(track.firstElementChild);
        track.style.transform = 'translateX(0)';
        updateCenterAndDots();
        isAnimating = false;
      }, 400);
    };

    const slidePrev = () => {
      if (isAnimating) return;
      isAnimating = true;
      const itemsPerView = getItemsPerView();
      const translation = 100 / itemsPerView;

      // Prepend last element, jump to negative translation, then transition to 0
      track.style.transition = 'none';
      track.prepend(track.lastElementChild);
      track.style.transform = `translateX(-${translation}%)`;

      // Force reflow
      void track.offsetWidth;

      track.style.transition = 'transform 0.4s ease-in-out';
      track.style.transform = 'translateX(0)';

      setTimeout(() => {
        track.style.transition = 'none';
        updateCenterAndDots();
        isAnimating = false;
      }, 400);
    };

    const startAutoSlide = () => {
      clearInterval(autoSlideInterval);
      if (!isVideoPlaying) {
        autoSlideInterval = setInterval(slideNext, 8000); // 8 seconds interval, slower
      }
    };

    const stopAutoSlide = () => {
      clearInterval(autoSlideInterval);
    };

    // Initial setup
    updateCenterAndDots();
    startAutoSlide();

    window.addEventListener('resize', () => {
      updateCenterAndDots();
    });

    const handleManualInteraction = () => {
      stopAutoSlide();
      videos.forEach(v => v.pause());
      if (!isVideoPlaying) startAutoSlide();
    };

    nextButton.addEventListener('click', () => {
      slideNext();
      handleManualInteraction();
    });

    prevButton.addEventListener('click', () => {
      slidePrev();
      handleManualInteraction();
    });

    // Make Dots jump to exact slide (calculating difference)
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        // Because DOM shifting makes jumping to specific indices complex visually without skipping, 
        // we simulate next/prev clicks if it's not the current dot.
        const itemsPerView = getItemsPerView();
        let centerIndex = itemsPerView === 3 || itemsPerView === 2 ? 1 : 0;
        const currentCenterRealIndex = parseInt(track.children[centerIndex].dataset.index);

        if (index !== currentCenterRealIndex && !isAnimating) {
          slideNext(); // Simplified: just jump next
          handleManualInteraction();
        }
      });
    });

    // Video play/pause logic
    videos.forEach(video => {
      video.addEventListener('play', () => {
        isVideoPlaying = true;
        stopAutoSlide();
      });
      video.addEventListener('pause', () => {
        isVideoPlaying = Array.from(videos).some(v => !v.paused);
        if (!isVideoPlaying) startAutoSlide();
      });
      video.addEventListener('ended', () => {
        isVideoPlaying = Array.from(videos).some(v => !v.paused);
        if (!isVideoPlaying) startAutoSlide();
      });
    });
  }

});
