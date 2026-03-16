import { richTextToPlainText } from "@/utilities/richtext-to-plaintext";
import { searchPlugin as payloadSearchPlugin } from "@payloadcms/plugin-search";
import { Plugin } from "payload";

export const searchPlugin: Plugin = payloadSearchPlugin({
  collections: ["posts"],

  searchOverrides: {
    admin: {
      hidden: true,
    },

    fields: ({ defaultFields }) => [
      ...defaultFields,
      {
        name: "relPermalink",
        label: "Caminho da página",
        type: "text",
        required: true,
        admin: {
          readOnly: true,
          position: "sidebar",
        },
      },
      {
        name: "category",
        label: "Categoria",
        type: "relationship",
        relationTo: "categories",
        required: true,
        hasMany: true,
        admin: {
          readOnly: true,
          position: "sidebar",
        },
      },
      {
        name: "hat",
        label: "Chapéu",
        type: "text",
      },
      {
        name: "image",
        label: "Imagem",
        type: "upload",
        relationTo: "media",
      },
      {
        name: "author",
        label: "Autor",
        type: "relationship",
        relationTo: "users",
        admin: {
          readOnly: true,
          position: "sidebar",
        },
      },
      {
        name: "content",
        label: "Conteúdo",
        type: "textarea",
        admin: {
          readOnly: true,
        },
      },
      {
        name: "publishedDate",
        label: "Data de publicação",
        type: "date",
        defaultValue: () => new Date().toISOString(),
        admin: {
          readOnly: true,
          date: {
            pickerAppearance: "dayOnly",
            displayFormat: "dd/MM/yyyy",
          },
        },
      },
      {
        name: "excerpt",
        type: "textarea",
        label: "Resumo",
        admin: {
          readOnly: true,
          position: "sidebar",
        },
      },
    ],
  },

  beforeSync: ({ originalDoc, searchDoc }) => {
    const publishDate = originalDoc?.publishedDate ? new Date(originalDoc.publishedDate) : null;

    const now = new Date();

    return {
      ...searchDoc,
      relPermalink: originalDoc?.relPermalink,
      category: originalDoc?.category,
      image: originalDoc?.image,
      author: originalDoc?.author,
      hat: originalDoc?.hat,
      content: richTextToPlainText(originalDoc?.content) || "",
      excerpt: originalDoc?.excerpt || "...",
      publishedDate: originalDoc?.publishedDate,
      isScheduled: publishDate && publishDate > now,
    };
  },
});
