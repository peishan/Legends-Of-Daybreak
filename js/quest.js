// ============================================================
// QUEST SYSTEM - Legends of Daybreak
// Handles quests, bounties, storyline, daily quests, mini-stories
// ============================================================

const DAILY_QUESTS = [
  { id: 'dq1', n: 'Arcane Practice', d: 'Cast 5 spells in combat', t: 'cast_spells', need: 5, rw: { xp: 40, g: 20 } },
  { id: 'dq2', n: 'Monster Hunter', d: 'Defeat 3 monsters', t: 'kill', need: 3, rw: { xp: 35, g: 15 } },
  { id: 'dq3', n: 'Potion Brewer', d: 'Craft 2 potions', t: 'craft', need: 2, rw: { xp: 30, g: 15 } },
  { id: 'dq4', n: 'Explorer', d: 'Explore 2 different zones', t: 'explore', need: 2, rw: { xp: 45, g: 25 } },
  { id: 'dq5', n: 'Rest & Recover', d: 'Rest once at any campsite', t: 'rest', need: 1, rw: { xp: 25, g: 10 } },
  { id: 'dq6', n: 'Gold Hoarder', d: 'Earn 50 gold from any source', t: 'earn_gold', need: 50, rw: { xp: 50, g: 30 } },
  { id: 'dq7', n: 'Skill Master', d: 'Use focus mode once', t: 'focus', need: 1, rw: { xp: 60, g: 35 } },
  { id: 'dq8', n: 'Party Bond', d: 'Win a battle with a full party', t: 'full_party_battle', need: 1, rw: { xp: 40, g: 20 } }
];

function checkQ() {
  for (let q of G.quests) {
    if (q.done) continue;
    if (q.hidden && !q.revealed) continue;
    if (q.t == 'kill' && G.p.kills >= q.c + q.need) q.c = q.need;
    if (q.t == 'reach_level' && G.p.lvl >= q.need) q.c = q.need;
    if (q.t == 'kill_specific' && q.c >= q.need) q.c = q.need;
    if (q.t == 'boss_specific' && q.c >= q.need) q.c = q.need;
    if (q.t == 'aisyah_battle' && q.c >= q.need) q.c = q.need;
    if (q.t == 'joel_battle' && q.c >= q.need) q.c = q.need;
    if (q.c >= q.need) {
      q.done = true;
      G.p.xp += q.rw.xp;
      G.p.gold += q.rw.g;
      G.p.quests++;
      lg('Quest: ' + q.n + '! +' + q.rw.xp + 'XP +' + q.rw.g + 'G');
      checkQuestChains();
      checkAchievements();
      lvlup();
    }
  }
}

function checkQuestChains() {
  for (let q of G.quests) {
    if (q.hidden && !q.revealed && q.reqQuest) {
      const req = G.quests.find(rq => rq.id === q.reqQuest);
      if (req && req.done) {
        q.revealed = true;
        q.hidden = false;
        lg('🔓 Hidden quest unlocked: ' + q.n + '!');
        lg('   ' + q.d);
      }
    }
  }
}

function checkBountyKill(enemyName) {
  for (let b of G.bounties) {
    if (b.done) continue;
    if (b.t === 'kill_specific' && enemyName === b.target) {
      b.c++;
      if (b.c >= b.need) {
        b.done = true;
        b.refreshDay = G.gameDay;
        G.p.xp += b.rw.xp;
        G.p.gold += b.rw.g;
        G.p.quests++;
        lg('💰 Bounty complete: ' + b.n + '! +' + b.rw.xp + 'XP +' + b.rw.g + 'G');
        lvlup();
      }
    }
  }
}

function checkStoryline() {
  for (let s of G.storyline) {
    if (s.done) continue;
    if (!s.unlocked) {
      const prev = G.storyline.find(ch => ch.chapter === s.chapter - 1);
      if (!prev || prev.done) {
        s.unlocked = true;
        lg('📖 Storyline unlocked: Chapter ' + s.chapter + ' - ' + s.n + '!');
      }
    }
    if (s.unlocked && G.p.lvl >= s.need) {
      s.c = s.need;
      s.done = true;
      G.p.xp += s.rw.xp;
      G.p.gold += s.rw.g;
      G.p.quests++;
      lg('📖 Storyline complete: ' + s.n + '! +' + s.rw.xp + 'XP +' + s.rw.g + 'G');
      lvlup();
    }
  }
}

