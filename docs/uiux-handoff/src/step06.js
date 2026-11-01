/* == KA-UI-V2 Step 06: full atlas, free practice + original challenges, my takeaways == */
function kapEsc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function kapT(a,b){return zh()?a:b;}
/* ---- local storage with an in-memory fallback (blocked storage must not break reading) ---- */
function kapStorageOK(){try{var k='kap_probe';localStorage.setItem(k,'1');localStorage.removeItem(k);return true;}catch(e){return false;}}
(function(){var base=kapUiRead;
 kapUiRead=function(){var o=null,failed=false;try{o=JSON.parse(localStorage.getItem('kap_ui_v2')||'null');}catch(e){failed=true;}
  if(!(o&&o.schemaVersion===1&&o.favorites)){o=KAP._uiMem?KAP._uiMem:base();}
  o.favorites=o.favorites||{};['exercises','muscles','bones'].forEach(function(k){if(!Array.isArray(o.favorites[k]))o.favorites[k]=[];});return o;};
 var w=kapUiWrite;kapUiWrite=function(o){var done=w(o);KAP._uiMem=done?null:o;return done;};})();
function kapFavMsg(r){var z=zh();return r==='ok'?(z?'已留下今天的重點，之後可以再回來看。':'Saved to My notes. You can come back to it later.'):r==='dup'?(z?'已經在「我的重點」裡了。':'It is already in My notes.'):(z?'本次暫時無法保存，但你可以繼續閱讀。':'Could not save this time, but you can keep reading.');}
function kapFavStruct(type,slug){var o=kapUiRead();var k=type==='bone'?'bones':'muscles';if(o.favorites[k].indexOf(slug)>=0)return'dup';o.favorites[k].push(slug);return kapUiWrite(o)?'ok':'fail';}
function kapUnfav(kind,id){var o=kapUiRead();var a=o.favorites[kind];var i=a.indexOf(id);if(i>=0)a.splice(i,1);return kapUiWrite(o);}
function kapIsFavStruct(type,slug){return kapUiRead().favorites[type==='bone'?'bones':'muscles'].indexOf(slug)>=0;}

/* ================= BODY ATLAS ================= */
var KAP_AT_GROUPS={
 muscle:[{id:'headneck',zh:'頭頸',en:'Head & neck',regs:['head','neck']},{id:'upper',zh:'上肢',en:'Upper limb',regs:['shoulder','upper_arm','forearm','hand']},{id:'trunk',zh:'軀幹',en:'Trunk',regs:['chest','back','core']},{id:'lower',zh:'下肢',en:'Lower limb',regs:['hip','thigh','lower_leg','foot']}],
 bone:[{id:'skullspine',zh:'頭顱與脊柱',en:'Skull & spine',regs:['head','neck','thorax']},{id:'upper',zh:'上肢',en:'Upper limb',regs:['shoulder','upper_arm','forearm','hand']},{id:'pelvis',zh:'腰椎與骨盆',en:'Lumbar & pelvis',regs:['lumbar','pelvis']},{id:'lower',zh:'下肢',en:'Lower limb',regs:['thigh','knee','lower_leg','foot']}]};
var KAP_AT_REGN={head:['頭部','Head'],neck:['頸部','Neck'],shoulder:['肩帶','Shoulder'],upper_arm:['上臂','Upper arm'],forearm:['前臂','Forearm'],hand:['手部','Hand'],chest:['胸部','Chest'],back:['背部','Back'],core:['腰腹核心','Core'],hip:['髖部','Hip'],thigh:['大腿','Thigh'],lower_leg:['小腿','Lower leg'],foot:['足部','Foot'],thorax:['胸廓','Thorax'],lumbar:['腰椎','Lumbar'],pelvis:['骨盆','Pelvis'],knee:['膝','Knee']};
/* explicit life-word aliases: structure / everyday-description words only (no symptoms, no diagnosis) */
var KAP_AT_ALIAS={
 gluteal:['屁股','臀部','坐下站起','站起來','起身','爬樓梯','glutes'],quadriceps:['大腿前側','大腿前面','上下樓梯','下樓梯','站起來','蹲下','quads'],hamstring:['大腿後側','大腿後面','後大腿','彎腰','走路','hamstrings'],
 calves:['小腿肚','小腿','踮腳','calf'],soleus:['小腿肚','踮腳','站立'],tibialis:['小腿前側','腳尖抬起','shin'],abs:['肚子','腹部','六塊肌','腹肌','起身','core'],obliques:['側腹','腰側','轉身','扭腰'],
 'lower-back':['下背','腰部','挺直','彎腰','erector'],'upper-back':['背部','拉','引體向上','lats'],trapezius:['肩頸','上背','聳肩'],deltoids:['肩膀','舉手','把手舉高','拿高處','抬手'],
 chest:['胸','胸肌','推','伏地挺身','pecs'],biceps:['上臂前側','提東西','拿重物'],triceps:['上臂後側','手臂伸直','撐起'],scm:['脖子','頸部側面','轉頭','低頭'],
 iliopsoas:['髖屈肌','抬腿','走路抬腳','髖前側','hip flexor'],adductors:['大腿內側','夾腿','內收'],'glute-medius':['髖外側','單腳站','走路穩定','側臀'],tfl:['髖外側','大腿外側'],'it-band':['大腿外側'],
 fds:['握','抓握','握東西','手指彎'],fdp:['握','抓握','手指彎'],edc:['手指伸直','打字'],'pronator-teres':['轉手心','前臂旋轉'],supinator:['轉手心朝上','前臂旋轉'],brachioradialis:['前臂','提東西'],
 diaphragm:['呼吸','深呼吸','橫膈'],intercostals:['呼吸','肋骨之間'],masseter:['咬','咀嚼','嚼東西'],temporalis:['咬','咀嚼','太陽穴'],'plantar-fascia':['腳底','足弓','腳掌'],piriformis:['臀部深層','屁股深層'],
 serratus:['肩胛','前鋸'],rhomboids:['肩胛之間','夾背','拉肩胛'],'rectus-femoris':['大腿前側','抬腿'],sartorius:['盤腿','翹腳'],popliteus:['膝後','膝蓋後面'],
 'cervical-spine':['脖子骨','頸'],'lumbar-vertebrae':['腰','下背骨'],'ribs-detail':['肋骨','胸腔'],'sacrum-detail':['薦骨','尾椎上方'],coccyx:['尾椎','尾巴骨'],'patella-detail':['膝蓋骨','膝蓋'],'calcaneus-detail':['腳跟','腳跟骨'],
 'clavicle-detail':['鎖骨'],'scapula-detail':['肩胛骨','肩膀後面的骨頭'],mandible:['下巴','下顎'],hyoid:['喉嚨的骨頭'],'ilium-detail':['髖骨','骨盆'],'carpal-bones':['手腕'],'phalanges-hand':['手指'],'phalanges-foot':['腳趾'],'humerus-detail':['上臂骨','手臂骨'],'femur-detail':['大腿骨'],'tibia-detail':['小腿骨','脛骨']};
