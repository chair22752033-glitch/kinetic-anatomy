/* usage: node prep-art.cjs <name> <input image> <maxLongSidePx> [quality 0-1]  -> writes art/<name>.webp and prints {w,h,bytes}
   crops to the alpha bounding box, keeps the aspect, re-encodes as WebP with alpha (headless Chromium canvas) */
const { chromium } = require(process.env.PW||'/opt/node22/lib/node_modules/playwright');const fs=require('fs'),path=require('path');
const [,, name, input, maxSide, q]=process.argv;
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});const p=await(await b.newContext()).newPage();
const ext=path.extname(input).slice(1).toLowerCase();const data='data:image/'+(ext==='jpg'?'jpeg':ext)+';base64,'+fs.readFileSync(input).toString('base64');
const r=await p.evaluate(async([d,max,q])=>{const img=new Image();img.src=d;await img.decode();let c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;let x=c.getContext('2d');x.drawImage(img,0,0);const W=c.width,H=c.height,px=x.getImageData(0,0,W,H).data;
 let x0=W,y0=H,x1=0,y1=0;for(let y=0;y<H;y++)for(let i=0;i<W;i++){if(px[(y*W+i)*4+3]>12){if(i<x0)x0=i;if(i>x1)x1=i;if(y<y0)y0=y;if(y>y1)y1=y;}}
 const cw=x1-x0+1,ch=y1-y0+1,s=Math.min(1,max/Math.max(cw,ch));const ow=Math.round(cw*s),oh=Math.round(ch*s);const o=document.createElement('canvas');o.width=ow;o.height=oh;const ox=o.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(c,x0,y0,cw,ch,0,0,ow,oh);
 const blob=await new Promise(res=>o.toBlob(res,'image/webp',q));const buf=new Uint8Array(await blob.arrayBuffer());let bin='';for(let i=0;i<buf.length;i+=8192)bin+=String.fromCharCode.apply(null,buf.subarray(i,i+8192));return{w:ow,h:oh,srcW:W,srcH:H,crop:[x0,y0,x1,y1],b64:btoa(bin),bytes:buf.length};},[data,+maxSide,+(q||.82)]);
const out=path.join(__dirname,'..','art',name+'.webp');fs.writeFileSync(out,Buffer.from(r.b64,'base64'));console.log(JSON.stringify({name,w:r.w,h:r.h,bytes:r.bytes,crop:r.crop,from:[r.srcW,r.srcH]}));await b.close();})();
