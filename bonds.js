/* =========================================================================
   Bonds & Gear (ported from V2): affinity with each companion grows as you
   fight together and through gifts; tiers at 40/70/100/150/200 unlock the
   companion's V2 bonuses, and pairs fielded together trigger party synergies.
   Companions also wear gear. Needs bonds-data.js; loaded after guild.js.
   ========================================================================= */
const BOND_START = { Joel:60, Aisyah:60, Mezstorm:30, Eliz:30, Senedra:20, Zaki:20, Soel:80 };
const BOND_MAX = 200, BOND_TH = [40, 70, 100, 150, 200];
const BASE_HP = { Joel:132, Aisyah:90, Mezstorm:100, Eliz:95, Senedra:90, Zaki:110, Soel:40 };
ALLIES.forEach(a => { BASE_HP[a.name] = a.hp; });
const bonds = () => (GameState.bonds = Object.assign({ aff:{}, gear:{} }, GameState.bonds || {}));
const bondVal = (n) => { const b = bonds(); if(b.aff[n] === undefined) b.aff[n] = BOND_START[n] !== undefined ? BOND_START[n] : 15; return b.aff[n]; };
const bondTiersOf = (n) => BOND_TIERS[n] || [];
const bondUnlocked = (n) => bondTiersOf(n).filter(t => bondVal(n) >= t.th);
const inParty = (n) => n === 'San' || getActiveCompanions().includes(n);

// ---- aggregate effects of every fielded companion's unlocked tiers plus active synergies ----
function bondTotals(){
  const t = { atk:0, def:0, atkPct:0, defPct:0, healPct:0, spellDmgPct:0, critPct:0, goldPct:0, dmgRed:0, hpPct:0, allStatsPct:0 };
  getActiveCompanions().forEach(n => bondUnlocked(n).forEach(tier => { for(const k in tier.fx) if(k in t) t[k] += tier.fx[k]; }));
  SYNERGIES.forEach(s => { if(s.members.every(inParty)) for(const k in s.bonus) if(k in t) t[k] += s.bonus[k]; });
  const CAP = { goldPct:0.3, spellDmgPct:0.5, healPct:0.6, atkPct:0.5, critPct:0.5, defPct:0.5, dmgRed:0.3 }; // many bonds stack; keep the total sane
  for(const k in CAP) t[k] = Math.min(CAP[k], t[k]);
  return t;
}
window.bondSpellMult = () => { const t = bondTotals(); return 1 + t.spellDmgPct + t.allStatsPct * 0.5; };
window.bondAtkMult = () => { const t = bondTotals(); return 1 + t.atkPct + t.allStatsPct * 0.5; };
window.bondHealMult = () => 1 + bondTotals().healPct;
window.bondGoldMult = () => 1 + bondTotals().goldPct;
window.bondDmgRed = () => Math.min(0.5, bondTotals().dmgRed);
window.bondCrit = () => Math.min(0.6, bondTotals().critPct);
// Flat bonuses were written for a Lv 1-50 game (+8 DEF); scale them to the player's level like gear.
window.bondFlat = (kind) => { const t = bondTotals(), L = GameState.player.level; return Math.round(t[kind] * L / 10); };
window.bondDefMult = () => { const t = bondTotals(); return 1 + t.defPct + t.hpPct * 0.5 + t.allStatsPct * 0.5; };
{ const gc = window.guildCrit; window.guildCrit = () => (gc ? gc() : 0) + bondCrit(); }

// ---- affinity grows by fighting together and by gifts ----
window.bondsOnWin = () => { const b = bonds(); getActiveCompanions().forEach(n => { b.aff[n] = Math.min(BOND_MAX, bondVal(n) + 1); }); };
const giftCost = () => 100 + GameState.player.level * 25;
function giveGift(n){
  const p = GameState.player, c = giftCost(), b = bonds();
  if(p.gold < c || bondVal(n) >= BOND_MAX) return;
  p.gold -= c; const before = bondUnlocked(n).length; b.aff[n] = Math.min(BOND_MAX, bondVal(n) + 8);
  if(bondUnlocked(n).length > before) showHubToast(`${n}: ${bondUnlocked(n).slice(-1)[0].n}!`);
  saveGame(); renderBonds();
}

// ---- companion gear: weapon, armor and trinket, from the same tiers as San's act gear ----
const SLOTS = [['weapon', 'Weapon', '⚔️'], ['armor', 'Armor', '\u{1F6E1}️'], ['trinket', 'Trinket', '\u{1F4FF}']];
const gearOf = (n) => (bonds().gear[n] = bonds().gear[n] || {});
const gearSum = (n, k) => Object.values(gearOf(n)).reduce((t, it) => t + (it && it[k] || 0), 0);
window.bondGearBonus = (name) => {
  const out = {}, atk = Math.round((gearOf(name).weapon ? gearOf(name).weapon.atk : 0) * 0.45 + (gearOf(name).trinket ? gearOf(name).trinket.atk : 0) * 0.45);
  if(atk){ out.dmgBonus = atk; out.healBonus = atk; }
  const flat = bondFlat('atk'); if(flat && getActiveCompanions().includes(name)){ out.dmgBonus = (out.dmgBonus || 0) + Math.round(flat * 0.3); }
  return Object.keys(out).length ? out : null;
};
function applyGearHp(){ // armor and trinkets add to the companion's own HP
  Object.keys(BASE_HP).forEach(n => { const c = GameState.companions[n]; if(!c) return;
    c.mhp = BASE_HP[n] + Math.round(gearSum(n, 'hp') * 0.5 + gearSum(n, 'def') * 3); c.hp = Math.min(c.hp, c.mhp) || c.mhp; });
}
function companionShop(slot){
  const items = visibleShopItems(actGear(slot)).filter(t => t.needCleared || t.needLevel);
  return items.map(t => Object.assign({}, t, { price:Math.round(t.price * 1.5) }));
}
function equipCompanion(n, slot, item){
  const g = gearOf(n), p = GameState.player;
  if(g[slot] && g[slot].n === item.n) return;
  if(p.gold < item.price) return;
  p.gold -= item.price; g[slot] = { n:item.n, atk:item.atk, def:item.def, hp:item.hp };
  applyGearHp(); saveGame(); renderBonds();
}

