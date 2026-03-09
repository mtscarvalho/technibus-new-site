import { Media, Post } from "@/payload-types";

export const articleSchema = (props: Post) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: props.title,
    datePublished: new Date(props.publishedDate),
    dateModified: new Date(props.updatedAt),
    image: (props.image as Media).url,
    author: {
      "@type": "Organization",
      name: process.env.SITE_TITLE,
      url: process.env.SITE_URL,
    },
  };
};
