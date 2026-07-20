// ============================================================
// EXPLORATION.JS — Zone entry, enemy generation, events, secrets,
// mini-stories, endless grind room, dimensional instability
// ============================================================

// --- Enemy Templates & Dynamic Scaling ---

const ENEMY_TEMPLATES = {
  brute:     { hpMult: 1.4, atkMult: 0.8, defMult: 1.2, xpMult: 1.0, gMult: 1.0 },
  striker:   { hpMult: 0.8, atkMult: 1.4, defMult: 0.7, xpMult: 1.1, gMult: 1.1 },
  tank:      { hpMult: 1.6, atkMult: 0.6, defMult: 1.4, xpMult: 1.0, gMult: 0.9 },
  balanced:  { hpMult: 1.0, atkMult: 1.0, defMult: 1.0, xpMult: 1.0, gMult: 1.0 },
  elite:     { hpMult: 1.3, atkMult: 1.2, defMult: 1.1, xpMult: 1.3, gMult: 1.3 },
};

function generateEnemyStats(zoneLevel, templateKey, elem) {
  const tpl = ENEMY_TEMPLATES[templateKey] || ENEMY_TEMPLATES.balanced;
  const base = {
    hp: 15 + (zoneLevel * 12),
    atk: 3 + (zoneLevel * 1.8),
    def: 1 + Math.floor(zoneLevel * 1.2),
    xp: 8 + (zoneLevel * 10),
    g: 2 + (zoneLevel * 6)
  };
  return {
    hp: Math.floor(base.hp * tpl.hpMult),
    mhp: Math.floor(base.hp * tpl.hpMult),
    atk: Math.floor(base.atk * tpl.atkMult),
    def: Math.floor(base.def * tpl.defMult),
    xp: Math.floor(base.xp * tpl.xpMult),
    g: Math.floor(base.g * tpl.gMult),
    elem: elem || 'none'
  };
}

const ENEMY_REGISTRY = {
  'Goblin': null, 'Wolf': null, 'Slime': null,
  'Skeleton': null, 'Zombie': null, 'Ghost': null,
  'Fire Imp': null, 'Lava Slug': null, 'Ash Wraith': null,
  'Crystal Spider': null, 'Gem Golem': null, 'Shimmer Bat': null,
  'Storm Wraith': null, 'Lightning Hound': null, 'Thunder Knight': null,
  'Ice Elemental': null, 'Frost Wolf': null, 'Frozen Knight': null,
  'Void Beast': null, 'Shadow Demon': null, 'Abyssal Horror': null,
  'Drowned Sailor': null, 'Sea Serpent': null, 'Coral Golem': null,
  'Dragon Whelp': null, 'Ash Drake': null, 'Elder Wyrm': null,
  'Star Sentinel': null, 'Celestial Knight': null, 'Astral Lord': null,
  'Planar Wisp': null, 'Rift Stalker': null, 'Aether Golem': null,
  'Chronomancer': null, 'Void Weaver': null, 'Planar Leviathan': null,
  'Veil Wraith': null, 'Shardling': null, 'Echo Walker': null,
  'Ember Drake': null, 'Ash Titan': null, 'Flame Serpent': null,
  'Frost Lich': null, 'Glacial Behemoth': null, 'Snow Revenant': null,
  'Storm Titan': null, 'Lightning Wraith': null, 'Thunderborn': null,
  'Void Leviathan': null, 'Null Elemental': null, 'Hungering Maw': null,
  'Time Echo': null, 'Chronomancer Lord': null, 'Paradox Wraith': null,
  'Aether Bloom': null, 'Mana Leviathan': null, 'Crystal Serpent': null,
  'Convergence Avatar': null, 'Planar Chimera': null, 'Resonance Horror': null,
  'Nexus Guardian': null, 'Planar Titan': null,
  'Reality Weaver': { template: 'elite', elem: 'arcane', zoneLv: 21 },
  'Fracture Hound': { template: 'striker', elem: 'arcane', zoneLv: 21 },
  'Dimensional Drifter': { template: 'balanced', elem: 'void', zoneLv: 22 },
  'Chrono-Rat': { template: 'striker', elem: 'arcane', zoneLv: 22 },
  'Ember Wraith': { template: 'brute', elem: 'fire', zoneLv: 23 },
  'Ash Phantom': { template: 'striker', elem: 'fire', zoneLv: 23 },
  'Glacial Shade': { template: 'tank', elem: 'ice', zoneLv: 24 },
  'Frost Revenant': { template: 'balanced', elem: 'ice', zoneLv: 24 },
  'Astral Construct': { template: 'elite', elem: 'arcane', zoneLv: 22 },
  'Void Hound': { template: 'striker', elem: 'void', zoneLv: 22 },
  'Phase Walker': { template: 'balanced', elem: 'arcane', zoneLv: 22 },
  'Rift Rat': { template: 'striker', elem: 'void', zoneLv: 22 },
  'Flame Serpent': { template: 'striker', elem: 'fire', zoneLv: 23 },
  'Magma Titan': { template: 'tank', elem: 'fire', zoneLv: 23 },
  'Basilisk': { template: 'striker', elem: 'poison', zoneLv: 9 },
  'Venom Hound': { template: 'striker', elem: 'poison', zoneLv: 9 },
  'Mire Serpent': { template: 'balanced', elem: 'poison', zoneLv: 9 },
  'Fulcrum Warden': { template: 'tank', elem: 'arcane', zoneLv: 15 },
  'Stasis Construct': { template: 'balanced', elem: 'arcane', zoneLv: 15 },
  'Planar Mote': { template: 'striker', elem: 'arcane', zoneLv: 15 },
  'Magma Serpent': { template: 'striker', elem: 'fire', zoneLv: 24 },
  'Glass Wraith': { template: 'striker', elem: 'fire', zoneLv: 24 },
  'Scorch Titan': { template: 'tank', elem: 'fire', zoneLv: 24 },
  'Abyssal Leviathan Spawn': { template: 'brute', elem: 'ice', zoneLv: 25 },
  'Frozen Kraken': { template: 'elite', elem: 'ice', zoneLv: 25 },
  'Pressure Golem': { template: 'tank', elem: 'ice', zoneLv: 25 },
  'Storm Sovereign Remnant': { template: 'elite', elem: 'lightning', zoneLv: 26 },
  'Crown Wraith': { template: 'striker', elem: 'lightning', zoneLv: 26 },
  'Skyfall Construct': { template: 'balanced', elem: 'lightning', zoneLv: 26 },
  'Throne Keeper': { template: 'tank', elem: 'void', zoneLv: 27 },
  'Hollow Knight': { template: 'striker', elem: 'void', zoneLv: 27 },
  'Void Courtier': { template: 'balanced', elem: 'void', zoneLv: 27 },
  'Spire Archon': { template: 'elite', elem: 'arcane', zoneLv: 28 },
  'Reality Weaver Elite': { template: 'striker', elem: 'arcane', zoneLv: 28 },
  'Chrono Guardian': { template: 'tank', elem: 'arcane', zoneLv: 28 },
  'Apex Warden': { template: 'elite', elem: 'arcane', zoneLv: 29 },
  'Final Construct': { template: 'tank', elem: 'arcane', zoneLv: 29 },
  'The Gatekeeper': { template: 'elite', elem: 'arcane', zoneLv: 29 },
};

