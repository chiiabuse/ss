import { injuryStage } from './injury-art.js?v=20261113-f32e3f65f3';
import { vitalLimits } from './vital-state.js?v=20261113-f32e3f65f3';
import { posedSVG } from './character-art.js?v=20261113-f32e3f65f3';
import { kickFlightFrame, kickTiming } from './kick-motion.js?v=20261113-f32e3f65f3';

const CHARACTER_SCALE = 1.2;
export function characterDimensions(baby) {
  const width = (baby ? 91 : 166) * CHARACTER_SCALE;
  return { width, height: width * 240 / 224 };
}
function drawDeathHalo(ctx,w,h,baby){
  // The corpse lies horizontally; place the halo above its head, not above the SVG box.
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(-w*.07,-h*.70,w*.15,h*.035,0,0,Math.PI*2);
  ctx.strokeStyle='#e5ba20';ctx.lineWidth=baby?3:4;ctx.stroke();
  ctx.strokeStyle='#ffe66b';ctx.lineWidth=baby?1.5:2;ctx.stroke();
  ctx.restore();
}
// Draw from a frame snapshot without reading DOM elements or changing simulation state.
export function createCharacterPainter(ctx,painter){
  const {ellipse,line,round,drawPettingHand,drawShout,drawTapasta,drawCreamPuff,drawKumacha,drawPochette}=painter;
  const spriteCache=new Map();
  function sprite(kind,pose,face,t,dead,damage){
    const wounds=injuryStage(damage);
    const frame=pose==='stomp'?Math.floor(t*7)%2:0;
    const id=kind+pose+face+frame+(dead?"dead":"")+(wounds?"injury"+wounds:"");
    if(!spriteCache.has(id)){
      const image=new Image();
      image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(posedSVG(kind,pose,face,frame,dead?vitalLimits.deathColor:null,damage));
      spriteCache.set(id,image);
    }
    return spriteCache.get(id);
  }
  return function drawCharacter({kind,baby,key,x,y,t,target,face,pose,reaction,afterglow,despairActive,toyPresent,pochettePresent,dead=false,damage=0}){
    const moving=!dead&&!despairActive&&Math.hypot(target.x-x,target.y-y)>5,
    stepping=!dead&&(moving||key==='walk');
    const bob=dead?0:stepping?Math.sin(t*13)*2:Math.sin(t*2)*.7;
    const { width: w, height: h } = characterDimensions(baby);
    ellipse(x, y+4, w*.34, 7, '#68534322');
    ctx.save();
    ctx.translate(x, y+bob);
    if(afterglow?.step.type==='sniff')ctx.translate(0,-Math.max(0,Math.sin(afterglow.age*5))*1.5);
    if(afterglow?.step.type==='watch')ctx.rotate(Math.sin(afterglow.age*2)*.012);
    if(reaction?.action==='clap'&&reaction.age<.7)ctx.translate(0, -Math.sin(reaction.age/.7*Math.PI)*15);
    if(reaction?.action==='slap'&&reaction.age<.9)ctx.rotate(Math.sin(reaction.age/.9*Math.PI)*.32);
    if(reaction?.action==='poke'&&reaction.age<1)ctx.rotate(Math.sin(reaction.age*Math.PI)*.2);
    if(reaction?.action==='kick'&&reaction.age<kickTiming.duration){
      ctx.translate(0,-h/2);
      ctx.rotate(kickFlightFrame(reaction.kickFlight,reaction.age).angle);
      ctx.translate(0,h/2);
    }
    if(key==='sleep')ctx.rotate(.02);
    if(key==='walk')ctx.rotate(Math.sin(t*10)*.025);
    if(reaction?.lossScale>=1.1&&reaction.phase>0)ctx.translate(Math.sin(t*26)*(reaction.lossScale-1)*2,0);
    if(['cry', 'scared'].includes(face))ctx.translate(Math.sin(t*24)*.8, 0);
    const im=sprite(kind, pose, face, t,dead,damage);
    if(im.complete&&im.naturalWidth)ctx.drawImage(im, -w/2, -h, w, h);
    if(dead)drawDeathHalo(ctx,w,h,baby);
    if(reaction?.action==='snack'&&reaction.phase>0){
      ellipse(w*.08,-h*.46,baby?2.3:3.8,baby?1.6:2.5,'#fffbed');
      ellipse(w*.11,-h*.43,baby?1.5:2.3,baby?1:1.6,'#fffbed');
    }
    if(pochettePresent&&!baby){
      const crouch=['prone','crouch','collapsed'].includes(pose),
      top=crouch?-h*.27:-h*.45;
      const lift=afterglow?.step.type==='pochettePride'?Math.min(afterglow.age/1.2,1)*h*.15:0;
      line(-w*.24, top, w*.22, -h*.10-lift, '#adada5', 5);
      line(-w*.24, top, w*.22, -h*.10-lift, '#fffdf5', 3);
      drawPochette(w*.19, -h*.09-lift, .7 * CHARACTER_SCALE);
    }
    ctx.restore();
    if(reaction?.action==='kick'&&reaction.age<.5){
      const thrust=Math.sin(Math.min(reaction.age/.4,1)*Math.PI);
      ctx.save();
      ctx.translate(reaction.originX-115+thrust*85,reaction.originY-h*.44);
      ctx.rotate(-.18);
      round(-94,-30,86,35,6,'#64717b','#3e454a');
      ctx.beginPath();
      ctx.moveTo(-17,-25);ctx.lineTo(4,-20);ctx.quadraticCurveTo(15,-4,43,0);
      ctx.quadraticCurveTo(56,6,48,17);ctx.lineTo(-22,17);ctx.quadraticCurveTo(-31,3,-17,-25);
      ctx.closePath();ctx.fillStyle='#f3f0e7';ctx.fill();ctx.strokeStyle='#665f56';ctx.lineWidth=2;ctx.stroke();
      line(-23,13,48,13,'#b0a99d',3);
      for(let lace=0;lace<3;lace++)line(-2+lace*8,-10+lace*3,6+lace*8,-6+lace*3,'#9f998f',2);
      ctx.restore();
    }
    if (reaction?.action === 'slap' && reaction.age < .65) {
      const progress = Math.min(reaction.age / .25, 1);
      ctx.save();
      ctx.translate(reaction.originX - 95 + progress * 70, y - h * .56);
      ctx.rotate(-.25);
      round(-12, -18, 28, 34, 8, '#e9c9b2', '#a98c77');
      for (let finger = 0; finger < 4; finger++) round(-12 + finger * 8, -36, 7, 25, 3, '#e9c9b2', '#a98c77');
      ctx.restore();
      if (reaction.age > .12 && reaction.age < .45) {
        for (let ray = 0; ray < 3; ray++) line(x - 70, y - h * .6 + ray * 9, x - 85, y - h * .6 + ray * 13 - 6, '#a47e67', 2);
      }
    }
    if((reaction?.action==='tease'&&reaction.age<2.3)||reaction?.action==='feed'){
      drawTapasta(x+80,y-45);
    }
    if(reaction?.action==='snack')drawCreamPuff(x+72,y-42,baby ? .85 : 1.05);
    if(pochettePresent&&baby){
      const playing=reaction?.action==='pochette';
      const pride=afterglow?.step.type==='pochettePride'?Math.min(afterglow.age/1.2,1):0;
      ctx.save();
      ctx.translate(x+(55-30*pride)*CHARACTER_SCALE,y+3-25*pride*CHARACTER_SCALE);
      ctx.rotate(playing?Math.sin(t*5)*.16:0);
      drawPochette(0, 0, .8 * CHARACTER_SCALE);
      ctx.restore();
    }
    if(toyPresent||(reaction?.action==='toy'&&reaction.age<2.3)){
      const hug=afterglow?.step.type==='cuddle'?Math.min(afterglow.age/1.4,1):0;
      drawKumacha(toyPresent?x+30*CHARACTER_SCALE*(1-hug):x+80, toyPresent?y-(21+37*hug)*CHARACTER_SCALE+Math.sin(t*3)*hug*1.5:y-70, (toyPresent ? .7 : 1)*CHARACTER_SCALE);
    }
    if(reaction?.action==='pet'&&reaction.age<6){
      const guarding=reaction.memory?.key==='hand'&&reaction.phase===0;
      drawPettingHand(x+(guarding?65:18),y-h+(guarding?-8:16),reaction.age,.9);
    }
    if(reaction?.action==='scold'&&reaction.age<2.3)drawShout(x-112,y-h-8,reaction.age);
    if(reaction?.action==='clap'&&reaction.age<1){
      for(let q=0; q<3; q++){
        line(x-85-q*9, y-110-q*8, x-70-q*9, y-120-q*8, '#9b7b5d', 2);
        line(x+70+q*9, y-120-q*8, x+85+q*9, y-110-q*8, '#9b7b5d', 2)
      }
    }
    if(reaction?.action==='shoo'&&reaction.age<2.3){
      ctx.save();
      ctx.translate(reaction.originX+65+Math.sin(reaction.age*9)*8, y-70);
      round(0, 0, 35, 31, 10, '#e9c9b2', '#a98c77');
      for(let q=0; q<4; q++)round(q*9, -20-q%2*4, 8, 29, 4, '#e9c9b2', '#a98c77');
      ctx.restore();
    }
    return {x,y:y-h-12};
  };
}
