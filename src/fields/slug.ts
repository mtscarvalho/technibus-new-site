import { formatSlug } from "@/utilities/payload/format-slug";
import { Field } from "payload";

export const slugField = (): Field => ({
  name: "slug",
  type: "text",
  unique: true,
  admin: {
    position: "sidebar",
  },
  hooks: {
    beforeChange: [formatSlug()],
  },
});
