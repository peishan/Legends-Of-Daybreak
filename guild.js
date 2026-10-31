/* =========================================================================
   Guild Hall: Guild Contracts, Guild Rank and shop, and the Temple Hunts
   (ported from V2). Loaded after game.js, which provides GameState, ZONES,
   curveAt, grantXP, showScreen, spawnEnemySprite and the battle plumbing.
   ========================================================================= */

/* ---------- Guild: ranks, bonuses, contracts ---------- */
const GUILD_RANKS = [
  { rank:1,  name:'Guild Initiate',   repReq:0,     desc:'Joined the Guild. The Contract Board is open to you.' },
  { rank:2,  name:'Guild Associate',  repReq:150,   desc:'+5% gold from every victory.', gold:.05 },
  { rank:3,  name:'Guild Adventurer', repReq:500,   desc:'+5% XP from every victory.', xp:.05 },
  { rank:4,  name:'Guild Veteran',    repReq:1200,  desc:'Another +5% gold and +5% XP.', gold:.05, xp:.05 },
  { rank:5,  name:'Guild Champion',   repReq:2500,  desc:'+5% crit chance in combat.', crit:.05 },
  { rank:6,  name:'Guildmaster',      repReq:5000,  desc:'Another +10% gold and +10% XP.', gold:.10, xp:.10 },
  { rank:7,  name:'Guild Legend',     repReq:10000, desc:'Another +10% gold.', gold:.10 },
  { rank:8,  name:'Guild Paragon',    repReq:20000, desc:'Another +10% XP and +5% crit chance.', xp:.10, crit:.05 },
  { rank:9,  name:'Guild Mythic',     repReq:40000, desc:'Another +15% gold and +15% XP.', gold:.15, xp:.15 },
  { rank:10, name:'Guild Eternal',    repReq:75000, desc:'The Guild has nothing left to teach you. Another +5% crit chance.', crit:.05 }
];
const guildRank = () => GUILD_RANKS.filter(r => GameState.guild.rep >= r.repReq).pop();
const guildSum = (k) => GameState.guild.joined ? GUILD_RANKS.filter(r => GameState.guild.rep >= r.repReq).reduce((t, r) => t + (r[k] || 0), 0) : 0;
window.guildGoldMult = () => 1 + guildSum('gold');
window.guildXpMult = () => 1 + guildSum('xp');
window.guildCrit = () => guildSum('crit');

const guildWeek = () => Math.floor(Date.now() / 86400000); // contracts repost daily: V1 has no in-game calendar, and weekly would make ranks take months
const repFor = (lv) => Math.round(12 + lv * 0.9);

// One kill contract and one boss contract per zone, built from the live zone data so they always match what can be fought.
let _contractCache = null;
function allContracts(){
  if(_contractCache) return _contractCache;
  const out = [];
  Object.entries(ZONES).forEach(([zid, z]) => {
    const names = Object.keys(z.enemyDefs), target = names[names.length - 1];
    out.push({ id:'k:' + zid, zid, kind:'kill', target, need:6, lv:z.lv, name:`${target} Cull`, desc:`Defeat 6 ${target} for the Guild` });
    out.push({ id:'b:' + zid, zid, kind:'boss', target:z.boss.name, need:1, lv:z.lv, name:`Contract: ${z.boss.name}`, desc:`Defeat ${z.boss.name} for the Guild` });
  });
  return (_contractCache = out);
}
function contractReward(c){
  const z = ZONES[c.zid];
  if(c.kind === 'kill') return { xp:Math.round(z.quest.xpReward * 0.4), gold:Math.round(z.quest.goldReward * 1.5), rep:repFor(c.lv) };
  return { xp:Math.round(z.boss.xp * 0.2), gold:Math.round(z.boss.g * 0.8), rep:Math.round(repFor(c.lv) * 1.6) };
}
function contractState(id){
  const g = GameState.guild, wk = guildWeek();
  let s = g.contracts[id];
  if(!s || s.week !== wk){ s = g.contracts[id] = { count:0, done:false, week:wk }; }
  return s;
}
const contractDone = (id) => { const s = GameState.guild.contracts[id]; return !!(s && s.week === guildWeek() && s.done); };
const onBoard = (c) => c.lv >= GameState.player.level - 10 && c.lv <= GameState.player.level + 14;
function pruneContracts(){ const wk = guildWeek(), cs = GameState.guild.contracts; for(const k in cs) if(cs[k].week !== wk) delete cs[k]; }
function openContracts(){
  const lv = GameState.player.level;
  return allContracts().filter(c => onBoard(c) && !contractDone(c.id))
    .sort((a, b) => Math.abs(a.lv - lv) - Math.abs(b.lv - lv) || a.id.localeCompare(b.id)).slice(0, 8);
}
function completeContract(c){
  const s = contractState(c.id); s.done = true;
  const r = contractReward(c), g = GameState.guild, p = GameState.player;
  g.rep += r.rep; g.repBal += r.rep; p.gold += r.gold; grantXP(r.xp);
  showHubToast(`Contract done: ${c.name}. +${r.xp} XP, +${r.gold}G, +${r.rep} Guild Rep`);
  saveGame();
}
window.guildOnDefeat = (name, wasBoss) => {
  if(!GameState.guild.joined) return;
  allContracts().forEach(c => {
    if(c.target !== name || (c.kind === 'boss') !== !!wasBoss || !onBoard(c) || contractDone(c.id)) return; // only open contracts on the board count
    const s = contractState(c.id);
    s.count++;
    if(s.count >= c.need) completeContract(c);
  });
};

