import type { GlobalConfig } from "payload";

export const MainMenu: GlobalConfig = {
  slug: "menu",
  label: "Menu principal",
  admin: {
    group: "Navegação e estrutura",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "menu",
      label: "",
      type: "array",
      required: true,
      labels: { singular: "Item", plural: "Items" },
      fields: [
        {
          name: "type",
          type: "select",
          admin: {
            isClearable: true,
          },
          options: [
            { label: "Link", value: "link" },
            { label: "Submenu", value: "submenu" },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
              admin: {
                condition: (data, siblingData) => {
                  return siblingData.type === "link" || siblingData.type == "submenu";
                },
              },
            },
            {
              name: "link",
              type: "text",
              required: true,
              admin: {
                condition: (data, siblingData) => {
                  return siblingData.type === "link";
                },
              },
            },
          ],
        },
        {
          name: "submenu",
          type: "array",
          label: "Submenu",
          labels: { singular: "Subitem", plural: "Subitens" },
          required: true,
          admin: {
            condition: (data, siblingData) => {
              return siblingData.type === "submenu";
            },
          },
          fields: [
            {
              type: "row",
              fields: [
                { name: "label", type: "text", required: true },
                { name: "link", type: "text", required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};
