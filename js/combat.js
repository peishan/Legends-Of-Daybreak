// ============================================================
// COMBAT SYSTEM — Legends of Daybreak
// Extracted from index.html for modularity
// ============================================================

// === D&D Style Combat Functions ===

function getPlayerAC() {
  return getTotalAC();
}

function getEnemyAC(enemy) {
  return 10 + Math.floor((enemy.def || 0) / 2);
}

function getAttackAdvantage(attacker, target, isSpell = false) {
  let advantage = 'normal';
  let reasons = [];
  
  if (attacker === G.p && G.p.buffs.some(b => b.n === 'True Strike')) {
    advantage = 'advantage';
    reasons.push('True Strike');
  }
  
  if (isSpell && G.party.some(p => p.on && p.n === 'Senedra')) {
    if (Math.random() < 0.15) {
      advantage = 'advantage';
      reasons.push("Senedra's scouting");
    }
  }
  
  if (G.p.buffs.some(b => b.n === 'Blinded')) {
    advantage = 'disadvantage';
    reasons.push('Blinded');
  }
  
  if (target && target.n && target.n.includes('Frost') && Math.random() < 0.1) {
    if (advantage === 'normal') {
      advantage = 'disadvantage';
      reasons.push('Freezing fingers');
    }
  }
  
  return { advantage, reasons };
}

function getDamageFlavor(damage, isCrit) {
  if (isCrit) {
    if (damage >= 30) return '💥 DEVASTATING CRITICAL!';
    if (damage >= 20) return '💥 MASSIVE CRITICAL!';
    return '💥 CRITICAL!';
  }
  if (damage >= 25) return '💀 OBLITERATING!';
  if (damage >= 15) return '🔥 CRUSHING!';
  if (damage >= 10) return '⚔️ Solid hit!';
  if (damage >= 5) return '🎯 Good hit.';
  return '💨 Glancing blow.';
}

function trackBestiary(enemy) {
  if (!G.bestiary[enemy.n]) {
    G.bestiary[enemy.n] = {
      kills: 0,
      firstSeen: Date.now(),
      elem: enemy.elem || 'none',
      mhp: enemy.mhp,
      atk: enemy.atk,
      def: enemy.def
    };
  }
  G.bestiary[enemy.n].kills++;
  G.bestiary[enemy.n].lastSeen = Date.now();
}

function doPhysicalAttack(target) {
  const advInfo = getAttackAdvantage(G.p, target, false);
  const eqStats = getEquippedStats();
  const attackResult = DICE.attackRoll({
    attackerLevel: G.p.lvl,
    abilityScore: G.p.stats.str + eqStats.str,
    proficiency: false,
    bonus: Math.floor((G.p.eq.weapon?.atk || 0) / 2) + eqStats.atk,
    targetAC: getEnemyAC(target),
    advantage: advInfo.advantage
  });
  
  lg('🎲 Staff Swing: ' + attackResult.d20.roll + ' vs AC ' + attackResult.targetAC + ' = ' + (attackResult.hit ? 'HIT' : 'MISS'));
  
  if (!attackResult.hit) {
    if (attackResult.isFumble) lg('   💀 CRITICAL MISS! You stumble wildly!');
    else if (attackResult.margin >= -2) lg('   ❌ Close! The enemy deflects at the last moment.');
    else lg('   ❌ Solid defense. You\'ll need a better angle.');
    return false;
  }
  
  const damageResult = DICE.damageRoll({
    diceExpr: '1d4',
    abilityScore: G.p.stats.str,
    isCrit: attackResult.isCrit,
    bonus: G.p.eq.weapon ? Math.floor(G.p.eq.weapon.atk / 2) : 0
  });
  
  let finalDamage = Math.max(1, damageResult.total - Math.floor((target.def || 0) / 2));
  target.hp -= finalDamage;
  
  const dmgFlavor = getDamageFlavor(finalDamage, attackResult.isCrit);
  lg(dmgFlavor + ' Staff swing hits ' + target.n + ' for ' + finalDamage + '!');
  
  if (attackResult.isCrit) {
    lg('   🎲 ' + damageResult.breakdown);
  }
  
  if (target.hp <= 0) {
    target.hp = 0;
    lg('💀 ' + target.n + ' falls to your staff!');
    checkBountyKill(target.n);
    trackBestiary(target);
  }
  
  return true;
}

function doElizResurrect(member) {
  if (!member.resurrect) return false;
  if (member.resurrect.cooldown > 0) {
    member.resurrect.cooldown--;
    return false;
  }

  const deadMembers = G.party.filter(p => p.on && p.hp <= 0 && p.n !== 'Eliz');
  if (deadMembers.length === 0) return false;

  let target = deadMembers.find(p => p.n === 'San');
  if (!target) target = deadMembers[0];

  const healAmount = Math.floor(target.mhp * member.resurrect.healPct);
  target.hp = Math.max(1, healAmount);
  member.resurrect.cooldown = member.resurrect.maxCooldown;

  lg('💚 ' + member.n + ' casts ' + member.resurrect.name + '!');
  lg('✨ ' + (target.n === 'San' ? 'You' : target.n) + ' are revived with ' + target.hp + ' HP!');

  return true;
}

function doElizPassiveHeal(eliz) {
  if (eliz.passiveHealCooldown === undefined) {
    eliz.passiveHealCooldown = 0;
  }
  
  if (eliz.passiveHealCooldown > 0) {
    eliz.passiveHealCooldown--;
    return false;
  }
  
  const allies = [{n: 'San', hp: G.p.hp, mhp: G.p.mhp, mp: G.p.mp, mmp: G.p.mmp, isPlayer: true}];
  for (let p of G.party) {
    if (p.on && p.hp > 0 && p.n !== 'Eliz') {
      allies.push({n: p.n, hp: p.hp, mhp: p.mhp, isPlayer: false, ref: p});
    }
  }
  
  const wounded = allies.filter(a => (a.hp / a.mhp) < 0.85);
  const sanNeedsMp = (G.p.mp / G.p.mmp) < 0.40;
  
  if (wounded.length === 0 && !sanNeedsMp) return false;
  
  const synergyBonus = getSynergyHealBonus();
  let didSomething = false;
  
  if (wounded.length > 0) {
    for (let ally of wounded) {
      let healBase = Math.floor(ally.mhp * 0.10);
      let healAmount = Math.floor(healBase * (1 + synergyBonus));
      
      if (ally.isPlayer) {
        const oldHp = G.p.hp;
        G.p.hp = Math.min(G.p.mhp, G.p.hp + healAmount);
        if (G.p.hp > oldHp) didSomething = true;
      } else {
        const oldHp = ally.ref.hp;
        ally.ref.hp = Math.min(ally.ref.mhp, ally.ref.hp + healAmount);
        if (ally.ref.hp > oldHp) didSomething = true;
      }
    }
    if (didSomething) {
      lg('💚 Eliz channels Gentle Pulse! All wounded allies regain HP.');
    }
  }
  
  if (sanNeedsMp) {
    let mpBase = Math.floor(G.p.mmp * 0.12);
    let mpAmount = Math.floor(mpBase * (1 + synergyBonus));
    const oldMp = G.p.mp;
    G.p.mp = Math.min(G.p.mmp, G.p.mp + mpAmount);
    if (G.p.mp > oldMp) {
      lg('💧 Eliz weaves mana threads! You restore ' + (G.p.mp - oldMp) + ' MP.');
      didSomething = true;
    }
  }
  
  if (!didSomething) return false;
  
  eliz.passiveHealCooldown = 3;
  updateAffinity('Eliz', 1);
  return true;
}