function getDynamicEnemyStats(name) {
  const reg = ENEMY_REGISTRY[name];
  if (!reg) return null;
  const stats = generateEnemyStats(reg.zoneLv, reg.template, reg.elem);
  return { ...stats, n: name };
}

// --- Planar Resonance ---

const PLANAR_ELEMENTS = ['fire', 'ice', 'lightning', 'void', 'arcane'];

// --- Weather System ---

function rollWeather() {
  const roll = Math.random();
  if (roll < 0.5) G.currentWeather = 'clear';
  else if (roll < 0.7) G.currentWeather = 'rain';
  else if (roll < 0.8) G.currentWeather = 'fog';
  else if (roll < 0.9) G.currentWeather = 'scorching';
  else G.currentWeather = 'starfall';
  const w = WEATHER[G.currentWeather];
  if (G.currentWeather !== 'clear') {
    lg('🌦️ Weather: ' + w.name + ' — ' + w.desc);
  }
}

// --- Exploration Events ---

function doExploreEvent() {
  if (!G.visitedWaterfalls) G.visitedWaterfalls = {};
  const possible = G.exploreEvents.filter(e => {
    if (Math.random() >= e.chance) return false;
    if (G.p.lvl < e.minLv) return false;
    if (e.oncePerZone && G.visitedWaterfalls[e.n + '_' + G.currentZone]) return false;
    return true;
  });
  if (possible.length === 0) return false;
  const evt = possible[Math.floor(Math.random() * possible.length)];
  lg('📖 EVENT: ' + evt.n + '!');
  lg('   ' + evt.d);
  if (evt.oncePerZone) {
    G.visitedWaterfalls[evt.n + '_' + G.currentZone] = true;
  }
  if (evt.gold) { G.p.gold += evt.gold; lg('💰 +' + evt.gold + 'G'); }
  if (evt.mp) {
    const oldMp = G.p.mp;
    G.p.mp = Math.min(G.p.mmp, G.p.mp + evt.mp);
    const gained = G.p.mp - oldMp;
    if (gained > 0) lg('💧 +' + gained + ' MP from the falling waters!');
  }
  if (evt.hp) {
    const oldHp = G.p.hp;
    G.p.hp = Math.min(G.p.mhp, G.p.hp + evt.hp);
    const gained = G.p.hp - oldHp;
    if (gained > 0) lg('💚 +' + gained + ' HP from the soothing mist!');
  }
  if (evt.item) { addI({ ...evt.item }); lg('🎁 Found: ' + evt.item.n); }
  if (evt.items) { for (let it of evt.items) { addI({ ...it }); lg('🎁 Found: ' + it.n); } }
  if (G.party.some(p => p.on && p.n === 'Eliz')) {
    lg('💚 Eliz cups the water in her hands. "It sings," she whispers.');
  }
  return true;
}

// --- Secret Areas ---

function canDiscoverSecret(zoneName) {
  const hasSenedra = G.party.some(p => p.on && p.n === 'Senedra');
  if (!hasSenedra) return false;
  const active = G.party.filter(p => p.on && p.hp > 0).map(p => p.n);
  active.push('San');
  if (!active.includes('Soel')) return false;
  if (!G.secretAreas[zoneName]) return false;
  return true;
}

function discoverSecret(zoneName) {
  const area = G.secretAreas[zoneName];
  if (!area) return false;
  G.secretArea.active = true;
  G.secretArea.zone = zoneName;
  G.secretArea.choice = null;
  G.secretArea.result = null;
  G.state = 'secret';
  lg('🔍 SECRET AREA: ' + area.name + '!');
  lg('   ' + area.desc);
  render();
  return true;
}

function rollSecretLoot(zoneName, choiceId) {
  const area = G.secretAreas[zoneName];
  const choice = area.choices.find(c => c.id === choiceId);
  if (!choice) return null;
  const roll = Math.random();
  let rarity = 'common';
  if (roll < choice.loot.rare) rarity = 'rare';
  else if (roll < choice.loot.rare + choice.loot.uncommon) rarity = 'uncommon';
  const pool = area.lootPool.filter(l => l.r === rarity);
  if (pool.length === 0) return null;
  const totalWeight = pool.reduce((s, l) => s + (l.weight || 1), 0);
  let wRoll = Math.random() * totalWeight;
  for (let item of pool) {
    wRoll -= (item.weight || 1);
    if (wRoll <= 0) return { ...item, q: item.q || 1 };
  }
  return pool[0];
}

function makeSecretChoice(choiceId) {
  if (!G.secretArea.active) return;
  const story = G.secretArea;
  const area = G.secretAreas[story.zone];
  const choice = area.choices.find(c => c.id === choiceId);
  if (!choice) return;
  story.choice = choiceId;
  if (choice.ambushChance && Math.random() < choice.ambushChance) {
    story.result = 'ambush';
    lg('💥 Ambush! Enemies swarm from the shadows!');
    story.active = false;
    G.state = 'combat';
    render();
    return;
  }
  const loot = rollSecretLoot(story.zone, choiceId);
  story.result = loot ? 'loot' : 'empty';
  if (loot) {
    addI({ ...loot });
    lg('🎁 Found: ' + loot.n + ' (' + loot.r + ')!');
  } else {
    lg('📦 Empty...');
  }
  G.p.xp += 10;
  lg('✨ +10 XP');
  lvlup();
  render();
}

function closeSecretArea() {
  G.secretArea.active = false;
  G.secretArea.zone = null;
  G.secretArea.choice = null;
  G.secretArea.result = null;
  G.state = 'explore';
  render();
}

