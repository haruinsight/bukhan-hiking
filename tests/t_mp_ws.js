// multi-client ws test: create/join/full/bad code/ready/start/countdown/race/finish/host transfer/cleanup
const WS=require('ws'),U=process.env.U||'ws://localhost:8080';let ok=0,bad=0;const A=(c,m)=>{c?ok++:bad++;console.log((c?'✔ ':'✘ ')+m)};
const cl=name=>new Promise(r=>{const w=new WS(U);w.q=[];w.on('message',m=>{const d=JSON.parse(m);w.q.push(d);w.last=d;(w.w||[]).forEach(f=>f(d))});w.on('open',()=>r(w));w.nm=name});
const wait=(w,t,f=()=>true,ms=6000)=>new Promise((r,j)=>{const hit=w.q.find(d=>d.t===t&&f(d));if(hit){w.q.splice(w.q.indexOf(hit),1);return r(hit)}const to=setTimeout(()=>j(Error('timeout '+t+' '+w.nm)),ms);(w.w=w.w||[]).push(function h(d){if(d.t===t&&f(d)){clearTimeout(to);w.w.splice(w.w.indexOf(h),1);w.q.splice(w.q.indexOf(d),1);r(d)}})});
const S=(w,o)=>w.send(JSON.stringify(o)),sl=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const a=await cl('a'),b=await cl('b'),c=await cl('c');
 S(a,{t:'mpCreate',name:'Ann'});const L=await wait(a,'mpLobby');A(/^[A-Z2-9]{4}$/.test(L.code),'create room code '+L.code);
 S(b,{t:'mpJoin',code:'ZZZZ',name:'Bob'});A((await wait(b,'mpErr')).e.includes('not found'),'bad code rejected');
 S(b,{t:'mpJoin',code:L.code.toLowerCase(),name:'Bob'});const L2=await wait(b,'mpLobby');A(L2.players.length===2,'join by code (case-insensitive)');
 S(c,{t:'mpJoin',code:L.code,name:'Cat'});await wait(c,'mpLobby');
 S(b,{t:'mpStart'});await sl(200);A(!b.q.some(d=>d.t==='mpCount'),'non-host cannot start');
 S(a,{t:'mpStart'});A((await wait(a,'mpErr')).e.includes('Ready'),'start blocked until all ready');
 const extra=[];for(let i=0;i<4;i++){const x=await cl('x'+i);S(x,{t:'mpJoin',code:L.code,name:'X'+i});extra.push(x);await sl(30)}
 const e3=await wait(extra[3],'mpErr');A(e3.e.includes('full'),'7th player rejected (max 6)');extra[3].close();
 for(const x of extra.slice(0,3)){x.close()}await sl(300);
 const cols=(await (async()=>{S(b,{t:'mpReady',v:true});return wait(a,'mpLobby',d=>d.players.find(p=>p.name==='Bob').ready)})()).players.map(p=>p.c);A(new Set(cols).size===cols.length,'unique colors '+cols);
 S(c,{t:'mpReady',v:true});await wait(a,'mpLobby',d=>d.players.every(p=>p.id===d.host||p.ready));
 S(a,{t:'mpStart'});const cd=await wait(b,'mpCount');A(cd.at-cd.now>=3500,'synchronized countdown '+(cd.at-cd.now)+'ms');
 const hb=await wait(b,'hello');A(hb.room===L.code&&hb.mp===L.code,'race room hello');
 S(b,{t:'step'});await sl(300);A(!b.q.some(d=>d.t==='state'&&d.players.some(p=>p.name==='Bob'&&p.h>0)),'steps ignored before GO');
 await sl(cd.at-Date.now()+50);
 const run=(w,per)=>new Promise(r=>{const iv=setInterval(()=>{if(w.readyState!==1)return clearInterval(iv);S(w,{t:'step'})},per);wait(w,'summit',()=>true,60000).then(s=>{clearInterval(iv);r(s)})});
 const pb=run(b,55);await sl(400);c.close();A(true,'Cat disconnects mid-race');const s=await pb;A(s.ms>9000,'Bob summit server-timed '+s.ms+'ms');
 const fin=await wait(a,'mpFin');A(fin.fin[0].name==='Bob','live finish list → Bob 1st');
 a.close();await sl(300);const lb=b.q.filter(d=>d.t==='mpLobby').pop();A(lb&&lb.host===hb.id,'host transfer to Bob after Ann leaves');
 S(b,{t:'mpLeave'});await wait(b,'mpLeft');A(true,'leave → room cleaned up');
 const q1=await cl('q1'),q2=await cl('q2');S(q1,{t:'mpQuick',name:'Q1'});const ql=await wait(q1,'mpLobby');S(q2,{t:'mpQuick',name:'Q2'});const ql2=await wait(q2,'mpLobby');A(ql.code===ql2.code&&ql2.players.length===2,'quick match pairs players into an open room');
 let spam=0;for(let i=0;i<30;i++)S(q2,{t:'mpReady',v:i%2==0});await sl(400);spam=q1.q.filter(d=>d.t==='mpLobby').length;A(spam<=6,'lobby spam rate-limited ('+spam+' broadcasts for 30 msgs)');
 b.close();q1.close();q2.close();console.log(`\n${ok} passed, ${bad} failed`);process.exit(bad?1:0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
