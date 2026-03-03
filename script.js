/* ═══════════════════════════════════════════════════
   LuG Engenharia & Soluções — JavaScript
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ─── Elements ───
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.navbar__link');
  const whatsappFab = document.getElementById('whatsappFab');
  const contactForm = document.getElementById('contactForm');
  const revealElements = document.querySelectorAll('.reveal');
  const sections = document.querySelectorAll('section[id]');

  // ─── Create mobile overlay ───
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  document.body.appendChild(overlay);

  // ─── Navbar Scroll Effect ───
  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Navbar shrink
    if (scrollY > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }

    // WhatsApp FAB visibility
    if (scrollY > 400) {
      whatsappFab.classList.add('visible');
    } else {
      whatsappFab.classList.remove('visible');
    }

    // Active section highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once on load

  // ─── Hamburger Menu ───
  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  };

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // ─── Smooth Scroll (for browsers that don't support scroll-behavior) ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ─── Intersection Observer for Reveal Animations ───
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ─── Contact Form ───
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Create a nice formatted message for WhatsApp
      const serviceName = contactForm.querySelector('#servico option:checked').textContent;
      let whatsappMsg = `*Novo contato pelo site LuG Engenharia*\n\n`;
      whatsappMsg += `*Nome:* ${data.nome}\n`;
      whatsappMsg += `*E-mail:* ${data.email}\n`;
      if (data.telefone) whatsappMsg += `*Telefone:* ${data.telefone}\n`;
      if (data.servico) whatsappMsg += `*Serviço:* ${serviceName}\n`;
      whatsappMsg += `*Mensagem:* ${data.mensagem}`;
      
      // Encode and open WhatsApp (replace number as needed)
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`;
      window.open(whatsappUrl, '_blank');
      
      // Show success feedback
      showToast('Mensagem preparada! Complete o envio pelo WhatsApp.');
      contactForm.reset();
    });
  }

  // ─── Toast Notification ───
  function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: var(--c-navy);
      color: white;
      padding: 14px 28px;
      border-radius: 12px;
      font-family: var(--font-body);
      font-size: 0.9rem;
      box-shadow: 0 8px 30px rgba(0,0,0,0.2);
      z-index: 10000;
      opacity: 0;
      transition: all 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ─── Close menu on ESC ───
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });
});
