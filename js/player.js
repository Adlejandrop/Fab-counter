const Player = (() => {
  const FLASH_DURATION = 420;
  const BUMP_DURATION  = 220;

  function _lifeEl(id)    { return document.getElementById(`p${id}-life`); }
  function _apValueEl(id) { return document.getElementById(`p${id}-ap-value`); }
  function _apEl(id)      { return document.getElementById(`p${id}-ap`); }
  function _turnBtnEl(id) { return document.getElementById(`p${id}-turn-btn`); }

  function renderLife(playerId) {
    const el = _lifeEl(playerId);
    if (el) el.textContent = State.getPlayer(playerId).life;
  }

  function renderAP(playerId) {
    const el       = _apValueEl(playerId);
    const container = _apEl(playerId);
    if (!el || !container) return;

    const { actionPoints } = State.getPlayer(playerId);
    const isActive = State.getActivePlayer() === playerId;

    el.textContent = actionPoints;
    container.classList.toggle('is-inactive-player', !isActive);

    container.querySelector('.player__ap-btn--dec').disabled = !isActive || actionPoints === 0;
    container.querySelector('.player__ap-btn--inc').disabled = !isActive;
  }

  function renderTurnBtn(playerId) {
    const btn = _turnBtnEl(playerId);
    if (!btn) return;
    const isActive = State.getActivePlayer() === playerId;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    btn.disabled = !isActive;
  }

  function renderBothPlayers() {
    [1, 2].forEach(id => {
      renderAP(id);
      renderTurnBtn(id);
    });
  }

  function _flashLife(el, direction) {
    const cls = direction > 0 ? 'flash--up' : 'flash--down';
    el.classList.remove('flash--up', 'flash--down', 'bumping');
    void el.offsetWidth;
    el.classList.add(cls, 'bumping');
    setTimeout(() => el.classList.remove(cls, 'bumping'), Math.max(FLASH_DURATION, BUMP_DURATION));
  }

  function changeLife(playerId, delta) {
    const p  = State.getPlayer(playerId);
    const el = _lifeEl(playerId);
    State.setLife(playerId, p.life + delta);
    renderLife(playerId);
    if (el) _flashLife(el, delta);
  }

  function setActive(playerId) {
    State.setActivePlayer(playerId);
    renderBothPlayers();
  }

  function init() {
    document.querySelectorAll('.player').forEach(section => {
      const id = parseInt(section.dataset.player, 10);

      section.querySelectorAll('.player__life-tap').forEach(btn => {
        btn.addEventListener('click', () => {
          const delta = btn.dataset.action === 'increase' ? 1 : -1;
          changeLife(id, delta);
        });
      });

      _apEl(id).querySelector('.player__ap-btn--inc').addEventListener('click', () => {
        if (State.getActivePlayer() !== id) return;
        State.changeActionPoints(id, 1);
        renderAP(id);
      });

      _apEl(id).querySelector('.player__ap-btn--dec').addEventListener('click', () => {
        if (State.getActivePlayer() !== id) return;
        State.changeActionPoints(id, -1);
        renderAP(id);
      });

      _turnBtnEl(id).addEventListener('click', () => {
        if (State.getActivePlayer() !== id) return; // only active player passes turn
        setActive(id === 1 ? 2 : 1);
      });

      renderLife(id);
    });

    renderBothPlayers();
  }

  return { init, changeLife, renderLife, renderAP, renderTurnBtn };
})();