/* ---------- Guild shop: gear that scales with the act-gear tiers, bought with Guild Rep ---------- */
const GUILD_SHOP = [
  { n:'Guild Sigil',            slot:'trinket', field:'equippedAmulet', minRank:2 },
  { n:'Guildmark Blade',        slot:'weapon',  field:'equippedWeapon', minRank:3 },
  { n:'Veteran’s Plate',   slot:'armor',   field:'equippedArmor',  minRank:4 },
  { n:'Champion’s Ring',   slot:'ring',    field:'equippedRing',   minRank:5 },
  { n:'Guildmaster’s Crown', slot:'head',  field:'equippedHead',   minRank:6 },
  { n:'Legend’s Gauntlets', slot:'hands',  field:'equippedHands',  minRank:7 },
  { n:'Paragon’s Greaves', slot:'feet',    field:'equippedFeet',   minRank:8 },
  { n:'Mythic Blade',           slot:'weapon',  field:'equippedWeapon', minRank:9 },
  { n:'Eternal Vestments',      slot:'armor',   field:'equippedArmor',  minRank:10 }
].map(it => {
  const base = actGear(it.slot)[Math.min(11, it.minRank + 1)];
  return Object.assign(it, { atk:Math.round(base.atk * 1.25), def:Math.round(base.def * 1.25), hp:Math.round(base.hp * 1.25), r:'epic', cost:Math.round(60 * Math.pow(it.minRank, 2.2)) });
});
function equipGuildItem(it){
  const p = GameState.player, prev = p[it.field];
  if(prev) p.mhp -= (prev.hp || 0);
  p[it.field] = { n:it.n, atk:it.atk, def:it.def, hp:it.hp, r:it.r };
  p.mhp += it.hp || 0; p.hp = Math.min(p.hp + (it.hp || 0), p.mhp);
}
function buyGuildItem(it){
  const g = GameState.guild;
  if(g.owned[it.n] || g.repBal < it.cost || guildRank().rank < it.minRank) return;
  g.repBal -= it.cost; g.owned[it.n] = true; equipGuildItem(it); saveGame(); renderGuild();
}

