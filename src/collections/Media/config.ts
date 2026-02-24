import { generateBlurHash } from "@/utilities/payload/generate-blur-hash";
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Mídia",
    plural: "Mídias",
  },
  admin: {
    group: "Biblioteca",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
    },
    {
      name: "caption",
      type: "text",
    },
    {
      name: "blurhash",
      type: "text",
      admin: {
        disabled: true,
        disableListColumn: true,
        disableListFilter: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [generateBlurHash],
    beforeChange: [generateBlurHash],
  },
  upload: {
    formatOptions: {
      format: "webp",
    },
  },
};
