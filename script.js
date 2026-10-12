const CONFIG = {
  countdownTitle: "Valentine's Day",
  countdownTarget: "2027-02-14T00:00:00",
  specialPair: ["yourname", "theirname"],
  reasons: [
    "Because an ordinary day feels different when you're in it.",
    "Because your laugh can reset my whole mood.",
    "Because you're still the first person I want to tell things to.",
    "Because even silence feels comfortable with you.",
    "Because you make small moments feel important.",
    "Because I can be ridiculous around you and still feel safe.",
    "Because you notice things other people miss.",
    "Because you make home feel less like a place.",
    "Because I like who I am when I'm with you.",
    "Because you somehow became part of the way I imagine tomorrow.",
    "Because I still choose you on the ordinary days.",
    "Because there are a thousand reasons and I keep finding new ones."
  ]
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const screens = $$(".screen");
let current = 0;
let toastTimer;

let sceneTransitioning = false;
function showScene(index) {
  index = Math.max(0, Math.min(index, screens.length - 1));
  if (index === current || sceneTransitioning) return;
  sceneTransitioning = true;

  const old = screens[current];
  const next = screens[index];
  const veil = $("#transitionVeil");

  veil.classList.remove("play");
  void veil.offsetWidth;
  veil.classList.add("play");
  old.classList.add("leaving");
  burst(innerWidth / 2, innerHeight / 2, 7);

  setTimeout(() => {
    old.classList.remove("active", "leaving");
    next.classList.add("active");
    current = index;
    updateChrome();
    onSceneEnter(next.dataset.scene);
  }, 330);

  setTimeout(() => {
    veil.classList.remove("play");
    sceneTransitioning = false;
  }, 760);
}

function updateChrome() {
  $("#sceneNumber").textContent = String(current + 1).padStart(2, "0");
  $("#sceneTotal").textContent = String(screens.length).padStart(2, "0");
  $("#journeyFill").style.height = `${((current + 1) / screens.length) * 100}%`;
  $("#backBtn").classList.toggle("show", current > 0 && current < screens.length - 1);
}
$("#backBtn").addEventListener("click", () => showScene(current - 1));
$("#enterBtn").addEventListener("click", () => { burst(innerWidth / 2, innerHeight * .57, 18); showScene(1); });

function onSceneEnter(scene) {
  if (scene === "art") setTimeout(drawRandomArt, 140);
  if (scene === "scratch") setTimeout(setupScratch, 100);
}
updateChrome();

/* Reasons */
let reasonShown = 0, reasonCursor = 0;
$("#reasonBtn").addEventListener("click", () => {
  reasonCursor = (reasonCursor + 1) % CONFIG.reasons.length;
  const q = $("#reasonQuote");
  q.animate([{opacity:1,transform:"translateY(0)"},{opacity:0,transform:"translateY(-10px)"}],{duration:150,fill:"forwards"}).onfinish=()=>{
    q.textContent = "“" + CONFIG.reasons[reasonCursor] + "”";
    $("#reasonIndex").textContent = String(reasonCursor + 1).padStart(2,"0");
    q.animate([{opacity:0,transform:"translateY(10px)"},{opacity:1,transform:"translateY(0)"}],{duration:250,fill:"forwards"});
  };
  reasonShown = Math.min(3, reasonShown + 1);
  $("#reasonProgress").textContent = `${reasonShown} / 3 discovered`;
  if (reasonShown >= 3) $("#reasonsNext").classList.remove("hidden");
});
$("#reasonsNext").addEventListener("click", () => showScene(2));

/* Random generative painting */
const artCanvas = $("#artCanvas");
const actx = artCanvas.getContext("2d");
let artCount = 0;
const palettes = [
  ["#120817","#ff5f91","#ffb1c8","#8354c7","#f6d7df"],
  ["#0f0915","#e267a1","#f0b0cc","#6845a8","#ffd7bd"],
  ["#150c12","#ff7f88","#f9c3a8","#a265c8","#f7e4e7"],
  ["#0c0a16","#bf63d7","#fd789d","#ffceb7","#6f57c9"],
  ["#130b18","#ec5b86","#d6a2ff","#f6c1d0","#7a3e72"]
];
const artNames = ["soft collision", "almost forever", "pink noise", "the way you stay", "two orbits", "after midnight", "ordinary magic", "still us"];

function fitCanvas(canvas) {
  const r = canvas.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(r.width * dpr));
  canvas.height = Math.max(1, Math.round(r.height * dpr));
  return { w:r.width, h:r.height, dpr };
}

