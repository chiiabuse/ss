// Scenery takes a snapshot of simulation state and never changes it.
export function createRoomPainter(ctx, painter) {
  const { ellipse, path, line, round, drawCloudBed } = painter;
function drawShelter(){
  // cardboard shelter
  ellipse(655, 467, 132, 26, '#807a6220');
  path([[557, 340], [700, 326], [772, 366], [629, 385]], '#c0a77c', '#a18f6c');
  path([[629, 385], [772, 366], [772, 452], [629, 479]], '#b39a70', '#9e8966');
  path([[557, 340], [629, 385], [629, 479], [557, 431]], '#d0b58b', '#aa9573');
  path([[574, 364], [611, 388], [611, 450], [574, 426]], '#76674f');
  path([[557, 340], [537, 315], [606, 350], [629, 385]], '#dbc39c', '#aa9573');
  path([[629, 385], [648, 357], [790, 339], [772, 366]], '#dac098', '#aa9573');
  line(680, 390, 722, 383, '#98845f', 2);
  ctx.save();
  ctx.translate(694, 423);
  ctx.rotate(-.16);
  ctx.fillStyle='#8e7c5e';
  ctx.font='12px sans-serif';
  ctx.fillText('みかん', 0, 0);
  ctx.restore();
}
function drawRoom({night,blanketPresent,bedOffset,current,stateTime}){
  let g=ctx.createLinearGradient(0, 0, 0, 620);
  g.addColorStop(0, night?'#8f9c9f':'#e9e6d8');
  g.addColorStop(1, night?'#b0ada2':'#f4f0df');
  ctx.fillStyle=g;
  ctx.fillRect(0, 0, 900, 620);
  ctx.fillStyle=night?'#b2ab98':'#dcd3bc';
  ctx.fillRect(0, 367, 900, 253);
  ctx.fillStyle=night?'#92978c':'#c8c6b1';
  ctx.fillRect(0, 355, 900, 13);
  line(0, 367, 900, 367, '#8f978443', 2);
  for(let i=0; i<9; i++){
    let xx=i*140-190;
    line(xx, 620, xx+160, 369, '#b6ad932c', 1)
  }
  for(let yy of [407, 473, 555])line(0, yy, 900, yy, '#b6ad9329', 1);
  // window, soft daylight
  round(93, 54, 270, 239, 5, '#c1c9b5', '#abb4a0');
  round(104, 65, 248, 216, 2, night?'#526779':'#c9dcd4');
  ctx.save();
  ctx.beginPath();
  ctx.rect(105, 65, 247, 215);
  ctx.clip();
  ellipse(300, 107, 26, 26, night?'#f4eccb':'#f7f0d4');
  path([[105, 190], [145, 145], [181, 173], [220, 138], [270, 177], [352, 155], [352, 281], [105, 281]], night?'#546e69':'#aebfaf');
  path([[105, 228], [183, 192], [253, 220], [310, 191], [352, 210], [352, 281], [105, 281]], night?'#485f5c':'#9db49f');
  ctx.restore();
  ctx.fillStyle='#edeadd';
  ctx.fillRect(220, 65, 9, 218);
  ctx.fillRect(104, 170, 249, 8);
  round(80, 286, 296, 15, 3, '#d4d2bf');
  if(!night){
    path([[104, 304], [350, 304], [700, 554], [299, 554]], '#fbf4cf32');
    path([[104, 304], [212, 304], [479, 554], [299, 554]], '#fff7d431')
  }
  // curtain
  path([[55, 35], [98, 35], [94, 281], [69, 316], [53, 309]], '#e1dfcc', '#c8cbb8', 1);
  for(let i=0; i<3; i++)line(64+i*10, 42, 61+i*11, 300, '#c1c5af66', 1);
  // little wall note
  ctx.save();
  ctx.translate(451, 154);
  ctx.rotate(-.07);
  round(0, 0, 105, 92, 2, '#eee9d7', '#d0cebb');
  ctx.fillStyle='#c3c7ac';
  ctx.fillRect(32, -7, 40, 15);
  line(19, 31, 79, 31, '#c1c4af');
  line(19, 47, 69, 47, '#c1c4af');
  line(19, 63, 55, 63, '#c1c4af');
  ctx.restore();
  // plant on low stand
  round(34, 352, 96, 13, 4, '#a8ae92');
  line(44, 365, 39, 410, '#a8ae92', 5);
  line(120, 365, 125, 410, '#a8ae92', 5);
  path([[55, 306], [112, 306], [104, 352], [64, 352]], '#c4af92', '#a99c84', 1);
  line(82, 312, 82, 252, '#758c6a', 3);
  for(let i=0; i<5; i++){
    ctx.save();
    ctx.translate(81, 263+i*9);
    ctx.rotate((i%2?1:-1)*.65);
    ellipse(i%2?12:-12, 0, 17, 7, '#8fa381');
    ctx.restore()
  }
  drawShelter();
  // Cloud-shaped bedding; keep the existing ownership and bed movement.
  if(blanketPresent)drawCloudBed(485+bedOffset,535);
  // water dish and floor crumbs
  ellipse(197, 488, 50, 12, '#7b81671a');
  path([[155, 463], [239, 463], [229, 485], [167, 485]], '#d9ddd1', '#b1baa7');
  ellipse(197, 462, 42, 12, '#e8eadf', '#b1baa7');
  ellipse(197, 463, 33, 7, night?'#9badb3':'#b7cfd0');
  line(180, 461, 194, 459, '#e8f1e7', 2);
  for(const [cx, cy] of [[269, 502], [287, 510], [309, 497]]){
    if(current!==3||stateTime<6)path([[cx, cy], [cx+5, cy-2], [cx+7, cy+3], [cx+2, cy+5]], '#ac9165')
  }
  // fallen leaf and scuffs
  path([[787, 529], [802, 519], [811, 523], [799, 534]], '#9d9b73');
  line(789, 531, 811, 518, '#85886a', 1);
  line(87, 566, 107, 563, '#a59d7d55', 1);
  line(730, 563, 742, 562, '#a59d7d55', 1);
}
  return { drawShelter, drawRoom };
}
