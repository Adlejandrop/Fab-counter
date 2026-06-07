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
    players: {
      1: { life: 40, pitch: 1, ap: 1 },
      2: { life: 40, pitch: 1, ap: 1 },
    },
    combatChain: {
      links: [_emptyLink()],
      currentIndex: 0,
    },
  };

  function getPlayer(id) {
    return _state.players[id];
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
    changeCounter,
    getCombatChain,
    getCurrentLink,
    resetCombatChain,
    addChainLink,
    navigateLink,
    setAttackValue,
    toggleKeyword,
    toggleHit,
  };
})();
