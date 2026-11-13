// Layout controls do not change simulation state or command availability.
export function setupCompactUI(doc,win){
  const get=id=>doc.getElementById(id);
  const play=get('play-panel'),drawer=get('secondary-panel'),scrim=get('details-scrim');
  const buttons=[get('tab-harm'),get('tab-care')];
  let returnFocus=null;
  function selectTab(index){
    play.setAttribute('data-command-tab',index===0?'harm':'care');
    buttons.forEach((button,i)=>{button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;});
  }
  function setOpen(open){
    if(open)returnFocus=doc.activeElement;
    drawer.classList[open?'add':'remove']('is-open');
    scrim.hidden=!open;
    play.inert=open;
    get('open-details').setAttribute('aria-expanded',String(open));
    if(open){drawer.setAttribute('role','dialog');drawer.setAttribute('aria-modal','true');drawer.setAttribute('aria-labelledby','details-title');get('close-details').focus();}
    else{drawer.removeAttribute?.('role');drawer.removeAttribute?.('aria-modal');if(returnFocus){returnFocus.focus();returnFocus=null;}}
  }
  buttons.forEach((button,index)=>{
    button.onclick=()=>selectTab(index);
    button.onkeydown=event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      const next=event.key==='Home'?0:event.key==='End'?1:1-index;
      selectTab(next);buttons[next].focus();
    };
  });
  get('open-details').onclick=()=>setOpen(true);
  get('close-details').onclick=()=>setOpen(false);
  scrim.onclick=()=>setOpen(false);
  for(const id of ['choose','reset'])get(id).addEventListener('click',()=>setOpen(false));
  doc.addEventListener('keydown',event=>{if(event.key==='Escape'&&!scrim.hidden)setOpen(false);});
  win.matchMedia?.('(max-width:850px)').addEventListener('change',event=>{if(!event.matches)setOpen(false);});
  selectTab(0);
}
