import asyncio,json,sys
from playwright.async_api import async_playwright
U='http://localhost:8080/'
def bot(sd):return """window._stop=false;window._f='L';const g=()=>{let u=0,v=0;while(!u)u=Math.random();v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(6.283*v)};
(function loop(){if(window._stop)return;const n=RH.next(),now=performance.now();const P=()=>{RH.press(window._f);window._f=window._f==='L'?'R':'L'};
 if(!n){P();setTimeout(loop,300);return}if(n._o===undefined)n._o=g()*%d;const dt=n.t+n._o-now;if(dt<=3){n.j=n.j;P();n._d=1;setTimeout(loop,25)}else setTimeout(loop,Math.min(dt-2,40))})()"""%sd
async def run(b,sd):
    pg=await b.new_page(viewport={'width':844,'height':390});errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(U);await pg.wait_for_timeout(800);await pg.evaluate("MAP.start()");await pg.fill('#nick','Cal'+str(sd));await pg.click('#go');await pg.wait_for_timeout(1500)
    await pg.evaluate("FX.newRun('day')");await pg.evaluate(bot(sd))
    for _ in range(1200):
        await pg.wait_for_timeout(250)
        if await pg.evaluate("!document.getElementById('quiz').classList.contains('hide')"):break
    st=json.loads(await pg.evaluate("JSON.stringify(RH.state())"))
    ms=await pg.evaluate("1")
    # pick a quiz answer (correct)
    await pg.wait_for_timeout(400)
    await pg.evaluate("()=>{const a=document.querySelector('.qz p b').textContent;const L=[...document.querySelectorAll('.qc button')];(L.find(b=>b._d&&b._d.en.split(' (')[0]===a)||L[0]).click()}")
    for _ in range(60):
        await pg.wait_for_timeout(250)
        if await pg.evaluate("!!LAST"):break
    r=json.loads(await pg.evaluate("JSON.stringify({ms:LAST.ms,score:LAST.score,det:LAST.det})"));d=r['det']
    print(f"sd={sd} time={r['ms']/1000:.1f}s score={r['score']} P{d['nP']} G{d['nG']} M{d['nM']} best{d['best']} fev{d['fevers']} tb{d['tb']} sk{d['sk']} bon{d['bon']} err{errs}",flush=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        await asyncio.gather(*[run(b,int(s)) for s in sys.argv[1:]])
asyncio.run(main())
