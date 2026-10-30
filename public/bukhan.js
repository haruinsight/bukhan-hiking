// 북한산 백운대 코스 – 설정은 mountains.js (MOUNTAINS.bukhan)
const BK=(()=>{
 const C=MOUNTAINS.bukhan,P=C.pts,L=P.at(-1)[0],TOP=P.at(-1)[1],PX=3.2,VS=4.2;
 const alt0=d=>{d=Math.max(0,Math.min(L,d));for(let i=1;i<P.length;i++)if(d<=P[i][0]){const a=P[i-1],b=P[i],t=(d-a[0])/(b[0]-a[0]),s=t*t*(3-2*t);return a[1]+(b[1]-a[1])*s}return TOP};
 const alt=d=>alt0(d)+(d<1870&&d>0?Math.sin(d*.05)*2.5+Math.sin(d*.013)*4:0);
 const spot=d=>{let n=P[0][2];for(const p of P)if(d>=p[0]-30)n=p[2];return n};
 const zoneOf=d=>C.zones.find(z=>d<z.to)||C.zones.at(-1);
 const R=n=>{const x=Math.sin(n*127.1)*43758.5453;return x-Math.floor(x)}; // 고정 난수
 const mix=(a,b,t)=>{const p=s=>[1,3,5].map(i=>parseInt(s.substr(i,2),16)),A=p(a),B=p(b);return'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'};
 // 구간 경계에서 색을 부드럽게 섞기
 const zcol=(d,key)=>{const Z=C.zones;let i=Z.findIndex(z=>d<z.to);if(i<0)i=Z.length-1;const z=Z[i],n=Z[i+1],e=z.to-d;return n&&e<120?mix(z[key],n[key],1-e/120):z[key]};
 let camX=0,camY=P[0][1];
 const gx=d=>W*.4+(d-camX)*PX, gy=a=>H*.72-(a-camY)*VS, dAt=sx=>camX+(sx-W*.4)/PX;
 const ground=d=>d>L?TOP-(d-L)*1.4:d<0?P[0][1]+d*.1:alt(d);

 function sky(k,now){const g=ctx.createLinearGradient(0,0,0,H*.75);g.addColorStop(0,mix('#7fa9d1','#5f8fc4',k));g.addColorStop(1,'#efe6d6');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#fff8e4';ctx.globalAlpha=.9;ctx.beginPath();ctx.arc(W*.8,H*.14,20,0,7);ctx.fill();ctx.globalAlpha=1;
  ctx.fillStyle='#ffffff8a';for(const c of clouds){const x=((c.x*W+now*.006*c.s)%(W+200))-100,y=c.y*H*.22+60;ctx.beginPath();ctx.ellipse(x,y,46*c.s,9*c.s,0,0,7);ctx.ellipse(x+24*c.s,y-5*c.s,26*c.s,8*c.s,0,0,7);ctx.fill()}}

 // 원경: 한강 + 서울 도심 + 남산타워 + 롯데월드타워 (높이 오를수록 진해짐)
 function far(k){const a=.25+.75*Math.min(1,k*1.2),by=H*.5+(camY-320)*.25,px=-camX*.04;ctx.save();ctx.globalAlpha=a;
  ctx.fillStyle='#c6d3df';ctx.fillRect(0,by,W,H);
  for(let i=-2;i<60;i++){const x=px%14+i*W/48,w=5+R(i)*9,h=6+R(i+50)*26*(1-Math.abs(i/48-.55));ctx.fillStyle=i%3?'#a9b8c8':'#9fb0c2';ctx.fillRect(x,by-h,w,h+2)}
  // 한강
  ctx.fillStyle='#d9e6ef';ctx.beginPath();ctx.moveTo(0,by+14);ctx.bezierCurveTo(W*.3,by+6,W*.6,by+22,W,by+12);ctx.lineTo(W,by+20);ctx.bezierCurveTo(W*.6,by+30,W*.3,by+14,0,by+22);ctx.fill();
  // 남산타워
  const nx=W*.3+px*.5;ctx.fillStyle='#93a5b8';ctx.beginPath();ctx.ellipse(nx,by,26,10,0,Math.PI,0);ctx.fill();ctx.fillRect(nx-1.5,by-44,3,36);ctx.fillRect(nx-4,by-38,8,5);ctx.fillRect(nx-.5,by-56,1,12);
  // 롯데월드타워(가늘게 솟은 첨탑형)
  const lx=W*.74+px*.5;ctx.beginPath();ctx.moveTo(lx-6,by);ctx.lineTo(lx-2,by-62);ctx.lineTo(lx,by-70);ctx.lineTo(lx+2,by-62);ctx.lineTo(lx+6,by);ctx.fill();
  ctx.restore()}

 // 중경: 백운대·인수봉·만경대 화강암 봉우리 + 북한산성 성곽 + 도선사
 function mid(k){const px=-camX*.16,base=H*.52+(camY-320)*.32,fade=1-Math.max(0,Math.min(1,(camX-1500)/300))*.75;ctx.save();ctx.globalAlpha=fade;
  const dome=(cx,w,h,col)=>{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(cx-w,base);ctx.bezierCurveTo(cx-w*.95,base-h*.9,cx-w*.45,base-h*1.02,cx,base-h);ctx.bezierCurveTo(cx+w*.5,base-h,cx+w*.9,base-h*.75,cx+w,base);ctx.fill();
   ctx.strokeStyle='#ffffff26';ctx.lineWidth=1.5;for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(cx+i*w*.18,base-h*.97+Math.abs(i)*h*.09);ctx.quadraticCurveTo(cx+i*w*.26,base-h*.5,cx+i*w*.3,base);ctx.stroke()}};
  const jag=(x0,x1,h,col)=>{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x0,base);for(let i=0;i<=10;i++)ctx.lineTo(x0+(x1-x0)*i/10,base-h*(.5+.5*R(i+3))*(1-Math.abs(i-5)/12));ctx.lineTo(x1,base);ctx.fill()};
  ctx.fillStyle='#b3c3d1';ctx.beginPath();ctx.moveTo(0,H);for(let x=0;x<=W;x+=10)ctx.lineTo(x,base+18+Math.sin((x-px*.5)*.01)*16);ctx.lineTo(W,H);ctx.fill();
  jag(px+W*.95,px+W*1.6,90,'#9aa6b1');            // 만경대
  dome(px+W*2.15,70,105,'#a3abb2');                // 노적봉
  dome(px+W*.4,85,150,'#aeb3b7');                 // 인수봉
  dome(px+W*1.3,82,128,'#a6adb3');                // 백운대
  // 북한산성 성곽(능선 따라 여장)
  ctx.fillStyle='#d8d2c4';const fy=x=>base+6+Math.sin((x-px)*.012)*8;for(let x=0;x<W;x+=7){const y=fy(x);ctx.fillRect(x,y-4,6,4);if((x/7|0)%2)ctx.fillRect(x+1,y-7,4,3)}
  ctx.fillStyle='#6f8f76';ctx.beginPath();ctx.moveTo(0,H);for(let x=0;x<=W;x+=10)ctx.lineTo(x,base+14+Math.sin((x-px*.9)*.02)*8);ctx.lineTo(W,H);ctx.fill();
  // 도선사(숲 속 기와지붕)
  const tx=px*1.4+W*.55+300;if(tx>-60&&tx<W+60){const ty=base+16;ctx.fillStyle='#4e5f57';ctx.beginPath();ctx.moveTo(tx-30,ty);ctx.quadraticCurveTo(tx-20,ty-10,tx-14,ty-12);ctx.lineTo(tx+14,ty-12);ctx.quadraticCurveTo(tx+20,ty-10,tx+30,ty);ctx.fill();ctx.fillStyle='#c9b79c';ctx.fillRect(tx-16,ty,32,8);ctx.fillStyle='#4e5f57';ctx.fillRect(tx-18,ty+8,36,2)}
  ctx.restore()}

 // 나무: 신갈나무(둥근 수관, 가을 갈색), 소나무(붉은 줄기+층진 수관), 단풍(붉은 수관)
 function tree(type,x,y,s,n){if(type==='pine'){ctx.strokeStyle='#8a4b32';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+6*s*(R(n)-.5),y-20*s,x+4*s*(R(n+1)-.5),y-34*s);ctx.stroke();
   ctx.fillStyle='#2f5a3c';for(const[dx,dy,w]of[[-6,-30,13],[6,-36,12],[0,-42,10]]){ctx.beginPath();ctx.ellipse(x+dx*s,y+dy*s,w*s,4.5*s,0,0,7);ctx.fill()}return}
  ctx.fillStyle='#5a4330';ctx.fillRect(x-1.5*s,y-14*s,3*s,14*s);
  const col=type==='maple'?['#b8472f','#d0663a']:R(n+7)<.3?['#a86f35','#c38a45']:['#4f7a3f','#6a9450'];
  ctx.fillStyle=col[0];ctx.beginPath();ctx.arc(x,y-22*s,11*s,0,7);ctx.arc(x+7*s,y-17*s,8*s,0,7);ctx.fill();ctx.fillStyle=col[1];ctx.beginPath();ctx.arc(x-4*s,y-26*s,6*s,0,7);ctx.fill()}

 function terrain(now){
  // 능선 뒤 나무(수관이 길 위로 보임)
  for(let d=Math.floor(dAt(-60)/13)*13;d<dAt(W+60);d+=13){if(d<-100||d>L-60)continue;const z=zoneOf(d);if(R(d+21)>z.dens*.9)continue;tree(z.trees[(R(d+8)*z.trees.length)|0],gx(d)+R(d)*8,gy(ground(d))+4,.8+R(d+6)*.35,d+1)}
  // 땅(구간별 색)
  for(let sx=-3;sx<=W+3;sx+=3){const d=dAt(sx),y=gy(ground(d));ctx.fillStyle=zcol(Math.min(Math.max(d,0),L),'ground');ctx.fillRect(sx,y,3.6,H-y)}
  // 뒷줄 나무
  for(let d=Math.floor((dAt(-60))/19)*19;d<dAt(W+60);d+=19){if(d<-100||d>L+40)continue;const z=zoneOf(d);if(R(d)>z.dens)continue;const x=gx(d)+R(d+3)*12,y=gy(ground(d))+14+R(d+5)*16;tree(z.trees[(R(d+9)*z.trees.length)|0],x,y,.7+R(d+2)*.3,d)}
  // 화강암 반석·바위
  for(let d=Math.floor(dAt(-60)/34)*34;d<dAt(W+60);d+=34){if(d<0||d>L+80)continue;const z=zoneOf(d);if(!z.slab&&R(d+11)>.25)continue;const x=gx(d),y=gy(ground(d))+22+R(d)*30,w=(z.slab?24:12)+R(d+1)*12;
   ctx.fillStyle=C.rock.c2;ctx.beginPath();ctx.ellipse(x,y+3,w,w*.42,0,0,7);ctx.fill();ctx.fillStyle=C.rock.c1;ctx.beginPath();ctx.ellipse(x-2,y,w*.92,w*.36,0,0,7);ctx.fill();
   ctx.strokeStyle='#00000018';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-w*.4,y-2);ctx.lineTo(x+w*.2,y+w*.2);ctx.stroke()}
  // 흙길(마사토): 띠 + 자갈 점
  ctx.lineCap='round';ctx.lineWidth=9;ctx.strokeStyle='#00000014';ctx.beginPath();for(let sx=-6;sx<=W+6;sx+=6){const d=dAt(sx);if(d<-40||d>L)continue;ctx.lineTo(sx,gy(ground(d))+5)}ctx.stroke();
  for(let sx=-6;sx<=W+6;sx+=6){const d=dAt(sx);if(d<-40||d>L)continue;const y=gy(ground(d));ctx.fillStyle=zcol(Math.max(d,0),'soil');ctx.fillRect(sx,y-1,7,6)}
  ctx.fillStyle='#00000022';for(let d=Math.floor(dAt(0)/3)*3;d<dAt(W);d+=3){if(d<0||d>L)continue;if(R(d)<.55)continue;ctx.fillRect(gx(d)+R(d+1)*3,gy(ground(d))+R(d+2)*5,1.5,1.5)}
  // 풀 포기
  for(let d=Math.floor(dAt(0)/5)*5;d<dAt(W);d+=5){if(d<0||d>L)continue;const z=zoneOf(d);if(R(d+4)>(z.slab?.25:.7))continue;const x=gx(d),y=gy(ground(d))+6+R(d)*8;ctx.strokeStyle=zcol(d,'grass');ctx.lineWidth=1.2;ctx.beginPath();for(const a of[-.4,0,.4]){ctx.moveTo(x,y);ctx.lineTo(x+a*6,y-5-R(d+a)*3)}ctx.stroke()}
  // 나무 계단 구간
  for(let d=Math.floor(dAt(0)/11)*11;d<dAt(W);d+=11){const z=zoneOf(d);if(d<0||d>L||!z.steps)continue;const x=gx(d),y=gy(alt(d));ctx.fillStyle='#7b5a3a';ctx.fillRect(x-5,y,10,3);ctx.fillStyle='#00000025';ctx.fillRect(x-5,y+3,10,1)}
  // 쇠난간·와이어로프
  ctx.strokeStyle='#4b4f55';ctx.lineWidth=1.6;let pv=null;for(let d=1560;d<=L-10;d+=24){const x=gx(d),y=gy(alt(d))-20;if(x<-30||x>W+30){pv=null;continue}ctx.fillStyle='#3d4146';ctx.fillRect(x-1.2,y,2.4,20);if(pv){ctx.beginPath();ctx.moveTo(pv[0],pv[1]);ctx.lineTo(x,y);ctx.moveTo(pv[0],pv[1]+9);ctx.lineTo(x,y+9);ctx.stroke()}pv=[x,y]}
  // 정상: 화강암 반석 + 태극기 (글자 없음, 정보는 상단 표시줄)
  const sx=gx(L),sy=gy(TOP);if(sx>-80&&sx<W+80){ctx.fillStyle=C.rock.c2;ctx.beginPath();ctx.ellipse(sx+8,sy+6,44,20,0,Math.PI,0);ctx.fill();ctx.fillStyle=C.rock.c1;ctx.beginPath();ctx.ellipse(sx+4,sy+4,38,16,0,Math.PI,0);ctx.fill();
   ctx.fillStyle='#555';ctx.fillRect(sx+30,sy-70,3,66);flag(sx+33,sy-70,now)}
 }
 // 이정표: 판을 길 아래 땅쪽에 둬서 등산객에 안 가려짐
 function signs(){for(const p of P.slice(0,-1)){const x=gx(p[0]),y=gy(p[1]);if(x<-90||x>W+90)continue;ctx.fillStyle='#5e4228';ctx.fillRect(x-1.5,y+2,3,26);
  ctx.font='600 10.5px sans-serif';const t=p[2],w=ctx.measureText(t).width+12;ctx.fillStyle='#2e4a38';ctx.beginPath();ctx.roundRect(x-w/2,y+26,w,17,3);ctx.fill();ctx.fillStyle='#f3efe4';ctx.textAlign='center';ctx.fillText(t,x,y+38);ctx.textAlign='left'}}
 function flag(x,y,now){const w=30,h=20,wv=Math.sin(now/220)*1.5;ctx.save();ctx.translate(x,y);ctx.transform(1,wv*.02,0,1,0,0);ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#bbb';ctx.lineWidth=.5;ctx.strokeRect(0,0,w,h);
  const cx=w/2,cy=h/2,r=5;ctx.fillStyle='#cd2e3a';ctx.beginPath();ctx.arc(cx,cy,r,Math.PI,0);ctx.fill();ctx.fillStyle='#0047a0';ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI);ctx.fill();
  ctx.fillStyle='#cd2e3a';ctx.beginPath();ctx.arc(cx-r/2,cy,r/2,0,7);ctx.fill();ctx.fillStyle='#0047a0';ctx.beginPath();ctx.arc(cx+r/2,cy,r/2,0,7);ctx.fill();
  ctx.fillStyle='#000';for(const[a,b]of[[4,3],[w-8,3],[4,h-6],[w-8,h-6]])for(let i=0;i<3;i++)ctx.fillRect(a,b+i*1.2,3.5,.7);ctx.restore()}
 function draw(now){const m=players.find(p=>p.id===me),d=m?m.h:0;camX+=(d-camX)*.1;camY+=(alt(camX)-camY)*.1;const k=camX/L;
  sky(k,now);far(k);mid(k);terrain(now);signs();
  // 상단 표시줄 (현재 지점 · 구간)
  ctx.font='600 12px sans-serif';const bt=spot(camX)+'  ·  '+zoneOf(camX).label,bw=ctx.measureText(bt).width+22;ctx.fillStyle='#00000055';ctx.beginPath();ctx.roundRect(W/2-bw/2,112,bw,24,12);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(bt,W/2,128);ctx.textAlign='left';
  // 등산객 + 이름표 배치(내 이름표·깃발 자리 먼저 확보)
  const mx=gx(d),my=gy(alt(d)),placed=[[mx,my-76,96],[mx,my-58,40],[mx,my-38,40],[mx,my-18,40]];LB=[];const fx=gx(L);if(fx>-60&&fx<W+60)placed.push([fx+48,gy(TOP)-60,40]);
  for(const p of players.filter(p=>p.id!==me).sort((a,b)=>a.h-b.h)){const pd=p.h+((p.id*37)%9-4),x=gx(pd),y=gy(alt(pd));if(x<-40||x>W+40)continue;hikerC(x,y,p,now,placed)}
  if(m)hiker(mx,my,m,now,[]);for(const f of LB)f()}
 let LB=[];
 function hikerC(x,y,p,now,placed){const l0=y-46*.95-14;hiker(x,y,p,now,[[x,l0]]); // 기본 이름표는 끄고 아래에서 배치
  ctx.font='11px sans-serif';const t=p.name,w=ctx.measureText(t).width+12;let ly=l0;
  for(let i=0;;i++){if(!placed.some(q=>Math.abs(q[0]-x)<(w+q[2])/2+2&&Math.abs(q[1]-ly)<19))break;if(i===3)return;ly-=20}
  placed.push([x,ly,w]);LB.push(()=>{ctx.font='11px sans-serif';ctx.fillStyle='#0000008a';ctx.beginPath();ctx.roundRect(x-w/2,ly-13,w,17,8.5);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(t,x,ly);ctx.textAlign='left';
  if(ly<l0-4){ctx.strokeStyle='#0005';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,ly+4);ctx.lineTo(x,l0-10);ctx.stroke()}})}
 // 인증 카드 배경
 function card(x){const g=x.createLinearGradient(0,0,0,1350);g.addColorStop(0,'#6f9fcf');g.addColorStop(.55,'#f1e2c8');g.addColorStop(1,'#c8d3dd');x.fillStyle=g;x.fillRect(0,0,1080,1350);
  x.fillStyle='#b4c2cf';for(let i=0;i<46;i++){const w=10+R(i)*18,h=20+R(i+9)*80;x.fillRect(i*24,1010-h,w,h+400)}
  x.fillStyle='#a4b2c1';x.beginPath();x.moveTo(860,1010);x.lineTo(868,880);x.lineTo(872,860);x.lineTo(876,880);x.lineTo(884,1010);x.fill(); // 롯데월드타워
  x.fillRect(318,900,6,110);x.fillRect(310,915,22,10); // 남산타워
  x.fillStyle='#bdb6aa';x.beginPath();x.moveTo(-50,1350);x.bezierCurveTo(100,740,350,560,560,560);x.bezierCurveTo(800,560,980,800,1130,1350);x.fill(); // 백운대 화강암
  x.strokeStyle='#ffffff38';x.lineWidth=5;for(let i=0;i<7;i++){x.beginPath();x.moveTo(320+i*80,610+i*6);x.quadraticCurveTo(300+i*95,900,260+i*105,1350);x.stroke()}
  x.fillStyle='#555';x.fillRect(556,440,8,125);x.save();x.translate(564,440);x.scale(4,4);const c2=ctx;ctx=x;flag(0,0,0);ctx=c2;x.restore();
  // 기념 아이콘: 북한산성 성문(작게, 오른쪽 위)
  x.save();x.translate(930,470);x.fillStyle='#ffffffd8';x.beginPath();x.arc(0,0,60,0,7);x.fill();x.fillStyle='#8c8577';x.fillRect(-38,-6,76,34);x.fillStyle='#ffffffd8';x.beginPath();x.arc(0,28,14,Math.PI,0);x.fill();x.fillRect(-14,28,28,2);
  x.fillStyle='#4e5f57';x.beginPath();x.moveTo(-44,-6);x.quadraticCurveTo(0,-14,44,-6);x.lineTo(30,-26);x.lineTo(-30,-26);x.fill();x.fillStyle='#555';x.font='bold 20px sans-serif';x.textAlign='center';x.fillText('북한산성',0,50);x.restore()}
 return{alt,spot,draw,card,P,L,gx,gy,zoneOf};})();
