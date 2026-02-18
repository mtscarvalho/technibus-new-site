import { MetaDescriptionField, MetaTitleField, PreviewField } from "@payloadcms/plugin-seo/fields";
import { GlobalConfig } from "payload";

export const PrivacyPolicy: GlobalConfig = {
  slug: "privacyPolicy",
  label: "Política de privacidade",
  access: {
    read: () => true,
  },
  admin: {
    group: "Páginas",
  },
  fields: [
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
              localized: true,
              required: true,
            },
            {
              name: "description",
              label: "Descrição",
              type: "textarea",
              localized: true,
              required: true,
            },
            {
              name: "content",
              label: "Conteúdo",
              type: "richText",
              localized: true,
            },
          ],
        },
        {
          label: "SEO",
          name: "meta",
          fields: [
            MetaTitleField({
              hasGenerateFn: false,
              overrides: {
                label: "Título",
                required: true,
              },
            }),
            MetaDescriptionField({
              hasGenerateFn: false,
              overrides: {
                label: "Meta descrição",
                required: true,
              },
            }),
            PreviewField({
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
