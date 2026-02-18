import { cache } from "react";

import config from "@payload-config";
import { getPayload } from "payload";

import { Social } from "@/payload-types";

const payload = await getPayload({ config });

export const fetchSocials = cache(async (): Promise<Social> => {
  const socials = await payload.findGlobal({ slug: "social" });
  return socials;
});
