/* re-compress every art piece from art/originals and keep art-manifest.json (w,h,ref) in step.
   usage: node reprep-all.cjs   (edit PLAN below to trade quality for size) */
const {execFileSync}=require('child_process');const fs=require('fs'),path=require('path');
const O='../art/originals/';
const PLAN={ // name: [original file, longSide px, quality, keepTopFraction]
 skull_front:['skull_front.webp',260,.5],skull_back:['skull_posterior.webp',260,.5],
 thoracic_ribcage:['thoracic_ribcage.webp',400,.45],thoracic_ribcage_back:['thoracic_ribcage_posterior.webp',400,.45],
 pelvis_front:['pelvis_front.webp',340,.5],pelvis_back:['pelvis_posterior.webp',340,.5],
 cervical_spine:['cervical_spine.webp',300,.5],lumbar_spine:['lumbar_sacrum.webp',340,.5,.70],
 clavicle:['clavicle.webp',300,.5],scapula_posterior:['scapula_posterior.webp',250,.5],
 humerus:['humerus.webp',420,.5],forearm:['forearm.webp',420,.5],femur:['femur.webp',420,.5],tibia_fibula:['tibia_fibula.webp',420,.5],
 hand:['hand.webp',340,.5],foot:['foot.webp',380,.5],patella:['patella.webp',160,.5]};
const mp='art-manifest.json';const m=JSON.parse(fs.readFileSync(mp,'utf8'));let total=0;
for(const [n,[f,side,q,top]] of Object.entries(PLAN)){
 const out=execFileSync('node',['prep-art.cjs',n,O+f,String(side),String(q)].concat(top?[String(top)]:[]),{encoding:'utf8'});const r=JSON.parse(out.trim().split('\n').pop());total+=r.bytes;
 const e=m[n];if(!e){console.log('no manifest entry for',n);continue;}const fx=r.w/e.w,fy=r.h/e.h;if(e.ref)e.ref=[e.ref[0]*fx,e.ref[1]*fy,e.ref[2]*fx,e.ref[3]*fy].map(v=>+v.toFixed(2));e.w=r.w;e.h=r.h;
 console.log(n.padEnd(24),r.w+'x'+r.h,r.bytes);}
fs.writeFileSync(mp,JSON.stringify(m,null,1));console.log('total bytes',total);
