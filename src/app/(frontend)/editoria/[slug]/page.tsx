import Head from "next/head";

import { createMetadata } from "@/utilities/create-metadata";

import { fetchCategoryBySlug } from "@/collections/Categories/data";
import { fetchPaginatedPostsByCategory } from "@/collections/Posts/data";

import { Card } from "@/components/Card";
import { MostRead } from "@/components/MostRead";
import { Pagination } from "@/components/Pagination";
import { PaginationRange } from "@/components/PostRange";

type PageArgs = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageArgs) {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);

  return createMetadata({
    path: `/editoria/${slug}`,
    title: `Editoria: ${category.title}`,
    description: category.description || "",
  });
}

export default async function Page({ params }: PageArgs) {
  const { slug } = await params;

  const category = await fetchCategoryBySlug(slug);
  const posts = await fetchPaginatedPostsByCategory(category.id);

  return (
    <>
      <Head>
        {posts.page && posts.page > 1 && <link rel="prev" href={`${process.env.SITE_URL}/editoria/${slug}/pagina/${posts.page - 1}`} />}
        {posts.page && posts.totalPages > 1 && <link rel="next" href={`${process.env.SITE_URL}/editoria/${slug}/pagina/${posts.page + 1}`} />}
      </Head>

      <main>
        <section className="relative z-0 min-w-0 pt-6 pb-24 md:pt-10">
          <div className="container grid gap-10 lg:grid-cols-12">
            <div className="space-y-10 lg:col-span-9">
              <div className="space-y-6">
                <h2 className="text-brand-primary border-secondary subheading border-b pb-3 max-sm:text-center">{category.title}</h2>
                <PaginationRange currentPage={posts.page || 1} totalPages={posts.totalPages} totalDocs={posts.totalDocs} />
                <div className="grid auto-rows-min gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {posts.docs.map((post) => (
                    <Card {...post} key={post.id} size="sm" />
                  ))}
                </div>
              </div>
              <Pagination page={posts.page} totalPages={posts.totalPages} path={`/editoria/${slug}`} />
            </div>
            <div className="lg:col-span-3">
              <MostRead />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
