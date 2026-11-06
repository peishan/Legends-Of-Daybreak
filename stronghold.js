/* =========================================================================
   Strongholds (ported from V2): eight holds claimed by clearing the zone at
   their level, each with a five-step Guild Hall (permanent XP/gold bonuses), a
   daily stipend and daily defense tasks, plus the cosmetic gold sink. Needs
   stronghold-data.js; loaded after war.js.
   ========================================================================= */
const holdSave = () => { const g = GameState.guild; if(!g.hold) g.hold = { hall:{}, lastStipend:-1, taskDay:-1, tasks:{}, cosmetics:{} }; return g.hold; };
const HOLD_COST_SCALE = 0.12;           // V2 priced Guild Halls for its own economy; keep them a fair share of this one
const HOLD_TASKS = [[5, 0.5], [10, 1], [15, 1.5]];  // [victories needed, share of the daily stipend]
const HOLD_ZONE = { arcaneTower:'arcane-planar-tower', mendedGrove:'the-unbroken-vale', wakingEdge:'the-rootbound-sanctuary', bunniesWarren:'the-last-warren',
  settledPlace:'what-it-was-becoming', watchedHall:'the-door-with-a-familiar-shape', heldGround:'the-place-that-never-quite-ended', higherGround:'the-higher-hunting-grounds' };
const holdZone = (def, id) => (HOLD_ZONE[id] && ZONES[HOLD_ZONE[id]] ? HOLD_ZONE[id] : null) || Object.keys(ZONES).find(z => ZONES[z].lv >= def.zoneLv && !ZONES[z].dynamic) || null;
const holdClaimed = (id) => { const z = holdZone(STRONGHOLD_DEFS[id], id); return !!(z && GameState.zoneState[z] && GameState.zoneState[z].bossDefeated); };
const holdLevel = (id) => holdClaimed(id) ? Math.max(1, holdSave().hall[id] || 1) : 0;
const claimedHolds = () => Object.keys(STRONGHOLD_DEFS).filter(holdClaimed);
const hallSum = (k) => claimedHolds().reduce((t, id) => t + STRONGHOLD_DEFS[id].guildHall.filter(h => h.level <= holdLevel(id)).reduce((a, h) => a + (h[k] || 0), 0), 0);
const cosmeticCount = () => Object.values(holdSave().cosmetics).filter(Boolean).length;
for(const [fn, calc] of [['guildXpMult', () => hallSum('xpBonus')], ['bondGoldMult', () => hallSum('goldBonus') + Math.min(0.1, cosmeticCount() * 0.005)],
                         ['bondSpellMult', () => claimedHolds().filter(id => holdLevel(id) >= 5).length * 0.05]]){
  const old = window[fn]; window[fn] = () => old() + calc();
}
const stipendMult = (id) => Math.max(1, ...STRONGHOLD_DEFS[id].guildHall.filter(h => h.level <= holdLevel(id)).map(h => 1 + (h.stipendMult ? h.stipendMult - 1 : 0)));
const stipendFor = (id) => ({ xp:Math.round(STRONGHOLD_DEFS[id].stipend.xp * stipendMult(id)), gold:Math.round(STRONGHOLD_DEFS[id].stipend.gold * stipendMult(id)) });
function collectStipends(){
  const s = holdSave(), day = guildWeek(), ids = claimedHolds(); if(!ids.length || s.lastStipend === day) return;
  const days = s.lastStipend < 0 ? 1 : Math.min(3, day - s.lastStipend); // a few missed days stack, no more
  let xp = 0, gold = 0; ids.forEach(id => { const x = stipendFor(id); xp += x.xp * days; gold += x.gold * days; });
  s.lastStipend = day; GameState.player.gold += gold; grantXP(xp);
  showHubToast(`Strongholds paid ${gold.toLocaleString()}G and ${xp.toLocaleString()} XP.`); saveGame();
}
function todaysTasks(){
  const s = holdSave(), day = guildWeek();
  if(s.taskDay !== day){ s.taskDay = day; s.tasks = {}; }
  claimedHolds().forEach(id => { if(!s.tasks[id]) s.tasks[id] = HOLD_TASKS.map(() => ({ n:0, done:false })); });
  return s.tasks;
}
window.holdOnWin = () => {
  if(!claimedHolds().length) return;
  const tasks = todaysTasks();
  Object.entries(tasks).forEach(([id, list]) => list.forEach((t, i) => {
    if(t.done) return; t.n++;
    if(t.n >= HOLD_TASKS[i][0]){ t.done = true; const x = stipendFor(id), f = HOLD_TASKS[i][1];
      GameState.player.gold += Math.round(x.gold * f); grantXP(Math.round(x.xp * f)); showHubToast(`${STRONGHOLD_DEFS[id].name}: task done. +${Math.round(x.gold * f).toLocaleString()}G`); }
  }));
};
function upgradeHall(id){
  const def = STRONGHOLD_DEFS[id], lv = holdLevel(id), next = def.guildHall.find(h => h.level === lv + 1), p = GameState.player; if(!next) return;
  const gold = Math.round(next.cost * HOLD_COST_SCALE), mats = Math.round(next.matCount * 1.5);
  if(p.gold < gold || actMatTotal() < mats) return;
  p.gold -= gold; if(mats) spendActMats(mats); holdSave().hall[id] = next.level; saveGame(); renderStrongholds();
}
function buyCosmetic(id){
  const c = STRONGHOLD_COSMETICS.find(x => x.id === id), p = GameState.player, cost = Math.round(c.cost * Math.max(1, p.level / 20));
  if(holdSave().cosmetics[id] || p.gold < cost) return; p.gold -= cost; holdSave().cosmetics[id] = true; saveGame(); renderStrongholds();
}
const cosmeticCost = (c) => Math.round(c.cost * Math.max(1, GameState.player.level / 20));