function doPartyAttack(member) {
  if (member.n === 'Eliz' && member.hp > 0) {
    if (doElizResurrect(member)) return;
    if (doElizPassiveHeal(member)) return;
  }
  
  const aliveEnemies = G.cbt.en.filter(e => e.hp > 0);
  if (aliveEnemies.length === 0) return;
  
  const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
  const gearAtk = member.gear ? (member.gear.atk || 0) : 0;
  const gearSpd = member.gear ? (member.gear.spd || 0) : 0;
  const effectiveAtk = member.atk + gearAtk;
  const effectiveSpd = member.spd + gearSpd;
  const abilityScore = member.r === 'Rogue' || member.r === 'Ranger' 
    ? effectiveSpd * 2 : effectiveAtk * 2;
  
  const attackResult = DICE.attackRoll({
    attackerLevel: G.p.lvl,
    abilityScore: abilityScore,
    proficiency: true,
    bonus: 0,
    targetAC: getEnemyAC(target),
    advantage: 'normal'
  });
  
  if (!attackResult.hit) {
    lg('❌ ' + member.n + ' misses ' + target.n + ' (' + attackResult.d20.roll + ')');
    return;
  }
  
  const damageResult = DICE.damageRoll({
    diceExpr: '1d6',
    abilityScore: abilityScore,
    isCrit: attackResult.isCrit
  });
  
  let finalDamage = Math.max(1, damageResult.total - Math.floor((target.def || 0) / 3));
  target.hp -= finalDamage;
  
  const critTag = attackResult.isCrit ? ' 💥CRIT' : '';
  lg('⚔️ ' + member.n + ' hits ' + target.n + ' for ' + finalDamage + critTag);
  
  if (target.hp <= 0) {
    target.hp = 0;
    lg('💀 ' + target.n + ' falls!');
    checkBountyKill(target.n);
    trackBestiary(target);
  }
}

function doEnemyAttack(enemy) {
  if (enemy.hp <= 0) return;
  
  if (enemy.status && enemy.status.length > 0) {
    for (let s of enemy.status) {
      if (s.type === 'burn' && s.dmg) {
        enemy.hp -= s.dmg;
        lg('🔥 ' + enemy.n + ' takes ' + s.dmg + ' burn damage!');
      }
      if (s.type === 'poison' && s.dmg) {
        enemy.hp -= s.dmg;
        lg('☠️ ' + enemy.n + ' takes ' + s.dmg + ' poison damage!');
      }
      if (s.type === 'shock') {
        lg('⚡ ' + enemy.n + ' is shocked and skips this turn!');
      }
      s.turns--;
    }
    enemy.status = enemy.status.filter(s => s.turns > 0);
    
    if (enemy.hp <= 0) {
      enemy.hp = 0;
      lg('💀 ' + enemy.n + ' falls to status damage!');
      checkBountyKill(enemy.n);
      trackBestiary(enemy.n);
      return;
    }
    if (enemy.status.find(s => s.type === 'shock')) return;
  }
  
  let target = G.p;
  if (Math.random() > 0.5) {
    const activeParty = G.party.filter(p => p.on && p.hp > 0);
    if (activeParty.length > 0) {
      target = activeParty[Math.floor(Math.random() * activeParty.length)];
    }
  }

  const joel = G.party.find(p => p.on && p.n === 'Joel' && p.hp > 0 && p.r === 'Tank');
  const joelTaunt = hasAffinityUnlock('Joel', 'shield_oath') ? 0.70 : 0.40;
  if (joel && target !== joel && Math.random() < joelTaunt) {
    lg('🛡️ Joel taunts ' + enemy.n + '! The attack is drawn to his shield!');
    target = joel;
  }
  
  if (target === G.p && G.p.hp / G.p.mhp <= 0.30 && joel && joel.hp > 0) {
    if (!G.joelShieldCooldown) G.joelShieldCooldown = 0;
    if (G.joelShieldCooldown <= 0 && Math.random() < 0.40) {
      G.joelShieldCooldown = 5;
      lg('🛡️ SHIELD WALL! Joel dives in front of San!');
      target = joel;
    }
  }
  if (G.joelShieldCooldown > 0) G.joelShieldCooldown--;
    
  const gearDef = target.gear ? (target.gear.def || 0) : 0;
  const targetAC = target === G.p ? getPlayerAC() : 10 + Math.floor(((target.def || 0) + gearDef + getBlessDef(target)) / 2);
  const attackResult = DICE.attackRoll({
    attackerLevel: G.zones.find(z => z.en.includes(enemy.n))?.lv || 1,
    abilityScore: enemy.atk * 2,
    proficiency: true,
    bonus: 0,
    targetAC: targetAC,
    advantage: 'normal'
  });
  
  if (!attackResult.hit) {
    lg('❌ ' + enemy.n + ' misses ' + (target.n || 'you') + '!');
    return;
  }
  
  const damageResult = DICE.damageRoll({
    diceExpr: '1d6',
    abilityScore: enemy.atk * 2,
    isCrit: attackResult.isCrit
  });
  
  let finalDamage = damageResult.total;
  const targetGearDef = target.gear ? (target.gear.def || 0) : 0;
  const targetDef = target === G.p 
    ? (G.p.eq.armor ? G.p.eq.armor.def : 0) + G.p.buffs.reduce((s, b) => s + (b.def || 0), 0)
    : (target.def || 0) + targetGearDef + getBlessDef(target);

  finalDamage = Math.max(1, finalDamage - Math.floor(targetDef / 2));
  finalDamage = applySynergyDefense(finalDamage);
  
  target.hp -= finalDamage;
  
  const critTag = attackResult.isCrit ? ' 💥CRIT' : '';
  lg('🗡️ ' + enemy.n + ' hits ' + (target.n || 'you') + ' for ' + finalDamage + critTag);
  
  if (target.hp <= 0) {
    if (target !== G.p && target.passive === 'guardian_spirit') {
      target.hp = 1;
      lg('✨ ' + target.n + "'s Guardian Spirit shines! She endures at 1 HP!");
    } else if (target !== G.p && target.n === 'Soel') {
      target.hp = 1;
      lg('🔥 Soel flickers like a spirit flame! He reforms at 1 HP!');
    } else if (target !== G.p && target.n === 'Joel' && hasAffinityUnlock('Joel', 'unbreakable') && !G.joelReviveUsed) {
      G.joelReviveUsed = true;
      target.hp = Math.floor(target.mhp * 0.5);
      lg('💜 UNBREAKABLE! Joel refuses to fall — he rises again at ' + target.hp + ' HP! (Once per rest)');
    } else {
      target.hp = 0;
      lg('💀 ' + (target.n || 'You') + ' fall unconscious!');
    }
  }
}

