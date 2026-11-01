/* == KA-UI-V2 Step 04f: illustrated bone pieces (raster) placed by the same fit as the vector bones == */
/* KAP_ART_DATA[piece] = {href:'data:image/webp;base64,..', w, h (cropped to alpha), keys:[vector ids it replaces], part:'skull'|..., mid:true for midline pieces} */
function kapApplyArt(T){var root=document.querySelector('#bone-overlay .kap-anat');if(!root||typeof KAP_ART_DATA==='undefined'||!KAPFIT.srcBox)return;var NS='http://www.w3.org/2000/svg';var g=document.getElementById('kart');if(!g){g=document.createElementNS(NS,'g');g.id='kart';g.style.pointerEvents='none';root.appendChild(g);}
  Object.keys(KAP_ART_DATA).forEach(function(name){var a=KAP_ART_DATA[name];if(a.failed)return;var boxes=a.keys.map(function(id){return KAPFIT.srcBox[id]&&KAPFIT.srcBox[id].box;}).filter(Boolean);if(!boxes.length)return;
    var x0=Math.min.apply(null,boxes.map(function(b){return b.x0;})),y0=Math.min.apply(null,boxes.map(function(b){return b.y0;})),x1=Math.max.apply(null,boxes.map(function(b){return b.x1;})),y1=Math.max.apply(null,boxes.map(function(b){return b.y1;}));
    var im=g.querySelector('[data-art="'+name+'"]');if(!im){im=document.createElementNS(NS,'image');im.setAttribute('data-art',name);im.setAttribute('preserveAspectRatio','none');im.addEventListener('error',function(){a.failed=true;im.remove();a.keys.forEach(function(id){var e=KAPFIT.els[id];if(e)e.style.opacity='';});});im.setAttribute('href',a.href);g.appendChild(im);}
    /* keep the art's own proportions, scaled so it spans the replaced vector bones' height, centred on them */
    var h=y1-y0,w=h*a.w/a.h,cx=(x0+x1)/2;im.setAttribute('x',(cx-w/2).toFixed(2));im.setAttribute('y',y0.toFixed(2));im.setAttribute('width',w.toFixed(2));im.setAttribute('height',h.toFixed(2));
    var t=T[a.part];if(t)im.setAttribute('transform',t);else im.removeAttribute('transform');
    /* the vector shapes stay as invisible hit areas (click / hover / wiki links unchanged) */
    a.keys.forEach(function(id){var e=KAPFIT.els[id];if(e)e.style.opacity='0';});});}
/* == KA-UI-V2 Step 04f end == */
