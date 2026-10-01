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
  const tops = new Map<HTMLElement, number>();
  const measure = () => els.forEach((el) => { const t = el.style.transform; el.style.transform = ''; tops.set(el, el.getBoundingClientRect().top + window.scrollY); el.style.transform = t; });
  measure();
  let ticking = false;
  const update = () => {
    ticking = false;
    if (!wide.matches) { els.forEach((e) => (e.style.transform = '')); return; }
    const vh = window.innerHeight;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const speed = parseFloat(el.dataset.parallax || '0.15');
      const max = parseFloat(el.dataset.parallaxMax || '120');   // px clamp, per element
      // origin "top": measure from the element's natural top (for things that start in view)
      // "top": distance scrolled since the element's natural top reached the viewport top (0 at page top)
      const ref = el.dataset.parallaxOrigin === 'top' ? Math.min(0, (tops.get(el) ?? 0) - window.scrollY) : (r.top + r.height / 2 - vh / 2);
      const y = Math.max(-max, Math.min(max, -ref * speed));
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measure(); onScroll(); });
  window.addEventListener('load', () => { measure(); onScroll(); });
  update();
}

initReveal();
initParallax();
