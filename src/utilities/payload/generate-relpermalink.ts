import { FieldHook } from "payload";

import { slugify } from "@/utilities/slugify";

export function generateRelPeramlinkWithSlug(path: string): FieldHook {
  return ({ data, originalDoc }) => {
    const slug = data?.slug || originalDoc?.slug;
    if (slug) {
      return `${path}/${slugify(slug)}`;
    }
    return originalDoc?.relPermalink;
  };
}

export function generateRelPeramlinkWithDate(): FieldHook {
  return ({ data, originalDoc }) => {
    const slug = data?.slug || originalDoc?.slug;
    const publishedDate = data?.publishedDate || originalDoc?.publishedDate;

    if (!slug || !publishedDate) {
      return originalDoc?.relPermalink;
    }

    const date = new Date(publishedDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `/${year}/${month}/${day}/${slugify(slug)}`;
  };
}
