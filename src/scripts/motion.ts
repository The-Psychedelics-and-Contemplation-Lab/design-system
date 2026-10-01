// Reveal-on-scroll and light parallax. Loaded once by <Layout>.
// Does nothing when the user prefers reduced motion.
const mq = window.matchMedia('(prefers-reduced-motion: no-preference)');
document.documentElement.classList.add('js');

function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('.reveal, .reveal-group');
  if (!els.length) return;
  if (!mq.matches || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-visible')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  els.forEach((e) => io.observe(e));
}

function initParallax() {
  const els = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  if (!els.length || !mq.matches) return;
  const wide = window.matchMedia('(min-width: 60em)');
  let ticking = false;
  const update = () => {
    ticking = false;
    if (!wide.matches) { els.forEach((e) => (e.style.transform = '')); return; }
    const vh = window.innerHeight;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const speed = parseFloat(el.dataset.parallax || '0.15');
      const centre = r.top + r.height / 2 - vh / 2;        // distance from viewport centre
      const y = Math.max(-120, Math.min(120, -centre * speed));
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

initReveal();
initParallax();
