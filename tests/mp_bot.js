// raw ws hiker for browser MP test: joins CODE, readies, steps at a human-ish pace once race starts
const WS=require('ws'),w=new WS('ws://localhost:8080');const code=process.argv[2],per=+process.argv[3]||220;
w.on('open',()=>w.send(JSON.stringify({t:'mpJoin',code,name:'BotMin'})));
w.on('message',m=>{const d=JSON.parse(m);if(d.t==='mpLobby'&&!d.players.find(p=>p.name==='BotMin').ready&&d.state==='lobby')w.send('{"t":"mpReady","v":true}');
 if(d.t==='mpCount')setTimeout(()=>{const iv=setInterval(()=>w.send('{"t":"step"}'),per);w.on('message',m=>{if(JSON.parse(m).t==='summit'){clearInterval(iv);setTimeout(()=>process.exit(0),20000)}})},d.at-d.now+30)});
