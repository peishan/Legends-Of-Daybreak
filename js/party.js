// ============================================================
// PARTY SYSTEM - Legends of Daybreak
// Handles party members, affinity, synergies, gear, and banter
// ============================================================

// Initialize party gear bonus tracking
function initPartyGearBonus() {
  if (!G || !G.party) return;
  for (let p of G.party) {
    if (!p.gearBonus) p.gearBonus = { atk: 0, def: 0, hp: 0, mp: 0, spd: 0 };
  }
}

// Get list of dead party members
function getDeadParty() {
  return G.party.filter(p => p.hp <= 0);
}

// Check if a healer is active in party
function hasHealer() {
  return G.party.some(p => p.on && p.r === 'Healer' && p.hp > 0);
}

// Get name of active healer (for rest dialogue)
function getHealerName() {
  const h = G.party.find(p => p.on && p.r === 'Healer' && p.hp > 0);
  return h ? h.n : null;
}

// ============================================================
// AFFINITY SYSTEM
// ============================================================

function updateAffinity(partyMemberName, amount) {
  if (!G.affinity[partyMemberName]) return;
  G.affinity[partyMemberName].val = Math.max(0, Math.min(G.affinity[partyMemberName].max, G.affinity[partyMemberName].val + amount));
  G.affinity[partyMemberName].lastInteract = Date.now();
  if (amount > 0) {
    lg('💕 Affinity with ' + partyMemberName + ' +' + amount + ' (' + G.affinity[partyMemberName].val + '/' + G.affinity[partyMemberName].max + ')');
  }
  checkAffinityUnlocks(partyMemberName);
  checkAchievements();
  revealSecretAchievements();
  checkAffinityDecay();
}

function checkAffinityUnlocks(name) {
  const aff = G.affinity[name];
  const defs = G.affinityUnlocks[name];
  if (!aff || !defs) return;
  const member = G.party.find(p => p.n === name);
  if (!member) return;
  member.affinityBonuses = member.affinityBonuses || [];
  for (let u of defs) {
    if (aff.val >= u.th && !member.affinityBonuses.includes(u.id)) {
      member.affinityBonuses.push(u.id);
      applyAffinityUnlockFx(member, u);
      lg('🌟 Affinity ' + u.th + ': ' + name + ' unlocks "' + u.n + '" — ' + u.d + '!');
    }
  }
}

function hasAffinityUnlock(name, id) {
  const m = G.party.find(p => p.n === name);
  return !!(m && m.affinityBonuses && m.affinityBonuses.includes(id));
}

function getAffinityUnlockBonus(type) {
  let bonus = 0;
  for (let m of G.party) {
    if (!m.affinityBonuses) continue;
    for (let id of m.affinityBonuses) {
      const def = (G.affinityUnlocks[m.n] || []).find(u => u.id === id);
      if (def && def.fx[type]) bonus += def.fx[type];
    }
  }
  return bonus;
}

function applyAffinityUnlockFx(member, u) {
  const fx = u.fx;
  if (fx.hpPct) { const g = Math.floor(member.mhp * fx.hpPct); member.mhp += g; member.hp += g; }
  if (fx.hp) { member.mhp += fx.hp; member.hp += fx.hp; }
  if (fx.atk) member.atk += fx.atk;
  if (fx.def) member.def += fx.def;
}

function getAffinityColor(val) {
  if (val >= 70) return 'affinity-high';
  if (val >= 40) return 'affinity-mid';
  return 'affinity-low';
}

function checkAffinityDecay() {
  const now = Date.now();
  for (let name in G.affinity) {
    const aff = G.affinity[name];
    const hoursSince = (now - aff.lastInteract) / (1000 * 60 * 60);
    if (hoursSince > 24) {
      const decay = Math.floor(hoursSince / 24) * aff.decayRate * 10;
      aff.val = Math.max(0, aff.val - decay);
      if (decay > 0) {
        lg('💔 ' + name + ' feels neglected. Affinity -' + Math.floor(decay) + ' (' + aff.val + ')');
      }
      aff.lastInteract = now;
    }
  }
}

