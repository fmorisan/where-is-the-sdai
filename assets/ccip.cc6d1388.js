import{i as h,I as m,B as p,g as w,s as g,d as E,c as O,a as b,e as x,H as y,b as R}from"./index.92c6b6d9.js";function M(t,e){if(!h(t,{strict:!1}))throw new m({address:t});if(!h(e,{strict:!1}))throw new m({address:e});return t.toLowerCase()===e.toLowerCase()}class S extends p{constructor({callbackSelector:e,cause:a,data:n,extraData:c,sender:i,urls:r}){super(a.shortMessage||"An error occurred while fetching for an offchain result.",{cause:a,metaMessages:[...a.metaMessages||[],a.metaMessages?.length?"":[],"Offchain Gateway Call:",r&&["  Gateway URL(s):",...r.map(d=>`    ${w(d)}`)],`  Sender: ${i}`,`  Data: ${n}`,`  Callback selector: ${e}`,`  Extra data: ${c}`].flat(),name:"OffchainLookupError"})}}class $ extends p{constructor({result:e,url:a}){super("Offchain gateway response is malformed. Response data must be a hex value.",{metaMessages:[`Gateway URL: ${w(a)}`,`Response: ${g(e)}`],name:"OffchainLookupResponseMalformedError"})}}class A extends p{constructor({sender:e,to:a}){super("Reverted sender address does not match target contract address (`to`).",{metaMessages:[`Contract address: ${a}`,`OffchainLookup sender address: ${e}`],name:"OffchainLookupSenderMismatchError"})}}const D="0x556f1830",C={name:"OffchainLookup",type:"error",inputs:[{name:"sender",type:"address"},{name:"urls",type:"string[]"},{name:"callData",type:"bytes"},{name:"callbackFunction",type:"bytes4"},{name:"extraData",type:"bytes"}]};async function G(t,{blockNumber:e,blockTag:a,data:n,to:c}){const{args:i}=E({data:n,abi:[C]}),[r,d,f,s,o]=i,{ccipRead:u}=t,k=u&&typeof u?.request=="function"?u.request:T;try{if(!M(c,r))throw new A({sender:r,to:c});const l=await k({data:f,sender:r,urls:d}),{data:L}=await O(t,{blockNumber:e,blockTag:a,data:b([s,x([{type:"bytes"},{type:"bytes"}],[l,o])]),to:c});return L}catch(l){throw new S({callbackSelector:s,cause:l,data:n,extraData:o,sender:r,urls:d})}}async function T({data:t,sender:e,urls:a}){let n=new Error("An unknown error occurred.");for(let c=0;c<a.length;c++){const i=a[c],r=i.includes("{data}")?"GET":"POST",d=r==="POST"?{data:t,sender:e}:void 0,f=r==="POST"?{"Content-Type":"application/json"}:{};try{const s=await fetch(i.replace("{sender}",e).replace("{data}",t),{body:JSON.stringify(d),headers:f,method:r});let o;if(s.headers.get("Content-Type")?.startsWith("application/json")?o=(await s.json()).data:o=await s.text(),!s.ok){n=new y({body:d,details:o?.error?g(o.error):s.statusText,headers:s.headers,status:s.status,url:i});continue}if(!R(o)){n=new $({result:o,url:i});continue}return o}catch(s){n=new y({body:d,details:s.message,url:i})}}throw n}export{T as ccipRequest,G as offchainLookup,C as offchainLookupAbiItem,D as offchainLookupSignature};