/* ---------- Temple Hunts: the Cult of the Closed Eye ---------- */
const HUNTS = [
  { id:'vess',   name:'Brother Vess, the First Blind',      req:'the-convergence',       mech:'blind',      hpF:.9,  atkF:.9,  tier:1, img:null,
    desc:'He put out his own eyes the night the world mended, calling it the last honest act left to a believer. He does not fear pain. He fears, more than anything, having to see what the world became without him.' },
  { id:'maren',  name:'Sister Maren, Keeper of Silence',     req:'the-hollow-throne',     mech:'silence',    hpF:1.0, atkF:1.0, tier:2, img:null,
    desc:'She has not spoken since Daybreak, by choice, as penance for a world she believes should have stayed broken. Her silence is not passive. It is a verdict, delivered on everyone who kept living.' },
  { id:'choir',  name:'The Closed Choir',                    req:'rustbound-docks',       mech:'apocalypse', hpF:1.1, atkF:1.0, tier:3, img:null,
    desc:'Not one voice but many, singing the same hymn to the Breaking in perfect, practiced unison. They believe the mended world is the lie. They may be the only people left who miss the catastrophe.' },
  { id:'prophet',name:'The Hollow Prophet',                  req:'the-hollow-vigil',      mech:'cosmic',     hpF:1.4, atkF:1.1, tier:4, img:'assets/boss/thehollowprophet.jpg',
    desc:'Their leader, and the only one among them who never actually believed the doctrine, just found it useful. Grief is easy to weaponize. The Hollow Prophet has been doing exactly that since the day the world dared to heal.' },
  { id:'iss',    name:'Brother Iss, the Unraveled',          req:'the-scattered-choir',   mech:'apocalypse', hpF:1.2, atkF:1.1, tier:5, img:null,
    desc:'He believed the doctrine completely, right up until the moment its author died proving he never had. Whatever he is now, it is not faith. It is what is left when faith is pulled out from under someone all at once.' },
  { id:'two',    name:'The Splintered Two',                  req:'the-scattered-choir',   mech:'rampage',    hpF:1.3, atkF:1.2, tier:6, img:null,
    desc:'Two of the Prophet’s closest, now turning the doctrine into a private war between themselves. Anyone caught between them is just in the way.' },
  { id:'wren',   name:'Sister Wren, the Last Believer',      req:'the-scattered-choir',   mech:'cosmic',     hpF:1.5, atkF:1.2, tier:7, img:'assets/boss/sisterwren.jpg',
    desc:'She was close enough to the Prophet to know he never believed a word of it. She chose to keep believing anyway, not because the doctrine held up, but because stopping meant admitting what she had lost people over was not real.' }
];
let currentHuntId = null;
const huntDone = (h) => !!GameState.guild.hunts[h.id];
function huntUnlocked(h){
  const i = HUNTS.indexOf(h), z = ZONES[h.req];
  if(!z || !GameState.zoneState[h.req].bossDefeated) return 'Clear ' + (z ? z.name : h.req) + ' first';
  if(i > 0 && !huntDone(HUNTS[i - 1])) return 'Defeat ' + HUNTS[i - 1].name + ' first';
  return '';
}
function huntBossDef(h){
  const L = GameState.player.level, cal = curveAt(L), levelXp = 30 + (L - 1) * 25;
  // Tuned with tools/playbot.js: hunts are a step harder than a zone boss at the same level, not a wall.
  const atk = Math.round((cal.def + cal.mhp * 0.10) * (0.75 + h.tier * 0.04)), hp = Math.round(cal.dmg * 28 * (0.6 + h.tier * 0.06));
  const b = { name:h.name, mechanic:h.mech, hp, atk, spd:5, xp:Math.round(levelXp * (0.15 + h.tier * 0.04)), g:Math.round(L * 40 * (1 + h.tier * 0.3)),
    hint:h.desc.split('. ')[0] + '.', introLine:h.desc, spriteCls:'act2-body', crownCls:'act2-crown', tint:['#d8c8a0', '#6a5a3a'] };
  if(h.img) b.img = h.img;
  if(h.mech === 'apocalypse'){ b.apocalypseTurn = 5; b.apocalypseDmg = Math.round(atk * 1.1); }
  if(h.mech === 'rampage'){ b.rampageEvery = 3; b.rampageDmg = Math.round(atk * 1.1); }
  if(h.mech === 'cosmic'){ b.cosmicPhaseTurns = 3; b.cosmicRampageDmg = Math.round(atk * 1.1); b.cosmicFreezeDuration = 2500; b.cosmicWaveDmg = Math.round(atk * 0.7); }
  return b;
}
function startHunt(id){
  const h = HUNTS.find(x => x.id === id); if(!h) return;
  currentHuntId = id; trainingMode = 'hunt'; trainingZoneId = null;
  showScreen('map');
  const boss = huntBossDef(h);
  currentBossDef = boss; silencedUntil = 0;
  isBoss = true; inBattle = true; paused = false; bossTurnCount = 0; bossLifeIndex = 0; bossPhaseIndex = 0; bossCharging = false;
  currentEnemy = { name:boss.name, hp:boss.hp, mhp:boss.hp, atk:boss.atk, spd:boss.spd, xp:boss.xp, g:boss.g, mechanic:boss.mechanic };
  document.getElementById('battle-e-name').textContent = boss.name + ' (Temple Hunt)';
  document.getElementById('battle-e-hint').textContent = boss.hint;
  spawnEnemySprite(boss, true);
  document.getElementById('battle-screen').classList.add('boss-mode');
  document.getElementById('battle-log').textContent = `${boss.name} turns toward you.`;
  resetBattleUI();
  document.getElementById('battle-screen').classList.add('show');
  updateAutoRow();
  startTicking();
  playTrack('antagonist');
}
function huntVictory(){
  const h = HUNTS.find(x => x.id === currentHuntId), p = GameState.player, g = GameState.guild;
  const first = !huntDone(h), mult = first ? 1 : 0.5;
  const xp = Math.round(currentEnemy.xp * mult * guildXpMult()), gold = Math.round(currentEnemy.g * mult * guildGoldMult());
  const rep = (first ? 3 : 1) * (120 + h.tier * 60 + Math.round(p.level * 0.5));
  g.hunts[h.id] = true; p.gold += gold; p.templeRep += rep;
  const leveled = grantXP(xp);
  updateMapHud();
  document.getElementById('battle-res-eyebrow').textContent = first ? 'Temple Hunt Complete' : 'Victory';
  document.getElementById('battle-res-title').textContent = `${h.name} falls`;
  document.getElementById('battle-res-rewards').innerHTML = `+${xp} XP · +${gold} Gold<br>The Temple records your hunt (+${rep} rep).` + (first ? '' : '<br>Repeat hunt: half rewards.');
  document.getElementById('battle-result').classList.add('show');
  const contBtn = document.getElementById('battle-result-continue-btn');
  contBtn.textContent = 'Hunt Again'; contBtn.onclick = () => startHunt(h.id);
  document.getElementById('battle-result-leave-btn').style.display = 'block';
  if(leveled) setTimeout(() => { document.getElementById('map-levelup-text').textContent = `San reached Level ${p.level}`; flashBanner(document.getElementById('map-levelup-banner')); }, 200);
  saveGame();
}

