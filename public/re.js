// 북한산 사실풍 2D 렌더러 v4 – 모든 그림은 코드로 직접 그림(사진·지도 이미지 없음). 고해상도(DPR) 대응.
const PX=(()=>{
 const C=MOUNTAINS.bukhan,L=BK.L,TOP=C.pts.at(-1)[1];
 const R=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
 const hx=s=>[1,3,5].map(i=>parseInt(s.substr(i,2),16));
 const mix=(a,b,t)=>{const A=hx(a),B=hx(b);return'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'};
 const shade=(c,f)=>'rgb('+hx(c).map(v=>Math.max(0,Math.min(255,Math.round(v*f)))).join(',')+')';
 const zone=d=>BK.zoneOf(Math.max(0,Math.min(L-1,d)));
 const zcol=(d,key)=>{d=Math.max(0,Math.min(L,d));const Z=C.zones;let i=Z.findIndex(z=>d<z.to);if(i<0)i=Z.length-1;const z=Z[i],n=Z[i+1],e=z.to-d;return n&&e<120?mix(z[key],n[key],1-e/120):mix(z[key],z[key],0)};
 const ground=d=>d>L?TOP-(d-L)*.6:d<0?BK.alt(0)+d*.05:BK.alt(d);
 let HS=1,PXS=3,VS=4,GY=0,GX=0,camX=0,camY=320,dS=0,myPose='idle',port=true;
 const gx=d=>GX+(d-camX)*PXS,gy=a=>GY-(a-camY)*VS,dAt=sx=>camX+(sx-GX)/PXS,gyd=d=>gy(ground(d));
 const P=()=>ctx.beginPath(),F=c=>{ctx.fillStyle=c;ctx.fill()};
 const lg=(x0,y0,x1,y1,st)=>{const g=ctx.createLinearGradient(x0,y0,x1,y1);st.forEach((c,i)=>g.addColorStop(i/(st.length-1),c));return g};
 function layout(){port=H>W;HS=Math.max(1,Math.min(1.7,Math.min(W,H)/(port?300:330)));PXS=3.1*HS;VS=(port?3.9:3.1)*HS;GY=H*(port?.64:.70);GX=W*(port?.36:.38)}
 // ── 하늘 ──
 const clouds=[...Array(7)].map((_,i)=>({x:R(i),y:R(i+9),s:.7+R(i+3)*.8}));
 function sky(now,k){ctx.fillStyle=lg(0,0,0,H*.75,[mix('#4f86c6','#3d72b8',k),mix('#8fb8e0','#7aa8da',k),'#dfe9ee','#f4ead8']);ctx.fillRect(0,0,W,H);
  const sx=W*.82,sy=H*.12;let g=ctx.createRadialGradient(sx,sy,0,sx,sy,H*.35);g.addColorStop(0,'rgba(255,250,225,.9)');g.addColorStop(.08,'rgba(255,246,210,.55)');g.addColorStop(1,'rgba(255,240,200,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  for(const c of clouds){const s=c.s*HS,x=((c.x*(W+300)+now*.005*c.s-camX*.05)%(W+300)+W+300)%(W+300)-150,y=H*(.05+c.y*.2);
   ctx.save();ctx.globalAlpha=.75;const cg=ctx.createLinearGradient(0,y-18*s,0,y+10*s);cg.addColorStop(0,'#ffffff');cg.addColorStop(1,'#dfe7f0');ctx.fillStyle=cg;P();
   ctx.ellipse(x,y,48*s,10*s,0,0,7);ctx.ellipse(x-18*s,y-4*s,22*s,10*s,0,0,7);ctx.ellipse(x+10*s,y-10*s,24*s,14*s,0,0,7);ctx.ellipse(x+34*s,y-3*s,18*s,9*s,0,0,7);ctx.fill();ctx.restore()}}
 // ── 원경: 관악·청계 능선, 강남·롯데월드타워, 한강, 강북·남산 ──
 function far(now,k){const hz=H*(port?.47:.46)+(camY-480)*.08*HS,p=camX*.05*HS;
  ctx.fillStyle=lg(0,hz-60*HS,0,hz,['#a9bed4','#c3d1dc']);P();ctx.moveTo(0,hz+4);for(let x=0;x<=W;x+=6){const X=x+p*.6;ctx.lineTo(x,hz-HS*(14+Math.abs(Math.sin(X*.006))*26+Math.sin(X*.021)*6))}ctx.lineTo(W,hz+4);ctx.fill();
  // 강남 스카이라인
  for(let i=Math.floor(p/8)-2;i<(p+W)/8+2;i++){const x=i*8-p,h=(4+R(i)*16)*HS*(.6+.4*Math.sin(i*.07)**2);ctx.fillStyle=i%3?'#a5b5c6':'#9badbf';ctx.fillRect(x,hz-h,6.4,h+2)}
  const lx=((W*.78-p*.8)%(W*1.6)+W*1.6)%(W*1.6);ctx.fillStyle=lg(lx,0,lx+8*HS,0,['#b6c4d2','#93a4b6']);P();ctx.moveTo(lx-5*HS,hz);ctx.quadraticCurveTo(lx-2*HS,hz-50*HS,lx,hz-72*HS);ctx.quadraticCurveTo(lx+2*HS,hz-50*HS,lx+5*HS,hz);ctx.fill();
  // 한강
  const ry=hz+2;ctx.fillStyle=lg(0,ry,0,ry+9*HS,['#cfe0ec','#b3cde0']);ctx.fillRect(0,ry,W,9*HS);ctx.fillStyle='#ffffff80';for(let i=0;i<24;i++){const x=((R(i)*W*1.3-now*.01-p)%W+W)%W;ctx.fillRect(x,ry+R(i+4)*7*HS,10+R(i+2)*18,1)}
  // 강북 + 남산
  const p2=camX*.08*HS,ny=ry+9*HS;ctx.fillStyle='#9fb1c2';P();ctx.moveTo(0,H);for(let x=0;x<=W;x+=5){const X=((x+p2)%900+900)%900;ctx.lineTo(x,ny-Math.max(0,1-Math.abs(X-300)/110)**1.5*22*HS)}ctx.lineTo(W,H);ctx.fill();
  const nx=((300-p2)%900+900)%900;ctx.fillStyle='#8fa2b5';ctx.fillRect(nx-1.2*HS,ny-46*HS,2.4*HS,26*HS);P();ctx.ellipse(nx,ny-40*HS,4*HS,2.4*HS,0,0,7);F('#8fa2b5');ctx.fillRect(nx-.5,ny-56*HS,1,10*HS);
  for(let i=Math.floor(p2/7)-2;i<(p2+W)/7+2;i++){const x=i*7-p2,h=(2+R(i+99)*8)*HS;ctx.fillStyle=i%2?'#93a6b8':'#8ca0b3';ctx.fillRect(x,ny-h+4,5.6,h)}
  ctx.fillStyle=lg(0,hz-80*HS,0,ny+20*HS,['rgba(230,236,240,0)','rgba(232,236,236,.45)']);ctx.fillRect(0,hz-80*HS,W,ny+20*HS-(hz-80*HS));return ny}
 // ── 중경: 인수봉·백운대·만경대 화강암 ──
 function granite(cx,base,w,h,seed,lit){const pts=[];for(let i=0;i<=40;i++){const u=i/40*2-1,bump=(R(seed+i)-.5)*.05;pts.push([cx+u*w,base-h*Math.pow(Math.max(0,1-u*u),.55+(u>0?.15:0))*(1+bump*(Math.abs(u)>.3?1:0))])}
  P();ctx.moveTo(cx-w,base+2);for(const[x,y]of pts)ctx.lineTo(x,y);ctx.lineTo(cx+w,base+2);ctx.closePath();
  ctx.fillStyle=lg(cx-w,0,cx+w,0,[shade(lit,1.08),lit,shade(lit,.82),shade(lit,.7)]);ctx.fill();
  ctx.save();ctx.clip();ctx.fillStyle=lg(0,base-h,0,base,['rgba(255,255,255,.18)','rgba(0,0,0,0)','rgba(40,50,60,.18)']);ctx.fillRect(cx-w,base-h,w*2,h);
  // 세로 절리(풍화 줄무늬)
  for(let i=0;i<16;i++){const u=(R(seed*3+i)*2-1)*.9,x=cx+u*w,top=base-h*Math.pow(1-u*u,.55);ctx.strokeStyle=R(i+seed)>.5?'rgba(70,72,78,.22)':'rgba(255,255,255,.22)';ctx.lineWidth=(.6+R(i)*1.4)*HS;P();ctx.moveTo(x,top+3);ctx.bezierCurveTo(x+u*8*HS,top+h*.3,x+u*18*HS,top+h*.6,x+u*26*HS,base);ctx.stroke()}
  // 소나무 점
  for(let i=0;i<14;i++){const u=R(seed+i*7)*2-1;if(Math.abs(u)<.45)continue;const x=cx+u*w,y=base-h*Math.pow(1-u*u,.55)*R(seed+i)*.7;P();ctx.ellipse(x,y,3*HS,2*HS,0,0,7);F('rgba(58,88,64,.75)')}ctx.restore()}
 function mid(now,ny){const p=camX*.16*HS,base=ny+18*HS+(camY-480)*.12*HS,hm=Math.min(1.5,Math.max(.9,H/(port?520:330)))*HS*(port?1.15:1);
  const fade=1-Math.max(0,Math.min(1,(camX-1600)/300))*.6;ctx.save();ctx.globalAlpha=fade;
  // 뒤 능선(숲)
  ctx.fillStyle=lg(0,base-40*hm,0,base,['#8fa79a','#7e978a']);P();ctx.moveTo(0,H);for(let x=0;x<=W;x+=8)ctx.lineTo(x,base-12*hm-Math.sin((x+p*.7)*.008)*14*hm-Math.sin((x+p*.7)*.03)*4*hm);ctx.lineTo(W,H);ctx.fill();
  const pw=HS*Math.max(1.25,hm/HS*1.15);const q=W*.55+60*HS;const pk=[[q-p,62*pw,98*hm,11,'#c9c7c0','Insubong'],[q+170*pw-p,64*pw,112*hm,23,'#c4c1b9','Baegundae'],[q+300*pw-p,58*pw,84*hm,37,'#bdbab3','Mangyeongdae'],[q-220*pw-p,56*pw,58*hm,51,'#b8b8b2','Nojeokbong']];
  for(const[c,w,h,s,col]of [pk[3],pk[2],pk[0],pk[1]])if(c>-w&&c<W+w)granite(c,base,w,h,s,col);
  ctx.font=`600 ${Math.round(10*Math.min(1.3,HS))}px sans-serif`;ctx.textAlign='center';for(const[c,,h,,,nm]of pk.slice(0,3))if(c>-20&&c<W+20){ctx.fillStyle='rgba(30,40,50,.55)';ctx.fillText(nm,c,base-h-6)}
  // 북한산성 성곽
  const p4=camX*.3*HS,fy=x=>base+8*hm+Math.sin((x+p4)*.01)*6*hm;ctx.fillStyle='#e1dbcd';for(let x=0;x<W;x+=6*HS){const X=x+p4;if(((X%1100)+1100)%1100>650)continue;const y=fy(x);ctx.fillRect(x,y-4*HS,5*HS,4*HS);if((X/(6*HS)|0)%2)ctx.fillRect(x+HS,y-6.5*HS,3*HS,2.5*HS)}
  // 앞 능선 숲(나무 실루엣)
  const fb=base+16*hm;ctx.fillStyle=lg(0,fb-20*hm,0,fb+40*hm,['#5f8466','#4b6f55']);P();ctx.moveTo(0,H);for(let x=0;x<=W;x+=4){const X=x+p*1.6;ctx.lineTo(x,fb-Math.sin(X*.012)*8*hm-(R(Math.floor(X/9))*7)*HS)}ctx.lineTo(W,H);ctx.fill();
  // 도선사
  const tx=W*.7+500*HS-p*2.4;if(tx>-80*HS&&tx<W+80*HS)temple(tx,fb+4*HS,HS*.9);
  ctx.restore();
  ctx.fillStyle=lg(0,fb-30*hm,0,fb+60*hm,['rgba(220,228,226,0)','rgba(220,228,226,.35)','rgba(220,228,226,0)']);ctx.fillRect(0,fb-30*hm,W,90*hm)}
 function roof(x,y,w,h,s){ctx.fillStyle=lg(0,y-h,0,y,['#5d6a70','#3e494f']);P();ctx.moveTo(x-w/2-6*s,y-h*.1);ctx.quadraticCurveTo(x-w/2+4*s,y-h*.35,x-w/2+8*s,y-h);ctx.lineTo(x+w/2-8*s,y-h);ctx.quadraticCurveTo(x+w/2-4*s,y-h*.35,x+w/2+6*s,y-h*.1);ctx.quadraticCurveTo(x,y+2*s,x-w/2-6*s,y-h*.1);ctx.fill()}
 function temple(x,y,s){ctx.fillStyle='#e9e0cc';ctx.fillRect(x-22*s,y-14*s,44*s,14*s);ctx.fillStyle='#a8392b';for(const u of[-20,-7,6,18])ctx.fillRect(x+u*s,y-14*s,2.4*s,14*s);
  ctx.fillStyle='#3f8f7f';ctx.fillRect(x-24*s,y-17*s,48*s,3*s);roof(x,y-16*s,52*s,12*s,s);ctx.fillStyle='#d9cdb2';ctx.fillRect(x-28*s,y,56*s,3*s)}
 // ── 나무 ──
 function pine(x,y,s,n){ctx.strokeStyle=lg(x-3*s,0,x+3*s,0,['#b0603e','#7a3c24']);ctx.lineWidth=3.4*s;ctx.lineCap='round';const bx=(R(n)-.5)*10*s;P();ctx.moveTo(x,y);ctx.bezierCurveTo(x+bx,y-16*s,x-bx,y-30*s,x+bx*.6,y-46*s);ctx.stroke();
  ctx.lineWidth=1.6*s;for(const[t,dir]of[[.45,-1],[.62,1],[.78,-1]]){const yy=y-46*s*t,xx=x+bx*(.3);P();ctx.moveTo(xx,yy);ctx.lineTo(xx+dir*10*s,yy-4*s);ctx.stroke()}
  const cl=[[-12,-30,13,5],[11,-35,12,5],[-3,-43,13,5.5],[6,-50,9,4.5],[-8,-24,8,4]];for(const[dx,dy,w,h]of cl){const X=x+dx*s+bx*.5,Y=y+dy*s;ctx.fillStyle=lg(0,Y-h*s,0,Y+h*s,['#4f8a5a','#2e5c3e','#22452f']);P();ctx.ellipse(X,Y,w*s,h*s,0,0,7);ctx.fill();P();ctx.ellipse(X-w*.3*s,Y-h*.4*s,w*.45*s,h*.35*s,0,0,7);F('rgba(150,200,140,.25)')}}
 function broad(x,y,s,n,cols){ctx.strokeStyle='#5c4532';ctx.lineWidth=3*s;ctx.lineCap='round';P();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+(R(n)-.5)*4*s,y-10*s,x,y-20*s);ctx.stroke();
  const bl=[[0,-26,13],[-9,-21,9],[9,-20,9],[-4,-32,8],[6,-30,8]];for(const[dx,dy,r]of bl){const X=x+dx*s,Y=y+dy*s;const g=ctx.createRadialGradient(X-r*.4*s,Y-r*.5*s,r*.1*s,X,Y,r*s);g.addColorStop(0,cols[2]);g.addColorStop(.5,cols[1]);g.addColorStop(1,cols[0]);ctx.fillStyle=g;P();ctx.arc(X,Y,r*s,0,7);ctx.fill()}}
 const COLS={oak:['#3e6a35','#5e8f46','#8fbf68'],oakF:['#8a5a28','#b98038','#e2b45c'],maple:['#902e22','#c4482f','#ec8a5a']};
 function tree(t,x,y,s,n){if(t==='pine')return pine(x,y,s,n);broad(x,y,s,n,COLS[t==='maple'?'maple':R(n+7)<.3?'oakF':'oak'])}
 // ── 지형 ──
 function terrain(now){const d0=dAt(-80),d1=dAt(W+80);
  // 뒤 숲
  for(let d=Math.floor(d0/13)*13;d<d1;d+=13){if(d<-120||d>L-50)continue;const z=zone(d);if(R(d+21)>z.dens*.9)continue;tree(z.trees[(R(d+8)*z.trees.length)|0],gx(d)+R(d)*8*HS,gyd(d)+3*HS,(.75+R(d+6)*.35)*HS,d+1)}
  // 땅
  const top=[];for(let sx=-8;sx<=W+8;sx+=4)top.push([sx,gyd(dAt(sx))]);
  for(let i=0;i<top.length-1;i++){const[x,y]=top[i],[x2,y2]=top[i+1];ctx.fillStyle=zcol(dAt(x),'ground');P();ctx.moveTo(x-.5,y);ctx.lineTo(x2+.5,y2);ctx.lineTo(x2+.5,H);ctx.lineTo(x-.5,H);ctx.fill()}
  ctx.fillStyle=lg(0,GY-40*HS,0,H,['rgba(0,0,0,0)','rgba(0,0,0,0)','rgba(20,30,20,.35)']);ctx.fillRect(0,GY-40*HS,W,H);
  for(let d=Math.floor(d0/4)*4;d<d1;d+=4){if(R(d+31)<.6)continue;const x=gx(d)+R(d)*6,y=gyd(d)+(14+R(d+1)*90)*HS;if(y>H)continue;ctx.fillStyle=R(d+2)<.5?'rgba(40,60,30,.16)':'rgba(255,255,230,.10)';P();ctx.ellipse(x,y,(2+R(d+3)*5)*HS,(1+R(d+4)*1.6)*HS,0,0,7);ctx.fill()}
  // 반석·바위 (땅 속)
  for(let d=Math.floor(d0/30)*30;d<d1;d+=30){if(d<0||d>L+80)continue;const z=zone(d);if(!z.slab&&R(d+11)>.3)continue;rockBlob(gx(d)+R(d+3)*10*HS,gyd(d)+(20+R(d)*40)*HS,((z.slab?26:12)+R(d+1)*14)*HS,d)}
  // 뒤쪽 줄 나무(아래)
  for(let d=Math.floor(d0/19)*19;d<d1;d+=19){if(d<-120||d>L+40)continue;const z=zone(d);if(R(d)>z.dens*.8)continue;tree(z.trees[(R(d+9)*z.trees.length)|0],gx(d)+R(d+3)*12*HS,gyd(d)+(34+R(d+5)*30)*HS,(.85+R(d+2)*.3)*HS,d)}
  // 흙길 / 계단 / 반석
  ctx.lineCap='round';ctx.lineJoin='round';const path=(w,c,o)=>{ctx.strokeStyle=c;ctx.lineWidth=w;P();top.forEach(([x,y],i)=>i?ctx.lineTo(x,y+o):ctx.moveTo(x,y+o));ctx.stroke()};
  path(14*HS,'rgba(0,0,0,.12)',6*HS);
  for(let i=0;i<top.length-1;i++){const[x,y]=top[i],[x2,y2]=top[i+1];ctx.fillStyle=zcol(dAt(x),'soil');P();ctx.moveTo(x-.5,y-1);ctx.lineTo(x2+.5,y2-1);ctx.lineTo(x2+.5,y2+8*HS);ctx.lineTo(x-.5,y+8*HS);ctx.fill()}
  path(2*HS,'rgba(255,255,255,.28)',0);
  ctx.fillStyle='rgba(90,70,50,.35)';for(let d=Math.floor(d0/2)*2;d<d1;d+=2){if(R(d)<.5)continue;ctx.beginPath();ctx.arc(gx(d)+R(d+1)*3,gyd(d)+(1+R(d+2)*6)*HS,(.6+R(d+3))*HS*.8,0,7);ctx.fill()}
  for(let d=Math.floor(d0/9)*9;d<d1;d+=9){if(d<0||d>L)continue;const z=zone(d);if(!z.steps)continue;const x=gx(d),y=gyd(d);ctx.fillStyle=lg(0,y-1,0,y+5*HS,['#9a7048','#6a4628']);ctx.fillRect(x-6*HS,y-1,12*HS,4.5*HS);ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(x-6*HS,y+3.5*HS,12*HS,1.2*HS)}
  // 풀
  for(let d=Math.floor(d0/3)*3;d<d1;d+=3){if(d<-60||d>L)continue;const z=zone(d);if(R(d+4)>(z.slab?.2:.75))continue;const x=gx(d),y=gyd(d)+(7+R(d)*12)*HS,c=zcol(d,'grass');ctx.strokeStyle=c;ctx.lineWidth=1.1*HS;P();for(let k=-2;k<=2;k++){const a=k*.28+Math.sin(now/900+d)*.06,l=(5+R(d+k)*5)*HS;ctx.moveTo(x+k*HS,y);ctx.quadraticCurveTo(x+k*HS+a*l*.3,y-l*.6,x+k*HS+a*l,y-l)}ctx.stroke()}
  // 탐방지원센터
  {const x=gx(-70),y=gyd(-70);if(x>-90*HS&&x<W+90*HS){const s=HS;ctx.fillStyle='#ece5d6';ctx.fillRect(x-30*s,y-22*s,60*s,22*s);ctx.fillStyle='#5f7a8e';ctx.fillRect(x-22*s,y-16*s,12*s,9*s);ctx.fillRect(x+10*s,y-16*s,12*s,9*s);ctx.fillStyle='#7a4f2c';ctx.fillRect(x-5*s,y-15*s,10*s,15*s);ctx.fillStyle=lg(0,y-30*s,0,y-22*s,['#6f8064','#4e5e47']);ctx.fillRect(x-34*s,y-28*s,68*s,7*s)}}
  // 이정표
  ctx.textAlign='center';for(const p of C.pts.slice(0,-1)){const x=gx(p[0]),y=gy(p[1]);if(x<-90||x>W+90)continue;ctx.fillStyle='#6b4a2c';ctx.fillRect(x-1.5*HS,y+2,3*HS,26*HS);
   ctx.font=`600 ${Math.round(10.5*Math.min(1.25,HS))}px sans-serif`;const w=ctx.measureText(p[2]).width+14;ctx.save();ctx.shadowColor='#0005';ctx.shadowBlur=4;ctx.fillStyle=lg(0,y+24*HS,0,y+42*HS,['#3a5d47','#24402f']);P();ctx.roundRect(x-w/2,y+24*HS,w,18*HS,4);ctx.fill();ctx.restore();ctx.fillStyle='#f3efe4';ctx.fillText(p[2],x,y+37*HS);const en=(window.STOP_EN||{})[p[2]];if(en){ctx.font=`italic 600 ${Math.round(9.5*Math.min(1.25,HS))}px sans-serif`;ctx.lineWidth=3;ctx.strokeStyle='#1d2e24cc';ctx.strokeText(en,x,y+53*HS);ctx.fillStyle='#fff';ctx.fillText(en,x,y+53*HS)}}
  // 쇠난간
  let pv=null;ctx.lineCap='round';for(let d=1560;d<=L-10;d+=22){const x=gx(d),y=gyd(d)-22*HS;if(x<-40||x>W+40){pv=null;continue}ctx.fillStyle=lg(x-2,0,x+2,0,['#9aa2aa','#4a5058']);ctx.fillRect(x-1.4*HS,y,2.8*HS,22*HS);
   if(pv){ctx.strokeStyle='#6a7078';ctx.lineWidth=1.4*HS;for(const o of[0,10*HS]){P();ctx.moveTo(pv[0],pv[1]+o);ctx.quadraticCurveTo((pv[0]+x)/2,(pv[1]+y)/2+o+3*HS,x,y+o);ctx.stroke()}}pv=[x,y]}
  // 위문
  {const x=gx(1650),y=gyd(1650),s=HS;if(x>-120*s&&x<W+120*s){ctx.fillStyle=lg(0,y-46*s,0,y,['#cfc8ba','#a39b8c']);ctx.fillRect(x-44*s,y-44*s,88*s,44*s);ctx.strokeStyle='rgba(80,70,60,.35)';ctx.lineWidth=1;for(let r=0;r<6;r++){const yy=y-44*s+r*7.3*s;P();ctx.moveTo(x-44*s,yy);ctx.lineTo(x+44*s,yy);ctx.stroke();for(let c=0;c<8;c++){const xx=x-44*s+(c*11+(r%2)*5.5)*s;P();ctx.moveTo(xx,yy);ctx.lineTo(xx,yy+7.3*s);ctx.stroke()}}
   ctx.fillStyle='#262a2c';P();ctx.moveTo(x-13*s,y);ctx.lineTo(x-13*s,y-24*s);ctx.arc(x,y-24*s,13*s,Math.PI,0);ctx.lineTo(x+13*s,y);ctx.fill();
   ctx.fillStyle='#a8392b';ctx.fillRect(x-30*s,y-58*s,60*s,12*s);ctx.fillStyle='#3f8f7f';ctx.fillRect(x-32*s,y-60*s,64*s,3*s);roof(x,y-58*s,72*s,14*s,s)}}
  // 정상 반석 + 태극기
  {const x=gx(L),y=gy(TOP);if(x>-120&&x<W+120){rockBlob(x+6*HS,y+10*HS,48*HS,7);ctx.fillStyle=lg(x+28*HS,0,x+32*HS,0,['#ddd','#777']);ctx.fillRect(x+28*HS,y-74*HS,3*HS,70*HS);flag(x+31*HS,y-74*HS,now,HS)}}}
 function rockBlob(x,y,w,n){const h=w*.5;ctx.fillStyle='rgba(0,0,0,.18)';P();ctx.ellipse(x+w*.1,y+h*.15,w*1.02,h*.5,0,0,7);ctx.fill();
  P();ctx.moveTo(x-w,y+h*.2);ctx.bezierCurveTo(x-w,y-h*.6,x-w*.4,y-h*1.05,x+w*.1,y-h);ctx.bezierCurveTo(x+w*.7,y-h*.95,x+w,y-h*.4,x+w,y+h*.2);ctx.closePath();
  ctx.fillStyle=lg(x-w,y-h,x+w*.6,y+h*.3,['#efe9de',C.rock.c1,C.rock.c2,'#8f877a']);ctx.fill();ctx.save();ctx.clip();
  ctx.strokeStyle='rgba(90,80,70,.28)';ctx.lineWidth=.9*HS;for(let i=0;i<4;i++){const u=R(n+i)*1.6-.8;P();ctx.moveTo(x+u*w,y-h*.9);ctx.quadraticCurveTo(x+u*w+6*HS,y-h*.2,x+u*w*1.2,y+h*.3);ctx.stroke()}
  ctx.fillStyle='rgba(60,55,50,.25)';for(let i=0;i<w*1.2;i++){ctx.fillRect(x+(R(n*9+i)*2-1)*w,y+(R(n*5+i)*1.2-.9)*h,1.1,1.1)}
  ctx.fillStyle='rgba(110,140,80,.55)';P();ctx.ellipse(x-w*.6,y+h*.12,w*.2,h*.12,0,0,7);ctx.fill();ctx.restore()}
 function flag(x,y,now,s){const w=30*s,h=20*s;ctx.save();ctx.translate(x,y);P();for(let i=0;i<=10;i++){const t=i/10;ctx.lineTo(t*w,Math.sin(now/220+t*4)*1.5*s*t)}for(let i=10;i>=0;i--){const t=i/10;ctx.lineTo(t*w,h+Math.sin(now/220+t*4)*1.5*s*t)}ctx.closePath();ctx.fillStyle='#fbfbfb';ctx.fill();ctx.strokeStyle='#bbb';ctx.lineWidth=.5;ctx.stroke();
  const cx=w/2,cy=h/2+Math.sin(now/220+2)*.75*s,r=5*s;ctx.fillStyle='#cd2e3a';P();ctx.arc(cx,cy,r,Math.PI,0);ctx.fill();ctx.fillStyle='#0047a0';P();ctx.arc(cx,cy,r,0,Math.PI);ctx.fill();ctx.fillStyle='#cd2e3a';P();ctx.arc(cx-r/2,cy,r/2,0,7);ctx.fill();ctx.fillStyle='#0047a0';P();ctx.arc(cx+r/2,cy,r/2,0,7);ctx.fill();
  ctx.fillStyle='#111';for(const[a,b]of[[4,3],[w/s-8,3],[4,h/s-6],[w/s-8,h/s-6]])for(let i=0;i<3;i++)ctx.fillRect(a*s,(b+i*1.2)*s,3.5*s,.7*s);ctx.restore()}
 // ── 등산객 ──
 function limb(ax,ay,l1,l2,a1,a2,w,c){const kx=ax+Math.sin(a1)*l1,ky=ay+Math.cos(a1)*l1,fx=kx+Math.sin(a2)*l2,fy=ky+Math.cos(a2)*l2;ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';P();ctx.moveTo(ax,ay);ctx.lineTo(kx,ky);ctx.lineTo(fx,fy);ctx.stroke();return[fx,fy]}
 function boot(x,y,s,a){ctx.save();ctx.translate(x,y);ctx.rotate(a||0);ctx.fillStyle='#4a2e1c';P();ctx.roundRect(-2.5*s,-2.5*s,8*s,4*s,2*s);ctx.fill();ctx.fillStyle='#2a1a10';ctx.fillRect(-2.5*s,1*s,8*s,1*s);ctx.restore()}
 // pose: walk/idle/hop/jump/hurt, ph: 걸음 위상
 function hiker(x,y,s,o,pose,ph,now){ctx.save();ctx.translate(x,y);
  ctx.fillStyle='rgba(0,0,0,.22)';P();ctx.ellipse(0,o.air?o.air:0,12*s,2.6*s,0,0,7);ctx.fill();
  const sw=pose==='walk'?Math.sin(ph):0,bob=pose==='walk'?Math.abs(Math.cos(ph))*1.6*s:0,hip=-19*s-bob*0;let lean=pose==='walk'?.12:pose==='hop'?.05:0;
  ctx.translate(0,-bob+ (pose==='walk'?1.6*s:0));const pd=shade(o.pants,.72),sd=shade(o.shirt,.75);
  // 다리
  const T=9.5*s,S=10*s,lw=4.6*s;let L1,L2,R1,R2,ba=0,bb=0;
  if(pose==='walk'){L1=sw*.55;L2=L1-Math.max(0,-Math.cos(ph))*.9;R1=-sw*.55;R2=R1-Math.max(0,Math.cos(ph))*.9}
  else if(pose==='hop'){L1=-.2;L2=-.35;R1=.9;R2=-.9;ba=.3}
  else if(pose==='jump'){L1=.8;L2=-.6;R1=.3;R2=-.9}
  else if(pose==='hurt'){L1=.4;L2=.5;R1=-.3;R2=-.2}else{L1=.08;L2=.08;R1=-.06;R2=-.06}
  // 뒷다리 → 배낭/몸 → 앞다리
  let f=limb(-1*s,hip,T,S,R1,R2,lw,pd);boot(f[0],f[1],s,R2*.3);
  const ls=pose==='walk'?-sw*.6:pose==='hop'||pose==='jump'?-2.4:pose==='hurt'?-2.8:.15;
  limb(-1*s,hip-15*s,7*s,7*s,-ls*.8,-ls*.8+(pose==='walk'?-.5:-.3),3.6*s,sd);
  ctx.save();ctx.rotate(lean);
  ctx.fillStyle=lg(-13*s,0,-4*s,0,['#c46a2a','#8a4a1e']);P();ctx.roundRect(-13*s,hip-20*s,9*s,15*s,3*s);ctx.fill();ctx.fillStyle='#3b6fb0';P();ctx.roundRect(-13.5*s,hip-23*s,9.5*s,4*s,2*s);ctx.fill();
  ctx.fillStyle=lg(-6*s,0,6*s,0,[o.shirt,sd]);P();ctx.roundRect(-6*s,hip-20*s,12*s,21*s,5*s);ctx.fill();ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(2*s,hip-19*s,1.2*s,8*s);
  ctx.fillStyle='#2b2f36';ctx.fillRect(-6*s,hip-2*s,12*s,2.6*s);
  // 머리
  const hy=hip-27*s;ctx.fillStyle='#f6cfa8';P();ctx.arc(1*s,hy,6.6*s,0,7);ctx.fill();ctx.fillStyle='#e9b58e';P();ctx.arc(-2.5*s,hy+1*s,2*s,0,7);ctx.fill();
  if(pose==='hurt'){ctx.strokeStyle='#222';ctx.lineWidth=1.1*s;for(const ex of[3.2]){P();ctx.moveTo(ex*s-1.4*s,hy-1.6*s);ctx.lineTo(ex*s+1.4*s,hy+.8*s);ctx.moveTo(ex*s+1.4*s,hy-1.6*s);ctx.lineTo(ex*s-1.4*s,hy+.8*s);ctx.stroke()}P();ctx.arc(4.5*s,hy+3.4*s,1.3*s,0,7);F('#8a2a2a')}
  else{P();ctx.arc(3.6*s,hy-.6*s,1*s,0,7);F('#222');ctx.strokeStyle='#a0503c';ctx.lineWidth=1*s;P();if(pose==='hop'||pose==='jump')ctx.arc(4.4*s,hy+2.6*s,1.6*s,0,Math.PI);else ctx.arc(4.2*s,hy+2*s,1.4*s,.2,Math.PI*.8);ctx.stroke()}
  P();ctx.arc(5*s,hy+1.6*s,1.4*s,0,7);F('rgba(240,120,110,.35)');
  ctx.fillStyle=lg(0,hy-9*s,0,hy-3*s,[o.cap,shade(o.cap,.8)]);P();ctx.ellipse(1*s,hy-4*s,11*s,2.4*s,0,0,7);ctx.fill();P();ctx.arc(1*s,hy-4.5*s,6.4*s,Math.PI,0);ctx.fill();ctx.fillStyle='rgba(0,0,0,.15)';ctx.fillRect(-5.4*s,hy-6*s,12.8*s,1.3*s);
  ctx.restore();
  // 앞다리
  f=limb(1*s,hip,T,S,L1,L2,lw,o.pants);boot(f[0],f[1],s,L2*.3);
  // 앞팔 + 지팡이
  const ra=pose==='walk'?sw*.6:ls;const h=limb(3*s,hip-15*s,7*s,7*s,ra*.8,ra*.8-.5,3.8*s,o.shirt);ctx.fillStyle='#f6cfa8';P();ctx.arc(h[0],h[1],2*s,0,7);ctx.fill();
  if(pose==='walk'||pose==='idle'){ctx.strokeStyle='#6b6f76';ctx.lineWidth=1.5*s;P();ctx.moveTo(h[0],h[1]-3*s);ctx.lineTo(h[0]+4*s,19*s+bob-1.6*s);ctx.stroke()}
  ctx.restore()}
 const ME={shirt:'#e8642a',cap:'#ffcf33',pants:'#3e4a5e'},SH=['#3a7bd5','#2aa876','#8e5bd6','#d64545','#f2b632','#ff7aa8'];
 // ── 장애물 ──
 function obs(o,now,near){let x=gx(o.d),y=gyd(o.d);if(x<-60||x>W+60)return;const s=HS;
  ctx.save();if(o.state===1&&o.k==='squirrel'){const t=(now-o.at)/600;if(t>1){ctx.restore();return}x-=t*40*s;y-=Math.sin(t*Math.PI)*30*s}
  if(o.state===2){const t=Math.min(1,(now-o.at)/400);ctx.globalAlpha=1-t*.5;ctx.translate(x+t*18*s,y);ctx.rotate(t*.5);ctx.translate(-x,-y)}
  if(near){const a=.35+.25*Math.sin(now/120);const g=ctx.createRadialGradient(x,y+2,0,x,y+2,30*s);g.addColorStop(0,`rgba(255,220,80,${a})`);g.addColorStop(1,'rgba(255,220,80,0)');ctx.fillStyle=g;P();ctx.ellipse(x,y+2,32*s,9*s,0,0,7);ctx.fill()}
  ctx.translate(x,y);ctx.scale(s,s);
  if(o.k==='rock'){ctx.fillStyle='rgba(0,0,0,.25)';P();ctx.ellipse(2,1,22,4.5,0,0,7);ctx.fill();P();ctx.moveTo(-20,1);ctx.bezierCurveTo(-22,-12,-12,-25,-2,-25);ctx.bezierCurveTo(10,-26,20,-15,21,1);ctx.closePath();ctx.fillStyle=lg(-18,-25,12,2,['#f1ece2','#cfc7b8','#9c9384','#6f685e']);ctx.fill();
   ctx.save();ctx.clip();ctx.strokeStyle='rgba(70,62,54,.45)';ctx.lineWidth=1;P();ctx.moveTo(-4,-24);ctx.quadraticCurveTo(0,-12,6,1);ctx.moveTo(9,-20);ctx.lineTo(14,-8);ctx.stroke();ctx.fillStyle='rgba(60,55,50,.3)';for(let i=0;i<24;i++)ctx.fillRect(-18+R(i)*36,-22+R(i+5)*22,1,1);ctx.fillStyle='rgba(255,255,255,.4)';P();ctx.ellipse(-8,-18,7,3,-.5,0,7);ctx.fill();ctx.restore();ctx.fillStyle='#6f9a4a';P();ctx.ellipse(-14,0,6,2.4,0,0,7);ctx.ellipse(15,0,4,2,0,0,7);ctx.fill()}
  else if(o.k==='branch'){ctx.fillStyle='rgba(0,0,0,.22)';P();ctx.ellipse(0,1,30,3.5,0,0,7);ctx.fill();ctx.lineCap='round';ctx.strokeStyle='#4f3520';ctx.lineWidth=7;P();ctx.moveTo(-30,-3);ctx.quadraticCurveTo(0,-12,30,-6);ctx.stroke();
   ctx.strokeStyle='#8a6440';ctx.lineWidth=2.4;P();ctx.moveTo(-27,-6);ctx.quadraticCurveTo(0,-15,28,-9);ctx.stroke();ctx.strokeStyle='#4f3520';ctx.lineWidth=3.2;P();ctx.moveTo(-8,-9);ctx.quadraticCurveTo(-12,-18,-17,-24);ctx.moveTo(10,-9);ctx.quadraticCurveTo(15,-18,20,-26);ctx.moveTo(15,-19);ctx.lineTo(10,-30);ctx.stroke();
   for(const[a,b,r,c]of[[-17,-26,.6,'#5d8a3e'],[21,-28,-.4,'#6f9c48'],[9,-32,.9,'#4f7a36'],[-13,-21,-.7,'#7aa852'],[24,-23,.3,'#b0702c']]){ctx.save();ctx.translate(a,b);ctx.rotate(r);ctx.fillStyle=c;P();ctx.moveTo(-6,0);ctx.quadraticCurveTo(0,-4,6,0);ctx.quadraticCurveTo(0,4,-6,0);ctx.fill();ctx.restore()}
   ctx.fillStyle='#c9a77a';P();ctx.ellipse(30,-6,2,3.2,0,0,7);ctx.fill()}
  else{const tw=Math.sin(now/180)*.25,hop=Math.abs(Math.sin(now/260))*2;ctx.translate(0,-hop);ctx.fillStyle='rgba(0,0,0,.22)';P();ctx.ellipse(0,1+hop,15,3,0,0,7);ctx.fill();
   ctx.save();ctx.translate(-9,-10);ctx.rotate(-.5+tw);const tg=lg(-10,-24,4,4,['#c48a56','#8a5530']);ctx.fillStyle=tg;P();ctx.moveTo(0,4);ctx.bezierCurveTo(-14,0,-14,-22,-4,-26);ctx.bezierCurveTo(4,-28,6,-16,2,-8);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(255,230,200,.5)';ctx.lineWidth=1;P();ctx.moveTo(-2,0);ctx.bezierCurveTo(-9,-6,-9,-18,-4,-22);ctx.stroke();ctx.restore();
   ctx.fillStyle=lg(-6,-18,10,0,['#b27443','#7f4b26']);P();ctx.ellipse(2,-9,10,8,-.1,0,7);ctx.fill();ctx.fillStyle='#3a2414';for(const o2 of[-2,1])ctx.fillRect(-5,-13+o2*2.4,12,.9);P();ctx.arc(11,-17,6.5,0,7);ctx.fillStyle='#a5683a';ctx.fill();
   ctx.fillStyle='#f1dcc0';P();ctx.ellipse(6,-6,4,5,0,0,7);ctx.fill();P();ctx.ellipse(14,-15,3,2.4,0,0,7);ctx.fill();P();ctx.moveTo(8,-21);ctx.lineTo(9,-28);ctx.lineTo(12.5,-22);ctx.fillStyle='#8f5a32';ctx.fill();
   P();ctx.arc(13,-18.5,1.7,0,7);F('#111');P();ctx.arc(13.5,-19,.6,0,7);F('#fff');P();ctx.arc(17.2,-16,1,0,7);F('#3a2014');
   ctx.fillStyle='#e8b98a';P();ctx.ellipse(12,-11,2.5,1.6,0,0,7);ctx.fill();ctx.fillStyle='#6b3f22';P();ctx.ellipse(-2,0,3,1.6,0,0,7);ctx.ellipse(8,0,3,1.6,0,0,7);ctx.fill()}
  ctx.restore()}
 // ── 메인 ──
 let walkPh=0,lastDS=0;
 function draw(now){layout();const m=players.find(p=>p.id===me),sh=m?m.h:0,walkMode=true;
  if(walkMode)dS=RH.pos(sh);else dS+=(sh-dS)*.15;if(sh===0&&dS>sh+50)dS=0;
  camX+=(dS-camX)*(walkMode?.35:.15);camY+=(ground(camX)-camY)*.12;if(Math.abs(dS-camX)>200){camX=dS;camY=ground(dS)}
  const k=Math.min(1,camX/L);sky(now,k);const ny=far(now,k);mid(now,ny);terrain(now);
  // 다른 등산객
  ctx.textAlign='center';const labels=[];
  for(const p of players.filter(p=>p.id!==me).sort((a,b)=>a.h-b.h)){const pd=p.h+((p.id*37)%9-4),x=gx(pd);if(x<-40||x>W+40)continue;const since=Math.max(0,now-(walk[p.id]||-1e9)),y=gyd(pd);
   hiker(x,y,HS*.9,{shirt:SH[p.c%6],cap:'#f1efe6',pants:'#3a4c70'},since<500?'walk':'idle',since/125*Math.PI/2,now);if(Math.abs(x-gx(dS))>40*HS)labels.push([x,y-52*HS,p.name])}
  for(const g of FX.ghosts(now)){const x=gx(g.d);if(x<-40||x>W+40)continue;const y=gyd(g.d);if(!isFinite(g.d))continue;ctx.save();ctx.globalAlpha=.4;try{hiker(x,y,HS*.95,{shirt:g.c,cap:'#ffffff',pants:'#4a5470'},'walk',g.d*.9,now)}finally{ctx.restore()}labels.push([x,y-52*HS,g.name])}
  FX.world(now,gx,gyd,HS);
  let ry=0;
  if(m){const x=gx(dS),y=gyd(dS);let pose,air=0;walkPh+=(dS-lastDS)*.9;lastDS=dS;
   {const r=RH.anim(now);air=r.y*1.4*HS;ry=air;pose=r.pose[0]==='h'?'hop':r.pose==='idle'?'idle':'walk'}
   myPose=pose;hiker(x,y-air,HS*1.08,{...ME,air},pose,walkPh,now);
   ctx.font=`bold ${Math.round(11*Math.min(1.3,HS))}px sans-serif`;pill('Me · '+m.name,x,y-air-58*HS,'#e8642a')}
  ctx.font='11px sans-serif';for(const[x,y,t]of labels)pill(t,x,y,'rgba(0,0,0,.5)');
  ctx.font='600 12px sans-serif';pill(BK.spot(dS)+'  ·  '+zone(dS).label,W/2,topY()+22,'rgba(0,0,0,.42)');
  FX.overlay(now);RH.hud(now);ctx.textAlign='left'}
 function pill(t,x,y,c){const w=ctx.measureText(t).width+16,h=19;ctx.fillStyle=c;P();ctx.roundRect(x-w/2,y-h+5,w,h,h/2);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(t,x,y)}
 const topY=()=>{const r=document.getElementById('chg').getBoundingClientRect();return r.bottom+2};
 const sx=d=>gx(d),sy=d=>gyd(d)-40*HS;
 return{draw,obs,sx,sy,topY,pose:()=>myPose,scale:()=>HS}})();
