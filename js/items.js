// ============================================================
// EQUIPMENT & LOOT SYSTEM
// ============================================================

const EQUIPMENT_SLOTS = {
  weapon: { name: 'Weapon', icon: '⚔️', stat: 'atk', desc: 'Main hand' },
  armor:  { name: 'Armor',  icon: '🛡️', stat: 'def', desc: 'Body' },
  head:   { name: 'Head',   icon: '🎓', stat: 'def', desc: 'Helm/Hat' },
  hands:  { name: 'Hands',  icon: '🧤', stat: 'atk', desc: 'Gloves' },
  feet:   { name: 'Feet',   icon: '👢', stat: 'def', desc: 'Boots' },
  ring1:  { name: 'Ring',   icon: '💍', stat: null,  desc: 'Finger' },
  ring2:  { name: 'Ring',   icon: '💍', stat: null,  desc: 'Finger' },
  amulet: { name: 'Amulet', icon: '📿', stat: null,  desc: 'Neck' }
};

const ITEM_RARITY = {
  common:    { color: '#9ca3af', name: 'Common',    mult: 1.0,  prefixChance: 0 },
  uncommon:  { color: '#22c55e', name: 'Uncommon',  mult: 1.2,  prefixChance: 0.3 },
  rare:      { color: '#3b82f6', name: 'Rare',      mult: 1.5,  prefixChance: 0.6 },
  epic:      { color: '#a855f7', name: 'Epic',      mult: 2.0,  prefixChance: 0.8 },
  legendary: { color: '#f59e0b', name: 'Legendary', mult: 3.0,  prefixChance: 1.0 }
};

const ITEM_PREFIXES = {
  'Sharp':      { stat: 'atk', val: 2, desc: '+2 ATK' },
  'Reinforced': { stat: 'def', val: 2, desc: '+2 DEF' },
  'Arcane':     { stat: 'int', val: 2, desc: '+2 INT' },
  'Wise':       { stat: 'wis', val: 2, desc: '+2 WIS' },
  'Swift':      { stat: 'dex', val: 2, desc: '+2 DEX' },
  'Sturdy':     { stat: 'con', val: 2, desc: '+2 CON' },
  'Charming':   { stat: 'cha', val: 2, desc: '+2 CHA' },
  'Strong':     { stat: 'str', val: 2, desc: '+2 STR' },
  'Flaming':    { stat: 'fireDmg', val: 3, desc: '+3 Fire DMG' },
  'Frozen':     { stat: 'iceDmg', val: 3, desc: '+3 Ice DMG' },
  'Shocking':   { stat: 'lightDmg', val: 3, desc: '+3 Lightning DMG' },
  'Vampiric':   { stat: 'lifeSteal', val: 0.1, desc: '10% Life Steal' },
  'Lucky':      { stat: 'critChance', val: 0.05, desc: '+5% Crit' },
  'Brisk':      { stat: 'mpRegen', val: 2, desc: '+2 MP/turn' },
};

const ITEM_SUFFIXES = {
  'of Power':      { stat: 'atk', val: 3, desc: '+3 ATK' },
  'of Warding':    { stat: 'def', val: 3, desc: '+3 DEF' },
  'of the Mind':   { stat: 'int', val: 3, desc: '+3 INT' },
  'of the Body':   { stat: 'con', val: 3, desc: '+3 CON' },
  'of Speed':      { stat: 'dex', val: 3, desc: '+3 DEX' },
  'of Will':       { stat: 'wis', val: 3, desc: '+3 WIS' },
  'of Charms':     { stat: 'cha', val: 3, desc: '+3 CHA' },
  'of Might':      { stat: 'str', val: 3, desc: '+3 STR' },
  'of Flames':     { stat: 'fireRes', val: 0.2, desc: '+20% Fire Resist' },
  'of Frost':      { stat: 'iceRes', val: 0.2, desc: '+20% Ice Resist' },
  'of Storms':     { stat: 'lightRes', val: 0.2, desc: '+20% Lightning Resist' },
  'of the Void':   { stat: 'voidRes', val: 0.2, desc: '+20% Void Resist' },
  'of the Arcane': { stat: 'arcaneRes', val: 0.2, desc: '+20% Arcane Resist' },
  'of Healing':    { stat: 'hpRegen', val: 3, desc: '+3 HP/turn' },
  'of Mana':       { stat: 'mpRegen', val: 3, desc: '+3 MP/turn' },
  'of Fortune':    { stat: 'goldFind', val: 0.15, desc: '+15% Gold Find' },
};

