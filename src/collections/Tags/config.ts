import type { CollectionConfig } from "payload";

import { slugField } from "@/fields/slug";

export const Tags: CollectionConfig = {
  slug: "tags",
  labels: {
    singular: "Tag",
    plural: "Tags",
  },
  admin: {
    useAsTitle: "title",
    group: "Conteúdo",
  },
  fields: [
    slugField(),
    {
      name: "title",
      label: "Título",
      type: "text",
      required: true,
    },
    {
      label: "Publicações relacionadas",
      type: "group",
      fields: [
        {
          name: "posts",
          label: "Publicações relacionadas",
          type: "join",
          collection: "posts",
          on: "tag",
          admin: {
            defaultColumns: ["title", "image"],
          },
        },
      ],
    },
  ],
};
