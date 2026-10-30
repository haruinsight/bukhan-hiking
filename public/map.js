// 첫 화면(대한민국 지도) + 보상 "한국의 밥상"
window.STOP_EN={'Trailhead Center':'백운대탐방지원센터','Doseonsa Junction':'도선사 갈림길','Harujae Pass':'하루재','Insuam Hermitage':'인수암','Baegun Shelter':'백운대피소','Wimun Gate':'위문','Baegundae 836m':'백운대'};
function uiOpen(){return [...document.querySelectorAll('.modal,.scr')].some(e=>!e.classList.contains('hide'))}
let LAST=null;
const MAP=(()=>{
 const M={};const $=id=>document.getElementById(id);
 const col=()=>{try{return JSON.parse(localStorage.bapsang||'{}')}catch(e){return{}}};
 // ── 지도 (경도,위도) ──
 const LAND=[[126.12,37.74],[126.45,37.8],[126.68,37.95],[126.95,38.1],[127.25,38.3],[127.6,38.33],[128.05,38.31],[128.36,38.62],[128.55,38.3],[128.75,38.0],[129.05,37.62],[129.3,37.2],[129.42,36.8],[129.47,36.4],[129.38,36.02],[129.57,36.0],[129.45,35.6],[129.33,35.3],[129.1,35.1],[128.85,35.05],[128.6,34.88],[128.38,34.83],[128.05,34.9],[127.75,34.72],[127.55,34.8],[127.38,34.55],[127.15,34.6],[126.92,34.42],[126.62,34.3],[126.38,34.48],[126.28,34.75],[126.42,35.05],[126.4,35.45],[126.6,35.75],[126.72,36.02],[126.55,36.25],[126.5,36.5],[126.22,36.68],[126.42,36.95],[126.82,36.98],[126.75,37.2],[126.6,37.42],[126.52,37.62]];
 const X=lon=>(lon-124.6)*100,Y=lat=>(38.95-lat)*124;
 const path=pts=>'M'+pts.map(p=>X(p[0]).toFixed(1)+','+Y(p[1]).toFixed(1)).join('L')+'Z';
 const isl=(lon,lat,rx,ry,r=0)=>`<ellipse cx="${X(lon)}" cy="${Y(lat)}" rx="${rx}" ry="${ry}" transform="rotate(${r} ${X(lon)} ${Y(lat)})"/>`;
 const city=(lon,lat,ko,en,dx=8)=>`<circle cx="${X(lon)}" cy="${Y(lat)}" r="3" fill="#8a9a8c"/><text x="${X(lon)+dx}" y="${Y(lat)+4}" class="ct">${ko} <tspan class="en">${en}</tspan></text>`;
 function svg(){const bx=X(126.98),by=Y(37.66);
  return `<svg viewBox="0 0 760 740" preserveAspectRatio="xMidYMid meet" id="krsvg"><defs>
  <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe6ee"/><stop offset="1" stop-color="#a9d0de"/></linearGradient>
  <linearGradient id="land" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9efd9"/><stop offset=".6" stop-color="#d9e4c3"/><stop offset="1" stop-color="#c9d8b0"/></linearGradient>
  <linearGradient id="ridge" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fb98a" stop-opacity=".75"/><stop offset="1" stop-color="#9fb98a" stop-opacity="0"/></linearGradient>
  <filter id="sh" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#2a4a55" flood-opacity=".35"/></filter></defs>
  <rect width="760" height="740" fill="url(#sea)"/>
  <g fill="none" stroke="#ffffff70" stroke-width="1">${[0,1,2,3,4,5].map(i=>`<path d="M0 ${110+i*110} Q190 ${95+i*110} 380 ${110+i*110} T760 ${110+i*110}"/>`).join('')}</g>
  <path d="M${X(126.12)},${Y(37.74)}L${X(125.6)},${Y(38.3)}L${X(125.9)},${Y(38.9)}L${X(128.1)},${Y(38.95)}L${X(128.36)},${Y(38.62)}L${X(128.05)},${Y(38.31)}L${X(127.25)},${Y(38.3)}L${X(126.68)},${Y(37.95)}Z" fill="#e7e9e1" opacity=".7"/>
  <path d="M${X(126.12)},${Y(37.74)} L${X(126.68)},${Y(37.95)} L${X(127.25)},${Y(38.3)} L${X(128.05)},${Y(38.31)} L${X(128.36)},${Y(38.62)}" fill="none" stroke="#b3a99a" stroke-width="1.5" stroke-dasharray="4 4"/>
  <g filter="url(#sh)" fill="url(#land)" stroke="#9fb48d" stroke-width="1.5"><path d="${path(LAND)}"/>${isl(126.55,33.38,40,19,-8)}${isl(130.87,37.5,6,5)}${isl(131.87,37.24,2.6,2)}${isl(126.42,37.68,9,7)}${isl(126.3,34.4,6,5)}${isl(127.0,34.32,7,4)}${isl(128.6,34.8,7,5,20)}${isl(126.1,34.7,4,3)}</g>
  <path d="M${X(128.3)},${Y(38.5)} C${X(128.9)},${Y(37.6)} ${X(129.1)},${Y(36.8)} ${X(128.9)},${Y(36.1)} C${X(128.5)},${Y(36.2)} ${X(128.1)},${Y(37.2)} ${X(127.7)},${Y(37.9)}Z" fill="url(#ridge)"/>
  <path d="M${X(128.1)},${Y(36.5)} C${X(127.7)},${Y(35.9)} ${X(127.5)},${Y(35.5)} ${X(127.7)},${Y(35.2)}" fill="none" stroke="#a9c193" stroke-width="10" stroke-linecap="round" opacity=".45"/>
  <path d="M${X(126.62)},${Y(37.6)} C${X(126.8)},${Y(37.57)} ${X(126.95)},${Y(37.51)} ${X(127.1)},${Y(37.55)} S${X(127.35)},${Y(37.55)} ${X(127.5)},${Y(37.6)}" fill="none" stroke="#8fc3d6" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M${X(128.8)},${Y(35.1)} C${X(128.6)},${Y(35.5)} ${X(128.5)},${Y(35.9)} ${X(128.6)},${Y(36.4)}" fill="none" stroke="#8fc3d6" stroke-width="2" stroke-linecap="round"/>
  <text x="${X(125.0)}" y="${Y(35.6)}" class="sea">Yellow Sea · 서해</text><text x="${X(130.0)}" y="${Y(36.4)}" class="sea">East Sea · 동해</text><text x="${X(127.7)}" y="${Y(33.85)}" class="sea">South Sea</text>
  ${city(127.06,37.25,'Suwon','수원')}${city(127.38,36.35,'Daejeon','대전')}${city(128.6,35.87,'Daegu','대구')}${city(129.07,35.18,'Busan','부산',-62)}${city(126.85,35.16,'Gwangju','광주')}${city(128.9,37.75,'Gangneung','강릉')}${city(129.2,35.84,'Gyeongju','경주')}
  <text x="${X(126.55)}" y="${Y(33.38)+36}" class="ct" text-anchor="middle">Jeju <tspan class="en">제주</tspan></text>
  <text x="${X(130.87)}" y="${Y(37.5)-10}" class="ct sm" text-anchor="middle">Ulleungdo</text><text x="${X(131.87)}" y="${Y(37.24)+16}" class="ct sm" text-anchor="middle">Dokdo 독도</text>
  <circle cx="${X(126.98)}" cy="${Y(37.56)}" r="5" fill="#d0574a" stroke="#fff" stroke-width="1.5"/><text x="${X(126.98)-10}" y="${Y(37.56)+18}" class="ct b" text-anchor="end">Seoul <tspan class="en">서울</tspan></text>
  ${[[128.47,38.12,'Seoraksan'],[127.73,35.34,'Jirisan'],[126.53,33.36,'Hallasan'],[127.74,35.86,'Deogyusan']].map(([lo,la,n])=>`<g opacity=".75"><path d="M${X(lo)},${Y(la)} c-3,-7 -10,-11 -10,-19 a10,10 0 1,1 20,0 c0,8 -7,12 -10,19z" fill="#9aa0a0" stroke="#fff" stroke-width="2"/><text x="${X(lo)}" y="${Y(la)+13}" text-anchor="middle" class="ct sm" style="fill:#7d8580">${n} · Coming soon</text></g>`).join('')}
  <g id="bkPin" style="cursor:pointer"><circle cx="${bx}" cy="${by}" r="16" fill="#2f8f5b" opacity=".25"><animate attributeName="r" values="10;26;10" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".45;0;.45" dur="2s" repeatCount="indefinite"/></circle>
   <path d="M${bx},${by} c-4,-10 -14,-16 -14,-27 a14,14 0 1,1 28,0 c0,11 -10,17 -14,27z" fill="#2f8f5b" stroke="#fff" stroke-width="2.5"/><path d="M${bx-7},${by-23} l7,-9 l3,4 l2,-2 l4,7z" fill="#fff"/>
   <g transform="translate(${bx-190},${by-78})"><rect width="168" height="50" rx="12" fill="#fff" filter="url(#sh)"/><text x="12" y="21" class="pk">⛰️ Bukhansan 북한산</text><text x="12" y="39" class="ct en">Baegundae 836m · Tap to hike!</text></g>
   <rect x="${bx-195}" y="${by-80}" width="215" height="85" fill="transparent"/></g></svg>`}
 // ── 반찬 그리기(위에서 본 모습) ──
 function rng(s){return()=>{s=(s*16807)%2147483647;return s/2147483647}}
 const inR=(r,R)=>{const a=r()*6.283,d=Math.sqrt(r())*R;return[Math.cos(a)*d,Math.sin(a)*d]},blob=(x,X,Y,a,b,rot,c)=>{x.fillStyle=c;x.beginPath();x.ellipse(X,Y,a,b,rot,0,7);x.fill()};
 function rice(x,cx,cy,r){x.save();x.translate(cx,cy);const R=DR.vessel(x,'brass',r);const g=x.createRadialGradient(-R*.2,-R*.2,R*.1,0,0,R);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#e8e2d2');x.fillStyle=g;x.beginPath();x.arc(0,0,R,0,7);x.fill();const rnd=rng(7);for(let i=0;i<220;i++){const[p,q]=inR(rnd,R*.92);blob(x,p+R*.01,q+R*.012,R*.05,R*.022,(i*1.3)%3,'#d8d0bc');blob(x,p,q,R*.05,R*.025,(i*1.3)%3,'#fdfbf4')}x.restore()}
 function cutlery(x,cx,cy,s){x.save();x.translate(cx,cy);x.shadowColor='#0004';x.shadowBlur=4;x.shadowOffsetY=2;const g=x.createLinearGradient(0,0,s*.12,0);g.addColorStop(0,'#c9ccd0');g.addColorStop(.5,'#f4f6f8');g.addColorStop(1,'#a6aab0');
  x.fillStyle=g;x.beginPath();x.ellipse(0,-s*.75,s*.11,s*.16,0,0,7);x.fill();x.fillRect(-s*.025,-s*.62,s*.05,s*1.3); // 숟가락
  x.fillRect(s*.17,-s*.9,s*.035,s*1.6);x.fillRect(s*.27,-s*.9,s*.035,s*1.6); // 젓가락
  x.restore()}
 // 밥상: 큰 나무 상 위에 밥·수저 + 모은 반찬
 function table(cv,hi,w){const c=col(),have=DISH.filter(d=>c[d.id]),cols=w<520?3:w<800?4:5,pad=w*.03,tw=w-pad*2,cw=(tw-w*.06)/cols,r=Math.min(cw*.36,70),rh=r*2.9,rows=Math.max(1,Math.ceil(have.length/cols)),top=pad+r*.5,bot=r*3.6;
  const h=Math.round(top+rows*rh+bot+pad*2);const D=2;cv.width=w*D;cv.height=h*D;cv.style.width=w+'px';cv.style.height=h+'px';const x=cv.getContext('2d');x.setTransform(D,0,0,D,0,0);x.clearRect(0,0,w,h);const th=h-pad*2;
  x.save();x.shadowColor='#0006';x.shadowBlur=w*.03;x.shadowOffsetY=w*.012;x.fillStyle='#6b3a1c';x.beginPath();x.roundRect(pad,pad,tw,th,w*.04);x.fill();x.restore();
  const g=x.createLinearGradient(0,pad,0,h-pad);g.addColorStop(0,'#b0703a');g.addColorStop(1,'#8a4e24');x.fillStyle=g;x.beginPath();x.roundRect(pad+6,pad+6,tw-12,th-12,w*.032);x.fill();
  x.save();x.beginPath();x.roundRect(pad+6,pad+6,tw-12,th-12,w*.032);x.clip();x.strokeStyle='#ffffff12';x.lineWidth=2;for(let y=pad;y<h;y+=th/Math.max(20,rows*8)){x.beginPath();x.moveTo(pad,y);for(let X2=pad;X2<w;X2+=20)x.lineTo(X2,y+Math.sin(X2*.02+y)*3);x.stroke()}x.restore();
  if(!have.length){x.fillStyle='#ffffffb0';x.font='600 15px sans-serif';x.textAlign='center';x.fillText('Climb to earn your first dish!',w/2,top+rh*.5)}
  have.forEach((d,i)=>{const cx=pad+w*.03+cw*(i%cols+.5),cy=top+rh*(Math.floor(i/cols))+r*1.2;
   if(hi===d.id){x.save();x.fillStyle='#ffe08a66';x.beginPath();x.arc(cx,cy,r*1.4,0,7);x.fill();x.restore()}drawDish(x,cx,cy,r,d);
   x.fillStyle='#fff';x.textAlign='center';x.font=`700 ${Math.max(10,r*.26)}px sans-serif`;x.fillText(d.en.split(' (')[0],cx,cy+r*1.45);x.fillStyle='#ffe8c8';x.font=`${Math.max(9,r*.2)}px sans-serif`;x.fillText(d.ko,cx,cy+r*1.45+Math.max(11,r*.26));
   if(c[d.id]>1){x.fillStyle='#000a';x.beginPath();x.roundRect(cx+r*.5,cy-r*1.1,r*.7,r*.42,r*.2);x.fill();x.fillStyle='#fff';x.font=`bold ${r*.3}px sans-serif`;x.fillText('×'+c[d.id],cx+r*.85,cy-r*.8)}});
  const by=h-pad-bot*.5,br=Math.min(r*1.05,60);rice(x,w*.4,by,br);cutlery(x,w*.6,by,br*1.2);
  x.fillStyle='#fff';x.font=`bold ${Math.max(12,w*.022)}px sans-serif`;x.textAlign='left';x.fillText(`🍚 Rice, spoon & chopsticks included  ·  ${have.length}/${DISH.length} dishes`,pad+w*.04,h-pad-14)}
 function thumb(d,lock,size=120){const c=document.createElement('canvas');c.width=c.height=size*2;const x=c.getContext('2d');x.scale(2,2);drawDish(x,size/2,size/2,size*.4,d,lock);return c}
 // ── 화면 ──
 M.show=()=>{for(const id of['card','pick','reward'])$(id).classList.add('hide');$('map').classList.remove('hide');const n=DISH.filter(d=>col()[d.id]).length;$('mapCount').textContent=n?`${n}/${DISH.length} dishes collected`:'No dishes yet'};
 M.cardInfo=()=>{if(!LAST)return;const s=LAST.score,t=tierOf(s),det=LAST.det;
  $('scoreLine').innerHTML=`<div class="sc"><b>${s.toLocaleString()} pts</b> <span>${LAST.mode==='walk'?`PERFECT ${det.nP} · GOOD ${det.nG} · MISS ${det.nM} · Time bonus ${det.tb}`:`Dodged ${det.dodged} · Hits ${det.hits} · Time bonus ${det.tb}${det.nb?' · No-hit +300':''}`}</span></div><div class="tierHint">🎁 ${TIER[t].en} reward unlocked!${t<TIER.length-1?` ${TIER[t+1].need-s} more pts for ${TIER[t+1].en}`:''}</div>`};
 function reward(){const s=LAST?LAST.score:0,t=tierOf(s);$('card').classList.add('hide');$('reward').classList.remove('hide');$('rwTitle').innerHTML=`${s.toLocaleString()} pts · Pick ONE dish for your Korean table<br><small>한국의 밥상 — higher scores unlock tastier dishes</small>`;
  const L=$('rwList');L.innerHTML='';let pick=null;$('rwOk').disabled=true;
  TIER.forEach((T,ti)=>{const sec=document.createElement('div');sec.className='tier'+(ti>t?' locked':'');sec.innerHTML=`<h3>${['🥢','🏠','✨','🎉','👑'][ti]} ${T.en}${ti?` (${T.need}+)`:''} <small>${T.ko}</small></h3>${ti>t?`<div class="lockMsg">🔒 Score ${T.need}+ to unlock ${DISH.filter(d=>d.t===ti).map(d=>d.en).slice(0,2).join(' & ')}!</div>`:''}`;
   const g=document.createElement('div');g.className='dg';for(const d of DISH.filter(d=>d.t===ti)){const b=document.createElement('button');b.className='dc';b.appendChild(thumb(d,ti>t));b.insertAdjacentHTML('beforeend',`<b>${d.en}</b><i>${d.ko}</i><p>${d.d}</p>${col()[d.id]?`<em>Owned ×${col()[d.id]}</em>`:''}`);
    if(ti<=t)b.onclick=()=>{pick=d;[...L.querySelectorAll('.dc')].forEach(e=>e.classList.remove('on'));b.classList.add('on');$('rwOk').disabled=false;$('rwOk').textContent='Get '+d.en};else b.disabled=true;g.appendChild(b)}
   sec.appendChild(g);L.appendChild(sec)});
  $('rwOk').onclick=()=>{if(!pick)return;const c=col();c[pick.id]=(c[pick.id]||0)+1;localStorage.bapsang=JSON.stringify(c);LAST=null;showTable(pick);clearTimeout(M._bt);M._bt=setTimeout(()=>{if(!$('tbl').classList.contains('hide')){$('tbl').classList.add('hide');M.show()}},4500)}}
 function showTable(hi){for(const id of['reward','map','card'])$(id).classList.add('hide');$('tbl').classList.remove('hide');const cv=$('tblCv'),w=Math.min(innerWidth-24,860);table(cv,hi&&hi.id,w);
  $('tblMsg').innerHTML=hi?`<b>${hi.en}</b> ${hi.ko} is now on your table! <small>${hi.d}</small>`:'Your collected dishes are served here. Higher scores unlock rarer dishes!'}

 // ── YAHOO! 정상 축하 화면 ──
 M.yahoo=cb=>{const el=$('yahoo'),c=$('yhCv');el.classList.remove('hide');const w=innerWidth,h=innerHeight,D=devicePixelRatio||1;c.width=w*D;c.height=h*D;const x=c.getContext('2d');x.setTransform(D,0,0,D,0,0);
  const s=LAST?LAST.score:0,t=tierOf(s),t0=performance.now();let done=false;
  const conf=[...Array(140)].map((_,i)=>({x:Math.random()*w,y:-Math.random()*h,v:80+Math.random()*160,r:Math.random()*7,s:4+Math.random()*6,c:['#ff5a5a','#ffd84a','#4fc3ff','#7be08f','#ff8ad8','#fff'][i%6]}));
  const fin=()=>{if(done)return;done=true;el.classList.add('hide');cb&&cb()};el.onclick=()=>{if(performance.now()-t0>600)fin()};setTimeout(fin,4200);
  (function fr(now){if(done)return;requestAnimationFrame(fr);const e=(now-t0)/1000,land=w>h;
   const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#3d7fd0');g.addColorStop(.55,'#ffb36b');g.addColorStop(1,'#ffdf9a');x.fillStyle=g;x.fillRect(0,0,w,h);
   const cx=w/2,cy=land?h*.62:h*.56;x.save();x.translate(cx,cy-40);x.rotate(e*.25);for(let i=0;i<18;i++){x.rotate(Math.PI/9);x.fillStyle=i%2?'#fff4':'#fff2';x.beginPath();x.moveTo(0,0);x.lineTo(-60,-Math.max(w,h));x.lineTo(60,-Math.max(w,h));x.fill()}x.restore();
   // 화강암 정상
   const pg=x.createLinearGradient(0,cy,0,h);pg.addColorStop(0,'#d9d6cf');pg.addColorStop(1,'#8f8c86');x.fillStyle=pg;x.beginPath();x.moveTo(-10,h);x.lineTo(-10,cy+h*.18);x.quadraticCurveTo(cx-w*.2,cy+10,cx,cy);x.quadraticCurveTo(cx+w*.25,cy+10,w+10,cy+h*.2);x.lineTo(w+10,h);x.fill();
   x.strokeStyle='#0000001a';x.lineWidth=2;for(let i=-4;i<=4;i++){x.beginPath();x.moveTo(cx+i*w*.09,cy+8+Math.abs(i)*6);x.lineTo(cx+i*w*.14,h);x.stroke()}
   // 깃발
   const fx=cx+70,fy=cy-6;x.fillStyle='#555';x.fillRect(fx,fy-120,4,120);const wv=Math.sin(e*6)*5;x.fillStyle='#fff';x.beginPath();x.moveTo(fx+4,fy-120);x.quadraticCurveTo(fx+40,fy-124+wv,fx+76,fy-116);x.lineTo(fx+76,fy-70);x.quadraticCurveTo(fx+40,fy-78+wv,fx+4,fy-72);x.fill();
   x.save();x.translate(fx+40,fy-96+wv*.5);x.fillStyle='#cd2e3a';x.beginPath();x.arc(0,0,11,Math.PI,0);x.fill();x.fillStyle='#0047a0';x.beginPath();x.arc(0,0,11,0,Math.PI);x.fill();x.restore();
   // 등산객 (만세)
   const j=Math.abs(Math.sin(e*5))*14,hx=cx-20,hy=cy-2-j,S=1.6;x.save();x.translate(hx,hy);x.scale(S,S);x.lineCap='round';
   x.strokeStyle='#3a3f55';x.lineWidth=6;x.beginPath();x.moveTo(-5,-22);x.lineTo(-9,0);x.moveTo(5,-22);x.lineTo(9,0);x.stroke();
   x.fillStyle='#8a5a2b';x.beginPath();x.roundRect(-15,-48,11,22,4);x.fill();x.fillStyle='#e8642a';x.beginPath();x.roundRect(-10,-50,20,30,7);x.fill();
   const a=Math.sin(e*10)*.15;x.strokeStyle='#e8642a';x.lineWidth=6;x.beginPath();x.moveTo(-8,-44);x.lineTo(-20,-66+a*20);x.moveTo(8,-44);x.lineTo(20,-66-a*20);x.stroke();x.fillStyle='#ffd9b3';x.beginPath();x.arc(-20,-68+a*20,4,0,7);x.arc(20,-68-a*20,4,0,7);x.fill();
   x.beginPath();x.arc(0,-60,10,0,7);x.fill();x.fillStyle='#222';x.beginPath();x.arc(-3.5,-61,1.5,0,7);x.arc(3.5,-61,1.5,0,7);x.fill();x.beginPath();x.arc(0,-56,3,0,Math.PI);x.fill();
   x.fillStyle='#ffcf33';x.beginPath();x.ellipse(0,-67,14,3.5,0,0,7);x.fill();x.beginPath();x.arc(0,-68,8.5,Math.PI,0);x.fill();x.restore();
   // 글자
   const pop=Math.min(1,e/.35),sc=pop<1?pop*1.2:1+Math.sin(e*4)*.03,fs=Math.min(w*.2,land?h*.22:120);x.save();x.translate(cx,land?h*.2:h*.2);x.scale(sc,sc);x.rotate(-.04);x.textAlign='center';x.font=`900 ${fs}px sans-serif`;x.lineJoin='round';x.lineWidth=fs*.14;x.strokeStyle='#7a2a10';x.strokeText('YAHOO!',0,0);
   const tg=x.createLinearGradient(0,-fs*.8,0,0);tg.addColorStop(0,'#fff6a0');tg.addColorStop(1,'#ffb020');x.fillStyle=tg;x.fillText('YAHOO!',0,0);x.font=`800 ${fs*.26}px sans-serif`;x.lineWidth=5;x.strokeText('야호~  Baegundae 836m',0,fs*.42);x.fillStyle='#fff';x.fillText('야호~  Baegundae 836m',0,fs*.42);x.restore();
   if(e>.5){const sy=land?h*.2+fs*.8:h*.2+fs*.95,bw=Math.min(w-40,340);x.globalAlpha=Math.min(1,(e-.5)*3);x.fillStyle='#ffffffee';x.beginPath();x.roundRect(cx-bw/2,sy-8,bw,land?78:96,20);x.fill();x.textAlign='center';x.fillStyle='#c8502a';x.font=`900 ${land?40:50}px sans-serif`;x.fillText(Math.round(s*Math.min(1,(e-.5)/.8)).toLocaleString()+' pts',cx,sy+(land?38:48));
    x.fillStyle='#2f8f5b';x.font='800 15px sans-serif';x.fillText('🎁 '+TIER[t].en+' unlocked!',cx,sy+(land?64:80));x.globalAlpha=1}
   for(const p of conf){p.y+=p.v/60;p.x+=Math.sin(e*3+p.r)*1.2;if(p.y>h)p.y=-10;x.save();x.translate(p.x,p.y);x.rotate(p.r+e*4);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);x.restore()}
   if(e>1.2){x.fillStyle='#fff';x.font='600 14px sans-serif';x.textAlign='center';x.globalAlpha=.6+Math.sin(e*5)*.4;x.fillText('Tap to continue',cx,h-24);x.globalAlpha=1}})(t0)};
 M.table=showTable;M.reward=reward;M.DISH=DISH;
 addEventListener('DOMContentLoaded',()=>{});
 M.init=()=>{$('mapSvg').innerHTML=svg();$('bkPin').onclick=()=>{$('map').classList.add('hide');$('pick').classList.remove('hide')};$('mapTable').onclick=()=>showTable(null);$('tblBack').onclick=()=>{clearTimeout(M._bt);$('tbl').classList.add('hide');M.show()};$('toReward').onclick=reward;$('pickBack').onclick=()=>M.show();M.show()};
 return M})();
