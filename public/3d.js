import * as THREE from './vendor/three.module.js';
const $=id=>document.getElementById(id);
const dem=await (await fetch('dem.json')).json();
const N=dem.n,EX=1.35,LAT0=(dem.lat[0]+dem.lat[1])/2,LON0=(dem.lon[0]+dem.lon[1])/2,MLAT=111000,MLON=111320*Math.cos(LAT0*Math.PI/180);
const toXZ=(la,lo)=>[(lo-LON0)*MLON,-(la-LAT0)*MLAT];
const W=(dem.lon[1]-dem.lon[0])*MLON,D=(dem.lat[1]-dem.lat[0])*MLAT;
function elev(x,z){const j=(x/W+.5)*(N-1),i=(-z/D+.5)*(N-1);const i0=Math.max(0,Math.min(N-2,Math.floor(i))),j0=Math.max(0,Math.min(N-2,Math.floor(j))),fi=Math.min(1,Math.max(0,i-i0)),fj=Math.min(1,Math.max(0,j-j0));const h=(a,b)=>dem.h[a*N+b];
 return ((h(i0,j0)*(1-fj)+h(i0,j0+1)*fj)*(1-fi)+(h(i0+1,j0)*(1-fj)+h(i0+1,j0+1)*fj)*fi)}
const Y=(x,z)=>elev(x,z)*EX;
// 렌더러 (휴대폰 대비: 픽셀비 제한, 안티앨리어싱 끔)
const mobile=matchMedia('(pointer:coarse)').matches;
const R=new THREE.WebGLRenderer({canvas:$('gl'),antialias:!mobile,powerPreference:'high-performance'});R.setPixelRatio(Math.min(devicePixelRatio,mobile?1.25:1.5));
const scene=new THREE.Scene();const FOG=0xbfd6e8;scene.background=new THREE.Color(FOG);scene.fog=new THREE.Fog(FOG,500,3200);
const cam=new THREE.PerspectiveCamera(55,1,1,9000);
scene.add(new THREE.HemisphereLight(0xdfefff,0x56664a,1.2));const sun=new THREE.DirectionalLight(0xfff1d6,2.2);sun.position.set(-800,1500,900);scene.add(sun);
// 하늘 돔(그라데이션)
{const g=new THREE.SphereGeometry(6000,24,12),c=[],p=g.attributes.position;for(let i=0;i<p.count;i++){const t=Math.max(0,p.getY(i)/6000);const col=new THREE.Color().lerpColors(new THREE.Color(FOG),new THREE.Color(0x4f8fd0),Math.pow(t,.6));c.push(col.r,col.g,col.b)}g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));scene.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false})))}
// 지형 메시 (SRTM 30m 실제 고도)
const geo=new THREE.PlaneGeometry(W,D,N-1,N-1);geo.rotateX(-Math.PI/2);
{const p=geo.attributes.position,col=[];const forest=new THREE.Color(0x3f7a3a),fall=new THREE.Color(0xc8702e),fall2=new THREE.Color(0xd9a33a),rock=new THREE.Color(0xa8a6a0),rock2=new THREE.Color(0xc9c4b8),low=new THREE.Color(0x5d8a4a);
 for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),e=elev(x,z);p.setY(i,e*EX);
  const sl=Math.hypot(elev(x+30,z)-elev(x-30,z),elev(x,z+30)-elev(x,z-30))/60; const n=(Math.sin(x*.013)*Math.cos(z*.017)+Math.sin(x*.041+z*.03))*.5;
  let c=e<220?low.clone():forest.clone();if(e>250&&e<640&&n>.25)c.lerp(n>.6?fall2:fall,.75);
  const rk=Math.min(1,Math.max(0,(e-600)/120)+Math.max(0,(sl-.75)*1.6));c.lerp(n>0?rock2:rock,rk);col.push(c.r,c.g,c.b)}
 geo.setAttribute('color',new THREE.Float32BufferAttribute(col,3));geo.computeVertexNormals()}
