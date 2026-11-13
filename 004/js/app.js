import { createKickFlight, kickFlightFrame, kickTiming } from './kick-motion.js?v=20261113-f32e3f65f3';
import { vitalLimits, formatBodyDamage, applyVitalAction, advanceVitals, hungerStage, hungerMoment } from './vital-state.js?v=20261113-f32e3f65f3';
import { createLethalImpact, advanceLethalImpact } from './death-sequence.js?v=20261113-f32e3f65f3';
import { createEndScreen } from './end-screen.js?v=20261113-f32e3f65f3';
import { nextRepeatStreak } from './action-repeat.js?v=20261113-f32e3f65f3';
import { pickupTypes, createIndividual, individualProfile, individualInitialEmotions, individualCareCandidates } from './individuality.js?v=20261113-f32e3f65f3';
import { rememberEvent, softenEventMemory, fadeEventMemory, recallEvent, memoryCareCandidates } from './event-memory.js?v=20261113-f32e3f65f3';
import { bindDialogKeyboard } from './dialog-keyboard.js?v=20261113-f32e3f65f3';
import { readProfileSnapshot, createBehaviorStates, createReliefMemory } from './profile-state.js?v=20261113-f32e3f65f3';
import { resolveDisplayedFace, resolveIdleFace, resolvePose } from './display-policy.js?v=20261113-f32e3f65f3';
import { createRoomPainter } from './room-painter.js?v=20261113-f32e3f65f3';
import { sceneViewport } from './scene-viewport.js?v=20261113-f32e3f65f3';
import { setupCompactUI } from './compact-ui.js?v=20261113-f32e3f65f3';
import { advanceDespairState, despairLines, despairCareLines, despairRecoveryMoment } from './despair-state.js?v=20261113-f32e3f65f3';
import { chooseWeighted } from './random-choice.js?v=20261113-f32e3f65f3';
import { babyVoice, spokenText } from './speech-text.js?v=20261113-f32e3f65f3';
import { dialogueTone, dialogueFace, careCandidates, actionBaseTone, faceTones, characterVoice, isRedCrying } from './dialogue-policy.js?v=20261113-f32e3f65f3';
import { lossAttachmentScale } from './item-attachment.js?v=20261113-f32e3f65f3';
import { planAfterglow } from './afterglow-plan.js?v=20261113-f32e3f65f3';
import { reactionDescription, reactionOpening, actionTitle } from './reaction-description.js?v=20261113-f32e3f65f3';
import { profiles, careIds, actionIds, emotionalLines, guardedCare, actionLines, extraActions, repeatLines, responseGroups, responseExtras, idleExtras, idleOverrides } from './game-data.js?v=20261113-f32e3f65f3';
import { readSave, writeSave, removeSave, readSelected, writeSelected } from './storage.js?v=20261113-f32e3f65f3';
import { toneWeights, emotionFace, emotionMood, actionEmotionValues, settledEmotionValues } from './emotion-core.js?v=20261113-f32e3f65f3';
import { posedSVG } from './character-art.js?v=20261113-f32e3f65f3';
import { createCanvasPainter } from './canvas-painter.js?v=20261113-f32e3f65f3';
import { createCharacterPainter, characterDimensions } from './character-painter.js?v=20261113-f32e3f65f3';
import { idleStateCandidates, idleDistanceBehavior, idleItemPlan, nightSleepTransition } from './behavior-policy.js?v=20261113-f32e3f65f3';

// Single simulation instance. Pure calculations and drawing live in their own modules.
const $ = id => document.getElementById(id);
const canvas = $('room');
const ctx = canvas.getContext('2d');
const painter = createCanvasPainter(ctx);
const drawCharacter=createCharacterPainter(ctx,painter);
const renderEndScreen=createEndScreen(document);
const { drawShelter, drawRoom } = createRoomPainter(ctx,painter);

let selected = readSelected(profiles);
let kind = selected || 'evil';
let profile = profiles[kind];
let saved = readSave(kind);
let {vitals,elapsed,logs,seen,toyPresent,pochettePresent,blanketPresent,bedOffset,actionCounts,repeatStreak,emotions,despair,itemAttachment,eventMemory,individual}=readProfileSnapshot(saved,kind);
profile=individualProfile(profile,kind,individual);
let paused = false;
let speed = 1;
let night = false;
let t = 0;
let stateTime = 0;
let current = 0;
let x = 615;
let y = 445;
let attention = 0;
let last = performance.now();
let speechUntil = 0;
let speechFace=null;
let speechIsRedCry=false;
let lastReply=null;
let saveClock = 0;

