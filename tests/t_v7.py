import asyncio,time,json,sys
from playwright.async_api import async_playwright
U='http://localhost:8080/'
BOT="""window._stop=false;window._f='L';(function loop(){if(window._stop)return;const n=RH.next(),now=performance.now();const P=()=>{RH.press(window._f);window._f=window._f==='L'?'R':'L'};
 if(!n){P();setTimeout(loop,300);return}const dt=n.t-now;if(dt<=3){P();setTimeout(loop,25)}else setTimeout(loop,Math.min(dt-2,40))})()"""
ERR={}
async def newpage(b,name,vp,store=None):
    c=await b.new_context(viewport=vp,device_scale_factor=2,is_mobile=True,has_touch=True)
    pg=await c.new_page();ERR[name]=[]
    pg.on('pageerror',lambda e:ERR[name].append(str(e)));pg.on('console',lambda m:m.type=='error' and '404' not in m.text and ERR[name].append(m.text))
    await pg.goto(U);await pg.evaluate("localStorage.clear()");await pg.reload();await pg.wait_for_timeout(600);return pg
async def shot(pg,n,full=False): await pg.screenshot(path=f'shots/v7_{n}.png',full_page=full)
async def climb(pg,name,tag,feats=True):
    t=time.time();seen=set()
    while time.time()-t<420:
        await pg.wait_for_timeout(250)
        st=await pg.evaluate("JSON.stringify({ev:RH.ev()&&RH.ev().k,fv:RH.fever(),d:RH.state().d,q:!document.getElementById('quiz').classList.contains('hide')})");st=json.loads(st)
        if feats:
            for k,c in [('sq',st['ev']=='sq'),('gp',st['ev']=='gp'),('sp',st['ev']=='sp'),('fever',st['fv'])]:
                if c and k not in seen: seen.add(k);await pg.wait_for_timeout(700 if k!='sq' else 900);await shot(pg,f'{tag}_{k}')
            d=st['d']
            for k,a in [('sec_forest',150),('sec_stairs',1000),('sec_granite',1500)]:
                if d>a and k not in seen: seen.add(k);await shot(pg,f'{tag}_{k}')
        if st['q']: break
    return time.time()-t
async def finish(pg,tag,right=True):
    await pg.wait_for_timeout(500);await shot(pg,f'{tag}_quiz')
    ans=await pg.evaluate("document.querySelector('.qz p b').textContent")
    idx=await pg.evaluate("""a=>{const bs=[...document.querySelectorAll('.qc button')];return 0}""",ans)
    # find correct button via DISH thumbs order: use data from FX — compare by drawing? choose via title mapping
    await pg.evaluate("""a=>{window._ans=a}""",ans)
    i=await pg.evaluate("""()=>{const L=[...document.querySelectorAll('.qc button')];return L.findIndex(b=>b._d&&b._d.en.split(' (')[0]===window._ans)}""")
    btns=pg.locator('.qc button');await btns.nth(max(0,i) if right else (1 if i==0 else 0)).click();await pg.wait_for_timeout(500);await shot(pg,f'{tag}_quiz_result')
    for _ in range(40):
        await pg.wait_for_timeout(250)
        if await pg.evaluate("!document.getElementById('yahoo').classList.contains('hide')"):break
    await pg.wait_for_timeout(1500);await shot(pg,f'{tag}_yahoo')
    for _ in range(40):
        await pg.wait_for_timeout(250)
        if await pg.evaluate("!document.getElementById('card').classList.contains('hide')"):break
    await pg.evaluate("window._stop=true");await pg.wait_for_timeout(600);await shot(pg,f'{tag}_card',True)
    info=await pg.evaluate("JSON.stringify({ms:LAST.ms,score:LAST.score,quiz:LAST.det.quiz,fev:LAST.det.fevers,bon:LAST.det.bon,mis:LAST.mis.map(m=>m.id),pb:LAST.pb})")
    await pg.click('#toReward');await pg.wait_for_timeout(500);await shot(pg,f'{tag}_reward')
    await pg.locator('.dc:not([disabled])').last.click();await pg.wait_for_timeout(200);await pg.click('#rwOk');await pg.wait_for_timeout(600);await shot(pg,f'{tag}_table',True)
    await pg.wait_for_timeout(4600);auto=await pg.evaluate("!document.getElementById('map').classList.contains('hide')");return info,auto