/* ---------- Guild Hall screen ---------- */
const h = (s) => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
function renderGuild(){
  pruneContracts();
  const g = GameState.guild, p = GameState.player, root = document.getElementById('guild-content');
  const rank = guildRank(), next = GUILD_RANKS[rank.rank];
  let html = '';
  if(!g.joined){
    const ok = GameState.zoneState['whispering-woods'].bossDefeated;
    html += `<div class="inv-section-label">The Guild</div><div class="sync-card"><div class="sync-h">Adventurers’ Guild</div>
      <p class="sync-note">Join to take daily contracts for Guild Rep, climb ten ranks for bonus gold, XP and crits, and spend Rep in the Guild shop.</p>
      <button class="sync-btn primary" id="guild-join" ${ok ? '' : 'disabled'}>${ok ? 'Join the Guild' : 'Defeat the Goblin King first'}</button></div>`;
  } else {
    html += `<div class="inv-section-label">Guild Rank</div><div class="sync-card"><div class="sync-h">${h(rank.name)} <span>Rank ${rank.rank}/10</span></div>
      <p class="sync-note">${h(rank.desc)}</p>
      <div class="lk-progress-track"><div class="lk-progress-fill" style="width:${next ? Math.min(100, (g.rep - rank.repReq) / (next.repReq - rank.repReq) * 100) : 100}%"></div></div>
      <p class="sync-note">${g.rep} lifetime Rep${next ? ` · ${next.repReq - g.rep} to ${h(next.name)}` : ' · max rank'} · <b>${g.repBal}</b> Rep to spend</p>
      <p class="sync-note">Active bonuses: +${Math.round(guildSum('gold') * 100)}% gold, +${Math.round(guildSum('xp') * 100)}% XP, +${Math.round(guildSum('crit') * 100)}% crit</p></div>`;
    html += `<div class="inv-section-label">Contract Board · reposts daily</div>`;
    const board = openContracts();
    html += board.length ? board.map(c => { const s = g.contracts[c.id] || { count:0 }, r = contractReward(c);
      return `<div class="trinket-row"><div class="tr-icon r-${c.kind === 'boss' ? 'epic' : 'rare'}">${c.kind === 'boss' ? '\u{1F409}' : '⚔️'}</div><div class="tr-body"><div class="tr-name">${h(c.name)}</div>
        <div class="tr-stats">${h(c.desc)} · ${ZONES[c.zid].name} (Lv ${c.lv})</div><div class="tr-mats">${s.count}/${c.need} · +${r.xp} XP · +${r.gold}G · +${r.rep} Rep</div></div></div>`; }).join('')
      : '<p class="sync-note">No contracts match your level right now. New ones post every day.</p>';
    html += `<div class="inv-section-label">Guild Shop · spend Rep</div>`;
    html += GUILD_SHOP.map(it => { const owned = g.owned[it.n], locked = rank.rank < it.minRank, equipped = p[it.field] && p[it.field].n === it.n;
      const stats = [it.atk && `+${it.atk} ATK`, it.def && `+${it.def} DEF`, it.hp && `+${it.hp} HP`].filter(Boolean).join(' · ');
      return `<div class="trinket-row"><div class="tr-icon r-epic">\u{1F6E1}️</div><div class="tr-body"><div class="tr-name">${h(it.n)}</div><div class="tr-stats">${stats}</div>
        <div class="tr-mats">${locked ? 'Requires ' + GUILD_RANKS[it.minRank - 1].name : it.cost + ' Rep'}</div></div>
        <button class="tr-buy ${equipped ? 'owned' : ''}" data-shop="${h(it.n)}" ${locked || equipped || (!owned && g.repBal < it.cost) ? 'disabled' : ''}>${equipped ? 'Equipped' : owned ? 'Equip' : it.cost + ' Rep'}</button></div>`; }).join('');
  }
  html += `<div class="inv-section-label">Temple Hunts · the Cult of the Closed Eye</div>
    <p class="sync-note">Seven hunts, taken in order. Each scales to your level; repeat hunts pay half. Rewards: XP, gold and Temple standing.</p>`;
  html += HUNTS.map(x => { const lock = huntUnlocked(x), done = huntDone(x);
    return `<div class="trinket-row"><div class="tr-icon r-${done ? 'rare' : 'epic'}">${done ? '✅' : '\u{1F441}️'}</div><div class="tr-body"><div class="tr-name">${h(x.name)}</div>
      <div class="tr-stats">${h(x.desc.split('. ')[0])}.</div><div class="tr-mats">${lock ? h(lock) : 'Special: ' + ({ blind:'blinds you (30% misses)', silence:'silences your spells', apocalypse:'unavoidable apocalypse', cosmic:'cycles cosmic phases', rampage:'rampages' }[x.mech])}</div></div>
      <button class="tr-buy" data-hunt="${x.id}" ${lock ? 'disabled' : ''}>${done ? 'Hunt Again' : 'Hunt'}</button></div>`; }).join('');
  root.innerHTML = html;
  const join = document.getElementById('guild-join');
  if(join) join.addEventListener('click', () => { g.joined = true; saveGame(); renderGuild(); });
  root.querySelectorAll('[data-hunt]').forEach(b => b.addEventListener('click', () => startHunt(b.dataset.hunt)));
  root.querySelectorAll('[data-shop]').forEach(b => b.addEventListener('click', () => {
    const it = GUILD_SHOP.find(x => x.n === b.dataset.shop);
    if(g.owned[it.n]){ equipGuildItem(it); saveGame(); renderGuild(); } else buyGuildItem(it);
  }));
}
window.renderGuild = renderGuild;
document.getElementById('hub-tile-guild').addEventListener('click', () => { renderGuild(); showScreen('guild'); });
document.getElementById('guild-back-btn').addEventListener('click', () => showScreen('hub'));
