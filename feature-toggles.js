/* ═══════════════════════════════════════════════════
   LuG Engenharia — Feature Toggles Admin Logic
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'lug-feature-toggles';

  // ─── Default state (all on) ───
  function getDefaults() {
    const defaults = {};
    document.querySelectorAll('[data-toggle]').forEach(input => {
      defaults[input.dataset.toggle] = true;
    });
    return defaults;
  }

  // ─── Load saved state ───
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return null;
  }

  // ─── Save state ───
  function saveState() {
    const state = {};
    document.querySelectorAll('[data-toggle]').forEach(input => {
      state[input.dataset.toggle] = input.checked;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  // ─── Apply state to UI ───
  function applyState(state) {
    document.querySelectorAll('[data-toggle]').forEach(input => {
      const key = input.dataset.toggle;
      if (state.hasOwnProperty(key)) {
        input.checked = state[key];
      }
    });
    // After applying, update parent/child relationships
    updateAllParents();
    updateAllStatuses();
  }

  // ─── Parent-child: map parent sections to their children ───
  const parentChildMap = {
    'section-servicos': 'servicos',
    'section-diferenciais': 'diferenciais'
  };

  function getChildToggles(parentKey) {
    const childrenGroup = parentChildMap[parentKey];
    if (!childrenGroup) return [];
    const container = document.querySelector(`[data-children="${childrenGroup}"]`);
    if (!container) return [];
    return Array.from(container.querySelectorAll('[data-toggle]'));
  }

  // ─── Propagate parent toggle ───
  function handleParentToggle(parentInput) {
    const parentKey = parentInput.dataset.toggle;
    const isOn = parentInput.checked;
    const children = getChildToggles(parentKey);
    const card = parentInput.closest('.toggle-card');
    const childrenContainer = card ? card.querySelector('.toggle-card__children') : null;

    children.forEach(child => {
      child.disabled = !isOn;
      const childRow = child.closest('.toggle-child');
      if (childRow) {
        childRow.classList.toggle('toggle-child--disabled', !isOn);
      }
    });

    if (childrenContainer) {
      childrenContainer.style.opacity = isOn ? '1' : '0.4';
      childrenContainer.style.pointerEvents = isOn ? 'auto' : 'none';
    }
  }

  // ─── Update all parent states ───
  function updateAllParents() {
    document.querySelectorAll('[data-parent]').forEach(parentInput => {
      handleParentToggle(parentInput);
    });
  }

  // ─── Status badges ───
  function updateAllStatuses() {
    document.querySelectorAll('.toggle-card').forEach(card => {
      const statusEl = card.querySelector('[data-status]');
      if (!statusEl) return;

      const mainInput = card.querySelector('.toggle-card__header [data-toggle]');
      if (!mainInput) return;

      const childrenContainer = card.querySelector('.toggle-card__children');

      if (!childrenContainer) {
        // Simple toggle (no children)
        if (mainInput.checked) {
          statusEl.textContent = 'Ativo';
          statusEl.className = 'toggle-card__status toggle-card__status--on';
        } else {
          statusEl.textContent = 'Inativo';
          statusEl.className = 'toggle-card__status toggle-card__status--off';
        }
      } else {
        // Has children — show count
        if (!mainInput.checked) {
          statusEl.textContent = 'Inativo';
          statusEl.className = 'toggle-card__status toggle-card__status--off';
        } else {
          const childInputs = childrenContainer.querySelectorAll('[data-toggle]');
          const activeCount = Array.from(childInputs).filter(c => c.checked).length;
          const totalCount = childInputs.length;

          if (activeCount === totalCount) {
            statusEl.textContent = `${activeCount}/${totalCount} ativos`;
            statusEl.className = 'toggle-card__status toggle-card__status--on';
          } else if (activeCount === 0) {
            statusEl.textContent = `0/${totalCount} ativos`;
            statusEl.className = 'toggle-card__status toggle-card__status--off';
          } else {
            statusEl.textContent = `${activeCount}/${totalCount} ativos`;
            statusEl.className = 'toggle-card__status toggle-card__status--partial';
          }
        }
      }
    });
  }

  // ─── Event delegation for all toggles ───
  document.getElementById('toggleGrid').addEventListener('change', (e) => {
    const input = e.target;
    if (!input.matches('[data-toggle]')) return;

    // If it's a parent toggle, propagate
    if (input.hasAttribute('data-parent')) {
      handleParentToggle(input);
    }

    updateAllStatuses();
    saveState();
    showToast('Alterações salvas automaticamente');
  });

  // ─── Reset button ───
  document.getElementById('btnReset').addEventListener('click', () => {
    const defaults = getDefaults();
    // Set all to true
    Object.keys(defaults).forEach(k => defaults[k] = true);
    applyState(defaults);
    saveState();
    showToast('Toggles restaurados para o padrão');
  });

  // ─── Toast ───
  let toastTimer;
  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span></span>
      `;
      document.body.appendChild(toast);
    }

    toast.querySelector('span').textContent = message;
    clearTimeout(toastTimer);

    // Trigger reflow for animation
    toast.classList.remove('visible');
    void toast.offsetWidth;
    toast.classList.add('visible');

    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2000);
  }

  // ─── Initialize ───
  const saved = loadState();
  if (saved) {
    applyState(saved);
  } else {
    updateAllParents();
    updateAllStatuses();
  }
});
