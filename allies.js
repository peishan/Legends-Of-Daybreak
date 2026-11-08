/* =========================================================================
   Recruitable allies from V2 (its "recruit-gated" party members), loaded before
   game.js. They join the roster once recruited through the story (a journal
   chapter) or the Guild, and scale with the player's level like the original
   companions' gear does. game.js reads ALLIES to extend ROSTER, the combat
   table and save data.
   ========================================================================= */
const ALLIES = [
  { name:'Mimi',        role:'Dreamwalker',   chapter:62,  color:'#a855f7', hp:90,  combat:{ spd:5, dmgDie:8,  dmgBonus:0, verb:'sees the hit before it lands and sends a bolt of dreamlight into {t}.' }, dmgK:1.3,
    d:'She already knew you would ask before you finished asking. Dreamsight sees the shape of a fight before it happens.' },
  { name:'Dr. AA',      role:'Steady Hands',  chapter:72,  color:'#0284c7', hp:100, combat:{ spd:4, heals:true, healDie:8, healBonus:0, verb:'works the kit with perfectly steady hands.' }, healK:1.2,
    d:'Calm under pressure in the specific way only someone who has already seen the worst of it can be.' },
  { name:'Ser Aldric',  role:'Knight',        chapter:73,  color:'#57534e', hp:160, combat:{ spd:3, dmgDie:6,  dmgBonus:0, verb:'holds the line and drives {t} back.' }, dmgK:0.5, defAura:0.5,
    d:'Spent a long time being found by things. Guild work feels like the other version of that: chosen instead of caught. Steadies the whole party (+DEF).' },
  { name:'Sister Wren', role:'True Devotion', chapter:74,  color:'#d97706', hp:110, combat:{ spd:4, heals:true, healDie:8, healBonus:0, verb:'calls on the Temple’s grace.' }, healK:1.3,
    d:'Spent a long time devoted to something that was never real. Knows real when she finally gets to stand next to it.' },
  { name:'Iris',        role:'Held Her Own',  chapter:101, color:'#c2703d', hp:100, combat:{ spd:8, dmgDie:6,  dmgBonus:0, verb:'slips in with Ash and cuts at {t}.' }, dmgK:1.1,
    d:'Held a line alone for years before the Guild gave her something better than solitude. Ash is usually right.' },
  { name:'KW Liang',    role:'Quick Hands',   chapter:107, color:'#0d9488', hp:100, combat:{ spd:8, dmgDie:6,  dmgBonus:0, verb:'strikes fast and is already gone, leaving {t} reeling.' }, dmgK:1.1,
    d:'A personal shopper turned survivor, quick and sharp, finally committed to something worth showing up for.' },
  { name:'Brada Shah',  role:'Steady Hand',   chapter:111, color:'#78716c', hp:150, combat:{ spd:2, dmgDie:16, dmgBonus:0, verb:'lines up the ballista and lets it go on {t}.' }, dmgK:1.7,
    d:'Mimi’s partner, steady in every sense: ballistas and siege lines, patience over speed. Hits rarely, and hard.' },
  { name:'Renn',        role:'Alchemist-Archivist', chapter:139, color:'#16a34a', hp:130, combat:{ spd:4, dmgDie:5, dmgBonus:0, verb:'flicks a vial at {t} and annotates the result.' }, dmgK:0.6, mpGift:0.04,
    d:'Centuries old and barely past twenty to look at. Every few moments he steadies San’s mana.' },
  { name:'Gino',        role:'Kitchen Helper', guildRank:3, color:'#ea580c', hp:130, combat:{ spd:4, heals:true, healDie:5, healBonus:0, verb:'passes around something hot from the pan.' }, healK:0.5, goldPct:0.05,
    d:'Not the sharpest tool in the drawer by his own cheerful admission, but excellent with a pan. Joins once you reach Guild Adventurer. +5% gold while fielded.' }
];
const initialAvatar = (name, color) => 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="${color}"/><text x="48" y="64" font-family="Georgia,serif" font-size="52" fill="#fff" text-anchor="middle">${name.replace(/^(Dr\. |Ser |Sister )/, '')[0]}</text></svg>`);

const allyDef = (name) => ALLIES.find(a => a.name === name);
window.allyRecruited = (name) => {
  const a = allyDef(name); if(!a) return false;
  if(a.chapter) return GameState.readChapters.has(a.chapter);
  if(a.guildRank) return !!(GameState.guild && GameState.guild.joined && GameState.guild.rep >= GUILD_RANK_REPS[a.guildRank - 1]);
  return false;
};
const GUILD_RANK_REPS = [0, 150, 500, 1200, 2500, 5000, 10000, 20000, 40000, 75000]; // matches guild.js GUILD_RANKS
window.allyHint = (name) => { const a = allyDef(name); return a.chapter ? `read Chapter ${a.chapter}` : `reach Guild rank ${a.guildRank}`; };
window.allyCount = () => ALLIES.filter(a => allyRecruited(a.name)).length;
// Tell the player when someone new has joined.
window.allyCheck = () => {
  if(!GameState.allies) GameState.allies = { seen:[] };
  ALLIES.forEach(a => {
    if(allyRecruited(a.name) && !GameState.allies.seen.includes(a.name)){
      GameState.allies.seen.push(a.name);
      showHubToast(`${a.name} joins your crew!`);
      if(window.addChronicle) addChronicle('\u{1F91D}', `${a.name} joined the crew.`);
    }
  });
};
// Level-scaled strength, like gear for the original companions (they would otherwise fall behind the zones).
window.allyBonus = (name) => {
  const a = allyDef(name), L = GameState.player.level; if(!a) return null;
  const out = {};
  if(a.dmgK) out.dmgBonus = Math.round(L * a.dmgK);
  if(a.healK) out.healBonus = Math.round(L * a.healK);
  return out;
};
const allyFielded = (a) => typeof getActiveCompanions === 'function' && getActiveCompanions().includes(a.name);
window.allyDefAura = () => ALLIES.reduce((t, a) => t + (a.defAura && allyFielded(a) ? Math.round(GameState.player.level * a.defAura) : 0), 0);
window.allyGoldMult = () => 1 + ALLIES.reduce((t, a) => t + (a.goldPct && allyFielded(a) ? a.goldPct : 0), 0);
window.allyOnAct = (name) => {
  const a = allyDef(name);
  if(a && a.mpGift){ const p = GameState.player; p.mp = Math.min(p.mmp, p.mp + Math.round(p.mmp * a.mpGift)); }
};
