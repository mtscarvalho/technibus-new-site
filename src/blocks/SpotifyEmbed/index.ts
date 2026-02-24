import { Block } from "payload";

import { isSpotifyUrl } from "@/utilities/is-spotify-url";

export const SpotifyEmbedBlock: Block = {
  slug: "spotifyEmbed",
  fields: [
    {
      name: "url",
      type: "text",
      label: "URL",
      required: true,
      validate: (value: string | undefined | null) => {
        if (value && !isSpotifyUrl(value)) {
          return "O link informado não é um URL válido do Spotify. Verifique e tente novamente.";
        }
        return true;
      },
    },
  ],
};
