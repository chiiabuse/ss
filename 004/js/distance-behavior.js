import { traitValue } from './individuality.js';
// Position is measured from the person in front of the room (the bottom edge).
export function distanceBehavior(emotions, baby=false, individual=null) {
  const {hate:h,fear:f,satisfaction:s}=emotions;
  const hideAt=48-(traitValue(individual,'timidity')-.5)*20;
  const protestAt=35-(traitValue(individual,'defiance')-.5)*12;
  const approachFear=30-(traitValue(individual,'timidity')-.5)*12;
  if(h>=58||(f<hideAt&&h>=protestAt&&s<=25))return {mode:'protest',x:baby?340:310,y:baby?480:455,pose:'stomp',text:'少し離れた場所で、涙をこらえながら抗議している。',lines:['イヤッ！ モーヤメッ！','チャル、イヤ！']};
  if(f>=hideAt)return {mode:'hide',x:baby?550:570,y:baby?420:440,pose:'crouch',text:'段ボールの陰へ下がり、こちらの手元をうかがっている。',lines:['……オテテ……コワイ……','ココ……イテ、イイ……？']};
  if(s>=60&&f<approachFear&&h<35)return {mode:'approach',x:430,y:568,pose:'reach',text:'機嫌よくこちらへ近づき、短い手を差し出している。',lines:['ニンゲンサン！ チャル、ココ！','チャオ！ オセワ、ネ？']};
  return {mode:'neutral'};
}
