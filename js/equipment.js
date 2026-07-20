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
  // Stat boost prefixes
  'Sharp':      { stat: 'atk', val: 2, desc: '+2 ATK' },
  'Reinforced': { stat: 'def', val: 2, desc: '+2 DEF' },
  'Arcane':     { stat: 'int', val: 2, desc: '+2 INT' },
  'Wise':       { stat: 'wis', val: 2, desc: '+2 WIS' },
  'Swift':      { stat: 'dex', val: 2, desc: '+2 DEX' },
  'Sturdy':     { stat: 'con', val: 2, desc: '+2 CON' },
  'Charming':   { stat: 'cha', val: 2, desc: '+2 CHA' },
  'Strong':     { stat: 'str', val: 2, desc: '+2 STR' },
  // Special prefixes
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

// Base item templates by slot and level range
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
    // Phase 2: Planar Weapons (Lv 11-20)
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
        // === PHASE 1: ilvl 21-22 WEAPONS ===
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
    // Phase 2: Planar Armor (Lv 11-20)
    { n: 'Planar Robes',      ilvl: 11, def: 17, int: 5, arcaneRes: 0.15, mpRegen: 2 },
    { n: 'Emberfall Plate',   ilvl: 12, def: 19, con: 4, fireRes: 0.25, hpRegen: 2 },
    { n: 'Glacial Aegis',    ilvl: 13, def: 21, wis: 5, iceRes: 0.25, mpRegen: 2 },
    { n: 'Stormweave Mail',   ilvl: 14, def: 23, dex: 4, lightRes: 0.25, hpRegen: 3 },
    { n: 'Voidshroud',        ilvl: 15, def: 25, int: 6, voidRes: 0.3, mpRegen: 3 },
    { n: 'Chronos Vest',      ilvl: 16, def: 27, wis: 6, arcaneRes: 0.2, hpRegen: 3 },
    { n: 'Aetherium Plate',   ilvl: 17, def: 29, con: 5, arcaneRes: 0.25, mpRegen: 3 },
    { n: 'Convergence Mail',  ilvl: 18, def: 32, str: 4, voidRes: 0.2, fireRes: 0.2, iceRes: 0.2 },
    { n: 'Nexus Ward',        ilvl: 19, def: 35, con: 6, arcaneRes: 0.3, voidRes: 0.2, hpRegen: 4 },
    { n: 'Reality Anchor',    ilvl: 20, def: 40, int: 8, wis: 4, arcaneRes: 0.35, voidRes: 0.25, hpRegen: 5, mpRegen: 4 },
        // === PHASE 1: ilvl 21-22 ARMOR ===
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
    // Phase 2: Planar Headgear (Lv 11-20)
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
        // === PHASE 1: ilvl 21-22 HEAD ===
    { n: 'Astral Crown',      ilvl: 21, def: 22, int: 9, wis: 5, arcaneRes: 0.25, voidRes: 0.15, mpRegen: 4 },
    { n: 'Infernal Helm',     ilvl: 22, def: 24, str: 5, con: 4, fireRes: 0.25, hpRegen: 2 },

  ],
  hands: [
    { n: 'Cloth Wraps',       ilvl: 1,  def: 1, dex: 1 },
    { n: 'Leather Gloves',    ilvl: 2,  def: 1, atk: 1 },
    { n: 'Iron Gauntlets',    ilvl: 3,  def: 2, str: 1 },
    { n: 'Spellweaver Gloves',ilvl: 5,  def: 2, int: 2, mpRegen: 1 },
    { n: 'Void Grips',        ilvl: 7,  def: 3, atk: 2, voidDmg: 2 },
    // Phase 2: Planar Gloves (Lv 11-20)
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
        // === PHASE 1: ilvl 21-22 HANDS ===
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
    // Phase 2: Planar Boots (Lv 11-20)
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
        // === PHASE 1: ilvl 21-22 FEET ===
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
    // Phase 2: Planar Rings (Lv 11-20)
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
        // === PHASE 1: ilvl 21-22 RING ===
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
    // Phase 2: Planar Amulets (Lv 11-20)
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
        // === PHASE 1: ilvl 21-22 AMULET ===
    { n: 'Astral Pendant',    ilvl: 21, int: 9, wis: 5, arcaneDmg: 7, voidDmg: 4, mpRegen: 3 },
    { n: 'Infernal Charm',    ilvl: 22, str: 7, fireDmg: 8, fireRes: 0.15, hpRegen: 3 },
  ]
};

