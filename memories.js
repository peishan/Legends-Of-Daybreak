/* =========================================================================
   Memories (ported from V2): the Journal's second shelf. Lovetalk between San and
   Joel, Family Ties scenes, bonding scenes, the Vision Machine's memories, short
   walks with Joel, and the Guild Chronicle. Scenes open in the same visual-novel
   reader as the chapters. Needs memories-data.js; loaded after voyage.js.
   ========================================================================= */
const MEM_MIN_LEVEL = 200;                    // V2: Lovetalk and Family Ties open at 200
const FAMILY_AFFINITY = [40, 70, 100, 150];   // the same thresholds as the bond tiers
const memState = () => { const g = GameState.guild; if(!g.mem) g.mem = { bought:{}, walkDay:-1, chronicle:[], seen:{} }; if(!g.mem.seen) g.mem.seen = {}; return g.mem; };
const memRead = (id) => GameState.readChapters.has(id);
const memByKind = (k) => MEMORIES.filter(m => m.kind === k);
const bondingNeed = (m) => Math.min(200, Math.round(90 + m.minAffinity * 0.16));   // V2's affinity ran to 700+; V1's tops out at 200
const visionCost = () => Math.max(50000, GameState.player.level * 1000);
const rosterHas = (n) => ROSTER.some(r => r.name === n && rosterUnlocked(r));

function memStatus(m){
  const L = GameState.player.level;
  if(m.kind === 'lovetalk'){
    if(L < MEM_MIN_LEVEL) return { open:false, why:`Opens at Level ${MEM_MIN_LEVEL}` };
    const need = 70 + m.stage * 10;
    if(m.stage > 1 && !memRead('ml' + (m.stage - 1))) return { open:false, why:'Read the previous stage first' };
    return bondVal('Joel') >= need ? { open:true } : { open:false, why:`Joel affinity ${bondVal('Joel')}/${need}` };
  }
  if(m.kind === 'family'){
    if(L < MEM_MIN_LEVEL) return { open:false, why:`Opens at Level ${MEM_MIN_LEVEL}` };
    if(!rosterHas(m.who)) return { open:false, why:`${m.who} has not joined` };
    if(m.stage > 1 && !memRead(`mf-${m.who.toLowerCase()}${m.stage - 1}`)) return { open:false, why:'Read the previous stage first' };
    const need = FAMILY_AFFINITY[m.stage - 1];
    return bondVal(m.who) >= need ? { open:true } : { open:false, why:`${m.who} affinity ${bondVal(m.who)}/${need}` };
  }
  if(m.kind === 'bonding'){
    if(!rosterHas(m.who)) return { open:false, why:`${m.who} has not joined` };
    const need = bondingNeed(m);
    return bondVal(m.who) >= need ? { open:true } : { open:false, why:`${m.who} affinity ${bondVal(m.who)}/${need}` };
  }
  // vision: needs the Vision Machine (Chapter 95), unlocked in order and bought with gold
  if(!GameState.readChapters.has(95)) return { open:false, why:'The Vision Machine is built in Chapter 95' };
  if(memState().bought[m.id]) return { open:true };
  const prev = memByKind('vision').find(x => x.order === m.order - 1);
  if(prev && !memState().bought[prev.id]) return { open:false, why:'Unlock the previous memory first' };
  return { open:false, buy:true, why:`${visionCost().toLocaleString()}G to unlock` };
}
function buyVision(id){
  const m = MEMORIES.find(x => x.id === id), p = GameState.player, c = visionCost();
  if(!m || p.gold < c || !memStatus(m).buy) return;
  p.gold -= c; memState().bought[id] = true; saveGame(); renderMemories();
}
// Bonding scenes have a variant when Soel is along.
function openMemory(id){
  const m = MEMORIES.find(x => x.id === id); if(!m || !memStatus(m).open) return;
  m.scenes = (m.alt && getActiveCompanions().includes('Soel')) ? m.alt : (m.base || (m.base = m.scenes));
  m.sub = m.group; m.eyebrow = { lovetalk:'Lovetalk', family:'Family Ties', bonding:'A quiet evening', vision:'Vision Machine' }[m.kind];
  const seen = !memRead(id); openReader(id, false);
  if(seen) memState().seen[id] = Date.now();
}

