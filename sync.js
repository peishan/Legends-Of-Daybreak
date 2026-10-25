/* =========================================================================
   PWA install + cloud backup (GitHub Gist). Loaded after game.js, which
   provides saveGame, getSaveData, applySaveData, renderHub, showScreen and
   showHubToast.
   ========================================================================= */
if('serviceWorker' in navigator && location.protocol.startsWith('http')){
  window.addEventListener('load', ()=> navigator.serviceWorker.register('sw.js').catch(()=>{}));
}

let deferredInstall = null;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault(); deferredInstall = e;
  document.getElementById('hub-install-btn').style.display = '';
});
window.addEventListener('appinstalled', ()=>{ deferredInstall = null; document.getElementById('hub-install-btn').style.display = 'none'; });
document.getElementById('hub-install-btn').addEventListener('click', async ()=>{
  if(!deferredInstall) return;
  deferredInstall.prompt();
  await deferredInstall.userChoice.catch(()=>{});
  deferredInstall = null;
  document.getElementById('hub-install-btn').style.display = 'none';
});
// iOS has no install prompt: show the manual steps once.
if(/iphone|ipad|ipod/i.test(navigator.userAgent) && !navigator.standalone){
  let seen = ''; try{ seen = localStorage.getItem('daybreak_ios_hint'); } catch(e){}
  if(!seen) setTimeout(()=>{ showHubToast('Install: tap Share, then Add to Home Screen'); try{ localStorage.setItem('daybreak_ios_hint','1'); }catch(e){} }, 2500);
}

