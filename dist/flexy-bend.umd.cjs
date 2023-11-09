(function(C,F){typeof exports=="object"&&typeof module<"u"?F(exports):typeof define=="function"&&define.amd?define(["exports"],F):(C=typeof globalThis<"u"?globalThis:C||self,F(C["flexy-bend"]={}))})(this,function(C){"use strict";function F(n,c){const t=c.getAttribute("position"),e=new n.Box3;e.center=new n.Vector3;for(let o=0;o<t.count;o++){const r=new n.Vector3;r.fromBufferAttribute(t,o),e.expandByPoint(r);const m=t[o],b=t[o+1],i=t[o+2];e.center.add(new n.Vector3(m,b,i))}return e.center.divideScalar(t.count/3),e}const O=function({THREE:n,curve:c,quaternion:t,orientation:e,bufferGeometry:o,axis:r,preserveDimensions:m=!1,scene:b}){const i=F(n,o),p=m?$(c):0,s=o.attributes.position.array;for(let a=0;a<s.length;a+=3){const l=parseFloat(s[a]),f=parseFloat(s[a+1]),P=parseFloat(s[a+2]);if(r==="x"){let y=(l-i.min.x)/(i.max.x-i.min.x);const x=i.max.x-i.min.x;if(m&&x<=p){const w=x/p,u=.5-w/2,V=.5+w/2;y=u+y*(V-u)}const g=c.getPointAt(y),z=c.getTangent(y),h=(e||new n.Vector3(0,0,1).applyQuaternion(t).normalize().multiplyScalar(1e6)).clone().cross(z.clone()).normalize(),A=new n.Quaternion().setFromAxisAngle(z.clone(),Math.atan2(P,f));h.applyQuaternion(A);const B=h.clone().setLength(new n.Vector3(0,f,P).length()),d=g.clone().add(B);s[a]=d.x,s[a+1]=d.y,s[a+2]=d.z}else if(r==="z"){let y=(P-i.min.z)/(i.max.z-i.min.z);const x=i.max.y-i.min.y;if(m&&x<=p){const w=x/p,u=.5-w/2,V=.5+w/2;y=u+y*(V-u)}const g=c.getPointAt(y),z=c.getTangent(y),h=(e||new n.Vector3(1,0,0).applyQuaternion(t).normalize().multiplyScalar(1e6)).clone().cross(z.clone()).normalize(),A=new n.Quaternion().setFromAxisAngle(z.clone(),Math.atan2(f,l)+Math.PI/2);h.applyQuaternion(A);const B=h.clone().setLength(new n.Vector3(l,f,0).length()),d=g.clone().add(B);s[a]=d.x,s[a+1]=d.y,s[a+2]=d.z}else if(r==="y"){let y=(f-i.min.y)/(i.max.y-i.min.y);const x=i.max.z-i.min.z;if(m&&x<=p){const w=x/p,u=.5-w/2,V=.5+w/2;y=u+y*(V-u)}const g=c.getPointAt(y),z=c.getTangent(y),h=(e||new n.Vector3(1,0,0).applyQuaternion(t).normalize().multiplyScalar(1e6)).clone().cross(z.clone()).normalize(),A=new n.Quaternion().setFromAxisAngle(z.clone(),Math.atan2(l,P));h.applyQuaternion(A);const B=h.clone().setLength(new n.Vector3(l,0,P).length()),d=g.clone().add(B);s[a]=d.x,s[a+1]=d.y,s[a+2]=d.z}}o.attributes.position.needsUpdate=!0},S=function({THREE:n,surface:c,castingRectangular:t,resolution:e,scene:o}){const r={};for(let m=0;m<=e;m++){const b=L(n,t.A,t.D,e)[m],i=L(n,t.B,t.C,e)[m];L(n,b,i,e).forEach(s=>{const l=new n.Raycaster(s,t.direction.normalize()).intersectObject(c);l.length>0&&(r[N(s.x,s.y,s.z,e)]={normal:{x:l[0].face.normal.x,y:l[0].face.normal.y,z:l[0].face.normal.z},point:{x:l[0].point.x,y:l[0].point.y,z:l[0].point.z}})})}return{data:r,castingRectangular:{A:{x:t.A.x,y:t.A.y,z:t.A.z},B:{x:t.B.x,y:t.B.y,z:t.B.z},C:{x:t.C.x,y:t.C.y,z:t.C.z},D:{x:t.D.x,y:t.D.y,z:t.D.z},direction:{x:t.direction.x,y:t.direction.y,z:t.direction.z}},resolution:e}},M=function({THREE:n,pointToFaceNormalMap:c,obj:t,scene:e}){const o=c.castingRectangular,r=new n.Vector3(o.A.x,o.A.y,o.A.z),m=new n.Vector3(o.B.x,o.B.y,o.B.z),b=new n.Vector3(o.C.x,o.C.y,o.C.z),i=new n.Vector3().subVectors(m,r),p=new n.Vector3().subVectors(b,r),s=new n.Vector3().crossVectors(i,p).normalize(),a=new n.Plane().setFromNormalAndCoplanarPoint(s,r),l=t.geometry.attributes.position.array;for(let f=0;f<l.length;f+=3){const P=parseFloat(l[f]),y=parseFloat(l[f+1]),x=parseFloat(l[f+2]),g=new n.Vector3(P,y,x),z=t.matrixWorld.clone();g.applyMatrix4(z.clone());const Q=g.clone().sub(r).dot(a.normal),h=a.normal.clone().multiplyScalar(Q/a.normal.lengthSq()),A=g.clone().sub(h),B=N(A.x,A.y,A.z,c.resolution),d=c.data[B];if(!d)throw new Error(`Cannot find face normal for posision ${P} - ${y} - ${x}`);const w=new n.Vector3(d.normal.x,d.normal.y,d.normal.z),u=new n.Object3D;u.lookAt(w);const V=new n.Vector3(P,y,x).applyQuaternion(u.quaternion.clone());l[f]=V.x,l[f+1]=V.y,l[f+2]=V.z}t.geometry.attributes.position.needsUpdate=!0};function N(n,c,t,e){function o(s,a){return Math.round(s/a)*a}function r(s){return s==="-0.0"?"0.0":s}const m=1/e,b=r(o(n,m).toFixed(1)),i=r(o(c,m).toFixed(1)),p=r(o(t,m).toFixed(1));return`${b}^${i}^${p}`}function L(n,c,t,e){const o=[];for(let r=0;r<=e;r++){const m=new n.Vector3(c.x+(t.x-c.x)*(r/e),c.y+(t.y-c.y)*(r/e),c.z+(t.z-c.z)*(r/e));o.push(m)}return o}function $(n){let t=0,e=n.getPointAt(0);for(let o=1;o<=100;o++){const r=n.getPointAt(o/100);t+=r.distanceTo(e),e=r}return t}C.bend=O,C.getPointToFaceNormalMap=S,C.wrap=M,Object.defineProperty(C,Symbol.toStringTag,{value:"Module"})});
