const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [,, page, OUT, tag]=process.argv;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const errs=[];const rows=[];
 for(const [vt,vp,mob] of [['desktop',{width:1440,height:900},false],['mobile',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport:vp,isMobile:mob,hasTouch:mob});
  await ctx.addInitScript(()=>{localStorage.setItem('kap_onboard_v1','1');['lab','atlas','quest','home'].forEach(k=>localStorage.setItem('kap_coach_'+k,'1'));});
  const p=await ctx.newPage();p.on('pageerror',e=>errs.push(vt+' '+e));p.on('console',x=>{if(x.type()==='error'&&!/ERR_(CONN|INTERNET|NAME)/.test(x.text()))errs.push(vt+' '+x.text())});
  await p.goto('file://'+page);await p.waitForTimeout(300);
  await p.evaluate(()=>goMain('squat'));await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('.layerbtn.bones').click());await p.waitForTimeout(700);
  for(const [gd,sd] of [['male','front'],['male','back'],['female','front'],['female','back']]){
    // use the real UI controls
    await p.evaluate(([g,s])=>{document.querySelector('.view-cluster [data-gd="'+g+'"]').click();document.querySelector('.view-cluster [data-sd="'+s+'"]').click();},[gd,sd]);await p.waitForTimeout(500);
    const res=await p.evaluate(()=>{
      const bs=document.getElementById('bsvg'),bo=document.getElementById('bone-overlay');
      const bodyPaths=[...bs.querySelectorAll('path[data-slug]')].filter(e=>e.dataset.slug!=='hair');
      const inside=(x,y)=>{const pt=bs.createSVGPoint();pt.x=x;pt.y=y;return bodyPaths.some(e=>{try{return e.isPointInFill(pt)}catch(_){return false}});};
      const grp={skull:/^(skull|mandible)$/,spine_ribs_pelvis:/^(c\d|t\d|l\d|rib-|sacrum|coccyx|sternum|pelvis)/,upper_arm:/^humerus/,forearm:/^(radius|ulna)/,thigh:/^femur/,shin:/^(tibia|fibula)/};
      const out={};const rootEls=[...bo.querySelectorAll('.kap-anat [data-key]')].filter(e=>e.id&&getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width>0);
      Object.keys(grp).forEach(g=>{let n=0,k=0;rootEls.filter(e=>grp[g].test(e.getAttribute('data-key'))).forEach(e=>{const m=e.transform.baseVal.numberOfItems?e.transform.baseVal.consolidate().matrix:null;(e.getTotalLength?[e]:[...e.querySelectorAll('path,ellipse,circle,line,rect,polygon')]).forEach(gm=>{if(!gm.getTotalLength)return;const L=gm.getTotalLength();if(!L)return;const c=Math.max(4,Math.min(40,Math.ceil(L/6)));for(let i=0;i<=c;i++){let q=gm.getPointAtLength(L*i/c);let x=q.x,y=q.y;if(m){x=m.a*q.x+m.c*q.y+m.e;y=m.b*q.x+m.d*q.y+m.f;}n++;if(inside(x,y))k++;}});});out[g]=n?Math.round(100*k/n):null;});
      const black=[...bo.querySelectorAll('.kap-anat [data-kapside="R"]')].filter(e=>{const t=e.querySelector('path,ellipse,circle')||e;return getComputedStyle(t).fill==='rgb(0, 0, 0)';}).length;
      return{inside:out,rightBlack:black,visibleBones:rootEls.length,view:bs.getAttribute('viewBox')};});
    rows.push(vt+' '+gd+'/'+sd+' '+JSON.stringify(res));
    const ca=await p.$('#ca');await ca.screenshot({path:OUT+`/${tag}_${vt}_${gd}_${sd}.png`});
  }
  await ctx.close();
 }
 console.log(rows.join('\n'));console.log('errs',errs.length?errs:'none');await b.close();
})();
