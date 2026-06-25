const Z=n=>String(n).padStart(2,'0');
const FRAME_PACK={
 idle_front:[1,2,3,4,5,6,7,8].map(n=>`body_front_idle_${Z(n)}`),
 idle_back:[1,2,3,4,5,6,7,8].map(n=>`body_back_idle_${Z(n)}`),
 idle_left:[1,2,3,4,5,6,7,8].map(n=>`body_left_idle_${Z(n)}`),
 idle_right:[1,2,3,4,5,6,7,8].map(n=>`body_right_idle_${Z(n)}`),
 walk_front:[1,2,3,4,5,6,7,8,9,10,11,12].map(n=>`body_front_walk_${Z(n)}`),
 walk_back:[1,2,3,4,5,6,7,8,9,10,11,12].map(n=>`body_back_walk_${Z(n)}`),
 walk_left:[1,2,3,4,5,6,7,8,9,10,11,12].map(n=>`body_left_walk_${Z(n)}`),
 walk_right:[1,2,3,4,5,6,7,8,9,10,11,12].map(n=>`body_right_walk_${Z(n)}`)
};
const ST=`<style>.s{fill:#f6c27e;stroke:#111;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.p{fill:#1d1d1d;stroke:#111;stroke-width:3}.l{fill:none;stroke:#111;stroke-width:2.3;stroke-linecap:round}.sh{fill:rgba(0,0,0,.10)}</style>`;
function frameMarkup(id){
 const m=id.match(/^body_(front|back|left|right)_(idle|walk)_(\d+)$/),dir=m[1],anim=m[2],i=+m[3]-1,walk=anim==='walk';
 const side=dir==='left'||dir==='right',t=(walk?i/12:i/8)*Math.PI*2,s=Math.sin(t),c=Math.cos(t),bob=walk?(c>0?2:-1):Math.sin(t)*1.5;
 if(side){const mir=dir==='right'?-1:1,a=walk?s:0;return ST+`<g transform='translate(${mir<0?240:0} ${bob}) scale(${mir} 1)'><ellipse class=sh cx=120 cy=282 rx=50 ry=8/><path class=s d='M106 214C103 238 103 264 106 272C111 277 122 277 126 271L122 214Z' transform='translate(${-a*7} ${Math.max(0,c)*4})'/><path class=s d='M105 267C96 270 96 282 107 284L124 283C128 278 123 269 116 268Z' transform='translate(${-a*7} ${Math.max(0,c)*4})'/><path class=s d='M106 143C101 167 101 211 109 232L139 232C147 211 147 167 142 143C138 127 129 117 121 114C112 117 109 126 106 143Z'/><path class=l d='M111 157C105 174 103 196 108 210' transform='translate(${a*4} 0)'/><circle class=s cx='${108+a*4}' cy=212 r=18/><path class=l d='M138 157C145 175 146 197 142 210' transform='translate(${-a*2} 0)'/><circle class=s cx='${142-a*2}' cy=211 r=14/><path class=p d='M102 208L139 208L141 235L133 238L104 235Z'/><path class=s d='M121 214C118 238 118 264 121 272C128 278 145 278 150 270L145 214Z' transform='translate(${a*10} ${Math.max(0,-c)*4})'/><path class=s d='M120 267C107 272 108 286 125 288L152 286C159 279 151 269 138 268Z' transform='translate(${a*10} ${Math.max(0,-c)*4})'/><ellipse class=s cx=125 cy=76 rx=55 ry=68/><ellipse class=s cx=129 cy=88 rx=13 ry=19/><path class=l d='M126 88C132 82 136 94 128 99'/></g>`}
 const l1=walk?Math.max(0,-c)*5:0,l2=walk?Math.max(0,c)*5:0,x1=walk?s*4:0,x2=walk?-s*4:0,ear=dir==='front'?"<path class=l d='M48 85C56 78 60 91 52 96'/><path class=l d='M192 85C184 78 180 91 188 96'/>":"";
 return ST+`<g transform='translate(0 ${bob})'><ellipse class=sh cx=120 cy=282 rx=56 ry=9/><path class=s d='M84 ${219+l1}C80 ${241+l1} 80 ${265+l1} 84 ${272+l1}C93 ${279+l1} 113 ${277+l1} 117 ${270+l1}L112 ${219+l1}Z' transform='translate(${x1} 0)'/><path class=s d='M128 ${219+l2}L123 ${270+l2}C127 ${277+l2} 147 ${279+l2} 156 ${272+l2}C160 ${265+l2} 160 ${241+l2} 154 ${219+l2}Z' transform='translate(${x2} 0)'/><path class=s d='M83 ${267+l1}C69 ${272+l1} 68 ${286+l1} 86 ${288+l1}L116 ${286+l1}C121 ${278+l1} 113 ${269+l1} 99 ${268+l1}Z' transform='translate(${x1} 0)'/><path class=s d='M157 ${267+l2}C171 ${272+l2} 172 ${286+l2} 154 ${288+l2}L124 ${286+l2}C119 ${278+l2} 127 ${269+l2} 141 ${268+l2}Z' transform='translate(${x2} 0)'/><path class=s d='M72 142C67 169 68 213 79 232L161 232C172 213 173 169 168 142C158 122 139 114 120 114C101 114 82 122 72 142Z'/><path class=p d='M77 208L163 208L160 236L123 236L120 221L117 236L80 236Z'/><path class=l d='M73 154C65 176 63 198 68 211' transform='translate(${s*3} 0)'/><circle class=s cx='${67+s*3}' cy=212 r=18/><path class=l d='M167 154C175 176 177 198 172 211' transform='translate(${-s*3} 0)'/><circle class=s cx='${173-s*3}' cy=212 r=18/><circle class=s cx=120 cy=76 r=68/><ellipse class=s cx=51 cy=84 rx=16 ry=22/><ellipse class=s cx=189 cy=84 rx=16 ry=22/>${ear}</g>`;
}
function renderFrame(svg,id){svg.setAttribute('viewBox','0 0 240 300');svg.innerHTML=frameMarkup(id);}
window.MPC_FRAME_PACK_V1={FRAME_PACK,renderFrame};
