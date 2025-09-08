
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1) REVEAL AO ROLAR ---------- */
  const toReveal = [
    ...document.querySelectorAll('.cat'),
    ...document.querySelectorAll('.card'),
    ...document.querySelectorAll('.item')
  ];
  toReveal.forEach((el, i) => {
    el.classList.add('reveal');
    el.dataset.stagger = '';
    el.style.setProperty('--i', i % 12); // leve “stagger”
  });

  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    toReveal.forEach(el => io.observe(el));
  } else {
    // Sem animação: mostra tudo
    toReveal.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- 2) RIPPLE DISCRETO ---------- */
  const rippleTargets = [
    ...document.querySelectorAll('.btn, .icon-btn, .choose, .cat')
  ];
  rippleTargets.forEach(btn => {
    btn.classList.add('ripple');
    btn.addEventListener('click', (ev) => {
      if (reduced) return;
      const r = document.createElement('span');
      r.className = 'r';
      const rect = btn.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      r.style.left = x + 'px';
      r.style.top  = y + 'px';
      btn.appendChild(r);
      r.addEventListener('animationend', () => r.remove(), { once:true });
    });
  });

  /* ---------- 3) BOTÃO “ESCOLHER” COM CHECK ---------- */
  const chooseBtns = document.querySelectorAll('.choose');
  const nextBtn = document.getElementById('next');
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  function updateNext() {
    if (!nextBtn) return;
    const any = document.querySelectorAll('.choose.is-on').length > 0;
    nextBtn.disabled = !any;
  }

  chooseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const on = btn.classList.toggle('is-on');
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.innerHTML = on ? (CHECK + 'Escolhido') : 'Escolher';
      if (!reduced) {
        btn.animate([
          { transform:'scale(.96)' }, { transform:'scale(1)' }
        ], { duration:160, easing:'cubic-bezier(.22,1,.36,1)' });
      }
      updateNext();
    });
  });
  updateNext();

  /* ---------- 4) PARALLAX SUAVE NO HERO ---------- */
  const hero = document.querySelector('.hero');
  const copy = hero?.querySelector('.copy');
  if (!reduced && hero && copy) {
    const onScroll = () => {
      const rect = hero.getBoundingClientRect();
      const vh = Math.max(window.innerHeight, 1);
      // progresso de -1 a 1 (quanto o hero está visível)
      const p = Math.max(-1, Math.min(1, 1 - (rect.top / vh)));
      const y = p * -10; // px
      const op = 0.9 + (p * 0.1);
      copy.style.transform = `translateY(${y}px)`;
      copy.style.opacity = op.toFixed(3);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
  }

  /* ---------- 5) TRANSIÇÃO DE PÁGINA ---------- */
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);

  function isInternal(href){
    try {
      const u = new URL(href, location.href);
      return u.origin === location.origin;
    } catch { return false; }
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || a.target === '_blank' || !isInternal(href)) return;
    if (reduced) return; // sem efeito
    e.preventDefault();
    overlay.classList.add('is-on');
    setTimeout(() => (location.href = href), 220);
  });

})();