function makeStates(){
  return createBehaviorStates(kind,profile);
}
let states=makeStates();
let reliefMemory=createReliefMemory();
let distanceMode='neutral';
let afterglow=null;
let reaction=null;
let lastTone='neutral';
let deathAge=0;
// Death is latched immediately; only its visual transition waits for the final impact.
let lethalImpact=null;
let nextHungerAt=0;
function showResults(){
  $('game-main').inert=true;
  renderEndScreen({profile,elapsed,emotions,vitals,actionCounts},stamp);
}
function finishRun(){
  // Lethal state has already been latched by vital-state; never schedule another reaction.
  elapsed=vitals.diedAt;
  lethalImpact=null;
  reaction=null;
  afterglow=null;
  attention=0;
  deathAge=0;
  speechFace=null;
  speechIsRedCry=false;
  $('speech').classList.remove('show');
  $('secondary-panel').classList.remove('is-open');
  $('details-scrim').hidden=true;
  $('open-details').setAttribute('aria-expanded','false');
  $('game-main').inert=true;
  $('action').textContent='動きが止まり、体色が変わった。';
  $('mood').textContent='死亡した。';
  $('live').textContent='● 終了';
  record(vitals.cause==='hunger'?'食事を取らない時間が続き、餓死した。':'身体ダメージが限界に達し、死亡した。');
  actionUI();
}
function restoreEndedRun(){
  lethalImpact=null;
  deathAge=vitalLimits.deathDisplaySeconds;
  reaction=null;afterglow=null;attention=0;
  $('speech').classList.remove('show');
  $('action').textContent='この個体は死亡した。';
  $('mood').textContent='死亡した。';
  $('live').textContent='● 終了';
  showResults();
  actionUI();
}
function vitalUI(){
  $('body-damage').textContent=formatBodyDamage(vitals.damage)+' / '+vitalLimits.damage;
  const stage=hungerStage(vitals.hunger);
  const label=['満たされている','空腹','強い空腹','衰弱'][stage];
  $('hunger-status').textContent=(vitals.dead?'終了':label)+' · '+Math.floor(vitals.hunger/vitalLimits.hungerSeconds*100)+'%';
}
function startHungerMoment(){
  if(vitals.dead||despair.active||paused||reaction||afterglow||t<nextHungerAt)return false;
  const step=hungerMoment(vitals.hunger);
  if(!step)return false;
  afterglow={action:'hunger',steps:[step],index:0,age:0};
  nextHungerAt=t+25;
  stateTime=0;
  showAfterglowStep();
  return true;
}
function weighted(items, remember=true){
  const candidates=remember?items.map(item=>({...item,text:characterVoice(item.text,kind,item.tone)})):items;
  const item=chooseWeighted(candidates,Math.random,remember?lastUtterance:undefined);
  if(remember){
    lastUtterance=item.text;
    lastTone=item.tone||'neutral';
    lastReply={text:item.text,tone:lastTone,face:dialogueFace(lastTone,emotions,'neutral',{kind,text:item.text})};
  }
  return item;
}
function careReply(base,action,phase=1){
  if(despair.active)return despairReply(action);
  const remembered=reaction?.action===action?reaction.memory:null;
  const canRelieve=!remembered&&reliefMemory.threatened&&reliefMemory.cooldown<=0&&emotions.fear<25&&emotions.hate<35&&emotions.satisfaction>=45;
  const candidates=individualCareCandidates(careCandidates(base,guardedCare[action][kind],emotions,profile.baby,canRelieve),individual,action,profile.baby);
  const reply=weighted(memoryCareCandidates(candidates,remembered,phase));
  if(reply.tone==='relieved'){reliefMemory.threatened=false;reliefMemory.cooldown=60;reliefMemory.until=t+12;}
  return reply.text;
}
function emotionalReply(base, action, phase=1){
  if(despair.active)return despairReply(action);
  if(careIds.includes(action))return careReply(base, action,phase);
  const weights=toneWeights(emotions,individual);
  const tone=actionBaseTone(kind,action,phase);
  const items=base.map(text=>{const tag=dialogueTone(text,tone);return {text,tone:tag,weight:(weights[tag]||(tag==='pain'?weights.afraid:weights.neutral))*2};});
  // Initial reactions describe the event itself. Later reactions may express distress,
  // but a high satisfaction score must never turn a loss or a blow into celebration.
  if(phase>0)for(const tag of ['angry','afraid','sad','plead']){
    if(['slap','kick'].includes(action)&&tag==='plead')continue;
    for(const text of emotionalLines[kind][tag])items.push({text,tone:dialogueTone(text,tag),weight:weights[tag]});
  }

  return weighted(items).text;
}
function changeEmotions(action,count,lossScale=1){
  Object.assign(emotions,actionEmotionValues(emotions,action,count,kind,individual,lossScale));
}
function despairReply(action){
  const lines=careIds.includes(action)?despairCareLines(action,profile.baby):despairLines(profile.baby);
  return weighted(lines.map(text=>({text,tone:'despair',weight:1}))).text;
}
function presentDespair(){
  $('action').textContent='伏せたまま、涙目でかすかに笑い、力なく声を漏らしている。';
  $('mood').textContent='反発する気力も失い、全てを諦めている。';
  speak(despairReply(),4,{tone:'despair'});
}
function advanceDespair(d){
  if(paused||vitals.dead)return;
  const event=advanceDespairState(despair,emotions,d);
  if(event==='entered'){
    afterglow=null;
    attention=0;
    stateTime=0;
    record('つらい状態が長く続き、伏せたまま反発することもやめた。');
    presentDespair();
  }else if(event==='recovered'){
    const step=despairRecoveryMoment(kind);
    afterglow={action:'recovered',until:t+step.duration,steps:[step],index:0,age:0};
    stateTime=0;
    attention=0;
    distanceMode=currentDistanceBehavior().mode;
    showAfterglowStep();
  }
}
function advanceItemMemory(d){
  if(paused)return;
  if(toyPresent)itemAttachment.kumacha=Math.min(86400,itemAttachment.kumacha+d);
  if(pochettePresent)itemAttachment.pochette=Math.min(86400,itemAttachment.pochette+d);
  reliefMemory.cooldown=Math.max(0,reliefMemory.cooldown-d);
  if(reliefMemory.threatened&&emotions.fear<25){
    reliefMemory.calmTime+=d;
    if(reliefMemory.calmTime>30)reliefMemory.threatened=false;
  }
}
function attachmentReplies(action){
  if(!reaction||reaction.action!==action||reaction.lossScale<1.1)return [];
  const item=action==='toy'?'クマチャ':action==='takePochette'?'ポシェ':null;
  if(!item)return [];
  return [item+'！ ズット、イッショ！',item+'！ カエシテ！ モーヤメッ！'].map(line=>profile.baby?babyVoice(line):line);
}
function startItemMoment(){
  if(vitals.dead||vitals.hunger>=120||reaction||afterglow||paused||despair.active||emotions.fear>=35||emotions.hate>=45)return false;
  const plan=idleItemPlan({baby:profile.baby,toyPresent,pochettePresent,night,individual,itemAttachment});
  if(!plan.candidates.length||Math.random()>plan.probability)return false;
  const choice=weighted(plan.candidates,false).step;
  afterglow={action:'idleItem',steps:[choice],index:0,age:0};
  stateTime=0;
  showAfterglowStep();
  return true;
}
function settleEmotions(d){
  if(!reaction)Object.assign(emotions,settledEmotionValues(emotions,d,blanketPresent));
}
function nextEmotionalState(){
  return weighted(idleStateCandidates(states,{emotions,individual,current,blanketPresent,distanceMode:currentDistanceBehavior().mode,night}),false).index;
}
let lastUtterance='';
function actionReply(action, phase){
  const base=actionLines[kind][action][phase];
  const extras=[...(responseExtras[kind][responseGroups[action]]?.[phase]||[]),...attachmentReplies(action)].filter(text=>action!=='clap'||!text.includes('イヂャイ'));
  return emotionalReply([base, ...extras], action, phase);
}
function idleReply(state){
  const extras=idleOverrides[kind]?.[state.key]||idleExtras[state.key];
  const lines=[state.say,...extras.map(line=>profile.baby?babyVoice(line):line)];
  const tone=state.key==='sleep'?'neutral':state.key==='look'&&kind==='evil'?'angry':'neutral';
  return weighted(lines.map(text=>({text,tone:dialogueTone(text,tone),weight:1}))).text;
}
function canPerformAction(action) {
  if (vitals.dead || paused || reaction || !$('picker').hidden || !$('reset-dialog').hidden) return false;
  if (action === 'shift' || action === 'blanket') return blanketPresent;
  if (action === 'takePochette') return pochettePresent;
  if (action === 'gift') return !toyPresent;
  if (action === 'pochette') return !pochettePresent;
  if (action === 'restore') return !blanketPresent;
  return actionIds.includes(action);
}
function actionUI() {
  vitalUI();
  for(const id of ['pause','speed','light','expression','pose','choose','reset','open-details'])$(id).disabled=vitals.dead;
  for (const id of actionIds) $(id).disabled = !canPerformAction(id);
  $('returnBlanket').disabled = !canPerformAction('restore');
  $('gift').textContent = toyPresent ? 'クマのぬいぐるみを持っています' : 'クマのぬいぐるみを渡す';
  $('pochette').textContent = pochettePresent ? (profile.baby ? 'ポシェットで遊んでいます' : 'ポシェットを装着しています') : 'ポシェットを渡す';
  $('blanket').textContent = '布団を取り上げる';
  $('interact-status').textContent = lethalImpact ? '衝撃を受けています' : vitals.dead ? '終了 · リザルトを表示します' : paused ? '一時停止中' : reaction ? '反応中 · ' + reaction.count + '回目' : despair.active ? '絶望状態 · 操作できます' : afterglow ? '余韻中 · 続けて操作できます' : blanketPresent ? '操作を選んでください' : '布団を取り上げた状態';
}
function interfere(action){
  if(!canPerformAction(action))return;
  afterglow=null;
  const dimensions=characterDimensions(profile.baby);
  const kickFlight=action==='kick'?createKickFlight({x,y,...dimensions,view:sceneViewport(canvas.width,canvas.height),canvasWidth:canvas.width}):null;
  const remembered=despair.active?null:recallEvent(eventMemory,action,kind,profile.baby);
  rememberEvent(eventMemory,action,individual);
  const lossScale=lossAttachmentScale(action,itemAttachment,toyPresent,pochettePresent,individual);
  if(action==='pochette')pochettePresent=true;
  if(action==='takePochette')pochettePresent=false;
  if(action==='restore')blanketPresent=true;
  if(action==='gift')toyPresent=true;
  if(action==='toy')toyPresent=false;
  if(action==='blanket'){
    blanketPresent=false;
  }
  actionCounts[action]=(Number(actionCounts[action])||0)+1;
  repeatStreak=nextRepeatStreak(repeatStreak,action,elapsed);
  changeEmotions(action,repeatStreak.count,lossScale);
  if(applyVitalAction(vitals,action,{baby:profile.baby,despairActive:despair.active,elapsed})){
    record('【'+actionTitle(action)+' / '+actionCounts[action]+'回目】身体に衝撃が加わった。');
    lethalImpact=createLethalImpact(action,{x,y,despairActive:despair.active,kickFlight});
    reaction=null;afterglow=null;attention=0;
    $('speech').classList.remove('show');
    $('action').textContent=extraActions[action]?.first||'小突かれ、体がよろけた。';
    persist();actionUI();
    return;
  }
  if(!careIds.includes(action)&&emotions.fear>=35){reliefMemory.threatened=true;reliefMemory.calmTime=0;}
  reaction={
    ...(kickFlight?{kickFlight}:{}),
    ...(remembered?{memory:remembered}:{}),
    action,
    age:0,
    phase:0,
    count:actionCounts[action],
    lossScale,
    face:extraActions[action]?.startFace||(action==='tease'||action==='restore'?'smile':'surprise'),
    originX:x,
    originY:y,
    bedFrom:bedOffset,
    bedTo:bedOffset>0?-65:65
  };
  expressionMode='auto';
  $('expression').value='auto';
  $('face-mode').textContent='行動に合わせて変わります';
  attention=0;
  const opening=reactionOpening(action,reaction.count,remembered);
  $('action').textContent=opening.text;
  $('mood').textContent=opening.mood;
  record('【'+actionTitle(action)+' / '+reaction.count+'回目】'+opening.text);
  speak(actionReply(action, 0), 2.3);

  $('mood').textContent=despair.active?'反発する気力も失い、全てを諦めている。':remembered?'以前の出来事を覚えており、世話を受けながらも警戒している。':emotionMood(emotions);
  if(despair.active)$('action').textContent='伏せたまま、力なく反応している。';
  persist();
  actionUI();
}
function renderReactionDescription(r) {
  if(despair.active){$('action').textContent='伏せたまま、力なく声を漏らしている。';$('mood').textContent='反発する気力も失い、全てを諦めている。';return;}
  const description = r.memory&&lastTone==='cautious'?{text:r.memory.second,mood:'以前の出来事を覚えており、まだ手放しでは喜べない。'}:reactionDescription(r.action, lastTone, kind, profile.baby, r.face);
  $('action').textContent = description.text;
  $('mood').textContent = description.mood ?? emotionMood(emotions);
}
function advanceReaction(d){
  if(!reaction)return;
  const r=reaction;
  r.age+=d;
  const celebrating=afterglow?.action==='recovered'&&t<afterglow.until;
  if(r.memory?.key==='hand'&&r.phase===0){
    const recoil=Math.min(r.age/.7,1);
    x=r.originX-14*recoil;
    y=r.originY-8*recoil;
  }
  if (r.action === 'slap') {
    x = r.originX + Math.sin(Math.min(r.age / .65, 1) * Math.PI / 2) * 42;
    y = r.originY;
  }
  if(r.action==='shift'){
    bedOffset=r.bedFrom+(r.bedTo-r.bedFrom)*Math.min(r.age/1.2, 1);
    if(r.age>2.3)x+=(485+bedOffset-x)*Math.min(d*.7, 1);
  }
  if(r.action==='ignore'&&r.age<2.3)y=r.originY+Math.min(r.age/2.3, 1)*20;
  if(r.action==='shoo')x=r.originX-Math.min(r.age/1.6, 1)*42;
  if(r.action==='poke'){
    x=r.originX+Math.sin(Math.min(r.age, 1)*Math.PI/2)*20;
    y=r.originY;
  }
  if(r.action==='kick'){
    const flight=kickFlightFrame(r.kickFlight,r.age);
    x=flight.x;y=flight.y;
  }
  if(r.age>=(r.action==='kick'?kickTiming.duration:2.3)&&r.phase===0){
    r.phase=1;
    softenEventMemory(eventMemory,r.action);
    if(!celebrating){
      speak(actionReply(r.action,1),5);
      renderReactionDescription(r);
      record($('action').textContent);
    }
  }
  if(r.age>=5&&r.phase===1&&!careIds.includes(r.action)){
    r.phase=2;
    if(!celebrating){
      const lines=[actionLines[kind][r.action][1],...attachmentReplies(r.action)];
      if(r.count>=2)lines.push(repeatLines[kind][r.count>=3?1:0]);
      speak(emotionalReply(lines, r.action, 2), 4);

      $('mood').textContent=emotionMood(emotions);
      renderReactionDescription(r);
      record($('action').textContent);
    }
  }
  if(r.age>=8+(r.lossScale-1)*5){
    reaction=null;
    startAfterglow(r);
  }
}
function showAfterglowStep(){
  const step=afterglow.steps[afterglow.index];
  afterglow.step=step;
  $('action').textContent=step.text;
  $('mood').textContent=step.mood??(step.type==='toySleep'?'クマのぬいぐるみのそばで、眠気に身を任せている。':step.type==='pochettePride'?'お気に入りを見せびらかし、得意になっている。':step.type==='relax'?'怖さが和らぎ、ほっとしている。':emotionMood(emotions));
  const line=weighted(step.lines.map(text=>({text,weight:1})),false).text;
  speak(profile.baby?babyVoice(line):line,step.type==='revive'?step.duration:3,{tone:step.type==='watch'?'cautious':step.type==='sniff'?'sad':faceTones[step.face]||'neutral',face:step.face});
  step.face=speechFace;
  record(step.text);
}
function startAfterglow(previous){
  if(despair.active){afterglow=null;stateTime=0;presentDespair();return;}
  const revival=afterglow?.action==='recovered'&&afterglow.until>t?{...afterglow.step,duration:afterglow.until-t}:null;
  afterglow={action:previous.action,steps:planAfterglow(previous.action,previous.face,emotions,toyPresent).map(step=>({...step,duration:step.duration*(step.type==='sniff'?(previous.lossScale||1):1)})),index:0,age:0};
  if(previous.memory&&!afterglow.steps.some(step=>step.type==='watch'))afterglow.steps.unshift({type:'watch',duration:4.5,pose:'fists',face:emotionFace(emotions,'alert'),text:previous.memory.afterglow,lines:[previous.memory.later[0]]});
  if(revival)afterglow.steps.unshift(revival);
  stateTime=0;
  attention=0;
  showAfterglowStep();
}
function advanceAfterglow(d){
  if(!afterglow||paused)return;
  afterglow.age+=d;
  while(afterglow&&afterglow.age>=afterglow.step.duration){
    afterglow.age-=afterglow.step.duration;
    afterglow.index++;
    if(afterglow.index>=afterglow.steps.length){
      afterglow=null;
      enter(nextEmotionalState());
    }else showAfterglowStep();
  }
}
function currentDistanceBehavior(){
  return idleDistanceBehavior({emotions,baby:profile.baby,individual,night,blanketPresent});
}
function distanceTarget(){
  const behavior=currentDistanceBehavior();
  const s=states[current];
  return behavior.mode==='neutral'?{...behavior,x:s.tx+(['blanket','sleep'].includes(s.key)?bedOffset:0),y:s.ty}:behavior;
}
function presentDistance(behavior){
  $('action').textContent=behavior.text;
  $('mood').textContent=emotionMood(emotions);
  const line=weighted(behavior.lines.map(text=>({text,weight:1})),false).text;
  speak(profile.baby?babyVoice(line):line,4,{tone:behavior.mode==='protest'?'angry':behavior.mode==='hide'?'afraid':'happy'});
}
function advanceDistance(d){
  if(paused||vitals.dead)return;
  if(despair.active||afterglow?.step.type==='toySleep')return;
  const target=distanceTarget();
  if(target.mode!==distanceMode){
    distanceMode=target.mode;
    if(distanceMode!=='neutral'){
      record(target.text,'distance:'+distanceMode);
      if(!afterglow)presentDistance(target);
    }else if(!afterglow)enter(current);
  }
  // Follow-through gestures continue while the creature changes its distance.
  if(!afterglow||target.mode!=='neutral'){
    const fatigue=vitals.hunger>=150?.35:vitals.hunger>=120?.6:1;
    const rate=Math.min(d*(target.mode==='hide'?1.5:.85)*fatigue,1);
    x+=(target.x-x)*rate;
    y+=(target.y-y)*rate;
  }
}
function shelterOccludes(){
  return !vitals.dead&&!reaction&&distanceMode==='hide'&&x>500&&x<680&&y<490;
}
let expressionMode='auto';
let poseMode='auto';
function displayedFace(k,key){
  if(lethalImpact)return 'hurt';
  return resolveDisplayedFace({kind:k,key,emotions,reaction,expressionMode,despairActive:despair.active,speechIsRedCry,t,speechUntil,speechFace,attention,afterglow,distanceMode,canRelieve:t<reliefMemory.until,dead:vitals.dead});
}
function autoFace(k,key){
  return resolveIdleFace(k,key,emotions,t<reliefMemory.until);
}
function currentPose(k,key){
  if(lethalImpact)return lethalImpact.pose;
  return resolvePose({kind:k,key,emotions,reaction,poseMode,despairActive:despair.active,afterglow,distanceMode,baby:profile.baby,individual,dead:vitals.dead});
}
function mini(k){
  return posedSVG(k, 'stand', k==='white'?'smile':'neutral')
}
function updateProfile(){
  $('profile-title').textContent=profile.name;
  $('mobile-profile').textContent=profile.name;
  $('profile-sub').textContent=profile.sub;
  $('length').textContent=profile.length;
  $('capture-place').textContent=profile.capturePlace;
  $('feature').textContent=profile.feature;
  $('avatar').innerHTML=mini(kind);
  $('nursery').hidden=!profile.baby;
  $('picker-close').hidden=!selected||vitals.dead;
  canvas.setAttribute('aria-label', profile.name+'を閉じ込めた部屋')
}
function selectProfile(k, fresh=false, pickedIndividual=null){
  if(selected)persist();
  $('end-screen').hidden=true;
  $('game-main').inert=false;
  deathAge=0;nextHungerAt=0;lethalImpact=null;
  kind=k;
  profile=profiles[k];
  saved=fresh?{
  } :readSave(k);
  if(fresh&&pickedIndividual){saved.individual=pickedIndividual;saved.emotions=individualInitialEmotions(k,pickedIndividual);}
  reaction=null;
  afterglow=null;
  speechFace=null;
  speechIsRedCry=false;
  lastReply=null;
  speechUntil=0;
  distanceMode='neutral';
  ({vitals,elapsed,logs,seen,toyPresent,pochettePresent,blanketPresent,bedOffset,actionCounts,repeatStreak,emotions,despair,itemAttachment,eventMemory,individual}=readProfileSnapshot(saved,k));
  profile=individualProfile(profile,k,individual);
  reliefMemory=createReliefMemory();
  states=makeStates();
  current=0;
  stateTime=0;
  t=0;
  attention=0;
  x=states[0].tx;
  y=states[0].ty;
  selected=k;
  writeSelected(k);
  $('picker').hidden=true;
  paused=false;
  $('pause').textContent='Ⅱ 一時停止';
  $('pause').setAttribute('aria-pressed', false);
  $('live').textContent='● 稼働中';
  updateProfile();
  if(!logs.length)logs=[{
    time:0,
    text:profile.name+'を、空き部屋へ連れてきた。'
  }];
  if(vitals.dead)restoreEndedRun();else enter(0);
  last=performance.now();
  if(!vitals.dead)$('choose').focus()
}
function pickupIndividual(type){
  const picked=createIndividual(type);
  selectProfile(picked.kind,true,picked.individual);
}
function stamp(v){
  let s=Math.floor(v);
  return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
}
function renderLog(){
  $('log').replaceChildren();
  for(const a of logs){
    const e=document.createElement('div');
    e.className='entry';
    const tm=document.createElement('time');
    tm.textContent=stamp(a.time);
    const p=document.createElement('span');
    p.textContent=a.text.replace(/毛布|寝床/g,'布団');
    e.append(tm, p);
    $('log').append(e)
  }
  const behaviorKeys=new Set(states.map(state=>state.key));
  const observed=[...seen].filter(key=>behaviorKeys.has(key)).length;
  const total=behaviorKeys.size;
  $('count').textContent=observed+' / '+total;
  $('progress').style.width=(total?observed/total*100:0)+'%';
  $('behavior-progress').setAttribute('aria-valuemax',total);
  $('behavior-progress').setAttribute('aria-valuenow',observed)
}
function record(text, key){
  if(key)seen.add(key);
  logs.unshift({
    time:elapsed, text
  });
  logs=logs.slice(0, 35);
  renderLog();
  persist()
}
function persist(){
  if(!selected)return;
  writeSave(kind, {
    vitals, elapsed, logs, seen:[...seen], blanket:blanketPresent, bedOffset, actionCounts, repeatStreak, emotions, toyPresent, pochettePresent, itemAttachment, despair, eventMemory, individual
  });
}
function enter(i){
  if(vitals.dead)return;
  if(!blanketPresent&&(i===6||i===7))i=5;
  current=i;
  stateTime=0;
  if(despair.active){presentDespair();return;}
  const s=states[i];
  const behavior=currentDistanceBehavior();
  if(behavior.mode!=='neutral'){
    presentDistance(behavior);
    record(behavior.text,'distance:'+behavior.mode);
    return;
  }
  $('action').textContent=s.name;
  $('mood').textContent=s.mood;
  record(s.text, s.key);
  speak(idleReply(s),4,{face:autoFace(kind,s.key)});
  $('mood').textContent=emotionMood(emotions)
}
function speak(text,seconds=3,presentation={}){
  if(vitals.dead)return;
  text=spokenText(text,kind);
  const chosen=lastReply?.text===text?lastReply:null;
  const tone=dialogueTone(text,presentation.tone||chosen?.tone||'neutral',reaction?careIds.includes(reaction.action):false);
  speechIsRedCry=isRedCrying(text,kind);
  speechFace=dialogueFace(tone,emotions,presentation.face||chosen?.face||autoFace(kind,states[current].key),{kind,text});
  if(reaction)reaction.face=speechFace;
  $('speech').textContent=characterVoice(text,kind,tone);
  speechUntil=t+seconds;
  $('speech').classList.add('show');
}

