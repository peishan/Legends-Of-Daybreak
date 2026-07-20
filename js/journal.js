// ============================================
// journal.js - Journal & Story Entry Rendering
// ============================================

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

