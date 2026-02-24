import { Block } from "payload";

import { isYouTubeUrl } from "@/utilities/is-youtube-url";

export const YouTubeEmbedBlock: Block = {
  slug: "youtubeEmbed",
  fields: [
    {
      name: "url",
      type: "text",
      label: "URL",
      required: true,
      validate: (value: string | undefined | null) => {
        if (value && !isYouTubeUrl(value)) {
          return "O link informado não é um URL válido do YouTube. Verifique e tente novamente.";
        }
        return true;
      },
    },
    {
      name: "title",
      type: "text",
      label: "Title",
      required: true,
    },
  ],
};