function handleBossMechanics() {
  for (let e of G.cbt.en) {
    if (e.hp <= 0 || !e.mechanic) continue;
    
    G.cbt.turn = G.cbt.turn || 0;
    
    switch (e.mechanic) {
      case 'rampage':
        if (G.cbt.turn >= e.rampageTurn) {
          lg('🔥 ' + e.n + ' ENRAGES! All party members take ' + e.rampageDmg + ' damage!');
          G.p.hp = Math.max(1, G.p.hp - e.rampageDmg);
          for (let p of G.party) { if (p.on) p.hp = Math.max(1, p.hp - e.rampageDmg); }
        }
        break;
      case 'resurrect':
        if (e.hp <= 0 && e.resurrectCount > 0) {
          e.resurrectCount--;
          e.hp = Math.floor(e.mhp * 0.5);
          lg('💀 ' + e.n + ' RESURRECTS! HP restored to ' + e.hp + '! (' + e.resurrectCount + ' lives left)');
        }
        break;
      case 'phase':
        const phaseThreshold = e.mhp - (e.currentPhase * e.phaseHp);
        if (e.hp <= phaseThreshold && e.currentPhase < e.phases) {
          e.currentPhase++;
          lg('💎 ' + e.n + ' shifts to PHASE ' + e.currentPhase + '! Defenses change!');
          e.def += 3;
          e.atk += 2;
        }
        break;
      case 'inferno':
        if (G.cbt.turn >= e.infernoTurn) {
          lg('🔥 ' + e.n + ' unleashes INFERNO! Party takes ' + e.infernoDmg + ' damage!');
          G.p.hp = Math.max(1, G.p.hp - e.infernoDmg);
          for (let p of G.party) { if (p.on) p.hp = Math.max(1, p.hp - e.infernoDmg); }
        }
        break;
      case 'lightning_rod':
        if (G.cbt.turn > 0 && G.cbt.turn % e.rodTurns === 0) {
          const targets = [G.p, ...G.party.filter(p => p.on && p.hp > 0)];
          const weakest = targets.reduce((a, b) => (a.hp / (a.mhp || a.hp)) < (b.hp / (b.mhp || b.hp)) ? a : b);
          const rodDmg = Math.floor(e.atk * 1.5);
          weakest.hp = Math.max(1, weakest.hp - rodDmg);
          lg('⚡ Lightning strikes ' + (weakest.n || 'you') + ' for ' + rodDmg + '!');
        }
        break;
      case 'freeze':
        if (Math.random() < e.freezeChance) {
          const targets = [G.p, ...G.party.filter(p => p.on && p.hp > 0)];
          const target = targets[Math.floor(Math.random() * targets.length)];
          target.frozen = true;
          lg('❄️ ' + e.n + ' freezes ' + (target.n || 'you') + '! Skip next turn!');
        }
        break;
      case 'devour':
        if (G.cbt.turn >= e.devourTurn) {
          const targets = G.party.filter(p => p.on && p.hp > 0);
          if (targets.length > 0) {
            const victim = targets[Math.floor(Math.random() * targets.length)];
            const saveResult = DICE.savingThrow({
              abilityScore: victim.spd * 2,
              proficiency: false,
              level: G.p.lvl,
              dc: 15
            });
            lg('🌑 ' + e.n + ' attempts to DEVOUR ' + victim.n + '!');
            lg('   ' + victim.n + ' rolls ' + saveResult.d20.roll + ' vs DC ' + saveResult.dc + ' = ' + (saveResult.success ? 'SAVED!' : 'FAILED!'));
            
            if (!saveResult.success) {
              if (victim.passive === 'guardian_spirit') {
                victim.hp = 1;
                lg('✨ ' + victim.n + "'s Guardian Spirit shines! She endures the devouring!");
              } else if (victim.n === 'Soel') {
                victim.hp = 1;
                lg('🔥 Soel flickers like a spirit flame! He reforms from the devour!');
              } else {
                victim.hp = 0;
                lg('💀 ' + victim.n + ' has been devoured!');
              }
            } else {
              lg('✨ ' + victim.n + ' narrowly escapes the maw!');
            }
          }
        }
        break;
      case 'apocalypse':
        if (G.cbt.turn >= e.apocalypseTurn) {
          lg('💥 ' + e.n + ' uses APOCALYPSE! Total party wipe!');
          G.p.hp = 1;
          for (let p of G.party) { if (p.on) p.hp = 0; }
        }
        break;
      case 'planar_shift':
        if (G.cbt.turn > 0 && G.cbt.turn % e.shiftTurn === 0 && e.currentPhase < e.phases) {
          e.currentPhase++;
          const phases = ['Arcane', 'Void', 'Temporal', 'Aether', 'Primordial'];
          const phaseName = phases[e.currentPhase - 1] || 'Unknown';
          lg('🌌 ' + e.n + ' shifts to the ' + phaseName + ' DIMENSION! Phase ' + e.currentPhase + '/' + e.phases);
          if (e.currentPhase === 2) {
            lg('   🌑 Void tendrils reach for your mind...');
            G.p.mp = Math.max(0, G.p.mp - 15);
            for (let p of G.party) { if (p.on) p.mp = Math.max(0, p.mp - 10); }
            lg('   💧 Party loses MP to the void!');
          } else if (e.currentPhase === 3) {
            const healAmt = Math.floor(e.mhp * 0.1);
            e.hp = Math.min(e.mhp, e.hp + healAmt);
            lg('   ⏳ Time rewinds! ' + e.n + ' regains ' + healAmt + ' HP!');
          } else if (e.currentPhase === 4) {
            e.atk += 5;
            lg('   ✨ Aether surges! ' + e.n + ' attack rises to ' + e.atk + '!');
          } else if (e.currentPhase === 5) {
            lg('   🔥 PRIMORDIAL ERUPTION! Raw planar energy tears through reality!');
            const primordialDmg = 25;
            G.p.hp = Math.max(1, G.p.hp - primordialDmg);
            for (let p of G.party) { 
              if (p.on) {
                if (p.passive === 'guardian_spirit') {
                  p.hp = Math.max(1, p.hp - primordialDmg);
                  if (p.hp === 1) lg('✨ ' + p.n + "'s Guardian Spirit endures the planar storm!");
                } else if (p.n === 'Soel') {
                  p.hp = 1;
                  lg('🔥 Soel flickers through the planar tear — unkillable!');
                } else {
                  p.hp = Math.max(0, p.hp - primordialDmg);
                }
              }
            }
            lg('   💥 All take ' + primordialDmg + ' primordial damage!');
          }
          if (e.currentPhase < e.phases) {
            const riftMinion = { n: 'Planar Rift', hp: 80, mhp: 80, atk: 15, def: 5, xp: 50, g: 30, elem: 'arcane', id: G.cbt.en.length, status: [] };
            G.cbt.en.push(riftMinion);
            lg('   🌀 A Planar Rift opens! A minion emerges!');
          }
        }
        break;
      case 'nexus_planarch':
        if (G.cbt.turn > 0 && G.cbt.turn % e.shiftTurn === 0 && e.currentPhase < e.phases) {
          e.currentPhase++;
          e.atk += 8;
          e.def += 5;
          const nexusPhases = ['ARCANE', 'FIRE', 'ICE', 'LIGHTNING', 'VOID'];
          const phaseName = nexusPhases[e.currentPhase - 1] || 'UNKNOWN';
          const phaseElem = ['arcane', 'fire', 'ice', 'lightning', 'void'][e.currentPhase - 1] || 'arcane';
          e.elem = phaseElem;
          lg('🌌 ═══════════════════════════════════════');
          lg('🌌 THE NEXUS PLANARCH SHIFTS TO ' + phaseName + '!');
          lg('🌌 ═══════════════════════════════════════');
          lg('   Phase ' + e.currentPhase + '/5 | ATK: ' + e.atk + ' | DEF: ' + e.def + ' | Element: ' + phaseElem.toUpperCase());

          if (e.currentPhase === 2) {
            lg('   🔥 INFERNO AURA: All take 15 fire damage!');
            const fireDmg = 15;
            G.p.hp = Math.max(1, G.p.hp - fireDmg);
            for (let p of G.party) { if (p.on) p.hp = Math.max(1, p.hp - fireDmg); }
            lg('   The dimension burns...');
          } else if (e.currentPhase === 3) {
            lg('   ❄️ GLACIAL PRISON: Freezing a random target!');
            const targets = [G.p, ...G.party.filter(p => p.on && p.hp > 0)];
            const victim = targets[Math.floor(Math.random() * targets.length)];
            victim.frozen = true;
            lg('   ' + (victim.n || victim.name) + ' is frozen solid! Skip next turn!');
          } else if (e.currentPhase === 4) {
            lg('   ⚡ CHAIN LIGHTNING: Striking two targets!');
            const targets = [G.p, ...G.party.filter(p => p.on && p.hp > 0)];
            if (targets.length > 0) {
              const t1 = targets[Math.floor(Math.random() * targets.length)];
              let t2 = targets[Math.floor(Math.random() * targets.length)];
              while (targets.length > 1 && t2 === t1) t2 = targets[Math.floor(Math.random() * targets.length)];
              const lightningDmg = 20;
              t1.hp = Math.max(1, t1.hp - lightningDmg);
              t2.hp = Math.max(1, t2.hp - lightningDmg);
              lg('   ⚡ ' + (t1.n || t1.name) + ' and ' + (t2.n || t2.name) + ' take ' + lightningDmg + ' lightning damage!');
            }
          } else if (e.currentPhase === 5) {
            lg('   🌑 REALITY COLLAPSE: The void hungers for everything!');
            const voidDmg = 30;
            G.p.hp = Math.max(1, G.p.hp - voidDmg);
            for (let p of G.party) {
              if (p.on) {
                if (p.passive === 'guardian_spirit') {
                  p.hp = Math.max(1, p.hp - voidDmg);
                  if (p.hp === 1) lg('✨ ' + p.n + "'s Guardian Spirit holds against the void!");
                } else if (p.n === 'Soel') {
                  p.hp = 1;
                  lg('🔥 Soel phases through the collapse — unkillable!');
                } else {
                  p.hp = Math.max(1, p.hp - voidDmg);
                }
              }
            }
            lg('   💥 All take ' + voidDmg + ' void damage! The end approaches...');
          }

          const minionNames = ['Nexus Shard', 'Planar Construct', 'Reality Fragment', 'Dimensional Echo', 'Void Remnant'];
          const minionHp = [120, 150, 180, 220, 280];
          const minionAtk = [18, 22, 26, 30, 35];
          const idx = Math.min(e.currentPhase - 1, 4);
          const minion = {
            n: minionNames[idx],
            hp: minionHp[idx], mhp: minionHp[idx],
            atk: minionAtk[idx], def: 8 + (idx * 3),
            xp: 100 + (idx * 50), g: 80 + (idx * 40),
            elem: phaseElem,
            id: G.cbt.en.length,
            status: []
          };
          G.cbt.en.push(minion);
          lg('   🌀 ' + minion.n + ' manifests! (' + minion.hp + ' HP)');

          if (e.currentPhase === 5) {
            lg('   🌑 THE PLANARCH HAS REVEALED ITS TRUE FORM!');
            lg('   Survive the void. End the rift. Choose your reality.');
          }
        }
        break;
      case 'reality_weave':
        if (G.cbt.turn > 0 && G.cbt.turn % e.weaveTurn === 0) {
          e.currentPhase++;
          lg('🌌 ' + e.n + ' weaves a new dimension! Phase ' + e.currentPhase + '!');
          const echo = {
            n: 'Veil Echo',
            hp: 400, mhp: 400, atk: 20, def: 10,
            xp: 100, g: 50, elem: 'arcane',
            id: G.cbt.en.length, status: []
          };
          G.cbt.en.push(echo);
          lg('   👤 A Veil Echo manifests!');
          e.atk += 3;
          e.def += 2;
          lg('   ⚡ ' + e.n + ' grows stronger! ATK: ' + e.atk + ' DEF: ' + e.def);
        }
        break;
      case 'astral_phase':
        if (G.cbt.turn > 0 && G.cbt.turn % e.shiftTurn === 0 && e.currentPhase < e.phases) {
          e.currentPhase++;
          const astralPhases = ['MATERIAL', 'ASTRAL', 'VOID', 'PRIMORDIAL'];
          const phaseName = astralPhases[e.currentPhase - 1] || 'UNKNOWN';
          lg('🌌 ' + e.n + ' shifts to the ' + phaseName + ' PHASE! Phase ' + e.currentPhase + '/' + e.phases);
          if (e.currentPhase === 2) {
            e.atk += 5; e.def += 3;
            lg('   ✨ Astral surge! ATK +' + 5 + ', DEF +' + 3);
          } else if (e.currentPhase === 3) {
            lg('   🌑 Void tendrils drain party MP!');
            G.p.mp = Math.max(0, G.p.mp - 20);
            for (let p of G.party) { if (p.on) p.mp = Math.max(0, p.mp - 15); }
          } else if (e.currentPhase === 4) {
            lg('   🔥 PRIMORDIAL ERUPTION! All take 30 damage!');
            G.p.hp = Math.max(1, G.p.hp - 30);
            for (let p of G.party) { if (p.on) p.hp = Math.max(1, p.hp - 30); }
          }
          if (e.currentPhase < e.phases) {
            const riftMinion = { n: 'Astral Echo', hp: 100, mhp: 100, atk: 18, def: 6, xp: 60, g: 40, elem: 'arcane', id: G.cbt.en.length, status: [] };
            G.cbt.en.push(riftMinion);
            lg('   🌀 An Astral Echo manifests!');
          }
        }
        break;
      case 'inferno_core':
        if (G.cbt.turn >= e.infernoTurn) {
          lg('🔥 ' + e.n + ' unleashes INFERNO CORE! Party takes ' + e.infernoDmg + ' fire damage!');
          G.p.hp = Math.max(1, G.p.hp - e.infernoDmg);
          for (let p of G.party) { if (p.on) p.hp = Math.max(1, p.hp - e.infernoDmg); }
        }
        if (Math.random() < 0.10) {
          const targets = [G.p, ...G.party.filter(p => p.on && p.hp > 0)];
          const victim = targets[Math.floor(Math.random() * targets.length)];
          if (!victim.status) victim.status = [];
          victim.status.push({ type: 'burn', dmg: 8, turns: 3, chance: 1.0 });
          lg('   🔥 ' + (victim.n || 'You') + ' is ignited by the Infernal Tyrant\'s aura!');
        }
        break;
    }
  }        
}