const LOOT_TABLES = {
  weapon: [
    { n: 'Worn Dagger',       ilvl: 1,  atk: 2, dex: 1 },
    { n: 'Apprentice Staff',  ilvl: 1,  atk: 2, int: 1 },
    { n: 'Iron Sword',        ilvl: 2,  atk: 4, str: 1 },
    { n: 'Crystal Wand',      ilvl: 3,  atk: 5, int: 2 },
    { n: 'Steel Longsword',   ilvl: 4,  atk: 7, str: 2 },
    { n: 'Flamebrand',        ilvl: 5,  atk: 9, int: 2, fireDmg: 2 },
    { n: 'Frostbite Blade',   ilvl: 6,  atk: 10, dex: 2, iceDmg: 3 },
    { n: 'Stormcaller Staff', ilvl: 7,  atk: 12, int: 3, lightDmg: 3 },
    { n: 'Void Reaver',       ilvl: 8,  atk: 15, str: 3, voidDmg: 4 },
    { n: 'Dragonfang',        ilvl: 9,  atk: 18, str: 4, fireDmg: 5 },
    { n: 'Starlight Blade',   ilvl: 10, atk: 22, int: 5, lightDmg: 6 },
    { n: 'Planar Edge',       ilvl: 11, atk: 26, int: 6, arcaneDmg: 6 },
    { n: 'Emberfall Scythe',  ilvl: 12, atk: 30, str: 5, fireDmg: 8 },
    { n: 'Glacial Greatsword',ilvl: 13, atk: 34, str: 6, iceDmg: 9 },
    { n: 'Thunderlord Spear', ilvl: 14, atk: 38, dex: 5, lightDmg: 10 },
    { n: 'Voidrender',        ilvl: 15, atk: 42, int: 7, voidDmg: 12 },
    { n: 'Chronoblade',       ilvl: 16, atk: 46, int: 8, arcaneDmg: 10, mpRegen: 2 },
    { n: 'Aetherium Halberd', ilvl: 17, atk: 50, wis: 6, arcaneDmg: 11, hpRegen: 2 },
    { n: 'Convergence Blade', ilvl: 18, atk: 55, int: 9, arcaneDmg: 13, voidDmg: 5 },
    { n: 'Nexus Cleaver',     ilvl: 19, atk: 60, str: 7, voidDmg: 14, lifeSteal: 0.08 },
    { n: 'Reality Sunderer',  ilvl: 20, atk: 70, int: 10, arcaneDmg: 15, voidDmg: 8, mpRegen: 3 },
    { n: 'Astral Edge',       ilvl: 21, atk: 78, int: 11, arcaneDmg: 12, voidDmg: 6, mpRegen: 2 },
    { n: 'Infernal Reaver',   ilvl: 22, atk: 86, str: 9, fireDmg: 14, critChance: 0.04 },
  ],
  armor: [
    { n: 'Tattered Cloth',    ilvl: 1,  def: 1 },
    { n: 'Novice Robes',      ilvl: 1,  def: 2, int: 1 },
    { n: 'Leather Vest',      ilvl: 2,  def: 3, dex: 1 },
    { n: 'Chain Shirt',       ilvl: 3,  def: 4, con: 1 },
    { n: 'Scale Mail',        ilvl: 4,  def: 6, str: 1 },
    { n: 'Enchanted Robes',   ilvl: 5,  def: 5, int: 3, mpRegen: 1 },
    { n: 'Frostweave Cloak',  ilvl: 6,  def: 7, int: 2, iceRes: 0.15 },
    { n: 'Thunder Plate',     ilvl: 7,  def: 9, con: 2, lightRes: 0.15 },
    { n: 'Abyssal Mail',      ilvl: 8,  def: 11, str: 2, voidRes: 0.2 },
    { n: 'Dragonscale Armor', ilvl: 9,  def: 13, con: 3, fireRes: 0.2 },
    { n: 'Celestial Vestment',ilvl: 10, def: 15, wis: 4, hpRegen: 3 },
    { n: 'Planar Robes',      ilvl: 11, def: 17, int: 5, arcaneRes: 0.15, mpRegen: 2 },
    { n: 'Emberfall Plate',   ilvl: 12, def: 19, con: 4, fireRes: 0.25, hpRegen: 2 },
    { n: 'Glacial Aegis',     ilvl: 13, def: 21, wis: 5, iceRes: 0.25, mpRegen: 2 },
    { n: 'Stormweave Mail',   ilvl: 14, def: 23, dex: 4, lightRes: 0.25, hpRegen: 3 },
    { n: 'Voidshroud',        ilvl: 15, def: 25, int: 6, voidRes: 0.3, mpRegen: 3 },
    { n: 'Chronos Vest',      ilvl: 16, def: 27, wis: 6, arcaneRes: 0.2, hpRegen: 3 },
    { n: 'Aetherium Plate',   ilvl: 17, def: 29, con: 5, arcaneRes: 0.25, mpRegen: 3 },
    { n: 'Convergence Mail',  ilvl: 18, def: 32, str: 4, voidRes: 0.2, fireRes: 0.2, iceRes: 0.2 },
    { n: 'Nexus Ward',        ilvl: 19, def: 35, con: 6, arcaneRes: 0.3, voidRes: 0.2, hpRegen: 4 },
    { n: 'Reality Anchor',    ilvl: 20, def: 40, int: 8, wis: 4, arcaneRes: 0.35, voidRes: 0.25, hpRegen: 5, mpRegen: 4 },
    { n: 'Astral Vestment',   ilvl: 21, def: 44, int: 9, wis: 5, arcaneRes: 0.30, voidRes: 0.20, hpRegen: 4, mpRegen: 4 },
    { n: 'Infernal Plate',    ilvl: 22, def: 48, con: 6, str: 4, fireRes: 0.30, hpRegen: 5, mpRegen: 2 },
  ],
  head: [
    { n: 'Cloth Hood',        ilvl: 1,  def: 1, wis: 1 },
    { n: 'Leather Cap',       ilvl: 2,  def: 2, dex: 1 },
    { n: 'Iron Helm',         ilvl: 3,  def: 3, str: 1 },
    { n: 'Scholars Hat',      ilvl: 4,  def: 2, int: 2 },
    { n: 'Crown of Thought',  ilvl: 6,  def: 4, int: 3, mpRegen: 1 },
    { n: 'Dragon Helm',       ilvl: 8,  def: 6, con: 2, fireRes: 0.1 },
    { n: 'Planar Crown',      ilvl: 11, def: 8, int: 4, arcaneRes: 0.1, mpRegen: 2 },
    { n: 'Emberfall Helm',    ilvl: 12, def: 9, str: 3, fireRes: 0.15, hpRegen: 1 },
    { n: 'Glacial Diadem',    ilvl: 13, def: 10, wis: 4, iceRes: 0.15, mpRegen: 2 },
    { n: 'Stormcaller Hood',  ilvl: 14, def: 11, int: 5, lightRes: 0.15, mpRegen: 2 },
    { n: 'Voidmask',          ilvl: 15, def: 12, int: 5, voidRes: 0.2, mpRegen: 3 },
    { n: 'Chronos Circlet',   ilvl: 16, def: 13, wis: 5, arcaneRes: 0.15, hpRegen: 2 },
    { n: 'Aetherium Crown',   ilvl: 17, def: 14, int: 6, arcaneRes: 0.2, mpRegen: 3 },
    { n: 'Convergence Helm',  ilvl: 18, def: 15, con: 4, arcaneRes: 0.15, voidRes: 0.15 },
    { n: 'Nexus Visage',      ilvl: 19, def: 17, int: 7, arcaneRes: 0.25, voidRes: 0.15, mpRegen: 3 },
    { n: 'Reality Crown',     ilvl: 20, def: 20, int: 8, wis: 4, arcaneRes: 0.3, voidRes: 0.2, mpRegen: 4 },
    { n: 'Astral Crown',      ilvl: 21, def: 22, int: 9, wis: 5, arcaneRes: 0.25, voidRes: 0.15, mpRegen: 4 },
    { n: 'Infernal Helm',     ilvl: 22, def: 24, str: 5, con: 4, fireRes: 0.25, hpRegen: 2 },
  ],
  hands: [
    { n: 'Cloth Wraps',       ilvl: 1,  def: 1, dex: 1 },
    { n: 'Leather Gloves',    ilvl: 2,  def: 1, atk: 1 },
    { n: 'Iron Gauntlets',    ilvl: 3,  def: 2, str: 1 },
    { n: 'Spellweaver Gloves',ilvl: 5,  def: 2, int: 2, mpRegen: 1 },
    { n: 'Void Grips',        ilvl: 7,  def: 3, atk: 2, voidDmg: 2 },
    { n: 'Planar Wraps',      ilvl: 11, def: 4, int: 3, arcaneDmg: 2, mpRegen: 1 },
    { n: 'Emberfall Gauntlets',ilvl: 12, def: 5, str: 3, fireDmg: 3, atk: 2 },
    { n: 'Glacial Grips',     ilvl: 13, def: 5, dex: 3, iceDmg: 3, atk: 2 },
    { n: 'Stormtouch Gloves', ilvl: 14, def: 6, int: 4, lightDmg: 4, mpRegen: 2 },
    { n: 'Void Claws',        ilvl: 15, def: 6, atk: 4, voidDmg: 5, critChance: 0.03 },
    { n: 'Chronos Wraps',     ilvl: 16, def: 7, int: 4, arcaneDmg: 4, mpRegen: 2 },
    { n: 'Aetherium Grips',   ilvl: 17, def: 7, wis: 3, arcaneDmg: 5, hpRegen: 1 },
    { n: 'Convergence Fists', ilvl: 18, def: 8, str: 3, atk: 3, fireDmg: 2, iceDmg: 2 },
    { n: 'Nexus Grasp',       ilvl: 19, def: 9, int: 5, arcaneDmg: 6, voidDmg: 3, mpRegen: 2 },
    { n: 'Reality Gauntlets', ilvl: 20, def: 10, int: 6, atk: 4, arcaneDmg: 7, voidDmg: 4, critChance: 0.05 },
    { n: 'Astral Wraps',      ilvl: 21, def: 11, int: 7, arcaneDmg: 6, voidDmg: 3, mpRegen: 2 },
    { n: 'Infernal Gauntlets',ilvl: 22, def: 12, str: 5, fireDmg: 6, atk: 3, critChance: 0.04 },
  ],
  feet: [
    { n: 'Worn Boots',        ilvl: 1,  def: 1, con: 1 },
    { n: 'Swift Boots',       ilvl: 2,  def: 1, dex: 2 },
    { n: 'Iron Greaves',      ilvl: 3,  def: 2, str: 1 },
    { n: 'Arcane Slippers',   ilvl: 4,  def: 1, int: 2 },
    { n: 'Winged Boots',      ilvl: 6,  def: 2, dex: 3 },
    { n: 'Void Walkers',      ilvl: 8,  def: 3, dex: 2, voidRes: 0.1 },
    { n: 'Planar Treads',     ilvl: 11, def: 4, dex: 3, arcaneRes: 0.1, mpRegen: 1 },
    { n: 'Emberfall Boots',   ilvl: 12, def: 4, con: 3, fireRes: 0.15, hpRegen: 1 },
    { n: 'Glacial Striders',  ilvl: 13, def: 5, dex: 4, iceRes: 0.15, mpRegen: 1 },
    { n: 'Stormleapers',      ilvl: 14, def: 5, dex: 4, lightRes: 0.15, hpRegen: 2 },
    { n: 'Void Striders',     ilvl: 15, def: 6, dex: 4, voidRes: 0.2, mpRegen: 2 },
    { n: 'Chronos Boots',     ilvl: 16, def: 6, wis: 3, arcaneRes: 0.1, hpRegen: 2 },
    { n: 'Aetherium Walkers', ilvl: 17, def: 7, dex: 5, arcaneRes: 0.15, mpRegen: 2 },
    { n: 'Convergence Treads',ilvl: 18, def: 7, con: 3, arcaneRes: 0.1, voidRes: 0.1, hpRegen: 2 },
    { n: 'Nexus Striders',    ilvl: 19, def: 8, dex: 5, arcaneRes: 0.2, voidRes: 0.15, mpRegen: 2 },
    { n: 'Reality Walkers',   ilvl: 20, def: 10, dex: 6, con: 3, arcaneRes: 0.25, voidRes: 0.2, hpRegen: 3, mpRegen: 3 },
    { n: 'Astral Treads',     ilvl: 21, def: 11, dex: 7, con: 3, arcaneRes: 0.20, voidRes: 0.15, mpRegen: 2 },
    { n: 'Infernal Boots',    ilvl: 22, def: 12, dex: 6, con: 4, fireRes: 0.20, hpRegen: 2 },
  ],
  ring: [
    { n: 'Copper Ring',       ilvl: 1,  con: 1 },
    { n: 'Silver Band',       ilvl: 2,  wis: 1 },
    { n: 'Gold Signet',       ilvl: 3,  cha: 2 },
    { n: 'Ruby Ring',         ilvl: 4,  str: 2 },
    { n: 'Sapphire Ring',     ilvl: 5,  int: 2, mpRegen: 1 },
    { n: 'Emerald Ring',      ilvl: 6,  dex: 2, critChance: 0.03 },
    { n: 'Void Band',         ilvl: 8,  int: 3, voidDmg: 2 },
    { n: 'Planar Band',       ilvl: 11, int: 4, arcaneDmg: 2, mpRegen: 1 },
    { n: 'Emberfall Signet',  ilvl: 12, str: 3, fireDmg: 3, hpRegen: 1 },
    { n: 'Glacial Loop',      ilvl: 13, wis: 3, iceDmg: 3, mpRegen: 1 },
    { n: 'Storm Ring',        ilvl: 14, dex: 3, lightDmg: 4, critChance: 0.04 },
    { n: 'Void Seal',         ilvl: 15, int: 5, voidDmg: 5, voidRes: 0.1 },
    { n: 'Chronos Band',      ilvl: 16, wis: 4, arcaneDmg: 4, mpRegen: 2 },
    { n: 'Aetherium Ring',    ilvl: 17, int: 5, arcaneDmg: 5, hpRegen: 2 },
    { n: 'Convergence Loop',  ilvl: 18, con: 3, arcaneDmg: 3, voidDmg: 3, hpRegen: 1 },
    { n: 'Nexus Band',        ilvl: 19, int: 6, arcaneDmg: 6, voidDmg: 3, mpRegen: 2 },
    { n: 'Reality Seal',      ilvl: 20, int: 7, wis: 3, arcaneDmg: 7, voidDmg: 4, hpRegen: 3, mpRegen: 3 },
    { n: 'Astral Band',       ilvl: 21, int: 8, wis: 4, arcaneDmg: 6, voidDmg: 3, mpRegen: 2 },
    { n: 'Infernal Signet',   ilvl: 22, str: 6, fireDmg: 7, fireRes: 0.10, hpRegen: 2 },
  ],
  amulet: [
    { n: 'String Charm',      ilvl: 1,  wis: 1 },
    { n: 'Silver Pendant',    ilvl: 2,  con: 1 },
    { n: 'Crystal Amulet',    ilvl: 3,  int: 2 },
    { n: 'Dragon Tooth',      ilvl: 5,  str: 2, fireRes: 0.1 },
    { n: 'Starlight Pendant', ilvl: 7,  wis: 3, hpRegen: 2 },
    { n: 'Abyssal Locket',    ilvl: 9,  int: 4, voidDmg: 3 },
    { n: 'Planar Pendant',    ilvl: 11, int: 5, arcaneDmg: 3, mpRegen: 1 },
    { n: 'Emberfall Charm',   ilvl: 12, str: 4, fireDmg: 4, fireRes: 0.1 },
    { n: 'Glacial Talisman',  ilvl: 13, wis: 4, iceDmg: 4, iceRes: 0.1 },
    { n: 'Storm Amulet',      ilvl: 14, dex: 4, lightDmg: 5, lightRes: 0.1 },
    { n: 'Void Locket',       ilvl: 15, int: 6, voidDmg: 6, voidRes: 0.15 },
    { n: 'Chronos Pendant',   ilvl: 16, wis: 5, arcaneDmg: 5, hpRegen: 2 },
    { n: 'Aetherium Charm',   ilvl: 17, int: 6, arcaneDmg: 6, mpRegen: 2 },
    { n: 'Convergence Amulet',ilvl: 18, con: 4, arcaneDmg: 4, voidDmg: 4, hpRegen: 2 },
    { n: 'Nexus Pendant',     ilvl: 19, int: 7, arcaneDmg: 7, voidDmg: 4, mpRegen: 3 },
    { n: 'Reality Anchor',    ilvl: 20, int: 8, wis: 5, arcaneDmg: 8, voidDmg: 5, hpRegen: 4, mpRegen: 4, lifeSteal: 0.05 },
    { n: 'Astral Pendant',    ilvl: 21, int: 9, wis: 5, arcaneDmg: 7, voidDmg: 4, mpRegen: 3 },
    { n: 'Infernal Charm',    ilvl: 22, str: 7, fireDmg: 8, fireRes: 0.15, hpRegen: 3 },
  ]
};

