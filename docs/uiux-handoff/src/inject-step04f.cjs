const fs=require('fs');const [,, WORKER, JSFILE, ...pieces]=process.argv;
let w=fs.readFileSync(WORKER,'utf8').split('\n');const J=s=>'      '+JSON.stringify(s)+',';
// manifest: name:file:part:keys(comma)
const data={};
// manifest JSON: {name:{file,part,keys:[..],w,h,pair,box,sym,ref,xmode,xs,under}} (file relative to the manifest)
pieces.filter(p=>p.endsWith('.json')).forEach(mf=>{const m=JSON.parse(fs.readFileSync(mf,'utf8'));Object.keys(m).forEach(n=>{const {file,...o}=m[n];const buf=fs.readFileSync(require('path').resolve(require('path').dirname(mf),file));data[n]={href:'data:image/webp;base64,'+buf.toString('base64'),...o};});});
pieces.filter(p=>!p.endsWith('.json')).forEach(p=>{const [name,file,part,keys,w_,h_]=p.split(':');const buf=fs.readFileSync(file);data[name]={href:'data:image/webp;base64,'+buf.toString('base64'),w:+w_,h:+h_,keys:keys.split(','),part};});
const dataLine=J('window.KAP_ART_DATA='+JSON.stringify(data)+';');
let d=w.findIndex(l=>l.includes('window.KAP_ART_DATA='));
if(d>=0)w[d]=dataLine;else{const i=w.findIndex(l=>l.includes('function mountSkeleton(){'));w.splice(i,0,dataLine);}
const js=fs.readFileSync(JSFILE,'utf8').replace(/\s+$/,'').split('\n').map(J);
let a=w.findIndex(l=>l.includes('KA-UI-V2 Step 04f: illustrated bone pieces'));
if(a>=0){let e=w.findIndex((l,i)=>i>a&&l.includes('KA-UI-V2 Step 04f end'));w.splice(a,e-a+1,...js);}else{const i=w.findIndex(l=>l.includes('function mountSkeleton(){'));w.splice(i,0,...js);}
fs.writeFileSync(WORKER,w.join('\n'));console.log('art pieces:',Object.keys(data).join(','),'| data line chars',dataLine.length);
