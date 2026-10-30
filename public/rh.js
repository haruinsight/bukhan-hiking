// ── Rhythm Walk: note chart · sections · fever · trail events ──
const RH=(()=>{
 const HOP=3.2,BASE=6,STEPV=1.5,MAXL=8,LEAD=1700,FEVER_N=10,FEVER_MS=5000;
 // section tempo: forest slow, stairs fast, granite syncopated (3-3-2 feel)
 const SEC={forest:{k:'forest',mul:1.15,pat:[1],en:'🌲 Forest · slow beat'},stairs:{k:'stairs',mul:.82,pat:[1],en:'🪜 Stone stairs · fast beat'},granite:{k:'granite',mul:1,pat:[1.125,1.125,.75],en:'🪨 Granite · off-beat'}};
 const secOf=d=>d<800?SEC.forest:d<1400?SEC.stairs:SEC.granite;
 let S;
 function reset(){S={notes:[],nextT:0,pi:0,nIdx:0,last:null,lastT:0,v:0,lvl:0,combo:0,pc:0,fb:null,d:0,pressAt:-1e9,foot:null,hop:false,best:0,tPrev:0,sent:0,
  nP:0,nG:0,nM:0,nH:0,hops:0,pts:0,bon:0,fever:0,fevers:0,shield:0,ev:null,evPlan:null,sq:0,wob:0,t0:0,tl:[],sec:null,same:false}}
 reset();
 const I=()=>(600-S.lvl*30)*secOf(S.d).mul;
 const win=()=>{const m=FX.wx().win;return{P:62*m,G:125*m}};
 const fever=now=>now<S.fever;
 function planEvents(){const r=Math.random;S.evPlan=[{k:'sq',at:330+r()*300},{k:'gp',at:900+r()*200},{k:'sp',at:1230+r()*120}]}
 function chart(now){if(!S.notes.length)return;while(S.nextT<now+LEAD){const sc=secOf(S.d),pat=sc.pat,mul=pat[S.pi%pat.length];S.nextT+=I()*mul;S.pi++;const n={t:S.nextT,j:0,i:S.nIdx++,acc:pat.length>1&&S.pi%pat.length===0};S.notes.push(n);FX.beat(n.t,n.i,sc.k,fever(now))}
  S.notes=S.notes.filter(n=>n.t>now-600)}
 function start(now){S.notes=[{t:now,j:0,i:0}];S.nextT=now;S.pi=0;S.nIdx=1;FX.beat(now,0,secOf(S.d).k,false);chart(now)}
 function say(t,e,c,now){S.fb={t,e,c,at:now,combo:S.combo}}
 function brk(now){if(S.shield>0){S.shield--;say('Spring water shield!','SAFE','#7fe0ff',now);return true}S.combo=0;S.pc=0;return false}
 function press(f){const now=performance.now();if(!me||!ws||ws.readyState!==1||uiOpen()||MP.locked()||S.d>=BK.L)return;FX.unlock();
  if(!S.notes.length||now-S.lastT>1800)start(now);
  const W2=win();let n=null,bo=1e9;for(const q of S.notes)if(!q.j){const o=Math.abs(q.t-now);if(o<bo){bo=o;n=q}}
  if(S.ev&&S.ev.k==='gp'&&now<S.wob)bo=Math.max(0,bo-20); // makgeolli: a little forgiving
  let res,pf=false;
  if(f===S.last){S.hops++;S.hop=true;if(n&&bo<W2.G)n.j=1;
   if(!S.same){S.same=true;brk(now);S.lvl=Math.max(0,S.lvl-2);S.nM++;res=['Tripped!','MISS','#ff6b5a']}else{S.nH++;res=['Hop hop~','HOP','#ffb0e0']}}
  else{S.same=false;S.hop=false;const fm=fever(now)?2:1;
   if(n&&bo<W2.P){n.j=1;pf=true;S.combo++;S.pc++;S.lvl=Math.min(MAXL,S.lvl+(S.combo%2===0?1:0));S.nP++;S.pts+=4*fm;res=['Perfect!','PERFECT','#ffe040']}
   else if(n&&bo<W2.G){n.j=1;S.combo++;S.pc=0;S.lvl=Math.min(MAXL,S.lvl+(S.combo%4===0?1:0));S.nG++;S.pts+=2*fm;res=['Nice!','GOOD','#7be08f']}
   else{if(n&&bo<W2.G*1.8)n.j=1;if(!brk(now))S.lvl=Math.max(0,S.lvl-(FX.wx().slip?2:1));S.nM++;res=[FX.wx().slip?'Slipped!':'Off beat','MISS','#ff6b5a']}}
  S.best=Math.max(S.best,S.combo);
  if(S.pc>=FEVER_N&&!fever(now)){S.fever=now+FEVER_MS;S.fevers++;S.pc=0;FX.say('🔥 FEVER TIME!','Speed ×2 · Score ×2 for 5s','#ff4fa0',2200)}
  // squirrel event: need a short perfect streak
  const e=S.ev;if(e&&e.k==='sq'&&!e.done){if(pf){e.got++;if(e.got>=e.need){e.done=1;S.sq=1;S.bon+=60;FX.say('🐿️ The squirrel scampers off!','It grabbed an acorn instead · +60','#9be08a',2200)}}else e.got=0}
  if(!res)res=['Nice!','GOOD','#7be08f'];say(res[0],res[1],res[2],now);S.last=f;S.lastT=now;S.pressAt=now;S.foot=f;S.v=Math.max(S.v,S.hop?HOP:BASE*.6)}
 function events(now){const d=S.d;if(!S.evPlan)planEvents();
  for(const p of S.evPlan)if(!p.on&&d>=p.at){p.on=1;
   if(p.k==='sq'){S.ev={k:'sq',at:d+18,need:4,got:0,until:now+7000};FX.say('🐿️ A squirrel blocks the path!','Hit 4 PERFECTs in a row to shoo it · 다람쥐','#ffcf70',2600)}
   if(p.k==='gp'){S.ev={k:'gp',at:d+14,until:now+3500};S.bon+=80;S.wob=now+3500;FX.say('👴 Makgeolli Grandpa: "One sip, young hiker!"','막걸리 할아버지 · +80 pts · tipsy beat for 3s','#f0e2b0',2600)}
   if(p.k==='sp'){S.ev={k:'sp',at:d+14,until:now+3000};S.shield=2;S.lvl=Math.max(S.lvl,4);FX.say('💧 Mineral spring · 약수터','Fresh water! Combo Shield ×2 + speed restored','#8fe0ff',2600)}}
  const e=S.ev;if(e&&now>e.until){if(e.k==='sq'&&!e.done){S.lvl=0;S.v*=.3;S.sq=-1;FX.say('🐿️ The squirrel stole your gimbap!','Speed lost… keep stepping!','#ff8a6a',2200)}S.ev=null}}
 function tick(now){const dt=Math.min(.1,(now-(S.tPrev||now))/1000);S.tPrev=now;chart(now);
  if(S.notes.length&&now-S.lastT>1800)S.notes=[];
  for(const n of S.notes)if(!n.j&&now-n.t>win().G+20&&now-S.lastT<1200){n.j=1;if(S.combo>0&&!brk(now))say('Missed a beat','MISS','#ff6b5a',now)}
  const active=now-S.lastT<I()*1.6+150;let vT=active?(S.hop?HOP:BASE+S.lvl*STEPV):0;if(fever(now)&&!S.hop)vT*=2;
  S.v+=(vT-S.v)*Math.min(1,dt*(vT<S.v?3:4));if(S.v<.05)S.v=0;
  if(S.sent>0&&!S.t0)S.t0=now;if(S.t0){const k=Math.floor((now-S.t0)/2000);while(S.tl.length<=k&&S.tl.length<450)S.tl.push(Math.round(S.d))}
  events(now);
  if(S.hop&&(now-S.pressAt)/320>1)return mv(0);if(S.d>=BK.L)return mv(0);mv(S.v*dt)}
 function mv(dd){let nd=Math.min(BK.L,S.d+dd);const e=S.ev;if(e&&e.k==='sq'&&!e.done)nd=Math.min(nd,Math.max(S.d,e.at-6));S.d=nd;if(BK.L-S.d<1e-6)S.d=BK.L;
  const need=S.d>=BK.L?Math.ceil(BK.L/10):Math.floor(S.d/10+1e-9);const now=performance.now();if(S.srvAt&&S.sent*10-S.srvH>=30&&now-S.ls>700&&now-S.srvAt>300){S.sent=Math.floor(S.srvH/10);S.srvAt=0}if(S.sent<need&&now-(S.ls||0)>70&&ws&&ws.readyState===1){ws.send('{"t":"step"}');S.sent++;S.ls=now}}
 function pos(){tick(performance.now());return S.d}
 function anim(now){if(S.hop){const t=Math.min(1,(now-S.pressAt)/320);return{pose:t<1?'h1':'h0',y:t<1?Math.round(Math.sin(t*Math.PI)*12):0}}
  if(S.v<.3)return{pose:'idle',y:0};const t=(now-S.pressAt)/I();const f=S.foot==='L'?(t<.5?'w0':'w1'):(t<.5?'w2':'w3');return{pose:t>1.2?['w0','w1','w2','w3'][Math.floor(S.d*1.6/5)%4]:f,y:0}}
 function hud(now){const land=innerWidth>innerHeight&&innerHeight<520,cx=W/2,w=Math.min(W-40,land?W-380:340),K=1.4,y=land?H-52:H-186,x0=cx-w/2,tx=x0+w*.25,fv=fever(now);
  let wob=now<S.wob?Math.sin(now/90)*6:0;
  const rr=(x,y,w,h,r,f)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=f;ctx.fill()};
  ctx.save();ctx.translate(0,wob);ctx.save();ctx.shadowColor=fv?`hsl(${now/4%360},100%,60%)`:'#0004';ctx.shadowBlur=fv?24:12;rr(x0,y-18*K,w,36*K,18*K,fv?'rgba(70,10,60,.62)':'rgba(20,30,28,.55)');ctx.restore();
  ctx.strokeStyle=fv?`hsl(${now/3%360},100%,65%)`:'#ffffff30';ctx.lineWidth=fv?3:1;ctx.beginPath();ctx.roundRect(x0+.5,y-18*K+.5,w-1,36*K-1,18*K-.5);ctx.stroke();
  // notes travel right → left to the target at 1/4
  const next=S.last==='L'?'R':'L',sp=(w*.75-14*K)/LEAD;ctx.save();ctx.beginPath();ctx.roundRect(x0,y-18*K,w,36*K,18*K);ctx.clip();
  ctx.strokeStyle='#ffffff22';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(tx,y-16*K);ctx.lineTo(tx,y+16*K);ctx.stroke();
  let k=0;const pend=S.notes.filter(n=>!n.j);
  const list=S.notes.length?S.notes:[...Array(5)].map((_,i)=>({t:now+((i*560-now%560)+560)%2800,ghost:1}));
  for(const n of list){const px=tx+(n.t-now)*sp;if(px>x0+w+20||px<x0-20)continue;let f;if(n.ghost)f=k++%2?'R':'L';else if(n.j){f=null}else{const ix=pend.indexOf(n);f=ix%2===0?next:(next==='L'?'R':'L')}
   const a=n.j?Math.max(0,.35-(now-n.t)/800):Math.min(1,.35+(1-(px-tx)/(w*.75))*.9);ctx.globalAlpha=Math.max(0,a);
   const g=ctx.createLinearGradient(0,y-11*K,0,y+11*K),L=f!=='R';g.addColorStop(0,n.j?'#ddd':L?'#7cc0ff':'#ffb072');g.addColorStop(1,n.j?'#999':L?'#2f7fe0':'#e8642a');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(px,y,(n.acc?12:10.5)*K,0,7);ctx.fill();if(n.acc){ctx.strokeStyle='#ffe58a';ctx.lineWidth=2;ctx.stroke()}
   if(f){ctx.fillStyle='#fff';ctx.font='800 14px sans-serif';ctx.textAlign='center';ctx.fillText(f,px,y+5)}}
  ctx.restore();ctx.globalAlpha=1;
  const near=S.notes.find(n=>Math.abs(n.t-now)<90),pulse=near?1-Math.abs(near.t-now)/90:0;
  ctx.strokeStyle=`rgba(255,226,120,${.65+pulse*.35})`;ctx.lineWidth=3.5;ctx.beginPath();ctx.arc(tx,y,14*K+pulse*5,0,7);ctx.stroke();ctx.strokeStyle='#ffffff55';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(tx,y,9*K,0,7);ctx.stroke();
  // top line: speed · section · fever · shield
  ctx.font='600 11px sans-serif';ctx.textAlign='left';ctx.fillStyle='#fff';ctx.shadowColor='#0008';ctx.shadowBlur=3;ctx.fillText(S.hop?'HOP':'SPEED',x0+8,y-34);ctx.shadowBlur=0;
  const gx=x0+46,gw=Math.min(100,w*.3);rr(gx,y-42,gw,8,4,'#ffffff30');const fr=S.hop?.08:S.lvl/MAXL;
  if(fr>0){const g=ctx.createLinearGradient(gx,0,gx+gw,0);g.addColorStop(0,'#7be08f');g.addColorStop(.55,'#ffd84a');g.addColorStop(1,'#ff6b5a');ctx.beginPath();ctx.roundRect(gx,y-42,Math.max(8,gw*fr),8,4);ctx.fillStyle=S.hop?'#ffb0e0':fv?`hsl(${now/3%360},100%,60%)`:g;ctx.fill()}
  ctx.textAlign='right';ctx.fillStyle='#fff';ctx.shadowBlur=3;ctx.fillText((S.shield?'💧×'+S.shield+'  ':'')+(fv?'🔥FEVER ':'')+(S.combo>1?'combo '+S.combo:'Lv '+S.lvl),x0+w-6,y-34);
  ctx.textAlign='center';ctx.font='600 10.5px sans-serif';ctx.fillStyle='#ffffffd0';ctx.fillText(secOf(S.d).en+'   '+FX.wx().icon,cx,y+18*K+13);ctx.shadowBlur=0;
  // fever meter (perfect streak)
  if(!fv&&S.pc>0){ctx.fillStyle='#ffe04080';for(let i=0;i<FEVER_N;i++){ctx.beginPath();ctx.arc(x0+w*.5+i*9-40,y-18*K-6,3,0,7);ctx.fillStyle=i<S.pc?'#ffe040':'#ffffff40';ctx.fill()}}
  // judgment pop above target
  const fb=S.fb;if(fb&&now-fb.at<650){const t=(now-fb.at)/650,s=t<.15?1+t*2:1.3-t*.3;ctx.save();ctx.translate(tx+30,y-80-t*14);ctx.scale(s,s);ctx.globalAlpha=1-Math.max(0,t-.6)/.4;ctx.textAlign='center';
   ctx.font='900 italic 25px sans-serif';ctx.shadowColor='#0007';ctx.shadowBlur=8;ctx.lineWidth=4;ctx.strokeStyle='#18322a';ctx.strokeText(fb.e,0,0);ctx.fillStyle=fb.c;ctx.fillText(fb.e,0,0);ctx.font='700 13px sans-serif';ctx.lineWidth=3;ctx.strokeText(fb.t,0,18);ctx.fillStyle='#fff';ctx.fillText(fb.t,0,18);ctx.restore()}
  if(!S.lastT&&me){ctx.textAlign='center';ctx.font='600 13px sans-serif';const s='Hit LEFT · RIGHT as notes reach the ring ◎',tw2=ctx.measureText(s).width+24;rr(cx-tw2/2,y-78,tw2,26,13,'rgba(20,30,28,.6)');ctx.fillStyle='#fff';ctx.fillText(s,cx,y-60)}
  ctx.restore();ctx.shadowBlur=0;ctx.textAlign='left'}
 return{sync:h=>{S.srvH=h;S.srvAt=performance.now()},_d:v=>{S.d=v},_t0:()=>S.t0,press,pos,anim,hud,reset,secOf,
  next:()=>S.notes.find(n=>!n.j),ev:()=>S.ev,fever:()=>fever(performance.now()),
  state:()=>({lvl:S.lvl,combo:S.combo,hop:S.hop,v:S.v,d:S.d,best:S.best,sent:S.sent,nP:S.nP,nG:S.nG,nM:S.nM,nH:S.nH,hops:S.hops,fevers:S.fevers,sq:S.sq,bon:S.bon,shield:S.shield,tl:S.tl.slice()}),
  score:ms=>{const sec=ms/1000,tb=Math.max(0,Math.round((360-sec)*6)),sk=S.pts-S.nM*4-S.nH;
   return{score:Math.max(0,tb+Math.max(0,sk)+S.best*3+S.bon),tb,sk:Math.max(0,sk),nP:S.nP,nG:S.nG,nM:S.nM,nH:S.nH,best:S.best,bon:S.bon,fevers:S.fevers,hops:S.hops,sq:S.sq,tl:S.tl.slice(),ms}}}})();
