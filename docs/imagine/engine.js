/* Imagine — photo engine (Created by George Barbaris)
   Analysis → global LUT (white balance, levels, exposure, contrast) →
   local tone (shadows/highlights, HDR-like) → clarity → vibrance → warmth → vignette → sharpen.
   Multi-frame stacking with alignment + de-ghosting for low noise. */
(function(){
const MODES={
 auto :{n:'Αυτόματο',i:'✨',wb:.7 ,con:.14,lift:.45,hl:.38,clar:.25,vib:.28,sharp:.45,vig:.07,warm:0   ,frames:4 ,expT:.47,minE:.55,css:'contrast(1.06) saturate(1.15)'},
 land :{n:'Τοπίο'   ,i:'🌄',wb:.6 ,con:.2 ,lift:.45,hl:.58,clar:.38,vib:.4 ,sharp:.5 ,vig:.13,warm:.01 ,frames:4 ,expT:.45,minE:.55,css:'contrast(1.1) saturate(1.3)'},
 port :{n:'Πορτρέτο',i:'🙂',wb:.75,con:.07,lift:.38,hl:.38,clar:.04,vib:.16,sharp:.2 ,vig:.18,warm:.025,frames:4 ,expT:.5 ,minE:.55,skin:1,css:'saturate(1.06) brightness(1.04)'},
 night:{n:'Νύχτα'   ,i:'🌙',wb:.5 ,con:.1 ,lift:.75,hl:.5 ,clar:.18,vib:.18,sharp:.3 ,vig:.08,warm:0   ,frames:12,expT:.42,minE:.38,css:'brightness(1.45) contrast(1.05)'}
};
const clamp=(v,a,b)=>v<a?a:v>b?b:v;

function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function ctx2(c){return c.getContext('2d',{willReadFrequently:true});}

/* High-quality downscale by successive halving */
function scaled(src,longEdge){
 let w=src.width,h=src.height,cur=src;
 const target=Math.min(1,longEdge/Math.max(w,h)),tw=Math.max(1,Math.round(w*target)),th=Math.max(1,Math.round(h*target));
 while(w/2>=tw*1.0001&&h/2>=th){const nw=Math.max(tw,Math.round(w/2)),nh=Math.max(th,Math.round(h/2));const c=canvas(nw,nh),x=c.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(cur,0,0,nw,nh);cur=c;w=nw;h=nh;}
 if(w!==tw||h!==th||cur===src){const c=canvas(tw,th),x=c.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(cur,0,0,tw,th);cur=c;}
 return cur;
}

/* ---------- Analysis (resolution independent) ---------- */
function analyze(src,P,meter){
 const s=scaled(src,256),d=ctx2(s).getImageData(0,0,s.width,s.height).data,W=s.width,H=s.height,N=W*H;
 const hist=new Uint32Array(256);let gr=0,gg=0,gb=0,gn=0;
 const Y=new Float32Array(N);
 for(let i=0,p=0;i<N;i++,p+=4){const r=d[p],g=d[p+1],b=d[p+2];const y=.2126*r+.7152*g+.0722*b;Y[i]=y;hist[y|0]++;
  const mx=Math.max(r,g,b),mn=Math.min(r,g,b);
  if(y>25&&y<235&&(mx-mn)<mx*.6){gr+=r;gg+=g;gb+=b;gn++;}}
 const pct=q=>{let t=q*N,a=0;for(let i=0;i<256;i++){a+=hist[i];if(a>=t)return i;}return 255;};
 const p005=pct(.005),p997=pct(.997),p50=pct(.5);
 // white patch: brightest ~1.5% non-clipped
 const thr=Math.min(pct(.985),250);let wr=0,wg=0,wbb=0,wn=0;
 for(let i=0,p=0;i<N;i++,p+=4){if(Y[i]>=thr&&d[p]<254&&d[p+1]<254&&d[p+2]<254){wr+=d[p];wg+=d[p+1];wbb+=d[p+2];wn++;}}
 let gain=[1,1,1];
 if(gn>N*.05){const a=[gr/gn,gg/gn,gb/gn],m=(a[0]+a[1]+a[2])/3;gain=a.map(v=>m/v);}
 if(wn>5){const a=[wr/wn,wg/wn,wbb/wn],m=Math.max(...a);const wp=a.map(v=>m/v);gain=gain.map((g,i)=>.6*g+.4*wp[i]);}
 const gm=(gain[0]+gain[1]+gain[2])/3;gain=gain.map(g=>clamp(g/gm,.78,1.3));
 const black=Math.min(p005*.85,28),white=Math.max(p997,170);
 // metered mean (spot if meter point, else centre-weighted)
 const mx=meter?meter.x:.5,my=meter?meter.y:.5,sg=meter?.12:.32;let sw=0,sm=0;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const dx=x/W-mx,dy=y/H-my,w=Math.exp(-(dx*dx+dy*dy)/(2*sg*sg))+(meter?0:.15);
  const v=clamp((Y[y*W+x]-black)/(white-black),0,1);sw+=w;sm+=w*v;}
 const M=clamp(sm/sw,.02,.97);
 const rawMean=Y.reduce((a,b)=>a+b,0)/N/255;
 const dark=rawMean<.17;
 return {gain,black,white,M,rawMean,dark,p50,backlit:false};
}

/* effective parameters for a mode + intensity k (0..1.5) */
function params(mode,A,k){
 const B=Object.assign({},MODES[mode]);
 if(mode==='auto'&&A.dark){B.lift=.68;B.minE=.42;B.expT=.43;B.hl=.45;B.clar=.18;B.sharp=.32;}
 const P={};for(const key of ['con','lift','hl','clar','vib','sharp','vig','warm'])P[key]=B[key]*k;
 P.skin=B.skin;
 const wbk=B.wb*Math.min(k,1);P.gain=A.gain.map(g=>1+(g-1)*wbk);
 P.black=A.black*Math.min(k,1);P.white=255-(255-A.white)*Math.min(k,1);
 const e=clamp(Math.log(B.expT)/Math.log(A.M),B.minE,1.5);P.expo=1+(e-1)*Math.min(k,1.2);
 return P;
}

function makeLUT(P){
 const L=[new Float32Array(256),new Float32Array(256),new Float32Array(256)];
 for(let c=0;c<3;c++)for(let v=0;v<256;v++){
  let x=clamp((v*P.gain[c]-P.black)/(P.white-P.black),0,1);
  x=Math.pow(x,P.expo);
  x=x+P.con*(x*x*(3-2*x)-x);
  L[c][v]=clamp(x,0,1);}
 return L;
}

/* luminance map after LUT, blurred, for local tone & clarity */
function lumMap(src,longEdge,L,passes,rad){
 const s=scaled(src,longEdge),W=s.width,H=s.height,d=ctx2(s).getImageData(0,0,W,H).data;
 let m=new Float32Array(W*H);
 for(let i=0,p=0;i<W*H;i++,p+=4)m[i]=.2126*L[0][d[p]]+.7152*L[1][d[p+1]]+.0722*L[2][d[p+2]];
 for(let k=0;k<passes;k++)m=boxBlur(m,W,H,rad);
 return {m,W,H};
}
function boxBlur(a,W,H,r){
 const t=new Float32Array(W*H),o=new Float32Array(W*H);
 for(let y=0;y<H;y++){for(let x=0;x<W;x++){let s=0,n=0;for(let k=-r;k<=r;k++){const xx=x+k;if(xx>=0&&xx<W){s+=a[y*W+xx];n++;}}t[y*W+x]=s/n;}}
 for(let y=0;y<H;y++){for(let x=0;x<W;x++){let s=0,n=0;for(let k=-r;k<=r;k++){const yy=y+k;if(yy>=0&&yy<H){s+=t[yy*W+x];n++;}}o[y*W+x]=s/n;}}
 return o;
}

/* Prepare everything that does not depend on output resolution */
function prepare(src,mode,k,meter,A){
 A=A||analyze(src,MODES[mode],meter);
 const P=params(mode,A,k),L=makeLUT(P);
 const tone=lumMap(src,48,L,2,2),clar=lumMap(src,224,L,2,2);
 return {A,P,L,tone,clar};
}

/* Render in place into ImageData (any resolution) */
function render(img,R){
 const {P,L,tone,clar}=R,d=img.data,W=img.width,H=img.height;
 const L0=L[0],L1=L[1],L2=L[2];
 const tm=tone.m,tW=tone.W,tH=tone.H,cm=clar.m,cW=clar.W,cH=clar.H;
 const cx=W/2,cy=H/2,dmax=Math.sqrt(cx*cx+cy*cy);
 const lift=P.lift,hl=P.hl,cl=P.clar,vib=P.vib,warm=P.warm,vig=P.vig,skin=P.skin;
 for(let y=0;y<H;y++){
  const ty=y*(tH-1)/Math.max(1,H-1),ty0=ty|0,ty1=Math.min(tH-1,ty0+1),fy=ty-ty0;
  const qy=y*(cH-1)/Math.max(1,H-1),qy0=qy|0,qy1=Math.min(cH-1,qy0+1),gy=qy-qy0;
  const dy=(y-cy)/dmax;
  for(let x=0,p=y*W*4;x<W;x++,p+=4){
   let r=L0[d[p]],g=L1[d[p+1]],b=L2[d[p+2]];
   const Y=.2126*r+.7152*g+.0722*b;
   // bilinear samples
   const tx=x*(tW-1)/Math.max(1,W-1),tx0=tx|0,tx1=Math.min(tW-1,tx0+1),fx=tx-tx0;
   const Bt=(tm[ty0*tW+tx0]*(1-fx)+tm[ty0*tW+tx1]*fx)*(1-fy)+(tm[ty1*tW+tx0]*(1-fx)+tm[ty1*tW+tx1]*fx)*fy;
   const qx=x*(cW-1)/Math.max(1,W-1),qx0=qx|0,qx1=Math.min(cW-1,qx0+1),gx=qx-qx0;
   const Bc=(cm[qy0*cW+qx0]*(1-gx)+cm[qy0*cW+qx1]*gx)*(1-gy)+(cm[qy1*cW+qx0]*(1-gx)+cm[qy1*cW+qx1]*gx)*gy;
   // local tone (adaptive gamma)
   const s=Bt<.5?lift:hl;
   let Y2=Y>0?Math.pow(Y,Math.pow(2,(Bt-.5)*2*s)):0;
   // clarity on midtones
   Y2+=cl*(Y-Bc)*4*Y2*(1-Y2)*1.6;
   if(Y2<0)Y2=0;
   if(Y>.002){const f=Y2/Y;r*=f;g*=f;b*=f;}else{r+=Y2;g+=Y2;b+=Y2;}
   // vibrance (skin protection)
   const mx=r>g?(r>b?r:b):(g>b?g:b),mn=r<g?(r<b?r:b):(g<b?g:b),sat=mx>0?(mx-mn)/mx:0;
   let a=vib*(1-sat)*(1-sat);
   if(skin&&r>g&&g>b&&(r-g)<(r-b)*.75)a*=.25;
   if(a){const m=.2126*r+.7152*g+.0722*b;r=m+(r-m)*(1+a);g=m+(g-m)*(1+a);b=m+(b-m)*(1+a);}
   if(warm){r*=1+warm;b*=1-warm;}
   if(vig){const dx=(x-cx)/dmax,dd=dx*dx+dy*dy,v=1-vig*dd*dd*1.4;r*=v;g*=v;b*=v;}
   d[p]=r*255+.5;d[p+1]=g*255+.5;d[p+2]=b*255+.5;
  }
 }
 if(P.sharp>0)sharpen(img,P.sharp*Math.min(1.2,Math.max(.6,W/2400)));
 return img;
}

/* 3x3 unsharp with noise threshold, row buffers (no full copy) */
function sharpen(img,amt){
 const d=img.data,W=img.width,H=img.height,row=W*4;
 let prev=d.slice(0,row),cur=d.slice(0,row);
 for(let y=0;y<H;y++){
  const next=y<H-1?d.slice((y+1)*row,(y+2)*row):cur;
  const up=y>0?prev:cur;
  for(let x=0;x<W;x++){const i=x*4,l=x>0?i-4:i,rr=x<W-1?i+4:i,o=y*row+i;
   for(let c=0;c<3;c++){const v=cur[i+c],m=(up[i+c]+next[i+c]+cur[l+c]+cur[rr+c])*.25,df=v-m;
    if(df>3||df<-3)d[o+c]=v+df*amt*1.6;}}
  prev=cur;cur=next;
 }
}

/* ---------- Multi-frame stacking from <video> ---------- */
function gray(data,W,H,s){const w=(W/s)|0,h=(H/s)|0,g=new Uint8Array(w*h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const p=((y*s)*W+x*s)*4;g[y*w+x]=(data[p]+2*data[p+1]+data[p+2])>>2;}return {g,w,h};}
function sad(a,b,w,h,dx,dy,step){let s=0,n=0;const x0=(w*.2)|0,x1=(w*.8)|0,y0=(h*.2)|0,y1=(h*.8)|0;
 for(let y=y0;y<y1;y+=step){const yy=y+dy;if(yy<0||yy>=h)continue;for(let x=x0;x<x1;x+=step){const xx=x+dx;if(xx<0||xx>=w)continue;const v=a[y*w+x]-b[yy*w+xx];s+=v<0?-v:v;n++;}}return n?s/n:1e9;}
function align(refC,refF,fc,ff){
 let bx=0,by=0,best=1e9;
 for(let dy=-6;dy<=6;dy++)for(let dx=-6;dx<=6;dx++){const v=sad(refC.g,fc.g,refC.w,refC.h,dx,dy,2);if(v<best){best=v;bx=dx;by=dy;}}
 const f=refC.s/refF.s;let cx=bx*f,cy=by*f;best=1e9;let rx=cx,ry=cy;
 for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const v=sad(refF.g,ff.g,refF.w,refF.h,cx+dx,cy+dy,4);if(v<best){best=v;rx=cx+dx;ry=cy+dy;}}
 return [rx*refF.s,ry*refF.s];
}
const nextFrame=v=>new Promise(r=>{if(v.requestVideoFrameCallback)v.requestVideoFrameCallback(()=>r());else setTimeout(r,45);setTimeout(r,120);});

