// Chewing sounds are the intentional hiragana exception, including for babies.
export function normalizeChewing(text){
  return text.replace(/(?:ハンチャ|ウンチャ|ンチャ)(?:ッチャ)*|ムチャ(?=$|[\s、。！？!?…♪・]|ムチャ|ウンチャ|ンチャ)/g,sound=>sound.replace(/[ァ-ヶ]/g,kana=>String.fromCharCode(kana.charCodeAt(0)-0x60)));
}
const babySyllables={サ:'シャ',ス:'シュ',セ:'シェ',ソ:'ショ',タ:'チャ',ツ:'チュ',テ:'チェ',ト:'チョ',ラ:'リャ',ル:'リュ',レ:'リェ',ロ:'リョ',ダ:'ヂャ',ヅ:'ヂュ',デ:'ヂェ',ド:'ヂョ',マ:'ミャ',ム:'ミュ',メ:'ミェ',モ:'ミョ'};
const babySyllablePattern=new RegExp([...Object.values(babySyllables),...Object.keys(babySyllables)].join('|'),'g');
export function babyVoice(line){
  // Match already softened syllables as units: applying this twice must be safe.
  return normalizeChewing(line).replace(babySyllablePattern,unit=>babySyllables[unit]||unit);
}
export function spokenText(text,kind){
  return kind==='red'||kind==='white'?babyVoice(text):normalizeChewing(text);
}
