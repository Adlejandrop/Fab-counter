const Player = (() => {
  const FLASH_DURATION = 420;

  function _valueEl(id, counter) {
    return document.getElementById(`p${id}-${counter}`);
  }

  function render(playerId, counter) {
    const el = _valueEl(playerId, counter);
    if (el) el.textContent = State.getPlayer(playerId)[counter];
  }

  function renderActive() {
    const active = State.getActivePlayer();
    const app    = document.getElementById('app');
    app.classList.toggle('active-p1', active === 1);
    app.classList.toggle('active-p2', active === 2);
    document.querySelectorAll('.turn-bar').forEach(bar => {
      const id = parseInt(bar.dataset.player, 10);
      bar.classList.toggle('is-active', id === active);
    });
  }

  function renderAll() {
    [1, 2].forEach(id => {
      ['life', 'pitch', 'ap'].forEach(counter => render(id, counter));
    });
    renderActive();
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

  function endTurn(playerId) {
    if (!State.endTurn(playerId)) return;
    [1, 2].forEach(id => render(id, 'ap'));
    render(playerId, 'pitch');   // ending player's pitch reset to 0
    renderActive();
  }

  function init() {
    document.querySelectorAll('.player').forEach(section => {
      const id = parseInt(section.dataset.player, 10);

      section.querySelectorAll('.counter__btn').forEach(btn => {
        const counter = btn.dataset.counter;
        const delta   = parseInt(btn.dataset.delta, 10);
        btn.addEventListener('click', () => change(id, counter, delta));
      });

      const bar = section.querySelector('.turn-bar');
      if (bar) bar.addEventListener('click', () => endTurn(id));
    });

    renderAll();
  }

  return { init, render, change };
})();