function rollRarity(zoneLevel, luckBonus) {
  luckBonus = luckBonus || 0;
  var roll = Math.random() + luckBonus;
  var tier = Math.min(zoneLevel, 10);
  if (roll > 0.995 - (tier * 0.005)) return 'legendary';
  if (roll > 0.95 - (tier * 0.01))  return 'epic';
  if (roll > 0.80 - (tier * 0.015)) return 'rare';
  if (roll > 0.50 - (tier * 0.02))  return 'uncommon';
  return 'common';
}

function generateItem(slot, zoneLevel, forceRarity) {
  var table = LOOT_TABLES[slot === 'ring1' || slot === 'ring2' ? 'ring' : slot];
  if (!table) return null;

  var candidates = table.filter(function(i) { return i.ilvl <= zoneLevel + 2; });
  var base = candidates.length > 0 
    ? candidates[Math.floor(Math.random() * candidates.length)]
    : table[0];

  var rarity = forceRarity || rollRarity(zoneLevel);
  var rarityData = ITEM_RARITY[rarity];

  var item = {
    n: base.n,
    slot: slot,
    r: rarity,
    ilvl: base.ilvl,
    d: base.d || 'A piece of adventuring gear.'
  };
  for (var k in base) {
    if (k !== 'n' && k !== 'ilvl' && k !== 'd') item[k] = base[k];
  }

  if (item.atk) item.atk = Math.floor(item.atk * rarityData.mult);
  if (item.def) item.def = Math.floor(item.def * rarityData.mult);

  if (Math.random() < rarityData.prefixChance) {
    var prefixes = Object.keys(ITEM_PREFIXES);
    var pName = prefixes[Math.floor(Math.random() * prefixes.length)];
    var pData = ITEM_PREFIXES[pName];
    item.prefix = pName;
    item.prefixData = pData;
    item.n = pName + ' ' + item.n;
    item[pData.stat] = (item[pData.stat] || 0) + pData.val;
  }

  if (Math.random() < rarityData.prefixChance * 0.7) {
    var suffixes = Object.keys(ITEM_SUFFIXES);
    var sName = suffixes[Math.floor(Math.random() * suffixes.length)];
    var sData = ITEM_SUFFIXES[sName];
    item.suffix = sName;
    item.suffixData = sData;
    item.n = item.n + ' ' + sName;
    item[sData.stat] = (item[sData.stat] || 0) + sData.val;
  }

  item.value = Math.floor((base.ilvl * 5 + (rarityData.mult * 10)) * (1 + Math.random() * 0.5));

  var socketCount = getSocketCount(base.ilvl);
  if (socketCount > 0) {
    item.sockets = new Array(socketCount).fill(null);
    item.d += ' [' + socketCount + ' socket' + (socketCount > 1 ? 's' : '') + ']';
  }

  return item;
}

