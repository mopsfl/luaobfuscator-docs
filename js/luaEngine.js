function randomHex(num,max){var hue=Math.floor(360*num/max);return "#"+hslToHex(hue,100,50);}
function getRandomHex(index,max,hueStart,hueEnd,satStart,satEnd,lightStart,lightEnd){const hueRange=hueEnd-hueStart;const hueInterval=hueRange/max;const hue=hueStart+index*hueInterval;const satRange=satEnd-satStart;const satInterval=satRange/max;const sat=satStart+index*satInterval;const lightRange=lightEnd-lightStart;const lightInterval=lightRange/max;const light=lightStart+index*lightInterval;return hslToHex(hue,sat,light);}
function hslToHex(h,s,l){h/=360;s/=100;l/=100;let r,g,b;if(s===0){r=g=b=l;}else{const hue2rgb=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};const q=l<0.5?l*(1+s):l+s-l*s;const p=2*l-q;r=hue2rgb(p,q,h+1/3);g=hue2rgb(p,q,h);b=hue2rgb(p,q,h-1/3);}
const toHex=x=>{const hex=Math.round(x*255).toString(16);return hex.length===1?"0"+hex:hex;};return toHex(r)+toHex(g)+toHex(b);}
let luaEngine=function(){let tokens;let lineCount;let lastEvent;let lastApiTry;let sessionId;let frontendCallback;let apiUrl="https://luaobfuscator.com/api/ide/";let whitespaceCount=550;let isQueued=false;let lastScript;let detachedFromSessions=false;let _init=function(frontcallback,flags=0,force=false,content=""){tokens=[]
lineCount=0
lastEdit=0
lastEvent=0
frontendCallback=frontcallback
if(window.location.href.indexOf("localhost")!=-1){apiUrl="http://localhost:8001/api/ide/"}
sessionId=_getSessionUrl()
if(sessionId!==null&&!detachedFromSessions){_scriptGet(function(e){if(e===null){let url=new URLSearchParams(window.location.search)
url.delete("session")
window.location.search=url}else{if(frontcallback!=null){frontcallback(e)}}});}else if(force){_scriptInit(false,flags,content)}}
_getSessionId=function(){return sessionId;}
_getSessionUrl=function(){let url=new URLSearchParams(window.location.search)
let val=url.get("session")
return val}
_setSessionUrl=function(){let url=new URLSearchParams(window.location.search)
url.delete("session")
url.append("session",sessionId)
window.location.search=url}
_setResetUI=function(){let url=new URLSearchParams(window.location.search)
url.delete("session")
window.location.search=url}
let _initFromUrl=function(callback){var url=new URL(window.location.href);$.getJSON(url.searchParams.get("file"),function(data){tokens=data
callback()});}
let _scriptReset=function(flags=0){_scriptInit(true,flags);}
let _scriptInit=function(reset,flags=0,content=""){fetch(apiUrl+"init?f="+flags,{method:"POST",body:content}).then(response=>response.json()).then(data=>{console.log("old "+sessionId+", new "+data.sessionId);sessionId=data.sessionId
if(!reset)
_setSessionUrl()}).catch(error=>{alert("Error: ",error);_setResetUI();})}
let _scriptGet=function(callback){fetch(apiUrl+"?session="+sessionId).then(response=>response.json()).then(data=>{tokens=data.tokens
if(data.message!=null){let codewindow=document.getElementById("lua-codewindow");codewindow.innerHTML="";let span=document.createElement("span");span.innerText="--[[\n\n"+data.message+"\n]]--\n\n\n-- In loving memory of Ferib's Discord Account <3\n";span.className="c_green";span.id="token-0";codewindow.appendChild(span);if(callback!=null)
callback(-1)
let stateCheck=setInterval(()=>{if(document.readyState==='complete'){clearInterval(stateCheck);alert(data.message)}},100);return}
if(callback!=null){if(data.tokens!=null){callback(-1)}else{callback(null)}}})}
let _updateLastTick=function(){lastApiTry=new Date().getTime()}
let _updateScript=function(script,callback){let tick=new Date().getTime()
if(lastApiTry+2000>tick){lastApiTry=tick
lastScript=script;if(!isQueued){isQueued=true;console.log("isQueued = true")
function wait(){tick=new Date().getTime()
if(lastApiTry+2000>tick){console.log("new wait...")
setTimeout(wait,500)
return;}
_updateScript(lastScript,callback)
console.log("isQueued = false")
isQueued=false
lastScript=null;}
wait();}
console.log("waiting...")
return;}
lastEvent=tick
lastApiTry=tick
console.log("new event: "+tick)
fetch(apiUrl,{method:"POST",body:script,headers:{"sessionId":sessionId}}).then(response=>response.json()).then(data=>{tokens=data.tokens
if(callback!=null)
callback(tick)
if(data.message!=null){alert(data.message)}})}
let _obfuscate=function(option,percent,callback){if(detachedFromSessions){return true;}
fetch(apiUrl+"obfuscateAll/"+option+"/"+percent,{method:"POST",headers:{"sessionId":sessionId}}).then(response=>response.json()).then(data=>{tokens=data.tokens
callback(-1)
if(data.message!=null)
alert(data.message)});}
let _obfuscateToken=function(tokenId,callback){console.log("obfuscating: "+tokenId)
fetch(apiUrl+"obfuscate/"+tokenId,{method:"POST",headers:{"sessionId":sessionId}}).then(response=>response.json()).then(data=>{tokens=data.tokens
callback(-1)});}
let _getInstances=function(callback){fetch(apiUrl+"sessions/",{method:"GET",}).then(response=>response.json()).then(data=>{callback(data)});}
let _getPlugins=function(callback){fetch(apiUrl+"plugins/",{method:"GET",}).then(response=>response.json()).then(data=>{callback(data)});}
let _deleteInstance=function(callback){fetch(apiUrl+"delete/",{method:"POST",headers:{"sessionId":sessionId}}).then(response=>response.json()).then(data=>{callback(-1)});}
let _cleanup=function(callback){console.log("Deobfuscating!")
fetch(apiUrl+"cleanup/",{method:"POST",headers:{"sessionId":sessionId}}).then(response=>response.json()).then(data=>{tokens=data.tokens
callback(-1)})}
let _parseScript=function(targetElement,tick){if(tokens==null){tokens=[];}
whitespaceCount=0
function onVariableChange(e){console.log(e.target.className);let classes=e.target.className.split(' ');let newName=e.target.innerHTML;let spans=document.getElementsByClassName(classes[0]);for(var i=0;i<spans.length;i++){if(spans[i]==e.target)
continue;spans[i].innerHTML=newName}}
targetElement.innerHTML="";if(tokens.length>1_000_000){let str="";tokens.forEach(function(n,i){str.concat(n.value);});targetElement.innerHTML=str;}else{tokens.forEach(function(n,i){if(i>1_000_000){targetElement.innerHTML+=n.value;}else{var addNoteClass="";switch(n.type){case 0:case 1:addNoteClass="";break;case 2:addNoteClass="c_green"
break
case 3:addNoteClass="c_white"
break;case 4:addNoteClass="c_blue"
break;case 5:addNoteClass="c_purple"
break;case 6:addNoteClass="c_pink"
break;case 7:addNoteClass="c_yellow"
break;case 8:addNoteClass=""
break;}
let newSpan=document.createElement("span");if(n.xref!=0){addNoteClass="c_ref-"+n.xref+" "+addNoteClass;newSpan.contentEditable=true;newSpan.addEventListener("input",onVariableChange);var hexstr="";let date=new Date();let month=date.getMonth()+1;let day=date.getDate();if(month===2&&day===14){let hueStart=300;let hueEnd=360;let satStart=30;let satEnd=100;let lightStart=30;let lightEnd=100;const max=360;var hexstr=getRandomHex((n.xref*13)%max,max,hueStart,hueEnd,satStart,satEnd,lightStart,lightEnd);}else if(month==6){let hueStart=0;let hueEnd=360;let satStart=100;let satEnd=100;let lightStart=60;let lightEnd=70;const max=360;var hexstr=getRandomHex((n.xref*13)%max,max,hueStart,hueEnd,satStart,satEnd,lightStart,lightEnd);}else if(month==10&&day==31){let hueStart=20;let hueEnd=40;let satStart=100;let satEnd=100;let lightStart=60;let lightEnd=80;const max=360;var hexstr=getRandomHex((n.xref*13)%max,max,hueStart,hueEnd,satStart,satEnd,lightStart,lightEnd);}
if(hexstr!=""){newSpan.style="color: #"+hexstr+"!important; text-shadow: 0 0 4px #"+hexstr+"AF;";}}
if(addNoteClass!=""){newSpan.className=addNoteClass;}
newSpan.className=addNoteClass;newSpan.appendChild(document.createTextNode(n.value))
newSpan.id="token-"+i;targetElement.append(newSpan);}})}
return true}
let _getLines=function(){lines=$("<ul>");}
let _detachSession=function(){detachedFromSessions=true;}
return{init:_init,updateScript:_updateScript,parseScript:_parseScript,obfuscate:_obfuscate,obfuscateToken:_obfuscateToken,getInstances:_getInstances,cleanup:_cleanup,updateLastTick:_updateLastTick,getSessionId:_getSessionId,detachSession:_detachSession,initFromUrl:_initFromUrl,getLines:_getLines,}}();