function room(){
  drawRoom({night,blanketPresent,bedOffset,current,stateTime});
}
function resetCurrent(){
  if(!selected||vitals.dead)return;
  $('reset-dialog').hidden=false;
  $('reset-cancel').focus();
}
function performReset(){
  if(!selected)return;
  const k=kind;
  removeSave(k);
  selected=null;
  reaction=null;
  expressionMode='auto';
  poseMode='auto';
  $('expression').value='auto';
  $('pose').value='auto';
  $('face-mode').textContent='行動に合わせて変わります';
  night=false;
  speed=1;
  $('speed').textContent='速度 ×1';
  $('speed').setAttribute('aria-pressed', false);
  $('light').textContent='☾ 夜にする';
  $('light').setAttribute('aria-pressed', false);
  $('light-label').textContent='窓辺の空き部屋 · 昼';
  lastUtterance='';
  saveClock=0;
  selectProfile(k, true,individual);
  $('reset-dialog').hidden=true;
  $('timer').textContent='00:00';
  $('compact-timer').textContent='00:00';
  actionUI();
}
function mouse(){
  const key=vitals.dead||reaction||afterglow||despair.active||distanceMode!=='neutral'?'look':states[current].key;
  const anchor=drawCharacter({kind,baby:profile.baby,key,x,y,t,target:distanceTarget(),face:displayedFace(kind,key),pose:currentPose(kind,key),reaction:lethalImpact||reaction,afterglow,despairActive:despair.active,toyPresent,pochettePresent,dead:vitals.dead&&!lethalImpact,damage:vitals.damage});
  const view=sceneViewport(canvas.width,canvas.height);
  $('speech').style.left=((anchor.x*view.scale+view.offsetX)/canvas.width*100)+'%';
  $('speech').style.top=((anchor.y*view.scale+view.offsetY)/canvas.height*100)+'%';
}
function advanceSimulation(d){
  if(vitals.dead)return;
  t+=d;
  elapsed+=d;
  const resting=blanketPresent&&(states[current].key==='sleep'||afterglow?.step.type==='toySleep');
  if(advanceVitals(vitals,d,{elapsed,resting,recovering:!reaction&&!despair.active})){finishRun();return;}
  settleEmotions(d);
  advanceItemMemory(d);
  fadeEventMemory(eventMemory,d,!reaction&&emotions.fear<35&&emotions.hate<45);
  advanceDespair(d);
  if(reaction)advanceReaction(d);
  else if(despair.active){
    stateTime+=d;
    if(stateTime>=8){stateTime=0;presentDespair();}
  }else if(afterglow){
    advanceDistance(d);
    advanceAfterglow(d);
  }else{
    stateTime+=d;
    attention=Math.max(0,attention-d);
    advanceDistance(d);
    if(stateTime>states[current].duration){
      if(!startHungerMoment()&&!startItemMoment())enter(nextEmotionalState());
    }
  }
  if(t>speechUntil)$('speech').classList.remove('show');
  saveClock+=d;
  if(saveClock>5){saveClock=0;persist();}
}
function advanceEndSequence(seconds){
  if(lethalImpact){
    const impact=advanceLethalImpact(lethalImpact,seconds);
    x=impact.x;
    if(impact.y!==undefined)y=impact.y;
    if(impact.complete)finishRun();
  }else{
    deathAge+=seconds;
    if(deathAge>=vitalLimits.deathDisplaySeconds)showResults();
  }
}
function tick(now){
  const dt=Math.max(0,Math.min((now-last)/1000,.1));
  last=now;
  if(vitals.dead){
    if(!document.hidden&&$('end-screen').hidden&&$('picker').hidden){
      advanceEndSequence(dt);
    }
  }else if(!document.hidden&&!paused&&$('picker').hidden&&$('reset-dialog').hidden)advanceSimulation(dt*speed);
  const view=sceneViewport(canvas.width,canvas.height);
  ctx.setTransform(1,0,0,1,0,0);
  ctx.fillStyle='#e6e3d5';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.setTransform(view.scale,0,0,view.scale,view.offsetX,view.offsetY);
  room();mouse();
  if(shelterOccludes())drawShelter();
  actionUI();
  $('timer').textContent=stamp(elapsed);
  $('compact-timer').textContent=stamp(elapsed);
  requestAnimationFrame(tick);
}
function resize(){
  const r=canvas.getBoundingClientRect();
  let d=Math.min(devicePixelRatio||1, 2);
  canvas.width=r.width*d;
  canvas.height=r.height*d
}
function initialize() {
  $('end-screen').hidden=true;
  $('end-retry').onclick=()=>performReset();
  $('end-pick').onclick=()=>{
    $('end-screen').hidden=true;
    $('picker').hidden=false;
    $('picker-close').hidden=true;
    $('options').querySelector('button').focus();
  };
  bindDialogKeyboard($('end-screen'),document,()=>[$('end-retry'),$('end-pick')],()=>{});
  setupCompactUI(document,window);
  for(const a of actionIds)$(a).onclick=()=>interfere(a);
  $('returnBlanket').onclick=()=>interfere('restore');
  $('expression').onchange=()=>{
    if(vitals.dead)return;
    expressionMode=$('expression').value;
    $('face-mode').textContent=expressionMode==='auto'?'行動に合わせて変わります':'表情プレビュー中（行動は継続）'
  };
  $('pose').onchange=()=>{
    if(vitals.dead)return;
    poseMode=$('pose').value;
  };
  for(const choice of pickupTypes){
    const b=document.createElement('button');
    b.className='option';
    b.innerHTML=mini(choice.art)+`<strong>${choice.name}</strong><small>${choice.sub}</small><p>${choice.description}</p>`;
    b.onclick=()=>pickupIndividual(choice.type);
    $('options').append(b);
  }
  $('choose').onclick=()=>{
    if(vitals.dead)return;
    persist();
    $('picker').hidden=false;
    $('picker-close').hidden=false;
    $('options').querySelector('button').focus()
  };
  $('picker-close').onclick=()=>{
    if(vitals.dead){$('picker').hidden=true;showResults();return;}
    $('picker').hidden=true;
    last=performance.now();
    $('choose').focus()
  };
  bindDialogKeyboard($('picker'),document,()=>[...$('picker').querySelectorAll('button')].filter(button=>!button.hidden),()=>{
    if(selected)$('picker-close').onclick();
  });
  $('reset-cancel').onclick=()=>{
    $('reset-dialog').hidden=true;
    $('reset').focus();
  };
  $('reset-confirm').onclick=()=>performReset();
  bindDialogKeyboard($('reset-dialog'),document,()=>[$('reset-cancel'),$('reset-confirm')],()=>$('reset-cancel').onclick());
  $('reset').onclick=resetCurrent;
  new ResizeObserver(resize).observe(canvas);
  $('pause').onclick=()=>{
    if(vitals.dead)return;
    paused=!paused;
    $('pause').textContent=paused?'▶ 再開':'Ⅱ 一時停止';
    $('pause').setAttribute('aria-pressed', paused);
    $('live').textContent=paused?'Ⅱ 一時停止中':'● 稼働中';
    persist()
  };
  $('speed').onclick=()=>{
    if(vitals.dead)return;
    speed=speed===1?2:1;
    $('speed').textContent='速度 ×'+speed;
    $('speed').setAttribute('aria-pressed', speed===2)
  };
  $('light').onclick=()=>{
    if(vitals.dead)return;
    night=!night;
    $('light').textContent=night?'☀ 昼にする':'☾ 夜にする';
    $('light').setAttribute('aria-pressed', night);
    $('light-label').textContent='窓辺の空き部屋 · '+(night?'夜':'昼');
    const sleepTransition=nightSleepTransition({night,blanketPresent,reaction,afterglow,despairActive:despair.active,distanceMode:currentDistanceBehavior().mode,key:states[current].key,stateTime,duration:states[current].duration});
    if(sleepTransition.ready){
      distanceMode='neutral';
      stateTime=sleepTransition.stateTime;
    }
    if(!paused){
      if(despair.active){presentDespair();record(night?'暗くなっても、伏せたまま動こうとしない。':'明るくなっても、伏せたまま力なく声を漏らした。');return;}
      if(afterglow){afterglow=null;enter(current);}
      speak(kind==='red'?(night?'クラ……ミャンミャ！':'ア……アカリュイ！'):night?'……クラ……ネンネ？':'ア……アカルイ……');
      record(night?'窓の外が暗くなると、布団のほうを見た。':'明るい窓に気づき、目を細めた。')
    }
  };
  canvas.onclick=e=>{
    if(vitals.dead||paused||reaction||!$('picker').hidden||!$('reset-dialog').hidden||attention>0)return;
    const r=canvas.getBoundingClientRect(),
    view=sceneViewport(r.width,r.height),
    mx=(e.clientX-r.left-view.offsetX)/view.scale,
    my=(e.clientY-r.top-view.offsetY)/view.scale;
    const { width, height } = characterDimensions(profile.baby);
    if(Math.abs(mx-x)<width/2+8&&my>y-height-8&&my<y+12){
      if(despair.active){presentDespair();return;}
      if(afterglow){afterglow=null;enter(current);}
      attention=6;
      speak(kind==='red'?'ニンゲンシャン？':kind==='white'?'チャリュ、ミチェ！':kind==='evil'?'ナニ！ ミルナ！':states[current].key==='sleep'?'……ン……？':'……ナニ？');
      record('視線に気づいたらしく、こちらを見た。')
    }
  };
  document.addEventListener('visibilitychange', ()=>{
    last=performance.now();
    persist()
  });
  window.addEventListener('pagehide', persist);
  if(!logs.length){
    logs=[{
      time:0,
      text:'路地裏で拾った白鼠種を、空き部屋に連れてきた。'
    }]
  }
  updateProfile();
  $('picker').hidden=!!selected;
  renderLog();
  if(selected){if(vitals.dead)restoreEndedRun();else enter(0);}
  else $('options').querySelector('button').focus();
  resize();
  requestAnimationFrame(tick);
}
initialize();
