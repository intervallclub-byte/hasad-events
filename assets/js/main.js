/* HASAD Events — interactions */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const P = 'assets/img/photos/';

/* ---------------- project data (gallery modal) ---------------- */
const PROJECTS = {
  gatsby: {
    tag: 'Собственный проект HASAD',
    title: 'The Great Gatsby',
    text: 'Тематический вечер в эстетике эпохи Великого Гэтсби: атмосферное оформление и музыкальная концепция. Первый проект HASAD Events — Dream Bar, около 150 гостей.',
    photos: [
      ['gatsby-masks', 'Гости в масках и образах 1920-х на вечере The Great Gatsby'],
      ['gatsby-poster', 'Промо-афиша The Great Gatsby party — HASAD x Dream Bar'],
    ],
  },
  twilight: {
    tag: 'Собственный проект HASAD',
    title: 'Twilight — Сумерки',
    text: 'Тематическая вечеринка в атмосфере и эстетике известной истории.',
    photos: [
      ['twilight-cast', 'Герои вечеринки Twilight в образах'],
      ['twilight-bat-girl', 'Героиня с бейсбольной битой — образ в эстетике Twilight'],
      ['twilight-bat-boy', 'Герой с битой — образ в эстетике Twilight'],
    ],
  },
  '90s': {
    tag: 'Собственный проект HASAD',
    title: '90s Party',
    text: 'Вечеринка в стиле 1990-х: музыка и визуал той эпохи.',
    photos: [
      ['90s-dream-wide', 'Танцпол 90s Party с лазерами и диско-шаром'],
      ['90s-neon-duo', 'Гостьи в неоновых повязках и образах 90-х'],
      ['90s-photowall', 'Фотостена Disco Party в стиле 90-х'],
      ['90s-trio', 'Гостьи 90s Party'],
      ['90s-dancefloor', 'Гости танцуют под хрустальными люстрами'],
      ['90s-straws', 'Гостьи 90s Party у бара'],
      ['90s-promo-tv', 'Кадр промо-ролика в эстетике 90-х'],
    ],
  },
  barbie: {
    tag: 'По заказу клиента',
    title: 'Barbie Dream Party',
    text: 'Вечеринка в эстетике Barbie с яркой визуальной концепцией.',
    photos: [
      ['barbie-box-color', 'Гостьи в фотозоне-коробке Barbie Party'],
      ['barbie-dancefloor', 'Танцпол Barbie Dream Party в розовых тонах'],
      ['barbie-box-decor', 'Фотозона-коробка Barbie Party с шарами'],
      ['barbie-box-guest', 'Гостья в фотозоне Barbie Party'],
      ['barbie-tanin-crowd', 'Гостьи на танцполе Barbie Dream Party'],
      ['barbie-card', 'Интерактив: карточка-роль «Барби парикмахер»'],
      ['barbie-box-bw', 'Чёрно-белый кадр из фотозоны Barbie Party'],
    ],
  },
  halloween: {
    tag: 'По заказу клиента',
    title: 'Halloween Party',
    text: 'Атмосфера Хэллоуина: тематическое оформление и развлекательная программа.',
    photos: [
      ['halloween-decor', 'Тематический декор Halloween у неоновой вывески'],
      ['halloween-cast', 'Гости в образах на Halloween Party'],
      ['halloween-devils', 'Шоу-программа: танцовщицы с рожками'],
      ['halloween-group', 'Гости Halloween Party у фотозоны'],
      ['halloween-dance', 'Танцы на Halloween Party'],
      ['halloween-red', 'Гости Halloween Party'],
      ['halloween-duo', 'Гости в тематических образах'],
    ],
  },
  italiana: {
    tag: 'По заказу клиента',
    title: 'Notte Italiana',
    text: 'Итальянский вечер в Sky Lounge: специальное меню, фотозона и депозитное бронирование столов.',
    photos: [
      ['italiana-lemon-arch', 'Фотозона-арка из лимонов и зелени'],
      ['italiana-prep', 'Подготовка оформления Sky Lounge'],
    ],
  },
  glamour: {
    tag: 'По заказу клиента',
    title: 'Glamour Party',
    text: 'Вечеринка в эстетике гламурных 2000-х годов.',
    photos: [['glamour-poster', 'Промо-афиша Glamour 2007']],
  },
  valentine: {
    tag: 'По заказу клиента',
    title: 'Valentine’s Day',
    text: 'Специальное мероприятие ко Дню всех влюблённых.',
    photos: [['valentine-hearts', 'Композиция из красных шаров-сердец']],
  },
  jazz: {
    tag: 'По заказу клиента',
    title: 'Jazz Evenings',
    text: 'Музыкальные вечера с джазовой атмосферой и особым форматом.',
    type: ['Jazz', 'torus'],
  },
  vegas: {
    tag: 'По заказу клиента',
    title: 'Bachelor Party in Vegas',
    text: 'Мероприятие в стилистике и атмосфере Лас-Вегаса.',
    type: ['Vegas', 'chrome'],
  },
  queens: {
    tag: 'По заказу клиента',
    title: 'Girls Queens Never Cry',
    text: 'Тематическое мероприятие для женской аудитории с собственной концепцией.',
    type: ['Queens', 'drops'],
  },
  football: {
    tag: 'По заказу клиента',
    title: 'Football World Cup Event',
    text: 'Трансляция матчей чемпионата мира по футболу и развлекательная программа для гостей.',
    type: ['World Cup', 'pinkchrome'],
  },
};