// ---- screen ----
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
function renderBonds(){
  const root = document.getElementById('bonds-content'), p = GameState.player;
  const members = ROSTER.filter(r => rosterUnlocked(r)).map(r => r.name);
  const tot = bondTotals();
  let html = `<div class="inv-section-label">Bonds &amp; Gear</div><p class="sync-note">Affinity grows by +1 for every battle a companion fights in and +8 for a gift (${giftCost().toLocaleString()}G). Each tier unlocks that companion’s bonus; pairs fielded together trigger synergies. Gear adds to their damage, healing and HP.</p>
    <div class="sync-card"><div class="sync-h">Active now <span>fielded companions only</span></div><p class="sync-note">+${Math.round(tot.spellDmgPct * 100)}% spell damage · +${Math.round(tot.atkPct * 100)}% attack · +${Math.round(tot.healPct * 100)}% healing · +${Math.round(tot.critPct * 100)}% crit · +${Math.round(tot.defPct * 100)}% defense · +${Math.round(tot.goldPct * 100)}% gold · ${Math.round(tot.dmgRed * 100)}% damage reduction</p></div>`;
  html += `<div class="inv-section-label">Synergies</div>` + SYNERGIES.map(s => { const on = s.members.every(inParty);
    return `<div class="trinket-row"><div class="tr-icon r-${on ? 'epic' : 'common'}">${s.icon || '✨'}</div><div class="tr-body"><div class="tr-name">${esc(s.name)}</div><div class="tr-stats">${esc(s.desc)}</div><div class="tr-mats">${s.members.join(' + ')} · ${on ? 'active' : 'needs both fielded'}</div></div></div>`; }).join('');
  members.forEach(n => {
    const v = bondVal(n), tiers = bondTiersOf(n), got = bondUnlocked(n), next = tiers.find(t => v < t.th), g = gearOf(n);
    html += `<div class="inv-section-label">${esc(n)}</div><div class="sync-card"><img class="bond-av" src="${PORTRAITS[n] || ''}" alt="">
      <div class="sync-h">Affinity ${v}/${BOND_MAX} <span>${tiers.length ? got.length + '/5 tiers' : 'no bond tiers in V2'}</span></div>
      <div class="lk-progress-track"><div class="lk-progress-fill" style="width:${Math.round(v / BOND_MAX * 100)}%"></div></div>
      <p class="sync-note">${got.length ? got.map(t => esc(t.n) + ' (' + esc(t.d) + ')').join(' · ') : 'No tier yet.'}${next ? `<br><b>Next at ${next.th}:</b> ${esc(next.n)}, ${esc(next.d)}` : ''}</p>
      <button class="sync-btn" data-gift="${esc(n)}" ${p.gold < giftCost() || v >= BOND_MAX ? 'disabled' : ''}>Give a gift (${giftCost().toLocaleString()}G, +8)</button>`;
    SLOTS.forEach(([slot, label, icon]) => {
      const cur = g[slot], opts = companionShop(slot).slice(-2);
      html += `<p class="sync-note">${icon} <b>${label}:</b> ${cur ? esc(cur.n) + ' (' + [cur.atk && '+' + cur.atk + ' ATK', cur.def && '+' + cur.def + ' DEF', cur.hp && '+' + cur.hp + ' HP'].filter(Boolean).join(' ') + ')' : 'empty'}</p>` +
        opts.map(it => `<button class="sync-btn ghost" data-eq="${esc(n)}|${slot}|${esc(it.n)}" ${(cur && cur.n === it.n) || p.gold < it.price ? 'disabled' : ''}>${esc(it.n)} · ${it.price.toLocaleString()}G</button>`).join('');
    });
    html += '</div>';
  });
  root.innerHTML = html;
  root.querySelectorAll('[data-gift]').forEach(b => b.addEventListener('click', () => giveGift(b.dataset.gift)));
  root.querySelectorAll('[data-eq]').forEach(b => b.addEventListener('click', () => { const [n, slot, item] = b.dataset.eq.split('|'); equipCompanion(n, slot, companionShop(slot).find(i => i.n === item)); }));
}
window.renderBonds = renderBonds;
applyGearHp();
document.getElementById('hub-tile-bonds').addEventListener('click', () => { renderBonds(); showScreen('bonds'); });
document.getElementById('bonds-back-btn').addEventListener('click', () => showScreen('hub'));
