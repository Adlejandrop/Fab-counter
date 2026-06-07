const Player = (() => {
  const FLASH_DURATION = 420;

  function _valueEl(id, counter) {
    return document.getElementById(`p${id}-${counter}`);
  }

  function render(playerId, counter) {
    const el = _valueEl(playerId, counter);
    if (el) el.textContent = State.getPlayer(playerId)[counter];
  }

  function _flash(el, delta) {
    const cls = delta > 0 ? 'flash--up' : 'flash--down';
    el.classList.remove('flash--up', 'flash--down', 'bumping');
    void el.offsetWidth;
    el.classList.add(cls, 'bumping');
    setTimeout(() => el.classList.remove(cls, 'bumping'), FLASH_DURATION);
  }

  function change(playerId, counter, delta) {
    State.changeCounter(playerId, counter, delta);
    render(playerId, counter);
    const el = _valueEl(playerId, counter);
    if (el) _flash(el, delta);
  }

  function init() {
    document.querySelectorAll('.player').forEach(section => {
      const id = parseInt(section.dataset.player, 10);

      section.querySelectorAll('.counter__btn').forEach(btn => {
        const counter = btn.dataset.counter;
        const delta   = parseInt(btn.dataset.delta, 10);
        btn.addEventListener('click', () => change(id, counter, delta));
      });

      ['life', 'pitch', 'ap'].forEach(counter => render(id, counter));
    });
  }

  return { init, render, change };
})();