function kapMuscleHasMap(slug){var e=(typeof EXTRA_MUSCLE_PATHS!=='undefined'&&EXTRA_MUSCLE_PATHS[slug])||(typeof EXTRA_MUSCLE_PATHS_2!=='undefined'&&EXTRA_MUSCLE_PATHS_2[slug])||(typeof EXTRA_MUSCLE_PATHS_3!=='undefined'&&EXTRA_MUSCLE_PATHS_3[slug]);if(e)return true;var bp=(typeof BODY_PATHS!=='undefined'&&BODY_PATHS.maleFront)||[];return bp.some(function(p){return p.slug===slug;});}
function kapBoneHasMap(slug){return !!((typeof BONE_PATHS!=='undefined'&&BONE_PATHS[slug])||(typeof BONE_PATHS_2!=='undefined'&&BONE_PATHS_2[slug]));}
KAP.at={cat:'muscle',q:'',region:'all'};var KAP_AT_CACHE={};
function kapAtItems(cat){if(KAP_AT_CACHE[cat])return KAP_AT_CACHE[cat];var out=[],i;
 if(cat==='muscle'){var M=questDB();Object.keys(M).forEach(function(s){var m=M[s];if(!m||!m.zh)return;out.push({type:'muscle',slug:s,zh:m.zh,en:m.en||s,region:m.region,txt:m.daily||'',map:kapMuscleHasMap(s),massage:!!(typeof MASSAGE_DB!=='undefined'&&MASSAGE_DB[s])});});}
 else{var B=atlasBonesDB();Object.keys(B).forEach(function(s){var b=B[s];if(!b||!b.zh)return;out.push({type:'bone',slug:s,zh:b.zh,en:b.en||s,region:b.region,txt:b.desc||'',map:kapBoneHasMap(s)});});}
 return(KAP_AT_CACHE[cat]=out);}
function kapAtHay(it){if(it._h)return it._h;var rn=KAP_AT_REGN[it.region]||['',''];return(it._h={name:kapNorm([it.zh,it.en,it.slug.replace(/-/g,' ')].join(' ')),alias:kapNorm((KAP_AT_ALIAS[it.slug]||[]).join(' ')),other:kapNorm([rn[0],rn[1],it.txt].join(' '))});}
function kapAtScore(it,q){var h=kapAtHay(it),s=0;var terms=q.split(' ');for(var i=0;i<terms.length;i++){var t=terms[i];if(!t)continue;if(h.name.indexOf(t)>=0)s+=0;else if(h.alias.indexOf(t)>=0)s+=1;else if(h.other.indexOf(t)>=0)s+=2;else return -1;}return s;}
function kapAtFiltered(){var st=KAP.at,all=kapAtItems(st.cat),q=kapNorm(st.q),regs=null;
 if(st.region!=='all'){if(st.region.indexOf('g:')===0){var g=KAP_AT_GROUPS[st.cat].filter(function(x){return x.id===st.region.slice(2);})[0];regs=g?g.regs:[];}else regs=[st.region];}
 var res=[];all.forEach(function(it,i){if(regs&&regs.indexOf(it.region)<0)return;var sc=q?kapAtScore(it,q):0;if(sc<0)return;res.push({it:it,sc:sc,i:i});});
 if(q)res.sort(function(a,b){return a.sc-b.sc||a.i-b.i;});return res.map(function(r){return r.it;});}
function kapAtlasMount(){var v=document.getElementById('view-atlas');if(!v||v._ka)return;v._ka=1;
 v.innerHTML='<div class="ka-at" id="ka-at"><header class="ka-pg-head"><span class="ka-eyebrow" id="ka-at-eyebrow"></span><h2 class="ka-pg-h" id="ka-at-h"></h2><p class="ka-pg-sub" id="ka-at-sub"></p></header>'
 +'<div class="ka-at-body"><aside class="ka-at-rail"><div class="ka-at-tabs" role="tablist" id="ka-at-tabs"></div><label class="ka-at-sel"><span id="ka-at-sel-l"></span><select id="ka-at-sel"></select></label><nav class="ka-at-regs" id="ka-at-regs" aria-label="Body regions"></nav></aside>'
 +'<section class="ka-at-main"><div class="ka-at-searchrow"><input type="search" id="ka-at-q" autocomplete="off" enterkeyhint="search"><button type="button" class="ka-at-clear" id="ka-at-clear"></button></div><p class="ka-at-count" id="ka-at-count" role="status" aria-live="polite"></p><div class="ka-at-grid" id="ka-at-grid"></div><p class="ka-at-foot" id="ka-at-foot"></p></section></div></div>';
 var q=document.getElementById('ka-at-q');q.addEventListener('input',function(){KAP.at.q=this.value;kapAtlasRender(true);});
 document.getElementById('ka-at-clear').addEventListener('click',function(){KAP.at.q='';q.value='';kapAtlasRender(true);q.focus();});
 document.getElementById('ka-at-sel').addEventListener('change',function(){KAP.at.region=this.value;kapAtlasRender(true);});
 document.getElementById('ka-at-tabs').addEventListener('click',function(e){var b=e.target.closest('[data-cat]');if(!b)return;KAP.at.cat=b.dataset.cat;KAP.at.region='all';kapAtlasRender(true);});
 document.getElementById('ka-at-regs').addEventListener('click',function(e){var b=e.target.closest('[data-region]');if(!b)return;KAP.at.region=b.dataset.region;kapAtlasRender(true);});
 document.getElementById('ka-at-grid').addEventListener('click',function(e){var c=e.target.closest('[data-at]');if(c)kapAtOpen(c.dataset.at.split(':')[0],c.dataset.at.slice(c.dataset.at.indexOf(':')+1),c);else{var b=e.target.closest('[data-atact]');if(!b)return;if(b.dataset.atact==='clear'){KAP.at.q='';q.value='';kapAtlasRender(true);q.focus();}else{var s=document.getElementById('ka-at-sel');var r=document.querySelector('#ka-at-regs button');var t=(s&&s.offsetParent!==null)?s:r;if(t)t.focus();}}});}
