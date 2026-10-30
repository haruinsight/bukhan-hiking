// ── Play with friends: private rooms, quick match, lobby, countdown, live standings ──
const MP=(()=>{
 const M={code:null,lobby:null,me:null,start:0,fin:[],racing:false};const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[<>&"]/g,'');
 const COLS=['#3a7bd5','#2aa876','#8e5bd6','#d64545','#f2b632','#ff7aa8'];
 const name=()=>{const n=($('mpNick')&&$('mpNick').value.trim())||localStorage.nick||'';if(n)localStorage.nick=n;return n};
 const sendMp=o=>connect(()=>ws.send(JSON.stringify(o)));
 M.open=(code)=>{$('map').classList.add('hide');$('mpM').classList.remove('hide');if(M.lobby)return render();
  $('mpBox').innerHTML=`<h1>👥 Play with friends <small>같이 등산</small></h1><p>Race up Bukhansan together — 2 to 6 hikers. Everyone picks a dish at the summit.</p>
  <input id="mpNick" maxlength="10" placeholder="Your nickname" value="${esc(localStorage.nick||'')}">
  <div class="row"><button id="mpCreate" style="background:#2f8f5b;color:#fff">➕ Create room</button><button id="mpQuick" style="background:#3a6fd8;color:#fff">⚡ Quick match</button></div>
  <div class="row"><input id="mpCode" maxlength="4" placeholder="CODE" style="text-transform:uppercase;letter-spacing:4px;text-align:center" value="${esc(code||'')}"><button id="mpJoin" style="background:#f08a3a;color:#fff">Join room</button></div>
  <div id="mpErr"></div><button id="mpBack" class="lnk">← Back to map</button>`;
  $('mpCreate').onclick=()=>{FX.unlock();sendMp({t:'mpCreate',name:name()})};$('mpQuick').onclick=()=>{FX.unlock();sendMp({t:'mpQuick',name:name()})};
  $('mpJoin').onclick=()=>{FX.unlock();const c=$('mpCode').value.trim().toUpperCase();if(!/^[A-Z0-9]{4}$/.test(c))return err('Room codes are 4 letters/numbers.');sendMp({t:'mpJoin',code:c,name:name()})};
  $('mpBack').onclick=()=>{$('mpM').classList.add('hide');MAP.show()};if(code)$('mpJoin').focus()};
 const err=e=>{const x=$('mpErr');if(x){x.textContent='⚠️ '+e}};
 M.link=()=>location.origin+location.pathname+'#room='+M.code;
 function render(){const L=M.lobby;if(!L)return;const ME=M.me,host=L.host===ME,mine=L.players.find(p=>p.id===ME)||{},others=L.players.filter(p=>p.id!==L.host),allR=others.length>0&&others.every(p=>p.ready);
  $('mpBox').innerHTML=`<h1>👥 Room <span class="code">${L.code}</span></h1><p>${L.state==='done'?'🏁 Race finished! Host can start a rematch.':'Share the code or link. Up to '+L.max+' hikers.'}</p>
  <div class="row"><button id="mpCopy" style="background:#3a6fd8;color:#fff">🔗 Copy invite link</button></div>
  <div class="mpl">${L.players.map(p=>`<div><i style="background:${COLS[p.c%6]}"></i><b>${esc(p.name)}</b>${p.id===L.host?' <small>👑 host</small>':''}${p.id===ME?' <small>(you)</small>':''}<span>${p.id===L.host?'':p.ready?'✅ Ready':'⏳'}</span></div>`).join('')}</div>
  <div id="mpErr"></div><div class="row">${host?`<button id="mpStart" class="go" ${L.players.length<2||(L.state==='lobby'&&!allR)?'disabled':''}>${L.players.length<2?'Waiting for friends…':L.state==='lobby'&&!allR?'Waiting for Ready…':'▶ Start race'}</button>`:`<button id="mpReady" class="go" ${L.state!=='lobby'?'disabled':''}>${mine.ready?'✅ Ready! (tap to undo)':'I’m Ready'}</button>`}</div>
  <button id="mpLeave" class="lnk">Leave room</button>`;
  $('mpCopy').onclick=async()=>{try{await navigator.clipboard.writeText(M.link());$('mpErr').textContent='✅ Invite link copied!'}catch(e){$('mpErr').textContent=M.link()}};
  if($('mpStart'))$('mpStart').onclick=()=>ws.send('{"t":"mpStart"}');if($('mpReady'))$('mpReady').onclick=()=>ws.send(JSON.stringify({t:'mpReady',v:!mine.ready}));
  $('mpLeave').onclick=()=>{ws.send('{"t":"mpLeave"}');M.reset();$('mpM').classList.add('hide');MAP.show()}}
 M.reset=()=>{M.code=null;M.lobby=null;M.racing=false;M.fin=[];M.start=0;history.replaceState(null,'',location.pathname)};
 M.onMsg=d=>{
  if(d.t==='mpErr'){err(d.e);return}
  if(d.you)M.me=d.you;if(d.t==='mpLobby'){M.lobby=d;M.code=d.code;if(location.hash!=='#room='+d.code)history.replaceState(null,'',location.pathname+'#room='+d.code);if(!$('mpM').classList.contains('hide')||!M.racing)render();if(d.state==='done'&&M.racing){M.fin=d.fin;resUI()}}
  if(d.t==='mpCount'){M.start=performance.now()+(d.at-d.now);M.racing=true;M.fin=[];for(const id of['mpM','map','card','pick','reward','tbl'])$(id).classList.add('hide');FX.say('👥 Friends race!','Room '+M.code+' · first to Baegundae wins','#ffd76a',3000)}
  if(d.t==='hello'&&d.mp){RH.reset();FX.newRun(['sunrise','day','sunset','rain','snow'][[...d.mp].reduce((a,c)=>a+c.charCodeAt(0),0)%5])}
  if(d.t==='mpFin'){M.fin=d.fin;resUI()}
  if(d.t==='mpLeft')M.reset()};
 M.locked=()=>M.racing&&performance.now()<M.start;
 M.inMp=()=>!!M.code;
 M.rejoin=()=>{if(M.code&&M.lobby&&M.lobby.state==='lobby')ws.send(JSON.stringify({t:'mpJoin',code:M.code,name:localStorage.nick||''}));else if(M.code){M.reset();FX.say('Connection lost','You left the friends room','#ff9a8a',3000)}};
 function resUI(){const el=$('mpRes');if(!el)return;const tot=M.lobby?M.lobby.players.length:M.fin.length;const md=['🥇','🥈','🥉','4th','5th','6th'];
  el.innerHTML=`<b>👥 Friends race · Room ${M.code}</b>`+M.fin.map((f,i)=>`<div class="${f.id===me?'me':''}">${md[i]} ${esc(f.name)} <span>${FX.fmt(f.ms)}</span></div>`).join('')+(M.fin.length<tot?`<div class="wait">⏳ ${tot-M.fin.length} still climbing…</div>`:'');el.classList.remove('hide')}
 M.afterCard=()=>{if(!M.racing)return;resUI()};
 M.again=()=>{if(!M.code)return false;M.racing=false;$('mpM').classList.remove('hide');render();return true};
 // countdown + live standings overlay
 M.overlay=now=>{if(!M.racing)return;const left=M.start-now;
  if(left>-900){ctx.save();ctx.fillStyle=left>0?'rgba(10,20,16,.35)':'rgba(0,0,0,0)';ctx.fillRect(0,0,W,H);const t=left>0?String(Math.ceil(left/1000)):'GO!',ph=left>0?1-(left%1000)/1000:-left/900;
   ctx.textAlign='center';ctx.font=`900 ${Math.round(90+ph*40)}px sans-serif`;ctx.globalAlpha=left>0?1-ph*.4:1-ph;ctx.lineWidth=8;ctx.strokeStyle='#123';ctx.strokeText(t,W/2,H*.42);ctx.fillStyle=left>0?'#fff':'#ffd76a';ctx.fillText(t,W/2,H*.42);ctx.restore()}
  const ps=[...players].sort((a,b)=>b.h-a.h),land=innerWidth>innerHeight&&innerHeight<520,x=W-178,y=land?96:118;
  ctx.save();ctx.fillStyle='rgba(15,25,22,.62)';ctx.beginPath();ctx.roundRect(x,y,166,22+ps.length*19,10);ctx.fill();ctx.fillStyle='#ffd76a';ctx.font='800 11.5px sans-serif';ctx.textAlign='left';ctx.fillText('🏁 LIVE · Room '+M.code,x+9,y+15);
  ps.forEach((p,i)=>{const yy=y+33+i*19,fin=M.fin.find(f=>f.id===p.id);ctx.fillStyle=COLS[p.c%6];ctx.beginPath();ctx.arc(x+14,yy-4,5,0,7);ctx.fill();ctx.fillStyle=p.id===me?'#ffd76a':'#fff';ctx.font=(p.id===me?'800':'600')+' 11.5px sans-serif';
   ctx.fillText(`${i+1}. ${p.name}`.slice(0,14),x+24,yy);ctx.textAlign='right';ctx.fillText(fin?FX.fmt(fin.ms):Math.round(p.h/BK.L*100)+'%',x+158,yy);ctx.textAlign='left'});ctx.restore()};
 M.init=()=>{const h=location.hash.match(/#room=([A-Za-z0-9]{4})/);if(h)M.open(h[1].toUpperCase())};
 return M})();
