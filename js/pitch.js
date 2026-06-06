const Pitch = (() => {
  const POP_DURATION = 200;

  function _containerEl(playerId) {
    return document.getElementById(`p${playerId}-pitch`);
  }

  function renderPitch(playerId) {
    const container = _containerEl(playerId);
    if (!container) return;
    const pitchState = State.getPlayer(playerId).pitch;
    container.querySelectorAll('.pitch-dot').forEach(dot => {
      const color = dot.dataset.color;
      dot.classList.toggle('is-active', pitchState[color]);
      dot.classList.remove('is-consumed');
    });
  }

  function _popDot(dot) {
    dot.classList.remove('popping');
    void dot.offsetWidth;
    dot.classList.add('popping');
    setTimeout(() => dot.classList.remove('popping'), POP_DURATION);
  }

  function toggle(playerId, color, dotEl) {
    State.togglePitch(playerId, color);
    if (dotEl) _popDot(dotEl);
    renderPitch(playerId);
  }

  function resetAll(playerId) {
    State.resetPitch(playerId);
    renderPitch(playerId);
  }

  function init() {
    document.querySelectorAll('.player').forEach(section => {
      const id = parseInt(section.dataset.player, 10);

      _containerEl(id).querySelectorAll('.pitch-dot').forEach(dot => {
        dot.addEventListener('click', () => toggle(id, dot.dataset.color, dot));
      });

      renderPitch(id);
    });
  }

  return { init, renderPitch, resetAll };
})();
