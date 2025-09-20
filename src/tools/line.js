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
  
  // Handle preserveAspectRatio by using the actual rendered scale
  // The preserveAspectRatio="xMidYMid meet" can cause different scaling for X and Y
  const vbAspectRatio = vb.width / vb.height;
  const rectAspectRatio = r.width / r.height;
  
  let scaleX, scaleY, offsetX, offsetY;
  
  if (vbAspectRatio > rectAspectRatio) {
    // ViewBox is wider - scale based on width
    scaleX = scaleY = vb.width / r.width;
    offsetX = 0;
    offsetY = (r.height - r.width / vbAspectRatio) / 2;
  } else {
    // ViewBox is taller - scale based on height
    scaleX = scaleY = vb.height / r.height;
    offsetX = (r.width - r.height * vbAspectRatio) / 2;
    offsetY = 0;
  }
  
  // Adjust mouse coordinates for the offset
  const adjustedMouseX = mouseX - offsetX;
  const adjustedMouseY = mouseY - offsetY;
  
  const x = vb.x + adjustedMouseX * scaleX;
  const y = vb.y + adjustedMouseY * scaleY;
  
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
