import type { CollectionConfig } from "payload";

import { slugField } from "@/fields/slug";

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
    {
      name: "title",
      label: "Título",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Descrição",
      type: "text",
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
