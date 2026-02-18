import Link from "next/link";

import { Media, Post } from "@/payload-types";

import { Button } from "@/components/Button";
import { PayloadImage } from "../Payload/Image";

export type PostCardProps = Partial<Post>;

export function PostCard({ relPermalink, image, meta, title }: PostCardProps) {
  return (
    <article>
      <div className="flex h-full flex-col gap-6">
        <div className="flex-1 space-y-4">
          <PayloadImage className="aspect-video h-auto w-auto rounded object-cover" image={image as Media} />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-sm">{meta?.description}</p>
          </div>
        </div>
        <div className="flex justify-start">
          <Button variant="outline" size="sm" asChild>
            <Link href={relPermalink!}>Leia mais</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
