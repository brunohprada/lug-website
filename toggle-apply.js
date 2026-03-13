/* ═══════════════════════════════════════════════════
   LuG Engenharia — Toggle Apply (runs on main site)
   Reads feature toggle states from localStorage and
   hides disabled sections/items before first paint.
   ═══════════════════════════════════════════════════ */

(function () {
  const STORAGE_KEY = 'lug-feature-toggles';

  let state;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) state = JSON.parse(saved);
  } catch (e) { /* ignore */ }

  // If no state saved, everything is visible by default
  if (!state) return;

  function isOff(key) {
    return state.hasOwnProperty(key) && state[key] === false;
  }

  // ─── Wait for DOM ───
  function applyToggles() {

    // ─── Section-level toggles ───
    const sectionMap = {
      'section-problemas': '#problemas',
      'section-sobre': '#sobre',
      'section-servicos': '#servicos',
      'section-diferenciais': '#diferenciais',
      'section-contato': '#contato',
      'section-cta-banner': '[data-toggle-id="cta-banner"]'
    };

    Object.entries(sectionMap).forEach(([toggleKey, selector]) => {
      if (isOff(toggleKey)) {
        const el = document.querySelector(selector);
        if (el) el.style.display = 'none';

        // Also hide nav link for this section
        const navLink = document.querySelector(`.navbar__link[data-section="${selector.replace('#', '')}"]`);
        if (navLink) navLink.style.display = 'none';
      }
    });

    // ─── Service-level toggles ───
    // Only apply if the parent section is ON
    if (!isOff('section-servicos')) {
      document.querySelectorAll('[data-toggle-id^="servico-"]').forEach(el => {
        const toggleKey = el.dataset.toggleId;
        if (isOff(toggleKey)) {
          el.style.display = 'none';
        }
      });

      // Hide empty service categories
      document.querySelectorAll('.servicos__category').forEach(cat => {
        const grid = cat.querySelector('.servicos__grid');
        if (!grid) return;
        const visibleCards = grid.querySelectorAll('.service-card:not([style*="display: none"])');
        if (visibleCards.length === 0) {
          cat.style.display = 'none';
        }
      });
    }

    // ─── Diferencial-level toggles ───
    if (!isOff('section-diferenciais')) {
      document.querySelectorAll('[data-toggle-id^="diferencial-"]').forEach(el => {
        const toggleKey = el.dataset.toggleId;
        if (isOff(toggleKey)) {
          el.style.display = 'none';
        }
      });
    }

    // ─── Update contact form service select ───
    const serviceSelect = document.getElementById('servico');
    if (serviceSelect) {
      const serviceOptionMap = {
        'servico-nr11': 'nr11',
        'servico-nr12': 'nr12',
        'servico-nr13': 'nr13',
        'servico-playground': 'playground',
        'servico-pmoc': 'pmoc',
        'servico-geradores': 'geradores',
        'servico-elevadores': 'elevadores',
        'servico-exaustao': 'exaustao',
        'servico-gas': 'gas',
        'servico-maquinas': 'maquinas',
        'servico-andaimes': 'andaimes',
        'servico-veicular': 'veicular',
        'servico-avcb': 'avcb',
        'servico-linha-vida': 'linha-vida',
        'servico-ancoragem': 'ancoragem',
        'servico-rt': 'rt',
        'servico-pericia': 'pericia'
      };

      Object.entries(serviceOptionMap).forEach(([toggleKey, optionValue]) => {
        if (isOff(toggleKey) || isOff('section-servicos')) {
          const option = serviceSelect.querySelector(`option[value="${optionValue}"]`);
          if (option) option.style.display = 'none';
        }
      });
    }
  }

  // Run as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyToggles);
  } else {
    applyToggles();
  }
})();
