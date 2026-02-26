import { draftMode } from "next/headers";

import config from "@payload-config";
import { getPayload, PaginatedDocs } from "payload";

import { Post } from "@/payload-types";

const payload = await getPayload({ config });

export const fetchPostBySlug = async (slug: string): Promise<Post> => {
  const { isEnabled: draft } = await draftMode();
  const data = await payload.find({
    collection: "posts",
    depth: 1,
    draft,
    limit: 1,
    where: {
      and: [{ slug: { equals: slug } }, ...(draft ? [] : [{ _status: { equals: "published" } }])],
    },
  });

  return data.docs[0];
};

export const fetchPaginatedPosts = async (page: number = 1): Promise<PaginatedDocs<Post>> => {
  const { isEnabled: draft } = await draftMode();
  const data = await payload.find({
    collection: "posts",
    depth: 1,
    draft,
    limit: 12,
    page: page,
    where: {
      and: [...(draft ? [] : [{ _status: { equals: "published" } }])],
    },
  });

  return data;
};

export const fetchAllPosts = async (): Promise<Post[]> => {
  const { isEnabled: draft } = await draftMode();
  const data = await payload.find({
    collection: "posts",
    depth: 1,
    draft,
    limit: 0,
    where: {
      and: [...(draft ? [] : [{ _status: { equals: "published" } }])],
    },
  });

  return data.docs;
};
