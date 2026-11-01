const fs=require('fs');
const [,, WORKER, JSFILE]=process.argv;
let w=fs.readFileSync(WORKER,'utf8').split('\n');
const J=s=>'      '+JSON.stringify(s)+',';
const L=(en,zh)=>'<span class="le">'+en+'</span><span class="lz" style="display:none">'+zh+'</span>';
function rep(pred,fn,label){const i=w.findIndex(pred);if(i<0){console.log('SKIP (not found/already): '+label);return false;}fn(i);console.log('ok: '+label);return true;}
const ARROW='<svg class="kap-nav-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
// 1. brand header text
rep(l=>l.includes('<div class="hero-title">KINETIC ANATOMY <b>PRO</b></div>'),i=>{w[i]="      '"+'<div class="hero-title">'+L('Everyday Body Map','身體動作地圖')+'</div>'+"',";},'hero-title');
rep(l=>l.includes('<div class="hero-sub">')&&l.includes('Muscle &amp; Fascia'),i=>{w[i]="      '<div class=\"hero-sub\">KINETIC ANATOMY PRO</div>',";},'hero-sub');
// 2. home body: replace hub-grid..hfoot
const hs=w.findIndex(l=>l.includes('<div class="hub-grid">'));
const hf=w.findIndex(l=>l.includes('<div class="hfoot">'));
if(hs>=0&&hf>hs){
 const card=(k,n,ic,tEn,tZh,sEn,sZh)=>'<button type="button" class="ka-card" data-life="'+k+'"><span class="ka-ic"><svg viewBox="0 0 24 24" aria-hidden="true">'+ic+'</svg></span><span class="ka-tx"><span class="ka-k">'+n+' / 生活動作</span><span class="ka-t">'+L(tEn,tZh)+'</span><span class="ka-s">'+L(sEn,sZh)+'</span></span></button>';
 const html=[
 '<div class="ka-home">',
 ' <div class="ka-top">',
 '  <section class="ka-intro" aria-labelledby="ka-h1">',
 '   <p class="ka-eyebrow">'+L('Start from daily life, get to know your body slowly','從生活開始，慢慢認識身體')+'</p>',
 '   <h1 class="ka-h1" id="ka-h1">'+L('The movements you do every day: how does your body do them?','你每天做的動作，身體是怎麼完成的？')+'</h1>',
 '   <p class="ka-lead">'+L('No need to memorise muscle names first. Pick a familiar movement and we will look at which parts are helping.','不用先記住肌肉的名字。選一個熟悉的動作，我們一起看看，哪些部位正在幫忙。')+'</p>',
 '   <div class="ka-cta"><button type="button" class="ka-btn primary" data-life="squat">'+L('Start with sitting and standing','從坐下、站起來開始')+ARROW+'</button><button type="button" class="ka-btn" data-goview="atlas">'+L('Go straight to the body atlas','直接看身體圖譜')+'</button></div>',
 '  </section>',
 '  <aside class="ka-preview" aria-hidden="true"><span class="ka-chip">'+L('Your body works as a team.','身體，是一起合作的。')+'</span><div id="ka-pv-f"></div><div id="ka-pv-b"></div><span class="ka-note">'+L('General anatomy illustration · not a personal measurement','一般解剖示意・非個人檢測')+'</span></aside>',
 ' </div>',
 ' <div class="ka-sechead"><h2 class="ka-sec">'+L('Start with a familiar movement','先從一個熟悉的動作開始')+'</h2><button type="button" class="ka-link" id="ka-open-lib">'+L('All <span class="ka-nex">40</span> movements','全部 <span class="ka-nex">40</span> 個動作')+'</button></div>',
 ' <div class="ka-life">',
 card('squat','01','<path d="M7 4v9h10M7 13v7M17 13v7M7 9h5"/>','Sit down and stand up','蹲下、坐下與站起來','Start with something you do every day','從你每天會做的動作開始'),
 card('overhead_press','02','<circle cx="12" cy="5" r="2"/><path d="M12 7v7M12 14l-3 6M12 14l3 6M12 9L7 4M12 9l5-5"/>','Reach up for something high','把手舉高、拿高處的東西','See how shoulders and arms work together','看看肩膀與手臂如何一起合作'),
 card('step_up','03','<path d="M4 20h4v-4h4v-4h4V8h4"/>','Climb stairs, step up','上階梯、跨上一個台階','How the legs and hips share the work','認識腿部與臀部的分工'),
 ' </div>',
 ' <div class="ka-row2">',
 '  <button type="button" class="ka-card" data-goview="atlas"><span class="ka-tx"><span class="ka-t">'+L('Want to start with a body part?','想先認識某個部位？')+'</span><span class="ka-s">'+L('Not sure of the name? Find it in the body atlas.','不確定名稱也沒關係，從身體圖譜找起。')+'</span></span><span class="ka-go">'+L('Find a body part','找身體部位')+ARROW+'</span></button>',
 '  <button type="button" class="ka-card" data-goview="progress"><span class="ka-tx"><span class="ka-t">'+L('You got to know your body a bit more today.','今天已經多認識身體一點。')+'</span><span class="ka-s">'+L('Keep what you looked at, at your own pace.','把想再看的內容留下來，照自己的步調。')+'</span></span><span class="ka-go">'+L('My notes','我的重點')+ARROW+'</span></button>',
 ' </div>',
 ' <div class="hub-continue" id="hub-continue">',
 '  <div class="hub-cont-ico">▶</div>',
 '  <div class="hub-cont-txt"><span class="le" id="hub-cont-en"></span><span class="lz" id="hub-cont-zh" style="display:none"></span></div>',
 '  <div class="hub-cont-arrow">›</div>',
 ' </div>',
 ' <div class="ka-foot"><span id="ka-counts"></span><span>'+L('Understand first, then go deeper. Detailed reference opens whenever you want.','先看懂，再慢慢深入。專業資料隨時可展開。')+'</span></div>',
 '</div>'];
 w.splice(hs,hf-hs+1,...html.map(h=>"      '"+h.replace(/\\/g,'\\\\').replace(/'/g,"\\'")+"',"));
 console.log('ok: home body replaced');
} else console.log('SKIP: home body (already replaced?)');
// 3. find button in exercise title bar
if(!w.some(l=>l.includes('id="ext-find"')))rep(l=>l.includes('<button class="ext-nav" id="ext-next"'),i=>{w.splice(i,0,"      '"+'<button type="button" class="ext-find" id="ext-find"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>'+L('Find','找動作')+'</button>'+"',");},'ext-find button');
// 4. library search row + dialog semantics
if(!w.some(l=>l.includes('id=\\"lib-search\\"')))rep(l=>l.includes('<div class=\\"lib-filters\\">'),i=>{w.splice(i,0,
 J('    <div class="lib-search-row">'),
 J('      <label class="lib-search-lb" for="lib-search">'+L('Search movements','搜尋動作')+'</label>'),
 J('      <div class="lib-search-box"><input id="lib-search" type="search" autocomplete="off" enterkeyhint="search" inputmode="search"><button id="lib-search-clear" type="button" aria-label="Clear search">×</button></div>'),
 J('      <div class="lib-count" id="lib-count" aria-live="polite"></div>'),
 J('    </div>'));},'lib search row');
rep(l=>l.includes('<div class=\\"lib-box\\">'),i=>{w[i]=w[i].replace('<div class=\\"lib-box\\">','<div class=\\"lib-box\\" role=\\"dialog\\" aria-modal=\\"true\\" aria-label=\\"Exercise library\\">');},'lib dialog role');
// 5. KAP state
rep(l=>l.includes("var KAP={view:'home',libCat:'all',libEquip:'all',libRegion:'all',pro:false};"),i=>{w[i]=w[i].replace("libRegion:'all',pro:false","libRegion:'all',libQuery:'',pro:false");},'KAP.libQuery');
// 6. filtering includes the query
rep(l=>l.includes('function libFilteredKeys(){')&&!l.includes('libQuery'),i=>{w[i]=w[i].replace("if(!exMatchesRegion(ex,KAP.libRegion))return false;","if(!exMatchesRegion(ex,KAP.libRegion))return false;if(KAP.libQuery&&!kapExMatch(k,KAP.libQuery))return false;");},'libFilteredKeys query');
// 7. grid: count, note, empty state
rep(l=>l.includes("if(!keys.length){grid.innerHTML='<div class='+dq+'lib-empty'+dq+'>'"),i=>{
 w[i]=J("  var cEl=document.getElementById('lib-count');if(cEl)cEl.innerHTML=z?('找到 <b>'+keys.length+'</b> 個動作（共 '+Object.keys(EX).length+' 個）'):('<b>'+keys.length+'</b> of '+Object.keys(EX).length+' movements');");
 w.splice(i+1,0,
 J("  if(!keys.length){var hasQ=!!kapNorm(KAP.libQuery);grid.innerHTML='<div class='+dq+'lib-empty'+dq+'>'+(hasQ?(z?'還沒找到這個名稱。試著用肌肉名稱，或回到身體部位慢慢找。':'Nothing matched yet. Try a muscle name, or browse by body part.'):(z?'沒有符合的動作':'No matching exercises'))+'<br><button type='+dq+'button'+dq+' class='+dq+'ka-btn'+dq+' id='+dq+'lib-clear-all'+dq+'>'+(z?'清除篩選':'Clear filters')+'</button></div>';var ca=document.getElementById('lib-clear-all');if(ca)ca.addEventListener('click',kapLibClearAll);return;}"),
 J("  var noteH=(keys.indexOf(cEx)<0&&kapLibFiltersActive())?'<div class='+dq+'lib-note'+dq+'>'+(z?'目前動作不在結果中；選一個結果之前，上一個／下一個仍使用完整列表。':'Your current movement is not in these results; previous/next keep using the full list until you pick one.')+'</div>':'';"));
},'grid count/empty');
rep(l=>l.includes("grid.innerHTML=keys.map(function(k){var ex=EX[k];")&&!l.includes('noteH'),i=>{w[i]=w[i].replace("grid.innerHTML=keys.map(function(k){var ex=EX[k];","grid.innerHTML=noteH+keys.map(function(k){var ex=EX[k];");},'grid note');
// 8. sheet wiring
rep(l=>l.includes('function buildLibSheet(){buildLibFilters();buildLibGrid();}'),i=>{w[i]=J("function buildLibSheet(){buildLibFilters();var si=document.getElementById('lib-search');if(si){si.value=KAP.libQuery||'';si.placeholder=zh()?'輸入動作名稱，例如：深蹲、階梯、跑步':'Type a movement, e.g. squat, stairs, running';if(!si._kb){si._kb=1;si.addEventListener('input',function(){KAP.libQuery=this.value;kapLibSyncClear();buildLibGrid();});si.addEventListener('keydown',function(e){if(e.key==='Escape'&&this.value){this.value='';KAP.libQuery='';kapLibSyncClear();buildLibGrid();e.preventDefault();e.stopPropagation();}});}var cb=document.getElementById('lib-search-clear');if(cb&&!cb._kb){cb._kb=1;cb.addEventListener('click',function(){KAP.libQuery='';si.value='';kapLibSyncClear();buildLibGrid();si.focus();});}}kapLibSyncClear();buildLibGrid();}");},'buildLibSheet');
rep(l=>l.includes("function openLibSheet(){buildLibSheet();document.getElementById('lib-sheet').classList.add('on');}"),i=>{w[i]=J("function openLibSheet(){if(!KAP._libTrigger)KAP._libTrigger=document.activeElement;buildLibSheet();document.getElementById('lib-sheet').classList.add('on');if(!('ontouchstart' in window)){var si=document.getElementById('lib-search');if(si)setTimeout(function(){si.focus();},60);}}");},'openLibSheet');
rep(l=>l.includes("function closeLibSheet(){document.getElementById('lib-sheet').classList.remove('on');}"),i=>{w[i]=J("function closeLibSheet(){document.getElementById('lib-sheet').classList.remove('on');var t=KAP._libTrigger;KAP._libTrigger=null;if(t&&t.focus&&document.body.contains(t))try{t.focus();}catch(e){}}");},'closeLibSheet');
// ext-find + title count suffix
rep(l=>l.includes("var extInfoBtn=document.getElementById('ext-info-btn');if(extInfoBtn)extInfoBtn.addEventListener('click',openLibSheet);")&&!l.includes('ext-find'),i=>{w[i]=w[i]+'\n'+J("var extFindBtn=document.getElementById('ext-find');if(extFindBtn)extFindBtn.addEventListener('click',function(){KAP._libTrigger=this;openLibSheet();});");},'ext-find handler');
rep(l=>l.includes("cnt.textContent=(i+1)+' / '+ks.length;"),i=>{w[i]=w[i].replace("cnt.textContent=(i+1)+' / '+ks.length;","cnt.textContent=(i+1)+' / '+ks.length+(ks.length<Object.keys(EX).length?(zh()?' · 篩選中':' · filtered'):'');");},'title count suffix');
// 9. keyboard fixes
rep(l=>l.includes("document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMd();var ks=Object.keys(EX);"),i=>{w[i]=J("document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeMd();var ls=document.getElementById('lib-sheet');if(ls&&ls.classList.contains('on'))closeLibSheet();}});");},'old unfiltered arrow handler removed');
rep(l=>l.includes("if(e.key==='?'||(e.key==='/'&&e.shiftKey)){openHelp();return;}"),i=>{w[i]=J("  var t0=e.target;if(t0&&(t0.tagName==='INPUT'||t0.tagName==='TEXTAREA'||t0.isContentEditable))return;if(e.key==='?'||(e.key==='/'&&e.shiftKey)){openHelp();return;}");},'help key guard');
// 9b. first visit: in-place hint instead of the forced 60s tour (tour stays reachable from the home link / help)
rep(l=>l.includes("if(!seen)setTimeout(function(){if(typeof KAP==='undefined'||KAP.view==='home')startOnboarding(false);},600);"),i=>{w[i]=J("  /* coach tip instead of the forced tour: skippable, in place, never replays once dismissed */")+'\n'+J("  if(!seen)setTimeout(function(){if(typeof coachMark==='function'&&(typeof KAP==='undefined'||KAP.view==='home'))coachMark('home',zh()?'選一個熟悉的動作開始，不用先記住肌肉名稱。':'Pick a familiar movement to begin. No need to know muscle names.','.ka-cta .primary');},900);");},'first-visit coach tip');
// 10. JS functions + init
const js=fs.readFileSync(JSFILE,'utf8').replace(/\s+$/,'').split('\n').map(J);
let a=w.findIndex(l=>l.includes('KA-UI-V2 Step 03: home + library search'));
if(a>=0){let e=w.findIndex((l,i)=>i>a&&l.includes('/KA-UI-V2 Step 03 end'));if(e<0){/* no end marker: replace by function span */e=a+js.length-1;} w.splice(a,e-a+1,...js);}
else{const i=w.findIndex(l=>l.includes('KA-UI-V2: one route table'));w.splice(i,0,...js);}
rep(l=>l.trim()==='"kapSyncNav();",',i=>{if(!w.slice(i,i+3).some(x=>x.includes('kapHomeInit')))w.splice(i+1,0,J("setTimeout(kapHomeInit,0);"));},'kapHomeInit call');
fs.writeFileSync(WORKER,w.join('\n'));