function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s += 0x6D2B79F5;
    let t = s;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function drawRandomArt() {
  const {w,h,dpr} = fitCanvas(artCanvas);
  actx.setTransform(dpr,0,0,dpr,0,0);
  const rng = seededRandom(Date.now() + artCount * 7919);
  const pal = palettes[Math.floor(rng()*palettes.length)];
  const bg = actx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,pal[0]); bg.addColorStop(1,"#24101f");
  actx.fillStyle = bg; actx.fillRect(0,0,w,h);

  actx.globalCompositeOperation = "screen";
  for(let i=0;i<36;i++){
    const x=rng()*w,y=rng()*h,rx=35+rng()*w*.24,ry=25+rng()*h*.24,rot=rng()*Math.PI;
    actx.save(); actx.translate(x,y); actx.rotate(rot); actx.scale(1,ry/rx);
    const g=actx.createRadialGradient(0,0,0,0,0,rx);
    g.addColorStop(0,pal[1+Math.floor(rng()*(pal.length-1))]+"bb");
    g.addColorStop(.45,pal[1+Math.floor(rng()*(pal.length-1))]+"55");
    g.addColorStop(1,"transparent");
    actx.fillStyle=g; actx.beginPath(); actx.arc(0,0,rx,0,Math.PI*2); actx.fill(); actx.restore();
  }

  actx.globalCompositeOperation="source-over";
  for(let i=0;i<11;i++){
    actx.beginPath();
    const y=rng()*h;
    actx.moveTo(-30,y);
    for(let x=0;x<=w+30;x+=20){
      const yy=y+Math.sin(x*(.007+rng()*.008)+rng()*6)*35 + (rng()-.5)*40;
      actx.lineTo(x,yy);
    }
    actx.strokeStyle = pal[2]+"55";
    actx.lineWidth = 1+rng()*3;
    actx.stroke();
  }

  // abstract heart contour, deliberately imperfect
  actx.save();
  actx.translate(w*(.35+rng()*.3), h*(.35+rng()*.3));
  actx.rotate((rng()-.5)*.35);
  actx.scale(Math.min(w,h)*.009, Math.min(w,h)*.009);
  actx.beginPath();
  for(let a=0;a<=Math.PI*2;a+=.02){
    const x=16*Math.sin(a)**3;
    const y=13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a);
    if(a===0) actx.moveTo(x,-y); else actx.lineTo(x,-y);
  }
  actx.strokeStyle="rgba(255,245,249,.38)";
  actx.lineWidth=.22;
  actx.stroke(); actx.restore();

  artCount++;
  $("#artName").textContent = `${artNames[Math.floor(rng()*artNames.length)]} #${String(artCount).padStart(2,"0")}`;
  $("#artNext").classList.remove("hidden");
}
$("#regenerateArt").addEventListener("click", () => {
  drawRandomArt();
  burst(innerWidth * .68, innerHeight * .58, 9);
});
$("#artNext").addEventListener("click", () => showScene(3));

const artWrap = document.querySelector(".canvas-wrap");
artWrap.addEventListener("pointermove", e => {
  const r=artWrap.getBoundingClientRect();
  artWrap.style.setProperty("--art-x", `${((e.clientX-r.left)/r.width)*100}%`);
  artWrap.style.setProperty("--art-y", `${((e.clientY-r.top)/r.height)*100}%`);
});

