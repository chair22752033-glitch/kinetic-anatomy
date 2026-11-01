/* Step 04f: femur / hand / ribcage art — placement, mirrored copies, hit areas, back view, failure fallback */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [,, page, OUT]=process.argv;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};const errs=[];
 const ctx=await b.newContext({viewport:{width:1100,height:1000},deviceScaleFactor:1});
 await ctx.addInitScript(()=>{localStorage.setItem('kap_onboard_v1','1');['lab','atlas','quest','home'].forEach(k=>localStorage.setItem('kap_coach_'+k,'1'));});
 const p=await ctx.newPage();p.on('pageerror',e=>errs.push(String(e)));p.on('console',x=>{if(x.type()==='error'&&!/ERR_(CONN|INTERNET|NAME)/.test(x.text()))errs.push(x.text())});
 await p.goto('file://'+page);await p.waitForTimeout(300);await p.evaluate(()=>goMain('squat'));await p.waitForTimeout(300);
 await p.evaluate(()=>document.querySelector('.layerbtn.bones').click());await p.waitForTimeout(900);
 for(const [gd,sd] of [['male','front'],['male','back'],['female','front'],['female','back']]){
  await p.evaluate(([g,s])=>{document.querySelector('.view-cluster [data-gd="'+g+'"]').click();document.querySelector('.view-cluster [data-sd="'+s+'"]').click();},[gd,sd]);await p.waitForTimeout(600);
  const r=await p.evaluate(()=>{const q=n=>document.querySelector('#bone-overlay image[data-art="'+n+'"]');const bx=n=>{const e=q(n);if(!e)return null;const r=e.getBoundingClientRect();return{l:r.left,r:r.right,t:r.top,b:r.bottom,w:r.width,h:r.height}};
   const ca=document.getElementById('bsvg').getBoundingClientRect();const rib=bx('thoracic_ribcage');
   return{n:document.querySelectorAll('#bone-overlay image[data-art]').length,femurL:bx('femur'),femurR:bx('femur-R'),handL:bx('hand'),handR:bx('hand-R'),rib,body:{l:ca.left,r:ca.right,t:ca.top,b:ca.bottom},
    mid:ca.left+ca.width/2,hiddenKeys:['femur-L','femur-R','sternum','rib-5-L','rib-5-R','t6-vertebra','metacarpal-2-L','metacarpal-2-R'].map(id=>{const e=document.getElementById(id);return e?e.style.opacity==='0':'missing:'+id}),bcHidden:[].every.call(document.querySelectorAll('#bone-overlay .bc'),n=>{let c=n;while(c&&c.style.display!=='none'&&c.parentNode&&c.id!=='kax')c=c.parentNode;return c&&c.style.display==='none'}),patella:(()=>{const e=document.getElementById('patella-L');return e?getComputedStyle(e).display:'none'})()}});
  const tag=gd+'/'+sd;
  ok(r.n===6,tag+': 6 art images (skull, ribcage, femur x2, hand x2) -> '+r.n);
  ok(r.femurL&&r.femurR&&Math.abs((r.femurL.l+r.femurL.r)/2+(r.femurR.l+r.femurR.r)/2-2*r.mid)<12,tag+': femur copies mirror about the body midline');
  ok(r.handL&&r.handR&&Math.abs((r.handL.l+r.handL.r)/2+(r.handR.l+r.handR.r)/2-2*r.mid)<14,tag+': hand copies mirror about the body midline');
  ok(r.rib&&Math.abs((r.rib.l+r.rib.r)/2-r.mid)<8,tag+': ribcage centred on the midline');
  ok(r.hiddenKeys.every(v=>v===true),tag+': replaced vector bones hidden but kept ('+JSON.stringify(r.hiddenKeys)+')');
  ok(r.bcHidden,tag+': vector costal cartilages hidden');
  ok(r.femurL.t>=r.body.t&&r.femurL.b<=r.body.b&&r.handL.b<=r.body.b+2,tag+': nothing leaves the figure box');
  if(sd==='back')ok(r.patella==='none',tag+': patella still hidden in back view');
 }
 // hit areas: real pointer on each art reaches the vector bone, click opens a bone detail
 await p.evaluate(()=>{document.querySelector('.view-cluster [data-gd="male"]').click();document.querySelector('.view-cluster [data-sd="front"]').click();});await p.waitForTimeout(600);
 for(const [art,fx,fy,expect] of [['femur',.5,.5,/^femur/],['thoracic_ribcage',.5,.5,/^(sternum|rib-|t\d+-vertebra)/],['hand',.5,.45,/(metacarpal|phalanx|capitate|hamate|scaphoid|lunate|trapez|pisiform|triquetrum)/]]){
  const hit=await p.evaluate(([n,fx,fy])=>{const im=document.querySelector('#bone-overlay image[data-art="'+n+'"]').getBoundingClientRect();const pts=[];for(let k=0;k<25;k++){const x=im.left+im.width*(fx+((k%5)-2)*.03),y=im.top+im.height*(fy+(Math.floor(k/5)-2)*.03);const e=document.elementFromPoint(x,y);let h=e;while(h&&!(h.getAttribute&&h.getAttribute('data-key')))h=h.parentElement;if(h)pts.push(h.getAttribute('data-key'));}return pts[0]||null},[art,fx,fy]);
  ok(hit&&expect.test(hit),art+' art: pointer reaches vector hit area ('+hit+')');}
 await p.evaluate(()=>document.getElementById('femur-L').dispatchEvent(new MouseEvent('click',{bubbles:true})));await p.waitForTimeout(300);
 ok(await p.evaluate(()=>document.getElementById('muscle-overlay').classList.contains('on')),'click on femur hit area opens its detail: '+await p.evaluate(()=>(document.querySelector('#muscle-overlay .mio-name')||{}).textContent));
 await p.evaluate(()=>document.getElementById('muscle-overlay').classList.remove('on'));
 // hover class shows the hit shape faintly
 const hv=await p.evaluate(()=>{const e=document.getElementById('femur-L');e.classList.add('hl');const o=getComputedStyle(e).opacity;e.classList.remove('hl');return+o});ok(hv>.4&&hv<.7,'hover/selection highlight shows the vector shape faintly (opacity '+hv+')');
 // failure fallback: broken image -> vector restored, costal cartilage back
 await p.evaluate(()=>{document.querySelector('#bone-overlay image[data-art="thoracic_ribcage"]').dispatchEvent(new Event('error'));document.querySelector('#bone-overlay image[data-art="femur"]').dispatchEvent(new Event('error'));});await p.waitForTimeout(200);
 const fb=await p.evaluate(()=>({rib:!document.querySelector('#bone-overlay image[data-art="thoracic_ribcage"]'),ribVis:document.getElementById('rib-3-L').style.opacity==='',bc:[].some.call(document.querySelectorAll('#bone-overlay [data-kart-bc]'),n=>n.style.display==='none'),femurVis:document.getElementById('femur-L').style.opacity===''&&document.getElementById('femur-R').style.opacity===''}));
 ok(fb.rib&&fb.ribVis&&!fb.bc&&fb.femurVis,'a failed image falls back to the vector bones ('+JSON.stringify(fb)+')');
 console.log('errs',errs.length?errs:'none');console.log('FAILS',fail);await b.close();
})();