/* ---------------- header / menu ---------------- */
const hdr = $('#hdr');
const burger = $('.hdr__burger');
const menu = $('#menu');
// the header stays pinned at the top; it only gets a solid backdrop once the page is scrolled
let scrolled = null;
function onScroll() {
  const next = window.scrollY > 30;
  if (next !== scrolled) {
    scrolled = next;
    hdr.classList.toggle('is-scrolled', next);
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  menu.setAttribute('aria-hidden', String(!open));
}
burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
$$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

/* active nav link */
const navLinks = $$('.hdr__nav a');
const navIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === '#' + e.target.id));
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);
['about', 'services', 'formats', 'projects', 'approach', 'process', 'contact'].forEach((id) => {
  const el = document.getElementById(id);
  el && navIO.observe(el);
});

/* ---------------- hero montage ---------------- */
(function heroReel() {
  const imgs = $$('.hero__reel img');
  if (imgs.length < 2 || reduced) return;
  let i = 0;
  const load = (img) => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  };
  window.addEventListener('load', () => imgs.slice(1, 3).forEach(load), { once: true });
  setInterval(() => {
    if (document.hidden) return;
    const next = (i + 1) % imgs.length;
    load(imgs[next]);
    load(imgs[(next + 1) % imgs.length]);
    const go = () => {
      imgs[i].classList.remove('is-active');
      imgs[next].classList.add('is-active');
      i = next;
    };
    imgs[next].complete ? go() : imgs[next].addEventListener('load', go, { once: true });
  }, 4200);
})();

/* ---------------- chrome logo: tilt + pink glint follows pointer ---------------- */
(function logoTilt() {
  const tilt = $('.logo3d__tilt');
  if (!tilt || reduced) return;
  let raf = 0;
  window.addEventListener(
    'pointermove',
    (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = tilt.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        tilt.style.setProperty('--ry', (x * 16).toFixed(2) + 'deg');
        tilt.style.setProperty('--rx', (-y * 12).toFixed(2) + 'deg');
        const gx = ((e.clientX - r.left) / r.width) * 100;
        const gy = ((e.clientY - r.top) / r.height) * 100;
        tilt.style.setProperty('--gx', Math.max(-20, Math.min(120, gx)).toFixed(1) + '%');
        tilt.style.setProperty('--gy', Math.max(-40, Math.min(140, gy)).toFixed(1) + '%');
      });
    },
    { passive: true }
  );
  // gentle motion on touch devices: tilt follows scroll a little
  if (!finePointer) {
    window.addEventListener(
      'scroll',
      () => {
        const p = Math.min(1, window.scrollY / window.innerHeight);
        tilt.style.setProperty('--rx', (p * 18).toFixed(2) + 'deg');
      },
      { passive: true }
    );
  }
})();