const terrain=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({vertexColors:true,flatShading:true}));scene.add(terrain);terrain.updateMatrixWorld();
const rc=new THREE.Raycaster(),DOWN=new THREE.Vector3(0,-1,0);function Yt(x,z){rc.set(new THREE.Vector3(x,3000,z),DOWN);const h=rc.intersectObject(terrain,false)[0];return h?h.point.y:Y(x,z)}
// 화강암 봉우리 보강(인수봉·백운대·만경대): 회색 바위 덩어리
const rockMat=new THREE.MeshLambertMaterial({color:0xb3aea4,flatShading:true});
function dome(la,lo,r,h,name){const[x,z]=toXZ(la,lo);const g=new THREE.SphereGeometry(r,10,7,0,Math.PI*2,0,Math.PI/2);const p=g.attributes.position;for(let i=0;i<p.count;i++){p.setX(i,p.getX(i)*(1+Math.sin(i*3.1)*.06));p.setZ(i,p.getZ(i)*(1+Math.cos(i*2.3)*.06))}g.computeVertexNormals();const m=new THREE.Mesh(g,rockMat);m.scale.y=h/r;m.position.set(x,Y(x,z)-h*.35,z);scene.add(m);if(name)scene.add(sign(name,x,Y(x,z)+h*.75,z,'#5a5a66',1.4))}
dome(37.66029,126.97945,60,90,'인수봉');
{const[a,b]=[toXZ(37.6560,126.9812),toXZ(37.6545,126.9840)];for(let k=0;k<6;k++){const x=a[0]+(b[0]-a[0])*k/5,z=a[1]+(b[1]-a[1])*k/5;const g=new THREE.ConeGeometry(28,60+(k%2)*30,5);const m=new THREE.Mesh(g,rockMat);m.position.set(x,Y(x,z)+20,z);scene.add(m)}const[mx,mz]=toXZ(37.6553,126.9826);scene.add(sign('만경대',mx,Y(mx,mz)+110,mz,'#5a5a66',1.3))}
// 백운대 코스 (지점 좌표는 지도 참고 추정)
const WP=[[37.6580,126.9930,'백운대탐방지원센터',0],[37.6596,126.9905,'도선사 갈림길',350],[37.6612,126.9878,'하루재',800],[37.6609,126.9858,'인수암',1000],[37.6603,126.9824,'백운산장',1400],[37.6594,126.9800,'위문(백운봉암문)',1650],[37.65898,126.97771,'백운대 정상',1900]];
const raw=WP.map(w=>{const[x,z]=toXZ(w[0],w[1]);return new THREE.Vector3(x,Y(x,z),z)});
const curve0=new THREE.CatmullRomCurve3(raw,false,'centripetal');
const pts=curve0.getSpacedPoints(400).map(v=>{v.x+=Math.sin(v.z*.05)*6;v.y=Yt(v.x,v.z)+1.2;return v});
const path=new THREE.CatmullRomCurve3(pts);const PL=path.getLength();
// 코스 거리 d(0~1900m) → 곡선 위치 (지점 간 구간별 매핑)
const wpT=WP.map(w=>{const[x,z]=toXZ(w[0],w[1]);let best=0,bd=1e9;for(let i=0;i<=400;i++){const p=path.getPointAt(i/400),dd=(p.x-x)**2+(p.z-z)**2;if(dd<bd){bd=dd;best=i/400}}return best});wpT[0]=0;wpT[wpT.length-1]=1;
function tOf(d){d=Math.max(0,Math.min(1900,d));for(let i=1;i<WP.length;i++)if(d<=WP[i][3]){const f=(d-WP[i-1][3])/(WP[i][3]-WP[i-1][3]);return wpT[i-1]+(wpT[i]-wpT[i-1])*f}return 1}
scene.add(new THREE.Mesh(new THREE.TubeGeometry(path,500,1.4,4,false),new THREE.MeshLambertMaterial({color:0xd8b47a})));
// 쇠난간 (위문~정상)
{const posts=[],g=new THREE.CylinderGeometry(.25,.25,4,4);const im=new THREE.InstancedMesh(g,new THREE.MeshLambertMaterial({color:0x444444}),40);const m=new THREE.Matrix4();const rail=[];
 for(let k=0;k<40;k++){const t=tOf(1600+k*7.5),p=path.getPointAt(t),tg=path.getTangentAt(t),side=new THREE.Vector3(-tg.z,0,tg.x).normalize().multiplyScalar(4);const q=p.clone().add(side);q.y=Yt(q.x,q.z)+2;m.makeTranslation(q.x,q.y,q.z);im.setMatrixAt(k,m);rail.push(q.clone().setY(q.y+1.8))}
 scene.add(im);scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rail),new THREE.LineBasicMaterial({color:0x333333})))}
