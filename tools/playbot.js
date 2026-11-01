// Scripted playthrough: drives the real game code in headless Chromium on a virtual clock and reports where it gets hard.
// Usage: NODE_PATH=$(npm root -g) node tools/playbot.js [path/to/index.html] [maxZones]
const { chromium } = require('playwright');
const path = require('path');
const file = path.resolve(process.argv[2] || path.join(__dirname, '..', 'index.html'));
const maxZones = +process.argv[3] || 9999;
let CHAPTER_TOTAL = 0;

const virtualClock = () => {
  let now = 1.7e12, seq = 0; const q = [];
  window.Date.now = () => now;
  window.setTimeout = (fn, ms = 0) => { q.push({ id: ++seq, at: now + ms, fn }); return seq; };
  window.setInterval = (fn, ms = 0) => { q.push({ id: ++seq, at: now + ms, fn, every: Math.max(1, ms) }); return seq; };
  window.clearTimeout = window.clearInterval = (id) => { const i = q.findIndex(t => t.id === id); if (i >= 0) q.splice(i, 1); };
  window.__advance = (ms) => {
    const end = now + ms;
    for (;;) {
      q.sort((a, b) => a.at - b.at || a.id - b.id);
      const t = q[0]; if (!t || t.at > end) break;
      now = t.at; q.shift(); if (t.every) { t.at = now + t.every; q.push(t); }
      try { t.fn(); } catch (e) { (window.__errs = window.__errs || []).push(String(e)); }
    }
    now = end;
  };
};

