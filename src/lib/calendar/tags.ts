interface TagInput {
  location?: string | null;
  description?: string | null;
  url?: string | null;
}

/**
 * Infer a display tag (e.g., "DISCORD VOICE", "X SPACES") from an event's
 * location / description / url. Returns null when nothing matches.
 */
export function inferTag({ location, description, url }: TagInput): string | null {
  const haystack = [location, description, url].filter(Boolean).join(' ').toLowerCase();
  if (!haystack) return null;

  const hasX = /x\.com\/i\/spaces|twitter\.com\/i\/spaces|x spaces|twitter spaces/.test(haystack);
  const hasDiscord = /discord\.gg|discord\.com\/events|discord voice/.test(haystack);

  if (hasDiscord && hasX) return 'DISCORD + X STREAM';
  if (hasDiscord) return 'DISCORD VOICE';
  if (hasX) return 'X SPACES';
  if (/zoom\.us/.test(haystack)) return 'ZOOM';
  if (/meet\.google\.com/.test(haystack)) return 'GOOGLE MEET';
  return null;
}