const SYNC_TOKEN_KEY = 'daybreak_sync_token';   // never part of the save data
const SYNC_ID_KEY = 'daybreak_sync_gist_id';
const SYNC_FILE = 'legends_of_daybreak_save.json';
const lsGet = (k) => { try{ return localStorage.getItem(k) || ''; } catch(e){ return ''; } };
const lsSet = (k, v) => { try{ if(v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch(e){} };
const ghHeaders = () => ({ 'Authorization':'token ' + lsGet(SYNC_TOKEN_KEY), 'Accept':'application/vnd.github+json' });
const MASK = '•'.repeat(20);
let syncBusy = false;

function syncStatus(msg, kind){
  const el = document.getElementById('sync-status');
  el.textContent = msg || ''; el.className = msg ? 'show ' + (kind || '') : '';
}
function renderSync(){
  const id = lsGet(SYNC_ID_KEY), token = lsGet(SYNC_TOKEN_KEY);
  document.getElementById('sync-token').value = token ? MASK : '';
  document.getElementById('sync-save-token').textContent = token ? 'Update token' : 'Save & verify token';
  document.getElementById('sync-linked').style.display = id ? '' : 'none';
  document.getElementById('sync-unlinked').style.display = id ? 'none' : '';
  document.getElementById('sync-id-display').textContent = id;
  const fmt = (k) => { const t = +lsGet(k); return t ? new Date(t).toLocaleString() : 'never'; };
  document.getElementById('sync-times').textContent = `Last push: ${fmt('daybreak_sync_last_push')} · Last pull: ${fmt('daybreak_sync_last_pull')}`;
  ['sync-push','sync-pull'].forEach(b => { document.getElementById(b).disabled = syncBusy; });
}
async function ghFetch(url, opts){
  try{ return await fetch(url, opts); }
  catch(e){ await new Promise(r => setTimeout(r, 1200)); return await fetch(url, opts); } // one retry on a flaky connection
}
async function syncSaveToken(){
  const val = document.getElementById('sync-token').value.trim();
  if(val === MASK){ syncStatus('Token unchanged.'); return; }
  lsSet(SYNC_TOKEN_KEY, val);
  if(!val){ syncStatus('Token cleared.'); renderSync(); return; }
  syncStatus('Checking token…');
  try{
    const r = await ghFetch('https://api.github.com/gists?per_page=1', { headers: ghHeaders() });
    if(r.ok) syncStatus('Token saved. Gist access confirmed.', 'ok');
    else if(r.status === 401) syncStatus('GitHub rejected that token (401). Check you copied all of it.', 'bad');
    else if(r.status === 403) syncStatus('Token has no Gist access (403). Use a classic token with the gist scope.', 'bad');
    else syncStatus('GitHub answered ' + r.status + '.', 'bad');
  } catch(e){ syncStatus('Token saved, but GitHub could not be reached: ' + e.message, 'bad'); }
  renderSync();
}
async function syncPush(){
  if(!lsGet(SYNC_TOKEN_KEY)){ syncStatus('Save a GitHub token first.', 'bad'); return; }
  saveGame();
  const id = lsGet(SYNC_ID_KEY);
  syncBusy = true; renderSync(); syncStatus('Uploading…');
  try{
    const r = await ghFetch('https://api.github.com/gists' + (id ? '/' + id : ''), {
      method: id ? 'PATCH' : 'POST', headers: ghHeaders(),
      body: JSON.stringify({ description:'Legends of Daybreak save (do not edit by hand)', public:false, files:{ [SYNC_FILE]:{ content: JSON.stringify(getSaveData()) } } })
    });
    if(!r.ok) throw new Error('GitHub answered ' + r.status + (r.status === 404 ? ' (that backup ID does not exist for this token)' : ''));
    const data = await r.json();
    if(!id) lsSet(SYNC_ID_KEY, data.id);
    lsSet('daybreak_sync_last_push', String(Date.now()));
    syncStatus(id ? 'Pushed. The cloud backup is now this device’s save.' : 'Backup created. Copy the ID below to restore on another device.', 'ok');
  } catch(e){ syncStatus('Push failed: ' + e.message, 'bad'); }
  syncBusy = false; renderSync();
}
async function syncPull(){
  const id = lsGet(SYNC_ID_KEY);
  if(!lsGet(SYNC_TOKEN_KEY)){ syncStatus('Save a GitHub token first.', 'bad'); return; }
  if(!id){ syncStatus('Link a backup ID first.', 'bad'); return; }
  if(!confirm('This replaces the save on THIS device with the cloud copy. Continue?')) return;
  syncBusy = true; renderSync(); syncStatus('Downloading…');
  try{
    const r = await ghFetch('https://api.github.com/gists/' + id, { headers: ghHeaders() });
    if(!r.ok) throw new Error('GitHub answered ' + r.status + '. Check the token and ID.');
    const data = await r.json();
    const f = data.files && data.files[SYNC_FILE];
    if(!f) throw new Error('No Daybreak save in that gist.');
    const content = f.truncated ? await (await ghFetch(f.raw_url, { headers: ghHeaders() })).text() : f.content;
    const save = JSON.parse(content);
    if(!save.player || !save.zoneState) throw new Error('That gist is not a Daybreak save.');
    applySaveData(save); saveGame();
    lsSet('daybreak_sync_last_pull', String(Date.now()));
    syncStatus('Restored from the cloud.', 'ok');
    renderHub();
  } catch(e){ syncStatus('Pull failed: ' + e.message, 'bad'); }
  syncBusy = false; renderSync();
}
async function copyText(text){
  try{ await navigator.clipboard.writeText(text); return true; }
  catch(e){
    const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    let ok = false; try{ ok = document.execCommand('copy'); } catch(_){}
    ta.remove(); return ok;
  }
}

document.getElementById('hub-sync-btn').addEventListener('click', ()=>{ syncStatus(''); renderSync(); showScreen('sync'); });
document.getElementById('sync-back-btn').addEventListener('click', ()=> showScreen('hub'));
document.getElementById('sync-save-token').addEventListener('click', syncSaveToken);
document.getElementById('sync-push').addEventListener('click', syncPush);
document.getElementById('sync-pull').addEventListener('click', syncPull);
document.getElementById('sync-copy-id').addEventListener('click', async ()=>{
  const ok = await copyText(lsGet(SYNC_ID_KEY));
  syncStatus(ok ? 'Backup ID copied.' : 'Copy failed. Select the ID above and copy it by hand.', ok ? 'ok' : 'bad');
});
document.getElementById('sync-paste-id').addEventListener('click', async ()=>{
  try{ document.getElementById('sync-id-input').value = (await navigator.clipboard.readText()).trim(); }
  catch(e){ syncStatus('Your browser blocked clipboard access. Paste into the box by hand.', 'bad'); }
});
document.getElementById('sync-link').addEventListener('click', ()=>{
  const v = document.getElementById('sync-id-input').value.trim();
  if(!/^[0-9a-f]{20,40}$/i.test(v)){ syncStatus('That does not look like a backup ID.', 'bad'); return; }
  lsSet(SYNC_ID_KEY, v); syncStatus('Linked. Pull to restore, or push to overwrite the cloud copy.', 'ok'); renderSync();
});
document.getElementById('sync-unlink').addEventListener('click', ()=>{
  if(!confirm('Unlink this device? The cloud backup itself stays on GitHub.')) return;
  lsSet(SYNC_ID_KEY, ''); syncStatus('Unlinked.'); renderSync();
});
