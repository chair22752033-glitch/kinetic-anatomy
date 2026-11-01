const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [,, page, OUT]=process.argv;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};const errs=[];
 for(const [t,vp,mob] of [['desktop',{width:1440,height:900},false],['mobile',{width:390,height:844},true]]){
  console.log('--- '+t);
  const ctx=await b.newContext({viewport:vp,isMobile:mob,hasTouch:mob});
  await ctx.addInitScript(()=>{localStorage.setItem('kap_onboard_v1','1');['lab','atlas','quest','home'].forEach(k=>localStorage.setItem('kap_coach_'+k,'1'));});
  const p=await ctx.newPage();p.on('pageerror',e=>errs.push(String(e)));p.on('console',x=>{if(x.type()==='error'&&!/ERR_(CONN|INTERNET|NAME)/.test(x.text()))errs.push(x.text())});
  await p.goto('file://'+page);await p.waitForTimeout(300);await p.evaluate(()=>goMain('squat'));await p.waitForTimeout(500);
  // role colours: squat -> quads coral (agonist), abs blue (stabiliser), chest idle neutral
  const fills=await p.evaluate(()=>{const f=s=>{const e=document.querySelector('#bsvg path[data-slug="'+s+'"]');return e?getComputedStyle(e).fill:null};return{quad:f('quadriceps'),abs:f('abs'),chest:f('chest'),hair:f('hair')}});
  ok(fills.quad==='rgb(183, 82, 59)','agonist quadriceps = coral '+fills.quad);
  ok(fills.abs==='rgb(65, 109, 145)','stabiliser abs = blue '+fills.abs);
  ok(fills.chest==='rgb(201, 209, 197)','idle chest = anatomy-neutral '+fills.chest);
  ok(await p.evaluate(()=>EX.squat.muscles[1].col==='#ff6b35'),'EX data colours untouched (squat quadriceps col still #ff6b35)');
  ok(await p.evaluate(()=>!!document.getElementById('ka-legend')&&document.getElementById('ka-legend').textContent.includes('role')),'legend with role text + not-pain note present');
  // synergist (back view hamstring) = amber
  await p.evaluate(()=>document.querySelector('.view-cluster [data-sd="back"]').click());await p.waitForTimeout(400);
  ok((await p.evaluate(()=>{const e=document.querySelector('#bsvg path[data-slug="hamstring"]');return e&&getComputedStyle(e).fill}))==='rgb(144, 106, 37)','synergist hamstring = amber');
  await p.evaluate(()=>document.querySelector('.view-cluster [data-sd="front"]').click());await p.waitForTimeout(400);
  // zoom
  const vbOf=()=>p.evaluate(()=>document.getElementById('bsvg').getAttribute('viewBox'));
  const base=await vbOf();
  await p.click('#ka-zoom-in');await p.waitForTimeout(150);const z1=await vbOf();
  ok(z1!==base&&await p.evaluate(()=>document.getElementById('ka-zoom-pct').textContent==='125%'),'zoom in -> 125% crops the viewBox');
  for(let i=0;i<6;i++)await p.evaluate(()=>{var z=document.getElementById('ka-zoom-in');if(!z.disabled)z.click();});
  ok(await p.evaluate(()=>document.getElementById('ka-zoom-pct').textContent==='250%'&&document.getElementById('ka-zoom-in').disabled),'zoom stops at 250% (button disabled)');
  const w=(await vbOf()).split(' ').map(Number);const bw=base.split(' ').map(Number);
  ok(Math.abs(w[2]-bw[2]/2.5)<0.5&&w[0]>=bw[0]-.01&&w[0]+w[2]<=bw[0]+bw[2]+.01,'250% viewBox stays inside the figure area');
  // bones overlay stays glued while zoomed
  await p.evaluate(()=>document.querySelector('.layerbtn.bones').click());await p.waitForTimeout(600);
  const glued=await p.evaluate(()=>{const a=document.getElementById('bsvg').getBoundingClientRect(),o=document.getElementById('bone-overlay').getBoundingClientRect();return Math.max(Math.abs(a.left-o.left),Math.abs(a.top-o.top),Math.abs(a.width-o.width),Math.abs(a.height-o.height))<1.5&&document.getElementById('bone-overlay').getAttribute('viewBox')===document.getElementById('bsvg').getAttribute('viewBox')&&document.querySelector('#bone-overlay .kap-anat').getAttribute('viewBox')===document.getElementById('bsvg').getAttribute('viewBox')});
  ok(glued,'bones overlay uses the same zoomed viewBox/box');
  if(t==='desktop')await p.screenshot({path:OUT+'/C3_zoom_bones.png'});
  await p.evaluate(()=>document.querySelector('.layerbtn.bones').click());await p.waitForTimeout(200);
  await p.click('#ka-zoom-pct');await p.waitForTimeout(150);ok((await vbOf())===base,'click on % resets to 100%');
  await p.click('#ka-zoom-in');await p.evaluate(()=>{document.getElementById('ca').dispatchEvent(new MouseEvent('dblclick',{bubbles:true}));});await p.waitForTimeout(150);ok(await p.evaluate(()=>document.getElementById('ka-zoom-pct').textContent==='100%'),'double-click on the canvas resets zoom');
  // exercise change keeps/derives zoom without errors; gender switch re-applies
  await p.evaluate(()=>{KAPZ.z=1;kapApplyZoom();loadEx('deadlift');});await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.getElementById('ka-zoom-pct').textContent==='100%'),'state sane after exercise change');
  // fascia note (lunge references fo-dfl without a drawing)
  await p.evaluate(()=>loadEx('lunge'));await p.waitForTimeout(200);
  await p.evaluate(()=>document.querySelector('.layerbtn[data-ly="fascia"]').click());await p.waitForTimeout(300);
  const note=await p.evaluate(()=>{const n=document.getElementById('ka-fascia-note');return n&&getComputedStyle(n).display!=='none'?n.textContent:null});
  ok(!!note&&/1 fascial line|1 條筋膜線/.test(note),'lunge: fascia note shown ('+note+')');
  await p.evaluate(()=>loadEx('squat'));await p.waitForTimeout(300);
  ok(await p.evaluate(()=>{const n=document.getElementById('ka-fascia-note');return !n||getComputedStyle(n).display==='none'}),'squat: no fascia note (all its lines drawn)');
  await p.evaluate(()=>document.querySelector('.layerbtn[data-ly="fascia"]').click());await p.waitForTimeout(200);
  await ctx.close();
 }
 console.log('errs',errs.length?errs:'none');console.log('FAILS',fail);await b.close();
})();
