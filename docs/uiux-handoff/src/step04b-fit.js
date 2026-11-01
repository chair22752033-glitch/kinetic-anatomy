/* == KA-UI-V2 Step 04b: skeleton registration (fit KAP_ANAT bones to the muscle figure of the current view) == */
var KAPFIT={MIR:'matrix(-1 0 0 1 727 0)',cx0:363.5,els:{},src:null,groups:null,done:false};
function kapGeo(el){var out=[];if(el.getTotalLength){out.push(el);}else{el.querySelectorAll('path,ellipse,circle,line,rect,polygon,polyline').forEach(function(g){if(g.getTotalLength)out.push(g);});}return out;}
function kapPts(els,step){var pts=[];els.forEach(function(e){kapGeo(e).forEach(function(g){var len=0;try{len=g.getTotalLength();}catch(x){return;}if(!len)return;var n=Math.max(4,Math.min(60,Math.ceil(len/(step||5))));for(var i=0;i<=n;i++){var p=g.getPointAtLength(len*i/n);pts.push([p.x,p.y]);}});});return pts;}
function kapBox(p){var x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;p.forEach(function(q){if(q[0]<x0)x0=q[0];if(q[0]>x1)x1=q[0];if(q[1]<y0)y0=q[1];if(q[1]>y1)y1=q[1];});return{x0:x0,y0:y0,x1:x1,y1:y1,w:x1-x0,h:y1-y0,cx:(x0+x1)/2,cy:(y0+y1)/2};}
function kapMean(a,i){var s=0;a.forEach(function(q){s+=q[i];});return a.length?s/a.length:0;}
/* axis of a point cloud running top->bottom: [A,B] using the mean x of the top / bottom bands */
function kapAxis(p,band){var b=kapBox(p),k=b.h*(band||.1);var t=p.filter(function(q){return q[1]<=b.y0+k;}),m=p.filter(function(q){return q[1]>=b.y1-k;});return[[kapMean(t,0),b.y0],[kapMean(m,0),b.y1]];}
function kapLerp(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}
/* similarity along an axis: A->A2, B->B2, scaling only along the axis (thickness kept) */
function kapSeg(A,B,A2,B2){var dx=B[0]-A[0],dy=B[1]-A[1],ex=B2[0]-A2[0],ey=B2[1]-A2[1];var L=Math.hypot(dx,dy)||1,L2=Math.hypot(ex,ey)||1;var k=L2/L;var a1=Math.atan2(dy,dx),a2=Math.atan2(ey,ex);var c1=Math.cos(-a1),s1=Math.sin(-a1),c2=Math.cos(a2),s2=Math.sin(a2);
  /* p' = A2 + R(a2) * S(k,1) * R(-a1) * (p - A) */
  var m11=c2*k*c1-s2*s1,m12=-c2*k*s1-s2*c1,m21=s2*k*c1+c2*s1,m22=-s2*k*s1+c2*c1;
  var e=A2[0]-(m11*A[0]+m12*A[1]),f=A2[1]-(m21*A[0]+m22*A[1]);
  return 'matrix('+[m11,m21,m12,m22,e,f].map(function(v){return +v.toFixed(5);}).join(' ')+')';}
/* group an L-element into the part of the body it belongs to */
function kapPart(id,box){var k=id.replace(/-L$/,'');
  if(/^(skull|mandible)$/.test(k))return'skull';
  if(/^(c\d-vertebra|t\d+-vertebra|l\d-vertebra|sacrum|coccyx|sternum|rib-\d+|pelvis|clavicle|scapula)$/.test(k))return'axial';
  if(k==='humerus')return'uarm';
  if(/^(radius|ulna)$/.test(k))return'farm';
  if(/^(femur|patella)$/.test(k))return'thigh';
  if(/^(tibia|fibula)$/.test(k))return'shin';
  if(box.cy>=745&&box.cy<=900&&box.cx<270)return'hand';
  if(box.cy>=1235&&box.cx<340)return'foot';
  return'axial';}
