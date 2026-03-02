import type { CollectionConfig } from "payload";

export const LatBusCategories: CollectionConfig = {
  slug: "latBusCategories",
  labels: {
    singular: "Categoria",
    plural: "Categorias",
  },
  admin: {
    useAsTitle: "title",
    group: "LatBus",
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: "title",
      label: "Título",
      type: "text",
      required: true,
    },
    {
      label: "Expositores relacionados",
      type: "group",
      fields: [
        {
          name: "exibithors",
          label: "Expositores relacionados",
          type: "join",
          collection: "latBusExibithors",
          on: "category",
          admin: {
            defaultColumns: ["title", "image"],
          },
        },
      ],
    },
  ],
};
