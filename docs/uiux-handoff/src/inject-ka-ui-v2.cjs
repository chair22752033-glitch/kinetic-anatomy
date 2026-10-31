const fs=require('fs');
const [,, WORKER, CSSFILE]=process.argv;
let w=fs.readFileSync(WORKER,'utf8').split('\n');
const J=s=>'      '+JSON.stringify(s)+',';
// 1) CSS block (idempotent)
const css=fs.readFileSync(CSSFILE,'utf8').replace(/\s+$/,'').split('\n');
const cssBlock=css.map(J);
let b=w.findIndex(l=>l.includes('KA-UI-V2 (Step 02)'));
if(b>=0){let e=w.findIndex((l,i)=>i>b&&l.includes('/KA-UI-V2 =='));w.splice(b,e-b+1,...cssBlock);}
else{const i=w.findIndex(l=>l.includes('"</style></head><body>"'));if(i<0)throw 'no style end';w.splice(i,0,...cssBlock);}
// 2) static nav -> empty containers built from KAP_ROUTES
let n1=w.findIndex(l=>l.includes('<nav class="kap-pillnav" id="kap-pillnav">'));
if(n1>=0){let e=w.findIndex((l,i)=>i>n1&&l.trim()==='"</nav>",');w.splice(n1,e-n1+1,"      '<nav class=\"kap-pillnav\" id=\"kap-pillnav\" aria-label=\"Main\"></nav>',");}
let n2=w.findIndex(l=>l.includes('<nav class="kap-tabs" id="kap-tabs">'));
if(n2>=0){let e=w.findIndex((l,i)=>i>n2&&l.trim()==='"</nav>",');w.splice(n2,e-n2+1,"      '<nav class=\"kap-tabs\" id=\"kap-tabs\" aria-label=\"Main\"></nav>',");}
// 3) JS: route table + builder + sync wrappers (idempotent)
const js=[
"/* == KA-UI-V2: one route table feeds the desktop pill nav and the mobile tab bar == */",
"var KAP_ROUTES=[",
"{view:'home',also:['lab'],zh:'生活動作',en:'Daily Moves',ico:'<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"m15.5 8.5-2 5-5 2 2-5z\"/>'},",
"{view:'atlas',zh:'身體圖譜',en:'Body Atlas',ico:'<path d=\"M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z\"/><path d=\"M12 6v13.5\"/>'},",
"{view:'quest',zh:'輕鬆練習',en:'Easy Practice',ico:'<path d=\"M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>'},",
"{view:'progress',zh:'我的重點',en:'My Notes',ico:'<path d=\"M7 4h10a1 1 0 0 1 1 1v15l-6-3.5L6 20V5a1 1 0 0 1 1-1z\"/>'}",
"];",
"function kapBuildNav(){['kap-pillnav','kap-tabs'].forEach(function(id){var n=document.getElementById(id);if(!n)return;n.innerHTML=KAP_ROUTES.map(function(r){return '<button type=\"button\" data-view=\"'+r.view+'\" aria-label=\"'+r.zh+' / '+r.en+'\"><svg class=\"kap-nav-ico\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">'+r.ico+'</svg><span class=\"le\"'+(lang==='zh'?' style=\"display:none\"':'')+'>'+r.en+'</span><span class=\"lz\"'+(lang==='zh'?'':' style=\"display:none\"')+'>'+r.zh+'</span></button>';}).join('');});}",
"function kapSyncNav(){var v=(typeof KAP!=='undefined')?KAP.view:'home';document.querySelectorAll('.kap-tabs button,.kap-pillnav button').forEach(function(b){var r=KAP_ROUTES.filter(function(x){return x.view===b.dataset.view;})[0];var on=!!(r&&(r.view===v||(r.also&&r.also.indexOf(v)>=0)));b.classList.toggle('on',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});}",
"kapBuildNav();",
"(function(){var gh=goHome,gm=goMain,gv=goView;goHome=function(){var r=gh.apply(this,arguments);kapSyncNav();return r;};goMain=function(){var r=gm.apply(this,arguments);kapSyncNav();return r;};goView=function(){var r=gv.apply(this,arguments);kapSyncNav();return r;};})();",
"kapSyncNav();",
];
const jsBlock=js.map(J);
let a=w.findIndex(l=>l.includes('KA-UI-V2: one route table'));
if(a>=0){let e=w.findIndex((l,i)=>i>a&&l.trim()==='"kapSyncNav();",');w.splice(a,e-a+1,...jsBlock);}
else{const i=w.findIndex(l=>l.includes("document.querySelectorAll('.kap-tabs button,.kap-pillnav button').forEach(function(b){b.addEventListener"));if(i<0)throw 'no bind line';w.splice(i,0,...jsBlock);}
fs.writeFileSync(WORKER,w.join('\n'));
console.log('injected');