function rollRarity(zoneLevel, luckBonus = 0) {
  const roll = Math.random() + luckBonus;
  const tier = Math.min(zoneLevel, 10);
  if (roll > 0.995 - (tier * 0.005)) return 'legendary';
  if (roll > 0.95 - (tier * 0.01))  return 'epic';
  if (roll > 0.80 - (tier * 0.015)) return 'rare';
  if (roll > 0.50 - (tier * 0.02))  return 'uncommon';
  return 'common';
}

function generateItem(slot, zoneLevel, forceRarity) {
  const table = LOOT_TABLES[slot === 'ring1' || slot === 'ring2' ? 'ring' : slot];
  if (!table) return null;

  // Find appropriate base item by ilvl
  const candidates = table.filter(i => i.ilvl <= zoneLevel + 2);
  const base = candidates.length > 0 
    ? candidates[Math.floor(Math.random() * candidates.length)]
    : table[0];

  const rarity = forceRarity || rollRarity(zoneLevel);
  const rarityData = ITEM_RARITY[rarity];

  const item = {
    n: base.n,
    slot: slot,
    r: rarity,
    ilvl: base.ilvl,
    d: base.d || 'A piece of adventuring gear.',
    ...base
  };

  // Apply rarity multiplier to core stats
  if (item.atk) item.atk = Math.floor(item.atk * rarityData.mult);
  if (item.def) item.def = Math.floor(item.def * rarityData.mult);

  // Roll for prefix
  if (Math.random() < rarityData.prefixChance) {
    const prefixes = Object.keys(ITEM_PREFIXES);
    const pName = prefixes[Math.floor(Math.random() * prefixes.length)];
    const pData = ITEM_PREFIXES[pName];
    item.prefix = pName;
    item.prefixData = pData;
    item.n = pName + ' ' + item.n;
    item[pData.stat] = (item[pData.stat] || 0) + pData.val;
  }

  // Roll for suffix
  if (Math.random() < rarityData.prefixChance * 0.7) {
    const suffixes = Object.keys(ITEM_SUFFIXES);
    const sName = suffixes[Math.floor(Math.random() * suffixes.length)];
    const sData = ITEM_SUFFIXES[sName];
    item.suffix = sName;
    item.suffixData = sData;
    item.n = item.n + ' ' + sName;
    item[sData.stat] = (item[sData.stat] || 0) + sData.val;
  }

  // Calculate sell value
  item.value = Math.floor((base.ilvl * 5 + (rarityData.mult * 10)) * (1 + Math.random() * 0.5));

  // Add sockets for Lv 20+ gear (Phase 2)
  const socketCount = getSocketCount(base.ilvl);
  if (socketCount > 0) {
    item.sockets = new Array(socketCount).fill(null);
    item.d += ' [' + socketCount + ' socket' + (socketCount > 1 ? 's' : '') + ']';
  }

  return item;
}

function getEquippedStats() {
  const stats = { atk: 0, def: 0, str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0,
                  fireDmg: 0, iceDmg: 0, lightDmg: 0, voidDmg: 0, arcaneDmg: 0,
                  fireRes: 0, iceRes: 0, lightRes: 0, voidRes: 0, arcaneRes: 0,
                  lifeSteal: 0, critChance: 0, mpRegen: 0, hpRegen: 0, goldFind: 0 };

  for (let slot in G.p.eq) {
    const item = G.p.eq[slot];
    if (!item) continue;
    for (let key in stats) {
      if (item[key]) stats[key] += item[key];
      if (item.socketStats && item.socketStats[key]) stats[key] += item.socketStats[key];
    }
  }
  return stats;
}

