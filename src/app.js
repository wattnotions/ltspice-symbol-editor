import { parseASY } from './asy/parse.js';
import { setViewBox, drawGrid, drawSubGridDots, clearSVG, addLine, installWheelZoom } from './render/svg.js';
import { installLineTool } from './tools/line.js';

const svg = document.getElementById('stage');
const fileInput = document.getElementById('file');
const downloadBtn = document.getElementById('download');
const statusEl = document.getElementById('status');

// Track all drawn lines
let drawnLines = [];

const GRID = 16;
const SUB_GRID = 4; // Sub-grid for fine snapping

// Get reasonable initial viewport
function getInitialViewport() {
  return {
    x: -100,
    y: -100, 
    w: 200,
    h: 200
  };
}

// Initial view - reasonable grid
const viewport = getInitialViewport();
setViewBox(svg, viewport);
drawGrid(svg, viewport, GRID);
drawSubGridDots(svg, viewport, GRID);
installWheelZoom(svg);

// Render helper from ASY text (lines only)
function renderASY(text){
  const shapes = parseASY(text);
  clearSVG(svg);
  drawnLines = [...shapes]; // Track loaded lines
  
  // recompute bounds
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  const add=(x,y)=>{minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y)};
  shapes.forEach(s=>{add(s.x1,s.y1);add(s.x2,s.y2)});
  if(!isFinite(minX)){minX=0;minY=0;maxX=100;maxY=100;}
  const pad=16, b={x:minX-pad,y:minY-pad,w:maxX-minX+pad*2,h:maxY-minY+pad*2};
  setViewBox(svg,b);
  drawGrid(svg,b,GRID);
  drawSubGridDots(svg,b,GRID);
  shapes.forEach(addLine.bind(null, svg));
  statusEl.textContent = `Parsed ${shapes.length} line(s).`;
}

// Generate ASY file content
function generateASYContent() {
  let content = 'Version 4\n';
  content += 'SymbolType CELL\n';
  content += 'LINE Normal 0 0 0 0\n';
  content += 'SYMATTR Prefix X\n';
  content += 'SYMATTR ModelFile \n';
  content += 'SYMATTR SpiceModel \n';
  content += 'SYMATTR Value \n';
  content += 'SYMATTR Value2 \n';
  content += 'SYMATTR Description \n';
  content += 'PIN 0 0 NONE 8 LEFT NONE\n';
  content += 'PINATTR PinName \n';
  content += 'PINATTR SpiceOrder 1\n';
  
  // Add all drawn lines
  drawnLines.forEach(line => {
    content += `LINE Normal ${line.x1} ${line.y1} ${line.x2} ${line.y2}\n`;
  });
  
  return content;
}

// Download functionality
function downloadASY() {
  const content = generateASYContent();
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'symbol.asy';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  statusEl.textContent = `Downloaded ${drawnLines.length} line(s).`;
}

// File open
fileInput.addEventListener('change', async e => {
  const f = e.target.files?.[0];
  if(!f) return;
  const text = await f.text();
  renderASY(text);
});

// Download button
downloadBtn.addEventListener('click', downloadASY);

// Click-to-draw with snapping; commit callback adds a styled line and tracks it
installLineTool(svg, GRID, SUB_GRID, (line)=> {
  addLine(svg, line);
  drawnLines.push(line);
  statusEl.textContent = `Added line. Total: ${drawnLines.length}`;
});
