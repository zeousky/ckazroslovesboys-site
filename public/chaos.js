(()=>{
const videos=[...document.querySelectorAll('.corner-video')];
const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
let version=0;
const photos = ['bibi-portrait.jpg', 'bibi-throwback.jpg'].map(name => new URL('assets/' + name, document.baseURI).href);
const grid=document.getElementById('bibi-grid'),counter=document.getElementById('bibi-count');
let count=0;
function addBibis(amount){
 const captions=['BIBI.EXE','STILL BIBI','BONUS BIBI','SPIN DOCTOR','ONE MORE','BIBI AGAIN'];
 for(let j=0;j<amount&&count<60;j++){
  const figure=document.createElement('figure');figure.className='bibi-tile';figure.style.setProperty('--i',String(count));
  const image=document.createElement('img');image.src=photos[count%2];image.alt='Benjamin Netanyahu, Bibi number '+(count+1);image.loading='lazy';image.width=150;image.height=150;
  const caption=document.createElement('figcaption');caption.textContent=captions[count%captions.length]+' #'+String(count+1).padStart(2,'0');figure.append(image,caption);grid.append(figure);count++;
 }
 counter.textContent=count+' Bibis in containment. Situation: questionable.';
 if(count===60){document.getElementById('more-bibis').disabled=true;counter.textContent='60 Bibis. Maximum containment reached.';}
}
addBibis(24);document.getElementById('more-bibis').addEventListener('click',()=>addBibis(12));
for(let i=0;i<10;i++){
 const image=document.createElement('img');image.src=photos[i%2];image.alt='';image.className='flying-bibi';image.style.setProperty('--flight',(16+i%4*3)+'s');image.style.setProperty('--delay',(-i*2.9)+'s');image.style.setProperty('--lane',(8+i*9)+'%');document.getElementById('bibi-sky').append(image);
}
// Two identical halves make the conveyor loop without a jump.
for(let i=0;i<24;i++){const image=document.createElement('img');image.src=photos[i%2];image.alt='';document.getElementById('bibi-train').append(image);}
const clipSound = document.getElementById('clip-sound');
const motion = document.getElementById('motion');

function mute() {
  version += 1;
  videos[0].muted = true;
  clipSound.setAttribute('aria-pressed', 'false');
}

function isPaused() {
  return document.body.classList.contains('paused') || preference.matches;
}

function syncMotion() {
  const paused = isPaused();
  motion.setAttribute('aria-pressed', String(paused));
  motion.textContent = preference.matches ? 'Reduced motion on' : 'Pause motion';
  motion.disabled = preference.matches;
  clipSound.disabled = paused;
  if (paused || document.hidden) {
    mute();
    for (const video of videos) video.pause();
    return;
  }
  for (const video of videos) void video.play().catch(() => {});
}

clipSound.addEventListener('click', async () => {
  if (isPaused()) return;
  if (!videos[0].muted) {
    mute();
    return;
  }
  document.dispatchEvent(new Event('stop-site-audio'));
  const attempt = ++version;
  const [primary] = videos;
  primary.volume = 0.55;
  primary.muted = false;
  try {
    await primary.play();
    if (attempt === version) clipSound.setAttribute('aria-pressed', 'true');
  } catch {
    if (attempt === version) mute();
  }
});

document.getElementById('start-alarm').addEventListener('click', () => {
  mute();
  document.dispatchEvent(new Event('stop-site-audio'));
  document.dispatchEvent(new Event('start-alarms'));
});
motion.addEventListener('click', () => {
  document.body.classList.toggle('paused');
  if (isPaused()) document.dispatchEvent(new Event('stop-site-audio'));
  syncMotion();
});
document.addEventListener('stop-clip-audio', mute);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    document.body.classList.add('paused');
    syncMotion();
  }
});
document.addEventListener('visibilitychange', syncMotion);
window.addEventListener('pagehide', () => {
  mute();
  for (const video of videos) video.pause();
});
preference.addEventListener('change', syncMotion);
syncMotion();
})();
