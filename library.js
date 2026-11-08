/* =========================================================================
   The Library: V2's Season 3 research, ported. San, Mezstorm and Eliz each work
   an angle of the same search. Time passes as you win battles (V1 has no
   calendar): one in-game "day" of V2 is five victories here.
   Needs research-data.js (dilemmas, projects, milestones) and game.js.
   ========================================================================= */
const WINS_PER_DAY = 5;
const LIB_UNLOCK_CHAPTER = 140;   // "The Honest Timescale"
const RESEARCHERS = {
  san:      { name:'San',      angle:'Theory: what a real channel would actually require', icon:'\u{1F52E}' },
  mezstorm: { name:'Mezstorm', angle:'Resonance: how far reaching across distance can actually go', icon:'⛈️' },
  eliz:     { name:'Eliz',     angle:'Safety: whether the ground everyone stands on will hold', icon:'\u{1F49A}' }
};
const libDefault = () => ({ wins:0, total:0, milestones:[], done:[], log:[],
  threads:{ san:{ used:[], pending:null, qid:null }, mezstorm:{ used:[], pending:null, qid:null }, eliz:{ used:[], pending:null, qid:null } },
  active:{ san:null, mezstorm:null, eliz:null } });
const lib = () => (GameState.library = Object.assign(libDefault(), GameState.library || {}));
const libUnlocked = () => GameState.readChapters.has(LIB_UNLOCK_CHAPTER);

// What the research actually does for you.
window.libraryMult = () => 1 + Math.min(0.4, lib().total * 0.004);                    // spell/attack damage from breakthroughs
window.libraryCompanionBonus = (name) => {                                            // Mez's reach and Eliz's steadier ground
  const L = GameState.player.level, d = lib().done;
  if(name === 'Mezstorm' && d.includes('mez_farther_reach')) return { dmgBonus:Math.round(L * 1.5) };
  if(name === 'Eliz' && d.includes('eliz_steadier_ground')) return { healBonus:Math.round(L * 1.2) };
  return null;
};
SPELLS.push(
  { id:'deeper_flame', n:'The Deeper Flame', ul:1, cost:140, dice:'10d12', kind:'damage', mult:1.7, research:'san_trace_flame', proc:{ chance:.5, label:'burn', bonus:200 }, verb:'reaches for the fire underneath fire' },
  { id:'deeper_frost', n:'The Deeper Frost', ul:1, cost:140, dice:'10d12', kind:'damage', mult:1.7, research:'san_trace_frost', proc:{ chance:.5, label:'shock', bonus:200 }, verb:'draws the cold from beneath the cold' },
  { id:'deeper_storm', n:'The Deeper Storm', ul:1, cost:140, dice:'10d12', kind:'damage', mult:1.7, research:'san_trace_storm', proc:{ chance:.5, label:'shock', bonus:200 }, verb:'calls the storm behind the storm' }
);
SPELLS.sort((a, b) => a.ul - b.ul);

function libLog(text){ const l = lib(); l.log.unshift(text); l.log.length = Math.min(l.log.length, 10); showHubToast(text.length > 90 ? text.slice(0, 87) + '…' : text); }

// Time passes with every victory.
window.libraryOnWin = () => {
  if(!libUnlocked()) return;
  const l = lib(); l.wins++;
  Object.entries(l.threads).forEach(([who, th]) => {
    if(!th.pending || l.wins < th.pending.resolveWins) return;
    const dil = LIBRARY_DILEMMAS[who].find(d => d.id === th.pending.id), opt = dil && dil.options[th.pending.opt];
    if(opt){ l.total += opt.breakthroughValue; libLog(`${RESEARCHERS[who].name}’s thread (+${opt.breakthroughValue}): ${opt.outcome}`); checkMilestones(); }
    th.pending = null;
  });
  Object.entries(l.active).forEach(([who, a]) => {
    if(!a || l.wins < a.resolveWins) return;
    const act = LIBRARY_ACTIONS[a.id];
    if(act){ l.done.push(a.id); libLog(`Research complete: ${act.name}. ${act.completeText}`); }
    l.active[who] = null;
  });
};
function checkMilestones(){
  const l = lib();
  for(const k in LIBRARY_MILESTONES) if(l.total >= +k && !l.milestones.includes(k)){ l.milestones.push(k); libLog(LIBRARY_MILESTONES[k]); if(window.addChronicle) addChronicle('\u{1F4D6}', `The Library reached ${k} breakthroughs.`); }
}
function nextQuestion(who){
  const pool = LIBRARY_DILEMMAS[who], th = lib().threads[who];
  const fresh = pool.filter(d => !th.used.includes(d.id)), src = fresh.length ? fresh : pool;
  return src[Math.floor(Math.random() * src.length)];
}
function answerQuestion(who, qid, opt){
  const l = lib(), th = l.threads[who], dil = LIBRARY_DILEMMAS[who].find(d => d.id === qid), o = dil && dil.options[opt];
  if(!o || th.pending) return;
  if(!th.used.includes(qid)) th.used.push(qid);
  th.qid = null; th.pending = { id:qid, opt, resolveWins:l.wins + o.delayDays * WINS_PER_DAY };
  saveGame(); renderLibrary();
}
function actionAvailable(id){ return !lib().done.includes(id) && !Object.values(lib().active).some(a => a && a.id === id); }
function startAction(id){
  const l = lib(), act = LIBRARY_ACTIONS[id], who = act.researcher, p = GameState.player;
  const cost = libraryActionCost(act);
  if(!actionAvailable(id) || l.active[who] || p.gold < cost) return;
  p.gold -= cost; l.active[who] = { id, resolveWins:l.wins + act.days * WINS_PER_DAY };
  saveGame(); renderLibrary();
}
// V2 prices these for a level-500 economy; keep them a fair share of income at whatever level you unlock them.
window.libraryActionCost = (act) => Math.round(act.goldCost * Math.max(0.15, Math.min(1.5, GameState.player.level / 600)));

