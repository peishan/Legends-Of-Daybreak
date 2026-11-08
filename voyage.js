/* =========================================================================
   Voyage (ported from V2): build a ship, sail between seven old trading ports,
   trade goods, fight what the sea sends and climb Voyager levels. V2 limits
   sailing to a daily window; here you get a few crossings a day. Needs
   voyage-data.js; loaded after stronghold.js.
   ========================================================================= */
const VOY_UNLOCK_LEVEL = 560, VOY_SAILS_PER_DAY = 6, VOY_CREW_SLOTS = 4;
const VOY_COST_SCALE = 0.5;
const CREW_TYPE = { Aisyah:'trade', Gino:'trade', Renn:'trade', 'KW Liang':'trade', Joel:'combat', 'Ser Aldric':'combat', Zaki:'combat', 'Sister Wren':'combat',
  Senedra:'travel', Iris:'travel', Mimi:'travel', Mezstorm:'travel', Eliz:'combat', 'Dr. AA':'combat', 'Brada Shah':'combat', Soel:'travel' };
const CREW_BONUS = 0.05;
const voy = () => { const g = GameState.guild; if(!g.voyage) g.voyage = { level:1, xp:0, port:'singapore', cargo:{}, visited:['singapore'], crew:[], ship:{ tier:0, stage:0, built:false }, sailDay:-1, sails:0, trips:0 }; return g.voyage; };
const voyUnlocked = () => GameState.player.level >= VOY_UNLOCK_LEVEL;
const voyPort = (id) => VOYAGE_PORTS.find(p => p.id === id);
const shipTier = () => SHIP_TIERS[voy().ship.tier];
const cargoWeight = () => Object.entries(voy().cargo).reduce((t, [id, q]) => t + (VOYAGE_GOODS[id] ? VOYAGE_GOODS[id].weight * q : 0), 0);
const priceMult = () => Math.max(1, GameState.player.level / 60);   // V2 prices were set for a Lv 560 economy; keep trade worthwhile as levels grow
const sailsLeft = () => { const v = voy(), d = guildWeek(); if(v.sailDay !== d){ v.sailDay = d; v.sails = 0; } return VOY_SAILS_PER_DAY - v.sails; };
const bonusOf = (type) => voy().crew.reduce((t, n) => t + (CREW_TYPE[n] === type ? CREW_BONUS : 0), 0) + VOYAGER_MASTERY.filter(m => m.type === type && voy().level >= m.level).reduce((t, m) => t + m.value, 0);
const voyXpNeeded = (l) => 500 + (l - 1) * 250;
function gainVoyXp(n){ const v = voy(); v.xp += n; while(v.xp >= voyXpNeeded(v.level)){ v.xp -= voyXpNeeded(v.level); v.level++; showHubToast(`Voyager Level ${v.level}!`); if(window.addChronicle) addChronicle('\u2693', `Voyager Level ${v.level} reached.`); } }
const goodPrice = (port, id, mode) => { const g = VOYAGE_GOODS[id], spec = voyPort(port).specialties.includes(id);
  return Math.round(g.basePrice * priceMult() * (mode === 'buy' ? (spec ? 0.6 : 1.2) : (spec ? 0.7 : 1.4))); };

