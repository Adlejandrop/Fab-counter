const CombatChain = (() => {
  let _attackValueEl, _indicatorEl, _prevBtn, _nextBtn;

  function _render() {
    const cc    = State.getCombatChain();
    const link  = State.getCurrentLink();
    const total = cc.links.length;
    const idx   = cc.currentIndex;

    _attackValueEl.textContent = link.attackValue;
    /* Clear first so the splat reflects only THIS link and re-pops cleanly */
    _attackValueEl.classList.remove('is-hit');
    if (link.hit) {
      void _attackValueEl.offsetWidth; // force reflow → restart animation
      _attackValueEl.classList.add('is-hit');
    }
    _attackValueEl.setAttribute('aria-pressed', link.hit ? 'true' : 'false');

    _indicatorEl.textContent = `Link ${idx + 1} of ${total}`;
    _prevBtn.disabled = idx === 0;
    _nextBtn.disabled = idx === total - 1;

    document.querySelectorAll('.cc-keyword').forEach(btn => {
      const active = link.keywords[btn.dataset.keyword];
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function init() {
    _attackValueEl = document.getElementById('cc-attack-value');
    _indicatorEl   = document.getElementById('cc-link-indicator');
    _prevBtn       = document.getElementById('cc-prev');
    _nextBtn       = document.getElementById('cc-next');

    document.getElementById('cc-close-btn').addEventListener('click', () => {
      State.resetCombatChain();
      _render();
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

    /* Tap the attack number — toggles "hit landed", shows blood splat */
    _attackValueEl.addEventListener('click', () => {
      State.toggleHit();
      _render();
    });

    document.querySelectorAll('.cc-keyword').forEach(btn => {
      btn.addEventListener('click', () => {
        State.toggleKeyword(btn.dataset.keyword);
        _render();
      });
    });

    _render();
  }

  return { init };
})();