const signs=[];// 표지판 빌보드
function sign(text,x,y,z,bg='#2f5d3a',s=1){const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');g.font='bold 52px sans-serif';const w=Math.min(500,g.measureText(text).width+40);g.fillStyle=bg;g.beginPath();g.roundRect((512-w)/2,14,w,96,22);g.fill();g.fillStyle='#fff';g.textAlign='center';g.textBaseline='middle';g.fillText(text,256,64);
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthWrite:false}));sp.scale.set(64*s,16*s,1);sp.position.set(x,y,z);return sp}
for(const w of WP.slice(0,-1)){const p=path.getPointAt(tOf(w[3]));const pole=new THREE.Mesh(new THREE.CylinderGeometry(.4,.4,10,5),new THREE.MeshLambertMaterial({color:0x6b4a2b}));pole.position.set(p.x+6,p.y+5,p.z);scene.add(pole);const ee=Math.round(BK.alt(w[3]));const sg=sign(`${w[2]} ${ee}m`,p.x+6,p.y+14,p.z,'#2f5d3a',.38);sg.userData.wp=1;signs.push(sg);scene.add(sg)}
// 정상 태극기
const top=path.getPointAt(1);{const c=document.createElement('canvas');c.width=300;c.height=200;const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,300,200);const cx=150,cy=100,r=50;g.fillStyle='#cd2e3a';g.beginPath();g.arc(cx,cy,r,Math.PI,0);g.fill();g.fillStyle='#0047a0';g.beginPath();g.arc(cx,cy,r,0,Math.PI);g.fill();g.fillStyle='#cd2e3a';g.beginPath();g.arc(cx-25,cy,25,0,7);g.fill();g.fillStyle='#0047a0';g.beginPath();g.arc(cx+25,cy,25,0,7);g.fill();
 g.fillStyle='#000';for(const[a,b,rot]of[[50,40,-.6],[250,40,.6],[50,160,.6],[250,160,-.6]]){g.save();g.translate(a,b);g.rotate(rot);for(let i=0;i<3;i++)g.fillRect(-24,-14+i*11,48,7);g.restore()}
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,16,6),new THREE.MeshLambertMaterial({color:0x777777}));pole.position.set(top.x,top.y+8,top.z);scene.add(pole);
 var flagG=new THREE.PlaneGeometry(9,6,8,2);var flag=new THREE.Mesh(flagG,new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide}));flag.position.set(top.x+4.5,top.y+13,top.z);scene.add(flag);
 scene.add(sign('백운대 836m',top.x,top.y+24,top.z,'#c0392b',.6))}
