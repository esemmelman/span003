export function normalize(text) {
  return text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).filter(Boolean);
}
export function compare(expected, spoken) {
  const a = normalize(expected), b = normalize(spoken);
  const d = Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
  for(let i=0;i<=a.length;i++) d[i][0]=i;
  for(let j=0;j<=b.length;j++) d[0][j]=j;
  for(let i=1;i<=a.length;i++) for(let j=1;j<=b.length;j++) d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  const matched=Array(a.length).fill(false);let i=a.length,j=b.length;
  while(i||j){if(i&&j&&d[i][j]===d[i-1][j-1]+(a[i-1]===b[j-1]?0:1)){matched[i-1]=a[i-1]===b[j-1];i--;j--;}else if(i&&d[i][j]===d[i-1][j]+1)i--;else j--;}
  return {score:Math.round(100*Math.max(0,1-d[a.length][b.length]/Math.max(a.length,b.length,1))),matched};
}
