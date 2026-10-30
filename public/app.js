const MTS={bukhan:{name:'북한산',h:836},halla:{name:'한라산',h:1947},jiri:{name:'지리산',h:1915},seorak:{name:'설악산',h:1708},deogyu:{name:'덕유산',h:1614}};
let ctx;const $=id=>document.getElementById(id),cv=$('cv');ctx=cv.getContext('2d');
let W,H,DPR,ws,me=null,mt='halla',mount=null,players=[],room=1,cam=0,camT=0,walk={},lastH={},today=0,clouds=[];
const COL=['#e8553b','#3a7bd5','#f2b632','#8e5bd6','#2aa876','#ff7aa8'];
for(let i=0;i<6;i++)clouds.push({x:Math.random(),y:Math.random(),s:.6+Math.random()*.8});
// 산 선택
mt=localStorage.mt||'bukhan';$('nick').value=localStorage.nick||'';
$('mts').innerHTML=Object.entries(MTS).sort((x,y)=>(y[0]==='bukhan')-(x[0]==='bukhan')).map(([k,v])=>`<button data-k="${k}">${v.name}<small>${k==='bukhan'?'백운대 코스 1.9km':v.h.toLocaleString()+'m'}</small></button>`).join('');
const mark=()=>[...$('mts').children].forEach(b=>b.classList.toggle('on',b.dataset.k===mt));mark();
$('mts').onclick=e=>{const b=e.target.closest('button');if(b){mt=b.dataset.k;mark()}};
$('modes').onclick=e=>{const b=e.target.closest('button');if(!b)return;GAME.mode=b.dataset.m;localStorage.mode=GAME.mode;markM()};const markM=()=>[...$('modes').children].forEach(b=>b.classList.toggle('on',b.dataset.m===GAME.mode));markM();
$('go').onclick=()=>{localStorage.mt=mt;localStorage.nick=$('nick').value;$('pick').classList.add('hide');connect()};
$('chg').onclick=()=>$('pick').classList.remove('hide');
function connect(){if(ws&&ws.readyState===1)return join();ws=new WebSocket((location.protocol==='https:'?'wss://':'ws://')+location.host);ws.onopen=join;ws.onmessage=onMsg;ws.onclose=()=>setTimeout(connect,1500)}
function join(){RH.reset();today=+(localStorage['t_'+mt+'_'+dayKey()]||0);GAME.start();ws.send(JSON.stringify({t:'join',mt,name:$('nick').value,mode:GAME.on?'challenge':'walk'}))}
const dayKey=()=>new Date().toLocaleDateString('sv');
function onMsg(e){const d=JSON.parse(e.data);
 if(d.t==='hello'){me=d.id;mount=d.mount;room=d.room;$('mtName').textContent='⛰️ '+mount.name;$('goal').textContent='정상 '+mount.h.toLocaleString()+'m'}
 if(d.t==='state'){players=d.players;for(const p of players){if(lastH[p.id]!==undefined&&p.h>lastH[p.id])walk[p.id]=performance.now();lastH[p.id]=p.h}
  {const mm=players.find(p=>p.id===me);if(mm&&GAME.on)GAME.onMove(mm.h)}
  const m=players.find(p=>p.id===me);$('who').textContent=`${room}번 방 · 함께 ${players.length}/100명`;if(m){if(mount.course){const e=BK.alt(m.h);$('myH').textContent=Math.round(e)+'m';$('goal').textContent=(m.h/1000).toFixed(2)+' / '+(BK.L/1000).toFixed(1)+'km'}else $('myH').textContent=m.h.toLocaleString()+'m';$('barI').style.width=(m.h/mount.h*100)+'%'}}
 if(d.t==='summit'){RH.reset();today++;localStorage['t_'+mt+'_'+dayKey()]=today;if(GAME.on){const w=GAME.onSummit(d.ms);setTimeout(showCard,w)}else showCard()}
 if(d.t==='rank'&&GAME.on){$('rank').innerHTML=GAME.rankHTML(d.list);$('rank').classList.remove('hide')}}