function buildStage(){
  const v = voy(), s = v.ship, tier = SHIP_TIERS[s.tier], st = tier && tier.stages[s.stage], p = GameState.player;
  if(!st || s.built) return;
  const gold = Math.round(st.gold * VOY_COST_SCALE * priceMult()), mats = Math.round(st.matCount * 1.5);
  if(p.gold < gold || actMatTotal() < mats) return;
  p.gold -= gold; spendActMats(mats); s.stage++;
  if(s.stage >= tier.stages.length){ s.built = true; showHubToast(`${tier.name} is ready to sail.`); } saveGame(); renderVoyage();
}
function nextTier(){ const v = voy(), s = v.ship, nt = SHIP_TIERS[s.tier + 1]; if(!s.built || !nt || v.level < nt.requiredVoyagerLevel) return; s.tier++; s.stage = 0; s.built = false; saveGame(); renderVoyage(); }
function trade(id, qty, mode){
  const v = voy(), tier = shipTier(), p = GameState.player, g = VOYAGE_GOODS[id];
  if(!v.ship.built && !(v.ship.tier > 0)) return;
  if(mode === 'buy'){
    const room = Math.floor((tier.cargoCapacity - cargoWeight()) / g.weight), n = Math.min(qty === 'max' ? 1e9 : qty, room, Math.floor(p.gold / goodPrice(v.port, id, 'buy')));
    if(n <= 0) return; p.gold -= n * goodPrice(v.port, id, 'buy'); v.cargo[id] = (v.cargo[id] || 0) + n;
  } else {
    const have = v.cargo[id] || 0, n = qty === 'max' ? have : Math.min(qty, have); if(n <= 0) return;
    const earned = Math.round(goodPrice(v.port, id, 'sell') * n * (1 + bonusOf('trade')));
    p.gold += earned; v.cargo[id] -= n; if(v.cargo[id] <= 0) delete v.cargo[id]; gainVoyXp(Math.round(earned / (50 * priceMult())));
  }
  saveGame(); renderVoyage();
}

// ---- sailing and sea encounters ----
let seaDest = null;
function sail(destId){
  const v = voy(), cur = voyPort(v.port), dest = voyPort(destId);
  if(!v.ship.built && v.ship.tier === 0 || !cur.distances[destId] || sailsLeft() <= 0) return;
  v.sails++; const dist = cur.distances[destId]; seaDest = destId;
  const chance = Math.min(0.5, dest.danger * 0.08 * dist) * (1 - Math.min(0.6, bonusOf('travel')));
  if(Math.random() < chance){ startSea(dest); return; }
  arrive(destId, dist);
}
function arrive(destId, dist){ const v = voy(); v.port = destId; if(!v.visited.includes(destId)) v.visited.push(destId); v.trips++; gainVoyXp(10 * dist); showHubToast(`Made port at ${voyPort(destId).name}.`); saveGame(); renderVoyage(); showScreen('voyage'); }
function startSea(dest){
  const name = SEA_MONSTERS[Math.floor(Math.random() * SEA_MONSTERS.length)], L = GameState.player.level, cal = curveAt(L), f = 0.6 + dest.danger * 0.1 - Math.min(0.3, bonusOf('combat'));
  const boss = { name, mechanic:'phase', phaseThresholds:[0.66, 0.33], hp:Math.round(cal.dmg * 28 * f), atk:Math.round((cal.def + cal.mhp * 0.09) * f), spd:5, xp:Math.round((30 + (L - 1) * 25) * 0.04), g:Math.round(L * 20 * dest.danger),
    hint:'Something surfaces alongside the ship.', introLine:`${name} surfaces alongside the ship.`, spriteCls:'act2-body', crownCls:'act2-crown', tint:['#6ab0d0', '#1a4a6a'] };
  trainingMode = 'sea'; trainingZoneId = null; showScreen('map'); currentBossDef = boss; silencedUntil = 0;
  isBoss = true; inBattle = true; paused = false; bossTurnCount = 0; bossLifeIndex = 0; bossPhaseIndex = 0; bossCharging = false;
  currentEnemy = { name, hp:boss.hp, mhp:boss.hp, atk:boss.atk, spd:5, xp:boss.xp, g:boss.g, mechanic:'phase' };
  document.getElementById('battle-e-name').textContent = `${name} (at sea)`; document.getElementById('battle-e-hint').textContent = boss.hint;
  spawnEnemySprite(boss, true); document.getElementById('battle-screen').classList.add('boss-mode');
  document.getElementById('battle-log').textContent = boss.introLine; resetBattleUI();
  document.getElementById('battle-screen').classList.add('show'); updateAutoRow(); startTicking(); playTrack('antagonist');
}
window.seaVictory = () => {
  const p = GameState.player, v = voy(), xp = Math.round(currentEnemy.xp * guildXpMult()), gold = Math.round(currentEnemy.g * guildGoldMult());
  p.gold += gold; const leveled = grantXP(xp); gainVoyXp(25); updateMapHud();
  document.getElementById('battle-res-eyebrow').textContent = 'The sea lets you pass';
  document.getElementById('battle-res-title').textContent = `${currentEnemy.name} sinks`;
  document.getElementById('battle-res-rewards').innerHTML = `+${xp} XP · +${gold} Gold · +25 Voyager XP`;
  document.getElementById('battle-result').classList.add('show');
  const c = document.getElementById('battle-result-continue-btn'); c.textContent = 'Sail on'; c.onclick = () => { leaveTraining(); arrive(seaDest, voyPort(v.port).distances[seaDest] || 1); };
  document.getElementById('battle-result-leave-btn').style.display = 'none';
  if(leveled) setTimeout(() => { document.getElementById('map-levelup-text').textContent = `San reached Level ${p.level}`; flashBanner(document.getElementById('map-levelup-banner')); }, 200);
  saveGame();
};
window.seaDefeat = () => { const v = voy(); let lost = 0; Object.keys(v.cargo).forEach(id => { const l = Math.ceil(v.cargo[id] * 0.2); v.cargo[id] -= l; lost += l; if(v.cargo[id] <= 0) delete v.cargo[id]; });
  showHubToast(`The sea took ${lost} units of cargo.`); saveGame(); };