// --- Mini-Stories ---

function checkMiniStory(zoneName) {
  const seenCount = Object.keys(G.currentMiniStory?.completed || {}).length || 0;
  const adjustedChance = Math.max(0.02, 0.10 - (seenCount * 0.02));
  if (Math.random() > adjustedChance) return false;
  const eligible = G.miniStories.filter(story => {
    if (!story.zones.includes(zoneName)) return false;
    if (story.reqParty && !G.party.some(p => p.on && p.n === story.reqParty)) return false;
    if (G.currentMiniStory && G.currentMiniStory.completed && G.currentMiniStory.completed[story.id]) return false;
    return true;
  });
  if (eligible.length === 0) return false;
  const story = eligible[Math.floor(Math.random() * eligible.length)];
  G.currentMiniStory = { ...story, choice: null, result: null, completed: G.currentMiniStory?.completed || {} };
  G.state = 'ministory';
  lg('🗣️ ENCOUNTER: ' + story.name + ' — ' + story.title);
  render();
  return true;
}

function makeMiniStoryChoice(choiceIdx) {
  if (!G.currentMiniStory) return;
  const story = G.currentMiniStory;
  const choice = story.choices[choiceIdx];
  if (!choice) return;
  story.choice = choiceIdx;
  if (choice.req && !G.party.some(p => p.on && p.n === choice.req)) {
    lg('❌ Requires ' + choice.req + ' in party!'); return;
  }
  if (choice.cost) {
    if (choice.cost.gold && G.p.gold < choice.cost.gold) { lg('❌ Need ' + choice.cost.gold + 'G'); return; }
    if (choice.cost.item) {
      const item = G.p.inv.find(i => i.n === choice.cost.item);
      if (!item || item.q < (choice.cost.qty || 1)) { lg('❌ Missing: ' + choice.cost.item); return; }
    }
  }
  if (choice.cost) {
    if (choice.cost.gold) { G.p.gold -= choice.cost.gold; lg('💰 -' + choice.cost.gold + 'G'); }
    if (choice.cost.item) {
      const item = G.p.inv.find(i => i.n === choice.cost.item);
      if (item) { item.q -= (choice.cost.qty || 1); if (item.q <= 0) G.p.inv.splice(G.p.inv.indexOf(item), 1); }
    }
  }
  if (choice.reward) {
    if (choice.reward.xp) { G.p.xp += choice.reward.xp; lg('✨ +' + choice.reward.xp + ' XP'); }
    if (choice.reward.gold) { G.p.gold += choice.reward.gold; lg('💰 +' + choice.reward.gold + 'G'); }
    if (choice.reward.affinity) { updateAffinity(choice.reward.affinity, choice.reward.amt); }
    if (choice.reward.item) { addI({ ...choice.reward.item }); lg('🎁 +' + choice.reward.item.q + ' ' + choice.reward.item.n); }
  }
  if (choice.response) lg('   ' + choice.response);
  story.completed[story.id] = true;
  story.result = 'done';
  lvlup();
  render();
}

function closeMiniStory() {
  G.currentMiniStory = null;
  G.state = 'explore';
  render();
}

// --- Endless Grind Room ---

function enterGrindRoom() {
  G.endlessGrind.active = true;
  G.endlessGrind.wave = 0;
  G.endlessGrind.totalKills = 0;
  G.endlessGrind.totalXp = 0;
  G.endlessGrind.totalGold = 0;
  G.endlessGrind.sessionStart = Date.now();
  G.endlessGrind.maxZoneLevel = Math.max(1, G.p.lvl);
  G.state = 'grind_room';
  lg('🌀 Entered the Endless Grind Room!');
  lg('   Battles will auto-chain. Survive as long as you can.');
  startGrindWave();
  render();
}

function exitGrindRoom() {
  const elapsed = Math.floor((Date.now() - (G.endlessGrind.sessionStart || Date.now())) / 1000);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  lg('🌀 Left the Grind Room.');
  lg('   Session: ' + mins + 'm ' + secs + 's | Waves: ' + G.endlessGrind.wave + ' | Kills: ' + G.endlessGrind.totalKills);
  lg('   Total XP: ' + G.endlessGrind.totalXp + ' | Total Gold: ' + G.endlessGrind.totalGold);
  G.endlessGrind.active = false;
  G.cbt.on = false;
  G.cbt.autoCombat = false;
  G.state = 'menu';
  render();
}

function leaveAndResetGrind() {
  G.endlessGrind.active = false;
  G.endlessGrind.wave = 0;
  G.endlessGrind.totalKills = 0;
  G.endlessGrind.totalXp = 0;
  G.endlessGrind.totalGold = 0;
  G.endlessGrind.sessionStart = null;
  G.endlessGrind.autoNext = true;
  G.cbt.on = false;
  G.cbt.autoCombat = false;
  G.state = 'menu';
  lg('🚪 Left the Grind Room. Progress reset — you can start fresh with new settings.');
  render();
}

