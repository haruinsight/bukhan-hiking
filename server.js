const http=require('http'),fs=require('fs'),path=require('path'),{WebSocketServer}=require('ws');
const DEV=process.env.DEV==='1';const PORT=process.env.PORT||8080,MAX=100,STEP=10;
const MTS={halla:{name:'한라산',h:1947},jiri:{name:'지리산',h:1915},seorak:{name:'설악산',h:1708},deogyu:{name:'덕유산',h:1614},bukhan:{name:'북한산 백운대',h:1900,course:true}};
const rooms=new Map();let nid=1;
let rank={day:'',list:[]};const today=()=>new Date().toLocaleDateString('sv',{timeZone:'Asia/Seoul'});
const getRank=()=>{if(rank.day!==today())rank={day:today(),list:[]};return rank.list};
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.json':'application/json'};
const srv=http.createServer((q,r)=>{const u=q.url.split('?')[0];const f=path.join(__dirname,'public',u==='/'?'index.html':path.normalize(u));
 fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end()}r.writeHead(200,{'Content-Type':types[path.extname(f)]||'text/plain'});r.end(d)})});
const wss=new WebSocketServer({server:srv,maxPayload:512});
function pick(mt){let n=1;for(;;n++){const k=mt+':'+n;if(!rooms.has(k))rooms.set(k,new Map());if(rooms.get(k).size<MAX)return k}}
function bc(k){const m=rooms.get(k);if(!m)return;const s=JSON.stringify({t:'state',players:[...m.values()]});for(const p of m.values())p.ws.readyState===1&&p.ws.send(s)}
wss.on('connection',ws=>{let k=null;const id=nid++,p={id,name:'등산객'+id,h:0,summits:0,c:Math.floor(Math.random()*6)};Object.defineProperty(p,'ws',{value:ws});
 const leave=()=>{if(k){rooms.get(k).delete(id);bc(k);k=null}};
 let win=Date.now(),cnt=0;
 ws.on('message',m=>{const n=Date.now();if(n-win>1000){win=n;cnt=0}if(++cnt>20)return;let d;try{d=JSON.parse(m)}catch{return}
  if(d.t==='join'&&MTS[d.mt]){leave();if(typeof d.name==='string'&&d.name.trim())p.name=d.name.replace(/[<>&"'`\u0000-\u001f]/g,'').trim().slice(0,10)||p.name;p.h=0;p.summits=0;p.mode=d.mode==='challenge'?'challenge':'walk';p.t0=0;k=pick(d.mt);rooms.get(k).set(id,p);
   ws.send(JSON.stringify({t:'hello',id,room:+k.split(':')[1],mt:d.mt,mount:MTS[d.mt],max:MAX,step:STEP}));bc(k)}
  if(d.t==='step'&&k){if(!p.t0)p.t0=Date.now();const H=MTS[k.split(':')[0]].h;p.h=Math.min(H,p.h+STEP);let top=false;if(p.h>=H){p.summits++;top=true}
   bc(k);if(top){const ms=Date.now()-p.t0;p.t0=0;ws.send(JSON.stringify({t:'summit',summits:p.summits,ms}));p.h=0;if(p.mode==='challenge'){p.pend={ms,mt:k.split(':')[0]}}setTimeout(()=>bc(k),50)}}
  if(d.t==='record'&&p.pend&&p.pend.mt==='bukhan'){const L=getRank();L.push({name:p.name,ms:p.pend.ms,score:Math.max(0,Math.min(99999,d.score|0))});L.sort((a,b)=>a.ms-b.ms);L.length=Math.min(L.length,10);p.pend=null;ws.send(JSON.stringify({t:'rank',list:L}))}
  if(d.t==='rank')ws.send(JSON.stringify({t:'rank',list:getRank()}));
  if(DEV&&d.t==='set'&&k&&typeof d.h==='number'){p.h=Math.max(0,Math.min(MTS[k.split(':')[0]].h-STEP,d.h|0));bc(k)} // 데모/테스트용
 });
 ws.on('close',leave)});
srv.listen(PORT,'0.0.0.0',()=>console.log('http://localhost:'+PORT));
