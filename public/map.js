// 첫 화면(대한민국 지도) + 보상 "한국의 밥상"
window.STOP_EN={'Trailhead Center':'백운대탐방지원센터','Doseonsa Junction':'도선사 갈림길','Harujae Pass':'하루재','Insuam Hermitage':'인수암','Baegun Shelter':'백운대피소','Wimun Gate':'위문','Baegundae 836m':'백운대'};
function uiOpen(){return [...document.querySelectorAll('.modal,.scr')].some(e=>!e.classList.contains('hide'))}
let LAST=null;
const DISH=[
 // tier 0
 {id:'kimchi',t:0,ko:'배추김치',en:'Kimchi',v:'plate',d:'Spicy fermented napa cabbage — the side dish on every Korean table, eaten with almost every bite of rice.'},
 {id:'kongnamul',t:0,ko:'콩나물무침',en:'Kongnamul (Soybean Sprouts)',v:'plate',d:'Crunchy sprouts tossed with sesame oil, garlic and scallion. Light, nutty, refreshing.'},
 {id:'myeolchi',t:0,ko:'멸치볶음',en:'Myeolchi-bokkeum (Anchovies)',v:'plate',d:'Tiny anchovies glazed sweet-salty with sesame — a crunchy lunchbox favorite.'},
 {id:'miyeokguk',t:0,ko:'미역국',en:'Miyeok-guk (Seaweed Soup)',v:'brass',d:'Silky seaweed soup in a savory broth. Koreans eat it on their birthday.'},
 // tier 1
 {id:'gyeran',t:1,ko:'계란말이',en:'Gyeran-mari',v:'plate',d:'Fluffy layered egg roll with veggies — soft, mild, loved by kids and adults.'},
 {id:'japchae',t:1,ko:'잡채',en:'Japchae',v:'plate',d:'Chewy glass noodles stir-fried with soy, sesame and colorful vegetables. A party classic.'},
 {id:'doenjang',t:1,ko:'된장찌개',en:'Doenjang-jjigae',v:'pot',d:'Bubbling stew of fermented soybean paste, tofu and zucchini. Spoon it right onto rice.'},
 {id:'jeyuk',t:1,ko:'제육볶음',en:'Jeyuk-bokkeum (Spicy Pork)',v:'plate',d:'Pork in fiery gochujang sauce. Wrap it in lettuce with rice for the perfect bite.'},
 // tier 2
 {id:'galbijjim',t:2,ko:'갈비찜',en:'Galbi-jjim',v:'brass',d:'Tender beef ribs slow-braised in sweet soy with chestnuts and jujubes — a holiday feast dish.'},
 {id:'bulgogi',t:2,ko:'불고기',en:'Bulgogi',v:'plate',d:'Thin marinated beef grilled sweet and smoky. Korea\'s most famous BBQ.'},
 {id:'gejang',t:2,ko:'간장게장',en:'Ganjang-gejang (Soy Crab)',v:'oval',d:'Raw crab cured in soy sauce, called the "rice thief" — mix the rich roe into rice in the shell.'},
 {id:'samgyetang',t:2,ko:'삼계탕',en:'Samgyetang',v:'pot',d:'A whole young chicken stuffed with rice, ginseng and jujube. Koreans eat it on the hottest summer days.'}];
