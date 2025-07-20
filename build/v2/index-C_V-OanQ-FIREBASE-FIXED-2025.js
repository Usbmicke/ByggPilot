(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const c of r)if(c.type==="childList")for(const h of c.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&s(h)}).observe(document,{childList:!0,subtree:!0});function t(r){const c={};return r.integrity&&(c.integrity=r.integrity),r.referrerPolicy&&(c.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?c.credentials="include":r.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(r){if(r.ep)return;r.ep=!0;const c=t(r);fetch(r.href,c)}})();const ua=()=>{};var xs={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kr=function(i){const e=[];let t=0;for(let s=0;s<i.length;s++){let r=i.charCodeAt(s);r<128?e[t++]=r:r<2048?(e[t++]=r>>6|192,e[t++]=r&63|128):(r&64512)===55296&&s+1<i.length&&(i.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(i.charCodeAt(++s)&1023),e[t++]=r>>18|240,e[t++]=r>>12&63|128,e[t++]=r>>6&63|128,e[t++]=r&63|128):(e[t++]=r>>12|224,e[t++]=r>>6&63|128,e[t++]=r&63|128)}return e},da=function(i){const e=[];let t=0,s=0;for(;t<i.length;){const r=i[t++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const c=i[t++];e[s++]=String.fromCharCode((r&31)<<6|c&63)}else if(r>239&&r<365){const c=i[t++],h=i[t++],p=i[t++],w=((r&7)<<18|(c&63)<<12|(h&63)<<6|p&63)-65536;e[s++]=String.fromCharCode(55296+(w>>10)),e[s++]=String.fromCharCode(56320+(w&1023))}else{const c=i[t++],h=i[t++];e[s++]=String.fromCharCode((r&15)<<12|(c&63)<<6|h&63)}}return e.join("")},Cr={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(i,e){if(!Array.isArray(i))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<i.length;r+=3){const c=i[r],h=r+1<i.length,p=h?i[r+1]:0,w=r+2<i.length,E=w?i[r+2]:0,S=c>>2,A=(c&3)<<4|p>>4;let T=(p&15)<<2|E>>6,j=E&63;w||(j=64,h||(T=64)),s.push(t[S],t[A],t[T],t[j])}return s.join("")},encodeString(i,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(i):this.encodeByteArray(kr(i),e)},decodeString(i,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(i):da(this.decodeStringToByteArray(i,e))},decodeStringToByteArray(i,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<i.length;){const c=t[i.charAt(r++)],p=r<i.length?t[i.charAt(r)]:0;++r;const E=r<i.length?t[i.charAt(r)]:64;++r;const A=r<i.length?t[i.charAt(r)]:64;if(++r,c==null||p==null||E==null||A==null)throw new fa;const T=c<<2|p>>4;if(s.push(T),E!==64){const j=p<<4&240|E>>2;if(s.push(j),A!==64){const C=E<<6&192|A;s.push(C)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let i=0;i<this.ENCODED_VALS.length;i++)this.byteToCharMap_[i]=this.ENCODED_VALS.charAt(i),this.charToByteMap_[this.byteToCharMap_[i]]=i,this.byteToCharMapWebSafe_[i]=this.ENCODED_VALS_WEBSAFE.charAt(i),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]]=i,i>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)]=i,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)]=i)}}};class fa extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const pa=function(i){const e=kr(i);return Cr.encodeByteArray(e,!0)},yn=function(i){return pa(i).replace(/\./g,"")},Pr=function(i){try{return Cr.decodeString(i,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ga(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ma=()=>ga().__FIREBASE_DEFAULTS__,ya=()=>{if(typeof process>"u"||typeof xs>"u")return;const i=xs.__FIREBASE_DEFAULTS__;if(i)return JSON.parse(i)},va=()=>{if(typeof document>"u")return;let i;try{i=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=i&&Pr(i[1]);return e&&JSON.parse(e)},wi=()=>{try{return ua()||ma()||ya()||va()}catch(i){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${i}`);return}},Rr=i=>{var e,t;return(t=(e=wi())==null?void 0:e.emulatorHosts)==null?void 0:t[i]},_a=i=>{const e=Rr(i);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},Dr=()=>{var i;return(i=wi())==null?void 0:i.config},Nr=i=>{var e;return(e=wi())==null?void 0:e[`_${i}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wa{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jt(i){try{return(i.startsWith("http://")||i.startsWith("https://")?new URL(i).hostname:i).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Or(i){return(await fetch(i,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ia(i,e){if(i.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",r=i.iat||0,c=i.sub||i.user_id;if(!c)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const h={iss:`https://securetoken.google.com/${s}`,aud:s,iat:r,exp:r+3600,auth_time:r,sub:c,user_id:c,firebase:{sign_in_provider:"custom",identities:{}},...i};return[yn(JSON.stringify(t)),yn(JSON.stringify(h)),""].join(".")}const Pt={};function Ea(){const i={prod:[],emulator:[]};for(const e of Object.keys(Pt))Pt[e]?i.emulator.push(e):i.prod.push(e);return i}function Ta(i){let e=document.getElementById(i),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",i),t=!0),{created:t,element:e}}let js=!1;function Lr(i,e){if(typeof window>"u"||typeof document>"u"||!jt(window.location.host)||Pt[i]===e||Pt[i]||js)return;Pt[i]=e;function t(T){return`__firebase__banner__${T}`}const s="__firebase__banner",c=Ea().prod.length>0;function h(){const T=document.getElementById(s);T&&T.remove()}function p(T){T.style.display="flex",T.style.background="#7faaf0",T.style.position="fixed",T.style.bottom="5px",T.style.left="5px",T.style.padding=".5em",T.style.borderRadius="5px",T.style.alignItems="center"}function w(T,j){T.setAttribute("width","24"),T.setAttribute("id",j),T.setAttribute("height","24"),T.setAttribute("viewBox","0 0 24 24"),T.setAttribute("fill","none"),T.style.marginLeft="-6px"}function E(){const T=document.createElement("span");return T.style.cursor="pointer",T.style.marginLeft="16px",T.style.fontSize="24px",T.innerHTML=" &times;",T.onclick=()=>{js=!0,h()},T}function S(T,j){T.setAttribute("id",j),T.innerText="Learn more",T.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",T.setAttribute("target","__blank"),T.style.paddingLeft="5px",T.style.textDecoration="underline"}function A(){const T=Ta(s),j=t("text"),C=document.getElementById(j)||document.createElement("span"),U=t("learnmore"),M=document.getElementById(U)||document.createElement("a"),Q=t("preprendIcon"),V=document.getElementById(Q)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(T.created){const $=T.element;p($),S(M,U);const se=E();w(V,Q),$.append(V,C,M,se),document.body.appendChild($)}c?(C.innerText="Preview backend disconnected.",V.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(V.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,C.innerText="Preview backend running in this workspace."),C.setAttribute("id",j)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",A):A()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Y(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function ba(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Y())}function Sa(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Aa(){const i=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof i=="object"&&i.id!==void 0}function ka(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Ca(){const i=Y();return i.indexOf("MSIE ")>=0||i.indexOf("Trident/")>=0}function Pa(){try{return typeof indexedDB=="object"}catch{return!1}}function Ra(){return new Promise((i,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),t||self.indexedDB.deleteDatabase(s),i(!0)},r.onupgradeneeded=()=>{t=!1},r.onerror=()=>{var c;e(((c=r.error)==null?void 0:c.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Da="FirebaseError";class Ie extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=Da,Object.setPrototypeOf(this,Ie.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ut.prototype.create)}}class Ut{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},r=`${this.service}/${e}`,c=this.errors[e],h=c?Na(c,s):"Error",p=`${this.serviceName}: ${h} (${r}).`;return new Ie(r,p,s)}}function Na(i,e){return i.replace(Oa,(t,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const Oa=/\{\$([^}]+)}/g;function La(i){for(const e in i)if(Object.prototype.hasOwnProperty.call(i,e))return!1;return!0}function We(i,e){if(i===e)return!0;const t=Object.keys(i),s=Object.keys(e);for(const r of t){if(!s.includes(r))return!1;const c=i[r],h=e[r];if(Us(c)&&Us(h)){if(!We(c,h))return!1}else if(c!==h)return!1}for(const r of s)if(!t.includes(r))return!1;return!0}function Us(i){return i!==null&&typeof i=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ft(i){const e=[];for(const[t,s]of Object.entries(i))Array.isArray(s)?s.forEach(r=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function Ma(i,e){const t=new xa(i,e);return t.subscribe.bind(t)}class xa{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let r;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");ja(e,["next","error","complete"])?r=e:r={next:e,error:t,complete:s},r.next===void 0&&(r.next=ei),r.error===void 0&&(r.error=ei),r.complete===void 0&&(r.complete=ei);const c=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),c}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function ja(i,e){if(typeof i!="object"||i===null)return!1;for(const t of e)if(t in i&&typeof i[t]=="function")return!0;return!1}function ei(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lt(i){return i&&i._delegate?i._delegate:i}class ze{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fe="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ua{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new wa;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:t});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(r){if(s)return null;throw r}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Ba(e))try{this.getOrInitializeService({instanceIdentifier:Fe})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(t);try{const c=this.getOrInitializeService({instanceIdentifier:r});s.resolve(c)}catch{}}}}clearInstance(e=Fe){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Fe){return this.instances.has(e)}getOptions(e=Fe){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[c,h]of this.instancesDeferred.entries()){const p=this.normalizeInstanceIdentifier(c);s===p&&h.resolve(r)}return r}onInit(e,t){const s=this.normalizeInstanceIdentifier(t),r=this.onInitCallbacks.get(s)??new Set;r.add(e),this.onInitCallbacks.set(s,r);const c=this.instances.get(s);return c&&e(c,s),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const r of s)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:Fa(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=Fe){return this.component?this.component.multipleInstances?e:Fe:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Fa(i){return i===Fe?void 0:i}function Ba(i){return i.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Va{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Ua(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var O;(function(i){i[i.DEBUG=0]="DEBUG",i[i.VERBOSE=1]="VERBOSE",i[i.INFO=2]="INFO",i[i.WARN=3]="WARN",i[i.ERROR=4]="ERROR",i[i.SILENT=5]="SILENT"})(O||(O={}));const Ha={debug:O.DEBUG,verbose:O.VERBOSE,info:O.INFO,warn:O.WARN,error:O.ERROR,silent:O.SILENT},$a=O.INFO,Ga={[O.DEBUG]:"log",[O.VERBOSE]:"log",[O.INFO]:"info",[O.WARN]:"warn",[O.ERROR]:"error"},Wa=(i,e,...t)=>{if(e<i.logLevel)return;const s=new Date().toISOString(),r=Ga[e];if(r)console[r](`[${s}]  ${i.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Ii{constructor(e){this.name=e,this._logLevel=$a,this._logHandler=Wa,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in O))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Ha[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,O.DEBUG,...e),this._logHandler(this,O.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,O.VERBOSE,...e),this._logHandler(this,O.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,O.INFO,...e),this._logHandler(this,O.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,O.WARN,...e),this._logHandler(this,O.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,O.ERROR,...e),this._logHandler(this,O.ERROR,...e)}}const za=(i,e)=>e.some(t=>i instanceof t);let Fs,Bs;function qa(){return Fs||(Fs=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ka(){return Bs||(Bs=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Mr=new WeakMap,ui=new WeakMap,xr=new WeakMap,ti=new WeakMap,Ei=new WeakMap;function Ja(i){const e=new Promise((t,s)=>{const r=()=>{i.removeEventListener("success",c),i.removeEventListener("error",h)},c=()=>{t(De(i.result)),r()},h=()=>{s(i.error),r()};i.addEventListener("success",c),i.addEventListener("error",h)});return e.then(t=>{t instanceof IDBCursor&&Mr.set(t,i)}).catch(()=>{}),Ei.set(e,i),e}function Xa(i){if(ui.has(i))return;const e=new Promise((t,s)=>{const r=()=>{i.removeEventListener("complete",c),i.removeEventListener("error",h),i.removeEventListener("abort",h)},c=()=>{t(),r()},h=()=>{s(i.error||new DOMException("AbortError","AbortError")),r()};i.addEventListener("complete",c),i.addEventListener("error",h),i.addEventListener("abort",h)});ui.set(i,e)}let di={get(i,e,t){if(i instanceof IDBTransaction){if(e==="done")return ui.get(i);if(e==="objectStoreNames")return i.objectStoreNames||xr.get(i);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return De(i[e])},set(i,e,t){return i[e]=t,!0},has(i,e){return i instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in i}};function Ya(i){di=i(di)}function Qa(i){return i===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=i.call(ni(this),e,...t);return xr.set(s,e.sort?e.sort():[e]),De(s)}:Ka().includes(i)?function(...e){return i.apply(ni(this),e),De(Mr.get(this))}:function(...e){return De(i.apply(ni(this),e))}}function Za(i){return typeof i=="function"?Qa(i):(i instanceof IDBTransaction&&Xa(i),za(i,qa())?new Proxy(i,di):i)}function De(i){if(i instanceof IDBRequest)return Ja(i);if(ti.has(i))return ti.get(i);const e=Za(i);return e!==i&&(ti.set(i,e),Ei.set(e,i)),e}const ni=i=>Ei.get(i);function ec(i,e,{blocked:t,upgrade:s,blocking:r,terminated:c}={}){const h=indexedDB.open(i,e),p=De(h);return s&&h.addEventListener("upgradeneeded",w=>{s(De(h.result),w.oldVersion,w.newVersion,De(h.transaction),w)}),t&&h.addEventListener("blocked",w=>t(w.oldVersion,w.newVersion,w)),p.then(w=>{c&&w.addEventListener("close",()=>c()),r&&w.addEventListener("versionchange",E=>r(E.oldVersion,E.newVersion,E))}).catch(()=>{}),p}const tc=["get","getKey","getAll","getAllKeys","count"],nc=["put","add","delete","clear"],ii=new Map;function Vs(i,e){if(!(i instanceof IDBDatabase&&!(e in i)&&typeof e=="string"))return;if(ii.get(e))return ii.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,r=nc.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(r||tc.includes(t)))return;const c=async function(h,...p){const w=this.transaction(h,r?"readwrite":"readonly");let E=w.store;return s&&(E=E.index(p.shift())),(await Promise.all([E[t](...p),r&&w.done]))[0]};return ii.set(e,c),c}Ya(i=>({...i,get:(e,t,s)=>Vs(e,t)||i.get(e,t,s),has:(e,t)=>!!Vs(e,t)||i.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ic{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(sc(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function sc(i){const e=i.getComponent();return(e==null?void 0:e.type)==="VERSION"}const fi="@firebase/app",Hs="0.14.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ve=new Ii("@firebase/app"),rc="@firebase/app-compat",oc="@firebase/analytics-compat",ac="@firebase/analytics",cc="@firebase/app-check-compat",lc="@firebase/app-check",hc="@firebase/auth",uc="@firebase/auth-compat",dc="@firebase/database",fc="@firebase/data-connect",pc="@firebase/database-compat",gc="@firebase/functions",mc="@firebase/functions-compat",yc="@firebase/installations",vc="@firebase/installations-compat",_c="@firebase/messaging",wc="@firebase/messaging-compat",Ic="@firebase/performance",Ec="@firebase/performance-compat",Tc="@firebase/remote-config",bc="@firebase/remote-config-compat",Sc="@firebase/storage",Ac="@firebase/storage-compat",kc="@firebase/firestore",Cc="@firebase/ai",Pc="@firebase/firestore-compat",Rc="firebase",Dc="12.0.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pi="[DEFAULT]",Nc={[fi]:"fire-core",[rc]:"fire-core-compat",[ac]:"fire-analytics",[oc]:"fire-analytics-compat",[lc]:"fire-app-check",[cc]:"fire-app-check-compat",[hc]:"fire-auth",[uc]:"fire-auth-compat",[dc]:"fire-rtdb",[fc]:"fire-data-connect",[pc]:"fire-rtdb-compat",[gc]:"fire-fn",[mc]:"fire-fn-compat",[yc]:"fire-iid",[vc]:"fire-iid-compat",[_c]:"fire-fcm",[wc]:"fire-fcm-compat",[Ic]:"fire-perf",[Ec]:"fire-perf-compat",[Tc]:"fire-rc",[bc]:"fire-rc-compat",[Sc]:"fire-gcs",[Ac]:"fire-gcs-compat",[kc]:"fire-fst",[Pc]:"fire-fst-compat",[Cc]:"fire-vertex","fire-js":"fire-js",[Rc]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vn=new Map,Oc=new Map,gi=new Map;function $s(i,e){try{i.container.addComponent(e)}catch(t){ve.debug(`Component ${e.name} failed to register with FirebaseApp ${i.name}`,t)}}function ot(i){const e=i.name;if(gi.has(e))return ve.debug(`There were multiple attempts to register component ${e}.`),!1;gi.set(e,i);for(const t of vn.values())$s(t,i);for(const t of Oc.values())$s(t,i);return!0}function Ti(i,e){const t=i.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),i.container.getProvider(e)}function ce(i){return i==null?!1:i.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lc={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ne=new Ut("app","Firebase",Lc);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mc{constructor(e,t,s){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new ze("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ne.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ht=Dc;function jr(i,e={}){let t=i;typeof e!="object"&&(e={name:e});const s={name:pi,automaticDataCollectionEnabled:!0,...e},r=s.name;if(typeof r!="string"||!r)throw Ne.create("bad-app-name",{appName:String(r)});if(t||(t=Dr()),!t)throw Ne.create("no-options");const c=vn.get(r);if(c){if(We(t,c.options)&&We(s,c.config))return c;throw Ne.create("duplicate-app",{appName:r})}const h=new Va(r);for(const w of gi.values())h.addComponent(w);const p=new Mc(t,s,h);return vn.set(r,p),p}function Ur(i=pi){const e=vn.get(i);if(!e&&i===pi&&Dr())return jr();if(!e)throw Ne.create("no-app",{appName:i});return e}function Oe(i,e,t){let s=Nc[i]??i;t&&(s+=`-${t}`);const r=s.match(/\s|\//),c=e.match(/\s|\//);if(r||c){const h=[`Unable to register library "${s}" with version "${e}":`];r&&h.push(`library name "${s}" contains illegal characters (whitespace or "/")`),r&&c&&h.push("and"),c&&h.push(`version name "${e}" contains illegal characters (whitespace or "/")`),ve.warn(h.join(" "));return}ot(new ze(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xc="firebase-heartbeat-database",jc=1,Lt="firebase-heartbeat-store";let si=null;function Fr(){return si||(si=ec(xc,jc,{upgrade:(i,e)=>{switch(e){case 0:try{i.createObjectStore(Lt)}catch(t){console.warn(t)}}}}).catch(i=>{throw Ne.create("idb-open",{originalErrorMessage:i.message})})),si}async function Uc(i){try{const t=(await Fr()).transaction(Lt),s=await t.objectStore(Lt).get(Br(i));return await t.done,s}catch(e){if(e instanceof Ie)ve.warn(e.message);else{const t=Ne.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});ve.warn(t.message)}}}async function Gs(i,e){try{const s=(await Fr()).transaction(Lt,"readwrite");await s.objectStore(Lt).put(e,Br(i)),await s.done}catch(t){if(t instanceof Ie)ve.warn(t.message);else{const s=Ne.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});ve.warn(s.message)}}}function Br(i){return`${i.name}!${i.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fc=1024,Bc=30;class Vc{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new $c(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),c=Ws();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===c||this._heartbeatsCache.heartbeats.some(h=>h.date===c))return;if(this._heartbeatsCache.heartbeats.push({date:c,agent:r}),this._heartbeatsCache.heartbeats.length>Bc){const h=Gc(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(h,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){ve.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Ws(),{heartbeatsToSend:s,unsentEntries:r}=Hc(this._heartbeatsCache.heartbeats),c=yn(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),c}catch(t){return ve.warn(t),""}}}function Ws(){return new Date().toISOString().substring(0,10)}function Hc(i,e=Fc){const t=[];let s=i.slice();for(const r of i){const c=t.find(h=>h.agent===r.agent);if(c){if(c.dates.push(r.date),zs(t)>e){c.dates.pop();break}}else if(t.push({agent:r.agent,dates:[r.date]}),zs(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class $c{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Pa()?Ra().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Uc(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return Gs(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return Gs(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function zs(i){return yn(JSON.stringify({version:2,heartbeats:i})).length}function Gc(i){if(i.length===0)return-1;let e=0,t=i[0].date;for(let s=1;s<i.length;s++)i[s].date<t&&(t=i[s].date,e=s);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wc(i){ot(new ze("platform-logger",e=>new ic(e),"PRIVATE")),ot(new ze("heartbeat",e=>new Vc(e),"PRIVATE")),Oe(fi,Hs,i),Oe(fi,Hs,"esm2020"),Oe("fire-js","")}Wc("");var zc="firebase",qc="12.0.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Oe(zc,qc,"app");function Vr(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Kc=Vr,Hr=new Ut("auth","Firebase",Vr());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _n=new Ii("@firebase/auth");function Jc(i,...e){_n.logLevel<=O.WARN&&_n.warn(`Auth (${ht}): ${i}`,...e)}function dn(i,...e){_n.logLevel<=O.ERROR&&_n.error(`Auth (${ht}): ${i}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _e(i,...e){throw bi(i,...e)}function he(i,...e){return bi(i,...e)}function $r(i,e,t){const s={...Kc(),[e]:t};return new Ut("auth","Firebase",s).create(e,{appName:i.name})}function He(i){return $r(i,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function bi(i,...e){if(typeof i!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=i.name),i._errorFactory.create(t,...s)}return Hr.create(i,...e)}function k(i,e,...t){if(!i)throw bi(e,...t)}function me(i){const e="INTERNAL ASSERTION FAILED: "+i;throw dn(e),new Error(e)}function we(i,e){i||me(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mi(){var i;return typeof self<"u"&&((i=self.location)==null?void 0:i.href)||""}function Xc(){return qs()==="http:"||qs()==="https:"}function qs(){var i;return typeof self<"u"&&((i=self.location)==null?void 0:i.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yc(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Xc()||Aa()||"connection"in navigator)?navigator.onLine:!0}function Qc(){if(typeof navigator>"u")return null;const i=navigator;return i.languages&&i.languages[0]||i.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bt{constructor(e,t){this.shortDelay=e,this.longDelay=t,we(t>e,"Short delay should be less than long delay!"),this.isMobile=ba()||ka()}get(){return Yc()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Si(i,e){we(i.emulator,"Emulator should always be set here");const{url:t}=i.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gr{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;me("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;me("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;me("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zc={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const el=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],tl=new Bt(3e4,6e4);function Ai(i,e){return i.tenantId&&!e.tenantId?{...e,tenantId:i.tenantId}:e}async function ut(i,e,t,s,r={}){return Wr(i,r,async()=>{let c={},h={};s&&(e==="GET"?h=s:c={body:JSON.stringify(s)});const p=Ft({key:i.config.apiKey,...h}).slice(1),w=await i._getAdditionalHeaders();w["Content-Type"]="application/json",i.languageCode&&(w["X-Firebase-Locale"]=i.languageCode);const E={method:e,headers:w,...c};return Sa()||(E.referrerPolicy="no-referrer"),i.emulatorConfig&&jt(i.emulatorConfig.host)&&(E.credentials="include"),Gr.fetch()(await zr(i,i.config.apiHost,t,p),E)})}async function Wr(i,e,t){i._canInitEmulator=!1;const s={...Zc,...e};try{const r=new il(i),c=await Promise.race([t(),r.promise]);r.clearNetworkTimeout();const h=await c.json();if("needConfirmation"in h)throw ln(i,"account-exists-with-different-credential",h);if(c.ok&&!("errorMessage"in h))return h;{const p=c.ok?h.errorMessage:h.error.message,[w,E]=p.split(" : ");if(w==="FEDERATED_USER_ID_ALREADY_LINKED")throw ln(i,"credential-already-in-use",h);if(w==="EMAIL_EXISTS")throw ln(i,"email-already-in-use",h);if(w==="USER_DISABLED")throw ln(i,"user-disabled",h);const S=s[w]||w.toLowerCase().replace(/[_\s]+/g,"-");if(E)throw $r(i,S,E);_e(i,S)}}catch(r){if(r instanceof Ie)throw r;_e(i,"network-request-failed",{message:String(r)})}}async function nl(i,e,t,s,r={}){const c=await ut(i,e,t,s,r);return"mfaPendingCredential"in c&&_e(i,"multi-factor-auth-required",{_serverResponse:c}),c}async function zr(i,e,t,s){const r=`${e}${t}?${s}`,c=i,h=c.config.emulator?Si(i.config,r):`${i.config.apiScheme}://${r}`;return el.includes(t)&&(await c._persistenceManagerAvailable,c._getPersistenceType()==="COOKIE")?c._getPersistence()._getFinalTarget(h).toString():h}class il{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(he(this.auth,"network-request-failed")),tl.get())})}}function ln(i,e,t){const s={appName:i.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const r=he(i,e,s);return r.customData._tokenResponse=t,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sl(i,e){return ut(i,"POST","/v1/accounts:delete",e)}async function wn(i,e){return ut(i,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rt(i){if(i)try{const e=new Date(Number(i));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function rl(i,e=!1){const t=lt(i),s=await t.getIdToken(e),r=ki(s);k(r&&r.exp&&r.auth_time&&r.iat,t.auth,"internal-error");const c=typeof r.firebase=="object"?r.firebase:void 0,h=c==null?void 0:c.sign_in_provider;return{claims:r,token:s,authTime:Rt(ri(r.auth_time)),issuedAtTime:Rt(ri(r.iat)),expirationTime:Rt(ri(r.exp)),signInProvider:h||null,signInSecondFactor:(c==null?void 0:c.sign_in_second_factor)||null}}function ri(i){return Number(i)*1e3}function ki(i){const[e,t,s]=i.split(".");if(e===void 0||t===void 0||s===void 0)return dn("JWT malformed, contained fewer than 3 sections"),null;try{const r=Pr(t);return r?JSON.parse(r):(dn("Failed to decode base64 JWT payload"),null)}catch(r){return dn("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function Ks(i){const e=ki(i);return k(e,"internal-error"),k(typeof e.exp<"u","internal-error"),k(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Mt(i,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof Ie&&ol(s)&&i.auth.currentUser===i&&await i.auth.signOut(),s}}function ol({code:i}){return i==="auth/user-disabled"||i==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class al{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const s=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yi{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Rt(this.lastLoginAt),this.creationTime=Rt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function In(i){var A;const e=i.auth,t=await i.getIdToken(),s=await Mt(i,wn(e,{idToken:t}));k(s==null?void 0:s.users.length,e,"internal-error");const r=s.users[0];i._notifyReloadListener(r);const c=(A=r.providerUserInfo)!=null&&A.length?qr(r.providerUserInfo):[],h=ll(i.providerData,c),p=i.isAnonymous,w=!(i.email&&r.passwordHash)&&!(h!=null&&h.length),E=p?w:!1,S={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:h,metadata:new yi(r.createdAt,r.lastLoginAt),isAnonymous:E};Object.assign(i,S)}async function cl(i){const e=lt(i);await In(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function ll(i,e){return[...i.filter(s=>!e.some(r=>r.providerId===s.providerId)),...e]}function qr(i){return i.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hl(i,e){const t=await Wr(i,{},async()=>{const s=Ft({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:c}=i.config,h=await zr(i,r,"/v1/token",`key=${c}`),p=await i._getAdditionalHeaders();p["Content-Type"]="application/x-www-form-urlencoded";const w={method:"POST",headers:p,body:s};return i.emulatorConfig&&jt(i.emulatorConfig.host)&&(w.credentials="include"),Gr.fetch()(h,w)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function ul(i,e){return ut(i,"POST","/v2/accounts:revokeToken",Ai(i,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){k(e.idToken,"internal-error"),k(typeof e.idToken<"u","internal-error"),k(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Ks(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){k(e.length!==0,"internal-error");const t=Ks(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(k(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:r,expiresIn:c}=await hl(e,t);this.updateTokensAndExpiration(s,r,Number(c))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:r,expirationTime:c}=t,h=new nt;return s&&(k(typeof s=="string","internal-error",{appName:e}),h.refreshToken=s),r&&(k(typeof r=="string","internal-error",{appName:e}),h.accessToken=r),c&&(k(typeof c=="number","internal-error",{appName:e}),h.expirationTime=c),h}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new nt,this.toJSON())}_performRefresh(){return me("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ae(i,e){k(typeof i=="string"||typeof i>"u","internal-error",{appName:e})}class ne{constructor({uid:e,auth:t,stsTokenManager:s,...r}){this.providerId="firebase",this.proactiveRefresh=new al(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new yi(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(e){const t=await Mt(this,this.stsTokenManager.getToken(this.auth,e));return k(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return rl(this,e)}reload(){return cl(this)}_assign(e){this!==e&&(k(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new ne({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){k(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await In(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ce(this.auth.app))return Promise.reject(He(this.auth));const e=await this.getIdToken();return await Mt(this,sl(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const s=t.displayName??void 0,r=t.email??void 0,c=t.phoneNumber??void 0,h=t.photoURL??void 0,p=t.tenantId??void 0,w=t._redirectEventId??void 0,E=t.createdAt??void 0,S=t.lastLoginAt??void 0,{uid:A,emailVerified:T,isAnonymous:j,providerData:C,stsTokenManager:U}=t;k(A&&U,e,"internal-error");const M=nt.fromJSON(this.name,U);k(typeof A=="string",e,"internal-error"),Ae(s,e.name),Ae(r,e.name),k(typeof T=="boolean",e,"internal-error"),k(typeof j=="boolean",e,"internal-error"),Ae(c,e.name),Ae(h,e.name),Ae(p,e.name),Ae(w,e.name),Ae(E,e.name),Ae(S,e.name);const Q=new ne({uid:A,auth:e,email:r,emailVerified:T,displayName:s,isAnonymous:j,photoURL:h,phoneNumber:c,tenantId:p,stsTokenManager:M,createdAt:E,lastLoginAt:S});return C&&Array.isArray(C)&&(Q.providerData=C.map(V=>({...V}))),w&&(Q._redirectEventId=w),Q}static async _fromIdTokenResponse(e,t,s=!1){const r=new nt;r.updateFromServerResponse(t);const c=new ne({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:s});return await In(c),c}static async _fromGetAccountInfoResponse(e,t,s){const r=t.users[0];k(r.localId!==void 0,"internal-error");const c=r.providerUserInfo!==void 0?qr(r.providerUserInfo):[],h=!(r.email&&r.passwordHash)&&!(c!=null&&c.length),p=new nt;p.updateFromIdToken(s);const w=new ne({uid:r.localId,auth:e,stsTokenManager:p,isAnonymous:h}),E={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:c,metadata:new yi(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(c!=null&&c.length)};return Object.assign(w,E),w}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Js=new Map;function ye(i){we(i instanceof Function,"Expected a class definition");let e=Js.get(i);return e?(we(e instanceof i,"Instance stored in cache mismatched with class"),e):(e=new i,Js.set(i,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kr{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Kr.type="NONE";const Xs=Kr;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fn(i,e,t){return`firebase:${i}:${e}:${t}`}class it{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:r,name:c}=this.auth;this.fullUserKey=fn(this.userKey,r.apiKey,c),this.fullPersistenceKey=fn("persistence",r.apiKey,c),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await wn(this.auth,{idToken:e}).catch(()=>{});return t?ne._fromGetAccountInfoResponse(this.auth,t,e):null}return ne._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new it(ye(Xs),e,s);const r=(await Promise.all(t.map(async E=>{if(await E._isAvailable())return E}))).filter(E=>E);let c=r[0]||ye(Xs);const h=fn(s,e.config.apiKey,e.name);let p=null;for(const E of t)try{const S=await E._get(h);if(S){let A;if(typeof S=="string"){const T=await wn(e,{idToken:S}).catch(()=>{});if(!T)break;A=await ne._fromGetAccountInfoResponse(e,T,S)}else A=ne._fromJSON(e,S);E!==c&&(p=A),c=E;break}}catch{}const w=r.filter(E=>E._shouldAllowMigration);return!c._shouldAllowMigration||!w.length?new it(c,e,s):(c=w[0],p&&await c._set(h,p.toJSON()),await Promise.all(t.map(async E=>{if(E!==c)try{await E._remove(h)}catch{}})),new it(c,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ys(i){const e=i.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Qr(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Jr(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(eo(e))return"Blackberry";if(to(e))return"Webos";if(Xr(e))return"Safari";if((e.includes("chrome/")||Yr(e))&&!e.includes("edge/"))return"Chrome";if(Zr(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=i.match(t);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function Jr(i=Y()){return/firefox\//i.test(i)}function Xr(i=Y()){const e=i.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Yr(i=Y()){return/crios\//i.test(i)}function Qr(i=Y()){return/iemobile/i.test(i)}function Zr(i=Y()){return/android/i.test(i)}function eo(i=Y()){return/blackberry/i.test(i)}function to(i=Y()){return/webos/i.test(i)}function Ci(i=Y()){return/iphone|ipad|ipod/i.test(i)||/macintosh/i.test(i)&&/mobile/i.test(i)}function dl(i=Y()){var e;return Ci(i)&&!!((e=window.navigator)!=null&&e.standalone)}function fl(){return Ca()&&document.documentMode===10}function no(i=Y()){return Ci(i)||Zr(i)||to(i)||eo(i)||/windows phone/i.test(i)||Qr(i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function io(i,e=[]){let t;switch(i){case"Browser":t=Ys(Y());break;case"Worker":t=`${Ys(Y())}-${i}`;break;default:t=i}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${ht}/${s}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pl{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const s=c=>new Promise((h,p)=>{try{const w=e(c);h(w)}catch(w){p(w)}});s.onAbort=t,this.queue.push(s);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const s of this.queue)await s(e),s.onAbort&&t.push(s.onAbort)}catch(s){t.reverse();for(const r of t)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gl(i,e={}){return ut(i,"GET","/v2/passwordPolicy",Ai(i,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ml=6;class yl{constructor(e){var s;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??ml,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((s=e.allowedNonAlphanumericCharacters)==null?void 0:s.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let r=0;r<e.length;r++)s=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,r,c){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vl{constructor(e,t,s,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Qs(this),this.idTokenSubscription=new Qs(this),this.beforeStateQueue=new pl(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Hr,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion,this._persistenceManagerAvailable=new Promise(c=>this._resolvePersistenceManagerAvailable=c)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=ye(t)),this._initializationPromise=this.queue(async()=>{var s,r,c;if(!this._deleted&&(this.persistenceManager=await it.create(this,e),(s=this._resolvePersistenceManagerAvailable)==null||s.call(this),!this._deleted)){if((r=this._popupRedirectResolver)!=null&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((c=this.currentUser)==null?void 0:c.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await wn(this,{idToken:e}),s=await ne._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var c;if(ce(this.app)){const h=this.app.settings.authIdToken;return h?new Promise(p=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(h).then(p,p))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let s=t,r=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const h=(c=this.redirectUser)==null?void 0:c._redirectEventId,p=s==null?void 0:s._redirectEventId,w=await this.tryRedirectSignIn(e);(!h||h===p)&&(w!=null&&w.user)&&(s=w.user,r=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(r)try{await this.beforeStateQueue.runMiddleware(s)}catch(h){s=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(h))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return k(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await In(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Qc()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(ce(this.app))return Promise.reject(He(this));const t=e?lt(e):null;return t&&k(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&k(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return ce(this.app)?Promise.reject(He(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return ce(this.app)?Promise.reject(He(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(ye(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await gl(this),t=new yl(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Ut("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await ul(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&ye(e)||this._popupRedirectResolver;k(t,this,"argument-error"),this.redirectPersistenceManager=await it.create(this,[ye(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,s;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((s=this.redirectUser)==null?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,r){if(this._deleted)return()=>{};const c=typeof t=="function"?t:t.next.bind(t);let h=!1;const p=this._isInitialized?Promise.resolve():this._initializationPromise;if(k(p,this,"internal-error"),p.then(()=>{h||c(this.currentUser)}),typeof t=="function"){const w=e.addObserver(t,s,r);return()=>{h=!0,w()}}else{const w=e.addObserver(t);return()=>{h=!0,w()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return k(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=io(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var r;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((r=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:r.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const s=await this._getAppCheckToken();return s&&(e["X-Firebase-AppCheck"]=s),e}async _getAppCheckToken(){var t;if(ce(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&Jc(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Pi(i){return lt(i)}class Qs{constructor(e){this.auth=e,this.observer=null,this.addObserver=Ma(t=>this.observer=t)}get next(){return k(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ri={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function _l(i){Ri=i}function wl(i){return Ri.loadJS(i)}function Il(){return Ri.gapiScript}function El(i){return`__${i}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tl(i,e){const t=Ti(i,"auth");if(t.isInitialized()){const r=t.getImmediate(),c=t.getOptions();if(We(c,e??{}))return r;_e(r,"already-initialized")}return t.initialize({options:e})}function bl(i,e){const t=(e==null?void 0:e.persistence)||[],s=(Array.isArray(t)?t:[t]).map(ye);e!=null&&e.errorMap&&i._updateErrorMap(e.errorMap),i._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function Sl(i,e,t){const s=Pi(i);k(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const r=!1,c=so(e),{host:h,port:p}=Al(e),w=p===null?"":`:${p}`,E={url:`${c}//${h}${w}/`},S=Object.freeze({host:h,port:p,protocol:c.replace(":",""),options:Object.freeze({disableWarnings:r})});if(!s._canInitEmulator){k(s.config.emulator&&s.emulatorConfig,s,"emulator-config-failed"),k(We(E,s.config.emulator)&&We(S,s.emulatorConfig),s,"emulator-config-failed");return}s.config.emulator=E,s.emulatorConfig=S,s.settings.appVerificationDisabledForTesting=!0,jt(h)?(Or(`${c}//${h}${w}`),Lr("Auth",!0)):kl()}function so(i){const e=i.indexOf(":");return e<0?"":i.substr(0,e+1)}function Al(i){const e=so(i),t=/(\/\/)?([^?#/]+)/.exec(i.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(s);if(r){const c=r[1];return{host:c,port:Zs(s.substr(c.length+1))}}else{const[c,h]=s.split(":");return{host:c,port:Zs(h)}}}function Zs(i){if(!i)return null;const e=Number(i);return isNaN(e)?null:e}function kl(){function i(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",i):i())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ro{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return me("not implemented")}_getIdTokenResponse(e){return me("not implemented")}_linkToIdToken(e,t){return me("not implemented")}_getReauthenticationResolver(e){return me("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function st(i,e){return nl(i,"POST","/v1/accounts:signInWithIdp",Ai(i,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cl="http://localhost";class qe extends ro{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new qe(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):_e("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:r,...c}=t;if(!s||!r)return null;const h=new qe(s,r);return h.idToken=c.idToken||void 0,h.accessToken=c.accessToken||void 0,h.secret=c.secret,h.nonce=c.nonce,h.pendingToken=c.pendingToken||null,h}_getIdTokenResponse(e){const t=this.buildRequest();return st(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,st(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,st(e,t)}buildRequest(){const e={requestUri:Cl,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Ft(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oo{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vt extends oo{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke extends Vt{constructor(){super("facebook.com")}static credential(e){return qe._fromParams({providerId:ke.PROVIDER_ID,signInMethod:ke.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ke.credentialFromTaggedObject(e)}static credentialFromError(e){return ke.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ke.credential(e.oauthAccessToken)}catch{return null}}}ke.FACEBOOK_SIGN_IN_METHOD="facebook.com";ke.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ce extends Vt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return qe._fromParams({providerId:Ce.PROVIDER_ID,signInMethod:Ce.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Ce.credentialFromTaggedObject(e)}static credentialFromError(e){return Ce.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return Ce.credential(t,s)}catch{return null}}}Ce.GOOGLE_SIGN_IN_METHOD="google.com";Ce.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe extends Vt{constructor(){super("github.com")}static credential(e){return qe._fromParams({providerId:Pe.PROVIDER_ID,signInMethod:Pe.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Pe.credentialFromTaggedObject(e)}static credentialFromError(e){return Pe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Pe.credential(e.oauthAccessToken)}catch{return null}}}Pe.GITHUB_SIGN_IN_METHOD="github.com";Pe.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Re extends Vt{constructor(){super("twitter.com")}static credential(e,t){return qe._fromParams({providerId:Re.PROVIDER_ID,signInMethod:Re.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Re.credentialFromTaggedObject(e)}static credentialFromError(e){return Re.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return Re.credential(t,s)}catch{return null}}}Re.TWITTER_SIGN_IN_METHOD="twitter.com";Re.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class at{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,r=!1){const c=await ne._fromIdTokenResponse(e,s,r),h=er(s);return new at({user:c,providerId:h,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const r=er(s);return new at({user:e,providerId:r,_tokenResponse:s,operationType:t})}}function er(i){return i.providerId?i.providerId:"phoneNumber"in i?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class En extends Ie{constructor(e,t,s,r){super(t.code,t.message),this.operationType=s,this.user=r,Object.setPrototypeOf(this,En.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,r){return new En(e,t,s,r)}}function ao(i,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(i):t._getIdTokenResponse(i)).catch(c=>{throw c.code==="auth/multi-factor-auth-required"?En._fromErrorAndOperation(i,c,e,s):c})}async function Pl(i,e,t=!1){const s=await Mt(i,e._linkToIdToken(i.auth,await i.getIdToken()),t);return at._forOperation(i,"link",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rl(i,e,t=!1){const{auth:s}=i;if(ce(s.app))return Promise.reject(He(s));const r="reauthenticate";try{const c=await Mt(i,ao(s,r,e,i),t);k(c.idToken,s,"internal-error");const h=ki(c.idToken);k(h,s,"internal-error");const{sub:p}=h;return k(i.uid===p,s,"user-mismatch"),at._forOperation(i,r,c)}catch(c){throw(c==null?void 0:c.code)==="auth/user-not-found"&&_e(s,"user-mismatch"),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dl(i,e,t=!1){if(ce(i.app))return Promise.reject(He(i));const s="signIn",r=await ao(i,s,e),c=await at._fromIdTokenResponse(i,s,r);return t||await i._updateCurrentUser(c.user),c}function Nl(i,e,t,s){return lt(i).onIdTokenChanged(e,t,s)}function Ol(i,e,t){return lt(i).beforeAuthStateChanged(e,t)}const Tn="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class co{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Tn,"1"),this.storage.removeItem(Tn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ll=1e3,Ml=10;class lo extends co{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=no(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),r=this.localCache[t];s!==r&&e(t,r,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((h,p,w)=>{this.notifyListeners(h,w)});return}const s=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const h=this.storage.getItem(s);!t&&this.localCache[s]===h||this.notifyListeners(s,h)},c=this.storage.getItem(s);fl()&&c!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,Ml):r()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},Ll)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}lo.type="LOCAL";const xl=lo;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ho extends co{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}ho.type="SESSION";const uo=ho;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jl(i){return Promise.all(i.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class An{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(r=>r.isListeningto(e));if(t)return t;const s=new An(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:r,data:c}=t.data,h=this.handlersMap[r];if(!(h!=null&&h.size))return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:r});const p=Array.from(h).map(async E=>E(t.origin,c)),w=await jl(p);t.ports[0].postMessage({status:"done",eventId:s,eventType:r,response:w})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}An.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Di(i="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return i+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ul{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let c,h;return new Promise((p,w)=>{const E=Di("",20);r.port1.start();const S=setTimeout(()=>{w(new Error("unsupported_event"))},s);h={messageChannel:r,onMessage(A){const T=A;if(T.data.eventId===E)switch(T.data.status){case"ack":clearTimeout(S),c=setTimeout(()=>{w(new Error("timeout"))},3e3);break;case"done":clearTimeout(c),p(T.data.response);break;default:clearTimeout(S),clearTimeout(c),w(new Error("invalid_response"));break}}},this.handlers.add(h),r.port1.addEventListener("message",h.onMessage),this.target.postMessage({eventType:e,eventId:E,data:t},[r.port2])}).finally(()=>{h&&this.removeMessageHandler(h)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ue(){return window}function Fl(i){ue().location.href=i}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fo(){return typeof ue().WorkerGlobalScope<"u"&&typeof ue().importScripts=="function"}async function Bl(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Vl(){var i;return((i=navigator==null?void 0:navigator.serviceWorker)==null?void 0:i.controller)||null}function Hl(){return fo()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const po="firebaseLocalStorageDb",$l=1,bn="firebaseLocalStorage",go="fbase_key";class Ht{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function kn(i,e){return i.transaction([bn],e?"readwrite":"readonly").objectStore(bn)}function Gl(){const i=indexedDB.deleteDatabase(po);return new Ht(i).toPromise()}function vi(){const i=indexedDB.open(po,$l);return new Promise((e,t)=>{i.addEventListener("error",()=>{t(i.error)}),i.addEventListener("upgradeneeded",()=>{const s=i.result;try{s.createObjectStore(bn,{keyPath:go})}catch(r){t(r)}}),i.addEventListener("success",async()=>{const s=i.result;s.objectStoreNames.contains(bn)?e(s):(s.close(),await Gl(),e(await vi()))})})}async function tr(i,e,t){const s=kn(i,!0).put({[go]:e,value:t});return new Ht(s).toPromise()}async function Wl(i,e){const t=kn(i,!1).get(e),s=await new Ht(t).toPromise();return s===void 0?null:s.value}function nr(i,e){const t=kn(i,!0).delete(e);return new Ht(t).toPromise()}const zl=800,ql=3;class mo{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await vi(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>ql)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return fo()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=An._getInstance(Hl()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,s;if(this.activeServiceWorker=await Bl(),!this.activeServiceWorker)return;this.sender=new Ul(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(s=e[0])!=null&&s.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Vl()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await vi();return await tr(e,Tn,"1"),await nr(e,Tn),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>tr(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>Wl(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>nr(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const c=kn(r,!1).getAll();return new Ht(c).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:r,value:c}of e)s.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(c)&&(this.notifyListeners(r,c),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!s.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),zl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}mo.type="LOCAL";const Kl=mo;new Bt(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jl(i,e){return e?ye(e):(k(i._popupRedirectResolver,i,"argument-error"),i._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ni extends ro{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return st(e,this._buildIdpRequest())}_linkToIdToken(e,t){return st(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return st(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Xl(i){return Dl(i.auth,new Ni(i),i.bypassAuthState)}function Yl(i){const{auth:e,user:t}=i;return k(t,e,"internal-error"),Rl(t,new Ni(i),i.bypassAuthState)}async function Ql(i){const{auth:e,user:t}=i;return k(t,e,"internal-error"),Pl(t,new Ni(i),i.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yo{constructor(e,t,s,r,c=!1){this.auth=e,this.resolver=s,this.user=r,this.bypassAuthState=c,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:r,tenantId:c,error:h,type:p}=e;if(h){this.reject(h);return}const w={auth:this.auth,requestUri:t,sessionId:s,tenantId:c||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(p)(w))}catch(E){this.reject(E)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Xl;case"linkViaPopup":case"linkViaRedirect":return Ql;case"reauthViaPopup":case"reauthViaRedirect":return Yl;default:_e(this.auth,"internal-error")}}resolve(e){we(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){we(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zl=new Bt(2e3,1e4);class tt extends yo{constructor(e,t,s,r,c){super(e,t,r,c),this.provider=s,this.authWindow=null,this.pollId=null,tt.currentPopupAction&&tt.currentPopupAction.cancel(),tt.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return k(e,this.auth,"internal-error"),e}async onExecution(){we(this.filter.length===1,"Popup operations only handle one event");const e=Di();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(he(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(he(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,tt.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,s;if((s=(t=this.authWindow)==null?void 0:t.window)!=null&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(he(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Zl.get())};e()}}tt.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eh="pendingRedirect",pn=new Map;class th extends yo{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=pn.get(this.auth._key());if(!e){try{const s=await nh(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}pn.set(this.auth._key(),e)}return this.bypassAuthState||pn.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function nh(i,e){const t=rh(e),s=sh(i);if(!await s._isAvailable())return!1;const r=await s._get(t)==="true";return await s._remove(t),r}function ih(i,e){pn.set(i._key(),e)}function sh(i){return ye(i._redirectPersistence)}function rh(i){return fn(eh,i.config.apiKey,i.name)}async function oh(i,e,t=!1){if(ce(i.app))return Promise.reject(He(i));const s=Pi(i),r=Jl(s,e),h=await new th(s,r,t).execute();return h&&!t&&(delete h.user._redirectEventId,await s._persistUserIfCurrent(h.user),await s._setRedirectUser(null,e)),h}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ah=10*60*1e3;class ch{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!lh(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var s;if(e.error&&!vo(e)){const r=((s=e.error.code)==null?void 0:s.split("auth/")[1])||"internal-error";t.onError(he(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=ah&&this.cachedEventUids.clear(),this.cachedEventUids.has(ir(e))}saveEventToCache(e){this.cachedEventUids.add(ir(e)),this.lastProcessedEventTime=Date.now()}}function ir(i){return[i.type,i.eventId,i.sessionId,i.tenantId].filter(e=>e).join("-")}function vo({type:i,error:e}){return i==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function lh(i){switch(i.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return vo(i);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hh(i,e={}){return ut(i,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uh=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,dh=/^https?/;async function fh(i){if(i.config.emulator)return;const{authorizedDomains:e}=await hh(i);for(const t of e)try{if(ph(t))return}catch{}_e(i,"unauthorized-domain")}function ph(i){const e=mi(),{protocol:t,hostname:s}=new URL(e);if(i.startsWith("chrome-extension://")){const h=new URL(i);return h.hostname===""&&s===""?t==="chrome-extension:"&&i.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&h.hostname===s}if(!dh.test(t))return!1;if(uh.test(i))return s===i;const r=i.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(s)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gh=new Bt(3e4,6e4);function sr(){const i=ue().___jsl;if(i!=null&&i.H){for(const e of Object.keys(i.H))if(i.H[e].r=i.H[e].r||[],i.H[e].L=i.H[e].L||[],i.H[e].r=[...i.H[e].L],i.CP)for(let t=0;t<i.CP.length;t++)i.CP[t]=null}}function mh(i){return new Promise((e,t)=>{var r,c,h;function s(){sr(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{sr(),t(he(i,"network-request-failed"))},timeout:gh.get()})}if((c=(r=ue().gapi)==null?void 0:r.iframes)!=null&&c.Iframe)e(gapi.iframes.getContext());else if((h=ue().gapi)!=null&&h.load)s();else{const p=El("iframefcb");return ue()[p]=()=>{gapi.load?s():t(he(i,"network-request-failed"))},wl(`${Il()}?onload=${p}`).catch(w=>t(w))}}).catch(e=>{throw gn=null,e})}let gn=null;function yh(i){return gn=gn||mh(i),gn}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vh=new Bt(5e3,15e3),_h="__/auth/iframe",wh="emulator/auth/iframe",Ih={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Eh=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Th(i){const e=i.config;k(e.authDomain,i,"auth-domain-config-required");const t=e.emulator?Si(e,wh):`https://${i.config.authDomain}/${_h}`,s={apiKey:e.apiKey,appName:i.name,v:ht},r=Eh.get(i.config.apiHost);r&&(s.eid=r);const c=i._getFrameworks();return c.length&&(s.fw=c.join(",")),`${t}?${Ft(s).slice(1)}`}async function bh(i){const e=await yh(i),t=ue().gapi;return k(t,i,"internal-error"),e.open({where:document.body,url:Th(i),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Ih,dontclear:!0},s=>new Promise(async(r,c)=>{await s.restyle({setHideOnLeave:!1});const h=he(i,"network-request-failed"),p=ue().setTimeout(()=>{c(h)},vh.get());function w(){ue().clearTimeout(p),r(s)}s.ping(w).then(w,()=>{c(h)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sh={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Ah=500,kh=600,Ch="_blank",Ph="http://localhost";class rr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Rh(i,e,t,s=Ah,r=kh){const c=Math.max((window.screen.availHeight-r)/2,0).toString(),h=Math.max((window.screen.availWidth-s)/2,0).toString();let p="";const w={...Sh,width:s.toString(),height:r.toString(),top:c,left:h},E=Y().toLowerCase();t&&(p=Yr(E)?Ch:t),Jr(E)&&(e=e||Ph,w.scrollbars="yes");const S=Object.entries(w).reduce((T,[j,C])=>`${T}${j}=${C},`,"");if(dl(E)&&p!=="_self")return Dh(e||"",p),new rr(null);const A=window.open(e||"",p,S);k(A,i,"popup-blocked");try{A.focus()}catch{}return new rr(A)}function Dh(i,e){const t=document.createElement("a");t.href=i,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nh="__/auth/handler",Oh="emulator/auth/handler",Lh=encodeURIComponent("fac");async function or(i,e,t,s,r,c){k(i.config.authDomain,i,"auth-domain-config-required"),k(i.config.apiKey,i,"invalid-api-key");const h={apiKey:i.config.apiKey,appName:i.name,authType:t,redirectUrl:s,v:ht,eventId:r};if(e instanceof oo){e.setDefaultLanguage(i.languageCode),h.providerId=e.providerId||"",La(e.getCustomParameters())||(h.customParameters=JSON.stringify(e.getCustomParameters()));for(const[S,A]of Object.entries({}))h[S]=A}if(e instanceof Vt){const S=e.getScopes().filter(A=>A!=="");S.length>0&&(h.scopes=S.join(","))}i.tenantId&&(h.tid=i.tenantId);const p=h;for(const S of Object.keys(p))p[S]===void 0&&delete p[S];const w=await i._getAppCheckToken(),E=w?`#${Lh}=${encodeURIComponent(w)}`:"";return`${Mh(i)}?${Ft(p).slice(1)}${E}`}function Mh({config:i}){return i.emulator?Si(i,Oh):`https://${i.authDomain}/${Nh}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oi="webStorageSupport";class xh{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=uo,this._completeRedirectFn=oh,this._overrideRedirectResult=ih}async _openPopup(e,t,s,r){var h;we((h=this.eventManagers[e._key()])==null?void 0:h.manager,"_initialize() not called before _openPopup()");const c=await or(e,t,s,mi(),r);return Rh(e,c,Di())}async _openRedirect(e,t,s,r){await this._originValidation(e);const c=await or(e,t,s,mi(),r);return Fl(c),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:r,promise:c}=this.eventManagers[t];return r?Promise.resolve(r):(we(c,"If manager is not set, promise should be"),c)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await bh(e),s=new ch(e);return t.register("authEvent",r=>(k(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:s.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(oi,{type:oi},r=>{var h;const c=(h=r==null?void 0:r[0])==null?void 0:h[oi];c!==void 0&&t(!!c),_e(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=fh(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return no()||Xr()||Ci()}}const jh=xh;var ar="@firebase/auth",cr="1.11.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uh{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){k(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fh(i){switch(i){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Bh(i){ot(new ze("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),c=e.getProvider("app-check-internal"),{apiKey:h,authDomain:p}=s.options;k(h&&!h.includes(":"),"invalid-api-key",{appName:s.name});const w={apiKey:h,authDomain:p,clientPlatform:i,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:io(i)},E=new vl(s,r,c,w);return bl(E,t),E},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),ot(new ze("auth-internal",e=>{const t=Pi(e.getProvider("auth").getImmediate());return(s=>new Uh(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Oe(ar,cr,Fh(i)),Oe(ar,cr,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vh=5*60,Hh=Nr("authIdTokenMaxAge")||Vh;let lr=null;const $h=i=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>Hh)return;const r=t==null?void 0:t.token;lr!==r&&(lr=r,await fetch(i,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function Gh(i=Ur()){const e=Ti(i,"auth");if(e.isInitialized())return e.getImmediate();const t=Tl(i,{popupRedirectResolver:jh,persistence:[Kl,xl,uo]}),s=Nr("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const c=new URL(s,location.origin);if(location.origin===c.origin){const h=$h(c.toString());Ol(t,h,()=>h(t.currentUser)),Nl(t,p=>h(p))}}const r=Rr("auth");return r&&Sl(t,`http://${r}`),t}function Wh(){var i;return((i=document.getElementsByTagName("head"))==null?void 0:i[0])??document}_l({loadJS(i){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",i),s.onload=e,s.onerror=r=>{const c=he("internal-error");c.customData=r,t(c)},s.type="text/javascript",s.charset="UTF-8",Wh().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Bh("Browser");var hr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Oi;(function(){var i;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(y,u){function f(){}f.prototype=u.prototype,y.D=u.prototype,y.prototype=new f,y.prototype.constructor=y,y.C=function(g,m,_){for(var d=Array(arguments.length-2),de=2;de<arguments.length;de++)d[de-2]=arguments[de];return u.prototype[m].apply(g,d)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,t),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function r(y,u,f){f||(f=0);var g=Array(16);if(typeof u=="string")for(var m=0;16>m;++m)g[m]=u.charCodeAt(f++)|u.charCodeAt(f++)<<8|u.charCodeAt(f++)<<16|u.charCodeAt(f++)<<24;else for(m=0;16>m;++m)g[m]=u[f++]|u[f++]<<8|u[f++]<<16|u[f++]<<24;u=y.g[0],f=y.g[1],m=y.g[2];var _=y.g[3],d=u+(_^f&(m^_))+g[0]+3614090360&4294967295;u=f+(d<<7&4294967295|d>>>25),d=_+(m^u&(f^m))+g[1]+3905402710&4294967295,_=u+(d<<12&4294967295|d>>>20),d=m+(f^_&(u^f))+g[2]+606105819&4294967295,m=_+(d<<17&4294967295|d>>>15),d=f+(u^m&(_^u))+g[3]+3250441966&4294967295,f=m+(d<<22&4294967295|d>>>10),d=u+(_^f&(m^_))+g[4]+4118548399&4294967295,u=f+(d<<7&4294967295|d>>>25),d=_+(m^u&(f^m))+g[5]+1200080426&4294967295,_=u+(d<<12&4294967295|d>>>20),d=m+(f^_&(u^f))+g[6]+2821735955&4294967295,m=_+(d<<17&4294967295|d>>>15),d=f+(u^m&(_^u))+g[7]+4249261313&4294967295,f=m+(d<<22&4294967295|d>>>10),d=u+(_^f&(m^_))+g[8]+1770035416&4294967295,u=f+(d<<7&4294967295|d>>>25),d=_+(m^u&(f^m))+g[9]+2336552879&4294967295,_=u+(d<<12&4294967295|d>>>20),d=m+(f^_&(u^f))+g[10]+4294925233&4294967295,m=_+(d<<17&4294967295|d>>>15),d=f+(u^m&(_^u))+g[11]+2304563134&4294967295,f=m+(d<<22&4294967295|d>>>10),d=u+(_^f&(m^_))+g[12]+1804603682&4294967295,u=f+(d<<7&4294967295|d>>>25),d=_+(m^u&(f^m))+g[13]+4254626195&4294967295,_=u+(d<<12&4294967295|d>>>20),d=m+(f^_&(u^f))+g[14]+2792965006&4294967295,m=_+(d<<17&4294967295|d>>>15),d=f+(u^m&(_^u))+g[15]+1236535329&4294967295,f=m+(d<<22&4294967295|d>>>10),d=u+(m^_&(f^m))+g[1]+4129170786&4294967295,u=f+(d<<5&4294967295|d>>>27),d=_+(f^m&(u^f))+g[6]+3225465664&4294967295,_=u+(d<<9&4294967295|d>>>23),d=m+(u^f&(_^u))+g[11]+643717713&4294967295,m=_+(d<<14&4294967295|d>>>18),d=f+(_^u&(m^_))+g[0]+3921069994&4294967295,f=m+(d<<20&4294967295|d>>>12),d=u+(m^_&(f^m))+g[5]+3593408605&4294967295,u=f+(d<<5&4294967295|d>>>27),d=_+(f^m&(u^f))+g[10]+38016083&4294967295,_=u+(d<<9&4294967295|d>>>23),d=m+(u^f&(_^u))+g[15]+3634488961&4294967295,m=_+(d<<14&4294967295|d>>>18),d=f+(_^u&(m^_))+g[4]+3889429448&4294967295,f=m+(d<<20&4294967295|d>>>12),d=u+(m^_&(f^m))+g[9]+568446438&4294967295,u=f+(d<<5&4294967295|d>>>27),d=_+(f^m&(u^f))+g[14]+3275163606&4294967295,_=u+(d<<9&4294967295|d>>>23),d=m+(u^f&(_^u))+g[3]+4107603335&4294967295,m=_+(d<<14&4294967295|d>>>18),d=f+(_^u&(m^_))+g[8]+1163531501&4294967295,f=m+(d<<20&4294967295|d>>>12),d=u+(m^_&(f^m))+g[13]+2850285829&4294967295,u=f+(d<<5&4294967295|d>>>27),d=_+(f^m&(u^f))+g[2]+4243563512&4294967295,_=u+(d<<9&4294967295|d>>>23),d=m+(u^f&(_^u))+g[7]+1735328473&4294967295,m=_+(d<<14&4294967295|d>>>18),d=f+(_^u&(m^_))+g[12]+2368359562&4294967295,f=m+(d<<20&4294967295|d>>>12),d=u+(f^m^_)+g[5]+4294588738&4294967295,u=f+(d<<4&4294967295|d>>>28),d=_+(u^f^m)+g[8]+2272392833&4294967295,_=u+(d<<11&4294967295|d>>>21),d=m+(_^u^f)+g[11]+1839030562&4294967295,m=_+(d<<16&4294967295|d>>>16),d=f+(m^_^u)+g[14]+4259657740&4294967295,f=m+(d<<23&4294967295|d>>>9),d=u+(f^m^_)+g[1]+2763975236&4294967295,u=f+(d<<4&4294967295|d>>>28),d=_+(u^f^m)+g[4]+1272893353&4294967295,_=u+(d<<11&4294967295|d>>>21),d=m+(_^u^f)+g[7]+4139469664&4294967295,m=_+(d<<16&4294967295|d>>>16),d=f+(m^_^u)+g[10]+3200236656&4294967295,f=m+(d<<23&4294967295|d>>>9),d=u+(f^m^_)+g[13]+681279174&4294967295,u=f+(d<<4&4294967295|d>>>28),d=_+(u^f^m)+g[0]+3936430074&4294967295,_=u+(d<<11&4294967295|d>>>21),d=m+(_^u^f)+g[3]+3572445317&4294967295,m=_+(d<<16&4294967295|d>>>16),d=f+(m^_^u)+g[6]+76029189&4294967295,f=m+(d<<23&4294967295|d>>>9),d=u+(f^m^_)+g[9]+3654602809&4294967295,u=f+(d<<4&4294967295|d>>>28),d=_+(u^f^m)+g[12]+3873151461&4294967295,_=u+(d<<11&4294967295|d>>>21),d=m+(_^u^f)+g[15]+530742520&4294967295,m=_+(d<<16&4294967295|d>>>16),d=f+(m^_^u)+g[2]+3299628645&4294967295,f=m+(d<<23&4294967295|d>>>9),d=u+(m^(f|~_))+g[0]+4096336452&4294967295,u=f+(d<<6&4294967295|d>>>26),d=_+(f^(u|~m))+g[7]+1126891415&4294967295,_=u+(d<<10&4294967295|d>>>22),d=m+(u^(_|~f))+g[14]+2878612391&4294967295,m=_+(d<<15&4294967295|d>>>17),d=f+(_^(m|~u))+g[5]+4237533241&4294967295,f=m+(d<<21&4294967295|d>>>11),d=u+(m^(f|~_))+g[12]+1700485571&4294967295,u=f+(d<<6&4294967295|d>>>26),d=_+(f^(u|~m))+g[3]+2399980690&4294967295,_=u+(d<<10&4294967295|d>>>22),d=m+(u^(_|~f))+g[10]+4293915773&4294967295,m=_+(d<<15&4294967295|d>>>17),d=f+(_^(m|~u))+g[1]+2240044497&4294967295,f=m+(d<<21&4294967295|d>>>11),d=u+(m^(f|~_))+g[8]+1873313359&4294967295,u=f+(d<<6&4294967295|d>>>26),d=_+(f^(u|~m))+g[15]+4264355552&4294967295,_=u+(d<<10&4294967295|d>>>22),d=m+(u^(_|~f))+g[6]+2734768916&4294967295,m=_+(d<<15&4294967295|d>>>17),d=f+(_^(m|~u))+g[13]+1309151649&4294967295,f=m+(d<<21&4294967295|d>>>11),d=u+(m^(f|~_))+g[4]+4149444226&4294967295,u=f+(d<<6&4294967295|d>>>26),d=_+(f^(u|~m))+g[11]+3174756917&4294967295,_=u+(d<<10&4294967295|d>>>22),d=m+(u^(_|~f))+g[2]+718787259&4294967295,m=_+(d<<15&4294967295|d>>>17),d=f+(_^(m|~u))+g[9]+3951481745&4294967295,y.g[0]=y.g[0]+u&4294967295,y.g[1]=y.g[1]+(m+(d<<21&4294967295|d>>>11))&4294967295,y.g[2]=y.g[2]+m&4294967295,y.g[3]=y.g[3]+_&4294967295}s.prototype.u=function(y,u){u===void 0&&(u=y.length);for(var f=u-this.blockSize,g=this.B,m=this.h,_=0;_<u;){if(m==0)for(;_<=f;)r(this,y,_),_+=this.blockSize;if(typeof y=="string"){for(;_<u;)if(g[m++]=y.charCodeAt(_++),m==this.blockSize){r(this,g),m=0;break}}else for(;_<u;)if(g[m++]=y[_++],m==this.blockSize){r(this,g),m=0;break}}this.h=m,this.o+=u},s.prototype.v=function(){var y=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);y[0]=128;for(var u=1;u<y.length-8;++u)y[u]=0;var f=8*this.o;for(u=y.length-8;u<y.length;++u)y[u]=f&255,f/=256;for(this.u(y),y=Array(16),u=f=0;4>u;++u)for(var g=0;32>g;g+=8)y[f++]=this.g[u]>>>g&255;return y};function c(y,u){var f=p;return Object.prototype.hasOwnProperty.call(f,y)?f[y]:f[y]=u(y)}function h(y,u){this.h=u;for(var f=[],g=!0,m=y.length-1;0<=m;m--){var _=y[m]|0;g&&_==u||(f[m]=_,g=!1)}this.g=f}var p={};function w(y){return-128<=y&&128>y?c(y,function(u){return new h([u|0],0>u?-1:0)}):new h([y|0],0>y?-1:0)}function E(y){if(isNaN(y)||!isFinite(y))return A;if(0>y)return M(E(-y));for(var u=[],f=1,g=0;y>=f;g++)u[g]=y/f|0,f*=4294967296;return new h(u,0)}function S(y,u){if(y.length==0)throw Error("number format error: empty string");if(u=u||10,2>u||36<u)throw Error("radix out of range: "+u);if(y.charAt(0)=="-")return M(S(y.substring(1),u));if(0<=y.indexOf("-"))throw Error('number format error: interior "-" character');for(var f=E(Math.pow(u,8)),g=A,m=0;m<y.length;m+=8){var _=Math.min(8,y.length-m),d=parseInt(y.substring(m,m+_),u);8>_?(_=E(Math.pow(u,_)),g=g.j(_).add(E(d))):(g=g.j(f),g=g.add(E(d)))}return g}var A=w(0),T=w(1),j=w(16777216);i=h.prototype,i.m=function(){if(U(this))return-M(this).m();for(var y=0,u=1,f=0;f<this.g.length;f++){var g=this.i(f);y+=(0<=g?g:4294967296+g)*u,u*=4294967296}return y},i.toString=function(y){if(y=y||10,2>y||36<y)throw Error("radix out of range: "+y);if(C(this))return"0";if(U(this))return"-"+M(this).toString(y);for(var u=E(Math.pow(y,6)),f=this,g="";;){var m=se(f,u).g;f=Q(f,m.j(u));var _=((0<f.g.length?f.g[0]:f.h)>>>0).toString(y);if(f=m,C(f))return _+g;for(;6>_.length;)_="0"+_;g=_+g}},i.i=function(y){return 0>y?0:y<this.g.length?this.g[y]:this.h};function C(y){if(y.h!=0)return!1;for(var u=0;u<y.g.length;u++)if(y.g[u]!=0)return!1;return!0}function U(y){return y.h==-1}i.l=function(y){return y=Q(this,y),U(y)?-1:C(y)?0:1};function M(y){for(var u=y.g.length,f=[],g=0;g<u;g++)f[g]=~y.g[g];return new h(f,~y.h).add(T)}i.abs=function(){return U(this)?M(this):this},i.add=function(y){for(var u=Math.max(this.g.length,y.g.length),f=[],g=0,m=0;m<=u;m++){var _=g+(this.i(m)&65535)+(y.i(m)&65535),d=(_>>>16)+(this.i(m)>>>16)+(y.i(m)>>>16);g=d>>>16,_&=65535,d&=65535,f[m]=d<<16|_}return new h(f,f[f.length-1]&-2147483648?-1:0)};function Q(y,u){return y.add(M(u))}i.j=function(y){if(C(this)||C(y))return A;if(U(this))return U(y)?M(this).j(M(y)):M(M(this).j(y));if(U(y))return M(this.j(M(y)));if(0>this.l(j)&&0>y.l(j))return E(this.m()*y.m());for(var u=this.g.length+y.g.length,f=[],g=0;g<2*u;g++)f[g]=0;for(g=0;g<this.g.length;g++)for(var m=0;m<y.g.length;m++){var _=this.i(g)>>>16,d=this.i(g)&65535,de=y.i(m)>>>16,dt=y.i(m)&65535;f[2*g+2*m]+=d*dt,V(f,2*g+2*m),f[2*g+2*m+1]+=_*dt,V(f,2*g+2*m+1),f[2*g+2*m+1]+=d*de,V(f,2*g+2*m+1),f[2*g+2*m+2]+=_*de,V(f,2*g+2*m+2)}for(g=0;g<u;g++)f[g]=f[2*g+1]<<16|f[2*g];for(g=u;g<2*u;g++)f[g]=0;return new h(f,0)};function V(y,u){for(;(y[u]&65535)!=y[u];)y[u+1]+=y[u]>>>16,y[u]&=65535,u++}function $(y,u){this.g=y,this.h=u}function se(y,u){if(C(u))throw Error("division by zero");if(C(y))return new $(A,A);if(U(y))return u=se(M(y),u),new $(M(u.g),M(u.h));if(U(u))return u=se(y,M(u)),new $(M(u.g),u.h);if(30<y.g.length){if(U(y)||U(u))throw Error("slowDivide_ only works with positive integers.");for(var f=T,g=u;0>=g.l(y);)f=Wt(f),g=Wt(g);var m=re(f,1),_=re(g,1);for(g=re(g,2),f=re(f,2);!C(g);){var d=_.add(g);0>=d.l(y)&&(m=m.add(f),_=d),g=re(g,1),f=re(f,1)}return u=Q(y,m.j(u)),new $(m,u)}for(m=A;0<=y.l(u);){for(f=Math.max(1,Math.floor(y.m()/u.m())),g=Math.ceil(Math.log(f)/Math.LN2),g=48>=g?1:Math.pow(2,g-48),_=E(f),d=_.j(u);U(d)||0<d.l(y);)f-=g,_=E(f),d=_.j(u);C(_)&&(_=T),m=m.add(_),y=Q(y,d)}return new $(m,y)}i.A=function(y){return se(this,y).h},i.and=function(y){for(var u=Math.max(this.g.length,y.g.length),f=[],g=0;g<u;g++)f[g]=this.i(g)&y.i(g);return new h(f,this.h&y.h)},i.or=function(y){for(var u=Math.max(this.g.length,y.g.length),f=[],g=0;g<u;g++)f[g]=this.i(g)|y.i(g);return new h(f,this.h|y.h)},i.xor=function(y){for(var u=Math.max(this.g.length,y.g.length),f=[],g=0;g<u;g++)f[g]=this.i(g)^y.i(g);return new h(f,this.h^y.h)};function Wt(y){for(var u=y.g.length+1,f=[],g=0;g<u;g++)f[g]=y.i(g)<<1|y.i(g-1)>>>31;return new h(f,y.h)}function re(y,u){var f=u>>5;u%=32;for(var g=y.g.length-f,m=[],_=0;_<g;_++)m[_]=0<u?y.i(_+f)>>>u|y.i(_+f+1)<<32-u:y.i(_+f);return new h(m,y.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,h.prototype.add=h.prototype.add,h.prototype.multiply=h.prototype.j,h.prototype.modulo=h.prototype.A,h.prototype.compare=h.prototype.l,h.prototype.toNumber=h.prototype.m,h.prototype.toString=h.prototype.toString,h.prototype.getBits=h.prototype.i,h.fromNumber=E,h.fromString=S,Oi=h}).apply(typeof hr<"u"?hr:typeof self<"u"?self:typeof window<"u"?window:{});var hn=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var i,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(n,o,a){return n==Array.prototype||n==Object.prototype||(n[o]=a.value),n};function t(n){n=[typeof globalThis=="object"&&globalThis,n,typeof window=="object"&&window,typeof self=="object"&&self,typeof hn=="object"&&hn];for(var o=0;o<n.length;++o){var a=n[o];if(a&&a.Math==Math)return a}throw Error("Cannot find global object")}var s=t(this);function r(n,o){if(o)e:{var a=s;n=n.split(".");for(var l=0;l<n.length-1;l++){var v=n[l];if(!(v in a))break e;a=a[v]}n=n[n.length-1],l=a[n],o=o(l),o!=l&&o!=null&&e(a,n,{configurable:!0,writable:!0,value:o})}}function c(n,o){n instanceof String&&(n+="");var a=0,l=!1,v={next:function(){if(!l&&a<n.length){var I=a++;return{value:o(I,n[I]),done:!1}}return l=!0,{done:!0,value:void 0}}};return v[Symbol.iterator]=function(){return v},v}r("Array.prototype.values",function(n){return n||function(){return c(this,function(o,a){return a})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var h=h||{},p=this||self;function w(n){var o=typeof n;return o=o!="object"?o:n?Array.isArray(n)?"array":o:"null",o=="array"||o=="object"&&typeof n.length=="number"}function E(n){var o=typeof n;return o=="object"&&n!=null||o=="function"}function S(n,o,a){return n.call.apply(n.bind,arguments)}function A(n,o,a){if(!n)throw Error();if(2<arguments.length){var l=Array.prototype.slice.call(arguments,2);return function(){var v=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(v,l),n.apply(o,v)}}return function(){return n.apply(o,arguments)}}function T(n,o,a){return T=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?S:A,T.apply(null,arguments)}function j(n,o){var a=Array.prototype.slice.call(arguments,1);return function(){var l=a.slice();return l.push.apply(l,arguments),n.apply(this,l)}}function C(n,o){function a(){}a.prototype=o.prototype,n.aa=o.prototype,n.prototype=new a,n.prototype.constructor=n,n.Qb=function(l,v,I){for(var b=Array(arguments.length-2),L=2;L<arguments.length;L++)b[L-2]=arguments[L];return o.prototype[v].apply(l,b)}}function U(n){const o=n.length;if(0<o){const a=Array(o);for(let l=0;l<o;l++)a[l]=n[l];return a}return[]}function M(n,o){for(let a=1;a<arguments.length;a++){const l=arguments[a];if(w(l)){const v=n.length||0,I=l.length||0;n.length=v+I;for(let b=0;b<I;b++)n[v+b]=l[b]}else n.push(l)}}class Q{constructor(o,a){this.i=o,this.j=a,this.h=0,this.g=null}get(){let o;return 0<this.h?(this.h--,o=this.g,this.g=o.next,o.next=null):o=this.i(),o}}function V(n){return/^[\s\xa0]*$/.test(n)}function $(){var n=p.navigator;return n&&(n=n.userAgent)?n:""}function se(n){return se[" "](n),n}se[" "]=function(){};var Wt=$().indexOf("Gecko")!=-1&&!($().toLowerCase().indexOf("webkit")!=-1&&$().indexOf("Edge")==-1)&&!($().indexOf("Trident")!=-1||$().indexOf("MSIE")!=-1)&&$().indexOf("Edge")==-1;function re(n,o,a){for(const l in n)o.call(a,n[l],l,n)}function y(n,o){for(const a in n)o.call(void 0,n[a],a,n)}function u(n){const o={};for(const a in n)o[a]=n[a];return o}const f="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function g(n,o){let a,l;for(let v=1;v<arguments.length;v++){l=arguments[v];for(a in l)n[a]=l[a];for(let I=0;I<f.length;I++)a=f[I],Object.prototype.hasOwnProperty.call(l,a)&&(n[a]=l[a])}}function m(n){var o=1;n=n.split(":");const a=[];for(;0<o&&n.length;)a.push(n.shift()),o--;return n.length&&a.push(n.join(":")),a}function _(n){p.setTimeout(()=>{throw n},0)}function d(){var n=Cn;let o=null;return n.g&&(o=n.g,n.g=n.g.next,n.g||(n.h=null),o.next=null),o}class de{constructor(){this.h=this.g=null}add(o,a){const l=dt.get();l.set(o,a),this.h?this.h.next=l:this.g=l,this.h=l}}var dt=new Q(()=>new Co,n=>n.reset());class Co{constructor(){this.next=this.g=this.h=null}set(o,a){this.h=o,this.g=a,this.next=null}reset(){this.next=this.g=this.h=null}}let ft,pt=!1,Cn=new de,Ui=()=>{const n=p.Promise.resolve(void 0);ft=()=>{n.then(Po)}};var Po=()=>{for(var n;n=d();){try{n.h.call(n.g)}catch(a){_(a)}var o=dt;o.j(n),100>o.h&&(o.h++,n.next=o.g,o.g=n)}pt=!1};function Ee(){this.s=this.s,this.C=this.C}Ee.prototype.s=!1,Ee.prototype.ma=function(){this.s||(this.s=!0,this.N())},Ee.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function G(n,o){this.type=n,this.g=this.target=o,this.defaultPrevented=!1}G.prototype.h=function(){this.defaultPrevented=!0};var Ro=function(){if(!p.addEventListener||!Object.defineProperty)return!1;var n=!1,o=Object.defineProperty({},"passive",{get:function(){n=!0}});try{const a=()=>{};p.addEventListener("test",a,o),p.removeEventListener("test",a,o)}catch{}return n}();function gt(n,o){if(G.call(this,n?n.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,n){var a=this.type=n.type,l=n.changedTouches&&n.changedTouches.length?n.changedTouches[0]:null;if(this.target=n.target||n.srcElement,this.g=o,o=n.relatedTarget){if(Wt){e:{try{se(o.nodeName);var v=!0;break e}catch{}v=!1}v||(o=null)}}else a=="mouseover"?o=n.fromElement:a=="mouseout"&&(o=n.toElement);this.relatedTarget=o,l?(this.clientX=l.clientX!==void 0?l.clientX:l.pageX,this.clientY=l.clientY!==void 0?l.clientY:l.pageY,this.screenX=l.screenX||0,this.screenY=l.screenY||0):(this.clientX=n.clientX!==void 0?n.clientX:n.pageX,this.clientY=n.clientY!==void 0?n.clientY:n.pageY,this.screenX=n.screenX||0,this.screenY=n.screenY||0),this.button=n.button,this.key=n.key||"",this.ctrlKey=n.ctrlKey,this.altKey=n.altKey,this.shiftKey=n.shiftKey,this.metaKey=n.metaKey,this.pointerId=n.pointerId||0,this.pointerType=typeof n.pointerType=="string"?n.pointerType:Do[n.pointerType]||"",this.state=n.state,this.i=n,n.defaultPrevented&&gt.aa.h.call(this)}}C(gt,G);var Do={2:"touch",3:"pen",4:"mouse"};gt.prototype.h=function(){gt.aa.h.call(this);var n=this.i;n.preventDefault?n.preventDefault():n.returnValue=!1};var zt="closure_listenable_"+(1e6*Math.random()|0),No=0;function Oo(n,o,a,l,v){this.listener=n,this.proxy=null,this.src=o,this.type=a,this.capture=!!l,this.ha=v,this.key=++No,this.da=this.fa=!1}function qt(n){n.da=!0,n.listener=null,n.proxy=null,n.src=null,n.ha=null}function Kt(n){this.src=n,this.g={},this.h=0}Kt.prototype.add=function(n,o,a,l,v){var I=n.toString();n=this.g[I],n||(n=this.g[I]=[],this.h++);var b=Rn(n,o,l,v);return-1<b?(o=n[b],a||(o.fa=!1)):(o=new Oo(o,this.src,I,!!l,v),o.fa=a,n.push(o)),o};function Pn(n,o){var a=o.type;if(a in n.g){var l=n.g[a],v=Array.prototype.indexOf.call(l,o,void 0),I;(I=0<=v)&&Array.prototype.splice.call(l,v,1),I&&(qt(o),n.g[a].length==0&&(delete n.g[a],n.h--))}}function Rn(n,o,a,l){for(var v=0;v<n.length;++v){var I=n[v];if(!I.da&&I.listener==o&&I.capture==!!a&&I.ha==l)return v}return-1}var Dn="closure_lm_"+(1e6*Math.random()|0),Nn={};function Fi(n,o,a,l,v){if(Array.isArray(o)){for(var I=0;I<o.length;I++)Fi(n,o[I],a,l,v);return null}return a=Hi(a),n&&n[zt]?n.K(o,a,E(l)?!!l.capture:!1,v):Lo(n,o,a,!1,l,v)}function Lo(n,o,a,l,v,I){if(!o)throw Error("Invalid event type");var b=E(v)?!!v.capture:!!v,L=Ln(n);if(L||(n[Dn]=L=new Kt(n)),a=L.add(o,a,l,b,I),a.proxy)return a;if(l=Mo(),a.proxy=l,l.src=n,l.listener=a,n.addEventListener)Ro||(v=b),v===void 0&&(v=!1),n.addEventListener(o.toString(),l,v);else if(n.attachEvent)n.attachEvent(Vi(o.toString()),l);else if(n.addListener&&n.removeListener)n.addListener(l);else throw Error("addEventListener and attachEvent are unavailable.");return a}function Mo(){function n(a){return o.call(n.src,n.listener,a)}const o=xo;return n}function Bi(n,o,a,l,v){if(Array.isArray(o))for(var I=0;I<o.length;I++)Bi(n,o[I],a,l,v);else l=E(l)?!!l.capture:!!l,a=Hi(a),n&&n[zt]?(n=n.i,o=String(o).toString(),o in n.g&&(I=n.g[o],a=Rn(I,a,l,v),-1<a&&(qt(I[a]),Array.prototype.splice.call(I,a,1),I.length==0&&(delete n.g[o],n.h--)))):n&&(n=Ln(n))&&(o=n.g[o.toString()],n=-1,o&&(n=Rn(o,a,l,v)),(a=-1<n?o[n]:null)&&On(a))}function On(n){if(typeof n!="number"&&n&&!n.da){var o=n.src;if(o&&o[zt])Pn(o.i,n);else{var a=n.type,l=n.proxy;o.removeEventListener?o.removeEventListener(a,l,n.capture):o.detachEvent?o.detachEvent(Vi(a),l):o.addListener&&o.removeListener&&o.removeListener(l),(a=Ln(o))?(Pn(a,n),a.h==0&&(a.src=null,o[Dn]=null)):qt(n)}}}function Vi(n){return n in Nn?Nn[n]:Nn[n]="on"+n}function xo(n,o){if(n.da)n=!0;else{o=new gt(o,this);var a=n.listener,l=n.ha||n.src;n.fa&&On(n),n=a.call(l,o)}return n}function Ln(n){return n=n[Dn],n instanceof Kt?n:null}var Mn="__closure_events_fn_"+(1e9*Math.random()>>>0);function Hi(n){return typeof n=="function"?n:(n[Mn]||(n[Mn]=function(o){return n.handleEvent(o)}),n[Mn])}function W(){Ee.call(this),this.i=new Kt(this),this.M=this,this.F=null}C(W,Ee),W.prototype[zt]=!0,W.prototype.removeEventListener=function(n,o,a,l){Bi(this,n,o,a,l)};function K(n,o){var a,l=n.F;if(l)for(a=[];l;l=l.F)a.push(l);if(n=n.M,l=o.type||o,typeof o=="string")o=new G(o,n);else if(o instanceof G)o.target=o.target||n;else{var v=o;o=new G(l,n),g(o,v)}if(v=!0,a)for(var I=a.length-1;0<=I;I--){var b=o.g=a[I];v=Jt(b,l,!0,o)&&v}if(b=o.g=n,v=Jt(b,l,!0,o)&&v,v=Jt(b,l,!1,o)&&v,a)for(I=0;I<a.length;I++)b=o.g=a[I],v=Jt(b,l,!1,o)&&v}W.prototype.N=function(){if(W.aa.N.call(this),this.i){var n=this.i,o;for(o in n.g){for(var a=n.g[o],l=0;l<a.length;l++)qt(a[l]);delete n.g[o],n.h--}}this.F=null},W.prototype.K=function(n,o,a,l){return this.i.add(String(n),o,!1,a,l)},W.prototype.L=function(n,o,a,l){return this.i.add(String(n),o,!0,a,l)};function Jt(n,o,a,l){if(o=n.i.g[String(o)],!o)return!0;o=o.concat();for(var v=!0,I=0;I<o.length;++I){var b=o[I];if(b&&!b.da&&b.capture==a){var L=b.listener,H=b.ha||b.src;b.fa&&Pn(n.i,b),v=L.call(H,l)!==!1&&v}}return v&&!l.defaultPrevented}function $i(n,o,a){if(typeof n=="function")a&&(n=T(n,a));else if(n&&typeof n.handleEvent=="function")n=T(n.handleEvent,n);else throw Error("Invalid listener argument");return 2147483647<Number(o)?-1:p.setTimeout(n,o||0)}function Gi(n){n.g=$i(()=>{n.g=null,n.i&&(n.i=!1,Gi(n))},n.l);const o=n.h;n.h=null,n.m.apply(null,o)}class jo extends Ee{constructor(o,a){super(),this.m=o,this.l=a,this.h=null,this.i=!1,this.g=null}j(o){this.h=arguments,this.g?this.i=!0:Gi(this)}N(){super.N(),this.g&&(p.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function mt(n){Ee.call(this),this.h=n,this.g={}}C(mt,Ee);var Wi=[];function zi(n){re(n.g,function(o,a){this.g.hasOwnProperty(a)&&On(o)},n),n.g={}}mt.prototype.N=function(){mt.aa.N.call(this),zi(this)},mt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var xn=p.JSON.stringify,Uo=p.JSON.parse,Fo=class{stringify(n){return p.JSON.stringify(n,void 0)}parse(n){return p.JSON.parse(n,void 0)}};function jn(){}jn.prototype.h=null;function qi(n){return n.h||(n.h=n.i())}function Bo(){}var yt={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Un(){G.call(this,"d")}C(Un,G);function Fn(){G.call(this,"c")}C(Fn,G);var Je={},Ki=null;function Bn(){return Ki=Ki||new W}Je.La="serverreachability";function Ji(n){G.call(this,Je.La,n)}C(Ji,G);function vt(n){const o=Bn();K(o,new Ji(o))}Je.STAT_EVENT="statevent";function Xi(n,o){G.call(this,Je.STAT_EVENT,n),this.stat=o}C(Xi,G);function J(n){const o=Bn();K(o,new Xi(o,n))}Je.Ma="timingevent";function Yi(n,o){G.call(this,Je.Ma,n),this.size=o}C(Yi,G);function _t(n,o){if(typeof n!="function")throw Error("Fn must not be null and must be a function");return p.setTimeout(function(){n()},o)}function wt(){this.g=!0}wt.prototype.xa=function(){this.g=!1};function Vo(n,o,a,l,v,I){n.info(function(){if(n.g)if(I)for(var b="",L=I.split("&"),H=0;H<L.length;H++){var N=L[H].split("=");if(1<N.length){var z=N[0];N=N[1];var q=z.split("_");b=2<=q.length&&q[1]=="type"?b+(z+"="+N+"&"):b+(z+"=redacted&")}}else b=null;else b=I;return"XMLHTTP REQ ("+l+") [attempt "+v+"]: "+o+`
`+a+`
`+b})}function Ho(n,o,a,l,v,I,b){n.info(function(){return"XMLHTTP RESP ("+l+") [ attempt "+v+"]: "+o+`
`+a+`
`+I+" "+b})}function Xe(n,o,a,l){n.info(function(){return"XMLHTTP TEXT ("+o+"): "+Go(n,a)+(l?" "+l:"")})}function $o(n,o){n.info(function(){return"TIMEOUT: "+o})}wt.prototype.info=function(){};function Go(n,o){if(!n.g)return o;if(!o)return null;try{var a=JSON.parse(o);if(a){for(n=0;n<a.length;n++)if(Array.isArray(a[n])){var l=a[n];if(!(2>l.length)){var v=l[1];if(Array.isArray(v)&&!(1>v.length)){var I=v[0];if(I!="noop"&&I!="stop"&&I!="close")for(var b=1;b<v.length;b++)v[b]=""}}}}return xn(a)}catch{return o}}var Vn={NO_ERROR:0,TIMEOUT:8},Wo={},Hn;function Xt(){}C(Xt,jn),Xt.prototype.g=function(){return new XMLHttpRequest},Xt.prototype.i=function(){return{}},Hn=new Xt;function Te(n,o,a,l){this.j=n,this.i=o,this.l=a,this.R=l||1,this.U=new mt(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Qi}function Qi(){this.i=null,this.g="",this.h=!1}var Zi={},$n={};function Gn(n,o,a){n.L=1,n.v=en(fe(o)),n.m=a,n.P=!0,es(n,null)}function es(n,o){n.F=Date.now(),Yt(n),n.A=fe(n.v);var a=n.A,l=n.R;Array.isArray(l)||(l=[String(l)]),ps(a.i,"t",l),n.C=0,a=n.j.J,n.h=new Qi,n.g=Ns(n.j,a?o:null,!n.m),0<n.O&&(n.M=new jo(T(n.Y,n,n.g),n.O)),o=n.U,a=n.g,l=n.ca;var v="readystatechange";Array.isArray(v)||(v&&(Wi[0]=v.toString()),v=Wi);for(var I=0;I<v.length;I++){var b=Fi(a,v[I],l||o.handleEvent,!1,o.h||o);if(!b)break;o.g[b.key]=b}o=n.H?u(n.H):{},n.m?(n.u||(n.u="POST"),o["Content-Type"]="application/x-www-form-urlencoded",n.g.ea(n.A,n.u,n.m,o)):(n.u="GET",n.g.ea(n.A,n.u,null,o)),vt(),Vo(n.i,n.u,n.A,n.l,n.R,n.m)}Te.prototype.ca=function(n){n=n.target;const o=this.M;o&&pe(n)==3?o.j():this.Y(n)},Te.prototype.Y=function(n){try{if(n==this.g)e:{const q=pe(this.g);var o=this.g.Ba();const Ze=this.g.Z();if(!(3>q)&&(q!=3||this.g&&(this.h.h||this.g.oa()||Is(this.g)))){this.J||q!=4||o==7||(o==8||0>=Ze?vt(3):vt(2)),Wn(this);var a=this.g.Z();this.X=a;t:if(ts(this)){var l=Is(this.g);n="";var v=l.length,I=pe(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Me(this),It(this);var b="";break t}this.h.i=new p.TextDecoder}for(o=0;o<v;o++)this.h.h=!0,n+=this.h.i.decode(l[o],{stream:!(I&&o==v-1)});l.length=0,this.h.g+=n,this.C=0,b=this.h.g}else b=this.g.oa();if(this.o=a==200,Ho(this.i,this.u,this.A,this.l,this.R,q,a),this.o){if(this.T&&!this.K){t:{if(this.g){var L,H=this.g;if((L=H.g?H.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!V(L)){var N=L;break t}}N=null}if(a=N)Xe(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,zn(this,a);else{this.o=!1,this.s=3,J(12),Me(this),It(this);break e}}if(this.P){a=!0;let ee;for(;!this.J&&this.C<b.length;)if(ee=zo(this,b),ee==$n){q==4&&(this.s=4,J(14),a=!1),Xe(this.i,this.l,null,"[Incomplete Response]");break}else if(ee==Zi){this.s=4,J(15),Xe(this.i,this.l,b,"[Invalid Chunk]"),a=!1;break}else Xe(this.i,this.l,ee,null),zn(this,ee);if(ts(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),q!=4||b.length!=0||this.h.h||(this.s=1,J(16),a=!1),this.o=this.o&&a,!a)Xe(this.i,this.l,b,"[Invalid Chunked Response]"),Me(this),It(this);else if(0<b.length&&!this.W){this.W=!0;var z=this.j;z.g==this&&z.ba&&!z.M&&(z.j.info("Great, no buffering proxy detected. Bytes received: "+b.length),Qn(z),z.M=!0,J(11))}}else Xe(this.i,this.l,b,null),zn(this,b);q==4&&Me(this),this.o&&!this.J&&(q==4?Cs(this.j,this):(this.o=!1,Yt(this)))}else la(this.g),a==400&&0<b.indexOf("Unknown SID")?(this.s=3,J(12)):(this.s=0,J(13)),Me(this),It(this)}}}catch{}finally{}};function ts(n){return n.g?n.u=="GET"&&n.L!=2&&n.j.Ca:!1}function zo(n,o){var a=n.C,l=o.indexOf(`
`,a);return l==-1?$n:(a=Number(o.substring(a,l)),isNaN(a)?Zi:(l+=1,l+a>o.length?$n:(o=o.slice(l,l+a),n.C=l+a,o)))}Te.prototype.cancel=function(){this.J=!0,Me(this)};function Yt(n){n.S=Date.now()+n.I,ns(n,n.I)}function ns(n,o){if(n.B!=null)throw Error("WatchDog timer not null");n.B=_t(T(n.ba,n),o)}function Wn(n){n.B&&(p.clearTimeout(n.B),n.B=null)}Te.prototype.ba=function(){this.B=null;const n=Date.now();0<=n-this.S?($o(this.i,this.A),this.L!=2&&(vt(),J(17)),Me(this),this.s=2,It(this)):ns(this,this.S-n)};function It(n){n.j.G==0||n.J||Cs(n.j,n)}function Me(n){Wn(n);var o=n.M;o&&typeof o.ma=="function"&&o.ma(),n.M=null,zi(n.U),n.g&&(o=n.g,n.g=null,o.abort(),o.ma())}function zn(n,o){try{var a=n.j;if(a.G!=0&&(a.g==n||qn(a.h,n))){if(!n.K&&qn(a.h,n)&&a.G==3){try{var l=a.Da.g.parse(o)}catch{l=null}if(Array.isArray(l)&&l.length==3){var v=l;if(v[0]==0){e:if(!a.u){if(a.g)if(a.g.F+3e3<n.F)an(a),rn(a);else break e;Yn(a),J(18)}}else a.za=v[1],0<a.za-a.T&&37500>v[2]&&a.F&&a.v==0&&!a.C&&(a.C=_t(T(a.Za,a),6e3));if(1>=rs(a.h)&&a.ca){try{a.ca()}catch{}a.ca=void 0}}else je(a,11)}else if((n.K||a.g==n)&&an(a),!V(o))for(v=a.Da.g.parse(o),o=0;o<v.length;o++){let N=v[o];if(a.T=N[0],N=N[1],a.G==2)if(N[0]=="c"){a.K=N[1],a.ia=N[2];const z=N[3];z!=null&&(a.la=z,a.j.info("VER="+a.la));const q=N[4];q!=null&&(a.Aa=q,a.j.info("SVER="+a.Aa));const Ze=N[5];Ze!=null&&typeof Ze=="number"&&0<Ze&&(l=1.5*Ze,a.L=l,a.j.info("backChannelRequestTimeoutMs_="+l)),l=a;const ee=n.g;if(ee){const cn=ee.g?ee.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(cn){var I=l.h;I.g||cn.indexOf("spdy")==-1&&cn.indexOf("quic")==-1&&cn.indexOf("h2")==-1||(I.j=I.l,I.g=new Set,I.h&&(Kn(I,I.h),I.h=null))}if(l.D){const Zn=ee.g?ee.g.getResponseHeader("X-HTTP-Session-Id"):null;Zn&&(l.ya=Zn,x(l.I,l.D,Zn))}}a.G=3,a.l&&a.l.ua(),a.ba&&(a.R=Date.now()-n.F,a.j.info("Handshake RTT: "+a.R+"ms")),l=a;var b=n;if(l.qa=Ds(l,l.J?l.ia:null,l.W),b.K){os(l.h,b);var L=b,H=l.L;H&&(L.I=H),L.B&&(Wn(L),Yt(L)),l.g=b}else As(l);0<a.i.length&&on(a)}else N[0]!="stop"&&N[0]!="close"||je(a,7);else a.G==3&&(N[0]=="stop"||N[0]=="close"?N[0]=="stop"?je(a,7):Xn(a):N[0]!="noop"&&a.l&&a.l.ta(N),a.v=0)}}vt(4)}catch{}}var qo=class{constructor(n,o){this.g=n,this.map=o}};function is(n){this.l=n||10,p.PerformanceNavigationTiming?(n=p.performance.getEntriesByType("navigation"),n=0<n.length&&(n[0].nextHopProtocol=="hq"||n[0].nextHopProtocol=="h2")):n=!!(p.chrome&&p.chrome.loadTimes&&p.chrome.loadTimes()&&p.chrome.loadTimes().wasFetchedViaSpdy),this.j=n?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function ss(n){return n.h?!0:n.g?n.g.size>=n.j:!1}function rs(n){return n.h?1:n.g?n.g.size:0}function qn(n,o){return n.h?n.h==o:n.g?n.g.has(o):!1}function Kn(n,o){n.g?n.g.add(o):n.h=o}function os(n,o){n.h&&n.h==o?n.h=null:n.g&&n.g.has(o)&&n.g.delete(o)}is.prototype.cancel=function(){if(this.i=as(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const n of this.g.values())n.cancel();this.g.clear()}};function as(n){if(n.h!=null)return n.i.concat(n.h.D);if(n.g!=null&&n.g.size!==0){let o=n.i;for(const a of n.g.values())o=o.concat(a.D);return o}return U(n.i)}function Ko(n){if(n.V&&typeof n.V=="function")return n.V();if(typeof Map<"u"&&n instanceof Map||typeof Set<"u"&&n instanceof Set)return Array.from(n.values());if(typeof n=="string")return n.split("");if(w(n)){for(var o=[],a=n.length,l=0;l<a;l++)o.push(n[l]);return o}o=[],a=0;for(l in n)o[a++]=n[l];return o}function Jo(n){if(n.na&&typeof n.na=="function")return n.na();if(!n.V||typeof n.V!="function"){if(typeof Map<"u"&&n instanceof Map)return Array.from(n.keys());if(!(typeof Set<"u"&&n instanceof Set)){if(w(n)||typeof n=="string"){var o=[];n=n.length;for(var a=0;a<n;a++)o.push(a);return o}o=[],a=0;for(const l in n)o[a++]=l;return o}}}function cs(n,o){if(n.forEach&&typeof n.forEach=="function")n.forEach(o,void 0);else if(w(n)||typeof n=="string")Array.prototype.forEach.call(n,o,void 0);else for(var a=Jo(n),l=Ko(n),v=l.length,I=0;I<v;I++)o.call(void 0,l[I],a&&a[I],n)}var ls=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Xo(n,o){if(n){n=n.split("&");for(var a=0;a<n.length;a++){var l=n[a].indexOf("="),v=null;if(0<=l){var I=n[a].substring(0,l);v=n[a].substring(l+1)}else I=n[a];o(I,v?decodeURIComponent(v.replace(/\+/g," ")):"")}}}function xe(n){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,n instanceof xe){this.h=n.h,Qt(this,n.j),this.o=n.o,this.g=n.g,Zt(this,n.s),this.l=n.l;var o=n.i,a=new bt;a.i=o.i,o.g&&(a.g=new Map(o.g),a.h=o.h),hs(this,a),this.m=n.m}else n&&(o=String(n).match(ls))?(this.h=!1,Qt(this,o[1]||"",!0),this.o=Et(o[2]||""),this.g=Et(o[3]||"",!0),Zt(this,o[4]),this.l=Et(o[5]||"",!0),hs(this,o[6]||"",!0),this.m=Et(o[7]||"")):(this.h=!1,this.i=new bt(null,this.h))}xe.prototype.toString=function(){var n=[],o=this.j;o&&n.push(Tt(o,us,!0),":");var a=this.g;return(a||o=="file")&&(n.push("//"),(o=this.o)&&n.push(Tt(o,us,!0),"@"),n.push(encodeURIComponent(String(a)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a=this.s,a!=null&&n.push(":",String(a))),(a=this.l)&&(this.g&&a.charAt(0)!="/"&&n.push("/"),n.push(Tt(a,a.charAt(0)=="/"?Zo:Qo,!0))),(a=this.i.toString())&&n.push("?",a),(a=this.m)&&n.push("#",Tt(a,ta)),n.join("")};function fe(n){return new xe(n)}function Qt(n,o,a){n.j=a?Et(o,!0):o,n.j&&(n.j=n.j.replace(/:$/,""))}function Zt(n,o){if(o){if(o=Number(o),isNaN(o)||0>o)throw Error("Bad port number "+o);n.s=o}else n.s=null}function hs(n,o,a){o instanceof bt?(n.i=o,na(n.i,n.h)):(a||(o=Tt(o,ea)),n.i=new bt(o,n.h))}function x(n,o,a){n.i.set(o,a)}function en(n){return x(n,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),n}function Et(n,o){return n?o?decodeURI(n.replace(/%25/g,"%2525")):decodeURIComponent(n):""}function Tt(n,o,a){return typeof n=="string"?(n=encodeURI(n).replace(o,Yo),a&&(n=n.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),n):null}function Yo(n){return n=n.charCodeAt(0),"%"+(n>>4&15).toString(16)+(n&15).toString(16)}var us=/[#\/\?@]/g,Qo=/[#\?:]/g,Zo=/[#\?]/g,ea=/[#\?@]/g,ta=/#/g;function bt(n,o){this.h=this.g=null,this.i=n||null,this.j=!!o}function be(n){n.g||(n.g=new Map,n.h=0,n.i&&Xo(n.i,function(o,a){n.add(decodeURIComponent(o.replace(/\+/g," ")),a)}))}i=bt.prototype,i.add=function(n,o){be(this),this.i=null,n=Ye(this,n);var a=this.g.get(n);return a||this.g.set(n,a=[]),a.push(o),this.h+=1,this};function ds(n,o){be(n),o=Ye(n,o),n.g.has(o)&&(n.i=null,n.h-=n.g.get(o).length,n.g.delete(o))}function fs(n,o){return be(n),o=Ye(n,o),n.g.has(o)}i.forEach=function(n,o){be(this),this.g.forEach(function(a,l){a.forEach(function(v){n.call(o,v,l,this)},this)},this)},i.na=function(){be(this);const n=Array.from(this.g.values()),o=Array.from(this.g.keys()),a=[];for(let l=0;l<o.length;l++){const v=n[l];for(let I=0;I<v.length;I++)a.push(o[l])}return a},i.V=function(n){be(this);let o=[];if(typeof n=="string")fs(this,n)&&(o=o.concat(this.g.get(Ye(this,n))));else{n=Array.from(this.g.values());for(let a=0;a<n.length;a++)o=o.concat(n[a])}return o},i.set=function(n,o){return be(this),this.i=null,n=Ye(this,n),fs(this,n)&&(this.h-=this.g.get(n).length),this.g.set(n,[o]),this.h+=1,this},i.get=function(n,o){return n?(n=this.V(n),0<n.length?String(n[0]):o):o};function ps(n,o,a){ds(n,o),0<a.length&&(n.i=null,n.g.set(Ye(n,o),U(a)),n.h+=a.length)}i.toString=function(){if(this.i)return this.i;if(!this.g)return"";const n=[],o=Array.from(this.g.keys());for(var a=0;a<o.length;a++){var l=o[a];const I=encodeURIComponent(String(l)),b=this.V(l);for(l=0;l<b.length;l++){var v=I;b[l]!==""&&(v+="="+encodeURIComponent(String(b[l]))),n.push(v)}}return this.i=n.join("&")};function Ye(n,o){return o=String(o),n.j&&(o=o.toLowerCase()),o}function na(n,o){o&&!n.j&&(be(n),n.i=null,n.g.forEach(function(a,l){var v=l.toLowerCase();l!=v&&(ds(this,l),ps(this,v,a))},n)),n.j=o}function ia(n,o){const a=new wt;if(p.Image){const l=new Image;l.onload=j(Se,a,"TestLoadImage: loaded",!0,o,l),l.onerror=j(Se,a,"TestLoadImage: error",!1,o,l),l.onabort=j(Se,a,"TestLoadImage: abort",!1,o,l),l.ontimeout=j(Se,a,"TestLoadImage: timeout",!1,o,l),p.setTimeout(function(){l.ontimeout&&l.ontimeout()},1e4),l.src=n}else o(!1)}function sa(n,o){const a=new wt,l=new AbortController,v=setTimeout(()=>{l.abort(),Se(a,"TestPingServer: timeout",!1,o)},1e4);fetch(n,{signal:l.signal}).then(I=>{clearTimeout(v),I.ok?Se(a,"TestPingServer: ok",!0,o):Se(a,"TestPingServer: server error",!1,o)}).catch(()=>{clearTimeout(v),Se(a,"TestPingServer: error",!1,o)})}function Se(n,o,a,l,v){try{v&&(v.onload=null,v.onerror=null,v.onabort=null,v.ontimeout=null),l(a)}catch{}}function ra(){this.g=new Fo}function oa(n,o,a){const l=a||"";try{cs(n,function(v,I){let b=v;E(v)&&(b=xn(v)),o.push(l+I+"="+encodeURIComponent(b))})}catch(v){throw o.push(l+"type="+encodeURIComponent("_badmap")),v}}function tn(n){this.l=n.Ub||null,this.j=n.eb||!1}C(tn,jn),tn.prototype.g=function(){return new nn(this.l,this.j)},tn.prototype.i=function(n){return function(){return n}}({});function nn(n,o){W.call(this),this.D=n,this.o=o,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}C(nn,W),i=nn.prototype,i.open=function(n,o){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=n,this.A=o,this.readyState=1,At(this)},i.send=function(n){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const o={headers:this.u,method:this.B,credentials:this.m,cache:void 0};n&&(o.body=n),(this.D||p).fetch(new Request(this.A,o)).then(this.Sa.bind(this),this.ga.bind(this))},i.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,St(this)),this.readyState=0},i.Sa=function(n){if(this.g&&(this.l=n,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=n.headers,this.readyState=2,At(this)),this.g&&(this.readyState=3,At(this),this.g)))if(this.responseType==="arraybuffer")n.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof p.ReadableStream<"u"&&"body"in n){if(this.j=n.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;gs(this)}else n.text().then(this.Ra.bind(this),this.ga.bind(this))};function gs(n){n.j.read().then(n.Pa.bind(n)).catch(n.ga.bind(n))}i.Pa=function(n){if(this.g){if(this.o&&n.value)this.response.push(n.value);else if(!this.o){var o=n.value?n.value:new Uint8Array(0);(o=this.v.decode(o,{stream:!n.done}))&&(this.response=this.responseText+=o)}n.done?St(this):At(this),this.readyState==3&&gs(this)}},i.Ra=function(n){this.g&&(this.response=this.responseText=n,St(this))},i.Qa=function(n){this.g&&(this.response=n,St(this))},i.ga=function(){this.g&&St(this)};function St(n){n.readyState=4,n.l=null,n.j=null,n.v=null,At(n)}i.setRequestHeader=function(n,o){this.u.append(n,o)},i.getResponseHeader=function(n){return this.h&&this.h.get(n.toLowerCase())||""},i.getAllResponseHeaders=function(){if(!this.h)return"";const n=[],o=this.h.entries();for(var a=o.next();!a.done;)a=a.value,n.push(a[0]+": "+a[1]),a=o.next();return n.join(`\r
`)};function At(n){n.onreadystatechange&&n.onreadystatechange.call(n)}Object.defineProperty(nn.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(n){this.m=n?"include":"same-origin"}});function ms(n){let o="";return re(n,function(a,l){o+=l,o+=":",o+=a,o+=`\r
`}),o}function Jn(n,o,a){e:{for(l in a){var l=!1;break e}l=!0}l||(a=ms(a),typeof n=="string"?a!=null&&encodeURIComponent(String(a)):x(n,o,a))}function F(n){W.call(this),this.headers=new Map,this.o=n||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}C(F,W);var aa=/^https?$/i,ca=["POST","PUT"];i=F.prototype,i.Ha=function(n){this.J=n},i.ea=function(n,o,a,l){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+n);o=o?o.toUpperCase():"GET",this.D=n,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Hn.g(),this.v=this.o?qi(this.o):qi(Hn),this.g.onreadystatechange=T(this.Ea,this);try{this.B=!0,this.g.open(o,String(n),!0),this.B=!1}catch(I){ys(this,I);return}if(n=a||"",a=new Map(this.headers),l)if(Object.getPrototypeOf(l)===Object.prototype)for(var v in l)a.set(v,l[v]);else if(typeof l.keys=="function"&&typeof l.get=="function")for(const I of l.keys())a.set(I,l.get(I));else throw Error("Unknown input type for opt_headers: "+String(l));l=Array.from(a.keys()).find(I=>I.toLowerCase()=="content-type"),v=p.FormData&&n instanceof p.FormData,!(0<=Array.prototype.indexOf.call(ca,o,void 0))||l||v||a.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[I,b]of a)this.g.setRequestHeader(I,b);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{ws(this),this.u=!0,this.g.send(n),this.u=!1}catch(I){ys(this,I)}};function ys(n,o){n.h=!1,n.g&&(n.j=!0,n.g.abort(),n.j=!1),n.l=o,n.m=5,vs(n),sn(n)}function vs(n){n.A||(n.A=!0,K(n,"complete"),K(n,"error"))}i.abort=function(n){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=n||7,K(this,"complete"),K(this,"abort"),sn(this))},i.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),sn(this,!0)),F.aa.N.call(this)},i.Ea=function(){this.s||(this.B||this.u||this.j?_s(this):this.bb())},i.bb=function(){_s(this)};function _s(n){if(n.h&&typeof h<"u"&&(!n.v[1]||pe(n)!=4||n.Z()!=2)){if(n.u&&pe(n)==4)$i(n.Ea,0,n);else if(K(n,"readystatechange"),pe(n)==4){n.h=!1;try{const b=n.Z();e:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var o=!0;break e;default:o=!1}var a;if(!(a=o)){var l;if(l=b===0){var v=String(n.D).match(ls)[1]||null;!v&&p.self&&p.self.location&&(v=p.self.location.protocol.slice(0,-1)),l=!aa.test(v?v.toLowerCase():"")}a=l}if(a)K(n,"complete"),K(n,"success");else{n.m=6;try{var I=2<pe(n)?n.g.statusText:""}catch{I=""}n.l=I+" ["+n.Z()+"]",vs(n)}}finally{sn(n)}}}}function sn(n,o){if(n.g){ws(n);const a=n.g,l=n.v[0]?()=>{}:null;n.g=null,n.v=null,o||K(n,"ready");try{a.onreadystatechange=l}catch{}}}function ws(n){n.I&&(p.clearTimeout(n.I),n.I=null)}i.isActive=function(){return!!this.g};function pe(n){return n.g?n.g.readyState:0}i.Z=function(){try{return 2<pe(this)?this.g.status:-1}catch{return-1}},i.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},i.Oa=function(n){if(this.g){var o=this.g.responseText;return n&&o.indexOf(n)==0&&(o=o.substring(n.length)),Uo(o)}};function Is(n){try{if(!n.g)return null;if("response"in n.g)return n.g.response;switch(n.H){case"":case"text":return n.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in n.g)return n.g.mozResponseArrayBuffer}return null}catch{return null}}function la(n){const o={};n=(n.g&&2<=pe(n)&&n.g.getAllResponseHeaders()||"").split(`\r
`);for(let l=0;l<n.length;l++){if(V(n[l]))continue;var a=m(n[l]);const v=a[0];if(a=a[1],typeof a!="string")continue;a=a.trim();const I=o[v]||[];o[v]=I,I.push(a)}y(o,function(l){return l.join(", ")})}i.Ba=function(){return this.m},i.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function kt(n,o,a){return a&&a.internalChannelParams&&a.internalChannelParams[n]||o}function Es(n){this.Aa=0,this.i=[],this.j=new wt,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=kt("failFast",!1,n),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=kt("baseRetryDelayMs",5e3,n),this.cb=kt("retryDelaySeedMs",1e4,n),this.Wa=kt("forwardChannelMaxRetries",2,n),this.wa=kt("forwardChannelRequestTimeoutMs",2e4,n),this.pa=n&&n.xmlHttpFactory||void 0,this.Xa=n&&n.Tb||void 0,this.Ca=n&&n.useFetchStreams||!1,this.L=void 0,this.J=n&&n.supportsCrossDomainXhr||!1,this.K="",this.h=new is(n&&n.concurrentRequestLimit),this.Da=new ra,this.P=n&&n.fastHandshake||!1,this.O=n&&n.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=n&&n.Rb||!1,n&&n.xa&&this.j.xa(),n&&n.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&n&&n.detectBufferingProxy||!1,this.ja=void 0,n&&n.longPollingTimeout&&0<n.longPollingTimeout&&(this.ja=n.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}i=Es.prototype,i.la=8,i.G=1,i.connect=function(n,o,a,l){J(0),this.W=n,this.H=o||{},a&&l!==void 0&&(this.H.OSID=a,this.H.OAID=l),this.F=this.X,this.I=Ds(this,null,this.W),on(this)};function Xn(n){if(Ts(n),n.G==3){var o=n.U++,a=fe(n.I);if(x(a,"SID",n.K),x(a,"RID",o),x(a,"TYPE","terminate"),Ct(n,a),o=new Te(n,n.j,o),o.L=2,o.v=en(fe(a)),a=!1,p.navigator&&p.navigator.sendBeacon)try{a=p.navigator.sendBeacon(o.v.toString(),"")}catch{}!a&&p.Image&&(new Image().src=o.v,a=!0),a||(o.g=Ns(o.j,null),o.g.ea(o.v)),o.F=Date.now(),Yt(o)}Rs(n)}function rn(n){n.g&&(Qn(n),n.g.cancel(),n.g=null)}function Ts(n){rn(n),n.u&&(p.clearTimeout(n.u),n.u=null),an(n),n.h.cancel(),n.s&&(typeof n.s=="number"&&p.clearTimeout(n.s),n.s=null)}function on(n){if(!ss(n.h)&&!n.s){n.s=!0;var o=n.Ga;ft||Ui(),pt||(ft(),pt=!0),Cn.add(o,n),n.B=0}}function ha(n,o){return rs(n.h)>=n.h.j-(n.s?1:0)?!1:n.s?(n.i=o.D.concat(n.i),!0):n.G==1||n.G==2||n.B>=(n.Va?0:n.Wa)?!1:(n.s=_t(T(n.Ga,n,o),Ps(n,n.B)),n.B++,!0)}i.Ga=function(n){if(this.s)if(this.s=null,this.G==1){if(!n){this.U=Math.floor(1e5*Math.random()),n=this.U++;const v=new Te(this,this.j,n);let I=this.o;if(this.S&&(I?(I=u(I),g(I,this.S)):I=this.S),this.m!==null||this.O||(v.H=I,I=null),this.P)e:{for(var o=0,a=0;a<this.i.length;a++){t:{var l=this.i[a];if("__data__"in l.map&&(l=l.map.__data__,typeof l=="string")){l=l.length;break t}l=void 0}if(l===void 0)break;if(o+=l,4096<o){o=a;break e}if(o===4096||a===this.i.length-1){o=a+1;break e}}o=1e3}else o=1e3;o=Ss(this,v,o),a=fe(this.I),x(a,"RID",n),x(a,"CVER",22),this.D&&x(a,"X-HTTP-Session-Id",this.D),Ct(this,a),I&&(this.O?o="headers="+encodeURIComponent(String(ms(I)))+"&"+o:this.m&&Jn(a,this.m,I)),Kn(this.h,v),this.Ua&&x(a,"TYPE","init"),this.P?(x(a,"$req",o),x(a,"SID","null"),v.T=!0,Gn(v,a,null)):Gn(v,a,o),this.G=2}}else this.G==3&&(n?bs(this,n):this.i.length==0||ss(this.h)||bs(this))};function bs(n,o){var a;o?a=o.l:a=n.U++;const l=fe(n.I);x(l,"SID",n.K),x(l,"RID",a),x(l,"AID",n.T),Ct(n,l),n.m&&n.o&&Jn(l,n.m,n.o),a=new Te(n,n.j,a,n.B+1),n.m===null&&(a.H=n.o),o&&(n.i=o.D.concat(n.i)),o=Ss(n,a,1e3),a.I=Math.round(.5*n.wa)+Math.round(.5*n.wa*Math.random()),Kn(n.h,a),Gn(a,l,o)}function Ct(n,o){n.H&&re(n.H,function(a,l){x(o,l,a)}),n.l&&cs({},function(a,l){x(o,l,a)})}function Ss(n,o,a){a=Math.min(n.i.length,a);var l=n.l?T(n.l.Na,n.l,n):null;e:{var v=n.i;let I=-1;for(;;){const b=["count="+a];I==-1?0<a?(I=v[0].g,b.push("ofs="+I)):I=0:b.push("ofs="+I);let L=!0;for(let H=0;H<a;H++){let N=v[H].g;const z=v[H].map;if(N-=I,0>N)I=Math.max(0,v[H].g-100),L=!1;else try{oa(z,b,"req"+N+"_")}catch{l&&l(z)}}if(L){l=b.join("&");break e}}}return n=n.i.splice(0,a),o.D=n,l}function As(n){if(!n.g&&!n.u){n.Y=1;var o=n.Fa;ft||Ui(),pt||(ft(),pt=!0),Cn.add(o,n),n.v=0}}function Yn(n){return n.g||n.u||3<=n.v?!1:(n.Y++,n.u=_t(T(n.Fa,n),Ps(n,n.v)),n.v++,!0)}i.Fa=function(){if(this.u=null,ks(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var n=2*this.R;this.j.info("BP detection timer enabled: "+n),this.A=_t(T(this.ab,this),n)}},i.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,J(10),rn(this),ks(this))};function Qn(n){n.A!=null&&(p.clearTimeout(n.A),n.A=null)}function ks(n){n.g=new Te(n,n.j,"rpc",n.Y),n.m===null&&(n.g.H=n.o),n.g.O=0;var o=fe(n.qa);x(o,"RID","rpc"),x(o,"SID",n.K),x(o,"AID",n.T),x(o,"CI",n.F?"0":"1"),!n.F&&n.ja&&x(o,"TO",n.ja),x(o,"TYPE","xmlhttp"),Ct(n,o),n.m&&n.o&&Jn(o,n.m,n.o),n.L&&(n.g.I=n.L);var a=n.g;n=n.ia,a.L=1,a.v=en(fe(o)),a.m=null,a.P=!0,es(a,n)}i.Za=function(){this.C!=null&&(this.C=null,rn(this),Yn(this),J(19))};function an(n){n.C!=null&&(p.clearTimeout(n.C),n.C=null)}function Cs(n,o){var a=null;if(n.g==o){an(n),Qn(n),n.g=null;var l=2}else if(qn(n.h,o))a=o.D,os(n.h,o),l=1;else return;if(n.G!=0){if(o.o)if(l==1){a=o.m?o.m.length:0,o=Date.now()-o.F;var v=n.B;l=Bn(),K(l,new Yi(l,a)),on(n)}else As(n);else if(v=o.s,v==3||v==0&&0<o.X||!(l==1&&ha(n,o)||l==2&&Yn(n)))switch(a&&0<a.length&&(o=n.h,o.i=o.i.concat(a)),v){case 1:je(n,5);break;case 4:je(n,10);break;case 3:je(n,6);break;default:je(n,2)}}}function Ps(n,o){let a=n.Ta+Math.floor(Math.random()*n.cb);return n.isActive()||(a*=2),a*o}function je(n,o){if(n.j.info("Error code "+o),o==2){var a=T(n.fb,n),l=n.Xa;const v=!l;l=new xe(l||"//www.google.com/images/cleardot.gif"),p.location&&p.location.protocol=="http"||Qt(l,"https"),en(l),v?ia(l.toString(),a):sa(l.toString(),a)}else J(2);n.G=0,n.l&&n.l.sa(o),Rs(n),Ts(n)}i.fb=function(n){n?(this.j.info("Successfully pinged google.com"),J(2)):(this.j.info("Failed to ping google.com"),J(1))};function Rs(n){if(n.G=0,n.ka=[],n.l){const o=as(n.h);(o.length!=0||n.i.length!=0)&&(M(n.ka,o),M(n.ka,n.i),n.h.i.length=0,U(n.i),n.i.length=0),n.l.ra()}}function Ds(n,o,a){var l=a instanceof xe?fe(a):new xe(a);if(l.g!="")o&&(l.g=o+"."+l.g),Zt(l,l.s);else{var v=p.location;l=v.protocol,o=o?o+"."+v.hostname:v.hostname,v=+v.port;var I=new xe(null);l&&Qt(I,l),o&&(I.g=o),v&&Zt(I,v),a&&(I.l=a),l=I}return a=n.D,o=n.ya,a&&o&&x(l,a,o),x(l,"VER",n.la),Ct(n,l),l}function Ns(n,o,a){if(o&&!n.J)throw Error("Can't create secondary domain capable XhrIo object.");return o=n.Ca&&!n.pa?new F(new tn({eb:a})):new F(n.pa),o.Ha(n.J),o}i.isActive=function(){return!!this.l&&this.l.isActive(this)};function Os(){}i=Os.prototype,i.ua=function(){},i.ta=function(){},i.sa=function(){},i.ra=function(){},i.isActive=function(){return!0},i.Na=function(){};function Z(n,o){W.call(this),this.g=new Es(o),this.l=n,this.h=o&&o.messageUrlParams||null,n=o&&o.messageHeaders||null,o&&o.clientProtocolHeaderRequired&&(n?n["X-Client-Protocol"]="webchannel":n={"X-Client-Protocol":"webchannel"}),this.g.o=n,n=o&&o.initMessageHeaders||null,o&&o.messageContentType&&(n?n["X-WebChannel-Content-Type"]=o.messageContentType:n={"X-WebChannel-Content-Type":o.messageContentType}),o&&o.va&&(n?n["X-WebChannel-Client-Profile"]=o.va:n={"X-WebChannel-Client-Profile":o.va}),this.g.S=n,(n=o&&o.Sb)&&!V(n)&&(this.g.m=n),this.v=o&&o.supportsCrossDomainXhr||!1,this.u=o&&o.sendRawJson||!1,(o=o&&o.httpSessionIdParam)&&!V(o)&&(this.g.D=o,n=this.h,n!==null&&o in n&&(n=this.h,o in n&&delete n[o])),this.j=new Qe(this)}C(Z,W),Z.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Z.prototype.close=function(){Xn(this.g)},Z.prototype.o=function(n){var o=this.g;if(typeof n=="string"){var a={};a.__data__=n,n=a}else this.u&&(a={},a.__data__=xn(n),n=a);o.i.push(new qo(o.Ya++,n)),o.G==3&&on(o)},Z.prototype.N=function(){this.g.l=null,delete this.j,Xn(this.g),delete this.g,Z.aa.N.call(this)};function Ls(n){Un.call(this),n.__headers__&&(this.headers=n.__headers__,this.statusCode=n.__status__,delete n.__headers__,delete n.__status__);var o=n.__sm__;if(o){e:{for(const a in o){n=a;break e}n=void 0}(this.i=n)&&(n=this.i,o=o!==null&&n in o?o[n]:void 0),this.data=o}else this.data=n}C(Ls,Un);function Ms(){Fn.call(this),this.status=1}C(Ms,Fn);function Qe(n){this.g=n}C(Qe,Os),Qe.prototype.ua=function(){K(this.g,"a")},Qe.prototype.ta=function(n){K(this.g,new Ls(n))},Qe.prototype.sa=function(n){K(this.g,new Ms)},Qe.prototype.ra=function(){K(this.g,"b")},Z.prototype.send=Z.prototype.o,Z.prototype.open=Z.prototype.m,Z.prototype.close=Z.prototype.close,Vn.NO_ERROR=0,Vn.TIMEOUT=8,Vn.HTTP_ERROR=6,Wo.COMPLETE="complete",Bo.EventType=yt,yt.OPEN="a",yt.CLOSE="b",yt.ERROR="c",yt.MESSAGE="d",W.prototype.listen=W.prototype.K,F.prototype.listenOnce=F.prototype.L,F.prototype.getLastError=F.prototype.Ka,F.prototype.getLastErrorCode=F.prototype.Ba,F.prototype.getStatus=F.prototype.Z,F.prototype.getResponseJson=F.prototype.Oa,F.prototype.getResponseText=F.prototype.oa,F.prototype.send=F.prototype.ea,F.prototype.setWithCredentials=F.prototype.Ha}).apply(typeof hn<"u"?hn:typeof self<"u"?self:typeof window<"u"?window:{});const ur="@firebase/firestore",dr="4.9.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}X.UNAUTHENTICATED=new X(null),X.GOOGLE_CREDENTIALS=new X("google-credentials-uid"),X.FIRST_PARTY=new X("first-party-uid"),X.MOCK_USER=new X("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let $t="12.0.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ct=new Ii("@firebase/firestore");function ie(i,...e){if(ct.logLevel<=O.DEBUG){const t=e.map(Li);ct.debug(`Firestore (${$t}): ${i}`,...t)}}function _o(i,...e){if(ct.logLevel<=O.ERROR){const t=e.map(Li);ct.error(`Firestore (${$t}): ${i}`,...t)}}function zh(i,...e){if(ct.logLevel<=O.WARN){const t=e.map(Li);ct.warn(`Firestore (${$t}): ${i}`,...t)}}function Li(i){if(typeof i=="string")return i;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(t){return JSON.stringify(t)}(i)}catch{return i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xt(i,e,t){let s="Unexpected state";typeof e=="string"?s=e:t=e,wo(i,s,t)}function wo(i,e,t){let s=`FIRESTORE (${$t}) INTERNAL ASSERTION FAILED: ${e} (ID: ${i.toString(16)})`;if(t!==void 0)try{s+=" CONTEXT: "+JSON.stringify(t)}catch{s+=" CONTEXT: "+t}throw _o(s),new Error(s)}function Dt(i,e,t,s){let r="Unexpected state";typeof t=="string"?r=t:s=t,i||wo(e,r,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const R={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition"};class D extends Ie{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nt{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Io{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class qh{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(X.UNAUTHENTICATED))}shutdown(){}}class Kh{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class Jh{constructor(e){this.t=e,this.currentUser=X.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Dt(this.o===void 0,42304);let s=this.i;const r=w=>this.i!==s?(s=this.i,t(w)):Promise.resolve();let c=new Nt;this.o=()=>{this.i++,this.currentUser=this.u(),c.resolve(),c=new Nt,e.enqueueRetryable(()=>r(this.currentUser))};const h=()=>{const w=c;e.enqueueRetryable(async()=>{await w.promise,await r(this.currentUser)})},p=w=>{ie("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=w,this.o&&(this.auth.addAuthTokenListener(this.o),h())};this.t.onInit(w=>p(w)),setTimeout(()=>{if(!this.auth){const w=this.t.getImmediate({optional:!0});w?p(w):(ie("FirebaseAuthCredentialsProvider","Auth not yet detected"),c.resolve(),c=new Nt)}},0),h()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(s=>this.i!==e?(ie("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(Dt(typeof s.accessToken=="string",31837,{l:s}),new Io(s.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Dt(e===null||typeof e=="string",2055,{h:e}),new X(e)}}class Xh{constructor(e,t,s){this.P=e,this.T=t,this.I=s,this.type="FirstParty",this.user=X.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class Yh{constructor(e,t,s){this.P=e,this.T=t,this.I=s}getToken(){return Promise.resolve(new Xh(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(X.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class fr{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Qh{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,ce(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Dt(this.o===void 0,3512);const s=c=>{c.error!=null&&ie("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${c.error.message}`);const h=c.token!==this.m;return this.m=c.token,ie("FirebaseAppCheckTokenProvider",`Received ${h?"new":"existing"} token.`),h?t(c.token):Promise.resolve()};this.o=c=>{e.enqueueRetryable(()=>s(c))};const r=c=>{ie("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=c,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(c=>r(c)),setTimeout(()=>{if(!this.appCheck){const c=this.V.getImmediate({optional:!0});c?r(c):ie("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new fr(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(Dt(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new fr(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zh(i){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(i);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<i;s++)t[s]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eu{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let s="";for(;s.length<20;){const r=Zh(40);for(let c=0;c<r.length;++c)s.length<20&&r[c]<t&&(s+=e.charAt(r[c]%62))}return s}}function Le(i,e){return i<e?-1:i>e?1:0}function tu(i,e){const t=Math.min(i.length,e.length);for(let s=0;s<t;s++){const r=i.charAt(s),c=e.charAt(s);if(r!==c)return ai(r)===ai(c)?Le(r,c):ai(r)?1:-1}return Le(i.length,e.length)}const nu=55296,iu=57343;function ai(i){const e=i.charCodeAt(0);return e>=nu&&e<=iu}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pr="__name__";class oe{constructor(e,t,s){t===void 0?t=0:t>e.length&&xt(637,{offset:t,range:e.length}),s===void 0?s=e.length-t:s>e.length-t&&xt(1746,{length:s,range:e.length-t}),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return oe.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof oe?e.forEach(s=>{t.push(s)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let r=0;r<s;r++){const c=oe.compareSegments(e.get(r),t.get(r));if(c!==0)return c}return Le(e.length,t.length)}static compareSegments(e,t){const s=oe.isNumericId(e),r=oe.isNumericId(t);return s&&!r?-1:!s&&r?1:s&&r?oe.extractNumericId(e).compare(oe.extractNumericId(t)):tu(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Oi.fromString(e.substring(4,e.length-2))}}class te extends oe{construct(e,t,s){return new te(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new D(R.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter(r=>r.length>0))}return new te(t)}static emptyPath(){return new te([])}}const su=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Be extends oe{construct(e,t,s){return new Be(e,t,s)}static isValidIdentifier(e){return su.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Be.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===pr}static keyField(){return new Be([pr])}static fromServerFormat(e){const t=[];let s="",r=0;const c=()=>{if(s.length===0)throw new D(R.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let h=!1;for(;r<e.length;){const p=e[r];if(p==="\\"){if(r+1===e.length)throw new D(R.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const w=e[r+1];if(w!=="\\"&&w!=="."&&w!=="`")throw new D(R.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=w,r+=2}else p==="`"?(h=!h,r++):p!=="."||h?(s+=p,r++):(c(),r++)}if(c(),h)throw new D(R.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Be(t)}static emptyPath(){return new Be([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ve{constructor(e){this.path=e}static fromPath(e){return new Ve(te.fromString(e))}static fromName(e){return new Ve(te.fromString(e).popFirst(5))}static empty(){return new Ve(te.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&te.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return te.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new Ve(new te(e.slice()))}}function ru(i,e,t,s){if(e===!0&&s===!0)throw new D(R.INVALID_ARGUMENT,`${i} and ${t} cannot be used together.`)}function ou(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}function au(i){if(i===void 0)return"undefined";if(i===null)return"null";if(typeof i=="string")return i.length>20&&(i=`${i.substring(0,20)}...`),JSON.stringify(i);if(typeof i=="number"||typeof i=="boolean")return""+i;if(typeof i=="object"){if(i instanceof Array)return"an array";{const e=function(s){return s.constructor?s.constructor.name:null}(i);return e?`a custom ${e} object`:"an object"}}return typeof i=="function"?"a function":xt(12329,{type:typeof i})}function cu(i,e){if("_delegate"in i&&(i=i._delegate),!(i instanceof e)){if(e.name===i.constructor.name)throw new D(R.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=au(i);throw new D(R.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return i}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function B(i,e){const t={typeString:i};return e&&(t.value=e),t}function Gt(i,e){if(!ou(i))throw new D(R.INVALID_ARGUMENT,"JSON must be an object");let t;for(const s in e)if(e[s]){const r=e[s].typeString,c="value"in e[s]?{value:e[s].value}:void 0;if(!(s in i)){t=`JSON missing required field: '${s}'`;break}const h=i[s];if(r&&typeof h!==r){t=`JSON field '${s}' must be a ${r}.`;break}if(c!==void 0&&h!==c.value){t=`Expected '${s}' field to equal '${c.value}'`;break}}if(t)throw new D(R.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gr=-62135596800,mr=1e6;class ae{static now(){return ae.fromMillis(Date.now())}static fromDate(e){return ae.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor((e-1e3*t)*mr);return new ae(t,s)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new D(R.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new D(R.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<gr)throw new D(R.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new D(R.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/mr}_compareTo(e){return this.seconds===e.seconds?Le(this.nanoseconds,e.nanoseconds):Le(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:ae._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Gt(e,ae._jsonSchema))return new ae(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-gr;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}ae._jsonSchemaVersion="firestore/timestamp/1.0",ae._jsonSchema={type:B("string",ae._jsonSchemaVersion),seconds:B("number"),nanoseconds:B("number")};function lu(i){return i.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hu extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ke{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(r){try{return atob(r)}catch(c){throw typeof DOMException<"u"&&c instanceof DOMException?new hu("Invalid base64 string: "+c):c}}(e);return new Ke(t)}static fromUint8Array(e){const t=function(r){let c="";for(let h=0;h<r.length;++h)c+=String.fromCharCode(r[h]);return c}(e);return new Ke(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const s=new Uint8Array(t.length);for(let r=0;r<t.length;r++)s[r]=t.charCodeAt(r);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Le(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ke.EMPTY_BYTE_STRING=new Ke("");const _i="(default)";class Sn{constructor(e,t){this.projectId=e,this.database=t||_i}static empty(){return new Sn("","")}get isDefaultDatabase(){return this.database===_i}isEqual(e){return e instanceof Sn&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uu{constructor(e,t=null,s=[],r=[],c=null,h="F",p=null,w=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=r,this.limit=c,this.limitType=h,this.startAt=p,this.endAt=w,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function du(i){return new uu(i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var yr,P;(P=yr||(yr={}))[P.OK=0]="OK",P[P.CANCELLED=1]="CANCELLED",P[P.UNKNOWN=2]="UNKNOWN",P[P.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",P[P.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",P[P.NOT_FOUND=5]="NOT_FOUND",P[P.ALREADY_EXISTS=6]="ALREADY_EXISTS",P[P.PERMISSION_DENIED=7]="PERMISSION_DENIED",P[P.UNAUTHENTICATED=16]="UNAUTHENTICATED",P[P.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",P[P.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",P[P.ABORTED=10]="ABORTED",P[P.OUT_OF_RANGE=11]="OUT_OF_RANGE",P[P.UNIMPLEMENTED=12]="UNIMPLEMENTED",P[P.INTERNAL=13]="INTERNAL",P[P.UNAVAILABLE=14]="UNAVAILABLE",P[P.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new Oi([4294967295,4294967295],0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fu=41943040;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pu=1048576;function ci(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gu{constructor(e,t,s=1e3,r=1.5,c=6e4){this.Mi=e,this.timerId=t,this.d_=s,this.A_=r,this.R_=c,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(e){this.cancel();const t=Math.floor(this.V_+this.y_()),s=Math.max(0,Date.now()-this.f_),r=Math.max(0,t-s);r>0&&ie("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,r,()=>(this.f_=Date.now(),e())),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mi{constructor(e,t,s,r,c){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=r,this.removalCallback=c,this.deferred=new Nt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(h=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,r,c){const h=Date.now()+s,p=new Mi(e,t,h,r,c);return p.start(s),p}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new D(R.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var vr,_r;(_r=vr||(vr={})).Ma="default",_r.Cache="cache";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mu(i){const e={};return i.timeoutSeconds!==void 0&&(e.timeoutSeconds=i.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wr=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Eo="firestore.googleapis.com",Ir=!0;class Er{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new D(R.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Eo,this.ssl=Ir}else this.host=e.host,this.ssl=e.ssl??Ir;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=fu;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<pu)throw new D(R.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}ru("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=mu(e.experimentalLongPollingOptions??{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new D(R.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new D(R.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new D(R.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(s,r){return s.timeoutSeconds===r.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class To{constructor(e,t,s,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Er({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new D(R.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new D(R.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Er(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new qh;switch(s.type){case"firstParty":return new Yh(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new D(R.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const s=wr.get(t);s&&(ie("ComponentProvider","Removing Datastore"),wr.delete(t),s.terminate())}(this),Promise.resolve()}}function yu(i,e,t,s={}){var E;i=cu(i,To);const r=jt(e),c=i._getSettings(),h={...c,emulatorOptions:i._getEmulatorOptions()},p=`${e}:${t}`;r&&(Or(`https://${p}`),Lr("Firestore",!0)),c.host!==Eo&&c.host!==p&&zh("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const w={...c,host:p,ssl:r,emulatorOptions:s};if(!We(w,h)&&(i._setSettings(w),s.mockUserToken)){let S,A;if(typeof s.mockUserToken=="string")S=s.mockUserToken,A=X.MOCK_USER;else{S=Ia(s.mockUserToken,(E=i._app)==null?void 0:E.options.projectId);const T=s.mockUserToken.sub||s.mockUserToken.user_id;if(!T)throw new D(R.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");A=new X(T)}i._authCredentials=new Kh(new Io(S,A))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xi{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new xi(this.firestore,e,this._query)}}class le{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ji(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new le(this.firestore,e,this._key)}toJSON(){return{type:le._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,s){if(Gt(t,le._jsonSchema))return new le(e,s||null,new Ve(te.fromString(t.referencePath)))}}le._jsonSchemaVersion="firestore/documentReference/1.0",le._jsonSchema={type:B("string",le._jsonSchemaVersion),referencePath:B("string")};class ji extends xi{constructor(e,t,s){super(e,t,du(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new le(this.firestore,null,new Ve(e))}withConverter(e){return new ji(this.firestore,e,this._path)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tr="AsyncQueue";class br{constructor(e=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new gu(this,"async_queue_retry"),this._c=()=>{const s=ci();s&&ie(Tr,"Visibility state changed to "+s.visibilityState),this.M_.w_()},this.ac=e;const t=ci();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=ci();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise(()=>{});const t=new Nt;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Xu.push(e),this.lc()))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(e){if(!lu(e))throw e;ie(Tr,"Operation failed with retryable error: "+e)}this.Xu.length>0&&this.M_.p_(()=>this.lc())}}cc(e){const t=this.ac.then(()=>(this.rc=!0,e().catch(s=>{throw this.nc=s,this.rc=!1,_o("INTERNAL UNHANDLED ERROR: ",Sr(s)),s}).then(s=>(this.rc=!1,s))));return this.ac=t,t}enqueueAfterDelay(e,t,s){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const r=Mi.createAndSchedule(this,e,t,s,c=>this.hc(c));return this.tc.push(r),r}uc(){this.nc&&xt(47125,{Pc:Sr(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ic(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then(()=>{this.tc.sort((t,s)=>t.targetTimeMs-s.targetTimeMs);for(const t of this.tc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Tc()})}dc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function Sr(i){let e=i.message||"";return i.stack&&(e=i.stack.includes(i.message)?i.stack:i.message+`
`+i.stack),e}class vu extends To{constructor(e,t,s,r){super(e,t,s,r),this.type="firestore",this._queue=new br,this._persistenceKey=(r==null?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new br(e),this._firestoreClient=void 0,await e}}}function _u(i,e){const t=typeof i=="object"?i:Ur(),s=typeof i=="string"?i:_i,r=Ti(t,"firestore").getImmediate({identifier:s});if(!r._initialized){const c=_a("firestore");c&&yu(r,...c)}return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ge{constructor(e){this._byteString=e}static fromBase64String(e){try{return new ge(Ke.fromBase64String(e))}catch(t){throw new D(R.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new ge(Ke.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:ge._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Gt(e,ge._jsonSchema))return ge.fromBase64String(e.bytes)}}ge._jsonSchemaVersion="firestore/bytes/1.0",ge._jsonSchema={type:B("string",ge._jsonSchemaVersion),bytes:B("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bo{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new D(R.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Be(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $e{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new D(R.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new D(R.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return Le(this._lat,e._lat)||Le(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:$e._jsonSchemaVersion}}static fromJSON(e){if(Gt(e,$e._jsonSchema))return new $e(e.latitude,e.longitude)}}$e._jsonSchemaVersion="firestore/geoPoint/1.0",$e._jsonSchema={type:B("string",$e._jsonSchemaVersion),latitude:B("number"),longitude:B("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ge{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(s,r){if(s.length!==r.length)return!1;for(let c=0;c<s.length;++c)if(s[c]!==r[c])return!1;return!0}(this._values,e._values)}toJSON(){return{type:Ge._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Gt(e,Ge._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(t=>typeof t=="number"))return new Ge(e.vectorValues);throw new D(R.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Ge._jsonSchemaVersion="firestore/vectorValue/1.0",Ge._jsonSchema={type:B("string",Ge._jsonSchemaVersion),vectorValues:B("object")};const wu=new RegExp("[~\\*/\\[\\]]");function Iu(i,e,t){if(e.search(wu)>=0)throw Ar(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,i);try{return new bo(...e.split("."))._internalPath}catch{throw Ar(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,i)}}function Ar(i,e,t,s,r){let c=`Function ${e}() called with invalid data`;c+=". ";let h="";return new D(R.INVALID_ARGUMENT,c+i+h)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class So{constructor(e,t,s,r,c){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=r,this._converter=c}get id(){return this._key.path.lastSegment()}get ref(){return new le(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Eu(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Ao("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class Eu extends So{data(){return super.data()}}function Ao(i,e){return typeof e=="string"?Iu(i,e):e instanceof bo?e._internalPath:e._delegate._internalPath}class un{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class rt extends So{constructor(e,t,s,r,c,h){super(e,t,s,r,h),this._firestore=e,this._firestoreImpl=e,this.metadata=c}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new mn(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(Ao("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new D(R.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=rt._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}rt._jsonSchemaVersion="firestore/documentSnapshot/1.0",rt._jsonSchema={type:B("string",rt._jsonSchemaVersion),bundleSource:B("string","DocumentSnapshot"),bundleName:B("string"),bundle:B("string")};class mn extends rt{data(e={}){return super.data(e)}}class Ot{constructor(e,t,s,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new un(r.hasPendingWrites,r.fromCache),this.query=s}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(s=>{e.call(t,new mn(this._firestore,this._userDataWriter,s.key,s,new un(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new D(R.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(r,c){if(r._snapshot.oldDocs.isEmpty()){let h=0;return r._snapshot.docChanges.map(p=>{const w=new mn(r._firestore,r._userDataWriter,p.doc.key,p.doc,new un(r._snapshot.mutatedKeys.has(p.doc.key),r._snapshot.fromCache),r.query.converter);return p.doc,{type:"added",doc:w,oldIndex:-1,newIndex:h++}})}{let h=r._snapshot.oldDocs;return r._snapshot.docChanges.filter(p=>c||p.type!==3).map(p=>{const w=new mn(r._firestore,r._userDataWriter,p.doc.key,p.doc,new un(r._snapshot.mutatedKeys.has(p.doc.key),r._snapshot.fromCache),r.query.converter);let E=-1,S=-1;return p.type!==0&&(E=h.indexOf(p.doc.key),h=h.delete(p.doc.key)),p.type!==1&&(h=h.add(p.doc),S=h.indexOf(p.doc.key)),{type:Tu(p.type),doc:w,oldIndex:E,newIndex:S}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new D(R.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Ot._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=eu.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],s=[],r=[];return this.docs.forEach(c=>{c._document!==null&&(t.push(c._document),s.push(this._userDataWriter.convertObjectMap(c._document.data.value.mapValue.fields,"previous")),r.push(c.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function Tu(i){switch(i){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return xt(61501,{type:i})}}Ot._jsonSchemaVersion="firestore/querySnapshot/1.0",Ot._jsonSchema={type:B("string",Ot._jsonSchemaVersion),bundleSource:B("string","QuerySnapshot"),bundleName:B("string"),bundle:B("string")};(function(e,t=!0){(function(r){$t=r})(ht),ot(new ze("firestore",(s,{instanceIdentifier:r,options:c})=>{const h=s.getProvider("app").getImmediate(),p=new vu(new Jh(s.getProvider("auth-internal")),new Qh(h,s.getProvider("app-check-internal")),function(E,S){if(!Object.prototype.hasOwnProperty.apply(E.options,["projectId"]))throw new D(R.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Sn(E.options.projectId,S)}(h,r),h);return c={useFetchStreams:t,...c},p._setSettings(c),p},"PUBLIC").setMultipleInstances(!0)),Oe(ur,dr,e),Oe(ur,dr,"esm2020")})();console.log("--- LOADING firebase/init.ts MODULE ---");let et=null,li=null,hi=null;const ko=async()=>{if(et)return{firebaseApp:et,auth:li,db:hi};try{console.log("--- 1. ENTERING initializeFirebase function ---"),console.log("🔧 Fetching Firebase configuration from server...");const i=await fetch("/.netlify/functions/get-firebase-config");if(!i.ok)throw new Error(`Server responded with an error: ${i.statusText}`);const e=await i.json();if(!e||!e.apiKey)throw console.error("❌ Invalid Firebase config received from server",e),new Error("Invalid Firebase config received from server");return console.log("✅ Firebase config retrieved successfully!"),et=jr(e),li=Gh(et),hi=_u(et),console.log("🎉 Firebase initialization complete!"),{firebaseApp:et,auth:li,db:hi}}catch(i){throw console.error("❌ CRITICAL: Firebase initialization failed:",i),i}},Ue="http://localhost:3001",bu=i=>{let e=i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");e=e.replace(/```([\s\S]+?)```/g,"<pre><code>$1</code></pre>"),e=e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>");const t=e.split(`
`);let s=!1;const r=t.map(c=>{if(c.match(/^\s*[\*-]\s/)){let h=`<li>${c.replace(/^\s*[\*-]\s/,"")}</li>`;return s||(h="<ul>"+h,s=!0),h}else return s?(s=!1,`</ul><p>${c}</p>`):c.trim()?`<p>${c}</p>`:""});return s&&r.push("</ul>"),r.join("")},Su=async i=>{const e=await new Promise((t,s)=>{const r=new FileReader;r.onloadend=()=>t(r.result.split(",")[1]),r.onerror=s,r.readAsDataURL(i)});return{mimeType:i.type,data:e}};class Au{constructor(){this.chatHistory=[],this.isAiReady=!1,this.placeholderInterval=null,this.recognition=null,this.isListening=!1,this.placeholderTexts=["Skapa en KMA-plan för Villa Nygren...","Vad säger ABT 06 om vite?","Ge mig en checklista för tätskikt i badrum...","Sammanställ alla foton från projektet Altanbygge."],this.pageContentElement=document.getElementById("dashboard-container"),this.genericModal=document.getElementById("generic-modal"),this.chatDrawer=document.getElementById("chat-drawer"),this.chatMessages=document.getElementById("chat-messages"),this.chatInput=document.getElementById("chat-input"),this.sendButton=document.getElementById("send-button"),this.sendIcon=document.getElementById("send-icon"),this.loadingIndicator=document.getElementById("loading-indicator"),this.voiceInputButton=document.getElementById("voice-input-button"),this.fileInputHidden=document.getElementById("file-input-hidden"),this.attachedFilesPreview=document.getElementById("attached-files-preview"),this.greetingElement=document.querySelector(".greeting"),this.subGreetingElement=document.querySelector(".sub-greeting"),this.userNameElement=document.getElementById("user-name"),this.userAvatarElement=document.getElementById("user-avatar"),this.loadState(),this.init().catch(console.error)}async init(){try{console.log("🔥 Initializing Firebase..."),await ko(),console.log("✅ Firebase initialization complete!")}catch(e){console.error("❌ Firebase initialization failed:",e),this.showToast("Firebase-anslutningen misslyckades. Vissa funktioner kan vara begränsade.","error")}this.initAuth(),await this.initAI(),this.setupEventListeners(),this.setupSpeechRecognition(),this.handleCookieConsent(),this.startPlaceholderAnimation(),this.checkAuthStatus()}initAuth(){const e=new URLSearchParams(window.location.search),t=e.get("session"),s=e.get("auth");t&&s==="success"?(this.state.googleAuth.sessionId=t,this.state.googleAuth.isAuthenticated=!0,window.history.replaceState({},document.title,window.location.pathname),this.fetchUserInfo()):s==="error"&&(this.showToast("Inloggningen misslyckades.","error"),window.history.replaceState({},document.title,window.location.pathname))}async checkAuthStatus(){this.state.googleAuth.sessionId&&this.state.googleAuth.isAuthenticated&&await this.fetchUserInfo()}async fetchUserInfo(){if(this.state.googleAuth.sessionId){try{const e=await fetch(`${Ue}/api/user`,{headers:{Authorization:`Bearer ${this.state.googleAuth.sessionId}`}});if(e.ok){const t=await e.json();this.state.user={isLoggedIn:!0,name:t.name,email:t.email,avatarUrl:t.picture,id:t.id},this.state.onboardingChecklist.connectedGoogle=!0,this.state.onboarding.completed=!0,this.showToast(`Välkommen, ${t.name}!`),this.state.isDemoMode&&this.toggleDemoMode(!1)}else this.handleSignOut()}catch(e){console.error("Error fetching user info:",e),this.showToast("Kunde inte hämta användarinformation.","error")}this.saveAndRender()}}async initAI(){try{console.log("🔧 Initializing secure AI system...");const e=await fetch("/.netlify/functions/gemini",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:"Test"})});if(!e.ok)throw new Error("AI service är inte tillgänglig från backend");const t=await e.json();if(!t.success)throw new Error("AI service returnerade fel: "+t.error);this.isAiReady=!0,this.addMessage("ByggPilot AI är redo att hjälpa dig! Skriv dina frågor eller kommandon här.","ai"),console.log("✅ Secure AI system initialized successfully")}catch(e){console.error("❌ Failed to initialize secure AI:",e),this.isAiReady=!1,this.addMessage("ByggPilot AI är inte tillgänglig just nu. Kontrollera att backend-funktionerna är korrekt konfigurerade.","ai",!0)}}setupEventListeners(){this.sendButton.addEventListener("click",()=>this.sendMessage()),this.chatInput.addEventListener("keydown",e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),this.sendMessage())}),this.voiceInputButton.addEventListener("click",()=>this.toggleVoiceInput()),this.fileInputHidden.addEventListener("change",e=>this.handleFileAttachment(e)),this.chatInput.addEventListener("focus",()=>{this.state.isChatExpanded||this.toggleChat()}),document.body.addEventListener("click",e=>this.handleCentralClick(e))}handleCentralClick(e){const t=e.target,s=t.closest("[data-action]");if(!t.closest(".dropdown-menu")&&!t.closest('[data-action="show-profile"]')&&document.querySelectorAll(".dropdown-menu.show").forEach(r=>r.classList.remove("show")),s){e.preventDefault(),e.stopPropagation();const r=s.dataset.action,c=s.dataset.details;let h=c?JSON.parse(c):{};if(!h.projectId){const p=t.closest(".project-card[data-project-id]");p&&(h.projectId=p.dataset.projectId)}this.handleAction(r,h,s)}}handleAction(e,t,s){var r;if(e)switch(e){case"onboarding-set-role":this.handleOnboardingStep("role",t.role);break;case"dismiss-onboarding-checklist":this.state.settings.showOnboardingChecklist=!1,this.saveAndRender();break;case"google-signin":this.handleGoogleSignIn();break;case"sign-out":this.handleSignOut();break;case"show-profile":(r=document.getElementById("user-profile-menu"))==null||r.classList.toggle("show");break;case"create-new":this.showCreateModal(t.projectId);break;case"close-modal":this.genericModal.classList.remove("active");break;case"toggle-demo":this.toggleDemoMode();break;case"start-timer":this.startTimer();break;case"stop-timer":this.stopTimer();break;case"show-view":this.switchView(s.dataset.view);break;case"cookie-accept":this.acceptCookies(s.dataset.choice);break;case"remove-project":this.removeProject(t.projectId);break;case"interactive-help-cta":this.chatInput.value="Visa mig en snabbdemo av ByggPilot",this.state.isChatExpanded||this.toggleChat(),this.sendMessage();break;case"toggle-chat":this.toggleChat();break;case"toggle-setting":this.toggleSetting(s);break;case"attach-file":this.fileInputHidden.click();break;case"remove-attached-file":this.removeAttachedFile(t.fileName);break;case"open-project-folder":const c=this.state.projects.find(h=>h.id===t.projectId);c!=null&&c.googleDriveFolderId&&this.state.user.isLoggedIn?this.showProjectFiles(t.projectId):this.showToast(`Simulerar: Öppnar mapp för projekt ${t.projectId}...`);break;case"open-event":this.showToast("Simulerar: Öppnar händelse...");break;case"open-drive":this.showToast("Öppnar Google Drive...");break;case"open-calendar":this.showToast("Öppnar Google Kalender...");break;case"open-gmail":this.showToast("Öppnar Gmail...");break;case"send-email":this.showEmailModal(t);break;case"show-help-modal":this.showHelpModal();break}}async handleGoogleSignIn(){try{const t=await(await fetch("/.netlify/functions/auth")).json();if(t.authUrl)window.location.href=t.authUrl;else throw new Error("Failed to get authorization URL")}catch(e){console.error("Error during Google Sign-In:",e),this.showToast("Inloggningen misslyckades.","error")}}async handleSignOut(){try{this.state.googleAuth.sessionId&&await fetch(`${Ue}/api/logout`,{method:"POST",headers:{Authorization:`Bearer ${this.state.googleAuth.sessionId}`}}),this.state.user=this.getInitialState().user,this.state.googleAuth=this.getInitialState().googleAuth,this.showToast("Du har loggats ut."),this.switchView("dashboard")}catch(e){console.error("Error signing out:",e),this.showToast("Utloggningen misslyckades.","error")}this.saveAndRender()}async createProjectFolder(e){if(!this.state.googleAuth.sessionId)return this.showToast("Du måste vara inloggad för att skapa projektmappar.","error"),null;try{const t=await fetch(`${Ue}/api/drive/create-folder`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.state.googleAuth.sessionId}`},body:JSON.stringify({folderName:e})});if(t.ok){const s=await t.json();return this.showToast("Projektmapp skapad i Google Drive!"),s}else throw new Error("Failed to create folder")}catch(t){return console.error("Error creating project folder:",t),this.showToast("Kunde inte skapa projektmapp.","error"),null}}async uploadFileToProject(e,t,s,r){const c=this.state.projects.find(h=>h.id===e);if(!(c!=null&&c.googleDriveFolderId))return this.showToast("Projektet har ingen kopplad Google Drive-mapp.","error"),!1;try{if((await fetch(`${Ue}/api/drive/upload-file`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.state.googleAuth.sessionId}`},body:JSON.stringify({fileName:t,fileContent:s,mimeType:r,folderId:c.googleDriveFolderId})})).ok)return this.showToast(`Fil "${t}" uppladdad till Google Drive!`),!0;throw new Error("Failed to upload file")}catch(h){return console.error("Error uploading file:",h),this.showToast("Kunde inte ladda upp fil.","error"),!1}}async listProjectFiles(e){const t=this.state.projects.find(s=>s.id===e);if(!(t!=null&&t.googleDriveFolderId))return[];try{const s=await fetch(`${Ue}/api/drive/list-files/${t.googleDriveFolderId}`,{headers:{Authorization:`Bearer ${this.state.googleAuth.sessionId}`}});if(s.ok)return(await s.json()).files||[];throw new Error("Failed to list files")}catch(s){return console.error("Error listing project files:",s),[]}}async sendEmailWithAttachment(e,t,s,r=[]){if(!this.state.googleAuth.sessionId)return this.showToast("Du måste vara inloggad för att skicka e-post.","error"),!1;try{if((await fetch(`${Ue}/api/gmail/send`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.state.googleAuth.sessionId}`},body:JSON.stringify({to:e,subject:t,body:s,attachments:r})})).ok)return this.showToast(`E-post skickat till ${e}!`),!0;throw new Error("Failed to send email")}catch(c){return console.error("Error sending email:",c),this.showToast("Kunde inte skicka e-post.","error"),!1}}async checkForNewEmails(e="is:unread"){if(!this.state.googleAuth.sessionId)return[];try{const t=await fetch(`${Ue}/api/gmail/messages?query=${encodeURIComponent(e)}`,{headers:{Authorization:`Bearer ${this.state.googleAuth.sessionId}`}});if(t.ok)return(await t.json()).messages||[];throw new Error("Failed to fetch emails")}catch(t){return console.error("Error checking emails:",t),[]}}saveState(){const e={settings:this.state.settings,isDemoMode:this.state.isDemoMode,projects:this.state.isDemoMode?this.state.projects:[],tasks:this.state.isDemoMode?this.state.tasks:[],events:this.state.isDemoMode?this.state.events:[],onboarding:this.state.onboarding,onboardingChecklist:this.state.onboardingChecklist,googleAuth:this.state.googleAuth};localStorage.setItem("byggpilot_state_v2",JSON.stringify(e))}getInitialState(){return{user:{isLoggedIn:!1,name:"Gästanvändare",avatarUrl:null,id:null,email:null},projects:[],tasks:[],events:[],attachedFiles:[],activeTimer:{projectId:null,startTime:null,intervalId:null},isDemoMode:!1,settings:{showTimeLogger:!0,showTaskList:!0,showEvents:!0,showOnboardingChecklist:!0},currentView:"dashboard",isChatExpanded:!1,onboarding:{completed:!1,step:"welcome",role:null},onboardingChecklist:{createdProject:!1,connectedGoogle:!1,loggedTime:!1},googleAuth:{sessionId:null,isAuthenticated:!1}}}loadState(){const e=localStorage.getItem("byggpilot_state_v2");if(this.state=this.getInitialState(),e)try{const t=JSON.parse(e);this.state.settings={...this.getInitialState().settings,...t.settings},this.state.onboarding=t.onboarding||this.getInitialState().onboarding,this.state.onboardingChecklist=t.onboardingChecklist||this.getInitialState().onboardingChecklist,this.state.googleAuth=t.googleAuth||this.getInitialState().googleAuth,t.isDemoMode&&(this.state.isDemoMode=!0,this.state.projects=t.projects||[],this.state.tasks=t.tasks||[],this.state.events=t.events||[])}catch(t){console.error("Could not parse saved state:",t),localStorage.removeItem("byggpilot_state_v2")}}saveAndRender(){this.saveState(),this.renderCurrentView()}toggleDemoMode(e){this.state.isDemoMode=e!==void 0?e:!this.state.isDemoMode,this.state.isDemoMode?(this.state.onboarding.completed=!0,this.state.projects=[{id:"proj-1",name:"Badrumsrenovering Villa Ekbacken",customer:"Familjen Andersson",deadline:"2024-08-15",progress:75,status:"green"},{id:"proj-2",name:"Altanbygge Sommarstugan",customer:"Sven Svensson",deadline:"2024-07-30",progress:40,status:"yellow"},{id:"proj-3",name:"Fönsterbyte BRF Utsikten",customer:"BRF Utsikten",deadline:"2024-07-20",progress:90,status:"red"}],this.state.tasks=[{id:"task-1",text:"Beställa kakel till Villa Ekbacken",completed:!1},{id:"task-2",text:"Skicka offert till ny kund",completed:!1},{id:"task-3",text:"Fakturera BRF Utsikten för etapp 3",completed:!0}],this.state.events=[{id:"evt-1",type:"mail",icon:"mail",title:"Nytt mail från Anna Andersson",subtitle:"Ang. offert badrum...",link:"#"},{id:"evt-2",type:"calendar",icon:"calendar_month",title:"Slutbesiktning Villa Nygren",subtitle:"Imorgon kl 14:00",link:"#"},{id:"evt-3",type:"file",icon:"description",title:"Nytt avtal från leverantör",subtitle:"Trävaru AB",link:"#"}],this.showToast("Demoläge aktiverat!")):(this.state.user.isLoggedIn||(this.state.projects=[],this.state.tasks=[],this.state.events=[]),this.showToast("Demoläge avaktiverat.")),document.body.classList.toggle("demo-mode-active",this.state.isDemoMode),this.saveAndRender()}switchView(e){e==="projects"&&(e="dashboard"),this.state.currentView=e,document.querySelectorAll(".sidebar-nav a, .sidebar-footer a").forEach(t=>{t.classList.toggle("active",t.getAttribute("data-view")===e||e==="dashboard"&&t.getAttribute("data-view")==="projects")}),this.saveAndRender()}renderCurrentView(){if(this.renderHeaderAndSidebar(),this.renderChatState(),!this.state.onboarding.completed&&!this.state.user.isLoggedIn&&!this.state.isDemoMode){this.renderOnboarding();return}const t=this.state.user.isLoggedIn||this.state.isDemoMode||this.state.projects.length>0;switch(this.state.currentView){case"dashboard":t?this.renderLoggedInDashboard():this.renderLoggedOutDashboard();break;case"help":this.renderHelpView();break;case"settings":t?this.renderSettingsView():this.renderPlaceholderView("Inställningar");break;case"dokument":t?this.renderDokumentView():this.renderPlaceholderView("Dokument");break;case"slutfaktura":t?this.renderInvoiceView():this.renderPlaceholderView("Slutfaktura");break;default:t?this.renderGenericView(this.state.currentView):this.renderPlaceholderView(this.state.currentView)}}renderHeaderAndSidebar(){const{isLoggedIn:e,name:t,avatarUrl:s}=this.state.user,r=this.state.isDemoMode;document.getElementById("google-signin-button").style.display=e?"none":"flex",document.getElementById("demo-mode-button").style.display=e?"none":"block",document.getElementById("logout-button").style.display=e?"flex":"none",document.getElementById("logout-divider").style.display=e?"block":"none",e&&t?(this.userNameElement.textContent=t,this.userAvatarElement.innerHTML=s?`<img src="${s}" alt="Användarprofilbild">`:`<span>${t.charAt(0).toUpperCase()}</span>`,this.greetingElement.textContent=`God morgon, ${t.split(" ")[0]}!`,this.subGreetingElement.textContent="Här är din översikt för dagen."):r?(this.userNameElement.textContent="Demo Användare",this.userAvatarElement.innerHTML="<span>D</span>",this.greetingElement.textContent="Välkommen till demoläget",this.subGreetingElement.textContent="Klicka runt och utforska funktionerna."):(this.userNameElement.textContent="Gäst",this.userAvatarElement.innerHTML="<span>G</span>",this.greetingElement.textContent="Välkommen till ByggPilot",this.subGreetingElement.textContent="Logga in eller testa demoläget.")}renderLoggedInDashboard(){const e=document.getElementById("logged-in-dashboard-template");this.pageContentElement.innerHTML="",this.pageContentElement.appendChild(e.content.cloneNode(!0)),this.state.settings.showOnboardingChecklist&&this.state.onboarding.completed&&this.renderOnboardingChecklist();const t=document.getElementById("time-logger-widget");t&&(t.style.display=this.state.settings.showTimeLogger?"flex":"none");const s=document.getElementById("task-list-widget");s&&(s.style.display=this.state.settings.showTaskList?"flex":"none");const r=document.getElementById("events-widget");r&&(r.style.display=this.state.settings.showEvents?"flex":"none"),this.renderProjectOverviewWidget(),this.renderTaskWidget(),this.renderTimeLoggerWidget(),this.renderEventsWidget()}renderLoggedOutDashboard(){const e=document.getElementById("logged-out-dashboard-template");this.pageContentElement.innerHTML="",this.pageContentElement.appendChild(e.content.cloneNode(!0))}renderDokumentView(){const e=document.getElementById("dokument-view-template");this.pageContentElement.innerHTML="",this.pageContentElement.appendChild(e.content.cloneNode(!0))}renderPlaceholderView(e){const t=document.getElementById("placeholder-view-template");this.pageContentElement.innerHTML="";const s=t.content.cloneNode(!0);s.querySelector(".view-title").textContent=e.charAt(0).toUpperCase()+e.slice(1),this.pageContentElement.appendChild(s)}renderGenericView(e){this.pageContentElement.innerHTML=`<div class="empty-state"><h1>${e.charAt(0).toUpperCase()+e.slice(1)}</h1><p>Denna vy är under utveckling.</p></div>`}renderHelpView(){const e=document.getElementById("help-landing-page-template");this.pageContentElement.innerHTML="",this.pageContentElement.appendChild(e.content.cloneNode(!0))}renderInvoiceView(){const e=document.getElementById("slutfaktura-view-template");this.pageContentElement.innerHTML="",this.pageContentElement.appendChild(e.content.cloneNode(!0));const t=document.getElementById("invoice-project-select");t.innerHTML='<option value="">Välj ett projekt</option>',this.state.projects.forEach(s=>{const r=document.createElement("option");r.value=s.id,r.textContent=s.name,t.appendChild(r)})}renderSettingsView(){const e=document.getElementById("settings-view-template");this.pageContentElement.innerHTML="",this.pageContentElement.appendChild(e.content.cloneNode(!0)),document.getElementById("toggle-timelogger").checked=this.state.settings.showTimeLogger,document.getElementById("toggle-tasklist").checked=this.state.settings.showTaskList,document.getElementById("toggle-events").checked=this.state.settings.showEvents,this.renderProjectManagementList()}toggleSetting(e){const t=e.querySelector("input");if(!t)return;const s=t.dataset.setting;s&&(this.state.settings[s]=!this.state.settings[s],this.saveAndRender())}renderProjectManagementList(){const e=document.getElementById("project-management-list"),t=document.getElementById("project-management-item-template");!e||!t||(e.innerHTML="",this.state.projects.forEach(s=>{const r=t.content.cloneNode(!0);r.querySelector(".item-name").textContent=s.name;const c=r.querySelector("button");c.dataset.details=JSON.stringify({projectId:s.id}),e.appendChild(r)}))}removeProject(e){this.state.projects=this.state.projects.filter(t=>t.id!==e),this.showToast("Projektet har tagits bort."),this.saveAndRender()}renderProjectOverviewWidget(){const e=document.getElementById("project-grid-container");if(!e)return;const t=document.getElementById("project-card-template"),s=document.getElementById("project-card-actions-template");if(e.innerHTML="",this.state.projects.length===0){e.innerHTML='<div class="empty-state">Inga projekt att visa. Skapa ett nytt!</div>';return}this.state.projects.forEach(r=>{const c=t.content.cloneNode(!0),h=c.firstElementChild;h.dataset.projectId=r.id,h.dataset.details=JSON.stringify({projectId:r.id}),h.style.borderLeftColor=`var(--status-${r.status})`,h.querySelector(".project-name").textContent=r.name,h.querySelector(".customer-name").textContent=r.customer,h.querySelector(".deadline-date").textContent=r.deadline,h.querySelector(".progress-percentage").textContent=`${r.progress}%`,h.querySelector(".progress-bar-inner").style.width=`${r.progress}%`;const p=h.querySelector(".status-tag");p.className="status-tag",p.classList.add(`status-${r.status}`),p.textContent={green:"I fas",yellow:"Risk",red:"Försenat"}[r.status];const w=s.content.cloneNode(!0);h.prepend(w),e.appendChild(c)})}renderTaskWidget(){const e=document.getElementById("task-list");if(!e)return;const t=document.getElementById("task-item-template");if(e.innerHTML="",this.state.tasks.length===0){e.innerHTML='<li class="empty-state">Inga uppgifter.</li>';return}this.state.tasks.forEach(s=>{const c=t.content.cloneNode(!0).firstElementChild,h=c.querySelector("input"),p=c.querySelector("label"),w=`task-${s.id}`;h.id=w,h.checked=s.completed,h.onchange=()=>this.handleTaskToggle(s.id,h.checked),p.setAttribute("for",w),p.textContent=s.text,e.appendChild(c)})}renderEventsWidget(){const e=document.getElementById("event-list");if(!e)return;const t=document.getElementById("event-item-template");if(e.innerHTML="",this.state.events.length===0){e.innerHTML='<li class="empty-state">Inga nya händelser.</li>';return}this.state.events.forEach(s=>{const r=t.content.cloneNode(!0),c=r.firstElementChild;c.dataset.details=JSON.stringify({eventId:s.id,link:s.link}),c.querySelector(".material-symbols-outlined").textContent=s.icon,c.querySelector(".event-title").textContent=s.title,c.querySelector(".event-subtitle").textContent=s.subtitle,e.appendChild(r)})}handleTaskToggle(e,t){const s=this.state.tasks.find(r=>r.id===e);s&&(s.completed=t,this.saveState())}renderTimeLoggerWidget(){const e=document.getElementById("project-select");e&&(e.innerHTML='<option value="">Välj projekt...</option>',this.state.projects.forEach(t=>{const s=document.createElement("option");s.value=t.id,s.textContent=t.name,e.appendChild(s)}))}renderOnboarding(){this.pageContentElement.innerHTML="",this.genericModal.innerHTML="";let e;switch(this.state.onboarding.step){case"welcome":e="onboarding-welcome-modal-template";break;case"create_project":e="onboarding-create-project-template";break;default:this.state.onboarding.completed=!0,this.saveAndRender();return}const t=document.getElementById(e);if(this.genericModal.appendChild(t.content.cloneNode(!0)),this.state.onboarding.step==="create_project"){const s=this.genericModal.querySelector("#onboarding-project-form");s.onsubmit=r=>{r.preventDefault();const c=this.genericModal.querySelector("#onboarding-project-name").value,h=this.genericModal.querySelector("#onboarding-customer-name").value;this.handleOnboardingStep("create_project",{projectName:c,customerName:h})}}this.genericModal.classList.add("active")}handleOnboardingStep(e,t){if(e==="role")this.state.onboarding.role=t,this.state.onboarding.step="create_project",this.saveState(),this.renderOnboarding();else if(e==="create_project"){const s={id:`proj-${Date.now()}`,name:t.projectName,customer:t.customerName,deadline:new Date(Date.now()+2592e6).toISOString().split("T")[0],progress:0,status:"green"};this.state.projects.unshift(s),this.state.onboarding.completed=!0,this.state.onboardingChecklist.createdProject=!0,this.showToast(`Projektet '${s.name}' har skapats!`),this.genericModal.classList.remove("active"),this.saveAndRender(),setTimeout(()=>{this.chatInput.value=`Skapa en checklista för målningsarbete för projektet ${t.projectName}`,this.state.isChatExpanded||this.toggleChat(),this.showToast("Här är din AI-assistent. Prova att skicka det föreslagna kommandot!","info")},500)}}renderOnboardingChecklist(){const e=document.getElementById("onboarding-checklist-container");if(!e||!this.state.settings.showOnboardingChecklist)return;const t=document.getElementById("onboarding-checklist-template");e.innerHTML="",e.appendChild(t.content.cloneNode(!0));const s=document.getElementById("onboarding-task-list"),r=document.getElementById("task-item-template"),c=[{text:"Skapa ditt första projekt",completed:this.state.onboardingChecklist.createdProject,id:"ob-1"},{text:"Koppla ditt Google-konto för automatisering",completed:this.state.onboardingChecklist.connectedGoogle,id:"ob-2"},{text:"Logga din första timme",completed:this.state.onboardingChecklist.loggedTime,id:"ob-3"}];s.innerHTML="",c.forEach(h=>{const w=r.content.cloneNode(!0).firstElementChild,E=w.querySelector("input"),S=w.querySelector("label");E.id=h.id,E.checked=h.completed,E.disabled=!0,S.setAttribute("for",h.id),S.textContent=h.text,s.appendChild(w)})}showCreateModal(e){const t=document.getElementById("create-project-modal-template");if(!t)return;this.genericModal.innerHTML="",this.genericModal.appendChild(t.content.cloneNode(!0));const s=this.genericModal.querySelector("#project-form");s.onsubmit=async r=>{r.preventDefault();const c=s.elements.namedItem("project-id-input").value||`proj-${Date.now()}`,h=s.elements.namedItem("project-name-input").value,p=s.elements.namedItem("project-customer-input").value,w=s.elements.namedItem("project-deadline-date-input").value,E=parseInt(s.elements.namedItem("project-progress-input").value,10);let S=E>85?"red":E>60?"yellow":"green",A={id:c,name:h,customer:p,deadline:w,progress:E,status:S};if(!e&&this.state.user.isLoggedIn&&this.state.googleAuth.sessionId){this.showToast("Skapar projektmapp i Google Drive...","info");const T=await this.createProjectFolder(h);T&&(A.googleDriveFolderId=T.folderId)}e?(this.state.projects=this.state.projects.map(T=>T.id===e?A:T),this.showToast(`Projektet '${A.name}' har uppdaterats.`)):(this.state.projects.unshift(A),this.state.onboardingChecklist.createdProject=!0,this.showToast(`Projektet '${A.name}' har skapats.`)),this.saveAndRender(),this.genericModal.classList.remove("active")},this.genericModal.classList.add("active")}async showProjectFiles(e){const t=this.state.projects.find(c=>c.id===e);if(!t||!t.googleDriveFolderId){this.showToast("Projektet har ingen kopplad Google Drive-mapp.","error");return}this.showToast("Hämtar projektfiler...","info");const s=await this.listProjectFiles(e);this.genericModal.innerHTML=`
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Projektfiler - ${t.name}</h2>
                    <button class="btn" data-action="close-modal">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div class="modal-body">
                    ${s.length===0?"<p>Inga filer hittades i projektmappen.</p>":s.map(c=>`
                            <div class="file-item">
                                <span class="material-symbols-outlined">${r(c.mimeType)}</span>
                                <div class="file-info">
                                    <strong>${c.name}</strong>
                                    <small>Ändrad: ${new Date(c.modifiedTime).toLocaleDateString("sv-SE")}</small>
                                </div>
                                <a href="${c.webViewLink}" target="_blank" class="btn btn-primary">
                                    <span class="material-symbols-outlined">open_in_new</span>
                                    Öppna
                                </a>
                            </div>
                        `).join("")}
                </div>
                <div class="modal-footer">
                    <button class="btn" data-action="close-modal">Stäng</button>
                </div>
            </div>
        `,this.genericModal.classList.add("active");function r(c){return c.includes("pdf")?"picture_as_pdf":c.includes("image")?"image":c.includes("document")||c.includes("word")?"description":c.includes("sheet")||c.includes("excel")?"table_chart":c.includes("folder")?"folder":"insert_drive_file"}}showEmailModal(e){this.genericModal.innerHTML=`
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Skicka E-post</h2>
                    <button class="btn" data-action="close-modal">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form id="email-form">
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="email-to">Till:</label>
                            <input type="email" id="email-to" name="to" required value="${e.to||""}">
                        </div>
                        <div class="form-group">
                            <label for="email-subject">Ämne:</label>
                            <input type="text" id="email-subject" name="subject" required value="${e.subject||""}">
                        </div>
                        <div class="form-group">
                            <label for="email-body">Meddelande:</label>
                            <textarea id="email-body" name="body" rows="8" required>${e.body||""}</textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn" data-action="close-modal">Avbryt</button>
                        <button type="submit" class="btn btn-primary">
                            <span class="material-symbols-outlined">send</span>
                            Skicka
                        </button>
                    </div>
                </form>
            </div>
        `;const t=this.genericModal.querySelector("#email-form");t.onsubmit=async s=>{s.preventDefault();const r=new FormData(t),c=r.get("to"),h=r.get("subject"),p=r.get("body");await this.sendEmailWithAttachment(c,h,p)&&this.genericModal.classList.remove("active")},this.genericModal.classList.add("active")}showHelpModal(){this.genericModal.innerHTML=`
            <div class="modal-content help-modal">
                <div class="modal-header">
                    <h2>Så funkar ByggPilot</h2>
                    <button class="btn" data-action="close-modal">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="content-section">
                        <p>Vi vet att administration är nödvändigt, men det ska inte behöva stjäla dina kvällar eller ta fokus från det du gör bäst – att driva dina projekt framåt.</p>
                        
                        <div class="vision-text">
                            Tänk om man kunde skapa en digital kollega som alltid finns tillgänglig, direkt i fickan?
                        </div>
                    </div>

                    <div class="content-section">
                        <h3>Så här använder du ByggPilot:</h3>
                        
                        <div class="example-card">
                            <h4>Istället för att:</h4>
                            <p>"Jag måste skapa en mapp för det nya projektet, sedan skriva en offert, komma ihåg att följa upp..."</p>
                            <h4>Säg så här:</h4>
                            <p>"Skapa ett nytt projekt för Villa Andersson på Storgatan 15"</p>
                        </div>

                        <div class="example-card">
                            <h4>Istället för att:</h4>
                            <p>"Var ska jag lägga alla kvitton? Vilka handlingar behöver revisorn?"</p>
                            <h4>Säg så här:</h4>
                            <p>"Hjälp mig organisera mina kvitton för december"</p>
                        </div>

                        <div class="example-card">
                            <h4>Istället för att:</h4>
                            <p>"Jag måste kolla väderprognosen för nästa vecka och planera om..."</p>
                            <h4>Säg så här:</h4>
                            <p>"Kommer det regna på onsdag? Ska vi flytta betonggjutningen?"</p>
                        </div>
                    </div>

                    <div class="content-section">
                        <h3>Vad ByggPilot kan hjälpa dig med:</h3>
                        <div class="feature-highlight">
                            <ul>
                                <li><strong>Projekthantering:</strong> Skapa mappar, hantera deadlines, följ upp framsteg</li>
                                <li><strong>Ekonomi:</strong> Offerter, fakturor, bokföringsunderlag</li>
                                <li><strong>Kommunikation:</strong> E-post till kunder, uppföljning, påminnelser</li>
                                <li><strong>Dokumentation:</strong> Organisera filer, bilder, ritningar</li>
                                <li><strong>Planering:</strong> Väderprognos, schemaläggning, riskanalys</li>
                            </ul>
                        </div>
                    </div>

                    <div class="content-section">
                        <h3>Tips för bästa resultat:</h3>
                        <p>Var konkret i dina frågor och kommandon. ByggPilot förstår svenska byggtermer och kan hantera allt från "Skapa KMA-plan" till "Vad kostar det att bygga en altan?"</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" data-action="close-modal">Förstått!</button>
                </div>
            </div>
        `,this.genericModal.classList.add("active")}showToast(e,t="info"){const s=document.getElementById("toast-container");if(!s)return;const r=document.createElement("div");r.className=`toast ${t}`,r.textContent=e,s.appendChild(r),setTimeout(()=>r.remove(),5e3)}handleCookieConsent(){const e=localStorage.getItem("byggpilot_cookie_consent"),t=document.getElementById("cookie-consent-banner");!e&&t&&t.classList.add("show")}acceptCookies(e){localStorage.setItem("byggpilot_cookie_consent",e);const t=document.getElementById("cookie-consent-banner");t&&t.classList.remove("show"),this.showToast("Tack! Dina cookie-inställningar har sparats.")}startTimer(){const e=document.getElementById("project-select"),t=document.getElementById("timer-toggle-button"),s=document.getElementById("timer-display");if(!e||!t||!s)return;const r=e.value;if(!r){this.showToast("Välj ett projekt innan du startar timern.");return}this.state.activeTimer.intervalId||(this.state.activeTimer={projectId:r,startTime:Date.now(),intervalId:window.setInterval(()=>this.updateTimerDisplay(),1e3)},t.textContent="Stoppa",t.dataset.action="stop-timer",e.disabled=!0)}stopTimer(){const e=document.getElementById("project-select"),t=document.getElementById("timer-toggle-button"),s=document.getElementById("timer-display");!this.state.activeTimer.intervalId||!t||!e||!s||(clearInterval(this.state.activeTimer.intervalId),this.showToast("Tid loggad för projektet!"),this.state.onboardingChecklist.loggedTime=!0,this.state.activeTimer={projectId:null,startTime:null,intervalId:null},s.textContent="00:00:00",t.textContent="Starta",t.dataset.action="start-timer",e.disabled=!1,this.saveAndRender())}updateTimerDisplay(){const e=document.getElementById("timer-display");if(!this.state.activeTimer.startTime||!e)return;const t=Math.floor((Date.now()-this.state.activeTimer.startTime)/1e3),s=String(Math.floor(t/3600)).padStart(2,"0"),r=String(Math.floor(t%3600/60)).padStart(2,"0"),c=String(t%60).padStart(2,"0");e.textContent=`${s}:${r}:${c}`}setupSpeechRecognition(){const e=window.SpeechRecognition||window.webkitSpeechRecognition;e&&(this.recognition=new e,this.recognition.continuous=!1,this.recognition.lang="sv-SE",this.recognition.interimResults=!1,this.recognition.onresult=t=>this.chatInput.value=t.results[0][0].transcript,this.recognition.onaudiostart=()=>{this.isListening=!0,this.voiceInputButton.classList.add("is-listening")},this.recognition.onaudioend=()=>{this.isListening=!1,this.voiceInputButton.classList.remove("is-listening")},this.recognition.onerror=t=>{t.error==="not-allowed"&&this.showToast("Ge webbläsaren åtkomst till mikrofonen.","error")})}toggleVoiceInput(){this.recognition&&(this.isListening?this.recognition.stop():this.recognition.start())}startPlaceholderAnimation(){this.placeholderInterval&&clearInterval(this.placeholderInterval);let e=0,t=0;this.placeholderInterval=window.setInterval(()=>{const s=this.placeholderTexts[e];this.chatInput.placeholder=s.substring(0,t+1),t++,t>s.length+3&&(t=0,e=(e+1)%this.placeholderTexts.length)},120)}stopPlaceholderAnimation(){this.placeholderInterval&&clearInterval(this.placeholderInterval),this.placeholderInterval=null,this.chatInput.placeholder="Fråga din digitala kollega..."}toggleChat(){this.state.isChatExpanded=!this.state.isChatExpanded,this.state.isChatExpanded?(this.stopPlaceholderAnimation(),this.chatInput.focus()):this.startPlaceholderAnimation(),this.renderChatState()}renderChatState(){this.chatDrawer.classList.toggle("expanded",this.state.isChatExpanded),this.pageContentElement.classList.toggle("hidden-by-chat",this.state.isChatExpanded)}handleFileAttachment(e){const t=e.target;t.files&&(this.state.attachedFiles.push(...Array.from(t.files)),this.renderAttachedFiles())}removeAttachedFile(e){this.state.attachedFiles=this.state.attachedFiles.filter(t=>t.name!==e),this.renderAttachedFiles()}renderAttachedFiles(){this.attachedFilesPreview.innerHTML="",this.state.attachedFiles.forEach(e=>{const t=document.createElement("div");t.className="file-preview-item";const s=document.createElement("img");s.src=URL.createObjectURL(e);const r=document.createElement("button");r.className="remove-file-btn",r.innerHTML="&times;",r.dataset.action="remove-attached-file",r.dataset.details=JSON.stringify({fileName:e.name}),t.appendChild(s),t.appendChild(r),this.attachedFilesPreview.appendChild(t)}),this.state.attachedFiles.length>0&&!this.state.isChatExpanded&&this.toggleChat()}addMessage(e,t,s=!1){const r=this.chatMessages.querySelector(".welcome-message");r&&r.remove();const c=document.createElement("div");if(c.classList.add("chat-message",t),s&&c.classList.add("error-message"),t==="ai"){const p=this.processAIContent(bu(e));c.innerHTML=p}else c.innerHTML=`<p>${e.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</p>`;const h=document.createElement("button");h.className="copy-message-btn",h.innerHTML='<span class="material-symbols-outlined">content_copy</span>',h.title="Kopiera meddelande",h.onclick=()=>this.copyToClipboard(e),c.appendChild(h),this.chatMessages.appendChild(c),this.chatMessages.scrollTop=this.chatMessages.scrollHeight}processAIContent(e){const t=[/(<ul>[\s\S]*?<\/ul>)/g,/(<ol>[\s\S]*?<\/ol>)/g,/(<pre><code>[\s\S]*?<\/code><\/pre>)/g];let s=e;return t.forEach(r=>{s=s.replace(r,c=>{const h="box-"+Math.random().toString(36).substr(2,9);return`<div class="ai-content-box" data-content="${h}">
                    <button class="copy-content-btn" onclick="window.byggpilot.copyContentBox('${h}')" title="Kopiera innehåll">
                        <span class="material-symbols-outlined">content_copy</span>
                    </button>
                    ${c}
                </div>`})}),s}copyToClipboard(e){navigator.clipboard.writeText(e).then(()=>{this.showToast("Kopierat till urklipp!")}).catch(()=>{this.showToast("Kunde inte kopiera text","error")})}copyContentBox(e){const t=document.querySelector(`[data-content="${e}"]`);if(t){const s=t.textContent||"";this.copyToClipboard(s)}}showThinkingIndicator(){const e=document.createElement("div");e.className="thinking-indicator",e.innerHTML=`
            <span>ByggPilot tänker</span>
            <div class="thinking-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `,e.id="thinking-indicator",this.chatMessages.appendChild(e),this.chatMessages.scrollTop=this.chatMessages.scrollHeight}removeThinkingIndicator(){const e=document.getElementById("thinking-indicator");e&&e.remove()}async sendMessage(){const e=this.chatInput.value.trim();if(!(!e&&this.state.attachedFiles.length===0||!this.isAiReady)){this.addMessage(e,"user"),this.chatInput.value="",this.chatHistory.push({role:"user",content:e,attachments:this.state.attachedFiles.length>0?await Promise.all(this.state.attachedFiles.map(Su)):void 0}),this.showThinkingIndicator(),this.loadingIndicator.style.display="inline-block",this.sendIcon.style.display="none",this.sendButton.disabled=!0;try{const t=this.chatHistory.map(h=>({role:h.role,content:h.content}));let s="";this.state.user.isLoggedIn&&this.state.user.email&&(s=`[Användarkontext: Användaren är inloggad som ${this.state.user.email} och har gett åtkomst till Google Kalender och Gmail.]

`);const r=await fetch("/.netlify/functions/gemini",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:t,prompt:s+e})});if(!r.ok)throw new Error(`AI service error: ${r.status}`);const c=await r.json();this.removeThinkingIndicator(),c.success&&c.response?(this.addMessage(c.response,"ai"),this.chatHistory.push({role:"assistant",content:c.response})):this.addMessage("Jag fick inget svar från AI-tjänsten: "+(c.error||"Okänt fel"),"ai",!0)}catch(t){console.error("❌ Secure AI API error:",t),this.removeThinkingIndicator(),this.addMessage("Ursäkta, något gick fel med anslutningen till AI:n.","ai",!0)}finally{this.state.attachedFiles=[],this.renderAttachedFiles(),this.loadingIndicator.style.display="none",this.sendIcon.style.display="inline-block",this.sendButton.disabled=!1,this.chatInput.focus()}}}}document.addEventListener("DOMContentLoaded",async()=>{const i=document.createElement("div");i.id="app-loading",i.innerHTML=`
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    text-align: center; z-index: 10000;">
            <div style="margin-bottom: 15px;">🔥 Initialiserar ByggPilot...</div>
            <div style="width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #007bff; 
                        border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        </div>
        <style>
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
    `,document.body.appendChild(i);try{console.log("🔥 Initializing Firebase..."),await ko(),console.log("✅ Firebase ready! Starting ByggPilot app..."),i.remove();const e=new Au;window.byggpilot={copyContentBox:t=>e.copyContentBox(t)}}catch(e){console.error("❌ Critical Firebase initialization failed:",e),i.innerHTML=`
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: #fff3cd; color: #856404; padding: 20px; border-radius: 10px; 
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; z-index: 10000;
                        border: 1px solid #ffeaa7;">
                <h3>⚠️ Anslutningsproblem</h3>
                <p>Firebase kunde inte initialiseras. Vissa funktioner kan vara begränsade.</p>
                <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; 
                        background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Försök igen
                </button>
            </div>
        `}});
