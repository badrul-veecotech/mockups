/**
 * Auto-City Activities Parallax Engine (Full Page Scroll Journey Architecture)
 * -----------------------------------------------------------------------------
 * 1. 500vh Native Scroll Journey Track:
 *    - The section is a continuous 500vh track in the page document (100vh per activity).
 *    - To scroll to the next section (Instagram Reels), users MUST scroll through all 5
 *      parallax activities in sequence (Mini Zoo -> River Cruise -> Fun Fair -> Mangrove -> Pickleball).
 *    - To return to the previous section (4 Pillars), users MUST scroll all the way back
 *      up through all 5 activities in reverse (Pickleball -> Mangrove -> Fun Fair -> River Cruise -> Mini Zoo).
 *    - It is physically impossible to skip the activities because they occupy real DOM scroll depth.
 *
 * 2. Sticky Viewport Stage:
 *    - The inner stage is position: sticky; top: 0; height: 100vh;.
 *    - The viewport remains pinned on screen while page scroll advances the dual-plane parallax.
 *
 * 3. Parallax Physics & In-Place Transitions:
 *    - Background photography moves at 60% vertical parallax.
 *    - Centered headlines move at 100% vertical parallax with -60 split offset.
 *    - Bottom editorial synopsis & CTA buttons perform a silky in-place fade.
 *    - Gentle magnetic snap settles slides cleanly into full focus when scrolling pauses.
 */

document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('activitiesParallaxSection');
  const container = document.querySelector('.activities-parallax-section .swiper');
  const bottomItems = document.querySelectorAll('.activities-parallax-section .banner-bottom-item');
  if (!section || !container || typeof Swiper === 'undefined') return;

  // Initialize Swiper with parallax support
  const swiper = new Swiper(container, {
    direction: 'vertical',
    slidesPerView: 1,
    speed: 0, // Direct scroll scrubbing for instant tactile response
    parallax: true,
    resistanceRatio: 0,
    allowTouchMove: false, // Driven purely by page scroll
    grabCursor: false,
    mousewheel: false,
    keyboard: false,
    touchReleaseOnEdges: false
  });

  const numSlides = swiper.slides.length;
  const numTransitions = numSlides - 1; // 4 transitions between 5 slides

  // Update bottom bar active item (triggers CSS in-place fade)
  let currentActiveIndex = 0;
  const updateBottomBar = (index) => {
    if (index === currentActiveIndex) return;
    currentActiveIndex = index;
    bottomItems.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  };

  // Main scroll driver
  const updateParallax = () => {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const maxScroll = section.offsetHeight - vh;
    if (maxScroll <= 0) return;

    // Calculate normalized scroll progress through the 500vh track (0.0 to 1.0)
    const currentScroll = -rect.top;
    const progress = Math.max(0, Math.min(1, currentScroll / maxScroll));

    // Map progress directly to slide offset (0.0 to 4.0)
    const exactPos = progress * numTransitions;

    // Update Swiper vertical translation & internal parallax transforms
    const targetTranslate = -exactPos * vh;
    swiper.setTranslate(targetTranslate);
    swiper.updateProgress();

    // Update active bottom bar item with threshold hysteresis for clean transitions
    const activeIdx = Math.min(numTransitions, Math.floor(exactPos + 0.5));
    updateBottomBar(activeIdx);
  };

  // Gentle magnetic snap when scrolling pauses inside the section
  let snapTimeout = null;
  const scheduleSnap = () => {
    clearTimeout(snapTimeout);
    snapTimeout = setTimeout(() => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const maxScroll = section.offsetHeight - vh;

      // Only snap if user is well inside the sticky track (not near top or bottom exit boundaries)
      if (rect.top < -40 && rect.bottom > vh + 40) {
        const currentScroll = -rect.top;
        const progress = currentScroll / maxScroll;
        const exactPos = progress * numTransitions;
        const nearestSlide = Math.round(exactPos);
        const targetScrollY = section.offsetTop + (nearestSlide / numTransitions) * maxScroll;

        // If not already resting within 15px of the exact slide target, smoothly glide to it
        if (Math.abs(window.scrollY - targetScrollY) > 15) {
          window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
          });
        }
      }
    }, 220);
  };

  // Bind passive window scroll listeners
  window.addEventListener(
    'scroll',
    () => {
      updateParallax();
      scheduleSnap();
    },
    { passive: true }
  );

  window.addEventListener('resize', updateParallax, { passive: true });

  // Initial calculation on load
  updateParallax();
});