/* mirrored copies: a <use> loses the stylesheet inside its shadow tree (right-hand bones rendered black) -> real clones; run BEFORE KAP_ANAT.wire */
function kapCloneMirrors(bo){var root=bo&&bo.querySelector('.kap-anat');if(!root)return;[].slice.call(root.querySelectorAll('use')).forEach(function(u){var href=(u.getAttribute('href')||u.getAttribute('xlink:href')||'');var ref=href?root.querySelector('[id="'+href.replace(/^#/,'')+'"]'):null;if(!ref)return;var c=ref.cloneNode(true);c.removeAttribute('transform');[].forEach.call(c.querySelectorAll('[id]'),function(n){n.removeAttribute('id');});c.id=u.id;c.setAttribute('data-key',u.getAttribute('data-key')||ref.getAttribute('data-key')||'');c.setAttribute('data-kapside','R');u.parentNode.replaceChild(c,u);});}
function kapFitInit(bo){var root=bo&&bo.querySelector('.kap-anat');if(!root||KAPFIT.done)return;var saved={};['kax','kbf','kbb'].forEach(function(id){var g=document.getElementById(id);if(g){saved[id]=g.style.display;g.style.display='';}});try{kapFitInit2(bo,root);}finally{Object.keys(saved).forEach(function(id){document.getElementById(id).style.display=saved[id];});}}
function kapFitInit2(bo,root){

  var els={},src={};[].forEach.call(root.querySelectorAll('[data-key]'),function(e){if(e.getAttribute('data-kapside')==='R'||!e.id)return;var b=kapBox(kapPts([e],6));if(!isFinite(b.w))return;els[e.id]=e;src[e.id]={box:b,part:kapPart(e.id,b),pts:null};});
  var groups={};Object.keys(src).forEach(function(id){var p=src[id].part;(groups[p]=groups[p]||[]).push(id);});
  var gp=function(part){var a=[];(groups[part]||[]).forEach(function(id){a=a.concat(kapPts([els[id]],6));});return a;};
  KAPFIT.els=els;KAPFIT.groups=groups;KAPFIT.srcBox=src;KAPFIT.srcAx={uarm:kapAxis(gp('uarm'),.08),farm:kapAxis(gp('farm'),.08),thigh:kapAxis(gp('thigh'),.06),shin:kapAxis(gp('shin'),.06),foot:null,hand:null,skull:kapBox(kapPts([els.skull],5))};
  var hp=gp('hand');var hb=kapBox(hp);KAPFIT.srcAx.hand=[[kapMean(hp.filter(function(q){return q[1]<=hb.y0+hb.h*.12;}),0),hb.y0],[hb.cx,hb.y1]];
  var fp=gp('foot');var fb=kapBox(fp);KAPFIT.srcAx.foot=[[kapMean(fp.filter(function(q){return q[1]<=fb.y0+fb.h*.2;}),0),fb.y0+2],[kapMean(fp.filter(function(q){return q[1]>=fb.y1-fb.h*.2;}),0),fb.y1]];
  KAPFIT.done=true;}
/* body landmarks of the CURRENT view, measured from BODY_PATHS data in an off-screen svg (works whatever layers are visible; cached per view) */
var KAPM={svg:null,cache:{}};
function kapMeasureSvg(){if(!KAPM.svg){var s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('width','10');s.setAttribute('height','10');s.setAttribute('aria-hidden','true');s.style.cssText='position:fixed;left:-99999px;top:0;visibility:hidden;pointer-events:none';document.body.appendChild(s);KAPM.svg=s;}return KAPM.svg;}
function kapBodyEls(slugs,bucket){var parts=BODY_PATHS[vk()]||[],svg=kapMeasureSvg(),out=[];parts.forEach(function(p){if(slugs.indexOf(p.slug)<0)return;['common','left','right'].forEach(function(side){(p[side]||[]).forEach(function(d){var el=document.createElementNS('http://www.w3.org/2000/svg','path');el.setAttribute('d',d);svg.appendChild(el);out.push(el);});});});return out;}
function kapSidePts(els,side,cx){var use=els.filter(function(e){var b=e.getBBox();var c=b.x+b.width/2;return side==='L'?c<cx:c>=cx;});return kapPts(use,5);}
function kapLandmarks(){var key=vk();if(KAPM.cache[key])return KAPM.cache[key];var parts=BODY_PATHS[key]||[];if(!parts.length)return null;var svg=kapMeasureSvg();
  var has=function(sl){return parts.some(function(p){return p.slug===sl;});};var back=!has('quadriceps');
  var headEls=kapBodyEls(['head']),hairEls=kapBodyEls(['hair']),neckEls=kapBodyEls(['neck']);
  var hd=kapPts(headEls,4);if(back||!hd.length)hd=hd.concat(kapPts(hairEls,4));if(!hd.length){svg.innerHTML='';return null;}var hb=kapBox(hd),cx=hb.cx;
  var nk=kapPts(neckEls,4);var nb=nk.length?kapBox(nk):null;if(nb)cx=nb.cx;
  var out={cx:cx,head:hb,neck:nb,back:back,L:{},R:{}};
  var E={};['deltoids','biceps','triceps','forearm','hands','hamstring','quadriceps','knees','tibialis','calves','ankles','feet','gluteal'].forEach(function(sl){E[sl]=kapBodyEls([sl]);});
  ['L','R'].forEach(function(s){var P=function(a){var els=[];a.forEach(function(sl){els=els.concat(E[sl]||[]);});return kapSidePts(els,s,cx);};
    var ub=P(['deltoids','biceps','triceps']),arm=P(['biceps','triceps']),fa=P(['forearm']),ha=P(['hands']);
    var th=P(back?['hamstring']:['quadriceps']),kn=P(['knees']),sh=P(back?['calves']:['tibialis','calves']),an=P(['ankles']),ft=P(['feet']),gl=P(['gluteal']);
    var o={};
    if(ub.length&&fa.length){var uax=kapAxis(ub,.1);var fax=kapAxis(fa,.1);var elbowY=arm.length?kapBox(arm).y1:fax[0][1];var J1=[(fax[0][0]+kapAxis(arm.length?arm:ub,.1)[1][0])/2,(fax[0][1]+elbowY)/2];var J0=kapLerp(uax[0],uax[1],.12);var J2=fax[1];var J3=J2;if(ha.length){var far=0;ha.forEach(function(q){var d=Math.hypot(q[0]-J2[0],q[1]-J2[1]);if(d>far){far=d;J3=q;}});}o.J0=J0;o.J1=J1;o.J2=J2;o.J3=J3;}
    if(th.length){var tax=kapAxis(th,.08);var gb=gl.length?kapBox(gl):null;o.H=(back&&gb)?[tax[0][0],gb.y0+gb.h*.55]:kapLerp(tax[0],tax[1],.05);
      var sax=sh.length?kapAxis(sh,.08):null;if(kn.length){var kb=kapBox(kn);o.K=[kb.cx,kb.cy];}else{o.K=sax?kapLerp(tax[1],sax[0],.5):tax[1];}
      if(an.length){var ab=kapBox(an);o.A=[ab.cx,ab.cy];}else if(sax){o.A=sax[1];}
      if(ft.length){var fb=kapBox(ft);o.F=[fb.cx,fb.y1-3];}}
    out[s]=o;});
  svg.innerHTML='';KAPM.cache[key]=out;return out;}
function kapMirrorPt(p){return[2*KAPFIT.cx0-p[0],p[1]];}
function kapFitBones(){var bo=document.getElementById('bone-overlay');if(!bo||bo.style.display==='none')return;var root=bo.querySelector('.kap-anat');if(!root)return;try{kapFitInit(bo);}catch(e){return;}if(!KAPFIT.done)return;
  var lm=kapLandmarks();if(!lm)return;var S=KAPFIT.srcAx,E=KAPFIT.els,MIR=KAPFIT.MIR;
  var T={};/* transform per part per side */
  /* axial: head top -> skull top and hip height -> femoral head, x shifted to the body midline */
  var sk=S.skull;var hipL=lm.L.H||lm.R.H;var hipY=hipL?hipL[1]:null;
  var srcHipY=S.thigh[0][1];
  /* skull: sized from the torso (head paths are unreliable from behind), seated on top of the neck */
  var neckY0=lm.neck?lm.neck.y0:lm.head.y1-lm.head.h*.12;var skH=hipY!==null?Math.max(60,.29*(hipY-neckY0)):lm.head.h;var skBot=neckY0+.11*skH,skTop=skBot-skH;
  var sy=1,ty=0;if(hipY!==null){var topSrc=252,topDst=skBot-skH*.05;sy=(hipY-topDst)/(srcHipY-topSrc);sy=Math.max(.7,Math.min(1.4,sy));ty=topDst-sy*topSrc;}
  var dx=lm.cx-KAPFIT.cx0;var ks=Math.max(.5,Math.min(1.3,skH/sk.h));T.skull='matrix('+ks.toFixed(5)+' 0 0 '+ks.toFixed(5)+' '+(lm.cx-ks*sk.cx).toFixed(2)+' '+(skTop-ks*sk.y0).toFixed(2)+')';T.axial='matrix(1 0 0 '+sy.toFixed(5)+' '+dx.toFixed(2)+' '+ty.toFixed(2)+')';
  ['L','R'].forEach(function(s){var o=lm[s],mk=function(part,A,B,a,b){return(A&&B)?kapSeg(a,b,A,B):null;};
    var m=function(p){return s==='L'?p:kapMirrorPt(p);};/* source axes are for the L bones; for R fit against mirrored source */
    var sa=function(ax){return s==='L'?ax:[kapMirrorPt(ax[0]),kapMirrorPt(ax[1])];};
    T[s]={};
    if(o.J0&&o.J1){T[s].uarm=kapSeg(sa(S.uarm)[0],sa(S.uarm)[1],o.J0,o.J1);T[s].farm=kapSeg(sa(S.farm)[0],sa(S.farm)[1],o.J1,o.J2);T[s].hand=kapSeg(sa(S.hand)[0],sa(S.hand)[1],o.J2,o.J3);}
    if(o.H&&o.K){T[s].thigh=kapSeg(sa(S.thigh)[0],sa(S.thigh)[1],o.H,o.K);}
    if(o.K&&o.A){T[s].shin=kapSeg(sa(S.shin)[0],sa(S.shin)[1],o.K,o.A);}
    if(o.A&&o.F){T[s].foot=kapSeg(sa(S.foot)[0],sa(S.foot)[1],o.A,o.F);}
  });
  Object.keys(E).forEach(function(id){var part=KAPFIT.groups&&Object.keys(KAPFIT.groups).filter(function(g){return KAPFIT.groups[g].indexOf(id)>=0;})[0];if(!part)return;
    var isMid=!/-L$/.test(id);var mid=(part==='axial'||part==='skull');var Lt=mid?T[part]:(T.L&&T.L[part]);var Rt=mid?T[part]:(T.R&&T.R[part]);
    if(Lt)E[id].setAttribute('transform',Lt);else E[id].removeAttribute('transform');
    if(isMid)return;var rid=id.replace(/-L$/,'-R');var re=root.querySelector('[id="'+rid+'"]');if(re){if(mid){re.setAttribute('transform',T[part]+' '+MIR);}else if(Rt){re.setAttribute('transform',Rt+' '+MIR);}else re.setAttribute('transform',MIR);}});
  KAPFIT.lastLM=lm;KAPFIT.lastT=T;if(typeof kapApplyArt==='function')kapApplyArt(T);}
function kapSyncOverlay(){var bo=document.getElementById('bone-overlay'),n=bo&&bo.querySelector('.kap-anat'),bs=document.getElementById('bsvg'),ca=document.getElementById('ca');if(!bo||!n||!bs||!ca)return;var vs=bs.getAttribute('viewBox')||'0 95 727 1280';var v=vs.split(/\s+/).map(parseFloat);
  /* overlay box == body svg box (the canvas has padding for the controls), same viewBox -> identical scale in every view */
  var br=bs.getBoundingClientRect(),cr=ca.getBoundingClientRect();if(br.width>1){bo.style.left=(br.left-cr.left)+'px';bo.style.top=(br.top-cr.top)+'px';bo.style.width=br.width+'px';bo.style.height=br.height+'px';}
  bo.setAttribute('viewBox',vs);n.setAttribute('viewBox',vs);n.setAttribute('preserveAspectRatio','none');n.setAttribute('x',v[0]);n.setAttribute('y',v[1]);n.setAttribute('width',v[2]);n.setAttribute('height',v[3]);n.style.width='';n.style.height='';
  var back=(typeof cSd!=='undefined')&&cSd==='back';var kf=document.getElementById('kbf');if(kf){if(back)kf.style.display='';[].forEach.call(kf.querySelectorAll('[data-key^="patella"]'),function(e){e.style.display=back?'none':'';});}
  kapFitBones();}
/* keep the overlay glued to the body svg when the canvas resizes (window, side panel, orientation) */
(function(){var raf=0;function again(){var bo=document.getElementById('bone-overlay');if(!bo||bo.style.display==='none'||!bo.querySelector('.kap-anat'))return;if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(function(){raf=0;kapSyncOverlay();});}window.addEventListener('resize',again);window.addEventListener('orientationchange',again);if(typeof ResizeObserver!=='undefined'){var ca=document.getElementById('ca');if(ca)new ResizeObserver(again).observe(ca);}})();
/* == KA-UI-V2 Step 04b end == */
