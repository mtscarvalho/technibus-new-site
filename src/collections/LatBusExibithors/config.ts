import type { CollectionConfig } from "payload";

import { relPermalinkField } from "@/fields/relpermalink";
import { slugField } from "@/fields/slug";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: {
    singular: "Publicação",
    plural: "Publicações",
  },
  admin: {
    useAsTitle: "title",
    group: "Conteúdo",
    preview: ({ relPermalink }) => `${relPermalink}`,
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  //   hooks: {
  //     afterChange: [
  //       ({ operation }) => {
  //         if (operation === "update") {
  //           revalidatePath("/", "layout");
  //         }
  //       },
  //     ],
  //   },
  fields: [
    slugField(),
    relPermalinkField("/blog"),
    {
      type: "tabs",
      tabs: [
        {
          label: "Conteúdo",
          fields: [
            {
              name: "author",
              label: "Autor",
              type: "relationship",
              relationTo: "users",
            },
            {
              name: "title",
              label: "Título",
              type: "text",
              required: true,
            },
            {
              name: "excerpt",
              label: "Resumo",
              type: "text",
              required: true,
            },
            {
              name: "category",
              label: "Categoria",
              type: "relationship",
              relationTo: "categories",
              required: true,
              hasMany: true,
            },
            {
              name: "image",
              label: "Imagem",
              type: "upload",
              relationTo: "media",
            },
            {
              name: "publishedDate",
              label: "Data de publicação",
              type: "date",
              required: true,
              defaultValue: () => new Date().toISOString(),
              admin: {
                date: {
                  pickerAppearance: "dayOnly",
                  displayFormat: "dd/MM/yyyy",
                },
              },
            },
            {
              name: "content",
              label: "Conteúdo",
              type: "richText",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