function startGrindWave() {
  G.endlessGrind.wave++;
  G.cbt.on = true;
  G.cbt.turn = 0;
  G.cbt.en = [];
  G.state = 'combat';
  G.currentBoss = null;
  const wave = G.endlessGrind.wave;
  const playerLv = G.p.lvl;
  const diffMult = G.endlessGrind.difficultyMult[G.endlessGrind.difficulty] || 1.0;
  const maxZoneLv = Math.min(playerLv, Math.floor(wave / 3) + 1);
  const eligibleZones = G.zones.filter(z => z.lv <= maxZoneLv);
  const zone = eligibleZones[Math.floor(Math.random() * eligibleZones.length)] || G.zones[0];
  const baseCount = Math.floor(Math.random() * 2) + 1 + Math.floor(wave / 5);
  const enemyCount = Math.min(baseCount, 5);
  rollWeather();
  applyZoneBuffs(zone.n);
  checkDimensionalInstability();
  for (let i = 0; i < enemyCount; i++) {
    const enemyName = zone.en[Math.floor(Math.random() * zone.en.length)];
    let e = { n: enemyName, hp: 0, mhp: 0, atk: 0, def: 0, xp: 0, g: 0, elem: 'none', id: i, status: [] };
    const dynamicStats = getDynamicEnemyStats(enemyName);
    if (dynamicStats) {
      e = { ...e, ...dynamicStats };
    } else {
      const waveScale = 1 + (wave - 1) * 0.08;
      if (enemyName == 'Goblin') e = { ...e, hp: 25, mhp: 25, atk: 5, def: 2, xp: 12, g: 5, elem: 'none' };
      else if (enemyName == 'Wolf') e = { ...e, hp: 20, mhp: 20, atk: 7, def: 1, xp: 10, g: 3 };
      else if (enemyName == 'Slime') e = { ...e, hp: 15, mhp: 15, atk: 3, def: 3, xp: 8, g: 2 };
      else if (enemyName == 'Skeleton') e = { ...e, hp: 39, mhp: 39, atk: 6, def: 3, xp: 20, g: 14, elem: 'none' };
      else if (enemyName == 'Zombie') e = { ...e, hp: 44, mhp: 44, atk: 4, def: 4, xp: 20, g: 12, elem: 'none' };
      else if (enemyName == 'Ghost') e = { ...e, hp: 25, mhp: 25, atk: 8, def: 2, xp: 22, g: 15, elem: 'none' };
      else if (enemyName == 'Crystal Spider') e = { ...e, hp: 30, mhp: 30, atk: 10, def: 3, xp: 24, g: 17, elem: 'none' };
      else if (enemyName == 'Gem Golem') e = { ...e, hp: 60, mhp: 60, atk: 5, def: 6, xp: 20, g: 15, elem: 'none' };
      else if (enemyName == 'Shimmer Bat') e = { ...e, hp: 51, mhp: 51, atk: 8, def: 4, xp: 20, g: 14, elem: 'none' };
      else if (enemyName == 'Fire Imp') e = { ...e, hp: 34, mhp: 34, atk: 12, def: 3, xp: 26, g: 19, elem: 'fire' };
      else if (enemyName == 'Lava Slug') e = { ...e, hp: 61, mhp: 61, atk: 5, def: 5, xp: 24, g: 17, elem: 'fire' };
      else if (enemyName == 'Ash Wraith') e = { ...e, hp: 51, mhp: 51, atk: 8, def: 4, xp: 24, g: 14, elem: 'fire' };
      else if (enemyName == 'Storm Wraith') e = { ...e, hp: 63, mhp: 63, atk: 10, def: 6, xp: 28, g: 21, elem: 'lightning' };
      else if (enemyName == 'Lightning Hound') e = { ...e, hp: 36, mhp: 36, atk: 17, def: 3, xp: 30, g: 23, elem: 'lightning' };
      else if (enemyName == 'Thunder Knight') e = { ...e, hp: 58, mhp: 58, atk: 13, def: 5, xp: 36, g: 23, elem: 'lightning' };
      else if (enemyName == 'Ice Elemental') e = { ...e, hp: 82, mhp: 82, atk: 7, def: 8, xp: 28, g: 21, elem: 'ice' };
      else if (enemyName == 'Frost Wolf') e = { ...e, hp: 46, mhp: 46, atk: 18, def: 4, xp: 33, g: 25, elem: 'ice' };
      else if (enemyName == 'Frozen Knight') e = { ...e, hp: 74, mhp: 74, atk: 14, def: 6, xp: 39, g: 25, elem: 'ice' };
      else if (enemyName == 'Drowned Sailor') e = { ...e, hp: 75, mhp: 75, atk: 12, def: 7, xp: 32, g: 26, elem: 'none' };
      else if (enemyName == 'Sea Serpent') e = { ...e, hp: 42, mhp: 42, atk: 21, def: 4, xp: 35, g: 29, elem: 'none' };
      else if (enemyName == 'Coral Golem') e = { ...e, hp: 90, mhp: 90, atk: 9, def: 9, xp: 32, g: 23, elem: 'none' };
      else if (enemyName == 'Void Beast') e = { ...e, hp: 48, mhp: 48, atk: 24, def: 5, xp: 39, g: 31, elem: 'void' };
      else if (enemyName == 'Shadow Demon') e = { ...e, hp: 87, mhp: 87, atk: 13, def: 7, xp: 36, g: 26, elem: 'void' };
      else if (enemyName == 'Abyssal Horror') e = { ...e, hp: 70, mhp: 70, atk: 16, def: 7, xp: 46, g: 33, elem: 'void' };
      else if (enemyName == 'Dragon Whelp') e = { ...e, hp: 99, mhp: 99, atk: 14, def: 8, xp: 40, g: 30, elem: 'fire' };
      else if (enemyName == 'Ash Drake') e = { ...e, hp: 55, mhp: 55, atk: 25, def: 5, xp: 44, g: 35, elem: 'fire' };
      else if (enemyName == 'Elder Wyrm') e = { ...e, hp: 89, mhp: 89, atk: 19, def: 7, xp: 52, g: 35, elem: 'fire' };
      else if (enemyName == 'Star Sentinel') e = { ...e, hp: 111, mhp: 111, atk: 15, def: 9, xp: 44, g: 32, elem: 'arcane' };
      else if (enemyName == 'Celestial Knight') e = { ...e, hp: 100, mhp: 100, atk: 21, def: 8, xp: 57, g: 39, elem: 'arcane' };
      else if (enemyName == 'Astral Lord') e = { ...e, hp: 100, mhp: 100, atk: 21, def: 8, xp: 57, g: 39, elem: 'arcane' };
      else if (enemyName == 'Planar Wisp') e = { ...e, hp: 123, mhp: 123, atk: 16, def: 10, xp: 48, g: 34, elem: 'arcane' };
      else if (enemyName == 'Rift Stalker') e = { ...e, hp: 68, mhp: 68, atk: 28, def: 6, xp: 53, g: 38, elem: 'arcane' };
      else if (enemyName == 'Aether Golem') e = { ...e, hp: 148, mhp: 148, atk: 10, def: 12, xp: 48, g: 31, elem: 'arcane' };
      else if (enemyName == 'Chronomancer') e = { ...e, hp: 119, mhp: 119, atk: 20, def: 9, xp: 62, g: 40, elem: 'arcane' };
      else if (enemyName == 'Void Weaver') e = { ...e, hp: 68, mhp: 68, atk: 28, def: 6, xp: 53, g: 38, elem: 'void' };
      else if (enemyName == 'Planar Leviathan') e = { ...e, hp: 119, mhp: 119, atk: 20, def: 9, xp: 62, g: 40, elem: 'arcane' };
      else if (enemyName == 'Veil Wraith') e = { ...e, hp: 135, mhp: 135, atk: 18, def: 11, xp: 52, g: 36, elem: 'arcane' };
      else if (enemyName == 'Shardling') e = { ...e, hp: 75, mhp: 75, atk: 31, def: 7, xp: 57, g: 40, elem: 'arcane' };
      else if (enemyName == 'Echo Walker') e = { ...e, hp: 135, mhp: 135, atk: 18, def: 11, xp: 52, g: 36, elem: 'arcane' };
      else if (enemyName == 'Ember Drake') e = { ...e, hp: 82, mhp: 82, atk: 34, def: 7, xp: 62, g: 44, elem: 'fire' };
      else if (enemyName == 'Ash Titan') e = { ...e, hp: 185, mhp: 185, atk: 11, def: 14, xp: 56, g: 38, elem: 'fire' };
      else if (enemyName == 'Flame Serpent') e = { ...e, hp: 123, mhp: 123, atk: 19, def: 10, xp: 56, g: 36, elem: 'fire' };
      else if (enemyName == 'Frost Lich') e = { ...e, hp: 148, mhp: 148, atk: 23, def: 10, xp: 72, g: 46, elem: 'ice' };
      else if (enemyName == 'Glacial Behemoth') e = { ...e, hp: 205, mhp: 205, atk: 11, def: 15, xp: 62, g: 40, elem: 'ice' };
      else if (enemyName == 'Snow Revenant') e = { ...e, hp: 147, mhp: 147, atk: 19, def: 11, xp: 62, g: 40, elem: 'ice' };
      else if (enemyName == 'Storm Titan') e = { ...e, hp: 216, mhp: 216, atk: 13, def: 16, xp: 68, g: 44, elem: 'lightning' };
      else if (enemyName == 'Lightning Wraith') e = { ...e, hp: 96, mhp: 96, atk: 37, def: 8, xp: 75, g: 50, elem: 'lightning' };
      else if (enemyName == 'Thunderborn') e = { ...e, hp: 156, mhp: 156, atk: 24, def: 11, xp: 78, g: 50, elem: 'lightning' };
      else if (enemyName == 'Void Leviathan') e = { ...e, hp: 172, mhp: 172, atk: 26, def: 12, xp: 83, g: 54, elem: 'void' };
      else if (enemyName == 'Null Elemental') e = { ...e, hp: 123, mhp: 123, atk: 19, def: 11, xp: 64, g: 44, elem: 'void' };
      else if (enemyName == 'Hungering Maw') e = { ...e, hp: 222, mhp: 222, atk: 13, def: 16, xp: 68, g: 40, elem: 'void' };
      else if (enemyName == 'Time Echo') e = { ...e, hp: 135, mhp: 135, atk: 21, def: 12, xp: 68, g: 46, elem: 'arcane' };
      else if (enemyName == 'Chronomancer Lord') e = { ...e, hp: 174, mhp: 174, atk: 26, def: 12, xp: 88, g: 56, elem: 'arcane' };
      else if (enemyName == 'Paradox Wraith') e = { ...e, hp: 107, mhp: 107, atk: 41, def: 9, xp: 77, g: 52, elem: 'arcane' };
      else if (enemyName == 'Aether Bloom') e = { ...e, hp: 147, mhp: 147, atk: 22, def: 12, xp: 72, g: 48, elem: 'arcane' };
      else if (enemyName == 'Mana Leviathan') e = { ...e, hp: 240, mhp: 240, atk: 14, def: 17, xp: 72, g: 44, elem: 'arcane' };
      else if (enemyName == 'Crystal Serpent') e = { ...e, hp: 117, mhp: 117, atk: 43, def: 9, xp: 81, g: 54, elem: 'arcane' };
      else if (enemyName == 'Convergence Avatar') e = { ...e, hp: 196, mhp: 196, atk: 29, def: 13, xp: 94, g: 60, elem: 'arcane' };
      else if (enemyName == 'Planar Chimera') e = { ...e, hp: 159, mhp: 159, atk: 22, def: 13, xp: 76, g: 50, elem: 'arcane' };
      else if (enemyName == 'Resonance Horror') e = { ...e, hp: 126, mhp: 126, atk: 46, def: 10, xp: 85, g: 56, elem: 'arcane' };
      else if (enemyName == 'Nexus Guardian') e = { ...e, hp: 264, mhp: 264, atk: 15, def: 18, xp: 80, g: 48, elem: 'arcane' };
      else if (enemyName == 'Planar Titan') e = { ...e, hp: 214, mhp: 214, atk: 31, def: 14, xp: 100, g: 64, elem: 'arcane' };
      else e = { ...e, hp: 30, mhp: 30, atk: 6, def: 2, xp: 12, g: 5, elem: 'none' };
      e.hp = Math.floor(e.hp * waveScale * diffMult);
      e.mhp = e.hp;
      e.atk = Math.floor(e.atk * waveScale * diffMult);
      e.def = Math.floor(e.def * waveScale);
      e.xp = Math.floor(e.xp * waveScale);
      e.g = Math.floor(e.g * waveScale);
    }
    G.cbt.en.push(e);
  }
  if (wave % 10 === 0 && wave > 0) {
    const bossPool = G.bosses.filter(b => {
      const zone = G.zones.find(z => z.n === b.zone);
      return zone && zone.lv <= maxZoneLv;
    });
    if (bossPool.length > 0) {
      const boss = JSON.parse(JSON.stringify(bossPool[Math.floor(Math.random() * bossPool.length)]));
      boss.id = 99;
      boss.hp = Math.floor(boss.hp * diffMult * (1 + (wave / 50)));
      boss.mhp = boss.hp;
      boss.atk = Math.floor(boss.atk * diffMult * (1 + (wave / 50)));
      G.currentBoss = boss;
      G.cbt.en.push(boss);
      lg('⚠️ BOSS WAVE ' + wave + ': ' + boss.n + ' appears!');
    }
  }
  lg('🌀 Wave ' + wave + ': ' + enemyCount + ' enemies from ' + zone.n + '!');
  G.cbt.sk = 0;
  G.cbt.tg = 0;
  if (G.endlessGrind.autoNext && !G.cbt.autoCombat) {
    G.cbt.autoCombat = true;
    G.autoCombatHeartbeat = Date.now();
    setTimeout(doAutoCombatTick, 500);
  }
  triggerSoelCommentary('explore');
  checkSoelFortune();
  render();
}

