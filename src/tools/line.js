const NS='http://www.w3.org/2000/svg';
const snap=(v,s)=>Math.round(v/s)*s;

function toXY(svg,e){
  // Use the browser's built-in SVG coordinate conversion
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  
  // Transform from screen coordinates to SVG coordinates
  const ctm = svg.getScreenCTM();
  if (ctm) {
    pt.x = pt.x - ctm.e;
    pt.y = pt.y - ctm.f;
    pt.x = pt.x / ctm.a;
    pt.y = pt.y / ctm.d;
  }
  
  return {x: pt.x, y: pt.y};
}

export function installLineTool(svg, grid=16, subGrid=4, commit){
  let cur=null, start=null;
  
  // Enhanced snapping function that supports both main grid and sub-grid
  function smartSnap(x, y) {
    // Always snap to sub-grid for fine positioning
    const snappedX = snap(x, subGrid);
    const snappedY = snap(y, subGrid);
    return {x: snappedX, y: snappedY};
  }
  
  svg.addEventListener('click', e=>{
    const p=toXY(svg,e);
    const {x, y} = smartSnap(p.x, p.y);
    
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
    if(cur){ 
      const p=toXY(svg,e);
      const {x, y} = smartSnap(p.x, p.y);
      cur.setAttribute('x2',x); cur.setAttribute('y2',y); 
    }
  });
  addEventListener('keydown', e=>{ if(e.key==='Escape'&&cur){ cur.remove(); cur=null; start=null; }});
}
