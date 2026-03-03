import { Field } from "payload";

export const phoneNumberField = (name: string, label: string): Field => ({
  name: name,
  label: label,
  type: "text",
  minLength: 14,
  maxLength: 15,
  admin: {
    components: {
      Field: "@/fields/phoneNumber/component",
    },
  },
});