const bot = async (maxZones) => {
  const P = GameState.player, out = [], adv = window.__advance;
  const spellOk = (s) => s.kind === 'damage' && P.level >= s.ul && (!s.research || (GameState.library && GameState.library.done.includes(s.research)));
  const pickSpell = () => SPELLS.filter(s => spellOk(s) && P.mp >= s.cost).sort((a, b) => b.cost - a.cost)[0];
  let lowest = 1;
  function fight(maxSteps = 4000) {
    let steps = 0; lowest = 1;
    while (steps++ < maxSteps) {
      adv(100);
      lowest = Math.min(lowest, P.hp / P.mhp);
      if (!inBattle) break;
      if (pReady && !paused) {
        if (P.hp < P.mhp * 0.4 && Object.values(GameState.potions).some(n => n > 0)) usePotion();
        else { const sp = pickSpell(); if (sp) castSpell(sp.id); else playerAct('attack'); }
      }
    }
    adv(2000); // let a retreat timer finish
    if (!inBattle && document.getElementById('battle-screen').classList.contains('show') && document.getElementById('battle-result').classList.contains('show')) closeBattle(false);
    return steps < maxSteps;
  }
  const dmgScore = t => (t.atk || 0) * 2 + (t.def || 0) * 1.5 + (t.hp || 0) / 4;
  function shop() {
    const slots = { weapon: [WEAPON_SHOP, 'equippedWeapon'], armor: [ARMOR_SHOP, 'equippedArmor'], head: [HEAD_SHOP, 'equippedHead'], hands: [HANDS_SHOP, 'equippedHands'], feet: [FEET_SHOP, 'equippedFeet'], ring: [RING_SHOP, 'equippedRing'], trinket: [TRINKET_SHOP, 'equippedAmulet'] };
    for (const [sl, [base, field]] of Object.entries(slots)) {
      const items = visibleShopItems(base.concat(actGear(sl))).filter(t => Math.floor(t.price * 0.9) <= P.gold).sort((a, b) => dmgScore(b) - dmgScore(a));
      const best = items[0], cur = P[field];
      if (best && (!cur || dmgScore(best) > dmgScore(cur))) buyGear(best, Math.floor(best.price * 0.9), field);
    }
    for (const r of RECIPES.slice().reverse()) {
      if (r.type === 'companion_gear' && GameState.companionGear[r.id]) continue;
      if (r.type === 'potion' && !r.anyAct) continue;
      for (let k = 0; k < 4; k++) { const can = r.anyAct ? actMatTotal() >= r.anyAct : Object.entries(r.mats).every(([m, n]) => (GameState.materials[m] || 0) >= n); if (!can) break; craftItem(r.id); if (r.type === 'companion_gear') break; }
    }
  }
  const hunts = [];
  function guildStep() {
    if (!GameState.zoneState['whispering-woods'].bossDefeated) return;
    GameState.guild.joined = true;
    for (const it of GUILD_SHOP.slice().reverse()) {
      if (!GameState.guild.owned[it.n] && guildRank().rank >= it.minRank && GameState.guild.repBal >= it.cost) buyGuildItem(it);
    }
    for (const h of HUNTS) {
      if (huntDone(h) || huntUnlocked(h)) continue;
      P.hp = P.mhp; P.mp = P.mmp; Object.values(GameState.companions).forEach(c => c.hp = c.mhp);
      let tries = 0;
      while (!huntDone(h) && tries++ < 4) { startHunt(h.id); fight(); const low = lowest; if (!huntDone(h)) { for (let g = 0; g < 6; g++) { startEncounter(); fight(); } } else hunts.push({ hunt: h.id, lvl: P.level, tries, low: Math.round(low * 100) / 100 }); }
      if (!huntDone(h)) hunts.push({ hunt: h.id, lvl: P.level, failed: true });
    }
  }
  const siegeLog = [];
  window.__svCalls = 0; { const _sv = siegeVictory; siegeVictory = function () { window.__svCalls++; try { return _sv.apply(this, arguments); } catch (e) { (window.__errs = window.__errs || []).push('siegeVictory: ' + e.stack); throw e; } }; }
  window.__ovCalls = []; { const _ov = onVictory; onVictory = function () { window.__ovCalls.push([trainingMode, isBoss]); return _ov.apply(this, arguments); }; }
  function libraryStep() {
    if (!libUnlocked()) return;
    for (const who of Object.keys(RESEARCHERS)) {
      const th = lib().threads[who];
      if (!th.pending) { const q = nextQuestion(who); const best = q.options.map((o, i) => [o.breakthroughValue, i]).sort((a, b) => b[0] - a[0])[0][1]; answerQuestion(who, q.id, best); }
      for (const id of Object.keys(LIBRARY_ACTIONS)) if (LIBRARY_ACTIONS[id].researcher === who && actionAvailable(id) && !lib().active[who] && P.gold >= libraryActionCost(LIBRARY_ACTIONS[id])) startAction(id);
    }
  }
  function siegeStep() {
    if (!GameState.guild.joined) return;
    window.__dayShift = (window.__dayShift || 0) + 86400000; // a day passes between zones
    if (!siegeAvailable()) return;
    P.hp = P.mhp; P.mp = P.mmp; Object.values(GameState.companions).forEach(c => c.hp = c.mhp);
    const tier = siegeTier(); startSiege(); const hp0 = currentEnemy.hp, mhp0 = currentEnemy.mhp, mp0 = P.mp; fight(1500); const hp1 = currentEnemy.hp; const won = document.getElementById('battle-result').classList.contains('show');
    siegeLog.push({ lvl: P.level, tier, won, frac: Math.round(siegeState().frac * 100), hp0, hp1, mhp0, mp0, mp1: P.mp, php: P.hp, inB: inBattle, sv: window.__svCalls, ov: JSON.stringify(window.__ovCalls.slice(-2)), tm: trainingMode });
    if (trainingMode) leaveTraining();
  }
  function readChapters() {
    let more = true;
    while (more) { more = false; for (const c of CHAPTERS) if (!GameState.readChapters.has(c.id) && isChapterUnlocked(c)) { GameState.readChapters.add(c.id); if (c.xpReward) grantXP(c.xpReward); more = true; } }
  }
  const ids = Object.keys(ZONES).slice(0, maxZones);
  for (const zid of ids) {
    const z = ZONES[zid], zs = GameState.zoneState[zid];
    const best = SPELLS.filter(spellOk).sort((a, b) => b.cost - a.cost)[0];
    const [dn, ds] = best.dice.split('d').map(Number);
    const rec = { zone: z.name, lvlIn: P.level, grind: 0, bossTries: 0, deaths: 0,
      cal: { lvl: P.level, mhp: P.mhp, def: getPlayerDefBonus(), dmg: Math.round((dn * (ds + 1) / 2 + Math.floor(P.level / 2) + getPlayerAtkBonus()) * (best.mult || 1) * (window.libraryMult ? libraryMult() : 1)) } };
    enterZone(zid); zs.quest.started = true;
    let guard = 0;
    while (!zs.quest.done && guard++ < 60) { startEncounter(); fight(); }
    zs.bossUnlocked = true;
    while (!zs.bossDefeated && rec.bossTries < 8) {
      rec.bossTries++; P.hp = P.mhp; P.mp = P.mmp; Object.values(GameState.companions).forEach(c => c.hp = c.mhp);
      startBoss(); if (window.__botDebug && rec.bossTries === 1) rec.pre = { mhp: P.mhp, hp: P.hp, def: getPlayerDefBonus(), atk: getPlayerAtkBonus(), lvl: P.level, boss: currentEnemy && [currentEnemy.hp, currentEnemy.atk], party: getActiveCompanions() };
      if (window.__botDebug && rec.bossTries === 2) { const tr = []; for (let i = 0; i < 400; i++) { adv(100); if (i % 25 === 0) tr.push([i, currentEnemy.hp, P.hp, Object.values(GameState.companions).map(c => c.hp).join('/'), paused, inBattle, trainingMode, isBoss, document.getElementById('battle-log').textContent.slice(0, 40)]); if (!inBattle) { tr.push(['end', i]); break; } if (pReady && !paused) { const sp = pickSpell(); if (sp) castSpell(sp.id); else playerAct('attack'); } } rec.trace = tr; }
      fight(); if (window.__botDebug && rec.bossTries === 1) rec.post = { errs: (window.__errs || []).slice(-2), inBattle, hp: P.hp, enemyHp: currentEnemy.hp, paused, log: document.getElementById('battle-log').textContent };
      void 0; if (rec.bossMin === undefined) rec.bossMin = Math.round(lowest * 100) / 100;
      if (!zs.bossDefeated) { rec.deaths++; for (let g = 0; g < 12; g++) { startEncounter(); fight(); rec.grind++; } shop(); }
    }
    if (!zs.bossDefeated && window.__botDebug) rec.debug = { inBattle, enemy: currentEnemy && [currentEnemy.name, currentEnemy.hp, currentEnemy.mhp], paused, pReady, eReady, hp: P.hp, log: document.getElementById('battle-log').textContent, errs: (window.__errs || []).slice(-3) };
    if (!zs.bossDefeated) { rec.wall = true; zs.bossDefeated = true; grantXP(z.boss.xp); } // report the wall, then skip past it so later zones still get measured
    P.hp = P.mhp; P.mp = P.mmp; Object.values(GameState.companions).forEach(c => c.hp = c.mhp);
    readChapters(); shop(); guildStep(); libraryStep(); siegeStep();
    rec.lvlOut = P.level; rec.gold = P.gold; out.push(rec);
  }
  const unread = CHAPTERS.filter(c => !GameState.readChapters.has(c.id)).map(c => c.id);
  return { out, level: P.level, unread, hunts, siege: siegeLog, library: { total: lib().total, done: lib().done, wins: lib().wins }, guild: { rank: guildRank().name, rep: GameState.guild.rep, owned: Object.keys(GameState.guild.owned).length }, errs: window.__errs || [] };
};

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 430, height: 880 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(virtualClock);
  if (process.env.BOT_DEBUG) await p.addInitScript(() => { window.__botDebug = true; });
  await p.goto('file://' + file); await p.waitForTimeout(800);
  const t0 = Date.now();
  CHAPTER_TOTAL = await p.evaluate(() => CHAPTERS.length);
  const res = await p.evaluate(bot, maxZones);
  const rows = res.out;
  const walls = rows.filter(r => r.wall), hard = rows.filter(r => r.deaths > 0 && !r.wall);
  console.log(`zones played ${rows.length}, final level ${res.level}, ${(Date.now() - t0) / 1000}s real`);
  console.log('first/last zones:', rows[0] && `${rows[0].zone} L${rows[0].lvlIn}`, '->', rows.at(-1) && `${rows.at(-1).zone} L${rows.at(-1).lvlOut || rows.at(-1).lvlIn}`);
  console.log('zones with a boss loss:', hard.map(r => `${r.zone} (L${r.lvlIn}, ${r.deaths} deaths)`).join('; ') || 'none');
  console.log('walls:', walls.map(r => `${r.zone} (L${r.lvlIn})`).join('; ') || 'none');
  const mins = rows.map(r => r.bossMin).filter(x => x !== undefined).sort((a, b) => a - b);
  console.log('lowest HP fraction in first boss attempt: min', mins[0], 'p10', mins[Math.floor(mins.length * .1)], 'median', mins[Math.floor(mins.length / 2)], 'p90', mins[Math.floor(mins.length * .9)]);
  console.log('hardest:', rows.filter(r => r.bossMin !== undefined).sort((a, b) => a.bossMin - b.bossMin).slice(0, 8).map(r => `${r.zone} L${r.lvlIn} ${r.bossMin}`).join('; '));
  console.log('guild:', JSON.stringify(res.guild), '| hunts:', res.hunts.map(x => `${x.hunt}@L${x.lvl}${x.failed ? ' FAILED' : ' tries ' + x.tries + ' low ' + x.low}`).join('; '));
  const sg = res.siege; console.log('siege attempts', sg.length, 'broken', sg.filter(x => x.won).length, 'tiers reached', Math.max(...sg.map(x => x.tier)), '| library', JSON.stringify(res.library));
  console.log(`chapters read ${CHAPTER_TOTAL - res.unread.length}/${CHAPTER_TOTAL}`, res.unread.length ? 'unread: ' + res.unread.slice(0, 20).join(',') : '');
  console.log('page errors:', [...errs, ...res.errs].slice(0, 5));
  require('fs').writeFileSync(process.env.PLAYBOT_OUT || '/dev/null', JSON.stringify(rows, null, 1));
  if (process.env.PLAYBOT_SIEGE) require('fs').writeFileSync(process.env.PLAYBOT_SIEGE, JSON.stringify(res.siege));
  await b.close();
})();
