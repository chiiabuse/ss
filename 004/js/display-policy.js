import { kickTiming } from './kick-motion.js?v=20261113-f32e3f65f3';
import { idleFaces, impactExpression } from './dialogue-policy.js?v=20261113-f32e3f65f3';
import { emotionFace } from './emotion-core.js?v=20261113-f32e3f65f3';
import { distanceBehavior } from './distance-behavior.js?v=20261113-f32e3f65f3';

// Explicit precedence shared by sprites and preview controls; no DOM or mutable state.
export function resolveIdleFace(k,key,emotions,canRelieve=false){
  if(key==='sleep')return 'sleep';
  return emotionFace(emotions, idleFaces[k]?.[key]||'neutral',canRelieve);
}

export function resolveDisplayedFace({kind:k,key,emotions,reaction,expressionMode,despairActive,speechIsRedCry,t,speechUntil,speechFace,attention,afterglow,distanceMode,canRelieve,dead=false}){
  if(dead)return 'smile';
  if(speechIsRedCry&&t<speechUntil&&(reaction||expressionMode==='auto'))return 'cry';
  if(reaction)return impactExpression(reaction.action,reaction.age)||reaction.face;
  if(expressionMode!=='auto')return expressionMode;
  if(despairActive)return 'despair';
  if(t<speechUntil&&speechFace)return speechFace;
  if(attention>3)return 'surprise';
  if(attention>0)return k==='evil'?'angry':'plead';
  if(afterglow)return afterglow.step.face;
  if(distanceMode==='protest')return 'worried';
  if(distanceMode==='hide')return emotionFace(emotions,'alert');
  if(distanceMode==='approach')return emotionFace(emotions,'smile');
  return resolveIdleFace(k,key,emotions,canRelieve);
}

export function resolvePose({kind:k,key,emotions,reaction,poseMode,despairActive,afterglow,distanceMode,baby,individual,dead=false}){
  if(dead)return 'collapsed';
  if(poseMode!=='auto')return poseMode;
  if(despairActive)return 'collapsed';
  if(afterglow&&!reaction)return afterglow.step.pose;
  if(!reaction&&distanceMode!=='neutral')return distanceBehavior(emotions,baby,individual).pose||'stand';
  if(reaction){
    const a=reaction.action,
    phase=reaction.phase;
    if(phase===0&&reaction.memory)return reaction.memory.pose;
    if(a==='kick')return reaction.age<kickTiming.duration?'open':'crouch';
    if(a==='pochette')return phase===0?'reach':baby?'sit':'fists';
    if(a==='feed'||a==='snack')return phase===0?'reach':'sit';
    if(a==='gift')return phase===0?'reach':'fists';
    if(a==='pet')return emotions.fear<48?'sit':'fists';
    if(phase>0&&reaction.face==='hurt')return 'crouch';
    if(phase>0&&(reaction.face==='angry'||emotions.hate>=58))return 'stomp';
    if(emotions.fear>=78&&phase>0&&emotions.hate<58)return 'prone';
    if(phase>0&&['cry', 'scared', 'worried', 'alert'].includes(reaction.face))return 'crouch';
    if(a==='slap')return phase===0?'open':'crouch';
    if(a==='poke')return phase===0?'open':'crouch';
    if(a==='scold')return phase===0?'fists':k==='evil'?'stomp':'crouch';
    if(a==='shoo')return phase===0?'open':'crouch';
    if(a==='clap')return phase===0?'open':'fists';
    if(a==='shift')return phase===0?'sit':'reach';
    if(a==='ignore')return phase===0?'reach':k==='evil'?'stomp':'fists';
    if(a==='toy'||a==='tease')return phase===0?'reach':k==='evil'?'stomp':'crouch';
    if(a==='takePochette')return phase===0?'reach':'fists';
    if(a==='blanket')return phase===0?'open':'fists';
    if(a==='restore')return phase===0?'reach':'sit';
  }
  if(key==='look'&&emotions.hate>=58)return 'stomp';
  if(key!=='sleep'&&emotions.fear>=75&&emotions.hate<58)return 'crouch';
  return {
    guard:'fists',
    sniff:'stand',
    walk:k==='evil'?'stomp':'stand',
    crumb:'sit',
    wash:'fists',
    look:k==='evil'?'stomp':'open',
    blanket:'sit',
    sleep:'prone',
    stretch:'reach'
  }[key]||'stand';
}
