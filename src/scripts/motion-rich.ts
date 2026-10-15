// "Rich" motion layer (GSAP). Loaded only by sites that set site.motion = 'rich'.
// Everything here is decorative and opt-in per element through data attributes / classes:
//   [data-mouse-scene] containing [data-mouse-depth="0.6"]  → elements drift with the cursor (±depth × 18 px)
//   .reveal-chars                                          → heading revealed letter by letter (blur → sharp)
//   .watermark[data-bloom]                                 → the dots of the motif bloom outward when it enters
//                                                            the viewport and the motif turns slowly with the scroll
//   [data-tilt]                                            → card tilts towards the cursor with a soft spotlight
// Nothing runs when the visitor prefers reduced motion. Idempotent: safe to run again after a view transition.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const fine = window.matchMedia('(hover: hover) and (pointer: fine)');

function mouseScenes() {
  document.querySelectorAll<HTMLElement>('[data-mouse-scene]').forEach((scene) => {
    if (scene.dataset.mouseReady || !fine.matches) return; scene.dataset.mouseReady = '1';
    const layers = [...scene.querySelectorAll<HTMLElement>('[data-mouse-depth]')].map((el) => ({
      el, depth: parseFloat(el.dataset.mouseDepth || '0.5'),
      x: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3.out' }),
    }));
    const amp = parseFloat(scene.dataset.mouseScene || '18');
    const move = (e: MouseEvent) => {
      const r = scene.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach((l) => { l.x(nx * amp * l.depth); l.y(ny * amp * l.depth); });
    };
    scene.addEventListener('mousemove', move, { passive: true });
    scene.addEventListener('mouseleave', () => layers.forEach((l) => { l.x(0); l.y(0); }));
  });
}

function charReveals() {
  document.querySelectorAll<HTMLElement>('.reveal-chars').forEach((el) => {
    if (el.dataset.charsReady) return; el.dataset.charsReady = '1';
    const delay = parseFloat(getComputedStyle(el).getPropertyValue('--reveal-delay')) / 1000 || 0;
    const split = SplitText.create(el, { type: 'chars,words', charsClass: 'ch', wordsClass: 'wd', aria: 'auto' });
    gsap.set(el, { visibility: 'visible' });
    gsap.from(split.chars, {
      opacity: 0, y: '0.35em', filter: 'blur(10px)', duration: 0.9, ease: 'power3.out',
      stagger: { each: 0.028, from: 'start' }, delay,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

function watermarkBlooms() {
  document.querySelectorAll<HTMLElement>('.watermark[data-bloom]').forEach((wm) => {
    if (wm.dataset.bloomReady) return; wm.dataset.bloomReady = '1';
    const svg = wm.querySelector('svg'); if (!svg) return;
    const dots = [...svg.querySelectorAll('circle')];
    const section = wm.parentElement || wm;
    // the dots are generated centre-first, so DOM order is radial order: a stagger "from the start" blooms outward
    gsap.from(dots, {
      scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 1.2, ease: 'power2.out',
      stagger: { each: 2.4 / Math.max(dots.length, 1), from: 'start' },
      scrollTrigger: { trigger: section, start: 'top 80%', once: true },
    });
    gsap.to(svg, {
      rotation: parseFloat(wm.dataset.bloom || '28'), transformOrigin: '50% 50%', ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
    });
  });
}

function tilts() {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    if (card.dataset.tiltReady || !fine.matches) return; card.dataset.tiltReady = '1';
    const max = parseFloat(card.dataset.tilt || '5');
    // Set up on the first hover only: the card may still be playing its CSS entrance (translateY) when the
    // page loads, and an inline transform written then would freeze it mid-way.
    let rx: ReturnType<typeof gsap.quickTo> | undefined, ry: ReturnType<typeof gsap.quickTo> | undefined;
    const arm = () => {
      if (rx) return;
      gsap.set(card, { transformPerspective: 900, transformOrigin: '50% 50%', x: 0, y: 0, rotationX: 0, rotationY: 0 });
      rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power2.out' });
      ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power2.out' });
    };
    card.addEventListener('mouseenter', arm);
    card.addEventListener('mousemove', (e) => {
      arm(); if (!rx || !ry) return;
      const r = card.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height;
      rx((0.5 - ny) * max * 2); ry((nx - 0.5) * max * 2);
      card.style.setProperty('--mx', `${(nx * 100).toFixed(1)}%`); card.style.setProperty('--my', `${(ny * 100).toFixed(1)}%`);
      card.classList.add('is-lit');
    }, { passive: true });
    card.addEventListener('mouseleave', () => { rx?.(0); ry?.(0); card.classList.remove('is-lit'); });
  });
}

function init() {
  if (reduce.matches) {
    document.querySelectorAll<HTMLElement>('.reveal-chars').forEach((el) => { el.style.visibility = 'visible'; });
    return;
  }
  mouseScenes(); charReveals(); watermarkBlooms(); tilts();
  ScrollTrigger.refresh();
}
init();
document.addEventListener('astro:after-swap', () => { ScrollTrigger.getAll().forEach((t) => t.kill()); init(); });
window.addEventListener('load', () => ScrollTrigger.refresh());