function handleZoneHazards() {
  if (!G.cbt.on || G.cbt.en.length === 0 || !G.cbt.en.some(e => e.hp > 0)) return;
  
  const zone = G.zones.find(z => z.en.includes(G.cbt.en[0]?.n));
  if (!zone || !G.zoneHazards[zone.n]) return;
  
  const hazard = G.zoneHazards[zone.n];
  if (Math.random() >= hazard.chance) return;
  
  lg('🌋 HAZARD: ' + hazard.msg);
  
  switch (hazard.type) {
    case 'damage':
      const saveResult = DICE.savingThrow({
        abilityScore: G.p.stats.con,
        proficiency: false,
        level: G.p.lvl,
        dc: 12
      });
      
      let hazardDmg = hazard.dmg;
      if (saveResult.success) {
        hazardDmg = Math.floor(hazardDmg / 2);
        lg('   🛡️ You dive for cover! Half damage!');
      }
      
      G.p.hp = Math.max(1, G.p.hp - hazardDmg);
      lg('   🔥 ' + G.p.name + ' takes ' + hazardDmg + ' ' + hazard.elem + ' damage!');
      
      for (let p of G.party) {
        if (p.on && p.hp > 0) {
          const partySave = DICE.savingThrow({
            abilityScore: p.con || 10,
            proficiency: false,
            level: G.p.lvl,
            dc: 12
          });
          let partyDmg = hazard.dmg;
          if (partySave.success) partyDmg = Math.floor(partyDmg / 2);
          p.hp = Math.max(1, p.hp - partyDmg);
          lg('   🔥 ' + p.n + ' takes ' + partyDmg + ' ' + hazard.elem + ' damage!');
        }
      }
      break;
    case 'freeze':
      const targets = [G.p, ...G.party.filter(p => p.on && p.hp > 0)];
      const target = targets[Math.floor(Math.random() * targets.length)];
      target.frozen = true;
      lg('   ❄️ ' + (target.n || target.name) + ' is frozen by the ' + hazard.name + '! Skip next turn!');
      break;
    case 'mana_drain':
      G.p.mp = Math.max(0, G.p.mp - hazard.drain);
      lg('   🌑 ' + G.p.name + ' loses ' + hazard.drain + ' MP to void corruption!');
      break;
  }
}

