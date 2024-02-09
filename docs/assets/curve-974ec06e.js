import{L as et,F as nt,g as N,h as V,V as T,i as j,j as ot,S as st,P as rt,W as it,A as at,D as lt,a as ct,O as dt,M as Y,e as pt,c as O,C as ft,d as ut,k as yt,b as ht}from"./OrbitControls-5913b8a0.js";class xt extends et{constructor(u){super(u)}load(u,z,t,l){const x=this,c=new nt(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(u,function(b){try{z(x.parse(b))}catch(g){l?l(g):console.error(g),x.manager.itemError(u)}},t,l)}parse(u){function z(s){const n=new DataView(s),i=32/8*3+32/8*3*3+16/8,o=n.getUint32(80,!0);if(80+32/8+o*i===n.byteLength)return!0;const a=[115,111,108,105,100];for(let e=0;e<5;e++)if(t(a,n,e))return!1;return!0}function t(s,n,i){for(let o=0,d=s.length;o<d;o++)if(s[o]!==n.getUint8(i+o))return!1;return!0}function l(s){const n=new DataView(s),i=n.getUint32(80,!0);let o,d,a,e=!1,w,v,k,y,p;for(let f=0;f<80-10;f++)n.getUint32(f,!1)==1129270351&&n.getUint8(f+4)==82&&n.getUint8(f+5)==61&&(e=!0,w=new Float32Array(i*3*3),v=n.getUint8(f+6)/255,k=n.getUint8(f+7)/255,y=n.getUint8(f+8)/255,p=n.getUint8(f+9)/255);const E=84,I=12*4+2,C=new N,U=new Float32Array(i*3*3),M=new Float32Array(i*3*3);for(let f=0;f<i;f++){const L=E+f*I,B=n.getFloat32(L,!0),H=n.getFloat32(L+4,!0),tt=n.getFloat32(L+8,!0);if(e){const F=n.getUint16(L+48,!0);F&32768?(o=v,d=k,a=y):(o=(F&31)/31,d=(F>>5&31)/31,a=(F>>10&31)/31)}for(let F=1;F<=3;F++){const G=L+F*12,P=f*3*3+(F-1)*3;U[P]=n.getFloat32(G,!0),U[P+1]=n.getFloat32(G+4,!0),U[P+2]=n.getFloat32(G+8,!0),M[P]=B,M[P+1]=H,M[P+2]=tt,e&&(w[P]=o,w[P+1]=d,w[P+2]=a)}}return C.setAttribute("position",new V(U,3)),C.setAttribute("normal",new V(M,3)),e&&(C.setAttribute("color",new V(w,3)),C.hasColors=!0,C.alpha=p),C}function x(s){const n=new N,i=/solid([\s\S]*?)endsolid/g,o=/facet([\s\S]*?)endfacet/g;let d=0;const a=/[\s]+([+-]?(?:\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?)/.source,e=new RegExp("vertex"+a+a+a,"g"),w=new RegExp("normal"+a+a+a,"g"),v=[],k=[],y=new T;let p,E=0,I=0,C=0;for(;(p=i.exec(s))!==null;){I=C;const U=p[0];for(;(p=o.exec(U))!==null;){let L=0,B=0;const H=p[0];for(;(p=w.exec(H))!==null;)y.x=parseFloat(p[1]),y.y=parseFloat(p[2]),y.z=parseFloat(p[3]),B++;for(;(p=e.exec(H))!==null;)v.push(parseFloat(p[1]),parseFloat(p[2]),parseFloat(p[3])),k.push(y.x,y.y,y.z),L++,C++;B!==1&&console.error("THREE.STLLoader: Something isn't right with the normal of face number "+d),L!==3&&console.error("THREE.STLLoader: Something isn't right with the vertices of face number "+d),d++}const M=I,f=C-I;n.addGroup(M,f,E),E++}return n.setAttribute("position",new j(v,3)),n.setAttribute("normal",new j(k,3)),n}function c(s){return typeof s!="string"?ot.decodeText(new Uint8Array(s)):s}function b(s){if(typeof s=="string"){const n=new Uint8Array(s.length);for(let i=0;i<s.length;i++)n[i]=s.charCodeAt(i)&255;return n.buffer||n}else return s}const g=b(u);return z(g)?l(g):x(c(u))}}const h=new st,R=new rt(75,window.innerWidth/window.innerHeight,.1,1e3);R.position.set(20,15,20);const S=new it({antialias:!0,alpha:!0});S.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(S.domElement);const wt=new at(4210752);h.add(wt);const Z=new lt(16777215,.5);Z.position.set(1,1,1);h.add(Z);const mt=new ct(5);h.add(mt);const gt=new dt(R,S.domElement);function $(){requestAnimationFrame($),gt.update(),S.render(h,R)}window.addEventListener("resize",function(){const r=window.innerWidth,u=window.innerHeight;S.setSize(r,u),R.aspect=r/u,R.updateProjectionMatrix()});S.setClearColor(74565);S.setPixelRatio(window.devicePixelRatio);S.setSize(window.innerWidth,window.innerHeight);function Ct(r){const z=r.getPoints(1e3),t=new ft(z),l=new ut(t,1e3,.01,8,!1),x=new Y({wireframe:!0});return new O(l,x)}function D(r,u,z,t){const l=new yt(.03,32,16),x=new ht({color:r}),c=new O(l,x);return c.position.set(u,z,t),h.add(c),c}const m={};function zt(r){m.start&&h.remove(m.start),m.c1&&h.remove(m.c1),m.c2&&h.remove(m.c2),m.end&&h.remove(m.end),m.start=D(16776960,r.start.x,r.start.y,r.start.z),m.c1=D(16711680,r.c1.x,r.c1.y,r.c1.z),m.c2=D(16711935,r.c2.x,r.c2.y,r.c2.z),m.end=D(16777215,r.end.x,r.end.y,r.end.z)}$();let W,q,_,J,K,Q,A,X;(async function(){const r=new Y({wireframe:!1}),u=new xt,z=function(e){return new Promise((w,v)=>{const k=new FileReader;k.onload=function(y){const p=y.target.result,E=u.parse(p);w(E)},k.onerror=function(y){v(y)},k.readAsBinaryString(e)})},t={start:{x:0,y:5,z:0},end:{x:5,y:0,z:5},c1:{x:5*.55,y:5,z:0},c2:{x:5,y:5*.45,z:0},stl:{position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0}},currentControl:"stl position / rotation",step:.25};o();const l=new dat.GUI;l.addFolder("QA / WS / ED - UJ / IK / OL");const x=l.addFolder("Keyboard Controls");x.open(),x.add(t,"currentControl",["stl position / rotation","start / end points","control points"]).listen(),x.add(t,"step").onFinishChange(e=>{t.step=Number(e)}).listen();const c=l.addFolder("Translate STL");c.open(),c.add(t.stl.position,"x",-10,10,t.step).onChange(o).listen(),c.add(t.stl.position,"y",-10,10,t.step).onChange(o).listen(),c.add(t.stl.position,"z",-10,10,t.step).onChange(o).listen();const b=l.addFolder("Rotate STL");b.open(),b.add(t.stl.rotation,"x",-2*Math.PI,2*Math.PI,t.step).onChange(o).listen(),b.add(t.stl.rotation,"y",-2*Math.PI,2*Math.PI,t.step).onChange(o).listen(),b.add(t.stl.rotation,"z",-2*Math.PI,2*Math.PI,t.step).onChange(o).listen();const g=l.addFolder("Start Point");g.open(),g.add(t.start,"x",-20,20,t.step).onChange(o).listen(),g.add(t.start,"y",-20,20,t.step).onChange(o).listen(),g.add(t.start,"z",-20,20,t.step).onChange(o).listen();const s=l.addFolder("Control Point 1");s.open(),s.add(t.c1,"x",-20,20,t.step).onChange(o).listen(),s.add(t.c1,"y",-20,20,t.step).onChange(o).listen(),s.add(t.c1,"z",-20,20,t.step).onChange(o).listen();const n=l.addFolder("Control Point 2");n.open(),n.add(t.c2,"x",-20,20,t.step).onChange(o).listen(),n.add(t.c2,"y",-20,20,t.step).onChange(o).listen(),n.add(t.c2,"z",-20,20,t.step).onChange(o).listen();const i=l.addFolder("End Point");i.open(),i.add(t.end,"x",-20,20,t.step).onChange(o).listen(),i.add(t.end,"y",-20,20,t.step).onChange(o).listen(),i.add(t.end,"z",-20,20,t.step).onChange(o).listen();function o(){A&&(A.position.set(t.stl.position.x,t.stl.position.y,t.stl.position.z),A.rotation.set(t.stl.rotation.x,t.stl.rotation.y,t.stl.rotation.z)),_=new T(t.start.x,t.start.y,t.start.z),J=new T(t.c1.x,t.c1.y,t.c1.z),K=new T(t.c2.x,t.c2.y,t.c2.z),Q=new T(t.end.x,t.end.y,t.end.z),h.remove(W),q=new pt(_,J,K,Q),W=Ct(q),zt(t),h.add(W)}const d=document.createElement("button");d.style.position="absolute",d.style.top=0,d.style.left=0,d.innerHTML="UPLOAD STL",d.addEventListener("click",async()=>{document.getElementById("fileInput").click()}),document.body.append(d);const a=document.createElement("button");a.style.position="absolute",a.style.bottom=0,a.style.left=0,a.innerHTML="PRINT CURVE",a.addEventListener("click",()=>{console.log(JSON.stringify({startPoint:{x:t.start.x,y:t.start.y,z:t.start.z},controlPoint1:{x:t.c1.x,y:t.c1.y,z:t.c1.z},controlPoint2:{x:t.c2.x,y:t.c2.y,z:t.c2.z},endPoint:{x:t.end.x,y:t.end.y,z:t.end.z}},null,4))}),document.body.append(a),document.getElementById("fileInput").addEventListener("change",async function(e){const w=e.target.files[0];w&&(A&&h.remove(A),X=await z(w),A=new O(X,r),h.add(A))}),document.body.addEventListener("keydown",e=>{t.step=Number(t.step),e.key===" "&&(t.currentControl==="stl position / rotation"?t.currentControl="start / end points":t.currentControl==="start / end points"?t.currentControl="control points":t.currentControl="stl position / rotation"),e.key==="m"&&(t.step===.25?t.step=.1:t.step===.1?t.step=.01:t.step=.25),t.currentControl==="stl position / rotation"&&(e.key==="q"&&(t.stl.position.x+=t.step),e.key==="a"&&(t.stl.position.x-=t.step),e.key==="w"&&(t.stl.position.y+=t.step),e.key==="s"&&(t.stl.position.y-=t.step),e.key==="e"&&(t.stl.position.z+=t.step),e.key==="d"&&(t.stl.position.z-=t.step),e.key==="u"&&(t.stl.rotation.x+=t.step),e.key==="j"&&(t.stl.rotation.x-=t.step),e.key==="i"&&(t.stl.rotation.y+=t.step),e.key==="k"&&(t.stl.rotation.y-=t.step),e.key==="o"&&(t.stl.rotation.z+=t.step),e.key==="l"&&(t.stl.rotation.z-=t.step)),t.currentControl==="start / end points"&&(e.key==="q"&&(t.start.x+=t.step),e.key==="a"&&(t.start.x-=t.step),e.key==="w"&&(t.start.y+=t.step),e.key==="s"&&(t.start.y-=t.step),e.key==="e"&&(t.start.z+=t.step),e.key==="d"&&(t.start.z-=t.step),e.key==="u"&&(t.end.x+=t.step),e.key==="j"&&(t.end.x-=t.step),e.key==="i"&&(t.end.y+=t.step),e.key==="k"&&(t.end.y-=t.step),e.key==="o"&&(t.end.z+=t.step),e.key==="l"&&(t.end.z-=t.step)),t.currentControl==="control points"&&(e.key==="q"&&(t.c1.x+=t.step),e.key==="a"&&(t.c1.x-=t.step),e.key==="w"&&(t.c1.y+=t.step),e.key==="s"&&(t.c1.y-=t.step),e.key==="e"&&(t.c1.z+=t.step),e.key==="d"&&(t.c1.z-=t.step),e.key==="u"&&(t.c2.x+=t.step),e.key==="j"&&(t.c2.x-=t.step),e.key==="i"&&(t.c2.y+=t.step),e.key==="k"&&(t.c2.y-=t.step),e.key==="o"&&(t.c2.z+=t.step),e.key==="l"&&(t.c2.z-=t.step)),o()})})();
