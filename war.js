/* =========================================================================
   Guild War (ported from V2): a streak gauntlet against rival guilds, fought
   with a squad you pick from your recruited companions. Each win makes the
   next rival 6% tougher; retreat any time and keep what you earned. Rivals you
   have mustered against ten times can be offered a Trade Accord (daily payout,
   and they stop showing up). Needs war-data.js; loaded after bonds.js.
   ========================================================================= */
const WAR_MIN_LEVEL = 105, WAR_CHAPTER = 101, WAR_ACCORD_AT = 10;
const warState = () => { const g = GameState.guild; if(!g.war) g.war = { active:false, streak:0, best:0, fielded:[], muster:{}, accords:[], lastPay:-1 }; return g.war; };
const warUnlocked = () => GameState.guild.joined && GameState.player.level >= WAR_MIN_LEVEL && GameState.readChapters.has(WAR_CHAPTER);
const warMaxFielded = () => { const r = guildRank().rank; return 3 + (r >= 4 ? 1 : 0) + (r >= 7 ? 1 : 0) + (r >= 10 ? 1 : 0); };
const warCandidates = () => WAR_MEMBERS.filter(m => ROSTER.some(r => r.name === m.name && rosterUnlocked(r)));
const warBuff = (k) => (trainingMode === 'war') ? warState().fielded.reduce((t, n) => { const m = WAR_MEMBERS.find(x => x.name === n); return t + (m && m.fieldBuff[k] || 0); }, 0) : 0;
// Fielded members' buffs add onto the multipliers the rest of the game already reads.
for(const [fn, key] of [['bondSpellMult', 'spellDmgPct'], ['bondAtkMult', 'atkPct'], ['bondHealMult', 'healPct'], ['bondGoldMult', 'goldPct'], ['guildXpMult', 'xpPct'], ['guildCrit', 'critPct']]){
  const old = window[fn]; window[fn] = () => old() + warBuff(key);
}

function warRivalDef(rv){
  const s = warState(), L = GameState.player.level, cal = curveAt(L), levelXp = 30 + (L - 1) * 25, mult = 1 + s.streak * 0.10;
  const atk = Math.round((cal.def + cal.mhp * 0.10) * 0.85 * mult), hp = Math.round(cal.dmg * 28 * 0.8 * mult);
  const b = { name:rv.n, mechanic:rv.mechanic, hp, atk, spd:5, xp:Math.round(levelXp * 0.02 * (1 + s.streak * 0.1)), g:Math.round(L * 35 * (1 + s.streak * 0.1)),
    hint:rv.desc.split('. ')[0] + '.', introLine:rv.desc, spriteCls:'act2-body', crownCls:'act2-crown', tint:['#e0a050', '#704020'] };
  switch(rv.mechanic){
    case 'rampage': case 'crush': b.mechanic = 'rampage'; b.rampageEvery = rv.rampageTurn || rv.crushTurn || 4; b.rampageDmg = Math.round(atk * 1.1); break;
    case 'phase': b.phaseThresholds = [0.66, 0.33]; break;
    case 'resurrect': b.lives = [Math.round(hp * 0.85), Math.round(hp * 0.2)]; b.lifeNames = ['The Muster', 'The Last Stand']; delete b.hp; break;
    case 'devour': b.devourTurn = rv.devourTurn || 4; b.devourDmg = Math.round(atk * 1.2); b.staggerPct = 0.35; break;
    case 'apocalypse': b.apocalypseTurn = rv.apocalypseTurn || 6; b.apocalypseDmg = Math.round(atk * 1.1); break;
  }
  return b;
}
function warPickRival(){
  const s = warState(), pool = WAR_RIVALS.filter(r => !s.accords.includes(r.n));
  const src = pool.length ? pool : WAR_RIVALS; return src[Math.floor(Math.random() * src.length)];
}
let warRival = null;
function warLeaderLine(name){
  const l = WAR_LEADERS[name]; if(!l) return '';
  const n = warState().muster[name] || 0, tier = l.tiers.find(t => n <= t.max) || l.tiers[l.tiers.length - 1];
  return tier.lines[Math.floor(Math.random() * tier.lines.length)];
}
function startWar(fresh = true){
  const s = warState(); if(!warUnlocked() || !s.fielded.length) return;
  if(fresh) s.streak = 0;
  s.active = true; warRival = warPickRival();
  s.muster[warRival.n] = (s.muster[warRival.n] || 0) + 1;
  trainingMode = 'war'; trainingZoneId = null;
  showScreen('map');
  const boss = warRivalDef(warRival);
  currentBossDef = boss; silencedUntil = 0;
  isBoss = true; inBattle = true; paused = false; bossTurnCount = 0; bossLifeIndex = 0; bossPhaseIndex = 0; bossCharging = false;
  const hp = boss.mechanic === 'resurrect' ? boss.lives[0] : boss.hp;
  currentEnemy = { name:boss.name, hp, mhp:hp, atk:boss.atk, spd:boss.spd, xp:boss.xp, g:boss.g, mechanic:boss.mechanic };
  document.getElementById('battle-e-name').textContent = `${boss.name} (Guild War, streak ${s.streak})`;
  document.getElementById('battle-e-hint').textContent = boss.hint;
  spawnEnemySprite(boss, true);
  document.getElementById('battle-screen').classList.add('boss-mode');
  const banter = warLeaderLine(boss.name);
  document.getElementById('battle-log').textContent = banter || `${boss.name} musters against you.`;
  resetBattleUI();
  document.getElementById('battle-screen').classList.add('show');
  updateAutoRow(); startTicking(); playTrack('antagonist');
}
function warVictory(){
  const s = warState(), p = GameState.player, g = GameState.guild;
  s.streak++; s.best = Math.max(s.best, s.streak);
  const xp = Math.round(currentEnemy.xp * guildXpMult()), gold = Math.round(currentEnemy.g * guildGoldMult()), rep = Math.round(repFor(p.level) * 0.8 * (1 + s.streak * 0.1));
  g.rep += rep; g.repBal += rep; p.gold += gold;
  const leveled = grantXP(xp); updateMapHud();
  document.getElementById('battle-res-eyebrow').textContent = `Muster won · streak ${s.streak}`;
  document.getElementById('battle-res-title').textContent = `${currentEnemy.name} stands down`;
  document.getElementById('battle-res-rewards').innerHTML = `+${xp} XP · +${gold} Gold · +${rep} Guild Rep<br>The next rival will be ${Math.round(s.streak * 10)}% tougher.`;
  document.getElementById('battle-result').classList.add('show');
  const cont = document.getElementById('battle-result-continue-btn'); cont.textContent = 'Next muster'; cont.onclick = () => startWar(false);
  const leave = document.getElementById('battle-result-leave-btn'); leave.style.display = 'block'; leave.textContent = 'Retreat (keep rewards)';
  if(leveled) setTimeout(() => { document.getElementById('map-levelup-text').textContent = `San reached Level ${p.level}`; flashBanner(document.getElementById('map-levelup-banner')); }, 200);
  saveGame();
}
function warEnd(){ const s = warState(); s.active = false; saveGame(); }
window.warVictory = warVictory; window.startWar = startWar;
// The squad fights in place of the usual party.
{ const gac = getActiveCompanions;
  getActiveCompanions = function(){ if(trainingMode === 'war') return warState().fielded.filter(n => ROSTER.some(r => r.name === n && rosterUnlocked(r))); return gac.apply(this, arguments); }; }