function kapAtOpen(type,slug,trig){KAP._detailTrigger=trig||document.activeElement;if(type==='bone')showBoneDetail(slug);else showMIDetail(slug);}
function kapAtlasRender(keepFocus){kapAtlasMount();var z=zh(),st=KAP.at,cat=st.cat;
 var eb=document.getElementById('ka-at-eyebrow');if(!eb)return;eb.textContent='身體圖譜';document.getElementById('ka-at-h').textContent=z?'先找到你想認識的部位':'Find the part you want to know';
 document.getElementById('ka-at-sub').textContent=z?'中文、英文或生活用詞都可以搜尋。先看它和生活的關係，再展開解剖資料。':'Search by Chinese, English or an everyday word. Start with how it relates to daily life, then open the anatomy.';
 var nM=kapAtItems('muscle').length,nB=kapAtItems('bone').length;
 document.getElementById('ka-at-tabs').innerHTML=[['muscle',z?'肌肉':'Muscles',nM],['bone',z?'骨骼':'Bones',nB]].map(function(t){return '<button type="button" role="tab" class="ka-at-tab'+(cat===t[0]?' on':'')+'" data-cat="'+t[0]+'" aria-selected="'+(cat===t[0])+'">'+t[1]+' <small>'+t[2]+'</small></button>';}).join('');
 var groups=KAP_AT_GROUPS[cat],all=kapAtItems(cat);var cnt=function(regs){return all.filter(function(i){return regs.indexOf(i.region)>=0;}).length;};
 var rh='<button type="button" class="ka-at-reg'+(st.region==='all'?' on':'')+'" data-region="all" aria-pressed="'+(st.region==='all')+'">'+(z?'全部部位':'All regions')+'<small>'+all.length+'</small></button>',so='<option value="all">'+(z?'全部部位':'All regions')+' ('+all.length+')</option>';
 groups.forEach(function(g){var gid='g:'+g.id;rh+='<button type="button" class="ka-at-reg grp'+(st.region===gid?' on':'')+'" data-region="'+gid+'" aria-pressed="'+(st.region===gid)+'">'+(z?g.zh:g.en)+'<small>'+cnt(g.regs)+'</small></button>';so+='<option value="'+gid+'"'+(st.region===gid?' selected':'')+'>'+(z?g.zh:g.en)+' ('+cnt(g.regs)+')</option>';
  g.regs.forEach(function(r){var n=cnt([r]);if(!n)return;rh+='<button type="button" class="ka-at-reg sub'+(st.region===r?' on':'')+'" data-region="'+r+'" aria-pressed="'+(st.region===r)+'">'+(z?KAP_AT_REGN[r][0]:KAP_AT_REGN[r][1])+'<small>'+n+'</small></button>';so+='<option value="'+r+'"'+(st.region===r?' selected':'')+'>　'+(z?KAP_AT_REGN[r][0]:KAP_AT_REGN[r][1])+' ('+n+')</option>';});});
 document.getElementById('ka-at-regs').innerHTML=rh;var sel=document.getElementById('ka-at-sel');sel.innerHTML=so;sel.value=st.region;document.getElementById('ka-at-sel-l').textContent=z?'依部位瀏覽':'Browse by region';
 var qi=document.getElementById('ka-at-q');qi.placeholder=cat==='muscle'?(z?'搜尋肌肉或生活用詞':'Search muscles or everyday words'):(z?'搜尋骨骼':'Search bones');qi.setAttribute('aria-label',cat==='muscle'?(z?'搜尋肌肉：中文、英文或生活用詞，例如大腿、Quadriceps、站起來':'Search muscles by Chinese or English name or an everyday word, e.g. thigh, Quadriceps, stand up'):(z?'搜尋骨骼：中文或英文，例如股骨、Femur、膝蓋':'Search bones, e.g. femur, knee'));if(qi.value!==st.q)qi.value=st.q;
 var cl=document.getElementById('ka-at-clear');cl.textContent=z?'清除':'Clear';cl.style.visibility=st.q?'visible':'hidden';
 var list=kapAtFiltered(),grid=document.getElementById('ka-at-grid');
 document.getElementById('ka-at-count').textContent=z?('顯示 '+list.length+' / '+all.length+' 筆'+(cat==='muscle'?'肌肉':'骨骼')):('Showing '+list.length+' of '+all.length+(cat==='muscle'?' muscles':' bones'));
 if(!list.length){grid.innerHTML='<div class="ka-at-empty"><b>'+(z?'還沒找到「'+kapEsc(st.q)+'」。':'Nothing found for "'+kapEsc(st.q)+'".')+'</b><p>'+(z?'試試肌肉名稱（中英文都可以），或用生活用詞，例如「站起來」「拿高處」。':'Try a muscle name in Chinese or English, or an everyday word such as "stairs".')+'</p><div class="ka-at-empty-act"><button type="button" class="ka-btn" data-atact="clear">'+(z?'清除搜尋':'Clear search')+'</button><button type="button" class="ka-btn" data-atact="region">'+(z?'依部位找':'Browse by region')+'</button></div></div>';}
 else grid.innerHTML=list.map(function(it){var rn=KAP_AT_REGN[it.region]||['',''];var name=z?it.zh:it.en,sub=z?it.en:it.zh;
  var txt=it.txt?String(it.txt):'';if(txt.length>34)txt=txt.slice(0,34)+'…';var lbl=it.type==='muscle'?(z?'日常':'Daily'):(z?'簡介':'About');
  var tags='<span class="ka-tag">'+(z?rn[0]:rn[1])+'</span>'+(it.map?'':'<span class="ka-tag warn">'+(z?'此構造暫無互動圖':'No interactive map yet')+'</span>');
  return '<button type="button" class="ka-at-card" data-at="'+it.type+':'+kapEsc(it.slug)+'"><span class="ka-at-n">'+kapEsc(name)+'</span><span class="ka-at-e">'+kapEsc(sub)+'</span><span class="ka-at-t">'+tags+'</span>'+(txt?'<span class="ka-at-d"><b>'+lbl+'</b> '+kapEsc(txt)+(z?'':' <i>(中文原文)</i>')+'</span>':'')+'</button>';}).join('');
 var noMap=all.filter(function(i){return !i.map;}).length;document.getElementById('ka-at-foot').textContent=z?('資料範圍：'+nM+' 筆肌肉、'+nB+' 筆骨骼構造；其中 '+kapAtItems('muscle').filter(function(i){return !i.map;}).length+' 筆肌肉與 '+kapAtItems('bone').filter(function(i){return !i.map;}).length+' 筆骨骼暫無互動圖，仍可閱讀文字說明。'):('Data scope: '+nM+' muscles and '+nB+' bone structures; '+kapAtItems('muscle').filter(function(i){return !i.map;}).length+' muscles and '+kapAtItems('bone').filter(function(i){return !i.map;}).length+' bones have no interactive map yet, but their text is readable. Source text is Chinese.');}
buildAtlas=function(){kapAtlasMount();kapAtlasRender();};
atlasOpen=function(slug){goView('atlas');KAP.at.cat='muscle';KAP.at.region='all';KAP.at.q='';kapAtlasRender();if(slug)setTimeout(function(){var c=document.querySelector('#ka-at-grid [data-at="muscle:'+slug+'"]');KAP._detailTrigger=c||null;showMIDetail(slug);},80);};

