const NS='http://www.w3.org/2000/svg';
const snap=(v,s)=>Math.round(v/s)*s;

function toXY(svg,e){
  const vb=svg.viewBox.baseVal, r=svg.getBoundingClientRect();
  return {x:vb.x+(e.clientX-r.left)/r.width*vb.width, y:vb.y+(e.clientY-r.top)/r.height*vb.height};
}

export function installLineTool(svg, grid=16, commit){
  let cur=null, start=null;
  svg.addEventListener('click', e=>{
    const p=toXY(svg,e), x=snap(p.x,grid), y=snap(p.y,grid);
    if(!start){
      start={x,y};
      cur=document.createElementNS(NS,'line');
      cur.setAttribute('x1',x); cur.setAttribute('y1',y);
      cur.setAttribute('x2',x); cur.setAttribute('y2',y);
      cur.setAttribute('stroke','#d22'); cur.setAttribute('stroke-width','2');
      svg.appendChild(cur);
    }else{
      cur.setAttribute('x2',x); cur.setAttribute('y2',y);
      commit({x1:start.x,y1:start.y,x2:x,y2:y});
      cur.remove(); cur=null; start=null;
    }
  });
  svg.addEventListener('mousemove', e=>{
    if(cur){ const p=toXY(svg,e), x=snap(p.x,grid), y=snap(p.y,grid); cur.setAttribute('x2',x); cur.setAttribute('y2',y); }
  });
  addEventListener('keydown', e=>{ if(e.key==='Escape'&&cur){ cur.remove(); cur=null; start=null; }});
}
