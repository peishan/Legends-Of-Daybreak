// Builds act2-data.js (zones + journal chapters) and the art under assets/ from the
// Legends of Daybreak V2 repo. Usage: node tools/build-act2.js /path/to/legends-of-daybreak-v2
// Image resizing needs python3 + Pillow.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const V2 = process.argv[2];
if (!V2) { console.error('usage: node tools/build-act2.js <v2 repo path>'); process.exit(1); }
const OUT = path.join(__dirname, '..');
// Per-zone player strength measured by tools/playbot.js (index = position in the full zone chain, 23 original-era zones first).
// Boss/enemy stats are derived from it so fights cost a similar share of HP all the way up. Monotone-smoothed.
const CAL = (() => { try { const c = JSON.parse(fs.readFileSync(path.join(__dirname, 'calibration.json'), 'utf8')); let m = { mhp: 0, def: 0, dmg: 0 }; return c.map(x => (m = { mhp: Math.max(m.mhp, x.mhp), def: Math.max(m.def, x.def), dmg: Math.max(m.dmg, x.dmg) })); } catch (e) { return null; } })();
const calFor = (i) => CAL ? CAL[Math.min(i + 23, CAL.length - 1)] : null;

const g = fs.readFileSync(path.join(V2, 'game.js'), 'utf8');
const zoneRows = {};
for (const m of g.matchAll(/\{ n: (['"])(.+?)\1, lv: (\d+), elem: '(\w+)', d: (['"])([\s\S]*?)\5, en: \[([^\]]*)\], loot: \[([^\]]*)\]/g)) {
  const list = s => [...s.matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g)].map(x => (x[1] ?? x[2]).replace(/\\'/g, "'"));
  const un = s => s.replace(/\\u2019/g, '\u2019').replace(/\\u2014/g, '\u2014').replace(/\\'/g, "'");
  zoneRows[un(m[2])] = { lv: +m[3], elem: m[4], d: un(m[6]), en: list(m[7]).map(un), loot: list(m[8]).map(un) };
}
const ch = (() => { const s = fs.readFileSync(path.join(V2, 'journey2daybreak/chapters-data.js'), 'utf8'); return new Function(s + ';return CHAPTERS')(); })();
// V2's chapters-data.js is an abridged excerpt (6 scenes at most per chapter, nothing past 126). The full journal lives in
// game.js: 242 entries. Boss/quote metadata comes from the excerpt, the text and chapters 127+ from the journal.
const journal = (() => {
  const first = g.indexOf("id: 'journal_001'"); let i = g.lastIndexOf('[', first), d = 0, j = i;
  for (; j < g.length; j++) { const c = g[j]; if (c === '[') d++; else if (c === ']') { if (!--d) break; } else if (c === "'" || c === '"' || c === '`') { j++; while (g[j] !== c) { if (g[j] === '\\') j++; j++; } } }
  return new Function('return ' + g.slice(i, j + 1))();
})();
for (const e of journal) {
  let c = ch.find(x => x.id === e.chapter);
  if (!c) { c = { id: e.chapter, title: e.title, quote: '', summary: e.summary, icon: e.icon, bossName: null }; ch.push(c); }
  c.scenes = e.scenes.map(s => [s.speaker, s.text]);
  c.v2 = { unlockType: e.unlockType, unlockAt: e.unlockAt };
}

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
// V2's legendary dragons (optional hunts there) become lair zones placed near their V2 unlock levels
const DRAGONS = [
  ['vaelithorn', 'Vaelithorn, the Ancient Wyrm', "Vaelithorn's Roost", 'fire', 'Older than the Breaking itself. Its hoard is real, and so is the wait to earn it.', 'the-widows-watch', (a) => ['rampage', { rampageEvery: 4, rampageDmg: Math.round(a * 1.2) }]],
  ['thessarune', 'Thessarune, the Endless Maw', "Thessarune's Maw", 'void', 'What comes after the Breaking finishes breaking. It does not breathe fire so much as unmake the air where you are standing.', 'what-almost-broke-again', (a) => ['rampage', { rampageEvery: 3, rampageDmg: Math.round(a * 1.3) }]],
  ['nyxathorne', 'Nyxathorne, the Unmended Wound', 'The Unmended Wound', 'void', 'Every other wound in this world eventually closed. This one refused, out of pure spite, and grew something that could fight back.', 'where-the-walk-leads', (a) => ['phase', { phaseThresholds: [0.66, 0.33] }]],
  ['corvenna', 'Corvenna, the Root That Waited', "Corvenna's Roots", 'poison', 'Even the Vale had to bury something to become the Vale. It waits, patient as everything else down here, then reaches up for exactly one of you at a time.', 'the-verdant-choir', (a) => ['devour', { devourTurn: 4, devourDmg: Math.round(a * 1.3), staggerPct: 0.35 }]],
  ['aetherum', 'Aetherum, the Last Question', 'The Last Question', 'arcane', 'Past the deepest root, past the reason the Vale was ever unbroken. It asks, once, at turn six, whether everything still standing behind you was worth what it cost.', 'sunreach-fields', (a) => ['apocalypse', { apocalypseTurn: 6, apocalypseDmg: Math.round(a * 1.4) }]],
];
DRAGONS.forEach(([art, bname, zname, elem, d, after, mech]) => {
  const short = bname.split(',')[0];
  const row = { lv: 0, elem, d, en: [`${short} Whelp`, `${short} Scale-Guard`, 'Hoard Wraith'], loot: [`${short} Scale`, `${short} Fang`, `${short} Hoard Fragment`] };
  const entry = [slug(zname), zname, null, mech, art, ['Scorched Hoard', '🐲', 'Scattered Hoard', 'Cinder', '🔥', '"Dragons keep what they keep. I sell what they dropped."'], row, bname, null, { cap: art === 'nyxathorne' || art === 'aetherum' }];
  const at = Zall.findIndex(z => z[0] === after);
  Zall.splice(at + 1, 0, entry);
  if (after === 'sunreach-fields') lateX.unshift(entry); // Aetherum opens the later-worlds file
});
const lateIds = new Set(lateX.map(e => e[0]));
const CLIMAX = new Set(['where-the-break-began', 'daybreak', 'the-scattered-choir', 'sunreach-fields']);

// The Static Fields (V2 Lv 41) has no boss or chapter in V2, so it gets a generated guardian after The Empty Ledger.
{
  const row = rowFor('The Static Fields');
  const at = Zall.findIndex(z => z[0] === 'the-empty-ledger');
  Zall.splice(at + 1, 0, ['the-static-fields', 'The Static Fields', null, MECHS[5], null, ['Dead Signal', '📡', 'Humming Wreckage', 'Static', '🔌', '"Corroded circuits, mostly. One of them is still listening."'], row, 'Alpha ' + row.en[row.en.length - 1], null, {}]);
}
// Recommended levels follow V2's zone levels (V2 tops out at 1250), kept strictly rising along this game's chain.
const LV_FIX = { 'the-hollow-vigil': 56, 'the-scattered-choir': 57, 'where-the-old-names-wait': 70, vaelithorn: 35, thessarune: 48, nyxathorne: 55, corvenna: 65, aetherum: 92 };
const lvT = [];
Zall.forEach((z, k) => {
  const row = z[6] || zoneRows[z[1]];
  const v2 = (row && row.lv) || LV_FIX[z[0]] || LV_FIX[z[4]] || 0;
  lvT.push(Math.max(v2, k ? lvT[k - 1] + 1 : 30));
});
const cumXp = (l) => 30 * l + 25 * l * (l - 1) / 2;
const budget = lvT.map((l, k) => 1.12 * cumXp(k + 1 < lvT.length ? lvT[k + 1] : l + 10) - 1.12 * cumXp(l)); // XP to get from this zone's level to the next zone's
// chapters granted per zone (story chapters ride on the latest boss zone)
const chapCount = {};
{ let lz = 'daybreak'; for (let id = 21; id <= 126; id++) { const c = ch.find(x => x.id === id); if (!c || !c.scenes.length) continue; if (zoneOfChapter[id]) lz = zoneOfChapter[id]; chapCount[lz] = (chapCount[lz] || 0) + 1; } }
const chapXp = {};
Zall.forEach(([id], k) => { chapXp[id] = Math.round(budget[k] * 0.12 / (chapCount[id] || 1)); });

let EARLY = false; // early-game extras get placeholder numbers; the engine rescales them from a neighbouring original zone
const budgetAt = (i) => EARLY ? 0 : budget[i];
function buildZone([id, zn, cid, m3, art, [qLabel, qIcon, qNpc, mName, mIcon, mLine], rowOverride, bossOverride, , opts], i) {
  const easy = opts && opts.easy ? 0.5 : 1;
  const r = rowOverride || zoneRows[zn]; if (!r) throw new Error('V2 zone not found: ' + zn);
  const c = cid ? ch.find(x => x.id === cid) : { quote: '' }; if (!c) throw new Error('chapter ' + cid);
  const elem = ELEM[r.elem] ? r.elem : 'none';
  const bossName = bossOverride || c.bossName.trim();
  const cal = EARLY ? null : calFor(i);
  const atkB = cal ? Math.round((cal.def + cal.mhp * 0.12) * easy) : Math.round((28 + i * 1.1) * 3 * easy);
  const [mech, mp] = typeof m3 === 'function' ? m3(atkB) : m3;
  const bossHp = cal ? Math.round(cal.dmg * 28 * easy) : Math.round((520 + i * 45) * 3 * easy); // tuned by headless fights: V1's curve left these bosses dying in ~8 casts
  const boss = Object.assign({ name: bossName, mechanic: mech, atk: atkB, spd: 5, xp: Math.round(budgetAt(i) * 0.5), g: 1200 + i * 60,
    hint: r.d.split('. ')[0].slice(0, 110), introLine: r.d, spriteCls: 'act2-body', crownCls: 'act2-crown', tint: [ELEM[elem][3], ELEM[elem][4]] }, mp);
  if (!mp.lives) boss.hp = bossHp;
  if (mech === 'resurrect') boss.lives = cal ? mp.lives.map(() => Math.round(cal.dmg * 28 * easy / mp.lives.length)) : mp.lives.map(l => Math.round((l + i * 6) * 3 * easy));
  const DMG_KEYS = { rampageDmg: 1.1, infernoDmg: 1.1, rodDmg: 1.1, drownDmg: 1.1, devourDmg: 1.2, apocalypseDmg: 1.4 };
  if (cal) for (const k in DMG_KEYS) if (k in boss) boss[k] = Math.round(atkB * DMG_KEYS[k]);
  if (art) { boss.img = `assets/boss/${art}.jpg`; rs(path.join(V2, 'bosses', art + '.jpg'), path.join(OUT, boss.img), 360, 82); }
  const enemyDefs = {};
  r.en.forEach((n, k) => {
    const t = [{ hp: 1.0, atk: 1.0, spd: 5 }, { hp: 0.75, atk: 1.4, spd: 8 }, { hp: 1.3, atk: 0.8, spd: 4 }][k % 3];
    enemyDefs[n] = { hp: cal ? Math.round(cal.dmg * 4 * easy * t.hp) : Math.round((140 + i * 7) * 2 * easy * t.hp), atk: cal ? Math.round((cal.def + cal.mhp * 0.02) * easy * t.atk) : Math.round((10 + i * 0.6) * 3 * easy * t.atk), spd: t.spd, xp: Math.max(1, Math.round(budgetAt(i) * 0.03)), g: 55 + i * 3, cls: 'act2-body', tint: [ELEM[elem][3], ELEM[elem][4]] };
  });
  zones[id] = {
    name: zn, lv: EARLY ? ((opts && opts.lv) || 0) : lvT[i], theme: 'zone-act2-' + elem,
    nodes: {
      camp: { x: 60, y: 620, label: 'Camp', icon: '⛺', type: 'camp', desc: r.d },
      quest: { x: 100, y: 400, label: qLabel, icon: qIcon, type: 'quest', npcName: qNpc },
      merchant: { x: 230, y: 300, label: mName, icon: mIcon, type: 'merchant', name: mName, line: mLine },
      encounter: { x: 230, y: 90, label: 'Threshold', icon: '🚪', type: 'encounter' },
    },
    enemyDefs, lootTable: r.loot, boss,
    quest: { name: `${zn}: Clear the Way`, need: 5, xpReward: Math.round(budgetAt(i) * 0.2), goldReward: 280 + i * 15,
      acceptDesc: `"${zn}: Clear the Way" — Defeat 5 monsters in ${zn}. Reward: ${Math.round(budgetAt(i) * 0.2)} XP, ${280 + i * 15} Gold.` },
    encounterLockedDesc: `Something waits ahead. You should look at the ${qNpc.toLowerCase()} at camp first.`,
    bossPromptDesc: `${bossName} has noticed you.`,
    zoneClearedDesc: `${zn} goes quiet. ${c.quote}`,
    templeRepOnClear: 700 + i * 30,
    nextZone: EARLY ? null : i + 1 < Zall.length ? Zall[i + 1][0] : null,
    climax: CLIMAX.has(id) || !!(opts && opts.cap),
  };
}
Zall.forEach((t, i) => buildZone(t, i));

// V2's early-game zones that V1's own fifteen didn't cover. They slot into the original chain by level.
const EARLY_ZONES = [
  ['serpents-coil', "Serpent's Coil", 'stormhold', ['rampage', { rampageEvery: 3, rampageDmg: 0 }]],
  ['the-fulcrum', 'The Fulcrum', 'abyssal-depths', ['phase', { phaseThresholds: [0.66, 0.33] }]],
  ['the-scorched-vein', 'The Scorched Vein', 'infernal-crucible', ['inferno', { infernoTurn: 4, infernoDmg: 0 }]],
  ['tidal-abyss', 'Tidal Abyss', 'fractured-veil', ['drown', { drownTurn: 4, drownDmg: 0, drownSaveChance: 0.5 }]],
  ['the-shattered-crown', 'The Shattered Crown', 'dragons-maw', ['freeze', { freezeChance: 0.3, freezeDuration: 3000 }]],
  ['the-hollow-throne', 'The Hollow Throne', 'the-shattered-crown', ['rampage', { rampageEvery: 3, rampageDmg: 0 }]],
  ['the-final-spire', 'The Final Spire', 'the-hollow-throne', ['lightning_rod', { rodTurns: 3, rodDmg: 0 }]],
  ['the-apex', 'The Apex', 'the-final-spire', ['apocalypse', { apocalypseTurn: 6, apocalypseDmg: 0 }]],
];
EARLY = true;
const act1Extras = EARLY_ZONES.map(([id, zn, after, mech], k) => {
  const row = rowFor(zn); if (!row) throw new Error('V2 zone not found: ' + zn);
  const real = v2Boss[zn];
  const w = [['Scorched Hoard', '🔥', 'Scorched Hoard', 'Cinder', '🪙', '"Scavenged from the deeper dark. Prices are what they are."']][0];
  buildZone([id, zn, null, () => mech, null, w, row, real ? real.name : 'Alpha ' + row.en[row.en.length - 1].replace(/^(A|An|The) /, '').split(',')[0], null, { lv: row.lv }], k);
  const zone = zones[id]; delete zones[id];
  return { after, id, mult: 1.12, zone };
});
EARLY = false;

// Journal chapters 21-126, in order. Boss chapters unlock on their zone's boss; story-only chapters
// unlock on the most recent boss (and, as always, on the previous chapter being read).
const motifFor = (id, boss) => MOTIF[id] || (id <= 48 ? 'dawn' : id <= 53 ? (id === 50 ? 'water' : 'road') : boss ? 'figures' : id <= 57 ? 'embers' : id <= 72 ? 'ledger' : id <= 78 ? 'pillars' : id <= 85 ? 'figures' : id <= 87 ? 'pillars' : id <= 93 ? 'embers' : id <= 95 ? 'horizon' : ['dawn', 'horizon', 'mend', 'embers'][id % 4]);
// Pick up to two scene motifs from a chapter's own words; the first chapters 21-41 keep their hand-picked primary.
const RULES = {
  cracks: 'break broke broken fracture crack shatter splinter split tear', pillars: 'ruin stone temple sanctum hall ancient pillar', water: 'water tide sea drown coast rain flood reef river wave',
  gears: 'machine mechanic system overtime shift factory dock foreman automat job firm gear', beam: 'lighthouse watch beacon watcher signal', road: 'road walk path route map journey trade wayfind guide step',
  mobile: 'nursery baby child cradle kitten sleep soft', embers: 'ember fire burn kindle spark flame warmth cat soel', storm: 'storm thunder lightning', ledger: 'ledger debt number account money dollar pay owe charge asset tally balance loan cost price',
  figures: 'family together everyone unity crew court party group', horizon: 'horizon beyond distance window vision far', dawn: 'dawn morning sun daybreak begin first', mend: 'mend repair seam heal slow gentle rest',
  doors: 'door threshold gate enter open key index architect', mirror: 'mirror echo reflect version same self', snow: 'cold frost ice snow frozen winter', leaves: 'vale grove root tree green verdant forest garden harvest field sunreach',
  office: 'office firm retainer desk employer fluorescent hollow', phone: 'phone call cellphone voice message text signal', letters: 'letter write wrote note page ink paper', rings: 'listen hear sound hum ripple whisper silence uprising',
  candles: 'vigil prayer believ faith wren prophet grief candle mourn', clock: 'time hour clock late wait age youth years deadline', constellation: 'star night sky cosmos dream', fog: 'fog mist forgot memory remember haze ghost wraith',
};
const FALLBACK = ['dawn', 'horizon', 'fog', 'constellation', 'leaves', 'mend', 'rings', 'embers'];
function pickMotifs(id, c, forcedPrimary) {
  const text = (c.title + ' ' + c.summary + ' ' + c.quote + ' ' + c.scenes.slice(0, 3).map(s => s[1]).join(' ')).toLowerCase();
  const score = Object.entries(RULES).map(([m, words]) => [m, words.split(' ').reduce((t, w) => t + (text.match(new RegExp('\\b' + w, 'g')) || []).length * (new RegExp('\\b' + w).test(c.title.toLowerCase()) ? 3 : 1), 0)]);
  const ranked = score.filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]).map(([m]) => m);
  const prev = pickMotifs.prev || [];
  let list = ranked.length ? ranked : [FALLBACK[id % FALLBACK.length]];
  if (forcedPrimary) list = [forcedPrimary, ...list.filter(m => m !== forcedPrimary)];
  else if (list[0] === prev[0] && list[1]) list = [list[1], list[0], ...list.slice(2)]; // don't repeat the previous chapter's scene
  const out = [list[0], list.find((m, i) => i > 0 && m !== list[0]) || FALLBACK[(id + 3) % FALLBACK.length]];
  if (out[1] === out[0]) out[1] = FALLBACK[(id + 5) % FALLBACK.length];
  pickMotifs.prev = out;
  return out;
}
let lastZone = 'daybreak', n = 0;
for (let id = 21; id <= 126; id++) {
  const c = ch.find(x => x.id === id);
  if (!c || !c.scenes.length) continue;
  const zid = zoneOfChapter[id];
  if (zid) lastZone = zid;
  const z = zones[lastZone], elem = z.theme.slice(10);
  chapters.push({ id, unlockType: 'boss', unlockAt: z.boss.name, icon: c.icon, theme: 'theme-act2-' + elem, title: c.title,
    sub: c.quote, summary: c.summary, scenes: c.scenes.map(([speaker, text]) => ({ speaker, text })), xpReward: chapXp[lastZone], motifs: pickMotifs(id, c, MOTIF[id]) });
  n++;
}
// Chapters 127-242 (the later worlds): unlock by V2's own condition. Level gates work as-is since player level tracks V2's.
const zoneList = Object.values(zones);
for (let id = 127; id <= 242; id++) {
  const c = ch.find(x => x.id === id);
  if (!c || !c.scenes.length) continue;
  const v = c.v2 || {};
  let unlock;
  const bossHit = Object.values(zones).find(z => z.boss.name === v.unlockAt);
  const zoneHit = zoneList.find(z => z.name === v.unlockAt);
  if (v.unlockType === 'boss' && bossHit) unlock = { unlockType: 'boss', unlockAt: v.unlockAt };
  else if (v.unlockType === 'zone' && zoneHit) unlock = { unlockType: 'zone', unlockAt: v.unlockAt };
  else unlock = { unlockType: 'level', unlockLevel: v.unlockType === 'level' ? v.unlockAt : (zoneHit || bossHit || zoneList[0]).lv };
  const L = unlock.unlockLevel || (bossHit || zoneHit).lv;
  const near = zoneList.filter(z => z.lv <= L).pop() || zoneList[0];
  chapters.push(Object.assign({ id, icon: c.icon, theme: 'theme-act2-' + near.theme.slice(10), title: c.title, sub: c.quote || c.summary.slice(0, 90), summary: c.summary,
    scenes: c.scenes.map(([speaker, text]) => ({ speaker, text })), xpReward: Math.round(1.12 * (cumXp(L + 3) - cumXp(L)) * 0.1), motifs: pickMotifs(id, c) }, unlock));
}
// Speaker portraits V1 doesn't already have: V2 character portraits, plus boss art for boss speakers
const PORT = { 'Ser Aldric': 'journey2daybreak/assets/portraits/ser_aldric.jpg', 'Sister Wren': 'journey2daybreak/assets/portraits/sister_wren.jpg',
  'Hollow Prophet': 'bosses/thehollowprophet.jpg', 'Robin': 'bosses/robin.jpg', 'Jeff': 'bosses/jeff.jpg', 'The Foreman': 'bosses/theforeman.jpg', 'Echo of Joel': 'bosses/echoofjoel.jpg',
  Renn: 'portraits/renn.jpg', Jovie: 'portraits/jovie.jpg', Iris: 'portraits/iris.jpg', Mimi: 'portraits/mimi.jpg', Draa: 'portraits/draa.jpg', 'KW Liang': 'portraits/kwliang.jpg' };
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
  `const ACT1_EXTRAS = ${JSON.stringify(act1Extras)};\nconst ACT2_ELEMENTS = ${JSON.stringify(ELEM)};\nconst ACT2_ZONES = ${JSON.stringify(zones, null, 1)};\nconst ACT2_PORTRAITS = ${JSON.stringify(portraits)};\n`;
fs.writeFileSync(path.join(OUT, 'act2-data.js'), body);
fs.writeFileSync(path.join(OUT, 'chapters-act2.js'), `// Generated by tools/build-act2.js: journal chapters 21-242 from V2's full journal.\nconst ACT2_CHAPTERS = ${JSON.stringify(chapters)};\n`);
console.log('zones', Object.keys(zones).length, 'act3', Object.keys(zones3).length, 'chapters', chapters.length, 'bytes', body.length);
const speakers = new Set(); chapters.forEach(c => c.scenes.forEach(s => speakers.add(s.speaker))); console.log([...speakers].join(', '));
