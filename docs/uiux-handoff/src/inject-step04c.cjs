const fs=require('fs');const [,, WORKER, JSFILE]=process.argv;
let w=fs.readFileSync(WORKER,'utf8').split('\n');const J=s=>'      '+JSON.stringify(s)+',';
const js=fs.readFileSync(JSFILE,'utf8').replace(/\s+$/,'').split('\n').map(J);
let a=w.findIndex(l=>l.includes('KA-UI-V2 Step 04c-d: legend + canvas zoom'));
if(a>=0){let e=w.findIndex((l,i)=>i>a&&l.includes('KA-UI-V2 Step 04c-d end'));w.splice(a,e-a+1,...js);console.log('ok: replaced');}
else{const i=w.findIndex(l=>l.includes('function mountSkeleton(){'));w.splice(i,0,...js);console.log('ok: inserted before mountSkeleton');}
// renderSVG: tell idle (non-participating) muscles and stabilisers apart so the UI can colour roles honestly
const ri=w.findIndex(l=>l.includes("if(im&&m){fc=m.col;if(m.role==='agonist')"));
if(ri>=0&&!w[ri].includes('mp-idle')){w[ri]=w[ri].replace("if(im&&m){fc=m.col;","if(im&&!m)cl+=' mp-idle';if(im&&m&&m.role==='stabilizer')cl+=' mp-stab';if(im&&m){fc=m.col;");console.log('ok: role classes');}else console.log('SKIP: role classes');
fs.writeFileSync(WORKER,w.join('\n'));