function getEquippedStats() {
  var stats = { atk: 0, def: 0, str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0,
                fireDmg: 0, iceDmg: 0, lightDmg: 0, voidDmg: 0, arcaneDmg: 0,
                fireRes: 0, iceRes: 0, lightRes: 0, voidRes: 0, arcaneRes: 0,
                lifeSteal: 0, critChance: 0, mpRegen: 0, hpRegen: 0, goldFind: 0 };

  for (var slot in G.p.eq) {
    var item = G.p.eq[slot];
    if (!item) continue;
    for (var key in stats) {
      if (item[key]) stats[key] += item[key];
      if (item.socketStats && item.socketStats[key]) stats[key] += item.socketStats[key];
    }
  }
  return stats;
}

function getTotalAC() {
  var eqStats = getEquippedStats();
  var dexMod = DICE.abilityMod(G.p.stats.dex + eqStats.dex);
  var baseAC = 10 + dexMod;
  if (G.p.eq.armor) {
    baseAC = 10 + Math.min(dexMod, 2) + (G.p.eq.armor.def || 0);
  }
  baseAC += eqStats.def;
  var shieldBonus = G.p.buffs.reduce(function(s, b) { return s + (b.def || 0); }, 0);
  return baseAC + shieldBonus;
}

function equipItem(invIndex) {
  var item = G.p.inv[invIndex];
  if (!item || !item.slot) return;

  var slot = item.slot;
  var slotKey = slot === 'ring' ? (G.p.eq.ring1 ? 'ring2' : 'ring1') : slot;

  var old = G.p.eq[slotKey];
  if (old) {
    addI(old);
    lg('Unequipped: ' + old.n);
  }

  G.p.eq[slotKey] = Object.assign({}, item);
  G.p.inv.splice(invIndex, 1);
  lg('Equipped: ' + item.n + ' (' + ITEM_RARITY[item.r].name + ')');

  var eqStats = getEquippedStats();
  G.p.mhp = 80 + (G.p.lvl - 1) * 10 + (eqStats.con * 2);
  G.p.mmp = 120 + (G.p.lvl - 1) * 15 + (eqStats.int * 2);
  G.p.hp = Math.min(G.p.hp, G.p.mhp);
  G.p.mp = Math.min(G.p.mp, G.p.mmp);
  checkDailyQuests('cast_spells', 1); 
  render();
}

function unequipItem(slot) {
  var item = G.p.eq[slot];
  if (!item) return;
  addI(Object.assign({}, item));
  lg('Unequipped: ' + item.n);
  G.p.eq[slot] = null;

  var eqStats = getEquippedStats();
  G.p.mhp = 80 + (G.p.lvl - 1) * 10 + (eqStats.con * 2);
  G.p.mmp = 120 + (G.p.lvl - 1) * 15 + (eqStats.int * 2);
  G.p.hp = Math.min(G.p.hp, G.p.mhp);
  G.p.mp = Math.min(G.p.mp, G.p.mmp);

  render();
}

function equipPartyGear(memberName, invIndex) {
  var member = G.party.find(function(p) { return p.n === memberName; });
  if (!member) return;
  if (member.gear) {
    lg('❌ ' + member.n + ' already has ' + member.gear.n + '! Unequip first.');
    return;
  }
  var item = G.p.inv[invIndex];
  if (!item || item.t !== 'pgear') return;
  if (item.for && item.for !== memberName) {
    lg('❌ ' + item.n + ' is for ' + item.for + ', not ' + memberName + '!');
    return;
  }
  member.gear = {
    n: item.n,
    atk: item.atk || 0,
    def: item.def || 0,
    hp: item.hp || 0,
    mp: item.mp || 0,
    spd: item.spd || 0,
    d: item.d || 'Party gear.'
  };
  if (member.gear.hp) { member.mhp += member.gear.hp; member.hp += member.gear.hp; }
  if (member.gear.mp) { member.mmp = (member.mmp || member.mhp) + member.gear.mp; member.mp = (member.mp || 0) + member.gear.mp; }
  if (member.gear.atk) member.atk += member.gear.atk;
  if (member.gear.def) member.def += member.gear.def;
  if (member.gear.spd) member.spd += member.gear.spd;
  G.p.inv.splice(invIndex, 1);
  lg('⚔️ Equipped ' + item.n + ' on ' + member.n + '!');
  render();
}

