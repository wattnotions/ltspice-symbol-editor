import { parseASY } from './asy/parse.js';
import { setViewBox, drawGrid, clearSVG, addLine, installWheelZoom } from './render/svg.js';
import { installLineTool } from './tools/line.js';

const svg = document.getElementById('stage');
const fileInput = document.getElementById('file');
const statusEl = document.getElementById('status');

const GRID = 16;

// Initial view
setViewBox(svg, {x:0,y:0,w:200,h:200});
drawGrid(svg, {x:0,y:0,w:200,h:200}, GRID);
installWheelZoom(svg);

// Render helper from ASY text (lines only)
function renderASY(text){
  const shapes = parseASY(text);
  clearSVG(svg);
  // recompute bounds
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  const add=(x,y)=>{minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y)};
  shapes.forEach(s=>{add(s.x1,s.y1);add(s.x2,s.y2)});
  if(!isFinite(minX)){minX=0;minY=0;maxX=100;maxY=100;}
  const pad=16, b={x:minX-pad,y:minY-pad,w:maxX-minX+pad*2,h:maxY-minY+pad*2};
  setViewBox(svg,b);
  drawGrid(svg,b,GRID);
  shapes.forEach(addLine.bind(null, svg));
  statusEl.textContent = `Parsed ${shapes.length} line(s).`;
}

// File open
fileInput.addEventListener('change', async e => {
  const f = e.target.files?.[0];
  if(!f) return;
  const text = await f.text();
  renderASY(text);
});

// Click-to-draw with snapping; commit callback adds a styled line
installLineTool(svg, GRID, (line)=> addLine(svg, line));
