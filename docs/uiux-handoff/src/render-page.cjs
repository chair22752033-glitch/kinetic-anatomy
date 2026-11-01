const fs=require('fs'),vm=require('vm');
const [,, worker, out]=process.argv;
let h=null;
vm.runInNewContext(fs.readFileSync(worker,'utf8'),{URL,Response,addEventListener:(k,f)=>{if(k==='fetch')h=f}},{timeout:5000});
let p;h({request:{url:'https://x.invalid/',method:'GET'},respondWith:x=>{p=x}});
p.then(r=>r.text()).then(t=>{fs.writeFileSync(out,t);console.log('page.html',t.length)});
