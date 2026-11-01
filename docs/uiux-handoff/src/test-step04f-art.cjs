const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [,, page, OUT]=process.argv;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};const errs=[];
 const ctx=await b.newContext({viewport:{width:1100,height:1000},deviceScaleFactor:2});
 await ctx.addInitScript(()=>{localStorage.setItem('kap_onboard_v1','1');['lab','atlas','quest','home'].forEach(k=>localStorage.setItem('kap_coach_'+k,'1'));});
 const p=await ctx.newPage();p.on('pageerror',e=>errs.push(String(e)));p.on('console',x=>{if(x.type()==='error'&&!/ERR_(CONN|INTERNET|NAME)/.test(x.text()))errs.push(x.text())});
 await p.goto('file://'+page);await p.waitForTimeout(300);await p.evaluate(()=>goMain('squat'));await p.waitForTimeout(300);
 await p.evaluate(()=>document.querySelector('.layerbtn.bones').click());await p.waitForTimeout(900);
 ok(await p.evaluate(()=>!!document.querySelector('#kart image[data-art="skull_front"]')),'skull art <image> is in the overlay');
 ok(await p.evaluate(()=>['skull','mandible'].every(id=>document.getElementById(id).style.opacity==='0')),'vector skull+mandible hidden but still in the DOM (hit areas)');
 // art box vs the muscle figure's head
 for(const [gd,sd] of [['male','front'],['male','back'],['female','front'],['female','back']]){
  await p.evaluate(([g,s])=>{document.querySelector('.view-cluster [data-gd="'+g+'"]').click();document.querySelector('.view-cluster [data-sd="'+s+'"]').click();},[gd,sd]);await p.waitForTimeout(600);
  const r=await p.evaluate(()=>{const im=document.querySelector('#kart image');const ib=im.getBoundingClientRect();const lm=KAPFIT.lastLM;const bs=document.getElementById('bsvg');const m=bs.getScreenCTM();const hx=lm.cx*m.a+m.e;const hy0=lm.head.y0*m.d+m.f,hy1=lm.head.y1*m.d+m.f;return{artCx:Math.round((ib.left+ib.right)/2),headCx:Math.round(hx),artTop:Math.round(ib.top),artBottom:Math.round(ib.bottom),headTop:Math.round(hy0),headBottom:Math.round(hy1),w:Math.round(ib.width),h:Math.round(ib.height)}});
  ok(Math.abs(r.artCx-r.headCx)<6,gd+'/'+sd+' skull centred on the head ('+JSON.stringify(r)+')');
  const ca=await p.$('#ca');await ca.screenshot({path:OUT+`/ART_${gd}_${sd}.png`});
 }
 // click on the (invisible) vector skull still opens its wiki entry
 await p.evaluate(()=>{document.querySelector('.view-cluster [data-gd="male"]').click();document.querySelector('.view-cluster [data-sd="front"]').click();});await p.waitForTimeout(500);
 await p.evaluate(()=>document.getElementById('skull').dispatchEvent(new MouseEvent('click',{bubbles:true})));await p.waitForTimeout(300);
 ok(await p.evaluate(()=>document.getElementById('muscle-overlay').classList.contains('on')&&/frontal|skull|Frontal/i.test((document.querySelector('#muscle-overlay .mio-name')||{}).textContent||'')),'click on skull -> '+await p.evaluate(()=>(document.querySelector('#muscle-overlay .mio-name')||{}).textContent));
 await p.evaluate(()=>document.getElementById('muscle-overlay').classList.remove('on'));
 // real pointer hit goes to the vector skull, not swallowed by the image
 const hit=await p.evaluate(()=>{const im=document.querySelector('#kart image').getBoundingClientRect();const e=document.elementFromPoint(im.left+im.width/2,im.top+im.height*0.35);let h=e;while(h&&!(h.getAttribute&&h.getAttribute('data-key')))h=h.parentElement;return h&&h.getAttribute('data-key')});
 ok(hit==='skull','pointer on the skull art reaches the skull hit area ('+hit+')');
 console.log('errs',errs.length?errs:'none');console.log('FAILS',fail);await b.close();
})();