/* Scratch */
const sc = $("#scratchCanvas"), sctx = sc.getContext("2d");
let scratching=false, scratchUnlocked=false, scratchChecks=0;
function setupScratch() {
  if (scratchUnlocked) return;
  const {w,h,dpr}=fitCanvas(sc);
  sctx.setTransform(dpr,0,0,dpr,0,0);
  const g=sctx.createLinearGradient(0,0,w,h);
  g.addColorStop(0,"#31203a");g.addColorStop(.5,"#69506f");g.addColorStop(1,"#261a31");
  sctx.globalCompositeOperation="source-over";sctx.fillStyle=g;sctx.fillRect(0,0,w,h);
  for(let i=0;i<1100;i++){sctx.fillStyle=`rgba(255,255,255,${Math.random()*.06})`;sctx.fillRect(Math.random()*w,Math.random()*h,1,1)}
  sctx.fillStyle="rgba(255,255,255,.75)";sctx.font="600 14px DM Sans";sctx.textAlign="center";sctx.fillText("scratch me ✦",w/2,h/2);
}
function erase(e){
  const r=sc.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  sctx.globalCompositeOperation="destination-out";sctx.beginPath();sctx.arc(x,y,38,0,Math.PI*2);sctx.fill();
  if((++scratchChecks)%7===0) checkScratch();
}
function checkScratch(){
  const sampleW=Math.min(sc.width,220), sampleH=Math.min(sc.height,120);
  const tmp=document.createElement("canvas");tmp.width=sampleW;tmp.height=sampleH;
  const t=tmp.getContext("2d");t.drawImage(sc,0,0,sampleW,sampleH);
  const data=t.getImageData(0,0,sampleW,sampleH).data;
  let clear=0,total=data.length/4;
  for(let i=3;i<data.length;i+=4) if(data[i]<20) clear++;
  const pct=clear/total;
  $("#scratchMeter").style.width=`${Math.min(100,pct*180)}%`;
  if(pct>.42&&!scratchUnlocked){scratchUnlocked=true;$("#scratchNext").classList.remove("hidden");burst(innerWidth/2,innerHeight*.62,14)}
}
sc.addEventListener("pointerdown",e=>{scratching=true;sc.setPointerCapture?.(e.pointerId);erase(e)});
sc.addEventListener("pointermove",e=>{if(scratching)erase(e)});
["pointerup","pointercancel"].forEach(ev=>sc.addEventListener(ev,()=>{scratching=false;checkScratch()}));
$("#scratchNext").addEventListener("click",()=>showScene(4));

/* Hold */
const hp=$("#holdProgress"), holdText=$("#holdText"), holdOrb=$("#holdOrb");
const circ=2*Math.PI*53;hp.style.strokeDasharray=circ;hp.style.strokeDashoffset=circ;
let hStart=0,hFrame=null,hDone=false;
function hTick(now){
  const p=Math.min((now-hStart)/1700,1);hp.style.strokeDashoffset=circ*(1-p);holdText.textContent=p<1?`${Math.round(p*100)}%`:"opened";
  if(p>=1){hDone=true;$("#lockedMessage").classList.add("open");$("#holdNext").classList.remove("hidden");burst(innerWidth/2,innerHeight*.56,18);navigator.vibrate?.([25,35,55]);return}
  hFrame=requestAnimationFrame(hTick);
}
holdOrb.addEventListener("pointerdown",e=>{e.preventDefault();if(hDone)return;hStart=performance.now();hFrame=requestAnimationFrame(hTick)});
["pointerup","pointercancel","pointerleave"].forEach(ev=>holdOrb.addEventListener(ev,()=>{if(hDone)return;cancelAnimationFrame(hFrame);hp.style.strokeDashoffset=circ;holdText.textContent="press & hold"}));
$("#holdNext").addEventListener("click",()=>showScene(5));

/* Wrapped */
const wrappedData=[
  ["OUR FAVORITE ERA", ()=>"US", "still my favorite plot twist.","#ff7da5","#260b19"],
  ["MOST USED PHRASE", ()=>"“where are you?”","followed closely by “what do you want to eat?”","#201321","#fff8fb"],
  ["FAVORITE PERSON", ()=>"#01","no competition detected.","#f4e7ed","#2a1020"],
  ["TIMES I'D CHOOSE YOU AGAIN", ()=>"∞","calculator stopped working after that.","#a985ec","#1c0b28"]
];
let wrapIndex=0;
function renderWrap(){
  const d=wrappedData[wrapIndex],card=$("#wrappedCard");card.style.background=d[3];card.style.color=d[4];
  $("#wrappedCount").textContent=`${String(wrapIndex+1).padStart(2,"0")} / 04`;$("#wrapLabel").textContent=d[0];$("#wrapValue").textContent=d[1]();$("#wrapCaption").textContent=d[2];
}
renderWrap();
$("#wrapNextCard").addEventListener("click",()=>{if(wrapIndex<3){wrapIndex++;renderWrap();$("#wrappedCard").animate([{transform:"translateX(16px)",opacity:.65},{transform:"translateX(0)",opacity:1}],{duration:320})}if(wrapIndex===3){$("#wrapNextCard").textContent="all stats viewed ♡";$("#wrappedNext").classList.remove("hidden")}});
$("#wrappedNext").addEventListener("click",()=>showScene(6));