function unequipPartyGear(memberName) {
  var member = G.party.find(function(p) { return p.n === memberName; });
  if (!member || !member.gear) return;
  var g = member.gear;
  if (g.hp) { member.mhp -= g.hp; member.hp = Math.min(member.mhp, member.hp - g.hp); }
  if (g.mp) { member.mmp -= g.mp; member.mp = Math.max(0, (member.mp || 0) - g.mp); }
  if (g.atk) member.atk -= g.atk;
  if (g.def) member.def -= g.def;
  if (g.spd) member.spd -= g.spd;
  addI({ n: g.n, t: 'pgear', q: 1, for: memberName, atk: g.atk, def: g.def, hp: g.hp, mp: g.mp, spd: g.spd, d: g.d });
  lg('📦 Unequipped ' + g.n + ' from ' + member.n + '.');
  member.gear = null;
  render();
}

function addLootFromCombat(zoneName) {
  var zone = G.zones.find(function(z) { return z.n === zoneName; });
  if (!zone) return;

  var slots = ['weapon', 'armor', 'head', 'hands', 'feet', 'ring', 'amulet'];
  var slot = slots[Math.floor(Math.random() * slots.length)];
  var item = generateItem(slot, zone.lv);

  if (item) {
    addI(item);
    lg('🎁 Loot: ' + item.n + ' (' + ITEM_RARITY[item.r].name + ')!');
  }
}

// ============================================================
// DYNAMIC ENEMY SCALING SYSTEM
// ============================================================

var ENEMY_TEMPLATES = {
  brute:     { hpMult: 1.4, atkMult: 0.8, defMult: 1.2, xpMult: 1.0, gMult: 1.0 },
  striker:   { hpMult: 0.8, atkMult: 1.4, defMult: 0.7, xpMult: 1.1, gMult: 1.1 },
  tank:      { hpMult: 1.6, atkMult: 0.6, defMult: 1.4, xpMult: 1.0, gMult: 0.9 },
  balanced:  { hpMult: 1.0, atkMult: 1.0, defMult: 1.0, xpMult: 1.0, gMult: 1.0 },
  elite:     { hpMult: 1.3, atkMult: 1.2, defMult: 1.1, xpMult: 1.3, gMult: 1.3 },
};

function generateEnemyStats(zoneLevel, templateKey, elem) {
  var tpl = ENEMY_TEMPLATES[templateKey] || ENEMY_TEMPLATES.balanced;
  
  var base = {
    hp: 15 + (zoneLevel * 12),
    atk: 3 + (zoneLevel * 1.8),
    def: 1 + Math.floor(zoneLevel * 1.2),
    xp: 8 + (zoneLevel * 10),
    g: 2 + (zoneLevel * 6)
  };
  
  return {
    hp: Math.floor(base.hp * tpl.hpMult),
    mhp: Math.floor(base.hp * tpl.hpMult),
    atk: Math.floor(base.atk * tpl.atkMult),
    def: Math.floor(base.def * tpl.defMult),
    xp: Math.floor(base.xp * tpl.xpMult),
    g: Math.floor(base.g * tpl.gMult),
    elem: elem || 'none'
  };
}

var ENEMY_REGISTRY = {
  'Goblin': null, 'Wolf': null, 'Slime': null,
  'Skeleton': null, 'Zombie': null, 'Ghost': null,
  'Fire Imp': null, 'Lava Slug': null, 'Ash Wraith': null,
  'Crystal Spider': null, 'Gem Golem': null, 'Shimmer Bat': null,
  'Storm Wraith': null, 'Lightning Hound': null, 'Thunder Knight': null,
  'Ice Elemental': null, 'Frost Wolf': null, 'Frozen Knight': null,
  'Void Beast': null, 'Shadow Demon': null, 'Abyssal Horror': null,
  'Drowned Sailor': null, 'Sea Serpent': null, 'Coral Golem': null,
  'Dragon Whelp': null, 'Ash Drake': null, 'Elder Wyrm': null,
  'Star Sentinel': null, 'Celestial Knight': null, 'Astral Lord': null,
  'Planar Wisp': null, 'Rift Stalker': null, 'Aether Golem': null,
  'Chronomancer': null, 'Void Weaver': null, 'Planar Leviathan': null,
  'Veil Wraith': null, 'Shardling': null, 'Echo Walker': null,
  'Ember Drake': null, 'Ash Titan': null, 'Flame Serpent': null,
  'Frost Lich': null, 'Glacial Behemoth': null, 'Snow Revenant': null,
  'Storm Titan': null, 'Lightning Wraith': null, 'Thunderborn': null,
  'Void Leviathan': null, 'Null Elemental': null, 'Hungering Maw': null,
  'Time Echo': null, 'Chronomancer Lord': null, 'Paradox Wraith': null,
  'Aether Bloom': null, 'Mana Leviathan': null, 'Crystal Serpent': null,
  'Convergence Avatar': null, 'Planar Chimera': null, 'Resonance Horror': null,
  'Nexus Guardian': null, 'Planar Titan': null,
  'Reality Weaver': { template: 'elite', elem: 'arcane', zoneLv: 21 },
  'Fracture Hound': { template: 'striker', elem: 'arcane', zoneLv: 21 },
  'Dimensional Drifter': { template: 'balanced', elem: 'void', zoneLv: 22 },
  'Chrono-Rat': { template: 'striker', elem: 'arcane', zoneLv: 22 },
  'Ember Wraith': { template: 'brute', elem: 'fire', zoneLv: 23 },
  'Ash Phantom': { template: 'striker', elem: 'fire', zoneLv: 23 },
  'Glacial Shade': { template: 'tank', elem: 'ice', zoneLv: 24 },
  'Frost Revenant': { template: 'balanced', elem: 'ice', zoneLv: 24 },
  'Astral Construct': { template: 'elite', elem: 'arcane', zoneLv: 22 },
  'Void Hound': { template: 'striker', elem: 'void', zoneLv: 22 },
  'Phase Walker': { template: 'balanced', elem: 'arcane', zoneLv: 22 },
  'Rift Rat': { template: 'striker', elem: 'void', zoneLv: 22 },
  'Flame Serpent': { template: 'striker', elem: 'fire', zoneLv: 23 },
  'Magma Titan': { template: 'tank', elem: 'fire', zoneLv: 23 },
  'Basilisk': { template: 'striker', elem: 'poison', zoneLv: 9 },
  'Venom Hound': { template: 'striker', elem: 'poison', zoneLv: 9 },
  'Mire Serpent': { template: 'balanced', elem: 'poison', zoneLv: 9 },
  'Fulcrum Warden': { template: 'tank', elem: 'arcane', zoneLv: 15 },
  'Stasis Construct': { template: 'balanced', elem: 'arcane', zoneLv: 15 },
  'Planar Mote': { template: 'striker', elem: 'arcane', zoneLv: 15 },
  'Magma Serpent': { template: 'striker', elem: 'fire', zoneLv: 24 },
  'Glass Wraith': { template: 'striker', elem: 'fire', zoneLv: 24 },
  'Scorch Titan': { template: 'tank', elem: 'fire', zoneLv: 24 },
  'Abyssal Leviathan Spawn': { template: 'brute', elem: 'ice', zoneLv: 25 },
  'Frozen Kraken': { template: 'elite', elem: 'ice', zoneLv: 25 },
  'Pressure Golem': { template: 'tank', elem: 'ice', zoneLv: 25 },
  'Storm Sovereign Remnant': { template: 'elite', elem: 'lightning', zoneLv: 26 },
  'Crown Wraith': { template: 'striker', elem: 'lightning', zoneLv: 26 },
  'Skyfall Construct': { template: 'balanced', elem: 'lightning', zoneLv: 26 },
  'Throne Keeper': { template: 'tank', elem: 'void', zoneLv: 27 },
  'Hollow Knight': { template: 'striker', elem: 'void', zoneLv: 27 },
  'Void Courtier': { template: 'balanced', elem: 'void', zoneLv: 27 },
  'Spire Archon': { template: 'elite', elem: 'arcane', zoneLv: 28 },
  'Reality Weaver Elite': { template: 'striker', elem: 'arcane', zoneLv: 28 },
  'Chrono Guardian': { template: 'tank', elem: 'arcane', zoneLv: 28 },
  'Apex Warden': { template: 'elite', elem: 'arcane', zoneLv: 29 },
  'Final Construct': { template: 'tank', elem: 'arcane', zoneLv: 29 },
  'The Gatekeeper': { template: 'elite', elem: 'arcane', zoneLv: 29 },
};

