const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [,, page]=process.argv;
const scan=()=>{
  const lum=c=>{const a=c.map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)});return .2126*a[0]+.7152*a[1]+.0722*a[2]};
  const parse=s=>{const m=s.match(/rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(',').map(x=>parseFloat(x));return{r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1}};
  const over=(top,bot)=>({r:top.r*top.a+bot.r*(1-top.a),g:top.g*top.a+bot.g*(1-top.a),b:top.b*top.a+bot.b*(1-top.a),a:1});
  const bgOf=el=>{let layers=[];let e=el;while(e&&e.nodeType===1){const cs=getComputedStyle(e);const bg=parse(cs.backgroundColor);if(bg&&bg.a>0)layers.push(bg);if(bg&&bg.a>=1)break;if(cs.backgroundImage&&cs.backgroundImage!=='none'&&/gradient/.test(cs.backgroundImage))return null;e=e.parentElement;}let base={r:255,g:255,b:255,a:1};for(let i=layers.length-1;i>=0;i--)base=over(layers[i],base);return base;};
  const out=[];const seen=new Set();
  document.querySelectorAll('body *').forEach(el=>{if(!el.childNodes)return;const hasText=[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>0);if(!hasText)return;const r=el.getBoundingClientRect();if(r.width<2||r.height<2)return;const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none'||parseFloat(cs.opacity)<0.3)return;
    // skip if clipped away (off-screen containers)
    let anc=el,hidden=false;while(anc&&anc!==document.body){const c2=getComputedStyle(anc);if(c2.display==='none'||c2.visibility==='hidden'||parseFloat(c2.opacity)<0.3||(c2.pointerEvents==='none'&&/(-bg|overlay)/.test(anc.className+' '+anc.id)&&parseFloat(c2.opacity)<1)){hidden=true;break;}anc=anc.parentElement;}if(hidden)return;
    const fg=parse(cs.color);const bg=bgOf(el);if(!fg||!bg)return;const f=fg.a<1?over(fg,bg):fg;const L1=lum([f.r,f.g,f.b]),L2=lum([bg.r,bg.g,bg.b]);const ratio=(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);const fs=parseFloat(cs.fontSize),bold=parseInt(cs.fontWeight)>=700;const large=fs>=24||(fs>=18.66&&bold);const need=large?3:4.5;
    if(ratio<need){const key=(el.className||el.tagName)+'|'+el.textContent.trim().slice(0,20);if(seen.has(key))return;seen.add(key);out.push({r:+ratio.toFixed(2),need,fs:Math.round(fs),t:el.textContent.trim().slice(0,28),cls:(el.className&&el.className.baseVal!==undefined?el.className.baseVal:el.className)+'',fg:cs.color,bg:`rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`});}});
  return out;};
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const all={};
 for(const [t,vp,m] of [['desktop',{width:1440,height:900},false],['phone',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport:vp,isMobile:m,hasTouch:m});await ctx.addInitScript(()=>{localStorage.setItem('kap_onboard_v1','1');['lab','atlas','quest','home'].forEach(k=>localStorage.setItem('kap_coach_'+k,'1'));});
  const p=await ctx.newPage();await p.goto('file://'+page);await p.waitForTimeout(300);
  const step=async(name,fn)=>{await p.evaluate(fn);await p.waitForTimeout(450);const r=await p.evaluate(scan);all[t+':'+name]=r;};
  await step('home',()=>{setLang('zh');goHome();});
  await step('atlas',()=>goView('atlas'));
  await step('quest',()=>goView('quest'));
  await step('progress',()=>goView('progress'));
  await step('lab-plain',()=>{goMain('squat');});
  await step('lab-pro',()=>{document.body.classList.remove('kap-simple');});
  await step('lab-fascia',()=>{document.querySelector('.layerbtn[data-ly="fascia"]').click();});
  await step('lab-bones',()=>{document.querySelector('.layerbtn[data-ly="fascia"]').click();document.querySelector('.layerbtn.bones').click();});
  await step('muscle-detail',()=>{document.querySelector('.layerbtn.bones').click();showMIDetail('quadriceps');});
  await step('massage',()=>{document.querySelector('.mio-tab[data-mt="massage"]')&&document.querySelector('.mio-tab[data-mt="massage"]').click();});
  await step('bone-detail',()=>{closeMIO();showBoneDetail('femur-detail');});
  await step('library',()=>{closeMIO();openLibSheet();});
  await step('toast',()=>{closeLibSheet();showToast('已留下今天的重點，之後可以再回來看。');});
  await step('help',()=>{openHelp();});
  await step('legacy-wiki-entry',()=>{document.getElementById('help-overlay').classList.remove('on');openWiki();});
  await step('legacy-picker-entry',()=>{openExPicker();});
  await ctx.close();}
 let n=0;Object.entries(all).forEach(([k,v])=>{if(v.length){console.log('## '+k+' ('+v.length+')');v.slice(0,8).forEach(x=>console.log('  '+x.r+' (need '+x.need+') '+x.fs+'px "'+x.t+'" '+x.cls.slice(0,40)+' fg '+x.fg+' bg '+x.bg));n+=v.length;}});
 console.log('total low-contrast text items:',n);await b.close();})();
