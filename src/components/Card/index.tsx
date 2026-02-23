import Link from "next/link";

import { Media } from "@/payload-types";
import { tv, type VariantProps } from "tailwind-variants";

import { PayloadImage } from "@/components/Payload/Image";

const card = tv({
  slots: {
    root: "group block space-y-3 rounded-lg p-3 transition-all duration-300 hover:bg-primary hover:shadow-lg",
    image: "mb-4 rounded",
    meta: "text-regal-blue-950 text-xs tracking-wider uppercase",
    title: "text-brand-primary font-medium text-balance",
    description: "text-secondary text-sm",
  },
  variants: {
    size: {
      sm: { title: "text-base" },
      lg: { title: "text-2xl" },
    },
    withImage: {
      true: {},
      false: {},
    },
  },
  defaultVariants: {
    size: "sm",
    withImage: true,
  },
});

type CardVariants = VariantProps<typeof card>;

type CardProps = {
  category: string; // required
  title: string;
  description?: string;
  image?: Media;
  url: string;
} & CardVariants;

export function Card({ category, title, description, image, url, size }: CardProps) {
  const withImage = Boolean(image);
  const slot = card({ size, withImage });

  return (
    <Link href={url} className={slot.root()}>
      {image && <PayloadImage className={slot.image()} image={image} />}
      <p className={slot.meta()}>{category}</p>
      <h2 className={slot.title()}>{title}</h2>
      {description && <p className={slot.description()}>{description}</p>}
    </Link>
  );
}
