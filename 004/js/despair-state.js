export const despairLimits={minFear:95,maxSatisfaction:5,severeSeconds:30,recoverySeconds:10,recoveryMaxFear:90,recoveryMinSatisfaction:50};
export function readDespair(value){
  const finite=(number,max)=>Number.isFinite(number)?Math.max(0,Math.min(max,number)):0;
  return {ruleVersion:2,active:value?.active===true,severe:value?.ruleVersion===2?finite(value?.severe,despairLimits.severeSeconds):0,recovery:finite(value?.recovery,despairLimits.recoverySeconds)};
}
export function advanceDespairState(state,emotions,d){
  if(state.active){
    state.recovery=emotions.fear<despairLimits.recoveryMaxFear&&emotions.satisfaction>=despairLimits.recoveryMinSatisfaction?Math.min(despairLimits.recoverySeconds,state.recovery+d):0;
    if(state.recovery>=despairLimits.recoverySeconds){state.active=false;state.severe=0;state.recovery=0;return 'recovered';}
  }else{
    state.severe=emotions.fear>=despairLimits.minFear&&emotions.satisfaction<=despairLimits.maxSatisfaction?Math.min(despairLimits.severeSeconds,state.severe+d):0;
    if(state.severe>=despairLimits.severeSeconds){state.active=true;state.recovery=0;return 'entered';}
  }
  return null;
}
export function despairLines(baby){
  return baby?['コンナコチョナリャ、モウ、イキチャーク……','フッ……','モウ……ナンデモ……イイ……']:['コンナコトナラ、モウ、イキターク……','フッ……','モウ……ナンデモ……イイ……'];
}
export function despairCareLines(action,baby){
  const item={snack:'アマアマ',feed:'タパスタ',pet:'オテテ',gift:'クマチャ',pochette:'ポシェ',restore:'フワフワ'}[action];
  return ['……'+item+'……？','……'];
}

export function despairRecoveryMoment(kind){
  const lines={
    evil:['フッ！ チャル、ナンナッタ！','チャル、カワイイ！ モット、オセワ！'],
    normal:['わァ！ チャル、ナンナッタ！','フッ！ チャル、ゲンキ！'],
    red:['ピャーイ！ チャル、ナンナッタ！','ピャーイ！ チャル、ゲンキ！'],
    white:['フッ！ チャル、ナンナッタ！ ヤッパ、エリート！','ケヘッ！ ヤッパ、エリート！']
  };
  return {type:'revive',duration:5,pose:'fists',face:'smug',text:'急に胸を張り、何とかなったと得意げに声を上げている。',mood:'世話を受けると、すぐに調子を取り戻している。',lines:lines[kind]};
}
