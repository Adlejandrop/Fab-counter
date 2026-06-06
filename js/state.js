const State = (() => {
  function _emptyLink() {
    return { attackValue: 0, keywords: { 'go-again': false, dominate: false, overpower: false } };
  }

  const _state = {
    activePlayer: 1,
    players: {
      1: { life: 20, actionPoints: 1, pitch: { red: false, yellow: false, blue: false } },
      2: { life: 20, actionPoints: 0, pitch: { red: false, yellow: false, blue: false } },
    },
    combatChain: {
      open: false,
      active: false,
      links: [_emptyLink()],
      currentIndex: 0,
    },
  };

  function getPlayer(id) {
    return _state.players[id];
  }

  function setLife(playerId, value) {
    _state.players[playerId].life = value;
  }

  function getActivePlayer() {
    return _state.activePlayer;
  }

  function setActivePlayer(id) {
    const prev = _state.activePlayer;
    if (prev === id) return;
    _state.players[prev].actionPoints = 0;
    _state.players[id].actionPoints   = 1;
    _state.activePlayer = id;
  }

  function changeActionPoints(playerId, delta) {
    const p = _state.players[playerId];
    p.actionPoints = Math.max(0, p.actionPoints + delta);
    return p.actionPoints;
  }

  function togglePitch(playerId, color) {
    const pitch = _state.players[playerId].pitch;
    pitch[color] = !pitch[color];
    return pitch[color];
  }

  function resetPitch(playerId) {
    const pitch = _state.players[playerId].pitch;
    pitch.red = false;
    pitch.yellow = false;
    pitch.blue = false;
  }

  function getCombatChain() {
    return _state.combatChain;
  }

  function getCurrentLink() {
    const cc = _state.combatChain;
    return cc.links[cc.currentIndex];
  }

  function openCombatChain() {
    _state.combatChain.open   = true;
    _state.combatChain.active = true;
  }

  function closeCombatChain() {
    _state.combatChain.open         = false;
    _state.combatChain.active       = false;
    _state.combatChain.links        = [_emptyLink()];
    _state.combatChain.currentIndex = 0;
  }

  function addChainLink() {
    const cc = _state.combatChain;
    cc.links.push(_emptyLink());
    cc.currentIndex = cc.links.length - 1;
  }

  function navigateLink(index) {
    const cc = _state.combatChain;
    if (index >= 0 && index < cc.links.length) {
      cc.currentIndex = index;
    }
  }

  function setAttackValue(value) {
    getCurrentLink().attackValue = Math.max(0, value);
  }

  function toggleKeyword(keyword) {
    const kw = getCurrentLink().keywords;
    kw[keyword] = !kw[keyword];
    return kw[keyword];
  }

  return {
    getPlayer,
    getActivePlayer,
    setLife,
    setActivePlayer,
    changeActionPoints,
    togglePitch,
    resetPitch,
    getCombatChain,
    getCurrentLink,
    openCombatChain,
    closeCombatChain,
    addChainLink,
    navigateLink,
    setAttackValue,
    toggleKeyword,
  };
})();
