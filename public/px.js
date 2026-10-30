// 픽셀아트 렌더러(북한산) + 왼발/오른발 리듬 걷기. 모든 그림은 코드로 직접 그린 오리지널 도트.
const PX=(()=>{
 const L=BK.L,PXM=1.6,VS=1.5,OL='#1a1420';
 const R=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
 const hex=s=>[1,3,5].map(i=>parseInt(s.substr(i,2),16));
 // 스프라이트: 평면색으로 그리고 자동 외곽선
 function spr(w,h,fn,ol=OL){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');const P=(col,a,b,ww=1,hh=1)=>{x.fillStyle=col;x.fillRect(a,b,ww,hh)};fn(P,x);
  if(ol){const d=x.getImageData(0,0,w,h),s=d.data,o=new Uint8ClampedArray(s),[r,g,b]=hex(ol);
   for(let j=0;j<h;j++)for(let i=0;i<w;i++){const k=(j*w+i)*4;if(s[k+3]>128)continue;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const a=i+dx,bb=j+dy;if(a>=0&&a<w&&bb>=0&&bb<h&&s[(bb*w+a)*4+3]>128){o[k]=r;o[k+1]=g;o[k+2]=b;o[k+3]=255;break}}}
   d.data.set(o);x.putImageData(d,0,0)}return c}
 const flip=c=>{const f=document.createElement('canvas');f.width=c.width;f.height=c.height;const x=f.getContext('2d');x.scale(-1,1);x.drawImage(c,-c.width,0);return f};
 // ── 등산객 (22x31, 발바닥 y=29) ──
 function hikerSpr(shirt,cap,pants,pose){const sd=shade(shirt),cd=shade(cap),pd=shade(pants);return spr(22,31,P=>{
  const legs={w0:[[6,29],[14,29]],w1:[[9,27],[11,29]],w2:[[14,29],[6,29]],w3:[[11,29],[9,27]],idle:[[9,29],[12,29]],
   h0:[[4,22],[11,29]],h1:[[3,20],[12,28]],jump:[[7,25],[14,24]],hurt:[[7,29],[14,28]]}[pose];
  const isH=pose==='h0'||pose==='h1';const up=pose==='w1'||pose==='w3'||pose==='h1'?1:0,y0=-up;
  const leg=([fx,fy],col,hx)=>{if(isH&&col===pd){P(col,hx,19+y0,3,3);P(col,fx,fy-2,hx-fx+1,3);P('#7a3c1c',fx-1,fy-2,2,3);return}
   const y1=fy-2;for(let y=19+y0;y<=y1;y++){const t=(y-19-y0)/Math.max(1,y1-19-y0);P(col,Math.round(hx+(fx-hx)*t),y,3,1)}P('#7a3c1c',fx,fy-2,4,2);P('#4a2410',fx,fy-1,4,1)};
  leg(legs[0],pd,8);leg(legs[1],pants,10);
  // 배낭
  P('#3c7cbc',3,8+y0,6,2);P('#a0602c',3,10+y0,6,9);P('#c88040',4,11+y0,1,6);P('#704018',3,15+y0,6,1);
  // 몸통
  P(shirt,8,11+y0,7,8);P(sd,8,17+y0,7,2);P('#ffe8a0',12,11+y0,1,3);
  // 팔
  const armUp=isH||pose==='jump'||pose==='hurt';const swing=pose==='w0'?-1:pose==='w2'?1:0;
  if(armUp){P(shirt,13,7+y0,2,5);P('#fcc8a0',13,5+y0,2,2);P(sd,6,8+y0,2,4);P('#fcc8a0',5,6+y0,2,2)}
  else{const ax=11+swing*2;P(sd,ax,12+y0,3,5);P('#fcc8a0',ax+swing,17+y0,3,2);P('#8a5a2a',ax+3+swing,15+y0,1,14-y0*0)}
  // 머리
  P('#fcc8a0',9,3+y0,7,8);P('#fcc8a0',16,6+y0,1,2);P('#e8a078',11,7+y0,1,2);P('#5a3418',9,5+y0,2,4);
  if(pose==='hurt'){P(OL,13,5+y0,1,1);P(OL,15,5+y0,1,1);P(OL,14,6+y0,1,1);P(OL,13,7+y0,1,1);P(OL,15,7+y0,1,1)}
  else{P(OL,14,5+y0,1,2);P('#ffffff',14,5+y0,1,1)}
  P('#f08870',12,8+y0,2,1);if(isH||pose==='hurt')P('#a02020',14,9+y0,2,1);else P('#b05040',14,9+y0,2,1);
  // 모자(챙 넓은 등산모)
  P(cap,9,0+y0,7,3);P(cd,7,3+y0,12,1);P(cap,8,2+y0,9,1);P('#ffffff',10,0+y0,2,1)})}
 const shade=s=>{const[a,b,c]=hex(s);return'#'+[a,b,c].map(v=>Math.round(v*.7).toString(16).padStart(2,'0')).join('')};
 const POSES=['w0','w1','w2','w3','idle','h0','h1','jump','hurt'],SH=['#e8553b','#3a7bd5','#f2b632','#8e5bd6','#2aa876','#ff7aa8'];
 const HK={me:{},o:[]};
 function buildHikers(){for(const p of POSES)HK.me[p]=hikerSpr('#f08020','#ffd040','#4a5468',p);
  SH.forEach((c,i)=>{HK.o[i]={};for(const p of POSES)HK.o[i][p]=hikerSpr(c,'#f4f0e4','#3a4c70',p)})}
 // ── 나무·바위·장애물 ──
 const S={};
 function build(){buildHikers();
  S.pine=spr(26,44,P=>{P('#a04c30',12,24,3,19);P('#c86848',12,26,1,14);P('#a04c30',10,30,2,1);
   for(const[x,y,w]of[[3,24,20],[5,17,16],[7,10,13],[9,4,9],[11,1,4]]){P('#28603a',x,y,w,5);P('#3c8c4c',x+2,y,w-6,2);P('#58ac58',x+3,y,2,1)}});
  const roundT=(a,b,c)=>spr(26,34,P=>{P('#6a4a2a',11,20,4,13);P('#8a6a3a',11,22,1,9);
   for(const[x,y,w,h]of[[4,6,18,12],[2,10,22,9],[6,2,14,5],[5,17,16,4]])P(a,x,y,w,h);for(const[x,y,w,h]of[[6,4,8,4],[4,10,5,3],[14,8,6,3]])P(b,x,y,w,h);P(c,7,4,2,1);P(c,15,8,2,1)});
  S.oak=roundT('#3c8c3c','#68b848','#a8e070');S.oakF=roundT('#c06828','#e8983c','#ffd070');S.maple=roundT('#b8302c','#e85840','#ffa080');
  S.bush=spr(20,10,P=>{P('#2c7c3c',2,3,16,7);P('#2c7c3c',5,1,10,3);P('#58ac50',5,2,4,2);P('#58ac50',12,4,3,1)});
  S.tuft=spr(7,5,P=>{P('#3c9c3c',1,2,5,3);P('#3c9c3c',3,0,1,2);P('#68c050',1,1,1,1);P('#68c050',5,1,1,1)},null);
  S.rock=spr(22,15,P=>{P('#b8b0a0',2,5,18,9);P('#b8b0a0',5,2,12,3);P('#d8d0c0',5,3,9,3);P('#f0ece0',6,3,4,1);P('#8c8478',3,12,17,2);P('#8c8478',13,6,1,4);P('#68a048',2,13,4,1)});
  S.branch=spr(32,14,P=>{P('#6a4020',1,9,30,3);P('#9a6438',2,9,27,1);P('#4a2810',1,11,30,1);P('#6a4020',8,4,2,5);P('#6a4020',20,3,2,6);P('#6a4020',22,1,2,2);
   P('#4c9c3c',5,2,4,3);P('#4c9c3c',23,0,5,3);P('#78c050',6,2,2,1);P('#4c9c3c',14,6,3,2)});
  for(const f of[0,1])S['sq'+f]=spr(20,18,P=>{const t=f?1:0;P('#a85c28',1,2+t,6,10-t);P('#a85c28',3,0+t,5,3);P('#d08848',2,3+t,3,6);P('#a85c28',6,9,8,6);P('#a85c28',12,5,5,5);
   P('#a85c28',13,3,2,2);P('#f4dcb4',9,12,4,3);P('#f4dcb4',15,8,2,2);P(OL,15,6,1,1);P('#6a3418',7,15,3,2);P('#6a3418',12,15,3,2);P('#4a2010',17,8,1,1)});
  S.sign=spr(16,22,P=>{P('#7a4a24',7,6,3,15);P('#a06030',1,1,14,7);P('#c88848',2,2,12,1);P('#ffffff',3,4,9,1);P('#704018',1,7,14,1)});
  S.gate=spr(64,46,P=>{P('#9c9488',2,20,60,25);for(let y=22;y<45;y+=5)for(let x=2+(y%10?0:4);x<62;x+=8)P('#7c7468',x,y,1,4),P('#7c7468',2,y+4,60,1);
   P('#b8b0a4',2,20,60,2);P(OL,22,27,20,18);P(OL,24,25,16,2);P(OL,26,24,12,1);P('#2a2430',23,28,18,17);
   P('#a83828',10,12,44,8);P('#3c9c8c',10,12,44,2);P('#e8c840',12,15,40,1);P('#3c4450',2,8,60,4);P('#3c4450',6,5,52,3);P('#58606c',4,8,56,1);P('#3c4450',0,6,4,2);P('#3c4450',60,6,4,2);P('#3c4450',20,2,24,3)});
  S.temple=spr(44,30,P=>{P('#f0e8d8',6,16,32,13);P('#a83828',6,16,2,13);P('#a83828',21,16,2,13);P('#a83828',36,16,2,13);P('#6a3418',13,20,6,9);P('#6a3418',25,20,6,9);
   P('#3c9c8c',5,13,34,3);P('#e8c840',5,15,34,1);P('#3c4450',2,9,40,4);P('#3c4450',6,6,32,3);P('#3c4450',0,7,3,2);P('#3c4450',41,7,3,2);P('#58606c',3,9,38,1);P('#b8a888',3,28,38,2)});
  S.center=spr(40,26,P=>{P('#e8e0d0',3,10,34,15);P('#506c88',7,14,8,6);P('#506c88',25,14,8,6);P('#6a4020',17,15,6,10);P('#5c6c58',1,5,38,5);P('#7c8c70',3,4,34,1);P('#a8b8a0',2,9,36,1)});
  S.flag=spr(20,14,P=>{P('#ffffff',1,1,18,12);P('#d02c3c',7,4,6,3);P('#1048a8',7,7,6,3);P('#d02c3c',6,5,1,3);P('#1048a8',13,7,1,2);for(const[a,b]of[[2,2],[15,2],[2,10],[15,10]])P('#000',a,b,3,2)});
  S.cloud=spr(36,16,P=>{P('#ffffff',4,6,28,8);P('#ffffff',8,3,10,4);P('#ffffff',17,1,10,6);P('#ffffff',1,9,34,4);P('#d8e8ff',3,12,30,1);P(OL,12,6,1,2);P(OL,20,5,1,2)},'#6c88c8');
  S.namsan=spr(9,34,P=>{P('#7c8cb8',3,8,3,26);P('#7c8cb8',1,10,7,4);P('#a8b8e0',4,0,1,8);P('#c8d4f0',2,11,5,1)},null);
  S.lotte=spr(11,60,P=>{for(let y=0;y<60;y++){const w=Math.max(1,Math.round(1+y/60*8));P(y%6?'#8c9cc8':'#a8b8e0',5-Math.floor(w/2),y,w,1)}},null)}
 // ── 화면 버퍼 ──
 let cv2,b,BW=0,BH=0,SC=1,sky,camX=0,camY=0,dS=0,lastW=0,lastH=0,built=false,labels=[];
 function fit(){if(W===lastW&&H===lastH&&cv2)return;lastW=W;lastH=H;SC=Math.max(1,Math.floor(Math.min(H*DPR/220,W*DPR/180)));BW=Math.ceil(W*DPR/SC);BH=Math.ceil(H*DPR/SC);
  cv2=cv2||document.createElement('canvas');cv2.width=BW;cv2.height=BH;b=cv2.getContext('2d');b.imageSmoothingEnabled=false;
  sky=document.createElement('canvas');sky.width=BW;sky.height=BH;const s=sky.getContext('2d'),cols=['#3c64d0','#5080e8','#6c9cf4','#90bcf8','#b8d8fc','#e0f0fc'],band=BH*.5/cols.length;
  for(let y=0;y<BH;y++){const f=y/band,i=Math.min(cols.length-1,Math.floor(f)),fr=f-i;s.fillStyle=cols[i];s.fillRect(0,y,BW,1);if(i<cols.length-1&&fr>.75){s.fillStyle=cols[i+1];for(let x=(y&1)+(fr>.88?0:0);x<BW;x+=fr>.88?1+((y&1)):2)s.fillRect(x,y,1,1)}}}
 const zone=d=>BK.zoneOf(Math.max(0,Math.min(L-1,d)));
 const altX=d=>d>L?BK.alt(L)-(d-L)*.6:d<0?BK.alt(0):BK.alt(d);
 function gW(wx){const d=wx/PXM,z=zone(d),bw=d<0||d>L?4:z.steps?10:z.slab?6:3;const x0=Math.floor(wx/bw)*bw;return Math.round(altX(x0/PXM)*VS)}
 let AY=0,cx=0,cy=0;const by=wy=>AY-(wy-cy),bx=wx=>wx-cx;
 const put=(c,x,y)=>b.drawImage(c,Math.round(x),Math.round(y));
 // ── 배경 ──
 function background(now,k){b.drawImage(sky,0,0);
  for(let i=0;i<5;i++){const x=((R(i)*BW*1.5-now*.004*(1+R(i+3))-cx*.03)%(BW+60)+BW+60)%(BW+60)-40,y=8+R(i+7)*BH*.22;put(S.cloud,x,y)}
  const hy=Math.round(BH*.47+(cy-480)*.06),p1=cx*.08;
  // 먼 산(관악·청계 능선)
  b.fillStyle='#98a8d8';for(let x=0;x<BW;x++){const X=x+p1*.6,t=Math.round(hy-8-Math.abs(Math.sin(X*.017))*10-Math.sin(X*.05)*3);b.fillRect(x,t,1,hy-t+4)}
  // 강남 도심 + 롯데월드타워
  for(let i=Math.floor(p1/9)-1;i<(p1+BW)/9+1;i++){const x=Math.round(i*9-p1),h=3+Math.round(R(i)*10);b.fillStyle=i%3?'#8898c8':'#7c8cc0';b.fillRect(x,hy-h,7,h+2);if(h>6){b.fillStyle='#c8d8f4';for(let y=hy-h+2;y<hy;y+=3)b.fillRect(x+2,y,1,1),b.fillRect(x+4,y,1,1)}}
  put(S.lotte,Math.round(((BW*.78-p1)%(BW*2)+BW*2)%(BW*2)),hy-58);
  // 한강
  b.fillStyle='#4c84e0';b.fillRect(0,hy+1,BW,5);b.fillStyle='#b8dcff';for(let x=0;x<BW;x+=11){const xx=Math.round((x-p1*1.1+now*.01)%BW+BW)%BW;b.fillRect(xx,hy+2+(x%3),4,1)}
  // 강북 도심 + 남산
  const p2=cx*.12,ny=hy+6;b.fillStyle='#7888b8';for(let x=0;x<BW;x++){const X=x+p2;b.fillRect(x,ny+Math.round(8-Math.max(0,22-Math.abs((X%700)-260))*.4),1,BH)}
  const nx=Math.round(((260-p2)%700+700)%700);put(S.namsan,nx-4,ny-27);
  for(let i=Math.floor(p2/8)-1;i<(p2+BW)/8+1;i++){const x=Math.round(i*8-p2),h=2+Math.round(R(i+99)*7);b.fillStyle=i%2?'#6c7cb0':'#6474a8';b.fillRect(x,ny+10-h,6,h+2)}
  // 화강암 봉우리: 인수봉·백운대·만경대 (가까워질수록 크게)
  const p3=cx*.12,hm=Math.min(1.35,Math.max(.85,BH/300)),base=Math.round(ny+22+(cy-480)*.12);
  const q=BW*.5+40,peaks=[[q,60,92*hm],[q+110,48,104*hm],[q+200,54,80*hm],[q-150,44,48*hm]];
  for(let x=0;x<BW;x++){const X=x+p3;let top=1e9;for(const[c,w,h]of peaks){const u=(X-c)/w;if(Math.abs(u)<1){const t=base-h*Math.pow(1-u*u,.6)+Math.abs(Math.sin(X*.9))*1.5*(Math.abs(u)>.4?1:0);if(t<top)top=t}}
   const hill=base+10-Math.round(Math.sin(X*.02)*6+Math.sin(X*.07)*2);
   if(top<hill){top=Math.round(top);b.fillStyle='#d4ccbc';b.fillRect(x,top,1,hill-top);if(Math.round(X)%6===0){b.fillStyle='#b4ac9c';b.fillRect(x,top+3,1,hill-top-3)}if(Math.round(X)%6===2){b.fillStyle='#ece6da';b.fillRect(x,top+2,1,(hill-top)/2)}b.fillStyle='#7c7468';b.fillRect(x,top,1,1)}
   b.fillStyle='#3c7c5c';b.fillRect(x,hill,1,BH);b.fillStyle='#2c6c4c';b.fillRect(x,hill,1,1);if((Math.round(X)*7)%5===0){b.fillStyle='#4c9c6c';b.fillRect(x,hill+2+(Math.round(X)%4),1,2)}}
  for(const[c,,h,nm]of[[peaks[0][0],0,peaks[0][2],'인수봉'],[peaks[1][0],0,peaks[1][2],'백운대'],[peaks[2][0],0,peaks[2][2],'만경대']]){const x=c-p3;if(x>-20&&x<BW+20)labels.push([x,base-h-4,nm,'#ffffffcc',10])}
  // 도선사 + 북한산성 성곽
  const p4=cx*.5,ty=base+14;const tx=Math.round(BW*.55+80-p4);if(tx>-50&&tx<BW+10)put(S.temple,tx,ty-22);
  b.fillStyle='#a8a090';for(let x=0;x<BW;x++){const X=x+p4;if(X%900>500&&X%900<760){const y=Math.round(ty+4-Math.sin(X*.03)*4);b.fillRect(x,y,1,3);if(X%4<2)b.fillRect(x,y-1,1,1)}}}
 // ── 지형 ──
 function terrain(now){const x0=cx-40,x1=cx+BW+40;
  // 뒤쪽 나무
  for(let wx=Math.floor(x0/14)*14;wx<x1;wx+=14){const d=wx/PXM;if(d<-60||d>L-20)continue;const z=zone(d);if(R(wx+21)>z.dens*.85)continue;const t=z.trees[(R(wx+8)*z.trees.length)|0];
   const sp=t==='pine'?S.pine:t==='maple'?S.maple:R(wx+3)<.3?S.oakF:S.oak;put(sp,bx(wx)-13+R(wx)*6,by(gW(wx))-sp.height+3)}
  // 탐방지원센터 · 위문 · 이정표
  put(S.center,bx(-70*PXM)-20,by(gW(-70*PXM))-25);
  for(const p of BK.P.slice(0,-1)){const wx=p[0]*PXM;if(wx<x0||wx>x1)continue;put(S.sign,bx(wx)-8,by(gW(wx))-21);labels.push([bx(wx),by(gW(wx))+14,p[2],'#fff',9,1])}
  // 땅 타일
  for(let x=0;x<BW;x++){const wx=x+cx,d=wx/PXM,z=zone(d),gt=by(gW(wx));if(gt>=BH)continue;
   if(z.slab&&d>=0&&d<=L+40){b.fillStyle='#d8d0c0';b.fillRect(x,gt,1,BH-gt);b.fillStyle='#f4f0e6';b.fillRect(x,gt,1,2);b.fillStyle='#8c8478';b.fillRect(x,gt-1,1,1);
    if(((wx%18)+18)%18===0){b.fillStyle='#a89c8c';b.fillRect(x,gt+3,1,BH)}b.fillStyle='#a89c8c';for(let y=gt+9+((Math.floor(wx/18)&1)*6);y<BH;y+=12)b.fillRect(x,y,1,1);
    if(R(Math.floor(wx/3))>.93){b.fillStyle='#b8b0a0';b.fillRect(x,gt+4+(R(wx)*8|0),1,3)}}
   else if(z.steps&&d>=0){b.fillStyle='#b4a080';b.fillRect(x,gt,1,BH-gt);b.fillStyle='#a06030';b.fillRect(x,gt,1,3);b.fillStyle='#c88040';b.fillRect(x,gt,1,1);b.fillStyle='#4a2810';b.fillRect(x,gt-1,1,1);b.fillRect(x,gt+3,1,1);
    if(((wx%10)+10)%10===9){b.fillStyle='#4a2810';b.fillRect(x,gt-1,1,6)}b.fillStyle='#8c7c60';for(let y=gt+8+((Math.floor(wx/12)&1)*4);y<BH;y+=8)b.fillRect(x,y,1,1);if(((wx%12)+12)%12===0){b.fillStyle='#8c7c60';b.fillRect(x,gt+5,1,BH)}}
   else{b.fillStyle='#c88848';b.fillRect(x,gt,1,BH-gt);b.fillStyle='#e0b070';b.fillRect(x,gt,1,2);b.fillStyle='#58b048';b.fillRect(x,gt+2,1,3);b.fillStyle='#286c28';b.fillRect(x,gt+5,1,1);b.fillRect(x,gt-1,1,1);
    for(let k=0;k<6;k++){const yy=gt+9+k*7+(R(wx*.37|0+k)*4|0);if(R(Math.floor(wx/2)*13+k)>.82){b.fillStyle=k&1?'#a06830':'#e0a860';b.fillRect(x,yy,1,1)}}}}
  // 앞쪽 덤불 / 풀
  for(let wx=Math.floor(x0/23)*23;wx<x1;wx+=23){const d=wx/PXM;if(d<0||d>L)continue;const z=zone(d);if(R(wx+5)>(z.slab?.15:.6))continue;put(S.bush,bx(wx)-10,by(gW(wx))+12+R(wx)*14)}
  for(let wx=Math.floor(x0/9)*9;wx<x1;wx+=9){const d=wx/PXM;if(d<0||d>L||zone(d).slab||R(wx+4)>.4)continue;put(S.tuft,bx(wx),by(gW(wx))-3)}
  // 쇠난간
  let pv=null;for(let d=1560;d<=L-10;d+=20){const wx=d*PXM,x=bx(wx),y=by(gW(wx))-11;if(x<-40||x>BW+40){pv=null;continue}b.fillStyle=OL;b.fillRect(x-1,y,3,11);b.fillStyle='#8c949c';b.fillRect(x,y,1,10);
   if(pv){b.fillStyle='#5c646c';const n=x-pv[0];for(let i=0;i<=n;i++){const t=i/n,yy=Math.round(pv[1]+(y-pv[1])*t+Math.sin(t*Math.PI)*2);b.fillRect(pv[0]+i,yy+1,1,1);b.fillRect(pv[0]+i,yy+6,1,1)}}pv=[x,y]}
  // 위문(백운봉암문)
  {const wx=1650*PXM;put(S.gate,bx(wx)-32,by(gW(wx))-44)}
  // 정상 바위 + 태극기
  {const wx=L*PXM,x=bx(wx),y=by(gW(wx));if(x>-60&&x<BW+60){b.fillStyle=OL;b.fillRect(x+10,y-40,2,40);b.fillStyle='#e0e0e0';b.fillRect(x+10,y-40,1,38);const f=Math.floor(now/250)%2;put(S.flag,x+12,y-40+f)}}}
 function obs(o,now,near){const wx=o.d*PXM;let x=bx(wx),y=by(gW(wx));if(x<-40||x>BW+40)return;
  if(o.state===1&&o.k==='squirrel'){const t=(now-o.at)/600;if(t>1)return;x-=t*20;y-=Math.sin(t*Math.PI)*14}
  if(o.state===2){const t=(now-o.at)/400;if(Math.floor(now/80)%2&&t<1.5)return;x+=Math.min(1,t)*8}
  if(near&&Math.floor(now/150)%2){b.fillStyle='#ffe040';b.fillRect(Math.round(x)-12,Math.round(y)+1,24,1)}
  const s=o.k==='rock'?S.rock:o.k==='branch'?S.branch:S['sq'+(Math.floor(now/200)%2)];put(s,x-s.width/2,y-s.height+2)}
 function hikerAt(set,pose,x,y,face=1){const s=set[pose];put(face<0?flip(s):s,x-11,y-29)}
 // ── 메인 그리기 ──
 let myPose='idle';
 function draw(now){if(!built){build();built=true}fit();labels=[];
  const m=players.find(p=>p.id===me),sh=m?m.h:0;const walkMode=!GAME.on;
  if(walkMode)dS=RH.pos(sh);else dS+=(sh-dS)*.15;if(sh===0&&dS>sh+50)dS=0;
  AY=Math.round(BH*.62);const tx=dS*PXM-BW*.36,ty=gW(dS*PXM);camX+=(tx-camX)*(walkMode?.5:.2);camY+=(ty-camY)*.15;if(Math.abs(tx-camX)>200){camX=tx;camY=ty}cx=Math.round(camX);cy=Math.round(camY);
  background(now,dS/L);terrain(now);
  // 다른 등산객
  for(const p of players){if(p.id===me)continue;const pd=p.h+((p.id*37)%9-4),wx=pd*PXM,x=bx(wx);if(x<-20||x>BW+20)continue;const since=Math.max(0,now-(walk[p.id]||-1e9)),f=since<500?['w0','w1','w2','w3'][Math.floor(since/125)%4]:'idle';
   hikerAt(HK.o[p.c%6],f,x,by(gW(wx)));if(Math.abs(x-(dS*PXM-cx))>36)labels.push([x,by(gW(wx))-34,p.name,'#fff',10,2])}
  if(GAME.on)GAME.under(now);
  if(m){const wx=dS*PXM,x=bx(wx);let y=by(gW(wx)),pose;
   if(GAME.on){const air=GAME.airY(now)*DPR/SC;y-=air;pose=GAME.stunned()?'hurt':air>0?'jump':GAME.moving()?['w0','w1','w2','w3'][Math.floor(dS*PXM/5)%4]:'idle'}
   else{const r=RH.anim(now);y-=r.y;pose=r.pose}
   myPose=pose;b.fillStyle='#00000033';b.fillRect(x-7,by(gW(wx))+1,14,1);hikerAt(HK.me,pose,x,y)}
  // 버퍼 → 화면(정수 배율)
  ctx.imageSmoothingEnabled=false;ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(cv2,0,0,BW,BH,0,0,BW*SC,BH*SC);ctx.setTransform(DPR,0,0,DPR,0,0);
  const k=SC/DPR;ctx.textAlign='center';
  for(const[x,y,t,c,fs,kind]of labels){ctx.font=`bold ${fs+(kind===1?1:0)}px sans-serif`;const X=Math.round(x*k),Y=Math.round(y*k);
   if(kind){const w=ctx.measureText(t).width+10;ctx.fillStyle=kind===1?'#2e4a38':'#000000a0';ctx.fillRect(X-w/2,Y-fs,w,fs+6);ctx.fillStyle=OL;ctx.fillRect(X-w/2,Y+6,w,2)}
   else{ctx.strokeStyle='#00000080';ctx.lineWidth=3;ctx.strokeText(t,X,Y)}ctx.fillStyle=c;ctx.fillText(t,X,Y+(kind?1:0))}
  if(m)ctx.font='bold 11px sans-serif',pill('나 · '+m.name,Math.round((dS*PXM-cx)*k),Math.round((by(gW(dS*PXM))-36)*k)-(GAME.on?GAME.airY(now):RH.anim(now).y*k),'#f0602a');
  // 현재 지점 · 구간
  ctx.font='600 12px sans-serif';pill(BK.spot(dS)+'  ·  '+zone(dS).label,W/2,topY()+22,'#00000080');
  if(!GAME.on)RH.hud(now);ctx.textAlign='left'}
 function pill(t,x,y,c){const w=ctx.measureText(t).width+14;ctx.fillStyle=c;ctx.fillRect(x-w/2,y-13,w,18);ctx.fillStyle='#ffffff40';ctx.fillRect(x-w/2,y-13,w,1);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(t,x,y)}
 const topY=()=>{const r=document.getElementById('chg').getBoundingClientRect();return r.bottom+2};
 const sx=d=>(d*PXM-cx)*SC/DPR,sy=d=>(by(gW(d*PXM))-30)*SC/DPR;
 return{draw,obs,sx,sy,topY,pose:()=>myPose,scale:()=>SC}})();