/* ---- detail sheets: order, missing map, missing massage, favourite button, load error ---- */
function kapDetailError(type,slug,err){var z=zh();var c=document.getElementById('muscle-overlay-content'),ov=document.getElementById('muscle-overlay');if(!c||!ov)return;
 var DB=type==='bone'?atlasBonesDB():questDB(),d=DB[slug]||{};var txt=type==='bone'?[d.desc,d.landmarks,d.joints]:[d.action,d.origin&&((z?'起點：':'Origin: ')+d.origin),d.insert&&((z?'止點：':'Insertion: ')+d.insert),d.daily];
 c.innerHTML='<div class="mio-head"><div><div class="mio-name">'+kapEsc(z?d.zh||slug:d.en||slug)+'</div><div class="mio-ename">'+kapEsc(z?d.en||'':d.zh||'')+'</div></div><button class="mio-close" onclick="closeMIO()" aria-label="Close">✕</button></div><div class="mio-panel on"><div class="ka-err"><b>'+(z?'這個圖譜沒有順利載入。':'The atlas drawing did not load.')+'</b><p>'+(z?'你可以再試一次，或先用文字內容認識它。':'You can try again, or read the text below first.')+'</p><button type="button" class="ka-btn" id="ka-err-retry">'+(z?'再試一次':'Try again')+'</button></div>'+txt.filter(Boolean).map(function(t){return '<div class="mio-txt">'+kapEsc(t)+'</div>';}).join('')+'</div>';
 ov.classList.add('on');var rb=document.getElementById('ka-err-retry');if(rb)rb.addEventListener('click',function(){try{(type==='bone'?_kapSBD:_kapSMD).call(window,slug);kapDetailPost(type,slug);}catch(e){kapDetailError(type,slug,e);}});}
function kapDetailPost(type,slug){var z=zh();var c=document.getElementById('muscle-overlay-content');if(!c)return;var head=c.querySelector('.mio-head');if(!head)return;
 if(c.firstElementChild!==head)c.insertBefore(head,c.firstChild);
 /* favourite button */
 if(!head.querySelector('.ka-fav-st')){var b=document.createElement('button');b.type='button';b.className='ka-fav-st';var sync=function(){var on=kapIsFavStruct(type,slug);b.setAttribute('aria-pressed',on?'true':'false');b.classList.toggle('on',on);b.textContent=on?(z?'已留下':'Saved'):(z?'留下重點':'Keep');b.setAttribute('aria-label',z?'把這個構造留在我的重點':'Keep this structure in My notes');};sync();
  b.addEventListener('click',function(){showToast(kapFavMsg(kapFavStruct(type,slug)));sync();});var cl=head.querySelector('.mio-close');head.insertBefore(b,cl);}
 var hasMap=type==='bone'?kapBoneHasMap(slug):kapMuscleHasMap(slug);
 if(!hasMap){var w=c.querySelector('.mio-img-wrap');var note='<div class="ka-nomap"><b>'+(z?'此構造暫無互動圖':'No interactive map for this structure yet')+'</b><span>'+(z?'名稱和文字說明都在下面；我們不拿鄰近的肌肉或骨骼來冒充它。':'Its name and text are below. We do not borrow a neighbouring structure to stand in for it.')+'</span></div>';
  if(w){var h=c.querySelector('.mio-map-hint');w.insertAdjacentHTML('beforebegin',note);w.remove();if(h)h.remove();var lg=c.querySelector('.mio-marker-legend');if(lg)lg.remove();}else if(!c.querySelector('.ka-nomap'))head.insertAdjacentHTML('afterend',note);}
 if(type==='muscle'&&!(typeof MASSAGE_DB!=='undefined'&&MASSAGE_DB[slug])){var p=c.querySelector('.mio-panel');if(p&&!p.querySelector('.ka-scope')){var sc=document.createElement('p');sc.className='ka-foot-note ka-scope';sc.textContent=z?'這條肌肉目前沒有按摩教學資料（資料庫只涵蓋部分肌肉），所以不顯示按摩分頁。':'This muscle has no massage teaching data yet (the database covers only some muscles), so there is no Massage tab.';p.appendChild(sc);}}}
var _kapSMD=showMIDetail,_kapSBD=showBoneDetail;
showMIDetail=function(s){try{var r=_kapSMD.apply(this,arguments);kapDetailPost('muscle',s);return r;}catch(e){kapDetailError('muscle',s,e);}};
showBoneDetail=function(s){try{var r=_kapSBD.apply(this,arguments);kapDetailPost('bone',s);return r;}catch(e){kapDetailError('bone',s,e);}};

/* ================= EASY PRACTICE ================= */
questSilhouette=function(slug){var PA=questPaths();var bp=typeof BODY_PATHS!=='undefined'?BODY_PATHS.maleFront:[];if(!PA[slug])return '';
 var s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="-55 -91 733 1462" preserveAspectRatio="xMidYMin meet" role="img" aria-label="Body figure with one muscle highlighted">';
 bp.forEach(function(p){var iH=(p.slug==='head'||p.slug==='hair');var f=iH?'#B7C2B2':'#C9D1C5';[].concat(p.common||[]).concat(p.left||[]).concat(p.right||[]).forEach(function(d){s+='<path d="'+d+'" fill="'+f+'" stroke="#fff" stroke-width="1.5"/>';});});
 PA[slug].paths.forEach(function(d){s+='<path d="'+d+'" fill="#B7523B" stroke="#B7523B" stroke-width="2" opacity="0.92"/>';});return s+'</svg>';};