/* Wrapped card parallax */
const wrappedCardNode = $("#wrappedCard");
if (matchMedia("(pointer:fine)").matches) {
  wrappedCardNode.addEventListener("pointermove", e => {
    const r=wrappedCardNode.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    wrappedCardNode.style.transform=`perspective(900px) rotateY(${x*7}deg) rotateX(${-y*6}deg) translateY(-3px)`;
  });
  wrappedCardNode.addEventListener("pointerleave", () => {
    wrappedCardNode.style.transform="";
  });
}

/* Global ambient particles */
const ambientCanvas = $("#ambientCanvas");
const ambientCtx = ambientCanvas.getContext("2d");
let ambientW=0, ambientH=0, ambientDpr=1, ambientParticles=[];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

function resizeAmbient(){
  ambientDpr=Math.min(devicePixelRatio||1,2);
  ambientW=innerWidth;ambientH=innerHeight;
  ambientCanvas.width=Math.max(1,Math.round(ambientW*ambientDpr));
  ambientCanvas.height=Math.max(1,Math.round(ambientH*ambientDpr));
  ambientCanvas.style.width=ambientW+"px";
  ambientCanvas.style.height=ambientH+"px";
  ambientCtx.setTransform(ambientDpr,0,0,ambientDpr,0,0);
  const count=Math.max(26,Math.min(78,Math.round((ambientW*ambientH)/18000)));
  ambientParticles=Array.from({length:count},()=>({
    x:Math.random()*ambientW,y:Math.random()*ambientH,
    r:.45+Math.random()*1.45,
    vx:(Math.random()-.5)*.085,vy:-.02-Math.random()*.11,
    a:.12+Math.random()*.58,
    phase:Math.random()*Math.PI*2,
    warm:Math.random()>.62
  }));
}
function drawAmbient(t=0){
  ambientCtx.clearRect(0,0,ambientW,ambientH);
  for(const p of ambientParticles){
    if(!reduceMotion){
      p.x+=p.vx+Math.sin(t*.00035+p.phase)*.025;
      p.y+=p.vy;
      if(p.y<-8){p.y=ambientH+8;p.x=Math.random()*ambientW}
      if(p.x<-8)p.x=ambientW+8;if(p.x>ambientW+8)p.x=-8;
    }
    const pulse=.65+.35*Math.sin(t*.0012+p.phase);
    ambientCtx.beginPath();
    ambientCtx.arc(p.x,p.y,p.r*(1+pulse*.15),0,Math.PI*2);
    ambientCtx.fillStyle=p.warm?`rgba(255,168,196,${p.a*pulse})`:`rgba(224,208,255,${p.a*pulse})`;
    ambientCtx.fill();
  }
  if(!reduceMotion) requestAnimationFrame(drawAmbient);
}
resizeAmbient();
drawAmbient();

/* Countdown */
$("#countdownTitle").textContent=CONFIG.countdownTitle;
let lastSecond = "";
function tickCountdown(){
  let diff=Math.max(0,new Date(CONFIG.countdownTarget)-new Date());
  $("#cdDays").textContent=String(Math.floor(diff/86400000)).padStart(3,"0");
  $("#cdHours").textContent=String(Math.floor(diff/3600000)%24).padStart(2,"0");
  $("#cdMinutes").textContent=String(Math.floor(diff/60000)%60).padStart(2,"0");
  const sec=String(Math.floor(diff/1000)%60).padStart(2,"0");
  $("#cdSeconds").textContent=sec;
  if(sec!==lastSecond){
    const cell=$("#cdSeconds").parentElement;
    cell.classList.remove("tick"); void cell.offsetWidth; cell.classList.add("tick");
    lastSecond=sec;
  }
}
tickCountdown();setInterval(tickCountdown,1000);
$("#wishBtn").addEventListener("click",()=>{$("#wishCopy").textContent="wish accepted by the universe ♡";$("#countdownNext").classList.remove("hidden");burst(innerWidth/2,innerHeight*.62,20)});
$("#countdownNext").addEventListener("click",()=>showScene(7));

