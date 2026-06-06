const CombatChain = (() => {
  let _overlay, _attackValueEl, _openBtn, _indicatorEl, _prevBtn, _nextBtn, _mainCloseBtn;

  function _render() {
    const cc    = State.getCombatChain();
    const link  = State.getCurrentLink();
    const total = cc.links.length;
    const idx   = cc.currentIndex;

    _attackValueEl.textContent = link.attackValue;
    _indicatorEl.textContent   = `Link ${idx + 1} of ${total}`;

    _prevBtn.disabled = idx === 0;
    _nextBtn.disabled = idx === total - 1;

    document.querySelectorAll('.cc-keyword').forEach(btn => {
      const active = link.keywords[btn.dataset.keyword];
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function _renderMainClose() {
    const active = State.getCombatChain().active;
    if (active) {
      _mainCloseBtn.removeAttribute('hidden');
    } else {
      _mainCloseBtn.setAttribute('hidden', '');
    }
  }

  function _dismissModal() {
    _overlay.setAttribute('hidden', '');
    _overlay.classList.remove('is-open');
    _openBtn.setAttribute('aria-expanded', 'false');
  }

  function open() {
    State.openCombatChain();
    _overlay.removeAttribute('hidden');
    _overlay.classList.add('is-open');
    _openBtn.setAttribute('aria-expanded', 'true');
    _renderMainClose();
    _render();
  }

  function close() {
    Pitch.resetAll(1);
    Pitch.resetAll(2);
    State.closeCombatChain();
    _dismissModal();
    _renderMainClose();
  }

  function init() {
    _overlay       = document.getElementById('cc-overlay');
    _attackValueEl = document.getElementById('cc-attack-value');
    _openBtn       = document.getElementById('combat-chain-btn');
    _indicatorEl   = document.getElementById('cc-link-indicator');
    _prevBtn       = document.getElementById('cc-prev');
    _nextBtn       = document.getElementById('cc-next');
    _mainCloseBtn  = document.getElementById('cc-main-close-btn');

    _openBtn.addEventListener('click', open);

    /* In-modal close — resets chain */
    document.getElementById('cc-close-btn').addEventListener('click', close);

    /* Main-view close — resets chain */
    _mainCloseBtn.addEventListener('click', close);

    /* Backdrop tap — dismiss only, keep chain data */
    _overlay.addEventListener('click', e => {
      if (e.target === _overlay) _dismissModal();
    });

    document.getElementById('cc-next-link-btn').addEventListener('click', () => {
      State.addChainLink();
      _render();
    });

    _prevBtn.addEventListener('click', () => {
      State.navigateLink(State.getCombatChain().currentIndex - 1);
      _render();
    });

    _nextBtn.addEventListener('click', () => {
      State.navigateLink(State.getCombatChain().currentIndex + 1);
      _render();
    });

    document.getElementById('cc-attack-plus').addEventListener('click', () => {
      State.setAttackValue(State.getCurrentLink().attackValue + 1);
      _render();
    });

    document.getElementById('cc-attack-minus').addEventListener('click', () => {
      State.setAttackValue(State.getCurrentLink().attackValue - 1);
      _render();
    });

    document.querySelectorAll('.cc-keyword').forEach(btn => {
      btn.addEventListener('click', () => {
        State.toggleKeyword(btn.dataset.keyword);
        _render();
      });
    });
  }

  return { init, open, close };
})();
