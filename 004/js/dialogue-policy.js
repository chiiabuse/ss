import { kickTiming } from './kick-motion.js?v=20261113-f32e3f65f3';
import { spokenText } from './speech-text.js?v=20261113-f32e3f65f3';
export { babyVoice, spokenText, normalizeChewing } from './speech-text.js?v=20261113-f32e3f65f3';

// One policy for dialogue meaning and its expression. Emotion affects selection,
// but must not turn a frightened or crying utterance into a smile afterwards.
export function dialogueTone(text, fallback='neutral', care=false){
  if(/イキターク|イキチャーク|^フッ……$/.test(text))return 'despair';
  if(/スゥ|シュゥ|ムニャ|ミュニャ|ネンネ……$/.test(text))return 'sleep';
  if(/アンシン|ホッ/.test(text))return 'relieved';
  if(/ビャ|グスッ|グシュッ|ヒック/.test(text))return 'sad';
  if(/イヂャイ|アギョ/.test(text))return 'pain';
  if(/コワイ|タシュ|チャシュ|タス！|セッ|シェッ/.test(text))return care?'cautious':'afraid';
  if(/ゴメナ|ゴミェナ/.test(text))return 'sad';
  if(/エワ゛|ビックリ/.test(text)||(fallback==='neutral'&&/^ピャッ[！？]+$/.test(text)))return 'surprise';
  if(/ミルナ|ミリュナ|キッ！|クソ|クショ|ハァ|オコ|ワルナ|ワリュナ|カエシ|カエス|カエシュ|イヤッ|ヤメッ|ヤミェッ|メッ！|ミェッ！|トルナ|トリュナ|チョリュナ|カクスナ|カクシュナ/.test(text)){
    if(care)return 'cautious';
    return fallback==='afraid'?'afraid':'angry';
  }
  if(fallback!=='neutral')return fallback;
  if(/ピャーイ|エヒ|ケヘ|ウレシ|ウリェシ|シアワ|ヤヤ|ルパ|デキチャ|ヂェキチャ|ミチュケチャ|ウマウマ！|ウミャウミャ！/.test(text))return 'happy';
  if(/チョーダイ|チョーヂャイ|ヨコス|ヨコシュ|タパスタ|タパシュチャ|チャパシュチャ|オカワリ|オネガイ/.test(text))return 'plead';
  if(/ナイナッタ|ナイナッチャ/.test(text))return 'sad';
  return fallback;
}
export function isRedCrying(text,kind){return kind==='red'&&/ビャ/.test(text);}
export function dialogueFace(tone, emotions, fallback='neutral',utterance={}){
  if(isRedCrying(utterance.text||'',utterance.kind))return 'cry';
  if(tone==='despair')return 'despair';
  if(tone==='pain')return 'hurt';
  if(tone==='sleep')return 'sleep';
  if(tone==='relieved')return 'relieved';
  if(tone==='happy')return fallback==='smug'?'smug':'smile';
  if(tone==='cautious')return emotions.hate>=58?'worried':emotions.fear>=75?'scared':emotions.fear>=48?'worried':'alert';
  if(['angry','afraid','sad','plead'].includes(tone)&&emotions.hate>=58)return 'worried';
  return {surprise:'surprise',angry:'angry',afraid:'scared',sad:'cry',plead:'plead',content:'content'}[tone]||fallback;
}
export function careCandidates(base, guarded, emotions, baby, canRelieve){
  const {hate:h,fear:f,satisfaction:s}=emotions;
  const happy=.3+s*s/700*(1-f/110), cautious=.3+f*f/550+h/40;
  return [
    ...base.map(text=>({text,tone:dialogueTone(text,'happy',true),weight:happy})),
    ...guarded.map(text=>({text,tone:dialogueTone(text,'cautious',true),weight:cautious})),
    ...(canRelieve?(baby?['チャリュ……アンシン……','モウ、ダイジョブ……']:['チャル……アンシン……','モウ、ダイジョブ……']).map(text=>({text,tone:'relieved',weight:happy*.35})):[])
  ];
}
export function actionBaseTone(kind,action,phase){
  if(phase===0)return ['tease','toy','ignore'].includes(action)?'happy':'neutral';
  return kind==='evil'?'angry':kind==='white'?'sad':'afraid';
}
export const idleFaces={
  evil:{guard:'smug',sniff:'plead',walk:'angry',crumb:'smile',wash:'pout',look:'cry',blanket:'smile',stretch:'plead'},
  red:{guard:'scared',sniff:'plead',walk:'smile',crumb:'content',wash:'smile',look:'cry',blanket:'smile',stretch:'smile'},
  white:{guard:'smile',sniff:'plead',walk:'smile',crumb:'smile',wash:'content',look:'alert',blanket:'smile',stretch:'smile'},
  normal:{guard:'scared',sniff:'surprise',walk:'alert',crumb:'smile',wash:'neutral',look:'plead',blanket:'smile',stretch:'smile'}
};

export const faceTones={smile:"happy",smug:"happy",cry:"sad",worried:"cautious",alert:"cautious",hurt:"pain",despair:"despair",scared:"afraid",angry:"angry",plead:"plead",sleep:"sleep",relieved:"relieved",content:"content"};

export function impactExpression(action,age){
  if(action==='kick'&&age<kickTiming.duration)return 'hurt';
  return ["slap","poke"].includes(action)&&age<1?"hurt":null;
}

// Apply personality even to shared idle/aftermath dialogue, without changing other profiles.
export function characterVoice(text,kind,tone='neutral'){
  text=spokenText(text,kind);
  if(kind!=='evil')return text;
  const address=['angry','pain','sad'].includes(tone)?'クソニンゲン':['cautious','afraid'].includes(tone)?'ニンゲン':'ドレーニンゲン';
  return text.replace(/クソニンゲン|ドレーニンゲン|ニンゲンサン|ニンゲン/g,word=>word==='クソニンゲン'||word==='ドレーニンゲン'?word:address);
}