// 나무 인스턴싱
{const cnt=mobile?1400:2600,g=new THREE.ConeGeometry(5,16,5);g.translate(0,8,0);const im=new THREE.InstancedMesh(g,new THREE.MeshLambertMaterial({flatShading:true}),cnt);const m=new THREE.Matrix4(),q=new THREE.Quaternion(),s=new THREE.Vector3(),c=new THREE.Color();let k=0,tries=0;
 while(k<cnt&&tries<cnt*8){tries++;const x=(Math.random()-.5)*W*.96,z=(Math.random()-.5)*D*.96,e=elev(x,z);const sl=Math.hypot(elev(x+30,z)-elev(x-30,z),elev(x,z+30)-elev(x,z-30))/60;if(e>630||sl>.8)continue;
  let near=false;for(let i=0;i<=40;i+=1){const p=path.getPointAt(i/40);if((p.x-x)**2+(p.z-z)**2<64){near=true;break}}if(near)continue;
  const sc=.7+Math.random()*.8;s.set(sc,sc*(.8+Math.random()*.5),sc);m.compose(new THREE.Vector3(x,Yt(x,z)-1,z),q,s);im.setMatrixAt(k,m);const r=Math.random();c.set(r<.22?0xd06a2a:r<.32?0xe0a838:r<.4?0xb5452e:(r<.7?0x2f6b3a:0x3d7d45));im.setColorAt(k,c);k++}
 im.count=k;scene.add(im)}
// 멀리 서울 도심 빌딩 블록(남쪽)
{const cnt=mobile?350:700,g=new THREE.BoxGeometry(1,1,1);g.translate(0,.5,0);const im=new THREE.InstancedMesh(g,new THREE.MeshLambertMaterial(),cnt);const m=new THREE.Matrix4(),c=new THREE.Color();
 for(let k=0;k<cnt;k++){const x=(Math.random()-.4)*5200,z=D/2+300+Math.random()*3200;const h=k===0?420:30+Math.pow(Math.random(),3)*160,w=25+Math.random()*40;m.makeScale(k===0?40:w,h,k===0?40:w);m.setPosition(k===0?2300:x,40,k===0?3600:z);im.setMatrixAt(k,m);c.setHSL(.58,.1,.55+Math.random()*.2);im.setColorAt(k,c)}
 scene.add(im);const ground=new THREE.Mesh(new THREE.PlaneGeometry(14000,9000),new THREE.MeshLambertMaterial({color:0x8a9a86}));ground.rotation.x=-Math.PI/2;ground.position.set(0,30,0);scene.add(ground);
 scene.add(sign('서울 도심',0,330,D/2+1800,'#34495e',4))}
// 캐릭터
const COL=[0xe8553b,0x3a7bd5,0xf2b632,0x8e5bd6,0x2aa876,0xff7aa8];const L=new THREE.MeshLambertMaterial({color:0x3a3a4a}),skin=new THREE.MeshLambertMaterial({color:0xffd9b3});
function makeHiker(p,mine){const g=new THREE.Group();const s=mine?1.25:1;
 const body=new THREE.Mesh(new THREE.CapsuleGeometry(.9,1.2,3,8),new THREE.MeshLambertMaterial({color:COL[p.c%6]}));body.position.y=2.4;g.add(body);
 const pack=new THREE.Mesh(new THREE.BoxGeometry(1.3,1.6,.8),new THREE.MeshLambertMaterial({color:0x8a5a2b}));pack.position.set(0,2.6,-.9);g.add(pack);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.95,10,8),skin);head.position.y=4.3;g.add(head);
 const hm=new THREE.MeshLambertMaterial({color:mine?0xffcf33:0xf1efe6});const brim=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,.15,12),hm);brim.position.y=4.95;g.add(brim);const crown=new THREE.Mesh(new THREE.SphereGeometry(.85,10,6,0,Math.PI*2,0,Math.PI/2),hm);crown.position.y=5;g.add(crown);
 const legs=[-.4,.4].map(x=>{const l=new THREE.Mesh(new THREE.CapsuleGeometry(.3,1,2,6),L);l.position.set(x,.8,0);g.add(l);return l});
 const tag=sign((mine?'나 · ':'')+p.name,0,8,0,mine?'#f0602a':'#000000aa',.16);g.add(tag);g.scale.setScalar(s);g.userData={legs,tag,body};scene.add(g);return g}
