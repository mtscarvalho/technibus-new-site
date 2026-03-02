import { Field } from "payload";

import { deepMerge } from "@/utilities/deep-merge";
import { generateRelPeramlinkWithDate } from "@/utilities/payload/generate-relpermalink";

type relPermalinkFieldProps = {
  overrides?: Partial<Field>;
};

export const relPermalinkField = ({ overrides }: relPermalinkFieldProps = {}): Field => {
  const base: Field = {
    name: "relPermalink",
    label: "Caminho da página",
    type: "text",
    admin: {
      readOnly: true,
      position: "sidebar",
    },
    required: true,
    hooks: {
      beforeChange: [generateRelPeramlinkWithDate()],
    },
  };

  return deepMerge(base, overrides || {});
};