// ---- Guild Chronicle: a short written history of the guild, kept as things happen ----
window.addChronicle = (icon, text) => { const c = memState().chronicle; c.unshift({ icon, text }); if(c.length > 60) c.length = 60; };

// ---- Walk with Joel: once a day ----
let lastWalkLine = '';
function takeWalk(){
  const s = memState(), day = guildWeek(); if(s.walkDay === day) return;
  s.walkDay = day; lastWalkLine = WALK_LINES[Math.floor(Math.random() * WALK_LINES.length)];
  const b = bonds(); b.aff.Joel = Math.min(BOND_MAX, bondVal('Joel') + 5);
  GameState.player.hp = GameState.player.mhp; GameState.player.mp = GameState.player.mmp;
  saveGame(); renderMemories();
}

function renderMemories(){
  const root = document.getElementById('memories-content'), s = memState(), e = (t) => String(t).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
  const row = (m) => { const st = memStatus(m), read = memRead(m.id);
    return `<div class="trinket-row ${st.open ? '' : 'locked'}"><div class="tr-icon r-${read ? 'rare' : 'epic'}">${st.open || st.buy ? m.icon : '\u{1F512}'}</div><div class="tr-body"><div class="tr-name">${e(st.open || st.buy ? m.title : 'Locked')}</div>
      <div class="tr-stats">${st.open ? (read ? 'Read · tap to read again' : 'New') : e(st.why)}</div></div>` +
      (st.open ? `<button class="tr-buy" data-open="${m.id}">${read ? 'Reread' : 'Read'}</button>` : st.buy ? `<button class="tr-buy" data-buy="${m.id}" ${GameState.player.gold >= visionCost() ? '' : 'disabled'}>Unlock</button>` : '') + '</div>'; };
  let html = `<div class="inv-section-label">Memories</div><p class="sync-note">Scenes that open as your bonds deepen. Lovetalk and Family Ties open at Level ${MEM_MIN_LEVEL}, in order, as affinity grows; bonding scenes need a high affinity with that companion; the Vision Machine’s memories cost gold.</p>`;
  html += `<div class="inv-section-label">Walk with Joel</div><div class="sync-card"><p class="sync-note">${lastWalkLine ? e(lastWalkLine) : 'A walk, just the two of you. It restores your HP and MP and brings you a little closer.'}</p><button class="sync-btn ${s.walkDay === guildWeek() ? 'ghost' : 'primary'}" id="mem-walk" ${s.walkDay === guildWeek() ? 'disabled' : ''}>${s.walkDay === guildWeek() ? 'Already walked today' : 'Take a walk'}</button></div>`;
  html += `<div class="inv-section-label">Lovetalk · San &amp; Joel</div>` + memByKind('lovetalk').map(row).join('');
  [...new Set(memByKind('family').map(m => m.who))].forEach(w => { html += `<div class="inv-section-label">Family Ties · ${e(w)}</div>` + memByKind('family').filter(m => m.who === w).map(row).join(''); });
  html += `<div class="inv-section-label">Bonding scenes</div>` + memByKind('bonding').map(row).join('');
  html += `<div class="inv-section-label">The Vision Machine</div>` + memByKind('vision').map(row).join('');
  html += `<div class="inv-section-label">Guild Chronicle</div>` + (s.chronicle.length ? s.chronicle.map(c => `<p class="sync-note">${c.icon} ${e(c.text)}</p>`).join('') : '<p class="sync-note">Nothing recorded yet. Milestones are written here as they happen.</p>');
  root.innerHTML = html;
  root.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => openMemory(b.dataset.open)));
  root.querySelectorAll('[data-buy]').forEach(b => b.addEventListener('click', () => buyVision(b.dataset.buy)));
  const w = document.getElementById('mem-walk'); if(w) w.addEventListener('click', takeWalk);
}
window.renderMemories = renderMemories;
// Memories join the reader's lookup so the same scene screen can play them.
MEMORIES.forEach(m => { m.unlockType = 'memory'; });
document.getElementById('jsel-memories-btn').addEventListener('click', () => { renderMemories(); showScreen('memories'); });
document.getElementById('memories-back-btn').addEventListener('click', () => showScreen('journal-select'));
