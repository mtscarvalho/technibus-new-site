export function extractIdFromYouTubeUrl(url: string): string | null {
  const match = url.match(/^.*((youtu\.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/);
  return match ? match[7] : null;
}
