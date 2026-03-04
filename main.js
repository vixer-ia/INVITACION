/* =========================
   PARALLAX FONDO (desplaza el fondo con scroll)
========================= */
(function bgParallax(){
  const root = document.documentElement;

  function onScroll(){
    const y = window.scrollY || 0;
    // Ajusta la intensidad aquí si quieres más movimiento
    const shift = Math.max(y * -0.18, -260); // límite para que no se destape abajo
    root.style.setProperty('--bgShift', `${shift}px`);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* =========================
   AUDIO PLAYER (play/pause + barra)
========================= */
(function player(){
  const audio = document.getElementById('audio');
  const playBtn = document.getElementById('playBtn');
  const progress = document.getElementById('progress');
  const curTime = document.getElementById('curTime');
  const durTime = document.getElementById('durTime');

  if(!audio || !playBtn || !progress) return;

  function fmt(t){
    if(!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${String(s).padStart(2,'0')}`;
  }

  audio.addEventListener('loadedmetadata', () => {
    durTime.textContent = fmt(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    curTime.textContent = fmt(audio.currentTime);
    if (audio.duration) {
      const p = (audio.currentTime / audio.duration) * 100;
      progress.value = String(p);
    }
  });

  progress.addEventListener('input', () => {
    if (!audio.duration) return;
    const p = Number(progress.value) / 100;
    audio.currentTime = p * audio.duration;
  });

  playBtn.addEventListener('click', async () => {
    try{
      if(audio.paused){
        await audio.play();
        playBtn.textContent = "❚❚";
      }else{
        audio.pause();
        playBtn.textContent = "▶";
      }
    }catch(e){
      // si el navegador bloquea autoplay por interacción, aquí igual ya hubo click
      console.log(e);
    }
  });

  audio.addEventListener('pause', () => playBtn.textContent = "▶");
  audio.addEventListener('play', () => playBtn.textContent = "❚❚");
})();

/* =========================
   COUNTDOWN (18 abril 2026)
========================= */
(function countdown(){
  const dEl = document.getElementById('d');
  const hEl = document.getElementById('h');
  const mEl = document.getElementById('m');
  const sEl = document.getElementById('s');

  if(!dEl || !hEl || !mEl || !sEl) return;

  // Importante: horario local del dispositivo
  const target = new Date('2026-04-18T19:00:00'); // si quieres otra hora, cámbiala aquí

  function pad2(n){ return String(n).padStart(2,'0'); }

  function tick(){
    const now = new Date();
    let diff = target.getTime() - now.getTime();

    if(diff <= 0){
      dEl.textContent = "00";
      hEl.textContent = "00";
      mEl.textContent = "00";
      sEl.textContent = "00";
      return;
    }

    const sec = Math.floor(diff / 1000);
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;

    dEl.textContent = pad2(days);
    hEl.textContent = pad2(hours);
    mEl.textContent = pad2(mins);
    sEl.textContent = pad2(secs);
  }

  tick();
  setInterval(tick, 1000);
})();

/* =========================
   MODAL: Mesa de regalos / Depósito
========================= */
(function modalGift(){
  const modal = document.getElementById('modal');
  if(!modal) return;

  const title = modal.querySelector('#modalTitle');
  const views = modal.querySelectorAll('[data-view]');
  const triggers = document.querySelectorAll('[data-modal]');
  const closers = modal.querySelectorAll('[data-close]');

  let lastFocus = null;

  function open(which){
    lastFocus = document.activeElement;

    title.textContent = (which === 'gift') ? 'Mesa de regalos' : 'Depósito virtual';

    views.forEach(v => {
      v.hidden = v.getAttribute('data-view') !== which;
    });

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const closeBtn = modal.querySelector('.modal__close');
    if(closeBtn) closeBtn.focus();
  }

  function close(){
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if(lastFocus && typeof lastFocus.focus === 'function'){
      lastFocus.focus();
    }
  }

  triggers.forEach(btn => {
    btn.addEventListener('click', () => open(btn.getAttribute('data-modal')));
  });

  closers.forEach(el => el.addEventListener('click', close));

  window.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
})();