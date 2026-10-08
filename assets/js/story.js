'use strict';
(() => {
 const scenes=[...document.querySelectorAll('.story-scene')];if(!scenes.length)return;
 const desktop=matchMedia('(min-width:1024px) and (min-height:560px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const buttons=[...document.querySelectorAll('[data-scene]')],header=document.querySelector('header'),title=document.querySelector('#hero-title');
 const clamp=x=>Math.min(1,Math.max(0,x)),ease=x=>1-Math.pow(1-clamp(x),3),range=(p,a,b)=>ease((p-a)/(b-a));
 const span=1.65;let enabled=false,scheduled=false,current=-1,titleOffset={x:0,y:0};
 const timelines=scenes.map(()=>[]);
 function add(index,selector,start,end,kind='rise'){scenes[index].querySelectorAll(selector).forEach(el=>timelines[index].push({el,start,end,kind}));}
 add(0,'.hero-photo',.15,.46,'portrait');add(0,'.hero-copy>.eyebrow',.28,.45);add(0,'.tag',.36,.55);add(0,'.intro-copy',.45,.64);add(0,'.hero-copy>.button',.56,.73);add(0,'.hero-watermark',.45,.75,'soft');
 add(1,'.section-label',0,.16);add(1,'h2',.06,.25,'mask');add(1,'.bio-columns p:first-child',.2,.4);add(1,'.bio-columns p:last-child',.3,.5);add(1,'.facts>div:first-child',.4,.58);add(1,'.facts>div:last-child',.48,.66);add(1,'.countries',.55,.73);
 add(2,'.section-heading>div',0,.23,'mask');add(2,'.section-heading>.text-link',.14,.33);add(2,'.track-controls',.22,.4);scenes[2].querySelectorAll('.track-card').forEach((el,i)=>timelines[2].push({el,start:.22+i*.12,end:.46+i*.12,kind:'card'}));
 add(3,'.section-heading>div',0,.22,'mask');add(3,'.section-heading>.venue-links',.12,.3);scenes[3].querySelectorAll('.venue-region').forEach((group,g)=>{timelines[3].push({el:group.querySelector('h3'),start:.15+g*.08,end:.3+g*.08,kind:'rise'});group.querySelectorAll('li').forEach((el,i)=>timelines[3].push({el,start:.23+g*.07+i*.035,end:.38+g*.07+i*.035,kind:'side'}));});
 add(4,'.sets-copy>.eyebrow',0,.15);add(4,'.sets-copy>h2',.08,.32,'mask');add(4,'.sets-copy>p:not(.eyebrow)',.3,.5);add(4,'.sets-copy>.button',.5,.7);add(4,'.set-feature',.18,.65,'record');
 add(5,'.contact-intro>.eyebrow',0,.15);add(5,'.contact-intro>h2',.08,.3,'mask');add(5,'.contact-intro>p:not(.eyebrow)',.24,.44);add(5,'.contact-location',.4,.6);add(5,'.contact-panel',.3,.72,'side');
 const all=timelines.flat().map(t=>t.el);
 function apply(item,p,index){
  const enter=range(p,item.start,item.end),exit=index===scenes.length-1?0:range(p,.84+item.start*.05,.985),visible=enter*(1-exit),el=item.el;
  el.style.opacity=String(visible);el.style.visibility=visible<.002?'hidden':'visible';el.inert=visible<.05;
  let x=item.kind==='side'?(1-enter)*45:0,y=(1-enter)*36-exit*45,scale=1,rotate=0;
  if(item.kind==='portrait'){x=(1-enter)*65;y=0;scale=1.08-(enter*.08);}
  if(item.kind==='card'){y=(1-enter)*70-exit*65;rotate=(1-enter)*3;scale=.96+.04*enter;}
  if(item.kind==='record'){rotate=-35*(1-enter);scale=.75+.25*enter;y=0;}
  el.style.transform=`translate3d(${x}px,${y}px,0) scale(${scale}) rotate(${rotate}deg)`;
  el.style.clipPath=item.kind==='mask'||item.kind==='portrait'?`inset(${(1-enter)*100}% 0 0 0)`:'none';
 }
 function render(){
  scheduled=false;if(!enabled)return;
  const position=Math.min(scenes.length,Math.max(0,scrollY/(innerHeight*span))),active=Math.min(scenes.length-1,Math.floor(position)),p=position-active;
  scenes.forEach((scene,i)=>{const on=i===active;scene.classList.toggle('is-visible',on);scene.classList.toggle('is-active',on);scene.style.opacity=on?'1':'0';scene.style.transform='none';scene.inert=!on;scene.setAttribute('aria-hidden',String(!on));if(on)timelines[i].forEach(t=>apply(t,p,i));});
  if(active===0){const settle=range(p,.03,.32),exit=range(p,.85,.985);title.style.transform=`translate3d(${titleOffset.x*(1-settle)}px,${titleOffset.y*(1-settle)-exit*60}px,0) scale(${1.12-.12*settle})`;title.style.opacity=String(1-exit);}
  const chrome=range(position,.09,.25);header.style.opacity=String(chrome);header.style.visibility=chrome<.002?'hidden':'visible';header.inert=chrome<.1;
  document.querySelector('.story-controls nav').style.opacity=String(chrome);document.querySelector('.story-controls nav').inert=chrome<.1;document.querySelector('.scene-count').style.opacity=String(chrome);
  document.documentElement.style.setProperty('--story-progress',position/scenes.length);
  if(active!==current){current=active;buttons.forEach((b,i)=>{if(i===active)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});document.querySelector('.scene-count').textContent=String(active+1).padStart(2,'0')+' / 06';}
 }
 function requestRender(){if(!scheduled){scheduled=true;requestAnimationFrame(render);}}
 function go(index,behavior='smooth'){if(enabled)scrollTo({top:(index===0?0:index+.76)*innerHeight*span,behavior});else scenes[index].scrollIntoView({behavior:reduced.matches?'instant':behavior});}
 function hashScene(){const i=scenes.findIndex(s=>'#'+s.id===location.hash);if(i>=0)go(i,'instant');}
 function measure(){title.style.transform='none';const r=title.getBoundingClientRect(),m=document.querySelector('#main').getBoundingClientRect();titleOffset={x:innerWidth/2-r.left-r.width/2,y:m.top+m.height/2-r.top-r.height/2};}
 function clear(el){el.style.opacity='';el.style.transform='';el.style.visibility='';el.style.clipPath='';el.inert=false;}
 function configure(){
  const next=desktop.matches&&!reduced.matches,changed=next!==enabled;enabled=next;document.body.classList.toggle('stage-on',enabled);
  if(enabled){document.body.style.height=(scenes.length*span+1)*100+'vh';measure();if(changed)hashScene();render();}
  else{document.body.style.height='';scenes.forEach(s=>{clear(s);s.removeAttribute('aria-hidden');s.classList.remove('is-visible','is-active');});all.forEach(clear);clear(title);clear(header);clear(document.querySelector('.story-controls nav'));clear(document.querySelector('.scene-count'));}
 }
 buttons.forEach((b,i)=>b.addEventListener('click',()=>{history.pushState(null,'','#'+scenes[i].id);go(i);}));
 document.addEventListener('click',event=>{const a=event.target.closest('a[href^="#"]');if(!a||!enabled)return;const hash=a.getAttribute('href'),i=hash==='#'?0:scenes.findIndex(s=>'#'+s.id===hash);if(i>=0){event.preventDefault();history.pushState(null,'','#'+scenes[i].id);go(i);}});
 addEventListener('scroll',requestRender,{passive:true});addEventListener('resize',configure);addEventListener('hashchange',hashScene);addEventListener('popstate',hashScene);desktop.addEventListener('change',configure);reduced.addEventListener('change',configure);configure();
})();
