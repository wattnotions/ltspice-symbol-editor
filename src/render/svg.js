const NS='http://www.w3.org/2000/svg';

export function setViewBox(svg,b){ svg.setAttribute('viewBox',`${b.x} ${b.y} ${b.w} ${b.h}`); }

export function clearSVG(svg){ while(svg.firstChild) svg.removeChild(svg.firstChild); }

export function drawGrid(svg,b,step=16){
  const g=document.createElementNS(NS,'g'); g.setAttribute('opacity','0.25');
  for(let x=Math.ceil(b.x/step)*step;x<=b.x+b.w;x+=step){ const l=line(x,b.y,x,b.y+b.h); l.setAttribute('stroke','#5f6d7a'); l.setAttribute('stroke-width','0.6'); g.appendChild(l); }
  for(let y=Math.ceil(b.y/step)*step;y<=b.y+b.h;y+=step){ const l=line(b.x,y,b.x+b.w,y); l.setAttribute('stroke','#5f6d7a'); l.setAttribute('stroke-width','0.6'); g.appendChild(l); }
  svg.appendChild(g);
}

export function addLine(svg,{x1,y1,x2,y2}){
  const l=line(x1,y1,x2,y2); l.setAttribute('stroke','#0b3fa8'); l.setAttribute('stroke-width','2'); svg.appendChild(l);
}

export function installWheelZoom(svg){
  svg.addEventListener('wheel', e=>{
    e.preventDefault();
    const vb=svg.viewBox.baseVal, r=svg.getBoundingClientRect();
    const mx=vb.x+(e.clientX-r.left)/r.width * vb.width;
    const my=vb.y+(e.clientY-r.top )/r.height* vb.height;
    const z = Math.pow(1.1, e.deltaY>0?1:-1);
    const nw=vb.width*z, nh=vb.height*z, u=(mx-vb.x)/vb.width, v=(my-vb.y)/vb.height;
    vb.x = mx - u*nw; vb.y = my - v*nh; vb.width = nw; vb.height = nh;
  }, {passive:false});
}

function line(x1,y1,x2,y2){ const el=document.createElementNS(NS,'line'); el.setAttribute('x1',x1); el.setAttribute('y1',y1); el.setAttribute('x2',x2); el.setAttribute('y2',y2); return el; }
