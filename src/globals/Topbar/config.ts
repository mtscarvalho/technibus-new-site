import { simpleRichTextField } from "@/fields/simple-rich-text";
import { GlobalConfig } from "payload";

export const Topbar: GlobalConfig = {
  slug: "topbar",
  label: "Barra superior",
  admin: {
    group: "Globais",
  },
  fields: [
    {
      name: "enable",
      label: "Habilitar",
      type: "checkbox",
    },
    {
      type: "group",
      label: "Conteúdo",
      fields: [
        {
          name: "countdownDate",
          label: "Data para contagem regressiva",
          type: "date",
          admin: {
            date: {
              pickerAppearance: "dayAndTime",
              displayFormat: "dd/MM/YYYY (h:mm:ss a)",
            },
            placeholder: "05/04/2026 (12:00:00 AM)",
          },
        },
        simpleRichTextField({
          overrides: {
            required: false,
          },
        }),
      ],
    },
  ],
};