var KAP_FREE_MODES=[['name','肌肉點名','Muscle roll-call','看圖上亮起的肌肉，選出名稱','Name the muscle that is highlighted'],['detective','動作偵探','Movement detective','這個動作主要靠哪一條肌肉出力？','Which muscle does most of the work?'],['function','功能配對','Function match','由動作或神經猜出是哪條肌肉','Guess the muscle from its action or nerve'],['match','配對（點選或拖曳）','Match (tap or drag)','把肌肉配到對應的動作；可以先點肌肉再點動作','Pair muscles with their actions — tap one, then the other, or drag']];
KAP._free={n:0,ok:0,skip:0,viewed:0};
buildQuestHome=function(){var z=zh();QUEST.free=false;if(QUEST.timer){clearInterval(QUEST.timer);QUEST.timer=null;}
 document.getElementById('quest-play').style.display='none';var home=document.getElementById('quest-home');home.style.display='';
 var xp=getXP(),lvl=Math.floor(xp/100),stats=questStats(),streak=(typeof getStreakData==='function'?(getStreakData().streak||0):0);var pro=!document.body.classList.contains('kap-simple');
 var h='<div class="ka-pr"><header class="ka-pg-head"><span class="ka-eyebrow">自己的節奏</span><h2 class="ka-pg-h">'+(z?'輕鬆練習':'Easy practice')+'</h2><p class="ka-pg-sub">'+(z?'慢慢想就好。選錯也能多認識身體一點。':'Take your time. A wrong answer still teaches you something about the body.')+'</p></header>';
 h+='<section class="ka-pnl ka-free" id="ka-free-card"><h3>'+(z?'自由練習':'Free practice')+'</h3><p class="ka-card-sub">'+(z?'不計分、不計時。答完會看到說明，也能順著看它和日常生活的關係。':'No score, no timer. After each answer you see the explanation and can open how it shows up in daily life.')+'</p><div class="ka-modegrid">';
 KAP_FREE_MODES.forEach(function(m){h+='<button type="button" class="ka-mode" data-free="'+m[0]+'"><b>'+(z?m[1]:m[2])+'</b><span>'+(z?m[3]:m[4])+'</span></button>';});
 h+='</div></section>';
 h+='<details class="ka-pnl ka-adv" id="ka-adv"><summary><span>'+(z?'進階挑戰':'Advanced challenges')+'</span><small>'+(z?'每日挑戰、10 秒計時、經驗值與連續天數':'Daily challenge, 10-second timer, XP and streak')+'</small></summary><div class="ka-adv-body">'
 +'<p class="ka-card-sub">'+(z?'這裡保留原本的挑戰玩法，會累積經驗值與連續天數。它是學習紀錄，不是健康分數。':'The original challenge modes live here. They add XP and a day streak — a learning record, not a health score.')+'</p>'
 +'<div class="ka-xpline"><b>'+(z?'等級 ':'Level ')+lvl+'</b><span>'+xp+' XP</span><span>\u{1F525} '+streak+(z?' 天連續':' day streak')+'</span></div>'
 +'<button type="button" class="ka-mode wide" id="quest-daily-btn"><b>'+(z?'每日挑戰':'Daily challenge')+'</b><span>'+(z?'5 題・計時・完成累積連續天數':'5 questions · timed · builds your streak')+'</span></button><div class="ka-modegrid">';
 QMODES.forEach(function(m){var locked=(m.id==='clinical'&&!pro);var st=stats[m.id];var acc=st&&st.t?Math.round(st.c/st.t*100):null;
  h+='<button type="button" class="ka-mode'+(locked?' locked':'')+'" data-qmode="'+m.id+'"'+(locked?' aria-disabled="true"':'')+'><b>'+(z?m.zh:m.en)+(locked?' \u{1F512}':'')+'</b><span>'+(locked?(z?'在閱讀方式選「專業資料」後開放；這是學習資料，不代表臨床資格':'Switch reading to "Detailed reference" to open. Study material, not a clinical qualification.'):(m.id==='match'?(z?'把肌肉配到對應的動作（計經驗值）':'Pair muscles with actions (earns XP)'):(z?m.dz:m.de)))+(acc!==null&&!locked?(' · '+(z?'歷史正確率 ':'accuracy ')+acc+'%'):'')+'</span></button>';});
 h+='</div></div></details></div>';home.innerHTML=h;
 home.querySelectorAll('[data-free]').forEach(function(b){b.addEventListener('click',function(){kapFreeStart(this.dataset.free);});});
 home.querySelectorAll('[data-qmode]:not(.locked)').forEach(function(b){b.addEventListener('click',function(){startQuest(this.dataset.qmode,false);});});
 var db=document.getElementById('quest-daily-btn');if(db)db.addEventListener('click',function(){startQuest(null,true);});};
(function(){var sq=startQuest;startQuest=function(mode,daily){QUEST.free=false;return sq.apply(this,arguments);};})();
function kapFreeStart(mode){QUEST.free=true;KAP._free={n:0,ok:0,skip:0,viewed:0};document.getElementById('quest-home').style.display='none';var p=document.getElementById('quest-play');p.style.display='';if(mode==='match'){renderMatchQ();return;}QUEST.freeMode=mode;kapFreeQ();}
function kapQVal(o){return typeof o==='string'?o:o.slug;}
function kapQRight(q){return typeof q.opts[0]==='string'?q.ans:q.ansSlug;}
function kapQExplain(q){var z=zh(),DB=questDB();var slug=q.ansSlug||q.detailSlug,m=slug&&DB[slug],rows=[];var src=function(t){return t+(z?'':' (中文原文)');};
 if(q.mode==='detective'){rows.push([z?'這個動作的主力':'Prime mover',q.ans]);if(m){if(m.action)rows.push([z?'動作':'Action',src(m.action)]);}}
 else if(m){if(m.action)rows.push([z?'動作':'Action',src(m.action)]);if(m.origin||m.insert)rows.push([z?'起點→止點':'Origin → insertion',src((m.origin||'')+' → '+(m.insert||''))]);if(m.nerve)rows.push([z?'神經':'Nerve',src(m.nerve)]);if(m.daily)rows.push([z?'日常':'Daily life',src(m.daily)]);}
 return{slug:(m?slug:null),name:(q.mode==='detective'?q.ans:(m?(z?m.zh:m.en):q.ans)),sub:(m?(z?m.en:m.zh):''),rows:rows};}
