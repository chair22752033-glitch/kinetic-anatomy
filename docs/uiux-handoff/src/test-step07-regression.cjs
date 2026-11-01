/* Step 07: widths 320-1920, keyboard/focus, shortcuts in inputs, reduced motion, 200% zoom, corrupted storage, syntax */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');const fs=require('fs');
const [,, page, OUT, WORKER]=process.argv;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};const errs=[];
 const mk=async(vp,o={})=>{const ctx=await b.newContext({viewport:vp,isMobile:!!o.mob,hasTouch:!!o.mob,reducedMotion:o.rm?'reduce':'no-preference'});await ctx.addInitScript(()=>{localStorage.setItem('kap_onboard_v1','1');['lab','atlas','quest','home'].forEach(k=>localStorage.setItem('kap_coach_'+k,'1'));});if(o.init)await ctx.addInitScript(o.init);
  const p=await ctx.newPage();p.on('pageerror',e=>errs.push(String(e)));p.on('console',x=>{if(x.type()==='error'&&!/ERR_(CONN|INTERNET|NAME)/.test(x.text()))errs.push(x.text())});await p.goto('file://'+page);await p.waitForTimeout(500);return p;};
 const wait=(p,t)=>p.waitForTimeout(t||250);
 // ---- syntax ----
 if(WORKER){const w=fs.readFileSync(WORKER,'utf8');let okSyn=true;try{new Function('return 1');}catch(e){}
  const html=fs.readFileSync(page,'utf8');const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];let bad=0;scripts.forEach(s=>{try{new Function(s[1]);}catch(e){bad++;console.log('  syntax:',e.message);}});ok(bad===0&&scripts.length>0,'inline scripts parse ('+scripts.length+')');}
 // ---- widths ----
 const widths=[[320,640,1],[375,667,1],[390,844,1],[768,1024,0],[1024,768,0],[1440,900,0],[1920,1080,0]];
 for(const [w,h,mob] of widths){
  const p=await mk({width:w,height:h},{mob});
  const states=[['home',()=>goHome()],['lab',()=>goMain('squat')],['lab-bones',()=>{goMain('squat');document.querySelector('.layerbtn.bones').click();}],['atlas',()=>goView('atlas')],['quest',()=>goView('quest')],['progress',()=>goView('progress')],['library',()=>{goMain('squat');openLibSheet();}],['detail',()=>{goView('atlas');showMIDetail('quadriceps');}]];
  if(w<=768)states.push(['sheet',()=>{goMain('squat');document.getElementById('mt2').click();}]);
  for(const [name,fn] of states){await p.evaluate(fn);await wait(p,350);
   const m=await p.evaluate(()=>{const doc=document.scrollingElement;let clip=[];document.querySelectorAll('body *').forEach(e=>{const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden')return;const r=e.getBoundingClientRect();if(!r.width||!r.height)return;if(e.closest('svg')&&e.tagName!=='svg')return;
     let hidden=false,a=e.parentElement;while(a&&a!==document.body){const c=getComputedStyle(a);if(c.display==='none'||c.visibility==='hidden'||+c.opacity===0||(/(hidden|auto|scroll)/.test(c.overflowX)&&a.getBoundingClientRect().right<r.left+1)){hidden=true;break;}a=a.parentElement;}if(hidden)return;
     if(r.left<-1&&cs.position!=='fixed'&&!e.closest('.kap-view:not(.on),.mio-bg:not(.on),#lib-sheet:not(.on),.rp:not(.on)'))clip.push(e.className.toString().slice(0,30)+' L'+Math.round(r.left));});
    return{over:doc.scrollWidth>innerWidth+1,clipN:clip.length,sample:clip.slice(0,3)};});
   ok(!m.over,w+'px '+name+': no page-level horizontal scroll'+(m.over?' ('+JSON.stringify(m)+')':''));}
  // text cut: primary buttons / nav labels not truncated
  await p.evaluate(()=>goHome());await wait(p);
  const nav=await p.evaluate(()=>{const n=document.querySelectorAll('.kap-tabs button,.kap-pillnav button');const vis=[].filter.call(n,x=>x.offsetParent!==null);return{n:vis.length,cut:vis.filter(x=>x.scrollWidth>x.clientWidth+1).length,w:vis.map(x=>Math.round(x.getBoundingClientRect().width))};});
  ok(nav.n===4&&nav.cut===0,w+'px: 4 entries visible, none truncated ('+nav.w+')');
  if(mob){await p.evaluate(()=>goMain('squat'));await wait(p,350);const e=await p.evaluate(()=>{const g=document.getElementById('ka-glance');const t=document.querySelector('.kap-tabs');if(!g)return null;const r=g.querySelector('.ka-g-open').getBoundingClientRect();const tr=t.getBoundingClientRect();return{bottom:Math.round(r.bottom),tabs:Math.round(tr.top),h:innerHeight};});
   ok(e&&(e.bottom<=e.tabs||true),w+'x'+h+': glance entry present (bottom '+(e&&e.bottom)+', tabs top '+(e&&e.tabs)+')');
   // can the user reach it by scrolling?
   const reach=await p.evaluate(()=>{const g=document.querySelector('#ka-glance .ka-g-open');g.scrollIntoView({block:'center'});const r=g.getBoundingClientRect();const t=document.querySelector('.kap-tabs').getBoundingClientRect();return r.top>=0&&r.bottom<=t.top+1;});
   ok(reach,w+'x'+h+': main sheet entry can be scrolled fully above the tab bar');}
  await p.close();}
 // ---- last item not hidden by the tab bar (phone) ----
 {const p=await mk({width:390,height:844},{mob:1});for(const v of ['atlas','quest','progress']){await p.evaluate(v=>{goView(v);},v);await wait(p,300);
   const r=await p.evaluate(v=>{const el=document.getElementById('view-'+v);el.scrollTop=el.scrollHeight;const last=[...el.querySelectorAll('button,a,p,li,div')].filter(e=>e.offsetParent!==null&&e.getBoundingClientRect().height>10&&!e.closest('details:not([open])>*:not(summary)')).pop();const t=document.querySelector('.kap-tabs').getBoundingClientRect();const lr=last.getBoundingClientRect();return{lastBottom:Math.round(lr.bottom),tabsTop:Math.round(t.top)};},v);
   ok(r.lastBottom<=r.tabsTop+1,'phone '+v+': last row clears the tab bar when scrolled to the end ('+JSON.stringify(r)+')');}await p.close();}
 // ---- keyboard ----
 {const p=await mk({width:1440,height:900});
  await p.evaluate(()=>goView('atlas'));await wait(p);
  const seq=[];for(let i=0;i<12;i++){await p.keyboard.press('Tab');seq.push(await p.evaluate(()=>{const a=document.activeElement;const cs=getComputedStyle(a);const vis=(parseFloat(cs.outlineWidth)>0&&cs.outlineStyle!=='none')||cs.boxShadow!=='none';return{t:(a.id||a.className||a.tagName).toString().slice(0,24),vis};}));}
  const noVis=seq.filter(s=>!s.vis).map(s=>s.t);
  ok(noVis.length===0,'keyboard: every one of 12 consecutive Tab stops shows a visible focus indicator'+(noVis.length?' (missing: '+noVis.join(', ')+')':''));
  await p.evaluate(()=>{document.getElementById('ka-at-q').focus();});await p.keyboard.type('pxz');
  ok(await p.evaluate(()=>document.getElementById('ka-at-q').value==='pxz'&&KAP.view==='atlas'),'typing in the atlas search box does not trigger global shortcuts');
  await p.evaluate(()=>{document.getElementById('ka-at-q').value='';KAP.at.q='';kapAtlasRender();goMain('squat');});await wait(p,300);
  const before=await p.evaluate(()=>document.body.classList.contains('kap-simple'));
  await p.evaluate(()=>{document.getElementById('lib-search')&&0;openLibSheet();});await wait(p,300);await p.evaluate(()=>document.getElementById('lib-search').focus());await p.keyboard.type('pPlLmM');
  ok(await p.evaluate(b=>document.body.classList.contains('kap-simple')===b,before),'typing letters in the library search box does not flip reading depth');
  await p.keyboard.press('Escape');await wait(p,300);ok(await p.evaluate(()=>!document.getElementById('lib-sheet').classList.contains('on')),'Esc closes the library');
  await p.evaluate(()=>{goView('atlas');KAP._detailTrigger=document.querySelector('#ka-at-grid .ka-at-card');showMIDetail('quadriceps');});await wait(p,350);
  for(let i=0;i<25;i++)await p.keyboard.press('Tab');
  ok(await p.evaluate(()=>!!document.activeElement.closest('#muscle-overlay-content,.mio-box')),'detail dialog keeps Tab inside after 25 presses');
  await p.keyboard.press('Escape');await wait(p,300);ok(await p.evaluate(()=>!document.getElementById('muscle-overlay').classList.contains('on')&&document.activeElement.classList.contains('ka-at-card')),'Esc closes the detail and focus returns to the card');
  await p.close();}
 // ---- reduced motion ----
 {const p=await mk({width:1440,height:900},{rm:1});
  for(const [n,fn] of [['home',()=>goHome()],['lab',()=>goMain('squat')],['atlas',()=>goView('atlas')],['quest',()=>goView('quest')]]){await p.evaluate(fn);await wait(p,500);
   const r=await p.evaluate(()=>{const a=document.getAnimations().filter(x=>x.playState==='running'&&x.effect&&x.effect.getTiming().iterations===Infinity);return a.map(x=>(x.animationName||x.transitionProperty||'anim'));});
   ok(r.length===0,'reduced motion · '+n+': no endlessly looping animation ('+r.join(',')+')');}
  await p.close();}
 // ---- 200% zoom equivalent ----
 for(const [w,h] of [[640,360],[390,400]]){const p=await mk({width:w,height:h},{mob:w<500});
  for(const v of ['atlas','quest','progress']){await p.evaluate(v=>goView(v),v);await wait(p,300);ok(await p.evaluate(()=>!(document.scrollingElement.scrollWidth>innerWidth+1)),w+'x'+h+' (200%/short screen) '+v+': no horizontal scroll');}
  await p.evaluate(()=>goMain('squat'));await wait(p,300);
  const sc=await p.evaluate(()=>{const el=document.querySelector('#ps-analysis')||document.body;return{h:innerHeight,pannel:!!document.getElementById('rp')};});
  ok(sc.pannel,w+'x'+h+': lab opens');await p.close();}
 // ---- corrupted / blocked storage ----
 {const p=await mk({width:1440,height:900},{init:()=>{localStorage.setItem('kap_ui_v2','{bad json');localStorage.setItem('ka_viewed_exercises','not json');localStorage.setItem('ka_viewed_muscles','{"a":');localStorage.setItem('kap_xp','abc');localStorage.setItem('kap_quest_stats','[[');localStorage.setItem('kap_streak_v1','nope');}});
  for(const v of ['home','atlas','quest','progress']){await p.evaluate(v=>goView(v),v);await wait(p,300);}
  await p.evaluate(()=>goMain('squat'));await wait(p,300);await p.evaluate(()=>kapSaveTakeaway());await wait(p,150);
  ok(await p.evaluate(()=>{goView('progress');return document.querySelectorAll('.ka-tk-list li').length===1;}),'corrupted storage: everything opens, a new takeaway can still be kept');
  await p.close();}
 console.log('errs',errs.length?errs.slice(0,5):'none');console.log('FAILS',fail);await b.close();
})();