// ============================================================
// PARTY SYNERGIES
// ============================================================

function getActiveSynergies() {
  const active = G.party.filter(p => p.on && p.hp > 0).map(p => p.n);
  active.push('San');
  return G.partySynergies.filter(syn => 
    syn.members.every(m => active.includes(m))
  );
}

function getSynergyGoldBonus() {
  const syns = getActiveSynergies();
  let bonus = 0;
  for (let s of syns) {
    if (s.bonus.goldPct) bonus += s.bonus.goldPct;
  }
  return bonus;
}

// ============================================================
// PARTY GEAR (TRINKETS)
// ============================================================

const TRINKET_SHOP = [
  { n: 'Iron Shield',      atk: 0, def: 3, hp: 20, r: 'common',    price: 30 },
  { n: 'Lucky Charm',      atk: 1, def: 1, hp: 10, r: 'common',    price: 25 },
  { n: "Warrior's Band",   atk: 3, def: 0, hp: 15, r: 'uncommon',  price: 60 },
  { n: 'Guardian Pendant', atk: 0, def: 5, hp: 30, r: 'uncommon',  price: 80 },
  { n: 'Storm Crystal',    atk: 4, def: 2, hp: 10, r: 'rare',      price: 150 },
  { n: 'Phoenix Ember',    atk: 2, def: 2, hp: 50, r: 'rare',      price: 200 },
  { n: 'Void Shard',       atk: 6, def: 0, hp: 20, r: 'epic',      price: 400 },
  { n: 'Celestial Seal',   atk: 3, def: 4, hp: 40, r: 'epic',      price: 500 }
];

function buyTrinket(index) {
  const t = TRINKET_SHOP[index];
  if (!t) return;

  // Add haggle for trinkets too
  const aisyah = G.party.find(p => p.on && p.n === 'Aisyah' && p.hp > 0);
  const finalPrice = aisyah ? Math.floor(t.price * 0.9) : t.price;

  if (G.p.gold < finalPrice) { lg('Need ' + finalPrice + 'G'); return; }

  G.p.gold -= finalPrice;
  const item = {
    n: t.n, t: 'pgear', q: 1, r: t.r,
    atk: t.atk || 0, def: t.def || 0, hp: t.hp || 0,
    d: '+' + (t.atk || 0) + ' ATK, +' + (t.def || 0) + ' DEF, +' + (t.hp || 0) + ' HP'
  };
  addI(item);
  lg('🎁 Bought ' + t.n + ' for ' + finalPrice + 'G!' + (aisyah ? ' (Aisyah haggled 10% off!)' : ''));
  render();
}

function equipPartyGear(memberName, invIndex) {
  const member = G.party.find(p => p.n === memberName);
  if (!member) return;
  const item = G.p.inv[invIndex];
  if (!item || item.t !== 'pgear') return;

  if (member.gear) {
    lg('❌ ' + member.n + ' already has ' + member.gear.n + '!');
    return;
  }

  member.gear = {
    n: item.n,
    atk: item.atk || 0,
    def: item.def || 0,
    hp: item.hp || 0,
    mp: item.mp || 0,
    spd: item.spd || 0,
    d: item.d || 'Party gear.'
  };

  // Apply stats
  if (member.gear.hp) { member.mhp += member.gear.hp; member.hp += member.gear.hp; }
  if (member.gear.mp) { member.mmp = (member.mmp || member.mhp) + member.gear.mp; member.mp = (member.mp || 0) + member.gear.mp; }
  if (member.gear.atk) member.atk += member.gear.atk;
  if (member.gear.def) member.def += member.gear.def;
  if (member.gear.spd) member.spd += member.gear.spd;

  G.p.inv.splice(invIndex, 1);
  lg('⚔️ Equipped ' + item.n + ' on ' + member.n + '!');
  render();
}

