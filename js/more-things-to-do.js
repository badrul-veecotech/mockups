/**
 * More Things You Can Do at AutoCity
 * Interactive Tabbed Services with Image Reveal Engine
 * Reference: Temlis Acelia
 */

(function() {
  'use strict';

  function initMoreThingsTabs() {
    const section = document.getElementById('moreThingsToDo');
    if (!section) return;

    const tabItems = Array.from(section.querySelectorAll('.more-things-tab-item'));
    const stagePanels = Array.from(section.querySelectorAll('.more-things-panel'));
    if (!tabItems.length) return;

    let currentIndex = tabItems.findIndex(t => t.classList.contains('active'));
    if (currentIndex === -1) currentIndex = 0;

    function switchTab(index, options = {}) {
      if (index === currentIndex && !options.force) return;
      if (index < 0 || index >= tabItems.length) return;

      const previousTab = tabItems[currentIndex];
      const targetTab = tabItems[index];

      // Update tabs
      tabItems.forEach((tab, i) => {
        const isActive = i === index;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      // Update Desktop Stage Panels with Curtain Reveal
      if (stagePanels.length > 0) {
        const targetPanel = stagePanels[index];
        stagePanels.forEach((panel, i) => {
          if (i !== index) {
            panel.classList.remove('active', 'curtain-reveal');
          }
        });

        if (targetPanel) {
          // Force layout reflow so the curtain animation triggers fresh
          targetPanel.classList.remove('curtain-reveal');
          void targetPanel.offsetWidth;
          targetPanel.classList.add('active', 'curtain-reveal');
        }
      }

      currentIndex = index;

      if (options.focus) {
        targetTab.focus();
      }
    }

    // Attach Click and Keyboard listeners
    tabItems.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        switchTab(index);
      });

      // Roving Tabindex & Keyboard Navigation
      tab.addEventListener('keydown', (e) => {
        let targetIndex = -1;

        switch (e.key) {
          case 'ArrowDown':
          case 'ArrowRight':
            e.preventDefault();
            targetIndex = (currentIndex + 1) % tabItems.length;
            break;
          case 'ArrowUp':
          case 'ArrowLeft':
            e.preventDefault();
            targetIndex = (currentIndex - 1 + tabItems.length) % tabItems.length;
            break;
          case 'Home':
            e.preventDefault();
            targetIndex = 0;
            break;
          case 'End':
            e.preventDefault();
            targetIndex = tabItems.length - 1;
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            switchTab(index);
            break;
        }

        if (targetIndex !== -1) {
          switchTab(targetIndex, { focus: true });
        }
      });
    });

    // Optional desktop hover switch with deliberate debounce to avoid twitching
    let hoverTimeout = null;
    tabItems.forEach((tab, index) => {
      tab.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 1024) {
          clearTimeout(hoverTimeout);
          hoverTimeout = setTimeout(() => {
            switchTab(index);
          }, 80);
        }
      });
      tab.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
      });
    });
  }

  // Self-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMoreThingsTabs);
  } else {
    initMoreThingsTabs();
  }
})();