function renderLibrary(){
  const root = document.getElementById('library-content'), l = lib();
  const e = (s) => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
  if(!libUnlocked()){
    root.innerHTML = `<div class="inv-section-label">The Library</div><div class="sync-card"><p class="sync-note">A door, somewhere past everything mapped, that opens on purpose instead of by accident. Keep going. (Opens with Chapter ${LIB_UNLOCK_CHAPTER}, “The Honest Timescale”.)</p></div>`;
    return;
  }
  let html = `<div class="inv-section-label">The Library</div>
    <p class="sync-note">Nothing here resolves quickly. San, Mezstorm and Eliz each work their own angle; progress happens while you adventure (five victories pass about a day). Every breakthrough sharpens your spells by 0.4%, up to +40%.</p>
    <div class="sync-card" style="text-align:center"><div class="sync-h">Total breakthroughs</div><div style="font-size:30px;font-weight:800;color:var(--sun-soft)">${l.total}</div>
    <p class="sync-note">Spell damage +${Math.round((libraryMult() - 1) * 100)}% · ${l.wins} victories of research time so far</p></div>`;
  Object.entries(RESEARCHERS).forEach(([who, r]) => {
    const th = l.threads[who], a = l.active[who];
    html += `<div class="inv-section-label">${r.icon} ${r.name}</div><div class="sync-card"><p class="sync-note">${e(r.angle)}</p>`;
    if(th.pending){
      const dil = LIBRARY_DILEMMAS[who].find(d => d.id === th.pending.id);
      html += `<p class="sync-note"><b>Working on:</b> “${e(dil.options[th.pending.opt].label)}”. About ${Math.max(1, th.pending.resolveWins - l.wins)} more victories until it resolves.</p>`;
    } else {
      if(!th.qid) th.qid = nextQuestion(who).id;
      const dil = LIBRARY_DILEMMAS[who].find(d => d.id === th.qid);
      html += `<p class="sync-note"><b>${e(dil.prompt)}</b></p>` + dil.options.map((o, i) => `<button class="sync-btn" data-ans="${who}|${dil.id}|${i}">${e(o.label)}</button>`).join('');
    }
    const acts = Object.entries(LIBRARY_ACTIONS).filter(([, act]) => act.researcher === who);
    if(a){
      html += `<p class="sync-note"><b>Project:</b> ${e(LIBRARY_ACTIONS[a.id].name)}. About ${Math.max(1, a.resolveWins - l.wins)} more victories.</p>`;
    } else {
      acts.forEach(([id, act]) => {
        if(l.done.includes(id)){ html += `<p class="sync-note">✅ ${e(act.name)}</p>`; return; }
        const cost = libraryActionCost(act), poor = GameState.player.gold < cost;
        html += `<div class="trinket-row"><div class="tr-icon r-epic">${act.icon}</div><div class="tr-body"><div class="tr-name">${e(act.name)}</div><div class="tr-stats">${e(act.desc)}</div>
          <div class="tr-mats">${cost.toLocaleString()}G · about ${act.days * WINS_PER_DAY} victories · ${rewardLine(id)}</div></div><button class="tr-buy" data-act="${id}" ${poor ? 'disabled' : ''}>Begin</button></div>`;
      });
    }
    html += '</div>';
  });
  if(l.log.length) html += `<div class="inv-section-label">Notes</div>` + l.log.map(t => `<p class="sync-note">${e(t)}</p>`).join('');
  root.innerHTML = html;
  root.querySelectorAll('[data-ans]').forEach(b => b.addEventListener('click', () => { const [who, qid, opt] = b.dataset.ans.split('|'); answerQuestion(who, qid, +opt); }));
  root.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => startAction(b.dataset.act)));
}
function rewardLine(id){
  return ({ san_trace_flame:'unlocks the spell The Deeper Flame', san_trace_frost:'unlocks the spell The Deeper Frost', san_trace_storm:'unlocks the spell The Deeper Storm',
    mez_farther_reach:'Mezstorm hits much harder', eliz_steadier_ground:'Eliz heals much more' })[id];
}
window.renderLibrary = renderLibrary;
document.getElementById('hub-tile-library').addEventListener('click', () => { renderLibrary(); showScreen('library'); });
document.getElementById('library-back-btn').addEventListener('click', () => showScreen('hub'));
