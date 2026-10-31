import asyncio
from playwright.async_api import async_playwright
U='http://localhost:8080/'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        errs=[]
        for tag,vp in [('port',{'width':390,'height':844}),('land',{'width':844,'height':390})]:
            pg=await b.new_page(viewport=vp);pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto(U);await pg.wait_for_timeout(1500);await pg.screenshot(path=f'shots/v8_{tag}_map_weather.png')
            await pg.locator('.pinSoon').first.dispatch_event('click');await pg.wait_for_timeout(300);await pg.screenshot(path=f'shots/v8_{tag}_coming_soon.png')
            await pg.locator('#bkPin').dispatch_event('click');await pg.wait_for_timeout(300);await pg.screenshot(path=f'shots/v8_{tag}_mountain_card.png')
            await pg.click('#mtStart');await pg.wait_for_timeout(300);await pg.screenshot(path=f'shots/v8_{tag}_pick.png')
            await pg.fill('#nick','Sam');await pg.click('#go');await pg.wait_for_timeout(1200);await pg.evaluate("FX.newRun('day')")
            await pg.evaluate("""window._f='L';let k=0;(function loop(){const n=RH.next(),now=performance.now();if(!n){RH.press(window._f);window._f=window._f==='L'?'R':'L';setTimeout(loop,300);return}const o=[0,0,0,90,-110,0,0,60][k%8];const dt=n.t+o-now;if(dt<=3){RH.press(window._f);window._f=window._f==='L'?'R':'L';k++;setTimeout(loop,25)}else setTimeout(loop,Math.min(dt-2,40))})()""")
            for i in range(4):
                await pg.wait_for_timeout(1700);await pg.screenshot(path=f'shots/v8_{tag}_speed_feedback_{i}.png')
            await pg.close()
        
        print('errors',errs)
asyncio.run(main())
