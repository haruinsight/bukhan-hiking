import asyncio,sys
from playwright.async_api import async_playwright
U='http://localhost:8080/'
async def run(p,name,vp,mob):
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    c=await b.new_context(viewport=vp,device_scale_factor=3 if mob else 1,is_mobile=mob,has_touch=mob)
    pg=await c.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(e.stack));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    await pg.goto(U);await pg.evaluate("localStorage.clear()");await pg.reload()
    await pg.click('[data-k=bukhan]');await pg.click('[data-m=walk]');await pg.fill('#nick','회장님');await pg.click('#go')
    await pg.wait_for_timeout(800)
    # 박자 맞춰 번갈아
    for i in range(14):
        await pg.keyboard.press('ArrowLeft' if i%2==0 else 'ArrowRight');await pg.wait_for_timeout(500 if i<6 else 470)
    await pg.wait_for_timeout(120);await pg.screenshot(path=f'shots/re_{name}_1_bothfeet.png')
    await pg.keyboard.press('ArrowRight');await pg.wait_for_timeout(400)
    await pg.keyboard.press('ArrowRight');await pg.wait_for_timeout(60)
    await pg.screenshot(path=f'shots/re_{name}_2_feedback.png')
    for i in range(4):
        await pg.keyboard.press('ArrowRight');await pg.wait_for_timeout(330)
    await pg.keyboard.press('ArrowRight');await pg.wait_for_timeout(130)
    await pg.screenshot(path=f'shots/re_{name}_3_onefoot_hop.png')
    st=await pg.evaluate("JSON.stringify(RH.state())")
    for d,tag in [(1000,'4_steps'),(1640,'5_wimun')]:
        await pg.evaluate(f"RH._d({d})");await pg.wait_for_timeout(500);await pg.screenshot(path=f'shots/re_{name}_{tag}.png')
    # 도전 모드
    await pg.click('#chg');await pg.click('[data-m=challenge]');await pg.click('#go');await pg.wait_for_timeout(3500)
    await pg.screenshot(path=f'shots/re_{name}_6_challenge.png')
    await pg.evaluate("ws.send(JSON.stringify({t:'set',h:1800}))");await pg.wait_for_timeout(1200)
    await pg.keyboard.press('Space');await pg.wait_for_timeout(250)
    await pg.screenshot(path=f'shots/re_{name}_7_challenge_jump.png')
    await pg.wait_for_timeout(9000);await pg.screenshot(path=f'shots/re_{name}_8_summit.png')
    print(name,'state',st,'errors',errs);await b.close()
async def main():
    async with async_playwright() as p:
        await asyncio.gather(run(p,'mobile',{'width':390,'height':844},True),run(p,'land',{'width':844,'height':390},True),run(p,'desk',{'width':1280,'height':800},False))
asyncio.run(main())
