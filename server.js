const http=require('http'),fs=require('fs'),path=require('path'),{WebSocketServer}=require('ws');
const DEV=process.env.DEV==='1';const PORT=process.env.PORT||8080,MAX=100,STEP=10,MPMAX=6;
const MTS={halla:{name:'한라산',h:1947},jiri:{name:'지리산',h:1915},seorak:{name:'설악산',h:1708},deogyu:{name:'덕유산',h:1614},bukhan:{name:'Bukhansan',h:1900,course:true}};
const rooms=new Map(),mps=new Map();let nid=1;
let rank={day:'',list:[],ghost:null};const today=()=>new Date().toLocaleDateString('sv',{timeZone:'Asia/Seoul'});
const getRank=()=>{if(rank.day!==today())rank={day:today(),list:[],ghost:null};return rank.list};
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.json':'application/json'};
const srv=http.createServer((q,r)=>{const u=q.url.split('?')[0];const f=path.join(__dirname,'public',u==='/'?'index.html':path.normalize(u));
 fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end()}r.writeHead(200,{'Content-Type':types[path.extname(f)]||'text/plain'});r.end(d)})});
const wss=new WebSocketServer({server:srv,maxPayload:4096});
function pick(mt){let n=1;for(;;n++){const k=mt+':'+n;if(!rooms.has(k))rooms.set(k,new Map());if(rooms.get(k).size<MAX)return k}}
function bc(k){const m=rooms.get(k);if(!m)return;const s=JSON.stringify({t:'state',players:[...m.values()]});for(const p of m.values())p.ws.readyState===1&&p.ws.send(s)}
const send=(ws,o)=>ws.readyState===1&&ws.send(JSON.stringify(o));
const clean=s=>typeof s==='string'?s.replace(/[<>&"'`\u0000-\u001f]/g,'').trim().slice(0,10):'';
// ── private / quick-match rooms ──
const CH='ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function newCode(){for(;;){let c='';for(let i=0;i<4;i++)c+=CH[Math.floor(Math.random()*CH.length)];if(!mps.has(c))return c}}
function mpView(r){return{t:'mpLobby',code:r.code,host:r.host,state:r.state,max:MPMAX,players:[...r.mem.values()].map(p=>({id:p.id,name:p.name,c:p.c,ready:!!r.ready.get(p.id)})),fin:r.fin}}
function mpBc(r,o){const v=o||mpView(r);for(const p of r.mem.values())p.ws.readyState===1&&p.ws.send(JSON.stringify({...v,you:p.id}))}
const allFin=r=>[...r.mem.keys()].every(i=>r.fin.some(f=>f.id===i));
function mpLeave(p){const r=p.mp&&mps.get(p.mp);p.mp=null;if(!r)return;r.mem.delete(p.id);r.ready.delete(p.id);if(!r.mem.size){mps.delete(r.code);rooms.delete('bukhan:'+r.code);return}
 if(r.host===p.id)r.host=r.mem.keys().next().value;r.at=Date.now();r.fin=r.fin.filter(f=>r.mem.has(f.id)||f.ms);if(r.state==='race'&&allFin(r))r.state='done';mpBc(r)}
setInterval(()=>{const n=Date.now();for(const[c,r]of mps)if(!r.mem.size||n-r.at>45*60e3){for(const p of r.mem.values())p.mp=null;mps.delete(c);rooms.delete('bukhan:'+c)}},60e3).unref();
wss.on('connection',ws=>{let k=null;const id=nid++,p={id,name:'Hiker'+id,h:0,summits:0,c:Math.floor(Math.random()*6)};Object.defineProperty(p,'ws',{value:ws});Object.defineProperty(p,'mp',{value:null,writable:true});
 const leave=()=>{if(k){const m=rooms.get(k);if(m){m.delete(id);bc(k)}k=null}};
 const enter=(key,extra)=>{leave();p.h=0;p.summits=0;p.t0=0;p.pend=null;k=key;if(!rooms.has(k))rooms.set(k,new Map());rooms.get(k).set(id,p);send(ws,{t:'hello',id,room:k.split(':')[1],mt:'bukhan',mount:MTS.bukhan,max:MAX,step:STEP,...extra});bc(k)};
 let win=Date.now(),cnt=0,mpCnt=0;
 ws.on('message',m=>{const n=Date.now();if(n-win>1000){win=n;cnt=0;mpCnt=0}if(++cnt>20)return;let d;try{d=JSON.parse(m)}catch{return}if(!d||typeof d!=='object')return;
  if(typeof d.t==='string'&&d.t.startsWith('mp')&&++mpCnt>4)return;// lobby actions: max 4/s
  if(d.t==='join'&&MTS[d.mt]){mpLeave(p);if(clean(d.name))p.name=clean(d.name);enter(pick(d.mt))}
  if(d.t==='step'&&k){const r=p.mp&&mps.get(p.mp);if(r&&(r.state!=='race'||n<r.startAt))return;if(!p.t0)p.t0=r?r.startAt:n;const H=MTS[k.split(':')[0]].h;if(p.h>=H)return;p.h=Math.min(H,p.h+STEP);let top=false;if(p.h>=H){p.summits++;top=true}
   bc(k);if(top){const ms=n-p.t0;p.t0=0;send(ws,{t:'summit',summits:p.summits,ms});p.pend={ms,mt:'bukhan'};
    if(r){r.fin.push({id,name:p.name,ms,c:p.c});mpBc(r,{t:'mpFin',fin:r.fin,total:r.mem.size});if(allFin(r)){r.state='done';mpBc(r)}}else{p.h=0;setTimeout(()=>bc(k),50)}}}
  if(d.t==='record'&&p.pend&&p.pend.mt==='bukhan'){const L=getRank();L.push({name:p.name,ms:p.pend.ms,score:Math.max(0,Math.min(99999,d.score|0))});L.sort((a,b)=>a.ms-b.ms);
   const tl=Array.isArray(d.tl)&&d.tl.length>2&&d.tl.length<=450&&d.tl.every(v=>Number.isInteger(v)&&v>=0&&v<=1900)?d.tl:null;if(tl&&(!rank.ghost||p.pend.ms<rank.ghost.ms))rank.ghost={name:p.name,ms:p.pend.ms,tl};
   L.length=Math.min(L.length,10);p.pend=null;send(ws,{t:'rank',list:L})}
  if(d.t==='rank')send(ws,{t:'rank',list:getRank()});
  if(d.t==='ghost'){getRank();send(ws,{t:'ghost',g:rank.ghost})}
  // multiplayer lobby
  if(d.t==='mpCreate'||d.t==='mpJoin'||d.t==='mpQuick'){if(clean(d.name))p.name=clean(d.name);let r;
   if(d.t==='mpJoin'){r=mps.get(String(d.code||'').toUpperCase().slice(0,4));if(!r)return send(ws,{t:'mpErr',e:'Room not found. Check the code?'});if(r.state!=='lobby')return send(ws,{t:'mpErr',e:'That race already started.'});if(r.mem.size>=MPMAX&&!r.mem.has(id))return send(ws,{t:'mpErr',e:'Room is full (6 hikers max).'})}
   if(d.t==='mpQuick')r=[...mps.values()].find(x=>x.open&&x.state==='lobby'&&x.mem.size<MPMAX&&!x.mem.has(id));
   if(!r){const code=newCode();r={code,host:id,mem:new Map(),ready:new Map(),state:'lobby',fin:[],at:n,open:d.t==='mpQuick'};mps.set(code,r)}
   if(p.mp&&p.mp!==r.code)mpLeave(p);leave();p.mp=r.code;{const used=new Set([...r.mem.values()].filter(q=>q.id!==id).map(q=>q.c));if(used.has(p.c))for(let i=0;i<6;i++)if(!used.has(i)){p.c=i;break}}r.mem.set(id,p);r.at=n;mpBc(r)}
  const r=p.mp&&mps.get(p.mp);
  if(r&&d.t==='mpReady'&&r.state==='lobby'){r.ready.set(id,!!d.v);mpBc(r)}
  if(r&&d.t==='mpLeave'){mpLeave(p);leave();send(ws,{t:'mpLeft'})}
  if(r&&d.t==='mpStart'&&r.host===id&&(r.state==='lobby'||r.state==='done')){const others=[...r.mem.keys()].filter(i=>i!==id);
   if(r.mem.size<2)return send(ws,{t:'mpErr',e:'Need at least 2 hikers to race.'});if(r.state==='lobby'&&others.some(i=>!r.ready.get(i)))return send(ws,{t:'mpErr',e:'Waiting for everyone to be Ready.'});
   r.state='race';r.fin=[];r.startAt=n+4000;r.at=n;const key='bukhan:'+r.code;rooms.set(key,new Map());
   for(const q of r.mem.values()){q.ws.emit('mpEnter',key)}mpBc(r,{t:'mpCount',at:r.startAt,now:n});mpBc(r)}
  if(DEV&&d.t==='set'&&k&&typeof d.h==='number'){p.h=Math.max(0,Math.min(MTS[k.split(':')[0]].h-STEP,d.h|0));bc(k)}
 });
 ws.on('mpEnter',key=>enter(key,{mp:p.mp}));
 ws.on('close',()=>{mpLeave(p);leave()})});
srv.listen(PORT,'0.0.0.0',()=>console.log('http://localhost:'+PORT));