function checkDailyQuests(type, amount) {
  amount = amount || 1;
  if (!G.dailyQuests || G.dailyQuests.length === 0) return;
  for (let q of G.dailyQuests) {
    if (q.done) continue;
    if (q.t === type || (type === 'kill_specific' && q.t === 'kill')) {
      q.c += amount;
      if (q.c >= q.need) {
        q.done = true;
        G.p.xp += q.rw.xp;
        G.p.gold += q.rw.g;
        lg('📋 Daily quest complete: ' + q.n + '! +' + q.rw.xp + 'XP +' + q.rw.g + 'G');
        lvlup();
      }
    }
  }
  saveGame();
}

function generateDailyQuests() {
  if (G.dailyQuestSeed === G.gameDay && G.dailyQuests && G.dailyQuests.length > 0) {
    return;
  }
  G.dailyQuestSeed = G.gameDay;
  G.dailyQuests = [];
  const pool = [...DAILY_QUESTS];
  for (let i = 0; i < 3 && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const template = pool.splice(idx, 1)[0];
    G.dailyQuests.push({
      id: template.id, n: template.n, d: template.d, t: template.t,
      c: 0, need: template.need, rw: template.rw, done: false
    });
  }
  lg('📋 New daily quests available for Day ' + G.gameDay + '!');
}

function updateTimedQuests() {
  for (let q of G.quests) {
    if (q.timed && !q.done && !q.expired && q.timer > 0) {
      q.timer--;
      if (q.timer <= 0) {
        q.expired = true;
        lg('⏰ Quest expired: ' + q.n + '!');
      }
    }
  }
}

function getTimerStatus(q) {
  if (!q.timed || q.done || q.expired) return null;
  const pct = (q.timer / q.timerMax) * 100;
  if (q.timer <= 0) return { cls: 'timer-expired', label: 'EXPIRED', pct: 0 };
  if (pct < 25) return { cls: 'timer-urgent', label: q.timer + ' ticks left', pct: pct };
  return { cls: 'timer-ok', label: q.timer + ' ticks left', pct: pct };
}

function checkMiniStory(zoneName) {
  const seenCount = Object.keys(G.currentMiniStory?.completed || {}).length || 0;
  const adjustedChance = Math.max(0.02, 0.10 - (seenCount * 0.02));
  if (Math.random() > adjustedChance) return false;
  const eligible = G.miniStories.filter(story => {
    if (!story.zones.includes(zoneName)) return false;
    if (story.reqParty && !G.party.some(p => p.on && p.n === story.reqParty)) return false;
    if (G.currentMiniStory && G.currentMiniStory.completed && G.currentMiniStory.completed[story.id]) return false;
    return true;
  });
  if (eligible.length === 0) return false;
  const story = eligible[Math.floor(Math.random() * eligible.length)];
  G.currentMiniStory = { ...story, choice: null, result: null, completed: G.currentMiniStory?.completed || {} };
  G.state = 'ministory';
  lg('🗣️ ENCOUNTER: ' + story.name + ' — ' + story.title);
  render();
  return true;
}

function makeMiniStoryChoice(choiceIdx) {
  if (!G.currentMiniStory) return;
  const story = G.currentMiniStory;
  const choice = story.choices[choiceIdx];
  if (!choice) return;
  story.choice = choiceIdx;
  if (choice.req && !G.party.some(p => p.on && p.n === choice.req)) {
    lg('❌ Requires ' + choice.req + ' in party!'); return;
  }
  if (choice.cost) {
    if (choice.cost.gold && G.p.gold < choice.cost.gold) { lg('❌ Need ' + choice.cost.gold + 'G'); return; }
    if (choice.cost.item) {
      const item = G.p.inv.find(i => i.n === choice.cost.item);
      if (!item || item.q < (choice.cost.qty || 1)) { lg('❌ Missing: ' + choice.cost.item); return; }
    }
  }
  if (choice.cost) {
    if (choice.cost.gold) { G.p.gold -= choice.cost.gold; lg('💰 -' + choice.cost.gold + 'G'); }
    if (choice.cost.item) {
      const item = G.p.inv.find(i => i.n === choice.cost.item);
      if (item) { item.q -= (choice.cost.qty || 1); if (item.q <= 0) G.p.inv.splice(G.p.inv.indexOf(item), 1); }
    }
  }
  if (choice.reward) {
    if (choice.reward.xp) { G.p.xp += choice.reward.xp; lg('✨ +' + choice.reward.xp + ' XP'); }
    if (choice.reward.gold) { G.p.gold += choice.reward.gold; lg('💰 +' + choice.reward.gold + 'G'); }
    if (choice.reward.affinity) { updateAffinity(choice.reward.affinity, choice.reward.amt); }
    if (choice.reward.item) { addI({ ...choice.reward.item }); lg('🎁 +' + choice.reward.item.q + ' ' + choice.reward.item.n); }
  }
  if (choice.response) lg('   ' + choice.response);
  story.completed[story.id] = true;
  story.result = 'done';
  lvlup();
  render();
}