function handleGrindVictory() {
  clearZoneBuffs();
  const txp = G.cbt.en.reduce((s, e) => s + e.xp, 0);
  let tg2 = G.cbt.en.reduce((s, e) => s + e.g, 0);
  const goldBonus = getSynergyGoldBonus();
  if (goldBonus > 0) tg2 = Math.floor(tg2 * (1 + goldBonus));
  G.p.xp += txp;
  G.p.gold += tg2;
  checkDailyQuests('earn_gold', tg2);
  G.p.kills += G.cbt.en.length;
  checkDailyQuests('kill', G.cbt.en.length);
  if (G.party.filter(p => p.on).length >= 3) checkDailyQuests('full_party_battle', 1);
  G.endlessGrind.totalKills += G.cbt.en.length;
  G.endlessGrind.totalXp += txp;
  G.endlessGrind.totalGold += tg2;
  if (G.currentBoss) G.p.bossKills = (G.p.bossKills || 0) + 1;
  if (G.p.hp === 1) G.p.survivedCritical = true;
  checkAchievements();
  lg('🎉 Wave ' + G.endlessGrind.wave + ' cleared! +' + txp + ' XP, +' + tg2 + 'G');
  lvlup();
  checkQ();
  const z = G.zones.find(z => z.en.includes(G.cbt.en[0]?.n));
  if (z) {
    const l = z.loot[Math.floor(Math.random() * z.loot.length)];
    addI({ n: l, t: 'mat', q: 1, r: 'common' });
    if (Math.random() < 0.5) addLootFromCombat(z.n);
    addRuneLoot(z.n);
  }
  for (let p of G.party) { if (p.on && p.hp > 0) updateAffinity(p.n, 1); }
  const aisyahQuest = G.quests.find(q => q.t === 'aisyah_battle' && !q.done);
  if (aisyahQuest && G.party.find(p => p.on && p.n === 'Aisyah')) {
    aisyahQuest.c += G.cbt.en.length;
    if (aisyahQuest.c >= aisyahQuest.need) checkQ();
  }
  const joelQuest = G.quests.find(q => q.t === 'joel_battle' && !q.done);
  if (joelQuest && G.party.find(p => p.on && p.n === 'Joel')) {
    joelQuest.c += G.cbt.en.length;
    if (joelQuest.c >= joelQuest.need) checkQ();
  }
  for (let q of G.quests) {
    if (q.done) continue;
    if (q.hidden && !q.revealed) continue;
    if (q.t === 'kill_specific') {
      const killedInThisFight = G.cbt.en.filter(e => e.hp <= 0 && e.n === q.target).length;
      if (killedInThisFight > 0) {
        q.c += killedInThisFight;
        if (q.c >= q.need) checkQ();
      }
    }
    if (q.t === 'boss_specific' && G.currentBoss && G.currentBoss.n === q.target) {
      q.c++;
      if (q.c >= q.need) checkQ();
    }
  }
  G.currentBoss = null;
  G.cbt.autoCombat = false;
  G.cbt.on = false;
  if (G.endlessGrind.autoNext) {
    lg('⏳ Next wave incoming...');
    setTimeout(() => {
      if (G.endlessGrind.active) startGrindWave();
    }, 1500);
  } else {
    G.state = 'grind_room';
  }
  render();
}

