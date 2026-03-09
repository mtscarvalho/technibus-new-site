import { formatSlug } from "@/utilities/payload/format-slug";
import { Field } from "payload";

export const slugField = (): Field => ({
  name: "slug",
  label: "Slug",
  type: "text",
  unique: true,
  required: true,
  admin: {
    position: "sidebar",
    placeholder: "minha-publicacao",
    components: {
      Field: "@/components/Payload/SlugField",
    },
  },
  hooks: {
    beforeValidate: [formatSlug()],
  },
});
