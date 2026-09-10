/**
 * Auto-City Website Revamp : Interaction Engine
 * Clean, event-delegated DOM interactions with strict escape, clipboard, and theme handling
 */

// Theme Management Engine
const THEME_STORAGE_KEY = 'auto-city-theme';

function getPreferredTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme) return storedTheme;
  return 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    const labelSpan = btn.querySelector('.theme-label-text') || btn.querySelector('#themeLabel') || btn;
    if (labelSpan && labelSpan !== btn) {
      labelSpan.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
    }
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    btn.setAttribute('title', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  });

  // Synchronize with active preview iframe if loaded
  const modalFrame = document.getElementById('previewIframe');
  if (modalFrame && modalFrame.contentDocument && modalFrame.contentDocument.documentElement) {
    try {
      modalFrame.contentDocument.documentElement.setAttribute('data-theme', theme);
    } catch (err) {
      // Cross-origin frame protection
    }
  }
}

// Immediate theme execution to prevent flash of wrong theme
const initialTheme = getPreferredTheme();
applyTheme(initialTheme);

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Button Handlers
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const target = current === 'dark' ? 'light' : 'dark';
      applyTheme(target);
    });
  });

  // Listen for OS system theme changes if user hasn't set an explicit override
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Modal Preview Controller
  const modalBackdrop = document.getElementById('previewModal');
  const modalFrame = document.getElementById('previewIframe');
  const modalTitle = document.getElementById('modalTitle');
  const modalExternalLink = document.getElementById('modalExternalLink');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const viewportButtons = document.querySelectorAll('.viewport-btn');
  const previewTriggers = document.querySelectorAll('[data-preview-url]');

  if (modalBackdrop && modalFrame) {
    const openModal = (url, title) => {
      modalFrame.src = url;
      if (modalTitle) modalTitle.textContent = title;
      if (modalExternalLink) modalExternalLink.href = url;
      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modalBackdrop.classList.remove('active');
      modalFrame.src = 'about:blank';
      document.body.style.overflow = '';
    };

    previewTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = btn.getAttribute('data-preview-url');
        const title = btn.getAttribute('data-title') || 'Page Preview';
        openModal(url, title);
      });
    });

    // Synchronize theme on iframe load
    modalFrame.addEventListener('load', () => {
      try {
        const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        if (modalFrame.contentDocument && modalFrame.contentDocument.documentElement) {
          modalFrame.contentDocument.documentElement.setAttribute('data-theme', activeTheme);
        }
      } catch (err) {}
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
        closeModal();
      }
    });

    // Viewport Toggle Handling
    viewportButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        viewportButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const width = btn.getAttribute('data-width') || '100%';
        modalFrame.style.width = width;
      });
    });
  }

  // Tactile Clipboard Copier
  const copyElements = document.querySelectorAll('[data-copy]');
  copyElements.forEach(el => {
    el.addEventListener('click', async () => {
      const text = el.getAttribute('data-copy');
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        const feedbackEl = el.querySelector('.copy-status') || el;
        const previousText = feedbackEl.textContent;
        feedbackEl.textContent = 'Copied!';
        feedbackEl.style.color = '#34d399';

        setTimeout(() => {
          feedbackEl.textContent = previousText;
          feedbackEl.style.color = '';
        }, 1500);
      } catch (err) {
        console.warn('Clipboard write failed:', err);
      }
    });
  });

  // Floating Island Header Controller (Habitline Inward-Closing Scroll Effect)
  const islandHeader = document.getElementById('islandHeader');
  if (islandHeader) {
    let ticking = false;
    const updateScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
          // Smooth hysteresis buffer: close inward once past 45px, reopen above 15px
          if (scrollY > 45) {
            islandHeader.classList.add('scrolled');
          } else if (scrollY < 15) {
            islandHeader.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
  }

  const islandMobileToggle = document.getElementById('islandMobileToggle');
  const islandMobileCard = document.getElementById('islandMobileCard') || document.getElementById('islandMobileDrawer');
  const islandMobileOverlay = document.getElementById('islandMobileOverlay');
  if (islandMobileToggle && islandMobileCard) {
    const toggleIslandDrawer = (open) => {
      const isOpen = open !== undefined ? open : !islandMobileCard.classList.contains('open');
      islandMobileCard.classList.toggle('open', isOpen);
      if (islandMobileOverlay) islandMobileOverlay.classList.toggle('open', isOpen);
      islandMobileToggle.classList.toggle('active', isOpen);
      islandMobileToggle.setAttribute('aria-expanded', isOpen);
      islandMobileCard.setAttribute('aria-hidden', !isOpen);
    };

    islandMobileToggle.addEventListener('click', () => toggleIslandDrawer());

    if (islandMobileOverlay) {
      islandMobileOverlay.addEventListener('click', () => toggleIslandDrawer(false));
    }

    islandMobileCard.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => toggleIslandDrawer(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && islandMobileCard.classList.contains('open')) {
        toggleIslandDrawer(false);
      }
    });
  }

  // Lucide Icons Auto-Initialization
  function initLucideIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({
        attrs: {
          'stroke-width': 1.85,
          class: 'lucide-icon'
        }
      });
    }
  }

  initLucideIcons();
  window.refreshIcons = initLucideIcons;
});