const crewToggle = (n) => { const v = voy(), i = v.crew.indexOf(n); if(i >= 0) v.crew.splice(i, 1); else if(v.crew.length < VOY_CREW_SLOTS) v.crew.push(n); saveGame(); renderVoyage(); };

function renderVoyage(){
  const root = document.getElementById('voyage-content'), v = voy(), p = GameState.player, e = (t) => String(t).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
  if(!voyUnlocked()){ root.innerHTML = `<div class="inv-section-label">The Voyage</div><div class="sync-card"><p class="sync-note">A shipwright’s yard, past everything mapped. Opens at Level ${VOY_UNLOCK_LEVEL}. (The five sea zones, from The Reef That Swallowed a Fleet to Where the Old Maps End, are open on the map as you reach them.)</p></div>`; return; }
  const s = v.ship, tier = SHIP_TIERS[s.tier], st = tier.stages[s.stage], port = voyPort(v.port), sailing = s.built || s.tier > 0;
  let html = `<div class="inv-section-label">The Voyage</div><div class="sync-card"><div class="sync-h">Voyager Level ${v.level} <span>${v.xp}/${voyXpNeeded(v.level)} XP · ${v.trips} crossings</span></div>
    <p class="sync-note">Trade +${Math.round(bonusOf('trade') * 100)}% · Travel safety +${Math.round(bonusOf('travel') * 100)}% · Combat +${Math.round(bonusOf('combat') * 100)}% (crew and mastery). ${sailsLeft()} crossings left today.</p></div>`;
  html += `<div class="inv-section-label">The Ship · ${e(tier.name)}</div><div class="sync-card">`;
  if(!s.built){
    const gold = Math.round(st.gold * VOY_COST_SCALE * priceMult()), mats = Math.round(st.matCount * 1.5), ok = p.gold >= gold && actMatTotal() >= mats;
    html += `<p class="sync-note"><b>${e(st.name)}</b> (stage ${s.stage + 1}/${tier.stages.length}): ${e(st.desc)}</p><button class="sync-btn ${ok ? 'primary' : 'ghost'}" id="voy-build" ${ok ? '' : 'disabled'}>Build: ${gold.toLocaleString()}G + ${mats} post-Nexus materials</button>`;
  } else {
    html += `<p class="sync-note">Built. Cargo capacity ${tier.cargoCapacity} (${cargoWeight()} loaded).</p>`;
    const nt = SHIP_TIERS[s.tier + 1];
    if(nt) html += `<button class="sync-btn ${v.level >= nt.requiredVoyagerLevel ? 'primary' : 'ghost'}" id="voy-next" ${v.level >= nt.requiredVoyagerLevel ? '' : 'disabled'}>Begin ${e(nt.name)}${v.level >= nt.requiredVoyagerLevel ? '' : ' (Voyager Lv ' + nt.requiredVoyagerLevel + ')'}</button>`;
  }
  html += '</div>';
  if(sailing){
    html += `<div class="inv-section-label">${port.icon} ${e(port.name)}</div><div class="sync-card"><p class="sync-note">${e(port.desc)}</p>` +
      Object.entries(port.distances).map(([id, d]) => `<button class="sync-btn ghost" data-sail="${id}" ${sailsLeft() <= 0 ? 'disabled' : ''}>${voyPort(id).icon} Sail to ${e(voyPort(id).name)} · ${d} leg${d > 1 ? 's' : ''} · danger ${voyPort(id).danger}${v.visited.includes(id) ? '' : ' · new port'}</button>`).join('') + '</div>';
    html += `<div class="inv-section-label">Market</div>` + Object.entries(VOYAGE_GOODS).map(([id, g]) => { const spec = port.specialties.includes(id), have = v.cargo[id] || 0;
      return `<div class="trinket-row"><div class="tr-icon r-${spec ? 'epic' : 'common'}">${g.icon}</div><div class="tr-body"><div class="tr-name">${e(g.name)}${spec ? ' · local specialty' : ''}</div><div class="tr-stats">Buy ${goodPrice(v.port, id, 'buy').toLocaleString()}G · Sell ${goodPrice(v.port, id, 'sell').toLocaleString()}G · weight ${g.weight}</div><div class="tr-mats">In hold: ${have}</div></div>
        <button class="tr-buy" data-buy="${id}">Buy 10</button><button class="tr-buy" data-sell="${id}" ${have ? '' : 'disabled'}>Sell all</button></div>`; }).join('');
    html += `<div class="inv-section-label">Crew · ${v.crew.length}/${VOY_CREW_SLOTS}</div>` + ROSTER.filter(r => rosterUnlocked(r) && CREW_TYPE[r.name]).map(r => { const on = v.crew.includes(r.name);
      return `<button class="sync-btn ${on ? 'primary' : 'ghost'}" data-crew="${e(r.name)}" ${!on && v.crew.length >= VOY_CREW_SLOTS ? 'disabled' : ''}>${e(r.name)} · +${Math.round(CREW_BONUS * 100)}% ${CREW_TYPE[r.name]}${on ? ' ✓' : ''}</button>`; }).join('');
  }
  root.innerHTML = html;
  const b = (id, fn) => { const el = document.getElementById(id); if(el) el.addEventListener('click', fn); };
  b('voy-build', buildStage); b('voy-next', nextTier);
  root.querySelectorAll('[data-sail]').forEach(x => x.addEventListener('click', () => sail(x.dataset.sail)));
  root.querySelectorAll('[data-buy]').forEach(x => x.addEventListener('click', () => trade(x.dataset.buy, 10, 'buy')));
  root.querySelectorAll('[data-sell]').forEach(x => x.addEventListener('click', () => trade(x.dataset.sell, 'max', 'sell')));
  root.querySelectorAll('[data-crew]').forEach(x => x.addEventListener('click', () => crewToggle(x.dataset.crew)));
}
window.renderVoyage = renderVoyage;
document.getElementById('hub-tile-voyage').addEventListener('click', () => { renderVoyage(); showScreen('voyage'); });
document.getElementById('voyage-back-btn').addEventListener('click', () => showScreen('hub'));
