import { Metadata } from "next";

type CreateMetadataProps = {
  path: string;
  title: string;
  description: string;
  prev?: string;
  next?: string;
  noIndex?: boolean;
};

export function createMetadata({ path, title, description, prev, next, noIndex = false }: CreateMetadataProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE!;
  const url = `${baseUrl}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      siteName: siteTitle,
      locale: "pt_BR",
      type: "website",
      title,
      description,
      url,
      images: [
        {
          url: `${baseUrl}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: siteTitle,
        },
      ],
    },
    other: {
      ...(prev ? { "link:prev": `${baseUrl}${prev}` } : {}),
      ...(next ? { "link:next": `${baseUrl}${next}` } : {}),
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
            nocache: true,
            googleBot: {
              index: false,
              follow: false,
              noimageindex: true,
            },
          },
        }
      : {}),
  };
}
