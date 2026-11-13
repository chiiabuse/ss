// Register once; read buttons at key time so dynamic picker contents stay current.
export function bindDialogKeyboard(dialog,doc,getButtons,onEscape){
  dialog.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
      onEscape();
      return;
    }
    if(event.key!=='Tab')return;
    const buttons=getButtons(),first=buttons[0],last=buttons[buttons.length-1];
    if(!first)return;
    if(event.shiftKey&&doc.activeElement===first){
      event.preventDefault();
      last.focus();
    }else if(!event.shiftKey&&doc.activeElement===last){
      event.preventDefault();
      first.focus();
    }
  });
}