const TIER=[{need:0,ko:'기본 반찬',en:'Everyday Banchan'},{need:700,ko:'특별 반찬',en:'Special Dishes'},{need:1200,ko:'잔칫상',en:'Feast Dishes'}];
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
  <text x="${X(126.55)}" y="${Y(33.38)+5}" class="ct" text-anchor="middle">Jeju <tspan class="en">제주</tspan></text>
  <text x="${X(130.87)}" y="${Y(37.5)-10}" class="ct sm" text-anchor="middle">Ulleungdo</text><text x="${X(131.87)}" y="${Y(37.24)+16}" class="ct sm" text-anchor="middle">Dokdo 독도</text>
  <circle cx="${X(126.98)}" cy="${Y(37.56)}" r="5" fill="#d0574a" stroke="#fff" stroke-width="1.5"/><text x="${X(126.98)-10}" y="${Y(37.56)+18}" class="ct b" text-anchor="end">Seoul <tspan class="en">서울</tspan></text>
  <g id="bkPin" style="cursor:pointer"><circle cx="${bx}" cy="${by}" r="16" fill="#2f8f5b" opacity=".25"><animate attributeName="r" values="10;26;10" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".45;0;.45" dur="2s" repeatCount="indefinite"/></circle>
   <path d="M${bx},${by} c-4,-10 -14,-16 -14,-27 a14,14 0 1,1 28,0 c0,11 -10,17 -14,27z" fill="#2f8f5b" stroke="#fff" stroke-width="2.5"/><path d="M${bx-7},${by-23} l7,-9 l3,4 l2,-2 l4,7z" fill="#fff"/>
   <g transform="translate(${bx+18},${by-70})"><rect width="168" height="50" rx="12" fill="#fff" filter="url(#sh)"/><text x="12" y="21" class="pk">⛰️ Bukhansan 북한산</text><text x="12" y="39" class="ct en">Baegundae 836m · Tap to hike!</text></g>
   <rect x="${bx-20}" y="${by-75}" width="210" height="80" fill="transparent"/></g></svg>`}
 // ── 반찬 그리기(위에서 본 모습) ──
 function rng(s){return()=>{s=(s*16807)%2147483647;return s/2147483647}}
 function vessel(x,v,r){x.save();x.shadowColor='#3a200f55';x.shadowBlur=r*.25;x.shadowOffsetY=r*.1;
  if(v==='oval'){x.fillStyle='#f6f3ec';x.beginPath();x.ellipse(0,0,r*1.25,r*.9,0,0,7);x.fill();x.restore();x.strokeStyle='#d9d2c2';x.lineWidth=r*.05;x.beginPath();x.ellipse(0,0,r*1.08,r*.75,0,0,7);x.stroke();return r*.72}
  if(v==='pot'){const g=x.createRadialGradient(-r*.3,-r*.3,r*.1,0,0,r);g.addColorStop(0,'#6b4a36');g.addColorStop(1,'#2e1d14');x.fillStyle=g;x.beginPath();x.arc(0,0,r,0,7);x.fill();x.restore();x.fillStyle='#3a261a';x.beginPath();x.arc(0,0,r*.84,0,7);x.fill();return r*.78}
  if(v==='brass'){const g=x.createRadialGradient(-r*.35,-r*.35,r*.1,0,0,r);g.addColorStop(0,'#f8dc8a');g.addColorStop(.7,'#c99a3a');g.addColorStop(1,'#93691f');x.fillStyle=g;x.beginPath();x.arc(0,0,r,0,7);x.fill();x.restore();x.strokeStyle='#fff3c088';x.lineWidth=r*.04;x.beginPath();x.arc(0,0,r*.9,3.6,5.2);x.stroke();return r*.82}
  const g=x.createRadialGradient(-r*.3,-r*.3,r*.1,0,0,r);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#e4e0d6');x.fillStyle=g;x.beginPath();x.arc(0,0,r,0,7);x.fill();x.restore();x.strokeStyle='#4f7aa055';x.lineWidth=r*.035;x.beginPath();x.arc(0,0,r*.92,0,7);x.stroke();return r*.74}
 const blob=(x,cx,cy,rx,ry,a,c)=>{x.fillStyle=c;x.beginPath();x.ellipse(cx,cy,rx,ry,a,0,7);x.fill()};
 const seeds=(x,R,rnd,n,c='#f4ead0')=>{for(let i=0;i<n;i++){const a=rnd()*7,d=Math.sqrt(rnd())*R*.8;blob(x,Math.cos(a)*d,Math.sin(a)*d,R*.025,R*.014,rnd()*3,c)}};
 const inR=(rnd,R)=>{const a=rnd()*7,d=Math.sqrt(rnd())*R;return[Math.cos(a)*d,Math.sin(a)*d]};
 function food(x,id,R){const rnd=rng(id.length*977+id.charCodeAt(0)*31);
  const mound=(c1,c2,s=.78)=>{const g=x.createRadialGradient(-R*.2,-R*.25,R*.05,0,0,R*s);g.addColorStop(0,c1);g.addColorStop(1,c2);x.fillStyle=g;x.beginPath();x.arc(0,0,R*s,0,7);x.fill()};
  if(id==='kimchi'){mound('#e8603c','#a8261c',.8);for(let i=0;i<14;i++){const[p,q]=inR(rnd,R*.6),a=rnd()*3;blob(x,p,q,R*.26,R*.12,a,i%3?'#d8402c':'#f08a55');blob(x,p,q,R*.2,R*.035,a,'#fbe3b8cc')}seeds(x,R,rnd,18,'#ffe9c8')}
  if(id==='kongnamul'){mound('#f4ecd0','#d8cfa8',.8);x.lineCap='round';for(let i=0;i<46;i++){const[p,q]=inR(rnd,R*.62),a=rnd()*7,l=R*(.25+rnd()*.25);x.strokeStyle='#fbf6e4';x.lineWidth=R*.04;x.beginPath();x.moveTo(p,q);x.quadraticCurveTo(p+Math.cos(a+.5)*l*.6,q+Math.sin(a+.5)*l*.6,p+Math.cos(a)*l,q+Math.sin(a)*l);x.stroke();blob(x,p,q,R*.05,R*.04,a,'#f3d34a')}for(let i=0;i<10;i++){const[p,q]=inR(rnd,R*.6);blob(x,p,q,R*.05,R*.03,rnd()*3,'#5aa83e')}seeds(x,R,rnd,14)}
  if(id==='myeolchi'){mound('#c9a76a','#8a6430',.78);for(let i=0;i<40;i++){const[p,q]=inR(rnd,R*.64),a=rnd()*7;x.strokeStyle=rnd()<.5?'#e7dcc4':'#b89a6a';x.lineWidth=R*.045;x.lineCap='round';x.beginPath();x.arc(p,q,R*.09,a,a+1.8);x.stroke();blob(x,p+Math.cos(a)*R*.09,q+Math.sin(a)*R*.09,R*.02,R*.02,0,'#333')}seeds(x,R,rnd,20);x.fillStyle='#ffffff30';x.beginPath();x.ellipse(-R*.25,-R*.3,R*.25,R*.1,-.6,0,7);x.fill()}
  if(id==='miyeokguk'){mound('#6a7a52','#3c4a2c',1);x.lineCap='round';for(let i=0;i<9;i++){const[p,q]=inR(rnd,R*.55);x.strokeStyle='#1f3a22';x.lineWidth=R*.09;x.beginPath();x.moveTo(p-R*.25,q);x.bezierCurveTo(p-R*.1,q-R*.15,p+R*.1,q+R*.15,p+R*.25,q);x.stroke()}for(let i=0;i<8;i++){const[p,q]=inR(rnd,R*.7);blob(x,p,q,R*.04,R*.03,0,'#e9d98a88')}x.fillStyle='#ffffff38';x.beginPath();x.ellipse(-R*.3,-R*.35,R*.3,R*.1,-.6,0,7);x.fill()}
  if(id==='gyeran'){for(let i=0;i<5;i++){const ang=-.5+i*.25,cx=(i-2)*R*.3,cy=Math.sin(i)*R*.08;x.save();x.translate(cx,cy);x.rotate(ang*.2);const g=x.createLinearGradient(-R*.14,0,R*.14,0);g.addColorStop(0,'#e8b03a');g.addColorStop(.5,'#ffd85a');g.addColorStop(1,'#e8a930');x.fillStyle=g;x.beginPath();x.roundRect(-R*.13,-R*.4,R*.26,R*.8,R*.1);x.fill();x.strokeStyle='#f6e7a0';x.lineWidth=R*.025;for(let k=-2;k<=2;k++){x.beginPath();x.moveTo(-R*.1,k*R*.14);x.quadraticCurveTo(0,k*R*.14+R*.05,R*.1,k*R*.14);x.stroke()}for(let k=0;k<5;k++){blob(x,(rnd()-.5)*R*.18,(rnd()-.5)*R*.6,R*.025,R*.02,0,k%2?'#e8602a':'#3e9a3a')}x.restore()}blob(x,R*.5,R*.45,R*.12,R*.08,0,'#d4402e');}
  if(id==='japchae'){mound('#8a5a32','#5a3416',.8);x.lineCap='round';for(let i=0;i<60;i++){const[p,q]=inR(rnd,R*.6),a=rnd()*7,l=R*.35;x.strokeStyle=rnd()<.5?'#a87444cc':'#c8945acc';x.lineWidth=R*.022;x.beginPath();x.moveTo(p,q);x.bezierCurveTo(p+Math.cos(a)*l,q,p,q+Math.sin(a)*l,p+Math.cos(a+1)*l,q+Math.sin(a+1)*l);x.stroke()}
   const V=['#f08a2a','#3e9a3a','#6a4a30','#f4d64a','#c83a3a'];for(let i=0;i<26;i++){const[p,q]=inR(rnd,R*.6);x.strokeStyle=V[i%5];x.lineWidth=R*.05;const a=rnd()*3;x.beginPath();x.moveTo(p,q);x.lineTo(p+Math.cos(a)*R*.18,q+Math.sin(a)*R*.18);x.stroke()}seeds(x,R,rnd,16);x.fillStyle='#ffffff26';x.beginPath();x.ellipse(-R*.2,-R*.3,R*.3,R*.1,-.5,0,7);x.fill()}
  if(id==='doenjang'){mound('#b8743a','#7a4418',1);for(let i=0;i<9;i++){const[p,q]=inR(rnd,R*.6);x.fillStyle='#f6f0dc';x.save();x.translate(p,q);x.rotate(rnd()*2);x.fillRect(-R*.09,-R*.09,R*.18,R*.18);x.restore()}for(let i=0;i<7;i++){const[p,q]=inR(rnd,R*.6),a=rnd()*7;x.fillStyle='#9ac25a';x.beginPath();x.arc(p,q,R*.12,a,a+3.14);x.fill();x.fillStyle='#e6efb0';x.beginPath();x.arc(p,q,R*.08,a,a+3.14);x.fill()}for(let i=0;i<8;i++){const[p,q]=inR(rnd,R*.65);x.strokeStyle=i%3?'#2f7a2a':'#d02a20';x.lineWidth=R*.035;x.beginPath();x.arc(p,q,R*.05,0,7);x.stroke()}for(let i=0;i<10;i++){const[p,q]=inR(rnd,R*.8);x.strokeStyle='#ffffff40';x.lineWidth=1;x.beginPath();x.arc(p,q,R*.03+rnd()*R*.04,0,7);x.stroke()}}
  if(id==='jeyuk'){mound('#d0502a','#8a2410',.8);for(let i=0;i<14;i++){const[p,q]=inR(rnd,R*.58);blob(x,p,q,R*.2,R*.11,rnd()*3,i%2?'#c2401e':'#a83418');blob(x,p-R*.04,q-R*.02,R*.12,R*.03,rnd()*3,'#f0905a99')}for(let i=0;i<10;i++){const[p,q]=inR(rnd,R*.6);x.strokeStyle='#f4ecd8';x.lineWidth=R*.04;x.beginPath();x.arc(p,q,R*.1,0,1.6);x.stroke()}for(let i=0;i<9;i++){const[p,q]=inR(rnd,R*.6);blob(x,p,q,R*.05,R*.03,rnd()*3,'#4a9a32')}seeds(x,R,rnd,22);x.fillStyle='#ffffff30';x.beginPath();x.ellipse(-R*.25,-R*.3,R*.28,R*.1,-.5,0,7);x.fill()}
  if(id==='galbijjim'){mound('#6a3414','#3a1a08',.92);for(let i=0;i<6;i++){const a=i*1.05+.3,p=Math.cos(a)*R*.42,q=Math.sin(a)*R*.42;x.save();x.translate(p,q);x.rotate(a);const g=x.createLinearGradient(0,-R*.15,0,R*.15);g.addColorStop(0,'#9a5228');g.addColorStop(1,'#5a2a0e');x.fillStyle=g;x.beginPath();x.roundRect(-R*.24,-R*.14,R*.48,R*.28,R*.1);x.fill();x.fillStyle='#efe0c4';x.beginPath();x.roundRect(R*.16,-R*.05,R*.14,R*.1,R*.04);x.fill();x.fillStyle='#ffffff40';x.fillRect(-R*.18,-R*.1,R*.3,R*.03);x.restore()}
   blob(x,0,0,R*.11,R*.08,.3,'#e8842a');blob(x,R*.1,R*.12,R*.07,R*.06,0,'#c9a060');blob(x,-R*.12,R*.06,R*.06,R*.05,0,'#a01e18');blob(x,-R*.05,-R*.14,R*.06,R*.05,0,'#d9b878');for(let i=0;i<5;i++){const[p,q]=inR(rnd,R*.7);blob(x,p,q,R*.05,R*.03,rnd()*3,'#4a9a32')}seeds(x,R,rnd,12)}
  if(id==='bulgogi'){mound('#7a4220','#4a240c',.8);x.lineCap='round';for(let i=0;i<20;i++){const[p,q]=inR(rnd,R*.58),a=rnd()*3;x.strokeStyle=i%2?'#8a4a24':'#6a3416';x.lineWidth=R*.1;x.beginPath();x.moveTo(p-Math.cos(a)*R*.14,q-Math.sin(a)*R*.14);x.quadraticCurveTo(p,q+R*.05,p+Math.cos(a)*R*.14,q+Math.sin(a)*R*.14);x.stroke()}for(let i=0;i<12;i++){const[p,q]=inR(rnd,R*.6);x.strokeStyle='#e8d6a8';x.lineWidth=R*.035;x.beginPath();x.arc(p,q,R*.1,0,1.4);x.stroke()}for(let i=0;i<14;i++){const[p,q]=inR(rnd,R*.65);blob(x,p,q,R*.05,R*.025,rnd()*3,'#3e9a3a')}seeds(x,R,rnd,24);x.fillStyle='#ffffff30';x.beginPath();x.ellipse(-R*.2,-R*.3,R*.3,R*.09,-.5,0,7);x.fill()}
  if(id==='gejang'){x.strokeStyle='#a8521e';x.lineCap='round';for(let s=-1;s<=1;s+=2)for(let k=0;k<4;k++){const a=(k-1.5)*.35;x.lineWidth=R*.07;x.beginPath();x.moveTo(s*R*.3,a*R*.5);x.quadraticCurveTo(s*R*.7,a*R*.7-R*.1,s*R*.95,a*R*.9+R*.05);x.stroke()}
   const g=x.createRadialGradient(-R*.1,-R*.15,R*.05,0,0,R*.5);g.addColorStop(0,'#e8963a');g.addColorStop(.6,'#b8581e');g.addColorStop(1,'#7a3410');x.fillStyle=g;x.beginPath();x.ellipse(0,0,R*.5,R*.36,0,0,7);x.fill();x.fillStyle='#f6b23a';x.beginPath();x.ellipse(0,R*.05,R*.26,R*.17,0,0,7);x.fill();x.fillStyle='#ffd66a';x.beginPath();x.ellipse(-R*.05,0,R*.12,R*.07,0,0,7);x.fill();x.fillStyle='#ffffff55';x.beginPath();x.ellipse(-R*.2,-R*.18,R*.15,R*.05,-.4,0,7);x.fill();blob(x,R*.55,-R*.5,R*.08,R*.05,0,'#3e9a3a');blob(x,-R*.6,R*.48,R*.07,R*.07,0,'#d02a20')}
  if(id==='samgyetang'){mound('#f2ecd8','#d8cca8',1);const g=x.createRadialGradient(-R*.1,-R*.1,R*.05,0,0,R*.5);g.addColorStop(0,'#fbe9c0');g.addColorStop(1,'#d8b47a');x.fillStyle=g;x.beginPath();x.ellipse(0,0,R*.48,R*.38,.2,0,7);x.fill();blob(x,-R*.42,-R*.28,R*.16,R*.1,.7,'#e8c890');blob(x,R*.45,R*.25,R*.16,R*.1,.7,'#e8c890');x.strokeStyle='#c8a068';x.lineWidth=R*.02;x.beginPath();x.moveTo(-R*.2,0);x.quadraticCurveTo(0,-R*.1,R*.2,0);x.stroke();
   x.strokeStyle='#e8d4a0';x.lineWidth=R*.05;x.lineCap='round';x.beginPath();x.moveTo(R*.2,-R*.55);x.lineTo(R*.6,-R*.35);x.stroke();blob(x,-R*.55,R*.4,R*.07,R*.06,0,'#a01e18');blob(x,R*.1,R*.55,R*.06,R*.05,0,'#a01e18');for(let i=0;i<14;i++){const[p,q]=inR(rnd,R*.85);blob(x,p,q,R*.03,R*.02,0,'#4a9a32')}}
 }
 function drawDish(x,cx,cy,r,d,lock){x.save();x.translate(cx,cy);const R=vessel(x,d.v,r);x.save();x.beginPath();x.arc(0,0,d.v==='oval'?R*1.4:R,0,7);x.clip();food(x,d.id,R);x.restore();
  if(lock){x.fillStyle='#ffffffb0';x.beginPath();x.arc(0,0,r*1.02,0,7);x.fill()}x.restore()}
 function rice(x,cx,cy,r){x.save();x.translate(cx,cy);const R=vessel(x,'brass',r);const g=x.createRadialGradient(-R*.2,-R*.2,R*.1,0,0,R);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#e8e2d2');x.fillStyle=g;x.beginPath();x.arc(0,0,R,0,7);x.fill();const rnd=rng(7);for(let i=0;i<70;i++){const[p,q]=inR(rnd,R*.9);blob(x,p,q,R*.05,R*.025,rnd()*3,'#ece6d6')}x.restore()}
 function cutlery(x,cx,cy,s){x.save();x.translate(cx,cy);x.shadowColor='#0004';x.shadowBlur=4;x.shadowOffsetY=2;const g=x.createLinearGradient(0,0,s*.12,0);g.addColorStop(0,'#c9ccd0');g.addColorStop(.5,'#f4f6f8');g.addColorStop(1,'#a6aab0');
  x.fillStyle=g;x.beginPath();x.ellipse(0,-s*.75,s*.11,s*.16,0,0,7);x.fill();x.fillRect(-s*.025,-s*.62,s*.05,s*1.3); // 숟가락
  x.fillRect(s*.17,-s*.9,s*.035,s*1.6);x.fillRect(s*.27,-s*.9,s*.035,s*1.6); // 젓가락
  x.restore()}
 // 밥상: 큰 나무 상 위에 밥·수저 + 모은 반찬
 function table(cv,hi){const x=cv.getContext('2d'),w=cv.width,h=cv.height;x.clearRect(0,0,w,h);
  const pad=w*.03,tw=w-pad*2,th=h-pad*2;x.save();x.shadowColor='#0006';x.shadowBlur=w*.03;x.shadowOffsetY=w*.012;x.fillStyle='#6b3a1c';x.beginPath();x.roundRect(pad,pad,tw,th,w*.04);x.fill();x.restore();
  const g=x.createLinearGradient(0,pad,0,h-pad);g.addColorStop(0,'#b0703a');g.addColorStop(1,'#8a4e24');x.fillStyle=g;x.beginPath();x.roundRect(pad+w*.012,pad+w*.012,tw-w*.024,th-w*.024,w*.032);x.fill();
  x.save();x.beginPath();x.roundRect(pad+w*.012,pad+w*.012,tw-w*.024,th-w*.024,w*.032);x.clip();x.strokeStyle='#ffffff12';x.lineWidth=2;for(let i=0;i<40;i++){const y=pad+i*th/40;x.beginPath();x.moveTo(pad,y);for(let X2=pad;X2<w;X2+=20)x.lineTo(X2,y+Math.sin(X2*.02+i)*3);x.stroke()}x.restore();
  const c=col(),have=DISH.filter(d=>c[d.id]),cols=4,cw=(tw-w*.08)/cols,r=Math.min(cw*.4,th*.12);
  const rows=Math.ceil(12/cols),area=th*.62,rh=area/rows;
  DISH.forEach((d,i)=>{const cx=pad+w*.04+cw*(i%cols+.5),cy=pad+th*.06+rh*(Math.floor(i/cols)+.5);
   if(c[d.id]){if(hi===d.id){x.save();x.fillStyle='#ffe08a55';x.beginPath();x.arc(cx,cy,r*1.3,0,7);x.fill();x.restore()}drawDish(x,cx,cy,r,d);if(c[d.id]>1){x.fillStyle='#000a';x.beginPath();x.roundRect(cx+r*.45,cy-r*1.05,r*.7,r*.42,r*.2);x.fill();x.fillStyle='#fff';x.font=`bold ${r*.3}px sans-serif`;x.textAlign='center';x.fillText('×'+c[d.id],cx+r*.8,cy-r*.75)}}
   else{x.strokeStyle='#ffffff30';x.setLineDash([6,6]);x.lineWidth=2;x.beginPath();x.arc(cx,cy,r*.8,0,7);x.stroke();x.setLineDash([])}});
  const by=pad+th*.84,br=Math.min(th*.13,w*.09);rice(x,w*.36,by,br);cutlery(x,w*.6,by,br*1.2);
  x.fillStyle='#fff';x.font=`bold ${Math.max(12,w*.03)}px sans-serif`;x.textAlign='left';x.fillText(`🍚 Rice, spoon & chopsticks included  ·  Dishes ${have.length}/12`,pad+w*.04,h-pad-w*.03);x.textAlign='left'}
 function thumb(d,lock,size=120){const c=document.createElement('canvas');c.width=c.height=size*2;const x=c.getContext('2d');x.scale(2,2);drawDish(x,size/2,size/2,size*.4,d,lock);return c}
 // ── 화면 ──
 M.show=()=>{for(const id of['card','pick','reward'])$(id).classList.add('hide');$('map').classList.remove('hide');const n=DISH.filter(d=>col()[d.id]).length;$('mapCount').textContent=n?`${n}/12 dishes collected`:'No dishes yet'};
 M.cardInfo=()=>{if(!LAST)return;const s=LAST.score,t=s>=TIER[2].need?2:s>=TIER[1].need?1:0,det=LAST.det;
  $('scoreLine').innerHTML=`<div class="sc"><b>${s.toLocaleString()} pts</b> <span>${LAST.mode==='walk'?`PERFECT ${det.nP} · GOOD ${det.nG} · MISS ${det.nM} · Time bonus ${det.tb}`:`Dodged ${det.dodged} · Hits ${det.hits} · Time bonus ${det.tb}${det.nb?' · No-hit +300':''}`}</span></div><div class="tierHint">🎁 ${TIER[t].en} reward unlocked!${t<2?` ${TIER[t+1].need-s} more pts for ${TIER[t+1].en}`:''}</div>`};
 function reward(){const s=LAST?LAST.score:0,t=s>=TIER[2].need?2:s>=TIER[1].need?1:0;$('card').classList.add('hide');$('reward').classList.remove('hide');$('rwTitle').innerHTML=`${s.toLocaleString()} pts · Pick ONE dish for your Korean table<br><small>한국의 밥상 — higher scores unlock tastier dishes</small>`;
  const L=$('rwList');L.innerHTML='';let pick=null;$('rwOk').disabled=true;
  TIER.forEach((T,ti)=>{const sec=document.createElement('div');sec.className='tier'+(ti>t?' locked':'');sec.innerHTML=`<h3>${['🥢','✨','👑'][ti]} ${T.en}${ti?` (${T.need}+)`:''} <small>${T.ko}</small></h3>${ti>t?`<div class="lockMsg">🔒 Score ${T.need}+ to unlock ${DISH.filter(d=>d.t===ti).map(d=>d.en).slice(0,2).join(' & ')}!</div>`:''}`;
   const g=document.createElement('div');g.className='dg';for(const d of DISH.filter(d=>d.t===ti)){const b=document.createElement('button');b.className='dc';b.appendChild(thumb(d,ti>t));b.insertAdjacentHTML('beforeend',`<b>${d.en}</b><i>${d.ko}</i><p>${d.d}</p>${col()[d.id]?`<em>Owned ×${col()[d.id]}</em>`:''}`);
    if(ti<=t)b.onclick=()=>{pick=d;[...L.querySelectorAll('.dc')].forEach(e=>e.classList.remove('on'));b.classList.add('on');$('rwOk').disabled=false;$('rwOk').textContent='Get '+d.en};else b.disabled=true;g.appendChild(b)}
   sec.appendChild(g);L.appendChild(sec)});
  $('rwOk').onclick=()=>{if(!pick)return;const c=col();c[pick.id]=(c[pick.id]||0)+1;localStorage.bapsang=JSON.stringify(c);LAST=null;showTable(pick)}}
 function showTable(hi){for(const id of['reward','map','card'])$(id).classList.add('hide');$('tbl').classList.remove('hide');const cv=$('tblCv'),w=Math.min(innerWidth-24,760),hh=Math.min(innerHeight-170,w*.95);cv.style.width=w+'px';cv.style.height=hh+'px';cv.width=w*2;cv.height=hh*2;table(cv,hi&&hi.id);
  $('tblMsg').innerHTML=hi?`<b>${hi.en}</b> ${hi.ko} is now on your table! <small>${hi.d}</small>`:'Your collected dishes are served here. Higher scores unlock rarer dishes!'}
 M.table=showTable;M.reward=reward;M.DISH=DISH;
 addEventListener('DOMContentLoaded',()=>{});
 M.init=()=>{$('mapSvg').innerHTML=svg();$('bkPin').onclick=()=>{$('map').classList.add('hide');$('pick').classList.remove('hide')};$('mapTable').onclick=()=>showTable(null);$('tblBack').onclick=()=>{$('tbl').classList.add('hide');M.show()};$('toReward').onclick=reward;$('pickBack').onclick=()=>M.show();M.show()};
 return M})();
