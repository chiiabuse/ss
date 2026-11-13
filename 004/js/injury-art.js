// Visual stages depend only on existing physical damage, never on mood or action count.
export function injuryStage(damage){
  if(!Number.isFinite(damage))return 0;
  return damage>=65?3:damage>=35?2:damage>=10?1:0;
}
export function injurySVG(stage,region){
  if(![1,2,3].includes(stage))return '';
  const red='injury-'+region+'-red',purple='injury-'+region+'-purple';
  const patch=(x,y,rx,ry,color)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="url(#'+color+')"/>';
  let marks=region==='head'
    ?patch(125,44,17,10,red)
    :patch(59,175,16,12,red)+patch(143,181,13,10,purple);
  let scratches=region==='head'?'M111 34 l8 -5 M115 40 l9 -5':'';
  if(stage>=2){
    marks+=region==='head'?patch(28,69,10,9,red):patch(44,157,10,9,red);
    if(region==='body')scratches+='M83 188 l9 -6 M88 194 l9 -6';
  }
  if(stage>=3){
    marks+=region==='head'?patch(65,39,12,8,purple)+patch(179,74,10,11,red):patch(122,163,14,10,red);
    scratches+=region==='head'?' M57 39 l6 -4 M61 44 l6 -4':' M149 163 l7 -5 M153 169 l7 -5';
  }
  return '<g data-injury="'+region+'" data-stage="'+stage+'" stroke="none" opacity="'+[0,.72,.85,.98][stage]+'"><defs><radialGradient id="'+red+'"><stop stop-color="#bc5f67" stop-opacity=".68"/><stop offset=".6" stop-color="#d78890" stop-opacity=".42"/><stop offset="1" stop-color="#e4a4ab" stop-opacity="0"/></radialGradient><radialGradient id="'+purple+'"><stop stop-color="#8b6e99" stop-opacity=".6"/><stop offset=".6" stop-color="#ae91b5" stop-opacity=".35"/><stop offset="1" stop-color="#c6adca" stop-opacity="0"/></radialGradient></defs>'+marks+(scratches?'<path d="'+scratches+'" fill="none" stroke="#946363" stroke-width="1.4" stroke-linecap="round"/>':'')+'</g>';
}