/* ---------------- 3D bubblegum + chrome (three.js, loaded lazily) ---------------- */
(function lazy3D() {
  const conn = navigator.connection;
  if (conn && (conn.saveData || /2g/.test(conn.effectiveType || ''))) return;
  const canTry = (() => {
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch (e) {
      return false;
    }
  })();
  if (!canTry) return;
  const boot = () =>
    import('./bubbles.js')
      .then(({ mountBubbles }) => {
        const small = window.innerWidth < 760;
        const hero = $('#hero-gl');
        if (hero) mountBubbles(hero, { preset: 'hero', maxDpr: small ? 1.5 : 1.75 });
        const contact = $('#contact-gl');
        if (contact) {
          const io = new IntersectionObserver(
            ([e]) => {
              if (!e.isIntersecting) return;
              io.disconnect();
              mountBubbles(contact, { preset: 'contact', maxDpr: small ? 1.5 : 1.75 });
            },
            { rootMargin: '300px' }
          );
          io.observe(contact);
        }
      })
      .catch(() => {});
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 250));
  if (document.readyState === 'complete') idle(boot);
  else window.addEventListener('load', () => idle(boot), { once: true });
})();

/* ---------------- reveal on scroll ---------------- */
const revealIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      revealIO.unobserve(e.target);
    });
  },
  { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
);
$$('[data-reveal]').forEach((el) => {
  // stagger siblings
  const sibs = [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal'));
  const idx = sibs.indexOf(el);
  if (idx > 0) el.style.transitionDelay = Math.min(idx, 6) * 70 + 'ms';
  revealIO.observe(el);
});

/* ---------------- intro: words light up while scrolling ---------------- */
(function wordsOnScroll() {
  const el = $('[data-words]');
  if (!el) return;
  const words = el.textContent.trim().split(/\s+/);
  const hl = new Set(['креативное', 'ивент-агентство']);
  el.innerHTML = words.map((w) => `<span class="w${hl.has(w) ? ' hl' : ''}">${w}</span>`).join(' ');
  const spans = $$('.w', el);
  if (reduced) {
    spans.forEach((s) => s.classList.add('on'));
    return;
  }
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
    const n = Math.round(p * spans.length);
    spans.forEach((s, i) => s.classList.toggle('on', i < n));
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
})();

/* ---------------- services tabs ---------------- */
(function tabs() {
  const tabs = $$('.svc__tab');
  const panels = $$('.svc__panel');
  if (!tabs.length) return;
  function select(i, focus) {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panels[j].classList.toggle('is-active', on);
      panels[j].hidden = false;
    });
    if (focus) tabs[i].focus();
    // keep the active chip visible on mobile
    const strip = tabs[i].parentElement;
    if (strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({ left: tabs[i].offsetLeft - 16, behavior: reduced ? 'auto' : 'smooth' });
    }
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      const k = e.key;
      if (['ArrowRight', 'ArrowDown'].includes(k)) { e.preventDefault(); select((i + 1) % tabs.length, true); }
      if (['ArrowLeft', 'ArrowUp'].includes(k)) { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
    });
  });
})();

