import { FieldHook } from "payload";

import { slugify } from "@/utilities/slugify";

export function formatSlug(): FieldHook {
  return ({ data, originalDoc }) => {
    if (data?.title || data?.name) {
      return slugify(data.slug) || slugify(data.title) || slugify(data.name);
    }

    return "";
  };
}
