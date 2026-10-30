import asyncio
from playwright.async_api import async_playwright
U='http://localhost:8080/'
async def run(p,name,vp,mob):
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    c=await b.new_context(viewport=vp,device_scale_factor=3 if mob else 1,is_mobile=mob,has_touch=mob)
    pg=await c.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(e.stack));pg.on('response',lambda r:r.status>=400 and errs.append(r.url))
    await pg.goto(U);await pg.click('[data-k=bukhan]');await pg.click('[data-m=walk]');await pg.click('#go');await pg.wait_for_timeout(800)
    await pg.wait_for_timeout(800);await pg.keyboard.press("ArrowLeft");await pg.wait_for_timeout(1500);await pg.evaluate("RH._d(1872)");await pg.wait_for_timeout(700);await pg.screenshot(path=f'shots/re_{name}_9_summit_area.png')
    print(name,errs);await b.close()
async def main():
    async with async_playwright() as p:
        await asyncio.gather(run(p,'mobile',{'width':390,'height':844},True),run(p,'land',{'width':844,'height':390},True))
asyncio.run(main())
