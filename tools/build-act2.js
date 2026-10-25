// Builds act2-data.js (zones + journal chapters) and the art under assets/ from the
// Legends of Daybreak V2 repo. Usage: node tools/build-act2.js /path/to/legends-of-daybreak-v2
// Image resizing needs python3 + Pillow.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const V2 = process.argv[2];
if (!V2) { console.error('usage: node tools/build-act2.js <v2 repo path>'); process.exit(1); }
const OUT = path.join(__dirname, '..');

const g = fs.readFileSync(path.join(V2, 'game.js'), 'utf8');
const zoneRows = {};
for (const m of g.matchAll(/\{ n: (['"])(.+?)\1, lv: (\d+), elem: '(\w+)', d: (['"])([\s\S]*?)\5, en: \[([^\]]*)\], loot: \[([^\]]*)\]/g)) {
  const list = s => [...s.matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g)].map(x => (x[1] ?? x[2]).replace(/\\'/g, "'"));
  const un = s => s.replace(/\\u2019/g, '\u2019').replace(/\\u2014/g, '\u2014').replace(/\\'/g, "'");
  zoneRows[un(m[2])] = { lv: +m[3], elem: m[4], d: un(m[6]), en: list(m[7]).map(un), loot: list(m[8]).map(un) };
}
const ch = (() => { const s = fs.readFileSync(path.join(V2, 'journey2daybreak/chapters-data.js'), 'utf8'); return new Function(s + ';return CHAPTERS')(); })();

// id, V2 zone name, V2 chapter, boss mechanic + params, boss art (V2 bosses/*.jpg) or null, quest/merchant flavour
const Z = [
  ['the-breaking', 'The Breaking', 21, ['phase', { phaseThresholds: [0.66, 0.33] }], null, ['Torn Seam', '🌀', 'Edge of the Wound', 'Lark', '🧵', '"I sell what the Breaking shook loose. Take care — some of it still hums."']],
  ['the-silent-ruin', 'The Silent Ruin', 22, ['rampage', { rampageEvery: 3, rampageDmg: 24 }], null, ['Broken Waymark', '🗿', 'Broken Waymark', 'Dunn', '🪨', '"Aethon\'s old stonework, mostly. Heavy, but honest."']],
  ['ashfall-market', 'Ashfall Market', 23, ['rampage', { rampageEvery: 4, rampageDmg: 28 }], null, ['Cold Stall', '🏚️', 'Abandoned Stall', 'Cinder', '🪙', '"Prices are the same as they were. Only the customers changed."']],
  ['the-drowned-ledger', 'The Drowned Ledger', 24, ['drown', { drownTurn: 4, drownDmg: 26, drownSaveChance: 0.5 }], null, ['Water-Stained Ledger', '📒', 'Water-Stained Ledger', 'Pell', '🧾', '"Audits cost extra. Everything costs extra."']],
  ['rustbound-docks', 'Rustbound Docks', 25, ['lightning_rod', { rodTurns: 3, rodDmg: 30 }], 'theforeman', ['Timeclock', '⏱️', 'Stuck Timeclock', 'Brisk', '⚙️', '"One more shift, one more crate. Gears for sale — they never stop turning."']],
  ['the-widows-watch', "The Widow's Watch", 26, ['resurrect', { lives: [150, 140], lifeNames: ['The Watcher', 'The Letter'] }], 'echoofjoel', ['Cold Lantern', '🏮', 'Unlit Lantern', 'Mara', '✉️', '"I keep letters nobody collected. Take one. Maybe it is yours."']],
  ['forgotten-pemmican-roads', 'Forgotten Pemmican Roads', 27, ['freeze', { freezeChance: 0.3, freezeDuration: 3000 }], 'thevanishedguide', ['Waymarker', '🪧', 'Faded Waymarker', 'Toll', '🥓', '"Dried rations, sold to no one for years. Fresh as the day she walked here."']],
  ['the-quiet-nursery', 'The Quiet Nursery', 28, ['devour', { devourTurn: 5, devourDmg: 34, staggerPct: 0.35 }], 'holloweliz', ['Cracked Rattle', '🪇', 'Cracked Rattle', 'Hush', '🧸', '"Soft things, mostly. Keep your voice low."']],
  ['bladeless-barracks', 'Bladeless Barracks', 29, ['rampage', { rampageEvery: 3, rampageDmg: 30 }], 'rustboundzaki', ['Training Dummy', '🎯', 'Training Dummy', 'Rook', '🛡️', '"Check your pack. Check it again. Then buy something."']],
  ['the-storm-that-stayed', 'The Storm That Stayed', 30, ['lightning_rod', { rodTurns: 3, rodDmg: 34 }], 'mezstormunbound', ['Sealed Locket', '📿', 'Storm-Sealed Locket', 'Gale', '⚡', '"Bottled lightning, unopened letters. Both are dangerous to read."']],
  ['embercats-grave', "Embercat's Grave", 31, ['freeze', { freezeChance: 0.35, freezeDuration: 3000 }], 'thefadingfamiliar', ['Cooling Ember', '🔥', 'Guttering Ember', 'Ash', '🐾', '"Little things that someone loved. Please remember them."']],
  ['the-empty-ledger', 'The Empty Ledger', 32, ['resurrect', { lives: [160, 150], lifeNames: ['Gone', 'Gone Again'] }], 'echoofaisyah', ['Blank Entry', '📖', 'Blank Ledger Entry', 'Ink', '🖋️', '"Her hand used to be steady. I only sell what she left behind."']],
  ['the-weight-you-carry', 'The Weight You Carry', 33, ['drown', { drownTurn: 4, drownDmg: 30, drownSaveChance: 0.45 }], 'thetiredversion', ['Practiced Smile', '🙂', 'Practiced Smile', 'Rest', '🛏️', '"Nothing here is heavy. That is the whole point."']],
  ['the-architects-chamber', "The Architect's Chamber", 34, ['phase', { phaseThresholds: [0.66, 0.33] }], null, ['Blueprint', '📐', 'Unfinished Blueprint', 'Quill', '🗝️', '"Every door was drawn first. I sell the keys."']],
  ['what-remains-united', 'What Remains United', 35, ['resurrect', { lives: [140, 130, 120], lifeNames: ['Joel', 'Eliz', 'Everyone'] }], null, ['Splinter Seal', '⚖️', 'Splinter Court Seal', 'Echo', '🪞', '"I trade in questions. Yours is already waiting."']],
  ['where-the-break-began', 'Where the Break Began', 36, ['apocalypse', { apocalypseTurn: 6, apocalypseDmg: 44 }], null, ['The First Crack', '💥', 'The First Crack', 'Seam', '🩹', '"Mended pieces, mostly. Proof it can be done."']],
  ['the-first-repair', 'The First Repair', 37, ['phase', { phaseThresholds: [0.66, 0.33] }], null, ['First Seam', '🪡', 'First Repaired Seam', 'Patch', '🧶', '"Slow work. Good work. Take your time."']],
  ['what-almost-broke-again', 'What Almost Broke Again', 38, ['inferno', { infernoTurn: 4, infernoDmg: 38 }], null, ['Reopened Seam', '🩸', 'Reopened Seam', 'Stitch', '🔥', '"Some days the seam holds. Some days it does not. Both days count."']],
  ['the-fear-after-the-storm', 'The Fear After the Storm', 39, ['freeze', { freezeChance: 0.35, freezeDuration: 3200 }], null, ['Open Question', '❓', 'Unanswered Question', 'Maybe', '⏳', '"Borrowed time, by the hour. Spend it well."']],
  ['everyone-together', 'Everyone, Together', 40, ['devour', { devourTurn: 5, devourDmg: 40, staggerPct: 0.35 }], null, ['Chorus Stone', '🎶', 'Chorus Fragment', 'Hearth', '🏠', '"Everyone eats first. Then we talk about prices."']],
  ['daybreak', 'Daybreak', 41, ['resurrect', { lives: [160, 150, 140, 130, 120], lifeNames: ['Dusk', 'Hollow', 'Echo', 'Break', 'Dawn'] }], null, ['First Light', '🌅', 'First Light', 'Morning', '☀️', '"Nothing for sale. Take what you need. You earned the morning."']],
  ['the-unmapped-road', 'The Unmapped Road', 49, ['phase', { phaseThresholds: [0.66, 0.33] }], null, ['Blank Map', '🗺️', 'Blank Map Edge', 'Wend', '🥾', '"Nothing here is charted, so nothing here is overpriced. Yet."']],
  ['the-borrowed-coast', 'The Borrowed Coast', 50, ['drown', { drownTurn: 4, drownDmg: 36, drownSaveChance: 0.5 }], null, ['Carved Rock', '🪨', 'Rock of Names', 'Brine', '🐚', '"Every name on these rocks paid once. The sea keeps the receipts."']],
  ['the-salt-debt', 'The Salt Debt', 51, ['resurrect', { lives: [150, 140], lifeNames: ['The Owed', 'The Owing'] }], null, ['Debt Post', '⚖️', 'Debt Post', 'Tally', '🧂', '"I will sell you salt. You will owe me salt. We both know how this goes."']],
  ['the-quiet-uprising', 'The Quiet Uprising', 52, ['devour', { devourTurn: 5, devourDmg: 42, staggerPct: 0.35 }], null, ['Listening Stone', '👂', 'Listening Stone', 'Murmur', '🕯️', '"Keep your voice down. It has been listening for a long time."']],
  ['where-the-walk-leads', 'Where the Walk Leads', 53, ['apocalypse', { apocalypseTurn: 6, apocalypseDmg: 46 }], null, ['Far Marker', '🧭', 'Furthest Marker', 'Farwell', '🎒', '"There will be another road after this one. Pack accordingly."']],
  ['the-hollow-vigil', 'The Hollow Vigil', 54, ['freeze', { freezeChance: 0.35, freezeDuration: 3200 }], 'thehollowprophet', ['Closed Eye', '👁️', 'Closed-Eye Altar', 'Vesper', '🕯️', '"Grief candles, unlit. Take one if you must. Do not light it here."'],
    { elem: 'void', d: 'A vigil kept by the Cult of the Closed Eye, where grief was taught to look like faith. The candles here have never once been lit, and the congregation keeps waiting anyway.', en: ['Closed-Eye Acolyte', 'Grief Chanter', 'Veiled Zealot'], loot: ['Unlit Candle', 'Acolyte\'s Veil', 'Hollow Hymnal'] }],
  ['the-scattered-choir', 'The Scattered Choir', 57, ['resurrect', { lives: [160, 150, 140], lifeNames: ['The Doctrine', 'The Habit', 'The Last Believer'] }], 'sisterwren', ['Silent Hymnal', '📜', 'Silent Hymnal', 'Cantor', '🔔', '"The choir is gone. The songs are not. Buy one, hum it quietly."'],
    { elem: 'arcane', d: 'What is left of the cult after its prophet fell — voices without a conductor, a hymn that no longer has a verse, and one believer who stayed because leaving would mean admitting what she was right about.', en: ['Choir Remnant', 'Hymnless Cantor', 'Candle Bearer'], loot: ['Cracked Bell', 'Torn Hymn Sheet', 'Last Candle'] }],
  ['where-the-old-names-wait', 'Where the Old Names Wait', 79, ['resurrect', { lives: [180, 175, 170, 165, 160], lifeNames: ['The Ex-Mother-in-Law', 'The Ex-Husband', 'The Village Ex', 'The Brunei Ex', 'The Stepfather'] }], null, ['Name Stone', '🪦', 'Old Name Stone', 'Ledger', '📜', '"I remember all of them. You do not have to. Not today."'],
    { elem: 'poison', d: 'The Vale builds confrontations from memory, not accuracy. Here every old name that ever had a claim on you waits in a row, sharpened by the years, still expecting you to answer.', en: ['Old Name', 'Remembered Slight', 'Unsent Grievance'], loot: ['Faded Photograph', 'Old Grievance', 'Unwritten Reply'] }, 'The Old Names', [79, 80, 81, 82, 83]],
  ['the-retainers-hollow', "The Retainer's Hollow", 86, ['rampage', { rampageEvery: 3, rampageDmg: 48 }], 'robin', ['Filing Tree', '🗄️', 'Filing Tree', 'Overtime', '☕', '"Burnt coffee, one dollar. Cold fluorescent light, free."']],
  ['the-treeline-detail', 'The Treeline Detail', 87, ['lightning_rod', { rodTurns: 3, rodDmg: 50 }], 'jeff', ['Loading Dock', '📦', 'Bolted Loading Dock', 'Gantry', '🔦', '"Floodlights run on a generator nobody asked permission for. Supplies, though, are real."']],
  ['sunreach-fields', 'Sunreach Fields', 94, ['phase', { phaseThresholds: [0.66, 0.33] }], 'skarrowyn', ['Leaning Harvest', '🌾', 'Leaning Harvest', 'Reap', '🧺', '"Every stalk here leans the same direction. Ask yourself why."'], null, 'Skarrowyn, the Split Horizon', [94, 95]],
];

// ---- Later worlds (V2 zones from the Verdant Reach onward): generated from V2's zone rows and boss table ----
const un2 = s => s.replace(/\\u2019/g, '’').replace(/\\u2014/g, '—').replace(/\\'/g, "'").replace(/’/g, "'");
const v2Boss = {};
for (const m of g.matchAll(/\{ n: ('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"), zone: ('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"), hp: (\d+)/g)) {
  const zn = un2(m[2].slice(1, -1)), hp = +m[3];
  if (!v2Boss[zn] || hp > v2Boss[zn].hp) v2Boss[zn] = { name: un2(m[1].slice(1, -1)).replace('SK* ', 'SK '), hp };
}
const slug = s => s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const WORLDS = [ // [max V2 level, quest, merchant, easy?]
  [100, ['Green Marker', '🌿', 'Green Marker', 'Fern', '🍃', '"Fresh from the Vale. Mind the roots."']],
  [300, ['Dead Terminal', '🖥️', 'Dead Terminal', 'Liang', '🧰', '"I fix what the system forgot to switch off."']],
  [400, ['Drafting Table', '📐', 'Drafting Table', 'Scrivener', '🖋️', '"Every door was a drawing first. I sell the erasers."']],
  [500, ['Roadwarden Post', '🛤️', 'Roadwarden Post', 'Warden', '🪙', '"The toll is gentleness. Pay what you can."']],
  [550, ['Cat Shrine', '🐈', 'Cat Shrine', 'Whisker', '🐟', '"Nothing here bites. Much."'], true],
  [650, ['Tide Pillar', '🌊', 'Tide Pillar', 'Reef', '🐚', '"The water took everything but the bargains."']],
  [750, ['Crypt Door', '⚰️', 'Crypt Door', 'Undertaker', '🕯️', '"Nothing here ended. Everything is for sale."']],
  [850, ['Stone Face', '🗿', 'Stone Face', 'Veil', '🪞', '"Do not look at the goods. Look at the price."']],
  [950, ['Wind Perch', '🪶', 'Wind Perch', 'Falconer', '🦅', '"Feathers, favours, and clean air."']],
  [1050, ['Brass Lamp', '🪔', 'Brass Lamp', 'Djinn', '✨', '"Say exactly what you mean. I will."']],
  [1150, ['Standing Stone', '🗻', 'Standing Stone', 'Elder', '🔥', '"Older than the word market."']],
  [9999, ['Jade Altar', '🏯', 'Jade Altar', 'Monk', '🍵', '"Tea first. Ascension after."']],
];
const MECHS = [
  (a) => ['phase', { phaseThresholds: [0.66, 0.33] }], (a) => ['rampage', { rampageEvery: 3, rampageDmg: Math.round(a * 1.1) }],
  (a) => ['freeze', { freezeChance: 0.3, freezeDuration: 3000 }], (a) => ['drown', { drownTurn: 4, drownDmg: Math.round(a * 1.1), drownSaveChance: 0.5 }],
  (a) => ['devour', { devourTurn: 5, devourDmg: Math.round(a * 1.2), staggerPct: 0.35 }], (a) => ['lightning_rod', { rodTurns: 3, rodDmg: Math.round(a * 1.1) }],
  (a) => ['inferno', { infernoTurn: 4, infernoDmg: Math.round(a * 1.1) }], (a) => ['apocalypse', { apocalypseTurn: 6, apocalypseDmg: Math.round(a * 1.3) }],
];
const gFrom = g.indexOf("n: 'The Unbroken Vale'"), gTo = g.indexOf('VOYAGE: SEA EXPLORATION');
const laterNames = [...g.slice(gFrom - 6, gTo).matchAll(/\{ n: (['"])(.+?)\1, lv: (\d+)/g)].map(m => un2(m[2])).filter(n => n !== 'The Endless Thinning');
const norm = s => un2(s);
const rowFor = n => Object.entries(zoneRows).find(([k]) => norm(k) === norm(n))?.[1];
const done = new Set(['The Retainer\'s Hollow', 'The Treeline Detail', 'Sunreach Fields']);
const extraIds = new Set(), extra = [];
laterNames.filter(n => !done.has(n)).forEach(n => {
  const r = rowFor(n); if (!r) return;
  const w = WORLDS.find(w => r.lv <= w[0]);
  const id = slug(n), real = v2Boss[norm(n)];
  const isCap = real && real.hp > 1000000;
  const bname = real ? real.name : 'Alpha ' + r.en[r.en.length - 1].replace(/^(A|An|The) /, '').split(',')[0];
  const mi = extra.length % MECHS.length;
  const mech = isCap ? (a) => ['resurrect', { lives: [150, 140, 130, 120, 110], lifeNames: ['First', 'Second', 'Third', 'Fourth', 'Last'] }] : MECHS[mi];
  extra.push([id, n, null, mech, null, w[1], r, bname, null, { easy: !!w[2], cap: isCap || r.lv === 100 || ['The Rootbound Sanctuary'].includes(n) }]);
  extraIds.add(id);
});

const ELEM = { // [bg top, mid, bottom, accent, accent2]
  water: ['#08182a', '#0e2c48', '#144a68', '#8ad8ff', '#2a6a9a'], poison: ['#0c1c10', '#16301a', '#244a26', '#9aff8a', '#3a7a3a'],
  void: ['#10081c', '#1c1030', '#2a1848', '#a888ff', '#5a3a9a'], none: ['#1a1814', '#262218', '#3a3220', '#d8c8a0', '#6a5a3a'],
  fire: ['#2a0e08', '#3c1a0c', '#522410', '#ff8a4a', '#a82a0a'], ice: ['#101c2c', '#1c3048', '#284868', '#a8e0ff', '#3a6a9a'],
  lightning: ['#14182c', '#1e2848', '#2c3c68', '#ffe066', '#4a5aa8'], arcane: ['#1c1030', '#2c1848', '#44206a', '#e0a8ff', '#7a3aba'],
};
// CSS-only journal scene per chapter (the V1 journal is a visual novel, no comic art)
const MOTIF = { 21: 'cracks', 22: 'pillars', 23: 'pillars', 24: 'water', 25: 'gears', 26: 'beam', 27: 'road', 28: 'mobile', 29: 'embers', 30: 'storm', 31: 'embers',
  32: 'ledger', 33: 'ledger', 34: 'gears', 35: 'figures', 36: 'cracks', 37: 'mend', 38: 'cracks', 39: 'horizon', 40: 'figures', 41: 'dawn' };
const i2 = n => String(n).padStart(3, '0');
const zones = {}, chapters = [];
const sh = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit' });
fs.mkdirSync(path.join(OUT, 'assets/boss'), { recursive: true });
const resize = `
import sys
from PIL import Image
src,dst,w,q=sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4])
im=Image.open(src).convert('RGB')
if im.width>w: im=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
im.save(dst,'JPEG',quality=q,optimize=True)`;
const rs = (s, d, w, q) => execFileSync('python3', ['-I', '-c', resize, s, d, String(w), String(q)]);

const zoneOfChapter = {};
Z.forEach(([id, , cid, , , , , , chs]) => (chs || [cid]).forEach(c => { zoneOfChapter[c] = id; }));
const iScatter = Z.findIndex(z => z[0] === 'the-scattered-choir');
const lateX = extra.filter(e => e[6].lv > 65);
const Zall = [...Z.slice(0, iScatter + 1), ...extra.filter(e => e[6].lv <= 65), ...Z.slice(iScatter + 1), ...lateX];
const lateIds = new Set(lateX.map(e => e[0]));
const CLIMAX = new Set(['where-the-break-began', 'daybreak', 'the-scattered-choir', 'sunreach-fields']);

Zall.forEach(([id, zn, cid, m3, art, [qLabel, qIcon, qNpc, mName, mIcon, mLine], rowOverride, bossOverride, , opts], i) => {
  const easy = opts && opts.easy ? 0.5 : 1;
  const r = rowOverride || zoneRows[zn]; if (!r) throw new Error('V2 zone not found: ' + zn);
  const c = cid ? ch.find(x => x.id === cid) : { quote: '' }; if (!c) throw new Error('chapter ' + cid);
  const elem = ELEM[r.elem] ? r.elem : 'none';
  const bossName = bossOverride || c.bossName.trim();
  const atkB = Math.round((28 + i * 1.1) * 3 * easy);
  const [mech, mp] = typeof m3 === 'function' ? m3(atkB) : m3;
  const bossHp = Math.round((520 + i * 45) * 3 * easy); // tuned by headless fights: V1's curve left these bosses dying in ~8 casts
  const boss = Object.assign({ name: bossName, mechanic: mech, atk: atkB, spd: 5, xp: 2200 + i * 120, g: 1200 + i * 60,
    hint: r.d.split('. ')[0].slice(0, 110), introLine: r.d, spriteCls: 'act2-body', crownCls: 'act2-crown', tint: [ELEM[elem][3], ELEM[elem][4]] }, mp);
  if (!mp.lives) boss.hp = bossHp;
  if (mech === 'resurrect') boss.lives = mp.lives.map(l => Math.round((l + i * 6) * 3 * easy));
  if (art) { boss.img = `assets/boss/${art}.jpg`; rs(path.join(V2, 'bosses', art + '.jpg'), path.join(OUT, boss.img), 360, 82); }
  const enemyDefs = {};
  r.en.forEach((n, k) => {
    const t = [{ hp: 1.0, atk: 1.0, spd: 5 }, { hp: 0.75, atk: 1.4, spd: 8 }, { hp: 1.3, atk: 0.8, spd: 4 }][k % 3];
    enemyDefs[n] = { hp: Math.round((140 + i * 7) * 2 * easy * t.hp), atk: Math.round((10 + i * 0.6) * 3 * easy * t.atk), spd: t.spd, xp: 90 + i * 5, g: 55 + i * 3, cls: 'act2-body', tint: [ELEM[elem][3], ELEM[elem][4]] };
  });
  zones[id] = {
    name: zn, theme: 'zone-act2-' + elem,
    nodes: {
      camp: { x: 60, y: 620, label: 'Camp', icon: '⛺', type: 'camp', desc: r.d },
      quest: { x: 100, y: 400, label: qLabel, icon: qIcon, type: 'quest', npcName: qNpc },
      merchant: { x: 230, y: 300, label: mName, icon: mIcon, type: 'merchant', name: mName, line: mLine },
      encounter: { x: 230, y: 90, label: 'Threshold', icon: '🚪', type: 'encounter' },
    },
    enemyDefs, lootTable: r.loot, boss,
    quest: { name: `${zn}: Clear the Way`, need: 5, xpReward: 450 + i * 25, goldReward: 280 + i * 15,
      acceptDesc: `"${zn}: Clear the Way" — Defeat 5 monsters in ${zn}. Reward: ${450 + i * 25} XP, ${280 + i * 15} Gold.` },
    encounterLockedDesc: `Something waits ahead. You should look at the ${qNpc.toLowerCase()} at camp first.`,
    bossPromptDesc: `${bossName} has noticed you.`,
    zoneClearedDesc: `${zn} goes quiet. ${c.quote}`,
    templeRepOnClear: 700 + i * 30,
    nextZone: i + 1 < Zall.length ? Zall[i + 1][0] : null,
    climax: CLIMAX.has(id) || !!(opts && opts.cap),
  };
});

// Journal chapters 21-126, in order. Boss chapters unlock on their zone's boss; story-only chapters
// unlock on the most recent boss (and, as always, on the previous chapter being read).
const motifFor = (id, boss) => MOTIF[id] || (id <= 48 ? 'dawn' : id <= 53 ? (id === 50 ? 'water' : 'road') : boss ? 'figures' : id <= 57 ? 'embers' : id <= 72 ? 'ledger' : id <= 78 ? 'pillars' : id <= 85 ? 'figures' : id <= 87 ? 'pillars' : id <= 93 ? 'embers' : id <= 95 ? 'horizon' : ['dawn', 'horizon', 'mend', 'embers'][id % 4]);
let lastZone = 'daybreak', n = 0;
for (let id = 21; id <= 126; id++) {
  const c = ch.find(x => x.id === id);
  if (!c || !c.scenes.length) continue;
  const zid = zoneOfChapter[id];
  if (zid) lastZone = zid;
  const z = zones[lastZone], elem = z.theme.slice(10);
  chapters.push({ id, unlockType: 'boss', unlockAt: z.boss.name, icon: c.icon, theme: 'theme-act2-' + elem, title: c.title,
    sub: c.quote, summary: c.summary, scenes: c.scenes.map(([speaker, text]) => ({ speaker, text })), xpReward: 400 + n * 8, motif: motifFor(id, !!zid) });
  n++;
}
// Speaker portraits V1 doesn't already have: V2 character portraits, plus boss art for boss speakers
const PORT = { 'Ser Aldric': 'journey2daybreak/assets/portraits/ser_aldric.jpg', 'Sister Wren': 'journey2daybreak/assets/portraits/sister_wren.jpg',
  'Hollow Prophet': 'bosses/thehollowprophet.jpg', 'Robin': 'bosses/robin.jpg', 'Jeff': 'bosses/jeff.jpg', 'The Foreman': 'bosses/theforeman.jpg', 'Echo of Joel': 'bosses/echoofjoel.jpg' };
fs.mkdirSync(path.join(OUT, 'assets/portraits'), { recursive: true });
const portraits = {};
for (const [name, src] of Object.entries(PORT)) {
  const dst = 'assets/portraits/' + name.toLowerCase().replace(/\W+/g, '_') + '.jpg';
  rs(path.join(V2, src), path.join(OUT, dst), 160, 82); portraits[name] = dst;
}
const zones3 = {};
for (const id of lateIds) { zones3[id] = zones[id]; delete zones[id]; }
fs.writeFileSync(path.join(OUT, 'act3-data.js'), `// Generated by tools/build-act2.js from Legends of Daybreak V2 — the later worlds (Verdant Reach end to Ascension).\nconst ACT3_ZONES = ${JSON.stringify(zones3)};\n`);
const body = `// Generated by tools/build-act2.js from Legends of Daybreak V2 — the world after the Nexus (chapters 21-126).\n` +
  `const ACT2_ELEMENTS = ${JSON.stringify(ELEM)};\nconst ACT2_ZONES = ${JSON.stringify(zones, null, 1)};\nconst ACT2_CHAPTERS = ${JSON.stringify(chapters)};\nconst ACT2_PORTRAITS = ${JSON.stringify(portraits)};\n`;
fs.writeFileSync(path.join(OUT, 'act2-data.js'), body);
console.log('zones', Object.keys(zones).length, 'act3', Object.keys(zones3).length, 'chapters', chapters.length, 'bytes', body.length);
const speakers = new Set(); chapters.forEach(c => c.scenes.forEach(s => speakers.add(s.speaker))); console.log([...speakers].join(', '));