function renderStrongholds(){
  collectStipends();
  const root = document.getElementById('stronghold-content'), p = GameState.player, e = (t) => String(t).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
  const tasks = todaysTasks();
  let html = `<div class="inv-section-label">Strongholds</div><p class="sync-note">Clear the zone at a hold’s level to claim it. Each claimed hold pays a daily stipend and offers three daily defense tasks (win battles). Upgrading its Guild Hall adds permanent XP and gold bonuses. Total: +${Math.round(hallSum('xpBonus') * 100)}% XP, +${Math.round(hallSum('goldBonus') * 100)}% gold.</p>`;
  Object.entries(STRONGHOLD_DEFS).forEach(([id, def]) => {
    const claimed = holdClaimed(id), lv = holdLevel(id), z = ZONES[holdZone(def, id)];
    html += `<div class="inv-section-label">${def.icon} ${e(def.name)}</div><div class="sync-card"><p class="sync-note">${e(def.desc)}</p>`;
    if(!claimed){ html += `<p class="sync-note"><b>Unclaimed.</b> Clear ${z ? e(z.name) : 'its zone'} (Lv ${def.zoneLv}) to claim it.</p></div>`; return; }
    const st = stipendFor(id), next = def.guildHall.find(h => h.level === lv + 1);
    html += `<div class="sync-h">Guild Hall ${lv}/5 <span>${e(def.guildHall[lv - 1].name)}</span></div><p class="sync-note">${e(def.guildHall[lv - 1].desc)}<br>Daily stipend: ${st.gold.toLocaleString()}G and ${st.xp.toLocaleString()} XP</p>`;
    html += (tasks[id] || []).map((t, i) => `<p class="sync-note">${t.done ? '✅' : '◻️'} Defend the hold: win ${HOLD_TASKS[i][0]} battles (${Math.min(t.n, HOLD_TASKS[i][0])}/${HOLD_TASKS[i][0]})</p>`).join('');
    if(next){ const gold = Math.round(next.cost * HOLD_COST_SCALE), mats = Math.round(next.matCount * 1.5), ok = p.gold >= gold && actMatTotal() >= mats;
      html += `<button class="sync-btn ${ok ? 'primary' : 'ghost'}" data-up="${id}" ${ok ? '' : 'disabled'}>${e(next.name)}: ${gold.toLocaleString()}G${mats ? ' + ' + mats + ' post-Nexus materials' : ''}<br><small>${e(next.desc)}</small></button>`; }
    html += '</div>';
  });
  html += `<div class="inv-section-label">Decor · ${cosmeticCount()}/${STRONGHOLD_COSMETICS.length} owned</div><p class="sync-note">Pure decoration for your holds. Each piece adds +0.5% gold, up to +10%.</p>` +
    STRONGHOLD_COSMETICS.map(c => { const own = holdSave().cosmetics[c.id], cost = cosmeticCost(c);
      return `<div class="trinket-row"><div class="tr-icon r-rare">\u{1F3F7}️</div><div class="tr-body"><div class="tr-name">${e(c.name)}</div><div class="tr-stats">${e(c.desc)} · ${e(c.category)}</div></div><button class="tr-buy ${own ? 'owned' : ''}" data-cos="${e(c.id)}" ${own || p.gold < cost ? 'disabled' : ''}>${own ? 'Owned' : cost.toLocaleString() + 'G'}</button></div>`; }).join('');
  root.innerHTML = html;
  root.querySelectorAll('[data-up]').forEach(b => b.addEventListener('click', () => upgradeHall(b.dataset.up)));
  root.querySelectorAll('[data-cos]').forEach(b => b.addEventListener('click', () => buyCosmetic(b.dataset.cos)));
}
window.renderStrongholds = renderStrongholds;
document.getElementById('hub-tile-stronghold').addEventListener('click', () => { renderStrongholds(); showScreen('stronghold'); });
document.getElementById('stronghold-back-btn').addEventListener('click', () => showScreen('hub'));
