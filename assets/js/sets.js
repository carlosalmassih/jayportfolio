'use strict';
const setGrid=document.querySelector('#sets-grid');
const setList=Array.isArray(window.JAY_SETS)?window.JAY_SETS:[];
if(setGrid&&setList.length){
 setGrid.replaceChildren();document.querySelector('.set-filters').hidden=false;
 setList.forEach(set=>{
 if(!/^[A-Za-z0-9_-]{11}$/.test(set.id))return;
 const card=document.createElement('article');card.className='set-card';card.dataset.type=set.type;
 const media=document.createElement('div');media.className='set-media';
 const button=document.createElement('button');button.type='button';button.className='set-play';button.setAttribute('aria-label','Load player for '+set.title);
 const thumb=document.createElement('img');thumb.src='https://i.ytimg.com/vi/'+set.id+'/hqdefault.jpg';thumb.alt='';thumb.loading='lazy';thumb.addEventListener('error',()=>thumb.remove());
 const play=document.createElement('span');play.className='play-mark';play.textContent='▶';play.setAttribute('aria-hidden','true');
 const label=document.createElement('span');label.className='play-label';label.textContent='Watch set';button.append(thumb,play,label);media.append(button);
 button.addEventListener('click',()=>{
  // Stop any other player when starting a new set.
  document.querySelectorAll('.set-media iframe').forEach(frame=>{const previous=frame.parentElement;frame.remove();previous.querySelector('button').hidden=false;});
  const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+set.id+'?autoplay=1&playsinline=1&rel=0';frame.title=set.title+' — YouTube player';frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';button.hidden=true;media.append(frame);frame.focus();
 });
 const meta=document.createElement('p');meta.className='release-meta';meta.textContent=(set.type==='live'?'Live performance':'Recorded set')+' / '+set.duration;
 const heading=document.createElement('h2');heading.textContent=set.title;
 const link=document.createElement('a');link.href='https://www.youtube.com/watch?v='+set.id;link.target='_blank';link.rel='noopener';link.className='text-link';link.textContent='Watch on YouTube ↗';
 card.append(media,meta,heading,link);setGrid.append(card);
 });
 const count=document.querySelector('#set-count');count.textContent=setGrid.children.length+' sets';
 document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
  let visible=0;setGrid.querySelectorAll('.set-card').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.type!==button.dataset.filter;if(!card.hidden)visible++;else{const frame=card.querySelector('iframe');if(frame){frame.remove();card.querySelector('.set-play').hidden=false;}}});count.textContent=visible+' sets';
 }));
}
