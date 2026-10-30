// ── Run extras: weather, banners, music, ghosts, trail sprites, missions, sets, quiz ──
const FX=(()=>{
 const F={};
 // weather & time of day (random per run)
 const WX={sunrise:{k:'sunrise',icon:'🌅 Sunrise',en:'Sunrise hike',ko:'일출 산행',sub:'Golden light over Seoul.',win:1},
  day:{k:'day',icon:'☀️ Clear day',en:'Clear day',ko:'맑은 날',sub:'Perfect hiking weather.',win:1},
  sunset:{k:'sunset',icon:'🌇 Sunset',en:'Sunset hike',ko:'노을 산행',sub:'The city glows below.',win:1},
  rain:{k:'rain',icon:'🌧️ Rain',en:'Rainy trail',ko:'비',sub:'Slippery rocks: tighter timing, misses cost more!',win:.8,slip:1},
  snow:{k:'snow',icon:'❄️ Snow',en:'Snowy trail',ko:'눈',sub:'Icy steps: tighter timing, misses cost more!',win:.75,slip:1}};
 let wx=WX.day,ban=[],drops=[];
 F.wx=()=>wx;F.WX=WX;
 F.newRun=(force)=>{const ks=Object.keys(WX);wx=WX[force||ks[Math.floor(Math.random()*ks.length)]];ban=[];drops=[...Array(140)].map(()=>({x:Math.random(),y:Math.random(),s:.5+Math.random()}));
  F.say(`${wx.icon.split(' ')[0]} ${wx.en} · ${wx.ko}`,wx.sub,'#fff',3800);loadGhosts()};
 F.say=(t,sub,c,ms)=>{ban.push({t,sub,c,at:performance.now(),ms:ms||2400});if(ban.length>2)ban.shift()};
 // ── music: original WebAudio gugak-pop groove (janggu-style drums + pentatonic lead) ──
 let ac=null,master=null,muted=localStorage.mute==='1';const PENTA=[0,2,5,7,9,12,14],ROOT=220;
 F.unlock=()=>{if(ac){if(ac.state==='suspended')ac.resume();return}try{ac=new(window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=muted?0:.5;master.connect(ac.destination)}catch(e){ac=null}};
 F.muted=()=>muted;F.toggleMute=()=>{muted=!muted;localStorage.mute=muted?'1':'0';if(master)master.gain.value=muted?0:.5;return muted};
 const tAt=t=>ac.currentTime+Math.max(0,(t-performance.now())/1000);
 function tone(at,f,dur,type,vol,slide){const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,at);if(slide)o.frequency.exponentialRampToValueAtTime(f*slide,at+dur);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(vol,at+.008);g.gain.exponentialRampToValueAtTime(.001,at+dur);o.connect(g);g.connect(master);o.start(at);o.stop(at+dur+.05)}
 let nb=null;function noise(at,dur,vol,hp){if(!nb){nb=ac.createBuffer(1,ac.sampleRate*.3,ac.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
  const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=nb;f.type='highpass';f.frequency.value=hp;g.gain.setValueAtTime(vol,at);g.gain.exponentialRampToValueAtTime(.001,at+dur);s.connect(f);f.connect(g);g.connect(master);s.start(at);s.stop(at+dur+.02)}
 const MEL=[0,2,4,2,3,1,2,0, 4,5,4,3,2,1,0,1];
 F.beat=(t,i,sec,fev)=>{if(!ac||muted)return;const at=tAt(t);
  if(i%4===0)tone(at,70,.32,'sine',.9,.55);// "deong" (both sides)
  else if(i%2===0)tone(at,140,.16,'sine',.5,.7);// "kung"
  noise(at,i%2?.05:.08,i%2?.18:.3,i%2?5000:2500);// "ttak"/ hats
  if(sec==='granite'&&i%3===2)noise(at,.12,.35,1800);
  const n=PENTA[MEL[i%16]%PENTA.length]+(fev?12:0);tone(at,ROOT*Math.pow(2,n/12),.22,'triangle',.18);
  if(i%4===0)tone(at,ROOT/2*Math.pow(2,PENTA[(Math.floor(i/4))%3]/12),.5,'sawtooth',.05)};
 // ── ghosts: personal best + today's #1 (server) ──
 let ghosts=[];F.top=null;
 function loadGhosts(){ghosts=[];try{const pb=JSON.parse(localStorage.ghostPB||'null');if(pb&&pb.tl&&pb.tl.length>2)ghosts.push({name:'👻 My best '+fmt(pb.ms),tl:pb.tl,c:'#9fd3ff'})}catch(e){}
  if(F.top&&F.top.tl)ghosts.push({name:'👑 Today #1 '+F.top.name,tl:F.top.tl,c:'#ffd76a'})}
 F.setTop=g=>{F.top=g;loadGhosts()};
 F.savePB=(ms,tl)=>{try{const pb=JSON.parse(localStorage.ghostPB||'null');if(!pb||ms<pb.ms){localStorage.ghostPB=JSON.stringify({ms,tl});return true}}catch(e){}return false};
 F.ghosts=now=>{const st=RH.state();if(!st.sent)return[];const t0=RH._t0();if(!t0)return[];const e=(now-t0)/2000;
  return ghosts.map(g=>{const i=Math.floor(e),a=g.tl[Math.min(i,g.tl.length-1)],b=g.tl[Math.min(i+1,g.tl.length-1)];return{...g,d:a+(b-a)*(e-i)}})};
 const fmt=ms=>{const s=Math.round(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};F.fmt=fmt;
 // ── trail sprites (squirrel / grandpa / spring) ──
 F.world=(now,gx,gyd,HS)=>{const e=RH.ev();if(!e)return;const x=gx(e.at),y=gyd(e.at);if(x<-60||x>W+60)return;ctx.save();ctx.translate(x,y);ctx.scale(HS,HS);
  if(e.k==='sq'){const hop=Math.abs(Math.sin(now/140))*4;ctx.translate(0,-hop);
   ctx.fillStyle='#8a5a32';ctx.beginPath();ctx.ellipse(10,-16,9,16,-.5,0,7);ctx.fill();ctx.fillStyle='#a86d3c';ctx.beginPath();ctx.ellipse(12,-20,5,11,-.5,0,7);ctx.fill();// tail
   ctx.fillStyle='#9a6236';ctx.beginPath();ctx.ellipse(-2,-8,8,9,0,0,7);ctx.fill();ctx.beginPath();ctx.arc(-6,-18,6,0,7);ctx.fill();
   ctx.fillStyle='#f0d8b0';ctx.beginPath();ctx.ellipse(-4,-6,4,6,0,0,7);ctx.fill();ctx.fillStyle='#222';ctx.beginPath();ctx.arc(-8,-19,1.4,0,7);ctx.fill();
   ctx.fillStyle='#9a6236';ctx.beginPath();ctx.moveTo(-6,-24);ctx.lineTo(-4,-29);ctx.lineTo(-2,-23);ctx.fill();
   ctx.strokeStyle='#3a2a1a';ctx.lineWidth=1;for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(-10,-23+s*1.5);ctx.lineTo(-15,-23+s*3);ctx.stroke()}
   if(!e.done){ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.strokeStyle='#0008';ctx.lineWidth=3;const t=`${e.got}/${e.need} PERFECT`;ctx.strokeText(t,0,-40);ctx.fillText(t,0,-40)}}
  if(e.k==='gp'){ctx.fillStyle='#5a3a22';ctx.fillRect(-26,-12,22,12);ctx.fillStyle='#f4efe0';ctx.beginPath();ctx.ellipse(-15,-16,6,8,0,0,7);ctx.fill();ctx.fillStyle='#d8cfb8';ctx.fillRect(-18,-26,6,4);// makgeolli bottle
   ctx.fillStyle='#e8e0cc';ctx.beginPath();ctx.ellipse(-22,-14,4,2,0,0,7);ctx.fill();
   ctx.fillStyle='#5e6e8a';ctx.beginPath();ctx.roundRect(2,-28,16,20,5);ctx.fill();ctx.fillStyle='#3a3a44';ctx.fillRect(4,-9,5,9);ctx.fillRect(11,-9,5,9);
   ctx.fillStyle='#f0c8a0';ctx.beginPath();ctx.arc(10,-35,7,0,7);ctx.fill();ctx.fillStyle='#ddd';ctx.beginPath();ctx.ellipse(10,-30,5,3,0,0,Math.PI);ctx.fill();
   ctx.fillStyle='#c8a050';ctx.beginPath();ctx.ellipse(10,-41,11,3,0,0,7);ctx.fill();ctx.beginPath();ctx.arc(10,-42,6,Math.PI,0);ctx.fill();
   ctx.fillStyle='#222';ctx.fillRect(6,-36,2,1.5);ctx.fillRect(12,-36,2,1.5);ctx.fillStyle='#ff9a9a';ctx.beginPath();ctx.arc(10,-33,1.3,0,7);ctx.fill()}
  if(e.k==='sp'){ctx.fillStyle='#8a8478';ctx.beginPath();ctx.ellipse(0,-4,26,9,0,0,7);ctx.fill();ctx.fillStyle='#4fa8d8';ctx.beginPath();ctx.ellipse(0,-5,20,6,0,0,7);ctx.fill();
   ctx.fillStyle='#bfe8ff';ctx.beginPath();ctx.ellipse(-5,-6,8,2,0,0,7);ctx.fill();ctx.fillStyle='#6b6458';ctx.fillRect(14,-30,6,24);ctx.fillStyle='#888';ctx.fillRect(4,-28,14,4);
   ctx.strokeStyle='#8fd8ff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(5,-24);ctx.quadraticCurveTo(2,-16,1,-8);ctx.stroke();
   ctx.fillStyle='#d24a3a';ctx.beginPath();ctx.ellipse(-16,-14,5,3,0,0,7);ctx.fill();ctx.fillStyle='#4a3a2a';ctx.fillRect(-15,-24,2,9)}
  ctx.restore()};
 // ── screen overlay: weather tint, rain/snow, fever glow, banners ──
 F.overlay=now=>{const k=wx.k;
  if(k==='sunrise'){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(255,150,120,.28)');g.addColorStop(.6,'rgba(255,200,140,.12)');g.addColorStop(1,'rgba(255,220,180,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
  if(k==='sunset'){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(120,60,150,.32)');g.addColorStop(.5,'rgba(255,110,60,.2)');g.addColorStop(1,'rgba(80,30,60,.18)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
  if(k==='rain'){ctx.fillStyle='rgba(40,55,75,.25)';ctx.fillRect(0,0,W,H);ctx.strokeStyle='rgba(200,220,255,.5)';ctx.lineWidth=1.2;ctx.beginPath();for(const d of drops){const y=((d.y*H+now*.9*d.s)%(H+40))-20,x=((d.x*W-now*.12*d.s)%W+W)%W;ctx.moveTo(x,y);ctx.lineTo(x-3,y+14*d.s)}ctx.stroke()}
  if(k==='snow'){ctx.fillStyle='rgba(220,230,245,.18)';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(255,255,255,.9)';ctx.beginPath();for(const d of drops){const y=((d.y*H+now*.05*d.s)%(H+10)),x=((d.x*W+Math.sin(now/900+d.y*9)*20)%W+W)%W;ctx.moveTo(x,y);ctx.arc(x,y,1.2+d.s*1.4,0,7)}ctx.fill()}
  if(RH.fever()){const h=now/4%360,p=.5+.5*Math.sin(now/90);ctx.save();ctx.lineWidth=14+p*8;ctx.strokeStyle=`hsla(${h},100%,60%,.55)`;ctx.shadowColor=`hsl(${(h+60)%360},100%,60%)`;ctx.shadowBlur=30;ctx.strokeRect(0,0,W,H);ctx.restore();
   ctx.save();ctx.textAlign='center';ctx.font=`900 italic ${Math.round(34+p*6)}px sans-serif`;ctx.lineWidth=6;ctx.strokeStyle='#4a0a3a';const ty=H*.36;ctx.strokeText('FEVER ×2',W/2,ty);const g=ctx.createLinearGradient(W/2-90,0,W/2+90,0);for(let i=0;i<5;i++)g.addColorStop(i/4,`hsl(${(h+i*50)%360},100%,62%)`);ctx.fillStyle=g;ctx.fillText('FEVER ×2',W/2,ty);
   for(let i=0;i<14;i++){const a=i/14*6.283+now/600,r=110+Math.sin(now/200+i)*20;ctx.fillStyle=`hsl(${(h+i*25)%360},100%,70%)`;ctx.beginPath();ctx.arc(W/2+Math.cos(a)*r,ty-10+Math.sin(a)*r*.45,3+((i+((now/100)|0))%3),0,7);ctx.fill()}ctx.restore()}
  MP.overlay(now);const land=innerWidth>innerHeight&&innerHeight<520;let by=land?H*.3:H*.24;
  for(const b of ban){const e=now-b.at;if(e>b.ms)continue;const a=Math.min(1,e/200,(b.ms-e)/300);ctx.save();ctx.globalAlpha=a;ctx.font='800 17px sans-serif';const w1=ctx.measureText(b.t).width;ctx.font='600 12.5px sans-serif';const w2=ctx.measureText(b.sub||'').width,bw=Math.min(W-24,Math.max(w1,w2)+32);
   ctx.fillStyle='rgba(18,26,30,.78)';ctx.beginPath();ctx.roundRect(W/2-bw/2,by-24,bw,b.sub?50:32,14);ctx.fill();ctx.textAlign='center';ctx.fillStyle=b.c;ctx.font='800 17px sans-serif';ctx.fillText(b.t,W/2,by-2,bw-16);
   if(b.sub){ctx.fillStyle='#ffffffd8';ctx.font='600 12.5px sans-serif';ctx.fillText(b.sub,W/2,by+16,bw-16)}ctx.restore();by+=58}};
 // ── daily missions ──
 const MIS=[{id:'nohop',en:'No hopping',ko:'깽깽이 금지',d:'Reach the summit with zero same-foot hops',ok:s=>s.hops===0},
  {id:'combo30',en:'Combo 30',ko:'30 콤보',d:'Hit a 30-step combo',ok:s=>s.best>=30},
  {id:'sub4',en:'Finish under 4:00',ko:'4분 컷',d:'Server time under 4 minutes',ok:s=>s.ms<240000},
  {id:'fever5',en:'5 Fevers',ko:'피버 5번',d:'Trigger Fever Time 5 times in one climb',ok:s=>s.fevers>=5},
  {id:'perf150',en:'150 PERFECTs',ko:'퍼펙트 150',d:'Land 150 PERFECT steps',ok:s=>s.nP>=150},
  {id:'squirrel',en:'Shoo the squirrel',ko:'다람쥐 쫓기',d:'Beat the squirrel challenge',ok:s=>s.sq===1}];
 const dayN=()=>{const d=new Date();return Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()))/864e5)};const dk=()=>new Date().toLocaleDateString('sv');
 F.missions=()=>{const n=dayN();return[MIS[n%MIS.length],MIS[(n+2)%MIS.length]]};
 F.missionDone=id=>!!JSON.parse(localStorage['mis_'+dk()]||'{}')[id];
 F.checkMissions=s=>{const got=[];const k='mis_'+dk(),m=JSON.parse(localStorage[k]||'{}');for(const q of F.missions())if(!m[q.id]&&q.ok(s)){m[q.id]=1;got.push(q)}localStorage[k]=JSON.stringify(m);return got};
 F.missionHTML=()=>'<div class="mis"><b>🎯 Daily missions <small>오늘의 미션</small></b>'+F.missions().map(q=>`<div class="${F.missionDone(q.id)?'done':''}">${F.missionDone(q.id)?'✅':'⬜'} <b>${q.en}</b> <small>${q.ko}</small><i>${q.d}</i></div>`).join('')+'<em>Complete one → pick a dish from one tier higher!</em></div>';
 // ── table sets ──
 F.SETS=[{id:'bibim',en:'Bibimbap Set',ko:'비빔밥 세트',title:'Bibimbap Master',ids:['bibimbap','kongnamul','sigeumchi','musaengchae','gyeran']},
  {id:'kimchi',en:'Kimchi Trio',ko:'김치 3종',title:'Kimchi Lover',ids:['kimchi','kkakdugi','oisobagi']},
  {id:'jjigae',en:'Stew Night',ko:'찌개 3종',title:'Jjigae Champion',ids:['kimchijjigae','doenjang','sundubu']},
  {id:'hanjeong',en:'Hanjeongsik Set',ko:'한정식',title:'Hanjeongsik Host',ids:['kimchi','japchae','bulgogi','galbijjim','pajeon','doenjang','godeungeo']},
  {id:'royal',en:'Royal Surasang',ko:'수라상',title:'Royal Chef of Joseon',ids:['gujeolpan','sinseollo','neobiani','tangpyeongchae','hwayangjeok']}];
 F.sets=col=>F.SETS.map(s=>({...s,have:s.ids.filter(i=>col[i]).length,done:s.ids.every(i=>col[i])}));
 // ── summit food quiz ──
 F.quiz=(cb)=>{const el=document.getElementById('quiz'),pool=DISH.slice(),pick=()=>pool.splice(Math.floor(Math.random()*pool.length),1)[0];const ans=pick(),ch=[ans,pick(),pick()].sort(()=>Math.random()-.5);
  el.innerHTML=`<div class="qz"><h2>🍽️ Summit Food Quiz <small>음식 퀴즈</small></h2><p>Which one is <b>${ans.en.split(' (')[0]}</b>? <small>${ans.ko}</small></p><div class="qc"></div><div class="qr"></div></div>`;
  const box=el.querySelector('.qc');let done=false;
  ch.forEach(d=>{const b=document.createElement('button');b._d=d;b.appendChild(MAP.thumb(d,false,110));b.onclick=()=>{if(done)return;done=true;const ok=d===ans;b.classList.add(ok?'ok':'no');[...box.children][ch.indexOf(ans)].classList.add('ok');
   el.querySelector('.qr').innerHTML=ok?`<b class="y">Correct! +150 pts 🎉</b><br>${ans.d}`:`<b class="n">Not quite!</b> That was ${d.en}. <br>${ans.en} — ${ans.d}`;setTimeout(()=>{el.classList.add('hide');cb(ok?150:0)},2200)};box.appendChild(b)});
  el.classList.remove('hide')};
 return F})();
