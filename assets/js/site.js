'use strict';
const portrait=document.querySelector('.hero-photo');
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
portrait?.addEventListener('pointermove',event=>{
 if(motion.matches||!finePointer.matches)return;
 const r=portrait.getBoundingClientRect();const x=(event.clientX-r.left)/r.width;const y=(event.clientY-r.top)/r.height;
 portrait.style.setProperty('--tilt-x',`${(0.5-y)*7}deg`);
 portrait.style.setProperty('--tilt-y',`${(x-0.5)*9}deg`);
 portrait.style.setProperty('--light-x',`${x*100}%`);
 portrait.style.setProperty('--light-y',`${y*100}%`);
});
function resetPortrait(){if(!portrait)return;portrait.style.setProperty('--tilt-x','0deg');portrait.style.setProperty('--tilt-y','0deg');}
portrait?.addEventListener('pointerleave',resetPortrait);motion.addEventListener('change',resetPortrait);


// Keep native disclosures as a no-script fallback; enhance to top-layer dialogs.
document.querySelectorAll('.listen-picker').forEach(picker=>{
 const card=picker.closest('.track-card'),summary=picker.querySelector('summary'),panel=picker.querySelector('.listen-options');
 const dialog=document.createElement('dialog');dialog.className='song-dialog';
 const heading=panel.querySelector('h4');heading.id=card.id+'-title';dialog.setAttribute('aria-labelledby',heading.id);
 dialog.innerHTML=panel.innerHTML;document.body.append(dialog);
 const button=document.createElement('button');button.type='button';button.className='listen-button';button.textContent='Listen +';button.setAttribute('aria-label',summary.getAttribute('aria-label'));button.setAttribute('aria-haspopup','dialog');picker.replaceWith(button);
 function open(){dialog.showModal();document.body.classList.add('modal-open');}
 button.addEventListener('click',open);
 card.addEventListener('click',event=>{if(!event.target.closest('button,a')){button.focus({preventScroll:true});open();}});
 dialog.querySelector('.popup-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});
 dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');button.focus({preventScroll:true});});
 dialog.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const items=[...dialog.querySelectorAll('button,a[href]')],first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
});
const carousel=document.querySelector('.track-carousel');
document.querySelectorAll('[data-scroll]').forEach(button=>button.addEventListener('click',()=>carousel.scrollBy({left:Number(button.dataset.scroll)*(carousel.querySelector('.track-card').getBoundingClientRect().width+28),behavior:motion.matches?'instant':'smooth'})));
