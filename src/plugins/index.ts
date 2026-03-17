import { searchPlugin } from "@/collections/Search/config";
import { Category } from "@/payload-types";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { s3Storage } from "@payloadcms/storage-s3";
import { Plugin } from "payload";
import { PayloadPluginCloudflarePurge } from "payload-plugin-cloudflare-purge";

const plugins: Plugin[] = [
  seoPlugin({}),
  s3Storage({
    collections: {
      media: true,
    },
    bucket: process.env.CLOUDFLARE_R2_BUCKET!,
    config: {
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
      },
      region: "auto",
    },
  }),
  searchPlugin,
  // TODO: Testar posts agendados para ver se o cache esta sendo limpo normalmente
  PayloadPluginCloudflarePurge({
    enabled: process.env.NODE_ENV === "production",
    zoneId: process.env.CLOUDFLARE_ZONE_ID!,
    apiToken: process.env.CLOUDFLARE_API_TOKEN!,
    baseUrl: process.env.SITE_URL!,
    collections: ["posts"],
    showButtonPurgeEverything: true,
    purgeEverything: false,
    urlBuilder: async ({ doc, req, collectionSlug, baseUrl }) => {
      if (collectionSlug !== "posts") {
        return [];
      }

      const categoryUrls: Promise<string>[] = [];

      if (doc.category && Array.isArray(doc.category) && doc.category.length > 0) {
        for (const id of doc.category as Category[]) {
          categoryUrls.push(
            (async () => {
              const category = await req.payload.findByID({
                id: Number(id),
                collection: "categories",
                draft: false,
              });
              return `${baseUrl}${category.relPermalink}`;
            })(),
          );
        }
      }

      const resolvedCategoryUrls = await Promise.all(categoryUrls);
      return [`${baseUrl}${doc.relPermalink}`, `${baseUrl}/`, ...resolvedCategoryUrls];
    },
  }),
];

export default plugins;
