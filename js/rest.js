// ============================================================
// REST SYSTEM - Legends of Daybreak
// Handles campsites, taverns, temples, rest ticks, ambushes, banter
// ============================================================

let restTimer = null;

function getDeadParty() {
  return G.party.filter(p => p.hp <= 0);
}

function reviveMember(name) {
  const member = G.party.find(p => p.n === name);
  if (!member || member.hp > 0) return;
  if (G.p.gold < 50) { lg('❌ Need 50G to revive!'); return; }
  G.p.gold -= 50;
  member.hp = Math.floor(member.mhp * 0.5);
  member.on = true;
  lg('⛪ ' + member.n + ' revived! HP: ' + member.hp + '/' + member.mhp);
  render();
}

function hasHealer() {
  return G.party.some(p => p.on && p.r === 'Healer' && p.hp > 0);
}

function getHealerName() {
  const h = G.party.find(p => p.on && p.r === 'Healer' && p.hp > 0);
  return h ? h.n : null;
}

function getBlessDef(t) {
  return (G.soelBlessing && t && t.n === G.soelBlessing.target) ? (G.soelBlessing.def || 0) : 0;
}

function soelBless(name) {
  if (G.soelBlessing) return;
  const m = G.party.find(p => p.n === name && p.on);
  if (!m) return;
  G.soelBlessing = { target: name, def: 10 };
  lg('🐱 Soel blesses ' + name + ' (+10 DEF until next rest).');
  render();
}

function unlockRestSites() {
  let newly = false;
  for (let site of G.rest.sites) {
    if (!site.unlocked && G.p.lvl >= site.zoneLv) {
      site.unlocked = true;
      lg('🏕️ New rest site unlocked: ' + site.name + ' (' + site.zone + ')');
      newly = true;
    }
  }
  return newly;
}

