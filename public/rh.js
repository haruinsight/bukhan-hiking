// ── 왼발/오른발 리듬 걷기 ──
const RH=(()=>{
 const HOP=3.2,BASE=6,STEPV=1.5,MAXL=8;
 let last=null,lastT=0,v=0,lvl=0,combo=0,same=0,hop=false,fb=null,acc=0,d=0,beat0=0,pressAt=-1e9,foot=null,best=0,tPrev=0,sent=0,nP=0,nG=0,nM=0,nH=0;
 const I=()=>560-lvl*30;
 function reset(){last=null;lastT=0;v=0;lvl=0;combo=0;same=0;hop=false;fb=null;acc=0;d=0;beat0=0;sent=0;nP=0;nG=0;nM=0;nH=0;best=0}
 function press(f){const now=performance.now();if(!me||!ws||ws.readyState!==1||uiOpen()||d>=BK.L)return;
  let T=I();if(!beat0||now-lastT>2000)beat0=now;const ph=((now-beat0)%T+T)%T,off=Math.min(ph,T-ph);
  const nearest=ph<T/2?now-ph:now+T-ph;let res;
  if(f===last){same++;combo=0;hop=true;lvl=Math.max(0,lvl-(same===1?2:0));res=same===1?['발 꼬임!','MISS','#ff6b5a']:['깡깡이~','HOP','#ffb0e0'];same===1?nM++:nH++}
  else{same=0;hop=false;if(off<75){combo++;lvl=Math.min(MAXL,lvl+(combo%2===0?1:0));res=['완벽!','PERFECT','#ffe040'];nP++}
   else if(off<150){combo++;lvl=Math.min(MAXL,lvl+(combo%4===0?1:0));res=['좋아!','GOOD','#7be08f'];nG++}
   else{combo=0;lvl=Math.max(0,lvl-1);res=['박자 놓침','MISS','#ff6b5a'];nM++}}
  best=Math.max(best,combo);
  T=I();beat0=nearest;// 속도가 바뀌어도 박자 위상 유지
  fb={t:res[0],e:res[1],c:res[2],at:now,combo};last=f;lastT=now;pressAt=now;foot=f;
  v=Math.max(v,hop?HOP:BASE*.6)}
 function tick(now){const dt=Math.min(.1,(now-(tPrev||now))/1000);tPrev=now;const active=now-lastT<I()*1.6+150;
  const vT=active?(hop?HOP:BASE+lvl*STEPV):0;v+=(vT-v)*Math.min(1,dt*(vT<v?3:4));if(v<.05)v=0;
  if(hop){const t=(now-pressAt)/320;if(t>1)return mv(0)} // 깡깡이: 뛰는 동안만 앞으로
  const L=BK.L;if(d>=L)return mv(0);mv(v*dt)}
 function mv(dd){d=Math.min(BK.L,d+dd);if(BK.L-d<1e-6)d=BK.L;const need=d>=BK.L?Math.ceil(BK.L/10):Math.floor(d/10+1e-9);let n=0;while(sent<need&&n<3&&ws&&ws.readyState===1){ws.send('{"t":"step"}');sent++;n++}}
 function pos(serverH){const now=performance.now();tick(now);return d}
 function anim(now){if(hop){const t=Math.min(1,(now-pressAt)/320);return{pose:t<1?'h1':'h0',y:t<1?Math.round(Math.sin(t*Math.PI)*12):0}}
  if(v<.3)return{pose:'idle',y:0};const t=(now-pressAt)/I();
  const f=foot==='L'?(t<.5?'w0':'w1'):(t<.5?'w2':'w3');return{pose:t>1.2?['w0','w1','w2','w3'][Math.floor(d*1.6/5)%4]:f,y:0}}
 function hud(now){const land=innerWidth>innerHeight&&innerHeight<520,cx=W/2,T=I(),w=Math.min(W-40,land?W-380:320),y=land?H-46:H-182;
  const rr=(x,y,w,h,r,f)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=f;ctx.fill()};
  ctx.save();ctx.shadowColor='#0004';ctx.shadowBlur=12;rr(cx-w/2,y-18,w,36,18,'rgba(20,30,28,.55)');ctx.restore();
  ctx.strokeStyle='#ffffff30';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(cx-w/2+.5,y-17.5,w-1,35,17.5);ctx.stroke();
  const b0=beat0||now,ph=((now-b0)%T+T)%T,next=last==='L'?'R':'L';
  ctx.save();ctx.beginPath();ctx.roundRect(cx-w/2,y-18,w,36,18);ctx.clip();
  for(let k=0;k<6;k++){const t=(T-ph)+k*T,px=cx+t/T*(w/2-20)*.55;if(px>cx+w/2+14)continue;const f=(k%2===0)?next:(next==='L'?'R':'L');
   const g=ctx.createLinearGradient(0,y-11,0,y+11);g.addColorStop(0,f==='L'?'#7cc0ff':'#ffb072');g.addColorStop(1,f==='L'?'#2f7fe0':'#e8642a');
   ctx.globalAlpha=Math.max(.25,1-(px-cx)/(w/2));ctx.fillStyle=g;ctx.beginPath();ctx.arc(px,y,11,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.font='700 10px sans-serif';ctx.textAlign='center';ctx.fillText(f==='L'?'왼':'오',px,y+3.5)}
  ctx.restore();ctx.globalAlpha=1;
  const pulse=ph<90?1-ph/90:0;ctx.strokeStyle=`rgba(255,226,120,${.6+pulse*.4})`;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(cx,y,14+pulse*4,0,7);ctx.stroke();
  // 속도 게이지
  ctx.font='600 11px sans-serif';ctx.textAlign='left';ctx.fillStyle='#fff';ctx.shadowColor='#0008';ctx.shadowBlur=3;ctx.fillText(hop?'깡깡이':'속도',cx-w/2+8,y-25);ctx.shadowBlur=0;
  const gx=cx-w/2+46,gw=Math.min(110,w*.38);rr(gx,y-33,gw,8,4,'#ffffff30');
  const fr=hop?.08:lvl/MAXL;if(fr>0){const g=ctx.createLinearGradient(gx,0,gx+gw,0);g.addColorStop(0,'#7be08f');g.addColorStop(.55,'#ffd84a');g.addColorStop(1,'#ff6b5a');ctx.save();ctx.beginPath();ctx.roundRect(gx,y-33,Math.max(8,gw*fr),8,4);ctx.fillStyle=hop?'#ffb0e0':g;ctx.fill();ctx.restore()}
  ctx.textAlign='right';ctx.fillStyle='#fff';ctx.shadowBlur=3;ctx.fillText((hop?'깡깡이 속도':'Lv '+lvl)+(combo>1?'  · 콤보 '+combo:''),cx+w/2-6,y-25);ctx.shadowBlur=0;
  // 판정
  if(fb&&now-fb.at<650){const t=(now-fb.at)/650,s=t<.15?1+t*2:1.3-t*.3;ctx.save();ctx.translate(cx,y-74-t*14);ctx.scale(s,s);ctx.globalAlpha=1-Math.max(0,t-.6)/.4;ctx.textAlign='center';
   ctx.font='900 italic 26px sans-serif';ctx.shadowColor='#0007';ctx.shadowBlur=8;ctx.lineWidth=4;ctx.strokeStyle='#18322a';ctx.strokeText(fb.e,0,0);ctx.fillStyle=fb.c;ctx.fillText(fb.e,0,0);ctx.font='700 13px sans-serif';ctx.lineWidth=3;ctx.strokeText(fb.t,0,18);ctx.fillStyle='#fff';ctx.fillText(fb.t,0,18);ctx.restore()}
  if(!lastT&&me){ctx.textAlign='center';ctx.font='600 13px sans-serif';const s='왼발·오른발을 박자에 맞춰 번갈아 눌러요!',tw=ctx.measureText(s).width+24;rr(cx-tw/2,y-66,tw,26,13,'rgba(20,30,28,.55)');ctx.fillStyle='#fff';ctx.fillText(s,cx,y-48)}
  ctx.shadowBlur=0;ctx.textAlign='left'}
 return{_d:v=>{d=v},press,pos,anim,hud,reset,state:()=>({lvl,combo,hop,v,d,best,sent,nP,nG,nM,nH}),
 score:ms=>{const sec=ms/1000;const tb=Math.max(0,Math.round((330-sec)*4));const sk=nP*3+nG-nM*4-nH;return{score:Math.max(0,tb+Math.max(0,sk)+best*2),tb,nP,nG,nM,nH,best}}}})();