async def solo(b,name,vp,weather):
    pg=await newpage(b,name,vp);await shot(pg,f'{name}_map')
    await pg.click('#mapGo',force=True);await pg.wait_for_timeout(300);await shot(pg,f'{name}_pick_missions')
    await pg.fill('#nick','Jamie');await pg.click('#go');await pg.wait_for_timeout(1500)
    await pg.evaluate(f"FX.newRun('{weather}')");await pg.wait_for_timeout(900);await shot(pg,f'{name}_weather_{weather}')
    await pg.evaluate(BOT);await pg.wait_for_timeout(5000);await shot(pg,f'{name}_beat')
    el=await climb(pg,name,name);info,auto=await finish(pg,name)
    await shot(pg,f'{name}_welcome_back');print(name,'climb',int(el),'s',info,'autoMap',auto,'errors',ERR[name]);return pg
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
        pp,pl=await asyncio.gather(solo(b,'port',{'width':390,'height':844},'rain'),solo(b,'land',{'width':844,'height':390},'sunset'))
        # weather gallery + ghost race on second climb
        pg=pp;await pg.click('#mapGo',force=True);await pg.wait_for_timeout(300);await pg.click('#go');await pg.wait_for_timeout(1200)
        for k in ['sunrise','day','snow']:
            await pg.evaluate(f"FX.newRun('{k}')");await pg.wait_for_timeout(700);await shot(pg,f'weather_{k}')
        await pg.evaluate(BOT);await pg.wait_for_timeout(14000);await shot(pg,'ghost_race')
        g=await pg.evaluate("JSON.stringify(FX.ghosts(performance.now()).map(g=>[g.name,Math.round(g.d)]))");print('ghosts',g,'me',await pg.evaluate("Math.round(RH.state().d)"))
        await pg.evaluate("window._stop=true");
        # table with all dishes + sets + share PNG
        await pg.evaluate("localStorage.bapsang=JSON.stringify(Object.fromEntries(DISH.map((d,i)=>[d.id,1])));document.getElementById('chg').click()");await pg.wait_for_timeout(400)
        await pg.click('#mapTable');await pg.wait_for_timeout(500);await shot(pg,'sets_table',True)
        await pg.evaluate("document.getElementById('tbl').scrollTo(0,1e6)");await pg.wait_for_timeout(200);await shot(pg,'sets_list')
        await pg.evaluate("MAP.shareTable()");await pg.wait_for_timeout(800)
        du=await pg.evaluate("MAP._shareCv.toDataURL('image/png')");import base64;open('shots/v7_sets_share.png','wb').write(base64.b64decode(du.split(',')[1]))
        # save code
        await pg.click('#tblBack');await pg.wait_for_timeout(300);await shot(pg,'save_map_welcome')
        await pg.click('#mapSave');await pg.wait_for_timeout(300);await shot(pg,'save_code')
        code=await pg.evaluate("document.getElementById('svCode').value");print('code len',len(code),code[:40])
        link=await pg.evaluate("SAVE.link()")
        pg2=await newpage(b,'restore',{'width':390,'height':844});await shot(pg2,'save_fresh_device')
        await pg2.click('#mapLoad');await pg2.fill('#svIn','HIKE-garbage.123');await pg2.click('#svGo');await pg2.wait_for_timeout(200);await shot(pg2,'save_bad_code')
        await pg2.fill('#svIn',code[:-1]+('A' if code[-1]!='A' else 'B'));await pg2.click('#svGo');await pg2.wait_for_timeout(200);await shot(pg2,'save_bad_checksum')
        await pg2.fill('#svIn',code);await pg2.click('#svGo');await pg2.wait_for_timeout(300);await shot(pg2,'save_restored');await pg2.wait_for_timeout(1500);await shot(pg2,'save_welcome_after_restore')
        n=await pg2.evaluate("Object.keys(JSON.parse(localStorage.bapsang)).length+'/'+!!localStorage.ghostPB+'/'+localStorage.nick");print('restored',n)
        pg3=await newpage(b,'link',{'width':844,'height':390});await pg3.goto(link);await pg3.wait_for_timeout(700);await shot(pg3,'save_link_open')
        print('ERR',json.dumps(ERR))
        await b.close()
if __name__=='__main__': asyncio.run(main())
