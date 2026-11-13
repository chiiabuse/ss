// Drawing helpers share only the canvas context.
export function createCanvasPainter(ctx) {
  function ellipse(x, y, rx, ry, fill, stroke, w=2){
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI*2);
    ctx.fillStyle=fill;
    ctx.fill();
    if(stroke){
      ctx.strokeStyle=stroke;
      ctx.lineWidth=w;
      ctx.stroke()
    }
  }
  function path(points, fill, stroke, w=2){
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    for(let i=1; i<points.length; i++)ctx.lineTo(...points[i]);
    ctx.closePath();
    if(fill){
      ctx.fillStyle=fill;
      ctx.fill()
    }
    if(stroke){
      ctx.strokeStyle=stroke;
      ctx.lineWidth=w;
      ctx.stroke()
    }
  }
  function line(x1, y1, x2, y2, c, w=2){
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle=c;
    ctx.lineWidth=w;
    ctx.lineCap='round';
    ctx.stroke()
  }
  function round(x, y, w, h, r, fill, stroke){
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle=fill;
    ctx.fill();
    if(stroke){
      ctx.strokeStyle=stroke;
      ctx.lineWidth=2;
      ctx.stroke()
    }
  }
  function drawPettingHand(hx,hy,age,scale=1){
    ctx.save();
    ctx.translate(hx+Math.sin(age*4)*9,hy);
    ctx.rotate(.05+Math.sin(age*4)*.03);
    ctx.scale(scale,scale);
    ctx.beginPath();
    ctx.moveTo(40,-9);ctx.lineTo(26,-10);ctx.lineTo(10,-13);ctx.lineTo(-18,-23);
    ctx.bezierCurveTo(-25,-26,-29,-18,-21,-15);ctx.lineTo(-5,-8);ctx.lineTo(-31,-14);
    ctx.bezierCurveTo(-39,-16,-42,-6,-33,-5);ctx.lineTo(-8,0);ctx.lineTo(-35,-5);
    ctx.bezierCurveTo(-44,-6,-46,4,-35,5);ctx.lineTo(-9,9);ctx.lineTo(-27,6);
    ctx.bezierCurveTo(-35,4,-38,14,-27,15);ctx.lineTo(-3,20);
    ctx.bezierCurveTo(5,25,11,22,14,18);ctx.lineTo(8,29);
    ctx.bezierCurveTo(4,36,14,43,20,35);ctx.lineTo(29,20);
    ctx.bezierCurveTo(33,15,33,11,33,7);ctx.lineTo(40,7);ctx.closePath();
    ctx.fillStyle='#edcdb6';ctx.fill();ctx.strokeStyle='#aa8068';ctx.lineWidth=1.8;ctx.lineJoin='round';ctx.stroke();
    ctx.beginPath();ctx.moveTo(13,4);ctx.bezierCurveTo(6,5,4,13,5,17);
    ctx.moveTo(21,-6);ctx.bezierCurveTo(24,-2,25,3,24,6);ctx.strokeStyle='#c49b80';ctx.lineWidth=1.1;ctx.stroke();
    round(37,-12,16,23,3,'#bdc6c9','#8d9c9e');
    ctx.restore();
  }
  function drawShout(sx,sy,age){
    ctx.save();ctx.translate(sx,sy);ctx.globalAlpha=.75+Math.sin(age*13)*.2;
    path([[-43,-7],[-29,-13],[-31,-29],[-12,-25],[-5,-38],[6,-25],[26,-34],[27,-15],[44,-12],[31,1],[42,16],[18,14],[12,32],[-2,22],[-22,28],[-21,11],[-43,13],[-31,1]],'#fff2dd','#ad6550',2);
    ctx.fillStyle='#8b4637';ctx.font='bold 14px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('コラッ！',0,-2);
    const pulse=1+Math.sin(age*14)*.12;
    line(43,17,43+20*pulse,30,'#ad6550',2.8);
    line(34,30,34+23*pulse,49,'#ad6550',2.5);
    line(18,38,18+12*pulse,58,'#ad6550',2);
    ctx.restore();
  }
  function drawCloudBed(bx,by,scale=1){
    ctx.save();ctx.translate(bx,by);ctx.scale(scale,scale);
    ellipse(0,34,137,17,'#74776c20');
    ctx.scale(1,.65);
    ctx.beginPath();ctx.moveTo(-125,10);
    ctx.bezierCurveTo(-142,-4,-129,-30,-109,-29);
    ctx.bezierCurveTo(-118,-49,-91,-64,-74,-49);
    ctx.bezierCurveTo(-68,-74,-32,-76,-19,-58);
    ctx.bezierCurveTo(-5,-80,28,-78,40,-58);
    ctx.bezierCurveTo(63,-74,93,-60,94,-38);
    ctx.bezierCurveTo(119,-45,140,-24,132,-5);
    ctx.bezierCurveTo(153,8,139,32,116,32);
    ctx.bezierCurveTo(107,53,73,57,55,42);
    ctx.bezierCurveTo(37,63,0,61,-16,46);
    ctx.bezierCurveTo(-41,60,-73,49,-77,35);
    ctx.bezierCurveTo(-100,47,-126,34,-125,10);ctx.closePath();
    ctx.fillStyle='#fffdf8';ctx.fill();ctx.strokeStyle='#aaa99c';ctx.lineWidth=2.3;ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-100,-16);ctx.bezierCurveTo(-91,-26,-79,-24,-76,-17);
    ctx.moveTo(-55,-38);ctx.bezierCurveTo(-45,-47,-29,-43,-24,-34);
    ctx.moveTo(13,-42);ctx.bezierCurveTo(24,-53,42,-47,47,-37);
    ctx.moveTo(78,-16);ctx.bezierCurveTo(89,-27,104,-21,110,-12);
    ctx.moveTo(-48,16);ctx.bezierCurveTo(-37,5,-22,8,-17,18);
    ctx.moveTo(29,17);ctx.bezierCurveTo(40,5,56,9,62,18);
    ctx.strokeStyle='#d0d0c5';ctx.lineWidth=2;ctx.lineCap='round';ctx.stroke();
    ctx.restore();
  }
  function drawTapasta(tx, ty, scale=1){
    ctx.save();
    ctx.translate(tx,ty);
    ctx.scale(scale,scale);
    ellipse(0,20,27,4,'#68534320');
    path([[-28,-1],[28,-1],[22,18],[-22,18]],'#d5d7cf','#969c90',1.5);
    ellipse(0,-1,29,9,'#f2f0e7','#a5aa9c',1.5);
    ellipse(0,-1,25,6.8,'#b1a082');
    // Short, dry cylinders: a dark side, a lighter cut end and a grainy surface.
    const pellets=[[-17,-5,-.4],[-7,-6,.25],[5,-6,-.2],[16,-4,.45],[-21,0,.25],[-11,0,-.5],[0,-1,.1],[11,0,-.35],[21,1,.4],[-14,4,.35],[-3,4,-.3],[8,4,.2]];
    for(const [px,py,angle] of pellets){
      ctx.save();
      ctx.translate(px,py);
      ctx.rotate(angle);
      ellipse(1,4,4,2,'#53412f38');
      ctx.beginPath();
      ctx.roundRect(-3.4,-4,6.8,9,1.8);
      ctx.fillStyle='#927044';
      ctx.fill();
      ctx.strokeStyle='#6b5133';
      ctx.lineWidth=.8;
      ctx.stroke();
      ellipse(0,-3.4,3.1,1.6,'#c3a16a','#85623e',.65);
      line(-1,-.5,-1,2.6,'#ad8c58',.8);
      ellipse(1.2,1,.55,.65,'#684f32');
      ellipse(-.7,-3.5,.5,.35,'#94733f');
      ctx.restore();
    }
    // The opaque front of the bowl hides the lower ends of the pellets.
    ctx.beginPath();
    ctx.moveTo(-28,-1);
    ctx.bezierCurveTo(-28,11,28,11,28,-1);
    ctx.lineTo(22,18);
    ctx.lineTo(-22,18);
    ctx.closePath();
    ctx.fillStyle='#d5d7cf';
    ctx.fill();
    ctx.strokeStyle='#969c90';
    ctx.lineWidth=1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0,-1,28,9,0,0,Math.PI);
    ctx.strokeStyle='#eeede3';
    ctx.lineWidth=3;
    ctx.stroke();
    line(-18,12,17,12,'#e7e8df',1.4);
    ctx.restore();
  }
  function drawCreamPuff(px,py,size=1){
    ctx.save();
    ctx.translate(px,py);
    ctx.scale(size,size);
    ellipse(1,23,38,10,'#7660401c');
    ellipse(0,19,37,10,'#fffaf0','#b8ac96',1.3);
    ellipse(0,18,29,6,'#ece4d3');
    // A golden choux shell, a white cream seam and an uneven puffed lid.
    ctx.beginPath();
    ctx.moveTo(-28,5);
    ctx.bezierCurveTo(-31,18,-15,23,0,22);
    ctx.bezierCurveTo(20,24,31,15,28,4);
    ctx.closePath();
    ctx.fillStyle='#c89152';ctx.fill();ctx.strokeStyle='#987047';ctx.lineWidth=1.5;ctx.stroke();
    ctx.beginPath();ctx.moveTo(-28,3);
    ctx.bezierCurveTo(-24,-4,-18,3,-14,0);
    ctx.bezierCurveTo(-9,-5,-4,2,1,-1);
    ctx.bezierCurveTo(9,-5,13,3,18,0);
    ctx.bezierCurveTo(25,-4,31,3,28,9);
    ctx.bezierCurveTo(22,15,16,7,11,11);
    ctx.bezierCurveTo(4,15,-1,8,-7,12);
    ctx.bezierCurveTo(-13,15,-17,8,-23,11);
    ctx.bezierCurveTo(-29,12,-32,6,-28,3);ctx.closePath();
    ctx.fillStyle='#fffbed';ctx.fill();ctx.strokeStyle='#d8c7a6';ctx.lineWidth=1.1;ctx.stroke();
    ctx.beginPath();ctx.moveTo(-29,2);
    ctx.bezierCurveTo(-34,-5,-27,-13,-20,-14);
    ctx.bezierCurveTo(-22,-23,-9,-27,-3,-24);
    ctx.bezierCurveTo(3,-32,16,-24,18,-20);
    ctx.bezierCurveTo(28,-23,34,-9,29,-3);
    ctx.bezierCurveTo(34,4,21,9,15,5);
    ctx.bezierCurveTo(8,12,0,5,-6,8);
    ctx.bezierCurveTo(-13,11,-21,3,-29,2);ctx.closePath();
    ctx.fillStyle='#e6b373';ctx.fill();ctx.strokeStyle='#a67845';ctx.lineWidth=1.5;ctx.stroke();
    path([[-18,-13],[-13,-18],[-7,-15],[-10,-8]],'#f0c68e');
    path([[1,-21],[7,-24],[13,-18],[8,-13]],'#f5cf98');
    line(-18,-4,-10,-7,'#bf8b50',1.4);
    line(2,-11,7,-7,'#bf8b50',1.4);
    line(17,-12,22,-6,'#bf8b50',1.3);
    for(const [x,y] of [[-13,-18],[-5,-20],[4,-24],[12,-19],[-19,-10],[1,-16],[19,-13],[10,-6]])ellipse(x,y,1.5,.8,'#fff7e5');
    ctx.restore();
  }
  function drawKumacha(bx, by, size=1){
    ctx.save();
    ctx.translate(bx, by);
    ctx.scale(size, size);
    ellipse(-12, -14, 8, 8, '#b89671', '#725d47');
    ellipse(12, -14, 8, 8, '#b89671', '#725d47');
    // Rounded arms and feet remain visible outside the stuffed body.
    ellipse(-22, 19, 8, 11, '#b89671', '#725d47');
    ellipse(22, 19, 8, 11, '#b89671', '#725d47');
    ellipse(-11, 40, 8, 9, '#b89671', '#725d47');
    ellipse(11, 40, 8, 9, '#b89671', '#725d47');
    ellipse(0, 22, 17, 20, '#b89671', '#725d47');
    ellipse(-11, 43, 4, 3, '#e6d1af');
    ellipse(11, 43, 4, 3, '#e6d1af');
    ellipse(0, 0, 22, 18, '#c2a17a', '#725d47');
    ellipse(-7, -2, 2, 3, '#443c31');
    ellipse(7, -2, 2, 3, '#443c31');
    ellipse(0, 6, 6, 5, '#e6d1af');
    ellipse(0, 4, 2, 2, '#443c31');
    ctx.restore();
  }
  function drawPochette(px, py, scale=1){
    ctx.save();
    ctx.translate(px, py);
    ctx.scale(scale, scale);
    const fill='#f0b1c8',
    edge='#c88ba7';
    ellipse(-16, -22, 9, 10, fill, edge, 1.5);
    ellipse(16, -22, 9, 10, fill, edge, 1.5);
    ctx.beginPath();
    ctx.moveTo(0, -27);
    ctx.bezierCurveTo(-39, -30, -36, 14, -22, 23);
    ctx.bezierCurveTo(-10, 32, 15, 32, 27, 20);
    ctx.bezierCurveTo(40, 2, 29, -28, 0, -27);
    ctx.closePath();
    ctx.fillStyle=fill;
    ctx.fill();
    ctx.strokeStyle=edge;
    ctx.lineWidth=1.7;
    ctx.stroke();
    ellipse(0, 5, 14, 13, '#fff9f2');
    ellipse(-10, -7, 2, 2, '#664a45');
    ellipse(10, -7, 2, 2, '#664a45');
    ellipse(0, 2, 2.8, 2, '#664a45');
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.lineTo(0, 8);
    ctx.bezierCurveTo(-1, 13, -9, 10, -7, 7);
    ctx.moveTo(0, 8);
    ctx.bezierCurveTo(2, 13, 9, 10, 7, 7);
    ctx.strokeStyle='#664a45';
    ctx.lineWidth=2;
    ctx.lineCap='round';
    ctx.stroke();
    round(-31, -12, 5, 8, 2, '#dddcd4', '#a8a69c');
    round(27, -12, 5, 8, 2, '#dddcd4', '#a8a69c');
    ctx.restore();
  }
  return {
    ellipse,
    path,
    line,
    round,
    drawPettingHand,
    drawShout,
    drawCloudBed,
    drawTapasta,
    drawCreamPuff,
    drawKumacha,
    drawPochette
  };
}
