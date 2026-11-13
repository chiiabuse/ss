import { injuryStage, injurySVG } from './injury-art.js?v=20261113-f32e3f65f3';
// Pure character SVG generation.
export function faceSVG(face,mouthColor=null){
  const ink='#49302b';
  const open='<g fill="'+ink+'" stroke="none"><ellipse cx="73" cy="81" rx="12" ry="12.5"/><ellipse cx="132" cy="81" rx="12" ry="12.5"/></g><g fill="white" stroke="none"><ellipse cx="73" cy="77" rx="6.2" ry="3.5"/><ellipse cx="132" cy="77" rx="6.2" ry="3.5"/><path d="M67 84 Q73 89 80 83 Q77 91 70 89Z M126 84 Q132 89 139 83 Q136 91 129 89Z"/></g>';
  let eyes=open,
  brow='M69 58 Q74 55 80 56 M124 55 Q130 55 135 58',
  mouth='M91 102 Q90 108 98 106 Q103 106 103 100 Q103 107 110 106 Q115 106 114 102',
  extra='';
  if(face==='smile'){
    eyes='<path d="M64 82 Q73 77 82 80 M123 80 Q132 77 141 82" stroke-width="4"/>';
    mouth+=' M94 108 Q94 128 104 128 Q115 128 113 108';
  }
  if(face==='cry'){
    eyes='<path d="M64 81 Q73 79 82 81 M123 81 Q132 80 141 83" stroke-width="3.6"/>';
    brow='M67 58 Q71 54 76 57 Q80 59 83 56 M123 56 Q126 60 131 58 Q136 56 140 61';
    mouth='M94 101 Q94 107 101 105 Q104 104 103 100 Q103 107 111 105 M97 107 L96 124 Q100 123 104 126 Q108 123 112 125 L110 107';
    extra='<ellipse cx="103" cy="90" rx="10" ry="6" fill="#ffb8cb" stroke="none"/><path d="M99 88 L97 91 M107 88 L105 91" stroke-width="2"/><path d="M61 87 Q57 91 61 96 L59 121 Q59 130 64 125 L69 99 Q70 94 76 92 M140 88 Q145 92 142 97 L145 122 Q147 131 150 125 L151 101 Q152 96 148 92" stroke-width="2.8"/><path d="M58 135 L58 142 Q59 149 62 143 L64 135 M147 136 L148 143 Q150 150 152 143 L152 135" stroke-width="2.6"/>';
  }
  if(face==='hurt'){
    brow='M66 59 Q71 56 76 59 Q80 61 83 57 M123 57 Q126 61 131 59 Q136 57 140 61';
    eyes='<path d="M65 83 Q72 77 80 80 M124 80 Q132 77 140 83" stroke-width="3.6"/>';
    mouth='M94 102 Q95 108 102 105 Q105 104 104 100 Q104 108 111 106 L114 103 M98 108 L99 118 Q104 116 110 118 L110 108 M101 125 l.3 1 M108 125 l.3 1';
    extra='<path d="M63 88 Q58 91 62 96 L61 108 Q62 115 66 110 L70 96 Q73 92 77 91 M128 90 Q133 93 135 98 L137 110 Q141 115 144 110 L143 96 Q142 91 139 89 M61 121 L61 126 Q63 132 66 125 L66 121 M139 122 L140 127 Q143 132 145 125 L145 121" stroke-width="2.6"/><path d="M89 105 l-1 2 M89 111 l-1 2 M118 105 l1 2 M119 111 l1 2" stroke-width="1.5"/>';
  }
  if(face==='despair'){
    brow='M67 59 Q74 55 81 58 M124 59 Q132 60 139 65';
    eyes='<path d="M64 81 Q73 77 82 81 M123 82 Q132 81 141 87" stroke-width="3.6"/>';
    mouth='M92 102 Q94 111 102 106 Q105 105 104 101 Q104 109 111 108 Q116 108 116 104 M98 109 Q100 121 106 120 Q113 117 111 109 M101 126 Q105 129 109 126';
    extra='<path d="M63 88 Q61 91 63 94 Q63 101 68 99 Q71 99 71 93 L75 90 M135 93 Q139 95 138 99 Q138 105 143 106 Q148 108 148 102 L149 98" stroke-width="2.8"/><path d="M88 108 l.1 .2 M89 112 l.1 .2 M119 112 l.1 .2 M118 117 l.1 .2" stroke-width="1.6"/>';
  }
  if(face==='alert'){
    brow='M65 59 Q71 56 77 57 Q81 58 81 54 M124 54 Q124 58 130 57 Q135 56 140 59 M88 51 l0 .7 M117 51 l0 .7';
    eyes=open;
    mouth='M94 102 Q95 108 102 105 Q105 104 104 100 Q104 108 111 106 L114 104 M99 108 L99 113 L109 113 L109 108';
  }
  if(face==='worried'){
    brow='M64 54 C69 55 67 66 76 65 Q80 66 82 62 M123 63 Q126 68 131 61 Q136 54 141 62';
    eyes=open;
    mouth='M93 109 Q96 104 102 107 Q105 108 104 102 Q104 108 111 107 L115 109 M95 110 l-4 4 M112 110 l4 4';
    extra='<path d="M97 116 l-1 3 M102 116 l0 4 M107 116 l1 3 M112 116 l1 3" stroke-width="1.3"/><ellipse cx="103" cy="94" rx="11" ry="6" fill="#ccc5df" stroke="none"/><path d="M99 92 l-2 4 M107 92 l-2 4" stroke-width="2"/><path d="M82 92 L78 102 Q74 104 75 110 L73 119 L74 132 Q73 140 68 134 L66 121 L67 109 Q65 103 66 100 L62 93 M142 94 L138 103 Q135 105 137 112 L135 121 L136 133 Q134 140 130 134 L128 121 L129 110 Q127 105 127 101 L122 93" fill="none" stroke-width="2.6"/>';
  }
  if(face==='angry'){
    brow='M65 56 Q72 61 82 62 M123 62 Q132 61 141 56';
    mouth='M93 110 Q103 102 113 110';
  }
  if(face==='sleep'){
    eyes='<path d="M64 81 Q73 88 82 80 M123 80 Q132 88 140 81" stroke-width="3"/>';
    brow='';
    mouth='M95 105 Q103 110 111 105';
  }
  if(face==='surprise'){
    brow='M65 52 C72 48 69 65 77 63 M123 57 C123 68 132 68 136 59 Q141 52 146 60';
    eyes=open;
    mouth='M91 102 Q91 109 99 107 Q104 106 103 100 Q103 108 111 108 Q116 109 117 104 M95 108 L93 141 Q103 136 114 142 L114 109';
    extra='<path d="M61 96 Q65 99 61 105 L60 113 Q53 119 53 111 L54 102 M140 98 Q137 103 142 107 L143 115 Q150 121 151 113 L149 104" stroke-width="3.1"/><path d="M88 61 L88 64 M97 62 L98 65" stroke-width="2.4"/><path d="M30 65 L24 72 M27 72 L21 79 M174 124 L180 131 M177 134 L183 141" stroke-width="2" opacity=".7"/>';
  }
  if(face==='scared'){
    brow='M68 59 Q73 55 78 57 Q83 59 84 53 M122 53 Q123 59 128 57 Q133 56 138 61';
    eyes=open.replace('M67 84 Q73 89 80 83 Q77 91 70 89Z M126 84 Q132 89 139 83 Q136 91 129 89Z', 'M68 87 Q73 90 78 87 Q74 91 69 89Z M127 87 Q132 90 137 87 Q133 91 128 89Z')+'<path d="M148 77 l.7 5 M151 79 l.3 2" stroke-width="1.3"/>';
    mouth='M94 102 Q95 108 102 105 Q104 104 103 100 Q103 107 110 105 L113 103 M97 107 L98 115 Q104 113 111 115 L110 107 M101 123 Q104 126 108 123';
    extra='<path d="M93 109 l.1 .2 M93 113 l.1 .2 M115 110 l.1 .2 M116 114 l.1 .2" stroke-width="1.6"/><path d="M28 65 l-3 4 l1 4 l-3 4 M20 91 l-1 3 M22 111 l-2 4 l1 4 M177 56 l3 4 l4 1 M187 75 l3 4 l-1 4 M197 96 l1 3 M192 118 l2 5 l-3 4" stroke-width="1.5" opacity=".8"/>';
  }
  if(face==='pout'){
    brow='M65 61 L81 64 M124 64 L140 61';
    eyes='<path d="M63 79 L83 81 M123 81 L143 79" stroke-width="3.5"/>';
    mouth='M94 112 Q103 105 112 112';
    extra='<path d="M82 107 Q76 111 82 116 M126 107 Q132 111 126 116" stroke-width="2"/>';
  }
  if(face==='smug'){
    brow='M68 55 Q73 59 80 60 M125 60 Q132 59 138 55';
    eyes='<g fill="'+ink+'" stroke="none"><ellipse cx="73" cy="82" rx="10.5" ry="11.5"/><ellipse cx="132" cy="82" rx="10.5" ry="11.5"/></g><g fill="white" stroke="none"><ellipse cx="73" cy="77.5" rx="5.7" ry="4"/><ellipse cx="132" cy="77.5" rx="5.7" ry="4"/><path d="M67 86 Q73 90 79 86 Q76 92 69 90Z M126 86 Q132 90 138 86 Q135 92 128 90Z"/></g><path d="M62 94 Q73 92 84 94 M121 94 Q132 92 143 94" stroke-width="2.8"/>';
    mouth='M93 103 Q94 109 101 106 Q104 105 103 101 Q103 108 110 106 Q114 106 114 103';
  }
  if(face==='plead'){
    brow='M65 60 Q72 62 82 55 M123 55 Q134 62 141 60';
    eyes=open+'<g fill="white" stroke="none"><circle cx="69" cy="84" r="2.4"/><circle cx="128" cy="84" r="2.4"/></g>';
    mouth='M91 102 Q92 109 103 104 Q113 109 115 102 M98 111 Q104 118 110 111';
  }
  if(face==='relieved'){
    brow='M67 59 Q70 55 75 54 M131 54 Q136 55 139 59';
    eyes='<path d="M65 81 Q73 76 81 80 M124 80 Q132 76 140 81" stroke-width="3.5"/>';
    mouth='M93 103 Q94 109 102 106 Q105 105 104 101 Q104 108 112 106 L115 104 M100 111 Q104 113 109 111';
    extra='<path d="M64 88 Q67 90 65 95 Q65 103 69 101 L73 91 Q76 89 78 88 M127 88 Q130 90 132 95 L134 102 Q139 104 139 98 L138 91 Q136 89 134 88" stroke-width="2.7"/>';
  }
  if(face==='content'){
    brow='M66 58 Q74 55 81 58 M124 58 Q133 55 140 58';
    eyes='<path d="M64 79 Q73 88 82 79 M123 79 Q132 88 141 79" stroke-width="3.2"/>';
    mouth='M91 102 Q92 109 103 104 Q113 109 115 102';
  }
  const mouthCavity={
    smile:'M94 108 Q94 128 104 128 Q115 128 113 108Z',
    cry:'M97 107 L96 124 Q100 123 104 126 Q108 123 112 125 L110 107Z',
    alert:'M99 108 L99 113 L109 113 L109 108Z',
    hurt:'M98 108 L99 118 Q104 116 110 118 L110 108Z',
    surprise:'M95 108 L93 141 Q103 136 114 142 L114 109Z',
    scared:'M96 107 L100 104 L104 107 L108 104 L112 108 L110 129 L106 127 L102 130 L98 127Z',
    plead:'M98 111 Q104 118 110 111Z',
    despair:'M98 109 Q100 121 106 120 Q113 117 111 109Z'
  }[face];
  const innerMouth=mouthColor&&mouthCavity?'<path d="'+mouthCavity+'" fill="'+mouthColor+'" stroke="none"/>':'';
  return '<g stroke="'+ink+'" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"><path d="'+brow+'" stroke-width="2.5"/>'+eyes+innerMouth+'<path d="'+mouth+'"/><path d="'+(face==='worried'||face==='scared'||face==='relieved'||face==='hurt'||face==='despair'?'':face==='cry'?'M100 135 l.6 3 M108 135 l.6 3':'M99 '+(face==='surprise'?149:face==='smile'?137:116)+' q5 2 9 0')+'" stroke-width="2.5"/>'+extra+'</g>';
}
function collapsedSVG(k,expression,bodyColor=null,damage=0){
  const wounds=injuryStage(damage);
  const fur=bodyColor||(k==='red'?'#f7c9ce':'#fffefd'),ink='#49302b',white=k==='white';
  const outline='M30 192 C11 184 4 166 9 144 C12 126 24 110 45 101 C34 94 37 81 48 80 C59 78 64 87 61 94 C85 84 116 88 138 96 C137 83 149 78 158 85 C168 93 163 102 155 105 C174 118 182 135 184 151 C199 151 212 165 211 184 Q216 196 207 203 Q189 212 145 209 L45 211 Q25 212 21 202 Q14 198 30 192Z';
  const injuries=wounds?'<defs><clipPath id="injury-skin"><path d="'+outline+'"/></clipPath></defs><g clip-path="url(#injury-skin)">'+(white?'':'<g transform="translate(25 43) scale(.98 .82)">'+injurySVG(wounds,'body')+'</g>')+'<g transform="translate(-8 104) rotate(-9 94 82) scale(.88 .74)">'+injurySVG(wounds,'head')+'</g></g>':'';
  const bib=white?'<path d="M158 169 Q182 167 195 185 Q204 199 182 204 L135 204 Q120 191 134 183Z" fill="#f8dfe4" stroke-width="3"/><ellipse cx="163" cy="190" rx="15" ry="8" fill="white" stroke="none"/>':'';
  const curl=white?'<path d="M103 37 C86 36 84 55 96 59 C110 65 118 53 111 47 L105 48" fill="none" stroke-width="5"/>':'';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 224 240"><g stroke="'+ink+'" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="'+fur+'"><circle cx="201" cy="190" r="10" stroke-width="3.5"/><path d="'+outline+'"/>'+bib+injuries+'<g transform="translate(-8 104) rotate(-9 94 82) scale(.88 .74)">'+curl+'<g fill="'+(k==='red'?'#f09fae':'#ffb8cb')+'" stroke="none"><ellipse cx="50" cy="102" rx="18" ry="12"/><ellipse cx="157" cy="101" rx="18" ry="12"/></g><path d="M39 97 L37 104 M47 96 L45 105 M55 97 L53 105 M62 99 L60 105 M146 96 L144 104 M154 95 L152 104 M162 97 L160 105 M169 99 L167 104" stroke-width="2.5"/>'+faceSVG(expression,k==='red'||bodyColor?'#fff':null)+'</g><path d="M29 193 Q9 187 2 198 Q-2 205 13 205 L37 204 M111 202 Q99 219 108 222 Q120 223 125 208 M192 195 Q211 191 210 201 Q209 211 195 211"/></g></svg>';
}
export function posedSVG(k, pose, expression, frame=0,bodyColor=null,damage=0){
  const wounds=injuryStage(damage);
  if(pose==='collapsed')return collapsedSVG(k,expression,bodyColor,damage);
  const fur=k==='red'?'#f7c9ce':'#fffefd',
  ink='#49302b',
  white=k==='white';
  let torso='M28 139 Q31 178 60 200 L62 210 Q68 221 75 211 L78 204 Q104 208 134 204 L138 213 Q147 220 149 208 L150 199 Q177 172 176 139Z';
  if(['sit', 'crouch'].includes(pose))torso='M28 139 Q18 177 40 188 Q25 199 39 206 Q55 212 67 199 Q104 214 139 200 Q155 214 171 205 Q184 196 167 188 Q184 171 176 139Z';
  if(pose==='prone')torso='M29 134 Q4 153 10 189 Q8 204 29 209 L162 209 Q188 208 195 193 Q203 177 180 175 L176 137Z';
  const arm={
    stand:'M31 145 Q20 172 32 170 Q39 170 40 154 M175 143 Q180 159 168 160 Q155 160 157 148',
    fists:'M60 151 C42 143 43 167 57 167 Q70 166 69 155 M147 151 C164 142 168 165 153 166 Q141 165 140 155',
    open:'M31 144 Q7 131 5 147 Q6 157 30 160 M176 144 Q200 130 202 146 Q202 158 177 160',
    stomp:'M35 147 Q12 140 17 156 Q19 161 36 160 M171 146 Q195 138 192 154 Q190 160 173 159',
    crouch:'M62 157 Q42 150 45 169 Q49 181 65 174 M144 157 Q163 149 162 169 Q158 182 141 173',
    prone:'M51 189 Q31 180 28 196 Q29 209 49 207 M146 189 Q166 180 169 196 Q167 210 147 207',
    sit:'M70 148 Q58 135 51 148 Q43 160 63 165 M136 148 Q148 136 156 147 Q164 160 143 165',
    reach:'M32 144 Q12 121 20 112 Q32 104 42 134 M175 144 Q195 122 187 113 Q175 104 166 133'
  }[pose];
  let head='M28 139 C8 123 4 101 10 76 C15 52 29 33 51 25 C40 15 47 2 56 2 C65 1 70 11 69 17 C88 11 113 10 132 16 C136 3 144 -2 151 4 C162 12 155 22 151 25 C180 38 194 60 198 83 C204 108 196 128 176 142 Q149 156 103 156 Q58 156 28 139Z';
  if(white)head='M20 137 C2 113 5 83 18 61 Q31 37 49 30 C38 13 48 3 58 8 Q71 14 65 26 Q103 8 139 24 C136 8 148 1 157 9 Q169 19 160 31 Q187 47 196 76 Q207 109 187 136 Q163 157 104 157 Q45 157 20 137Z';
  let headTransform='';
  if(pose==='crouch')headTransform='translate(0 27) scale(1 .88)';
  if(pose==='prone')headTransform='translate(0 82) scale(1 .75)';
  // Non-elite characters have one continuous head/body silhouette.
  // Facial features still follow the crouching/lying head transform.
  const headTop=head.slice(0,head.indexOf(' Q149 156'));
  const headOffset=pose==='prone'?82:pose==='crouch'?27:0;
  const headScale=pose==='prone'?.75:pose==='crouch'?.88:1;
  let coordinate=0;
  const outlineTop=headTop.replace(/-?\d+(?:\.\d+)?/g,value=>coordinate++%2?String(Number(value)*headScale+headOffset):value);
  let underside=' Q177 172 150 199 L149 208 Q147 220 138 213 L134 204 Q104 208 78 204 L75 211 Q68 221 62 210 L60 200 Q31 178 28 139Z';
  if(['sit','crouch'].includes(pose))underside=' Q184 171 167 188 Q184 196 171 205 Q155 214 139 200 Q104 214 67 199 Q55 212 39 206 Q25 199 40 188 Q18 177 28 '+(139*headScale+headOffset)+'Z';
  if(pose==='prone')underside=' Q203 203 162 209 L29 209 Q8 204 10 189 Q4 183 28 '+(139*headScale+headOffset)+'Z';
  const silhouette=outlineTop+underside;
  const faceTransform=white?(['cry','worried','hurt'].includes(expression)?'translate(0 6) scale(1 .94)':'translate(0 10)'):'';
  const curl=white?'<path d="M103 37 C86 36 84 55 96 59 C110 65 118 53 111 47 L105 48" fill="none" stroke-width="5"/>':'';
  const feet=pose==='stomp'?'<path d="M61 199 Q55 '+(frame?213:204)+' 65 '+(frame?217:207)+' Q77 '+(frame?219:209)+' 78 202 M134 201 Q132 '+(frame?205:216)+' 142 '+(frame?208:218)+' Q153 '+(frame?207:214)+' 150 199" fill="'+fur+'"/>':'';
  const tailCenter=pose==='prone'?[185,194]:['sit','crouch'].includes(pose)?[176,192]:[164,188];
  const tail='<circle cx="'+tailCenter[0]+'" cy="'+tailCenter[1]+'" r="11" fill="'+fur+'" stroke-width="3.5"/>';
  const bib=white?'<path d="M63 157 Q64 191 104 193 Q143 191 143 157" fill="white" stroke-width="3"/><ellipse cx="104" cy="177" rx="10" ry="8" fill="#f2d9e0" stroke="none"/>':'';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 224 240"><g stroke="'+ink+'" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="'+fur+'">'+tail+'<path d="'+(white?torso:silhouette)+'" fill="'+(white?'#f8dfe4':fur)+'"/>'+bib+feet+(white||!wounds?'':'<g transform="'+(pose==='prone'?'translate(0 113) scale(1 .46)':'')+'">'+injurySVG(wounds,'body')+'</g>')+'<g transform="'+headTransform+'">'+(white?'<path d="'+head+'"/>':'')+curl+'<g fill="'+(k==='red'?'#f09fae':'#ffb8cb')+'" stroke="none"><ellipse cx="50" cy="102" rx="18" ry="12"/><ellipse cx="157" cy="101" rx="18" ry="12"/></g><path d="M39 97 L37 104 M47 96 L45 105 M55 97 L53 105 M62 99 L60 105 M146 96 L144 104 M154 95 L152 104 M162 97 L160 105 M169 99 L167 104" stroke-width="2.5"/>'+injurySVG(wounds,'head')+'<g transform="'+faceTransform+'">'+faceSVG(expression,k==='red'?'#fff':null)+'</g></g><path d="'+arm+'" fill="'+fur+'"/></g></svg>';
}