function finishPlayerTurn() {
  const eliz = G.party.find(p => p.on && p.n === 'Eliz');
  if (eliz && eliz.resurrect && eliz.resurrect.cooldown > 0) {
    eliz.resurrect.cooldown--;
  }

  for (let p of G.party) {
    if (p.on && p.hp > 0) doPartyAttack(p);
  }
  
  eturn();
  
  if (G.p.hp <= 1 && G.p.hp > 0) {
    G.cbt.autoFlee = true;
  }
  
  if (G.cbt.en.every(e => e.hp <= 0)) {
    handleVictory();
    return;
  }
  
  if (G.p.hp <= 0) {
    handleDefeat();
    return;
  }
  
  G.cbt.turn++;
  render();
}

function handleVictory() {
  clearZoneBuffs();

  const txp = G.cbt.en.reduce((s, e) => s + e.xp, 0);
  let tg2 = G.cbt.en.reduce((s, e) => s + e.g, 0);
  
  if (G.party[1].on) tg2 = Math.floor(tg2 * 1.2);
  const goldBonus = getSynergyGoldBonus();
  if (goldBonus > 0) {
    tg2 = Math.floor(tg2 * (1 + goldBonus));
    lg('💰 Synergy bonus: +' + Math.floor(goldBonus * 100) + '% gold!');
  }
  
  G.p.xp += txp;
  G.p.gold += tg2;
  checkDailyQuests('earn_gold', tg2);
  G.p.kills += G.cbt.en.length;
  checkDailyQuests('kill', G.cbt.en.length);
  if (G.party.filter(p => p.on).length >= 3) checkDailyQuests('full_party_battle', 1);
  if (G.currentBoss) { G.p.bossKills = (G.p.bossKills || 0) + 1; }
  
  for (let entry of G.storyJournal.entries) {
    if (entry.unlockType === 'boss' && G.currentBoss && G.currentBoss.n === entry.unlockAt && !G.storyJournal.unlocked.includes(entry.id)) {
      G.storyJournal.unlocked.push(entry.id);
      lg('📖 Journal unlocked: ' + entry.title + '!');
    }
  }
  
  if (G.currentBoss && G.currentBoss.n === 'The Planarch') {
    lg('🏆 You have conquered the Arcane Planar Tower!');
    lg('   The spire bends to your will. Planar energy surges through your veins.');
  }
  if (G.p.hp === 1) { G.p.survivedCritical = true; }
  checkAchievements();
  
  lg('🎉 VICTORY! +' + txp + ' XP, +' + tg2 + ' Gold!');
  triggerSoelCommentary('combat_win');
  
  const aisyahQuest = G.quests.find(q => q.t === 'aisyah_battle' && !q.done);
  if (aisyahQuest && G.party.find(p => p.on && p.n === 'Aisyah')) {
    aisyahQuest.c += G.cbt.en.length;
    if (aisyahQuest.c >= aisyahQuest.need) checkQ();
    for (let entry of G.storyJournal.entries) {
      if (entry.unlockType === 'level' && G.p.lvl >= entry.unlockAt && !G.storyJournal.unlocked.includes(entry.id)) {
        G.storyJournal.unlocked.push(entry.id);
        lg('📖 Journal unlocked: ' + entry.title + '!');
      }
    }
  }
  
  const joelQuest = G.quests.find(q => q.t === 'joel_battle' && !q.done);
  if (joelQuest && G.party.find(p => p.on && p.n === 'Joel')) {
    joelQuest.c += G.cbt.en.length;
    if (joelQuest.c >= joelQuest.need) checkQ();
  }

  for (let q of G.quests) {
    if (q.done) continue;
    if (q.hidden && !q.revealed) continue;
    if (q.t === 'kill_specific') {
      const killedInThisFight = G.cbt.en.filter(e => e.hp <= 0 && e.n === q.target).length;
      if (killedInThisFight > 0) {
        q.c += killedInThisFight;
        lg('📜 ' + q.n + ': ' + q.c + '/' + q.need + ' ' + q.target + ' defeated');
        if (q.c >= q.need) checkQ();
      }
    }
    if (q.t === 'boss_specific' && G.currentBoss && G.currentBoss.n === q.target) {
      q.c++;
      lg('📜 ' + q.n + ': ' + q.c + '/' + q.need + ' ' + q.target + ' defeated');
      if (q.c >= q.need) checkQ();
    }
  }

  for (let q of G.quests) {
    if (q.done) continue;
    if (q.hidden && !q.revealed) continue;
    if (q.t === 'reach_level' && G.p.lvl >= q.need) {
      q.c = q.need;
      checkQ();
    }
  }

  for (let p of G.party) {
    if (p.on && p.hp > 0) updateAffinity(p.n, 1);
  }
  
  const z = G.zones.find(z => z.en.includes(G.cbt.en[0]?.n));
  if (z) {
    const l = z.loot[Math.floor(Math.random() * z.loot.length)];
    addI({ n: l, t: 'mat', q: 1, r: 'common' });
    lg('🎁 Found: ' + l);

    if (Math.random() < 0.5) {
      addLootFromCombat(z.n);
    }
    
    addRuneLoot(z.n);

    const campSite = G.rest.sites.find(s => s.zone === z.n && s.type === 'camp');
    const tavernSite = G.rest.sites.find(s => s.zone === z.n && s.type === 'tavern');
    if (campSite && !campSite.unlocked) {
      campSite.unlocked = true;
      lg('🏕️ Campsite discovered in ' + z.n + '!');
    }
    if (tavernSite && !tavernSite.unlocked && G.p.lvl >= tavernSite.zoneLv) {
      tavernSite.unlocked = true;
      lg('🍺 Tavern discovered: ' + tavernSite.name + '!');
    }
  }
  
  lvlup();
  checkQ();
  
  G.currentBoss = null;
  G.cbt.autoCombat = false;
  G.cbt.on = false;
  G.state = 'explore';
  render();
}

function handleDefeat() {
  clearZoneBuffs();

  if (checkSecondWind()) { render(); return; }
  lg('💀 You have fallen! Rolling death saves...');
  
  let successes = 0;
  let failures = 0;
  
  while (successes < 3 && failures < 3) {
    const deathResult = DICE.deathSave();
    lg('   ' + deathResult.flavor);
    
    if (deathResult.result === 'revive') {
      G.p.hp = 1;
      lg('⚡ MIRACLE! You spring back to life with 1 HP!');
      G.cbt.on = false;
      G.state = 'menu';
      render();
      return;
    }
    
    if (deathResult.result === 'success') successes++;
    else if (deathResult.result === 'fail') failures++;
    else if (deathResult.result === 'double_fail') failures += 2;
  }
  
  if (failures >= 3) {
    lg('💀 The darkness claims you...');
    lg('   (You retreat with 1 HP. Rest to recover.)');
  } else {
    lg('🩹 You stabilize at 1 HP, unconscious but alive.');
  }
  
  G.p.hp = 1;
  for (let p of G.party) {
    if (p.hp <= 0) {
      p.hp = 1;
      p.on = true;
    }
  }
  
  G.cbt.autoCombat = false;
  G.cbt.on = false;
  G.state = 'menu';
  render();
}

