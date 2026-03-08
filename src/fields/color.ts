import { deepMerge } from "@/utilities/deep-merge";
import type { Field } from "payload";

type ColorFieldProps = {
  name: string;
  label: string;
  overrides?: Partial<Field>;
};

export const color = ({ name, label, overrides }: ColorFieldProps): Field => {
  const base: Field = {
    name,
    label,
    type: "text",
    required: true,
    admin: {
      components: {
        Field: "@/components/Payload/ColorPicker",
      },
    },
  };

  return deepMerge(base, overrides || {});
};
