// Body damage and hunger are independent of mood. Only these two systems can end a run.
export const vitalLimits={damage:100,hungerSeconds:180,deathDisplaySeconds:2.5,deathColor:'#9CC0C6'};
export const physicalDamage={slap:10,poke:4};
const nourishment={feed:110,snack:40};
const bodyRecovery={feed:2,snack:1};
const finiteVital=(value,max)=>Number.isFinite(value)?Math.max(0,Math.min(max,value)):0;
export function readVitals(saved){
  const damage=finiteVital(saved?.damage,vitalLimits.damage),hunger=finiteVital(saved?.hunger,vitalLimits.hungerSeconds);
  const dead=saved?.dead===true||damage>=vitalLimits.damage||hunger>=vitalLimits.hungerSeconds;
  return {damage,hunger,dead,cause:dead?(['hunger','injury'].includes(saved?.cause)?saved.cause:damage>=vitalLimits.damage?'injury':hunger>=vitalLimits.hungerSeconds?'hunger':'injury'):null,diedAt:dead&&Number.isFinite(saved?.diedAt)?Math.max(0,saved.diedAt):0,lastAction:Object.hasOwn(physicalDamage,saved?.lastAction)?saved.lastAction:null};
}
function markDead(vitals,cause,elapsed){
  if(vitals.dead)return false;
  vitals.dead=true;vitals.cause=cause;vitals.diedAt=Math.round(elapsed*1000)/1000;
  return true;
}
export function applyVitalAction(vitals,action,{baby=false,despairActive=false,elapsed=0}={}){
  if(vitals.dead)return false;
  if(Object.hasOwn(physicalDamage,action)){
    vitals.damage=Math.min(vitalLimits.damage,vitals.damage+physicalDamage[action]*(baby?1.2:1)*(despairActive?2:1));
    vitals.lastAction=action;
    if(vitals.damage>=vitalLimits.damage)return markDead(vitals,'injury',elapsed);
  }
  if(Object.hasOwn(nourishment,action)){
    vitals.hunger=Math.max(0,vitals.hunger-nourishment[action]);
    vitals.damage=Math.max(0,vitals.damage-bodyRecovery[action]);
  }
  return false;
}
export function advanceVitals(vitals,seconds,{elapsed=0,resting=false,recovering=false}={}){
  if(vitals.dead||!Number.isFinite(seconds)||seconds<=0)return false;
  vitals.hunger=Math.min(vitalLimits.hungerSeconds,vitals.hunger+seconds);
  if(vitals.hunger>=vitalLimits.hungerSeconds-1e-9){vitals.hunger=vitalLimits.hungerSeconds;return markDead(vitals,'hunger',elapsed);}
  if(recovering)vitals.damage=Math.max(0,vitals.damage-seconds*(resting?.08:.025));
  return false;
}
export function hungerStage(hunger){return hunger>=150?3:hunger>=120?2:hunger>=60?1:0;}
export function hungerMoment(hunger){
  return {
    1:{type:'hunger',duration:5,pose:'reach',face:'plead',text:'空の器を見て、餌をねだっている。',lines:['タパスタ……チャル、ポンポン、スイタ！','タパスタ、チョーダイ……ネ？']},
    2:{type:'hunger',duration:6,pose:'fists',face:'plead',text:'空腹で動きが鈍り、器へ手を伸ばしている。',lines:['タパスタ！ ポンポン、ペコペコ！','ニンゲンサン……タパスタ……']},
    3:{type:'hunger',duration:6,pose:'crouch',face:'plead',text:'飢えで力が入らず、うずくまりながら餌を訴えている。',lines:['タパスタ……チャル、ウゴケナ……','ポンポン……ペコペコ……タス！']}
  }[hungerStage(hunger)]||null;
}
