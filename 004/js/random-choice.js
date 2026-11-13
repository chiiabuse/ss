export function chooseWeighted(items, random=Math.random, previousText){
  let candidates=items.filter(item=>item.text!==previousText);
  if(!candidates.length)candidates=items;
  if(!candidates.length)throw new Error('Cannot choose from an empty candidate list');
  let target=random()*candidates.reduce((sum,item)=>sum+item.weight,0);
  for(const item of candidates){target-=item.weight;if(target<0)return item;}
  return candidates[candidates.length-1];
}
