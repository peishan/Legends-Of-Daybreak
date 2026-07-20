// ============================================
// menu.js - Main UI Rendering & Menu Screens
// ============================================

function rc(c){return c=='common'?'#9ca3af':c=='uncommon'?'#22c55e':c=='rare'?'#3b82f6':'#a855f7';}

function ee(n){const m={'Goblin':'👺','Wolf':'🐺','Slime':'🟢','Skeleton':'💀','Zombie':'🧟','Ghost':'👻','Fire Imp':'🔥','Lava Slug':'🌋','Ash Wraith':'💨','Ice Elemental':'❄️','Frost Wolf':'🐕‍🦺','Frozen Knight':'🥶','Void Beast':'🌑','Shadow Demon':'👿','Abyssal Horror':'🐙','Crystal Spider':'🕷️','Gem Golem':'💎','Shimmer Bat':'🦇','Storm Wraith':'⚡','Lightning Hound':'🐕','Thunder Knight':'⚔️','Drowned Sailor':'🧜','Sea Serpent':'🐍','Coral Golem':'🪸','Dragon Whelp':'🐉','Ash Drake':'🔥','Elder Wyrm':'🐲','Star Sentinel':'⭐','Celestial Knight':'🌟','Astral Lord':'👑','Planar Wisp':'✨','Rift Stalker':'🌀','Aether Golem':'🪨','Chronomancer':'⏳','Void Weaver':'🕸️','Planar Leviathan':'🌌','The Planarch':'🌌','Nexus Guardian':'🛡️','Planar Titan':'🗿','The Nexus Planarch':'👁️','Nexus Shard':'💎','Planar Construct':'🤖','Reality Fragment':'🪞','Dimensional Echo':'👤','Void Remnant':'🌑','Goblin King':'👑','Bone Tyrant':'💀','Crystal Leviathan':'💎','Ember Dragon':'🐲','Storm Tyrant':'⚡','Frost Queen':'❄️','Abyssal Leviathan':'🌑','Elder Dragon':'🔥','Starlord':'⭐','The Astral Devourer':'🌌','The Infernal Tyrant':'🔥','Astral Echo':'✨'
    ,'Reality Weaver':'🧵','Fracture Hound':'🐕‍🦺','Dimensional Drifter':'👤'
    ,'Ember Wraith':'👻','Ash Phantom':'💨','Flame Serpent':'🐍','Magma Titan':'🌋'};return m[n]||'👾';}

function re(r){const m={'Tank':'🛡️','Rogue':'🗡️','Mage':'🔮','Healer':'💚','Ranger':'🏹','Warrior':'⚔️','Support':'🍀'};return m[r]||'👤';}

function ie(i){if(i.t=='pot')return i.eff=='heal'?'🧪':'💧';if(i.t=='food')return'🍽️';if(i.t=='drink')return'🥤';if(i.t=='revive')return'🔥';if(i.t=='wep')return'⚔️';if(i.t=='arm')return'🛡️';if(i.t=='acc')return'💍';if(i.t=='mat')return'💎';return'📦';}

function render(){
  initPartyGearBonus();

  const a=document.getElementById('app'); if(!a)return;
  let h='';
  h+='<div class="hdr"><div class="hdr-l"><div class="pname">'+G.p.name+' <span class="cls">'+G.p.cls+'</span></div><div class="lvl">Lv.'+G.p.lvl+'</div></div>';
  h+='<div class="hdr-r"><div class="sb"><span class="si">HP</span><div class="bar"><div class="bf bf-hp" style="width:'+((G.p.hp/G.p.mhp)*100)+'%"></div></div><span class="bt">'+G.p.hp+'/'+G.p.mhp+'</span></div>';
  h+='<div class="sb"><span class="si">MP</span><div class="bar"><div class="bf bf-mp" style="width:'+((G.p.mp/G.p.mmp)*100)+'%"></div></div><span class="bt">'+G.p.mp+'/'+G.p.mmp+'</span></div>';
  h+='<div class="sb"><span class="si">XP</span><div class="bar"><div class="bf bf-xp" style="width:'+((G.p.xp/G.p.xpN)*100)+'%"></div></div><span class="bt">'+G.p.xp+'/'+G.p.xpN+'</span></div>';
  h+='<div class="gold">GOLD: '+G.p.gold+'</div></div></div>';
  if(G.p.buffs.length>0)h+='<div class="buffs">'+G.p.buffs.map(b=>'<span class="bp">'+b.n+' ('+b.t+')</span>').join('')+'</div>';
  const activeSyns = getActiveSynergies();
  if(activeSyns.length > 0 && G.state === 'combat'){
    h += '<div class="buffs">' + activeSyns.map(s => '<span class="bp" style="background:linear-gradient(135deg,#7c3aed,#a78bfa);">'+s.icon+' '+s.name+'</span>').join('') + '</div>';
  }
  h+='<div class="content">';
  if(G.state=='menu')h+=rMenu();
  else if(G.state=='achievements')h+=rAchievements();
  else if(G.state=='story')h+=rStory();
  else if(G.state=='bestiary')h+=rBestiary();
  else if(G.state=='explore')h+=rExp();
  else if(G.state=='combat')h+=rCbt();
  else if(G.state=='party')h+=rParty();
  else if(G.state=='skills')h+=rSkills();
  else if(G.state=='inventory')h+=rInv();
  else if(G.state=='craft')h+=rCraft();
  else if(G.state=='quest')h+=rQuest();
  else if(G.state=='focus')h+=rFocus();
  else if(G.state=='rest')h+=rRest();
  else if(G.state=='secret')h+=rSecret();
  else if(G.state=='skilltree')h+=rSkillTree();
  else if(G.state=='talents')h+=rTalents();
  else if(G.state=='runes')h+=rRunes();
  else if(G.state=='ministory')h+=rMiniStory();
  else if(G.state=='journal')h+=rJournal();
  else if(G.state=='journalentry')h+=rJournalEntry(G.currentJournalEntry);
  else if(G.state=='npc')h+=rNPC();
  else if(G.state=='grind_room')h+=rGrindRoom();

  h+='</div>';
  h+='<div class="log" id="log">'+G.log.map(m=>'<div class="le">'+m+'</div>').join('')+'</div>';
  h+='<div class="nav"><button class="nb '+(G.state=='menu'?'on':'')+'" data-t="home" data-a="menu">Home</button>';
  h+='<button class="nb '+(G.state=='explore'?'on':'')+'" data-t="exp" data-a="explore">Explore</button>';
  h+='<button class="nb '+(G.state=='party'?'on':'')+'" data-t="party" data-a="party">Party</button>';
  h+='<button class="nb '+(G.state=='quest'?'on':'')+'" data-t="quest" data-a="quest">Quests</button>';
  h+='<button class="nb '+(G.state=='craft'?'on':'')+'" data-t="craft" data-a="craft">Craft</button>';
  h+='<button class="nb '+(G.state=='inventory'?'on':'')+'" data-t="inv" data-a="inventory">Items</button>';
  h+='<button class="nb '+(G.state=='npc'?'on':'')+'" data-t="npc" data-a="npc">Traders</button></div>';
  a.innerHTML=h;
  attachEvents();
  const l=document.getElementById('log'); if(l)l.scrollTop=l.scrollHeight;
}

function attachEvents() {
  document.querySelectorAll('.card[data-a]').forEach(el=>{
        el.addEventListener('click',()=>{const a=el.getAttribute('data-a');if(a=='explore')setS('explore');else if(a=='party')setS('party');else if(a=='skills')setS('skills');else if(a=='craft')setS('craft');else if(a=='quest')setS('quest');else if(a=='inventory')setS('inventory');else if(a=='bestiary')setS('bestiary');else if(a=='achievements')setS('achievements');else if(a=='npc')setS('npc');else if(a=='focus')setS('focus');
  if(a=='rest')setS('rest');
    else if(a=='grind_room')setS('grind_room');
    else if(a=='skilltree')setS('skilltree');
    else if(a=='talents')setS('talents');
    else if(a=='runes')setS('runes');
    else if(a=='journal')setS('journal');});
  });
 const btnClaimLogin = document.getElementById('btn-claim-login');
if (btnClaimLogin) {
  btnClaimLogin.addEventListener('click', claimDailyLoginReward);
}
 document.querySelectorAll('.story-view .abtn').forEach(el=>{
    el.addEventListener('click',advanceStory);
  });
  const btnSave=document.getElementById('btn-save');if(btnSave)btnSave.addEventListener('click',()=>{saveGame();});
  const btnExport=document.getElementById('btn-export');if(btnExport)btnExport.addEventListener('click',exportSave);
  const btnImport=document.getElementById('btn-import');if(btnImport)btnImport.addEventListener('click',importSave);
  const btnReset=document.getElementById('btn-reset');if(btnReset)btnReset.addEventListener('click',resetGame);
  document.querySelectorAll('.zcard:not(.locked)').forEach(el=>{
    el.addEventListener('click',()=>{const i=parseInt(el.getAttribute('data-i'));sc(i);});
  });
  document.querySelectorAll('.ecard:not(.dead)').forEach(el=>{
    el.addEventListener('click',()=>{G.cbt.tg=parseInt(el.getAttribute('data-i'));render();});
  });
  document.querySelectorAll('.sbtn:not(.dis)').forEach(el=>{
    el.addEventListener('click',()=>{
      const raw = el.getAttribute('data-i');
      G.cbt.sk = raw === '-1' ? -1 : parseInt(raw);
      render();
    });
  });
  const abtn=document.querySelector('.abtn:not(.dis)');
  if(abtn){
    abtn.addEventListener('click',()=>{
      const siRaw=abtn.getAttribute('data-si');
      const si=siRaw==='-1'?-1:parseInt(siRaw);
      const ti=parseInt(abtn.getAttribute('data-ti'));
      pa(si,ti);
    });
  }
  const fbtn=document.querySelector('.fbtn');
  if(fbtn)fbtn.addEventListener('click',flee);
  document.querySelectorAll('.ib-u').forEach(el=>{
    el.addEventListener('click',(e)=>{e.stopPropagation();useI(parseInt(el.getAttribute('data-i')));});
  });
  document.querySelectorAll('.ib-e').forEach(el=>{
    el.addEventListener('click',(e)=>{e.stopPropagation();equipItem(parseInt(el.getAttribute('data-i')));});
  });
  document.querySelectorAll('.cb:not(.dis)').forEach(el=>{
    el.addEventListener('click',()=>{craft(parseInt(el.getAttribute('data-i')));});
  });
  document.querySelectorAll('.socket-btn').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      const itemIdx=parseInt(el.getAttribute('data-ii'));
      const slot=parseInt(el.getAttribute('data-si'));
      openSocketModal(itemIdx, slot);
    });
  });
  document.querySelectorAll('.unsocket-btn').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      unsocketRune(parseInt(el.getAttribute('data-ii')), parseInt(el.getAttribute('data-si')));
      render();
    });
  });
  const btnCombine=document.getElementById('btn-combine');
  if(btnCombine)btnCombine.addEventListener('click',()=>{
    openCombineModal();
  });
  // Rune socket modal events
  document.querySelectorAll('.rune-select-btn').forEach(el=>{
    el.addEventListener('click',()=>{
      confirmSocketRune(parseInt(el.getAttribute('data-ri')));
    });
  });
  document.querySelectorAll('.rune-modal-back').forEach(el=>{
    el.addEventListener('click',()=>{
      closeSocketModal();
      closeCombineModal();
    });
  });
  // Rune combine modal events
  document.querySelectorAll('.rune-combine-select').forEach(el=>{
    el.addEventListener('click',()=>{
      toggleCombineRune(parseInt(el.getAttribute('data-ri')));
    });
  });
  const btnConfirmCombine=document.getElementById('btn-confirm-combine');
  if(btnConfirmCombine)btnConfirmCombine.addEventListener('click',doCombineRunes);
  document.querySelectorAll('.nb').forEach(el=>{
    el.addEventListener('click',()=>{const a=el.getAttribute('data-a');setS(a);});
  });
  const cfb=document.querySelector('.cfb');
  document.querySelectorAll('.focus-session-btn').forEach(el=>{
    el.addEventListener('click',()=>{sf(parseInt(el.getAttribute('data-min')));});
  });
  if(cfb)cfb.addEventListener('click',cf);
  const btnAuto=document.getElementById('btn-auto');
  if(btnAuto)btnAuto.addEventListener('click',toggleAutoCombat);
  document.querySelectorAll('.secret-choice').forEach(el=>{
    el.addEventListener('click',()=>{ makeSecretChoice(el.getAttribute('data-choice')); render(); });
  });
  const btnCloseSecret=document.getElementById('btn-close-secret');
  if(btnCloseSecret)btnCloseSecret.addEventListener('click',closeSecretArea);
  document.querySelectorAll('.spec-card').forEach(el=>{
    el.addEventListener('click',()=>{ if(G.p.lvl>=3) { const spec=el.getAttribute('data-spec'); if(chooseSpecPath(spec)) render(); } });
  });
  document.querySelectorAll('.spec-unlock-btn').forEach(el=>{
    el.addEventListener('click',()=>{ const tier=parseInt(el.getAttribute('data-tier')); if(unlockSpecTier(tier)) render(); });
  });
  const btnRespec=document.getElementById('btn-respec');
  if(btnRespec)btnRespec.addEventListener('click',respecPath);
  document.querySelectorAll('.ministory-choice').forEach(el=>{
    el.addEventListener('click',()=>{ makeMiniStoryChoice(parseInt(el.getAttribute('data-choice'))); });
  });
  const btnCloseMini=document.getElementById('btn-close-ministory');
  if(btnCloseMini)btnCloseMini.addEventListener('click',closeMiniStory);

// Journal entry click handlers
document.querySelectorAll('.zcard[data-jid]').forEach(el=>{
  el.addEventListener('click',()=>{
    const jid=el.getAttribute('data-jid');
    const entry=G.storyJournal.entries.find(e=>e.id===jid);
    if(entry&&G.storyJournal.unlocked.includes(jid)){
      G.currentJournalEntry=jid;
      setS('journalentry');
    }
  });
});
const btnBackJournal=document.getElementById('btn-back-journal');
if(btnBackJournal)btnBackJournal.addEventListener('click',()=>{ setS('journal'); });

  document.querySelectorAll('.rs-card:not(.locked):not(.active)').forEach(el=>{
    el.addEventListener('click',()=>{const id=el.getAttribute('data-id');startRest(id);});
  });
  document.querySelectorAll('.soel-bless-btn').forEach(el=>{
    el.addEventListener('click',()=>{soelBless(el.getAttribute('data-n'));});
  });
  const cancelRestBtn=document.getElementById('cancel-rest');
  if(cancelRestBtn)cancelRestBtn.addEventListener('click',cancelRest);
  document.querySelectorAll('.npc-buy').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      buyFromNPC(el.getAttribute('data-npc'),parseInt(el.getAttribute('data-item')));
    });
  });
  document.querySelectorAll('.amad-sell').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      sellToAmad(parseInt(el.getAttribute('data-index')));
    });
  });
  document.querySelectorAll('.tr-btn:not(.dis)').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      reviveMember(el.getAttribute('data-m'));
    });
  });
  document.querySelectorAll('.equip-pgear').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      equipPartyGear(el.getAttribute('data-member'), parseInt(el.getAttribute('data-idx')));
    });
  // Stage 1: Trinket shop
  document.querySelectorAll('.trinket-buy-btn').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      buyTrinket(parseInt(el.getAttribute('data-tidx')));
    });
  });

  });
  document.querySelectorAll('.unequip-pgear').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      unequipPartyGear(el.getAttribute('data-member'));
    });
  });
}

function rSecret(){
  const area = G.secretAreas[G.secretArea.zone];
  if (!area) return '<div>Error</div>';
  let h = '<div style="padding:20px;text-align:center;">';
  h += '<h2 style="color:var(--accent-light);">🔍 ' + area.name + '</h2>';
  h += '<div style="font-size:13px;color:var(--text-dim);margin-bottom:20px;">' + area.desc + '</div>';
  if (!G.secretArea.choice && G.secretArea.result !== 'done') {
    for (let choice of area.choices) {
      const isRisky = choice.risk === 'high';
      h += '<button class="secret-choice" data-choice="' + choice.id + '" style="display:block;width:100%;max-width:300px;margin:10px auto;padding:14px;border-radius:14px;border:2px solid '+(isRisky?'var(--danger)':'var(--accent)')+';background:var(--bg-card);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;">';
      h += choice.label + (isRisky ? ' ⚠️' : '') + '</button>';
    }
  } else if (G.secretArea.result === 'ambush') {
    h += '<div style="color:var(--danger);font-size:18px;margin:20px;">💥 Ambush!</div>';
    h += '<button class="abtn" onclick="render()">Fight!</button>';
  } else {
    h += '<div style="margin:20px;">' + (G.secretArea.result === 'loot' ? '🎁 Found something!' : '📦 Empty...') + '</div>';
    h += '<button class="abtn" id="btn-close-secret">Continue</button>';
  }
  h += '</div>';
  return h;
}

function rSkillTree(){
  let h = '<div style="padding:16px;">';
  h += '<h2 class="st">🌳 Skill Trees</h2>';
  if (!G.playerSpec.path) {
    h += '<div style="font-size:13px;color:var(--text-dim);margin-bottom:20px;text-align:center;">Choose your specialization at Level 3.</div>';
    h += '<div style="display:flex;flex-direction:column;gap:12px;">';
    for (let [key, path] of Object.entries(G.skillTrees)) {
      const canChoose = G.p.lvl >= 3;
      h += '<div class="spec-card" data-spec="' + key + '" style="background:var(--bg-card);border:2px solid '+(canChoose?path.color:'var(--disabled)')+';border-radius:16px;padding:16px;cursor:'+(canChoose?'pointer':'not-allowed')+';opacity:'+(canChoose?'1':'0.5')+';">';
      h += '<span style="font-size:32px;">' + path.icon + '</span>';
      h += '<div style="font-size:16px;font-weight:700;color:'+path.color+';">' + path.name + '</div>';
      h += '<div style="font-size:11px;color:var(--text-dim);">' + path.desc + '</div>';
      for (let i = 0; i < path.tiers.length; i++) {
        const tier = path.tiers[i];
        h += '<div style="font-size:12px;padding:8px;background:var(--bg-hover);border-radius:8px;margin-top:8px;">';
        h += '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:'+path.color+'20;color:'+path.color+';">Lv.' + tier.level + '</span> ';
        h += '<b>' + tier.name + '</b> — ' + tier.desc + '</div>';
      }
      if (!canChoose) h += '<div style="margin-top:10px;font-size:11px;color:var(--danger);text-align:center;">🔒 Requires Level 3</div>';
      h += '</div>';
    }
    h += '</div>';
  } else {
    const path = G.skillTrees[G.playerSpec.path];
    h += '<div style="text-align:center;margin-bottom:20px;">';
    h += '<span style="font-size:48px;">' + path.icon + '</span>';
    h += '<div style="font-size:20px;font-weight:700;color:'+path.color+';">' + path.name + '</div>';
    h += '</div>';
    for (let i = 0; i < path.tiers.length; i++) {
      const tier = path.tiers[i];
      const unlocked = G.playerSpec.tiers.includes(i);
      const canUnlock = canUnlockTier(i);
      h += '<div style="background:var(--bg-card);border:2px solid '+(unlocked?path.color:canUnlock?path.color+'60':'var(--disabled)')+';border-radius:14px;padding:14px;margin-bottom:12px;">';
      h += '<div style="font-weight:700;color:'+(unlocked?path.color:'var(--text-dim)')+';">' + (unlocked?'✅':canUnlock?'🔓':'🔒') + ' ' + tier.name + '</div>';
      h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:8px;">' + tier.desc + '</div>';
      if (unlocked) h += '<div style="font-size:11px;color:var(--success);font-weight:600;">✨ ACTIVE</div>';
      else if (canUnlock) h += '<button class="spec-unlock-btn" data-tier="' + i + '" style="width:100%;padding:10px;border-radius:10px;border:none;background:'+path.color+';color:white;font-size:13px;font-weight:600;cursor:pointer;">Unlock ' + tier.name + '</button>';
      else if (G.p.lvl < tier.level) h += '<div style="font-size:11px;color:var(--danger);">🔒 Requires Level ' + tier.level + '</div>';
      else h += '<div style="font-size:11px;color:var(--text-dim);">🔒 Complete previous tier</div>';
      h += '</div>';
    }
    const respecCost = 50 + (G.playerSpec.respecCount * 50);
    const canRespec = G.p.gold >= respecCost;
    h += '<button id="btn-respec" style="width:100%;padding:10px;border-radius:10px;border:1px solid '+(canRespec?'var(--danger)':'var(--disabled)')+';background:transparent;color:'+(canRespec?'var(--danger)':'var(--disabled)')+';font-size:12px;font-weight:600;cursor:'+(canRespec?'pointer':'not-allowed')+';">🔄 Respec (' + respecCost + 'G)</button>';
  }
  h += '</div>';
  return h;
}

function rMiniStory(){
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
function rJournal(){
  let h='<div style="padding:16px;">';
  h+='<div class="st">📖 Journal</div>';
  
  const entries=G.storyJournal.entries;
  const unlocked=G.storyJournal.unlocked;
  const read=G.storyJournal.read;
  
  if(entries.length===0){
    h+='<div class="ei">No entries yet.</div>';
    h+='</div>';
    return h;
  }
  
  for(let entry of entries){
    const isUnlocked=unlocked.includes(entry.id);
    const isRead=read.includes(entry.id);
    
    h+='<div class="zcard '+(isUnlocked?'':'locked')+'" data-jid="'+entry.id+'" style="margin-bottom:10px;">';
    h+='<div class="zh">';
    h+='<div class="zn">'+entry.icon+' '+entry.title+'</div>';
    h+='<div class="zl">Ch. '+entry.chapter+'</div>';
    h+='</div>';
    h+='<div class="zd">'+(isUnlocked?entry.summary:'???')+'</div>';
    
    if(isUnlocked){
      h+='<div style="display:flex;gap:8px;align-items:center;margin-top:8px;">';
      h+='<span style="font-size:11px;color:'+(isRead?'var(--success)':'var(--accent-light)')+';">';
      h+=isRead?'✓ Read':'● Unread';
      h+='</span>';
      h+='</div>';
    }else{
      h+='<div style="font-size:11px;color:var(--disabled);margin-top:8px;">';
      if(entry.unlockType==='level'){
        h+='🔒 Unlock at Level '+entry.unlockAt;
      }else if(entry.unlockType==='boss'){
        h+='🔒 Defeat '+entry.unlockAt;
      }else if(entry.unlockType==='zone'){
        h+='🔒 Visit '+entry.unlockAt;
      }
      h+='</div>';
    }
    h+='</div>';
  }
  
  h+='</div>';
  return h;
}

function rJournalEntry(jid){
  const entry=G.storyJournal.entries.find(e=>e.id===jid);
  if(!entry)return'<div>Entry not found</div>';
  
  if(!G.storyJournal.read.includes(jid)){
    G.storyJournal.read.push(jid);
  }
  
  let h='<div style="padding:16px;max-width:500px;margin:0 auto;">';
  h+='<div style="font-size:12px;color:var(--accent-light);text-transform:uppercase;letter-spacing:0.15em;margin-bottom:8px;">📖 Journal — Chapter '+entry.chapter+'</div>';
  h+='<h2 style="font-family:Cinzel,serif;font-size:22px;margin-bottom:4px;">'+entry.icon+' '+entry.title+'</h2>';
  h+='<div style="font-size:11px;color:var(--text-dim);margin-bottom:24px;">'+entry.summary+'</div>';
  
  h+='<div style="width:100%;height:4px;background:var(--timer-bg);border-radius:2px;margin-bottom:24px;">';
  h+='<div style="width:100%;height:100%;background:var(--accent);border-radius:2px;"></div></div>';
  
  for(let scene of entry.scenes){
    h+='<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:20px;margin-bottom:16px;text-align:left;">';
    h+='<div style="font-size:11px;font-weight:700;color:var(--accent-light);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.05em;">'+scene.speaker+'</div>';
    h+='<div style="font-size:14px;line-height:1.8;color:var(--text);font-style:italic;">'+scene.text+'</div>';
    h+='</div>';
  }
  
  h+='<button class="fbtn" id="btn-back-journal" style="margin-top:8px;">← Back to Journal</button>';
  h+='</div>';
  return h;
}

function rStory(){
  const chapter = G.storyChapters[G.story.chapter];
  const scene = chapter.scenes[G.story.scene];
  let h='<div class="story-view" style="text-align:center;padding:20px;">';
  h+='<div style="font-size:12px;color:var(--accent-light);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:20px;">Chapter '+(G.story.chapter+1)+': '+chapter.title+'</div>';
  h+='<div class="dialogue-box" style="margin-bottom:24px;">';
  h+='<div class="d-speaker">'+scene.speaker+'</div>';
  h+='<div class="d-text" style="font-size:15px;line-height:1.7;">'+scene.text+'</div>';
  h+='</div>';
  h+='<button class="abtn" style="max-width:200px;margin:0 auto;display:block;">Continue</button>';
  h+='<div style="margin-top:16px;font-size:11px;color:var(--text-dim);">'+(G.story.scene+1)+' / '+chapter.scenes.length+'</div>';
  h+='</div>';
  return h;
}

function rBestiary(){
  let h='<div class="bestiary-view"><h2 class="st">📖 Bestiary</h2>';
  const entries = Object.entries(G.bestiary).sort((a,b)=>b[1].kills-a[1].kills);
  if(entries.length===0){
    h+='<div style="text-align:center;padding:40px;color:var(--text-dim);">No creatures catalogued yet.<br>Defeat enemies to fill the bestiary.</div>';
  }else{
    h+='<div style="font-size:11px;color:var(--text-dim);margin-bottom:12px;">'+entries.length+' species discovered</div>';
    h+='<div class="zlist">';
    for(let [name,data] of entries){
      const elemIcon = data.elem==='fire'?'🔥':data.elem==='ice'?'❄️':data.elem==='lightning'?'⚡':data.elem==='void'?'🌑':'✦';
      h+='<div class="zcard" style="cursor:default;">';
      h+='<div class="zh"><span class="zn">'+ee(name)+' '+name+'</span><span class="zl">'+data.kills+' kills</span></div>';
      h+='<div style="display:flex;gap:12px;font-size:12px;color:var(--text-dim);margin-top:6px;">';
      h+='<span>HP: '+data.mhp+'</span><span>ATK: '+data.atk+'</span><span>DEF: '+data.def+'</span><span>'+elemIcon+' '+data.elem+'</span>';
      h+='</div>';
      h+='<div style="font-size:10px;color:var(--disabled);margin-top:4px;">First seen: '+new Date(data.firstSeen).toLocaleDateString()+'</div>';
      h+='</div>';
    }
    h+='</div>';
  }
  h+='</div>';
  return h;
}



function rRunes(){
  // If socket modal is open, render that instead
  if (G.runeSocketModal && G.runeSocketModal.open) {
    return rRuneSocketModal();
  }
  // If combine modal is open, render that instead
  if (G.runeCombineModal && G.runeCombineModal.open) {
    return rRuneCombineModal();
  }

  let h='<div style="padding:16px;"><h2 class="st">💎 Rune Socketing</h2>';

  // Rune inventory with better visual cards
  h+='<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">Rune Inventory ('+G.runes.length+')</div>';
  if(G.runes.length===0){
    h+='<div style="font-size:12px;color:var(--text-dim);padding:12px;background:var(--bg-card);border-radius:12px;margin-bottom:16px;">No runes yet. Defeat enemies in Lv 10+ zones to find them.</div>';
  }else{
    h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;">';
    for(let i=0;i<G.runes.length;i++){
      const r=G.runes[i];
      const rarityGlow = r.r==='rare'?'0 0 8px '+r.color+'40':r.r==='epic'?'0 0 12px '+r.color+'60':'';
      h+='<div class="rune-item" data-ri="'+i+'" style="background:var(--bg-card);border:2px solid '+r.color+';border-radius:12px;padding:10px 8px;text-align:center;cursor:pointer;user-select:none;box-shadow:'+rarityGlow+';transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.transform=\'none\'">';
      h+='<div style="font-size:24px;margin-bottom:4px;">'+r.icon+'</div>';
      h+='<div style="font-size:11px;font-weight:700;color:'+r.color+';">'+r.name+'</div>';
      h+='<div style="font-size:10px;color:var(--text-dim);margin-top:4px;">';
      const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[r.stat] || r.stat;
      h+= statLabel + ' +' + r.val;
      if(r.pct) h+=' ('+Math.floor(r.pct*100)+'%)';
      h+='</div>';
      h+='<div style="font-size:9px;color:var(--disabled);margin-top:2px;text-transform:uppercase;">'+r.r+'</div>';
      h+='</div>';
    }
    h+='</div>';

    // Combine button — now opens modal
    h+='<button id="btn-combine" style="width:100%;padding:12px;border-radius:12px;border:2px solid var(--accent);background:linear-gradient(135deg,var(--accent),#6d28d9);color:white;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:16px;box-shadow:0 2px 8px var(--shadow-accent);transition:transform 0.2s;" onmouseover="this.style.transform=\'translateY(-1px)\'" onmouseout="this.style.transform=\'none\'">';
    h+='🔮 Combine Runes';
    h+='</button>';
  }

  // Socketable gear with stat preview
  h+='<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">Socketable Gear</div>';
  const socketable = G.p.inv.filter(it => it.sockets && it.sockets.length > 0);
  if(socketable.length===0){
    h+='<div style="font-size:12px;color:var(--text-dim);padding:12px;background:var(--bg-card);border-radius:12px;">No socketed gear. Lv 10+ items have sockets.</div>';
  }else{
    h+='<div style="display:flex;flex-direction:column;gap:10px;">';
    for(let i=0;i<G.p.inv.length;i++){
      const it=G.p.inv[i];
      if(!it.sockets) continue;

      // Calculate current socket stats
      let currentStats = [];
      if (it.socketStats) {
        for (let k in it.socketStats) {
          if (k.endsWith('Pct')) continue;
          const label = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[k] || k;
          currentStats.push(label + '+' + it.socketStats[k]);
        }
      }

      h+='<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;transition:border-color 0.2s;" onmouseover="this.style.borderColor=\'var(--accent)\'" onmouseout="this.style.borderColor=\'var(--border)\'">';
      h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
      h+='<div style="font-weight:700;font-size:14px;color:'+rc(it.r)+';">'+it.n+'</div>';
      h+='<div style="font-size:10px;color:var(--text-dim);background:var(--bg-hover);padding:2px 8px;border-radius:8px;">iLvl '+it.ilvl+'</div>';
      h+='</div>';

      // Socket display with better visuals
      h+='<div style="display:flex;gap:8px;margin-bottom:10px;">';
      for(let s=0;s<it.sockets.length;s++){
        const socket = it.sockets[s];
        if(socket){
          h+='<div style="flex:1;background:'+socket.color+'15;border:2px solid '+socket.color+';border-radius:10px;padding:8px;text-align:center;">';
          h+='<div style="font-size:20px;">'+socket.icon+'</div>';
          h+='<div style="font-size:9px;font-weight:600;color:'+socket.color+';">'+socket.name.replace('Rune of ','')+'</div>';
          h+='</div>';
        }else{
          h+='<div style="flex:1;background:var(--bg-hover);border:2px dashed var(--disabled);border-radius:10px;padding:8px;text-align:center;opacity:0.6;">';
          h+='<div style="font-size:20px;color:var(--disabled);">○</div>';
          h+='<div style="font-size:9px;color:var(--disabled);">Empty</div>';
          h+='</div>';
        }
      }
      h+='</div>';

      // Current socket stats summary
      if(currentStats.length > 0){
        h+='<div style="font-size:10px;color:var(--success);margin-bottom:8px;padding:6px 10px;background:#22c55e10;border-radius:8px;">✨ Socketed: '+currentStats.join(' · ')+'</div>';
      }

      // Socket action buttons
      h+='<div style="display:flex;gap:6px;flex-wrap:wrap;">';
      for(let s=0;s<it.sockets.length;s++){
        if(!it.sockets[s]){
          h+='<button class="socket-btn" data-ii="'+i+'" data-si="'+s+'" style="flex:1;padding:8px 10px;border-radius:10px;border:1px dashed var(--accent);background:transparent;color:var(--accent);font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;">💎 Socket</button>';
        }else{
          h+='<button class="unsocket-btn" data-ii="'+i+'" data-si="'+s+'" style="flex:1;padding:8px 10px;border-radius:10px;border:1px solid '+it.sockets[s].color+';background:'+it.sockets[s].color+'15;color:'+it.sockets[s].color+';font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;">'+it.sockets[s].icon+' Remove</button>';
        }
      }
      h+='</div></div>';
    }
    h+='</div>';
  }

  h+='</div>';
  return h;
}

// NEW: Rune Socket Selection Modal
function rRuneSocketModal() {
  const { itemIndex, slotIndex } = G.runeSocketModal;
  const item = G.p.inv[itemIndex];
  if (!item) return '<div>Error</div>';

  let h = '<div style="padding:16px;">';
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">';
  h += '<button class="rune-modal-back" style="background:none;border:none;color:var(--accent);font-size:20px;cursor:pointer;padding:4px;">←</button>';
  h += '<h2 class="st" style="margin:0;">💎 Socket Rune</h2>';
  h += '</div>';

  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;">';
  h += '<div style="font-weight:700;font-size:14px;color:'+rc(item.r)+';">'+item.n+'</div>';
  h += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">Slot '+(slotIndex+1)+' of '+item.sockets.length+'</div>';

  // Show current socket stats on this item
  let currentStats = [];
  if (item.socketStats) {
    for (let k in item.socketStats) {
      if (k.endsWith('Pct')) continue;
      const label = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[k] || k;
      currentStats.push(label + '+' + item.socketStats[k]);
    }
  }
  if(currentStats.length > 0){
    h += '<div style="font-size:10px;color:var(--success);margin-top:8px;">Current sockets: '+currentStats.join(' · ')+'</div>';
  }
  h += '</div>';

  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">Choose a Rune ('+G.runes.length+' available)</div>';

  if(G.runes.length===0){
    h += '<div style="text-align:center;padding:20px;color:var(--text-dim);">No runes available!</div>';
  }else{
    h += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">';
    for(let i=0;i<G.runes.length;i++){
      const r=G.runes[i];
      const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[r.stat] || r.stat;

      // Calculate preview: what will this rune add?
      const currentVal = item.socketStats && item.socketStats[r.stat] ? item.socketStats[r.stat] : 0;
      const newVal = currentVal + r.val;

      h += '<button class="rune-select-btn" data-ri="'+i+'" style="background:var(--bg-card);border:2px solid '+r.color+';border-radius:14px;padding:14px;text-align:left;cursor:pointer;transition:all 0.2s;">';
      h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">';
      h += '<span style="font-size:28px;">'+r.icon+'</span>';
      h += '<div style="flex:1;">';
      h += '<div style="font-size:13px;font-weight:700;color:'+r.color+';">'+r.name+'</div>';
      h += '<div style="font-size:9px;color:var(--disabled);text-transform:uppercase;">'+r.r+'</div>';
      h += '</div>';
      h += '</div>';

      // Stat preview with before/after
      h += '<div style="background:var(--bg-hover);border-radius:8px;padding:8px 10px;margin-bottom:6px;">';
      h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:2px;">'+statLabel+'</div>';
      h += '<div style="display:flex;align-items:center;gap:6px;">';
      h += '<span style="font-size:11px;color:var(--text-dim);">'+currentVal+'</span>';
      h += '<span style="color:var(--success);font-size:12px;">→</span>';
      h += '<span style="font-size:14px;font-weight:700;color:'+r.color+';">'+newVal+'</span>';
      if(r.pct) h += '<span style="font-size:10px;color:var(--success);">(+'+Math.floor(r.pct*100)+'%)</span>';
      h += '</div></div>';

      h += '<div style="font-size:10px;color:var(--accent);text-align:center;font-weight:600;">Tap to Socket</div>';
      h += '</button>';
    }
    h += '</div>';
  }

  h += '</div>';
  return h;
}

// NEW: Rune Combine Modal
function rRuneCombineModal() {
  const selected = G.runeCombineModal.selected;
  const preview = getCombinePreview();

  let h = '<div style="padding:16px;">';
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">';
  h += '<button class="rune-modal-back" style="background:none;border:none;color:var(--accent);font-size:20px;cursor:pointer;padding:4px;">←</button>';
  h += '<h2 class="st" style="margin:0;">🔮 Combine Runes</h2>';
  h += '</div>';

  h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Select 3 runes of the same type to combine into a stronger version.</div>';

  // Selected runes display
  h += '<div style="display:flex;gap:8px;margin-bottom:16px;">';
  for(let i=0;i<3;i++){
    if(selected[i] !== undefined && G.runes[selected[i]]){
      const r = G.runes[selected[i]];
      h += '<div style="flex:1;background:'+r.color+'15;border:2px solid '+r.color+';border-radius:12px;padding:12px;text-align:center;">';
      h += '<div style="font-size:28px;">'+r.icon+'</div>';
      h += '<div style="font-size:10px;font-weight:600;color:'+r.color+';">'+r.name+'</div>';
      h += '</div>';
    }else{
      h += '<div style="flex:1;background:var(--bg-hover);border:2px dashed var(--disabled);border-radius:12px;padding:12px;text-align:center;opacity:0.5;">';
      h += '<div style="font-size:28px;color:var(--disabled);">?</div>';
      h += '<div style="font-size:10px;color:var(--disabled);">Slot '+(i+1)+'</div>';
      h += '</div>';
    }
  }
  h += '</div>';

  // Preview result
  if(preview && !preview.error){
    h += '<div style="background:linear-gradient(135deg,#7c3aed15,#a78bfa15);border:2px solid var(--accent);border-radius:14px;padding:16px;margin-bottom:16px;text-align:center;">';
    h += '<div style="font-size:11px;color:var(--accent-light);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Result Preview</div>';
    h += '<div style="font-size:36px;margin-bottom:4px;">'+preview.icon+'</div>';
    h += '<div style="font-size:16px;font-weight:700;color:var(--accent-light);">'+preview.name+'</div>';
    h += '<div style="font-size:11px;color:var(--success);margin-top:4px;">';
    const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[preview.stat] || preview.stat;
    h += statLabel + ' +' + preview.val;
    if(preview.pct) h += ' (+'+Math.floor(preview.pct*100)+'%)';
    h += '</div>';
    h += '<div style="font-size:10px;color:var(--gold);margin-top:4px;">'+preview.r.toUpperCase()+'</div>';
    h += '</div>';

    h += '<button id="btn-confirm-combine" style="width:100%;padding:14px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--accent),#6d28d9);color:white;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 2px 12px var(--shadow-accent);">✨ Combine!</button>';
  }else if(preview && preview.error){
    h += '<div style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:center;color:var(--danger);font-size:13px;">'+preview.error+'</div>';
  }else{
    h += '<div style="background:var(--bg-hover);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:16px;text-align:center;color:var(--text-dim);font-size:13px;">Select 3 matching runes to see the result</div>';
  }

  // Rune grid for selection
  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin:16px 0 10px;">Your Runes</div>';
  if(G.runes.length===0){
    h += '<div style="text-align:center;padding:20px;color:var(--text-dim);">No runes to combine.</div>';
  }else{
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">';
    for(let i=0;i<G.runes.length;i++){
      const r=G.runes[i];
      const isSelected = selected.includes(i);
      const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[r.stat] || r.stat;

      h += '<button class="rune-combine-select" data-ri="'+i+'" style="background:'+(isSelected?r.color+'30':'var(--bg-card)')+';border:2px solid '+(isSelected?r.color:'var(--border)')+';border-radius:12px;padding:10px 6px;text-align:center;cursor:pointer;transition:all 0.2s;position:relative;">';
      if(isSelected){
        h += '<div style="position:absolute;top:-6px;right:-6px;background:var(--accent);color:white;width:18px;height:18px;border-radius:50%;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;">✓</div>';
      }
      h += '<div style="font-size:22px;margin-bottom:4px;">'+r.icon+'</div>';
      h += '<div style="font-size:10px;font-weight:600;color:'+(isSelected?r.color:'var(--text)')+';">'+r.name.replace('Rune of ','')+'</div>';
      h += '<div style="font-size:9px;color:var(--text-dim);margin-top:2px;">'+statLabel+'+'+r.val+'</div>';
      h += '</button>';
    }
    h += '</div>';
  }

  h += '</div>';
  return h;
}

function rTalents(){
  let h='<div style="padding:16px;"><h2 class="st">🌟 Planar Talents</h2>';
  h+='<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;text-align:center;">Unlock every 2 levels starting at 16</div>';
  h+='<div style="display:flex;flex-direction:column;gap:10px;">';
  for(let t of TALENTS){
    const unlocked=G.talents.includes(t.id);
    const canUnlock=G.p.lvl>=t.lv;
    h+='<div style="background:var(--bg-card);border:2px solid '+(unlocked?'#22c55e':canUnlock?'#a78bfa':'#6b7280')+';border-radius:14px;padding:14px;opacity:'+(canUnlock?'1':'0.5')+';">';
    h+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">';
    h+='<span style="font-size:24px;">'+t.icon+'</span>';
    h+='<div style="flex:1;"><div style="font-weight:700;font-size:15px;color:'+(unlocked?'#22c55e':canUnlock?'var(--text)':'var(--text-dim)')+';">'+(unlocked?'✅ ':'')+t.name+'</div>';
    h+='<div style="font-size:11px;color:var(--text-dim);">Lv.'+t.lv+'</div></div>';
    h+='</div>';
    h+='<div style="font-size:12px;color:var(--text-dim);line-height:1.4;">'+t.desc+'</div>';
    if(unlocked) h+='<div style="font-size:11px;color:#22c55e;margin-top:6px;font-weight:600;">✨ ACTIVE</div>';
    else if(!canUnlock) h+='<div style="font-size:11px;color:var(--danger);margin-top:6px;">🔒 Requires Level '+t.lv+'</div>';
    h+='</div>';
  }
  h+='</div>';
  h+='<div style="margin-top:16px;font-size:11px;color:var(--text-dim);text-align:center;">'+G.talents.length+'/'+TALENTS.length+' talents unlocked</div>';
  h+='</div>';
  return h;
}

// === REPLACE your rGrindRoom function with this ===

function rGrindRoom() {
  const g = G.endlessGrind;
  let h = '<div class="content">';
  
  h += '<div class="st" style="text-align:center;">⚔️ Endless Grind Room</div>';
  
  // Stats bar
  h += '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:12px;flex-wrap:wrap;">';
  h += '<span class="mst">Wave: <b>' + g.wave + '</b></span>';
  h += '<span class="mst">Kills: <b>' + g.totalKills + '</b></span>';
  h += '<span class="mst">XP: <b>' + g.totalXp + '</b></span>';
  h += '<span class="mst" style="color:var(--gold)">Gold: <b>' + g.totalGold + '</b></span>';
  h += '</div>';
  
  // Difficulty badge
  const diffColors = { normal: '#22c55e', hard: '#f59e0b', nightmare: '#ef4444' };
  h += '<div style="text-align:center;margin-bottom:16px;">';
  h += '<span style="font-size:11px;padding:4px 12px;border-radius:10px;background:' + diffColors[g.difficulty] + '20;color:' + diffColors[g.difficulty] + ';font-weight:600;text-transform:uppercase;">';
  h += g.difficulty + ' (×' + g.difficultyMult[g.difficulty] + ')</span>';
  h += '</div>';
  
  // MAIN CONTROLS
  if (!g.active) {
    // Between waves or fresh start
    h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:12px;">';
    
    if (g.wave === 0) {
      // FRESH START - show all settings
      h += '<div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--accent-light);">Grind Settings</div>';
      
      // Tier selector
      h += '<div style="margin-bottom:12px;">';
      h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Max Zone Tier</div>';
      h += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
      const maxTier = Math.min(G.p.lvl, 23);
      for (let t = 1; t <= maxTier; t++) {
        const z = G.zones.find(zn => zn.lv === t);
        const name = z ? z.n.split(' ')[0] : 'Lv' + t;
        const isSel = g.maxZoneLevel === t;
        h += '<button onclick="setGrindTier(' + t + ')" style="padding:6px 10px;border-radius:8px;border:1px solid ' + (isSel ? 'var(--accent)' : 'var(--border)') + ';background:' + (isSel ? 'var(--accent)' : 'var(--bg-card)') + ';color:' + (isSel ? 'white' : 'var(--text)') + ';font-size:11px;cursor:pointer;">' + name + '</button>';
      }
      h += '</div></div>';
      
      // Difficulty toggle
      h += '<div style="margin-bottom:12px;">';
      h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Difficulty</div>';
      h += '<div style="display:flex;gap:6px;">';
      const diffs = ['normal', 'hard', 'nightmare'];
      for (let d of diffs) {
        const isSel = g.difficulty === d;
        h += '<button onclick="toggleGrindDifficulty()" style="flex:1;padding:8px;border-radius:8px;border:1px solid ' + (isSel ? diffColors[d] : 'var(--border)') + ';background:' + (isSel ? diffColors[d] + '20' : 'var(--bg-card)') + ';color:' + (isSel ? diffColors[d] : 'var(--text-dim)') + ';font-size:12px;font-weight:600;cursor:pointer;">' + d + '</button>';
      }
      h += '</div></div>';
      
      // Auto-next toggle
      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">';
      h += '<input type="checkbox" id="grind-autonext" ' + (g.autoNext ? 'checked' : '') + ' onchange="toggleAutoNext()" style="width:18px;height:18px;accent-color:var(--accent);">';
      h += '<label for="grind-autonext" style="font-size:13px;cursor:pointer;">Auto-start next wave</label>';
      h += '</div>';
      
      h += '<button onclick="enterGrindRoom()" class="abtn" style="width:100%;">Start Grinding</button>';
      
        } else {
      // BETWEEN WAVES - show Next Wave, Stop, and Leave options
      h += '<div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--accent-light);">Wave ' + g.wave + ' Complete!</div>';
      h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ready for the next wave?</div>';
      
      h += '<button onclick="startGrindWave()" class="abtn" style="width:100%;margin-bottom:8px;">▶️ Next Wave</button>';
      h += '<button onclick="exitGrindRoom()" style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:14px;font-weight:600;cursor:pointer;margin-bottom:8px;">⏹ Stop & Collect Loot</button>';
      
      // NEW: Leave and reset button
      h += '<button onclick="leaveAndResetGrind()" style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--text-dim);background:transparent;color:var(--text-dim);font-size:13px;font-weight:600;cursor:pointer;">🚪 Leave Room & Reset (Start Fresh)</button>';
    }
 
    h += '</div>';
    
  } else {
    // ACTIVE COMBAT - show STOP button
    h += '<div style="background:var(--bg-card);border:2px solid var(--danger);border-radius:14px;padding:16px;margin-bottom:12px;text-align:center;">';
    h += '<div style="font-size:13px;color:var(--text-dim);margin-bottom:10px;">Wave ' + g.wave + ' in progress...</div>';
    h += '<button onclick="exitGrindRoom()" style="width:100%;padding:14px;border-radius:12px;border:2px solid var(--danger);background:var(--danger);color:white;font-size:15px;font-weight:700;cursor:pointer;">⏹ STOP GRIND</button>';
    h += '<div style="font-size:11px;color:var(--text-dim);margin-top:8px;">Returns to camp with current loot</div>';
    h += '</div>';
  }
  
  // Session summary (always visible)
  if (g.wave > 0) {
    h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">📊 This Session</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;">';
    h += '<div>Started: <span style="color:var(--text-dim);">' + new Date(g.sessionStart).toLocaleTimeString() + '</span></div>';
    h += '<div>Waves: <span style="color:var(--accent-light);">' + g.wave + '</span></div>';
    h += '<div>Total Kills: <span style="color:var(--accent-light);">' + g.totalKills + '</span></div>';
    h += '<div>Total XP: <span style="color:var(--xp);">' + g.totalXp + '</span></div>';
    h += '<div>Total Gold: <span style="color:var(--gold);">' + g.totalGold + '</span></div>';
    h += '<div>Avg/ Wave: <span style="color:var(--text-dim);">' + (g.wave > 0 ? Math.floor(g.totalXp / g.wave) : 0) + ' XP</span></div>';
    h += '</div></div>';
  }
  
  h += '</div>';
  return h;
}

function setGrindTier(tier) {
  G.endlessGrind.maxZoneLevel = tier;
  lg('📍 Max tier set to ' + tier);
  render();
}


function rMenu(){
  const items=[
    {i:'⚔️',l:'Adventure',d:'Explore zones and fight',a:'explore'},
    {i:'👥',l:'Party',d:'Manage companions',a:'party'},
    {i:'✨',l:'Skills',d:'View mage abilities',a:'skills'},
    {i:'⚒️',l:'Crafting',d:'Brew potions, forge gear',a:'craft'},
    {i:'📜',l:'Quests',d:'View active quests',a:'quest'},
    {i:'🎒',l:'Inventory',d:'Manage items',a:'inventory'},
    {i:'📖',l:'Bestiary',d:'Catalogue of defeated foes',a:'bestiary'},
    {i:'🏆',l:'Achievements',d:'Track your milestones',a:'achievements'},
    {i:'🌳',l:'Skill Trees',d:'Choose your specialization',a:'skilltree'},
    {i:'🌟',l:'Talents',d:'View planar talents (Lv.16+)',a:'talents'},
    {i:'💎',l:'Runes',d:'Socket runes into gear (Lv.20+)',a:'runes'},
    {i:'📖',l:'Journal',d:'Chronicles of your journey',a:'journal'},
    {i:'🌀',l:'Grind Room',d:'Endless wave battles',a:'grind_room'},
    {i:'🧳',l:'Traders',d:'Buy from wandering merchants',a:'npc'},
    {i:'🧘',l:'Focus Mode',d:'5–25 min ADHD timer',a:'focus'},
    {i:'💤',l:'Rest',d:'Find a safe place to rest',a:'rest'},
  ];
  let h='<div class="grid2">';
  for(let m of items)h+='<div class="card" data-a="'+m.a+'"><div class="cicon">'+m.i+'</div><div class="clabel">'+m.l+'</div><div class="cdesc">'+m.d+'</div></div>';
  h+='</div>';
  // Theme toggle row
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  h+='<div style="margin-top:12px;text-align:center;">';
  h+='<button onclick="toggleTheme()" style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:10px 20px;color:var(--text);font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;">';
  h+= isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
  h+='</button></div>';
  h+='<div style="margin-top:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;">';
  h+='<h3 style="font-size:14px;margin-bottom:10px;color:var(--accent-light);">Save Data</h3>';
  h+='<div style="display:flex;gap:8px;flex-wrap:wrap;">';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;" id="btn-save">Save Now</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:#374151;" id="btn-export">Export</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:#374151;" id="btn-import">Import</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:var(--danger);" id="btn-reset">Reset</button>';
  h+='</div>';
  h+='<div style="margin-top:8px;font-size:11px;color:var(--text-dim);">Auto-saves every 30 seconds</div>';
  h+='</div>';
  return h;
}

function rExp(){
  let h='<div class="explore-view"><h2 class="st">Adventure Zones</h2><div class="zlist">';
  for(let i=0;i<G.zones.length;i++){
    const z=G.zones[i],lk=G.p.lvl<z.lv;
    const dc=z.dg=='low'?'#22c55e':z.dg=='medium'?'#eab308':z.dg=='high'?'#f97316':z.dg=='very high'?'#ef4444':'#a855f7';
    const hazard = G.zoneHazards[z.n];
    h+='<div class="zcard '+(lk?'locked':'')+'" data-i="'+i+'"><div class="zh"><span class="zn">'+z.n+'</span><span class="zl">Lv.'+z.lv+(lk?' 🔒':'')+'</span></div><div class="zd">'+z.d+'</div>';
    if(hazard){
      h+='<div style="font-size:10px;color:#f59e0b;margin-bottom:6px;">⚠️ Hazard: '+hazard.desc+'</div>';
    }
    h+='<div class="zm"><span class="db" style="background:'+dc+'20;color:'+dc+'">'+z.dg+'</span><span class="xb">'+z.xp+' XP</span></div></div>';
  }
  h+='</div></div>'; return h;
}

function rCbt() {
  let h = '<div class="combat-view"><h2 class="st">' + (G.currentBoss ? '⚔️ BOSS FIGHT' : 'Combat') + '</h2>';
  
  const synDesc = getSynergyDesc();
  if (synDesc) {
    h += '<div style="background:#7c3aed15;border:1px solid var(--accent);border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:var(--accent-light);">';
    h += '✨ ' + synDesc + '</div>';
  }

  // Planar Resonance Indicator (Phase 2)
  const zone = G.zones.find(z => z.en.includes(G.cbt.en[0]?.n));
  if (zone && zone.elem) {
    const resStatus = getResonanceStatus(zone.n);
    h += '<div style="background:' + resStatus.color + '15;border:1px solid ' + resStatus.color + ';border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:' + resStatus.color + ';">';
    h += resStatus.icon + ' ' + resStatus.text + '</div>';
  }

  // Dimensional Instability Indicator (Phase 2)
  const riftStatus = getRiftStatus();
  if (riftStatus) {
    h += '<div style="background:' + riftStatus.color + '15;border:1px solid ' + riftStatus.color + ';border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:' + riftStatus.color + ';">';
    h += riftStatus.icon + ' ' + riftStatus.name + ': ' + riftStatus.desc + ' (' + riftStatus.fightsLeft + ' fights left)</div>';
  }
  
  h += '<button id="btn-auto" style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid ' + (G.cbt.autoCombat ? '#22c55e' : 'var(--disabled)') + ';background:' + (G.cbt.autoCombat ? '#22c55e15' : 'transparent') + ';color:' + (G.cbt.autoCombat ? '#22c55e' : 'var(--text-dim)') + ';font-size:12px;font-weight:600;cursor:pointer;margin-bottom:12px;user-select:none;">';
  h += (G.cbt.autoCombat ? '🤖 AUTO ON — Tap to take control' : '🤖 Auto-Combat — Let AI fight') + '</button>';

  // Potion button
  const potions = getCombatPotions();
  const usablePotions = potions.filter(p => {
    if (p.t === 'revive') return getDeadParty().length > 0;
    return true;
  });
  h += '<button onclick="togglePotionMenu()" style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid ' + (usablePotions.length > 0 ? '#22c55e' : 'var(--disabled)') + ';background:' + (usablePotions.length > 0 ? '#22c55e15' : 'transparent') + ';color:' + (usablePotions.length > 0 ? '#22c55e' : 'var(--disabled)') + ';font-size:12px;font-weight:600;cursor:' + (usablePotions.length > 0 ? 'pointer' : 'not-allowed') + ';margin-bottom:12px;user-select:none;">';
  h += (G.potionMenu ? '❌ Close Potion Bag' : '🧪 Use Potion (' + usablePotions.length + ' usable)') + '</button>';

  // Potion menu
  if (G.potionMenu && potions.length > 0) {
    h += '<div style="background:var(--bg-card);border:1px solid #22c55e;border-radius:12px;padding:10px;margin-bottom:12px;">';
    h += '<div style="font-size:11px;color:#22c55e;margin-bottom:8px;">🧪 Quick Potion Bag</div>';
    h += '<div style="display:flex;flex-direction:column;gap:6px;">';
    for (let i = 0; i < G.p.inv.length; i++) {
      const it = G.p.inv[i];
      // Regular potions (heal/mana)
      if ((it.t === 'pot' || it.t === 'food' || it.t === 'drink') && (it.eff === 'heal' || it.eff === 'mana')) {
        const isHeal = it.eff === 'heal';
        const icon = isHeal ? '❤️' : '💧';
        const color = isHeal ? '#ef4444' : '#3b82f6';
        const current = isHeal ? G.p.hp + '/' + G.p.mhp : G.p.mp + '/' + G.p.mmp;
        const full = isHeal ? G.p.hp >= G.p.mhp : G.p.mp >= G.p.mmp;
        h += '<button onclick="usePotionInCombat(' + i + ')" style="padding:10px 14px;border-radius:10px;border:1px solid ' + color + ';background:' + color + '15;color:' + (full ? 'var(--disabled)' : color) + ';font-size:12px;font-weight:600;cursor:' + (full ? 'not-allowed' : 'pointer') + ';display:flex;justify-content:space-between;align-items:center;opacity:' + (full ? '0.5' : '1') + ';">';
        h += '<span>' + icon + ' ' + it.n + (it.q > 1 ? ' x' + it.q : '') + '</span>';
        h += '<span>' + (full ? 'FULL' : '+' + it.v + ' ' + (isHeal ? 'HP' : 'MP')) + ' · ' + current + '</span>';
        h += '</button>';
      }
      // Revive items (Phoenix Feather, etc.)
      else if (it.t === 'revive') {
        const deadMembers = getDeadParty();
        const hasDead = deadMembers.length > 0;
        const color = hasDead ? '#f59e0b' : 'var(--disabled)';
        const icon = '🔥';
        h += '<button onclick="usePotionInCombat(' + i + ')" style="padding:10px 14px;border-radius:10px;border:1px solid ' + color + ';background:' + color + '15;color:' + color + ';font-size:12px;font-weight:600;cursor:' + (hasDead ? 'pointer' : 'not-allowed') + ';display:flex;justify-content:space-between;align-items:center;opacity:' + (hasDead ? '1' : '0.5') + ';">';
        h += '<span>' + icon + ' ' + it.n + (it.q > 1 ? ' x' + it.q : '') + '</span>';
        h += '<span>' + (hasDead ? 'Revive 50% HP' : 'No one to revive') + ' · ' + deadMembers.length + ' down</span>';
        h += '</button>';
      }
    }
    h += '</div></div>';
  }
  
  // Reuse zone variable from resonance check above
  if (zone && G.zoneHazards[zone.n]) {
    const haz = G.zoneHazards[zone.n];
    h += '<div style="background:#f59e0b15;border:1px solid #f59e0b;border-radius:12px;padding:8px;margin-bottom:12px;font-size:11px;color:#f59e0b;">';
    h += '⚠️ Zone Hazard: ' + haz.name + ' — ' + haz.desc + '</div>';
  }
  
  if (G.currentBoss) {
    h += '<div style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:10px;margin-bottom:12px;font-size:12px;color:var(--danger);">';
    h += '🔥 ' + G.currentBoss.desc + '</div>';
  }
  
  const playerAC = getPlayerAC();
  const eqStats = getEquippedStats();
  h += '<div style="display:flex;justify-content:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;">';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">AC </span><span style="font-weight:700;color:var(--accent-light);">' + playerAC + '</span>';
  if(eqStats.def > 0) h += '<span style="font-size:9px;color:var(--success);"> +' + eqStats.def + 'eq</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">PROF </span><span style="font-weight:700;color:var(--gold);">+' + DICE.proficiencyBonus(G.p.lvl) + '</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">ATK </span><span style="font-weight:700;color:var(--hp);">+' + (eqStats.atk + (G.p.eq.weapon?.atk||0)) + '</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">CRIT </span><span style="font-weight:700;color:var(--danger);">' + Math.floor(getTotalCritChance() * 100) + '%</span>';
  if(eqStats.critChance > 0) h += '<span style="font-size:9px;color:var(--success);"> +' + Math.floor(eqStats.critChance*100) + '%eq</span>';
  h += '</div>';
  h += '</div>';
  
  h += '<div class="erow">';
  for (let i = 0; i < G.cbt.en.length; i++) {
    const e = G.cbt.en[i], d = e.hp <= 0, s = G.cbt.tg == i && !d ? 'sel' : '';
    const immuneFire = ['Fire Imp', 'Lava Slug', 'Ash Wraith'].includes(e.n);
    const immuneIce = ['Ice Elemental', 'Frost Wolf', 'Frozen Knight'].includes(e.n);
    const isBoss = e.mechanic ? true : false;
    const enemyAC = getEnemyAC(e);
    
    h += '<div class="ecard ' + (d ? 'dead' : '') + ' ' + s + '" data-i="' + i + '" style="' + (isBoss ? 'border-color:var(--danger);box-shadow:0 0 10px #ef444440;' : '') + '">';
    h += '<div class="eicon">' + (d ? '💀' : ee(e.n)) + '</div>';
    h += '<div class="ename">' + e.n + (isBoss ? ' 👑' : '') + '</div>';
    
    if (!d) {
      h += '<div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">AC ' + enemyAC + '</div>';
    }
    
    if (!d && e.elem && e.elem !== 'none') {
      const elemIcon = e.elem === 'fire' ? '🔥' : e.elem === 'ice' ? '❄️' : e.elem === 'lightning' ? '⚡' : e.elem === 'void' ? '🌑' : '✦';
      h += '<div style="font-size:10px;color:#f59e0b;margin-top:2px;">' + elemIcon + ' ' + e.elem + '</div>';
    }
    
    if (!d && e.status && e.status.length > 0) {
      const statusIcons = e.status.map(s => s.type === 'burn' ? '🔥' : s.type === 'poison' ? '☠️' : s.type === 'shock' ? '⚡' : '✦').join('');
      h += '<div style="font-size:10px;color:var(--danger);margin-top:2px;">' + statusIcons + ' (' + e.status[0].turns + 't)</div>';
    }
    
    if (!d && (immuneFire || immuneIce)) {
      h += '<div class="e-immune">' + (immuneFire ? '🔥 Fire Immune' : (immuneIce ? '❄️ Ice Immune' : '')) + '</div>';
    }
    
    if (!d && e.mechanic === 'resurrect') {
      h += '<div style="font-size:10px;color:var(--danger);">💀 Lives: ' + (e.resurrectCount + 1) + '</div>';
    }
    
    if (!d && e.mechanic === 'phase') {
      h += '<div style="font-size:10px;color:var(--accent-light);">💎 Phase ' + e.currentPhase + '/' + e.phases + '</div>';
    }
    
    h += (d ? '<div class="dt">DEFEATED</div>' : '<div class="hps"><div class="bf bf-hp" style="width:' + ((e.hp / e.mhp) * 100) + '%"></div></div><div class="hpt">' + e.hp + '/' + e.mhp + '</div>') + '</div>';
  }
  h += '</div>';
  
  h += '<div class="pstat"><div class="mst"><span class="md" style="background:#7c3aed"></span>San ' + G.p.hp + '/' + G.p.mhp + ' AC' + playerAC + '</div>';
  for (let p of G.party) {
    if (p.on) {
      h += '<div class="mst"><span class="md" style="background:' + p.col + '"></span>' + p.n + ' ' + p.hp + '/' + p.mhp + '</div>';
    }
  }
  h += '</div>';
  
  h += '<div class="skills"><h3>Select Skill</h3><div class="slist">';
  
  const basicSel = G.cbt.sk === -1 && !G.cbt.autoCombat ? 'sel' : '';
  h += '<div class="sbtn ' + basicSel + '" data-i="-1" ' + (G.cbt.autoCombat ? 'style="opacity:0.4;cursor:not-allowed;"' : '') + '>';
  h += '<div class="sn">🪄 Staff Swing</div>';
  h += '<div class="sc">0 MP · Physical · 1d4 + STR</div>';
  h += '<div class="sd">Swing your staff when your spell slots are spent.</div>';
  h += '</div>';
  
    const ls = G.p.skills.filter(s => s.on);
  for (let i = 0; i < ls.length; i++) {
    const s = ls[i];
    const costLabel = typeof getSpellCostLabel === 'function'
      ? getSpellCostLabel(s)
      : (s.c + ' MP');
    const u = G.p.mp >= s.c && !G.cbt.autoCombat;
    const sel = G.cbt.sk == i && !G.cbt.autoCombat ? 'sel' : '';
    const critPct = Math.floor(getTotalCritChance() * 100);
    const highTier = Number(s.slotTier || 1) >= 4;
    const nameStyle = highTier ? ' style="color:#ef4444;font-weight:700;"' : '';
    
    h += '<div class="sbtn ' + (u ? '' : 'dis') + ' ' + sel + '" data-i="' + i + '" ' +
         (G.cbt.autoCombat ? 'style="opacity:0.4;cursor:not-allowed;"' : '') + '>';
    h += '<div class="sn"' + nameStyle + '>' + (s.buff ? '🛡️' : '⚡') + ' ' + s.n + '</div>';
    h += '<div class="sc">' + costLabel + ' · ' + (s.dmg || 'Buff') + ' · ' +
         critPct + '% Crit' + (G.cbt.autoCombat ? ' · 🤖 AUTO' : '') + '</div>';
    h += '<div class="sd">' + s.d + '</div>';
    if (s.elem) {
      const weakAgainst = s.elem === 'fire' ? 'Ice' : s.elem === 'ice' ? 'Fire' : s.elem === 'lightning' ? 'Void' : '';
      if (weakAgainst) {
        h += '<div style="font-size:10px;color:var(--success);">Strong vs: ' + weakAgainst + '</div>';
      }
    }
    h += '</div>';
  }
  h += '</div>';
  
  const isBasic = G.cbt.sk === -1;
  const sk = isBasic ? null : ls[G.cbt.sk];
  const ca = isBasic 
    ? (G.cbt.tg >= 0 && !G.cbt.autoCombat) 
    : (sk && G.p.mp >= sk.c && !G.cbt.autoCombat);
  const si = isBasic ? -1 : G.p.skills.indexOf(sk);
  
  h += '<button class="abtn ' + (ca ? '' : 'dis') + '" data-si="' + si + '" data-ti="' + G.cbt.tg + '" ' + (G.cbt.autoCombat ? 'disabled style="opacity:0.4;"' : '') + '>';
  h += (isBasic ? '🪄 Staff Swing' : 'Cast ' + (sk ? sk.n : '...')) + '</button>';
  h += '<button class="fbtn" ' + (G.cbt.autoCombat ? 'disabled style="opacity:0.4;"' : '') + '>Flee</button>';
 
   // === GRIND ROOM WAVE CONTROLS ===
  if (G.endlessGrind.active) {
    h += '<div style="background:var(--bg-card);border:2px solid var(--accent);border-radius:14px;padding:14px;margin-top:16px;text-align:center;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">⚔️ Grind Room · Wave ' + G.endlessGrind.wave + '</div>';
    
    if (G.endlessGrind.autoNext) {
      h += '<div style="font-size:12px;color:var(--success);">🤖 Auto-next: ON</div>';
    } else {
      h += '<button onclick="startGrindWave()" class="abtn" style="width:100%;margin-bottom:8px;">▶️ Next Wave</button>';
    }
    
    h += '<button onclick="exitGrindRoom()" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:13px;font-weight:600;cursor:pointer;">⏹ Stop & Exit</button>';
    h += '</div>';
  }
  // === END GRIND ROOM WAVE CONTROLS ===

  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:12px;margin-top:12px;">';
  h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">🎲 D&D Combat Rules</div>';
  h += '<div style="font-size:10px;color:var(--text-dim);line-height:1.6;">';
  h += '• Attack: d20 + PROF(+' + DICE.proficiencyBonus(G.p.lvl) + ') + Ability Mod vs Target AC<br>';
  h += '• Natural 20 = Critical Hit (double dice)<br>';
  h += '• Natural 1 = Critical Miss (auto-fail)<br>';
  h += '• Advantage: Roll 2d20, keep higher<br>';
  h += '• Your AC: ' + playerAC + ' | INT Mod: ' + (DICE.abilityMod(G.p.stats.int) >= 0 ? '+' : '') + DICE.abilityMod(G.p.stats.int);
  h += '</div></div>';
  
  h += '</div></div>';
  return h;
}


function rParty(){
  let h='<div class="party-view"><h2 class="st">Party</h2>';
  const activeSyns = getActiveSynergies();
  if(activeSyns.length > 0){
    h += '<div style="background:var(--bg-card);border:1px solid var(--accent);border-radius:14px;padding:12px;margin-bottom:16px;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">✨ Active Synergies</div>';
    h += '<div style="display:flex;flex-direction:column;gap:8px;">';
    for(let syn of activeSyns){
      h += '<div style="display:flex;align-items:center;gap:8px;font-size:12px;">';
      h += '<span style="font-size:16px;">' + syn.icon + '</span>';
      h += '<div style="flex:1;"><div style="font-weight:600;">' + syn.name + '</div>';
      h += '<div style="font-size:10px;color:var(--text-dim);">' + syn.desc + '</div></div>';
      h += '</div>';
    }
    h += '</div></div>';
  }
  h += '<div class="plist">';
  for(let p of G.party){
    h+='<div class="pcard '+(p.on?'':'locked')+'"><div class="pava" style="background:'+p.col+'20;border-color:'+p.col+'"><span style="font-size:28px">'+(p.on?re(p.r):'🔒')+'</span></div><div class="pinfo"><div class="pn">'+p.n+' <span class="pt">'+p.t+'</span></div><div class="pr" style="color:'+p.col+'">'+p.r+'</div><div class="pd">'+p.d+'</div><div class="pb">'+p.b+'</div>'+(p.on?'<div class="ps">HP:'+p.hp+'/'+p.mhp+' ATK:'+p.atk+(p.gear&&p.gear.atk?'(+'+p.gear.atk+')':'')+' DEF:'+p.def+(p.gear&&p.gear.def?'(+'+p.gear.def+')':'')+' SPD:'+p.spd+(p.gear&&p.gear.spd?'(+'+p.gear.spd+')':'')+(getBlessDef(p)?' <span style="color:var(--rest);font-weight:700;">🐱+10 DEF</span>':'')+'</div>':'')+(G.affinity[p.n]?'<div class="affinity-bar"><div class="affinity-fill '+getAffinityColor(G.affinity[p.n].val)+'" style="width:'+(G.affinity[p.n].val/G.affinity[p.n].max*100)+'%"></div></div><div class="affinity-label">'+(G.affinity[p.n].val>=70?'💕 Close':G.affinity[p.n].val>=40?'💛 Friendly':G.affinity[p.n].val>=20?'💔 Distant':'💀 Strained')+' ('+G.affinity[p.n].val+'/'+G.affinity[p.n].max+')</div>':'')
+(G.affinityUnlocks[p.n]?'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">'+G.affinityUnlocks[p.n].map(function(u){var un=p.affinityBonuses&&p.affinityBonuses.includes(u.id);return '<span title="'+u.d+'" style="font-size:9px;padding:2px 6px;border-radius:8px;border:1px solid '+(un?'var(--xp);color:var(--xp);':'var(--border);color:var(--text-dim);opacity:0.6;')+'">'+(un?'🌟 ':'🔒 ')+u.n+' ('+u.th+')</span>';}).join('')+'</div>':'')+'</div></div>';
    // === STAGE 1: ENHANCED TRINKET/GEAR SYSTEM ===
    if(p.on || p.ul <= G.p.lvl){
      h += '<div style="background:var(--bg-hover);border:1px solid var(--border);border-radius:10px;padding:10px;margin-top:8px;">';
      h += '<div style="font-size:11px;font-weight:600;color:var(--accent-light);margin-bottom:6px;">🎁 Trinket Slot</div>';
      if(p.gear){
        // Equipped trinket display with rarity color
        const rarityColor = p.gear.r ? (p.gear.r==='epic'?'#a855f7':p.gear.r==='rare'?'#3b82f6':p.gear.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
        h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
        h += '<span style="font-size:12px;font-weight:600;color:'+rarityColor+';">' + p.gear.n + '</span>';
        h += '<button class="unequip-pgear" data-member="' + p.n + '" style="padding:4px 10px;border-radius:8px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:11px;font-weight:600;cursor:pointer;">Unequip</button>';
        h += '</div>';
        h += '<div style="font-size:10px;color:var(--text-dim);">';
        const stats = [];
        if(p.gear.atk) stats.push('+ ' + p.gear.atk + ' ATK');
        if(p.gear.def) stats.push('+ ' + p.gear.def + ' DEF');
        if(p.gear.hp) stats.push('+ ' + p.gear.hp + ' HP');
        if(p.gear.mp) stats.push('+ ' + p.gear.mp + ' MP');
        if(p.gear.spd) stats.push('+ ' + p.gear.spd + ' SPD');
        h += stats.join(' · ') + '</div>';
        if(p.gear.d) h += '<div style="font-size:10px;color:var(--accent-light);margin-top:4px;font-style:italic;">' + p.gear.d + '</div>';
      } else {
        h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Empty trinket slot</div>';
        // Show ALL equippable pgear items (not just for this member)
        const allPgear = G.p.inv.map((it, idx) => ({it, idx})).filter(x => x.it.t === 'pgear');
        if(allPgear.length > 0){
          h += '<div style="display:flex;flex-direction:column;gap:4px;">';
          for(let eq of allPgear){
            const isForThis = !eq.it.for || eq.it.for === p.n;
            const rarityColor = eq.it.r ? (eq.it.r==='epic'?'#a855f7':eq.it.r==='rare'?'#3b82f6':eq.it.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
            if(isForThis){
              h += '<button class="equip-pgear" data-member="' + p.n + '" data-idx="' + eq.idx + '" style="padding:6px 10px;border-radius:8px;border:1px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:11px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
              h += '<span style="color:'+rarityColor+';">' + eq.it.n + '</span>';
              h += '<span style="font-size:10px;color:var(--text-dim);">Equip →</span>';
              h += '</button>';
            }
          }
          // Show incompatible items as disabled
          const incompatible = allPgear.filter(x => x.it.for && x.it.for !== p.n);
          if(incompatible.length > 0){
            h += '<div style="font-size:10px;color:var(--disabled);margin-top:4px;padding-top:4px;border-top:1px solid var(--border);">Not for ' + p.n + ':</div>';
            for(let eq of incompatible){
              h += '<div style="padding:4px 10px;border-radius:8px;background:var(--nav-bg);color:var(--disabled);font-size:10px;">' + eq.it.n + ' (' + eq.it.for + ' only)</div>';
            }
          }
          h += '</div>';
        } else {
          h += '<div style="font-size:10px;color:var(--disabled);margin-top:4px;">Buy trinkets from traders like Ribald, Deidre, or Nym.</div>';
        }
      }
      h += '</div>';
    }
  }
  h+='</div></div>'; return h;
}
function rSkills(){
  let h='<div class="skills-view"><h2 class="st">Mage Skills</h2><div class="sklist">';
  for(let s of G.p.skills){
    const st=s.on?'LEARNED':'Unlocks Lv.'+s.ul;
    h+='<div class="skcard '+(s.on?'':'locked')+'"><div class="skh"><span class="ski">'+(s.buff?'🛡️':'⚡')+'</span><span class="skt">'+s.n+'</span><span class="sks">'+st+'</span></div><div class="skd"><span class="dp">'+s.c+' MP</span><span class="dp">'+(s.dmg||'Buff')+'</span></div><div class="skdsc">'+s.d+'</div></div>';
  }
  h+='</div><div class="stb"><h3>Character Stats</h3>';
  for(let [k,v] of Object.entries(G.p.stats))h+='<div class="str"><span class="stn">'+k.toUpperCase()+'</span><span class="stv">'+v+'</span></div>';
  h+='</div></div>'; return h;
}

function getEquipScore(item) {
  if (!item || !item.slot) return 0;
  let score = 0;
  if (item.atk) score += item.atk * 3;
  if (item.def) score += item.def * 3;
  if (item.int) score += item.int * 2;
  if (item.str) score += item.str * 2;
  if (item.dex) score += item.dex * 2;
  if (item.con) score += item.con * 2;
  if (item.wis) score += item.wis * 2;
  if (item.cha) score += item.cha * 1;
  if (item.fireDmg) score += item.fireDmg * 2;
  if (item.iceDmg) score += item.iceDmg * 2;
  if (item.lightDmg) score += item.lightDmg * 2;
  if (item.voidDmg) score += item.voidDmg * 2;
  if (item.arcaneDmg) score += item.arcaneDmg * 2;
  if (item.lifeSteal) score += item.lifeSteal * 10;
  if (item.critChance) score += item.critChance * 20;
  if (item.mpRegen) score += item.mpRegen * 2;
  if (item.hpRegen) score += item.hpRegen * 2;
  return score;
}

function getEquipComparison(item) {
  if (!item || !item.slot) return null;
  const slot = item.slot === 'ring' ? (G.p.eq.ring1 ? 'ring2' : 'ring1') : item.slot;
  const equipped = G.p.eq[slot];
  if (!equipped) return { better: true, arrow: '▲', color: '#22c55e', text: 'New slot' };
  const itemScore = getEquipScore(item);
  const eqScore = getEquipScore(equipped);
  if (itemScore > eqScore) return { better: true, arrow: '▲', color: '#22c55e', text: 'Upgrade' };
  if (itemScore < eqScore) return { better: false, arrow: '▼', color: '#ef4444', text: 'Downgrade' };
  return { better: false, arrow: '●', color: '#9ca3af', text: 'Sidegrade' };
}

function rInv(){
  let h='<div class="inventory-view"><h2 class="st">Inventory</h2>';

  // Equipment Stats Summary
  const eqStats = getEquippedStats();
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:12px;margin-bottom:16px;">';
  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">⚔️ Equipment Bonuses</div>';
  h += '<div style="display:flex;flex-wrap:wrap;gap:6px;font-size:10px;">';
  const statLabels = {atk:'ATK',def:'DEF',str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA',
                      fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',
                      lifeSteal:'🩸Leech',critChance:'💥Crit',mpRegen:'💧MP+',hpRegen:'💚HP+',goldFind:'💰Gold'};
  for(let k in statLabels){
    if(eqStats[k] > 0){
      const val = k === 'critChance' || k.includes('Res') ? (eqStats[k]*100)+'%' : (k.includes('Regen') ? '+'+eqStats[k]+'/turn' : '+'+eqStats[k]);
      h += '<span style="background:var(--bg-hover);padding:3px 8px;border-radius:8px;">'+statLabels[k]+' '+val+'</span>';
    }
  }
  h += '</div></div>';

  // Equipped Gear
  h+='<div class="eqs"><h3>Equipped Gear</h3><div class="eqg">';
  const slotOrder = ['weapon','armor','head','hands','feet','ring1','ring2','amulet'];
  const slotIcons = {weapon:'⚔️',armor:'🛡️',head:'🎓',hands:'🧤',feet:'👢',ring1:'💍',ring2:'💍',amulet:'📿'};
  for(let sl of slotOrder){
    const it=G.p.eq[sl];
    const slotName = EQUIPMENT_SLOTS[sl].name;
    h+='<div class="esl" style="cursor:pointer;" onclick="unequipItem(\'"+sl+"\')">';
    h+='<div class="esn">'+slotIcons[sl]+' '+slotName+'</div>';
    if(it){
      h+='<div class="eit" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      let stats = [];
      if(it.atk) stats.push('ATK+'+it.atk);
      if(it.def) stats.push('DEF+'+it.def);
      if(it.int) stats.push('INT+'+it.int);
      if(it.str) stats.push('STR+'+it.str);
      if(it.dex) stats.push('DEX+'+it.dex);
      if(it.con) stats.push('CON+'+it.con);
      if(it.wis) stats.push('WIS+'+it.wis);
      if(it.cha) stats.push('CHA+'+it.cha);
      if(it.prefix) stats.push(it.prefixData.desc);
      if(it.suffix) stats.push(it.suffixData.desc);
      h+='<div class="est">'+stats.join(' · ')+'</div>';
    }else{
      h+='<div class="ese">Empty</div>';
    }
    h+='</div>';
  }
  h+='</div></div>';

  // Categorize inventory items
  const equipItems = [];
  const consumableItems = [];
  const matItems = [];
  const otherItems = [];
  
  for(let i=0; i<G.p.inv.length; i++){
    const it = G.p.inv[i];
    const isEquip = it.slot && it.slot !== 'mat' && it.slot !== 'pot' && it.slot !== 'revive' && it.t !== 'food' && it.t !== 'drink';
    if(isEquip) equipItems.push({item: it, index: i});
    else if(it.t==='pot' || it.t==='food' || it.t==='drink' || it.t==='revive') consumableItems.push({item: it, index: i});
    else if(it.t==='mat') matItems.push({item: it, index: i});
    else otherItems.push({item: it, index: i});
  }

  // Equipment section
  if(equipItems.length > 0){
    h+='<div class="its"><h3>🎒 Equipment ('+equipItems.length+')</h3><div class="ig">';
    for(let ei of equipItems){
      const it = ei.item;
      const i = ei.index;
      const cmp = getEquipComparison(it);
      h+='<div class="ic" style="position:relative;">';
      if(cmp){
        h+='<div style="position:absolute;top:6px;right:6px;font-size:14px;color:'+cmp.color+';font-weight:700;" title="'+cmp.text+'">'+cmp.arrow+'</div>';
      }
      h+='<div class="ii">'+(EQUIPMENT_SLOTS[it.slot]?.icon || '⚔️')+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.ilvl) h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      h += getItemSocketDisplay(it);
      let statLine = [];
      if(it.atk) statLine.push('ATK+'+it.atk);
      if(it.def) statLine.push('DEF+'+it.def);
      if(it.int) statLine.push('INT+'+it.int);
      if(it.str) statLine.push('STR+'+it.str);
      if(it.dex) statLine.push('DEX+'+it.dex);
      if(it.con) statLine.push('CON+'+it.con);
      if(it.wis) statLine.push('WIS+'+it.wis);
      if(it.cha) statLine.push('CHA+'+it.cha);
      if(it.prefix) statLine.push(it.prefixData.desc);
      if(it.suffix) statLine.push(it.suffixData.desc);
      if(statLine.length > 0) h+='<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">'+statLine.join(' · ')+'</div>';
      h+='<div class="iq">'+(it.value ? it.value+'G' : '')+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-e" data-i="'+i+'">Equip</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Consumables section
  if(consumableItems.length > 0){
    h+='<div class="its"><h3>🧪 Consumables ('+consumableItems.length+')</h3><div class="ig">';
    for(let ci of consumableItems){
      const it = ci.item;
      const i = ci.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.eff==='heal') h+='<div style="font-size:10px;color:var(--success);">+'+it.v+' HP</div>';
      if(it.eff==='mana') h+='<div style="font-size:10px;color:var(--mp);">+'+it.v+' MP</div>';
      if(it.eff==='revive') h+='<div style="font-size:10px;color:var(--accent-light);">Revive '+it.v+'% HP</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-u" data-i="'+i+'">Use</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Materials section
  if(matItems.length > 0){
    h+='<div class="its"><h3>💎 Materials ('+matItems.length+')</h3><div class="ig">';
    for(let mi of matItems){
      const it = mi.item;
      const i = mi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  // Other items
  if(otherItems.length > 0){
    h+='<div class="its"><h3>📦 Other ('+otherItems.length+')</h3><div class="ig">';
    for(let oi of otherItems){
      const it = oi.item;
      const i = oi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  if(G.p.inv.length==0) h+='<div class="ei">Your pack is empty.</div>';
  h+='</div>';
  return h;
}

function rCraft(){
  let h='<div class="craft-view"><h2 class="st">Crafting</h2><div class="rlist">';
  for(let i=0;i<G.recipes.length;i++){
    const r=G.recipes[i]; let ok=true,ms='';
    for(let [mn,mq] of Object.entries(r.m)){
      const iv=G.p.inv.find(x=>x.n==mn);
      const hv=iv?iv.q:0,en=hv>=mq;
      if(!en)ok=false;
      ms+='<span class="mp '+(en?'ok':'miss')+'">'+mn+': '+hv+'/'+mq+'</span>';
    }
    h+='<div class="rc"><div class="rr"><span class="ri">'+ie(r.res)+'</span><span class="rn" style="color:'+rc(r.res.r)+'">'+r.n+'</span><span class="rd">'+r.d+'</span></div><div class="rms">'+ms+'</div><button class="cb '+(ok?'':'dis')+'" data-i="'+i+'">Forge</button></div>';
  }
  h+='</div></div>'; return h;
}

function toggleQuestCollapse(key){
  G.questCollapsed[key] = !G.questCollapsed[key];
  render();
}

function rQuest(){
  let h='<div class="quest-view">';
    // === DAILY LOGIN REWARDS ===
  const today = G.gameDay || 0;
  const streak = G.loginStreak || 0;
  const claimedToday = G.loginClaimed || false;

  const loginRewards = [
    { day: 1, icon: '💰', name: 'Gold Pouch', g: 50, xp: 25 },
    { day: 2, icon: '💧', name: 'Mana Crystal', mp: 30, xp: 35 },
    { day: 3, icon: '🧪', name: 'Health Potion', hp: 50, xp: 45 },
    { day: 4, icon: '💎', name: 'Gem Shard', g: 100, xp: 60 },
    { day: 5, icon: '⚔️', name: 'Mystic Scroll', g: 150, xp: 80 },
    { day: 6, icon: '🔮', name: 'Arcane Orb', mp: 50, xp: 100 },
    { day: 7, icon: '👑', name: 'Legendary Cache', g: 300, xp: 200, item: { n: 'Phoenix Feather', t: 'revive', eff: 'revive', v: 50, q: 1, r: 'rare' } }
  ];

  const todayReward = loginRewards[Math.min(streak, 6)];

  h += '<div style="background: linear-gradient(135deg, var(--accent), #6d28d9); border-radius: 16px; padding: 16px; margin-bottom: 16px; color: white;">';
  h += '<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">';
  h += '<div style="font-size: 28px;">🎁</div>';
  h += '<div><div style="font-weight: 700; font-size: 16px;">Daily Login Reward</div>';
  h += '<div style="font-size: 11px; opacity: 0.9;">Day ' + (streak + 1) + ' · Streak: ' + streak + '</div></div>';
  h += '</div>';

  h += '<div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px; margin-bottom: 12px;">';
  h += '<div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">Today\'s Reward:</div>';
  h += '<div style="display: flex; align-items: center; gap: 8px;">';
  h += '<div style="font-size: 32px;">' + todayReward.icon + '</div>';
  h += '<div style="flex: 1;">';
  h += '<div style="font-weight: 600; font-size: 14px;">' + todayReward.name + '</div>';
  h += '<div style="font-size: 11px; opacity: 0.85;">';
  const rewardParts = [];
  if (todayReward.g) rewardParts.push('+' + todayReward.g + 'G');
  if (todayReward.xp) rewardParts.push('+' + todayReward.xp + 'XP');
  if (todayReward.hp) rewardParts.push('+' + todayReward.hp + 'HP');
  if (todayReward.mp) rewardParts.push('+' + todayReward.mp + 'MP');
  if (todayReward.item) rewardParts.push(todayReward.item.n);
  h += rewardParts.join(' · ');
  h += '</div></div></div></div>';

  // Streak progress dots
  h += '<div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 12px;">';
  for (let i = 0; i < 7; i++) {
    const isActive = i < streak;
    const isToday = i === streak;
    h += '<div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; ' + 
      (isActive ? 'background: #fbbf24; color: #000;' : 
       isToday ? 'background: white; color: var(--accent); border: 2px solid #fbbf24;' : 
       'background: rgba(255,255,255,0.2); color: white;') + '">' + (i + 1) + '</div>';
  }
  h += '</div>';

  if (claimedToday) {
    h += '<button disabled style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: rgba(255,255,255,0.2); color: white; font-size: 13px; font-weight: 600; opacity: 0.6; cursor: not-allowed;">✅ Claimed Today — Come Back Tomorrow!</button>';
  } else {
    h += '<button id="btn-claim-login" style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: #fbbf24; color: #000; font-size: 13px; font-weight: 700; cursor: pointer;">🎁 Claim Reward</button>';
  }
  h += '</div>';
  // === END DAILY LOGIN ===

  // Storyline section
  h+='<h2 class="st">📖 Storyline</h2><div class="qlist">';
  for(let s of G.storyline){
    if(!s.unlocked) continue;
    const pc=Math.min(100,(G.p.lvl/s.need)*100);
    h+='<div class="qc '+(s.done?'done':'')+'" style="border-color:var(--accent-light);"><div class="qh"><span class="qn">'+(s.done?'✅ ':'')+'Ch.'+s.chapter+': '+s.n+'</span><span class="qr">'+s.rw.xp+' XP | '+s.rw.g+' G</span></div>';
    h+='<div class="qd">'+s.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">Lv.'+G.p.lvl+'/'+s.need+'</span></div></div>';
  }
  h+='</div>';
  // Active quests section
  h+='<h2 class="st" style="margin-top:20px;">📜 Active Quests</h2><div class="qlist">';
  for(let q of G.quests){
    if(q.hidden && !q.revealed) continue;
    const pc=Math.min(100,(q.c/q.need)*100);
    const timerStatus=getTimerStatus(q);
    let cardClass=q.done?'done':(q.expired?'expired':(timerStatus?(timerStatus.cls==='timer-urgent'?'timed-urgent':'timed'):''));
    h+='<div class="qc '+cardClass+'"><div class="qh"><span class="qn">'+(q.done?'✅ ':(q.expired?'❌ ':''))+q.n+'</span><span class="qr">'+q.rw.xp+' XP | '+q.rw.g+' G</span></div>';
    if(q.chain){
      h+='<div style="font-size:10px;color:var(--accent-light);margin-bottom:4px;">🔗 Chain: '+q.chain+'</div>';
    }
    if(q.reqQuest && !q.revealed){
      const req=G.quests.find(rq=>rq.id===q.reqQuest);
      h+='<div style="font-size:10px;color:var(--text-dim);font-style:italic;margin-bottom:4px;">🔒 Requires: '+(req?req.n:'Unknown')+'</div>';
    }
    h+='<div class="qd">'+q.d+'</div>';
    if(timerStatus){
      h+='<div class="timer-bar"><div class="timer-fill '+timerStatus.cls+'" style="width:'+timerStatus.pct+'%"></div></div>';
      h+='<div class="timer-label">⏰ '+timerStatus.label+'</div>';
    }
    h+='<div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+Math.min(q.c,q.need)+'/'+q.need+'</span></div></div>';
  }
  h+='</div>';
    // Daily Quests section
  h += '<h2 class="st" style="margin-top:20px;">📋 Daily Quests</h2><div class="qlist">';
  generateDailyQuests();
  if (G.dailyQuests.length === 0) {
    h += '<div class="qc"><div class="qd">No daily quests available. Check back tomorrow!</div></div>';
  } else {
    for (let q of G.dailyQuests) {
      const pc = Math.min(100, (q.c / q.need) * 100);
      h += '<div class="qc ' + (q.done ? 'done' : '') + '"><div class="qh"><span class="qn">' + q.n + '</span><span class="qr">' + q.rw.xp + ' XP | ' + q.rw.g + ' G</span></div>';
      h += '<div class="qd">' + q.d + '</div><div class="qp"><div class="pbar"><div class="pfill" style="width:' + pc + '%"></div></div><span class="ptxt">' + q.c + '/' + q.need + '</span></div></div>';
    }
  }
  h += '</div>';
    // Bounties section
  const activeBounties = G.bounties.filter(b => !b.done && G.p.lvl >= (b.minLv || 1));
  const doneBounties = G.bounties.filter(b => b.done);
  if (activeBounties.length > 0 || doneBounties.length > 0) {
    h+='<h2 class="st" style="margin-top:20px;">💰 Bounties</h2>';
    if (activeBounties.length > 0) {
      h+='<div class="qlist">';
      for(let b of activeBounties){
        const pc=Math.min(100,(b.c/b.need)*100);
        h+='<div class="qc"><div class="qh"><span class="qn">'+b.n+'</span><span class="qr">'+b.rw.xp+' XP | '+b.rw.g+' G</span></div>';
        h+='<div class="qd">'+b.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+b.c+'/'+b.need+'</span></div></div>';
      }
      h+='</div>';
    }
    if (doneBounties.length > 0) {
      const collapsed = G.questCollapsed['__bounties_done__'];
      h+='<div style="margin-top:12px;">';
      h+='<div onclick="toggleQuestCollapse(\'__bounties_done__\')" style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:12px 16px;background:var(--bg-hover);border-radius:14px;border:1px solid var(--border);user-select:none;">';
      h+='<span style="font-size:12px;transition:transform 0.2s;display:inline-block;' + (collapsed ? '' : 'transform:rotate(90deg);') + '">▶</span>';
      h+='<span style="font-size:14px;font-weight:600;color:var(--success);">✅ Claimed</span>';
      h+='<span style="font-size:12px;color:var(--text-dim);margin-left:auto;">' + doneBounties.length + '</span>';
      h+='</div>';
      if (!collapsed) {
        h+='<div class="qlist" style="margin-top:8px;">';
        for(let b of doneBounties){
          h+='<div class="qc done" style="opacity:0.55;"><div class="qh"><span class="qn" style="text-decoration:line-through;">'+b.n+'</span><span class="qr" style="color:var(--success);">✓</span></div>';
          h+='<div class="qd">'+b.d+'</div></div>';
        }
        h+='</div>';
      }
      h+='</div>';
    }
  }
  h+='</div>';
  h+='<div class="sum"><div class="si2"><span class="sv">'+G.p.kills+'</span><span class="sl">Monsters</span></div><div class="si2"><span class="sv">'+G.p.quests+'</span><span class="sl">Quests</span></div><div class="si2"><span class="sv">'+G.p.fstreak+'</span><span class="sl">Focus</span></div></div></div>';
  return h;
}

function rFocus(){
  // If focus is not active, show the session picker
  if (!G.fs || G.state !== 'focus') {
    let h = '<div class="fv">';
    h += '<div style="font-size:42px;margin-bottom:8px;">🧘</div>';
    h += '<div class="fl" style="font-size:18px;font-weight:700;margin-bottom:4px;">Focus Mode</div>';
    h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:20px;">Pick a session length</div>';
    h += '<div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:0 auto;">';
    const sessions = [
      {m:5, xp:20, g:10, label:'Quick Sprint'},
      {m:10, xp:40, g:20, label:'Short Burst'},
      {m:15, xp:60, g:30, label:'Deep Work'},
      {m:20, xp:80, g:40, label:'Extended Flow'},
      {m:25, xp:100, g:50, label:'Full Pomodoro'}
    ];
    for (let s of sessions) {
      h += '<button class="focus-session-btn" data-min="' + s.m + '" style="padding:14px 18px;border-radius:14px;border:2px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
      h += '<span>' + s.m + ' min — ' + s.label + '</span>';
      h += '<span style="font-size:11px;color:var(--success);">+' + s.xp + 'XP +' + s.g + 'G</span>';
      h += '</button>';
    }
    h += '</div>';
    h += '<div class="ftips" style="margin-top:20px;"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward scales with session length!</li></ul></div>';
    h += '</div>';
    return h;
  }
  // Active focus session
  const el=Date.now()-(G.fs||Date.now()),rm=Math.max(0,G.fd-el);
  const m=Math.floor(rm/60000),s=Math.floor((rm%60000)/1000);
  return '<div class="fv"><div class="fc"><div class="ft" id="ft">'+m+':'+s.toString().padStart(2,'0')+'</div><div class="fl">Focus Mode — ' + (G.focusDuration || 25) + ' min</div></div><div class="ftips"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward: +' + ((G.focusDuration||25)*4) + ' XP when done!</li></ul></div><button class="cfb">Cancel</button></div>';
}

function rTemple() {
  const dead = getDeadParty();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">⛪ Temple of Resurrection</h2>';
  h2 += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ancient magic restores fallen companions. Cost: 50G each.</div>';
  if(dead.length === 0){
    h2 += '<div style="text-align:center;padding:20px;color:var(--success);">✨ All companions are alive!</div>';
  }else{
    h2 += '<div style="margin-bottom:12px;">';
    for(let p of G.party){
      const isDead = p.hp <= 0;
      const canAfford = G.p.gold >= 50;
      h2 += '<div class="temple-revive ' + (isDead ? 'dead' : 'alive') + '">';
      h2 += '<div class="tr-ava" style="background:' + p.col + '20;border-color:' + p.col + '">' + (isDead ? '💀' : re(p.r)) + '</div>';
      h2 += '<div class="tr-info">';
      h2 += '<div class="tr-name">' + p.n + '</div>';
      h2 += '<div class="tr-status ' + (isDead ? '' : 'alive') + '">' + (isDead ? '💀 FALLEN' : '✅ Alive ' + p.hp + '/' + p.mhp) + '</div>';
      h2 += '</div>';
      if(isDead) h2 += '<button class="tr-btn ' + (canAfford ? '' : 'dis') + '" data-m="' + p.n + '">' + (canAfford ? 'Revive (50G)' : 'Need 50G') + '</button>';
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  return h2;
}

function rRest() {
  const dead = getDeadParty();
  if(dead.length > 0 && !G.rest.active) return rTemple();

  if (G.rest.active && G.rest.selectedSite) {
    const site = G.rest.selectedSite;
    const currentTick = G.rest.tick;
    const maxTicks = G.rest.maxTicks;
    const pct = (currentTick / maxTicks) * 100;
    const healerName = getHealerName();
    let h2 = '<div class="rest-view">';
    h2 += '<h2 class="st">🔥 Resting at ' + site.name + '</h2>';
    if (G.ambushWarning) {
      h2 += '<div class="ambush-warning">';
      h2 += '<div class="aw-text">⚠️ ' + G.ambushWarning.text + '</div>';
      h2 += '</div>';
    }
    if (G.currentDialogue && !G.ambushWarning) {
      h2 += '<div class="dialogue-box">';
      h2 += '<div class="d-speaker">' + G.currentDialogue.speaker + '</div>';
      h2 += '<div class="d-text">' + G.currentDialogue.text + '</div>';
      h2 += '</div>';
    }
    h2 += '<div class="tick-track">';
    for (let i = 1; i <= maxTicks; i++) {
      let tickClass = '';
      let tickIcon = '○';
      if (i < currentTick) {
        tickClass = 'done';
        tickIcon = '✓';
      } else if (i === currentTick) {
        tickClass = 'current';
        tickIcon = '🔥';
      }
      h2 += '<div class="tick ' + tickClass + '">' + tickIcon + '</div>';
    }
    h2 += '</div>';
    h2 += '<div class="tick-label">Tick ' + currentTick + '/' + maxTicks + '</div>';
    h2 += '<div class="rest-progress" style="margin-top:16px;">';
    h2 += '<div class="rest-bar"><div class="rest-fill" style="width:' + pct + '%"></div></div>';
    h2 += '<div class="rest-healer ok">💚 ' + healerName + ' is tending to the party</div>';
    h2 += '</div>';
    h2 += '<button class="rest-cancel" id="cancel-rest">Cancel Rest (Partial Recovery)</button>';
    h2 += '</div>';
    return h2;
  }

  const healerOk = hasHealer();
  const healerName = getHealerName();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">💤 Rest</h2>';
  if (healerOk) {
    h2 += '<div class="rest-healer ok" style="background:#22c55e15;border:1px solid var(--success);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--success);">💚 Healer Available: ' + healerName + '</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">5 ticks, 1.5s each. Dialogue every tick. Ambush chance: 15% camp / 5% tavern.</div>';
    h2 += '</div>';
  } else {
    h2 += '<div class="rest-healer fail" style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--danger);">❌ No Healer in Party</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">You need a healer (like Eliz) in your active party to rest safely.</div>';
    h2 += '</div>';
  }
  const soelActive = G.party.some(p => p.n === 'Soel' && p.on);
  h2 += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;text-align:left;">';
  h2 += '<div style="font-size:13px;font-weight:600;color:var(--rest);margin-bottom:4px;">🐱 Soel\'s Spirit Blessing</div>';
  if (!soelActive) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Soel must be in your active party to share his blessing.</div>';
  } else if (G.soelBlessing) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Blessing rests on <b style="color:var(--text);">' + G.soelBlessing.target + '</b> (+' + G.soelBlessing.def + ' DEF). One blessing per rest \u2014 it fades when you next make camp.</div>';
  } else {
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">One member per rest receives +10 DEF until your next rest.</div>';
    h2 += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    for (let m of G.party) {
      if (!m.on || m.n === 'Soel') continue;
      h2 += '<button class="soel-bless-btn" data-n="' + m.n + '" style="padding:6px 12px;border-radius:10px;border:1px solid var(--rest);background:#10b98115;color:var(--text);font-size:11px;font-weight:600;cursor:pointer;">' + m.n + '</button>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div class="rest-sites">';
  const zones = {};
  for (let site of G.rest.sites) {
    if (!zones[site.zone]) zones[site.zone] = [];
    zones[site.zone].push(site);
  }
  for (let zoneName in zones) {
    const sites = zones[zoneName];
    const anyUnlocked = sites.some(s => s.unlocked);
    if (!anyUnlocked) continue;
    h2 += '<div style="margin-bottom:12px;">';
    h2 += '<div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">' + zoneName + '</div>';
    for (let site of sites) {
    let manaSpringRemaining = 8;
    if (G.manaSpringUses.day === G.gameDay) {
        manaSpringRemaining = 8 - G.manaSpringUses.count;
      }
      const isDepletedManaSpring = site.type === 'mana_spring' && manaSpringRemaining <= 0;

      const locked = !site.unlocked || isDepletedManaSpring;

      const canAfford = !site.cost || G.p.gold >= site.cost;
      const canRest = (site.type === 'mana_spring' || site.type === 'temple' || healerOk) && !locked && canAfford;
      h2 += '<div class="rs-card ' + (locked ? 'locked' : '') + '" data-id="' + site.id + '">';
      h2 += '<div class="rs-head">';
      h2 += '<span class="rs-name">' + site.icon + ' ' + site.name + '</span>';
      h2 += '<span class="rs-type ' + site.type + '">' + site.type.toUpperCase() + '</span>';
      h2 += '</div>';
      h2 += '<div class="rs-desc">' + site.desc + '</div>';
            if (locked) {
            if (isDepletedManaSpring) {
          h2 += '<div class="rs-req fail">💧 Daily limit reached (8/8 uses)</div>';

        } else {
          h2 += '<div class="rs-req fail">🔒 Requires Level ' + site.zoneLv + ' to discover</div>';
        }
      } else if (site.cost) {

                const msUsesLeft = site.type === 'mana_spring' ? ' (' + manaSpringRemaining + '/8 today)' : '';
        h2 += '<div class="rs-req ' + (canAfford ? 'ok' : 'fail') + '">' + (canAfford ? '✅' : '❌') + ' Cost: ' + site.cost + 'G' + msUsesLeft + ' · Ambush: 5% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';


      } else {
        h2 += '<div class="rs-req ' + (healerOk ? 'ok' : 'fail') + '">' + (healerOk ? '✅' : '❌') + ' Free · Ambush: 15% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';
      }
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:8px;">Rest takes ~7.5 seconds. Party banter every tick. Taverns cost gold but are safer.</div>';
  h2 += '</div>';
  return h2;
}

function rMenu(){
  const items=[
    {i:'⚔️',l:'Adventure',d:'Explore zones and fight',a:'explore'},
    {i:'👥',l:'Party',d:'Manage companions',a:'party'},
    {i:'✨',l:'Skills',d:'View mage abilities',a:'skills'},
    {i:'⚒️',l:'Crafting',d:'Brew potions, forge gear',a:'craft'},
    {i:'📜',l:'Quests',d:'View active quests',a:'quest'},
    {i:'🎒',l:'Inventory',d:'Manage items',a:'inventory'},
    {i:'📖',l:'Bestiary',d:'Catalogue of defeated foes',a:'bestiary'},
    {i:'🏆',l:'Achievements',d:'Track your milestones',a:'achievements'},
    {i:'🌳',l:'Skill Trees',d:'Choose your specialization',a:'skilltree'},
    {i:'🌟',l:'Talents',d:'View planar talents (Lv.16+)',a:'talents'},
    {i:'💎',l:'Runes',d:'Socket runes into gear (Lv.20+)',a:'runes'},
    {i:'📖',l:'Journal',d:'Chronicles of your journey',a:'journal'},
    {i:'🌀',l:'Grind Room',d:'Endless wave battles',a:'grind_room'},
    {i:'🧳',l:'Traders',d:'Buy from wandering merchants',a:'npc'},
    {i:'🧘',l:'Focus Mode',d:'5–25 min ADHD timer',a:'focus'},
    {i:'💤',l:'Rest',d:'Find a safe place to rest',a:'rest'},
  ];
  let h='<div class="grid2">';
  for(let m of items)h+='<div class="card" data-a="'+m.a+'"><div class="cicon">'+m.i+'</div><div class="clabel">'+m.l+'</div><div class="cdesc">'+m.d+'</div></div>';
  h+='</div>';
  // Theme toggle row
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  h+='<div style="margin-top:12px;text-align:center;">';
  h+='<button onclick="toggleTheme()" style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:10px 20px;color:var(--text);font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;">';
  h+= isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
  h+='</button></div>';
  h+='<div style="margin-top:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;">';
  h+='<h3 style="font-size:14px;margin-bottom:10px;color:var(--accent-light);">Save Data</h3>';
  h+='<div style="display:flex;gap:8px;flex-wrap:wrap;">';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;" id="btn-save">Save Now</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:#374151;" id="btn-export">Export</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:#374151;" id="btn-import">Import</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:var(--danger);" id="btn-reset">Reset</button>';
  h+='</div>';
  h+='<div style="margin-top:8px;font-size:11px;color:var(--text-dim);">Auto-saves every 30 seconds</div>';
  h+='</div>';
  return h;
}

function rExp(){
  let h='<div class="explore-view"><h2 class="st">Adventure Zones</h2><div class="zlist">';
  for(let i=0;i<G.zones.length;i++){
    const z=G.zones[i],lk=G.p.lvl<z.lv;
    const dc=z.dg=='low'?'#22c55e':z.dg=='medium'?'#eab308':z.dg=='high'?'#f97316':z.dg=='very high'?'#ef4444':'#a855f7';
    const hazard = G.zoneHazards[z.n];
    h+='<div class="zcard '+(lk?'locked':'')+'" data-i="'+i+'"><div class="zh"><span class="zn">'+z.n+'</span><span class="zl">Lv.'+z.lv+(lk?' 🔒':'')+'</span></div><div class="zd">'+z.d+'</div>';
    if(hazard){
      h+='<div style="font-size:10px;color:#f59e0b;margin-bottom:6px;">⚠️ Hazard: '+hazard.desc+'</div>';
    }
    h+='<div class="zm"><span class="db" style="background:'+dc+'20;color:'+dc+'">'+z.dg+'</span><span class="xb">'+z.xp+' XP</span></div></div>';
  }
  h+='</div></div>'; return h;
}

function rCbt() {
  let h = '<div class="combat-view"><h2 class="st">' + (G.currentBoss ? '⚔️ BOSS FIGHT' : 'Combat') + '</h2>';
  
  const synDesc = getSynergyDesc();
  if (synDesc) {
    h += '<div style="background:#7c3aed15;border:1px solid var(--accent);border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:var(--accent-light);">';
    h += '✨ ' + synDesc + '</div>';
  }

  // Planar Resonance Indicator (Phase 2)
  const zone = G.zones.find(z => z.en.includes(G.cbt.en[0]?.n));
  if (zone && zone.elem) {
    const resStatus = getResonanceStatus(zone.n);
    h += '<div style="background:' + resStatus.color + '15;border:1px solid ' + resStatus.color + ';border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:' + resStatus.color + ';">';
    h += resStatus.icon + ' ' + resStatus.text + '</div>';
  }

  // Dimensional Instability Indicator (Phase 2)
  const riftStatus = getRiftStatus();
  if (riftStatus) {
    h += '<div style="background:' + riftStatus.color + '15;border:1px solid ' + riftStatus.color + ';border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:' + riftStatus.color + ';">';
    h += riftStatus.icon + ' ' + riftStatus.name + ': ' + riftStatus.desc + ' (' + riftStatus.fightsLeft + ' fights left)</div>';
  }
  
  h += '<button id="btn-auto" style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid ' + (G.cbt.autoCombat ? '#22c55e' : 'var(--disabled)') + ';background:' + (G.cbt.autoCombat ? '#22c55e15' : 'transparent') + ';color:' + (G.cbt.autoCombat ? '#22c55e' : 'var(--text-dim)') + ';font-size:12px;font-weight:600;cursor:pointer;margin-bottom:12px;user-select:none;">';
  h += (G.cbt.autoCombat ? '🤖 AUTO ON — Tap to take control' : '🤖 Auto-Combat — Let AI fight') + '</button>';

  // Potion button
  const potions = getCombatPotions();
  const usablePotions = potions.filter(p => {
    if (p.t === 'revive') return getDeadParty().length > 0;
    return true;
  });
  h += '<button onclick="togglePotionMenu()" style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid ' + (usablePotions.length > 0 ? '#22c55e' : 'var(--disabled)') + ';background:' + (usablePotions.length > 0 ? '#22c55e15' : 'transparent') + ';color:' + (usablePotions.length > 0 ? '#22c55e' : 'var(--disabled)') + ';font-size:12px;font-weight:600;cursor:' + (usablePotions.length > 0 ? 'pointer' : 'not-allowed') + ';margin-bottom:12px;user-select:none;">';
  h += (G.potionMenu ? '❌ Close Potion Bag' : '🧪 Use Potion (' + usablePotions.length + ' usable)') + '</button>';

  // Potion menu
  if (G.potionMenu && potions.length > 0) {
    h += '<div style="background:var(--bg-card);border:1px solid #22c55e;border-radius:12px;padding:10px;margin-bottom:12px;">';
    h += '<div style="font-size:11px;color:#22c55e;margin-bottom:8px;">🧪 Quick Potion Bag</div>';
    h += '<div style="display:flex;flex-direction:column;gap:6px;">';
    for (let i = 0; i < G.p.inv.length; i++) {
      const it = G.p.inv[i];
      // Regular potions (heal/mana)
      if ((it.t === 'pot' || it.t === 'food' || it.t === 'drink') && (it.eff === 'heal' || it.eff === 'mana')) {
        const isHeal = it.eff === 'heal';
        const icon = isHeal ? '❤️' : '💧';
        const color = isHeal ? '#ef4444' : '#3b82f6';
        const current = isHeal ? G.p.hp + '/' + G.p.mhp : G.p.mp + '/' + G.p.mmp;
        const full = isHeal ? G.p.hp >= G.p.mhp : G.p.mp >= G.p.mmp;
        h += '<button onclick="usePotionInCombat(' + i + ')" style="padding:10px 14px;border-radius:10px;border:1px solid ' + color + ';background:' + color + '15;color:' + (full ? 'var(--disabled)' : color) + ';font-size:12px;font-weight:600;cursor:' + (full ? 'not-allowed' : 'pointer') + ';display:flex;justify-content:space-between;align-items:center;opacity:' + (full ? '0.5' : '1') + ';">';
        h += '<span>' + icon + ' ' + it.n + (it.q > 1 ? ' x' + it.q : '') + '</span>';
        h += '<span>' + (full ? 'FULL' : '+' + it.v + ' ' + (isHeal ? 'HP' : 'MP')) + ' · ' + current + '</span>';
        h += '</button>';
      }
      // Revive items (Phoenix Feather, etc.)
      else if (it.t === 'revive') {
        const deadMembers = getDeadParty();
        const hasDead = deadMembers.length > 0;
        const color = hasDead ? '#f59e0b' : 'var(--disabled)';
        const icon = '🔥';
        h += '<button onclick="usePotionInCombat(' + i + ')" style="padding:10px 14px;border-radius:10px;border:1px solid ' + color + ';background:' + color + '15;color:' + color + ';font-size:12px;font-weight:600;cursor:' + (hasDead ? 'pointer' : 'not-allowed') + ';display:flex;justify-content:space-between;align-items:center;opacity:' + (hasDead ? '1' : '0.5') + ';">';
        h += '<span>' + icon + ' ' + it.n + (it.q > 1 ? ' x' + it.q : '') + '</span>';
        h += '<span>' + (hasDead ? 'Revive 50% HP' : 'No one to revive') + ' · ' + deadMembers.length + ' down</span>';
        h += '</button>';
      }
    }
    h += '</div></div>';
  }
  
  // Reuse zone variable from resonance check above
  if (zone && G.zoneHazards[zone.n]) {
    const haz = G.zoneHazards[zone.n];
    h += '<div style="background:#f59e0b15;border:1px solid #f59e0b;border-radius:12px;padding:8px;margin-bottom:12px;font-size:11px;color:#f59e0b;">';
    h += '⚠️ Zone Hazard: ' + haz.name + ' — ' + haz.desc + '</div>';
  }
  
  if (G.currentBoss) {
    h += '<div style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:10px;margin-bottom:12px;font-size:12px;color:var(--danger);">';
    h += '🔥 ' + G.currentBoss.desc + '</div>';
  }
  
  const playerAC = getPlayerAC();
  const eqStats = getEquippedStats();
  h += '<div style="display:flex;justify-content:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;">';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">AC </span><span style="font-weight:700;color:var(--accent-light);">' + playerAC + '</span>';
  if(eqStats.def > 0) h += '<span style="font-size:9px;color:var(--success);"> +' + eqStats.def + 'eq</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">PROF </span><span style="font-weight:700;color:var(--gold);">+' + DICE.proficiencyBonus(G.p.lvl) + '</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">ATK </span><span style="font-weight:700;color:var(--hp);">+' + (eqStats.atk + (G.p.eq.weapon?.atk||0)) + '</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">CRIT </span><span style="font-weight:700;color:var(--danger);">' + Math.floor(getTotalCritChance() * 100) + '%</span>';
  if(eqStats.critChance > 0) h += '<span style="font-size:9px;color:var(--success);"> +' + Math.floor(eqStats.critChance*100) + '%eq</span>';
  h += '</div>';
  h += '</div>';
  
  h += '<div class="erow">';
  for (let i = 0; i < G.cbt.en.length; i++) {
    const e = G.cbt.en[i], d = e.hp <= 0, s = G.cbt.tg == i && !d ? 'sel' : '';
    const immuneFire = ['Fire Imp', 'Lava Slug', 'Ash Wraith'].includes(e.n);
    const immuneIce = ['Ice Elemental', 'Frost Wolf', 'Frozen Knight'].includes(e.n);
    const isBoss = e.mechanic ? true : false;
    const enemyAC = getEnemyAC(e);
    
    h += '<div class="ecard ' + (d ? 'dead' : '') + ' ' + s + '" data-i="' + i + '" style="' + (isBoss ? 'border-color:var(--danger);box-shadow:0 0 10px #ef444440;' : '') + '">';
    h += '<div class="eicon">' + (d ? '💀' : ee(e.n)) + '</div>';
    h += '<div class="ename">' + e.n + (isBoss ? ' 👑' : '') + '</div>';
    
    if (!d) {
      h += '<div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">AC ' + enemyAC + '</div>';
    }
    
    if (!d && e.elem && e.elem !== 'none') {
      const elemIcon = e.elem === 'fire' ? '🔥' : e.elem === 'ice' ? '❄️' : e.elem === 'lightning' ? '⚡' : e.elem === 'void' ? '🌑' : '✦';
      h += '<div style="font-size:10px;color:#f59e0b;margin-top:2px;">' + elemIcon + ' ' + e.elem + '</div>';
    }
    
    if (!d && e.status && e.status.length > 0) {
      const statusIcons = e.status.map(s => s.type === 'burn' ? '🔥' : s.type === 'poison' ? '☠️' : s.type === 'shock' ? '⚡' : '✦').join('');
      h += '<div style="font-size:10px;color:var(--danger);margin-top:2px;">' + statusIcons + ' (' + e.status[0].turns + 't)</div>';
    }
    
    if (!d && (immuneFire || immuneIce)) {
      h += '<div class="e-immune">' + (immuneFire ? '🔥 Fire Immune' : (immuneIce ? '❄️ Ice Immune' : '')) + '</div>';
    }
    
    if (!d && e.mechanic === 'resurrect') {
      h += '<div style="font-size:10px;color:var(--danger);">💀 Lives: ' + (e.resurrectCount + 1) + '</div>';
    }
    
    if (!d && e.mechanic === 'phase') {
      h += '<div style="font-size:10px;color:var(--accent-light);">💎 Phase ' + e.currentPhase + '/' + e.phases + '</div>';
    }
    
    h += (d ? '<div class="dt">DEFEATED</div>' : '<div class="hps"><div class="bf bf-hp" style="width:' + ((e.hp / e.mhp) * 100) + '%"></div></div><div class="hpt">' + e.hp + '/' + e.mhp + '</div>') + '</div>';
  }
  h += '</div>';
  
  h += '<div class="pstat"><div class="mst"><span class="md" style="background:#7c3aed"></span>San ' + G.p.hp + '/' + G.p.mhp + ' AC' + playerAC + '</div>';
  for (let p of G.party) {
    if (p.on) {
      h += '<div class="mst"><span class="md" style="background:' + p.col + '"></span>' + p.n + ' ' + p.hp + '/' + p.mhp + '</div>';
    }
  }
  h += '</div>';
  
  h += '<div class="skills"><h3>Select Skill</h3><div class="slist">';
  
  const basicSel = G.cbt.sk === -1 && !G.cbt.autoCombat ? 'sel' : '';
  h += '<div class="sbtn ' + basicSel + '" data-i="-1" ' + (G.cbt.autoCombat ? 'style="opacity:0.4;cursor:not-allowed;"' : '') + '>';
  h += '<div class="sn">🪄 Staff Swing</div>';
  h += '<div class="sc">0 MP · Physical · 1d4 + STR</div>';
  h += '<div class="sd">Swing your staff when your spell slots are spent.</div>';
  h += '</div>';
  
    const ls = G.p.skills.filter(s => s.on);
  for (let i = 0; i < ls.length; i++) {
    const s = ls[i];
    const costLabel = typeof getSpellCostLabel === 'function'
      ? getSpellCostLabel(s)
      : (s.c + ' MP');
    const u = G.p.mp >= s.c && !G.cbt.autoCombat;
    const sel = G.cbt.sk == i && !G.cbt.autoCombat ? 'sel' : '';
    const critPct = Math.floor(getTotalCritChance() * 100);
    const highTier = Number(s.slotTier || 1) >= 4;
    const nameStyle = highTier ? ' style="color:#ef4444;font-weight:700;"' : '';
    
    h += '<div class="sbtn ' + (u ? '' : 'dis') + ' ' + sel + '" data-i="' + i + '" ' +
         (G.cbt.autoCombat ? 'style="opacity:0.4;cursor:not-allowed;"' : '') + '>';
    h += '<div class="sn"' + nameStyle + '>' + (s.buff ? '🛡️' : '⚡') + ' ' + s.n + '</div>';
    h += '<div class="sc">' + costLabel + ' · ' + (s.dmg || 'Buff') + ' · ' +
         critPct + '% Crit' + (G.cbt.autoCombat ? ' · 🤖 AUTO' : '') + '</div>';
    h += '<div class="sd">' + s.d + '</div>';
    if (s.elem) {
      const weakAgainst = s.elem === 'fire' ? 'Ice' : s.elem === 'ice' ? 'Fire' : s.elem === 'lightning' ? 'Void' : '';
      if (weakAgainst) {
        h += '<div style="font-size:10px;color:var(--success);">Strong vs: ' + weakAgainst + '</div>';
      }
    }
    h += '</div>';
  }
  h += '</div>';
  
  const isBasic = G.cbt.sk === -1;
  const sk = isBasic ? null : ls[G.cbt.sk];
  const ca = isBasic 
    ? (G.cbt.tg >= 0 && !G.cbt.autoCombat) 
    : (sk && G.p.mp >= sk.c && !G.cbt.autoCombat);
  const si = isBasic ? -1 : G.p.skills.indexOf(sk);
  
  h += '<button class="abtn ' + (ca ? '' : 'dis') + '" data-si="' + si + '" data-ti="' + G.cbt.tg + '" ' + (G.cbt.autoCombat ? 'disabled style="opacity:0.4;"' : '') + '>';
  h += (isBasic ? '🪄 Staff Swing' : 'Cast ' + (sk ? sk.n : '...')) + '</button>';
  h += '<button class="fbtn" ' + (G.cbt.autoCombat ? 'disabled style="opacity:0.4;"' : '') + '>Flee</button>';
 
   // === GRIND ROOM WAVE CONTROLS ===
  if (G.endlessGrind.active) {
    h += '<div style="background:var(--bg-card);border:2px solid var(--accent);border-radius:14px;padding:14px;margin-top:16px;text-align:center;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">⚔️ Grind Room · Wave ' + G.endlessGrind.wave + '</div>';
    
    if (G.endlessGrind.autoNext) {
      h += '<div style="font-size:12px;color:var(--success);">🤖 Auto-next: ON</div>';
    } else {
      h += '<button onclick="startGrindWave()" class="abtn" style="width:100%;margin-bottom:8px;">▶️ Next Wave</button>';
    }
    
    h += '<button onclick="exitGrindRoom()" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:13px;font-weight:600;cursor:pointer;">⏹ Stop & Exit</button>';
    h += '</div>';
  }
  // === END GRIND ROOM WAVE CONTROLS ===

  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:12px;margin-top:12px;">';
  h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">🎲 D&D Combat Rules</div>';
  h += '<div style="font-size:10px;color:var(--text-dim);line-height:1.6;">';
  h += '• Attack: d20 + PROF(+' + DICE.proficiencyBonus(G.p.lvl) + ') + Ability Mod vs Target AC<br>';
  h += '• Natural 20 = Critical Hit (double dice)<br>';
  h += '• Natural 1 = Critical Miss (auto-fail)<br>';
  h += '• Advantage: Roll 2d20, keep higher<br>';
  h += '• Your AC: ' + playerAC + ' | INT Mod: ' + (DICE.abilityMod(G.p.stats.int) >= 0 ? '+' : '') + DICE.abilityMod(G.p.stats.int);
  h += '</div></div>';
  
  h += '</div></div>';
  return h;
}


function rParty(){
  let h='<div class="party-view"><h2 class="st">Party</h2>';
  const activeSyns = getActiveSynergies();
  if(activeSyns.length > 0){
    h += '<div style="background:var(--bg-card);border:1px solid var(--accent);border-radius:14px;padding:12px;margin-bottom:16px;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">✨ Active Synergies</div>';
    h += '<div style="display:flex;flex-direction:column;gap:8px;">';
    for(let syn of activeSyns){
      h += '<div style="display:flex;align-items:center;gap:8px;font-size:12px;">';
      h += '<span style="font-size:16px;">' + syn.icon + '</span>';
      h += '<div style="flex:1;"><div style="font-weight:600;">' + syn.name + '</div>';
      h += '<div style="font-size:10px;color:var(--text-dim);">' + syn.desc + '</div></div>';
      h += '</div>';
    }
    h += '</div></div>';
  }
  h += '<div class="plist">';
  for(let p of G.party){
    h+='<div class="pcard '+(p.on?'':'locked')+'"><div class="pava" style="background:'+p.col+'20;border-color:'+p.col+'"><span style="font-size:28px">'+(p.on?re(p.r):'🔒')+'</span></div><div class="pinfo"><div class="pn">'+p.n+' <span class="pt">'+p.t+'</span></div><div class="pr" style="color:'+p.col+'">'+p.r+'</div><div class="pd">'+p.d+'</div><div class="pb">'+p.b+'</div>'+(p.on?'<div class="ps">HP:'+p.hp+'/'+p.mhp+' ATK:'+p.atk+(p.gear&&p.gear.atk?'(+'+p.gear.atk+')':'')+' DEF:'+p.def+(p.gear&&p.gear.def?'(+'+p.gear.def+')':'')+' SPD:'+p.spd+(p.gear&&p.gear.spd?'(+'+p.gear.spd+')':'')+(getBlessDef(p)?' <span style="color:var(--rest);font-weight:700;">🐱+10 DEF</span>':'')+'</div>':'')+(G.affinity[p.n]?'<div class="affinity-bar"><div class="affinity-fill '+getAffinityColor(G.affinity[p.n].val)+'" style="width:'+(G.affinity[p.n].val/G.affinity[p.n].max*100)+'%"></div></div><div class="affinity-label">'+(G.affinity[p.n].val>=70?'💕 Close':G.affinity[p.n].val>=40?'💛 Friendly':G.affinity[p.n].val>=20?'💔 Distant':'💀 Strained')+' ('+G.affinity[p.n].val+'/'+G.affinity[p.n].max+')</div>':'')
+(G.affinityUnlocks[p.n]?'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">'+G.affinityUnlocks[p.n].map(function(u){var un=p.affinityBonuses&&p.affinityBonuses.includes(u.id);return '<span title="'+u.d+'" style="font-size:9px;padding:2px 6px;border-radius:8px;border:1px solid '+(un?'var(--xp);color:var(--xp);':'var(--border);color:var(--text-dim);opacity:0.6;')+'">'+(un?'🌟 ':'🔒 ')+u.n+' ('+u.th+')</span>';}).join('')+'</div>':'')+'</div></div>';
    // === STAGE 1: ENHANCED TRINKET/GEAR SYSTEM ===
    if(p.on || p.ul <= G.p.lvl){
      h += '<div style="background:var(--bg-hover);border:1px solid var(--border);border-radius:10px;padding:10px;margin-top:8px;">';
      h += '<div style="font-size:11px;font-weight:600;color:var(--accent-light);margin-bottom:6px;">🎁 Trinket Slot</div>';
      if(p.gear){
        // Equipped trinket display with rarity color
        const rarityColor = p.gear.r ? (p.gear.r==='epic'?'#a855f7':p.gear.r==='rare'?'#3b82f6':p.gear.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
        h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
        h += '<span style="font-size:12px;font-weight:600;color:'+rarityColor+';">' + p.gear.n + '</span>';
        h += '<button class="unequip-pgear" data-member="' + p.n + '" style="padding:4px 10px;border-radius:8px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:11px;font-weight:600;cursor:pointer;">Unequip</button>';
        h += '</div>';
        h += '<div style="font-size:10px;color:var(--text-dim);">';
        const stats = [];
        if(p.gear.atk) stats.push('+ ' + p.gear.atk + ' ATK');
        if(p.gear.def) stats.push('+ ' + p.gear.def + ' DEF');
        if(p.gear.hp) stats.push('+ ' + p.gear.hp + ' HP');
        if(p.gear.mp) stats.push('+ ' + p.gear.mp + ' MP');
        if(p.gear.spd) stats.push('+ ' + p.gear.spd + ' SPD');
        h += stats.join(' · ') + '</div>';
        if(p.gear.d) h += '<div style="font-size:10px;color:var(--accent-light);margin-top:4px;font-style:italic;">' + p.gear.d + '</div>';
      } else {
        h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Empty trinket slot</div>';
        // Show ALL equippable pgear items (not just for this member)
        const allPgear = G.p.inv.map((it, idx) => ({it, idx})).filter(x => x.it.t === 'pgear');
        if(allPgear.length > 0){
          h += '<div style="display:flex;flex-direction:column;gap:4px;">';
          for(let eq of allPgear){
            const isForThis = !eq.it.for || eq.it.for === p.n;
            const rarityColor = eq.it.r ? (eq.it.r==='epic'?'#a855f7':eq.it.r==='rare'?'#3b82f6':eq.it.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
            if(isForThis){
              h += '<button class="equip-pgear" data-member="' + p.n + '" data-idx="' + eq.idx + '" style="padding:6px 10px;border-radius:8px;border:1px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:11px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
              h += '<span style="color:'+rarityColor+';">' + eq.it.n + '</span>';
              h += '<span style="font-size:10px;color:var(--text-dim);">Equip →</span>';
              h += '</button>';
            }
          }
          // Show incompatible items as disabled
          const incompatible = allPgear.filter(x => x.it.for && x.it.for !== p.n);
          if(incompatible.length > 0){
            h += '<div style="font-size:10px;color:var(--disabled);margin-top:4px;padding-top:4px;border-top:1px solid var(--border);">Not for ' + p.n + ':</div>';
            for(let eq of incompatible){
              h += '<div style="padding:4px 10px;border-radius:8px;background:var(--nav-bg);color:var(--disabled);font-size:10px;">' + eq.it.n + ' (' + eq.it.for + ' only)</div>';
            }
          }
          h += '</div>';
        } else {
          h += '<div style="font-size:10px;color:var(--disabled);margin-top:4px;">Buy trinkets from traders like Ribald, Deidre, or Nym.</div>';
        }
      }
      h += '</div>';
    }
  }
  h+='</div></div>'; return h;
}
function rSkills(){
  let h='<div class="skills-view"><h2 class="st">Mage Skills</h2><div class="sklist">';
  for(let s of G.p.skills){
    const st=s.on?'LEARNED':'Unlocks Lv.'+s.ul;
    h+='<div class="skcard '+(s.on?'':'locked')+'"><div class="skh"><span class="ski">'+(s.buff?'🛡️':'⚡')+'</span><span class="skt">'+s.n+'</span><span class="sks">'+st+'</span></div><div class="skd"><span class="dp">'+s.c+' MP</span><span class="dp">'+(s.dmg||'Buff')+'</span></div><div class="skdsc">'+s.d+'</div></div>';
  }
  h+='</div><div class="stb"><h3>Character Stats</h3>';
  for(let [k,v] of Object.entries(G.p.stats))h+='<div class="str"><span class="stn">'+k.toUpperCase()+'</span><span class="stv">'+v+'</span></div>';
  h+='</div></div>'; return h;
}

function getEquipScore(item) {
  if (!item || !item.slot) return 0;
  let score = 0;
  if (item.atk) score += item.atk * 3;
  if (item.def) score += item.def * 3;
  if (item.int) score += item.int * 2;
  if (item.str) score += item.str * 2;
  if (item.dex) score += item.dex * 2;
  if (item.con) score += item.con * 2;
  if (item.wis) score += item.wis * 2;
  if (item.cha) score += item.cha * 1;
  if (item.fireDmg) score += item.fireDmg * 2;
  if (item.iceDmg) score += item.iceDmg * 2;
  if (item.lightDmg) score += item.lightDmg * 2;
  if (item.voidDmg) score += item.voidDmg * 2;
  if (item.arcaneDmg) score += item.arcaneDmg * 2;
  if (item.lifeSteal) score += item.lifeSteal * 10;
  if (item.critChance) score += item.critChance * 20;
  if (item.mpRegen) score += item.mpRegen * 2;
  if (item.hpRegen) score += item.hpRegen * 2;
  return score;
}

function getEquipComparison(item) {
  if (!item || !item.slot) return null;
  const slot = item.slot === 'ring' ? (G.p.eq.ring1 ? 'ring2' : 'ring1') : item.slot;
  const equipped = G.p.eq[slot];
  if (!equipped) return { better: true, arrow: '▲', color: '#22c55e', text: 'New slot' };
  const itemScore = getEquipScore(item);
  const eqScore = getEquipScore(equipped);
  if (itemScore > eqScore) return { better: true, arrow: '▲', color: '#22c55e', text: 'Upgrade' };
  if (itemScore < eqScore) return { better: false, arrow: '▼', color: '#ef4444', text: 'Downgrade' };
  return { better: false, arrow: '●', color: '#9ca3af', text: 'Sidegrade' };
}

function rInv(){
  let h='<div class="inventory-view"><h2 class="st">Inventory</h2>';

  // Equipment Stats Summary
  const eqStats = getEquippedStats();
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:12px;margin-bottom:16px;">';
  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">⚔️ Equipment Bonuses</div>';
  h += '<div style="display:flex;flex-wrap:wrap;gap:6px;font-size:10px;">';
  const statLabels = {atk:'ATK',def:'DEF',str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA',
                      fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',
                      lifeSteal:'🩸Leech',critChance:'💥Crit',mpRegen:'💧MP+',hpRegen:'💚HP+',goldFind:'💰Gold'};
  for(let k in statLabels){
    if(eqStats[k] > 0){
      const val = k === 'critChance' || k.includes('Res') ? (eqStats[k]*100)+'%' : (k.includes('Regen') ? '+'+eqStats[k]+'/turn' : '+'+eqStats[k]);
      h += '<span style="background:var(--bg-hover);padding:3px 8px;border-radius:8px;">'+statLabels[k]+' '+val+'</span>';
    }
  }
  h += '</div></div>';

  // Equipped Gear
  h+='<div class="eqs"><h3>Equipped Gear</h3><div class="eqg">';
  const slotOrder = ['weapon','armor','head','hands','feet','ring1','ring2','amulet'];
  const slotIcons = {weapon:'⚔️',armor:'🛡️',head:'🎓',hands:'🧤',feet:'👢',ring1:'💍',ring2:'💍',amulet:'📿'};
  for(let sl of slotOrder){
    const it=G.p.eq[sl];
    const slotName = EQUIPMENT_SLOTS[sl].name;
    h+='<div class="esl" style="cursor:pointer;" onclick="unequipItem(\'"+sl+"\')">';
    h+='<div class="esn">'+slotIcons[sl]+' '+slotName+'</div>';
    if(it){
      h+='<div class="eit" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      let stats = [];
      if(it.atk) stats.push('ATK+'+it.atk);
      if(it.def) stats.push('DEF+'+it.def);
      if(it.int) stats.push('INT+'+it.int);
      if(it.str) stats.push('STR+'+it.str);
      if(it.dex) stats.push('DEX+'+it.dex);
      if(it.con) stats.push('CON+'+it.con);
      if(it.wis) stats.push('WIS+'+it.wis);
      if(it.cha) stats.push('CHA+'+it.cha);
      if(it.prefix) stats.push(it.prefixData.desc);
      if(it.suffix) stats.push(it.suffixData.desc);
      h+='<div class="est">'+stats.join(' · ')+'</div>';
    }else{
      h+='<div class="ese">Empty</div>';
    }
    h+='</div>';
  }
  h+='</div></div>';

  // Categorize inventory items
  const equipItems = [];
  const consumableItems = [];
  const matItems = [];
  const otherItems = [];
  
  for(let i=0; i<G.p.inv.length; i++){
    const it = G.p.inv[i];
    const isEquip = it.slot && it.slot !== 'mat' && it.slot !== 'pot' && it.slot !== 'revive' && it.t !== 'food' && it.t !== 'drink';
    if(isEquip) equipItems.push({item: it, index: i});
    else if(it.t==='pot' || it.t==='food' || it.t==='drink' || it.t==='revive') consumableItems.push({item: it, index: i});
    else if(it.t==='mat') matItems.push({item: it, index: i});
    else otherItems.push({item: it, index: i});
  }

  // Equipment section
  if(equipItems.length > 0){
    h+='<div class="its"><h3>🎒 Equipment ('+equipItems.length+')</h3><div class="ig">';
    for(let ei of equipItems){
      const it = ei.item;
      const i = ei.index;
      const cmp = getEquipComparison(it);
      h+='<div class="ic" style="position:relative;">';
      if(cmp){
        h+='<div style="position:absolute;top:6px;right:6px;font-size:14px;color:'+cmp.color+';font-weight:700;" title="'+cmp.text+'">'+cmp.arrow+'</div>';
      }
      h+='<div class="ii">'+(EQUIPMENT_SLOTS[it.slot]?.icon || '⚔️')+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.ilvl) h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      h += getItemSocketDisplay(it);
      let statLine = [];
      if(it.atk) statLine.push('ATK+'+it.atk);
      if(it.def) statLine.push('DEF+'+it.def);
      if(it.int) statLine.push('INT+'+it.int);
      if(it.str) statLine.push('STR+'+it.str);
      if(it.dex) statLine.push('DEX+'+it.dex);
      if(it.con) statLine.push('CON+'+it.con);
      if(it.wis) statLine.push('WIS+'+it.wis);
      if(it.cha) statLine.push('CHA+'+it.cha);
      if(it.prefix) statLine.push(it.prefixData.desc);
      if(it.suffix) statLine.push(it.suffixData.desc);
      if(statLine.length > 0) h+='<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">'+statLine.join(' · ')+'</div>';
      h+='<div class="iq">'+(it.value ? it.value+'G' : '')+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-e" data-i="'+i+'">Equip</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Consumables section
  if(consumableItems.length > 0){
    h+='<div class="its"><h3>🧪 Consumables ('+consumableItems.length+')</h3><div class="ig">';
    for(let ci of consumableItems){
      const it = ci.item;
      const i = ci.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.eff==='heal') h+='<div style="font-size:10px;color:var(--success);">+'+it.v+' HP</div>';
      if(it.eff==='mana') h+='<div style="font-size:10px;color:var(--mp);">+'+it.v+' MP</div>';
      if(it.eff==='revive') h+='<div style="font-size:10px;color:var(--accent-light);">Revive '+it.v+'% HP</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-u" data-i="'+i+'">Use</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Materials section
  if(matItems.length > 0){
    h+='<div class="its"><h3>💎 Materials ('+matItems.length+')</h3><div class="ig">';
    for(let mi of matItems){
      const it = mi.item;
      const i = mi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  // Other items
  if(otherItems.length > 0){
    h+='<div class="its"><h3>📦 Other ('+otherItems.length+')</h3><div class="ig">';
    for(let oi of otherItems){
      const it = oi.item;
      const i = oi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  if(G.p.inv.length==0) h+='<div class="ei">Your pack is empty.</div>';
  h+='</div>';
  return h;
}

function rCraft(){
  let h='<div class="craft-view"><h2 class="st">Crafting</h2><div class="rlist">';
  for(let i=0;i<G.recipes.length;i++){
    const r=G.recipes[i]; let ok=true,ms='';
    for(let [mn,mq] of Object.entries(r.m)){
      const iv=G.p.inv.find(x=>x.n==mn);
      const hv=iv?iv.q:0,en=hv>=mq;
      if(!en)ok=false;
      ms+='<span class="mp '+(en?'ok':'miss')+'">'+mn+': '+hv+'/'+mq+'</span>';
    }
    h+='<div class="rc"><div class="rr"><span class="ri">'+ie(r.res)+'</span><span class="rn" style="color:'+rc(r.res.r)+'">'+r.n+'</span><span class="rd">'+r.d+'</span></div><div class="rms">'+ms+'</div><button class="cb '+(ok?'':'dis')+'" data-i="'+i+'">Forge</button></div>';
  }
  h+='</div></div>'; return h;
}

function toggleQuestCollapse(key){
  G.questCollapsed[key] = !G.questCollapsed[key];
  render();
}

function rQuest(){
  let h='<div class="quest-view">';
    // === DAILY LOGIN REWARDS ===
  const today = G.gameDay || 0;
  const streak = G.loginStreak || 0;
  const claimedToday = G.loginClaimed || false;

  const loginRewards = [
    { day: 1, icon: '💰', name: 'Gold Pouch', g: 50, xp: 25 },
    { day: 2, icon: '💧', name: 'Mana Crystal', mp: 30, xp: 35 },
    { day: 3, icon: '🧪', name: 'Health Potion', hp: 50, xp: 45 },
    { day: 4, icon: '💎', name: 'Gem Shard', g: 100, xp: 60 },
    { day: 5, icon: '⚔️', name: 'Mystic Scroll', g: 150, xp: 80 },
    { day: 6, icon: '🔮', name: 'Arcane Orb', mp: 50, xp: 100 },
    { day: 7, icon: '👑', name: 'Legendary Cache', g: 300, xp: 200, item: { n: 'Phoenix Feather', t: 'revive', eff: 'revive', v: 50, q: 1, r: 'rare' } }
  ];

  const todayReward = loginRewards[Math.min(streak, 6)];

  h += '<div style="background: linear-gradient(135deg, var(--accent), #6d28d9); border-radius: 16px; padding: 16px; margin-bottom: 16px; color: white;">';
  h += '<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">';
  h += '<div style="font-size: 28px;">🎁</div>';
  h += '<div><div style="font-weight: 700; font-size: 16px;">Daily Login Reward</div>';
  h += '<div style="font-size: 11px; opacity: 0.9;">Day ' + (streak + 1) + ' · Streak: ' + streak + '</div></div>';
  h += '</div>';

  h += '<div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px; margin-bottom: 12px;">';
  h += '<div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">Today\'s Reward:</div>';
  h += '<div style="display: flex; align-items: center; gap: 8px;">';
  h += '<div style="font-size: 32px;">' + todayReward.icon + '</div>';
  h += '<div style="flex: 1;">';
  h += '<div style="font-weight: 600; font-size: 14px;">' + todayReward.name + '</div>';
  h += '<div style="font-size: 11px; opacity: 0.85;">';
  const rewardParts = [];
  if (todayReward.g) rewardParts.push('+' + todayReward.g + 'G');
  if (todayReward.xp) rewardParts.push('+' + todayReward.xp + 'XP');
  if (todayReward.hp) rewardParts.push('+' + todayReward.hp + 'HP');
  if (todayReward.mp) rewardParts.push('+' + todayReward.mp + 'MP');
  if (todayReward.item) rewardParts.push(todayReward.item.n);
  h += rewardParts.join(' · ');
  h += '</div></div></div></div>';

  // Streak progress dots
  h += '<div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 12px;">';
  for (let i = 0; i < 7; i++) {
    const isActive = i < streak;
    const isToday = i === streak;
    h += '<div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; ' + 
      (isActive ? 'background: #fbbf24; color: #000;' : 
       isToday ? 'background: white; color: var(--accent); border: 2px solid #fbbf24;' : 
       'background: rgba(255,255,255,0.2); color: white;') + '">' + (i + 1) + '</div>';
  }
  h += '</div>';

  if (claimedToday) {
    h += '<button disabled style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: rgba(255,255,255,0.2); color: white; font-size: 13px; font-weight: 600; opacity: 0.6; cursor: not-allowed;">✅ Claimed Today — Come Back Tomorrow!</button>';
  } else {
    h += '<button id="btn-claim-login" style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: #fbbf24; color: #000; font-size: 13px; font-weight: 700; cursor: pointer;">🎁 Claim Reward</button>';
  }
  h += '</div>';
  // === END DAILY LOGIN ===

  // Storyline section
  h+='<h2 class="st">📖 Storyline</h2><div class="qlist">';
  for(let s of G.storyline){
    if(!s.unlocked) continue;
    const pc=Math.min(100,(G.p.lvl/s.need)*100);
    h+='<div class="qc '+(s.done?'done':'')+'" style="border-color:var(--accent-light);"><div class="qh"><span class="qn">'+(s.done?'✅ ':'')+'Ch.'+s.chapter+': '+s.n+'</span><span class="qr">'+s.rw.xp+' XP | '+s.rw.g+' G</span></div>';
    h+='<div class="qd">'+s.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">Lv.'+G.p.lvl+'/'+s.need+'</span></div></div>';
  }
  h+='</div>';
  // Active quests section
  h+='<h2 class="st" style="margin-top:20px;">📜 Active Quests</h2><div class="qlist">';
  for(let q of G.quests){
    if(q.hidden && !q.revealed) continue;
    const pc=Math.min(100,(q.c/q.need)*100);
    const timerStatus=getTimerStatus(q);
    let cardClass=q.done?'done':(q.expired?'expired':(timerStatus?(timerStatus.cls==='timer-urgent'?'timed-urgent':'timed'):''));
    h+='<div class="qc '+cardClass+'"><div class="qh"><span class="qn">'+(q.done?'✅ ':(q.expired?'❌ ':''))+q.n+'</span><span class="qr">'+q.rw.xp+' XP | '+q.rw.g+' G</span></div>';
    if(q.chain){
      h+='<div style="font-size:10px;color:var(--accent-light);margin-bottom:4px;">🔗 Chain: '+q.chain+'</div>';
    }
    if(q.reqQuest && !q.revealed){
      const req=G.quests.find(rq=>rq.id===q.reqQuest);
      h+='<div style="font-size:10px;color:var(--text-dim);font-style:italic;margin-bottom:4px;">🔒 Requires: '+(req?req.n:'Unknown')+'</div>';
    }
    h+='<div class="qd">'+q.d+'</div>';
    if(timerStatus){
      h+='<div class="timer-bar"><div class="timer-fill '+timerStatus.cls+'" style="width:'+timerStatus.pct+'%"></div></div>';
      h+='<div class="timer-label">⏰ '+timerStatus.label+'</div>';
    }
    h+='<div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+Math.min(q.c,q.need)+'/'+q.need+'</span></div></div>';
  }
  h+='</div>';
    // Daily Quests section
  h += '<h2 class="st" style="margin-top:20px;">📋 Daily Quests</h2><div class="qlist">';
  generateDailyQuests();
  if (G.dailyQuests.length === 0) {
    h += '<div class="qc"><div class="qd">No daily quests available. Check back tomorrow!</div></div>';
  } else {
    for (let q of G.dailyQuests) {
      const pc = Math.min(100, (q.c / q.need) * 100);
      h += '<div class="qc ' + (q.done ? 'done' : '') + '"><div class="qh"><span class="qn">' + q.n + '</span><span class="qr">' + q.rw.xp + ' XP | ' + q.rw.g + ' G</span></div>';
      h += '<div class="qd">' + q.d + '</div><div class="qp"><div class="pbar"><div class="pfill" style="width:' + pc + '%"></div></div><span class="ptxt">' + q.c + '/' + q.need + '</span></div></div>';
    }
  }
  h += '</div>';
    // Bounties section
  const activeBounties = G.bounties.filter(b => !b.done && G.p.lvl >= (b.minLv || 1));
  const doneBounties = G.bounties.filter(b => b.done);
  if (activeBounties.length > 0 || doneBounties.length > 0) {
    h+='<h2 class="st" style="margin-top:20px;">💰 Bounties</h2>';
    if (activeBounties.length > 0) {
      h+='<div class="qlist">';
      for(let b of activeBounties){
        const pc=Math.min(100,(b.c/b.need)*100);
        h+='<div class="qc"><div class="qh"><span class="qn">'+b.n+'</span><span class="qr">'+b.rw.xp+' XP | '+b.rw.g+' G</span></div>';
        h+='<div class="qd">'+b.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+b.c+'/'+b.need+'</span></div></div>';
      }
      h+='</div>';
    }
    if (doneBounties.length > 0) {
      const collapsed = G.questCollapsed['__bounties_done__'];
      h+='<div style="margin-top:12px;">';
      h+='<div onclick="toggleQuestCollapse(\'__bounties_done__\')" style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:12px 16px;background:var(--bg-hover);border-radius:14px;border:1px solid var(--border);user-select:none;">';
      h+='<span style="font-size:12px;transition:transform 0.2s;display:inline-block;' + (collapsed ? '' : 'transform:rotate(90deg);') + '">▶</span>';
      h+='<span style="font-size:14px;font-weight:600;color:var(--success);">✅ Claimed</span>';
      h+='<span style="font-size:12px;color:var(--text-dim);margin-left:auto;">' + doneBounties.length + '</span>';
      h+='</div>';
      if (!collapsed) {
        h+='<div class="qlist" style="margin-top:8px;">';
        for(let b of doneBounties){
          h+='<div class="qc done" style="opacity:0.55;"><div class="qh"><span class="qn" style="text-decoration:line-through;">'+b.n+'</span><span class="qr" style="color:var(--success);">✓</span></div>';
          h+='<div class="qd">'+b.d+'</div></div>';
        }
        h+='</div>';
      }
      h+='</div>';
    }
  }
  h+='</div>';
  h+='<div class="sum"><div class="si2"><span class="sv">'+G.p.kills+'</span><span class="sl">Monsters</span></div><div class="si2"><span class="sv">'+G.p.quests+'</span><span class="sl">Quests</span></div><div class="si2"><span class="sv">'+G.p.fstreak+'</span><span class="sl">Focus</span></div></div></div>';
  return h;
}

function rFocus(){
  // If focus is not active, show the session picker
  if (!G.fs || G.state !== 'focus') {
    let h = '<div class="fv">';
    h += '<div style="font-size:42px;margin-bottom:8px;">🧘</div>';
    h += '<div class="fl" style="font-size:18px;font-weight:700;margin-bottom:4px;">Focus Mode</div>';
    h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:20px;">Pick a session length</div>';
    h += '<div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:0 auto;">';
    const sessions = [
      {m:5, xp:20, g:10, label:'Quick Sprint'},
      {m:10, xp:40, g:20, label:'Short Burst'},
      {m:15, xp:60, g:30, label:'Deep Work'},
      {m:20, xp:80, g:40, label:'Extended Flow'},
      {m:25, xp:100, g:50, label:'Full Pomodoro'}
    ];
    for (let s of sessions) {
      h += '<button class="focus-session-btn" data-min="' + s.m + '" style="padding:14px 18px;border-radius:14px;border:2px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
      h += '<span>' + s.m + ' min — ' + s.label + '</span>';
      h += '<span style="font-size:11px;color:var(--success);">+' + s.xp + 'XP +' + s.g + 'G</span>';
      h += '</button>';
    }
    h += '</div>';
    h += '<div class="ftips" style="margin-top:20px;"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward scales with session length!</li></ul></div>';
    h += '</div>';
    return h;
  }
  // Active focus session
  const el=Date.now()-(G.fs||Date.now()),rm=Math.max(0,G.fd-el);
  const m=Math.floor(rm/60000),s=Math.floor((rm%60000)/1000);
  return '<div class="fv"><div class="fc"><div class="ft" id="ft">'+m+':'+s.toString().padStart(2,'0')+'</div><div class="fl">Focus Mode — ' + (G.focusDuration || 25) + ' min</div></div><div class="ftips"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward: +' + ((G.focusDuration||25)*4) + ' XP when done!</li></ul></div><button class="cfb">Cancel</button></div>';
}

function rTemple() {
  const dead = getDeadParty();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">⛪ Temple of Resurrection</h2>';
  h2 += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ancient magic restores fallen companions. Cost: 50G each.</div>';
  if(dead.length === 0){
    h2 += '<div style="text-align:center;padding:20px;color:var(--success);">✨ All companions are alive!</div>';
  }else{
    h2 += '<div style="margin-bottom:12px;">';
    for(let p of G.party){
      const isDead = p.hp <= 0;
      const canAfford = G.p.gold >= 50;
      h2 += '<div class="temple-revive ' + (isDead ? 'dead' : 'alive') + '">';
      h2 += '<div class="tr-ava" style="background:' + p.col + '20;border-color:' + p.col + '">' + (isDead ? '💀' : re(p.r)) + '</div>';
      h2 += '<div class="tr-info">';
      h2 += '<div class="tr-name">' + p.n + '</div>';
      h2 += '<div class="tr-status ' + (isDead ? '' : 'alive') + '">' + (isDead ? '💀 FALLEN' : '✅ Alive ' + p.hp + '/' + p.mhp) + '</div>';
      h2 += '</div>';
      if(isDead) h2 += '<button class="tr-btn ' + (canAfford ? '' : 'dis') + '" data-m="' + p.n + '">' + (canAfford ? 'Revive (50G)' : 'Need 50G') + '</button>';
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  return h2;
}

function rRest() {
  const dead = getDeadParty();
  if(dead.length > 0 && !G.rest.active) return rTemple();

  if (G.rest.active && G.rest.selectedSite) {
    const site = G.rest.selectedSite;
    const currentTick = G.rest.tick;
    const maxTicks = G.rest.maxTicks;
    const pct = (currentTick / maxTicks) * 100;
    const healerName = getHealerName();
    let h2 = '<div class="rest-view">';
    h2 += '<h2 class="st">🔥 Resting at ' + site.name + '</h2>';
    if (G.ambushWarning) {
      h2 += '<div class="ambush-warning">';
      h2 += '<div class="aw-text">⚠️ ' + G.ambushWarning.text + '</div>';
      h2 += '</div>';
    }
    if (G.currentDialogue && !G.ambushWarning) {
      h2 += '<div class="dialogue-box">';
      h2 += '<div class="d-speaker">' + G.currentDialogue.speaker + '</div>';
      h2 += '<div class="d-text">' + G.currentDialogue.text + '</div>';
      h2 += '</div>';
    }
    h2 += '<div class="tick-track">';
    for (let i = 1; i <= maxTicks; i++) {
      let tickClass = '';
      let tickIcon = '○';
      if (i < currentTick) {
        tickClass = 'done';
        tickIcon = '✓';
      } else if (i === currentTick) {
        tickClass = 'current';
        tickIcon = '🔥';
      }
      h2 += '<div class="tick ' + tickClass + '">' + tickIcon + '</div>';
    }
    h2 += '</div>';
    h2 += '<div class="tick-label">Tick ' + currentTick + '/' + maxTicks + '</div>';
    h2 += '<div class="rest-progress" style="margin-top:16px;">';
    h2 += '<div class="rest-bar"><div class="rest-fill" style="width:' + pct + '%"></div></div>';
    h2 += '<div class="rest-healer ok">💚 ' + healerName + ' is tending to the party</div>';
    h2 += '</div>';
    h2 += '<button class="rest-cancel" id="cancel-rest">Cancel Rest (Partial Recovery)</button>';
    h2 += '</div>';
    return h2;
  }

  const healerOk = hasHealer();
  const healerName = getHealerName();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">💤 Rest</h2>';
  if (healerOk) {
    h2 += '<div class="rest-healer ok" style="background:#22c55e15;border:1px solid var(--success);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--success);">💚 Healer Available: ' + healerName + '</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">5 ticks, 1.5s each. Dialogue every tick. Ambush chance: 15% camp / 5% tavern.</div>';
    h2 += '</div>';
  } else {
    h2 += '<div class="rest-healer fail" style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--danger);">❌ No Healer in Party</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">You need a healer (like Eliz) in your active party to rest safely.</div>';
    h2 += '</div>';
  }
  const soelActive = G.party.some(p => p.n === 'Soel' && p.on);
  h2 += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;text-align:left;">';
  h2 += '<div style="font-size:13px;font-weight:600;color:var(--rest);margin-bottom:4px;">🐱 Soel\'s Spirit Blessing</div>';
  if (!soelActive) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Soel must be in your active party to share his blessing.</div>';
  } else if (G.soelBlessing) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Blessing rests on <b style="color:var(--text);">' + G.soelBlessing.target + '</b> (+' + G.soelBlessing.def + ' DEF). One blessing per rest \u2014 it fades when you next make camp.</div>';
  } else {
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">One member per rest receives +10 DEF until your next rest.</div>';
    h2 += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    for (let m of G.party) {
      if (!m.on || m.n === 'Soel') continue;
      h2 += '<button class="soel-bless-btn" data-n="' + m.n + '" style="padding:6px 12px;border-radius:10px;border:1px solid var(--rest);background:#10b98115;color:var(--text);font-size:11px;font-weight:600;cursor:pointer;">' + m.n + '</button>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div class="rest-sites">';
  const zones = {};
  for (let site of G.rest.sites) {
    if (!zones[site.zone]) zones[site.zone] = [];
    zones[site.zone].push(site);
  }
  for (let zoneName in zones) {
    const sites = zones[zoneName];
    const anyUnlocked = sites.some(s => s.unlocked);
    if (!anyUnlocked) continue;
    h2 += '<div style="margin-bottom:12px;">';
    h2 += '<div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">' + zoneName + '</div>';
    for (let site of sites) {
    let manaSpringRemaining = 8;
    if (G.manaSpringUses.day === G.gameDay) {
        manaSpringRemaining = 8 - G.manaSpringUses.count;
      }
      const isDepletedManaSpring = site.type === 'mana_spring' && manaSpringRemaining <= 0;

      const locked = !site.unlocked || isDepletedManaSpring;

      const canAfford = !site.cost || G.p.gold >= site.cost;
      const canRest = (site.type === 'mana_spring' || site.type === 'temple' || healerOk) && !locked && canAfford;
      h2 += '<div class="rs-card ' + (locked ? 'locked' : '') + '" data-id="' + site.id + '">';
      h2 += '<div class="rs-head">';
      h2 += '<span class="rs-name">' + site.icon + ' ' + site.name + '</span>';
      h2 += '<span class="rs-type ' + site.type + '">' + site.type.toUpperCase() + '</span>';
      h2 += '</div>';
      h2 += '<div class="rs-desc">' + site.desc + '</div>';
            if (locked) {
            if (isDepletedManaSpring) {
          h2 += '<div class="rs-req fail">💧 Daily limit reached (8/8 uses)</div>';

        } else {
          h2 += '<div class="rs-req fail">🔒 Requires Level ' + site.zoneLv + ' to discover</div>';
        }
      } else if (site.cost) {

                const msUsesLeft = site.type === 'mana_spring' ? ' (' + manaSpringRemaining + '/8 today)' : '';
        h2 += '<div class="rs-req ' + (canAfford ? 'ok' : 'fail') + '">' + (canAfford ? '✅' : '❌') + ' Cost: ' + site.cost + 'G' + msUsesLeft + ' · Ambush: 5% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';


      } else {
        h2 += '<div class="rs-req ' + (healerOk ? 'ok' : 'fail') + '">' + (healerOk ? '✅' : '❌') + ' Free · Ambush: 15% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';
      }
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:8px;">Rest takes ~7.5 seconds. Party banter every tick. Taverns cost gold but are safer.</div>';
  h2 += '</div>';
  return h2;
}

function rExp(){
  let h='<div class="explore-view"><h2 class="st">Adventure Zones</h2><div class="zlist">';
  for(let i=0;i<G.zones.length;i++){
    const z=G.zones[i],lk=G.p.lvl<z.lv;
    const dc=z.dg=='low'?'#22c55e':z.dg=='medium'?'#eab308':z.dg=='high'?'#f97316':z.dg=='very high'?'#ef4444':'#a855f7';
    const hazard = G.zoneHazards[z.n];
    h+='<div class="zcard '+(lk?'locked':'')+'" data-i="'+i+'"><div class="zh"><span class="zn">'+z.n+'</span><span class="zl">Lv.'+z.lv+(lk?' 🔒':'')+'</span></div><div class="zd">'+z.d+'</div>';
    if(hazard){
      h+='<div style="font-size:10px;color:#f59e0b;margin-bottom:6px;">⚠️ Hazard: '+hazard.desc+'</div>';
    }
    h+='<div class="zm"><span class="db" style="background:'+dc+'20;color:'+dc+'">'+z.dg+'</span><span class="xb">'+z.xp+' XP</span></div></div>';
  }
  h+='</div></div>'; return h;
}

function rCbt() {
  let h = '<div class="combat-view"><h2 class="st">' + (G.currentBoss ? '⚔️ BOSS FIGHT' : 'Combat') + '</h2>';
  
  const synDesc = getSynergyDesc();
  if (synDesc) {
    h += '<div style="background:#7c3aed15;border:1px solid var(--accent);border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:var(--accent-light);">';
    h += '✨ ' + synDesc + '</div>';
  }

  // Planar Resonance Indicator (Phase 2)
  const zone = G.zones.find(z => z.en.includes(G.cbt.en[0]?.n));
  if (zone && zone.elem) {
    const resStatus = getResonanceStatus(zone.n);
    h += '<div style="background:' + resStatus.color + '15;border:1px solid ' + resStatus.color + ';border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:' + resStatus.color + ';">';
    h += resStatus.icon + ' ' + resStatus.text + '</div>';
  }

  // Dimensional Instability Indicator (Phase 2)
  const riftStatus = getRiftStatus();
  if (riftStatus) {
    h += '<div style="background:' + riftStatus.color + '15;border:1px solid ' + riftStatus.color + ';border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:' + riftStatus.color + ';">';
    h += riftStatus.icon + ' ' + riftStatus.name + ': ' + riftStatus.desc + ' (' + riftStatus.fightsLeft + ' fights left)</div>';
  }
  
  h += '<button id="btn-auto" style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid ' + (G.cbt.autoCombat ? '#22c55e' : 'var(--disabled)') + ';background:' + (G.cbt.autoCombat ? '#22c55e15' : 'transparent') + ';color:' + (G.cbt.autoCombat ? '#22c55e' : 'var(--text-dim)') + ';font-size:12px;font-weight:600;cursor:pointer;margin-bottom:12px;user-select:none;">';
  h += (G.cbt.autoCombat ? '🤖 AUTO ON — Tap to take control' : '🤖 Auto-Combat — Let AI fight') + '</button>';

  // Potion button
  const potions = getCombatPotions();
  const usablePotions = potions.filter(p => {
    if (p.t === 'revive') return getDeadParty().length > 0;
    return true;
  });
  h += '<button onclick="togglePotionMenu()" style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid ' + (usablePotions.length > 0 ? '#22c55e' : 'var(--disabled)') + ';background:' + (usablePotions.length > 0 ? '#22c55e15' : 'transparent') + ';color:' + (usablePotions.length > 0 ? '#22c55e' : 'var(--disabled)') + ';font-size:12px;font-weight:600;cursor:' + (usablePotions.length > 0 ? 'pointer' : 'not-allowed') + ';margin-bottom:12px;user-select:none;">';
  h += (G.potionMenu ? '❌ Close Potion Bag' : '🧪 Use Potion (' + usablePotions.length + ' usable)') + '</button>';

  // Potion menu
  if (G.potionMenu && potions.length > 0) {
    h += '<div style="background:var(--bg-card);border:1px solid #22c55e;border-radius:12px;padding:10px;margin-bottom:12px;">';
    h += '<div style="font-size:11px;color:#22c55e;margin-bottom:8px;">🧪 Quick Potion Bag</div>';
    h += '<div style="display:flex;flex-direction:column;gap:6px;">';
    for (let i = 0; i < G.p.inv.length; i++) {
      const it = G.p.inv[i];
      // Regular potions (heal/mana)
      if ((it.t === 'pot' || it.t === 'food' || it.t === 'drink') && (it.eff === 'heal' || it.eff === 'mana')) {
        const isHeal = it.eff === 'heal';
        const icon = isHeal ? '❤️' : '💧';
        const color = isHeal ? '#ef4444' : '#3b82f6';
        const current = isHeal ? G.p.hp + '/' + G.p.mhp : G.p.mp + '/' + G.p.mmp;
        const full = isHeal ? G.p.hp >= G.p.mhp : G.p.mp >= G.p.mmp;
        h += '<button onclick="usePotionInCombat(' + i + ')" style="padding:10px 14px;border-radius:10px;border:1px solid ' + color + ';background:' + color + '15;color:' + (full ? 'var(--disabled)' : color) + ';font-size:12px;font-weight:600;cursor:' + (full ? 'not-allowed' : 'pointer') + ';display:flex;justify-content:space-between;align-items:center;opacity:' + (full ? '0.5' : '1') + ';">';
        h += '<span>' + icon + ' ' + it.n + (it.q > 1 ? ' x' + it.q : '') + '</span>';
        h += '<span>' + (full ? 'FULL' : '+' + it.v + ' ' + (isHeal ? 'HP' : 'MP')) + ' · ' + current + '</span>';
        h += '</button>';
      }
      // Revive items (Phoenix Feather, etc.)
      else if (it.t === 'revive') {
        const deadMembers = getDeadParty();
        const hasDead = deadMembers.length > 0;
        const color = hasDead ? '#f59e0b' : 'var(--disabled)';
        const icon = '🔥';
        h += '<button onclick="usePotionInCombat(' + i + ')" style="padding:10px 14px;border-radius:10px;border:1px solid ' + color + ';background:' + color + '15;color:' + color + ';font-size:12px;font-weight:600;cursor:' + (hasDead ? 'pointer' : 'not-allowed') + ';display:flex;justify-content:space-between;align-items:center;opacity:' + (hasDead ? '1' : '0.5') + ';">';
        h += '<span>' + icon + ' ' + it.n + (it.q > 1 ? ' x' + it.q : '') + '</span>';
        h += '<span>' + (hasDead ? 'Revive 50% HP' : 'No one to revive') + ' · ' + deadMembers.length + ' down</span>';
        h += '</button>';
      }
    }
    h += '</div></div>';
  }
  
  // Reuse zone variable from resonance check above
  if (zone && G.zoneHazards[zone.n]) {
    const haz = G.zoneHazards[zone.n];
    h += '<div style="background:#f59e0b15;border:1px solid #f59e0b;border-radius:12px;padding:8px;margin-bottom:12px;font-size:11px;color:#f59e0b;">';
    h += '⚠️ Zone Hazard: ' + haz.name + ' — ' + haz.desc + '</div>';
  }
  
  if (G.currentBoss) {
    h += '<div style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:10px;margin-bottom:12px;font-size:12px;color:var(--danger);">';
    h += '🔥 ' + G.currentBoss.desc + '</div>';
  }
  
  const playerAC = getPlayerAC();
  const eqStats = getEquippedStats();
  h += '<div style="display:flex;justify-content:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;">';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">AC </span><span style="font-weight:700;color:var(--accent-light);">' + playerAC + '</span>';
  if(eqStats.def > 0) h += '<span style="font-size:9px;color:var(--success);"> +' + eqStats.def + 'eq</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">PROF </span><span style="font-weight:700;color:var(--gold);">+' + DICE.proficiencyBonus(G.p.lvl) + '</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">ATK </span><span style="font-weight:700;color:var(--hp);">+' + (eqStats.atk + (G.p.eq.weapon?.atk||0)) + '</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">CRIT </span><span style="font-weight:700;color:var(--danger);">' + Math.floor(getTotalCritChance() * 100) + '%</span>';
  if(eqStats.critChance > 0) h += '<span style="font-size:9px;color:var(--success);"> +' + Math.floor(eqStats.critChance*100) + '%eq</span>';
  h += '</div>';
  h += '</div>';
  
  h += '<div class="erow">';
  for (let i = 0; i < G.cbt.en.length; i++) {
    const e = G.cbt.en[i], d = e.hp <= 0, s = G.cbt.tg == i && !d ? 'sel' : '';
    const immuneFire = ['Fire Imp', 'Lava Slug', 'Ash Wraith'].includes(e.n);
    const immuneIce = ['Ice Elemental', 'Frost Wolf', 'Frozen Knight'].includes(e.n);
    const isBoss = e.mechanic ? true : false;
    const enemyAC = getEnemyAC(e);
    
    h += '<div class="ecard ' + (d ? 'dead' : '') + ' ' + s + '" data-i="' + i + '" style="' + (isBoss ? 'border-color:var(--danger);box-shadow:0 0 10px #ef444440;' : '') + '">';
    h += '<div class="eicon">' + (d ? '💀' : ee(e.n)) + '</div>';
    h += '<div class="ename">' + e.n + (isBoss ? ' 👑' : '') + '</div>';
    
    if (!d) {
      h += '<div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">AC ' + enemyAC + '</div>';
    }
    
    if (!d && e.elem && e.elem !== 'none') {
      const elemIcon = e.elem === 'fire' ? '🔥' : e.elem === 'ice' ? '❄️' : e.elem === 'lightning' ? '⚡' : e.elem === 'void' ? '🌑' : '✦';
      h += '<div style="font-size:10px;color:#f59e0b;margin-top:2px;">' + elemIcon + ' ' + e.elem + '</div>';
    }
    
    if (!d && e.status && e.status.length > 0) {
      const statusIcons = e.status.map(s => s.type === 'burn' ? '🔥' : s.type === 'poison' ? '☠️' : s.type === 'shock' ? '⚡' : '✦').join('');
      h += '<div style="font-size:10px;color:var(--danger);margin-top:2px;">' + statusIcons + ' (' + e.status[0].turns + 't)</div>';
    }
    
    if (!d && (immuneFire || immuneIce)) {
      h += '<div class="e-immune">' + (immuneFire ? '🔥 Fire Immune' : (immuneIce ? '❄️ Ice Immune' : '')) + '</div>';
    }
    
    if (!d && e.mechanic === 'resurrect') {
      h += '<div style="font-size:10px;color:var(--danger);">💀 Lives: ' + (e.resurrectCount + 1) + '</div>';
    }
    
    if (!d && e.mechanic === 'phase') {
      h += '<div style="font-size:10px;color:var(--accent-light);">💎 Phase ' + e.currentPhase + '/' + e.phases + '</div>';
    }
    
    h += (d ? '<div class="dt">DEFEATED</div>' : '<div class="hps"><div class="bf bf-hp" style="width:' + ((e.hp / e.mhp) * 100) + '%"></div></div><div class="hpt">' + e.hp + '/' + e.mhp + '</div>') + '</div>';
  }
  h += '</div>';
  
  h += '<div class="pstat"><div class="mst"><span class="md" style="background:#7c3aed"></span>San ' + G.p.hp + '/' + G.p.mhp + ' AC' + playerAC + '</div>';
  for (let p of G.party) {
    if (p.on) {
      h += '<div class="mst"><span class="md" style="background:' + p.col + '"></span>' + p.n + ' ' + p.hp + '/' + p.mhp + '</div>';
    }
  }
  h += '</div>';
  
  h += '<div class="skills"><h3>Select Skill</h3><div class="slist">';
  
  const basicSel = G.cbt.sk === -1 && !G.cbt.autoCombat ? 'sel' : '';
  h += '<div class="sbtn ' + basicSel + '" data-i="-1" ' + (G.cbt.autoCombat ? 'style="opacity:0.4;cursor:not-allowed;"' : '') + '>';
  h += '<div class="sn">🪄 Staff Swing</div>';
  h += '<div class="sc">0 MP · Physical · 1d4 + STR</div>';
  h += '<div class="sd">Swing your staff when your spell slots are spent.</div>';
  h += '</div>';
  
    const ls = G.p.skills.filter(s => s.on);
  for (let i = 0; i < ls.length; i++) {
    const s = ls[i];
    const costLabel = typeof getSpellCostLabel === 'function'
      ? getSpellCostLabel(s)
      : (s.c + ' MP');
    const u = G.p.mp >= s.c && !G.cbt.autoCombat;
    const sel = G.cbt.sk == i && !G.cbt.autoCombat ? 'sel' : '';
    const critPct = Math.floor(getTotalCritChance() * 100);
    const highTier = Number(s.slotTier || 1) >= 4;
    const nameStyle = highTier ? ' style="color:#ef4444;font-weight:700;"' : '';
    
    h += '<div class="sbtn ' + (u ? '' : 'dis') + ' ' + sel + '" data-i="' + i + '" ' +
         (G.cbt.autoCombat ? 'style="opacity:0.4;cursor:not-allowed;"' : '') + '>';
    h += '<div class="sn"' + nameStyle + '>' + (s.buff ? '🛡️' : '⚡') + ' ' + s.n + '</div>';
    h += '<div class="sc">' + costLabel + ' · ' + (s.dmg || 'Buff') + ' · ' +
         critPct + '% Crit' + (G.cbt.autoCombat ? ' · 🤖 AUTO' : '') + '</div>';
    h += '<div class="sd">' + s.d + '</div>';
    if (s.elem) {
      const weakAgainst = s.elem === 'fire' ? 'Ice' : s.elem === 'ice' ? 'Fire' : s.elem === 'lightning' ? 'Void' : '';
      if (weakAgainst) {
        h += '<div style="font-size:10px;color:var(--success);">Strong vs: ' + weakAgainst + '</div>';
      }
    }
    h += '</div>';
  }
  h += '</div>';
  
  const isBasic = G.cbt.sk === -1;
  const sk = isBasic ? null : ls[G.cbt.sk];
  const ca = isBasic 
    ? (G.cbt.tg >= 0 && !G.cbt.autoCombat) 
    : (sk && G.p.mp >= sk.c && !G.cbt.autoCombat);
  const si = isBasic ? -1 : G.p.skills.indexOf(sk);
  
  h += '<button class="abtn ' + (ca ? '' : 'dis') + '" data-si="' + si + '" data-ti="' + G.cbt.tg + '" ' + (G.cbt.autoCombat ? 'disabled style="opacity:0.4;"' : '') + '>';
  h += (isBasic ? '🪄 Staff Swing' : 'Cast ' + (sk ? sk.n : '...')) + '</button>';
  h += '<button class="fbtn" ' + (G.cbt.autoCombat ? 'disabled style="opacity:0.4;"' : '') + '>Flee</button>';
 
   // === GRIND ROOM WAVE CONTROLS ===
  if (G.endlessGrind.active) {
    h += '<div style="background:var(--bg-card);border:2px solid var(--accent);border-radius:14px;padding:14px;margin-top:16px;text-align:center;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">⚔️ Grind Room · Wave ' + G.endlessGrind.wave + '</div>';
    
    if (G.endlessGrind.autoNext) {
      h += '<div style="font-size:12px;color:var(--success);">🤖 Auto-next: ON</div>';
    } else {
      h += '<button onclick="startGrindWave()" class="abtn" style="width:100%;margin-bottom:8px;">▶️ Next Wave</button>';
    }
    
    h += '<button onclick="exitGrindRoom()" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:13px;font-weight:600;cursor:pointer;">⏹ Stop & Exit</button>';
    h += '</div>';
  }
  // === END GRIND ROOM WAVE CONTROLS ===

  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:12px;margin-top:12px;">';
  h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">🎲 D&D Combat Rules</div>';
  h += '<div style="font-size:10px;color:var(--text-dim);line-height:1.6;">';
  h += '• Attack: d20 + PROF(+' + DICE.proficiencyBonus(G.p.lvl) + ') + Ability Mod vs Target AC<br>';
  h += '• Natural 20 = Critical Hit (double dice)<br>';
  h += '• Natural 1 = Critical Miss (auto-fail)<br>';
  h += '• Advantage: Roll 2d20, keep higher<br>';
  h += '• Your AC: ' + playerAC + ' | INT Mod: ' + (DICE.abilityMod(G.p.stats.int) >= 0 ? '+' : '') + DICE.abilityMod(G.p.stats.int);
  h += '</div></div>';
  
  h += '</div></div>';
  return h;
}


function rParty(){
  let h='<div class="party-view"><h2 class="st">Party</h2>';
  const activeSyns = getActiveSynergies();
  if(activeSyns.length > 0){
    h += '<div style="background:var(--bg-card);border:1px solid var(--accent);border-radius:14px;padding:12px;margin-bottom:16px;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">✨ Active Synergies</div>';
    h += '<div style="display:flex;flex-direction:column;gap:8px;">';
    for(let syn of activeSyns){
      h += '<div style="display:flex;align-items:center;gap:8px;font-size:12px;">';
      h += '<span style="font-size:16px;">' + syn.icon + '</span>';
      h += '<div style="flex:1;"><div style="font-weight:600;">' + syn.name + '</div>';
      h += '<div style="font-size:10px;color:var(--text-dim);">' + syn.desc + '</div></div>';
      h += '</div>';
    }
    h += '</div></div>';
  }
  h += '<div class="plist">';
  for(let p of G.party){
    h+='<div class="pcard '+(p.on?'':'locked')+'"><div class="pava" style="background:'+p.col+'20;border-color:'+p.col+'"><span style="font-size:28px">'+(p.on?re(p.r):'🔒')+'</span></div><div class="pinfo"><div class="pn">'+p.n+' <span class="pt">'+p.t+'</span></div><div class="pr" style="color:'+p.col+'">'+p.r+'</div><div class="pd">'+p.d+'</div><div class="pb">'+p.b+'</div>'+(p.on?'<div class="ps">HP:'+p.hp+'/'+p.mhp+' ATK:'+p.atk+(p.gear&&p.gear.atk?'(+'+p.gear.atk+')':'')+' DEF:'+p.def+(p.gear&&p.gear.def?'(+'+p.gear.def+')':'')+' SPD:'+p.spd+(p.gear&&p.gear.spd?'(+'+p.gear.spd+')':'')+(getBlessDef(p)?' <span style="color:var(--rest);font-weight:700;">🐱+10 DEF</span>':'')+'</div>':'')+(G.affinity[p.n]?'<div class="affinity-bar"><div class="affinity-fill '+getAffinityColor(G.affinity[p.n].val)+'" style="width:'+(G.affinity[p.n].val/G.affinity[p.n].max*100)+'%"></div></div><div class="affinity-label">'+(G.affinity[p.n].val>=70?'💕 Close':G.affinity[p.n].val>=40?'💛 Friendly':G.affinity[p.n].val>=20?'💔 Distant':'💀 Strained')+' ('+G.affinity[p.n].val+'/'+G.affinity[p.n].max+')</div>':'')
+(G.affinityUnlocks[p.n]?'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">'+G.affinityUnlocks[p.n].map(function(u){var un=p.affinityBonuses&&p.affinityBonuses.includes(u.id);return '<span title="'+u.d+'" style="font-size:9px;padding:2px 6px;border-radius:8px;border:1px solid '+(un?'var(--xp);color:var(--xp);':'var(--border);color:var(--text-dim);opacity:0.6;')+'">'+(un?'🌟 ':'🔒 ')+u.n+' ('+u.th+')</span>';}).join('')+'</div>':'')+'</div></div>';
    // === STAGE 1: ENHANCED TRINKET/GEAR SYSTEM ===
    if(p.on || p.ul <= G.p.lvl){
      h += '<div style="background:var(--bg-hover);border:1px solid var(--border);border-radius:10px;padding:10px;margin-top:8px;">';
      h += '<div style="font-size:11px;font-weight:600;color:var(--accent-light);margin-bottom:6px;">🎁 Trinket Slot</div>';
      if(p.gear){
        // Equipped trinket display with rarity color
        const rarityColor = p.gear.r ? (p.gear.r==='epic'?'#a855f7':p.gear.r==='rare'?'#3b82f6':p.gear.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
        h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
        h += '<span style="font-size:12px;font-weight:600;color:'+rarityColor+';">' + p.gear.n + '</span>';
        h += '<button class="unequip-pgear" data-member="' + p.n + '" style="padding:4px 10px;border-radius:8px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:11px;font-weight:600;cursor:pointer;">Unequip</button>';
        h += '</div>';
        h += '<div style="font-size:10px;color:var(--text-dim);">';
        const stats = [];
        if(p.gear.atk) stats.push('+ ' + p.gear.atk + ' ATK');
        if(p.gear.def) stats.push('+ ' + p.gear.def + ' DEF');
        if(p.gear.hp) stats.push('+ ' + p.gear.hp + ' HP');
        if(p.gear.mp) stats.push('+ ' + p.gear.mp + ' MP');
        if(p.gear.spd) stats.push('+ ' + p.gear.spd + ' SPD');
        h += stats.join(' · ') + '</div>';
        if(p.gear.d) h += '<div style="font-size:10px;color:var(--accent-light);margin-top:4px;font-style:italic;">' + p.gear.d + '</div>';
      } else {
        h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Empty trinket slot</div>';
        // Show ALL equippable pgear items (not just for this member)
        const allPgear = G.p.inv.map((it, idx) => ({it, idx})).filter(x => x.it.t === 'pgear');
        if(allPgear.length > 0){
          h += '<div style="display:flex;flex-direction:column;gap:4px;">';
          for(let eq of allPgear){
            const isForThis = !eq.it.for || eq.it.for === p.n;
            const rarityColor = eq.it.r ? (eq.it.r==='epic'?'#a855f7':eq.it.r==='rare'?'#3b82f6':eq.it.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
            if(isForThis){
              h += '<button class="equip-pgear" data-member="' + p.n + '" data-idx="' + eq.idx + '" style="padding:6px 10px;border-radius:8px;border:1px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:11px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
              h += '<span style="color:'+rarityColor+';">' + eq.it.n + '</span>';
              h += '<span style="font-size:10px;color:var(--text-dim);">Equip →</span>';
              h += '</button>';
            }
          }
          // Show incompatible items as disabled
          const incompatible = allPgear.filter(x => x.it.for && x.it.for !== p.n);
          if(incompatible.length > 0){
            h += '<div style="font-size:10px;color:var(--disabled);margin-top:4px;padding-top:4px;border-top:1px solid var(--border);">Not for ' + p.n + ':</div>';
            for(let eq of incompatible){
              h += '<div style="padding:4px 10px;border-radius:8px;background:var(--nav-bg);color:var(--disabled);font-size:10px;">' + eq.it.n + ' (' + eq.it.for + ' only)</div>';
            }
          }
          h += '</div>';
        } else {
          h += '<div style="font-size:10px;color:var(--disabled);margin-top:4px;">Buy trinkets from traders like Ribald, Deidre, or Nym.</div>';
        }
      }
      h += '</div>';
    }
  }
  h+='</div></div>'; return h;
}
function rSkills(){
  let h='<div class="skills-view"><h2 class="st">Mage Skills</h2><div class="sklist">';
  for(let s of G.p.skills){
    const st=s.on?'LEARNED':'Unlocks Lv.'+s.ul;
    h+='<div class="skcard '+(s.on?'':'locked')+'"><div class="skh"><span class="ski">'+(s.buff?'🛡️':'⚡')+'</span><span class="skt">'+s.n+'</span><span class="sks">'+st+'</span></div><div class="skd"><span class="dp">'+s.c+' MP</span><span class="dp">'+(s.dmg||'Buff')+'</span></div><div class="skdsc">'+s.d+'</div></div>';
  }
  h+='</div><div class="stb"><h3>Character Stats</h3>';
  for(let [k,v] of Object.entries(G.p.stats))h+='<div class="str"><span class="stn">'+k.toUpperCase()+'</span><span class="stv">'+v+'</span></div>';
  h+='</div></div>'; return h;
}

function getEquipScore(item) {
  if (!item || !item.slot) return 0;
  let score = 0;
  if (item.atk) score += item.atk * 3;
  if (item.def) score += item.def * 3;
  if (item.int) score += item.int * 2;
  if (item.str) score += item.str * 2;
  if (item.dex) score += item.dex * 2;
  if (item.con) score += item.con * 2;
  if (item.wis) score += item.wis * 2;
  if (item.cha) score += item.cha * 1;
  if (item.fireDmg) score += item.fireDmg * 2;
  if (item.iceDmg) score += item.iceDmg * 2;
  if (item.lightDmg) score += item.lightDmg * 2;
  if (item.voidDmg) score += item.voidDmg * 2;
  if (item.arcaneDmg) score += item.arcaneDmg * 2;
  if (item.lifeSteal) score += item.lifeSteal * 10;
  if (item.critChance) score += item.critChance * 20;
  if (item.mpRegen) score += item.mpRegen * 2;
  if (item.hpRegen) score += item.hpRegen * 2;
  return score;
}

function getEquipComparison(item) {
  if (!item || !item.slot) return null;
  const slot = item.slot === 'ring' ? (G.p.eq.ring1 ? 'ring2' : 'ring1') : item.slot;
  const equipped = G.p.eq[slot];
  if (!equipped) return { better: true, arrow: '▲', color: '#22c55e', text: 'New slot' };
  const itemScore = getEquipScore(item);
  const eqScore = getEquipScore(equipped);
  if (itemScore > eqScore) return { better: true, arrow: '▲', color: '#22c55e', text: 'Upgrade' };
  if (itemScore < eqScore) return { better: false, arrow: '▼', color: '#ef4444', text: 'Downgrade' };
  return { better: false, arrow: '●', color: '#9ca3af', text: 'Sidegrade' };
}

function rInv(){
  let h='<div class="inventory-view"><h2 class="st">Inventory</h2>';

  // Equipment Stats Summary
  const eqStats = getEquippedStats();
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:12px;margin-bottom:16px;">';
  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">⚔️ Equipment Bonuses</div>';
  h += '<div style="display:flex;flex-wrap:wrap;gap:6px;font-size:10px;">';
  const statLabels = {atk:'ATK',def:'DEF',str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA',
                      fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',
                      lifeSteal:'🩸Leech',critChance:'💥Crit',mpRegen:'💧MP+',hpRegen:'💚HP+',goldFind:'💰Gold'};
  for(let k in statLabels){
    if(eqStats[k] > 0){
      const val = k === 'critChance' || k.includes('Res') ? (eqStats[k]*100)+'%' : (k.includes('Regen') ? '+'+eqStats[k]+'/turn' : '+'+eqStats[k]);
      h += '<span style="background:var(--bg-hover);padding:3px 8px;border-radius:8px;">'+statLabels[k]+' '+val+'</span>';
    }
  }
  h += '</div></div>';

  // Equipped Gear
  h+='<div class="eqs"><h3>Equipped Gear</h3><div class="eqg">';
  const slotOrder = ['weapon','armor','head','hands','feet','ring1','ring2','amulet'];
  const slotIcons = {weapon:'⚔️',armor:'🛡️',head:'🎓',hands:'🧤',feet:'👢',ring1:'💍',ring2:'💍',amulet:'📿'};
  for(let sl of slotOrder){
    const it=G.p.eq[sl];
    const slotName = EQUIPMENT_SLOTS[sl].name;
    h+='<div class="esl" style="cursor:pointer;" onclick="unequipItem(\'"+sl+"\')">';
    h+='<div class="esn">'+slotIcons[sl]+' '+slotName+'</div>';
    if(it){
      h+='<div class="eit" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      let stats = [];
      if(it.atk) stats.push('ATK+'+it.atk);
      if(it.def) stats.push('DEF+'+it.def);
      if(it.int) stats.push('INT+'+it.int);
      if(it.str) stats.push('STR+'+it.str);
      if(it.dex) stats.push('DEX+'+it.dex);
      if(it.con) stats.push('CON+'+it.con);
      if(it.wis) stats.push('WIS+'+it.wis);
      if(it.cha) stats.push('CHA+'+it.cha);
      if(it.prefix) stats.push(it.prefixData.desc);
      if(it.suffix) stats.push(it.suffixData.desc);
      h+='<div class="est">'+stats.join(' · ')+'</div>';
    }else{
      h+='<div class="ese">Empty</div>';
    }
    h+='</div>';
  }
  h+='</div></div>';

  // Categorize inventory items
  const equipItems = [];
  const consumableItems = [];
  const matItems = [];
  const otherItems = [];
  
  for(let i=0; i<G.p.inv.length; i++){
    const it = G.p.inv[i];
    const isEquip = it.slot && it.slot !== 'mat' && it.slot !== 'pot' && it.slot !== 'revive' && it.t !== 'food' && it.t !== 'drink';
    if(isEquip) equipItems.push({item: it, index: i});
    else if(it.t==='pot' || it.t==='food' || it.t==='drink' || it.t==='revive') consumableItems.push({item: it, index: i});
    else if(it.t==='mat') matItems.push({item: it, index: i});
    else otherItems.push({item: it, index: i});
  }

  // Equipment section
  if(equipItems.length > 0){
    h+='<div class="its"><h3>🎒 Equipment ('+equipItems.length+')</h3><div class="ig">';
    for(let ei of equipItems){
      const it = ei.item;
      const i = ei.index;
      const cmp = getEquipComparison(it);
      h+='<div class="ic" style="position:relative;">';
      if(cmp){
        h+='<div style="position:absolute;top:6px;right:6px;font-size:14px;color:'+cmp.color+';font-weight:700;" title="'+cmp.text+'">'+cmp.arrow+'</div>';
      }
      h+='<div class="ii">'+(EQUIPMENT_SLOTS[it.slot]?.icon || '⚔️')+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.ilvl) h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      h += getItemSocketDisplay(it);
      let statLine = [];
      if(it.atk) statLine.push('ATK+'+it.atk);
      if(it.def) statLine.push('DEF+'+it.def);
      if(it.int) statLine.push('INT+'+it.int);
      if(it.str) statLine.push('STR+'+it.str);
      if(it.dex) statLine.push('DEX+'+it.dex);
      if(it.con) statLine.push('CON+'+it.con);
      if(it.wis) statLine.push('WIS+'+it.wis);
      if(it.cha) statLine.push('CHA+'+it.cha);
      if(it.prefix) statLine.push(it.prefixData.desc);
      if(it.suffix) statLine.push(it.suffixData.desc);
      if(statLine.length > 0) h+='<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">'+statLine.join(' · ')+'</div>';
      h+='<div class="iq">'+(it.value ? it.value+'G' : '')+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-e" data-i="'+i+'">Equip</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Consumables section
  if(consumableItems.length > 0){
    h+='<div class="its"><h3>🧪 Consumables ('+consumableItems.length+')</h3><div class="ig">';
    for(let ci of consumableItems){
      const it = ci.item;
      const i = ci.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.eff==='heal') h+='<div style="font-size:10px;color:var(--success);">+'+it.v+' HP</div>';
      if(it.eff==='mana') h+='<div style="font-size:10px;color:var(--mp);">+'+it.v+' MP</div>';
      if(it.eff==='revive') h+='<div style="font-size:10px;color:var(--accent-light);">Revive '+it.v+'% HP</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-u" data-i="'+i+'">Use</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Materials section
  if(matItems.length > 0){
    h+='<div class="its"><h3>💎 Materials ('+matItems.length+')</h3><div class="ig">';
    for(let mi of matItems){
      const it = mi.item;
      const i = mi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  // Other items
  if(otherItems.length > 0){
    h+='<div class="its"><h3>📦 Other ('+otherItems.length+')</h3><div class="ig">';
    for(let oi of otherItems){
      const it = oi.item;
      const i = oi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  if(G.p.inv.length==0) h+='<div class="ei">Your pack is empty.</div>';
  h+='</div>';
  return h;
}

function rCraft(){
  let h='<div class="craft-view"><h2 class="st">Crafting</h2><div class="rlist">';
  for(let i=0;i<G.recipes.length;i++){
    const r=G.recipes[i]; let ok=true,ms='';
    for(let [mn,mq] of Object.entries(r.m)){
      const iv=G.p.inv.find(x=>x.n==mn);
      const hv=iv?iv.q:0,en=hv>=mq;
      if(!en)ok=false;
      ms+='<span class="mp '+(en?'ok':'miss')+'">'+mn+': '+hv+'/'+mq+'</span>';
    }
    h+='<div class="rc"><div class="rr"><span class="ri">'+ie(r.res)+'</span><span class="rn" style="color:'+rc(r.res.r)+'">'+r.n+'</span><span class="rd">'+r.d+'</span></div><div class="rms">'+ms+'</div><button class="cb '+(ok?'':'dis')+'" data-i="'+i+'">Forge</button></div>';
  }
  h+='</div></div>'; return h;
}

function toggleQuestCollapse(key){
  G.questCollapsed[key] = !G.questCollapsed[key];
  render();
}

function rQuest(){
  let h='<div class="quest-view">';
    // === DAILY LOGIN REWARDS ===
  const today = G.gameDay || 0;
  const streak = G.loginStreak || 0;
  const claimedToday = G.loginClaimed || false;

  const loginRewards = [
    { day: 1, icon: '💰', name: 'Gold Pouch', g: 50, xp: 25 },
    { day: 2, icon: '💧', name: 'Mana Crystal', mp: 30, xp: 35 },
    { day: 3, icon: '🧪', name: 'Health Potion', hp: 50, xp: 45 },
    { day: 4, icon: '💎', name: 'Gem Shard', g: 100, xp: 60 },
    { day: 5, icon: '⚔️', name: 'Mystic Scroll', g: 150, xp: 80 },
    { day: 6, icon: '🔮', name: 'Arcane Orb', mp: 50, xp: 100 },
    { day: 7, icon: '👑', name: 'Legendary Cache', g: 300, xp: 200, item: { n: 'Phoenix Feather', t: 'revive', eff: 'revive', v: 50, q: 1, r: 'rare' } }
  ];

  const todayReward = loginRewards[Math.min(streak, 6)];

  h += '<div style="background: linear-gradient(135deg, var(--accent), #6d28d9); border-radius: 16px; padding: 16px; margin-bottom: 16px; color: white;">';
  h += '<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">';
  h += '<div style="font-size: 28px;">🎁</div>';
  h += '<div><div style="font-weight: 700; font-size: 16px;">Daily Login Reward</div>';
  h += '<div style="font-size: 11px; opacity: 0.9;">Day ' + (streak + 1) + ' · Streak: ' + streak + '</div></div>';
  h += '</div>';

  h += '<div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px; margin-bottom: 12px;">';
  h += '<div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">Today\'s Reward:</div>';
  h += '<div style="display: flex; align-items: center; gap: 8px;">';
  h += '<div style="font-size: 32px;">' + todayReward.icon + '</div>';
  h += '<div style="flex: 1;">';
  h += '<div style="font-weight: 600; font-size: 14px;">' + todayReward.name + '</div>';
  h += '<div style="font-size: 11px; opacity: 0.85;">';
  const rewardParts = [];
  if (todayReward.g) rewardParts.push('+' + todayReward.g + 'G');
  if (todayReward.xp) rewardParts.push('+' + todayReward.xp + 'XP');
  if (todayReward.hp) rewardParts.push('+' + todayReward.hp + 'HP');
  if (todayReward.mp) rewardParts.push('+' + todayReward.mp + 'MP');
  if (todayReward.item) rewardParts.push(todayReward.item.n);
  h += rewardParts.join(' · ');
  h += '</div></div></div></div>';

  // Streak progress dots
  h += '<div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 12px;">';
  for (let i = 0; i < 7; i++) {
    const isActive = i < streak;
    const isToday = i === streak;
    h += '<div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; ' + 
      (isActive ? 'background: #fbbf24; color: #000;' : 
       isToday ? 'background: white; color: var(--accent); border: 2px solid #fbbf24;' : 
       'background: rgba(255,255,255,0.2); color: white;') + '">' + (i + 1) + '</div>';
  }
  h += '</div>';

  if (claimedToday) {
    h += '<button disabled style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: rgba(255,255,255,0.2); color: white; font-size: 13px; font-weight: 600; opacity: 0.6; cursor: not-allowed;">✅ Claimed Today — Come Back Tomorrow!</button>';
  } else {
    h += '<button id="btn-claim-login" style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: #fbbf24; color: #000; font-size: 13px; font-weight: 700; cursor: pointer;">🎁 Claim Reward</button>';
  }
  h += '</div>';
  // === END DAILY LOGIN ===

  // Storyline section
  h+='<h2 class="st">📖 Storyline</h2><div class="qlist">';
  for(let s of G.storyline){
    if(!s.unlocked) continue;
    const pc=Math.min(100,(G.p.lvl/s.need)*100);
    h+='<div class="qc '+(s.done?'done':'')+'" style="border-color:var(--accent-light);"><div class="qh"><span class="qn">'+(s.done?'✅ ':'')+'Ch.'+s.chapter+': '+s.n+'</span><span class="qr">'+s.rw.xp+' XP | '+s.rw.g+' G</span></div>';
    h+='<div class="qd">'+s.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">Lv.'+G.p.lvl+'/'+s.need+'</span></div></div>';
  }
  h+='</div>';
  // Active quests section
  h+='<h2 class="st" style="margin-top:20px;">📜 Active Quests</h2><div class="qlist">';
  for(let q of G.quests){
    if(q.hidden && !q.revealed) continue;
    const pc=Math.min(100,(q.c/q.need)*100);
    const timerStatus=getTimerStatus(q);
    let cardClass=q.done?'done':(q.expired?'expired':(timerStatus?(timerStatus.cls==='timer-urgent'?'timed-urgent':'timed'):''));
    h+='<div class="qc '+cardClass+'"><div class="qh"><span class="qn">'+(q.done?'✅ ':(q.expired?'❌ ':''))+q.n+'</span><span class="qr">'+q.rw.xp+' XP | '+q.rw.g+' G</span></div>';
    if(q.chain){
      h+='<div style="font-size:10px;color:var(--accent-light);margin-bottom:4px;">🔗 Chain: '+q.chain+'</div>';
    }
    if(q.reqQuest && !q.revealed){
      const req=G.quests.find(rq=>rq.id===q.reqQuest);
      h+='<div style="font-size:10px;color:var(--text-dim);font-style:italic;margin-bottom:4px;">🔒 Requires: '+(req?req.n:'Unknown')+'</div>';
    }
    h+='<div class="qd">'+q.d+'</div>';
    if(timerStatus){
      h+='<div class="timer-bar"><div class="timer-fill '+timerStatus.cls+'" style="width:'+timerStatus.pct+'%"></div></div>';
      h+='<div class="timer-label">⏰ '+timerStatus.label+'</div>';
    }
    h+='<div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+Math.min(q.c,q.need)+'/'+q.need+'</span></div></div>';
  }
  h+='</div>';
    // Daily Quests section
  h += '<h2 class="st" style="margin-top:20px;">📋 Daily Quests</h2><div class="qlist">';
  generateDailyQuests();
  if (G.dailyQuests.length === 0) {
    h += '<div class="qc"><div class="qd">No daily quests available. Check back tomorrow!</div></div>';
  } else {
    for (let q of G.dailyQuests) {
      const pc = Math.min(100, (q.c / q.need) * 100);
      h += '<div class="qc ' + (q.done ? 'done' : '') + '"><div class="qh"><span class="qn">' + q.n + '</span><span class="qr">' + q.rw.xp + ' XP | ' + q.rw.g + ' G</span></div>';
      h += '<div class="qd">' + q.d + '</div><div class="qp"><div class="pbar"><div class="pfill" style="width:' + pc + '%"></div></div><span class="ptxt">' + q.c + '/' + q.need + '</span></div></div>';
    }
  }
  h += '</div>';
    // Bounties section
  const activeBounties = G.bounties.filter(b => !b.done && G.p.lvl >= (b.minLv || 1));
  const doneBounties = G.bounties.filter(b => b.done);
  if (activeBounties.length > 0 || doneBounties.length > 0) {
    h+='<h2 class="st" style="margin-top:20px;">💰 Bounties</h2>';
    if (activeBounties.length > 0) {
      h+='<div class="qlist">';
      for(let b of activeBounties){
        const pc=Math.min(100,(b.c/b.need)*100);
        h+='<div class="qc"><div class="qh"><span class="qn">'+b.n+'</span><span class="qr">'+b.rw.xp+' XP | '+b.rw.g+' G</span></div>';
        h+='<div class="qd">'+b.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+b.c+'/'+b.need+'</span></div></div>';
      }
      h+='</div>';
    }
    if (doneBounties.length > 0) {
      const collapsed = G.questCollapsed['__bounties_done__'];
      h+='<div style="margin-top:12px;">';
      h+='<div onclick="toggleQuestCollapse(\'__bounties_done__\')" style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:12px 16px;background:var(--bg-hover);border-radius:14px;border:1px solid var(--border);user-select:none;">';
      h+='<span style="font-size:12px;transition:transform 0.2s;display:inline-block;' + (collapsed ? '' : 'transform:rotate(90deg);') + '">▶</span>';
      h+='<span style="font-size:14px;font-weight:600;color:var(--success);">✅ Claimed</span>';
      h+='<span style="font-size:12px;color:var(--text-dim);margin-left:auto;">' + doneBounties.length + '</span>';
      h+='</div>';
      if (!collapsed) {
        h+='<div class="qlist" style="margin-top:8px;">';
        for(let b of doneBounties){
          h+='<div class="qc done" style="opacity:0.55;"><div class="qh"><span class="qn" style="text-decoration:line-through;">'+b.n+'</span><span class="qr" style="color:var(--success);">✓</span></div>';
          h+='<div class="qd">'+b.d+'</div></div>';
        }
        h+='</div>';
      }
      h+='</div>';
    }
  }
  h+='</div>';
  h+='<div class="sum"><div class="si2"><span class="sv">'+G.p.kills+'</span><span class="sl">Monsters</span></div><div class="si2"><span class="sv">'+G.p.quests+'</span><span class="sl">Quests</span></div><div class="si2"><span class="sv">'+G.p.fstreak+'</span><span class="sl">Focus</span></div></div></div>';
  return h;
}

function rFocus(){
  // If focus is not active, show the session picker
  if (!G.fs || G.state !== 'focus') {
    let h = '<div class="fv">';
    h += '<div style="font-size:42px;margin-bottom:8px;">🧘</div>';
    h += '<div class="fl" style="font-size:18px;font-weight:700;margin-bottom:4px;">Focus Mode</div>';
    h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:20px;">Pick a session length</div>';
    h += '<div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:0 auto;">';
    const sessions = [
      {m:5, xp:20, g:10, label:'Quick Sprint'},
      {m:10, xp:40, g:20, label:'Short Burst'},
      {m:15, xp:60, g:30, label:'Deep Work'},
      {m:20, xp:80, g:40, label:'Extended Flow'},
      {m:25, xp:100, g:50, label:'Full Pomodoro'}
    ];
    for (let s of sessions) {
      h += '<button class="focus-session-btn" data-min="' + s.m + '" style="padding:14px 18px;border-radius:14px;border:2px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
      h += '<span>' + s.m + ' min — ' + s.label + '</span>';
      h += '<span style="font-size:11px;color:var(--success);">+' + s.xp + 'XP +' + s.g + 'G</span>';
      h += '</button>';
    }
    h += '</div>';
    h += '<div class="ftips" style="margin-top:20px;"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward scales with session length!</li></ul></div>';
    h += '</div>';
    return h;
  }
  // Active focus session
  const el=Date.now()-(G.fs||Date.now()),rm=Math.max(0,G.fd-el);
  const m=Math.floor(rm/60000),s=Math.floor((rm%60000)/1000);
  return '<div class="fv"><div class="fc"><div class="ft" id="ft">'+m+':'+s.toString().padStart(2,'0')+'</div><div class="fl">Focus Mode — ' + (G.focusDuration || 25) + ' min</div></div><div class="ftips"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward: +' + ((G.focusDuration||25)*4) + ' XP when done!</li></ul></div><button class="cfb">Cancel</button></div>';
}

function rTemple() {
  const dead = getDeadParty();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">⛪ Temple of Resurrection</h2>';
  h2 += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ancient magic restores fallen companions. Cost: 50G each.</div>';
  if(dead.length === 0){
    h2 += '<div style="text-align:center;padding:20px;color:var(--success);">✨ All companions are alive!</div>';
  }else{
    h2 += '<div style="margin-bottom:12px;">';
    for(let p of G.party){
      const isDead = p.hp <= 0;
      const canAfford = G.p.gold >= 50;
      h2 += '<div class="temple-revive ' + (isDead ? 'dead' : 'alive') + '">';
      h2 += '<div class="tr-ava" style="background:' + p.col + '20;border-color:' + p.col + '">' + (isDead ? '💀' : re(p.r)) + '</div>';
      h2 += '<div class="tr-info">';
      h2 += '<div class="tr-name">' + p.n + '</div>';
      h2 += '<div class="tr-status ' + (isDead ? '' : 'alive') + '">' + (isDead ? '💀 FALLEN' : '✅ Alive ' + p.hp + '/' + p.mhp) + '</div>';
      h2 += '</div>';
      if(isDead) h2 += '<button class="tr-btn ' + (canAfford ? '' : 'dis') + '" data-m="' + p.n + '">' + (canAfford ? 'Revive (50G)' : 'Need 50G') + '</button>';
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  return h2;
}

function rRest() {
  const dead = getDeadParty();
  if(dead.length > 0 && !G.rest.active) return rTemple();

  if (G.rest.active && G.rest.selectedSite) {
    const site = G.rest.selectedSite;
    const currentTick = G.rest.tick;
    const maxTicks = G.rest.maxTicks;
    const pct = (currentTick / maxTicks) * 100;
    const healerName = getHealerName();
    let h2 = '<div class="rest-view">';
    h2 += '<h2 class="st">🔥 Resting at ' + site.name + '</h2>';
    if (G.ambushWarning) {
      h2 += '<div class="ambush-warning">';
      h2 += '<div class="aw-text">⚠️ ' + G.ambushWarning.text + '</div>';
      h2 += '</div>';
    }
    if (G.currentDialogue && !G.ambushWarning) {
      h2 += '<div class="dialogue-box">';
      h2 += '<div class="d-speaker">' + G.currentDialogue.speaker + '</div>';
      h2 += '<div class="d-text">' + G.currentDialogue.text + '</div>';
      h2 += '</div>';
    }
    h2 += '<div class="tick-track">';
    for (let i = 1; i <= maxTicks; i++) {
      let tickClass = '';
      let tickIcon = '○';
      if (i < currentTick) {
        tickClass = 'done';
        tickIcon = '✓';
      } else if (i === currentTick) {
        tickClass = 'current';
        tickIcon = '🔥';
      }
      h2 += '<div class="tick ' + tickClass + '">' + tickIcon + '</div>';
    }
    h2 += '</div>';
    h2 += '<div class="tick-label">Tick ' + currentTick + '/' + maxTicks + '</div>';
    h2 += '<div class="rest-progress" style="margin-top:16px;">';
    h2 += '<div class="rest-bar"><div class="rest-fill" style="width:' + pct + '%"></div></div>';
    h2 += '<div class="rest-healer ok">💚 ' + healerName + ' is tending to the party</div>';
    h2 += '</div>';
    h2 += '<button class="rest-cancel" id="cancel-rest">Cancel Rest (Partial Recovery)</button>';
    h2 += '</div>';
    return h2;
  }

  const healerOk = hasHealer();
  const healerName = getHealerName();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">💤 Rest</h2>';
  if (healerOk) {
    h2 += '<div class="rest-healer ok" style="background:#22c55e15;border:1px solid var(--success);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--success);">💚 Healer Available: ' + healerName + '</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">5 ticks, 1.5s each. Dialogue every tick. Ambush chance: 15% camp / 5% tavern.</div>';
    h2 += '</div>';
  } else {
    h2 += '<div class="rest-healer fail" style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--danger);">❌ No Healer in Party</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">You need a healer (like Eliz) in your active party to rest safely.</div>';
    h2 += '</div>';
  }
  const soelActive = G.party.some(p => p.n === 'Soel' && p.on);
  h2 += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;text-align:left;">';
  h2 += '<div style="font-size:13px;font-weight:600;color:var(--rest);margin-bottom:4px;">🐱 Soel\'s Spirit Blessing</div>';
  if (!soelActive) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Soel must be in your active party to share his blessing.</div>';
  } else if (G.soelBlessing) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Blessing rests on <b style="color:var(--text);">' + G.soelBlessing.target + '</b> (+' + G.soelBlessing.def + ' DEF). One blessing per rest \u2014 it fades when you next make camp.</div>';
  } else {
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">One member per rest receives +10 DEF until your next rest.</div>';
    h2 += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    for (let m of G.party) {
      if (!m.on || m.n === 'Soel') continue;
      h2 += '<button class="soel-bless-btn" data-n="' + m.n + '" style="padding:6px 12px;border-radius:10px;border:1px solid var(--rest);background:#10b98115;color:var(--text);font-size:11px;font-weight:600;cursor:pointer;">' + m.n + '</button>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div class="rest-sites">';
  const zones = {};
  for (let site of G.rest.sites) {
    if (!zones[site.zone]) zones[site.zone] = [];
    zones[site.zone].push(site);
  }
  for (let zoneName in zones) {
    const sites = zones[zoneName];
    const anyUnlocked = sites.some(s => s.unlocked);
    if (!anyUnlocked) continue;
    h2 += '<div style="margin-bottom:12px;">';
    h2 += '<div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">' + zoneName + '</div>';
    for (let site of sites) {
    let manaSpringRemaining = 8;
    if (G.manaSpringUses.day === G.gameDay) {
        manaSpringRemaining = 8 - G.manaSpringUses.count;
      }
      const isDepletedManaSpring = site.type === 'mana_spring' && manaSpringRemaining <= 0;

      const locked = !site.unlocked || isDepletedManaSpring;

      const canAfford = !site.cost || G.p.gold >= site.cost;
      const canRest = (site.type === 'mana_spring' || site.type === 'temple' || healerOk) && !locked && canAfford;
      h2 += '<div class="rs-card ' + (locked ? 'locked' : '') + '" data-id="' + site.id + '">';
      h2 += '<div class="rs-head">';
      h2 += '<span class="rs-name">' + site.icon + ' ' + site.name + '</span>';
      h2 += '<span class="rs-type ' + site.type + '">' + site.type.toUpperCase() + '</span>';
      h2 += '</div>';
      h2 += '<div class="rs-desc">' + site.desc + '</div>';
            if (locked) {
            if (isDepletedManaSpring) {
          h2 += '<div class="rs-req fail">💧 Daily limit reached (8/8 uses)</div>';

        } else {
          h2 += '<div class="rs-req fail">🔒 Requires Level ' + site.zoneLv + ' to discover</div>';
        }
      } else if (site.cost) {

                const msUsesLeft = site.type === 'mana_spring' ? ' (' + manaSpringRemaining + '/8 today)' : '';
        h2 += '<div class="rs-req ' + (canAfford ? 'ok' : 'fail') + '">' + (canAfford ? '✅' : '❌') + ' Cost: ' + site.cost + 'G' + msUsesLeft + ' · Ambush: 5% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';


      } else {
        h2 += '<div class="rs-req ' + (healerOk ? 'ok' : 'fail') + '">' + (healerOk ? '✅' : '❌') + ' Free · Ambush: 15% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';
      }
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:8px;">Rest takes ~7.5 seconds. Party banter every tick. Taverns cost gold but are safer.</div>';
  h2 += '</div>';
  return h2;
}

function rParty(){
  let h='<div class="party-view"><h2 class="st">Party</h2>';
  const activeSyns = getActiveSynergies();
  if(activeSyns.length > 0){
    h += '<div style="background:var(--bg-card);border:1px solid var(--accent);border-radius:14px;padding:12px;margin-bottom:16px;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">✨ Active Synergies</div>';
    h += '<div style="display:flex;flex-direction:column;gap:8px;">';
    for(let syn of activeSyns){
      h += '<div style="display:flex;align-items:center;gap:8px;font-size:12px;">';
      h += '<span style="font-size:16px;">' + syn.icon + '</span>';
      h += '<div style="flex:1;"><div style="font-weight:600;">' + syn.name + '</div>';
      h += '<div style="font-size:10px;color:var(--text-dim);">' + syn.desc + '</div></div>';
      h += '</div>';
    }
    h += '</div></div>';
  }
  h += '<div class="plist">';
  for(let p of G.party){
    h+='<div class="pcard '+(p.on?'':'locked')+'"><div class="pava" style="background:'+p.col+'20;border-color:'+p.col+'"><span style="font-size:28px">'+(p.on?re(p.r):'🔒')+'</span></div><div class="pinfo"><div class="pn">'+p.n+' <span class="pt">'+p.t+'</span></div><div class="pr" style="color:'+p.col+'">'+p.r+'</div><div class="pd">'+p.d+'</div><div class="pb">'+p.b+'</div>'+(p.on?'<div class="ps">HP:'+p.hp+'/'+p.mhp+' ATK:'+p.atk+(p.gear&&p.gear.atk?'(+'+p.gear.atk+')':'')+' DEF:'+p.def+(p.gear&&p.gear.def?'(+'+p.gear.def+')':'')+' SPD:'+p.spd+(p.gear&&p.gear.spd?'(+'+p.gear.spd+')':'')+(getBlessDef(p)?' <span style="color:var(--rest);font-weight:700;">🐱+10 DEF</span>':'')+'</div>':'')+(G.affinity[p.n]?'<div class="affinity-bar"><div class="affinity-fill '+getAffinityColor(G.affinity[p.n].val)+'" style="width:'+(G.affinity[p.n].val/G.affinity[p.n].max*100)+'%"></div></div><div class="affinity-label">'+(G.affinity[p.n].val>=70?'💕 Close':G.affinity[p.n].val>=40?'💛 Friendly':G.affinity[p.n].val>=20?'💔 Distant':'💀 Strained')+' ('+G.affinity[p.n].val+'/'+G.affinity[p.n].max+')</div>':'')
+(G.affinityUnlocks[p.n]?'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">'+G.affinityUnlocks[p.n].map(function(u){var un=p.affinityBonuses&&p.affinityBonuses.includes(u.id);return '<span title="'+u.d+'" style="font-size:9px;padding:2px 6px;border-radius:8px;border:1px solid '+(un?'var(--xp);color:var(--xp);':'var(--border);color:var(--text-dim);opacity:0.6;')+'">'+(un?'🌟 ':'🔒 ')+u.n+' ('+u.th+')</span>';}).join('')+'</div>':'')+'</div></div>';
    // === STAGE 1: ENHANCED TRINKET/GEAR SYSTEM ===
    if(p.on || p.ul <= G.p.lvl){
      h += '<div style="background:var(--bg-hover);border:1px solid var(--border);border-radius:10px;padding:10px;margin-top:8px;">';
      h += '<div style="font-size:11px;font-weight:600;color:var(--accent-light);margin-bottom:6px;">🎁 Trinket Slot</div>';
      if(p.gear){
        // Equipped trinket display with rarity color
        const rarityColor = p.gear.r ? (p.gear.r==='epic'?'#a855f7':p.gear.r==='rare'?'#3b82f6':p.gear.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
        h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
        h += '<span style="font-size:12px;font-weight:600;color:'+rarityColor+';">' + p.gear.n + '</span>';
        h += '<button class="unequip-pgear" data-member="' + p.n + '" style="padding:4px 10px;border-radius:8px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:11px;font-weight:600;cursor:pointer;">Unequip</button>';
        h += '</div>';
        h += '<div style="font-size:10px;color:var(--text-dim);">';
        const stats = [];
        if(p.gear.atk) stats.push('+ ' + p.gear.atk + ' ATK');
        if(p.gear.def) stats.push('+ ' + p.gear.def + ' DEF');
        if(p.gear.hp) stats.push('+ ' + p.gear.hp + ' HP');
        if(p.gear.mp) stats.push('+ ' + p.gear.mp + ' MP');
        if(p.gear.spd) stats.push('+ ' + p.gear.spd + ' SPD');
        h += stats.join(' · ') + '</div>';
        if(p.gear.d) h += '<div style="font-size:10px;color:var(--accent-light);margin-top:4px;font-style:italic;">' + p.gear.d + '</div>';
      } else {
        h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Empty trinket slot</div>';
        // Show ALL equippable pgear items (not just for this member)
        const allPgear = G.p.inv.map((it, idx) => ({it, idx})).filter(x => x.it.t === 'pgear');
        if(allPgear.length > 0){
          h += '<div style="display:flex;flex-direction:column;gap:4px;">';
          for(let eq of allPgear){
            const isForThis = !eq.it.for || eq.it.for === p.n;
            const rarityColor = eq.it.r ? (eq.it.r==='epic'?'#a855f7':eq.it.r==='rare'?'#3b82f6':eq.it.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
            if(isForThis){
              h += '<button class="equip-pgear" data-member="' + p.n + '" data-idx="' + eq.idx + '" style="padding:6px 10px;border-radius:8px;border:1px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:11px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
              h += '<span style="color:'+rarityColor+';">' + eq.it.n + '</span>';
              h += '<span style="font-size:10px;color:var(--text-dim);">Equip →</span>';
              h += '</button>';
            }
          }
          // Show incompatible items as disabled
          const incompatible = allPgear.filter(x => x.it.for && x.it.for !== p.n);
          if(incompatible.length > 0){
            h += '<div style="font-size:10px;color:var(--disabled);margin-top:4px;padding-top:4px;border-top:1px solid var(--border);">Not for ' + p.n + ':</div>';
            for(let eq of incompatible){
              h += '<div style="padding:4px 10px;border-radius:8px;background:var(--nav-bg);color:var(--disabled);font-size:10px;">' + eq.it.n + ' (' + eq.it.for + ' only)</div>';
            }
          }
          h += '</div>';
        } else {
          h += '<div style="font-size:10px;color:var(--disabled);margin-top:4px;">Buy trinkets from traders like Ribald, Deidre, or Nym.</div>';
        }
      }
      h += '</div>';
    }
  }
  h+='</div></div>'; return h;
}
function rSkills(){
  let h='<div class="skills-view"><h2 class="st">Mage Skills</h2><div class="sklist">';
  for(let s of G.p.skills){
    const st=s.on?'LEARNED':'Unlocks Lv.'+s.ul;
    h+='<div class="skcard '+(s.on?'':'locked')+'"><div class="skh"><span class="ski">'+(s.buff?'🛡️':'⚡')+'</span><span class="skt">'+s.n+'</span><span class="sks">'+st+'</span></div><div class="skd"><span class="dp">'+s.c+' MP</span><span class="dp">'+(s.dmg||'Buff')+'</span></div><div class="skdsc">'+s.d+'</div></div>';
  }
  h+='</div><div class="stb"><h3>Character Stats</h3>';
  for(let [k,v] of Object.entries(G.p.stats))h+='<div class="str"><span class="stn">'+k.toUpperCase()+'</span><span class="stv">'+v+'</span></div>';
  h+='</div></div>'; return h;
}

function getEquipScore(item) {
  if (!item || !item.slot) return 0;
  let score = 0;
  if (item.atk) score += item.atk * 3;
  if (item.def) score += item.def * 3;
  if (item.int) score += item.int * 2;
  if (item.str) score += item.str * 2;
  if (item.dex) score += item.dex * 2;
  if (item.con) score += item.con * 2;
  if (item.wis) score += item.wis * 2;
  if (item.cha) score += item.cha * 1;
  if (item.fireDmg) score += item.fireDmg * 2;
  if (item.iceDmg) score += item.iceDmg * 2;
  if (item.lightDmg) score += item.lightDmg * 2;
  if (item.voidDmg) score += item.voidDmg * 2;
  if (item.arcaneDmg) score += item.arcaneDmg * 2;
  if (item.lifeSteal) score += item.lifeSteal * 10;
  if (item.critChance) score += item.critChance * 20;
  if (item.mpRegen) score += item.mpRegen * 2;
  if (item.hpRegen) score += item.hpRegen * 2;
  return score;
}

function getEquipComparison(item) {
  if (!item || !item.slot) return null;
  const slot = item.slot === 'ring' ? (G.p.eq.ring1 ? 'ring2' : 'ring1') : item.slot;
  const equipped = G.p.eq[slot];
  if (!equipped) return { better: true, arrow: '▲', color: '#22c55e', text: 'New slot' };
  const itemScore = getEquipScore(item);
  const eqScore = getEquipScore(equipped);
  if (itemScore > eqScore) return { better: true, arrow: '▲', color: '#22c55e', text: 'Upgrade' };
  if (itemScore < eqScore) return { better: false, arrow: '▼', color: '#ef4444', text: 'Downgrade' };
  return { better: false, arrow: '●', color: '#9ca3af', text: 'Sidegrade' };
}

function rInv(){
  let h='<div class="inventory-view"><h2 class="st">Inventory</h2>';

  // Equipment Stats Summary
  const eqStats = getEquippedStats();
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:12px;margin-bottom:16px;">';
  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">⚔️ Equipment Bonuses</div>';
  h += '<div style="display:flex;flex-wrap:wrap;gap:6px;font-size:10px;">';
  const statLabels = {atk:'ATK',def:'DEF',str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA',
                      fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',
                      lifeSteal:'🩸Leech',critChance:'💥Crit',mpRegen:'💧MP+',hpRegen:'💚HP+',goldFind:'💰Gold'};
  for(let k in statLabels){
    if(eqStats[k] > 0){
      const val = k === 'critChance' || k.includes('Res') ? (eqStats[k]*100)+'%' : (k.includes('Regen') ? '+'+eqStats[k]+'/turn' : '+'+eqStats[k]);
      h += '<span style="background:var(--bg-hover);padding:3px 8px;border-radius:8px;">'+statLabels[k]+' '+val+'</span>';
    }
  }
  h += '</div></div>';

  // Equipped Gear
  h+='<div class="eqs"><h3>Equipped Gear</h3><div class="eqg">';
  const slotOrder = ['weapon','armor','head','hands','feet','ring1','ring2','amulet'];
  const slotIcons = {weapon:'⚔️',armor:'🛡️',head:'🎓',hands:'🧤',feet:'👢',ring1:'💍',ring2:'💍',amulet:'📿'};
  for(let sl of slotOrder){
    const it=G.p.eq[sl];
    const slotName = EQUIPMENT_SLOTS[sl].name;
    h+='<div class="esl" style="cursor:pointer;" onclick="unequipItem(\'"+sl+"\')">';
    h+='<div class="esn">'+slotIcons[sl]+' '+slotName+'</div>';
    if(it){
      h+='<div class="eit" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      let stats = [];
      if(it.atk) stats.push('ATK+'+it.atk);
      if(it.def) stats.push('DEF+'+it.def);
      if(it.int) stats.push('INT+'+it.int);
      if(it.str) stats.push('STR+'+it.str);
      if(it.dex) stats.push('DEX+'+it.dex);
      if(it.con) stats.push('CON+'+it.con);
      if(it.wis) stats.push('WIS+'+it.wis);
      if(it.cha) stats.push('CHA+'+it.cha);
      if(it.prefix) stats.push(it.prefixData.desc);
      if(it.suffix) stats.push(it.suffixData.desc);
      h+='<div class="est">'+stats.join(' · ')+'</div>';
    }else{
      h+='<div class="ese">Empty</div>';
    }
    h+='</div>';
  }
  h+='</div></div>';

  // Categorize inventory items
  const equipItems = [];
  const consumableItems = [];
  const matItems = [];
  const otherItems = [];
  
  for(let i=0; i<G.p.inv.length; i++){
    const it = G.p.inv[i];
    const isEquip = it.slot && it.slot !== 'mat' && it.slot !== 'pot' && it.slot !== 'revive' && it.t !== 'food' && it.t !== 'drink';
    if(isEquip) equipItems.push({item: it, index: i});
    else if(it.t==='pot' || it.t==='food' || it.t==='drink' || it.t==='revive') consumableItems.push({item: it, index: i});
    else if(it.t==='mat') matItems.push({item: it, index: i});
    else otherItems.push({item: it, index: i});
  }

  // Equipment section
  if(equipItems.length > 0){
    h+='<div class="its"><h3>🎒 Equipment ('+equipItems.length+')</h3><div class="ig">';
    for(let ei of equipItems){
      const it = ei.item;
      const i = ei.index;
      const cmp = getEquipComparison(it);
      h+='<div class="ic" style="position:relative;">';
      if(cmp){
        h+='<div style="position:absolute;top:6px;right:6px;font-size:14px;color:'+cmp.color+';font-weight:700;" title="'+cmp.text+'">'+cmp.arrow+'</div>';
      }
      h+='<div class="ii">'+(EQUIPMENT_SLOTS[it.slot]?.icon || '⚔️')+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.ilvl) h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      h += getItemSocketDisplay(it);
      let statLine = [];
      if(it.atk) statLine.push('ATK+'+it.atk);
      if(it.def) statLine.push('DEF+'+it.def);
      if(it.int) statLine.push('INT+'+it.int);
      if(it.str) statLine.push('STR+'+it.str);
      if(it.dex) statLine.push('DEX+'+it.dex);
      if(it.con) statLine.push('CON+'+it.con);
      if(it.wis) statLine.push('WIS+'+it.wis);
      if(it.cha) statLine.push('CHA+'+it.cha);
      if(it.prefix) statLine.push(it.prefixData.desc);
      if(it.suffix) statLine.push(it.suffixData.desc);
      if(statLine.length > 0) h+='<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">'+statLine.join(' · ')+'</div>';
      h+='<div class="iq">'+(it.value ? it.value+'G' : '')+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-e" data-i="'+i+'">Equip</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Consumables section
  if(consumableItems.length > 0){
    h+='<div class="its"><h3>🧪 Consumables ('+consumableItems.length+')</h3><div class="ig">';
    for(let ci of consumableItems){
      const it = ci.item;
      const i = ci.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.eff==='heal') h+='<div style="font-size:10px;color:var(--success);">+'+it.v+' HP</div>';
      if(it.eff==='mana') h+='<div style="font-size:10px;color:var(--mp);">+'+it.v+' MP</div>';
      if(it.eff==='revive') h+='<div style="font-size:10px;color:var(--accent-light);">Revive '+it.v+'% HP</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-u" data-i="'+i+'">Use</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Materials section
  if(matItems.length > 0){
    h+='<div class="its"><h3>💎 Materials ('+matItems.length+')</h3><div class="ig">';
    for(let mi of matItems){
      const it = mi.item;
      const i = mi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  // Other items
  if(otherItems.length > 0){
    h+='<div class="its"><h3>📦 Other ('+otherItems.length+')</h3><div class="ig">';
    for(let oi of otherItems){
      const it = oi.item;
      const i = oi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  if(G.p.inv.length==0) h+='<div class="ei">Your pack is empty.</div>';
  h+='</div>';
  return h;
}

function rCraft(){
  let h='<div class="craft-view"><h2 class="st">Crafting</h2><div class="rlist">';
  for(let i=0;i<G.recipes.length;i++){
    const r=G.recipes[i]; let ok=true,ms='';
    for(let [mn,mq] of Object.entries(r.m)){
      const iv=G.p.inv.find(x=>x.n==mn);
      const hv=iv?iv.q:0,en=hv>=mq;
      if(!en)ok=false;
      ms+='<span class="mp '+(en?'ok':'miss')+'">'+mn+': '+hv+'/'+mq+'</span>';
    }
    h+='<div class="rc"><div class="rr"><span class="ri">'+ie(r.res)+'</span><span class="rn" style="color:'+rc(r.res.r)+'">'+r.n+'</span><span class="rd">'+r.d+'</span></div><div class="rms">'+ms+'</div><button class="cb '+(ok?'':'dis')+'" data-i="'+i+'">Forge</button></div>';
  }
  h+='</div></div>'; return h;
}

function toggleQuestCollapse(key){
  G.questCollapsed[key] = !G.questCollapsed[key];
  render();
}

function rQuest(){
  let h='<div class="quest-view">';
    // === DAILY LOGIN REWARDS ===
  const today = G.gameDay || 0;
  const streak = G.loginStreak || 0;
  const claimedToday = G.loginClaimed || false;

  const loginRewards = [
    { day: 1, icon: '💰', name: 'Gold Pouch', g: 50, xp: 25 },
    { day: 2, icon: '💧', name: 'Mana Crystal', mp: 30, xp: 35 },
    { day: 3, icon: '🧪', name: 'Health Potion', hp: 50, xp: 45 },
    { day: 4, icon: '💎', name: 'Gem Shard', g: 100, xp: 60 },
    { day: 5, icon: '⚔️', name: 'Mystic Scroll', g: 150, xp: 80 },
    { day: 6, icon: '🔮', name: 'Arcane Orb', mp: 50, xp: 100 },
    { day: 7, icon: '👑', name: 'Legendary Cache', g: 300, xp: 200, item: { n: 'Phoenix Feather', t: 'revive', eff: 'revive', v: 50, q: 1, r: 'rare' } }
  ];

  const todayReward = loginRewards[Math.min(streak, 6)];

  h += '<div style="background: linear-gradient(135deg, var(--accent), #6d28d9); border-radius: 16px; padding: 16px; margin-bottom: 16px; color: white;">';
  h += '<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">';
  h += '<div style="font-size: 28px;">🎁</div>';
  h += '<div><div style="font-weight: 700; font-size: 16px;">Daily Login Reward</div>';
  h += '<div style="font-size: 11px; opacity: 0.9;">Day ' + (streak + 1) + ' · Streak: ' + streak + '</div></div>';
  h += '</div>';

  h += '<div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px; margin-bottom: 12px;">';
  h += '<div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">Today\'s Reward:</div>';
  h += '<div style="display: flex; align-items: center; gap: 8px;">';
  h += '<div style="font-size: 32px;">' + todayReward.icon + '</div>';
  h += '<div style="flex: 1;">';
  h += '<div style="font-weight: 600; font-size: 14px;">' + todayReward.name + '</div>';
  h += '<div style="font-size: 11px; opacity: 0.85;">';
  const rewardParts = [];
  if (todayReward.g) rewardParts.push('+' + todayReward.g + 'G');
  if (todayReward.xp) rewardParts.push('+' + todayReward.xp + 'XP');
  if (todayReward.hp) rewardParts.push('+' + todayReward.hp + 'HP');
  if (todayReward.mp) rewardParts.push('+' + todayReward.mp + 'MP');
  if (todayReward.item) rewardParts.push(todayReward.item.n);
  h += rewardParts.join(' · ');
  h += '</div></div></div></div>';

  // Streak progress dots
  h += '<div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 12px;">';
  for (let i = 0; i < 7; i++) {
    const isActive = i < streak;
    const isToday = i === streak;
    h += '<div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; ' + 
      (isActive ? 'background: #fbbf24; color: #000;' : 
       isToday ? 'background: white; color: var(--accent); border: 2px solid #fbbf24;' : 
       'background: rgba(255,255,255,0.2); color: white;') + '">' + (i + 1) + '</div>';
  }
  h += '</div>';

  if (claimedToday) {
    h += '<button disabled style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: rgba(255,255,255,0.2); color: white; font-size: 13px; font-weight: 600; opacity: 0.6; cursor: not-allowed;">✅ Claimed Today — Come Back Tomorrow!</button>';
  } else {
    h += '<button id="btn-claim-login" style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: #fbbf24; color: #000; font-size: 13px; font-weight: 700; cursor: pointer;">🎁 Claim Reward</button>';
  }
  h += '</div>';
  // === END DAILY LOGIN ===

  // Storyline section
  h+='<h2 class="st">📖 Storyline</h2><div class="qlist">';
  for(let s of G.storyline){
    if(!s.unlocked) continue;
    const pc=Math.min(100,(G.p.lvl/s.need)*100);
    h+='<div class="qc '+(s.done?'done':'')+'" style="border-color:var(--accent-light);"><div class="qh"><span class="qn">'+(s.done?'✅ ':'')+'Ch.'+s.chapter+': '+s.n+'</span><span class="qr">'+s.rw.xp+' XP | '+s.rw.g+' G</span></div>';
    h+='<div class="qd">'+s.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">Lv.'+G.p.lvl+'/'+s.need+'</span></div></div>';
  }
  h+='</div>';
  // Active quests section
  h+='<h2 class="st" style="margin-top:20px;">📜 Active Quests</h2><div class="qlist">';
  for(let q of G.quests){
    if(q.hidden && !q.revealed) continue;
    const pc=Math.min(100,(q.c/q.need)*100);
    const timerStatus=getTimerStatus(q);
    let cardClass=q.done?'done':(q.expired?'expired':(timerStatus?(timerStatus.cls==='timer-urgent'?'timed-urgent':'timed'):''));
    h+='<div class="qc '+cardClass+'"><div class="qh"><span class="qn">'+(q.done?'✅ ':(q.expired?'❌ ':''))+q.n+'</span><span class="qr">'+q.rw.xp+' XP | '+q.rw.g+' G</span></div>';
    if(q.chain){
      h+='<div style="font-size:10px;color:var(--accent-light);margin-bottom:4px;">🔗 Chain: '+q.chain+'</div>';
    }
    if(q.reqQuest && !q.revealed){
      const req=G.quests.find(rq=>rq.id===q.reqQuest);
      h+='<div style="font-size:10px;color:var(--text-dim);font-style:italic;margin-bottom:4px;">🔒 Requires: '+(req?req.n:'Unknown')+'</div>';
    }
    h+='<div class="qd">'+q.d+'</div>';
    if(timerStatus){
      h+='<div class="timer-bar"><div class="timer-fill '+timerStatus.cls+'" style="width:'+timerStatus.pct+'%"></div></div>';
      h+='<div class="timer-label">⏰ '+timerStatus.label+'</div>';
    }
    h+='<div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+Math.min(q.c,q.need)+'/'+q.need+'</span></div></div>';
  }
  h+='</div>';
    // Daily Quests section
  h += '<h2 class="st" style="margin-top:20px;">📋 Daily Quests</h2><div class="qlist">';
  generateDailyQuests();
  if (G.dailyQuests.length === 0) {
    h += '<div class="qc"><div class="qd">No daily quests available. Check back tomorrow!</div></div>';
  } else {
    for (let q of G.dailyQuests) {
      const pc = Math.min(100, (q.c / q.need) * 100);
      h += '<div class="qc ' + (q.done ? 'done' : '') + '"><div class="qh"><span class="qn">' + q.n + '</span><span class="qr">' + q.rw.xp + ' XP | ' + q.rw.g + ' G</span></div>';
      h += '<div class="qd">' + q.d + '</div><div class="qp"><div class="pbar"><div class="pfill" style="width:' + pc + '%"></div></div><span class="ptxt">' + q.c + '/' + q.need + '</span></div></div>';
    }
  }
  h += '</div>';
    // Bounties section
  const activeBounties = G.bounties.filter(b => !b.done && G.p.lvl >= (b.minLv || 1));
  const doneBounties = G.bounties.filter(b => b.done);
  if (activeBounties.length > 0 || doneBounties.length > 0) {
    h+='<h2 class="st" style="margin-top:20px;">💰 Bounties</h2>';
    if (activeBounties.length > 0) {
      h+='<div class="qlist">';
      for(let b of activeBounties){
        const pc=Math.min(100,(b.c/b.need)*100);
        h+='<div class="qc"><div class="qh"><span class="qn">'+b.n+'</span><span class="qr">'+b.rw.xp+' XP | '+b.rw.g+' G</span></div>';
        h+='<div class="qd">'+b.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+b.c+'/'+b.need+'</span></div></div>';
      }
      h+='</div>';
    }
    if (doneBounties.length > 0) {
      const collapsed = G.questCollapsed['__bounties_done__'];
      h+='<div style="margin-top:12px;">';
      h+='<div onclick="toggleQuestCollapse(\'__bounties_done__\')" style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:12px 16px;background:var(--bg-hover);border-radius:14px;border:1px solid var(--border);user-select:none;">';
      h+='<span style="font-size:12px;transition:transform 0.2s;display:inline-block;' + (collapsed ? '' : 'transform:rotate(90deg);') + '">▶</span>';
      h+='<span style="font-size:14px;font-weight:600;color:var(--success);">✅ Claimed</span>';
      h+='<span style="font-size:12px;color:var(--text-dim);margin-left:auto;">' + doneBounties.length + '</span>';
      h+='</div>';
      if (!collapsed) {
        h+='<div class="qlist" style="margin-top:8px;">';
        for(let b of doneBounties){
          h+='<div class="qc done" style="opacity:0.55;"><div class="qh"><span class="qn" style="text-decoration:line-through;">'+b.n+'</span><span class="qr" style="color:var(--success);">✓</span></div>';
          h+='<div class="qd">'+b.d+'</div></div>';
        }
        h+='</div>';
      }
      h+='</div>';
    }
  }
  h+='</div>';
  h+='<div class="sum"><div class="si2"><span class="sv">'+G.p.kills+'</span><span class="sl">Monsters</span></div><div class="si2"><span class="sv">'+G.p.quests+'</span><span class="sl">Quests</span></div><div class="si2"><span class="sv">'+G.p.fstreak+'</span><span class="sl">Focus</span></div></div></div>';
  return h;
}

function rFocus(){
  // If focus is not active, show the session picker
  if (!G.fs || G.state !== 'focus') {
    let h = '<div class="fv">';
    h += '<div style="font-size:42px;margin-bottom:8px;">🧘</div>';
    h += '<div class="fl" style="font-size:18px;font-weight:700;margin-bottom:4px;">Focus Mode</div>';
    h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:20px;">Pick a session length</div>';
    h += '<div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:0 auto;">';
    const sessions = [
      {m:5, xp:20, g:10, label:'Quick Sprint'},
      {m:10, xp:40, g:20, label:'Short Burst'},
      {m:15, xp:60, g:30, label:'Deep Work'},
      {m:20, xp:80, g:40, label:'Extended Flow'},
      {m:25, xp:100, g:50, label:'Full Pomodoro'}
    ];
    for (let s of sessions) {
      h += '<button class="focus-session-btn" data-min="' + s.m + '" style="padding:14px 18px;border-radius:14px;border:2px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
      h += '<span>' + s.m + ' min — ' + s.label + '</span>';
      h += '<span style="font-size:11px;color:var(--success);">+' + s.xp + 'XP +' + s.g + 'G</span>';
      h += '</button>';
    }
    h += '</div>';
    h += '<div class="ftips" style="margin-top:20px;"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward scales with session length!</li></ul></div>';
    h += '</div>';
    return h;
  }
  // Active focus session
  const el=Date.now()-(G.fs||Date.now()),rm=Math.max(0,G.fd-el);
  const m=Math.floor(rm/60000),s=Math.floor((rm%60000)/1000);
  return '<div class="fv"><div class="fc"><div class="ft" id="ft">'+m+':'+s.toString().padStart(2,'0')+'</div><div class="fl">Focus Mode — ' + (G.focusDuration || 25) + ' min</div></div><div class="ftips"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward: +' + ((G.focusDuration||25)*4) + ' XP when done!</li></ul></div><button class="cfb">Cancel</button></div>';
}

function rTemple() {
  const dead = getDeadParty();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">⛪ Temple of Resurrection</h2>';
  h2 += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ancient magic restores fallen companions. Cost: 50G each.</div>';
  if(dead.length === 0){
    h2 += '<div style="text-align:center;padding:20px;color:var(--success);">✨ All companions are alive!</div>';
  }else{
    h2 += '<div style="margin-bottom:12px;">';
    for(let p of G.party){
      const isDead = p.hp <= 0;
      const canAfford = G.p.gold >= 50;
      h2 += '<div class="temple-revive ' + (isDead ? 'dead' : 'alive') + '">';
      h2 += '<div class="tr-ava" style="background:' + p.col + '20;border-color:' + p.col + '">' + (isDead ? '💀' : re(p.r)) + '</div>';
      h2 += '<div class="tr-info">';
      h2 += '<div class="tr-name">' + p.n + '</div>';
      h2 += '<div class="tr-status ' + (isDead ? '' : 'alive') + '">' + (isDead ? '💀 FALLEN' : '✅ Alive ' + p.hp + '/' + p.mhp) + '</div>';
      h2 += '</div>';
      if(isDead) h2 += '<button class="tr-btn ' + (canAfford ? '' : 'dis') + '" data-m="' + p.n + '">' + (canAfford ? 'Revive (50G)' : 'Need 50G') + '</button>';
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  return h2;
}

function rRest() {
  const dead = getDeadParty();
  if(dead.length > 0 && !G.rest.active) return rTemple();

  if (G.rest.active && G.rest.selectedSite) {
    const site = G.rest.selectedSite;
    const currentTick = G.rest.tick;
    const maxTicks = G.rest.maxTicks;
    const pct = (currentTick / maxTicks) * 100;
    const healerName = getHealerName();
    let h2 = '<div class="rest-view">';
    h2 += '<h2 class="st">🔥 Resting at ' + site.name + '</h2>';
    if (G.ambushWarning) {
      h2 += '<div class="ambush-warning">';
      h2 += '<div class="aw-text">⚠️ ' + G.ambushWarning.text + '</div>';
      h2 += '</div>';
    }
    if (G.currentDialogue && !G.ambushWarning) {
      h2 += '<div class="dialogue-box">';
      h2 += '<div class="d-speaker">' + G.currentDialogue.speaker + '</div>';
      h2 += '<div class="d-text">' + G.currentDialogue.text + '</div>';
      h2 += '</div>';
    }
    h2 += '<div class="tick-track">';
    for (let i = 1; i <= maxTicks; i++) {
      let tickClass = '';
      let tickIcon = '○';
      if (i < currentTick) {
        tickClass = 'done';
        tickIcon = '✓';
      } else if (i === currentTick) {
        tickClass = 'current';
        tickIcon = '🔥';
      }
      h2 += '<div class="tick ' + tickClass + '">' + tickIcon + '</div>';
    }
    h2 += '</div>';
    h2 += '<div class="tick-label">Tick ' + currentTick + '/' + maxTicks + '</div>';
    h2 += '<div class="rest-progress" style="margin-top:16px;">';
    h2 += '<div class="rest-bar"><div class="rest-fill" style="width:' + pct + '%"></div></div>';
    h2 += '<div class="rest-healer ok">💚 ' + healerName + ' is tending to the party</div>';
    h2 += '</div>';
    h2 += '<button class="rest-cancel" id="cancel-rest">Cancel Rest (Partial Recovery)</button>';
    h2 += '</div>';
    return h2;
  }

  const healerOk = hasHealer();
  const healerName = getHealerName();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">💤 Rest</h2>';
  if (healerOk) {
    h2 += '<div class="rest-healer ok" style="background:#22c55e15;border:1px solid var(--success);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--success);">💚 Healer Available: ' + healerName + '</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">5 ticks, 1.5s each. Dialogue every tick. Ambush chance: 15% camp / 5% tavern.</div>';
    h2 += '</div>';
  } else {
    h2 += '<div class="rest-healer fail" style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--danger);">❌ No Healer in Party</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">You need a healer (like Eliz) in your active party to rest safely.</div>';
    h2 += '</div>';
  }
  const soelActive = G.party.some(p => p.n === 'Soel' && p.on);
  h2 += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;text-align:left;">';
  h2 += '<div style="font-size:13px;font-weight:600;color:var(--rest);margin-bottom:4px;">🐱 Soel\'s Spirit Blessing</div>';
  if (!soelActive) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Soel must be in your active party to share his blessing.</div>';
  } else if (G.soelBlessing) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Blessing rests on <b style="color:var(--text);">' + G.soelBlessing.target + '</b> (+' + G.soelBlessing.def + ' DEF). One blessing per rest \u2014 it fades when you next make camp.</div>';
  } else {
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">One member per rest receives +10 DEF until your next rest.</div>';
    h2 += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    for (let m of G.party) {
      if (!m.on || m.n === 'Soel') continue;
      h2 += '<button class="soel-bless-btn" data-n="' + m.n + '" style="padding:6px 12px;border-radius:10px;border:1px solid var(--rest);background:#10b98115;color:var(--text);font-size:11px;font-weight:600;cursor:pointer;">' + m.n + '</button>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div class="rest-sites">';
  const zones = {};
  for (let site of G.rest.sites) {
    if (!zones[site.zone]) zones[site.zone] = [];
    zones[site.zone].push(site);
  }
  for (let zoneName in zones) {
    const sites = zones[zoneName];
    const anyUnlocked = sites.some(s => s.unlocked);
    if (!anyUnlocked) continue;
    h2 += '<div style="margin-bottom:12px;">';
    h2 += '<div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">' + zoneName + '</div>';
    for (let site of sites) {
    let manaSpringRemaining = 8;
    if (G.manaSpringUses.day === G.gameDay) {
        manaSpringRemaining = 8 - G.manaSpringUses.count;
      }
      const isDepletedManaSpring = site.type === 'mana_spring' && manaSpringRemaining <= 0;

      const locked = !site.unlocked || isDepletedManaSpring;

      const canAfford = !site.cost || G.p.gold >= site.cost;
      const canRest = (site.type === 'mana_spring' || site.type === 'temple' || healerOk) && !locked && canAfford;
      h2 += '<div class="rs-card ' + (locked ? 'locked' : '') + '" data-id="' + site.id + '">';
      h2 += '<div class="rs-head">';
      h2 += '<span class="rs-name">' + site.icon + ' ' + site.name + '</span>';
      h2 += '<span class="rs-type ' + site.type + '">' + site.type.toUpperCase() + '</span>';
      h2 += '</div>';
      h2 += '<div class="rs-desc">' + site.desc + '</div>';
            if (locked) {
            if (isDepletedManaSpring) {
          h2 += '<div class="rs-req fail">💧 Daily limit reached (8/8 uses)</div>';

        } else {
          h2 += '<div class="rs-req fail">🔒 Requires Level ' + site.zoneLv + ' to discover</div>';
        }
      } else if (site.cost) {

                const msUsesLeft = site.type === 'mana_spring' ? ' (' + manaSpringRemaining + '/8 today)' : '';
        h2 += '<div class="rs-req ' + (canAfford ? 'ok' : 'fail') + '">' + (canAfford ? '✅' : '❌') + ' Cost: ' + site.cost + 'G' + msUsesLeft + ' · Ambush: 5% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';


      } else {
        h2 += '<div class="rs-req ' + (healerOk ? 'ok' : 'fail') + '">' + (healerOk ? '✅' : '❌') + ' Free · Ambush: 15% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';
      }
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:8px;">Rest takes ~7.5 seconds. Party banter every tick. Taverns cost gold but are safer.</div>';
  h2 += '</div>';
  return h2;
}

document.addEventListener('DOMContentLoaded', function() {
  const hasSave = loadGame();
  if (!hasSave) {
    lg('Welcome to Legends of Daybreak, San.');
    lg('Tap Adventure to start your journey!');
    showStory();
      checkDailyLogin();

  }
  // Check for idle gains on load
    setTimeout(() => {
      if (!checkIdleGains()) {
        render();
      }
    }, 300);
});


// === MID-BATTLE POTION SYSTEM ===
function togglePotionMenu() {
  G.potionMenu = !G.potionMenu;
  render();
}

function usePotionInCombat(invIndex) {
  const it = G.p.inv[invIndex];
  if (!it) return;

  // Handle revive items (Phoenix Feather, Rod of Resurrection, etc.)
  if (it.t === 'revive') {
    const deadMembers = getDeadParty();
    if (deadMembers.length === 0) {
      lg('❌ No fallen allies to revive!');
      G.potionMenu = false;
      render();
      return;
    }

    // Prioritize: San (player) first, then party members
    let target = deadMembers.find(p => p.n === 'San');
    if (!target) target = deadMembers[0];

    // Use item's v value for revive percentage (50% for Phoenix Feather, 75% for Rod of Resurrection)
    const revivePct = it.v || 50;
    const healAmount = Math.floor(target.mhp * (revivePct / 100));
    target.hp = Math.max(1, healAmount);
    target.on = true;

    lg('🔥 ' + it.n + ' radiates with sacred light!');
    lg('✨ ' + (target.n === 'San' ? 'You' : target.n) + ' are revived with ' + target.hp + ' HP (' + revivePct + '%)!');

    it.q--;
    if (it.q <= 0) {
      G.p.inv.splice(invIndex, 1);
    }

    G.potionMenu = false;
    render();
    return;
  }

  // Regular potions only
  if (it.t !== 'pot' && it.t !== 'food' && it.t !== 'drink') return;

  if (it.eff === 'heal') {
    const oldHp = G.p.hp;
    G.p.hp = Math.min(G.p.mhp, G.p.hp + it.v);
    const healed = G.p.hp - oldHp;
    lg('🧪 Used ' + it.n + '! +' + healed + ' HP (' + G.p.hp + '/' + G.p.mhp + ')');
  } else if (it.eff === 'mana') {
    const oldMp = G.p.mp;
    G.p.mp = Math.min(G.p.mmp, G.p.mp + it.v);
    const restored = G.p.mp - oldMp;
    lg('💧 Used ' + it.n + '! +' + restored + ' MP (' + G.p.mp + '/' + G.p.mmp + ')');
  }

  it.q--;
  if (it.q <= 0) {
    G.p.inv.splice(invIndex, 1);
  }

  G.potionMenu = false;
  render();
}

function getCombatPotions() {
  return G.p.inv.filter(it => 
    (it.t === 'pot' || it.t === 'food' || it.t === 'drink') &&
    (it.eff === 'heal' || it.eff === 'mana') ||
    it.t === 'revive'
  );
}


function rSkills(){
  let h='<div class="skills-view"><h2 class="st">Mage Skills</h2><div class="sklist">';
  for(let s of G.p.skills){
    const st=s.on?'LEARNED':'Unlocks Lv.'+s.ul;
    h+='<div class="skcard '+(s.on?'':'locked')+'"><div class="skh"><span class="ski">'+(s.buff?'🛡️':'⚡')+'</span><span class="skt">'+s.n+'</span><span class="sks">'+st+'</span></div><div class="skd"><span class="dp">'+s.c+' MP</span><span class="dp">'+(s.dmg||'Buff')+'</span></div><div class="skdsc">'+s.d+'</div></div>';
  }
  h+='</div><div class="stb"><h3>Character Stats</h3>';
  for(let [k,v] of Object.entries(G.p.stats))h+='<div class="str"><span class="stn">'+k.toUpperCase()+'</span><span class="stv">'+v+'</span></div>';
  h+='</div></div>'; return h;
}

function rInv(){
  let h='<div class="inventory-view"><h2 class="st">Inventory</h2>';

  // Equipment Stats Summary
  const eqStats = getEquippedStats();
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:12px;margin-bottom:16px;">';
  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">⚔️ Equipment Bonuses</div>';
  h += '<div style="display:flex;flex-wrap:wrap;gap:6px;font-size:10px;">';
  const statLabels = {atk:'ATK',def:'DEF',str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA',
                      fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',
                      lifeSteal:'🩸Leech',critChance:'💥Crit',mpRegen:'💧MP+',hpRegen:'💚HP+',goldFind:'💰Gold'};
  for(let k in statLabels){
    if(eqStats[k] > 0){
      const val = k === 'critChance' || k.includes('Res') ? (eqStats[k]*100)+'%' : (k.includes('Regen') ? '+'+eqStats[k]+'/turn' : '+'+eqStats[k]);
      h += '<span style="background:var(--bg-hover);padding:3px 8px;border-radius:8px;">'+statLabels[k]+' '+val+'</span>';
    }
  }
  h += '</div></div>';

  // Equipped Gear
  h+='<div class="eqs"><h3>Equipped Gear</h3><div class="eqg">';
  const slotOrder = ['weapon','armor','head','hands','feet','ring1','ring2','amulet'];
  const slotIcons = {weapon:'⚔️',armor:'🛡️',head:'🎓',hands:'🧤',feet:'👢',ring1:'💍',ring2:'💍',amulet:'📿'};
  for(let sl of slotOrder){
    const it=G.p.eq[sl];
    const slotName = EQUIPMENT_SLOTS[sl].name;
    h+='<div class="esl" style="cursor:pointer;" onclick="unequipItem(\'"+sl+"\')">';
    h+='<div class="esn">'+slotIcons[sl]+' '+slotName+'</div>';
    if(it){
      h+='<div class="eit" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      let stats = [];
      if(it.atk) stats.push('ATK+'+it.atk);
      if(it.def) stats.push('DEF+'+it.def);
      if(it.int) stats.push('INT+'+it.int);
      if(it.str) stats.push('STR+'+it.str);
      if(it.dex) stats.push('DEX+'+it.dex);
      if(it.con) stats.push('CON+'+it.con);
      if(it.wis) stats.push('WIS+'+it.wis);
      if(it.cha) stats.push('CHA+'+it.cha);
      if(it.prefix) stats.push(it.prefixData.desc);
      if(it.suffix) stats.push(it.suffixData.desc);
      h+='<div class="est">'+stats.join(' · ')+'</div>';
    }else{
      h+='<div class="ese">Empty</div>';
    }
    h+='</div>';
  }
  h+='</div></div>';

  // Categorize inventory items
  const equipItems = [];
  const consumableItems = [];
  const matItems = [];
  const otherItems = [];
  
  for(let i=0; i<G.p.inv.length; i++){
    const it = G.p.inv[i];
    const isEquip = it.slot && it.slot !== 'mat' && it.slot !== 'pot' && it.slot !== 'revive' && it.t !== 'food' && it.t !== 'drink';
    if(isEquip) equipItems.push({item: it, index: i});
    else if(it.t==='pot' || it.t==='food' || it.t==='drink' || it.t==='revive') consumableItems.push({item: it, index: i});
    else if(it.t==='mat') matItems.push({item: it, index: i});
    else otherItems.push({item: it, index: i});
  }

  // Equipment section
  if(equipItems.length > 0){
    h+='<div class="its"><h3>🎒 Equipment ('+equipItems.length+')</h3><div class="ig">';
    for(let ei of equipItems){
      const it = ei.item;
      const i = ei.index;
      const cmp = getEquipComparison(it);
      h+='<div class="ic" style="position:relative;">';
      if(cmp){
        h+='<div style="position:absolute;top:6px;right:6px;font-size:14px;color:'+cmp.color+';font-weight:700;" title="'+cmp.text+'">'+cmp.arrow+'</div>';
      }
      h+='<div class="ii">'+(EQUIPMENT_SLOTS[it.slot]?.icon || '⚔️')+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.ilvl) h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      h += getItemSocketDisplay(it);
      let statLine = [];
      if(it.atk) statLine.push('ATK+'+it.atk);
      if(it.def) statLine.push('DEF+'+it.def);
      if(it.int) statLine.push('INT+'+it.int);
      if(it.str) statLine.push('STR+'+it.str);
      if(it.dex) statLine.push('DEX+'+it.dex);
      if(it.con) statLine.push('CON+'+it.con);
      if(it.wis) statLine.push('WIS+'+it.wis);
      if(it.cha) statLine.push('CHA+'+it.cha);
      if(it.prefix) statLine.push(it.prefixData.desc);
      if(it.suffix) statLine.push(it.suffixData.desc);
      if(statLine.length > 0) h+='<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">'+statLine.join(' · ')+'</div>';
      h+='<div class="iq">'+(it.value ? it.value+'G' : '')+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-e" data-i="'+i+'">Equip</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Consumables section
  if(consumableItems.length > 0){
    h+='<div class="its"><h3>🧪 Consumables ('+consumableItems.length+')</h3><div class="ig">';
    for(let ci of consumableItems){
      const it = ci.item;
      const i = ci.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.eff==='heal') h+='<div style="font-size:10px;color:var(--success);">+'+it.v+' HP</div>';
      if(it.eff==='mana') h+='<div style="font-size:10px;color:var(--mp);">+'+it.v+' MP</div>';
      if(it.eff==='revive') h+='<div style="font-size:10px;color:var(--accent-light);">Revive '+it.v+'% HP</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-u" data-i="'+i+'">Use</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Materials section
  if(matItems.length > 0){
    h+='<div class="its"><h3>💎 Materials ('+matItems.length+')</h3><div class="ig">';
    for(let mi of matItems){
      const it = mi.item;
      const i = mi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  // Other items
  if(otherItems.length > 0){
    h+='<div class="its"><h3>📦 Other ('+otherItems.length+')</h3><div class="ig">';
    for(let oi of otherItems){
      const it = oi.item;
      const i = oi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  if(G.p.inv.length==0) h+='<div class="ei">Your pack is empty.</div>';
  h+='</div>';
  return h;
}

function rCraft(){
  let h='<div class="craft-view"><h2 class="st">Crafting</h2><div class="rlist">';
  for(let i=0;i<G.recipes.length;i++){
    const r=G.recipes[i]; let ok=true,ms='';
    for(let [mn,mq] of Object.entries(r.m)){
      const iv=G.p.inv.find(x=>x.n==mn);
      const hv=iv?iv.q:0,en=hv>=mq;
      if(!en)ok=false;
      ms+='<span class="mp '+(en?'ok':'miss')+'">'+mn+': '+hv+'/'+mq+'</span>';
    }
    h+='<div class="rc"><div class="rr"><span class="ri">'+ie(r.res)+'</span><span class="rn" style="color:'+rc(r.res.r)+'">'+r.n+'</span><span class="rd">'+r.d+'</span></div><div class="rms">'+ms+'</div><button class="cb '+(ok?'':'dis')+'" data-i="'+i+'">Forge</button></div>';
  }
  h+='</div></div>'; return h;
}

function toggleQuestCollapse(key){
  G.questCollapsed[key] = !G.questCollapsed[key];
  render();
}

function rQuest(){
  let h='<div class="quest-view">';
    // === DAILY LOGIN REWARDS ===
  const today = G.gameDay || 0;
  const streak = G.loginStreak || 0;
  const claimedToday = G.loginClaimed || false;

  const loginRewards = [
    { day: 1, icon: '💰', name: 'Gold Pouch', g: 50, xp: 25 },
    { day: 2, icon: '💧', name: 'Mana Crystal', mp: 30, xp: 35 },
    { day: 3, icon: '🧪', name: 'Health Potion', hp: 50, xp: 45 },
    { day: 4, icon: '💎', name: 'Gem Shard', g: 100, xp: 60 },
    { day: 5, icon: '⚔️', name: 'Mystic Scroll', g: 150, xp: 80 },
    { day: 6, icon: '🔮', name: 'Arcane Orb', mp: 50, xp: 100 },
    { day: 7, icon: '👑', name: 'Legendary Cache', g: 300, xp: 200, item: { n: 'Phoenix Feather', t: 'revive', eff: 'revive', v: 50, q: 1, r: 'rare' } }
  ];

  const todayReward = loginRewards[Math.min(streak, 6)];

  h += '<div style="background: linear-gradient(135deg, var(--accent), #6d28d9); border-radius: 16px; padding: 16px; margin-bottom: 16px; color: white;">';
  h += '<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">';
  h += '<div style="font-size: 28px;">🎁</div>';
  h += '<div><div style="font-weight: 700; font-size: 16px;">Daily Login Reward</div>';
  h += '<div style="font-size: 11px; opacity: 0.9;">Day ' + (streak + 1) + ' · Streak: ' + streak + '</div></div>';
  h += '</div>';

  h += '<div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px; margin-bottom: 12px;">';
  h += '<div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">Today\'s Reward:</div>';
  h += '<div style="display: flex; align-items: center; gap: 8px;">';
  h += '<div style="font-size: 32px;">' + todayReward.icon + '</div>';
  h += '<div style="flex: 1;">';
  h += '<div style="font-weight: 600; font-size: 14px;">' + todayReward.name + '</div>';
  h += '<div style="font-size: 11px; opacity: 0.85;">';
  const rewardParts = [];
  if (todayReward.g) rewardParts.push('+' + todayReward.g + 'G');
  if (todayReward.xp) rewardParts.push('+' + todayReward.xp + 'XP');
  if (todayReward.hp) rewardParts.push('+' + todayReward.hp + 'HP');
  if (todayReward.mp) rewardParts.push('+' + todayReward.mp + 'MP');
  if (todayReward.item) rewardParts.push(todayReward.item.n);
  h += rewardParts.join(' · ');
  h += '</div></div></div></div>';

  // Streak progress dots
  h += '<div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 12px;">';
  for (let i = 0; i < 7; i++) {
    const isActive = i < streak;
    const isToday = i === streak;
    h += '<div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; ' + 
      (isActive ? 'background: #fbbf24; color: #000;' : 
       isToday ? 'background: white; color: var(--accent); border: 2px solid #fbbf24;' : 
       'background: rgba(255,255,255,0.2); color: white;') + '">' + (i + 1) + '</div>';
  }
  h += '</div>';

  if (claimedToday) {
    h += '<button disabled style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: rgba(255,255,255,0.2); color: white; font-size: 13px; font-weight: 600; opacity: 0.6; cursor: not-allowed;">✅ Claimed Today — Come Back Tomorrow!</button>';
  } else {
    h += '<button id="btn-claim-login" style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: #fbbf24; color: #000; font-size: 13px; font-weight: 700; cursor: pointer;">🎁 Claim Reward</button>';
  }
  h += '</div>';
  // === END DAILY LOGIN ===

  // Storyline section
  h+='<h2 class="st">📖 Storyline</h2><div class="qlist">';
  for(let s of G.storyline){
    if(!s.unlocked) continue;
    const pc=Math.min(100,(G.p.lvl/s.need)*100);
    h+='<div class="qc '+(s.done?'done':'')+'" style="border-color:var(--accent-light);"><div class="qh"><span class="qn">'+(s.done?'✅ ':'')+'Ch.'+s.chapter+': '+s.n+'</span><span class="qr">'+s.rw.xp+' XP | '+s.rw.g+' G</span></div>';
    h+='<div class="qd">'+s.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">Lv.'+G.p.lvl+'/'+s.need+'</span></div></div>';
  }
  h+='</div>';
  // Active quests section
  h+='<h2 class="st" style="margin-top:20px;">📜 Active Quests</h2><div class="qlist">';
  for(let q of G.quests){
    if(q.hidden && !q.revealed) continue;
    const pc=Math.min(100,(q.c/q.need)*100);
    const timerStatus=getTimerStatus(q);
    let cardClass=q.done?'done':(q.expired?'expired':(timerStatus?(timerStatus.cls==='timer-urgent'?'timed-urgent':'timed'):''));
    h+='<div class="qc '+cardClass+'"><div class="qh"><span class="qn">'+(q.done?'✅ ':(q.expired?'❌ ':''))+q.n+'</span><span class="qr">'+q.rw.xp+' XP | '+q.rw.g+' G</span></div>';
    if(q.chain){
      h+='<div style="font-size:10px;color:var(--accent-light);margin-bottom:4px;">🔗 Chain: '+q.chain+'</div>';
    }
    if(q.reqQuest && !q.revealed){
      const req=G.quests.find(rq=>rq.id===q.reqQuest);
      h+='<div style="font-size:10px;color:var(--text-dim);font-style:italic;margin-bottom:4px;">🔒 Requires: '+(req?req.n:'Unknown')+'</div>';
    }
    h+='<div class="qd">'+q.d+'</div>';
    if(timerStatus){
      h+='<div class="timer-bar"><div class="timer-fill '+timerStatus.cls+'" style="width:'+timerStatus.pct+'%"></div></div>';
      h+='<div class="timer-label">⏰ '+timerStatus.label+'</div>';
    }
    h+='<div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+Math.min(q.c,q.need)+'/'+q.need+'</span></div></div>';
  }
  h+='</div>';
    // Daily Quests section
  h += '<h2 class="st" style="margin-top:20px;">📋 Daily Quests</h2><div class="qlist">';
  generateDailyQuests();
  if (G.dailyQuests.length === 0) {
    h += '<div class="qc"><div class="qd">No daily quests available. Check back tomorrow!</div></div>';
  } else {
    for (let q of G.dailyQuests) {
      const pc = Math.min(100, (q.c / q.need) * 100);
      h += '<div class="qc ' + (q.done ? 'done' : '') + '"><div class="qh"><span class="qn">' + q.n + '</span><span class="qr">' + q.rw.xp + ' XP | ' + q.rw.g + ' G</span></div>';
      h += '<div class="qd">' + q.d + '</div><div class="qp"><div class="pbar"><div class="pfill" style="width:' + pc + '%"></div></div><span class="ptxt">' + q.c + '/' + q.need + '</span></div></div>';
    }
  }
  h += '</div>';
    // Bounties section
  const activeBounties = G.bounties.filter(b => !b.done && G.p.lvl >= (b.minLv || 1));
  const doneBounties = G.bounties.filter(b => b.done);
  if (activeBounties.length > 0 || doneBounties.length > 0) {
    h+='<h2 class="st" style="margin-top:20px;">💰 Bounties</h2>';
    if (activeBounties.length > 0) {
      h+='<div class="qlist">';
      for(let b of activeBounties){
        const pc=Math.min(100,(b.c/b.need)*100);
        h+='<div class="qc"><div class="qh"><span class="qn">'+b.n+'</span><span class="qr">'+b.rw.xp+' XP | '+b.rw.g+' G</span></div>';
        h+='<div class="qd">'+b.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+b.c+'/'+b.need+'</span></div></div>';
      }
      h+='</div>';
    }
    if (doneBounties.length > 0) {
      const collapsed = G.questCollapsed['__bounties_done__'];
      h+='<div style="margin-top:12px;">';
      h+='<div onclick="toggleQuestCollapse(\'__bounties_done__\')" style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:12px 16px;background:var(--bg-hover);border-radius:14px;border:1px solid var(--border);user-select:none;">';
      h+='<span style="font-size:12px;transition:transform 0.2s;display:inline-block;' + (collapsed ? '' : 'transform:rotate(90deg);') + '">▶</span>';
      h+='<span style="font-size:14px;font-weight:600;color:var(--success);">✅ Claimed</span>';
      h+='<span style="font-size:12px;color:var(--text-dim);margin-left:auto;">' + doneBounties.length + '</span>';
      h+='</div>';
      if (!collapsed) {
        h+='<div class="qlist" style="margin-top:8px;">';
        for(let b of doneBounties){
          h+='<div class="qc done" style="opacity:0.55;"><div class="qh"><span class="qn" style="text-decoration:line-through;">'+b.n+'</span><span class="qr" style="color:var(--success);">✓</span></div>';
          h+='<div class="qd">'+b.d+'</div></div>';
        }
        h+='</div>';
      }
      h+='</div>';
    }
  }
  h+='</div>';
  h+='<div class="sum"><div class="si2"><span class="sv">'+G.p.kills+'</span><span class="sl">Monsters</span></div><div class="si2"><span class="sv">'+G.p.quests+'</span><span class="sl">Quests</span></div><div class="si2"><span class="sv">'+G.p.fstreak+'</span><span class="sl">Focus</span></div></div></div>';
  return h;
}

function rFocus(){
  // If focus is not active, show the session picker
  if (!G.fs || G.state !== 'focus') {
    let h = '<div class="fv">';
    h += '<div style="font-size:42px;margin-bottom:8px;">🧘</div>';
    h += '<div class="fl" style="font-size:18px;font-weight:700;margin-bottom:4px;">Focus Mode</div>';
    h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:20px;">Pick a session length</div>';
    h += '<div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:0 auto;">';
    const sessions = [
      {m:5, xp:20, g:10, label:'Quick Sprint'},
      {m:10, xp:40, g:20, label:'Short Burst'},
      {m:15, xp:60, g:30, label:'Deep Work'},
      {m:20, xp:80, g:40, label:'Extended Flow'},
      {m:25, xp:100, g:50, label:'Full Pomodoro'}
    ];
    for (let s of sessions) {
      h += '<button class="focus-session-btn" data-min="' + s.m + '" style="padding:14px 18px;border-radius:14px;border:2px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
      h += '<span>' + s.m + ' min — ' + s.label + '</span>';
      h += '<span style="font-size:11px;color:var(--success);">+' + s.xp + 'XP +' + s.g + 'G</span>';
      h += '</button>';
    }
    h += '</div>';
    h += '<div class="ftips" style="margin-top:20px;"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward scales with session length!</li></ul></div>';
    h += '</div>';
    return h;
  }
  // Active focus session
  const el=Date.now()-(G.fs||Date.now()),rm=Math.max(0,G.fd-el);
  const m=Math.floor(rm/60000),s=Math.floor((rm%60000)/1000);
  return '<div class="fv"><div class="fc"><div class="ft" id="ft">'+m+':'+s.toString().padStart(2,'0')+'</div><div class="fl">Focus Mode — ' + (G.focusDuration || 25) + ' min</div></div><div class="ftips"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward: +' + ((G.focusDuration||25)*4) + ' XP when done!</li></ul></div><button class="cfb">Cancel</button></div>';
}

function rTemple() {
  const dead = getDeadParty();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">⛪ Temple of Resurrection</h2>';
  h2 += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ancient magic restores fallen companions. Cost: 50G each.</div>';
  if(dead.length === 0){
    h2 += '<div style="text-align:center;padding:20px;color:var(--success);">✨ All companions are alive!</div>';
  }else{
    h2 += '<div style="margin-bottom:12px;">';
    for(let p of G.party){
      const isDead = p.hp <= 0;
      const canAfford = G.p.gold >= 50;
      h2 += '<div class="temple-revive ' + (isDead ? 'dead' : 'alive') + '">';
      h2 += '<div class="tr-ava" style="background:' + p.col + '20;border-color:' + p.col + '">' + (isDead ? '💀' : re(p.r)) + '</div>';
      h2 += '<div class="tr-info">';
      h2 += '<div class="tr-name">' + p.n + '</div>';
      h2 += '<div class="tr-status ' + (isDead ? '' : 'alive') + '">' + (isDead ? '💀 FALLEN' : '✅ Alive ' + p.hp + '/' + p.mhp) + '</div>';
      h2 += '</div>';
      if(isDead) h2 += '<button class="tr-btn ' + (canAfford ? '' : 'dis') + '" data-m="' + p.n + '">' + (canAfford ? 'Revive (50G)' : 'Need 50G') + '</button>';
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  return h2;
}

function rRest() {
  const dead = getDeadParty();
  if(dead.length > 0 && !G.rest.active) return rTemple();

  if (G.rest.active && G.rest.selectedSite) {
    const site = G.rest.selectedSite;
    const currentTick = G.rest.tick;
    const maxTicks = G.rest.maxTicks;
    const pct = (currentTick / maxTicks) * 100;
    const healerName = getHealerName();
    let h2 = '<div class="rest-view">';
    h2 += '<h2 class="st">🔥 Resting at ' + site.name + '</h2>';
    if (G.ambushWarning) {
      h2 += '<div class="ambush-warning">';
      h2 += '<div class="aw-text">⚠️ ' + G.ambushWarning.text + '</div>';
      h2 += '</div>';
    }
    if (G.currentDialogue && !G.ambushWarning) {
      h2 += '<div class="dialogue-box">';
      h2 += '<div class="d-speaker">' + G.currentDialogue.speaker + '</div>';
      h2 += '<div class="d-text">' + G.currentDialogue.text + '</div>';
      h2 += '</div>';
    }
    h2 += '<div class="tick-track">';
    for (let i = 1; i <= maxTicks; i++) {
      let tickClass = '';
      let tickIcon = '○';
      if (i < currentTick) {
        tickClass = 'done';
        tickIcon = '✓';
      } else if (i === currentTick) {
        tickClass = 'current';
        tickIcon = '🔥';
      }
      h2 += '<div class="tick ' + tickClass + '">' + tickIcon + '</div>';
    }
    h2 += '</div>';
    h2 += '<div class="tick-label">Tick ' + currentTick + '/' + maxTicks + '</div>';
    h2 += '<div class="rest-progress" style="margin-top:16px;">';
    h2 += '<div class="rest-bar"><div class="rest-fill" style="width:' + pct + '%"></div></div>';
    h2 += '<div class="rest-healer ok">💚 ' + healerName + ' is tending to the party</div>';
    h2 += '</div>';
    h2 += '<button class="rest-cancel" id="cancel-rest">Cancel Rest (Partial Recovery)</button>';
    h2 += '</div>';
    return h2;
  }

  const healerOk = hasHealer();
  const healerName = getHealerName();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">💤 Rest</h2>';
  if (healerOk) {
    h2 += '<div class="rest-healer ok" style="background:#22c55e15;border:1px solid var(--success);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--success);">💚 Healer Available: ' + healerName + '</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">5 ticks, 1.5s each. Dialogue every tick. Ambush chance: 15% camp / 5% tavern.</div>';
    h2 += '</div>';
  } else {
    h2 += '<div class="rest-healer fail" style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--danger);">❌ No Healer in Party</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">You need a healer (like Eliz) in your active party to rest safely.</div>';
    h2 += '</div>';
  }
  const soelActive = G.party.some(p => p.n === 'Soel' && p.on);
  h2 += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;text-align:left;">';
  h2 += '<div style="font-size:13px;font-weight:600;color:var(--rest);margin-bottom:4px;">🐱 Soel\'s Spirit Blessing</div>';
  if (!soelActive) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Soel must be in your active party to share his blessing.</div>';
  } else if (G.soelBlessing) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Blessing rests on <b style="color:var(--text);">' + G.soelBlessing.target + '</b> (+' + G.soelBlessing.def + ' DEF). One blessing per rest \u2014 it fades when you next make camp.</div>';
  } else {
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">One member per rest receives +10 DEF until your next rest.</div>';
    h2 += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    for (let m of G.party) {
      if (!m.on || m.n === 'Soel') continue;
      h2 += '<button class="soel-bless-btn" data-n="' + m.n + '" style="padding:6px 12px;border-radius:10px;border:1px solid var(--rest);background:#10b98115;color:var(--text);font-size:11px;font-weight:600;cursor:pointer;">' + m.n + '</button>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div class="rest-sites">';
  const zones = {};
  for (let site of G.rest.sites) {
    if (!zones[site.zone]) zones[site.zone] = [];
    zones[site.zone].push(site);
  }
  for (let zoneName in zones) {
    const sites = zones[zoneName];
    const anyUnlocked = sites.some(s => s.unlocked);
    if (!anyUnlocked) continue;
    h2 += '<div style="margin-bottom:12px;">';
    h2 += '<div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">' + zoneName + '</div>';
    for (let site of sites) {
    let manaSpringRemaining = 8;
    if (G.manaSpringUses.day === G.gameDay) {
        manaSpringRemaining = 8 - G.manaSpringUses.count;
      }
      const isDepletedManaSpring = site.type === 'mana_spring' && manaSpringRemaining <= 0;

      const locked = !site.unlocked || isDepletedManaSpring;

      const canAfford = !site.cost || G.p.gold >= site.cost;
      const canRest = (site.type === 'mana_spring' || site.type === 'temple' || healerOk) && !locked && canAfford;
      h2 += '<div class="rs-card ' + (locked ? 'locked' : '') + '" data-id="' + site.id + '">';
      h2 += '<div class="rs-head">';
      h2 += '<span class="rs-name">' + site.icon + ' ' + site.name + '</span>';
      h2 += '<span class="rs-type ' + site.type + '">' + site.type.toUpperCase() + '</span>';
      h2 += '</div>';
      h2 += '<div class="rs-desc">' + site.desc + '</div>';
            if (locked) {
            if (isDepletedManaSpring) {
          h2 += '<div class="rs-req fail">💧 Daily limit reached (8/8 uses)</div>';

        } else {
          h2 += '<div class="rs-req fail">🔒 Requires Level ' + site.zoneLv + ' to discover</div>';
        }
      } else if (site.cost) {

                const msUsesLeft = site.type === 'mana_spring' ? ' (' + manaSpringRemaining + '/8 today)' : '';
        h2 += '<div class="rs-req ' + (canAfford ? 'ok' : 'fail') + '">' + (canAfford ? '✅' : '❌') + ' Cost: ' + site.cost + 'G' + msUsesLeft + ' · Ambush: 5% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';


      } else {
        h2 += '<div class="rs-req ' + (healerOk ? 'ok' : 'fail') + '">' + (healerOk ? '✅' : '❌') + ' Free · Ambush: 15% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';
      }
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:8px;">Rest takes ~7.5 seconds. Party banter every tick. Taverns cost gold but are safer.</div>';
  h2 += '</div>';
  return h2;
}

function rCraft(){
  let h='<div class="craft-view"><h2 class="st">Crafting</h2><div class="rlist">';
  for(let i=0;i<G.recipes.length;i++){
    const r=G.recipes[i]; let ok=true,ms='';
    for(let [mn,mq] of Object.entries(r.m)){
      const iv=G.p.inv.find(x=>x.n==mn);
      const hv=iv?iv.q:0,en=hv>=mq;
      if(!en)ok=false;
      ms+='<span class="mp '+(en?'ok':'miss')+'">'+mn+': '+hv+'/'+mq+'</span>';
    }
    h+='<div class="rc"><div class="rr"><span class="ri">'+ie(r.res)+'</span><span class="rn" style="color:'+rc(r.res.r)+'">'+r.n+'</span><span class="rd">'+r.d+'</span></div><div class="rms">'+ms+'</div><button class="cb '+(ok?'':'dis')+'" data-i="'+i+'">Forge</button></div>';
  }
  h+='</div></div>'; return h;
}

function rQuest(){
  let h='<div class="quest-view">';
    // === DAILY LOGIN REWARDS ===
  const today = G.gameDay || 0;
  const streak = G.loginStreak || 0;
  const claimedToday = G.loginClaimed || false;

  const loginRewards = [
    { day: 1, icon: '💰', name: 'Gold Pouch', g: 50, xp: 25 },
    { day: 2, icon: '💧', name: 'Mana Crystal', mp: 30, xp: 35 },
    { day: 3, icon: '🧪', name: 'Health Potion', hp: 50, xp: 45 },
    { day: 4, icon: '💎', name: 'Gem Shard', g: 100, xp: 60 },
    { day: 5, icon: '⚔️', name: 'Mystic Scroll', g: 150, xp: 80 },
    { day: 6, icon: '🔮', name: 'Arcane Orb', mp: 50, xp: 100 },
    { day: 7, icon: '👑', name: 'Legendary Cache', g: 300, xp: 200, item: { n: 'Phoenix Feather', t: 'revive', eff: 'revive', v: 50, q: 1, r: 'rare' } }
  ];

  const todayReward = loginRewards[Math.min(streak, 6)];

  h += '<div style="background: linear-gradient(135deg, var(--accent), #6d28d9); border-radius: 16px; padding: 16px; margin-bottom: 16px; color: white;">';
  h += '<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">';
  h += '<div style="font-size: 28px;">🎁</div>';
  h += '<div><div style="font-weight: 700; font-size: 16px;">Daily Login Reward</div>';
  h += '<div style="font-size: 11px; opacity: 0.9;">Day ' + (streak + 1) + ' · Streak: ' + streak + '</div></div>';
  h += '</div>';

  h += '<div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px; margin-bottom: 12px;">';
  h += '<div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">Today\'s Reward:</div>';
  h += '<div style="display: flex; align-items: center; gap: 8px;">';
  h += '<div style="font-size: 32px;">' + todayReward.icon + '</div>';
  h += '<div style="flex: 1;">';
  h += '<div style="font-weight: 600; font-size: 14px;">' + todayReward.name + '</div>';
  h += '<div style="font-size: 11px; opacity: 0.85;">';
  const rewardParts = [];
  if (todayReward.g) rewardParts.push('+' + todayReward.g + 'G');
  if (todayReward.xp) rewardParts.push('+' + todayReward.xp + 'XP');
  if (todayReward.hp) rewardParts.push('+' + todayReward.hp + 'HP');
  if (todayReward.mp) rewardParts.push('+' + todayReward.mp + 'MP');
  if (todayReward.item) rewardParts.push(todayReward.item.n);
  h += rewardParts.join(' · ');
  h += '</div></div></div></div>';

  // Streak progress dots
  h += '<div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 12px;">';
  for (let i = 0; i < 7; i++) {
    const isActive = i < streak;
    const isToday = i === streak;
    h += '<div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; ' + 
      (isActive ? 'background: #fbbf24; color: #000;' : 
       isToday ? 'background: white; color: var(--accent); border: 2px solid #fbbf24;' : 
       'background: rgba(255,255,255,0.2); color: white;') + '">' + (i + 1) + '</div>';
  }
  h += '</div>';

  if (claimedToday) {
    h += '<button disabled style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: rgba(255,255,255,0.2); color: white; font-size: 13px; font-weight: 600; opacity: 0.6; cursor: not-allowed;">✅ Claimed Today — Come Back Tomorrow!</button>';
  } else {
    h += '<button id="btn-claim-login" style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: #fbbf24; color: #000; font-size: 13px; font-weight: 700; cursor: pointer;">🎁 Claim Reward</button>';
  }
  h += '</div>';
  // === END DAILY LOGIN ===

  // Storyline section
  h+='<h2 class="st">📖 Storyline</h2><div class="qlist">';
  for(let s of G.storyline){
    if(!s.unlocked) continue;
    const pc=Math.min(100,(G.p.lvl/s.need)*100);
    h+='<div class="qc '+(s.done?'done':'')+'" style="border-color:var(--accent-light);"><div class="qh"><span class="qn">'+(s.done?'✅ ':'')+'Ch.'+s.chapter+': '+s.n+'</span><span class="qr">'+s.rw.xp+' XP | '+s.rw.g+' G</span></div>';
    h+='<div class="qd">'+s.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">Lv.'+G.p.lvl+'/'+s.need+'</span></div></div>';
  }
  h+='</div>';
  // Active quests section
  h+='<h2 class="st" style="margin-top:20px;">📜 Active Quests</h2><div class="qlist">';
  for(let q of G.quests){
    if(q.hidden && !q.revealed) continue;
    const pc=Math.min(100,(q.c/q.need)*100);
    const timerStatus=getTimerStatus(q);
    let cardClass=q.done?'done':(q.expired?'expired':(timerStatus?(timerStatus.cls==='timer-urgent'?'timed-urgent':'timed'):''));
    h+='<div class="qc '+cardClass+'"><div class="qh"><span class="qn">'+(q.done?'✅ ':(q.expired?'❌ ':''))+q.n+'</span><span class="qr">'+q.rw.xp+' XP | '+q.rw.g+' G</span></div>';
    if(q.chain){
      h+='<div style="font-size:10px;color:var(--accent-light);margin-bottom:4px;">🔗 Chain: '+q.chain+'</div>';
    }
    if(q.reqQuest && !q.revealed){
      const req=G.quests.find(rq=>rq.id===q.reqQuest);
      h+='<div style="font-size:10px;color:var(--text-dim);font-style:italic;margin-bottom:4px;">🔒 Requires: '+(req?req.n:'Unknown')+'</div>';
    }
    h+='<div class="qd">'+q.d+'</div>';
    if(timerStatus){
      h+='<div class="timer-bar"><div class="timer-fill '+timerStatus.cls+'" style="width:'+timerStatus.pct+'%"></div></div>';
      h+='<div class="timer-label">⏰ '+timerStatus.label+'</div>';
    }
    h+='<div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+Math.min(q.c,q.need)+'/'+q.need+'</span></div></div>';
  }
  h+='</div>';
    // Daily Quests section
  h += '<h2 class="st" style="margin-top:20px;">📋 Daily Quests</h2><div class="qlist">';
  generateDailyQuests();
  if (G.dailyQuests.length === 0) {
    h += '<div class="qc"><div class="qd">No daily quests available. Check back tomorrow!</div></div>';
  } else {
    for (let q of G.dailyQuests) {
      const pc = Math.min(100, (q.c / q.need) * 100);
      h += '<div class="qc ' + (q.done ? 'done' : '') + '"><div class="qh"><span class="qn">' + q.n + '</span><span class="qr">' + q.rw.xp + ' XP | ' + q.rw.g + ' G</span></div>';
      h += '<div class="qd">' + q.d + '</div><div class="qp"><div class="pbar"><div class="pfill" style="width:' + pc + '%"></div></div><span class="ptxt">' + q.c + '/' + q.need + '</span></div></div>';
    }
  }
  h += '</div>';
    // Bounties section
  const activeBounties = G.bounties.filter(b => !b.done && G.p.lvl >= (b.minLv || 1));
  const doneBounties = G.bounties.filter(b => b.done);
  if (activeBounties.length > 0 || doneBounties.length > 0) {
    h+='<h2 class="st" style="margin-top:20px;">💰 Bounties</h2>';
    if (activeBounties.length > 0) {
      h+='<div class="qlist">';
      for(let b of activeBounties){
        const pc=Math.min(100,(b.c/b.need)*100);
        h+='<div class="qc"><div class="qh"><span class="qn">'+b.n+'</span><span class="qr">'+b.rw.xp+' XP | '+b.rw.g+' G</span></div>';
        h+='<div class="qd">'+b.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+b.c+'/'+b.need+'</span></div></div>';
      }
      h+='</div>';
    }
    if (doneBounties.length > 0) {
      const collapsed = G.questCollapsed['__bounties_done__'];
      h+='<div style="margin-top:12px;">';
      h+='<div onclick="toggleQuestCollapse(\'__bounties_done__\')" style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:12px 16px;background:var(--bg-hover);border-radius:14px;border:1px solid var(--border);user-select:none;">';
      h+='<span style="font-size:12px;transition:transform 0.2s;display:inline-block;' + (collapsed ? '' : 'transform:rotate(90deg);') + '">▶</span>';
      h+='<span style="font-size:14px;font-weight:600;color:var(--success);">✅ Claimed</span>';
      h+='<span style="font-size:12px;color:var(--text-dim);margin-left:auto;">' + doneBounties.length + '</span>';
      h+='</div>';
      if (!collapsed) {
        h+='<div class="qlist" style="margin-top:8px;">';
        for(let b of doneBounties){
          h+='<div class="qc done" style="opacity:0.55;"><div class="qh"><span class="qn" style="text-decoration:line-through;">'+b.n+'</span><span class="qr" style="color:var(--success);">✓</span></div>';
          h+='<div class="qd">'+b.d+'</div></div>';
        }
        h+='</div>';
      }
      h+='</div>';
    }
  }
  h+='</div>';
  h+='<div class="sum"><div class="si2"><span class="sv">'+G.p.kills+'</span><span class="sl">Monsters</span></div><div class="si2"><span class="sv">'+G.p.quests+'</span><span class="sl">Quests</span></div><div class="si2"><span class="sv">'+G.p.fstreak+'</span><span class="sl">Focus</span></div></div></div>';
  return h;
}

function rFocus(){
  // If focus is not active, show the session picker
  if (!G.fs || G.state !== 'focus') {
    let h = '<div class="fv">';
    h += '<div style="font-size:42px;margin-bottom:8px;">🧘</div>';
    h += '<div class="fl" style="font-size:18px;font-weight:700;margin-bottom:4px;">Focus Mode</div>';
    h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:20px;">Pick a session length</div>';
    h += '<div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:0 auto;">';
    const sessions = [
      {m:5, xp:20, g:10, label:'Quick Sprint'},
      {m:10, xp:40, g:20, label:'Short Burst'},
      {m:15, xp:60, g:30, label:'Deep Work'},
      {m:20, xp:80, g:40, label:'Extended Flow'},
      {m:25, xp:100, g:50, label:'Full Pomodoro'}
    ];
    for (let s of sessions) {
      h += '<button class="focus-session-btn" data-min="' + s.m + '" style="padding:14px 18px;border-radius:14px;border:2px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
      h += '<span>' + s.m + ' min — ' + s.label + '</span>';
      h += '<span style="font-size:11px;color:var(--success);">+' + s.xp + 'XP +' + s.g + 'G</span>';
      h += '</button>';
    }
    h += '</div>';
    h += '<div class="ftips" style="margin-top:20px;"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward scales with session length!</li></ul></div>';
    h += '</div>';
    return h;
  }
  // Active focus session
  const el=Date.now()-(G.fs||Date.now()),rm=Math.max(0,G.fd-el);
  const m=Math.floor(rm/60000),s=Math.floor((rm%60000)/1000);
  return '<div class="fv"><div class="fc"><div class="ft" id="ft">'+m+':'+s.toString().padStart(2,'0')+'</div><div class="fl">Focus Mode — ' + (G.focusDuration || 25) + ' min</div></div><div class="ftips"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward: +' + ((G.focusDuration||25)*4) + ' XP when done!</li></ul></div><button class="cfb">Cancel</button></div>';
}

function rTemple() {
  const dead = getDeadParty();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">⛪ Temple of Resurrection</h2>';
  h2 += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ancient magic restores fallen companions. Cost: 50G each.</div>';
  if(dead.length === 0){
    h2 += '<div style="text-align:center;padding:20px;color:var(--success);">✨ All companions are alive!</div>';
  }else{
    h2 += '<div style="margin-bottom:12px;">';
    for(let p of G.party){
      const isDead = p.hp <= 0;
      const canAfford = G.p.gold >= 50;
      h2 += '<div class="temple-revive ' + (isDead ? 'dead' : 'alive') + '">';
      h2 += '<div class="tr-ava" style="background:' + p.col + '20;border-color:' + p.col + '">' + (isDead ? '💀' : re(p.r)) + '</div>';
      h2 += '<div class="tr-info">';
      h2 += '<div class="tr-name">' + p.n + '</div>';
      h2 += '<div class="tr-status ' + (isDead ? '' : 'alive') + '">' + (isDead ? '💀 FALLEN' : '✅ Alive ' + p.hp + '/' + p.mhp) + '</div>';
      h2 += '</div>';
      if(isDead) h2 += '<button class="tr-btn ' + (canAfford ? '' : 'dis') + '" data-m="' + p.n + '">' + (canAfford ? 'Revive (50G)' : 'Need 50G') + '</button>';
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  return h2;
}

function rRest() {
  const dead = getDeadParty();
  if(dead.length > 0 && !G.rest.active) return rTemple();

  if (G.rest.active && G.rest.selectedSite) {
    const site = G.rest.selectedSite;
    const currentTick = G.rest.tick;
    const maxTicks = G.rest.maxTicks;
    const pct = (currentTick / maxTicks) * 100;
    const healerName = getHealerName();
    let h2 = '<div class="rest-view">';
    h2 += '<h2 class="st">🔥 Resting at ' + site.name + '</h2>';
    if (G.ambushWarning) {
      h2 += '<div class="ambush-warning">';
      h2 += '<div class="aw-text">⚠️ ' + G.ambushWarning.text + '</div>';
      h2 += '</div>';
    }
    if (G.currentDialogue && !G.ambushWarning) {
      h2 += '<div class="dialogue-box">';
      h2 += '<div class="d-speaker">' + G.currentDialogue.speaker + '</div>';
      h2 += '<div class="d-text">' + G.currentDialogue.text + '</div>';
      h2 += '</div>';
    }
    h2 += '<div class="tick-track">';
    for (let i = 1; i <= maxTicks; i++) {
      let tickClass = '';
      let tickIcon = '○';
      if (i < currentTick) {
        tickClass = 'done';
        tickIcon = '✓';
      } else if (i === currentTick) {
        tickClass = 'current';
        tickIcon = '🔥';
      }
      h2 += '<div class="tick ' + tickClass + '">' + tickIcon + '</div>';
    }
    h2 += '</div>';
    h2 += '<div class="tick-label">Tick ' + currentTick + '/' + maxTicks + '</div>';
    h2 += '<div class="rest-progress" style="margin-top:16px;">';
    h2 += '<div class="rest-bar"><div class="rest-fill" style="width:' + pct + '%"></div></div>';
    h2 += '<div class="rest-healer ok">💚 ' + healerName + ' is tending to the party</div>';
    h2 += '</div>';
    h2 += '<button class="rest-cancel" id="cancel-rest">Cancel Rest (Partial Recovery)</button>';
    h2 += '</div>';
    return h2;
  }

  const healerOk = hasHealer();
  const healerName = getHealerName();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">💤 Rest</h2>';
  if (healerOk) {
    h2 += '<div class="rest-healer ok" style="background:#22c55e15;border:1px solid var(--success);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--success);">💚 Healer Available: ' + healerName + '</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">5 ticks, 1.5s each. Dialogue every tick. Ambush chance: 15% camp / 5% tavern.</div>';
    h2 += '</div>';
  } else {
    h2 += '<div class="rest-healer fail" style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--danger);">❌ No Healer in Party</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">You need a healer (like Eliz) in your active party to rest safely.</div>';
    h2 += '</div>';
  }
  const soelActive = G.party.some(p => p.n === 'Soel' && p.on);
  h2 += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;text-align:left;">';
  h2 += '<div style="font-size:13px;font-weight:600;color:var(--rest);margin-bottom:4px;">🐱 Soel\'s Spirit Blessing</div>';
  if (!soelActive) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Soel must be in your active party to share his blessing.</div>';
  } else if (G.soelBlessing) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Blessing rests on <b style="color:var(--text);">' + G.soelBlessing.target + '</b> (+' + G.soelBlessing.def + ' DEF). One blessing per rest \u2014 it fades when you next make camp.</div>';
  } else {
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">One member per rest receives +10 DEF until your next rest.</div>';
    h2 += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    for (let m of G.party) {
      if (!m.on || m.n === 'Soel') continue;
      h2 += '<button class="soel-bless-btn" data-n="' + m.n + '" style="padding:6px 12px;border-radius:10px;border:1px solid var(--rest);background:#10b98115;color:var(--text);font-size:11px;font-weight:600;cursor:pointer;">' + m.n + '</button>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div class="rest-sites">';
  const zones = {};
  for (let site of G.rest.sites) {
    if (!zones[site.zone]) zones[site.zone] = [];
    zones[site.zone].push(site);
  }
  for (let zoneName in zones) {
    const sites = zones[zoneName];
    const anyUnlocked = sites.some(s => s.unlocked);
    if (!anyUnlocked) continue;
    h2 += '<div style="margin-bottom:12px;">';
    h2 += '<div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">' + zoneName + '</div>';
    for (let site of sites) {
    let manaSpringRemaining = 8;
    if (G.manaSpringUses.day === G.gameDay) {
        manaSpringRemaining = 8 - G.manaSpringUses.count;
      }
      const isDepletedManaSpring = site.type === 'mana_spring' && manaSpringRemaining <= 0;

      const locked = !site.unlocked || isDepletedManaSpring;

      const canAfford = !site.cost || G.p.gold >= site.cost;
      const canRest = (site.type === 'mana_spring' || site.type === 'temple' || healerOk) && !locked && canAfford;
      h2 += '<div class="rs-card ' + (locked ? 'locked' : '') + '" data-id="' + site.id + '">';
      h2 += '<div class="rs-head">';
      h2 += '<span class="rs-name">' + site.icon + ' ' + site.name + '</span>';
      h2 += '<span class="rs-type ' + site.type + '">' + site.type.toUpperCase() + '</span>';
      h2 += '</div>';
      h2 += '<div class="rs-desc">' + site.desc + '</div>';
            if (locked) {
            if (isDepletedManaSpring) {
          h2 += '<div class="rs-req fail">💧 Daily limit reached (8/8 uses)</div>';

        } else {
          h2 += '<div class="rs-req fail">🔒 Requires Level ' + site.zoneLv + ' to discover</div>';
        }
      } else if (site.cost) {

                const msUsesLeft = site.type === 'mana_spring' ? ' (' + manaSpringRemaining + '/8 today)' : '';
        h2 += '<div class="rs-req ' + (canAfford ? 'ok' : 'fail') + '">' + (canAfford ? '✅' : '❌') + ' Cost: ' + site.cost + 'G' + msUsesLeft + ' · Ambush: 5% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';


      } else {
        h2 += '<div class="rs-req ' + (healerOk ? 'ok' : 'fail') + '">' + (healerOk ? '✅' : '❌') + ' Free · Ambush: 15% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';
      }
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:8px;">Rest takes ~7.5 seconds. Party banter every tick. Taverns cost gold but are safer.</div>';
  h2 += '</div>';
  return h2;
}

function rFocus(){
  // If focus is not active, show the session picker
  if (!G.fs || G.state !== 'focus') {
    let h = '<div class="fv">';
    h += '<div style="font-size:42px;margin-bottom:8px;">🧘</div>';
    h += '<div class="fl" style="font-size:18px;font-weight:700;margin-bottom:4px;">Focus Mode</div>';
    h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:20px;">Pick a session length</div>';
    h += '<div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:0 auto;">';
    const sessions = [
      {m:5, xp:20, g:10, label:'Quick Sprint'},
      {m:10, xp:40, g:20, label:'Short Burst'},
      {m:15, xp:60, g:30, label:'Deep Work'},
      {m:20, xp:80, g:40, label:'Extended Flow'},
      {m:25, xp:100, g:50, label:'Full Pomodoro'}
    ];
    for (let s of sessions) {
      h += '<button class="focus-session-btn" data-min="' + s.m + '" style="padding:14px 18px;border-radius:14px;border:2px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
      h += '<span>' + s.m + ' min — ' + s.label + '</span>';
      h += '<span style="font-size:11px;color:var(--success);">+' + s.xp + 'XP +' + s.g + 'G</span>';
      h += '</button>';
    }
    h += '</div>';
    h += '<div class="ftips" style="margin-top:20px;"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward scales with session length!</li></ul></div>';
    h += '</div>';
    return h;
  }
  // Active focus session
  const el=Date.now()-(G.fs||Date.now()),rm=Math.max(0,G.fd-el);
  const m=Math.floor(rm/60000),s=Math.floor((rm%60000)/1000);
  return '<div class="fv"><div class="fc"><div class="ft" id="ft">'+m+':'+s.toString().padStart(2,'0')+'</div><div class="fl">Focus Mode — ' + (G.focusDuration || 25) + ' min</div></div><div class="ftips"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward: +' + ((G.focusDuration||25)*4) + ' XP when done!</li></ul></div><button class="cfb">Cancel</button></div>';
}

function rTemple() {
  const dead = getDeadParty();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">⛪ Temple of Resurrection</h2>';
  h2 += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ancient magic restores fallen companions. Cost: 50G each.</div>';
  if(dead.length === 0){
    h2 += '<div style="text-align:center;padding:20px;color:var(--success);">✨ All companions are alive!</div>';
  }else{
    h2 += '<div style="margin-bottom:12px;">';
    for(let p of G.party){
      const isDead = p.hp <= 0;
      const canAfford = G.p.gold >= 50;
      h2 += '<div class="temple-revive ' + (isDead ? 'dead' : 'alive') + '">';
      h2 += '<div class="tr-ava" style="background:' + p.col + '20;border-color:' + p.col + '">' + (isDead ? '💀' : re(p.r)) + '</div>';
      h2 += '<div class="tr-info">';
      h2 += '<div class="tr-name">' + p.n + '</div>';
      h2 += '<div class="tr-status ' + (isDead ? '' : 'alive') + '">' + (isDead ? '💀 FALLEN' : '✅ Alive ' + p.hp + '/' + p.mhp) + '</div>';
      h2 += '</div>';
      if(isDead) h2 += '<button class="tr-btn ' + (canAfford ? '' : 'dis') + '" data-m="' + p.n + '">' + (canAfford ? 'Revive (50G)' : 'Need 50G') + '</button>';
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  return h2;
}

function rRest() {
  const dead = getDeadParty();
  if(dead.length > 0 && !G.rest.active) return rTemple();

  if (G.rest.active && G.rest.selectedSite) {
    const site = G.rest.selectedSite;
    const currentTick = G.rest.tick;
    const maxTicks = G.rest.maxTicks;
    const pct = (currentTick / maxTicks) * 100;
    const healerName = getHealerName();
    let h2 = '<div class="rest-view">';
    h2 += '<h2 class="st">🔥 Resting at ' + site.name + '</h2>';
    if (G.ambushWarning) {
      h2 += '<div class="ambush-warning">';
      h2 += '<div class="aw-text">⚠️ ' + G.ambushWarning.text + '</div>';
      h2 += '</div>';
    }
    if (G.currentDialogue && !G.ambushWarning) {
      h2 += '<div class="dialogue-box">';
      h2 += '<div class="d-speaker">' + G.currentDialogue.speaker + '</div>';
      h2 += '<div class="d-text">' + G.currentDialogue.text + '</div>';
      h2 += '</div>';
    }
    h2 += '<div class="tick-track">';
    for (let i = 1; i <= maxTicks; i++) {
      let tickClass = '';
      let tickIcon = '○';
      if (i < currentTick) {
        tickClass = 'done';
        tickIcon = '✓';
      } else if (i === currentTick) {
        tickClass = 'current';
        tickIcon = '🔥';
      }
      h2 += '<div class="tick ' + tickClass + '">' + tickIcon + '</div>';
    }
    h2 += '</div>';
    h2 += '<div class="tick-label">Tick ' + currentTick + '/' + maxTicks + '</div>';
    h2 += '<div class="rest-progress" style="margin-top:16px;">';
    h2 += '<div class="rest-bar"><div class="rest-fill" style="width:' + pct + '%"></div></div>';
    h2 += '<div class="rest-healer ok">💚 ' + healerName + ' is tending to the party</div>';
    h2 += '</div>';
    h2 += '<button class="rest-cancel" id="cancel-rest">Cancel Rest (Partial Recovery)</button>';
    h2 += '</div>';
    return h2;
  }

  const healerOk = hasHealer();
  const healerName = getHealerName();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">💤 Rest</h2>';
  if (healerOk) {
    h2 += '<div class="rest-healer ok" style="background:#22c55e15;border:1px solid var(--success);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--success);">💚 Healer Available: ' + healerName + '</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">5 ticks, 1.5s each. Dialogue every tick. Ambush chance: 15% camp / 5% tavern.</div>';
    h2 += '</div>';
  } else {
    h2 += '<div class="rest-healer fail" style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--danger);">❌ No Healer in Party</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">You need a healer (like Eliz) in your active party to rest safely.</div>';
    h2 += '</div>';
  }
  const soelActive = G.party.some(p => p.n === 'Soel' && p.on);
  h2 += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;text-align:left;">';
  h2 += '<div style="font-size:13px;font-weight:600;color:var(--rest);margin-bottom:4px;">🐱 Soel\'s Spirit Blessing</div>';
  if (!soelActive) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Soel must be in your active party to share his blessing.</div>';
  } else if (G.soelBlessing) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Blessing rests on <b style="color:var(--text);">' + G.soelBlessing.target + '</b> (+' + G.soelBlessing.def + ' DEF). One blessing per rest \u2014 it fades when you next make camp.</div>';
  } else {
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">One member per rest receives +10 DEF until your next rest.</div>';
    h2 += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    for (let m of G.party) {
      if (!m.on || m.n === 'Soel') continue;
      h2 += '<button class="soel-bless-btn" data-n="' + m.n + '" style="padding:6px 12px;border-radius:10px;border:1px solid var(--rest);background:#10b98115;color:var(--text);font-size:11px;font-weight:600;cursor:pointer;">' + m.n + '</button>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div class="rest-sites">';
  const zones = {};
  for (let site of G.rest.sites) {
    if (!zones[site.zone]) zones[site.zone] = [];
    zones[site.zone].push(site);
  }
  for (let zoneName in zones) {
    const sites = zones[zoneName];
    const anyUnlocked = sites.some(s => s.unlocked);
    if (!anyUnlocked) continue;
    h2 += '<div style="margin-bottom:12px;">';
    h2 += '<div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">' + zoneName + '</div>';
    for (let site of sites) {
    let manaSpringRemaining = 8;
    if (G.manaSpringUses.day === G.gameDay) {
        manaSpringRemaining = 8 - G.manaSpringUses.count;
      }
      const isDepletedManaSpring = site.type === 'mana_spring' && manaSpringRemaining <= 0;

      const locked = !site.unlocked || isDepletedManaSpring;

      const canAfford = !site.cost || G.p.gold >= site.cost;
      const canRest = (site.type === 'mana_spring' || site.type === 'temple' || healerOk) && !locked && canAfford;
      h2 += '<div class="rs-card ' + (locked ? 'locked' : '') + '" data-id="' + site.id + '">';
      h2 += '<div class="rs-head">';
      h2 += '<span class="rs-name">' + site.icon + ' ' + site.name + '</span>';
      h2 += '<span class="rs-type ' + site.type + '">' + site.type.toUpperCase() + '</span>';
      h2 += '</div>';
      h2 += '<div class="rs-desc">' + site.desc + '</div>';
            if (locked) {
            if (isDepletedManaSpring) {
          h2 += '<div class="rs-req fail">💧 Daily limit reached (8/8 uses)</div>';

        } else {
          h2 += '<div class="rs-req fail">🔒 Requires Level ' + site.zoneLv + ' to discover</div>';
        }
      } else if (site.cost) {

                const msUsesLeft = site.type === 'mana_spring' ? ' (' + manaSpringRemaining + '/8 today)' : '';
        h2 += '<div class="rs-req ' + (canAfford ? 'ok' : 'fail') + '">' + (canAfford ? '✅' : '❌') + ' Cost: ' + site.cost + 'G' + msUsesLeft + ' · Ambush: 5% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';


      } else {
        h2 += '<div class="rs-req ' + (healerOk ? 'ok' : 'fail') + '">' + (healerOk ? '✅' : '❌') + ' Free · Ambush: 15% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';
      }
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:8px;">Rest takes ~7.5 seconds. Party banter every tick. Taverns cost gold but are safer.</div>';
  h2 += '</div>';
  return h2;
}

function rRest() {
  const dead = getDeadParty();
  if(dead.length > 0 && !G.rest.active) return rTemple();

  if (G.rest.active && G.rest.selectedSite) {
    const site = G.rest.selectedSite;
    const currentTick = G.rest.tick;
    const maxTicks = G.rest.maxTicks;
    const pct = (currentTick / maxTicks) * 100;
    const healerName = getHealerName();
    let h2 = '<div class="rest-view">';
    h2 += '<h2 class="st">🔥 Resting at ' + site.name + '</h2>';
    if (G.ambushWarning) {
      h2 += '<div class="ambush-warning">';
      h2 += '<div class="aw-text">⚠️ ' + G.ambushWarning.text + '</div>';
      h2 += '</div>';
    }
    if (G.currentDialogue && !G.ambushWarning) {
      h2 += '<div class="dialogue-box">';
      h2 += '<div class="d-speaker">' + G.currentDialogue.speaker + '</div>';
      h2 += '<div class="d-text">' + G.currentDialogue.text + '</div>';
      h2 += '</div>';
    }
    h2 += '<div class="tick-track">';
    for (let i = 1; i <= maxTicks; i++) {
      let tickClass = '';
      let tickIcon = '○';
      if (i < currentTick) {
        tickClass = 'done';
        tickIcon = '✓';
      } else if (i === currentTick) {
        tickClass = 'current';
        tickIcon = '🔥';
      }
      h2 += '<div class="tick ' + tickClass + '">' + tickIcon + '</div>';
    }
    h2 += '</div>';
    h2 += '<div class="tick-label">Tick ' + currentTick + '/' + maxTicks + '</div>';
    h2 += '<div class="rest-progress" style="margin-top:16px;">';
    h2 += '<div class="rest-bar"><div class="rest-fill" style="width:' + pct + '%"></div></div>';
    h2 += '<div class="rest-healer ok">💚 ' + healerName + ' is tending to the party</div>';
    h2 += '</div>';
    h2 += '<button class="rest-cancel" id="cancel-rest">Cancel Rest (Partial Recovery)</button>';
    h2 += '</div>';
    return h2;
  }

  const healerOk = hasHealer();
  const healerName = getHealerName();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">💤 Rest</h2>';
  if (healerOk) {
    h2 += '<div class="rest-healer ok" style="background:#22c55e15;border:1px solid var(--success);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--success);">💚 Healer Available: ' + healerName + '</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">5 ticks, 1.5s each. Dialogue every tick. Ambush chance: 15% camp / 5% tavern.</div>';
    h2 += '</div>';
  } else {
    h2 += '<div class="rest-healer fail" style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--danger);">❌ No Healer in Party</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">You need a healer (like Eliz) in your active party to rest safely.</div>';
    h2 += '</div>';
  }
  const soelActive = G.party.some(p => p.n === 'Soel' && p.on);
  h2 += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;text-align:left;">';
  h2 += '<div style="font-size:13px;font-weight:600;color:var(--rest);margin-bottom:4px;">🐱 Soel\'s Spirit Blessing</div>';
  if (!soelActive) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Soel must be in your active party to share his blessing.</div>';
  } else if (G.soelBlessing) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Blessing rests on <b style="color:var(--text);">' + G.soelBlessing.target + '</b> (+' + G.soelBlessing.def + ' DEF). One blessing per rest \u2014 it fades when you next make camp.</div>';
  } else {
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">One member per rest receives +10 DEF until your next rest.</div>';
    h2 += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    for (let m of G.party) {
      if (!m.on || m.n === 'Soel') continue;
      h2 += '<button class="soel-bless-btn" data-n="' + m.n + '" style="padding:6px 12px;border-radius:10px;border:1px solid var(--rest);background:#10b98115;color:var(--text);font-size:11px;font-weight:600;cursor:pointer;">' + m.n + '</button>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div class="rest-sites">';
  const zones = {};
  for (let site of G.rest.sites) {
    if (!zones[site.zone]) zones[site.zone] = [];
    zones[site.zone].push(site);
  }
  for (let zoneName in zones) {
    const sites = zones[zoneName];
    const anyUnlocked = sites.some(s => s.unlocked);
    if (!anyUnlocked) continue;
    h2 += '<div style="margin-bottom:12px;">';
    h2 += '<div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">' + zoneName + '</div>';
    for (let site of sites) {
    let manaSpringRemaining = 8;
    if (G.manaSpringUses.day === G.gameDay) {
        manaSpringRemaining = 8 - G.manaSpringUses.count;
      }
      const isDepletedManaSpring = site.type === 'mana_spring' && manaSpringRemaining <= 0;

      const locked = !site.unlocked || isDepletedManaSpring;

      const canAfford = !site.cost || G.p.gold >= site.cost;
      const canRest = (site.type === 'mana_spring' || site.type === 'temple' || healerOk) && !locked && canAfford;
      h2 += '<div class="rs-card ' + (locked ? 'locked' : '') + '" data-id="' + site.id + '">';
      h2 += '<div class="rs-head">';
      h2 += '<span class="rs-name">' + site.icon + ' ' + site.name + '</span>';
      h2 += '<span class="rs-type ' + site.type + '">' + site.type.toUpperCase() + '</span>';
      h2 += '</div>';
      h2 += '<div class="rs-desc">' + site.desc + '</div>';
            if (locked) {
            if (isDepletedManaSpring) {
          h2 += '<div class="rs-req fail">💧 Daily limit reached (8/8 uses)</div>';

        } else {
          h2 += '<div class="rs-req fail">🔒 Requires Level ' + site.zoneLv + ' to discover</div>';
        }
      } else if (site.cost) {

                const msUsesLeft = site.type === 'mana_spring' ? ' (' + manaSpringRemaining + '/8 today)' : '';
        h2 += '<div class="rs-req ' + (canAfford ? 'ok' : 'fail') + '">' + (canAfford ? '✅' : '❌') + ' Cost: ' + site.cost + 'G' + msUsesLeft + ' · Ambush: 5% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';


      } else {
        h2 += '<div class="rs-req ' + (healerOk ? 'ok' : 'fail') + '">' + (healerOk ? '✅' : '❌') + ' Free · Ambush: 15% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';
      }
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:8px;">Rest takes ~7.5 seconds. Party banter every tick. Taverns cost gold but are safer.</div>';
  h2 += '</div>';
  return h2;
}

function rSecret(){
  const area = G.secretAreas[G.secretArea.zone];
  if (!area) return '<div>Error</div>';
  let h = '<div style="padding:20px;text-align:center;">';
  h += '<h2 style="color:var(--accent-light);">🔍 ' + area.name + '</h2>';
  h += '<div style="font-size:13px;color:var(--text-dim);margin-bottom:20px;">' + area.desc + '</div>';
  if (!G.secretArea.choice && G.secretArea.result !== 'done') {
    for (let choice of area.choices) {
      const isRisky = choice.risk === 'high';
      h += '<button class="secret-choice" data-choice="' + choice.id + '" style="display:block;width:100%;max-width:300px;margin:10px auto;padding:14px;border-radius:14px;border:2px solid '+(isRisky?'var(--danger)':'var(--accent)')+';background:var(--bg-card);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;">';
      h += choice.label + (isRisky ? ' ⚠️' : '') + '</button>';
    }
  } else if (G.secretArea.result === 'ambush') {
    h += '<div style="color:var(--danger);font-size:18px;margin:20px;">💥 Ambush!</div>';
    h += '<button class="abtn" onclick="render()">Fight!</button>';
  } else {
    h += '<div style="margin:20px;">' + (G.secretArea.result === 'loot' ? '🎁 Found something!' : '📦 Empty...') + '</div>';
    h += '<button class="abtn" id="btn-close-secret">Continue</button>';
  }
  h += '</div>';
  return h;
}

function rSkillTree(){
  let h = '<div style="padding:16px;">';
  h += '<h2 class="st">🌳 Skill Trees</h2>';
  if (!G.playerSpec.path) {
    h += '<div style="font-size:13px;color:var(--text-dim);margin-bottom:20px;text-align:center;">Choose your specialization at Level 3.</div>';
    h += '<div style="display:flex;flex-direction:column;gap:12px;">';
    for (let [key, path] of Object.entries(G.skillTrees)) {
      const canChoose = G.p.lvl >= 3;
      h += '<div class="spec-card" data-spec="' + key + '" style="background:var(--bg-card);border:2px solid '+(canChoose?path.color:'var(--disabled)')+';border-radius:16px;padding:16px;cursor:'+(canChoose?'pointer':'not-allowed')+';opacity:'+(canChoose?'1':'0.5')+';">';
      h += '<span style="font-size:32px;">' + path.icon + '</span>';
      h += '<div style="font-size:16px;font-weight:700;color:'+path.color+';">' + path.name + '</div>';
      h += '<div style="font-size:11px;color:var(--text-dim);">' + path.desc + '</div>';
      for (let i = 0; i < path.tiers.length; i++) {
        const tier = path.tiers[i];
        h += '<div style="font-size:12px;padding:8px;background:var(--bg-hover);border-radius:8px;margin-top:8px;">';
        h += '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:'+path.color+'20;color:'+path.color+';">Lv.' + tier.level + '</span> ';
        h += '<b>' + tier.name + '</b> — ' + tier.desc + '</div>';
      }
      if (!canChoose) h += '<div style="margin-top:10px;font-size:11px;color:var(--danger);text-align:center;">🔒 Requires Level 3</div>';
      h += '</div>';
    }
    h += '</div>';
  } else {
    const path = G.skillTrees[G.playerSpec.path];
    h += '<div style="text-align:center;margin-bottom:20px;">';
    h += '<span style="font-size:48px;">' + path.icon + '</span>';
    h += '<div style="font-size:20px;font-weight:700;color:'+path.color+';">' + path.name + '</div>';
    h += '</div>';
    for (let i = 0; i < path.tiers.length; i++) {
      const tier = path.tiers[i];
      const unlocked = G.playerSpec.tiers.includes(i);
      const canUnlock = canUnlockTier(i);
      h += '<div style="background:var(--bg-card);border:2px solid '+(unlocked?path.color:canUnlock?path.color+'60':'var(--disabled)')+';border-radius:14px;padding:14px;margin-bottom:12px;">';
      h += '<div style="font-weight:700;color:'+(unlocked?path.color:'var(--text-dim)')+';">' + (unlocked?'✅':canUnlock?'🔓':'🔒') + ' ' + tier.name + '</div>';
      h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:8px;">' + tier.desc + '</div>';
      if (unlocked) h += '<div style="font-size:11px;color:var(--success);font-weight:600;">✨ ACTIVE</div>';
      else if (canUnlock) h += '<button class="spec-unlock-btn" data-tier="' + i + '" style="width:100%;padding:10px;border-radius:10px;border:none;background:'+path.color+';color:white;font-size:13px;font-weight:600;cursor:pointer;">Unlock ' + tier.name + '</button>';
      else if (G.p.lvl < tier.level) h += '<div style="font-size:11px;color:var(--danger);">🔒 Requires Level ' + tier.level + '</div>';
      else h += '<div style="font-size:11px;color:var(--text-dim);">🔒 Complete previous tier</div>';
      h += '</div>';
    }
    const respecCost = 50 + (G.playerSpec.respecCount * 50);
    const canRespec = G.p.gold >= respecCost;
    h += '<button id="btn-respec" style="width:100%;padding:10px;border-radius:10px;border:1px solid '+(canRespec?'var(--danger)':'var(--disabled)')+';background:transparent;color:'+(canRespec?'var(--danger)':'var(--disabled)')+';font-size:12px;font-weight:600;cursor:'+(canRespec?'pointer':'not-allowed')+';">🔄 Respec (' + respecCost + 'G)</button>';
  }
  h += '</div>';
  return h;
}

function rMiniStory(){
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

function rNPC() {
  let h = '<div class="npc-view"><h2 class="st">🧳 Traders & Allies</h2>';

  // Traders section
  const traders = G.npcs.filter(n => n.t === 'trader');
  if (traders.length > 0) {
    h += '<div style="margin-bottom:20px;"><h3 style="font-size:14px;color:#fbbf24;margin-bottom:10px;">🧳 Wandering Traders</h3>';
    for (let npc of traders) {
      h += '<div class="npc-card ' + (npc.unlocked ? '' : 'locked') + '" style="border-color:' + (npc.unlocked ? '#fbbf24' : 'var(--border)') + ';">';
      h += '<div class="npc-ava" style="background:' + npc.col + '20;border-color:' + npc.col + '">' + npc.icon + '</div>';
      h += '<div class="npc-info">';
      h += '<div class="npc-name">' + npc.n + ' <span class="npc-type npc-type-trader">' + npc.title + '</span></div>';
      if (!npc.unlocked) {
        h += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">🔒 Unlocked at ' + npc.zone + ' (Lv.' + npc.zoneLv + ')</div>';
      } else {
        h += '<div class="npc-desc">' + npc.d + '</div>';
        h += '<div class="npc-stock">';
        for (let j = 0; j < npc.stock.length; j++) {
          const item = npc.stock[j];
          const icon = item.t === 'food' ? '🍽️' : item.t === 'drink' ? '🥤' : item.t === 'pgear' ? '⚔️' : '';
          h += '<span class="npc-item" style="color:' + rc(item.r) + ';">' + icon + ' ' + item.n + ' (' + item.price + 'G)</span>';
        }
        h += '</div>';
        h += '<div style="margin-top:8px;">';
        for (let j = 0; j < npc.stock.length; j++) {
          const item = npc.stock[j];
          const canAfford = G.p.gold >= item.price;
          h += '<button class="npc-buy ' + (canAfford ? 'ib-u' : 'ib-e') + '" data-npc="' + npc.n + '" data-item="' + j + '" style="margin-right:4px;">' + (canAfford ? 'Buy ' + item.n + ' (' + item.price + 'G)' : 'Need ' + item.price + 'G') + '</button>';
        }
        h += '</div>';
        // Amad's sell section
        if (npc.n === 'Amad' && npc.buysAnything) {
          const sellableItems = G.p.inv.filter(i => i.t !== 'revive'); // Can't sell revives
          if (sellableItems.length > 0) {
            h += '<div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);">';
            h += '<div style="font-size:12px;font-weight:600;color:#fbbf24;margin-bottom:8px;">💰 Sell to Amad (50% value)</div>';
            h += '<div style="display:flex;flex-direction:column;gap:6px;">';
            for (let j = 0; j < G.p.inv.length; j++) {
              const item = G.p.inv[j];
              if (item.t === 'revive') continue;
              let sellPrice = 0;
              if (item.value) sellPrice = Math.floor(item.value * 0.5);
              else if (item.t === 'mat') sellPrice = Math.floor((item.ilvl || 1) * 3 + 2);
              else if (item.t === 'pot' || item.t === 'food' || item.t === 'drink') sellPrice = Math.floor((item.v || 10) * 0.3);
              else sellPrice = Math.floor((item.ilvl || 1) * 4);
              sellPrice = Math.max(1, sellPrice);
              const itemIcon = ie(item);
              h += '<button class="amad-sell" data-index="' + j + '" style="padding:6px 10px;border-radius:8px;border:1px solid var(--border);background:var(--bg-hover);color:var(--text);font-size:11px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
              h += '<span>' + itemIcon + ' ' + item.n + (item.q > 1 ? ' x' + item.q : '') + '</span>';
              h += '<span style="color:#fbbf24;">' + sellPrice + 'G</span>';
              h += '</button>';
            }
            h += '</div></div>';
          } else {
            h += '<div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);">';
            h += '<div style="font-size:11px;color:var(--text-dim);">💰 Your pack is empty — nothing to sell to Amad.</div>';
            h += '</div>';
          }
        }
      }
      h += '</div></div>';
    }
    h += '</div>';
  }

  // Allies section
  const allies = G.npcs.filter(n => n.t === 'ally');
  if (allies.length > 0) {
    h += '<div><h3 style="font-size:14px;color:#8b5cf6;margin-bottom:10px;">🌙 Allies</h3>';
    for (let npc of allies) {
      const aff = G.affinity[npc.reqMember];
      h += '<div class="npc-card ' + (npc.unlocked ? '' : 'locked') + '" style="border-color:' + (npc.unlocked ? '#8b5cf6' : 'var(--border)') + ';">';
      h += '<div class="npc-ava" style="background:' + npc.col + '20;border-color:' + npc.col + '">' + npc.icon + '</div>';
      h += '<div class="npc-info">';
      h += '<div class="npc-name">' + npc.n + ' <span class="npc-type npc-type-ally">' + npc.title + '</span></div>';
      if (!npc.unlocked) {
        h += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">🔒 Requires ' + npc.reqMember + ' affinity ' + npc.affinityReq + '+ (currently ' + (aff ? aff.val : 0) + ')</div>';
        if (aff) {
          h += '<div class="affinity-bar"><div class="affinity-fill ' + getAffinityColor(aff.val) + '" style="width:' + (aff.val / aff.max * 100) + '%"></div></div>';
          h += '<div class="affinity-label">' + (aff.val >= 70 ? '💕 Close' : aff.val >= 40 ? '💛 Friendly' : aff.val >= 20 ? '💔 Distant' : '💀 Strained') + ' (' + aff.val + '/' + aff.max + ')</div>';
        }
      } else {
        h += '<div class="npc-desc">' + npc.d + '</div>';
        h += '<div style="font-size:11px;color:var(--success);margin-top:4px;">' + npc.ability + '</div>';
      }
      h += '</div></div>';
    }
    h += '</div>';
  }

  h += '<div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:16px;">Traders unlock by zone level. Allies unlock through party affinity.</div>';
  // Trinket Shop
  h += '<div style="margin-top:20px;"><h3 style="font-size:14px;color:#a78bfa;margin-bottom:10px;">🎁 Trinket Shop</h3>';
  h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:10px;">Simple gear any party member can equip. Buy then equip from Party screen.</div>';
  h += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">';
  for(let i=0;i<TRINKET_SHOP.length;i++){
    const t=TRINKET_SHOP[i];
    const canAfford=G.p.gold>=t.price;
    const color=t.r==='epic'?'#a855f7':t.r==='rare'?'#3b82f6':t.r==='uncommon'?'#22c55e':'#9ca3af';
    h+='<button class="trinket-buy-btn" data-tidx="'+i+'" style="padding:10px;border-radius:12px;border:1px solid '+(canAfford?color:'var(--disabled)')+';background:var(--bg-card);color:var(--text);font-size:11px;font-weight:600;cursor:'+(canAfford?'pointer':'not-allowed')+';opacity:'+(canAfford?'1':'0.5')+';text-align:left;">';
    h+='<div style="color:'+color+';font-weight:700;">'+t.n+'</div>';
    h+='<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">ATK+'+t.atk+' DEF+'+t.def+' HP+'+t.hp+'</div>';
    h+='<div style="font-size:10px;color:'+(canAfford?'#f59e0b':'var(--danger)')+';margin-top:4px;">'+(canAfford?'💰 ':'🔒 ')+t.price+'G</div>';
    h+='</button>';
  }
  h += '</div></div>';

  h += '</div>';
  return h;
}

function showStory() {
  if(!G.story.active || G.story.shown) return;
  const chapter = G.storyChapters[G.story.chapter];
  if(!chapter) return;
  if(chapter.unlockLevel && G.p.lvl < chapter.unlockLevel) return;
  G.state = 'story';
  render();
}

function advanceStory() {
  const chapter = G.storyChapters[G.story.chapter];
  if(!chapter) { G.story.shown = true; setS('menu'); return; }
  G.story.scene++;
  if(G.story.scene >= chapter.scenes.length) {
    G.story.shown = true;
    G.story.chapter++;
    G.story.scene = 0;
    setS('menu');
  } else {
    render();
  }
}

function checkStoryUnlock() {
  if(G.story.shown) return;
  const nextChapter = G.storyChapters[G.story.chapter];
  if(!nextChapter) return;
  if(nextChapter.unlockLevel && G.p.lvl >= nextChapter.unlockLevel) {
    G.story.shown = false;
    G.story.scene = 0;
    showStory();
  }
}


function rAchievements() {
  let h = '<div class="achievements-view" style="padding:16px;">';
  h += '<h2 class="st">🏆 Achievements</h2>';

  const earned = G.achievements.filter(a => a.done);
  const total = G.achievements.length;
  const secret = G.achievements.filter(a => a.secret);
  const secretEarned = secret.filter(a => a.done);

  h += '<div style="text-align:center;margin-bottom:20px;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:16px;">';
  h += '<div style="font-size:36px;font-weight:700;color:var(--gold);">' + earned.length + '/' + total + '</div>';
  h += '<div style="font-size:12px;color:var(--text-dim);">Achievements Unlocked</div>';
  if (secret.length > 0) {
    h += '<div style="font-size:11px;color:var(--accent-light);margin-top:4px;">🔒 ' + secretEarned.length + '/' + secret.length + ' Secret</div>';
  }
  h += '</div>';

  h += '<div style="display:flex;flex-direction:column;gap:10px;">';
  for (let ach of G.achievements) {
    if (ach.secret && !ach.revealed && !ach.done) {
      h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;display:flex;gap:12px;align-items:center;opacity:0.6;">';
      h += '<div style="font-size:28px;width:40px;text-align:center;">❓</div>';
      h += '<div style="flex:1;">';
      h += '<div style="font-weight:600;font-size:14px;color:var(--text-dim);">Secret Achievement</div>';
      h += '<div style="font-size:11px;color:var(--disabled);">Keep playing to discover...</div>';
      h += '</div></div>';
      continue;
    }

    const done = ach.done;
    h += '<div style="background:var(--bg-card);border:1px solid ' + (done ? 'var(--success)' : 'var(--border)') + ';border-radius:14px;padding:14px;display:flex;gap:12px;align-items:center;' + (done ? 'background:#22c55e10;' : '') + '">';
    h += '<div style="font-size:28px;width:40px;text-align:center;">' + (done ? ach.icon : '🔒') + '</div>';
    h += '<div style="flex:1;">';
    h += '<div style="font-weight:600;font-size:14px;">' + (done ? '✅ ' : '') + ach.n + '</div>';
    h += '<div style="font-size:12px;color:var(--text-dim);line-height:1.4;">' + ach.d + '</div>';
    if (!done) {
      let progress = '';
      switch (ach.t) {
        case 'kills': progress = G.p.kills + '/' + ach.need; break;
        case 'boss': progress = (G.p.bossKills || 0) + '/' + ach.need; break;
        case 'level': progress = G.p.lvl + '/' + ach.need; break;
        case 'quests': progress = G.p.quests + '/' + ach.need; break;
        case 'affinity': progress = (G.affinity[ach.target] ? G.affinity[ach.target].val : 0) + '/' + ach.need; break;
        case 'gold': progress = G.p.gold + '/' + ach.need; break;
        case 'craft': progress = (G.p.crafts || 0) + '/' + ach.need; break;
        case 'focus': progress = G.p.fstreak + '/' + ach.need; break;
        default: progress = '???';
      }
      h += '<div style="font-size:11px;color:var(--accent-light);margin-top:4px;">' + progress + '</div>';
    } else {
      h += '<div style="font-size:11px;color:var(--success);margin-top:4px;">+' + ach.rw.xp + ' XP, +' + ach.rw.g + 'G</div>';
    }
    h += '</div></div>';
  }
  h += '</div></div>';
  return h;
}

function render(){
  initPartyGearBonus();

  const a=document.getElementById('app'); if(!a)return;
  let h='';
  h+='<div class="hdr"><div class="hdr-l"><div class="pname">'+G.p.name+' <span class="cls">'+G.p.cls+'</span></div><div class="lvl">Lv.'+G.p.lvl+'</div></div>';
  h+='<div class="hdr-r"><div class="sb"><span class="si">HP</span><div class="bar"><div class="bf bf-hp" style="width:'+((G.p.hp/G.p.mhp)*100)+'%"></div></div><span class="bt">'+G.p.hp+'/'+G.p.mhp+'</span></div>';
  h+='<div class="sb"><span class="si">MP</span><div class="bar"><div class="bf bf-mp" style="width:'+((G.p.mp/G.p.mmp)*100)+'%"></div></div><span class="bt">'+G.p.mp+'/'+G.p.mmp+'</span></div>';
  h+='<div class="sb"><span class="si">XP</span><div class="bar"><div class="bf bf-xp" style="width:'+((G.p.xp/G.p.xpN)*100)+'%"></div></div><span class="bt">'+G.p.xp+'/'+G.p.xpN+'</span></div>';
  h+='<div class="gold">GOLD: '+G.p.gold+'</div></div></div>';
  if(G.p.buffs.length>0)h+='<div class="buffs">'+G.p.buffs.map(b=>'<span class="bp">'+b.n+' ('+b.t+')</span>').join('')+'</div>';
  const activeSyns = getActiveSynergies();
  if(activeSyns.length > 0 && G.state === 'combat'){
    h += '<div class="buffs">' + activeSyns.map(s => '<span class="bp" style="background:linear-gradient(135deg,#7c3aed,#a78bfa);">'+s.icon+' '+s.name+'</span>').join('') + '</div>';
  }
  h+='<div class="content">';
  if(G.state=='menu')h+=rMenu();
  else if(G.state=='achievements')h+=rAchievements();
  else if(G.state=='story')h+=rStory();
  else if(G.state=='bestiary')h+=rBestiary();
  else if(G.state=='explore')h+=rExp();
  else if(G.state=='combat')h+=rCbt();
  else if(G.state=='party')h+=rParty();
  else if(G.state=='skills')h+=rSkills();
  else if(G.state=='inventory')h+=rInv();
  else if(G.state=='craft')h+=rCraft();
  else if(G.state=='quest')h+=rQuest();
  else if(G.state=='focus')h+=rFocus();
  else if(G.state=='rest')h+=rRest();
  else if(G.state=='secret')h+=rSecret();
  else if(G.state=='skilltree')h+=rSkillTree();
  else if(G.state=='talents')h+=rTalents();
  else if(G.state=='runes')h+=rRunes();
  else if(G.state=='ministory')h+=rMiniStory();
  else if(G.state=='journal')h+=rJournal();
  else if(G.state=='journalentry')h+=rJournalEntry(G.currentJournalEntry);
  else if(G.state=='npc')h+=rNPC();
  else if(G.state=='grind_room')h+=rGrindRoom();

  h+='</div>';
  h+='<div class="log" id="log">'+G.log.map(m=>'<div class="le">'+m+'</div>').join('')+'</div>';
  h+='<div class="nav"><button class="nb '+(G.state=='menu'?'on':'')+'" data-t="home" data-a="menu">Home</button>';
  h+='<button class="nb '+(G.state=='explore'?'on':'')+'" data-t="exp" data-a="explore">Explore</button>';
  h+='<button class="nb '+(G.state=='party'?'on':'')+'" data-t="party" data-a="party">Party</button>';
  h+='<button class="nb '+(G.state=='quest'?'on':'')+'" data-t="quest" data-a="quest">Quests</button>';
  h+='<button class="nb '+(G.state=='craft'?'on':'')+'" data-t="craft" data-a="craft">Craft</button>';
  h+='<button class="nb '+(G.state=='inventory'?'on':'')+'" data-t="inv" data-a="inventory">Items</button>';
  h+='<button class="nb '+(G.state=='npc'?'on':'')+'" data-t="npc" data-a="npc">Traders</button></div>';
  a.innerHTML=h;
  attachEvents();
  const l=document.getElementById('log'); if(l)l.scrollTop=l.scrollHeight;
}

function attachEvents() {
  document.querySelectorAll('.card[data-a]').forEach(el=>{
        el.addEventListener('click',()=>{const a=el.getAttribute('data-a');if(a=='explore')setS('explore');else if(a=='party')setS('party');else if(a=='skills')setS('skills');else if(a=='craft')setS('craft');else if(a=='quest')setS('quest');else if(a=='inventory')setS('inventory');else if(a=='bestiary')setS('bestiary');else if(a=='achievements')setS('achievements');else if(a=='npc')setS('npc');else if(a=='focus')setS('focus');
  if(a=='rest')setS('rest');
    else if(a=='grind_room')setS('grind_room');
    else if(a=='skilltree')setS('skilltree');
    else if(a=='talents')setS('talents');
    else if(a=='runes')setS('runes');
    else if(a=='journal')setS('journal');});
  });
 const btnClaimLogin = document.getElementById('btn-claim-login');
if (btnClaimLogin) {
  btnClaimLogin.addEventListener('click', claimDailyLoginReward);
}
 document.querySelectorAll('.story-view .abtn').forEach(el=>{
    el.addEventListener('click',advanceStory);
  });
  const btnSave=document.getElementById('btn-save');if(btnSave)btnSave.addEventListener('click',()=>{saveGame();});
  const btnExport=document.getElementById('btn-export');if(btnExport)btnExport.addEventListener('click',exportSave);
  const btnImport=document.getElementById('btn-import');if(btnImport)btnImport.addEventListener('click',importSave);
  const btnReset=document.getElementById('btn-reset');if(btnReset)btnReset.addEventListener('click',resetGame);
  document.querySelectorAll('.zcard:not(.locked)').forEach(el=>{
    el.addEventListener('click',()=>{const i=parseInt(el.getAttribute('data-i'));sc(i);});
  });
  document.querySelectorAll('.ecard:not(.dead)').forEach(el=>{
    el.addEventListener('click',()=>{G.cbt.tg=parseInt(el.getAttribute('data-i'));render();});
  });
  document.querySelectorAll('.sbtn:not(.dis)').forEach(el=>{
    el.addEventListener('click',()=>{
      const raw = el.getAttribute('data-i');
      G.cbt.sk = raw === '-1' ? -1 : parseInt(raw);
      render();
    });
  });
  const abtn=document.querySelector('.abtn:not(.dis)');
  if(abtn){
    abtn.addEventListener('click',()=>{
      const siRaw=abtn.getAttribute('data-si');
      const si=siRaw==='-1'?-1:parseInt(siRaw);
      const ti=parseInt(abtn.getAttribute('data-ti'));
      pa(si,ti);
    });
  }
  const fbtn=document.querySelector('.fbtn');
  if(fbtn)fbtn.addEventListener('click',flee);
  document.querySelectorAll('.ib-u').forEach(el=>{
    el.addEventListener('click',(e)=>{e.stopPropagation();useI(parseInt(el.getAttribute('data-i')));});
  });
  document.querySelectorAll('.ib-e').forEach(el=>{
    el.addEventListener('click',(e)=>{e.stopPropagation();equipItem(parseInt(el.getAttribute('data-i')));});
  });
  document.querySelectorAll('.cb:not(.dis)').forEach(el=>{
    el.addEventListener('click',()=>{craft(parseInt(el.getAttribute('data-i')));});
  });
  document.querySelectorAll('.socket-btn').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      const itemIdx=parseInt(el.getAttribute('data-ii'));
      const slot=parseInt(el.getAttribute('data-si'));
      openSocketModal(itemIdx, slot);
    });
  });
  document.querySelectorAll('.unsocket-btn').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      unsocketRune(parseInt(el.getAttribute('data-ii')), parseInt(el.getAttribute('data-si')));
      render();
    });
  });
  const btnCombine=document.getElementById('btn-combine');
  if(btnCombine)btnCombine.addEventListener('click',()=>{
    openCombineModal();
  });
  // Rune socket modal events
  document.querySelectorAll('.rune-select-btn').forEach(el=>{
    el.addEventListener('click',()=>{
      confirmSocketRune(parseInt(el.getAttribute('data-ri')));
    });
  });
  document.querySelectorAll('.rune-modal-back').forEach(el=>{
    el.addEventListener('click',()=>{
      closeSocketModal();
      closeCombineModal();
    });
  });
  // Rune combine modal events
  document.querySelectorAll('.rune-combine-select').forEach(el=>{
    el.addEventListener('click',()=>{
      toggleCombineRune(parseInt(el.getAttribute('data-ri')));
    });
  });
  const btnConfirmCombine=document.getElementById('btn-confirm-combine');
  if(btnConfirmCombine)btnConfirmCombine.addEventListener('click',doCombineRunes);
  document.querySelectorAll('.nb').forEach(el=>{
    el.addEventListener('click',()=>{const a=el.getAttribute('data-a');setS(a);});
  });
  const cfb=document.querySelector('.cfb');
  document.querySelectorAll('.focus-session-btn').forEach(el=>{
    el.addEventListener('click',()=>{sf(parseInt(el.getAttribute('data-min')));});
  });
  if(cfb)cfb.addEventListener('click',cf);
  const btnAuto=document.getElementById('btn-auto');
  if(btnAuto)btnAuto.addEventListener('click',toggleAutoCombat);
  document.querySelectorAll('.secret-choice').forEach(el=>{
    el.addEventListener('click',()=>{ makeSecretChoice(el.getAttribute('data-choice')); render(); });
  });
  const btnCloseSecret=document.getElementById('btn-close-secret');
  if(btnCloseSecret)btnCloseSecret.addEventListener('click',closeSecretArea);
  document.querySelectorAll('.spec-card').forEach(el=>{
    el.addEventListener('click',()=>{ if(G.p.lvl>=3) { const spec=el.getAttribute('data-spec'); if(chooseSpecPath(spec)) render(); } });
  });
  document.querySelectorAll('.spec-unlock-btn').forEach(el=>{
    el.addEventListener('click',()=>{ const tier=parseInt(el.getAttribute('data-tier')); if(unlockSpecTier(tier)) render(); });
  });
  const btnRespec=document.getElementById('btn-respec');
  if(btnRespec)btnRespec.addEventListener('click',respecPath);
  document.querySelectorAll('.ministory-choice').forEach(el=>{
    el.addEventListener('click',()=>{ makeMiniStoryChoice(parseInt(el.getAttribute('data-choice'))); });
  });
  const btnCloseMini=document.getElementById('btn-close-ministory');
  if(btnCloseMini)btnCloseMini.addEventListener('click',closeMiniStory);

// Journal entry click handlers
document.querySelectorAll('.zcard[data-jid]').forEach(el=>{
  el.addEventListener('click',()=>{
    const jid=el.getAttribute('data-jid');
    const entry=G.storyJournal.entries.find(e=>e.id===jid);
    if(entry&&G.storyJournal.unlocked.includes(jid)){
      G.currentJournalEntry=jid;
      setS('journalentry');
    }
  });
});
const btnBackJournal=document.getElementById('btn-back-journal');
if(btnBackJournal)btnBackJournal.addEventListener('click',()=>{ setS('journal'); });

  document.querySelectorAll('.rs-card:not(.locked):not(.active)').forEach(el=>{
    el.addEventListener('click',()=>{const id=el.getAttribute('data-id');startRest(id);});
  });
  document.querySelectorAll('.soel-bless-btn').forEach(el=>{
    el.addEventListener('click',()=>{soelBless(el.getAttribute('data-n'));});
  });
  const cancelRestBtn=document.getElementById('cancel-rest');
  if(cancelRestBtn)cancelRestBtn.addEventListener('click',cancelRest);
  document.querySelectorAll('.npc-buy').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      buyFromNPC(el.getAttribute('data-npc'),parseInt(el.getAttribute('data-item')));
    });
  });
  document.querySelectorAll('.amad-sell').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      sellToAmad(parseInt(el.getAttribute('data-index')));
    });
  });
  document.querySelectorAll('.tr-btn:not(.dis)').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      reviveMember(el.getAttribute('data-m'));
    });
  });
  document.querySelectorAll('.equip-pgear').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      equipPartyGear(el.getAttribute('data-member'), parseInt(el.getAttribute('data-idx')));
    });
  // Stage 1: Trinket shop
  document.querySelectorAll('.trinket-buy-btn').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      buyTrinket(parseInt(el.getAttribute('data-tidx')));
    });
  });

  });
  document.querySelectorAll('.unequip-pgear').forEach(el=>{
    el.addEventListener('click',(e)=>{
      e.stopPropagation();
      unequipPartyGear(el.getAttribute('data-member'));
    });
  });
}

function rSecret(){
  const area = G.secretAreas[G.secretArea.zone];
  if (!area) return '<div>Error</div>';
  let h = '<div style="padding:20px;text-align:center;">';
  h += '<h2 style="color:var(--accent-light);">🔍 ' + area.name + '</h2>';
  h += '<div style="font-size:13px;color:var(--text-dim);margin-bottom:20px;">' + area.desc + '</div>';
  if (!G.secretArea.choice && G.secretArea.result !== 'done') {
    for (let choice of area.choices) {
      const isRisky = choice.risk === 'high';
      h += '<button class="secret-choice" data-choice="' + choice.id + '" style="display:block;width:100%;max-width:300px;margin:10px auto;padding:14px;border-radius:14px;border:2px solid '+(isRisky?'var(--danger)':'var(--accent)')+';background:var(--bg-card);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;">';
      h += choice.label + (isRisky ? ' ⚠️' : '') + '</button>';
    }
  } else if (G.secretArea.result === 'ambush') {
    h += '<div style="color:var(--danger);font-size:18px;margin:20px;">💥 Ambush!</div>';
    h += '<button class="abtn" onclick="render()">Fight!</button>';
  } else {
    h += '<div style="margin:20px;">' + (G.secretArea.result === 'loot' ? '🎁 Found something!' : '📦 Empty...') + '</div>';
    h += '<button class="abtn" id="btn-close-secret">Continue</button>';
  }
  h += '</div>';
  return h;
}

function rSkillTree(){
  let h = '<div style="padding:16px;">';
  h += '<h2 class="st">🌳 Skill Trees</h2>';
  if (!G.playerSpec.path) {
    h += '<div style="font-size:13px;color:var(--text-dim);margin-bottom:20px;text-align:center;">Choose your specialization at Level 3.</div>';
    h += '<div style="display:flex;flex-direction:column;gap:12px;">';
    for (let [key, path] of Object.entries(G.skillTrees)) {
      const canChoose = G.p.lvl >= 3;
      h += '<div class="spec-card" data-spec="' + key + '" style="background:var(--bg-card);border:2px solid '+(canChoose?path.color:'var(--disabled)')+';border-radius:16px;padding:16px;cursor:'+(canChoose?'pointer':'not-allowed')+';opacity:'+(canChoose?'1':'0.5')+';">';
      h += '<span style="font-size:32px;">' + path.icon + '</span>';
      h += '<div style="font-size:16px;font-weight:700;color:'+path.color+';">' + path.name + '</div>';
      h += '<div style="font-size:11px;color:var(--text-dim);">' + path.desc + '</div>';
      for (let i = 0; i < path.tiers.length; i++) {
        const tier = path.tiers[i];
        h += '<div style="font-size:12px;padding:8px;background:var(--bg-hover);border-radius:8px;margin-top:8px;">';
        h += '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:'+path.color+'20;color:'+path.color+';">Lv.' + tier.level + '</span> ';
        h += '<b>' + tier.name + '</b> — ' + tier.desc + '</div>';
      }
      if (!canChoose) h += '<div style="margin-top:10px;font-size:11px;color:var(--danger);text-align:center;">🔒 Requires Level 3</div>';
      h += '</div>';
    }
    h += '</div>';
  } else {
    const path = G.skillTrees[G.playerSpec.path];
    h += '<div style="text-align:center;margin-bottom:20px;">';
    h += '<span style="font-size:48px;">' + path.icon + '</span>';
    h += '<div style="font-size:20px;font-weight:700;color:'+path.color+';">' + path.name + '</div>';
    h += '</div>';
    for (let i = 0; i < path.tiers.length; i++) {
      const tier = path.tiers[i];
      const unlocked = G.playerSpec.tiers.includes(i);
      const canUnlock = canUnlockTier(i);
      h += '<div style="background:var(--bg-card);border:2px solid '+(unlocked?path.color:canUnlock?path.color+'60':'var(--disabled)')+';border-radius:14px;padding:14px;margin-bottom:12px;">';
      h += '<div style="font-weight:700;color:'+(unlocked?path.color:'var(--text-dim)')+';">' + (unlocked?'✅':canUnlock?'🔓':'🔒') + ' ' + tier.name + '</div>';
      h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:8px;">' + tier.desc + '</div>';
      if (unlocked) h += '<div style="font-size:11px;color:var(--success);font-weight:600;">✨ ACTIVE</div>';
      else if (canUnlock) h += '<button class="spec-unlock-btn" data-tier="' + i + '" style="width:100%;padding:10px;border-radius:10px;border:none;background:'+path.color+';color:white;font-size:13px;font-weight:600;cursor:pointer;">Unlock ' + tier.name + '</button>';
      else if (G.p.lvl < tier.level) h += '<div style="font-size:11px;color:var(--danger);">🔒 Requires Level ' + tier.level + '</div>';
      else h += '<div style="font-size:11px;color:var(--text-dim);">🔒 Complete previous tier</div>';
      h += '</div>';
    }
    const respecCost = 50 + (G.playerSpec.respecCount * 50);
    const canRespec = G.p.gold >= respecCost;
    h += '<button id="btn-respec" style="width:100%;padding:10px;border-radius:10px;border:1px solid '+(canRespec?'var(--danger)':'var(--disabled)')+';background:transparent;color:'+(canRespec?'var(--danger)':'var(--disabled)')+';font-size:12px;font-weight:600;cursor:'+(canRespec?'pointer':'not-allowed')+';">🔄 Respec (' + respecCost + 'G)</button>';
  }
  h += '</div>';
  return h;
}

function rMiniStory(){
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
function rJournal(){
  let h='<div style="padding:16px;">';
  h+='<div class="st">📖 Journal</div>';
  
  const entries=G.storyJournal.entries;
  const unlocked=G.storyJournal.unlocked;
  const read=G.storyJournal.read;
  
  if(entries.length===0){
    h+='<div class="ei">No entries yet.</div>';
    h+='</div>';
    return h;
  }
  
  for(let entry of entries){
    const isUnlocked=unlocked.includes(entry.id);
    const isRead=read.includes(entry.id);
    
    h+='<div class="zcard '+(isUnlocked?'':'locked')+'" data-jid="'+entry.id+'" style="margin-bottom:10px;">';
    h+='<div class="zh">';
    h+='<div class="zn">'+entry.icon+' '+entry.title+'</div>';
    h+='<div class="zl">Ch. '+entry.chapter+'</div>';
    h+='</div>';
    h+='<div class="zd">'+(isUnlocked?entry.summary:'???')+'</div>';
    
    if(isUnlocked){
      h+='<div style="display:flex;gap:8px;align-items:center;margin-top:8px;">';
      h+='<span style="font-size:11px;color:'+(isRead?'var(--success)':'var(--accent-light)')+';">';
      h+=isRead?'✓ Read':'● Unread';
      h+='</span>';
      h+='</div>';
    }else{
      h+='<div style="font-size:11px;color:var(--disabled);margin-top:8px;">';
      if(entry.unlockType==='level'){
        h+='🔒 Unlock at Level '+entry.unlockAt;
      }else if(entry.unlockType==='boss'){
        h+='🔒 Defeat '+entry.unlockAt;
      }else if(entry.unlockType==='zone'){
        h+='🔒 Visit '+entry.unlockAt;
      }
      h+='</div>';
    }
    h+='</div>';
  }
  
  h+='</div>';
  return h;
}

function rJournalEntry(jid){
  const entry=G.storyJournal.entries.find(e=>e.id===jid);
  if(!entry)return'<div>Entry not found</div>';
  
  if(!G.storyJournal.read.includes(jid)){
    G.storyJournal.read.push(jid);
  }
  
  let h='<div style="padding:16px;max-width:500px;margin:0 auto;">';
  h+='<div style="font-size:12px;color:var(--accent-light);text-transform:uppercase;letter-spacing:0.15em;margin-bottom:8px;">📖 Journal — Chapter '+entry.chapter+'</div>';
  h+='<h2 style="font-family:Cinzel,serif;font-size:22px;margin-bottom:4px;">'+entry.icon+' '+entry.title+'</h2>';
  h+='<div style="font-size:11px;color:var(--text-dim);margin-bottom:24px;">'+entry.summary+'</div>';
  
  h+='<div style="width:100%;height:4px;background:var(--timer-bg);border-radius:2px;margin-bottom:24px;">';
  h+='<div style="width:100%;height:100%;background:var(--accent);border-radius:2px;"></div></div>';
  
  for(let scene of entry.scenes){
    h+='<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:20px;margin-bottom:16px;text-align:left;">';
    h+='<div style="font-size:11px;font-weight:700;color:var(--accent-light);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.05em;">'+scene.speaker+'</div>';
    h+='<div style="font-size:14px;line-height:1.8;color:var(--text);font-style:italic;">'+scene.text+'</div>';
    h+='</div>';
  }
  
  h+='<button class="fbtn" id="btn-back-journal" style="margin-top:8px;">← Back to Journal</button>';
  h+='</div>';
  return h;
}

function rStory(){
  const chapter = G.storyChapters[G.story.chapter];
  const scene = chapter.scenes[G.story.scene];
  let h='<div class="story-view" style="text-align:center;padding:20px;">';
  h+='<div style="font-size:12px;color:var(--accent-light);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:20px;">Chapter '+(G.story.chapter+1)+': '+chapter.title+'</div>';
  h+='<div class="dialogue-box" style="margin-bottom:24px;">';
  h+='<div class="d-speaker">'+scene.speaker+'</div>';
  h+='<div class="d-text" style="font-size:15px;line-height:1.7;">'+scene.text+'</div>';
  h+='</div>';
  h+='<button class="abtn" style="max-width:200px;margin:0 auto;display:block;">Continue</button>';
  h+='<div style="margin-top:16px;font-size:11px;color:var(--text-dim);">'+(G.story.scene+1)+' / '+chapter.scenes.length+'</div>';
  h+='</div>';
  return h;
}

function rBestiary(){
  let h='<div class="bestiary-view"><h2 class="st">📖 Bestiary</h2>';
  const entries = Object.entries(G.bestiary).sort((a,b)=>b[1].kills-a[1].kills);
  if(entries.length===0){
    h+='<div style="text-align:center;padding:40px;color:var(--text-dim);">No creatures catalogued yet.<br>Defeat enemies to fill the bestiary.</div>';
  }else{
    h+='<div style="font-size:11px;color:var(--text-dim);margin-bottom:12px;">'+entries.length+' species discovered</div>';
    h+='<div class="zlist">';
    for(let [name,data] of entries){
      const elemIcon = data.elem==='fire'?'🔥':data.elem==='ice'?'❄️':data.elem==='lightning'?'⚡':data.elem==='void'?'🌑':'✦';
      h+='<div class="zcard" style="cursor:default;">';
      h+='<div class="zh"><span class="zn">'+ee(name)+' '+name+'</span><span class="zl">'+data.kills+' kills</span></div>';
      h+='<div style="display:flex;gap:12px;font-size:12px;color:var(--text-dim);margin-top:6px;">';
      h+='<span>HP: '+data.mhp+'</span><span>ATK: '+data.atk+'</span><span>DEF: '+data.def+'</span><span>'+elemIcon+' '+data.elem+'</span>';
      h+='</div>';
      h+='<div style="font-size:10px;color:var(--disabled);margin-top:4px;">First seen: '+new Date(data.firstSeen).toLocaleDateString()+'</div>';
      h+='</div>';
    }
    h+='</div>';
  }
  h+='</div>';
  return h;
}



function rRunes(){
  // If socket modal is open, render that instead
  if (G.runeSocketModal && G.runeSocketModal.open) {
    return rRuneSocketModal();
  }
  // If combine modal is open, render that instead
  if (G.runeCombineModal && G.runeCombineModal.open) {
    return rRuneCombineModal();
  }

  let h='<div style="padding:16px;"><h2 class="st">💎 Rune Socketing</h2>';

  // Rune inventory with better visual cards
  h+='<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">Rune Inventory ('+G.runes.length+')</div>';
  if(G.runes.length===0){
    h+='<div style="font-size:12px;color:var(--text-dim);padding:12px;background:var(--bg-card);border-radius:12px;margin-bottom:16px;">No runes yet. Defeat enemies in Lv 10+ zones to find them.</div>';
  }else{
    h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;">';
    for(let i=0;i<G.runes.length;i++){
      const r=G.runes[i];
      const rarityGlow = r.r==='rare'?'0 0 8px '+r.color+'40':r.r==='epic'?'0 0 12px '+r.color+'60':'';
      h+='<div class="rune-item" data-ri="'+i+'" style="background:var(--bg-card);border:2px solid '+r.color+';border-radius:12px;padding:10px 8px;text-align:center;cursor:pointer;user-select:none;box-shadow:'+rarityGlow+';transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.transform=\'none\'">';
      h+='<div style="font-size:24px;margin-bottom:4px;">'+r.icon+'</div>';
      h+='<div style="font-size:11px;font-weight:700;color:'+r.color+';">'+r.name+'</div>';
      h+='<div style="font-size:10px;color:var(--text-dim);margin-top:4px;">';
      const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[r.stat] || r.stat;
      h+= statLabel + ' +' + r.val;
      if(r.pct) h+=' ('+Math.floor(r.pct*100)+'%)';
      h+='</div>';
      h+='<div style="font-size:9px;color:var(--disabled);margin-top:2px;text-transform:uppercase;">'+r.r+'</div>';
      h+='</div>';
    }
    h+='</div>';

    // Combine button — now opens modal
    h+='<button id="btn-combine" style="width:100%;padding:12px;border-radius:12px;border:2px solid var(--accent);background:linear-gradient(135deg,var(--accent),#6d28d9);color:white;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:16px;box-shadow:0 2px 8px var(--shadow-accent);transition:transform 0.2s;" onmouseover="this.style.transform=\'translateY(-1px)\'" onmouseout="this.style.transform=\'none\'">';
    h+='🔮 Combine Runes';
    h+='</button>';
  }

  // Socketable gear with stat preview
  h+='<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">Socketable Gear</div>';
  const socketable = G.p.inv.filter(it => it.sockets && it.sockets.length > 0);
  if(socketable.length===0){
    h+='<div style="font-size:12px;color:var(--text-dim);padding:12px;background:var(--bg-card);border-radius:12px;">No socketed gear. Lv 10+ items have sockets.</div>';
  }else{
    h+='<div style="display:flex;flex-direction:column;gap:10px;">';
    for(let i=0;i<G.p.inv.length;i++){
      const it=G.p.inv[i];
      if(!it.sockets) continue;

      // Calculate current socket stats
      let currentStats = [];
      if (it.socketStats) {
        for (let k in it.socketStats) {
          if (k.endsWith('Pct')) continue;
          const label = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[k] || k;
          currentStats.push(label + '+' + it.socketStats[k]);
        }
      }

      h+='<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;transition:border-color 0.2s;" onmouseover="this.style.borderColor=\'var(--accent)\'" onmouseout="this.style.borderColor=\'var(--border)\'">';
      h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
      h+='<div style="font-weight:700;font-size:14px;color:'+rc(it.r)+';">'+it.n+'</div>';
      h+='<div style="font-size:10px;color:var(--text-dim);background:var(--bg-hover);padding:2px 8px;border-radius:8px;">iLvl '+it.ilvl+'</div>';
      h+='</div>';

      // Socket display with better visuals
      h+='<div style="display:flex;gap:8px;margin-bottom:10px;">';
      for(let s=0;s<it.sockets.length;s++){
        const socket = it.sockets[s];
        if(socket){
          h+='<div style="flex:1;background:'+socket.color+'15;border:2px solid '+socket.color+';border-radius:10px;padding:8px;text-align:center;">';
          h+='<div style="font-size:20px;">'+socket.icon+'</div>';
          h+='<div style="font-size:9px;font-weight:600;color:'+socket.color+';">'+socket.name.replace('Rune of ','')+'</div>';
          h+='</div>';
        }else{
          h+='<div style="flex:1;background:var(--bg-hover);border:2px dashed var(--disabled);border-radius:10px;padding:8px;text-align:center;opacity:0.6;">';
          h+='<div style="font-size:20px;color:var(--disabled);">○</div>';
          h+='<div style="font-size:9px;color:var(--disabled);">Empty</div>';
          h+='</div>';
        }
      }
      h+='</div>';

      // Current socket stats summary
      if(currentStats.length > 0){
        h+='<div style="font-size:10px;color:var(--success);margin-bottom:8px;padding:6px 10px;background:#22c55e10;border-radius:8px;">✨ Socketed: '+currentStats.join(' · ')+'</div>';
      }

      // Socket action buttons
      h+='<div style="display:flex;gap:6px;flex-wrap:wrap;">';
      for(let s=0;s<it.sockets.length;s++){
        if(!it.sockets[s]){
          h+='<button class="socket-btn" data-ii="'+i+'" data-si="'+s+'" style="flex:1;padding:8px 10px;border-radius:10px;border:1px dashed var(--accent);background:transparent;color:var(--accent);font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;">💎 Socket</button>';
        }else{
          h+='<button class="unsocket-btn" data-ii="'+i+'" data-si="'+s+'" style="flex:1;padding:8px 10px;border-radius:10px;border:1px solid '+it.sockets[s].color+';background:'+it.sockets[s].color+'15;color:'+it.sockets[s].color+';font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;">'+it.sockets[s].icon+' Remove</button>';
        }
      }
      h+='</div></div>';
    }
    h+='</div>';
  }

  h+='</div>';
  return h;
}

// NEW: Rune Socket Selection Modal
function rRuneSocketModal() {
  const { itemIndex, slotIndex } = G.runeSocketModal;
  const item = G.p.inv[itemIndex];
  if (!item) return '<div>Error</div>';

  let h = '<div style="padding:16px;">';
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">';
  h += '<button class="rune-modal-back" style="background:none;border:none;color:var(--accent);font-size:20px;cursor:pointer;padding:4px;">←</button>';
  h += '<h2 class="st" style="margin:0;">💎 Socket Rune</h2>';
  h += '</div>';

  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;">';
  h += '<div style="font-weight:700;font-size:14px;color:'+rc(item.r)+';">'+item.n+'</div>';
  h += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">Slot '+(slotIndex+1)+' of '+item.sockets.length+'</div>';

  // Show current socket stats on this item
  let currentStats = [];
  if (item.socketStats) {
    for (let k in item.socketStats) {
      if (k.endsWith('Pct')) continue;
      const label = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[k] || k;
      currentStats.push(label + '+' + item.socketStats[k]);
    }
  }
  if(currentStats.length > 0){
    h += '<div style="font-size:10px;color:var(--success);margin-top:8px;">Current sockets: '+currentStats.join(' · ')+'</div>';
  }
  h += '</div>';

  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">Choose a Rune ('+G.runes.length+' available)</div>';

  if(G.runes.length===0){
    h += '<div style="text-align:center;padding:20px;color:var(--text-dim);">No runes available!</div>';
  }else{
    h += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">';
    for(let i=0;i<G.runes.length;i++){
      const r=G.runes[i];
      const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[r.stat] || r.stat;

      // Calculate preview: what will this rune add?
      const currentVal = item.socketStats && item.socketStats[r.stat] ? item.socketStats[r.stat] : 0;
      const newVal = currentVal + r.val;

      h += '<button class="rune-select-btn" data-ri="'+i+'" style="background:var(--bg-card);border:2px solid '+r.color+';border-radius:14px;padding:14px;text-align:left;cursor:pointer;transition:all 0.2s;">';
      h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">';
      h += '<span style="font-size:28px;">'+r.icon+'</span>';
      h += '<div style="flex:1;">';
      h += '<div style="font-size:13px;font-weight:700;color:'+r.color+';">'+r.name+'</div>';
      h += '<div style="font-size:9px;color:var(--disabled);text-transform:uppercase;">'+r.r+'</div>';
      h += '</div>';
      h += '</div>';

      // Stat preview with before/after
      h += '<div style="background:var(--bg-hover);border-radius:8px;padding:8px 10px;margin-bottom:6px;">';
      h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:2px;">'+statLabel+'</div>';
      h += '<div style="display:flex;align-items:center;gap:6px;">';
      h += '<span style="font-size:11px;color:var(--text-dim);">'+currentVal+'</span>';
      h += '<span style="color:var(--success);font-size:12px;">→</span>';
      h += '<span style="font-size:14px;font-weight:700;color:'+r.color+';">'+newVal+'</span>';
      if(r.pct) h += '<span style="font-size:10px;color:var(--success);">(+'+Math.floor(r.pct*100)+'%)</span>';
      h += '</div></div>';

      h += '<div style="font-size:10px;color:var(--accent);text-align:center;font-weight:600;">Tap to Socket</div>';
      h += '</button>';
    }
    h += '</div>';
  }

  h += '</div>';
  return h;
}

// NEW: Rune Combine Modal
function rRuneCombineModal() {
  const selected = G.runeCombineModal.selected;
  const preview = getCombinePreview();

  let h = '<div style="padding:16px;">';
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">';
  h += '<button class="rune-modal-back" style="background:none;border:none;color:var(--accent);font-size:20px;cursor:pointer;padding:4px;">←</button>';
  h += '<h2 class="st" style="margin:0;">🔮 Combine Runes</h2>';
  h += '</div>';

  h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Select 3 runes of the same type to combine into a stronger version.</div>';

  // Selected runes display
  h += '<div style="display:flex;gap:8px;margin-bottom:16px;">';
  for(let i=0;i<3;i++){
    if(selected[i] !== undefined && G.runes[selected[i]]){
      const r = G.runes[selected[i]];
      h += '<div style="flex:1;background:'+r.color+'15;border:2px solid '+r.color+';border-radius:12px;padding:12px;text-align:center;">';
      h += '<div style="font-size:28px;">'+r.icon+'</div>';
      h += '<div style="font-size:10px;font-weight:600;color:'+r.color+';">'+r.name+'</div>';
      h += '</div>';
    }else{
      h += '<div style="flex:1;background:var(--bg-hover);border:2px dashed var(--disabled);border-radius:12px;padding:12px;text-align:center;opacity:0.5;">';
      h += '<div style="font-size:28px;color:var(--disabled);">?</div>';
      h += '<div style="font-size:10px;color:var(--disabled);">Slot '+(i+1)+'</div>';
      h += '</div>';
    }
  }
  h += '</div>';

  // Preview result
  if(preview && !preview.error){
    h += '<div style="background:linear-gradient(135deg,#7c3aed15,#a78bfa15);border:2px solid var(--accent);border-radius:14px;padding:16px;margin-bottom:16px;text-align:center;">';
    h += '<div style="font-size:11px;color:var(--accent-light);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Result Preview</div>';
    h += '<div style="font-size:36px;margin-bottom:4px;">'+preview.icon+'</div>';
    h += '<div style="font-size:16px;font-weight:700;color:var(--accent-light);">'+preview.name+'</div>';
    h += '<div style="font-size:11px;color:var(--success);margin-top:4px;">';
    const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[preview.stat] || preview.stat;
    h += statLabel + ' +' + preview.val;
    if(preview.pct) h += ' (+'+Math.floor(preview.pct*100)+'%)';
    h += '</div>';
    h += '<div style="font-size:10px;color:var(--gold);margin-top:4px;">'+preview.r.toUpperCase()+'</div>';
    h += '</div>';

    h += '<button id="btn-confirm-combine" style="width:100%;padding:14px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--accent),#6d28d9);color:white;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 2px 12px var(--shadow-accent);">✨ Combine!</button>';
  }else if(preview && preview.error){
    h += '<div style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:center;color:var(--danger);font-size:13px;">'+preview.error+'</div>';
  }else{
    h += '<div style="background:var(--bg-hover);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:16px;text-align:center;color:var(--text-dim);font-size:13px;">Select 3 matching runes to see the result</div>';
  }

  // Rune grid for selection
  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin:16px 0 10px;">Your Runes</div>';
  if(G.runes.length===0){
    h += '<div style="text-align:center;padding:20px;color:var(--text-dim);">No runes to combine.</div>';
  }else{
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">';
    for(let i=0;i<G.runes.length;i++){
      const r=G.runes[i];
      const isSelected = selected.includes(i);
      const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[r.stat] || r.stat;

      h += '<button class="rune-combine-select" data-ri="'+i+'" style="background:'+(isSelected?r.color+'30':'var(--bg-card)')+';border:2px solid '+(isSelected?r.color:'var(--border)')+';border-radius:12px;padding:10px 6px;text-align:center;cursor:pointer;transition:all 0.2s;position:relative;">';
      if(isSelected){
        h += '<div style="position:absolute;top:-6px;right:-6px;background:var(--accent);color:white;width:18px;height:18px;border-radius:50%;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;">✓</div>';
      }
      h += '<div style="font-size:22px;margin-bottom:4px;">'+r.icon+'</div>';
      h += '<div style="font-size:10px;font-weight:600;color:'+(isSelected?r.color:'var(--text)')+';">'+r.name.replace('Rune of ','')+'</div>';
      h += '<div style="font-size:9px;color:var(--text-dim);margin-top:2px;">'+statLabel+'+'+r.val+'</div>';
      h += '</button>';
    }
    h += '</div>';
  }

  h += '</div>';
  return h;
}

function rTalents(){
  let h='<div style="padding:16px;"><h2 class="st">🌟 Planar Talents</h2>';
  h+='<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;text-align:center;">Unlock every 2 levels starting at 16</div>';
  h+='<div style="display:flex;flex-direction:column;gap:10px;">';
  for(let t of TALENTS){
    const unlocked=G.talents.includes(t.id);
    const canUnlock=G.p.lvl>=t.lv;
    h+='<div style="background:var(--bg-card);border:2px solid '+(unlocked?'#22c55e':canUnlock?'#a78bfa':'#6b7280')+';border-radius:14px;padding:14px;opacity:'+(canUnlock?'1':'0.5')+';">';
    h+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">';
    h+='<span style="font-size:24px;">'+t.icon+'</span>';
    h+='<div style="flex:1;"><div style="font-weight:700;font-size:15px;color:'+(unlocked?'#22c55e':canUnlock?'var(--text)':'var(--text-dim)')+';">'+(unlocked?'✅ ':'')+t.name+'</div>';
    h+='<div style="font-size:11px;color:var(--text-dim);">Lv.'+t.lv+'</div></div>';
    h+='</div>';
    h+='<div style="font-size:12px;color:var(--text-dim);line-height:1.4;">'+t.desc+'</div>';
    if(unlocked) h+='<div style="font-size:11px;color:#22c55e;margin-top:6px;font-weight:600;">✨ ACTIVE</div>';
    else if(!canUnlock) h+='<div style="font-size:11px;color:var(--danger);margin-top:6px;">🔒 Requires Level '+t.lv+'</div>';
    h+='</div>';
  }
  h+='</div>';
  h+='<div style="margin-top:16px;font-size:11px;color:var(--text-dim);text-align:center;">'+G.talents.length+'/'+TALENTS.length+' talents unlocked</div>';
  h+='</div>';
  return h;
}

// === REPLACE your rGrindRoom function with this ===

function rGrindRoom() {
  const g = G.endlessGrind;
  let h = '<div class="content">';
  
  h += '<div class="st" style="text-align:center;">⚔️ Endless Grind Room</div>';
  
  // Stats bar
  h += '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:12px;flex-wrap:wrap;">';
  h += '<span class="mst">Wave: <b>' + g.wave + '</b></span>';
  h += '<span class="mst">Kills: <b>' + g.totalKills + '</b></span>';
  h += '<span class="mst">XP: <b>' + g.totalXp + '</b></span>';
  h += '<span class="mst" style="color:var(--gold)">Gold: <b>' + g.totalGold + '</b></span>';
  h += '</div>';
  
  // Difficulty badge
  const diffColors = { normal: '#22c55e', hard: '#f59e0b', nightmare: '#ef4444' };
  h += '<div style="text-align:center;margin-bottom:16px;">';
  h += '<span style="font-size:11px;padding:4px 12px;border-radius:10px;background:' + diffColors[g.difficulty] + '20;color:' + diffColors[g.difficulty] + ';font-weight:600;text-transform:uppercase;">';
  h += g.difficulty + ' (×' + g.difficultyMult[g.difficulty] + ')</span>';
  h += '</div>';
  
  // MAIN CONTROLS
  if (!g.active) {
    // Between waves or fresh start
    h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:12px;">';
    
    if (g.wave === 0) {
      // FRESH START - show all settings
      h += '<div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--accent-light);">Grind Settings</div>';
      
      // Tier selector
      h += '<div style="margin-bottom:12px;">';
      h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Max Zone Tier</div>';
      h += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
      const maxTier = Math.min(G.p.lvl, 23);
      for (let t = 1; t <= maxTier; t++) {
        const z = G.zones.find(zn => zn.lv === t);
        const name = z ? z.n.split(' ')[0] : 'Lv' + t;
        const isSel = g.maxZoneLevel === t;
        h += '<button onclick="setGrindTier(' + t + ')" style="padding:6px 10px;border-radius:8px;border:1px solid ' + (isSel ? 'var(--accent)' : 'var(--border)') + ';background:' + (isSel ? 'var(--accent)' : 'var(--bg-card)') + ';color:' + (isSel ? 'white' : 'var(--text)') + ';font-size:11px;cursor:pointer;">' + name + '</button>';
      }
      h += '</div></div>';
      
      // Difficulty toggle
      h += '<div style="margin-bottom:12px;">';
      h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Difficulty</div>';
      h += '<div style="display:flex;gap:6px;">';
      const diffs = ['normal', 'hard', 'nightmare'];
      for (let d of diffs) {
        const isSel = g.difficulty === d;
        h += '<button onclick="toggleGrindDifficulty()" style="flex:1;padding:8px;border-radius:8px;border:1px solid ' + (isSel ? diffColors[d] : 'var(--border)') + ';background:' + (isSel ? diffColors[d] + '20' : 'var(--bg-card)') + ';color:' + (isSel ? diffColors[d] : 'var(--text-dim)') + ';font-size:12px;font-weight:600;cursor:pointer;">' + d + '</button>';
      }
      h += '</div></div>';
      
      // Auto-next toggle
      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">';
      h += '<input type="checkbox" id="grind-autonext" ' + (g.autoNext ? 'checked' : '') + ' onchange="toggleAutoNext()" style="width:18px;height:18px;accent-color:var(--accent);">';
      h += '<label for="grind-autonext" style="font-size:13px;cursor:pointer;">Auto-start next wave</label>';
      h += '</div>';
      
      h += '<button onclick="enterGrindRoom()" class="abtn" style="width:100%;">Start Grinding</button>';
      
        } else {
      // BETWEEN WAVES - show Next Wave, Stop, and Leave options
      h += '<div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--accent-light);">Wave ' + g.wave + ' Complete!</div>';
      h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ready for the next wave?</div>';
      
      h += '<button onclick="startGrindWave()" class="abtn" style="width:100%;margin-bottom:8px;">▶️ Next Wave</button>';
      h += '<button onclick="exitGrindRoom()" style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:14px;font-weight:600;cursor:pointer;margin-bottom:8px;">⏹ Stop & Collect Loot</button>';
      
      // NEW: Leave and reset button
      h += '<button onclick="leaveAndResetGrind()" style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--text-dim);background:transparent;color:var(--text-dim);font-size:13px;font-weight:600;cursor:pointer;">🚪 Leave Room & Reset (Start Fresh)</button>';
    }
 
    h += '</div>';
    
  } else {
    // ACTIVE COMBAT - show STOP button
    h += '<div style="background:var(--bg-card);border:2px solid var(--danger);border-radius:14px;padding:16px;margin-bottom:12px;text-align:center;">';
    h += '<div style="font-size:13px;color:var(--text-dim);margin-bottom:10px;">Wave ' + g.wave + ' in progress...</div>';
    h += '<button onclick="exitGrindRoom()" style="width:100%;padding:14px;border-radius:12px;border:2px solid var(--danger);background:var(--danger);color:white;font-size:15px;font-weight:700;cursor:pointer;">⏹ STOP GRIND</button>';
    h += '<div style="font-size:11px;color:var(--text-dim);margin-top:8px;">Returns to camp with current loot</div>';
    h += '</div>';
  }
  
  // Session summary (always visible)
  if (g.wave > 0) {
    h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">📊 This Session</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;">';
    h += '<div>Started: <span style="color:var(--text-dim);">' + new Date(g.sessionStart).toLocaleTimeString() + '</span></div>';
    h += '<div>Waves: <span style="color:var(--accent-light);">' + g.wave + '</span></div>';
    h += '<div>Total Kills: <span style="color:var(--accent-light);">' + g.totalKills + '</span></div>';
    h += '<div>Total XP: <span style="color:var(--xp);">' + g.totalXp + '</span></div>';
    h += '<div>Total Gold: <span style="color:var(--gold);">' + g.totalGold + '</span></div>';
    h += '<div>Avg/ Wave: <span style="color:var(--text-dim);">' + (g.wave > 0 ? Math.floor(g.totalXp / g.wave) : 0) + ' XP</span></div>';
    h += '</div></div>';
  }
  
  h += '</div>';
  return h;
}

function setGrindTier(tier) {
  G.endlessGrind.maxZoneLevel = tier;
  lg('📍 Max tier set to ' + tier);
  render();
}


function rMenu(){
  const items=[
    {i:'⚔️',l:'Adventure',d:'Explore zones and fight',a:'explore'},
    {i:'👥',l:'Party',d:'Manage companions',a:'party'},
    {i:'✨',l:'Skills',d:'View mage abilities',a:'skills'},
    {i:'⚒️',l:'Crafting',d:'Brew potions, forge gear',a:'craft'},
    {i:'📜',l:'Quests',d:'View active quests',a:'quest'},
    {i:'🎒',l:'Inventory',d:'Manage items',a:'inventory'},
    {i:'📖',l:'Bestiary',d:'Catalogue of defeated foes',a:'bestiary'},
    {i:'🏆',l:'Achievements',d:'Track your milestones',a:'achievements'},
    {i:'🌳',l:'Skill Trees',d:'Choose your specialization',a:'skilltree'},
    {i:'🌟',l:'Talents',d:'View planar talents (Lv.16+)',a:'talents'},
    {i:'💎',l:'Runes',d:'Socket runes into gear (Lv.20+)',a:'runes'},
    {i:'📖',l:'Journal',d:'Chronicles of your journey',a:'journal'},
    {i:'🌀',l:'Grind Room',d:'Endless wave battles',a:'grind_room'},
    {i:'🧳',l:'Traders',d:'Buy from wandering merchants',a:'npc'},
    {i:'🧘',l:'Focus Mode',d:'5–25 min ADHD timer',a:'focus'},
    {i:'💤',l:'Rest',d:'Find a safe place to rest',a:'rest'},
  ];
  let h='<div class="grid2">';
  for(let m of items)h+='<div class="card" data-a="'+m.a+'"><div class="cicon">'+m.i+'</div><div class="clabel">'+m.l+'</div><div class="cdesc">'+m.d+'</div></div>';
  h+='</div>';
  // Theme toggle row
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  h+='<div style="margin-top:12px;text-align:center;">';
  h+='<button onclick="toggleTheme()" style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:10px 20px;color:var(--text);font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;">';
  h+= isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
  h+='</button></div>';
  h+='<div style="margin-top:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;">';
  h+='<h3 style="font-size:14px;margin-bottom:10px;color:var(--accent-light);">Save Data</h3>';
  h+='<div style="display:flex;gap:8px;flex-wrap:wrap;">';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;" id="btn-save">Save Now</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:#374151;" id="btn-export">Export</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:#374151;" id="btn-import">Import</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:var(--danger);" id="btn-reset">Reset</button>';
  h+='</div>';
  h+='<div style="margin-top:8px;font-size:11px;color:var(--text-dim);">Auto-saves every 30 seconds</div>';
  h+='</div>';
  return h;
}

function rExp(){
  let h='<div class="explore-view"><h2 class="st">Adventure Zones</h2><div class="zlist">';
  for(let i=0;i<G.zones.length;i++){
    const z=G.zones[i],lk=G.p.lvl<z.lv;
    const dc=z.dg=='low'?'#22c55e':z.dg=='medium'?'#eab308':z.dg=='high'?'#f97316':z.dg=='very high'?'#ef4444':'#a855f7';
    const hazard = G.zoneHazards[z.n];
    h+='<div class="zcard '+(lk?'locked':'')+'" data-i="'+i+'"><div class="zh"><span class="zn">'+z.n+'</span><span class="zl">Lv.'+z.lv+(lk?' 🔒':'')+'</span></div><div class="zd">'+z.d+'</div>';
    if(hazard){
      h+='<div style="font-size:10px;color:#f59e0b;margin-bottom:6px;">⚠️ Hazard: '+hazard.desc+'</div>';
    }
    h+='<div class="zm"><span class="db" style="background:'+dc+'20;color:'+dc+'">'+z.dg+'</span><span class="xb">'+z.xp+' XP</span></div></div>';
  }
  h+='</div></div>'; return h;
}

function rCbt() {
  let h = '<div class="combat-view"><h2 class="st">' + (G.currentBoss ? '⚔️ BOSS FIGHT' : 'Combat') + '</h2>';
  
  const synDesc = getSynergyDesc();
  if (synDesc) {
    h += '<div style="background:#7c3aed15;border:1px solid var(--accent);border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:var(--accent-light);">';
    h += '✨ ' + synDesc + '</div>';
  }

  // Planar Resonance Indicator (Phase 2)
  const zone = G.zones.find(z => z.en.includes(G.cbt.en[0]?.n));
  if (zone && zone.elem) {
    const resStatus = getResonanceStatus(zone.n);
    h += '<div style="background:' + resStatus.color + '15;border:1px solid ' + resStatus.color + ';border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:' + resStatus.color + ';">';
    h += resStatus.icon + ' ' + resStatus.text + '</div>';
  }

  // Dimensional Instability Indicator (Phase 2)
  const riftStatus = getRiftStatus();
  if (riftStatus) {
    h += '<div style="background:' + riftStatus.color + '15;border:1px solid ' + riftStatus.color + ';border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:' + riftStatus.color + ';">';
    h += riftStatus.icon + ' ' + riftStatus.name + ': ' + riftStatus.desc + ' (' + riftStatus.fightsLeft + ' fights left)</div>';
  }
  
  h += '<button id="btn-auto" style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid ' + (G.cbt.autoCombat ? '#22c55e' : 'var(--disabled)') + ';background:' + (G.cbt.autoCombat ? '#22c55e15' : 'transparent') + ';color:' + (G.cbt.autoCombat ? '#22c55e' : 'var(--text-dim)') + ';font-size:12px;font-weight:600;cursor:pointer;margin-bottom:12px;user-select:none;">';
  h += (G.cbt.autoCombat ? '🤖 AUTO ON — Tap to take control' : '🤖 Auto-Combat — Let AI fight') + '</button>';

  // Potion button
  const potions = getCombatPotions();
  const usablePotions = potions.filter(p => {
    if (p.t === 'revive') return getDeadParty().length > 0;
    return true;
  });
  h += '<button onclick="togglePotionMenu()" style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid ' + (usablePotions.length > 0 ? '#22c55e' : 'var(--disabled)') + ';background:' + (usablePotions.length > 0 ? '#22c55e15' : 'transparent') + ';color:' + (usablePotions.length > 0 ? '#22c55e' : 'var(--disabled)') + ';font-size:12px;font-weight:600;cursor:' + (usablePotions.length > 0 ? 'pointer' : 'not-allowed') + ';margin-bottom:12px;user-select:none;">';
  h += (G.potionMenu ? '❌ Close Potion Bag' : '🧪 Use Potion (' + usablePotions.length + ' usable)') + '</button>';

  // Potion menu
  if (G.potionMenu && potions.length > 0) {
    h += '<div style="background:var(--bg-card);border:1px solid #22c55e;border-radius:12px;padding:10px;margin-bottom:12px;">';
    h += '<div style="font-size:11px;color:#22c55e;margin-bottom:8px;">🧪 Quick Potion Bag</div>';
    h += '<div style="display:flex;flex-direction:column;gap:6px;">';
    for (let i = 0; i < G.p.inv.length; i++) {
      const it = G.p.inv[i];
      // Regular potions (heal/mana)
      if ((it.t === 'pot' || it.t === 'food' || it.t === 'drink') && (it.eff === 'heal' || it.eff === 'mana')) {
        const isHeal = it.eff === 'heal';
        const icon = isHeal ? '❤️' : '💧';
        const color = isHeal ? '#ef4444' : '#3b82f6';
        const current = isHeal ? G.p.hp + '/' + G.p.mhp : G.p.mp + '/' + G.p.mmp;
        const full = isHeal ? G.p.hp >= G.p.mhp : G.p.mp >= G.p.mmp;
        h += '<button onclick="usePotionInCombat(' + i + ')" style="padding:10px 14px;border-radius:10px;border:1px solid ' + color + ';background:' + color + '15;color:' + (full ? 'var(--disabled)' : color) + ';font-size:12px;font-weight:600;cursor:' + (full ? 'not-allowed' : 'pointer') + ';display:flex;justify-content:space-between;align-items:center;opacity:' + (full ? '0.5' : '1') + ';">';
        h += '<span>' + icon + ' ' + it.n + (it.q > 1 ? ' x' + it.q : '') + '</span>';
        h += '<span>' + (full ? 'FULL' : '+' + it.v + ' ' + (isHeal ? 'HP' : 'MP')) + ' · ' + current + '</span>';
        h += '</button>';
      }
      // Revive items (Phoenix Feather, etc.)
      else if (it.t === 'revive') {
        const deadMembers = getDeadParty();
        const hasDead = deadMembers.length > 0;
        const color = hasDead ? '#f59e0b' : 'var(--disabled)';
        const icon = '🔥';
        h += '<button onclick="usePotionInCombat(' + i + ')" style="padding:10px 14px;border-radius:10px;border:1px solid ' + color + ';background:' + color + '15;color:' + color + ';font-size:12px;font-weight:600;cursor:' + (hasDead ? 'pointer' : 'not-allowed') + ';display:flex;justify-content:space-between;align-items:center;opacity:' + (hasDead ? '1' : '0.5') + ';">';
        h += '<span>' + icon + ' ' + it.n + (it.q > 1 ? ' x' + it.q : '') + '</span>';
        h += '<span>' + (hasDead ? 'Revive 50% HP' : 'No one to revive') + ' · ' + deadMembers.length + ' down</span>';
        h += '</button>';
      }
    }
    h += '</div></div>';
  }
  
  // Reuse zone variable from resonance check above
  if (zone && G.zoneHazards[zone.n]) {
    const haz = G.zoneHazards[zone.n];
    h += '<div style="background:#f59e0b15;border:1px solid #f59e0b;border-radius:12px;padding:8px;margin-bottom:12px;font-size:11px;color:#f59e0b;">';
    h += '⚠️ Zone Hazard: ' + haz.name + ' — ' + haz.desc + '</div>';
  }
  
  if (G.currentBoss) {
    h += '<div style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:10px;margin-bottom:12px;font-size:12px;color:var(--danger);">';
    h += '🔥 ' + G.currentBoss.desc + '</div>';
  }
  
  const playerAC = getPlayerAC();
  const eqStats = getEquippedStats();
  h += '<div style="display:flex;justify-content:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;">';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">AC </span><span style="font-weight:700;color:var(--accent-light);">' + playerAC + '</span>';
  if(eqStats.def > 0) h += '<span style="font-size:9px;color:var(--success);"> +' + eqStats.def + 'eq</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">PROF </span><span style="font-weight:700;color:var(--gold);">+' + DICE.proficiencyBonus(G.p.lvl) + '</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">ATK </span><span style="font-weight:700;color:var(--hp);">+' + (eqStats.atk + (G.p.eq.weapon?.atk||0)) + '</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">CRIT </span><span style="font-weight:700;color:var(--danger);">' + Math.floor(getTotalCritChance() * 100) + '%</span>';
  if(eqStats.critChance > 0) h += '<span style="font-size:9px;color:var(--success);"> +' + Math.floor(eqStats.critChance*100) + '%eq</span>';
  h += '</div>';
  h += '</div>';
  
  h += '<div class="erow">';
  for (let i = 0; i < G.cbt.en.length; i++) {
    const e = G.cbt.en[i], d = e.hp <= 0, s = G.cbt.tg == i && !d ? 'sel' : '';
    const immuneFire = ['Fire Imp', 'Lava Slug', 'Ash Wraith'].includes(e.n);
    const immuneIce = ['Ice Elemental', 'Frost Wolf', 'Frozen Knight'].includes(e.n);
    const isBoss = e.mechanic ? true : false;
    const enemyAC = getEnemyAC(e);
    
    h += '<div class="ecard ' + (d ? 'dead' : '') + ' ' + s + '" data-i="' + i + '" style="' + (isBoss ? 'border-color:var(--danger);box-shadow:0 0 10px #ef444440;' : '') + '">';
    h += '<div class="eicon">' + (d ? '💀' : ee(e.n)) + '</div>';
    h += '<div class="ename">' + e.n + (isBoss ? ' 👑' : '') + '</div>';
    
    if (!d) {
      h += '<div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">AC ' + enemyAC + '</div>';
    }
    
    if (!d && e.elem && e.elem !== 'none') {
      const elemIcon = e.elem === 'fire' ? '🔥' : e.elem === 'ice' ? '❄️' : e.elem === 'lightning' ? '⚡' : e.elem === 'void' ? '🌑' : '✦';
      h += '<div style="font-size:10px;color:#f59e0b;margin-top:2px;">' + elemIcon + ' ' + e.elem + '</div>';
    }
    
    if (!d && e.status && e.status.length > 0) {
      const statusIcons = e.status.map(s => s.type === 'burn' ? '🔥' : s.type === 'poison' ? '☠️' : s.type === 'shock' ? '⚡' : '✦').join('');
      h += '<div style="font-size:10px;color:var(--danger);margin-top:2px;">' + statusIcons + ' (' + e.status[0].turns + 't)</div>';
    }
    
    if (!d && (immuneFire || immuneIce)) {
      h += '<div class="e-immune">' + (immuneFire ? '🔥 Fire Immune' : (immuneIce ? '❄️ Ice Immune' : '')) + '</div>';
    }
    
    if (!d && e.mechanic === 'resurrect') {
      h += '<div style="font-size:10px;color:var(--danger);">💀 Lives: ' + (e.resurrectCount + 1) + '</div>';
    }
    
    if (!d && e.mechanic === 'phase') {
      h += '<div style="font-size:10px;color:var(--accent-light);">💎 Phase ' + e.currentPhase + '/' + e.phases + '</div>';
    }
    
    h += (d ? '<div class="dt">DEFEATED</div>' : '<div class="hps"><div class="bf bf-hp" style="width:' + ((e.hp / e.mhp) * 100) + '%"></div></div><div class="hpt">' + e.hp + '/' + e.mhp + '</div>') + '</div>';
  }
  h += '</div>';
  
  h += '<div class="pstat"><div class="mst"><span class="md" style="background:#7c3aed"></span>San ' + G.p.hp + '/' + G.p.mhp + ' AC' + playerAC + '</div>';
  for (let p of G.party) {
    if (p.on) {
      h += '<div class="mst"><span class="md" style="background:' + p.col + '"></span>' + p.n + ' ' + p.hp + '/' + p.mhp + '</div>';
    }
  }
  h += '</div>';
  
  h += '<div class="skills"><h3>Select Skill</h3><div class="slist">';
  
  const basicSel = G.cbt.sk === -1 && !G.cbt.autoCombat ? 'sel' : '';
  h += '<div class="sbtn ' + basicSel + '" data-i="-1" ' + (G.cbt.autoCombat ? 'style="opacity:0.4;cursor:not-allowed;"' : '') + '>';
  h += '<div class="sn">🪄 Staff Swing</div>';
  h += '<div class="sc">0 MP · Physical · 1d4 + STR</div>';
  h += '<div class="sd">Swing your staff when your spell slots are spent.</div>';
  h += '</div>';
  
    const ls = G.p.skills.filter(s => s.on);
  for (let i = 0; i < ls.length; i++) {
    const s = ls[i];
    const costLabel = typeof getSpellCostLabel === 'function'
      ? getSpellCostLabel(s)
      : (s.c + ' MP');
    const u = G.p.mp >= s.c && !G.cbt.autoCombat;
    const sel = G.cbt.sk == i && !G.cbt.autoCombat ? 'sel' : '';
    const critPct = Math.floor(getTotalCritChance() * 100);
    const highTier = Number(s.slotTier || 1) >= 4;
    const nameStyle = highTier ? ' style="color:#ef4444;font-weight:700;"' : '';
    
    h += '<div class="sbtn ' + (u ? '' : 'dis') + ' ' + sel + '" data-i="' + i + '" ' +
         (G.cbt.autoCombat ? 'style="opacity:0.4;cursor:not-allowed;"' : '') + '>';
    h += '<div class="sn"' + nameStyle + '>' + (s.buff ? '🛡️' : '⚡') + ' ' + s.n + '</div>';
    h += '<div class="sc">' + costLabel + ' · ' + (s.dmg || 'Buff') + ' · ' +
         critPct + '% Crit' + (G.cbt.autoCombat ? ' · 🤖 AUTO' : '') + '</div>';
    h += '<div class="sd">' + s.d + '</div>';
    if (s.elem) {
      const weakAgainst = s.elem === 'fire' ? 'Ice' : s.elem === 'ice' ? 'Fire' : s.elem === 'lightning' ? 'Void' : '';
      if (weakAgainst) {
        h += '<div style="font-size:10px;color:var(--success);">Strong vs: ' + weakAgainst + '</div>';
      }
    }
    h += '</div>';
  }
  h += '</div>';
  
  const isBasic = G.cbt.sk === -1;
  const sk = isBasic ? null : ls[G.cbt.sk];
  const ca = isBasic 
    ? (G.cbt.tg >= 0 && !G.cbt.autoCombat) 
    : (sk && G.p.mp >= sk.c && !G.cbt.autoCombat);
  const si = isBasic ? -1 : G.p.skills.indexOf(sk);
  
  h += '<button class="abtn ' + (ca ? '' : 'dis') + '" data-si="' + si + '" data-ti="' + G.cbt.tg + '" ' + (G.cbt.autoCombat ? 'disabled style="opacity:0.4;"' : '') + '>';
  h += (isBasic ? '🪄 Staff Swing' : 'Cast ' + (sk ? sk.n : '...')) + '</button>';
  h += '<button class="fbtn" ' + (G.cbt.autoCombat ? 'disabled style="opacity:0.4;"' : '') + '>Flee</button>';
 
   // === GRIND ROOM WAVE CONTROLS ===
  if (G.endlessGrind.active) {
    h += '<div style="background:var(--bg-card);border:2px solid var(--accent);border-radius:14px;padding:14px;margin-top:16px;text-align:center;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">⚔️ Grind Room · Wave ' + G.endlessGrind.wave + '</div>';
    
    if (G.endlessGrind.autoNext) {
      h += '<div style="font-size:12px;color:var(--success);">🤖 Auto-next: ON</div>';
    } else {
      h += '<button onclick="startGrindWave()" class="abtn" style="width:100%;margin-bottom:8px;">▶️ Next Wave</button>';
    }
    
    h += '<button onclick="exitGrindRoom()" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:13px;font-weight:600;cursor:pointer;">⏹ Stop & Exit</button>';
    h += '</div>';
  }
  // === END GRIND ROOM WAVE CONTROLS ===

  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:12px;margin-top:12px;">';
  h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">🎲 D&D Combat Rules</div>';
  h += '<div style="font-size:10px;color:var(--text-dim);line-height:1.6;">';
  h += '• Attack: d20 + PROF(+' + DICE.proficiencyBonus(G.p.lvl) + ') + Ability Mod vs Target AC<br>';
  h += '• Natural 20 = Critical Hit (double dice)<br>';
  h += '• Natural 1 = Critical Miss (auto-fail)<br>';
  h += '• Advantage: Roll 2d20, keep higher<br>';
  h += '• Your AC: ' + playerAC + ' | INT Mod: ' + (DICE.abilityMod(G.p.stats.int) >= 0 ? '+' : '') + DICE.abilityMod(G.p.stats.int);
  h += '</div></div>';
  
  h += '</div></div>';
  return h;
}


function rParty(){
  let h='<div class="party-view"><h2 class="st">Party</h2>';
  const activeSyns = getActiveSynergies();
  if(activeSyns.length > 0){
    h += '<div style="background:var(--bg-card);border:1px solid var(--accent);border-radius:14px;padding:12px;margin-bottom:16px;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">✨ Active Synergies</div>';
    h += '<div style="display:flex;flex-direction:column;gap:8px;">';
    for(let syn of activeSyns){
      h += '<div style="display:flex;align-items:center;gap:8px;font-size:12px;">';
      h += '<span style="font-size:16px;">' + syn.icon + '</span>';
      h += '<div style="flex:1;"><div style="font-weight:600;">' + syn.name + '</div>';
      h += '<div style="font-size:10px;color:var(--text-dim);">' + syn.desc + '</div></div>';
      h += '</div>';
    }
    h += '</div></div>';
  }
  h += '<div class="plist">';
  for(let p of G.party){
    h+='<div class="pcard '+(p.on?'':'locked')+'"><div class="pava" style="background:'+p.col+'20;border-color:'+p.col+'"><span style="font-size:28px">'+(p.on?re(p.r):'🔒')+'</span></div><div class="pinfo"><div class="pn">'+p.n+' <span class="pt">'+p.t+'</span></div><div class="pr" style="color:'+p.col+'">'+p.r+'</div><div class="pd">'+p.d+'</div><div class="pb">'+p.b+'</div>'+(p.on?'<div class="ps">HP:'+p.hp+'/'+p.mhp+' ATK:'+p.atk+(p.gear&&p.gear.atk?'(+'+p.gear.atk+')':'')+' DEF:'+p.def+(p.gear&&p.gear.def?'(+'+p.gear.def+')':'')+' SPD:'+p.spd+(p.gear&&p.gear.spd?'(+'+p.gear.spd+')':'')+(getBlessDef(p)?' <span style="color:var(--rest);font-weight:700;">🐱+10 DEF</span>':'')+'</div>':'')+(G.affinity[p.n]?'<div class="affinity-bar"><div class="affinity-fill '+getAffinityColor(G.affinity[p.n].val)+'" style="width:'+(G.affinity[p.n].val/G.affinity[p.n].max*100)+'%"></div></div><div class="affinity-label">'+(G.affinity[p.n].val>=70?'💕 Close':G.affinity[p.n].val>=40?'💛 Friendly':G.affinity[p.n].val>=20?'💔 Distant':'💀 Strained')+' ('+G.affinity[p.n].val+'/'+G.affinity[p.n].max+')</div>':'')
+(G.affinityUnlocks[p.n]?'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">'+G.affinityUnlocks[p.n].map(function(u){var un=p.affinityBonuses&&p.affinityBonuses.includes(u.id);return '<span title="'+u.d+'" style="font-size:9px;padding:2px 6px;border-radius:8px;border:1px solid '+(un?'var(--xp);color:var(--xp);':'var(--border);color:var(--text-dim);opacity:0.6;')+'">'+(un?'🌟 ':'🔒 ')+u.n+' ('+u.th+')</span>';}).join('')+'</div>':'')+'</div></div>';
    // === STAGE 1: ENHANCED TRINKET/GEAR SYSTEM ===
    if(p.on || p.ul <= G.p.lvl){
      h += '<div style="background:var(--bg-hover);border:1px solid var(--border);border-radius:10px;padding:10px;margin-top:8px;">';
      h += '<div style="font-size:11px;font-weight:600;color:var(--accent-light);margin-bottom:6px;">🎁 Trinket Slot</div>';
      if(p.gear){
        // Equipped trinket display with rarity color
        const rarityColor = p.gear.r ? (p.gear.r==='epic'?'#a855f7':p.gear.r==='rare'?'#3b82f6':p.gear.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
        h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
        h += '<span style="font-size:12px;font-weight:600;color:'+rarityColor+';">' + p.gear.n + '</span>';
        h += '<button class="unequip-pgear" data-member="' + p.n + '" style="padding:4px 10px;border-radius:8px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:11px;font-weight:600;cursor:pointer;">Unequip</button>';
        h += '</div>';
        h += '<div style="font-size:10px;color:var(--text-dim);">';
        const stats = [];
        if(p.gear.atk) stats.push('+ ' + p.gear.atk + ' ATK');
        if(p.gear.def) stats.push('+ ' + p.gear.def + ' DEF');
        if(p.gear.hp) stats.push('+ ' + p.gear.hp + ' HP');
        if(p.gear.mp) stats.push('+ ' + p.gear.mp + ' MP');
        if(p.gear.spd) stats.push('+ ' + p.gear.spd + ' SPD');
        h += stats.join(' · ') + '</div>';
        if(p.gear.d) h += '<div style="font-size:10px;color:var(--accent-light);margin-top:4px;font-style:italic;">' + p.gear.d + '</div>';
      } else {
        h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Empty trinket slot</div>';
        // Show ALL equippable pgear items (not just for this member)
        const allPgear = G.p.inv.map((it, idx) => ({it, idx})).filter(x => x.it.t === 'pgear');
        if(allPgear.length > 0){
          h += '<div style="display:flex;flex-direction:column;gap:4px;">';
          for(let eq of allPgear){
            const isForThis = !eq.it.for || eq.it.for === p.n;
            const rarityColor = eq.it.r ? (eq.it.r==='epic'?'#a855f7':eq.it.r==='rare'?'#3b82f6':eq.it.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
            if(isForThis){
              h += '<button class="equip-pgear" data-member="' + p.n + '" data-idx="' + eq.idx + '" style="padding:6px 10px;border-radius:8px;border:1px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:11px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
              h += '<span style="color:'+rarityColor+';">' + eq.it.n + '</span>';
              h += '<span style="font-size:10px;color:var(--text-dim);">Equip →</span>';
              h += '</button>';
            }
          }
          // Show incompatible items as disabled
          const incompatible = allPgear.filter(x => x.it.for && x.it.for !== p.n);
          if(incompatible.length > 0){
            h += '<div style="font-size:10px;color:var(--disabled);margin-top:4px;padding-top:4px;border-top:1px solid var(--border);">Not for ' + p.n + ':</div>';
            for(let eq of incompatible){
              h += '<div style="padding:4px 10px;border-radius:8px;background:var(--nav-bg);color:var(--disabled);font-size:10px;">' + eq.it.n + ' (' + eq.it.for + ' only)</div>';
            }
          }
          h += '</div>';
        } else {
          h += '<div style="font-size:10px;color:var(--disabled);margin-top:4px;">Buy trinkets from traders like Ribald, Deidre, or Nym.</div>';
        }
      }
      h += '</div>';
    }
  }
  h+='</div></div>'; return h;
}
function rSkills(){
  let h='<div class="skills-view"><h2 class="st">Mage Skills</h2><div class="sklist">';
  for(let s of G.p.skills){
    const st=s.on?'LEARNED':'Unlocks Lv.'+s.ul;
    h+='<div class="skcard '+(s.on?'':'locked')+'"><div class="skh"><span class="ski">'+(s.buff?'🛡️':'⚡')+'</span><span class="skt">'+s.n+'</span><span class="sks">'+st+'</span></div><div class="skd"><span class="dp">'+s.c+' MP</span><span class="dp">'+(s.dmg||'Buff')+'</span></div><div class="skdsc">'+s.d+'</div></div>';
  }
  h+='</div><div class="stb"><h3>Character Stats</h3>';
  for(let [k,v] of Object.entries(G.p.stats))h+='<div class="str"><span class="stn">'+k.toUpperCase()+'</span><span class="stv">'+v+'</span></div>';
  h+='</div></div>'; return h;
}

function getEquipScore(item) {
  if (!item || !item.slot) return 0;
  let score = 0;
  if (item.atk) score += item.atk * 3;
  if (item.def) score += item.def * 3;
  if (item.int) score += item.int * 2;
  if (item.str) score += item.str * 2;
  if (item.dex) score += item.dex * 2;
  if (item.con) score += item.con * 2;
  if (item.wis) score += item.wis * 2;
  if (item.cha) score += item.cha * 1;
  if (item.fireDmg) score += item.fireDmg * 2;
  if (item.iceDmg) score += item.iceDmg * 2;
  if (item.lightDmg) score += item.lightDmg * 2;
  if (item.voidDmg) score += item.voidDmg * 2;
  if (item.arcaneDmg) score += item.arcaneDmg * 2;
  if (item.lifeSteal) score += item.lifeSteal * 10;
  if (item.critChance) score += item.critChance * 20;
  if (item.mpRegen) score += item.mpRegen * 2;
  if (item.hpRegen) score += item.hpRegen * 2;
  return score;
}

function getEquipComparison(item) {
  if (!item || !item.slot) return null;
  const slot = item.slot === 'ring' ? (G.p.eq.ring1 ? 'ring2' : 'ring1') : item.slot;
  const equipped = G.p.eq[slot];
  if (!equipped) return { better: true, arrow: '▲', color: '#22c55e', text: 'New slot' };
  const itemScore = getEquipScore(item);
  const eqScore = getEquipScore(equipped);
  if (itemScore > eqScore) return { better: true, arrow: '▲', color: '#22c55e', text: 'Upgrade' };
  if (itemScore < eqScore) return { better: false, arrow: '▼', color: '#ef4444', text: 'Downgrade' };
  return { better: false, arrow: '●', color: '#9ca3af', text: 'Sidegrade' };
}

function rInv(){
  let h='<div class="inventory-view"><h2 class="st">Inventory</h2>';

  // Equipment Stats Summary
  const eqStats = getEquippedStats();
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:12px;margin-bottom:16px;">';
  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">⚔️ Equipment Bonuses</div>';
  h += '<div style="display:flex;flex-wrap:wrap;gap:6px;font-size:10px;">';
  const statLabels = {atk:'ATK',def:'DEF',str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA',
                      fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',
                      lifeSteal:'🩸Leech',critChance:'💥Crit',mpRegen:'💧MP+',hpRegen:'💚HP+',goldFind:'💰Gold'};
  for(let k in statLabels){
    if(eqStats[k] > 0){
      const val = k === 'critChance' || k.includes('Res') ? (eqStats[k]*100)+'%' : (k.includes('Regen') ? '+'+eqStats[k]+'/turn' : '+'+eqStats[k]);
      h += '<span style="background:var(--bg-hover);padding:3px 8px;border-radius:8px;">'+statLabels[k]+' '+val+'</span>';
    }
  }
  h += '</div></div>';

  // Equipped Gear
  h+='<div class="eqs"><h3>Equipped Gear</h3><div class="eqg">';
  const slotOrder = ['weapon','armor','head','hands','feet','ring1','ring2','amulet'];
  const slotIcons = {weapon:'⚔️',armor:'🛡️',head:'🎓',hands:'🧤',feet:'👢',ring1:'💍',ring2:'💍',amulet:'📿'};
  for(let sl of slotOrder){
    const it=G.p.eq[sl];
    const slotName = EQUIPMENT_SLOTS[sl].name;
    h+='<div class="esl" style="cursor:pointer;" onclick="unequipItem(\'"+sl+"\')">';
    h+='<div class="esn">'+slotIcons[sl]+' '+slotName+'</div>';
    if(it){
      h+='<div class="eit" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      let stats = [];
      if(it.atk) stats.push('ATK+'+it.atk);
      if(it.def) stats.push('DEF+'+it.def);
      if(it.int) stats.push('INT+'+it.int);
      if(it.str) stats.push('STR+'+it.str);
      if(it.dex) stats.push('DEX+'+it.dex);
      if(it.con) stats.push('CON+'+it.con);
      if(it.wis) stats.push('WIS+'+it.wis);
      if(it.cha) stats.push('CHA+'+it.cha);
      if(it.prefix) stats.push(it.prefixData.desc);
      if(it.suffix) stats.push(it.suffixData.desc);
      h+='<div class="est">'+stats.join(' · ')+'</div>';
    }else{
      h+='<div class="ese">Empty</div>';
    }
    h+='</div>';
  }
  h+='</div></div>';

  // Categorize inventory items
  const equipItems = [];
  const consumableItems = [];
  const matItems = [];
  const otherItems = [];
  
  for(let i=0; i<G.p.inv.length; i++){
    const it = G.p.inv[i];
    const isEquip = it.slot && it.slot !== 'mat' && it.slot !== 'pot' && it.slot !== 'revive' && it.t !== 'food' && it.t !== 'drink';
    if(isEquip) equipItems.push({item: it, index: i});
    else if(it.t==='pot' || it.t==='food' || it.t==='drink' || it.t==='revive') consumableItems.push({item: it, index: i});
    else if(it.t==='mat') matItems.push({item: it, index: i});
    else otherItems.push({item: it, index: i});
  }

  // Equipment section
  if(equipItems.length > 0){
    h+='<div class="its"><h3>🎒 Equipment ('+equipItems.length+')</h3><div class="ig">';
    for(let ei of equipItems){
      const it = ei.item;
      const i = ei.index;
      const cmp = getEquipComparison(it);
      h+='<div class="ic" style="position:relative;">';
      if(cmp){
        h+='<div style="position:absolute;top:6px;right:6px;font-size:14px;color:'+cmp.color+';font-weight:700;" title="'+cmp.text+'">'+cmp.arrow+'</div>';
      }
      h+='<div class="ii">'+(EQUIPMENT_SLOTS[it.slot]?.icon || '⚔️')+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.ilvl) h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      h += getItemSocketDisplay(it);
      let statLine = [];
      if(it.atk) statLine.push('ATK+'+it.atk);
      if(it.def) statLine.push('DEF+'+it.def);
      if(it.int) statLine.push('INT+'+it.int);
      if(it.str) statLine.push('STR+'+it.str);
      if(it.dex) statLine.push('DEX+'+it.dex);
      if(it.con) statLine.push('CON+'+it.con);
      if(it.wis) statLine.push('WIS+'+it.wis);
      if(it.cha) statLine.push('CHA+'+it.cha);
      if(it.prefix) statLine.push(it.prefixData.desc);
      if(it.suffix) statLine.push(it.suffixData.desc);
      if(statLine.length > 0) h+='<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">'+statLine.join(' · ')+'</div>';
      h+='<div class="iq">'+(it.value ? it.value+'G' : '')+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-e" data-i="'+i+'">Equip</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Consumables section
  if(consumableItems.length > 0){
    h+='<div class="its"><h3>🧪 Consumables ('+consumableItems.length+')</h3><div class="ig">';
    for(let ci of consumableItems){
      const it = ci.item;
      const i = ci.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.eff==='heal') h+='<div style="font-size:10px;color:var(--success);">+'+it.v+' HP</div>';
      if(it.eff==='mana') h+='<div style="font-size:10px;color:var(--mp);">+'+it.v+' MP</div>';
      if(it.eff==='revive') h+='<div style="font-size:10px;color:var(--accent-light);">Revive '+it.v+'% HP</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-u" data-i="'+i+'">Use</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Materials section
  if(matItems.length > 0){
    h+='<div class="its"><h3>💎 Materials ('+matItems.length+')</h3><div class="ig">';
    for(let mi of matItems){
      const it = mi.item;
      const i = mi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  // Other items
  if(otherItems.length > 0){
    h+='<div class="its"><h3>📦 Other ('+otherItems.length+')</h3><div class="ig">';
    for(let oi of otherItems){
      const it = oi.item;
      const i = oi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  if(G.p.inv.length==0) h+='<div class="ei">Your pack is empty.</div>';
  h+='</div>';
  return h;
}

function rCraft(){
  let h='<div class="craft-view"><h2 class="st">Crafting</h2><div class="rlist">';
  for(let i=0;i<G.recipes.length;i++){
    const r=G.recipes[i]; let ok=true,ms='';
    for(let [mn,mq] of Object.entries(r.m)){
      const iv=G.p.inv.find(x=>x.n==mn);
      const hv=iv?iv.q:0,en=hv>=mq;
      if(!en)ok=false;
      ms+='<span class="mp '+(en?'ok':'miss')+'">'+mn+': '+hv+'/'+mq+'</span>';
    }
    h+='<div class="rc"><div class="rr"><span class="ri">'+ie(r.res)+'</span><span class="rn" style="color:'+rc(r.res.r)+'">'+r.n+'</span><span class="rd">'+r.d+'</span></div><div class="rms">'+ms+'</div><button class="cb '+(ok?'':'dis')+'" data-i="'+i+'">Forge</button></div>';
  }
  h+='</div></div>'; return h;
}

function toggleQuestCollapse(key){
  G.questCollapsed[key] = !G.questCollapsed[key];
  render();
}

function rQuest(){
  let h='<div class="quest-view">';
    // === DAILY LOGIN REWARDS ===
  const today = G.gameDay || 0;
  const streak = G.loginStreak || 0;
  const claimedToday = G.loginClaimed || false;

  const loginRewards = [
    { day: 1, icon: '💰', name: 'Gold Pouch', g: 50, xp: 25 },
    { day: 2, icon: '💧', name: 'Mana Crystal', mp: 30, xp: 35 },
    { day: 3, icon: '🧪', name: 'Health Potion', hp: 50, xp: 45 },
    { day: 4, icon: '💎', name: 'Gem Shard', g: 100, xp: 60 },
    { day: 5, icon: '⚔️', name: 'Mystic Scroll', g: 150, xp: 80 },
    { day: 6, icon: '🔮', name: 'Arcane Orb', mp: 50, xp: 100 },
    { day: 7, icon: '👑', name: 'Legendary Cache', g: 300, xp: 200, item: { n: 'Phoenix Feather', t: 'revive', eff: 'revive', v: 50, q: 1, r: 'rare' } }
  ];

  const todayReward = loginRewards[Math.min(streak, 6)];

  h += '<div style="background: linear-gradient(135deg, var(--accent), #6d28d9); border-radius: 16px; padding: 16px; margin-bottom: 16px; color: white;">';
  h += '<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">';
  h += '<div style="font-size: 28px;">🎁</div>';
  h += '<div><div style="font-weight: 700; font-size: 16px;">Daily Login Reward</div>';
  h += '<div style="font-size: 11px; opacity: 0.9;">Day ' + (streak + 1) + ' · Streak: ' + streak + '</div></div>';
  h += '</div>';

  h += '<div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px; margin-bottom: 12px;">';
  h += '<div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">Today\'s Reward:</div>';
  h += '<div style="display: flex; align-items: center; gap: 8px;">';
  h += '<div style="font-size: 32px;">' + todayReward.icon + '</div>';
  h += '<div style="flex: 1;">';
  h += '<div style="font-weight: 600; font-size: 14px;">' + todayReward.name + '</div>';
  h += '<div style="font-size: 11px; opacity: 0.85;">';
  const rewardParts = [];
  if (todayReward.g) rewardParts.push('+' + todayReward.g + 'G');
  if (todayReward.xp) rewardParts.push('+' + todayReward.xp + 'XP');
  if (todayReward.hp) rewardParts.push('+' + todayReward.hp + 'HP');
  if (todayReward.mp) rewardParts.push('+' + todayReward.mp + 'MP');
  if (todayReward.item) rewardParts.push(todayReward.item.n);
  h += rewardParts.join(' · ');
  h += '</div></div></div></div>';

  // Streak progress dots
  h += '<div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 12px;">';
  for (let i = 0; i < 7; i++) {
    const isActive = i < streak;
    const isToday = i === streak;
    h += '<div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; ' + 
      (isActive ? 'background: #fbbf24; color: #000;' : 
       isToday ? 'background: white; color: var(--accent); border: 2px solid #fbbf24;' : 
       'background: rgba(255,255,255,0.2); color: white;') + '">' + (i + 1) + '</div>';
  }
  h += '</div>';

  if (claimedToday) {
    h += '<button disabled style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: rgba(255,255,255,0.2); color: white; font-size: 13px; font-weight: 600; opacity: 0.6; cursor: not-allowed;">✅ Claimed Today — Come Back Tomorrow!</button>';
  } else {
    h += '<button id="btn-claim-login" style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: #fbbf24; color: #000; font-size: 13px; font-weight: 700; cursor: pointer;">🎁 Claim Reward</button>';
  }
  h += '</div>';
  // === END DAILY LOGIN ===

  // Storyline section
  h+='<h2 class="st">📖 Storyline</h2><div class="qlist">';
  for(let s of G.storyline){
    if(!s.unlocked) continue;
    const pc=Math.min(100,(G.p.lvl/s.need)*100);
    h+='<div class="qc '+(s.done?'done':'')+'" style="border-color:var(--accent-light);"><div class="qh"><span class="qn">'+(s.done?'✅ ':'')+'Ch.'+s.chapter+': '+s.n+'</span><span class="qr">'+s.rw.xp+' XP | '+s.rw.g+' G</span></div>';
    h+='<div class="qd">'+s.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">Lv.'+G.p.lvl+'/'+s.need+'</span></div></div>';
  }
  h+='</div>';
  // Active quests section
  h+='<h2 class="st" style="margin-top:20px;">📜 Active Quests</h2><div class="qlist">';
  for(let q of G.quests){
    if(q.hidden && !q.revealed) continue;
    const pc=Math.min(100,(q.c/q.need)*100);
    const timerStatus=getTimerStatus(q);
    let cardClass=q.done?'done':(q.expired?'expired':(timerStatus?(timerStatus.cls==='timer-urgent'?'timed-urgent':'timed'):''));
    h+='<div class="qc '+cardClass+'"><div class="qh"><span class="qn">'+(q.done?'✅ ':(q.expired?'❌ ':''))+q.n+'</span><span class="qr">'+q.rw.xp+' XP | '+q.rw.g+' G</span></div>';
    if(q.chain){
      h+='<div style="font-size:10px;color:var(--accent-light);margin-bottom:4px;">🔗 Chain: '+q.chain+'</div>';
    }
    if(q.reqQuest && !q.revealed){
      const req=G.quests.find(rq=>rq.id===q.reqQuest);
      h+='<div style="font-size:10px;color:var(--text-dim);font-style:italic;margin-bottom:4px;">🔒 Requires: '+(req?req.n:'Unknown')+'</div>';
    }
    h+='<div class="qd">'+q.d+'</div>';
    if(timerStatus){
      h+='<div class="timer-bar"><div class="timer-fill '+timerStatus.cls+'" style="width:'+timerStatus.pct+'%"></div></div>';
      h+='<div class="timer-label">⏰ '+timerStatus.label+'</div>';
    }
    h+='<div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+Math.min(q.c,q.need)+'/'+q.need+'</span></div></div>';
  }
  h+='</div>';
    // Daily Quests section
  h += '<h2 class="st" style="margin-top:20px;">📋 Daily Quests</h2><div class="qlist">';
  generateDailyQuests();
  if (G.dailyQuests.length === 0) {
    h += '<div class="qc"><div class="qd">No daily quests available. Check back tomorrow!</div></div>';
  } else {
    for (let q of G.dailyQuests) {
      const pc = Math.min(100, (q.c / q.need) * 100);
      h += '<div class="qc ' + (q.done ? 'done' : '') + '"><div class="qh"><span class="qn">' + q.n + '</span><span class="qr">' + q.rw.xp + ' XP | ' + q.rw.g + ' G</span></div>';
      h += '<div class="qd">' + q.d + '</div><div class="qp"><div class="pbar"><div class="pfill" style="width:' + pc + '%"></div></div><span class="ptxt">' + q.c + '/' + q.need + '</span></div></div>';
    }
  }
  h += '</div>';
    // Bounties section
  const activeBounties = G.bounties.filter(b => !b.done && G.p.lvl >= (b.minLv || 1));
  const doneBounties = G.bounties.filter(b => b.done);
  if (activeBounties.length > 0 || doneBounties.length > 0) {
    h+='<h2 class="st" style="margin-top:20px;">💰 Bounties</h2>';
    if (activeBounties.length > 0) {
      h+='<div class="qlist">';
      for(let b of activeBounties){
        const pc=Math.min(100,(b.c/b.need)*100);
        h+='<div class="qc"><div class="qh"><span class="qn">'+b.n+'</span><span class="qr">'+b.rw.xp+' XP | '+b.rw.g+' G</span></div>';
        h+='<div class="qd">'+b.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+b.c+'/'+b.need+'</span></div></div>';
      }
      h+='</div>';
    }
    if (doneBounties.length > 0) {
      const collapsed = G.questCollapsed['__bounties_done__'];
      h+='<div style="margin-top:12px;">';
      h+='<div onclick="toggleQuestCollapse(\'__bounties_done__\')" style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:12px 16px;background:var(--bg-hover);border-radius:14px;border:1px solid var(--border);user-select:none;">';
      h+='<span style="font-size:12px;transition:transform 0.2s;display:inline-block;' + (collapsed ? '' : 'transform:rotate(90deg);') + '">▶</span>';
      h+='<span style="font-size:14px;font-weight:600;color:var(--success);">✅ Claimed</span>';
      h+='<span style="font-size:12px;color:var(--text-dim);margin-left:auto;">' + doneBounties.length + '</span>';
      h+='</div>';
      if (!collapsed) {
        h+='<div class="qlist" style="margin-top:8px;">';
        for(let b of doneBounties){
          h+='<div class="qc done" style="opacity:0.55;"><div class="qh"><span class="qn" style="text-decoration:line-through;">'+b.n+'</span><span class="qr" style="color:var(--success);">✓</span></div>';
          h+='<div class="qd">'+b.d+'</div></div>';
        }
        h+='</div>';
      }
      h+='</div>';
    }
  }
  h+='</div>';
  h+='<div class="sum"><div class="si2"><span class="sv">'+G.p.kills+'</span><span class="sl">Monsters</span></div><div class="si2"><span class="sv">'+G.p.quests+'</span><span class="sl">Quests</span></div><div class="si2"><span class="sv">'+G.p.fstreak+'</span><span class="sl">Focus</span></div></div></div>';
  return h;
}

function rFocus(){
  // If focus is not active, show the session picker
  if (!G.fs || G.state !== 'focus') {
    let h = '<div class="fv">';
    h += '<div style="font-size:42px;margin-bottom:8px;">🧘</div>';
    h += '<div class="fl" style="font-size:18px;font-weight:700;margin-bottom:4px;">Focus Mode</div>';
    h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:20px;">Pick a session length</div>';
    h += '<div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:0 auto;">';
    const sessions = [
      {m:5, xp:20, g:10, label:'Quick Sprint'},
      {m:10, xp:40, g:20, label:'Short Burst'},
      {m:15, xp:60, g:30, label:'Deep Work'},
      {m:20, xp:80, g:40, label:'Extended Flow'},
      {m:25, xp:100, g:50, label:'Full Pomodoro'}
    ];
    for (let s of sessions) {
      h += '<button class="focus-session-btn" data-min="' + s.m + '" style="padding:14px 18px;border-radius:14px;border:2px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
      h += '<span>' + s.m + ' min — ' + s.label + '</span>';
      h += '<span style="font-size:11px;color:var(--success);">+' + s.xp + 'XP +' + s.g + 'G</span>';
      h += '</button>';
    }
    h += '</div>';
    h += '<div class="ftips" style="margin-top:20px;"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward scales with session length!</li></ul></div>';
    h += '</div>';
    return h;
  }
  // Active focus session
  const el=Date.now()-(G.fs||Date.now()),rm=Math.max(0,G.fd-el);
  const m=Math.floor(rm/60000),s=Math.floor((rm%60000)/1000);
  return '<div class="fv"><div class="fc"><div class="ft" id="ft">'+m+':'+s.toString().padStart(2,'0')+'</div><div class="fl">Focus Mode — ' + (G.focusDuration || 25) + ' min</div></div><div class="ftips"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward: +' + ((G.focusDuration||25)*4) + ' XP when done!</li></ul></div><button class="cfb">Cancel</button></div>';
}

function rTemple() {
  const dead = getDeadParty();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">⛪ Temple of Resurrection</h2>';
  h2 += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ancient magic restores fallen companions. Cost: 50G each.</div>';
  if(dead.length === 0){
    h2 += '<div style="text-align:center;padding:20px;color:var(--success);">✨ All companions are alive!</div>';
  }else{
    h2 += '<div style="margin-bottom:12px;">';
    for(let p of G.party){
      const isDead = p.hp <= 0;
      const canAfford = G.p.gold >= 50;
      h2 += '<div class="temple-revive ' + (isDead ? 'dead' : 'alive') + '">';
      h2 += '<div class="tr-ava" style="background:' + p.col + '20;border-color:' + p.col + '">' + (isDead ? '💀' : re(p.r)) + '</div>';
      h2 += '<div class="tr-info">';
      h2 += '<div class="tr-name">' + p.n + '</div>';
      h2 += '<div class="tr-status ' + (isDead ? '' : 'alive') + '">' + (isDead ? '💀 FALLEN' : '✅ Alive ' + p.hp + '/' + p.mhp) + '</div>';
      h2 += '</div>';
      if(isDead) h2 += '<button class="tr-btn ' + (canAfford ? '' : 'dis') + '" data-m="' + p.n + '">' + (canAfford ? 'Revive (50G)' : 'Need 50G') + '</button>';
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  return h2;
}

function rRest() {
  const dead = getDeadParty();
  if(dead.length > 0 && !G.rest.active) return rTemple();

  if (G.rest.active && G.rest.selectedSite) {
    const site = G.rest.selectedSite;
    const currentTick = G.rest.tick;
    const maxTicks = G.rest.maxTicks;
    const pct = (currentTick / maxTicks) * 100;
    const healerName = getHealerName();
    let h2 = '<div class="rest-view">';
    h2 += '<h2 class="st">🔥 Resting at ' + site.name + '</h2>';
    if (G.ambushWarning) {
      h2 += '<div class="ambush-warning">';
      h2 += '<div class="aw-text">⚠️ ' + G.ambushWarning.text + '</div>';
      h2 += '</div>';
    }
    if (G.currentDialogue && !G.ambushWarning) {
      h2 += '<div class="dialogue-box">';
      h2 += '<div class="d-speaker">' + G.currentDialogue.speaker + '</div>';
      h2 += '<div class="d-text">' + G.currentDialogue.text + '</div>';
      h2 += '</div>';
    }
    h2 += '<div class="tick-track">';
    for (let i = 1; i <= maxTicks; i++) {
      let tickClass = '';
      let tickIcon = '○';
      if (i < currentTick) {
        tickClass = 'done';
        tickIcon = '✓';
      } else if (i === currentTick) {
        tickClass = 'current';
        tickIcon = '🔥';
      }
      h2 += '<div class="tick ' + tickClass + '">' + tickIcon + '</div>';
    }
    h2 += '</div>';
    h2 += '<div class="tick-label">Tick ' + currentTick + '/' + maxTicks + '</div>';
    h2 += '<div class="rest-progress" style="margin-top:16px;">';
    h2 += '<div class="rest-bar"><div class="rest-fill" style="width:' + pct + '%"></div></div>';
    h2 += '<div class="rest-healer ok">💚 ' + healerName + ' is tending to the party</div>';
    h2 += '</div>';
    h2 += '<button class="rest-cancel" id="cancel-rest">Cancel Rest (Partial Recovery)</button>';
    h2 += '</div>';
    return h2;
  }

  const healerOk = hasHealer();
  const healerName = getHealerName();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">💤 Rest</h2>';
  if (healerOk) {
    h2 += '<div class="rest-healer ok" style="background:#22c55e15;border:1px solid var(--success);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--success);">💚 Healer Available: ' + healerName + '</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">5 ticks, 1.5s each. Dialogue every tick. Ambush chance: 15% camp / 5% tavern.</div>';
    h2 += '</div>';
  } else {
    h2 += '<div class="rest-healer fail" style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--danger);">❌ No Healer in Party</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">You need a healer (like Eliz) in your active party to rest safely.</div>';
    h2 += '</div>';
  }
  const soelActive = G.party.some(p => p.n === 'Soel' && p.on);
  h2 += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;text-align:left;">';
  h2 += '<div style="font-size:13px;font-weight:600;color:var(--rest);margin-bottom:4px;">🐱 Soel\'s Spirit Blessing</div>';
  if (!soelActive) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Soel must be in your active party to share his blessing.</div>';
  } else if (G.soelBlessing) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Blessing rests on <b style="color:var(--text);">' + G.soelBlessing.target + '</b> (+' + G.soelBlessing.def + ' DEF). One blessing per rest \u2014 it fades when you next make camp.</div>';
  } else {
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">One member per rest receives +10 DEF until your next rest.</div>';
    h2 += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    for (let m of G.party) {
      if (!m.on || m.n === 'Soel') continue;
      h2 += '<button class="soel-bless-btn" data-n="' + m.n + '" style="padding:6px 12px;border-radius:10px;border:1px solid var(--rest);background:#10b98115;color:var(--text);font-size:11px;font-weight:600;cursor:pointer;">' + m.n + '</button>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div class="rest-sites">';
  const zones = {};
  for (let site of G.rest.sites) {
    if (!zones[site.zone]) zones[site.zone] = [];
    zones[site.zone].push(site);
  }
  for (let zoneName in zones) {
    const sites = zones[zoneName];
    const anyUnlocked = sites.some(s => s.unlocked);
    if (!anyUnlocked) continue;
    h2 += '<div style="margin-bottom:12px;">';
    h2 += '<div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">' + zoneName + '</div>';
    for (let site of sites) {
    let manaSpringRemaining = 8;
    if (G.manaSpringUses.day === G.gameDay) {
        manaSpringRemaining = 8 - G.manaSpringUses.count;
      }
      const isDepletedManaSpring = site.type === 'mana_spring' && manaSpringRemaining <= 0;

      const locked = !site.unlocked || isDepletedManaSpring;

      const canAfford = !site.cost || G.p.gold >= site.cost;
      const canRest = (site.type === 'mana_spring' || site.type === 'temple' || healerOk) && !locked && canAfford;
      h2 += '<div class="rs-card ' + (locked ? 'locked' : '') + '" data-id="' + site.id + '">';
      h2 += '<div class="rs-head">';
      h2 += '<span class="rs-name">' + site.icon + ' ' + site.name + '</span>';
      h2 += '<span class="rs-type ' + site.type + '">' + site.type.toUpperCase() + '</span>';
      h2 += '</div>';
      h2 += '<div class="rs-desc">' + site.desc + '</div>';
            if (locked) {
            if (isDepletedManaSpring) {
          h2 += '<div class="rs-req fail">💧 Daily limit reached (8/8 uses)</div>';

        } else {
          h2 += '<div class="rs-req fail">🔒 Requires Level ' + site.zoneLv + ' to discover</div>';
        }
      } else if (site.cost) {

                const msUsesLeft = site.type === 'mana_spring' ? ' (' + manaSpringRemaining + '/8 today)' : '';
        h2 += '<div class="rs-req ' + (canAfford ? 'ok' : 'fail') + '">' + (canAfford ? '✅' : '❌') + ' Cost: ' + site.cost + 'G' + msUsesLeft + ' · Ambush: 5% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';


      } else {
        h2 += '<div class="rs-req ' + (healerOk ? 'ok' : 'fail') + '">' + (healerOk ? '✅' : '❌') + ' Free · Ambush: 15% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';
      }
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:8px;">Rest takes ~7.5 seconds. Party banter every tick. Taverns cost gold but are safer.</div>';
  h2 += '</div>';
  return h2;
}

document.addEventListener('DOMContentLoaded', function() {
  const hasSave = loadGame();
  if (!hasSave) {
    lg('Welcome to Legends of Daybreak, San.');
    lg('Tap Adventure to start your journey!');
    showStory();
      checkDailyLogin();

  }
  // Check for idle gains on load
    setTimeout(() => {
      if (!checkIdleGains()) {
        render();
      }
    }, 300);
});


// === MID-BATTLE POTION SYSTEM ===
function togglePotionMenu() {
  G.potionMenu = !G.potionMenu;
  render();
}

function usePotionInCombat(invIndex) {
  const it = G.p.inv[invIndex];
  if (!it) return;

  // Handle revive items (Phoenix Feather, Rod of Resurrection, etc.)
  if (it.t === 'revive') {
    const deadMembers = getDeadParty();
    if (deadMembers.length === 0) {
      lg('❌ No fallen allies to revive!');
      G.potionMenu = false;
      render();
      return;
    }

    // Prioritize: San (player) first, then party members
    let target = deadMembers.find(p => p.n === 'San');
    if (!target) target = deadMembers[0];

    // Use item's v value for revive percentage (50% for Phoenix Feather, 75% for Rod of Resurrection)
    const revivePct = it.v || 50;
    const healAmount = Math.floor(target.mhp * (revivePct / 100));
    target.hp = Math.max(1, healAmount);
    target.on = true;

    lg('🔥 ' + it.n + ' radiates with sacred light!');
    lg('✨ ' + (target.n === 'San' ? 'You' : target.n) + ' are revived with ' + target.hp + ' HP (' + revivePct + '%)!');

    it.q--;
    if (it.q <= 0) {
      G.p.inv.splice(invIndex, 1);
    }

    G.potionMenu = false;
    render();
    return;
  }

  // Regular potions only
  if (it.t !== 'pot' && it.t !== 'food' && it.t !== 'drink') return;

  if (it.eff === 'heal') {
    const oldHp = G.p.hp;
    G.p.hp = Math.min(G.p.mhp, G.p.hp + it.v);
    const healed = G.p.hp - oldHp;
    lg('🧪 Used ' + it.n + '! +' + healed + ' HP (' + G.p.hp + '/' + G.p.mhp + ')');
  } else if (it.eff === 'mana') {
    const oldMp = G.p.mp;
    G.p.mp = Math.min(G.p.mmp, G.p.mp + it.v);
    const restored = G.p.mp - oldMp;
    lg('💧 Used ' + it.n + '! +' + restored + ' MP (' + G.p.mp + '/' + G.p.mmp + ')');
  }

  it.q--;
  if (it.q <= 0) {
    G.p.inv.splice(invIndex, 1);
  }

  G.potionMenu = false;
  render();
}

function getCombatPotions() {
  return G.p.inv.filter(it => 
    (it.t === 'pot' || it.t === 'food' || it.t === 'drink') &&
    (it.eff === 'heal' || it.eff === 'mana') ||
    it.t === 'revive'
  );
}


function rAchievements() {
  let h = '<div class="achievements-view" style="padding:16px;">';
  h += '<h2 class="st">🏆 Achievements</h2>';

  const earned = G.achievements.filter(a => a.done);
  const total = G.achievements.length;
  const secret = G.achievements.filter(a => a.secret);
  const secretEarned = secret.filter(a => a.done);

  h += '<div style="text-align:center;margin-bottom:20px;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:16px;">';
  h += '<div style="font-size:36px;font-weight:700;color:var(--gold);">' + earned.length + '/' + total + '</div>';
  h += '<div style="font-size:12px;color:var(--text-dim);">Achievements Unlocked</div>';
  if (secret.length > 0) {
    h += '<div style="font-size:11px;color:var(--accent-light);margin-top:4px;">🔒 ' + secretEarned.length + '/' + secret.length + ' Secret</div>';
  }
  h += '</div>';

  h += '<div style="display:flex;flex-direction:column;gap:10px;">';
  for (let ach of G.achievements) {
    if (ach.secret && !ach.revealed && !ach.done) {
      h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;display:flex;gap:12px;align-items:center;opacity:0.6;">';
      h += '<div style="font-size:28px;width:40px;text-align:center;">❓</div>';
      h += '<div style="flex:1;">';
      h += '<div style="font-weight:600;font-size:14px;color:var(--text-dim);">Secret Achievement</div>';
      h += '<div style="font-size:11px;color:var(--disabled);">Keep playing to discover...</div>';
      h += '</div></div>';
      continue;
    }

    const done = ach.done;
    h += '<div style="background:var(--bg-card);border:1px solid ' + (done ? 'var(--success)' : 'var(--border)') + ';border-radius:14px;padding:14px;display:flex;gap:12px;align-items:center;' + (done ? 'background:#22c55e10;' : '') + '">';
    h += '<div style="font-size:28px;width:40px;text-align:center;">' + (done ? ach.icon : '🔒') + '</div>';
    h += '<div style="flex:1;">';
    h += '<div style="font-weight:600;font-size:14px;">' + (done ? '✅ ' : '') + ach.n + '</div>';
    h += '<div style="font-size:12px;color:var(--text-dim);line-height:1.4;">' + ach.d + '</div>';
    if (!done) {
      let progress = '';
      switch (ach.t) {
        case 'kills': progress = G.p.kills + '/' + ach.need; break;
        case 'boss': progress = (G.p.bossKills || 0) + '/' + ach.need; break;
        case 'level': progress = G.p.lvl + '/' + ach.need; break;
        case 'quests': progress = G.p.quests + '/' + ach.need; break;
        case 'affinity': progress = (G.affinity[ach.target] ? G.affinity[ach.target].val : 0) + '/' + ach.need; break;
        case 'gold': progress = G.p.gold + '/' + ach.need; break;
        case 'craft': progress = (G.p.crafts || 0) + '/' + ach.need; break;
        case 'focus': progress = G.p.fstreak + '/' + ach.need; break;
        default: progress = '???';
      }
      h += '<div style="font-size:11px;color:var(--accent-light);margin-top:4px;">' + progress + '</div>';
    } else {
      h += '<div style="font-size:11px;color:var(--success);margin-top:4px;">+' + ach.rw.xp + ' XP, +' + ach.rw.g + 'G</div>';
    }
    h += '</div></div>';
  }
  h += '</div></div>';
  return h;
}

function rStory(){
  const chapter = G.storyChapters[G.story.chapter];
  const scene = chapter.scenes[G.story.scene];
  let h='<div class="story-view" style="text-align:center;padding:20px;">';
  h+='<div style="font-size:12px;color:var(--accent-light);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:20px;">Chapter '+(G.story.chapter+1)+': '+chapter.title+'</div>';
  h+='<div class="dialogue-box" style="margin-bottom:24px;">';
  h+='<div class="d-speaker">'+scene.speaker+'</div>';
  h+='<div class="d-text" style="font-size:15px;line-height:1.7;">'+scene.text+'</div>';
  h+='</div>';
  h+='<button class="abtn" style="max-width:200px;margin:0 auto;display:block;">Continue</button>';
  h+='<div style="margin-top:16px;font-size:11px;color:var(--text-dim);">'+(G.story.scene+1)+' / '+chapter.scenes.length+'</div>';
  h+='</div>';
  return h;
}

function rBestiary(){
  let h='<div class="bestiary-view"><h2 class="st">📖 Bestiary</h2>';
  const entries = Object.entries(G.bestiary).sort((a,b)=>b[1].kills-a[1].kills);
  if(entries.length===0){
    h+='<div style="text-align:center;padding:40px;color:var(--text-dim);">No creatures catalogued yet.<br>Defeat enemies to fill the bestiary.</div>';
  }else{
    h+='<div style="font-size:11px;color:var(--text-dim);margin-bottom:12px;">'+entries.length+' species discovered</div>';
    h+='<div class="zlist">';
    for(let [name,data] of entries){
      const elemIcon = data.elem==='fire'?'🔥':data.elem==='ice'?'❄️':data.elem==='lightning'?'⚡':data.elem==='void'?'🌑':'✦';
      h+='<div class="zcard" style="cursor:default;">';
      h+='<div class="zh"><span class="zn">'+ee(name)+' '+name+'</span><span class="zl">'+data.kills+' kills</span></div>';
      h+='<div style="display:flex;gap:12px;font-size:12px;color:var(--text-dim);margin-top:6px;">';
      h+='<span>HP: '+data.mhp+'</span><span>ATK: '+data.atk+'</span><span>DEF: '+data.def+'</span><span>'+elemIcon+' '+data.elem+'</span>';
      h+='</div>';
      h+='<div style="font-size:10px;color:var(--disabled);margin-top:4px;">First seen: '+new Date(data.firstSeen).toLocaleDateString()+'</div>';
      h+='</div>';
    }
    h+='</div>';
  }
  h+='</div>';
  return h;
}

function rRunes(){
  // If socket modal is open, render that instead
  if (G.runeSocketModal && G.runeSocketModal.open) {
    return rRuneSocketModal();
  }
  // If combine modal is open, render that instead
  if (G.runeCombineModal && G.runeCombineModal.open) {
    return rRuneCombineModal();
  }

  let h='<div style="padding:16px;"><h2 class="st">💎 Rune Socketing</h2>';

  // Rune inventory with better visual cards
  h+='<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">Rune Inventory ('+G.runes.length+')</div>';
  if(G.runes.length===0){
    h+='<div style="font-size:12px;color:var(--text-dim);padding:12px;background:var(--bg-card);border-radius:12px;margin-bottom:16px;">No runes yet. Defeat enemies in Lv 10+ zones to find them.</div>';
  }else{
    h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;">';
    for(let i=0;i<G.runes.length;i++){
      const r=G.runes[i];
      const rarityGlow = r.r==='rare'?'0 0 8px '+r.color+'40':r.r==='epic'?'0 0 12px '+r.color+'60':'';
      h+='<div class="rune-item" data-ri="'+i+'" style="background:var(--bg-card);border:2px solid '+r.color+';border-radius:12px;padding:10px 8px;text-align:center;cursor:pointer;user-select:none;box-shadow:'+rarityGlow+';transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.transform=\'none\'">';
      h+='<div style="font-size:24px;margin-bottom:4px;">'+r.icon+'</div>';
      h+='<div style="font-size:11px;font-weight:700;color:'+r.color+';">'+r.name+'</div>';
      h+='<div style="font-size:10px;color:var(--text-dim);margin-top:4px;">';
      const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[r.stat] || r.stat;
      h+= statLabel + ' +' + r.val;
      if(r.pct) h+=' ('+Math.floor(r.pct*100)+'%)';
      h+='</div>';
      h+='<div style="font-size:9px;color:var(--disabled);margin-top:2px;text-transform:uppercase;">'+r.r+'</div>';
      h+='</div>';
    }
    h+='</div>';

    // Combine button — now opens modal
    h+='<button id="btn-combine" style="width:100%;padding:12px;border-radius:12px;border:2px solid var(--accent);background:linear-gradient(135deg,var(--accent),#6d28d9);color:white;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:16px;box-shadow:0 2px 8px var(--shadow-accent);transition:transform 0.2s;" onmouseover="this.style.transform=\'translateY(-1px)\'" onmouseout="this.style.transform=\'none\'">';
    h+='🔮 Combine Runes';
    h+='</button>';
  }

  // Socketable gear with stat preview
  h+='<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">Socketable Gear</div>';
  const socketable = G.p.inv.filter(it => it.sockets && it.sockets.length > 0);
  if(socketable.length===0){
    h+='<div style="font-size:12px;color:var(--text-dim);padding:12px;background:var(--bg-card);border-radius:12px;">No socketed gear. Lv 10+ items have sockets.</div>';
  }else{
    h+='<div style="display:flex;flex-direction:column;gap:10px;">';
    for(let i=0;i<G.p.inv.length;i++){
      const it=G.p.inv[i];
      if(!it.sockets) continue;

      // Calculate current socket stats
      let currentStats = [];
      if (it.socketStats) {
        for (let k in it.socketStats) {
          if (k.endsWith('Pct')) continue;
          const label = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[k] || k;
          currentStats.push(label + '+' + it.socketStats[k]);
        }
      }

      h+='<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;transition:border-color 0.2s;" onmouseover="this.style.borderColor=\'var(--accent)\'" onmouseout="this.style.borderColor=\'var(--border)\'">';
      h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
      h+='<div style="font-weight:700;font-size:14px;color:'+rc(it.r)+';">'+it.n+'</div>';
      h+='<div style="font-size:10px;color:var(--text-dim);background:var(--bg-hover);padding:2px 8px;border-radius:8px;">iLvl '+it.ilvl+'</div>';
      h+='</div>';

      // Socket display with better visuals
      h+='<div style="display:flex;gap:8px;margin-bottom:10px;">';
      for(let s=0;s<it.sockets.length;s++){
        const socket = it.sockets[s];
        if(socket){
          h+='<div style="flex:1;background:'+socket.color+'15;border:2px solid '+socket.color+';border-radius:10px;padding:8px;text-align:center;">';
          h+='<div style="font-size:20px;">'+socket.icon+'</div>';
          h+='<div style="font-size:9px;font-weight:600;color:'+socket.color+';">'+socket.name.replace('Rune of ','')+'</div>';
          h+='</div>';
        }else{
          h+='<div style="flex:1;background:var(--bg-hover);border:2px dashed var(--disabled);border-radius:10px;padding:8px;text-align:center;opacity:0.6;">';
          h+='<div style="font-size:20px;color:var(--disabled);">○</div>';
          h+='<div style="font-size:9px;color:var(--disabled);">Empty</div>';
          h+='</div>';
        }
      }
      h+='</div>';

      // Current socket stats summary
      if(currentStats.length > 0){
        h+='<div style="font-size:10px;color:var(--success);margin-bottom:8px;padding:6px 10px;background:#22c55e10;border-radius:8px;">✨ Socketed: '+currentStats.join(' · ')+'</div>';
      }

      // Socket action buttons
      h+='<div style="display:flex;gap:6px;flex-wrap:wrap;">';
      for(let s=0;s<it.sockets.length;s++){
        if(!it.sockets[s]){
          h+='<button class="socket-btn" data-ii="'+i+'" data-si="'+s+'" style="flex:1;padding:8px 10px;border-radius:10px;border:1px dashed var(--accent);background:transparent;color:var(--accent);font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;">💎 Socket</button>';
        }else{
          h+='<button class="unsocket-btn" data-ii="'+i+'" data-si="'+s+'" style="flex:1;padding:8px 10px;border-radius:10px;border:1px solid '+it.sockets[s].color+';background:'+it.sockets[s].color+'15;color:'+it.sockets[s].color+';font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;">'+it.sockets[s].icon+' Remove</button>';
        }
      }
      h+='</div></div>';
    }
    h+='</div>';
  }

  h+='</div>';
  return h;
}

// NEW: Rune Socket Selection Modal
function rRuneSocketModal() {
  const { itemIndex, slotIndex } = G.runeSocketModal;
  const item = G.p.inv[itemIndex];
  if (!item) return '<div>Error</div>';

  let h = '<div style="padding:16px;">';
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">';
  h += '<button class="rune-modal-back" style="background:none;border:none;color:var(--accent);font-size:20px;cursor:pointer;padding:4px;">←</button>';
  h += '<h2 class="st" style="margin:0;">💎 Socket Rune</h2>';
  h += '</div>';

  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;">';
  h += '<div style="font-weight:700;font-size:14px;color:'+rc(item.r)+';">'+item.n+'</div>';
  h += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">Slot '+(slotIndex+1)+' of '+item.sockets.length+'</div>';

  // Show current socket stats on this item
  let currentStats = [];
  if (item.socketStats) {
    for (let k in item.socketStats) {
      if (k.endsWith('Pct')) continue;
      const label = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[k] || k;
      currentStats.push(label + '+' + item.socketStats[k]);
    }
  }
  if(currentStats.length > 0){
    h += '<div style="font-size:10px;color:var(--success);margin-top:8px;">Current sockets: '+currentStats.join(' · ')+'</div>';
  }
  h += '</div>';

  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">Choose a Rune ('+G.runes.length+' available)</div>';

  if(G.runes.length===0){
    h += '<div style="text-align:center;padding:20px;color:var(--text-dim);">No runes available!</div>';
  }else{
    h += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">';
    for(let i=0;i<G.runes.length;i++){
      const r=G.runes[i];
      const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[r.stat] || r.stat;

      // Calculate preview: what will this rune add?
      const currentVal = item.socketStats && item.socketStats[r.stat] ? item.socketStats[r.stat] : 0;
      const newVal = currentVal + r.val;

      h += '<button class="rune-select-btn" data-ri="'+i+'" style="background:var(--bg-card);border:2px solid '+r.color+';border-radius:14px;padding:14px;text-align:left;cursor:pointer;transition:all 0.2s;">';
      h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">';
      h += '<span style="font-size:28px;">'+r.icon+'</span>';
      h += '<div style="flex:1;">';
      h += '<div style="font-size:13px;font-weight:700;color:'+r.color+';">'+r.name+'</div>';
      h += '<div style="font-size:9px;color:var(--disabled);text-transform:uppercase;">'+r.r+'</div>';
      h += '</div>';
      h += '</div>';

      // Stat preview with before/after
      h += '<div style="background:var(--bg-hover);border-radius:8px;padding:8px 10px;margin-bottom:6px;">';
      h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:2px;">'+statLabel+'</div>';
      h += '<div style="display:flex;align-items:center;gap:6px;">';
      h += '<span style="font-size:11px;color:var(--text-dim);">'+currentVal+'</span>';
      h += '<span style="color:var(--success);font-size:12px;">→</span>';
      h += '<span style="font-size:14px;font-weight:700;color:'+r.color+';">'+newVal+'</span>';
      if(r.pct) h += '<span style="font-size:10px;color:var(--success);">(+'+Math.floor(r.pct*100)+'%)</span>';
      h += '</div></div>';

      h += '<div style="font-size:10px;color:var(--accent);text-align:center;font-weight:600;">Tap to Socket</div>';
      h += '</button>';
    }
    h += '</div>';
  }

  h += '</div>';
  return h;
}

// NEW: Rune Combine Modal
function rRuneCombineModal() {
  const selected = G.runeCombineModal.selected;
  const preview = getCombinePreview();

  let h = '<div style="padding:16px;">';
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">';
  h += '<button class="rune-modal-back" style="background:none;border:none;color:var(--accent);font-size:20px;cursor:pointer;padding:4px;">←</button>';
  h += '<h2 class="st" style="margin:0;">🔮 Combine Runes</h2>';
  h += '</div>';

  h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Select 3 runes of the same type to combine into a stronger version.</div>';

  // Selected runes display
  h += '<div style="display:flex;gap:8px;margin-bottom:16px;">';
  for(let i=0;i<3;i++){
    if(selected[i] !== undefined && G.runes[selected[i]]){
      const r = G.runes[selected[i]];
      h += '<div style="flex:1;background:'+r.color+'15;border:2px solid '+r.color+';border-radius:12px;padding:12px;text-align:center;">';
      h += '<div style="font-size:28px;">'+r.icon+'</div>';
      h += '<div style="font-size:10px;font-weight:600;color:'+r.color+';">'+r.name+'</div>';
      h += '</div>';
    }else{
      h += '<div style="flex:1;background:var(--bg-hover);border:2px dashed var(--disabled);border-radius:12px;padding:12px;text-align:center;opacity:0.5;">';
      h += '<div style="font-size:28px;color:var(--disabled);">?</div>';
      h += '<div style="font-size:10px;color:var(--disabled);">Slot '+(i+1)+'</div>';
      h += '</div>';
    }
  }
  h += '</div>';

  // Preview result
  if(preview && !preview.error){
    h += '<div style="background:linear-gradient(135deg,#7c3aed15,#a78bfa15);border:2px solid var(--accent);border-radius:14px;padding:16px;margin-bottom:16px;text-align:center;">';
    h += '<div style="font-size:11px;color:var(--accent-light);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Result Preview</div>';
    h += '<div style="font-size:36px;margin-bottom:4px;">'+preview.icon+'</div>';
    h += '<div style="font-size:16px;font-weight:700;color:var(--accent-light);">'+preview.name+'</div>';
    h += '<div style="font-size:11px;color:var(--success);margin-top:4px;">';
    const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[preview.stat] || preview.stat;
    h += statLabel + ' +' + preview.val;
    if(preview.pct) h += ' (+'+Math.floor(preview.pct*100)+'%)';
    h += '</div>';
    h += '<div style="font-size:10px;color:var(--gold);margin-top:4px;">'+preview.r.toUpperCase()+'</div>';
    h += '</div>';

    h += '<button id="btn-confirm-combine" style="width:100%;padding:14px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--accent),#6d28d9);color:white;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 2px 12px var(--shadow-accent);">✨ Combine!</button>';
  }else if(preview && preview.error){
    h += '<div style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:center;color:var(--danger);font-size:13px;">'+preview.error+'</div>';
  }else{
    h += '<div style="background:var(--bg-hover);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:16px;text-align:center;color:var(--text-dim);font-size:13px;">Select 3 matching runes to see the result</div>';
  }

  // Rune grid for selection
  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin:16px 0 10px;">Your Runes</div>';
  if(G.runes.length===0){
    h += '<div style="text-align:center;padding:20px;color:var(--text-dim);">No runes to combine.</div>';
  }else{
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">';
    for(let i=0;i<G.runes.length;i++){
      const r=G.runes[i];
      const isSelected = selected.includes(i);
      const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[r.stat] || r.stat;

      h += '<button class="rune-combine-select" data-ri="'+i+'" style="background:'+(isSelected?r.color+'30':'var(--bg-card)')+';border:2px solid '+(isSelected?r.color:'var(--border)')+';border-radius:12px;padding:10px 6px;text-align:center;cursor:pointer;transition:all 0.2s;position:relative;">';
      if(isSelected){
        h += '<div style="position:absolute;top:-6px;right:-6px;background:var(--accent);color:white;width:18px;height:18px;border-radius:50%;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;">✓</div>';
      }
      h += '<div style="font-size:22px;margin-bottom:4px;">'+r.icon+'</div>';
      h += '<div style="font-size:10px;font-weight:600;color:'+(isSelected?r.color:'var(--text)')+';">'+r.name.replace('Rune of ','')+'</div>';
      h += '<div style="font-size:9px;color:var(--text-dim);margin-top:2px;">'+statLabel+'+'+r.val+'</div>';
      h += '</button>';
    }
    h += '</div>';
  }

  h += '</div>';
  return h;
}

function rTalents(){
  let h='<div style="padding:16px;"><h2 class="st">🌟 Planar Talents</h2>';
  h+='<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;text-align:center;">Unlock every 2 levels starting at 16</div>';
  h+='<div style="display:flex;flex-direction:column;gap:10px;">';
  for(let t of TALENTS){
    const unlocked=G.talents.includes(t.id);
    const canUnlock=G.p.lvl>=t.lv;
    h+='<div style="background:var(--bg-card);border:2px solid '+(unlocked?'#22c55e':canUnlock?'#a78bfa':'#6b7280')+';border-radius:14px;padding:14px;opacity:'+(canUnlock?'1':'0.5')+';">';
    h+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">';
    h+='<span style="font-size:24px;">'+t.icon+'</span>';
    h+='<div style="flex:1;"><div style="font-weight:700;font-size:15px;color:'+(unlocked?'#22c55e':canUnlock?'var(--text)':'var(--text-dim)')+';">'+(unlocked?'✅ ':'')+t.name+'</div>';
    h+='<div style="font-size:11px;color:var(--text-dim);">Lv.'+t.lv+'</div></div>';
    h+='</div>';
    h+='<div style="font-size:12px;color:var(--text-dim);line-height:1.4;">'+t.desc+'</div>';
    if(unlocked) h+='<div style="font-size:11px;color:#22c55e;margin-top:6px;font-weight:600;">✨ ACTIVE</div>';
    else if(!canUnlock) h+='<div style="font-size:11px;color:var(--danger);margin-top:6px;">🔒 Requires Level '+t.lv+'</div>';
    h+='</div>';
  }
  h+='</div>';
  h+='<div style="margin-top:16px;font-size:11px;color:var(--text-dim);text-align:center;">'+G.talents.length+'/'+TALENTS.length+' talents unlocked</div>';
  h+='</div>';
  return h;
}

// === REPLACE your rGrindRoom function with this ===

function rGrindRoom() {
  const g = G.endlessGrind;
  let h = '<div class="content">';
  
  h += '<div class="st" style="text-align:center;">⚔️ Endless Grind Room</div>';
  
  // Stats bar
  h += '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:12px;flex-wrap:wrap;">';
  h += '<span class="mst">Wave: <b>' + g.wave + '</b></span>';
  h += '<span class="mst">Kills: <b>' + g.totalKills + '</b></span>';
  h += '<span class="mst">XP: <b>' + g.totalXp + '</b></span>';
  h += '<span class="mst" style="color:var(--gold)">Gold: <b>' + g.totalGold + '</b></span>';
  h += '</div>';
  
  // Difficulty badge
  const diffColors = { normal: '#22c55e', hard: '#f59e0b', nightmare: '#ef4444' };
  h += '<div style="text-align:center;margin-bottom:16px;">';
  h += '<span style="font-size:11px;padding:4px 12px;border-radius:10px;background:' + diffColors[g.difficulty] + '20;color:' + diffColors[g.difficulty] + ';font-weight:600;text-transform:uppercase;">';
  h += g.difficulty + ' (×' + g.difficultyMult[g.difficulty] + ')</span>';
  h += '</div>';
  
  // MAIN CONTROLS
  if (!g.active) {
    // Between waves or fresh start
    h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:12px;">';
    
    if (g.wave === 0) {
      // FRESH START - show all settings
      h += '<div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--accent-light);">Grind Settings</div>';
      
      // Tier selector
      h += '<div style="margin-bottom:12px;">';
      h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Max Zone Tier</div>';
      h += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
      const maxTier = Math.min(G.p.lvl, 23);
      for (let t = 1; t <= maxTier; t++) {
        const z = G.zones.find(zn => zn.lv === t);
        const name = z ? z.n.split(' ')[0] : 'Lv' + t;
        const isSel = g.maxZoneLevel === t;
        h += '<button onclick="setGrindTier(' + t + ')" style="padding:6px 10px;border-radius:8px;border:1px solid ' + (isSel ? 'var(--accent)' : 'var(--border)') + ';background:' + (isSel ? 'var(--accent)' : 'var(--bg-card)') + ';color:' + (isSel ? 'white' : 'var(--text)') + ';font-size:11px;cursor:pointer;">' + name + '</button>';
      }
      h += '</div></div>';
      
      // Difficulty toggle
      h += '<div style="margin-bottom:12px;">';
      h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Difficulty</div>';
      h += '<div style="display:flex;gap:6px;">';
      const diffs = ['normal', 'hard', 'nightmare'];
      for (let d of diffs) {
        const isSel = g.difficulty === d;
        h += '<button onclick="toggleGrindDifficulty()" style="flex:1;padding:8px;border-radius:8px;border:1px solid ' + (isSel ? diffColors[d] : 'var(--border)') + ';background:' + (isSel ? diffColors[d] + '20' : 'var(--bg-card)') + ';color:' + (isSel ? diffColors[d] : 'var(--text-dim)') + ';font-size:12px;font-weight:600;cursor:pointer;">' + d + '</button>';
      }
      h += '</div></div>';
      
      // Auto-next toggle
      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">';
      h += '<input type="checkbox" id="grind-autonext" ' + (g.autoNext ? 'checked' : '') + ' onchange="toggleAutoNext()" style="width:18px;height:18px;accent-color:var(--accent);">';
      h += '<label for="grind-autonext" style="font-size:13px;cursor:pointer;">Auto-start next wave</label>';
      h += '</div>';
      
      h += '<button onclick="enterGrindRoom()" class="abtn" style="width:100%;">Start Grinding</button>';
      
        } else {
      // BETWEEN WAVES - show Next Wave, Stop, and Leave options
      h += '<div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--accent-light);">Wave ' + g.wave + ' Complete!</div>';
      h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ready for the next wave?</div>';
      
      h += '<button onclick="startGrindWave()" class="abtn" style="width:100%;margin-bottom:8px;">▶️ Next Wave</button>';
      h += '<button onclick="exitGrindRoom()" style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:14px;font-weight:600;cursor:pointer;margin-bottom:8px;">⏹ Stop & Collect Loot</button>';
      
      // NEW: Leave and reset button
      h += '<button onclick="leaveAndResetGrind()" style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--text-dim);background:transparent;color:var(--text-dim);font-size:13px;font-weight:600;cursor:pointer;">🚪 Leave Room & Reset (Start Fresh)</button>';
    }
 
    h += '</div>';
    
  } else {
    // ACTIVE COMBAT - show STOP button
    h += '<div style="background:var(--bg-card);border:2px solid var(--danger);border-radius:14px;padding:16px;margin-bottom:12px;text-align:center;">';
    h += '<div style="font-size:13px;color:var(--text-dim);margin-bottom:10px;">Wave ' + g.wave + ' in progress...</div>';
    h += '<button onclick="exitGrindRoom()" style="width:100%;padding:14px;border-radius:12px;border:2px solid var(--danger);background:var(--danger);color:white;font-size:15px;font-weight:700;cursor:pointer;">⏹ STOP GRIND</button>';
    h += '<div style="font-size:11px;color:var(--text-dim);margin-top:8px;">Returns to camp with current loot</div>';
    h += '</div>';
  }
  
  // Session summary (always visible)
  if (g.wave > 0) {
    h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">📊 This Session</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;">';
    h += '<div>Started: <span style="color:var(--text-dim);">' + new Date(g.sessionStart).toLocaleTimeString() + '</span></div>';
    h += '<div>Waves: <span style="color:var(--accent-light);">' + g.wave + '</span></div>';
    h += '<div>Total Kills: <span style="color:var(--accent-light);">' + g.totalKills + '</span></div>';
    h += '<div>Total XP: <span style="color:var(--xp);">' + g.totalXp + '</span></div>';
    h += '<div>Total Gold: <span style="color:var(--gold);">' + g.totalGold + '</span></div>';
    h += '<div>Avg/ Wave: <span style="color:var(--text-dim);">' + (g.wave > 0 ? Math.floor(g.totalXp / g.wave) : 0) + ' XP</span></div>';
    h += '</div></div>';
  }
  
  h += '</div>';
  return h;
}

function setGrindTier(tier) {
  G.endlessGrind.maxZoneLevel = tier;
  lg('📍 Max tier set to ' + tier);
  render();
}


function rMenu(){
  const items=[
    {i:'⚔️',l:'Adventure',d:'Explore zones and fight',a:'explore'},
    {i:'👥',l:'Party',d:'Manage companions',a:'party'},
    {i:'✨',l:'Skills',d:'View mage abilities',a:'skills'},
    {i:'⚒️',l:'Crafting',d:'Brew potions, forge gear',a:'craft'},
    {i:'📜',l:'Quests',d:'View active quests',a:'quest'},
    {i:'🎒',l:'Inventory',d:'Manage items',a:'inventory'},
    {i:'📖',l:'Bestiary',d:'Catalogue of defeated foes',a:'bestiary'},
    {i:'🏆',l:'Achievements',d:'Track your milestones',a:'achievements'},
    {i:'🌳',l:'Skill Trees',d:'Choose your specialization',a:'skilltree'},
    {i:'🌟',l:'Talents',d:'View planar talents (Lv.16+)',a:'talents'},
    {i:'💎',l:'Runes',d:'Socket runes into gear (Lv.20+)',a:'runes'},
    {i:'📖',l:'Journal',d:'Chronicles of your journey',a:'journal'},
    {i:'🌀',l:'Grind Room',d:'Endless wave battles',a:'grind_room'},
    {i:'🧳',l:'Traders',d:'Buy from wandering merchants',a:'npc'},
    {i:'🧘',l:'Focus Mode',d:'5–25 min ADHD timer',a:'focus'},
    {i:'💤',l:'Rest',d:'Find a safe place to rest',a:'rest'},
  ];
  let h='<div class="grid2">';
  for(let m of items)h+='<div class="card" data-a="'+m.a+'"><div class="cicon">'+m.i+'</div><div class="clabel">'+m.l+'</div><div class="cdesc">'+m.d+'</div></div>';
  h+='</div>';
  // Theme toggle row
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  h+='<div style="margin-top:12px;text-align:center;">';
  h+='<button onclick="toggleTheme()" style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:10px 20px;color:var(--text);font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;">';
  h+= isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
  h+='</button></div>';
  h+='<div style="margin-top:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;">';
  h+='<h3 style="font-size:14px;margin-bottom:10px;color:var(--accent-light);">Save Data</h3>';
  h+='<div style="display:flex;gap:8px;flex-wrap:wrap;">';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;" id="btn-save">Save Now</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:#374151;" id="btn-export">Export</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:#374151;" id="btn-import">Import</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:var(--danger);" id="btn-reset">Reset</button>';
  h+='</div>';
  h+='<div style="margin-top:8px;font-size:11px;color:var(--text-dim);">Auto-saves every 30 seconds</div>';
  h+='</div>';
  return h;
}

function rExp(){
  let h='<div class="explore-view"><h2 class="st">Adventure Zones</h2><div class="zlist">';
  for(let i=0;i<G.zones.length;i++){
    const z=G.zones[i],lk=G.p.lvl<z.lv;
    const dc=z.dg=='low'?'#22c55e':z.dg=='medium'?'#eab308':z.dg=='high'?'#f97316':z.dg=='very high'?'#ef4444':'#a855f7';
    const hazard = G.zoneHazards[z.n];
    h+='<div class="zcard '+(lk?'locked':'')+'" data-i="'+i+'"><div class="zh"><span class="zn">'+z.n+'</span><span class="zl">Lv.'+z.lv+(lk?' 🔒':'')+'</span></div><div class="zd">'+z.d+'</div>';
    if(hazard){
      h+='<div style="font-size:10px;color:#f59e0b;margin-bottom:6px;">⚠️ Hazard: '+hazard.desc+'</div>';
    }
    h+='<div class="zm"><span class="db" style="background:'+dc+'20;color:'+dc+'">'+z.dg+'</span><span class="xb">'+z.xp+' XP</span></div></div>';
  }
  h+='</div></div>'; return h;
}

function rCbt() {
  let h = '<div class="combat-view"><h2 class="st">' + (G.currentBoss ? '⚔️ BOSS FIGHT' : 'Combat') + '</h2>';
  
  const synDesc = getSynergyDesc();
  if (synDesc) {
    h += '<div style="background:#7c3aed15;border:1px solid var(--accent);border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:var(--accent-light);">';
    h += '✨ ' + synDesc + '</div>';
  }

  // Planar Resonance Indicator (Phase 2)
  const zone = G.zones.find(z => z.en.includes(G.cbt.en[0]?.n));
  if (zone && zone.elem) {
    const resStatus = getResonanceStatus(zone.n);
    h += '<div style="background:' + resStatus.color + '15;border:1px solid ' + resStatus.color + ';border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:' + resStatus.color + ';">';
    h += resStatus.icon + ' ' + resStatus.text + '</div>';
  }

  // Dimensional Instability Indicator (Phase 2)
  const riftStatus = getRiftStatus();
  if (riftStatus) {
    h += '<div style="background:' + riftStatus.color + '15;border:1px solid ' + riftStatus.color + ';border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:' + riftStatus.color + ';">';
    h += riftStatus.icon + ' ' + riftStatus.name + ': ' + riftStatus.desc + ' (' + riftStatus.fightsLeft + ' fights left)</div>';
  }
  
  h += '<button id="btn-auto" style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid ' + (G.cbt.autoCombat ? '#22c55e' : 'var(--disabled)') + ';background:' + (G.cbt.autoCombat ? '#22c55e15' : 'transparent') + ';color:' + (G.cbt.autoCombat ? '#22c55e' : 'var(--text-dim)') + ';font-size:12px;font-weight:600;cursor:pointer;margin-bottom:12px;user-select:none;">';
  h += (G.cbt.autoCombat ? '🤖 AUTO ON — Tap to take control' : '🤖 Auto-Combat — Let AI fight') + '</button>';

  // Potion button
  const potions = getCombatPotions();
  const usablePotions = potions.filter(p => {
    if (p.t === 'revive') return getDeadParty().length > 0;
    return true;
  });
  h += '<button onclick="togglePotionMenu()" style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid ' + (usablePotions.length > 0 ? '#22c55e' : 'var(--disabled)') + ';background:' + (usablePotions.length > 0 ? '#22c55e15' : 'transparent') + ';color:' + (usablePotions.length > 0 ? '#22c55e' : 'var(--disabled)') + ';font-size:12px;font-weight:600;cursor:' + (usablePotions.length > 0 ? 'pointer' : 'not-allowed') + ';margin-bottom:12px;user-select:none;">';
  h += (G.potionMenu ? '❌ Close Potion Bag' : '🧪 Use Potion (' + usablePotions.length + ' usable)') + '</button>';

  // Potion menu
  if (G.potionMenu && potions.length > 0) {
    h += '<div style="background:var(--bg-card);border:1px solid #22c55e;border-radius:12px;padding:10px;margin-bottom:12px;">';
    h += '<div style="font-size:11px;color:#22c55e;margin-bottom:8px;">🧪 Quick Potion Bag</div>';
    h += '<div style="display:flex;flex-direction:column;gap:6px;">';
    for (let i = 0; i < G.p.inv.length; i++) {
      const it = G.p.inv[i];
      // Regular potions (heal/mana)
      if ((it.t === 'pot' || it.t === 'food' || it.t === 'drink') && (it.eff === 'heal' || it.eff === 'mana')) {
        const isHeal = it.eff === 'heal';
        const icon = isHeal ? '❤️' : '💧';
        const color = isHeal ? '#ef4444' : '#3b82f6';
        const current = isHeal ? G.p.hp + '/' + G.p.mhp : G.p.mp + '/' + G.p.mmp;
        const full = isHeal ? G.p.hp >= G.p.mhp : G.p.mp >= G.p.mmp;
        h += '<button onclick="usePotionInCombat(' + i + ')" style="padding:10px 14px;border-radius:10px;border:1px solid ' + color + ';background:' + color + '15;color:' + (full ? 'var(--disabled)' : color) + ';font-size:12px;font-weight:600;cursor:' + (full ? 'not-allowed' : 'pointer') + ';display:flex;justify-content:space-between;align-items:center;opacity:' + (full ? '0.5' : '1') + ';">';
        h += '<span>' + icon + ' ' + it.n + (it.q > 1 ? ' x' + it.q : '') + '</span>';
        h += '<span>' + (full ? 'FULL' : '+' + it.v + ' ' + (isHeal ? 'HP' : 'MP')) + ' · ' + current + '</span>';
        h += '</button>';
      }
      // Revive items (Phoenix Feather, etc.)
      else if (it.t === 'revive') {
        const deadMembers = getDeadParty();
        const hasDead = deadMembers.length > 0;
        const color = hasDead ? '#f59e0b' : 'var(--disabled)';
        const icon = '🔥';
        h += '<button onclick="usePotionInCombat(' + i + ')" style="padding:10px 14px;border-radius:10px;border:1px solid ' + color + ';background:' + color + '15;color:' + color + ';font-size:12px;font-weight:600;cursor:' + (hasDead ? 'pointer' : 'not-allowed') + ';display:flex;justify-content:space-between;align-items:center;opacity:' + (hasDead ? '1' : '0.5') + ';">';
        h += '<span>' + icon + ' ' + it.n + (it.q > 1 ? ' x' + it.q : '') + '</span>';
        h += '<span>' + (hasDead ? 'Revive 50% HP' : 'No one to revive') + ' · ' + deadMembers.length + ' down</span>';
        h += '</button>';
      }
    }
    h += '</div></div>';
  }
  
  // Reuse zone variable from resonance check above
  if (zone && G.zoneHazards[zone.n]) {
    const haz = G.zoneHazards[zone.n];
    h += '<div style="background:#f59e0b15;border:1px solid #f59e0b;border-radius:12px;padding:8px;margin-bottom:12px;font-size:11px;color:#f59e0b;">';
    h += '⚠️ Zone Hazard: ' + haz.name + ' — ' + haz.desc + '</div>';
  }
  
  if (G.currentBoss) {
    h += '<div style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:10px;margin-bottom:12px;font-size:12px;color:var(--danger);">';
    h += '🔥 ' + G.currentBoss.desc + '</div>';
  }
  
  const playerAC = getPlayerAC();
  const eqStats = getEquippedStats();
  h += '<div style="display:flex;justify-content:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;">';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">AC </span><span style="font-weight:700;color:var(--accent-light);">' + playerAC + '</span>';
  if(eqStats.def > 0) h += '<span style="font-size:9px;color:var(--success);"> +' + eqStats.def + 'eq</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">PROF </span><span style="font-weight:700;color:var(--gold);">+' + DICE.proficiencyBonus(G.p.lvl) + '</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">ATK </span><span style="font-weight:700;color:var(--hp);">+' + (eqStats.atk + (G.p.eq.weapon?.atk||0)) + '</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">CRIT </span><span style="font-weight:700;color:var(--danger);">' + Math.floor(getTotalCritChance() * 100) + '%</span>';
  if(eqStats.critChance > 0) h += '<span style="font-size:9px;color:var(--success);"> +' + Math.floor(eqStats.critChance*100) + '%eq</span>';
  h += '</div>';
  h += '</div>';
  
  h += '<div class="erow">';
  for (let i = 0; i < G.cbt.en.length; i++) {
    const e = G.cbt.en[i], d = e.hp <= 0, s = G.cbt.tg == i && !d ? 'sel' : '';
    const immuneFire = ['Fire Imp', 'Lava Slug', 'Ash Wraith'].includes(e.n);
    const immuneIce = ['Ice Elemental', 'Frost Wolf', 'Frozen Knight'].includes(e.n);
    const isBoss = e.mechanic ? true : false;
    const enemyAC = getEnemyAC(e);
    
    h += '<div class="ecard ' + (d ? 'dead' : '') + ' ' + s + '" data-i="' + i + '" style="' + (isBoss ? 'border-color:var(--danger);box-shadow:0 0 10px #ef444440;' : '') + '">';
    h += '<div class="eicon">' + (d ? '💀' : ee(e.n)) + '</div>';
    h += '<div class="ename">' + e.n + (isBoss ? ' 👑' : '') + '</div>';
    
    if (!d) {
      h += '<div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">AC ' + enemyAC + '</div>';
    }
    
    if (!d && e.elem && e.elem !== 'none') {
      const elemIcon = e.elem === 'fire' ? '🔥' : e.elem === 'ice' ? '❄️' : e.elem === 'lightning' ? '⚡' : e.elem === 'void' ? '🌑' : '✦';
      h += '<div style="font-size:10px;color:#f59e0b;margin-top:2px;">' + elemIcon + ' ' + e.elem + '</div>';
    }
    
    if (!d && e.status && e.status.length > 0) {
      const statusIcons = e.status.map(s => s.type === 'burn' ? '🔥' : s.type === 'poison' ? '☠️' : s.type === 'shock' ? '⚡' : '✦').join('');
      h += '<div style="font-size:10px;color:var(--danger);margin-top:2px;">' + statusIcons + ' (' + e.status[0].turns + 't)</div>';
    }
    
    if (!d && (immuneFire || immuneIce)) {
      h += '<div class="e-immune">' + (immuneFire ? '🔥 Fire Immune' : (immuneIce ? '❄️ Ice Immune' : '')) + '</div>';
    }
    
    if (!d && e.mechanic === 'resurrect') {
      h += '<div style="font-size:10px;color:var(--danger);">💀 Lives: ' + (e.resurrectCount + 1) + '</div>';
    }
    
    if (!d && e.mechanic === 'phase') {
      h += '<div style="font-size:10px;color:var(--accent-light);">💎 Phase ' + e.currentPhase + '/' + e.phases + '</div>';
    }
    
    h += (d ? '<div class="dt">DEFEATED</div>' : '<div class="hps"><div class="bf bf-hp" style="width:' + ((e.hp / e.mhp) * 100) + '%"></div></div><div class="hpt">' + e.hp + '/' + e.mhp + '</div>') + '</div>';
  }
  h += '</div>';
  
  h += '<div class="pstat"><div class="mst"><span class="md" style="background:#7c3aed"></span>San ' + G.p.hp + '/' + G.p.mhp + ' AC' + playerAC + '</div>';
  for (let p of G.party) {
    if (p.on) {
      h += '<div class="mst"><span class="md" style="background:' + p.col + '"></span>' + p.n + ' ' + p.hp + '/' + p.mhp + '</div>';
    }
  }
  h += '</div>';
  
  h += '<div class="skills"><h3>Select Skill</h3><div class="slist">';
  
  const basicSel = G.cbt.sk === -1 && !G.cbt.autoCombat ? 'sel' : '';
  h += '<div class="sbtn ' + basicSel + '" data-i="-1" ' + (G.cbt.autoCombat ? 'style="opacity:0.4;cursor:not-allowed;"' : '') + '>';
  h += '<div class="sn">🪄 Staff Swing</div>';
  h += '<div class="sc">0 MP · Physical · 1d4 + STR</div>';
  h += '<div class="sd">Swing your staff when your spell slots are spent.</div>';
  h += '</div>';
  
    const ls = G.p.skills.filter(s => s.on);
  for (let i = 0; i < ls.length; i++) {
    const s = ls[i];
    const costLabel = typeof getSpellCostLabel === 'function'
      ? getSpellCostLabel(s)
      : (s.c + ' MP');
    const u = G.p.mp >= s.c && !G.cbt.autoCombat;
    const sel = G.cbt.sk == i && !G.cbt.autoCombat ? 'sel' : '';
    const critPct = Math.floor(getTotalCritChance() * 100);
    const highTier = Number(s.slotTier || 1) >= 4;
    const nameStyle = highTier ? ' style="color:#ef4444;font-weight:700;"' : '';
    
    h += '<div class="sbtn ' + (u ? '' : 'dis') + ' ' + sel + '" data-i="' + i + '" ' +
         (G.cbt.autoCombat ? 'style="opacity:0.4;cursor:not-allowed;"' : '') + '>';
    h += '<div class="sn"' + nameStyle + '>' + (s.buff ? '🛡️' : '⚡') + ' ' + s.n + '</div>';
    h += '<div class="sc">' + costLabel + ' · ' + (s.dmg || 'Buff') + ' · ' +
         critPct + '% Crit' + (G.cbt.autoCombat ? ' · 🤖 AUTO' : '') + '</div>';
    h += '<div class="sd">' + s.d + '</div>';
    if (s.elem) {
      const weakAgainst = s.elem === 'fire' ? 'Ice' : s.elem === 'ice' ? 'Fire' : s.elem === 'lightning' ? 'Void' : '';
      if (weakAgainst) {
        h += '<div style="font-size:10px;color:var(--success);">Strong vs: ' + weakAgainst + '</div>';
      }
    }
    h += '</div>';
  }
  h += '</div>';
  
  const isBasic = G.cbt.sk === -1;
  const sk = isBasic ? null : ls[G.cbt.sk];
  const ca = isBasic 
    ? (G.cbt.tg >= 0 && !G.cbt.autoCombat) 
    : (sk && G.p.mp >= sk.c && !G.cbt.autoCombat);
  const si = isBasic ? -1 : G.p.skills.indexOf(sk);
  
  h += '<button class="abtn ' + (ca ? '' : 'dis') + '" data-si="' + si + '" data-ti="' + G.cbt.tg + '" ' + (G.cbt.autoCombat ? 'disabled style="opacity:0.4;"' : '') + '>';
  h += (isBasic ? '🪄 Staff Swing' : 'Cast ' + (sk ? sk.n : '...')) + '</button>';
  h += '<button class="fbtn" ' + (G.cbt.autoCombat ? 'disabled style="opacity:0.4;"' : '') + '>Flee</button>';
 
   // === GRIND ROOM WAVE CONTROLS ===
  if (G.endlessGrind.active) {
    h += '<div style="background:var(--bg-card);border:2px solid var(--accent);border-radius:14px;padding:14px;margin-top:16px;text-align:center;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">⚔️ Grind Room · Wave ' + G.endlessGrind.wave + '</div>';
    
    if (G.endlessGrind.autoNext) {
      h += '<div style="font-size:12px;color:var(--success);">🤖 Auto-next: ON</div>';
    } else {
      h += '<button onclick="startGrindWave()" class="abtn" style="width:100%;margin-bottom:8px;">▶️ Next Wave</button>';
    }
    
    h += '<button onclick="exitGrindRoom()" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:13px;font-weight:600;cursor:pointer;">⏹ Stop & Exit</button>';
    h += '</div>';
  }
  // === END GRIND ROOM WAVE CONTROLS ===

  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:12px;margin-top:12px;">';
  h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">🎲 D&D Combat Rules</div>';
  h += '<div style="font-size:10px;color:var(--text-dim);line-height:1.6;">';
  h += '• Attack: d20 + PROF(+' + DICE.proficiencyBonus(G.p.lvl) + ') + Ability Mod vs Target AC<br>';
  h += '• Natural 20 = Critical Hit (double dice)<br>';
  h += '• Natural 1 = Critical Miss (auto-fail)<br>';
  h += '• Advantage: Roll 2d20, keep higher<br>';
  h += '• Your AC: ' + playerAC + ' | INT Mod: ' + (DICE.abilityMod(G.p.stats.int) >= 0 ? '+' : '') + DICE.abilityMod(G.p.stats.int);
  h += '</div></div>';
  
  h += '</div></div>';
  return h;
}


function rParty(){
  let h='<div class="party-view"><h2 class="st">Party</h2>';
  const activeSyns = getActiveSynergies();
  if(activeSyns.length > 0){
    h += '<div style="background:var(--bg-card);border:1px solid var(--accent);border-radius:14px;padding:12px;margin-bottom:16px;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">✨ Active Synergies</div>';
    h += '<div style="display:flex;flex-direction:column;gap:8px;">';
    for(let syn of activeSyns){
      h += '<div style="display:flex;align-items:center;gap:8px;font-size:12px;">';
      h += '<span style="font-size:16px;">' + syn.icon + '</span>';
      h += '<div style="flex:1;"><div style="font-weight:600;">' + syn.name + '</div>';
      h += '<div style="font-size:10px;color:var(--text-dim);">' + syn.desc + '</div></div>';
      h += '</div>';
    }
    h += '</div></div>';
  }
  h += '<div class="plist">';
  for(let p of G.party){
    h+='<div class="pcard '+(p.on?'':'locked')+'"><div class="pava" style="background:'+p.col+'20;border-color:'+p.col+'"><span style="font-size:28px">'+(p.on?re(p.r):'🔒')+'</span></div><div class="pinfo"><div class="pn">'+p.n+' <span class="pt">'+p.t+'</span></div><div class="pr" style="color:'+p.col+'">'+p.r+'</div><div class="pd">'+p.d+'</div><div class="pb">'+p.b+'</div>'+(p.on?'<div class="ps">HP:'+p.hp+'/'+p.mhp+' ATK:'+p.atk+(p.gear&&p.gear.atk?'(+'+p.gear.atk+')':'')+' DEF:'+p.def+(p.gear&&p.gear.def?'(+'+p.gear.def+')':'')+' SPD:'+p.spd+(p.gear&&p.gear.spd?'(+'+p.gear.spd+')':'')+(getBlessDef(p)?' <span style="color:var(--rest);font-weight:700;">🐱+10 DEF</span>':'')+'</div>':'')+(G.affinity[p.n]?'<div class="affinity-bar"><div class="affinity-fill '+getAffinityColor(G.affinity[p.n].val)+'" style="width:'+(G.affinity[p.n].val/G.affinity[p.n].max*100)+'%"></div></div><div class="affinity-label">'+(G.affinity[p.n].val>=70?'💕 Close':G.affinity[p.n].val>=40?'💛 Friendly':G.affinity[p.n].val>=20?'💔 Distant':'💀 Strained')+' ('+G.affinity[p.n].val+'/'+G.affinity[p.n].max+')</div>':'')
+(G.affinityUnlocks[p.n]?'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">'+G.affinityUnlocks[p.n].map(function(u){var un=p.affinityBonuses&&p.affinityBonuses.includes(u.id);return '<span title="'+u.d+'" style="font-size:9px;padding:2px 6px;border-radius:8px;border:1px solid '+(un?'var(--xp);color:var(--xp);':'var(--border);color:var(--text-dim);opacity:0.6;')+'">'+(un?'🌟 ':'🔒 ')+u.n+' ('+u.th+')</span>';}).join('')+'</div>':'')+'</div></div>';
    // === STAGE 1: ENHANCED TRINKET/GEAR SYSTEM ===
    if(p.on || p.ul <= G.p.lvl){
      h += '<div style="background:var(--bg-hover);border:1px solid var(--border);border-radius:10px;padding:10px;margin-top:8px;">';
      h += '<div style="font-size:11px;font-weight:600;color:var(--accent-light);margin-bottom:6px;">🎁 Trinket Slot</div>';
      if(p.gear){
        // Equipped trinket display with rarity color
        const rarityColor = p.gear.r ? (p.gear.r==='epic'?'#a855f7':p.gear.r==='rare'?'#3b82f6':p.gear.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
        h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
        h += '<span style="font-size:12px;font-weight:600;color:'+rarityColor+';">' + p.gear.n + '</span>';
        h += '<button class="unequip-pgear" data-member="' + p.n + '" style="padding:4px 10px;border-radius:8px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:11px;font-weight:600;cursor:pointer;">Unequip</button>';
        h += '</div>';
        h += '<div style="font-size:10px;color:var(--text-dim);">';
        const stats = [];
        if(p.gear.atk) stats.push('+ ' + p.gear.atk + ' ATK');
        if(p.gear.def) stats.push('+ ' + p.gear.def + ' DEF');
        if(p.gear.hp) stats.push('+ ' + p.gear.hp + ' HP');
        if(p.gear.mp) stats.push('+ ' + p.gear.mp + ' MP');
        if(p.gear.spd) stats.push('+ ' + p.gear.spd + ' SPD');
        h += stats.join(' · ') + '</div>';
        if(p.gear.d) h += '<div style="font-size:10px;color:var(--accent-light);margin-top:4px;font-style:italic;">' + p.gear.d + '</div>';
      } else {
        h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Empty trinket slot</div>';
        // Show ALL equippable pgear items (not just for this member)
        const allPgear = G.p.inv.map((it, idx) => ({it, idx})).filter(x => x.it.t === 'pgear');
        if(allPgear.length > 0){
          h += '<div style="display:flex;flex-direction:column;gap:4px;">';
          for(let eq of allPgear){
            const isForThis = !eq.it.for || eq.it.for === p.n;
            const rarityColor = eq.it.r ? (eq.it.r==='epic'?'#a855f7':eq.it.r==='rare'?'#3b82f6':eq.it.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
            if(isForThis){
              h += '<button class="equip-pgear" data-member="' + p.n + '" data-idx="' + eq.idx + '" style="padding:6px 10px;border-radius:8px;border:1px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:11px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
              h += '<span style="color:'+rarityColor+';">' + eq.it.n + '</span>';
              h += '<span style="font-size:10px;color:var(--text-dim);">Equip →</span>';
              h += '</button>';
            }
          }
          // Show incompatible items as disabled
          const incompatible = allPgear.filter(x => x.it.for && x.it.for !== p.n);
          if(incompatible.length > 0){
            h += '<div style="font-size:10px;color:var(--disabled);margin-top:4px;padding-top:4px;border-top:1px solid var(--border);">Not for ' + p.n + ':</div>';
            for(let eq of incompatible){
              h += '<div style="padding:4px 10px;border-radius:8px;background:var(--nav-bg);color:var(--disabled);font-size:10px;">' + eq.it.n + ' (' + eq.it.for + ' only)</div>';
            }
          }
          h += '</div>';
        } else {
          h += '<div style="font-size:10px;color:var(--disabled);margin-top:4px;">Buy trinkets from traders like Ribald, Deidre, or Nym.</div>';
        }
      }
      h += '</div>';
    }
  }
  h+='</div></div>'; return h;
}
function rSkills(){
  let h='<div class="skills-view"><h2 class="st">Mage Skills</h2><div class="sklist">';
  for(let s of G.p.skills){
    const st=s.on?'LEARNED':'Unlocks Lv.'+s.ul;
    h+='<div class="skcard '+(s.on?'':'locked')+'"><div class="skh"><span class="ski">'+(s.buff?'🛡️':'⚡')+'</span><span class="skt">'+s.n+'</span><span class="sks">'+st+'</span></div><div class="skd"><span class="dp">'+s.c+' MP</span><span class="dp">'+(s.dmg||'Buff')+'</span></div><div class="skdsc">'+s.d+'</div></div>';
  }
  h+='</div><div class="stb"><h3>Character Stats</h3>';
  for(let [k,v] of Object.entries(G.p.stats))h+='<div class="str"><span class="stn">'+k.toUpperCase()+'</span><span class="stv">'+v+'</span></div>';
  h+='</div></div>'; return h;
}

function getEquipScore(item) {
  if (!item || !item.slot) return 0;
  let score = 0;
  if (item.atk) score += item.atk * 3;
  if (item.def) score += item.def * 3;
  if (item.int) score += item.int * 2;
  if (item.str) score += item.str * 2;
  if (item.dex) score += item.dex * 2;
  if (item.con) score += item.con * 2;
  if (item.wis) score += item.wis * 2;
  if (item.cha) score += item.cha * 1;
  if (item.fireDmg) score += item.fireDmg * 2;
  if (item.iceDmg) score += item.iceDmg * 2;
  if (item.lightDmg) score += item.lightDmg * 2;
  if (item.voidDmg) score += item.voidDmg * 2;
  if (item.arcaneDmg) score += item.arcaneDmg * 2;
  if (item.lifeSteal) score += item.lifeSteal * 10;
  if (item.critChance) score += item.critChance * 20;
  if (item.mpRegen) score += item.mpRegen * 2;
  if (item.hpRegen) score += item.hpRegen * 2;
  return score;
}

function getEquipComparison(item) {
  if (!item || !item.slot) return null;
  const slot = item.slot === 'ring' ? (G.p.eq.ring1 ? 'ring2' : 'ring1') : item.slot;
  const equipped = G.p.eq[slot];
  if (!equipped) return { better: true, arrow: '▲', color: '#22c55e', text: 'New slot' };
  const itemScore = getEquipScore(item);
  const eqScore = getEquipScore(equipped);
  if (itemScore > eqScore) return { better: true, arrow: '▲', color: '#22c55e', text: 'Upgrade' };
  if (itemScore < eqScore) return { better: false, arrow: '▼', color: '#ef4444', text: 'Downgrade' };
  return { better: false, arrow: '●', color: '#9ca3af', text: 'Sidegrade' };
}

function rInv(){
  let h='<div class="inventory-view"><h2 class="st">Inventory</h2>';

  // Equipment Stats Summary
  const eqStats = getEquippedStats();
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:12px;margin-bottom:16px;">';
  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">⚔️ Equipment Bonuses</div>';
  h += '<div style="display:flex;flex-wrap:wrap;gap:6px;font-size:10px;">';
  const statLabels = {atk:'ATK',def:'DEF',str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA',
                      fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',
                      lifeSteal:'🩸Leech',critChance:'💥Crit',mpRegen:'💧MP+',hpRegen:'💚HP+',goldFind:'💰Gold'};
  for(let k in statLabels){
    if(eqStats[k] > 0){
      const val = k === 'critChance' || k.includes('Res') ? (eqStats[k]*100)+'%' : (k.includes('Regen') ? '+'+eqStats[k]+'/turn' : '+'+eqStats[k]);
      h += '<span style="background:var(--bg-hover);padding:3px 8px;border-radius:8px;">'+statLabels[k]+' '+val+'</span>';
    }
  }
  h += '</div></div>';

  // Equipped Gear
  h+='<div class="eqs"><h3>Equipped Gear</h3><div class="eqg">';
  const slotOrder = ['weapon','armor','head','hands','feet','ring1','ring2','amulet'];
  const slotIcons = {weapon:'⚔️',armor:'🛡️',head:'🎓',hands:'🧤',feet:'👢',ring1:'💍',ring2:'💍',amulet:'📿'};
  for(let sl of slotOrder){
    const it=G.p.eq[sl];
    const slotName = EQUIPMENT_SLOTS[sl].name;
    h+='<div class="esl" style="cursor:pointer;" onclick="unequipItem(\'"+sl+"\')">';
    h+='<div class="esn">'+slotIcons[sl]+' '+slotName+'</div>';
    if(it){
      h+='<div class="eit" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      let stats = [];
      if(it.atk) stats.push('ATK+'+it.atk);
      if(it.def) stats.push('DEF+'+it.def);
      if(it.int) stats.push('INT+'+it.int);
      if(it.str) stats.push('STR+'+it.str);
      if(it.dex) stats.push('DEX+'+it.dex);
      if(it.con) stats.push('CON+'+it.con);
      if(it.wis) stats.push('WIS+'+it.wis);
      if(it.cha) stats.push('CHA+'+it.cha);
      if(it.prefix) stats.push(it.prefixData.desc);
      if(it.suffix) stats.push(it.suffixData.desc);
      h+='<div class="est">'+stats.join(' · ')+'</div>';
    }else{
      h+='<div class="ese">Empty</div>';
    }
    h+='</div>';
  }
  h+='</div></div>';

  // Categorize inventory items
  const equipItems = [];
  const consumableItems = [];
  const matItems = [];
  const otherItems = [];
  
  for(let i=0; i<G.p.inv.length; i++){
    const it = G.p.inv[i];
    const isEquip = it.slot && it.slot !== 'mat' && it.slot !== 'pot' && it.slot !== 'revive' && it.t !== 'food' && it.t !== 'drink';
    if(isEquip) equipItems.push({item: it, index: i});
    else if(it.t==='pot' || it.t==='food' || it.t==='drink' || it.t==='revive') consumableItems.push({item: it, index: i});
    else if(it.t==='mat') matItems.push({item: it, index: i});
    else otherItems.push({item: it, index: i});
  }

  // Equipment section
  if(equipItems.length > 0){
    h+='<div class="its"><h3>🎒 Equipment ('+equipItems.length+')</h3><div class="ig">';
    for(let ei of equipItems){
      const it = ei.item;
      const i = ei.index;
      const cmp = getEquipComparison(it);
      h+='<div class="ic" style="position:relative;">';
      if(cmp){
        h+='<div style="position:absolute;top:6px;right:6px;font-size:14px;color:'+cmp.color+';font-weight:700;" title="'+cmp.text+'">'+cmp.arrow+'</div>';
      }
      h+='<div class="ii">'+(EQUIPMENT_SLOTS[it.slot]?.icon || '⚔️')+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.ilvl) h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      h += getItemSocketDisplay(it);
      let statLine = [];
      if(it.atk) statLine.push('ATK+'+it.atk);
      if(it.def) statLine.push('DEF+'+it.def);
      if(it.int) statLine.push('INT+'+it.int);
      if(it.str) statLine.push('STR+'+it.str);
      if(it.dex) statLine.push('DEX+'+it.dex);
      if(it.con) statLine.push('CON+'+it.con);
      if(it.wis) statLine.push('WIS+'+it.wis);
      if(it.cha) statLine.push('CHA+'+it.cha);
      if(it.prefix) statLine.push(it.prefixData.desc);
      if(it.suffix) statLine.push(it.suffixData.desc);
      if(statLine.length > 0) h+='<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">'+statLine.join(' · ')+'</div>';
      h+='<div class="iq">'+(it.value ? it.value+'G' : '')+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-e" data-i="'+i+'">Equip</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Consumables section
  if(consumableItems.length > 0){
    h+='<div class="its"><h3>🧪 Consumables ('+consumableItems.length+')</h3><div class="ig">';
    for(let ci of consumableItems){
      const it = ci.item;
      const i = ci.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.eff==='heal') h+='<div style="font-size:10px;color:var(--success);">+'+it.v+' HP</div>';
      if(it.eff==='mana') h+='<div style="font-size:10px;color:var(--mp);">+'+it.v+' MP</div>';
      if(it.eff==='revive') h+='<div style="font-size:10px;color:var(--accent-light);">Revive '+it.v+'% HP</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-u" data-i="'+i+'">Use</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Materials section
  if(matItems.length > 0){
    h+='<div class="its"><h3>💎 Materials ('+matItems.length+')</h3><div class="ig">';
    for(let mi of matItems){
      const it = mi.item;
      const i = mi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  // Other items
  if(otherItems.length > 0){
    h+='<div class="its"><h3>📦 Other ('+otherItems.length+')</h3><div class="ig">';
    for(let oi of otherItems){
      const it = oi.item;
      const i = oi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  if(G.p.inv.length==0) h+='<div class="ei">Your pack is empty.</div>';
  h+='</div>';
  return h;
}

function rCraft(){
  let h='<div class="craft-view"><h2 class="st">Crafting</h2><div class="rlist">';
  for(let i=0;i<G.recipes.length;i++){
    const r=G.recipes[i]; let ok=true,ms='';
    for(let [mn,mq] of Object.entries(r.m)){
      const iv=G.p.inv.find(x=>x.n==mn);
      const hv=iv?iv.q:0,en=hv>=mq;
      if(!en)ok=false;
      ms+='<span class="mp '+(en?'ok':'miss')+'">'+mn+': '+hv+'/'+mq+'</span>';
    }
    h+='<div class="rc"><div class="rr"><span class="ri">'+ie(r.res)+'</span><span class="rn" style="color:'+rc(r.res.r)+'">'+r.n+'</span><span class="rd">'+r.d+'</span></div><div class="rms">'+ms+'</div><button class="cb '+(ok?'':'dis')+'" data-i="'+i+'">Forge</button></div>';
  }
  h+='</div></div>'; return h;
}

function toggleQuestCollapse(key){
  G.questCollapsed[key] = !G.questCollapsed[key];
  render();
}

function rQuest(){
  let h='<div class="quest-view">';
    // === DAILY LOGIN REWARDS ===
  const today = G.gameDay || 0;
  const streak = G.loginStreak || 0;
  const claimedToday = G.loginClaimed || false;

  const loginRewards = [
    { day: 1, icon: '💰', name: 'Gold Pouch', g: 50, xp: 25 },
    { day: 2, icon: '💧', name: 'Mana Crystal', mp: 30, xp: 35 },
    { day: 3, icon: '🧪', name: 'Health Potion', hp: 50, xp: 45 },
    { day: 4, icon: '💎', name: 'Gem Shard', g: 100, xp: 60 },
    { day: 5, icon: '⚔️', name: 'Mystic Scroll', g: 150, xp: 80 },
    { day: 6, icon: '🔮', name: 'Arcane Orb', mp: 50, xp: 100 },
    { day: 7, icon: '👑', name: 'Legendary Cache', g: 300, xp: 200, item: { n: 'Phoenix Feather', t: 'revive', eff: 'revive', v: 50, q: 1, r: 'rare' } }
  ];

  const todayReward = loginRewards[Math.min(streak, 6)];

  h += '<div style="background: linear-gradient(135deg, var(--accent), #6d28d9); border-radius: 16px; padding: 16px; margin-bottom: 16px; color: white;">';
  h += '<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">';
  h += '<div style="font-size: 28px;">🎁</div>';
  h += '<div><div style="font-weight: 700; font-size: 16px;">Daily Login Reward</div>';
  h += '<div style="font-size: 11px; opacity: 0.9;">Day ' + (streak + 1) + ' · Streak: ' + streak + '</div></div>';
  h += '</div>';

  h += '<div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px; margin-bottom: 12px;">';
  h += '<div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">Today\'s Reward:</div>';
  h += '<div style="display: flex; align-items: center; gap: 8px;">';
  h += '<div style="font-size: 32px;">' + todayReward.icon + '</div>';
  h += '<div style="flex: 1;">';
  h += '<div style="font-weight: 600; font-size: 14px;">' + todayReward.name + '</div>';
  h += '<div style="font-size: 11px; opacity: 0.85;">';
  const rewardParts = [];
  if (todayReward.g) rewardParts.push('+' + todayReward.g + 'G');
  if (todayReward.xp) rewardParts.push('+' + todayReward.xp + 'XP');
  if (todayReward.hp) rewardParts.push('+' + todayReward.hp + 'HP');
  if (todayReward.mp) rewardParts.push('+' + todayReward.mp + 'MP');
  if (todayReward.item) rewardParts.push(todayReward.item.n);
  h += rewardParts.join(' · ');
  h += '</div></div></div></div>';

  // Streak progress dots
  h += '<div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 12px;">';
  for (let i = 0; i < 7; i++) {
    const isActive = i < streak;
    const isToday = i === streak;
    h += '<div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; ' + 
      (isActive ? 'background: #fbbf24; color: #000;' : 
       isToday ? 'background: white; color: var(--accent); border: 2px solid #fbbf24;' : 
       'background: rgba(255,255,255,0.2); color: white;') + '">' + (i + 1) + '</div>';
  }
  h += '</div>';

  if (claimedToday) {
    h += '<button disabled style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: rgba(255,255,255,0.2); color: white; font-size: 13px; font-weight: 600; opacity: 0.6; cursor: not-allowed;">✅ Claimed Today — Come Back Tomorrow!</button>';
  } else {
    h += '<button id="btn-claim-login" style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: #fbbf24; color: #000; font-size: 13px; font-weight: 700; cursor: pointer;">🎁 Claim Reward</button>';
  }
  h += '</div>';
  // === END DAILY LOGIN ===

  // Storyline section
  h+='<h2 class="st">📖 Storyline</h2><div class="qlist">';
  for(let s of G.storyline){
    if(!s.unlocked) continue;
    const pc=Math.min(100,(G.p.lvl/s.need)*100);
    h+='<div class="qc '+(s.done?'done':'')+'" style="border-color:var(--accent-light);"><div class="qh"><span class="qn">'+(s.done?'✅ ':'')+'Ch.'+s.chapter+': '+s.n+'</span><span class="qr">'+s.rw.xp+' XP | '+s.rw.g+' G</span></div>';
    h+='<div class="qd">'+s.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">Lv.'+G.p.lvl+'/'+s.need+'</span></div></div>';
  }
  h+='</div>';
  // Active quests section
  h+='<h2 class="st" style="margin-top:20px;">📜 Active Quests</h2><div class="qlist">';
  for(let q of G.quests){
    if(q.hidden && !q.revealed) continue;
    const pc=Math.min(100,(q.c/q.need)*100);
    const timerStatus=getTimerStatus(q);
    let cardClass=q.done?'done':(q.expired?'expired':(timerStatus?(timerStatus.cls==='timer-urgent'?'timed-urgent':'timed'):''));
    h+='<div class="qc '+cardClass+'"><div class="qh"><span class="qn">'+(q.done?'✅ ':(q.expired?'❌ ':''))+q.n+'</span><span class="qr">'+q.rw.xp+' XP | '+q.rw.g+' G</span></div>';
    if(q.chain){
      h+='<div style="font-size:10px;color:var(--accent-light);margin-bottom:4px;">🔗 Chain: '+q.chain+'</div>';
    }
    if(q.reqQuest && !q.revealed){
      const req=G.quests.find(rq=>rq.id===q.reqQuest);
      h+='<div style="font-size:10px;color:var(--text-dim);font-style:italic;margin-bottom:4px;">🔒 Requires: '+(req?req.n:'Unknown')+'</div>';
    }
    h+='<div class="qd">'+q.d+'</div>';
    if(timerStatus){
      h+='<div class="timer-bar"><div class="timer-fill '+timerStatus.cls+'" style="width:'+timerStatus.pct+'%"></div></div>';
      h+='<div class="timer-label">⏰ '+timerStatus.label+'</div>';
    }
    h+='<div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+Math.min(q.c,q.need)+'/'+q.need+'</span></div></div>';
  }
  h+='</div>';
    // Daily Quests section
  h += '<h2 class="st" style="margin-top:20px;">📋 Daily Quests</h2><div class="qlist">';
  generateDailyQuests();
  if (G.dailyQuests.length === 0) {
    h += '<div class="qc"><div class="qd">No daily quests available. Check back tomorrow!</div></div>';
  } else {
    for (let q of G.dailyQuests) {
      const pc = Math.min(100, (q.c / q.need) * 100);
      h += '<div class="qc ' + (q.done ? 'done' : '') + '"><div class="qh"><span class="qn">' + q.n + '</span><span class="qr">' + q.rw.xp + ' XP | ' + q.rw.g + ' G</span></div>';
      h += '<div class="qd">' + q.d + '</div><div class="qp"><div class="pbar"><div class="pfill" style="width:' + pc + '%"></div></div><span class="ptxt">' + q.c + '/' + q.need + '</span></div></div>';
    }
  }
  h += '</div>';
    // Bounties section
  const activeBounties = G.bounties.filter(b => !b.done && G.p.lvl >= (b.minLv || 1));
  const doneBounties = G.bounties.filter(b => b.done);
  if (activeBounties.length > 0 || doneBounties.length > 0) {
    h+='<h2 class="st" style="margin-top:20px;">💰 Bounties</h2>';
    if (activeBounties.length > 0) {
      h+='<div class="qlist">';
      for(let b of activeBounties){
        const pc=Math.min(100,(b.c/b.need)*100);
        h+='<div class="qc"><div class="qh"><span class="qn">'+b.n+'</span><span class="qr">'+b.rw.xp+' XP | '+b.rw.g+' G</span></div>';
        h+='<div class="qd">'+b.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+b.c+'/'+b.need+'</span></div></div>';
      }
      h+='</div>';
    }
    if (doneBounties.length > 0) {
      const collapsed = G.questCollapsed['__bounties_done__'];
      h+='<div style="margin-top:12px;">';
      h+='<div onclick="toggleQuestCollapse(\'__bounties_done__\')" style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:12px 16px;background:var(--bg-hover);border-radius:14px;border:1px solid var(--border);user-select:none;">';
      h+='<span style="font-size:12px;transition:transform 0.2s;display:inline-block;' + (collapsed ? '' : 'transform:rotate(90deg);') + '">▶</span>';
      h+='<span style="font-size:14px;font-weight:600;color:var(--success);">✅ Claimed</span>';
      h+='<span style="font-size:12px;color:var(--text-dim);margin-left:auto;">' + doneBounties.length + '</span>';
      h+='</div>';
      if (!collapsed) {
        h+='<div class="qlist" style="margin-top:8px;">';
        for(let b of doneBounties){
          h+='<div class="qc done" style="opacity:0.55;"><div class="qh"><span class="qn" style="text-decoration:line-through;">'+b.n+'</span><span class="qr" style="color:var(--success);">✓</span></div>';
          h+='<div class="qd">'+b.d+'</div></div>';
        }
        h+='</div>';
      }
      h+='</div>';
    }
  }
  h+='</div>';
  h+='<div class="sum"><div class="si2"><span class="sv">'+G.p.kills+'</span><span class="sl">Monsters</span></div><div class="si2"><span class="sv">'+G.p.quests+'</span><span class="sl">Quests</span></div><div class="si2"><span class="sv">'+G.p.fstreak+'</span><span class="sl">Focus</span></div></div></div>';
  return h;
}

function rFocus(){
  // If focus is not active, show the session picker
  if (!G.fs || G.state !== 'focus') {
    let h = '<div class="fv">';
    h += '<div style="font-size:42px;margin-bottom:8px;">🧘</div>';
    h += '<div class="fl" style="font-size:18px;font-weight:700;margin-bottom:4px;">Focus Mode</div>';
    h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:20px;">Pick a session length</div>';
    h += '<div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:0 auto;">';
    const sessions = [
      {m:5, xp:20, g:10, label:'Quick Sprint'},
      {m:10, xp:40, g:20, label:'Short Burst'},
      {m:15, xp:60, g:30, label:'Deep Work'},
      {m:20, xp:80, g:40, label:'Extended Flow'},
      {m:25, xp:100, g:50, label:'Full Pomodoro'}
    ];
    for (let s of sessions) {
      h += '<button class="focus-session-btn" data-min="' + s.m + '" style="padding:14px 18px;border-radius:14px;border:2px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
      h += '<span>' + s.m + ' min — ' + s.label + '</span>';
      h += '<span style="font-size:11px;color:var(--success);">+' + s.xp + 'XP +' + s.g + 'G</span>';
      h += '</button>';
    }
    h += '</div>';
    h += '<div class="ftips" style="margin-top:20px;"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward scales with session length!</li></ul></div>';
    h += '</div>';
    return h;
  }
  // Active focus session
  const el=Date.now()-(G.fs||Date.now()),rm=Math.max(0,G.fd-el);
  const m=Math.floor(rm/60000),s=Math.floor((rm%60000)/1000);
  return '<div class="fv"><div class="fc"><div class="ft" id="ft">'+m+':'+s.toString().padStart(2,'0')+'</div><div class="fl">Focus Mode — ' + (G.focusDuration || 25) + ' min</div></div><div class="ftips"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward: +' + ((G.focusDuration||25)*4) + ' XP when done!</li></ul></div><button class="cfb">Cancel</button></div>';
}

function rTemple() {
  const dead = getDeadParty();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">⛪ Temple of Resurrection</h2>';
  h2 += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ancient magic restores fallen companions. Cost: 50G each.</div>';
  if(dead.length === 0){
    h2 += '<div style="text-align:center;padding:20px;color:var(--success);">✨ All companions are alive!</div>';
  }else{
    h2 += '<div style="margin-bottom:12px;">';
    for(let p of G.party){
      const isDead = p.hp <= 0;
      const canAfford = G.p.gold >= 50;
      h2 += '<div class="temple-revive ' + (isDead ? 'dead' : 'alive') + '">';
      h2 += '<div class="tr-ava" style="background:' + p.col + '20;border-color:' + p.col + '">' + (isDead ? '💀' : re(p.r)) + '</div>';
      h2 += '<div class="tr-info">';
      h2 += '<div class="tr-name">' + p.n + '</div>';
      h2 += '<div class="tr-status ' + (isDead ? '' : 'alive') + '">' + (isDead ? '💀 FALLEN' : '✅ Alive ' + p.hp + '/' + p.mhp) + '</div>';
      h2 += '</div>';
      if(isDead) h2 += '<button class="tr-btn ' + (canAfford ? '' : 'dis') + '" data-m="' + p.n + '">' + (canAfford ? 'Revive (50G)' : 'Need 50G') + '</button>';
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  return h2;
}

function rRest() {
  const dead = getDeadParty();
  if(dead.length > 0 && !G.rest.active) return rTemple();

  if (G.rest.active && G.rest.selectedSite) {
    const site = G.rest.selectedSite;
    const currentTick = G.rest.tick;
    const maxTicks = G.rest.maxTicks;
    const pct = (currentTick / maxTicks) * 100;
    const healerName = getHealerName();
    let h2 = '<div class="rest-view">';
    h2 += '<h2 class="st">🔥 Resting at ' + site.name + '</h2>';
    if (G.ambushWarning) {
      h2 += '<div class="ambush-warning">';
      h2 += '<div class="aw-text">⚠️ ' + G.ambushWarning.text + '</div>';
      h2 += '</div>';
    }
    if (G.currentDialogue && !G.ambushWarning) {
      h2 += '<div class="dialogue-box">';
      h2 += '<div class="d-speaker">' + G.currentDialogue.speaker + '</div>';
      h2 += '<div class="d-text">' + G.currentDialogue.text + '</div>';
      h2 += '</div>';
    }
    h2 += '<div class="tick-track">';
    for (let i = 1; i <= maxTicks; i++) {
      let tickClass = '';
      let tickIcon = '○';
      if (i < currentTick) {
        tickClass = 'done';
        tickIcon = '✓';
      } else if (i === currentTick) {
        tickClass = 'current';
        tickIcon = '🔥';
      }
      h2 += '<div class="tick ' + tickClass + '">' + tickIcon + '</div>';
    }
    h2 += '</div>';
    h2 += '<div class="tick-label">Tick ' + currentTick + '/' + maxTicks + '</div>';
    h2 += '<div class="rest-progress" style="margin-top:16px;">';
    h2 += '<div class="rest-bar"><div class="rest-fill" style="width:' + pct + '%"></div></div>';
    h2 += '<div class="rest-healer ok">💚 ' + healerName + ' is tending to the party</div>';
    h2 += '</div>';
    h2 += '<button class="rest-cancel" id="cancel-rest">Cancel Rest (Partial Recovery)</button>';
    h2 += '</div>';
    return h2;
  }

  const healerOk = hasHealer();
  const healerName = getHealerName();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">💤 Rest</h2>';
  if (healerOk) {
    h2 += '<div class="rest-healer ok" style="background:#22c55e15;border:1px solid var(--success);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--success);">💚 Healer Available: ' + healerName + '</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">5 ticks, 1.5s each. Dialogue every tick. Ambush chance: 15% camp / 5% tavern.</div>';
    h2 += '</div>';
  } else {
    h2 += '<div class="rest-healer fail" style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--danger);">❌ No Healer in Party</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">You need a healer (like Eliz) in your active party to rest safely.</div>';
    h2 += '</div>';
  }
  const soelActive = G.party.some(p => p.n === 'Soel' && p.on);
  h2 += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;text-align:left;">';
  h2 += '<div style="font-size:13px;font-weight:600;color:var(--rest);margin-bottom:4px;">🐱 Soel\'s Spirit Blessing</div>';
  if (!soelActive) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Soel must be in your active party to share his blessing.</div>';
  } else if (G.soelBlessing) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Blessing rests on <b style="color:var(--text);">' + G.soelBlessing.target + '</b> (+' + G.soelBlessing.def + ' DEF). One blessing per rest \u2014 it fades when you next make camp.</div>';
  } else {
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">One member per rest receives +10 DEF until your next rest.</div>';
    h2 += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    for (let m of G.party) {
      if (!m.on || m.n === 'Soel') continue;
      h2 += '<button class="soel-bless-btn" data-n="' + m.n + '" style="padding:6px 12px;border-radius:10px;border:1px solid var(--rest);background:#10b98115;color:var(--text);font-size:11px;font-weight:600;cursor:pointer;">' + m.n + '</button>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div class="rest-sites">';
  const zones = {};
  for (let site of G.rest.sites) {
    if (!zones[site.zone]) zones[site.zone] = [];
    zones[site.zone].push(site);
  }
  for (let zoneName in zones) {
    const sites = zones[zoneName];
    const anyUnlocked = sites.some(s => s.unlocked);
    if (!anyUnlocked) continue;
    h2 += '<div style="margin-bottom:12px;">';
    h2 += '<div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">' + zoneName + '</div>';
    for (let site of sites) {
    let manaSpringRemaining = 8;
    if (G.manaSpringUses.day === G.gameDay) {
        manaSpringRemaining = 8 - G.manaSpringUses.count;
      }
      const isDepletedManaSpring = site.type === 'mana_spring' && manaSpringRemaining <= 0;

      const locked = !site.unlocked || isDepletedManaSpring;

      const canAfford = !site.cost || G.p.gold >= site.cost;
      const canRest = (site.type === 'mana_spring' || site.type === 'temple' || healerOk) && !locked && canAfford;
      h2 += '<div class="rs-card ' + (locked ? 'locked' : '') + '" data-id="' + site.id + '">';
      h2 += '<div class="rs-head">';
      h2 += '<span class="rs-name">' + site.icon + ' ' + site.name + '</span>';
      h2 += '<span class="rs-type ' + site.type + '">' + site.type.toUpperCase() + '</span>';
      h2 += '</div>';
      h2 += '<div class="rs-desc">' + site.desc + '</div>';
            if (locked) {
            if (isDepletedManaSpring) {
          h2 += '<div class="rs-req fail">💧 Daily limit reached (8/8 uses)</div>';

        } else {
          h2 += '<div class="rs-req fail">🔒 Requires Level ' + site.zoneLv + ' to discover</div>';
        }
      } else if (site.cost) {

                const msUsesLeft = site.type === 'mana_spring' ? ' (' + manaSpringRemaining + '/8 today)' : '';
        h2 += '<div class="rs-req ' + (canAfford ? 'ok' : 'fail') + '">' + (canAfford ? '✅' : '❌') + ' Cost: ' + site.cost + 'G' + msUsesLeft + ' · Ambush: 5% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';


      } else {
        h2 += '<div class="rs-req ' + (healerOk ? 'ok' : 'fail') + '">' + (healerOk ? '✅' : '❌') + ' Free · Ambush: 15% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';
      }
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:8px;">Rest takes ~7.5 seconds. Party banter every tick. Taverns cost gold but are safer.</div>';
  h2 += '</div>';
  return h2;
}

function rTalents(){
  let h='<div style="padding:16px;"><h2 class="st">🌟 Planar Talents</h2>';
  h+='<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;text-align:center;">Unlock every 2 levels starting at 16</div>';
  h+='<div style="display:flex;flex-direction:column;gap:10px;">';
  for(let t of TALENTS){
    const unlocked=G.talents.includes(t.id);
    const canUnlock=G.p.lvl>=t.lv;
    h+='<div style="background:var(--bg-card);border:2px solid '+(unlocked?'#22c55e':canUnlock?'#a78bfa':'#6b7280')+';border-radius:14px;padding:14px;opacity:'+(canUnlock?'1':'0.5')+';">';
    h+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">';
    h+='<span style="font-size:24px;">'+t.icon+'</span>';
    h+='<div style="flex:1;"><div style="font-weight:700;font-size:15px;color:'+(unlocked?'#22c55e':canUnlock?'var(--text)':'var(--text-dim)')+';">'+(unlocked?'✅ ':'')+t.name+'</div>';
    h+='<div style="font-size:11px;color:var(--text-dim);">Lv.'+t.lv+'</div></div>';
    h+='</div>';
    h+='<div style="font-size:12px;color:var(--text-dim);line-height:1.4;">'+t.desc+'</div>';
    if(unlocked) h+='<div style="font-size:11px;color:#22c55e;margin-top:6px;font-weight:600;">✨ ACTIVE</div>';
    else if(!canUnlock) h+='<div style="font-size:11px;color:var(--danger);margin-top:6px;">🔒 Requires Level '+t.lv+'</div>';
    h+='</div>';
  }
  h+='</div>';
  h+='<div style="margin-top:16px;font-size:11px;color:var(--text-dim);text-align:center;">'+G.talents.length+'/'+TALENTS.length+' talents unlocked</div>';
  h+='</div>';
  return h;
}

function rGrindRoom() {
  const g = G.endlessGrind;
  let h = '<div class="content">';
  
  h += '<div class="st" style="text-align:center;">⚔️ Endless Grind Room</div>';
  
  // Stats bar
  h += '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:12px;flex-wrap:wrap;">';
  h += '<span class="mst">Wave: <b>' + g.wave + '</b></span>';
  h += '<span class="mst">Kills: <b>' + g.totalKills + '</b></span>';
  h += '<span class="mst">XP: <b>' + g.totalXp + '</b></span>';
  h += '<span class="mst" style="color:var(--gold)">Gold: <b>' + g.totalGold + '</b></span>';
  h += '</div>';
  
  // Difficulty badge
  const diffColors = { normal: '#22c55e', hard: '#f59e0b', nightmare: '#ef4444' };
  h += '<div style="text-align:center;margin-bottom:16px;">';
  h += '<span style="font-size:11px;padding:4px 12px;border-radius:10px;background:' + diffColors[g.difficulty] + '20;color:' + diffColors[g.difficulty] + ';font-weight:600;text-transform:uppercase;">';
  h += g.difficulty + ' (×' + g.difficultyMult[g.difficulty] + ')</span>';
  h += '</div>';
  
  // MAIN CONTROLS
  if (!g.active) {
    // Between waves or fresh start
    h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:12px;">';
    
    if (g.wave === 0) {
      // FRESH START - show all settings
      h += '<div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--accent-light);">Grind Settings</div>';
      
      // Tier selector
      h += '<div style="margin-bottom:12px;">';
      h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Max Zone Tier</div>';
      h += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
      const maxTier = Math.min(G.p.lvl, 23);
      for (let t = 1; t <= maxTier; t++) {
        const z = G.zones.find(zn => zn.lv === t);
        const name = z ? z.n.split(' ')[0] : 'Lv' + t;
        const isSel = g.maxZoneLevel === t;
        h += '<button onclick="setGrindTier(' + t + ')" style="padding:6px 10px;border-radius:8px;border:1px solid ' + (isSel ? 'var(--accent)' : 'var(--border)') + ';background:' + (isSel ? 'var(--accent)' : 'var(--bg-card)') + ';color:' + (isSel ? 'white' : 'var(--text)') + ';font-size:11px;cursor:pointer;">' + name + '</button>';
      }
      h += '</div></div>';
      
      // Difficulty toggle
      h += '<div style="margin-bottom:12px;">';
      h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Difficulty</div>';
      h += '<div style="display:flex;gap:6px;">';
      const diffs = ['normal', 'hard', 'nightmare'];
      for (let d of diffs) {
        const isSel = g.difficulty === d;
        h += '<button onclick="toggleGrindDifficulty()" style="flex:1;padding:8px;border-radius:8px;border:1px solid ' + (isSel ? diffColors[d] : 'var(--border)') + ';background:' + (isSel ? diffColors[d] + '20' : 'var(--bg-card)') + ';color:' + (isSel ? diffColors[d] : 'var(--text-dim)') + ';font-size:12px;font-weight:600;cursor:pointer;">' + d + '</button>';
      }
      h += '</div></div>';
      
      // Auto-next toggle
      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">';
      h += '<input type="checkbox" id="grind-autonext" ' + (g.autoNext ? 'checked' : '') + ' onchange="toggleAutoNext()" style="width:18px;height:18px;accent-color:var(--accent);">';
      h += '<label for="grind-autonext" style="font-size:13px;cursor:pointer;">Auto-start next wave</label>';
      h += '</div>';
      
      h += '<button onclick="enterGrindRoom()" class="abtn" style="width:100%;">Start Grinding</button>';
      
        } else {
      // BETWEEN WAVES - show Next Wave, Stop, and Leave options
      h += '<div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--accent-light);">Wave ' + g.wave + ' Complete!</div>';
      h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ready for the next wave?</div>';
      
      h += '<button onclick="startGrindWave()" class="abtn" style="width:100%;margin-bottom:8px;">▶️ Next Wave</button>';
      h += '<button onclick="exitGrindRoom()" style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:14px;font-weight:600;cursor:pointer;margin-bottom:8px;">⏹ Stop & Collect Loot</button>';
      
      // NEW: Leave and reset button
      h += '<button onclick="leaveAndResetGrind()" style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--text-dim);background:transparent;color:var(--text-dim);font-size:13px;font-weight:600;cursor:pointer;">🚪 Leave Room & Reset (Start Fresh)</button>';
    }
 
    h += '</div>';
    
  } else {
    // ACTIVE COMBAT - show STOP button
    h += '<div style="background:var(--bg-card);border:2px solid var(--danger);border-radius:14px;padding:16px;margin-bottom:12px;text-align:center;">';
    h += '<div style="font-size:13px;color:var(--text-dim);margin-bottom:10px;">Wave ' + g.wave + ' in progress...</div>';
    h += '<button onclick="exitGrindRoom()" style="width:100%;padding:14px;border-radius:12px;border:2px solid var(--danger);background:var(--danger);color:white;font-size:15px;font-weight:700;cursor:pointer;">⏹ STOP GRIND</button>';
    h += '<div style="font-size:11px;color:var(--text-dim);margin-top:8px;">Returns to camp with current loot</div>';
    h += '</div>';
  }
  
  // Session summary (always visible)
  if (g.wave > 0) {
    h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">📊 This Session</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;">';
    h += '<div>Started: <span style="color:var(--text-dim);">' + new Date(g.sessionStart).toLocaleTimeString() + '</span></div>';
    h += '<div>Waves: <span style="color:var(--accent-light);">' + g.wave + '</span></div>';
    h += '<div>Total Kills: <span style="color:var(--accent-light);">' + g.totalKills + '</span></div>';
    h += '<div>Total XP: <span style="color:var(--xp);">' + g.totalXp + '</span></div>';
    h += '<div>Total Gold: <span style="color:var(--gold);">' + g.totalGold + '</span></div>';
    h += '<div>Avg/ Wave: <span style="color:var(--text-dim);">' + (g.wave > 0 ? Math.floor(g.totalXp / g.wave) : 0) + ' XP</span></div>';
    h += '</div></div>';
  }
  
  h += '</div>';
  return h;
}

function setGrindTier(tier) {
  G.endlessGrind.maxZoneLevel = tier;
  lg('📍 Max tier set to ' + tier);
  render();
}


function rMenu(){
  const items=[
    {i:'⚔️',l:'Adventure',d:'Explore zones and fight',a:'explore'},
    {i:'👥',l:'Party',d:'Manage companions',a:'party'},
    {i:'✨',l:'Skills',d:'View mage abilities',a:'skills'},
    {i:'⚒️',l:'Crafting',d:'Brew potions, forge gear',a:'craft'},
    {i:'📜',l:'Quests',d:'View active quests',a:'quest'},
    {i:'🎒',l:'Inventory',d:'Manage items',a:'inventory'},
    {i:'📖',l:'Bestiary',d:'Catalogue of defeated foes',a:'bestiary'},
    {i:'🏆',l:'Achievements',d:'Track your milestones',a:'achievements'},
    {i:'🌳',l:'Skill Trees',d:'Choose your specialization',a:'skilltree'},
    {i:'🌟',l:'Talents',d:'View planar talents (Lv.16+)',a:'talents'},
    {i:'💎',l:'Runes',d:'Socket runes into gear (Lv.20+)',a:'runes'},
    {i:'📖',l:'Journal',d:'Chronicles of your journey',a:'journal'},
    {i:'🌀',l:'Grind Room',d:'Endless wave battles',a:'grind_room'},
    {i:'🧳',l:'Traders',d:'Buy from wandering merchants',a:'npc'},
    {i:'🧘',l:'Focus Mode',d:'5–25 min ADHD timer',a:'focus'},
    {i:'💤',l:'Rest',d:'Find a safe place to rest',a:'rest'},
  ];
  let h='<div class="grid2">';
  for(let m of items)h+='<div class="card" data-a="'+m.a+'"><div class="cicon">'+m.i+'</div><div class="clabel">'+m.l+'</div><div class="cdesc">'+m.d+'</div></div>';
  h+='</div>';
  // Theme toggle row
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  h+='<div style="margin-top:12px;text-align:center;">';
  h+='<button onclick="toggleTheme()" style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:10px 20px;color:var(--text);font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;">';
  h+= isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
  h+='</button></div>';
  h+='<div style="margin-top:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;">';
  h+='<h3 style="font-size:14px;margin-bottom:10px;color:var(--accent-light);">Save Data</h3>';
  h+='<div style="display:flex;gap:8px;flex-wrap:wrap;">';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;" id="btn-save">Save Now</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:#374151;" id="btn-export">Export</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:#374151;" id="btn-import">Import</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:var(--danger);" id="btn-reset">Reset</button>';
  h+='</div>';
  h+='<div style="margin-top:8px;font-size:11px;color:var(--text-dim);">Auto-saves every 30 seconds</div>';
  h+='</div>';
  return h;
}

function rExp(){
  let h='<div class="explore-view"><h2 class="st">Adventure Zones</h2><div class="zlist">';
  for(let i=0;i<G.zones.length;i++){
    const z=G.zones[i],lk=G.p.lvl<z.lv;
    const dc=z.dg=='low'?'#22c55e':z.dg=='medium'?'#eab308':z.dg=='high'?'#f97316':z.dg=='very high'?'#ef4444':'#a855f7';
    const hazard = G.zoneHazards[z.n];
    h+='<div class="zcard '+(lk?'locked':'')+'" data-i="'+i+'"><div class="zh"><span class="zn">'+z.n+'</span><span class="zl">Lv.'+z.lv+(lk?' 🔒':'')+'</span></div><div class="zd">'+z.d+'</div>';
    if(hazard){
      h+='<div style="font-size:10px;color:#f59e0b;margin-bottom:6px;">⚠️ Hazard: '+hazard.desc+'</div>';
    }
    h+='<div class="zm"><span class="db" style="background:'+dc+'20;color:'+dc+'">'+z.dg+'</span><span class="xb">'+z.xp+' XP</span></div></div>';
  }
  h+='</div></div>'; return h;
}

function rCbt() {
  let h = '<div class="combat-view"><h2 class="st">' + (G.currentBoss ? '⚔️ BOSS FIGHT' : 'Combat') + '</h2>';
  
  const synDesc = getSynergyDesc();
  if (synDesc) {
    h += '<div style="background:#7c3aed15;border:1px solid var(--accent);border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:var(--accent-light);">';
    h += '✨ ' + synDesc + '</div>';
  }

  // Planar Resonance Indicator (Phase 2)
  const zone = G.zones.find(z => z.en.includes(G.cbt.en[0]?.n));
  if (zone && zone.elem) {
    const resStatus = getResonanceStatus(zone.n);
    h += '<div style="background:' + resStatus.color + '15;border:1px solid ' + resStatus.color + ';border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:' + resStatus.color + ';">';
    h += resStatus.icon + ' ' + resStatus.text + '</div>';
  }

  // Dimensional Instability Indicator (Phase 2)
  const riftStatus = getRiftStatus();
  if (riftStatus) {
    h += '<div style="background:' + riftStatus.color + '15;border:1px solid ' + riftStatus.color + ';border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:' + riftStatus.color + ';">';
    h += riftStatus.icon + ' ' + riftStatus.name + ': ' + riftStatus.desc + ' (' + riftStatus.fightsLeft + ' fights left)</div>';
  }
  
  h += '<button id="btn-auto" style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid ' + (G.cbt.autoCombat ? '#22c55e' : 'var(--disabled)') + ';background:' + (G.cbt.autoCombat ? '#22c55e15' : 'transparent') + ';color:' + (G.cbt.autoCombat ? '#22c55e' : 'var(--text-dim)') + ';font-size:12px;font-weight:600;cursor:pointer;margin-bottom:12px;user-select:none;">';
  h += (G.cbt.autoCombat ? '🤖 AUTO ON — Tap to take control' : '🤖 Auto-Combat — Let AI fight') + '</button>';

  // Potion button
  const potions = getCombatPotions();
  const usablePotions = potions.filter(p => {
    if (p.t === 'revive') return getDeadParty().length > 0;
    return true;
  });
  h += '<button onclick="togglePotionMenu()" style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid ' + (usablePotions.length > 0 ? '#22c55e' : 'var(--disabled)') + ';background:' + (usablePotions.length > 0 ? '#22c55e15' : 'transparent') + ';color:' + (usablePotions.length > 0 ? '#22c55e' : 'var(--disabled)') + ';font-size:12px;font-weight:600;cursor:' + (usablePotions.length > 0 ? 'pointer' : 'not-allowed') + ';margin-bottom:12px;user-select:none;">';
  h += (G.potionMenu ? '❌ Close Potion Bag' : '🧪 Use Potion (' + usablePotions.length + ' usable)') + '</button>';

  // Potion menu
  if (G.potionMenu && potions.length > 0) {
    h += '<div style="background:var(--bg-card);border:1px solid #22c55e;border-radius:12px;padding:10px;margin-bottom:12px;">';
    h += '<div style="font-size:11px;color:#22c55e;margin-bottom:8px;">🧪 Quick Potion Bag</div>';
    h += '<div style="display:flex;flex-direction:column;gap:6px;">';
    for (let i = 0; i < G.p.inv.length; i++) {
      const it = G.p.inv[i];
      // Regular potions (heal/mana)
      if ((it.t === 'pot' || it.t === 'food' || it.t === 'drink') && (it.eff === 'heal' || it.eff === 'mana')) {
        const isHeal = it.eff === 'heal';
        const icon = isHeal ? '❤️' : '💧';
        const color = isHeal ? '#ef4444' : '#3b82f6';
        const current = isHeal ? G.p.hp + '/' + G.p.mhp : G.p.mp + '/' + G.p.mmp;
        const full = isHeal ? G.p.hp >= G.p.mhp : G.p.mp >= G.p.mmp;
        h += '<button onclick="usePotionInCombat(' + i + ')" style="padding:10px 14px;border-radius:10px;border:1px solid ' + color + ';background:' + color + '15;color:' + (full ? 'var(--disabled)' : color) + ';font-size:12px;font-weight:600;cursor:' + (full ? 'not-allowed' : 'pointer') + ';display:flex;justify-content:space-between;align-items:center;opacity:' + (full ? '0.5' : '1') + ';">';
        h += '<span>' + icon + ' ' + it.n + (it.q > 1 ? ' x' + it.q : '') + '</span>';
        h += '<span>' + (full ? 'FULL' : '+' + it.v + ' ' + (isHeal ? 'HP' : 'MP')) + ' · ' + current + '</span>';
        h += '</button>';
      }
      // Revive items (Phoenix Feather, etc.)
      else if (it.t === 'revive') {
        const deadMembers = getDeadParty();
        const hasDead = deadMembers.length > 0;
        const color = hasDead ? '#f59e0b' : 'var(--disabled)';
        const icon = '🔥';
        h += '<button onclick="usePotionInCombat(' + i + ')" style="padding:10px 14px;border-radius:10px;border:1px solid ' + color + ';background:' + color + '15;color:' + color + ';font-size:12px;font-weight:600;cursor:' + (hasDead ? 'pointer' : 'not-allowed') + ';display:flex;justify-content:space-between;align-items:center;opacity:' + (hasDead ? '1' : '0.5') + ';">';
        h += '<span>' + icon + ' ' + it.n + (it.q > 1 ? ' x' + it.q : '') + '</span>';
        h += '<span>' + (hasDead ? 'Revive 50% HP' : 'No one to revive') + ' · ' + deadMembers.length + ' down</span>';
        h += '</button>';
      }
    }
    h += '</div></div>';
  }
  
  // Reuse zone variable from resonance check above
  if (zone && G.zoneHazards[zone.n]) {
    const haz = G.zoneHazards[zone.n];
    h += '<div style="background:#f59e0b15;border:1px solid #f59e0b;border-radius:12px;padding:8px;margin-bottom:12px;font-size:11px;color:#f59e0b;">';
    h += '⚠️ Zone Hazard: ' + haz.name + ' — ' + haz.desc + '</div>';
  }
  
  if (G.currentBoss) {
    h += '<div style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:10px;margin-bottom:12px;font-size:12px;color:var(--danger);">';
    h += '🔥 ' + G.currentBoss.desc + '</div>';
  }
  
  const playerAC = getPlayerAC();
  const eqStats = getEquippedStats();
  h += '<div style="display:flex;justify-content:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;">';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">AC </span><span style="font-weight:700;color:var(--accent-light);">' + playerAC + '</span>';
  if(eqStats.def > 0) h += '<span style="font-size:9px;color:var(--success);"> +' + eqStats.def + 'eq</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">PROF </span><span style="font-weight:700;color:var(--gold);">+' + DICE.proficiencyBonus(G.p.lvl) + '</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">ATK </span><span style="font-weight:700;color:var(--hp);">+' + (eqStats.atk + (G.p.eq.weapon?.atk||0)) + '</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">CRIT </span><span style="font-weight:700;color:var(--danger);">' + Math.floor(getTotalCritChance() * 100) + '%</span>';
  if(eqStats.critChance > 0) h += '<span style="font-size:9px;color:var(--success);"> +' + Math.floor(eqStats.critChance*100) + '%eq</span>';
  h += '</div>';
  h += '</div>';
  
  h += '<div class="erow">';
  for (let i = 0; i < G.cbt.en.length; i++) {
    const e = G.cbt.en[i], d = e.hp <= 0, s = G.cbt.tg == i && !d ? 'sel' : '';
    const immuneFire = ['Fire Imp', 'Lava Slug', 'Ash Wraith'].includes(e.n);
    const immuneIce = ['Ice Elemental', 'Frost Wolf', 'Frozen Knight'].includes(e.n);
    const isBoss = e.mechanic ? true : false;
    const enemyAC = getEnemyAC(e);
    
    h += '<div class="ecard ' + (d ? 'dead' : '') + ' ' + s + '" data-i="' + i + '" style="' + (isBoss ? 'border-color:var(--danger);box-shadow:0 0 10px #ef444440;' : '') + '">';
    h += '<div class="eicon">' + (d ? '💀' : ee(e.n)) + '</div>';
    h += '<div class="ename">' + e.n + (isBoss ? ' 👑' : '') + '</div>';
    
    if (!d) {
      h += '<div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">AC ' + enemyAC + '</div>';
    }
    
    if (!d && e.elem && e.elem !== 'none') {
      const elemIcon = e.elem === 'fire' ? '🔥' : e.elem === 'ice' ? '❄️' : e.elem === 'lightning' ? '⚡' : e.elem === 'void' ? '🌑' : '✦';
      h += '<div style="font-size:10px;color:#f59e0b;margin-top:2px;">' + elemIcon + ' ' + e.elem + '</div>';
    }
    
    if (!d && e.status && e.status.length > 0) {
      const statusIcons = e.status.map(s => s.type === 'burn' ? '🔥' : s.type === 'poison' ? '☠️' : s.type === 'shock' ? '⚡' : '✦').join('');
      h += '<div style="font-size:10px;color:var(--danger);margin-top:2px;">' + statusIcons + ' (' + e.status[0].turns + 't)</div>';
    }
    
    if (!d && (immuneFire || immuneIce)) {
      h += '<div class="e-immune">' + (immuneFire ? '🔥 Fire Immune' : (immuneIce ? '❄️ Ice Immune' : '')) + '</div>';
    }
    
    if (!d && e.mechanic === 'resurrect') {
      h += '<div style="font-size:10px;color:var(--danger);">💀 Lives: ' + (e.resurrectCount + 1) + '</div>';
    }
    
    if (!d && e.mechanic === 'phase') {
      h += '<div style="font-size:10px;color:var(--accent-light);">💎 Phase ' + e.currentPhase + '/' + e.phases + '</div>';
    }
    
    h += (d ? '<div class="dt">DEFEATED</div>' : '<div class="hps"><div class="bf bf-hp" style="width:' + ((e.hp / e.mhp) * 100) + '%"></div></div><div class="hpt">' + e.hp + '/' + e.mhp + '</div>') + '</div>';
  }
  h += '</div>';
  
  h += '<div class="pstat"><div class="mst"><span class="md" style="background:#7c3aed"></span>San ' + G.p.hp + '/' + G.p.mhp + ' AC' + playerAC + '</div>';
  for (let p of G.party) {
    if (p.on) {
      h += '<div class="mst"><span class="md" style="background:' + p.col + '"></span>' + p.n + ' ' + p.hp + '/' + p.mhp + '</div>';
    }
  }
  h += '</div>';
  
  h += '<div class="skills"><h3>Select Skill</h3><div class="slist">';
  
  const basicSel = G.cbt.sk === -1 && !G.cbt.autoCombat ? 'sel' : '';
  h += '<div class="sbtn ' + basicSel + '" data-i="-1" ' + (G.cbt.autoCombat ? 'style="opacity:0.4;cursor:not-allowed;"' : '') + '>';
  h += '<div class="sn">🪄 Staff Swing</div>';
  h += '<div class="sc">0 MP · Physical · 1d4 + STR</div>';
  h += '<div class="sd">Swing your staff when your spell slots are spent.</div>';
  h += '</div>';
  
    const ls = G.p.skills.filter(s => s.on);
  for (let i = 0; i < ls.length; i++) {
    const s = ls[i];
    const costLabel = typeof getSpellCostLabel === 'function'
      ? getSpellCostLabel(s)
      : (s.c + ' MP');
    const u = G.p.mp >= s.c && !G.cbt.autoCombat;
    const sel = G.cbt.sk == i && !G.cbt.autoCombat ? 'sel' : '';
    const critPct = Math.floor(getTotalCritChance() * 100);
    const highTier = Number(s.slotTier || 1) >= 4;
    const nameStyle = highTier ? ' style="color:#ef4444;font-weight:700;"' : '';
    
    h += '<div class="sbtn ' + (u ? '' : 'dis') + ' ' + sel + '" data-i="' + i + '" ' +
         (G.cbt.autoCombat ? 'style="opacity:0.4;cursor:not-allowed;"' : '') + '>';
    h += '<div class="sn"' + nameStyle + '>' + (s.buff ? '🛡️' : '⚡') + ' ' + s.n + '</div>';
    h += '<div class="sc">' + costLabel + ' · ' + (s.dmg || 'Buff') + ' · ' +
         critPct + '% Crit' + (G.cbt.autoCombat ? ' · 🤖 AUTO' : '') + '</div>';
    h += '<div class="sd">' + s.d + '</div>';
    if (s.elem) {
      const weakAgainst = s.elem === 'fire' ? 'Ice' : s.elem === 'ice' ? 'Fire' : s.elem === 'lightning' ? 'Void' : '';
      if (weakAgainst) {
        h += '<div style="font-size:10px;color:var(--success);">Strong vs: ' + weakAgainst + '</div>';
      }
    }
    h += '</div>';
  }
  h += '</div>';
  
  const isBasic = G.cbt.sk === -1;
  const sk = isBasic ? null : ls[G.cbt.sk];
  const ca = isBasic 
    ? (G.cbt.tg >= 0 && !G.cbt.autoCombat) 
    : (sk && G.p.mp >= sk.c && !G.cbt.autoCombat);
  const si = isBasic ? -1 : G.p.skills.indexOf(sk);
  
  h += '<button class="abtn ' + (ca ? '' : 'dis') + '" data-si="' + si + '" data-ti="' + G.cbt.tg + '" ' + (G.cbt.autoCombat ? 'disabled style="opacity:0.4;"' : '') + '>';
  h += (isBasic ? '🪄 Staff Swing' : 'Cast ' + (sk ? sk.n : '...')) + '</button>';
  h += '<button class="fbtn" ' + (G.cbt.autoCombat ? 'disabled style="opacity:0.4;"' : '') + '>Flee</button>';
 
   // === GRIND ROOM WAVE CONTROLS ===
  if (G.endlessGrind.active) {
    h += '<div style="background:var(--bg-card);border:2px solid var(--accent);border-radius:14px;padding:14px;margin-top:16px;text-align:center;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">⚔️ Grind Room · Wave ' + G.endlessGrind.wave + '</div>';
    
    if (G.endlessGrind.autoNext) {
      h += '<div style="font-size:12px;color:var(--success);">🤖 Auto-next: ON</div>';
    } else {
      h += '<button onclick="startGrindWave()" class="abtn" style="width:100%;margin-bottom:8px;">▶️ Next Wave</button>';
    }
    
    h += '<button onclick="exitGrindRoom()" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:13px;font-weight:600;cursor:pointer;">⏹ Stop & Exit</button>';
    h += '</div>';
  }
  // === END GRIND ROOM WAVE CONTROLS ===

  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:12px;margin-top:12px;">';
  h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">🎲 D&D Combat Rules</div>';
  h += '<div style="font-size:10px;color:var(--text-dim);line-height:1.6;">';
  h += '• Attack: d20 + PROF(+' + DICE.proficiencyBonus(G.p.lvl) + ') + Ability Mod vs Target AC<br>';
  h += '• Natural 20 = Critical Hit (double dice)<br>';
  h += '• Natural 1 = Critical Miss (auto-fail)<br>';
  h += '• Advantage: Roll 2d20, keep higher<br>';
  h += '• Your AC: ' + playerAC + ' | INT Mod: ' + (DICE.abilityMod(G.p.stats.int) >= 0 ? '+' : '') + DICE.abilityMod(G.p.stats.int);
  h += '</div></div>';
  
  h += '</div></div>';
  return h;
}


function rParty(){
  let h='<div class="party-view"><h2 class="st">Party</h2>';
  const activeSyns = getActiveSynergies();
  if(activeSyns.length > 0){
    h += '<div style="background:var(--bg-card);border:1px solid var(--accent);border-radius:14px;padding:12px;margin-bottom:16px;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">✨ Active Synergies</div>';
    h += '<div style="display:flex;flex-direction:column;gap:8px;">';
    for(let syn of activeSyns){
      h += '<div style="display:flex;align-items:center;gap:8px;font-size:12px;">';
      h += '<span style="font-size:16px;">' + syn.icon + '</span>';
      h += '<div style="flex:1;"><div style="font-weight:600;">' + syn.name + '</div>';
      h += '<div style="font-size:10px;color:var(--text-dim);">' + syn.desc + '</div></div>';
      h += '</div>';
    }
    h += '</div></div>';
  }
  h += '<div class="plist">';
  for(let p of G.party){
    h+='<div class="pcard '+(p.on?'':'locked')+'"><div class="pava" style="background:'+p.col+'20;border-color:'+p.col+'"><span style="font-size:28px">'+(p.on?re(p.r):'🔒')+'</span></div><div class="pinfo"><div class="pn">'+p.n+' <span class="pt">'+p.t+'</span></div><div class="pr" style="color:'+p.col+'">'+p.r+'</div><div class="pd">'+p.d+'</div><div class="pb">'+p.b+'</div>'+(p.on?'<div class="ps">HP:'+p.hp+'/'+p.mhp+' ATK:'+p.atk+(p.gear&&p.gear.atk?'(+'+p.gear.atk+')':'')+' DEF:'+p.def+(p.gear&&p.gear.def?'(+'+p.gear.def+')':'')+' SPD:'+p.spd+(p.gear&&p.gear.spd?'(+'+p.gear.spd+')':'')+(getBlessDef(p)?' <span style="color:var(--rest);font-weight:700;">🐱+10 DEF</span>':'')+'</div>':'')+(G.affinity[p.n]?'<div class="affinity-bar"><div class="affinity-fill '+getAffinityColor(G.affinity[p.n].val)+'" style="width:'+(G.affinity[p.n].val/G.affinity[p.n].max*100)+'%"></div></div><div class="affinity-label">'+(G.affinity[p.n].val>=70?'💕 Close':G.affinity[p.n].val>=40?'💛 Friendly':G.affinity[p.n].val>=20?'💔 Distant':'💀 Strained')+' ('+G.affinity[p.n].val+'/'+G.affinity[p.n].max+')</div>':'')
+(G.affinityUnlocks[p.n]?'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">'+G.affinityUnlocks[p.n].map(function(u){var un=p.affinityBonuses&&p.affinityBonuses.includes(u.id);return '<span title="'+u.d+'" style="font-size:9px;padding:2px 6px;border-radius:8px;border:1px solid '+(un?'var(--xp);color:var(--xp);':'var(--border);color:var(--text-dim);opacity:0.6;')+'">'+(un?'🌟 ':'🔒 ')+u.n+' ('+u.th+')</span>';}).join('')+'</div>':'')+'</div></div>';
    // === STAGE 1: ENHANCED TRINKET/GEAR SYSTEM ===
    if(p.on || p.ul <= G.p.lvl){
      h += '<div style="background:var(--bg-hover);border:1px solid var(--border);border-radius:10px;padding:10px;margin-top:8px;">';
      h += '<div style="font-size:11px;font-weight:600;color:var(--accent-light);margin-bottom:6px;">🎁 Trinket Slot</div>';
      if(p.gear){
        // Equipped trinket display with rarity color
        const rarityColor = p.gear.r ? (p.gear.r==='epic'?'#a855f7':p.gear.r==='rare'?'#3b82f6':p.gear.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
        h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
        h += '<span style="font-size:12px;font-weight:600;color:'+rarityColor+';">' + p.gear.n + '</span>';
        h += '<button class="unequip-pgear" data-member="' + p.n + '" style="padding:4px 10px;border-radius:8px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:11px;font-weight:600;cursor:pointer;">Unequip</button>';
        h += '</div>';
        h += '<div style="font-size:10px;color:var(--text-dim);">';
        const stats = [];
        if(p.gear.atk) stats.push('+ ' + p.gear.atk + ' ATK');
        if(p.gear.def) stats.push('+ ' + p.gear.def + ' DEF');
        if(p.gear.hp) stats.push('+ ' + p.gear.hp + ' HP');
        if(p.gear.mp) stats.push('+ ' + p.gear.mp + ' MP');
        if(p.gear.spd) stats.push('+ ' + p.gear.spd + ' SPD');
        h += stats.join(' · ') + '</div>';
        if(p.gear.d) h += '<div style="font-size:10px;color:var(--accent-light);margin-top:4px;font-style:italic;">' + p.gear.d + '</div>';
      } else {
        h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Empty trinket slot</div>';
        // Show ALL equippable pgear items (not just for this member)
        const allPgear = G.p.inv.map((it, idx) => ({it, idx})).filter(x => x.it.t === 'pgear');
        if(allPgear.length > 0){
          h += '<div style="display:flex;flex-direction:column;gap:4px;">';
          for(let eq of allPgear){
            const isForThis = !eq.it.for || eq.it.for === p.n;
            const rarityColor = eq.it.r ? (eq.it.r==='epic'?'#a855f7':eq.it.r==='rare'?'#3b82f6':eq.it.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
            if(isForThis){
              h += '<button class="equip-pgear" data-member="' + p.n + '" data-idx="' + eq.idx + '" style="padding:6px 10px;border-radius:8px;border:1px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:11px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
              h += '<span style="color:'+rarityColor+';">' + eq.it.n + '</span>';
              h += '<span style="font-size:10px;color:var(--text-dim);">Equip →</span>';
              h += '</button>';
            }
          }
          // Show incompatible items as disabled
          const incompatible = allPgear.filter(x => x.it.for && x.it.for !== p.n);
          if(incompatible.length > 0){
            h += '<div style="font-size:10px;color:var(--disabled);margin-top:4px;padding-top:4px;border-top:1px solid var(--border);">Not for ' + p.n + ':</div>';
            for(let eq of incompatible){
              h += '<div style="padding:4px 10px;border-radius:8px;background:var(--nav-bg);color:var(--disabled);font-size:10px;">' + eq.it.n + ' (' + eq.it.for + ' only)</div>';
            }
          }
          h += '</div>';
        } else {
          h += '<div style="font-size:10px;color:var(--disabled);margin-top:4px;">Buy trinkets from traders like Ribald, Deidre, or Nym.</div>';
        }
      }
      h += '</div>';
    }
  }
  h+='</div></div>'; return h;
}
function rSkills(){
  let h='<div class="skills-view"><h2 class="st">Mage Skills</h2><div class="sklist">';
  for(let s of G.p.skills){
    const st=s.on?'LEARNED':'Unlocks Lv.'+s.ul;
    h+='<div class="skcard '+(s.on?'':'locked')+'"><div class="skh"><span class="ski">'+(s.buff?'🛡️':'⚡')+'</span><span class="skt">'+s.n+'</span><span class="sks">'+st+'</span></div><div class="skd"><span class="dp">'+s.c+' MP</span><span class="dp">'+(s.dmg||'Buff')+'</span></div><div class="skdsc">'+s.d+'</div></div>';
  }
  h+='</div><div class="stb"><h3>Character Stats</h3>';
  for(let [k,v] of Object.entries(G.p.stats))h+='<div class="str"><span class="stn">'+k.toUpperCase()+'</span><span class="stv">'+v+'</span></div>';
  h+='</div></div>'; return h;
}

function getEquipScore(item) {
  if (!item || !item.slot) return 0;
  let score = 0;
  if (item.atk) score += item.atk * 3;
  if (item.def) score += item.def * 3;
  if (item.int) score += item.int * 2;
  if (item.str) score += item.str * 2;
  if (item.dex) score += item.dex * 2;
  if (item.con) score += item.con * 2;
  if (item.wis) score += item.wis * 2;
  if (item.cha) score += item.cha * 1;
  if (item.fireDmg) score += item.fireDmg * 2;
  if (item.iceDmg) score += item.iceDmg * 2;
  if (item.lightDmg) score += item.lightDmg * 2;
  if (item.voidDmg) score += item.voidDmg * 2;
  if (item.arcaneDmg) score += item.arcaneDmg * 2;
  if (item.lifeSteal) score += item.lifeSteal * 10;
  if (item.critChance) score += item.critChance * 20;
  if (item.mpRegen) score += item.mpRegen * 2;
  if (item.hpRegen) score += item.hpRegen * 2;
  return score;
}

function getEquipComparison(item) {
  if (!item || !item.slot) return null;
  const slot = item.slot === 'ring' ? (G.p.eq.ring1 ? 'ring2' : 'ring1') : item.slot;
  const equipped = G.p.eq[slot];
  if (!equipped) return { better: true, arrow: '▲', color: '#22c55e', text: 'New slot' };
  const itemScore = getEquipScore(item);
  const eqScore = getEquipScore(equipped);
  if (itemScore > eqScore) return { better: true, arrow: '▲', color: '#22c55e', text: 'Upgrade' };
  if (itemScore < eqScore) return { better: false, arrow: '▼', color: '#ef4444', text: 'Downgrade' };
  return { better: false, arrow: '●', color: '#9ca3af', text: 'Sidegrade' };
}

function rInv(){
  let h='<div class="inventory-view"><h2 class="st">Inventory</h2>';

  // Equipment Stats Summary
  const eqStats = getEquippedStats();
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:12px;margin-bottom:16px;">';
  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">⚔️ Equipment Bonuses</div>';
  h += '<div style="display:flex;flex-wrap:wrap;gap:6px;font-size:10px;">';
  const statLabels = {atk:'ATK',def:'DEF',str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA',
                      fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',
                      lifeSteal:'🩸Leech',critChance:'💥Crit',mpRegen:'💧MP+',hpRegen:'💚HP+',goldFind:'💰Gold'};
  for(let k in statLabels){
    if(eqStats[k] > 0){
      const val = k === 'critChance' || k.includes('Res') ? (eqStats[k]*100)+'%' : (k.includes('Regen') ? '+'+eqStats[k]+'/turn' : '+'+eqStats[k]);
      h += '<span style="background:var(--bg-hover);padding:3px 8px;border-radius:8px;">'+statLabels[k]+' '+val+'</span>';
    }
  }
  h += '</div></div>';

  // Equipped Gear
  h+='<div class="eqs"><h3>Equipped Gear</h3><div class="eqg">';
  const slotOrder = ['weapon','armor','head','hands','feet','ring1','ring2','amulet'];
  const slotIcons = {weapon:'⚔️',armor:'🛡️',head:'🎓',hands:'🧤',feet:'👢',ring1:'💍',ring2:'💍',amulet:'📿'};
  for(let sl of slotOrder){
    const it=G.p.eq[sl];
    const slotName = EQUIPMENT_SLOTS[sl].name;
    h+='<div class="esl" style="cursor:pointer;" onclick="unequipItem(\'"+sl+"\')">';
    h+='<div class="esn">'+slotIcons[sl]+' '+slotName+'</div>';
    if(it){
      h+='<div class="eit" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      let stats = [];
      if(it.atk) stats.push('ATK+'+it.atk);
      if(it.def) stats.push('DEF+'+it.def);
      if(it.int) stats.push('INT+'+it.int);
      if(it.str) stats.push('STR+'+it.str);
      if(it.dex) stats.push('DEX+'+it.dex);
      if(it.con) stats.push('CON+'+it.con);
      if(it.wis) stats.push('WIS+'+it.wis);
      if(it.cha) stats.push('CHA+'+it.cha);
      if(it.prefix) stats.push(it.prefixData.desc);
      if(it.suffix) stats.push(it.suffixData.desc);
      h+='<div class="est">'+stats.join(' · ')+'</div>';
    }else{
      h+='<div class="ese">Empty</div>';
    }
    h+='</div>';
  }
  h+='</div></div>';

  // Categorize inventory items
  const equipItems = [];
  const consumableItems = [];
  const matItems = [];
  const otherItems = [];
  
  for(let i=0; i<G.p.inv.length; i++){
    const it = G.p.inv[i];
    const isEquip = it.slot && it.slot !== 'mat' && it.slot !== 'pot' && it.slot !== 'revive' && it.t !== 'food' && it.t !== 'drink';
    if(isEquip) equipItems.push({item: it, index: i});
    else if(it.t==='pot' || it.t==='food' || it.t==='drink' || it.t==='revive') consumableItems.push({item: it, index: i});
    else if(it.t==='mat') matItems.push({item: it, index: i});
    else otherItems.push({item: it, index: i});
  }

  // Equipment section
  if(equipItems.length > 0){
    h+='<div class="its"><h3>🎒 Equipment ('+equipItems.length+')</h3><div class="ig">';
    for(let ei of equipItems){
      const it = ei.item;
      const i = ei.index;
      const cmp = getEquipComparison(it);
      h+='<div class="ic" style="position:relative;">';
      if(cmp){
        h+='<div style="position:absolute;top:6px;right:6px;font-size:14px;color:'+cmp.color+';font-weight:700;" title="'+cmp.text+'">'+cmp.arrow+'</div>';
      }
      h+='<div class="ii">'+(EQUIPMENT_SLOTS[it.slot]?.icon || '⚔️')+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.ilvl) h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      h += getItemSocketDisplay(it);
      let statLine = [];
      if(it.atk) statLine.push('ATK+'+it.atk);
      if(it.def) statLine.push('DEF+'+it.def);
      if(it.int) statLine.push('INT+'+it.int);
      if(it.str) statLine.push('STR+'+it.str);
      if(it.dex) statLine.push('DEX+'+it.dex);
      if(it.con) statLine.push('CON+'+it.con);
      if(it.wis) statLine.push('WIS+'+it.wis);
      if(it.cha) statLine.push('CHA+'+it.cha);
      if(it.prefix) statLine.push(it.prefixData.desc);
      if(it.suffix) statLine.push(it.suffixData.desc);
      if(statLine.length > 0) h+='<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">'+statLine.join(' · ')+'</div>';
      h+='<div class="iq">'+(it.value ? it.value+'G' : '')+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-e" data-i="'+i+'">Equip</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Consumables section
  if(consumableItems.length > 0){
    h+='<div class="its"><h3>🧪 Consumables ('+consumableItems.length+')</h3><div class="ig">';
    for(let ci of consumableItems){
      const it = ci.item;
      const i = ci.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.eff==='heal') h+='<div style="font-size:10px;color:var(--success);">+'+it.v+' HP</div>';
      if(it.eff==='mana') h+='<div style="font-size:10px;color:var(--mp);">+'+it.v+' MP</div>';
      if(it.eff==='revive') h+='<div style="font-size:10px;color:var(--accent-light);">Revive '+it.v+'% HP</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-u" data-i="'+i+'">Use</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Materials section
  if(matItems.length > 0){
    h+='<div class="its"><h3>💎 Materials ('+matItems.length+')</h3><div class="ig">';
    for(let mi of matItems){
      const it = mi.item;
      const i = mi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  // Other items
  if(otherItems.length > 0){
    h+='<div class="its"><h3>📦 Other ('+otherItems.length+')</h3><div class="ig">';
    for(let oi of otherItems){
      const it = oi.item;
      const i = oi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  if(G.p.inv.length==0) h+='<div class="ei">Your pack is empty.</div>';
  h+='</div>';
  return h;
}

function rCraft(){
  let h='<div class="craft-view"><h2 class="st">Crafting</h2><div class="rlist">';
  for(let i=0;i<G.recipes.length;i++){
    const r=G.recipes[i]; let ok=true,ms='';
    for(let [mn,mq] of Object.entries(r.m)){
      const iv=G.p.inv.find(x=>x.n==mn);
      const hv=iv?iv.q:0,en=hv>=mq;
      if(!en)ok=false;
      ms+='<span class="mp '+(en?'ok':'miss')+'">'+mn+': '+hv+'/'+mq+'</span>';
    }
    h+='<div class="rc"><div class="rr"><span class="ri">'+ie(r.res)+'</span><span class="rn" style="color:'+rc(r.res.r)+'">'+r.n+'</span><span class="rd">'+r.d+'</span></div><div class="rms">'+ms+'</div><button class="cb '+(ok?'':'dis')+'" data-i="'+i+'">Forge</button></div>';
  }
  h+='</div></div>'; return h;
}

function toggleQuestCollapse(key){
  G.questCollapsed[key] = !G.questCollapsed[key];
  render();
}

function rQuest(){
  let h='<div class="quest-view">';
    // === DAILY LOGIN REWARDS ===
  const today = G.gameDay || 0;
  const streak = G.loginStreak || 0;
  const claimedToday = G.loginClaimed || false;

  const loginRewards = [
    { day: 1, icon: '💰', name: 'Gold Pouch', g: 50, xp: 25 },
    { day: 2, icon: '💧', name: 'Mana Crystal', mp: 30, xp: 35 },
    { day: 3, icon: '🧪', name: 'Health Potion', hp: 50, xp: 45 },
    { day: 4, icon: '💎', name: 'Gem Shard', g: 100, xp: 60 },
    { day: 5, icon: '⚔️', name: 'Mystic Scroll', g: 150, xp: 80 },
    { day: 6, icon: '🔮', name: 'Arcane Orb', mp: 50, xp: 100 },
    { day: 7, icon: '👑', name: 'Legendary Cache', g: 300, xp: 200, item: { n: 'Phoenix Feather', t: 'revive', eff: 'revive', v: 50, q: 1, r: 'rare' } }
  ];

  const todayReward = loginRewards[Math.min(streak, 6)];

  h += '<div style="background: linear-gradient(135deg, var(--accent), #6d28d9); border-radius: 16px; padding: 16px; margin-bottom: 16px; color: white;">';
  h += '<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">';
  h += '<div style="font-size: 28px;">🎁</div>';
  h += '<div><div style="font-weight: 700; font-size: 16px;">Daily Login Reward</div>';
  h += '<div style="font-size: 11px; opacity: 0.9;">Day ' + (streak + 1) + ' · Streak: ' + streak + '</div></div>';
  h += '</div>';

  h += '<div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px; margin-bottom: 12px;">';
  h += '<div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">Today\'s Reward:</div>';
  h += '<div style="display: flex; align-items: center; gap: 8px;">';
  h += '<div style="font-size: 32px;">' + todayReward.icon + '</div>';
  h += '<div style="flex: 1;">';
  h += '<div style="font-weight: 600; font-size: 14px;">' + todayReward.name + '</div>';
  h += '<div style="font-size: 11px; opacity: 0.85;">';
  const rewardParts = [];
  if (todayReward.g) rewardParts.push('+' + todayReward.g + 'G');
  if (todayReward.xp) rewardParts.push('+' + todayReward.xp + 'XP');
  if (todayReward.hp) rewardParts.push('+' + todayReward.hp + 'HP');
  if (todayReward.mp) rewardParts.push('+' + todayReward.mp + 'MP');
  if (todayReward.item) rewardParts.push(todayReward.item.n);
  h += rewardParts.join(' · ');
  h += '</div></div></div></div>';

  // Streak progress dots
  h += '<div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 12px;">';
  for (let i = 0; i < 7; i++) {
    const isActive = i < streak;
    const isToday = i === streak;
    h += '<div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; ' + 
      (isActive ? 'background: #fbbf24; color: #000;' : 
       isToday ? 'background: white; color: var(--accent); border: 2px solid #fbbf24;' : 
       'background: rgba(255,255,255,0.2); color: white;') + '">' + (i + 1) + '</div>';
  }
  h += '</div>';

  if (claimedToday) {
    h += '<button disabled style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: rgba(255,255,255,0.2); color: white; font-size: 13px; font-weight: 600; opacity: 0.6; cursor: not-allowed;">✅ Claimed Today — Come Back Tomorrow!</button>';
  } else {
    h += '<button id="btn-claim-login" style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: #fbbf24; color: #000; font-size: 13px; font-weight: 700; cursor: pointer;">🎁 Claim Reward</button>';
  }
  h += '</div>';
  // === END DAILY LOGIN ===

  // Storyline section
  h+='<h2 class="st">📖 Storyline</h2><div class="qlist">';
  for(let s of G.storyline){
    if(!s.unlocked) continue;
    const pc=Math.min(100,(G.p.lvl/s.need)*100);
    h+='<div class="qc '+(s.done?'done':'')+'" style="border-color:var(--accent-light);"><div class="qh"><span class="qn">'+(s.done?'✅ ':'')+'Ch.'+s.chapter+': '+s.n+'</span><span class="qr">'+s.rw.xp+' XP | '+s.rw.g+' G</span></div>';
    h+='<div class="qd">'+s.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">Lv.'+G.p.lvl+'/'+s.need+'</span></div></div>';
  }
  h+='</div>';
  // Active quests section
  h+='<h2 class="st" style="margin-top:20px;">📜 Active Quests</h2><div class="qlist">';
  for(let q of G.quests){
    if(q.hidden && !q.revealed) continue;
    const pc=Math.min(100,(q.c/q.need)*100);
    const timerStatus=getTimerStatus(q);
    let cardClass=q.done?'done':(q.expired?'expired':(timerStatus?(timerStatus.cls==='timer-urgent'?'timed-urgent':'timed'):''));
    h+='<div class="qc '+cardClass+'"><div class="qh"><span class="qn">'+(q.done?'✅ ':(q.expired?'❌ ':''))+q.n+'</span><span class="qr">'+q.rw.xp+' XP | '+q.rw.g+' G</span></div>';
    if(q.chain){
      h+='<div style="font-size:10px;color:var(--accent-light);margin-bottom:4px;">🔗 Chain: '+q.chain+'</div>';
    }
    if(q.reqQuest && !q.revealed){
      const req=G.quests.find(rq=>rq.id===q.reqQuest);
      h+='<div style="font-size:10px;color:var(--text-dim);font-style:italic;margin-bottom:4px;">🔒 Requires: '+(req?req.n:'Unknown')+'</div>';
    }
    h+='<div class="qd">'+q.d+'</div>';
    if(timerStatus){
      h+='<div class="timer-bar"><div class="timer-fill '+timerStatus.cls+'" style="width:'+timerStatus.pct+'%"></div></div>';
      h+='<div class="timer-label">⏰ '+timerStatus.label+'</div>';
    }
    h+='<div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+Math.min(q.c,q.need)+'/'+q.need+'</span></div></div>';
  }
  h+='</div>';
    // Daily Quests section
  h += '<h2 class="st" style="margin-top:20px;">📋 Daily Quests</h2><div class="qlist">';
  generateDailyQuests();
  if (G.dailyQuests.length === 0) {
    h += '<div class="qc"><div class="qd">No daily quests available. Check back tomorrow!</div></div>';
  } else {
    for (let q of G.dailyQuests) {
      const pc = Math.min(100, (q.c / q.need) * 100);
      h += '<div class="qc ' + (q.done ? 'done' : '') + '"><div class="qh"><span class="qn">' + q.n + '</span><span class="qr">' + q.rw.xp + ' XP | ' + q.rw.g + ' G</span></div>';
      h += '<div class="qd">' + q.d + '</div><div class="qp"><div class="pbar"><div class="pfill" style="width:' + pc + '%"></div></div><span class="ptxt">' + q.c + '/' + q.need + '</span></div></div>';
    }
  }
  h += '</div>';
    // Bounties section
  const activeBounties = G.bounties.filter(b => !b.done && G.p.lvl >= (b.minLv || 1));
  const doneBounties = G.bounties.filter(b => b.done);
  if (activeBounties.length > 0 || doneBounties.length > 0) {
    h+='<h2 class="st" style="margin-top:20px;">💰 Bounties</h2>';
    if (activeBounties.length > 0) {
      h+='<div class="qlist">';
      for(let b of activeBounties){
        const pc=Math.min(100,(b.c/b.need)*100);
        h+='<div class="qc"><div class="qh"><span class="qn">'+b.n+'</span><span class="qr">'+b.rw.xp+' XP | '+b.rw.g+' G</span></div>';
        h+='<div class="qd">'+b.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+b.c+'/'+b.need+'</span></div></div>';
      }
      h+='</div>';
    }
    if (doneBounties.length > 0) {
      const collapsed = G.questCollapsed['__bounties_done__'];
      h+='<div style="margin-top:12px;">';
      h+='<div onclick="toggleQuestCollapse(\'__bounties_done__\')" style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:12px 16px;background:var(--bg-hover);border-radius:14px;border:1px solid var(--border);user-select:none;">';
      h+='<span style="font-size:12px;transition:transform 0.2s;display:inline-block;' + (collapsed ? '' : 'transform:rotate(90deg);') + '">▶</span>';
      h+='<span style="font-size:14px;font-weight:600;color:var(--success);">✅ Claimed</span>';
      h+='<span style="font-size:12px;color:var(--text-dim);margin-left:auto;">' + doneBounties.length + '</span>';
      h+='</div>';
      if (!collapsed) {
        h+='<div class="qlist" style="margin-top:8px;">';
        for(let b of doneBounties){
          h+='<div class="qc done" style="opacity:0.55;"><div class="qh"><span class="qn" style="text-decoration:line-through;">'+b.n+'</span><span class="qr" style="color:var(--success);">✓</span></div>';
          h+='<div class="qd">'+b.d+'</div></div>';
        }
        h+='</div>';
      }
      h+='</div>';
    }
  }
  h+='</div>';
  h+='<div class="sum"><div class="si2"><span class="sv">'+G.p.kills+'</span><span class="sl">Monsters</span></div><div class="si2"><span class="sv">'+G.p.quests+'</span><span class="sl">Quests</span></div><div class="si2"><span class="sv">'+G.p.fstreak+'</span><span class="sl">Focus</span></div></div></div>';
  return h;
}

function rFocus(){
  // If focus is not active, show the session picker
  if (!G.fs || G.state !== 'focus') {
    let h = '<div class="fv">';
    h += '<div style="font-size:42px;margin-bottom:8px;">🧘</div>';
    h += '<div class="fl" style="font-size:18px;font-weight:700;margin-bottom:4px;">Focus Mode</div>';
    h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:20px;">Pick a session length</div>';
    h += '<div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:0 auto;">';
    const sessions = [
      {m:5, xp:20, g:10, label:'Quick Sprint'},
      {m:10, xp:40, g:20, label:'Short Burst'},
      {m:15, xp:60, g:30, label:'Deep Work'},
      {m:20, xp:80, g:40, label:'Extended Flow'},
      {m:25, xp:100, g:50, label:'Full Pomodoro'}
    ];
    for (let s of sessions) {
      h += '<button class="focus-session-btn" data-min="' + s.m + '" style="padding:14px 18px;border-radius:14px;border:2px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
      h += '<span>' + s.m + ' min — ' + s.label + '</span>';
      h += '<span style="font-size:11px;color:var(--success);">+' + s.xp + 'XP +' + s.g + 'G</span>';
      h += '</button>';
    }
    h += '</div>';
    h += '<div class="ftips" style="margin-top:20px;"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward scales with session length!</li></ul></div>';
    h += '</div>';
    return h;
  }
  // Active focus session
  const el=Date.now()-(G.fs||Date.now()),rm=Math.max(0,G.fd-el);
  const m=Math.floor(rm/60000),s=Math.floor((rm%60000)/1000);
  return '<div class="fv"><div class="fc"><div class="ft" id="ft">'+m+':'+s.toString().padStart(2,'0')+'</div><div class="fl">Focus Mode — ' + (G.focusDuration || 25) + ' min</div></div><div class="ftips"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward: +' + ((G.focusDuration||25)*4) + ' XP when done!</li></ul></div><button class="cfb">Cancel</button></div>';
}

function rTemple() {
  const dead = getDeadParty();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">⛪ Temple of Resurrection</h2>';
  h2 += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ancient magic restores fallen companions. Cost: 50G each.</div>';
  if(dead.length === 0){
    h2 += '<div style="text-align:center;padding:20px;color:var(--success);">✨ All companions are alive!</div>';
  }else{
    h2 += '<div style="margin-bottom:12px;">';
    for(let p of G.party){
      const isDead = p.hp <= 0;
      const canAfford = G.p.gold >= 50;
      h2 += '<div class="temple-revive ' + (isDead ? 'dead' : 'alive') + '">';
      h2 += '<div class="tr-ava" style="background:' + p.col + '20;border-color:' + p.col + '">' + (isDead ? '💀' : re(p.r)) + '</div>';
      h2 += '<div class="tr-info">';
      h2 += '<div class="tr-name">' + p.n + '</div>';
      h2 += '<div class="tr-status ' + (isDead ? '' : 'alive') + '">' + (isDead ? '💀 FALLEN' : '✅ Alive ' + p.hp + '/' + p.mhp) + '</div>';
      h2 += '</div>';
      if(isDead) h2 += '<button class="tr-btn ' + (canAfford ? '' : 'dis') + '" data-m="' + p.n + '">' + (canAfford ? 'Revive (50G)' : 'Need 50G') + '</button>';
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  return h2;
}

function rRest() {
  const dead = getDeadParty();
  if(dead.length > 0 && !G.rest.active) return rTemple();

  if (G.rest.active && G.rest.selectedSite) {
    const site = G.rest.selectedSite;
    const currentTick = G.rest.tick;
    const maxTicks = G.rest.maxTicks;
    const pct = (currentTick / maxTicks) * 100;
    const healerName = getHealerName();
    let h2 = '<div class="rest-view">';
    h2 += '<h2 class="st">🔥 Resting at ' + site.name + '</h2>';
    if (G.ambushWarning) {
      h2 += '<div class="ambush-warning">';
      h2 += '<div class="aw-text">⚠️ ' + G.ambushWarning.text + '</div>';
      h2 += '</div>';
    }
    if (G.currentDialogue && !G.ambushWarning) {
      h2 += '<div class="dialogue-box">';
      h2 += '<div class="d-speaker">' + G.currentDialogue.speaker + '</div>';
      h2 += '<div class="d-text">' + G.currentDialogue.text + '</div>';
      h2 += '</div>';
    }
    h2 += '<div class="tick-track">';
    for (let i = 1; i <= maxTicks; i++) {
      let tickClass = '';
      let tickIcon = '○';
      if (i < currentTick) {
        tickClass = 'done';
        tickIcon = '✓';
      } else if (i === currentTick) {
        tickClass = 'current';
        tickIcon = '🔥';
      }
      h2 += '<div class="tick ' + tickClass + '">' + tickIcon + '</div>';
    }
    h2 += '</div>';
    h2 += '<div class="tick-label">Tick ' + currentTick + '/' + maxTicks + '</div>';
    h2 += '<div class="rest-progress" style="margin-top:16px;">';
    h2 += '<div class="rest-bar"><div class="rest-fill" style="width:' + pct + '%"></div></div>';
    h2 += '<div class="rest-healer ok">💚 ' + healerName + ' is tending to the party</div>';
    h2 += '</div>';
    h2 += '<button class="rest-cancel" id="cancel-rest">Cancel Rest (Partial Recovery)</button>';
    h2 += '</div>';
    return h2;
  }

  const healerOk = hasHealer();
  const healerName = getHealerName();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">💤 Rest</h2>';
  if (healerOk) {
    h2 += '<div class="rest-healer ok" style="background:#22c55e15;border:1px solid var(--success);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--success);">💚 Healer Available: ' + healerName + '</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">5 ticks, 1.5s each. Dialogue every tick. Ambush chance: 15% camp / 5% tavern.</div>';
    h2 += '</div>';
  } else {
    h2 += '<div class="rest-healer fail" style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--danger);">❌ No Healer in Party</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">You need a healer (like Eliz) in your active party to rest safely.</div>';
    h2 += '</div>';
  }
  const soelActive = G.party.some(p => p.n === 'Soel' && p.on);
  h2 += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;text-align:left;">';
  h2 += '<div style="font-size:13px;font-weight:600;color:var(--rest);margin-bottom:4px;">🐱 Soel\'s Spirit Blessing</div>';
  if (!soelActive) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Soel must be in your active party to share his blessing.</div>';
  } else if (G.soelBlessing) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Blessing rests on <b style="color:var(--text);">' + G.soelBlessing.target + '</b> (+' + G.soelBlessing.def + ' DEF). One blessing per rest \u2014 it fades when you next make camp.</div>';
  } else {
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">One member per rest receives +10 DEF until your next rest.</div>';
    h2 += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    for (let m of G.party) {
      if (!m.on || m.n === 'Soel') continue;
      h2 += '<button class="soel-bless-btn" data-n="' + m.n + '" style="padding:6px 12px;border-radius:10px;border:1px solid var(--rest);background:#10b98115;color:var(--text);font-size:11px;font-weight:600;cursor:pointer;">' + m.n + '</button>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div class="rest-sites">';
  const zones = {};
  for (let site of G.rest.sites) {
    if (!zones[site.zone]) zones[site.zone] = [];
    zones[site.zone].push(site);
  }
  for (let zoneName in zones) {
    const sites = zones[zoneName];
    const anyUnlocked = sites.some(s => s.unlocked);
    if (!anyUnlocked) continue;
    h2 += '<div style="margin-bottom:12px;">';
    h2 += '<div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">' + zoneName + '</div>';
    for (let site of sites) {
    let manaSpringRemaining = 8;
    if (G.manaSpringUses.day === G.gameDay) {
        manaSpringRemaining = 8 - G.manaSpringUses.count;
      }
      const isDepletedManaSpring = site.type === 'mana_spring' && manaSpringRemaining <= 0;

      const locked = !site.unlocked || isDepletedManaSpring;

      const canAfford = !site.cost || G.p.gold >= site.cost;
      const canRest = (site.type === 'mana_spring' || site.type === 'temple' || healerOk) && !locked && canAfford;
      h2 += '<div class="rs-card ' + (locked ? 'locked' : '') + '" data-id="' + site.id + '">';
      h2 += '<div class="rs-head">';
      h2 += '<span class="rs-name">' + site.icon + ' ' + site.name + '</span>';
      h2 += '<span class="rs-type ' + site.type + '">' + site.type.toUpperCase() + '</span>';
      h2 += '</div>';
      h2 += '<div class="rs-desc">' + site.desc + '</div>';
            if (locked) {
            if (isDepletedManaSpring) {
          h2 += '<div class="rs-req fail">💧 Daily limit reached (8/8 uses)</div>';

        } else {
          h2 += '<div class="rs-req fail">🔒 Requires Level ' + site.zoneLv + ' to discover</div>';
        }
      } else if (site.cost) {

                const msUsesLeft = site.type === 'mana_spring' ? ' (' + manaSpringRemaining + '/8 today)' : '';
        h2 += '<div class="rs-req ' + (canAfford ? 'ok' : 'fail') + '">' + (canAfford ? '✅' : '❌') + ' Cost: ' + site.cost + 'G' + msUsesLeft + ' · Ambush: 5% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';


      } else {
        h2 += '<div class="rs-req ' + (healerOk ? 'ok' : 'fail') + '">' + (healerOk ? '✅' : '❌') + ' Free · Ambush: 15% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';
      }
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:8px;">Rest takes ~7.5 seconds. Party banter every tick. Taverns cost gold but are safer.</div>';
  h2 += '</div>';
  return h2;
}

function rTemple() {
  const dead = getDeadParty();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">⛪ Temple of Resurrection</h2>';
  h2 += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ancient magic restores fallen companions. Cost: 50G each.</div>';
  if(dead.length === 0){
    h2 += '<div style="text-align:center;padding:20px;color:var(--success);">✨ All companions are alive!</div>';
  }else{
    h2 += '<div style="margin-bottom:12px;">';
    for(let p of G.party){
      const isDead = p.hp <= 0;
      const canAfford = G.p.gold >= 50;
      h2 += '<div class="temple-revive ' + (isDead ? 'dead' : 'alive') + '">';
      h2 += '<div class="tr-ava" style="background:' + p.col + '20;border-color:' + p.col + '">' + (isDead ? '💀' : re(p.r)) + '</div>';
      h2 += '<div class="tr-info">';
      h2 += '<div class="tr-name">' + p.n + '</div>';
      h2 += '<div class="tr-status ' + (isDead ? '' : 'alive') + '">' + (isDead ? '💀 FALLEN' : '✅ Alive ' + p.hp + '/' + p.mhp) + '</div>';
      h2 += '</div>';
      if(isDead) h2 += '<button class="tr-btn ' + (canAfford ? '' : 'dis') + '" data-m="' + p.n + '">' + (canAfford ? 'Revive (50G)' : 'Need 50G') + '</button>';
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  return h2;
}

function rRuneSocketModal() {
  const { itemIndex, slotIndex } = G.runeSocketModal;
  const item = G.p.inv[itemIndex];
  if (!item) return '<div>Error</div>';

  let h = '<div style="padding:16px;">';
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">';
  h += '<button class="rune-modal-back" style="background:none;border:none;color:var(--accent);font-size:20px;cursor:pointer;padding:4px;">←</button>';
  h += '<h2 class="st" style="margin:0;">💎 Socket Rune</h2>';
  h += '</div>';

  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;">';
  h += '<div style="font-weight:700;font-size:14px;color:'+rc(item.r)+';">'+item.n+'</div>';
  h += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">Slot '+(slotIndex+1)+' of '+item.sockets.length+'</div>';

  // Show current socket stats on this item
  let currentStats = [];
  if (item.socketStats) {
    for (let k in item.socketStats) {
      if (k.endsWith('Pct')) continue;
      const label = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[k] || k;
      currentStats.push(label + '+' + item.socketStats[k]);
    }
  }
  if(currentStats.length > 0){
    h += '<div style="font-size:10px;color:var(--success);margin-top:8px;">Current sockets: '+currentStats.join(' · ')+'</div>';
  }
  h += '</div>';

  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">Choose a Rune ('+G.runes.length+' available)</div>';

  if(G.runes.length===0){
    h += '<div style="text-align:center;padding:20px;color:var(--text-dim);">No runes available!</div>';
  }else{
    h += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">';
    for(let i=0;i<G.runes.length;i++){
      const r=G.runes[i];
      const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[r.stat] || r.stat;

      // Calculate preview: what will this rune add?
      const currentVal = item.socketStats && item.socketStats[r.stat] ? item.socketStats[r.stat] : 0;
      const newVal = currentVal + r.val;

      h += '<button class="rune-select-btn" data-ri="'+i+'" style="background:var(--bg-card);border:2px solid '+r.color+';border-radius:14px;padding:14px;text-align:left;cursor:pointer;transition:all 0.2s;">';
      h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">';
      h += '<span style="font-size:28px;">'+r.icon+'</span>';
      h += '<div style="flex:1;">';
      h += '<div style="font-size:13px;font-weight:700;color:'+r.color+';">'+r.name+'</div>';
      h += '<div style="font-size:9px;color:var(--disabled);text-transform:uppercase;">'+r.r+'</div>';
      h += '</div>';
      h += '</div>';

      // Stat preview with before/after
      h += '<div style="background:var(--bg-hover);border-radius:8px;padding:8px 10px;margin-bottom:6px;">';
      h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:2px;">'+statLabel+'</div>';
      h += '<div style="display:flex;align-items:center;gap:6px;">';
      h += '<span style="font-size:11px;color:var(--text-dim);">'+currentVal+'</span>';
      h += '<span style="color:var(--success);font-size:12px;">→</span>';
      h += '<span style="font-size:14px;font-weight:700;color:'+r.color+';">'+newVal+'</span>';
      if(r.pct) h += '<span style="font-size:10px;color:var(--success);">(+'+Math.floor(r.pct*100)+'%)</span>';
      h += '</div></div>';

      h += '<div style="font-size:10px;color:var(--accent);text-align:center;font-weight:600;">Tap to Socket</div>';
      h += '</button>';
    }
    h += '</div>';
  }

  h += '</div>';
  return h;
}

// NEW: Rune Combine Modal
function rRuneCombineModal() {
  const selected = G.runeCombineModal.selected;
  const preview = getCombinePreview();

  let h = '<div style="padding:16px;">';
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">';
  h += '<button class="rune-modal-back" style="background:none;border:none;color:var(--accent);font-size:20px;cursor:pointer;padding:4px;">←</button>';
  h += '<h2 class="st" style="margin:0;">🔮 Combine Runes</h2>';
  h += '</div>';

  h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Select 3 runes of the same type to combine into a stronger version.</div>';

  // Selected runes display
  h += '<div style="display:flex;gap:8px;margin-bottom:16px;">';
  for(let i=0;i<3;i++){
    if(selected[i] !== undefined && G.runes[selected[i]]){
      const r = G.runes[selected[i]];
      h += '<div style="flex:1;background:'+r.color+'15;border:2px solid '+r.color+';border-radius:12px;padding:12px;text-align:center;">';
      h += '<div style="font-size:28px;">'+r.icon+'</div>';
      h += '<div style="font-size:10px;font-weight:600;color:'+r.color+';">'+r.name+'</div>';
      h += '</div>';
    }else{
      h += '<div style="flex:1;background:var(--bg-hover);border:2px dashed var(--disabled);border-radius:12px;padding:12px;text-align:center;opacity:0.5;">';
      h += '<div style="font-size:28px;color:var(--disabled);">?</div>';
      h += '<div style="font-size:10px;color:var(--disabled);">Slot '+(i+1)+'</div>';
      h += '</div>';
    }
  }
  h += '</div>';

  // Preview result
  if(preview && !preview.error){
    h += '<div style="background:linear-gradient(135deg,#7c3aed15,#a78bfa15);border:2px solid var(--accent);border-radius:14px;padding:16px;margin-bottom:16px;text-align:center;">';
    h += '<div style="font-size:11px;color:var(--accent-light);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Result Preview</div>';
    h += '<div style="font-size:36px;margin-bottom:4px;">'+preview.icon+'</div>';
    h += '<div style="font-size:16px;font-weight:700;color:var(--accent-light);">'+preview.name+'</div>';
    h += '<div style="font-size:11px;color:var(--success);margin-top:4px;">';
    const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[preview.stat] || preview.stat;
    h += statLabel + ' +' + preview.val;
    if(preview.pct) h += ' (+'+Math.floor(preview.pct*100)+'%)';
    h += '</div>';
    h += '<div style="font-size:10px;color:var(--gold);margin-top:4px;">'+preview.r.toUpperCase()+'</div>';
    h += '</div>';

    h += '<button id="btn-confirm-combine" style="width:100%;padding:14px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--accent),#6d28d9);color:white;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 2px 12px var(--shadow-accent);">✨ Combine!</button>';
  }else if(preview && preview.error){
    h += '<div style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:center;color:var(--danger);font-size:13px;">'+preview.error+'</div>';
  }else{
    h += '<div style="background:var(--bg-hover);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:16px;text-align:center;color:var(--text-dim);font-size:13px;">Select 3 matching runes to see the result</div>';
  }

  // Rune grid for selection
  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin:16px 0 10px;">Your Runes</div>';
  if(G.runes.length===0){
    h += '<div style="text-align:center;padding:20px;color:var(--text-dim);">No runes to combine.</div>';
  }else{
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">';
    for(let i=0;i<G.runes.length;i++){
      const r=G.runes[i];
      const isSelected = selected.includes(i);
      const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[r.stat] || r.stat;

      h += '<button class="rune-combine-select" data-ri="'+i+'" style="background:'+(isSelected?r.color+'30':'var(--bg-card)')+';border:2px solid '+(isSelected?r.color:'var(--border)')+';border-radius:12px;padding:10px 6px;text-align:center;cursor:pointer;transition:all 0.2s;position:relative;">';
      if(isSelected){
        h += '<div style="position:absolute;top:-6px;right:-6px;background:var(--accent);color:white;width:18px;height:18px;border-radius:50%;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;">✓</div>';
      }
      h += '<div style="font-size:22px;margin-bottom:4px;">'+r.icon+'</div>';
      h += '<div style="font-size:10px;font-weight:600;color:'+(isSelected?r.color:'var(--text)')+';">'+r.name.replace('Rune of ','')+'</div>';
      h += '<div style="font-size:9px;color:var(--text-dim);margin-top:2px;">'+statLabel+'+'+r.val+'</div>';
      h += '</button>';
    }
    h += '</div>';
  }

  h += '</div>';
  return h;
}

function rTalents(){
  let h='<div style="padding:16px;"><h2 class="st">🌟 Planar Talents</h2>';
  h+='<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;text-align:center;">Unlock every 2 levels starting at 16</div>';
  h+='<div style="display:flex;flex-direction:column;gap:10px;">';
  for(let t of TALENTS){
    const unlocked=G.talents.includes(t.id);
    const canUnlock=G.p.lvl>=t.lv;
    h+='<div style="background:var(--bg-card);border:2px solid '+(unlocked?'#22c55e':canUnlock?'#a78bfa':'#6b7280')+';border-radius:14px;padding:14px;opacity:'+(canUnlock?'1':'0.5')+';">';
    h+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">';
    h+='<span style="font-size:24px;">'+t.icon+'</span>';
    h+='<div style="flex:1;"><div style="font-weight:700;font-size:15px;color:'+(unlocked?'#22c55e':canUnlock?'var(--text)':'var(--text-dim)')+';">'+(unlocked?'✅ ':'')+t.name+'</div>';
    h+='<div style="font-size:11px;color:var(--text-dim);">Lv.'+t.lv+'</div></div>';
    h+='</div>';
    h+='<div style="font-size:12px;color:var(--text-dim);line-height:1.4;">'+t.desc+'</div>';
    if(unlocked) h+='<div style="font-size:11px;color:#22c55e;margin-top:6px;font-weight:600;">✨ ACTIVE</div>';
    else if(!canUnlock) h+='<div style="font-size:11px;color:var(--danger);margin-top:6px;">🔒 Requires Level '+t.lv+'</div>';
    h+='</div>';
  }
  h+='</div>';
  h+='<div style="margin-top:16px;font-size:11px;color:var(--text-dim);text-align:center;">'+G.talents.length+'/'+TALENTS.length+' talents unlocked</div>';
  h+='</div>';
  return h;
}

// === REPLACE your rGrindRoom function with this ===

function rGrindRoom() {
  const g = G.endlessGrind;
  let h = '<div class="content">';
  
  h += '<div class="st" style="text-align:center;">⚔️ Endless Grind Room</div>';
  
  // Stats bar
  h += '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:12px;flex-wrap:wrap;">';
  h += '<span class="mst">Wave: <b>' + g.wave + '</b></span>';
  h += '<span class="mst">Kills: <b>' + g.totalKills + '</b></span>';
  h += '<span class="mst">XP: <b>' + g.totalXp + '</b></span>';
  h += '<span class="mst" style="color:var(--gold)">Gold: <b>' + g.totalGold + '</b></span>';
  h += '</div>';
  
  // Difficulty badge
  const diffColors = { normal: '#22c55e', hard: '#f59e0b', nightmare: '#ef4444' };
  h += '<div style="text-align:center;margin-bottom:16px;">';
  h += '<span style="font-size:11px;padding:4px 12px;border-radius:10px;background:' + diffColors[g.difficulty] + '20;color:' + diffColors[g.difficulty] + ';font-weight:600;text-transform:uppercase;">';
  h += g.difficulty + ' (×' + g.difficultyMult[g.difficulty] + ')</span>';
  h += '</div>';
  
  // MAIN CONTROLS
  if (!g.active) {
    // Between waves or fresh start
    h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:12px;">';
    
    if (g.wave === 0) {
      // FRESH START - show all settings
      h += '<div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--accent-light);">Grind Settings</div>';
      
      // Tier selector
      h += '<div style="margin-bottom:12px;">';
      h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Max Zone Tier</div>';
      h += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
      const maxTier = Math.min(G.p.lvl, 23);
      for (let t = 1; t <= maxTier; t++) {
        const z = G.zones.find(zn => zn.lv === t);
        const name = z ? z.n.split(' ')[0] : 'Lv' + t;
        const isSel = g.maxZoneLevel === t;
        h += '<button onclick="setGrindTier(' + t + ')" style="padding:6px 10px;border-radius:8px;border:1px solid ' + (isSel ? 'var(--accent)' : 'var(--border)') + ';background:' + (isSel ? 'var(--accent)' : 'var(--bg-card)') + ';color:' + (isSel ? 'white' : 'var(--text)') + ';font-size:11px;cursor:pointer;">' + name + '</button>';
      }
      h += '</div></div>';
      
      // Difficulty toggle
      h += '<div style="margin-bottom:12px;">';
      h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Difficulty</div>';
      h += '<div style="display:flex;gap:6px;">';
      const diffs = ['normal', 'hard', 'nightmare'];
      for (let d of diffs) {
        const isSel = g.difficulty === d;
        h += '<button onclick="toggleGrindDifficulty()" style="flex:1;padding:8px;border-radius:8px;border:1px solid ' + (isSel ? diffColors[d] : 'var(--border)') + ';background:' + (isSel ? diffColors[d] + '20' : 'var(--bg-card)') + ';color:' + (isSel ? diffColors[d] : 'var(--text-dim)') + ';font-size:12px;font-weight:600;cursor:pointer;">' + d + '</button>';
      }
      h += '</div></div>';
      
      // Auto-next toggle
      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">';
      h += '<input type="checkbox" id="grind-autonext" ' + (g.autoNext ? 'checked' : '') + ' onchange="toggleAutoNext()" style="width:18px;height:18px;accent-color:var(--accent);">';
      h += '<label for="grind-autonext" style="font-size:13px;cursor:pointer;">Auto-start next wave</label>';
      h += '</div>';
      
      h += '<button onclick="enterGrindRoom()" class="abtn" style="width:100%;">Start Grinding</button>';
      
        } else {
      // BETWEEN WAVES - show Next Wave, Stop, and Leave options
      h += '<div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--accent-light);">Wave ' + g.wave + ' Complete!</div>';
      h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ready for the next wave?</div>';
      
      h += '<button onclick="startGrindWave()" class="abtn" style="width:100%;margin-bottom:8px;">▶️ Next Wave</button>';
      h += '<button onclick="exitGrindRoom()" style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:14px;font-weight:600;cursor:pointer;margin-bottom:8px;">⏹ Stop & Collect Loot</button>';
      
      // NEW: Leave and reset button
      h += '<button onclick="leaveAndResetGrind()" style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--text-dim);background:transparent;color:var(--text-dim);font-size:13px;font-weight:600;cursor:pointer;">🚪 Leave Room & Reset (Start Fresh)</button>';
    }
 
    h += '</div>';
    
  } else {
    // ACTIVE COMBAT - show STOP button
    h += '<div style="background:var(--bg-card);border:2px solid var(--danger);border-radius:14px;padding:16px;margin-bottom:12px;text-align:center;">';
    h += '<div style="font-size:13px;color:var(--text-dim);margin-bottom:10px;">Wave ' + g.wave + ' in progress...</div>';
    h += '<button onclick="exitGrindRoom()" style="width:100%;padding:14px;border-radius:12px;border:2px solid var(--danger);background:var(--danger);color:white;font-size:15px;font-weight:700;cursor:pointer;">⏹ STOP GRIND</button>';
    h += '<div style="font-size:11px;color:var(--text-dim);margin-top:8px;">Returns to camp with current loot</div>';
    h += '</div>';
  }
  
  // Session summary (always visible)
  if (g.wave > 0) {
    h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">📊 This Session</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;">';
    h += '<div>Started: <span style="color:var(--text-dim);">' + new Date(g.sessionStart).toLocaleTimeString() + '</span></div>';
    h += '<div>Waves: <span style="color:var(--accent-light);">' + g.wave + '</span></div>';
    h += '<div>Total Kills: <span style="color:var(--accent-light);">' + g.totalKills + '</span></div>';
    h += '<div>Total XP: <span style="color:var(--xp);">' + g.totalXp + '</span></div>';
    h += '<div>Total Gold: <span style="color:var(--gold);">' + g.totalGold + '</span></div>';
    h += '<div>Avg/ Wave: <span style="color:var(--text-dim);">' + (g.wave > 0 ? Math.floor(g.totalXp / g.wave) : 0) + ' XP</span></div>';
    h += '</div></div>';
  }
  
  h += '</div>';
  return h;
}

function setGrindTier(tier) {
  G.endlessGrind.maxZoneLevel = tier;
  lg('📍 Max tier set to ' + tier);
  render();
}


function rMenu(){
  const items=[
    {i:'⚔️',l:'Adventure',d:'Explore zones and fight',a:'explore'},
    {i:'👥',l:'Party',d:'Manage companions',a:'party'},
    {i:'✨',l:'Skills',d:'View mage abilities',a:'skills'},
    {i:'⚒️',l:'Crafting',d:'Brew potions, forge gear',a:'craft'},
    {i:'📜',l:'Quests',d:'View active quests',a:'quest'},
    {i:'🎒',l:'Inventory',d:'Manage items',a:'inventory'},
    {i:'📖',l:'Bestiary',d:'Catalogue of defeated foes',a:'bestiary'},
    {i:'🏆',l:'Achievements',d:'Track your milestones',a:'achievements'},
    {i:'🌳',l:'Skill Trees',d:'Choose your specialization',a:'skilltree'},
    {i:'🌟',l:'Talents',d:'View planar talents (Lv.16+)',a:'talents'},
    {i:'💎',l:'Runes',d:'Socket runes into gear (Lv.20+)',a:'runes'},
    {i:'📖',l:'Journal',d:'Chronicles of your journey',a:'journal'},
    {i:'🌀',l:'Grind Room',d:'Endless wave battles',a:'grind_room'},
    {i:'🧳',l:'Traders',d:'Buy from wandering merchants',a:'npc'},
    {i:'🧘',l:'Focus Mode',d:'5–25 min ADHD timer',a:'focus'},
    {i:'💤',l:'Rest',d:'Find a safe place to rest',a:'rest'},
  ];
  let h='<div class="grid2">';
  for(let m of items)h+='<div class="card" data-a="'+m.a+'"><div class="cicon">'+m.i+'</div><div class="clabel">'+m.l+'</div><div class="cdesc">'+m.d+'</div></div>';
  h+='</div>';
  // Theme toggle row
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  h+='<div style="margin-top:12px;text-align:center;">';
  h+='<button onclick="toggleTheme()" style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:10px 20px;color:var(--text);font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;">';
  h+= isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
  h+='</button></div>';
  h+='<div style="margin-top:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;">';
  h+='<h3 style="font-size:14px;margin-bottom:10px;color:var(--accent-light);">Save Data</h3>';
  h+='<div style="display:flex;gap:8px;flex-wrap:wrap;">';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;" id="btn-save">Save Now</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:#374151;" id="btn-export">Export</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:#374151;" id="btn-import">Import</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:var(--danger);" id="btn-reset">Reset</button>';
  h+='</div>';
  h+='<div style="margin-top:8px;font-size:11px;color:var(--text-dim);">Auto-saves every 30 seconds</div>';
  h+='</div>';
  return h;
}

function rExp(){
  let h='<div class="explore-view"><h2 class="st">Adventure Zones</h2><div class="zlist">';
  for(let i=0;i<G.zones.length;i++){
    const z=G.zones[i],lk=G.p.lvl<z.lv;
    const dc=z.dg=='low'?'#22c55e':z.dg=='medium'?'#eab308':z.dg=='high'?'#f97316':z.dg=='very high'?'#ef4444':'#a855f7';
    const hazard = G.zoneHazards[z.n];
    h+='<div class="zcard '+(lk?'locked':'')+'" data-i="'+i+'"><div class="zh"><span class="zn">'+z.n+'</span><span class="zl">Lv.'+z.lv+(lk?' 🔒':'')+'</span></div><div class="zd">'+z.d+'</div>';
    if(hazard){
      h+='<div style="font-size:10px;color:#f59e0b;margin-bottom:6px;">⚠️ Hazard: '+hazard.desc+'</div>';
    }
    h+='<div class="zm"><span class="db" style="background:'+dc+'20;color:'+dc+'">'+z.dg+'</span><span class="xb">'+z.xp+' XP</span></div></div>';
  }
  h+='</div></div>'; return h;
}

function rCbt() {
  let h = '<div class="combat-view"><h2 class="st">' + (G.currentBoss ? '⚔️ BOSS FIGHT' : 'Combat') + '</h2>';
  
  const synDesc = getSynergyDesc();
  if (synDesc) {
    h += '<div style="background:#7c3aed15;border:1px solid var(--accent);border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:var(--accent-light);">';
    h += '✨ ' + synDesc + '</div>';
  }

  // Planar Resonance Indicator (Phase 2)
  const zone = G.zones.find(z => z.en.includes(G.cbt.en[0]?.n));
  if (zone && zone.elem) {
    const resStatus = getResonanceStatus(zone.n);
    h += '<div style="background:' + resStatus.color + '15;border:1px solid ' + resStatus.color + ';border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:' + resStatus.color + ';">';
    h += resStatus.icon + ' ' + resStatus.text + '</div>';
  }

  // Dimensional Instability Indicator (Phase 2)
  const riftStatus = getRiftStatus();
  if (riftStatus) {
    h += '<div style="background:' + riftStatus.color + '15;border:1px solid ' + riftStatus.color + ';border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:' + riftStatus.color + ';">';
    h += riftStatus.icon + ' ' + riftStatus.name + ': ' + riftStatus.desc + ' (' + riftStatus.fightsLeft + ' fights left)</div>';
  }
  
  h += '<button id="btn-auto" style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid ' + (G.cbt.autoCombat ? '#22c55e' : 'var(--disabled)') + ';background:' + (G.cbt.autoCombat ? '#22c55e15' : 'transparent') + ';color:' + (G.cbt.autoCombat ? '#22c55e' : 'var(--text-dim)') + ';font-size:12px;font-weight:600;cursor:pointer;margin-bottom:12px;user-select:none;">';
  h += (G.cbt.autoCombat ? '🤖 AUTO ON — Tap to take control' : '🤖 Auto-Combat — Let AI fight') + '</button>';

  // Potion button
  const potions = getCombatPotions();
  const usablePotions = potions.filter(p => {
    if (p.t === 'revive') return getDeadParty().length > 0;
    return true;
  });
  h += '<button onclick="togglePotionMenu()" style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid ' + (usablePotions.length > 0 ? '#22c55e' : 'var(--disabled)') + ';background:' + (usablePotions.length > 0 ? '#22c55e15' : 'transparent') + ';color:' + (usablePotions.length > 0 ? '#22c55e' : 'var(--disabled)') + ';font-size:12px;font-weight:600;cursor:' + (usablePotions.length > 0 ? 'pointer' : 'not-allowed') + ';margin-bottom:12px;user-select:none;">';
  h += (G.potionMenu ? '❌ Close Potion Bag' : '🧪 Use Potion (' + usablePotions.length + ' usable)') + '</button>';

  // Potion menu
  if (G.potionMenu && potions.length > 0) {
    h += '<div style="background:var(--bg-card);border:1px solid #22c55e;border-radius:12px;padding:10px;margin-bottom:12px;">';
    h += '<div style="font-size:11px;color:#22c55e;margin-bottom:8px;">🧪 Quick Potion Bag</div>';
    h += '<div style="display:flex;flex-direction:column;gap:6px;">';
    for (let i = 0; i < G.p.inv.length; i++) {
      const it = G.p.inv[i];
      // Regular potions (heal/mana)
      if ((it.t === 'pot' || it.t === 'food' || it.t === 'drink') && (it.eff === 'heal' || it.eff === 'mana')) {
        const isHeal = it.eff === 'heal';
        const icon = isHeal ? '❤️' : '💧';
        const color = isHeal ? '#ef4444' : '#3b82f6';
        const current = isHeal ? G.p.hp + '/' + G.p.mhp : G.p.mp + '/' + G.p.mmp;
        const full = isHeal ? G.p.hp >= G.p.mhp : G.p.mp >= G.p.mmp;
        h += '<button onclick="usePotionInCombat(' + i + ')" style="padding:10px 14px;border-radius:10px;border:1px solid ' + color + ';background:' + color + '15;color:' + (full ? 'var(--disabled)' : color) + ';font-size:12px;font-weight:600;cursor:' + (full ? 'not-allowed' : 'pointer') + ';display:flex;justify-content:space-between;align-items:center;opacity:' + (full ? '0.5' : '1') + ';">';
        h += '<span>' + icon + ' ' + it.n + (it.q > 1 ? ' x' + it.q : '') + '</span>';
        h += '<span>' + (full ? 'FULL' : '+' + it.v + ' ' + (isHeal ? 'HP' : 'MP')) + ' · ' + current + '</span>';
        h += '</button>';
      }
      // Revive items (Phoenix Feather, etc.)
      else if (it.t === 'revive') {
        const deadMembers = getDeadParty();
        const hasDead = deadMembers.length > 0;
        const color = hasDead ? '#f59e0b' : 'var(--disabled)';
        const icon = '🔥';
        h += '<button onclick="usePotionInCombat(' + i + ')" style="padding:10px 14px;border-radius:10px;border:1px solid ' + color + ';background:' + color + '15;color:' + color + ';font-size:12px;font-weight:600;cursor:' + (hasDead ? 'pointer' : 'not-allowed') + ';display:flex;justify-content:space-between;align-items:center;opacity:' + (hasDead ? '1' : '0.5') + ';">';
        h += '<span>' + icon + ' ' + it.n + (it.q > 1 ? ' x' + it.q : '') + '</span>';
        h += '<span>' + (hasDead ? 'Revive 50% HP' : 'No one to revive') + ' · ' + deadMembers.length + ' down</span>';
        h += '</button>';
      }
    }
    h += '</div></div>';
  }
  
  // Reuse zone variable from resonance check above
  if (zone && G.zoneHazards[zone.n]) {
    const haz = G.zoneHazards[zone.n];
    h += '<div style="background:#f59e0b15;border:1px solid #f59e0b;border-radius:12px;padding:8px;margin-bottom:12px;font-size:11px;color:#f59e0b;">';
    h += '⚠️ Zone Hazard: ' + haz.name + ' — ' + haz.desc + '</div>';
  }
  
  if (G.currentBoss) {
    h += '<div style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:10px;margin-bottom:12px;font-size:12px;color:var(--danger);">';
    h += '🔥 ' + G.currentBoss.desc + '</div>';
  }
  
  const playerAC = getPlayerAC();
  const eqStats = getEquippedStats();
  h += '<div style="display:flex;justify-content:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;">';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">AC </span><span style="font-weight:700;color:var(--accent-light);">' + playerAC + '</span>';
  if(eqStats.def > 0) h += '<span style="font-size:9px;color:var(--success);"> +' + eqStats.def + 'eq</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">PROF </span><span style="font-weight:700;color:var(--gold);">+' + DICE.proficiencyBonus(G.p.lvl) + '</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">ATK </span><span style="font-weight:700;color:var(--hp);">+' + (eqStats.atk + (G.p.eq.weapon?.atk||0)) + '</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">CRIT </span><span style="font-weight:700;color:var(--danger);">' + Math.floor(getTotalCritChance() * 100) + '%</span>';
  if(eqStats.critChance > 0) h += '<span style="font-size:9px;color:var(--success);"> +' + Math.floor(eqStats.critChance*100) + '%eq</span>';
  h += '</div>';
  h += '</div>';
  
  h += '<div class="erow">';
  for (let i = 0; i < G.cbt.en.length; i++) {
    const e = G.cbt.en[i], d = e.hp <= 0, s = G.cbt.tg == i && !d ? 'sel' : '';
    const immuneFire = ['Fire Imp', 'Lava Slug', 'Ash Wraith'].includes(e.n);
    const immuneIce = ['Ice Elemental', 'Frost Wolf', 'Frozen Knight'].includes(e.n);
    const isBoss = e.mechanic ? true : false;
    const enemyAC = getEnemyAC(e);
    
    h += '<div class="ecard ' + (d ? 'dead' : '') + ' ' + s + '" data-i="' + i + '" style="' + (isBoss ? 'border-color:var(--danger);box-shadow:0 0 10px #ef444440;' : '') + '">';
    h += '<div class="eicon">' + (d ? '💀' : ee(e.n)) + '</div>';
    h += '<div class="ename">' + e.n + (isBoss ? ' 👑' : '') + '</div>';
    
    if (!d) {
      h += '<div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">AC ' + enemyAC + '</div>';
    }
    
    if (!d && e.elem && e.elem !== 'none') {
      const elemIcon = e.elem === 'fire' ? '🔥' : e.elem === 'ice' ? '❄️' : e.elem === 'lightning' ? '⚡' : e.elem === 'void' ? '🌑' : '✦';
      h += '<div style="font-size:10px;color:#f59e0b;margin-top:2px;">' + elemIcon + ' ' + e.elem + '</div>';
    }
    
    if (!d && e.status && e.status.length > 0) {
      const statusIcons = e.status.map(s => s.type === 'burn' ? '🔥' : s.type === 'poison' ? '☠️' : s.type === 'shock' ? '⚡' : '✦').join('');
      h += '<div style="font-size:10px;color:var(--danger);margin-top:2px;">' + statusIcons + ' (' + e.status[0].turns + 't)</div>';
    }
    
    if (!d && (immuneFire || immuneIce)) {
      h += '<div class="e-immune">' + (immuneFire ? '🔥 Fire Immune' : (immuneIce ? '❄️ Ice Immune' : '')) + '</div>';
    }
    
    if (!d && e.mechanic === 'resurrect') {
      h += '<div style="font-size:10px;color:var(--danger);">💀 Lives: ' + (e.resurrectCount + 1) + '</div>';
    }
    
    if (!d && e.mechanic === 'phase') {
      h += '<div style="font-size:10px;color:var(--accent-light);">💎 Phase ' + e.currentPhase + '/' + e.phases + '</div>';
    }
    
    h += (d ? '<div class="dt">DEFEATED</div>' : '<div class="hps"><div class="bf bf-hp" style="width:' + ((e.hp / e.mhp) * 100) + '%"></div></div><div class="hpt">' + e.hp + '/' + e.mhp + '</div>') + '</div>';
  }
  h += '</div>';
  
  h += '<div class="pstat"><div class="mst"><span class="md" style="background:#7c3aed"></span>San ' + G.p.hp + '/' + G.p.mhp + ' AC' + playerAC + '</div>';
  for (let p of G.party) {
    if (p.on) {
      h += '<div class="mst"><span class="md" style="background:' + p.col + '"></span>' + p.n + ' ' + p.hp + '/' + p.mhp + '</div>';
    }
  }
  h += '</div>';
  
  h += '<div class="skills"><h3>Select Skill</h3><div class="slist">';
  
  const basicSel = G.cbt.sk === -1 && !G.cbt.autoCombat ? 'sel' : '';
  h += '<div class="sbtn ' + basicSel + '" data-i="-1" ' + (G.cbt.autoCombat ? 'style="opacity:0.4;cursor:not-allowed;"' : '') + '>';
  h += '<div class="sn">🪄 Staff Swing</div>';
  h += '<div class="sc">0 MP · Physical · 1d4 + STR</div>';
  h += '<div class="sd">Swing your staff when your spell slots are spent.</div>';
  h += '</div>';
  
    const ls = G.p.skills.filter(s => s.on);
  for (let i = 0; i < ls.length; i++) {
    const s = ls[i];
    const costLabel = typeof getSpellCostLabel === 'function'
      ? getSpellCostLabel(s)
      : (s.c + ' MP');
    const u = G.p.mp >= s.c && !G.cbt.autoCombat;
    const sel = G.cbt.sk == i && !G.cbt.autoCombat ? 'sel' : '';
    const critPct = Math.floor(getTotalCritChance() * 100);
    const highTier = Number(s.slotTier || 1) >= 4;
    const nameStyle = highTier ? ' style="color:#ef4444;font-weight:700;"' : '';
    
    h += '<div class="sbtn ' + (u ? '' : 'dis') + ' ' + sel + '" data-i="' + i + '" ' +
         (G.cbt.autoCombat ? 'style="opacity:0.4;cursor:not-allowed;"' : '') + '>';
    h += '<div class="sn"' + nameStyle + '>' + (s.buff ? '🛡️' : '⚡') + ' ' + s.n + '</div>';
    h += '<div class="sc">' + costLabel + ' · ' + (s.dmg || 'Buff') + ' · ' +
         critPct + '% Crit' + (G.cbt.autoCombat ? ' · 🤖 AUTO' : '') + '</div>';
    h += '<div class="sd">' + s.d + '</div>';
    if (s.elem) {
      const weakAgainst = s.elem === 'fire' ? 'Ice' : s.elem === 'ice' ? 'Fire' : s.elem === 'lightning' ? 'Void' : '';
      if (weakAgainst) {
        h += '<div style="font-size:10px;color:var(--success);">Strong vs: ' + weakAgainst + '</div>';
      }
    }
    h += '</div>';
  }
  h += '</div>';
  
  const isBasic = G.cbt.sk === -1;
  const sk = isBasic ? null : ls[G.cbt.sk];
  const ca = isBasic 
    ? (G.cbt.tg >= 0 && !G.cbt.autoCombat) 
    : (sk && G.p.mp >= sk.c && !G.cbt.autoCombat);
  const si = isBasic ? -1 : G.p.skills.indexOf(sk);
  
  h += '<button class="abtn ' + (ca ? '' : 'dis') + '" data-si="' + si + '" data-ti="' + G.cbt.tg + '" ' + (G.cbt.autoCombat ? 'disabled style="opacity:0.4;"' : '') + '>';
  h += (isBasic ? '🪄 Staff Swing' : 'Cast ' + (sk ? sk.n : '...')) + '</button>';
  h += '<button class="fbtn" ' + (G.cbt.autoCombat ? 'disabled style="opacity:0.4;"' : '') + '>Flee</button>';
 
   // === GRIND ROOM WAVE CONTROLS ===
  if (G.endlessGrind.active) {
    h += '<div style="background:var(--bg-card);border:2px solid var(--accent);border-radius:14px;padding:14px;margin-top:16px;text-align:center;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">⚔️ Grind Room · Wave ' + G.endlessGrind.wave + '</div>';
    
    if (G.endlessGrind.autoNext) {
      h += '<div style="font-size:12px;color:var(--success);">🤖 Auto-next: ON</div>';
    } else {
      h += '<button onclick="startGrindWave()" class="abtn" style="width:100%;margin-bottom:8px;">▶️ Next Wave</button>';
    }
    
    h += '<button onclick="exitGrindRoom()" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:13px;font-weight:600;cursor:pointer;">⏹ Stop & Exit</button>';
    h += '</div>';
  }
  // === END GRIND ROOM WAVE CONTROLS ===

  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:12px;margin-top:12px;">';
  h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">🎲 D&D Combat Rules</div>';
  h += '<div style="font-size:10px;color:var(--text-dim);line-height:1.6;">';
  h += '• Attack: d20 + PROF(+' + DICE.proficiencyBonus(G.p.lvl) + ') + Ability Mod vs Target AC<br>';
  h += '• Natural 20 = Critical Hit (double dice)<br>';
  h += '• Natural 1 = Critical Miss (auto-fail)<br>';
  h += '• Advantage: Roll 2d20, keep higher<br>';
  h += '• Your AC: ' + playerAC + ' | INT Mod: ' + (DICE.abilityMod(G.p.stats.int) >= 0 ? '+' : '') + DICE.abilityMod(G.p.stats.int);
  h += '</div></div>';
  
  h += '</div></div>';
  return h;
}


function rParty(){
  let h='<div class="party-view"><h2 class="st">Party</h2>';
  const activeSyns = getActiveSynergies();
  if(activeSyns.length > 0){
    h += '<div style="background:var(--bg-card);border:1px solid var(--accent);border-radius:14px;padding:12px;margin-bottom:16px;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">✨ Active Synergies</div>';
    h += '<div style="display:flex;flex-direction:column;gap:8px;">';
    for(let syn of activeSyns){
      h += '<div style="display:flex;align-items:center;gap:8px;font-size:12px;">';
      h += '<span style="font-size:16px;">' + syn.icon + '</span>';
      h += '<div style="flex:1;"><div style="font-weight:600;">' + syn.name + '</div>';
      h += '<div style="font-size:10px;color:var(--text-dim);">' + syn.desc + '</div></div>';
      h += '</div>';
    }
    h += '</div></div>';
  }
  h += '<div class="plist">';
  for(let p of G.party){
    h+='<div class="pcard '+(p.on?'':'locked')+'"><div class="pava" style="background:'+p.col+'20;border-color:'+p.col+'"><span style="font-size:28px">'+(p.on?re(p.r):'🔒')+'</span></div><div class="pinfo"><div class="pn">'+p.n+' <span class="pt">'+p.t+'</span></div><div class="pr" style="color:'+p.col+'">'+p.r+'</div><div class="pd">'+p.d+'</div><div class="pb">'+p.b+'</div>'+(p.on?'<div class="ps">HP:'+p.hp+'/'+p.mhp+' ATK:'+p.atk+(p.gear&&p.gear.atk?'(+'+p.gear.atk+')':'')+' DEF:'+p.def+(p.gear&&p.gear.def?'(+'+p.gear.def+')':'')+' SPD:'+p.spd+(p.gear&&p.gear.spd?'(+'+p.gear.spd+')':'')+(getBlessDef(p)?' <span style="color:var(--rest);font-weight:700;">🐱+10 DEF</span>':'')+'</div>':'')+(G.affinity[p.n]?'<div class="affinity-bar"><div class="affinity-fill '+getAffinityColor(G.affinity[p.n].val)+'" style="width:'+(G.affinity[p.n].val/G.affinity[p.n].max*100)+'%"></div></div><div class="affinity-label">'+(G.affinity[p.n].val>=70?'💕 Close':G.affinity[p.n].val>=40?'💛 Friendly':G.affinity[p.n].val>=20?'💔 Distant':'💀 Strained')+' ('+G.affinity[p.n].val+'/'+G.affinity[p.n].max+')</div>':'')
+(G.affinityUnlocks[p.n]?'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">'+G.affinityUnlocks[p.n].map(function(u){var un=p.affinityBonuses&&p.affinityBonuses.includes(u.id);return '<span title="'+u.d+'" style="font-size:9px;padding:2px 6px;border-radius:8px;border:1px solid '+(un?'var(--xp);color:var(--xp);':'var(--border);color:var(--text-dim);opacity:0.6;')+'">'+(un?'🌟 ':'🔒 ')+u.n+' ('+u.th+')</span>';}).join('')+'</div>':'')+'</div></div>';
    // === STAGE 1: ENHANCED TRINKET/GEAR SYSTEM ===
    if(p.on || p.ul <= G.p.lvl){
      h += '<div style="background:var(--bg-hover);border:1px solid var(--border);border-radius:10px;padding:10px;margin-top:8px;">';
      h += '<div style="font-size:11px;font-weight:600;color:var(--accent-light);margin-bottom:6px;">🎁 Trinket Slot</div>';
      if(p.gear){
        // Equipped trinket display with rarity color
        const rarityColor = p.gear.r ? (p.gear.r==='epic'?'#a855f7':p.gear.r==='rare'?'#3b82f6':p.gear.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
        h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
        h += '<span style="font-size:12px;font-weight:600;color:'+rarityColor+';">' + p.gear.n + '</span>';
        h += '<button class="unequip-pgear" data-member="' + p.n + '" style="padding:4px 10px;border-radius:8px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:11px;font-weight:600;cursor:pointer;">Unequip</button>';
        h += '</div>';
        h += '<div style="font-size:10px;color:var(--text-dim);">';
        const stats = [];
        if(p.gear.atk) stats.push('+ ' + p.gear.atk + ' ATK');
        if(p.gear.def) stats.push('+ ' + p.gear.def + ' DEF');
        if(p.gear.hp) stats.push('+ ' + p.gear.hp + ' HP');
        if(p.gear.mp) stats.push('+ ' + p.gear.mp + ' MP');
        if(p.gear.spd) stats.push('+ ' + p.gear.spd + ' SPD');
        h += stats.join(' · ') + '</div>';
        if(p.gear.d) h += '<div style="font-size:10px;color:var(--accent-light);margin-top:4px;font-style:italic;">' + p.gear.d + '</div>';
      } else {
        h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Empty trinket slot</div>';
        // Show ALL equippable pgear items (not just for this member)
        const allPgear = G.p.inv.map((it, idx) => ({it, idx})).filter(x => x.it.t === 'pgear');
        if(allPgear.length > 0){
          h += '<div style="display:flex;flex-direction:column;gap:4px;">';
          for(let eq of allPgear){
            const isForThis = !eq.it.for || eq.it.for === p.n;
            const rarityColor = eq.it.r ? (eq.it.r==='epic'?'#a855f7':eq.it.r==='rare'?'#3b82f6':eq.it.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
            if(isForThis){
              h += '<button class="equip-pgear" data-member="' + p.n + '" data-idx="' + eq.idx + '" style="padding:6px 10px;border-radius:8px;border:1px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:11px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
              h += '<span style="color:'+rarityColor+';">' + eq.it.n + '</span>';
              h += '<span style="font-size:10px;color:var(--text-dim);">Equip →</span>';
              h += '</button>';
            }
          }
          // Show incompatible items as disabled
          const incompatible = allPgear.filter(x => x.it.for && x.it.for !== p.n);
          if(incompatible.length > 0){
            h += '<div style="font-size:10px;color:var(--disabled);margin-top:4px;padding-top:4px;border-top:1px solid var(--border);">Not for ' + p.n + ':</div>';
            for(let eq of incompatible){
              h += '<div style="padding:4px 10px;border-radius:8px;background:var(--nav-bg);color:var(--disabled);font-size:10px;">' + eq.it.n + ' (' + eq.it.for + ' only)</div>';
            }
          }
          h += '</div>';
        } else {
          h += '<div style="font-size:10px;color:var(--disabled);margin-top:4px;">Buy trinkets from traders like Ribald, Deidre, or Nym.</div>';
        }
      }
      h += '</div>';
    }
  }
  h+='</div></div>'; return h;
}
function rSkills(){
  let h='<div class="skills-view"><h2 class="st">Mage Skills</h2><div class="sklist">';
  for(let s of G.p.skills){
    const st=s.on?'LEARNED':'Unlocks Lv.'+s.ul;
    h+='<div class="skcard '+(s.on?'':'locked')+'"><div class="skh"><span class="ski">'+(s.buff?'🛡️':'⚡')+'</span><span class="skt">'+s.n+'</span><span class="sks">'+st+'</span></div><div class="skd"><span class="dp">'+s.c+' MP</span><span class="dp">'+(s.dmg||'Buff')+'</span></div><div class="skdsc">'+s.d+'</div></div>';
  }
  h+='</div><div class="stb"><h3>Character Stats</h3>';
  for(let [k,v] of Object.entries(G.p.stats))h+='<div class="str"><span class="stn">'+k.toUpperCase()+'</span><span class="stv">'+v+'</span></div>';
  h+='</div></div>'; return h;
}

function getEquipScore(item) {
  if (!item || !item.slot) return 0;
  let score = 0;
  if (item.atk) score += item.atk * 3;
  if (item.def) score += item.def * 3;
  if (item.int) score += item.int * 2;
  if (item.str) score += item.str * 2;
  if (item.dex) score += item.dex * 2;
  if (item.con) score += item.con * 2;
  if (item.wis) score += item.wis * 2;
  if (item.cha) score += item.cha * 1;
  if (item.fireDmg) score += item.fireDmg * 2;
  if (item.iceDmg) score += item.iceDmg * 2;
  if (item.lightDmg) score += item.lightDmg * 2;
  if (item.voidDmg) score += item.voidDmg * 2;
  if (item.arcaneDmg) score += item.arcaneDmg * 2;
  if (item.lifeSteal) score += item.lifeSteal * 10;
  if (item.critChance) score += item.critChance * 20;
  if (item.mpRegen) score += item.mpRegen * 2;
  if (item.hpRegen) score += item.hpRegen * 2;
  return score;
}

function getEquipComparison(item) {
  if (!item || !item.slot) return null;
  const slot = item.slot === 'ring' ? (G.p.eq.ring1 ? 'ring2' : 'ring1') : item.slot;
  const equipped = G.p.eq[slot];
  if (!equipped) return { better: true, arrow: '▲', color: '#22c55e', text: 'New slot' };
  const itemScore = getEquipScore(item);
  const eqScore = getEquipScore(equipped);
  if (itemScore > eqScore) return { better: true, arrow: '▲', color: '#22c55e', text: 'Upgrade' };
  if (itemScore < eqScore) return { better: false, arrow: '▼', color: '#ef4444', text: 'Downgrade' };
  return { better: false, arrow: '●', color: '#9ca3af', text: 'Sidegrade' };
}

function rInv(){
  let h='<div class="inventory-view"><h2 class="st">Inventory</h2>';

  // Equipment Stats Summary
  const eqStats = getEquippedStats();
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:12px;margin-bottom:16px;">';
  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">⚔️ Equipment Bonuses</div>';
  h += '<div style="display:flex;flex-wrap:wrap;gap:6px;font-size:10px;">';
  const statLabels = {atk:'ATK',def:'DEF',str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA',
                      fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',
                      lifeSteal:'🩸Leech',critChance:'💥Crit',mpRegen:'💧MP+',hpRegen:'💚HP+',goldFind:'💰Gold'};
  for(let k in statLabels){
    if(eqStats[k] > 0){
      const val = k === 'critChance' || k.includes('Res') ? (eqStats[k]*100)+'%' : (k.includes('Regen') ? '+'+eqStats[k]+'/turn' : '+'+eqStats[k]);
      h += '<span style="background:var(--bg-hover);padding:3px 8px;border-radius:8px;">'+statLabels[k]+' '+val+'</span>';
    }
  }
  h += '</div></div>';

  // Equipped Gear
  h+='<div class="eqs"><h3>Equipped Gear</h3><div class="eqg">';
  const slotOrder = ['weapon','armor','head','hands','feet','ring1','ring2','amulet'];
  const slotIcons = {weapon:'⚔️',armor:'🛡️',head:'🎓',hands:'🧤',feet:'👢',ring1:'💍',ring2:'💍',amulet:'📿'};
  for(let sl of slotOrder){
    const it=G.p.eq[sl];
    const slotName = EQUIPMENT_SLOTS[sl].name;
    h+='<div class="esl" style="cursor:pointer;" onclick="unequipItem(\'"+sl+"\')">';
    h+='<div class="esn">'+slotIcons[sl]+' '+slotName+'</div>';
    if(it){
      h+='<div class="eit" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      let stats = [];
      if(it.atk) stats.push('ATK+'+it.atk);
      if(it.def) stats.push('DEF+'+it.def);
      if(it.int) stats.push('INT+'+it.int);
      if(it.str) stats.push('STR+'+it.str);
      if(it.dex) stats.push('DEX+'+it.dex);
      if(it.con) stats.push('CON+'+it.con);
      if(it.wis) stats.push('WIS+'+it.wis);
      if(it.cha) stats.push('CHA+'+it.cha);
      if(it.prefix) stats.push(it.prefixData.desc);
      if(it.suffix) stats.push(it.suffixData.desc);
      h+='<div class="est">'+stats.join(' · ')+'</div>';
    }else{
      h+='<div class="ese">Empty</div>';
    }
    h+='</div>';
  }
  h+='</div></div>';

  // Categorize inventory items
  const equipItems = [];
  const consumableItems = [];
  const matItems = [];
  const otherItems = [];
  
  for(let i=0; i<G.p.inv.length; i++){
    const it = G.p.inv[i];
    const isEquip = it.slot && it.slot !== 'mat' && it.slot !== 'pot' && it.slot !== 'revive' && it.t !== 'food' && it.t !== 'drink';
    if(isEquip) equipItems.push({item: it, index: i});
    else if(it.t==='pot' || it.t==='food' || it.t==='drink' || it.t==='revive') consumableItems.push({item: it, index: i});
    else if(it.t==='mat') matItems.push({item: it, index: i});
    else otherItems.push({item: it, index: i});
  }

  // Equipment section
  if(equipItems.length > 0){
    h+='<div class="its"><h3>🎒 Equipment ('+equipItems.length+')</h3><div class="ig">';
    for(let ei of equipItems){
      const it = ei.item;
      const i = ei.index;
      const cmp = getEquipComparison(it);
      h+='<div class="ic" style="position:relative;">';
      if(cmp){
        h+='<div style="position:absolute;top:6px;right:6px;font-size:14px;color:'+cmp.color+';font-weight:700;" title="'+cmp.text+'">'+cmp.arrow+'</div>';
      }
      h+='<div class="ii">'+(EQUIPMENT_SLOTS[it.slot]?.icon || '⚔️')+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.ilvl) h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      h += getItemSocketDisplay(it);
      let statLine = [];
      if(it.atk) statLine.push('ATK+'+it.atk);
      if(it.def) statLine.push('DEF+'+it.def);
      if(it.int) statLine.push('INT+'+it.int);
      if(it.str) statLine.push('STR+'+it.str);
      if(it.dex) statLine.push('DEX+'+it.dex);
      if(it.con) statLine.push('CON+'+it.con);
      if(it.wis) statLine.push('WIS+'+it.wis);
      if(it.cha) statLine.push('CHA+'+it.cha);
      if(it.prefix) statLine.push(it.prefixData.desc);
      if(it.suffix) statLine.push(it.suffixData.desc);
      if(statLine.length > 0) h+='<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">'+statLine.join(' · ')+'</div>';
      h+='<div class="iq">'+(it.value ? it.value+'G' : '')+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-e" data-i="'+i+'">Equip</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Consumables section
  if(consumableItems.length > 0){
    h+='<div class="its"><h3>🧪 Consumables ('+consumableItems.length+')</h3><div class="ig">';
    for(let ci of consumableItems){
      const it = ci.item;
      const i = ci.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.eff==='heal') h+='<div style="font-size:10px;color:var(--success);">+'+it.v+' HP</div>';
      if(it.eff==='mana') h+='<div style="font-size:10px;color:var(--mp);">+'+it.v+' MP</div>';
      if(it.eff==='revive') h+='<div style="font-size:10px;color:var(--accent-light);">Revive '+it.v+'% HP</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-u" data-i="'+i+'">Use</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Materials section
  if(matItems.length > 0){
    h+='<div class="its"><h3>💎 Materials ('+matItems.length+')</h3><div class="ig">';
    for(let mi of matItems){
      const it = mi.item;
      const i = mi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  // Other items
  if(otherItems.length > 0){
    h+='<div class="its"><h3>📦 Other ('+otherItems.length+')</h3><div class="ig">';
    for(let oi of otherItems){
      const it = oi.item;
      const i = oi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  if(G.p.inv.length==0) h+='<div class="ei">Your pack is empty.</div>';
  h+='</div>';
  return h;
}

function rCraft(){
  let h='<div class="craft-view"><h2 class="st">Crafting</h2><div class="rlist">';
  for(let i=0;i<G.recipes.length;i++){
    const r=G.recipes[i]; let ok=true,ms='';
    for(let [mn,mq] of Object.entries(r.m)){
      const iv=G.p.inv.find(x=>x.n==mn);
      const hv=iv?iv.q:0,en=hv>=mq;
      if(!en)ok=false;
      ms+='<span class="mp '+(en?'ok':'miss')+'">'+mn+': '+hv+'/'+mq+'</span>';
    }
    h+='<div class="rc"><div class="rr"><span class="ri">'+ie(r.res)+'</span><span class="rn" style="color:'+rc(r.res.r)+'">'+r.n+'</span><span class="rd">'+r.d+'</span></div><div class="rms">'+ms+'</div><button class="cb '+(ok?'':'dis')+'" data-i="'+i+'">Forge</button></div>';
  }
  h+='</div></div>'; return h;
}

function toggleQuestCollapse(key){
  G.questCollapsed[key] = !G.questCollapsed[key];
  render();
}

function rQuest(){
  let h='<div class="quest-view">';
    // === DAILY LOGIN REWARDS ===
  const today = G.gameDay || 0;
  const streak = G.loginStreak || 0;
  const claimedToday = G.loginClaimed || false;

  const loginRewards = [
    { day: 1, icon: '💰', name: 'Gold Pouch', g: 50, xp: 25 },
    { day: 2, icon: '💧', name: 'Mana Crystal', mp: 30, xp: 35 },
    { day: 3, icon: '🧪', name: 'Health Potion', hp: 50, xp: 45 },
    { day: 4, icon: '💎', name: 'Gem Shard', g: 100, xp: 60 },
    { day: 5, icon: '⚔️', name: 'Mystic Scroll', g: 150, xp: 80 },
    { day: 6, icon: '🔮', name: 'Arcane Orb', mp: 50, xp: 100 },
    { day: 7, icon: '👑', name: 'Legendary Cache', g: 300, xp: 200, item: { n: 'Phoenix Feather', t: 'revive', eff: 'revive', v: 50, q: 1, r: 'rare' } }
  ];

  const todayReward = loginRewards[Math.min(streak, 6)];

  h += '<div style="background: linear-gradient(135deg, var(--accent), #6d28d9); border-radius: 16px; padding: 16px; margin-bottom: 16px; color: white;">';
  h += '<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">';
  h += '<div style="font-size: 28px;">🎁</div>';
  h += '<div><div style="font-weight: 700; font-size: 16px;">Daily Login Reward</div>';
  h += '<div style="font-size: 11px; opacity: 0.9;">Day ' + (streak + 1) + ' · Streak: ' + streak + '</div></div>';
  h += '</div>';

  h += '<div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px; margin-bottom: 12px;">';
  h += '<div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">Today\'s Reward:</div>';
  h += '<div style="display: flex; align-items: center; gap: 8px;">';
  h += '<div style="font-size: 32px;">' + todayReward.icon + '</div>';
  h += '<div style="flex: 1;">';
  h += '<div style="font-weight: 600; font-size: 14px;">' + todayReward.name + '</div>';
  h += '<div style="font-size: 11px; opacity: 0.85;">';
  const rewardParts = [];
  if (todayReward.g) rewardParts.push('+' + todayReward.g + 'G');
  if (todayReward.xp) rewardParts.push('+' + todayReward.xp + 'XP');
  if (todayReward.hp) rewardParts.push('+' + todayReward.hp + 'HP');
  if (todayReward.mp) rewardParts.push('+' + todayReward.mp + 'MP');
  if (todayReward.item) rewardParts.push(todayReward.item.n);
  h += rewardParts.join(' · ');
  h += '</div></div></div></div>';

  // Streak progress dots
  h += '<div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 12px;">';
  for (let i = 0; i < 7; i++) {
    const isActive = i < streak;
    const isToday = i === streak;
    h += '<div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; ' + 
      (isActive ? 'background: #fbbf24; color: #000;' : 
       isToday ? 'background: white; color: var(--accent); border: 2px solid #fbbf24;' : 
       'background: rgba(255,255,255,0.2); color: white;') + '">' + (i + 1) + '</div>';
  }
  h += '</div>';

  if (claimedToday) {
    h += '<button disabled style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: rgba(255,255,255,0.2); color: white; font-size: 13px; font-weight: 600; opacity: 0.6; cursor: not-allowed;">✅ Claimed Today — Come Back Tomorrow!</button>';
  } else {
    h += '<button id="btn-claim-login" style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: #fbbf24; color: #000; font-size: 13px; font-weight: 700; cursor: pointer;">🎁 Claim Reward</button>';
  }
  h += '</div>';
  // === END DAILY LOGIN ===

  // Storyline section
  h+='<h2 class="st">📖 Storyline</h2><div class="qlist">';
  for(let s of G.storyline){
    if(!s.unlocked) continue;
    const pc=Math.min(100,(G.p.lvl/s.need)*100);
    h+='<div class="qc '+(s.done?'done':'')+'" style="border-color:var(--accent-light);"><div class="qh"><span class="qn">'+(s.done?'✅ ':'')+'Ch.'+s.chapter+': '+s.n+'</span><span class="qr">'+s.rw.xp+' XP | '+s.rw.g+' G</span></div>';
    h+='<div class="qd">'+s.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">Lv.'+G.p.lvl+'/'+s.need+'</span></div></div>';
  }
  h+='</div>';
  // Active quests section
  h+='<h2 class="st" style="margin-top:20px;">📜 Active Quests</h2><div class="qlist">';
  for(let q of G.quests){
    if(q.hidden && !q.revealed) continue;
    const pc=Math.min(100,(q.c/q.need)*100);
    const timerStatus=getTimerStatus(q);
    let cardClass=q.done?'done':(q.expired?'expired':(timerStatus?(timerStatus.cls==='timer-urgent'?'timed-urgent':'timed'):''));
    h+='<div class="qc '+cardClass+'"><div class="qh"><span class="qn">'+(q.done?'✅ ':(q.expired?'❌ ':''))+q.n+'</span><span class="qr">'+q.rw.xp+' XP | '+q.rw.g+' G</span></div>';
    if(q.chain){
      h+='<div style="font-size:10px;color:var(--accent-light);margin-bottom:4px;">🔗 Chain: '+q.chain+'</div>';
    }
    if(q.reqQuest && !q.revealed){
      const req=G.quests.find(rq=>rq.id===q.reqQuest);
      h+='<div style="font-size:10px;color:var(--text-dim);font-style:italic;margin-bottom:4px;">🔒 Requires: '+(req?req.n:'Unknown')+'</div>';
    }
    h+='<div class="qd">'+q.d+'</div>';
    if(timerStatus){
      h+='<div class="timer-bar"><div class="timer-fill '+timerStatus.cls+'" style="width:'+timerStatus.pct+'%"></div></div>';
      h+='<div class="timer-label">⏰ '+timerStatus.label+'</div>';
    }
    h+='<div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+Math.min(q.c,q.need)+'/'+q.need+'</span></div></div>';
  }
  h+='</div>';
    // Daily Quests section
  h += '<h2 class="st" style="margin-top:20px;">📋 Daily Quests</h2><div class="qlist">';
  generateDailyQuests();
  if (G.dailyQuests.length === 0) {
    h += '<div class="qc"><div class="qd">No daily quests available. Check back tomorrow!</div></div>';
  } else {
    for (let q of G.dailyQuests) {
      const pc = Math.min(100, (q.c / q.need) * 100);
      h += '<div class="qc ' + (q.done ? 'done' : '') + '"><div class="qh"><span class="qn">' + q.n + '</span><span class="qr">' + q.rw.xp + ' XP | ' + q.rw.g + ' G</span></div>';
      h += '<div class="qd">' + q.d + '</div><div class="qp"><div class="pbar"><div class="pfill" style="width:' + pc + '%"></div></div><span class="ptxt">' + q.c + '/' + q.need + '</span></div></div>';
    }
  }
  h += '</div>';
    // Bounties section
  const activeBounties = G.bounties.filter(b => !b.done && G.p.lvl >= (b.minLv || 1));
  const doneBounties = G.bounties.filter(b => b.done);
  if (activeBounties.length > 0 || doneBounties.length > 0) {
    h+='<h2 class="st" style="margin-top:20px;">💰 Bounties</h2>';
    if (activeBounties.length > 0) {
      h+='<div class="qlist">';
      for(let b of activeBounties){
        const pc=Math.min(100,(b.c/b.need)*100);
        h+='<div class="qc"><div class="qh"><span class="qn">'+b.n+'</span><span class="qr">'+b.rw.xp+' XP | '+b.rw.g+' G</span></div>';
        h+='<div class="qd">'+b.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+b.c+'/'+b.need+'</span></div></div>';
      }
      h+='</div>';
    }
    if (doneBounties.length > 0) {
      const collapsed = G.questCollapsed['__bounties_done__'];
      h+='<div style="margin-top:12px;">';
      h+='<div onclick="toggleQuestCollapse(\'__bounties_done__\')" style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:12px 16px;background:var(--bg-hover);border-radius:14px;border:1px solid var(--border);user-select:none;">';
      h+='<span style="font-size:12px;transition:transform 0.2s;display:inline-block;' + (collapsed ? '' : 'transform:rotate(90deg);') + '">▶</span>';
      h+='<span style="font-size:14px;font-weight:600;color:var(--success);">✅ Claimed</span>';
      h+='<span style="font-size:12px;color:var(--text-dim);margin-left:auto;">' + doneBounties.length + '</span>';
      h+='</div>';
      if (!collapsed) {
        h+='<div class="qlist" style="margin-top:8px;">';
        for(let b of doneBounties){
          h+='<div class="qc done" style="opacity:0.55;"><div class="qh"><span class="qn" style="text-decoration:line-through;">'+b.n+'</span><span class="qr" style="color:var(--success);">✓</span></div>';
          h+='<div class="qd">'+b.d+'</div></div>';
        }
        h+='</div>';
      }
      h+='</div>';
    }
  }
  h+='</div>';
  h+='<div class="sum"><div class="si2"><span class="sv">'+G.p.kills+'</span><span class="sl">Monsters</span></div><div class="si2"><span class="sv">'+G.p.quests+'</span><span class="sl">Quests</span></div><div class="si2"><span class="sv">'+G.p.fstreak+'</span><span class="sl">Focus</span></div></div></div>';
  return h;
}

function rFocus(){
  // If focus is not active, show the session picker
  if (!G.fs || G.state !== 'focus') {
    let h = '<div class="fv">';
    h += '<div style="font-size:42px;margin-bottom:8px;">🧘</div>';
    h += '<div class="fl" style="font-size:18px;font-weight:700;margin-bottom:4px;">Focus Mode</div>';
    h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:20px;">Pick a session length</div>';
    h += '<div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:0 auto;">';
    const sessions = [
      {m:5, xp:20, g:10, label:'Quick Sprint'},
      {m:10, xp:40, g:20, label:'Short Burst'},
      {m:15, xp:60, g:30, label:'Deep Work'},
      {m:20, xp:80, g:40, label:'Extended Flow'},
      {m:25, xp:100, g:50, label:'Full Pomodoro'}
    ];
    for (let s of sessions) {
      h += '<button class="focus-session-btn" data-min="' + s.m + '" style="padding:14px 18px;border-radius:14px;border:2px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
      h += '<span>' + s.m + ' min — ' + s.label + '</span>';
      h += '<span style="font-size:11px;color:var(--success);">+' + s.xp + 'XP +' + s.g + 'G</span>';
      h += '</button>';
    }
    h += '</div>';
    h += '<div class="ftips" style="margin-top:20px;"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward scales with session length!</li></ul></div>';
    h += '</div>';
    return h;
  }
  // Active focus session
  const el=Date.now()-(G.fs||Date.now()),rm=Math.max(0,G.fd-el);
  const m=Math.floor(rm/60000),s=Math.floor((rm%60000)/1000);
  return '<div class="fv"><div class="fc"><div class="ft" id="ft">'+m+':'+s.toString().padStart(2,'0')+'</div><div class="fl">Focus Mode — ' + (G.focusDuration || 25) + ' min</div></div><div class="ftips"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward: +' + ((G.focusDuration||25)*4) + ' XP when done!</li></ul></div><button class="cfb">Cancel</button></div>';
}

function rTemple() {
  const dead = getDeadParty();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">⛪ Temple of Resurrection</h2>';
  h2 += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ancient magic restores fallen companions. Cost: 50G each.</div>';
  if(dead.length === 0){
    h2 += '<div style="text-align:center;padding:20px;color:var(--success);">✨ All companions are alive!</div>';
  }else{
    h2 += '<div style="margin-bottom:12px;">';
    for(let p of G.party){
      const isDead = p.hp <= 0;
      const canAfford = G.p.gold >= 50;
      h2 += '<div class="temple-revive ' + (isDead ? 'dead' : 'alive') + '">';
      h2 += '<div class="tr-ava" style="background:' + p.col + '20;border-color:' + p.col + '">' + (isDead ? '💀' : re(p.r)) + '</div>';
      h2 += '<div class="tr-info">';
      h2 += '<div class="tr-name">' + p.n + '</div>';
      h2 += '<div class="tr-status ' + (isDead ? '' : 'alive') + '">' + (isDead ? '💀 FALLEN' : '✅ Alive ' + p.hp + '/' + p.mhp) + '</div>';
      h2 += '</div>';
      if(isDead) h2 += '<button class="tr-btn ' + (canAfford ? '' : 'dis') + '" data-m="' + p.n + '">' + (canAfford ? 'Revive (50G)' : 'Need 50G') + '</button>';
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  return h2;
}

function rRest() {
  const dead = getDeadParty();
  if(dead.length > 0 && !G.rest.active) return rTemple();

  if (G.rest.active && G.rest.selectedSite) {
    const site = G.rest.selectedSite;
    const currentTick = G.rest.tick;
    const maxTicks = G.rest.maxTicks;
    const pct = (currentTick / maxTicks) * 100;
    const healerName = getHealerName();
    let h2 = '<div class="rest-view">';
    h2 += '<h2 class="st">🔥 Resting at ' + site.name + '</h2>';
    if (G.ambushWarning) {
      h2 += '<div class="ambush-warning">';
      h2 += '<div class="aw-text">⚠️ ' + G.ambushWarning.text + '</div>';
      h2 += '</div>';
    }
    if (G.currentDialogue && !G.ambushWarning) {
      h2 += '<div class="dialogue-box">';
      h2 += '<div class="d-speaker">' + G.currentDialogue.speaker + '</div>';
      h2 += '<div class="d-text">' + G.currentDialogue.text + '</div>';
      h2 += '</div>';
    }
    h2 += '<div class="tick-track">';
    for (let i = 1; i <= maxTicks; i++) {
      let tickClass = '';
      let tickIcon = '○';
      if (i < currentTick) {
        tickClass = 'done';
        tickIcon = '✓';
      } else if (i === currentTick) {
        tickClass = 'current';
        tickIcon = '🔥';
      }
      h2 += '<div class="tick ' + tickClass + '">' + tickIcon + '</div>';
    }
    h2 += '</div>';
    h2 += '<div class="tick-label">Tick ' + currentTick + '/' + maxTicks + '</div>';
    h2 += '<div class="rest-progress" style="margin-top:16px;">';
    h2 += '<div class="rest-bar"><div class="rest-fill" style="width:' + pct + '%"></div></div>';
    h2 += '<div class="rest-healer ok">💚 ' + healerName + ' is tending to the party</div>';
    h2 += '</div>';
    h2 += '<button class="rest-cancel" id="cancel-rest">Cancel Rest (Partial Recovery)</button>';
    h2 += '</div>';
    return h2;
  }

  const healerOk = hasHealer();
  const healerName = getHealerName();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">💤 Rest</h2>';
  if (healerOk) {
    h2 += '<div class="rest-healer ok" style="background:#22c55e15;border:1px solid var(--success);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--success);">💚 Healer Available: ' + healerName + '</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">5 ticks, 1.5s each. Dialogue every tick. Ambush chance: 15% camp / 5% tavern.</div>';
    h2 += '</div>';
  } else {
    h2 += '<div class="rest-healer fail" style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--danger);">❌ No Healer in Party</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">You need a healer (like Eliz) in your active party to rest safely.</div>';
    h2 += '</div>';
  }
  const soelActive = G.party.some(p => p.n === 'Soel' && p.on);
  h2 += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;text-align:left;">';
  h2 += '<div style="font-size:13px;font-weight:600;color:var(--rest);margin-bottom:4px;">🐱 Soel\'s Spirit Blessing</div>';
  if (!soelActive) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Soel must be in your active party to share his blessing.</div>';
  } else if (G.soelBlessing) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Blessing rests on <b style="color:var(--text);">' + G.soelBlessing.target + '</b> (+' + G.soelBlessing.def + ' DEF). One blessing per rest \u2014 it fades when you next make camp.</div>';
  } else {
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">One member per rest receives +10 DEF until your next rest.</div>';
    h2 += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    for (let m of G.party) {
      if (!m.on || m.n === 'Soel') continue;
      h2 += '<button class="soel-bless-btn" data-n="' + m.n + '" style="padding:6px 12px;border-radius:10px;border:1px solid var(--rest);background:#10b98115;color:var(--text);font-size:11px;font-weight:600;cursor:pointer;">' + m.n + '</button>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div class="rest-sites">';
  const zones = {};
  for (let site of G.rest.sites) {
    if (!zones[site.zone]) zones[site.zone] = [];
    zones[site.zone].push(site);
  }
  for (let zoneName in zones) {
    const sites = zones[zoneName];
    const anyUnlocked = sites.some(s => s.unlocked);
    if (!anyUnlocked) continue;
    h2 += '<div style="margin-bottom:12px;">';
    h2 += '<div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">' + zoneName + '</div>';
    for (let site of sites) {
    let manaSpringRemaining = 8;
    if (G.manaSpringUses.day === G.gameDay) {
        manaSpringRemaining = 8 - G.manaSpringUses.count;
      }
      const isDepletedManaSpring = site.type === 'mana_spring' && manaSpringRemaining <= 0;

      const locked = !site.unlocked || isDepletedManaSpring;

      const canAfford = !site.cost || G.p.gold >= site.cost;
      const canRest = (site.type === 'mana_spring' || site.type === 'temple' || healerOk) && !locked && canAfford;
      h2 += '<div class="rs-card ' + (locked ? 'locked' : '') + '" data-id="' + site.id + '">';
      h2 += '<div class="rs-head">';
      h2 += '<span class="rs-name">' + site.icon + ' ' + site.name + '</span>';
      h2 += '<span class="rs-type ' + site.type + '">' + site.type.toUpperCase() + '</span>';
      h2 += '</div>';
      h2 += '<div class="rs-desc">' + site.desc + '</div>';
            if (locked) {
            if (isDepletedManaSpring) {
          h2 += '<div class="rs-req fail">💧 Daily limit reached (8/8 uses)</div>';

        } else {
          h2 += '<div class="rs-req fail">🔒 Requires Level ' + site.zoneLv + ' to discover</div>';
        }
      } else if (site.cost) {

                const msUsesLeft = site.type === 'mana_spring' ? ' (' + manaSpringRemaining + '/8 today)' : '';
        h2 += '<div class="rs-req ' + (canAfford ? 'ok' : 'fail') + '">' + (canAfford ? '✅' : '❌') + ' Cost: ' + site.cost + 'G' + msUsesLeft + ' · Ambush: 5% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';


      } else {
        h2 += '<div class="rs-req ' + (healerOk ? 'ok' : 'fail') + '">' + (healerOk ? '✅' : '❌') + ' Free · Ambush: 15% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';
      }
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:8px;">Rest takes ~7.5 seconds. Party banter every tick. Taverns cost gold but are safer.</div>';
  h2 += '</div>';
  return h2;
}

function rRuneCombineModal() {
  const selected = G.runeCombineModal.selected;
  const preview = getCombinePreview();

  let h = '<div style="padding:16px;">';
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">';
  h += '<button class="rune-modal-back" style="background:none;border:none;color:var(--accent);font-size:20px;cursor:pointer;padding:4px;">←</button>';
  h += '<h2 class="st" style="margin:0;">🔮 Combine Runes</h2>';
  h += '</div>';

  h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Select 3 runes of the same type to combine into a stronger version.</div>';

  // Selected runes display
  h += '<div style="display:flex;gap:8px;margin-bottom:16px;">';
  for(let i=0;i<3;i++){
    if(selected[i] !== undefined && G.runes[selected[i]]){
      const r = G.runes[selected[i]];
      h += '<div style="flex:1;background:'+r.color+'15;border:2px solid '+r.color+';border-radius:12px;padding:12px;text-align:center;">';
      h += '<div style="font-size:28px;">'+r.icon+'</div>';
      h += '<div style="font-size:10px;font-weight:600;color:'+r.color+';">'+r.name+'</div>';
      h += '</div>';
    }else{
      h += '<div style="flex:1;background:var(--bg-hover);border:2px dashed var(--disabled);border-radius:12px;padding:12px;text-align:center;opacity:0.5;">';
      h += '<div style="font-size:28px;color:var(--disabled);">?</div>';
      h += '<div style="font-size:10px;color:var(--disabled);">Slot '+(i+1)+'</div>';
      h += '</div>';
    }
  }
  h += '</div>';

  // Preview result
  if(preview && !preview.error){
    h += '<div style="background:linear-gradient(135deg,#7c3aed15,#a78bfa15);border:2px solid var(--accent);border-radius:14px;padding:16px;margin-bottom:16px;text-align:center;">';
    h += '<div style="font-size:11px;color:var(--accent-light);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Result Preview</div>';
    h += '<div style="font-size:36px;margin-bottom:4px;">'+preview.icon+'</div>';
    h += '<div style="font-size:16px;font-weight:700;color:var(--accent-light);">'+preview.name+'</div>';
    h += '<div style="font-size:11px;color:var(--success);margin-top:4px;">';
    const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[preview.stat] || preview.stat;
    h += statLabel + ' +' + preview.val;
    if(preview.pct) h += ' (+'+Math.floor(preview.pct*100)+'%)';
    h += '</div>';
    h += '<div style="font-size:10px;color:var(--gold);margin-top:4px;">'+preview.r.toUpperCase()+'</div>';
    h += '</div>';

    h += '<button id="btn-confirm-combine" style="width:100%;padding:14px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--accent),#6d28d9);color:white;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 2px 12px var(--shadow-accent);">✨ Combine!</button>';
  }else if(preview && preview.error){
    h += '<div style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:center;color:var(--danger);font-size:13px;">'+preview.error+'</div>';
  }else{
    h += '<div style="background:var(--bg-hover);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:16px;text-align:center;color:var(--text-dim);font-size:13px;">Select 3 matching runes to see the result</div>';
  }

  // Rune grid for selection
  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin:16px 0 10px;">Your Runes</div>';
  if(G.runes.length===0){
    h += '<div style="text-align:center;padding:20px;color:var(--text-dim);">No runes to combine.</div>';
  }else{
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">';
    for(let i=0;i<G.runes.length;i++){
      const r=G.runes[i];
      const isSelected = selected.includes(i);
      const statLabel = {atk:'ATK',int:'INT',fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',hpRegen:'💚HP+',mpRegen:'💧MP+'}[r.stat] || r.stat;

      h += '<button class="rune-combine-select" data-ri="'+i+'" style="background:'+(isSelected?r.color+'30':'var(--bg-card)')+';border:2px solid '+(isSelected?r.color:'var(--border)')+';border-radius:12px;padding:10px 6px;text-align:center;cursor:pointer;transition:all 0.2s;position:relative;">';
      if(isSelected){
        h += '<div style="position:absolute;top:-6px;right:-6px;background:var(--accent);color:white;width:18px;height:18px;border-radius:50%;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;">✓</div>';
      }
      h += '<div style="font-size:22px;margin-bottom:4px;">'+r.icon+'</div>';
      h += '<div style="font-size:10px;font-weight:600;color:'+(isSelected?r.color:'var(--text)')+';">'+r.name.replace('Rune of ','')+'</div>';
      h += '<div style="font-size:9px;color:var(--text-dim);margin-top:2px;">'+statLabel+'+'+r.val+'</div>';
      h += '</button>';
    }
    h += '</div>';
  }

  h += '</div>';
  return h;
}

function rTalents(){
  let h='<div style="padding:16px;"><h2 class="st">🌟 Planar Talents</h2>';
  h+='<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;text-align:center;">Unlock every 2 levels starting at 16</div>';
  h+='<div style="display:flex;flex-direction:column;gap:10px;">';
  for(let t of TALENTS){
    const unlocked=G.talents.includes(t.id);
    const canUnlock=G.p.lvl>=t.lv;
    h+='<div style="background:var(--bg-card);border:2px solid '+(unlocked?'#22c55e':canUnlock?'#a78bfa':'#6b7280')+';border-radius:14px;padding:14px;opacity:'+(canUnlock?'1':'0.5')+';">';
    h+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">';
    h+='<span style="font-size:24px;">'+t.icon+'</span>';
    h+='<div style="flex:1;"><div style="font-weight:700;font-size:15px;color:'+(unlocked?'#22c55e':canUnlock?'var(--text)':'var(--text-dim)')+';">'+(unlocked?'✅ ':'')+t.name+'</div>';
    h+='<div style="font-size:11px;color:var(--text-dim);">Lv.'+t.lv+'</div></div>';
    h+='</div>';
    h+='<div style="font-size:12px;color:var(--text-dim);line-height:1.4;">'+t.desc+'</div>';
    if(unlocked) h+='<div style="font-size:11px;color:#22c55e;margin-top:6px;font-weight:600;">✨ ACTIVE</div>';
    else if(!canUnlock) h+='<div style="font-size:11px;color:var(--danger);margin-top:6px;">🔒 Requires Level '+t.lv+'</div>';
    h+='</div>';
  }
  h+='</div>';
  h+='<div style="margin-top:16px;font-size:11px;color:var(--text-dim);text-align:center;">'+G.talents.length+'/'+TALENTS.length+' talents unlocked</div>';
  h+='</div>';
  return h;
}

// === REPLACE your rGrindRoom function with this ===

function rGrindRoom() {
  const g = G.endlessGrind;
  let h = '<div class="content">';
  
  h += '<div class="st" style="text-align:center;">⚔️ Endless Grind Room</div>';
  
  // Stats bar
  h += '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:12px;flex-wrap:wrap;">';
  h += '<span class="mst">Wave: <b>' + g.wave + '</b></span>';
  h += '<span class="mst">Kills: <b>' + g.totalKills + '</b></span>';
  h += '<span class="mst">XP: <b>' + g.totalXp + '</b></span>';
  h += '<span class="mst" style="color:var(--gold)">Gold: <b>' + g.totalGold + '</b></span>';
  h += '</div>';
  
  // Difficulty badge
  const diffColors = { normal: '#22c55e', hard: '#f59e0b', nightmare: '#ef4444' };
  h += '<div style="text-align:center;margin-bottom:16px;">';
  h += '<span style="font-size:11px;padding:4px 12px;border-radius:10px;background:' + diffColors[g.difficulty] + '20;color:' + diffColors[g.difficulty] + ';font-weight:600;text-transform:uppercase;">';
  h += g.difficulty + ' (×' + g.difficultyMult[g.difficulty] + ')</span>';
  h += '</div>';
  
  // MAIN CONTROLS
  if (!g.active) {
    // Between waves or fresh start
    h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:12px;">';
    
    if (g.wave === 0) {
      // FRESH START - show all settings
      h += '<div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--accent-light);">Grind Settings</div>';
      
      // Tier selector
      h += '<div style="margin-bottom:12px;">';
      h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Max Zone Tier</div>';
      h += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
      const maxTier = Math.min(G.p.lvl, 23);
      for (let t = 1; t <= maxTier; t++) {
        const z = G.zones.find(zn => zn.lv === t);
        const name = z ? z.n.split(' ')[0] : 'Lv' + t;
        const isSel = g.maxZoneLevel === t;
        h += '<button onclick="setGrindTier(' + t + ')" style="padding:6px 10px;border-radius:8px;border:1px solid ' + (isSel ? 'var(--accent)' : 'var(--border)') + ';background:' + (isSel ? 'var(--accent)' : 'var(--bg-card)') + ';color:' + (isSel ? 'white' : 'var(--text)') + ';font-size:11px;cursor:pointer;">' + name + '</button>';
      }
      h += '</div></div>';
      
      // Difficulty toggle
      h += '<div style="margin-bottom:12px;">';
      h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Difficulty</div>';
      h += '<div style="display:flex;gap:6px;">';
      const diffs = ['normal', 'hard', 'nightmare'];
      for (let d of diffs) {
        const isSel = g.difficulty === d;
        h += '<button onclick="toggleGrindDifficulty()" style="flex:1;padding:8px;border-radius:8px;border:1px solid ' + (isSel ? diffColors[d] : 'var(--border)') + ';background:' + (isSel ? diffColors[d] + '20' : 'var(--bg-card)') + ';color:' + (isSel ? diffColors[d] : 'var(--text-dim)') + ';font-size:12px;font-weight:600;cursor:pointer;">' + d + '</button>';
      }
      h += '</div></div>';
      
      // Auto-next toggle
      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">';
      h += '<input type="checkbox" id="grind-autonext" ' + (g.autoNext ? 'checked' : '') + ' onchange="toggleAutoNext()" style="width:18px;height:18px;accent-color:var(--accent);">';
      h += '<label for="grind-autonext" style="font-size:13px;cursor:pointer;">Auto-start next wave</label>';
      h += '</div>';
      
      h += '<button onclick="enterGrindRoom()" class="abtn" style="width:100%;">Start Grinding</button>';
      
        } else {
      // BETWEEN WAVES - show Next Wave, Stop, and Leave options
      h += '<div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--accent-light);">Wave ' + g.wave + ' Complete!</div>';
      h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ready for the next wave?</div>';
      
      h += '<button onclick="startGrindWave()" class="abtn" style="width:100%;margin-bottom:8px;">▶️ Next Wave</button>';
      h += '<button onclick="exitGrindRoom()" style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:14px;font-weight:600;cursor:pointer;margin-bottom:8px;">⏹ Stop & Collect Loot</button>';
      
      // NEW: Leave and reset button
      h += '<button onclick="leaveAndResetGrind()" style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--text-dim);background:transparent;color:var(--text-dim);font-size:13px;font-weight:600;cursor:pointer;">🚪 Leave Room & Reset (Start Fresh)</button>';
    }
 
    h += '</div>';
    
  } else {
    // ACTIVE COMBAT - show STOP button
    h += '<div style="background:var(--bg-card);border:2px solid var(--danger);border-radius:14px;padding:16px;margin-bottom:12px;text-align:center;">';
    h += '<div style="font-size:13px;color:var(--text-dim);margin-bottom:10px;">Wave ' + g.wave + ' in progress...</div>';
    h += '<button onclick="exitGrindRoom()" style="width:100%;padding:14px;border-radius:12px;border:2px solid var(--danger);background:var(--danger);color:white;font-size:15px;font-weight:700;cursor:pointer;">⏹ STOP GRIND</button>';
    h += '<div style="font-size:11px;color:var(--text-dim);margin-top:8px;">Returns to camp with current loot</div>';
    h += '</div>';
  }
  
  // Session summary (always visible)
  if (g.wave > 0) {
    h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">📊 This Session</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;">';
    h += '<div>Started: <span style="color:var(--text-dim);">' + new Date(g.sessionStart).toLocaleTimeString() + '</span></div>';
    h += '<div>Waves: <span style="color:var(--accent-light);">' + g.wave + '</span></div>';
    h += '<div>Total Kills: <span style="color:var(--accent-light);">' + g.totalKills + '</span></div>';
    h += '<div>Total XP: <span style="color:var(--xp);">' + g.totalXp + '</span></div>';
    h += '<div>Total Gold: <span style="color:var(--gold);">' + g.totalGold + '</span></div>';
    h += '<div>Avg/ Wave: <span style="color:var(--text-dim);">' + (g.wave > 0 ? Math.floor(g.totalXp / g.wave) : 0) + ' XP</span></div>';
    h += '</div></div>';
  }
  
  h += '</div>';
  return h;
}

function setGrindTier(tier) {
  G.endlessGrind.maxZoneLevel = tier;
  lg('📍 Max tier set to ' + tier);
  render();
}


function rMenu(){
  const items=[
    {i:'⚔️',l:'Adventure',d:'Explore zones and fight',a:'explore'},
    {i:'👥',l:'Party',d:'Manage companions',a:'party'},
    {i:'✨',l:'Skills',d:'View mage abilities',a:'skills'},
    {i:'⚒️',l:'Crafting',d:'Brew potions, forge gear',a:'craft'},
    {i:'📜',l:'Quests',d:'View active quests',a:'quest'},
    {i:'🎒',l:'Inventory',d:'Manage items',a:'inventory'},
    {i:'📖',l:'Bestiary',d:'Catalogue of defeated foes',a:'bestiary'},
    {i:'🏆',l:'Achievements',d:'Track your milestones',a:'achievements'},
    {i:'🌳',l:'Skill Trees',d:'Choose your specialization',a:'skilltree'},
    {i:'🌟',l:'Talents',d:'View planar talents (Lv.16+)',a:'talents'},
    {i:'💎',l:'Runes',d:'Socket runes into gear (Lv.20+)',a:'runes'},
    {i:'📖',l:'Journal',d:'Chronicles of your journey',a:'journal'},
    {i:'🌀',l:'Grind Room',d:'Endless wave battles',a:'grind_room'},
    {i:'🧳',l:'Traders',d:'Buy from wandering merchants',a:'npc'},
    {i:'🧘',l:'Focus Mode',d:'5–25 min ADHD timer',a:'focus'},
    {i:'💤',l:'Rest',d:'Find a safe place to rest',a:'rest'},
  ];
  let h='<div class="grid2">';
  for(let m of items)h+='<div class="card" data-a="'+m.a+'"><div class="cicon">'+m.i+'</div><div class="clabel">'+m.l+'</div><div class="cdesc">'+m.d+'</div></div>';
  h+='</div>';
  // Theme toggle row
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  h+='<div style="margin-top:12px;text-align:center;">';
  h+='<button onclick="toggleTheme()" style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:10px 20px;color:var(--text);font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;">';
  h+= isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
  h+='</button></div>';
  h+='<div style="margin-top:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;">';
  h+='<h3 style="font-size:14px;margin-bottom:10px;color:var(--accent-light);">Save Data</h3>';
  h+='<div style="display:flex;gap:8px;flex-wrap:wrap;">';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;" id="btn-save">Save Now</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:#374151;" id="btn-export">Export</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:#374151;" id="btn-import">Import</button>';
  h+='<button class="cb" style="width:auto;padding:8px 16px;font-size:12px;background:var(--danger);" id="btn-reset">Reset</button>';
  h+='</div>';
  h+='<div style="margin-top:8px;font-size:11px;color:var(--text-dim);">Auto-saves every 30 seconds</div>';
  h+='</div>';
  return h;
}

function rExp(){
  let h='<div class="explore-view"><h2 class="st">Adventure Zones</h2><div class="zlist">';
  for(let i=0;i<G.zones.length;i++){
    const z=G.zones[i],lk=G.p.lvl<z.lv;
    const dc=z.dg=='low'?'#22c55e':z.dg=='medium'?'#eab308':z.dg=='high'?'#f97316':z.dg=='very high'?'#ef4444':'#a855f7';
    const hazard = G.zoneHazards[z.n];
    h+='<div class="zcard '+(lk?'locked':'')+'" data-i="'+i+'"><div class="zh"><span class="zn">'+z.n+'</span><span class="zl">Lv.'+z.lv+(lk?' 🔒':'')+'</span></div><div class="zd">'+z.d+'</div>';
    if(hazard){
      h+='<div style="font-size:10px;color:#f59e0b;margin-bottom:6px;">⚠️ Hazard: '+hazard.desc+'</div>';
    }
    h+='<div class="zm"><span class="db" style="background:'+dc+'20;color:'+dc+'">'+z.dg+'</span><span class="xb">'+z.xp+' XP</span></div></div>';
  }
  h+='</div></div>'; return h;
}

function rCbt() {
  let h = '<div class="combat-view"><h2 class="st">' + (G.currentBoss ? '⚔️ BOSS FIGHT' : 'Combat') + '</h2>';
  
  const synDesc = getSynergyDesc();
  if (synDesc) {
    h += '<div style="background:#7c3aed15;border:1px solid var(--accent);border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:var(--accent-light);">';
    h += '✨ ' + synDesc + '</div>';
  }

  // Planar Resonance Indicator (Phase 2)
  const zone = G.zones.find(z => z.en.includes(G.cbt.en[0]?.n));
  if (zone && zone.elem) {
    const resStatus = getResonanceStatus(zone.n);
    h += '<div style="background:' + resStatus.color + '15;border:1px solid ' + resStatus.color + ';border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:' + resStatus.color + ';">';
    h += resStatus.icon + ' ' + resStatus.text + '</div>';
  }

  // Dimensional Instability Indicator (Phase 2)
  const riftStatus = getRiftStatus();
  if (riftStatus) {
    h += '<div style="background:' + riftStatus.color + '15;border:1px solid ' + riftStatus.color + ';border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:11px;color:' + riftStatus.color + ';">';
    h += riftStatus.icon + ' ' + riftStatus.name + ': ' + riftStatus.desc + ' (' + riftStatus.fightsLeft + ' fights left)</div>';
  }
  
  h += '<button id="btn-auto" style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid ' + (G.cbt.autoCombat ? '#22c55e' : 'var(--disabled)') + ';background:' + (G.cbt.autoCombat ? '#22c55e15' : 'transparent') + ';color:' + (G.cbt.autoCombat ? '#22c55e' : 'var(--text-dim)') + ';font-size:12px;font-weight:600;cursor:pointer;margin-bottom:12px;user-select:none;">';
  h += (G.cbt.autoCombat ? '🤖 AUTO ON — Tap to take control' : '🤖 Auto-Combat — Let AI fight') + '</button>';

  // Potion button
  const potions = getCombatPotions();
  const usablePotions = potions.filter(p => {
    if (p.t === 'revive') return getDeadParty().length > 0;
    return true;
  });
  h += '<button onclick="togglePotionMenu()" style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid ' + (usablePotions.length > 0 ? '#22c55e' : 'var(--disabled)') + ';background:' + (usablePotions.length > 0 ? '#22c55e15' : 'transparent') + ';color:' + (usablePotions.length > 0 ? '#22c55e' : 'var(--disabled)') + ';font-size:12px;font-weight:600;cursor:' + (usablePotions.length > 0 ? 'pointer' : 'not-allowed') + ';margin-bottom:12px;user-select:none;">';
  h += (G.potionMenu ? '❌ Close Potion Bag' : '🧪 Use Potion (' + usablePotions.length + ' usable)') + '</button>';

  // Potion menu
  if (G.potionMenu && potions.length > 0) {
    h += '<div style="background:var(--bg-card);border:1px solid #22c55e;border-radius:12px;padding:10px;margin-bottom:12px;">';
    h += '<div style="font-size:11px;color:#22c55e;margin-bottom:8px;">🧪 Quick Potion Bag</div>';
    h += '<div style="display:flex;flex-direction:column;gap:6px;">';
    for (let i = 0; i < G.p.inv.length; i++) {
      const it = G.p.inv[i];
      // Regular potions (heal/mana)
      if ((it.t === 'pot' || it.t === 'food' || it.t === 'drink') && (it.eff === 'heal' || it.eff === 'mana')) {
        const isHeal = it.eff === 'heal';
        const icon = isHeal ? '❤️' : '💧';
        const color = isHeal ? '#ef4444' : '#3b82f6';
        const current = isHeal ? G.p.hp + '/' + G.p.mhp : G.p.mp + '/' + G.p.mmp;
        const full = isHeal ? G.p.hp >= G.p.mhp : G.p.mp >= G.p.mmp;
        h += '<button onclick="usePotionInCombat(' + i + ')" style="padding:10px 14px;border-radius:10px;border:1px solid ' + color + ';background:' + color + '15;color:' + (full ? 'var(--disabled)' : color) + ';font-size:12px;font-weight:600;cursor:' + (full ? 'not-allowed' : 'pointer') + ';display:flex;justify-content:space-between;align-items:center;opacity:' + (full ? '0.5' : '1') + ';">';
        h += '<span>' + icon + ' ' + it.n + (it.q > 1 ? ' x' + it.q : '') + '</span>';
        h += '<span>' + (full ? 'FULL' : '+' + it.v + ' ' + (isHeal ? 'HP' : 'MP')) + ' · ' + current + '</span>';
        h += '</button>';
      }
      // Revive items (Phoenix Feather, etc.)
      else if (it.t === 'revive') {
        const deadMembers = getDeadParty();
        const hasDead = deadMembers.length > 0;
        const color = hasDead ? '#f59e0b' : 'var(--disabled)';
        const icon = '🔥';
        h += '<button onclick="usePotionInCombat(' + i + ')" style="padding:10px 14px;border-radius:10px;border:1px solid ' + color + ';background:' + color + '15;color:' + color + ';font-size:12px;font-weight:600;cursor:' + (hasDead ? 'pointer' : 'not-allowed') + ';display:flex;justify-content:space-between;align-items:center;opacity:' + (hasDead ? '1' : '0.5') + ';">';
        h += '<span>' + icon + ' ' + it.n + (it.q > 1 ? ' x' + it.q : '') + '</span>';
        h += '<span>' + (hasDead ? 'Revive 50% HP' : 'No one to revive') + ' · ' + deadMembers.length + ' down</span>';
        h += '</button>';
      }
    }
    h += '</div></div>';
  }
  
  // Reuse zone variable from resonance check above
  if (zone && G.zoneHazards[zone.n]) {
    const haz = G.zoneHazards[zone.n];
    h += '<div style="background:#f59e0b15;border:1px solid #f59e0b;border-radius:12px;padding:8px;margin-bottom:12px;font-size:11px;color:#f59e0b;">';
    h += '⚠️ Zone Hazard: ' + haz.name + ' — ' + haz.desc + '</div>';
  }
  
  if (G.currentBoss) {
    h += '<div style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:10px;margin-bottom:12px;font-size:12px;color:var(--danger);">';
    h += '🔥 ' + G.currentBoss.desc + '</div>';
  }
  
  const playerAC = getPlayerAC();
  const eqStats = getEquippedStats();
  h += '<div style="display:flex;justify-content:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;">';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">AC </span><span style="font-weight:700;color:var(--accent-light);">' + playerAC + '</span>';
  if(eqStats.def > 0) h += '<span style="font-size:9px;color:var(--success);"> +' + eqStats.def + 'eq</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">PROF </span><span style="font-weight:700;color:var(--gold);">+' + DICE.proficiencyBonus(G.p.lvl) + '</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">ATK </span><span style="font-weight:700;color:var(--hp);">+' + (eqStats.atk + (G.p.eq.weapon?.atk||0)) + '</span>';
  h += '</div>';
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:6px 12px;font-size:11px;">';
  h += '<span style="color:var(--text-dim);">CRIT </span><span style="font-weight:700;color:var(--danger);">' + Math.floor(getTotalCritChance() * 100) + '%</span>';
  if(eqStats.critChance > 0) h += '<span style="font-size:9px;color:var(--success);"> +' + Math.floor(eqStats.critChance*100) + '%eq</span>';
  h += '</div>';
  h += '</div>';
  
  h += '<div class="erow">';
  for (let i = 0; i < G.cbt.en.length; i++) {
    const e = G.cbt.en[i], d = e.hp <= 0, s = G.cbt.tg == i && !d ? 'sel' : '';
    const immuneFire = ['Fire Imp', 'Lava Slug', 'Ash Wraith'].includes(e.n);
    const immuneIce = ['Ice Elemental', 'Frost Wolf', 'Frozen Knight'].includes(e.n);
    const isBoss = e.mechanic ? true : false;
    const enemyAC = getEnemyAC(e);
    
    h += '<div class="ecard ' + (d ? 'dead' : '') + ' ' + s + '" data-i="' + i + '" style="' + (isBoss ? 'border-color:var(--danger);box-shadow:0 0 10px #ef444440;' : '') + '">';
    h += '<div class="eicon">' + (d ? '💀' : ee(e.n)) + '</div>';
    h += '<div class="ename">' + e.n + (isBoss ? ' 👑' : '') + '</div>';
    
    if (!d) {
      h += '<div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">AC ' + enemyAC + '</div>';
    }
    
    if (!d && e.elem && e.elem !== 'none') {
      const elemIcon = e.elem === 'fire' ? '🔥' : e.elem === 'ice' ? '❄️' : e.elem === 'lightning' ? '⚡' : e.elem === 'void' ? '🌑' : '✦';
      h += '<div style="font-size:10px;color:#f59e0b;margin-top:2px;">' + elemIcon + ' ' + e.elem + '</div>';
    }
    
    if (!d && e.status && e.status.length > 0) {
      const statusIcons = e.status.map(s => s.type === 'burn' ? '🔥' : s.type === 'poison' ? '☠️' : s.type === 'shock' ? '⚡' : '✦').join('');
      h += '<div style="font-size:10px;color:var(--danger);margin-top:2px;">' + statusIcons + ' (' + e.status[0].turns + 't)</div>';
    }
    
    if (!d && (immuneFire || immuneIce)) {
      h += '<div class="e-immune">' + (immuneFire ? '🔥 Fire Immune' : (immuneIce ? '❄️ Ice Immune' : '')) + '</div>';
    }
    
    if (!d && e.mechanic === 'resurrect') {
      h += '<div style="font-size:10px;color:var(--danger);">💀 Lives: ' + (e.resurrectCount + 1) + '</div>';
    }
    
    if (!d && e.mechanic === 'phase') {
      h += '<div style="font-size:10px;color:var(--accent-light);">💎 Phase ' + e.currentPhase + '/' + e.phases + '</div>';
    }
    
    h += (d ? '<div class="dt">DEFEATED</div>' : '<div class="hps"><div class="bf bf-hp" style="width:' + ((e.hp / e.mhp) * 100) + '%"></div></div><div class="hpt">' + e.hp + '/' + e.mhp + '</div>') + '</div>';
  }
  h += '</div>';
  
  h += '<div class="pstat"><div class="mst"><span class="md" style="background:#7c3aed"></span>San ' + G.p.hp + '/' + G.p.mhp + ' AC' + playerAC + '</div>';
  for (let p of G.party) {
    if (p.on) {
      h += '<div class="mst"><span class="md" style="background:' + p.col + '"></span>' + p.n + ' ' + p.hp + '/' + p.mhp + '</div>';
    }
  }
  h += '</div>';
  
  h += '<div class="skills"><h3>Select Skill</h3><div class="slist">';
  
  const basicSel = G.cbt.sk === -1 && !G.cbt.autoCombat ? 'sel' : '';
  h += '<div class="sbtn ' + basicSel + '" data-i="-1" ' + (G.cbt.autoCombat ? 'style="opacity:0.4;cursor:not-allowed;"' : '') + '>';
  h += '<div class="sn">🪄 Staff Swing</div>';
  h += '<div class="sc">0 MP · Physical · 1d4 + STR</div>';
  h += '<div class="sd">Swing your staff when your spell slots are spent.</div>';
  h += '</div>';
  
    const ls = G.p.skills.filter(s => s.on);
  for (let i = 0; i < ls.length; i++) {
    const s = ls[i];
    const costLabel = typeof getSpellCostLabel === 'function'
      ? getSpellCostLabel(s)
      : (s.c + ' MP');
    const u = G.p.mp >= s.c && !G.cbt.autoCombat;
    const sel = G.cbt.sk == i && !G.cbt.autoCombat ? 'sel' : '';
    const critPct = Math.floor(getTotalCritChance() * 100);
    const highTier = Number(s.slotTier || 1) >= 4;
    const nameStyle = highTier ? ' style="color:#ef4444;font-weight:700;"' : '';
    
    h += '<div class="sbtn ' + (u ? '' : 'dis') + ' ' + sel + '" data-i="' + i + '" ' +
         (G.cbt.autoCombat ? 'style="opacity:0.4;cursor:not-allowed;"' : '') + '>';
    h += '<div class="sn"' + nameStyle + '>' + (s.buff ? '🛡️' : '⚡') + ' ' + s.n + '</div>';
    h += '<div class="sc">' + costLabel + ' · ' + (s.dmg || 'Buff') + ' · ' +
         critPct + '% Crit' + (G.cbt.autoCombat ? ' · 🤖 AUTO' : '') + '</div>';
    h += '<div class="sd">' + s.d + '</div>';
    if (s.elem) {
      const weakAgainst = s.elem === 'fire' ? 'Ice' : s.elem === 'ice' ? 'Fire' : s.elem === 'lightning' ? 'Void' : '';
      if (weakAgainst) {
        h += '<div style="font-size:10px;color:var(--success);">Strong vs: ' + weakAgainst + '</div>';
      }
    }
    h += '</div>';
  }
  h += '</div>';
  
  const isBasic = G.cbt.sk === -1;
  const sk = isBasic ? null : ls[G.cbt.sk];
  const ca = isBasic 
    ? (G.cbt.tg >= 0 && !G.cbt.autoCombat) 
    : (sk && G.p.mp >= sk.c && !G.cbt.autoCombat);
  const si = isBasic ? -1 : G.p.skills.indexOf(sk);
  
  h += '<button class="abtn ' + (ca ? '' : 'dis') + '" data-si="' + si + '" data-ti="' + G.cbt.tg + '" ' + (G.cbt.autoCombat ? 'disabled style="opacity:0.4;"' : '') + '>';
  h += (isBasic ? '🪄 Staff Swing' : 'Cast ' + (sk ? sk.n : '...')) + '</button>';
  h += '<button class="fbtn" ' + (G.cbt.autoCombat ? 'disabled style="opacity:0.4;"' : '') + '>Flee</button>';
 
   // === GRIND ROOM WAVE CONTROLS ===
  if (G.endlessGrind.active) {
    h += '<div style="background:var(--bg-card);border:2px solid var(--accent);border-radius:14px;padding:14px;margin-top:16px;text-align:center;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:10px;">⚔️ Grind Room · Wave ' + G.endlessGrind.wave + '</div>';
    
    if (G.endlessGrind.autoNext) {
      h += '<div style="font-size:12px;color:var(--success);">🤖 Auto-next: ON</div>';
    } else {
      h += '<button onclick="startGrindWave()" class="abtn" style="width:100%;margin-bottom:8px;">▶️ Next Wave</button>';
    }
    
    h += '<button onclick="exitGrindRoom()" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:13px;font-weight:600;cursor:pointer;">⏹ Stop & Exit</button>';
    h += '</div>';
  }
  // === END GRIND ROOM WAVE CONTROLS ===

  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:12px;margin-top:12px;">';
  h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">🎲 D&D Combat Rules</div>';
  h += '<div style="font-size:10px;color:var(--text-dim);line-height:1.6;">';
  h += '• Attack: d20 + PROF(+' + DICE.proficiencyBonus(G.p.lvl) + ') + Ability Mod vs Target AC<br>';
  h += '• Natural 20 = Critical Hit (double dice)<br>';
  h += '• Natural 1 = Critical Miss (auto-fail)<br>';
  h += '• Advantage: Roll 2d20, keep higher<br>';
  h += '• Your AC: ' + playerAC + ' | INT Mod: ' + (DICE.abilityMod(G.p.stats.int) >= 0 ? '+' : '') + DICE.abilityMod(G.p.stats.int);
  h += '</div></div>';
  
  h += '</div></div>';
  return h;
}


function rParty(){
  let h='<div class="party-view"><h2 class="st">Party</h2>';
  const activeSyns = getActiveSynergies();
  if(activeSyns.length > 0){
    h += '<div style="background:var(--bg-card);border:1px solid var(--accent);border-radius:14px;padding:12px;margin-bottom:16px;">';
    h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">✨ Active Synergies</div>';
    h += '<div style="display:flex;flex-direction:column;gap:8px;">';
    for(let syn of activeSyns){
      h += '<div style="display:flex;align-items:center;gap:8px;font-size:12px;">';
      h += '<span style="font-size:16px;">' + syn.icon + '</span>';
      h += '<div style="flex:1;"><div style="font-weight:600;">' + syn.name + '</div>';
      h += '<div style="font-size:10px;color:var(--text-dim);">' + syn.desc + '</div></div>';
      h += '</div>';
    }
    h += '</div></div>';
  }
  h += '<div class="plist">';
  for(let p of G.party){
    h+='<div class="pcard '+(p.on?'':'locked')+'"><div class="pava" style="background:'+p.col+'20;border-color:'+p.col+'"><span style="font-size:28px">'+(p.on?re(p.r):'🔒')+'</span></div><div class="pinfo"><div class="pn">'+p.n+' <span class="pt">'+p.t+'</span></div><div class="pr" style="color:'+p.col+'">'+p.r+'</div><div class="pd">'+p.d+'</div><div class="pb">'+p.b+'</div>'+(p.on?'<div class="ps">HP:'+p.hp+'/'+p.mhp+' ATK:'+p.atk+(p.gear&&p.gear.atk?'(+'+p.gear.atk+')':'')+' DEF:'+p.def+(p.gear&&p.gear.def?'(+'+p.gear.def+')':'')+' SPD:'+p.spd+(p.gear&&p.gear.spd?'(+'+p.gear.spd+')':'')+(getBlessDef(p)?' <span style="color:var(--rest);font-weight:700;">🐱+10 DEF</span>':'')+'</div>':'')+(G.affinity[p.n]?'<div class="affinity-bar"><div class="affinity-fill '+getAffinityColor(G.affinity[p.n].val)+'" style="width:'+(G.affinity[p.n].val/G.affinity[p.n].max*100)+'%"></div></div><div class="affinity-label">'+(G.affinity[p.n].val>=70?'💕 Close':G.affinity[p.n].val>=40?'💛 Friendly':G.affinity[p.n].val>=20?'💔 Distant':'💀 Strained')+' ('+G.affinity[p.n].val+'/'+G.affinity[p.n].max+')</div>':'')
+(G.affinityUnlocks[p.n]?'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">'+G.affinityUnlocks[p.n].map(function(u){var un=p.affinityBonuses&&p.affinityBonuses.includes(u.id);return '<span title="'+u.d+'" style="font-size:9px;padding:2px 6px;border-radius:8px;border:1px solid '+(un?'var(--xp);color:var(--xp);':'var(--border);color:var(--text-dim);opacity:0.6;')+'">'+(un?'🌟 ':'🔒 ')+u.n+' ('+u.th+')</span>';}).join('')+'</div>':'')+'</div></div>';
    // === STAGE 1: ENHANCED TRINKET/GEAR SYSTEM ===
    if(p.on || p.ul <= G.p.lvl){
      h += '<div style="background:var(--bg-hover);border:1px solid var(--border);border-radius:10px;padding:10px;margin-top:8px;">';
      h += '<div style="font-size:11px;font-weight:600;color:var(--accent-light);margin-bottom:6px;">🎁 Trinket Slot</div>';
      if(p.gear){
        // Equipped trinket display with rarity color
        const rarityColor = p.gear.r ? (p.gear.r==='epic'?'#a855f7':p.gear.r==='rare'?'#3b82f6':p.gear.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
        h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
        h += '<span style="font-size:12px;font-weight:600;color:'+rarityColor+';">' + p.gear.n + '</span>';
        h += '<button class="unequip-pgear" data-member="' + p.n + '" style="padding:4px 10px;border-radius:8px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-size:11px;font-weight:600;cursor:pointer;">Unequip</button>';
        h += '</div>';
        h += '<div style="font-size:10px;color:var(--text-dim);">';
        const stats = [];
        if(p.gear.atk) stats.push('+ ' + p.gear.atk + ' ATK');
        if(p.gear.def) stats.push('+ ' + p.gear.def + ' DEF');
        if(p.gear.hp) stats.push('+ ' + p.gear.hp + ' HP');
        if(p.gear.mp) stats.push('+ ' + p.gear.mp + ' MP');
        if(p.gear.spd) stats.push('+ ' + p.gear.spd + ' SPD');
        h += stats.join(' · ') + '</div>';
        if(p.gear.d) h += '<div style="font-size:10px;color:var(--accent-light);margin-top:4px;font-style:italic;">' + p.gear.d + '</div>';
      } else {
        h += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Empty trinket slot</div>';
        // Show ALL equippable pgear items (not just for this member)
        const allPgear = G.p.inv.map((it, idx) => ({it, idx})).filter(x => x.it.t === 'pgear');
        if(allPgear.length > 0){
          h += '<div style="display:flex;flex-direction:column;gap:4px;">';
          for(let eq of allPgear){
            const isForThis = !eq.it.for || eq.it.for === p.n;
            const rarityColor = eq.it.r ? (eq.it.r==='epic'?'#a855f7':eq.it.r==='rare'?'#3b82f6':eq.it.r==='uncommon'?'#22c55e':'#9ca3af') : '#9ca3af';
            if(isForThis){
              h += '<button class="equip-pgear" data-member="' + p.n + '" data-idx="' + eq.idx + '" style="padding:6px 10px;border-radius:8px;border:1px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:11px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
              h += '<span style="color:'+rarityColor+';">' + eq.it.n + '</span>';
              h += '<span style="font-size:10px;color:var(--text-dim);">Equip →</span>';
              h += '</button>';
            }
          }
          // Show incompatible items as disabled
          const incompatible = allPgear.filter(x => x.it.for && x.it.for !== p.n);
          if(incompatible.length > 0){
            h += '<div style="font-size:10px;color:var(--disabled);margin-top:4px;padding-top:4px;border-top:1px solid var(--border);">Not for ' + p.n + ':</div>';
            for(let eq of incompatible){
              h += '<div style="padding:4px 10px;border-radius:8px;background:var(--nav-bg);color:var(--disabled);font-size:10px;">' + eq.it.n + ' (' + eq.it.for + ' only)</div>';
            }
          }
          h += '</div>';
        } else {
          h += '<div style="font-size:10px;color:var(--disabled);margin-top:4px;">Buy trinkets from traders like Ribald, Deidre, or Nym.</div>';
        }
      }
      h += '</div>';
    }
  }
  h+='</div></div>'; return h;
}
function rSkills(){
  let h='<div class="skills-view"><h2 class="st">Mage Skills</h2><div class="sklist">';
  for(let s of G.p.skills){
    const st=s.on?'LEARNED':'Unlocks Lv.'+s.ul;
    h+='<div class="skcard '+(s.on?'':'locked')+'"><div class="skh"><span class="ski">'+(s.buff?'🛡️':'⚡')+'</span><span class="skt">'+s.n+'</span><span class="sks">'+st+'</span></div><div class="skd"><span class="dp">'+s.c+' MP</span><span class="dp">'+(s.dmg||'Buff')+'</span></div><div class="skdsc">'+s.d+'</div></div>';
  }
  h+='</div><div class="stb"><h3>Character Stats</h3>';
  for(let [k,v] of Object.entries(G.p.stats))h+='<div class="str"><span class="stn">'+k.toUpperCase()+'</span><span class="stv">'+v+'</span></div>';
  h+='</div></div>'; return h;
}

function getEquipScore(item) {
  if (!item || !item.slot) return 0;
  let score = 0;
  if (item.atk) score += item.atk * 3;
  if (item.def) score += item.def * 3;
  if (item.int) score += item.int * 2;
  if (item.str) score += item.str * 2;
  if (item.dex) score += item.dex * 2;
  if (item.con) score += item.con * 2;
  if (item.wis) score += item.wis * 2;
  if (item.cha) score += item.cha * 1;
  if (item.fireDmg) score += item.fireDmg * 2;
  if (item.iceDmg) score += item.iceDmg * 2;
  if (item.lightDmg) score += item.lightDmg * 2;
  if (item.voidDmg) score += item.voidDmg * 2;
  if (item.arcaneDmg) score += item.arcaneDmg * 2;
  if (item.lifeSteal) score += item.lifeSteal * 10;
  if (item.critChance) score += item.critChance * 20;
  if (item.mpRegen) score += item.mpRegen * 2;
  if (item.hpRegen) score += item.hpRegen * 2;
  return score;
}

function getEquipComparison(item) {
  if (!item || !item.slot) return null;
  const slot = item.slot === 'ring' ? (G.p.eq.ring1 ? 'ring2' : 'ring1') : item.slot;
  const equipped = G.p.eq[slot];
  if (!equipped) return { better: true, arrow: '▲', color: '#22c55e', text: 'New slot' };
  const itemScore = getEquipScore(item);
  const eqScore = getEquipScore(equipped);
  if (itemScore > eqScore) return { better: true, arrow: '▲', color: '#22c55e', text: 'Upgrade' };
  if (itemScore < eqScore) return { better: false, arrow: '▼', color: '#ef4444', text: 'Downgrade' };
  return { better: false, arrow: '●', color: '#9ca3af', text: 'Sidegrade' };
}

function rInv(){
  let h='<div class="inventory-view"><h2 class="st">Inventory</h2>';

  // Equipment Stats Summary
  const eqStats = getEquippedStats();
  h += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:12px;margin-bottom:16px;">';
  h += '<div style="font-size:12px;font-weight:600;color:var(--accent-light);margin-bottom:8px;">⚔️ Equipment Bonuses</div>';
  h += '<div style="display:flex;flex-wrap:wrap;gap:6px;font-size:10px;">';
  const statLabels = {atk:'ATK',def:'DEF',str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA',
                      fireDmg:'🔥Fire',iceDmg:'❄️Ice',lightDmg:'⚡Light',voidDmg:'🌑Void',arcaneDmg:'✨Arcane',
                      lifeSteal:'🩸Leech',critChance:'💥Crit',mpRegen:'💧MP+',hpRegen:'💚HP+',goldFind:'💰Gold'};
  for(let k in statLabels){
    if(eqStats[k] > 0){
      const val = k === 'critChance' || k.includes('Res') ? (eqStats[k]*100)+'%' : (k.includes('Regen') ? '+'+eqStats[k]+'/turn' : '+'+eqStats[k]);
      h += '<span style="background:var(--bg-hover);padding:3px 8px;border-radius:8px;">'+statLabels[k]+' '+val+'</span>';
    }
  }
  h += '</div></div>';

  // Equipped Gear
  h+='<div class="eqs"><h3>Equipped Gear</h3><div class="eqg">';
  const slotOrder = ['weapon','armor','head','hands','feet','ring1','ring2','amulet'];
  const slotIcons = {weapon:'⚔️',armor:'🛡️',head:'🎓',hands:'🧤',feet:'👢',ring1:'💍',ring2:'💍',amulet:'📿'};
  for(let sl of slotOrder){
    const it=G.p.eq[sl];
    const slotName = EQUIPMENT_SLOTS[sl].name;
    h+='<div class="esl" style="cursor:pointer;" onclick="unequipItem(\'"+sl+"\')">';
    h+='<div class="esn">'+slotIcons[sl]+' '+slotName+'</div>';
    if(it){
      h+='<div class="eit" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      let stats = [];
      if(it.atk) stats.push('ATK+'+it.atk);
      if(it.def) stats.push('DEF+'+it.def);
      if(it.int) stats.push('INT+'+it.int);
      if(it.str) stats.push('STR+'+it.str);
      if(it.dex) stats.push('DEX+'+it.dex);
      if(it.con) stats.push('CON+'+it.con);
      if(it.wis) stats.push('WIS+'+it.wis);
      if(it.cha) stats.push('CHA+'+it.cha);
      if(it.prefix) stats.push(it.prefixData.desc);
      if(it.suffix) stats.push(it.suffixData.desc);
      h+='<div class="est">'+stats.join(' · ')+'</div>';
    }else{
      h+='<div class="ese">Empty</div>';
    }
    h+='</div>';
  }
  h+='</div></div>';

  // Categorize inventory items
  const equipItems = [];
  const consumableItems = [];
  const matItems = [];
  const otherItems = [];
  
  for(let i=0; i<G.p.inv.length; i++){
    const it = G.p.inv[i];
    const isEquip = it.slot && it.slot !== 'mat' && it.slot !== 'pot' && it.slot !== 'revive' && it.t !== 'food' && it.t !== 'drink';
    if(isEquip) equipItems.push({item: it, index: i});
    else if(it.t==='pot' || it.t==='food' || it.t==='drink' || it.t==='revive') consumableItems.push({item: it, index: i});
    else if(it.t==='mat') matItems.push({item: it, index: i});
    else otherItems.push({item: it, index: i});
  }

  // Equipment section
  if(equipItems.length > 0){
    h+='<div class="its"><h3>🎒 Equipment ('+equipItems.length+')</h3><div class="ig">';
    for(let ei of equipItems){
      const it = ei.item;
      const i = ei.index;
      const cmp = getEquipComparison(it);
      h+='<div class="ic" style="position:relative;">';
      if(cmp){
        h+='<div style="position:absolute;top:6px;right:6px;font-size:14px;color:'+cmp.color+';font-weight:700;" title="'+cmp.text+'">'+cmp.arrow+'</div>';
      }
      h+='<div class="ii">'+(EQUIPMENT_SLOTS[it.slot]?.icon || '⚔️')+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.ilvl) h+='<div style="font-size:9px;color:var(--text-dim);">iLvl '+it.ilvl+' '+ITEM_RARITY[it.r].name+'</div>';
      h += getItemSocketDisplay(it);
      let statLine = [];
      if(it.atk) statLine.push('ATK+'+it.atk);
      if(it.def) statLine.push('DEF+'+it.def);
      if(it.int) statLine.push('INT+'+it.int);
      if(it.str) statLine.push('STR+'+it.str);
      if(it.dex) statLine.push('DEX+'+it.dex);
      if(it.con) statLine.push('CON+'+it.con);
      if(it.wis) statLine.push('WIS+'+it.wis);
      if(it.cha) statLine.push('CHA+'+it.cha);
      if(it.prefix) statLine.push(it.prefixData.desc);
      if(it.suffix) statLine.push(it.suffixData.desc);
      if(statLine.length > 0) h+='<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">'+statLine.join(' · ')+'</div>';
      h+='<div class="iq">'+(it.value ? it.value+'G' : '')+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-e" data-i="'+i+'">Equip</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Consumables section
  if(consumableItems.length > 0){
    h+='<div class="its"><h3>🧪 Consumables ('+consumableItems.length+')</h3><div class="ig">';
    for(let ci of consumableItems){
      const it = ci.item;
      const i = ci.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      if(it.eff==='heal') h+='<div style="font-size:10px;color:var(--success);">+'+it.v+' HP</div>';
      if(it.eff==='mana') h+='<div style="font-size:10px;color:var(--mp);">+'+it.v+' MP</div>';
      if(it.eff==='revive') h+='<div style="font-size:10px;color:var(--accent-light);">Revive '+it.v+'% HP</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='<div class="ia">';
      h+='<button class="ib ib-u" data-i="'+i+'">Use</button>';
      h+='</div></div>';
    }
    h+='</div></div>';
  }

  // Materials section
  if(matItems.length > 0){
    h+='<div class="its"><h3>💎 Materials ('+matItems.length+')</h3><div class="ig">';
    for(let mi of matItems){
      const it = mi.item;
      const i = mi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  // Other items
  if(otherItems.length > 0){
    h+='<div class="its"><h3>📦 Other ('+otherItems.length+')</h3><div class="ig">';
    for(let oi of otherItems){
      const it = oi.item;
      const i = oi.index;
      h+='<div class="ic">';
      h+='<div class="ii">'+ie(it)+'</div>';
      h+='<div class="in" style="color:'+rc(it.r)+'">'+it.n+'</div>';
      h+='<div class="iq">x'+it.q+'</div>';
      h+='</div>';
    }
    h+='</div></div>';
  }

  if(G.p.inv.length==0) h+='<div class="ei">Your pack is empty.</div>';
  h+='</div>';
  return h;
}

function rCraft(){
  let h='<div class="craft-view"><h2 class="st">Crafting</h2><div class="rlist">';
  for(let i=0;i<G.recipes.length;i++){
    const r=G.recipes[i]; let ok=true,ms='';
    for(let [mn,mq] of Object.entries(r.m)){
      const iv=G.p.inv.find(x=>x.n==mn);
      const hv=iv?iv.q:0,en=hv>=mq;
      if(!en)ok=false;
      ms+='<span class="mp '+(en?'ok':'miss')+'">'+mn+': '+hv+'/'+mq+'</span>';
    }
    h+='<div class="rc"><div class="rr"><span class="ri">'+ie(r.res)+'</span><span class="rn" style="color:'+rc(r.res.r)+'">'+r.n+'</span><span class="rd">'+r.d+'</span></div><div class="rms">'+ms+'</div><button class="cb '+(ok?'':'dis')+'" data-i="'+i+'">Forge</button></div>';
  }
  h+='</div></div>'; return h;
}

function toggleQuestCollapse(key){
  G.questCollapsed[key] = !G.questCollapsed[key];
  render();
}

function rQuest(){
  let h='<div class="quest-view">';
    // === DAILY LOGIN REWARDS ===
  const today = G.gameDay || 0;
  const streak = G.loginStreak || 0;
  const claimedToday = G.loginClaimed || false;

  const loginRewards = [
    { day: 1, icon: '💰', name: 'Gold Pouch', g: 50, xp: 25 },
    { day: 2, icon: '💧', name: 'Mana Crystal', mp: 30, xp: 35 },
    { day: 3, icon: '🧪', name: 'Health Potion', hp: 50, xp: 45 },
    { day: 4, icon: '💎', name: 'Gem Shard', g: 100, xp: 60 },
    { day: 5, icon: '⚔️', name: 'Mystic Scroll', g: 150, xp: 80 },
    { day: 6, icon: '🔮', name: 'Arcane Orb', mp: 50, xp: 100 },
    { day: 7, icon: '👑', name: 'Legendary Cache', g: 300, xp: 200, item: { n: 'Phoenix Feather', t: 'revive', eff: 'revive', v: 50, q: 1, r: 'rare' } }
  ];

  const todayReward = loginRewards[Math.min(streak, 6)];

  h += '<div style="background: linear-gradient(135deg, var(--accent), #6d28d9); border-radius: 16px; padding: 16px; margin-bottom: 16px; color: white;">';
  h += '<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">';
  h += '<div style="font-size: 28px;">🎁</div>';
  h += '<div><div style="font-weight: 700; font-size: 16px;">Daily Login Reward</div>';
  h += '<div style="font-size: 11px; opacity: 0.9;">Day ' + (streak + 1) + ' · Streak: ' + streak + '</div></div>';
  h += '</div>';

  h += '<div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px; margin-bottom: 12px;">';
  h += '<div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">Today\'s Reward:</div>';
  h += '<div style="display: flex; align-items: center; gap: 8px;">';
  h += '<div style="font-size: 32px;">' + todayReward.icon + '</div>';
  h += '<div style="flex: 1;">';
  h += '<div style="font-weight: 600; font-size: 14px;">' + todayReward.name + '</div>';
  h += '<div style="font-size: 11px; opacity: 0.85;">';
  const rewardParts = [];
  if (todayReward.g) rewardParts.push('+' + todayReward.g + 'G');
  if (todayReward.xp) rewardParts.push('+' + todayReward.xp + 'XP');
  if (todayReward.hp) rewardParts.push('+' + todayReward.hp + 'HP');
  if (todayReward.mp) rewardParts.push('+' + todayReward.mp + 'MP');
  if (todayReward.item) rewardParts.push(todayReward.item.n);
  h += rewardParts.join(' · ');
  h += '</div></div></div></div>';

  // Streak progress dots
  h += '<div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 12px;">';
  for (let i = 0; i < 7; i++) {
    const isActive = i < streak;
    const isToday = i === streak;
    h += '<div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; ' + 
      (isActive ? 'background: #fbbf24; color: #000;' : 
       isToday ? 'background: white; color: var(--accent); border: 2px solid #fbbf24;' : 
       'background: rgba(255,255,255,0.2); color: white;') + '">' + (i + 1) + '</div>';
  }
  h += '</div>';

  if (claimedToday) {
    h += '<button disabled style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: rgba(255,255,255,0.2); color: white; font-size: 13px; font-weight: 600; opacity: 0.6; cursor: not-allowed;">✅ Claimed Today — Come Back Tomorrow!</button>';
  } else {
    h += '<button id="btn-claim-login" style="width: 100%; padding: 10px; border-radius: 10px; border: none; background: #fbbf24; color: #000; font-size: 13px; font-weight: 700; cursor: pointer;">🎁 Claim Reward</button>';
  }
  h += '</div>';
  // === END DAILY LOGIN ===

  // Storyline section
  h+='<h2 class="st">📖 Storyline</h2><div class="qlist">';
  for(let s of G.storyline){
    if(!s.unlocked) continue;
    const pc=Math.min(100,(G.p.lvl/s.need)*100);
    h+='<div class="qc '+(s.done?'done':'')+'" style="border-color:var(--accent-light);"><div class="qh"><span class="qn">'+(s.done?'✅ ':'')+'Ch.'+s.chapter+': '+s.n+'</span><span class="qr">'+s.rw.xp+' XP | '+s.rw.g+' G</span></div>';
    h+='<div class="qd">'+s.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">Lv.'+G.p.lvl+'/'+s.need+'</span></div></div>';
  }
  h+='</div>';
  // Active quests section
  h+='<h2 class="st" style="margin-top:20px;">📜 Active Quests</h2><div class="qlist">';
  for(let q of G.quests){
    if(q.hidden && !q.revealed) continue;
    const pc=Math.min(100,(q.c/q.need)*100);
    const timerStatus=getTimerStatus(q);
    let cardClass=q.done?'done':(q.expired?'expired':(timerStatus?(timerStatus.cls==='timer-urgent'?'timed-urgent':'timed'):''));
    h+='<div class="qc '+cardClass+'"><div class="qh"><span class="qn">'+(q.done?'✅ ':(q.expired?'❌ ':''))+q.n+'</span><span class="qr">'+q.rw.xp+' XP | '+q.rw.g+' G</span></div>';
    if(q.chain){
      h+='<div style="font-size:10px;color:var(--accent-light);margin-bottom:4px;">🔗 Chain: '+q.chain+'</div>';
    }
    if(q.reqQuest && !q.revealed){
      const req=G.quests.find(rq=>rq.id===q.reqQuest);
      h+='<div style="font-size:10px;color:var(--text-dim);font-style:italic;margin-bottom:4px;">🔒 Requires: '+(req?req.n:'Unknown')+'</div>';
    }
    h+='<div class="qd">'+q.d+'</div>';
    if(timerStatus){
      h+='<div class="timer-bar"><div class="timer-fill '+timerStatus.cls+'" style="width:'+timerStatus.pct+'%"></div></div>';
      h+='<div class="timer-label">⏰ '+timerStatus.label+'</div>';
    }
    h+='<div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+Math.min(q.c,q.need)+'/'+q.need+'</span></div></div>';
  }
  h+='</div>';
    // Daily Quests section
  h += '<h2 class="st" style="margin-top:20px;">📋 Daily Quests</h2><div class="qlist">';
  generateDailyQuests();
  if (G.dailyQuests.length === 0) {
    h += '<div class="qc"><div class="qd">No daily quests available. Check back tomorrow!</div></div>';
  } else {
    for (let q of G.dailyQuests) {
      const pc = Math.min(100, (q.c / q.need) * 100);
      h += '<div class="qc ' + (q.done ? 'done' : '') + '"><div class="qh"><span class="qn">' + q.n + '</span><span class="qr">' + q.rw.xp + ' XP | ' + q.rw.g + ' G</span></div>';
      h += '<div class="qd">' + q.d + '</div><div class="qp"><div class="pbar"><div class="pfill" style="width:' + pc + '%"></div></div><span class="ptxt">' + q.c + '/' + q.need + '</span></div></div>';
    }
  }
  h += '</div>';
    // Bounties section
  const activeBounties = G.bounties.filter(b => !b.done && G.p.lvl >= (b.minLv || 1));
  const doneBounties = G.bounties.filter(b => b.done);
  if (activeBounties.length > 0 || doneBounties.length > 0) {
    h+='<h2 class="st" style="margin-top:20px;">💰 Bounties</h2>';
    if (activeBounties.length > 0) {
      h+='<div class="qlist">';
      for(let b of activeBounties){
        const pc=Math.min(100,(b.c/b.need)*100);
        h+='<div class="qc"><div class="qh"><span class="qn">'+b.n+'</span><span class="qr">'+b.rw.xp+' XP | '+b.rw.g+' G</span></div>';
        h+='<div class="qd">'+b.d+'</div><div class="qp"><div class="pbar"><div class="pfill" style="width:'+pc+'%"></div></div><span class="ptxt">'+b.c+'/'+b.need+'</span></div></div>';
      }
      h+='</div>';
    }
    if (doneBounties.length > 0) {
      const collapsed = G.questCollapsed['__bounties_done__'];
      h+='<div style="margin-top:12px;">';
      h+='<div onclick="toggleQuestCollapse(\'__bounties_done__\')" style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:12px 16px;background:var(--bg-hover);border-radius:14px;border:1px solid var(--border);user-select:none;">';
      h+='<span style="font-size:12px;transition:transform 0.2s;display:inline-block;' + (collapsed ? '' : 'transform:rotate(90deg);') + '">▶</span>';
      h+='<span style="font-size:14px;font-weight:600;color:var(--success);">✅ Claimed</span>';
      h+='<span style="font-size:12px;color:var(--text-dim);margin-left:auto;">' + doneBounties.length + '</span>';
      h+='</div>';
      if (!collapsed) {
        h+='<div class="qlist" style="margin-top:8px;">';
        for(let b of doneBounties){
          h+='<div class="qc done" style="opacity:0.55;"><div class="qh"><span class="qn" style="text-decoration:line-through;">'+b.n+'</span><span class="qr" style="color:var(--success);">✓</span></div>';
          h+='<div class="qd">'+b.d+'</div></div>';
        }
        h+='</div>';
      }
      h+='</div>';
    }
  }
  h+='</div>';
  h+='<div class="sum"><div class="si2"><span class="sv">'+G.p.kills+'</span><span class="sl">Monsters</span></div><div class="si2"><span class="sv">'+G.p.quests+'</span><span class="sl">Quests</span></div><div class="si2"><span class="sv">'+G.p.fstreak+'</span><span class="sl">Focus</span></div></div></div>';
  return h;
}

function rFocus(){
  // If focus is not active, show the session picker
  if (!G.fs || G.state !== 'focus') {
    let h = '<div class="fv">';
    h += '<div style="font-size:42px;margin-bottom:8px;">🧘</div>';
    h += '<div class="fl" style="font-size:18px;font-weight:700;margin-bottom:4px;">Focus Mode</div>';
    h += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:20px;">Pick a session length</div>';
    h += '<div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:0 auto;">';
    const sessions = [
      {m:5, xp:20, g:10, label:'Quick Sprint'},
      {m:10, xp:40, g:20, label:'Short Burst'},
      {m:15, xp:60, g:30, label:'Deep Work'},
      {m:20, xp:80, g:40, label:'Extended Flow'},
      {m:25, xp:100, g:50, label:'Full Pomodoro'}
    ];
    for (let s of sessions) {
      h += '<button class="focus-session-btn" data-min="' + s.m + '" style="padding:14px 18px;border-radius:14px;border:2px solid var(--accent);background:var(--bg-card);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
      h += '<span>' + s.m + ' min — ' + s.label + '</span>';
      h += '<span style="font-size:11px;color:var(--success);">+' + s.xp + 'XP +' + s.g + 'G</span>';
      h += '</button>';
    }
    h += '</div>';
    h += '<div class="ftips" style="margin-top:20px;"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward scales with session length!</li></ul></div>';
    h += '</div>';
    return h;
  }
  // Active focus session
  const el=Date.now()-(G.fs||Date.now()),rm=Math.max(0,G.fd-el);
  const m=Math.floor(rm/60000),s=Math.floor((rm%60000)/1000);
  return '<div class="fv"><div class="fc"><div class="ft" id="ft">'+m+':'+s.toString().padStart(2,'0')+'</div><div class="fl">Focus Mode — ' + (G.focusDuration || 25) + ' min</div></div><div class="ftips"><h3>ADHD Tips</h3><ul><li>One task at a time. No multitasking.</li><li>Put your phone face down.</li><li>Break the task into tiny steps.</li><li>Reward: +' + ((G.focusDuration||25)*4) + ' XP when done!</li></ul></div><button class="cfb">Cancel</button></div>';
}

function rTemple() {
  const dead = getDeadParty();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">⛪ Temple of Resurrection</h2>';
  h2 += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">Ancient magic restores fallen companions. Cost: 50G each.</div>';
  if(dead.length === 0){
    h2 += '<div style="text-align:center;padding:20px;color:var(--success);">✨ All companions are alive!</div>';
  }else{
    h2 += '<div style="margin-bottom:12px;">';
    for(let p of G.party){
      const isDead = p.hp <= 0;
      const canAfford = G.p.gold >= 50;
      h2 += '<div class="temple-revive ' + (isDead ? 'dead' : 'alive') + '">';
      h2 += '<div class="tr-ava" style="background:' + p.col + '20;border-color:' + p.col + '">' + (isDead ? '💀' : re(p.r)) + '</div>';
      h2 += '<div class="tr-info">';
      h2 += '<div class="tr-name">' + p.n + '</div>';
      h2 += '<div class="tr-status ' + (isDead ? '' : 'alive') + '">' + (isDead ? '💀 FALLEN' : '✅ Alive ' + p.hp + '/' + p.mhp) + '</div>';
      h2 += '</div>';
      if(isDead) h2 += '<button class="tr-btn ' + (canAfford ? '' : 'dis') + '" data-m="' + p.n + '">' + (canAfford ? 'Revive (50G)' : 'Need 50G') + '</button>';
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  return h2;
}

function rRest() {
  const dead = getDeadParty();
  if(dead.length > 0 && !G.rest.active) return rTemple();

  if (G.rest.active && G.rest.selectedSite) {
    const site = G.rest.selectedSite;
    const currentTick = G.rest.tick;
    const maxTicks = G.rest.maxTicks;
    const pct = (currentTick / maxTicks) * 100;
    const healerName = getHealerName();
    let h2 = '<div class="rest-view">';
    h2 += '<h2 class="st">🔥 Resting at ' + site.name + '</h2>';
    if (G.ambushWarning) {
      h2 += '<div class="ambush-warning">';
      h2 += '<div class="aw-text">⚠️ ' + G.ambushWarning.text + '</div>';
      h2 += '</div>';
    }
    if (G.currentDialogue && !G.ambushWarning) {
      h2 += '<div class="dialogue-box">';
      h2 += '<div class="d-speaker">' + G.currentDialogue.speaker + '</div>';
      h2 += '<div class="d-text">' + G.currentDialogue.text + '</div>';
      h2 += '</div>';
    }
    h2 += '<div class="tick-track">';
    for (let i = 1; i <= maxTicks; i++) {
      let tickClass = '';
      let tickIcon = '○';
      if (i < currentTick) {
        tickClass = 'done';
        tickIcon = '✓';
      } else if (i === currentTick) {
        tickClass = 'current';
        tickIcon = '🔥';
      }
      h2 += '<div class="tick ' + tickClass + '">' + tickIcon + '</div>';
    }
    h2 += '</div>';
    h2 += '<div class="tick-label">Tick ' + currentTick + '/' + maxTicks + '</div>';
    h2 += '<div class="rest-progress" style="margin-top:16px;">';
    h2 += '<div class="rest-bar"><div class="rest-fill" style="width:' + pct + '%"></div></div>';
    h2 += '<div class="rest-healer ok">💚 ' + healerName + ' is tending to the party</div>';
    h2 += '</div>';
    h2 += '<button class="rest-cancel" id="cancel-rest">Cancel Rest (Partial Recovery)</button>';
    h2 += '</div>';
    return h2;
  }

  const healerOk = hasHealer();
  const healerName = getHealerName();
  let h2 = '<div class="rest-view">';
  h2 += '<h2 class="st">💤 Rest</h2>';
  if (healerOk) {
    h2 += '<div class="rest-healer ok" style="background:#22c55e15;border:1px solid var(--success);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--success);">💚 Healer Available: ' + healerName + '</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">5 ticks, 1.5s each. Dialogue every tick. Ambush chance: 15% camp / 5% tavern.</div>';
    h2 += '</div>';
  } else {
    h2 += '<div class="rest-healer fail" style="background:#ef444415;border:1px solid var(--danger);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">';
    h2 += '<div style="font-size:13px;font-weight:600;color:var(--danger);">❌ No Healer in Party</div>';
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">You need a healer (like Eliz) in your active party to rest safely.</div>';
    h2 += '</div>';
  }
  const soelActive = G.party.some(p => p.n === 'Soel' && p.on);
  h2 += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;text-align:left;">';
  h2 += '<div style="font-size:13px;font-weight:600;color:var(--rest);margin-bottom:4px;">🐱 Soel\'s Spirit Blessing</div>';
  if (!soelActive) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Soel must be in your active party to share his blessing.</div>';
  } else if (G.soelBlessing) {
    h2 += '<div style="font-size:11px;color:var(--text-dim);">Blessing rests on <b style="color:var(--text);">' + G.soelBlessing.target + '</b> (+' + G.soelBlessing.def + ' DEF). One blessing per rest \u2014 it fades when you next make camp.</div>';
  } else {
    h2 += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">One member per rest receives +10 DEF until your next rest.</div>';
    h2 += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    for (let m of G.party) {
      if (!m.on || m.n === 'Soel') continue;
      h2 += '<button class="soel-bless-btn" data-n="' + m.n + '" style="padding:6px 12px;border-radius:10px;border:1px solid var(--rest);background:#10b98115;color:var(--text);font-size:11px;font-weight:600;cursor:pointer;">' + m.n + '</button>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div class="rest-sites">';
  const zones = {};
  for (let site of G.rest.sites) {
    if (!zones[site.zone]) zones[site.zone] = [];
    zones[site.zone].push(site);
  }
  for (let zoneName in zones) {
    const sites = zones[zoneName];
    const anyUnlocked = sites.some(s => s.unlocked);
    if (!anyUnlocked) continue;
    h2 += '<div style="margin-bottom:12px;">';
    h2 += '<div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">' + zoneName + '</div>';
    for (let site of sites) {
    let manaSpringRemaining = 8;
    if (G.manaSpringUses.day === G.gameDay) {
        manaSpringRemaining = 8 - G.manaSpringUses.count;
      }
      const isDepletedManaSpring = site.type === 'mana_spring' && manaSpringRemaining <= 0;

      const locked = !site.unlocked || isDepletedManaSpring;

      const canAfford = !site.cost || G.p.gold >= site.cost;
      const canRest = (site.type === 'mana_spring' || site.type === 'temple' || healerOk) && !locked && canAfford;
      h2 += '<div class="rs-card ' + (locked ? 'locked' : '') + '" data-id="' + site.id + '">';
      h2 += '<div class="rs-head">';
      h2 += '<span class="rs-name">' + site.icon + ' ' + site.name + '</span>';
      h2 += '<span class="rs-type ' + site.type + '">' + site.type.toUpperCase() + '</span>';
      h2 += '</div>';
      h2 += '<div class="rs-desc">' + site.desc + '</div>';
            if (locked) {
            if (isDepletedManaSpring) {
          h2 += '<div class="rs-req fail">💧 Daily limit reached (8/8 uses)</div>';

        } else {
          h2 += '<div class="rs-req fail">🔒 Requires Level ' + site.zoneLv + ' to discover</div>';
        }
      } else if (site.cost) {

                const msUsesLeft = site.type === 'mana_spring' ? ' (' + manaSpringRemaining + '/8 today)' : '';
        h2 += '<div class="rs-req ' + (canAfford ? 'ok' : 'fail') + '">' + (canAfford ? '✅' : '❌') + ' Cost: ' + site.cost + 'G' + msUsesLeft + ' · Ambush: 5% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';


      } else {
        h2 += '<div class="rs-req ' + (healerOk ? 'ok' : 'fail') + '">' + (healerOk ? '✅' : '❌') + ' Free · Ambush: 15% | ' + (canRest ? 'Tap to rest' : 'Cannot rest') + '</div>';
      }
      h2 += '</div>';
    }
    h2 += '</div>';
  }
  h2 += '</div>';
  h2 += '<div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:8px;">Rest takes ~7.5 seconds. Party banter every tick. Taverns cost gold but are safer.</div>';
  h2 += '</div>';
  return h2;
}

function toggleQuestCollapse(key){
  G.questCollapsed[key] = !G.questCollapsed[key];
  render();
}

function togglePotionMenu() {
  G.potionMenu = !G.potionMenu;
  render();
}

function usePotionInCombat(invIndex) {
  const it = G.p.inv[invIndex];
  if (!it) return;

  // Handle revive items (Phoenix Feather, Rod of Resurrection, etc.)
  if (it.t === 'revive') {
    const deadMembers = getDeadParty();
    if (deadMembers.length === 0) {
      lg('❌ No fallen allies to revive!');
      G.potionMenu = false;
      render();
      return;
    }

    // Prioritize: San (player) first, then party members
    let target = deadMembers.find(p => p.n === 'San');
    if (!target) target = deadMembers[0];

    // Use item's v value for revive percentage (50% for Phoenix Feather, 75% for Rod of Resurrection)
    const revivePct = it.v || 50;
    const healAmount = Math.floor(target.mhp * (revivePct / 100));
    target.hp = Math.max(1, healAmount);
    target.on = true;

    lg('🔥 ' + it.n + ' radiates with sacred light!');
    lg('✨ ' + (target.n === 'San' ? 'You' : target.n) + ' are revived with ' + target.hp + ' HP (' + revivePct + '%)!');

    it.q--;
    if (it.q <= 0) {
      G.p.inv.splice(invIndex, 1);
    }

    G.potionMenu = false;
    render();
    return;
  }

function getCombatPotions() {
  return G.p.inv.filter(it => 
    (it.t === 'pot' || it.t === 'food' || it.t === 'drink') &&
    (it.eff === 'heal' || it.eff === 'mana') ||
    it.t === 'revive'
  );
}

function setGrindTier(tier) {
  G.endlessGrind.maxZoneLevel = tier;
  lg('📍 Max tier set to ' + tier);
  render();
}

function getEquipScore(item) {
  if (!item || !item.slot) return 0;
  let score = 0;
  if (item.atk) score += item.atk * 3;
  if (item.def) score += item.def * 3;
  if (item.int) score += item.int * 2;
  if (item.str) score += item.str * 2;
  if (item.dex) score += item.dex * 2;
  if (item.con) score += item.con * 2;
  if (item.wis) score += item.wis * 2;
  if (item.cha) score += item.cha * 1;
  if (item.fireDmg) score += item.fireDmg * 2;
  if (item.iceDmg) score += item.iceDmg * 2;
  if (item.lightDmg) score += item.lightDmg * 2;
  if (item.voidDmg) score += item.voidDmg * 2;
  if (item.arcaneDmg) score += item.arcaneDmg * 2;
  if (item.lifeSteal) score += item.lifeSteal * 10;
  if (item.critChance) score += item.critChance * 20;
  if (item.mpRegen) score += item.mpRegen * 2;
  if (item.hpRegen) score += item.hpRegen * 2;
  return score;
}

function getEquipComparison(item) {
  if (!item || !item.slot) return null;
  const slot = item.slot === 'ring' ? (G.p.eq.ring1 ? 'ring2' : 'ring1') : item.slot;
  const equipped = G.p.eq[slot];
  if (!equipped) return { better: true, arrow: '▲', color: '#22c55e', text: 'New slot' };
  const itemScore = getEquipScore(item);
  const eqScore = getEquipScore(equipped);
  if (itemScore > eqScore) return { better: true, arrow: '▲', color: '#22c55e', text: 'Upgrade' };
  if (itemScore < eqScore) return { better: false, arrow: '▼', color: '#ef4444', text: 'Downgrade' };
  return { better: false, arrow: '●', color: '#9ca3af', text: 'Sidegrade' };
}

