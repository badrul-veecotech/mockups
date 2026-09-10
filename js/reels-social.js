/**
 * Join In The Fun : Instagram Social Media Reels Engine
 * Controls horizontal carousel scrolling, video playback optimization, and interaction.
 */

document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('joinInTheFun');
  if (!section) return;

  const trackContainer = section.querySelector('.reels-track-container');
  const prevBtn = section.querySelector('.reels-nav-btn.prev');
  const nextBtn = section.querySelector('.reels-nav-btn.next');
  const videos = section.querySelectorAll('.reel-video');

  // 1. Smooth Carousel Button Scrolling
  if (trackContainer && prevBtn && nextBtn) {
    const getScrollStep = () => {
      const firstCard = trackContainer.querySelector('.reel-card');
      const track = trackContainer.querySelector('.reels-track');
      if (firstCard) {
        const gap = track ? (parseFloat(window.getComputedStyle(track).gap) || 36) : 36;
        return firstCard.offsetWidth + gap;
      }
      return 270;
    };

    prevBtn.addEventListener('click', () => {
      trackContainer.scrollBy({ left: -getScrollStep() * 2, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      trackContainer.scrollBy({ left: getScrollStep() * 2, behavior: 'smooth' });
    });

    // Keyboard accessibility inside track
    trackContainer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        trackContainer.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
      } else if (e.key === 'ArrowRight') {
        trackContainer.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
      }
    });

    // Mouse Drag-to-Scroll Support
    let isDown = false;
    let startX;
    let scrollLeft;

    trackContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - trackContainer.offsetLeft;
      scrollLeft = trackContainer.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      isDown = false;
    });

    trackContainer.addEventListener('mouseleave', () => {
      isDown = false;
    });

    trackContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - trackContainer.offsetLeft;
      const walk = (x - startX) * 1.6; // Scroll speed multiplier
      trackContainer.scrollLeft = scrollLeft - walk;
    });
  }

  // 2. IntersectionObserver: Only play videos when section is in viewport
  if ('IntersectionObserver' in window && videos.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Section in viewport -> play videos
          videos.forEach(vid => {
            if (vid.paused) {
              const playPromise = vid.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {
                  // Autoplay policy fallback: show poster
                  vid.closest('.reel-card')?.classList.add('video-error');
                });
              }
            }
          });
        } else {
          // Section offscreen -> pause videos to conserve GPU/battery
          videos.forEach(vid => {
            if (!vid.paused) vid.pause();
          });
        }
      });
    }, { threshold: 0.15 });

    observer.observe(section);
  }

  // 3. Fallback error handling on videos
  videos.forEach(vid => {
    vid.addEventListener('error', () => {
      vid.closest('.reel-card')?.classList.add('video-error');
    });
  });

  // 4. Looping Ambient Red Gradient with 20% Mouse Pressure Influence
  let targetShiftX = 0;
  let targetShiftY = 0;
  let currentShiftX = 0;
  let currentShiftY = 0;

  let targetSpotX = 50;
  let targetSpotY = 50;
  let currentSpotX = 50;
  let currentSpotY = 50;

  let isTicking = false;

  const handleMouseMove = (e) => {
    const rect = section.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Calculate cursor distance from section center
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);

    // Exact 20% pressure displacement
    targetShiftX = relX * 0.20;
    targetShiftY = relY * 0.20;

    // Spotlight cursor follow position (percentage) with 20% pressure from center
    const normX = ((e.clientX - rect.left) / rect.width) * 100;
    const normY = ((e.clientY - rect.top) / rect.height) * 100;
    targetSpotX = 50 + (normX - 50) * 0.20;
    targetSpotY = 50 + (normY - 50) * 0.20;

    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(renderGradientPhysics);
    }
  };

  const handleMouseLeave = () => {
    // Gently relax back to baseline center position
    targetShiftX = 0;
    targetShiftY = 0;
    targetSpotX = 50;
    targetSpotY = 50;
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(renderGradientPhysics);
    }
  };

  const renderGradientPhysics = () => {
    // Smooth liquid inertia (lerp factor 0.055)
    currentShiftX += (targetShiftX - currentShiftX) * 0.055;
    currentShiftY += (targetShiftY - currentShiftY) * 0.055;
    currentSpotX += (targetSpotX - currentSpotX) * 0.055;
    currentSpotY += (targetSpotY - currentSpotY) * 0.055;

    section.style.setProperty('--mouse-shift-x', `${currentShiftX.toFixed(2)}px`);
    section.style.setProperty('--mouse-shift-y', `${currentShiftY.toFixed(2)}px`);
    section.style.setProperty('--mouse-spot-x', `${currentSpotX.toFixed(2)}%`);
    section.style.setProperty('--mouse-spot-y', `${currentSpotY.toFixed(2)}%`);

    const distShift = Math.abs(targetShiftX - currentShiftX) + Math.abs(targetShiftY - currentShiftY);
    const distSpot = Math.abs(targetSpotX - currentSpotX) + Math.abs(targetSpotY - currentSpotY);

    if (distShift > 0.05 || distSpot > 0.05) {
      requestAnimationFrame(renderGradientPhysics);
    } else {
      isTicking = false;
    }
  };

  section.addEventListener('mousemove', handleMouseMove, { passive: true });
  section.addEventListener('mouseleave', handleMouseLeave, { passive: true });
});
