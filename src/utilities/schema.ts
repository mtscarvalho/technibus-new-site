import { Faq, Media, Post } from "@/payload-types";
import { richTextToPlainText } from "@/utilities/richtext-to-plaintext";

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

export const organizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://tecnologia.milcopias.com.br/#localbusiness",
    url: process.env.SITE_URL,
    logo: `${process.env.SITE_URL}/schema.png`,
    image: `${process.env.SITE_URL}/opengraph-image.png`,
    name: process.env.SITE_TITLE,
    description: "",
    email: "",
    telephone: "+55 (15) 998765-4321",
    address: {
      "@type": "PostalAddress",
      streetAddress: "",
      addressLocality: "",
      addressCountry: "BR",
      addressRegion: "",
      postalCode: "",
    },
    sameAs: ["", "", ""],
  };
};

export const faqSchema = (questions: Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: questions.map(({ title, content }) => ({
    "@type": "Question",
    name: title,
    acceptedAnswer: {
      "@type": "Answer",
      text: richTextToPlainText(content),
    },
  })),
});
