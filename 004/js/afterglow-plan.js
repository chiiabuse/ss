import { careIds } from './action-data.js';
import { emotionFace } from './emotion-core.js';

// Brief, interruptible follow-through; no extra stat changes or saved action counts.
export function planAfterglow(action, face, emotions, hasToy) {
  const care=careIds.includes(action), steps=[];
  const lingeringFace=emotionFace(emotions, 'alert');
  if(['cry','worried','scared','hurt'].includes(face)||(!care&&(emotions.fear>=35||emotions.satisfaction<35))) {
    steps.push({type:'sniff',duration:4.5,pose:'fists',face:lingeringFace,text:'泣いた余韻が残り、小さく鼻をすすっている。',lines:['スン……ヒック……','……グスッ……']});
  }
  if(emotions.fear>=35||emotions.hate>=45) {
    steps.push({type:'watch',duration:5.5,pose:'fists',face:lingeringFace,text:emotions.hate>=58?'涙をこらえたまま、こちらの手元をにらんでいる。':'体を固くし、こちらの手元を警戒している。',lines:['オテテ……','……ニンゲンサン……']});
  }
  if(hasToy) {
    steps.push({type:'cuddle',duration:5,pose:'fists',face:emotionFace(emotions,'content'),text:'クマのぬいぐるみを胸元へ引き寄せ、抱き直した。',lines:['クマチャ……ギュッ……','クマチャ……ココ……']});
  } else if(care&&face==='relieved'&&emotions.fear<25&&emotions.hate<35) {
    steps.push({type:'relax',duration:5,pose:'sit',face:'relieved',text:'肩の力が抜け、涙を残してほっと息をついた。',lines:['……ホッ……','チャル……アンシン……']});
  }
  if(!steps.length)steps.push({type:'settle',duration:4.5,pose:'fists',face:emotionFace(emotions,care?'content':'alert'),text:care?'受けた世話の感触を確かめるように、じっとしている。':'すぐには動かず、こちらの様子をうかがっている。',lines:care?['……フウ……','……ン……']:['……','ニンゲンサン……']});
  return steps;
}
