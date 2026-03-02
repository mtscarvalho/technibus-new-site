import type { CollectionConfig } from "payload";

import { relPermalinkField } from "@/fields/relpermalink";
import { slugField } from "@/fields/slug";
import { generateRelPeramlinkWithSlug } from "@/utilities/payload/generate-relpermalink";

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: {
    singular: "Categoria",
    plural: "Categorias",
  },
  admin: {
    useAsTitle: "title",
    group: "Conteúdo",
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    slugField(),
    relPermalinkField({
      overrides: {
        hooks: {
          beforeChange: [generateRelPeramlinkWithSlug("/editoria")],
        },
      },
    }),
    {
      name: "title",
      label: "Título",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Descrição",
      type: "textarea",
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
          on: "category",
          admin: {
            defaultColumns: ["title", "image"],
          },
        },
      ],
    },
  ],
};
