export function extractIdFromSpotifyUrl(url: string): string | null {
  const match = url.match(/(?:open\.spotify\.com\/(?:embed\/)?(?:track|album|playlist|episode|show)\/)([a-zA-Z0-9]{22})/);
  return match ? match[1] : null;
}