function getDynamicEnemyStats(name) {
  var reg = ENEMY_REGISTRY[name];
  if (!reg) return null;
  var stats = generateEnemyStats(reg.zoneLv, reg.template, reg.elem);
  stats.n = name;
  return stats;
}

// ============================================================
// PLANAR RESONANCE SYSTEM (Phase 2)
// ============================================================

var PLANAR_ELEMENTS = ['fire', 'ice', 'lightning', 'void', 'arcane'];

function getZoneElement(zoneName) {
  var zone = G.zones.find(function(z) { return z.n === zoneName; });
  return zone ? zone.elem : 'arcane';
}

function getGearElement() {
  var weapon = G.p.eq.weapon;
  if (!weapon) return 'arcane';
  if (weapon.fireDmg > 0) return 'fire';
  if (weapon.iceDmg > 0) return 'ice';
  if (weapon.lightDmg > 0 || weapon.lightningDmg > 0) return 'lightning';
  if (weapon.voidDmg > 0) return 'void';
  if (weapon.arcaneDmg > 0) return 'arcane';

  var armor = G.p.eq.armor;
  if (armor) {
    if (armor.fireRes > 0) return 'fire';
    if (armor.iceRes > 0) return 'ice';
    if (armor.lightRes > 0) return 'lightning';
    if (armor.voidRes > 0) return 'void';
    if (armor.arcaneRes > 0) return 'arcane';
  }
  return 'arcane';
}

function getResonanceMultiplier(zoneName) {
  var zoneElem = getZoneElement(zoneName);
  var gearElem = getGearElement();
  if (!zoneElem || zoneElem === 'none') return 1;
  if (gearElem === zoneElem) return 1.25 * getTalentMultiplier('resonance');
  if (gearElem !== zoneElem && PLANAR_ELEMENTS.indexOf(gearElem) !== -1) return 0.75 + (getTalentMultiplier('resonance') - 1);
  return 1;
}

function getResonanceStatus(zoneName) {
  var zoneElem = getZoneElement(zoneName);
  var gearElem = getGearElement();
  if (!zoneElem || zoneElem === 'none') return { status: 'neutral', text: 'No resonance', color: '#9ca3af', icon: '✦' };
  if (gearElem === zoneElem) return { status: 'matched', text: gearElem.toUpperCase() + ' RESONANCE (+25% DMG)', color: '#22c55e', icon: '⚡' };
  return { status: 'mismatched', text: gearElem.toUpperCase() + ' vs ' + zoneElem.toUpperCase() + ' (-25% DMG)', color: '#ef4444', icon: '⚠️' };
}

// ============================================================
// ZONE-BASED TEMPORARY BUFFS
// ============================================================

var ZONE_BUFFS = {
  'Ember Peak': { name: 'Fire Attunement', fireRes: 0.15, atk: 2, desc: 'The heat fuels your rage' },
  'Frostspire Ruins': { name: 'Ice Attunement', iceRes: 0.15, def: 2, desc: 'The cold hardens your resolve' },
  'Arcane Planar Tower': { name: 'Planar Attunement', arcaneDmg: 3, desc: 'Reality bends to your will' },
  'Stormhold': { name: 'Storm Attunement', lightRes: 0.15, spd: 1, desc: 'Lightning courses through you' },
  'Abyssal Depths': { name: 'Void Attunement', voidRes: 0.15, desc: 'You embrace the darkness' },
  "Dragon's Maw": { name: 'Dragon Scales', fireRes: 0.1, def: 1, desc: 'Ash settles on your skin like armor' }
};

function applyZoneBuffs(zoneName) {
  clearZoneBuffs();
  var buff = ZONE_BUFFS[zoneName];
  if(!buff) return;
  for(var i = 0; i < G.party.length; i++) {
    var p = G.party[i];
    if(!p.on) continue;
    p.zoneBuff = Object.assign({ zone: zoneName }, buff);
    if(buff.atk) p.atk += buff.atk;
    if(buff.def) p.def += buff.def;
    if(buff.spd) p.spd += buff.spd;
    var statBonuses = [];
    if(buff.atk) statBonuses.push('ATK+' + buff.atk);
    if(buff.def) statBonuses.push('DEF+' + buff.def);
    if(buff.spd) statBonuses.push('SPD+' + buff.spd);
    if(buff.arcaneDmg) statBonuses.push('Arcane+' + buff.arcaneDmg);
    if(buff.fireRes) statBonuses.push('FireRes+' + Math.floor(buff.fireRes*100) + '%');
    if(buff.iceRes) statBonuses.push('IceRes+' + Math.floor(buff.iceRes*100) + '%');
    if(buff.lightRes) statBonuses.push('LightRes+' + Math.floor(buff.lightRes*100) + '%');
    if(buff.voidRes) statBonuses.push('VoidRes+' + Math.floor(buff.voidRes*100) + '%');
    lg('🌟 ' + p.n + ' feels ' + buff.name + ': ' + statBonuses.join(' ') + ' — ' + buff.desc);
  }
}

