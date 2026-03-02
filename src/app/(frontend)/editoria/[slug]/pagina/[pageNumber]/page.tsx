import { notFound } from "next/navigation";

import { createMetadata } from "@/utilities/create-metadata";

import { fetchCategoryBySlug } from "@/collections/Categories/data";
import { fetchPaginatedPostsByCategory } from "@/collections/Posts/data";
import { Pagination } from "@/components/Pagination";
import { PaginationRange } from "@/components/PostRange";
import { PostArchive } from "@/components/PostsArchive";
import Head from "next/head";

type PageArgs = {
  params: Promise<{
    slug: string;
    pageNumber: string;
  }>;
};

export async function generateMetadata({ params }: PageArgs) {
  const { pageNumber } = await params;

  return createMetadata({
    path: `/blog/pagina/${pageNumber}`,
    title: `Blog (Página ${pageNumber})`,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  });
}

export default async function Page({ params: paramsPromise }: PageArgs) {
  const { slug, pageNumber } = await paramsPromise;

  const sanitizedPageNumber = Number(pageNumber);

  const category = await fetchCategoryBySlug(slug);
  const posts = await fetchPaginatedPostsByCategory(category.id, sanitizedPageNumber);

  if (!Number.isInteger(sanitizedPageNumber) || !posts) {
    notFound();
  }

  return (
    <>
      <Head>
        {posts.page && posts.page > 1 && <link rel="prev" href={`${process.env.SITE_URL}/editoria/${slug}/pagina/${posts.page - 1}`} />}
        {posts.page && posts.totalPages > 1 && <link rel="next" href={`${process.env.SITE_URL}/editoria/${slug}/pagina/${posts.page + 1}`} />}
      </Head>

      <main>
        <section className="py-24">
          <div className="container space-y-10">
            <h1 className="text-center text-4xl font-bold">Posts</h1>
            <PaginationRange currentPage={posts.page || 1} totalPages={posts.totalPages} totalDocs={posts.totalDocs} />
            <PostArchive posts={posts.docs} />
            <Pagination page={posts.page} totalPages={posts.totalPages} path={`/editoria/${slug}`} />
          </div>
        </section>
      </main>
    </>
  );
}