// ── 왼발/오른발 리듬 걷기 ──
const RH=(()=>{
 const HOP=3.2,BASE=6,STEPV=1.5,MAXL=8;
 let last=null,lastT=0,v=0,lvl=0,combo=0,same=0,hop=false,fb=null,acc=0,d=0,beat0=0,pressAt=-1e9,foot=null,best=0,tPrev=0,sent=0;
 const I=()=>560-lvl*30;
 function reset(){last=null;lastT=0;v=0;lvl=0;combo=0;same=0;hop=false;fb=null;acc=0;d=0;beat0=0;sent=0}
 function press(f){const now=performance.now();if(!me||!ws||ws.readyState!==1||!document.getElementById('card').classList.contains('hide'))return;
  let T=I();if(!beat0||now-lastT>2000)beat0=now;const ph=((now-beat0)%T+T)%T,off=Math.min(ph,T-ph);
  const nearest=ph<T/2?now-ph:now+T-ph;let res;
  if(f===last){same++;combo=0;hop=true;lvl=Math.max(0,lvl-(same===1?2:0));res=same===1?['발 꼬임!','MISS','#ff6b5a']:['깡깡이~','HOP','#ffb0e0']}
  else{same=0;hop=false;if(off<75){combo++;lvl=Math.min(MAXL,lvl+(combo%2===0?1:0));res=['완벽!','PERFECT','#ffe040']}
   else if(off<150){combo++;lvl=Math.min(MAXL,lvl+(combo%4===0?1:0));res=['좋아!','GOOD','#7be08f']}
   else{combo=0;lvl=Math.max(0,lvl-1);res=['박자 놓침','MISS','#ff6b5a']}}
  best=Math.max(best,combo);
  T=I();beat0=nearest;// 속도가 바뀌어도 박자 위상 유지
  fb={t:res[0],e:res[1],c:res[2],at:now,combo};last=f;lastT=now;pressAt=now;foot=f;
  v=Math.max(v,hop?HOP:BASE*.6)}
 function tick(now){const dt=Math.min(.1,(now-(tPrev||now))/1000);tPrev=now;const active=now-lastT<I()*1.6+150;
  const vT=active?(hop?HOP:BASE+lvl*STEPV):0;v+=(vT-v)*Math.min(1,dt*(vT<v?3:4));if(v<.05)v=0;
  if(hop){const t=(now-pressAt)/320;if(t>1)return} // 깡깡이: 뛰는 동안만 앞으로
  const L=BK.L;const dd=v*dt;if(d+dd>=L)return mv(L-d);mv(dd)}
 function mv(dd){d+=dd;acc+=dd;while(acc>=10&&ws&&ws.readyState===1){ws.send('{"t":"step"}');acc-=10;sent++}}
 function pos(serverH){const now=performance.now();tick(now);return d}
 function anim(now){if(hop){const t=Math.min(1,(now-pressAt)/320);return{pose:t<1?'h1':'h0',y:t<1?Math.round(Math.sin(t*Math.PI)*12):0}}
  if(v<.3)return{pose:'idle',y:0};const t=(now-pressAt)/I();
  const f=foot==='L'?(t<.5?'w0':'w1'):(t<.5?'w2':'w3');return{pose:t>1.2?['w0','w1','w2','w3'][Math.floor(d*1.6/5)%4]:f,y:0}}
 function hud(now){const land=innerWidth>innerHeight&&innerHeight<520,cx=W/2,y=land?H-44:H-176,T=I(),w=Math.min(W-40,land?W-360:300);
  // 박자 트랙
  ctx.fillStyle='#000000a0';ctx.fillRect(cx-w/2,y-16,w,32);ctx.fillStyle='#1a1420';ctx.fillRect(cx-w/2,y+16,w,3);
  const b0=beat0||now,ph=((now-b0)%T+T)%T,next=last==='L'?'R':'L';
  for(let k=0;k<5;k++){const t=(T-ph)+k*T,px=cx+t/T*(w/2-20)*.55;if(px>cx+w/2-10)continue;const f=(k%2===0)?next:(next==='L'?'R':'L');
   ctx.fillStyle=f==='L'?'#4fa8ff':'#ff8a3d';ctx.fillRect(Math.round(px)-6,y-9,12,18);ctx.fillStyle='#fff';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText(f==='L'?'왼':'오',Math.round(px),y+4)}
  const pulse=ph<90?2:0;ctx.strokeStyle='#ffe040';ctx.lineWidth=3;ctx.strokeRect(cx-10-pulse,y-13-pulse,20+pulse*2,26+pulse*2);
  // 속도 게이지
  ctx.font='bold 11px sans-serif';ctx.textAlign='left';ctx.fillStyle='#fff';ctx.fillText(hop?'깡깡이':'속도',cx-w/2+8,y-22);
  for(let i=0;i<=MAXL;i++){ctx.fillStyle=hop?(i===0?'#ffb0e0':'#ffffff30'):i<=lvl?(i<3?'#7be08f':i<6?'#ffe040':'#ff6b5a'):'#ffffff30';ctx.fillRect(cx-w/2+44+i*9,y-30,7,9)}
  ctx.textAlign='right';ctx.fillStyle='#fff';ctx.fillText((hop?'깡깡이 속도':'Lv '+lvl)+(combo>1?'  · 콤보 '+combo:''),cx+w/2-6,y-22);
  // 판정
  if(fb&&now-fb.at<650){const t=(now-fb.at)/650,s=t<.15?1+t*2:1.3-t*.3;ctx.save();ctx.translate(cx,y-70-t*14);ctx.scale(s,s);ctx.globalAlpha=1-Math.max(0,t-.6)/.4;ctx.textAlign='center';
   ctx.font='900 26px sans-serif';ctx.lineWidth=5;ctx.strokeStyle='#1a1420';ctx.strokeText(fb.e,0,0);ctx.fillStyle=fb.c;ctx.fillText(fb.e,0,0);ctx.font='bold 13px sans-serif';ctx.lineWidth=4;ctx.strokeText(fb.t,0,18);ctx.fillStyle='#fff';ctx.fillText(fb.t,0,18);ctx.restore()}
  if(!lastT&&me){ctx.textAlign='center';ctx.font='bold 13px sans-serif';ctx.fillStyle='#fff';ctx.strokeStyle='#000a';ctx.lineWidth=3;const s='왼발·오른발을 박자에 맞춰 번갈아 눌러요!';ctx.strokeText(s,cx,y-50);ctx.fillText(s,cx,y-50)}
  ctx.textAlign='left'}
 return{_d:v=>{d=v},press,pos,anim,hud,reset,state:()=>({lvl,combo,hop,v,d,best})}})();