function closeMiniStory() {
  G.currentMiniStory = null;
  G.state = 'explore';
  render();
}

function toggleQuestCollapse(key) {
  G.questCollapsed = G.questCollapsed || {};
  G.questCollapsed[key] = !G.questCollapsed[key];
  render();
}

function rQuest() {
  let h = '<div style="padding:16px;">';
  h += '<div class="st">📜 Quests</div>';

  // Main Quests
  h += '<div style="margin-bottom:16px;">';
  h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;cursor:pointer;" onclick="toggleQuestCollapse('main')">';
  h += '<h3 style="font-size:14px;color:var(--accent-light);">📜 Main Quests</h3>';
  h += '<span style="font-size:18px;">' + (G.questCollapsed?.main ? '▶' : '▼') + '</span>';
  h += '</div>';
  if (!G.questCollapsed?.main) {
    const mainQuests = G.quests.filter(q => !q.chain && !q.hidden);
    if (mainQuests.length === 0) {
      h += '<div class="ei">No active main quests.</div>';
    } else {
      for (let q of mainQuests) {
        h += rQuestItem(q);
      }
    }
  }
  h += '</div>';

  // Chain Quests
  const chains = [...new Set(G.quests.filter(q => q.chain).map(q => q.chain))];
  for (let chain of chains) {
    h += '<div style="margin-bottom:16px;">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;cursor:pointer;" onclick="toggleQuestCollapse('' + chain + '')">';
    h += '<h3 style="font-size:14px;color:var(--accent-light);">🔗 ' + chain.charAt(0).toUpperCase() + chain.slice(1) + ' Chain</h3>';
    h += '<span style="font-size:18px;">' + (G.questCollapsed?.[chain] ? '▶' : '▼') + '</span>';
    h += '</div>';
    if (!G.questCollapsed?.[chain]) {
      const chainQuests = G.quests.filter(q => q.chain === chain && (!q.hidden || q.revealed));
      for (let q of chainQuests) {
        h += rQuestItem(q);
      }
    }
    h += '</div>';
  }

  // Bounties
  h += '<div style="margin-bottom:16px;">';
  h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;cursor:pointer;" onclick="toggleQuestCollapse('bounties')">';
  h += '<h3 style="font-size:14px;color:var(--accent-light);">💰 Bounties</h3>';
  h += '<span style="font-size:18px;">' + (G.questCollapsed?.bounties ? '▶' : '▼') + '</span>';
  h += '</div>';
  if (!G.questCollapsed?.bounties) {
    const activeBounties = G.bounties.filter(b => !b.done && G.p.lvl >= (b.minLv || 1));
    if (activeBounties.length === 0) {
      h += '<div class="ei">No active bounties. Check back tomorrow!</div>';
    } else {
      for (let b of activeBounties.slice(0, 6)) {
        h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:8px;">';
        h += '<div style="font-weight:600;font-size:13px;">' + b.n + '</div>';
        h += '<div style="font-size:11px;color:var(--text-dim);">' + b.d + '</div>';
        h += '<div style="margin-top:6px;"><div class="bar" style="height:6px;"><div class="bf bf-xp" style="width:' + ((b.c / b.need) * 100) + '%"></div></div></div>';
        h += '<div style="font-size:10px;color:var(--text-dim);margin-top:4px;">' + b.c + '/' + b.need + ' · +' + b.rw.xp + 'XP +' + b.rw.g + 'G</div>';
        h += '</div>';
      }
    }
  }
  h += '</div>';

  // Daily Quests
  h += '<div style="margin-bottom:16px;">';
  h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;cursor:pointer;" onclick="toggleQuestCollapse('daily')">';
  h += '<h3 style="font-size:14px;color:var(--accent-light);">📋 Daily Quests (Day ' + (G.gameDay || 1) + ')</h3>';
  h += '<span style="font-size:18px;">' + (G.questCollapsed?.daily ? '▶' : '▼') + '</span>';
  h += '</div>';
  if (!G.questCollapsed?.daily) {
    if (!G.dailyQuests || G.dailyQuests.length === 0) {
      h += '<div class="ei">No daily quests available. Come back tomorrow!</div>';
    } else {
      for (let q of G.dailyQuests) {
        h += '<div style="background:var(--bg-card);border:1px solid ' + (q.done ? 'var(--success)' : 'var(--border)') + ';border-radius:12px;padding:12px;margin-bottom:8px;' + (q.done ? 'opacity:0.6;' : '') + '">';
        h += '<div style="font-weight:600;font-size:13px;">' + (q.done ? '✅ ' : '') + q.n + '</div>';
        h += '<div style="font-size:11px;color:var(--text-dim);">' + q.d + '</div>';
        h += '<div style="margin-top:6px;"><div class="bar" style="height:6px;"><div class="bf bf-xp" style="width:' + ((q.c / q.need) * 100) + '%"></div></div></div>';
        h += '<div style="font-size:10px;color:var(--text-dim);margin-top:4px;">' + q.c + '/' + q.need + ' · +' + q.rw.xp + 'XP +' + q.rw.g + 'G</div>';
        h += '</div>';
      }
    }
  }
  h += '</div>';

  // Storyline
  h += '<div style="margin-bottom:16px;">';
  h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;cursor:pointer;" onclick="toggleQuestCollapse('storyline')">';
  h += '<h3 style="font-size:14px;color:var(--accent-light);">📖 Storyline</h3>';
  h += '<span style="font-size:18px;">' + (G.questCollapsed?.storyline ? '▶' : '▼') + '</span>';
  h += '</div>';
  if (!G.questCollapsed?.storyline) {
    for (let s of G.storyline) {
      h += '<div style="background:var(--bg-card);border:1px solid ' + (s.done ? 'var(--success)' : s.unlocked ? 'var(--accent)' : 'var(--disabled)') + ';border-radius:12px;padding:12px;margin-bottom:8px;opacity:' + (s.unlocked ? '1' : '0.5') + ';">';
      h += '<div style="font-weight:600;font-size:13px;">Ch. ' + s.chapter + ': ' + (s.done ? '✅ ' : '') + s.n + '</div>';
      h += '<div style="font-size:11px;color:var(--text-dim);">' + s.d + '</div>';
      if (!s.done && s.unlocked) {
        h += '<div style="margin-top:6px;"><div class="bar" style="height:6px;"><div class="bf bf-xp" style="width:' + Math.min(100, (G.p.lvl / s.need) * 100) + '%"></div></div></div>';
        h += '<div style="font-size:10px;color:var(--text-dim);margin-top:4px;">Lv.' + G.p.lvl + '/' + s.need + ' · +' + s.rw.xp + 'XP +' + s.rw.g + 'G</div>';
      }
      h += '</div>';
    }
  }
  h += '</div>';

  h += '</div>';
  return h;
}

