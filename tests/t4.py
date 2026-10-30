import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=3);E=[]
    pg.on('pageerror',lambda e:E.append(e.stack))
    await pg.goto('http://localhost:8080/');await pg.click('[data-k=bukhan]');await pg.click('[data-m=walk]');await pg.click('#go');await pg.wait_for_timeout(1500)
    await pg.evaluate("ws.send(JSON.stringify({t:'set',h:1860}));RH._d(1862)");await pg.wait_for_timeout(500)
    for i in range(8):
      await pg.keyboard.press('KeyA' if i%2==0 else 'KeyD');await pg.wait_for_timeout(500)
    await pg.screenshot(path='shots/px_mobile_11_summit_walk.png')
    await pg.wait_for_timeout(3000);await pg.screenshot(path='shots/px_mobile_12_card.png');print(E)
    await b.close()
asyncio.run(main())