function kapFreeQ(){var z=zh();var mode=QUEST.freeMode;var q=makeQuestQ(mode);QUEST.q=q;var play=document.getElementById('quest-play');
 if(!q){play.innerHTML='<div class="ka-pr"><p class="ka-card-sub">'+(z?'目前沒有足夠的題目資料。':'Not enough question data.')+'</p><button type="button" class="ka-btn" id="ka-q-back">'+(z?'返回':'Back')+'</button></div>';document.getElementById('ka-q-back').addEventListener('click',buildQuestHome);return;}
 var f=KAP._free;var h='<div class="ka-pr ka-q"><div class="ka-q-top"><button type="button" class="ka-btn ghost" id="ka-q-back">‹ '+(z?'返回':'Back')+'</button><span class="ka-q-prog" id="ka-q-prog">'+(z?'第 '+(f.n+1)+' 題 · 答對 '+f.ok+' 題':'Question '+(f.n+1)+' · '+f.ok+' correct')+'</span></div>'
 +'<p class="ka-q-hint">'+(z?'慢慢想就好，不計分、不計時。':'Take your time — no score, no timer.')+'</p><h3 class="ka-q-p" id="ka-q-p">'+kapEsc(q.prompt)+'</h3>'+(q.svg?'<div class="ka-q-img">'+q.svg+'</div>':'')+(q.sub?'<p class="ka-q-sub">'+kapEsc(q.sub)+'</p>':'')
 +'<div class="ka-q-opts" role="group" aria-labelledby="ka-q-p">'+q.opts.map(function(o){return '<button type="button" class="ka-q-opt" data-v="'+kapEsc(kapQVal(o))+'" aria-pressed="false">'+kapEsc(typeof o==='string'?o:o.label)+'</button>';}).join('')+'</div>'
 +'<div class="ka-q-act" id="ka-q-act"><button type="button" class="ka-btn primary" id="ka-q-ok" disabled>'+(z?'確認答案':'Check answer')+'</button><button type="button" class="ka-btn" id="ka-q-peek">'+(z?'先看解說':'Show explanation first')+'</button><button type="button" class="ka-btn ghost" id="ka-q-skip">'+(z?'跳過':'Skip')+'</button></div><div class="ka-q-fb" id="ka-q-fb" role="status" aria-live="polite"></div></div>';
 play.innerHTML=h;play.scrollTop=0;var sel=null;
 play.querySelectorAll('.ka-q-opt').forEach(function(b){b.addEventListener('click',function(){if(q.done)return;play.querySelectorAll('.ka-q-opt').forEach(function(x){x.classList.remove('sel');x.setAttribute('aria-pressed','false');});this.classList.add('sel');this.setAttribute('aria-pressed','true');sel=this.dataset.v;document.getElementById('ka-q-ok').disabled=false;});});
 document.getElementById('ka-q-back').addEventListener('click',buildQuestHome);
 document.getElementById('ka-q-ok').addEventListener('click',function(){if(q.done||sel===null)return;kapFreeResolve('answer',sel);});
 document.getElementById('ka-q-peek').addEventListener('click',function(){if(q.done)return;kapFreeResolve('peek');});
 document.getElementById('ka-q-skip').addEventListener('click',function(){if(q.done)return;KAP._free.n++;KAP._free.skip++;kapFreeQ();var p=document.getElementById('ka-q-p');if(p){p.setAttribute('tabindex','-1');p.focus();}});}
function kapFreeResolve(kind,val){var q=QUEST.q,z=zh(),f=KAP._free;q.done=true;var right=kapQRight(q),ok=false;f.n++;
 if(kind==='answer'){ok=(String(val)===String(right));if(ok)f.ok++;}else f.viewed++;
 var play=document.getElementById('quest-play');play.querySelectorAll('.ka-q-opt').forEach(function(b){b.disabled=true;var v=b.dataset.v;if(kind==='answer'){if(v===String(right))b.classList.add('right');else if(b.classList.contains('sel'))b.classList.add('wrong');}else if(v===String(right))b.classList.add('right');});
 var ex=kapQExplain(q);var head=kind==='peek'?(z?'已看解說，這題不計入答對。':'Explanation viewed — this question does not count as correct.'):ok?(z?'答對了。':'Correct.'):(z?'差一點。這題的答案是「'+ex.name+'」。':'Not this time. The answer is "'+ex.name+'".');
 var h='<div class="ka-q-fbhead '+(kind==='peek'?'peek':ok?'ok':'no')+'">'+kapEsc(head)+'</div><div class="ka-q-expl"><b>'+kapEsc(ex.name)+'</b>'+(ex.sub?'<small>'+kapEsc(ex.sub)+'</small>':'')+ex.rows.map(function(r){return '<p><span>'+kapEsc(r[0])+'</span>'+kapEsc(r[1])+'</p>';}).join('')+'</div><div class="ka-q-next">'
 +(ex.slug?'<button type="button" class="ka-btn" id="ka-q-life">'+(z?'查看日常用途':'See how it shows up in daily life')+'</button>':'')+'<button type="button" class="ka-btn primary" id="ka-q-next">'+(z?'下一題':'Next question')+'</button><button type="button" class="ka-btn ghost" id="ka-q-end">'+(z?'返回':'Back')+'</button></div>';
 document.getElementById('ka-q-act').style.display='none';var fb=document.getElementById('ka-q-fb');fb.innerHTML=h;var pr=document.getElementById('ka-q-prog');if(pr)pr.textContent=z?('已看 '+f.n+' 題 · 答對 '+f.ok+' 題'):(f.n+' seen · '+f.ok+' correct');
 var life=document.getElementById('ka-q-life');if(life)life.addEventListener('click',function(){KAP._detailTrigger=this;showMIDetail(ex.slug);});
 document.getElementById('ka-q-next').addEventListener('click',function(){kapFreeQ();var p=document.getElementById('ka-q-p');if(p){p.setAttribute('tabindex','-1');p.focus();}});document.getElementById('ka-q-end').addEventListener('click',buildQuestHome);
 var nb=document.getElementById('ka-q-next');if(nb)nb.focus();}
/* click-to-match: a drag is never the only way (tap a muscle, then tap the action) */
(function(){var rm=renderMatchQ;renderMatchQ=function(){var r=rm.apply(this,arguments);try{kapMatchEnhance();}catch(e){}return r;};
 matchPlace=function(chip,drop){var z=zh();var ok=(chip.dataset.slug===drop.dataset.slot);chip.style.position='';chip.style.left='';chip.style.top='';chip.style.width='';chip.style.zIndex='';chip.style.pointerEvents='';chip.classList.remove('sel');chip.classList.add('placed');chip.classList.add(ok?'correct':'incorrect');drop.classList.add('filled');drop.appendChild(chip);
  if(!QUEST.free){if(ok)addXP(15);saveQuestStat('match',ok);}QUEST.matchPlaced++;var mc=document.getElementById('match-count');if(mc)mc.textContent=QUEST.matchPlaced+' / '+QUEST.matchTotal;
  if(QUEST.matchPlaced>=QUEST.matchTotal){var right=document.querySelectorAll('.match-chip.correct').length;var fb=document.getElementById('quest-fb');var DB=questDB();var again=QUEST.free?'kapFreeStart(\'match\')':'renderMatchQ()';
   var pairs='';if(QUEST.free){pairs='<ul class="ka-pairs">'+[].map.call(document.querySelectorAll('.match-target'),function(t){var s=t.dataset.slot,m=DB[s];return m?'<li><b>'+kapEsc(z?m.zh:m.en)+'</b> → '+kapEsc(m.action||'')+'</li>':'';}).join('')+'</ul>';}
   if(fb)fb.innerHTML='<div class="quest-fb-txt '+(right===QUEST.matchTotal?'ok':'no')+'">'+(z?('配對完成：'+right+' / '+QUEST.matchTotal):('Matched '+right+' / '+QUEST.matchTotal))+'</div>'+pairs+'<button class="quest-next" onclick="'+again+'">'+(z?'再一輪':'Again')+'</button>'+(QUEST.free?'<button class="quest-next ghost" onclick="buildQuestHome()">'+(z?'返回':'Back')+'</button>':'');}};})();
