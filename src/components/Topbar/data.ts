import { cache } from "react";

import config from "@payload-config";
import { getPayload } from "payload";

import type { Topbar } from "@/payload-types";

const payload = await getPayload({ config });

export const fetchTopbar = cache(async (): Promise<Topbar> => {
  const data = await payload.findGlobal({
    slug: "topbar",
    depth: 1,
  });

  return data;
});
