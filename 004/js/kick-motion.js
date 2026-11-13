export const kickTiming={hit:.18,flightEnd:2.95,duration:3.6};
function reflectPosition(value,min,max){
  const span=max-min;
  if(span<=0)return (min+max)/2;
  const phase=((value-min)%(2*span)+2*span)%(2*span);
  return min+(phase<=span?phase:2*span-phase);
}
export function createKickFlight({x,y,width,height,view,canvasWidth}){
  // Rotate about the sprite's center; reserve its complete rotational radius at every wall.
  const radius=Math.hypot(width,height)/2+8;
  const left=Math.max(0,-view.offsetX/view.scale),right=Math.min(900,(canvasWidth-view.offsetX)/view.scale);
  return {originX:x,originY:y,minX:left+radius,maxX:right-radius,minY:radius+height/2,maxY:620-radius+height/2};
}
export function kickFlightFrame(flight,age){
  const {originX:x,originY:y,minX,maxX,minY,maxY}=flight;
  if(age<=kickTiming.hit||age>=kickTiming.duration)return {x,y,angle:0};
  const seconds=Math.min(age,kickTiming.flightEnd)-kickTiming.hit;
  const bouncedX=reflectPosition(x+seconds*1150,minX,maxX);
  const bouncedY=reflectPosition(y-seconds*900,minY,maxY);
  const spin=seconds*12;
  if(age<=kickTiming.flightEnd)return {x:bouncedX,y:bouncedY,angle:spin};
  const progress=(age-kickTiming.flightEnd)/(kickTiming.duration-kickTiming.flightEnd);
  const ease=progress*progress*(3-2*progress);
  return {x:bouncedX+(x-bouncedX)*ease,y:bouncedY+(y-bouncedY)*ease,angle:spin+(Math.round(spin/(Math.PI*2))*Math.PI*2-spin)*ease};
}
