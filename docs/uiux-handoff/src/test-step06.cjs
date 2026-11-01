/* Step 06: atlas (194/143), life-word search, missing-data states, free practice + original challenges, my takeaways */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [,, page, OUT]=process.argv;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};const errs=[];
 const base=async(vp,init,mob)=>{const ctx=await b.newContext({viewport:vp,isMobile:!!mob,hasTouch:!!mob});await ctx.addInitScript(()=>{localStorage.setItem('kap_onboard_v1','1');['lab','atlas','quest','home'].forEach(k=>localStorage.setItem('kap_coach_'+k,'1'));});if(init)await ctx.addInitScript(init);
  const p=await ctx.newPage();p.on('pageerror',e=>errs.push(String(e)));p.on('console',x=>{if(x.type()==='error'&&!/ERR_(CONN|INTERNET|NAME)/.test(x.text()))errs.push(x.text())});await p.goto('file://'+page);await p.waitForTimeout(400);return p;};
 const wait=(p,t)=>p.waitForTimeout(t||250);
 // ===================== ATLAS =====================
 let p=await base({width:1440,height:900});
 await p.evaluate(()=>goView('atlas'));await wait(p);
 const cnt=await p.evaluate(()=>({cards:document.querySelectorAll('#ka-at-grid .ka-at-card').length,db:Object.keys(Object.assign({},WIKI_MUSCLES_DB,WIKI_MUSCLES_DB_2)).length,b1:Object.keys(WIKI_MUSCLES_DB).length,m2:Object.keys(WIKI_MUSCLES_DB_2).length,bone1:Object.keys(WIKI_BONES_DB).length,bone2:Object.keys(WIKI_BONES_DB_2).length}));
 console.log('DB counts',JSON.stringify(cnt));
 ok(cnt.cards===cnt.db&&cnt.cards===194,'atlas lists every muscle entry: '+cnt.cards+' cards = '+cnt.db+' (174 original DB + extension entries)');
 await p.click('#ka-at-tabs [data-cat="bone"]');await wait(p);
 const bc=await p.evaluate(()=>document.querySelectorAll('#ka-at-grid .ka-at-card').length);ok(bc===143,'atlas lists every bone entry: '+bc+' (53 original + 90 extension)');
 await p.click('#ka-at-tabs [data-cat="muscle"]');await wait(p);
 const q=async s=>{await p.fill('#ka-at-q',s);await wait(p,150);return p.evaluate(()=>[].map.call(document.querySelectorAll('#ka-at-grid .ka-at-card'),c=>c.dataset.at.split(':')[1]));};
 let r=await q('股四頭');ok(r.includes('quadriceps'),'search 中文 股四頭 -> quadriceps');
 r=await q('Quadriceps');ok(r[0]==='quadriceps','search English Quadriceps -> first is quadriceps');
 r=await q('站起來');ok(r.includes('gluteal')&&r.includes('quadriceps'),'life word 站起來 -> gluteal + quadriceps ('+r.length+' hits)');
 r=await q('爬樓梯');ok(r.includes('gluteal')||r.includes('quadriceps'),'life word 爬樓梯 -> '+r.slice(0,4).join(','));
 r=await q('拿高處');ok(r.includes('deltoids'),'life word 拿高處 -> deltoids');
 r=await q('膝蓋');ok(r.length>=0,'膝蓋 (muscles) -> '+r.length+' hits, no crash');
 r=await q('zzzqq');
 const em=await p.evaluate(()=>({txt:document.querySelector('.ka-at-empty')&&document.querySelector('.ka-at-empty').innerText,val:document.getElementById('ka-at-q').value,n:document.querySelectorAll('.ka-at-card').length}));
 ok(r.length===0&&/zzzqq/.test(em.txt)&&em.val==='zzzqq'&&em.n===0,'no result keeps the search term and shows the empty state');
 ok(await p.evaluate(()=>!!document.querySelector('[data-atact="clear"]')&&!!document.querySelector('[data-atact="region"]')),'empty state offers clear + browse-by-region');
 await p.click('[data-atact="region"]');ok(await p.evaluate(()=>document.activeElement&&document.activeElement.classList.contains('ka-at-reg')),'browse-by-region moves focus to the region list (term kept: '+await p.evaluate(()=>document.getElementById('ka-at-q').value)+')');
 await p.click('[data-atact="clear"]');ok(await p.evaluate(()=>document.getElementById('ka-at-q').value===''&&document.querySelectorAll('.ka-at-card').length===194),'clear restores the full list');
 await p.click('#ka-at-regs [data-region="thigh"]');await wait(p);
 const th=await p.evaluate(()=>({n:document.querySelectorAll('.ka-at-card').length,exp:Object.values(Object.assign({},WIKI_MUSCLES_DB,WIKI_MUSCLES_DB_2)).filter(m=>m.region==='thigh').length}));ok(th.n===th.exp&&th.n>0,'region filter thigh -> '+th.n+' = DB '+th.exp);
 await p.click('#ka-at-regs [data-region="all"]');await wait(p);
 // missing data states
 const open=async(type,slug)=>{await p.evaluate(([t,s])=>{KAP._detailTrigger=document.querySelector('#ka-at-grid [data-at="'+t+':'+s+'"]');(t==='bone'?showBoneDetail:showMIDetail)(s);},[type,slug]);await wait(p,300);return p.evaluate(()=>{const c=document.getElementById('muscle-overlay-content');return{on:document.getElementById('muscle-overlay').classList.contains('on'),nomap:!!c.querySelector('.ka-nomap'),img:!!c.querySelector('.mio-img-wrap'),scope:!!c.querySelector('.ka-scope'),massage:!![].filter.call(c.querySelectorAll('.mio-tab'),t=>/massage|按摩/i.test(t.textContent)).length,headFirst:c.firstElementChild&&c.firstElementChild.classList.contains('mio-head'),text:c.innerText.length,fav:!!c.querySelector('.ka-fav-st')}});};
 let d=await open('muscle','anterior-scalene');ok(d.on&&d.nomap&&!d.img&&d.text>100,'muscle without path -> "no interactive map" note, no wrong figure, text still shown');
 await p.evaluate(()=>closeMIO());await wait(p);
 d=await open('muscle','frontalis');ok(d.on&&d.img&&!d.nomap&&d.scope&&!d.massage,'muscle without massage data -> no Massage tab + scope note');
 await p.evaluate(()=>closeMIO());await wait(p);
 d=await open('muscle','quadriceps');ok(d.massage&&!d.scope&&d.img,'muscle with massage data -> Massage tab, no scope note');
 await p.evaluate(()=>closeMIO());await wait(p);
 await p.click('#ka-at-tabs [data-cat="bone"]');await wait(p);
 d=await open('bone','lacrimal-bone');ok(d.on&&d.nomap&&!d.img&&d.headFirst,'bone without path -> "no interactive map" note, header first');
 await p.evaluate(()=>closeMIO());await wait(p);
 d=await open('bone','ribs-detail');ok(d.on&&d.img&&d.headFirst&&!d.nomap,'bone with figure -> header is first (figure no longer above the title)');
 // favourite from detail
 await p.click('#muscle-overlay .ka-fav-st');await wait(p);
 let st=await p.evaluate(()=>JSON.parse(localStorage.getItem('kap_ui_v2')));ok(st.favorites.bones.includes('ribs-detail'),'bone favourite stored (id only): '+JSON.stringify(st.favorites));
 await p.evaluate(()=>closeMIO());await wait(p);
 // focus return + context kept
 await p.click('#ka-at-tabs [data-cat="muscle"]');await p.fill('#ka-at-q','肌');await wait(p);
 await p.evaluate(()=>{document.getElementById('view-atlas').scrollTop=400;});
 await p.evaluate(()=>document.querySelectorAll('#ka-at-grid .ka-at-card')[5].focus());
 await p.keyboard.press('Enter');await wait(p,350);
 ok(await p.evaluate(()=>document.getElementById('muscle-overlay').classList.contains('on')),'keyboard Enter on a card opens the detail');
 await p.keyboard.press('Escape');await wait(p,300);
 const ctx2=await p.evaluate(()=>({open:document.getElementById('muscle-overlay').classList.contains('on'),q:document.getElementById('ka-at-q').value,top:document.getElementById('view-atlas').scrollTop,foc:document.activeElement.className}));
 ok(!ctx2.open&&ctx2.q==='肌'&&ctx2.top>=300&&/ka-at-card/.test(ctx2.foc),'Esc closes; query, scroll and focus are kept ('+JSON.stringify(ctx2)+')');
 // error + retry
 await p.evaluate(()=>{window.__o=_kapSMD;_kapSMD=function(){throw new Error('x');};showMIDetail('quadriceps');});await wait(p,250);
 const er=await p.evaluate(()=>({err:!!document.querySelector('#muscle-overlay-content .ka-err'),txt:document.querySelector('#muscle-overlay-content').innerText.includes('股四頭肌')||document.querySelector('#muscle-overlay-content').innerText.includes('Quadriceps')}));
 ok(er.err&&er.txt,'drawing failure -> readable text + retry (no crash)');
 await p.evaluate(()=>{_kapSMD=window.__o;});await p.click('#ka-err-retry');await wait(p,300);
 ok(await p.evaluate(()=>!document.querySelector('#muscle-overlay-content .ka-err')&&!!document.querySelector('#muscle-overlay-content .mio-img-wrap')),'retry recovers the full detail');
 await p.evaluate(()=>closeMIO());
 // language switch refreshes
 await p.evaluate(()=>setLang('zh'));await wait(p);
 ok(await p.evaluate(()=>/顯示/.test(document.getElementById('ka-at-count').textContent)&&/肌肉/.test(document.querySelector('#ka-at-tabs').textContent)),'language switch re-renders the atlas');
 await p.evaluate(()=>setLang('en'));
 // ===================== PRACTICE =====================
 await p.evaluate(()=>{localStorage.setItem('kap_xp','250');localStorage.setItem('kap_quest_stats',JSON.stringify({name:{c:3,t:4}}));goView('quest');});await wait(p);
 const home=await p.evaluate(()=>({free:document.querySelectorAll('[data-free]').length,adv:document.getElementById('ka-adv').open,daily:!!document.getElementById('quest-daily-btn'),modes:[].map.call(document.querySelectorAll('[data-qmode]'),m=>m.dataset.qmode),locked:document.querySelector('[data-qmode="clinical"]').classList.contains('locked'),xpText:document.querySelector('.ka-xpline').textContent}));
 ok(home.free===4&&!home.adv&&home.daily&&home.modes.join()==='name,detective,function,clinical,match','home: 4 free modes, advanced closed, daily + all 5 original modes kept ('+home.modes+')');
 ok(home.locked&&/250/.test(home.xpText),'clinical stays locked until detailed reading; old XP 250 still readable');
 const before=await p.evaluate(()=>({xp:localStorage.getItem('kap_xp'),st:localStorage.getItem('kap_quest_stats')}));
 for(const mode of ['name','detective','function']){
  await p.click('[data-free="'+mode+'"]');await wait(p);
  const f=await p.evaluate(()=>({timer:!!document.querySelector('.quest-timer-bar'),opts:document.querySelectorAll('.ka-q-opt').length,okDis:document.getElementById('ka-q-ok').disabled,intv:!!QUEST.timer}));
  ok(!f.timer&&!f.intv&&f.opts>=3&&f.okDis,'free/'+mode+': no timer, '+f.opts+' options, Check disabled until one is picked');
  // wrong answer
  const wrong=await p.evaluate(()=>{const q=QUEST.q;const right=kapQRight(q);const o=[].filter.call(document.querySelectorAll('.ka-q-opt'),b=>b.dataset.v!==String(right))[0];o.click();return o.dataset.v;});
  ok(await p.evaluate(()=>!document.getElementById('ka-q-ok').disabled),'free/'+mode+': picking enables Check');
  await p.click('#ka-q-ok');await wait(p);
  const w=await p.evaluate(()=>({head:document.querySelector('.ka-q-fbhead').className,expl:document.querySelector('.ka-q-expl').innerText.length,life:!!document.getElementById('ka-q-life'),right:document.querySelectorAll('.ka-q-opt.right').length,wr:document.querySelectorAll('.ka-q-opt.wrong').length}));
  ok(/no/.test(w.head)&&w.expl>10&&w.right===1&&w.wr===1,'free/'+mode+': wrong -> gentle feedback + explanation, right/wrong marked');
  if(w.life){await p.click('#ka-q-life');await wait(p,300);ok(await p.evaluate(()=>document.getElementById('muscle-overlay').classList.contains('on')),'free/'+mode+': "see daily use" opens the muscle detail');await p.evaluate(()=>closeMIO());await wait(p,250);}
  await p.click('#ka-q-next');await wait(p);
  // right answer counts
  const c0=await p.evaluate(()=>KAP._free.ok);await p.evaluate(()=>{const right=kapQRight(QUEST.q);[].filter.call(document.querySelectorAll('.ka-q-opt'),b=>b.dataset.v===String(right))[0].click();});await p.click('#ka-q-ok');await wait(p);
  ok(await p.evaluate((c)=>KAP._free.ok===c+1&&/ok/.test(document.querySelector('.ka-q-fbhead').className),c0),'free/'+mode+': right answer counts in the session tally');
  await p.click('#ka-q-next');await wait(p);
  // peek does not count
  const c1=await p.evaluate(()=>KAP._free.ok);await p.click('#ka-q-peek');await wait(p);
  const pk=await p.evaluate(()=>({cls:document.querySelector('.ka-q-fbhead').className,ok:KAP._free.ok,viewed:KAP._free.viewed,dis:[].every.call(document.querySelectorAll('.ka-q-opt'),b=>b.disabled)}));
  ok(/peek/.test(pk.cls)&&pk.ok===c1&&pk.viewed>=1&&pk.dis,'free/'+mode+': "explanation first" is not counted as correct');
  await p.click('#ka-q-next');await wait(p);const n0=await p.evaluate(()=>KAP._free.skip);await p.click('#ka-q-skip');await wait(p);ok(await p.evaluate((n)=>KAP._free.skip===n+1&&!!document.querySelector('.ka-q-opt'),n0),'free/'+mode+': skip gives a new question');
  await p.click('#ka-q-back');await wait(p);
 }
 const after=await p.evaluate(()=>({xp:localStorage.getItem('kap_xp'),st:localStorage.getItem('kap_quest_stats')}));
 ok(after.xp===before.xp&&after.st===before.st,'free practice never touches XP or quiz statistics');
 // free match: click-to-match, keyboard, drag
 await p.click('[data-free="match"]');await wait(p);
 ok(await p.evaluate(()=>document.querySelectorAll('.match-chip').length===4&&document.querySelectorAll('.match-target').length===4),'match board shows 4 chips + 4 targets');
 await p.evaluate(()=>{const ch=document.querySelectorAll('.match-chip')[0];ch.click();});
 ok(await p.evaluate(()=>document.querySelector('.match-chip.sel')!==null),'tap a muscle selects it');
 await p.evaluate(()=>{const s=document.querySelector('.match-chip.sel').dataset.slug;document.querySelector('.match-target[data-slot="'+s+'"]').click();});await wait(p,150);
 ok(await p.evaluate(()=>document.querySelectorAll('.match-chip.correct').length===1&&QUEST.matchPlaced===1),'tap muscle then its action = matched (no drag needed)');
 await p.evaluate(()=>{const c=[].filter.call(document.querySelectorAll('.match-chip'),x=>!x.classList.contains('placed'))[0];c.focus();});await p.keyboard.press('Enter');
 await p.evaluate(()=>{const s=document.querySelector('.match-chip.sel').dataset.slug;document.querySelector('.match-target[data-slot="'+s+'"]').focus();});await p.keyboard.press('Enter');await wait(p,150);
 ok(await p.evaluate(()=>QUEST.matchPlaced===2),'keyboard Enter/Space also matches');
 // drag
 const dr=await p.evaluate(()=>{const c=[].filter.call(document.querySelectorAll('.match-chip'),x=>!x.classList.contains('placed'))[0];const t=document.querySelector('.match-target[data-slot="'+c.dataset.slug+'"] .match-drop');const a=c.getBoundingClientRect(),z=t.getBoundingClientRect();return[a.left+a.width/2,a.top+a.height/2,z.left+z.width/2,z.top+z.height/2]});
 await p.mouse.move(dr[0],dr[1]);await p.mouse.down();await p.mouse.move((dr[0]+dr[2])/2,(dr[1]+dr[3])/2,{steps:4});await p.mouse.move(dr[2],dr[3],{steps:4});await p.mouse.up();await wait(p,200);
 ok(await p.evaluate(()=>QUEST.matchPlaced===3),'dragging still works');
 await p.evaluate(()=>{[].filter.call(document.querySelectorAll('.match-chip'),x=>!x.classList.contains('placed'))[0].click();const s=document.querySelector('.match-chip.sel').dataset.slug;document.querySelector('.match-target[data-slot="'+s+'"]').click();});await wait(p,200);
 ok(await p.evaluate(()=>/4 \/ 4|4\/4/.test(document.getElementById('match-count').textContent)&&!!document.querySelector('.ka-pairs')&&localStorage.getItem('kap_xp')==='250'),'finish -> pairs explained, still no XP in free mode');
 await p.evaluate(()=>buildQuestHome());
 // graded challenge keeps original behaviour
 await p.evaluate(()=>startQuest('name',false));await wait(p);
 ok(await p.evaluate(()=>!!document.querySelector('.quest-timer-bar')&&!!QUEST.timer&&QUEST.free===false),'challenge mode: original 10-second timer is back');
 await p.evaluate(()=>{const right=questCorrectVal(QUEST.q);[].filter.call(document.querySelectorAll('.quest-opt'),b=>b.dataset.qval===String(right))[0].click();});await wait(p,150);
 const gx=await p.evaluate(()=>({xp:+localStorage.getItem('kap_xp'),st:JSON.parse(localStorage.getItem('kap_quest_stats')).name}));ok(gx.xp>250&&gx.st.t===5&&gx.st.c===4,'challenge answers still earn XP and update stats ('+JSON.stringify(gx)+')');
 await p.evaluate(()=>buildQuestHome());
 await p.evaluate(()=>startQuest(null,true));await wait(p);
 for(let i=0;i<5;i++){await p.evaluate(()=>{const q=QUEST.q;const right=questCorrectVal(q);const bt=[].filter.call(document.querySelectorAll('.quest-opt'),b=>b.dataset.qval===String(right))[0];if(bt)bt.click();});await wait(p,120);await p.evaluate(()=>questNext());await wait(p,120);}
 ok(await p.evaluate(()=>!!document.querySelector('.quest-done')&&!!JSON.parse(localStorage.getItem('kap_streak_v1')||'{}').lastDaily),'daily challenge runs to the end and records the streak');
 await p.evaluate(()=>buildQuestHome());
 await p.evaluate(()=>{startQuest('clinical',false);});
 // pro unlocks clinical
 await p.evaluate(()=>{document.body.classList.remove('kap-simple');buildQuestHome();});
 ok(await p.evaluate(()=>!document.querySelector('[data-qmode="clinical"]').classList.contains('locked')),'clinical unlocks with detailed reading');
 await p.evaluate(()=>{document.body.classList.add('kap-simple');});
 await p.close();
 // ===================== TAKEAWAYS =====================
 p=await base({width:1440,height:900});
 await p.evaluate(()=>{localStorage.setItem('kap_xp','250');localStorage.setItem('ka_viewed_muscles',JSON.stringify(['chest','abs']));localStorage.setItem('ka_viewed_exercises',JSON.stringify(['squat','step_up','curl']));localStorage.setItem('ka_other_product','keep-me');goView('progress');});await wait(p);
 let t=await p.evaluate(()=>({empty:!!document.querySelector('.ka-tk-empty'),items:document.querySelectorAll('.ka-tk-list li').length,txt:document.querySelector('.ka-tk').innerText}));
 ok(t.empty&&t.items===0&&/還沒有收藏|Nothing saved yet/.test(t.txt),'empty state, nothing pre-filled');
 ok(/2 \/ 16/.test(t.txt)&&/3 \/ 40/.test(t.txt),'separate denominators: 2 / 16 common muscle groups, 3 / 40 movements');
 ok(await p.evaluate(()=>{const r=document.getElementById('ka-review');return r&&!r.open&&/Level|等級/.test(r.textContent);}),'advanced review (old XP/level/badges) lives in a collapsed section');
 await p.evaluate(()=>{document.getElementById('ka-review').open=true;});
 ok(await p.evaluate(()=>/Level 2|等級 2/.test(document.getElementById('ka-review').textContent)&&document.querySelectorAll('#ka-review .prog-badge').length>=9),'old XP 250 -> Level 2, badges present');
 await p.evaluate(()=>{goMain('squat');});await wait(p,400);await p.evaluate(()=>kapSaveTakeaway());await p.evaluate(()=>{KAP._detailTrigger=null;showMIDetail('quadriceps');});await wait(p,300);await p.click('#muscle-overlay .ka-fav-st');await p.evaluate(()=>closeMIO());await wait(p);
 await p.evaluate(()=>goView('progress'));await wait(p);
 t=await p.evaluate(()=>({items:document.querySelectorAll('.ka-tk-list li').length,names:[].map.call(document.querySelectorAll('.ka-tk-list b'),x=>x.textContent)}));ok(t.items===2,'saved movement + muscle listed: '+t.names.join(' / '));
 await p.reload();await wait(p,1200);await p.evaluate(()=>goView('progress'));await wait(p);
 ok(await p.evaluate(()=>document.querySelectorAll('.ka-tk-list li').length===2),'favourites survive a reload');
 await p.evaluate(()=>{document.querySelector('[data-tk-open^="exercises:"]').click();});await wait(p,300);ok(await p.evaluate(()=>KAP.view==='lab'&&cEx==='squat'),'"open again" returns to the movement');
 await p.evaluate(()=>goView('progress'));await wait(p);
 await p.click('#ka-tk-clear');await wait(p,100);
 ok(await p.evaluate(()=>!!document.querySelector('.ka-confirm')&&/只會清除|only clears/.test(document.querySelector('.ka-confirm').innerText)),'clearing asks first and states its scope');
 await p.click('#ka-tk-no');await wait(p,100);ok(await p.evaluate(()=>document.querySelectorAll('.ka-tk-list li').length===2),'cancel keeps everything');
 await p.click('#ka-tk-clear');await p.click('#ka-tk-yes');await wait(p,150);
 const cl=await p.evaluate(()=>({n:document.querySelectorAll('.ka-tk-list li').length,ui:JSON.parse(localStorage.getItem('kap_ui_v2')),xp:localStorage.getItem('kap_xp'),vm:localStorage.getItem('ka_viewed_muscles'),other:localStorage.getItem('ka_other_product')}));
 ok(cl.n===0&&cl.ui.favorites.exercises.length===0&&cl.xp==='250'&&cl.vm&&cl.other==='keep-me'&&cl.ui.readingDepth,'clearing removes only saved items; XP, viewed lists, other keys and reading depth stay');
 // remove one
 await p.evaluate(()=>{kapFavExercise('squat');kapFavExercise('step_up');buildProgress();});await p.click('[data-tk-rm="exercises:squat"]');await wait(p,100);ok(await p.evaluate(()=>document.querySelectorAll('.ka-tk-list li').length===1),'remove one item');
 await p.close();
 // storage blocked
 p=await base({width:1440,height:900},()=>{const t=()=>{throw new DOMException('blocked','SecurityError')};Storage.prototype.setItem=function(k,v){if(k==='kap_onboard_v1'||/^kap_coach_/.test(k))return Object.getPrototypeOf(this)&&0;t();};Storage.prototype.getItem=function(k){if(k==='kap_onboard_v1'||/^kap_coach_/.test(k))return '1';t();};Storage.prototype.removeItem=function(){t();};});
 await p.evaluate(()=>{goView('progress');});await wait(p);
 ok(await p.evaluate(()=>!!document.querySelector('.ka-banner')&&/暫時無法保存|Could not save/.test(document.querySelector('.ka-banner').innerText)),'storage blocked: the page still renders, with the "could not save this time" banner');
 await p.evaluate(()=>{goMain('squat');});await wait(p,400);
 const sb=await p.evaluate(()=>{try{kapSaveTakeaway();return document.querySelector('.toast,#toast')?document.querySelector('.toast,#toast').innerText:'';}catch(e){return'THROW '+e;}});ok(!/THROW/.test(sb)&&/無法保存|Could not save/.test(sb),'storage blocked: saving shows the message and does not throw ("'+sb+'")');
 await p.evaluate(()=>goView('progress'));await wait(p);ok(await p.evaluate(()=>document.querySelectorAll('.ka-tk-list li').length===1),'storage blocked: the item is kept for this tab only');
 await p.evaluate(()=>{goView('atlas');goView('quest');});await wait(p);ok(await p.evaluate(()=>!!document.querySelector('[data-free]')),'storage blocked: atlas and practice still open');
 await p.close();
 // ===================== LAYOUT =====================
 for(const [w,h,mob] of [[320,640,1],[390,844,1],[768,1024,0],[1440,900,0]]){
  p=await base({width:w,height:h},null,mob);
  for(const v of ['atlas','quest','progress']){await p.evaluate(v=>goView(v),v);await wait(p,300);
   const m=await p.evaluate(v=>{const el=document.getElementById('view-'+v);const doc=document.scrollingElement;const head=el.querySelector('.ka-pg-head');const pill=document.getElementById('kap-pillnav');const pr=pill&&pill.offsetParent!==null?pill.getBoundingClientRect():null;const hr=head&&head.getBoundingClientRect();let clip=0;el.querySelectorAll('*').forEach(e=>{const r=e.getBoundingClientRect();if(r.width&&r.right>innerWidth+1&&getComputedStyle(e).position!=='fixed')clip++;});
    return{docOver:doc.scrollWidth>innerWidth+1,viewOver:el.scrollWidth>el.clientWidth+1,clip,overlap:!!(pr&&hr&&hr.top<pr.bottom)};},v);
   ok(!m.docOver&&!m.viewOver&&m.clip===0&&!m.overlap,w+'px '+v+': no horizontal overflow, nothing clipped, heading clear of the nav ('+JSON.stringify(m)+')');}
  if(w===390){await p.evaluate(()=>goView('atlas'));await wait(p);await p.screenshot({path:OUT+'/S6_phone_atlas.png'});await p.evaluate(()=>goView('quest'));await wait(p);await p.click('[data-free="name"]');await wait(p);await p.screenshot({path:OUT+'/S6_phone_free_q.png'});await p.evaluate(()=>goView('progress'));await wait(p);await p.screenshot({path:OUT+'/S6_phone_takeaways.png'});}
  await p.close();}
 console.log('errs',errs.length?errs:'none');console.log('FAILS',fail);await b.close();
})();
