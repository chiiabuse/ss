import { individualStateWeight } from './individuality.js';

// Candidate order and weights are stable so a refactor does not change the draw.
export function idleStateCandidates(states,{emotions,individual,current,blanketPresent,distanceMode,night}){
  const {hate:h,satisfaction:s,fear:f}=emotions;
  const allowed=distanceMode==='neutral'?null:distanceMode==='hide'?['guard','look']:distanceMode==='protest'?['look','walk']:['look','walk','stretch'];
  return states.map((state,index)=>{
    const key=state.key;
    const weight=1+(key==='guard'||key==='wash'?f/15:0)+(key==='look'?h/15+f/30:0)+(key==='walk'?h/25:0)+(['crumb','stretch'].includes(key)?s/24:0)+(key==='blanket'?s/25+(night?2:0):0)+(key==='sleep'?(night?5:0)+(100-f)/45:0);
    return {index,weight:weight*individualStateWeight(key,individual)};
  }).filter(({index})=>index!==current&&(blanketPresent||!['blanket','sleep'].includes(states[index].key))&&(!allowed||allowed.includes(states[index].key)));
}
