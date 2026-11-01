const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [,, page, OUT]=process.argv;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const errs=[]; let fail=0; const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};
 for(const [t,vp,m] of [['desktop',{width:1440,height:900},false],['mobile',{width:390,height:844},true]]){
  console.log('--- '+t);
  const ctx=await b.newContext({viewport:vp,isMobile:m,hasTouch:m});
  await ctx.addInitScript(()=>{try{localStorage.setItem('kap_onboard_v1','1');['lab','atlas','quest'].forEach(k=>localStorage.setItem('kap_coach_'+k,'1'));}catch(e){}});
  const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(t+' '+e)); p.on('console',x=>{if(x.type()==='error'&&!/ERR_(CONN|INTERNET|NAME)/.test(x.text()))errs.push(t+' '+x.text())});
  await p.goto('file://'+page); await p.waitForTimeout(400);
  // 1. life cards -> original IDs
  for(const k of ['squat','overhead_press','step_up']){
    await p.evaluate(()=>goHome()); await p.waitForTimeout(150);
    await p.click(`.ka-life [data-life="${k}"]`); await p.waitForTimeout(350);
    ok(await p.evaluate(k=>cEx===k&&KAP.view==='lab',k), 'life card -> '+k);
  }
  await p.evaluate(()=>goHome()); await p.waitForTimeout(150);
  await p.click('.ka-cta [data-life="squat"]'); await p.waitForTimeout(300); ok(await p.evaluate(()=>cEx==='squat'&&KAP.view==='lab'),'primary CTA -> squat');
  // 2. library via home link
  await p.evaluate(()=>goHome()); await p.waitForTimeout(150);
  await p.click('#ka-open-lib'); await p.waitForTimeout(350);
  const cnt=()=>p.evaluate(()=>document.querySelectorAll('#lib-grid .lib-card').length);
  ok(await cnt()===40,'library shows all 40 ('+await cnt()+')');
  await p.fill('#lib-search','squat'); await p.waitForTimeout(150);
  const sq=await p.evaluate(()=>[...document.querySelectorAll('#lib-grid .lib-card')].map(c=>c.dataset.libex));
  ok(sq.includes('squat')&&sq.length>=2&&sq.length<40,'search "squat" -> '+sq.join(','));
  await p.fill('#lib-search','階梯'); await p.waitForTimeout(150);
  const st=await p.evaluate(()=>[...document.querySelectorAll('#lib-grid .lib-card')].map(c=>c.dataset.libex));
  ok(st.includes('step_up')&&st.includes('stair_climbing'),'search "階梯" -> '+st.join(','));
  await p.fill('#lib-search','舉高'); await p.waitForTimeout(150);
  ok((await p.evaluate(()=>[...document.querySelectorAll('#lib-grid .lib-card')].map(c=>c.dataset.libex))).includes('overhead_press'),'alias 舉高 -> overhead_press');
  await p.fill('#lib-search','股四頭肌'); await p.waitForTimeout(150);
  ok((await cnt())>3,'muscle name search 股四頭肌 -> '+await cnt());
  await p.fill('#lib-search','zzzz'); await p.waitForTimeout(150);
  ok(await cnt()===0 && await p.evaluate(()=>!!document.getElementById('lib-clear-all')&&document.querySelector('.lib-empty').textContent.includes('Nothing matched')),'no results -> empty state + clear button');
  await p.screenshot({path:OUT+`/S3_${t}_lib_empty.png`});
  await p.click('#lib-clear-all'); await p.waitForTimeout(200);
  ok(await cnt()===40 && await p.evaluate(()=>document.getElementById('lib-search').value===''),'clear -> back to 40 and input emptied');
  // 3. every EX id findable by its own name
  const miss=await p.evaluate(()=>{const bad=[];Object.keys(EX).forEach(k=>{KAP.libQuery=EX[k].ten.replace(/ ANALYSIS$/i,'');if(libFilteredKeys().indexOf(k)<0)bad.push(k+'(en)');KAP.libQuery=EX[k].tzh.replace(/分析$/,'');if(libFilteredKeys().indexOf(k)<0)bad.push(k+'(zh)');});KAP.libQuery='';return bad;});
  ok(miss.length===0,'all 40 ids findable by EN and ZH name'+(miss.length?' missing: '+miss.join(','):''));
  // 4. category x equipment actually filter
  const combo=await p.evaluate(()=>{const bad=[];['all','aerobic','anaerobic','flexibility'].forEach(c=>Object.keys(EQUIP_EN).concat(['all']).forEach(e=>{KAP.libCat=c;KAP.libEquip=e;KAP.libRegion='all';KAP.libQuery='';const exp=Object.keys(EX).filter(k=>(c==='all'||EX[k].cat===c)&&(e==='all'||EX[k].equip===e)).length;if(libFilteredKeys().length!==exp)bad.push(c+'/'+e);}));KAP.libCat='all';KAP.libEquip='all';return bad;});
  ok(combo.length===0,'category x equipment combos consistent'+(combo.length?': '+combo.join(','):''));
  // 5. filtered navigation stays inside results
  await p.fill('#lib-search','squat'); await p.waitForTimeout(150);
  const first=await p.evaluate(()=>document.querySelector('#lib-grid .lib-card').dataset.libex);
  await p.click('#lib-grid .lib-card'); await p.waitForTimeout(400);
  const nav=await p.evaluate(()=>{const ks=navKeys();const seen=[cEx];for(let n=0;n<10;n++){const nb=document.getElementById('ext-next');if(nb.style.visibility==='hidden')break;nb.click();if(seen[seen.length-1]===cEx)break;seen.push(cEx);}return{ks:ks,seen:seen,lastHidden:document.getElementById('ext-next').style.visibility,count:document.getElementById('ext-count').textContent};});
  ok(nav.seen.every(k=>nav.ks.includes(k))&&nav.ks.length<40,'next stays inside results '+nav.seen.join('>')+' | '+nav.count);
  ok(nav.lastHidden==='hidden','next arrow hidden at end of results ['+nav.lastHidden+']');
  ok(/\/\s*\d+/.test(nav.count)&&!/\b0\s*\/\s*0\b/.test(nav.count)&&!/undefined|NaN/.test(nav.count),'count text sane: '+nav.count);
  // 6. find button + arrow keys in input must not switch movement
  await p.evaluate(()=>{KAP.libQuery='';});
  await p.click('#ext-find'); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.getElementById('lib-sheet').classList.contains('on')),'ext-find opens library from the exercise page');
  const before=await p.evaluate(()=>cEx);
  await p.focus('#lib-search'); await p.keyboard.type('ab'); await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowLeft'); await p.keyboard.type('?');
  ok(await p.evaluate(b=>cEx===b,before)&&await p.evaluate(()=>!document.getElementById('help-overlay')||!document.getElementById('help-overlay').classList.contains('on')),'arrow keys / ? inside search do not navigate or open help');
  await p.keyboard.press('Escape'); await p.keyboard.press('Escape'); await p.waitForTimeout(250);
  ok(await p.evaluate(()=>!document.getElementById('lib-sheet').classList.contains('on')),'Escape closes library');
  ok(await p.evaluate(()=>document.activeElement&&document.activeElement.id==='ext-find'),'focus returns to the find button');
  // current exercise filtered out -> note, no 0/0
  await p.evaluate(()=>{KAP.libQuery='yoga';});
  const hint=await p.evaluate(()=>{updateExTitle(cEx);return{nk:navKeys().length,txt:document.getElementById('ext-count').textContent};});
  ok(hint.nk===40,'current movement outside results -> full-list fallback ('+hint.txt+')');
  await p.evaluate(()=>{KAP.libQuery='';updateExTitle(cEx);});
  await p.screenshot({path:OUT+`/S3_${t}_lab_find.png`});
  await p.click('#ext-find'); await p.waitForTimeout(300); await p.screenshot({path:OUT+`/S3_${t}_lib.png`});
  await ctx.close();
 }
 console.log('errs',errs.length?errs:'none'); console.log('FAILS',fail); await b.close();
})();
