'use strict';
// The document provides scroll distance; the stage itself never leaves the viewport.
(() => {
 const scenes=[...document.querySelectorAll('.story-scene')];
 if(!scenes.length)return;
 const desktop=matchMedia('(min-width: 1024px) and (min-height: 560px)');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const buttons=[...document.querySelectorAll('[data-scene]')];
 let enabled=false,scheduled=false,current=-1;
 const clamp=x=>Math.min(1,Math.max(0,x));
 function render(){
  scheduled=false;if(!enabled)return;
  const position=Math.min(scenes.length-1,Math.max(0,scrollY/innerHeight));
  const base=Math.floor(position),blend=clamp((position-base-.2)/.8);
  const active=blend>.5?Math.min(base+1,scenes.length-1):base;
  scenes.forEach((scene,i)=>{
   const weight=i===base?1-blend:i===base+1?blend:0;
   scene.classList.toggle('is-visible',weight>0);scene.classList.toggle('is-active',i===active);
   scene.style.opacity=String(weight);scene.style.transform=`translateY(${i===base?-blend*35:(1-blend)*45}px)`;
   scene.inert=i!==active;scene.setAttribute('aria-hidden',String(i!==active));
   [...scene.children].forEach((child,j)=>{const reveal=i===base?1:clamp(blend*1.8-j*.12);child.style.opacity=String(reveal);child.style.transform=`translateY(${(1-reveal)*(25+j*8)}px)`;});
  });
  document.documentElement.style.setProperty('--story-progress',position/(scenes.length-1));
  if(active!==current){current=active;buttons.forEach((b,i)=>{if(i===active)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});document.querySelector('.scene-count').textContent=String(active+1).padStart(2,'0')+' / 06';}
 }
 function requestRender(){if(!scheduled){scheduled=true;requestAnimationFrame(render);}}
 function go(index,behavior='smooth'){if(enabled)scrollTo({top:index*innerHeight,behavior});else scenes[index].scrollIntoView({behavior:reduced.matches?'instant':behavior});}
 function hashScene(){const index=scenes.findIndex(s=>'#'+s.id===location.hash);if(index>=0)go(index,'instant');}
 function configure(){
  const next=desktop.matches&&!reduced.matches;
  if(next===enabled){requestRender();return;}
  enabled=next;document.body.classList.toggle('stage-on',enabled);
  if(enabled){document.body.style.height=scenes.length*100+'vh';hashScene();render();}
  else{document.body.style.height='';scenes.forEach(s=>{s.inert=false;s.removeAttribute('aria-hidden');s.classList.remove('is-visible','is-active');s.style.opacity='';s.style.transform='';[...s.children].forEach(c=>{c.style.opacity='';c.style.transform='';});});}
 }
 buttons.forEach((b,i)=>b.addEventListener('click',()=>{history.pushState(null,'','#'+scenes[i].id);go(i);}));
 document.addEventListener('click',event=>{const a=event.target.closest('a[href^="#"]');if(!a||!enabled)return;const hash=a.getAttribute('href');const i=hash==='#'?0:scenes.findIndex(s=>'#'+s.id===hash);if(i>=0){event.preventDefault();history.pushState(null,'','#'+scenes[i].id);go(i);}});
 addEventListener('scroll',requestRender,{passive:true});addEventListener('resize',configure);
 addEventListener('hashchange',hashScene);addEventListener('popstate',hashScene);
 desktop.addEventListener('change',configure);reduced.addEventListener('change',configure);
 configure();
})();