function rQuestItem(q) {
  let h = '<div style="background:var(--bg-card);border:1px solid ' + (q.done ? 'var(--success)' : q.expired ? 'var(--danger)' : 'var(--border)') + ';border-radius:12px;padding:12px;margin-bottom:8px;' + (q.done ? 'opacity:0.6;' : q.expired ? 'opacity:0.4;' : '') + '">';
  h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;">';
  h += '<div style="font-weight:600;font-size:13px;">' + (q.done ? '✅ ' : q.expired ? '❌ ' : '') + q.n + '</div>';
  const timer = getTimerStatus(q);
  if (timer) {
    h += '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:' + (timer.cls === 'timer-urgent' ? '#dc262620' : '#22c55e20') + ';color:' + (timer.cls === 'timer-urgent' ? '#dc2626' : '#22c55e') + ';">' + timer.label + '</span>';
  }
  h += '</div>';
  h += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">' + q.d + '</div>';
  if (!q.done && !q.expired) {
    h += '<div style="margin-top:6px;"><div class="bar" style="height:6px;"><div class="bf bf-xp" style="width:' + Math.min(100, (q.c / q.need) * 100) + '%"></div></div></div>';
    h += '<div style="font-size:10px;color:var(--text-dim);margin-top:4px;">' + q.c + '/' + q.need + ' · +' + q.rw.xp + 'XP +' + q.rw.g + 'G</div>';
  }
  h += '</div>';
  return h;
}

