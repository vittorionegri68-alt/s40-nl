import React from 'react';
const PATHS={"road":"<path d=\"M5 8h14\"/><path d=\"M12 8V4\"/><path d=\"M5 8c-2 0-3 2-3 4.5S3.5 18 6 18h1\"/><path d=\"M19 8c2 0 3 2 3 4.5S20.5 18 18 18h-1\"/>","gravel":"<path d=\"M5 15a7 7 0 0 1 14 0\"/><path d=\"M9 15a3 3 0 0 1 6 0\"/><path d=\"M5.42 12.61L3.07 11.75\"/><path d=\"M7.98 9.27L6.55 7.22\"/><path d=\"M12.00 8.00L12.00 5.50\"/><path d=\"M16.02 9.27L17.45 7.22\"/><path d=\"M18.58 12.61L20.93 11.75\"/><path d=\"M3 20h.01\"/><path d=\"M8 21h.01\"/><path d=\"M13 20h.01\"/><path d=\"M18 21h.01\"/><path d=\"M21 19h.01\"/>","bmx":"<path d=\"M4 5h16l-1.5 10a4 4 0 0 1-4 3.5h-5a4 4 0 0 1-4-3.5z\"/><path d=\"M8 2v3\"/><path d=\"M16 2v3\"/><path d=\"M11 9h3l-1.5 6\"/>","track":"<rect x=\"2\" y=\"6\" width=\"20\" height=\"12\" rx=\"6\"/><rect x=\"7\" y=\"10\" width=\"10\" height=\"4\" rx=\"2\"/><path d=\"M12 6v4\"/>","triathlon":"<path d=\"M3 17h18\"/><path d=\"M9 17V3\"/><path d=\"M15 17V3\"/><path d=\"M6.5 11h5\"/><path d=\"M12.5 11h5\"/><path d=\"M12 17v4\"/>","bike-fit":"<path d=\"M3 6h9c3 0 7 .8 9 2-1.5 1.2-4.5 1.5-7.5 1.5H6.5C4.5 9.5 3 8.5 3 6z\"/><path d=\"M11 9.5 8.5 21\"/><path d=\"M8.5 21H20\"/><path d=\"M14.5 21a6 6 0 0 0-3-5.2\"/>","custom-build":"<path d=\"M4 18 9 7h10l-6 11z\"/><path d=\"M9 7 4 18\"/><path d=\"M16.5 12.5l4.5 4.5\"/><path d=\"M21 17l-2 2\"/>"};
const UI={
  'arrow-right':'<path d="M5 12h14"/><path d="m13 5 7 7-7 7"/>',
  'arrow-up-right':'<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  'map-pin':'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  instagram:'<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  'chevron-down':'<path d="m6 9 6 6 6-6"/>',
  download:'<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  linkedin:'<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  'arrow-down':'<path d="M12 5v14"/><path d="m5 13 7 7 7-7"/>',
  tv:'<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 22h8"/><path d="M12 18v4"/>',
  wind:'<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>',
  droplet:'<path d="M12 2.7s7 7.2 7 12.3a7 7 0 0 1-14 0C5 9.900 12 2.700 12 2.700z"/>',
  mountain:'<path d="m8 3 4 8 5-5 5 15H2z"/>',
  route:'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.500a3.500 3.500 0 0 0 0-7h-11a3.500 3.500 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>'
};
export const ICON_NAMES=[...Object.keys(PATHS),...Object.keys(UI)];
export function Icon({name='road',size=24,color='currentColor',strokeWidth=2,title,style}){
  const body=PATHS[name]||UI[name]||'';
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" role={title?'img':undefined} aria-hidden={title?undefined:true} aria-label={title} style={{flex:'none',display:'block',...style}} dangerouslySetInnerHTML={{__html:(title?'<title>'+title+'</title>':'')+body}}/>;
}

export default Icon;
