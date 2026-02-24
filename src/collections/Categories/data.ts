import { draftMode } from "next/headers";

import config from "@payload-config";
import { getPayload } from "payload";

import { Category } from "@/payload-types";

const payload = await getPayload({ config });

export const fetchCategories = async (): Promise<Category[]> => {
  const { isEnabled: draft } = await draftMode();

  // Busca todas as categorias
  const { docs: categories } = await payload.find({
    collection: "categories",
    depth: 2,
    draft,
    limit: 0,
    where: {
      and: [...(draft ? [] : [{ _status: { equals: "published" } }])],
    },
  });

  // Filtra apenas as categorias que têm posts
  const filtered = categories.filter((category: Category) => {
    const posts = category?.posts?.docs ?? [];
    return posts.length > 0;
  });

  return filtered;
};

export const fetchCategoryBySlug = async (slug: string): Promise<Category> => {
  const { isEnabled: draft } = await draftMode();
  const data = await payload.find({
    collection: "categories",
    depth: 1,
    draft,
    limit: 1,
    where: {
      and: [{ slug: { equals: slug } }, ...(draft ? [] : [{ _status: { equals: "published" } }])],
    },
  });

  return data.docs[0];
};
