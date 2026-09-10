/**
 * Auto-City Quote Statement Section
 * Handles crossfading automotive showcase photos and spring pill hover micro-interactions.
 */

(function() {
  'use strict';

  function initQuoteSection() {
    const wheelPill = document.getElementById('quoteWheelPill') || document.getElementById('quoteAvatarPill');
    const weatherPill = document.getElementById('quoteWeatherPill');
    const avatarStack = document.getElementById('quoteAvatarStack');

    // Steering Wheel Turn Interaction (Enlarges slightly, turns left & right like a steering wheel)
    function triggerWheelSteer(pill) {
      if (!pill) return;
      pill.classList.remove('quote-wheel-steering');
      void pill.offsetWidth; // Force DOM reflow to re-trigger immediately on rapid clicks
      pill.classList.add('quote-wheel-steering');
    }

    if (wheelPill) {
      wheelPill.addEventListener('click', function(e) {
        e.stopPropagation();
        triggerWheelSteer(wheelPill);
      });

      wheelPill.addEventListener('animationend', function() {
        wheelPill.classList.remove('quote-wheel-steering');
      });
    }

    // Optional legacy cycling vehicles fallback if avatarStack is present
    if (avatarStack) {
      const avatarImages = avatarStack.querySelectorAll('.quote-avatar-item');
      let currentIndex = 0;
      let cycleInterval = null;

      function showNextAvatar() {
        if (avatarImages.length <= 1) return;
        avatarImages[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % avatarImages.length;
        avatarImages[currentIndex].classList.add('active');
      }

      function startCycle() {
        if (cycleInterval) clearInterval(cycleInterval);
        cycleInterval = setInterval(showNextAvatar, 3200);
      }

      function stopCycle() {
        if (cycleInterval) clearInterval(cycleInterval);
      }

      startCycle();

      if (wheelPill) {
        wheelPill.addEventListener('mouseenter', stopCycle);
        wheelPill.addEventListener('mouseleave', startCycle);
      }
    }

    // Spring pop feedback helper for celebration spark pill (enlarge & snap back)
    function triggerPillPop(pill) {
      if (!pill) return;
      pill.classList.remove('quote-pill-popping');
      void pill.offsetWidth; // Force reflow to allow immediate re-triggering on rapid clicks
      pill.classList.add('quote-pill-popping');
    }

    // Confetti Engine for "Vibrant Night" Celebration Spark Pill (Emerge from behind)
    let confettiStage = document.getElementById('quoteConfettiStage');
    if (!confettiStage && weatherPill && weatherPill.parentElement) {
      confettiStage = document.createElement('span');
      confettiStage.id = 'quoteConfettiStage';
      confettiStage.className = 'quote-confetti-stage';
      confettiStage.setAttribute('aria-hidden', 'true');
      weatherPill.parentElement.insertBefore(confettiStage, weatherPill);
    }

    const CONFETTI_COLORS = [
      '#e10021', // Auto-City Signature Racing Red
      '#fdcb50', // Celebration Amber Gold
      '#ff8c00', // Sunburst Flame Orange
      '#00b4d8', // Electric Cyan
      '#38bdf8', // Radiant Sky Blue
      '#a855f7', // Night Violet
      '#10b981', // Emerald Glint
      '#ec4899'  // Festive Coral Pink
    ];

    function burstConfetti() {
      if (!confettiStage) {
        confettiStage = document.getElementById('quoteConfettiStage');
      }
      if (!confettiStage && weatherPill && weatherPill.parentElement) {
        confettiStage = document.createElement('span');
        confettiStage.id = 'quoteConfettiStage';
        confettiStage.className = 'quote-confetti-stage';
        confettiStage.setAttribute('aria-hidden', 'true');
        weatherPill.parentElement.insertBefore(confettiStage, weatherPill);
      }
      if (!confettiStage) return;

      const count = 34; // Rich celebration burst
      for (let i = 0; i < count; i++) {
        const particle = document.createElement('span');
        particle.className = 'quote-confetti-particle';

        const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        const isCircle = Math.random() > 0.65;
        const isRibbon = !isCircle && Math.random() > 0.4;
        
        const width = isCircle ? 6 + Math.random() * 3 : (isRibbon ? 9 + Math.random() * 4 : 6 + Math.random() * 3);
        const height = isCircle ? width : (isRibbon ? 4 + Math.random() * 2 : 6 + Math.random() * 3);

        particle.style.width = `${width.toFixed(1)}px`;
        particle.style.height = `${height.toFixed(1)}px`;
        particle.style.backgroundColor = color;
        particle.style.borderRadius = isCircle ? '50%' : (isRibbon ? '1.5px' : '1px');
        if (!isCircle && Math.random() > 0.5) {
          particle.style.boxShadow = `0 0 6px ${color}88`;
        }

        // Full 360-degree radial dispersion from behind the pill center
        const angle = Math.random() * Math.PI * 2;
        const distance = 45 + Math.random() * 85; // 45px to 130px burst radius
        const targetX = Math.cos(angle) * distance;
        // Upward arc bias for celebratory fountain effect
        const targetY = Math.sin(angle) * (distance * 0.85) - (16 + Math.random() * 22);
        const gravity = 25 + Math.random() * 45; // Gentle downward flutter

        const spinStart = Math.random() * 180;
        const spinEnd = spinStart + (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 540);
        const tiltZ = (Math.random() - 0.5) * 60;

        confettiStage.appendChild(particle);

        const duration = 750 + Math.random() * 350;

        const anim = particle.animate([
          {
            transform: 'translate(-50%, -50%) translate3d(0, 0, 0) scale(0) rotate(0deg)',
            opacity: 1
          },
          {
            transform: `translate(-50%, -50%) translate3d(${targetX * 0.4}px, ${targetY * 0.4}px, 0) scale(1.25) rotate(${spinStart + 90}deg) rotateX(${tiltZ}deg)`,
            opacity: 1,
            offset: 0.25
          },
          {
            transform: `translate(-50%, -50%) translate3d(${targetX * 0.85}px, ${targetY * 0.85 + gravity * 0.5}px, 0) scale(0.95) rotate(${spinEnd * 0.7}deg)`,
            opacity: 0.9,
            offset: 0.75
          },
          {
            transform: `translate(-50%, -50%) translate3d(${targetX}px, ${targetY + gravity}px, 0) scale(0.35) rotate(${spinEnd}deg)`,
            opacity: 0
          }
        ], {
          duration: duration,
          easing: 'cubic-bezier(0.12, 0.82, 0.25, 1)',
          fill: 'forwards'
        });

        anim.onfinish = () => {
          particle.remove();
        };
      }
    }

    // Click on celebration spark pill: Enlarge & return quickly, and launch confetti from behind
    if (weatherPill) {
      weatherPill.addEventListener('click', function(e) {
        e.stopPropagation();
        triggerPillPop(weatherPill);
        burstConfetti();
      });

      weatherPill.addEventListener('animationend', function() {
        weatherPill.classList.remove('quote-pill-popping');
      });
    }

    // Cursor-following red circle mask directly on text
    const title = document.getElementById('quoteStatementTitle');

    if (title) {
      let targetX = -999;
      let targetY = -999;
      let currentX = -999;
      let currentY = -999;
      let targetRadius = 0;
      let currentRadius = 0;
      let isHovering = false;
      let rafId = null;

      function getOptimalRadius() {
        const w = window.innerWidth;
        if (w <= 640) return 65;
        if (w <= 1024) return 80;
        return 95;
      }

      function updateCursor(x, y) {
        const rect = title.getBoundingClientRect();
        targetX = x - rect.left;
        targetY = y - rect.top;
        if (!isHovering) {
          isHovering = true;
          currentX = targetX;
          currentY = targetY;
          targetRadius = getOptimalRadius();
          if (!rafId) rafId = requestAnimationFrame(animateMask);
        }
      }

      function animateMask() {
        // Fluid spring lerp interpolation for silky motion
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;
        currentRadius += (targetRadius - currentRadius) * 0.15;

        title.style.setProperty('--mask-x', `${currentX.toFixed(2)}px`);
        title.style.setProperty('--mask-y', `${currentY.toFixed(2)}px`);
        title.style.setProperty('--mask-r', `${currentRadius.toFixed(2)}px`);

        if (isHovering || currentRadius > 0.5) {
          rafId = requestAnimationFrame(animateMask);
        } else {
          title.style.setProperty('--mask-r', '0px');
          rafId = null;
        }
      }

      // Mouse event listeners
      title.addEventListener('mouseenter', function(e) {
        updateCursor(e.clientX, e.clientY);
      });

      title.addEventListener('mousemove', function(e) {
        const rect = title.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        targetRadius = getOptimalRadius();
        if (!rafId) rafId = requestAnimationFrame(animateMask);
      });

      title.addEventListener('mouseleave', function() {
        isHovering = false;
        targetRadius = 0;
        if (!rafId) rafId = requestAnimationFrame(animateMask);
      });

      // Touch drag listeners for mobile/tablet devices
      title.addEventListener('touchstart', function(e) {
        if (e.touches && e.touches[0]) {
          updateCursor(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      title.addEventListener('touchmove', function(e) {
        if (e.touches && e.touches[0]) {
          const rect = title.getBoundingClientRect();
          targetX = e.touches[0].clientX - rect.left;
          targetY = e.touches[0].clientY - rect.top;
          if (!rafId) rafId = requestAnimationFrame(animateMask);
        }
      }, { passive: true });

      title.addEventListener('touchend', function() {
        isHovering = false;
        targetRadius = 0;
        if (!rafId) rafId = requestAnimationFrame(animateMask);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuoteSection);
  } else {
    initQuoteSection();
  }
})();
