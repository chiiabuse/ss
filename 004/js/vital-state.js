// Body damage and hunger are independent of mood. Only these two systems can end a run.
export const vitalLimits={damage:100,hungerSeconds:240,deathDisplaySeconds:5,deathColor:'#9CC0C6'};
export const physicalDamage={slap:10,poke:4,kick:40};
const nourishment={feed:110,snack:40};
const bodyRecovery={feed:2,snack:1};
const bodyRecoveryRates={idle:.2,sleep:1};
const finiteVital=(value,max)=>Number.isFinite(value)?Math.max(0,Math.min(max,value)):0;
const integerDamage=value=>Math.floor(finiteVital(value,vitalLimits.damage));
const recoveryCredit=value=>Number.isFinite(value)&&value>=0&&value<1?value:0;
export function formatBodyDamage(value){return String(integerDamage(value));}
export function readVitals(saved){
  // Old fractional saves round down so migration cannot newly kill a living individual.
  const damage=integerDamage(saved?.damage),hunger=finiteVital(saved?.hunger,vitalLimits.hungerSeconds);
  const dead=saved?.dead===true||damage>=vitalLimits.damage||hunger>=vitalLimits.hungerSeconds;
  return {
    damage,
    hunger,
    recoveryProgress:damage>0?recoveryCredit(saved?.recoveryProgress):0,
    dead,
    cause:dead?restoredDeathCause(saved?.cause,damage,hunger):null,
    diedAt:dead&&Number.isFinite(saved?.diedAt)?Math.max(0,saved.diedAt):0,
    lastAction:Object.hasOwn(physicalDamage,saved?.lastAction)?saved.lastAction:null
  };
}
function restoredDeathCause(savedCause,damage,hunger){
  if(['hunger','injury'].includes(savedCause))return savedCause;
  if(damage>=vitalLimits.damage)return 'injury';
  return hunger>=vitalLimits.hungerSeconds?'hunger':'injury';
}
function markDead(vitals,cause,elapsed){
  if(vitals.dead)return false;
  vitals.damage=integerDamage(vitals.damage);
  vitals.dead=true;vitals.cause=cause;vitals.diedAt=Math.round(elapsed*1000)/1000;
  return true;
}
export function applyVitalAction(vitals,action,{baby=false,despairActive=false,elapsed=0}={}){
  if(vitals.dead)return false;
  if(Object.hasOwn(physicalDamage,action)){
    vitals.damage=Math.min(vitalLimits.damage,vitals.damage+physicalDamage[action]*(baby?2:1)*(despairActive?2:1));
    vitals.lastAction=action;
    if(vitals.damage>=vitalLimits.damage)return markDead(vitals,'injury',elapsed);
  }
  if(Object.hasOwn(nourishment,action)){
    vitals.hunger=Math.max(0,vitals.hunger-nourishment[action]);
    vitals.damage=Math.max(0,vitals.damage-bodyRecovery[action]);
    if(vitals.damage===0)vitals.recoveryProgress=0;
  }
  return false;
}
function recoverBodyDamage(vitals,seconds,resting,recovering){
  vitals.damage=integerDamage(vitals.damage);
  if(vitals.damage===0)vitals.recoveryProgress=0;
  else if(recovering){
    // Time may accumulate fractions; body damage changes only in whole points.
    const credit=recoveryCredit(vitals.recoveryProgress)+seconds*(resting?bodyRecoveryRates.sleep:bodyRecoveryRates.idle);
    const recovered=Math.floor(credit+1e-9);
    vitals.damage=Math.max(0,vitals.damage-recovered);
    vitals.recoveryProgress=vitals.damage>0?Math.max(0,credit-recovered):0;
  }
}
export function advanceVitals(vitals,seconds,{elapsed=0,resting=false,recovering=false}={}){
  if(vitals.dead||!Number.isFinite(seconds)||seconds<=0)return false;
  vitals.hunger=Math.min(vitalLimits.hungerSeconds,vitals.hunger+seconds);
  if(vitals.hunger>=vitalLimits.hungerSeconds-1e-9){vitals.hunger=vitalLimits.hungerSeconds;return markDead(vitals,'hunger',elapsed);}
  recoverBodyDamage(vitals,seconds,resting,recovering);
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
