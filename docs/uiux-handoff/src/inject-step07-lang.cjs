const fs=require('fs');const [,, WORKER, JSFILE]=process.argv;
let w=fs.readFileSync(WORKER,'utf8').split('\n');const J=s=>'      '+JSON.stringify(s)+',';
const js=fs.readFileSync(JSFILE,'utf8').replace(/\s+$/,'').split('\n').map(J);
const a=w.findIndex(l=>l.includes('KA-UI-V2 Step 07 lang: Chinese-only'));
if(a>=0){const e=w.findIndex((l,i)=>i>a&&l.includes('Step 07 lang end'));w.splice(a,e-a+1,...js);console.log('lang module replaced');}
else{const k=w.findIndex(l=>l.includes('KA-UI-V2 Step 06 end'));if(k<0)throw 'no step06 end';w.splice(k+1,0,...js);console.log('lang module inserted');}
fs.writeFileSync(WORKER,w.join('\n'));
