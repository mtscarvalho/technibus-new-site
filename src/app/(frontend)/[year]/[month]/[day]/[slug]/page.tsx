import Link from "next/link";
import { notFound } from "next/navigation";

import { Category, Media, User } from "@/payload-types";
import { createMetadata } from "@/utilities/create-metadata";
import { generateMetaDescription } from "@/utilities/generate-meta-description";

import { fetchPostBySlug } from "@/collections/Posts/data";
import { Ads } from "@/components/Ads";
import { PayloadImage } from "@/components/Payload/Image";
import { RichText } from "@/components/RichText";
import { Sidebar } from "@/components/Sidebar";
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
    title: post.title,
    description: post.excerpt || generateMetaDescription(post.content),
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
      <article className="pt-4 pb-24">
        <div className="container space-y-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <p className="uppertitle">
                    {(post.category as Category[]).map((category, index) => {
                      const isLast = index === post.category.length - 1;

                      return (
                        <span key={category.id}>
                          <Link href={category.relPermalink}>{category.title}</Link>
                          {!isLast && ", "}
                        </span>
                      );
                    })}
                  </p>
                  <h1 className="text-primary text-4xl font-medium">{post.title}</h1>
                </div>
                {post.excerpt && <p className="text-secondary text-pretty">{post.excerpt}</p>}
              </div>
              <div className="flex flex-wrap justify-between gap-4">
                <p className="text-secondary">
                  Publicado em {new Date(post.publishedDate).toLocaleDateString("pt-BR")} por{" "}
                  <Link className="link" href={(post.author as User).relPermalink}>
                    {(post.author as User).name}
                  </Link>
                </p>
                <ul className="flex gap-4">
                  <li>
                    <Link
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(process.env.SITE_URL! + post.relPermalink)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedIn className="text-regal-blue-950 size-6" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(process.env.SITE_URL! + post.relPermalink)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="text-regal-blue-950 size-6" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`https://x.com/intent/tweet?url=${encodeURIComponent(process.env.SITE_URL! + post.relPermalink)}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <X className="text-regal-blue-950 size-6" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`https://www.threads.net/intent/post?text=${encodeURIComponent(post.title + " " + process.env.SITE_URL! + post.relPermalink)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Threads className="text-regal-blue-950 size-6" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " " + process.env.SITE_URL! + post.relPermalink)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsApp className="text-regal-blue-950 size-6" />
                    </Link>
                  </li>
                </ul>
              </div>
              {post.image && <PayloadImage className="border-secondary bg-secondary w-full rounded-md border" image={post.image as Media} />}
              <div className="grid gap-8 sm:grid-cols-2 lg:hidden">
                <Ads position="sidebar-top" />
                <Ads position="sidebar-middle" />
              </div>
              {post.content && <RichText data={post.content} />}
              <Ads className="lg:hidden" position="sidebar-bottom-premium" />
            </div>
            <Sidebar />
          </div>
        </div>
      </article>
    </main>
  );
}
