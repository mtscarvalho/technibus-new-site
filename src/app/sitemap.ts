import { fetchAllPosts } from "@/collections/Posts/data";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchAllPosts();

  // Páginas estáticas
  const sitemap: MetadataRoute.Sitemap = [
    {
      url: `${process.env.SITE_URL}`,
    },
    {
      url: `${process.env.SITE_URL}/politica-de-privacidade`,
    },
  ];

  // Posts
  posts.forEach((service) => {
    sitemap.push({
      url: `${process.env.SITE_URL}/${service.slug}`,
      lastModified: new Date(service.updatedAt),
    });
  });

  return sitemap;
}
