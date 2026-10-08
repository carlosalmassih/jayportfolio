'use strict';
(() => {
 const links=[...document.querySelectorAll('.archive-photo')],dialog=document.querySelector('.archive-lightbox');
 const image=document.querySelector('#lightbox-image'),caption=document.querySelector('#lightbox-caption'),count=document.querySelector('#lightbox-count');
 const previous=document.querySelector('#photo-prev'),next=document.querySelector('#photo-next'),openPhoto=document.querySelector('#photo-open');
 let collection=[],position=0,trigger=null;
 function show(){const link=collection[position];image.src=link.href;image.alt=link.querySelector('img').alt;caption.textContent=link.dataset.caption;count.textContent=`${position+1} / ${collection.length}`;previous.disabled=position===0;next.disabled=position===collection.length-1;openPhoto.href=link.href;}
 links.forEach(link=>link.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();trigger=link;collection=links.filter(l=>l.dataset.collection===link.dataset.collection);position=collection.indexOf(link);show();dialog.showModal();document.body.classList.add('modal-open');}));
 previous.addEventListener('click',()=>{if(position>0){position--;show();}});next.addEventListener('click',()=>{if(position<collection.length-1){position++;show();}});
 dialog.querySelector('.lightbox-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{const b=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom))dialog.close();});
 dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();previous.click();}if(event.key==='ArrowRight'){event.preventDefault();next.click();}});
 dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(trigger)trigger.focus({preventScroll:true});});
 const filter=document.querySelector('#archive-select'),groups=[...document.querySelectorAll('.archive-collection')];document.querySelector('.archive-filter').hidden=false;
 filter.addEventListener('change',()=>{groups.forEach(g=>g.hidden=filter.value!=='all'&&g.id!==filter.value);const visible=groups.filter(g=>!g.hidden),photos=visible.reduce((n,g)=>n+g.querySelectorAll('.archive-photo').length,0);document.querySelector('#archive-count').textContent=`${photos} ${photos===1?'photo':'photos'} · ${visible.length} ${visible.length===1?'collection':'collections'}`;});
})();
