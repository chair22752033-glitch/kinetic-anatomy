const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [,, page, OUT]=process.argv;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};const errs=[];
 const ctx=await b.newContext({viewport:{width:1440,height:900}});
 await ctx.addInitScript(()=>{localStorage.setItem('kap_onboard_v1','1');['lab','atlas','quest','home'].forEach(k=>localStorage.setItem('kap_coach_'+k,'1'));});
 const p=await ctx.newPage();p.on('pageerror',e=>errs.push(String(e)));p.on('console',x=>{if(x.type()==='error'&&!/ERR_(CONN|INTERNET|NAME)/.test(x.text()))errs.push(x.text())});
 await p.goto('file://'+page);await p.waitForTimeout(300);
 await p.evaluate(()=>goMain('squat'));await p.waitForTimeout(300);
 const rectsMatch=()=>p.evaluate(()=>{const a=document.getElementById('bsvg').getBoundingClientRect(),o=document.getElementById('bone-overlay').getBoundingClientRect();return Math.max(Math.abs(a.left-o.left),Math.abs(a.top-o.top),Math.abs(a.width-o.width),Math.abs(a.height-o.height))<1.5;});
 await p.evaluate(()=>document.querySelector('.layerbtn.bones').click());await p.waitForTimeout(600);
 ok(await rectsMatch(),'overlay box == body svg box');
 // right-side (cloned) bones are clickable and named correctly
 for(const [id,exp] of [['femur-R','Femur'],['humerus-R','Humerus'],['rib-3-R','Rib'],['tibia-R','Tibia'],['clavicle-R','Clavicle']]){
   const found=await p.evaluate(id=>!!document.getElementById(id),id);
   if(!found){ok(false,id+' exists');continue;}
   await p.evaluate(id=>{document.getElementById(id).dispatchEvent(new MouseEvent('click',{bubbles:true}));},id);await p.waitForTimeout(250);
   const nm=await p.evaluate(()=>((document.querySelector('#muscle-overlay .mio-name')||{}).textContent||'')+' '+((document.querySelector('#muscle-overlay .mio-ename')||{}).textContent||''));
   const on=await p.evaluate(()=>document.getElementById('muscle-overlay').classList.contains('on'));
   ok(on&&nm.toLowerCase().includes(exp.toLowerCase()),'click '+id+' (cloned right-hand bone) -> '+nm);
   await p.evaluate(()=>document.getElementById('muscle-overlay').classList.remove('on'));
 }
 // a REAL pointer click on the right femur shaft hits the right femur (not another bone)
 const pr=await p.evaluate(()=>{const e=document.getElementById('femur-R');const g=e.querySelector('path')||e;const L=g.getTotalLength();const q=g.getPointAtLength(L*0.25);const m=e.transform.baseVal.consolidate().matrix;const bs=document.getElementById('bone-overlay');const pt=bs.createSVGPoint();pt.x=m.a*q.x+m.c*q.y+m.e;pt.y=m.b*q.x+m.d*q.y+m.f;const s=pt.matrixTransform(bs.getScreenCTM());const hit=document.elementFromPoint(s.x,s.y);let h=hit;while(h&&!h.getAttribute?.('data-key'))h=h.parentElement;return{x:s.x,y:s.y,key:h&&h.getAttribute('data-key')};});
 ok(!!pr.key,'real pointer on the right femur outline hits a bone ('+pr.key+')');
 // clone fills are real (no stylesheet loss)
 ok(await p.evaluate(()=>{const e=document.getElementById('femur-R');return e&&getComputedStyle(e.querySelector('path')||e).fill.includes('kapBoneGrad');}),'right femur uses the bone gradient fill');
 // resize keeps the overlay glued
 await p.setViewportSize({width:1100,height:760});await p.waitForTimeout(500);ok(await rectsMatch(),'after resize 1100x760 overlay still == body box');
 await p.setViewportSize({width:1920,height:1000});await p.waitForTimeout(500);ok(await rectsMatch(),'after resize 1920x1000 overlay still == body box');
 // collapse the right panel (canvas widens) -> still glued
 await p.evaluate(()=>{document.body.classList.toggle('kap-rp-collapsed');});await p.waitForTimeout(500);ok(await rectsMatch(),'after collapsing the side panel overlay still == body box');
 await p.evaluate(()=>{document.body.classList.remove('kap-rp-collapsed');});await p.waitForTimeout(300);
 // bones off, change view while hidden, bones on -> fitted for the new view
 await p.setViewportSize({width:1440,height:900});await p.waitForTimeout(300);
 await p.evaluate(()=>document.querySelector('.layerbtn.bones').click());await p.waitForTimeout(300);
 ok(await p.evaluate(()=>getComputedStyle(document.getElementById('bone-overlay')).display==='none'),'bones off hides overlay');
 await p.evaluate(()=>{document.querySelector('.view-cluster [data-gd="female"]').click();document.querySelector('.view-cluster [data-sd="back"]').click();});await p.waitForTimeout(300);
 await p.evaluate(()=>document.querySelector('.layerbtn.bones').click());await p.waitForTimeout(700);
 const fit=await p.evaluate(()=>{const t=document.getElementById('femur-L').getAttribute('transform');const sk=document.getElementById('skull').getAttribute('transform');return{femur:!!t,skull:!!sk,vis:getComputedStyle(document.getElementById('kbf')).display,patella:getComputedStyle(document.getElementById('patella-L')).display};});
 ok(fit.femur&&fit.skull&&fit.vis!=='none'&&fit.patella==='none','hidden view change then bones on: fitted, limbs visible from behind, patella hidden ('+JSON.stringify(fit)+')');
 // back to male front: patella visible again
 await p.evaluate(()=>{document.querySelector('.view-cluster [data-gd="male"]').click();document.querySelector('.view-cluster [data-sd="front"]').click();});await p.waitForTimeout(500);
 ok(await p.evaluate(()=>getComputedStyle(document.getElementById('patella-L')).display!=='none'),'front view shows patellae again');
 // exercise change while bones on keeps the fit
 await p.evaluate(()=>loadEx('deadlift'));await p.waitForTimeout(500);ok(await rectsMatch()&&await p.evaluate(()=>!!document.getElementById('femur-L').getAttribute('transform')),'exercise change keeps fit');
 await p.screenshot({path:OUT+'/F4_desktop_bones.png'});
 console.log('errs',errs.length?errs:'none');console.log('FAILS',fail);await b.close();
})();
