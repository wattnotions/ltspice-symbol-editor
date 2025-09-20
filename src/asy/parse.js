// Parse LTspice .asy (lines only)
export function parseASY(text){
  const out=[];
  for(const r of text.split(/\r?\n/)){
    const l = r.trim(); if(!l || l.startsWith(';')) continue;
    const head = l.split(/\s+/)[0].toUpperCase();
    const n = (l.match(/-?\d+/g)||[]).map(Number);
    if(head==='LINE' && n.length>=4){
      const [x1,y1,x2,y2] = n.slice(-4);
      out.push({x1,y1,x2,y2});
    }
  }
  return out;
}