function canAccord(n){ return !warState().accords.includes(n) && (warState().muster[n] || 0) >= WAR_ACCORD_AT; }
function proposeAccord(n){ if(!canAccord(n)) return; warState().accords.push(n); showHubToast(`${n} sign a Trade Accord. They will pay you daily and stop mustering.`); saveGame(); renderGuild(); }
function collectAccords(){
  const s = warState(), day = guildWeek(); if(!s.accords.length || s.lastPay === day) return;
  const days = s.lastPay < 0 ? 1 : Math.min(7, day - s.lastPay), p = GameState.player, g = GameState.guild;
  const gold = Math.round(p.level * 12 * s.accords.length * days), rep = 15 * s.accords.length * days;
  p.gold += gold; g.rep += rep; g.repBal += rep; s.lastPay = day; showHubToast(`Trade Accords paid ${gold.toLocaleString()}G and ${rep} Guild Rep.`);
}

window.warSectionHtml = () => {
  collectAccords();
  const s = warState(), e = (t) => String(t).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
  let html = `<div class="inv-section-label">Guild War · rival musters, streak gauntlet</div><div class="sync-card"><div class="sync-h">Best streak ${s.best} <span>${s.accords.length} accord${s.accords.length === 1 ? '' : 's'}</span></div>`;
  if(!warUnlocked()){
    html += `<p class="sync-note">Opens at Level ${WAR_MIN_LEVEL} once you have joined the Guild and met Iris and Ash (Chapter ${WAR_CHAPTER}).</p></div>`; return html;
  }
  html += `<p class="sync-note">Field up to ${warMaxFielded()} members (more at Guild ranks 4, 7 and 10). They fight the muster in place of your party and add their field bonus. Each win makes the next rival 10% tougher; lose and the streak ends, but everything earned stays.</p>`;
  html += warCandidates().map(m => { const on = s.fielded.includes(m.name), full = !on && s.fielded.length >= warMaxFielded();
    return `<button class="sync-btn ${on ? 'primary' : 'ghost'}" data-field="${e(m.name)}" ${full ? 'disabled' : ''}>${m.icon || ''} ${e(m.name)} · ${e(m.role)} · ${Object.entries(m.fieldBuff).map(([k, v]) => '+' + Math.round(v * 100) + '% ' + k.replace('Pct', '')).join(', ')}${on ? ' ✓' : ''}</button>`; }).join('');
  html += `<button class="sync-btn primary" id="war-start" ${s.fielded.length ? '' : 'disabled'}>${s.fielded.length ? 'Start a muster' : 'Field at least one member'}</button>`;
  const due = WAR_RIVALS.filter(r => canAccord(r.n));
  html += due.map(r => `<button class="sync-btn" data-accord="${e(r.n)}">Offer ${e(r.n)} a Trade Accord</button>`).join('') + '</div>';
  return html;
};
window.warBind = (root) => {
  root.querySelectorAll('[data-field]').forEach(b => b.addEventListener('click', () => { const s = warState(), n = b.dataset.field, i = s.fielded.indexOf(n); if(i >= 0) s.fielded.splice(i, 1); else if(s.fielded.length < warMaxFielded()) s.fielded.push(n); saveGame(); renderGuild(); }));
  root.querySelectorAll('[data-accord]').forEach(b => b.addEventListener('click', () => proposeAccord(b.dataset.accord)));
  const st = document.getElementById('war-start'); if(st) st.addEventListener('click', () => startWar(true));
};
