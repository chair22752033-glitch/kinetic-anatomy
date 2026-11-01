/* == KA-UI-V2 Step 04f: illustrated bone pieces (raster) placed by the same fit as the vector bones == */
/* KAP_ART_DATA[piece] = {href:'data:image/webp;base64,..', w, h (cropped to alpha), keys:[vector ids it replaces; '@group' expands KAPFIT.groups[group]], part:'skull'|'axial'|'thigh'|'hand'|..,
   hideBc:true -> also hide the unnamed vector costal cartilages (.bc); pair:true -> a mirrored copy is drawn for the right side; box:[ids that define the placement box, default keys]; sym:true -> box is mirrored about the midline;
   ref:[x0,y0,x1,y1] region of the art (px) that is lined up with the box (default whole image); xmode:'h' keeps the art's aspect, 'box' stretches it to the box width; xs:x factor; under:true -> drawn just below the first replaced vector bone so bones that sit in front (patella, clavicle) stay on top} */
function kapArtKeys(a){var out=[];a.keys.forEach(function(k){if(k.charAt(0)==='@'){var g=(KAPFIT.groups||{})[k.slice(1)]||[];g.forEach(function(x){out.push(x);});}else out.push(k);});return out;}
function kapApplyArt(T){var root=document.querySelector('#bone-overlay .kap-anat');if(!root||typeof KAP_ART_DATA==='undefined'||!KAPFIT.srcBox)return;var NS='http://www.w3.org/2000/svg';
  if(!document.getElementById('kart-style')){var st=document.createElement('style');st.id='kart-style';st.textContent='.kap-anat .kart-hit.hl{opacity:.55!important}';document.head.appendChild(st);}
  var g=document.getElementById('kart');if(!g){g=document.createElementNS(NS,'g');g.id='kart';g.style.pointerEvents='none';root.appendChild(g);}
  var MIR=KAPFIT.MIR;
  Object.keys(KAP_ART_DATA).forEach(function(name){var a=KAP_ART_DATA[name];if(a.failed)return;
    var keys=kapArtKeys(a),bkeys=a.box?a.box:keys;var boxes=bkeys.map(function(id){return KAPFIT.srcBox[id]&&KAPFIT.srcBox[id].box;}).filter(Boolean);if(!boxes.length)return;
    var x0=Math.min.apply(null,boxes.map(function(b){return b.x0;})),y0=Math.min.apply(null,boxes.map(function(b){return b.y0;})),x1=Math.max.apply(null,boxes.map(function(b){return b.x1;})),y1=Math.max.apply(null,boxes.map(function(b){return b.y1;}));
    if(a.sym)x1=2*KAPFIT.cx0-x0;
    var ref=a.ref||[0,0,a.w,a.h],sy=(y1-y0)/(ref[3]-ref[1]),sx=(a.xmode==='box'?(x1-x0)/(ref[2]-ref[0]):sy)*(a.xs||1);
    var X=(x0+x1)/2-(ref[0]+ref[2])/2*sx,Y=y0-ref[1]*sy,W=a.w*sx,H=a.h*sy;
    var els=keys.map(function(id){return KAPFIT.els[id];}).filter(Boolean);
    function place(tag,el0,tf){var im=g.querySelector('[data-art="'+tag+'"]')||document.querySelector('#bone-overlay .kap-anat image[data-art="'+tag+'"]');
      if(!im){im=document.createElementNS(NS,'image');im.setAttribute('data-art',tag);im.setAttribute('preserveAspectRatio','none');im.style.pointerEvents='none';
        im.addEventListener('error',function(){a.failed=true;[].forEach.call(root.querySelectorAll('[data-kart-bc]'),function(n){n.style.display='';});[].forEach.call(root.querySelectorAll('image[data-art^="'+name+'"]'),function(n){n.remove();});keys.forEach(function(id){[KAPFIT.els[id],root.querySelector('[id="'+id.replace(/-L$/,'-R')+'"]')].forEach(function(e){if(e){e.style.opacity='';e.classList.remove('kart-hit');}});});});
        im.setAttribute('href',a.href);
        if(a.under&&el0&&el0.parentNode)el0.parentNode.insertBefore(im,el0);else g.appendChild(im);}
      im.setAttribute('x',X.toFixed(2));im.setAttribute('y',Y.toFixed(2));im.setAttribute('width',W.toFixed(2));im.setAttribute('height',H.toFixed(2));
      if(tf)im.setAttribute('transform',tf);else im.removeAttribute('transform');}
    function first(list){var f=null;list.forEach(function(e){if(e&&(!f||(f.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_PRECEDING)))f=e;});return f;}
    var mid=(a.part==='axial'||a.part==='skull');
    if(mid){place(name,first(els),T[a.part]);}
    else{place(name,first(els),T.L&&T.L[a.part]);
      if(a.pair){var rEls=keys.map(function(id){return root.querySelector('[id="'+id.replace(/-L$/,'-R')+'"]');}).filter(Boolean);var rt=T.R&&T.R[a.part];place(name+'-R',first(rEls)||first(els),(rt?rt+' ':'')+MIR);}}
    /* unnamed vector costal cartilages (.bc) belong to the ribcage art: hide them with it */
    if(a.hideBc){[].forEach.call(root.querySelectorAll('.bc'),function(n){var c=n;while(c.parentNode&&c.parentNode!==root&&c.parentNode.id!=='kax')c=c.parentNode;if(c&&c!==root){c.style.display='none';c.setAttribute('data-kart-bc','1');}});}
    /* the vector shapes stay as invisible hit areas (click / hover / wiki links unchanged); on hover/selection they show faintly */
    keys.forEach(function(id){[KAPFIT.els[id],root.querySelector('[id="'+id.replace(/-L$/,'-R')+'"]')].forEach(function(e){if(e){e.style.opacity='0';e.classList.add('kart-hit');}});});});}
/* == KA-UI-V2 Step 04f end == */
