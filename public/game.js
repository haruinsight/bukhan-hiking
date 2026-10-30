// 도전 모드 (북한산 전용): 자동으로 걷고, 나뭇가지·다람쥐·돌을 점프로 피한다. 산책 모드에서는 GAME.on=false.
const GAME=(()=>{
 const G={mode:localStorage.mode==='challenge'?'challenge':'walk',on:false};
 const R=n=>{const x=Math.sin(n*91.7)*43758.5453;return x-Math.floor(x)};
 const BADGES={first:['🏔️','첫 정상'],sub:['⏱️','1분 40초 이내'],nohit:['🛡️','무사고 완등'],squirrel:['🐿️','다람쥐 넘기 5회'],jump:['🦘','연속 회피 15']};
 const fmt=ms=>{const s=Math.floor(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
 const JD=720,JH=58,NAME={branch:'나뭇가지',squirrel:'다람쥐',rock:'돌'};
 let S,obs,pops,toasts,score,hits,dodged,combo,best,sq,t0,lastD,splits,result,badgePop,jumpAt,stunUntil,nextStep,startAt,failed,timer;
 function reset(){S=100;score=0;hits=0;dodged=0;combo=0;best=0;sq=0;t0=0;lastD=0;splits=[];result=null;pops=[];toasts=[];badgePop=[];jumpAt=-1e9;stunUntil=0;failed=false;
  obs=[];const L=BK.L;for(let d=95;d<L-30;){const z=BK.zoneOf(d),r=R(d*1.3);const k=r<.28?'squirrel':(z.slab||r>.68)?'rock':'branch';obs.push({d,k,state:0,at:0});d+=Math.round((55+R(d+7)*70)/10)*10}}
 G.start=()=>{G.on=G.mode==='challenge'&&mt==='bukhan';reset();clearInterval(timer);const b=document.getElementById('stepBtn');
  b.textContent=G.on?'⤴ 점프':'👣 한 걸음';b.classList.toggle('jump',G.on);if(!G.on)return;
  startAt=performance.now()+2400;nextStep=startAt;timer=setInterval(tick,40)};
 function tick(){if(!G.on||failed)return;const now=performance.now();if(now<nextStep||now<stunUntil)return;
  if(!document.getElementById('card').classList.contains('hide'))return;
  if(ws&&ws.readyState===1&&me){if(!t0)t0=Date.now();ws.send('{"t":"step"}')}const z=BK.zoneOf(lastD);nextStep=now+(z.slab?500:z.steps?440:380)}
 G.airY=now=>{if(!G.on)return 0;const t=(now-jumpAt)/JD;return t>=0&&t<1?4*t*(1-t)*JH:0};
 G.jump=()=>{const now=performance.now();if(failed){failed=false;join();return}
  if(now-jumpAt<JD||now<stunUntil||now<startAt)return;jumpAt=now};
 // 걸음 버튼은 도전 모드에서 점프 버튼
 G.tryStep=()=>{G.jump();return false};
 G.onMove=d=>{if(!G.on)return;const now=performance.now();if(d<lastD){lastD=d;return}
  for(const o of obs)if(!o.state&&o.d>lastD&&o.d<=d){
   if(now-jumpAt<JD){o.state=1;o.at=now;dodged++;combo++;best=Math.max(best,combo);if(o.k==='squirrel')sq++;const p=o.k==='squirrel'?30:20;score+=p+Math.min(combo,10)*2;pops.push({d:o.d,txt:'+'+p+(combo>2?'  연속 '+combo:''),until:now+900,c:'#fff'})}
   else{o.state=2;o.at=now;hits++;combo=0;const dmg=o.k==='rock'?30:o.k==='branch'?22:15;S=Math.max(0,S-dmg);stunUntil=now+900;G.shake=now;
    pops.push({d:o.d,txt:NAME[o.k]+'에 걸림! 체력 -'+dmg,until:now+1100,c:'#ffd0c8'});
    if(S<=0){failed=true;toasts.push({t:'체력이 바닥났어요 — 점프 버튼으로 다시 도전',until:now+1e9,c:'#c0392b'})}}}
  for(const p of BK.P.slice(1,-1))if(lastD<p[0]&&d>=p[0]&&t0){splits.push([p[2],Date.now()-t0]);toasts.push({t:p[2]+'  '+fmt(Date.now()-t0),until:now+1600,c:'#2e4a38'})}
  lastD=d};
 G.onSummit=ms=>{const got=JSON.parse(localStorage.bk_badges||'{}'),earn=[];const add=k=>{if(!got[k]){got[k]=1;earn.push(k)}};
  for(const k in got)if(!BADGES[k])delete got[k];
  add('first');if(ms<100000)add('sub');if(!hits)add('nohit');if(sq>=5)add('squirrel');if(best>=15)add('jump');
  localStorage.bk_badges=JSON.stringify(got);const pb=+localStorage.bk_pb2||0,isPB=!pb||ms<pb;if(isPB)localStorage.bk_pb2=ms;
  result={ms,score,hits,dodged,pb:isPB?ms:pb,isPB,earn,all:Object.keys(got),splits:splits.slice()};
  const now=performance.now();badgePop=earn.map((k,i)=>({k,from:now+i*1100,until:now+i*1100+1000}));
  ws.send(JSON.stringify({t:'record',score}));const r=result,bp=badgePop;reset();result=r;badgePop=bp;startAt=1e15;return earn.length?earn.length*1100+300:0};
 G.again=()=>{startAt=performance.now()+2400;nextStep=startAt};
 G.result=()=>result;
 // 길 위 장애물 (등산객보다 먼저 그림)
 G.under=now=>{if(!G.on)return;for(const o of obs){let x=BK.gx(o.d),y=BK.gy(BK.alt(o.d));if(x<-60||x>W+60)continue;
   if(o.state===1&&o.k==='squirrel'){const t=(now-o.at)/600;if(t>1)continue;x-=t*40;y-=Math.sin(t*Math.PI)*30}
   ctx.save();if(o.state===2){const t=Math.min(1,(now-o.at)/400);ctx.globalAlpha=1-t*.5;ctx.translate(x+t*18,y);ctx.rotate(t*.5);ctx.translate(-x,-y)}
   const near=!o.state&&x>BK.gx(lastD)&&x-BK.gx(lastD)<140;if(near){ctx.fillStyle='#ffdd5555';ctx.beginPath();ctx.ellipse(x,y+2,26,7,0,0,7);ctx.fill()}
   draw1(o.k,x,y,now);ctx.restore()}};
 function draw1(k,x,y,now){ctx.save();ctx.translate(x,y);
  if(k==='rock'){ctx.fillStyle='#0003';ctx.beginPath();ctx.ellipse(2,1,22,5,0,0,7);ctx.fill();
   const g=ctx.createLinearGradient(0,-26,0,0);g.addColorStop(0,'#c9c4b8');g.addColorStop(1,'#7d776c');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-20,1);ctx.lineTo(-17,-14);ctx.lineTo(-6,-25);ctx.lineTo(9,-23);ctx.lineTo(19,-11);ctx.lineTo(21,1);ctx.closePath();ctx.fill();
   ctx.strokeStyle='#5e594f';ctx.lineWidth=1.5;ctx.stroke();ctx.strokeStyle='#ffffff55';ctx.beginPath();ctx.moveTo(-12,-15);ctx.lineTo(-4,-21);ctx.lineTo(6,-20);ctx.stroke();
   ctx.strokeStyle='#5e594f88';ctx.beginPath();ctx.moveTo(2,-12);ctx.lineTo(8,-4);ctx.stroke();ctx.fillStyle='#6f8f4a';ctx.beginPath();ctx.ellipse(-14,0,6,2.5,0,0,7);ctx.fill()}
  else if(k==='branch'){ctx.fillStyle='#0003';ctx.beginPath();ctx.ellipse(0,1,30,4,0,0,7);ctx.fill();ctx.lineCap='round';
   ctx.strokeStyle='#5a3d24';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-30,-3);ctx.quadraticCurveTo(0,-12,30,-6);ctx.stroke();
   ctx.strokeStyle='#7a5434';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-27,-5);ctx.quadraticCurveTo(0,-14,28,-8);ctx.stroke();
   ctx.strokeStyle='#5a3d24';ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(-8,-9);ctx.lineTo(-16,-24);ctx.moveTo(10,-9);ctx.lineTo(20,-26);ctx.moveTo(15,-20);ctx.lineTo(10,-30);ctx.stroke();
   ctx.fillStyle='#4f7a3a';for(const[a,b]of[[-17,-26],[21,-28],[9,-32],[-13,-21]]){ctx.beginPath();ctx.ellipse(a,b,5,2.6,.6,0,7);ctx.fill()}}
  else{const tw=Math.sin(now/180)*.25;ctx.fillStyle='#0003';ctx.beginPath();ctx.ellipse(0,1,16,3.5,0,0,7);ctx.fill();
   ctx.fillStyle='#8a5530';ctx.save();ctx.translate(-9,-10);ctx.rotate(-.5+tw);ctx.beginPath();ctx.ellipse(-4,-10,7,13,-.2,0,7);ctx.fill();ctx.fillStyle='#b07a4a';ctx.beginPath();ctx.ellipse(-3,-11,3.5,9,-.2,0,7);ctx.fill();ctx.restore();
   ctx.fillStyle='#9a6035';ctx.beginPath();ctx.ellipse(2,-9,10,8,0,0,7);ctx.fill();ctx.beginPath();ctx.arc(11,-17,6.5,0,7);ctx.fill();
   ctx.fillStyle='#f1dcc0';ctx.beginPath();ctx.ellipse(6,-7,4,5,0,0,7);ctx.fill();ctx.fillStyle='#3a2a1c';ctx.beginPath();ctx.moveTo(-2,-14);ctx.lineTo(8,-13);ctx.lineTo(-2,-12);ctx.fill();
   ctx.fillStyle='#9a6035';ctx.beginPath();ctx.moveTo(8,-22);ctx.lineTo(9,-28);ctx.lineTo(12,-23);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(13,-18,1.6,0,7);ctx.fill();
   ctx.fillStyle='#6b3f22';ctx.fillRect(-4,-2,4,3);ctx.fillRect(6,-2,4,3)}
  ctx.restore()}
 G.draw=now=>{if(!G.on)return;const dt=Math.min(.1,(now-(G._t||now))/1000);G._t=now;if(!failed)S=Math.min(100,S+dt*1.5);
  ctx.textAlign='center';for(const p of pops){if(now>p.until)continue;const a=(p.until-now)/1000;ctx.globalAlpha=Math.min(1,a);ctx.font='bold 15px sans-serif';ctx.fillStyle=p.c;ctx.strokeStyle='#000a';ctx.lineWidth=3;const x=BK.gx(p.d),y=BK.gy(BK.alt(p.d))-100-(1-a)*24;ctx.strokeText(p.txt,x,y);ctx.fillText(p.txt,x,y);ctx.globalAlpha=1}
  const y=146,sh=now-(G.shake||0)<300?Math.sin(now/20)*3:0;ctx.fillStyle='#00000055';ctx.beginPath();ctx.roundRect(14+sh,y,W-28,30,15);ctx.fill();
  ctx.fillStyle='#ffffff33';ctx.beginPath();ctx.roundRect(24+sh,y+11,W*.36,8,4);ctx.fill();ctx.fillStyle=S<25?'#ff6b5a':S<50?'#ffc94a':'#7be08f';ctx.beginPath();ctx.roundRect(24+sh,y+11,W*.36*S/100,8,4);ctx.fill();
  ctx.font='600 12px sans-serif';ctx.fillStyle='#fff';ctx.textAlign='right';ctx.fillText('⏱ '+fmt(t0?Date.now()-t0:0)+'   ★ '+score+'   💥 '+hits,W-24,y+20);
  if(now<startAt&&startAt<1e14){const n=Math.ceil((startAt-now)/800);ctx.fillStyle='#0006';ctx.beginPath();ctx.roundRect(W/2-150,H*.34,300,96,20);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='bold 40px sans-serif';ctx.fillText(n,W/2,H*.34+46);ctx.font='600 14px sans-serif';ctx.fillText('자동으로 걸어요 · 장애물은 점프!',W/2,H*.34+78)}
  if(stunUntil>now){ctx.font='bold 22px sans-serif';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText('💫',BK.gx(lastD),BK.gy(BK.alt(lastD))-80)}
  toasts=toasts.filter(t=>now<t.until);toasts.slice(-1).forEach(t=>{ctx.font='bold 14px sans-serif';const w=ctx.measureText(t.t).width+28;ctx.fillStyle=t.c;ctx.beginPath();ctx.roundRect(W/2-w/2,y+40,w,30,15);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(t.t,W/2,y+60)});
  for(const b of badgePop){if(now<b.from||now>b.until)continue;const t=(now-b.from)/1000,sc=t<.2?t/.2*1.15:t<.3?1.15-(t-.2):1,a=t>.8?(1-t)/.2:1;ctx.globalAlpha=a;ctx.fillStyle='#0007';ctx.fillRect(0,0,W,H);
   ctx.save();ctx.translate(W/2,H*.42);ctx.scale(sc,sc);ctx.fillStyle='#fffaf0';ctx.beginPath();ctx.arc(0,0,64,0,7);ctx.fill();ctx.strokeStyle='#f0a030';ctx.lineWidth=6;ctx.stroke();ctx.font='56px sans-serif';ctx.textAlign='center';ctx.fillText(BADGES[b.k][0],0,20);ctx.restore();
   ctx.font='bold 20px sans-serif';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText('배지 획득!  '+BADGES[b.k][1],W/2,H*.42+100);ctx.globalAlpha=1}
  ctx.textAlign='left'};
 // 인증카드 추가 정보 (도전 모드만)
 G.card=x=>{const r=result;if(!r)return;x.fillStyle='#ffffffe8';x.beginPath();x.roundRect(90,690,900,290,40);x.fill();x.textAlign='center';x.fillStyle='#333';
  x.font='bold 30px sans-serif';x.fillText('도전 모드 기록',540,745);x.font='bold 72px sans-serif';x.fillText(fmt(r.ms),340,840);x.fillStyle='#f0602a';x.fillText('★ '+r.score,740,840);
  x.fillStyle='#777';x.font='28px sans-serif';x.fillText(r.isPB?'🎉 개인 최고기록!':'최고기록 '+fmt(r.pb),340,885);x.fillText('피함 '+r.dodged+' · 부딪힘 '+r.hits,740,885);
  x.font='40px sans-serif';const all=r.all;all.forEach((k,i)=>x.fillText(BADGES[k][0],540+(i-(all.length-1)/2)*70,950))};
 G.rankHTML=list=>'<b>오늘의 순위 (북한산)</b>'+list.map((r,i)=>`<div>${i+1}. ${r.name.replace(/[<>&]/g,'')} <span>${fmt(r.ms)} · ★${r.score}</span></div>`).join('');
 return G})();
