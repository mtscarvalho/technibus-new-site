import { Media } from "@/payload-types";

export function isMediaObject(media: unknown): media is Media {
  return typeof media === "object" && media !== null && "url" in media && typeof (media as Media).url === "string";
}
