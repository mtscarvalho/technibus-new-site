import {
  BoldFeature,
  FixedToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  LinkFields,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
} from "@payloadcms/richtext-lexical";

import { deepMerge } from "@/utilities/deep-merge";
import { Field, TextFieldSingleValidation } from "payload";

type SimpleRichTextFieldProps = {
  name?: string;
  condition?: (data: unknown, siblingData: unknown) => boolean;
  overrides?: Partial<Field>;
};

export const simpleRichTextField = ({ name, condition, overrides }: SimpleRichTextFieldProps = {}): Field => {
  const base: Field = {
    name: name || "content",
    label: "Conteúdo",
    type: "richText",
    required: true,
    admin: condition ? { condition } : undefined,
    editor: lexicalEditor({
      features: () => [
        FixedToolbarFeature(),
        ParagraphFeature(),
        BoldFeature(),
        ItalicFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        LinkFeature({
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ("name" in field && field.name === "url") return false;
              return true;
            });

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: "url",
                type: "text",
                admin: {
                  condition: (_data, siblingData) => siblingData?.linkType !== "internal",
                },
                label: ({ t }) => t("fields:enterURL"),
                required: true,
                validate: ((value, options) => {
                  if ((options?.siblingData as LinkFields)?.linkType === "internal") {
                    return true;
                  }

                  return value ? true : "URL is required";
                }) as TextFieldSingleValidation,
              },
            ];
          },
        }),
      ],
    }),
  };

  return deepMerge(base, overrides || {});
};