function pickBanter(type, tense) {
  const pool = [];
  if (tense) {
    pool.push(...G.banter.tense);
  } else if (type === 'tavern' && Math.random() < 0.4) {
    pool.push(...G.banter.tavern);
  }
  const active = G.party.filter(p => p.on);
  if (active.length === 0 && !tense) {
    pool.push(...G.banter.solo);
  } else if (!tense) {
    for (let p of active) {
      const key = p.n.toLowerCase();
      if (G.banter[key]) pool.push(...G.banter[key]);
    }
  }
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function showDialogue(dialogue) {
  if (!dialogue) return;
  G.currentDialogue = dialogue;
  lg('💬 ' + dialogue.speaker + ': ' + dialogue.text);
}

function showAmbushWarning(dialogue) {
  if (!dialogue) return;
  G.ambushWarning = dialogue;
  lg('⚠️ ' + dialogue.text);
}

function doRestTick() {
  const healAmt = Math.ceil(G.p.mhp / G.rest.maxTicks);
  const manaAmt = Math.ceil(G.p.mmp / G.rest.maxTicks);
  G.p.hp = Math.min(G.p.mhp, G.p.hp + healAmt);
  G.p.mp = Math.min(G.p.mmp, G.p.mp + manaAmt);
  for (let p of G.party) {
    if (p.on) {
      p.hp = Math.min(p.mhp, p.hp + Math.ceil(p.mhp / G.rest.maxTicks));
    }
  }
  const line = pickBanter(G.rest.selectedSite.type, false);
  if (line) showDialogue(line);
  render();
}

function startRest(siteId) {
  if (G.rest.active) return;
  const site = G.rest.sites.find(s => s.id === siteId);
  if (!site || !site.unlocked) {
    lg('That rest site is not available yet.');
    return;
  }

  // === MANA SPRING: No healer required ===
  if (site.type === 'mana_spring') {
    if (G.manaSpringUses.day !== G.gameDay) {
      G.manaSpringUses.day = G.gameDay;
      G.manaSpringUses.count = 0;
    }
    if (G.manaSpringUses.count >= 8) {
      lg('💧 You have reached your daily mana spring limit (8/day).');
      return;
    }
    if (G.p.gold < site.cost) {
      lg('❌ Not enough gold! ' + site.name + ' costs ' + site.cost + 'G.');
      return;
    }
    G.manaSpringUses.count++;
    const remaining = 8 - G.manaSpringUses.count;
    G.p.gold -= site.cost;

    // Full MP restore
    G.p.mp = G.p.mmp;
    for (let p of G.party) { if (p.on) p.mp = p.mmp || p.mhp; }

    // Bonus buff for 3 combats
    G.p.buffs.push({ n: 'Mana Spring Blessing', t: 3, mpRegenPct: 0.20 });

    // Small HP heal
    const hpHeal = Math.floor(G.p.mhp * 0.3);
    G.p.hp = Math.min(G.p.mhp, G.p.hp + hpHeal);
    for (let p of G.party) { if (p.on) p.hp = Math.min(p.mhp, p.hp + Math.floor(p.mhp * 0.3)); }

    lg('💧 You bathe in ' + site.name + '. MP fully restored! (' + remaining + ' uses left)');
    lg('✨ Mana Spring Blessing: +20% MP regen for 3 combats.');
    render();
    return;
  }

  // === TEMPLE: No healer required ===
  if (site.type === 'temple') {
    if (G.p.gold < site.cost) {
      lg('❌ Not enough gold! Temple costs ' + site.cost + 'G.');
      return;
    }
    G.p.gold -= site.cost;
    G.rest.active = true;
    G.rest.selectedSite = site;
    G.rest.tick = 0;
    G.rest.ambushPending = false;
    G.currentDialogue = null;
    G.potionMenu = false;
    G.ambushWarning = null;
    if (G.soelBlessing) {
      lg("🐱 Soel's blessing fades as you enter the temple.");
      G.soelBlessing = null;
    }
    if (G.joelReviveUsed) {
      G.joelReviveUsed = false;
      lg('💜 Joel steadies his shield. Unbreakable is ready again.');
    }
    lg('⛪ Entering the Temple of Resurrection...');
    render();
    return;
  }

  // === CAMP / TAVERN: Healer required ===
  if (!hasHealer()) {
    lg('❌ No healer in active party! You need a healer to rest safely.');
    return;
  }

  if (site.cost && G.p.gold < site.cost) {
    lg('❌ Not enough gold! ' + site.name + ' costs ' + site.cost + 'G.');
    return;
  }
  if (site.cost) {
    G.p.gold -= site.cost;
    lg('💰 Paid ' + site.cost + 'G for ' + site.name + '.');
  }
  G.rest.active = true;
  G.rest.selectedSite = site;
  G.rest.tick = 0;
  G.rest.ambushPending = false;
  G.currentDialogue = null;
  G.potionMenu = false;
  G.ambushWarning = null;
  if (G.soelBlessing) {
    lg("🐱 Soel's blessing on " + G.soelBlessing.target + " fades as the party makes camp.");
    G.soelBlessing = null;
  }
  if (G.joelReviveUsed) {
    G.joelReviveUsed = false;
    lg('💜 Joel steadies his shield. Unbreakable is ready again.');
  }
  const healerName = getHealerName();
  lg('💤 ' + healerName + ' begins the rest ritual at ' + site.name + '...');
  lg('🔥 Campfire lit. 5 ticks to full recovery.');
  doRestTick();
  G.rest.tick = 1;
  render();
  restTimer = setInterval(() => {
    if (!G.rest.active) {
      clearInterval(restTimer);
      restTimer = null;
      return;
    }
    const ambushChance = G.rest.selectedSite.type === 'tavern' ? 0.05 : 0.15;
    if (Math.random() < ambushChance && G.rest.tick < G.rest.maxTicks) {
      const tenseLine = pickBanter(G.rest.selectedSite.type, true);
      showAmbushWarning(tenseLine);
      clearInterval(restTimer);
      restTimer = null;
      G.rest.active = false;
      checkDailyQuests('rest', 1);
      G.rest.ambushPending = true;
      setTimeout(() => {
        G.rest.ambushPending = false;
        G.currentDialogue = null;
        G.ambushWarning = null;
        const zi = G.zones.findIndex(z => z.n === G.rest.selectedSite.zone);
        sc(zi >= 0 ? zi : 0);
        G.rest.selectedSite = null;
        G.rest.tick = 0;
      }, 1500);
      return;
    }
    doRestTick();
    G.rest.tick++;
    if (G.rest.tick >= G.rest.maxTicks) {
      clearInterval(restTimer);
      restTimer = null;
      completeRest();
    }
  }, G.rest.tickDuration);
}

function completeRest() {
  if (restTimer) {
    clearInterval(restTimer);
    restTimer = null;
  }
  const healerName = getHealerName();
  G.p.hp = G.p.mhp;
  G.p.mp = G.p.mmp;
  for (let p of G.party) {
    if (p.on) p.hp = p.mhp;
  }
  G.p.buffs = G.p.buffs.filter(b => b.t > 0);
  G.currentDialogue = null;
  G.ambushWarning = null;
  const siteName = G.rest.selectedSite ? G.rest.selectedSite.name : 'camp';
  lg('✨ Rest complete at ' + siteName + '!');
  lg('💚 ' + healerName + ' has restored everyone to full health.');
  // Affinity gain for resting together
  for (let p of G.party) { if (p.on) updateAffinity(p.n, 2); }
  // Track rest_with quest progress
  for (let q of G.quests) {
    if (!q.done && !q.expired && q.t === 'rest_with' && G.party.find(p => p.on && p.n === q.reqParty)) {
      q.c++;
      if (q.c >= q.need) {
        q.done = true;
        G.p.xp += q.rw.xp;
        G.p.gold += q.rw.g;
        G.p.quests++;
        lg('Quest: ' + q.n + '! +' + q.rw.xp + 'XP +' + q.rw.g + 'G');
        lvlup();
      }
    }
  }
  G.rest.active = false;
  G.rest.selectedSite = null;
  G.rest.tick = 0;
  G.rest.ambushPending = false;
  render();
}

function cancelRest() {
  if (!G.rest.active) return;
  if (restTimer) {
    clearInterval(restTimer);
    restTimer = null;
  }
  const pct = G.rest.tick / G.rest.maxTicks;
  const hpRestore = Math.floor(G.p.mhp * pct * 0.5);
  const mpRestore = Math.floor(G.p.mmp * pct * 0.5);
  G.p.hp = Math.min(G.p.mhp, G.p.hp + hpRestore);
  G.p.mp = Math.min(G.p.mmp, G.p.mp + mpRestore);
  for (let p of G.party) {
    if (p.on) {
      p.hp = Math.min(p.mhp, p.hp + Math.floor(p.mhp * pct * 0.5));
    }
  }
  G.currentDialogue = null;
  G.ambushWarning = null;
  lg('⛔ Rest interrupted! Only partial recovery (' + Math.floor(pct * 100) + '%).');
  G.rest.active = false;
  G.rest.selectedSite = null;
  G.rest.tick = 0;
  G.rest.ambushPending = false;
  render();
}

function rRest() {
  let h = '<div class="rest-view">';
  h += '<div class="st">💤 Rest</div>';

  if (G.rest.active) {
    h += '<div style="text-align:center;padding:20px;">';
    h += '<div style="font-size:48px;margin-bottom:12px;">🔥</div>';
    h += '<div style="font-size:18px;font-weight:700;margin-bottom:8px;">Resting at ' + G.rest.selectedSite.name + '</div>';
    h += '<div style="font-size:13px;color:var(--text-dim);margin-bottom:16px;">Tick ' + G.rest.tick + '/' + G.rest.maxTicks + '</div>';
    h += '<div class="bar" style="max-width:300px;margin:0 auto 16px;"><div class="bf bf-hp" style="width:' + ((G.rest.tick / G.rest.maxTicks) * 100) + '%"></div></div>';
    if (G.currentDialogue) {
      h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin:16px auto;max-width:400px;text-align:left;">';
      h += '<div style="font-size:11px;color:var(--accent-light);font-weight:600;margin-bottom:4px;">' + G.currentDialogue.speaker + '</div>';
      h += '<div style="font-size:13px;line-height:1.5;">' + G.currentDialogue.text + '</div></div>';
    }
    if (G.ambushWarning) {
      h += '<div style="color:var(--danger);font-size:14px;margin:12px 0;">⚠️ ' + G.ambushWarning.text + '</div>';
    }
    h += '<button class="abtn" id="cancel-rest" style="background:var(--danger);">Cancel Rest</button>';
    h += '</div>';
    return h;
  }

  h += '<div class="zd">Choose a rest site. Camps are free but risk ambush. Taverns are safer but cost gold. Temples revive fallen companions.</div>';

  // Group by zone
  const zones = [...new Set(G.rest.sites.map(s => s.zone))];
  for (let zone of zones) {
    const sites = G.rest.sites.filter(s => s.zone === zone);
    const anyUnlocked = sites.some(s => s.unlocked);
    if (!anyUnlocked) continue;
    h += '<div style="margin-bottom:16px;">';
    h += '<div style="font-size:13px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">' + zone + '</div>';
    for (let site of sites) {
      if (!site.unlocked) continue;
      const isTemple = site.type === 'temple';
      const isManaSpring = site.type === 'mana_spring';
      const canAfford = G.p.gold >= site.cost;
      const needsHealer = site.type === 'camp' || site.type === 'tavern';
      const healerOk = !needsHealer || hasHealer();
      h += '<div class="rs-card ' + (!canAfford || !healerOk ? 'locked' : '') + '" data-id="' + site.id + '" style="margin-bottom:8px;">';
      h += '<div style="display:flex;justify-content:space-between;align-items:center;">';
      h += '<div style="font-weight:600;font-size:13px;">' + site.icon + ' ' + site.name + '</div>';
      h += '<div style="font-size:11px;color:' + (canAfford ? 'var(--gold)' : 'var(--danger)') + ';">' + (site.cost > 0 ? site.cost + 'G' : 'Free') + '</div>';
      h += '</div>';
      h += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">' + site.desc + '</div>';
      if (isManaSpring) {
        const remaining = 8 - (G.manaSpringUses.count || 0);
        h += '<div style="font-size:10px;color:var(--accent-light);margin-top:4px;">Uses today: ' + remaining + '/8 remaining</div>';
      }
      if (!healerOk) h += '<div style="font-size:10px;color:var(--danger);margin-top:4px;">❌ Requires healer in party</div>';
      if (!canAfford) h += '<div style="font-size:10px;color:var(--danger);margin-top:4px;">❌ Not enough gold</div>';
      h += '</div>';
    }
    h += '</div>';
  }

  // Soel Blessing
  const soel = G.party.find(p => p.on && p.n === 'Soel');
  if (soel && soel.hp > 0 && !G.soelBlessing) {
    h += '<div style="margin-top:16px;padding:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;">';
    h += '<div style="font-size:13px;font-weight:600;margin-bottom:8px;">🐱 Soel's Blessing</div>';
    h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:10px;">Soel can bless one party member (+10 DEF until next rest)</div>';
    for (let p of G.party) {
      if (p.on && p.hp > 0 && p.n !== 'Soel') {
        h += '<button class="soel-bless-btn" data-n="' + p.n + '" style="padding:6px 12px;border-radius:8px;border:1px solid var(--accent);background:var(--bg-hover);color:var(--text);font-size:11px;font-weight:600;cursor:pointer;margin-right:6px;margin-bottom:6px;">Bless ' + p.n + '</button>';
      }
    }
    h += '</div>';
  }

  // Revive at temple
  const dead = getDeadParty();
  if (dead.length > 0) {
    h += '<div style="margin-top:16px;padding:16px;background:var(--bg-card);border:1px solid var(--danger);border-radius:14px;">';
    h += '<div style="font-size:13px;font-weight:600;color:var(--danger);margin-bottom:8px;">💀 Fallen Companions</div>';
    for (let p of dead) {
      h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
      h += '<span style="font-size:12px;">' + p.n + ' (' + p.t + ')</span>';
      h += '<button class="tr-btn ' + (G.p.gold >= 50 ? '' : 'dis') + '" data-m="' + p.n + '">Revive (50G)</button>';
      h += '</div>';
    }
    h += '</div>';
  }

  h += '</div>';
  return h;
}
