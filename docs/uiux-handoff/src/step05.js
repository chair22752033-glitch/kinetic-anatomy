/* == KA-UI-V2 Step 05: plain-language layer, reading depth, favourites, one sheet, dialog a11y == */
/* one-glance card under the canvas (phones show it; desktop hides it with CSS) */
(function(){var lg=document.getElementById('ka-legend');if(!lg||document.getElementById('ka-glance'))return;var g=document.createElement('div');g.id='ka-glance';g.className='ka-glance';g.innerHTML='<span class="ka-g-eyebrow"></span><p class="ka-g-key"></p><div class="ka-g-row"><button type="button" class="ka-btn primary ka-g-open">x<svg class="kap-nav-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button><button type="button" class="ka-btn ka-g-fav" data-ka-fav aria-pressed="false"><svg class="kap-nav-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10a1 1 0 0 1 1 1v15l-6-3.5L6 20V5a1 1 0 0 1 1-1z"/></svg></button></div>';lg.parentNode.insertBefore(g,lg.nextSibling);})();
/* ---- local favourites (new key only; never touches the old progress keys) ---- */
function kapUiRead(){try{var o=JSON.parse(localStorage.getItem('kap_ui_v2')||'null');if(o&&o.schemaVersion===1&&o.favorites)return o;}catch(e){}return{schemaVersion:1,locale:(typeof lang!=='undefined'?lang:'en'),readingDepth:'plain',favorites:{exercises:[],muscles:[]},lastContext:{}};}
function kapUiWrite(o){try{localStorage.setItem('kap_ui_v2',JSON.stringify(o));return true;}catch(e){return false;}}
function kapFavExercise(k){var o=kapUiRead();if(o.favorites.exercises.indexOf(k)>=0)return'dup';o.favorites.exercises.push(k);return kapUiWrite(o)?'ok':'fail';}
function kapIsFav(k){return kapUiRead().favorites.exercises.indexOf(k)>=0;}
function kapSaveTakeaway(){var z=zh(),r=kapFavExercise(cEx);showToast(r==='ok'?(z?'已留下今天的重點，之後可以再回來看。':'Saved to My notes. You can come back to it later.'):r==='dup'?(z?'已經在「我的重點」裡了。':'It is already in My notes.'):(z?'本次暫時無法保存，閱讀不受影響。':'Could not save this time. You can keep reading.'));kapSyncFavButtons();}
function kapSyncFavButtons(){var on=kapIsFav(cEx);document.querySelectorAll('[data-ka-fav]').forEach(function(b){b.setAttribute('aria-pressed',on?'true':'false');b.classList.toggle('on',on);});}
/* ---- plain-language layer (built from EX; nothing is written back to the data) ---- */
var KAP_ROLE={agonist:['主力','Prime mover','主力（主動肌）'],synergist:['幫手','Helper','幫手（協助肌）'],stabilizer:['穩定','Stabiliser','穩定肌']};
function kapMuName(m,z){return z?m.zh:m.en;}
function kapBuildPlain(){var box=document.getElementById('ka-plain');var ex=EX[cEx];if(!box||!ex)return;var z=zh();
  var nz=ex.tzh.replace(/分析$/,''),ne=ex.ten.replace(/ ANALYSIS$/i,'');var name=z?nz:ne;
  var by=function(r){return ex.muscles.filter(function(m){return m.role===r;});};
  var ag=by('agonist'),sy=by('synergist');var lead=ag.length?ag:sy;var key='';
  if(lead.length){var names=lead.map(function(m){return kapMuName(m,z);});key=z?(names.join('、')+(ag.length?'是這個動作的主力。':'在這個動作裡幫忙。')):(names.join(' and ')+(lead.length>1?' are ':' is ')+(ag.length?'the main '+(lead.length>1?'movers':'mover'):'helping')+' in this movement.');}
  var esc=function(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');};
  var h='<span class="ka-chip2">'+(z?'生活動作 × ':'Everyday movement × ')+esc(name)+'</span>';
  h+='<h2 class="ka-h2">'+(z?esc(nz)+'，有哪些肌肉一起幫忙？':'Which muscles work together in '+esc(ne)+'?')+'</h2>';
  h+='<p class="ka-lead2">'+(z?'先從主要出力的部位看起，再慢慢認識它們怎麼合作。':'Start with the parts doing most of the work, then slowly see how they cooperate.')+'</p>';
  if(key)h+='<div class="ka-key"><small>'+(z?'先記住這一件事':'Remember just one thing')+'</small><b>'+esc(key)+'</b></div>';
  h+='<div class="ka-listhd">'+(z?'點名稱或身體圖，認識這條肌肉':'Tap a name or the body to meet that muscle')+'</div><ul class="ka-mlist">';
  ex.muscles.forEach(function(m){var sl=(m.slugs||[])[0]||'';var r=KAP_ROLE[m.role]||['','',''];h+='<li><button type="button" class="ka-mrow" data-ka-mu="'+esc(sl)+'"><span class="ka-mn"><b>'+esc(kapMuName(m,z))+'</b><small>'+esc(z?m.en:m.zh)+'</small></span><span class="ka-role r-'+esc(m.role)+'">'+(z?r[0]:r[1])+'</span></button></li>';});
  h+='</ul><div id="ka-plain-video"></div>';
  h+='<button type="button" class="ka-btn primary ka-fullw" data-ka-fav aria-pressed="false">'+(z?'留下今天的重點':'Keep today’s takeaway')+'</button>';
  h+='<button type="button" class="ka-linkbtn" data-ka-life>'+(z?'這和日常生活有什麼關係？ →':'How does this relate to everyday life? →')+'</button>';
  h+='<p class="ka-foot-note">'+(z?'圖上的顏色代表動作中的角色，不代表疼痛或受傷位置。一般解剖示意・非個人量測。':'Colours show each muscle’s role, not pain or injury. General anatomy illustration, not a personal measurement.')+'</p>';
  box.innerHTML=h;
  var tv=document.getElementById('tut-video-link'),pv=document.getElementById('ka-plain-video');if(tv&&pv)pv.innerHTML=tv.innerHTML;
  box.querySelectorAll('[data-ka-mu]').forEach(function(b){b.addEventListener('click',function(){var s=this.dataset.kaMu;if(s&&typeof showMIDetail==='function'){KAP._detailTrigger=this;showMIDetail(s);}});});
  var lf=box.querySelector('[data-ka-life]');if(lf)lf.addEventListener('click',function(){var s=(lead[0]&&(lead[0].slugs||[])[0])||'';if(s){KAP._detailTrigger=this;showMIDetail(s);}});
  var fv=box.querySelector('[data-ka-fav]');if(fv)fv.addEventListener('click',kapSaveTakeaway);
  /* the one-glance card under the canvas (phones): same key sentence + the single entry to the sheet */
  var g=document.getElementById('ka-glance');if(g){g.querySelector('.ka-g-key').textContent=key||(z?'看看這個動作的肌肉分工。':'See how the muscles share this movement.');g.querySelector('.ka-g-open').firstChild.textContent=z?'看看它們怎麼合作 ':'See how they work together ';g.querySelector('.ka-g-eyebrow').textContent=z?'先看懂一件事':'Just one thing first';var gf=g.querySelector('[data-ka-fav]');if(gf)gf.setAttribute('aria-label',z?'留下今天的重點':'Keep today’s takeaway');}
  kapSyncFavButtons();}
/* notes beside the numbers (pro layer): the values are the database's teaching values, not measurements */
function kapProNotes(){var z=zh();var mb=document.getElementById('mbars');if(mb){var n=mb.parentNode.querySelector('.ka-hint-pct');if(!n){n=document.createElement('p');n.className='ka-hint ka-hint-pct';mb.parentNode.insertBefore(n,mb.nextSibling);}n.textContent=z?'原資料庫的教學示意值，未經個人量測；各肌群數值不以合計 100% 呈現。':'Teaching values from the original database, not personal measurements. The values are not meant to add up to 100%.';}
  var ar=document.querySelector('.sec-arom');if(ar){var a=ar.querySelector('.ka-hint-arom');if(!a){a=document.createElement('p');a.className='ka-hint ka-hint-arom';ar.appendChild(a);}a.textContent=z?'參考角度不等於個人應達目標；此頁未測量活動度。':'Reference angles are not a personal target; this page does not measure your range of motion.';}
  var rc=document.querySelector('.sec-recovery');if(rc){var r=rc.querySelector('.ka-hint-rec');if(!r){r=document.createElement('p');r.className='ka-hint ka-hint-rec';rc.insertBefore(r,rc.querySelector('.st').nextSibling);}r.textContent=z?'以下為原資料中的教學說明，不是針對你個人的處方；不確定時請先詢問專業人员。':'Teaching text from the original data, not a prescription for you. If unsure, ask a professional first.';}}
(function(){var b1=bBars,b2=bArom;bBars=function(){var r=b1.apply(this,arguments);kapProNotes();return r;};bArom=function(){var r=b2.apply(this,arguments);kapBuildPlain();return r;};})();
/* ---- reading depth: plain (body.kap-simple) / detailed; same legacy key kap_pro, mirrored into kap_ui_v2 ---- */
function kapSyncDepth(){var simple=document.body.classList.contains('kap-simple');document.querySelectorAll('[data-depth]').forEach(function(b){var on=(b.dataset.depth==='plain')===simple;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');});
  var o=kapUiRead();o.readingDepth=simple?'plain':'detail';o.locale=(typeof lang!=='undefined'?lang:'en');kapUiWrite(o);
  if(simple){var t=document.querySelector('.rp-tab.on');if(t&&(t.dataset.rpt==='stretch'||t.dataset.rpt==='recovery')){var a=document.querySelector('.rp-tab[data-rpt="analysis"]');if(a)a.click();}}}
document.querySelectorAll('[data-depth]').forEach(function(b){b.addEventListener('click',function(){var simple=document.body.classList.contains('kap-simple');if((this.dataset.depth==='plain')!==simple){var ps=document.getElementById('pro-switch');if(ps)ps.click();}});});
if(typeof MutationObserver!=='undefined')new MutationObserver(kapSyncDepth).observe(document.body,{attributes:true,attributeFilter:['class']});
/* ---- dialogs: focus in, Tab kept inside, Esc closes, background locked, focus returns to the trigger ---- */
/* order = stacking order, bottom to top (the last open one gets Esc / Tab) */
var KAPDLG=[{id:'rp',box:'#rp',mobileOnly:true,close:function(){var m=document.getElementById('mt2');if(m&&document.getElementById('rp').classList.contains('on'))m.click();},trig:function(){return KAP._sheetTrigger;}},{id:'lib-sheet',box:'.lib-box',close:function(){if(typeof closeLibSheet==='function')closeLibSheet();},trig:null},{id:'muscle-overlay',box:'#muscle-overlay-content',close:function(){if(typeof closeMIO==='function')closeMIO();},trig:function(){return KAP._detailTrigger;}}];
function kapFocusables(root){return[].filter.call(root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])'),function(e){return e.offsetParent!==null||e===document.activeElement;});}
function kapAnyLocked(){return KAPDLG.some(function(d){var o=document.getElementById(d.id);return o&&o.classList.contains('on')&&(!d.mobileOnly||window.innerWidth<=768);});}
function kapDlgOpened(d){var ov=document.getElementById(d.id),box=ov&&ov.querySelector(d.box)||document.querySelector(d.box);if(!box)return;box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');var nm=box.querySelector('.mio-name,.ka-sheet-title,.lib-title');if(nm)box.setAttribute('aria-label',nm.textContent.replace(/\s+/g,' ').trim());
  d._from=(d.trig&&d.trig())||document.activeElement;document.body.classList.add('ka-lock');if(d.id==='muscle-overlay')document.body.classList.add('ka-detail-open');var f=kapFocusables(box);var close=box.querySelector('.mio-close,#ka-sheet-close');var t=close||f[0];if(t)setTimeout(function(){try{t.focus({preventScroll:true});}catch(e){}},30);}
function kapDlgClosed(d){if(d.id==='muscle-overlay')document.body.classList.remove('ka-detail-open');if(!kapAnyLocked())document.body.classList.remove('ka-lock');var back=d._from;d._from=null;if(d.id==='muscle-overlay')KAP._detailTrigger=null;if(back&&document.body.contains(back)&&back!==document.body&&back.focus){try{back.focus({preventScroll:true});return;}catch(e){}}var fb=document.getElementById('ext-find')||document.getElementById('ca');if(fb&&fb.focus)try{fb.focus({preventScroll:true});}catch(e){}}
KAPDLG.forEach(function(d){var ov=document.getElementById(d.id);if(!ov||typeof MutationObserver==='undefined')return;var was=ov.classList.contains('on');new MutationObserver(function(){var now=ov.classList.contains('on');if(d.mobileOnly&&window.innerWidth>768){was=now;return;}if(now&&!was)kapDlgOpened(d);else if(!now&&was)kapDlgClosed(d);was=now;}).observe(ov,{attributes:true,attributeFilter:['class']});});
document.addEventListener('keydown',function(e){var d=KAPDLG.filter(function(x){var o=document.getElementById(x.id);return o&&o.classList.contains('on')&&(!x.mobileOnly||window.innerWidth<=768);}).pop();if(!d)return;
  if(e.key==='Escape'){var z=document.getElementById('mio-zoom-bg');if(z&&z.classList.contains('on'))return;e.preventDefault();d.close();return;}
  if(e.key==='Tab'){var box=document.querySelector(d.box);var f=kapFocusables(box);if(!f.length)return;var i=f.indexOf(document.activeElement);if(e.shiftKey&&(i<=0)){e.preventDefault();f[f.length-1].focus();}else if(!e.shiftKey&&(i===f.length-1||i<0)){e.preventDefault();f[0].focus();}}},true);
/* ---- one sheet on phones: header, backdrop, single entry card ---- */
function kapSheetBackdrop(){var bg=document.getElementById('ka-sheet-bg');if(!bg){bg=document.createElement('div');bg.id='ka-sheet-bg';bg.addEventListener('click',function(){KAPDLG[0].close();});document.body.appendChild(bg);}return bg;}
(function(){kapSheetBackdrop();var c=document.getElementById('ka-sheet-close');if(c)c.addEventListener('click',function(){KAPDLG[0].close();});
  var g=document.getElementById('ka-glance');if(g){var op=g.querySelector('.ka-g-open');if(op)op.addEventListener('click',function(){KAP._sheetTrigger=this;var m=document.getElementById('mt2');if(m&&!document.getElementById('rp').classList.contains('on'))m.click();});var gf=g.querySelector('[data-ka-fav]');if(gf)gf.addEventListener('click',kapSaveTakeaway);}
  var rp=document.getElementById('rp');if(rp&&typeof MutationObserver!=='undefined')new MutationObserver(function(){document.getElementById('ka-sheet-bg').classList.toggle('on',rp.classList.contains('on')&&window.innerWidth<=768);}).observe(rp,{attributes:true,attributeFilter:['class']});
  kapSyncDepth();})();
/* no confetti the first time a muscle is read (design pack: nothing celebratory while first reading) */
maybeFireUnlockConfetti=function(){};
/* a different movement must not leave the previous muscle's text open */
(function(){var le=loadEx;loadEx=function(){var o=document.getElementById('muscle-overlay');if(o&&o.classList.contains('on')&&typeof closeMIO==='function')closeMIO();return le.apply(this,arguments);};})();
/* legacy entry points keep working but land on the new places (no second wiki / picker menus) */
openWiki=function(){if(typeof goView==='function')goView('atlas');};
openExPicker=function(){if(typeof openLibSheet==='function'){KAP._libTrigger=document.activeElement;openLibSheet();}};
/* == KA-UI-V2 Step 05 end == */
