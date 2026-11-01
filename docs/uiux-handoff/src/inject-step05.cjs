const fs=require('fs');const [,, WORKER, JSFILE]=process.argv;
let w=fs.readFileSync(WORKER,'utf8').split('\n');const J=s=>'      '+JSON.stringify(s)+',';
const q=h=>"      '"+h.replace(/\\/g,'\\\\').replace(/'/g,"\\'")+"',";
const L=(en,zh)=>'<span class="le">'+en+'</span><span class="lz" style="display:none">'+zh+'</span>';
function find(pred){return w.findIndex(pred);}
function step(label,ok){console.log((ok?'ok: ':'SKIP: ')+label);}
// ---- HTML ----
let i=find(l=>l.includes('class="pro-toggle"')&&!l.includes('ka-depth'));
if(i>=0){w[i]=q('<div class="pro-toggle"><span class="pro-toggle-label">'+L('READING','閱讀方式')+'</span><div class="ka-depth" role="group" aria-label="Reading depth"><button type="button" data-depth="plain" aria-pressed="true">'+L('Plain','白話說明')+'</button><button type="button" data-depth="pro" aria-pressed="false">'+L('Detailed','專業資料')+'</button></div><button class="pro-switch" id="pro-switch" aria-hidden="true" tabindex="-1"></button></div>');}step('reading-depth control',i>=0);
i=find(l=>l.includes('id="rp-collapse-btn"')&&!w[find(x=>x.includes('id="rp-collapse-btn"'))+1].includes('ka-sheet-head'));
if(i>=0){w.splice(i+1,0,q('<div class="ka-sheet-head"><span class="ka-sheet-title">'+L('See how the body works together','一起看看身體怎麼合作')+'</span><button type="button" id="ka-sheet-close" aria-label="Close">\u2715</button></div>'));}step('sheet header',i>=0);
i=find(l=>l.includes('<div class="ps" id="ps-analysis">')&&!w[find(x=>x.includes('<div class="ps" id="ps-analysis">'))+1].includes('ka-plain'));
if(i>=0){w.splice(i+1,0,q('<div class="sec ka-plain" id="ka-plain"></div>'));}step('plain section',i>=0);
let n=0;w=w.map(l=>{if(l.includes('<div class="sec"><div class="st"><span class="le">ANALYSIS</span>')){n++;return l.replace('<div class="sec">','<div class="sec pro-only">');}
 if(l.includes('<div class="sec"><div class="st"><span class="le">MUSCLE RELATIONS</span>')){n++;return l.replace('<div class="sec">','<div class="sec pro-only">');}
 if(l.includes('<div class="sec sec-recovery">')){n++;return l.replace('<div class="sec sec-recovery">','<div class="sec sec-recovery pro-only">');}return l;});step('pro-only sections ('+n+')',n>0);
// ---- detail sheets ----
function region(startPred){const s=find(startPred);if(s<0)return null;let e=s+1;while(e<w.length&&w[e]!=='      "}",')e++;return[s,e];}
const mi=region(l=>l.includes('"function showMIDetail(slug) {"')),bo=region(l=>l.includes('"function showBoneDetail(slug) {"'));
function patchRegion(r,fn){if(!r)return;for(let k=r[0];k<=r[1];k++)w[k]=fn(w[k]);}
const recolor=l=>l.replace(/isHead\?'#2c3d61':'#1a2840'/g,"isHead?'#B7C2B2':'#C9D1C5'").replace(/isHead\?'#4e6b99':'#2e4068'/g,"isHead?'#fff':'#fff'").replace(/<animate[^>]*?\/>/g,'').replace(/#ff6b35/g,'#906A25').replace(/#00ff88/g,'#24554D').replace(/filter=\\"url\(#glow\)\\"/g,'display=\\"none\\"');
patchRegion(mi,recolor);patchRegion(bo,recolor);
patchRegion(mi,l=>l.replace("function buildMuscleSVG(vb, highlightPaths, bgColor, showMarkers, originData, insertData) {","function buildMuscleSVG(vb, highlightPaths, bgColor, showMarkers, originData, insertData) { bgColor='#B7523B';"));
patchRegion(bo,l=>l.replace("var hlCol=bp4.color||'#e8d5b7';","var hlCol='#8A6F4D';").replace(/fill=\\"#0a1628\\"/g,'fill=\\"#E8EFE9\\"'));
step('detail illustrations recoloured, animation and glow removed',!!mi&&!!bo);
if(mi&&!w.slice(mi[0],mi[1]).some(l=>l.includes('ka-life-box'))){
 const a=find(l=>l.includes("h+=row('Origin'")),b=find(l=>l.includes("h+=row('Insertion'")),c=find(l=>l.includes("h+=row('Action'")),d=find(l=>l.includes("h+=row('Nerve'"));
 if([a,b,c,d].every(x=>x>=0)){const life=J("  var dailyTxt=daily?String(daily).split(/[\\uff0c,\\u3001]/).map(function(t){return t.trim();}).filter(Boolean).join('\\u3001'):'';var srcZh=(!z&&dailyTxt&&/[\\u4e00-\\u9fff]/.test(dailyTxt));h+='<div class='+dq+'ka-life-box'+dq+'><h4>'+(z?'\\u5b83\\u548c\\u4f60\\u7684\\u751f\\u6d3b\\u6709\\u4ec0\\u9ebc\\u95dc\\u4fc2\\uff1f':'How does it show up in everyday life?')+'</h4><p>'+(dailyTxt||(z?'\\u539f\\u8cc7\\u6599\\u5eab\\u6c92\\u6709\\u9019\\u689d\\u808c\\u8089\\u7684\\u65e5\\u5e38\\u7528\\u9014\\u3002':'The original data has no everyday-use text for this muscle.'))+'</p>'+(srcZh?'<small>Source text (Chinese)</small>':'')+'</div>';");
  const rows=[c,a,b,d].map(x=>w[x]);const lo=Math.min(a,b,c,d);for(const x of [a,b,c,d])w[x]=null;w[lo]=[life].concat(rows).join('\n');w=w.filter(x=>x!==null);console.log('ok: life box first, action before origin/insertion/nerve');}}
else console.log('SKIP: life box');
if(!w.some(l=>l.includes('ka-foot-note')&&l.includes('showMI'))){const f=find(l=>l.includes("if(fun) h+='<div class=' + dq + 'mio-fact'"));if(f>=0){w.splice(f+1,0,J("  h+='<p class='+dq+'ka-foot-note'+dq+'>'+(z?'\\u6b64\\u9801\\u70ba\\u89e3\\u5256\\u5b78\\u7fd2\\u8cc7\\u6599\\uff0c\\u6c92\\u6709\\u5224\\u65b7\\u4f60\\u7684\\u75bc\\u75db\\u539f\\u56e0\\u3002':'Anatomy study material. It does not explain the cause of your pain.')+'</p>'; /* showMI */"));console.log('ok: not-a-diagnosis footer');}}
// massage: contraindications before techniques
{const th=find(l=>l.includes("Massage Techniques")),ch=find(l=>l.includes("Contraindications")&&l.includes("mio-sec"));
 if(th>=0&&ch>th&&!w[ch].includes('Before you start')){let te=th+1;while(!/^\s*"    \}\);",$/.test(w[te]))te++;let ce=ch+1;while(!/^\s*"    \}\);",$/.test(w[ce]))ce++;
  const tech=w.slice(th,te+1),contra=w.slice(ch,ce+1).map((l,k)=>k===0?l.replace("'\\u7981\\u5fcc\\u8b49':'Contraindications'","'\\u6ce8\\u610f\\u4e8b\\u9805\\u8207\\u7981\\u5fcc':'Before you start: contraindications'"):l);
  const note=J("    h+='<p class='+dq+'ka-foot-note'+dq+'>'+(z?'\\u4ee5\\u4e0b\\u70ba\\u539f\\u8cc7\\u6599\\u4e2d\\u7684\\u64cd\\u4f5c\\u8aaa\\u660e\\uff0c\\u4e0d\\u662f\\u91dd\\u5c0d\\u4f60\\u500b\\u4eba\\u7684\\u8655\\u65b9\\u3002':'The steps below are the original teaching text, not a prescription for you.')+'</p>';");
  w.splice(th,ce-th+1,...contra,note,...tech);console.log('ok: massage contraindications first');}else console.log('SKIP: massage reorder');}
// ---- JS module ----
const js=fs.readFileSync(JSFILE,'utf8').replace(/\s+$/,'').split('\n').map(J);
let a2=find(l=>l.includes('KA-UI-V2 Step 05: plain-language layer'));
if(a2>=0){let e=find2(a2);function find2(s){return w.findIndex((l,k)=>k>s&&l.includes('KA-UI-V2 Step 05 end'));}w.splice(a2,e-a2+1,...js);console.log('ok: module replaced');}
else{const k=find(l=>l.includes('function mountSkeleton(){'));w.splice(k,0,...js);console.log('ok: module inserted');}
fs.writeFileSync(WORKER,w.join('\n'));
