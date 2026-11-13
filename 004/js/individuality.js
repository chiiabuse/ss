import { emotionDefaults } from './emotion-config.js';
import { babyVoice } from './speech-text.js';

export const pickupTypes = [
  {type:'adult',art:'evil',name:'白鼠種（成体）',sub:'成体 / 気質は個体ごとに異なる',description:'強気なもの、食い意地の張ったもの、慎ましいもの。拾うまで気質は分からない。'},
  {type:'red',art:'red',name:'赤ベビ',sub:'幼体 / 生後約2週間',description:'薄赤い体。舌足らずに話し、幼体同士でも怖がり方や食べ物への関心が違う。'},
  {type:'white',art:'white',name:'白ベビ',sub:'幼体 / エリートベビ',description:'白い体とくるんとした前髪。自信家にも臆病なものにも、それぞれのこだわりがある。'}
];
export const capturePlaces=['路地裏の隅','公園の草陰','空き地の植え込み','駐輪場の裏','住宅街の物陰','商店街の裏路地'];
const individualLengthRanges={evil:[20,30],normal:[20,30],red:[5,8],white:[5,8]};
function generatedDetails(kind,placeDraw,lengthDraw){
  const [min,max]=individualLengthRanges[kind];
  return {capturePlace:capturePlaces[Math.min(capturePlaces.length-1,Math.floor(placeDraw*capturePlaces.length))],lengthCm:Math.round((min+(max-min)*lengthDraw)*10)/10};
}
function legacyDetails(id,kind){
  // Missing old fields get stable defaults without consuming gameplay randomness.
  let hash=2166136261;
  for(const char of id)hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;
  return generatedDetails(kind,(hash%65536)/65536,(hash>>>16)/65536);
}
const traitNames={defiance:'強がり',appetite:'食い意地',timidity:'臆病さ',attachment:'物への執着'};
export function traitValue(individual,key){
  const value=individual?.traits?.[key];
  return Number.isFinite(value)?Math.max(0,Math.min(1,value)):.5;
}
export function traitFactor(individual,key,spread=1){
  return 1+(traitValue(individual,key)-.5)*spread;
}
export function readIndividual(saved,kind){
  const id=typeof saved?.id==='string'&&/^[a-z0-9-]{1,80}$/i.test(saved.id)?saved.id:'legacy-'+kind;
  const fallback=legacyDetails(id,kind);
  const [min,max]=individualLengthRanges[kind];
  return {
    id,
    traits:Object.fromEntries(Object.keys(traitNames).map(key=>[key,traitValue(saved,key)])),
    capturePlace:capturePlaces.includes(saved?.capturePlace)?saved.capturePlace:fallback.capturePlace,
    lengthCm:Number.isFinite(saved?.lengthCm)&&saved.lengthCm>=min&&saved.lengthCm<=max?Math.round(saved.lengthCm*10)/10:fallback.lengthCm
  };
}
export function createIndividual(type,random=Math.random,now=Date.now){
  if(!pickupTypes.some(choice=>choice.type===type))throw new Error('Unknown pickup type');
  // Internal styles select dialogue, not distinct adult species.
  const kind=type==='adult'?(random()<.18?'normal':'evil'):type;
  const traits=Object.fromEntries(Object.keys(traitNames).map(key=>{
    const bias=kind==='white'&&key==='defiance'?.1:kind==='red'&&key==='timidity'?.05:0;
    return [key,Math.min(.95,.15+random()*.7+bias)];
  }));
  const individual={id:now().toString(36)+'-'+Math.floor(random()*0x100000000).toString(36)+'-'+Math.floor(random()*0x100000000).toString(36),traits};
  Object.assign(individual,generatedDetails(kind,random(),random()));
  return {kind,individual};
}
export function individualProfile(base,kind,individual){
  const adult=!base.baby;
  const summary=Object.entries(traitNames).map(([key,label])=>label+' '+(traitValue(individual,key)>=.67?'強め':traitValue(individual,key)<=.33?'控えめ':'普通')).join(' / ');
  return {...base,capturePlace:individual.capturePlace,length:'約'+individual.lengthCm+'cm',name:adult?'白鼠種（成体）':base.name,sub:adult?'成体 / '+(kind==='normal'?'慎ましい傾向':'図々しい傾向'):base.sub,feature:(adult?'':base.feature+' / ')+summary};
}
export function individualInitialEmotions(kind,individual){
  const base=emotionDefaults[kind];
  return {
    hate:Math.max(0,Math.min(100,base.hate+(traitValue(individual,'defiance')-.5)*20)),
    satisfaction:Math.max(0,Math.min(100,base.satisfaction-(traitValue(individual,'appetite')-.5)*12)),
    fear:Math.max(0,Math.min(100,base.fear+(traitValue(individual,'timidity')-.5)*24))
  };
}
export function individualDeltaFactor(individual,action,key,delta){
  if(key==='hate')return traitFactor(individual,'defiance',delta>0?.9:-.35);
  if(key==='fear')return traitFactor(individual,'timidity',delta>0?1.1:-.4);
  if(action==='feed'||action==='snack'||action==='tease')return traitFactor(individual,'appetite',.9);
  if(['gift','pochette','takePochette','toy','blanket','restore','shift'].includes(action))return traitFactor(individual,'attachment',.8);
  return 1;
}
export function individualStateWeight(key,individual){
  if(['crumb','sniff'].includes(key))return traitFactor(individual,'appetite',1.2);
  if(['guard','wash'].includes(key))return traitFactor(individual,'timidity',.9);
  if(['walk','look'].includes(key))return traitFactor(individual,'defiance',.8);
  if(['blanket','sleep'].includes(key))return traitFactor(individual,'attachment',.6);
  return 1;
}
export function individualCareCandidates(candidates,individual,action,baby){
  const scaled=candidates.map(item=>({...item,weight:item.weight*(item.tone==='cautious'?traitFactor(individual,'timidity',1):item.tone==='happy'?traitFactor(individual,(action==='feed'||action==='snack')?'appetite':'attachment',.8):1)}));
  let lines=[];
  if(action==='feed'&&traitValue(individual,'appetite')>=.67)lines=['タパスタ！ マダ、アル？','オカワリ！ タークタク！'];
  if(action==='snack'&&traitValue(individual,'appetite')>=.67)lines=['アマアマ！ マダ、アル？','アマアマ、モット！'];
  const food=lines.length>0;
  if(action==='pet'&&traitValue(individual,'timidity')>=.67)lines=['オテテ……ソット……ネ？','……ヤサシ……？'];
  return [...scaled,...lines.map(text=>({text:baby?babyVoice(text):text,tone:food?'happy':'cautious',weight:2}))];
}
