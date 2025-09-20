const NS='http://www.w3.org/2000/svg';
const snap=(v,s)=>Math.round(v/s)*s;

function toXY(svg,e){
  const vb=svg.viewBox.baseVal;
  const r=svg.getBoundingClientRect();
  
  // Ensure we have valid dimensions
  if (r.width === 0 || r.height === 0 || vb.width === 0 || vb.height === 0) {
    return {x: 0, y: 0};
  }
  
  // Calculate the mouse position relative to the SVG element
  const mouseX = e.clientX - r.left;
  const mouseY = e.clientY - r.top;
  
  // Convert to SVG coordinates - now with square canvas this should work properly
  const x = vb.x + (mouseX / r.width) * vb.width;
  const y = vb.y + (mouseY / r.height) * vb.height;
  
  return {x, y};
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