function rMiniStory() {
  const story = G.currentMiniStory;
  if (!story) return '<div>Error</div>';
  let h = '<div style="padding:20px;text-align:center;">';
  h += '<div style="font-size:48px;margin-bottom:12px;">' + story.icon + '</div>';
  h += '<div style="font-size:12px;color:var(--accent-light);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">Random Encounter</div>';
  h += '<h2 style="font-family:Cinzel,serif;font-size:20px;margin-bottom:8px;">' + story.name + '</h2>';
  h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:20px;">' + story.title + '</div>';
  for (let line of story.dialogue) {
    h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:20px;text-align:left;">';
    h += '<div style="font-size:11px;color:var(--accent-light);font-weight:600;margin-bottom:6px;">' + line.speaker + '</div>';
    h += '<div style="font-size:14px;line-height:1.7;">' + line.text + '</div></div>';
  }
  if (!story.choice && story.result !== 'done') {
    h += '<div style="display:flex;flex-direction:column;gap:10px;max-width:340px;margin:0 auto;">';
    for (let i = 0; i < story.choices.length; i++) {
      const ch = story.choices[i];
      let canChoose = true, reason = '';
      if (ch.req && !G.party.some(p => p.on && p.n === ch.req)) { canChoose = false; reason = 'Requires ' + ch.req; }
      if (ch.cost && ch.cost.gold && G.p.gold < ch.cost.gold) { canChoose = false; reason = 'Need ' + ch.cost.gold + 'G'; }
      if (ch.cost && ch.cost.item) { const item = G.p.inv.find(inv => inv.n === ch.cost.item); if (!item || item.q < (ch.cost.qty || 1)) { canChoose = false; reason = 'Need ' + (ch.cost.qty || 1) + ' ' + ch.cost.item; } }
      h += '<button class="ministory-choice" data-choice="' + i + '" style="padding:14px 18px;border-radius:14px;border:2px solid '+(canChoose?'var(--accent)':'var(--disabled)')+';background:'+(canChoose?'var(--bg-card)':'var(--nav-bg)')+';color:'+(canChoose?'var(--text)':'var(--disabled)')+';font-size:13px;font-weight:600;cursor:'+(canChoose?'pointer':'not-allowed')+';user-select:none;text-align:left;">';
      h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">';
      h += '<span>' + ch.label + '</span>';
      if (!canChoose) h += '<span style="font-size:10px;color:var(--danger);">🔒 ' + reason + '</span>';
      h += '</div>';
      if (ch.cost && (ch.cost.gold || ch.cost.item)) {
        h += '<div style="font-size:10px;color:var(--danger);margin-top:4px;">Cost: ';
        if (ch.cost.gold) h += ch.cost.gold + 'G ';
        if (ch.cost.item) h += (ch.cost.qty || 1) + '× ' + ch.cost.item;
        h += '</div>';
      }
      if (ch.reward) {
        h += '<div style="font-size:10px;color:var(--success);margin-top:4px;">Reward: ';
        const rewards = [];
        if (ch.reward.xp) rewards.push(ch.reward.xp + ' XP');
        if (ch.reward.gold) rewards.push(ch.reward.gold + 'G');
        if (ch.reward.affinity) rewards.push('+' + ch.reward.amt + ' ' + ch.reward.affinity + ' affinity');
        if (ch.reward.item) rewards.push(ch.reward.item.n);
        h += rewards.join(', ') + '</div>';
      }
      h += '</button>';
    }
    h += '</div>';
  } else if (story.result === 'done') {
    h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:20px;margin:20px auto;max-width:400px;">';
    h += '<div style="font-size:24px;margin-bottom:8px;">✨</div>';
    h += '<div style="font-size:14px;color:var(--text-dim);line-height:1.6;">' + story.choices[story.choice].response + '</div></div>';
    h += '<button class="abtn" id="btn-close-ministory" style="max-width:200px;margin:0 auto;display:block;">Continue</button>';
  }
  h += '</div>';
  return h;
}
