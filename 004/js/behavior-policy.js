import { individualStateWeight, traitFactor } from './individuality.js?v=20261113-f32e3f65f3';
import { distanceBehavior } from './distance-behavior.js?v=20261113-f32e3f65f3';
import { itemMomentSteps } from './item-attachment.js?v=20261113-f32e3f65f3';

const nightBehaviorRules={sleepProbability:.85,otherProbability:.15,nextActionDelay:1.5};

export function idleDistanceBehavior({emotions,baby,individual,night,blanketPresent}){
  const behavior=distanceBehavior(emotions,baby,individual);
  return night&&blanketPresent&&behavior.mode==='approach'?{mode:'neutral'}:behavior;
}
export function idleItemPlan({baby,toyPresent,pochettePresent,night,individual,itemAttachment}){
  const steps=itemMomentSteps(baby,toyPresent,pochettePresent).filter(step=>!night||step.type==='toySleep');
  return {
    probability:Math.min(.9,(night?.55:.3)*traitFactor(individual,'attachment',1)),
    candidates:steps.map(step=>({step,weight:step.type==='toySleep'?(night?4:1)+itemAttachment.kumacha/600:1+itemAttachment.pochette/600}))
  };
}
export function nightSleepTransition({night,blanketPresent,reaction,afterglow,despairActive,distanceMode,key,stateTime,duration}){
  const ready=night&&blanketPresent&&!reaction&&!afterglow&&!despairActive&&distanceMode==='neutral'&&key!=='sleep';
  return {ready,stateTime:ready?Math.max(stateTime,duration-nightBehaviorRules.nextActionDelay):stateTime};
}

// Candidate order and weights are stable so a refactor does not change the draw.
export function idleStateCandidates(states,{emotions,individual,current,blanketPresent,distanceMode,night}){
  const {hate:h,satisfaction:s,fear:f}=emotions;
  const allowed=distanceMode==='neutral'?null:distanceMode==='hide'?['guard','look']:distanceMode==='protest'?['look','walk']:['look','walk','stretch'];
  const candidates=states.map((state,index)=>{
    const key=state.key;
    const weight=1+(key==='guard'||key==='wash'?f/15:0)+(key==='look'?h/15+f/30:0)+(key==='walk'?h/25:0)+(['crumb','stretch'].includes(key)?s/24:0)+(key==='blanket'?s/25+(night?2:0):0)+(key==='sleep'?(night?5:0)+(100-f)/45:0);
    return {index,weight:weight*individualStateWeight(key,individual)};
  }).filter(({index})=>(index!==current||(night&&states[index].key==='sleep'))&&(blanketPresent||!['blanket','sleep'].includes(states[index].key))&&(!allowed||allowed.includes(states[index].key)));
  const sleep=night&&candidates.find(({index})=>states[index].key==='sleep');
  if(sleep){
    const otherWeight=candidates.reduce((total,item)=>total+(item===sleep?0:item.weight),0);
    if(otherWeight>0)sleep.weight=otherWeight*nightBehaviorRules.sleepProbability/nightBehaviorRules.otherProbability;
  }
  return candidates;
}