function unequipPartyGear(memberName) {
  const member = G.party.find(p => p.n === memberName);
  if (!member || !member.gear) return;

  const gear = member.gear;
  // Remove stats
  if (gear.hp) { member.mhp -= gear.hp; member.hp = Math.min(member.mhp, member.hp); }
  if (gear.mp) { member.mmp -= gear.mp; member.mp = Math.min(member.mmp || member.mhp, member.mp || 0); }
  if (gear.atk) member.atk -= gear.atk;
  if (gear.def) member.def -= gear.def;
  if (gear.spd) member.spd -= gear.spd;

  // Return to inventory
  addI({
    n: gear.n, t: 'pgear', q: 1, r: 'uncommon',
    atk: gear.atk, def: gear.def, hp: gear.hp, mp: gear.mp, spd: gear.spd,
    d: gear.d
  });

  lg('📦 Unequipped ' + gear.n + ' from ' + member.n + '.');
  member.gear = null;
  render();
}

// ============================================================
// SOEL SPECIAL MECHANICS
// ============================================================

function soelBless(name) {
  if (G.soelBlessing) return;
  const m = G.party.find(p => p.n === name && p.on);
  if (!m) return;
  G.soelBlessing = { target: name, def: 10 };
  lg('🐱 Soel blesses ' + name + ' (+10 DEF until next rest).');
  render();
}

function getBlessDef(t) {
  return (G.soelBlessing && t && t.n === G.soelBlessing.target) ? (G.soelBlessing.def || 0) : 0;
}

function triggerSoelCommentary(triggerType) {
  if (!G.party[6].on) return;
  if (G.soelCommentCooldown > 0) { G.soelCommentCooldown--; return; }
  if (Math.random() > 0.35) return;
  const relevant = G.soelCommentary.filter(c => c.trigger === triggerType);
  if (relevant.length === 0) return;
  const comment = relevant[Math.floor(Math.random() * relevant.length)];
  G.lastSoelComment = comment;
  G.soelCommentCooldown = 3;
  lg('🐱 Soel: ' + comment.text);
}

function checkSoelFortune() {
  const soel = G.party.find(p => p.on && p.n === 'Soel');
  if (!soel || soel.hp <= 0) return;
  if (!G.soelFortuneCooldown) G.soelFortuneCooldown = 0;
  G.soelFortuneCooldown++;
  if (G.soelFortuneCooldown < 3) return;
  G.soelFortuneCooldown = 0;
  if (Math.random() > 0.25) return;

  const finds = [
    { type: 'g', amount: 15 + Math.floor(Math.random() * 25), msg: 'Soel paws at a loose stone. ' },
    { type: 'mat', item: 'Astral Dust', q: 1, msg: 'Soel bats at a shimmering dust mote. Astral Dust!' },
    { type: 'mat', item: 'Void Fragment', q: 1, msg: 'Soel hisses at a tear in reality. A Void Fragment falls out!' },
    { type: 'mat', item: 'Planar Essence', q: 1, msg: 'Soel chases an invisible spark. It solidifies into Planar Essence!' },
    { type: 'mat', item: 'Ember Shard', q: 1, msg: 'Soel recoils from a warm pebble. It's an Ember Shard!' }
  ];
  const find = finds[Math.floor(Math.random() * finds.length)];

  if (find.type === 'g') {
    G.p.gold += find.amount;
    lg('🐱 ' + find.msg + find.amount + 'G found!');
  } else {
    addI({ n: find.item, t: 'mat', q: find.q, r: 'common' });
    lg('🐱 ' + find.msg);
  }
}

// ============================================================
// BANTER / DIALOGUE
// ============================================================

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

// ============================================================
// REVIVE MEMBER (Temple)
// ============================================================

function reviveMember(name) {
  const member = G.party.find(p => p.n === name);
  if(!member || member.hp > 0) return;
  if(G.p.gold < 50) { lg('❌ Need 50G to revive!'); return; }
  G.p.gold -= 50;
  member.hp = Math.floor(member.mhp * 0.5);
  member.on = true;
  lg('⛪ ' + member.n + ' revived! HP: ' + member.hp + '/' + member.mhp);
  render();
}
