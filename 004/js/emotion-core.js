import { careIds } from './action-data.js?v=20261113-062bb22577';
import { traitFactor, individualDeltaFactor } from './individuality.js?v=20261113-062bb22577';
import { emotionDefaults, emotionDeltas, personalityMultipliers, repeatLimits } from './emotion-config.js?v=20261113-062bb22577';

export function readEmotions(data, k){
  const defaults=emotionDefaults[k];
  return Object.fromEntries(Object.keys(defaults).map(key=>[key, Number.isFinite(data?.[key])?Math.max(0, Math.min(100, data[key])):defaults[key]]));
}
export function toneWeights(emotions,individual=null){
  const {
    hate:h,
    satisfaction:s,
    fear:f
  } =emotions;
  return {
    neutral:1.2,
    angry:(.03+h*h/600*(1+f/100))*traitFactor(individual,'defiance',1),
    afraid:(.02+f*f/600*(1-h/100*.65))*traitFactor(individual,'timidity',1.2),
    sad:.04+(100-s)*(100-s)/1800,
    happy:.02+s*s/650*(1-f/110),
    plead:(.3+(100-s)/65)*traitFactor(individual,'appetite',1)
  };
}
export function emotionFace(emotions, fallback, canRelieve=false){
  // Resentment takes precedence even when fear is also high.
  if(emotions.hate>=58)return 'worried';
  if(emotions.fear>=75)return 'scared';
  if(emotions.fear>=48)return 'worried';
  if(emotions.satisfaction<=16)return 'cry';
  if(emotions.satisfaction>=65&&emotions.fear<30)return 'smile';
  if(canRelieve&&emotions.satisfaction>=45&&emotions.fear<25&&emotions.hate<35)return 'relieved';
  return fallback;
}
export function emotionMood(emotions){
  if(emotions.hate>=58&&emotions.fear>=70)return '怖さと悔しさで涙をこらえながらも、こちらに反発している。';
  if(emotions.hate>=58)return '悔し涙をこらえながら、こちらをにらみ、反発している。';
  if(emotions.fear>=70)return 'また何かされるのを恐れ、身構えている。';
  if(emotions.hate>=50&&emotions.fear>=40)return '怖さと反感が入り混じっている。';
  if(emotions.hate>=50)return 'こちらへの不満が、まだ収まらない。';
  if(emotions.satisfaction<=20)return '満たされず、心細そうにしている。';
  if(emotions.satisfaction>=60&&emotions.fear<35)return '機嫌がよく、少し得意になっている。';
  if(emotions.fear>=35)return 'まだ少し警戒しながら、こちらをうかがっている。';
  return '少しずつ、落ち着きを取り戻している。';
}

// Return new values; the caller owns when and where simulation state changes.
export function actionEmotionValues(emotions,action,count,kind,individual,lossScale=1){
  const deltas=emotionDeltas[action];
  const repeat=careIds.includes(action)?1:Math.min(repeatLimits.maxMultiplier,1+Math.max(0,count-1)*repeatLimits.step);
  const personality=personalityMultipliers[kind];
  return Object.fromEntries(['hate','satisfaction','fear'].map((key,index)=>{
    const change=deltas[index]*repeat*personality[index]*lossScale*individualDeltaFactor(individual,action,key,deltas[index]);
    return [key,Math.max(0,Math.min(100,emotions[key]+change))];
  }));
}
export function settledEmotionValues(emotions,seconds,hasFuton){
  const target=hasFuton?48:18;
  return {
    hate:Math.max(0,emotions.hate-seconds*.006),
    satisfaction:emotions.satisfaction+Math.sign(target-emotions.satisfaction)*Math.min(Math.abs(target-emotions.satisfaction),seconds*(hasFuton?.045:.035)),
    fear:Math.max(0,emotions.fear-seconds*(hasFuton?.09:.025))
  };
}
