import { readVitals } from './vital-state.js?v=20261113-062bb22577';
import { readRepeatStreak } from './action-repeat.js?v=20261113-062bb22577';
import { readIndividual } from './individuality.js?v=20261113-062bb22577';
import { readEventMemory } from './event-memory.js?v=20261113-062bb22577';
import { baseStates, variants } from './profile-data.js?v=20261113-062bb22577';
import { readEmotions } from './emotion-core.js?v=20261113-062bb22577';
import { readDespair } from './despair-state.js?v=20261113-062bb22577';
import { readAttachment } from './item-attachment.js?v=20261113-062bb22577';

// Startup, profile switching and reset share the same save hydration.
export function readProfileSnapshot(saved,kind){
  return {
    vitals:readVitals(saved.vitals),
    individual:readIndividual(saved.individual,kind),
    elapsed:Number(saved.elapsed)||0,
    logs:Array.isArray(saved.logs)?saved.logs.slice(0,35):[],
    seen:new Set(saved.seen||[]),
    toyPresent:!!saved.toyPresent,
    pochettePresent:!!saved.pochettePresent,
    blanketPresent:saved.blanket!==false,
    bedOffset:Number(saved.bedOffset)||0,
    actionCounts:saved.actionCounts||{},
    repeatStreak:readRepeatStreak(saved.repeatStreak,Number(saved.elapsed)||0),
    emotions:readEmotions(saved.emotions,kind),
    despair:readDespair(saved.despair),
    itemAttachment:readAttachment(saved.itemAttachment),
    eventMemory:readEventMemory(saved.eventMemory)
  };
}
export function createReliefMemory(){
  return {threatened:false,calmTime:0,cooldown:0,until:0};
}

export function createBehaviorStates(kind,profile){
  return baseStates.map((s, i)=>{
    let v=variants[kind]?.[i];
    let a={
      ...s
    };
    if(v)[a.name, a.mood, a.text, a.say]=v;
    if(profile.baby){
      a.tx=448+Math.sin(i*1.3)*(kind==='red'?35:50);
      a.ty=532+Math.cos(i)*5;
      a.duration=9+i%3*3
    }
    return a
  })
}
