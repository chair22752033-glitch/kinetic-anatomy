const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [,, page, OUT]=process.argv;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};const errs=[];
 // fresh visitor
 const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const p=await ctx.newPage();p.on('pageerror',e=>errs.push(String(e)));
 await p.goto('file://'+page);await p.waitForTimeout(1500);
 ok(await p.evaluate(()=>!document.getElementById('onb-overlay').classList.contains('on')),'fresh visit: forced tour does NOT open');
 ok(await p.evaluate(()=>!!document.querySelector('.coach-tip')),'fresh visit: in-place coach tip shown');
 ok(await p.evaluate(()=>document.getElementById('hub-cont-en').textContent.includes('60')),'no last movement -> tour offered as an optional link (no fake "continue")');
 await p.screenshot({path:OUT+'/S3_fresh_mobile.png'});
 await p.evaluate(()=>{var t=document.querySelector('.coach-tip');var bt=t&&t.querySelector('button');if(bt)bt.click();else if(t)t.click();});await p.waitForTimeout(300);
 await p.reload();await p.waitForTimeout(1500);
 ok(await p.evaluate(()=>!document.querySelector('.coach-tip')&&!document.getElementById('onb-overlay').classList.contains('on')),'dismissed tip does not come back after reload; tour still not forced');
 // tour is still reachable and skippable, and skip persists
 await p.evaluate(()=>{document.getElementById('hub-continue').click();});await p.waitForTimeout(300);
 ok(await p.evaluate(()=>document.getElementById('onb-overlay').classList.contains('on')),'optional tour opens from the home link');
 await p.evaluate(()=>document.getElementById('onb-skip').click());await p.waitForTimeout(200);
 ok(await p.evaluate(()=>localStorage.getItem('kap_onboard_v1')==='1'),'skip stores kap_onboard_v1 (existing completion state kept)');
 await ctx.close();
 // returning visitor with valid / invalid last exercise
 for(const [val,expectResume] of [['step_up',true],['bogus_id',false]]){
  const c2=await b.newContext({viewport:{width:1440,height:900}});await c2.addInitScript(v=>{localStorage.setItem('kap_onboard_v1','1');localStorage.setItem('kap_coach_home','1');localStorage.setItem('kap_last_ex',v);},val);
  const q=await c2.newPage();q.on('pageerror',e=>errs.push(String(e)));await q.goto('file://'+page);await q.waitForTimeout(500);
  const t=await q.evaluate(()=>document.getElementById('hub-cont-en').textContent+'|'+document.getElementById('hub-continue').dataset.act);
  ok(expectResume?(t.toLowerCase().includes('step')&&t.endsWith('resume')):t.endsWith('onboard'),'last_ex='+val+' -> '+t);
  if(expectResume){await q.click('#hub-continue');await q.waitForTimeout(300);ok(await q.evaluate(()=>cEx==='step_up'&&KAP.view==='lab'),'continue opens the saved movement');}
  await c2.close();
 }
 console.log('errs',errs.length?errs:'none');console.log('FAILS',fail);await b.close();
})();