function clearZoneBuffs() {
  for(var i = 0; i < G.party.length; i++) {
    var p = G.party[i];
    if(p.zoneBuff) {
      var buff = p.zoneBuff;
      if(buff.atk) p.atk -= buff.atk;
      if(buff.def) p.def -= buff.def;
      if(buff.spd) p.spd -= buff.spd;
      delete p.zoneBuff;
    }
  }
}

function applyPlanarResonance(damage, zoneName) {
  var mult = getResonanceMultiplier(zoneName);
  if (mult > 1) lg('🌌 PLANAR RESONANCE MATCHED! +' + Math.floor((mult - 1) * 100) + '% damage!');
  else if (mult < 1) lg('🌌 PLANAR RESONANCE MISMATCHED! -' + Math.floor((1 - mult) * 100) + '% damage...');
  return Math.floor(damage * mult);
}

var WEATHER = {
  'clear': { name: 'Clear Skies', desc: 'Normal conditions.', mods: {} },
  'rain': { name: 'Heavy Rain', desc: 'Lightning +20%, Fire -10%.', mods: { lightningDmg: 1.2, fireDmg: 0.9 } },
  'fog': { name: 'Thick Fog', desc: 'Accuracy reduced for all.', mods: { hitChance: 0.85 } },
  'scorching': { name: 'Scorching Heat', desc: 'Fire +15%. MP drains slowly.', mods: { fireDmg: 1.15, mpDrain: 2 } },
  'starfall': { name: 'Starfall', desc: 'Arcane +15%. Meteors may strike.', mods: { arcaneDmg: 1.15, meteorChance: 0.1 } }
};

function rollWeather() {
  var roll = Math.random();
  if (roll < 0.5) G.currentWeather = 'clear';
  else if (roll < 0.7) G.currentWeather = 'rain';
  else if (roll < 0.8) G.currentWeather = 'fog';
  else if (roll < 0.9) G.currentWeather = 'scorching';
  else G.currentWeather = 'starfall';
  
  var w = WEATHER[G.currentWeather];
  if (G.currentWeather !== 'clear') {
    lg('🌦️ Weather: ' + w.name + ' — ' + w.desc);
  }
}

function applyWeatherDamage(damage, elem) {
  if (!G.currentWeather || G.currentWeather === 'clear') return damage;
  var mods = WEATHER[G.currentWeather].mods;
  if (elem && mods[elem + 'Dmg']) {
    var newDmg = Math.floor(damage * mods[elem + 'Dmg']);
    if (mods[elem + 'Dmg'] > 1) lg('🌦️ Weather boost! +' + Math.floor((mods[elem + 'Dmg'] - 1) * 100) + '% ' + elem + ' damage');
    return newDmg;
  }
  return damage;
}

function applyWeatherCombat() {
  if (!G.currentWeather || G.currentWeather === 'clear') return;
  var mods = WEATHER[G.currentWeather].mods;
  
  if (mods.mpDrain && G.cbt.turn % 3 === 0) {
    G.p.mp = Math.max(0, G.p.mp - mods.mpDrain);
    lg('☀️ The heat drains ' + mods.mpDrain + ' MP!');
  }
  
  if (mods.meteorChance && Math.random() < mods.meteorChance) {
    var alive = G.cbt.en.filter(function(e) { return e.hp > 0; });
    if (alive.length > 0) {
      var target = alive[Math.floor(Math.random() * alive.length)];
      var dmg = Math.floor(G.p.stats.int * 1.5);
      target.hp -= dmg;
      lg('☄️ A star falls, striking ' + target.n + ' for ' + dmg + '!');
      if (target.hp <= 0) { target.hp = 0; lg('💀 ' + target.n + ' is crushed!'); }
    }
  }
}

// ============================================================
// PARTY TRINKET SHOP
// ============================================================

var TRINKET_SHOP = [
  { n: 'Iron Shield',      atk: 0, def: 3, hp: 20, r: 'common',    price: 30 },
  { n: 'Lucky Charm',      atk: 1, def: 1, hp: 10, r: 'common',    price: 25 },
  { n: "Warrior's Band",   atk: 3, def: 0, hp: 15, r: 'uncommon',  price: 60 },
  { n: 'Guardian Pendant', atk: 0, def: 5, hp: 30, r: 'uncommon',  price: 80 },
  { n: 'Storm Crystal',    atk: 4, def: 2, hp: 10, r: 'rare',      price: 150 },
  { n: 'Phoenix Ember',    atk: 2, def: 2, hp: 50, r: 'rare',      price: 200 },
  { n: 'Void Shard',       atk: 6, def: 0, hp: 20, r: 'epic',      price: 400 },
  { n: 'Celestial Seal',   atk: 3, def: 4, hp: 40, r: 'epic',      price: 500 }
];

function buyTrinket(index) {
  var t = TRINKET_SHOP[index];
  if (!t) return;
  
  var aisyah = G.party.find(function(p) { return p.on && p.n === 'Aisyah' && p.hp > 0; });
  var finalPrice = aisyah ? Math.floor(t.price * 0.9) : t.price;
  
  if (G.p.gold < finalPrice) { lg('Need ' + finalPrice + 'G'); return; }
  
  G.p.gold -= finalPrice;
  var item = {
    n: t.n, t: 'pgear', q: 1, r: t.r,
    atk: t.atk || 0, def: t.def || 0, hp: t.hp || 0,
    d: '+' + (t.atk || 0) + ' ATK, +' + (t.def || 0) + ' DEF, +' + (t.hp || 0) + ' HP'
  };
  addI(item);
  lg('🎁 Bought ' + t.n + ' for ' + finalPrice + 'G!' + (aisyah ? ' (Aisyah haggled 10% off!)' : ''));
  render();
}

function initPartyGearBonus() {
  if (!G || !G.party) return;
  for (var i = 0; i < G.party.length; i++) {
    var p = G.party[i];
    if (!p.gearBonus) p.gearBonus = { atk: 0, def: 0, hp: 0, mp: 0, spd: 0 };
  }
}

// ============================================================
// RUNE SOCKETING SYSTEM (Phase 2)
// ============================================================

var RUNE_TYPES = {
  power:    { name: 'Rune of Power',    icon: '⚔️', stat: 'atk', val: 5, r: 'common', color: '#ef4444' },
  mind:     { name: 'Rune of Mind',     icon: '🔮', stat: 'int', val: 3, r: 'common', color: '#3b82f6' },
  phoenix:  { name: 'Rune of Phoenix',  icon: '🔥', stat: 'fireDmg', val: 3, r: 'uncommon', color: '#f97316', pct: 0.10 },
  frost:    { name: 'Rune of Frost',    icon: '❄️', stat: 'iceDmg', val: 3, r: 'uncommon', color: '#06b6d4', pct: 0.10 },
  storm:    { name: 'Rune of Storm',    icon: '⚡', stat: 'lightDmg', val: 3, r: 'uncommon', color: '#eab308', pct: 0.10 },
  void:     { name: 'Rune of Void',     icon: '🌑', stat: 'voidDmg', val: 4, r: 'rare', color: '#a855f7', pct: 0.15 },
  arcane:   { name: 'Rune of Arcane',   icon: '✨', stat: 'arcaneDmg', val: 4, r: 'rare', color: '#8b5cf6', pct: 0.15 },
  life:     { name: 'Rune of Life',     icon: '💚', stat: 'hpRegen', val: 3, r: 'common', color: '#22c55e' },
  mana:     { name: 'Rune of Mana',     icon: '💧', stat: 'mpRegen', val: 2, r: 'common', color: '#6366f1' }
};