function kapMatchEnhance(){var z=zh();var board=document.querySelector('#quest-play .match-board');if(!board)return;
 var qEl=document.querySelector('#quest-play .quest-q');if(qEl)qEl.textContent=z?'把肌肉配到對應的動作（可拖曳，也可以先點肌肉、再點動作）':'Pair each muscle with its action (drag, or tap a muscle and then an action)';
 var back=document.querySelector('#quest-play .quest-back');if(back&&QUEST.free){back.onclick=null;back.removeAttribute('onclick');back.addEventListener('click',buildQuestHome);}
 var sel=null,down=null;var chips=[].slice.call(board.querySelectorAll('.match-chip'));
 var setSel=function(c){chips.forEach(function(x){x.classList.remove('sel');x.setAttribute('aria-pressed','false');});sel=c;if(c){c.classList.add('sel');c.setAttribute('aria-pressed','true');}};
 chips.forEach(function(c){c.setAttribute('role','button');c.setAttribute('tabindex','0');c.setAttribute('aria-pressed','false');
  c._moved=false;c.addEventListener('pointerdown',function(e){down=[e.clientX,e.clientY];c._moved=false;});
  c.addEventListener('pointerup',function(e){c._moved=!!(down&&Math.hypot(e.clientX-down[0],e.clientY-down[1])>6);down=null;});
  var pick=function(){if(c.classList.contains('placed'))return;setSel(sel===c?null:c);};
  c.addEventListener('click',function(){if(c._moved){c._moved=false;return;}pick();});
  c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick();}});});
 board.querySelectorAll('.match-target').forEach(function(t){var drop=t.querySelector('.match-drop');t.setAttribute('role','button');t.setAttribute('tabindex','0');
  var put=function(){if(!sel||!drop||drop.classList.contains('filled'))return;var c=sel;setSel(null);matchPlace(c,drop);};
  t.addEventListener('click',put);t.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();put();}});});}