function getTotalAC() {
  const eqStats = getEquippedStats();
  const dexMod = DICE.abilityMod(G.p.stats.dex + eqStats.dex);
  let baseAC = 10 + dexMod;
  if (G.p.eq.armor) {
    baseAC = 10 + Math.min(dexMod, 2) + (G.p.eq.armor.def || 0);
  }
  baseAC += eqStats.def;
  const shieldBonus = G.p.buffs.reduce((s, b) => s + (b.def || 0), 0);
  return baseAC + shieldBonus;
}

function equipItem(invIndex) {
  const item = G.p.inv[invIndex];
  if (!item || !item.slot) return;

  const slot = item.slot;
  const slotKey = slot === 'ring' ? (G.p.eq.ring1 ? 'ring2' : 'ring1') : slot;

  // Unequip current
  const old = G.p.eq[slotKey];
  if (old) {
    addI(old);
    lg('Unequipped: ' + old.n);
  }

  // Equip new
  G.p.eq[slotKey] = { ...item };
  G.p.inv.splice(invIndex, 1);
  lg('Equipped: ' + item.n + ' (' + ITEM_RARITY[item.r].name + ')');

  // Recalculate derived stats
  const eqStats = getEquippedStats();
  G.p.mhp = 80 + (G.p.lvl - 1) * 10 + (eqStats.con * 2);
  G.p.mmp = 120 + (G.p.lvl - 1) * 15 + (eqStats.int * 2);
  G.p.hp = Math.min(G.p.hp, G.p.mhp);
  G.p.mp = Math.min(G.p.mp, G.p.mmp);
 checkDailyQuests('cast_spells', 1); 
  render();
}

function unequipItem(slot) {
  const item = G.p.eq[slot];
  if (!item) return;
  addI({ ...item });
  lg('Unequipped: ' + item.n);
  G.p.eq[slot] = null;

  // Recalculate
  const eqStats = getEquippedStats();
  G.p.mhp = 80 + (G.p.lvl - 1) * 10 + (eqStats.con * 2);
  G.p.mmp = 120 + (G.p.lvl - 1) * 15 + (eqStats.int * 2);
  G.p.hp = Math.min(G.p.hp, G.p.mhp);
  G.p.mp = Math.min(G.p.mp, G.p.mmp);

  render();
}

function equipPartyGear(memberName, invIndex) {
  const member = G.party.find(p => p.n === memberName);
  if (!member) return;
  if (member.gear) {
    lg('❌ ' + member.n + ' already has ' + member.gear.n + '! Unequip first.');
    return;
  }
  const item = G.p.inv[invIndex];
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
  // Apply stats
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
  const member = G.party.find(p => p.n === memberName);
  if (!member || !member.gear) return;
  const g = member.gear;
  // Remove stats
  if (g.hp) { member.mhp -= g.hp; member.hp = Math.min(member.mhp, member.hp - g.hp); }
  if (g.mp) { member.mmp -= g.mp; member.mp = Math.max(0, (member.mp || 0) - g.mp); }
  if (g.atk) member.atk -= g.atk;
  if (g.def) member.def -= g.def;
  if (g.spd) member.spd -= g.spd;
  // Return to inventory
  addI({ n: g.n, t: 'pgear', q: 1, for: memberName, atk: g.atk, def: g.def, hp: g.hp, mp: g.mp, spd: g.spd, d: g.d });
  lg('📦 Unequipped ' + g.n + ' from ' + member.n + '.');
  member.gear = null;
  render();
}


function addLootFromCombat(zoneName) {
  const zone = G.zones.find(z => z.n === zoneName);
  if (!zone) return;

  const slots = ['weapon', 'armor', 'head', 'hands', 'feet', 'ring', 'amulet'];
  const slot = slots[Math.floor(Math.random() * slots.length)];
  const item = generateItem(slot, zone.lv);

  if (item) {
    addI(item);
    lg('🎁 Loot: ' + item.n + ' (' + ITEM_RARITY[item.r].name + ')!');
  }
}

// ============================================================
