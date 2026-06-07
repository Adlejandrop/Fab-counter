const State = (() => {
  function _emptyLink() {
    return {
      attackValue: 0,
      hit: false,
      keywords: {
        'go-again':  false,
        dominate:    false,
        'on-hit':    false,
        piercing:    false,
        overpower:   false,
        other:       false,
      },
    };
  }

  /* Per-counter floors */
  const _min = { life: 0, pitch: 0, ap: 0 };

  const _state = {
    activePlayer: 1,
    players: {
      1: { life: 40, pitch: 1, ap: 0 },
      2: { life: 40, pitch: 1, ap: 0 },
    },
    combatChain: {
      open: false,
      links: [_emptyLink()],
      currentIndex: 0,
    },
  };

  function getPlayer(id) {
    return _state.players[id];
  }

  /* ── Active player / turns ─────────────────────────── */

  function getActivePlayer() {
    return _state.activePlayer;
  }

  /* The active player ends their turn: their AP → 0, opponent's → 1,
     and the turn passes. Only the active player may end the turn. */
  function endTurn(playerId) {
    if (_state.activePlayer !== playerId) return false;
    const other = playerId === 1 ? 2 : 1;
    _state.players[playerId].ap = 0;
    _state.players[other].ap    = 1;
    _state.activePlayer         = other;
    return true;
  }

  function changeCounter(playerId, counter, delta) {
    const p = _state.players[playerId];
    p[counter] = Math.max(_min[counter], p[counter] + delta);
    return p[counter];
  }

  /* ── Combat chain ──────────────────────────────────── */

  function getCombatChain() {
    return _state.combatChain;
  }

  function isChainOpen() {
    return _state.combatChain.open;
  }

  function setChainOpen(open) {
    _state.combatChain.open = open;
  }

  function getCurrentLink() {
    const cc = _state.combatChain;
    return cc.links[cc.currentIndex];
  }

  function resetCombatChain() {
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

  function toggleHit() {
    const link = getCurrentLink();
    link.hit = !link.hit;
    return link.hit;
  }

  return {
    getPlayer,
    getActivePlayer,
    endTurn,
    changeCounter,
    getCombatChain,
    isChainOpen,
    setChainOpen,
    getCurrentLink,
    resetCombatChain,
    addChainLink,
    navigateLink,
    setAttackValue,
    toggleKeyword,
    toggleHit,
  };
})();
