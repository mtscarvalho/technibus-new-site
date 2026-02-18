import { draftMode } from "next/headers";

import config from "@payload-config";
import { getPayload } from "payload";

import { Faq } from "@/payload-types";

const payload = await getPayload({ config });

export const fetchAllFaqs = async (): Promise<Faq[]> => {
  const { isEnabled: draft } = await draftMode();
  const data = await payload.find({
    collection: "faq",
    draft,
    limit: 0,
    where: {
      and: [...(draft ? [] : [{ _status: { equals: "published" } }])],
    },
  });

  return data.docs;
};

export const fetchGeneralFaqs = async (): Promise<Faq[]> => {
  const { isEnabled: draft } = await draftMode();
  const data = await payload.find({
    collection: "faq",
    draft,
    limit: 0,
    where: {
      and: [{ service: { exists: false } }, ...(draft ? [] : [{ _status: { equals: "published" } }])],
    },
  });

  return data.docs;
};

export const fetchFaqsByService = async (serviceId: number): Promise<Faq[]> => {
  const { isEnabled: draft } = await draftMode();
  const data = await payload.find({
    collection: "faq",
    draft,
    depth: 1,
    where: {
      and: [{ service: { equals: serviceId } }, ...(draft ? [] : [{ _status: { equals: "published" } }])],
    },
  });

  return data.docs;
};
