import { FieldHook } from "payload";

import { slugify } from "@/utilities/slugify";

export function generateRelPeramlink(path: string): FieldHook {
  return ({ data, originalDoc }) => {
    const slug = data?.slug || originalDoc?.slug;
    if (slug) {
      return `${path}/${slugify(slug)}`;
    }
    return originalDoc?.relPermalink;
  };
}
