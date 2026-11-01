const fs=require('fs');
const [,, WORKER, JSFILE]=process.argv;
let w=fs.readFileSync(WORKER,'utf8').split('\n');
const J=s=>'      '+JSON.stringify(s)+',';
function rep(pred,fn,label){const i=w.findIndex(pred);if(i<0){console.log('SKIP: '+label);return false;}fn(i);console.log('ok: '+label);return true;}
// 1. fit module (idempotent)
const js=fs.readFileSync(JSFILE,'utf8').replace(/\s+$/,'').split('\n').map(J);
let a=w.findIndex(l=>l.includes('KA-UI-V2 Step 04b: skeleton registration'));
if(a>=0){let e=w.findIndex((l,i)=>i>a&&l.includes('KA-UI-V2 Step 04b end'));w.splice(a,e-a+1,...js);console.log('ok: fit module replaced');}
else{const i=w.findIndex(l=>l.includes('function mountSkeleton(){'));if(i<0)throw 'no mountSkeleton';w.splice(i,0,...js);console.log('ok: fit module inserted');}
// 2. setBoneFit -> overlay sync (old version looked for a #kap-fit group that no longer exists)
rep(l=>l.includes('function setBoneFit(){')&&!l.includes('kapSyncOverlay'),i=>{w[i]=J("function setBoneFit(){if(typeof kapSyncOverlay==='function')kapSyncOverlay();}");},'setBoneFit');
// 3. clone mirrored <use> before wiring
rep(l=>l.includes('function mountSkeleton(){')&&!l.includes('kapCloneMirrors'),i=>{w[i]=w[i].replace("KAP_ANAT.mount(bo);bo.dataset.kapMounted='1';","KAP_ANAT.mount(bo);kapCloneMirrors(bo);bo.dataset.kapMounted='1';");},'mountSkeleton clone');
// 4. vec(): fit after the layer is visible
rep(l=>l.includes('function syncBoneLayer(){')&&!l.includes('kapSyncOverlay'),i=>{w[i]=w[i].replace("if(ov)ov.style.display='block';}if(!on)","if(ov)ov.style.display='block';if(typeof kapSyncOverlay==='function')kapSyncOverlay();}if(!on)");},'syncBoneLayer fit');
fs.writeFileSync(WORKER,w.join('\n'));
