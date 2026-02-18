import { simpleRichTextField } from "@/fields/simple-rich-text";
import type { CollectionConfig } from "payload";

export const FAQ: CollectionConfig = {
  slug: "faq",
  labels: {
    singular: "Pergunta",
    plural: "Perguntas frequentes",
  },
  admin: {
    useAsTitle: "title",
    group: "Conteúdo",
  },
  versions: { drafts: { autosave: true } },

  fields: [
    {
      name: "title",
      label: "Título",
      type: "text",
      required: true,
    },
    simpleRichTextField(),
  ],
};
