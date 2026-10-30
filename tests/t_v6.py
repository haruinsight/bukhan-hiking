import asyncio
from playwright.async_api import async_playwright
U='http://localhost:8080/'
RH_LOOP="""window._stop=false;(function go(f){if(window._stop)return;RH.press(f);const l=RH.state().lvl;setTimeout(()=>go(f==='L'?'R':'L'),560-l*30)})('L')"""
async def run(p,name,vp,mob,mode,shots):
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    c=await b.new_context(viewport=vp,device_scale_factor=2 if mob else 1,is_mobile=mob,has_touch=mob)
    pg=await c.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    await pg.goto(U);await pg.evaluate("localStorage.clear()");await pg.reload();await pg.wait_for_timeout(600)
    if shots: await pg.screenshot(path=f'shots/v6_{name}_1_korea.png')
    await pg.click('#bkPin' if not mob else '#mapGo',force=True);await pg.wait_for_timeout(300)
    if shots: await pg.screenshot(path=f'shots/v6_{name}_2_mode.png')
    await pg.click(f'[data-m={mode}]');await pg.fill('#nick','회장님');await pg.click('#go');await pg.wait_for_timeout(1500)
    if mode=='walk': await pg.evaluate(RH_LOOP)
    else: await pg.evaluate("setInterval(()=>GAME.jump(),730)")
    import time;t=time.time();sn=False;yh=False
    await pg.wait_for_timeout(9000);await pg.screenshot(path=f'shots/v6_{name}_beat_{mode}.png')
    while time.time()-t<400:
        await pg.wait_for_timeout(1000)
        if shots and not sn:
            st=await pg.evaluate("RH.state().d")
            m=await pg.evaluate("(players.find(p=>p.id===me)||{}).h||0")
            if max(st,m)>1840: await pg.wait_for_timeout(1200 if mode=='walk' else 3000);await pg.screenshot(path=f'shots/v6_{name}_3_summit_{mode}.png');sn=True
        if not yh and await pg.evaluate("!document.getElementById('yahoo').classList.contains('hide')"):
            await pg.wait_for_timeout(1600);await pg.screenshot(path=f'shots/v6_{name}_yahoo_{mode}.png');yh=True
        if await pg.evaluate("!document.getElementById('card').classList.contains('hide')"): break
    el=time.time()-t
    await pg.evaluate("window._stop=true");await pg.wait_for_timeout(800)
    info=await pg.evaluate("JSON.stringify({LAST:LAST&&{mode:LAST.mode,ms:LAST.ms,score:LAST.score}})")
    if shots: await pg.screenshot(path=f'shots/v6_{name}_4_card_{mode}.png')
    await pg.click('#toReward');await pg.wait_for_timeout(500)
    if shots: await pg.screenshot(path=f'shots/v6_{name}_5_reward.png',full_page=True)
    btn=pg.locator('.dc:not([disabled])').last;await btn.click();await pg.wait_for_timeout(200)
    if shots: await pg.screenshot(path=f'shots/v6_{name}_6_reward_pick.png')
    await pg.click('#rwOk');await pg.wait_for_timeout(500)
    if shots: await pg.screenshot(path=f'shots/v6_{name}_table_placed.png')
    await pg.wait_for_timeout(4500);auto=await pg.evaluate("!document.getElementById('map').classList.contains('hide')");print('autoMap',auto)
    if shots: await pg.screenshot(path=f'shots/v6_{name}_back_on_map.png')
    await pg.evaluate("MAP.table(null)")
    # 테이블 꽉 채운 모습 미리보기용으로 추가 수집(저장값만 세팅)
    if shots: await pg.screenshot(path=f'shots/v6_{name}_7_table.png')
    await pg.evaluate("localStorage.bapsang=JSON.stringify(Object.fromEntries(MAP.DISH.map((d,i)=>[d.id,i%5==0?2:1])));MAP.table(MAP.DISH[8])");await pg.wait_for_timeout(300)
    if shots: await pg.screenshot(path=f'shots/v6_{name}_8_table_full.png')
    await pg.click('#tblBack');await pg.wait_for_timeout(300)
    vis=await pg.evaluate("!document.getElementById('map').classList.contains('hide')")
    if shots: await pg.screenshot(path=f'shots/v6_{name}_9_back_map.png')
    print(name,mode,'yahoo',yh,'elapsed',round(el),info,'backToMap',vis,'errors',errs);await b.close()
async def main():
    async with async_playwright() as p:
        await asyncio.gather(run(p,'port',{'width':390,'height':844},True,'walk',True),run(p,'land',{'width':844,'height':390},True,'walk',True),run(p,'portch',{'width':390,'height':844},True,'challenge',True))
asyncio.run(main())
