// Reveal-on-scroll and light parallax. Loaded once by <Layout>.
// Does nothing when the user prefers reduced motion.
const mq = window.matchMedia('(prefers-reduced-motion: no-preference)');
document.documentElement.classList.add('js');

function splitWords() {
  document.querySelectorAll<HTMLElement>('.reveal-words').forEach((el) => {
    if (el.dataset.split) return; el.dataset.split = '1';
    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        (node.textContent || '').split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const w = document.createElement('span'); w.className = 'w'; w.textContent = part; frag.appendChild(w);
        });
        node.parentNode?.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE && !(node as Element).classList.contains('w')) {
        [...node.childNodes].forEach(walk);
      }
    };
    [...el.childNodes].forEach(walk);
    el.querySelectorAll<HTMLElement>('.w').forEach((w, i) => w.style.setProperty('--i', String(i)));
  });
}

function initReveal() {
  splitWords();
  const els = document.querySelectorAll<HTMLElement>('.reveal, .reveal-group, .reveal-words');
  if (!els.length) return;
  if (!mq.matches || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-visible')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  els.forEach((e) => io.observe(e));
  // Safety net: anything in the first viewport becomes visible even if the
  // observer never fires (background tab, print, old browsers).
  const forceAboveFold = () => els.forEach((e) => { const r = e.getBoundingClientRect(); if (r.top < window.innerHeight * 1.2) e.classList.add('is-visible'); });
  setTimeout(forceAboveFold, 2500);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) forceAboveFold(); });
}

function initParallax() {
  const els = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  if (!els.length || !mq.matches) return;
  const wide = window.matchMedia('(min-width: 60em)');
  // Natural (untransformed) page position and height of every element, measured on load and
  // resize only. The scroll handler then never reads layout: it works from scrollY and these
  // numbers, and only writes transforms, so each frame is a compositor-only update.
  const geo = new Map<HTMLElement, { top: number; height: number }>();
  const measure = () => {
    els.forEach((el) => { el.style.transform = ''; });
    els.forEach((el) => { const r = el.getBoundingClientRect(); geo.set(el, { top: r.top + window.scrollY, height: r.height }); });
  };
  let ticking = false;
  let lastY = -1;
  const update = () => {
    ticking = false;
    if (!wide.matches) { els.forEach((e) => (e.style.transform = '')); return; }
    const y = window.scrollY;
    if (y === lastY) return;
    lastY = y;
    const vh = window.innerHeight;
    for (const el of els) {
      const g = geo.get(el); if (!g) continue;
      const top = g.top - y;                                   // natural position in the viewport
      if (top + g.height < -300 || top > vh + 300) continue;
      const speed = parseFloat(el.dataset.parallax || '0.15');
      const max = parseFloat(el.dataset.parallaxMax || '120');   // px clamp, per element
      // origin "top": distance scrolled since the element's natural top reached the viewport top (0 at page top)
      // otherwise: the element's natural centre relative to the viewport centre
      const ref = el.dataset.parallaxOrigin === 'top' ? Math.min(0, top) : (top + g.height / 2 - vh / 2);
      const t = Math.max(-max, Math.min(max, -ref * speed));
      el.style.transform = `translate3d(0, ${t.toFixed(2)}px, 0)`;
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  const remeasure = () => { measure(); lastY = -1; onScroll(); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', remeasure);
  window.addEventListener('load', remeasure);
  document.fonts?.ready.then(remeasure);
  measure();
  update();
}

initReveal();
initParallax();
