import { Post } from "@/payload-types";

export const articleSchema = (props: Post) => {
  const image = props.image && typeof props.image === "object" ? props.image.url : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: props.title,
    datePublished: new Date(props.publishedDate).toISOString(),
    dateModified: new Date(props.updatedAt).toISOString(),
    ...(image ? { image } : {}),
    author: {
      "@type": "Organization",
      name: process.env.SITE_TITLE,
      url: process.env.SITE_URL,
    },
  };
};
