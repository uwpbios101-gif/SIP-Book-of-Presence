(() => {
  'use strict';

  const shell = document.querySelector('.site-shell');
  const book = document.getElementById('flipbook');
  const papers = [...document.querySelectorAll('.paper')];
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const progressBar = document.getElementById('progressBar');
  const pageLabel = document.getElementById('pageLabel');
  const chapterButtons = [...document.querySelectorAll('[data-go]')];
  const soundButton = document.getElementById('soundButton');
  const fullscreenButton = document.getElementById('fullscreenButton');
  const searchButton = document.getElementById('searchButton');
  const searchDialog = document.getElementById('searchDialog');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const toast = document.getElementById('toast');
  const mobileReader = document.getElementById('mobileReader');

  const labels = ['Cover', 'Welcome', 'Contents', 'House Signatures', 'Presence', 'Back Cover'];
  const searchIndex = [
    { title: 'The Book of Presence', subtitle: 'Cover', page: 0 },
    { title: 'Welcome to SIP', subtitle: 'Presence is the product', page: 1 },
    { title: 'Contents', subtitle: 'The complete journey', page: 2 },
    { title: 'House Signatures', subtitle: 'Collection I', page: 3 },
    { title: 'Presence', subtitle: 'Blackberry · black tea · charred orange · allspice', page: 4 },
    { title: 'SIP South Holland', subtitle: 'Address, phone, and reservations', page: 5 }
  ];

  const pageHashes = ['cover','welcome','contents','house-signatures','presence','back-cover'];
  const initialHash = window.location.hash.replace('#','').toLowerCase();
  let currentPage = Math.max(0, pageHashes.indexOf(initialHash));
  let soundEnabled = false;
  let touchStartX = 0;
  let toastTimer;

  function paperStateForPage(page) {
    // page: 0-5. Each turn reveals two logical pages.
    if (page <= 0) return 0;
    if (page <= 2) return 1;
    if (page <= 4) return 2;
    return 3;
  }

  function updateBook() {
    const turns = paperStateForPage(currentPage);
    papers.forEach((paper, index) => paper.classList.toggle('flipped', index < turns));
    book.classList.toggle('is-open', turns > 0 && turns < papers.length);
    shell.dataset.page = String(currentPage);

    pageLabel.textContent = labels[currentPage];
    progressBar.style.width = `${((currentPage + 1) / labels.length) * 100}%`;
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === labels.length - 1;

    document.querySelectorAll('.chapter-nav button').forEach(btn => {
      const target = Number(btn.dataset.go);
      btn.classList.toggle('is-active', target === currentPage ||
        (currentPage === 2 && target === 2) ||
        (currentPage === 3 && target === 3) ||
        (currentPage === 4 && target === 4));
    });
  }

  function goTo(page, withSound = true) {
    const next = Math.max(0, Math.min(labels.length - 1, Number(page)));
    if (next === currentPage) return;
    currentPage = next;
    const hash = pageHashes[currentPage];
    if (window.location.hash !== `#${hash}`) history.replaceState(null, '', `#${hash}`);
    if (withSound) playPageSound();
    updateBook();
    if (window.innerWidth <= 760) {
      document.getElementById(`mobile-page-${currentPage}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function next() { goTo(currentPage + 1); }
  function prev() { goTo(currentPage - 1); }

  function playPageSound() {
    if (!soundEnabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const bufferSize = ctx.sampleRate * 0.16;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const envelope = Math.sin(Math.PI * i / bufferSize) ** 2;
        data[i] = (Math.random() * 2 - 1) * envelope * 0.16;
      }
      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass'; filter.frequency.value = 1600;
      source.buffer = buffer; source.connect(filter); filter.connect(ctx.destination);
      source.start();
      source.onended = () => ctx.close();
    } catch (_) { /* audio is an enhancement */ }
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  function renderSearch(query = '') {
    const q = query.trim().toLowerCase();
    const matches = searchIndex.filter(item => `${item.title} ${item.subtitle}`.toLowerCase().includes(q));
    searchResults.innerHTML = matches.length ? matches.map(item => `
      <button class="search-result" type="button" data-result-page="${item.page}">
        <span>${String(item.page + 1).padStart(2,'0')}</span>
        <b>${item.title}</b>
        <small>${item.subtitle}</small>
      </button>`).join('') : '<p>No matching page in this prototype edition.</p>';
  }

  function buildMobileReader() {
    const pages = [...document.querySelectorAll('.page')];
    pages.forEach((page, index) => {
      const section = document.createElement('section');
      section.className = 'mobile-page';
      section.id = `mobile-page-${index}`;
      section.setAttribute('aria-label', labels[index]);
      const clone = page.cloneNode(true);
      clone.classList.remove('front','back','page');
      section.appendChild(clone);
      mobileReader.appendChild(section);
    });

    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible || window.innerWidth > 760) return;
      currentPage = Number(visible.target.id.replace('mobile-page-',''));
      shell.dataset.page = String(currentPage);
    }, { threshold: [0.45,0.7] });
    [...mobileReader.children].forEach(el => observer.observe(el));
  }

  nextButton.addEventListener('click', next);
  prevButton.addEventListener('click', prev);
  chapterButtons.forEach(btn => btn.addEventListener('click', () => goTo(btn.dataset.go)));
  document.querySelectorAll('[data-coming]').forEach(btn => btn.addEventListener('click', () => showToast('This collection enters in the next production phase.')));

  soundButton.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundButton.setAttribute('aria-pressed', String(soundEnabled));
    showToast(soundEnabled ? 'Page sound enabled' : 'Page sound muted');
    if (soundEnabled) playPageSound();
  });

  fullscreenButton.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) { showToast('Full screen is unavailable in this browser.'); }
  });

  searchButton.addEventListener('click', () => {
    renderSearch('');
    searchDialog.showModal();
    setTimeout(() => searchInput.focus(), 50);
  });
  searchInput.addEventListener('input', event => renderSearch(event.target.value));
  searchResults.addEventListener('click', event => {
    const button = event.target.closest('[data-result-page]');
    if (!button) return;
    searchDialog.close();
    goTo(button.dataset.resultPage);
  });

  document.addEventListener('keydown', event => {
    if (searchDialog.open) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown') next();
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') prev();
    if (event.key === 'Home') goTo(0);
    if (event.key === 'End') goTo(labels.length - 1);
  });

  book.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive:true });
  book.addEventListener('touchend', event => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) < 45) return;
    delta < 0 ? next() : prev();
  }, { passive:true });

  window.addEventListener('hashchange', () => {
    const requested = pageHashes.indexOf(window.location.hash.replace('#','').toLowerCase());
    if (requested >= 0 && requested !== currentPage) {
      currentPage = requested;
      updateBook();
    }
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('./service-worker.js?v=3.0.0');
        registration.update();
      } catch (_) {}
    });
  }

  buildMobileReader();
  updateBook();
})();