const step=()=>{if(ws&&ws.readyState===1&&me&&$('card').classList.contains('hide')){if(GAME.on&&!GAME.tryStep())return;ws.send('{"t":"step"}')}};
$('stepBtn').onclick=step;onkeydown=e=>{if(e.repeat)return;if(GAME.on){if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();step()}return}if(e.code==='ArrowLeft'||e.code==='KeyA'){e.preventDefault();RH.press('L');ft('lf')}if(e.code==='ArrowRight'||e.code==='KeyD'){e.preventDefault();RH.press('R');ft('rf')}};
const ft=id=>{const b=$(id);b.classList.add('dn');setTimeout(()=>b.classList.remove('dn'),90)};
for(const[id,f]of[['lf','L'],['rf','R']])$(id).addEventListener('pointerdown',e=>{e.preventDefault();RH.press(f);ft(id)});cv.addEventListener('pointerdown',()=>{if(GAME.on&&$('card').classList.contains('hide'))GAME.jump()});
// 화면
function resize(){DPR=devicePixelRatio||1;W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0)}addEventListener('resize',resize);resize();
const WORLD=()=>H*2.2; // 산 전체 높이(px)
// 등산로: t(0~1) -> 월드좌표 (지그재그)
function trail(t){const y=t*WORLD();const x=W*(.5+.3*Math.sin(t*Math.PI*7)*(1-t*.85));return{x,y}}
function ridge(seed,amp,base,col,par){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,H);for(let x=0;x<=W;x+=8){const n=Math.sin(x*.012+seed)*.5+Math.sin(x*.031+seed*2)*.3+Math.sin(x*.07+seed*3)*.15;ctx.lineTo(x,base+cam*par+n*amp)}ctx.lineTo(W,H);ctx.fill()}
function sy(wy){return H*.68-(wy-cam)} // 월드 y -> 화면 y
function draw(now){requestAnimationFrame(draw);if(mount&&mount.course){PX.draw(now);if(GAME.on)GAME.draw(now);return}
 const m=players.find(p=>p.id===me),pr=m&&mount?m.h/mount.h:0;camT=pr*WORLD();cam+=(camT-cam)*.08;
 const k=Math.min(1,cam/WORLD());
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,`hsl(${215-k*15},${60+k*10}%,${55-k*25}%)`);g.addColorStop(1,`hsl(${30+k*170},80%,${82-k*20}%)`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.fillStyle='#fff9e0';ctx.beginPath();ctx.arc(W*.8,H*.14+k*20,26,0,7);ctx.fill();
 ctx.fillStyle='#ffffffcc';for(const c of clouds){const x=((c.x*W+now*.01*c.s)%(W+160))-80,y=c.y*H*.45+cam*.05;ctx.beginPath();ctx.ellipse(x,y,40*c.s,14*c.s,0,0,7);ctx.ellipse(x+22*c.s,y-8*c.s,26*c.s,14*c.s,0,0,7);ctx.fill()}
 ridge(1,40,H*.42,'#9db7d6',.02);ridge(4,50,H*.52,'#7d9cbf',.05);ridge(7,55,H*.62,'#5f8a8c',.1);
 // 산 본체(가까운 산)
 const topY=sy(WORLD());ctx.fillStyle='#4f8a4a';ctx.beginPath();ctx.moveTo(-40,H);ctx.lineTo(-40,sy(0)-40);
 for(let t=0;t<=1.001;t+=.01){const w=W*(.75-.55*t),y=sy(t*WORLD());ctx.lineTo(W/2-w,y)}
 for(let t=1;t>=0;t-=.01){const w=W*(.75-.55*t),y=sy(t*WORLD());ctx.lineTo(W/2+w,y)}ctx.lineTo(W+40,sy(0)-40);ctx.lineTo(W+40,H);ctx.fill();
 // 나무
 for(let i=0;i<60;i++){const t=(i*.6180339)%1*.92,side=i%2?1:-1,w=W*(.75-.55*t),x=W/2+side*w*(.45+(i*.37)%1*.5),y=sy(t*WORLD());if(y<-30||y>H+30)continue;tree(x,y,.7+(i%3)*.2)}
 // 눈 덮인 정상
 ctx.fillStyle='#f4f7fb';ctx.beginPath();ctx.moveTo(W/2,topY-50);ctx.lineTo(W/2-W*.2-6,topY+4);ctx.lineTo(W/2-30,topY-6);ctx.lineTo(W/2,topY+6);ctx.lineTo(W/2+28,topY-8);ctx.lineTo(W/2+W*.2+6,topY+4);ctx.closePath();ctx.fill();
 // 등산로
 ctx.strokeStyle='#d9b77e';ctx.lineWidth=14;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();for(let t=0;t<=1.0001;t+=.004){const p=trail(t);ctx.lineTo(p.x,sy(p.y))}ctx.stroke();
 ctx.strokeStyle='#ead2a2';ctx.lineWidth=4;ctx.setLineDash([6,10]);ctx.stroke();ctx.setLineDash([]);
 // 높이 표지
 if(mount)for(let h=500;h<mount.h;h+=500){const p=trail(h/mount.h);const y=sy(p.y);if(y<0||y>H)continue;ctx.fillStyle='#6b4a2b';ctx.fillRect(p.x+16,y-22,4,22);ctx.fillStyle='#fff';ctx.fillRect(p.x+8,y-36,44,16);ctx.fillStyle='#333';ctx.font='bold 11px sans-serif';ctx.fillText(h+'m',p.x+12,y-24)}
 // 정상 깃발
 const fp=trail(1),fy=sy(fp.y)-46;ctx.fillStyle='#555';ctx.fillRect(fp.x-2,fy-40,4,46);const wv=Math.sin(now/200)*4;ctx.fillStyle='#e8433b';ctx.beginPath();ctx.moveTo(fp.x+2,fy-40);ctx.quadraticCurveTo(fp.x+20,fy-36+wv,fp.x+36,fy-30);ctx.lineTo(fp.x+2,fy-20);ctx.fill();
 if(mount){ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';ctx.fillText(mount.name+' 정상',fp.x,fy-48);ctx.textAlign='left'}
 // 등산객 (나 마지막에)
 const placed=[];const list=[...players].sort((a,b)=>(a.id===me)-(b.id===me));
 for(const p of list){if(!mount)break;const t=p.h/mount.h,q=trail(t),off=p.id===me?0:((p.id*53)%70-35);const y=sy(q.y);if(y<-60||y>H+60)continue;hiker(q.x+off,y,p,now,placed)}
}
function tree(x,y,s){ctx.fillStyle='#6b4a2b';ctx.fillRect(x-2*s,y-8*s,4*s,8*s);ctx.fillStyle='#2f6b3a';ctx.beginPath();ctx.moveTo(x,y-38*s);ctx.lineTo(x-13*s,y-8*s);ctx.lineTo(x+13*s,y-8*s);ctx.fill();ctx.fillStyle='#3b7f45';ctx.beginPath();ctx.moveTo(x,y-46*s);ctx.lineTo(x-9*s,y-24*s);ctx.lineTo(x+9*s,y-24*s);ctx.fill()}
function hiker(x,y,p,now,placed){const mine=p.id===me,s=mine?1.35:.95,since=now-(walk[p.id]||-1e9),moving=since<350,ph=moving?Math.sin(since/40):0,bob=moving?Math.abs(ph)*3:Math.sin(now/600+p.id)*1;
 ctx.save();ctx.translate(x,y-bob);ctx.scale(s,s);
 if(mine){ctx.fillStyle='#fff5';ctx.beginPath();ctx.ellipse(0,0,22,7,0,0,7);ctx.fill()}
 ctx.fillStyle='#0003';ctx.beginPath();ctx.ellipse(0,bob/s,12,4,0,0,7);ctx.fill();
 const c=COL[p.c%6];
 ctx.strokeStyle='#3a3a4a';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-3,-12);ctx.lineTo(-3+ph*5,0);ctx.moveTo(3,-12);ctx.lineTo(3-ph*5,0);ctx.stroke(); // 다리
 ctx.fillStyle='#8a5a2b';ctx.beginPath();ctx.roundRect(-14,-30,10,17,4);ctx.fill(); // 배낭
 ctx.fillStyle=c;ctx.beginPath();ctx.roundRect(-8,-28,16,18,6);ctx.fill(); // 몸
 ctx.strokeStyle='#6b4a2b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(9,-22);ctx.lineTo(14+ph*2,1);ctx.stroke(); // 지팡이
 ctx.fillStyle='#ffd9b3';ctx.beginPath();ctx.arc(0,-37,10,0,7);ctx.fill(); // 얼굴
 ctx.fillStyle='#222';ctx.beginPath();ctx.arc(-3.5,-37,1.6,0,7);ctx.arc(3.5,-37,1.6,0,7);ctx.fill();ctx.fillStyle='#ff9a9a';ctx.beginPath();ctx.arc(-6.5,-33.5,2,0,7);ctx.arc(6.5,-33.5,2,0,7);ctx.fill();
 ctx.fillStyle=mine?'#ffcf33':'#f1efe6';ctx.beginPath();ctx.ellipse(0,-43,14,3.5,0,0,7);ctx.fill();ctx.beginPath();ctx.arc(0,-44,8.5,Math.PI,0);ctx.fill(); // 모자
 ctx.restore();
 const ly0=y-46*(mine?1.35:.95)-14;if(!mine&&placed.some(q=>Math.abs(q[0]-x)<70&&Math.abs(q[1]-ly0)<20))return;placed.push([x,ly0]);ctx.font=(mine?'bold 13px':'11px')+' sans-serif';ctx.textAlign='center';const label=(mine?'나 · ':'')+p.name;const tw=ctx.measureText(label).width+12,ly=y-bob-46*s-14;
 ctx.fillStyle=mine?'#f0602a':'#0007';ctx.beginPath();ctx.roundRect(x-tw/2,ly-14,tw,18,9);ctx.fill();ctx.fillStyle='#fff';ctx.fillText(label,x,ly);ctx.textAlign='left'}