function pa(si, ti) {
  const isBasicAttack = si === -1;
  const sk = isBasicAttack 
    ? { n: 'Staff Swing', c: 0, dmg: '1d4', elem: 'none', buff: false } 
    : G.p.skills[si];
  const tg = G.cbt.en[ti];
  
  if (!tg || tg.hp <= 0) return;
  
  const riftMpMult = (G.currentRift === 'time') ? 2 : 1;
  const talentMpMult = getTalentMultiplier('mpCost');
  const actualCost = Math.floor(sk.c * riftMpMult * talentMpMult);
  if (G.p.mp < actualCost) {
    lg('💨 Not enough MP! San swings their staff instead!');
    doPhysicalAttack(tg);
    finishPlayerTurn();
    return;
  }
  
  G.p.mp -= actualCost;
  
  if (sk.buff) {
    if (sk.n === 'Frost Shield') {
      G.p.buffs.push({ n: 'Frost Shield', t: 3, def: 5 });
      lg('🛡️ Frost Shield! AC +5 for 3 turns.');
    } else if (sk.n === 'Mana Surge') {
      G.p.mp = Math.min(G.p.mmp, G.p.mp + 20);
      lg('💧 Mana Surge! Restored 20 MP.');
    }
    finishPlayerTurn();
    return;
  }
  
  if (isImmune(tg.n, sk.elem)) {
    lg('🛡️ ' + sk.n + ' has no effect — ' + tg.n + ' is immune to ' + sk.elem + '!');
    finishPlayerTurn();
    return;
  }
  
  const advInfo = getAttackAdvantage(G.p, tg, true);
  const eqStats2 = getEquippedStats();
  const senedraBonus = G.party.some(p => p.on && p.n === 'Senedra' && p.hp > 0) ? 2 : 0;
  const attackResult = DICE.attackRoll({
    attackerLevel: G.p.lvl,
    abilityScore: G.p.stats.int + eqStats2.int,
    proficiency: true,
    bonus: Math.floor((G.p.eq.weapon?.atk || 0) / 2) + eqStats2.atk + senedraBonus,
    targetAC: getEnemyAC(tg),
    advantage: advInfo.advantage
  });
  
  lg('🎲 ' + sk.n + ': ' + attackResult.d20.roll + ' vs AC ' + attackResult.targetAC + ' = ' + (attackResult.hit ? 'HIT' : 'MISS'));
  
  if (advInfo.reasons.length > 0) {
    lg('   (' + advInfo.reasons.join(', ') + ')');
  }
  
  if (attackResult.isCrit) lg('   💥 CRITICAL HIT! The gods guide your hand!');
  else if (attackResult.isFumble) lg('   💀 CRITICAL MISS! Disaster!');
  else if (!attackResult.hit) {
    if (attackResult.margin >= -2) lg('   ❌ Close! The enemy deflects at the last moment.');
    else lg('   ❌ Solid defense. You\'ll need a better angle.');
  }
  
  if (!attackResult.hit) {
    finishPlayerTurn();
    return;
  }
  
  const weakMult = getWeaknessMultiplier(sk.elem, tg.elem);
  let isCrit = attackResult.isCrit;
  
  const synergyCritBonus = getSynergyCritBonus();
  if (!isCrit && Math.random() < synergyCritBonus) {
    isCrit = true;
    lg('✨ Synergy critical! ' + sk.n + ' strikes true!');
  }
  
  const soelBonus = G.party.some(p => p.on && p.n === 'Soel' && p.hp > 0) ? 1.10 : 1.0;
  const damageResult = DICE.damageRoll({
    diceExpr: sk.dmg,
    abilityScore: G.p.stats.int,
    isCrit: isCrit,
    bonus: G.p.eq.weapon ? G.p.eq.weapon.atk : 0
  });
  
  let finalDamage = Math.floor(damageResult.total * soelBonus);
  
  finalDamage = applyWeatherDamage(finalDamage, sk.elem);

  if (soelBonus > 1) {
    lg('🐱 Soel\'s fortune smiles! +10% damage!');
  }

  const mezstorm = G.party.find(p => p.on && p.n === 'Mezstorm' && p.hp > 0);
  if (mezstorm) {
    finalDamage = Math.floor(finalDamage * 1.15);
    lg('⚡ Mezstorm channels the storm! +15% spell damage!');
  }

  if (weakMult > 1) {
    finalDamage = Math.floor(finalDamage * weakMult);
    lg('⚡ ' + sk.elem + ' is super effective! ×' + weakMult);
  } else if (weakMult < 1) {
    finalDamage = Math.floor(finalDamage * weakMult);
    lg('⬇️ ' + sk.elem + ' is resisted! ×' + weakMult);
  }
  
  const zone = G.zones.find(z => z.en.includes(G.cbt.en[0]?.n));
  if (zone && zone.elem) {
    finalDamage = applyPlanarResonance(finalDamage, zone.n);
  }
  
  const riftDmgMult = getRiftMultiplier();
  if (riftDmgMult > 1) {
    finalDamage = Math.floor(finalDamage * riftDmgMult);
    lg('🌌 Rift surge! Damage ×' + riftDmgMult + '!');
  }
  finalDamage = applySynergyDamage(finalDamage, 'spell');
  finalDamage = Math.max(1, finalDamage);
  tg.hp -= finalDamage;
  
  const dmgFlavor = getDamageFlavor(finalDamage, isCrit);
  lg(dmgFlavor + ' ' + sk.n + ' deals ' + finalDamage + ' to ' + tg.n + '!');
  
  if (isCrit) {
    lg('   🎲 ' + damageResult.breakdown);
  }
  
  if (sk.status && tg.hp > 0) {
    const statusRoll = Math.random();
    if (statusRoll < sk.status.chance) {
      const existing = tg.status.find(s => s.type === sk.status.type);
      if (!existing) {
        tg.status.push({ ...sk.status, turns: sk.status.turns });
        lg('🔥 ' + tg.n + ' is ' + sk.status.type + 'ed!');
      }
    }
  }
  
  if (tg.hp <= 0) {
    tg.hp = 0;
    lg('💀 ' + tg.n + ' is defeated!');
    checkBountyKill(tg.n);
    trackBestiary(tg);
  }
  
  finishPlayerTurn();
}

