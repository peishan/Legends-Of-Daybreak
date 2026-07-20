// ============================================================
// CRAFTING SYSTEM - Legends of Daybreak
// Handles item crafting, inventory management, consumables
// ============================================================

const TRINKET_SHOP = [
  { n: 'Iron Shield',      atk: 0, def: 3, hp: 20, r: 'common',    price: 30 },
  { n: 'Lucky Charm',      atk: 1, def: 1, hp: 10, r: 'common',    price: 25 },
  { n: "Warrior's Band",   atk: 3, def: 0, hp: 15, r: 'uncommon',  price: 60 },
  { n: 'Guardian Pendant', atk: 0, def: 5, hp: 30, r: 'uncommon',  price: 80 },
  { n: 'Storm Crystal',    atk: 4, def: 2, hp: 10, r: 'rare',      price: 150 },
  { n: 'Phoenix Ember',    atk: 2, def: 2, hp: 50, r: 'rare',      price: 200 },
  { n: 'Void Shard',       atk: 6, def: 0, hp: 20, r: 'epic',      price: 400 },
  { n: 'Celestial Seal',   atk: 3, def: 4, hp: 40, r: 'epic',      price: 500 }
];

function addI(it) {
  const ex = G.p.inv.find(i => i.n == it.n && i.t == it.t);
  if (ex) ex.q += it.q || 1;
  else G.p.inv.push({...it, q: it.q || 1});
}

function useI(ix) {
  const it = G.p.inv[ix];
  if (!it) return;
  if (it.t == 'pot' || it.t == 'food' || it.t == 'drink') {
    if (it.eff == 'heal') { G.p.hp = Math.min(G.p.mhp, G.p.hp + it.v); lg('🍽️ Enjoyed ' + it.n + '. +' + it.v + ' HP.'); }
    else if (it.eff == 'mana') { G.p.mp = Math.min(G.p.mmp, G.p.mp + it.v); lg('🥤 Sipped ' + it.n + '. +' + it.v + ' MP.'); }
    it.q--; if (it.q <= 0) G.p.inv.splice(ix, 1);
    render();
  } else if (it.t == 'revive') {
    const dead = getDeadParty();
    if (dead.length === 0) { lg('❌ No fallen companions to revive!'); return; }
    const target = dead[0];
    target.hp = Math.floor(target.mhp * (it.v / 100));
    target.on = true;
    lg('🔥 ' + it.n + ' burns with sacred flame!');
    lg('✨ ' + target.n + ' revived with ' + target.hp + ' HP!');
    it.q--; if (it.q <= 0) G.p.inv.splice(ix, 1);
    render();
  }
}

function craft(ri) {
  const r = G.recipes[ri];
  for (let [mn, mq] of Object.entries(r.m)) {
    const iv = G.p.inv.find(x => x.n == mn);
    if (!iv || iv.q < mq) { lg('Missing mats for ' + r.n); return; }
  }
  for (let [mn, mq] of Object.entries(r.m)) {
    const iv = G.p.inv.find(x => x.n == mn);
    iv.q -= mq; if (iv.q <= 0) { const ix = G.p.inv.indexOf(iv); G.p.inv.splice(ix, 1); }
  }
  addI({...r.res}); lg('Crafted: ' + r.n + '!');
  G.p.crafts = (G.p.crafts || 0) + 1;
  checkDailyQuests('craft', 1);
  checkAchievements();
  const pq = G.quests.find(q => q.t == 'craft');
  if (pq && !pq.done) { pq.c++; checkQ(); }
  render();
}

function eqI(ix) {
  // Legacy equip - redirect to new system
  equipItem(ix);
}

function buyTrinket(index) {
  const t = TRINKET_SHOP[index];
  if (!t) return;
  const aisyah = G.party.find(p => p.on && p.n === 'Aisyah' && p.hp > 0);
  const finalPrice = aisyah ? Math.floor(t.price * 0.9) : t.price;
  if (G.p.gold < finalPrice) { lg('Need ' + finalPrice + 'G'); return; }
  G.p.gold -= finalPrice;
  const item = {
    n: t.n, t: 'pgear', q: 1, r: t.r,
    atk: t.atk || 0, def: t.def || 0, hp: t.hp || 0,
    d: '+' + (t.atk || 0) + ' ATK, +' + (t.def || 0) + ' DEF, +' + (t.hp || 0) + ' HP'
  };
  addI(item);
  lg('🎁 Bought ' + t.n + ' for ' + finalPrice + 'G!' + (aisyah ? ' (Aisyah haggled 10% off!)' : ''));
  render();
}

function rCraft() {
  let h = '<div class="craft-view">';
  h += '<div class="st">⚒️ Crafting</div>';
  h += '<div class="zd">Combine materials to create useful items.</div>';
  for (let i = 0; i < G.recipes.length; i++) {
    const r = G.recipes[i];
    let canCraft = true;
    let mats = '';
    for (let [mn, mq] of Object.entries(r.m)) {
      const iv = G.p.inv.find(x => x.n == mn);
      const have = iv ? iv.q : 0;
      if (have < mq) canCraft = false;
      mats += '<span style="color:' + (have >= mq ? 'var(--success)' : 'var(--danger)') + ';">' + mn + ' ' + have + '/' + mq + '</span> ';
    }
    h += '<div class="craft-card">';
    h += '<div class="craft-name">' + r.n + '</div>';
    h += '<div class="craft-desc">' + r.d + '</div>';
    h += '<div class="craft-mats">' + mats + '</div>';
    h += '<button class="cb ' + (canCraft ? '' : 'dis') + '" data-i="' + i + '">' + (canCraft ? 'Craft' : 'Missing Mats') + '</button>';
    h += '</div>';
  }
  h += '</div>';
  return h;
}
