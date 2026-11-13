import { readRepeatStreak } from './action-repeat.js';
import { readIndividual } from './individuality.js';
import { readEventMemory } from './event-memory.js';
import { baseStates, variants } from './profile-data.js';
import { readEmotions } from './emotion-core.js';
import { readDespair } from './despair-state.js';
import { readAttachment } from './item-attachment.js';

// Startup, profile switching and reset share the same save hydration.
export function readProfileSnapshot(saved,kind){
  return {
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
