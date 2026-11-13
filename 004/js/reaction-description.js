import { careIds, extraActions } from './action-data.js?v=20261113-f32e3f65f3';

// Text selection is separate from simulation state transitions.
export function reactionDescription(action, tone, kind, baby, face) {
  if (careIds.includes(action)) {
    const guarded = tone === 'cautious';
    const descriptions = {
      snack:guarded?'こちらの手元を確かめながら、シュークリームを少しずつ食べている。':'シュークリームを頬張り、甘いクリームを口元につけて目を細めている。',
      pochette:baby?(guarded?'ポシェットを小さな手で押さえ、様子をうかがいながら遊んでいる。':'大きなポシェットを転がし、クマの顔をつついて遊んでいる。'):(guarded?'たすき掛けのポシェットを押さえ、取られないか気にしている。':'ポシェットをたすき掛けにして、うれしそうに胸を張った。'),
      feed:guarded?'こちらの手元を気にしながら、餌を少しずつ食べている。':'餌を頬張り、満足そうに口を動かしている。',
      pet:guarded?'撫でる手を警戒しつつ、じっと感触を確かめている。':'目を細めて、撫でられるままに座っている。',
      gift:guarded?'取り返されないか気にしながら、クマのぬいぐるみを胸元に抱えた。':'クマのぬいぐるみを抱え込み、うれしそうに頬を寄せた。',
      restore:guarded?'戻った布団を握り、こちらの動きをうかがっている。':'布団をつかみ、安心したように座った。'
    };
    return {
      text: descriptions[action],
      mood: tone === 'relieved' ? 'もう怖くないと感じ、涙を残してほっとしている。' : guarded ? 'うれしい気持ちはあるが、まだ安心しきれない。' : '世話を受けて、少し気持ちが和らいでいる。'
    };
  }
  const fallback = action === 'restore' ? '布団をつかんで、落ち着いた。' : action === 'tease' ? '食べ物を隠され、声を上げた。' : kind === 'evil' ? '地団駄を踏み、こちらへ抗議している。' : kind === 'white' ? '強がりながら、目に涙をためている。' : '目から涙をこぼし、こちらを見ている。';
  if(face==='alert')return {text:'涙は流さず、こちらの手元を注意深く見ている。'};
  if(face==='worried')return {text:tone==='angry'?'悔し涙をこらえ、こちらへ抗議している。':tone==='afraid'?'涙をこらえながら、こちらの手元を警戒している。':'目に涙をため、こちらを見つめている。'};
  const byTone = {
    pain:'目をぎゅっと閉じ、痛みに顔をゆがめている。',
    surprise:'体をびくっとさせ、目を見開いている。',
    plead:'こちらへ手を伸ばし、訴えかけている。',
    angry:'地団駄を踏み、こちらへ抗議している。',
    afraid:'身を縮めて、こちらの動きを警戒している。',
    sad:'涙をこぼし、こちらを見ている。',
    happy:'目を細めて、小さく笑った。'
  };
  return {
    text: byTone[tone] || extraActions[action]?.second || fallback
  };
}

const primaryActionNames={scold:'叱る',poke:'小突く',blanket:'布団を取り上げる',tease:'餌を見せて隠す',restore:'布団を返す'};
export function actionTitle(action){
  return primaryActionNames[action]||extraActions[action].name;
}
export function reactionOpening(action,count,memory){
  let text={tease:'食べ物を見つけて、目を輝かせた。',restore:'戻った布団へ、手を伸ばした。',poke:'体がよろけ、目を見開いた。',scold:'声に驚いて、動きが止まった。'}[action]||'消えた布団を、呆然と見ている。';
  let mood=action==='tease'?'もらえると信じて、期待している。':action==='restore'?'お気に入りが戻ってきた。':'突然の出来事に、驚いている。';
  if(extraActions[action]){
    text=extraActions[action].first;
    mood=['toy','ignore'].includes(action)?'何かいいことがあると、期待している。':'突然の変化に、驚いている。';
  }
  if(count>1&&action!=='restore')mood='同じことをされたのを、覚えている。';
  return {text:memory?memory.first:text,mood};
}
