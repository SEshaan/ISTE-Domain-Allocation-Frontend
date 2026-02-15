export function getDomainColor(name: string): string {
  const colors: Record<string, string> = {
  'App Dev': '#6366f1',
  'Web Dev': '#3b82f6',
  'IoT': '#10b981',
  'Machine Learning': '#8b5cf6',
  'Design': '#ec4899',
  'Motion Graphics': '#f59e0b',
  'GameDev / XR': '#ef4444',
  'Electrical': '#f97316',
  'Competitive Programming': '#14b8a6',
  'Management': '#64748b',
};

  return colors[name] ?? '#71717a'; // fallback gray
}

export function getReadableTextColor(bgColor: string): string {
  const hex = bgColor.replace('#', '');

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 150 ? '#000000' : '#ffffff';
}
