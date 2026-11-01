/* == KA-UI-V2 Step 03: home + library search == */
var KAP_EX_ALIAS={squat:['坐下','站起','站起來','蹲下','蹲','sit','stand','sit to stand'],overhead_press:['舉高','把手舉高','高處','拿高處','拿東西','上舉','reach'],step_up:['階梯','樓梯','上階','台階','跨上','stairs','stair'],stair_climbing:['爬樓梯','樓梯','階梯','stairs'],running:['跑','跑步','慢跑','run','jog']};
var KAP_HAY={};
function kapNorm(s){return String(s==null?'':s).toLowerCase().replace(/[_\s]+/g,' ').trim();}
function kapExHay(k){if(KAP_HAY[k])return KAP_HAY[k];var ex=EX[k];var parts=[k,ex.ten,ex.tzh,CAT_EN[ex.cat],CAT_ZH[ex.cat],EQUIP_EN[ex.equip],EQUIP_ZH[ex.equip]];(ex.muscles||[]).forEach(function(m){parts.push(m.en,m.zh);});(KAP_EX_ALIAS[k]||[]).forEach(function(a){parts.push(a);});KAP_HAY[k]=kapNorm(parts.join(' | '));return KAP_HAY[k];}
function kapExMatch(k,q){q=kapNorm(q);if(!q)return true;var h=kapExHay(k);return q.split(' ').every(function(t){return h.indexOf(t)>=0;});}
function kapLibFiltersActive(){return KAP.libCat!=='all'||KAP.libEquip!=='all'||KAP.libRegion!=='all'||!!kapNorm(KAP.libQuery);}
function kapLibSyncClear(){var c=document.getElementById('lib-search-clear');if(c)c.classList.toggle('on',!!(KAP.libQuery));}
function kapLibClearAll(){KAP.libCat='all';KAP.libEquip='all';KAP.libRegion='all';KAP.libQuery='';buildLibSheet();}
function kapPreviewSVG(key,hi){var vb=VB[key],parts=BODY_PATHS[key]||[],h='';parts.forEach(function(p){var on=hi.indexOf(p.slug)>=0;['common','left','right'].forEach(function(s){(p[s]||[]).forEach(function(d){h+='<path d="'+d+'" fill="'+(on?'#B7523B':'#C9D1C5')+'"/>';});});});return '<svg viewBox="'+vb+'" aria-hidden="true" focusable="false">'+h+'</svg>';}
function kapHomeInit(){
  var f=document.getElementById('ka-pv-f'),b=document.getElementById('ka-pv-b');
  if(f&&!f.firstChild){try{f.innerHTML=kapPreviewSVG('maleFront',['quadriceps']);b.innerHTML=kapPreviewSVG('maleBack',['gluteal']);}catch(e){}}
  var nEx=Object.keys(EX).length,nMu=Object.keys(WIKI_MUSCLES_DB).length,nBo=Object.keys(WIKI_BONES_DB).length;
  document.querySelectorAll('.ka-nex').forEach(function(e){e.textContent=nEx;});
  var c=document.getElementById('ka-counts');if(c)c.innerHTML='<span class="le">'+nEx+' movements · '+nMu+' muscle entries · '+nBo+' bone entries</span><span class="lz" style="display:none">'+nEx+' 個動作 · '+nMu+' 筆肌肉百科 · '+nBo+' 筆骨骼百科</span>';
  if(typeof lang!=='undefined'&&lang==='zh'){document.querySelectorAll('#home .le').forEach(function(e){e.style.display='none';});document.querySelectorAll('#home .lz').forEach(function(e){e.style.display='';});}
  if(kapHomeInit.done)return;kapHomeInit.done=true;
  document.querySelectorAll('[data-life]').forEach(function(el){el.addEventListener('click',function(){var k=this.dataset.life;if(EX[k])goMain(k);});});
  document.querySelectorAll('[data-goview]').forEach(function(el){el.addEventListener('click',function(){goView(this.dataset.goview);});});
  var ol=document.getElementById('ka-open-lib');if(ol)ol.addEventListener('click',function(){KAP._libTrigger=this;openLibSheet();});
}
/* == KA-UI-V2 Step 03 end == */