/* Do you love me */
let noCount=0;
function dodge(){
  noCount++;const f=$("#answerField").getBoundingClientRect(),b=$("#noBtn"),br=b.getBoundingClientRect();
  const x=8+Math.random()*Math.max(10,f.width-br.width-20),y=8+Math.random()*Math.max(10,f.height-br.height-18);
  b.style.left=x+"px";b.style.top=y+"px";b.style.transform="none";
  b.textContent=["are you sure? 🤨","wrong answer","nice try","absolutely not","button unavailable"][Math.min(noCount-1,4)];
}
["pointerenter","pointerdown"].forEach(ev=>$("#noBtn").addEventListener(ev,dodge));
$("#yesBtn").addEventListener("click",()=>{$("#yesResult").classList.add("open");$("#questionNext").classList.remove("hidden");burst(innerWidth/2,innerHeight*.55,30);navigator.vibrate?.([20,20,30])});
$("#questionNext").addEventListener("click",()=>showScene(8));

/* Calculator */
function hashPair(a,b){const s=[a.trim().toLowerCase(),b.trim().toLowerCase()].sort().join("|");let h=2166136261;for(const ch of s){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return 63+(Math.abs(h)%38)}
function special(a,b){return [a.toLowerCase(),b.toLowerCase()].sort().join("|")===[...CONFIG.specialPair].map(x=>x.toLowerCase()).sort().join("|")}
function animateScore(target){const el=$("#score"),st=performance.now();function f(n){const p=Math.min((n-st)/720,1),e=1-(1-p)**3;el.textContent=Math.round(target*e);if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
$("#calcBtn").addEventListener("click",()=>{
  const a=$("#nameOne").value.trim(),b=$("#nameTwo").value.trim();if(!a||!b){$("#calcTitle").textContent="Two names, please.";$("#calcCopy").textContent="Even fake science needs a little data.";return}
  const score=special(a,b)?100:hashPair(a,b);animateScore(score);
  const scoreNode=$("#score").parentElement;scoreNode.classList.remove("calculated");void scoreNode.offsetWidth;scoreNode.classList.add("calculated");
  let title,copy;if(score===100){title="Calculation failed.";copy="Apparently these two are unfairly compatible."}else if(score>=92){title="Main-character chemistry.";copy="The algorithm is genuinely concerned about how cute this is."}else if(score>=82){title="Very dangerous chemistry.";copy="Proceed with honesty, snacks, and unreasonable amounts of affection."}else if(score>=72){title="Strong signal detected.";copy="The universe recommends more time together."}else{title="The calculator is shy.";copy="Numbers are terrible at measuring love anyway."}
  $("#calcTitle").textContent=title;$("#calcCopy").textContent=`${a} + ${b}: ${copy}`;$("#calcNext").classList.remove("hidden");burst(innerWidth/2,innerHeight*.68,14)
});
$("#calcNext").addEventListener("click",()=>showScene(9));

/* Final */
$("#envelope").addEventListener("click",()=>{$("#envelope").classList.add("open");setTimeout(()=>$("#finalLetter").classList.add("open"),430);setTimeout(()=>burst(innerWidth/2,innerHeight*.56,28),650)});
$("#restartBtn").addEventListener("click",()=>location.reload());

/* Particles */
const layer=$("#particles");
function burst(x,y,n=12){for(let i=0;i<n;i++){const p=document.createElement("span");p.className="particle";p.textContent=Math.random()>.45?"♡":"✦";p.style.left=(x+(Math.random()-.5)*45)+"px";p.style.top=(y+(Math.random()-.5)*25)+"px";p.style.fontSize=(12+Math.random()*15)+"px";p.style.setProperty("--x",((Math.random()-.5)*180)+"px");p.style.setProperty("--y",(70+Math.random()*160)+"px");p.style.setProperty("--r",((Math.random()-.5)*90)+"deg");layer.appendChild(p);setTimeout(()=>p.remove(),1700)}}

/* Resize only active visual tools */
let resizeTimer;
addEventListener("resize",()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{
  resizeAmbient();
  if(screens[current].dataset.scene==="art")drawRandomArt();
  if(screens[current].dataset.scene==="scratch"&&!scratchUnlocked)setupScratch();
},180)});
