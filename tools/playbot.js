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
  const pickSpell = () => SPELLS.filter(s => s.kind === 'damage' && P.level >= s.ul && P.mp >= s.cost).sort((a, b) => b.cost - a.cost)[0];
  let lowest = 1;
  function fight() {
    let steps = 0; lowest = 1;
    while (steps++ < 4000) {
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
    return steps < 4000;
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
  function readChapters() {
    let more = true;
    while (more) { more = false; for (const c of CHAPTERS) if (!GameState.readChapters.has(c.id) && isChapterUnlocked(c)) { GameState.readChapters.add(c.id); if (c.xpReward) grantXP(c.xpReward); more = true; } }
  }
  const ids = Object.keys(ZONES).slice(0, maxZones);
  for (const zid of ids) {
    const z = ZONES[zid], zs = GameState.zoneState[zid];
    const best = SPELLS.filter(x => x.kind === 'damage' && P.level >= x.ul).sort((a, b) => b.cost - a.cost)[0];
    const [dn, ds] = best.dice.split('d').map(Number);
    const rec = { zone: z.name, lvlIn: P.level, grind: 0, bossTries: 0, deaths: 0,
      cal: { lvl: P.level, mhp: P.mhp, def: getPlayerDefBonus(), dmg: Math.round(dn * (ds + 1) / 2 + Math.floor(P.level / 2) + getPlayerAtkBonus()) } };
    enterZone(zid); zs.quest.started = true;
    let guard = 0;
    while (!zs.quest.done && guard++ < 60) { startEncounter(); fight(); }
    zs.bossUnlocked = true;
    while (!zs.bossDefeated && rec.bossTries < 8) {
      rec.bossTries++; P.hp = P.mhp; P.mp = P.mmp; Object.values(GameState.companions).forEach(c => c.hp = c.mhp);
      startBoss(); fight(); if (rec.bossMin === undefined) rec.bossMin = Math.round(lowest * 100) / 100;
      if (!zs.bossDefeated) { rec.deaths++; for (let g = 0; g < 12; g++) { startEncounter(); fight(); rec.grind++; } shop(); }
    }
    if (!zs.bossDefeated) { rec.wall = true; zs.bossDefeated = true; grantXP(z.boss.xp); } // report the wall, then skip past it so later zones still get measured
    P.hp = P.mhp; P.mp = P.mmp; Object.values(GameState.companions).forEach(c => c.hp = c.mhp);
    readChapters(); shop();
    rec.lvlOut = P.level; rec.gold = P.gold; out.push(rec);
  }
  const unread = CHAPTERS.filter(c => !GameState.readChapters.has(c.id)).map(c => c.id);
  return { out, level: P.level, unread, errs: window.__errs || [] };
};

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 430, height: 880 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(virtualClock);
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
  console.log(`chapters read ${CHAPTER_TOTAL - res.unread.length}/${CHAPTER_TOTAL}`, res.unread.length ? 'unread: ' + res.unread.slice(0, 20).join(',') : '');
  console.log('page errors:', [...errs, ...res.errs].slice(0, 5));
  require('fs').writeFileSync(process.env.PLAYBOT_OUT || '/dev/null', JSON.stringify(rows, null, 1));
  await b.close();
})();
