// OPFS writer: streams received chunks straight to disk (no RAM build-up, GB-safe).
// Also computes CRC32 while writing and builds STORE ZIP files (zip64-capable) for folders.
const H={};let root,q=Promise.resolve();
const CT=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
function crcUpd(c,u){c=~c>>>0;for(let i=0;i<u.length;i++)c=CT[(c^u[i])&255]^(c>>>8);return ~c>>>0;}
onmessage=e=>{const m=e.data;q=q.then(()=>run(m)).catch(err=>postMessage({err:String(err&&err.message||err),f:m.f,cmd:m.cmd}));};
async function run(m){
 if(!root)root=await navigator.storage.getDirectory();
 if(m.cmd==="probe"){const fh=await root.getFileHandle("__probe",{create:true});const h=await fh.createSyncAccessHandle();await h.write(new Uint8Array([1,2,3]),{at:0});await h.flush();await h.close();await root.removeEntry("__probe");postMessage({ok:"probe"});}
 else if(m.cmd==="open"){const fh=await root.getFileHandle(m.f,{create:true});const h=await fh.createSyncAccessHandle();await h.truncate(0);H[m.f]={h,pos:0,crc:0};}
 else if(m.cmd==="write"){const o=H[m.f];if(!o)return;const u=new Uint8Array(m.buf);o.crc=crcUpd(o.crc,u);o.pos+=await o.h.write(u,{at:o.pos});}
 else if(m.cmd==="close"){const o=H[m.f];let crc=0;if(o){crc=o.crc;await o.h.flush();await o.h.close();delete H[m.f];}postMessage({ok:"closed",f:m.f,crc});}
 else if(m.cmd==="abort"){const o=H[m.f];if(o){try{await o.h.close()}catch(_){}delete H[m.f];}try{await root.removeEntry(m.f)}catch(_){}}
 else if(m.cmd==="zip")await zip(m);
}
// ---- STORE zip with zip64 when needed ----
async function zip(m){
 const enc=new TextEncoder();const fh=await root.getFileHandle(m.f,{create:true});const out=await fh.createSyncAccessHandle();await out.truncate(0);
 let pos=0;const W=async u=>{pos+=await out.write(u,{at:pos});};
 const d=new Date(),dt=((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate(),tm=(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1);
 const FF=0xFFFFFFFF,LIM=0xFFFFFFFF,cd=[];let total=0,done=0;m.entries.forEach(x=>total+=x.size);
 for(const e of m.entries){
  const name=enc.encode(e.path),big=e.size>=LIM,off=pos;
  const lh=new DataView(new ArrayBuffer(30+name.length+(big?20:0)));
  lh.setUint32(0,0x04034b50,true);lh.setUint16(4,45,true);lh.setUint16(6,0x0800,true);lh.setUint16(8,0,true);lh.setUint16(10,tm,true);lh.setUint16(12,dt,true);
  lh.setUint32(14,e.crc>>>0,true);lh.setUint32(18,big?FF:e.size,true);lh.setUint32(22,big?FF:e.size,true);lh.setUint16(26,name.length,true);lh.setUint16(28,big?20:0,true);
  new Uint8Array(lh.buffer).set(name,30);
  if(big){const x=30+name.length;lh.setUint16(x,1,true);lh.setUint16(x+2,16,true);lh.setBigUint64(x+4,BigInt(e.size),true);lh.setBigUint64(x+12,BigInt(e.size),true);}
  await W(new Uint8Array(lh.buffer));
  // copy data
  const src=await (await root.getFileHandle(e.f)).createSyncAccessHandle();const buf=new Uint8Array(4<<20);let p=0;
  try{while(p<e.size){const n=await src.read(buf,{at:p});if(!n)break;await W(n===buf.length?buf:buf.subarray(0,n));p+=n;done+=n;postMessage({ok:"zipprog",f:m.f,done,total});}}finally{await src.close();}
  cd.push({name,size:e.size,crc:e.crc>>>0,off});
 }
 const cdStart=pos;
 for(const c of cd){const z=c.size>=LIM||c.off>=LIM;
  const v=new DataView(new ArrayBuffer(46+c.name.length+(z?28:0)));
  v.setUint32(0,0x02014b50,true);v.setUint16(4,45,true);v.setUint16(6,45,true);v.setUint16(8,0x0800,true);v.setUint16(10,0,true);v.setUint16(12,tm,true);v.setUint16(14,dt,true);
  v.setUint32(16,c.crc,true);v.setUint32(20,z?FF:c.size,true);v.setUint32(24,z?FF:c.size,true);v.setUint16(28,c.name.length,true);v.setUint16(30,z?28:0,true);
  v.setUint32(42,z?FF:c.off,true);new Uint8Array(v.buffer).set(c.name,46);
  if(z){const x=46+c.name.length;v.setUint16(x,1,true);v.setUint16(x+2,24,true);v.setBigUint64(x+4,BigInt(c.size),true);v.setBigUint64(x+12,BigInt(c.size),true);v.setBigUint64(x+20,BigInt(c.off),true);}
  await W(new Uint8Array(v.buffer));}
 const cdSize=pos-cdStart,n=cd.length,z64=n>=0xFFFF||cdStart>=LIM||cdSize>=LIM;
 if(z64){const r=new DataView(new ArrayBuffer(56+20));r.setUint32(0,0x06064b50,true);r.setBigUint64(4,44n,true);r.setUint16(12,45,true);r.setUint16(14,45,true);
  r.setBigUint64(24,BigInt(n),true);r.setBigUint64(32,BigInt(n),true);r.setBigUint64(40,BigInt(cdSize),true);r.setBigUint64(48,BigInt(cdStart),true);
  r.setUint32(56,0x07064b50,true);r.setBigUint64(64,BigInt(pos),true);r.setUint32(72,1,true);await W(new Uint8Array(r.buffer));}
 const eo=new DataView(new ArrayBuffer(22));eo.setUint32(0,0x06054b50,true);eo.setUint16(8,z64?0xFFFF:n,true);eo.setUint16(10,z64?0xFFFF:n,true);
 eo.setUint32(12,z64?FF:cdSize,true);eo.setUint32(16,z64?FF:cdStart,true);await W(new Uint8Array(eo.buffer));
 await out.flush();await out.close();postMessage({ok:"zipped",f:m.f});
}