requestAnimationFrame(draw);
// 인증 카드
function makeCard(){const c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d');
 if(mount.course)BK.card(x);else{const g=x.createLinearGradient(0,0,0,1350);g.addColorStop(0,'#ff9e6d');g.addColorStop(.45,'#ffd49a');g.addColorStop(1,'#4f8a4a');x.fillStyle=g;x.fillRect(0,0,1080,1350);
 x.fillStyle='#fff6d8';x.beginPath();x.arc(540,560,130,0,7);x.fill();
 const rg=(b,a,col,sd)=>{x.fillStyle=col;x.beginPath();x.moveTo(0,1350);for(let i=0;i<=1080;i+=10)x.lineTo(i,b+Math.sin(i*.008+sd)*a+Math.sin(i*.021+sd)*a*.4);x.lineTo(1080,1350);x.fill()};
 rg(720,50,'#b98ba0',1);rg(800,60,'#7d7fa6',3);
 x.fillStyle='#3f6f3f';x.beginPath();x.moveTo(0,1350);x.lineTo(0,1100);x.lineTo(540,640);x.lineTo(1080,1100);x.lineTo(1080,1350);x.fill();
 x.fillStyle='#f4f7fb';x.beginPath();x.moveTo(540,640);x.lineTo(450,718);x.lineTo(500,705);x.lineTo(540,725);x.lineTo(585,702);x.lineTo(630,718);x.fill();
 x.fillStyle='#555';x.fillRect(537,520,6,125);x.fillStyle='#e8433b';x.beginPath();x.moveTo(543,520);x.lineTo(620,545);x.lineTo(543,575);x.fill();
 }x.fillStyle='#fff';x.textAlign='center';x.font='bold 64px sans-serif';x.fillText('정상 인증',540,150);
 const CN=mount.course?'북한산 백운대':mount.name,CH=mount.course?836:mount.h;x.font='bold '+(CN.length>4?96:120)+'px sans-serif';x.fillText(CN,540,300);x.font='bold 56px sans-serif';x.fillText(CH.toLocaleString()+'m',540,380);
 if(GAME.on)GAME.card(x);x.textAlign='center';x.fillStyle='#fffffff0';x.beginPath();x.roundRect(90,1000,900,270,40);x.fill();x.fillStyle='#333';
 const nm=(players.find(p=>p.id===me)||{}).name||'';const d=new Date();
 x.font='bold 60px sans-serif';x.fillText(nm,540,1085);x.font='44px sans-serif';x.fillText(`${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`,540,1160);
 x.fillStyle='#f0602a';x.font='bold 48px sans-serif';x.fillText(`오늘 정상 ${today}번째 🏁`,540,1235);
 x.fillStyle='#fff';x.font='32px sans-serif';x.fillText('같이 등산 ⛰️ 함께 오르는 온라인 산',540,1330);return c}
let cardCv;
function showCard(){cardCv=makeCard();$('cardImg').src=cardCv.toDataURL('image/png');$('card').classList.remove('hide')}
$('save').onclick=()=>{const a=document.createElement('a');a.href=cardCv.toDataURL('image/png');a.download=`${mount.course?'북한산백운대':mount.name}_정상인증_${dayKey()}.png`;a.click()};
$('share').onclick=()=>cardCv.toBlob(async b=>{const f=new File([b],'summit.png',{type:'image/png'}),txt=`${mount.course?'북한산 백운대':mount.name} ${mount.course?836:mount.h}m 정상 찍었다! 오늘 ${today}번째 ⛰️`;
 try{if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],text:txt,url:location.href});else if(navigator.share)await navigator.share({text:txt,url:location.href});else{await navigator.clipboard.writeText(txt+' '+location.href);alert('공유 문구를 복사했어요!')}}catch(e){}});
$('again').onclick=()=>{$('card').classList.add('hide');if(GAME.on)GAME.again()};
