import Link from "next/link";
import { notFound } from "next/navigation";

import { createMetadata } from "@/utilities/create-metadata";

import { fetchPostBySlug } from "@/collections/Posts/data";
import { RichText } from "@/components/RichText";
import { Facebook, LinkedIn, Threads, WhatsApp, X } from "@/components/SocialIcon";

type PageArgs = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageArgs) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  return createMetadata({
    path: `/blog/${slug}`,
    title: post.meta?.title || process.env.SITE_URL!,
    description: post.meta?.description || "",
  });
}

export default async function Page({ params }: PageArgs) {
  const { slug } = await params;

  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main>
      <article className="pt-10 pb-24">
        <div className="container space-y-16">
          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-primary text-4xl font-medium">{post.title}</h1>
            <p className="text-primary">Publicado em {new Date(post.publishedDate).toLocaleDateString("pt-BR")}</p>
          </div>
          <div className="grid gap-x-8 gap-y-16 lg:grid-cols-8">
            <div className="flex flex-col items-center gap-6 lg:col-span-2">
              <p className="text-overline text-primary">Compartilhar</p>
              <ul className="flex gap-4 lg:flex-col">
                <li>
                  <Link href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(!post.permalink)}`} target="_blank" rel="noopener noreferrer">
                    <LinkedIn className="size-6" />
                  </Link>
                </li>
                <li>
                  <Link href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(!post.permalink)}`} target="_blank" rel="noopener noreferrer">
                    <Facebook className="size-6" />
                  </Link>
                </li>
                <li>
                  <Link href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(!post.permalink)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer">
                    <X className="size-6" />
                  </Link>
                </li>
                <li>
                  <Link href={`https://www.threads.net/intent/post?text=${encodeURIComponent(post.title + " " + !post.permalink)}`} target="_blank" rel="noopener noreferrer">
                    <Threads className="size-6" />
                  </Link>
                </li>
                <li>
                  <Link href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " " + !post.permalink)}`} target="_blank" rel="noopener noreferrer">
                    <WhatsApp className="size-6" />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="prose max-w-full lg:col-span-6">{post.content && <RichText data={post.content} />}</div>
          </div>
        </div>
      </article>
    </main>
  );
}