// 멀티플레이 (기존 WebSocket 서버 그대로)
let ws,me,players=[],objs=new Map(),walk={},today=0,lastH={},mount={name:'북한산 백운대',h:1900,course:true};
$('nick').value=localStorage.nick||'';
$('go').onclick=()=>{localStorage.nick=$('nick').value;$('pick').classList.add('hide');connect()};
const dayKey=()=>new Date().toLocaleDateString('sv');
function connect(){ws=new WebSocket((location.protocol==='https:'?'wss://':'ws://')+location.host);window.ws=ws;ws.onopen=()=>{today=+(localStorage['t_bukhan_'+dayKey()]||0);ws.send(JSON.stringify({t:'join',mt:'bukhan',name:$('nick').value}))};
 ws.onmessage=e=>{const d=JSON.parse(e.data);if(d.t==='hello')me=d.id,$('who').textContent=`${d.room}번 방`;
  if(d.t==='state'){players=d.players;for(const p of players){if(lastH[p.id]!==undefined&&p.h>lastH[p.id])walk[p.id]=performance.now();lastH[p.id]=p.h}
   for(const[id,o]of objs)if(!players.find(p=>p.id===id)){scene.remove(o);objs.delete(id)}
   for(const p of players)if(!objs.has(p.id))objs.set(p.id,Object.assign(makeHiker(p,p.id===me),{dd:p.h}));
   const m=players.find(p=>p.id===me);$('who').textContent=$('who').textContent.split(' ·')[0]+` · 함께 ${players.length}/100명`;
   if(m){$('myH').textContent=Math.round(BK.alt(m.h))+'m';$('goal').textContent=(m.h/1000).toFixed(2)+' / 1.9km';$('barI').style.width=(m.h/19)+'%';const z=m.h<800?'🌲 숲길':m.h<1400?'🪨 바윗길·돌계단':'⛰️ 화강암 암릉·쇠난간';$('spot').textContent='📍 '+BK.spot(m.h)+' · '+z}}
  if(d.t==='summit'){today++;localStorage['t_bukhan_'+dayKey()]=today;showCard()}};ws.onclose=()=>setTimeout(connect,1500)}
