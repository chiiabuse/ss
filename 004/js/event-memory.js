import { traitFactor } from './individuality.js?v=20261113-062bb22577';
import { babyVoice } from './speech-text.js?v=20261113-062bb22577';

// Separate experiences from the current mood: calming down does not erase what happened.
export const eventMemoryLimits={trigger:18,maximum:100,calmDecayPerSecond:.1};
const memoryEvents={
  slap:{key:'hand',amount:60},poke:{key:'hand',amount:30},shoo:{key:'hand',amount:25},
  tease:{key:'food',amount:65},toy:{key:'kumacha',amount:55},
  takePochette:{key:'pochette',amount:65},blanket:{key:'futon',amount:55},shift:{key:'futon',amount:25}
};
const memoryCare={pet:'hand',feed:'food',snack:'food',gift:'kumacha',pochette:'pochette',restore:'futon'};
const memoryOrigins={slap:'頬を叩かれた',poke:'小突かれた',shoo:'手で追い払われた',tease:'餌を見せて隠された',toy:'クマのぬいぐるみを隠された',takePochette:'ポシェットを奪われた',blanket:'布団を取り上げられた',shift:'布団をずらされた'};
const memoryCues={
  hand:{
    pose:'crouch',
    first:'近づく手を見て、身を縮め、頬をかばった。',
    second:'手の動きを確かめながら、そっと撫でられている。',
    afterglow:'撫でる手が離れても、こちらの手元を追っている。',
    lines:['オテテ……マタ、タタク……？','ソノ、オテテ……コワイ……'],
    babyLines:['オテテ……マチャ……？','チャチャク……？ ヤッ……'],
    evilLines:['オテテ、メッ！ マタ、タタク！','チャル、オボエテル！ オテテ、メッ！'],
    later:['……ソット……ネ？','……チャル、ミテル……']
  },
  food:{
    pose:'fists',
    first:'差し出された餌を疑い、すぐには手を伸ばさず見比べている。',
    second:'餌が隠されないか確かめながら、少しずつ食べている。',
    afterglow:'食べ終わっても、餌を持っていた手と器を見比べている。',
    lines:['タパスタ……マタ、カクス……？','ホント……？ カクス、メッ！'],
    evilLines:['マタ、カクス！ チャル、オボエテル！','タパスタ、ココ！ カクス、メッ！'],
    later:['……タパスタ……アル……','カクス……メッ！ チャル、ミテル……']
  },
  kumacha:{
    pose:'fists',
    first:'戻ったクマのぬいぐるみを抱え込み、また隠されないか手元を見ている。',
    second:'クマのぬいぐるみを胸元へ引き寄せ、こちらを気にしている。',
    afterglow:'クマのぬいぐるみを抱き直し、取られないように押さえている。',
    lines:['クマチャ……マタ、カクス……？','クマチャ、トルナ……！'],
    evilLines:['クマチャ、チャルノ！ モウ、トルナ！','マタ、カクス！ クマチャ、トルナ！'],
    later:['クマチャ……ココ……トルナ……','クマチャ、ギュッ……チャルノ……']
  },
  pochette:{
    pose:'fists',
    first:'戻ったポシェットを押さえ、また奪われないか身構えている。',
    second:'ポシェットを手で押さえたまま、こちらの動きを見ている。',
    afterglow:'ポシェットから手を離さず、こちらを気にしている。',
    lines:['ポシェ……マタ、トル……？','ポシェ、トルナ……！'],
    evilLines:['ポシェ、チャルノ！ トルナ！','マタ、トル！ チャル、オボエテル！'],
    later:['ポシェ……ココ……チャルノ……','ポシェ、トルナ……メッ！']
  },
  futon:{
    pose:'fists',
    first:'戻った布団を握り、また動かされないか確かめている。',
    second:'布団の端を押さえ、こちらの手が離れるのを待っている。',
    afterglow:'布団の端を握ったまま、こちらの手元を警戒している。',
    lines:['オフトン……マタ、トル……？','オフトン、ココ……ウゴカス、メッ！'],
    evilLines:['オフトン、チャルノ！ トルナ！','マタ、ウゴカス！ オフトン、メッ！'],
    later:['オフトン……ココ……ネ？','オフトン、トルナ……チャルノ……']
  }
};

export function readEventMemory(saved){
  return Object.fromEntries(Object.keys(memoryCues).map(key=>{
    const value=saved?.[key],source=value?.source;
    return [key,{
      strength:Number.isFinite(value?.strength)?Math.max(0,Math.min(eventMemoryLimits.maximum,value.strength)):0,
      source:memoryEvents[source]?.key===key?source:null
    }];
  }));
}
export function rememberEvent(memory,action,individual=null){
  const event=memoryEvents[action];
  if(!event)return;
  const entry=memory[event.key];
  entry.strength=Math.min(eventMemoryLimits.maximum,entry.strength+event.amount*traitFactor(individual,event.key==='hand'?'timidity':event.key==='food'?'appetite':'attachment',.6));
  entry.source=action;
}
export function softenEventMemory(memory,action){
  const key=memoryCare[action];
  if(key)memory[key].strength=Math.max(0,memory[key].strength-(key==='hand'?14:18));
}
export function fadeEventMemory(memory,seconds,calm){
  if(!calm||!Number.isFinite(seconds)||seconds<=0)return;
  for(const entry of Object.values(memory))entry.strength=Math.max(0,entry.strength-seconds*eventMemoryLimits.calmDecayPerSecond);
}
export function recallEvent(memory,action,kind,baby){
  const key=memoryCare[action],entry=memory[key];
  if(!entry||entry.strength<eventMemoryLimits.trigger)return null;
  const original=memoryCues[key];
  // The old experience was hidden food; the offered item is now a cream puff.
  const cue=action==='snack'?{
    ...original,
    first:original.first.replace(/餌/g,'シュークリーム'),
    second:original.second.replace(/餌/g,'シュークリーム'),
    afterglow:original.afterglow.replace(/餌/g,'シュークリーム'),
    lines:original.lines.map(line=>line.replace(/タパスタ/g,'アマアマ')),
    evilLines:original.evilLines.map(line=>line.replace(/タパスタ/g,'アマアマ')),
    later:original.later.map(line=>line.replace(/タパスタ/g,'アマアマ'))
  }:original;
  const lines=kind==='evil'?cue.evilLines:baby&&cue.babyLines?cue.babyLines:cue.lines;
  return {
    key,strength:entry.strength,pose:cue.pose,
    first:(memoryOrigins[entry.source]||'嫌な思いをした')+'ことを思い出し、'+cue.first,
    second:cue.second,afterglow:cue.afterglow,
    lines:lines.map(line=>baby?babyVoice(line):line),
    later:cue.later.map(line=>baby?babyVoice(line):line)
  };
}
export function memoryCareCandidates(candidates,memory,phase){
  if(!memory)return candidates;
  const lines=phase===0?memory.lines:memory.later;
  const total=candidates.reduce((sum,item)=>sum+item.weight,0);
  const remembered=lines.map(text=>({text,tone:'cautious',weight:phase===0?1:total*memory.strength/100/lines.length}));
  return phase===0?remembered:[...candidates,...remembered];
}