function toggleGrindDifficulty() {
  const diffs = ['normal', 'hard', 'nightmare'];
  const idx = diffs.indexOf(G.endlessGrind.difficulty);
  G.endlessGrind.difficulty = diffs[(idx + 1) % diffs.length];
  lg('🌀 Difficulty: ' + G.endlessGrind.difficulty.toUpperCase() + ' (×' + G.endlessGrind.difficultyMult[G.endlessGrind.difficulty] + ')');
  render();
}

function toggleAutoNext() {
  G.endlessGrind.autoNext = !G.endlessGrind.autoNext;
  lg('🌀 Auto-next wave: ' + (G.endlessGrind.autoNext ? 'ON' : 'OFF'));
  render();
}

// --- Dimensional Instability ---

function checkDimensionalInstability() {
  if (G.currentRift) {
    G.riftFightsRemaining--;
    if (G.riftFightsRemaining <= 0) {
      RIFT_EVENTS[G.currentRift].remove();
      G.currentRift = null;
    }
    return;
  }
  G.riftCounter++;
  if (G.riftCounter >= G.riftTriggerAt) {
    G.riftCounter = 0;
    const riftRed = getTalentEffect('rift_walker') ? 1 : 0;
    G.riftTriggerAt = Math.max(2, 3 + Math.floor(Math.random() * 3) - riftRed);
    const keys = Object.keys(RIFT_EVENTS);
    G.currentRift = keys[Math.floor(Math.random() * keys.length)];
    G.riftFightsRemaining = 2 + Math.floor(Math.random() * 2);
    RIFT_EVENTS[G.currentRift].apply();
  }
}

function getRiftMultiplier() {
  if (!G.currentRift) return 1;
  return RIFT_EVENTS[G.currentRift].dmgMult || 1;
}

function applyVoidBleed() {
  if (G.currentRift !== 'void') return;
  const drain = RIFT_EVENTS.void.hpDrain * getTalentMultiplier('voidDrain');
  const hpLoss = Math.max(1, Math.floor(G.p.mhp * drain));
  G.p.hp = Math.max(1, G.p.hp - hpLoss);
  lg('🌑 Void Bleed: San loses ' + hpLoss + ' HP!');
  for (let p of G.party) {
    if (p.on && p.hp > 0) {
      const pLoss = Math.max(1, Math.floor(p.mhp * drain));
      p.hp = Math.max(1, p.hp - pLoss);
      lg('🌑 Void Bleed: ' + p.n + ' loses ' + pLoss + ' HP!');
    }
  }
}

function getRiftStatus() {
  if (!G.currentRift) return null;
  const rift = RIFT_EVENTS[G.currentRift];
  return {
    name: rift.name,
    icon: rift.icon,
    desc: rift.desc,
    color: rift.color,
    fightsLeft: G.riftFightsRemaining
  };
}

// --- Zone Entry (sc = start combat / enter zone) ---

