const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [,, page, OUT]=process.argv;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};const errs=[];
 const init=()=>{localStorage.setItem('kap_onboard_v1','1');['lab','atlas','quest','home'].forEach(k=>localStorage.setItem('kap_coach_'+k,'1'));};
 /* ---------- desktop ---------- */
 {console.log('--- desktop');
  const ctx=await b.newContext({viewport:{width:1440,height:900}});await ctx.addInitScript(init);
  const p=await ctx.newPage();p.on('pageerror',e=>errs.push(String(e)));p.on('console',x=>{if(x.type()==='error'&&!/ERR_(CONN|INTERNET|NAME)/.test(x.text()))errs.push(x.text())});
  await p.goto('file://'+page);await p.waitForTimeout(300);await p.evaluate(()=>{setLang('zh');goMain('squat');});await p.waitForTimeout(500);
  const vis=sel=>p.evaluate(s=>{const e=document.querySelector(s);return !!e&&getComputedStyle(e).display!=='none'&&e.offsetParent!==null},sel);
  ok(await p.evaluate(()=>document.body.classList.contains('kap-simple')),'default reading depth = plain');
  ok(await vis('#ka-plain')&&!(await vis('#mbars'))&&!(await vis('.sec-arom'))&&!(await vis('.sec-fascia'))&&!(await vis('.sec-recovery')),'plain: plain section shown; percentages, AROM, fascia, recovery hidden');
  ok(await p.evaluate(()=>!/%/.test(document.getElementById('ka-plain').textContent)),'plain layer contains no percentage numbers');
  ok(await p.evaluate(()=>document.querySelectorAll('#ka-plain .ka-mrow').length===EX[cEx].muscles.length),'plain list has every muscle of the movement ('+await p.evaluate(()=>EX[cEx].muscles.length)+')');
  ok(await p.evaluate(()=>{const t=[...document.querySelectorAll('.rp-tab')].filter(e=>getComputedStyle(e).display!=='none').map(e=>e.dataset.rpt);return t.join()==='analysis'}),'plain: only the analysis tab (muscle-map tab was already hidden in the baseline) ('+await p.evaluate(()=>[...document.querySelectorAll('.rp-tab')].filter(e=>getComputedStyle(e).display!=='none').map(e=>e.dataset.rpt).join())+')');
  // detailed layer
  await p.click('[data-depth="pro"]');await p.waitForTimeout(300);
  ok(await p.evaluate(()=>!document.body.classList.contains('kap-simple')&&localStorage.getItem('kap_pro')==='1'),'detailed: body class + legacy kap_pro saved');
  ok(await vis('#mbars')&&await vis('.sec-arom')&&await vis('.sec-recovery')&&!(await vis('#ka-plain')),'detailed: original sections visible, plain section hidden');
  ok(await p.evaluate(()=>/未經個人量測/.test(document.querySelector('.ka-hint-pct').textContent)&&/不等於個人應達/.test(document.querySelector('.ka-hint-arom').textContent)),'detailed: percentage + AROM notes present ("not a personal measurement")');
  ok(await p.evaluate(()=>[...document.querySelectorAll('#mbars .mpct')].map(e=>e.textContent).join()===EX[cEx].muscles.map(m=>m.pct+'%').join()),'detailed: original percentages unchanged and in original order');
  ok(await p.evaluate(()=>{const t=[...document.querySelectorAll('.rp-tab')].filter(e=>getComputedStyle(e).display!=='none').map(e=>e.dataset.rpt);return t.includes('stretch')&&t.includes('recovery')&&!t.includes('wiki')&&!t.includes('progress')}),'detailed: stretch + recovery tabs back; duplicate wiki/progress tabs gone');
  ok(await p.evaluate(()=>document.querySelector('[data-depth="pro"]').getAttribute('aria-pressed')==='true'),'depth buttons expose aria-pressed');
  await p.keyboard.press('Escape');
  // keyboard shortcut P still toggles (legacy)
  await p.evaluate(()=>document.body.focus());await p.keyboard.press('p');await p.waitForTimeout(200);
  ok(await p.evaluate(()=>document.body.classList.contains('kap-simple')&&document.querySelector('[data-depth="plain"]').getAttribute('aria-pressed')==='true'),'legacy P shortcut flips depth and the buttons follow');
  // muscle detail from the plain list
  await p.evaluate(()=>document.querySelector('#ka-plain [data-ka-mu="quadriceps"]').focus());
  await p.click('#ka-plain [data-ka-mu="quadriceps"]');await p.waitForTimeout(400);
  ok(await p.evaluate(()=>document.getElementById('muscle-overlay').classList.contains('on')),'tapping a muscle opens its detail');
  ok(await p.evaluate(()=>{const c=document.getElementById('muscle-overlay-content');const kids=[...c.querySelector('.mio-panel.on').children].map(e=>e.className);return kids.indexOf('ka-life-box')>=0&&kids.indexOf('ka-life-box')<kids.findIndex(k=>/mio-row/.test(k))}),'detail: everyday-life box comes before the anatomy rows');
  ok(await p.evaluate(()=>{const lb=document.querySelector('.ka-life-box p').textContent;const d=WIKI_MUSCLES_DB.quadriceps.daily.split(/[，,、]/).map(s=>s.trim()).filter(Boolean).join('、');return lb===d}),'detail: life text = original WIKI daily text (reworded only by joining)');
  ok(await p.evaluate(()=>{const rows=[...document.querySelectorAll('.mio-panel.on .mio-lb')].map(e=>e.textContent);return rows[0]==='主要功能'&&rows[1]==='起點'}),'detail: action first, then origin / insertion / nerve');
  ok(await p.evaluate(()=>document.activeElement&&document.getElementById('muscle-overlay-content').contains(document.activeElement)),'focus moved into the detail dialog');
  ok(await p.evaluate(()=>document.getElementById('muscle-overlay-content').getAttribute('role')==='dialog'&&document.getElementById('muscle-overlay-content').getAttribute('aria-modal')==='true'),'detail has role=dialog aria-modal');
  // Tab stays inside
  let outside=false;for(let i=0;i<14;i++){await p.keyboard.press('Tab');if(!await p.evaluate(()=>document.getElementById('muscle-overlay-content').contains(document.activeElement)))outside=true;}
  ok(!outside,'14 Tab presses never leave the dialog');
  await p.keyboard.press('Escape');await p.waitForTimeout(300);
  ok(await p.evaluate(()=>!document.getElementById('muscle-overlay').classList.contains('on')&&!document.body.classList.contains('ka-lock')),'Esc closes the detail and unlocks the page');
  ok(await p.evaluate(()=>document.activeElement&&document.activeElement.dataset&&document.activeElement.dataset.kaMu==='quadriceps'),'focus returns to the muscle row that opened it');
  // massage: contraindications before techniques
  const massageSlug=await p.evaluate(()=>Object.keys(MASSAGE_DB)[0]);
  await p.evaluate(s=>showMIDetail(s),massageSlug);await p.waitForTimeout(300);
  ok(await p.evaluate(()=>{const pn=document.querySelector('.mio-panel[data-mp="massage"]');if(!pn)return false;const t=pn.textContent;const iC=t.search(/注意事項與禁忌/),iT=t.search(/按摩技法/);return iC>=0&&iT>=0&&iC<iT}),'massage panel: contraindications ('+massageSlug+') shown before techniques');
  await p.keyboard.press('Escape');await p.waitForTimeout(200);
  // english: source-text label
  await p.evaluate(()=>{setLang('en');showMIDetail('quadriceps');});await p.waitForTimeout(300);
  ok(await p.evaluate(()=>/Source text \(Chinese\)/.test(document.querySelector('.ka-life-box').textContent)),'English mode: Chinese-only daily text is labelled as source text');
  await p.keyboard.press('Escape');await p.waitForTimeout(200);await p.evaluate(()=>setLang('zh'));
  // favourites
  const before=await p.evaluate(()=>{localStorage.setItem('kap_xp','123');return localStorage.getItem('kap_xp')});
  await p.click('#ka-plain [data-ka-fav]');await p.waitForTimeout(200);
  ok(await p.evaluate(()=>JSON.parse(localStorage.getItem('kap_ui_v2')).favorites.exercises.includes('squat')&&document.getElementById('toast').textContent.includes('已留下')),'favourite saved to kap_ui_v2 with the spec message');
  await p.click('#ka-plain [data-ka-fav]');await p.waitForTimeout(200);
  ok(await p.evaluate(()=>document.getElementById('toast').textContent.includes('已經在')&&JSON.parse(localStorage.getItem('kap_ui_v2')).favorites.exercises.filter(x=>x==='squat').length===1),'second press: "already in" message, no duplicate');
  ok(await p.evaluate(b=>localStorage.getItem('kap_xp')===b&&localStorage.getItem('kap_onboard_v1')==='1',before),'legacy keys (kap_xp, kap_onboard_v1) untouched');
  await p.evaluate(()=>{localStorage.removeItem('kap_ui_v2');const orig=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new Error('blocked')};window.__orig=orig;});
  await p.click('#ka-plain [data-ka-fav]');await p.waitForTimeout(200);
  ok(await p.evaluate(()=>document.getElementById('toast').textContent.includes('暫時無法保存')),'storage blocked: message shown, reading continues, no exception');
  await p.evaluate(()=>{Storage.prototype.setItem=window.__orig;});
  // another movement: no stale text
  await p.evaluate(()=>showMIDetail('quadriceps'));await p.waitForTimeout(200);await p.evaluate(()=>loadEx('pullup'));await p.waitForTimeout(300);
  ok(await p.evaluate(()=>!document.getElementById('muscle-overlay').classList.contains('on')&&/引體向上/.test(document.getElementById('ka-plain').textContent)),'changing movement closes any open detail and rebuilds the plain text');
  await p.screenshot({path:OUT+'/F5_desktop_plain.png'});
  await p.click('[data-depth="pro"]');await p.waitForTimeout(300);await p.screenshot({path:OUT+'/F5_desktop_pro.png'});
  await ctx.close();}
 /* ---------- phone ---------- */
 for(const [w,h] of [[390,844],[320,640]]){console.log('--- phone '+w+'x'+h);
  const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:true,hasTouch:true});await ctx.addInitScript(init);
  const p=await ctx.newPage();p.on('pageerror',e=>errs.push(String(e)));p.on('console',x=>{if(x.type()==='error'&&!/ERR_(CONN|INTERNET|NAME)/.test(x.text()))errs.push(x.text())});
  await p.goto('file://'+page);await p.waitForTimeout(300);await p.evaluate(()=>{setLang('zh');goMain('squat');});await p.waitForTimeout(500);
  const g=await p.evaluate(()=>{const r=document.querySelector('.ka-g-open').getBoundingClientRect();return{top:Math.round(r.top),bottom:Math.round(r.bottom),vh:innerHeight,fab:getComputedStyle(document.getElementById('mt2')).display}});
  ok(g.bottom<=g.vh-60&&g.fab==='none','glance button visible on first screen ('+JSON.stringify(g)+'), floating ☰ gone');
  ok(await p.evaluate(()=>document.querySelector('.ka-g-key').textContent.includes('主力')),'glance key sentence names the prime movers');
  await p.evaluate(()=>document.querySelector('.ka-g-open').focus());await p.click('.ka-g-open');await p.waitForTimeout(500);
  ok(await p.evaluate(()=>document.getElementById('rp').classList.contains('on')&&document.body.classList.contains('ka-lock')&&document.getElementById('ka-sheet-bg').classList.contains('on')),'sheet open: backdrop on, page locked');
  ok(await p.evaluate(()=>document.getElementById('rp').contains(document.activeElement)),'focus is inside the sheet');
  const sc=await p.evaluate(()=>{const ps=document.getElementById('ps-analysis');const r=document.getElementById('rp').getBoundingClientRect();return{top:Math.round(r.top),h:Math.round(r.height),vh:innerHeight,scrollable:ps.scrollHeight>=ps.clientHeight}});
  ok(sc.top>=0&&sc.h<=sc.vh-24+1,'sheet fits the screen (top '+sc.top+', height '+sc.h+' of '+sc.vh+')');
  await p.evaluate(()=>{const ps=document.getElementById('ps-analysis');ps.scrollTop=ps.scrollHeight;});await p.waitForTimeout(200);
  ok(await p.evaluate(()=>{const b=document.querySelector('#ka-plain [data-ka-fav]').getBoundingClientRect(),r=document.getElementById('rp').getBoundingClientRect();return b.bottom<=r.bottom+1&&b.top>=r.top}),'scrolled to the end, the last button is reachable inside the sheet');
  await p.evaluate(()=>{document.getElementById('ps-analysis').scrollTop=0;});
  let leak=false;for(let i=0;i<20;i++){await p.keyboard.press('Tab');if(!await p.evaluate(()=>document.getElementById('rp').contains(document.activeElement)))leak=true;}
  ok(!leak,'20 Tab presses never leave the sheet');
  if(w===390)await p.screenshot({path:OUT+'/F5_phone_sheet.png'});
  // open a muscle from inside the sheet: one top-level panel at a time
  await p.evaluate(()=>document.querySelector('#ka-plain [data-ka-mu="quadriceps"]').focus());await p.click('#ka-plain [data-ka-mu="quadriceps"]');await p.waitForTimeout(500);
  ok(await p.evaluate(()=>{const rp=document.getElementById('rp');return getComputedStyle(rp).visibility==='hidden'&&document.getElementById('muscle-overlay').classList.contains('on')}),'muscle detail replaces the sheet (only one panel visible)');
  if(w===390)await p.screenshot({path:OUT+'/F5_phone_muscle.png'});
  await p.keyboard.press('Escape');await p.waitForTimeout(400);
  ok(await p.evaluate(()=>getComputedStyle(document.getElementById('rp')).visibility!=='hidden'&&document.getElementById('rp').classList.contains('on')),'closing the detail returns to the explanation sheet');
  ok(await p.evaluate(()=>document.activeElement&&document.activeElement.dataset&&document.activeElement.dataset.kaMu==='quadriceps'),'focus is back on the muscle row');
  await p.keyboard.press('Escape');await p.waitForTimeout(400);
  ok(await p.evaluate(()=>!document.getElementById('rp').classList.contains('on')&&!document.body.classList.contains('ka-lock')&&!document.getElementById('ka-sheet-bg').classList.contains('on')),'Esc closes the sheet, page unlocked, backdrop off');
  ok(await p.evaluate(()=>document.activeElement&&document.activeElement.classList.contains('ka-g-open')),'focus returns to the entry button');
  ok(await p.evaluate(()=>!document.body.classList.contains('ka-lock')&&!document.getElementById('ka-sheet-bg').classList.contains('on')&&!document.body.classList.contains('ka-detail-open')),'no lock/backdrop/detail class left behind');
  // backdrop tap closes
  await p.click('.ka-g-open');await p.waitForTimeout(400);await p.evaluate(()=>document.getElementById('ka-sheet-bg').click());await p.waitForTimeout(300);
  ok(await p.evaluate(()=>!document.getElementById('rp').classList.contains('on')),'tapping the backdrop closes the sheet');
  // close button
  await p.click('.ka-g-open');await p.waitForTimeout(400);await p.click('#ka-sheet-close');await p.waitForTimeout(300);
  ok(await p.evaluate(()=>!document.getElementById('rp').classList.contains('on')),'close button closes the sheet');
  ok(await p.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),'no horizontal overflow');
  await ctx.close();}
 console.log('errs',errs.length?errs:'none');console.log('FAILS',fail);await b.close();
})();
