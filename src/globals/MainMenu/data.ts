import { cache } from "react";

import config from "@payload-config";
import { getPayload } from "payload";

import { Menu } from "@/payload-types";

const payload = await getPayload({ config });

export const fetchMenu = cache(async (): Promise<Menu> => {
  const menu = await payload.findGlobal({ slug: "menu" });
  return menu;
});
