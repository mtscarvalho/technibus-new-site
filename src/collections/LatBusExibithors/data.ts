import { draftMode } from "next/headers";

import config from "@payload-config";
import { getPayload, PaginatedDocs } from "payload";

import { LatBusExibithor } from "@/payload-types";

const payload = await getPayload({ config });

export const fetchExibithors = async (where?: any): Promise<PaginatedDocs<LatBusExibithor>> => {
  const { isEnabled: draft } = await draftMode();

  const data = await payload.find({
    collection: "latBusExibithors",
    depth: 1,
    draft,
    limit: 0,
    where: {
      and: [...(where ? [where] : []), ...(draft ? [] : [{ _status: { equals: "published" } }])],
    },
  });

  return data;
};
