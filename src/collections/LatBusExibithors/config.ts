import { phoneNumberField } from "@/fields/phoneNumber/field";
import { isValidUrl } from "@/utilities/is-valid-url";
import type { CollectionConfig } from "payload";

export const LatBusExibithors: CollectionConfig = {
  slug: "latBusExibithors",
  labels: {
    singular: "Expositor",
    plural: "Expositores",
  },
  admin: {
    useAsTitle: "title",
    group: "LatBus",
    preview: ({ relPermalink }) => `${relPermalink}`,
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: "logo",
      label: "Logo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "title",
      label: "Nome ",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Descrição",
      type: "textarea",
      required: true,
    },
    {
      name: "category",
      label: "Categoria",
      type: "relationship",
      relationTo: "latBusCategories",
      required: true,
      hasMany: true,
    },
    {
      name: "website",
      type: "text",
      label: "Site",
      required: true,
      validate: (value: string | undefined | null) => {
        if (value && !isValidUrl(value)) {
          return "O link informado não é um URL válido. Verifique e tente novamente.";
        }
        return true;
      },
    },
    {
      name: "contact",
      label: "Contato",
      type: "group",
      fields: [
        {
          name: "name",
          label: "Nome do representante",
          type: "text",
          required: true,
        },
        {
          name: "email",
          label: "E-mail",
          type: "text",
          required: true,
        },
        phoneNumberField("whatsapp", "WhatsApp"),
      ],
    },
  ],
};
