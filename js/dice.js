const DICE = {
  d(sides) { return Math.floor(Math.random() * sides) + 1; },
  
  roll(count, sides) {
    let sum = 0;
    for (let i = 0; i < count; i++) sum += this.d(sides);
    return sum;
  },
  
  parse(expr) {
    const match = expr.match(/^(\d+)d(\d+)(?:([+-])(\d+))?$/);
    if (!match) return { total: 0, rolls: [] };
    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const modifier = match[3] ? (match[3] === '+' ? 1 : -1) * parseInt(match[4]) : 0;
    const rolls = [];
    for (let i = 0; i < count; i++) rolls.push(this.d(sides));
    const total = rolls.reduce((a, b) => a + b, 0) + modifier;
    return { total, rolls, modifier, expr };
  },
  
  d20(type = 'normal') {
    if (type === 'advantage') {
      const r1 = this.d(20), r2 = this.d(20);
      return { roll: Math.max(r1, r2), rolls: [r1, r2], type, nat20: r1 === 20 || r2 === 20, nat1: r1 === 1 && r2 === 1 };
    }
    if (type === 'disadvantage') {
      const r1 = this.d(20), r2 = this.d(20);
      return { roll: Math.min(r1, r2), rolls: [r1, r2], type, nat20: r1 === 20 && r2 === 20, nat1: r1 === 1 || r2 === 1 };
    }
    const r = this.d(20);
    return { roll: r, rolls: [r], type, nat20: r === 20, nat1: r === 1 };
  },
  
  proficiencyBonus(level) { return Math.floor((level - 1) / 4) + 2; },
  abilityMod(score) { return Math.floor((score - 10) / 2); },
  
  attackRoll({ attackerLevel = 1, abilityScore = 10, proficiency = false, bonus = 0, targetAC = 10, advantage = 'normal' }) {
    const d20Result = this.d20(advantage);
    const profBonus = proficiency ? this.proficiencyBonus(attackerLevel) : 0;
    const abilityBonus = this.abilityMod(abilityScore);
    const total = d20Result.roll + profBonus + abilityBonus + bonus;
    const isCrit = d20Result.nat20;
    const isFumble = d20Result.nat1 && !d20Result.nat20;
    let hit = false;
    if (isCrit) hit = true;
    else if (isFumble) hit = false;
    else hit = total >= targetAC;
    return { d20: d20Result, profBonus, abilityBonus, bonus, total, targetAC, hit, isCrit, isFumble, margin: total - targetAC };
  },
  
  damageRoll({ diceExpr = '1d6', abilityScore = 10, isCrit = false, bonus = 0 }) {
    let parsed = this.parse(diceExpr);
    if (isCrit) {
      const match = diceExpr.match(/^(\d+)d(\d+)/);
      if (match) {
        const doubledExpr = diceExpr.replace(/^(\d+)/, m => parseInt(m) * 2);
        parsed = this.parse(doubledExpr);
      }
    }
    const abilityBonus = this.abilityMod(abilityScore);
    let total = parsed.total + abilityBonus + bonus;
    return { rolls: parsed.rolls, total: Math.max(0, total), isCrit, abilityBonus, bonus };
  },
  
  savingThrow({ abilityScore = 10, proficiency = false, level = 1, bonus = 0, dc = 10, advantage = 'normal' }) {
    const d20Result = this.d20(advantage);
    const profBonus = proficiency ? this.proficiencyBonus(level) : 0;
    const abilityBonus = this.abilityMod(abilityScore);
    const total = d20Result.roll + profBonus + abilityBonus + bonus;
    const success = d20Result.nat20 || (!d20Result.nat1 && total >= dc);
    return { d20: d20Result, profBonus, abilityBonus, total, dc, success, margin: total - dc };
  },
  
  deathSave() {
    const roll = this.d(20);
    if (roll === 20) return { roll, result: 'revive', hp: 1, flavor: "⚡ A surge of will! You cling to life with 1 HP!" };
    if (roll === 1) return { roll, result: 'double_fail', failures: 2, flavor: "💀 The darkness deepens... two steps closer to oblivion." };
    if (roll >= 10) return { roll, result: 'success', flavor: `🩹 You hold on... (${roll})` };
    return { roll, result: 'fail', flavor: `🕳️ The void pulls... (${roll})` };
  }
};

window.DICE = DICE;

// Backward compat wrappers
function rd(sides) { return DICE.d(sides); }
function rdc(count, sides) { return DICE.roll(count, sides); }
function r20() { return DICE.d20('normal').roll; }
function pd(ds, bonus) {
  if (!ds) return bonus || 0;
  const parsed = DICE.parse(ds);
  if (parsed.total === 0 && parsed.rolls.length === 0) return bonus || 0;
  return parsed.total + (bonus || 0);
}