async function stack(video,n,mirror,onProg){
 const W=video.videoWidth,H=video.videoHeight,c=canvas(W,H),x=ctx2(c);
 if(mirror){x.translate(W,0);x.scale(-1,1);}
 const grab=()=>{x.drawImage(video,0,0,W,H);return x.getImageData(0,0,W,H);};
 const ref=grab();onProg&&onProg(1,n);
 if(n<=1){x.setTransform(1,0,0,1,0,0);x.putImageData(ref,0,0);return c;}
 const rd=ref.data;
 const mk=(d,s)=>{const o=gray(d,W,H,s);o.s=s;return o;};
 const rC=mk(rd,8),rF=mk(rd,2);
 const acc=new Uint16Array(W*H*3);
 for(let i=0,p=0;i<W*H;i++,p+=4){acc[i*3]=rd[p];acc[i*3+1]=rd[p+1];acc[i*3+2]=rd[p+2];}
 const thr=n>6?70:45;
 for(let f=1;f<n;f++){
  await nextFrame(video);
  const fr=grab(),fd=fr.data;
  const [dx,dy]=align(rC,rF,mk(fd,8),mk(fd,2));
  for(let y=0;y<H;y++){const sy=y+dy,ok=sy>=0&&sy<H;
   for(let xx=0;xx<W;xx++){const i=y*W+xx,p=i*4,sx=xx+dx;
    if(ok&&sx>=0&&sx<W){const q=(sy*W+sx)*4,df=fd[q+1]-rd[p+1];
     if(df<thr&&df>-thr){acc[i*3]+=fd[q];acc[i*3+1]+=fd[q+1];acc[i*3+2]+=fd[q+2];continue;}}
    acc[i*3]+=rd[p];acc[i*3+1]+=rd[p+1];acc[i*3+2]+=rd[p+2];}}
  onProg&&onProg(f+1,n);
 }
 for(let i=0,p=0;i<W*H;i++,p+=4){rd[p]=acc[i*3]/n+.5;rd[p+1]=acc[i*3+1]/n+.5;rd[p+2]=acc[i*3+2]/n+.5;}
 x.setTransform(1,0,0,1,0,0);x.putImageData(ref,0,0);
 return c;
}

window.ImagineEngine={MODES,analyze,params,prepare,render,stack,scaled,canvas,ctx2};
})();