function sc(zi) {
  const z = G.zones[zi];
  if (Math.random() < 0.3 && doExploreEvent()) {
    G.state = 'explore';
    render();
    return;
  }
  checkNPCUnlocks();
  if (Math.random() < 0.15 && canDiscoverSecret(z.n)) {
    if (discoverSecret(z.n)) return;
  }
  if (checkMiniStory(z.n)) return;
  for (let entry of G.storyJournal.entries) {
    if (entry.unlockType === 'zone' && z.n === entry.unlockAt && !G.storyJournal.unlocked.includes(entry.id)) {
      G.storyJournal.unlocked.push(entry.id);
      lg('📖 Journal unlocked: ' + entry.title + '!');
    }
  }
  G.cbt.on = true; G.cbt.turn = 0; G.cbt.en = []; G.state = 'combat';
  checkDimensionalInstability();
  rollWeather();
  applyZoneBuffs(z.n);
  const bossChance = Math.random();
  let isBoss = false;
  if (bossChance < 0.08 && G.p.lvl >= z.lv + 2) {
    const boss = G.bosses.find(b => b.zone === z.n);
    if (boss) {
      isBoss = true;
      G.currentBoss = JSON.parse(JSON.stringify(boss));
      G.currentBoss.id = 99;
      G.cbt.en.push(G.currentBoss);
      lg('⚠️ BOSS APPEARS: ' + boss.n + '!');
      lg('   ' + boss.desc);
    }
  }
  if (!isBoss) {
    const ec = Math.floor(Math.random() * 2) + 1 + Math.floor(z.lv / 3);
    for (let i = 0; i < ec; i++) {
      const t = z.en[Math.floor(Math.random() * z.en.length)];
      let e = { n: t, hp: 0, mhp: 0, atk: 0, def: 0, xp: 0, g: 0 };
      const dynamicStats = getDynamicEnemyStats(t);
      if (dynamicStats) {
        e = { ...e, ...dynamicStats };
      }
      else if (t == 'Goblin') e = { ...e, hp: 25, mhp: 25, atk: 5, def: 2, xp: 12, g: 5, elem: 'none' };
      else if (t == 'Wolf') e = { ...e, hp: 20, mhp: 20, atk: 7, def: 1, xp: 10, g: 3 };
      else if (t == 'Slime') e = { ...e, hp: 15, mhp: 15, atk: 3, def: 3, xp: 8, g: 2 };
      else if (t == 'Skeleton') e = { ...e, hp: 39, mhp: 39, atk: 6, def: 3, xp: 20, g: 14, elem: 'none' };
      else if (t == 'Zombie') e = { ...e, hp: 44, mhp: 44, atk: 4, def: 4, xp: 20, g: 12, elem: 'none' };
      else if (t == 'Ghost') e = { ...e, hp: 25, mhp: 25, atk: 8, def: 2, xp: 22, g: 15, elem: 'none' };
      else if (t == 'Crystal Spider') e = { ...e, hp: 30, mhp: 30, atk: 10, def: 3, xp: 24, g: 17, elem: 'none' };
      else if (t == 'Gem Golem') e = { ...e, hp: 60, mhp: 60, atk: 5, def: 6, xp: 20, g: 15, elem: 'none' };
      else if (t == 'Shimmer Bat') e = { ...e, hp: 51, mhp: 51, atk: 8, def: 4, xp: 20, g: 14, elem: 'none' };
      else if (t == 'Fire Imp') e = { ...e, hp: 34, mhp: 34, atk: 12, def: 3, xp: 26, g: 19, elem: 'fire' };
      else if (t == 'Lava Slug') e = { ...e, hp: 61, mhp: 61, atk: 5, def: 5, xp: 24, g: 17, elem: 'fire' };
      else if (t == 'Ash Wraith') e = { ...e, hp: 51, mhp: 51, atk: 8, def: 4, xp: 24, g: 14, elem: 'fire' };
      else if (t == 'Storm Wraith') e = { ...e, hp: 63, mhp: 63, atk: 10, def: 6, xp: 28, g: 21, elem: 'lightning' };
      else if (t == 'Lightning Hound') e = { ...e, hp: 36, mhp: 36, atk: 17, def: 3, xp: 30, g: 23, elem: 'lightning' };
      else if (t == 'Thunder Knight') e = { ...e, hp: 58, mhp: 58, atk: 13, def: 5, xp: 36, g: 23, elem: 'lightning' };
      else if (t == 'Ice Elemental') e = { ...e, hp: 82, mhp: 82, atk: 7, def: 8, xp: 28, g: 21, elem: 'ice' };
      else if (t == 'Frost Wolf') e = { ...e, hp: 46, mhp: 46, atk: 18, def: 4, xp: 33, g: 25, elem: 'ice' };
      else if (t == 'Frozen Knight') e = { ...e, hp: 74, mhp: 74, atk: 14, def: 6, xp: 39, g: 25, elem: 'ice' };
      else if (t == 'Drowned Sailor') e = { ...e, hp: 75, mhp: 75, atk: 12, def: 7, xp: 32, g: 26, elem: 'none' };
      else if (t == 'Sea Serpent') e = { ...e, hp: 42, mhp: 42, atk: 21, def: 4, xp: 35, g: 29, elem: 'none' };
      else if (t == 'Coral Golem') e = { ...e, hp: 90, mhp: 90, atk: 9, def: 9, xp: 32, g: 23, elem: 'none' };
      else if (t == 'Void Beast') e = { ...e, hp: 48, mhp: 48, atk: 24, def: 5, xp: 39, g: 31, elem: 'void' };
      else if (t == 'Shadow Demon') e = { ...e, hp: 87, mhp: 87, atk: 13, def: 7, xp: 36, g: 26, elem: 'void' };
      else if (t == 'Abyssal Horror') e = { ...e, hp: 70, mhp: 70, atk: 16, def: 7, xp: 46, g: 33, elem: 'void' };
      else if (t == 'Dragon Whelp') e = { ...e, hp: 99, mhp: 99, atk: 14, def: 8, xp: 40, g: 30, elem: 'fire' };
      else if (t == 'Ash Drake') e = { ...e, hp: 55, mhp: 55, atk: 25, def: 5, xp: 44, g: 35, elem: 'fire' };
      else if (t == 'Elder Wyrm') e = { ...e, hp: 89, mhp: 89, atk: 19, def: 7, xp: 52, g: 35, elem: 'fire' };
      else if (t == 'Star Sentinel') e = { ...e, hp: 111, mhp: 111, atk: 15, def: 9, xp: 44, g: 32, elem: 'arcane' };
      else if (t == 'Celestial Knight') e = { ...e, hp: 100, mhp: 100, atk: 21, def: 8, xp: 57, g: 39, elem: 'arcane' };
      else if (t == 'Astral Lord') e = { ...e, hp: 100, mhp: 100, atk: 21, def: 8, xp: 57, g: 39, elem: 'arcane' };
      else if (t == 'Planar Wisp') e = { ...e, hp: 123, mhp: 123, atk: 16, def: 10, xp: 48, g: 34, elem: 'arcane' };
      else if (t == 'Rift Stalker') e = { ...e, hp: 68, mhp: 68, atk: 28, def: 6, xp: 53, g: 38, elem: 'arcane' };
      else if (t == 'Aether Golem') e = { ...e, hp: 148, mhp: 148, atk: 10, def: 12, xp: 48, g: 31, elem: 'arcane' };
      else if (t == 'Chronomancer') e = { ...e, hp: 119, mhp: 119, atk: 20, def: 9, xp: 62, g: 40, elem: 'arcane' };
      else if (t == 'Void Weaver') e = { ...e, hp: 68, mhp: 68, atk: 28, def: 6, xp: 53, g: 38, elem: 'void' };
      else if (t == 'Planar Leviathan') e = { ...e, hp: 119, mhp: 119, atk: 20, def: 9, xp: 62, g: 40, elem: 'arcane' };
      else if (t == 'Veil Wraith') e = { ...e, hp: 135, mhp: 135, atk: 18, def: 11, xp: 52, g: 36, elem: 'arcane' };
      else if (t == 'Shardling') e = { ...e, hp: 75, mhp: 75, atk: 31, def: 7, xp: 57, g: 40, elem: 'arcane' };
      else if (t == 'Echo Walker') e = { ...e, hp: 135, mhp: 135, atk: 18, def: 11, xp: 52, g: 36, elem: 'arcane' };
      else if (t == 'Ember Drake') e = { ...e, hp: 82, mhp: 82, atk: 34, def: 7, xp: 62, g: 44, elem: 'fire' };
      else if (t == 'Ash Titan') e = { ...e, hp: 185, mhp: 185, atk: 11, def: 14, xp: 56, g: 38, elem: 'fire' };
      else if (t == 'Flame Serpent') e = { ...e, hp: 123, mhp: 123, atk: 19, def: 10, xp: 56, g: 36, elem: 'fire' };
      else if (t == 'Frost Lich') e = { ...e, hp: 148, mhp: 148, atk: 23, def: 10, xp: 72, g: 46, elem: 'ice' };
      else if (t == 'Glacial Behemoth') e = { ...e, hp: 205, mhp: 205, atk: 11, def: 15, xp: 62, g: 40, elem: 'ice' };
      else if (t == 'Snow Revenant') e = { ...e, hp: 147, mhp: 147, atk: 19, def: 11, xp: 62, g: 40, elem: 'ice' };
      else if (t == 'Storm Titan') e = { ...e, hp: 216, mhp: 216, atk: 13, def: 16, xp: 68, g: 44, elem: 'lightning' };
      else if (t == 'Lightning Wraith') e = { ...e, hp: 96, mhp: 96, atk: 37, def: 8, xp: 75, g: 50, elem: 'lightning' };
      else if (t == 'Thunderborn') e = { ...e, hp: 156, mhp: 156, atk: 24, def: 11, xp: 78, g: 50, elem: 'lightning' };
      else if (t == 'Void Leviathan') e = { ...e, hp: 172, mhp: 172, atk: 26, def: 12, xp: 83, g: 54, elem: 'void' };
      else if (t == 'Null Elemental') e = { ...e, hp: 123, mhp: 123, atk: 19, def: 11, xp: 64, g: 44, elem: 'void' };
      else if (t == 'Hungering Maw') e = { ...e, hp: 222, mhp: 222, atk: 13, def: 16, xp: 68, g: 40, elem: 'void' };
      else if (t == 'Time Echo') e = { ...e, hp: 135, mhp: 135, atk: 21, def: 12, xp: 68, g: 46, elem: 'arcane' };
      else if (t == 'Chronomancer Lord') e = { ...e, hp: 174, mhp: 174, atk: 26, def: 12, xp: 88, g: 56, elem: 'arcane' };
      else if (t == 'Paradox Wraith') e = { ...e, hp: 107, mhp: 107, atk: 41, def: 9, xp: 77, g: 52, elem: 'arcane' };
      else if (t == 'Aether Bloom') e = { ...e, hp: 147, mhp: 147, atk: 22, def: 12, xp: 72, g: 48, elem: 'arcane' };
      else if (t == 'Mana Leviathan') e = { ...e, hp: 240, mhp: 240, atk: 14, def: 17, xp: 72, g: 44, elem: 'arcane' };
      else if (t == 'Crystal Serpent') e = { ...e, hp: 117, mhp: 117, atk: 43, def: 9, xp: 81, g: 54, elem: 'arcane' };
      else if (t == 'Convergence Avatar') e = { ...e, hp: 196, mhp: 196, atk: 29, def: 13, xp: 94, g: 60, elem: 'arcane' };
      else if (t == 'Planar Chimera') e = { ...e, hp: 159, mhp: 159, atk: 22, def: 13, xp: 76, g: 50, elem: 'arcane' };
      else if (t == 'Resonance Horror') e = { ...e, hp: 126, mhp: 126, atk: 46, def: 10, xp: 85, g: 56, elem: 'arcane' };
      else if (t == 'Nexus Guardian') e = { ...e, hp: 264, mhp: 264, atk: 15, def: 18, xp: 80, g: 48, elem: 'arcane' };
      else if (t == 'Planar Titan') e = { ...e, hp: 214, mhp: 214, atk: 31, def: 14, xp: 100, g: 64, elem: 'arcane' };
      else if (t == 'The Nexus Planarch') e = { ...e, hp: 1200, mhp: 1200, atk: 35, def: 22, xp: 5000, g: 4000, elem: 'arcane', mechanic: 'nexus_planarch', shiftTurn: 4, phases: 5, currentPhase: 1, desc: 'The true form of the Planarch at the heart of all dimensions. Each phase embodies a different planar element. Defeat all five to sever the rift forever.', nexus: true };
      else e = { ...e, hp: 30, mhp: 30, atk: 6, def: 2, xp: 12, g: 5, elem: 'none' };
      e.id = i; e.status = []; G.cbt.en.push(e);
    }
    lg('Entered ' + z.n + '! ' + ec + ' enemies appear!');
  }
  triggerSoelCommentary('explore');
  checkSoelFortune();
  for (let q of G.quests) {
    if (!q.done && !q.expired && q.t === 'explore_with' && G.party.find(p => p.on && p.n === q.reqParty)) {
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
  G.cbt.sk = 0; G.cbt.tg = 0; checkQ(); render();
}
