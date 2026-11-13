import { traitFactor } from './individuality.js';
export function readAttachment(saved) {
  return Object.fromEntries(['kumacha','pochette'].map(key=>[key,Number.isFinite(saved?.[key])?Math.min(86400,Math.max(0,saved[key])):0]));
}
export function lossAttachmentScale(action, attachment, toyPresent, pochettePresent, individual=null) {
  const seconds=action==='toy'&&toyPresent?attachment.kumacha:action==='takePochette'&&pochettePresent?attachment.pochette:0;
  return 1+Math.min(.8,seconds/600*traitFactor(individual,'attachment',1.2));
}
export function itemMomentSteps(baby, hasToy, hasPochette) {
  const result=[];
  if(hasToy)result.push({type:'toySleep',duration:14,pose:'prone',face:'sleep',text:'クマのぬいぐるみをそばに引き寄せ、一緒に眠っている。',lines:['クマチャ……ネンネ……','……スゥ……']});
  if(hasPochette)result.push({type:'pochettePride',duration:7,pose:baby?'sit':'fists',face:'smug',text:baby?'おもちゃのポシェットを両手で押さえ、得意そうに見せている。':'身につけたポシェットを手で押さえ、得意そうに自慢している。',lines:['ポシェ！ チャルノ！','ポシェ、カワイイ！ ミテ！']});
  return result;
}
