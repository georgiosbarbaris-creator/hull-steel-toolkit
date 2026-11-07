// OPFS writer: streams received chunks straight to disk (no RAM build-up, GB-safe). Messages are processed strictly in order.
const H={};let root,q=Promise.resolve();
onmessage=e=>{const m=e.data;q=q.then(()=>run(m)).catch(err=>postMessage({err:String(err&&err.message||err),f:m.f,cmd:m.cmd}));};
async function run(m){
 if(!root)root=await navigator.storage.getDirectory();
 if(m.cmd==="probe"){const fh=await root.getFileHandle("__probe",{create:true});const h=await fh.createSyncAccessHandle();await h.write(new Uint8Array([1,2,3]),{at:0});await h.flush();await h.close();await root.removeEntry("__probe");postMessage({ok:"probe"});}
 else if(m.cmd==="open"){const fh=await root.getFileHandle(m.f,{create:true});const h=await fh.createSyncAccessHandle();await h.truncate(0);H[m.f]={h,pos:0};}
 else if(m.cmd==="write"){const o=H[m.f];if(!o)return;o.pos+=await o.h.write(new Uint8Array(m.buf),{at:o.pos});}
 else if(m.cmd==="close"){const o=H[m.f];if(o){await o.h.flush();await o.h.close();delete H[m.f];}postMessage({ok:"closed",f:m.f});}
 else if(m.cmd==="abort"){const o=H[m.f];if(o){try{await o.h.close()}catch(_){}delete H[m.f];}try{await root.removeEntry(m.f)}catch(_){}}
}
