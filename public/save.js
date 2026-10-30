// ── Save code: self-contained, checksummed progress string (no server storage) ──
const SAVE=(()=>{
 const S={},dk=()=>new Date().toLocaleDateString('sv');
 const b64=s=>btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 const unb64=s=>decodeURIComponent(escape(atob(s.replace(/-/g,'+').replace(/_/g,'/'))));
 const chk=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(36).toUpperCase().padStart(7,'0').slice(-5)};
 const J=(k,d)=>{try{return JSON.parse(localStorage[k]||'null')||d}catch(e){return d}};
 S.has=()=>Object.keys(J('bapsang',{})).length>0||!!localStorage.ghostPB;
 S.touch=()=>{localStorage.lastPlay=Date.now()};
 S.encode=()=>{const c=J('bapsang',{}),counts=DISH.map(d=>Math.min(35,c[d.id]||0).toString(36)).join('').replace(/0+$/,'');
  const g=J('ghostPB',null);const pb=g&&g.tl?g.ms.toString(36)+'~'+g.tl.map((v,i)=>Math.max(0,Math.min(1295,v-(i?g.tl[i-1]:0))).toString(36).padStart(2,'0')).join(''):'';
  const mis=Object.keys(J('mis_'+dk(),{})).join(',');
  const body=['1',b64(localStorage.nick||''),counts||'0',pb,dk()+':'+mis].join('.');return 'HIKE-'+body+'.'+chk(body)};
 S.link=()=>location.origin+location.pathname+'#save='+S.encode();
 S.decode=raw=>{let s=String(raw||'').trim();const m=s.match(/#save=([^\s&]+)/);if(m)s=decodeURIComponent(m[1]);s=s.replace(/\s+/g,'');
  if(!/^HIKE-/i.test(s))throw Error('That doesn’t look like a save code. It should start with HIKE-.');s=s.slice(5);const i=s.lastIndexOf('.');if(i<0)throw Error('Save code is incomplete. Copy the whole code.');
  const body=s.slice(0,i),ck=s.slice(i+1).toUpperCase();if(chk(body)!==ck)throw Error('Save code is damaged (checksum mismatch). Copy it again exactly.');
  const p=body.split('.');if(p[0]!=='1'||p.length!==5)throw Error('Unknown save code version.');
  const nick=p[1]?unb64(p[1]).slice(0,10):'',c={};[...(p[2]==='0'?'':p[2])].forEach((ch,j)=>{const n=parseInt(ch,36);if(DISH[j]&&n>0)c[DISH[j].id]=n});
  let pb=null;if(p[3]){const[ms,t]=p[3].split('~');const tl=[];let acc=0;for(let j=0;j+1<(t||'').length;j+=2){acc+=parseInt(t.slice(j,j+2),36);tl.push(Math.min(1900,acc))}pb={ms:parseInt(ms,36),tl};if(!(pb.ms>0))pb=null}
  const[day,ms2]=p[4].split(':');return{nick,c,pb,day,mis:ms2?ms2.split(','):[]}};
 S.apply=o=>{const c=J('bapsang',{});let added=0;for(const[k,v]of Object.entries(o.c))if((c[k]||0)<v){added+=v-(c[k]||0);c[k]=v}localStorage.bapsang=JSON.stringify(c);
  if(o.nick&&!localStorage.nick)localStorage.nick=o.nick;const g=J('ghostPB',null);if(o.pb&&(!g||o.pb.ms<g.ms))localStorage.ghostPB=JSON.stringify(o.pb);
  if(o.day===dk()&&o.mis.length){const m=J('mis_'+dk(),{});o.mis.forEach(x=>m[x]=1);localStorage['mis_'+dk()]=JSON.stringify(m)}S.touch();return{added,dishes:Object.keys(o.c).length}};
 S.welcome=()=>{if(!S.has())return'';const c=J('bapsang',{}),n=Object.keys(c).length,g=J('ghostPB',null),T=FX.sets(c).filter(s=>s.done).at(-1);
  return`<div class="wb">👋 Welcome back, <b>${(localStorage.nick||'Hiker').replace(/[<>&]/g,'')}</b>! <span>${n}/${DISH.length} dishes${g?' · best '+FX.fmt(g.ms):''}${T?' · 🏅 '+T.title:''}</span></div>`};
 function modal(mode,pre){const el=document.getElementById('saveM'),b=el.querySelector('.box');
  if(mode==='save'){const code=S.encode();b.innerHTML=`<h1>💾 Your save code</h1><p>Your progress lives in this browser. To continue on another phone or browser, copy this code (or link) and paste it there under <b>Continue with code</b>. Nothing is stored on our server.</p><textarea id="svCode" readonly>${code}</textarea><div class="row"><button id="svCopy" style="background:#2f8f5b;color:#fff">Copy save code</button><button id="svLink" style="background:#3a6fd8;color:#fff">Copy link</button></div><div id="svMsg"></div><button class="go" id="svClose">Done</button>`;
   const cp=async(t,m)=>{try{await navigator.clipboard.writeText(t);msg('✅ '+m)}catch(e){const ta=document.getElementById('svCode');ta.value=t;ta.select();document.execCommand&&document.execCommand('copy');msg('Selected — copy it manually if needed.')}};
   b.querySelector('#svCopy').onclick=()=>cp(code,'Save code copied!');b.querySelector('#svLink').onclick=()=>cp(S.link(),'Save link copied!')}
  else{b.innerHTML=`<h1>↩️ Continue with code</h1><p>Paste a save code (HIKE-…) or a save link from another device. Your dishes, titles, personal-best ghost and today's missions will be restored and merged with this device.</p><textarea id="svIn" placeholder="HIKE-1.…">${pre||''}</textarea><div id="svMsg"></div><div class="row"><button id="svGo" style="background:#2f8f5b;color:#fff">Restore progress</button><button id="svClose2" style="background:#eee">Cancel</button></div>`;
   b.querySelector('#svGo').onclick=()=>{try{const o=S.decode(document.getElementById('svIn').value),r=S.apply(o);msg(`✅ Restored! ${r.dishes} dish types on your table${o.pb?' · ghost '+FX.fmt(o.pb.ms):''}.`,1);history.replaceState(null,'',location.pathname);setTimeout(()=>{el.classList.add('hide');MAP.show()},1400)}catch(e){msg('⚠️ '+e.message)}};
   b.querySelector('#svClose2').onclick=()=>{el.classList.add('hide');history.replaceState(null,'',location.pathname)}}
  const c=b.querySelector('#svClose');if(c)c.onclick=()=>el.classList.add('hide');el.classList.remove('hide')}
 const msg=(t,ok)=>{const m=document.getElementById('svMsg');m.textContent=t;m.className=ok||t[0]==='✅'?'ok':'bad'};
 S.open=modal;
 S.init=()=>{const h=location.hash.match(/#save=(.+)/);if(h)modal('load',decodeURIComponent(h[1]))};
 return S})();
