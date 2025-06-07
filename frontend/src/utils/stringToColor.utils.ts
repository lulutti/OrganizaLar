export function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360; 
  const saturation = 70; 
  const lightness = 75;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
