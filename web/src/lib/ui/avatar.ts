const AVATAR_TONES = [
  "bg-[rgb(var(--primary)/0.18)] text-[rgb(var(--primary))]",
  "bg-[rgb(var(--surface-2))] text-[rgb(var(--fg))]",
] as const;

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarTone(name: string): string {
  const hash = Array.from(name).reduce(
    (acc, char) => (acc * 31 + char.charCodeAt(0)) % 997,
    0,
  );

  return AVATAR_TONES[hash % AVATAR_TONES.length];
}