function eturn() {
  const mezstorm = G.party.find(p => p.on && p.n === 'Mezstorm' && p.hp > 0);
  const msBuff = G.p.buffs.find(b => b.n === 'Mana Spring Blessing');
  if (msBuff && msBuff.t > 0) {
    const bonusMp = Math.max(1, Math.floor(G.p.mmp * msBuff.mpRegenPct));
    const oldMp = G.p.mp;
    G.p.mp = Math.min(G.p.mmp, G.p.mp + bonusMp);
    if (G.p.mp > oldMp) lg('💧 Mana Spring Blessing restores ' + (G.p.mp - oldMp) + ' bonus MP!');
  }
  if (mezstorm) {
    const oldMp = G.p.mp;
    G.p.mp = Math.min(G.p.mmp, G.p.mp + 3);
    if (G.p.mp > oldMp) lg('⚡ Mezstorm shares arcane energy. +' + (G.p.mp - oldMp) + ' MP.');
  }
  
  const soel = G.party.find(p => p.on && p.n === 'Soel' && p.hp > 0);
  if (soel) {
    const regen = Math.max(1, Math.floor(G.p.mhp * 0.05));
    const oldHp = G.p.hp;
    G.p.hp = Math.min(G.p.mhp, G.p.hp + regen);
    if (G.p.hp > oldHp) lg('🐱 Soel purrs warmly. San +' + (G.p.hp - oldHp) + ' HP.');
    for (let p of G.party) {
      if (p.on && p.hp > 0 && p.n !== 'Soel') {
        const pRegen = Math.max(1, Math.floor(p.mhp * 0.05));
        const pOld = p.hp;
        p.hp = Math.min(p.mhp, p.hp + pRegen);
        if (p.hp > pOld) lg('🐱 Soel curls around ' + p.n + '. +' + (p.hp - pOld) + ' HP.');
      }
    }
  }
  
  applyVoidBleed();
  applyWeatherCombat();

  for (let e of G.cbt.en) {
    doEnemyAttack(e);
  }
  
  handleBossMechanics();
  handleZoneHazards();
  
  for (let b of G.p.buffs) b.t--;
  G.p.buffs = G.p.buffs.filter(b => b.t > 0);
  
  for (let p of G.party) { if (p.frozen) p.frozen = false; }
  if (G.p.frozen) G.p.frozen = false;
}

function getBestSkill() {
  const available = G.p.skills.filter(s => s.on && G.p.mp >= s.c && !s.buff);
  if (available.length === 0) return null;
  available.sort((a, b) => {
    const dmgA = DICE.parse(a.dmg).total || 0;
    const dmgB = DICE.parse(b.dmg).total || 0;
    return dmgB - dmgA;
  });
  return available[0];
}

function getWeakestEnemy() {
  const alive = G.cbt.en.filter(e => e.hp > 0);
  if (alive.length === 0) return null;
  alive.sort((a, b) => a.hp - b.hp);
  return alive[0];
}

function getEnemyIndex(enemy) {
  return G.cbt.en.findIndex(e => e === enemy);
}

function doAutoCombatTick() {
  if (!G.cbt.on || !G.cbt.autoCombat) return;
  
  const now = Date.now();
  if (G.autoCombatHeartbeat && now - G.autoCombatHeartbeat > 5000) {
    lg('🤖 Auto-combat: Timer stalled (' + Math.floor((now - G.autoCombatHeartbeat)/1000) + 's). Recovering...');
  }
  G.autoCombatHeartbeat = now;
  
  if (G.cbt.en.every(e => e.hp <= 0)) {
    G.cbt.autoCombat = false;
    G.autoCombatHeartbeat = 0;
    return;
  }
  
  if (G.p.hp <= 1) {
    G.cbt.autoCombat = false;
    G.cbt.autoFlee = true;
    G.autoCombatHeartbeat = 0;
    lg('🤖 Auto-combat: HP critical! Forcing retreat...');
    return;
  }
  
  const skill = getBestSkill();
  if (!skill) {
    const manaPot = G.p.inv.find(i => i.t === 'pot' && i.eff === 'mana');
    if (manaPot && G.p.mp < 20) {
      const idx = G.p.inv.indexOf(manaPot);
      useI(idx);
      lg('🤖 Auto-combat: Used Mana Potion!');
      setTimeout(doAutoCombatTick, 800);
      return;
    }
    
    lg('🤖 Auto-combat: No MP for attacks. Passing turn...');
    for (let p of G.party) {
      if (p.on && p.hp > 0) doPartyAttack(p);
    }
    
    if (G.cbt.en.every(e => e.hp <= 0)) { handleVictory(); return; }
    if (G.p.hp <= 0) { handleDefeat(); return; }
    
    G.cbt.turn++;
    render();
    setTimeout(doAutoCombatTick, 1000);
    return;
  }
  
  const target = getWeakestEnemy();
  if (!target) { G.cbt.autoCombat = false; G.autoCombatHeartbeat = 0; return; }
  
  const skillIdx = G.p.skills.indexOf(skill);
  const targetIdx = getEnemyIndex(target);
  G.cbt.sk = skillIdx;
  G.cbt.tg = targetIdx;
  
  lg('🤖 Auto-combat: ' + skill.n + ' → ' + target.n);
  pa(skillIdx, targetIdx);
  
  if (!G.cbt.on) { G.cbt.autoCombat = false; G.autoCombatHeartbeat = 0; return; }
  setTimeout(doAutoCombatTick, 1200);
}

function toggleAutoCombat() {
  if (!G.cbt.on) return;
  G.cbt.autoCombat = !G.cbt.autoCombat;
  if (G.cbt.autoCombat) {
    G.autoCombatHeartbeat = Date.now();
    lg('🤖 Auto-combat ENABLED!');
    doAutoCombatTick();
  } else {
    G.autoCombatHeartbeat = 0;
    lg('🤖 Auto-combat DISABLED. Manual control restored.');
  }
  render();
}

// === Elemental & Resonance Helpers ===

function getWeaknessMultiplier(spellElem, enemyElem) {
  if (!spellElem || !enemyElem || enemyElem === 'none') return 1;
  const elemMult = getTalentMultiplier('elemWeak');
  if (spellElem === 'fire' && enemyElem === 'ice') return 1.5 * elemMult;
  if (spellElem === 'ice' && enemyElem === 'fire') return 1.5 * elemMult;
  if (spellElem === 'lightning' && enemyElem === 'void') return 1.5;
  if (spellElem === 'arcane' && enemyElem === 'void') return 1.3;
  if (spellElem === 'arcane' && enemyElem === 'arcane') return 1.4;
  if (spellElem === 'void' && enemyElem === 'arcane') return 1.3;
  if (spellElem === enemyElem) return 0.5;
  return 1;
}

function isImmune(enemyName, spellElem) {
  if (!spellElem) return false;
  const fireMobs = ['Fire Imp', 'Lava Slug', 'Ash Wraith'];
  const iceMobs = ['Ice Elemental', 'Frost Wolf', 'Frozen Knight'];
  if (spellElem === 'fire' && fireMobs.includes(enemyName)) return true;
  if (spellElem === 'ice' && iceMobs.includes(enemyName)) return true;
  return false;
}

function getTotalCritChance() {
  const baseCrit = 0.05;
  const dexBonus = G.p.stats.dex * 0.02;
  const profBonus = DICE.proficiencyBonus(G.p.lvl) * 0.01;
  const synergyBonus = getSynergyCritBonus();
  return Math.min(0.75, baseCrit + dexBonus + profBonus + synergyBonus);
}

// === Planar Resonance ===

function getZoneElement(zoneName) {
  const zone = G.zones.find(z => z.n === zoneName);
  return zone ? zone.elem : 'arcane';
}

function getGearElement() {
  const weapon = G.p.eq.weapon;
  if (!weapon) return 'arcane';
  if (weapon.fireDmg > 0) return 'fire';
  if (weapon.iceDmg > 0) return 'ice';
  if (weapon.lightDmg > 0 || weapon.lightningDmg > 0) return 'lightning';
  if (weapon.voidDmg > 0) return 'void';
  if (weapon.arcaneDmg > 0) return 'arcane';

  const armor = G.p.eq.armor;
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
  const zoneElem = getZoneElement(zoneName);
  const gearElem = getGearElement();
  if (!zoneElem || zoneElem === 'none') return 1;
  if (gearElem === zoneElem) return 1.25 * getTalentMultiplier('resonance');
  if (gearElem !== zoneElem && ['fire','ice','lightning','void','arcane'].includes(gearElem)) return 0.75 + (getTalentMultiplier('resonance') - 1);
  return 1;
}