/* ================= MY TAKEAWAYS ================= */
function kapRecentEx(){var a=[];try{a=JSON.parse(localStorage.getItem('ka_viewed_exercises')||'[]');}catch(e){}return a.filter(function(k){return EX[k];}).slice(-4).reverse();}
function kapExName(k){var ex=EX[k];return zh()?ex.tzh.replace(/分析$/,''):ex.ten.replace(/ ANALYSIS$/i,'');}
buildProgress=function(){var tgt=document.getElementById('prog-wrap-view')||document.getElementById('prog-wrap');if(!tgt)return;var z=zh();var o=kapUiRead(),fv=o.favorites;
 var items=[];fv.exercises.forEach(function(k){if(EX[k])items.push({kind:'exercises',id:k,name:kapExName(k),sub:EX[k].ten.replace(/ ANALYSIS$/i,''),tag:z?'動作':'Movement'});});
 var M=questDB(),B=atlasBonesDB();fv.muscles.forEach(function(s){if(M[s])items.push({kind:'muscles',id:s,name:z?M[s].zh:M[s].en,sub:z?M[s].en:M[s].zh,tag:z?'肌肉':'Muscle'});});fv.bones.forEach(function(s){if(B[s])items.push({kind:'bones',id:s,name:z?B[s].zh:B[s].en,sub:z?B[s].en:B[s].zh,tag:z?'骨骼':'Bone'});});
 var storeOK=kapStorageOK();var recent=kapRecentEx();
 var viewedM=[],viewedE=[];try{viewedM=JSON.parse(localStorage.getItem('ka_viewed_muscles')||'[]');}catch(e){}try{viewedE=JSON.parse(localStorage.getItem('ka_viewed_exercises')||'[]');}catch(e){}
 var nMidx=(typeof MIDX!=='undefined'?MIDX.length:0),nEx=Object.keys(EX).length,streak=(typeof getStreakData==='function'?(getStreakData().streak||0):0),xp=getXP(),lvl=Math.floor(xp/100);
 var qs=questStats(),qT=0,qC=0;Object.keys(qs).forEach(function(k){qT+=qs[k].t;qC+=qs[k].c;});
 var mp=nMidx?Math.round(viewedM.length/nMidx*100):0,ep=nEx?Math.round(viewedE.length/nEx*100):0;
 var stats={muscles:viewedM.length,exercises:viewedE.length,streak:streak,xp:xp};
 var h='<div class="ka-tk"><header class="ka-pg-head"><span class="ka-eyebrow">本機紀錄</span><h2 class="ka-pg-h">'+(z?'把今天看懂的，留給之後的自己。':'Keep what you understood today for later.')+'</h2><p class="ka-pg-sub">'+(z?'你的收藏與探索紀錄，只存在這個瀏覽器。':'Your saved items and exploration notes stay in this browser only.')+'</p></header>';
 if(!storeOK)h+='<p class="ka-banner" role="status">'+(z?'本次暫時無法保存：這個瀏覽器目前不允許儲存，收藏只會留到你關閉這個分頁。閱讀不受影響。':'Could not save this time: this browser blocks local storage, so saved items only last until you close this tab. Reading is unaffected.')+'</p>';
 h+='<div class="ka-tk-grid"><section class="ka-pnl ka-tk-main"><h3>'+(z?'我的重點':'My takeaways')+'</h3><p class="ka-card-sub">'+(z?'收藏的是學習內容，不是個人的運動處方。':'You are saving study content, not a personal exercise prescription.')+'</p>';
 if(!items.length)h+='<div class="ka-tk-empty"><b>'+(z?'還沒有收藏，從一個動作開始就好。':'Nothing saved yet — start with one movement.')+'</b><p>'+(z?'看完一個動作後按「留下今天的重點」，它就會出現在這裡。':'After you read a movement, press "Keep today\'s takeaway" and it shows up here.')+'</p><button type="button" class="ka-btn primary" id="ka-tk-start">'+(z?'選一個生活動作':'Pick an everyday movement')+'</button></div>';
 else h+='<ul class="ka-tk-list">'+items.map(function(it){return '<li><div class="ka-tk-i"><span class="ka-tag">'+it.tag+'</span><b>'+kapEsc(it.name)+'</b><small>'+kapEsc(it.sub||'')+'</small></div><div class="ka-tk-b"><button type="button" class="ka-btn" data-tk-open="'+it.kind+':'+kapEsc(it.id)+'">'+(z?'再看一次':'Open again')+'</button><button type="button" class="ka-btn ghost" data-tk-rm="'+it.kind+':'+kapEsc(it.id)+'" aria-label="'+(z?'移除 ':'Remove ')+kapEsc(it.name)+'">'+(z?'移除':'Remove')+'</button></div></li>';}).join('')+'</ul>';
 if(recent.length)h+='<div class="ka-tk-recent"><h4>'+(z?'最近看過（自動記錄，不是收藏）':'Recently viewed (recorded automatically, not saved)')+'</h4><div>'+recent.map(function(k){return '<button type="button" class="ka-rchip" data-tk-open="exercises:'+k+'">'+kapEsc(kapExName(k))+'</button>';}).join('')+'</div></div>';
 h+='<div class="ka-tk-stats"><div><b>'+items.length+'</b><span>'+(z?'留下的重點':'Saved takeaways')+'</span></div><div><b>'+viewedE.length+' / '+nEx+'</b><span>'+(z?'看過的動作':'Movements viewed')+'</span></div><div><b>'+viewedM.length+' / '+nMidx+'</b><span>'+(z?'看過的常見肌群':'Common muscle groups viewed')+'</span></div></div></section>'
 +'<aside class="ka-pnl ka-tk-side"><h3>'+(z?'先讓你知道，紀錄放在哪裡':'Where your records live')+'</h3><p>'+(z?'收藏與探索紀錄存在這台裝置的瀏覽器裡。換裝置或清除瀏覽資料後，紀錄不會跟著保留；這個版本沒有雲端同步，也不收集姓名、疼痛部位或病史。':'Saved items and exploration notes live in this device\'s browser. They do not follow you to another device or survive clearing browser data. There is no cloud sync, and no names, pain locations or medical history are collected.')+'</p>'
 +'<div id="ka-tk-clear-zone"><button type="button" class="ka-linkbtn" id="ka-tk-clear" '+(items.length?'':'disabled')+'>'+(z?'清除我的重點…':'Clear my takeaways…')+'</button></div></aside></div>'
 +'<details class="ka-pnl ka-review" id="ka-review"><summary><span>'+(z?'進階回顧：等級、勳章與探索紀錄':'Advanced review: level, badges and exploration')+'</span><small>'+(z?'原有的學習紀錄都保留在這裡':'Your existing learning record is kept here')+'</small></summary><div class="ka-review-body">'
 +'<p class="ka-card-sub">'+(z?'這些是探索紀錄，不代表掌握程度，也不是健康分數。分母各自獨立：常見肌群 '+nMidx+' 組、動作 '+nEx+' 個。':'These are exploration records, not mastery and not a health score. Each count has its own total: '+nMidx+' common muscle groups, '+nEx+' movements.')+'</p>'
 +'<div class="ka-xpline"><b>'+(z?'等級 ':'Level ')+lvl+'</b><span>'+xp+' XP</span><span>'+(z?'測驗正確率 ':'Quiz accuracy ')+(qT?Math.round(qC/qT*100):0)+'%</span><span>\u{1F525} '+streak+(z?' 天連續':' day streak')+'</span></div>'
 +'<div class="prog-ring-row"><div class="prog-ring-box">'+progressRingSVG(mp,'var(--blue)')+'<div class="prog-ring-lb">'+(z?'常見肌群探索':'Common muscle groups explored')+'</div></div><div class="prog-ring-box">'+progressRingSVG(ep,'var(--primary)')+'<div class="prog-ring-lb">'+(z?'動作探索':'Movements explored')+'</div></div></div>'
 +'<div class="prog-badges">'+ACHIEVEMENTS.map(function(a){var u=a.cond(stats);return '<div class="prog-badge'+(u?' on':'')+'"><div class="prog-badge-icon">'+a.icon+'</div><div class="prog-badge-lb">'+(z?a.zh:a.en)+'</div></div>';}).join('')+'</div></div></details></div>';
 tgt.innerHTML=h;
 var st=document.getElementById('ka-tk-start');if(st)st.addEventListener('click',function(){goHome();});
 tgt.querySelectorAll('[data-tk-open]').forEach(function(b){b.addEventListener('click',function(){var p=this.dataset.tkOpen,i=p.indexOf(':'),kind=p.slice(0,i),id=p.slice(i+1);if(kind==='exercises')goMain(id);else{KAP._detailTrigger=this;(kind==='bones'?showBoneDetail:showMIDetail)(id);}});});
 tgt.querySelectorAll('[data-tk-rm]').forEach(function(b){b.addEventListener('click',function(){var p=this.dataset.tkRm,i=p.indexOf(':');kapUnfav(p.slice(0,i),p.slice(i+1));buildProgress();var f=document.querySelector('#view-progress .ka-tk h3');if(f){f.setAttribute('tabindex','-1');f.focus();}});});
 var cb=document.getElementById('ka-tk-clear');if(cb)cb.addEventListener('click',function(){var zone=document.getElementById('ka-tk-clear-zone');
  zone.innerHTML='<div class="ka-confirm" role="group" aria-label="'+(z?'確認清除':'Confirm')+'"><p><b>'+(z?'要清除 '+items.length+' 筆收藏嗎？':'Clear '+items.length+' saved item'+(items.length===1?'':'s')+'?')+'</b><br>'+(z?'只會清除「我的重點」裡的收藏，不會動到等級、勳章、探索紀錄和其他資料。':'This only clears the items saved in My takeaways. Your level, badges, exploration notes and everything else stay as they are.')+'</p><button type="button" class="ka-btn danger" id="ka-tk-yes">'+(z?'清除收藏':'Clear saved items')+'</button><button type="button" class="ka-btn ghost" id="ka-tk-no">'+(z?'取消':'Cancel')+'</button></div>';
  document.getElementById('ka-tk-no').focus();document.getElementById('ka-tk-no').addEventListener('click',function(){buildProgress();var c=document.getElementById('ka-tk-clear');if(c)c.focus();});
  document.getElementById('ka-tk-yes').addEventListener('click',function(){var u=kapUiRead();u.favorites={exercises:[],muscles:[],bones:[]};kapUiWrite(u);kapSyncFavButtons();showToast(zh()?'已清除收藏。':'Saved items cleared.');buildProgress();var f=document.querySelector('#view-progress .ka-tk h3');if(f){f.setAttribute('tabindex','-1');f.focus();}});});};

/* ---- plumbing: language switch, leaving practice, first-visit hints ---- */
function kapRefreshViews(){var v=KAP.view;if(v==='atlas')kapAtlasRender();else if(v==='progress')buildProgress();else if(v==='quest'){var p=document.getElementById('quest-play');if(!p||p.style.display==='none')buildQuestHome();}}
(function(){var sl=setLang;setLang=function(){var r=sl.apply(this,arguments);try{kapRefreshViews();}catch(e){}return r;};
 var gv=goView;goView=function(v){if(v!=='quest')QUEST.free=false;return gv.apply(this,arguments);};
 if(typeof coachMark==='function'){var cm=coachMark;coachMark=function(k,t,sel){if(k==='quest')return cm(k,kapT('先從「自由練習」開始，不用計分。','Start with free practice — no score.'),'#ka-free-card');if(k==='atlas')return cm(k,kapT('輸入中文、英文或生活用詞來找構造。','Search by name or an everyday word.'),'#ka-at-q');return cm.apply(this,arguments);};}})();
/* == KA-UI-V2 Step 06 end == */