const step=()=>{if(ws&&ws.readyState===1&&me&&$('card').classList.contains('hide'))ws.send('{"t":"step"}')};
$('stepBtn').onclick=step;onkeydown=e=>{if(e.code==='Space'){e.preventDefault();step()}};
// 카메라·애니메이션
function resize(){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}addEventListener('resize',resize);resize();
const camPos=new THREE.Vector3(),look=new THREE.Vector3();let first=true;
function frame(now){requestAnimationFrame(frame);
 for(const p of players){const o=objs.get(p.id);if(!o)continue;o.dd+=(p.h-o.dd)*.15;if(Math.abs(p.h-o.dd)>100)o.dd=p.h;const off=p.id===me?0:((p.id*37)%9-4)*1.6;const t=tOf(o.dd),pt=path.getPointAt(t),tg=path.getTangentAt(t);const side=new THREE.Vector3(-tg.z,0,tg.x).normalize();
  o.position.set(pt.x+side.x*off,0,pt.z+side.z*off);o.position.y=Yt(o.position.x,o.position.z)+.2;o.rotation.y=Math.atan2(tg.x,tg.z);
  const since=now-(walk[p.id]||-1e9),mv=since<400,ph=mv?Math.sin(since/45):0;o.userData.legs[0].rotation.x=ph*.7;o.userData.legs[1].rotation.x=-ph*.7;o.userData.body.position.y=2.4+(mv?Math.abs(ph)*.3:0);
  o.userData.tag.visible=p.id===me||o.position.distanceTo(camPos)<160}
 const mo=objs.get(me);if(mo){const t=tOf(mo.dd),tg=path.getTangentAt(Math.max(0,t-.002));const back=new THREE.Vector3(tg.x,0,tg.z).normalize();
  const want=mo.position.clone().addScaledVector(back,-40).add(new THREE.Vector3(0,42,0));let gy=0;for(let i=0;i<=8;i++){const f=i/8,x=mo.position.x+(want.x-mo.position.x)*f,z=mo.position.z+(want.z-mo.position.z)*f;gy=Math.max(gy,Y(x,z)+12+f*10)}if(want.y<gy)want.y=gy;
  let lk=mo.position.clone().lerp(path.getPointAt(Math.min(1,t+.02)),.35);lk.y+=6;if(mo.dd>1840){want.copy(mo.position).add(new THREE.Vector3(-8,26,-40));lk=mo.position.clone().add(new THREE.Vector3(12,-14,90))}if(first||camPos.distanceTo(want)>120){camPos.copy(want);look.copy(lk);first=false}camPos.lerp(want,.08);{const tgt=mo.position.clone();tgt.y+=4;for(let it=0;it<30;it++){const dir=tgt.clone().sub(camPos),L=dir.length();rc.set(camPos,dir.normalize());rc.far=L-3;const h=rc.intersectObject(terrain,false);rc.far=Infinity;if(!h.length&&Yt(camPos.x,camPos.z)+3<camPos.y)break;camPos.y+=6}}look.lerp(lk,.08)}
 else{const t=now*.00005;camPos.set(Math.cos(t)*1500,1400,Math.sin(t)*1500+400);look.set(-300,600,0)}
 cam.position.copy(camPos);cam.lookAt(look);for(const sg of signs)sg.visible=sg.position.distanceTo(camPos)>70;
 if(flag){const p=flagG.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i);p.setZ(i,Math.sin(x*.8+now*.006)*.5*(x+4.5)/9)}p.needsUpdate=true}
 R.render(scene,cam)}
$('load').remove();requestAnimationFrame(frame);
// 인증 카드 (2D와 같은 디자인)
let cardCv;function showCard(){const c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d');BK.card(x);x.fillStyle='#fff';x.textAlign='center';x.font='bold 64px sans-serif';x.fillText('정상 인증',540,150);x.font='bold 96px sans-serif';x.fillText('북한산 백운대',540,300);x.font='bold 56px sans-serif';x.fillText('836m',540,380);
 x.fillStyle='#fffffff0';x.beginPath();x.roundRect(90,1000,900,270,40);x.fill();x.fillStyle='#333';const nm=(players.find(p=>p.id===me)||{}).name||'';const d=new Date();x.font='bold 60px sans-serif';x.fillText(nm,540,1085);x.font='44px sans-serif';x.fillText(`${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`,540,1160);x.fillStyle='#f0602a';x.font='bold 48px sans-serif';x.fillText(`오늘 정상 ${today}번째 🏁`,540,1235);x.fillStyle='#fff';x.font='32px sans-serif';x.fillText('같이 등산 ⛰️ 함께 오르는 온라인 산',540,1330);
 cardCv=c;$('cardImg').src=c.toDataURL('image/png');$('card').classList.remove('hide')}
$('save').onclick=()=>{const a=document.createElement('a');a.href=cardCv.toDataURL('image/png');a.download=`북한산백운대_정상인증_${dayKey()}.png`;a.click()};
$('share').onclick=()=>cardCv.toBlob(async b=>{const f=new File([b],'summit.png',{type:'image/png'}),txt=`북한산 백운대 836m 정상 찍었다! 오늘 ${today}번째 ⛰️`;try{if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],text:txt,url:location.href});else if(navigator.share)await navigator.share({text:txt,url:location.href});else{await navigator.clipboard.writeText(txt+' '+location.href);alert('공유 문구를 복사했어요!')}}catch(e){}});
$('again').onclick=()=>$('card').classList.add('hide');
