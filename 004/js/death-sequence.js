import { kickTiming, kickFlightFrame } from './kick-motion.js?v=20261113-f32e3f65f3';
// Presentation only. Vital-state owns the irreversible death decision.
const fatalImpactRules={
  slap:{duration:.7,travelSeconds:.65,distance:42},
  poke:{duration:.45,travelSeconds:.45,distance:20},
  kick:{duration:kickTiming.duration}
};
export function createLethalImpact(action,{x,y,despairActive,kickFlight}){
  return {action,age:0,phase:0,originX:x,originY:y,pose:despairActive?'collapsed':'open',duration:fatalImpactRules[action].duration,...(kickFlight?{kickFlight}:{})};
}
export function advanceLethalImpact(impact,seconds){
  impact.age+=seconds;
  if(impact.action==='kick'){
    const complete=impact.age>=impact.duration-1e-9;
    return {...kickFlightFrame(impact.kickFlight,complete?kickTiming.duration:impact.age),complete};
  }
  const rule=fatalImpactRules[impact.action];
  const progress=Math.min(impact.age/rule.travelSeconds,1);
  return {
    x:impact.originX+Math.sin(progress*Math.PI/2)*rule.distance,
    complete:impact.age>=impact.duration-1e-9
  };
}
