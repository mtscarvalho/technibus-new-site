import { deepMerge } from "@/utilities/deep-merge";
import type { Field, GroupField } from "payload";

type ButtonType = (options?: { disableLabel?: boolean; overrides?: Partial<GroupField> }) => Field;

export const buttonField: ButtonType = ({ disableLabel = false, overrides = {} } = {}) => {
  const buttonResult: GroupField = {
    interfaceName: "ButtonField",
    name: "button",
    label: "Botão",
    type: "group",
    admin: {
      hideGutter: true,
      style: { border: "none", paddingTop: "0" },
    },
    fields: [
      {
        type: "row",
        fields: [
          {
            name: "type",
            label: "Tipo",
            type: "radio",
            admin: {
              layout: "horizontal",
              width: "50%",
            },
            defaultValue: "reference",
            options: [
              {
                label: "Link interno",
                value: "reference",
              },
              {
                label: "URL personalizada",
                value: "custom",
              },
            ],
          },
          {
            name: "newTab",
            type: "checkbox",
            admin: {
              style: {
                alignSelf: "flex-end",
              },
              width: "50%",
            },
            label: "Abrir em uma nova guia",
          },
        ],
      },
    ],
  };

  const buttonTypes: Field[] = [
    {
      name: "reference",
      type: "relationship",
      admin: {
        condition: (_, siblingData) => siblingData?.type === "reference",
      },
      label: "Documento para vincular",
      relationTo: ["posts", "categories"],
      required: true,
      filterOptions: {
        title: { not_equals: null },
      },
    },
    {
      name: "url",
      type: "text",
      admin: {
        condition: (_, siblingData) => siblingData?.type === "custom",
        placeholder: "https://technibus.com.br/",
      },
      label: "URL",
      required: true,
    },
  ];

  if (!disableLabel) {
    buttonTypes.map((buttonType) => ({
      ...buttonType,
      admin: {
        ...buttonType.admin,
        width: "50%",
      },
    }));

    buttonResult.fields.push({
      type: "row",
      fields: [
        ...buttonTypes,
        {
          name: "label",
          label: "Rótulo",
          type: "text",
          admin: {
            width: "50%",
            placeholder: "Saiba mais",
          },
          required: true,
        },
      ],
    });
  } else {
    buttonResult.fields = [...buttonResult.fields, ...buttonTypes];
  }

  return deepMerge(buttonResult, overrides);
};
