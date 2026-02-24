export function isSpotifyUrl(url: string): boolean {
  const spotifyRegex = /^(?:https?:\/\/)?(?:open\.spotify\.com\/)(?:embed\/)?(?:track|album|playlist|episode|show)\/[a-zA-Z0-9]{22}/;
  return spotifyRegex.test(url);
}
