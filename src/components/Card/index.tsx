import { Category, Media, Post, Search } from "@/payload-types";
import { tv, type VariantProps } from "tailwind-variants";

import { PayloadImage } from "@/components/Payload/Image";
import Link from "next/link";

const card = tv({
  slots: {
    root: "group block h-full space-y-6 rounded-lg relative transition-all duration-300",
    image: "rounded aspect-[16/9] object-cover",
    meta: "text-brand-primary relative text-xs z-10 tracking-wider uppercase",
    title: "text-primary group-hover:text-brand-primary text-balance",
    description: "text-secondary line-clamp-3 text-sm",
  },
  variants: {
    size: {
      sm: { title: "text-base" },
      lg: { title: "text-2xl" },
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

type CardVariants = VariantProps<typeof card>;

type CardProps = {
  disable?: {
    image?: boolean;
    excerpt?: boolean;
  };
} & (Post | Search) &
  CardVariants;

export function Card({ category, title, excerpt, image, relPermalink, size, disable = { image: false, excerpt: false } }: CardProps) {
  const slot = card({ size });

  return (
    <article className={slot.root()}>
      {!disable?.image && (
        <div className="border-secondary bg-secondary relative aspect-[16/9] overflow-hidden rounded border">
          <PayloadImage className="absolute size-full object-cover transition-transform duration-300 group-hover:scale-105" image={image as Media} disableCaption />
        </div>
      )}
      <div className="space-y-4">
        <div className="space-y-2">
          <p className={slot.meta()}>
            {category?.length
              ? category.map((cat, index) => {
                  const c = cat as Category;
                  return (
                    <span key={c.id}>
                      <Link href={c.relPermalink}>{c.title}</Link>
                      {index < category.length - 1 && ", "}
                    </span>
                  );
                })
              : null}
          </p>
          <h2 className={slot.title()}>{title}</h2>
        </div>
        {!disable?.excerpt && <p className={slot.description()}>{excerpt}</p>}
      </div>
      <Link className="absolute inset-0 size-full rounded-lg" href={relPermalink}>
        <span className="sr-only">Ler matéria {title}</span>
      </Link>
    </article>
  );
}
