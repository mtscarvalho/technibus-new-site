import { FieldHook } from "payload";

import { slugify } from "@/utilities/slugify";

export function formatSlug(): FieldHook {
  return ({ data, originalDoc }) => {
    if (data?.title) {
      return slugify(data.slug) || slugify(data.title);
    }
    return originalDoc?.slug;
  };
}
