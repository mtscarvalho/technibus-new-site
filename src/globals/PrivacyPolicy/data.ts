import { draftMode } from "next/headers";
import { cache } from "react";

import config from "@payload-config";
import { getPayload } from "payload";

import type { PrivacyPolicy } from "@/payload-types";

const payload = await getPayload({ config });

export const fetchPrivacyPolicy = cache(async (): Promise<PrivacyPolicy> => {
  const { isEnabled: draft } = await draftMode();

  const data = await payload.findGlobal({
    slug: "privacyPolicy",
    depth: 1,
  });

  return data;
});