/* ---------------- floating preview for formats (desktop) ---------------- */
(function formatsPreview() {
  const box = $('.fmt__preview');
  if (!box || !finePointer) return;
  const img = $('img', box);
  let x = 0, y = 0, tx = 0, ty = 0, raf = 0, active = false;
  const loop = () => {
    x += (tx - x) * 0.16;
    y += (ty - y) * 0.16;
    box.style.left = x + 'px';
    box.style.top = y + 'px';
    raf = active || Math.abs(tx - x) > 0.5 ? requestAnimationFrame(loop) : 0;
  };
  $$('.fmt__row').forEach((row) => {
    row.addEventListener('pointerenter', (e) => {
      img.src = row.dataset.preview;
      box.classList.toggle('is-3d', row.dataset.kind === '3d');
      box.classList.add('is-on');
      active = true;
      tx = x = e.clientX + 170;
      ty = y = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    row.addEventListener('pointermove', (e) => {
      tx = e.clientX + 170;
      ty = e.clientY;
    });
    row.addEventListener('pointerleave', () => {
      active = false;
      box.classList.remove('is-on');
    });
  });
})();

/* ---------------- venues: hover / tap switches the photo ---------------- */
(function venues() {
  const items = $$('.vlist li');
  const view = $('.venues__view');
  if (!items.length || !view) return;
  const img = $('img', view);
  const show = (li) => {
    items.forEach((x) => x.classList.toggle('is-on', x === li));
    if (img.getAttribute('src') === li.dataset.preview) return;
    img.style.opacity = 0;
    setTimeout(() => {
      img.src = li.dataset.preview;
      view.classList.toggle('is-3d', li.dataset.kind === '3d');
      img.onload = () => (img.style.opacity = 1);
    }, 180);
  };
  items.forEach((li) => {
    li.addEventListener('pointerenter', () => show(li));
    li.addEventListener('click', () => show(li));
  });
  show(items[1]);
})();

/* ---------------- process: progress line + active step ---------------- */
(function process() {
  const list = $('.steps');
  if (!list) return;
  const steps = $$('.step', list);
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = list.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height));
    list.style.setProperty('--p', p.toFixed(3));
    steps.forEach((s) => {
      const sr = s.getBoundingClientRect();
      s.classList.toggle('is-active', sr.top < vh * 0.62);
    });
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

/* ---------------- projects: filter + gallery modal ---------------- */
(function projects() {
  const cards = $$('.pcard');
  const chips = $$('.filters .chip');
  chips.forEach((chip) =>
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => {
        c.classList.toggle('is-on', c === chip);
        c.setAttribute('aria-pressed', String(c === chip));
      });
      cards.forEach((card) => {
        const show = f === 'all' || card.dataset.cat === f;
        card.classList.toggle('is-hidden', !show);
        if (show) card.classList.add('is-in');
      });
    })
  );

  // photo counters on cards
  cards.forEach((card) => {
    const p = PROJECTS[card.dataset.id];
    const c = $('.pcard__count', card);
    if (p && p.photos && c) c.textContent = `· ${p.photos.length} фото`;
  });

  const modal = $('#modal');
  const track = $('.modal__track', modal);
  const thumbs = $('.modal__thumbs', modal);
  const count = $('.modal__count', modal);
  const prev = $('.modal__nav--prev', modal);
  const next = $('.modal__nav--next', modal);
  let idx = 0, total = 0, lastFocus = null, currentId = null;

  function go(i) {
    if (!total) return;
    idx = (i + total) % total;
    track.style.transform = `translateX(${-idx * 100}%)`;
    count.textContent = total > 1 ? `${idx + 1} / ${total}` : '';
    $$('button', thumbs).forEach((b, j) => b.classList.toggle('is-on', j === idx));
    const active = thumbs.children[idx];
    active && active.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }

  function open(id) {
    const p = PROJECTS[id];
    if (!p) return;
    currentId = id;
    lastFocus = document.activeElement;
    $('.modal__tag', modal).textContent = p.tag;
    $('.modal__title', modal).textContent = p.title;
    $('.modal__text', modal).textContent = p.text;
    track.innerHTML = '';
    thumbs.innerHTML = '';
    if (p.photos) {
      p.photos.forEach(([name, alt], j) => {
        const slide = document.createElement('div');
        slide.innerHTML = `<img src="${P}${name}-lg.webp" alt="${alt}" ${j > 1 ? 'loading="lazy"' : ''} decoding="async">`;
        track.appendChild(slide);
        if (p.photos.length > 1) {
          const b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('aria-label', `Фото ${j + 1}`);
          b.innerHTML = `<img src="${P}${name}-sm.webp" alt="" loading="lazy">`;
          b.addEventListener('click', () => go(j));
          thumbs.appendChild(b);
        }
      });
      total = p.photos.length;
    } else {
      const [word, obj] = p.type;
      const slide = document.createElement('div');
      slide.innerHTML = `<div class="modal__type"><span>${word}</span><img src="assets/img/3d/${obj}.webp" alt=""></div>`;
      track.appendChild(slide);
      total = 1;
    }
    prev.hidden = next.hidden = total < 2;
    track.style.transition = 'none';
    go(0);
    requestAnimationFrame(() => (track.style.transition = ''));
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (location.hash !== '#project-' + id) history.replaceState(null, '', '#project-' + id);
    setTimeout(() => $('.modal__close', modal).focus(), 60);
  }

  function close() {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (location.hash.startsWith('#project-')) history.replaceState(null, '', location.pathname + location.search);
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
    currentId = null;
  }

  cards.forEach((card) => {
    if (!PROJECTS[card.dataset.id]) return;
    card.addEventListener('click', () => open(card.dataset.id));
  });
  $$('[data-close]', modal).forEach((el) => el.addEventListener('click', close));
  prev.addEventListener('click', () => go(idx - 1));
  next.addEventListener('click', () => go(idx + 1));
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') go(idx + 1);
    if (e.key === 'ArrowLeft') go(idx - 1);
    if (e.key === 'Tab') {
      const f = $$('button:not([hidden]), a[href]', modal).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  // swipe
  const stage = $('.modal__stage', modal);
  let sx = 0, sy = 0, dragging = false;
  stage.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; dragging = true; }, { passive: true });
  stage.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(idx + (dx < 0 ? 1 : -1));
  });

  // deep link: #project-gatsby opens the gallery
  const fromHash = () => {
    const m = location.hash.match(/^#project-(.+)$/);
    if (m && PROJECTS[m[1]] && currentId !== m[1]) open(m[1]);
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();

/* ---------------- lead form → WhatsApp ---------------- */
(function leadForm() {
  const form = $('#lead-form');
  if (!form) return;
  const status = $('.form__status', form);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    let ok = true;
    ['name', 'phone', 'type'].forEach((n) => {
      const field = form.elements[n].closest('.field');
      const bad = !String(data[n] || '').trim() || (n === 'phone' && String(data[n]).replace(/\D/g, '').length < 7);
      field.classList.toggle('is-error', bad);
      if (bad) ok = false;
    });
    if (!ok) {
      status.textContent = 'Пожалуйста, укажите имя, телефон и тип мероприятия.';
      const firstBad = $('.field.is-error input, .field.is-error select', form);
      firstBad && firstBad.focus();
      return;
    }
    const lines = [
      'Здравствуйте! Заявка на мероприятие с сайта HASAD Events.',
      '',
      `Имя: ${data.name.trim()}`,
      `Телефон: ${data.phone.trim()}`,
      `Тип мероприятия: ${data.type}`,
    ];
    if (data.budget && data.budget.trim()) lines.push(`Примерный бюджет: ${data.budget.trim()}`);
    if (data.comment && data.comment.trim()) lines.push(`Комментарий: ${data.comment.trim()}`);
    const url = 'https://wa.me/992980889431?text=' + encodeURIComponent(lines.join('\n'));
    const w = window.open(url, '_blank');
    if (w) {
      try { w.opener = null; } catch (err) {}
    }
    status.innerHTML = '';
    status.append(
      document.createTextNode(w ? 'WhatsApp открыт в новой вкладке — нажмите там «Отправить». Если он не открылся: ' : 'Нажмите, чтобы отправить заявку в WhatsApp: ')
    );
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'открыть WhatsApp';
    status.append(link);
  });
  $$('input, select', form).forEach((el) =>
    el.addEventListener('input', () => el.closest('.field').classList.remove('is-error'))
  );
})();

/* ---------------- mobile dock ---------------- */
(function dock() {
  const d = $('#dock');
  const hero = $('.hero');
  const contact = $('#contact');
  if (!d) return;
  let inHero = true, inContact = false;
  const sync = () => d.classList.toggle('is-on', !inHero && !inContact);
  new IntersectionObserver(([e]) => { inHero = e.isIntersecting; sync(); }, { threshold: 0.15 }).observe(hero);
  new IntersectionObserver(([e]) => { inContact = e.isIntersecting; sync(); }, { threshold: 0.05 }).observe(contact);
})();
