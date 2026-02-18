import { revalidatePath } from "next/cache";

import { MetaDescriptionField, MetaTitleField, PreviewField } from "@payloadcms/plugin-seo/fields";
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
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  hooks: {
    afterChange: [
      ({ operation }) => {
        if (operation === "update") {
          revalidatePath("/", "layout");
        }
      },
    ],
  },
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
              name: "title",
              label: "Título",
              type: "text",
              required: true,
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
        {
          label: "SEO",
          name: "meta",
          fields: [
            MetaTitleField({
              hasGenerateFn: true,
              overrides: {
                label: "Título",
                required: true,
              },
            }),
            MetaDescriptionField({
              hasGenerateFn: true,
              overrides: {
                label: "Meta descrição",
                required: true,
              },
            }),
            PreviewField({
              hasGenerateFn: true,
              overrides: {
                label: "Pré-visualização",
              },
            }),
          ],
        },
      ],
    },
  ],
};