function getSocketCount(ilvl) {
  if (ilvl >= 20) return 3;
  if (ilvl >= 15) return 2;
  if (ilvl >= 10) return 1;
  return 0;
}

function generateRune(zoneLevel) {
  var keys = Object.keys(RUNE_TYPES);
  var roll = Math.random() + (zoneLevel * 0.02);
  var pool = keys;
  if (roll > 0.7) pool = keys.filter(function(k) { return RUNE_TYPES[k].r !== 'common'; });
  if (roll > 0.9) pool = keys.filter(function(k) { return RUNE_TYPES[k].r === 'rare'; });
  if (pool.length === 0) pool = keys;
  var type = pool[Math.floor(Math.random() * pool.length)];
  var rune = RUNE_TYPES[type];
  return { type: type, name: rune.name, icon: rune.icon, stat: rune.stat, val: rune.val, r: rune.r, color: rune.color, pct: rune.pct, id: Date.now() + Math.random() };
}

function addRuneLoot(zoneName) {
  var zone = G.zones.find(function(z) { return z.n === zoneName; });
  if (!zone || zone.lv < 10) return;
  if (Math.random() < 0.3) {
    var rune = generateRune(zone.lv);
    G.runes.push(rune);
    lg('💎 Rune dropped: ' + rune.icon + ' ' + rune.name + '!');
  }
}

G.runeCombineModal = { open: false, selected: [] };

function openCombineModal() {
  G.runeCombineModal = { open: true, selected: [] };
  render();
}

function closeCombineModal() {
  G.runeCombineModal = { open: false, selected: [] };
  render();
}

function toggleCombineRune(runeIndex) {
  var idx = G.runeCombineModal.selected.indexOf(runeIndex);
  if (idx > -1) {
    G.runeCombineModal.selected.splice(idx, 1);
  } else {
    if (G.runeCombineModal.selected.length >= 3) {
      lg('❌ Max 3 runes selected!');
      return;
    }
    G.runeCombineModal.selected.push(runeIndex);
  }
  render();
}

function getCombinePreview() {
  var selected = G.runeCombineModal.selected.map(function(i) { return G.runes[i]; }).filter(function(r) { return r; });
  if (selected.length !== 3) return null;
  var types = [];
  selected.forEach(function(r) { if (types.indexOf(r.type) === -1) types.push(r.type); });
  if (types.length !== 1) return { error: 'All 3 must be same type!' };
  var base = RUNE_TYPES[types[0]];
  var upgradeRarity = base.r === 'common' ? 'uncommon' : base.r === 'uncommon' ? 'rare' : 'epic';
  var mult = base.r === 'common' ? 1.5 : 2;
  return {
    name: base.name + ' +',
    icon: base.icon,
    stat: base.stat,
    val: Math.floor(base.val * mult),
    r: upgradeRarity,
    color: base.color,
    pct: base.pct ? Math.min(0.30, base.pct * mult) : null
  };
}

function doCombineRunes() {
  var preview = getCombinePreview();
  if (!preview || preview.error) {
    lg(preview && preview.error ? preview.error : '❌ Select 3 matching runes!');
    return;
  }
  var selected = G.runeCombineModal.selected.slice().sort(function(a,b) { return b-a; });
  for (var i = 0; i < selected.length; i++) G.runes.splice(selected[i], 1);
  G.runes.push({
    type: preview.name.replace(' +','').toLowerCase().replace('rune of ',''),
    name: preview.name,
    icon: preview.icon,
    stat: preview.stat,
    val: preview.val,
    r: preview.r,
    color: preview.color,
    pct: preview.pct,
    id: Date.now() + Math.random()
  });
  lg('✨ Combined into ' + preview.icon + ' ' + preview.name + ' (' + preview.r + ')!');
  closeCombineModal();
}

function combineRunes(runeIndices) {
  openCombineModal();
}

G.runeSocketModal = { open: false, itemIndex: null, slotIndex: null };

function openSocketModal(itemIndex, slotIndex) {
  var item = G.p.inv[itemIndex];
  if (!item || !item.sockets || item.sockets[slotIndex]) return;
  if (G.runes.length === 0) { lg('❌ No runes available!'); return; }
  G.runeSocketModal = { open: true, itemIndex: itemIndex, slotIndex: slotIndex };
  render();
}

function closeSocketModal() {
  G.runeSocketModal = { open: false, itemIndex: null, slotIndex: null };
  render();
}

function confirmSocketRune(runeIndex) {
  var m = G.runeSocketModal;
  var item = G.p.inv[m.itemIndex];
  var rune = G.runes[runeIndex];
  if (!item || !rune || item.sockets[m.slotIndex]) return;

  item.sockets[m.slotIndex] = rune;
  G.runes.splice(runeIndex, 1);
  lg('💎 Socketed ' + rune.icon + ' ' + rune.name + ' into ' + item.n + '!');

  if (!item.socketStats) item.socketStats = {};
  item.socketStats[rune.stat] = (item.socketStats[rune.stat] || 0) + rune.val;
  if (rune.pct) {
    var pctKey = rune.stat + 'Pct';
    item.socketStats[pctKey] = (item.socketStats[pctKey] || 0) + rune.pct;
  }

  closeSocketModal();
}

function socketRune(itemIndex, slot, runeIndex) {
  openSocketModal(itemIndex, slot);
}

function unsocketRune(itemIndex, slot) {
  var item = G.p.inv[itemIndex];
  if (!item || !item.sockets || !item.sockets[slot]) return;
  var rune = item.sockets[slot];
  G.runes.push(rune);
  item.sockets[slot] = null;

  item.socketStats = {};
  for (var i = 0; i < item.sockets.length; i++) {
    var s = item.sockets[i];
    if (s) {
      item.socketStats[s.stat] = (item.socketStats[s.stat] || 0) + s.val;
      if (s.pct) {
        var pctKey = s.stat + 'Pct';
        item.socketStats[pctKey] = (item.socketStats[pctKey] || 0) + s.pct;
      }
    }
  }
  lg('💎 Removed ' + rune.icon + ' ' + rune.name + ' from ' + item.n + '!');
}

function getItemSocketDisplay(item) {
  if (!item.sockets) return '';
  var h = '<div style="display:flex;gap:4px;margin-top:4px;">';
  for (var i = 0; i < item.sockets.length; i++) {
    var s = item.sockets[i];
    h += '<div style="width:20px;height:20px;border-radius:50%;border:2px solid ' + (s ? s.color : 'var(--disabled)') + ';background:' + (s ? s.color + '40' : 'transparent') + ';display:flex;align-items:center;justify-content:center;font-size:10px;">' + (s ? s.icon : '○') + '</div>';
  }
  h += '</div>';
  return h;
}
