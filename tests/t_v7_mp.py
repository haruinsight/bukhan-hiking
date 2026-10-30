import asyncio,json,subprocess,time,sys
sys.path.insert(0,'tests');from t_v7 import BOT,newpage,shot,ERR,finish
async def main():
  from playwright.async_api import async_playwright
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    A=await newpage(b,'mpA',{'width':390,'height':844});B=await newpage(b,'mpB',{'width':844,'height':390})
    await A.click('#mapMp');await A.wait_for_timeout(200);await A.fill('#mpNick','Ann');await shot(A,'mp_menu')
    await A.click('#mpCreate');await A.wait_for_timeout(500);code=await A.evaluate("MP.code");link=await A.evaluate("MP.link()");print('code',code)
    await B.goto('about:blank');await B.goto(link);await B.wait_for_timeout(600);await shot(B,'mp_join_link');await B.fill('#mpNick','Ben');await B.click('#mpJoin');await B.wait_for_timeout(500)
    bot=subprocess.Popen(['node','tests/mp_bot.js',code,'190']);await A.wait_for_timeout(800)
    await shot(A,'mp_lobby_host');await shot(B,'mp_lobby_guest');await B.click('#mpReady');await A.wait_for_timeout(500);await shot(A,'mp_lobby_all_ready')
    await A.click('#mpStart');await A.wait_for_timeout(1300);await shot(A,'mp_countdown');await shot(B,'mp_countdown_land')
    await A.wait_for_timeout(2900);await A.evaluate(BOT);await B.evaluate(BOT);await A.wait_for_timeout(300);await shot(A,'mp_go')
    await A.wait_for_timeout(20000);await shot(A,'mp_race_live');await shot(B,'mp_race_live_land')
    async def wq(pg):
      for _ in range(1600):
        await pg.wait_for_timeout(250)
        if await pg.evaluate("!document.getElementById('quiz').classList.contains('hide')"):return
    await asyncio.gather(wq(A),wq(B))
    ia,aa=await finish(A,'mp_A');print('A',ia)
    await B.evaluate("1");ib,ab=None,None
    await shot(B,'mp_B_quiz');ib,ab=await finish(B,'mp_B');print('B',ib)
    print('lobbyA',await A.evaluate("JSON.stringify(MP.fin.map(f=>[f.name,f.ms]))"))
    bot.wait(timeout=30)
    print('ERR',json.dumps({k:v[:3] for k,v in ERR.items()}))
    await b.close()
asyncio.run(main())
