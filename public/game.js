// 도전 모드 (북한산 전용). 산책 모드에서는 GAME.on=false 라 아무것도 하지 않음.
const GAME=(()=>{
 const G={mode:localStorage.mode==='challenge'?'challenge':'walk',on:false};
 const R=n=>{const x=Math.sin(n*91.7)*43758.5453;return x-Math.floor(x)};
 const BADGES={first:['🏔️','첫 정상'],sub10:['⏱️','10분 이내'],clean:['♻️','클린하이커'],norest:['💪','무휴식'],squirrel:['🐿️','다람쥐 친구']};
 const fmt=ms=>{const s=Math.floor(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
 let S,items,pops,toasts,score,trash,tired,t0,lastD,lastStep,splits,squ,result,badgePop;
 function reset(){S=100;score=0;trash=0;tired=false;t0=0;lastD=0;lastStep=0;splits=[];squ=0;result=null;pops=[];toasts=[];badgePop=[];
  items=[];for(let i=0,d=60;d<1870;d+=42,i++){const z=BK.zoneOf(d),r=R(d);let k=i%3===0?'trash':r<.22?'water':r<.7?(d<800&&r<.45?'acorn':'leaf'):null;if(k)items.push({d,k,got:false})}
  for(const d of[480,1060])items.push({d,k:'squirrel',got:false})}
 G.start=()=>{G.on=G.mode==='challenge'&&mt==='bukhan';reset()};
 // 걸음 시도: 체력이 모자라면 거절
 G.tryStep=()=>{const now=performance.now(),z=BK.zoneOf(lastD);let c=z.slab?6:z.steps?4.5:3;if(now-lastStep<170)c*=2;
  if(S<c){tired=true;toasts.push({t:'헉헉… 잠깐 쉬어요',until:now+900,c:'#c0392b'});G.shake=now;return false}
  S-=c;lastStep=now;if(!t0)t0=Date.now();return true};
 G.onMove=d=>{if(!G.on)return;const now=performance.now();
  for(const it of items)if(!it.got&&it.d>lastD-1&&it.d<=d+2){it.got=true;
   const pts={acorn:10,leaf:10,trash:30,water:0,squirrel:50}[it.k];score+=pts;if(it.k==='trash')trash++;if(it.k==='water')S=Math.min(100,S+40);if(it.k==='squirrel')squ++;
   pops.push({d:it.d,txt:it.k==='water'?'체력 +40':it.k==='squirrel'?'다람쥐가 도토리를! +50':'+'+pts,until:now+900})}
  for(const p of BK.P.slice(1,-1))if(lastD<p[0]&&d>=p[0]&&t0){splits.push([p[2],Date.now()-t0]);toasts.push({t:p[2]+'  '+fmt(Date.now()-t0),until:now+1600,c:'#2e4a38'})}
  lastD=d};
 G.onSummit=ms=>{const got=JSON.parse(localStorage.bk_badges||'{}'),earn=[];const add=k=>{if(!got[k]){got[k]=1;earn.push(k)}};
  add('first');if(ms<600000)add('sub10');if(trash>=10)add('clean');if(!tired)add('norest');if(squ>=2)add('squirrel');
  localStorage.bk_badges=JSON.stringify(got);const pb=+localStorage.bk_pb||0,isPB=!pb||ms<pb;if(isPB)localStorage.bk_pb=ms;
  result={ms,score,trash,pb:isPB?ms:pb,isPB,earn,all:Object.keys(got),splits:splits.slice()};
  const now=performance.now();badgePop=earn.map((k,i)=>({k,from:now+i*1100,until:now+i*1100+1000}));
  ws.send(JSON.stringify({t:'record',score}));const r=result,bp=badgePop;reset();result=r;badgePop=bp;return earn.length?earn.length*1100+300:0};
 G.result=()=>result;
 G.draw=now=>{if(!G.on)return;const dt=Math.min(.1,(now-(G._t||now))/1000);G._t=now;S=Math.min(100,S+dt*(now-lastStep>400?30:12));
  const me_=players.find(p=>p.id===me),myD=me_?me_.h:0;
  // 길 위 수집품
  for(const it of items){if(it.got)continue;const x=BK.gx(it.d),y=BK.gy(BK.alt(it.d))-10+Math.sin(now/300+it.d)*2;if(x<-20||x>W+20)continue;icon(it.k,x,y)}
  ctx.textAlign='center';for(const p of pops){if(now>p.until)continue;const a=(p.until-now)/900;ctx.globalAlpha=a;ctx.font='bold 13px sans-serif';ctx.fillStyle='#fff';ctx.strokeStyle='#0008';ctx.lineWidth=3;const x=BK.gx(p.d),y=BK.gy(BK.alt(p.d))-90-(1-a)*24;ctx.strokeText(p.txt,x,y);ctx.fillText(p.txt,x,y);ctx.globalAlpha=1}
  // HUD: 체력 · 시간 · 점수
  const y=146,sh=now-(G.shake||0)<300?Math.sin(now/20)*3:0;ctx.fillStyle='#00000055';ctx.beginPath();ctx.roundRect(14+sh,y,W-28,30,15);ctx.fill();
  ctx.fillStyle='#ffffff33';ctx.beginPath();ctx.roundRect(24+sh,y+11,W*.42,8,4);ctx.fill();ctx.fillStyle=S<25?'#ff6b5a':S<50?'#ffc94a':'#7be08f';ctx.beginPath();ctx.roundRect(24+sh,y+11,W*.42*S/100,8,4);ctx.fill();
  ctx.font='600 12px sans-serif';ctx.fillStyle='#fff';ctx.textAlign='right';ctx.fillText('⏱ '+fmt(t0?Date.now()-t0:0)+'   ★ '+score+'   ♻ '+trash,W-24,y+20);
  // 안내/스플릿 토스트
  toasts=toasts.filter(t=>now<t.until);toasts.slice(-1).forEach(t=>{ctx.font='bold 14px sans-serif';const w=ctx.measureText(t.t).width+28;ctx.fillStyle=t.c;ctx.beginPath();ctx.roundRect(W/2-w/2,y+40,w,30,15);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(t.t,W/2,y+60)});
  // 배지 획득 연출
  for(const b of badgePop){if(now<b.from||now>b.until)continue;const t=(now-b.from)/1000,sc=t<.2?t/.2*1.15:t<.3?1.15-(t-.2):1,a=t>.8?(1-t)/.2:1;ctx.globalAlpha=a;ctx.fillStyle='#0007';ctx.fillRect(0,0,W,H);
   ctx.save();ctx.translate(W/2,H*.42);ctx.scale(sc,sc);ctx.fillStyle='#fffaf0';ctx.beginPath();ctx.arc(0,0,64,0,7);ctx.fill();ctx.strokeStyle='#f0a030';ctx.lineWidth=6;ctx.stroke();ctx.font='56px sans-serif';ctx.textAlign='center';ctx.fillText(BADGES[b.k][0],0,20);ctx.restore();
   ctx.font='bold 20px sans-serif';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText('배지 획득!  '+BADGES[b.k][1],W/2,H*.42+100);ctx.globalAlpha=1}
  ctx.textAlign='left'};
 function icon(k,x,y){ctx.save();ctx.translate(x,y);
  if(k==='water'){ctx.fillStyle='#9fd6f5';ctx.beginPath();ctx.roundRect(-4,-10,8,14,3);ctx.fill();ctx.fillStyle='#3a7bd5';ctx.fillRect(-2.5,-13,5,3)}
  else if(k==='acorn'){ctx.fillStyle='#a8692f';ctx.beginPath();ctx.ellipse(0,0,4.5,5.5,0,0,7);ctx.fill();ctx.fillStyle='#6b4423';ctx.beginPath();ctx.arc(0,-3,5,Math.PI,0);ctx.fill()}
  else if(k==='leaf'){ctx.fillStyle='#d2462c';ctx.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2+(i-2)*.6;ctx.lineTo(Math.cos(a)*7,Math.sin(a)*7);ctx.lineTo(Math.cos(a+.3)*3,Math.sin(a+.3)*3)}ctx.fill()}
  else if(k==='trash'){ctx.fillStyle='#e8e8e8';ctx.beginPath();ctx.moveTo(-5,3);ctx.lineTo(-3,-8);ctx.lineTo(4,-8);ctx.lineTo(5,3);ctx.fill();ctx.fillStyle='#4a90d9';ctx.fillRect(-4,-4,8,3)}
  else if(k==='squirrel'){ctx.fillStyle='#9a6035';ctx.beginPath();ctx.ellipse(0,0,5,4,0,0,7);ctx.arc(4,-4,3,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(-6,-5,3.5,6,-.4,0,7);ctx.fill()}
  ctx.restore()}
 // 인증카드 추가 정보 (도전 모드만)
 G.card=x=>{const r=result;if(!r)return;x.fillStyle='#ffffffe8';x.beginPath();x.roundRect(90,690,900,290,40);x.fill();x.textAlign='center';x.fillStyle='#333';
  x.font='bold 30px sans-serif';x.fillText('도전 모드 기록',540,745);x.font='bold 72px sans-serif';x.fillText(fmt(r.ms),340,840);x.fillStyle='#f0602a';x.fillText('★ '+r.score,740,840);
  x.fillStyle='#777';x.font='28px sans-serif';x.fillText(r.isPB?'🎉 개인 최고기록!':'최고기록 '+fmt(r.pb),340,885);x.fillText('쓰레기 '+r.trash+'개 수거',740,885);
  x.font='40px sans-serif';const all=r.all;all.forEach((k,i)=>x.fillText(BADGES[k][0],540+(i-(all.length-1)/2)*70,950))};
 G.rankHTML=list=>'<b>오늘의 순위 (북한산)</b>'+list.map((r,i)=>`<div>${i+1}. ${r.name.replace(/[<>&]/g,'')} <span>${fmt(r.ms)} · ★${r.score}</span></div>`).join('');
 return G})();
