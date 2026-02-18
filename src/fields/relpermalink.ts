import { generateRelPeramlink } from "@/utilities/payload/generate-relpermalink";
import { Field } from "payload";

export const relPermalinkField = (path: string): Field => ({
  name: "relPermalink",
  label: "Caminho da página",
  type: "text",
  admin: {
    readOnly: true,
    position: "sidebar",
  },
  required: true,
  defaultValue: path,
  hooks: {
    beforeChange: [generateRelPeramlink(path)],
  },
});