function getResonanceStatus(zoneName) {
  const zoneElem = getZoneElement(zoneName);
  const gearElem = getGearElement();
  if (!zoneElem || zoneElem === 'none') return { status: 'neutral', text: 'No resonance', color: '#9ca3af', icon: '✦' };
  if (gearElem === zoneElem) return { status: 'matched', text: gearElem.toUpperCase() + ' RESONANCE (+25% DMG)', color: '#22c55e', icon: '⚡' };
  return { status: 'mismatched', text: gearElem.toUpperCase() + ' vs ' + zoneElem.toUpperCase() + ' (-25% DMG)', color: '#ef4444', icon: '⚠️' };
}

function applyPlanarResonance(damage, zoneName) {
  const mult = getResonanceMultiplier(zoneName);
  if (mult > 1) lg('🌌 PLANAR RESONANCE MATCHED! +' + Math.floor((mult - 1) * 100) + '% damage!');
  else if (mult < 1) lg('🌌 PLANAR RESONANCE MISMATCHED! -' + Math.floor((1 - mult) * 100) + '% damage...');
  return Math.floor(damage * mult);
}

// === Rift Events ===

function getRiftMultiplier() {
  if (!G.currentRift) return 1;
  return RIFT_EVENTS[G.currentRift].dmgMult || 1;
}

function getRiftStatus() {
  if (!G.currentRift) return null;
  const rift = RIFT_EVENTS[G.currentRift];
  return {
    name: rift.name,
    icon: rift.icon,
    desc: rift.desc,
    color: rift.color,
    fightsLeft: G.riftFightsRemaining
  };
}

function applyVoidBleed() {
  if (G.currentRift !== 'void') return;
  const drain = RIFT_EVENTS.void.hpDrain * getTalentMultiplier('voidDrain');
  const hpLoss = Math.max(1, Math.floor(G.p.mhp * drain));
  G.p.hp = Math.max(1, G.p.hp - hpLoss);
  lg('🌑 Void Bleed: San loses ' + hpLoss + ' HP!');
  for (let p of G.party) {
    if (p.on && p.hp > 0) {
      const pLoss = Math.max(1, Math.floor(p.mhp * drain));
      p.hp = Math.max(1, p.hp - pLoss);
      lg('🌑 Void Bleed: ' + p.n + ' loses ' + pLoss + ' HP!');
    }
  }
}

// === Weather ===

function applyWeatherDamage(damage, elem) {
  if (!G.currentWeather || G.currentWeather === 'clear') return damage;
  const mods = WEATHER[G.currentWeather].mods;
  if (elem && mods[elem + 'Dmg']) {
    const newDmg = Math.floor(damage * mods[elem + 'Dmg']);
    if (mods[elem + 'Dmg'] > 1) lg('🌦️ Weather boost! +' + Math.floor((mods[elem + 'Dmg'] - 1) * 100) + '% ' + elem + ' damage');
    return newDmg;
  }
  return damage;
}

function applyWeatherCombat() {
  if (!G.currentWeather || G.currentWeather === 'clear') return;
  const mods = WEATHER[G.currentWeather].mods;
  
  if (mods.mpDrain && G.cbt.turn % 3 === 0) {
    G.p.mp = Math.max(0, G.p.mp - mods.mpDrain);
    lg('☀️ The heat drains ' + mods.mpDrain + ' MP!');
  }
  
  if (mods.meteorChance && Math.random() < mods.meteorChance) {
    const alive = G.cbt.en.filter(e => e.hp > 0);
    if (alive.length > 0) {
      const target = alive[Math.floor(Math.random() * alive.length)];
      const dmg = Math.floor(G.p.stats.int * 1.5);
      target.hp -= dmg;
      lg('☄️ A star falls, striking ' + target.n + ' for ' + dmg + '!');
      if (target.hp <= 0) { target.hp = 0; lg('💀 ' + target.n + ' is crushed!'); }
    }
  }
}

// === Zone Buffs ===

function applyZoneBuffs(zoneName) {
  clearZoneBuffs();
  const buff = ZONE_BUFFS[zoneName];
  if(!buff) return;
  for(let p of G.party) {
    if(!p.on) continue;
    p.zoneBuff = { ...buff, zone: zoneName };
    if(buff.atk) p.atk += buff.atk;
    if(buff.def) p.def += buff.def;
    if(buff.spd) p.spd += buff.spd;
    const statBonuses = [];
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
  for(let p of G.party) { 
    if(p.zoneBuff) {
      const buff = p.zoneBuff;
      if(buff.atk) p.atk -= buff.atk;
      if(buff.def) p.def -= buff.def;
      if(buff.spd) p.spd -= buff.spd;
      delete p.zoneBuff;
    }
  }
}

// === Talent Helpers ===

function getTalentEffect(id) {
  return G.talents.includes(id);
}

function getTalentMultiplier(type) {
  let mult = 1;
  if (type === 'mpCost' && getTalentEffect('spellweaver')) mult -= 0.10;
  if (type === 'resonance' && getTalentEffect('planar_attunement')) mult += 0.10;
  if (type === 'elemWeak' && getTalentEffect('elemental_mastery')) mult += 0.15;
  if (type === 'voidDrain' && getTalentEffect('void_resistance')) mult -= 0.50;
  return mult;
}

function checkSecondWind() {
  if (!getTalentEffect('second_wind')) return false;
  if (G.p.hp / G.p.mhp < 0.10) {
    const heal = Math.floor(G.p.mhp * 0.25);
    G.p.hp = Math.min(G.p.mhp, G.p.hp + heal);
    lg('💨 SECOND WIND! San heals ' + heal + ' HP!');
    return true;
  }
  return false;
}

// === Synergy Helpers ===

function getActiveSynergies() {
  const active = G.party.filter(p => p.on && p.hp > 0).map(p => p.n);
  active.push('San');
  const synergies = [];
  for (let syn of G.partySynergies) {
    const allPresent = syn.members.every(m => active.includes(m));
    if (allPresent) synergies.push(syn);
  }
  return synergies;
}

function getSynergyBonus(type) {
  const synergies = getActiveSynergies();
  let bonus = 0;
  for (let syn of synergies) {
    if (syn.bonus[type]) bonus += syn.bonus[type];
  }
  return bonus;
}

function getSynergyDesc() {
  const synergies = getActiveSynergies();
  if (synergies.length === 0) return null;
  return synergies.map(s => s.icon + ' ' + s.name).join(' · ');
}

function applySynergyDamage(dmg, type) {
  const spellBonus = getSynergyBonus('spellDmgPct') + getAffinityUnlockBonus('spellDmgPct');
  if (type === 'spell' && spellBonus > 0) {
    dmg = Math.floor(dmg * (1 + spellBonus));
  }
  return dmg;
}

function applySynergyDefense(dmg) {
  const dmgRed = getSynergyBonus('dmgRed');
  if (dmgRed > 0) {
    dmg = Math.floor(dmg * (1 - dmgRed));
  }
  return Math.max(1, dmg);
}

function getSynergyCritBonus() {
  return getSynergyBonus('critPct') + getAffinityUnlockBonus('critPct');
}

function getSynergyGoldBonus() {
  return getSynergyBonus('goldPct') + getAffinityUnlockBonus('goldPct');
}

function getSynergyHealBonus() {
  return getSynergyBonus('healPct') + getAffinityUnlockBonus('healPct');
}
