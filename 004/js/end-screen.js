import { vitalLimits } from './vital-state.js';
import { actionIds, careIds } from './action-data.js';
import { actionTitle } from './reaction-description.js';

export function createEndScreen(doc){
  const get=id=>doc.getElementById(id);
  return function renderEndScreen({profile,elapsed,emotions,vitals,actionCounts},stamp){
    get('end-subject').textContent=profile.name+' · '+profile.length+' · '+profile.capturePlace;
    get('end-cause').textContent=vitals.cause==='hunger'?'餓死':'身体ダメージ';
    get('end-time').textContent=stamp(Math.round(vitals.diedAt||elapsed));
    get('end-personality').textContent=profile.feature;
    get('end-emotions').textContent='ヘイト '+Math.round(emotions.hate)+' / 恐怖 '+Math.round(emotions.fear)+' / 満足 '+Math.round(emotions.satisfaction);
    get('end-vitals').textContent='身体ダメージ '+Math.ceil(vitals.damage)+' / '+vitalLimits.damage+' · 空腹 '+Math.floor(vitals.hunger/vitalLimits.hungerSeconds*100)+'%';
    const entries=[...actionIds,'restore'].filter(action=>Number.isFinite(actionCounts[action])&&actionCounts[action]>0);
    const total=entries.reduce((sum,action)=>sum+actionCounts[action],0);
    const care=entries.filter(action=>careIds.includes(action)).reduce((sum,action)=>sum+actionCounts[action],0);
    get('end-summary').textContent='操作 '+total+'回 · ご機嫌取り '+care+'回 · 虐 '+(total-care)+'回';
    get('end-operations').replaceChildren();
    if(!entries.length){const text=doc.createElement('p');text.textContent='操作なし';get('end-operations').append(text);}
    for(const action of entries){
      const row=doc.createElement('div'),label=doc.createElement('span'),count=doc.createElement('strong');
      label.textContent=actionTitle(action);count.textContent=actionCounts[action]+'回';row.append(label,count);get('end-operations').append(row);
    }
    get('end-screen').hidden=false;
    get('end-retry').focus();
  };
}
