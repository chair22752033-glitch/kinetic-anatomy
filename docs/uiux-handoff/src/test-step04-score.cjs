const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [,, page]=process.argv;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const ctx=await b.newContext({viewport:{width:1000,height:1000}});
 await ctx.addInitScript(()=>{localStorage.setItem('kap_onboard_v1','1');['lab','atlas','quest','home'].forEach(k=>localStorage.setItem('kap_coach_'+k,'1'));});
 const p=await ctx.newPage();await p.goto('file://'+page);await p.waitForTimeout(300);
 await p.evaluate(()=>goMain('squat'));await p.waitForTimeout(300);
 const mus=process.argv[3]==='muscles-off';if(mus)await p.evaluate(()=>document.querySelector('.layerbtn.muscles').click());await p.evaluate(()=>document.querySelector('.layerbtn.bones').click());await p.waitForTimeout(700);console.log('muscle layer',mus?'OFF':'ON');
 const score=()=>p.evaluate(()=>{
  const bs=document.getElementById('bsvg'),bo=document.getElementById('bone-overlay');
  const body=[...bs.querySelectorAll('path[data-slug]')];
  const pt=bs.createSVGPoint();
  const near=(x,y)=>{const ring=[[0,0],[10,0],[-10,0],[0,10],[0,-10],[7,7],[-7,7],[7,-7],[-7,-7]];return ring.some(([dx,dy])=>{pt.x=x+dx;pt.y=y+dy;return body.some(e=>{try{return e.isPointInFill(pt)}catch(_){return false}})});};
  const grp={skull:/^(skull|mandible)$/,spine_ribs_pelvis:/^(c\d|t\d|l\d|rib-|sacrum|coccyx|sternum|pelvis)/,upper_arm:/^humerus/,forearm:/^(radius|ulna)/,hand:/^(scaphoid|lunate|triquetrum|pisiform|trapezi|capitate|hamate|metacarpal|phalanx)/,thigh:/^femur/,shin:/^(tibia|fibula)/,foot:/^(talus|calcaneus|navicular|cuboid|.*cuneiform|metatarsal|toe)/};
  const els=[...bo.querySelectorAll('.kap-anat [data-key]')].filter(e=>e.id&&getComputedStyle(e).display!=='none');
  const out={};
  Object.keys(grp).forEach(g=>{let n=0,k=0;els.filter(e=>grp[g].test(e.getAttribute('data-key'))).forEach(e=>{const m=e.transform.baseVal.numberOfItems?e.transform.baseVal.consolidate().matrix:null;const geo=e.getTotalLength?[e]:[...e.querySelectorAll('path,ellipse,circle,rect,polygon')];geo.forEach(gm=>{if(!gm.getTotalLength||gm.tagName==='line')return;const L=gm.getTotalLength();if(!L)return;const c=Math.max(3,Math.min(30,Math.ceil(L/8)));for(let i=0;i<=c;i++){const q=gm.getPointAtLength(L*i/c);let x=q.x,y=q.y;if(m){x=m.a*q.x+m.c*q.y+m.e;y=m.b*q.x+m.d*q.y+m.f;}n++;if(near(x,y))k++;}});});out[g]=n?Math.round(100*k/n):null;});
  return out;});
 const res={};
 for(const [gd,sd] of [['male','front'],['male','back'],['female','front'],['female','back']]){
  await p.evaluate(([g,s])=>{document.querySelector('.view-cluster [data-gd="'+g+'"]').click();document.querySelector('.view-cluster [data-sd="'+s+'"]').click();},[gd,sd]);await p.waitForTimeout(500);
  const fitted=await score();
  // baseline: registration only (same frame) but no per-segment fit
  await p.evaluate(()=>{document.querySelectorAll('#bone-overlay .kap-anat [transform]').forEach(e=>{if(e.getAttribute('data-kapside')==='R')e.setAttribute('transform',KAPFIT.MIR);else e.removeAttribute('transform');});});
  const base=await score();
  await p.evaluate(()=>kapSyncOverlay());
  const avg=o=>Math.round(Object.values(o).filter(v=>v!==null).reduce((a,b)=>a+b,0)/Object.values(o).filter(v=>v!==null).length);
  console.log(gd+'/'+sd,'\n  fitted  ',JSON.stringify(fitted),'avg',avg(fitted),'\n  unfitted',JSON.stringify(base),'avg',avg(base));
 }
 await b.close();
})();
