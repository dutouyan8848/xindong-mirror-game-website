const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (header) {
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 20), { passive: true });
}

if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    mobileMenu.classList.toggle('open', !open);
  });

  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
  }));
}

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(item => {
    item.classList.remove('active');
    item.setAttribute('aria-selected', 'false');
  });
  button.classList.add('active');
  button.setAttribute('aria-selected', 'true');
  document.querySelectorAll('.game-card').forEach(card => {
    card.classList.toggle('hidden', button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter);
  });
}));

const hero = document.querySelector('.hero');
const heroSlides = [...document.querySelectorAll('.hero-slide')];
const heroDots = [...document.querySelectorAll('.hero-dot')];
const heroContent = document.querySelector('.hero-content');
const heroKicker = document.querySelector('[data-slide-kicker]');
const heroTitle = document.querySelector('[data-slide-title]');
const heroCopy = document.querySelector('[data-slide-copy]');
const heroCurrent = document.querySelector('.hero-count b');
const heroPause = document.querySelector('.hero-pause');
const heroStories = [
  { kicker: 'TRUSTED ENTERTAINMENT', title: 'Classic games.<br><em>Made welcoming.</em>', copy: 'Enjoy trusted casino classics, straightforward rewards and friendly support whenever you need it.' },
  { kicker: 'SLOTS FOR EVERY PACE', title: 'More choice.<br><em>Simple to explore.</em>', copy: 'Browse familiar favourites and new releases, with clear game information before you play.' },
  { kicker: 'PERSONAL VIP SERVICE', title: 'Rewards that<br><em>fit the way you play.</em>', copy: 'Access personal support, clearly explained benefits and considered rewards across five membership levels.' },
  { kicker: 'WELCOME OFFER', title: 'Start with<br><em>everything made clear.</em>', copy: 'See the available bonus, wagering requirements and regional terms before you decide to take part.' }
];
let heroIndex = 0;
let heroTimer;
let touchStartX = 0;
let heroPaused = false;

function showHeroSlide(nextIndex, manual = false) {
  const target = (nextIndex + heroSlides.length) % heroSlides.length;
  if (target === heroIndex) return;
  heroContent.classList.remove('is-changing');
  void heroContent.offsetWidth;
  heroContent.classList.add('is-changing');
  heroSlides.forEach((slide, index) => slide.classList.toggle('active', index === target));
  heroDots.forEach((dot, index) => {
    dot.classList.toggle('active', index === target);
    dot.setAttribute('aria-selected', String(index === target));
  });
  window.setTimeout(() => {
    heroKicker.textContent = heroStories[target].kicker;
    heroTitle.innerHTML = heroStories[target].title;
    heroCopy.textContent = heroStories[target].copy;
    heroCurrent.textContent = String(target + 1).padStart(2, '0');
  }, 260);
  heroContent.setAttribute('aria-live', manual ? 'polite' : 'off');
  heroIndex = target;
}

function startHeroCarousel() {
  clearInterval(heroTimer);
  if (!heroPaused && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroTimer = setInterval(() => showHeroSlide(heroIndex + 1), 7000);
  }
}

if (hero && heroSlides.length && heroContent && heroKicker && heroTitle && heroCopy && heroCurrent && heroPause) {
  heroPause.addEventListener('click', () => {
    heroPaused = !heroPaused;
    heroPause.setAttribute('aria-pressed', String(heroPaused));
    heroPause.setAttribute('aria-label', heroPaused ? 'Play slideshow' : 'Pause slideshow');
    heroPause.textContent = heroPaused ? 'Play' : 'Pause';
    startHeroCarousel();
  });

  document.querySelector('.hero-prev').addEventListener('click', () => { showHeroSlide(heroIndex - 1, true); startHeroCarousel(); });
  document.querySelector('.hero-next').addEventListener('click', () => { showHeroSlide(heroIndex + 1, true); startHeroCarousel(); });
  heroDots.forEach((dot, index) => dot.addEventListener('click', () => { showHeroSlide(index, true); startHeroCarousel(); }));
  hero.addEventListener('mouseenter', () => clearInterval(heroTimer));
  hero.addEventListener('mouseleave', startHeroCarousel);
  hero.addEventListener('focusin', () => clearInterval(heroTimer));
  hero.addEventListener('focusout', startHeroCarousel);
  hero.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', event => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 50) showHeroSlide(heroIndex + (distance < 0 ? 1 : -1), true);
    startHeroCarousel();
  }, { passive: true });
  document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(heroTimer) : startHeroCarousel());
  startHeroCarousel();
}

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
