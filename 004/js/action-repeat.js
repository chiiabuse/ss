import { actionIds, careIds } from './action-data.js';
import { repeatLimits } from './emotion-config.js';

function emptyRepeatStreak(){return {action:null,count:0,lastAt:0};}
export function readRepeatStreak(value,elapsed){
  if(!value||!actionIds.includes(value.action)||careIds.includes(value.action)||!Number.isFinite(value.count)||value.count<1||!Number.isFinite(value.lastAt)||value.lastAt<0||value.lastAt>elapsed||elapsed-value.lastAt>=repeatLimits.windowSeconds)return emptyRepeatStreak();
  return {action:value.action,count:Math.min(5,Math.floor(value.count)),lastAt:value.lastAt};
}
export function nextRepeatStreak(previous,action,elapsed){
  if(careIds.includes(action))return emptyRepeatStreak();
  const recent=readRepeatStreak(previous,elapsed);
  return {action,count:recent.action===action?Math.min(5,recent.count+1):1,lastAt:elapsed};
}
